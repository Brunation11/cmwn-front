import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';

const TITLE = 'My Schools';
const HOME = 'Home';

var Organizations = React.createClass({
    organizations: [],
    componentWillMount: function () {
        this.getOrganizations();
    },
    getOrganizations: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations'});
        urlData.then(res => {
            this.organizations = res.response.data;
            this.forceUpdate();
        });
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
                <Paginator data={this.organizations}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a href={`/organization/${row.uuid}/profile`}>{_.startCase(data)}</a>
                            )}
                        />
                        <Column dataKey="description" />
                        <Column dataKey="created_at" renderHeader="Created" />
                        <Column dataKey="updated_at" renderHeader="Last Updated"
                            renderCell={data => (data == null ? 'never' : data)}
                        />
                    </Table>
                </Paginator>
            </Layout>
        );
    }
});

export default Organizations;

