import React from 'react'; // eslint-disable-line no-unused-vars
import _ from 'lodash';
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

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/classes/profile.scss';

const PAGE_UNIQUE_IDENTIFIER = 'class-profile';

const USER_SOURCE = GenerateDataSource('group_users', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students',
    CLASS: 'Class - '
};

const ADMIN_TEXT = 'Class Administrative Dashboard';

const CLASS_CREATED = 'Class created.';

var mapStateToProps;
var Page;

export class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            isStudent: true
        };
    }
    componentDidMount() {
        this.setState(this.props.data);
        this.resolveRole(this.props);
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(CLASS_CREATED);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
        this.resolveRole(nextProps);
    }
    resolveRole() {
        var newState = {};
        if (this.props.currentUser && this.props.currentUser.type !== 'CHILD') {
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
        var image;
        if (!_.has(item, '_embedded.image')) {
            image = DefaultProfile;
        } else {
            if (item._embedded.image.url != null) {
                image = item._embedded.image.url;
            } else {
                image = item.images.data[0].url;
            }
        }
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.user_id.toString()}`} id={item.username}>
                    <img src={image}></img>
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
                   <EditLink id="edit-button" className="purple" text="Edit Class" base="/class"
                    uuid={this.state.group_id} canUpdate=
                        {Util.decodePermissions(this.state.scope).update} />
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
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
               {this.renderClassInfo()}
               <USER_SOURCE>
                   <FlipBoard renderFlip={this.renderFlip} header={
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

mapStateToProps = state => {
    var data = {};
    var currentUser = {}; // eslint-disable-line no-unused-vars
    var loading = true;
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        if (state.currentUser != null){
            currentUser = state.currentUser;
        }

    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Profile);
export default Page;

