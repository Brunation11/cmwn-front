import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Profile } from 'routes/users/profile';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';

// TODO: File needs to be fully implemented & tested when refactored for mounting. LB 06/29/16.
// TODO: lifecycle methods when mounting set up with unconnected components.  LB 06/21/16.

var checkProfileRender = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    //const WRAPPER = mount(profile);
    //expect(WRAPPER.instance()).to.be.instanceOf(Profile);
};

var checkOwnProfileContent = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    /*const WRAPPER = mount(profile);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.children('div')).to.have.length(1);
    expect(WRAPPER.find('Modal')).to.have.length(1);
    expect(WRAPPER.find('Trophycase')).to.have.length(1);
    expect(WRAPPER.find('FlipBoard')).to.have.length(1);*/
    // TODO: Add in checks for relevant sub components like gamewrapper. LB 06/29/16.
};

var checkAnotherProfileContent = function (data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    /*const WRAPPER = mount(profile);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('.frame')).to.have.length(1);
    expect(WRAPPER.find('.user-metadata').children()).to.have.length(8);*/
    // TODO: Add in checks for relevant sub components like profile image. LB 06/29/16.
};

export default function () {

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
            //const WRAPPER = mount(profile);
            //expect(WRAPPER.type()).to.equal(null);
        });
    });
}
