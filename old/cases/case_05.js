const R = require('ramda');

const case3 = require('./case3');

/*

case #5 [X]: sample matches google sheet and whole collection
info: sample X trained already for values [Y, ...]
resolution: skip training

*/

const case5 = () => {
    const skipSamples = R.filter(({unknownValues}) => {
        return R.pipe(
        R.keys,
        R.filter(key => R.length(unknownValues[key])),
        R.isEmpty
        )(unknownValues)
    })(case3)
    return skipSamples;
}

module.exports = case5;

