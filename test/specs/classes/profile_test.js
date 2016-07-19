var login = require("./login");
var data = require('../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;

describe('tests editing class as teacher', function () {
    it('should check the elements on class profile page', function () {
    	login_test.login(USER, PASSWD);
    	browser.waitForExist('#navMenu', 60000);
    	// check that Class Administrative Dashboard contains the right link
        browser.url('/classes');
    	browser.waitForExist('.datatable', 60000);
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('#class-dashboard-link', 60000)
        var link = browser.getAttribute('#class-dashboard-link', 'href');
        expect(link).to.equal('https://local.changemyworldnow.com/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        // check that student profile link is correct
        browser.waitForExist('#joyous-impala003', 60000);
        var studentLink = browser.getAttribute('#joyous-impala003', 'href');
        expect(studentLink).to.equal('https://local.changemyworldnow.com/student/97443a7e-2806-11e6-9c3e-a5b7dc3d064c');
        // check that "edit class" button works
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('.purple', 60000);
        browser.click('.purple');
        browser.waitForExist('#class-name', 60000);
        var currentUrl = browser.getUrl();
        expect(currentUrl).to.equal('https://local.changemyworldnow.com/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/edit');
	});
});

