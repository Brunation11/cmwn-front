var login = require("./login");


describe('tests the friends page', function () {
    it('should check that friends profile link takes to right profile', function () {
    	var friendLink;
    	login.login('calm-swan005', 'ginger12');
    	browser.waitForExist('#navMenu', 60000);
    	browser.url('/friends');
    	browser.waitForExist('.friend');
    	var href = browser.getAttribute('.friend-link', 'href');
    	if(href[0].length === 1)
    		friendLink = href;
    	if(href[0].length > 1)
    		friendLink = href[0];
    	browser.click('.link-text');
    	browser.waitForExist('.user-metadata', 60000);
    	expect(browser.getUrl()).to.equal(friendLink);
   	})
});