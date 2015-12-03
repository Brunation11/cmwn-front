import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/one_col';

var Page = React.createClass({
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
                        <li><Link to={'/organization/28f58d8a-9926-11e5-8a85-acbc32a6b1bb/profile'}>School Profile</Link></li>
                        <li><Link to={'/group/2903aa3c-9926-11e5-97df-acbc32a6b1bb/profile'}>Class Profile</Link></li>
                        <li><Link to={'/profile/'}>Student Profile</Link></li>
                        <li><Link to={'/student/2944706c-9926-11e5-a358-acbc32a6b1bb'}>Student Profile (friend)</Link></li>
                        <li><Link to={'/profile/edit'}>Edit Student Profile</Link></li>
                   </ul>
               </Panel>
               <Panel header="Administrative Links" className="standard">
                   <ul>
                        <li><Link to={'/group/2903aa3c-9926-11e5-97df-acbc32a6b1bb/view'}>Class Admin Info</Link></li>
                        <li><Link to={'/group/2903aa3c-9926-11e5-97df-acbc32a6b1bb/edit'}>Edit Class</Link></li>
                        <li><Link to={'/organization/28f58d8a-9926-11e5-8a85-acbc32a6b1bb/view'}>School Admin Info</Link></li>
                        <li><Link to={'/organization/28f58d8a-9926-11e5-8a85-acbc32a6b1bb/edit'}>Edit School</Link></li>
                        <li><Link to={'/teacher/2944706c-9926-11e5-a358-acbc32a6b1bb/profile'}>Teacher Profile</Link></li>
                        <li><Link to={'/teacher/2944706c-9926-11e5-a358-acbc32a6b1bb/edit'}>Edit Teacher</Link></li>
                        <li><Link to={'/parent/2944706c-9926-11e5-a358-acbc32a6b1bb/profile'}>Parent Profile</Link></li>
                        <li><Link to={'/parent/2944706c-9926-11e5-a358-acbc32a6b1bb/edit'}>Edit Parent</Link></li>
                   </ul>
               </Panel>
           </Layout>
        );
    }
});

export default Page;

