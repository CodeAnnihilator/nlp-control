// import io from 'socket.io-client';
// import { eventChannel } from 'redux-saga';
// import { fork, take, call, put, cancel, delay, takeLatest } from 'redux-saga/effects';
// import actions from 'common/actions/socket';
// import logsActions from 'common/actions/logs'

// const sendMessage = (message) => ({
//     type: 'ASDADADAD',
//     payload: message
// })

// function connect() {
//   const socket = io('http://127.0.0.1:8000');
//   return new Promise(resolve => {
//     socket.on('connect', () => {
//       resolve(socket);
//     });
//   });
// }

// function subscribe(socket) {
//   return eventChannel(emit => {
//     socket.on('warning', message => {
//         console.log(message)
//         return emit(sendMessage(message))
//     });
//     socket.on('disconnect', e => {
//       // TODO: handle
//     });
//     return () => {};
//   });
// }

// function* read(socket) {
//   const channel = yield call(subscribe, socket);
//   while (true) {
//     const action = yield take(channel)
//     yield put(action)
//   }
// }

// function* write(socket) {
//   while (true) {
//     const { payload } = yield take(`${actions.sendMessage}`);
//     socket.emit('message', payload);
//   }
// }

// function* handleIO(socket) {
//   yield fork(read, socket);
//   yield fork(write, socket);
// }

// function* flow() {
//     const socket = yield call(connect);
//     const task = yield fork(handleIO, socket);
//     yield cancel(task);
// }

export default function* hangleLogs() {
//     yield delay(1000)
//   yield takeLatest('CONNECT', flow);
}