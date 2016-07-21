import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ProviderWrapper from 'smoke_tests/provider_wrapper';

import { SchoolEdit } from 'routes/schools/edit';
import { BulkUpload } from 'routes/schools/edit';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/edit';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

var createWrapper = function (data) {
    var edit = <SchoolEdit data={data} loading={false} />;
    const WRAPPER = mount(<ProviderWrapper route={edit} />);
    return WRAPPER;
};

var createUploadWrapper = function (data) {
    var upload = <BulkUpload data={data} />;
    const UPLOAD_WRAPPER = mount(<ProviderWrapper route={upload} />);
    return UPLOAD_WRAPPER;
};

var checkTeacher = function (WRAPPER, UPLOAD_WRAPPER) {
    expect(WRAPPER.find(`.${PAGE_UNIQUE_IDENTIFIER}`)).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Link')).to.have.length(1);
    expect(WRAPPER.find('Input')).to.have.length(2);
    expect(WRAPPER.find('Button')).to.have.length(1);
    expect(WRAPPER.contains('BulkUpload')).to.equal(false);
    expect(UPLOAD_WRAPPER.find('BulkUpload').children()).to.have.length(0);
};

var checkSuperUser = function (WRAPPER, UPLOAD_WRAPPER) {
    expect(WRAPPER.find(`.${PAGE_UNIQUE_IDENTIFIER}`)).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(2);
    expect(WRAPPER.find('Link')).to.have.length(1);
    expect(WRAPPER.find('Input')).to.have.length(4);
    expect(WRAPPER.find('ValidatedInput')).to.have.length(2);
    expect(WRAPPER.find('Button')).to.have.length(2);
    expect(WRAPPER.find('BulkUpload')).to.have.length(1);
    expect(WRAPPER.find('iframe')).to.have.length(1);
    expect(WRAPPER.find('Form')).to.have.length(1);
    expect(WRAPPER.find('[type="hidden"]')).to.have.length(4);
    expect(WRAPPER.find('Static')).to.have.length(1);

    expect(UPLOAD_WRAPPER.find('BulkUpload')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Panel')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('iframe')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Form')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('[type="hidden"]')).to.have.length(4);
    expect(UPLOAD_WRAPPER.find('Static')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Input')).to.have.length(2);
    expect(UPLOAD_WRAPPER.find('ValidatedInput')).to.have.length(2);
    expect(UPLOAD_WRAPPER.find('Static')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Button')).to.have.length(1);
};

var editSmokeTests = function () {
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
        const UPLOAD_WRAPPER = createUploadWrapper(schoolTeacherData);
        it('should load only the school title and description edit', function () {
            checkTeacher(WRAPPER, UPLOAD_WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        const UPLOAD_WRAPPER = createUploadWrapper(schoolPrincipalData);
        it('should load all school edit features', function () {
            checkSuperUser(WRAPPER, UPLOAD_WRAPPER);
        });
    });
};

export default editSmokeTests;
