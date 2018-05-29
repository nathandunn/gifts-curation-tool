import React, { Fragment } from 'react';
import Status from './Status';

function formatLabel(item, facet) {
  if (facet.name === 'status') {
    return (
      <span>
        <Status status={item.name} /> {item.label}
      </span>
    );
  }
  return item.label;
}

function Filters(props) {
  return (
    <Fragment>
      {props.data.map(facet => (
        <Fragment key={facet.name}>
          <h3>{facet.label}</h3>
          <ul className="no-bullet">
            {facet.items.map(item => (
              <li key={item.name}>
                {item.active ? (
                  <strong>{formatLabel(item, facet)}</strong>
                ) : (
                  <a href="/">{formatLabel(item, facet)}</a>
                )}
              </li>
            ))}
          </ul>
        </Fragment>
      ))}
    </Fragment>
  );
}

Filters.defaultProps = {
  data: [],
};

export default Filters;
