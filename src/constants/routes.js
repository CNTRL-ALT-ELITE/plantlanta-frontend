import React from "react";
import { AdminPage, DonatePage, HomePage, VolunteerPage } from "../pages";

const ROUTES = (routeName = "", props = {}) => {
  switch (routeName) {
    case "homePage":
      return HomePage;
    case "volunteerPage":
      return VolunteerPage;
    case "admin":
      return AdminPage;
    case "donateNow":
      return DonatePage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
