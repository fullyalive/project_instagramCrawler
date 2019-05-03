const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

// const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    // await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"]
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    await page.goto("https://facebook.com");
    await page.type("#email", process.env.FB_ID);
    await page.type("#pass", process.env.FB_PW);
    await page.waitFor(1000);
    await page.click("#loginbutton");
    await page.waitForResponse(response => {
      return response.url().includes("login_attempt");
    });
    await page.keyboard.press("Escape");
    
    await page.waitForSelector("[id^=hyperfeed_story_id]:first-child");
    const newPost = await page.evaluate(() => {
      const firstFeed = document.querySelector(
        "[id^=hyperfeed_story_id]:first-child"
      );
      const name =
        firstFeed.querySelector(".fwb.fcg") &&
        firstFeed.querySelector(".fwb.fcg").textContent;
      const content =
        firstFeed.querySelector(".userContent") &&
        firstFeed.querySelector(".userContent").textContent;
      const img =
        firstFeed.querySelector("[class=mtm] img") &&
        firstFeed.querySelector("[class=mtm] img").src;
      const postId = firstFeed.id.split("_").slice(-1)[0];
      return {
        name,
        img,
        content,
        postId
      };
    });
    console.log(newPost);
  } catch (e) {
    console.error(e);
  }
};

crawler();
