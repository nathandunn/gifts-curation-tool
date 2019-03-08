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
        group: 'status',
      },
      reviewed: {
        label: 'Reviewed',
        value: 'status:REVIEWED',
        order: 2,
        group: 'status',
      },
      uniprot_review: {
        label: 'UniProt Review',
        value: 'status:UNIPROT_REVIEW',
        order: 3,
        group: 'status',
      },
      under_review: {
        label: 'Under Review',
        value: 'status:UNDER_REVIEW',
        order: 4,
        group: 'status',
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
        group: 'organism',
      },
      10090: {
        label: 'Mus musculus',
        value: 'organism:10090',
        order: 2,
        group: 'organism',
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
        group: 'mappings',
        items: {
          identical: {
            label: 'Identical',
            value: 'alignment:identical',
            order: 1,
            group: 'alignment',
          },
          small: {
            label: 'Small Diff.',
            value: 'alignment:small',
            order: 2,
            group: 'alignment',
          },
          large: {
            label: 'Large Diff.',
            value: 'alignment:large',
            order: 3,
            group: 'alignment',
          },
        },
      },
      partial: {
        label: 'Partially Mapped',
        value: 'type:potentially_associated',
        order: 2,
        subheading: true,
        group: 'mappings',
        items: {
          by_gene: {
            label: 'By Gene',
            value: 'type:potentially_associated',
            order: 1,
            group: 'type',
          },
          by_isoform: {
            label: 'By Isoform',
            value: 'type:related_by_isoform',
            order: 2,
            group: 'type',
          },
        },
      },
      unmapped: {
        label: 'Unmapped',
        value: 'type:unmapped',
        order: 3,
        subheading: true,
        group: 'mappings',
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
        group: 'patches',
      },
      only: {
        label: 'Only Patches',
        value: 'patches:only',
        order: 2,
        group: 'patches',
      },
    },
  },
};

class Filters extends Component {
  heading = item => <h3>{`${item.label}`}</h3>;

  subheading = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    const childrenValues = Object.values(item.items)
      .map(i => i.value);

    return (
      <Fragment>
        <input
          id={`filter-${value}`}
          type="checkbox"
          className="filters__item--subheading"
          checked={(selectedFilters[group] && selectedFilters[group][value])}
          onChange={() => toggleFilter(item, childrenValues)}
        />
        <label htmlFor={`filter-${value}`}>{`${label}`}</label>
      </Fragment>
    );
  }

  item = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <Fragment>
        <input
          id={`filter-${value}`}
          type="checkbox"
          className="filters__item"
          checked={(selectedFilters[group] && selectedFilters[group][value])}
          onChange={() => toggleFilter(item)}
        />
        <label htmlFor={`filter-${value}`}>{`${label}`}</label>
      </Fragment>
    );
  }

  renderList = (list) => {
    return (
      <ul>
        {Object.values(list)
          .map((l) => {
            if (l.items) {
              return (
                <li key={l.value}>
                  {(l.heading)
                    ? this.heading(l)
                    : this.subheading(l)
                  }
                  {this.renderList(l.items)}
                </li>
              );
            }

            return <li key={l.value}>{this.item(l)}</li>;
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
    );
  }
}

Filters.propTypes = {
  selectedFilters: PropTypes.shape({}).isRequired,
  toggleFilter: PropTypes.func.isRequired,
};

Filters.defaultProps = {};

export default Filters;
