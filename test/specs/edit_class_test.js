var login_test = require("./login_test");

describe('tests editing class as teacher', function () {
    it('should assert editing class was successful', function () {
    	login_test.login("teacher", "business");
    	browser.waitForExist('#navMenu', 3000);
    	browser.url('/classes');
    	browser.waitForExist('.datatable');
    	browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
    	browser.waitForExist('.purple', 3000);
    	browser.click('.purple');
    	browser.waitForExist('#class-name', 5000);
    	browser.setValue('#class-name', 'New Name');
    	browser.setValue('#descript', 'Description');
    	browser.click('#save-button');
    	browser.waitForExist('.humane-flatty-animate', 3000);
    	browser.waitForText('.humane-flatty-animate', 3000);
    	var a = browser.getText('.humane-flatty-animate');
    	expect(a).to.equal("Class Updated");
	});

    // leaving class name and description blank
    it('should display an error', function () {
    	login_test.login("teacher", "business");
    	browser.waitForExist('#navMenu', 3000);
    	browser.url('/classes');
    	browser.waitForExist('.datatable');
    	browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
    	browser.waitForExist('#editButton', 5000);
    	browser.click('.purple');
    	browser.waitForExist('#class-name', 3000);
    	browser.clearElement('#class-name');
    	browser.pause(2000);
    	browser.clearElement('#descript');
    	browser.pause(2000);
    	browser.click('#save-button');
    	browser.waitForExist('.humane-flatty-error', 3000);
	});

	// leaving description blank
	it('should assert editing class was successful', function () {
    	login_test.login("teacher", "business");
    	browser.waitForExist('#navMenu', 3000);
    	browser.url('/classes');
    	browser.waitForExist('.datatable');
    	browser.url('/class/9ee15bf2-0288-11e6-8b6b-0800274f2cef/view');
    	browser.waitForExist('#editButton', 3000);
    	browser.click('.purple');
    	browser.waitForExist('#class-name', 3000);
    	browser.setValue('#class-name', 'Ginas Class A');
    	browser.clearElement('#descript');
    	browser.click('#save-button');
    	browser.waitForExist('.humane-flatty-animate', 3000);
    	browser.waitForText('.humane-flatty-animate', 3000);
    	var a = browser.getText('.humane-flatty-animate');
    	expect(a).to.equal("Class Updated");
	});
});