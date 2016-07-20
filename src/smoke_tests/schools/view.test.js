import React from 'react';
import { Provider } from 'react-redux';
import Store from 'components/store';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SchoolView } from 'routes/schools/view';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/view';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';
import classesInSchool from 'mocks/schools/classes_in_school';
import usersInSchool from 'mocks/schools/users_in_school';

// need this while components still reference store
class ProviderWrapper extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                <SchoolView data={this.props.data} loading={false} />
            </Provider>
        );
    }
}

var createWrapper = function (data) {
    const WRAPPER = mount(<ProviderWrapper data={data} />);
    if(WRAPPER.find('SchoolView').children().length === 0) {
        return null;
    }
    expect(WRAPPER.find('SchoolView').hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    return WRAPPER;
};

var checkAdminContents = function (WRAPPER) {
    expect(WRAPPER.find('Panel')).to.have.length(3);
    expect(WRAPPER.find('.right')).to.have.length(1);
    expect(WRAPPER.find('EditLink')).to.have.length(1);
    expect(WRAPPER.find('#school-return-profile')).to.have.length(1)
    expect(WRAPPER.find('.school-district')).to.have.length(1);
    expect(WRAPPER.find('#school-view-classes')).to.have.length(1);
    expect(WRAPPER.find('school-classes')).to.have.length(1);
    expect(WRAPPER.find('Column')).to.have.length(5);
    //var classes = classesinSchool._embedded.group.length;
    //console.log('CLASSES LENGTH ' + classes);
    //expect(WRAPPER.find('school-class-link')).to.have.length(classes + 1);
    //expect(WRAPPER.find('school-class-view')).to.have.length(classes + 1);
    //expect(WRAPPER.find('school-class-edit')).to.have.length(classes + 1);
    var users = usersInSchool._embedded.items.length;
    console.log('USERS LENGTH ' + users);
    expect(WRAPPER.find('school-user-link')).to.have.length(users + 1);
    expect(WRAPPER.find('school-user-view')).to.have.length(users + 1);
    expect(WRAPPER.find('school-user-edit')).to.have.length(users + 1);
};

var checkNoSuperUserContents = function (WRAPPER) {
    expect(WRAPPER.contains('.green')).to.equal(false);
    expect(WRAPPER.find('.purple')).to.have.length(1);
};

var checkSuperUserContents = function (WRAPPER) {
    expect(WRAPPER.find('.green')).to.have.length(1);
    expect(WRAPPER.find('.purple')).to.have.length(2);
};

var viewSmokeTests = function () {
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
        it('should load the school view page with admin permissions', function () {
            checkAdminContents(WRAPPER);           
        });
        it('should not load the import or delete buttons', function () {
            checkNoSuperUserContents(WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        const UPLOAD_WRAPPER = createWrapper(schoolPrincipalData);
        it('should load the school view page with superuser permissions', function () {
            checkAdminContents(WRAPPER);           
            checkSuperUserContents(WRAPPER);
        });
    });
};

export default viewSmokeTests;
