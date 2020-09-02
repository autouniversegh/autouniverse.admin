import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const List = React.lazy(() => import('./users'));
const Access = React.lazy(() => import('./access'));

export default class Users extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/users/normal" render={(props) => <List {...props} {...this.props} params={{ admin: 0 }} />} />
                    <Route exact path="/users/admin" render={(props) => <List {...props} {...this.props} params={{ admin: 1 }} />} />
                    <Route exact path="/users/access" render={(props) => <Access {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}