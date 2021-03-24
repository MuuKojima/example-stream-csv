const fs = require('fs');
const parse = require('csv-parse');

const request = async (obj) => {
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('📤', obj);
      resolve();
    }, 1000)
  });
};

const processFile = async () => {
  records = [];
  const parser = fs
    .createReadStream('./input.csv')
    .pipe(parse({
      columns: true,
      from_line: 1
    }));
  for await (const record of parser) {
    records.push(record);
    await request(record);
  }
  return records;
}

(async () => {
  const records = await processFile();
  console.info('✅', records);
})();
