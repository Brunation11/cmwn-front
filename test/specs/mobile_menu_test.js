var login_test = require("./login_test");

describe('checks that hamburger menu works', function () {
	it('should assert that hamburger menu works', function () {
        login_test.login('teacher', 'business');
        browser.windowHandleSize({width: 400, height: 800});
        browser.waitForExist('.glyphicon');
        browser.click('.glyphicon');
        browser.pause(3000);
        var sideBarClass = browser.getAttribute('#navMenu', 'class');
        expect(sideBarClass).to.include('open');
    });
})