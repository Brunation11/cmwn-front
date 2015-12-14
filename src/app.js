import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';

import GlobalHeader from 'components/global_header';
import History from 'components/history';
import GLOBALS from 'components/globals';
import PublicRoutes from 'public_routes';
import PrivateRoutes from 'private_routes';
import EventManager from 'components/event_manager';

import Errors from 'components/errors';
import Layout from 'layouts/one_col';
import Home from 'routes/home';

//import 'reset.css';
import 'overrides.scss';
//import 'app.scss';

import 'media/logo.png';

var App = React.createClass({
    componentWillMount: function () {
        Errors.onError(this.globalUpdate);
        EventManager.listen('userChanged', this.globalUpdate);
        EventManager.listen('errorChanged', this.globalUpdate);
    },
    isHome: function () {
        return window.location.href.toLowerCase().indexOf('home') !== -1 ||
            window.location.pathname === '/' ||
            window.location.pathname === '';
    },
    globalUpdate: function () {
        this.forceUpdate();
        debugger;
    },
    render: function () {
        if (this.isHome()) {
            return <Home />;
        }
        return (
            <div>
                {Errors.renderErrors()}
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
        //var redirect;
        if (GLOBALS.MODE != null && (~GLOBALS.MODE.indexOf('dev') || ~GLOBALS.MODE.indexOf('development'))) {
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
        //redirect = window.setTimeout(function () {
        //    History.replaceState(null, '/profile');
        //}, 10000);
        //History.listenBeforeUnload(() => {
        //    window.clearTimeout(redirect);
        //});
        Errors.show404();
        return (
            <div> </div>
        );
    }
});

const routes = {
    path: '/',
    component: App,
    indexRoute: {component: Landing},
    childRoutes: PublicRoutes.concat(PrivateRoutes).concat([
        { path: '*', component: Landing},
    ]),
};

function run() {
    try {
        ReactDOM.render(<Router history={History} routes={routes} />, document.getElementById('cmwn-app'));
    } catch (err) {
        //@TODO MPR, 11/31/15: attempt to rebootstrap to homepage on unhandled exception
        Errors.show404(); /** @TODO MPR, 11/31/15: create distinct "something went wrong" error page */
    }
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.indexOf(document.readyState) !== -1 && document.getElementById('cmwn-app')) {
    run();
    console.info('running'); //eslint-disable-line
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}

