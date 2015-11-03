import React from 'react';
import {Link} from 'react-router';

import HttpManager from 'components/http_manager'
import Layout from 'layouts/two_col';
import GLOBALS from 'components/globals'

const INFO = {
    TITLE: "Info",
    ID: 'ID'
};
const BREADCRUMB = {
    HOME: 'home',
    DISTRICTS: 'Districts'
};


var View = React.createClass({
    district: [],
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
    render: function() {
        return (
            <Layout>
                <h2>{this.district.title}</h2>
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <Link to="/districts">Districts</Link>
                    <span>{this.district.title}</span>
                </div>
                <section>
                    <h3>{INFO}</h3>
                    <p>ID: {}</p>
                    <Button />
                </section>
            </Layout>
        );
    }
});

export default View;

