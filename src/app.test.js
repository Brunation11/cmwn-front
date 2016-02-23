/*global describe, before, it */
import React from 'react'; //eslint-disable-line no-unused-vars
import assert from 'assert';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';

import App from 'app';
import Users from 'routes/users';
import Districts from 'routes/districts';
import DistrictView from 'routes/districts/view';
import DistrictEdit from 'routes/districts/edit';
import DistrictCreate from 'routes/districts/create';
import Organizations from 'routes/organizations';
import OrganizationView from 'routes/organizations/view';
import OrganizationEdit from 'routes/organizations/edit';
import OrganizationProfile from 'routes/organizations/profile';
import Groups from 'routes/groups';
import GroupView from 'routes/groups/view';
import GroupEdit from 'routes/groups/edit';
import GroupProfile from 'routes/groups/profile';
import Friends from 'routes/friends';
import SuggestedFriends from 'routes/friends/suggested';
import Profile from 'routes/users/profile';
import StudentEdit from 'routes/users/edit';
import Game from 'routes/game';
import ChangePassword from 'routes/change_password';

describe('Test Utilities', function () {
    describe('Mocha', function () {
        it('Tests are functioning.', function () {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
    describe('Chai', function () {
        it('Chai syntax loads', function () {
            var foo = {foo: 'bar'};
            expect(foo).to.be.a('object');
            expect(foo.foo).to.equal('bar');
        });
    });
});


describe('Application', function () {
    before('render and locate element', function () {
        var renderedComponent = TestUtils.renderIntoDocument(
            <App />
        );
        var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');

        this.appWrapper = inputComponent;
    });
    describe('Bootstrap', function () {
        it('Should insert React elements', function () {
            expect(TestUtils.isDOMComponent(this.appWrapper)).to.be.ok;
        });
    });
    describe('Routes', function () {
        it('Should load User Profile', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Profile id="954d31ae-d689-11e5-bcaa-acbc32a6b1bb"/>);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'user-profile');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load User User List', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Users />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District List', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Districts />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit District', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <DistrictEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District Admin', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <DistrictView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load District Create', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <DistrictCreate />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Organization List', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Organizations />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit Organization', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <OrganizationEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Organization Profile', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <OrganizationProfile />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Organization Admin', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <OrganizationView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Group List', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Groups />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit Group', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <GroupEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Group Profile', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <GroupProfile />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Group Admin', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <GroupView />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Edit Student', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <StudentEdit />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Friend List', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Friends />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Suggested Friends', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <SuggestedFriends />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Single Game', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <Game />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
        it('Should load Forced Change Password', function () {
            var renderedComponent = TestUtils.renderIntoDocument( <ChangePassword />);
            var inputComponent = TestUtils.findRenderedDOMComponentWithClass(renderedComponent, 'sweater');
            expect(TestUtils.isDOMComponent(inputComponent)).to.be.ok;
        });
    });
});

