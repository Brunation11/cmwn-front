import React from 'react';
import { expect, mount } from 'chai';
import { shallow } from 'enzyme';

import { GamesPage } from 'routes/games';
import { dataTransform } from 'routes/games';
import MockFlipWrapper from 'mocks/mock_flip_wrapper';
import GLOBALS from 'components/globals';

import studentDataA from 'mocks/users/student_data_a';

const COMING_SOON = 'Coming Soon!';

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

    describe('rendering flip', function () {
        var item = {
            coming_soon: false, // eslint-disable-line camelcase
            game_id: 0, // eslint-disable-line camelcase
            title: 'test game',
            description: 'a mock game to test flip'
        };

        it('renders a flip', function () {
            const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
            expect(WRAPPER.instance()).to.be.instanceOf(MockFlipWrapper);
        });

        it('has flip contents', function () {
            const WRAPPER = shallow(<MockFlipWrapper item={item}/>);
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('a')).to.have.length(1);
            expect(WRAPPER.find('.play')).to.have.length(1);
            expect(WRAPPER.find('.coming-soon')).to.have.length(1);
            expect(WRAPPER.find('img')).to.have.length(1);
        });

        it('responds to click', function () {
            const WRAPPER = mount(<MockFlipWrapper item={item}/>);
            expect(WRAPPER.prop('clicked')).to.equal(null);
            WRAPPER.find('a').simulate('click');
            expect(WRAPPER.prop('clicked')).to.equal(GLOBALS.GAME_URL + '0/index.html');
        });

        it('renders for coming soon', function () {
            item.coming_soon = true; // eslint-disable-line camelcase
            const WRAPPER = mount(<MockFlipWrapper item={item}/>);
            expect(WRAPPER.find('.play').text()).to.equal(COMING_SOON);
            expect(WRAPPER.prop('clicked')).to.equal(null);
            WRAPPER.find('a').simulate('click');
            expect(WRAPPER.prop('clicked')).to.equal(null);
        });
    });

    /* eslint-disable camelcase */
    describe('data transform method for game wrapper', function () {
        it('handles null input', function () {
            expect(dataTransform(null)).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles undefined input', function () {
            expect(dataTransform(null)).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles empty list', function () {
            expect(dataTransform([])).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles non array', function () {
            expect(dataTransform({})).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles nonsense', function () {
            expect(dataTransform('cat dog!!!!')).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles one element', function () {
            var data = [{id: 0, coming_soon: false}];
            var result = dataTransform(data);
            expect(result).to.be.an.instanceof(Array);
            expect(result).to.have.lengthOf(1);
        });

        it('handles even number of elements', function () {
            var data = [
                {id: 0, coming_soon: false},
                {id: 1, coming_soon: false},
                {id: 2, coming_soon: false},
                {id: 3, coming_soon: false}
            ];

            var result = dataTransform(data);

            expect(result).to.be.an.instanceof(Array);
            expect(result).to.have.lengthOf(4);
        });

        it('handles odd number of elements', function () {
            var data = [
                {id: 0, coming_soon: false},
                {id: 1, coming_soon: false},
                {id: 2, coming_soon: false},
                {id: 3, coming_soon: false},
                {id: 4, coming_soon: false}
            ];

            var result = dataTransform(data);

            expect(result).to.be.an.instanceof(Array);
            expect(result).to.have.lengthOf(5);
        });

        it('handles separating coming soon', function () {
            var data = [
                {id: 0, coming_soon: false},
                {id: 1, coming_soon: false},
                {id: 2, coming_soon: true},
                {id: 3, coming_soon: false},
                {id: 4, coming_soon: false}
            ];

            var result = dataTransform(data);

            expect(result).to.be.an.instanceof(Array);
            expect(result).to.have.lengthOf(5);
            expect(result[4].id).to.equal(2);
        });
    });
    /* eslint-disable camelcase */
});
