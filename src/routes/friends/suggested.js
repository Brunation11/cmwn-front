import React from 'react';
import {Panel, Button} from 'react-bootstrap';

import Fetcher from 'components/fetcher';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import GLOBALS from 'components/globals';
import History from 'components/history';
import Layout from 'layouts/two_col';

const NO_FRIENDS = 'You\'re already friends everyone in your network. Great work!';
const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};
const ADD_FRIEND = 'Add Friend';

var Page = React.createClass({
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
           <Layout>
                <form>
                    <Fetcher url={ GLOBALS.API_URL + 'suggestedfriends'} renderNoData={this.renderNoData} >
                        <Paginator>
                            <Table>
                                <Column data-key="name" />
                                <Column data-key="id" renderCell={(id) => {
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

