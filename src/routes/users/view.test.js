import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { ProfileView } from 'routes/users/view';
import viewSmoke from 'smoke_tests/users/view.test.js';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';

describe('Profile View Smoke Tests', function() {
   viewSmoke(); 
});

describe('Profile View Unit Tests', function() {
    
    //TODO: testing for suspend account when test mode for HttpManager set up. LB 06/22/16

    describe("Viewing student with permission", function() {
        var view = <ProfileView data={studentDataB} loading={false} />;
        const wrapper = shallow(view);
        
        it('renders the profile view', function() {
            expect(wrapper.instance()).to.be.instanceOf(ProfileView);
        });
        
        it('has the correct elements', function() {
            expect(wrapper.children()).to.have.length(1);
            expect(wrapper.find('Layout')).to.have.length(1);
            expect(wrapper.find('Panel')).to.have.length(1);
            expect(wrapper.find('div')).to.have.length(2);
            expect(wrapper.find('EditLink')).to.have.length(1);

        });
    });
       
    describe("Viewing with null username", function() {
        it('renders a null profile view', function() {
            var view = <ProfileView data={{username: null}} loading={false} />;
            
            const wrapper = shallow(view);
            expect(wrapper.type()).to.equal(null);
        });
    });
    
    describe("Viewing student without permission", function() {
        it('renders a null profile view', function() {
            var view = <ProfileView data={{username: "bob", scope: 0}} loading={false} />;

            const wrapper = shallow(view);
            expect(wrapper.type()).to.equal(null);
        });
    });    
});