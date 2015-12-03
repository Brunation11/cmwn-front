import React from 'react';
import {Link} from 'react-router';

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
                        <Table>
                            <Column dataKey="images" renderHeader="Profile" renderCell={(images, row) => {
                                var image = images.data.length ? images.data[0] : DefaultProfile;
                                return (
                                    <Link to={'/'/*@TODO MPR, 12/3/15: CORE-149*/}><img src={image} alt={`${row.first_name}'s profile`}></img></Link>
                                );
                            }} />
                            <Column dataKey="uuid" renderHeader="Name" renderCell={(id, row) => `${row.first_name} ${row.last_name}`} />
                            <Column dataKey="username" />
                        </Table>
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Users;

