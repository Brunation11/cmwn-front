import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import classData from 'mocks/users/classData';
import { EditClass } from 'routes/classes/edit';
import { CreateStudent } from 'routes/classes/edit';

var checkEditClass = function (wrapper) {
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('Link')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(2);
    expect(wrapper.find('Button')).to.have.length(1);
};

var checkCreateStudent = function (wrapper) {
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('Form')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(2);
    expect(wrapper.find('Button')).to.have.length(1);
};

var checkUpdatingClass = function (wrapper) {
    var className = wrapper.find({id: 'class-name'});
    var classDescription = wrapper.find({id: 'descript'});
    className.simulate('change', {target: {value: 'ClassA'}});
    expect(wrapper.state('title')).to.equal('ClassA');
    classDescription.simulate('change', {target: {value: 'just a great class'}});
    expect(wrapper.state('description')).to.equal('just a great class');
};

var checkUpdatingUser = function (wrapper) {
    var firstName = wrapper.find({id: 'first-name'});
    var lastName = wrapper.find({id: 'last-name'});
    firstName.simulate('change', {target: {value: 'User1'}});
    expect(wrapper.state('first')).to.equal('User1');
    lastName.simulate('change', {target: {value: 'LastName'}});
    expect(wrapper.state('last')).to.equal('LastName');
};

describe('<EditClass />', function () { // eslint-disable-line no-undef
    var editClass = <EditClass data={classData}/>;
    var wrapper = shallow(editClass);

    it('ckecks that EditClass component is rendered correctly', () => { // eslint-disable-line no-undef
        expect(wrapper.instance()).to.be.instanceOf(EditClass);
    });

    it('checks that the elements are present', () => { // eslint-disable-line no-undef
        checkEditClass(wrapper);
    });

    it('checks that class info gets updated', () => { // eslint-disable-line no-undef
        checkUpdatingClass(wrapper);
    });
});

describe('<CreateStudent />', function () { // eslint-disable-line no-undef
    var createStudent = <CreateStudent />;
    var wrapper = shallow(createStudent);

    it('ckecks that CreateStudent component is rendered correctly', () => { // eslint-disable-line no-undef
        expect(wrapper.instance()).to.be.instanceOf(CreateStudent);
    });

    it('checks that the elements are present', () => { // eslint-disable-line no-undef
        checkCreateStudent(wrapper);
    });

    it('checks that user info gets updated', () => { // eslint-disable-line no-undef
        checkUpdatingUser(wrapper);
    });
});
