import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import SurveysPage from './pages/Surveys';
import AttemptsPage from './pages/Attempts';
import MainNavigation from './components/Navigation/MainNavigation';
import SideDrawer from './components/SideDrawer/SideDrawer';
import BackDrop from './components/Backdrop/Backdrop';

import './App.css';

class App extends Component {
  state = {
    sideDrawerOpened: false
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return {sideDrawerOpened: !prevState.sideDrawerOpened};
    });
  };
  
  backdropClickHandler = () => {
    this.setState({sideDrawerOpened: false});
  };

  render() {
    let backDrop;
    if (this.state.sideDrawerOpened) {
      backDrop = <BackDrop click={this.backdropClickHandler} />;
    }
    return (
      <BrowserRouter>
      <React.Fragment>
        <MainNavigation drawerClickHandler={this.drawerToggleClickHandler} />
        <SideDrawer show={this.state.sideDrawerOpened}/>
        {backDrop}
        <main className="main-content">
          <Switch>  
            <Redirect from="/" to='/auth' exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/surveys" component={SurveysPage} />
            <Route path="/attempts" component={AttemptsPage} />
          </Switch>
          </main>
      </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
