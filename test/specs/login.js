var exports = module.exports = {};
exports.login = function (name, psswd) {
    browser.url("/login");
    browser.waitForExist('#username');
    browser.waitForExist('#password');
    browser.setValue('#username', name);
    browser.setValue('#password', psswd);
    browser.pause(2000); // doesn't work without the pause
    browser.click('#login-button');
    browser.waitForExist('.upload'); // if login occurs "upload" button will be on page
}
