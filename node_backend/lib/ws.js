const webSocketServer = require('ws').Server;;

function wsServer(port) {
    const ws = new webSocketServer({port});
    // ws.on('connection', ws => console.log('WS'));
    return ws;
}

module.exports = wsServer;