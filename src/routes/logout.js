import React from 'react';
import Loader from 'react-loader';

import Layout from 'layouts/one_col';
import Log from 'components/log';
import Authorization from 'components/authorization';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

import 'routes/logout.scss';

var loaderOptions = {
    lines: 5,
    length: 20,
    width: 2,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 40,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    top: '50%',
    left: '50%',
    scale: 1.00
};

var Page = React.createClass({
    componentDidMount: function () {
        var logout = HttpManager.GET({url: GLOBALS.API_URL + 'logout', handleErrors: false});
        Log.info('User logout initiated');
        Authorization.logout();
        logout.then(() => {
            Log.info('Session successfully terminated.');
            delete window.__USER_UNAUTHORIZED;
            window.location.href = '/login';
        }).catch(e => {
            Log.warn(e, 'User logout "failed", proceeding.');
            delete window.__USER_UNAUTHORIZED;
            window.location.href = '/login';
        });
    },
    render: function () {
        return (
           <Layout>
                <div className="logout-page">
                    <Loader loaded={false} options={loaderOptions} className="spinner" />Logging out...
                </div>
           </Layout>
        );
    }
});

export default Page;

