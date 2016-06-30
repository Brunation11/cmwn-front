import React from 'react';
import _ from 'lodash';
import {Panel, Button} from 'react-bootstrap'; //eslint-disable-line no-unused-vars

import Fetcher from 'components/fetcher';
import Feed from 'components/feed';
import GLOBALS from 'components/globals';

import Layout from 'layouts/two_col';

import cmwnIcon from 'media/cmwn_icon.png';

import 'routes/newsfeed.scss';

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
                                    {type: 'p', text: 'New Game!', attributes: {'className': 'new-game'}},
                                    {type: 'h3', text: item.title},
                                    {type: 'p', text: item.description},
                                    {type: Button, text: 'Play Now', attributes: {'className':
                                        'standard purple', onClick: () => {
                                            window.location.href = '/profile?open=' + item.uuid;
                                        }
                                    }},
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


