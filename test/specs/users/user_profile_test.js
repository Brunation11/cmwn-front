var login = require("../login");
var data = require('../../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;
var STUDENT_USER;
var STUDENT_PASSWD;
// TODO: ask chuck to setup mock student

var checkAnotherProfileContents = function (url) {
    browser.url(url);
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

describe('tests viewing student profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        checkAnotherProfileContents('/profile/97443a7e-2806-11e6-9c3e-a5b7dc3d064c');
    });
});

describe('tests viewing another adult profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        checkAnotherProfileContents('/profile/c53f9ebc-276d-11e6-9fc0-e238f8ec1f6c');
    });
});

describe('tests viewing own profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        viewOwnProfileConents();
    });

    it('should display modal when clicking a flip', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        checkModalOpen();
    });

    it('should close modal using close link', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu');
        checkModalClose();
    });
});

/*
describe('tests viewing own profile as student', function () {
    it('should check the elements on profile page', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        viewOwnProfileConents();
    });

    it('should display modal when clicking a flip', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        checkModalOpen();
    });

    it('should close modal using close link', function () {
        login.login(STUDENT_USER, STUDENT_PASSWD);
        browser.waitForExist('#navMenu');
        checkModalClose();
    });
});*/