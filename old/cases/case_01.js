const R = require('ramda');

const samplesWithMetaText = require('./utils/samplesWithMetaText');

/*

case #1 [X]: samples that do not have a language but match google sheet phrase
warning: sample phrase X does not have langugage Y
resolution: suggest to force train network

*/

const case1 = data => {

    const samplesWithNoLang = R.filter(R.pipe(
        R.prop('entities'),
        R.find(R.whereEq({entity: 'language'})),
        R.not
    ))(samplesWithMetaText(data.samples))
      
    const noLangSamplesMatchPhrases = R.curry((samples, sheet) => R.pipe(
        R.filter(({metaText}) => R.find(R.whereEq({phrase: metaText}))(sheet)),
        R.map(sample => {
            const {language} = R.find(R.whereEq({phrase: sample.metaText}))(sheet)
            return {...sample, language}
        })
    )(samples))(samplesWithNoLang, data.sheet)

    return noLangSamplesMatchPhrases;
}

module.exports = case1;

// const languages = R.pipe(
//     R.uniqBy(R.prop('language')),
//     R.map(R.prop('language')),
//     R.reject(R.isNil)
// )(data.sheet)


// const shape = {
//     id: '57195833189060029',
//     metaText: 'hello <person>',
//     intent: 'getPerson',
//     language: 'en',
//     trainedValues: ['man', 'buddy'],
//     unknownValues: ['mate']
// }