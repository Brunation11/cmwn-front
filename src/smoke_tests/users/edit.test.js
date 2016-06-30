import {expect} from 'chai';
import {mount} from 'enzyme';

import {EditProfile} from 'routes/users/edit';

import teacherData from 'mocks/users/teacher_data';
import studentDataA from 'mocks/users/student_data_a';
import studentDataB from 'mocks/users/student_data_b';

//TODO: lifecycle methods when mounting set up with unconnected components.  LB 06/21/16.

var checkEditEls = function (wrapper) {

    expect(wrapper.find('Layout')).to.have.length(1);
    expect(wrapper.find('Panel')).to.have.length(1);
    expect(wrapper.find('ProfileImage')).to.have.length(1);
    expect(wrapper.find('UpdateUsername')).to.have.length(1);
    expect(wrapper.find('ChangePassword')).to.have.length(1);
    expect(wrapper.find('ForgotPass')).to.have.length(1);
    expect(wrapper.find('CodeChange')).to.have.length(1);
    // TODO: Add in checks for relevant sub components. LB 06/29/16.
};

var checkAdultEls = function (wrapper) {
    expect(wrapper.find('Form')).to.have.length(1);
    expect(wrapper.find('Input')).to.have.length(4);
    // TODO: Add in checks for relevant sub components. LB 06/29/16.
};

export default function () {
    describe('Edit Profile', function () {

        describe('teacher viewing own student\'s profile edit', function () {
            var edit = <EditProfile data={studentDataB} loading={false} currentUser={teacherData}
                                    isStudent={false}/>;
            //const WRAPPER = mount(edit);

            it('renders the edit profile component', function () {
                //expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
            });

            it('has the correct general elements', function () {
                //checkEditEls(WRAPPER);
            });

            it('has the correct adult view elements', function () {
                //checkAdultEls(WRAPPER);
            });

        });

        describe('teacher viewing own profile edit', function () {
            var edit = <EditProfile data={teacherData} loading={false} currentUser={teacherData}
                                    isStudent={false}/>;
            //const WRAPPER = mount(edit);

            it('renders the edit profile component', function () {
                //expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
            });

            it('has the correct general elements', function () {
                //checkEditEls(WRAPPER);
            });

            it('has the correct adult view elements', function () {
                //checkAdultEls(WRAPPER);
            });

        });

        describe('student viewing own edit profile', function () {
            var studentDataBB = JSON.parse(JSON.stringify(studentDataB));
            var edit;
            studentDataBB.scope = 2;
            edit = <EditProfile data={studentDataBB} loading={false} currentUser={studentDataBB}/>;
            //const WRAPPER = mount(edit);

            it('renders the edit profile component', function () {
                //expect(WRAPPER.instance()).to.be.instanceOf(EditProfile);
            });

            it('has the correct general elements', function () {
                //checkEditEls(WRAPPER);
            });

            it('has the correct child view elements', function () {
                //expect(WRAPPER.find('.user-metadata').children()).to.have.length(8);
            });
        });

        describe('viewing edit profile without permission', function () {
            it('renders a null profile', function () {
                var edit = <EditProfile data={{user_id: 0, scope: 0}} loading={false} //eslint-disable-line camelcase, max-len
                    currentUser={teacherData}/>;
                //const WRAPPER = mount(edit);
                //expect(WRAPPER.type()).to.equal(null);
            });
        });

        describe('viewing edit profile without data', function () {
            it('renders a null profile', function () {
                var edit = <EditProfile data={null} loading={false} currentUser={teacherData}/>;
                //const WRAPPER = mount(edit);
                //expect(WRAPPER.type()).to.equal(null);
            });
        });

    });
}
