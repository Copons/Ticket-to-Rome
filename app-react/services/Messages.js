import store from '../store';
import {
  ADD_MESSAGE,
  REMOVE_MESSAGE,
} from '../actions';

const MAX_MESSAGES = 50;


class Messages {


  // Utilities

  all = () => store.getState().messages;

  size = () => this.all().size;




  // Actions

  addMessageAction = response => ({
    type: ADD_MESSAGE,
    message: {
      type: response.type,
      text: response.msg,
    },
  });

  removeMessageAction = () => ({
    type: REMOVE_MESSAGE,
  });




  // Helpers

  addThunk = response => dispatch => {
    dispatch(this.addMessageAction(response));
    if (this.size() > MAX_MESSAGES) {
      dispatch(this.removeMessageAction());
    }
  };

}

export default new Messages();
