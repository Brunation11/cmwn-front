import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProviderWrapper from 'smoke_tests/provider_wrapper';

import { SchoolView } from 'routes/schools/view';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/view';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';
import classesInSchool from 'mocks/classes/classes_in_school';
import usersInSchool from 'mocks/users/users_in_school';

var createWrapper = function (data) {
    var view = <SchoolView data={data} loading={false} />;
    const WRAPPER = mount(<ProviderWrapper route={view} />);
    return WRAPPER;
};

var checkAdminContents = function (WRAPPER) {
    expect(WRAPPER.find(`.${PAGE_UNIQUE_IDENTIFIER}`)).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(3);
    expect(WRAPPER.find('#buttons')).to.have.length(1);
    expect(WRAPPER.find('#school-return-profile')).to.have.length(1)
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    expect(WRAPPER.find('.school-district').find('Link')).to.have.length(1);
    expect(WRAPPER.find('#school-view-classes')).to.have.length(1);
    expect(WRAPPER.find('#school-view-users')).to.have.length(1);
    // TODO: figure out how to test for components wrapped in generateDataSource 7/20/16 AIM
    //expect(WRAPPER.find('.school-classes')).to.have.length(1);
    //expect(WRAPPER.find('.school-users')).to.have.length(1);
};

var checkNoSuperUserContents = function (WRAPPER) {
    expect(WRAPPER.find('EditLink')).to.have.length(1);
    expect(WRAPPER.contains('.green')).to.equal(false);
    expect(WRAPPER.find('.purple')).to.have.length(1);
};

var checkSuperUserContents = function (WRAPPER) {
    expect(WRAPPER.find('EditLink')).to.have.length(2);
    expect(WRAPPER.find('.green')).to.have.length(1);
    expect(WRAPPER.find('.purple')).to.have.length(2);
};

var viewSmokeTests = function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should return null', function () {
            expect(WRAPPER.find('SchoolView').children()).to.have.length(0);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should return null', function () {
            expect(WRAPPER.find('SchoolView').children()).to.have.length(0);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        it('should load with admin permissions', function () {
            checkAdminContents(WRAPPER);           
        });
        it('should not load the import or delete buttons', function () {
            checkNoSuperUserContents(WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        it('should load with superuser permissions', function () {
            checkAdminContents(WRAPPER);           
            checkSuperUserContents(WRAPPER);
        });
    });
};

export default viewSmokeTests;
