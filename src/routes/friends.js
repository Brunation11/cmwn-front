import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Shortid from 'shortid';

import UserPopover from 'components/popovers/user_popover';
import Log from 'components/log';
import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import Toast from 'components/toast';
import Paginator from 'components/paginator';
import Actions from 'components/actions';

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

var mapStateToProps;
var Page;

class Friends extends React.Component {

    addFriend(item, e) {
        var id = item.user_id != null ? item.user_id : item.friend_id;
        var postBody = { 'friend_id': id };
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'send');
        HttpManager.POST({url: this.props.currentUser._links.friend.href}, postBody).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
            Actions.dispatch.START_RELOAD_PAGE(this.props);
        }).catch(this.friendErr.bind(null, postBody));
    }

    acceptRequest(item, e) {
        var id = item.user_id != null ? item.user_id : item.friend_id;
        var postBody = { 'friend_id': id };
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'recieved');
        HttpManager.POST({url: this.props.currentUser._links.friend.href}, postBody).then(() => {
            Toast.success(FRIEND_ADDED + item.username);
            Actions.dispatch.START_RELOAD_PAGE(this.props);
        }).catch(this.friendErr.bind(null, postBody));
    }

    doNothing(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    friendErr(e) {
        Toast.error(FRIEND_PROBLEM);
        Log.error(e, 'Friend request failed');
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
    }

    render() {
        const NO_FRIENDS = (
                <h2 className="placeholder">
                    Looks like you haven't added any friends yet. Let's go{' '}
                    <Link to="/friends/suggested">find some!</Link>
                </h2>
        );
        if (this.props.data.length === 0) {
            return (
                <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                    {NO_FRIENDS}
                </Layout>
            );
        }
        const FRIENDS = (
            <form>
                <Paginator rowCount={this.props.rowCount} currentPage={this.props.currentPage}
                    pageCount={this.props.pageCount} data={this.props.data} pagePaginator={true}>
                   <FlipBoard
                       // add conditional to check if user has flips
                       // render either renderflip or renderuserflip
                       renderFlip={this.renderFlip.bind(this)}
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
        );
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                {FRIENDS}
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var rowCount = 1;
    var currentPage = 1;
    var pageCount = 1;
    var currentUser = {};
    if (state.page && state.page.data != null &&
        state.page.data._embedded && state.page.data._embedded.friend) {
        loading = state.page.loading;
        data = state.page.data._embedded.friend;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
        pageCount = state.page.data.page_count;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        rowCount,
        currentPage,
        pageCount,
        currentUser
    };
};

Page = connect(mapStateToProps)(Friends);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

