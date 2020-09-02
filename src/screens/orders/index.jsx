import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const List = React.lazy(() => import('./list'));

export default class Orders extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/orders" render={(props) => <List {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}