import React, {Component} from 'react';
import SearchComponent from './components/SearchComponent';
import FilterComponent from './components/FilterComponent';
import ResultsComponent from './components/ResultsComponent';
import PaginationComponent from './components/PaginationComponent';
import '../styles/Home.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            showResults: false
        };
        this.handler = this.handler.bind(this);
    }

    render() {
        let results = null;
        if (this.state.showResults) {
            results = <div>
                        <FilterComponent/>
                        <ResultsComponent searchValue={this.state.searchValue}/>
                        <PaginationComponent/>
                    </div>;
        }

        return (
            <main>
                <div className="row home-banner">
                    <div className="medium-offset-3 medium-6 text-center">
                        <h5>Helping biologists one mapping at a time</h5>
                        <SearchComponent default="blablabla" action={this.handler}/>
                        <div className="home-banner__actions">
                            <a className="button">Explore mappings</a>
                        </div>
                    </div>
                </div>

                {results}

                <div className="row">
                    <div className="column medium-3">
                        <h3>Some title</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="column medium-3">
                        <h3>Some title</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="column medium-3">
                        <h3>Some title</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="column medium-3">
                        <h3>Some title</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                            sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>
            </main>
        );
    }

    handler(searchValue) {
        this.setState({
            showResults: true,
            searchValue: searchValue
        });
    }
}

export default Home;