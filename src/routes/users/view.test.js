import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ProfileView } from 'routes/users/view';
import viewSmoke from 'smoke_tests/users/view.test.js';

import studentDataB from 'mocks/users/student_data_b';

describe('Profile View Smoke Tests', function () {
    viewSmoke();
});

describe('Profile View Unit Tests', function () {
    //TODO: testing for suspend account when test mode for HttpManager set up. LB 06/22/16

    describe('Viewing student with permission', function () {
        var view = <ProfileView data={studentDataB} loading={false} />;
        const WRAPPER = shallow(view);

        it('renders the profile view', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(ProfileView);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('Panel')).to.have.length(1);
            expect(WRAPPER.find('div')).to.have.length(2);
            expect(WRAPPER.find('EditLink')).to.have.length(1);

        });
    });

    describe('Viewing with null username', function () {
        it('renders a null profile view', function () {
            var view = <ProfileView data={{username: null}} loading={false} />;

            const WRAPPER = shallow(view);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('Viewing student without permission', function () {
        it('renders a null profile view', function () {
            var view = <ProfileView data={{username: 'bob', scope: 0}} loading={false} />;

            const WRAPPER = shallow(view);
            expect(WRAPPER.type()).to.equal(null);
        });
    });
});
