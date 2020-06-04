const R = require('ramda');
const Wit = require('./node-wit-custom');
const {inspect} = require('util');

const env = {
    witToken: 'XFMNNY7GUQDBWLWGVH4G5EIJJLI7KJ6Q'
}

const delay = time => new Promise((resolve) => setTimeout(resolve, time));

const train = async (entities, data) => {

    let iteration = data.length;
    const limit = 1;
    let count = 0;

    let date = new Date();

    const WitInstance = new Wit({
        accessToken: env.witToken
    });

    for (let entity of entities) {
        await WitInstance.post('entities', {id: entity})
    }

    while (true) {
        const time = Math.abs(date.getSeconds() - new Date().getSeconds());
        if (count > 150) {
            if (time < 60) {
                await delay((60 - time) * 1000)
                date = new Date();
                count = 0;
            }
        }
        const chunk = (iteration - limit) < 0 ? Math.abs(limit - iteration) : limit;
        await WitInstance.post('samples', data.slice(iteration - chunk, iteration));
        console.log(iteration)
        if ((iteration - limit) < 0 ) {
            console.log('done');
            break;
        };
        count++
        iteration = iteration - limit;
    }

}

module.exports = train;