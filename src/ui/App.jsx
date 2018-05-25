import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home';
import '../styles/Gifts.css';
import Mappings from "./Mappings";
import Login from "./Login";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={'/'} component={Home}/>
        <Route exact path={'/mappings'} component={Mappings}/>
        <Route exact path={'/login'} component={Login}/>
      </Switch>
    );
  }
}

export default App;