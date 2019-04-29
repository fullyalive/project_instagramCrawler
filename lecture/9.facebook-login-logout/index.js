const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920, 1080", "--disable-notifications"]
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080
    });

    page.on("dialog", async dialog => {
      console.log(dialog.type(), dialog.message());
      await dialog.accept(); // accept는 confirm의 확인, dismiss는 취소
    });

    // page.on('dialog', async (dialog) => {
    //   console.log(dialog.type(), dialog.message());
    //   await dialog.accept('http://inflearn.com');
    // });
    //
    // await page.evaluate(() => {
    //   const data = prompt('주소를 입력하세요');
    //   location.href = data;

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
    await page.waitForResponse(response => {
      return response.url().includes("login_attempt");
    });
    await page.waitFor(3000);
    await page.keyboard.press("Escape");
    await page.click("#userNavigationLabel");
    await page.waitForSelector("li.navSubmenu:last-child");
    await page.waitFor(3000);
    await page.click("li.navSubmenu:last-child");
    // await page.evaluate(()=> {
    //   document.querySelector("li.navSubmenu:last-chlid").click();
    // })
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
