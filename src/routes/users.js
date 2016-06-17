import React from 'react';
import _ from 'lodash';
import {Panel, Tabs, Tab, Button} from 'react-bootstrap';
import {Link} from 'react-router';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import Store from 'components/store';
import {Table, Column} from 'components/table';
import FlipBoard from 'components/flipboard';
//import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';

import 'routes/users.scss';

import DefaultProfile from 'media/profile_tranparent.png';

const TITLE = 'My Friends and Network'; /** @TODO MPR, 12/3/15: May need to swap this based on user type */

const HEADINGS = {
    MANAGE: 'Manage Users'
};

var Component = React.createClass({
    getInitialState: function () {
        return {
            key: 1
        };
    },
    handleSelect: function (index) {
        this.setState({key: index});
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/users/${item.user_id}`}>
                    <img src={DefaultProfile}></img><p>{`${item.first_name} ${item.last_name}`}</p>
                </Link>
            </div>
        );
    },
    renderUserTable: function (data) {
        var cols = [
            <Column dataKey="user_id" renderHeader="Name" renderCell={(id, row) => {
                return (
                        <Link to={'/users/' + id}>{`${row.last_name}, ${row.first_name}`}</Link>
                        );
            }}></Column>,
            <Column dataKey="username"></Column>,
            <Column dataKey="gender"></Column>,
            <Column dataKey="birthdate"></Column>
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
        var children = _.filter(this.props.data, {type: 'CHILD'});
        var adults = _.filter(this.props.data, {type: 'ADULT'});
        var tabIndex = 1;
        var tabs = [];
        children = children || [];
        if (children && children.length) {
            tabs.push(
                <Tab eventKey={tabIndex} title={'Students'}>
                    {this.renderUserTable(children)}
                </Tab>
            );
            tabIndex++;
        }
        if (adults && adults.length) {
            tabs.push(
                <Tab className="admin" eventKey={tabIndex} title={'Adults'}>
                    {this.renderUserTable(adults)} </Tab>
            );
            tabIndex++;
        }
        return (
            <Panel header={HEADINGS.MANAGE} className="standard" >
                <div className="clear">
                    <span className="buttons-right">
                        {this.renderImport()}
                    </span>
                </div>
                <Tabs className="tabs standard" activeKey={this.state.key} onSelect={this.handleSelect} >
                    {tabs}
                </Tabs>
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

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.user) {
        loading = state.page.loading;
        data = state.page.data._embedded.user;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

