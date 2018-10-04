import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import decode from 'jwt-decode';

import LoadingSpinner from './components/LoadingSpinner';
import Alignment from './components/Alignment';
import CommentsSection from './components/CommentsSection';
import LabelsSection from './components/LabelsSection';
import RelatedMappingsSection from './components/RelatedMappingsSection';
import StatusSection from './components/StatusSection';
import MappingHeader from './components/MappingHeader';

import '../styles/Mapping.css';
import '../../node_modules/simplemde/dist/simplemde.min.css';

class Mapping extends Component {
  state = {
    details: null,
    status: null,
    comments: null,
    isLoggedIn: null,
    mappingId: null,
    labels: null,
  };

  componentDidMount() {
    const {
      match: { params },
      isLoggedIn,
    } = this.props;
    const { mappingId } = params;

    this.setState({
      mappingId,
    });

    this.getMappingDetails(mappingId, isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params },
      isLoggedIn,
    } = this.props;
    const { mappingId } = params;

    if (mappingId !== prevProps.match.params.mappingId) {
      this.getMappingDetails(mappingId, isLoggedIn);
    }
  }

  forceLoginIfTokenIsExpired = () => {
    console.log('force login props:', this.props);
    const { history, cookies, tokenIsExpired } = this.props;
    const jwt = cookies.get('jwt') || undefined;
    let decoded = {};

    if (typeof jwt !== 'undefined' && jwt !== 'EXPIRED') {
      decoded = decode(jwt);
    }

    const utcNow = parseInt(new Date().getTime() / 1000, 10);

    if (typeof decoded.exp !== 'undefined' && decoded.exp - utcNow <= 0) {
      console.log('<<<<<< token is expired >>>>>');

      cookies.remove('authenticated', { path: '/' });
      cookies.set('jwt', 'EXPIRED', { path: '/' });

      tokenIsExpired();
      return false;
    }

    return true;
  };

  getMappingDetails = (mappingId, isLoggedIn) => {
    const { history, cookies } = this.props;

    const tokenIsNotExpired = this.forceLoginIfTokenIsExpired();
    const config = {};
    const apiCalls = [
      axios.get(`${API_URL}/mapping/${mappingId}/?format=json`, config),
      axios.get(`${API_URL}/mapping/${mappingId}/labels/?format=json`, config),
    ];

    if (isLoggedIn && tokenIsNotExpired) {
      config.headers = {
        Authorization: `Bearer ${cookies.get('jwt')}`,
      };

      apiCalls.push(axios.get(`${API_URL}/mapping/${mappingId}/comments/?format=json`, config));
    }

    axios
      .all(apiCalls)
      .then(axios.spread((mappingResponse, labelsResponse, commentsResponse) => {
        const details = mappingResponse.data;
        const comments = (commentsResponse && commentsResponse.data.comments) || [];
        const { labels } = labelsResponse.data;
        const { status } = details.mapping;

        this.setState({
          details,
          status,
          labels,
          comments: comments.reverse(),
          isLoggedIn: isLoggedIn && tokenIsNotExpired,
        });
      }))
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value,
    });
  };

  render() {
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const {
      details, status, comments, isLoggedIn, labels,
    } = this.state;
    const { mapping, relatedMappings, taxonomy } = details;
    const { mappingId } = mapping;

    console.log('mapping state:', this.state);

    return (
      <Fragment>
        <div className="row column medium-12">
          <div className="status-wrapper">
            <StatusSection
              mappingId={mappingId}
              isLoggedIn={isLoggedIn}
              status={status}
              onChange={this.onStatusChange}
            />
          </div>
          <MappingHeader mapping={mapping} taxonomy={taxonomy} />
        </div>
        <div className="row column medium-12">
          <LabelsSection
            mappingId={mappingId}
            isLoggedIn={isLoggedIn}
            labels={labels}
            afterChangeCallback={this.getMappingDetails}
          />
        </div>

        <div className="row column medium-12">
          <h3>Alignment</h3>
          <Alignment mappingId={this.state.mappingId} />
        </div>

        <div className="row column medium-12">
          <h3>Related Mappings</h3>
          <RelatedMappingsSection mappings={relatedMappings} />
        </div>

        <div className="row mapping__comments__wrapper">
          <div className="column medium-12">
            <CommentsSection
              mappingId={mappingId}
              isLoggedIn={isLoggedIn}
              comments={comments}
              afterSaveCallback={this.getMappingDetails}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

// Mapping.propTypes = {};
// Mapping.defaultProps = {};

export default withCookies(withRouter(Mapping));
