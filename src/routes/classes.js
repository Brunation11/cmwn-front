import React from 'react';
import {Panel, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import Moment from 'moment';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
import {Table, Column} from 'components/table';
import Layout from 'layouts/two_col';
import Store from 'components/store';

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
    renderImport: function () {
        var state = Store.getState();
        if (!state.currentUser || !state.currentUser._embedded || !state.currentUser._embedded.groups || !state.currentUser._embedded.groups.length || state.currentUser._embedded.groups[0]._links.import == null) {
        //if (!state.currentUser || !state.currentUser._embedded || !state.currentUser._embedded.groups || !state.currentUser._embedded.groups.length) {
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
                <div className="clear">
                    <span className="buttons-right">
                        {this.renderImport()}
                    </span>
                </div>
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
        var view;
        var state = Store.getState();
        if (state.currentUser.type === 'CHILD') {
            view = this.renderChildView;
        } else {
            view = this.renderAdminView;
        }
        return (
            <Layout className="user-list">
                {view()}
            </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

