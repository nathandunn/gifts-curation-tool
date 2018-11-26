import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';

import Label from './Label';

class LabelsSection extends Component {
  state = {
    labels: [],
    labelsAvailable: [],
    addLabelMode: false,
  };

  constructor(props) {
    super(props);
    this.labelsListRef = React.createRef();
  }

  componentDidMount() {
    const { labels } = this.props;
    this.processLabels(labels);
  }

  componentDidUpdate(prevProps) {
    const { labels } = this.props;

    if (prevProps.labels !== labels) {
      this.processLabels(labels);
    }
  }

  processLabels = (labels) => {
    this.setState({
      labels: labels.filter(label => label.status).reverse(),
      labelsAvailable: labels.filter(label => !label.status),
    });
  };

  enableAddLabelMode = (e) => {
    this.setState({
      addLabelMode: true,
    });

    e.preventDefault();
    return false;
  };

  disableAddLabelMode = (e) => {
    this.setState({
      addLabelMode: false,
    });

    e.preventDefault();
    return false;
  };

  addLabel = () => {
    const { labels } = this.state;

    const {
      mappingId, isLoggedIn, history, cookies, afterChangeCallback,
    } = this.props;

    const labelId = this.labelsListRef.current.value;
    const apiURI = `${API_URL}/mapping/${mappingId}/labels/${labelId}/`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios
      .post(apiURI, {}, config)
      .then((response) => {
        this.setState({
          addLabelMode: false,
        });

        afterChangeCallback(mappingId, isLoggedIn);
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  deleteLabel = (labelId) => {
    const {
      mappingId, isLoggedIn, history, cookies, afterChangeCallback,
    } = this.props;

    const apiURI = `${API_URL}/mapping/${mappingId}/labels/${labelId}/`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios
      .delete(apiURI, config)
      .then((response) => {
        afterChangeCallback(mappingId, isLoggedIn);
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  render() {
    const { labels, labelsAvailable, addLabelMode } = this.state;

    const { isLoggedIn } = this.props;

    const AddLabelControl = () => (
      <div className="row">
        <div className="column medium-4">
          <select className="input-group-field" ref={this.labelsListRef}>
            {labelsAvailable.map(label => (
              <option value={`${label.id}`} key={`label-${label.id}`}>
                {label.label}
              </option>
            ))}
          </select>
        </div>
        <div className="column medium-8">
          <div className="button-group">
            <button className="button button--primary" onClick={this.addLabel}>
              Add
            </button>
            <button className="button button--secondary" onClick={this.disableAddLabelMode}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <Fragment>
        {labels.map(label => (
          <Label
            text={label.label}
            key={label.text}
            id={label.id}
            isLoggedIn={isLoggedIn}
            onDelete={this.deleteLabel}
          />
        ))}
        {isLoggedIn ? (
          addLabelMode ? (
            <AddLabelControl />
          ) : (
            <button className="button button--primary" href="#" onClick={this.enableAddLabelMode}>
              Add label
            </button>
          )
        ) : null}
      </Fragment>
    );
  }
}

export default withRouter(withCookies(LabelsSection));
