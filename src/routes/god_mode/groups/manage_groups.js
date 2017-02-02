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

export const PAGE_UNIQUE_IDENTIFIER = 'manage-groups';

const HEADINGS = {
    GROUP: 'Manage Groups',
    TITLE: 'Group Title',
    TYPE: 'Type',
    PARENT: 'Parent',
    DESC: 'Description',
    GROUP_ID: 'Group Id',
    EDIT: 'Edit Group',
    DELETE: 'Delete Group',
    CREATE: 'Create new group'
};

const BAD_DELETE = 'There was a problem deleting this Group';
const DELETE = 'delete';
const EDIT = 'edit';
const CONFIRM_DELETE = 'Are you sure you want to delete this group? This action cannot be undone.';
const GROUP_REMOVED = 'Group deleted.';
const NOT_APPLICABLE = 'N/A';
const COPY_PARENT = 'copy parent_id';
const COPY_GROUP = 'copy group_id';

var mapStateToProps;
var Page;

export class ManageGroups extends React.Component {
    constructor() {
        super();
        this.deleteAction = this.deleteAction.bind(this);
        this.copyToClipBoard = this.copyToClipBoard.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            rowCount: nextProps.rowCount,
            pageCount: nextProps.pageCount,
            currentPage: nextProps.currentPage
        });
    }

    deleteAction(groupId) {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({
                url: GLOBALS.API_URL + 'group/' + groupId,
                handleErrors: false
            }).then(
                Toast.success(GROUP_REMOVED)
            ).catch(err => {
                Toast.error(BAD_DELETE);
                Log.error('Group not deleted: ' + err.message, err);
            });
        }

        Actions.dispatch.START_RELOAD_PAGE(this.props.state);
    }

    copyToClipBoard(data) {
        var textField = document.createElement('textarea');
        textField.innerText = data;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }

    render() {
        var groupData;

        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        groupData = this.props.data;
        return (
            <Layout currentUser={this.props.currentUser}
                    navMenuId="navMenu"
            >
                <Panel header={HEADINGS.GROUP} className="standard">
                <br/>
                <Button className="purple standard right" href={"/sa/group/create"}>
                        {HEADINGS.CREATE}
                </Button>
                <br/><br/>
                <Paginator
                    endpointIdentifier={'group'}
                    rowCount={this.props.rowCount}
                    currentPage={this.props.currentPage}
                    pageCount={this.props.pageCount}
                    componentName={PAGE_UNIQUE_IDENTIFIER}
                    data={groupData}
                    pagePaginator={true}
                >
                    <Table className="admin">
                        <Column renderHeader={HEADINGS.TITLE}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/group/${row.group_id}`}>
                                        {`${row.title}`}
                                    </Link>
                                ); }
                            }
                        />
                        <Column dataKey="group_id" renderHeader={HEADINGS.GROUP_ID}
                            renderCell ={(data) => {
                                return (
                                    <a title="click to copy group id" onClick={() => {
                                        this.copyToClipBoard(data);
                                    } }
                                    >
                                        {COPY_GROUP}
                                    </a>
                                ); }
                            }
                        />
                        <Column dataKey="type" renderHeader={HEADINGS.TYPE}/>
                        <Column renderHeader={HEADINGS.PARENT}
                            renderCell={(data, row) => {
                                if (row.parent_id === null) return (NOT_APPLICABLE);
                                return (
                                    <a title="click to copy parent group id" onClick={() => {
                                        this.copyToClipBoard(row.parent_id);
                                    } }
                                    >
                                        {COPY_PARENT}
                                    </a>
                                ); }
                            }
                        />
                        <Column renderHeader={HEADINGS.EDIT}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/sa/group/${row.group_id}/edit`}>
                                        {EDIT}
                                    </Link>
                                ); }
                            }
                        />
                        <Column renderHeader={HEADINGS.DELETE}
                            renderCell={(data, row) => {
                                return (
                                    <a onClick={() => {
                                        var groupId = row.group_id;
                                        this.deleteAction(groupId);
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
    var rowCount = 100;
    var currentPage = 1;

    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
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

Page = connect(mapStateToProps)(ManageGroups);
export default Page;
