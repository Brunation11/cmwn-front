import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { View } from 'routes/classes/view';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';
import classData from 'mocks/users/classData';

var checkElements = function(wrapper) {
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(2);
    expect(wrapper.find('p')).to.have.length(4);
    expect(wrapper.find('#panel-1').children()).to.have.length(6);
    expect(wrapper.find('#panel-2').children()).to.have.length(2);
};

var checkWithNullGroupId = function(wrapper){
	expect(wrapper.children()).to.have.length(0);
}

describe('<View />', function () {
	it('check that elements get rendered', () => {
    	var view = <View data={classData} currentUser = {teacherData}/>;
		var wrapper = shallow(view);
    	expect(wrapper.instance()).to.be.instanceOf(View);
    	checkElements(wrapper);
    });

    it('check that render returns null if group_id is null', () => {
    	var view = <View data={{group_id: null}} currentUser = {teacherData}/>;
		var wrapper = shallow(view);
		expect(wrapper.instance()).to.be.instanceOf(View);
		checkWithNullGroupId(wrapper);
    })
});