const fs = require('fs');
const fd = fs.openSync('submissions_qwen.jsonl', 'r');
const stats = fs.fstatSync(fd);
const CHUNK_SIZE = 64 * 1024;
const offset = Math.floor(Math.random() * (stats.size - CHUNK_SIZE));
const buffer = Buffer.alloc(CHUNK_SIZE);
fs.readSync(fd, buffer, 0, CHUNK_SIZE, offset);
const text = buffer.toString('utf-8');
const lines = text.split('\n');
if (offset > 0) lines.shift();

let valid = 0;
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    JSON.parse(line.trim());
    valid++;
  } catch(e) {}
}
console.log(`Offset: ${offset}, Valid lines: ${valid}, Total lines in chunk: ${lines.length}`);
