import React from 'react';
import {Panel} from 'react-bootstrap';
import ClassNames from 'classnames';
import _ from 'lodash';

import HttpManager from 'components/http_manager';
import Toggler from 'components/toggler';
import GLOBALS from 'components/globals';

import 'components/friend_list.scss';

const HEADING = 'Friends';
const REQUESTS = 'Friend Requests';
const PENDING = 'Pending Friends';

var FriendList = React.createClass({
    getInitialState: function () {
        this.pending = [];
        this.requests = [];
        this.accepted = [];
        return {
            friendsHidden: false,
            requestsHidden: true,
            pendingHidden: true
        };
    },
    componentWillMount: function () {
        HttpManager.GET(GLOBALS.API_URL + 'friends').then(responses => {
            this.pending = responses.response.pendingfriends;
            this.requests = responses.response.pendingfriends;
            this.accepted = responses.response.acceptedfriends;
            this.forceUpdate();
        }).catch(() => {
            /** @TODO MPR, 12/22/15: alert user*/
        });
    },
    toggleFriends: function () {
        this.setState({friendsHidden: !this.state.friendsHidden});
    },
    togglePending: function () {
        this.setState({pendingHidden: !this.state.pendingHidden});
    },
    toggleRequested: function () {
        this.setState({requestsHidden: !this.state.requestsHidden});
    },
    renderFriend: function (item) {
        return (
           <div className="friend">{`${item.first_name} ${item.last_name}`}</div>
        );
    },
    renderFriends: function () {
        return _.map(this.accepted, item => (<li key={item.uuid}>{this.renderFriend(item)}</li>));
    },
    renderPending: function () {
        return _.map(this.pending, item => (<li key={item.uuid}>{this.renderFriend(item)}</li>));
    },
    renderRequests: function () {
        return _.map(this.requests, item => (<li key={item.uuid}>{this.renderFriend(item)}</li>));
    },
    render: function () {
        //disabled indefinetly
        return null;
        /* eslint-disable */
        return (
            <div className="friend-list">
                <h3 onClick={this.toggleFriends}>{HEADING}<Toggler isOpen={!this.state.friendsHidden} /></h3>
                <Panel className={ClassNames({collapsed: this.state.friendsHidden})}><ul>
                    {this.renderFriends}
                </ul></Panel>
                <h4 onClick={this.toggleRequested}>{REQUESTS}<Toggler isOpen={!this.state.requestsHidden} /></h4>
                <Panel className={ClassNames({collapsed: this.state.requestsHidden})}><ul>
                    {this.renderRequests()}
                </ul></Panel>
                <h4 onClick={this.togglePending}>{PENDING}<Toggler isOpen={!this.state.pendingHidden} /></h4>
                <Panel className={ClassNames({collapsed: this.state.pendingHidden})}><ul>
                    {this.renderPending()}
                </ul></Panel>
            </div>
        );
    }
});

export default FriendList;

