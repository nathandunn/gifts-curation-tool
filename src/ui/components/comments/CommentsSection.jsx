import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import SimpleMED from 'simplemde';

import Comment from './Comment';
import StatusSection from '../StatusSection';

import '../../../styles/CommentsSection.css';

class CommentsSection extends Component {
  state = {};

  textEditor = null;

  componentDidMount() {
    const { isLoggedIn } = this.props;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }
  }

  componentDidUpdate() {
    const { isLoggedIn, mappingId } = this.props;

    if (this.textEditor === null && isLoggedIn) {
      this.createTextEditor();
    }

    // fix this re-render issue later
    if (this.textEditor) {
      this.textEditor.render(document.getElementById('text-editor'));

      this.textEditor.value(localStorage.getItem(`comments-${mappingId}`) || '');
    }
  }

  createTextEditor = () => {
    const { mappingId } = this.props;
    const element = document.getElementById('text-editor');

    if (element === null) {
      return;
    }

    this.textEditor = new SimpleMED({
      element,
      initialValue: localStorage.getItem(`comments-${mappingId}`) || '',
      hideIcons: ['image'],
    });

    this.textEditor.codemirror.on('change', this.onCommentTextchange);
  };

  onCommentTextchange = () => {
    const { mappingId } = this.props;
    const text = this.textEditor.value();

    localStorage.setItem(`comments-${mappingId}`, text);
  }

  saveComment = () => {
    const {
      mappingId,
      isLoggedIn,
      history,
      cookies,
      afterSaveCallback,
    } = this.props;

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

    axios
      .post(apiURI, comment, config)
      .then(() => {
        this.textEditor.value('');
        afterSaveCallback(mappingId, isLoggedIn);

        localStorage.removeItem(`comments-${mappingId}`);
      })
      .catch((e) => {
        console.log(e);
        history.push(`${BASE_URL}/error`);
      });
  };

  render() {
    const {
      mappingId,
      isLoggedIn,
      comments,
      mappingStatus,
      onMappingStatusChange,
    } = this.props;

    if (isLoggedIn === false) {
      return null;
    }

    return (
      <div className="comments-section">
        {comments.map(comment => (
          <Comment
            details={comment}
            key={`${comment.user}-${comment.timeAdded}-${Math.random()}`}
          />
        ))}

        <div className="comment row">
          <div className="column medium-12">
            <div className="comment__avatar">?</div>
            <div className="comment__details">
              <div className="status-wrapper">
                <StatusSection
                  mappingId={mappingId}
                  isLoggedIn={isLoggedIn}
                  status={mappingStatus}
                  onChange={onMappingStatusChange}
                  editable={true}
                />
              </div>
              <textarea id="text-editor" />
              <button className="comments-section__save-button button" onClick={this.saveComment}>
                Add comment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CommentsSection.propTypes = {
  mappingStatus: PropTypes.string.isRequired,
  onMappingStatusChange: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  mappingId: PropTypes.number.isRequired,
  history: PropTypes.shape({}).isRequired,
  cookies: PropTypes.shape({}).isRequired,
  afterSaveCallback: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({})),
};

CommentsSection.defaultProps = {
  comments: [],
};

export default withRouter(withCookies(CommentsSection));
