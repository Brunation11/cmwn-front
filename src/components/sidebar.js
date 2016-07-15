import React from 'react';
import { connect } from 'react-redux';
import ClassNames from 'classnames';

import SiteNav from 'components/site_nav';
//import FriendList from 'components/friend_list';
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
                <p className={ClassNames('username',
                    {'smaller-text': this.props.currentUser.username.length >= 25,
                    'regular-text': this.props.currentUser.username.length < 25})}>
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
                <a onClick={this.attemptNavigate} >
                    <ProfileImage data={this.props.currentUser} currentUser={this.props.currentUser} />
                </a>
                <SiteNav />
                {''/*<FriendList />*/}
            </div>
        );
    }
});

var mapStateToProps = state => {
    var data = [];
    state.currentUser;
    if (state.currentUser && state.currentUser._links) {
        data = state.currentUser._links;
    }
    return { currentUser: state.currentUser, data };
};

var Sidebar = connect(mapStateToProps)(Component);

export default Sidebar;

