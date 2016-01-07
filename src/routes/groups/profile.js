import React from 'react';
import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import Authorization from 'components/authorization';
import FlipBoard from 'components/flipboard';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import EditLink from 'components/edit_link';
import Util from 'components/util';

import DefaultProfile from 'media/profile_tranparent.png';

import 'routes/students/profile.scss';

const HEADINGS = {
    MY_CLASSMATES: 'My Classmates',
    MY_STUDENTS: 'My Students'
};

var Page = React.createClass({
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
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}groups/${this.props.params.id}?include=users`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.group = res.response.data;
            /** @TODO MPR, 12/21/15: Remove this line once CORE-146 and CORE-219 are done*/
            res.response.data.can_update = res.response.data.can_update || res.response.data.canupdate; //eslint-disable-line
            this.forceUpdate();
        });
    },
    resolveRole: function () {
        var newState = {};
        Authorization.userIsLoaded.then(() => {
            if (~Authorization.currentUser.roles.indexOf('Student')) {
                newState.isStudent = true;
            }
            this.setState(newState);
        });
    },
    renderFlip: function (item){
        return (
            <div className="flip">
                <Link to={`/student/${item.uuid.toString()}`}><img src={item.image || DefaultProfile}></img>
                    <p className="linkText" >{item.username}</p>
                </Link>
                <p className="userFlips">0 Flips Earned</p>
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
           <Layout className="profile">
               <FlipBoard renderFlip={this.renderFlip} header={
                 (this.state.isStudent ? HEADINGS.MY_CLASSMATES : HEADINGS.MY_STUDENTS) + ' - ' + this.group.title
               } data={this.group.users.data} />
           </Layout>
        );
    }
});

export default Page;

