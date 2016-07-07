import React from 'react';
import { connect } from 'react-redux';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';
import Store from 'components/store';

import Layout from 'layouts/one_col';

const PAGE_UNIQUE_IDENTIFIER = 'single-game';

var GamePage = React.createClass({
    getInitialState: function () {
        return {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html',
            isStudent: true
        };
    },
    componentDidMount: function () {
        this.resolveRole();
    },
    componentWillReceiveProps: function () {
        this.resolveRole();
    },
    resolveRole: function () {
        var newState = {};
        var state = Store.getState();
        if (state.currentUser && state.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    },
    render: function () {
        var flipUrl = this.state._links && this.state._links.user_flip ?
            this.state._links.user_flip.href : null;
        return (
           <Layout>
                <Game
                    className={PAGE_UNIQUE_IDENTIFIER}
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    flipUrl={flipUrl}
                    onExit={() => History.push('/profile')}
                    saveUrl={this.props.currentUser._links.save_game.href}
                />
           </Layout>
        );
    }
});

var mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};


var Page = connect(mapStateToProps)(GamePage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

