import React from 'react';
import {Link} from 'react-router';
import ClassNames from 'classnames';
import {Button, Glyphicon} from 'react-bootstrap';

import EventManager from 'components/event_manager';

//import LOGO_URL from 'media/logo.png';
import LOGO_URL from 'media/header-logo.png';
import LOGO_HEADER from 'media/header-header.png';

const LOGOUT = 'LOGOUT';
const CURRENT_USER_IS = 'You are logged in as ';
const MENU = 'Menu';

var GlobalHeader = React.createClass({

    getDefaultProps: function () {
        return {
            logoLink: '/'
        };
    },
    toggleMenu: function () {
        var isOpen = EventManager.get('menuIsOpen');
        EventManager.update('menuIsOpen', !isOpen);
    },
    logOut: function () {
        window.location.href = '/logout';
    },
    renderLoggedInUser: function () {
        if (this.props.currentUser.uuid != null && this.props.currentUser.uuid !== 'null') {
            return (
                <div className="current-user-info">
                    {CURRENT_USER_IS} <a href="/profile" >{this.props.currentUser.fullname}</a>
                </div>
            );
        }
        return null;
    },
    renderLogout: function () {
        if (!this.props.currentUser || (this.props.currentUser &&
            (this.props.currentUser.username == null ||
            this.props.currentUser.username.toLowerCase() === 'null'))
        ) {
            return null;
        }
        return (
            <Button className="btn standard purple logout" onClick={this.logOut}>
                {LOGOUT}
            </Button>
        );
    },
    render: function () {
        return (
            <div className="global-header">
                <div className="logo" >
                    <Link to={this.props.logoLink} >
                        <img alt="Change My World Now" src={LOGO_URL} />
                    </Link>
                </div>
                <div className="header-logo">
                    <Link to={this.props.logoLink} >
                        <img alt="Change My World Now" src={LOGO_HEADER} />
                        <span className="read">Change My World Now</span>
                    </Link>
                </div>
                <Button className={ClassNames('menu', {hidden: !this.props.currentUser.user_id})}
                    onClick={this.toggleMenu}
                >
                    <Glyphicon glyph="glyphicon glyphicon-menu-hamburger" />
                    <span className="fallback">{MENU}</span>
                </Button>
                {this.renderLogout()}
                <div className="blocker"></div>
            </div>
        );
    }
});

export default GlobalHeader;

