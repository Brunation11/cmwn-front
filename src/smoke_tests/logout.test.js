import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { LogoutPage } from 'routes/logout';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/logout';
import teacherData from 'mocks/users/teacher_data';

var logoutSmokeTest = function () {
    it('should load the logout page', function () {
        const WRAPPER = mount(<LogoutPage currentUser={teacherData} />);
        expect(WRAPPER.instance()).to.be.instanceof(LogoutPage);
        expect(WRAPPER.find(`.${PAGE_UNIQUE_IDENTIFIER}`)).have.length(1);
        expect(WRAPPER.find('.loader')).to.have.length(1);
    });
};

export default logoutSmokeTest;
