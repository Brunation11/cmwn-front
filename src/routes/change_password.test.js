import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { ChangePassword } from 'routes/change_password';
import { isPassValid } from 'routes/change_password';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';

var checkCorrectElements = function(WRAPPER) {
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('form')).to.have.length(1);
    expect(WRAPPER.find('Input')).to.have.length(2);
    expect(WRAPPER.find('Button')).to.have.length(1);
}

var checkChangingPass = function(WRAPPER) {
    var newInput = WRAPPER.find({name: 'newInput'});
    newInput.simulate('change', {target: {value: 'business5'}});
    expect(WRAPPER.state('new')).to.equal('business5');
    var confirmInput = WRAPPER.find({name: 'confirmInput'});
    confirmInput.simulate('change', {target: {value: 'business5'}});
    expect(WRAPPER.state('confirm')).to.equal('business5');
}

describe('<ChangePassword />', function() {
   describe('Teacher viewing changepass page', function() {
        var changePass = <ChangePassword currentUser={teacherData} data={teacherData} loading={false}/>; 
        const WRAPPER = shallow(changePass);
       
        it('renders the component', function() {              
            expect(WRAPPER.instance()).to.be.instanceOf(ChangePassword);
        }); 
       
       it('has the correct elements', function() {
           checkCorrectElements(WRAPPER);
       });
       
       it('updates state for changing password', function() {
            checkChangingPass(WRAPPER);
        });
    });
    
    describe('Student viewing changepass page', function() {
        var changePass = <ChangePassword currentUser={studentDataA} data={studentDataA} loading={false}/>; 
        const WRAPPER = shallow(changePass);
       
       it('renders the component', function() {              
            expect(WRAPPER.instance()).to.be.instanceOf(ChangePassword);
        }); 
       
       it('has the correct elements', function() {
           checkCorrectElements(WRAPPER);
        });
    
        it('updates state for changing password', function() {
            checkChangingPass(WRAPPER);
        });
    });
    
    describe('isPassValid method', function() {
        it('password is valid', function() {
            expect(isPassValid('business5')).to.not.equal(0);
        });
        
        it('password is not valid if too short', function() {
            expect(isPassValid('bus3')).to.equal(false); 
        });
        
        it('password is not valid if no number', function() {
            expect(isPassValid('business')).to.equal(0);
        });
    });

});