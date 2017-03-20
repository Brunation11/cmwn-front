import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import Paginator from 'components/paginator';
import UserTile from 'components/user_tile';
import Actions from 'components/actions';

import Layout from 'layouts/two_col';

import 'routes/friends.scss';

const HEADINGS = {
    FRIENDS: 'My Friends'
};

const NO_FRIENDS = (
    <h2 className="placeholder">
        Looks like you haven't added any friends yet. Let's go{' '}
        <Link to="/friends/suggested">find some!</Link>
    </h2>
);

const PAGE_UNIQUE_IDENTIFIER = 'friends-page';

var mapStateToProps;
var Page;

export class Friends extends React.Component {
    constructor(){
        super();
    }

    reloadList(){
        setTimeout(() => {
            Actions.dispatch.START_RELOAD_PAGE(this.props);
        }, 500);
    }

    renderCard(item) {
        return (
             <UserTile
                item={item}
                friendHAL={this.props.currentUser._links.friend.href}
                onFriendAdded={() => {
                    this.reloadList.call(this);
                }}
                onFriendRequested={() => {
                    this.reloadList.call(this);
                }}
                key={Shortid.generate()}
             />
        );
    }

    render() {
        if (this.props.data == null) {
            return (
                <Layout
                    currentUser={this.props.currentUser}
                    className={PAGE_UNIQUE_IDENTIFIER}
                    navMenuId="navMenu"
                >
                    {null}
                </Layout>
            );
        } else if (this.props.data.length === 0) {
            return (
                <Layout
                    currentUser={this.props.currentUser}
                    className={PAGE_UNIQUE_IDENTIFIER}
                    navMenuId="navMenu"
                >
                    {NO_FRIENDS}
                </Layout>
            );
        }

        return (
            <Layout
                currentUser={this.props.currentUser}
                className={PAGE_UNIQUE_IDENTIFIER}
                navMenuId="navMenu"
            >
                <form>
                    <Paginator data={this.props.data} >
                        <FlipBoard
                           renderFlip={this.renderCard.bind(this)}
                           header={HEADINGS.FRIENDS}
                        />
                   </Paginator>
                </form>
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data;
    var loading = true;
    var rowCount = 1;
    var currentPage = 1;
    var pageCount = 1;
    var currentUser = {};
    var page;
    if (state.page && state.page.data != null &&
        state.page.data._embedded && state.page.data._embedded.friend) {
        loading = state.page.loading;
        data = state.page.data._embedded.friend;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
        pageCount = state.page.data.page_count;
        page = state.page;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        rowCount,
        currentPage,
        pageCount,
        page,
        currentUser
    };
};

Page = connect(mapStateToProps)(Friends);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
