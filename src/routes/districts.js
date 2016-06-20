import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import {Table, Column} from 'components/table';
import Store from 'components/store';

import Layout from 'layouts/two_col';

const TITLE = 'My Districts';
const CREATE_TEXT = 'Create District';

var Component = React.createClass({
    renderCreateDistrict: function () {
        var state = Store.getState();
        if (state.currentUser.scope === -1) {
            return (
                <p><a href={'/districts/create'}>{CREATE_TEXT}</a></p>
            );
        }
        return null;
    },
    render: function () {
        return (
            <Layout className="district-list">
                <Panel header={TITLE} className="standard" >
                    <div >
                        {this.renderCreateDistrict()}
                    </div>
                    <Table data={this.props.data} className="admin">
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <Link to={'/districts/' + row.org_id} className="district-link">{_.startCase(data)}</Link>
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

