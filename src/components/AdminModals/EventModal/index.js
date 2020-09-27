import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import EventFormFields from "./eventFormFields.js";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class EventModal extends Component {
  state = {
    showLoadingModal: false
  };

  componentWillUnmount = () => this.setState({ showLoadingModal: false });

  // On Change Methods

  onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

  onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

  renderModalTitle = () => {
    return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Event</h1>;
  };

  onSubmitEventInfo = async eventInfo => {
    if (this.props.isInEditMode) {
      const { actionCreators } = AdminDuck;
      const { updateExistingEvent } = actionCreators;
      const res = await this.props.dispatch(updateExistingEvent(eventInfo));
      console.log(res);
      this.props.onUpdateAfterEventSaved(res);
    } else {
      const { actionCreators } = AdminDuck;
      const { createNewEvent } = actionCreators;
      const res = await this.props.dispatch(createNewEvent(eventInfo));
      this.props.onUpdateAfterEventCreated(res);
    }
  };

  onArchiveApparel = async () => {
    const { actionCreators } = AdminDuck;
    const { removeExistingApparel } = actionCreators;
    const res = await this.props.dispatch(
      removeExistingApparel(this.props.eventInfo)
    );
    this.props.onUpdateAfterApparelArchived(res);
  };

  // Render methods
  renderArchiveItemButton = () => {
    return (
      <button
        className={ModalStyle.archiveButton}
        name="Archive Item"
        onClick={() => {
          this.onShowConfirmArchiveModal();
        }}
        type="submit"
      >
        Archive
      </button>
    );
  };

  render() {
    const { isInEditMode, eventInfo } = this.props;
    const { showConfirmArchiveModal } = this.state;
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Create or edit item modal"
        modalBoxClassname={ModalStyle.largeCenterModalBox}
        contentContainerClassname={ModalStyle.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        {showConfirmArchiveModal && (
          <ConfirmArchiveModal
            name={eventInfo.name}
            onArchive={() => this.onArchiveApparel()}
            onCloseModal={this.onHideConfirmArchiveModal}
          />
        )}
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        <EventFormFields
          isInEditMode={isInEditMode}
          onSubmit={this.onSubmitEventInfo}
          eventInfo={this.props.eventInfo}
        />
        {isInEditMode && this.renderArchiveItemButton()}
      </CenterModal>
    );
  }
}

EventModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  eventInfo: PropTypes.object,
  apparelID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterApparelArchived: PropTypes.func,
  onUpdateAfterApparelCreated: PropTypes.func,
  onUpdateAfterApparelSaved: PropTypes.func
};

EventModal.defaultProps = {
  isInEditMode: false
};

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isMutating: state[duckName].events.isMutating
  };
};

export default connect(mapStateToProps)(EventModal);
