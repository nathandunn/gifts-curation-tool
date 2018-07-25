import React, { Component, Fragment } from 'react';

import '../../styles/Alignment.css';

class Alignment extends Component {

  alignments = [
    'MEASLGIQMDEPMAFSPQR--DRFQAEGSLKKNEQNFKLAGVKKDIEKLYEAVPQLSNVFKIEDKIGEGTFSSVYLATAQLQVGPEEKIALKHLIPTSHPIRIAAELQCLTVAGGQDNVMGVKYCFRKNDHVVIAMPYLEHESFLDILNSLSFQEVREYMLNLFKALKRIHQFGIVHRDVKPSNFLYNRRLKKYALVDFGLAQGTHDTKIELLKFVQSEAQQERCSQNKSHIITGNKIPLSGPVPKELDQQSTTKASVKRPYTNAQIQIKQGKDGKEGSVGLSVQRSVFGERNFNIHSSISHESPAVKLMKQSKTVDVLSRKLATKKKAISTKVMNSAVMRKTASSCPASLTCDCYATDKVCSICLSRRQQVAPRAGTPGFRAPEVLTKCPNQTTAIDMWSAGVIFLSLLSGRYPFYKASDDLTALAQIMTIRGSRETIQAAKTFGKSILCSKEVPAQDLRKLCERLRGMDSSTPKLTSDIQGHASHQPAISEKTDHKASCLVQTPPGQYSGNSFKKGDSNSCEHCFDEYNTNLEGWNEVPDEAYDLLDKLLDLNPASRITAEEALLHPFFKDMSL',
    '--------MEEPMAFSSLRGSDRCPADDSLKKYEQSVKLSGIKRDIEELCEAVPQLVNVFKIKDKIGEGTFSSVYLATAQLQEGHEEKIALKHLIPTSHPMRIAAELQCLTVAGGQDNVMGLKYCFRKNDHVVIAMPYLEHESFLDILNSLSFQEVREYMYNLFVALKRIHQFGIVHRDVKPSNFLYNRRLKKYALVDFGLAQGTRDTKIELLKFVQSEAQQEDCSRNKYHGVVGHKGLLSRPAPKTVDQQCTPKTSVKRSYTQ--VHIKQGKDGKERSVGLSVQRSVFGERNFNIHSSISHESPAEKLIKQSKTVDIISRKLATKKTAISTKAMNS-VMRETARSCPAVLTCDCYGSDRVCSVCLSRRQQVAPRAGTPGFRAPEVLTKCPDQTTAIDMWSAGVIFLSLLSGRYPFYKASDDLTALAQIMTIRGSRETIQAAKAFGKSVLCSKEVPAQDLRALCERLRGLDSTTPRSASGPPGNASYDPAASKNTDHKASRVQAAQA-QHSEDSLYKRDNDGYWSHPKDCTSNSEGWDSVPDEAYDLLDKLLDLNPASRITAEAALLHAFFKDMCS'
  ];

  alignmentIDs = ['UNP','ENS'];
  rowSize = 60;
  positions = undefined;
  startEndPosition = undefined;

  matchSequences = sequences => {
    const paired = sequences
      .reduce((accu, current) => {

        current.split('')
          .forEach((a, index) => {
            if ('[object Array]' !== Object.prototype.toString.call(accu[index])) {
              accu[index] = [];
            }

            accu[index].push(a);
          });

        return accu;
      }, []);

    return paired;
  }

  calculatePositions = (alignments, size) => {

    this.positions = alignments
      .map(seq => {
        let innerCounter = 0;

        return seq
          .split('')
          .map((x, index, array) => {
            return ('-' !== x)
              ? array[index] = ++innerCounter
              : null;
          })
      });

console.log(">> Positions:", this.positions);

    this.startEndPosition = alignments
      .map(seq => {
        return seq
          .match(new RegExp(`.{1,${size}}`, 'g'))
          .map(chunk => chunk.replace(/-/g, '').length)
          .reduce((accu, current, index, array) => {

              if (0 === index) {
                accu[0][1] = current;

                return accu;
              }

              accu[index] = [
                (accu[index - 1][1]) + 1,
                (accu[index - 1][1]) + current
              ];

            return accu;
          }, [[1, null]]);
      });

    // console.log("positions:", this.startEndPosition);
  }

