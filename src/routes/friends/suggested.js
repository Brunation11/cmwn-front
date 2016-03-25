import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import { connect } from 'react-redux';
import {Panel, Button} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Toast from 'components/toast';
import ClassNames from 'classnames';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Actions from 'components/actions';

import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

import DefaultProfile from 'media/profile_tranparent.png';

const PAGE_UNIQUE_IDENTIFIER = 'suggested-friends';

const NO_FRIENDS = <div>You are already friends with everyone in your group. <br /> Great Work! <br /> Let's Take Action!</div>;
const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};
const FRIEND_PROBLEM = 'There was a problem adding your friend. Please try again in a little while.';
const ADD_FRIEND = 'Add Friend';
const REQUESTED = 'Request Sent';
const ACCEPT = 'Accept';
const PROFILE = 'View Profile';

var Component = React.createClass({
    componentDidMount: function () {
        if (this.props.loading === false && this.props.data) {
            this.setState(this.props.data);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        if (nextProps.loading === false && nextProps.data.user_id !== this.props.data.user_id) {
            this.setState(nextProps.data);
        }
    },
    addFriend: function (item, e) {
        e.stopPropagation();
        e.preventDefault();
        HttpManager.POST({url: this.state._links.friend}, {
            'user_id': item.uuid
        }).then(() => {
            this.refs.datasource.getData().then(this.forceUpdate);
        }).catch(this.friendErr);
    },
    friendErr: function () {
        Toast.error(FRIEND_PROBLEM);
    },
    renderNoData: function (data) {
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
    },
    renderFlipsEarned: function (item) {
        if (item.roles && item.roles.data && !~item.roles.data.indexOf('Student')) {
            return null;
        }
        return (
            <p className="userFlips">{item.flips.data.length} Flips Earned</p>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button onClick={this.addFriend.bind(this, item)} className={ClassNames('green standard', {hidden: item.relationship === 'Pending' || item.relationship === 'requested'})}>{ADD_FRIEND}</Button>
                                <Button
                                    onClick={this.addFriend.bind(this, item)}
                                    className={ClassNames('blue standard', {hidden: item.relationship !== 'Pending'})}
                                >{ACCEPT}</Button>
                                <Button className={ClassNames('blue standard', {hidden: item.relationship !== 'requested'})}>{REQUESTED}</Button>
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
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <form>
                    <Fetcher ref="datasource" url={ GLOBALS.API_URL + 'suggestedfriends?include=roles,flips,images'} renderNoData={this.renderNoData} transform={data => {
                        data = _.map(data, item => {
                            item.image = _.has(item, 'images.data[0].url') ? item.images.data[0].url : DefaultProfile;
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

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

