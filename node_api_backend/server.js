const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 9000;
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const collections = {
    'person': ['mary', 'buddy', 'eugene'],
    'fruit': ['apple', 'peach', 'strawberry']
}

// app.get('/collections/:id?:lang', (req, res) => {
//     const {id} = req.params;
//     const {lang} = req.query;
//     res.json(collections[id]);
// })

app.get('/collections/:id/:lang', (req, res) => {
    const {id, lang} = req.params;
    res.json(collections[id]);
})

server.listen(port, () => {
    console.log(`api server is running on port ${port}`)
});