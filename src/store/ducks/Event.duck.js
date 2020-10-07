import { createActionTypes } from "../lib";
import { fetchGraphQL } from "constants/graphql";
import * as immutable from "object-path-immutable";

const duckName = "EVENT";

const actionTypes = createActionTypes(
  {
    NEW_EVENT_SIGNUP_REQUEST: "NEW_EVENT_SIGNUP_REQUEST",
    NEW_EVENT_SIGNUP_SUCCESS: "NEW_EVENT_SIGNUP_SUCCESS",
    NEW_EVENT_SIGNUP_ERROR: "NEW_EVENT_SIGNUP_ERROR"
  },
  duckName
);

const initialState = {
  isSigningUp: false
};

const eventSignup = (id, name, email) => dispatch => {
  dispatch(eventSignupRequest);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
              mutation {
                  newSignup(id: "${id}", name: "${name}", email: "${email}") {
                      success
                      error
                  }
              } 
          `)
      .then(res => {
        if (res !== null && res != undefined && res.newSignup.success) {
          dispatch(eventSignupSuccess);
          resolve({
            success: true,
            error: ""
          });
        } else {
          dispatch(eventSignupError);
          resolve({
            success: false,
            error: res.newSignup.error
          });
        }
      })
      .catch(err => {
        dispatch(eventSignupError);
        resolve({
          success: false,
          error: err
        });
      });
  });
};

const eventSignupRequest = () => {
  return {
    type: actionTypes.NEW_EVENT_SIGNUP_REQUEST
  };
};

const eventSignupSuccess = () => {
  return {
    type: actionTypes.NEW_EVENT_SIGNUP_SUCCESS
  };
};

const eventSignupError = () => {
  return {
    type: actionTypes.NEW_EVENT_SIGNUP_ERROR
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_EVENT_SIGNUP_REQUEST:
      return Object.assign({}, state, {
        isSigningUp: true
      });
    case actionTypes.NEW_EVENT_SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        isSigningUp: false
      });
    case actionTypes.NEW_EVENT_SIGNUP_ERROR:
      return Object.assign({}, state, {
        isSigningUp: false
      });
    default:
      return state;
  }
};

export default {
  duckName,
  reducer,
  actionCreators: {
    eventSignup
  }
};
