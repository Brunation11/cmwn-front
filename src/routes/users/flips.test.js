import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { FlipWall } from 'routes/users/flips';
import GLOBALS from 'components/globals';
import FlipWallSmoke from 'smoke_tests/users/flips.test.js';
import studentDataA from 'mocks/users/student_data_a';
import flipsData from 'mocks/users/flips_data';

var checkFlipWallRender = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(flipWall);
    expect(WRAPPER.instance()).to.be.instanceOf(FlipWall);
};

var checkFlipWallContent = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(flipWall);
    expect(WRAPPER.children()).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
    expect(WRAPPER.find('Flipcase')).to.have.length(1);
};

describe('Flip Wall Smoke Tests', function () {
    FlipWallSmoke();
});

describe('Flip Wall Unit Tests', function () {
    describe('Student viewing own Flip Wall', function () {
        it('renders own student Flip Wall', function () {
            checkFlipWallRender(flipsData, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkFlipWallContent(flipsData, studentDataA);
        });

    });
});
