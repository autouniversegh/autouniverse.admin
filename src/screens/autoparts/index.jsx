import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

import Dealers from './dealers';
import Autoparts from './autoparts';

export default class Bidding extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route exact path="/autoparts/dealers" render={(props) => <Dealers {...props} {...this.props} />} />
                    <Route exact path="/autoparts/autoparts" render={(props) => <Autoparts {...props} {...this.props} />} />

                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}