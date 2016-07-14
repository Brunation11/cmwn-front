import React from 'react';
import _ from 'lodash';
import {Modal} from 'react-bootstrap';
import { connect } from 'react-redux';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';
import Store from 'components/store';
import Detector from 'components/browser_detector';

import Layout from 'layouts/one_col';

const PAGE_UNIQUE_IDENTIFIER = 'single-game';

var GamePage = React.createClass({
    getInitialState: function () {
        return {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html',
            isStudent: true,
            gameOn: false,
            PAGE_UNIQUE_IDENTIFIER: this.props.params.game
        };
    },
    componentDidMount: function () {
        this.resolveRole(this.props);
        this.setState({
            gameId: this.props.params.game,
            gameUrl: `${GLOBALS.GAME_URL}${this.props.params.game}/index.html`,
            flipUrl: this.props.currentUser._links.user_flip.href,
            saveUrl: this.props.currentUser._links.save_game.href,
        });
    },
    componentWillReceiveProps: function (nextProps) {
        this.resolveRole(nextProps);
        this.setState({
            gameId: this.props.params.game,
            gameUrl: `${GLOBALS.GAME_URL}${this.props.params.game}/index.html`,
            flipUrl: nextProps.currentUser._links.user_flip.href,
            saveUrl: nextProps.currentUser._links.save_game.href,
        });
    },
    resolveRole: function (props) {
        // remember we actually want current user here, not the user whose
        // profile we are looking at
        if (props.currentUser &&
            props.currentUser.type &&
            props.currentUser.type !== 'CHILD') {
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
                    ref="gameRef"
                    game={this.state.game}
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    flipUrl={this.state.flipUrl}
                    currentUser={this.props.currentUser}
                    onExit={() => History.push('/profile')
                    }
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
