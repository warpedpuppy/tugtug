import {ADD_ITEM, UPDATE_ITEM, DELETE_ITEM} from '../actions/avatarActions';

const initialState = {
    items: []
};

function tokenReducer (state=initialState, action) {
    if (action.type === ADD_ITEM) {
        console.log('item = ', action.item)
        return Object.assign({}, state, {
            items: [...state.items, action.item]
        });
    }
    else if (action.type === UPDATE_ITEM) {
        return Object.assign({}, state, {
            items: state.items.map(item =>
                item.id === action.item.id ? action.item : item
            )
        });
    }
    else if (action.type === DELETE_ITEM) {
        return Object.assign({}, state, {
            items: state.items.filter(item => item.id !== action.item.id)
        });
    }
    return state;
};

export default tokenReducer;