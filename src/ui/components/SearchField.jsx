import React, { Component, Fragment } from 'react';

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.inputField = React.createRef();
  }

  render() {
    return (
      <Fragment>
        <form
          onSubmit={e => this.props.handleSearchSubmit(e, this.inputField.current.value)}
          className="input-group"
        >
          <input
            type="text"
            placeholder="ENST00000620613, A7E2Y1, ..."
            className="input-group-field"
            ref={this.inputField}
          />
          <div className="input-group-button">
            <button type="submit" className="button">
              Submit
            </button>
          </div>
        </form>
      </Fragment>
    );
  }
}

export default SearchField;
