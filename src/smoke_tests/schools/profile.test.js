import React from 'react';
import { Provider } from 'react-redux';
import Store from 'components/store';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { SchoolProfile } from 'routes/schools/profile';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/schools/profile';

import schoolStudentData from 'mocks/schools/school_student_data';
import schoolTeacherData from 'mocks/schools/school_teacher_data';
import schoolPrincipalData from 'mocks/schools/school_principal_data';

// need this while components still reference store
class ProviderWrapper extends React.Component {
    render() {
        return (
            <Provider store={Store}>
                <SchoolProfile data={this.props.data} loading={false} />
            </Provider>
        );
    }
}

var createWrapper = function (data) {
    const WRAPPER = mount(<ProviderWrapper data={data} />);
    if(WRAPPER.find('SchoolProfile').children().length === 0) {
        return null;
    }
    expect(WRAPPER.find('SchoolProfile').hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    return WRAPPER;
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

var profileSmokeTests = function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should return null', function () {
            expect(WRAPPER).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(schoolStudentData);
        it('should load components with no permissions', function () {
            checkBasicComponents(WRAPPER);
        });
    });
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(schoolTeacherData);
        it('should load components with admin permissions', function () {
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
        });
    });
    describe('when viewed by a superuser', function () {
        const WRAPPER = createWrapper(schoolPrincipalData);
        it('should load components with all permissions', function () {
            checkBasicComponents(WRAPPER);
            checkAdminComponents(WRAPPER);
            checkSuperUserComponents(WRAPPER);
        });
    });
};

export default profileSmokeTests;
