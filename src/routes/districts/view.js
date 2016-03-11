import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import Toast from 'components/toast';
import QueryString from 'query-string';

const DISTRICT_CREATED = 'Disctrict created successfully';
const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    NAME: 'District Name',
    CODE: 'District Code',
    SYSTEM: 'School System ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created'
};
const BREADCRUMB = {
    HOME: 'Home',
    DISTRICTS: 'Districts'
};

var Component = React.createClass({
    componentDidMount: function () {
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(DISTRICT_CREATED);
        }
    },
    render: function () {
        if (this.props.data == null || this.props.data.scope > 6) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.props.data.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/districts">{BREADCRUMB.DISTRICTS}</Link>
                    <span>{this.props.data.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <EditLink base="/district" uuid={this.props.data.user_id} canUpdate={this.props.data.can_update} />
                    <br />
                    <p>{`${HEADINGS.NAME}: ${this.props.data.title}`}</p>
                    <br />
                    <p>{`${HEADINGS.CODE}: ${this.props.data.code}`}</p>
                    <br />
                    <p>{`${HEADINGS.SYSTEM}: ${this.props.data.system_id}`}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.props.data.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.props.data.created_at}`}</p>
                </Panel>
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

