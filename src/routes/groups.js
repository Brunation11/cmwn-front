import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

//import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Fetcher from 'components/fetcher';

const TITLE = 'My Classes';
const HOME = 'Home';

var Groups = React.createClass({
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
                        <Table>
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a href={`/group/${row.uuid}`}>{_.startCase(data)}</a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="created_at" renderHeader="Created" />
                            <Column dataKey="updated_at" renderHeader="Last Updated"
                                renderCell={data => (data == null ? 'never' : data)}
                            />
                        </Table>
                    </Paginator>
               </Fetcher>
            </Layout>
        );
    }
});

export default Groups;

