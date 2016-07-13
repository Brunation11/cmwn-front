import React from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';

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
    componentWillMount: function () {
        var urlParts = window.location.href.split('?')[0].split('#')[0].split('/');
        this.setState({
            game: _.last(urlParts),
        });
    },
    componentDidMount: function () {
        var state = Store.getState();
        this.setState({
            gameId: this.props.params.game,
            flipUrl: state.currentUser._links.user_flip.href,
            saveUrl: state.currentUser._links.save_game.href,
        });
        this.resolveRole();
    },
    render: function () {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <Game
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={`${GLOBALS.GAME_URL}${this.props.params.game}/index.html`}
                    flipUrl={this.state.flipUrl}
                    onExit={() => History.push('/profile')}
                    game={this.state.game}
                    currentUser={this.props.currentUser}
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

var Page = connect(mapStateToProps)(GamePage); //eslint-disable-line no-undef
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;
