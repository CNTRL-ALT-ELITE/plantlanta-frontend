import React from "react";
import { AdminPage, HomePage, VolunteerPage } from "../pages";

const ROUTES = (routeName = "", props = {}) => {
  switch (routeName) {
    case "homePage":
      return HomePage;
    case "volunteerPage":
      return VolunteerPage;
    case "admin":
      return AdminPage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
