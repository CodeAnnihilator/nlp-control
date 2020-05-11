import io from 'socket.io-client';

import logsActions from 'common/actions/logs';

const setupSocket = dispatch => {
  const socket = io('http://127.0.0.1:8000');

  socket.on('warning', message => {
      dispatch(logsActions.sendLogWarning(message))
  })

  return socket;
}

export default setupSocket