import React from 'react';
import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import Shortid from 'shortid';
import Authorization from 'components/authorization';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import EditLink from 'components/edit_link';
import Util from 'components/util';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/groups/profile.scss';

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students',
    CLASS: 'Class – '
};

var Page = React.createClass({
    getInitialState: function () {
        return {
            isStudent: true
        };
    },
    componentWillMount: function () {
        this.getGroup();
    },
    componentDidMount: function () {
        this.resolveRole();
    },
    componentWillReceiveProps: function () {
        this.resolveRole();
    },
    getGroup: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}groups/${this.props.params.id}?include=users.roles,images,users.flips,users.images`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.group = res.response.data;
            this.forceUpdate();
        });
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
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/student/${item.uuid.toString()}`}><img src={item.images.data.length ? item.images.data[0].url : DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                {this.renderFlipsEarned(item)}
            </div>
        );
    },
    renderClassInfo: function () {
        return (
           <Panel header={this.group.title} className="standard">
               <EditLink base="/group" uuid={this.group.uuid} canUpdate={this.group.can_update} />
               {this.group.description}
           </Panel>
        );
    },
    render: function () {
        if (this.group == null || this.state == null) {
            return null;
        }
        return (
           <Layout className="groupProfile">
               <FlipBoard renderFlip={this.renderFlip} header={
                 HEADINGS.CLASS + this.group.title
               } data={this.group.users.data} />
           </Layout>
        );
    }
});

export default Page;

