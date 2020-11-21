import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import AdminModals from "components/AdminModals";
import { ListOfOrders } from "components/AdminComponents/Orders";

// Style
import Style from "../style.module.scss";

// Other components
import { ClipLoader } from "react-spinners";
import { ShowConfirmNotif } from "functions";

class Orders extends Component {
  confirmNotif = null;

  state = {
    showEditOrderModal: false
  };

  onHideEditOrderModal = () => this.setState({ showEditOrderModal: false });

  onShowEditOrderModal = () => this.setState({ showEditOrderModal: true });

  onUpdateOrder = ({ updated, message }) => {
    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "success"
      });
      this.setState({ showEditOrderModal: false }, () =>
        this.onRefreshAfterChanges()
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: "error"
      });
      this.setState({ showEditOrderModal: false });
    }
  };

  onRefreshAfterChanges = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllOrders } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllOrders());
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
  renderOrderModal = () => (
    <AdminModals.OrderModal
      onCloseModal={this.onHideEditOrderModal}
      onUpdateOrder={this.onUpdateOrder}
    />
  );

  renderAllOrders = () => (
    <ListOfOrders
      orders={this.props.orders}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingOrders } = this.props;
    if (isFetchingOrders) {
      return (
        <div style={{ textAlign: "center" }}>
          <ClipLoader color={"#000000"} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showEditOrderModal && this.renderOrderModal()}
        {this.renderAllOrders()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isFetchingOrders: state[duckName].orders.isFetching,
    orders: state[duckName].orders.data
  };
};

export default connect(mapStateToProps)(Orders);

Orders.propTypes = {
  isFetchingOrders: PropTypes.bool,
  orders: PropTypes.array
};
