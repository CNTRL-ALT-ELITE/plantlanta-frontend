import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfShopItems } from "components/AdminComponents/Shop";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from "react-spinners";
import { ShowConfirmNotif } from "functions";

class Shop extends Component {
  confirmNotif = null;

  state = {
    showCreateShopItemModal: false
  };

  onHideCreateShopItemModal = () =>
    this.setState({ showCreateShopItemModal: false });

  onShowCreateShopItemModal = () =>
    this.setState({ showCreateShopItemModal: true });

  onUpdateAfterShopItemCreated = ({ created, message }) => {
    if (created) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showCreateShopItemModal: false }, () =>
        this.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showCreateShopItemModal: false });
    }
  };

  onRefreshAfterChanges = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllShopItems } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllShopItems());
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
    <AdminModals.ShopItemModal
      onCloseModal={this.onHideCreateShopItemModal}
      onUpdateAfterShopItemCreated={this.onUpdateAfterShopItemCreated}
    />
  );

  renderAllShopItems = () => (
    <ListOfShopItems
      shopItems={this.props.shopItems}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingShopItems } = this.props;
    if (isFetchingShopItems) {
      return (
        <div style={{ textAlign: "center" }}>
          <ClipLoader color={"#000000"} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showCreateShopItemModal && this.renderCreateModal()}
        {this.renderAllShopItems()}
        <div className={Style.floatingButton}>
          <button onClick={this.onShowCreateShopItemModal}>+</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isFetchingShopItems: state[duckName].shopItems.isFetching,
    shopItems: state[duckName].shopItems.data
  };
};

export default connect(mapStateToProps)(Shop);

Shop.propTypes = {
  isFetchingShopItems: PropTypes.bool,
  shopItems: PropTypes.array
};
