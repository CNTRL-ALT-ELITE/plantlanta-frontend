import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ROUTES from "./constants/routes";

function App() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ROUTES("homePage")} />
          <Route path="/volunteer" component={ROUTES("volunteerPage")} />
          <Route path="/admin" component={ROUTES("admin")} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
