import React from 'react';
import PaginationComponent from "./PaginationComponent";
import FilterComponent from "./FilterComponent";


class ResultsComponent extends React.Component {
    render() {
        return (
            <main>
                <FilterComponent/>
                <div>
                    Lots of results!
                </div>
                <PaginationComponent/>
            </main>
        );
    }
}

export default ResultsComponent;