const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  try {
    await db.sequelize.sync();
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    await page.goto("https://instagram.com");
    await page.waitForSelector("button.L3NKy"); // instagram 내 페이스북 로그인버튼
    await page.click("button.L3NKy");
    await page.waitForNavigation(); // facebook 로그인 창 리다이렉트를 기다린다.
    await page.waitForSelector("#email"); // 해당 태그의 존재 여부를 확인
    await page.type("#email", process.env.FB_ID);
    await page.type("#pass", process.env.FB_PW);
    await page.waitForSelector("#loginbutton");
    await page.click("#loginbutton");
  } catch (e) {
    console.error(e);
  }
};

crawler();
