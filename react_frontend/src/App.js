import React, { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import LeftNav from 'common/components/LeftNav';

import 'index.css';

const client = new W3CWebSocket('ws://127.0.0.1:8001');

const App = () => {
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }, []);
  return (
    <Router>
      <LeftNav />
      <Switch>
          <Route path='/dashboard'>
            <span>dashboard</span>
          </Route>
          <Route path='/backups'>
            <span> backups</span>
          </Route>
          <Route path='/settings'>
            <span>settings</span>
          </Route>
          <Route path='/docs'>
            <span>docs</span>
          </Route>
          <Redirect exact from='/'to='/dashboard' />
        </Switch>
    </Router>
  )
}

export default App;