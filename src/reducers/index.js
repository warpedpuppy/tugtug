import {combineReducers} from 'redux';
import avatarReducer from "./avatarReducer";
import tokenReducer from "./tokenReducer";
import themeReducer from "./themeReducer";
export default combineReducers({
        tokenReducer,
        avatarReducer,
        themeReducer
})