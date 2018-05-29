import React from 'react';
import { withRouter } from 'react-router-dom';

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleClick = () => {
    this.props.history.push({
      pathname: '/mappings',
      search: `?searchTerm=${this.state.searchTerm}`,
    });
  };

  render() {
    return (
      <div>
        <div className="input-group">
          <input
            value={this.state.searchTerm}
            type="text"
            placeholder="ENST00000620613, A7E2Y1, ..."
            className="input-group-field"
            onChange={this.handleChange}
          />
          <div className="input-group-button">
            <button type="button" className="button" onClick={this.handleClick}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SearchComponent);
