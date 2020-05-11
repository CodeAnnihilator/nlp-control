import types from 'common/types/logs';

const sendLogWarning = message => ({
    type: types.SEND_LOG_WARNING,
    payload: message
});

export default {
    sendLogWarning
};