  createAlignmentVisualization = () => {
    this.calculatePositions(this.alignments, this.rowSize);
    const alignment = this.matchSequences(this.alignments);

    const rows = alignment
      .reduce((accu, value, index, array) => {
        if (0 === index % this.rowSize) {
          accu.push(array.slice(index, index + this.rowSize));
        }

        return accu;
      }, []);

    return (
      <Fragment>
        <div id="alignment-hover-tooltip" className="alignment__hover-position__wrapper">
          <div id="positionA" className="alignment__hover-position alignment__hover-position__A"></div>
          <div id="positionB" className="alignment__hover-position alignment__hover-position__B"></div>
        </div>

        {rows.map((row, rowIndex) => {
// console.log("==> row index:", index, row);
          return (
            <div className="alignment__row" key={`row-${rowIndex}`}>
              <div className="alignment__id-wrapper">
                {this.alignmentIDs.map(id => (
                  <div className="alignment_id" key={`id-${id}:${rowIndex}`}>{id}</div>
                ))}
              </div>

              <div className="alignment__seqs">
                <div className="alignment__column alignment__start">
                  <div className="alignment__position">{this.startEndPosition[0][rowIndex][0]}</div>
                  <div className="alignment__position">{this.startEndPosition[1][rowIndex][0]}</div>
                </div>

                {row.map((el, cellIndex) => {
                  let extraCSSClasses = '';

                  if (el.join('') !== el[0].repeat(el.length)) {
                    extraCSSClasses = 'alignment__changed';

                    if (-1 !== el.indexOf('-')) {
                      extraCSSClasses = 'alignment__deleted';
                    }
                  }

                  return (
                    <div
                      className={`alignment__column ${extraCSSClasses}`}
                      onMouseEnter={this.showPosition}
                      position-a={el[0]}
                      position-b={el[1]}
                      row-index={`${rowIndex}`}
                      cell-index={`${cellIndex}`}
                      key={`col-${rowIndex}:${cellIndex}`}
                      >
                      {el.map((x, i) => <div className="alignment__cell" key={`cell-${i}-${rowIndex}:${cellIndex}`}>{x}</div>)}
                    </div>
                  );
                })}

                <div className="alignment__column alignment__end">
                  <div className="alignment__position">{this.startEndPosition[0][rowIndex][1]}</div>
                  <div className="alignment__position">{this.startEndPosition[1][rowIndex][1]}</div>
                </div>
              </div>
            </div>
          );
        })}
      </Fragment>
    );
  }

  showPosition = ({ currentTarget }) => {
    const tooltip = document.getElementById('alignment-hover-tooltip');
    const elementA = document.getElementById('positionA');
    const elementB = document.getElementById('positionB');

    const targetPosition = currentTarget.getBoundingClientRect();
    const positionA = currentTarget.getAttribute('position-a');
    const positionB = currentTarget.getAttribute('position-b');
    const rowIndex = parseInt(currentTarget.getAttribute('row-index'));
    const cellIndex = parseInt(currentTarget.getAttribute('cell-index'));
    const index = (rowIndex * this.rowSize) + cellIndex;
    const valueA = this.positions[0][index];
    const valueB = this.positions[1][index];

    elementA.innerHTML = (null !== valueA) ? `${positionA}:${valueA}` : '-';
    elementB.innerHTML = (null !== valueB) ? `${positionB}:${valueB}` : '-';

    tooltip.style.top = targetPosition.y + window.scrollY - 20 + 'px';
    tooltip.style.left = targetPosition.x + window.scrollX - 1 + 'px';
    tooltip.style.height = targetPosition.height + 40 + 'px';
    // tooltip.style.width = '60px';
    tooltip.style.display = 'block';
  }

  render() {
    return(
      <div className="alignment">
        {this.createAlignmentVisualization()}
      </div>
    );
  }
}

export default Alignment;
