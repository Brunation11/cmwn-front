import 'polyfills';//minor polyfills here. Major polyfilles (e.g. es5 shim) loaded in index from cdn

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Link } from 'react-router';

import GlobalHeader from 'components/global_header';
import Log from 'components/log';
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

document.domain = 'changemyworldnow.com';

//htaccess should take care of it but if somehow it does not, this should overkill the issue
if (window.location.protocol !== 'https:') {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

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
    },
    render: function () {
        if (this.isHome()) {
            return <Home />;
        }
        return (
            <div>
                {Errors.renderErrors()}
                <GlobalHeader />
                <div className="blocker"></div>
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
    window._bootstrap_attempts = window._bootstrap_attempts || 0; //eslint-disable-line camelcase
    try {
        Log.info('Application started');
        ReactDOM.render(<Router history={History} routes={routes} />, document.getElementById('cmwn-app'));
    } catch (err) {
        Log.warn('Application bootstrap failed, attempting to recover. Attempt ' + window._bootstrap_attempts + ' out of 5');
        if (window._bootstrap_attempts < 5) {
            window.setTimeout(run, 500);
        }
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

