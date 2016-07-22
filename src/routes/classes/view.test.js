import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { View } from 'routes/classes/view';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';
import userA from 'mocks/users/student_data_a';
import userB from 'mocks/users/student_data_b';

const CLASS_USER_DATA = {
    'group_users-classProfile': {
        data: [userA, userB],
        page: 1,
        page_count: 1,
        page_size: 10,
        total_items: 2
    }
};
var nullGroup = {group_id: null}; // eslint-disable-line camelcase

var checkElements = function (data, currentUser) {
    var view = <View data={data} currentUser = {currentUser}/>;
    const WRAPPER = shallow(view);
    expect(WRAPPER.instance()).to.be.instanceOf(View);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(2);
    expect(WRAPPER.find('p')).to.have.length(4);
    expect(WRAPPER.find('#panel-1').children()).to.have.length(6);
    expect(WRAPPER.find('#panel-2').children()).to.have.length(2);
};

var checkWithNullGroupId = function (data, currentUser){
    var view = <View data={data} currentUser={currentUser} components={CLASS_USER_DATA}/>;
    const WRAPPER = shallow(view);
    expect(WRAPPER.instance()).to.be.instanceOf(View);
    expect(WRAPPER.children()).to.have.length(0);
};

describe('class <View />', function () {
    it('check that elements get rendered', () => {
        // TODO MPR, 8/19/16: Uncomment when component data is fixed
        //checkElements(classData, teacherData);
    });

    it('check that render returns null if group_id is null', () => {
        checkWithNullGroupId(nullGroup, teacherData);
    });
});
