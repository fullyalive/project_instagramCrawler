// csv

// const parse = require("csv-parse/lib/sync");
// const fs = require("fs");

// const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));
// records.forEach((r, i) => {
//   console.log(i, r);
// });

// xlsx

// const xlsx = require("xlsx");
// const workbook = xlsx.readFile("xlsx/data.xlsx");

// const ws = workbook.Sheets.영화목록;
// const records = xlsx.utils.sheet_to_json(ws);
// console.log(records);

// records.forEach((r, i) => {
//   console.log(i, r.제목, r.링크);
// });

// for (const [i, r] of records.entries()) {
//   console.log(i, r.제목, r.링크);
// }

const xlsx = require("xlsx");
const axios = require("axios"); // ajax 라이브러리
const cheerio = require("cheerio"); // html 파싱

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

for (const [i, r] of records.entries()) {
  console.log(i, r.제목, r.링크);
}

const crawler = async () => {
  // await Promise.all( // Promise.all은 동시에 진행되지만 요청순서대로 값을 받는 것이 보장되지 않는다.
  //   records.map(async r => {
  //     const response = await axios.get(r.링크);
  //     if (response.status === 200) {
  //       const html = response.data;
  //       const $ = cheerio.load(html); // cheerio와 $ 를 이용해서 html tag를 가져올 수 있음
  //       const score = $('.score.score_left .star_score').text();
  //       console.log(r.제목, '평점 :', score.trim());
  //     }
  //   })
  // );
  for (const [i, r] of records.entries()) { // for of 문은 await와 같이 쓰면 순서가 보장된다.
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html); // cheerio와 $ 를 이용해서 html tag를 가져올 수 있음
      const score = $(".score.score_left .star_score").text();
      console.log(r.제목, "평점 :", score.trim());
    }
  }
};

crawler();
