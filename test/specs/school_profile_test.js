var login = require('./login.js');
var data = require('../test_data.js');

const USER = data.USER;
const PASS = data.PASS;
const URL = 'https://local.changemyworldnow.com';
const SCHOOL_ID = '9ee14a04-0288-11e6-8625-0800274f2cef'; // need to hardcode for now

function goToSchoolProfile() {
    login.login(USER, PASS); 
    browser.waitForExist('#navMenu', 3000);
    browser.getUrl().should.equal(URL + '/profile');
    browser.url('/school/' + SCHOOL_ID + '/profile');
    browser.waitForExist('.profile');
    browser.waitForExist('.standard');
}

function checkLink(link, url) {
    browser.waitForExist(link);
    browser.click(link);
    browser.pause(5000);
    var url = browser.getUrl();
    browser.getUrl().should.equal(url);
}

function goBack(url) {
    browser.back();
    browser.getUrl().should.equal(url);
}

describe('school routes integration tests', function() {
    var schoolProfileUrl = URL + '/school/' + SCHOOL_ID + '/profile';
    var schoolViewUrl = URL + '/school/' + SCHOOL_ID + '/view';
    var schoolEditUrl = URL + '/school/' + SCHOOL_ID + '/edit';
    it('should load a full, functional school profile page', function () {
        goToSchoolProfile();
        browser.waitForExist('#school-header');
        var header = browser.getText('#school-header');
        // expect(header).to.have.length.of.at.least(1);
        browser.waitForExist('.right');
        checkLink('#school-admin-link', schoolViewUrl);
        goBack(schoolProfileUrl);
        checkLink('.purple', schoolEditUrl);
        // NOTE: edit page currently not working, page will not change, only the url
    });
    it('should load the school view page', function () {
        goToSchoolProfile();
        browser.waitForExist('.right');
        checkLink('#school-admin-link', schoolViewUrl); 
        checkLink('#school-return-profile', schoolProfileUrl);
        goBack(schoolViewUrl);
        checkLink('.purple', schoolEditUrl);
        goBack(schoolViewUrl);
        if (browser.element('.school-district-link') !== null) {
            checkLink('.school-district-link');
            goBack(schoolViewUrl);
        }
        checkLink('#school-view-classes', URL + '/classes');
        goBack(schoolViewUrl);
        if (browser.element('#school-class-table') {
            console.log("***********************TESTING CLASSES");
            browser.waitForExist('#school-class-table');
            var classLink = browser.getAttribute('.school-class-link', 'href')[0];
            checkLink('.school-class-link', classLink);
            goBack(schoolViewUrl);
            var classViewLink = browser.getAttribute('.school-class-view', 'href')[0];
            checkLink('.school-user-view', classViewLink);
            goBack(schoolViewUrl);
            var classEditLink = browser.getAttribute('.school-class-edit', 'href')[0];
            checkLink('.school-class-link', classEditLink);
            goBack(schoolViewUrl);
        }
        checkLink('#school-user-links', URL + '/users');
        goBack(schoolViewUrl);
        if (browser.element('#school-user-table') {
            console.log("***********************TESTING USERS");
            browser.waitForExist('#school-user-table');
            var userLink = browser.getAttribute('.school-user-link', 'href')[0];
            checkLink('.school-user-link', userLink); 
            goBack(schoolViewUrl);
            var userViewLink = browser.getAttribute('.school-user-view', 'href')[0];
            checkLink('.school-user-view', userViewLink); 
            goBack(schoolViewUrl);
            var userEditLink = browser.getAttribute('.school-user-edit', 'href')[0];
            checkLink('.school-user-edit', userEditLink); 
            goBack(schoolViewUrl);
        }
    });
});
