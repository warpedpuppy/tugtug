import {ADD_TOKEN, UPDATE_TOKEN, DELETE_TOKEN} from '../actions/tokenActions';

const initialState = {
    token: 'blank'
};

function tokenReducer (state=initialState, action) {
    if (action.type === ADD_TOKEN) {
        return Object.assign({}, state, {
            token: action.token
        });
    }
    else if (action.type === UPDATE_TOKEN) {
        return Object.assign({}, state, {
            items: state.items.map(item =>
                item === action.item.old ? action.item.new : item
            )
        });
    }
    else if (action.type === DELETE_TOKEN) {
        console.log(action.item+"  "+action.item.id)
        let obj = Object.assign({}, state, {
            items: state.items.filter(item => item !== action.item)
        });
        return obj
    }
    return state;
};

export default tokenReducer;