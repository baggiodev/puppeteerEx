const puppeteer = require("puppeteer");
const data = [];

async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
    );
    await page.goto("https://www.twitch.tv/directory");
    await page.waitForSelector(".tw-mg-b-2.tw-relative");
    const categoriesEl = await page.$$(".tw-mg-b-2.tw-relative");
    for (let i = 0; i < 1; i++) {
      let obj = {};
      const element = categoriesEl[i];
      element.click();
      const titleEl = await element.$("h3");
      const title = await page.evaluate(function(testing) {
        return testing.innerText;
      }, titleEl);
      obj.title = title;
      const viewerEl = await element.$("p");
      const viewers = await page.evaluate(function(testing) {
        return testing.innerText;
      }, viewerEl);
      obj.viewers = viewers;
      data.push(obj);
    }
    console.log(data);
  } catch (err) {
    console.error("we errored", err);
  }
}

main();
