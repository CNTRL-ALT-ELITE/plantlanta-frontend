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

class ShopItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterShopItemSaved = ({ updated, message }) => {
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

  onUpdateAfterShopItemArchived = ({ deleted, message }) => {
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

  onSaveShopItemImage = async imageURL => {
    const { actionCreators } = AdminDuck;
    const { updateShopItemImage } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateShopItemImage(imageURL, this.props.shopItemInfo)
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

  onSaveShopItemAdditionalImages = async imageURLs => {
    const { actionCreators } = AdminDuck;
    const { updateShopItemAdditionalImages } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateShopItemAdditionalImages(imageURLs, this.props.shopItemInfo)
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
    const imageURL = this.props.shopItemInfo.original_image_url || "";
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
        type="shopItems"
        name={this.props.shopItemInfo.name}
        imageURL={this.props.shopItemInfo.original_image_url}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImage={this.onSaveShopItemImage}
        hasAdditionalImages={false}
      />
    );
  };

  renderProductTemplateLabel = () => {
    const { shopItemInfo } = this.props;
    const { name } = shopItemInfo;
    return (
      <React.Fragment>
        <div className={Style.productTemplateName}>{name}</div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.ShopItemModal
      isInEditMode={true}
      shopItemInfo={this.props.shopItemInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterShopItemArchived={this.onUpdateAfterShopItemArchived}
      onUpdateAfterShopItemSaved={this.onUpdateAfterShopItemSaved}
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
        {this.props.shopItemInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

ShopItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  shopItemInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func
};

ShopItem.defaultProps = {
  isInEditMode: true
};

export default connect()(ShopItem);
