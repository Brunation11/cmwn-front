import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Game } from 'components/games';
import { COMPONENT_IDENTIFIER } from 'components/game';

const STUDENT_DATA = {
    isTeacher: false,
    url: 'https://games-dev.changemyworldnow.com/game/index.html',
    game: 'game',
}

const TEACHER_DATA = {
    isTeacher: false,
    url: 'https://games-dev.changemyworldnow.com/game/index.html',
    game: 'game',
}

const SKRIBBLE_DATA = {
    isTeacher: false,
    url: 'https://games-dev.changemyworldnow.com/skribble/index.html',
    game: 'skribble',
}

var createWrapper = function (data) {
    var game = (
        <Game
            isTeacher={data.isTeacher}
            url={data.gameUrl}
            game={data.game}
        />
    );
    const WRAPPER = shallow(profile);
    return WRAPPER;
};

var checkGameContents(WRAPPER) {
    expect(WRAPPER.hasClass(COMPONENT_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.find('.game-frame-wrapper')).to.have.length(1);
    expect(WRAPPER.find('.overlay')).to.have.length(1);
    expect(WRAPPER.find('.game-frame')).to.have.length(1);
    expect(WRAPPER.find('.full-screen-btn')).to.have.length(1);
}

var checkForButtons(WRAPPER, length) {
    expect(WRAPPER.find('.standard')).to.have.length(length);
    var purple = WRAPPER.find('.purple').length;
    expect(WRAPPER.find('.green')).to.have.length(length - purple);
}

var simulateFullScreen(WRAPPER) {
    WRAPPER.find('.full-screen-btn').simulate('click');
    WRAPPER.setState({fullscreenFallback: true});
    expect(WRAPPER.find('.fullscreen')).to.have.length(1);
}

var simulatePortrait(WRAPPER) {
    WRAPPER.setState({isPortrait: true});
    expect(WRAPPER.find('.portrait')).to.have.length(1);
}

var simulateDemoMode(WRAPPER) {
    WRAPPER.find('.demo-btn').simulate('click');
    checkForButtons(WRAPPER, 2);
}

describe('game component unit tests', function () {
    describe('when no game data is provided', function () {
        const WRAPPER = createWrapper(null);
        it('should render null', function () {
            expect(WRAPPER.type()).to.equal(null); 
        }
    }
    describe('when a student opens a game', function () {
        const WRAPPER = createWrapper(STUDENT_DATA);
        it('should render the game', function () {
            checkGameContents(WRAPPER);
            simulateFullScreen(WRAPPER);
            simulatePortrait(WRAPPER);
        });
        it('shouldn\'t render a demo button', function () {
            checkForButtons(WRAPPER, 1);
        });
    });
    describe('when a teacher opens a game', function () {
        const WRAPPER = createWrapper(TEACHER_DATA);
        it('should render the game', function () {
            checkGameContents(WRAPPER);
            simulateFullScreen(WRAPPER);
            simulatePortrait(WRAPPER);
        });
        it('should render a demo button', function () {
            checkForButtons(WRAPPER, 2);
            simulateDemoMode(WRAPPER);
        });
    });
    describe('when skribble is opened', function () {
        const WRAPPER = createWrapper(SKRIBBLE_DATA);
        it('shouldn\'t render a demo button', function () {
            checkForButtons(WRAPPER, 1);
        });
    });
});

