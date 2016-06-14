import React from 'react';
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Store from 'components/store';
import { Profile } from 'routes/users/profile';

import teacherData from 'mocks/users/teacherData';
import studentData from 'mocks/users/studentData';

describe('Profile', function() {
	it('renders own teacher Profile', function() {
	    var profile = <Profile data={teacherData} loading={false} currentUser={teacherData}/>;
	    const wrapper = shallow(profile);
	});
	    
});
