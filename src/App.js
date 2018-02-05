import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Home from './Home.js';
import ResultsComponent from './components/ResultsComponent.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path={process.env.PUBLIC_URL + '/'} component={Home}/>
        <Route path={process.env.PUBLIC_URL + '/results'} component={ResultsComponent}/>
      </Switch>
    );
  }
}

export default App;