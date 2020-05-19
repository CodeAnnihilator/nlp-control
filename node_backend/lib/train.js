const R = require('ramda');
const Wit = require('./node-wit-custom');

const env = {
    witToken: 'SC2JCX5V5VSSIIB2WUAINRVISE3FRVWA'
}

const delay = time => new Promise((resolve) => setTimeout(resolve, time));

const train = async (entities, data) => {

    let iteration = data.length;
    
    const WitInstance = new Wit({
            accessToken: env.witToken
        });

    for (let entity of entities) {
        await WitInstance.post('entities', {id: entity})
    }

    while (true) {
        const iterationTo = iteration - 30 < 0 ? Math.abs(30 - iteration) : 30;
        console.log(iteration)
        await WitInstance.post('samples', data.slice(iteration - iterationTo, iteration));
        if (iterationTo < 30) {
            console.log('done');
            break
        };
        await delay(70000)
        iteration = iteration - 30;
    }

}

module.exports = train;