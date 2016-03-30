import React from 'react';
import ReactDOM from 'react-dom';
import Screenfull from 'screenfull';
import ClassNames from 'classnames';
import _ from 'lodash';

import {Button, Glyphicon} from 'react-bootstrap';

import 'components/game.scss';

const EVENT_PREFIX = '_e_';

const FULLSCREEN = 'Full Screen';
const DEMO_MODE = 'Demo Mode';

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
            isTeacher: false,
            gameState: {}
        };
    },
    getInitialState: function () {
        return {
            fullscreenFallback: false
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
    [EVENT_PREFIX + 'Flipped']: function () {
    },
    [EVENT_PREFIX + 'Save']: function () {
    },
    [EVENT_PREFIX + 'Exit']: function () {
        this.setState({fullscreenFallback: false});
    },
    [EVENT_PREFIX + 'Init']: function (e) {
        e.respond(this.props.gameState);
    },
   /** end of default events */
    gameEventHandler: function (e) {
        if (e.name != null) {
            if (_.isFunction(this[EVENT_PREFIX + e.name])) {
                this[EVENT_PREFIX + _.capitalize(e.name)](...arguments);
            }
            if (_.isFunction(this.props['on' + _.capitalize(e.name)])) {
                this.props['on' + _.capitalize(e.name)](...arguments);
            }
        }
    },
    setEvent: function () {
        window.addEventListener('game-event', this.gameEventHandler);
        window.addEventListener('keydown', this.listenForEsc);
    },
    clearEvent: function () {
        window.removeEventListener('game-event', this.gameEventHandler);
        window.removeEventListener('keydown', this.listenForEsc);
    },
    listenForEsc: function (e) {
        var self = this;
        if (e.keyCode === 27 || e.charCode === 27) {
            self.setState({fullscreenFallback: false});
        }
    },
    dispatchPlatformEvent(name, data) {
        /** TODO: MPR, 1/15/16: Polyfill event */
        var event = new Event('platform-event', {bubbles: true, cancelable: false});
        _.defaults(event, {type: 'platform-event', name, data});
        ReactDOM.findDOMNode(this.refs.gameRef).contentWindow.dispatchEvent(event);
    },
    makeFullScreen: function () {
        var self = this;
        if (Screenfull.enabled) {
            Screenfull.request(ReactDOM.findDOMNode(self.refs.gameRef));
        } else {
            self.setState({fullscreenFallback: true});
        }
    },
    render: function () {
        if (this.props.url == null) {
            return null;
        }
        return (
            <div ref="wrapRef" className={ClassNames('game', {fullscreen: this.state.fullscreenFallback})}>
                <iframe ref="gameRef" src={this.props.url} />
                <Button onClick={this.makeFullScreen}><Glyphicon glyph="fullscreen" /> {FULLSCREEN}</Button>
                <Button className={ClassNames({hidden: !this.props.isTeacher})} onClick={() => this.dispatchPlatformEvent('toggle-demo-mode')}>{DEMO_MODE}</Button>
            </div>
        ) ;
    }
});

export default Game;
