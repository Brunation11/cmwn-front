import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ResourceCenter } from 'routes/resource_center';
import { PAGE_UNIQUE_IDENTIFIER } from 'routes/resource_center';
import { CURRICULUM_LINKS } from 'routes/resource_center';
import { STUDENT_ENGAGEMENT_LINKS } from 'routes/resource_center';

import teacherData from 'mocks/users/teacher_data';
import studentData from 'mocks/users/student_data_a';

var createWrapper = function (data) {
    var rc = <ResourceCenter currentUser={data} loading={false} />;
    const WRAPPER = shallow(rc);
    return WRAPPER;
};

var checkContent = function (WRAPPER, data) {
    expect(WRAPPER.instance()).to.be.instanceOf(ResourceCenter);
    expect(WRAPPER.hasClass(PAGE_UNIQUE_IDENTIFIER)).to.equal(true);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('h1')).to.have.length(2);
    expect(WRAPPER.find('ul')).to.have.length(2);
    var links = CURRICULUM_LINKS.length + STUDENT_ENGAGEMENT_LINKS.length;
    expect(WRAPPER.find('li')).to.have.length(links);
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
    describe('when viewed by a teacher', function () {
        const WRAPPER = createWrapper(teacherData);
        it('should render the resource center', function () {
            checkContent(WRAPPER);
        });
    });
});

