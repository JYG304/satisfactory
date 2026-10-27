const fs = require('fs');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Remove Mode Switcher (天机解谜 / 自由装配) from Header
content = content.replace(
  /<!-- 模式切换：益智解谜 \/ 自由装配 -->\s*<div class="flex items-center bg-slate-100 p-0\.5 rounded-lg border border-slate-300 text-xs font-mono-sci font-bold">[\s\S]*?<\/div>/,
  ''
);

// 2. Remove puzzleChallengeCard from Canvas stage
content = content.replace(
  /<!-- ======================== 左上：天机解谜 · 灵枢试炼益智挑战面板 ======================== -->\s*<div id="puzzleChallengeCard"[\s\S]*?<!-- 操作小贴士浮窗 -->/,
  '<!-- 操作小贴士浮窗 -->'
);

// 3. Remove evaluatePuzzleGoals hook from updatePanels
content = content.replace(
  /\s*\/\/ 触发益智解谜关卡目标评估\s*if \(typeof evaluatePuzzleGoals === 'function'\) \{[\s\S]*?\}\s*\}/,
  '\n    }'
);

// 4. Remove PUZZLE_LEVELS and all puzzle functions
content = content.replace(
  /\/\/ =========================================================================\s*\/\/ 【益智解谜 · 天机试炼系统】[\s\S]*?\/\/ 工况预设下拉交互/,
  '// 工况预设下拉交互'
);

// 5. In DOMContentLoaded, restore standard default scenario
content = content.replace(
  /setAppMode\('puzzle'\);[\s\S]*?\/\/ 默认进入精选天机解谜模式，亦可一键切换自由装配/,
  "loadScenario('multi_disc_overdrive');"
);

// Clean up any remaining onPlayerActionMove calls
content = content.replace(/onPlayerActionMove\(\);/g, '');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully removed puzzle trial completely!');
