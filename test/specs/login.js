var exports = module.exports = {};
exports.login = function (name, psswd) {
    browser.url("/login");
    browser.setValue('#email', name);
    browser.setValue('#password', psswd);
    browser.pause(2000); // doesn't work without the pause
    browser.click('#login-button');
    browser.waitForExist('.upload', 50000); // if login occurs "upload" button will be on page
}