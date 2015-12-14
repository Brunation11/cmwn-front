import React from 'react';

import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';

var Sidebar = React.createClass({
    attemptNavigate: function () {
        window.location.href = '/profile';
    },
    render: function () {
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
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

