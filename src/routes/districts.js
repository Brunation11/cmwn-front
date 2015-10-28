import React from 'react';

import HttpManager from 'components/http_manager'
import {Table, Column}  from 'components/table';

var Districs = React.createClass({
    districs: [{id: '1', description: 'yes'}],
    componentWillMount: function () {
        this.getDistrics();
    },
    getDistrics: function () {
        var urlData = HttpManager.GET({url:'http://cmwn/districts'});
        urlData.then(res => {
            debugger;
            this.districs = res.response.data;
            this.forceUpdate();
        });
    },
    render: function () {
        return (
            <div>
                districs
                <Table rows={this.districs}>
                    <Column dataKey="id" />
                    <Column dataKey="title" />
                    <Column dataKey="description" />
                    <Column dataKey="created_at" />
                    <Column dataKey="updated_at" />
                    <Column dataKey="deleted_at" renderCell={data => (data == null ? 'never' : data)} />
                </Table>
            </div>
        );
    }
});

export default Districs;

