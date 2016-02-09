import React from 'react';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
import Feed from 'components/feed';
import GLOBALS from 'components/globals';

import Layout from 'layouts/two_col';

import cmwnIcon from 'media/cmwn_icon.png';

const PAGETITLE = 'My News Feed';
var Page = React.createClass({
    render: function () {
        return (
           <Layout className="newsfeed">
                <Panel header={PAGETITLE} className="standard">
                    <Fetcher url={GLOBALS.API_URL + 'games'} transform={data => {
                        return _.map(data, item => {
                            return {
                                style: 'standard',
                                image: {
                                    url: GLOBALS.GAME_URL + item.uuid + '/thumb.jpg',
                                    href: '/profile?open=' + item.uuid
                                },
                                message: [
                                    {type: 'p', text: 'New Game!'},
                                    {type: 'h3', text: item.title},
                                    {type: 'p', text: item.description},
                                    {type: 'a', text: 'Play Now', attributes: {href: '/profile?open=' + item.uuid}},
                                ],
                                source: 'ChangeMyWorldNow',
                                sourceImage: cmwnIcon,
                                created_at: item.created_at //eslint-disable-line
                            };
                        });
                    }}>
                        <Feed>
                        </Feed>
                    </Fetcher>
                </Panel>
           </Layout>
        );
    }
});

export default Page;


