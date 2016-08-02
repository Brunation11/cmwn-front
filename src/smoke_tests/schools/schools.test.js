import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProviderWrapper from 'smoke_tests/provider_wrapper.js';

import { SchoolProfile } from 'routes/schools/profile';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/profile';

import studentDataA from 'mocks/users/student_data_a';
import teacherData from 'mocks/users/teacher_data';
import principalData from 'mocks/users/principal_data';

var createWrapper = function (data) {
    var schools = <Schools data={data} loading={false} />;
    const WRAPPER = mount(schools);
    return WRAPPER;
};

var checkContents = function (WRAPPER, data) {
    expect(WRAPPER.instance()).to.be.instanceOf(Schools);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Flipboard')).to.have.length(1);
    var schools = 0;
    for(var i = 0; i < data._embedded.groups.length; i++) {
        if(data._embedded.groups[i].type === 'school') {
            schools++;
        }
    }
    expect(WRAPPER.find('.flip')).to.have.length(schools);
    expect(WRAPPER.find('a')).to.have.length(school);
    expect(WRAPPER.find('img')).to.have.length(schools);
    expect(WRAPPER.find('p')).to.have.length(schools);
};

var schoolsSmokeTests = function () {
    describe('when viewed by a student', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(studentDataA);
            checkContents(WRAPPER, studentDataA);
        });
    });
    describe('when viewed by a teacher', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(teacherData);
            checkContents(WRAPPER, teacherData);
        });
    });
    describe('when viewed by a principal', function () {
        it('should load all schools', function () {
            const WRAPPER = createWrapper(principalData);
            checkContents(WRAPPER, principalData);
        });
    });
};

export default schoolsSmokeTests;
