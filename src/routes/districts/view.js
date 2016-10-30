import React from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';

import EditLink from 'components/edit_link';
import Toast from 'components/toast';
import QueryString from 'query-string';
import Util from 'components/util';
import History from 'components/history';
import GenerateDataSource from 'components/datasource';
import Text from 'components/nullable_text';
import {Table, Column} from 'components/table';

const DISTRICT_CREATED = 'Disctrict created successfully';
const HEADINGS = {
    TITLE: 'District Dashboard: ',
    ID: 'ID',
    NAME: 'District Name',
    CODE: 'District Code',
    SYSTEM: 'School System ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    SCHOOLS: 'Schools in District',
    CLASSES: 'Classes in District',
    USERS: 'Users in District'
};

const PAGE_UNIQUE_IDENTIFIER = 'district-view';

const SCHOOL_SOURCE = GenerateDataSource('group_school', PAGE_UNIQUE_IDENTIFIER);
const CLASS_SOURCE = GenerateDataSource('group_class', PAGE_UNIQUE_IDENTIFIER);
const USER_SOURCE = GenerateDataSource('org_users', PAGE_UNIQUE_IDENTIFIER);

var mapStateToProps;
var Page;

export class ViewDistrict extends React.Component{
    constructor(){
        super();
    }

    componentDidMount() {
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(DISTRICT_CREATED);
        }
    }
    render() {
        var code = this.props.data.meta == null ? null : this.props.data.meta.code;
        var systemId = this.props.data.meta == null ? null : this.props.data.meta.system_id;
        var showHelpers = this.props.currentUser.type === 'ADULT';
        if (this.props.data.org_id == null) {
            return null;
        }
        return (
            <Layout currentUser={this.props.currentUser}>
                <Panel id="panel-1" header={HEADINGS.TITLE + this.props.data.title} className="standard">
                    <p className="right" >
                        <EditLink className="purple" text="Edit District" base="/district"
                            uuid={this.props.data.org_id}
                            canUpdate={Util.decodePermissions(this.props.data.scope).update} />
                        <EditLink className="green" text="Create School" base="/district"
                            uuid={this.props.data.org_id}
                            canUpdate={Util.decodePermissions(this.props.data.scope).create} />
                    </p>
                    <br />
                    <Text label={`${HEADINGS.NAME}: `} text={this.props.data.title}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.CODE}: `} text={code}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.SYSTEM}: `} text={systemId}><p></p></Text>
                    <br />
                    <Text label={`${HEADINGS.DESCRIPTION}: `} text={this.props.data.description}>
                        <p></p>
                    </Text>
                </Panel>
                <Panel id="panel-2" header={HEADINGS.SCHOOLS} className=
                        {ClassNames('standard', {hidden: !showHelpers})}>
                    <a onClick={() => History.push('/schools')}>View All Your Schools</a>
                    <SCHOOL_SOURCE>
                        <Table className="admin">
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id)}>
                                        {_.startCase(data)}
                                    </a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id + '/view')}>
                                        Admin View
                                    </a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/school/' + row.group_id + '/edit')}>
                                        Edit
                                    </a>
                                )}
                            />
                        </Table>
                    </SCHOOL_SOURCE>
                </Panel>
                <Panel id="panel-3" header={HEADINGS.CLASSES} className=
                        {ClassNames('standard', {hidden: !showHelpers})}>
                    <a onClick={() => History.push('/classes')}>View All Your Classes</a>
                    <CLASS_SOURCE>
                        <Table className="admin">
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id)}>
                                        {_.startCase(data)}
                                    </a>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/view')}>
                                        Admin View
                                    </a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/class/' + row.group_id + '/edit')}>
                                        Edit
                                    </a>
                                )}
                            />
                        </Table>
                    </CLASS_SOURCE>
                </Panel>
                <Panel id="panel-4" header={HEADINGS.USERS} className=
                        {ClassNames('standard', {hidden: !showHelpers})}>
                    <a onClick={() => History.push('/users')}>View All Your Users</a>
                    <USER_SOURCE>
                        <Table className="admin">
                            <Column dataKey="first_name" renderHeader="Name"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id)}>
                                        {row.first_name + ' ' + row.last_name}
                                    </a>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/view')}>
                                        Admin View
                                    </a>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <a onClick={() => History.push('/user/' + row.user_id + '/edit')}>
                                        Edit
                                    </a>
                                )}
                            />
                        </Table>
                    </USER_SOURCE>
                </Panel>
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var currentUser = {}; // eslint-disable-line no-unused-vars
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(ViewDistrict);
export default Page;

