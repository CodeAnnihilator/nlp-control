import React, { useEffect } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'common/config/store';
import LeftNav from 'common/components/LeftNav';
import Dashboard from 'modules/Dashboard';

import actions from 'common/actions/socket';

import 'index.css';

// const client = new W3CWebSocket('ws://127.0.0.1:8001');

const App = () => {
  useEffect(() => {
    store.dispatch({type: 'CONNECT'})
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <LeftNav />
        <div id='pageContainer'>
          <Switch>
              <Route path='/dashboard' render={() => <Dashboard />} />
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
        </div>
      </Router>
    </Provider>
  )
}

export default App;