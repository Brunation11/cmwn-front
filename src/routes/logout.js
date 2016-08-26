import React from 'react';
import Loader from 'react-loader';

import Layout from 'layouts/one_col';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Util from 'components/util';

import 'routes/logout.scss';

export const PAGE_UNIQUE_IDENTIFIER = 'logout-page';

const LOADER_OPTIONS = {
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

const LOG = {
    INIT: 'User logout initiated',
    SUCCESS: 'Session successfully terminated.',
    FAILURE: 'User logout "failed", proceeding.'
};

export class LogoutPage extends React.Component {
    componentDidMount() {
        var logout = HttpManager.GET({url: GLOBALS.API_URL + 'logout', handleErrors: false});
        Log.info(LOG.INIT);
        Util.logout();
        logout.then(() => {
            Log.info(LOG.SUCCESS);
            Util.logout();
            delete window.__USER_UNAUTHORIZED;
            window.location.href = '/login';
        }).catch(e => {
            Log.warn(e, LOG.FAILURE);
            Util.logout();
            delete window.__USER_UNAUTHORIZED;
            window.location.href = '/login';
        });
    }

    render() {
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <div>
                    <Loader loaded={false} options={LOADER_OPTIONS} className="spinner" />Logging out...
                </div>
           </Layout>
        );
    }
}

LogoutPage._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default LogoutPage;

