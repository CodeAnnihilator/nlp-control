const R = require('ramda');

const getUniqCollections = sheet => R.pipe(
    R.map(row => {
        const keys = R.compose(
            R.without('intent'),
            R.keys
        )(row)
        return keys.map(key => {
            const matches = row[key].match(/{{(\w+)}}/gi);
            if (!matches) return null;
            const collections = matches.map(match => match.replace(/{{|}}/gi, ''));
            return {[key]: collections}
        })
    }),
    R.flatten,
    R.filter(R.pipe(
        R.either(R.isNil, R.isEmpty),
        R.not
    )),
    R.groupBy(R.keys),
    R.toPairs,
    R.map(([lang, values]) => {
        const uniqValues = R.pipe(
            R.uniq,
            R.map(R.values),
            R.flatten,
            R.flatten
        )(values)
        return {[lang]: uniqValues}
    })
)(sheet)

const uniqEntities = sheet => R.pipe(
    getUniqCollections,
    R.map(R.values),
    R.flatten,
    R.uniq
)(sheet)

module.exports = {
    getUniqCollections,
    uniqEntities
}