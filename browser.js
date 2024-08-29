const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-setuid-sandbox"],
      ignoreDefaultArgs: true,
    });
  } catch (error) {
    console.log("Không tạo được browser " + error);
  }
};

module.exports = startBrowser;
