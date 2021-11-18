var { expect } = require('chai');

describe('Appium Testing', () => {
    beforeEach(() => {
        $("~numio-app").waitForDisplayed(5000, false)
    });
    
    it('should run numio application successfully', async () => {
        let el = await $("~numio-app")
        let visible = await el.isDisplayed();
        visible.should.be.true;
    });
});
