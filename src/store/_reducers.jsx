import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import authReducer from './auth/_authReducer';
import utilsReducer from './utils/_utilsReducer';

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        auth: authReducer,
        utils: utilsReducer
    });