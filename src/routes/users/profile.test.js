import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';
import { dataTransform, BAD_TRANSFORM_TYPE } from 'routes/users/profile';
import MockFlipWrapper from 'mocks/mock_flip_wrapper';
import GLOBALS from 'components/globals';
import profileSmoke from 'smoke_tests/users/profile.test.js';

import studentDataA from 'mocks/users/student_data_a';

const COMING_SOON = 'Coming Soon!';

describe('Profile Smoke Tests', function () {
    profileSmoke();
});

describe('Profile Unit Tests', function () {
    // TODO: test show modal when set up mock Detector and History set up. LB 06/22/16

    describe('Null profile viewing', function () {
        it('renders null profile with null username', function () {
            var profile = <Profile data={{username: null}} loading={false} currentUser={studentDataA}/>;
            const WRAPPER = shallow(profile);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('render a flip', function () {
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
            expect(dataTransform()).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles empty list', function () {
            expect(dataTransform([])).to.be.an.instanceof(Array).and.to.be.empty;
        });

        it('handles non array', function () {
            expect(dataTransform.bind(null, {})).to.throw(BAD_TRANSFORM_TYPE);
        });

        it('handles nonsense', function () {
            expect(dataTransform.bind(null, 'cat dog!!!!')).to.throw(BAD_TRANSFORM_TYPE);
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
    /* eslint-enable camelcase */
});
