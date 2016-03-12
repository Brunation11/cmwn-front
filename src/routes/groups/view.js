import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import EditLink from 'components/edit_link';
import Util from 'components/util';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    Organizations: 'Member of: '
};

var Component = React.createClass({
    getInitialState: function () {
        this.props.data = {};
        this.members = [];
        return {
        };
    },
    componentWillMount: function () {
        this.setState(this.props.data);
    },
    componentWillReceiveProps: function (newProps) {
        this.setState(newProps.data);
    },
    renderGroups: function () {
        var links = _.map(this.props.data.organizations, organization => {
            return (
                <Link to={`organization/${organization.uuid}`}>
                    {organization.title}
                </Link>
            );
        });
        if (!links.length) {
            return null;
        }
        return <span>{`${HEADINGS.GROUPS}: `}{links}</span>;
    },
    render: function () {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout>
                <Panel header={HEADINGS.TITLE + ': ' + this.props.data.title} className="standard">
                    <EditLink base="/group" uuid={this.props.data.group_id} canUpdate={this.props.data.scope < 6} />
                    <p>
                        <a href={`/group/${this.props.data.group_id}/profile`}>Return to group profile</a>
                    </p>
                    <br />
                    <p>{this.renderGroups()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.props.data.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.props.data.created_at}`}</p>
                </Panel>
                <Panel header="Students" className="standard">
                    <Paginator data={this.members}>
                        <Table>
                            <Column dataKey="title"
                                renderHeader="Name"
                                renderCell={(data, row) => (
                                    <a href={`/users/${row.id}`}>{`${row.first_name} ${row.last_name}`}</a>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="active" renderHeader="Active user" renderCell={ (data) => {
                                return data ? 'Active' : 'Inactive';
                            }} />
                            <Column dataKey="updated_at" renderHeader="Update Users"
                                renderCell={(data, row) => {
                                    return (
                                        <a href={`/users/${row.id}/edit`}>Edit</a>
                                    );
                                }}
                            />
                        </Table>
                    </Paginator>
                </Panel>
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

