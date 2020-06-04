const R = require('ramda');

const case3 = require('./case3');

/*

case #6: sample matches google sheet but not whole collection of data
info: sample X will be used with params [Y, ...] to train network for language Z
resolution: suggest train network

*/

const case6 = () => {
    const trainSamples = R.filter(({unknownValues}) => {
        return R.pipe(
        R.keys,
        R.filter(key => R.length(unknownValues[key])),
        R.isEmpty,
        R.not
        )(unknownValues)
    })(case3)
    return trainSamples;
}

module.exports = case6;

