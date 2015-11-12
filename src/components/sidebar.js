import React from 'react';

import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';
import ProfileImage from 'components/profile_image';

var Sidebar = React.createClass({
    render: function () {
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                <ProfileImage />
                <SiteNav />
                <FriendList />
            </div>
        );
    }
});

export default Sidebar;

