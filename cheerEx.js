const cheerio = require("cheerio");
const axios = require("axios");
/* eslint-disable */
axios
  .get("https://www.google.com/search?q=how+to+scrape")
  .then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    const eachSearch = $(".g");
    eachSearch.each(function(i, element) {
      const title = $(element).find(".r");
      const aLink = $(title).find("a");
      const text = $(aLink).text();
      console.log(text);
    });
  });
