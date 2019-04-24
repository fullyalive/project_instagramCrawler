// const stringify = require("csv-stringify/lib/sync");
const xlsx = require("xlsx");
const puppeteer = require("puppeteer");
const add_to_sheet = require("./add_to_sheet");
const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// const parse = require("csv-parse/lib/sync");
// const fs = require("fs");

// const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    // const result = [];
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production"
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36"
    );
    add_to_sheet(ws, "C1", "s", "평점");
    for (const [i, r] of records.entries()) {
      await page.goto(r.링크);
      // await page.goto(r[1]);
      // const 태그핸들러 = await page.$(선택자);
      console.log(await page.evaluate("navigator.userAgent"));
      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        if (score) {
          return score.textContent;
        }
      });
      if (text) {
        console.log(r.제목, "평점", text.trim());
        // console.log(r[0], "평점", text.trim());
        // result[i] = [r[0], r[1], text.trim()];
        const newCell = "C" + (i + 2);
        add_to_sheet(ws, newCell, "n", parseFloat(text.trim()));
      }
      await page.waitFor(1000);
    }

    await page.close();
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result.xlsx");
    // const str = stringify(result); // 2차원 배열을 문자열로 만든다.
    // fs.writeFileSync("csv/result.csv", str);
  } catch (e) {
    console.error(e);
  }
};

crawler();
