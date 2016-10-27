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
import Paragraph from 'components/conditional_paragraph';
import GenerateDataSource from 'components/datasource';

export const PAGE_UNIQUE_IDENTIFIER = 'school-view';

const CLASS_SOURCE = GenerateDataSource('group_class', PAGE_UNIQUE_IDENTIFIER);
const USER_SOURCE = GenerateDataSource('group_users', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    TITLE: 'School Administrative Dashboard: ',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    DISTRICTS: 'Districts',
    CLASSES: 'Classes in School',
    USERS: 'Users in School',
    ADMIN: 'Admin View',
    EDIT: 'Edit'
};

const TEXT = {
    ADMIN: 'Teacher Dashboard',
    IMPORT: 'Import Spreadsheets',
    EDIT: 'Edit this school',
    DELETE: 'Delete this school',
};

var mapStateToProps;
var Page;

export class SchoolView extends React.Component {
    constructor() {
        super();
        this.state = {
            school: [],
            districts: [],
            classes: [],
            users: [],
            scope: 7
        };
    }

    componentWillMount() {
        this.setState(this.props.data);
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps.data);
    }

    renderDistricts() {
        if (!this.state || !this.state.organization) {
            return null;
        }
        return (
            <Link to={`/districts/${this.state.organization.org_id}`}>
                {this.state.organization.title}
            </Link>
        );
    }

    renderImport() {
        if (this.state == null || this.state._links.import == null) {
            return null;
        }
        return (
            <EditLink className="green" base="/school" id={this.state.group_id} scope={this.state.scope}
                text={TEXT.IMPORT}/>
        );
    }

    render() {
        if (this.props.data == null || this.props.data.group_id == null ||
            !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
                <Panel header={HEADINGS.TITLE + this.props.data.title} className="standard">
                    <p className="right" id="buttons">
                        <EditLink className="purple" base="/school" id={this.state.group_id}
                            scope={this.state.scope} text={TEXT.EDIT}/>
                        {this.renderImport()}
                        <DeleteLink className="purple" base="/school" id={this.state.group_id}
                            scope={this.state.scope} text={TEXT.DELETE} />
                    </p>
                    <p>
                        <a href={`/school/${this.props.data.group_id}/profile`} id="school-return-profile">
                            Return to school profile
                        </a>
                    </p>
                   <Paragraph>
                       <p className="school-district" pre={`${HEADINGS.DISTRICTS}: `}>
                           {this.renderDistricts()}
                       </p>
                       <p pre={`${HEADINGS.DESCRIPTION}: `}>{this.props.data.description}</p>
                   </Paragraph>
                </Panel>
                <Panel header={HEADINGS.CLASSES} className="standard">
                    <Link to={'/classes'} id="school-view-classes">View All Your Classes</Link>
                    <CLASS_SOURCE>
                        <Table className="school-classes">
                            <Column dataKey="title"
                                renderCell={(data, row) => (
                                    <Link to={`/class/${row.group_id}`}>
                                        {_.startCase(data)}
                                    </Link>
                                )}
                            />
                            <Column dataKey="description" />
                            <Column dataKey="title" renderHeader={HEADINGS.ADMIN}
                                renderCell={(data, row) => (
                                    <Link to={`/class/${row.group_id}/view`}>
                                        {HEADINGS.ADMIN}
                                    </Link>
                                )}
                            />
                            <Column dataKey="title" renderHeader={HEADINGS.EDIT}
                                renderCell={(data, row) => (
                                    <Link to={`/class/${row.group_id}/edit`}>
                                        {HEADINGS.EDIT}
                                    </Link>
                                )}
                            />
                        </Table>
                    </CLASS_SOURCE>
                </Panel>
                <Panel header={HEADINGS.USERS} className="standard">
                    <Link to={'/users'} id="school-view-users">View All Your Users</Link>
                    <USER_SOURCE>
                        <Table className="school-users">
                            <Column dataKey="first_name" renderHeader="Name"
                                renderCell={(data, row) => (
                                    <Link to={`/user/${row.user_id}`}>
                                        {row.first_name + ' ' + row.last_name}
                                    </Link>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="title" renderHeader="Admin View"
                                renderCell={(data, row) => (
                                    <Link to={`/user/${row.user_id}/view`}>
                                        Admin View
                                    </Link>
                                )}
                            />
                            <Column dataKey="title" renderHeader="Edit"
                                renderCell={(data, row) => (
                                    <Link to={`/user/${row.user_id}/edit`}>
                                        Edit
                                    </Link>
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
    var loading = true;
    var currentUser;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        currentUser,
        loading
    };
};

Page = connect(mapStateToProps)(SchoolView);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

