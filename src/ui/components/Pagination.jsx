import React, { Component, Fragment, Children, cloneElement } from 'react';

const Page = () => null;
const Item = () => null;
const Pager = () => null;
const Steps = () => null;
const Next = () => null;
const Previous = () => null;
const First = () => null;
const Last = () => null;
const PageSizes = () => null;

class Pagination extends Component {
  state = {
    currentPage: null,
    itemsPerPage: null,
    totalItems: null,
    items: null,
    loading: false,
  };

  innerComponents = null;
  loadingComponent = <h3>Loading...</h3>;
  buttonsTemplate = details => () => <button>{details.label}</button>;

  constructor(props) {
    super(props);
    const LoadingComponent = props.loader;

    if (typeof loader !== 'undefined') {
      this.loadingComponent = <LoadingComponent />;
    }
  }

  componentWillMount() {
    this.addPropsToState().then(() => {
      const { currentPage, itemsPerPage } = this.state;
      this.fetchPage(currentPage, itemsPerPage);
    });
  }

  componentDidMount() {
    this.prepareChildren();
  }

  fetchPage = (currentPage, itemsPerPage) => {
    const fetchPage = this.props.fetchPage || (() => []);

    this.pageWillLoad();

    fetchPage(currentPage, itemsPerPage).then((results) => {
      this.setState(
        {
          currentPage: parseInt(currentPage),
          items: results.results,
          totalItems: results.count,
        },
        this.pageDidLoad,
      );
    });
  };

  pageWillLoad() {
    const { beforeLoad } = this.props;

    this.setState(
      {
        loading: true,
      },
      () => {
        if (typeof beforeLoad === 'function') {
          beforeLoad();
        }

        this.prepareChildren();
      },
    );
  }

  pageDidLoad() {
    const { afterLoad } = this.props;

    this.setState(
      {
        loading: false,
      },
      () => {
        if (typeof afterLoad === 'function') {
          afterLoad();
        }

        this.prepareChildren();
      },
    );
  }

  async addPropsToState() {
    const { currentPage, itemsPerPage } = this.props;
    const state = {
      currentPage: parseInt(currentPage),
      itemsPerPage: parseInt(itemsPerPage),
    };

    return new Promise(resolve => this.setState(state, resolve));
  }

  prepareChildren = () => {
    const { loading } = this.state;
    const NoItems = this.props.empty || (() => null);

    if (loading) {
      this.innerComponents = this.loadingComponent;
      this.forceUpdate();
      return;
    }

    const replaceComponents = (comp) => {
      const children = comp.props && comp.props.children;
      let template = null;
      let NewComponent = null;

      // base cases
      if (typeof comp === 'string') {
        return comp;
      }

      if (typeof children === 'undefined') {
        if (Page === comp.type && Pager === comp.type) {
          return comp;
        }
      }

      switch (comp.type) {
        // 'break' statements are redundant, but are added for the extra clarity.
        case Pager:
          template = comp.props.template;

          if (template) {
            this.buttonsTemplate = template;
          }
        // No break here. Fall-through to the below case.

        // Wrapper Components
        case Page:
        case Pager:
          NewComponent = props => <Fragment>{props.children}</Fragment>;

          return cloneElement(<NewComponent />, {
            ...comp.props,
            children: Children.map(children, replaceComponents),
          });
          break;

        case Item:
          const { items } = this.state;
          console.log(items);
          template = comp.props.template;
          NewComponent =
            items !== null && items.length > 0 ? items.map(item => template(item)) : <NoItems />;

          return NewComponent;
          break;

        case Steps:
          template = comp.props.template || this.buttonsTemplate;
          return this.generateSteps(template);
          break;

        case Next:
        case Previous:
        case First:
        case Last:
          template = comp.props.template || this.buttonsTemplate;
          NewComponent = template({
            label: typeof children !== 'undefined' ? children : comp.type.name,
            onClick: (() => {
              switch (comp.type.name) {
                case 'Next':
                  return this.nextPage;
                case 'Previous':
                  return this.previousPage;
                case 'First':
                  return this.firstPage;
                case 'Last':
                  return this.lastPage;
              }
            })(),
          });

          return <NewComponent />;
          break;

        case PageSizes:
          let { options } = comp.props;
          template = comp.props.template || this.buttonsTemplate;

          if (typeof options === 'string') {
            options = options.split(',').map(size => parseInt(size));
          }

          return this.generatePageSizeOptions(options, template);
          break;

        default:
          return cloneElement(comp, {
            ...comp.props,
            children: Children.map(children, replaceComponents),
          });
      }
    };

    this.innerComponents = Children.map(this.props.children, replaceComponents);
    this.forceUpdate();
  };

  generateSteps = (template) => {
    const { itemsPerPage, totalItems, currentPage } = this.state;

    if (typeof totalItems !== 'number' || totalItems < 0) {
      return null;
    }

    if (typeof itemsPerPage !== 'number' || itemsPerPage < 0) {
      return null;
    }

    const howMany = parseInt(totalItems / itemsPerPage) + 1;
    let Step = null;

    if (howMany < 0 || isNaN(howMany)) {
      return null;
    }

    const steps = Array(howMany)
      .fill(null)
      .map((x, i) => {
        Step = template({
          label: i + 1,
          classes: i + 1 === currentPage ? 'success' : '',
          onClick: () => this.setPage(i + 1),
        });

        return <Step />;
      });

    return steps;
  };

  setPage = (page) => {
    const { itemsPerPage } = this.state;
    this.fetchPage(page, itemsPerPage);
  };

  nextPage = () => {
    let { currentPage, itemsPerPage, totalItems } = this.state;

    if (totalItems < currentPage * itemsPerPage) {
      return false;
    }

    this.setPage(++currentPage);
  };

  previousPage = () => {
    let { currentPage, itemsPerPage, totalItems } = this.state;

    if ((currentPage - 1) * itemsPerPage <= 0) {
      return false;
    }

    this.setPage(--currentPage);
  };

  firstPage = () => {
    this.setPage(1);
  };

  lastPage = () => {
    const { totalItems, itemsPerPage } = this.state;
    const page = totalItems / itemsPerPage + 1;
    this.setPage(page);
  };

  generatePageSizeOptions = (sizes, template) => {
    const { itemsPerPage } = this.state;
    let EachOption = null;
    sizes = sizes || [5, 10, 25];

    const options = sizes.map((x, i) => {
      EachOption = template({
        label: x,
        classes: x === itemsPerPage ? 'success' : '',
        onClick: () => this.setPageSize(x),
      });

      return <EachOption />;
    });

    return options;
  };

  setPageSize = (newPageSize) => {
    const { currentPage, totalItems } = this.state;
    const calculatedCurrentPage =
      totalItems < currentPage * newPageSize ? parseInt(totalItems / newPageSize + 1) : currentPage;

    this.setState(
      {
        itemsPerPage: parseInt(newPageSize),
      },
      () => {
        if (calculatedCurrentPage !== null) {
          this.setPage(calculatedCurrentPage);
        }

        this.prepareChildren();
      },
    );
  };

  render() {
    return <Fragment>{this.innerComponents}</Fragment>;
  }
}

module.exports = {
  Pagination,
  Page,
  Item,
  Pager,
  Steps,
  Next,
  Previous,
  First,
  Last,
  PageSizes,
};
