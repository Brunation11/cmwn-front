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
            isStudent: true
        };
    },
    componentDidMount: function () {
        var state = Store.getState();
        this.setState({
            gameId: this.props.params.game,
            gameUrl: `${GLOBALS.GAME_URL}${this.props.params.game}/index.html`,
            flipUrl: state.currentUser._links.user_flip.href,
            saveUrl: state.currentUser._links.save_game.href,
        });
        this.resolveRole();
    },
    resolveRole() {;
        var state = Store.getState();
        // remember we actually want current user here, not the user whose
        // profile we are looking at
        if (state.currentUser &&
            state.currentUser.type &&
            state.currentUser.type !== 'CHILD') {
            this.setState({
                isStudent: false
            });
        } else {
            this.setState({
                isStudent: true
            });
        }
    },
    render: function () {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <Game
                    className={PAGE_UNIQUE_IDENTIFIER}
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    flipUrl={this.state.flipUrl}
                    saveUrl={this.state.saveUrl}
                    onExit={() => History.push('/profile')}
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
