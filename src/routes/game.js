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
    constructor() {
        super();
        this.state = {
            isStudent: true,
        };
    }
    componentDidMount() {
        this.resolveRole(this.props);
        this.setState({
            gameId: this.props.params.game,
        });
    }

    componentWillReceiveProps(nextProps) {
        this.resolveRole(nextProps);
        this.setState({
            gameId: this.props.params.game,
        });
    }

    resolveRole(props) {
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
    }

    render() {
        return (
            <Layout className={PAGE_UNIQUE_IDENTIFIER}>
                <Game
                    ref="gameRef"
                    game={this.props.params.game}
                    isTeacher={!this.state.isStudent}
                    url={`${GLOBALS.GAME_URL}${this.props.params.game}/index.html`}
                    currentUser={this.props.currentUser}
                    onExit={() => History.push('/profile')
                    }
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
