import React from 'react';
import _ from 'lodash';
import {Button, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import History from 'components/history';

const TITLE = 'Districts';
const CREATE_TEXT = 'Create District';

var Component = React.createClass({
    renderCreateDistrict: function () {
        /** @TODO MPR, 3/8/16: Actually check superuser */
        return (
            <p><a href={'/districts/create'}>{CREATE_TEXT}</a></p>
        );
    },
    render: function () {
        return (
            <Layout className="district-list">
                <Panel header="My Districts" className="standard" >
                    <Table data={this.props.data} className="admin">
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a onClick={() => History.push('/districts/' + row.org_id)}>{_.startCase(data)}</a>
                            )}
                        />
                        <Column dataKey="description" />
                        <Column dataKey="created_at" renderHeader="Created" />
                        <Column dataKey="updated_at" renderHeader="Last Updated"
                            renderCell={data => (data == null ? 'never' : data)}
                        />
                    </Table>
                </Panel>
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.org) {
        loading = state.page.loading;
        data = state.page.data._embedded.org;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

