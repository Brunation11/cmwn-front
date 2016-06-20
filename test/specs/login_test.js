var exports = module.exports = {};
exports.login = function (name, psswd) {
    browser.url("/login");
    browser.setValue('#email', name);
    browser.setValue('#password', psswd);
    browser.pause(2000); // doesn't work without the pause
    browser.click('#login-button');
    browser.waitForExist('.upload', 5000); // if login occurs "upload" button will be on page
}

describe('tests logging in', function () {
    it('should check login is successful', function () {
    	exports.login('teacher', 'business2');
    	expect(browser.getUrl()).to.equal('https://local.changemyworldnow.com/profile');
   	})
});