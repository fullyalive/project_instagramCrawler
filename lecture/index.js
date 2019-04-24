const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
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
          }
          await page.waitFor(3000);
          await page.close();
        } catch (e) {
          console.log(e);
        }
      })
    );
    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

crawler();
