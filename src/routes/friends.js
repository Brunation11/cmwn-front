import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';
import Shortid from 'shortid';

import Log from 'components/log';
import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
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

var Page = React.createClass({
    getInitialState: function () {
        HttpManager.GET({url: GLOBALS.API_URL + 'users?include=roles,flips,images', handleErrors: false}).then(res => {
            this.friends = res.response.data;
        });
        return {};
    },
    addFriend: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.POST({url: GLOBALS.API_URL + 'friends/', handleErrors: false}, {
            'user_id': item.uuid
        }).catch(this.friendErr);
        item.relationship = 'Pending';
        this.forceUpdate;
    },
    acceptRequest: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.POST({url: GLOBALS.API_URL + 'friends/', handleErrors: false}, {
            'user_id': item.uuid
        }).then(() => {
            this.refs.fetcher.getData().then(() => {
                Toast.success(FRIEND_ADDED + item.username);
                this.forceUpdate();
            });
        }).catch(this.friendErr);
        e.target.className += ' faded'; //element will be replaced so we need to cheat a little
    },
    doNothing: function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    friendErr: function (e) {
        Toast.error(FRIEND_PROBLEM);
        Log.error(e, 'Friend request failed');
    },
    transformFriend: function (type, item) {
        var realFriend = _.find(this.friends, friend => friend.uuid === item.uuid);
        if (realFriend != null) {
            item = realFriend;
        }
        item.relationship = type;
        item.image = _.has(item, 'images.data[0].url') ? item.images.data[0].url : DefaultProfile;
        item.flips = item.flips == null ? 0 : item.flips.data.length;
        return item;
    },
    renderFlipsEarned: function (item) {
        if (item.roles && item.roles.data && !~item.roles.data.indexOf('Student')) {
            return null;
        }
        return (
            <p className="userFlips" key={Shortid.generate()}>{item.flips} Flips Earned</p>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.uuid}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.doNothing} className={ClassNames('blue standard', {faded: item.relationship !== 'pending'})}>{PENDING}</Button>
                                <Button onClick={this.acceptRequest.bind(this, item)} className={ClassNames('blue standard', {faded: item.relationship !== 'requested'})}>{REQUESTED}</Button>
                                <Button className="purple standard">{PROFILE}</Button>
                            </div></div>
                        </span>
                        <img src={item.image}></img>
                    </div>
                    <p className="linkText" >{item.username}</p>
                </Link>
                {this.renderFlipsEarned(item)}
            </div>
        );
    },
    render: function () {
        return (
           <Layout className="friends-page">
                <form>
                   <FlipBoard data={this.props.data} renderFlip={this.renderFlip} header={HEADINGS.FRIENDS} transform={data => {
                       return data;
                   }}/>
                </form>
           </Layout>
        );
    }
});

export default Page;

