import React from 'react';
import PropTypes from 'prop-types';

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            showResults: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    render() {

        return (
            <div>
                Current search value: {this.state.value}
                <div className="input-group">
                    <input
                        value={this.state.value}
                        type="text"
                        placeholder="ENST00000620613, A7E2Y1, ..."
                        className="input-group-field"
                        onChange={ this.handleChange }/>
                    <div className="input-group-button">
                        <button type="button" className="button" onClick={this.handleClick}>Submit</button>
                    </div>
                </div>
            </div>
        );
    }

    handleChange = (e) => {
        this.setState({value :e.target.value});
    }

    handleClick = () => {
        this.props.action(this.state.value);
    }

}

SearchComponent.propTypes = {
    value: PropTypes.string,
};

export default SearchComponent;