import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import {Panel, Button} from 'react-bootstrap';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import Toast from 'components/toast';
import ClassNames from 'classnames';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Actions from 'components/actions';
import Store from 'components/store';
import UserPopover from 'components/popovers/user_popover';
import GLOBALS from 'components/globals';

import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

const PAGE_UNIQUE_IDENTIFIER = 'suggested-friends';

const NO_FRIENDS = (
    <div>You are already friends with everyone in your group.
        <br /> Great Work! <br /> Let's Take Action!
    </div>);
const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const REQUEST_SENT = 'Your friend request has been sent!';
const ADD_FRIEND = 'Add Friend';
const REQUESTED = 'Request Sent';
const ACCEPT = 'Accept';
const PROFILE = 'View Profile';

var mapStateToProps;
var Page;

export class Suggested extends React.Component{
    constructor(){
        super();
    }

    addFriend(item, e) {
        var id = item.user_id != null ? item.user_id : item.suggest_id;
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'sent');
        HttpManager.POST({url: this.props.currentUser._links.friend.href}, {
            'friend_id': id
        }).then(() => {
            Toast.success(REQUEST_SENT);
            Actions.dispatch.START_RELOAD_PAGE(Store.getState());
        }).catch(() => {
            Toast.error(FRIEND_PROBLEM);
        });
    }

    renderNoData(data) {
        if (data == null) {
            //render nothing before a request has been made
            return null;
        }
        //render a nice message if the list is actually empty
        return (
            <Panel header={HEADINGS.SUGGESTED} className="standard">
                <h2>{NO_FRIENDS}</h2>
                <p><a onClick={History.goBack}>Back</a></p>
            </Panel>
        );
    }

    renderFlip(item) {
        return (
            <UserPopover
                element={item}
                trigger="click"
            >
                {this.renderUserFlip.call(this, item)}
            </UserPopover>
        );
    }

    renderUserFlip(item) {
        var history = History;
        var self = this;
        return (
            <div className="flip" key={Shortid.generate()}>
                <div className="item">
                    <span className="overlay">
                        <div className="relwrap">
                            <div className="abswrap">
                                <Button
                                    onClick={self.addFriend.bind(self, item)}
                                    className={ClassNames('green standard', {
                                        hidden: item.relationship === 'Pending' ||
                                                item.relationship === 'requested'
                                    })}
                                 >
                                    {ADD_FRIEND}
                                </Button>
                                <Button
                                    onClick={self.addFriend.bind(self, item)}
                                    className={ClassNames('blue standard', {
                                        hidden: item.relationship !== 'Pending'
                                    })}
                                >
                                    {ACCEPT}
                                </Button>
                                <Button
                                    className={ClassNames('blue standard', {
                                        hidden: item.relationship !== 'requested'
                                    })}
                                >
                                    {REQUESTED}
                                </Button>
                                <Button
                                    className="purple standard"
                                    onClick={history.push.bind(null, '/profile/' + item.suggest_id)}
                                >
                                    {PROFILE}
                                </Button>
                            </div>
                        </div>
                    </span>
                    <img src={item.image}></img>
                </div>
                <p className="link-text" >{item.username}</p>
            </div>
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
                        renderFlip={this.renderFlip.bind(this)}
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

                            data = data.set('image', image);

                            return data;
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
    if (state.page && state.page.data != null && state.page.data._embedded &&
        state.page.data._embedded.suggest) {
        loading = state.page.loading;
        data = state.page.data._embedded.suggest;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Suggested);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

