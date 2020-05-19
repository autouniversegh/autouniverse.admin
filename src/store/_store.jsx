import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from 'connected-react-router';
import thunk from "redux-thunk";
import { createBrowserHistory } from 'history';

import createRootReducer from "./_reducers";

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunk
            ),
            // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    )

    return store;
}
