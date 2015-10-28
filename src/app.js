import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link } from 'react-router';

import GlobalHeader from 'components/global_header';

import Users from 'routes/users'
import Districts from 'routes/districts'

//var Users = React.createClass({
//    render: function () {return (<div>users</div>);}
//});

var App = React.createClass({
    render: function () {
        return (
            <div>
                <GlobalHeader />
                Hello!
                {this.props.children}
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
    ReactDOM.render(<Router routes={routes} />, document.getElementById('app'))
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) != -1  && document.getElementById('app')) {
      run();
      console.info('running');
} else {
      window.addEventListener('DOMContentLoaded', run, false);
}

