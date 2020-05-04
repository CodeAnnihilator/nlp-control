const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const Wit = require('./lib/node-wit-custom');
const wsServer = require('./lib/ws')
const uuid = require('uuid');
const fs = require('fs');
const prune = require('json-prune');
const SpreadSheet = require('./lib/spreadsheet');
const _ = require('lodash');

const app = express();
const port = 8000;
const server = http.createServer(app);
const ws = new wsServer(8001);

app.use(cors());
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({ extended: true })
);

const witToken = '3UHAVB3HX6QS3C4T2QHPZBNVZWQWRZ56';
const googleClientEmail = 'sheets@fa-nlp.iam.gserviceaccount.com';
const googlePrivateKey = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtZzHPE+W+cvWz\nvUMVJNmDrzIJ01lwHRBAI3tzAjRZH8V2+AM8Qk3J0TIub4BQKx7gMWbx1WJlXfIt\nJDSzpZmpQNzy+9U42vwCzOKsNWuPDNLs9LJqbUGaJbQCVJGi1mK+wT7GYkIkTBVm\nGutmdutV0uucz8carWasmDAHb93BPW8ysjOneDpsaLriI0Er735TpBtd0VqR6oHb\nJ/IJ7YvyPTvr9HnGdRMfu7y+Pi4WZ/p6sxxMDxOov8rru0L6f4+HshFugb/rAcQq\nrAhXMo38M15AVRde2KD+/2tUtBt4iVFu8ohYQQU5891FUKxX73R2SBE/dyXOqbm7\nehknS0hdAgMBAAECggEAGNrQjSPHO8XrGXUQozx5sBIh3D4u1O7ZiDP9yyWe/sJa\n0btpbU78quehJ35EeFlB7vUt0g6ZsLlnT9ifdDuRm6zILszxill7I2SePfxXOzUl\nm6DUXQRlkZSDaY0ZJevQUhLNbm6hl+XO8Gh94t07TL0zl/HBUn3V2Hnk8n/ym3K4\nLCSUfX6eitD9Bh7Dpa/ZYq5ZuCTpmh2mIOHmZy+BgIUvQXXFsDGHb/ltQAzNdCWZ\nmcc9zZqlQ/Em3xhcPSwi7uxVZX9DNUEX9O7c+HFAj0kP4p5gdq2gA7Q3Ml6P5KDg\nK1huLO8bu2QQ3KByKLR9F7EccXpBshXEii/TUZVfcQKBgQDYi7yQaZBtbm1ZMqb2\nDh3SycJq2E2hYatuW+O0Ic5tqCCku3LdxF76Zg6f4sAdqZiupUzCbBOohSrs3YI1\n+0X6eWzM2D/JYc4ZkKtNoC0GVDpMDShqXi+plPWx09kRjOxmVgsvNu1UmXZaMSBQ\ny3Y9uQobXW1vBgu2l1JBS0vZ7QKBgQDM/yr66rOeYQkyKxtrF2a3jJY16EsQ9cie\nM/YU50y2f7moX/VWpv8xw1x7KEYixGITkWjzkVVxWZ/zU3GfvD/TsXZ/PrnoZ73X\nvnpbvxbHzMYOpTe5a9ciGIOA7O/9DxhCpUifyrt0cMb6Gq/c2Ww6FFrWV81+4VKD\neRA8YaaaMQKBgQDCZQddGPdH1dciOP97agbJ4MfAhPeDxZtREfqjDaoz9LeBSql+\nfjfJT+8XB0byGfrv5YK4Eq+/G/UB+IRZE36psXHDnun8TenoN2Ag6ocg5GIFPdan\nTnA5K3k5L3XxdHIQGHQn6YY66R0/MFTTUyONm1yAXmnMPkArpUJ5TTAFrQKBgGax\noZdnginiVJgETkz8wSFMVWeWAhzx89mFEE7yfFSkcZ5uy9nn+Mm2I5sy1sfN94/z\n9U6nTNVm36Em+THbPWJQcZtXEgziA5GTw3o4pTHcXI+zptHFu1VCUIaCq8rrB+1D\nHbmm9vdjE9rxCY6qgPQrhEICZFieihaAzGhjRvHRAoGBAJf2PXBSss2aUAEof0N5\n4fOVoZR2TLBAPKtZe0u5XIacXwijivcQ6fKvHVse2e7toyqtExOTa2Ty4r4B9fYw\nWamN9YLy6XlennTZbAglPs7YXjteZ9NZUnI36Vm23Guz3ZQH+eJpxCPQ95JjY7p/\npUBvIiJ7hK2gv1fUrebk3Blr\n-----END PRIVATE KEY-----\n';
const googleSpreadsheetId = '1xE8rBZZ7GXHaWnKYtF2p0L4hopBkVjtpQz4zvqpyhxs';

