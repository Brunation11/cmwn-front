import React from 'react';

import Fetcher from 'components/fetcher';
import {Table, Column} from 'components/table';
import Paginator from 'components/paginator';
import GLOBALS from 'components/globals';
import Layout from 'layouts/one_col';

var Page = React.createClass({
    render: function () {
        return (
           <Layout>
                <form>
                    <Fetcher url={ GLOBALS.API_URL + '/friends'}>
                        <Paginator>
                            <Table>
                                <Column data-key="name" />
                            </Table>
                        </Paginator>
                    </Fetcher>
                </form>
           </Layout>
        );
    }
});

export default Page;

