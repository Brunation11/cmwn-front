import {expect} from 'chai';
import {shallow} from 'enzyme';

import {EditProfile} from 'routes/users/edit';
import editSmoke from 'smoke_tests/users/edit.test.js';

import teacherData from 'mocks/users/teacher_data';
import studentDataB from 'mocks/users/student_data_b';

var checkEditEls = function (wrapper) {
    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('UpdateUsername')).to.have.length(1);
    expect(wrapper.find('ChangePassword')).to.have.length(1);
    expect(wrapper.find('ForgotPass')).to.have.length(1);
    expect(wrapper.find('CodeChange')).to.have.length(1);
};

var checkAdultEls = function (wrapper) {
    expect(wrapper.find('Form')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(4);
};

var checkEditFields = function (data, currentUser) {
    var edit = <EditProfile data={data} loading={false} currentUser={currentUser} isStudent={false}/>;
    const WRAPPER = shallow(edit);

    it('updates state for edit username', function () {
        var usernameInput = WRAPPER.find({name: 'usernameInput'});
        expect(WRAPPER.state('username')).to.equal(data.username);
        usernameInput.simulate('change', {target: {value: 'cat'}});
        expect(WRAPPER.state('username')).to.equal('cat');
    });

    it('updates state for edit first name', function () {
        var usernameInput = WRAPPER.find({name: 'firstnameInput'});
        expect(WRAPPER.state('first_name')).to.equal(data.first_name);
        usernameInput.simulate('change', {target: {value: 'cat'}});
        expect(WRAPPER.state('first_name')).to.equal('cat');
    });

    it('updates state for edit last name', function () {
        var usernameInput = WRAPPER.find({name: 'lastnameInput'});
        expect(WRAPPER.state('last_name')).to.equal(data.last_name);
        usernameInput.simulate('change', {target: {value: 'cat'}});
        expect(WRAPPER.state('last_name')).to.equal('cat');
    });
};

describe('Edit Profile Smoke Tests', function () {
    editSmoke();
});

describe('Edit Profile Unit Tests', function () {
    //TODO: suspend account & reset password & submit data when test mode set up for HTTPManager. LB 06/21/16.
    //TODO: test parents methods & render school info if added to render. LB 06/22/16.

    describe('teacher viewing own student\'s profile edit', function () {
        var edit = <EditProfile data={studentDataB} loading={false} currentUser={teacherData}
                                isStudent={false}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });

        it('has the correct adult view elements', function () {
            checkAdultEls(WRAPPER);
        });

        checkEditFields(studentDataB, teacherData);
    });

    describe('teacher viewing own profile edit', function () {
        var edit = <EditProfile data={teacherData} loading={false} currentUser={teacherData}
                                isStudent={false}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });

        it('has the correct adult view elements', function () {
            checkAdultEls(WRAPPER);
        });

        checkEditFields(teacherData, teacherData);
    });

    describe('student viewing own edit profile', function () {
        var studentDataBB = JSON.parse(JSON.stringify(studentDataB));
        studentDataBB.scope = 2;
        var edit = <EditProfile data={studentDataBB} loading={false} currentUser={studentDataBB}/>;
        const WRAPPER = shallow(edit);

        it('renders the edit profile component', function () {
            expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
        });

        it('has the correct general elements', function () {
            checkEditEls(WRAPPER);
        });

        it('has the correct child view elements', function () {
            expect(WRAPPER.find('.user-metadata').children()).to.have.length(8);
        });
    });

    describe('viewing edit profile without permission', function () {
        it('renders a null profile', function () {
            var edit = <EditProfile data={{user_id: 0, scope: 0}} loading={false} currentUser={teacherData}/>; //eslint-disable-line camelcase, max-len
            const WRAPPER = shallow(edit);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

    describe('viewing edit profile without data', function () {
        it('renders a null profile', function () {
            var edit = <EditProfile data={null} loading={false} currentUser={teacherData}/>;
            const WRAPPER = shallow(edit);
            expect(WRAPPER.type()).to.equal(null);
        });
    });

});
