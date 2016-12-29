import React from 'react';
import {Panel, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import Moment from 'moment';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
import {Table, Column} from 'components/table';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';

import DefaultProfile from 'media/icon_class_blue.png';

const TITLE = 'CLASSES';

const HEADINGS = {
    MANAGE: 'Classes'
};

var Component = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <a href={`/class/${item.group_id}`}>
                    <img src={DefaultProfile}></img><p>{`${item.title}`}</p>
                </a>
            </div>
        );
    },
    renderClassTable: function (data) {
        var cols = [
            <Column dataKey="title" renderHeader="Class Name" renderCell={(title, row) => {
                return (
                    <Link to={'/class/' + row.group_id + '/view'} className="class-url">{title}</Link>
                );
            }}></Column>,
            <Column dataKey="external_id" renderHeader="Class Id"></Column>,
            <Column dataKey="updated" renderHeader="Last Updated" renderCell={date => {
                return Moment(date).format('MM/DD/YYYY h:mm a');
            }}></Column>
        ];
        if (data.length && data[0].email != null) {
            cols.push(
                <Column dataKey="email" />
            );
        }
        return (
            <Paginator
                rowCount={this.props.rowCount}
                currentPage={this.props.currentPage}
                pageCount={this.props.pageCount}
                data={this.props.data}
                pagePaginator={true}
            >
                <Table className="admin">
                    {cols}
                </Table>
            </Paginator>
        );
    },
    renderImport: function () {
        if (!this.props.currentUser ||
            !this.props.currentUser._embedded ||
            !this.props.currentUser._embedded.groups ||
            !this.props.currentUser._embedded.groups.length ||
            this.props.currentUser._embedded.groups[0]._links.import == null
        ) {
            return null;
        }
        return (
           <Button className="standard purple" onClick={ () => {
               History.push('/schools/' + this.props.currentUser._embedded.groups[0].group_id + '/edit');
           }} >Import Spreadsheet</Button>
        );
    },
    renderAdminView: function () {
        return (
            <Panel header={HEADINGS.MANAGE} className="standard" >
                {this.renderClassTable(this.props.data)}
            </Panel>
        );
    },
    renderChildView: function () {
        return (
            <Paginator
                rowCount={this.props.rowCount}
                currentPage={this.props.currentPage}
                pageCount={this.props.pageCount}
                data={this.props.data}
                pagePaginator={true}
            >
                <FlipBoard header={TITLE} renderFlip={this.renderFlip} />
            </Paginator>
        );
    },
    render: function () {
        var view = (this.props.currentUser && this.props.currentUser.type === 'CHILD') ?
            this.renderChildView : this.renderAdminView;
        return (
            <Layout currentUser={this.props.currentUser} className="user-list">
                {view()}
            </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = [];
    var loading = true;
    var rowCount = 1;
    var currentPage = 1;
    var pageCount = 1;
    var currentUser = state.currentUser;
    if (state.page && state.page.data && state.page.data._embedded &&
        state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
        pageCount = state.page.data.page_count;
    }
    return {
        data,
        loading,
        rowCount,
        currentPage,
        pageCount,
        currentUser
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

