import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/Message.scss';

const Message = (props) => {
  const {
    details,
    onClose,
  } = props;

  return (
    <div className={`message callout ${details.isError ? 'alert' : 'primary'}`}>
      <h5>{details.title}</h5>
      <p>{details.text}</p>
      <button onClick={onClose} className="close-button" aria-label="Dismiss alert" type="button">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

Message.propTypes = {
  details: PropTypes.shape({
    isError: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Message;
