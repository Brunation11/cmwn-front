import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { EditClass } from 'routes/classes/edit';
import { CreateStudent } from 'routes/classes/edit';

var checkEditClass = function(wrapper) {
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('Link')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(2);
    expect(wrapper.find('Button')).to.have.length(1);
    //expect(wrapper.find('CreateStudent')).to.have.length(1);
};

var checkCreateStudent = function(wrapper) {
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('Form')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(2);
    expect(wrapper.find('Button')).to.have.length(1);
};