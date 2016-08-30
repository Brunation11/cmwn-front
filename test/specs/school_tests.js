import { login } from './login.js';
import { USER, PASS, SUPER_USER, SUPER_PASS } from '../test_data.js';
import { checkLink, goBack } from './helpers.js';

const URL = 'https://local.changemyworldnow.com';
const SCHOOL_ID = '9ee14a04-0288-11e6-8625-0800274f2cef'; // need to hardcode for now
const MISSING = 'MISSING ELEMENT, SKIPPING: ';
const MSGS = {
    NO_CLASSES: 'No classes to view',
    NO_USERS: 'No users to view'
};

function goToSchoolProfile() {
    login(SUPER_USER, SUPER_PASS); 
    browser.waitForExist('#navMenu', 3000);
    browser.getUrl().should.equal(`${URL}/profile`);
    browser.url(`/school/${SCHOOL_ID}/profile`);
    browser.waitForExist('.profile');
    browser.waitForExist('.standard');
}

function changeSchool(name, desc) {
    enterText('#school-edit-name', name);
    enterText('#school-edit-desc', desc);
    browser.click('#school-edit-submit');
    browser.waitForExist('.humane-flatty-success');
}

function enterText(element, text) {
    browser.waitForExist(element);
    browser.clearElement(element);
    if(text) browser.setValue(element, text);
}

function trySubmit(teacherCode, studentCode, msg, checked) {
    enterText('#teacher-code', teacherCode);
    enterText('#student-code', studentCode);
    if(checked) {
        browser.waitForExist('#import-terms-check');
        browser.click('#import-terms-check');
    };
    browser.submitForm('#import-form');
    browser.waitForVisible('.humane-flatty-error');
    expect(browser.getText('.humane-flatty-error')).to.contain(msg);
    browser.refresh(); // to get message to go away
}

function invalidAccess(url) {
    browser.url(url);
    browser.waitForExist('.logout-page');
    expect(browser.getUrl()).to.equal(`${URL}/logout`);
    browser.waitForExist('#login-form');
    expect(browser.getUrl()).to.equal(`${URL}/login`);
}
 
