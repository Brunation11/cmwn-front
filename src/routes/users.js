import React from 'react';
import {Link} from 'react-router';

import FlipBoard from 'components/flipboard';

//import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Fetcher from 'components/fetcher';

import DefaultProfile from 'media/profile_tranparent.png';

const TITLE = 'My Friends and Network'; /** @TODO MPR, 12/3/15: May need to swap this based on user type */
const HOME = 'Home';

var Users = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip"><a href={item.url}><img src={DefaultProfile}></img><p>{`${item.first_name} ${item.last_name}`}</p></a></div>
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
                <Fetcher url={GLOBALS.API_URL + 'users?include=images'} test="test">
                    <Paginator pageCount={1}>
                        <FlipBoard renderFlip={this.renderFlip} />
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Users;

