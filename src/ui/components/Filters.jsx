import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

const filtersStructure = {
  status: {
    label: 'Status',
    value: 'status',
    items: {
      not_reviewed: {
        label: 'Not Reviewed',
        value: 'status:NOT_REVIEWED',
      },
      reviewed: {
        label: 'Reviewed',
        value: 'status:REVIEWED',
      },
      uniprot_review: {
        label: 'UniProt Review',
        value: 'status:UNIPROT_REVIEW',
      },
      under_review: {
        label: 'Under Review',
        value: 'status:UNDER_REVIEW',
      },
    },
  },
  organism: {
    label: 'Organism',
    value: 'organism',
    items: {
      9606: {
        label: 'Homo sapiens',
        value: 'organism:9606',
      },
      10090: {
        label: 'Mus musculus',
        value: 'organism:10090',
      },
    },
  },
  mappings: {
    label: 'Mappings',
    value: 'mappings',
    items: {
      mapped: {
        label: 'Mapped',
        value: 'type:mapped',
        items: {
          identical: {
            label: 'Identical',
            value: 'alignment:identical',
          },
          small: {
            label: 'Small Diff.',
            value: 'alignment:small',
          },
          large: {
            label: 'Large Diff.',
            value: 'alignment:large',
          },
        },
      },
      partial: {
        label: 'Partially Mapped',
        value: 'partial',
        items: {
          by_gene: {
            label: 'By Gene Symbol',
            value: 'type:potentially_associated',
          },
          by_isoform: {
            label: 'By Isoform',
            value: 'type:related_by_isoform',
          },
        },
      },
      unmapped: {
        label: 'Unmapped',
        value: 'unmapped',
      },
    },
  },
  patches: {
    label: 'Patches',
    value: 'patches',
    items: {
      exclude: {
        name: 'Exclude',
        value: 'patches:exclude',
      },
      only: {
        name: 'Only Patches',
        value: 'patches:only'
      },
    },
  },
};

class Filters extends Component {

  render() {
    return (
      <div className="filters">
        Filters
      </div>
    )
  }
}

Filters.propTypes = {
};

Filters.defaultProps = {
};

export default Filters;
