const R = require('ramda');

const samplesWithLang = require('./utils/samplesWithLang');

/*

case #7: network does not have phrase from google sheet
info: network will be trained for phrase X using collections [Y, ...] for language Z
resolution: suggest to train network

*/

const case7 = () => {
  
  const samplesDoNotMatchPhrases = R.curry((samples, sheet) => R.pipe(
    R.filter(({metaText}) => !R.find(R.whereEq({phrase: metaText}))(sheet)),
  )(samples))

  return samplesDoNotMatchPhrases(samplesWithLang, data.sheet)
}

module.exports = case7;

