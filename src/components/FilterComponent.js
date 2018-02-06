import React from 'react';
import PropTypes from 'prop-types';

class FilterComponent extends React.Component {
    render() {
        return (
            <div>
                Mighty filter.<br/>
                 - Organism dropbox<br/>
                 - Status dropbox<br/>
                 - Sequence length match input (validated - positive numbers)<br/>
            </div>
        );
    }
}

export default FilterComponent;