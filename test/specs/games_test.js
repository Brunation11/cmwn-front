var login_test = require('./login_test.js');
var USER = 'teacher';
var PASSWD = 'business2';

describe('tests opening game on games page', function() {
    // Checks if the game opens when you press on "PLAY NOW!"
    it('should assert opening the game when pressed', function() {
        login_test.login(USER, PASSWD);
        browser.waitForExist('.sidebar', 4000);
        browser.url('/games');
        browser.waitForExist('.panel-body', 4000);
        browser.click('.play');
        browser.waitForExist('.pl-scope pl-game READY', 99999);
        // Checks if the game popped up since its width is 960
        var width = browser.getElementSize('.pl-scope pl-game READY', 'width');
        expect(width).to.equal(960);
        // Checks if the purple button shows up
        var purpleBtn = browser.getText('.purple standard btn btn-default');
        expect(purpleBtn).to.equal("Full Screen");
        // Checks if the green button shows up
        var greenBtn = browser.getText('.green standard btn btn-default');
        expect(greenBtn).to.equal("Demo Mode");
    });
    
    // Checks if pressing "(close)" closes the game
    it('should assert closing the game when pressed', function() {
        login_test.login(USER, PASSWD);
        browser.waitForExist('.sidebar', 4000);
        browser.url('/games');
        browser.waitForExist('.panel-heading', 4000);
        browser.click('.play');
        browser.waitForExist('.modal-close', 4000);
        browser.click('.modal-close');
        browser.pause(3000);
        // Checks if the "(close)" link is still shown
        var source = browser.getSource();
        var idx = source.indexOf(".modal-close");
        expect(idx).to.equal(-1);
        /*
        var tagName = browser.getTagName('.modal-close');
        expect(tagName).to.be.null;
        */
    });
});
