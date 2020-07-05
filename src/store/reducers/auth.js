import * as actions from '../actions/actionTypes';

const initialState = {
    uid: null,
    token: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTH_SUCCESS:
            console.log("setting");
            localStorage.setItem('uid',action.uid);
            localStorage.setItem('token', action.token);
            localStorage.setItem('expireTime', action.expireTime)
            return {
                ...state,
                uid: action.uid,
                token: action.token
            }
        default:
            return {
                state
            }
    }
}

export default reducer;