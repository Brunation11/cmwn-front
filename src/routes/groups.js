import React from 'react';
import Shortid from 'shortid';

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
            <div className="flip" key={Shortid.generate()}>
                <a href={`/group/${item.uuid}`}>
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

