import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfEvents } from "components/AdminComponents/Events";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from "react-spinners";
import { ShowConfirmNotif } from "functions";

class Events extends Component {
  confirmNotif = null;

  state = {
    showCreateEventModal: false
  };

  onHideCreateEventModal = () => this.setState({ showCreateEventModal: false });

  onShowCreateEventModal = () => this.setState({ showCreateEventModal: true });

  onUpdateAfterEventCreated = ({ created, message }) => {
    if (created) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showCreateEventModal: false }, () =>
        this.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showCreateEventModal: false });
    }
  };

  onRefreshAfterChanges = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllEvents } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllEvents());
    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
    }
  };

  //  Render Methods
  renderCreateModal = () => (
    <AdminModals.EventModal
      onCloseModal={this.onHideCreateEventModal}
      onUpdateAfterEventCreated={this.onUpdateAfterEventCreated}
    />
  );

  renderAllEvents = () => (
    <ListOfEvents
      events={this.props.events}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingEvents } = this.props;
    if (isFetchingEvents) {
      return (
        <div style={{ textAlign: "center" }}>
          <ClipLoader color={"#000000"} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showCreateEventModal && this.renderCreateModal()}
        {this.renderAllEvents()}
        <div className={Style.floatingButton}>
          <button onClick={this.onShowCreateEventModal}>+</button>
        </div>
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

export default connect(mapStateToProps)(Events);

Events.propTypes = {
  isFetchingEvents: PropTypes.bool,
  events: PropTypes.array
};
