import React from 'react';
import {Panel} from 'react-bootstrap';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import Toast from 'components/toast';
import QueryString from 'query-string';
import Util from 'components/util';

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

var Component = React.createClass({
    componentDidMount: function () {
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(DISTRICT_CREATED);
        }
    },
    render: function () {
        var code = this.props.data.meta == null ? '' : this.props.data.meta.code;
        var systemId = this.props.data.meta == null ? '' : this.props.data.meta.system_id;
        if (this.props.data.org_id == null || !Util.decodePermissions(this.props.data.scope).update) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.props.data.title}</h2>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <EditLink base="/district" uuid={this.props.data.org_id} canUpdate={Util.decodePermissions(this.props.data.scope).update} />
                    <br />
                    <p>{`${HEADINGS.NAME}: ${this.props.data.title}`}</p>
                    <br />
                    <p>{`${HEADINGS.CODE}: ${code}`}</p>
                    <br />
                    <p>{`${HEADINGS.SYSTEM}: ${systemId}`}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.props.data.description}`}</p>
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

