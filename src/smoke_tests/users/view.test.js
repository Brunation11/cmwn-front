import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { ProfileView } from 'routes/users/view';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';

//TODO: lifecycle methods when mounting set up with unconnected components. LB 06/22/16

export default function () {
    describe('Viewing student with permission', function () {
        var view = <ProfileView data={studentDataB} loading={false} />;
        //const WRAPPER = mount(view);

        it('renders the profile view', function () {
            //expect(WRAPPER.instance()).to.be.instanceOf(ProfileView);
        });

        it('has the correct elements', function () {
            /*
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('Panel')).to.have.length(1);
            expect(WRAPPER.find('div')).to.have.length(2);
            expect(WRAPPER.find('EditLink')).to.have.length(1);*/
            // TODO: Add in checks for relevant sub components. LB 06/29/16.

        });
    });

    describe('Viewing with null username', function () {
        it('renders a null profile view', function () {
            var view = <ProfileView data={{username: null}} loading={false} />;

            //const WRAPPER = mount(view);
            //expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('Viewing student without permission', function () {
        it('renders a null profile view', function () {
            var view = <ProfileView data={{username: 'bob', scope: 0}} loading={false} />;

            //const WRAPPER = mount(view);
            //expect(WRAPPER.type()).to.equal(null);
        });
    });
}
