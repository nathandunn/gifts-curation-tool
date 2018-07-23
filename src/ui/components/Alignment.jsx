import React, { Component, Fragment } from 'react';

import '../../styles/Alignment.css';

class Alignment extends Component {

  alignments = [
    'MEASLGIQMDEPMAFSPQR--DRFQAEGSLKKNEQNFKLAGVKKDIEKLYEAVPQLSNVFKIEDKIGEGTFSSVYLATAQLQVGPEEKIALKHLIPTSHPIRIAAELQCLTVAGGQDNVMGVKYCFRKNDHVVIAMPYLEHESFLDILNSLSFQEVREYMLNLFKALKRIHQFGIVHRDVKPSNFLYNRRLKKYALVDFGLAQGTHDTKIELLKFVQSEAQQERCSQNKSHIITGNKIPLSGPVPKELDQQSTTKASVKRPYTNAQIQIKQGKDGKEGSVGLSVQRSVFGERNFNIHSSISHESPAVKLMKQSKTVDVLSRKLATKKKAISTKVMNSAVMRKTASSCPASLTCDCYATDKVCSICLSRRQQVAPRAGTPGFRAPEVLTKCPNQTTAIDMWSAGVIFLSLLSGRYPFYKASDDLTALAQIMTIRGSRETIQAAKTFGKSILCSKEVPAQDLRKLCERLRGMDSSTPKLTSDIQGHASHQPAISEKTDHKASCLVQTPPGQYSGNSFKKGDSNSCEHCFDEYNTNLEGWNEVPDEAYDLLDKLLDLNPASRITAEEALLHPFFKDMSL',
    '--------MEEPMAFSSLRGSDRCPADDSLKKYEQSVKLSGIKRDIEELCEAVPQLVNVFKIKDKIGEGTFSSVYLATAQLQEGHEEKIALKHLIPTSHPMRIAAELQCLTVAGGQDNVMGLKYCFRKNDHVVIAMPYLEHESFLDILNSLSFQEVREYMYNLFVALKRIHQFGIVHRDVKPSNFLYNRRLKKYALVDFGLAQGTRDTKIELLKFVQSEAQQEDCSRNKYHGVVGHKGLLSRPAPKTVDQQCTPKTSVKRSYTQ--VHIKQGKDGKERSVGLSVQRSVFGERNFNIHSSISHESPAEKLIKQSKTVDIISRKLATKKTAISTKAMNS-VMRETARSCPAVLTCDCYGSDRVCSVCLSRRQQVAPRAGTPGFRAPEVLTKCPDQTTAIDMWSAGVIFLSLLSGRYPFYKASDDLTALAQIMTIRGSRETIQAAKAFGKSVLCSKEVPAQDLRALCERLRGLDSTTPRSASGPPGNASYDPAASKNTDHKASRVQAAQA-QHSEDSLYKRDNDGYWSHPKDCTSNSEGWDSVPDEAYDLLDKLLDLNPASRITAEAALLHAFFKDMCS'
  ];

  alignmentIDs = ['O00311 CDC7_HUMAN','Q9Z0H0 CDC7_MOUSE'];

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

  createAlignmentVisualization = () => {
    const alignment = this.matchSequences(this.alignments);

    const rowSize = 20;
    const rows = alignment
      .reduce((accu, value, index, array) => {
        if (0 === index % rowSize) {
          accu.push(array.slice(index, index + rowSize));
        }

        return accu;
      }, []);

console.log("ROWS:", rows);

    return (
      <Fragment>
        {rows.map(row => (
          <div className="alignment__row">
            <div className="alignment__id-wrapper">
              {this.alignmentIDs.map(id => (
                <div className="alignment_id">{id}</div>
              ))}
            </div>

            <div className="alignment__seqs">
              {row.map(el => {
                let extraCSSClasses = '';

                if (el.join('') !== el[0].repeat(el.length)) {
                  extraCSSClasses = 'alignment__changed';

                  if (-1 !== el.indexOf('-')) {
                    extraCSSClasses = 'alignment__deleted';
                  }
                }

                return (
                  <div className={`alignment__column ${extraCSSClasses}`}>
                    {el.map(i => <div className="alignment__cell">{i}</div>)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </Fragment>
    );
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
