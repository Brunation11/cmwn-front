import React from 'react';
import {Link} from 'react-router';

//import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';
import Fetcher from 'components/fetcher';

import DefaultProfile from 'media/profile_tranparent.png';

const TITLE = 'My Classes';
const HOME = 'Home';

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
                <header>
                    <h2>{TITLE}</h2>
                    <div className="breadcrumb">
                        <Link to="/">{HOME}</Link>
                        {TITLE}
                    </div>
                </header>
                <Fetcher url={GLOBALS.API_URL + 'groups'} test="test">
                    <Paginator data={this.groups} pageCount={1}>
                        <FlipBoard renderFlip={this.renderFlip} />
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Groups;

