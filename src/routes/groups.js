import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';

//import HttpManager from 'components/http_manager';
import FlipBoard from 'components/flipboard';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';

import DefaultProfile from 'media/icon_class_blue.png';

const TITLE = 'MY CLASSES';

var Component = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <a href={`/group/${item.group_id}`}>
                    <img src={DefaultProfile}></img><p>{`${item.title}`}</p>
                </a>
            </div>
        );
    },
    render: function () {
        return (
            <Layout>
                <Paginator data={this.props.data} pageCount={1}>
                    <FlipBoard header={TITLE} renderFlip={this.renderFlip} />
                </Paginator>
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = [];
    var loading = true;
    if (state.page && state.page.data) {
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

