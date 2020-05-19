import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import NotFound from '../../partials/NotFound';

import SetupSchools from './setup.schools';
import SetupLevels from './setup.levels';
import SetupSettings from './setup.settings';
import SetupAdverts from './setup.adverts';
import SetupPartners from './setup.partners';

export default class Setup extends Component {

    render() {

        return (
            <React.Fragment>
                <Switch>
                    <Route path="/setup/schools" render={(props) => <SetupSchools {...props} {...this.props} />} />
                    <Route path="/setup/levels" render={(props) => <SetupLevels {...props} {...this.props} />} />
                    <Route path="/setup/settings" render={(props) => <SetupSettings {...props} {...this.props} />} />
                    <Route path="/setup/partners" render={(props) => <SetupPartners {...props} {...this.props} />} />
                    <Route path="/setup/adverts" render={(props) => <SetupAdverts {...props} {...this.props} />} />
                    
                    <Route render={NotFound} />
                </Switch>
            </React.Fragment>
        );
    }
}