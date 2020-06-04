const R = require('ramda');

const samplesWithLang = require('./utils/samplesWithLang');

/*

case #4 [X]: sample has intent that does not match google sheet intent, but match the phrase
warning: found different intent name X instead of Y in phrase Z for language T
resolution: suggest to force train network

*/

const case4 = data => {
    const samplesWithDifferentIntents = R.curry((samples, sheet) => R.pipe(
        R.map(sample => {

            const sampleIntent = R.pipe(
                R.prop('entities'),
                R.find(R.whereEq({entity: 'intent'})),
                R.prop('value')
            )(sample)

            const sheetSampleIntent = R.pipe(
                R.find(sheetSample => R.equals(sheetSample.phrase, sample.metaText)),
                R.prop('intent')
            )(sheet)

            return {...sample, sampleIntent, sheetSampleIntent}
        }),
        R.filter(R.pipe(
            R.prop('sheetSampleIntent'),
            R.either(R.isNil, R.isEmpty),
            R.not
        )),
        R.filter(sample => R.not(R.equals(sample.sampleIntent, sample.sheetSampleIntent)))

    )(samples))
    return samplesWithDifferentIntents(samplesWithLang, data.sheet)
}

module.exports = case4;

