import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import Paginator from 'components/paginator';
import UserTile from 'components/user_tile';
import Actions from 'components/actions';
import GLOBALS from 'components/globals';

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

    renderCard(item) {
        return (
             <UserTile
                item={item}
                friendHAL={this.props.currentUser._links.friend.href}
                onFriendAdded={() => {
                    Actions.dispatch.START_RELOAD_PAGE(this.props);
                }}
                onFriendRequested={() => {
                    Actions.dispatch.START_RELOAD_PAGE(this.props);
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
                    <Paginator
                        rowCount={this.props.rowCount}
                        currentPage={this.props.currentPage}
                        pageCount={this.props.pageCount}
                        data={this.props.data}
                        pagePaginator={true}
                    >
                        <FlipBoard
                           renderFlip={this.renderCard.bind(this)}
                           header={HEADINGS.FRIENDS}
                           transform={data => {
                               var image;
                               if (!_.has(data, '_embedded.image')) {
                                   image = GLOBALS.DEFAULT_PROFILE;
                               } else {
                                   if (data._embedded.image.url != null) {
                                       image = data._embedded.image.url;
                                   } else {
                                       image = data.images.data[0].url;
                                   }
                               }
                               return data.set('image', image);
                           }}
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
    if (state.page && state.page.data != null &&
        state.page.data._embedded && state.page.data._embedded.friend) {
        loading = state.page.loading;
        data = state.page.data._embedded.friend;
        rowCount = state.page.data.page_size;
        currentPage = state.page.data.page;
        pageCount = state.page.data.page_count;
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
        currentUser
    };
};

Page = connect(mapStateToProps)(Friends);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
