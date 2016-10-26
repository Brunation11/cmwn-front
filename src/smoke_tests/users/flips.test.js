import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { FlipWall } from 'routes/users/flips';

import studentDataA from 'mocks/users/student_data_a';

var checkFlipWallRender = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
};

var checkFlipWallContent = function (data, currentUser) {
    var flipWall = <FlipWall data={data} loading={false} currentUser={currentUser}/>;
};

export default function () {

    describe('Student viewing own Flip Wall', function () {
        it('renders own student Flip Wall', function () {
            checkFlipWallRender(studentDataA, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkFlipWallContent(studentDataA, studentDataA);
        });

    });
}
