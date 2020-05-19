const fetch = require('isomorphic-fetch');
const httpsProxy = require('https-proxy-agent');

const witBaseURL = 'https://api.wit.ai';
const apiVersion = '20170307';

function Wit({accessToken}) {
    this.get = subroute => fetch(
        `${witBaseURL}/${subroute}`,
        {
            method: 'GET',
            proxy: httpsProxy(witBaseURL),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': `application/vnd.wit.${apiVersion}+json`,
            },
        }
    )
    .then(response => Promise.all([response.json(), response.status]))
    .then(response => ({data: response[0], status: response[1]}))

    this.post = (subroute, body) => fetch(
        `${witBaseURL}/${subroute}?v=${apiVersion}`,
        {
            method: 'POST',
            proxy: httpsProxy(witBaseURL),
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': `application/vnd.wit.${apiVersion}+json`,
            },
            body: JSON.stringify(body)
        }
    )
    .then(response => response)
};

module.exports = Wit;
