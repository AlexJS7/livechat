import { chat as chatTypes } from '../actions/types';

const initialState = {};

function users(state = initialState, action) {
  let newState;
  switch (action.type) {
    case chatTypes.initializeChat:
      newState = { ...state };
      action.value.users.forEach((user) => {
        newState[user.id] = user;
      });
      return newState;
    default:
      return state;
  }
}

export default users;
