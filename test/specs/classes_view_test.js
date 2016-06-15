var login_test = require("./login_test");

var USER = "teacher";
var PASSWD = "business2";

describe('tests the view page for a class', function () {
    it('should check the elements on class view page', function () {
    	login_test.login(USER, PASSWD);
    	browser.waitForExist('#navMenu', 999999);
    	browser.url('/classes');
    	browser.waitForExist('.datatable', 5000);
    	// get the url of the first class in the table
    	var classUrl = browser.getAttribute('.class-url', 'href');
    	if(classUrl[0].length === 1){
    		//only one class item on the page
    		browser.url(classUrl);
    	}
    	else if(classUrl.length != 0){
    		//multiple classes on the page - classUrl is a list
    		browser.url(classUrl[0]);
    	}
        classUrl = browser.getUrl(); //class view url
        browser.waitForExist('#return-to-school', 999999);
        var schoolUrl = browser.getAttribute('#return-to-school', 'href');
        browser.click('#return-to-school');
        browser.waitForExist('.panel-heading');
        expect(schoolUrl).to.equal(browser.getUrl());
        browser.back();
        browser.waitForExist('#return-to-class');
        var classUrl = browser.getAttribute('#return-to-class', 'href');
        browser.click('#return-to-class');
        browser.waitForExist('#class-dashboard-link');
        expect(classUrl).to.equal(browser.getUrl());
        browser.back();
        var studentUrl;
        var student = browser.getAttribute('.student', 'href');
        if(student[0].length === 1){
            //only one student
            browser.click('.student');
            browser.waitForExist('.panel-heading');
            studentUrl = student;
            expect(studentUrl).to.equal(browser.getUrl());
        }
        else if(student.length != 0){
            //multiple students on page
            studentUrl = student[0];
            browser.click('.student');
            browser.waitForExist('.panel-heading');
            expect(studentUrl).to.equal(browser.getUrl());
        }
        rowser.back();
        // compose the url for editing the class
        var editUrl = '';
        var urlList = classUrl.split('/');
        for(var i=0;i<urlList.length-1;i++){
            editUrl += urlList[i] + '/';
        }
        editUrl += 'edit';
        browser.waitForExist('.purple');
        // click the edit button
        browser.click('.purple');
        browser.waitForExist('#class-name');
        expect(browser.getUrl()).to.equal(editUrl);
    });
});