import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";

import { MenuIcon } from "../../assets/Icons";

// Style
import Style from "./style.module.scss";
import cx from "classnames";

export default class MainNavBar extends Component {
  state = { showSideNavBar: false };

  onClickMenu = () => this.setState({ showNavbar: !this.state.showNavbar });

  sideNavigationMenu = () => (
    <div className={Style.sideBarContainer}>
      <button className={Style.menuIcon} onClick={this.onClickMenu}>
        <MenuIcon />
      </button>
      <label
        className={
          this.state.showNavbar
            ? Style.navOverlay
            : cx(Style.navOverlay, Style.hidden)
        }
      >
        <div
          className={Style.overlayCover}
          onClick={() => this.setState({ showNavbar: false })}
        />
      </label>
      <nav
        className={
          this.state.showNavbar
            ? Style.slidingNavBar
            : Style.slidingNavBarHidden
        }
      >
        <ul style={{ padding: "0" }}>
          <li>
            <NavLink
              exact
              to="/"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>About</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/volunteer"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>volunteer</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              exact
              to="/shop"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>Shop</span>
            </NavLink>
          </li>

          <NavLink
            exact
            to="/donateNow"
            className={Style.sideBarNavLink}
            activeClassName={Style.sideBarNavLinkActive}
          >
            <span className={Style.navLinkText}>Donate</span>
          </NavLink>
        </ul>
      </nav>
    </div>
  );

  render() {
    return (
      <nav className={Style.mainNavBar}>
        <div className={Style.navBarContent}>
          {this.sideNavigationMenu()}
          <NavLink
            exact
            to="/"
            className={cx(Style.mainHeaderNavLink, Style.logo)}
          >
            Plantlanta
          </NavLink>
          <NavLink
            exact
            to="/"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            About
          </NavLink>
          <NavLink
            exact
            to="/volunteer"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            Volunteer
          </NavLink>
          <NavLink
            exact
            to="/shop"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            Shop
          </NavLink>
          <NavLink
            to="/donateNow"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            Donate
          </NavLink>
        </div>
      </nav>
    );
  }
}
