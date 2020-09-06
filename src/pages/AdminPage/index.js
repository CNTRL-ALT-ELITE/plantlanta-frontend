import React, { Component } from "react";
import { CenterModal } from "../../fields";

import Style from "./style.module.scss";

import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

export default class AdminPage extends Component {
  state = {
    signedIn: false
  };

  signInModal = (
    <CenterModal
      closeModalButtonLabel=""
      contentLabel="Create or edit item modal"
      modalBoxClassname={Style.largeCenterModalBox}
      contentContainerClassname={Style.largeCenterModalContainer}
      shouldCloseOnOverlayClick={false}
      isOpen={this.state.signedIn}
      showCloseButton={false}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <h1>Enter Password</h1>
        <input
          type="password"
          // className={Style.signUpInput}
          style={{
            background: "#EEEEEE",
            fontSize: "12px",
            height: "40px",
            width: "300px",
            border: "1px solid #111",
            padding: "10px"
          }}
        />
        <button
          style={{
            backgroundColor: "#21C432",
            padding: "10px 20px",
            width: "200px",
            height: "40px",
            color: "white",
            borderRadius: "0px",
            marginTop: "25px"
          }}
        >
          Submit
        </button>
      </div>
    </CenterModal>
  );

  render() {
    console.log(this.state.signedIn);
    return (
      <div style={{ height: "100vh" }}>
        <MainNavBar />
        {!this.state.signedIn && this.signInModal}
      </div>
    );
  }
}
