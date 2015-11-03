import React from 'react';
import {Panel} from 'react-bootstrap';

import HttpManager from 'components/http_manager'
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals'


React.createClass({
    district: {},
    componentWillMount: function () {
        this.getDistrict();
    },
    getDistrict: function () {
        var urlData = HttpManager.GET({url: GLOBALS.API_URL + 'districts/' + this.props.params.id});
        urlData.then(res => {
            this.district = res.response.data;
            this.forceUpdate();
        });
    },
    render: function () {
        return (
           <Layout>
               
           </Layout>
        );
    }
});
