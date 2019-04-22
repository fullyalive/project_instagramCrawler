// csv

// const parse = require("csv-parse/lib/sync");
// const fs = require("fs");

// const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));
// records.forEach((r, i) => {
//   console.log(i, r);
// });

// xlsx

const xlsx = require("xlsx");
const workbook = xlsx.readFile("xlsx/data.xlsx");

const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);
// console.log(records);

records.forEach((r, i) => {
  console.log(i, r.제목, r.링크);
});

// for (const [i, r] of records.entries()) {
//   console.log(i, r.제목, r.링크);
// }
