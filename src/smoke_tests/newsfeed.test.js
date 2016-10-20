import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount } from 'enzyme';

import { Feed } from 'routes/newsfeed';

import studentDataA from 'mocks/users/student_data_a';
import feedData from 'mocks/newsfeed_data';

var checkFeedRender = function (data, currentUser) {
    var feed = <Feed data={data} loading={false} currentUser={currentUser}/>;
};

var checkFeedContent = function (data, currentUser) {
    var feed = <Feed data={data} loading={false} currentUser={currentUser}/>;
};

export default function () {

    describe('Student viewing own News Feed', function () {
        it('renders own student News Feed', function () {
            checkFeedRender(feedData, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkFeedContent(feedData, studentDataA);
        });

    });
}
