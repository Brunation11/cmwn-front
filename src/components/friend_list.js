import React from 'react';
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';

const HEADING = 'Friends';
const REQUESTS = 'Friend Requests';
const PENDING = 'Pending Friends';

var FriendList = React.createClass({
    pending: [],
    requests: [],
    getInitialState: function () {
        HttpManager.GET([
            GLOBALS.API_URL + 'friends/pending',
            GLOBALS.API_URL + 'friends/requests',
        ]).then(responses => {
            this.pending = responses[0].response.data;
            this.requests = responses[1].response.data;
            this.forceUpdate();
        });
        return {};
    },
    renderFriend: function (item) {
        return (
           <div className="friend">{`${item.first_name} ${item.last_name}`}</div>
        );
    },
    renderPending: function () {
        return _.map(this.pending, item => (<li key={item.id}>{this.renderFriend(item)}</li>)); 
    },
    renderRequests: function () {
        return _.map(this.requests, item => (<li key={item.id}>{this.renderFriend(item)}</li>)); 
    },
    render: function () {
        return (
            <div>
                <h3>{HEADING}</h3>
                <h4>{REQUESTS}</h4>
                {this.renderRequests()}
                <h4>{PENDING}</h4>
                {this.renderPending()}
            </div>
        );
    }
});

export default FriendList;

