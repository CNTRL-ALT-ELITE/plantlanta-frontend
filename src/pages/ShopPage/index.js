import React, { Component } from "react";
import MainNavBar from "../../components/MainNavBar";
import MainFooter from "../../components/MainFooter";

import Style from "./style.module.scss";

import AdminDuck from "store/ducks/Admin.duck";
import { connect } from "react-redux";

import { Button, TextInput } from "fields";

import * as immutable from "object-path-immutable";
import CheckoutModal from "./components/CheckoutModal";
import { ShowConfirmNotif } from "functions";

const eventBackground = require("../../assets/Images/EventsBackgroundImage.png");

class ShopPage extends Component {
  confirmNotif = null;
  state = {
    cart: {},
    shopItemQuantity: {},
    checkout: false,
    orderComplete: false
  };

  componentDidMount() {
    // Fetch everything over here
    Promise.all([this.fetchAllShopItems()]);
  }

  onOrderSuccessful = () => {
    this.setState({
      checkout: false,
      orderComplete: true
    });
  };

  closeModal = (error = "") => {
    if (error) {
      this.confirmNotif = ShowConfirmNotif({
        message: error,
        type: "error"
      });
    }

    this.setState({
      checkout: false
    });
  };

  onChangeShopItemQuantity = (id, qty) => {
    this.setState({
      shopItemQuantity: immutable.set(this.state.shopItemQuantity, id, qty)
    });
  };

