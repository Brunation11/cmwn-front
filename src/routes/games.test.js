import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import gamesSmoke from 'smoke_tests/games.test';
import { GamesPage } from 'routes/games';

import studentDataA from 'mocks/users/student_data_a';

describe('<GamesPage />', function () {
    describe('Games Page Smoke Tests', function () {
        gamesSmoke();
    });

    describe('Checks games page', function () {
        var games = <GamesPage data={studentDataA} loading={false}/>;
        const WRAPPER = shallow(games);

        it('renders the component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(GamesPage);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
        });
    });
});
