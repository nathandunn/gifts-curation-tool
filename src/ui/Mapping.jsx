import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import SimpleMED from 'simplemde';

import LoadingSpinner from './components/LoadingSpinner';
import Alignment from './components/Alignment';
import Comment from './components/Comment';

import '../styles/Mapping.css';
import '../../node_modules/simplemde/dist/simplemde.min.css';

class Mapping extends Component {
  state = {
    details: null,
    status: null,
    comments: null,
    draftComment: '',
    labels: null,
    addLabelMode: false,
    draftLabel: null,
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
    this.labelTextInputRef = React.createRef();
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

    this.getMappingDetails(mappingId, isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    const { match: { params } } = this.props;
    const { mappingId } = params;
    const { isLoggedIn, draftComment } = this.state;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }

    // fix this re-render issue later
    this.textEditor && this.textEditor.render(document.getElementById('text-editor'));

    if (mappingId !== prevProps.match.params.mappingId) {
      this.getMappingDetails(mappingId, isLoggedIn);
    }
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
  }

  getMappingDetails = (mappingId, isLoggedIn) => {
    const { history, cookies } = this.props;
    const apiURI = `${API_URL}/mapping/${mappingId}/?format=json`;

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .get(apiURI, config)
      .then((response) => {
        const details = response.data;

        this.setState({
          details,
          isLoggedIn,
          status: details.mapping.status || 'NOT_REVIEWED',
          comments: details.mapping.comments || [],
          labels: details.mapping.labels || [],
        }, () => this.getMappingCommentsAndLabels(mappingId));
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  getMappingCommentsAndLabels = () => {
    this.setState({
      comments: [],
      labels: []
    })
  }

  __getMappingCommentsAndLabels = (mappingId) => {
    const { history, cookies } = this.props;
    const apiURI = `${API_URL}/comments/${mappingId}/?format=json`;

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .get(apiURI, config)
      .then(({ data }) => {
        const { comments, labels } = data;

        this.setState({
          comments: comments.reverse(),
          labels,
        });
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value,
    });
  }

  updateStatus = () => {
    const { mappingId, status } = this.state;
    const { history, cookies } = this.props;
    const apiURI = `${API_URL}/mapping/${mappingId}/status/`;
    const changes = {
      status,
    };
    // console.log("JWT cookie:", cookies.get('jwt'));
    //     const config = {
    //       withCredentials: true,
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${cookies.get('jwt')}`
    //       }
    //     };
    // axios.defaults.headers.common['Authorization'] = `Bearer ${cookies.get('jwt')}`;

    const config = {
      headers: { Authorization: `Bearer ${cookies.get('jwt')}` },
    };

    axios
      .put(apiURI, changes, config)
      .then((response) => {
        // should roll-back the state here if changes weren't saved
        console.log('-response:', response);
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  // this is not used anymore
  handleCommentTextChange = () => {
    console.log('text changed:', this.textEditor.value());
    // this.setState({
    //   draftComment: this.textEditor.value()
    // }, () => {
    //   console.log("after text change:", this.state.draftComment);
    // });
  }

  saveComment = () => {
    const { mappingId } = this.state;
    const { history, cookies } = this.props;

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
      .then((response) => {
        this.textEditor.value('');
        this.getMappingCommentsAndLabels(mappingId);
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  enableAddLabelMode = (e) => {
    this.setState({
      addLabelMode: true,
    }, () => {
      this.labelTextInputRef.current.focus();
    });

    e.preventDefault();
    return false;
  }

  onLabelEnter = (e) => {
    const { draftLabel } = this.state;

    if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
      this.addLabel(draftLabel);
    }
  }

  onLabelTextInputChange = ({ target }) => {
    this.setState({
      draftLabel: target.value.replace(/\s+/g, '-').toLowerCase(),
    });
  }

  addLabel = (label) => {
    const {
      draftLabel, labels, details, mappingId,
    } = this.state;
    const { history, cookies } = this.props;

    // labels.push(draftLabel);

    // this.setState({
    //   addLabelMode: false,
    //   draftLabel: '',
    //   labels
    // });

    const apiURI = `${API_URL}/mapping/${mappingId}/labels/`;

    const newLabel = {
      label,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios.post(apiURI, newLabel, config)
      .then((response) => {
        this.setState({
          addLabelMode: false,
          draftLabel: '',
        });

        this.getMappingCommentsAndLabels(mappingId);
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  deleteLabel = (label) => {
    const { mappingId } = this.state;
    const { history, cookies } = this.props;

    const apiURI = `${API_URL}/mapping/${mappingId}/labels/${label}/`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookies.get('jwt')}`,
      },
    };

    axios
      .delete(apiURI, config)
      .then((response) => {
        this.getMappingCommentsAndLabels(mappingId);
      })
      .catch((e) => {
        console.log(e.response);
        history.push('/error');
      });
  }

  render() {
    if (this.state.details === null) {
      return <LoadingSpinner />;
    }

    const {
      details,
      status,
      comments,
      draftComment,
      labels,
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
          <option value="" />
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
        <button onClick={() => this.deleteLabel(props.text)}>
          {(props.isLoggedIn) ? <span style={{ marginLeft: '0.3rem', color: '#FEFEFE', cursor: 'pointer' }}>&times;</span> : null }
        </button>
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
          <span>{props.uniprotAccession}</span>
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

    console.log('mapping state:', this.state);

    return (
      <Fragment>
        <div className="row mapping__alignment__header">
          <div className="column medium-12">
            <div className="column medium-8">&nbsp;</div>
            <div className="column medium-4">
              <div className="status-wrapper">
                <div className={`status status--${statusColour}`} />
                {(isLoggedIn) ? <StatusChangeControl /> : <StatusIndicator />}
              </div>
            </div>

            <div>
              {labels.reverse().map(label => <Label text={label.text} key={label.text} isLoggedIn={isLoggedIn} />)}
              {(isLoggedIn) ? (addLabelMode)
                  ? <input type="text" onKeyDown={this.onLabelEnter} onChange={this.onLabelTextInputChange} ref={this.labelTextInputRef} style={{ width: '10rem', display: 'inline-block' }} />
                  : <button href="#" onClick={this.enableAddLabelMode}>Add label</button>
                : null }
            </div>

            <div style={{ marginTop: '2rem' }}>
              <span style={mappingIdStyles}>
                {`${mapping.ensemblTranscript.enstId} (v${mapping.ensemblTranscript.enstVersion})`}
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
                {`${mapping.uniprotEntry.uniprotAccession} (v${mapping.uniprotEntry.sequenceVersion})`}
              </span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3>Related Mappings</h3>
              {relatedMappings.map(item => (<RelatedMapping
                id={item.mappingId}
                enstId={item.ensemblTranscript.enstId}
                uniprotAccession={item.uniprotEntry.uniprotAccession}
                key={item.mappingId}
              />))}
            </div>
          </div>
        </div>

        <div className="row mapping__alignment__wrapper">
          <div className="column medium-12">
            <Alignment />
          </div>
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
