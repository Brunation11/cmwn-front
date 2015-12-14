import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Util from 'components/util';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    DISTRICTS: 'Districts'
};
const BREADCRUMB = {
    HOME: 'Home',
    ORGANIZATIONS: 'Organizations'
};
const EDIT_LINK = 'Edit';


var View = React.createClass({
    getInitialState: function () {
        return {
            organization: [],
            districts: [],
            groups: [],
            users: []
        };
    },
    componentWillMount: function () {
        this.getOrganization();
    },
    getOrganization: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}organizations/${this.props.params.id}?include=districts,users,groups`});
        urlData.then(res => {
            Util.normalize(res.response, 'users', []);
            this.setState({
                organization: res.response.data,
                districts: Util.normalize(res.response, 'districts', []),
                groups: Util.normalize(res.response, 'groups', []),
                users: Util.normalize(res.response, 'users', [])
            });
        });
    },
    renderEditLink: function () {
        if (true) { //eslint-disable-line no-constant-condition
            /** @TODO MPR, 10/4/15: Add check for user is admin*/
            return <Link to={`/organization/${this.props.params.id}/edit`} >({EDIT_LINK})</Link>;
        }
        return null;
    },
    renderDistricts: function () {
        var links = _.map(this.state.districts, district => {
            return (
                <Link to={`/districts/${district.id}`}>
                    {district.title}
                </Link>
            );
        });
        return links;
    },
    render: function () {
        return (
            <Layout>
                <h2>{this.state.organization.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/organization">{BREADCRUMB.ORGANIZATIONS}</Link>
                    <span>{this.state.organization.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <p>
                        {this.renderEditLink()}
                    </p>
                    <br />
                    <p>{`${HEADINGS.ID}: ${this.state.organization.uuid}`}</p>
                    <br />
                    <p>{`${HEADINGS.DISTRICTS}: `}{this.renderDistricts()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.state.organization.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.state.organization.created_at}`}</p>
                </Panel>
                <Paginator data={this.state.groups}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a href={`#/organization/${row.id}`}>{_.startCase(data)}</a>
                            )}
                        />
                        <Column dataKey="description" />
                        <Column dataKey="created_at" renderHeader="Created" />
                        <Column dataKey="updated_at" renderHeader="Last Updated"
                            renderCell={data => (data == null ? 'never' : data)}
                        />
                    </Table>
                </Paginator>
                <Paginator data={this.state.users}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a href={`#/organization/${row.id}`}>{_.startCase(data)}</a>
                            )}
                        />
                        <Column dataKey="description" />
                        <Column dataKey="created_at" renderHeader="Created" />
                        <Column dataKey="updated_at" renderHeader="Last Updated"
                            renderCell={data => (data == null ? 'never' : data)}
                        />
                    </Table>
                </Paginator>

           </Layout>

        );
    }
});

export default View;

