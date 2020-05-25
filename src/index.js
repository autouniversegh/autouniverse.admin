import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
// import HttpsRedirect from 'react-https-redirect';

import configureStore, { history } from "./store/_store";

import './assets/scss/custom.scss';
import 'react-image-lightbox/style.css';

import App from "./App.jsx";

import * as serviceWorker from "./serviceWorker";

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        {/* <HttpsRedirect> */}
            <App history={history} />
        {/* </HttpsRedirect> */}
    </Provider>, document.getElementById("root"));

serviceWorker.unregister();
