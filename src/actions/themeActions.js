export const OPEN_MENU = 'OPEN_MENU';
export const openMenu = () => ({
    type: OPEN_MENU
});

export const CLOSE_MENU = 'CLOSE_MENU';
export const closeMenu = () => ({
    type: CLOSE_MENU
});

export const TOGGLE_MENU = 'TOGGLE_MENU';
export const toggleMenu = () => ({
    type: TOGGLE_MENU
});

export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export const toggleEditMode = (editMode) => ({
	editMode: editMode,
    type: TOGGLE_EDIT_MODE
});

export const CHANGE_COLOR = 'CHANGE_COLOR';
export const changeColor = (color) => ({
	type: CHANGE_COLOR,
    color: color
});