import React, { Component } from "react";
import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

import Style from "./style.module.scss";

import { Button, TextInput } from "fields";

import CheckoutDuck from "store/ducks/Checkout.duck";

import CheckoutModal from "./components/CheckoutModal";

const mainBackground = require("../../assets/Images/EventsBackgroundImage.png");

const donateOptions = {
  "2": {
    label: "$2",
    value: "2"
  },
  "5": {
    label: "$5",
    value: "5"
  },
  "10": {
    label: "$10",
    value: "10"
  },
  "20": {
    label: "$20",
    value: "20"
  }
};

export default class DonatePage extends Component {
  state = {
    donateAmount: "",
    checkout: false,
    error: "",
    donationComplete: false
  };

  onChangeTextInputValue = (id, value) => {
    this.setState(
      {
        [id]: value
      },
      this.onDetermineButtonStatus
    );
  };

  onDetermineButtonStatus = () => {
    const { donateAmount } = this.state;
    const buttonStatus = parseInt(donateAmount) ? "active" : "inactive";
    return buttonStatus;
  };

  renderDonateOptions = () => {
    return Object.keys(donateOptions).map(option => {
      return (
        <Button
          id={option}
          onClick={() => {
            this.setState({
              donateAmount: donateOptions[option].value
            });
          }}
          className={Style.donateOptionButton}
        >
          {donateOptions[option].label}
        </Button>
      );
    });
  };

  renderPaymentModal = () => {};

  onCheckout = e => {
    e.preventDefault();
    this.setState({
      checkout: true
    });
  };

  hideSignUpModal = (error = "") => {
    this.setState({
      checkout: false,
      error
    });
  };

  onDonationsSuccessful = () => {
    this.setState({
      checkout: false,
      donationComplete: true
    });
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div>
          <div className={Style.imgContainer}>
            <img src={mainBackground} className={Style.backgroundImage} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "absolute",
                width: "60%"
              }}
            >
              <h1 className={Style.backgroundImageTitle}>Donate Now</h1>
            </div>
          </div>
          <div className={Style.pageContainer}>
            <h1 className={Style.titleLarge}>Help Plantlanta by donating!</h1>
            <form
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "20px"
              }}
              onSubmit={this.onCheckout}
            >
              <h1 className={Style.titleLarge}>$</h1>
              <TextInput
                type="number"
                className={Style.signUpInput}
                name="donateAmount"
                style={{
                  background: "#EEEEEE",
                  fontSize: "12px",
                  height: "40px",
                  width: "150px",
                  border: "1px solid #111",
                  padding: "10px"
                }}
                value={this.state.donateAmount || ""}
                onChange={value =>
                  this.onChangeTextInputValue("donateAmount", value)
                }
              />
              <Button
                className={Style.donateButton}
                status={this.onDetermineButtonStatus()}
              >
                Donate{" "}
              </Button>
            </form>
            <div style={{ marginTop: "20px" }}>
              {this.renderDonateOptions()}
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <h2>{this.state.donationComplete && "Thank you for Donating!"}</h2>
        </div>
        <div>
          {this.state.checkout && (
            <CheckoutModal
              donateAmount={this.state.donateAmount}
              hideSignUpModal={this.hideSignUpModal}
              onDonationsSuccessful={this.onDonationsSuccessful}
            />
          )}
        </div>

        <MainFooter />
      </div>
    );
  }
}
