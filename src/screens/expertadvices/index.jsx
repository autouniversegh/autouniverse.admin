import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const List = React.lazy(() => import('./expertadvices'));
const Categories = React.lazy(() => import('./categories'));

export default class Experadvices extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/expertadvices" render={(props) => <List {...props} {...this.props} />} />
                    <Route exact path="/expertadvices/categories" render={(props) => <Categories {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}