import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ROUTES from "./constants/routes";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ROUTES("homePage")} />
          <Route path="/volunteer" component={ROUTES("volunteerPage")} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
