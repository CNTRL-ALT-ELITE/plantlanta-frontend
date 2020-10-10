import React, { Component } from "react";

import Style from "./style.module.scss";

import * as immutable from "object-path-immutable";

import { Button } from "fields";

import { CloseIcon } from "assets/Icons";

import CheckoutDuck from "store/ducks/Checkout.duck";

import ReactModal from "react-modal";

import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";

import { ClipLoader } from "react-spinners";

import { connect } from "react-redux";

const cardStyle = {
  style: {
    base: {
      color: "black",
      // fontFamily: "Baskerville",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#919496"
      }
    },
    borderBottom: "2px solid black",
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

class PaymentInputForm extends Component {
  state = {
    name: "",
    email: "",
    clientSecret: "",
    errorMessage: "",
    isLoading: false,
    confirmingPayment: false
  };

  onDetermineBtnStatus = () => {
    if (this.state.isLoading || this.state.name === "") {
      return "inactive";
    } else {
      return "active";
    }
  };

  onChangeFieldValue = (fieldName, fieldValue) => {
    this.setState({
      [fieldName]: fieldValue
    });
  };

  onSubmitPaymentInfo = async event => {
    event.preventDefault();

    const {
      createDonationPaymentIntent,
      onDonationSuccess
    } = CheckoutDuck.actionCreators;

    this.setState({
      confirmingPayment: true
    });

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const paymentIntentClientSecret = await this.props.dispatch(
      createDonationPaymentIntent(this.props.donateAmount)
    );

    if (paymentIntentClientSecret === "") {
      this.props.hideSignUpModal();
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntentClientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: this.state.name,
          email: this.state.email
        }
      }
    });

    console.log(result);
    const { paymentIntent } = result;

    if (paymentIntent.status === "succeeded") {
      console.log("Calling Payment Success");

      this.props.dispatch(
        onDonationSuccess(
          this.state.name,
          this.state.email,
          this.props.donateAmount,
          paymentIntent.id
        )
      );

      this.setState({
        confirmingPayment: false
      });

      this.props.onDonationsSuccessful();
    }

    return;
  };

  render() {
    const { stripe } = this.props;
    console.log(stripe);

    const { name, email, errorMessage } = this.state;

    // if (errorMessage) {
    //   return <div>Something Went Wrong</div>
    // }

    return (
      <ReactModal
        isOpen={true}
        // onAfterOpen={}
        // onRequestClose={}
        // style={}
        className={Style.Modal}
        overlayClassName={Style.Overlay}
        contentLabel="Example Modal"
      >
        <button
          className={Style.close}
          onClick={() => this.props.hideSignUpModal()}
        >
          <CloseIcon />
        </button>
        <div className={Style.formContainer}>
          <h1 className={Style.title}> Payment Info</h1>
          <form
            className={Style.form}
            onSubmit={e => this.onSubmitPaymentInfo(e)}
          >
            <br />
            <br />
            <input
              className={Style.formInput}
              placeholder={"Cardholder Name"}
              type="name"
              name="name"
              value={name}
              onChange={e =>
                this.onChangeFieldValue(e.target.name, e.target.value)
              }
            />
            <br />
            <br />
            <input
              className={Style.formInput}
              placeholder={"Cardholder Email"}
              type="email"
              name="email"
              value={email}
              onChange={e =>
                this.onChangeFieldValue(e.target.name, e.target.value)
              }
            />
            <br />
            <br />
            <div
              style={{
                borderBottom: "2px solid #21c432",
                paddingBottom: "10px"
              }}
            >
              <CardElement id="card-element" options={cardStyle} />
            </div>
            <br />
            <div className={Style.errorMessage}>{this.state.errorMessage}</div>
            <br />

            {!this.state.confirmingPayment ? (
              <div className={Style.buttonsContainer}>
                <Button
                  className={Style.submitButton}
                  name="submit"
                  status={this.onDetermineBtnStatus()}
                >
                  Pay ${this.props.donateAmount}
                </Button>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",

                  alignItems: "center"
                }}
              >
                <ClipLoader width={"30px"} color={"#fff"} />
                <div>Confirming payment...</div>
              </div>
            )}
          </form>
        </div>
      </ReactModal>
    );
  }
}

const NewPaymentInput = props => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <PaymentInputForm elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

export default connect()(NewPaymentInput);
