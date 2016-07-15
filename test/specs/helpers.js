export function checkLink(link, url, check) {
    browser.waitForExist(link);
    browser.click(link);
    if(check !== undefined) {
        browser.waitForExist(check);
    } else {
        browser.pause(3000);
    }
    expect(browser.getUrl()).to.equal(url);
}

export function goBack(url) {
    browser.back();
    expect(browser.getUrl()).to.equal(url);
}

