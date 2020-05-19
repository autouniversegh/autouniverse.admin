import React, { Component } from 'react';
import { connect } from "react-redux";
import * as authAct from "../../store/auth/_authActions";
import * as utilsAct from "../../store/utils/_utilsActions";

const Login = React.lazy(() => import('./login'));

class Authenticate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            submitting: false, sendingpin: false,
            maxid: '', row: {},
            navigate: 'login'
        }
    }

    render() {
        // const { navigate } = this.state;

        return (
            <React.Fragment>
                <Login />
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state) => ({
    _auth: state.auth,
    _utils: state.utils,
    router: state.router
});

const mapDispatchToProps = (dispatch) => ({
    signInSuccess: (token, data) => {
        dispatch(authAct.signInSuccess(token, data));
    },
    setSetSettings: (key, value) => {
        dispatch(utilsAct.setSetSettings(key, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);