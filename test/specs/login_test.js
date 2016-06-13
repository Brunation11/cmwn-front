describe('my awesome website', function() {
    it('should assert that login was successful', function() {
        browser.url('/login');
        browser.setValue('#email', 'teacher');
        browser.setValue('#password', 'business');
        var a = browser.getValue('#email');
        expect(a).to.equal('teacher');
        var b = browser.getValue('#password');
        expect(b).to.equal('business');
        browser.pause(4000);
        browser.click('#login-button');
        browser.pause(10000);
        browser.getUrl().should.equal('https://local.changemyworldnow.com/profile');
        console.log(browser.getUrl());
        
    });
});