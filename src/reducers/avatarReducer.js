import {ADD_ITEM, ADD_ITEMS, UPDATE_ITEM, DELETE_ITEM, TOGGLE_ACTIVE} from '../actions/avatarActions';

const initialState = {
    items: [],
    activeItems: []
};

function tokenReducer (state=initialState, action) {
    if (action.type === ADD_ITEM) {
        //console.log('item = ', action.item)
        return Object.assign({}, state, {
            items: [...state.items, action.item]
        });
    } else  if (action.type === ADD_ITEMS) {
        //console.log('pre add items = ', state.items)
        let obj = Object.assign({}, state, {
            items: [...state.items, ...action.items]
        });
        //console.log('post add items = ', obj)
        return obj;
    } else if (action.type === UPDATE_ITEM) {
        return Object.assign({}, state, {
            items: state.items.map(item =>
                item.id === action.item.id ? action.item : item
            )
        });
    } else if (action.type === DELETE_ITEM) {
        return Object.assign({}, state, {
            items: state.items.filter(item => item.id !== action.item.id)
        });
    } else if (action.type === TOGGLE_ACTIVE) {
       return Object.assign({}, state, {
            items: state.items.map(item => {
                if(item.name === action.name) {
                    return {...item, active: action.active}
                } else {
                    return item;
                }
            }
            )
        });
    } 
    return state;
};

export default tokenReducer;