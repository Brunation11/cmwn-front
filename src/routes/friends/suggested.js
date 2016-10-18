import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import Toast from 'components/toast';
import ClassNames from 'classnames';
import HttpManager from 'components/http_manager';
import Actions from 'components/actions';
import UserPopover from 'components/popovers/user_popover';
import GLOBALS from 'components/globals';
import Flag from 'components/flag';

import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};

const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const REQUEST_SENT = 'Your friend request has been sent!';
const ADD_FRIEND = 'Add Friend';
const REQUESTED = 'Request Sent';
const ACCEPT = 'Accept';
const PROFILE = 'View Profile';

const PAGE_UNIQUE_IDENTIFIER = 'suggested-friends';

var mapStateToProps;
var Page;

export class Suggested extends React.Component{
    constructor(){
        super();
    }

    addFriend(item, e) {
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'sent');

        HttpManager.POST({
            url: this.props.currentUser._links.friend.href
        }, {
            'friend_id': item.user_id != null ? item.user_id : item.suggest_id
        }).then(() => {
            Toast.success(REQUEST_SENT);
            Actions.dispatch.START_RELOAD_PAGE(this.props.state);
        }).catch(() => {
            Toast.error(FRIEND_PROBLEM);
        });
    }

    renderNoData(data) {
        if (data == null) {
            return null;
        }
        return (
            <h2 className="placeholder">
                You are already friends with everyone in your group.<br />
                Great Work! <br />
                Let's Take Action!
            </h2>
        );
    }

    renderRequestStatus(item) {
        return (
            <span
                className={ClassNames(
                    'request-status', {
                        hidden: item.relationship !== 'requested'
                    }
                )}
            >
                {REQUESTED}
            </span>
        );
    }

    renderAddFriendButton(item) {
        return (
            <Button
                onClick={this.addFriend.bind(this, item)}
                className={ClassNames(
                    'green standard', {
                        hidden: item.relationship === 'Pending' ||
                        item.relationship === 'requested'
                    }
                )}
            >
                {ADD_FRIEND}
            </Button>
        );
    }

    renderAcceptRequestButton(item) {
        return (
            <Button
                onClick={this.addFriend.bind(this, item)}
                className={ClassNames(
                    'blue standard', {
                        hidden: item.relationship !== 'Pending'
                    }
                )}
            >
                {ACCEPT}
            </Button>
        );
    }

    renderViewProfileButton(item) {
        return (
            <a
                className="btn purple standard"
                href={`/profile/${item.suggested_id}`}
            >
                {PROFILE}
            </a>
        );
    }

    renderCard(item) {
        return (
            <Flag
                data={item}
            >
                <UserPopover
                    element={item}
                    trigger="click"
                >
                    <div className="user-card" key={Shortid.generate()}>
                        <span className="overlay">
                            <div className="prompts">
                                {this.renderAddFriendButton(item)}
                                <br />
                                {this.renderAcceptRequestButton(item)}
                                <br />
                                {this.renderRequestStatus(item)}
                                <br />
                                {this.renderViewProfileButton(item)}
                            </div>
                        </span>
                        <img className="avatar" src={item.image}></img>
                        <p className="link-text" >{item.username}</p>
                    </div>
                </UserPopover>
            </Flag>
        );
    }

    render() {
        var self = this;
        var content;
        if (self.props.data == null || !self.props.data.length) {
            content = self.renderNoData(self.props.data);
        } else {
            content = (
                <form>
                    <FlipBoard
                        renderFlip={this.renderCard.bind(this)}
                        header={HEADINGS.SUGGESTED}
                        data={this.props.data}
                        transform={data => {
                            var image;
                            if (!_.has(data, '_embedded.image')) {
                                image = GLOBALS.DEFAULT_PROFILE;
                            } else {
                                if (data._embedded.image.url != null) {
                                    image = data._embedded.image.url;
                                } else {
                                    image = data.images.data[0].url;
                                }
                            }
                            return data.set('image', image);
                        }}
                    />
                </form>
            );
        }
        return (
           <Layout
               className={PAGE_UNIQUE_IDENTIFIER}
               currentUser={this.props.currentUser}
           >
               {content}
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = null;
    var currentUser = {};
    var loading = true;
    if (state.page && state.page.data != null &&
        state.page.data._embedded && state.page.data._embedded.suggest) {
        loading = state.page.loading;
        data = state.page.data._embedded.suggest;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        state,
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Suggested);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
