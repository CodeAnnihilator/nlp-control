const R = require('ramda');

const samplesWithLang = require('./utils/samplesWithLang');

/*

case #8 [X]: backend does not have a collection from google sheet
warning: collection X cannot be fetched from the backend
resolution: create collection on the backend and validate again

*/

const case8 = () => {
  
    const missingCollectionsOnBackend = R.curry((sheet, entities) => R.pipe(
        R.filter(R.pipe(
          R.prop('phrase'),
          R.either(R.isNil, R.isEmpty),
          R.not
        )),
        R.reduce((c, n) => {
          const sheetPhraseCollections = n.phrase
            .match(/<(\w+)>/gi)
            .map(collection => collection.replace(/<|>/gi, ''))
          for (let collection of sheetPhraseCollections) {
            R.isNil(c[collection])
              ? c[collection] = [n.language]
              : c[collection] = R.uniq(R.concat(c[collection], [n.language]))
          }
          return c
        }, {}),
        R.toPairs,
        R.map(([prop, langs]) => {
          const backendPropCollectns = R.keys(entities[prop])
          const missingValues = langs.filter(lang => backendPropCollectns.indexOf(lang) === -1)
          return {[prop]: missingValues}
          
        })
      )(sheet))
      
      missingCollectionsOnBackend(data.sheet, data.entities)
}

module.exports = case8;

