import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
import Layout from 'layouts/two_col';

import DefaultProfile from 'media/icon_class_blue.png';

const TITLE = 'MY CLASSES';

var Component = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <a href={`/class/${item.group_id}`}>
                    <img src={DefaultProfile}></img><p>{`${item.title}`}</p>
                </a>
            </div>
        );
    },
    render: function () {
        return (
            <Layout>
                <FlipBoard data={this.props.data} header={TITLE} renderFlip={this.renderFlip} />
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

