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

function App() {
  return (    
    <Router>    
        
      <Switch>
        <Route path="/" exact component={Landing} />  
        <Route path="/signup" exact component={SignUp} />    
        <Route path="/help" exact component={Help} />    
        <Route path="/dashboard" exact component={DashBoard} />
        <Route path="/productpreview/:productId" exact component={ProductPreview} />
        <Route path="/marketplace" exact component={Marketplace} />
        <Route path="/additem" exact component={AddItem} />        

        <Route component={Error} />
      </Switch>
      
    </Router>    
  );
}

export default App;
