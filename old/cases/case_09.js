const R = require('ramda');

const samplesWithLang = require('./utils/samplesWithLang');

/*

case #9: same collection used more then once as a parameter for the phrase
warning: same collection used in phrase X more then once
resolution: update google sheet and validate again

*/

const case9 = () => {
    const phraseCollectionDuplication = R.curry((sheet, entities) => R.pipe(
        R.map(row => {
          
          if (!row.phrase) return ''
          
          const collections = row.phrase
            .match(/<(\w+)>/gi)
            .map(c => c.replace(/<|>/gi, ''))
       
          const dupes = pipe(
            R.countBy(identity),
            R.toPairs,
            R.filter(([prop, count]) => count > 1),
            R.flatten
          )(collections)
          
          return dupes 
      
        }),
        R.filter(R.pipe(
          R.either(R.isNil, R.isEmpty),
          R.not
        )),
        R.map(R.head)
      )(sheet))
      
      phraseCollectionDuplication(data.sheet, data.entities)
}

module.exports = case9;
