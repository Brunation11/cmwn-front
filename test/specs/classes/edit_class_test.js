/*global browser expect */
var login = require('./login');
var data = require('../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;

//selects the first class in the table
describe('tests editing class as teacher', function () {
    it('should assert editing class was successful', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/classes');
        browser.waitForExist('.datatable', 60000);
        // get the url of the first class in the table
        var classUrl = browser.getAttribute('.class-url', 'href');
        if (classUrl[0].length < 2){
            //only one class item on the page
            browser.url(classUrl);
        } else {
            //multiple classes on the page - classUrl is an array
            browser.url(classUrl[0]);
        }
        browser.waitForExist('.purple', 60000);
        browser.click('.purple');
        browser.waitForExist('#class-name', 60000);
        browser.setValue('#class-name', 'New Name');
        browser.setValue('#descript', 'Description');
        browser.click('#save-button');
        browser.waitForExist('.humane-flatty-animate', 60000);
        browser.waitForText('.humane-flatty-animate', 60000);
        var a = browser.getText('.humane-flatty-animate');
        expect(a).to.equal('Class Updated');
    });

    // leaving class name and description blank
    it('should display an error', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/classes');
        browser.waitForExist('.datatable', 60000);
        // get the url of the first class in the list
        var classUrl = browser.getAttribute('.class-url', 'href');
        if (classUrl[0].length < 2){
            //only one class item on the page
            browser.url(classUrl);
        } else {
            //multiple classes on the page - classUrl is an array
            browser.url(classUrl[0]);
        }
        browser.waitForExist('#editButton', 60000);
        browser.click('.purple');
        browser.waitForExist('#class-name', 60000);
        browser.clearElement('#class-name');
        browser.pause(2000);
        browser.clearElement('#descript');
        browser.pause(2000);
        browser.click('#save-button');
        browser.waitForExist('.humane-flatty-error', 60000);
    });

    // leaving description blank
    it('should assert editing class was successful', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/classes');
        browser.waitForExist('.datatable');
        // get the url of the first class in the list
        var classUrl = browser.getAttribute('.class-url', 'href');
        if (classUrl[0].length < 2){
            //only one class item on the page
            browser.url(classUrl);
        } else {
            //multiple classes on the page - classUrl is an array
            browser.url(classUrl[0]);
        }
        browser.waitForExist('#editButton', 60000);
        browser.click('.purple');
        browser.waitForExist('#class-name', 60000);
        browser.setValue('#class-name', 'Ginas Class A');
        browser.clearElement('#descript');
        browser.click('#save-button');
        browser.waitForExist('.humane-flatty-animate', 60000);
        browser.waitForText('.humane-flatty-animate', 60000);
        var a = browser.getText('.humane-flatty-animate');
        expect(a).to.equal('Class Updated');
    });
});
