import * as actions from './actionTypes';

export const authSuccess = (uid, token, expireTime) => {
    return {
        type: actions.AUTH_SUCCESS,
        uid: uid,
        token: token,
        expireTime: expireTime
    }
}