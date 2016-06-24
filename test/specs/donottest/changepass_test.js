var login_test = require('../login_test.js');

describe('tests changing password', function() {
    // Checks if changing the password works
    it('should assert changing password was successful', function() {
        login_test.login("teacher", "business2");
        browser.waitForExist('.sidebar', 4000);
        browser.url('/profile/edit');
        browser.setValue('#oldPass', 'business2');
        browser.setValue('#newPass', 'business1');
        browser.setValue('#confirmPass', 'business1');
        browser.click('#updateBtn');
        browser.waitForExist('#showMsg', 3000);
        var msg = browser.getText('#showMsg');
        expect(msg).to.equal("You have successfully updated your password. Be sure to remember for next time!");
        browser.url('/profile');
        browser.waitForExist('#login-form', 4000);
        browser.getUrl().should.equal('https://local.changemyworldnow.com/login');
        // Checks if you successfully log back in with new password
        login_test.login("teacher", "business1");
        browser.waitForExist('.sidebar', 4000);
        browser.getUrl().should.equal('https://local.changemyworldnow.com/profile');
    });
    
    // Displays an error if the password you inserted in "New Password" and "Confirm Password" are different
    it('should assert that there is an error', function() {
        login_test.login("teacher", "business1");
        browser.waitForExist('.sidebar', 4000);
        browser.url('/profile/edit');
        browser.setValue('#oldPass', 'business1');
        browser.setValue('#newPass', 'business2');
        browser.setValue('#confirmPass', 'business5');
        browser.click('#updateBtn');
        browser.waitForExist('#showMsg', 3000);
        var msg = browser.getText('#showMsg');
        expect(msg).to.equal("Those passwords do not appear to match. Please try again.");
    });
    
    // Displays an error if there isn't a number in the password
    it('should assert that pass is missing a number', function() {
        login_test.login("teacher", "business1");
        browser.waitForExist('.sidebar', 4000);
        browser.url('/profile/edit');
        browser.setValue('#oldPass', 'business1');
        browser.setValue('#newPass', 'business');
        browser.setValue('#confirmPass', 'business');
        browser.click('#updateBtn');
        browser.waitForExist('#showMsg', 3000);
        var msg = browser.getText('#showMsg');
        expect(msg).to.equal("Passwords must contain at least 8 characters, including one number");
    });
    
    // Displays an error if the password is less than 8 characters
    it('should assert that pass is too short', function() {
        login_test.login("teacher", "business1");
        browser.waitForExist('.sidebar', 4000);
        browser.url('/profile/edit');
        browser.setValue('#oldPass', 'business1');
        browser.setValue('#newPass', 'bus3');
        browser.setValue('#confirmPass', 'bus3');
        browser.click('#updateBtn');
        browser.waitForExist('#showMsg', 3000);
        var msg = browser.getText('#showMsg');
        expect(msg).to.equal("Passwords must contain at least 8 characters, including one number");
    });
    
    // Displays an error if the password you insert in "Current Password" is not your current password
    it('should assert that the current password inserted is incorrect', function() {
        login_test.login("teacher", "business1");
        browser.waitForExist('.sidebar', 4000);
        browser.url('/profile/edit');
        browser.setValue('#oldPass', 'business000');
        browser.setValue('#newPass', 'business2');
        browser.setValue('#confirmPass', 'business2');
        browser.click('#updateBtn');
        browser.waitForExist('#showMsg', 3000);
        var msg = browser.getText('#showMsg');
        // Currently do not have a message saying that the current password is incorrect
        expect(msg).to.not.equal("You have successfully updated your password. Be sure to remember for next time!");
    });
});
