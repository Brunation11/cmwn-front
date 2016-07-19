import _ from 'lodash';
var login = require("../login");
var data = require('../../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;
var STUDENT_USER = data.STUDENT_USER;
var STUDENT_PASS = data.STUDENT_PASS;

var navigateToProfile = function(tabId) {
    browser.url('/users');
    browser.waitForExist('.admin.datatable');
    // pick a student url from the table and extract the id
    var profileUrls = browser.getAttribute(`#${tabId} tbody a`, 'href');
    var urlParts = _.isString(profileUrls) ? profileUrls.split('/') : profileUrls[0].split('/');
    var profileId = urlParts[urlParts.length - 1];
    browser.url(`/profile/${profileId}`);
};

var checkAnotherProfileContents = function () {
    browser.waitForExist('.panel');
    expect(browser.getHTML('.panel-heading', false)).to.have.length.above(0);
    expect(browser.isVisible('#username')).to.be.ok;
    expect(browser.isVisible('#first_name')).to.be.ok;
    expect(browser.isVisible('#last_name')).to.be.ok;
    expect(browser.isVisible('#birthday')).to.be.ok;

    browser.waitForExist('.profile-image');
    expect(browser.isVisible('.profile-pic')).to.be.ok;
};

var viewOwnProfileConents = function () {
    browser.url('/profile');
    browser.waitForExist('.layout');
    expect(browser.isVisible('.layout')).to.be.ok;
    browser.waitForExist('.flipboard');
    expect(browser.isVisible('.flipboard')).to.be.ok;
    expect(browser.element('#game-modal').value).to.equal(null);

    browser.waitForExist('.flip');
    var flipTags = browser.getTagName('.flip');
    expect(flipTags).to.be.an.instanceof(Array);
    expect(flipTags).to.have.length.above(1);
};

var checkModalOpen = function () {
    browser.url('/profile');
    browser.waitForExist('.flipboard');
    browser.waitForExist('#litter-bug');
    browser.element('#litter-bug').click('a');
    browser.waitForVisible('#game-modal');
    expect(browser.getCssProperty('#game-modal', 'display').value).to.equal('block');
};

var checkModalClose = function () {
    browser.url('/profile');
    browser.waitForExist('.flipboard');
    browser.waitForExist('#litter-bug');
    browser.element('#litter-bug').click('a');
    browser.waitForVisible('#game-modal');
    browser.waitForExist('#close-modal');
    browser.click('#close-modal');
    browser.waitUntil(function () {
        return browser.element('#game-modal').value === null;
    }, 15000);
};

// Be aware that trying to run all of these tests at once does not always work

describe('tests viewing student profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        navigateToProfile('student-tab');
        checkAnotherProfileContents();
    });
});

describe('tests viewing another adult profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        navigateToProfile('adult-tab');
        checkAnotherProfileContents();
    });
});

describe('tests viewing own profile as teacher', function () {
    beforeEach(function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
    });

    it('should check the elements on profile page', function () {
        viewOwnProfileConents();
    });

    it('should display modal when clicking a flip', function () {
        checkModalOpen();
    });

    it('should close modal using close link', function () {
        checkModalClose();
    });
});


describe('tests viewing own profile as student', function () {
    beforeEach(function () {
        login.login(STUDENT_USER, STUDENT_PASS);
        browser.waitForExist('#navMenu');
    });

    it('should check the elements on profile page', function () {
        viewOwnProfileConents();
    });

    it('should display modal when clicking a flip', function () {
        checkModalOpen();
    });

    it('should close modal using close link', function () {
        checkModalClose();
    });
});

describe('adult viewing unassociated student\'s profile', function () {
    it('should render 403', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/');
        browser.waitForExist('#triggerederror.error403');
    });
});

describe('student viewing unassociated student\'s profile', function () {
    it('should render 403', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        browser.url('/profile/81d58d4e-2844-11e6-a284-2dd9dce0dc3f/');
        browser.waitForExist('#triggerederror.error403');
    });
});
