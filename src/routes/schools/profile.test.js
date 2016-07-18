import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { SchoolProfile } from 'routes/schools/profile';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/profile';

import MockFunctionWrapper from 'mocks/mock_function_wrapper';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

import profileSmokeTests from 'smoke_tests/schooles/profile.test';

var createWrapper = function (data) {
    var profile = <SchoolProfile data={data} loading={false} />;
    const WRAPPER = shallow(profile);
    if(WRAPPER.type() == null) {
        return null;
    }
    expect(WRAPPER.instance()).to.be.instanceOf(SchoolProfile);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    return WRAPPER;
};

var checkAllUserContent = function (WRAPPER) {
    expect(WRAPPER.children()).to.have.length(2);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('.right')).to.have.length(1);
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    const CLASS_ITEM = {
        group_id: '9ee15bf2-0288-11e6-8b6b-0800274f2cef', //eslint-disable-line camelcase
        title: 'Ginas Class A'
    };
    const MOCK_CLASS = shallow(<MockFunctionWrapper item={CLASS_ITEM}
        render={SchoolProfile.prototype.renderFlip}/>);
    expect(MOCK_CLASS.instance()).to.be.instanceOf(MockFunctionWrapper);
    expect(MOCK_CLASS.children()).to.have.length(1);
    expect(MOCK_CLASS.find('.flip')).to.have.length(1);
};

var checkAdminContent = function (WRAPPER) {
    expect(WRAPPER.find('.school-admin-link')).to.have.length(1);
    expect(WRAPPER.find('.purple')).to.have.length(1);
};

var checkSuperUserContent = function (WRAPPER, data) {
    const IMPORT_LINK = shallow(<MockFunctionWrapper render={SchoolProfile.prototype.renderImport} />);
    IMPORT_LINK.setState(data); // need state set to get a non-null result
    IMPORT_LINK.update();
    expect(IMPORT_LINK.instance()).to.be.instanceof(MockFunctionWrapper);
    expect(IMPORT_LINK.find('EditLink')).to.have.length(1);
};
   
describe('school profile unit tests', function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should render null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        it('should render a school profile with student permissions', function () {
            const WRAPPER = createWrapper(schoolStudentData);
            checkAllUserContent(WRAPPER);
        });
    });
    describe('when viewed by a teacher', function () {
        it('should render a school profile with teacher permissions', function () {
            const WRAPPER = createWrapper(schoolTeacherData);
            checkAllUserContent(WRAPPER);
            checkAdminContent(WRAPPER);
        }); 
    });
    describe('when viewed by a superuser', function () {
        it('should render a school profile with superuser permissions', function () {
            const WRAPPER = createWrapper(schoolPrincipalData);
            checkAllUserContent(WRAPPER);
            checkAdminContent(WRAPPER);
            checkSuperUserContent(WRAPPER, schoolPrincipalData);
        });
    });
    describe('smoke tests', function () {
        profileSmokeTests();
    });
});
