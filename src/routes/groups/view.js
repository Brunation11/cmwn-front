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

const HEADINGS = {
    TITLE: 'Info',
    ID: 'ID',
    DESCRIPTION: 'Description',
    CREATED: 'Created',
    Organizations: 'Member of: '
};
const BREADCRUMB = {
    HOME: 'Home',
    GROUPS: 'Groups'
};
const EDIT_LINK = 'Edit';


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
                History.replaceState(null, `/groups/${this.props.params.id}/profile`);
            }
            this.members = Util.normalize(res.response, 'users', []);
            this.forceUpdate();
        });
    },
    renderEditLink: function () {
        if (GLOBALS.CURRENT_USER.ID === window.parseInt(this.props.params.id)) {
            /** @TODO MPR, 10/4/15: Add check for user is admin*/
            return <Link to={`/group/${this.props.params.id}/edit`} >({EDIT_LINK})</Link>;
        }
        return null;
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
                <h2>{this.data.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">{BREADCRUMB.HOME}</Link>
                    <Link to="/groups">{BREADCRUMB.GROUPS}</Link>
                    <span>{this.data.title}</span>
                </div>
                <Panel header={HEADINGS.TITLE} className="standard">
                    <p>
                        {this.renderEditLink()}
                    </p>
                    <br />
                    <p>{`${HEADINGS.ID}: ${this.data.uuid}`}</p>
                    <br />
                    <p>{this.renderGroups()}</p>
                    <br />
                    <p>{`${HEADINGS.DESCRIPTION}: ${this.data.description}`}</p>
                    <br />
                    <p>{`${HEADINGS.CREATED}: ${this.data.created_at}`}</p>
                </Panel>
                <Paginator data={this.members}>
                    <Table>
                        <Column dataKey="title"
                            renderCell={(data, row) => (
                                <a href={`#/organization/${row.uuid}`}>{_.startCase(data)}</a>
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

