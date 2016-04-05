import React from 'react';
import QueryString from 'query-string';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import Shortid from 'shortid';
import Toast from 'components/toast';
import FlipBoard from 'components/flipboard';
import EditLink from 'components/edit_link';
import Util from 'components/util';
import GenerateDataSource from 'components/datasource';
import Store from 'components/store';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/classes/profile.scss';

const PAGE_UNIQUE_IDENTIFIER = 'classProfile';

const UserSource = GenerateDataSource('group_users', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students',
    CLASS: 'Class – '
};

const ADMIN_TEXT = 'Class Administrative Dashboard';

const CLASS_CREATED = 'Class created.';

var Component = React.createClass({
    getInitialState: function () {
        return {
            isStudent: true
        };
    },
    getDefaultProps: function () {
        return {
            data: {}
        };
    },
    componentDidMount: function () {
        this.setState(this.props.data);
        this.resolveRole();
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(CLASS_CREATED);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps.data);
        this.resolveRole();
    },
    resolveRole: function () {
        var newState = {};
        var state = Store.getState();
        if (state.currentUser && state.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    },
    renderFlipsEarned: function (item) {
        if (item && item.roles && item.roles.data && !~item.roles.data.indexOf('Student')) {
            return null;
        }
        return (
            <p className="userFlips" key={Shortid.generate()}>0 Flips Earned</p>
        );
    },
    renderAdminLink: function () {
        if (!Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <p><a href={`/class/${this.props.data.group_id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.user_id.toString()}`}>
                    <img src={item.images && item.images.data && item.images.data.length ? item.images.data[0].url : DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                {this.renderFlipsEarned(item)}
            </div>
        );
    },
    renderClassInfo: function () {
        if (this.state.group_id == null || !Util.decodePermissions(this.state.scope).update) {
            return null;
        }
        return (
           <Panel header={this.state.title} className="standard">
               <p className="right" >
                   <EditLink className="purple" text="Edit Class" base="/class" uuid={this.state.group_id} canUpdate={Util.decodePermissions(this.state.scope).update} />
               </p>
               {this.renderAdminLink()}
           </Panel>
        );
    },
    render: function () {
        if (this.props.data == null || this.state == null) {
            return null;
        }
        return (
           <Layout className="classProfile">
               {this.renderClassInfo()}
               <UserSource>
                   <FlipBoard renderFlip={this.renderFlip} header={
                     HEADINGS.CLASS + this.props.data.title
                   } />
               </UserSource>
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

