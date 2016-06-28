var login = require("../login");
var data = require('../../test_data.js');
var USER = data.USER;
var PASSWD = data.PASS;

describe('tests viewing own profile as teacher', function () {
    it('should check the elements on profile page', function () {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/profile');
        browser.waitForExist('.layout', 60000);
        expect(browser.element('.layout')).to.be.ok;
        expect(browser.element('.flipboard')).to.be.ok;
        expect(browser.element('#game-modal').value).to.equal(null);
        
        //browser.elements('#game-modal');
        //expect(browser.getTagName('#game-modal')).to.throw(/An element could not be located/)
        //console.log(browser.getTagName('.modal'));
        var flipTags = browser.getTagName('.flip');
        expect(flipTags).to.be.an.instanceof(Array);
        expect(flipTags).to.have.length.above(1);
    });
    
    it('should display modal when clicking a flip', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/profile');
        browser.waitForExist('.flipboard', 60000);
        browser.waitForExist('.item', 60000);
        browser.click('.item');
        browser.waitForVisible('#game-modal');
        console.log(browser.element('#game-modal'));
        console.log(browser.elements('#game-modal'));
        expect(browser.getCssProperty('#game-modal', 'display').value).to.equal('block');
    });
    
    it('should close modal using close link', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/profile');
        browser.waitForExist('.flipboard', 60000);
        browser.waitForExist('.item', 60000);
        browser.click('.item');
        browser.waitForVisible('.modal-close');
        browser.click('.modal-close');
        elem = browser.element('#game-modal');
        elem.waitForValue(null);
    });
    
    it('should close modal with prompt using \'X\'', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('#navMenu', 60000);
        browser.url('/profile');
        browser.waitForExist('.flipboard', 60000);
        browser.waitForExist('.item', 60000);
        browser.click('.item');
        
        // check canceling quit game
        browser.waitForVisible('.close');
        browser.click('.close');
        browser.waitForVisible('#quit');
        expect(browser.getCssProperty('#quit', 'opacity').value).to.equal(1);
        browser.waitForVisible('.no');
        browser.click('.no');
        browser.waitForVisible('.close');
        expect(browser.getCssProperty('#quit', 'opacity').value).to.equal(0);

        
        // check actually quitting game
        browser.click('.close');
        browser.waitForVisible('#quit');
        browser.waitForVisible('.yes');
        browser.click('.yes');
        elem = browser.element('#game-modal');
        elem.waitForValue(null);
    });
});