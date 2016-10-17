import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import changePassSmoke from 'smoke_tests/change_password.test.js';
import { UpdatePassword } from 'routes/change_password';

import studentDataA from 'mocks/users/student_data_a';

describe('<UpdatePassword />', function () {
    describe('Checks changepass page', function () {
        var updatePassword = <UpdatePassword currentUser={studentDataA} data={studentDataA} loading={false} />;
        const WRAPPER = shallow(updatePassword);

        describe('ChangePassword Smoke Tests', function () {
            changePassSmoke();
        });

        it('renders the component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(UpdatePassword);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('form')).to.have.length(1);
            expect(WRAPPER.find('Input')).to.have.length(3);
            expect(WRAPPER.find('Button')).to.have.length(1);
        });
    });
});
