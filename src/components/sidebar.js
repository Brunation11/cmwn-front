import React from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import SiteNav from 'components/site_nav';
//import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';

import 'components/sidebar.scss';

const WELCOME = 'Welcome';

var Sidebar = React.createClass({
    renderWelcome: function () {
        return (
            <div>
                <p className="welcome">{WELCOME}</p>
                <p className={ClassNames('username')}>
                    <a onClick={this.attemptNavigate}>
                        {this.props.currentUser.username}
                    </a>
                </p>
            </div>
        );
    },
    render: function () {
        if (this.props.currentUser.username == null ||
            this.props.currentUser.username.toLowerCase() === 'null') {
            return null;
        }
        return (
            <div id={this.props.navMenuId} className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                {this.renderWelcome()}
                <ProfileImage data={this.props.currentUser} currentUser={this.props.currentUser} />
                <SiteNav currentUser={this.props.currentUser}
                    data={this.props.currentUser._links.asMutable()} />
                {''/*<FriendList />*/}
            </div>
        );
    }
});

export default Sidebar;

