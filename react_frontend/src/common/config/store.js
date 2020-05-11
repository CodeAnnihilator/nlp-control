import {applyMiddleware, createStore} from 'redux';
import {batchDispatchMiddleware, enableBatching} from 'redux-batched-actions';
import {composeWithDevTools} from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';

import createRootReducer from './mainReducer';
import rootSaga from './mainSaga';
import setupSocket from './socket';

const sagaMiddleware = createSagaMiddleware();
const rootReducer = createRootReducer();

const store = createStore(
	enableBatching(rootReducer),
	composeWithDevTools(
		applyMiddleware(
			sagaMiddleware,
			batchDispatchMiddleware,
		),
	),
);

const socket = setupSocket(store.dispatch)

sagaMiddleware.run(rootSaga, {socket});

export default store;