import React from 'react'; // eslint-disable-line no-unused-vars
import QueryString from 'query-string';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Shortid from 'shortid';
import UserTile from 'components/user_tile';
import Toast from 'components/toast';
import FlipBoard from 'components/flipboard';
import EditLink from 'components/edit_link';
import Util from 'components/util';
import GenerateDataSource from 'components/datasource';

import Layout from 'layouts/two_col';

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
            isStudent: true,
            title: ''
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
        if (
            this.props.currentUser &&
            this.props.currentUser.type &&
            this.props.currentUser.type.toLowerCase() !== 'child'
        ) {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
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
             <UserTile
                item={item}
                onFriendAdded={() => {
                    this.reloadList.call(this);
                }}
                onFriendRequested={() => {
                    this.reloadList.call(this);
                }}
                key={Shortid.generate()}
             />
        );
    }
    renderClassInfo() {
        if (
            this.state.group_id == null || (
                this.props.currentUser &&
                this.props.currentUser.type &&
                this.props.currentUser.type.toLowerCase() === 'child'
            )
        ) {
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
        if (this.props.data == null) {
            return null;
        }
        return (
           <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
               {this.renderClassInfo()}
               <USER_SOURCE>
                    <FlipBoard
                        renderFlip={this.renderFlip}
                        header={`${HEADINGS.CLASS} ${this.state.title}`}
                    />
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

