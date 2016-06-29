import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { ProfileView } from 'routes/users/view';
import viewSmoke from 'smoke_tests/users/view.test.js';

import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';

describe('Profile View', function() {
    
    //TODO: testing for suspend account when test mode for HttpManager set up. LB 06/22/16
    //TODO: lifecycle methods when mounting set up with unconnected components. LB 06/22/16
    
    viewSmoke();
    
});