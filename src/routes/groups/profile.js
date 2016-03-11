import React from 'react';
import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import Shortid from 'shortid';
import Authorization from 'components/authorization';
import FlipBoard from 'components/flipboard';
import EditLink from 'components/edit_link';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/groups/profile.scss';

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students',
    CLASS: 'Class – '
};

const ADMIN_TEXT = 'Teacher Dashboard';

var Component = React.createClass({
    getInitialState: function () {
        return {
            isStudent: true
        };
    },
    componentDidMount: function () {
        this.setState(this.props.data);
        this.resolveRole();
    },
    componentWillReceiveProps: function () {
        this.setState(this.props.data);
        this.resolveRole();
    },
    resolveRole: function () {
        var newState = {};
        Authorization.userIsLoaded.then(() => {
            if (~Authorization.currentUser.roles.indexOf('Student')) {
                newState.isStudent = true;
            } else {
                newState.isStudent = false;
            }
            this.setState(newState);
        });
    },
    renderFlipsEarned: function (item) {
        if (item.roles && item.roles.data && !~item.roles.data.indexOf('Student')) {
            return null;
        }
        return (
            <p className="userFlips" key={Shortid.generate()}>0 Flips Earned</p>
        );
    },
    renderAdminLink: function () {
        if (!this.props.data.can_update) {
            return null;
        }
        return (
            <p><a href={`/group/${this.props.data.id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.id.toString()}`}><img src={item.images.data.length ? item.images.data[0].url : DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                {this.renderFlipsEarned(item)}
            </div>
        );
    },
    renderClassInfo: function () {
        if (this.props.data.id == null || this.props.data.scope > 6) {
            return null;
        }
        return (
           <Panel header={this.props.data.title} className="standard">
               <EditLink base="/group" uuid={this.props.data.id} canUpdate={this.props.data.scope < 7} />
               {this.renderAdminLink()}
           </Panel>
        );
    },
    render: function () {
        if (this.props.data == null || this.state == null) {
            return null;
        }
        return (
           <Layout className="groupProfile">
               {this.renderClassInfo()}
               <FlipBoard renderFlip={this.renderFlip} header={
                 HEADINGS.CLASS + this.props.data.title
               } data={this.props.data.users.data} />
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data) {
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

