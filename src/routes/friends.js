import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
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

const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const PROFILE = 'View Profile';
const REQUESTED = 'Accept Request';
const PENDING = 'Request Pending';

var Page = React.createClass({
    getInitialState: function () {
        return {};
    },
    addFriend: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.GET({url: GLOBALS.API_URL + 'friendrequest/' + item.uuid, handleErrors: false})
            .catch(this.friendErr);
        item.relationship = 'Pending';
        this.forceUpdate;
    },
    acceptRequest: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.GET({url: GLOBALS.API_URL + 'acceptfriendrequest/' + item.uuid, handleErrors: false})
            .catch(this.friendErr);
        item.relationship = 'accepted';
        this.forceUpdate;
    },
    friendErr: function () {
        Toast.error(FRIEND_PROBLEM);
    },
    transformFriend: function (type, item) {
        item.relationship = type;
        item.image = _.has(item, 'images.data.url') ? item.images.data.url : DefaultProfile;
        item.flips = item.flips == null ? Math.floor(Math.random() * 10) : item.flips;
        return item;
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.acceptRequest.bind(this, item)} className={ClassNames('blue standard', {hidden: item.relationship !== 'requested'})}>{REQUESTED}</Button>
                                <Button className={ClassNames('blue standard', {hidden: item.relationship !== 'pending'})}>{PENDING}</Button>
                                <Button className="purple standard">{PROFILE}</Button>
                            </div></div>
                        </span>
                        <img src={item.image}></img>
                    </div>
                    <p className="linkText" >{item.username}</p>
                </Link>
                <p className="userFlips">{item.flips} Flips Earned</p>
            </div>
        );
    },
    render: function () {
        return (
           <Layout className="friends-page">
                <form>
                    <Fetcher url={ GLOBALS.API_URL + 'friends'} transform={data => {
                        data = [].concat(
                            _.map(data.friendrequests, this.transformFriend.bind(this, 'requested')),
                            _.map(data.acceptedfriends, this.transformFriend.bind(this, 'accepted')),
                            _.map(data.pendingfriends, this.transformFriend.bind(this, 'pending'))
                        );
                        return data;
                    }}>
                       <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.FRIENDS} />
                    </Fetcher>
                </form>
           </Layout>
        );
    }
});

export default Page;

