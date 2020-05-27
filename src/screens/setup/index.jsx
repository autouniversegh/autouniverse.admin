import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../../partials/NotFound';

import Subscriptions from './subscriptions';

export default class Setup extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route path="/setup/subscriptions" render={(props) => <Subscriptions {...props} {...this.props} />} />
                    
                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}