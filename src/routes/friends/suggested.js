import React from 'react';
import {Panel, Button} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import GLOBALS from 'components/globals';
import History from 'components/history';
import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

const NO_FRIENDS = 'You\'re already friends everyone in your network. Great work!';
const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};
const ADD_FRIEND = 'Add Friend';

var Page = React.createClass({
    addFriend: function (id) {
        HttpManager.GET({url: `${GLOBALS.API_URL}suggestedfriends/${id}`});
    },
    renderNoData: function () {
        return (
            <Panel header={HEADINGS.SUGGESTED} className="standard">
                <h2>{NO_FRIENDS}</h2>
                <p><a onClick={History.goBack}>Back</a></p>
            </Panel>
        );
    },
    render: function () {
        return (
           <Layout className="suggestedFriends">
                <form>
                    <Fetcher url={ GLOBALS.API_URL + 'suggestedfriends'} renderNoData={this.renderNoData} >
                        <Panel header={HEADINGS.SUGGESTED} className="standard"/>
                        <Paginator>
                            <Table renderHeader={false}>
                                <Column dataKey="image" renderCell={data => <img src={data} />} renderHeader={false} />
                                <Column dataKey="first_name" renderCell={(d, row) => `${row.first_name} ${row.last_name}`} />
                                <Column dataKey="id" className="right" renderHeader="Add Friend" renderCell={(id) => {
                                    return <Button onClick={this.addFriend.bind(this, id)}>{ADD_FRIEND}</Button>;
                                }} />
                            </Table>
                        </Paginator>
                    </Fetcher>
                </form>
           </Layout>
        );
    }
});

export default Page;

