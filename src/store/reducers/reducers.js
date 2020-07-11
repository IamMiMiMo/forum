import * as actions from '../actions/actionTypes';
import { faBars} from '@fortawesome/free-solid-svg-icons';
const initialState = {
    titleBarTitle: '',
    titleBarLeft: [[{ icon: faBars, onClick: () => {} }]],
    titleBarRight: [[{ icon: faBars, onClick: () => {} }]]
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_TITLEBAR:
            return {
                ...state,
                titleBarTitle: action.title,
                titleBarLeft: action.left,
                titleBarRight: action.right
            }
        default:
            return {
                state
            }
    }
}

export default reducer;