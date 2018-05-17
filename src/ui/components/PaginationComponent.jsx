import React from 'react';
import PropTypes from 'prop-types';

class PaginationComponent extends React.Component {
    render() {
        return (
            <div>
                P-p-p-pagination.
            </div>
        );
    }
}


PaginationComponent.propTypes = {
    page: PropTypes.string
};

export default PaginationComponent;