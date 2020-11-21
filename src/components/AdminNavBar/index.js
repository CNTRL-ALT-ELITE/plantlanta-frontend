import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import NavBarContainer from "./NavBarContainer";

import AdminUIDuck from "store/ducks/AdminUI.duck";

// fetch action creators

const { actionCreators } = AdminUIDuck;
const { changeActiveNavbarItem } = actionCreators;

// Lib
// import { Constants } from "lib";
// const { MOBILE_NAVBAR_ITEMS } = Constants;

const ADMIN_NAVBAR_ITEMS = [
  {
    id: "events",
    label: "Events"
  },
  {
    id: "shop",
    label: "Shop"
  },
  // {
  //   id: "mailingList",
  //   label: "Mailing List"
  // },
  {
    id: "orders",
    label: "Orders"
  }
];

class AdminNavBar extends Component {
  getAdminNavItems = () => ADMIN_NAVBAR_ITEMS;

  // Call Action Creator to trigger Custom Event
  onChangeNavItem = id => {
    this.props.dispatch(changeActiveNavbarItem(id));
  };

  render() {
    return (
      <NavBarContainer
        activeNavbarItemId={this.props.activeNavbarItemId}
        navItems={this.getAdminNavItems()}
        onChangeNavItem={this.onChangeNavItem}
      />
    );
  }
}

// props will come from redux
// AdminNavBar.propTypes = {
//   activeAdminNavbarItemId: PropTypes.string.isRequired,
// };

const mapStateToProps = state => {
  const { duckName } = AdminUIDuck;
  return {
    activeNavbarItemId: state[duckName].activeNavbarItemId
  };
};

export default connect(mapStateToProps)(AdminNavBar);

AdminNavBar.propTypes = {
  activeNavbarItemId: PropTypes.string.isRequired
};
