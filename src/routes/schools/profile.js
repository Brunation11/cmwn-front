import React from 'react';
import _ from 'lodash';
import QueryString from 'query-string';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import Shortid from 'shortid';

import Layout from 'layouts/two_col';

import FlipBoard from 'components/flipboard';
import GenerateDataSource from 'components/datasource';
import EditLink from 'components/edit_link';
import Toast from 'components/toast';
import Util from 'components/util';

import 'routes/users/profile.scss';
import FlipBgDefault from 'media/icon_class_blue.png';

const PAGE_UNIQUE_IDENTIFIER = 'classProfile';

const ClassSource = GenerateDataSource('group_class', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    ALL_CLASSES: 'All Classes',
    MY_CLASSES: 'My Classes',
    DISTRICTS: 'Member of Districts'
};

const ADMIN_TEXT = 'School Administrative Dashboard';

const ORG_CREATED = 'School created successfully';

var Component = React.createClass({
    getInitialState: function () {
        return {
            school: [],
            districts: [],
            classes: [],
            users: []
        };
    },
    componentDidMount: function () {
        this.setState(this.props.data);
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(ORG_CREATED);
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(nextProps.data);
    },
    renderDistricts: function () {
        var links;
        if (!this.props.data || !this.props.data._embedded || !this.props.data._embedded.organization || this.props.data._embedded.organization.district) {
            return null;
        }
        links = _.map(this.props.data._embedded.organization.district, district => {
            return (
                <Link to={`/districts/${district.org_id}`}>
                    {district.title}
                </Link>
            );
        });
        return (
            <p>
                {`${HEADINGS.DISTRICTS}: `}
                {links}
            </p>
        );
    },
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}><Link to={`/class/${item.group_id}/profile`}><img src={FlipBgDefault}></img><p>{item.title}</p></Link></div>
        );
    },
    renderAdminLink: function () {
        if (!Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <p><a href={`/school/${this.props.data.group_id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    renderImport: function () {
        if (this.state == null || this.state._links == null || this.state._links.import == null) {
            return null;
        }
        return (
            <EditLink className="green" base="/school" id={this.state.group_id} scope={this.state.scope} text="Import Spreadsheets"/>
        );
    },
    render: function () {
        if (this.props.data == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <Panel header={this.props.data.title} className="standard">
                   <p className="right" >
                       <EditLink className="purple" text="Edit School" base="/school" uuid={this.state.group_id} canUpdate={Util.decodePermissions(this.state.scope).update} />
                       {this.renderImport()}
                   </p>
                   {this.renderAdminLink()}
                   {this.renderDistricts()}
                   {this.props.data.description}
               </Panel>
               <ClassSource>
                   <FlipBoard renderFlip={this.renderFlip} header={HEADINGS.MY_CLASSES} />
               </ClassSource>
           </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data != null) {
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

