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

import { RegionDropdown } from "react-country-region-selector";

import cx from "classnames";

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
    page: 0,
    name: "",
    email: "",
    clientSecret: "",
    errorMessage: "",
    isLoading: false,
    confirmingPayment: false,
    address: {
      postal_code: "",
      city_locality: "",
      state_province: "",
      address1: "",
      address2: "",
      name: "",
      phone: ""
    },
    errorMessage: "",
    creatingNewAdress: false,
    shippingRateID: "",
    shipping_cents: 0,
    cartTotalCents: 0
  };

  componentDidMount() {
    console.log(this.props);
    const { cart } = this.props;

    let cartArray = [];
    Object.keys(cart).forEach(id => {
      cartArray.push({
        item: id,
        quantity: cart[id]
      });
    });

    this.setState({
      cart: cartArray
    });
  }

  onSubmitShippingForm = async e => {
    e.preventDefault();

    const { validateShippingAddress } = CheckoutDuck.actionCreators;

    console.log(this.state.address);

    const { success, response, message } = await this.props.dispatch(
      validateShippingAddress(this.state.address)
    );

    const { error, shippingRateID, shipping_cents, address } = response;

    console.log(response);

    if (success) {
      this.setState({
        address,
        shippingRateID,
        shipping_cents,
        page: 1
      });
    } else {
      this.props.closeModal(message);
    }
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

  onChangeAddressFieldValue = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    this.setState({
      address: immutable.set(this.state.address, fieldName, fieldValue)
    });
  };

  selectRegion(val) {
    this.setState({
      address: immutable.set(this.state.address, "state_province", val)
    });
  }

  renderShippingInfoPage = () => {
    const {
      country,
      name,
      address1,
      address2,
      city_locality,
      state_province,
      postal_code,
      phone
    } = this.state.address;

    return (
      <div className={Style.formContainer}>
        <h1 className={Style.title}> SHIPPING ADDRESS</h1>
        <form
          className={Style.form}
          onSubmit={e => this.onSubmitShippingForm(e)}
        >
          <br />
          <input
            className={Style.formInput}
            placeholder={"Full Legal Name"}
            type="text"
            name="name"
            value={name}
            onChange={e =>
              this.onChangeAddressFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <input
            className={Style.formInput}
            placeholder={"Street Address 1"}
            type="address"
            name="address1"
            value={address1}
            onChange={e =>
              this.onChangeAddressFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <input
            className={Style.formInput}
            placeholder={"Street Address 2"}
            type="address"
            name="address2"
            value={address2}
            onChange={e =>
              this.onChangeAddressFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <div className={Style.twoInputsContainer}>
            <div className={Style.halfWidthInput}>
              <input
                className={Style.formInput}
                placeholder={"City"}
                type="city"
                name="city_locality"
                value={city_locality}
                onChange={e =>
                  this.onChangeAddressFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
            <div className={Style.halfWidthInput}>
              <RegionDropdown
                placeholder={"State/Province"}
                blankOptionLabel="State"
                defaultOptionLabel="State"
                value={state_province}
                country={"United States"}
                onChange={val => this.selectRegion(val)}
                classes={cx(Style.inputSelector, Style.regionSelect)}
              />
            </div>
          </div>
          <br />
          <div className={Style.twoInputsContainer}>
            <div className={Style.halfWidthInput}>
              <input
                className={Style.formInput}
                placeholder={"Zip Code"}
                type="postal"
                name="postal_code"
                value={postal_code}
                onChange={e =>
                  this.onChangeAddressFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
          </div>
          <br />
          <input
            className={Style.formInput}
            placeholder={"Phone Number"}
            type="phone"
            name="phone"
            value={phone}
            onChange={e =>
              this.onChangeAddressFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <div className={Style.errorMessage}>{this.state.errorMessage}</div>
          <br />
          {!this.state.creatingNewAdress ? (
            <div className={Style.buttonsContainer}>
              <Button
                className={Style.submitButton}
                name="submit"
                status={this.onGetButtonStatus()}
              >
                Continue
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
              <div>Adding address...</div>
            </div>
          )}
        </form>
      </div>
    );
  };

  renderPaymentPage = () => {
    const { name, email, errorMessage } = this.state;
    console.log(this.state);
    return (
      <div className={Style.formContainer}>
        <h1 className={Style.title}> Payment Info</h1>
        <form
          className={Style.form}
          onSubmit={e => this.onSubmitPaymentInfo(e)}
        >
          <h3>Cart Total: {this.props.cartTotalCents / 100}</h3>
          <h3>Shipping Cost: {this.state.shipping_cents / 100}</h3>
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
    );
  };

  onGetButtonStatus = () => {
    const {
      name,
      address1,
      city_locality,
      state_province,
      postal_code,
      phone
    } = this.state.address;

    if (
      name !== "" &&
      address1 !== "" &&
      city_locality !== "" &&
      state_province !== "" &&
      postal_code !== "" &&
      phone !== ""
    ) {
      return "active";
    } else {
      return "inactive";
    }
  };

  onSubmitPaymentInfo = async event => {
    event.preventDefault();

    const {
      createOrderPaymentIntent,
      completeOrder
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
      createOrderPaymentIntent(
        this.props.cartTotalCents + this.state.shipping_cents
      )
    );

    console.log(paymentIntentClientSecret);

    if (paymentIntentClientSecret === "") {
      this.props.closeModal("Error Making Payment");
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

    const { cart } = this.props;

    let cartArray = [];
    Object.keys(cart).forEach(id => {
      cartArray.push({
        item: id,
        quantity: cart[id]
      });
    });

    console.log(cartArray);

    if (paymentIntent.status === "succeeded") {
      console.log("Calling Payment Success");

      this.props.dispatch(
        completeOrder(
          this.state.address,
          this.state.name,
          this.state.email,
          this.props.cartTotalCents,
          this.state.shipping_cents,
          this.state.shippingRateID,
          paymentIntent.id,
          cartArray
        )
      );

      this.setState({
        confirmingPayment: false
      });

      this.props.onOrderSuccessful();
    }

    return;
  };

  render() {
    const { stripe } = this.props;

    const { name, email, errorMessage } = this.state;

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
        <button className={Style.close} onClick={() => this.props.closeModal()}>
          <CloseIcon />
        </button>
        <React.Fragment>
          {this.state.page === 0
            ? this.renderShippingInfoPage()
            : this.renderPaymentPage()}
        </React.Fragment>
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
