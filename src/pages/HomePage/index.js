import React, { Component } from "react";

import Style from "./style.module.scss";

import { Link } from "react-router-dom";

import MainNavBar from "../../components/MainNavBar";

import {
  VolunteerIcon,
  DonateIcon,
  SaveNatureIcon,
  SocialIcon,
  ShopIcon
} from "../../assets/Icons";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <MainNavBar />
        <div style={{ height: "100vh" }}>
          <div className={Style.pageContainer}>
            {/* <img
              src={
                "https://scontent.fbdq2-1.fna.fbcdn.net/v/t1.0-9/36725173_223265288296675_3410496760815026176_o.jpg?_nc_cat=105&_nc_sid=6e5ad9&_nc_ohc=ftq5YN4eJWQAX9zXxLX&_nc_ht=scontent.fbdq2-1.fna&oh=25eeeefa93a3bb9c4d1b7d36c4dc2b04&oe=5EBCA2C7"
              }
              style={{ width: "50%" }}
            /> */}
            <div className={Style.introContainer}>
              <h1 style={{ fontSize: "2.6rem" }}>We are Plantlanta</h1>
              <SaveNatureIcon />
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  lineHeight: "20px",
                  fontWeight: "600"
                }}
              >
                We're a nonprofit community organization working to create an
                educational platform that inspires, encourages, and motivates
                children & young adults in the Metro Atlanta area to promote
                food and environmental justice in our urban communities.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgb(245, 243, 242)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div
              style={{
                padding: "30px",
                width: "60%",
                marginTop: "30px",
                background: "#F5F3F2"
              }}
            >
              <h2 style={{ color: "#EE6536", fontSize: "32px" }}>About Us</h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={
                    "https://www.treesatlanta.org/wp-content/uploads/2019/10/UPS_054_-1024x684.jpg"
                  }
                  style={{ width: "300px", height: "200px" }}
                />
                <p
                  style={{
                    padding: "30px",
                    fontSize: "13px",
                    lineHeight: "20px",
                    fontWeight: "600"
                  }}
                >
                  Plantlanta is a social and educational platform whose mission
                  is to inspire, encourage, and motivate children and young
                  adults to promote food and environmental justice within our
                  urban communities. We do this by organizing major events and
                  social impact campaigns that combine pop culture and
                  sustainability.
                </p>
              </div>
            </div>
            <div
              style={{
                padding: "30px",
                width: "100%",
                background: "#1b2126",
                marginTop: "30px"
              }}
            >
              <div
                style={{
                  maxWidth: "1200px",
                  margin: "0 auto 100px",
                  padding: "0 30px"
                }}
              >
                <div style={{ padding: "6rem 0", textAlign: "center" }}>
                  <h2
                    style={{ color: "#fff", fontSize: "2.6rem", margin: "0" }}
                  >
                    Every tree matters
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      margin: "5rem auto 2rem",
                      maxWidth: "900px"
                    }}
                  >
                    <div className={Style.indivContainer}>
                      <DonateIcon />
                      <h3 style={{ fontSize: "1.25rem", margin: "10px 0" }}>
                        Donate
                      </h3>
                      <p className={Style.message}>
                        Every Donation matters to us. All funds will be used to
                        sponsor events and volunteer activities. Learn more
                        about how we spend donations.
                      </p>
                      <a
                        href="/donateNow"
                        style={{
                          color: "#3aafa9",
                          textDecoration: "underline"
                        }}
                      >
                        Donate now
                      </a>
                    </div>
                    <div className={Style.indivContainer}>
                      <VolunteerIcon />
                      <h3 style={{ fontSize: "1.25rem", margin: "10px 0" }}>
                        Volunteer
                      </h3>
                      <p className={Style.message}>
                        Discover volunteer opportunities and events. From
                        planting trees to concerts. Find something that
                        interests you.
                      </p>
                      <a
                        href="/volunteer"
                        style={{
                          color: "#3aafa9",
                          textDecoration: "underline"
                        }}
                      >
                        Find events
                      </a>
                    </div>
                    <div className={Style.indivContainer}>
                      <ShopIcon />
                      <h3 style={{ fontSize: "1.25rem", margin: "10px 0" }}>
                        Buy Merch
                      </h3>
                      <p className={Style.message}>
                        Buy Plantlanta merch. T-shirts, Hats, Mugs and other
                        cool stuff.
                      </p>
                      <a
                        href="/donateNow"
                        style={{
                          color: "#3aafa9",
                          textDecoration: "underline"
                        }}
                      >
                        Go to Shop
                      </a>
                    </div>
                    <div className={Style.indivContainer}>
                      <SocialIcon />
                      <h3 style={{ fontSize: "1.25rem", margin: "10px 0" }}>
                        Find us on Social media
                      </h3>
                      <p className={Style.message}>
                        Find us on Instagram and Facebook
                      </p>
                      <a
                        href="/donateNow"
                        style={{
                          color: "#3aafa9",
                          textDecoration: "underline"
                        }}
                      >
                        Visit Social
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
