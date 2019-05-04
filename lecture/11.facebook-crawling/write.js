const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"]
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
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
    await page.waitForSelector("textarea");
    await page.click("textarea");
    await page.waitForSelector("._5rpb > div");
    console.log("found");
    await page.click("._5rpb > div");
    console.log("clicked");
    await page.keyboard.type("test");
    await page.waitForSelector("._6c0o button");
    await page.waitFor(5000);
    await page.click("._6c0o button");
    await page.waitFor(15000);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
