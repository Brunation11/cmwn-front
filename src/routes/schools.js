import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import Layout from 'layouts/two_col';
import FlipBoard from 'components/flipboard';

import DefaultProfile from 'media/icon_school_blue.png';

const TITLE = 'MY SCHOOLS';

const NO_SCHOOLS = 'Sorry, none of your schools currently have a profile.' +
    ' Please check back again in a little while.';

var Component = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <a href={`/school/${item.group_id}`}>
                    <img src={DefaultProfile}></img>
                    <p>{`${item.title}`}</p>
                </a>
            </div>
        );
    },
    render: function () {
        return (
            <Layout>
                <FlipBoard
                    data={this.props.data}
                    header={TITLE}
                    renderFlip={this.renderFlip}
                    renderNoData={() => (<h2 className="placeholder">{NO_SCHOOLS}</h2>)}
                />
            </Layout>
        );
    }
});

var mapStateToProps = state => {
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

