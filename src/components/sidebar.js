import React from 'react';
import { connect } from 'react-redux';

import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';
import History from 'components/history';

import 'components/sidebar.scss';

const WELCOME = 'Welcome';

var Component = React.createClass({
    attemptNavigate: function () {
        History.push('/profile');
    },
    renderWelcome: function () {
        return (
            <div>
                <p className="welcome">{WELCOME}</p>
                <p className="username">{this.props.currentUser.username}<a onClick={this.attemptNavigate} > </a></p>
            </div>
        );
    },
    render: function () {
        if (this.props.currentUser.username == null || this.props.currentUser.username.toLowerCase() === 'null') {
            return null;
        }
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                {this.renderWelcome()}
                <a onClick={this.attemptNavigate} >
                    <ProfileImage user_id={this.props.currentUser.user_id}/>
                </a>
                <SiteNav />
                <FriendList />
            </div>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    state.currentUser;
    if (state.currentUser && state.currentUser._links) {
        data = state.currentUser._links;
    }
    return { currentUser: state.currentUser, data };
};

var Sidebar = connect(mapStateToProps)(Component);

export default Sidebar;

