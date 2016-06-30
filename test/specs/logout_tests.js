import { login } from './login.js';
import { USER, PASS } from '../test_data.js';
import { checkLink, goBack } from './helpers.js';

const URL = 'https://local.changemyworldnow.com';

describe('logout integration tests', function() {
    const LOGOUT_URL = `${URL}/logout`;
    const LOGIN_URL = `${URL}/login`;
    it('should logout of a logged in profile (corner button)', function() {
        login(USER, PASS);
        browser.waitForExist('#logout-button');
        checkLink('#logout-button', LOGOUT_URL, '.logout-page');
        browser.waitForExist('#login-form');
        expect(browser.getUrl()).to.equal(LOGIN_URL);
        browser.waitForExist('#logout-button', 5000, true); // make sure no logout button
    });
    it('should logout of a logged in profile (navMenu link)', function() {
        login(USER, PASS);
        var logoutLink = '#navMenu =Logout';
        browser.waitForExist('=Logout');
        checkLink('=Logout', LOGOUT_URL, '.logout-page');
        browser.waitForExist('#login-form');
        expect(browser.getUrl()).to.equal(LOGIN_URL);
        browser.waitForExist('#logout-button', 5000, true); // make sure no logout button
    });
    it('should redirect to login page if logout entered while logged out', function() {
        browser.url('/');
        browser.waitForExist('#logout-button', 5000, true); // make sure no logout button
        browser.url('/logout');
        browser.waitForExist('.logout-page');
        expect(browser.getUrl()).to.equal(LOGOUT_URL);
        browser.waitForExist('#login-form');
        expect(browser.getUrl()).to.equal(LOGIN_URL);
        browser.waitForExist('#logout-button', 5000, true); // make sure no logout button
    });
    // Will not run this test for now
    // it('should logout of a profile if left idle for too long', function() {
    //     login(USER, PASS);
    //     browser.pause(630000); // this is gonna suck
    //     browser.refresh();
    //     browser.waitForExist('.logout-page');
    //     expect(browser.getUrl()).to.equal(LOGOUT_URL);
    //     browser.waitForExist('#login-form');
    //     expect(browser.getUrl()).to.equal(LOGIN_URL);
    //     browser.waitForExist('#logout-button', 5000, true); // make sure no logout button
    // });
});
