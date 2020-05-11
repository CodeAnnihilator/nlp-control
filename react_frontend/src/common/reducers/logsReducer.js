import types from 'common/types/logs';

const initialState = {
    isFetching: false,
    data: [],
    issues: 0,
    collections: 0,
    languages: 0
}

function defineField (type) {
  if (type === 'warning') return 'issues';
  if (type === 'count.collections') return 'collections'
  if (type === 'count.languages') return 'languages'
}

export default function (state = initialState, action) {
  switch (action.type) {
    case types.SEND_LOG_WARNING:
      const {type} = action.payload;
      const field = defineField(type);
      return {
        ...state,
        data: state.data.concat(action.payload),
        [field]: state[field] + 1
      };
    default:
      return state;
  }
};