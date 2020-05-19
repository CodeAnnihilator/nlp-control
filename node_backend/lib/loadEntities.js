const Wit = require('./node-wit-custom');
const SpreadSheet = require('./SpreadSheet');
const APIBackend = require('./APIBackend');

const {inspect} = require('util');

const env = {
    witToken: '3UHAVB3HX6QS3C4T2QHPZBNVZWQWRZ56',
    googleClientEmail: 'sheets@fa-nlp.iam.gserviceaccount.com',
    googlePrivateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtZzHPE+W+cvWz\nvUMVJNmDrzIJ01lwHRBAI3tzAjRZH8V2+AM8Qk3J0TIub4BQKx7gMWbx1WJlXfIt\nJDSzpZmpQNzy+9U42vwCzOKsNWuPDNLs9LJqbUGaJbQCVJGi1mK+wT7GYkIkTBVm\nGutmdutV0uucz8carWasmDAHb93BPW8ysjOneDpsaLriI0Er735TpBtd0VqR6oHb\nJ/IJ7YvyPTvr9HnGdRMfu7y+Pi4WZ/p6sxxMDxOov8rru0L6f4+HshFugb/rAcQq\nrAhXMo38M15AVRde2KD+/2tUtBt4iVFu8ohYQQU5891FUKxX73R2SBE/dyXOqbm7\nehknS0hdAgMBAAECggEAGNrQjSPHO8XrGXUQozx5sBIh3D4u1O7ZiDP9yyWe/sJa\n0btpbU78quehJ35EeFlB7vUt0g6ZsLlnT9ifdDuRm6zILszxill7I2SePfxXOzUl\nm6DUXQRlkZSDaY0ZJevQUhLNbm6hl+XO8Gh94t07TL0zl/HBUn3V2Hnk8n/ym3K4\nLCSUfX6eitD9Bh7Dpa/ZYq5ZuCTpmh2mIOHmZy+BgIUvQXXFsDGHb/ltQAzNdCWZ\nmcc9zZqlQ/Em3xhcPSwi7uxVZX9DNUEX9O7c+HFAj0kP4p5gdq2gA7Q3Ml6P5KDg\nK1huLO8bu2QQ3KByKLR9F7EccXpBshXEii/TUZVfcQKBgQDYi7yQaZBtbm1ZMqb2\nDh3SycJq2E2hYatuW+O0Ic5tqCCku3LdxF76Zg6f4sAdqZiupUzCbBOohSrs3YI1\n+0X6eWzM2D/JYc4ZkKtNoC0GVDpMDShqXi+plPWx09kRjOxmVgsvNu1UmXZaMSBQ\ny3Y9uQobXW1vBgu2l1JBS0vZ7QKBgQDM/yr66rOeYQkyKxtrF2a3jJY16EsQ9cie\nM/YU50y2f7moX/VWpv8xw1x7KEYixGITkWjzkVVxWZ/zU3GfvD/TsXZ/PrnoZ73X\nvnpbvxbHzMYOpTe5a9ciGIOA7O/9DxhCpUifyrt0cMb6Gq/c2Ww6FFrWV81+4VKD\neRA8YaaaMQKBgQDCZQddGPdH1dciOP97agbJ4MfAhPeDxZtREfqjDaoz9LeBSql+\nfjfJT+8XB0byGfrv5YK4Eq+/G/UB+IRZE36psXHDnun8TenoN2Ag6ocg5GIFPdan\nTnA5K3k5L3XxdHIQGHQn6YY66R0/MFTTUyONm1yAXmnMPkArpUJ5TTAFrQKBgGax\noZdnginiVJgETkz8wSFMVWeWAhzx89mFEE7yfFSkcZ5uy9nn+Mm2I5sy1sfN94/z\n9U6nTNVm36Em+THbPWJQcZtXEgziA5GTw3o4pTHcXI+zptHFu1VCUIaCq8rrB+1D\nHbmm9vdjE9rxCY6qgPQrhEICZFieihaAzGhjRvHRAoGBAJf2PXBSss2aUAEof0N5\n4fOVoZR2TLBAPKtZe0u5XIacXwijivcQ6fKvHVse2e7toyqtExOTa2Ty4r4B9fYw\nWamN9YLy6XlennTZbAglPs7YXjteZ9NZUnI36Vm23Guz3ZQH+eJpxCPQ95JjY7p/\npUBvIiJ7hK2gv1fUrebk3Blr\n-----END PRIVATE KEY-----\n',
    googleSpreadsheetId: '1xE8rBZZ7GXHaWnKYtF2p0L4hopBkVjtpQz4zvqpyhxs',
    APIBackendBaseURL: 'http://3.6.251.1:9889',
    APIBackendAccessToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Im15VmZNbUskOUFLcGojJU0qbSohQTJNTSVxeGVuaVRiMzNJdDYwcVBpWGxRcUFGWkZ2IiwiaWF0IjoxNTg4MTYzNDY2fQ.GOznJWMWDKLEXrTQ7hAfp4uSJ_72ONEoVESZBAniUdg'
}

const languages = ['english', 'hindi', 'marathi', 'telugu'];
const columns = ['intent'].concat(languages);

module.exports = async function loadEntities () {

    const WitInstance = new Wit({
        accessToken: env.witToken
    });

    // const values = [{
    //     text: 'టొమాటో గ్రేప్ లో కలుపు గురించి చెప్పండి',
    //     entities: [
    //         { entity: 'crop', value: 'గ్రేప్', start: 7, end: 13 },
    //         { entity: 'intent', value: 'Crop' }
    //     ]
    // }]

    // const values2 = [{
    //     "text": "I want to fly to sfo",
    //     "entities": [
    //       {
    //         "entity": "intent",
    //         "value": "flight_request"
    //       },
    //       {
    //         "entity": "wit$location",
    //         "start": 17,
    //         "end": 20,
    //         "value": "sfo"
    //       }
    //     ]
    // }]

    // const data = await WitInstance.post('samples', values)

    const SheetInstance = new SpreadSheet({
        client_email: env.googleClientEmail,
        private_key: env.googlePrivateKey,
        spreadsheet_id: env.googleSpreadsheetId
    });

    await SheetInstance.connect();

    const APIBackendInstance = new APIBackend({
        baseURL: env.APIBackendBaseURL,
        accessToken: env.APIBackendAccessToken
    })

    const sheet = await SheetInstance.fetch(0, columns);

    const collections = await APIBackendInstance.fetchCollections(sheet)

    return {sheet, collections};

}


