import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { SchoolProfile } from 'routes/schools/profile';
import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

var render = function (data) {
    var profile = <SchoolProfile data={data} loading={false}/>;
    const WRAPPER = shallow(profile);
    expect(WRAPPER.instance()).to.be.instanceOf(SchoolProfile);
    return WRAPPER;
};

var checkAllUserContent = function (WRAPPER, data) {
    console.log(WRAPPER.children());
    expect(WRAPPER.children()).to.have.length(2);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('.right')).to.have.length(1);
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    expect(WRAPPER.find('.flip')).to.have.length(1);
};

var checkAdminContent = function (WRAPPER) {
    expect(WRAPPER.find('.school-admin-link')).to.have.length(1);
    expect(WRAPPER.find('.purple')).to.have.length(1);
};

var checkSuperUserContent = function (WRAPPER) {
    expect(WRAPPER.find('.green')).to.have.length(1);
};
   

describe('school profile unit tests', function() {
    it('should render a school profile with student permissions', function () {
        const WRAPPER = render(schoolStudentData);
        console.log('THIS IS THE WRAPPER: ' + WRAPPER);
        checkAllUserContent(WRAPPER);
    });
    it('should render a school profile with teacher permissions', function () {
        const WRAPPER = render(schoolTeacherData);
        checkAllUserContent(WRAPPER);
        checkAdminContent(WRAPPER);
    }); 
    it('should render a school profile with superuser permissions', function () {
        const WRAPPER = render(schoolPrincipalData);
        checkAllUserContent(WRAPPER);
        checkAdminContent(WRAPPER);
        checkSuperUserContent(WRAPPER);
    });
});
