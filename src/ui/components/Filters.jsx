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

  render() {
    return (
      <Fragment>
        {this.props.data.map(facet => (
          <Fragment key={facet.name}>
            <h3>{facet.label}</h3>
            <ul className="no-bullet">
              {facet.items.map(item => (
                <li key={item.name}>
                  {item.active ? (
                    <strong>{Filters.formatLabel(item, facet)}</strong>
                  ) : (
                    <a onClick={d => console.log('hello')}>{Filters.formatLabel(item, facet)}</a>
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
