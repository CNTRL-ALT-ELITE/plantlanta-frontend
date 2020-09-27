import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { composeWithDevTools } from "redux-devtools-extension";

// Import all the individual ducks here
import UserSignupDuck from "./ducks/UserSignup.duck";
import AdminDuck from "./ducks/Admin.duck";
import AdminUIDuck from "./ducks/AdminUI.duck";

// Initial State of the app
const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

// Combine all the reducers from each duck
const combineDucks = (...ducks) => {
  const reducers = ducks.reduce((root, duck) => {
    const { duckName, reducer } = duck;
    return { ...root, [duckName]: reducer };
  }, {});
  const reducersWithRouter = Object.assign(reducers, {
    router: connectRouter(history)
  });
  return combineReducers(reducersWithRouter);
};

const rootReducer = combineDucks(UserSignupDuck, AdminDuck, AdminUIDuck);

// Main Redux Store
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(routerMiddleware(history), ...middleware))
);

export default store;
