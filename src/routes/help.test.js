import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Help } from 'routes/help';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/help';

import teacherData from 'mocks/users/teacher_data';
import studentData from 'mocks/users/student_data_a';

var createWrapper = function (data) {
    var help = <Help currentUser={data} loading={false} />;
    const WRAPPER = shallow(help);
    return WRAPPER;
};

var checkContent = function (WRAPPER, data) {
    expect(WRAPPER.instance()).to.be.instanceOf(Help);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('ul')).to.have.length(1);
    expect(WRAPPER.find('li')).to.have.length(3);
    expect(WRAPPER.find('a')).to.have.length(3);
    expect(WRAPPER.find('h2')).to.have.length(3);
};

describe('resource center unit tests', function () {
    describe('when given no data', function () {
        const WRAPPER = createWrapper(null);
        it('should render null', function () {
            expect(WRAPPER.type()).to.equal(null);
        });
    });
    describe('when viewed by a student', function () {
        const WRAPPER = createWrapper(studentData);
        it('should render null', function () {
            expect(WRAPPER.type()).to.equal(null);
        });
    });
    describe('when viewed by an adult', function () {
        const WRAPPER = createWrapper(teacherData);
        it('should render the help page', function () {
            checkContent(WRAPPER);
        }); 
    });
});
