import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import gameSmoke from 'smoke_tests/game.test.js';
import { GamePage } from 'routes/game';

import studentDataA from 'mocks/users/student_data_a';

describe('<GamePage />', function () {
    describe('Game Page Smoke Tests', function () {
        gameSmoke();
    });

    describe('Checks game page', function () {
        var game = <GamePage data={studentDataA} loading={false}
            currentUser={studentDataA} params={{game: 'be-bright'}}/>;
        const WRAPPER = shallow(game);

        it('renders the game component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(GamePage);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('Game')).to.have.length(1);
        });
    });
});