  fetchAllShopItems = async () => {
    const { actionCreators } = AdminDuck;
    const { getAllShopItems } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllShopItems());
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "success"
      // })
    } else {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: "error"
      // });
    }
  };

  checkoutCart = async () => {
    const { cart } = this.state;
    const { shopItems } = this.props;
    console.log(cart);
    console.log(shopItems);

    console.log(Object.keys(cart));

    const cartTotalCents = Object.keys(cart).reduce((total, itemID) => {
      console.log(itemID);
      const filteredCart = shopItems.filter(value => value.id === itemID);
      console.log(filteredCart);
      const { price } = filteredCart[0];

      const quantity = cart[itemID];

      console.log(total + price * quantity * 100);
      return total + price * quantity * 100;
    }, 0);

    console.log("Cart Total", cartTotalCents);

    this.setState({
      checkout: true,
      cartTotalCents
    });
  };

  onDetermineIncreaseButtonStatus = (id, quantity) => {
    const currentQuantity = this.state.shopItemQuantity[id] || "1";
    const updatedQuantity = parseInt(currentQuantity) + 1;

    if (updatedQuantity >= quantity) {
      return "inactive";
    } else {
      return "active";
    }
  };

  onDetermineDecreaseButtonStatus = id => {
    const currentQuantity = this.state.shopItemQuantity[id] || "1";
    const updatedQuantity = parseInt(currentQuantity) - 1;

    if (updatedQuantity <= 0) {
      return "inactive";
    } else {
      return "active";
    }
  };

  renderAllShopItems = () => {
    console.log(this.props.shopItems);
    if (this.props.shopItems.length === 0) {
      return;
    }
    const filteredShopItems = this.props.shopItems.filter(
      item => item.quantity > 0
    );

    return filteredShopItems.length !== 0 ? (
      <div className={Style.gridWrapper}>
        {filteredShopItems.map(this.renderShopItem)}
      </div>
    ) : (
      <div className={Style.noEventsContainer}>No items available</div>
    );
  };

  renderCart = () => {
    if (Object.keys(this.state.cart).length === 0) {
      return (
        <div>
          <h1>Cart is empty</h1>
        </div>
      );
    }

    return (
      <div>
        <h1>Cart</h1>
        <div className={Style.gridWrapper}>
          {Object.keys(this.state.cart).map(this.renderCartItem)}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => {
              this.checkoutCart();
            }}
            style={{
              background: "#3AAFA9",
              width: "100px",
              marginTop: "100px",
              padding: "10px 0px",
              color: "white"
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };

  addToCart = id => {
    const quantity = this.state.shopItemQuantity[id] || "1";

    this.setState({
      cart: immutable.set(this.state.cart, id, parseInt(quantity))
    });
  };

  removeFromCart = id => {
    this.setState({
      cart: immutable.del(this.state.cart, id)
    });
  };

  renderShopItem = shopItem => {
    const {
      id,
      name,
      description,
      quantity,
      price,
      original_image_url
    } = shopItem;
    return (
      <div className={Style.gridCell} key={id}>
        <h4 style={{ color: "black" }}>{name}</h4>
        <p style={{ marginBottom: "15px", color: "black" }}>{description}</p>
        <img src={original_image_url} className={Style.shopItemImg} />
        <p className={Style.shopItemText}>${price}</p>
        {!this.state.cart[id] ? (
          <React.Fragment>
            <div style={{ display: "flex" }}>
              <Button
                className={Style.quantityButton}
                status={this.onDetermineIncreaseButtonStatus(id, quantity)}
                onClick={() => {
                  const currentQuantity =
                    this.state.shopItemQuantity[id] || "1";
                  const updatedQuantity = parseInt(currentQuantity) + 1;

                  this.setState({
                    shopItemQuantity: immutable.set(
                      this.state.shopItemQuantity,
                      id,
                      `${updatedQuantity}`
                    )
                  });
                }}
              >
                {" "}
                +{" "}
              </Button>
              <input
                className={Style.quantityInput}
                name={"quantity"}
                onChange={e =>
                  this.onChangeShopItemQuantity(id, e.target.value)
                }
                value={this.state.shopItemQuantity[id] || "1"}
                type={"number"}
              />
              <Button
                className={Style.quantityButton}
                status={this.onDetermineDecreaseButtonStatus(id)}
                onClick={() => {
                  const currentQuantity =
                    this.state.shopItemQuantity[id] || "1";
                  const updatedQuantity = parseInt(currentQuantity) - 1;

                  this.setState({
                    shopItemQuantity: immutable.set(
                      this.state.shopItemQuantity,
                      id,
                      `${updatedQuantity}`
                    )
                  });
                }}
              >
                {" "}
                -{" "}
              </Button>
            </div>
            <button
              onClick={() => {
                this.addToCart(id);
              }}
              style={{
                background: "#3AAFA9",
                width: "100px",
                padding: "10px 0px",
                marginTop: "30px",
                color: "white"
              }}
            >
              Add to cart
            </button>
          </React.Fragment>
        ) : (
          <button
            style={{
              background: "#3AAFA9",
              width: "100px",
              color: "white",
              marginTop: "90px",
              padding: "10px 0px"
            }}
            onClick={() => this.removeFromCart(id)}
          >
            Remove From Cart
          </button>
        )}
      </div>
    );
  };

  renderCartItem = id => {
    const item = this.props.shopItems.filter(item => item.id === id)[0];
    const { name, original_image_url, price } = item;
    const cartQuantity = this.state.cart[id];

    return (
      <div className={Style.gridCell} key={id}>
        <h4 style={{ color: "black" }}>{name}</h4>
        <img
          src={original_image_url}
          style={{ width: "100px", height: "75px", objectFit: "contain" }}
        />
        <p
          style={{
            color: "black",

            fontSize: "16px",
            color: "black",
            marginTop: "20px"
          }}
        >
          Qty: {cartQuantity}
        </p>
        <p
          style={{
            color: "black",

            fontSize: "16px",
            color: "black",
            marginTop: "20px"
          }}
        >
          Price: ${cartQuantity * price}
        </p>
      </div>
    );
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageContainer}>
          <img src={eventBackground} className={Style.backgroundImage} />
          <div className={Style.introContainerTitle}>
            <h1 className={Style.backgroundImageTitle}>Shop Merchandise</h1>
          </div>
        </div>
        <div className={Style.shopPlanlanta}>
          <div className={Style.shopContainer}>
            <h2 className={Style.titleGreen}>Plantlanta Merchandise</h2>
            <h1 className={Style.titleLarge}>
              Buy merch and support Plantlanta!
            </h1>
          </div>

          {!this.state.orderComplete && this.renderAllShopItems()}
        </div>
        <div
          style={{
            padding: "50px",
            width: "80%",
            marginTop: "30px",
            background: "#F8F8F8",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          {!this.state.orderComplete && this.renderCart()}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "20px" }}
        >
          <h2>{this.state.orderComplete && "Thank you for Ordering!"}</h2>
        </div>
        <div>
          {this.state.checkout && (
            <CheckoutModal
              donateAmount={this.state.donateAmount}
              closeModal={this.closeModal}
              onOrderSuccessful={this.onOrderSuccessful}
              cartTotalCents={this.state.cartTotalCents}
              cart={this.state.cart}
            />
          )}
        </div>
        <MainFooter />
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

export default connect(mapStateToProps)(ShopPage);
