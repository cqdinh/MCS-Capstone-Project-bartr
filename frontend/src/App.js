import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Landing from './components/pages/landing'
import SignUp from './components/pages/signup'
import DashBoard from './components/pages/dashboard'
import ProductPreview from './components/pages/productpreview'
import Error from './components/pages/error'
import Marketplace from './components/pages/marketplace';
import Help from './components/pages/help';
import AddItem from './components/pages/additem';

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import PrivateRoute from "./components/private-route/PrivateRoute";
import dashboard from "./components/pages/dashboard";
import MakeOffer from './components/pages/makeoffer';
import { Provider } from "react-redux";
import store from "./store";
import Edit from './components/pages/edit';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/help" exact component={Help} />
        <Route path="/dashboard/edit" exact component={Edit} />     
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/productpreview" exact component={ProductPreview} />
        <Route path="/marketplace" exact component={Marketplace} />
        <Route path="/additem" exact component={AddItem} />   
        <Route path="/makeoffer" exact component={MakeOffer} />        
        
        <Route component={Error} />
      </Switch>
      
      </Router>    
    </Provider>
  );
}

export default App;
