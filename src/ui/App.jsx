import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home';
import '../styles/Gifts.css';
import Mappings from "./Mappings";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={'/'} component={Home}/>
        <Route exact path={'/mappings'} component={Mappings}/>
      </Switch>
    );
  }
}

export default App;