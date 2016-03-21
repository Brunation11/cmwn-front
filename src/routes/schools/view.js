import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import DeleteLink from 'components/delete_link';
import {Table, Column} from 'components/table';
import Util from 'components/util';
import History from 'components/history';
import GenerateDataSource from 'components/datasource';

const PAGE_UNIQUE_IDENTIFIER = 'district-view';

const ClassSource = GenerateDataSource('group::class', PAGE_UNIQUE_IDENTIFIER);
const UserSource = GenerateDataSource('user', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    TITLE: 'School Administrative Dashboard: ',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    DISTRICTS: 'Districts',
    SCHOOLS: 'Schools in District',
    CLASSES: 'Classes in District',
    USERS: 'Users in District'
};

const ADMIN_TEXT = 'Teacher Dashboard';

var Component = React.createClass({
    getInitialState: function () {
        return {
            school: [],
            districts: [],
            classes: [],
            users: [],
            scope: 7
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
            <p><a href={`/school/${this.props.data.group_id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    render: function () {
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout>
                <Panel header={HEADINGS.TITLE + this.props.data.title} className="standard">
                   <EditLink base="/school" id={this.state.group_id} scope={this.state.scope} />
                   <DeleteLink base="/school" id={this.state.group_id} scope={this.state.scope} />
                    <p>{`${HEADINGS.DISTRICTS}: `}{this.renderDistricts()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.props.data.description}`}</p>
                </Panel>
                <Panel header={HEADINGS.CLASSES} className="standard">
                    <a onClick={() => History.push('/classes')}>View All Your Classes</a>
                    <ClassSource>
                        <Table>
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id)}>{_.startCase(data)}</a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/view')}>Admin View</a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/edit')}>Edit</a>
                                )}
                            />
                        </Table>
                    </ClassSource>
                </Panel>
                <Panel header={HEADINGS.USERS} className="standard">
                    <a onClick={() => History.push('/users')}>View All Your Users</a>
                    <UserSource>
                        <Table>
                            <Column dataKey="first_name" renderHeader="Name"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id)}>{row.first_name + ' ' + row.last_name}</a>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/view')}>Admin View</a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/edit')}>Edit</a>
                                )}
                            />
                        </Table>
                    </UserSource>
                </Panel>
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
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

