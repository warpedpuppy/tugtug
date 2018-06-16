export const ADD_USERDATA = 'ADD_USERDATA';
export const addUserdata = item => ({
    type: ADD_USERDATA,
    user: item
});

export const ADD_TOKEN = 'ADD_TOKEN';
export const addToken = item => ({
    type: ADD_TOKEN,
    token: item
});

export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export const updateToken = item => ({
    type: UPDATE_TOKEN,
    item
});

export const DELETE_TOKEN = 'DELETE_TOKEN';
export const deleteToken = item => ({
    type: DELETE_TOKEN,
    item
});