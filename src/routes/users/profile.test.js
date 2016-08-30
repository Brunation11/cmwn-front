import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';
import { dataTransform } from 'routes/users/profile';
import MockFlipWrapper from 'mocks/mock_flip_wrapper';
import GLOBALS from 'components/globals';
import profileSmoke from 'smoke_tests/users/profile.test.js';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';

const COMING_SOON = 'Coming Soon!';

var checkProfileRender = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(profile);
    expect(WRAPPER.instance()).to.be.instanceOf(Profile);
};

var checkOwnProfileContent = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(profile);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.children('div')).to.have.length(1);
    expect(WRAPPER.find('Modal')).to.have.length(1);
    expect(WRAPPER.find('Trophycase')).to.have.length(1);
    expect(WRAPPER.find('FlipBoard')).to.have.length(1);
};

var checkAnotherProfileContent = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(profile);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Trophycase')).to.have.length(1);
};

describe('Profile Smoke Tests', function () {
    profileSmoke();
});

describe('Profile Unit Tests', function () {
    // TODO: test show modal when set up mock Detector and History set up. LB 06/22/16

    describe('Teacher viewing own Profile', function () {

        it('renders own teacher Profile', function () {
            checkProfileRender(teacherData, teacherData);
        });

        it('has all of the correct elements', function () {
            checkOwnProfileContent(teacherData, teacherData);
        });
    });

    describe('Student viewing own Profile', function () {
        it('renders own student Profile', function () {
            checkProfileRender(studentDataA, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkOwnProfileContent(studentDataA, studentDataA);
        });

    });

    describe('Teaching viewing student Profile', function () {
        it('renders student profile', function () {
            checkProfileRender(studentDataA, teacherData);
        });
        it ('has all of the correct elements', function () {
            checkAnotherProfileContent(studentDataA, teacherData);
        });
    });

    describe('Student viewing another student profile', function () {
        it('renders student profile', function () {
            checkProfileRender(studentDataB, studentDataA);
        });
        it ('has all of the correct elements', function () {
            checkAnotherProfileContent(studentDataB, studentDataA);
        });
    });

    describe('Student viewing teacher profile', function () {
        it('renders student profile', function () {
            checkProfileRender(teacherData, studentDataA);
        });

        it ('has all of the correct elements', function () {
            checkAnotherProfileContent(teacherData, studentDataA);
        });
    });

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
    /* eslint-enable camelcase */
});
