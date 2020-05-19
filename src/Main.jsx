import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import * as router from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from "./store/_store";
import { Container } from 'reactstrap';

// import * as func from './providers/functions';
import * as authAct from "./store/auth/_authActions";
import * as utilsAct from "./store/utils/_utilsActions";
import { Fallback } from './components';

import {
    AppAside,
    AppFooter,
    AppHeader,
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    // AppBreadcrumb2 as AppBreadcrumb,
    AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';

const DefaultAside = React.lazy(() => import('./partials/DefaultAside'));
const DefaultFooter = React.lazy(() => import('./partials/DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./partials/DefaultHeader'));

const Dashboard = React.lazy(() => import('./screens/dashboard'));
const AutoParts = React.lazy(() => import('./screens/autoparts'));
const Mechanics = React.lazy(() => import('./screens/mechanics'));
const Emergencies = React.lazy(() => import('./screens/emergencies'));
const Autoservices = React.lazy(() => import('./screens/autoservices'));
const ExportAdvices = React.lazy(() => import('./screens/expertadvices'));
const Reports = React.lazy(() => import('./screens//reports'));

const routes = [
    { path: '/', exact: true, name: 'Home', component: Dashboard },
    { path: '/dashboard', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/autoparts', name: 'Autoparts', component: AutoParts },
    { path: '/mechanics', name: 'Mechanics', component: Mechanics },
    { path: '/emergencies', name: 'Emergency Services', component: Emergencies },
    { path: '/autoservices', name: 'Other auto services', component: Autoservices },
    { path: '/expertadvices', name: 'Expert advice', component: ExportAdvices },
    { path: '/users', name: 'Users', component: Mechanics },
    { path: '/reports', name: 'Reports', component: Reports },
    { path: '/setup', name: 'Setup', component: Mechanics }
];

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathname: 'xxl'
        };
    }

    componentDidUpdate() {
        const { router: { location: { pathname } } } = this.props;
        if (this.state.pathname !== pathname) {
            this.setState({ pathname }, () => {
                // this.props.activeCompanyDetails();
            });
        }
    }

    render() {
        const { _utils: { navigation } } = this.props;

        return (
            <React.Fragment>
                <ConnectedRouter history={history}>
                    <div className="app">
                        <AppHeader fixed>
                            <DefaultHeader {...this.props} onLogout={() => this.props.signOutSuccess()} />
                        </AppHeader>
                        <div className="app-body">
                            <AppSidebar fixed display="lg">
                                <AppSidebarHeader />
                                <AppSidebarForm />
                                <AppSidebarNav navConfig={navigation} {...this.props} router={router} />
                                <AppSidebarFooter />
                                <AppSidebarMinimizer />
                            </AppSidebar>
                            <main className="main">
                                {/* <AppBreadcrumb appRoutes={routes} router={router} /> */}
                                <React.Suspense fallback={<Fallback />}>
                                    <Container fluid style={{ marginTop: 30 }}>
                                        <Switch>
                                            {routes.map((rt, idx) => (
                                                <Route key={idx} path={rt.path} exact={rt.exact} name={rt.name} render={props => (<rt.component {...props} {...this.props} />)} />
                                            ))}
                                            <Redirect from="/" to="/dashboard" />
                                        </Switch>
                                    </Container>
                                </React.Suspense>
                            </main>
                            <AppAside fixed>
                                <React.Suspense fallback={<Fallback />}>
                                    <DefaultAside />
                                </React.Suspense>
                            </AppAside>
                        </div>
                        <AppFooter>
                            <DefaultFooter />
                        </AppFooter>
                    </div>

                </ConnectedRouter>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    _auth: state.auth,
    _utils: state.utils,
    router: state.router,
    location: state.router.location
});

const mapDispatchToProps = (dispatch) => ({
    signOutSuccess: () => {
        dispatch(authAct.signOutSuccess());
    },
    setPageTitle: (title) => {
        dispatch(utilsAct.setPageTitle(title));
    },
    setSetSettings: (key, value) => {
        dispatch(utilsAct.setSetSettings(key, value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);