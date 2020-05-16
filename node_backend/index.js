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
    const set = [];
    for (let row of sheet) {
        const keys = R.compose(R.without('Intent'), R.keys)(row)
        for (let lang of keys) {
            const matches = row[lang].match(/{{(\w+)}}/gi);
            if (matches) {
                const asd = matchPhrases(row[lang], matches, collections[lang], 0, [])
                set.push(asd)   
            }
        }
    }
    console.log(R.flatten(set))
}

function matchPhrases (phrase, matches, data, index, trainingSet) {
    const cleanMatch = matches[index].replace(/{{|}}/gi, '')
    const values = data[cleanMatch];
    const tempSet = Object.assign([], trainingSet)
    for (let value of values) {
        const trainPhrase = phrase.replace(matches[index], value);
        if (matches[matches.length - 1] !== matches[index]) {
            const asd = matchPhrases(trainPhrase, matches, data, index + 1, trainingSet)
            tempSet.push(asd);
        } else {
            tempSet.push(trainPhrase);
        }
        if (matches.length < 1) {
            tempSet.push(trainPhrase)
        }
    }
    return R.flatten(tempSet);
}


server.listen(port, async () => {
    const {sheet, collections} = await loadEntities();
    
    train(sheet, collections)
    
});

// console.log(inspect({sheet}, false, null, true));