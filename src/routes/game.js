import React from 'react';
import { connect } from 'react-redux';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';

import Layout from 'layouts/one_col';

const PAGE_UNIQUE_IDENTIFIER = 'single-game';

var mapStateToProps;
var Page;

export class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html',
            isStudent: true
        };
    }

    componentDidMount() {
        this.resolveRole(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.resolveRole(nextProps);
    }

    resolveRole(props) {
        var newState = {};
        if (props.currentUser && props.currentUser.type !== 'CHILD') {
            newState.isStudent = false;
        } else {
            newState.isStudent = true;
        }
        this.setState(newState);
    }

    render() {
        return (
           <Layout>
                <Game
                    className={PAGE_UNIQUE_IDENTIFIER}
                    ref="gameRef"
                    isTeacher={!this.state.isStudent}
                    url={this.state.gameUrl}
                    onExit={() => History.push('/profile')}
                    saveUrl={this.props.currentUser._links.save_game.href}
                />
           </Layout>
        );
    }
}

mapStateToProps = state => {
    var data = {};
    var loading = true;
    var currentUser = {};
    if (state.page && state.page.data != null) {
        loading = state.page.loading;
        data = state.page.data;
    }
    if (state.currentUser != null) {
        currentUser = state.currentUser;
    }
    return {
        data,
        loading,
        currentUser
    };
};

Page = connect(mapStateToProps)(GamePage);
Page._IDENTIFIER = PAGE_UNIQUE_IDENTIFIER;
export default Page;

