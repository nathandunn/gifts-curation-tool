import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

import '../../styles/Filters.css';

const filtersStructure = {
  status: {
    label: 'Status',
    value: 'status',
    order: 1,
    heading: true,
    items: {
      not_reviewed: {
        label: 'Not Reviewed',
        value: 'status:NOT_REVIEWED',
        order: 1,
      },
      reviewed: {
        label: 'Reviewed',
        value: 'status:REVIEWED',
        order: 2,
      },
      uniprot_review: {
        label: 'UniProt Review',
        value: 'status:UNIPROT_REVIEW',
        order: 3,
      },
      under_review: {
        label: 'Under Review',
        value: 'status:UNDER_REVIEW',
        order: 4,
      },
    },
  },
  organism: {
    label: 'Organism',
    value: 'organism',
    order: 2,
    heading: true,
    items: {
      9606: {
        label: 'Homo sapiens',
        value: 'organism:9606',
        order: 1,
      },
      10090: {
        label: 'Mus musculus',
        value: 'organism:10090',
        order: 2,
      },
    },
  },
  mappings: {
    label: 'Mappings',
    value: 'mappings',
    order: 3,
    heading: true,
    items: {
      mapped: {
        label: 'Mapped',
        value: 'type:mapped',
        order: 1,
        subheading: true,
        items: {
          identical: {
            label: 'Identical',
            value: 'alignment:identical',
            order: 1,
          },
          small: {
            label: 'Small Diff.',
            value: 'alignment:small',
            order: 2,
          },
          large: {
            label: 'Large Diff.',
            value: 'alignment:large',
            order: 3,
          },
        },
      },
      partial: {
        label: 'Partially Mapped',
        value: 'partial',
        order: 2,
        subheading: true,
        items: {
          by_gene: {
            label: 'By Gene',
            value: 'type:potentially_associated',
            order: 1,
          },
          by_isoform: {
            label: 'By Isoform',
            value: 'type:related_by_isoform',
            order: 2,
          },
        },
      },
      unmapped: {
        label: 'Unmapped',
        value: 'unmapped',
        order: 3,
        subheading: true,
      },
    },
  },
  patches: {
    label: 'Patches',
    value: 'patches',
    order: 4,
    heading: true,
    items: {
      exclude: {
        label: 'Exclude',
        value: 'patches:exclude',
        order: 1,
      },
      only: {
        label: 'Only Patches',
        value: 'patches:only',
        order: 2,
      },
    },
  },
};

class Filters extends Component {

  heading = (item) => {
    return (
      <h3>{`${item.label}`}</h3>
    );
  }

  subheading = (item) => {
    const childrenValues = Object.values(item.items)
      .map(i => i.value);
console.log("children values::", childrenValues);
    return (
      <Fragment>
        <input id={`filter-${item.value}`} type="checkbox" className="filters__item--subheading" />
        <label for={`filter-${item.value}`}>{`${item.label}`}</label>
      </Fragment>
    );
  }

  item = (item) => {
    return (
      <Fragment>
        <input id={`filter-${item.value}`} type="checkbox" className="filters__item" />
        <label for={`filter-${item.value}`}>{`${item.label}`}</label>
      </Fragment>
    );
  }

  handleSubheadingClick = () => {

  }

  renderList = (list) => {
    return (
      <ul>
        {Object.values(list)
          .map(l => {
            if (l.items) {
              return (
                <li>
                  {(l.heading)
                    ? this.heading(l)
                    : this.subheading(l)
                  }
                  {this.renderList(l.items)}
                </li>
              );
            }

            return <li>{this.item(l)}</li>
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div className="filters">
        {this.renderList(filtersStructure)}
      </div>
    )
  }
}

Filters.propTypes = {
};

Filters.defaultProps = {
};

export default Filters;
