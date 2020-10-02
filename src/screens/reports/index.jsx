import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const Views = React.lazy(() => import('./views'));
const Dealers = React.lazy(() => import('./dealers'));
const Joindate = React.lazy(() => import('./joindate'));
const Subscriptions = React.lazy(() => import('./subscriptions'));
const Reviews = React.lazy(() => import('./reviews'));
const Orders = React.lazy(() => import('./orders'));
const Autoparts = React.lazy(() => import('./autoparts'));
const Emergencies = React.lazy(() => import('./emergencies'));
const Mechanics = React.lazy(() => import('./mechanics'));

export default class Reports extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/reports/views" render={(props) => <Views {...props} {...this.props} />} />
                    <Route exact path="/reports/joindate" render={(props) => <Joindate {...props} {...this.props} />} />
                    <Route exact path="/reports/dealers" render={(props) => <Dealers {...props} {...this.props} />} />
                    <Route exact path="/reports/autoparts" render={(props) => <Autoparts {...props} {...this.props} />} />
                    <Route exact path="/reports/subscriptions" render={(props) => <Subscriptions {...props} {...this.props} />} />
                    <Route exact path="/reports/reviews" render={(props) => <Reviews {...props} {...this.props} />} />
                    <Route exact path="/reports/orders" render={(props) => <Orders {...props} {...this.props} />} />
                    <Route exact path="/reports/emergencies" render={(props) => <Emergencies {...props} {...this.props} />} />
                    <Route exact path="/reports/mechanics" render={(props) => <Mechanics {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}