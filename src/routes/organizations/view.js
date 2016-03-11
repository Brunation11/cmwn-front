import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import GLOBALS from 'components/globals';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Util from 'components/util';
import History from 'components/history';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    DISTRICTS: 'Districts'
};

const ADMIN_TEXT = 'Teacher Dashboard';

var Component = React.createClass({
    getInitialState: function () {
        return {
            organization: [],
            districts: [],
            groups: [],
            users: []
        };
    },
    componentWillMount: function () {
        this.setState(this.props.data);
    },
    componentWillReceiveProps: function (newProps) {
        this.setState(newProps.data);
    },
    renderDistricts: function () {
        var links = _.map(this.state.districts, district => {
            return (
                <Link to={`/districts/${district.id}`}>
                    {district.title}
                </Link>
            );
        });
        return links;
    },
    renderAdminLink: function () {
        if (this.props.data.scope > 6) {
            return null;
        }
        return (
            <p><a href={`/organization/${this.props.data.id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    render: function () {
        if (this.props.data.id == null || this.props.data.scope > 6) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.props.data.title}</h2>
                <Panel header={HEADINGS.TITLE} className="standard">
                   <EditLink base="/organization" uuid={this.props.data.id} canUpdate={this.props.data.can_update} />
                    <p>{`${HEADINGS.DISTRICTS}: `}{this.renderDistricts()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.props.data.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.props.data.created_at}`}</p>
                </Panel>
                <Paginator data={this.state.groups}>
                    <Table>
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
                </Paginator>
                <Paginator data={this.state.users}>
                    <Table>
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
                </Paginator>

           </Layout>

        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

