const fs = require('fs');
const content = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

const idxApp = content.indexOf('function setAppMode(');
const idxDom = content.indexOf("window.addEventListener('DOMContentLoaded'");
console.log('idxApp:', idxApp, 'idxDom:', idxDom);
