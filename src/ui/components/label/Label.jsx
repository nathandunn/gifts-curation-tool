import React from 'react';

import '../../../styles/Label.css';

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

export default Label;
