import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Shortid from 'shortid';

import FlipBoard from 'components/flipboard';
import UserTile from 'components/user_tile';
import Actions from 'components/actions';
import GLOBALS from 'components/globals';
import GenerateDataSource from 'components/datasource';

import Layout from 'layouts/two_col';

import 'routes/friends/suggested.scss';

const HEADINGS = {
    SUGGESTED: 'Suggested Friends'
};

const PAGE_UNIQUE_IDENTIFIER = 'suggested-friends';

const SUGGEST_SOURCE = GenerateDataSource('suggested_friends', PAGE_UNIQUE_IDENTIFIER);

var mapStateToProps;
var Page;

export class Suggested extends React.Component{
    constructor(){
        super();
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
                    Actions.dispatch.START_RELOAD_PAGE(this.props);
                }}
                onFriendRequested={() => {
                    Actions.dispatch.START_RELOAD_PAGE(this.props);
                }}
                key={Shortid.generate()}
                showAdd={true}
             />
        );
    }

    render() {
        var content = (
            <form>
                <SUGGEST_SOURCE
                    renderNoLink={this.renderNoLink}
                    renderNoData={this.renderNoData}
                >
                    <FlipBoard
                        renderFlip={this.renderCard.bind(this)}
                        header={HEADINGS.SUGGESTED}
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
                </SUGGEST_SOURCE>
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
    if (state.currentUser != null){
        currentUser = state.currentUser;
    }
    return {
        state,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(Suggested);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
