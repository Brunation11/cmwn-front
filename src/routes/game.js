import React from 'react';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';
import Store from 'components/store';

import Layout from 'layouts/one_col';

var Page = React.createClass({
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
        return (
           <Layout>
                <Game ref="gameRef" isTeacher={!this.state.isStudent} url={this.state.gameUrl} onExit={() => History.replace('/profile')}/>
           </Layout>
        );
    }
});

export default Page;

