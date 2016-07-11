import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { ChangePassword } from 'routes/change_password';
import { Page } from 'routes/change_password';
import { isPassValid } from 'routes/change_password';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';

describe('<Page />', function() {
    describe('Viewing Page', function() {
        var page = <Page currentUser={studentDataA} data={studentDataA} loading={false}/>;
        const WRAPPER = shallow(page);
        
        it('renders the component', function() {
            expect(WRAPPER.instance()).to.be.instanceOf(Page);
        });
        
        it('has the correct elements', function() {
            expect(WRAPPER.children()).to.have.length(2);
            expect(WRAPPER.find('Layout')).to.have.length(1);
            expect(WRAPPER.find('ChangePassword')).to.have.length(1);
        });
    });
});

describe('<ChangePassword />', function() { 
    describe('Viewing changepass page', function() {
        var changePass = <ChangePassword currentUser={studentDataA} data={studentDataA} loading={false}/>; 
        const WRAPPER = shallow(changePass);
       
       it('renders the component', function() {              
            expect(WRAPPER.instance()).to.be.instanceOf(ChangePassword);
        }); 
       
       it('has the correct elements', function() {
            expect(WRAPPER.children()).to.have.length(1);
            expect(WRAPPER.find('Panel')).to.have.length(1);
            expect(WRAPPER.find('form')).to.have.length(1);
            expect(WRAPPER.find('Input')).to.have.length(2);
            expect(WRAPPER.find('Button')).to.have.length(1);
        });
    
        it('updates state for changing password', function() {
            var newInput = WRAPPER.find({name: 'newInput'});
            newInput.simulate('change', {target: {value: 'business5'}});
            expect(WRAPPER.state('new')).to.equal('business5');
            var confirmInput = WRAPPER.find({name: 'confirmInput'});
            confirmInput.simulate('change', {target: {value: 'business5'}});
            expect(WRAPPER.state('confirm')).to.equal('business5');
        });
    });
    
    describe('isPassValid method', function() {
        it('password is valid', function() {
            expect(isPassValid('business5')).to.not.equal(0);
        });
        
        it('password is empty', function() {
            expect(isPassValid('')).to.equal(false);
        });
        
        it('password is not a string', function() {
            expect(isPassValid(5555555555)).to.equal(false); 
        });
        
        it('password is not valid if too short', function() {
            expect(isPassValid('bus3')).to.equal(false); 
        });
        
        it('password is not valid if no number', function() {
            expect(isPassValid('business')).to.equal(0);
        });
    });

});