const cheerio = require("cheerio");
const axios = require("axios");

axios.get("https://www.google.com/search?q=how+to+scrape").then(function(res) {
  const $ = cheerio.load(res.data);
  const eachSearch = $(".g");

  eachSearch.each(function(i, element) {
    const titleEl = $(element).find(".r");
    const title = $(titleEl).text();
    console.log(title);
  });
});
