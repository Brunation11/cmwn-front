var login = require("./login");
var USER = "teacher";
var PASSWD = "business2";
var time = 60000; // one minute

describe('tests opening game on games page', function() {
    // Checks if the game opens when you press on the game
    it('should assert opening the game when pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/games');
        //browser.url('/profile');
        browser.waitForExist('.flip', time);
        // Presses the game to open it
        browser.click('.flip');
        browser.waitForExist('.modal-body', time);
        // Focuses on the iframe to access elements inside
        browser.frame(0);
        browser.waitForExist('.pl-game', time);
        // Checks if the game popped up
        var visible = browser.isVisible('.pl-game');
        expect(visible).to.equal(true);
        // Changes focus back to the parent
        browser.frameParent();
        // Checks if the purple button shows up
        var purpleBtn = browser.getText('.purple');
        expect(purpleBtn).to.equal('FULL SCREEN');
        var pBtnVisible = browser.isVisible('.purple');
        expect(pBtnVisible).to.equal(true);
        // Checks if the green button shows up
        var greenBtn = browser.getText('.green');
        expect(greenBtn).to.equal('DEMO MODE');
        var gBtnVisible = browser.isVisible('.green');
        expect(gBtnVisible).to.equal(true);
    });
    
    // Checks if pressing "(close)" closes the game
    it('should close the game when pressing the (close) link', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/games');
        //browser.url('/profile');
        browser.waitForExist('.flip', time);
        // Presses the game to open it
        browser.click('.flip');
        browser.waitForExist('.modal-close', time);
        browser.click('.modal-close');
        browser.waitForVisible('.sidebar', time);
        // Checks if the "(close)" link is still shown
        var visible = browser.isVisible('.modal-close');
        expect(visible).to.not.equal(true);
    });
});