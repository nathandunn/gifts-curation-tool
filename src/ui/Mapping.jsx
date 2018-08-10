import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import SimpleMED from 'simplemde';
import decode from 'jwt-decode';

import LoadingSpinner from './components/LoadingSpinner';
import Alignment from './components/Alignment';
import Comment from './components/Comment';
import ProteinReviewStatus from './components/ProteinReviewStatus';

import '../styles/Mapping.css';
import '../../node_modules/simplemde/dist/simplemde.min.css';

class Mapping extends Component {
  state = {
    details: null,
    status: null,
    comments: null,
    draftComment: '',
    labels: null,
    labelsAvailable: null,
    addLabelMode: false,
    isLoggedIn: null,
    mappingId: null,
  }

  statusOptions = {
    NOT_REVIEWED: 'Not Reviewed',
    UNDER_REVIEW: 'Under Review',
    REVIEWED: 'Reviewed',
    REJECTED: 'Rejected',
  }

  textEditor = null;

  constructor(props) {
    super(props);
    this.labelsListRef = React.createRef();
  }

  componentDidMount() {
    const { match: { params }, isLoggedIn } = this.props;
    const { mappingId } = params;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }

    this.setState({
      mappingId,
    });
console.log("isLoggedIn0:", isLoggedIn);
    this.getMappingDetails(mappingId, isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    const { match: { params }, isLoggedIn } = this.props;
    const { mappingId } = params;
    // const { isLoggedIn, draftComment } = this.state;
    const { draftComment } = this.state;
console.log("isLoggedIn1:", isLoggedIn);
    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }

    // fix this re-render issue later
    this.textEditor && this.textEditor.render(document.getElementById('text-editor'));

