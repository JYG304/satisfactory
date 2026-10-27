const fs = require('fs');
const html = fs.readFileSync('processor/index.html', 'utf8');
const chips = ['t0_atk_1', 't0_speed_1', 't0_craft_1', 't0_mine_1', 't0_atk_2', 't0_crit_2'];
chips.forEach(c => {
  const count = (html.match(new RegExp('"' + c + '"', 'g')) || []).length;
  console.log(c, count);
});
