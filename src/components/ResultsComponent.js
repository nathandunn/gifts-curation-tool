import React from 'react';

class ResultsComponent extends React.Component {
    render() {
        return (
            <main>
                <div>
                    Lots of results for {this.props.searchValue}!<br/>
                    table<br/>
                    ENST, ENSP, UniProt accession (incl. isoforms), organism, status<br/>


                </div>
            </main>
        );
    }
}

export default ResultsComponent;