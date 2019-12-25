import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
import "./SideDrawer.css";

const SideDrawer = props => {
  let drawerClasses = "side-drawer";
  if (props.show) {
    drawerClasses += " open";
  }
  return (
    <AuthContext.Consumer>
      {context => {
        return (
          <nav className={drawerClasses}>
            <ul>
              {context.token && (
                <>
                  <li>
                    <NavLink to="/surveys"> Surveys </NavLink>
                  </li>
                  <li>
                    <NavLink to="/attempts"> Attempts </NavLink>
                  </li>
                  <li>
                    <button className="logout__button" onClick={context.logout}> Sign Out </button>
                  </li>
                </>
              )}
              {!context.token && (
                <li>
                  <NavLink to="/auth"> Sign In </NavLink>
                </li>
              )}
            </ul>
          </nav>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default SideDrawer;
