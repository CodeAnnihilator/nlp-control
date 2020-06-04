const R = require('ramda');

/*

case #12: same phrase met more then once for certain combination
warning: same phrase X detected more then once for combination Y
resolution: update google sheet and validate again

*/

const case12 = () => {
    const uniqCombs = R.pipe(
        R.groupBy(R.prop('combination')),
        R.toPairs,
        R.map(([comb, data]) => {
          const phrases = R.pipe(
            R.reduce((c, n) => R.concat(c, [n.phrase]), []),
            R.filter(R.pipe(
              R.either(R.isNil, R.isEmpty),
              R.not
            )),
            R.groupBy(R.identity),
            R.toPairs,
            R.map(([prop, data]) => ([prop, data.length])),
            R.filter(([prop, count]) => count > 1),
            R.head
          )(data)
          if (!phrases) return;
          return {[comb]: R.head(phrases)}
        }),
        R.filter(R.pipe(
          R.either(R.isNil, R.isEmpty),
          R.not
        )),
      )
}

module.exports = case12;

