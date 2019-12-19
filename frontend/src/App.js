import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import SurveysPage from './pages/Surveys';
import AttemptsPage from './pages/Attempts';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>  
          <Redirect from="/" to='/auth' exact />
          <Route path="/auth" component={AuthPage} />
          <Route path="/surveys" component={SurveysPage} />
          <Route path="/attempts" component={AttemptsPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
