import React from 'react';
import { NavLink } from "react-router-dom";

import './SideDrawer.css';

const SideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if (props.show) {
      drawerClasses += ' open';
    }
    return (
      <nav className={drawerClasses}>
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
      </nav>
    );
};

export default SideDrawer;