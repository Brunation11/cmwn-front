import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { LogoutPage } from 'routes/logout';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/logout';
import teacherData from 'mocks/users/teacher_data';

import logoutSmokeTest from 'smoke_tests/logout.test';

describe('logout page unit tests', function () {
    it('should load the logout page', function () {
        const WRAPPER = shallow(<LogoutPage currentUser={teacherData} />);
        expect(WRAPPER.instance()).to.be.instanceof(LogoutPage);
        expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
        expect(WRAPPER.find('div')).to.have.length(1);
        expect(WRAPPER.find('Loader')).to.have.length(1);
    });
    describe('smoke test', function () {
        logoutSmokeTest();
    });
});
