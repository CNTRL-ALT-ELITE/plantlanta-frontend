import React, { Component } from "react";

import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

import Style from "./style.module.scss";

import AdminDuck from "store/ducks/Admin.duck";

import { connect } from "react-redux";
import moment from "moment";

const eventBackground = require("../../assets/Images/EventsBackgroundImage.png");
const plantlantaEvents01 = require("../../assets/Images/plantlantaEvents01.png");
const plantlantaEvents02 = require("../../assets/Images/plantlantaEvents02.png");
const plantlantaEvents03 = require("../../assets/Images/plantlantaEvents03.png");

class VolunteerPage extends Component {
  componentDidMount() {
    // Fetch everything over here
    Promise.all([this.fetchAllEvents()]);
  }

  fetchAllEvents = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllEvents } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllEvents());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "error"
      // });
    }
  };

  renderEvent = event => {
    const { name, description, eventDate, original_image_url } = event;
    return (
      <div
        style={{
          marginRight: "100px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <h4 style={{ color: "black" }}>{name}</h4>
        <p style={{ marginBottom: "15px", color: "black" }}>
          {moment(eventDate).format("LL")}{" "}
        </p>
        <img
          src={original_image_url}
          style={{ width: "250px", height: "200px", objectFit: "contain" }}
        />
        <p style={{ width: "250px", fontSize: "13px", color: "black" }}>
          {description}
        </p>
        <button
          style={{
            background: "#3AAFA9",
            width: "100px",
            height: "30px",
            marginTop: "30px"
          }}
        >
          Sign Up
        </button>
      </div>
    );
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageContainer}>
          <img
            src={eventBackground}
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
              Events and Volunteer Opportunities
            </h1>
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
              <h2 style={{ color: "#21C432", fontSize: "15px" }}>JOIN US!</h2>
              <h1 style={{ fontSize: "35px" }}>
                As we create a more sustainable Atlanta
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  marginBottom: "20px",
                  marginRight: "50px"
                }}
              >
                From concerts to community service initiatives, Plantlanta hosts
                a variety of events to help promote food and environmental
                justice in urban communities. Sign up for an upcoming event or
                view some of our past events.
              </p>
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
                  src={plantlantaEvents01}
                  alt="plantlanta01"
                  style={{
                    width: "45%",
                    maxHeight: "150px",
                    objectFit: "contain"
                  }}
                />
                <img
                  src={plantlantaEvents02}
                  alt="plantlanta02"
                  style={{
                    width: "45%",
                    objectFit: "contain",
                    maxHeight: "150px"
                  }}
                />
              </div>
              <img
                src={plantlantaEvents03}
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
              padding: "50px",
              width: "80%",
              marginTop: "30px",
              background: "#F8F8F8",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ color: "#21C432", fontSize: "15px" }}>
                UPCOMING EVENTS
              </h2>
              <h1 style={{ fontSize: "35px" }}>
                Sign up or buy tickets for upcoming events!
              </h1>
            </div>
            <div style={{ display: "flex", margin: "20px", padding: "1em" }}>
              {this.props.events.map(this.renderEvent)}
            </div>
          </div>
        </div>

        {/* <div style={{ height: "100vh", background: "rgb(27, 33, 38)" }}>
          <h1 style={{ color: "white", padding: "2em 1em", margin: "0" }}>
            Upcoming Events
          </h1>
          
        </div> */}
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isFetchingEvents: state[duckName].events.isFetching,
    events: state[duckName].events.data
  };
};

export default connect(mapStateToProps)(VolunteerPage);
