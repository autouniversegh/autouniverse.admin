import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

import List from './mechanics';

export default class Mechanics extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/mechanics" render={(props) => <List {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}