import React from 'react';

import '../../styles/Comment.css';

const Comment = props => {



  return (
    <div className="comment row">
      <div className="column medium-12">
        <div className="comment__avatar">
          {props.details.user[0]}
        </div>
        <div className="comment__details">
          <span className="comment__username">
            {props.details.user}
          </span>
          <span className="comment__date">
            {props.details.timeAdded}
          </span>
          <p>{props.details.text}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
