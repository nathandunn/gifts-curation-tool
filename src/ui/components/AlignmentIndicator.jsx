import React from 'react';

import '../../styles/AlignmentIndicator.css';

const AlignmentIndicator = (props) => {
  if (props.difference === null) {
    return null;
  } else if (+props.difference === 0) {
    return (
      <span className="alignment-indicator" title="Perfect sequence match">
        M
      </span>
    );
  } else if (+props.difference <= 10) {
    return (
      <span
        className="alignment-indicator alignment-indicator--small"
        title="Small difference between sequences"
      >
        S
      </span>
    );
  }
  return null;
};

export default AlignmentIndicator;
