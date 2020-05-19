import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

const Views = React.lazy(() => import('./views'));
const Dealers = React.lazy(() => import('./dealers'));
const Joindate = React.lazy(() => import('./joindate'));

export default class Reports extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/reports/views" render={(props) => <Views {...props} {...this.props} />} />
                    <Route exact path="/reports/joindate" render={(props) => <Joindate {...props} {...this.props} />} />
                    <Route exact path="/reports/dealers" render={(props) => <Dealers {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}