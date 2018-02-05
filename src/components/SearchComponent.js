import React from 'react';
import PropTypes from 'prop-types';

class SearchComponent extends React.Component {
    render() {
        return (
            <div>
                <div className="input-group">
                    <input
                        defaultValue={this.props.default}
                        type="text"
                        placeholder="ENST00000620613, A7E2Y1, ..."
                        className="input-group-field"/>
                    <div className="input-group-button">
                        <button type="button" className="button" onClick={this.handleClick}>Submit</button>
                    </div>
                </div>
                <div className="home-banner__actions">
                    <a className="button">Explore mappings</a>
                </div>
            </div>
        );
    }

    handleClick = () => {
        window.location = '/results';
    }

}

SearchComponent.propTypes = {
    value: PropTypes.string,
    default: PropTypes.string,
};

export default SearchComponent;