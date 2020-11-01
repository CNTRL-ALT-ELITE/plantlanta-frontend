import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import ShopItemFormFields from "./shopItemFormFields.js";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class ShopItemModal extends Component {
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
    return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Shop Item</h1>;
  };

  onSubmitShopItemInfo = async shopItemInfo => {
    if (this.props.isInEditMode) {
      const { actionCreators } = AdminDuck;
      const { updateExistingShopItem } = actionCreators;
      const res = await this.props.dispatch(
        updateExistingShopItem(shopItemInfo)
      );
      console.log(res);
      this.props.onUpdateAfterShopItemSaved(res);
    } else {
      const { actionCreators } = AdminDuck;
      const { createNewShopItem } = actionCreators;
      const res = await this.props.dispatch(createNewShopItem(shopItemInfo));
      this.props.onUpdateAfterShopItemCreated(res);
    }
  };

  onArchiveApparel = async () => {
    const { actionCreators } = AdminDuck;
    const { removeExistingApparel } = actionCreators;
    const res = await this.props.dispatch(
      removeExistingApparel(this.props.shopItemInfo)
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
    const { isInEditMode, shopItemInfo } = this.props;
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
            name={shopItemInfo.name}
            onArchive={() => this.onArchiveApparel()}
            onCloseModal={this.onHideConfirmArchiveModal}
          />
        )}
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        <ShopItemFormFields
          isInEditMode={isInEditMode}
          onSubmit={this.onSubmitShopItemInfo}
          shopItemInfo={this.props.shopItemInfo}
        />
        {isInEditMode && this.renderArchiveItemButton()}
      </CenterModal>
    );
  }
}

ShopItemModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  shopItemInfo: PropTypes.object,
  //   apparelID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterShopItemArchived: PropTypes.func,
  onUpdateAfterShopItemCreated: PropTypes.func,
  onUpdateAfterShopItemSaved: PropTypes.func
};

ShopItemModal.defaultProps = {
  isInEditMode: false
};

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isMutating: state[duckName].shopItems.isMutating
  };
};

export default connect(mapStateToProps)(ShopItemModal);
