import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Profile } from 'routes/classes/profile';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';
import classData from 'mocks/users/classData';


var checkElementsTeacher = function(data, currentUser){
	var profile = <Profile data={data} loading={false} currentUser={currentUser}/>;
	const wrapper = shallow(profile);
	expect(wrapper.instance()).to.be.instanceOf(Profile);
	var layout = wrapper.find('Layout');
	expect(layout).to.have.length(1);
}

var checkElementsNullData = function(currentUser){
	var profile = <Profile data={null} loading={false} currentUser={currentUser}/>;
    const wrapper = shallow(profile);
    expect(wrapper.instance()).to.be.instanceOf(Profile);
    expect(wrapper.children()).to.have.length(0);
}

describe('<Profile />', function(){
	describe('check elements', function(){
		it('checks profile as teacher', function(){
			checkElementsTeacher(classData, teacherData);
		});
		it('checks profile with null data', function(){
			checkElementsNullData(teacherData);
		});
	});
});