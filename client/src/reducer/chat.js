import { chat as chatTypes } from '../actions/types';

const initialState = {
  activeThread: '',
  messageText: '',
};

function chat(state = initialState, action) {
  switch (action.type) {
    case chatTypes.changeThread:
      return {
        ...state,
        activeThread: action.value.threadId,
      };
    case chatTypes.setMessageText:
      return {
        ...state,
        messageText: action.text,
      };
    case chatTypes.assignThread:
      return {
        ...state,
        activeThread: action.value.isSelf ? action.value.threadId : '',
      };
    default:
      return state;
  }
}

export default chat;
