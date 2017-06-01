import api from '../lib/api';
import { chat as chatTypes } from './types';
import nameGenerator from '../utils/nameGenerator';

function filterAndTransformThreads(threads) {
  return threads.map(thread => ({
    ...thread,
    name: nameGenerator(),
    img: Math.floor(Math.random() * 24) + 1,
    initMessageFetch: false,
  }));
}

export const initializeChat = (isAdmin, token) => (dispatch) => {
  let promise;
  if (isAdmin) {
    promise = api.getAllThreads(token);
  } else {
    promise = api.getThreads(token);
  }
  return promise.then(({ threads }) => api.getUsers(token)
    .then(({ users }) => dispatch({
      type: chatTypes.initializeChat,
      value: {
        threads: filterAndTransformThreads(threads),
        users,
      },
    })));
};

export const setMessageText = text => ({ type: chatTypes.setMessageText, text });

export const addMessage = (threadId, message, activeThread) => ({ type: chatTypes.addMessage, value: { threadId, message, activeThread } });

export const sendMessage = (msg, token) => dispatch => api.sendMessage(msg, token)
  .then(({ message, threadId }) => {
    dispatch(addMessage(threadId, message));
  });

export const uploadFile = (file, thread) => {
  const data = new FormData();
  data.append('file', file);
  return dispatch => api.uploadFile(data, thread)
    .then(({ message }) => dispatch(addMessage(thread._id, message)));
};

export const assignThread = (userId, threadId, token, isSelf) => dispatch => api.assignThread(userId, threadId, token)
  .then(({ thread }) => dispatch(({
    type: chatTypes.assignThread,
    value: { threadId: thread._id, userId, isSelf },
  })));

export const addRepToThread = (repIds, threadId, token) => dispatch => api.addRepToThread(repIds, threadId, token)
  .then(({ data }) => dispatch(({
    type: chatTypes.addRepToThread,
    value: {
      threadId: data.thread._id,
      repIds: data.thread.repIds.concat(data.reps.map(rep => rep._id)),
    },
  })));

export const changeThread = (thread, token) => (dispatch) => {
  let promise;
  if (!thread.initMessageFetch) {
    promise = api.getThreadMessages(thread._id, token);
  } else {
    promise = Promise.resolve();
  }
  return promise.then(data => dispatch({
    type: chatTypes.changeThread,
    value: {
      messages: data && data.messages && data.messages.map(message => ({
        ...message,
        createdAt: new Date(message.createdAt),
        updatedAt: new Date(message.updatedAt),
      })),
      threadId: thread._id,
    },
  }));
};
