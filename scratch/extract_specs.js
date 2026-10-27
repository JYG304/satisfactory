const fs = require('fs');

const orig = fs.readFileSync('e:/UE5/修仙工厂策划案/processor/index.html', 'utf8');

// Extract CHIP_SPECS
const chipSpecsStart = orig.indexOf('const CHIP_SPECS = {');
const chipSpecsEnd = orig.indexOf('const KEYSTONE_TRAITS = {');
const chipSpecsCode = orig.slice(chipSpecsStart, chipSpecsEnd).trim();

// Extract KEYSTONE_TRAITS
const ksTraitsStart = orig.indexOf('const KEYSTONE_TRAITS = {');
const ksTraitsEnd = orig.indexOf('const DISC_KEYSTONE_META = {');
const ksTraitsCode = orig.slice(ksTraitsStart, ksTraitsEnd).trim();

console.log('Extracted CHIP_SPECS and KEYSTONE_TRAITS successfully.');

// Write to a temporary file
fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/extracted_specs.js', chipSpecsCode + '\n\n' + ksTraitsCode, 'utf8');