    if (mappingId !== prevProps.match.params.mappingId) {
      this.getMappingDetails(mappingId, isLoggedIn);
    }
  }

  forceLoginIfTokenIsExpired = () => {
    console.log("force login props:", this.props);
    const { history, cookies, tokenIsExpired } = this.props;
    const jwt = cookies.get('jwt') || undefined;
    let decoded = {};

    if ('undefined' !== typeof jwt && 'EXPIRED' !== jwt) {
      decoded = decode(jwt);
    }

    const utcNow = parseInt(new Date().getTime() / 1000, 10);

    if ('undefined' !== typeof decoded.exp && decoded.exp - utcNow <= 0) {
      console.log("<<<<<< token is expired >>>>>");

      cookies.remove('authenticated', { path: '/' });
      cookies.set('jwt', 'EXPIRED', { path: '/' });

      tokenIsExpired();
      return false;
    }

    return true;
  }

  createTextEditor = () => {
    const { draftComment } = this.state;
    const element = document.getElementById('text-editor');

    if (element === null) {
      return false;
    }

    this.textEditor = new SimpleMED({
      element,
      initialValue: draftComment,
      hideIcons: ['image'],
    });

    this.textEditor.codemirror.on('change', this.handleCommentTextChange);
  };

  getMappingDetails = (mappingId, isLoggedIn) => {
    const { history, cookies } = this.props;

    const tokenIsNotExpired = this.forceLoginIfTokenIsExpired();
    let config = {};
    let apiCalls = [
      axios.get(`${API_URL}/mapping/${mappingId}/?format=json`, config),
      axios.get(`${API_URL}/mapping/${mappingId}/labels/?format=json`, config),
    ];

    if (isLoggedIn && tokenIsNotExpired) {
      config.headers = {
        Authorization: `Bearer ${cookies.get('jwt')}`,
      };

      apiCalls.push(
        axios.get(`${API_URL}/mapping/${mappingId}/comments/?format=json`, config)
      );
    }

    axios
      .all(apiCalls)
      .then(axios.spread((mappingResponse, labelsResponse, commentsResponse) => {
        const details = mappingResponse.data;
        const comments = (commentsResponse && commentsResponse.data.comments) || [];
        const { labels } = labelsResponse.data;
        const { status } = details.mapping;
console.log("isLoggedIn2:", isLoggedIn);
        this.setState({
          isLoggedIn: isLoggedIn && tokenIsNotExpired,
          details,
          status,
          comments: comments.reverse(),
          labels: labels
            .filter(label => label.status).reverse(),
          labelsAvailable: labels.filter(label => !label.status),
        });
      }))
      .catch(e => {
        console.log(e);
        history.push('/error');
      });
  };

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value,
    });
  }

  updateStatus = () => {
    const { mappingId, status } = this.state;
    const { history, cookies, setMessage } = this.props;
    const apiURI = `${API_URL}/mapping/${mappingId}/status/`;
    const changes = {
      status,
    };

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .put(apiURI, changes, config)
      .then(response => {
        // setMessage(
        //   'Status updated',
        //   'A new status for this mapping is set now.',
        //   false,
        // );
      })
      .catch(e => {
        console.log(e.response);
        history.push('/error');
      });
  }

  // this is not used anymore
  handleCommentTextChange = () => {
    console.log('text changed:', this.textEditor.value());
  }

  saveComment = () => {
    const { mappingId } = this.state;
    const { history, cookies, setMessage, isLoggedIn } = this.props;

    const apiURI = `${API_URL}/mapping/${mappingId}/comments/`;
    const comment = {
      text: this.textEditor.value(),
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios.post(apiURI, comment, config)
      .then(response => {
        // setMessage(
        //   'New comment added',
        //   'Your comment is now added to the mapping.',
        //   false,
        // );

        this.textEditor.value('');
        this.getMappingDetails(mappingId, isLoggedIn);
      })
      .catch(e => {
        console.log(e.response);
        history.push('/error');
      });
  }

  enableAddLabelMode = e => {
    this.setState({
      addLabelMode: true,
    }, () => {
      // this.labelTextInputRef.current.focus();
    });

    e.preventDefault();
    return false;
  }

  disableAddLabelMode = e => {
    this.setState({
      addLabelMode: false,
    });

    e.preventDefault();
    return false;
  }

  addLabel = () => {
    const {
      labels,
      mappingId,
      isLoggedIn,
    } = this.state;
    const { history, cookies, setMessage } = this.props;
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
      .then(response => {
        // setMessage(
        //   'New label added',
        //   'A new label is assigned to this mapping.',
        //   false,
        // );

        this.setState({
          addLabelMode: false
        });

        this.getMappingDetails(mappingId, isLoggedIn);
      })
      .catch(e => {
        console.log(e.response);
        history.push('/error');
      });
  }

  deleteLabel = labelId => {
    const {
      mappingId,
      isLoggedIn,
    } = this.state;
    const { history, cookies, setMessage } = this.props;
    const apiURI = `${API_URL}/mapping/${mappingId}/labels/${labelId}/`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios
      .delete(apiURI, config)
      .then(response => {
        // setMessage(
        //   'Label deleted',
        //   'Label was successfuly unassigned.',
        //   false,
        // );

        this.getMappingDetails(mappingId, isLoggedIn);
      })
      .catch(e => {
        console.log(e.response);
        history.push('/error');
      });
  }

  render() {
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }
console.log("--mapping props:", this.props);
console.log("++mapping state:", this.state);
    const {
      details,
      status,
      comments,
      draftComment,
      labels,
      labelsAvailable,
      addLabelMode,
      isLoggedIn,
    } = this.state;
    const { mapping, relatedMappings } = details;
    const { mappingId } = mapping;

    const statusList = Object.keys(this.statusOptions)
      .map(key => <option value={key} key={key}>{this.statusOptions[key]}</option>);

    const StatusChangeControl = () => (
      <div className="input-group">
        <select
          className="status-modifier input-group-field"
          onChange={this.onStatusChange}
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
    );

    const StatusIndicator = () => <span id="status-indicator">{this.statusOptions[status]}</span>;

    let statusColour;

    switch (status) {
      case 'NOT_REVIEWED': statusColour = 'unreviewed'; break;
      case 'UNDER_REVIEW': statusColour = 'under-review'; break;
      case 'REVIEWED': statusColour = 'accepted'; break;
      case 'REJECTED': statusColour = 'rejected'; break;
    }

    const Label = props =>
      (<span className="label primary">
        {props.text}
        {(props.isLoggedIn) ?
          <button onClick={() => this.deleteLabel(props.id)}>
            <span style={{ marginLeft: '0.3rem', color: '#FEFEFE', cursor: 'pointer' }}>&times;</span>
          </button>
          : null }
       </span>);

    const mappingIdStyles = {
      fontSize: '2.5rem',
      lineHeight: '2.5rem',
      display: 'inline-block',
      verticalAlign: 'top',
    };

    const RelatedMapping = props => (
      <div className="related-mapping">
        <Link to={`/mapping/${props.id}`}>
          <span>{props.enstId}</span>
          <div
            style={{ display: 'inline-block' }}
            dangerouslySetInnerHTML={{
              __html: `
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 200.423 200.423" style="enable-background:new 0 0 200.423 200.423; width: 100px; height: 50px;" xml:space="preserve">
                  <g>
                    <polygon style="fill:#010002;" points="7.913,102.282 192.51,102.282 160.687,134.094 163.614,137.018 200.423,100.213 
                      163.614,63.405 160.687,66.325 192.51,98.145 7.913,98.145 39.725,66.332 36.798,63.405 0,100.213 36.798,137.018 39.725,134.101  
                      "/>
                  </g>
                </svg>`,
          }}
          />
          <span><ProteinReviewStatus entryType={props.entryType}/>{props.uniprotAccession}</span>
        </Link>
      </div>
    );

    const CommentsSection = () => (
      <div style={{ marginTop: '3rem' }}>
        {comments.map(comment => <Comment details={comment} key={`${comment.user}-${comment.timeAdded}-${Math.random()}`} />)}

        <div className="comment row">
          <div className="column medium-12">
            <div className="comment__avatar">
                ?
            </div>
            <div className="comment__details">
              <textarea id="text-editor" onChange={this.handleCommentTextChange} value={draftComment} />
              <button
                className="button"
                onClick={this.saveComment}
                style={{ float: 'right' }}
              >Add comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const AddLabelControl = () => (
      <div className="row">
        <div className="column medium-4">
          <select className="input-group-field" ref={this.labelsListRef}>
            {labelsAvailable.map(label => <option value={`${label.id}`} key={`label-${label.id}`}>{label.label}</option>)}
          </select>
        </div>
        <div className="column medium-8">
          <div className="button-group">
            <button className="button button--primary" onClick={this.addLabel}>Add</button>
            <button className="button button--secondary" onClick={this.disableAddLabelMode}>Cancel</button>
          </div>
        </div>
      </div>
    );

    console.log('mapping state:', this.state);

    return (
      <Fragment>
          <div className="row">
            <div className="column medium-9">
              <span style={mappingIdStyles}>
                <Link to={`//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`} target="_blank">{`${mapping.ensemblTranscript.enstId} (v${mapping.ensemblTranscript.enstVersion})`}</Link>
              </span>

              <span dangerouslySetInnerHTML={{
                __html: `
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                       viewBox="0 0 200.423 200.423" style="enable-background:new 0 0 200.423 200.423; width: 100px; height: 50px;" xml:space="preserve">
                    <g>
                      <polygon style="fill:#010002;" points="7.913,102.282 192.51,102.282 160.687,134.094 163.614,137.018 200.423,100.213 
                        163.614,63.405 160.687,66.325 192.51,98.145 7.913,98.145 39.725,66.332 36.798,63.405 0,100.213 36.798,137.018 39.725,134.101  
                        "/>
                    </g>
                  </svg>`,
              }}
              />

              <span style={mappingIdStyles}>
                <Link to={`//www.uniprot.org/uniprot/${mapping.uniprotEntry.uniprotAccession}`} target="_blank">{`${mapping.uniprotEntry.uniprotAccession} (v${mapping.uniprotEntry.sequenceVersion})`}</Link>
              </span>
            </div>
            <div className="column medium-3">
              <div className="status-wrapper">
                <div className={`status status--${statusColour}`} />
                {(isLoggedIn) ? <StatusChangeControl /> : <StatusIndicator />}
              </div>
            </div>
            </div>
            <div className="row column medium-12">
              {labels.map(label => <Label text={label.label} key={label.text} id={label.id} isLoggedIn={isLoggedIn} />)}
              {(isLoggedIn) ? (addLabelMode)
                  ? <AddLabelControl />
                  : <button className="button button--primary" href="#" onClick={this.enableAddLabelMode}>Add label</button>
                : null }
            </div>
            <div className="row column medium-12">
              <h3>Related Mappings</h3>
              <div className="related-mappings">
              {relatedMappings.map(item => (<RelatedMapping
                id={item.mappingId}
                enstId={item.ensemblTranscript.enstId}
                uniprotAccession={item.uniprotEntry.uniprotAccession}
                entryType={item.uniprotEntry.entryType}
                key={item.mappingId}
              />))}
              </div>
            </div>
        
        <div className="row column medium-12">
          <h3>Alignment</h3>
          <Alignment mappingId={this.state.mappingId} />
        </div>

        <div className="row mapping__comments__wrapper">
          <div className="column medium-12">
            {(isLoggedIn) ? <CommentsSection /> : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

Mapping.propTypes = {
  // searchTerm: PropTypes.string,
};

Mapping.defaultProps = {
  // searchTerm: '',
};

export default withCookies(withRouter(Mapping));
