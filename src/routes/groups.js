import React from 'react';

//import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';
import Fetcher from 'components/fetcher';

import DefaultProfile from 'media/icon_class_blue.png';

const TITLE = 'MY CLASSES';

var Groups = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip">
                <a href={`/group/${item.uuid}`/** @TODO MPR, 12/7/15: very much need to switch on type, CORE-149*/}>
                    <img src={DefaultProfile}></img><p>{`${item.title}`}</p>
                </a>
            </div>
        );
    },
    render: function () {
        return (
            <Layout>
                <Fetcher url={GLOBALS.API_URL + 'groups'} test="test">
                    <Paginator data={this.groups} pageCount={1}>
                        <FlipBoard header={TITLE} renderFlip={this.renderFlip} />
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Groups;

