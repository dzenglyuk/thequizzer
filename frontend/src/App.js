import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import AuthPage from "./pages/Auth";
import FormPage from "./pages/Form";
import SurveysPage from "./pages/Surveys";
import AttemptsPage from "./pages/Attempts";
import MainNavigation from "./components/Navigation/MainNavigation";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import BackDrop from "./components/Backdrop/Backdrop";
import AuthContext from "./context/auth-context";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
    username: null,
    sideDrawerOpened: false
  };

  login = (token, userId, username, tokenExpiration) => {
    this.setState({ token: token, userId: userId, username: username });
  };

  logout = () => {
    this.setState({ token: null, userId: null, username: null });
  };

  drawerToggleClickHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpened: !prevState.sideDrawerOpened };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpened: false });
  };

  render() {
    let backDrop;
    if (this.state.sideDrawerOpened) {
      backDrop = <BackDrop click={this.backdropClickHandler} />;
    }

    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              username: this.state.username,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation
              drawerClickHandler={this.drawerToggleClickHandler}
            />
            <SideDrawer show={this.state.sideDrawerOpened} click={this.backdropClickHandler}/>
            {backDrop}
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/auth" exact />}
                {!this.state.token && <Redirect from="/surveys" to="/auth" />}
                {!this.state.token && <Redirect from="/attempts" to="/auth" />}
                {this.state.token && <Redirect from="/" to="/surveys" exact />}
                {this.state.token && <Redirect from="/auth" to="/surveys" exact />}
                {!this.state.token && (
                  <Route path="/auth" component={AuthPage} />
                )}
                {this.state.token && (
                  <Route path="/surveys" component={SurveysPage} />
                )}
                {this.state.token && (
                  <Route path="/attempts" component={AttemptsPage} />
                )}
                {!this.state.token && (
                  <Route path="/form/:surveyId" component={FormPage} />
                )}
                <Redirect from="*" to="/auth" />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
