import React from 'react';
import ReactDOM from 'react-dom'
import { Router, Route, Link } from 'react-router';

import Users from './routes/users'

//var Users = React.createClass({
//    render: function () {return (<div>users</div>);}
//});

var App = React.createClass({
    render: function () {
        return (
            <div>
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
        //{ path: 'roles', component: Roles },
        //{ path: 'districts', component: Districs },
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

