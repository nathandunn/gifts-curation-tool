import React, { Fragment } from 'react';

const SearchField = props => {

  const { searchTerm, handleSearchTermChange, handleSearchSubmit } = props;

  return(
    <Fragment>
      <div className="input-group">
        <input
          value={searchTerm}
          type="text"
          placeholder="ENST00000620613, A7E2Y1, ..."
          className="input-group-field"
          onChange={handleSearchTermChange}
        />
        <div className="input-group-button">
          <button type="button" className="button" onClick={handleSearchSubmit}>
            Submit
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default SearchField;
