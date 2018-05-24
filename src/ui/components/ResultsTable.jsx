import React from 'react';

function ResultsTable(props) {
  if (props.data.results) {
    return (
      <table>
        <thead>
          <tr>
            <th>Gene</th>
            <th>Transcript</th>
            <th>Start</th>
            <th>End</th>
            <th>Protein</th>
            <th>Organism</th>
          </tr>
        </thead>
        {props.data.results.map(row => (
          <tbody>
            {row.entryMapping.map(mapping => (
              <tr
                key={`${mapping.ensemblTranscript.enstId}_${mapping.uniprotEntry.uniprotAccession}`}
              >
                <td>
                  <a href={`//www.ensembl.org/id/${mapping.ensemblTranscript.enstId}`}>
                    {mapping.ensemblTranscript.enstId}
                  </a>
                </td>
                <td>{mapping.ensemblTranscript.ensgId}</td>
                <td>{mapping.ensemblTranscript.seqRegionStart}</td>
                <td>{mapping.ensemblTranscript.seqRegionEnd}</td>
                <td>
                  <a href={`//www.uniprot.org/uniprot/${mapping.uniprotEntry.uniprotAccession}`}>
                    {mapping.uniprotEntry.uniprotAccession}
                  </a>
                </td>
                <td>{row.taxonomy.specie}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    );
  }
  return <div>Loading</div>;
}

export default ResultsTable;
