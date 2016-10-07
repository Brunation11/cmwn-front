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
import GLOBALS from 'components/globals';
import Flag from 'components/flag';

import Layout from 'layouts/two_col';

import 'routes/friends.scss';

const HEADINGS = {
    FRIENDS: 'My Friends'
};

const FRIEND_ADDED = 'Great! You are now friends with ';
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const PROFILE = 'View Profile';
const REQUESTED = 'Accept Request';
const PENDING = 'Request Sent';
const NO_FRIENDS = (
    <h2 className="placeholder">
        Looks like you haven't added any friends yet. Let's go{' '}
        <Link to="/friends/suggested">find some!</Link>
    </h2>
);

const PAGE_UNIQUE_IDENTIFIER = 'friends-page';

var mapStateToProps;
var Page;

export class Friends extends React.Component {
    constructor(){
        super();
    }

    addFriend(item, e) {
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'send');

        HttpManager.POST({
            url: this.props.currentUser._links.friend.href
        }, {
            'friend_id': item.user_id != null ? item.user_id : item.friend_id
        }).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
            Actions.dispatch.START_RELOAD_PAGE(this.props);
        }).catch((e) => {
            Toast.error(FRIEND_PROBLEM);
            Log.error(e, 'Friend request failed');
        });
    }

    acceptRequest(item, e) {
        e.stopPropagation();
        e.preventDefault();
        ga('set', 'dimension7', 'recieved');

        HttpManager.POST({
            url: this.props.currentUser._links.friend.href
        }, {
            'friend_id': item.user_id != null ? item.user_id : item.friend_id
        }).then(() => {
            Toast.success(FRIEND_ADDED + item.username);
            Actions.dispatch.START_RELOAD_PAGE(this.props);
        }).catch((e) => {
            Toast.error(FRIEND_PROBLEM);
            Log.error(e, 'Friend request failed');
        });
    }

    renderRequestStatus(item) {
        return (
            <span
                className={ClassNames(
                    'request-status', {
                        disabled: item.friend_status !== 'PENDING'
                    }
                )}
            >
                {PENDING}
            </span>
        );
    }

    renderAcceptRequestButton(item) {
        return (
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
        );
    }

    renderViewProfileButton(item) {
        return (
            <a
                className="btn purple standard"
                href={`/profile/${item.user_id == null ? item.friend_id : item.user_id}`}
            >
                {PROFILE}
            </a>
        );
    }

    renderUserCard(item) {
        return (
            <div className="user-card" key={Shortid.generate()}>
                <span className="overlay">
                    <div className="prompts">
                        {this.renderRequestStatus(item)}
                        <br />
                        {this.renderAcceptRequestButton(item)}
                        <br />
                        {this.renderViewProfileButton(item)}
                    </div>
                </span>
                <img className="avatar" src={item.image}></img>
                <p className="link-text" >{item.username}</p>
            </div>
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
                    {this.renderUserCard.call(this, item)}
                </UserPopover>
            </Flag>
        );
    }

    render() {
        if (this.props.data.length === 0) {
            return (
                <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                    {NO_FRIENDS}
                </Layout>
            );
        }

        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <form>
                    <Paginator
                        rowCount={this.props.rowCount}
                        currentPage={this.props.currentPage}
                        pageCount={this.props.pageCount}
                        data={this.props.data}
                        pagePaginator={true}
                    >
                        <FlipBoard
                           renderFlip={this.renderCard.bind(this)}
                           header={HEADINGS.FRIENDS}
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
                   </Paginator>
                </form>
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
