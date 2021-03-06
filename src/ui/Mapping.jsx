import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import decode from 'jwt-decode';

import LoadingSpinner from './components/LoadingSpinner';
import Alignment from './components/alignment/Alignment';
import CommentsSection from './components/comments/CommentsSection';
import LabelsSection from './components/label/LabelsSection';
import RelatedMappingsSection from './components/RelatedMappingsSection';
import StatusSection from './components/StatusSection';
import MappingHeader from './components/MappingHeader';

import '../styles/Mapping.scss';
import '../../node_modules/simplemde/dist/simplemde.min.css';

class Mapping extends Component {
  constructor(props) {
    super(props);

    const {
      match: { params },
      isLoggedIn,
    } = props;
    const { mappingId } = params;

    this.state = {
      ...this.state,
      mappingId,
    };

    this.getMappingDetails(mappingId, isLoggedIn);
  }

  state = {
    details: null,
    status: null,
    comments: null,
    isLoggedIn: null,
    mappingId: null,
    labels: null,
    showAlignment: true,
  };

  componentDidUpdate(prevProps) {
    const {
      match: { params },
      isLoggedIn,
      location,
    } = this.props;
    const { mappingId } = params;

    if (mappingId !== prevProps.match.params.mappingId) {
      this.getMappingDetails(mappingId, isLoggedIn);
    }
    if (location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value,
    });
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
      .catch(() => {
        history.push(`${BASE_URL}/error`);
      });
  };

  forceLoginIfTokenIsExpired = () => {
    const { cookies, tokenIsExpired } = this.props;
    const jwt = cookies.get('jwt') || undefined;
    let decoded = {};

    if (typeof jwt !== 'undefined' && jwt !== 'EXPIRED') {
      decoded = decode(jwt);
    }

    const utcNow = parseInt(new Date().getTime() / 1000, 10);

    if (typeof decoded.exp !== 'undefined' && decoded.exp - utcNow <= 0) {
      cookies.remove('authenticated', { path: '/' });
      cookies.set('jwt', 'EXPIRED', { path: '/' });

      tokenIsExpired();
      return false;
    }

    return true;
  };

  toggleDisplayAlignment() {
    const { showAlignment } = this.state;

    this.setState({
      showAlignment: !showAlignment,
    });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const {
      details,
      status,
      comments,
      isLoggedIn,
      labels,
      showAlignment,
    } = this.state;

    const { mapping, relatedEntries, taxonomy } = details;
    const { mappingId } = mapping;

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
          <button
            type="button"
            className="button"
            onClick={() => this.toggleDisplayAlignment()}
          >
            {(showAlignment) ? 'Hide ' : 'Show '}
            Alignment
          </button>
          {(showAlignment)
            // This 'mappingId' is set at a different time
            // from 'mapping.mappingId'
            // eslint-disable-next-line react/destructuring-assignment
            ? <Alignment mappingId={this.state.mappingId} />
            : null }
        </div>

        <div className="row column medium-12">
          <h3>Related Mappings</h3>
          <RelatedMappingsSection mappings={relatedEntries} />
        </div>

        <div className="row mapping__comments__wrapper">
          <div className="column medium-12">
            <CommentsSection
              mappingId={mappingId}
              isLoggedIn={isLoggedIn}
              comments={comments}
              mappingStatus={status}
              afterSaveCallback={this.getMappingDetails}
              onMappingStatusChange={this.onStatusChange}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

Mapping.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      mappingId: PropTypes.string,
    }),
  }).isRequired,
  tokenIsExpired: PropTypes.func.isRequired,
  cookies: PropTypes.shape({}).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
};

export default withCookies(withRouter(Mapping));