server.listen(port, async () => {

    // ws.on('connection', ws => {
    //     console.log('message')
    //     ws.send('MESSAGE!!!');
    // })

    let sampleOffset = 0;
    const backupId = uuid.v4();
    const samplesBackup = new Set();
    const spreadSheetBackup = [];

    console.log('STEP: [1/10]')
    console.log('setting up connection to Google cloud SpreadSheet');

    const googleSheet = await new SpreadSheet({
        client_email: googleClientEmail,
        private_key: googlePrivateKey,
        spreadsheet_id: googleSpreadsheetId
    }).connect();

    console.log('loading Google SpreadSheet data');

    const sheet = googleSheet.sheetsByIndex[0];
    const rows = await sheet.getRows();

    rows.forEach((row, i) => {
        const fields = ['combination', 'phrase', 'language', 'values', 'associations', 'intent'];
        const rowData = _.pick(row, fields);
        spreadSheetBackup.push(rowData);
    })

    console.log(`preparing googleSheet backup: ${backupId}`);

    await fs.writeFileSync(
        __dirname + `/backups/google-sheet-${backupId}.json`,
        prune([...spreadSheetBackup]),
        'utf-8'
    );

    const uniqCombs = _
        .chain(spreadSheetBackup)
        .map('combination')
        .uniq()
        .value();

    const detdLangs = _
        .chain(spreadSheetBackup)
        .groupBy('language')
        .toPairs()
        .map(_.first)
        .value();

    console.log(`detected languages: ${detdLangs}`);

    const combLangs = _
        .chain(spreadSheetBackup)
        .groupBy('combination')
        .map((c, i) => ({[i]: _.map(c, 'language')}))
        .omitBy('')
        .toArray()
        .value();

    const combLangsDupls = _
        .chain(combLangs)
        .map(c => _
            .chain(c)
            .values()
            .flattenDeep()
            .filter((val, i, iteratee) => _.includes(iteratee, val, i + 1))
            .map((l) => ({[_.keys(c)[0]]: [l]}))
            .value()
        )
        .map(v => {
            if (!v.length) return v;
            return _.reduce(v, (c, n) => {
                const key = _.keys(n)[0];
                if (!c.hasOwnProperty(key)) return c[key] = n[key], c;
                return c[key] = c[key].concat(n[key]), c;
            }, Object.assign({}))
        })
        .filter(_.size)
        .value();
        
    combLangsDupls.forEach(group => {
        for (comb in group) {
            group[comb].forEach(lang => {
                console.log(`combination ${comb} has duplication of language: ${lang}`);
            });
        };
    });

    combLangs.forEach(group => {
        for (comb in group) {
            const mLangs = detdLangs.filter(v => !group[comb].includes(v));
            mLangs.forEach(lang => {
                console.log(`detected missing language for combination ${comb}: ${lang}`);
            });
        };
    });

    console.log(`found unique combinations: ${uniqCombs.length}`);

    console.log('STEP: [2/10]');
    console.log('checking for validation issues');

    const emptyFieldsSrategy = (data, column) => {
        const emptyFields = data
            .map((row, index) => ({...row, position: index}))
            .filter(row => _.isEmpty(row[column]))
            .map(row => row.position);
        return {[column]: emptyFields};
    };

    const emptyFieldsLogStrategy = data => {
        for (group in data) {
            for (let i = 0; i < data[group].length; i++) {
                console.log(`empty ${group} cell detected at row: ${data[group][i] + 2}`)
            }
        }
    }

    const emptyCombFields = emptyFieldsSrategy(spreadSheetBackup, 'combination');
    emptyFieldsLogStrategy(emptyCombFields);

    const emptyPhraseFields = emptyFieldsSrategy(spreadSheetBackup, 'phrase');
    emptyFieldsLogStrategy(emptyPhraseFields);

    const emptyLangFields = emptyFieldsSrategy(spreadSheetBackup, 'language');
    emptyFieldsLogStrategy(emptyLangFields);

    const emptyValuesFields = emptyFieldsSrategy(spreadSheetBackup, 'values');
    emptyFieldsLogStrategy(emptyValuesFields);
    
    const emptyAssociationsFields = emptyFieldsSrategy(spreadSheetBackup, 'associations');
    emptyFieldsLogStrategy(emptyAssociationsFields);

    const emptyIntentFields = emptyFieldsSrategy(spreadSheetBackup, 'intent');
    emptyFieldsLogStrategy(emptyIntentFields);

    const combMissingIds =
        _.flattenDeep(
            uniqCombs
                .sort((a, b) => a - b)
                .filter(arr => arr)
                .reduce((c, n, i, arr) => {
                    if (!arr[i + 1]) return c;
                    const gap = Math.abs(n - arr[i + 1]) - 1;
                    const missingIds = Array(gap).fill().map((_, i) => i + parseInt(n, 10) + 1);
                    if (gap > 0) return c.push(missingIds), c;
                    return c;
                }, [])
        )

    combMissingIds.forEach(id => {
        console.log(`missing in-order combination: ${id}`)
    })

    const combRangeOrderIssues = uniqCombs.map(uniqCombn => {

        const positions = spreadSheetBackup.map((row, index) => {
            if (row.combination === uniqCombn) return parseInt(index, 10);
            return null;
        }).filter(el => el !== null);

        let tempPos = null;

        const issues = positions
            .sort((a, b) => a - b)
            .map((position, index) => {
                if (index === 0) tempPos = position;
                if (index > 0) {
                    const posGap = Math.abs(tempPos - positions[index]);
                    if (posGap === 1) tempPos = position;
                    if (posGap > 1) return {...spreadSheetBackup[position], position};
                }
                return null;
            }
        ).filter(Boolean);

        if (!issues.length) return null;
        return {[uniqCombn]: issues};

    }).filter(Boolean);

    combRangeOrderIssues.forEach(obj => {
        for (const group in obj) {
            obj[group].forEach(issue => {
                console.log(`element of group ${group} not in proper position at row: ${issue.position + 2}`)
            })
        }
    })

    console.log('STEP: [3/10]');
    console.log('setting up connection with WIT.ai');

    const witClient = new Wit({
        accessToken: witToken
    })

    console.log('pulling samples data');
    
    while (true) {
        const sample = await witClient
            .get(`samples?&offset=${sampleOffset}&limit=1`)
            .then(({data}) => data[0])
            .catch(console.error);
        if (!sample) break;
        console.log(`fetching sample: ${sample.id}, ${sample.text}`);
        samplesBackup.add(sample);
        sampleOffset++;
    }

    console.log(`total samples fetched: ${sampleOffset}`);

    console.log(`preparing samples backup: ${backupId}`);

    await fs.writeFileSync(
        __dirname + `/backups/samples-${backupId}.json`,
        prune([...samplesBackup]),
        'utf-8'
    );

    console.log('done');

});
