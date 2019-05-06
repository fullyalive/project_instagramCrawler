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
      userDataDir: "/Users/fullyalive/Project/userData"
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080
    });
    await page.goto("https://instagram.com");
    if (await page.$(`a[href="/${process.env.IN_ID}/"]`)) {
      console.log("✅ 이미 로그인 되어 있습니다.");
    } else {
      await page.waitForSelector("button.L3NKy"); // instagram 내 페이스북 로그인버튼
      await page.click("button.L3NKy");
      await page.waitForNavigation(); // facebook 로그인 창 리다이렉트를 기다린다.
      await page.waitForSelector("#email"); // 해당 태그의 존재 여부를 확인
      await page.type("#email", process.env.FB_ID);
      await page.type("#pass", process.env.FB_PW);
      await page.waitForSelector("#loginbutton");
      await page.click("#loginbutton");
      console.log("🙆🏻‍ 로그인 완료");
    }
    let result = [];
    let prevPostId = "";
    while (result.length < 10) {
      const moreButton = await page.$("button.sXUSN"); // 더보기 버튼 클릭
      if (moreButton) {
        await page.evaluate(btn => btn.click(), moreButton);
      }
      const newPost = await page.evaluate(() => {
        const article = document.querySelector("article:first-child");
        const postId =
          article.querySelector(".c-Yi7") &&
          article.querySelector(".c-Yi7").href;
        const name = article.querySelector("h2").textContent;
        const img =
          article.querySelector(".KL4Bh img") &&
          article.querySelector(".KL4Bh img").src;
        const content =
          article.querySelector(".C4VMK > span") &&
          article.querySelector(".C4VMK > span").textContent;
        return {
          postId,
          name,
          img,
          content
        };
      });
      if (newPost.postId !== prevPostId) {
        console.log(newPost);
        if (!result.find(v => v.postId === newPost.postId)) {
          result.push(newPost);
        }
      }
      prevPostId = newPost.postId;
      await page.waitFor(1000);
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
    }

    await page.waitFor(3000);
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
