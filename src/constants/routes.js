import React from "react";
import { HomePage, VolunteerPage } from "../pages";

const ROUTES = (routeName = "", props = {}) => {
  switch (routeName) {
    case "homePage":
      return HomePage;
    case "volunteerPage":
      return VolunteerPage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
