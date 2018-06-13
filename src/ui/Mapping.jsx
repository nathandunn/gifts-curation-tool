import React, { Component, Fragment } from 'react';
import axios from 'axios';

class Mapping extends Component {

  state = {
    details: null
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    const { mappingId } = params;

    const apiURI = `http://localhost:3000/api/mappings/get/${mappingId}`;
    axios.get(apiURI)
      .then(response => {
        this.setState({
          details: response.data[0]
        });
      });
  }

  onStatusChange = event => {
    console.log("status change:", event.target.value);
    const { details } = this.state;

    if (null === details) {
      return false;
    }

    if ('undefined' === typeof details.mapping || 'undefined' === typeof details.mapping.status) {
      return false;
    }

    let changes = { ...this.state };
    changes.details.mapping.status = event.target.value;

    this.updateDetails(changes);
  }

  updateDetails = changes => {
    const { id } = this.state.details;
    const apiURI = `http://localhost:3000/api/mappings/${id}`;
    axios.patch(apiURI, changes.details)
      .then(response => {
        this.setState({
          details: response.data
        });
      });
  }

  render() {
    const details = this.state.details || { mapping: {} };
    const mappingId = details.mapping.mappingId || null;
    const status = details.mapping.status || '';
console.log("mapping state:", this.state);
    return (
      <Fragment>
        <h2>Mapping</h2>
          <div className="row">
            <div className="column medium-2">
              Sidebar
            </div>
            <div className="column medium-10">
              <h2>Mapping {mappingId}</h2>
              <div>
                Status:
                <select
                  onChange={this.onStatusChange}
                  value={status}
                >
                  <option value=""></option>
                  <option value="NOT_REVIEWED">Not Reviewed</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="REVIEWED">Reviewd</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
      </Fragment>
    );
  }
}

export default Mapping;
