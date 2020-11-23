import { createActionTypes } from "../lib";
import { fetchGraphQL } from "constants/graphql";
import * as immutable from "object-path-immutable";

const duckName = "USER_SIGNUP";

const actionTypes = createActionTypes(
  {
    NEW_USER_SIGNUP_REQUEST: "NEW_USER_SIGNUP_REQUEST",
    NEW_USER_SIGNUP_SUCCESS: "NEW_USER_SIGNUP_SUCCESS",
    NEW_USER_SIGNUP_ERROR: "NEW_USER_SIGNUP_ERROR"
  },
  duckName
);

const initialState = {
  isSigningUp: false
};

const userSignup = (name, email) => dispatch => {
  dispatch(userSignupRequest);
  return new Promise((resolve, reject) => {
    fetchGraphQL(`
            mutation {
                newUserSignup(name: "${name}", email: "${email}")
            }
        `)
      .then(res => {
        if (res !== null && res != undefined && res.newUserSignup === "") {
          dispatch(userSignupSuccess);
          resolve({
            success: true,
            error: ""
          });
        } else {
          dispatch(userSignupError);
          resolve({
            success: false,
            error: res.newUserSignup
          });
        }
      })
      .catch(err => {
        dispatch(userSignupError);
        resolve({
          success: false,
          error: "Something went wrong. Try again"
        });
      });
  });
};

const userSignupRequest = () => {
  return {
    type: actionTypes.NEW_USER_SIGNUP_REQUEST
  };
};

const userSignupSuccess = () => {
  return {
    type: actionTypes.NEW_USER_SIGNUP_SUCCESS
  };
};

const userSignupError = () => {
  return {
    type: actionTypes.NEW_USER_SIGNUP_ERROR
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NEW_USER_SIGNUP_REQUEST:
      return Object.assign({}, state, {
        isSigningUp: true
      });
    case actionTypes.NEW_USER_SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        isSigningUp: false
      });
    case actionTypes.NEW_USER_SIGNUP_ERROR:
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
    userSignup
  }
};
