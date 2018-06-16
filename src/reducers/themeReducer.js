import {OPEN_MENU, CLOSE_MENU, TOGGLE_MENU} from '../actions/themeActions';

const initialState = {
    menuOpen: false
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
    return state;
};

export default themeReducer;