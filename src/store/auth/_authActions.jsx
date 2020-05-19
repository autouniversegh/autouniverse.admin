import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '../_types';
import * as func from '../../providers/functions';
import { message } from 'antd';

export function signInSuccess(token, data) {
    return dispatch => {
        dispatch({
            type: SIGNIN_SUCCESS,
            payload: {
                data: data,
                token: token
            }
        });
    }
};

export function signOutSuccess() {
    return dispatch => {
        message.success('success', 'You are now logged out!');
        func.delStorage('token');
        func.delStorage('user');
        // func.redirect('/login');
        dispatch({ type: SIGNOUT_SUCCESS });
    }
};