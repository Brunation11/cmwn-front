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

const USER_SOURCE = GenerateDataSource('group_users', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students',
    CLASS: 'Class - '
};

const ADMIN_TEXT = 'Class Administrative Dashboard';

const CLASS_CREATED = 'Class created.';

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isStudent: true
        };
    }
    componentDidMount() {
        this.setState(this.props.data);
        this.resolveRole();
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(CLASS_CREATED);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
        this.resolveRole();
    }
    resolveRole() {
        var newState = {};
        if (state.currentUser && state.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    }
    renderFlipsEarned(item) {
        if (item && item.roles && item.roles.data && !~item.roles.data.indexOf('Student')) {
            return null;
        }
        return (
            <p className="user-flips" key={Shortid.generate()}>0 Flips Earned</p>
        );
    }
    renderAdminLink() {
        if (!Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <p><a id="class-dashboard-link" href={`/class/${this.props.data.group_id}/view`}>
                {ADMIN_TEXT}
            </a></p>
        );
    }
    renderFlip(item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.user_id.toString()}`} id={item.username}>
                    <img src={item.images && item.images.data &&
                        item.images.data.length ? item.images.data[0].url : DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                {this.renderFlipsEarned(item)}
            </div>
        );
    }
    renderClassInfo() {
        if (this.state.group_id == null || !Util.decodePermissions(this.state.scope).update) {
            return null;
        }
        return (
           <Panel header={this.state.title} className="standard">
               <p className="right" >
                   <EditLink id="edit-button" className="purple" text="Edit Class" base="/class" uuid={this.state.group_id} canUpdate={Util.decodePermissions(this.state.scope).update} />
               </p>
               {this.renderAdminLink()}
           </Panel>
        );
    }
    render() {
        if (this.props.data == null || this.state == null) {
            return null;
        }
        return (
            <Layout className="classProfile">
                {this.renderClassInfo()}
                <USER_SOURCE>
                    <FlipBoard renderFlip={this.renderFlip.bind(this)} header={
                        HEADINGS.CLASS + this.props.data.title
                    } />
                </USER_SOURCE>
            </Layout>
        );
    }
}

Profile.defaultProps = {
    data: {}
};

var mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        if(state.currentUser != null)
            currentUser = state.currentUser;

    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Profile);
export default Page;

