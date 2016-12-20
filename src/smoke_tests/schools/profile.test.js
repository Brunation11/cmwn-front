import React from 'react';
import { expect, config } from 'chai';
import { mount } from 'enzyme';
import ProviderWrapper from 'smoke_tests/provider_wrapper.js';

import { SchoolProfile } from 'routes/schools/profile';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/profile';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

config.includeStack = true;

var createWrapper = function (data) {
    var school = <SchoolProfile data={data} loading={false} />;
    var provider = <ProviderWrapper route={school} />;
    const WRAPPER = mount(provider);
    return WRAPPER;
};

var checkBasicComponents = function (WRAPPER) {
    expect(WRAPPER.find(`.${PAGE_UNIQUE_IDENTIFIER}`)).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('.right')).to.have.length(1);
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    /** TODO MPR, 11/18/16: Figure out how to check for datasource success */
};

var checkAdminComponents = function (WRAPPER) {
    expect(WRAPPER.find('.content').find('.purple')).to.have.length(1);
    expect(WRAPPER.find('.school-admin-link')).to.have.length(1);
};

var checkSuperUserComponents = function (WRAPPER) {
    expect(WRAPPER.find('.green')).to.have.length(1);
};

var profileSmokeTests = function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should return null', function () {
            expect(WRAPPER.find('SchoolView').children()).to.have.length(0);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should load components with no permissions', function () {
            checkBasicComponents(WRAPPER);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        it('should load components with admin permissions', function () {
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        it('should load components with all permissions', function () {
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
            checkSuperUserComponents(WRAPPER);
        });
    });
};

export default profileSmokeTests;
