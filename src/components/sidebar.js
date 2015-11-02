import React from 'react';

import GLOBALS from 'components/globals';
import SiteNav from 'components/site_nav';
import FriendList from 'components/friend_list';

const PIC_ALT = 'Profile Picture';

var Sidebar = React.createClass({
    render: function () {
        return (
            <div className={'sidebar ' + (this.props.menuIsOpen ? 'open' : '')}>
                <div
                    className="profile-pic"
                    alt={PIC_ALT}
                    style={{'backgroundImage':`url("${GLOBALS.CURRENT_USER.PROFILE_IMAGE}")`}}
                >
                     {PIC_ALT}
                </div>
                <SiteNav />
                <FriendList />
            </div>
        );
    }
});

export default Sidebar; 

