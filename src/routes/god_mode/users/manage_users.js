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
import Paginator from 'components/paginator';
import Actions from 'components/actions';

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
        super();
        this.deleteAction = this.deleteAction.bind(this);
        this.state = {
            adultCount: '',
            childCount: '',
        };
        this.getCount('ADULT');
        this.getCount('CHILD');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            rowCount: nextProps.rowCount,
            pageCount: nextProps.pageCount,
            currentPage: nextProps.currentPage
        });
    }

    shouldComponentUpdate() {
        return (true);
    }

    deleteAction(userId) {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({
                url: GLOBALS.API_URL + 'user/' + userId,
                handleErrors: false
            }).then(
                Toast.success(USER_REMOVED)
            ).catch(err => {
                Toast.error(BAD_DELETE);
                Log.error('User not deleted: ' + err.message, err);
            });
        }

        Actions.dispatch.START_RELOAD_PAGE(this.props.state);
    }

    getCount(type) {
        HttpManager.GET({
            url: GLOBALS.API_URL + 'user?type=' + type
        }).then(res => {
            if (type === 'ADULT') {
                this.setState({adultCount: res.response.total_items});
            }

            if (type === 'CHILD') {
                this.setState({childCount: res.response.total_items});
            }
        });
    }

    render() {
        var userData;

        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        userData = this.props.data;
        return (
            <Layout currentUser={this.props.currentUser}
                    navMenuId="navMenu"
            >
                <Panel header={HEADINGS.HEADER} className="standard">
                    <div className="left">
                        <h3>
                        Adult count: {this.state.adultCount} <br/>
                        Child count: {this.state.childCount} <br/>
                        </h3>
                    </div>
                    <div className="right">
                    <Button className="purple standard right" href={"/sa/user/create"}>
                        {HEADINGS.CREATE}
                    </Button>
                    </div>
                    <br/>
                </Panel>
                <Panel header={HEADINGS.USERS} className="standard">
                <Paginator data={userData} >
                    <Table className="admin">
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
                                    <Link to={`/sa/user/${row.user_id}/edit`}>
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
                                        this.deleteAction(userId);
                                    } }
                                    >
                                        {DELETE}
                                    </a>
                                ); }
                            }
                        />
                    </Table>
                    </Paginator>
                </Panel>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser = {};

    var pageCount = 1;
    var rowCount = 25;
    var currentPage = 1;

    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.user) {
        loading = state.page.loading;
        data = state.page.data._embedded.user;
        pageCount = state.page.data.page_count;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
    }

    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }

    return {
        data,
        state,
        loading,
        currentUser,
        pageCount,
        rowCount,
        currentPage
    };
};

Page = connect(mapStateToProps)(ManageUsers);
export default Page;
