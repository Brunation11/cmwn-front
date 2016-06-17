var login = require('./login_test');

const USER = 'teacher';
const PASS = 'business2';
const URL = 'https://local.changemyworldnow.com';
const SCHOOL_ID = '9ee14a04-0288-11e6-8625-0800274f2cef'; // need to hardcode for now

describe('school profile integration test', function() {
    it('should load a full, functional school profile page', function() {
        login.login(USER, PASS); 
    	browser.waitForExist('#navMenu', 3000);
        browser.getUrl().should.equal(URL + '/profile');
        browser.url('/school/' + SCHOOL_ID + '/profile');
        browser.waitForExist('.profile');
        browser.waitForExist('.standard');
        browser.waitForExit('#school-header');
        var header = browser.getText('#school-header');
        expect(header).to.have.length.of.at.least(1);
        browser.waitforExist('.right');
        browser.waitforExist('#school-admin-link');
        browser.click('#school-admin-link');
        browser.getUrl().should.equal(URL + '/school/' + SCHOOL_ID + '/view');
        browser.click('#school-return-profile');
        browser.getUrl().should.equal(URL + '/school/' + SCHOOL_ID + '/profile');
        browser.waitforExist('#school-edit-link');
        browser.click('#school-edit-link');
        browser.getUrl().should.equal(URL + '/school/' + SCHOOL_ID + '/edit');
        // NOTE: edit page currently not working, will display errors, this is ok
    });
});
