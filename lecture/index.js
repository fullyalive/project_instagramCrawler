const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920, 1080"]
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080
    });
    await page.goto("https://facebook.com");
    const id = process.env.FB_ID;
    const password = process.env.FB_PW;
    // await page.evaluate(
    //   (id, password) => {
    //     document.querySelector("#email").value = id;
    //     document.querySelector("#pass").value = password;
    //     document.querySelector("#loginbutton").click();
    //   },
    //   id,
    //   password
    // );
    await page.type("#email", id);
    await page.type("#pass", password);
    await page.hover("#loginbutton");
    await page.waitFor(3000);
    await page.click("#loginbutton");
    await page.waitFor(10000);
    await page.keyboard.press("Escape");
    await page.waitFor(3000);
    await page.click("#userNavigationLabel");
    await page.waitForSelector("li.navSubmenu:last-child");
    await page.waitFor(3000);
    await page.click("li.navSubmenu:last-child");
  } catch (e) {
    console.error(e);
  }
};

crawler();
