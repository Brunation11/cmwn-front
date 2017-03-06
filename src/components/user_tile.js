import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { Button } from 'react-bootstrap';

import UserPopover from 'components/popovers/user_popover';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Flag from 'components/flag';

import 'components/user_tile.scss';

const FRIEND_ADDED = 'Great! You are now friends with ';
const ADD_FRIEND = 'Add Friend';
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const PROFILE = 'View Profile';
const REQUESTED = 'Accept Request';
const PENDING = 'Request Sent';

const COMPONENT_UNIQUE_IDENTIFIER = 'user-tile';

export class Component extends React.Component {
    constructor(){
        super();
    }

    addFriend(e) {
        e.stopPropagation();
        e.preventDefault();
        ga('send', 'event', {
            'eventCategory': 'Friend',
            'eventAction': 'Sent',
            'dimension7': 'sent'
        });

        HttpManager.POST({
            url: this.props.friendHAL
        }, {
            'friend_id': this.props.item.user_id != null ? this.props.item.user_id : this.props.item.friend_id
        }).then(() => {
            Toast.success(FRIEND_ADDED + this.props.item.username);
            this.forceUpdate();
            this.props.onFriendAdded();
        }).catch((err) => {
            Toast.error(FRIEND_PROBLEM);
            Log.error(err, 'Friend request failed');
        });
    }

    acceptRequest(e) {
        e.stopPropagation();
        e.preventDefault();
        ga('send', 'event', {
            'eventCategory': 'Friend',
            'eventAction': 'Recieved',
            'dimension7': 'recieved'
        });

        HttpManager.POST({
            url: this.props.friendHAL
        }, {
            'friend_id': this.props.item.user_id != null ? this.props.item.user_id : this.props.item.friend_id
        }).then(() => {
            Toast.success(FRIEND_ADDED + this.props.item.username);
            this.props.onFriendRequested();
            //Actions.dispatch.START_RELOAD_PAGE(this.props);
        }).catch((err) => {
            Toast.error(FRIEND_PROBLEM);
            Log.error(err, 'Friend request failed');
        });
    }

    renderRequestStatus() {
        return (
            <span
                className={ClassNames(
                    'request-status', {
                        disabled: this.props.item.friend_status !== 'PENDING'
                    }
                )}
            >
                {PENDING}
            </span>
        );
    }

    renderAddFriendButton() {
        if (!this.props.showAdd) return null;
        return (
            <Button
                onClick={this.addFriend.bind(this)}
                className={ClassNames(
                    'green standard', {
                        hidden: this.props.item.relationship === 'Pending' ||
                        this.props.item.relationship === 'requested'
                    }
                )}
            >
                {ADD_FRIEND}
            </Button>
        );
    }


    renderAcceptRequestButton() {
        return (
            <Button
                onClick={this.acceptRequest.bind(this)}
                className={ClassNames(
                    'blue standard', {
                        disabled: this.props.item.friend_status !== 'NEEDS_YOUR_ACCEPTANCE'
                    }
                )}
            >
                {REQUESTED}
            </Button>
        );
    }

    renderViewProfileButton() {
        return (
            <a
                className="btn purple standard"
                href={`/profile/${this.props.item.user_id == null ?
                    this.props.item.friend_id :
                    this.props.item.user_id}`}
            >
                {PROFILE}
            </a>
        );
    }

    render() {
        if (this.props.item == null) return null;
        return (
            <Flag
                className={COMPONENT_UNIQUE_IDENTIFIER}
                data={this.props.item}
            >
                <UserPopover
                    element={this.props.item}
                    trigger="click"
                >
                    <div className="user-card">
                        <span className="overlay">
                            <div className="prompts">
                                {this.renderAddFriendButton()}
                                {this.renderRequestStatus()}
                                <br />
                                {this.renderAcceptRequestButton()}
                                <br />
                                {this.renderViewProfileButton()}
                            </div>
                        </span>
                        <img className="avatar" src={this.props.item.image}></img>
                        <p className="link-text" >{this.props.item.username}</p>
                    </div>
                </UserPopover>
            </Flag>
        );
    }
}

Component.defaultProps = {
    onFriendAdded: _.identity,
    onFriendRequested: _.identity
};

Component._IDENTIFIER = COMPONENT_UNIQUE_IDENTIFIER;
export default Component;
