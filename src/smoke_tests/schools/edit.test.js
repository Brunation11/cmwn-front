import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SchoolEdit } from 'routes/schools/edit';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/edit';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

var createWrapper = function (data) {
    var edit = <SchoolEdit data={data} loading={false} />;
    const WRAPPER = mount(edit);
    if(WRAPPER.children().length === 0) {
        return null;
    }
    expect(WRAPPER.instance()).to.be.instanceof(SchoolEdit);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    return WRAPPER;
};

var checkSchoolEdit = function (WRAPPER) {
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Link')).to.have.length(1);
    expect(WRAPPER.find('Input')).to.have.length(2);
    expect(WRAPPER.find('Button')).to.have.length(1);
};

var checkNoImport = function (WRAPPER, UPLOAD_WRAPPER) {
    expect(WRAPPER.contains('BulkUpload')).to.equal(false);
    expect(UPLOAD_WRAPPER.type()).to.equal(null);
};

var checkForImport = function (WRAPPER) {
    expect(WRAPPER.find('BulkUpload')).to.have.length(1);
    expect(UPLOAD_WRAPPER.instance()).to.be.instanceof(BulkUpload);
    expect(UPLOAD_WRAPPER.find('Panel')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('[name="dummyframe"]')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('[type="hidden"]')).to.have.length(4);
    expect(UPLOAD_WRAPPER.find('Form')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Input')).to.have.length(3);
    expect(UPLOAD_WRAPPER.find('Button')).to.have.length(1);
};

var editSmokeTests = function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should return null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should return null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        const UPLOAD_WRAPPER = createWrapper(schoolTeacherData);
        it('should load the school title and description edit', function () {
            checkSchoolEdit(WRAPPER);
        });
        it('should not load the school import form', function () {
            checkNoImport(WRAPPER, UPLOAD_WRAPPER);
        });
    });
    describe('when viewed by a superuserpage', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        const UPLOAD_WRAPPER = createWrapper(schoolPrincipalData);
        it('should load all school edit features', function () {
            checkSchoolEdit(WRAPPER);
            checkForImport(WRAPPER, UPLOADWRAPPER);
        });
    });
};

export default editSmokeTests;
