import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { SchoolView } from 'routes/schools/view';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/view';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

import viewSmokeTests from 'smoke_tests/schools/view.test';

var createWrapper = function (data) {
    var view = <SchoolView data={data} loading={false}/>;
    const WRAPPER = shallow(view);
    return WRAPPER;
};

var checkAdminContent = function (WRAPPER) {
    expect(WRAPPER.instance()).to.be.instanceOf(SchoolView);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.children()).to.have.length(3);
    expect(WRAPPER.find('Panel')).to.have.length(3);
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    expect(WRAPPER.find('.school-classes')).to.have.length(1);
    expect(WRAPPER.find('.school-users')).to.have.length(1);
};

var checkNoSuperUserContent = function (WRAPPER) {
    expect(WRAPPER.find('.purple')).to.have.length(1);
    expect(WRAPPER.contains('.green')).to.equal(false);
};

var checkSuperUserContent = function (WRAPPER) {
    expect(WRAPPER.find('.purple')).to.have.length(2);
    expect(WRAPPER.find('.green')).to.have.length(1);
};

describe('school view unit tests', function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should render null', function () {
            expect(WRAPPER.type()).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should render null', function () {
            expect(WRAPPER.type()).to.equal(null);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        it('should render a school view page', function () {
            checkAdminContent(WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        it('should render a school view page', function () {
            checkAdminContent(WRAPPER);
            checkSuperUserContent(WRAPPER);
        });
    });
    describe('smoke tests', function () {
        viewSmokeTests();
    });
});
