var login_test = require("./login_test");


describe('tests the friends page', function () {
    it('should check that friends profile link takes to right profile', function () {
    	var friendLink;
    	login_test.login('teacher', 'business2');
    	browser.waitForExist('#navMenu', 999999);
    	browser.url('/districts');
        browser.waitForExist('.district-link', 999999);
        var districtLink = browser.getAttribute('.district-link', 'href');
        var splitLink = districtLink.split('/');
        var districtId = splitLink[splitLink.length-1]; //this will be the id of the district
        browser.click('.district-link');
        browser.waitForExist('.panel-heading', 999999);
        expect(browser.getUrl()).to.contain(districtId); //have to do contain because the urls slightly differ
   	})
});