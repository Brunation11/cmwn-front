import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Page, ChangePassword } from 'routes/change_password';
import Layout from 'layouts/one_col';

import studentDataA from 'mocks/users/student_data_a';
import teacherData from 'mocks/users/teacher_data';

// TODO: Waiting on test mode for HttpManager to test submit button and components using mount. WL 07/15/16

export default function () {
    describe('Checks <Page /> using mount', function () {
        var page = <Page currentUser={studentDataA} data={studentDataA} loading={false}/>;
        /*
        const WRAPPER = mount(page);

        it('renders the component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(Page);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(2);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('ChangePassword')).to.have.length(1);
        });

        it('has the correct layout contents', function () {
            const LAYOUT = WRAPPER.find('Layout');
            expect(LAYOUT.children()).to.have.length(2);
            expect(LAYOUT.find('div')).to.have.length(4);
            expect(LAYOUT.find('Footer')).to.have.length(1);
        });
        */
    });
    /*
    describe('Checks <ChangePassword /> using mount', function () {
        var changePass = <ChangePassword currentUser={studentDataA} data={studentDataA} loading={false}/>;
        /*const WRAPPER = mount(changePass);

        it('renders the component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(ChangePassword);
        });

        it('has the correct elements', function () {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Panel')).to.have.length(1);
            expect(WRAPPER.find('form')).to.have.length(1);
            expect(WRAPPER.find('Input')).to.have.length(2);
            expect(WRAPPER.find('Button')).to.have.length(1);
        });
    });
    */
}
