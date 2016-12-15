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
import GenerateDataSource from 'components/datasource';

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

const SUGGEST_SOURCE = GenerateDataSource('suggested_friends', PAGE_UNIQUE_IDENTIFIER);

var mapStateToProps;
var Page;

export class Suggested extends React.Component{
    constructor(){
        super();
    }

    addFriend(item, e) {
        e.stopPropagation();
        e.preventDefault();
        ga('send', 'event', {
            'eventCategory': 'Friend',
            'eventAction': 'Sent',
            'dimension7': 'sent'
        });

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

    renderNoLink() {
        return (
            <h2 className="placeholder">
                At this time, as an adult user you cannot make friends ...<br/>
                but it is on the way!!!!
            </h2>
        );
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
                href={`/profile/${item.suggest_id ? item.suggest_id : item.suggested_id}`}
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
        var content = (
            <form>
                <SUGGEST_SOURCE
                    renderNoLink={this.renderNoLink}
                    renderNoData={this.renderNoData}
                >
                    <FlipBoard
                        renderFlip={this.renderCard.bind(this)}
                        header={HEADINGS.SUGGESTED}
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
                </SUGGEST_SOURCE>
            </form>
        );

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
    var currentUser = {};
    var loading = true;
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        state,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Suggested);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
