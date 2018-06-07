import React, { Component, Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import axios from 'axios';
import Home from './Home';
import Mappings from './Mappings';
import Login from './Login';
import Header from './components/Header';
import '../styles/Gifts.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      searchResults: null,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(term) {
    const accession = term;
    const apiURI = `http://localhost:3000/gifts/mappings?searchTerm=${accession}`;
    axios.get(apiURI).then((response) => {
      this.setState({
        searchTerm: term,
        searchResults: response.data,
      });
      this.props.history.push('mappings');
    });
  }

  render() {
    const appProps = {
      ...this.state,
      handleSearch: this.handleSearch,
    };

    return (
      <Fragment>
        <Header {...appProps} />
        <section id="main-content-area" className="row" role="main">
          <div className="columns" id="root">
            <Switch>
              <Route exact path="/" render={() => <Home {...appProps} />} />
              <Route exact path="/mappings" render={() => <Mappings {...appProps} />} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default withRouter(App);
