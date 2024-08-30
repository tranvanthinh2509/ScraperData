const scrapers = require("./scraper");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";

  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    // Gọi hàm cào ở file scraper

    let categories = await scrapers.scrapeCategory(browser, url);
    const selectedCategory = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    await scrapers.scraper(browser, selectedCategory[0].link);
  } catch (error) {
    console.log("Lỗi ở scrape controller " + error);
  }
};

module.exports = scrapeController;
