import React from 'react';
import _ from 'lodash';
import QueryString from 'query-string';

import {Link} from 'react-router';
//import _ from 'lodash';
import {Panel} from 'react-bootstrap';

import Layout from 'layouts/two_col';
import Shortid from 'shortid';
import FlipBoard from 'components/flipboard';
import FlipBgDefault from 'media/icon_class_blue.png';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';
import EditLink from 'components/edit_link';
import Util from 'components/util';
import Log from 'components/log';
import Toast from 'components/toast';

import 'routes/users/profile.scss';

const HEADINGS = {
    ALL_CLASSES: 'All Classes',
    MY_CLASSES: 'My Classes',
    DISTRICTS: 'Member of Districts'
};

const ADMIN_TEXT = 'School Dashboard';

const ORG_CREATED = 'School created successfully';

var Page = React.createClass({
    myClasses: [],
    organization: null,
    getInitialState: function () {
        return {
            organization: [],
            districts: [],
            groups: [],
            users: []
        };
    },
    componentDidMount: function () {
        this.getOrganization();
        this.getMyClasses();
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(ORG_CREATED);
        }
    },
    getMyClasses: function () {
        var fetchOrgs = HttpManager.GET({url: GLOBALS.API_URL + 'users/me?include=groups'});
        fetchOrgs.then(res => {
            this.myClasses = res.response.data.groups.data;
            this.forceUpdate();
        }).catch(err => {
            Log.info(err);
        });
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}organizations/${this.props.params.id}?include=groups,districts`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.districts = res.response.data.districts.data;
            this.organization = res.response.data;
            this.forceUpdate();
        });
    },
    renderDistricts: function () {
        var links = _.map(this.districts, district => {
            return (
                <Link to={`/districts/${district.id}`}>
                    {district.title}
                </Link>
            );
        });
        return links;
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}><Link to={`/group/${item.uuid}/profile`}><img src={FlipBgDefault}></img><p>{item.title}</p></Link></div>
        );
    },
    renderAdminLink: function () {
        if (!this.organization.can_update) {
            return null;
        }
        return (
            <p><a href={`/organization/${this.organization.uuid}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    render: function () {
        if (this.organization == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <Panel header={this.organization.title} className="standard">
                   <EditLink base="/organization" uuid={this.organization.uuid} canUpdate={this.organization.can_update} />
                   {this.renderAdminLink()}
                    <p>{`${HEADINGS.DISTRICTS}: `}{this.renderDistricts()}</p>
                   {this.organization.description}
               </Panel>
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.MY_CLASSES} data={this.myClasses} />
               <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.ALL_CLASSES} data={this.organization.groups.data} />
           </Layout>
        );
    }
});

export default Page;

