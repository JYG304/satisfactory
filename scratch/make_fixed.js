const fs = require('fs');

let html = fs.readFileSync('processor/index.html', 'utf8');

// Fix the invalid chip IDs in DOMContentLoaded:
// Replace t0_atk_2 and t0_crit_2 with valid existing IDs
html = html.replace("if (BOARD_SLOTS['combat_1_0']) BOARD_SLOTS['combat_1_0'].chip = 't0_atk_2';", "if (BOARD_SLOTS['combat_1_0']) BOARD_SLOTS['combat_1_0'].chip = 't1_atk_3';");
html = html.replace("if (BOARD_SLOTS['combat_1_4']) BOARD_SLOTS['combat_1_4'].chip = 't0_crit_2';", "if (BOARD_SLOTS['combat_1_4']) BOARD_SLOTS['combat_1_4'].chip = 't1_crit_3';");

fs.writeFileSync('scratch/test_fixed.html', html);
console.log('Created scratch/test_fixed.html');
