const R = require('ramda');

/*

case #10 [X]: number of combinations does not match number of languages
warning: missing combination X for for language Y
resolution: update google sheet and validate again

*/

const case10 = () => {
    const uniqCombs = R.pipe(
        R.groupBy(R.prop('combination')),
        R.toPairs,
        R.map(([comb, data]) => {
          const shape = {[comb]: R.length(data)}
          const languages = R.pipe(
            R.reduce((c, n) => R.concat(c, [n.language]), []),
            R.uniq,
            R.length
          )(data)
          return {...shape, languages}
        })
      )
      
      uniqCombs(data.sheet)
}

module.exports = case10;

