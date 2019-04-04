import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/Label.scss';

const Label = (props) => {
  const {
    id,
    text,
    isLoggedIn,
    onDelete,
  } = props;

  return (
    <span className="label primary">
      {text}
      {isLoggedIn ? (
        <button
          onClick={() => onDelete(id)}
          type="button"
        >
          <span className="label__close">&times;</span>
        </button>
      ) : null}
    </span>
  );
};

Label.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Label;
