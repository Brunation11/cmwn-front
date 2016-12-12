import React from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import _ from 'lodash';

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
    constructor() {
        super();

        this.state = {
            logoutComplete: false
        };
    }

    logout() {
        var logout = HttpManager.GET({url: GLOBALS.API_URL + 'logout', handleErrors: false});
        Log.info(LOG.INIT);
        Util.logout();
        logout.then(() => {
            Log.info(LOG.SUCCESS);
            Util.logout();
            delete window.__USER_UNAUTHORIZED;
            this.setState({ logoutComplete: true });
        }).catch(e => {
            Log.warn(e, LOG.FAILURE);
            Util.logout();
            delete window.__USER_UNAUTHORIZED;
            this.setState({ logoutComplete: true });
        });
    }

    componentDidMount() {
        // TODO: how to redirect when user isn't logged in
        if (this.props.currentUser.user_id) {
            this.logout();
        } else {
            setTimeout(() => {
                if (!this.props.currentUser.user_id && !this.state.logoutComplete) {
                    this.logout();
                }
            }, 10000); // if after 10 seconds logout hasn't occurred, log out
            // necessary for users accessing the logout page while logged out
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (_.isEqual(prevProps.currentUser, this.props.currentUser) &&
            prevState.logoutComplete === this.state.logoutComplete) {
            return;
        }

        if (this.props.currentUser.user_id && !this.state.logoutComplete) {
            this.logout();
        } else if (!this.props.currentUser.user_id && this.state.logoutComplete) {
            window.location.href = '/login';
        }
    }

    render() {
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <div>
                    <Loader loaded={false} options={LOADER_OPTIONS} className="spinner" />
                    Logging out...
                </div>
           </Layout>
        );
    }
}

var mapStateToProps = state => {
    var currentUser = {};
    if (state.currentUser) {
        currentUser = state.currentUser;
    }
    return {
        currentUser,
    };
};

var Page = connect(mapStateToProps)(LogoutPage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

