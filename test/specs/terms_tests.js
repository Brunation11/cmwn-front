import { login } from './login.js';
import { USER, PASS } from '../test_data.js';
import { checkLink, goBack } from './helpers.js';

const URL = 'https://local.changemyworldnow.com';

function checkPage() {
    var termsUrl = `${URL}/terms`;
    browser.waitForExist('.links');
    browser.waitForExist('#terms-and-conds');
    browser.click('#terms-and-conds');
    var tabIds = browser.getTabIds();
    browser.switchTab(tabIds[tabIds.length - 1]);
    browser.waitForExist('.terms');
    expect(browser.getUrl()).to.equal(termsUrl);
    browser.waitForExist('#home-link');
    var homeLink = browser.getText('#home-link');
    checkLink('#home-link', homeLink);
    goBack(termsUrl);
    browser.waitForExist('#ftc-link-1');
    var ftcLink1 = browser.getText('#ftc-link-1');
    checkLink('#ftc-link-1', ftcLink1);
    goBack(termsUrl);
    browser.waitForExist('#ftc-link-2');
    var ftcLink2 = browser.getText('#ftc-link-2');
    checkLink('#ftc-link-2', ftcLink1);
    goBack(termsUrl);
    var googleLink = browser.getText('#google-link');
    browser.waitForExist('#mail-to');
    expect(browser.getAttribute('#mail-to', 'href')).to.equal('mailto:info@changemyworldnow.com');
}

describe('terms and condition page tests', function () {
    it('should load the terms page when logged out', function () {
        browser.url('/');
        checkPage();
    });
    it('should load the terms page when logged in', function () {
        login(USER, PASS);
        checkPage();
        checkLink('#logout-button', `${URL}/logout`, '.logout-page');
        browser.waitForExist('#login-form');
        expect(browser.getUrl()).to.equal(`${URL}/login`);
    });
});
