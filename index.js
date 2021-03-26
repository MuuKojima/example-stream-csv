const fs = require('fs');
const parse = require('csv-parse');

const fetchSomeWhere = async item => {
  await new Promise(resolve => {
    setTimeout(() => {
      console.log('📤', item);
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

// 単純なStreamだとendの呼ばれるタイミングが、dataを全部読み込んだ `瞬間` に発火するので、
// 結果的に、最後の一個が入ってないので、扱いずらいかも。
// ホントはdataイベントが発生して、dataイベント内のコードが全部実行されてから、endにいってほしい、、
(async () => {
  const results = await readCsvBySimpleStream();
  console.info('✅ Stream', results);
})();

// Stream Async Iterator
(async () => {
  const results = await readCsvByAsyncIterator();
  console.info('✅ Async Iterator', results);
})();
