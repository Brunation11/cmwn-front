import React from 'react';
import {Link} from 'react-router';

import Authorization from 'components/authorization'

const LOGOUT = 'logout';
const CURRENT_USER_IS = 'You are logged in as ';

var GlobalHeader = React.createClass({
    render: function () {
        return (
            <div class="global-header">
                <div class="logo"><Link to="/" >Change My World Now</Link></div>
                <div class="logout"><a href='#' onClick={this.logout}>{LOGOUT}</a></div>
                <div class="current-user-info">{CURRENT_USER_IS + Authorization.currentUserName}</div>
            </div>
        );
    }
});

export default GlobalHeader;

