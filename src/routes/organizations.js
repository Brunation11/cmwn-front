import React from 'react';
import {Link} from 'react-router';

import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';
import FlipBoard from 'components/flipboard';
import Fetcher from 'components/fetcher';

import DefaultProfile from 'media/profile_tranparent.png';

const TITLE = 'My Schools';
const HOME = 'Home';

var Organizations = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip"><a href={`/organization/${item.uuid}`}><img src={DefaultProfile}></img><p>{`${item.title}`}</p></a></div>
        );
    },
    render: function () {
        return (
            <Layout>
                <header>
                    <h2>{TITLE}</h2>
                    <div className="breadcrumb">
                        <Link to="/">{HOME}</Link>
                        {TITLE}
                    </div>
                </header>
                <Fetcher url={GLOBALS.API_URL + 'organizations?include=images'} test="test">
                    <Paginator pageCount={1}>
                        <FlipBoard renderFlip={this.renderFlip} />
                    </Paginator>
                </Fetcher>
            </Layout>
        );
    }
});

export default Organizations;

