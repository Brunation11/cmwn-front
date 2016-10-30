import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel, Button} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import EditLink from 'components/edit_link';
import GeneratorLink from 'components/generator_link';
import DeleteLink from 'components/delete_link';
import Text from 'components/nullable_text';
import Util from 'components/util';
import GenerateDataSource from 'components/datasource';

import 'routes/classes/view.scss';

const PAGE_UNIQUE_IDENTIFIER = 'classProfile';
const GROUP_USER_DATASOURCE_IDENTIFIER = 'group_users';

const USER_SOURCE = GenerateDataSource(GROUP_USER_DATASOURCE_IDENTIFIER, PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    TITLE: 'Class Administrative Dashboard: ',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    CLASSES: 'Member of: '
};

const BREADCRUMBS = 'Return to school profile';

var mapStateToProps;
var Page;

export class View extends React.Component{
    constructor() {
        super();
        this.state = {scope: 0};
    }
    componentDidMount() {
        this.setState(this.props.data);
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
    }
    renderSchools() {
        var links = _.map(this.props.data.schools, school => {
            return (
                <Link to={`school/${school.uuid}`}>
                    {school.title}
                </Link>
            );
        });
        if (!links.length) {
            return null;
        }
        return <span>{`${HEADINGS.CLASSES}: `}{links}</span>;
    }
    renderImport() {
        if (this.state == null || this.state._links == null || this.state._links.import == null) {
        //if (!state.currentUser || !state.currentUser._embedded ||
        //    !state.currentUser._embedded.groups || !state.currentUser._embedded.groups.length ||
        //    state.currentUser._embedded.groups[0]._links.import == null) {
        //if (!state.currentUser || !state.currentUser._embedded || !state.currentUser._embedded.groups ||
        //    !state.currentUser._embedded.groups.length) {
            return null;
        }
        return (
                <Button className="standard green" onClick={ () => {
                    History.push('/schools/' + this.props.currentUser._embedded.groups[0].group_id + '/edit');
                }} >Import Spreadsheet</Button>
                );
    }
    renderBreadcrumb() {
        if (!this.state || this.state.parent_id == null) {
            return null;
        }
        return <Link to={'/school/' + this.state.parent_id} id="return-to-school">{BREADCRUMBS}</Link>;
    }
    render() {
        var rowCount = 100;
        var currentPage = 1;
        var pageCount = 1;
        if (this.props.data.group_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        //pagination defaults
        if (this.props.components[`${GROUP_USER_DATASOURCE_IDENTIFIER}-${PAGE_UNIQUE_IDENTIFIER}`] != null) {
            rowCount =
                this.props.components[`${GROUP_USER_DATASOURCE_IDENTIFIER}-${PAGE_UNIQUE_IDENTIFIER}`]
                    .page_size;
            pageCount =
                this.props.components[`${GROUP_USER_DATASOURCE_IDENTIFIER}-${PAGE_UNIQUE_IDENTIFIER}`]
                    .page_count;
            currentPage =
                this.props.components[`${GROUP_USER_DATASOURCE_IDENTIFIER}-${PAGE_UNIQUE_IDENTIFIER}`]
                    .page;
        }
        return (
            <Layout currentUser={this.props.currentUser}>
                <Panel header={HEADINGS.TITLE + this.props.data.title} className="standard" id="panel-1">
                    <p className="right" id="editButton">
                        <EditLink className="purple" base="/class" id={this.state.group_id}
                            scope={this.state.scope} text="Edit this class" />
                        <GeneratorLink className="purple" base="/class" id={this.state.group_id}
                            scope={this.state.scope} />
                        {this.renderImport()}
                        <DeleteLink className="purple" base="/class" id={this.state.group_id}
                            scope={this.state.scope} text="Delete this class" />
                    </p>
                    {this.renderBreadcrumb()}
                    <p id="class-profile">
                        <Link to={`/class/${this.props.data.group_id}/profile`} id="return-to-class">
                            Return to class profile
                        </Link>
                    </p>
                    <br />
                    <Text label={`${HEADINGS.DESCRIPTION}: `} text={this.props.data.description}>
                        <p></p>
                    </Text>
                    <br />
                    <Text label={`${HEADINGS.CREATED}: `} text={this.props.data.created_at}>
                        <p></p>
                    </Text>
                </Panel>
                <Panel header="Students" className="standard" id="panel-2">
                    <div className="clear">
                        <span className="buttons-right">
                            {this.renderImport()}
                        </span>
                    </div>
                    <USER_SOURCE transform={users => {
                        return _.map(users, user => {
                            user = user.set('role', user.type === 'CHILD' ? 'Student' : 'Faculty');
                            return user;
                        });
                    }}>
                        <Paginator
                            endpointIdentifier={GROUP_USER_DATASOURCE_IDENTIFIER}
                            componentName={PAGE_UNIQUE_IDENTIFIER}
                            rowCount={rowCount}
                            pageCount={pageCount}
                            currentPage={currentPage}
                        >
                            <Table className="admin">
                                <Column dataKey="title"
                                    renderHeader="Name"
                                    renderCell={(data, row) => (
                                        <Link to={`/users/${row.user_id}`}>
                                            {`${row.first_name} ${row.last_name}`}
                                        </Link>
                                    )}
                                />
                                <Column dataKey="username" renderCell={(data) => {
                                    return data.replace(/([@-_])/g, '$1 ');
                                }} />
                                <Column dataKey="role" renderHeader="User Type" renderCell={(data) => {
                                    return data;
                                }} />
                                <Column dataKey="active" renderHeader="Active User" renderCell={ (data) => {
                                    return data !== false ? 'Active' : 'Inactive';
                                }} />
                                <Column dataKey="updated_at" renderHeader="Update Users"
                                    renderCell={(data, row) => {
                                        return (
                                            <Link to={`/users/${row.user_id}/edit`} className="edit-student">
                                                Edit
                                            </Link>
                                        );
                                    }}
                                />
                            </Table>
                        </Paginator>
                    </USER_SOURCE>
                </Panel>
           </Layout>

        );
    }
}

mapStateToProps = state => {
    var data = {title: ''};
    var currentUser = {};
    var loading = true;
    var components = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        if (state.currentUser != null){
            currentUser = state.currentUser;
        }
    }
    //TODO MPR, 8/19/16: pull specific components
    if (state.components != null) {
        components = state.components;
    }
    return {
        data,
        loading,
        currentUser,
        components
    };
};

Page = connect(mapStateToProps)(View);
export default Page;

