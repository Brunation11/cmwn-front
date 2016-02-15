import React from 'react';

import Game from 'components/game';
import History from 'components/history';
import GLOBALS from 'components/globals';

import Layout from 'layouts/one_col';

var Page = React.createClass({
    getInitialState: function () {
        return {
            gameUrl: GLOBALS.GAME_URL + this.props.params.game + '/index.html'
        };
    },
    render: function () {
        return (
           <Layout>
                <Game ref="gameRef" url={this.state.gameUrl} onExit={() => History.replaceState(null, '/profile')}/>
           </Layout>
        );
    }
});

export default Page;

