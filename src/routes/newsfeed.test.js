import React from 'react'; //eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import { Feed } from 'routes/newsfeed';
import GLOBALS from 'components/globals';
import NewsFeedSmoke from 'smoke_tests/newsfeed.test.js';
import studentDataA from 'mocks/users/student_data_a';
import feedData from 'mocks/newsfeed_data';

var checkFeedRender = function (data, currentUser) {
    var feed = <Feed data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(feed);
    expect(WRAPPER.instance()).to.be.instanceOf(Feed);
};

var checkFeedContent = function (data, currentUser) {
    var feed = <Feed data={data} loading={false} currentUser={currentUser}/>;
    const WRAPPER = shallow(feed);
    expect(WRAPPER.children()).to.have.length(2);
    expect(WRAPPER.find('Layout')).to.have.length(1);
    expect(WRAPPER.find('Modal')).to.have.length(1);
    expect(WRAPPER.find('Game')).to.have.length(1);
    expect(WRAPPER.find('Panel')).to.have.length(1);
};

describe('News Feed Smoke Tests', function () {
    NewsFeedSmoke();
});

describe('News Feed Unit Tests', function () {
    describe('Student viewing own News Feed', function () {
        it('renders own student News Feed', function () {
            checkFeedRender(feedData, studentDataA);
        });

        it('has all of the correct elements', function () {
            checkFeedContent(feedData, studentDataA);
        });
    });
});
