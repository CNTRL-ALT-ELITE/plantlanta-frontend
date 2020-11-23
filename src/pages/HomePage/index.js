import React, { Component } from "react";

import Style from "./style.module.scss";

import { Link } from "react-router-dom";

import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";
import REGEX from "constants/RegEx";

import { Button, TextInput } from "fields";

import UserSignupDuck from "store/ducks/UserSignup.duck";
import { connect } from "react-redux";

import { ShowConfirmNotif } from "functions";

const mainBackground = require("../../assets/Images/PlantlantaBackground.png");
const plantlanta01 = require("../../assets/Images/plantlanta01.png");
const plantlanta02 = require("../../assets/Images/plantlanta02.png");
const plantlanta03 = require("../../assets/Images/plantlanta03.png");
const plantlanta04 = require("../../assets/Images/plantlanta04.png");
const plantlanta05 = require("../../assets/Images/plantlanta05.png");
const plantlanta06 = require("../../assets/Images/plantlanta06.png");
const plantlanta07 = require("../../assets/Images/plantlanta07.png");

class HomePage extends Component {
  confirmNotif = null;

  state = { name: "", email: "", isSigningUp: false };

  onSubscribe = async e => {
    e.preventDefault();
    const { name, email } = this.state;
    console.log(name);
    console.log(email);
    this.setState(
      {
        isSigningUp: true
      },
      this.onDetermineButtonStatus
    );

    const { userSignup } = UserSignupDuck.actionCreators;
    const { success, error } = await this.props.dispatch(
      userSignup(name, email)
    );

    if (success) {
      // Show Notif
      this.confirmNotif = ShowConfirmNotif({
        message: "Thank you for subscribing",
        type: "success"
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: error,
        type: "error"
      });
    }

    this.setState(
      {
        isSigningUp: false,
        name: "",
        email: ""
      },
      this.onDetermineButtonStatus
    );
  };

