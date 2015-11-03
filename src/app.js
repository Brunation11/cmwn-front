import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link } from 'react-router';

import GlobalHeader from 'components/global_header';

import Users from 'routes/users'
import Districts from 'routes/districts'
import DistrictView from 'routes/districts/view'
import DistrictEdit from 'routes/districts/edit'

import Reset from 'reset.css';
import Overrides from 'overrides.scss';
import CoreStyles from 'app.scss';

import LOGO_URL from 'media/logo.png';

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
        //{ path: 'roles', component: Roles },
        //{ path: 'organizations', component: Organizations },
        //{ path: 'groups', component: Groups },
        //{ path: 'images', component: Images },
    ]
}

function run() {
    ReactDOM.render(<Router routes={routes} />, document.getElementById('cmwn-app'))
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) != -1  && document.getElementById('cmwn-app')) {
      run();
      console.info('running');
} else {
      window.addEventListener('DOMContentLoaded', run, false);
}

