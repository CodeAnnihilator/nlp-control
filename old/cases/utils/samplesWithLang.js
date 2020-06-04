const R = require('ramda');

const samplesWithMetaText = require('./samplesWithMetaText');

const samplesWithLang = samples => R.filter(R.pipe(
    R.prop('entities'),
    R.find(R.whereEq({entity: 'language'}))
))(samplesWithMetaText(samples))

module.exports = samplesWithLang;