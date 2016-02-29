import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import History from 'components/history';
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

var View = React.createClass({
    componentWillMount: function () {
        this.district = {};
        this.getDistrict();
    },
    componentDidMount: function () {
        if (QueryString.parse(location.search).message === 'created') {
            Toast.success(DISTRICT_CREATED);
        }
    },
    getDistrict: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts/' + this.props.params.id});
        urlData.then(res => {
            this.district = res.response.data;
            if (!this.district.can_update) { //eslint-disable-line camel_case
                History.replace(`/district/${this.props.params.id}/profile`);
            }
            this.forceUpdate();
        });
    },
    render: function () {
        if (this.district == null || !this.district.can_update) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.district.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/districts">{BREADCRUMB.DISTRICTS}</Link>
                    <span>{this.district.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <EditLink base="/district" uuid={this.district.uuid} canUpdate={this.district.can_update} />
                    <br />
                    <p>{`${HEADINGS.NAME}: ${this.district.title}`}</p>
                    <br />
                    <p>{`${HEADINGS.CODE}: ${this.district.code}`}</p>
                    <br />
                    <p>{`${HEADINGS.SYSTEM}: ${this.district.system_id}`}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.district.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.district.created_at}`}</p>
                </Panel>
           </Layout>
        );
    }
});

export default View;

