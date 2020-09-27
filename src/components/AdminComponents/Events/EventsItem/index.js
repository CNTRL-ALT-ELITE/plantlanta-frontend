import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Icons
import { AddPhotoIcon, PencilIcon } from "assets/Icons";

// Components
import AdminModals from "components/AdminModals";

// Fields
import { ProductTemplate, Img } from "fields";

// Additional Functions
import { ShowConfirmNotif } from "functions";

// Style
// import Style from "../style.module.scss";
import Style from "./style.module.scss";

class EventsItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterEventSaved = ({ updated, message }) => {
    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showEditItemModal: false }, () =>
        this.props.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showEditItemModal: false });
    }
  };

  onUpdateAfterEventArchived = ({ deleted, message }) => {
    if (deleted) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showEditItemModal: false }, () =>
        this.props.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showEditItemModal: false });
    }
  };

  onShowChangePhotoModal = () => this.setState({ showChangePhotoModal: true });

  onHideChangePhotoModal = () => this.setState({ showChangePhotoModal: false });

  onSaveEventImage = async imageURL => {
    const { actionCreators } = AdminDuck;
    const { updateEventImage } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateEventImage(imageURL, this.props.eventInfo)
    );

    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showChangePhotoModal: false }, () =>
        this.props.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showChangePhotoModal: false });
    }
  };

  onSaveEventAdditionalImages = async imageURLs => {
    const { actionCreators } = AdminDuck;
    const { updateEventAdditionalImages } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateEventAdditionalImages(imageURLs, this.props.eventInfo)
    );

    if (updated) {
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

  renderProductTemplateAvatar = () => {
    const imageURL = this.props.eventInfo.original_image_url || "";
    return imageURL ? (
      <Img
        alt=""
        className={Style.itemImage}
        onClick={this.onShowChangePhotoModal}
        src={imageURL}
      />
    ) : (
      <div onClick={this.onShowChangePhotoModal}>
        <AddPhotoIcon className={Style.addPhotoIcon} />
      </div>
    );
  };

  renderChangePhotoModal = () => {
    return (
      <AdminModals.ChangePhotoModal
        type="events"
        name={this.props.eventInfo.name}
        imageURL={this.props.eventInfo.original_image_url}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImage={this.onSaveEventImage}
        hasAdditionalImages={true}
        additional_pictures={this.props.eventInfo.additional_pictures}
        onSaveAdditionalImages={this.onSaveEventAdditionalImages}
      />
    );
  };

  renderProductTemplateLabel = () => {
    const { eventInfo } = this.props;
    const { name } = eventInfo;
    return (
      <React.Fragment>
        <div className={Style.productTemplateName}>{name}</div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.EventModal
      isInEditMode={true}
      eventInfo={this.props.eventInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterEventArchived={this.onUpdateAfterEventArchived}
      onUpdateAfterEventSaved={this.onUpdateAfterEventSaved}
    />
  );

  renderHelperButton = () => {
    return (
      <PencilIcon
        className={Style.pencilIcon}
        onClick={this.onShowEditItemModal}
      />
    );
  };

  renderItem = () => (
    <div className={Style.productTemplateContainer}>
      <ProductTemplate
        avatar={this.renderProductTemplateAvatar()}
        label={this.renderProductTemplateLabel()}
        helperButtonContent={this.renderHelperButton()}
      />
    </div>
  );

  render() {
    return (
      <React.Fragment>
        {this.state.showChangePhotoModal && this.renderChangePhotoModal()}
        {this.state.showEditItemModal && this.renderEditModal()}
        {this.props.eventInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

EventsItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  eventInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func
};

EventsItem.defaultProps = {
  isInEditMode: true
};

export default connect()(EventsItem);
