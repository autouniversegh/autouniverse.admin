import { SIGNING_IN, SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '../_types';
import * as func from '../../providers/functions';

const user = func.getStorageJson('user');
const token = func.getStorage('token');

const initialState = {
    logg: user,
    authenticated: token && user.id ? true : false,
    token,
    signingIn: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;

        case SIGNING_IN:
            return {
                ...state,
                signingIn: action.payload
            }

        case SIGNIN_SUCCESS:
            return {
                ...state,
                authenticated: true,
                token: action.payload.token,
                logg: action.payload.data
            };
        case SIGNOUT_SUCCESS:
            return {
                ...state,
                logg: {},
                authenticated: false,
                token: ''
            };
    }
};


export default authReducer;