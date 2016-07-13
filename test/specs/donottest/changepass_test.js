var login = require("../login");
const TIME = 60000; // one minute

describe('tests changing password', function() {
    // Checks if changing the password works
    it('should assert changing password was successful', function() {
        login.login("teacher", "business2");
        browser.waitForExist('.sidebar', TIME);
        browser.url('/profile/edit');
        browser.waitForExist('#old-pass', TIME);
        browser.setValue('#old-pass', 'business2');
        browser.setValue('#new-pass', 'business1');
        browser.setValue('#confirm-pass', 'business1');
        browser.click('#update-btn');
        browser.waitForExist('#show-msg', TIME);
        var msg = browser.getText('#show-msg');
        expect(msg).to.equal("You have successfully updated your password.\nBe sure to remember for next time!");
        browser.url('/profile');
        browser.waitForExist('#login-form', TIME);
        browser.getUrl().should.equal('https://local.changemyworldnow.com/login');
        // Checks if you successfully log back in with new password
        login.login("teacher", "business1");
        browser.waitForExist('.sidebar', TIME);
        browser.getUrl().should.equal('https://local.changemyworldnow.com/profile');
    });
    
    // Should display an error if the password you inserted in "New Password" and "Confirm Password" are different
    it('should assert that there is an error if new pass and confirm pass are different', function() {
        login.login("teacher", "business1");
        browser.waitForExist('.sidebar', TIME);
        browser.url('/profile/edit');
        browser.waitForExist('#old-pass', TIME);
        browser.setValue('#old-pass', 'business1');
        browser.setValue('#new-pass', 'business2');
        browser.setValue('#confirm-pass', 'business5');
        browser.click('#update-btn');
        browser.waitForExist('.humane-flatty-error', TIME);
        var msg = browser.getText('.humane-flatty-error');
        expect(msg).to.equal("Those passwords do not appear to match. Please try again.");
    });
    
    // Should display an error if there isn't a number in the password
    it('should assert that password is missing a number', function() {
        login.login("teacher", "business1");
        browser.waitForExist('.sidebar', TIME);
        browser.url('/profile/edit');
        browser.waitForExist('#old-pass', TIME);
        browser.setValue('#old-pass', 'business1');
        browser.setValue('#new-pass', 'business');
        browser.setValue('#confirm-pass', 'business');
        browser.click('#update-btn');
        browser.waitForExist('.humane-flatty-error', TIME);
        var msg = browser.getText('.humane-flatty-error');
        expect(msg).to.equal("Passwords must contain at least 8 characters, including one number");
    });
    
    // Should display an error if the password is less than 8 characters
    it('should assert that password is too short', function() {
        login.login("teacher", "business1");
        browser.waitForExist('.sidebar', TIME);
        browser.url('/profile/edit');
        browser.waitForExist('#old-pass', TIME);
        browser.setValue('#old-pass', 'business1');
        browser.setValue('#new-pass', 'bus3');
        browser.setValue('#confirm-pass', 'bus3');
        browser.click('#update-btn');
        browser.waitForExist('.humane-flatty-error', TIME);
        var msg = browser.getText('.humane-flatty-error');
        expect(msg).to.equal("Passwords must contain at least 8 characters, including one number");
    });
    
    // Should display an error if the password you insert in "Current Password" is not your current password
    it('should assert that the current password inserted is incorrect', function() {
        login.login("teacher", "business1");
        browser.waitForExist('.sidebar', TIME);
        browser.url('/profile/edit');
        browser.waitForExist('#old-pass', TIME);
        browser.setValue('#old-pass', 'business000');
        browser.setValue('#new-pass', 'business2');
        browser.setValue('#confirm-pass', 'business2');
        browser.click('#update-btn');
        browser.waitForExist('#show-msg', TIME);
        var msg = browser.getText('#show-msg');
        // Currently do not have a message saying that the current password is incorrect
        expect(msg).to.not.equal("You have successfully updated your password.\nBe sure to remember for next time!");
    });
});