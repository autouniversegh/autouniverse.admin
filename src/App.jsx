import React from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { Fallback, Loading } from './components';
import localeIntl from './assets/intl/data.json';
import * as authAct from "./store/auth/_authActions";
import * as utilsAct from "./store/utils/_utilsActions";
import * as func from './providers/functions';

import Main from './Main';
import Authenticate from './screens/authenticate/auth';

class App extends React.Component {

  state = {
    initializing: false
  }

  componentDidMount() {
    this.initApp();
  }

  initApp = () => {
    // ::: run some things before initializing the MainApp
    if (this.props._auth.authenticated) {
      // this.setState({ initializing: true });
      func.get(`users/${this.props._auth.logg.uuid}`).then(res => {
        // this.setState({ initializing: false });
        if (res.status === 200) {
          this.props.signInSuccess(this.props._auth.token, res.data);
          func.setStorageJson('users', res.data);
        } else {
          this.props.signOutSuccess();
        }
      });
    }
    func.get('settings').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('settings', res.data);
        func.setStorageJson('settings', res.data);
      }
    });
    func.get('settings/carparts').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('carparts', res.data);
        func.setStorageJson('carparts', res.data);
      }
    });
    func.get('settings/locations').then((res) => {
      if (res.status === 200) {
        this.props.setSetSettings('locations', res.data);
        func.setStorageJson('locations', res.data);
      }
    });
  }

  render() {
    const { initializing } = this.state;
    const { _auth: { authenticated }, _utils: { lang } } = this.props;

    return (
      <React.Fragment>
        <React.Suspense fallback={<Fallback />}>
          <IntlProvider locale={lang} defaultLocale={'en'} messages={localeIntl[lang]}>
            <Router>
              {initializing ? (<Loading />) : (authenticated ? (<Route render={() => <Main />} />) : (<Authenticate />))}
            </Router>
          </IntlProvider>
        </React.Suspense>
      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => ({
  _auth: state.auth,
  _utils: state.utils
});

const mapDispatchToProps = (dispatch) => ({
  signInSuccess: (token, data) => {
    dispatch(authAct.signInSuccess(token, data));
  },
  setSetSettings: (key, value) => {
    dispatch(utilsAct.setSetSettings(key, value));
  },
  signOutSuccess: () => {
    dispatch(authAct.signOutSuccess());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);