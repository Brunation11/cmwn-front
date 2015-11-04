import React from 'react';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created'
};
const BREADCRUMB = {
    HOME: 'Home',
    ORGANIZATIONS: 'Organizations'
};
const EDIT_LINK = 'Edit';


var View = React.createClass({
    organization: {},
    componentWillMount: function () {
        this.getOrganization();
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'organizations/' + this.props.params.id});
        urlData.then(res => {
            this.organization = res.response.data;
            this.forceUpdate();
        });
    },
    renderEditLink: function () {
        if (GLOBALS.CURRENT_USER.ID === window.parseInt(this.props.params.id)) {
            /** @TODO MPR, 10/4/15: Add check for user is admin*/
            return <Link to={`/organization/${this.props.params.id}/edit`} >({EDIT_LINK})</Link>;
        }
        return null;
    },
    render: function() {
        return (
            <Layout>
                <h2>{this.organization.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/organizations">{BREADCRUMB.ORGANIZATIONS}</Link>
                    <span>{this.organization.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <p>
                        {this.renderEditLink()}
                    </p>
                    <br />
                    <p>{`${HEADINGS.ID}: ${this.organization.id}`}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.organization.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.organization.created_at}`}</p>
                </Panel>
           </Layout>
        );
    }
});

export default View;

