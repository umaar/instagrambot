import { Authenticate } from 'src/common/interfaces';

const authenticate: Authenticate = function authenticate({ username, password }) {
  return this.getPage('/accounts/login', async page => {
    const logInRedirectButtonSelector = await page.evaluate(() => {
      const { scraper } = window as any;

      const logInButton = scraper.findOne({
        selector: 'a[href="/accounts/login"]',
      });

      if (!logInButton) {
        return '';
      }

      return logInButton
        .setscraperAttr('logInRedirectButton', 'logInRedirectButton')
        .getSelectorByscraperAttr('logInRedirectButton');
    });

    if (logInRedirectButtonSelector) {
      await page.click(logInRedirectButtonSelector);
      await page.waitForSelector('input[name="password"]');
    }

    await page.waitFor(3000);

    const usernameInput = await page.$('input[name="username"]');
    const passwordInput = await page.$('input[name="password"]');

    await usernameInput.type(username, { delay: 100 });
    await passwordInput.type(password, { delay: 100 });

    const logInButtonSelector = await page.evaluate(() => {
      const { scraper } = window as any;

      const logInButton = scraper.findOneWithText({
        selector: 'button',
        text: 'Log in',
      });

      if (!logInButton) {
        return '';
      }

      return logInButton
        .setscraperAttr('logInButton', 'logInButton')
        .getSelectorByscraperAttr('logInButton');
    });

    if (!logInButtonSelector) {
      throw new Error('Failed to auth');
    }

    const logInButton = await page.$(logInButtonSelector);

    await logInButton.click();

    await page.waitFor(2000);
  });
};

export { authenticate };
