import axios from 'axios';

const request = ({ url, method, data, token }) => axios(url, {
  method,
  headers: token ? {
    'x-access-token': token,
  } : {},
  data,
}).then(response => response.data)
  .catch((err) => {
    console.log('err: ', err);
    throw (err);
  });

const api = {
  login: user => request({ url: '/auth/login', method: 'POST', data: user }),
  updateUser: (update, token) => request({ url: '/auth/updateUser', method: 'PATCH', data: update, token }),
  updatePassword: (email, oldPassword, newPassword, token) => request({ url: '/auth/password', method: 'PATCH', data: { email, oldPassword, newPassword }, token }),
  getUsers: token => request({ url: '/users/get', method: 'GET', token }),
  getThreads: token => request({ url: '/threads/get', method: 'GET', token }),
  getAllThreads: token => request({ url: '/threads/all', method: 'GET', token }),
  addRepToThread: (repIds, threadId, token) => request({ url: '/threads/addRep', method: 'PATCH', data: { repIds, threadId }, token }),
  assignThread: (repIds, threadId, token) => request({ url: '/threads/changeRep', method: 'PATCH', data: { repIds, threadId }, token }),
  sendMessage: (message, token) => request({ url: '/messages/create', method: 'POST', data: message, token }),
  getThreadMessages: (threadId, token) => request({ url: `/messages/${threadId}/get`, method: 'GET', token }),
  uploadFile: (file, threadId) => request({ url: `/upload/${threadId}`, method: 'PUT', data: file }),
};

export default api;
