import React, { Component, Fragment } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import StatusIndicator from './StatusIndicator';
import StatusChangeControl from './StatusChangeControl';

class StatusSection extends Component {
  state = {
    statusOptions: [],
  };

  componentDidMount() {
    const apiURI = `${API_URL}/mappings/statuses`;
    axios.get(apiURI).then(d => this.setState({ statusOptions: d.data }));
  }

  render() {
    const {
      status, onChange, isLoggedIn, mappingId,
    } = this.props;
    const { statusOptions } = this.state;
    return (
      <Fragment>
        <StatusIndicator status={status} />
        {isLoggedIn ? (
          <StatusChangeControl
            mappingId={mappingId}
            status={status}
            options={statusOptions}
            onChange={onChange}
          />
        ) : (
          <span>{status}</span>
        )}
      </Fragment>
    );
  }
}

StatusSection.propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  mappingId: PropTypes.number.isRequired,
};

export default StatusSection;
