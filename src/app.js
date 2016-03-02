import 'polyfills';//minor polyfills here. Major polyfilles (e.g. es5 shim) loaded in index from cdn

import React from 'react';
import { Provider } from 'react-redux';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import GlobalHeader from 'components/global_header';
import Log from 'components/log';
import History from 'components/history';
import GLOBALS from 'components/globals';
import PublicRoutes from 'public_routes';
import PrivateRoutes from 'private_routes';
import EventManager from 'components/event_manager';
import Store from 'components/store';

import Errors from 'components/errors';
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
        Errors.show404();
        return (
            <div> </div>
        );
    }
});

var routes = {
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
        window._bootstrap_attempts++;
        ReactDOM.render((
                <Provider store={Store} >
                    <Router history={History} routes={routes} />
                </Provider>
        ), document.getElementById('cmwn-app'));
        console.log('%cWoah there, World Changer!', 'font-weight: bold; color: red; font-size: 60px; font-family: Helvetica, Impact, Arial, sans-serif; text-shadow: 2px 2px grey;'); //eslint-disable-line no-console
        console.log('%cChangeMyWorldNow will never ask you to enter any of your information in this space, or ask you to paste anything here. For your security, we recommend you close this console.', 'font-weight: bold; color: #2CC4F4; font-size: 25px; font-family: Helvetica, Impact, Arial, sans-serif;'); //eslint-disable-line no-console
        if (GLOBALS.MODE.toLowerCase() === 'prod' || GLOBALS.MODE.toLowerCase() === 'production') {
            console.info = _.noop; //eslint-disable-line no-console
            console.log = _.noop; //eslint-disable-line no-console
            console.warn = _.noop; //eslint-disable-line no-console
            /**let errors surface*/
        }
        Log.info('Application started');
    } catch(err) {
        Log.info('Application bootstrap failed, attempting to recover. Attempt ' + window._bootstrap_attempts + ' out of 5');
        if (window._bootstrap_attempts < 5) {
            window.setTimeout(run, 500);
        } else {
            Errors.showApplication(err);
        }
    }
}

const loadedStates = ['complete', 'loaded', 'interactive'];


//from http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
var hashCode = function (s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0); //eslint-disable-line
};

if (window.Rollbar && ~window.__cmwn.MODE.indexOf('prod')){ //eslint-disable-line no-undef
    Rollbar.configure({reportLevel: 'error'}); //eslint-disable-line no-undef
}
if (window.Rollbar != null) { //eslint-disable-line no-undef
    //Quick and dirty leading edge throttle on rapid fire events
    Rollbar.configure({checkIgnore: function (isUncaught, args, payload) { //eslint-disable-line
        var key = hashCode((args[1] && args[1].toString()) || (args[2] && args[2].toString()) || args.join(' '));
        window.__cmwn._loggerevents = window.__cmwn._loggerevents || {};
        if (window.__cmwn._loggerevents[key] == null) {
            window.__cmwn._loggerevents[key] = Date.now();
            return false;
        } else if (window.__cmwn._loggerevents[key] - Date.now() > 60000) {
            window.__cmwn._loggerevents[key] = Date.now();
            return false;
        }
        return true;
    }});
}
if (loadedStates.indexOf(document.readyState) !== -1 && document.getElementById('cmwn-app')) {
    run();
    console.info('running'); //eslint-disable-line
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}

window.__cmwn.interactiveDebug = function () {
    window.debugging = true;
    Rollbar.configure({reportLevel: 'info'}); //eslint-disable-line
};

export default App;
