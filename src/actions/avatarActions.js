export const ADD_ITEM = 'ADD_ITEM';
export const addItem = item => ({
    type: ADD_ITEM,
    item
});

export const ADD_ITEMS = 'ADD_ITEMS';
export const addItems = items => ({
    type: ADD_ITEMS,
    items
});
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const updateItem = item => ({
    type: UPDATE_ITEM,
    item
});

export const DELETE_ITEM = 'DELETE_ITEM';
export const deleteItem = item => ({
    type: DELETE_ITEM,
    item
});

export const TOGGLE_ACTIVE = 'TOGGLE_ACTIVE';
export const toggleActive = (name, active) => ({
    type: TOGGLE_ACTIVE,
    name,
    active
});

export const MAKE_ITEM_INACTIVE = 'MAKE_ITEM_INACTIVE';
export const makeItemInactive = item => ({
    type: MAKE_ITEM_INACTIVE,
    item
});