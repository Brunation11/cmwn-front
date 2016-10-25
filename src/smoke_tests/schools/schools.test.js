import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProviderWrapper from 'smoke_tests/provider_wrapper.js';

import { Schools } from 'routes/schools';

import studentData from 'mocks/schools/student_school_page';
import teacherData from 'mocks/schools/teacher_school_page';
import principalData from 'mocks/schools/principal_school_page';

var createWrapper = function (data) {
    var schools = <Schools data={data} loading={false} />;
    const WRAPPER = mount(<ProviderWrapper route={schools} />);
    return WRAPPER;
};

var checkContents = function (WRAPPER, data) {
    expect(WRAPPER.find('Schools')).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('FlipBoard')).to.have.length(1);
    expect(WRAPPER.find('.flip')).to.have.length(1);
    expect(WRAPPER.find('a')).to.have.length(4);
    expect(WRAPPER.find('img')).to.have.length(1);
    expect(WRAPPER.find('p')).to.have.length(1);
};

var schoolsSmokeTests = function () {
    describe('when viewed by a student', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(studentData._embedded.group);
            console.log('student wrapper');
            console.log(WRAPPER.debug());
            checkContents(WRAPPER, studentData._embedded.group);
        });
    });
    describe('when viewed by a teacher', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(teacherData._embedded.group);
            console.log('teacher wrapper');
            console.log(WRAPPER.debug());
            checkContents(WRAPPER, teacherData._embedded.group);
        });
    });
    describe('when viewed by a principal', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(principalData._embedded.group);
            console.log('principal wrapper');
            console.log(WRAPPER.debug());
            checkContents(WRAPPER, principalData._embedded.group);
        });
    });
};

export default schoolsSmokeTests;
