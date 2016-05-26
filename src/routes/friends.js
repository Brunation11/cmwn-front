import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import {Button} from 'react-bootstrap';
import Shortid from 'shortid';

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
const PENDING = 'Request Pending';

const PAGE_UNIQUE_IDENTIFIER = 'friends-page';

var Component = React.createClass({
    addFriend: function (item, e) {
        var state = Store.getState();
        var id = item.user_id != null ? item.user_id : item.friend_id;
        e.stopPropagation();
        e.preventDefault();
        HttpManager.POST({url: state.currentUser._links.friend.href}, {
            'friend_id': id
        }).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
            Actions.dispatch.START_RELOAD_PAGE(Store.getState());
        }).catch(this.friendErr);
    },
    acceptRequest: function (item, e) {
        var state = Store.getState();
        var id = item.user_id != null ? item.user_id : item.friend_id;
        e.stopPropagation();
        e.preventDefault();
        HttpManager.POST({url: state.currentUser._links.friend.href}, {
            'friend_id': id
        }).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
            Actions.dispatch.START_RELOAD_PAGE(Store.getState());
        }).catch(this.friendErr);
    },
    doNothing: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    friendErr: function (e) {
        Toast.error(FRIEND_PROBLEM);
        Log.error(e, 'Friend request failed');
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/profile/${item.user_id == null ? item.friend_id : item.user_id}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.doNothing} className={ClassNames('blue standard', {faded: item.friend_status !== 'requested'})}>{PENDING}</Button>
                                <Button onClick={this.acceptRequest.bind(this, item)} className={ClassNames('blue standard', {faded: item.friend_status !== 'PENDING'})}>{REQUESTED}</Button>
                                <Button className="purple standard">{PROFILE}</Button>
                            </div></div>
                        </span>
                        <img src={item.image}></img>
                    </div>
                    <p className="linkText" >{item.username}</p>
                </Link>
            </div>
        );
    },
    render: function () {
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <form>
                    <Paginator data={this.props.data}>
                       <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.FRIENDS} transform={data => {
                           data = data.set('image', _.has(data, '_embedded.image[0].url') ? data.images.data[0].url : DefaultProfile);
                           return data;
                       }}/>
                   </Paginator >
                </form>
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data != null && state.page.data._embedded && state.page.data._embedded.friend) {
        loading = state.page.loading;
        data = state.page.data._embedded.friend;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;


