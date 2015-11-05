import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column}  from 'components/table';

const TITLE = 'Organizations';
const HOME = 'Home';

var Districs = React.createClass({
    districs: [],
    componentWillMount: function () {
        this.getDistrics();
    },
    getDistrics: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations'});
        urlData.then(res => {
            this.districs = res.response.data;
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
                <Table data={this.districs}>
                    <Column dataKey="title"
                        renderCell={(data, row) => (
                            <a href={`#/organization/${row.id}`}>{_.startCase(data)}</a>
                        )}
                    />
                    <Column dataKey="description" />
                    <Column dataKey="created_at" renderHeader="Created" />
                    <Column dataKey="updated_at" renderHeader="Last Updated"
                        renderCell={data => (data == null ? 'never' : data)}
                    />
                </Table>
            </Layout>
        );
    }
});

export default Districs;

