import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { shallow } from 'enzyme';
//import { mount } from 'enzyme';
//import sinon from 'sinon';
import Immutable from 'seamless-immutable';

import Sidebar from 'components/sidebar';

import studentData from 'mocks/users/student_data_a';


var checkElements = function (currentUser){
    var sidebar;
    //sinon.spy(Sidebar.prototype, 'componentDidMount');
    sidebar = <Sidebar currentUser={currentUser}/>;
    const WRAPPER = shallow(sidebar);
    //var WRAPPER2 = mount(sidebar);

    expect(WRAPPER.instance()).to.be.instanceOf(Sidebar);
    //expect(Sidebar.prototype.componentDidMount).to.have.property('callCount', 1);
};

studentData._links = Immutable(studentData._links);
studentData.username = 'mfaffertyatchangemyworld';

describe('class <Profile />', function (){ // eslint-disable-line no-undef
    describe('check elements', function (){ // eslint-disable-line no-undef
        it('checks sidenav as a student', function (){ // eslint-disable-line no-undef
            checkElements(studentData);
        });
    });
});

