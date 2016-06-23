var login_test = require('./login_test.js');
var USER = 'teacher';
var PASSWD = 'business2';

describe('tests buttons for game', function() {
    // Checks if the game takes up full screen if you press the "FULL SCREEN" button
    it('should assert opening the game when pressed', function() {
        login_test.login(USER, PASSWD);
        browser.waitForExist('.sidebar', 4000);
        browser.url('/game/happy-fish-face');
        browser.waitForExist('#happy-fish-face', 4000);
        // check the size of the game
        // Checks if pressing the full screen button increases the size of the game
        var beforeSize = browser.getAttribute('.purple standard btn btn-default', 'zoom');
        browser.click('.purple standard btn btn-default');
        var afterSize = browser.getAttribute('.purple standard btn btn-default', 'zoom');
        expect(afterSize).to.be.above(beforeSize);
    });
    
    // Checks the "DEMO MODE" button
    it('should assert the demo mode when pressed', function() {
        login_test.login(USER, PASSWD);
        browser.waitForExist('.sidebar', 4000);
        browser.url('/game/happy-fish-face');
        browser.waitForExist('#happy-fish-face', 4000);
        // check the size of the game
        // Checks if the demo mode works
        browser.click('.green standard btn btn-default');
        browser.waitForExist('.pl-scope pl-game READY DEMO', 99999);
        var location1 = browser.getLocation('.next-screen', 'y');
        browser.click('.next-screen'); // Press play
        browser.pressKeycode(22); // press the right key
        // It should go to the next slide
        var location2 = browser.getLocation('next-screen', 'y');
        expect(location1).to.not.equal(location2);
    });
});
