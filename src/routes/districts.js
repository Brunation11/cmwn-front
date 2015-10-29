import React from 'react';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager'
import GLOBALS from 'components/globals'
import {Table, Column}  from 'components/table';

const TITLE = 'Districts';
const HOME = 'Home';

var Districs = React.createClass({
    districs: [{id: '1', description: 'yes'}],
    componentWillMount: function () {
        this.getDistrics();
    },
    getDistrics: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts'});
        urlData.then(res => {
            this.districs = res.response.data;
            this.forceUpdate();
        });
    },
    render: function () {
        return (
            <div>
                <header>
                    <h2>{TITLE}</h2>
                    <div className="breadcrumb">
                        <Link to="/">{HOME}</Link>
                        {TITLE}
                    </div>
                </header>
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

