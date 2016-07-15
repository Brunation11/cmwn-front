import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SchoolProfile } from 'routes/schools/profile';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/profile';
import EditLink from 'components/edit_link';

import MockFunctionWrapper from 'mocks/mock_function_wrapper';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

var render = function (data) {
    var profile = <SchoolProfile data={data} loading={false} />;
    const WRAPPER = mount(profile);
    if(WRAPPER.type() == null) {
        return WRAPPER;
    }
    expect(WRAPPER.instance()).to.be.instanceof(SchoolProfile);
};

var checkBasicComponents = function (WRAPPER) {
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('.right')).to.have.length(1);
    expect(WRAPPER.find('.school-districts')).to.have.length(1);
    expect(WRAPPER.find('FlipBoard')).to.have.length(1);
};

var checkAdminComponents = function (WRAPPER) {
    expect(WRAPPER.find('.purple')).to.have.length(1);
    expect(WRAPPER.find('.school-admin-link')).to.have.length(1);
};

var checkSuperUserComponents = function (WRAPPER) {
    expect(WRAPPER.find('.green')).to.have.length(1);
};

export default function () {
    describe('student viewing school profile', function () {
        it('should load components with no permissions', function () {
            const WRAPPER = render(schoolStudentData);
            checkBasicComponents(WRAPPER);
        });
    describe('teacher viewing school profile', function () {
        it('should load components with admin permissions', function () {
            const WRAPPER = render(schoolTeacherData);
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
        });
    });
    describe('superuser viewing school profile', function () {
        it('should load components with all permissions', function () {
            const WRAPPER = render(schoolPrincipalData);
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
            checkSuperUserComponents(WRAPPER);
        }):
    });
};
