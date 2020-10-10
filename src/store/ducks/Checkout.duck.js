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
    onDonationSuccess
  }
};
