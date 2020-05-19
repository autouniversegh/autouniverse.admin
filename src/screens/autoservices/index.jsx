import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const List = React.lazy(() => import('./autoservices'));
const Categories = React.lazy(() => import('./categories'));

export default class AUtoservices extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/autoservices" render={(props) => <List {...props} {...this.props} />} />
                    <Route exact path="/autoservices/categories" render={(props) => <Categories {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}