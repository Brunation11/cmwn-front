import React from 'react';
import _ from 'lodash';
import QueryString from 'query-string';
import { connect } from 'react-redux';
import {Link} from 'react-router';
//import _ from 'lodash';
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

const PAGE_UNIQUE_IDENTIFIER = 'groupProfile';

const ClassSource = GenerateDataSource('group::class', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    ALL_CLASSES: 'All Classes',
    MY_CLASSES: 'My Classes',
    DISTRICTS: 'Member of Districts'
};

const ADMIN_TEXT = 'School Dashboard';

const ORG_CREATED = 'School created successfully';

var Component = React.createClass({
    getInitialState: function () {
        return {
            organization: [],
            districts: [],
            groups: [],
            users: []
        };
    },
    componentDidMount: function () {
        this.setState(this.props.data);
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(ORG_CREATED);
        }
    },
    componentWillReceiveProps: function () {
        this.setState(this.props.data);
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
            <div className="flip" key={Shortid.generate()}><Link to={`/group/${item.id}/profile`}><img src={FlipBgDefault}></img><p>{item.title}</p></Link></div>
        );
    },
    renderAdminLink: function () {
        if (!Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <p><a href={`/organization/${this.props.data.group_id}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    render: function () {
        if (this.props.data == null) {
            return null;
        }
        return (
           <Layout className="profile">
               <Panel header={this.props.data.title} className="standard">
                   <EditLink base="/organization" uuid={this.props.data.group_id} canUpdate={Util.decodePermissions(this.props.data.scope).update} />
                   {this.renderAdminLink()}
                    <p>{`${HEADINGS.DISTRICTS}: `}{this.renderDistricts()}</p>
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
    if (state.page && state.page.data) {
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

