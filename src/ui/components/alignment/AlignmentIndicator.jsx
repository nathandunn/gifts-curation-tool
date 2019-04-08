import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/AlignmentIndicator.scss';

const AlignmentIndicator = (props) => {
  const {
    difference,
    differenceName,
  } = props;

  if (difference === null) {
    return (
      <span className="alignment-indicator  alignment-indicator--no-alignment" title="No alignment">
        -
      </span>
    );
  } else if (+difference === 0 || differenceName === 'identical') {
    return (
      <span className="alignment-indicator" title="Identical sequences">
        I
      </span>
    );
  } else if (+difference <= 5 || differenceName === 'small') {
    return (
      <span
        className="alignment-indicator alignment-indicator--small"
        title="Small difference between sequences"
      >
        S
      </span>
    );
  } else if (+difference > 5 || differenceName === 'large') {
    return (
      <span
        className="alignment-indicator alignment-indicator--large"
        title="Large difference between sequences"
      >
        L
      </span>
    );
  }
  return null;
};

AlignmentIndicator.propTypes = {
  difference: PropTypes.number,
  differenceName: PropTypes.string,
};

AlignmentIndicator.defaultProps = {
  difference: null,
  differenceName: '',
};

export default AlignmentIndicator;
