import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import StatusIndicator from './StatusIndicator';

import '../../styles/Filters.css';
import AlignmentIndicator from './AlignmentIndicator';

class Filters extends Component {
  static formatLabel(item, facet) {
    if (facet.name === 'status') {
      return (
        <span>
          <StatusIndicator status={item.name} /> {item.label}
        </span>
      );
    } else if (facet.name === 'sequence') {
      return (
        <span>
          <AlignmentIndicator differenceName={item.name} /> {item.label}
        </span>
      );
    }
    return item.label;
  }

  isActive(facet, value) {
    return this.props.activeFacets[facet.name] === value;
  }

  render() {
    const { data } = this.props;

    return (
      <div className="filters">
        {data
          .filter(facet => 0 < facet.items.length)
          .map(facet => (
          <Fragment key={facet.name}>
            <h3>{facet.label}</h3>
            <ul className="no-bullet">
              {facet.items.map(item => (
                <li key={item.name}>
                  {this.isActive(facet, item.name) ? (
                    <a
                      className="filter__value filter__value--active"
                      onClick={() => this.props.removeFilter(facet.name)}
                    >
                      {Filters.formatLabel(item, facet)}
                    </a>
                  ) : (
                    <a
                      className="filter__value"
                      onClick={() => this.props.addFilter(facet.name, item.name)}
                    >
                      {Filters.formatLabel(item, facet)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    );
  }
}

Filters.propTypes = {
  data: PropTypes.array,
  activeFacets: PropTypes.object,
  removeFilter: PropTypes.func.isRequired,
  addFilter: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  data: [],
  activeFacets: {},
};

export default Filters;
