const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const R = require('ramda');
const {inspect} = require('util');

const loadEntities = require('./lib/loadEntities');

const app = express();
const port = 8000;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const train = async (sheet, collections) => {
    const trainingSet = [];
    for (let row of sheet) {
        const keys = R.keys(row)
        for (let lang of keys) {
            const matches = row[lang].match(/{{(\w+)}}/gi);
            if (matches) {
                const deeplyParsedPhraseEntities = makePhraseEntities(row['Intent'], matches, row[lang], collections[lang]);
                trainingSet.push(deeplyParsedPhraseEntities) 
            } else {
                if (lang !== 'Intent') {
                    trainingSet.push({
                        text: row[lang],
                        entities: [{
                            entity: 'Intent',
                            value: row['Intent']
                        }]
                    })
                }
            }
        }
    }
    // console.log(R.flatten(trainingSet))
    console.log(inspect(R.flatten(trainingSet), false, null, true))
}

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
                entity: 'Intent',
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

server.listen(port, async () => {
    const {sheet, collections} = await loadEntities();
    
    train(sheet, collections)
    
});

// console.log(inspect({sheet}, false, null, true));