const fs = require('fs');
const path = require('path');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Standardize CHIP_SPECS
const STANDARDIZED_CHIP_SPECS = {
  // ==================== 1格步进 (初级) ====================
  t0_atk_1: {
    id: 't0_atk_1', step: 1, tier: 0, category: 'combat',
    name: '攻击芯片 · 初级', tag: '攻击 · 1格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-amber-400',
    buff: { atk: 5 }, buffDesc: '飞剑攻击 +5%', stepDesc: '顺步 +1 格',
    icon: 'fa-khanda', textColor: 'text-slate-900', badgeColor: 'bg-amber-50 text-amber-900 border-amber-400'
  },
  t0_mine_1: {
    id: 't0_mine_1', step: 1, tier: 0, category: 'industry',
    name: '采矿芯片 · 初级', tag: '采矿 · 1格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-amber-400',
    buff: { mining_speed: 5 }, buffDesc: '采矿速度 +5%', stepDesc: '顺步 +1 格',
    icon: 'fa-trowel-bricks', textColor: 'text-slate-900', badgeColor: 'bg-amber-50 text-amber-900 border-amber-400'
  },
  t0_speed_1: {
    id: 't0_speed_1', step: 1, tier: 0, category: 'mobility',
    name: '移速芯片 · 初级', tag: '移速 · 1格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-amber-400',
    buff: { speed: 5 }, buffDesc: '移动速度 +5%', stepDesc: '顺步 +1 格',
    icon: 'fa-wind', textColor: 'text-slate-900', badgeColor: 'bg-amber-50 text-amber-900 border-amber-400'
  },
  t0_craft_1: {
    id: 't0_craft_1', step: 1, tier: 0, category: 'industry',
    name: '制造芯片 · 初级', tag: '制造 · 1格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-amber-400',
    buff: { craft_speed: 5 }, buffDesc: '制造速度 +5%', stepDesc: '顺步 +1 格',
    icon: 'fa-gears', textColor: 'text-slate-900', badgeColor: 'bg-amber-50 text-amber-900 border-amber-400'
  },

  // ==================== 2格步进 (初级) ====================
  t0_atspd_2: {
    id: 't0_atspd_2', step: 2, tier: 0, category: 'combat',
    name: '攻速芯片 · 初级', tag: '攻速 · 2格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-sky-400',
    buff: { atspd: 8 }, buffDesc: '攻击速度 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-bolt-lightning', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },
  t0_def_2: {
    id: 't0_def_2', step: 2, tier: 0, category: 'combat',
    name: '防御芯片 · 初级', tag: '防御 · 2格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-sky-400',
    buff: { def: 8 }, buffDesc: '阵法防御 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-shield-halved', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },
  t0_belt_2: {
    id: 't0_belt_2', step: 2, tier: 0, category: 'industry',
    name: '传送带芯片 · 初级', tag: '传送 · 2格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-sky-400',
    buff: { belt_speed: 8 }, buffDesc: '传送速度 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-dolly', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },
  t0_burn_2: {
    id: 't0_burn_2', step: 2, tier: 0, category: 'industry',
    name: '燃烧芯片 · 初级', tag: '燃烧 · 2格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-sky-400',
    buff: { burn_speed: 8 }, buffDesc: '燃烧能效 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-fire', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },
  t0_mine_2: {
    id: 't0_mine_2', step: 2, tier: 0, category: 'industry',
    name: '采矿芯片 · 初级', tag: '采矿 · 2格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-sky-400',
    buff: { mining_speed: 8 }, buffDesc: '采矿速度 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-trowel-bricks', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },
  t0_craft_2: {
    id: 't0_craft_2', step: 2, tier: 0, category: 'industry',
    name: '制造芯片 · 初级', tag: '制造 · 2格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-sky-400',
    buff: { craft_speed: 8 }, buffDesc: '制造速度 +8%', stepDesc: '顺步 +2 格',
    icon: 'fa-gears', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-900 border-sky-400'
  },

  // ==================== 3格步进 (中级) ====================
  t1_atk_3: {
    id: 't1_atk_3', step: 3, tier: 1, category: 'combat',
    name: '攻击芯片 · 中级', tag: '攻击 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-slate-700',
    buff: { atk: 10 }, buffDesc: '飞剑攻击 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-khanda', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_atspd_3: {
    id: 't1_atspd_3', step: 3, tier: 1, category: 'combat',
    name: '攻速芯片 · 中级', tag: '攻速 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-slate-700',
    buff: { atspd: 10 }, buffDesc: '攻击速度 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-bolt-lightning', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_def_3: {
    id: 't1_def_3', step: 3, tier: 1, category: 'combat',
    name: '防御芯片 · 中级', tag: '防御 · 3格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-slate-700',
    buff: { def: 10 }, buffDesc: '阵法防御 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-shield-halved', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_hp_3: {
    id: 't1_hp_3', step: 3, tier: 1, category: 'combat',
    name: '生命芯片 · 中级', tag: '生命 · 3格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-slate-700',
    buff: { hp: 10 }, buffDesc: '灵脉气血 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-heart-pulse', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_crit_3: {
    id: 't1_crit_3', step: 3, tier: 1, category: 'combat',
    name: '暴击芯片 · 中级', tag: '暴击 · 3格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-slate-700',
    buff: { crit: 10 }, buffDesc: '暴击几率 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-crosshairs', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_speed_3: {
    id: 't1_speed_3', step: 3, tier: 1, category: 'mobility',
    name: '移速芯片 · 中级', tag: '移速 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-slate-700',
    buff: { speed: 10 }, buffDesc: '移动速度 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-wind', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_stamina_3: {
    id: 't1_stamina_3', step: 3, tier: 1, category: 'mobility',
    name: '体力芯片 · 中级', tag: '体力 · 3格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-slate-700',
    buff: { stamina: 10 }, buffDesc: '御剑体力 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-person-running', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_battery_3: {
    id: 't1_battery_3', step: 3, tier: 1, category: 'mobility',
    name: '电量芯片 · 初级', tag: '电量 · 3格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-belt border-slate-700',
    buff: { flight_battery: 15 }, buffDesc: '飞行电池 +15%', stepDesc: '顺步 +3 格',
    icon: 'fa-battery-half', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_inventory_3: {
    id: 't1_inventory_3', step: 3, tier: 1, category: 'mobility',
    name: '背包芯片 · 中级', tag: '背包 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-def border-slate-700',
    buff: { inventory: 4 }, buffDesc: '储物背包 +4格', stepDesc: '顺步 +3 格',
    icon: 'fa-box-open', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_craft_3: {
    id: 't1_craft_3', step: 3, tier: 1, category: 'industry',
    name: '制造芯片 · 中级', tag: '制造 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-slate-700',
    buff: { craft_speed: 10 }, buffDesc: '制造速度 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-gears', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_mine_3: {
    id: 't1_mine_3', step: 3, tier: 1, category: 'industry',
    name: '采矿芯片 · 中级', tag: '采矿 · 3格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-slate-700',
    buff: { mining_speed: 10 }, buffDesc: '采矿速度 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-trowel-bricks', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_burn_3: {
    id: 't1_burn_3', step: 3, tier: 1, category: 'industry',
    name: '燃烧芯片 · 中级', tag: '燃烧 · 3格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-slate-700',
    buff: { burn_speed: 10 }, buffDesc: '燃烧能效 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-fire', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_belt_3: {
    id: 't1_belt_3', step: 3, tier: 1, category: 'industry',
    name: '传送带芯片 · 中级', tag: '传送 · 3格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-slate-700',
    buff: { belt_speed: 10 }, buffDesc: '传送速度 +10%', stepDesc: '顺步 +3 格',
    icon: 'fa-dolly', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_power_3: {
    id: 't1_power_3', step: 3, tier: 1, category: 'industry',
    name: '节能芯片 · 中级', tag: '节能 · 3格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-slate-700',
    buff: { power_cut: 10 }, buffDesc: '用电能耗 -10%', stepDesc: '顺步 +3 格',
    icon: 'fa-bolt', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },
  t1_pollute_3: {
    id: 't1_pollute_3', step: 3, tier: 1, category: 'industry',
    name: '环保芯片 · 中级', tag: '环保 · 3格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-slate-700',
    buff: { pollute_cut: 10 }, buffDesc: '污染排放 -10%', stepDesc: '顺步 +3 格',
    icon: 'fa-leaf', textColor: 'text-slate-900', badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  },

  // ==================== 5格步进 (中级/高级) ====================
  t2_atk_5: {
    id: 't2_atk_5', step: 5, tier: 2, category: 'combat',
    name: '攻击芯片 · 中级', tag: '攻击 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-sky-400',
    buff: { atk: 20 }, buffDesc: '飞剑攻击 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-khanda', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_atspd_5: {
    id: 't2_atspd_5', step: 5, tier: 2, category: 'combat',
    name: '攻速芯片 · 高级', tag: '攻速 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-sky-400',
    buff: { atspd: 20 }, buffDesc: '攻击速度 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-bolt-lightning', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_def_5: {
    id: 't2_def_5', step: 5, tier: 2, category: 'combat',
    name: '防御芯片 · 高级', tag: '防御 · 5格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-sky-400',
    buff: { def: 20 }, buffDesc: '阵法防御 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-shield-halved', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_hp_5: {
    id: 't2_hp_5', step: 5, tier: 2, category: 'combat',
    name: '生命芯片 · 高级', tag: '生命 · 5格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-sky-400',
    buff: { hp: 20 }, buffDesc: '灵脉气血 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-heart-pulse', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_crit_5: {
    id: 't2_crit_5', step: 5, tier: 2, category: 'combat',
    name: '暴击芯片 · 高级', tag: '暴击 · 5格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-sky-400',
    buff: { crit: 20 }, buffDesc: '暴击几率 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-crosshairs', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_sword_funnel_1: {
    id: 't2_sword_funnel_1', step: 5, tier: 2, category: 'combat',
    name: '飞剑芯片 · 中级', tag: '飞剑 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-funnel border-sky-400',
    buff: { sword_funnel: 1 }, buffDesc: '浮游飞剑 +1把', stepDesc: '顺步 +5 格',
    icon: 'fa-jet-fighter-up', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_speed_5: {
    id: 't2_speed_5', step: 5, tier: 2, category: 'mobility',
    name: '移速芯片 · 高级', tag: '移速 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-sky-400',
    buff: { speed: 20 }, buffDesc: '移动速度 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-wind', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_battery_5: {
    id: 't2_battery_5', step: 5, tier: 2, category: 'mobility',
    name: '电量芯片 · 中级', tag: '电量 · 5格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-belt border-sky-400',
    buff: { flight_battery: 30 }, buffDesc: '飞行电量 +30%', stepDesc: '顺步 +5 格',
    icon: 'fa-battery-three-quarters', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_inventory_5: {
    id: 't2_inventory_5', step: 5, tier: 2, category: 'mobility',
    name: '背包芯片 · 高级', tag: '背包 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-def border-sky-400',
    buff: { inventory: 8 }, buffDesc: '储物背包 +8格', stepDesc: '顺步 +5 格',
    icon: 'fa-box-open', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_craft_5: {
    id: 't2_craft_5', step: 5, tier: 2, category: 'industry',
    name: '制造芯片 · 中级', tag: '制造 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-sky-400',
    buff: { craft_speed: 20 }, buffDesc: '制造速度 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-gears', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_mine_5: {
    id: 't2_mine_5', step: 5, tier: 2, category: 'industry',
    name: '采矿芯片 · 中级', tag: '采矿 · 5格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-sky-400',
    buff: { mining_speed: 20 }, buffDesc: '采矿速度 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-trowel-bricks', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_burn_5: {
    id: 't2_burn_5', step: 5, tier: 2, category: 'industry',
    name: '燃烧芯片 · 高级', tag: '燃烧 · 5格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-sky-400',
    buff: { burn_speed: 20 }, buffDesc: '燃烧能效 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-fire', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_belt_5: {
    id: 't2_belt_5', step: 5, tier: 2, category: 'industry',
    name: '传送带芯片 · 高级', tag: '传送 · 5格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-sky-400',
    buff: { belt_speed: 20 }, buffDesc: '传送速度 +20%', stepDesc: '顺步 +5 格',
    icon: 'fa-dolly', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_power_5: {
    id: 't2_power_5', step: 5, tier: 2, category: 'industry',
    name: '节能芯片 · 高级', tag: '节能 · 5格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-sky-400',
    buff: { power_cut: 20 }, buffDesc: '用电能耗 -20%', stepDesc: '顺步 +5 格',
    icon: 'fa-bolt', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },
  t2_pollute_5: {
    id: 't2_pollute_5', step: 5, tier: 2, category: 'industry',
    name: '环保芯片 · 高级', tag: '环保 · 5格', type: 'step',
    shape: 'shape-circle', matClass: 'token-def border-sky-400',
    buff: { pollute_cut: 20 }, buffDesc: '污染排放 -20%', stepDesc: '顺步 +5 格',
    icon: 'fa-leaf', textColor: 'text-slate-900', badgeColor: 'bg-sky-50 text-sky-800 border-sky-300'
  },

  // ==================== 8格步进 (高级) ====================
  t3_atk_8: {
    id: 't3_atk_8', step: 8, tier: 3, category: 'combat',
    name: '攻击芯片 · 高级', tag: '攻击 · 8格', type: 'step',
    shape: 'shape-square', matClass: 'token-atk border-amber-400',
    buff: { atk: 30 }, buffDesc: '飞剑攻击 +30%', stepDesc: '顺步 +8 格',
    icon: 'fa-khanda', textColor: 'text-slate-900', badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-black'
  },
  t3_sword_funnel_2: {
    id: 't3_sword_funnel_2', step: 8, tier: 3, category: 'combat',
    name: '飞剑芯片 · 高级', tag: '飞剑 · 8格', type: 'step',
    shape: 'shape-square', matClass: 'token-funnel border-amber-400',
    buff: { sword_funnel: 2 }, buffDesc: '浮游飞剑 +2把', stepDesc: '顺步 +8 格',
    icon: 'fa-jet-fighter-up', textColor: 'text-slate-900', badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-black'
  },
  t3_battery_8: {
    id: 't3_battery_8', step: 8, tier: 3, category: 'mobility',
    name: '电量芯片 · 高级', tag: '电量 · 8格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-belt border-amber-400',
    buff: { flight_battery: 50 }, buffDesc: '飞行电量 +50%', stepDesc: '顺步 +8 格',
    icon: 'fa-battery-full', textColor: 'text-slate-900', badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-black'
  },
  t3_craft_8: {
    id: 't3_craft_8', step: 8, tier: 3, category: 'industry',
    name: '制造芯片 · 高级', tag: '制造 · 8格', type: 'step',
    shape: 'shape-square', matClass: 'token-belt border-amber-400',
    buff: { craft_speed: 30 }, buffDesc: '制造速度 +30%', stepDesc: '顺步 +8 格',
    icon: 'fa-gears', textColor: 'text-slate-900', badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-black'
  },
  t3_mine_8: {
    id: 't3_mine_8', step: 8, tier: 3, category: 'industry',
    name: '采矿芯片 · 高级', tag: '采矿 · 8格', type: 'step',
    shape: 'shape-diamond', matClass: 'token-atk border-amber-400',
    buff: { mining_speed: 30 }, buffDesc: '采矿速度 +30%', stepDesc: '顺步 +8 格',
    icon: 'fa-trowel-bricks', textColor: 'text-slate-900', badgeColor: 'bg-amber-100 text-amber-900 border-amber-400 font-black'
  },

  // ==================== 变轨折射构件 ====================
  chip_triangle_in: {
    id: 'chip_triangle_in', step: 0, tier: 1, category: 'utility',
    name: '向心变轨镜 · 初级', tag: '变轨 · 向心', type: 'shift_in',
    shape: 'shape-triangle', matClass: 'token-shift border-sky-400',
    buff: {}, buffDesc: '导向内环 / 跨盘外挂', stepDesc: '折射光流至相邻内圈',
    icon: 'fa-play', textColor: 'text-slate-900', badgeColor: 'bg-sky-100 text-sky-900 border-sky-400'
  }
};

// 2. Standardize KEYSTONE_TRAITS
const STANDARDIZED_KEYSTONE_TRAITS = {
  keystone_furnace: {
    id: 'keystone_furnace',
    name: '熔铸核心插件 · 高级',
    category: 'industry',
    tag: '工业 · 熔铸',
    icon: 'fa-fire-burner',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    buffDesc: '熔炼能耗 -30% · 制造速度 +25%',
    traitDesc: '全阵工业芯片≥4时触发无损淬火，废料产出减少 100%',
    buff: { power_cut: 30, craft_speed: 25 },
    beamColor: 'gold'
  },
  keystone_logistics: {
    id: 'keystone_logistics',
    name: '物流核心插件 · 高级',
    category: 'industry',
    tag: '工业 · 物流',
    icon: 'fa-dolly',
    color: 'sky',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-400',
    buffDesc: '传送速度 +50% · 储物背包 +8格',
    traitDesc: '光束贯通全盘时，货运飞剑解锁空间折跃',
    buff: { belt_speed: 50, inventory: 8 },
    beamColor: 'cyan'
  },
  keystone_assembly: {
    id: 'keystone_assembly',
    name: '量产核心插件 · 高级',
    category: 'industry',
    tag: '工业 · 量产',
    icon: 'fa-cubes-stacked',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-400',
    buffDesc: '装配与制造基础产出 +30%',
    traitDesc: '全盘闭环时，每次生产有 15% 概率获得双倍成品暴击',
    buff: { craft_speed: 30 },
    beamColor: 'emerald'
  },
  keystone_leyline: {
    id: 'keystone_leyline',
    name: '聚灵核心插件 · 高级',
    category: 'industry',
    tag: '能源 · 聚灵',
    icon: 'fa-bolt',
    color: 'sky',
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-400',
    buffDesc: '全厂供能 +40% · 污染排放 -25%',
    traitDesc: '传输损耗清零，全阵星宿倍率额外 +0.3x',
    buff: { power_cut: 25, pollute_cut: 25 },
    beamColor: 'cyan'
  },
  keystone_void_reap: {
    id: 'keystone_void_reap',
    name: '裂解核心插件 · 高级',
    category: 'industry',
    tag: '环保 · 裂解',
    icon: 'fa-atom',
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-400',
    buffDesc: '废料清零 · 宗门灵石产出 +35%',
    traitDesc: '废料与残渣直接转化为纯净灵精，产线永不故障',
    buff: { burn_speed: 35, pollute_cut: 30 },
    beamColor: 'purple'
  },
  keystone_sword_array: {
    id: 'keystone_sword_array',
    name: '飞剑核心插件 · 高级',
    category: 'combat',
    tag: '战伐 · 飞剑',
    icon: 'fa-shield-virus',
    color: 'purple',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-400',
    buffDesc: '浮游飞剑 +2把 · 飞剑攻击 +40%',
    traitDesc: '每次步进从核位射出一道贯穿引雷剑气',
    buff: { sword_funnel: 2, atk: 40 },
    beamColor: 'purple'
  },
  keystone_aegis: {
    id: 'keystone_aegis',
    name: '防御核心插件 · 高级',
    category: 'combat',
    tag: '防卫 · 护盾',
    icon: 'fa-shield-halved',
    color: 'rose',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-400',
    buffDesc: '阵法防御 +50% · 最大气血 +50%',
    traitDesc: '受到致命伤免疫死亡；全阵防御的 50% 转化为反震真伤',
    buff: { def: 50, hp: 50 },
    beamColor: 'rose'
  },
  keystone_alchemy: {
    id: 'keystone_alchemy',
    name: '炼丹核心插件 · 高级',
    category: 'living',
    tag: '生产 · 炼丹',
    icon: 'fa-flask-round-potion',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    buffDesc: '采矿产出 +25% · 御剑体力 +30%',
    traitDesc: '炼制高阶丹药耗材减半，全宗弟子修炼速度 +35%',
    buff: { mining_speed: 25, stamina: 30 },
    beamColor: 'gold'
  },
  keystone_pocket: {
    id: 'keystone_pocket',
    name: '储物核心插件 · 高级',
    category: 'mobility',
    tag: '身法 · 储物',
    icon: 'fa-box-open',
    color: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-400',
    buffDesc: '储物背包 +24格 · 采矿速度 +40%',
    traitDesc: '全图掉落物自动磁吸拾取，御剑体力消耗减半',
    buff: { inventory: 24, mining_speed: 40, stamina: 20 },
    beamColor: 'cyan'
  },
  keystone_divination: {
    id: 'keystone_divination',
    name: '神机核心插件 · 高级',
    category: 'mobility',
    tag: '探测 · 暴击',
    icon: 'fa-eye',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
    buffDesc: '暴击几率 +25% · 飞行电池 +30%',
    traitDesc: '全图地脉高纯度矿点与远古秘境直接透视高亮',
    buff: { crit: 25, flight_battery: 30 },
    beamColor: 'gold'
  }
};

// Replace CHIP_SPECS block in content
const idxChipStart = content.indexOf('const CHIP_SPECS = {');
const idxChipEnd = content.indexOf('const KEYSTONE_TRAITS = {', idxChipStart);

const newChipStr = 'const CHIP_SPECS = ' + JSON.stringify(STANDARDIZED_CHIP_SPECS, null, 2) + ';\n\n    ';
content = content.substring(0, idxChipStart) + newChipStr + content.substring(idxChipEnd);

// Replace KEYSTONE_TRAITS block in content
const idxKsStart = content.indexOf('const KEYSTONE_TRAITS = {');
const idxKsEnd = content.indexOf('const DISC_KEYSTONE_META = {', idxKsStart);

const newKsStr = 'const KEYSTONE_TRAITS = ' + JSON.stringify(STANDARDIZED_KEYSTONE_TRAITS, null, 2) + ';\n\n    ';
content = content.substring(0, idxKsStart) + newKsStr + content.substring(idxKsEnd);

// Standardize left tab label
content = content.replace(/💎 极核心法/g, '💎 核心插件');
content = content.replace(/核心特质元印匣/g, '核心插槽插件库');
content = content.replace(/阶梯动力构件库/g, '芯片与插件构件库');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully standardized all chip specs and keystone traits in optical_array_prototype.html!');
