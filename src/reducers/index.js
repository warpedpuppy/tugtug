import {combineReducers} from 'redux';
import avatarReducer from "./avatarReducer";
import tokenReducer from "./tokenReducer";

export default combineReducers({
        tokenReducer,
        avatarReducer
})