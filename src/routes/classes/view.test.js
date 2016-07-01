import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { View } from 'routes/classes/view';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/classData';

var nullGroup = {group_id: null}; // eslint-disable-line camelcase

var checkElements = function (data, currentUser) {
    var view = <View data={data} currentUser = {currentUser}/>;
    var wrapper = shallow(view);
    expect(wrapper.instance()).to.be.instanceOf(View);
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(2);
    expect(wrapper.find('p')).to.have.length(4);
    expect(wrapper.find('#panel-1').children()).to.have.length(6);
    expect(wrapper.find('#panel-2').children()).to.have.length(2);
};

var checkWithNullGroupId = function (data, currentUser){
    var view = <View data={data} currentUser = {currentUser}/>;
    var wrapper = shallow(view);
    expect(wrapper.instance()).to.be.instanceOf(View);
    expect(wrapper.children()).to.have.length(0);
};

describe('<View />', function () { // eslint-disable-line no-undef
    it('check that elements get rendered', () => { // eslint-disable-line no-undef
        checkElements(classData, teacherData);
    }); // eslint-disable-line indent

    it('check that render returns null if group_id is null', () => { // eslint-disable-line no-undef
        checkWithNullGroupId(nullGroup, teacherData);
    });
});
