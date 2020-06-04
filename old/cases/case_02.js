const R = require('ramda');

const samplesWithMetaText = require('./utils/samplesWithMetaText');

/*

case #2 [X]: samples which are not in google sheet
description: new phrases that people ask for
warning: new phrase. add phrase X in google sheet
resolution: update google sheet and valiate again

*/

const case2 = data => {
    return R.curry((samples, sheet) => R.pipe(
        R.filter(({metaText}) => R.not(R.find(R.whereEq({phrase: metaText}))(sheet)))
    )(samples))(samplesWithMetaText(data.samples), data.sheet)
}

module.exports = case2;