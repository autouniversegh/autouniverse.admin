import * as func from '../../providers/functions';
import { SET_SITE_LANG, SET_PAGE_TITLE, SET_SET_SETTINGS } from '../_types';

export function setPageTitle(title) {
    return dispatch => {
        dispatch({ type: SET_PAGE_TITLE, title });
    }
};

export function setSiteLang(lang) {
    return dispatch => {
        dispatch({ type: SET_SITE_LANG, lang});
    }
};

export function setSetSettings(key, value) {
    func.setStorageJson(key, value);
    return dispatch => {
        dispatch({
            type: SET_SET_SETTINGS, key, value
        });
    }
};