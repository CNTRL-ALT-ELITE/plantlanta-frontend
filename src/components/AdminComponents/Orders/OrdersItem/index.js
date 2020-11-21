import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

import moment from "moment";

// Icons
import { AddPhotoIcon, PencilIcon } from "assets/Icons";

// Components
import AdminModals from "components/AdminModals";

// Fields
import { ProductTemplate, Img, Chip } from "fields";

// Additional Functions
import { ShowConfirmNotif } from "functions";

// Style
// import Style from "../style.module.scss";
import Style from "./style.module.scss";

class OrdersItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterOrderSaved = ({ updated, message }) => {
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

  //   onUpdateAfterEventArchived = ({ deleted, message }) => {
  //     if (deleted) {
  //       this.confirmNotif = ShowConfirmNotif({
  //         message,
  //         type: "success"
  //       });
  //       this.setState({ showEditItemModal: false }, () =>
  //         this.props.onRefreshAfterChanges()
  //       );
  //     } else {
  //       this.confirmNotif = ShowConfirmNotif({
  //         message,
  //         type: "error"
  //       });
  //       this.setState({ showEditItemModal: false });
  //     }
  //   };

  renderProductTemplateAvatar = () => {
    // const imageURL = this.props.orderInfo.original_image_url || "";
    // return imageURL ? (
    //   <Img
    //     alt=""
    //     className={Style.itemImage}
    //     onClick={this.onShowChangePhotoModal}
    //     src={imageURL}
    //   />
    // ) : (
    //   <div onClick={this.onShowChangePhotoModal}>
    //     <AddPhotoIcon className={Style.addPhotoIcon} />
    //   </div>
    // );
    return null;
  };

  renderProductTemplateLabel = () => {
    const { orderInfo } = this.props;
    const { buyer_name } = orderInfo;
    return (
      <React.Fragment>
        <div className={Style.productTemplateName}>{buyer_name} </div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.OrderModal
      isInEditMode={true}
      orderInfo={this.props.orderInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterOrderSaved={this.onUpdateAfterOrderSaved}
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

  renderChipLabel = () => {
    const { orderInfo } = this.props;
    const {
      buyer_name,
      total_price_cents,
      status,
      purchased_at,
      orderNumber
    } = orderInfo;
    return (
      <React.Fragment>
        <h4 className={Style.chipName}>
          {/* <span style={{ color: 'orange', marginRight: '12px' }}>
            Seller: {seller.name}
          </span>
          <span style={{ color: 'orange', marginRight: '12px' }}>
            Buyer: {buyer.name}
          </span> */}
          <span style={{ color: "blue" }}>Order#: {orderNumber}</span>
        </h4>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "0px",
            maxWidth: "inherit",
            fontSize: "14px"
          }}
        >
          <h3
            style={{
              margin: "5px",
              color: "red",
              maxWidth: "inherit",
              overflow: "hidden",
              fontSize: "14px",
              fontFamily: "Helvetica"
            }}
          >
            {moment(purchased_at).format("MM-DD-YYYY")}{" "}
          </h3>
          <h3
            style={{
              margin: "5px",
              color: "green",
              maxWidth: "inherit",
              overflow: "hidden",
              fontSize: "14px",
              fontFamily: "Helvetica"
            }}
          >
            Total: ${total_price_cents / 100}{" "}
          </h3>
          <h3
            style={{
              margin: "5px",
              color: "red",
              maxWidth: "inherit",
              overflow: "hidden",
              fontSize: "14px",
              fontFamily: "Helvetica"
            }}
          >
            Status: {status}{" "}
          </h3>
        </div>
      </React.Fragment>
    );
  };

  renderItem = () => (
    <div className={Style.productTemplateContainer}>
      <Chip
        // avatar={this.renderProductTemplateAvatar()}
        label={this.renderChipLabel()}
        helperButtonContent={this.renderHelperButton()}
      />
    </div>
  );

  render() {
    return (
      <React.Fragment>
        {this.state.showEditItemModal && this.renderEditModal()}
        {this.props.orderInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

OrdersItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  orderInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func
};

OrdersItem.defaultProps = {
  isInEditMode: true
};

export default connect()(OrdersItem);
