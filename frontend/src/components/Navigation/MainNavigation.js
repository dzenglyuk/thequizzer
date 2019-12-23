import React from "react";
import { NavLink } from "react-router-dom";

import DrawerToggleButton from '../SideDrawer/DrawerToggleButton';
import "./MainNavigation.css";

const MainNavigation = props => (
  <header className="toolbar">
    <nav className="main-navigation">
      <div className="main-navigation__logo">
        <h1> EasySurvey </h1>
      </div>
      <div className="spacer" />
      <div className="main-navigation__items">
        <ul>
          <li>
            <NavLink to="/surveys"> Surveys </NavLink>
          </li>
          <li>
            <NavLink to="/attempts"> Attempts </NavLink>
          </li>
          <li>
            <NavLink to="/auth"> Sign In </NavLink>
          </li>
        </ul>
      </div>
      <div className="main-navigation__toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler}/>
      </div>
    </nav>
  </header>
);

export default MainNavigation;
