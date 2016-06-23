var login = require("./login");

describe('tests logging in', function () {
    it('should check login is successful', function () {
    	login.login('teacher', 'business2');
    	expect(browser.getUrl()).to.equal('https://local.changemyworldnow.com/profile');
   	})
});