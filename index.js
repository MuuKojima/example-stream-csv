const fs = require('fs');
const parse = require('csv-parse');
const readable = fs.createReadStream('input.csv');
const parser = parse({
  columns: true,
  from_line: 1
});

readable
  .pipe(parser)
  .on('data', (data) => {
    console.log('pauseの前', data);
    readable.pause();
    console.log('pauseの後');
    setTimeout(() => {
      console.log('resumeの前');
      readable.resume();
    }, 3000);
  })
  .on('end', () => {
    console.log('end');
  });
