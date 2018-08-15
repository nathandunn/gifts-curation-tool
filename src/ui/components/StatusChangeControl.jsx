import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';

class StatusChangeControl extends Component {

  updateStatus = () => {
    const {
      mappingId,
      status,
      history,
      cookies,
    } = this.props;

    const apiURI = `${API_URL}/mapping/${mappingId}/status/`;
    const changes = {
      status,
    };

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .put(apiURI, changes, config)
      .then(response => {})
      .catch(e => {
        console.log(e);
        history.push('/error');
      });
  }

  render() {
    const { options, onChange, status } = this.props;

    const statusList = Object.keys(options)
      .map(key => <option value={key} key={key}>{options[key]}</option>);

    return (
      <div className="input-group">
        <select
          className="status-modifier input-group-field"
          onChange={onChange}
          value={status}
        >
          {statusList}
        </select>
        <div className="input-group-button">
          <button className="button button--primary" onClick={this.updateStatus}>
              Save
          </button>
        </div>
      </div>
    )
  }
};

export default withRouter(withCookies(StatusChangeControl));