  isEmailValid = email => {
    if (!email || !REGEX.EMAIL.test(email)) return false;

    return true;
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
    const { name, email, isSigningUp } = this.state;
    const buttonStatus =
      this.isEmailValid(email) && name.length > 0 && !isSigningUp
        ? "active"
        : "inactive";
    return buttonStatus;
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div>
          <div className={Style.pageContainer}>
            <img src={mainBackground} className={Style.backgroundImage} />
            <div className={Style.introContainerTitle}>
              <h1 className={Style.backgroundImageTitle}>Welcome To </h1>
              <h1 className={Style.backgroundImageTitle2}>Plantlanta!</h1>
            </div>
            <div className={Style.signUpContainer}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 className={Style.subscribeContainerTitle}>Subscribe</h1>
                <p className={Style.subscribeContainerTitle2}>
                  to our mailing list to stay updated on all things Plantlanta!
                </p>
              </div>
              <form className={Style.signUpForm} onSubmit={this.onSubscribe}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "20px"
                  }}
                >
                  <p className={Style.inputLabel}>Name</p>
                  <TextInput
                    type="text"
                    className={Style.signUpInput}
                    name="name"
                    style={{
                      background: "#EEEEEE",
                      fontSize: "12px",
                      height: "40px",
                      width: "150px",
                      border: "1px solid #111",
                      padding: "10px"
                    }}
                    value={this.state.name || ""}
                    onChange={value =>
                      this.onChangeTextInputValue("name", value)
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "20px"
                  }}
                >
                  <p className={Style.inputLabel}>Email</p>
                  <TextInput
                    type="email"
                    className={Style.signUpInput}
                    name="email"
                    onChange={value =>
                      this.onChangeTextInputValue("email", value)
                    }
                    value={this.state.email || ""}
                    style={{
                      background: "#EEEEEE",
                      fontSize: "12px",
                      height: "40px",
                      width: "150px",
                      border: "1px solid #111",
                      padding: "10px"
                    }}
                  />
                </div>
                <Button
                  className={Style.subscribeButton}
                  name="subscribe"
                  status={this.onDetermineButtonStatus()}
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className={Style.aboutPlantlanta}>
            <div className={Style.aboutContainer}>
              <div className={Style.halfContainer}>
                <h2 className={Style.titleGreen}>ABOUT US</h2>
                <h1 className={Style.titleLarge}>Our Mission</h1>
                <p className={Style.body}>
                  We're a nonprofit community organization working to create an
                  educational platform that inspires, encourages, and motivates
                  children & young adults in the Metro Atlanta area to promote
                  food and environmental justice in urban communities by
                  coordinating events, initiatives and social impact campaigns
                  that combine sustainability and pop culture.
                </p>
                <button
                  style={{
                    backgroundColor: "#21C432",
                    padding: "10px 20px",
                    maxWidth: "200px",
                    color: "white"
                  }}
                >
                  read more >
                </button>
              </div>

              <div className={Style.imageContainer}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                  }}
                >
                  <img
                    src={plantlanta01}
                    alt="plantlanta01"
                    style={{
                      width: "45%",
                      maxHeight: "150px",
                      objectFit: "contain"
                    }}
                  />
                  <img
                    src={plantlanta02}
                    alt="plantlanta02"
                    style={{
                      width: "45%",
                      objectFit: "contain",
                      maxHeight: "150px"
                    }}
                  />
                </div>
                <img
                  src={plantlanta03}
                  alt="plantlanta03"
                  style={{
                    maxWidth: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>
            </div>
            <div className={Style.navigateContainer}>
              <div className={Style.navigateSubContainer}>
                <div>
                  <div className={Style.navFlexContainer}>
                    <div className={Style.indivContainer}>
                      <div style={{ display: "flex" }}>
                        <img
                          src={plantlanta04}
                          alt="plantlanta04"
                          className={Style.navImage}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2 className={Style.titleGreen}>FIND</h2>
                          <h1 className={Style.navTitleLarge}>
                            Events & Opportunities
                          </h1>
                          <p className={Style.navBody}>
                            Discover events and volunteer opportunities near
                            you!
                          </p>
                        </div>
                        <a href="/volunteer">
                          <button
                            style={{
                              padding: "20px",
                              backgroundColor: "#21C432",
                              color: "white",
                              borderRadius: "0px",
                              height: "100%"
                            }}
                          >
                            >
                          </button>
                        </a>
                      </div>
                    </div>
                    <div className={Style.indivContainer}>
                      <div style={{ display: "flex" }}>
                        <img
                          src={plantlanta05}
                          alt="plantlanta05"
                          className={Style.navImage}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2 className={Style.titleGreen}>SUBSCRIBE</h2>
                          <h1 className={Style.navTitleLarge}>
                            To Our Email List
                          </h1>
                          <p className={Style.navBody}>
                            For updates on events and information about
                            Plantlanta
                          </p>
                        </div>
                        <a href="/volunteer">
                          <button
                            style={{
                              padding: "20px",
                              backgroundColor: "#21C432",
                              color: "white",
                              borderRadius: "0px",
                              height: "100%"
                            }}
                          >
                            >
                          </button>
                        </a>
                      </div>
                    </div>
                    <div className={Style.indivContainer}>
                      <div style={{ display: "flex" }}>
                        <img
                          src={plantlanta06}
                          alt="plantlanta06"
                          className={Style.navImage}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2 className={Style.titleGreen}>SHOP</h2>
                          <h1 className={Style.navTitleLarge}>
                            Merchandise & More
                          </h1>
                          <p className={Style.navBody}>
                            Don't miss out on the newest Plantlanta merchandise
                            !
                          </p>
                        </div>
                        <a href="/volunteer">
                          <button
                            style={{
                              padding: "20px",
                              backgroundColor: "#21C432",
                              color: "white",
                              borderRadius: "0px",
                              height: "100%"
                            }}
                          >
                            >
                          </button>
                        </a>
                      </div>
                    </div>
                    <div className={Style.indivContainer}>
                      <div style={{ display: "flex" }}>
                        <img
                          src={plantlanta07}
                          alt="plantlanta07"
                          className={Style.navImage}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2 className={Style.titleGreen}>DONATE</h2>
                          <h1 className={Style.navTitleLarge}>To Support Us</h1>
                          <p className={Style.navBody}>
                            Donations go a long way towards helping the
                            community
                          </p>
                        </div>
                        <a href="/volunteer">
                          <button
                            style={{
                              padding: "20px",
                              backgroundColor: "#21C432",
                              color: "white",
                              borderRadius: "0px",
                              height: "100%"
                            }}
                          >
                            >
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSigningUp: state[UserSignupDuck.duckName].isSigningUp
  };
};

export default connect(mapStateToProps)(HomePage);
