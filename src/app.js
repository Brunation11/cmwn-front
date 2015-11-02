import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link } from 'react-router';

import GlobalHeader from 'components/global_header';
import Sidebar from 'components/Sidebar';
import EventManager from 'components/event_manager';

import Users from 'routes/users'
import Districts from 'routes/districts'

import Reset from 'reset.css';
import CoreStyles from 'app.scss';

import LOGO_URL from 'media/logo.png';

var App = React.createClass({
    getInitialState: function () {
        var self = this;
        EventManager.listen('menuIsOpen', val => {
            this.menuIsOpen = val;
            this.forceUpdate();
        });
        EventManager.update('menuIsOpen', false);
        return {};
    },
    render: function () {
        return (
            <div>
                <GlobalHeader />
                <div className="sweater">
                    <div className="content"> 
                        {this.props.children}
                    </div>
                    <Sidebar menuIsOpen={this.menuIsOpen}/>
                </div>
            </div>
        );
    }
});


const routes = {
    path: '/',
    component: App,
    childRoutes: [
        { path: 'users', component: Users },
        { path: 'districts', component: Districts},
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

