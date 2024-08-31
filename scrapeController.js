const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";

  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    // Gọi hàm cào ở file scraper

    const categories = await scrapers.scrapeCategory(browser, url);
    const selectedCategory = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    // let result1 = await scrapers.scraper(browser, selectedCategory[0].link);
    // fs.writeFile("chothuephongtro.json", JSON.stringify(result1), (err) => {
    //   if (err) console.log("Ghi data vao file JSON fail " + err);
    //   console.log("Them data success");
    // });

    // let result2 = await scrapers.scraper(browser, selectedCategory[1].link);
    // fs.writeFile("nhachothue.json", JSON.stringify(result2), (err) => {
    //   if (err) console.log("Ghi data vao file JSON fail " + err);
    //   console.log("Them data success");
    // });

    // let result3 = await scrapers.scraper(browser, selectedCategory[2].link);
    // fs.writeFile("chothuecanho.json", JSON.stringify(result3), (err) => {
    //   if (err) console.log("Ghi data vao file JSON fail " + err);
    //   console.log("Them data success");
    // });

    let result4 = await scrapers.scraper(browser, selectedCategory[3].link);
    fs.writeFile("chothuematbang.json", JSON.stringify(result4), (err) => {
      if (err) console.log("Ghi data vao file JSON fail " + err);
      console.log("Them data success");
    });
  } catch (error) {
    console.log("Lỗi ở scrape controller " + error);
  }
};

module.exports = scrapeController;
