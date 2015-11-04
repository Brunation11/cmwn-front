import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import GlobalHeader from 'components/global_header';

import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import Organizations from 'routes/organizations';
import OrganizationView from 'routes/organizations/view';
import OrganizationEdit from 'routes/organizations/edit';

import 'reset.css';
import 'overrides.scss';
import 'app.scss';

import 'media/logo.png';

var App = React.createClass({
    render: function () {
        return (
            <div>
                <GlobalHeader />
                <div className="sweater">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

const routes = {
    path: '/',
    component: App,
    childRoutes: [
        { path: 'users(/)', component: Users },
        { path: 'districts(/)', component: Districts},
        { path: 'district/:id(/)', component: DistrictView},
        { path: 'district/:id/view(/)', component: DistrictView},
        { path: 'district/:id/edit(/)', component: DistrictEdit},
        { path: 'organizations(/)', component: Organizations},
        { path: 'organization/:id(/)', component: OrganizationView},
        { path: 'organization/:id/view(/)', component: OrganizationView},
        { path: 'organization/:id/edit(/)', component: OrganizationEdit},

        //{ path: 'roles', component: Roles },
        //{ path: 'organizations', component: Organizations },
        //{ path: 'groups', component: Groups },
        //{ path: 'images', component: Images },
    ]
};

function run() {
    ReactDOM.render(<Router routes={routes} />, document.getElementById('cmwn-app'));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) != -1  && document.getElementById('cmwn-app')) {
    run();
    console.info('running'); //eslint-disable-line
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}

