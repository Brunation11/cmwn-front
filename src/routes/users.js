import React from 'react';

import HttpManager from 'components/http_manager'
import Layout from 'layouts/two_col';
import {Table, Column}  from 'components/table';

var Users = React.createClass({
    users: [{id: '1', description: 'yes'}],
    componentWillMount: function () {
        this.getUsers();
    },
    getUsers: function () {
        var urlData = HttpManager.GET({url:'http://cmwn/districts'});
        urlData.then(res => {
            debugger;
            this.users = res.response.data;
            this.forceUpdate();
        });
    },
    render: function () {
        return (
            <Layout>
                users
                <Table rows={this.users}>
                    <Column dataKey="id" />
                    <Column dataKey="description" />
                </Table>
            </Layout>
        );
    }
});

export default Users;

