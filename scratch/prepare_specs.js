const fs = require('fs');

const orig = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

const chipStart = orig.indexOf('const CHIP_SPECS = {');
const chipEnd = orig.indexOf('const KEYSTONE_TRAITS =', chipStart);
const chipSpecsStr = orig.substring(chipStart, chipEnd).trim();

const keystoneStart = orig.indexOf('const KEYSTONE_TRAITS = {');
const keystoneEnd = orig.indexOf('const DISC_KEYSTONE_META =', keystoneStart);
const keystoneTraitsStr = orig.substring(keystoneStart, keystoneEnd).trim();

// Add core items into CHIP_SPECS for core socketing:
const extraCores = `
  "core_support": {
    "id": "core_support",
    "step": 1,
    "tier": 3,
    "category": "mobility",
    "name": "【辅助灵枢极核】",
    "tag": "充能核心 · 跨盘导入",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-funnel border-sky-400",
    "buff": { "speed": 20, "flight_battery": 40 },
    "buffDesc": "激活辅助盘➔目标盘高能光路导入线！",
    "stepDesc": "外置于外圈插槽即可引接高能光束",
    "icon": "fa-diamond",
    "textColor": "text-sky-300",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-400"
  },
  "core_industry": {
    "id": "core_industry",
    "step": 1,
    "tier": 3,
    "category": "industry",
    "name": "【工厂构形极核】",
    "tag": "充能核心 · 跨盘导入",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-belt border-amber-400",
    "buff": { "craft_speed": 35, "mining_speed": 35 },
    "buffDesc": "激活工厂盘➔攻击盘高能光路导入线！",
    "stepDesc": "外置于外圈插槽即可引接高能光束",
    "icon": "fa-sun",
    "textColor": "text-amber-300",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-400"
  },
  "core_combat": {
    "id": "core_combat",
    "step": 1,
    "tier": 3,
    "category": "combat",
    "name": "【战伐诛仙极核】",
    "tag": "终极核心 · 阵眼贯通",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-atk border-rose-400",
    "buff": { "atk": 50, "crit": 25 },
    "buffDesc": "全阵大贯通，攻击力与暴击狂暴倍率提升！",
    "stepDesc": "战伐中心大圆满核心",
    "icon": "fa-crosshairs",
    "textColor": "text-rose-300",
    "badgeColor": "bg-rose-50 text-rose-800 border-rose-400"
  },
`;

const updatedChipSpecs = chipSpecsStr.replace('const CHIP_SPECS = {', 'const CHIP_SPECS = {' + extraCores);

console.log('Extra cores injected into CHIP_SPECS.');
fs.writeFileSync('scratch/chip_specs_augmented.js', updatedChipSpecs);
fs.writeFileSync('scratch/keystone_traits.js', keystoneTraitsStr);
console.log('Saved augmented specs.');
