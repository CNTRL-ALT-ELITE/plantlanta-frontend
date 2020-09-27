import React, { Component } from "react";
import { Button, CenterModal, TextInput } from "../../fields";

import Style from "./style.module.scss";

import AdminDuck from "store/ducks/Admin.duck";
import AdminUIDuck from "store/ducks/AdminUI.duck";

import { connect } from "react-redux";

import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

import AdminNavBar from "components/AdminNavBar";
import AdminPageContainer from "./components/AdminPageContainer";

import AdminView from "./components/AdminView";

import { ShowConfirmNotif } from "functions";

const mapNavBarIDs = {
  events: <AdminView.Events />,
  shop: <AdminView.Shop />,
  mailingList: <AdminView.MailingList />
};

class AdminPage extends Component {
  confirmNotif = null;

  componentDidMount() {
    // Fetch everything over here
    Promise.all([this.fetchAllEvents()]);
  }

  state = {
    signedIn: false,
    password: "",
    signInFailed: false
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
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
    }
  };

  renderPageContent = () => {
    const { activeNavbarItemId } = this.props;
    return mapNavBarIDs[activeNavbarItemId];
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
    const { password } = this.state;

    const buttonStatus = password.length > 0 ? "active" : "inactive";
    console.log(buttonStatus);
    return buttonStatus;
  };

  onSubmitAdminPassword = async () => {
    const { password } = this.state;
    const { adminSignIn } = AdminDuck.actionCreators;
    const { success } = await this.props.dispatch(adminSignIn(password));
    if (success) {
      this.setState({
        signedIn: true
      });
    } else {
      this.setState({
        signInFailed: true
      });
    }
  };

  // signInModal = (

  // );

  render() {
    console.log(this.state);
    return (
      <div style={{ height: "100vh" }}>
        <div className={Style.container}>
          <AdminNavBar />
          <AdminPageContainer>{this.renderPageContent()}</AdminPageContainer>
        </div>
        {!this.state.signedIn && (
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
              <TextInput
                type="password"
                // className={Style.signUpInput}
                onChange={value =>
                  this.onChangeTextInputValue("password", value)
                }
                style={{
                  background: "#EEEEEE",
                  fontSize: "12px",
                  height: "40px",
                  width: "300px",
                  border: "1px solid #111",
                  padding: "10px"
                }}
              />
              <Button
                status={this.onDetermineButtonStatus()}
                className={Style.passwordButton}
                onClick={this.onSubmitAdminPassword}
              >
                Submit
              </Button>
              {this.state.signInFailed && (
                <p style={{ color: "red" }}>Incorrect password</p>
              )}
            </div>
          </CenterModal>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSigningIn: state[AdminDuck.duckName].isSigningIn,
    activeNavbarItemId: state[AdminUIDuck.duckName].activeNavbarItemId
  };
};

export default connect(mapStateToProps)(AdminPage);
