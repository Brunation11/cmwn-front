import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';
import ClassNames from 'classnames';

import Fetcher from 'components/fetcher';
import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
import Layout from 'layouts/one_col';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/friends.scss';

const HEADINGS = {
    FRIENDS: 'My Friends'
};

const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';

var Page = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function () {
        this.getFriends();
    },
    getFriends: function () {
        var self = this;
        HttpManager.GET({url: GLOBALS.API_URL + 'friends/'})
            .then(res => {
                res.response.data = res.response.data || res.response;
                self.data = _.map(res.response.data.acceptedfriends, item => {
                    item.image = _.has(item, 'images.data.url') ? item.images.data.url : DefaultProfile;
                    item.flips = item.flips == null ? Math.floor(Math.random() * 10) : item.flips;
                    return item;
                });
                self.forceUpdate();
            });
    },
    addFriend: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.GET({url: GLOBALS.API_URL + 'friendrequest/' + item.uuid, handleErrors: false})
            .catch(this.friendErr);
        item.relationship = 'Pending';
        this.forceUpdate;
    },
    friendErr: function () {
        Toast.error(FRIEND_PROBLEM);
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid.toString()}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.addFriend.bind(this, item)} className={ClassNames('green standard', {hidden: item.relationship === 'Pending'})}> Add Friend</Button>
                                <Button className="purple standard">View Profile</Button>
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
        if (this.data == null) {
            return null;
        }
        return (
           <Layout className="friends-page">
                <form>
                    <Fetcher url={ GLOBALS.API_URL + 'friends'} transform={data => {
                        data = data.concat([
                            {image: DefaultProfile, username: 'user'}
                        ]);
                        return data;
                    }}>
                       <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.FRIENDS} />
                    </Fetcher>
                   <FlipBoard renderFlip={this.renderFlip} header="Fake Friends List" data={this.data} />
                </form>
           </Layout>
        );
    }
});

export default Page;

