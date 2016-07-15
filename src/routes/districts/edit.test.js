import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { EditDistrict } from 'routes/districts/edit';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';

var create = <EditDistrict data={teacherData} currentUser=
    {teacherData} params={{id: '1001'}}/>;
const WRAPPER = shallow(create);

describe('check EditDistrict elements', function (){
    it('checks that all elements are being rendered', function (){
        expect(WRAPPER.find('Layout')).to.have.length(1);
        expect(WRAPPER.find('Panel')).to.have.length(1);
        expect(WRAPPER.find('Input')).to.have.length(2);
        expect(WRAPPER.find('Button')).to.have.length(1);
    });
});

describe('check CreateSchool elements', function (){
    it('checks that all elements are being rendered', function (){
        expect(WRAPPER.find('Panel')).to.have.length(1);
        expect(WRAPPER.find('Input')).to.have.length(2);
        expect(WRAPPER.find('Button')).to.have.length(1);
    });
});
