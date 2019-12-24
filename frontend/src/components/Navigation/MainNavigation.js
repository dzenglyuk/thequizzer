import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./MainNavigation.css";

const MainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="toolbar">
          <nav className="main-navigation">
            <div className="main-navigation__logo">
              <h1> EasySurvey </h1>
            </div>
            <div className="spacer" />
            <div className="main-navigation__items">
              <ul>
                {context.token && (
                  <li>
                    <NavLink to="/surveys"> Surveys </NavLink>
                  </li>
                )}
                {context.token && (
                  <>
                    <li>
                      <NavLink to="/attempts"> Attempts </NavLink>
                    </li>
                    <li>
                      <button onClick={context.logout}> Sign Out </button>
                    </li>
                  </>
                )}
                {!context.token && (
                  <li>
                    <NavLink to="/auth"> Sign In </NavLink>
                  </li>
                )}
              </ul>
            </div>
            <div className="main-navigation__toggle-button">
              <DrawerToggleButton click={props.drawerClickHandler} />
            </div>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default MainNavigation;
