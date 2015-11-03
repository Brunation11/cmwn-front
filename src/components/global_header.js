import React from 'react';
import {Link} from 'react-router';
import {Button, Glyphicon} from 'react-bootstrap';

import Authorization from 'components/authorization'
import EventManager from 'components/event_manager'

import LOGO_URL from 'media/logo.png';
import LOGOUT_URL from 'media/pt_logout_on.png';
import MENU_URL from 'media/MenuIcon4.png';
const LOGOUT = 'logout';
const CURRENT_USER_IS = 'You are logged in as ';
const MENU = 'Menu'
var GlobalHeader = React.createClass({
    toggleMenu: function () {
        var isOpen = EventManager.get('menuIsOpen');
        EventManager.update('menuIsOpen', !isOpen);
    },
    render: function () {
        return (
            <div className="global-header">
                <div className="logo" ><Link to="/" ><img alt="Change My World Now" src={LOGO_URL} />Change My World Now</Link></div>
                <Button className="menu" onClick={this.toggleMenu}>
                   <Glyphicon glyph="glyphicon glyphicon-menu-hamburger" />
                   <span className="fallback">{MENU}</span>
                </Button>
                <div className="logout"><a href='#' onClick={this.logout}> 
                    <img src={LOGOUT_URL} alt={LOGOUT} />{LOGOUT} 
                </a></div>
                <div className="current-user-info">{CURRENT_USER_IS + Authorization.currentUserName}</div>
            </div>
        );
    }
});

export default GlobalHeader;

