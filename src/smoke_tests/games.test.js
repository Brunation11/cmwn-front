import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { GamesPage } from 'routes/games';
import Layout from 'layouts/two_col';

import studentDataA from 'mocks/users/student_data_a';

// TODO: File needs to be be fully implemented & refactored to use
// mounting (GenerateDataSource). WL 07/15/16.

export default function () {
    describe('Checks <GamesPage /> using mount', function () {
        var games = <GamesPage data={studentDataA} loading={false}/>;
        /*
        const WRAPPER = mount(games);

        it('renders the component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(GamesPage);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
        });

        it('has the correct layout elements', function () {
            const LAYOUT = WRAPPER.find('Layout');
            expect(LAYOUT.children()).to.have.length(1);
            expect(LAYOUT.find('div')).to.have.length(2);
            expect(LAYOUT.find('Sidebar')).to.have.length(1);
            expect(LAYOUT.find('Footer')).to.have.length(1);
        });
        */
    });
}
