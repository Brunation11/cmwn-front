import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { GamePage } from 'routes/game';
import Layout from 'layouts/one_col';
import Game from 'components/game';

import studentDataA from 'mocks/users/student_data_a';
import teacherData from 'mocks/users/teacher_data';

export default function () {
    describe('Checks <GamePage /> using mount', function () {
        it('renders the game component', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.instance()).to.be.instanceOf(GamePage);
        });

        it('has the correct elements', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.children()).to.have.length(2);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('Game')).to.have.length(1);
        });

        it('has the correct layout contents', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            const LAYOUT = WRAPPER.find('Layout');
            expect(LAYOUT.children()).to.have.length(2);
            expect(LAYOUT.find('div')).to.have.length(5);
            expect(LAYOUT.find('Footer')).to.have.length(1);
        });

        it('has the correct game elements', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            const GAME = WRAPPER.find('Game');
            expect(GAME.find('div')).to.have.length(2);
            expect(GAME.find('iframe')).to.have.length(1);
            expect(GAME.find('Button')).to.have.length(2);
            expect(GAME.find('Glyphicon')).to.have.length(1);
        });

        it('tests that the gameId is correct', function () {
            var game = <GamePage data={teacherData} loading={false}
                currentUser={teacherData} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('gameId')).to.equal('be-bright');
        });

        it('tests that teacher is not a student', function () {
            var game = <GamePage data={teacherData} loading={false}
                currentUser={teacherData} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.false;
        });

        it('tests that child is a student', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.true;
        });

        it('tests that state will update for current user type', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.true;
            WRAPPER.setProps({currentUser: teacherData});
            expect(WRAPPER.state('isStudent')).to.be.false;
        });

        it('tests that state will update for gameId', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('gameId')).to.equal('be-bright');
            WRAPPER.setProps({params: {game: 'happy-fish-face'}});
            WRAPPER.update();
            expect(WRAPPER.state('gameId')).to.be.equal('happy-fish-face');
        });
    });
}
