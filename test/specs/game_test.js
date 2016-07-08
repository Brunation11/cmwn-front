var login = require("./login");
var USER = "teacher";
var PASSWD = "business2";
var time = 60000; // one minute

describe('tests buttons for game', function() {
    // Checks if the game takes up full screen if you press the "FULL SCREEN" button
    it('should make the game full screen when the button is pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/game/be-bright');
        browser.waitForExist('.game', time);
        // Changes focus to the iframe
        browser.frame(0);
        browser.waitForExist('.pl-game', time);
        // Gets the transform of the element
        var beforeSize = browser.getCssProperty('.pl-game', 'transform');
        // Extract just the size number
        var parenIdx = beforeSize.value.indexOf('(');
        var commaIdx = beforeSize.value.indexOf(',');
        var size1 = beforeSize.value.substring(parenIdx + 1, commaIdx);
        // Changes focus back to the parent
        browser.frameParent();
        browser.waitForExist('.purple', time);
        browser.click('.purple');
        browser.frame(0);
        browser.waitForExist('.pl-game', time);
        // Gets the transform of the element after pressing the "FULL SCREEN" button
        var afterSize = browser.getCssProperty('.pl-game', 'transform');
        var size2 = afterSize.value.substring(parenIdx + 1, commaIdx);
        expect(size2).to.be.above(size1);
    });

    // Checks the "DEMO MODE" button
    it('should assert the demo mode when pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/game/be-bright');
        browser.waitForExist('.green', time);
        // Checks if the demo mode works
        browser.click('.green');
        browser.frame(0);
        browser.waitForExist('.pl-game', time);
        // "DEMO" should be a class name after pressing "DEMO MODE"
        var className = browser.getAttribute('.pl-game', 'class');
        expect(className).to.contain('DEMO');
        browser.click('.pl-game');
        browser.waitForVisible('.next-screen', time);
        browser.click('.next-screen');
        // The next slide should also have an arrow
        browser.waitForExist('.next-screen', time);
        // Returns an array of which ".next-screen" classes are visible
        var visible = browser.isVisible('.next-screen');
        expect(visible).to.contain(true);
    });
    
    it('should quit the game when the yes button is pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/game/be-bright');
        browser.waitForExist('.game', time);
        // Changes focus to the iframe
        browser.frame(0);
        browser.waitForExist('.close', time);
        browser.click('.close');
        browser.waitForVisible('.quit-yes', time);
        browser.click('.quit-yes');
        browser.waitForVisible('.flip', time);
        var url = browser.getUrl();
        expect(url).to.equal('https://local.changemyworldnow.com/profile');
    });
    
    it('should go back to the same screen when the no button is pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/game/be-bright');
        browser.waitForExist('.game', time);
        // Changes focus to the iframe
        browser.frame(0);
        browser.waitForExist('.close', time);
        browser.click('.close');
        browser.waitForVisible('.quit-no', time);
        // Should be on the first screen after you click `No`
        browser.click('.quit-no');
        browser.waitForExist('.SCREEN-1');
        var currentScreen = browser.isVisible('.SCREEN-1');
        expect(currentScreen).to.be.equal(true);
    });
    
    it('should go to the next screen when PLAY is pressed', function() {
        login.login(USER, PASSWD);
        browser.waitForExist('.sidebar', time);
        browser.url('/game/be-bright');
        browser.waitForExist('.game', time);
        // Changes focus to the iframe
        browser.frame(0);
        browser.waitForVisible('.next-screen', time);
        browser.click('.next-screen');
        browser.waitForExist('.SCREEN-2', time);
        var nextScreen = browser.isVisible('.SCREEN-2');
        expect(nextScreen).to.equal(true);
    });
});