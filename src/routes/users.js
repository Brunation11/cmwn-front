import React from 'react';
import {Link} from 'react-router';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
//import HttpManager from 'components/http_manager';
import Layout from 'layouts/two_col';
import Paginator from 'components/paginator';

import DefaultProfile from 'media/profile_tranparent.png';

const TITLE = 'My Friends and Network'; /** @TODO MPR, 12/3/15: May need to swap this based on user type */
const HOME = 'Home';

var Component = React.createClass({
    renderFlip: function (item){
        return (
            <div className="flip" key={Shortid.generate()}>
                <Link to={`/users/${item.user_id}`/** @TODO MPR, 12/7/15: very much need to switch on type, CORE-149*/}>
                    <img src={DefaultProfile}></img><p>{`${item.first_name} ${item.last_name}`}</p>
                </Link>
            </div>
        );
    },
    render: function () {
        return (
            <Layout className="user-list">
                <header>
                    <h2>{TITLE}</h2>
                    <div className="breadcrumb">
                        <Link to="/">{HOME}</Link>
                        {TITLE}
                    </div>
                </header>
                <Paginator pageCount={1} data={this.props.data}>
                    <FlipBoard renderFlip={this.renderFlip} />
                </Paginator>
            </Layout>
        );
    }
});

const mapStateToProps = state => {
    var data = {};
    var loading = true;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.user) {
        loading = state.page.loading;
        data = state.page.data._embedded.user;
    }
    return {
        data,
        loading
    };
};

var Page = connect(mapStateToProps)(Component);
export default Page;

