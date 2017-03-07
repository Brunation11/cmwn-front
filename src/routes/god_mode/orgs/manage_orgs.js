import React from 'react';
import {Link} from 'react-router';
import {Button, Panel} from 'react-bootstrap';
import { connect } from 'react-redux';
import Layout from 'layouts/god_mode_two_col';
import {Table, Column} from 'components/table';
import _ from 'lodash';
import HttpManager from 'components/http_manager';
import Toast from 'components/toast';
import Log from 'components/log';
import Paginator from 'components/paginator';
import Actions from 'components/actions';

export const PAGE_UNIQUE_IDENTIFIER = 'manage-orgs';

const HEADINGS = {
    ORG: 'Manage Organizations',
    TITLE: 'Organization Title',
    TYPE: 'Type',
    DESC: 'Description',
    ORG_ID: 'Organization Id',
    EDIT: 'Edit',
    DELETE: 'Delete',
    CREATE: 'Create new Organization'
};

const BAD_DELETE = 'There was a problem deleting this Organization';
const DELETE = 'delete';
const EDIT = 'edit';
const CONFIRM_DELETE = 'Are you sure you want to delete this organization? This action cannot be undone.';
const ORG_REMOVED = 'Organization deleted.';
const COPY_ORG = 'copy org_id';

var mapStateToProps;
var Page;

export class ManageOrgs extends React.Component {
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

    deleteAction(orgId, url) {
        if (window.confirm(CONFIRM_DELETE)) { //eslint-disable-line no-alert
            HttpManager.DELETE({
                url,
                handleErrors: false
            }).then(
                Toast.success(ORG_REMOVED)
            ).catch(err => {
                Toast.error(BAD_DELETE);
                Log.error(BAD_DELETE + err.message, err);
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
        var orgData;

        if (this.props.data === null || _.isEmpty(this.props.data)) return null;

        orgData = this.props.data;
        return (
            <Layout currentUser={this.props.currentUser}
                    navMenuId="navMenu"
            >
                <Panel header={HEADINGS.ORG} className="standard">
                <br/>
                <Button className="purple standard right" href={"/sa/org/create"}>
                        {HEADINGS.CREATE}
                </Button>
                <br/><br/>
                <Paginator
                    endpointIdentifier={'org'}
                    rowCount={this.props.rowCount}
                    currentPage={this.props.currentPage}
                    pageCount={this.props.pageCount}
                    componentName={PAGE_UNIQUE_IDENTIFIER}
                    data={orgData}
                    pagePaginator={true}
                >
                    <Table className="admin">
                        <Column renderHeader={HEADINGS.TITLE}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/district/${row.org_id}`}>
                                        {row.title}
                                    </Link>
                                ); }
                            }
                        />
                        <Column dataKey="org_id" renderHeader={HEADINGS.ORG_ID}
                            renderCell ={(data) => {
                                return (
                                    <a title="click to copy org id" onClick={() => {
                                        this.copyToClipBoard(data);
                                    }}>
                                        {COPY_ORG}
                                    </a>
                                ); }
                            }
                        />
                        <Column dataKey="type" renderHeader={HEADINGS.TYPE}/>
                        <Column renderHeader={HEADINGS.EDIT}
                            renderCell={(data, row) => {
                                return (
                                    <Link to={`/sa/org/${row.org_id}/edit`}>
                                        {EDIT}
                                    </Link>
                                ); }
                            }
                        />
                        <Column renderHeader={HEADINGS.DELETE}
                            renderCell={(data, row) => {
                                return (
                                    <a onClick={() => {
                                        var orgId = row.org_id;
                                        this.deleteAction(orgId, row._links.self.href);
                                    }}>
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

    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.org) {
        loading = state.page.loading;
        data = state.page.data._embedded.org;
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

Page = connect(mapStateToProps)(ManageOrgs);
export default Page;
