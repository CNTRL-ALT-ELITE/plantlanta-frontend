import React from "react";
import { Provider } from "react-redux";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ROUTES from "./constants/routes";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer, Flip } from "react-toastify";

import store, { history } from "./store/store";

function App() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={ROUTES("homePage")} />
            <Route path="/volunteer" component={ROUTES("volunteerPage")} />
            <Route path="/admin" component={ROUTES("admin")} />
          </Switch>
          <ToastContainer transition={Flip} />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
