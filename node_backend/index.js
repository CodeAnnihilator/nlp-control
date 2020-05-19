const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const {inspect} = require('util');

const loadEntities = require('./lib/loadEntities');
const trainingSet = require('./lib/trainingSet');
const train = require('./lib/train');
const {uniqEntities} = require('./lib/utils');

const app = express();
const port = 8000;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(port, async () => {
    const {sheet, collections} = await loadEntities();
    const dataToTrain = await trainingSet(sheet, collections);
    // console.log(inspect(dataToTrain, false, null, true));
    const uniqSets = uniqEntities(sheet);
    await train(uniqSets, dataToTrain);
});

// console.log(inspect({sheet}, false, null, true));