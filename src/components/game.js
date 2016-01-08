import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import {Button, Glyphicon} from 'react-bootstrap';

import 'components/game.scss';

const EVENT_PREFIX = '_e_';

/**
 * Game wrapper iframe component.
 * Listens for 'game-event'
 * Has three default events - init, onFlipEarned, and onSave
 * Provides data to component via respond method in details of init event
 * additional arbitrary events can be added by adding additional
 * props prefixed with 'on'. Should the game issue events with
 * these names, any provided callbacks will fire. For example:
 * ```
 * var event = new Event('save', {bubbles: true}, {name: 'save', gameData: {state: {...}}});
 * window.frameElement.dispatchEvent(event)
 * ```
 * note that the component may provide incomplete or empty
 * state data, so any missing properties should be actively
 * regenerated by the game itself.
 */
var Game = React.createClass({
    getDefaultProps: function () {
        return {
            onFlipEarned: _.noop,
            onSave: _.noop,
            gameState: {}
        };
    },
    componentWillMount: function () {
        this.setEvent();
    },
    componentWillUnmount: function () {
        this.clearEvent();
    },
    /**
     * default events. These will always fire regardless of whether or not
     * there is an event defined in addition to the submission behavior
     */
    [EVENT_PREFIX + 'flipped']: function () {
    },
    [EVENT_PREFIX + 'save']: function () {
    },
    [EVENT_PREFIX + 'init']: function (e) {
        e.respond(this.props.gameState);
    },
   /** end of default events */
    gameEventHandler: function (e) {
        console.log('Heard Event:', e); //eslint-disable-line no-console
        if (e.name != null) {
            if (_.isFunction(this[EVENT_PREFIX + e.name])) {
                this[EVENT_PREFIX + e.name](...arguments);
            }
            if(_.isFunction(this.props['on' + _.capitalize(e.name)])) {
                this.props['on' + _.capitalize(e.name)](...arguments);
            }
        }
    },
    setEvent: function () {
        window.addEventListener('game-event', this.gameEventHandler);
    },
    clearEvent: function () {
        window.removeEventListener('game-event', this.gameEventHandler);
    },
    makeFullScreen: function () {
        ReactDOM.findDOMNode(this.refs.gameRef).webkitRequestFullScreen();
    },
    render: function () {
        if (this.props.url == null) {
            return null;
        }
        return (
            <div className="game">
                <iframe ref="gameRef" src={this.props.url} />
                <Button onClick={this.makeFullScreen}><Glyphicon glyph="fullscreen" /> Full Screen</Button>
            </div>
        );
    }
});

export default Game;