import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/one_col';
import Authorization from 'components/authorization';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

var Page = React.createClass({
    getInitialState: function () {
        return {
            orgUuid: '28f58d8a-9926-11e5-8a85-acbc32a6b1bb',
            groupUuid: '2903aa3c-9926-11e5-97df-acbc32a6b1bb'
        };
    },
    componentDidMount: function () {
        var getOrgData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations'});
        getOrgData.then(res => {
            this.setState({
                orgUuid: res.response.data[0].uuid
            });
        });
        var getGroupData = HttpManager.GET({url: GLOBALS.API_URL + 'groups'});
        getGroupData.then(res => {
            this.setState({
                groupUuid: res.response.data[0].uuid
            });
        });
    },
    render: function () {
        return (
           <Layout>
               <h1>Sitemap</h1>
               <p>Temporary page listing page for testing purposes. Every page on the site should be listed below. If one is not, it probably does not exist yet and needs to be created.</p>
               <Panel header="Student Links" className="standard">
                   <ul>
                        <li><Link to={'/'}>Home</Link></li>
                        <li><Link to={'/login'}>Login</Link></li>
                        <li><Link to={'/users'}>My Friends and Network</Link></li>
                        <li><Link to={'/organizations'}>My Schools</Link></li>
                        <li><Link to={'/groups'}>My Classes</Link></li>
                        <li><Link to={'/organization/' + this.state.orgUuid + '/profile'}>School Profile </Link>(note that direct links may break if the database is refreshed. This is expected. Use listing pages to navigate to a valid profile in this case.)</li>
                        <li><Link to={'/group/' + this.state.groupUuid + '/profile'}>Class Profile</Link></li>
                        <li><Link to={'/profile/'}>Student Profile</Link></li>
                        <li><Link to={'/student/' + Authorization.currentUser.uuid}>Student Profile (friend)</Link></li>
                        <li><Link to={'/profile/edit'}>Edit Student Profile</Link></li>
                   </ul>
               </Panel>
               <Panel header="Administrative Links" className="standard">
                   <ul>
                        <li><Link to={'/group/' + this.state.groupUuid + '/view'}>Class Admin Info</Link></li>
                        <li><Link to={'/group/' + this.state.groupUuid + '/edit'}>Edit Class</Link></li>
                        <li><Link to={'/organization/' + this.state.orgUuid + '/view'}>School Admin Info</Link></li>
                        <li><Link to={'/organization/' + this.state.orgUuid + '/edit'}>Edit School</Link></li>
                        <li><Link to={'/teacher/' + Authorization.currentUser.uuid + '/profile'}>Teacher Profile</Link></li>
                        <li><Link to={'/teacher/' + Authorization.currentUser.uuid + '/edit'}>Edit Teacher</Link></li>
                        <li><Link to={'/parent/' + Authorization.currentUser.uuid + '/profile'}>Parent Profile</Link></li>
                        <li><Link to={'/parent/' + Authorization.currentUser.uuid + '/edit'}>Edit Parent</Link></li>
                   </ul>
               </Panel>
           </Layout>
        );
    }
});

export default Page;

