var login_test = require("./login_test");


describe('tests the view page for a class', function () {
    it('should check the elements on class view page', function () {
    	var friendLink;
    	login_test.login('calm-swan005', 'ginger12');
    	browser.waitForExist('#navMenu', 999999);
    	browser.url('/friends');
    	browser.waitForExist('.friend');
    	var href = browser.getAttribute('friend-link');
    	if(href[0].length === 1)
    		friendLink = href;
    	if(href[0] > 0)
    		friendLink = href[0];
    	browser.click('.friend');
    	browser.waitForExist('.user-metadata');
    	expect(browser.getUrl()).to.equal(friendLink);