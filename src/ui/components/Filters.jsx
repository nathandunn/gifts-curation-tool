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
  chromosome: {
    label: 'Chromosome',
    value: 'chromosome',
    order: 5,
    specificTo: 'organism',
    items: {
      'organism:9606': {
        items: {
          1: {
            label: '1',
            value: '1',
            order: 1,
            group: 'chromosome',
          },
          2: {
            label: '2',
            value: '2',
            order: 2,
            group: 'chromosome',
          },
        }
      },
      'organism:10090': {
        items: {
          x: {
            label: 'x',
            value: 'X',
            order: 1,
            group: 'chromosome',
          },
          y: {
            label: 'y',
            value: 'Y',
            order: 2,
            group: 'chromosome',
          },
        }
      },
    }
  }
};

class Filters extends Component {
  createFilterHeading = item => <h3>{`${item.label}`}</h3>;

  createFilterSubHeading = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <Fragment>
        <input
          id={`filter-${value}`}
          type="checkbox"
          className="filters__item--subheading"
          defaultChecked={(selectedFilters[group] && selectedFilters[group][value])}
          onChange={() => toggleFilter(item)}
        />
        <label htmlFor={`filter-${value}`}>{`${label}`}</label>
      </Fragment>
    );
  }

  createSpecificToFilter = (item) => {
    const { selectedFilters } = this.props;
    const output = [];

    if (!selectedFilters[item.specificTo]) {
      return null;
    }

    output.push(this.createFilterHeading(item));

    Object.keys(item.items)
      .map((key) => {
        if (selectedFilters[item.specificTo][key]) {
          Object.values(item.items[key])
            .forEach((i) => {
              Object.values(i)
                .forEach((v) => {
                  output.push(this.createItem(v));
                });
            });
        }
      });

    return output;
  }

  createItem = (item) => {
    const { selectedFilters, toggleFilter } = this.props;
    const { label, value, group } = item;

    return (
      <Fragment>
        <input
          id={`filter-${value}`}
          type="checkbox"
          className="filters__item"
          defaultChecked={(selectedFilters[group] && selectedFilters[group][value])}
          onChange={() => toggleFilter(item)}
        />
        <label htmlFor={`filter-${value}`}>{`${label}`}</label>
      </Fragment>
    );
  }

  renderList = (list) => {
    
    const createListElement = (item) => {
      const output = [];

      if (item.heading) {
        output.push(this.createFilterHeading(item));
        output.push(this.renderList(item.items));
      } else if (item.subheading) {
        output.push(this.createFilterSubHeading(item));
        output.push(this.renderList(item.items));
      } else if (item.specificTo) {
        output.push(this.createSpecificToFilter(item));
      }

      return output;
    };

    return (
      <ul>
        {Object.values(list)
          .map((l) => {
            if (l.items) {
              return (
                <li key={l.value}>
                  {createListElement(l)}
                </li>
              );
            }

            return <li key={l.value}>{this.createItem(l)}</li>;
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


export default Filters;
