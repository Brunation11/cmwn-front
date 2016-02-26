import React from 'react';
import _ from 'lodash';
import {Link} from 'react-router';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import EditLink from 'components/edit_link';
import GLOBALS from 'components/globals';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import Util from 'components/util';
import History from 'components/history';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    DISTRICTS: 'Districts'
};

const ADMIN_TEXT = 'Teacher Dashboard';

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
            if (!res.response.data.can_update) { //eslint-disable-line camel_case
                History.replace(`/organization/${this.props.params.id}/profile`);
            }
            this.setState({
                organization: res.response.data,
                districts: Util.normalize(res.response, 'districts', []),
                groups: Util.normalize(res.response, 'groups', []),
                users: Util.normalize(res.response, 'users', [])
            });
        });
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
    renderAdminLink: function () {
        if (!this.state.organization.can_update) {
            return null;
        }
        return (
            <p><a href={`/organization/${this.state.organization.uuid}/view`}>{ADMIN_TEXT}</a></p>
        );
    },
    render: function () {
        if (this.state.organization == null || !this.state.organization.can_update) {
            return null;
        }
        return (
            <Layout>
                <h2>{this.state.organization.title}</h2>
                <Panel header={HEADINGS.TITLE} className="standard">
                   <EditLink base="/organization" uuid={this.state.organization.uuid} canUpdate={this.state.organization.can_update} />
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

