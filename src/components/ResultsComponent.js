import React from 'react';

class ResultsComponent extends React.Component {
    render() {
        return (
            <main>
                <div>
                    Lots of results for {this.props.searchValue}!<br/>
                    <table>
                        <tr>
                            <td>ENST</td>
                            <td>ENSP</td>
                            <td>UniProt accession</td>
                            <td>organism</td>
                            <td>status</td>
                        </tr>
                    </table>
                </div>
            </main>
        );
    }
}

export default ResultsComponent;