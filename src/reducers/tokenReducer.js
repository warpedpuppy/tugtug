import {ADD_USERDATA, ADD_TOKEN, UPDATE_TOKEN, DELETE_TOKEN, TEST_USER} from '../actions/tokenActions';

const initialState = {
    token: 'blank',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    testMode: false
};

function tokenReducer (state=initialState, action) {
    if(action.type === TEST_USER) {
        localStorage.setItem('token', action.token);
        return Object.assign({}, state, {
            username: action.userData.username,
            firstName: action.userData.firstName,
            lastName: action.userData.lastName,
            email: action.userData.email,
            token: action.token,
            testMode: true

        });
    } else if (action.type === ADD_USERDATA) {
        // console.log("add userdata = ", action)
        //localStorage.setItem('token', action.token);
        return Object.assign({}, state, {
            username: action.user.username,
            firstName: action.user.firstName,
            lastName: action.user.lastName,
            email: action.user.email

        });
    }
    else if (action.type === ADD_TOKEN) {
        // console.log('add token')
        localStorage.setItem('token', action.token);
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
        localStorage.removeItem('token');
        let obj = Object.assign({}, state, {
            token: 'blank',
            username: ''
        });
        return obj
    }
    return state;
};

export default tokenReducer;