import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager';
import GLOBALS from 'components/globals';
import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';

const TITLE = 'Districts';
const HOME = 'Home';

var Districs = React.createClass({
    districs: [],
    componentWillMount: function () {
        this.getDistrics();
    },
    getDistrics: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts'});
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
                <Paginator data={this.districs} pageCount={1}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a href={`#/district/${row.id}`}>{_.startCase(data)}</a>
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

export default Districs;

