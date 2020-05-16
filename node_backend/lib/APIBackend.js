const fetch = require('isomorphic-fetch');
const R = require('ramda');

const {getUniqCollections} = require('./utils');

module.exports = class APIBackend {
    constructor({baseURL, accessToken}) {
        this.baseURL = baseURL;
        this.accessToken = accessToken;
    }
    #privateFetch = async subroute => await fetch(
        `${this.baseURL}/${subroute}`,
        {
            method: 'GET',
            headers: {
                'Authorization': this.accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        }
    )
    fetchCollections = async sheet => {
        const uniqCollections = getUniqCollections(sheet);
        const data = await Promise.all(uniqCollections.map(async collection => {
            const pairs = R.toPairs(collection);
            const lang = pairs.map(pair => R.head(pair));
            const data = await Promise.all(pairs.map(async ([lang, collections]) => {
                return await Promise.all(collections.map(async collection => {
                    const shortLang = lang.slice(0, 2).toLowerCase();
                    const data = await this
                        .#privateFetch(`collections/${collection}s/${shortLang}`) // remove plural form on the backend (s)
                        .then(response => response.json())
                    return {[collection]: data}
                }));
            }));
            return {[lang]: R.mergeAll(R.flatten(data))};
        }))
        return R.mergeAll(data);
    }
}