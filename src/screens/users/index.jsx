import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

import UsersList from './users.list';
import UsersRoles from './users.roles';

export default class Users extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route path="/users/users" render={(props) => <UsersList {...props} {...this.props} params={{ admin: 0, type: 0 }} />} />
                    <Route path="/users/admin" render={(props) => <UsersList {...props} {...this.props} params={{ admin: 1, type: 0 }}  />}/>
                    <Route path="/users/tutors" render={(props) => <UsersList {...props} {...this.props} params={{ type: 1 }} />} />
                    <Route path="/users/roles" render={(props) => <UsersRoles {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}