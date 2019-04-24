/* eslint-disable */
const puppeteer = require("puppeteer");
require("dotenv").config();
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const data = [];
const whileCondition = true;

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
    );
    await page.goto("https://www.netflix.com/browse");
    await page.waitForSelector("#id_userLoginId");
    await page.focus("#id_userLoginId");
    await page.keyboard.type(email);
    await page.focus("#id_password");
    await page.keyboard.type(password);
    const loginButton = await page.$(".login-button");
    loginButton.click();
    await page.waitForNavigation();
    console.log("Logged in!");
    const profileButton = await page.$(".profile-icon");
    profileButton.click();
    await page.waitForNavigation();
    const rowTrending = await page.$(".lolomoRow_title_card:nth-child(3)");
    const fallBackTextEl = await rowTrending.$$(".fallback-text");
    // while (whileCondition) {
    //   const handleNextEl = await rowTrending.$(".handleNext");
    //   handleNextEl.click();
    //   await page.waitForNavigation();
    //   for (let i = 0; i < fallBackTextEl.length; i++) {
    //     const element = fallBackTextEl[i];
    //     const fallBackText = await page.evaluate(
    //       element => element.innerText,
    //       element
    //     );
    //     data.push(fallBackText);
    //   }
    //   let lastChildIndicator = await rowTrending.$((".pagination-indicator :last-child");

    // }
    //example of a single text
    // const fallBackText = await page.evaluate(
    //   fallBackTextEl => fallBackTextEl.innerText,
    //   fallBackTextEl
    // );
    // example of a row without clicking button
    for (let i = 0; i < fallBackTextEl.length; i++) {
      const element = fallBackTextEl[i];
      const fallBackText = await page.evaluate(function(test) {
        return test.innerText;
      }, element);
      const fallBackClass = await page.evaluate(function(test) {
        return test.getAttribute("class");
      }, element);
      console.log(fallBackClass);
      data.push(fallBackText);
    }
    console.log(data);
    await browser.close();
    //pagination-indicator
  } catch (e) {
    console.log("We errored: ", e);
  }
})();
