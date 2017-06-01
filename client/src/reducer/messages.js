import { chat as chatTypes } from '../actions/types';

const initialState = {};

function messages(state = initialState, action) {
  const newMessages = {};
  switch (action.type) {
    case chatTypes.addMessage:
      return {
        ...state,
        [action.value.message._id]: action.value.message,
      };
    case chatTypes.changeThread:
      if (action.value && action.value.messages) {
        action.value.messages.forEach((message) => {
          newMessages[message._id] = message;
        });
        return {
          ...state,
          ...newMessages,
        };
      }
      return state;
    default:
      return state;
  }
}

export default messages;
