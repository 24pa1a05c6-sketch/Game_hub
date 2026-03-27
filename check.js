const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');

const regex = /img:\s*(["'])(.*?)\1/g;
let match;
const missing = [];

while ((match = regex.exec(content)) !== null) {
  const filePath = match[2];
  if (!filePath.startsWith('http')) {
    if (!fs.existsSync(filePath)) {
      missing.push(filePath);
    }
  }
}

fs.writeFileSync('out.txt', missing.join('\n'));
console.log('done, missing count: ' + missing.length);
