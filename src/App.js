import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ROUTES from "./constants/routes";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, Flip } from "react-toastify";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import store, { history } from "./store/store";

const promise = loadStripe("pk_test_qJ4ZjkxQSh3ANlUkoPLkb9kc00BUnqG3b0", {
  stripeAccount: "acct_1Ge4mVBFauUskiNa"
});

function App() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Provider store={store}>
        <Elements stripe={promise}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={ROUTES("homePage")} />
              <Route path="/volunteer" component={ROUTES("volunteerPage")} />
              <Route path="/admin" component={ROUTES("admin")} />
              <Route path="/donateNow" component={ROUTES("donateNow")} />
            </Switch>
            <ToastContainer transition={Flip} />
          </BrowserRouter>
        </Elements>
      </Provider>
    </div>
  );
}

export default App;
