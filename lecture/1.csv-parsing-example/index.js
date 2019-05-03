const parse = require('./node_modules/csv-parse/lib/sync');
const fs = require('fs');

const csv = fs.readFileSync('csv/data.csv');
const records = parse(csv.toString('utf-8'));
records.forEach((r, i) => {
  console.log(i, r);
});
