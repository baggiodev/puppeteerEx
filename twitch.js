const puppeteer = require("puppeteer");
const data = [];

const mongojs = require("mongojs");
// Database configuration
const databaseUrl = "scraper";
const collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
let db;
(async function dbConnect() {
  db = await mongojs(databaseUrl, collections);

  await db.on("error", function(error) {
    console.log("Database Error:", error);
  });
  await main();
})();

async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
    );
    await page.goto("https://www.twitch.tv/directory");
    await page.waitForSelector(".tw-card-body");
    const categoriesEl = await page.$$(".tw-mg-b-2.tw-relative");
    // for (let i = 0; i < categoriesEl.length; i++) {
    //   const obj = {};
    //   const element = categoriesEl[i];
    //   const titleEl = await element.$("h3");
    //   const title = await page.evaluate(function(titleEl) {
    //     return titleEl.innerText;
    //   }, titleEl);
    //   obj.title = title;
    //   const viewerEl = await element.$("p");
    //   const viewerCount = await page.evaluate(function(viewerEl) {
    //     return viewerEl.innerText;
    //   }, viewerEl);
    //   obj.title = title;
    //   obj.viewerCount = viewerCount;
    //   data.push(obj);
    // }
    for (let i = 0; i < categoriesEl.length; i++) {
      const obj = {};
      const element = categoriesEl[i];
      const titleEl = await element.$("h3");
      const title = await page.evaluate(function(titleEl) {
        return titleEl.innerText;
      }, titleEl);
      obj.title = title;
      const viewerEl = await element.$("p");
      const viewerCount = await page.evaluate(function(viewerEl) {
        return viewerEl.innerText;
      }, viewerEl);
      const aLinkEl = await element.$("a");
      const aLink = await page.evaluate(function(aLinkEl) {
        return aLinkEl.href;
      }, aLinkEl);
      obj.title = title;
      obj.viewerCount = viewerCount;
      obj.url = aLink;
      obj.streamers = [];
      const streamerPage = await browser.newPage();
      await streamerPage.goto(aLink);
      await streamerPage.waitForSelector(".tw-mg-b-2.tw-relative");
      const streamersEl = await streamerPage.$$(".tw-mg-b-2.tw-relative");
      for (let n = 0; n < streamersEl.length; n++) {
        const streamerObj = {};
        const element = streamersEl[n];
        const streamerViewEl = await element.$$("p");
        const streamerView = await streamerPage.evaluate(function(
          streamerViewEl
        ) {
          return streamerViewEl.innerText;
        },
        streamerViewEl[1]);
        const [streamerTitleEl, streamerNameEl] = await element.$$(
          ".tw-interactive.tw-link.tw-link--inherit"
        );
        const streamerName = await streamerPage.evaluate(function(
          streamerNameEl
        ) {
          return streamerNameEl.innerText;
        },
        streamerNameEl);
        const streamerTitle = await streamerPage.evaluate(function(
          streamerTitleEl
        ) {
          return streamerTitleEl.innerText;
        },
        streamerTitleEl);
        streamerObj.viewers = streamerView;
        streamerObj.streamerName = streamerName;
        streamerObj.streamerTitle = streamerTitle;
        obj.streamers.push(streamerObj);
      }
      console.log(obj);
      data.push(obj);
      await streamerPage.close();
    }
    await db.scrapeData.insert({ date: new Date(), data });
    await browser.close();
    await db.close();
  } catch (e) {
    console.log("we errored", e);
  }
}
