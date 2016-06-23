var login_test = require("./login_test");

var USER = "teacher";
var PASSWD = "business2";

describe('tests the view page for a class', function () {
    it('should check the elements on class view page', function () {
    	login_test.login(USER, PASSWD);
    	browser.waitForExist('#navMenu', 60000);
    	browser.url('/classes');
    	browser.waitForExist('.datatable', 60000);
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
        browser.waitForExist('#return-to-school', 60000);
        var schoolUrl = browser.getAttribute('#return-to-school', 'href');
        browser.click('#return-to-school');
        browser.waitForExist('.panel-heading', 60000);
        expect(schoolUrl).to.equal(browser.getUrl());
        browser.back();
        browser.waitForExist('#return-to-class', 60000);
        var classUrl = browser.getAttribute('#return-to-class', 'href');
        browser.click('#return-to-class');
        browser.waitForExist('#class-dashboard-link', 60000);
        expect(classUrl).to.equal(browser.getUrl());
        browser.back();
        browser.waitForExist('.student');
        var studentUrl;
        var len;
        var student = browser.getAttribute('.student', 'href');
        browser.click('.student');
        browser.waitForExist('.panel-heading', 60000);
        if(student[0].length === 1){
            //only one student
            studentUrl = student;
        }
        else if(student.length != 0){
            //multiple students on page
            studentUrl = student[0];
        }
        var studentUrlList = studentUrl.split('/');
        len = studentUrlList.length;
        expect(browser.getUrl()).to.contain(studentUrlList[len-1]);
        browser.back();
        // compose the url for editing the class
        var editUrl = '';
        var urlList = classUrl.split('/');
        for(var i=0;i<urlList.length-1;i++){
            editUrl += urlList[i] + '/';
        }
        editUrl += 'edit';
        browser.waitForExist('.purple', 60000);
        // click the edit button
        browser.click('.purple');
        browser.waitForExist('#class-name', 60000);
        expect(browser.getUrl()).to.equal(editUrl);
    });
});