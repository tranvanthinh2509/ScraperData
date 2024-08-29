const scrapers = require("./scraper");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  try {
    let browser = await browserInstance;
    // Gọi hàm cào ở file scraper

    let categories = scrapers.scrapeCategory(browser, url);
  } catch (error) {
    console.log("Lỗi ở scrape controller " + error);
  }
};

module.exports = scrapeController;
