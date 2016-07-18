import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import cheerio from 'cheerio';

import { SchoolEdit } from 'routes/schools/edit';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/edit';
import { BulkUpload } from 'routes/schools/edit';
import { ERRORS } from 'routes/schools/edit';
import { SUCCESS } from 'routes/schools/edit';

import MockFunctionWrapper from 'mocks/mock_function_wrapper';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

import editSmokeTests from 'smoke_tests/schools/edit.test';

var createWrapper = function (data) {
    var edit = <SchoolEdit data={data} loading={false} />;
    const WRAPPER = shallow(edit);
    if(WRAPPER.type() == null) {
        return null;
    }
    expect(WRAPPER.instance()).to.be.instanceOf(SchoolEdit);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    return WRAPPER;
};

var checkSchoolEditContent = function (WRAPPER) {
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Input')).to.have.length(2);
    expect(WRAPPER.find('Button')).to.have.length(1);
    expect(WRAPPER.find('#school-return-dash')).to.have.length(1);
    expect(WRAPPER.find('#school-edit-name')).to.have.length(1);
    expect(WRAPPER.find('#school-edit-description')).to.have.length(1);
};

var checkSchoolImportContent = function (WRAPPER, UPLOAD_WRAPPER) {
    expect(WRAPPER.find('BulkUpload')).to.have.length(1);
    expect(UPLOAD_WRAPPER.instance()).to.be.instanceof(BulkUpload);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Form')).to.have.length(1);
    expect(UPLOAD_WRAPPER.find('Input')).to.have.length(4);
    expect(UPLOAD_WRAPPER.find('Button')).to.have.length(1);
};

var checkNoImportContent = function (WRAPPER, UPLOAD_WRAPPER) {
    expect(WRAPPER.contains('BulkUpload')).to.equal(false);
    expect(UPLOAD_WRAPPER.type()).to.equal(null);
};

var tryImport = function(UPLOAD_WRAPPER, student, teacher, tos, file) {
    student = student ? student : '';
    teacher = teacher ? teacher : '';
    tos = tos ? tos : false;
    UPLOAD_WRAPPER.setState({
        studentCode: student,
        teacherCode: teacher,
        tos: tos
    });
    if (file) {
        UPLOAD_WRAPPER.find('[accept=".xlsx"]').render().val('example.xlsx');
        console.log('EDIT PROBLEM BEFORE: ' + UPLOAD_WRAPPER.find('[accept=".xlsx"]').html());
        //UPLOAD_WRAPPER.find('[accept=".xlsx"]').simulate('change',
        //    { target: { value: 'example.xlsx' }
        //});
    }
    UPLOAD_WRAPPER.update();
    console.log('EDIT PROBLEM AFTER: ' + UPLOAD_WRAPPER.find('[accept=".xlsx"]').html());
    var e = new Event('dummy');
    var result = UPLOAD_WRAPPER.instance().checkForm(e);
    return result;
};

// TODO: write tests for createClass once it's implemented 7/18/16 AIM
describe('school edit unit tests', function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should render null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should render null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        const UPLOAD_WRAPPER = shallow(<BulkUpload data={schoolTeacherData} />);
        it('should render school edit and no import content', function () {
            expect(WRAPPER.children()).to.have.length(1);
            checkSchoolEditContent(WRAPPER);
            checkNoImportContent(WRAPPER, UPLOAD_WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        const UPLOAD_WRAPPER = shallow(<BulkUpload data={schoolPrincipalData} 
            url={schoolPrincipalData._links.import.href} />);
        it('should render school edit and import content', function () {
            expect(WRAPPER.children()).to.have.length(2);
            checkSchoolEditContent(WRAPPER);
            checkSchoolImportContent(WRAPPER, UPLOAD_WRAPPER);
        });
        const UPLOAD_WRAPPER_M = mount(<BulkUpload data={schoolPrincipalData} />);
        // need to mount in order for form refs to work
        describe('school import submission tests', function () {
            it('should error with no codes and no check', function () {
                var result = tryImport(UPLOAD_WRAPPER_M);
                expect(result).to.equal(ERRORS.NOT_FILLED);
            });
            it('should error with no teacher code and no check', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdf');
                expect(result).to.equal(ERRORS.NOT_FILLED);
            });
            it('should error with no student code and no check', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, undefined, 'qwer');
                expect(result).to.equal(ERRORS.NOT_FILLED);
            });
            it('should error with no check', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdf', 'qwer');
                expect(result).to.equal(ERRORS.NO_AGREE);
            });
            it('should error with identical codes', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdf', 'qwer', true);
                expect(result).to.equal(ERRORS.SAME_CODES);
            });
            it('should error with short teacher code', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdf', 'qwertyui', true);
                expect(result).to.equal(ERRORS.PASSW_REQ);
            });
            it('should error with short student code', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdfghjk', 'qwer', true);
                expect(result).to.equal(ERRORS.PASSW_REQ);
            });
            it('should error with no symbols/numbers in teacher code', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdfghjk', 'qwertyu1', true);
                expect(result).to.equal(ERRORS.PASSW_REQ);
            });
            it('should error with no symbols/numbers in student code', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdfghj1', 'qwertyui', true);
                expect(result).to.equal(ERRORS.PASSW_REQ);
            });
            it('should error with no file uploaded', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdfghj1', 'qwertyu1', true);
                expect(result).to.equal(ERRORS.NO_FILE);
            });
            it('should pass all checks correct codes, check, and file', function () {
                var result = tryImport(UPLOAD_WRAPPER_M, 'asdfghj1', 'qwertyu1', true, true);
                expect(result).to.equal(SUCCESS.IMPORT);
            });
        });
    });
    describe('smoke tests', function () {
        editSmokeTests();
    });
});
