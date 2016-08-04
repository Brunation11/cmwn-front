import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Schools } from 'routes/schools';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools';

import MockFunctionWrapper from 'mocks/mock_function_wrapper';

import studentDataA from 'mocks/users/student_data_a';
import teacherData from 'mocks/users/teacher_data';
import principalData from 'mocks/users/principal_data';

import schoolsSmokeTests from 'smoke_tests/schools/schools.test';

var createWrapper = function (data) {
    var schools = <Schools data={data} loading={false} />;
    const WRAPPER = shallow(schools);
    return WRAPPER;
};

var createFlipWrapper= function (group_id, title) {
    const ITEM = {
        group_id,
        title
    };
    var flip = <MockFunctionWrapper item={ITEM} render={Schools.prototype.renderFlip} />
    const FLIPWRAPPER = shallow(flip);
    return FLIPWRAPPER;
};
    

var checkContents = function (WRAPPER, FLIPWRAPPER) {
    expect(WRAPPER.instance()).to.be.instanceof(Schools);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.find('Layout')).to.have.length(1);
   // expect(WRAPPER.find('Flipboard')).to.have.length(1);
    expect(FLIPWRAPPER.instance()).to.be.instanceof(MockFunctionWrapper);
    expect(FLIPWRAPPER.find('.flip')).to.have.length(1);
    expect(FLIPWRAPPER.find('a')).to.have.length(1);
    expect(FLIPWRAPPER.find('img')).to.have.length(1);
    expect(FLIPWRAPPER.find('p')).to.have.length(1);
};

describe('schools route test', function () {
    describe('smoke tests', function () {
        //schoolsSmokeTests();
    });
    describe('when viewed by a student', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(studentDataA);
            var school = studentDataA._embedded.groups[1];
            const FLIPWRAPPER = createFlipWrapper(school.group_id, school.title);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
    describe('when viewed by a teacher', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(teacherData);
            var school = teacherData._embedded.groups[1];
            const FLIPWRAPPER = createFlipWrapper(school.group_id, school.title);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
    describe('when viewed by a super user', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(principalData);
            var school = principalData._embedded.groups[2];
            const FLIPWRAPPER = createFlipWrapper(school.group_id, school.title);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
});
