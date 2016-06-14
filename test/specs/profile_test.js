var login_test = require("./login_test");

describe('tests editing class as teacher', function () {
    it('should check the elements on class profile page', function () {
    	login_test.login("teacher", "business");
    	browser.waitForExist('#navMenu', 3000);
    	browser.url('/classes');
    	browser.waitForExist('.datatable', 5000);
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('#class-dashboard-link', 999999)
        var link = browser.getAttribute('#class-dashboard-link', 'href');
        expect(link).to.equal('https://local.changemyworldnow.com/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
        browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/profile');
        browser.waitForExist('#joyous-impala003', 999999);
        var studentLink = browser.getAttribute('#joyous-impala003', 'href');
        expect(studentLink).to.equal('https://local.changemyworldnow.com/student/97443a7e-2806-11e6-9c3e-a5b7dc3d064c');
	});
});

