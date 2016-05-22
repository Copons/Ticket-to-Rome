import {
  SET_TABLE,
} from '../actions';


class Table {

  // Actions

  setTableAction = table => ({
    type: SET_TABLE,
    table,
  });

}

export default new Table();
