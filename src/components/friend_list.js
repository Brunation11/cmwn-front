import React from 'react';

import HttpManager from 'components/http_manager';

const HEADING = 'Friends';
const REQUESTS = 'Friend Requests';
const PENDING = 'Pending Friends';

var FriendList = React.createClass({
    render: function () {
        return (
            <div>
                <h3>{HEADING}</h3>
                <h4>{REQUESTS}</h4>
                <h4>{PENDING}</h4> 
            </div>
        );
    }
});

export default FriendList;

