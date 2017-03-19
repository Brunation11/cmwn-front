import React from 'react';
import Shortid from 'shortid';
import { connect } from 'react-redux';

import FlipBoard from 'components/flipboard';
import Paginator from 'components/paginator';

import Layout from 'layouts/two_col';

import DefaultProfile from 'media/icon_school_blue.png';

export const PAGE_UNIQUE_IDENTIFIER = 'schools';

const TITLE = 'MY SCHOOLS';

const NO_SCHOOLS = 'Sorry, none of your schools currently have a profile.' +
    ' Please check back again in a little while.';

var mapStateToProps;
var Page;

export class Schools extends React.Component {
    renderFlip(item) {
        return (
            <div className="flip" key={Shortid.generate()}>
                <a href={`/school/${item.group_id}`}>
                    <img src={DefaultProfile}></img>
                    <p>{`${item.title}`}</p>
                </a>
            </div>
        );
    }


    renderData() {
        if (this.props.data === []) {
            return (
                <h2 className="placeholder">{NO_SCHOOLS}</h2>
            );
        }

        return (
            <Paginator data={this.props.data} pagePaginator={true}>
                <FlipBoard
                    header={TITLE}
                    renderFlip={this.renderFlip}
                    renderNoData={() => null}
                />
            </Paginator>
        );
    }

    render() {
        return (
            <Layout currentUser={this.props.currentUser} className={PAGE_UNIQUE_IDENTIFIER}>
                {this.renderData()}
            </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = [];
    var loading = true;
    var currentUser;
    if (state.page && state.page.data && state.page.data._embedded && state.page.data._embedded.group) {
        loading = state.page.loading;
        data = state.page.data._embedded.group;
    }
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        data,
        currentUser,
        loading
    };
};

Page = connect(mapStateToProps)(Schools);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

