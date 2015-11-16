import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';

import GlobalHeader from 'components/global_header';

import History from 'components/history';
import Login from 'routes/login';
import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import Organizations from 'routes/organizations';
import OrganizationView from 'routes/organizations/view';
import OrganizationEdit from 'routes/organizations/edit';
import Groups from 'routes/groups';
import GroupView from 'routes/groups/view';
import GroupEdit from 'routes/groups/edit';
import Friends from 'routes/friends';
import SuggestedFriends from 'routes/friends/suggested';
import Profile from 'routes/students/profile';
import StudentEdit from 'routes/students/edit';
import Layout from 'layouts/one_col';

//import 'reset.css';
import 'overrides.scss';
//import 'app.scss';

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

var Landing = React.createClass({
    render: function () {
        return (
            <Layout>
                <h1>Welcome</h1>
                <p>This is a temporary landing page for ease of navigation to site sections
                as they are constructed.</p>
                <p>
                    <Link to="/districts">districts</Link>
                </p>
                <p>
                    <Link to="/organizations">organizations</Link>
                </p>
                <p>
                    <Link to="/groups">groups</Link>
                </p>
            </Layout>
        );
    }
});

const routes = {
    path: '/',
    component: App,
    indexRoute: {component: Landing},
    childRoutes: [
        { path: 'login(/)', component: Login},
        { path: 'users(/)', component: Users },
        { path: 'profile(/)', component: Profile},
        { path: 'student/edit(/)', component: StudentEdit },
        { path: 'districts(/)', component: Districts},
        { path: 'district/:id(/)', component: DistrictView},
        { path: 'district/:id/view(/)', component: DistrictView},
        { path: 'district/:id/edit(/)', component: DistrictEdit},
        { path: 'organizations(/)', component: Organizations},
        { path: 'organization/:id(/)', component: OrganizationView},
        { path: 'organization/:id/view(/)', component: OrganizationView},
        { path: 'organization/:id/edit(/)', component: OrganizationEdit},
        { path: 'groups(/)', component: Groups},
        { path: 'group/:id(/)', component: GroupView},
        { path: 'group/:id/view(/)', component: GroupView},
        { path: 'group/:id/edit(/)', component: GroupEdit},
        { path: 'friends(/)', component: Friends},
        { path: 'friends/suggested(/)', component: SuggestedFriends},

        { path: '*', component: Landing},
        //{ path: 'roles', component: Roles },
        //{ path: 'organizations', component: Organizations },
        //{ path: 'groups', component: Groups },
        //{ path: 'images', component: Images },
    ]
};

function run() {
    ReactDOM.render(<Router history={History} routes={routes} />, document.getElementById('cmwn-app'));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) !== -1 && document.getElementById('cmwn-app')) {
    run();
    console.info('running'); //eslint-disable-line
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}

