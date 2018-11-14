import {OPEN_MENU, CLOSE_MENU, TOGGLE_MENU, TOGGLE_EDIT_MODE, CHANGE_COLOR} from '../actions/themeActions';

const initialState = {
    menuOpen: false, 
    editMode: false,
    color: 0x000000
};

function themeReducer (state=initialState, action) {
    if (action.type === OPEN_MENU) {
        return Object.assign({}, state, {
            menuOpen: true
        });
    }
    else if (action.type === CLOSE_MENU) {
        return Object.assign({}, state, {
            menuOpen: false
        });
    }
    else if (action.type === TOGGLE_MENU) {
        return Object.assign({}, state, {
            menuOpen: !state.menuOpen
        });
    } 
    else if (action.type === TOGGLE_EDIT_MODE) {

        if (!action.editMode) {
            return Object.assign({}, state, {
                editMode: !state.editMode
            });
        } else {
             return Object.assign({}, state, {
                editMode: action.editMode
            });
        }
        
    } else if (action.type === CHANGE_COLOR) {
        return Object.assign({}, state, {
            color: action.color
        });
    }
    return state;
};

export default themeReducer;