describe('school routes integration tests', function () {
    const SCHOOL_PROFILE_URL = `${URL}/school/${SCHOOL_ID}/profile`;
    const SCHOOL_VIEW_URL = `${URL}/school/${SCHOOL_ID}/view`;
    const SCHOOL_EDIT_URL = `${URL}/school/${SCHOOL_ID}/edit`;
    it('should load a full, functional school profile page', function () {
        goToSchoolProfile();
        browser.waitForExist('.right');
        checkLink('.purple', SCHOOL_EDIT_URL);
        goBack(SCHOOL_PROFILE_URL);
        checkLink('.green', SCHOOL_EDIT_URL);
        goBack(SCHOOL_PROFILE_URL);
        checkLink('#school-admin-link', SCHOOL_VIEW_URL);
        goBack(SCHOOL_PROFILE_URL);
        browser.waitForExist('.school-district-link');
        var districtLink = browser.getAttribute('.school-district-link', 'href');
        if(Array.isArray(districtLink)) districtLink = districtLink[0];
        checkLink('./school-district-link', districtLink);
        goBack(SCHOOL_PROFILE_URL);
    });
    it('should load the school view page', function () {
        var elementAvailable = false;
        goToSchoolProfile();
        browser.waitForExist('.right');
        checkLink('#school-admin-link', SCHOOL_VIEW_URL); 
        checkLink('#school-return-profile', SCHOOL_PROFILE_URL);
        goBack(SCHOOL_VIEW_URL);
        checkLink('.purple', SCHOOL_EDIT_URL);
        goBack(SCHOOL_VIEW_URL);
        checkLink('.green', SCHOOL_EDIT_URL);
        goBack(SCHOOL_VIEW_URL);
        expect(browser.selectByIndex('.purple', 1).getText()).to.equal('Delete this school');
        //browser.waitForExist('button=Delete this school'); // the delete button
        browser.waitForExist('#school-districts');
        checkLink('.school-district-link');
        goBack(SCHOOL_VIEW_URL);
        checkLink('#school-view-classes', `${URL}/classes`);
        goBack(SCHOOL_VIEW_URL);
        try { // there might not be classes
            browser.waitForExist('.school-class-link');
            elementAvailable = true;
        } catch (e) {
            console.log(`${MISSING}${MSGS.NO_CLASSES}`);
        }
        if (elementAvailable) {
            var classLink = browser.getAttribute('.school-class-link', 'href');
            if(Array.isArray(classLink)) classLink = classLink[0];
            checkLink('.school-class-link', classLink);
            goBack(SCHOOL_VIEW_URL);
            var classViewLink = browser.getAttribute('.school-class-view', 'href');
            if(Array.isArray(classViewLink)) classViewLink = classViewLink[0];
            checkLink('.school-user-view', classViewLink);
            goBack(SCHOOL_VIEW_URL);
            var classEditLink = browser.getAttribute('.school-class-edit', 'href');
            if(Array.isArray(classEditLink)) classEditLink = classEditLink[0];
            checkLink('.school-class-link', classEditLink);
            goBack(SCHOOL_VIEW_URL);
            elementAvailable = false;
        }
        checkLink('#school-view-users', `${URL}/users`);
        goBack(SCHOOL_VIEW_URL);
        try { // there might not be users
            browser.waitForExist('.school-user-link');
            elementAvailable = true;
        } catch (e) {
            console.log(`${MISSING}${MSGS.NO_USERS}`);
        }
        if (elementAvailable) {
            var userLink = browser.getAttribute('.school-user-link', 'href');
            if(Array.isArray(userLink)) userLink = userLink[0];
            userLink = userLink.replace('user', 'profile'); // redirects to 'profile'
            checkLink('.school-user-link', userLink); 
            goBack(SCHOOL_VIEW_URL);
            browser.waitForExist('.school-user-view', 'href');
            var userViewLink = browser.getAttribute('.school-user-view', 'href');
            if(Array.isArray(userViewLink)) userViewLink = userViewLink[0];
            checkLink('.school-user-view', userViewLink); 
            goBack(SCHOOL_VIEW_URL);
            browser.waitForExist('.school-user-edit', 'href');
            var userEditLink = browser.getAttribute('.school-user-edit', 'href');
            if(Array.isArray(userEditLink)) userEditLink = userEditLink[0];
            userEditLink = userEditLink.replace('user', 'profile'); // redirects to 'profile'
            checkLink('.school-user-edit', userEditLink); 
            goBack(SCHOOL_VIEW_URL);
            elementAvailable = false;
        }
    });
    var errorBeforeRevert = false;
    it('should test the school edit page', function () {
        const BAD_PASS = {
            A: 'a',
            B: 'b',
            LONG_A: 'asdfjkla',
            LONG_B: 'qweruiop'
        };
        const GOOD_PASS = {
            A: 'asdfjkl1',
            B: 'qweruio1'
        };
        const MSGS = {
            FILL: 'Please fill out all required fields',
            AGREE: 'You must agree to the terms to submit import.',
            DIFF: 'Teacher and Student access codes must be different',
            MIN: 'Passwords must be a minimum of 8 characters and contain a number.',
            FILE: 'Please select an XLSX file to import.'
        };
        goToSchoolProfile();
        browser.waitForExist('.right');
        checkLink('.purple', SCHOOL_EDIT_URL);
        changeSchool('Foo school', 'We\'re so bar!');
        try {
            checkLink('#school-return-dash', SCHOOL_VIEW_URL);
            browser.waitForExist('div*=Foo school');
            browser.waitForExist('span*=We\'re so bar!');
            goBack(SCHOOL_EDIT_URL);
            changeSchool('Ginas school', 'description');
        }
        catch (e) {
            errorBeforeRevert = true;
            throw e;
        }
        browser.refresh();
        checkLink('#school-return-dash', SCHOOL_VIEW_URL);
        browser.waitForExist('div*=Ginas school');
        browser.waitForExist('span*=description');
        goBack(SCHOOL_EDIT_URL);
        trySubmit(BAD_PASS.A, null, MSGS.FILL);
        trySubmit(null, BAD_PASS.A, MSGS.FILL);
        trySubmit(BAD_PASS.A, BAD_PASS.A, MSGS.AGREE);
        trySubmit(BAD_PASS.A, BAD_PASS.A, MSGS.DIFF, true);
        trySubmit(BAD_PASS.A, BAD_PASS.B, MSGS.MIN, true);
        trySubmit(BAD_PASS.LONG_A, BAD_PASS.LONG_B, MSGS.MIN, true);
        trySubmit(GOOD_PASS.A, BAD_PASS.LONG_B, MSGS.MIN, true);
        trySubmit(BAD_PASS.LONG_A, GOOD_PASS.B, MSGS.MIN, true);
        trySubmit(GOOD_PASS.A, GOOD_PASS.B, MSGS.FILE, true);
    });
    if(errorBeforeRevert) {
        it('should change back the school to Gina\'s on failure', function() {
            login(SUPER_USER, SUPER_PASS);
            goToSchoolProfile();
            browser.waitForExist('.right');
            checkLink('.purple', SCHOOL_EDIT_URL);       
            changeSchool('Ginas school', 'description');
        });
    }
    it('should try to access the school routes without logging in', function () {
        browser.deleteCookie();
        browser.url('/');
        browser.waitForExist('#logout-button', 5000, true);
        invalidAccess(SCHOOL_PROFILE_URL);
        invalidAccess(SCHOOL_VIEW_URL);
        invalidAccess(SCHOOL_EDIT_URL);
    });
});
