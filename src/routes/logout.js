import React from 'react';
import Loader from 'react-loader';

import Layout from 'layouts/one_col';

import 'routes/logout.scss';

var loaderOptions = {
    lines: 5,
    length: 20,
    width: 2,
    radius: 30,
    corners: 1,
    rotate: 0,
    direction: 1,
    color: '#000',
    speed: 1,
    trail: 40,
    shadow: false,
    hwaccel: false,
    zIndex: 2e9,
    top: '50%',
    left: '50%',
    scale: 1.00
};

var Page = React.createClass({
    render: function () {
        return (
           <Layout>
                <div className="logout-page">
                    <Loader loaded={false} options={loaderOptions} className="spinner" />Logging out...
                </div>
           </Layout>
        );
    }
});

export default Page;

