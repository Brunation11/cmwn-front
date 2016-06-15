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


describe('Teacher viewing own Profile', function() {
	it('renders own teacher Profile', function() {
	    var profile = <Profile data={teacherData} loading={false} currentUser={teacherData}/>;
	    const wrapper = shallow(profile);
	    expect(wrapper.instance()).to.be.instanceOf(Profile);
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

