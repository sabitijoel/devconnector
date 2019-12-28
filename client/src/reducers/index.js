//this is our root reducer to bring in all other reducers

import { combineReducer } from "redux";
import authReducer from "./authReducer";

export default combineReducers({
  auth: authReducer
});
