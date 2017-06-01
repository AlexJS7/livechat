import { chat as chatTypes } from '../actions/types';

const initialState = {};

function addMessageSortThreads(thread, message, activeThread) {
  let unseen;
  if (thread._id === activeThread) {
    unseen = 0;
  } else {
    unseen = thread.unseenMessages + 1;
  }
  return {
    ...thread,
    lastMessage: message,
    unseenMessages: unseen,
    messages: thread.messages.concat([message._id]),
  };
}

function threads(state = initialState, action) {
  let newState;
  switch (action.type) {
    case chatTypes.initializeChat:
      newState = { ...state };
      action.value.threads.forEach((thread) => {
        newState[thread._id] = thread;
      });
      return newState;
    case chatTypes.changeThread:
      return {
        ...state,
        [action.value.threadId]: {
          ...state[action.value.threadId],
          unseenMessages: 0,
          initMessageFetch: true,
        },
      };
    case chatTypes.addRepToThread:
      return {
        ...state,
        [action.value.threadId]: {
          ...state[action.value.threadId],
          repIds: action.value.repIds,
        },
      };
    case chatTypes.addMessage:
      return {
        ...state,
        [action.value.threadId]: addMessageSortThreads(
          { ...state[action.value.threadId] },
          action.value.message,
          action.value.activeThread,
        ),
      };
    case chatTypes.assignThread:
      if (action.value.isSelf) {
        return {
          ...state,
          [action.value.threadId]: {
            ...state[action.value.threadId],
            repIds: [action.value.userId],
          },
        };
      }
      newState = { ...state };
      delete newState[action.value.threadId];
      return newState;
    default:
      return state;
  }
}

export default threads;
