import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { District } from 'routes/districts';

import teacherData from 'mocks/users/teacher_data';
import classData from 'mocks/users/class_data';

var checkElements = function (data, currentUser){
    var district = <District data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(district);
    expect(WRAPPER.instance()).to.be.instanceOf(District);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Table')).to.have.length(1) ;
};

describe('test districts page', function () {
    it('check that all elements in districts appear', function () {
        checkElements(teacherData._embedded.organizations[0], teacherData);
    });
});
