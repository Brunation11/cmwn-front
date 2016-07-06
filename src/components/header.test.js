import React from 'react'; //eslint-disable-line no-unused-vars
import {expect} from 'chai';
import {shallow} from 'enzyme';

import Header from 'components/header';
import {COPY} from 'components/header';

const MOCK_USER = {user_id: 'test'}; //eslint-disable-line camelcase
var stateVars = {
    loginOpen: false,
    signupOpen: false,
    showContact: false,
    workOpen: false,
    contactOpen: false
};
var closeWork = () => stateVars.workOpen = false;
var closeContact = () => stateVars.contactOpen = false;


export var checkHeaderContents = function (wrapper) {
    expect(wrapper.children()).to.have.lengthOf(7);
    expect(wrapper.find('h1')).to.have.lengthOf(1);
    expect(wrapper.find('.links')).to.have.lengthOf(1);
    expect(wrapper.find('.links').children()).to.have.lengthOf(3);
    expect(wrapper.find('.links').children('a')).to.have.lengthOf(3);
    expect(wrapper.find('.actions')).to.have.lengthOf(1);
    expect(wrapper.find('.actions').children()).to.have.lengthOf(3);
    expect(wrapper.find('.actions').children('Button')).to.have.lengthOf(3);
    expect(wrapper.find('#signup')).to.have.lengthOf(1);
    expect(wrapper.find('#login')).to.have.lengthOf(1);
    expect(wrapper.find('#demo')).to.have.lengthOf(1);
};

var checkModalContents = function (wrapper) {
    expect(wrapper.find('#demo-modal')).to.have.lengthOf(1);
    expect(wrapper.find('#work-modal')).to.have.lengthOf(1);
    expect(wrapper.find('#contact-modal')).to.have.lengthOf(1);
    expect(wrapper.find('#signup-modal')).to.have.lengthOf(1);
    expect(wrapper.find('#work-modal').find('p')).to.have.lengthOf(2);
    expect(wrapper.find('#signup-modal').find('p')).to.have.lengthOf(2);
}

//TODO: Test login function when history test mode set up. LB 07/05/16
//TODO: Test Demo methods if they turn out to not be obsolete. LB 07/05/16

describe('Header unit tests', function () {
    describe('Anonymous user viewing header', function () {
        it('renders a header', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={{}}/>;
            const WRAPPER = shallow(header);
            expect(WRAPPER.instance()).to.be.instanceOf(Header);

        });

        it('has the correct contents', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={{}}/>;
            const WRAPPER = shallow(header);
            checkHeaderContents(WRAPPER);
            checkModalContents(WRAPPER);

            expect(WRAPPER.find('#login').html().split('>')[1]).to.equal(COPY.BUTTONS.LOGIN + '</button');
            expect(WRAPPER.find('#demo').html().split('>')[1]).to.equal(COPY.BUTTONS.LOGIN + '</button');
        });

        it('displays and hides work modal', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={{}}/>;
            const WRAPPER = shallow(header);
            expect(WRAPPER.state('workOpen')).to.not.be.ok;
            WRAPPER.find('.links').children('a').at(0).simulate('click');
            expect(WRAPPER.state('workOpen')).to.be.true;
            WRAPPER.find('#work-modal').simulate('hide');
            expect(WRAPPER.state('workOpen')).to.be.false;
        });

        it('displays and hides contact modal', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={{}}/>;
            const WRAPPER = shallow(header);
            expect(WRAPPER.state('contactOpen')).to.not.be.ok;
            expect(WRAPPER.find('#contact-modal').find('p')).to.have.lengthOf(0);
            WRAPPER.find('.links').children('a').at(1).simulate('click');
            expect(WRAPPER.state('contactOpen')).to.be.true;

            WRAPPER.find('#contact-modal').simulate('hide');
            expect(WRAPPER.state('contactOpen')).to.be.false;
        });

        it('displays and hides sign up modal', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={{}}/>;
            const WRAPPER = shallow(header);
            expect(WRAPPER.state('signupOpen')).to.not.be.ok;
            WRAPPER.find('#signup').simulate('click');
            expect(WRAPPER.state('signupOpen')).to.be.true;
            WRAPPER.find('#signup-modal').simulate('hide');
            expect(WRAPPER.state('signupOpen')).to.be.false;
        });
    });

    describe('Logged in user viewing header', function () {
        it('renders a header', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={MOCK_USER}/>;
            const WRAPPER = shallow(header);
            expect(WRAPPER.instance()).to.be.instanceOf(Header);

        });

        it('has the correct contents', function () {
            var header = <Header workOpen={false} contactOpen={false}
                closeWork={closeWork} closeContact={closeContact} currentUser={MOCK_USER}/>;
            const WRAPPER = shallow(header);
            checkHeaderContents(WRAPPER);
            checkModalContents(WRAPPER);

            expect(WRAPPER.find('#login').html().split('>')[1]).to.equal(COPY.BUTTONS.PROFILE + '</button');
            expect(WRAPPER.find('#demo').html().split('>')[1]).to.equal(COPY.BUTTONS.PROFILE + '</button');
        });
    });
});