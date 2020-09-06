import React, { Component } from "react";
import Style from "./style.module.scss";
import { EmailIcon, PhoneIcon, LocationIcon } from "../../assets/Icons";

const facebookLogo = require("../../assets/Images/facebookLogo.png");
const twitterLogo = require("../../assets/Images/twitterLogo.png");
const instaLogo = require("../../assets/Images/instaLogo.png");

export default class MainFooter extends Component {
  render() {
    return (
      <div className={Style.mainFooter}>
        <div className={Style.sectionA}>
          <h1 style={{ color: "white", fontSize: "20px" }}>Follow Us</h1>
          <p style={{ color: "#B1B1B1", fontSize: "14px" }}>
            Stay updated on new events and share your Plantlanta experience with
            the Atlanta community!
          </p>
          <div className={Style.socialMediaButtons}>
            <button>
              <img
                src={facebookLogo}
                alt="facebookLogo"
                className={Style.socialMediaLogo}
              />
            </button>
            <button>
              <img
                src={twitterLogo}
                alt="twitterLogo"
                className={Style.socialMediaLogo}
              />
            </button>
            <button>
              <img
                src={instaLogo}
                alt="instaLogo"
                className={Style.socialMediaLogo}
              />
            </button>
          </div>
          <p style={{ color: "grey" }}>Copyright ©2020 All rights reserved</p>
        </div>
        <div className={Style.sectionA}>
          <h1 style={{ color: "white", fontSize: "20px" }}>Contact Info</h1>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={Style.contactIcon}>
              <EmailIcon />
              <h4 style={{ margin: "0px", color: "white", fontWeight: "400" }}>
                volunteer@iamplantlanta.com
              </h4>
            </div>
            <div className={Style.contactIcon}>
              <PhoneIcon />
              <h4 style={{ margin: "0px", color: "white", fontWeight: "400" }}>
                +0 320 422 4254
              </h4>
            </div>
            <div className={Style.contactIcon}>
              <LocationIcon />
              <h4 style={{ margin: "0px", color: "white", fontWeight: "400" }}>
                Atlanta, Georgia
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
