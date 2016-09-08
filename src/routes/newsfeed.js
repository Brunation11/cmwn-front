import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import _ from 'lodash';

import GLOBALS from 'components/globals';
import Layout from 'layouts/one_col';

import 'routes/newsfeed.scss';

var mapStateToProps;
var Page;

const PAGE_UNIQUE_IDENTIFIER = 'feed';

const HEADER = 'My News Feed';

export class Feed extends React.Component {
    constructor() {
        super ();

        this.state({
            data: []
        });
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    render() {

    }

    // render: function () {
    //     return (
    //        <Layout className="newsfeed">
    //             <Panel header={PAGETITLE} className="standard">
    //                 <Fetcher url={GLOBALS.API_URL + 'games'} transform={data => {
    //                     return _.map(data, item => {
    //                         return {
    //                             style: 'standard',
    //                             image: {
    //                                 url: GLOBALS.GAME_URL + item.uuid + '/thumb.jpg',
    //                                 href: '/profile?open=' + item.uuid
    //                             },
    //                             message: [
    //                                 {type: 'p', text: 'New Game!', attributes: {'className': 'new-game'}},
    //                                 {type: 'h3', text: item.title},
    //                                 {type: 'p', text: item.description},
    //                                 {type: Button, text: 'Play Now', attributes: {'className':
    //                                     'standard purple', onClick: () => {
    //                                         window.location.href = '/profile?open=' + item.uuid;
    //                                     }
    //                                 }},
    //                             ],
    //                             source: 'ChangeMyWorldNow',
    //                             sourceImage: cmwnIcon,
    //                             created_at: item.created_at //eslint-disable-line
    //                         };
    //                     });
    //                 }}>
    //                     <Feed>
    //                     </Feed>
    //                 </Fetcher>
    //             </Panel>
    //        </Layout>
    //     );
    // }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Feed);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
