import React, { Component, Fragment } from 'react';
import axios from 'axios';
import SimpleMED from 'simplemde';

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
    draftLabel: null
  }

  statusOptions = {
    "NOT_REVIEWED": "Not Reviewed",
    "UNDER_REVIEW": "Under Review",
    "REVIEWED": "Reviewd",
    "REJECTED": "Rejected",
  }

  textEditor = null;

  constructor(props) {
    super(props);
    this.labelTextInputRef = React.createRef();
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    const { mappingId } = params;

    const apiURI = `http://localhost:3000/api/mappings/get/${mappingId}`;
    axios.get(apiURI)
      .then(response => {
        const details = response.data[0];
        this.setState({
          details,
          status: details.mapping.status,
          comments: details.mapping.comments,
          labels: details.mapping.labels
        });
      });
  }

  componentDidUpdate() {
    if (null === this.textEditor) {
      this.textEditor = new SimpleMED({
        element: document.getElementById('text-editor'),
        initialValue: this.state.draftComment,
        hideIcons: ['image']
      });

      this.textEditor.codemirror.on('change', this.handleCommentTextChange);
    }
  }

  onStatusChange = ({ target }) => {
    this.setState({
      status: target.value
    });

    this.updateStatus(target.value);
  }

  updateStatus = status => {
    const { details } = this.state;
    const { id } = details;

    // const apiURI = `http://localhost:3000/api/mappings/${id}/status`;

    const apiURI = `http://localhost:3000/api/mappings/${id}`;
    let changes = { ...details };
    changes.mapping.status = status;

    axios.patch(apiURI, changes)
      .then(response => {
        // should roll-back the state here if changes weren't saved
      });
  }

  handleCommentTextChange = () => {
    this.setState({
      draftComment: this.textEditor.value()
    });
  }

  saveComment = () => {
    const { draftComment, details } = this.state;
    const { id } = this.state.details;
    let { comments } = this.state;

    // const apiURI = `http://localhost:3000/api/mappings/${id}/comments`;

    const apiURI = `http://localhost:3000/api/mappings/${id}`;

    comments.push({
      text: draftComment,
      timeAdded: "0001-02-03",
      user: "user-000"
    });

    this.setState({
      draftComment: '',
      comments
    });

    this.textEditor.value('');

    axios.patch(apiURI, details)
      .then(response => {
        // should roll-back the state here if changes weren't saved
      });
  }

  enableAddLabelMode = e => {
    this.setState({
      addLabelMode: true
    }, () => {
      this.labelTextInputRef.current.focus();
    });

    e.preventDefault();
    return false;
  }

  onLabelEnter = e => {
    const { draftLabel } = this.state;

    if (13 === e.keyCode || 13 === e.which || 'Enter' === e.key) {
      this.addLabel(draftLabel);
    }
  }

  onLabelTextInputChange = ({ target }) => {
    this.setState({
      draftLabel: target.value.replace(/\s+/g, '-').toLowerCase()
    });
  }

  addLabel = label => {
    const { draftLabel, labels, details } = this.state;
    const { id } = details;

    labels.push(draftLabel);

    this.setState({
      addLabelMode: false,
      draftLabel: '',
      labels
    });

    // const apiURI = `http://localhost:3000/api/mappings/${id}/labels`;

    const apiURI = `http://localhost:3000/api/mappings/${id}`;

    axios.patch(apiURI, details)
      .then(response => {
        // should roll-back the state here if changes weren't saved
      });
  }

  deleteLabel = label => {
    const { labels, details } = this.state;
    const { id } = details;
    const index = labels.indexOf(label);

    if (index < 0) {
      return false;
    }

    labels.splice(index, 1);

    this.setState({
      labels
    });

    // const apiURI = `http://localhost:3000/api/mappings/${id}/labels`;

    const apiURI = `http://localhost:3000/api/mappings/${id}`;
    let changes = { ...details };

    changes.mapping.labels = labels;

    axios.patch(apiURI, changes)
      .then(response => {
        // should roll-back the state here if changes weren't saved
      });
  }

  render() {

    if (null === this.state.details) {
      return null;
    }

    const {
      details,
      status,
      comments,
      draftComment,
      labels,
      addLabelMode
    } = this.state;
    const { mapping } = details;
    const { mappingId } = mapping;

    const statusList = Object.keys(this.statusOptions)
      .map(key => <option value={key} key={key}>{this.statusOptions[key]}</option>);

    let statusColour = undefined;

    switch (status) {
      case 'NOT_REVIEWED':  statusColour = 'unreviewed';    break;
      case 'UNDER_REVIEW':  statusColour = 'under-review';  break;
      case 'REVIEWED':      statusColour = 'accepted';      break;
      case 'REJECTED':      statusColour = 'rejected';      break;
    }

    const Label = props =>
      <span className="label primary">
        {props.text}
        <button onClick={() => this.deleteLabel(props.text)}>
          <span style={{ marginLeft: '0.3rem', color: '#FEFEFE', cursor: 'pointer' }}>&times;</span>
        </button>
      </span>;

    const mappingIdStyles = {
      fontSize: '2.5rem',
      lineHeight: '2.5rem',
      display: 'inline-block',
      verticalAlign: 'top'
    };

console.log("mapping state:", this.state);
    return (
      <Fragment>
        <div className="row" style={{ paddingTop: '2.5rem' }}>
          <div className="column medium-12">
            <div className="column medium-8">&nbsp;</div>
            <div className="column medium-4">
              <div>
                <div className={`status status--${statusColour}`}></div>
                <select
                  className="status-modifier"
                  onChange={this.onStatusChange}
                  value={status}
                >
                  <option value=""></option>
                  {statusList}
                </select>
              </div>
            </div>

            <div>
              {labels.map(label => <Label text={label} key={label} />)}
              {(addLabelMode)
                ? <input type="text" onKeyDown={this.onLabelEnter} onChange={this.onLabelTextInputChange} ref={this.labelTextInputRef} style={{ width: '10rem', display: 'inline-block' }} />
                : <a href="#" onClick={this.enableAddLabelMode}>Add label</a>
              }
            </div>
{/*
            <div style={{ height: '30vh' }}>
              <h2>Mapping</h2>
            </div>
 */}
            <div style={{marginTop: '2rem', height: '15vh'}}>
              <span style={mappingIdStyles}>
                {`${mapping.ensemblTranscript.ensgId} (v${mapping.ensemblTranscript.enstVersion})`}
              </span>
                
              <span dangerouslySetInnerHTML={{__html: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                   viewBox="0 0 200.423 200.423" style="enable-background:new 0 0 200.423 200.423; width: 100px; height: 50px;" xml:space="preserve">
                <g>
                  <polygon style="fill:#010002;" points="7.913,102.282 192.51,102.282 160.687,134.094 163.614,137.018 200.423,100.213 
                    163.614,63.405 160.687,66.325 192.51,98.145 7.913,98.145 39.725,66.332 36.798,63.405 0,100.213 36.798,137.018 39.725,134.101  
                    "/>
                </g>
              </svg>` }} />

              <span style={mappingIdStyles}>
                {`${mapping.uniprotEntry.uniprotAccession} (v${mapping.uniprotEntry.entryVersion})`}
              </span>
            </div>

            <div>
              {comments.map(comment => <Comment details={comment} key={`${comment.user}-${comment.timeAdded}-${Math.random()}`} />)}

              <div className="comment row">
                <div className="column medium-12">
                  <div className="comment__avatar">
                    ?
                  </div>
                  <div className="comment__details">
                    <textarea id="text-editor" onChange={this.handleCommentTextChange} value={draftComment}></textarea>
                    <button
                      className="button"
                      onClick={this.saveComment}
                      style={{ float: 'right' }}
                    >Add comment</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Fragment>
    );
  }
}

export default Mapping;
