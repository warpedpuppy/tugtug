const initialState = {
    pageTitle: 'site name'
};

function themeReducer (state=initialState, action) {
    // if (action.type === ADD_ITEM) {
    //     return Object.assign({}, state, {
    //         items: [...state.items, action.item]
    //     });
    // }
    // else if (action.type === UPDATE_ITEM) {
    //     return Object.assign({}, state, {
    //         items: state.items.map(item =>
    //             item.id === action.item.id ? action.item : item
    //         )
    //     });
    // }
    // else if (action.type === DELETE_ITEM) {
    //     return Object.assign({}, state, {
    //         items: state.items.filter(item => item.id !== action.item.id)
    //     });
    // }
    return state;
};

export default themeReducer;