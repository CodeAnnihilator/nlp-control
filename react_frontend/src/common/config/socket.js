import io from 'socket.io-client';

import logsActions from 'common/actions/logs';

const setupSocket = dispatch => {
  const socket = io('http://127.0.0.1:8000');

  socket.on('warning', message => {
    dispatch(logsActions.sendLogWarning({type: 'warning', message}))
  })

  socket.on('info', message => {
    dispatch(logsActions.sendLogWarning({type: 'info', message}))
  })

  socket.on('count.collections', message => {
    dispatch(logsActions.sendLogWarning({type: 'count.collections'}))
  })

  socket.on('count.languages', message => {
    dispatch(logsActions.sendLogWarning({type: 'count.languages'}))
  })

  return socket;
}

export default setupSocket