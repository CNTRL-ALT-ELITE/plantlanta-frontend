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
    const { success } = await this.props.dispatch(userSignup(name, email));

    if (success) {
      // Show Notif
      this.confirmNotif = ShowConfirmNotif({
        message: "Thank you for subscribing",
        type: "success"
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: "Something went wrong, try again",
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
            <img
              src={mainBackground}
              style={{
                objectFit: "contain",
                position: "relative",
                maxWidth: "100%"
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                position: "absolute",
                width: "60%"
              }}
            >
              <h1 style={{ fontSize: "2.6rem", color: "white", margin: "0px" }}>
                Welcome To{" "}
              </h1>
              <h1 style={{ fontSize: "5rem", color: "white", margin: "0px" }}>
                Plantlanta!
              </h1>
            </div>
            <div className={Style.signUpContainer}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h1
                  style={{
                    color: "#21C432",
                    fontSize: "20px",
                    margin: "0px"
                  }}
                >
                  Subscribe
                </h1>
                <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                  to our mailing list to stay updated on all things Plantlanta!
                </p>
              </div>
              <form
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "20px"
                }}
                onSubmit={this.onSubscribe}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "20px"
                  }}
                >
                  <p style={{ color: "#21C432", fontSize: "12px" }}>Name</p>
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
                  <p style={{ color: "#21C432", fontSize: "12px" }}>Email</p>
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

          <div
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div
              style={{
                padding: "50px",
                width: "80%",
                marginTop: "30px",
                background: "#F8F8F8",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "50%"
                }}
              >
                <h2 style={{ color: "#21C432", fontSize: "15px" }}>ABOUT US</h2>
                <h1 style={{ fontSize: "35px" }}>Our Mission</h1>
                <p
                  style={{
                    fontSize: "16px",
                    marginBottom: "20px",
                    marginRight: "50px"
                  }}
                >
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

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "50%"
                }}
              >
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
            <div
              style={{
                padding: "30px",
                width: "100%",
                marginTop: "30px"
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  margin: "0 auto 100px",
                  padding: "0 30px"
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap"

                      // maxWidth: "900px"
                    }}
                  >
                    <div className={Style.indivContainer}>
                      <div style={{ display: "flex" }}>
                        <img
                          src={plantlanta04}
                          alt="plantlanta04"
                          style={{ maxHeight: "200px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "18px",
                              color: "#21C432",
                              margin: "0px"
                            }}
                          >
                            FIND
                          </h2>
                          <h1
                            style={{
                              fontSize: "25px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
                            Events & Opportunities
                          </h1>
                          <p
                            style={{
                              fontSize: "15px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
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
                          style={{ maxHeight: "200px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "18px",
                              color: "#21C432",
                              margin: "0px"
                            }}
                          >
                            SUBSCRIBE
                          </h2>
                          <h1
                            style={{
                              fontSize: "25px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
                            To Our Email List
                          </h1>
                          <p
                            style={{
                              fontSize: "15px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
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
                          style={{ maxHeight: "200px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "18px",
                              color: "#21C432",
                              margin: "0px"
                            }}
                          >
                            SHOP
                          </h2>
                          <h1
                            style={{
                              fontSize: "25px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
                            Merchandise & More
                          </h1>
                          <p
                            style={{
                              fontSize: "15px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
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
                          style={{ maxHeight: "200px" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            marginLeft: "20px"
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "18px",
                              color: "#21C432",
                              margin: "0px"
                            }}
                          >
                            DONATE
                          </h2>
                          <h1
                            style={{
                              fontSize: "25px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
                            To Support Us
                          </h1>
                          <p
                            style={{
                              fontSize: "15px",
                              color: "black",
                              margin: "0px"
                            }}
                          >
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
