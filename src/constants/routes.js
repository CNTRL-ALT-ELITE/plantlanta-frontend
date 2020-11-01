import React from "react";
import {
  AdminPage,
  DonatePage,
  HomePage,
  VolunteerPage,
  ShopPage
} from "../pages";

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
    case "shopPage":
      return ShopPage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
