const puppeteer = require("puppeteer"); // postman으로 요청 보냈을 때 이미지 로딩 상태 확인하기
const fs = require("fs");
const axios = require("axios");

fs.readdir("imgs_unsplash", err => {
  if (err) {
    console.error("imgs_unsplash 폴더가 없어 imgs_unsplash 폴더를 생성합니다.");
    fs.mkdirSync("imgs_unsplash");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://unsplash.com");
    let result = [];
    while (result.length <= 50) {
      const srcs = await page.evaluate(() => {
        window.scrollTo(0, 0);
        let imgs = [];
        const imgEls = document.querySelectorAll("figure"); // 사이트 바뀌었을 때 클래스 적절히 바꾸기
        if (imgEls.length) {
          // querySelectorAll은 map이 아니라 forEach를 상용한다.
          imgEls.forEach(v => {
            let src = v.querySelector("img._2zEKz").src;
            if (src) {
              imgs.push(src);
            }
            v.parentElement.removeChild(v);
          });
        }
        window.scrollBy(0, 100);
        setTimeout(() => {
          window.scrollBy(0, 200);
        }, 500);
        return imgs;
      });
      result = result.concat(srcs);
      await page.waitForSelector("figure");
      console.log("새 이미지 태그 로딩 완료!");
    }
    console.log(result);
    result.forEach(async src => {
      const imgResult = await axios.get(src.replace(/\?.*$/, ""), {
        responseType: "arraybuffer"
      });
      fs.writeFileSync(
        `imgs_unsplash/${new Date().valueOf()}.jpeg`,
        imgResult.data
      );
    });
    await page.close();
    await browser.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
