import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';
import Shortid from 'shortid';

import PopOver from 'components/popover';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import Toast from 'components/toast';
import Paginator from 'components/paginator';
import Actions from 'components/actions';
import Store from 'components/store';

import Layout from 'layouts/two_col';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/friends.scss';

const HEADINGS = {
    FRIENDS: 'My Friends'
};

const FRIEND_ADDED = 'Great! You are now friends with ';
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const PROFILE = 'View Profile';
const REQUESTED = 'Accept Request';
const PENDING = 'Request Sent';

const PAGE_UNIQUE_IDENTIFIER = 'friends-page';

var Component = React.createClass({
    addFriend: function (item, e) {
        var state = Store.getState();
        var id = item.user_id != null ? item.user_id : item.friend_id;
        var postBody = { 'friend_id': id };
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'send');
        HttpManager.POST({url: state.currentUser._links.friend.href}, postBody).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
            Actions.dispatch.START_RELOAD_PAGE(Store.getState());
        }).catch(this.friendErr.bind(null, postBody));
    },
    acceptRequest: function (item, e) {
        var state = Store.getState();
        var id = item.user_id != null ? item.user_id : item.friend_id;
        var postBody = { 'friend_id': id };
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'recieved');
        HttpManager.POST({url: state.currentUser._links.friend.href}, postBody).then(() => {
            Toast.success(FRIEND_ADDED + item.username);
            Actions.dispatch.START_RELOAD_PAGE(Store.getState());
        }).catch(this.friendErr.bind(null, postBody));
    },
    doNothing: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    friendErr: function (body, e) {
        Toast.error(FRIEND_PROBLEM);
        Log.error(e, 'Friend request failed', body);
    },

    renderFlip: function (item){
        if (item.embedded && item.embedded.flips) {
            return (
                <PopOver
                    element={item}
                    type="user"
                    trigger="click"
                >
                    {this.renderUserFlip(item)}
                </PopOver>
            );
        } else {
            return (
                this.renderUserFlip(item)
            );
        }
    },
    renderUserFlip: function (item) {
        return (
            <div className="flip" key={Shortid.generate()}>
                <div className="item">
                    <span className="overlay">
                        <div className="relwrap">
                            <div className="abswrap prompts">
                                <span className={ClassNames(
                                    'pending-prompt', {
                                        disabled: item.friend_status !== 'PENDING'
                                    }
                                )}>
                                    {PENDING}
                                </span>
                                <Button
                                    onClick={this.acceptRequest.bind(this, item)}
                                    className={ClassNames(
                                        'blue standard', {
                                            disabled: item.friend_status !== 'NEEDS_YOUR_ACCEPTANCE'
                                        }
                                    )}
                                >
                                    {REQUESTED}
                                </Button>
                                <a
                                    href={`/profile/${item.user_id == null ? item.friend_id : item.user_id}`}
                                    className="btn purple standard"
                                >
                                    {PROFILE}
                                </a>
                            </div>
                        </div>
                    </span>
                    <img src={item.image}></img>
                </div>
                <p className="link-text" >{item.username}</p>
            </div>
        );
    },
    render: function () {
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <form>
                    <Paginator rowCount={this.props.rowCount} currentPage={this.props.currentPage}
                        pageCount={this.props.pageCount} data={this.props.data} pagePaginator={true}>
                       <FlipBoard
                            // add conditional to check if user has flips
                            // render either renderflip or renderuserflip
                           renderFlip={this.renderFlip}
                           header={HEADINGS.FRIENDS}
                           transform={data => {
                               var image;
                               if (!_.has(data, '_embedded.image')) {
                                   image = DefaultProfile;
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
                   </Paginator>
                </form>
           </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = [];
    var loading = true;
    var rowCount = 1;
    var currentPage = 1;
    var pageCount = 1;
    if (state.page && state.page.data != null &&
        state.page.data._embedded && state.page.data._embedded.friend) {
        loading = state.page.loading;
        data = state.page.data._embedded.friend;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
        pageCount = state.page.data.page_count;
    }
    return {
        data,
        loading,
        rowCount,
        currentPage,
        pageCount
    };
};

var Page = connect(mapStateToProps)(Component);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

