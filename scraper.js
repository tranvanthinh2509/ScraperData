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
      await page.close();

      resolve(dataCategory);
    } catch (error) {
      console.log("Loi o scraperCategory " + error);
      reject(error);
    }
  });

const scraper = async (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log("Đã mở tab mới ...");
      await newPage.goto(url);
      console.log("Đã truy cập vào trang " + url);
      await newPage.waitForSelector("#main");
      console.log("Đã load xong tag main ...");
      const scrapeData = {};

      //Lấy header
      const headerData = await newPage.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          description: el.querySelector("p").innerText,
        };
      });

      scrapeData.header = headerData;

      //Lấy links detail item
      const detailLinks = await newPage.$$eval(
        "#left-col > .section-post-listing > ul > li",
        (els) => {
          detailLinks = els.map((el) => {
            return el.querySelector(".post-meta h3 > a").href;
          });
          return detailLinks;
        }
      );

      const scrapperDetail = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            await pageDetail.waitForSelector("#main");

            const detailData = {};
            //Bắt đầu cào
            //Cạo ảnh
            const images = await pageDetail.$$eval(
              "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
              (els) => {
                images = els.map((el) => {
                  return el.querySelector("img")?.src;
                });
                return images.filter((i) => !i === false);
              }
            );

            detailData.images = images;

            //Lấy header detail
            const header = await pageDetail.$eval(
              "header.page-header",
              (el) => {
                return {
                  title: el.querySelector("h1 > a").innerText,
                  star: el
                    .querySelector("h1 > span")
                    ?.className?.replace(/^\D+/g, ""),
                  // class: {
                  //   content: el.querySelector("p").innerText,
                  //   classType: el.querySelector("p > a > strong").innerText,
                  // },
                  address: el.querySelector("address").innerText,
                  attributes: {
                    price: el.querySelector(
                      "div.post-attributes > .price > span"
                    ).innerText,
                    acreage: el.querySelector(
                      "div.post-attributes > .acreage > span"
                    ).innerText,
                    published: el.querySelector(
                      "div.post-attributes > .published > span"
                    ).innerText,
                    hashtag: el.querySelector(
                      "div.post-attributes > .hashtag > span"
                    ).innerText,
                  },
                };
              }
            );

            detailData.header = header;

            //Thông tin mô tả
            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (el) => el.querySelector("div.section-header").innerText
            );

            const mainContentContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content > div.section-content > p",
              (els) => (mainContenContent = els.map((el) => el.innerText))
            );

            detailData.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };

            //Đặc điểm tin đăng
            const overviewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (el) => el.querySelector("div.section-header").innerText
            );

            const overviewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview > div.section-content > table.table > tbody > tr",
              (els) =>
                (overviewContent = els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                })))
            );

            detailData.overview = {
              header: overviewHeader,
              content: overviewContent,
            };

            // Lấy thông tin liên hệ

            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-contact",
              (el) => el.querySelector("div.section-header").innerText
            );

            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact > div.section-content > table.table > tbody > tr",
              (els) =>
                (overviewContent = els.map((el) => ({
                  name: el.querySelector("td:first-child").innerText,
                  content: el.querySelector("td:last-child").innerText,
                })))
            );

            detailData.contact = {
              header: contactHeader,
              content: contactContent,
            };
            await pageDetail.close();
            console.log("Đã đóng tab " + link);
            resolve(detailData);
          } catch (error) {
            console.log("Lấy data detail lỗi " + error);
            reject(error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scrapperDetail(link);
        details.push(detail);
      }

      scrapeData.body = details;

      await browser.close();
      console.log("Trình duyệt đã đóng");
      resolve(scrapeData);
    } catch (error) {
      reject(error);
    }
  });

module.exports = { scrapeCategory, scraper };
