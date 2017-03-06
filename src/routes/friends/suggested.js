import React from 'react';
import { connect } from 'react-redux';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import UserTile from 'components/user_tile';
import Actions from 'components/actions';

import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};

const PAGE_UNIQUE_IDENTIFIER = 'suggested-friends';

var mapStateToProps;
var Page;

export class Suggested extends React.Component{
    constructor(){
        super();
    }

    reloadList(){
        setTimeout(() => {
            Actions.dispatch.START_RELOAD_PAGE(this.props.state);
        }, 0);
    }

    renderNoLink() {
        return (
            <h2 className="placeholder">
                At this time, as an adult user you cannot make friends ...<br/>
                but it is on the way!!!!
            </h2>
        );
    }

    renderNoData(data) {
        if (data == null) {
            return null;
        }
        return (
            <h2 className="placeholder">
                You are already friends with everyone in your group.<br />
                Great Work! <br />
                Let's Take Action!
            </h2>
        );
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
                showAdd={true}
             />
        );
    }

    render() {
        var content;
        if (this.props.data == null) return null;
        if (this.props.data && this.props.data.length === 0) return this.renderNoData([]);
        content = (
            <form>
                <FlipBoard
                    data={this.props.data}
                    renderFlip={this.renderCard.bind(this)}
                    header={HEADINGS.SUGGESTED}
                    transform={data => {
                        return data.set('user_id', data.suggest_id);
                    }}
                />
            </form>
        );

        return (
           <Layout
               className={PAGE_UNIQUE_IDENTIFIER}
               currentUser={this.props.currentUser}
           >
               {content}
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var currentUser = {};
    var loading = true;
    var data;
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    if (state.page && state.page.data && state.page.data._embedded) {
        data = state.page.data._embedded.suggest;
    }
    return {
        state,
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Suggested);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
