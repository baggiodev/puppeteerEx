const puppeteer = require("puppeteer");
const data = [];
//part 2
// const mongojs = require("mongojs");
const mongoose = require("mongoose");

const db = require("./models");

async function dbConnect() {
  await mongoose.connect("mongodb://localhost/slippi", {
    useNewUrlParser: true
  });
  await main();
}

dbConnect();

async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
    );
    await page.goto("https://www.twitch.tv/directory");
    //waits for all the elements with this class to be loaded
    //before running any more code
    await page.waitForSelector(".tw-card-body");
    const categoriesEl = await page.$$(".tw-mg-b-2.tw-relative");
    for (let i = 0; i < categoriesEl.length; i++) {
      const obj = {};
      const element = categoriesEl[i];
      //grabs h3 inside of category element
      const titleEl = await element.$("h3");
      const title = await page.evaluate(function(titleEl) {
        return titleEl.innerText;
      }, titleEl);
      obj.title = title;
      const viewerEl = await element.$("p");
      const viewerCount = await page.evaluate(function(viewerEl) {
        return viewerEl.innerText;
      }, viewerEl);
      obj.viewerCount = viewerCount;
      data.push(obj);
    }
    console.log(data);
    //part 2
    await db.Category.insertMany(data);

    await browser.close();
    await mongoose.connection.close();
  } catch (e) {
    console.error("we errored", e);
  }
}
