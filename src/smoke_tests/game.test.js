import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { GamePage } from 'routes/game';
import Layout from 'layouts/one_col';
import Game from 'components/game';
import GLOBALS from 'components/globals';
import Detector from 'components/browser_detector';

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
            expect(WRAPPER.find('div')).to.have.length(4);
            expect(WRAPPER.find('Modal')).to.have.length(6);
        });

        it('has the correct layout contents', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            const LAYOUT = WRAPPER.find('Layout');
            expect(LAYOUT.children()).to.have.length(2);
            expect(LAYOUT.find('div')).to.have.length(4);
            expect(LAYOUT.find('Footer')).to.have.length(1);
        });

        it('shows the modal', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(Detector.isMobileOrTablet()).to.be.false;
            expect(Detector.isPortrait()).to.be.false;
            expect(WRAPPER.state('gameOn')).to.be.true;
            expect(WRAPPER.state('gameUrl')).to.equal(GLOBALS.GAME_URL + 'be-bright/index.html');
        });

        it('tests that teacher is not a child', function () {
            var game = <GamePage data={teacherData} loading={false}
                currentUser={teacherData} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.false;
        });

        it('tests that student is a child', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.true;
        });

        it('tests that state will update', function () {
            var game = <GamePage data={studentDataA} loading={false}
                currentUser={studentDataA} params={{game: 'be-bright'}}/>;
            const WRAPPER = mount(game);
            expect(WRAPPER.state('isStudent')).to.be.true;
            WRAPPER.setProps({currentUser: teacherData});
            expect(WRAPPER.state('isStudent')).to.be.false;
        });
    });
}
