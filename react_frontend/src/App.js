import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import fetch from './config/fetch';

const client = new W3CWebSocket('ws://127.0.0.1:8001');

class App extends Component {
  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };

    
  }
  
  validate = () => client.send('validate');

  render() {
    return (
      <div>
        <br/>
        <button onClick={this.validate}>VALIDATE</button>
      </div>
    );
  }
}

export default App;