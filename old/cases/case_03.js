const R = require('ramda');

const samplesWithLang = require('./utils/samplesWithLang');

/*

case #3 [X]: samples with params that match phrase but do not match collection of data
description: new values people ask for
warning: missing value X in collection of Y at phrase Z for language T
resolution: update database collection and validate again

*/

const case3 = data => {
    return R.curry((samples, entities) => R.pipe(
        R.groupBy(R.prop('metaText')),
        R.toPairs,
        R.map(v => {

            const trainedValues = R.pipe(
                R.last,
                R.map(R.prop('entities')),
                R.flatten,
                R.reject(R.propEq('entity', 'intent')),
                R.reject(R.propEq('entity', 'language')),
                R.groupBy(R.prop('entity')),
                R.toPairs,
                R.map(([prop, data]) => [prop, R.map(R.prop('value'))(data)]),
                R.fromPairs
            )(v)

            const language = R.pipe(
                R.last,
                R.head,
                R.prop('entities'),
                R.find(R.whereEq({entity: 'language'})),
                R.prop('value')
            )(v)

            const id = R.pipe(
                R.last,
                R.head,
                R.prop('id')
            )(v)

            const expectedEntities = R.head(v)
                .match(/<(\w+)>/gi)
                .map(entity => entity.replace(/<|>/gi, ''))

            const unknownValues = R.pipe(
                R.filter(v => R.path([v, language])(entities)),
                R.reduce((c, n) => {
                    const uniqLanguageEntities = R.without(trainedValues[n], entities[n][language])
                    return R.merge(c, {[n]: uniqLanguageEntities})
                }, {})
            )(expectedEntities)

            return {metaPhrase: R.head(v), trainedValues, language, id, expectedEntities, unknownValues}
        })
    )(samples))(samplesWithLang, data.entities)
}

module.exports = case3;
