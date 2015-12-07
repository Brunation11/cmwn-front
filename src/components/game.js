import React from 'react';
import ReactDOM from 'react-dom';

import {Button} from 'react-bootstrap';

import 'components/game.scss';

var Game = React.createClass({
    makeFullScreen: function () {
        ReactDOM.findDOMNode(this.refs.gameRef).webkitRequestFullScreen();
    },
    render: function () {
        return (
            <div className="game">
                <iframe ref="gameRef" src={'http://www.bing.com/search?q=' + this.props.id} />
                <Button onClick={this.makeFullScreen}>Full Screen</Button>
            </div>
        );
    }
});

export default Game;
