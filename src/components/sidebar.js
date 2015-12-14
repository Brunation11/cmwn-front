import React from 'react';

import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';
import Authorization from 'components/authorization';
import EventManager from 'components/event_manager';

import 'components/sidebar.scss';

const WELCOME = 'Welcome';

var Sidebar = React.createClass({
    componentDidMount: function () {
        EventManager.listen('userChanged', this.forceUpdate);
    },
    attemptNavigate: function () {
        window.location.href = '/profile';
    },
    render: function () {
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                <p className="welcome">{WELCOME}</p>
                <p className="username">{Authorization.currentUser.username}<a onClick={this.attemptNavigate} > </a></p>
                <a onClick={this.attemptNavigate} >
                    <ProfileImage />
                </a>
                <SiteNav />
                <FriendList />
            </div>
        );
    }
});

export default Sidebar;

