import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { GamesPage } from 'routes/games';
import { dataTransform } from 'routes/games';
import MockFlipWrapper from 'mocks/mock_flip_wrapper';
import GLOBALS from 'components/globals';

import studentDataA from 'mocks/users/student_data_a';

describe('<GamesPage />', function () {
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
