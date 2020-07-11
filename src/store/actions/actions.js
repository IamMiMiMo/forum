import * as actions from './actionTypes';

export const setTitleBar = (title, left, right) => {
    return {
        type: actions.SET_TITLEBAR,
        title: title,
        left: left,
        right: right
    }
}