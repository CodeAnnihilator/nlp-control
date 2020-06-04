const R = require('ramda');

const samplesWithMetaText = R.map(sample => {
    const metaText = R.reduce((c, n) => {
        if (n.entity === 'intent') return c
        return c.replace(new RegExp(n.value), `<${n.entity}>`)
    }, sample.text)(sample.entities)
    return {...sample, metaText}
})(data.samples)

module.exports = samplesWithMetaText;