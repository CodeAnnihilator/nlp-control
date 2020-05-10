import axios from 'axios';

const fetch = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    crossDomain: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
      },
});

export default fetch;