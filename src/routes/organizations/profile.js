import React from 'react';
import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';
import FlipBgDefault from 'media/flip-placeholder-white.png';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import Util from 'components/util';

import 'routes/students/profile.scss';

const HEADINGS = {
    ALL_CLASSES: 'All Classes',
    MY_CLASSES: 'My Classes'
};

var Page = React.createClass({
    myClasses: [],
    organization: null,
    componentWillMount: function () {
        this.getOrganization();
        this.getMyClasses();
        this.forceUpdate();
    },
    getMyClasses: function () {
        var fetchOrgs = HttpManager.GET({url: GLOBALS.API_URL + 'users/me?include=groups'});
        fetchOrgs.then(res => {
            this.myClasses = res.response.data.groups.data;
            this.forceUpdate();
        }).catch(err => {
            console.info(err); //eslint-disable-line no-console
        });
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}organizations/${this.props.params.id}?include=groups`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.organization = res.response.data;
        });
    },
    renderFlip: function (item){
        return (
            <div className="flip"><Link to={`/group/${item.uuid}/profile`}><img src={FlipBgDefault}></img><p>{item.title}</p></Link></div>
        );
    },
    render: function () {
        if (this.organization == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <Panel header={this.organization.title} className="standard">
                   {this.organization.description}
               </Panel>
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.MY_CLASSES} data={this.myClasses} />
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.ALL_CLASSES} data={this.organization.groups.data} />
           </Layout>
        );
    }
});

export default Page;

