import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel, Button} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
import ClassNames from 'classnames';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

import DefaultProfile from 'media/profile_tranparent.png';

const NO_FRIENDS = <div>You are already friends with everyone in your group. <br /> Great Work! <br /> Let's Take Action!</div>;
const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const ADD_FRIEND = 'Add Friend';
const PROFILE = 'View Profile';

var Page = React.createClass({
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
    renderNoData: function () {
        return (
            <Panel header={HEADINGS.SUGGESTED} className="standard">
                <h2>{NO_FRIENDS}</h2>
                <p><a onClick={History.goBack}>Back</a></p>
            </Panel>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.addFriend.bind(this, item)} className={ClassNames('green standard', {hidden: item.relationship === 'Pending'})}>{ADD_FRIEND}</Button>
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
                    <Fetcher url={ GLOBALS.API_URL + 'suggestedfriends'} renderNoData={this.renderNoData} transform={data => {
                        data = _.map(data, item => {
                            item.image = _.has(item, 'images.data.url') ? item.images.data.url : DefaultProfile;
                            item.flips = item.flips == null ? Math.floor(Math.random() * 10) : item.flips;
                            return item;
                        });
                        return data;
                    }}>
                       <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.SUGGESTED} />
                    </Fetcher>
                </form>
           </Layout>
        );
    }
});

export default Page;

