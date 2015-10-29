import React from 'react';
import {Link} from 'react-router';

import Authorization from 'components/authorization'

import LOGO_URL from 'media/logo.png';
const LOGOUT = 'logout';
const CURRENT_USER_IS = 'You are logged in as ';

var GlobalHeader = React.createClass({
    render: function () {
        return (
            <div className="global-header">
                <div className="logo" alt="Change My World Now"><img src={LOGO_URL} /><Link to="/" >Change My World Now</Link></div>
                <div className="logout"><a href='#' onClick={this.logout}>{LOGOUT}</a></div>
                <div className="current-user-info">{CURRENT_USER_IS + Authorization.currentUserName}</div>
            </div>
        );
    }
});

export default GlobalHeader;

