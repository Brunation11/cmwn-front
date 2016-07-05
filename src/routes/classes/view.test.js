import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { View } from 'routes/classes/view';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';

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
    var view = <View data={data} currentUser = {currentUser}/>;
    const WRAPPER = shallow(view);
    expect(WRAPPER.instance()).to.be.instanceOf(View);
    expect(WRAPPER.children()).to.have.length(0);
};

describe('class <View />', function () { // eslint-disable-line no-undef
    it('check that elements get rendered', () => { // eslint-disable-line no-undef
        checkElements(classData, teacherData);
    }); // eslint-disable-line indent

    it('check that render returns null if group_id is null', () => { // eslint-disable-line no-undef
        checkWithNullGroupId(nullGroup, teacherData);
    });
});
