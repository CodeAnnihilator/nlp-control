import {all, fork} from 'redux-saga/effects';

import logsSaga from 'common/sagas/logsSaga';

export default function* rootSaga() {
	yield all([
		fork(logsSaga)
	]);
}