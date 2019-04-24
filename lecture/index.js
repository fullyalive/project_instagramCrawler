const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({
      headless: process.env.Node_ENV === "production"
    });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          await page.goto(r[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          if (scoreEl) {
            const score = await page.evaluate(tag => {
              return tag.textContent;
            }, scoreEl);
            console.log(r[0], "평점", score.trim());
            result[i] = [r[0], r[1], score.trim()];
          }
          await page.waitFor(3000);
          await page.close();
        } catch (e) {
          console.error(e);
        }
      })
    );
    await browser.close();
    const str = stringify(result); // 2차원 배열을 문자열로 만든다.
    fs.writeFileSync('csv/result.csv', str); 
  } catch (e) {
    console.error(e);
  }
};

crawler();
