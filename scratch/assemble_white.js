const fs = require('fs');

const p1 = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/white_part1.html', 'utf8');
const p2 = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/white_part2.html', 'utf8');
let p3 = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/white_part3.html', 'utf8');
const specs = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/extracted_specs.js', 'utf8');

p3 = p3.replace('// SPECS_PLACEHOLDER', specs);

const fullHtml = p1 + p2 + p3;

fs.writeFileSync('e:/UE5/修仙工厂策划案/processor/index.html', fullHtml, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', fullHtml, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/中央处理器_光路阵盘/index.html', fullHtml, 'utf8');

console.log('Successfully assembled clean white prototype! Total length:', fullHtml.length);
