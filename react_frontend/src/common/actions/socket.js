import types from 'common/types/socket';

// const connectionSuccess = () => ({ type: types.CONNECTION_SUCCESS });
// const disconnectSuccess = () => ({ type: types.DISCONNECT_SUCCESS });

// const incomingEvent = event => ({
//     type: types.INCOMING_EVENT,
//     payload: event
// });

// const connectionError = message => ({
//     type: types.CONNECTION_ERROR,
//     payload: message
// });

const sendMessage = message => ({
    type: types.SEND_MESSAGE,
    payload: message
});

export default {
    sendMessage
    // connectionSuccess,
    // incomingEvent,
    // connectionError,
    // disconnectSuccess
};