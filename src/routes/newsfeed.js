import React from 'react';

import Fetcher from 'components/fetcher';

import Layout from 'layouts/one_col';

var Page = React.createClass({
    render: function () {
        return (
           <Layout className="newsfeed">
                <Fetcher url={GLOBALS.API_URL + ''}>
                    <Feed>
                    </Feed>
                </Fetcher>
           </Layout>
        );
    }
});

export default Page;


