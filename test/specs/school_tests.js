import { login } from './login.js';
import { USER, PASS } from '../test_data.js';
import { checkLink, goBack } from './helpers.js';

const URL = 'https://local.changemyworldnow.com';
const SCHOOL_ID = '9ee14a04-0288-11e6-8625-0800274f2cef'; // need to hardcode for now
const MISSING = 'MISSING ELEMENT, SKIPPING: ';
const MSGS = {
    NO_CLASSES: 'No classes to view',
    NO_USERS: 'No users to view'
};

function goToSchoolProfile() {
    login(USER, PASS); 
    browser.waitForExist('#navMenu', 3000);
    browser.getUrl().should.equal(`${URL}/profile`);
    browser.url(`/school/${SCHOOL_ID}/profile`);
    browser.waitForExist('.profile');
    browser.waitForExist('.standard');
}

describe('school routes integration tests', function() {
    const SCHOOL_PROFILE_URL = `${URL}/school/${SCHOOL_ID}/profile`;
    const SCHOOL_VIEW_URL = `${URL}/school/${SCHOOL_ID}/view`;
    const SCHOOL_EDIT_URL = `${URL}/school/${SCHOOL_ID}/edit`;
    it('should load a full, functional school profile page', function () {
        var elementAvailable = false;
        goToSchoolProfile();
        browser.waitForExist('.right');
        checkLink('#school-admin-link', SCHOOL_VIEW_URL);
        goBack(SCHOOL_PROFILE_URL);
        checkLink('.purple', SCHOOL_EDIT_URL);
        goBack(SCHOOL_PROFILE_URL);
        // NOTE: edit page currently not working, page will not change, only the url
        try {
            browser.waitForExist('.school-district-link');
            elementAvailable = true;
        } catch (e) {
            console.log(`${MISSING}${MSGS.NO_DISTRICTS}`);
        }
        if (elementAvailable) {
            var districtLink = browser.getAttribute('.school-district-link', 'href')[0];
            checkLink('./school-district-link', districtLink);
            goBack(SCHOOL_PROFILE_URL);
            elementAvailable = false;
        }
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
});
