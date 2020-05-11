import types from 'common/types/logs';

const initialState = {
    isFetching: false,
    data: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SEND_LOG_WARNING:
      return {...state, data: state.data.concat(action.payload)};
    default:
      return state;
  }
};