import _ from 'lodash';

var login = require("../login");
var data = require('../../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;
var STUDENT_USER = data.STUDENT_USER;
var STUDENT_PASSWD = data.STUDENT_PASS;


var checkViewContent = function() {
    browser.waitForExist('.panel');
    expect(browser.getHTML('.edit-profile .panel-heading', false)).to.have.length.above(0);
    browser.waitForExist('.profile-image');
    expect(browser.isVisible('.profile-pic')).to.be.ok;
    expect(browser.isVisible('.edit-student')).to.be.ok;
    expect(browser.isVisible('.edit-profile')).to.be.ok;
    browser.waitForExist('#edit-btn');
    expect(browser.isVisible('#edit-btn')).to.be.ok;
};

var navigateToView = function(tabId) {
    login.login(USER, PASSWD);
    browser.waitForExist('#navMenu');
    browser.url('/users');
    browser.waitForExist('.admin.datatable');
    // pick a student url from the table and extract the id
    var profileUrls = browser.getAttribute(`#${tabId} tbody a`, 'href');
    var urlParts = _.isString(profileUrls) ? profileUrls.split('/') : profileUrls[0].split('/');
    var profileId = urlParts[urlParts.length - 1];
    browser.url(`/profile/${profileId}/view`);
};


// Be aware that trying to run all of these tests at once does not always work
describe('teacher at own student\'s view', function () {
    beforeEach(navigateToView.bind(this, 'student-tab'));

    it('renders the correct content', function () {
        checkViewContent();
    });

    it('routes to editing profile', function () {
        browser.waitForExist('#edit-btn');
        browser.click('#edit-btn');
        var urlParts = browser.getUrl().split('/');
        expect(urlParts[urlParts.length - 1]).to.equal('edit');
    });

    it('deletes account', function () {
        // TODO: check that delete button works once test mode back-end is set up. LB 06/18/16
    });
});


// Be aware that trying to run all of these tests at once does not always work
describe('teacher at own view', function () {
    beforeEach(function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/view');
    });

    it('renders the correct content', function () {
        checkViewContent();
    });

    it('routes to editing profile', function () {
        browser.waitForExist('#edit-btn');
        browser.click('#edit-btn');
        var urlParts = browser.getUrl().split('/');
        expect(urlParts[urlParts.length - 1]).to.equal('edit');
    });

    it('deletes account', function () {
        // TODO: check that delete button works once test mode back-end is set up. LB 06/18/16
    });
});


describe('teacher at unassociated student\'s view', function () {
    it('renders 403', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/view');
        browser.waitForExist('#triggerederror.error403');
    });
});

describe('teacher at friend adults\'s view', function () {
    it('redirects to profile', function () {
        navigateToView('adult-tab');
        //TODO: Check redirect after CORE-1044 fixed. LB 06/18/16
    });
});

describe('student at his teacher\'s view', function () {
    it('redirects to profile', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/user/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c/view');
        //TODO: Check redirect after CORE-1044 fixed. LB 06/18/16
    });
});

describe('student at his student friend\'s view', function () {
    it('redirects to profile', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/user/97443a7e-2806-11e6-9c3e-a5b7dc3d064c/view');
        //TODO: Check redirect after CORE-1044 fixed. LB 06/18/16
    });
});

describe('student at an unassociated student\'s view', function () {
    it('renders 403', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/user/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/view');
        browser.waitForExist('#triggerederror.error403');
    });
});
