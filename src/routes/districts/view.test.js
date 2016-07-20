import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ViewDistrict } from 'routes/districts/view';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';

describe('tests ViewDistrict', function (){
    it('checks that all elements are rendered', function (){
        var view = <ViewDistrict data=
            {teacherData._embedded.organizations[0]} currentUser={teacherData}/>;
        const WRAPPER = shallow(view);
        expect(WRAPPER.instance()).to.be.instanceOf(ViewDistrict);
        expect(WRAPPER.find('Layout')).to.have.length(1);
        expect(WRAPPER.find('Panel')).to.have.length(4);
        expect(WRAPPER.find('#panel-1').children()).to.have.length(9);
        expect(WRAPPER.find('#panel-2').children()).to.have.length(2);
        expect(WRAPPER.find('#panel-3').children()).to.have.length(2);
        expect(WRAPPER.find('#panel-4').children()).to.have.length(2);
    });
});

describe('test ViewDistrict with empty data', function (){
    it('checks that no elements are rendered', function (){    
        var view = <ViewDistrict data={{}} currentUser={teacherData}/>;
        const WRAPPER = shallow(view);
        expect(WRAPPER.instance()).to.be.instanceOf(ViewDistrict);
        expect(WRAPPER.children()).to.have.length(0);
    });
});