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
import History from 'components/history';
import EditLink from 'components/edit_link';

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    Organizations: 'Member of: '
};

var View = React.createClass({
    getInitialState: function () {
        this.data = {};
        this.members = [];
        return {
        };
    },
    componentWillMount: function () {
        this.getGroup();
    },
    getGroup: function () {
        var urlData = HttpManager.GET({url: `${GLOBALS.API_URL}groups/${this.props.params.id}?include=users.images,organizations`});
        urlData.then(res => {
            this.data = res.response.data;
            if (!this.data.can_update) { //eslint-disable-line camel_case
                History.replace(`/groups/${this.props.params.id}/profile`);
            }
            this.members = Util.normalize(res.response, 'users', []);
            this.forceUpdate();
        });
    },
    renderGroups: function () {
        var links = _.map(this.data.organizations, organization => {
            return (
                <Link to={`organization/${organization.uuid}`}>
                    {organization.title}
                </Link>
            );
        });
        if (!links.length) {
            return null;
        }
        return <span>{`${HEADINGS.GROUPS}: `}{links}</span>;
    },
    render: function () {
        if (this.data == null || !this.data.can_update) {
            return null;
        }
        return (
            <Layout>
                <Panel header={HEADINGS.TITLE + ': ' + this.data.title} className="standard">
                    <EditLink base="/group" uuid={this.data.uuid} canUpdate={this.data.can_update} />
                    <p>
                        <a href={`/group/${this.data.uuid}/profile`}>Return to group profile</a>
                    </p>
                    <br />
                    <p>{this.renderGroups()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.data.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.data.created_at}`}</p>
                </Panel>
                <Panel header="Students" className="standard">
                    <Paginator data={this.members}>
                        <Table>
                            <Column dataKey="title"
                                renderHeader="Name"
                                renderCell={(data, row) => (
                                    <a href={`/users/${row.uuid}`}>{`${row.first_name} ${row.last_name}`}</a>
                                )}
                            />
                            <Column dataKey="username" />
                            <Column dataKey="active" renderHeader="Active user" renderCell={ (data) => {
                                return data ? 'Active' : 'Inactive';
                            }} />
                            <Column dataKey="updated_at" renderHeader="Update Users"
                                renderCell={(data, row) => {
                                    return (
                                        <a href={`/users/${row.uuid}/edit`}>Edit</a>
                                    );
                                }}
                            />
                        </Table>
                    </Paginator>
                </Panel>
           </Layout>

        );
    }
});

export default View;

