import { createActionTypes } from "../lib";
import { fetchGraphQL } from "constants/graphql";
import * as immutable from "object-path-immutable";

const duckName = "CHECKOUT";

const initialState = {};

const actionTypes = createActionTypes({}, duckName);

const createDonationPaymentIntent = donateAmount => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        createDonationPaymentIntent(donateAmount: ${parseInt(donateAmount)}) 
      }
    `)
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.createDonationPaymentIntent !== null
        ) {
          resolve(res.createDonationPaymentIntent);
        } else {
          resolve("");
        }
      })
      .catch(err => {
        console.log(err);
        resolve("");
      });
  });
};

const createOrderPaymentIntent = total => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        createOrderPaymentIntent(total: ${total}) 
      }
    `)
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.createOrderPaymentIntent !== null
        ) {
          resolve(res.createOrderPaymentIntent);
        } else {
          resolve("");
        }
      })
      .catch(err => {
        console.log(err);
        resolve("");
      });
  });
};

const validateShippingAddressWithInput = () => {
  return `
  mutation($address: AddressInput!) {
    validateShippingAddress(address: $address) {
      address {
        postal_code
        city_locality
        state_province
        address1
        address2
        name
        phone
      }
      shippingRateID
      shipping_cents
      error
    }
  }
`;
};

const validateShippingAddress = address => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(validateShippingAddressWithInput(), undefined, {
      address
    })
      .then(res => {
        console.log(res);
        if (
          res !== null &&
          res !== undefined &&
          res.validateShippingAddress.address !== null
        ) {
          resolve({
            success: true,
            response: res.validateShippingAddress,
            message: "Validated address successfully"
          });
        } else {
          resolve({
            success: false,
            response: null,
            message: "Failed to validate address"
          });
        }
      })
      .catch(err => {
        resolve({
          success: false,
          response: null,
          message: "Failed to validate address"
        });
      });
  });
};

const completeOrderWithInput = () => {
  return `
  mutation($order: OrderInput!) {
    createOrder(order: $order)
    } 
`;
};

const completeOrder = (
  address,
  name,
  email,
  cartAmount,
  shippingAmount,
  shippingRateID,
  paymentIntentID,
  cart
) => dispatch => {
  return new Promise((resolve, reject) => {
    const order = {
      address,
      name,
      email,
      cartAmount,
      shippingAmount,
      shippingRateID,
      paymentIntentID,
      cart
    };
    fetchGraphQL(completeOrderWithInput(), undefined, {
      order
    })
      .then(res => {
        console.log(res);
        if (res !== null && res !== undefined && res.completeOrder) {
          resolve({
            success: true,
            response: res.completeOrder,
            message: "Completed order successfully"
          });
        } else {
          resolve({
            success: false,
            response: null,
            message: "Failed to complete order"
          });
        }
      })
      .catch(err => {
        resolve({
          success: false,
          response: null,
          message: "Failed to complete order"
        });
      });
  });
};

const onDonationSuccess = (
  name,
  email,
  donateAmount,
  paymentIntentID
) => dispatch => {
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
      mutation {
        onDonationSuccess(name: "${name}", email: "${email}", donateAmount: ${donateAmount}, paymentIntentID: "${paymentIntentID}") 
      }
   `)
      .then(res => {
        resolve(true);
      })
      .catch(res => {
        resolve(false);
      });
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    createDonationPaymentIntent,
    createOrderPaymentIntent,
    onDonationSuccess,
    validateShippingAddress,
    completeOrder
  }
};
