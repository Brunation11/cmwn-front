import React from 'react';
import {Panel, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import Moment from 'moment';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
import {Table, Column} from 'components/table';
import Layout from 'layouts/two_col';

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
            <Table data={data} className="admin">
                {cols}
            </Table>
        );
    },
    renderImport: function () { // TODO: do we actually need this on this page? 10/20/16 AIM
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
               History.push('/schools/' + state.currentUser._embedded.groups[0].group_id + '/edit');
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
            <FlipBoard data={this.props.data} header={TITLE} renderFlip={this.renderFlip} />
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
    var currentUser = state.currentUser;
    if (state.page && state.page.data && state.page.data._embedded &&
        state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    return {
        data,
        loading,
        currentUser
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

