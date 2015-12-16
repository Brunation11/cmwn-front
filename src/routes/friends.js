import React from 'react';
import {Link} from 'react-router';
import {Button} from 'react-bootstrap';
import ClassNames from 'classnames';

import Fetcher from 'components/fetcher';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Layout from 'layouts/one_col';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/friends.scss';

const HEADINGS = {
    FRIENDS: 'My Friends'
};

var Page = React.createClass({
    getInitialState: function () {
        this.data = [
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)},
            {image: DefaultProfile, username: 'user', uuid: 1, flips: Math.floor(Math.random() * 10)}
        ];
        return {};
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid.toString()}`}>
                    <div className="item">
                        <span className="overlay">
                            <div className="relwrap"><div className="abswrap">
                                <Button className={ClassNames('green standard', {displayed: item.relationship || true})}> Add Friend</Button>
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

