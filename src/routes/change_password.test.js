import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { ChangePassword } from 'routes/change_password';

import teacherData from 'mocks/users/teacher_data';
/*
describe('<Page />', function() {
   describe('Check Page', function() {
       var Page = <Page />;
       const WRAPPER = shallow(Page);
       const CHANGE_COPY = `You are required to change your password before using ChangeMyWorldNow.com.
        Please update your password using the form below to proceed.`;
       
       it('renders the component', function() {
          expect(WRAPPER.instance().to.be.instanceOf(Page)); 
       });
       
       it('has the correct elements', function() {
           expect(WRAPPER.children()).to.have.length(1);
           expect(WRAPPER.find('Layout')).to.have.length(1);
           expect(WRAPPER.find('Layout').text()).to.equal(CHANGE_COPY);
           expect(WRAPPER.find('ChangePassword')).to.have.length(1);
       });
   });
});
*/
describe('<ChangePassword />', function() {
   describe('Check changepass page', function() {
        var changePass = <ChangePassword currentUser={teacherData}/>; 
        const WRAPPER = shallow(changePass);
       
        it('renders the component', function() {              
            expect(WRAPPER.instance()).to.be.instanceOf(ChangePassword);
        }); 
       
       it('has the correct elements', function() {
           expect(WRAPPER.children()).to.have.length(1);
           expect(WRAPPER.find('Panel')).to.have.length(1);
           expect(WRAPPER.find('form')).to.have.length(1);
           expect(WRAPPER.find('Input')).to.have.length(3);
           expect(WRAPPER.find('Button')).to.have.length(1);
       });
    });
    
    describe('Attempting to change password', function() {
        var changePass = <ChangePassword currentUser={teacherData} data={teacherData} loading={false}/>; 
        const WRAPPER = shallow(changePass);
       
        it('updates state for changing password ', function() {
           var currentInput = WRAPPER.find({name: 'currentInput'});
           console.log('Password: ');
            console.log(data.username);
            expect(WRAPPER.state('current')).to.equal('business2');
           var newInput = WRAPPER.find({name: 'newInput'});
           newInput.value = 'business5';
           // newInput.simulate('change', {target: {value: 'business5'}});
           var confirmInput = WRAPPER.find({name: 'confirmInput'});
           confirmInput.value = 'business5';
           WRAPPER.find('Button').simulate('click');
           expect(WRAPPER.state('current')).to.equal('business5');
       }); 
        
        it('doesnt update state if new and confirm password are different', function() {
            var currentInput = WRAPPER.find({name: 'currentInput'});
            expect(WRAPPER.state('current')).to.equal('business2');
            var newInput = WRAPPER.find({name: 'newInput'});
            newInput.value = 'business5';
            var confirmInput = WRAPPER.find({name: 'confirmInput'});
            confirmInput.value = 'business2';
            WRAPPER.find('Button').simulate('click');
            expect(WRAPPER.state('current')).to.equal(/*...*/);
        });
    });

});