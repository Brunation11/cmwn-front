import React from 'react';
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/users/profile';
import MockFlipWrapper from 'mocks/users/MockFlipWrapper';

import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';


var checkProfileRender = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.instance()).to.be.instanceOf(Profile);
}

var checkOwnProfileContent = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.children('div')).to.have.length(1);
    expect(wrapper.find('Modal')).to.have.length(1);
    // TODO: how to test generate datasource
    // TODO: figure out testing among interconnected game wrapper, datasource, modal
    expect(wrapper.find('Trophycase')).to.have.length(1);
    expect(wrapper.find('FlipBoard')).to.have.length(1);
}

var checkAnotherProfileContent = function(data, currentUser) {
    var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.children()).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('.frame')).to.have.length(1);
    expect(wrapper.find('.user-metadata').children()).to.have.length(8);
    //TODO: test profile image when separated from mapStateToProps
}

describe('Profile', function() {
    describe('Teacher viewing own Profile', function() {
    
    	it('renders own teacher Profile', function() {
    	    checkProfileRender(teacherData, teacherData);
    	});

    	it('has all of the correct elements', function() {
    	    checkOwnProfileContent(teacherData, teacherData);
    	});
    });
    
    describe('Student viewing own Profile', function() {
       it('renders own student Profile', function() {
          checkProfileRender(studentDataA, studentDataA); 
       });
       
       it('has all of the correct elements', function() {
          checkOwnProfileContent(studentDataA, studentDataA); 
       });
        
    });
    
    describe('Teaching viewing student Profile', function() {
        it('renders student profile', function() {
            checkProfileRender(studentDataA, teacherData);
        });
        it ('has all of the correct elements', function() {
           checkAnotherProfileContent(studentDataA, teacherData);
        });
    });
    
    describe('Student viewing another student profile', function() {
        it('renders student profile', function() {
            checkProfileRender(studentDataB, studentDataA);
        });
        it ('has all of the correct elements', function() {
            checkAnotherProfileContent(studentDataB, studentDataA);
        });
    });
    
    describe('Student viewing teacher profile', function() {
        it('renders student profile', function() {
            checkProfileRender(teacherData, studentDataA);
        });
        
        it ('has all of the correct elements', function() {
            checkAnotherProfileContent(teacherData, studentDataA);
         });
    });
    
    describe('Null profile viewing', function() {
        it('renders null profile with null username', function() {
            var profile = <Profile data={{username: null}} loading={false} currentUser={studentDataA}/>;
            const wrapper = shallow(profile);
            expect(wrapper.type()).to.equal(null);
        });
    });
    
    describe('render a flip', function() {
        var item = {
            coming_soon: false,
            game_id: 0,
            title: 'test game',
            description: 'a mock game to test flip'
        };
        
        it('renders a flip', function() {
           const wrapper = shallow(<MockFlipWrapper item={item}/>) 
        });
    });
    
});
