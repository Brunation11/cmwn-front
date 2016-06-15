import React from 'react';
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Store from 'components/store';
import { Profile } from 'routes/users/profile';

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
    // TODO: how to test generate datasource?
    expect(wrapper.find('Trophycase')).to.have.length(1);
    expect(wrapper.find('FlipBoard')).to.have.length(1);    
}

describe('Teacher viewing own Profile', function() {

	it('renders own teacher Profile', function() {
	    checkProfileRender(teacherData, teacherData);
	});
	
	it('has all of the correct elements', function() {
	    checkOwnProfileContent(teacherData, teacherData);
	});
});

describe('Teaching viewing student Profile', function() {
    it('renders student profile', function() {
        var profile = <Profile data={studentDataB} loading={false} currentUser={teacherData}/>;
        const wrapper = shallow(profile);
        expect(wrapper.instance()).to.be.instanceOf(Profile);
    });
});

describe('Student viewing another student profile', function() {
    it('renders student profile', function() {
        var profile = <Profile data={studentDataB} loading={false} currentUser={studentDataA}/>;
        const wrapper = shallow(profile);
        expect(wrapper.instance()).to.be.instanceOf(Profile);
    });
});

describe('Student viewing teacher profile', function() {
    it('renders student profile', function() {
        var profile = <Profile data={teacherData} loading={false} currentUser={studentDataA}/>;
        const wrapper = shallow(profile);
        expect(wrapper.instance()).to.be.instanceOf(Profile);
    });
});

