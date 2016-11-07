import React from 'react';
import {Link} from 'react-router';
import {Button, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Layout from 'layouts/god_mode_two_col';
import {Table, Column} from 'components/table';
import _ from 'lodash';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import GLOBALS from 'components/globals';
import Log from 'components/log';

export const PAGE_UNIQUE_IDENTIFIER = 'manage-users';

const HEADINGS = {
    HEADER: 'Manage Users',
    USERNAME: 'Username',
    NAME: 'Name',
    TYPE: 'Type',
    EDIT: 'Edit User',
    DELETE: 'Delete User',
    CREATE: 'Create New User',
    USERS: 'All Users'
};

const BAD_DELETE = 'There was a problem deleting this user';
const DELETE = 'delete';
const EDIT = 'edit';
const CONFIRM_DELETE = 'Are you sure you want to delete this user? This action cannot be undone.';
const USER_REMOVED = 'User deleted.';

var mapStateToProps;
var Page;

export class ManageUsers extends React.Component {
    constructor() {
        debugger;
        super();
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
    }

    render() {
        debugger;
        var userData;

        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        userData = this.props.data;
        return (
            <Layout currentUser={this.props.currentUser}
                    className={PAGE_UNIQUE_IDENTIFIER}
                    navMenuId="navMenu"
            >
                <Panel header={HEADINGS.HEADER} className="standard">
                    <Button className="purple standard" href={"/sa/settings/user/create"}>
                        {HEADINGS.CREATE}
                    </Button>
                    <br/>
                </Panel>
                <Panel header={HEADINGS.USERS} className="standard">
                    <Table data={userData} className="admin">
                        <Column renderHeader={HEADINGS.NAME}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/user/${row.user_id}`}>
                                        {`${row.first_name} ${row.last_name}`}
                                    </Link>
                                ); }
                            }
                        />
                        <Column dataKey="username" renderHeader={HEADINGS.USERNAME}/>
                        <Column dataKey="type" renderHeader={HEADINGS.TYPE}/>
                        <Column renderHeader={HEADINGS.EDIT}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/sa/settings/user/${row.user_id}/edit`}>
                                        {EDIT}
                                    </Link>
                                ); }
                            }
                        />
                        <Column renderHeader={HEADINGS.DELETE}
                            renderCell={(data, row) => {
                                return (
                                    <a onClick={() => {
                                        var userId = row.user_id;
                                        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
                                            HttpManager.DELETE({
                                                url: GLOBALS.API_URL + 'user/' + userId,
                                                handleErrors: false
                                            }).then(
                                                Toast.success.bind(this, USER_REMOVED)
                                            ).catch(err => {
                                                Toast.error(BAD_DELETE);
                                                Log.error('User not deleted: ' + err.message, err);
                                            });
                                        } } }
                                    >
                                        {DELETE}
                                    </a>
                                ); }
                            }
                        />
                    </Table>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = {};
    debugger;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.user) {
        loading = state.page.loading;
        data = state.page.data._embedded.user;
    }

    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        data,
        loading,
        currentUser
    };
}

Page = connect(mapStateToProps)(ManageUsers);
export default Page;
