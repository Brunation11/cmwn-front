import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { EditProfile } from 'routes/users/edit';


import teacherData from 'mocks/users/teacherData';
import studentDataA from 'mocks/users/studentDataA';
import studentDataB from 'mocks/users/studentDataB';

describe('Edit Profile', function() {
   describe("teaching viewing own student's profile", function() {
       var edit = <EditProfile data={studentDataB} loading={false} currentUser={teacherData}/>; 
       const wrapper = shallow(edit);
       
       it('renders the edit profile component', function() {
           //expect(wrapper.instance()).to.be.instanceOf(EditProfile);
       });
   })
    
});