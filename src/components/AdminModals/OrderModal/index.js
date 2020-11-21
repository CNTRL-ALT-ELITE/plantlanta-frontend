import React, { Component } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import AdminDuck from "store/ducks/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";

// Style
import ModalStyle from "../style.module.scss";

class EventModal extends Component {
  state = {
    showLoadingModal: false
  };

  componentWillUnmount = () => this.setState({ showLoadingModal: false });

  // On Change Methods

  renderModalTitle = () => {
    return <h1>Order</h1>;
  };

  renderOrderDetails = orderInfo => {
    const {
      buyer_name,
      email,
      orderNumber,
      price_cents,
      shipping_cents,
      total_price_cents,
      status,
      items
    } = orderInfo;

    return (
      <div>
        <h4>Buyer: {buyer_name}</h4>
        <div style={{ display: "flex" }}>
          <a
            style={{
              color: "black",
              background: "orange",
              padding: "10px",
              margin: "10px"
            }}
            href={`mailto: ${email}`}
          >
            Send Email
          </a>
        </div>
        <div>
          <h2>Items Ordered</h2>
          <div>
            {items.map(val => {
              const { item, quantity } = val;
              const { name, original_image_url } = item;
              return (
                <div>
                  <p>Item: {name}</p>
                  <p>Qty: {quantity}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2>Payment Info</h2>
          <h4>Items Total ${price_cents / 100} </h4>
          <h4>Shipping Total ${shipping_cents / 100}</h4>
          <h4>Total Price ${total_price_cents / 100} </h4>
        </div>
      </div>
    );
  };

  render() {
    const { orderInfo } = this.props;
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Create or edit item modal"
        modalBoxClassname={ModalStyle.largeCenterModalBox}
        contentContainerClassname={ModalStyle.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        {/* Put all the fields here */}
        {this.renderOrderDetails(orderInfo)}
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
