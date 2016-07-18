import _ from 'lodash';

var login = require("../login");
var data = require('../../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;
var STUDENT_USER = data.STUDENT_USER;
var STUDENT_PASSWD = data.STUDENT_PASS;

var checkEditContent = function() {
    browser.waitForExist('.profile-image');
    expect(browser.isVisible('.profile-pic')).to.be.ok;
    browser.waitForExist('.panel');
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.have.length.above(0);
    expect(browser.isVisible('.edit-student')).to.be.ok;
    expect(browser.isVisible('.edit-profile')).to.be.ok;
    expect(browser.isVisible('#username')).to.be.ok;
    expect(browser.isVisible('#email')).to.be.ok;
    expect(browser.isVisible('#first-name')).to.be.ok;
    expect(browser.isVisible('#last-name')).to.be.ok;
    expect(browser.isVisible('#save-btn')).to.be.ok;

    // date dropdown content
    browser.waitForExist('#month-input');
    browser.waitForExist('#day-input');
    browser.waitForExist('#year-input');
    expect(browser.isVisible('#month-input')).to.be.ok;
    expect(browser.isVisible('#day-input')).to.be.ok;
    expect(browser.isVisible('#year-input')).to.be.ok;

    // change password content
    browser.waitForExist('#old-pass');
    browser.waitForExist('#new-pass');
    browser.waitForExist('#confirm-pass');
    browser.waitForExist('#update-btn');
    expect(browser.isVisible('#old-pass')).to.be.ok;
    expect(browser.isVisible('#new-pass')).to.be.ok;
    expect(browser.isVisible('#confirm-pass')).to.be.ok;
    expect(browser.isVisible('#update-btn')).to.be.ok;
};

var changeUsername = function (newUsername) {
    browser.waitForExist('#username');
    browser.setValue('#username', newUsername);
    expect(browser.getValue('#username')).to.equal(newUsername);
    browser.click('#save-btn');
    browser.refresh();
    browser.waitForExist('#username');
    expect(browser.getValue('#username')).to.equal(newUsername);
    expect(browser.getHTML('.username.regular-text a', false)).to.equal(newUsername);
};

var changeFirstName = function (newName) {
    var header;
    browser.waitForExist('#first-name');
    browser.setValue('#first-name', newName);
    expect(browser.getValue('#first-name')).to.equal(newName);
    header = `Edit User: ${newName} ${browser.getValue('#last-name')}`;
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
    browser.click('#save-btn');
    browser.refresh();
    browser.waitForExist('#first-name');
    expect(browser.getValue('#first-name')).to.equal(newName);
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
};

var changeLastName = function (newName) {
    var header;
    browser.waitForExist('#last-name');
    browser.setValue('#last-name', newName);
    expect(browser.getValue('#last-name')).to.equal(newName);
    header = `Edit User: ${browser.getValue('#first-name')} ${newName}`;
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
    browser.click('#save-btn');
    browser.refresh();
    browser.waitForExist('#last-name');
    expect(browser.getValue('#last-name')).to.equal(newUsername);
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
};

var changeBirthday = function (day, month, year) {
    browser.waitForExist('#day-input');
    browser.waitForExist('#month-input');
    browser.waitForExist('#year-input');
    browser.selectByValue('#month-input', month);
    browser.selectByValue('#day-input', day);
    browser.selectByValue('#year-input', year);
    browser.click('#save-btn');
    browser.refresh();
    browser.waitForExist('#year-input');
    expect(browser.getValue('#month-input')).to.equal('' + month);
    expect(browser.getValue('#day-input')).to.equal('' + day);
    expect(browser.getValue('#year-input')).to.equal('' + year);
};

var checkBirthday = function () {
    browser.waitForExist('#month-input');
    browser.waitForExist('#day-input');
    browser.waitForExist('#year-input');
    var month = _.parseInt(browser.getValue('#month-input'));
    var day = _.parseInt(browser.getValue('#day-input'));
    var year = _.parseInt(browser.getValue('#year-input'));
    var newMonth = month > 11 ? 1 : month + 1;
    var newDay = day > 27 ? 1 : day + 1;
    var newYear = year > 2015 ? 1990 : year + 1;
    changeBirthday(newDay, newMonth, newYear);
    changeBirthday(day, month, year);
};

var tryErrorPass = function (newPass, confirmPass, curPass) {
    browser.waitForExist('#old-pass');
    browser.waitForExist('#new-pass');
    browser.waitForExist('#confirm-pass');
    browser.waitForExist('#update-btn');
    browser.setValue('#old-pass', curPass);
    browser.setValue('#new-pass', newPass);
    browser.setValue('#confirm-pass', confirmPass);
    browser.click('#update-btn');
    browser.waitForVisible('.humane-flatty.humane-flatty-error');
};


describe('teacher editing own profile', function () {
    beforeEach(function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/edit');
    });
    /*
    it('has the correct content', function () {
        checkEditContent();
    });

    it('updates username', function () {
        browser.waitForExist('#username');
        var curUsername = browser.getValue('#username');
        expect(browser.getHTML('.username.regular-text a', false)).to.equal(curUsername);
        changeUsername('testing_username');
        changeUsername(curUsername);
    });

    it('updates first name', function () {
        browser.waitForExist('#first-name');
        var curName = browser.getValue('#first-name');
        var header = `Edit User: ${curName} ${browser.getValue('#last-name')}`;
        expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
        changeFirstName('testing_first_name');
        changeFirstName(curName);
    });

    it('updates last name', function () {
        browser.waitForExist('#last-name');
        var curName = browser.getValue('#last-name');
        var header = `Edit User: ${browser.getValue('#first-name')} ${curName}`;
        expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
        changeFirstName('testing_last_name');
        changeFirstName(curName);
    });

    it('updates birthday', function () {
        checkBirthday();
    });

    it('fails for too short password', function () {
       tryErrorPass('busy1', 'busy1', PASSWD);
    });

    it('fails for no number password', function () {
       tryErrorPass('business', 'business', PASSWD);
    });

    it('fails for mismatched passwords', function () {
       tryErrorPass('business1', 'business3', PASSWD);
    });*/

    // This test will fail currently; ticket CORE-931; do not run bc will change password
    /*it('fails for too short password', function () {
        tryErrorPass('business31', 'business31', PASSWD + PASSWD);
    });*/
});

