import React, { Fragment } from 'react';

function Filters(props) {
  return (
    <Fragment>
      {props.data.map(facet => (
        <Fragment key={facet.name}>
          <h3>{facet.label}</h3>
          <ul className="no-bullet">
            {facet.items.map(item => (
              <li key={item.name}>
                {item.active ? <strong>{item.label}</strong> : <a href="/">{item.label}</a>}
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
