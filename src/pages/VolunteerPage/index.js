import React, { Component } from "react";

import ReactModal from "react-modal";

import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

import Style from "./style.module.scss";

import AdminDuck from "store/ducks/Admin.duck";

import { connect } from "react-redux";
import moment from "moment";
import { CloseIcon } from "assets/Icons";

import { Button, TextInput } from "fields";
import REGEX from "constants/RegEx";

import EventDuck from "store/ducks/Event.duck";

import { ShowConfirmNotif } from "functions";

const eventBackground = require("../../assets/Images/EventsBackgroundImage.png");
const plantlantaEvents01 = require("../../assets/Images/plantlantaEvents01.png");
const plantlantaEvents02 = require("../../assets/Images/plantlantaEvents02.png");
const plantlantaEvents03 = require("../../assets/Images/plantlantaEvents03.png");

class VolunteerPage extends Component {
  confirmNotif = null;

  state = {
    name: "",
    email: "",
    event: "",
    isSigningUp: false,
    showSignUpModal: false
  };
  componentDidMount() {
    // Fetch everything over here
    Promise.all([this.fetchAllEvents()]);
  }

  isEmailValid = email => {
    if (!email || !REGEX.EMAIL.test(email)) return false;

    return true;
  };

  onSignup = async e => {
    e.preventDefault();
    const { name, email, event } = this.state;
    console.log(event);
    console.log(name);
    console.log(email);
    this.setState(
      {
        isSigningUp: true
      },
      this.onDetermineButtonStatus
    );

    const { eventSignup } = EventDuck.actionCreators;
    const { success } = await this.props.dispatch(
      eventSignup(event.id, name, email)
    );

    if (success) {
      // Show Notif
      this.confirmNotif = ShowConfirmNotif({
        message: "Thank you for Signing up",
        type: "success"
      });

      this.setState({
        name: "",
        email: "",
        event: "",
        isSigningUp: false,
        showSignUpModal: false
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: "Something went wrong, try again",
        type: "error"
      });
    }
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
    const { name, email } = this.state;
    const buttonStatus =
      this.isEmailValid(email) && name.length > 0 ? "active" : "inactive";
    return buttonStatus;
  };

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

  renderAllEvents = () => {
    console.log(this.props.events);
    if (this.props.events.length === 0) {
      return;
    }
    const filteredEvents = this.props.events.filter(
      event => new Date(event.eventDate) < new Date()
    );

    const sortedEvents = filteredEvents.sort(
      (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
    );

    return sortedEvents.length !== 0 ? (
      <div className={Style.gridWrapper}>
        {sortedEvents.map(this.renderEvent)}
      </div>
    ) : (
      <div className={Style.noEventsContainer}>No upcoming events</div>
    );
  };

  renderEvent = event => {
    const { name, description, eventDate, original_image_url } = event;
    return (
      <div className={Style.gridCell}>
        <h4 style={{ color: "black" }}>{name}</h4>
        <p style={{ marginBottom: "15px", color: "black" }}>
          {moment(eventDate).format("LL")}{" "}
        </p>
        <img src={original_image_url} className={Style.eventImg} />
        <p className={Style.eventText}>{description}</p>
        <button
          onClick={() => this.showSignUpModal(event)}
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

  showSignUpModal = event => {
    this.setState({
      event,
      showSignUpModal: true
    });
  };

  hideSignUpModal = () => {
    this.setState({
      name: "",
      email: "",
      event: "",
      showSignUpModal: false
    });
  };

  renderSignUpModal = () => {
    return this.state.showSignUpModal ? (
      <ReactModal
        isOpen={true}
        // onAfterOpen={}
        // onRequestClose={}
        // style={}
        className={Style.Modal}
        overlayClassName={Style.Overlay}
        contentLabel="Example Modal"
      >
        <button className={Style.close} onClick={() => this.hideSignUpModal()}>
          <CloseIcon />
        </button>
        <div className={Style.header}>
          <h2>Sign Up for {this.state.event.name}</h2>
        </div>
        <div className={Style.body}>
          <div className={Style.authContainer}>{this.signUpForm()}</div>
        </div>
      </ReactModal>
    ) : null;
  };

  signUpForm = () => {
    return (
      <form
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "20px"
        }}
        onSubmit={this.onSignup}
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
            onChange={value => this.onChangeTextInputValue("name", value)}
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
            onChange={value => this.onChangeTextInputValue("email", value)}
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
          name="signUp"
          status={this.onDetermineButtonStatus()}
        >
          Sign Up
        </Button>
      </form>
    );
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageContainer}>
          <img src={eventBackground} className={Style.backgroundImage} />
          <div className={Style.introContainerTitle}>
            <h1 className={Style.backgroundImageTitle}>
              Events and Volunteer Opportunities
            </h1>
          </div>
        </div>

        <div className={Style.eventPlantlanta}>
          <div className={Style.eventsContainer}>
            <div className={Style.halfContainer}>
              <h2 className={Style.titleGreen}>JOIN US!</h2>
              <h1 className={Style.titleLarge}>
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

            <div className={Style.imageContainer}>
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
              <h1 className={Style.titleLarge}>
                Sign up or buy tickets for upcoming events!
              </h1>
            </div>

            {this.renderAllEvents()}
          </div>
        </div>
        {this.renderSignUpModal()}

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
