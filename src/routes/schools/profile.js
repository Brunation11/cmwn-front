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

export const PAGE_UNIQUE_IDENTIFIER = 'school-profile';

const CLASS_SOURCE = GenerateDataSource('group_class', PAGE_UNIQUE_IDENTIFIER);

const HEADINGS = {
    ALL_CLASSES: 'All Classes',
    MY_CLASSES: 'My Classes',
    DISTRICTS: 'Member of Districts'
};

const TEXT = {
    ADMIN: 'School Administrative Dashboard',
    NO_SCHOOLS: 'Sorry, none of your schools have profiles to display at this time.',
    IMPORT: 'Import Spreadsheets',
    EDIT: 'Edit School',
};

const SUCCESS = 'School created successfully';

var mapStateToProps;
var Page;

export class SchoolProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            school: [],
            districts: [],
            classes: [],
            users: []
        };
    }

    componentDidMount() {
        this.setState(this.props.data);
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(SUCCESS);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.data);
    }

    renderDistricts() {
        if (!this.props.data.organization) {
            return null;
        }
        return (
            <p className="school-district">
                {`${HEADINGS.DISTRICTS}: `}
                {this.props.data.organization.title}
            </p>
        );
    }

    renderFlip(item) {
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/class/${item.group_id}/profile`}>
                    <img src={FlipBgDefault}></img>
                    <p>{item.title}</p>
                </Link>
            </div>
        );
    }

    renderAdminLink() {
        if (!Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <p><a href={`/school/${this.props.data.group_id}/view`} className="school-admin-link">
                {TEXT.ADMIN}
            </a></p>
        );
    }

    renderImport() {
        if (this.state == null || this.state._links == null || this.state._links.import == null) {
            return null;
        }
        return (
            <EditLink className="green" base="/school" id={this.state.group_id} scope={this.state.scope}
                text={TEXT.IMPORT}/>
        );
    }

    render() {
        if (this.props.data == null) {
            return null;
        }
        return (
           <Layout className={PAGE_UNIQUE_IDENTIFIER}>
               <Panel header={this.props.data.title} className="standard">
                   <p className="right" >
                       <EditLink className="purple" text={TEXT.EDIT} uuid={this.state.group_id}
                           base="/school" canUpdate={Util.decodePermissions(this.state.scope).update} />
                       {this.renderImport()}
                   </p>
                   {this.renderAdminLink()}
                   {this.renderDistricts()}
                   {this.props.data.description}
               </Panel>
               <CLASS_SOURCE>
                   <FlipBoard renderFlip={this.renderFlip.bind(this)} header={HEADINGS.MY_CLASSES} />
               </CLASS_SOURCE>
           </Layout>
        );
    }
}

mapStateToProps = state => {
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

Page = connect(mapStateToProps)(SchoolProfile);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

