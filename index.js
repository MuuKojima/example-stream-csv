const fs = require('fs');
const parse = require('csv-parse');

const fetchSomeWhere = async item => {
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('ð¤', item);
      resolve();
    }, 1000)
  });
};

const readCsvBySimpleStream = async () => {
  return await new Promise((resolve) => {
    results = [];
    const readable = fs.createReadStream('input.csv');
    const parser = parse({
      columns: true,
      from_line: 1
    });
    readable
      .pipe(parser)
      .on('data', async (data) => {
        parser.pause();
        await fetchSomeWhere(data);
        results.push(data);
        parser.resume();
      })
      .on('end', () => {
        resolve(results);
      })
  });
}

const readCsvByAsyncIterator = async () => {
  results = [];
  const parser = fs
    .createReadStream('./input.csv')
    .pipe(parse({
      columns: true,
      from_line: 1
    }));
  for await (const item of parser) {
    await fetchSomeWhere(item);
    results.push(item);
  }
  return results;
}

// åç´ãªStreamã ã¨endã®å¼ã°ããã¿ã¤ãã³ã°ããasyncã¨pauseãä½¿ãå ´åã«éããdataãå¨é¨èª­ã¿è¾¼ãã `ç¬é`ã«çºç«ããã®ã§ã
// çµæçã«ãæå¾ã®ä¸åãå¥ã£ã¦ãªãã®ã§ãæ±ããããããã
// ãã³ãã¯dataã¤ãã³ããçºçãã¦ãdataã¤ãã³ãåã®ã³ã¼ããå¨é¨å®è¡ããã¦ãããendã«ãã£ã¦ã»ãããã
(async () => {
  const results = await readCsvBySimpleStream();
  console.info('â Stream', results);
})();

// Stream Async Iterator
// Node12ããä½¿ãããããã£ã¡ã®æ¹ããããèª­ã¿ããã
(async () => {
  const results = await readCsvByAsyncIterator();
  console.info('â Async Iterator', results);
})();
