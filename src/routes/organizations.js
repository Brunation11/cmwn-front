import React from 'react';
import Shortid from 'shortid';

import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';
import FlipBoard from 'components/flipboard';
import Fetcher from 'components/fetcher';

import DefaultProfile from 'media/icon_school_blue.png';

const TITLE = 'MY SCHOOLS';

var Organizations = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}><a href={`/organization/${item.uuid}`}><img src={DefaultProfile}></img><p>{`${item.title}`}</p></a></div>
        );
    },
    render: function () {
        return (
            <Layout>
                <Fetcher url={GLOBALS.API_URL + 'organizations?include=images'} test="test">
                    <Paginator pageCount={1}>
                        <FlipBoard header={TITLE} renderFlip={this.renderFlip} />
                    </Paginator>
                </Fetcher>
            </Layout>
        );
    }
});

export default Organizations;

