import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/Label.scss';

const Label = props => (
  <span className="label primary">
    {props.text}
    {props.isLoggedIn ? (
      <button onClick={() => props.onDelete(props.id)}>
        <span className="label__close">&times;</span>
      </button>
    ) : null}
  </span>
);

Label.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Label;
