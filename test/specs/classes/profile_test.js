var login_test = require('../login_test.js');

describe('tests editing class as teacher', function () {
    it('should check the elements on class profile page', function () {
    	login_test.login("teacher", "business2");
    	browser.waitForExist('#navMenu');
    	// check that Class Administrative Dashboard contains the right link
        browser.url('/classes');
    	browser.waitForExist('.datatable');
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('#class-dashboard-link')
        var link = browser.getAttribute('#class-dashboard-link', 'href');
        expect(link).to.equal('https://local.changemyworldnow.com/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        // check that student profile link is correct
        browser.waitForExist('#joyous-impala003');
        var studentLink = browser.getAttribute('#joyous-impala003', 'href');
        expect(studentLink).to.equal('https://local.changemyworldnow.com/student/97443a7e-2806-11e6-9c3e-a5b7dc3d064c');
        // check that "edit class" button works
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('.purple');
        browser.click('.purple');
        browser.waitForExist('#class-name');
        var currentUrl = browser.getUrl();
        expect(currentUrl).to.equal('https://local.changemyworldnow.com/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/edit');
	});
});