/*
describe('teacher editing own student\'s profile', function () {
    beforeEach(function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/edit');
    });

    it('has the correct content', function () {
        checkEditContent();
    });

    it('updates username', function () {
        var curUsername;
        browser.waitForExist('#username');
        curUsername = browser.getValue('#username');
        expect(browser.getHTML('.username.regular-text a', false)).to.equal(curUsername);
        changeUsername('testing_username');
        changeUsername(curUsername);
    });

    it('updates first name', function () {
        var curName;
        var header;
        browser.waitForExist('#first-name');
        curName = browser.getValue('#first-name');
        header = `Edit User: ${curName} ${browser.getValue('#last-name')}`;
        expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
        changeFirstName('testing_first_name');
        changeFirstName(curName);
    });

    it('updates last name', function () {
        var curName;
        var header;
        browser.waitForExist('#last-name');
        curName = browser.getValue('#last-name');
        header = `Edit User: ${browser.getValue('#first-name')} ${curName}`;
        expect(browser.getHTML('.edit-profile .panel-heading', false)).to.equal(header);
        changeFirstName('testing_last_name');
        changeFirstName(curName);
    });

    it('updates birthday', function () {
        checkBirthday();
    });
});*/
/*
describe('teacher editing unassociated student\'s profile', function () {
    it('renders 403', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/edit');
        browser.waitForExist('#triggerederror.error403');
    });
});


describe('teacher editing another adults\'s profile', function () {
    it('renders 403', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/edit');
        browser.waitForExist('#triggerederror.error403');
    });
});

describe('student editing another student\'s profile', function () {
    it('renders 403', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c/edit');
        browser.waitForExist('#triggerederror.error403');
    });
});

describe('student editing another student\'s profile', function () {
    it('renders 403', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/edit');
        browser.waitForExist('#triggerederror.error403');
    });
});*/