const scrapeCategory = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log("Mo tab moi ...");
      await page.goto(url);
      console.log("Truy cap vao " + url);
      await page.waitForSelector("#webpage");
      console.log("Web da load xong ...");

      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (els) => {
          dataCategory = els.map((el) => {
            return {
              category: el.querySelector("a").innerText,
              link: el.querySelector("a").href,
            };
          });
          return dataCategory;
        }
      );

      console.log(dataCategory);
      await page.close();

      resolve();
    } catch (error) {
      console.log("Loi o scraperCategory " + error);
      reject(error);
    }
  });

module.exports = { scrapeCategory };
