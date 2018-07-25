import React, { Fragment } from 'react';

const SearchField = (props) => {
  let input = '';
  const { handleSearchSubmit } = props;

  return (
    <Fragment>
      <form onSubmit={() => handleSearchSubmit(input)} className="input-group">
        <input
          type="text"
          placeholder="ENST00000620613, A7E2Y1, ..."
          className="input-group-field"
          ref={component => (input = component)}
        />
        <div className="input-group-button">
          <button type="submit" className="button">
            Submit
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default SearchField;
