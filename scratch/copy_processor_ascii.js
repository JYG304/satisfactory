const fs = require('fs');
const path = require('path');

const src = 'e:\\UE5\\修仙工厂策划案\\中央处理器_光路阵盘\\index.html';
const destDir = 'e:\\UE5\\修仙工厂策划案\\processor';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, path.join(destDir, 'index.html'));
console.log('Created processor/index.html');
