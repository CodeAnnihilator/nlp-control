const R = require('ramda');

function makePhraseEntities (intent, matches, phrase, collections, deepEntities=[], index=0) {
    const entity = matches[index].replace(/{{|}}/gi, '');
    const values = collections[entity];
    const startPos = phrase.indexOf(matches[index]);
    let phraseEntities = [];
    for (let value of values) {
        const updatedPhrase = phrase.replace(matches[index], value);
        const updatedDeepEntities = deepEntities.concat([
            {
                entity: entity,
                value: value,
                start: startPos,
                end: startPos + value.length
            },
        ])
        if (index < 1) {
            updatedDeepEntities.push({
                entity: 'intent',
                value: intent
            })
        }
        phraseEntities.push({text: updatedPhrase, entities: updatedDeepEntities})
        if (matches[matches.length - 1] !== matches[index]) {
            return makePhraseEntities(intent, matches, updatedPhrase, collections, updatedDeepEntities, index + 1);
        }
    }
    return phraseEntities
}

const trainingSet = async (sheet, collections) => {
    const trainingSet = [];
    for (let row of sheet) {
        const keys = R.keys(row)
        for (let lang of keys) {
            const matches = row[lang].match(/{{(\w+)}}/gi);
            if (matches) {
                const deeplyParsedPhraseEntities = makePhraseEntities(row['intent'], matches, row[lang], collections[lang]);
                trainingSet.push(deeplyParsedPhraseEntities) 
            } else {
                if (lang !== 'intent') {
                    trainingSet.push({
                        text: row[lang],
                        entities: [{
                            entity: 'intent',
                            value: row['intent']
                        }]
                    })
                }
            }
        }
    }
    return R.flatten(trainingSet);
}

module.exports = trainingSet;