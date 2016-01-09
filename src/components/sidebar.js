import React from 'react';

import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';
import Authorization from 'components/authorization';
import EventManager from 'components/event_manager';
import History from 'components/history';

import 'components/sidebar.scss';

const WELCOME = 'Welcome';

var Sidebar = React.createClass({
    componentDidMount: function () {
        EventManager.listen('userChanged', () => {
            this.forceUpdate();
        });
    },
    attemptNavigate: function () {
        History.replaceState(null, '/profile');
    },
    renderWelcome: function () {
        return (
            <div>
                <p className="welcome">{WELCOME}</p>
                <p className="username">{Authorization.currentUser.username}<a onClick={this.attemptNavigate} > </a></p>
            </div>
        );
    },
    render: function () {
        if (Authorization.currentUser.username == null || Authorization.currentUser.username.toLowerCase() === 'null') {
            return null;
        }
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                {this.renderWelcome()}
                <a onClick={this.attemptNavigate} >
                    <ProfileImage uuid={Authorization.currentUser.uuid}/>
                </a>
                <SiteNav />
                <FriendList />
            </div>
        );
    }
});

export default Sidebar;

