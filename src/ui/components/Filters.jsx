import React, { Fragment, Component } from 'react';
import Status from './Status';

class Filters extends Component {
  static formatLabel(item, facet) {
    if (facet.name === 'status') {
      return (
        <span>
          <Status status={item.name} /> {item.label}
        </span>
      );
    }
    return item.label;
  }

  isActive(facet, value) {
    return this.props.activeFacets[facet.name] === value;
  }

  render() {
    return (
      <Fragment>
        {this.props.data.map(facet => (
          <Fragment key={facet.name}>
            <h3>{facet.label}</h3>
            <ul className="no-bullet">
              {facet.items.map(item => (
                <li key={item.name}>
                  {this.isActive(facet, item.name) ? (
                    <a onClick={d => this.props.removeFilter(facet.name)}>
                      <strong>{Filters.formatLabel(item, facet)} X</strong>
                    </a>
                  ) : (
                    <a onClick={d => this.props.addFilter(facet.name, item.name)}>
                      {Filters.formatLabel(item, facet)}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </Fragment>
    );
  }
}

Filters.defaultProps = {
  data: [],
};

export default Filters;
