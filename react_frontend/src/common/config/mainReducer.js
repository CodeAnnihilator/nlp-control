import {combineReducers} from 'redux';

import logsReducer from 'common/reducers/logsReducer';

const createRootReducer = () => combineReducers({
	logs: logsReducer,
});

export default createRootReducer;