var login = require("./login");
var data = require('../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;

describe('tests logging in', function () {
    it('should check login is successful', function () {
    	login.login(USER, PASSWD);
    	expect(browser.getUrl()).to.equal('https://local.changemyworldnow.com/profile');
   	})
});
