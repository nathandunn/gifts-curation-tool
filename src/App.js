import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home.js';
import './App.css';
import Mappings from "./Mappings";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={Home}/>
        <Route exact path={process.env.PUBLIC_URL + '/mappings'} component={Mappings}/>
      </Switch>
    );
  }
}

export default App;