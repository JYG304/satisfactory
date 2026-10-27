const fs = require('fs');

let code = fs.readFileSync('processor/index.html', 'utf8');

// 1. Fix the invalid chip IDs in DOMContentLoaded
code = code.replace(
  "if (BOARD_SLOTS['combat_1_0']) BOARD_SLOTS['combat_1_0'].chip = 't0_atk_2';",
  "if (BOARD_SLOTS['combat_1_0']) BOARD_SLOTS['combat_1_0'].chip = 't1_atk_3';"
);
code = code.replace(
  "if (BOARD_SLOTS['combat_1_4']) BOARD_SLOTS['combat_1_4'].chip = 't0_crit_2';",
  "if (BOARD_SLOTS['combat_1_4']) BOARD_SLOTS['combat_1_4'].chip = 't1_crit_3';"
);

// 2. Add defensive check in renderBoardSlots
code = code.replace(
  "const hasChip = !!slotData.chip;",
  `let hasChip = !!slotData.chip;
        if (hasChip && !CHIP_SPECS[slotData.chip]) {
          slotData.chip = null;
          hasChip = false;
        }`
);

// 3. Make DISC_META contain explicit solid and faint colors, and theme classes
code = code.replace(
  `    const DISC_META = {
      combat:   { name: '攻击盘', theme: 'rose',  color: '#f43f5e', cx: 720,  cy: 220, outAngleRad: 45 * Math.PI / 180 },
      industry: { name: '工厂盘', theme: 'amber', color: '#d97706', cx: 400,  cy: 520, outAngleRad: -45 * Math.PI / 180 },
      support:  { name: '辅助盘', theme: 'sky',   color: '#0284c7', cx: 1040, cy: 520, outAngleRad: 180 * Math.PI / 180 }
    };`,
  `    const DISC_META = {
      combat:   { name: '攻击盘', theme: 'rose',  color: '#f43f5e', faintColor: 'rgba(244, 63, 94, 0.25)', bgFill: '#fff1f2', slotBorder: 'border-rose-400 hover:border-rose-600 hover:bg-rose-50', slotDot: 'bg-rose-500', cx: 720,  cy: 220, outAngleRad: 45 * Math.PI / 180 },
      industry: { name: '工厂盘', theme: 'amber', color: '#d97706', faintColor: 'rgba(217, 119, 6, 0.25)', bgFill: '#fffbeb', slotBorder: 'border-amber-400 hover:border-amber-600 hover:bg-amber-50', slotDot: 'bg-amber-500', cx: 400,  cy: 520, outAngleRad: -45 * Math.PI / 180 },
      support:  { name: '辅助盘', theme: 'sky',   color: '#0284c7', faintColor: 'rgba(2, 132, 199, 0.25)', bgFill: '#f0f9ff', slotBorder: 'border-sky-400 hover:border-sky-600 hover:bg-sky-50', slotDot: 'bg-sky-500', cx: 1040, cy: 520, outAngleRad: 180 * Math.PI / 180 }
    };`
);

// 4. Update the SVG background circles dynamically to match active rings!
// Replace static r=168 circles in SVG with dynamic groups
code = code.replace(
  `          <!-- 1. 顶部：攻击盘背景 (cx: 720, cy: 220, R=165) -->
          <circle cx="720" cy="220" r="168" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 3" fill="#fff1f2" fill-opacity="0.25"/>

          <!-- 2. 左下：工厂盘背景 (cx: 400, cy: 520, R=165) -->
          <circle cx="400" cy="520" r="168" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3" fill="#fffbeb" fill-opacity="0.25"/>

          <!-- 3. 右下：辅助盘背景 (cx: 1040, cy: 520, R=165) -->
          <circle cx="1040" cy="520" r="168" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4 3" fill="#f0f9ff" fill-opacity="0.25"/>`,
  `          <!-- 动态三大盘激活外轮廓底晕层 -->
          <g id="dynamicDiscBgGroup"></g>`
);

fs.writeFileSync('processor/index.html', code);
console.log('Updated processor/index.html step 1');
