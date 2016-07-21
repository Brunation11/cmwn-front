import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Schools } from 'routes/schools';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools';

import MockFunctionWrapper from 'mocks/mock_function_wrapper';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

//import profileSmokeTests from 'smoke_tests/schools.test'

var createWrapper = function (data) {
    var schools = <Schools data={data} loading={false} />;
    const WRAPPER = shallow(schools);
    return WRAPPER;
};

var createFlipWrapper= function (data) {
    const ITEM = {
        group_id: data.group_id,
        title: data.title
    };
    var flip = <MockFunctionWrapper item={ITEM} render={Schools.prototype.renderFlip} />
    const FLIPWRAPPER = shallow(flip);
    return FLIPWRAPPER;
};
    

var checkContents = function (WRAPPER, FLIPWRAPPER) {
    expect(WRAPPER.instance()).to.be.instanceOf(Schools);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Flipboard')).to.have.length(1);
    expect(FLIPWRAPPER.find('.flip')).to.have.length(1);
    expect(FLIPWRAPPER.find('a')).to.have.length(1);
    expect(FLIPWRAPPER.find('img')).to.have.length(1);
    expect(FLIPWRAPPER.find('p')).to.have.length(1);
};

describe('schools route test', function () {
    describe('when viewed by a student', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(schoolStudentData);
            const FLIPWRAPPER = createFlipWrapper(schoolStudentData);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
    describe('when viewed by a teacher', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(schoolTeacherData);
            const FLIPWRAPPER = createFlipWrapper(schoolTeacherData);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
    describe('when viewed by a super user', function () {
        it('should display a list of schools', function () {
            const WRAPPER = createWrapper(schoolPrincipalData);
            const FLIPWRAPPER = createFlipWrapper(schoolPrincipalData);
            checkContents(WRAPPER, FLIPWRAPPER);
        });
    });
});
