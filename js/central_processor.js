// =========================================================================
// js/central_processor.js - 中央处理器 · 四大母板 × 50+ 工业节点 × 金身突破节点 × 宗门法令
// 设计：
//  1. 四大母板（战斗/生产/辅助/研发），原有 50+ 工业调配节点与研发芯片全部保留
//  2. 金身突破节点作为"实体节点"嵌入对应母板：先消耗背包材料激活，再拉线接入该母板核心的空闲插座才生效
//  3. 核心插座数量有限 + 全局算力上限 100 FLOPS => 取舍 (BUILD)
//  4. 宗门四大法令：全局自选，附带收益与代价
// =========================================================================

// ---------------- 1. 宗门天道法令配置 (生产类 4 种 + 战斗类 4 种) ----------------
const CPU_DECREE_CONFIGS = {
  // ---------------- ⚙ 生产类型法令 (4 种) ----------------
  decree_prod_mine: {
    id: 'decree_prod_mine', category: 'production', catName: '生产类型',
    name: '极速采掘令', title: '地脉裂变 · 极速采掘令', color: '#f59e0b', icon: 'fa-solid fa-trowel-bricks',
    buffDesc: '全厂采矿速度 +120%，矿井出料双倍开采',
    costDesc: '持续能耗：电网负荷 +25 MW ｜ 煤炭损耗 15/分',
    bonus: { mine: 120 }, powerCost: 25, coalCost: 15, heatAdd: 6
  },
  decree_prod_smelt: {
    id: 'decree_prod_smelt', category: 'production', catName: '生产类型',
    name: '三昧熔铸令', title: '离火三昧 · 暴产熔铸令', color: '#ea580c', icon: 'fa-solid fa-fire',
    buffDesc: '精炼炉冶炼速率 +130%，产出双倍高纯锭材',
    costDesc: '持续损耗：耐火砖 -5/分 ｜ 主板发热 +18°C',
    bonus: { smelt: 130 }, brickCost: 5, heatAdd: 18
  },
  decree_prod_belt: {
    id: 'decree_prod_belt', category: 'production', catName: '生产类型',
    name: '灵磁飞梭令', title: '天罡飞梭 · 音速物流令', color: '#10b981', icon: 'fa-solid fa-bolt',
    buffDesc: '传送带流速 +150%，导轨回旋提速翻倍',
    costDesc: '持续损耗：导电线圈 -8/分 ｜ 占用算力 15 FLOPS',
    bonus: { belt: 150 }, coilCost: 8, capPenalty: 15
  },
  decree_prod_clean: {
    id: 'decree_prod_clean', category: 'production', catName: '生产类型',
    name: '天工太极令', title: '天工混元 · 零排污闭环令', color: '#06b6d4', icon: 'fa-solid fa-circle-notch',
    buffDesc: '排污杂波中和率 100%，主板降温 -25°C，杜绝爆管',
    costDesc: '代价平衡：全厂基建流速 -15% ｜ 持续消耗玄冰冷凝水',
    bonus: { power: 30 }, coolBonus: 25, flowPenaltyPct: 15
  },

  // ---------------- ⚔ 战斗类型法令 (4 种) ----------------
  decree_combat_sword: {
    id: 'decree_combat_sword', category: 'combat', catName: '战斗类型',
    name: '九霄破军令', title: '九霄破军 · 万剑杀伐令', color: '#f97316', icon: 'fa-solid fa-burst',
    buffDesc: '飞剑杀伤 +120%，出鞘攻击频率 +40%',
    costDesc: '实战代价：角色灵力消耗 +30% ｜ 剑刃玄铁磨损 2/分',
    bonus: { sword: 120 }, manaCostPct: 30
  },
  decree_combat_armor: {
    id: 'decree_combat_armor', category: 'combat', catName: '战斗类型',
    name: '不动金刚令', title: '大乘不动 · 金刚不坏令', color: '#ef4444', icon: 'fa-solid fa-shield-halved',
    buffDesc: '护体罡气 +450，受击免伤 +35%',
    costDesc: '实战代价：角色移速 -20% ｜ 消耗玄铁板修补罡气',
    bonus: { armorFlat: 450, armorPct: 35 }, speedPenalty: 20
  },
  decree_combat_speed: {
    id: 'decree_combat_speed', category: 'combat', catName: '战斗类型',
    name: '神行凌虚令', title: '太虚踏风 · 神行遁法令', color: '#38bdf8', icon: 'fa-solid fa-person-running',
    buffDesc: '角色移速 +80%，风翼滑翔闪避距离翻倍',
    costDesc: '实战代价：护体罡气 -30% ｜ 持续消耗导灵铜片',
    bonus: { speed: 80 }, armorPenalty: 30
  },
  decree_combat_wuxing: {
    id: 'decree_combat_wuxing', category: 'combat', catName: '战斗类型',
    name: '周天混元令', title: '五行归一 · 周天万法令', color: '#c084fc', icon: 'fa-solid fa-sun',
    buffDesc: '所有金身突破节点共鸣效果额外 +60%，全相暴击',
    costDesc: '阵眼代价：锁定 20 FLOPS 算力上限维持护法大阵',
    bonus: {}, jinshenMult: 1.6, capPenalty: 20
  }
};

// 兼容别名
CPU_DECREE_CONFIGS.decree_metal_flesh = CPU_DECREE_CONFIGS.decree_prod_mine;
CPU_DECREE_CONFIGS.decree_all_spirit = CPU_DECREE_CONFIGS.decree_prod_belt;
CPU_DECREE_CONFIGS.decree_overclock_dao = CPU_DECREE_CONFIGS.decree_prod_smelt;
CPU_DECREE_CONFIGS.decree_balance_wuxing = CPU_DECREE_CONFIGS.decree_combat_wuxing;

// ---------------- 2. 核心状态 ----------------
const CPU_BLUEPRINT_STATE = {
  zoom: 0.72, panX: 0, panY: 0, rotation: 0,
  activeZoneId: 'zone2',
  activeDecree: 'decree_prod_mine',
  activeDecreeCategory: 'production',
  currentFlowRate: 1000,
  baseComputeCap: 100,
  zones: {
    zone1: {
      id: 'zone1', name: '1. 战斗母板', shortName: '战斗', themeColor: '#ef4444', icon: 'fa-solid fa-khanda',
      rect: { x: 100, y: 150, width: 2200, height: 1300 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片/金身节点接入战斗总核心 4 个插座',
      inputMaterials: { '玄铁齿轮': { signal: 60 }, '灵磁齿轮': { signal: 100 }, '法宝阵图胚': { signal: 250 } }
    },
    zone2: {
      id: 'zone2', name: '2. 生产母板', shortName: '生产', themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
      rect: { x: 2450, y: 150, width: 2200, height: 1300 }, unlocked: true, satisfied: false,
      coreRequirement: '50+ 节点网络满足 4 大提速口，剩余 2 插座留给金身节点',
      inputMaterials: {}
    },
    zone3: {
      id: 'zone3', name: '3. 辅助母板', shortName: '辅助', themeColor: '#38bdf8', icon: 'fa-solid fa-person-running',
      rect: { x: 100, y: 1600, width: 2200, height: 1300 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片/金身节点接入辅助总核心 4 个插座',
      inputMaterials: { '铜线': { signal: 40 }, '导电线圈': { signal: 100 }, '电能核心': { signal: 200 } }
    },
    zone4: {
      id: 'zone4', name: '4. 研发母板', shortName: '研发', themeColor: '#10b981', icon: 'fa-solid fa-flask',
      rect: { x: 2450, y: 1600, width: 2200, height: 1300 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片接入研发总核心 4 个插座',
      inputMaterials: { '基础控制模块': { signal: 50 }, '电子生物芯片': { signal: 175 } }
    }
  },
  nodes: [], wires: [],
  connectingPin: null,
  draggingNodeId: null, dragStartMouse: { x: 0, y: 0 }, initialNodePos: { x: 0, y: 0 },
  isPanning: false, panStartMouse: { x: 0, y: 0 }, initialPanPos: { x: 0, y: 0 },
  selectedEntity: null,
  buffs: {}, computeLoad: 0, computeCap: 100,
  // 狂暴超频与温度系统 (白话好玩)
  temperature: 42,
  isOverclockBurnout: false,
  overclockMultiplier: 1.0
};

// ---------------- 3. 芯片 Lv.1~Lv.5 研发配置 ----------------
function _chipCfg(key, name, icon, color, socketName, lv) {
  return {
    key, name, icon, color, socketName,
    levels: lv.map((a, i) => ({ level: i + 1, bonusText: a[0], bonusVal: a[1], compute: a[2], cost: (a[3] || []).map(c => ({ name: c[0], count: c[1] })) }))
  };
}
const CHIP_UPGRADE_CONFIGS = {
  chip_mine: _chipCfg('chip_mine', '采矿提速芯片', 'fa-solid fa-trowel-bricks', '#f59e0b', '采矿提速', [
    ['采矿速度 +25%', 25, 10], ['采矿速度 +45%', 45, 14, [['玄铁齿轮', 10], ['导灵铜片', 5]]],
    ['采矿速度 +70%', 70, 18, [['玄铁梁', 10], ['导电线圈', 6]]], ['采矿速度 +100%', 100, 22, [['基础控制模块', 4], ['接线组件', 10]]],
    ['采矿速度 +140%', 140, 26, [['基础控制模块', 8], ['电源模块', 6]]]]),
  chip_smelt: _chipCfg('chip_smelt', '冶炼超频芯片', 'fa-solid fa-fire', '#ea580c', '冶炼超频', [
    ['精炼熔速 +30%', 30, 10], ['精炼熔速 +55%', 55, 14, [['玄铁板', 15], ['玄铁齿轮', 8]]],
    ['精炼熔速 +80%', 80, 18, [['导灵铜片', 10], ['导电线圈', 6]]], ['精炼熔速 +110%', 110, 22, [['玄铁梁', 15], ['基础控制模块', 4]]],
    ['精炼熔速 +150%', 150, 26, [['基础控制模块', 8], ['电源模块', 6]]]]),
  chip_burn: _chipCfg('chip_burn', '燃料耐烧芯片', 'fa-solid fa-fire-flame-curved', '#f97316', '燃料耐烧', [
    ['燃料时长 +40%', 40, 8], ['燃料时长 +70%', 70, 12, [['煤炭', 20], ['玄铁板', 10]]],
    ['燃料时长 +105%', 105, 16, [['玄铁梁', 8], ['接线组件', 8]]], ['燃料时长 +145%', 145, 20, [['导电线圈', 8], ['基础控制模块', 3]]],
    ['燃料时长 +190%', 190, 24, [['基础控制模块', 6], ['电源模块', 5]]]]),
  chip_belt: _chipCfg('chip_belt', '传送带超频芯片', 'fa-solid fa-bolt', '#10b981', '传送带速', [
    ['物流带速 +30%', 30, 8], ['物流带速 +50%', 50, 12, [['玄铁齿轮', 12], ['铜线', 30]]],
    ['物流带速 +75%', 75, 16, [['导灵铜片', 10], ['导电线圈', 5]]], ['物流带速 +105%', 105, 20, [['玄铁梁', 12], ['基础控制模块', 4]]],
    ['物流带速 +140%', 140, 24, [['基础控制模块', 8], ['接线组件', 15]]]]),
  chip_armor: _chipCfg('chip_armor', '金身淬皮芯片', 'fa-solid fa-shield-halved', '#ef4444', '罡气护体', [
    ['护甲罡气 +15%', 15, 10], ['护甲罡气 +30%', 30, 14, [['玄铁板', 20], ['玄铁锭', 15]]],
    ['护甲罡气 +50%', 50, 18, [['玄铁梁', 12], ['导灵铜片', 8]]], ['护甲罡气 +75%', 75, 22, [['基础控制模块', 4], ['导电线圈', 6]]],
    ['护甲罡气 +105%', 105, 26, [['基础控制模块', 8], ['电源模块', 6]]]]),
  chip_blade: _chipCfg('chip_blade', '飞剑淬芒芯片', 'fa-solid fa-burst', '#f97316', '飞剑破甲', [
    ['飞剑杀伤 +20%', 20, 10], ['飞剑杀伤 +40%', 40, 14, [['玄铁齿轮', 15], ['赤铜锭', 15]]],
    ['飞剑杀伤 +65%', 65, 18, [['导灵铜片', 10], ['接线组件', 8]]], ['飞剑杀伤 +95%', 95, 22, [['玄铁梁', 15], ['基础控制模块', 4]]],
    ['飞剑杀伤 +130%', 130, 26, [['基础控制模块', 8], ['电源模块', 6]]]]),
  chip_bag: _chipCfg('chip_bag', '须弥开窍芯片', 'fa-solid fa-box-archive', '#38bdf8', '空间扩展', [
    ['储物背包 +8格', 8, 8], ['储物背包 +16格', 16, 12, [['导电线圈', 5], ['铜线', 40]]],
    ['储物背包 +24格', 24, 16, [['导灵铜片', 8], ['设备接口件', 4]]], ['储物背包 +32格', 32, 20, [['基础控制模块', 4], ['接线组件', 10]]],
    ['储物背包 +40格', 40, 24, [['基础控制模块', 8], ['电源模块', 5]]]]),
  chip_speed: _chipCfg('chip_speed', '疾风神行芯片', 'fa-solid fa-person-running', '#06b6d4', '神行疾步', [
    ['移动速度 +20%', 20, 8], ['移动速度 +35%', 35, 12, [['玄铁齿轮', 12], ['铜线', 30]]],
    ['移动速度 +55%', 55, 16, [['导电线圈', 6], ['导灵铜片', 8]]], ['移动速度 +75%', 75, 20, [['设备接口件', 6], ['基础控制模块', 4]]],
    ['移动速度 +100%', 100, 24, [['基础控制模块', 8], ['电源模块', 5]]]]),
  chip_tech: _chipCfg('chip_tech', '经络通达芯片', 'fa-solid fa-network-wired', '#10b981', '研发提速', [
    ['研发速率 +25%', 25, 10], ['研发速率 +45%', 45, 14, [['基础控制模块', 2], ['导电线圈', 5]]],
    ['研发速率 +70%', 70, 18, [['基础控制模块', 4], ['接线组件', 8]]], ['研发速率 +100%', 100, 22, [['基础控制模块', 6], ['电源模块', 4]]],
    ['研发速率 +140%', 140, 26, [['基础控制模块', 10], ['电源模块', 8]]]]),
  chip_save: _chipCfg('chip_save', '灵能节约芯片', 'fa-solid fa-leaf', '#059669', '能耗节省', [
    ['工厂耗电 -15%', 15, 8], ['工厂耗电 -25%', 25, 12, [['导电线圈', 6], ['接线组件', 8]]],
    ['工厂耗电 -35%', 35, 16, [['基础控制模块', 3], ['电源模块', 4]]], ['工厂耗电 -45%', 45, 20, [['基础控制模块', 6], ['电源模块', 6]]],
    ['工厂耗电 -60%', 60, 24, [['基础控制模块', 8], ['电源模块', 8]]]])
};
const CHIP_STAT_MAP = {
  chip_mine: 'mine', chip_smelt: 'smelt', chip_burn: 'burn', chip_belt: 'belt',
  chip_armor: 'armorPct', chip_blade: 'sword', chip_bag: 'bag', chip_speed: 'speed', chip_tech: 'tech', chip_save: 'power'
};

// ---------------- 4. 金身突破节点 (嵌入各母板) ----------------
const CPU_JINSHEN_NODES_DATA = [
  { id: 'z1_jinshen_skin', zoneId: 'zone1', name: '庚金淬皮', category: 'gengjin', catName: '庚金淬体系', icon: 'fa-solid fa-shield-halved', themeColor: '#eab308', x: 110, y: 830, buffText: '护体罡气 +150，受击免伤 +15%', effects: { armor: 150, dmgReduction: 15 }, computeCost: 12, cost: [{ name: '玄铁板', need: 50 }, { name: '赤铜锭', need: 20 }], desc: '引熔融庚金注入皮下经脉，肉身化作金刚不坏之体。' },
  { id: 'z1_jinshen_blade', zoneId: 'zone1', name: '天罡飞剑淬芒', category: 'gengjin', catName: '庚金淬体系', icon: 'fa-solid fa-burst', themeColor: '#f97316', x: 330, y: 830, buffText: '飞剑斩击杀伤 +50%', effects: { swordDmg: 50 }, computeCost: 14, cost: [{ name: '灵磁齿轮', need: 15 }, { name: '导电线圈', need: 10 }], desc: '庚金电镀于藏剑刃口，出鞘斩击自带撕裂剑气。' },
  { id: 'z1_jinshen_blade6', zoneId: 'zone1', name: '八荒剑匣扩容', category: 'gengjin', catName: '庚金淬体系', icon: 'fa-solid fa-wand-magic-sparkles', themeColor: '#f59e0b', x: 550, y: 830, prereq: 'z1_jinshen_blade', buffText: '额外出鞘飞剑，杀伤 +30%', effects: { swordCount: 2, swordDmg: 30 }, computeCost: 16, cost: [{ name: '灵磁齿轮', need: 20 }, { name: '玄铁板', need: 60 }], desc: '双层导灵滑轨重构，六剑齐发破空巡航。' },
  { id: 'z1_jinshen_master', zoneId: 'zone1', name: '不灭庚金道躯', category: 'gengjin', catName: '庚金淬体系', icon: 'fa-solid fa-sun', themeColor: '#fbbf24', x: 770, y: 830, prereq: 'z1_jinshen_blade6', buffText: '飞剑杀伤 +80%，护体罡气 +300', effects: { swordDmg: 80, armor: 300 }, computeCost: 22, cost: [{ name: '玄铁梁', need: 35 }, { name: '电子生物芯片', need: 4 }], desc: '庚金大成，金身极境。天地万化，唯我独尊。' },
  { id: 'z2_jinshen_drill', zoneId: 'zone2', name: '庚金灵磁超频', category: 'industry', catName: '工业狂暴系', icon: 'fa-solid fa-trowel-bricks', themeColor: '#eab308', x: 1720, y: 1040, buffText: '全厂采矿速度 +60%', effects: { mineSpeed: 60 }, computeCost: 14, cost: [{ name: '电子生物芯片', need: 3 }, { name: '导电线圈', need: 12 }], desc: '灵磁抗扰回路，允许全厂采矿机极限高频运转。' },
  { id: 'z2_jinshen_smelt', zoneId: 'zone2', name: '离火生化催化', category: 'industry', catName: '工业狂暴系', icon: 'fa-solid fa-fire', themeColor: '#ef4444', x: 2020, y: 1040, prereq: 'z2_jinshen_drill', buffText: '全厂精炼炉冶炼速率 +55%', effects: { smeltSpeed: 55 }, computeCost: 14, cost: [{ name: '鲜活组织', need: 8 }, { name: '赤铜锭', need: 30 }], desc: '以活性生物质助燃三昧神火，极限拉升熔炼效率。' },
  { id: 'z2_jinshen_tissue', zoneId: 'zone2', name: '鲜活经脉重构', category: 'yaoshou', catName: '妖兽生化系', icon: 'fa-solid fa-dna', themeColor: '#10b981', x: 2320, y: 1040, buffText: '全厂传送带带速 +60%', effects: { beltSpeed: 60 }, computeCost: 14, cost: [{ name: '鲜活组织', need: 10 }, { name: '电子生物芯片', need: 3 }], desc: '将修士活性神经束铺入导轨，物流如经络般自如流淌。' },
  { id: 'z2_jinshen_heal', zoneId: 'zone2', name: '荒兽自愈神髓', category: 'yaoshou', catName: '妖兽生化系', icon: 'fa-solid fa-heart-pulse', themeColor: '#059669', x: 2620, y: 1040, prereq: 'z2_jinshen_tissue', buffText: '护体罡气 +200，自愈恢复', effects: { armor: 200 }, computeCost: 12, cost: [{ name: '鲜活组织', need: 12 }, { name: '基础控制模块', need: 6 }], desc: '融合异星荒兽强横生机，肉身重创瞬间愈合。' },
  { id: 'z3_jinshen_speed', zoneId: 'zone3', name: '庚金外骨骼', category: 'agility', catName: '神行须弥系', icon: 'fa-solid fa-person-running', themeColor: '#06b6d4', x: 3150, y: 830, buffText: '角色移动速度 +35%', effects: { speed: 35 }, computeCost: 12, cost: [{ name: '导灵铜片', need: 20 }, { name: '玄铁齿轮', need: 30 }], desc: '庚金伺服支架加固双腿，奔袭如疾风迅雷。' },
  { id: 'z3_jinshen_bag', zoneId: 'zone3', name: '须弥开窍·初阶', category: 'agility', catName: '神行须弥系', icon: 'fa-solid fa-box-archive', themeColor: '#38bdf8', x: 3380, y: 830, prereq: 'z3_jinshen_speed', buffText: '背包容量永久 +12 格', effects: { bagSlots: 12 }, computeCost: 12, cost: [{ name: '玄铁梁', need: 20 }, { name: '基础控制模块', need: 6 }], desc: '于金身窍穴内开辟微型须弥空间，背包大幅扩容。' },
  { id: 'z3_jinshen_glide', zoneId: 'zone3', name: '御风踏虚风翼', category: 'agility', catName: '神行须弥系', icon: 'fa-solid fa-wind', themeColor: '#0284c7', x: 3610, y: 830, prereq: 'z3_jinshen_bag', buffText: '滑翔姿态 + 移速 +20%', effects: { speed: 20 }, computeCost: 12, cost: [{ name: '导灵铜片', need: 25 }, { name: '灵磁齿轮', need: 20 }], desc: '展开背部风翼折叠装置，横跨深渊天堑如履平川。' }
];

// ---------------- 5. 背包物料桥接 ----------------
function matchBagItemName(bagItem, targetName) {
  if (!bagItem || !bagItem.name) return false;
  const b = bagItem.name;
  if (b === targetName) return true;
  if (targetName === '鲜活组织' && (b.includes('鲜活') || b.includes('组织'))) return true;
  return b.includes(targetName) || targetName.includes(b);
}
function getPlayerInventoryCount(itemName) {
  if (typeof activePlayerBagItems === 'undefined' || !Array.isArray(activePlayerBagItems)) return 999;
  let t = 0;
  for (const it of activePlayerBagItems) if (matchBagItemName(it, itemName)) t += (it.count || 0);
  return t;
}
function consumePlayerInventory(itemName, needCount) {
  if (typeof activePlayerBagItems === 'undefined' || !Array.isArray(activePlayerBagItems)) return true;
  let remain = needCount;
  for (let i = 0; i < activePlayerBagItems.length && remain > 0; i++) {
    const it = activePlayerBagItems[i];
    if (matchBagItemName(it, itemName)) {
      if (it.count >= remain) { it.count -= remain; if (it.count <= 0) activePlayerBagItems[i] = null; remain = 0; }
      else { remain -= it.count; activePlayerBagItems[i] = null; }
    }
  }
  if (typeof renderPlayerEquipmentModal === 'function') renderPlayerEquipmentModal();
  return remain === 0;
}

// =========================================================================
// 6. 节点与连线预设 (生产母板 54 个原始节点 + 战斗/辅助/研发芯片 + 金身节点)
// =========================================================================
function _pin(id, label, color, gold) { return { id, label, color, isGold: !!gold }; }
function _mkNode(o) { return Object.assign({ inPins: [], outPins: [] }, o); }

function buildPresetNodes() {
  const N = [];

  // ---------- 战斗母板 (zone1) ----------
  N.push(_mkNode({ id: 'z1_input_a', zoneId: 'zone1', type: 'input', name: '送金管 (玄铁)', element: 'metal', category: '送流管', x: 120, y: 520, width: 140, themeColor: '#ef4444', icon: 'fa-solid fa-faucet-drip', material: '玄铁齿轮', signalOut: 60, outPins: [_pin('out_a', '出', '#ef4444')] }));
  N.push(_mkNode({ id: 'z1_chip_armor', zoneId: 'zone1', type: 'chip', chipKey: 'chip_armor', level: 1, name: '护甲硬化芯片', category: '硬化罡气', x: 330, y: 400, width: 140, themeColor: '#ef4444', icon: 'fa-solid fa-shield-halved', inPins: [_pin('in', '进', '#ef4444')], outPins: [_pin('out', '出', '#ef4444')] }));
  N.push(_mkNode({ id: 'z1_chip_blade', zoneId: 'zone1', type: 'chip', chipKey: 'chip_blade', level: 1, name: '飞剑开刃芯片', category: '飞剑磨芒', x: 330, y: 620, width: 140, themeColor: '#f97316', icon: 'fa-solid fa-burst', inPins: [_pin('in', '进', '#f97316')], outPins: [_pin('out', '出', '#f97316')] }));
  N.push(_mkNode({ id: 'z1_core', zoneId: 'zone1', type: 'core', name: '战斗总核心', category: '总核心', x: 740, y: 470, width: 190, themeColor: '#ef4444', icon: 'fa-solid fa-khanda',
    inPins: [_pin('in_1', '① 护甲插座', '#ef4444', 1), _pin('in_2', '② 飞剑插座', '#f97316', 1), _pin('in_3', '③ 金身插座', '#fbbf24', 1), _pin('in_4', '④ 跨区飞线插座', '#00f0ff', 1)] }));

  // ---------- 生产母板 (zone2) · 丰富而富有逻辑的特色工控网络 ----------
  const Y4 = [340, 520, 700, 880];
  
  // 1. 供流源头：阳火管 与 玄冰水管
  N.push(_mkNode({ id: 'z2_input_a', zoneId: 'zone2', type: 'input', name: '送火管 (阳火)', element: 'fire', category: '送流管', x: 1100, y: 380, width: 140, themeColor: '#f59e0b', icon: 'fa-solid fa-faucet-drip', material: '耐火炉芯', signalOut: 500, outPins: [_pin('out_a', '出', '#f59e0b')] }));
  N.push(_mkNode({ id: 'z2_input_b', zoneId: 'zone2', type: 'input', name: '送水管 (冰泉)', element: 'water', category: '送流管', x: 1100, y: 780, width: 140, themeColor: '#00f0ff', icon: 'fa-solid fa-faucet-drip', material: '精炼玄铁锭', signalOut: 500, outPins: [_pin('out_a', '出', '#00f0ff')] }));

  // 2. 第一道工序：【分流调节阀】(带可点击调节比例 80:20 / 50:50 / 20:80)
  N.push(_mkNode({ id: 'z2_split_valve_1', zoneId: 'zone2', type: 'splitter_valve', ratio: '80:20', name: '分流调节阀 1号(火)', category: '流量偏向', x: 1280, y: 360, width: 140, themeColor: '#f59e0b', icon: 'fa-solid fa-sliders', inPins: [_pin('in', '进', '#f59e0b')], outPins: [_pin('out_a', '主路80%', '#f59e0b'), _pin('out_b', '副路20%', '#f59e0b')] }));
  N.push(_mkNode({ id: 'z2_split_valve_2', zoneId: 'zone2', type: 'splitter_valve', ratio: '50:50', name: '分流调节阀 2号(水)', category: '流量偏向', x: 1280, y: 760, width: 140, themeColor: '#00f0ff', icon: 'fa-solid fa-sliders', inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out_a', '主路50%', '#00f0ff'), _pin('out_b', '副路50%', '#00f0ff')] }));

  // 3. 第二道工序：【模式切档闸刀】(厂规基建模式 vs 战神出征模式 / 高压应急)
  N.push(_mkNode({ id: 'z2_mode_switch_1', zoneId: 'zone2', type: 'mode_switch', mode: 'base', name: '工控切档闸刀(厂规/战狂)', category: '逻辑闸刀', x: 1460, y: 460, width: 145, themeColor: '#eab308', icon: 'fa-solid fa-toggle-on', inPins: [_pin('in', '进', '#f59e0b')], outPins: [_pin('out_a', '基建厂规', '#eab308'), _pin('out_b', '战神出征', '#ef4444')] }));
  N.push(_mkNode({ id: 'z2_mode_switch_2', zoneId: 'zone2', type: 'mode_switch', mode: 'base', name: '应急切档闸刀(稳态/超频)', category: '逻辑闸刀', x: 1460, y: 660, width: 145, themeColor: '#06b6d4', icon: 'fa-solid fa-toggle-on', inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out_a', '稳态巡航', '#06b6d4'), _pin('out_b', '狂暴过载', '#ec4899')] }));

  // 4. 第三道工序：【加压推进泵】、【蓄能电容箱】与【冷热对冲水箱】
  N.push(_mkNode({ id: 'z2_pump_1', zoneId: 'zone2', type: 'booster_pump', name: '加压推进泵 1号', category: '音速加压', x: 1640, y: 300, width: 125, themeColor: '#10b981', icon: 'fa-solid fa-gauge-high', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z2_acc_1', zoneId: 'zone2', type: 'accumulator', chargePct: 98, name: '蓄能电容箱(采冶储能)', category: '聚能爆发', x: 1640, y: 460, width: 135, themeColor: '#00f0ff', icon: 'fa-solid fa-car-battery', inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out', '脉冲出', '#00f0ff')] }));
  N.push(_mkNode({ id: 'z2_cooler_1', zoneId: 'zone2', type: 'cooler_tank', name: '冷热对冲水箱', category: '水火稳态', x: 1640, y: 640, width: 135, themeColor: '#14b8a6', icon: 'fa-solid fa-temperature-arrow-down', inPins: [_pin('in_hot', '热流进', '#f59e0b'), _pin('in_cold', '冷水进', '#00f0ff')], outPins: [_pin('out', '出', '#14b8a6')] }));
  N.push(_mkNode({ id: 'z2_acc_2', zoneId: 'zone2', type: 'accumulator', chargePct: 95, name: '蓄能电容箱(物流储能)', category: '聚能爆发', x: 1640, y: 820, width: 135, themeColor: '#00f0ff', icon: 'fa-solid fa-car-battery', inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out', '脉冲出', '#00f0ff')] }));
  N.push(_mkNode({ id: 'z2_pump_2', zoneId: 'zone2', type: 'booster_pump', name: '加压推进泵 2号', category: '音速加压', x: 1640, y: 980, width: 125, themeColor: '#10b981', icon: 'fa-solid fa-gauge-high', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));

  // 5. 第四道工序：【水火对撞机】与【混料箱】
  N.push(_mkNode({ id: 'z2_mix_tank_1', zoneId: 'zone2', type: 'merger', name: '采矿化合混料箱', category: '配方化合', x: 1810, y: 320, width: 125, themeColor: '#f59e0b', icon: 'fa-solid fa-flask-vial', inPins: [_pin('in_1', '进1', '#f59e0b'), _pin('in_2', '进2', '#10b981')], outPins: [_pin('out', '出', '#f59e0b')] }));
  N.push(_mkNode({ id: 'z2_amp_1', zoneId: 'zone2', type: 'amplifier', name: '水火对撞机 甲型', category: '相克暴击', x: 1810, y: 480, width: 130, themeColor: '#c084fc', icon: 'fa-solid fa-atom', inPins: [_pin('in_1', '水', '#00f0ff'), _pin('in_2', '火', '#f59e0b')], outPins: [_pin('out', '出', '#c084fc')] }));
  N.push(_mkNode({ id: 'z2_amp_2', zoneId: 'zone2', type: 'amplifier', name: '水火对撞机 乙型', category: '相克暴击', x: 1810, y: 660, width: 130, themeColor: '#c084fc', icon: 'fa-solid fa-atom', inPins: [_pin('in_1', '水', '#00f0ff'), _pin('in_2', '火', '#f59e0b')], outPins: [_pin('out', '出', '#c084fc')] }));
  N.push(_mkNode({ id: 'z2_mix_tank_2', zoneId: 'zone2', type: 'merger', name: '带速增压混料箱', category: '配方化合', x: 1810, y: 860, width: 125, themeColor: '#10b981', icon: 'fa-solid fa-flask-vial', inPins: [_pin('in_1', '进1', '#10b981'), _pin('in_2', '进2', '#00f0ff')], outPins: [_pin('out', '出', '#10b981')] }));

  // 6. 第五道工序：【回旋加速管】与【二级精准分流】
  N.push(_mkNode({ id: 'z2_lp_1', zoneId: 'zone2', type: 'stabilizer', isLoop: true, name: '回旋加速管 1号', category: '循环提速', x: 1980, y: 320, width: 120, themeColor: '#10b981', icon: 'fa-solid fa-rotate', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z2_lp_2', zoneId: 'zone2', type: 'stabilizer', isLoop: true, name: '回旋加速管 2号', category: '循环提速', x: 1980, y: 500, width: 120, themeColor: '#10b981', icon: 'fa-solid fa-rotate', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z2_split_valve_3', zoneId: 'zone2', type: 'splitter_valve', ratio: '50:50', name: '二级精准分流阀', category: '流量均分', x: 1980, y: 680, width: 130, themeColor: '#38bdf8', icon: 'fa-solid fa-sliders', inPins: [_pin('in', '进', '#38bdf8')], outPins: [_pin('out_a', '出A', '#38bdf8'), _pin('out_b', '出B', '#38bdf8')] }));
  N.push(_mkNode({ id: 'z2_lp_3', zoneId: 'zone2', type: 'stabilizer', isLoop: true, name: '回旋加速管 3号', category: '循环提速', x: 1980, y: 860, width: 120, themeColor: '#10b981', icon: 'fa-solid fa-rotate', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));

  // 7. 第六道工序：四大总汇流管 与 终极大对撞机
  const mgNames = ['采矿提速总混管', '冶炼增产总混管', '耐烧持久总混管', '飞速传送带总混管'];
  const fNames = ['采矿终极大对撞', '冶炼终极大对撞', '耐烧终极大对撞', '带速终极大对撞'];
  const tCol = ['#f59e0b', '#ea580c', '#f97316', '#10b981'];
  Y4.forEach((y, i) => N.push(_mkNode({ id: `z2_main_mg${i + 1}`, zoneId: 'zone2', type: 'merger', name: mgNames[i], category: '总汇流', x: 2150, y, width: 125, themeColor: tCol[i], icon: 'fa-solid fa-flask-vial', inPins: [_pin('in_1', '进1', tCol[i]), _pin('in_2', '进2', tCol[i])], outPins: [_pin('out', '出', tCol[i])] })));
  Y4.forEach((y, i) => N.push(_mkNode({ id: `z2_final_amp${i + 1}`, zoneId: 'zone2', type: 'amplifier', name: fNames[i], category: '大翻倍', x: 2320, y, width: 130, themeColor: tCol[i], icon: 'fa-solid fa-atom', inPins: [_pin('in_1', '进1', tCol[i]), _pin('in_2', '进2', tCol[i])], outPins: [_pin('out', '出', tCol[i])] })));

  // 8. 第七道工序：四大产线提速喷口
  const tgt = [['mine', '★ 采矿提速口', 'fa-solid fa-trowel-bricks', 100], ['smelt', '★ 冶炼提速口', 'fa-solid fa-fire', 120], ['burn', '★ 燃料耐烧口', 'fa-solid fa-fire-flame-curved', 150], ['belt', '★ 传送带速口', 'fa-solid fa-bolt', 90]];
  tgt.forEach((t, i) => N.push(_mkNode({ id: `z2_target_${t[0]}`, zoneId: 'zone2', type: 'buff_' + t[0], buffKey: t[0], name: t[1], category: '提速喷口', x: 2510, y: Y4[i], width: 130, themeColor: tCol[i], icon: t[2], flowCost: 20, bonus: t[3], computeCost: 8, inPins: [_pin('in', '进', tCol[i])], outPins: [_pin('out', '入核心', '#ffd700', 1)] })));

  // 9. 生产总核心
  N.push(_mkNode({ id: 'z2_core', zoneId: 'zone2', type: 'core', name: '生产总核心', category: '总核心', x: 2720, y: 560, width: 200, themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
    inPins: [_pin('in_1', '① 采矿插座', '#f59e0b', 1), _pin('in_2', '② 冶炼插座', '#ea580c', 1), _pin('in_3', '③ 耐烧插座', '#fbbf24', 1), _pin('in_4', '④ 带速插座', '#10b981', 1), _pin('in_5', '⑤ 金身插座', '#fde047', 1), _pin('in_6', '⑥ 跨区飞线插座', '#00f0ff', 1)] }));

  // ---------- 辅助母板 (zone3) ----------
  N.push(_mkNode({ id: 'z3_input_a', zoneId: 'zone3', type: 'input', name: '送水管 (玄冰冷源)', element: 'water', category: '冷水进料', x: 3150, y: 520, width: 140, themeColor: '#38bdf8', icon: 'fa-solid fa-faucet-drip', material: '导电线圈', signalOut: 100, outPins: [_pin('out_a', '出', '#38bdf8')] }));
  N.push(_mkNode({ id: 'z3_chip_bag', zoneId: 'zone3', type: 'chip', chipKey: 'chip_bag', level: 1, name: '背包扩容芯片', category: '掏大背包', x: 3360, y: 400, width: 140, themeColor: '#38bdf8', icon: 'fa-solid fa-box-archive', inPins: [_pin('in', '进', '#38bdf8')], outPins: [_pin('out', '出', '#38bdf8')] }));
  N.push(_mkNode({ id: 'z3_chip_speed', zoneId: 'zone3', type: 'chip', chipKey: 'chip_speed', level: 1, name: '狂奔移速芯片', category: '脚底生风', x: 3360, y: 620, width: 140, themeColor: '#06b6d4', icon: 'fa-solid fa-person-running', inPins: [_pin('in', '进', '#06b6d4')], outPins: [_pin('out', '出', '#06b6d4')] }));
  N.push(_mkNode({ id: 'z3_core', zoneId: 'zone3', type: 'core', name: '辅助总核心', category: '总核心', x: 3790, y: 470, width: 190, themeColor: '#38bdf8', icon: 'fa-solid fa-bolt',
    inPins: [_pin('in_1', '① 背包插座', '#38bdf8', 1), _pin('in_2', '② 移速插座', '#06b6d4', 1), _pin('in_3', '③ 金身插座', '#fbbf24', 1), _pin('in_4', '④ 跨区飞线插座', '#00f0ff', 1)] }));

  // ---------- 研发母板 (zone4) ----------
  N.push(_mkNode({ id: 'z4_input_a', zoneId: 'zone4', type: 'input', name: '送木管 (灵根流)', element: 'wood', category: '送流管', x: 1120, y: 1560, width: 140, themeColor: '#10b981', icon: 'fa-solid fa-faucet-drip', material: '基础控制模块', signalOut: 50, outPins: [_pin('out_a', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z4_chip_tech', zoneId: 'zone4', type: 'chip', chipKey: 'chip_tech', level: 1, name: '脑波加速芯片', category: '研发提速', x: 1420, y: 1440, width: 140, themeColor: '#10b981', icon: 'fa-solid fa-network-wired', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z4_chip_save', zoneId: 'zone4', type: 'chip', chipKey: 'chip_save', level: 1, name: '省电省能芯片', category: '工厂省电', x: 1420, y: 1680, width: 140, themeColor: '#059669', icon: 'fa-solid fa-leaf', inPins: [_pin('in', '进', '#059669')], outPins: [_pin('out', '出', '#059669')] }));
  N.push(_mkNode({ id: 'z4_core', zoneId: 'zone4', type: 'core', name: '研发总核心', category: '总核心', x: 2050, y: 1540, width: 190, themeColor: '#10b981', icon: 'fa-solid fa-flask',
    inPins: [_pin('in_1', '① 研发插座', '#10b981', 1), _pin('in_2', '② 节电插座', '#059669', 1), _pin('in_3', '③ 备用插座', '#fbbf24', 1), _pin('in_4', '④ 跨区飞线插座', '#00f0ff', 1)] }));

  // ---------- 金身突破节点 (实体回路节点：其他节点连入供能 ➔ 再拉出接入CPU核心) ----------
  CPU_JINSHEN_NODES_DATA.forEach(d => {
    const n = JSON.parse(JSON.stringify(d));
    n.type = 'jinshen'; n.isJinshen = true; n.width = 220;
    n.inPins = [_pin('in_flow', '算力供流', '#00f0ff')];
    n.outPins = [_pin('out', '接CPU', '#ffd700', 1)];
    N.push(_mkNode(n));
  });
  return N;
}

function buildPresetWires() {
  const W = [];
  const w = (a, ap, b, bp, color, gold) => W.push({ id: `w_${a}_${ap}_${b}_${bp}`, fromNode: a, fromPin: ap, toNode: b, toPin: bp, color, isGold: !!gold });
  
  // 生产母板逻辑管道连线
  // 1. 输入源 ➔ 分流调节阀
  w('z2_input_a', 'out_a', 'z2_split_valve_1', 'in', '#f59e0b');
  w('z2_input_b', 'out_a', 'z2_split_valve_2', 'in', '#00f0ff');

  // 2. 分流调节阀 ➔ 加压泵 & 模式切档闸刀
  w('z2_split_valve_1', 'out_a', 'z2_pump_1', 'in', '#f59e0b');
  w('z2_split_valve_1', 'out_b', 'z2_mode_switch_1', 'in', '#f59e0b');

  w('z2_split_valve_2', 'out_a', 'z2_cooler_1', 'in_cold', '#00f0ff');
  w('z2_split_valve_2', 'out_b', 'z2_acc_2', 'in', '#00f0ff');

  // 3. 加压泵 1号 ➔ 采矿混料箱 & 冷热对冲水箱
  w('z2_pump_1', 'out', 'z2_mix_tank_1', 'in_1', '#f59e0b');
  w('z2_pump_1', 'out', 'z2_cooler_1', 'in_hot', '#f59e0b');

  // 4. 模式切档闸刀 1号 ➔ 蓄能电容箱 1号 (基建模式输出)
  w('z2_mode_switch_1', 'out_a', 'z2_acc_1', 'in', '#eab308');

  // 5. 蓄能电容箱 1号 ➔ 对撞机甲型 & 采矿混料箱 & 金身灵磁超频
  w('z2_acc_1', 'out', 'z2_amp_1', 'in_2', '#f59e0b');
  w('z2_acc_1', 'out', 'z2_mix_tank_1', 'in_2', '#00f0ff');
  w('z2_acc_1', 'out', 'z2_jinshen_drill', 'in_flow', '#eab308');

  // 6. 冷热对冲水箱 ➔ 对撞机甲型 & 对撞机乙型
  w('z2_cooler_1', 'out', 'z2_amp_1', 'in_1', '#00f0ff');
  w('z2_cooler_1', 'out', 'z2_amp_2', 'in_1', '#00f0ff');

  // 7. 蓄能电容箱 2号 ➔ 加压泵 2号 & 金身经脉重构
  w('z2_acc_2', 'out', 'z2_pump_2', 'in', '#00f0ff');
  w('z2_acc_2', 'out', 'z2_jinshen_tissue', 'in_flow', '#10b981');

  // 8. 加压泵 2号 ➔ 带速混料箱
  w('z2_pump_2', 'out', 'z2_mix_tank_2', 'in_1', '#10b981');
  w('z2_split_valve_2', 'out_b', 'z2_mix_tank_2', 'in_2', '#00f0ff');

  // 9. 对撞机甲型 ➔ 回旋管 1号 & 金身离火催化
  w('z2_amp_1', 'out', 'z2_lp_1', 'in', '#c084fc');
  w('z2_amp_1', 'out', 'z2_jinshen_smelt', 'in_flow', '#ef4444');

  // 10. 采矿混料箱 ➔ 回旋管 2号
  w('z2_mix_tank_1', 'out', 'z2_lp_2', 'in', '#f59e0b');

  // 11. 对撞机乙型 ➔ 二级分流阀 & 应急闸刀
  w('z2_amp_2', 'out', 'z2_split_valve_3', 'in', '#c084fc');
  w('z2_split_valve_1', 'out_b', 'z2_mode_switch_2', 'in', '#f59e0b');
  w('z2_mode_switch_2', 'out_a', 'z2_amp_2', 'in_2', '#f59e0b');

  // 12. 带速混料箱 ➔ 回旋管 3号 & 金身自愈神髓
  w('z2_mix_tank_2', 'out', 'z2_lp_3', 'in', '#10b981');
  w('z2_mix_tank_2', 'out', 'z2_jinshen_heal', 'in_flow', '#059669');

  // 13. 回旋管与分流阀 ➔ 四大总汇流管
  // 采矿汇流: 回旋管1 + 采矿混料
  w('z2_lp_1', 'out', 'z2_main_mg1', 'in_1', '#f59e0b');
  w('z2_mix_tank_1', 'out', 'z2_main_mg1', 'in_2', '#f59e0b');

  // 冶炼汇流: 回旋管2 + 对撞机甲
  w('z2_lp_2', 'out', 'z2_main_mg2', 'in_1', '#ea580c');
  w('z2_amp_1', 'out', 'z2_main_mg2', 'in_2', '#ea580c');

  // 耐烧汇流: 二级分流阀A + 冷热对冲水箱
  w('z2_split_valve_3', 'out_a', 'z2_main_mg3', 'in_1', '#f97316');
  w('z2_cooler_1', 'out', 'z2_main_mg3', 'in_2', '#f97316');

  // 带速汇流: 回旋管3 + 二级分流阀B
  w('z2_lp_3', 'out', 'z2_main_mg4', 'in_1', '#10b981');
  w('z2_split_valve_3', 'out_b', 'z2_main_mg4', 'in_2', '#10b981');

  // 14. 四大总混管 ➔ 四大终极大对撞
  w('z2_main_mg1', 'out', 'z2_final_amp1', 'in_1', '#f59e0b');
  w('z2_lp_1', 'out', 'z2_final_amp1', 'in_2', '#f59e0b');

  w('z2_main_mg2', 'out', 'z2_final_amp2', 'in_1', '#ea580c');
  w('z2_lp_2', 'out', 'z2_final_amp2', 'in_2', '#ea580c');

  w('z2_main_mg3', 'out', 'z2_final_amp3', 'in_1', '#f97316');
  w('z2_split_valve_3', 'out_a', 'z2_final_amp3', 'in_2', '#f97316');

  w('z2_main_mg4', 'out', 'z2_final_amp4', 'in_1', '#10b981');
  w('z2_lp_3', 'out', 'z2_final_amp4', 'in_2', '#10b981');

  // 15. 终极对撞 ➔ 四大产线提速口 ➔ 生产总核心前4个插座
  const tc = ['#f59e0b', '#ea580c', '#f97316', '#10b981'];
  ['mine', 'smelt', 'burn', 'belt'].forEach((k, i) => {
    w(`z2_final_amp${i + 1}`, 'out', `z2_target_${k}`, 'in', tc[i]);
    w(`z2_target_${k}`, 'out', 'z2_core', `in_${i + 1}`, '#ffd700', 1);
  });

  // 16. 生产母板金身节点：庚金灵磁超频 (采矿狂暴) ➔ 核心⑤插座
  w('z2_jinshen_drill', 'out', 'z2_core', 'in_5', '#ffd700', 1);

  // ---------- 跨区高压大长线 (四大母板天地大动脉) ----------
  // 飞线 ①：生产总核心 ➔ 战斗总核心 ④ 插座 (全厂工业总产值注入飞剑，飞剑伤害翻倍)
  W.push({ id: 'w_jumper_z2_z1', fromNode: 'z2_core', fromPin: 'in_1', toNode: 'z1_core', toPin: 'in_4', isJumper: true, color: '#00f0ff' });

  // 飞线 ②：辅助区玄冰冷泉 ➔ 生产总核心 ⑥ 插座 (玄冰高压水冷强行镇压生产超频高温)
  W.push({ id: 'w_jumper_z3_z2', fromNode: 'z3_input_a', fromPin: 'out_a', toNode: 'z2_core', toPin: 'in_6', isJumper: true, color: '#00f0ff' });

  // 飞线 ③：战斗总核心 ➔ 研发总核心 ④ 插座 (以战养研，斩妖煞气催化研发芯片，科技研发减半)
  W.push({ id: 'w_jumper_z1_z4', fromNode: 'z1_core', fromPin: 'in_2', toNode: 'z4_core', toPin: 'in_4', isJumper: true, color: '#00f0ff' });

  // 飞线 ④：研发总核心 ➔ 辅助总核心 ④ 插座 (算力反哺辅助，虚空扩容背包)
  W.push({ id: 'w_jumper_z4_z3', fromNode: 'z4_core', fromPin: 'in_1', toNode: 'z3_core', toPin: 'in_4', isJumper: true, color: '#00f0ff' });

  // ---------- 1. 战斗母板 (zone1) 全线闭环 ----------
  w('z1_input_a', 'out_a', 'z1_chip_armor', 'in', '#ef4444');
  w('z1_input_a', 'out_a', 'z1_chip_blade', 'in', '#f97316');
  w('z1_chip_armor', 'out', 'z1_core', 'in_1', '#ffd700', 1);
  w('z1_chip_blade', 'out', 'z1_core', 'in_2', '#ffd700', 1);
  // 战斗母板金身全链条：送金管 ➔ 庚金淬皮 ➔ 天罡飞剑 ➔ 八荒剑匣 ➔ 不灭金身 ➔ 核心③插座
  w('z1_input_a', 'out_a', 'z1_jinshen_skin', 'in_flow', '#eab308');
  w('z1_chip_blade', 'out', 'z1_jinshen_blade', 'in_flow', '#f97316');
  w('z1_jinshen_blade', 'out', 'z1_jinshen_blade6', 'in_flow', '#f59e0b');
  w('z1_jinshen_blade6', 'out', 'z1_jinshen_master', 'in_flow', '#fbbf24');
  w('z1_jinshen_master', 'out', 'z1_core', 'in_3', '#ffd700', 1);

  // ---------- 3. 辅助母板 (zone3) 全线闭环 ----------
  w('z3_input_a', 'out_a', 'z3_chip_bag', 'in', '#38bdf8');
  w('z3_input_a', 'out_a', 'z3_chip_speed', 'in', '#06b6d4');
  w('z3_chip_bag', 'out', 'z3_core', 'in_1', '#ffd700', 1);
  w('z3_chip_speed', 'out', 'z3_core', 'in_2', '#ffd700', 1);
  // 辅助母板金身全链条：冷泉 ➔ 庚金外骨骼 ➔ 须弥开窍 ➔ 御风风翼 ➔ 核心③插座
  w('z3_chip_speed', 'out', 'z3_jinshen_speed', 'in_flow', '#06b6d4');
  w('z3_jinshen_speed', 'out', 'z3_jinshen_bag', 'in_flow', '#38bdf8');
  w('z3_jinshen_bag', 'out', 'z3_jinshen_glide', 'in_flow', '#0284c7');
  w('z3_jinshen_glide', 'out', 'z3_core', 'in_3', '#ffd700', 1);

  // ---------- 4. 研发母板 (zone4) 全线闭环 ----------
  w('z4_input_a', 'out_a', 'z4_chip_tech', 'in', '#10b981');
  w('z4_input_a', 'out_a', 'z4_chip_save', 'in', '#059669');
  w('z4_chip_tech', 'out', 'z4_core', 'in_1', '#ffd700', 1);
  w('z4_chip_save', 'out', 'z4_core', 'in_2', '#ffd700', 1);
  // 研发区闭环自循环回流：核心②节电 ➔ 回流插回芯片强化算力
  w('z4_core', 'in_2', 'z4_chip_tech', 'in', '#10b981');
  return W;
}

function initCentralProcessorBlueprint() {
  CPU_BLUEPRINT_STATE.nodes = buildPresetNodes();
  CPU_BLUEPRINT_STATE.wires = buildPresetWires();
  CPU_BLUEPRINT_STATE.selectedEntity = 'z2_core';
  applyFlowRateToInputs(CPU_BLUEPRINT_STATE.currentFlowRate);
  refreshCpuAll();
}

// =========================================================================
// 7. 信号仿真 + 全局增益结算
// =========================================================================
function getActiveDecree() { return CPU_DECREE_CONFIGS[CPU_BLUEPRINT_STATE.activeDecree] || CPU_DECREE_CONFIGS.decree_balance_wuxing; }
function isJinshenDisabled(n) {
  const d = getActiveDecree();
  return !!(n && n.isJinshen && d.disabledCategories && d.disabledCategories.includes(n.category));
}
function getChipLevelCfg(n) {
  const c = CHIP_UPGRADE_CONFIGS[n.chipKey];
  return c ? c.levels[Math.max(0, Math.min(c.levels.length - 1, (n.level || 1) - 1))] : null;
}
function getNodeComputeCost(n) {
  if (n.type === 'chip') { const l = getChipLevelCfg(n); return l ? l.compute : 10; }
  if (n.isJinshen) return n.computeCost || 12;
  if (n.computeCost) return n.computeCost;
  return 0;
}

function simulateCpu() {
  const S = CPU_BLUEPRINT_STATE;
  const byId = {};
  S.nodes.forEach(n => { byId[n.id] = n; });
  const inW = {}, fan = {};
  S.wires.forEach(w => {
    const k = w.toNode + '|' + w.toPin;
    (inW[k] = inW[k] || []).push(w);
    const f = w.fromNode + '|' + w.fromPin;
    fan[f] = (fan[f] || 0) + 1;
  });
  const memo = {}, busy = {};
  // ---------------- 灵流元素物理与化学反应 ----------------
  // 元素色彩定义
  const ELEM_COLORS = {
    metal: '#fbbf24', // 金：流金色
    fire: '#f59e0b',  // 火：赤火红/炎橙
    water: '#00f0ff', // 水：玄冰青蓝
    wood: '#10b981',  // 木：翠绿
    mixed: '#c084fc', // 混色/合金
    overclock: '#ff0055' // 狂暴过载电光色
  };

  function getWireElement(fromNode, fromPin) {
    if (!fromNode) return 'metal';
    if (fromNode.element) return fromNode.element;
    if (fromNode.type === 'amplifier') return 'overclock';
    if (fromNode.type === 'merger') return 'mixed';
    if (fromNode.themeColor === '#00f0ff' || fromNode.themeColor === '#38bdf8') return 'water';
    if (fromNode.themeColor === '#ef4444' || fromNode.themeColor === '#f59e0b' || fromNode.themeColor === '#ea580c') return 'fire';
    if (fromNode.themeColor === '#10b981') return 'wood';
    return 'metal';
  }

  function pinIn(id, pin) {
    let t = 0;
    (inW[id + '|' + pin] || []).forEach(w => {
      const f = byId[w.fromNode];
      if (f) t += outOf(f, w.fromPin) / (fan[w.fromNode + '|' + w.fromPin] || 1);
    });
    return t;
  }

  function outOf(n, pin) {
    const key = n.id + '|' + pin;
    if (memo[key] !== undefined) return memo[key];
    if (busy[key]) return 0;
    busy[key] = true;
    let v = 0;
    switch (n.type) {
      case 'input': v = n.signalOut || 0; break;
      case 'splitter_valve': {
        const tot = pinIn(n.id, 'in');
        const r = n.ratio || '50:50';
        if (pin === 'out_a') {
          v = r === '80:20' ? tot * 0.8 : (r === '20:80' ? tot * 0.2 : tot * 0.5);
        } else {
          v = r === '80:20' ? tot * 0.2 : (r === '20:80' ? tot * 0.8 : tot * 0.5);
        }
        break;
      }
      case 'mode_switch': {
        const tot = pinIn(n.id, 'in');
        const m = n.mode || 'base';
        if (pin === 'out_a') {
          v = m === 'base' ? tot : 0;
        } else {
          v = m === 'combat' ? tot : 0;
        }
        break;
      }
      case 'accumulator': {
        const inSig = pinIn(n.id, 'in');
        v = inSig > 0 ? inSig * 1.35 : 0; // 蓄能高压脉冲 ×1.35
        break;
      }
      case 'cooler_tank': {
        const h = pinIn(n.id, 'in_hot'), c = pinIn(n.id, 'in_cold');
        v = (h + c) * 1.05;
        break;
      }
      case 'booster_pump': {
        v = pinIn(n.id, 'in') * 1.25; // 加压推进提升 +25%
        break;
      }
      case 'branch': v = pinIn(n.id, 'in') / 2; break; // 分色器
      case 'valve': v = Math.min(pinIn(n.id, 'in'), n.maxFlow || 80); break; // 降温放气阀
      case 'stabilizer': v = pinIn(n.id, 'in') * (n.isLoop ? 1.25 : 1.15); break; // 强力加压泵
      case 'merger': {
        // 混色器：判断两路元素化学反应
        const a = pinIn(n.id, 'in_1'), b = pinIn(n.id, 'in_2');
        // 水火对冲相克 => 升温且爆发流速
        v = (a + b) * 1.1;
        break;
      }
      case 'amplifier': {
        // 水火对撞机：两路皆有直接爆发 2.5 倍对撞流速
        const a = pinIn(n.id, 'in_1'), b = pinIn(n.id, 'in_2');
        v = (a > 0 && b > 0) ? (a + b) * 1.25 : (a + b) * 0.4;
        break;
      }
      case 'jinshen': {
        // 金身突破节点：由其他节点连入供能！
        if (isJinshenDisabled(n)) return 0;
        const inSig = pinIn(n.id, 'in_flow');
        // 根据经过的算力/流速来提升比例：
        // inSig >= 10: 20%, >= 50: 40%, >= 150: 60%, >= 300: 80%, >= 500: 100%
        let tierPct = 0;
        if (inSig >= 500) tierPct = 1.0;
        else if (inSig >= 300) tierPct = 0.8;
        else if (inSig >= 150) tierPct = 0.6;
        else if (inSig >= 50) tierPct = 0.4;
        else if (inSig >= 10) tierPct = 0.2;
        else if (inSig > 0) tierPct = 0.1;
        n.tierPct = tierPct;
        n.flowRatioText = tierPct > 0 ? `+${Math.round(tierPct * 100)}%` : '未供流 (0%)';
        v = tierPct;
        break;
      }
      default: v = pinIn(n.id, 'in');
    }
    busy[key] = false;
    memo[key] = v;
    return v;
  }

  // 节点工况
  S.nodes.forEach(n => {
    let sIn = 0;
    (n.inPins || []).forEach(p => { sIn += pinIn(n.id, p.id); });
    n.sigIn = sIn;
    const op = (n.outPins && n.outPins[0]) ? n.outPins[0].id : null;
    n.sigOut = op ? outOf(n, op) : 0;
    if (n.type === 'jinshen') {
      const p = n.tierPct !== undefined ? n.tierPct : outOf(n, 'out');
      n.isWorking = !isJinshenDisabled(n) && (n.sigIn > 0 || p > 0);
    }
    else if (n.type === 'input') n.isWorking = (n.signalOut || 0) > 0;
    else if (n.type && n.type.startsWith('buff_')) n.isWorking = sIn >= (n.flowCost || 20);
    else if (n.type === 'core') n.isWorking = true;
    else if (n.type === 'amplifier') n.isWorking = n.sigOut > 0;
    else n.isWorking = sIn > 0;
  });

  // 给导线动态赋予元素颜色
  S.wires.forEach(w => {
    const f = byId[w.fromNode];
    const elem = getWireElement(f, w.fromPin);
    if (w.isGold) {
      w.color = '#ffd700';
    } else if (w.toNode.includes('_core') && w.toPin.includes('飞线')) {
      w.color = '#00f0ff'; // 跨区高压飞线霓虹青蓝
      w.isJumper = true;
    } else {
      w.color = ELEM_COLORS[elem] || (f && f.themeColor) || '#00f0ff';
    }
  });

  // 核心插座与全局增益
  const B = { mine: 0, smelt: 0, burn: 0, belt: 0, sword: 0, armorFlat: 0, armorPct: 0, bag: 0, speed: 0, tech: 0, power: 0 };
  const dec = getActiveDecree();
  const jm = dec.jinshenMult || 1;
  let load = 0;
  S.zones && Object.keys(S.zones).forEach(z => { S.zones[z].satisfied = false; S.zones[z].activeCount = 0; });
  S.nodes.filter(n => n.type === 'core').forEach(core => {
    core.activeSockets = {}; core.socketSource = {};
    (core.inPins || []).forEach(p => {
      const ws = inW[core.id + '|' + p.id] || [];
      if (!ws.length) return;
      const src = byId[ws[0].fromNode];
      if (!src) return;
      core.socketSource[p.id] = src;
      load += getNodeComputeCost(src);
      if (!src.isWorking) return;
      core.activeSockets[p.id] = true;
      const z = S.zones[core.zoneId];
      if (z) { z.satisfied = true; z.activeCount++; }
      if (src.type === 'chip') {
        const lv = getChipLevelCfg(src); const st = CHIP_STAT_MAP[src.chipKey];
        if (lv && st) B[st] += lv.bonusVal;
      } else if (src.type.startsWith('buff_')) {
        B[src.buffKey] += src.bonus || 0;
      } else if (src.isJinshen) {
        // 金身节点效果根据上游经过的算力流速档位 (20%, 40%, 60%, 80%, 100%)
        const tierPct = src.tierPct || 0.2;
        const e = src.effects || {};
        if (e.armor) B.armorFlat += Math.round(e.armor * tierPct * jm);
        if (e.dmgReduction) B.armorPct += Math.round(e.dmgReduction * tierPct * jm);
        if (e.swordDmg) B.sword += Math.round(e.swordDmg * tierPct * jm);
        if (e.mineSpeed) B.mine += Math.round(e.mineSpeed * tierPct * jm);
        if (e.smeltSpeed) B.smelt += Math.round(e.smeltSpeed * tierPct * jm);
        if (e.beltSpeed) B.belt += Math.round(e.beltSpeed * tierPct * jm);
        if (e.bagSlots) B.bag += Math.round(e.bagSlots * tierPct * jm);
        if (e.speed) B.speed += Math.round(e.speed * tierPct * jm);
      }
    });
  });

  // 狂暴超频计算：突破 100 FLOPS 上限
  const cap = S.baseComputeCap - (dec.capPenalty || 0);
  S.computeLoad = load;
  S.computeCap = cap;

  // 跨母板飞线联动加成：检查是否有接跨区飞线
  const jumperWires = S.wires.filter(w => w.toPin && w.toPin.includes('飞线'));
  jumperWires.forEach(w => {
    B.sword = Math.round(B.sword * 1.35); // 跨区飞线充能飞剑
    B.mine = Math.round(B.mine * 1.25);
    B.tech = Math.round(B.tech * 1.3);
  });

  // 温度与超频加成计算 (融合水箱冷却与泵体/导轨发热与能耗平衡)
  let coolBonus = dec.coolBonus || 0;
  let heatAdd = dec.heatAdd || 0;
  let powerDrain = dec.powerCost || 0;
  let wasteSpikes = 0;

  S.nodes.forEach(n => {
    if (n.isWorking) {
      if (n.type === 'cooler_tank') { coolBonus += 15; }
      else if (n.type === 'booster_pump') { heatAdd += 4.0; powerDrain += 8; }
      else if (n.type === 'stabilizer') { heatAdd += 5.2; powerDrain += 12; }
      else if (n.type === 'amplifier') { heatAdd += 15.0; wasteSpikes += 35; }
      else if (n.type === 'accumulator') { wasteSpikes += 25; }
    }
  });

  const coldJumper = S.wires.find(w => w.toNode === 'z2_core' && (w.fromNode === 'z3_input_a' || w.fromNode.includes('z3')));
  if (coldJumper) coolBonus += 25; // 玄冰大飞线极度镇压降温

  S.totalPowerDrain = powerDrain;
  S.totalWasteGen = wasteSpikes;

  if (load > cap) {
    const overPct = (load - cap) / cap; // 超频比例
    S.overclockMultiplier = 1.0 + overPct * 1.5; // 超频提速最多翻倍
    const rawTemp = 45 + overPct * 120 + heatAdd - coolBonus;
    S.temperature = Math.max(30, Math.min(100, Math.round(rawTemp))); // 处于水冷温控下
    // 乘算全厂生产增益
    ['mine', 'smelt', 'burn', 'belt', 'sword'].forEach(k => {
      B[k] = Math.round((B[k] || 0) * S.overclockMultiplier);
    });
  } else {
    S.overclockMultiplier = 1.0;
    const rawTemp = 35 + (load / cap) * 15 + heatAdd - coolBonus;
    S.temperature = Math.max(25, Math.min(100, Math.round(rawTemp)));
  }

  // 结算法令直接加成与惩罚代价
  Object.keys(dec.bonus || {}).forEach(k => { B[k] = (B[k] || 0) + dec.bonus[k]; });
  if (dec.flowPenaltyPct) {
    ['mine', 'smelt', 'burn', 'belt'].forEach(k => { B[k] = Math.round(B[k] * (100 - dec.flowPenaltyPct) / 100); });
  }
  if (dec.speedPenalty) { B.speed = Math.max(0, (B.speed || 0) - dec.speedPenalty); }
  if (dec.armorPenalty) { B.armorPct = (B.armorPct || 0) - dec.armorPenalty; }

  S.buffs = B;
  S.simFan = fan; S.simByPinSignal = { pinIn, outOf };
  window.CPU_GLOBAL_BUFFS = B;
}
function getCpuGlobalBuffs() { return CPU_BLUEPRINT_STATE.buffs; }

// =========================================================================
// 8. 渲染：世界树背景 / 母板底板 / 节点卡片 / 连线
// =========================================================================
function renderWorldTreeBackgroundSvg() {
  const svg = document.getElementById('cpuWorldTreeSvg');
  if (!svg) return;
  svg.innerHTML = `
    <defs>
      <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/><stop offset="35%" stop-color="#00f0ff" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.5"/>
      </linearGradient>
      <linearGradient id="chokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00f0ff"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#00f0ff"/>
      </linearGradient>
      <style>
        @keyframes cpuFlow { to { stroke-dashoffset: -28; } }
        .world-tree-pulse-line { stroke-dasharray: 10 18; animation: cpuFlow 1.4s linear infinite; }
        .cpu-wire-live { stroke-dasharray: 8 10; animation: cpuFlow 0.9s linear infinite; }
      </style>
    </defs>
    <!-- 2x2 母板互联中央灵脉骨干 -->
    <!-- 水平走线：左侧 (战斗/辅助) ⇄ 右侧 (生产/研发) -->
    <path d="M 2300 800 L 2450 800" stroke="#00f0ff" stroke-width="6" opacity="0.85"/>
    <path d="M 2300 800 L 2450 800" stroke="#ffffff" stroke-width="2" class="world-tree-pulse-line"/>
    <path d="M 2300 2250 L 2450 2250" stroke="#10b981" stroke-width="6" opacity="0.85"/>
    <path d="M 2300 2250 L 2450 2250" stroke="#ffffff" stroke-width="2" class="world-tree-pulse-line"/>
    <!-- 垂直走线：上方 (战斗/生产) ⇄ 下方 (辅助/研发) -->
    <path d="M 1200 1450 L 1200 1600" stroke="#38bdf8" stroke-width="6" opacity="0.85"/>
    <path d="M 1200 1450 L 1200 1600" stroke="#00f0ff" stroke-width="2" class="world-tree-pulse-line"/>
    <path d="M 3550 1450 L 3550 1600" stroke="#f59e0b" stroke-width="6" opacity="0.85"/>
    <path d="M 3550 1450 L 3550 1600" stroke="#ffffff" stroke-width="2" class="world-tree-pulse-line"/>
    <!-- 中央核心十字过孔互联枢纽 -->
    <path d="M 2375 700 L 2375 2350" stroke="url(#treeTrunkGrad)" stroke-width="8" opacity="0.7"/>
    <path d="M 1100 1525 L 3650 1525" stroke="url(#treeTrunkGrad)" stroke-width="8" opacity="0.7"/>
    <circle cx="2375" cy="1525" r="22" fill="#070b13" stroke="#00f0ff" stroke-width="4"/>
    <circle cx="2375" cy="1525" r="8" fill="#00f0ff" class="world-tree-pulse-line"/>
    <!-- 顶部苍穹探针 -->
    <path d="M 2375 150 L 2375 40" fill="none" stroke="#f59e0b" stroke-width="4" opacity="0.85"/>
    <circle cx="2375" cy="40" r="9" fill="#070b13" stroke="#f59e0b" stroke-width="3"/><circle cx="2375" cy="40" r="3.5" fill="#f59e0b"/>`;
}

function renderBlueprintZonesHtml() {
  const c = document.getElementById('cpuWiringZonesLayer');
  if (!c) return;
  const S = CPU_BLUEPRINT_STATE;
  let h = '';
  Object.keys(S.zones).forEach(k => {
    const z = S.zones[k], cur = k === S.activeZoneId;
    const badge = z.satisfied
      ? '<span class="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/60 px-2 py-0.5 rounded">★ 核心已满足</span>'
      : '<span class="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 px-2 py-0.5 rounded">工控调配中</span>';
    const bolt = 'absolute w-3.5 h-3.5 rounded-full border border-white/60 bg-[#070b13] pointer-events-none';
    h += `<div id="zoneCard_${k}" onclick="selectBlueprintZone('${k}');"
      style="left:${z.rect.x}px;top:${z.rect.y}px;width:${z.rect.width}px;height:${z.rect.height}px;position:absolute;border:2px solid ${z.themeColor}${cur ? '' : '55'};border-radius:14px;background:linear-gradient(160deg, rgba(8,14,24,0.92), rgba(5,9,16,0.85));box-shadow:${cur ? '0 0 40px ' + z.themeColor + '33' : 'none'};pointer-events:auto;">
      <div class="${bolt}" style="top:-7px;left:-7px"></div><div class="${bolt}" style="top:-7px;right:-7px"></div>
      <div class="${bolt}" style="bottom:-7px;left:-7px"></div><div class="${bolt}" style="bottom:-7px;right:-7px"></div>
      <div class="p-3 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center space-x-2"><i class="${z.icon} text-sm" style="color:${z.themeColor}"></i>
          <span class="text-sm font-black text-white font-mono tracking-wider">${z.name}</span>
          ${cur ? '<span class="text-[9px] font-mono bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded">★ 当前投放区</span>' : ''}</div>
        ${badge}
      </div>
      <div class="absolute bottom-2 left-4 text-[10px] font-mono text-white/40 pointer-events-none"><i class="fa-solid fa-bullseye text-cyan-400 mr-1"></i>核心要求: ${z.coreRequirement}</div>
    </div>`;
  });
  c.innerHTML = h;
}

function _pinDot(node, p, type, extraStyle) {
  const isIn = type === 'in';
  const act = isIn && node.type === 'core' && node.activeSockets && node.activeSockets[p.id];
  const isRecycle = (p.id && p.id.includes('recycle')) || (p.label && (p.label.includes('排污') || p.label.includes('中和') || p.label.includes('回流')));
  
  // 端口美术表现精准规范化：
  // 1. 排污/中和/毛刺：菱形尖角红光端子 (rotate-45)
  // 2. 核心重型插座：工业方孔金色插座 (rounded-[3px])
  // 3. 普通输入口：方块漏斗插孔（青蓝）
  // 4. 普通输出口：凸起圆孔发射端（金黄/炎橙）
  let shapeHtml = '';
  if (isRecycle) {
    shapeHtml = `<span class="inline-block w-2.5 h-2.5 rotate-45 bg-rose-600 border border-white shadow-[0_0_8px_#f43f5e] transition-transform hover:scale-150 cursor-pointer"></span>`;
  } else if (isIn) {
    if (node.type === 'core') {
      shapeHtml = `<span class="inline-block w-3 h-3 rounded-[3px] ${act ? 'bg-emerald-400 border border-white shadow-[0_0_10px_#10b981]' : 'bg-[#0f172a] border-2 border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'} transition-transform hover:scale-150 cursor-pointer"></span>`;
    } else {
      shapeHtml = `<span class="inline-block w-2.5 h-2.5 rounded-[2px] bg-cyan-400 border border-white shadow-[0_0_6px_#00f0ff] transition-transform hover:scale-150 cursor-pointer"></span>`;
    }
  } else {
    shapeHtml = `<span class="inline-block w-2.5 h-2.5 rounded-full ${p.isGold ? 'bg-amber-300 shadow-[0_0_8px_#ffd700]' : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'} border border-white transition-transform hover:scale-150 cursor-pointer"></span>`;
  }

  return `<div id="pin_${node.id}_${p.id}" class="bp-pin ${isIn ? 'bp-pin-in' : 'bp-pin-out'}" style="${extraStyle || ''}"
    onclick="handleBlueprintPinClick('${node.id}','${p.id}','${type}',event);" title="${p.label || (isIn ? '输入' : '输出')}">
    ${shapeHtml}
  </div>`;
}
function _fmtSig(v) { return v >= 100 ? Math.round(v) : (Math.round(v * 10) / 10); }

function nodeCardHtml(node) {
  const S = CPU_BLUEPRINT_STATE;
  const sel = S.selectedEntity === node.id;
  const w = node.width || (node.type === 'core' ? 350 : 120);
  const base = `id="node_${node.id}" onmousedown="startDragBlueprintNode('${node.id}', event);" style="position:absolute;left:${node.x}px;top:${node.y}px;width:${w}px;pointer-events:auto;${sel ? 'outline:2px solid #00f0ff;' : ''}"`;
  const ins = node.inPins || [], outs = node.outPins || [];

  // 引脚确定性精准几何排布（与导线端点坐标 100% 像素级吻合）
  const getPinTop = (idx, total) => {
    if (total === 1) return 38;
    if (total === 2) return 26 + idx * 24;
    return 18 + idx * 20;
  };
  const inEl = (node.type !== 'core' && ins.length) ? ins.map((p, i) => _pinDot(node, p, 'in', `position:absolute;left:-7px;top:${getPinTop(i, ins.length)}px;z-index:30;`)).join('') : '';
  const outEl = outs.length ? outs.map((p, i) => _pinDot(node, p, 'out', `position:absolute;right:-7px;top:${getPinTop(i, outs.length)}px;z-index:30;`)).join('') : '';

  if (node.type === 'core') {
    const curDec = getActiveDecree();
    const curDecId = CPU_BLUEPRINT_STATE.activeDecree;
    const isZ2 = node.id === 'z2_core';
    const isZ1 = node.id === 'z1_core';

    let optionsHtml = '';
    if (isZ2) {
      optionsHtml = `
        <div class="px-2 pt-1.5 pb-1 border-b border-white/10 bg-black/50" onmousedown="event.stopPropagation();">
          <div class="flex justify-between items-center text-[9px] font-mono mb-1">
            <span class="text-amber-300 font-bold flex items-center">
              <i class="fa-solid fa-sliders mr-1 text-cyan-400"></i>生产运转模式 (点击切换):
            </span>
            <span class="text-[7.5px] text-white/40">消耗各不相同</span>
          </div>
          <div class="grid grid-cols-4 gap-1 text-[8.5px] font-mono">
            <button onclick="switchCpuDecree('decree_prod_mine');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_prod_mine' ? 'bg-amber-500 text-black border-amber-300 font-black shadow-[0_0_8px_#f59e0b]' : 'bg-black/60 text-white/70 border-white/10 hover:border-amber-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-trowel-bricks mr-0.5 text-[8px]"></i>极速采掘</span>
              <span class="text-[7.5px] ${curDecId === 'decree_prod_mine' ? 'text-black font-black' : 'text-amber-400'}">+120% 采矿</span>
            </button>
            <button onclick="switchCpuDecree('decree_prod_smelt');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_prod_smelt' ? 'bg-amber-500 text-black border-amber-300 font-black shadow-[0_0_8px_#ea580c]' : 'bg-black/60 text-white/70 border-white/10 hover:border-orange-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-fire mr-0.5 text-[8px]"></i>三昧熔铸</span>
              <span class="text-[7.5px] ${curDecId === 'decree_prod_smelt' ? 'text-black font-black' : 'text-orange-400'}">+130% 冶炼</span>
            </button>
            <button onclick="switchCpuDecree('decree_prod_belt');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_prod_belt' ? 'bg-amber-500 text-black border-amber-300 font-black shadow-[0_0_8px_#10b981]' : 'bg-black/60 text-white/70 border-white/10 hover:border-emerald-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-bolt mr-0.5 text-[8px]"></i>灵磁飞梭</span>
              <span class="text-[7.5px] ${curDecId === 'decree_prod_belt' ? 'text-black font-black' : 'text-emerald-400'}">+150% 带速</span>
            </button>
            <button onclick="switchCpuDecree('decree_prod_clean');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_prod_clean' ? 'bg-amber-500 text-black border-amber-300 font-black shadow-[0_0_8px_#06b6d4]' : 'bg-black/60 text-white/70 border-white/10 hover:border-cyan-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-circle-notch mr-0.5 text-[8px]"></i>天工太极</span>
              <span class="text-[7.5px] ${curDecId === 'decree_prod_clean' ? 'text-black font-black' : 'text-cyan-400'}">-25°C 降温</span>
            </button>
          </div>
          <div class="mt-1 p-1 rounded bg-black/80 border border-white/10 flex items-center justify-between text-[8px] font-mono">
            <span class="text-white/70">运行模式: <strong class="text-amber-300">${curDec.name}</strong></span>
            <span class="text-rose-300 bg-rose-950/70 px-1 py-0.2 rounded border border-rose-500/40 font-bold">
              <i class="fa-solid fa-triangle-exclamation mr-0.5 text-rose-400"></i>${curDec.costDesc}
            </span>
          </div>
        </div>
      `;
    } else if (isZ1) {
      optionsHtml = `
        <div class="px-2 pt-1.5 pb-1 border-b border-white/10 bg-black/50" onmousedown="event.stopPropagation();">
          <div class="flex justify-between items-center text-[9px] font-mono mb-1">
            <span class="text-red-300 font-bold flex items-center">
              <i class="fa-solid fa-khanda mr-1 text-orange-400"></i>战斗大阵模式 (点击切换):
            </span>
            <span class="text-[7.5px] text-white/40">实战消耗不同</span>
          </div>
          <div class="grid grid-cols-4 gap-1 text-[8.5px] font-mono">
            <button onclick="switchCpuDecree('decree_combat_sword');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_combat_sword' ? 'bg-red-500 text-white border-red-300 font-black shadow-[0_0_8px_#ef4444]' : 'bg-black/60 text-white/70 border-white/10 hover:border-red-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-burst mr-0.5 text-[8px]"></i>九霄破军</span>
              <span class="text-[7.5px] ${curDecId === 'decree_combat_sword' ? 'text-white font-black' : 'text-orange-400'}">+120% 飞剑</span>
            </button>
            <button onclick="switchCpuDecree('decree_combat_armor');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_combat_armor' ? 'bg-red-500 text-white border-red-300 font-black shadow-[0_0_8px_#ef4444]' : 'bg-black/60 text-white/70 border-white/10 hover:border-red-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-shield-halved mr-0.5 text-[8px]"></i>不动金刚</span>
              <span class="text-[7.5px] ${curDecId === 'decree_combat_armor' ? 'text-white font-black' : 'text-red-400'}">+450 罡气</span>
            </button>
            <button onclick="switchCpuDecree('decree_combat_speed');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_combat_speed' ? 'bg-red-500 text-white border-red-300 font-black shadow-[0_0_8px_#38bdf8]' : 'bg-black/60 text-white/70 border-white/10 hover:border-cyan-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-person-running mr-0.5 text-[8px]"></i>神行凌虚</span>
              <span class="text-[7.5px] ${curDecId === 'decree_combat_speed' ? 'text-white font-black' : 'text-cyan-400'}">+80% 移速</span>
            </button>
            <button onclick="switchCpuDecree('decree_combat_wuxing');event.stopPropagation();" 
                    class="p-1 rounded flex flex-col items-center justify-center transition border cursor-pointer ${curDecId === 'decree_combat_wuxing' ? 'bg-red-500 text-white border-red-300 font-black shadow-[0_0_8px_#c084fc]' : 'bg-black/60 text-white/70 border-white/10 hover:border-purple-400 hover:text-white'}">
              <span class="font-bold flex items-center"><i class="fa-solid fa-sun mr-0.5 text-[8px]"></i>周天混元</span>
              <span class="text-[7.5px] ${curDecId === 'decree_combat_wuxing' ? 'text-white font-black' : 'text-purple-400'}">+60% 金身</span>
            </button>
          </div>
          <div class="mt-1 p-1 rounded bg-black/80 border border-white/10 flex items-center justify-between text-[8px] font-mono">
            <span class="text-white/70">运行阵法: <strong class="text-red-300">${curDec.name}</strong></span>
            <span class="text-rose-300 bg-rose-950/70 px-1 py-0.2 rounded border border-rose-500/40 font-bold">
              <i class="fa-solid fa-triangle-exclamation mr-0.5 text-rose-400"></i>${curDec.costDesc}
            </span>
          </div>
        </div>
      `;
    }

    const rows = ins.map((p, idx) => {
      const src = node.socketSource && node.socketSource[p.id];
      const act = node.activeSockets && node.activeSockets[p.id];
      return `<div class="relative flex justify-between items-center h-[20px] text-[9px] font-mono ${act ? 'text-emerald-300 font-bold' : (src ? 'text-amber-300' : 'text-white/40')}">
        ${_pinDot(node, p, 'in', 'position:absolute;left:-22px;top:50%;transform:translateY(-50%);')}
        <span>${p.label}</span><span class="truncate max-w-[120px]">${src ? (act ? '✓ ' : '△ ') + src.name : '○ 待接入'}</span></div>`;
    }).join('');
    const used = Object.keys(node.socketSource || {}).length;
    return `<div ${base} class="bp-node-card pcb-ic-package group cursor-move" >
      <div style="border:2px solid ${node.themeColor};background:#0c121e;border-radius:12px;box-shadow:0 0 28px ${node.themeColor}55;">
        <div class="h-7 px-3 flex items-center justify-between bg-black/50 rounded-t-xl pointer-events-none border-b border-white/10">
          <span class="text-[11px] font-black font-mono text-amber-300"><i class="${node.icon} mr-1"></i>${node.name}</span>
          <span class="text-[9px] font-mono text-cyan-300">${used}/${ins.length} 插座</span></div>
        ${optionsHtml}
        <div class="px-3 py-2 space-y-0.5" style="padding-left:14px">${rows}</div>
      </div></div>`;
  }

  const working = node.isWorking;
  const dim = (node.type === 'jinshen') ? '' : (working ? '' : 'opacity:.62;');
  const bc = working ? node.themeColor : 'rgba(255,255,255,0.18)';
  const glow = working ? `box-shadow:0 0 12px ${node.themeColor}55;` : '';
  let body = '';

  if (node.type === 'input') {
    const z = S.zones[node.zoneId];
    const isZ2 = node.zoneId === 'zone2';
    const btns = (!isZ2 && z) ? Object.keys(z.inputMaterials).map(m => `<button onmousedown="event.stopPropagation();" onclick="selectInputNodeMaterial('${node.id}','${m}');" class="px-1 py-0.5 text-[8px] rounded border cursor-pointer ${node.material === m ? 'bg-cyan-500/40 text-cyan-200 border-cyan-400' : 'bg-black/50 text-white/50 border-white/10'}">${m}</button>`).join('') : '';
    body = `<div class="text-[8.5px] font-mono text-white/70 pointer-events-none">${node.material}</div><div class="text-[9px] font-mono text-cyan-300 font-bold pointer-events-none">${_fmtSig(node.signalOut || 0)}/分 灵流注入</div>${btns ? `<div class="flex flex-wrap gap-0.5 mt-0.5">${btns}</div>` : ''}`;
  } else if (node.type === 'chip') {
    const lv = getChipLevelCfg(node);
    body = `<div class="text-[9px] font-mono text-amber-300 font-bold pointer-events-none">Lv.${node.level} · ${lv ? lv.bonusText : ''}</div><div class="text-[8px] font-mono text-white/50 pointer-events-none">算力 ${lv ? lv.compute : 0} FLOPS</div>`;
  } else if (node.type === 'jinshen') {
    const dis = isJinshenDisabled(node);
    const inSig = Math.round(node.sigIn || 0);
    const pct = node.tierPct ? Math.round(node.tierPct * 100) : 0;
    const st = dis ? '<span class="text-red-300">法令禁用</span>'
      : (inSig > 0 ? `<span class="text-emerald-300 font-bold">● 已供能 ${inSig}/分 ➔ 提成 +${pct}%</span>`
      : '<span class="text-amber-400 font-bold">○ 待连入算力供能 (0%)</span>');
    body = `<div class="text-[8.5px] text-amber-200 font-sans leading-tight pointer-events-none">${node.buffText}</div><div class="text-[8px] font-mono mt-0.5 pointer-events-none">${st} · 算力${node.computeCost}</div>`;
  } else if (node.type && node.type.startsWith('buff_')) {
    body = `<div class="text-[9px] font-mono pointer-events-none ${working ? 'text-emerald-300' : 'text-rose-300'} font-bold">${working ? '✓' : '✗'} 全厂+${node.bonus}% · 需${node.flowCost}</div><div class="text-[8px] font-mono text-white/50 pointer-events-none">流量 ${_fmtSig(node.sigIn || 0)} ➔ 核心</div>`;
  } else if (node.type === 'splitter_valve') {
    const curR = node.ratio || '50:50';
    body = `
      <div class="flex items-center justify-between text-[8px] font-mono bg-black/40 px-1 py-0.5 rounded border border-white/10" onmousedown="event.stopPropagation();">
        <span class="text-amber-300 font-bold">配比 ${curR}</span>
        <div class="flex space-x-0.5">
          <button onclick="toggleSplitterRatio('${node.id}','80:20');" class="px-1 py-0.2 rounded text-[7.5px] cursor-pointer ${curR==='80:20'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/60 hover:text-white'}">8:2</button>
          <button onclick="toggleSplitterRatio('${node.id}','50:50');" class="px-1 py-0.2 rounded text-[7.5px] cursor-pointer ${curR==='50:50'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/60 hover:text-white'}">5:5</button>
          <button onclick="toggleSplitterRatio('${node.id}','20:80');" class="px-1 py-0.2 rounded text-[7.5px] cursor-pointer ${curR==='20:80'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/60 hover:text-white'}">2:8</button>
        </div>
      </div>
      <div class="text-[8px] font-mono mt-0.5 pointer-events-none text-white/50">输入 ${_fmtSig(node.sigIn || 0)}/分 ➔ 分流双路</div>`;
  } else if (node.type === 'mode_switch') {
    const isCombat = node.mode === 'combat';
    body = `
      <div class="flex items-center justify-between bg-black/50 px-1.5 py-0.5 rounded border border-white/10" onmousedown="event.stopPropagation();">
        <span class="text-[8.5px] font-bold ${isCombat ? 'text-orange-400' : 'text-amber-300'}">
          <i class="fa-solid ${isCombat ? 'fa-khanda' : 'fa-gear'} mr-0.5"></i>${isCombat ? '战神出征' : '厂规基建'}
        </span>
        <button onclick="toggleModeSwitch('${node.id}');" class="px-1.5 py-0.2 rounded text-[7.5px] font-bold bg-amber-500 text-black hover:bg-amber-400 cursor-pointer shadow-sm">
          切档
        </button>
      </div>
      <div class="text-[7.5px] font-mono mt-0.5 text-white/50 pointer-events-none">${isCombat ? '全部流量注入战斗飞线' : '全部流量供给基建产线'}</div>`;
  } else if (node.type === 'accumulator') {
    // 蓄能电容：带自身充放电循环与毛刺排污数值
    const pct = working ? (node.chargePct || 98) : 0;
    body = `
      <div class="flex justify-between text-[7.5px] font-mono text-white/70 pointer-events-none">
        <span>⚡ 脉冲储能电容</span>
        <span class="text-cyan-300 font-bold">${working ? pct + '% 满电' : '未充能'}</span>
      </div>
      <div class="h-1.5 bg-black/70 rounded-full overflow-hidden border border-cyan-500/40 mt-0.5 pointer-events-none">
        <div class="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400" style="width:${pct}%"></div>
      </div>
      <div class="mt-1 p-1 bg-black/60 rounded border border-rose-500/30 pointer-events-none">
        <div class="flex justify-between text-[7.5px] font-mono">
          <span class="text-white/60">脉冲放电增幅</span>
          <span class="text-amber-300 font-bold">×1.35 爆发</span>
        </div>
        <div class="flex justify-between text-[7px] font-mono text-rose-300 mt-0.5">
          <span>▲ 毛刺生成: +25/分</span>
          <span>接排污中和</span>
        </div>
      </div>`;
  } else if (node.type === 'cooler_tank') {
    // 水冷对冲箱：带自身冷却液消耗与降温数值
    const drain = working ? 15 : 0;
    body = `
      <div class="text-[8.5px] font-mono text-cyan-300 font-bold pointer-events-none">❄ 极阴镇压: -15.0°C 稳态</div>
      <div class="text-[9px] font-mono text-emerald-300 font-bold pointer-events-none">${working ? _fmtSig(node.sigOut || 0) + '/分 · 平波输出' : '待接入冷热双流'}</div>
      <div class="mt-1 p-1 bg-black/60 rounded border border-cyan-400/30 pointer-events-none">
        <div class="flex justify-between text-[7.5px] font-mono">
          <span class="text-white/60">💧 冷水消耗</span>
          <span class="text-cyan-200 font-bold">${working ? '-' + drain + '/分 (玄冰冷量)' : '无损耗'}</span>
        </div>
        <div class="h-1 bg-black/80 rounded-full overflow-hidden mt-0.5">
          <div class="h-full bg-gradient-to-r from-blue-400 to-cyan-300" style="width:${working ? '85%' : '0%'}"></div>
        </div>
        <div class="flex justify-between text-[7px] font-mono text-white/50 mt-0.5">
          <span>吸收废热: 100%</span>
          <span class="text-emerald-300">母板防炸</span>
        </div>
      </div>`;
  } else if (node.type === 'booster_pump') {
    // 加压推进泵：带自身电力消耗与温升数值
    const power = working ? 8 : 0;
    const heat = working ? 4.0 : 0;
    body = `
      <div class="text-[8.5px] font-mono text-cyan-300 font-bold pointer-events-none">🚀 音速推进: +25% 流速</div>
      <div class="text-[9px] font-mono text-emerald-300 font-bold pointer-events-none">${working ? _fmtSig(node.sigOut || 0) + '/分 · 加压中' : '无流量'}</div>
      <div class="mt-1 p-1 bg-black/60 rounded border border-cyan-500/30 pointer-events-none">
        <div class="flex justify-between text-[7.5px] font-mono">
          <span class="text-white/60">⚡ 泵动电力</span>
          <span class="text-rose-300 font-bold">${working ? '-' + power + 'W (机械功)' : '0W 待机'}</span>
        </div>
        <div class="h-1 bg-black/80 rounded-full overflow-hidden mt-0.5">
          <div class="h-full bg-cyan-400" style="width:${working ? '65%' : '0%'}"></div>
        </div>
        <div class="flex justify-between text-[7px] font-mono text-white/50 mt-0.5">
          <span>产热: +${heat}°C</span>
          <span class="text-amber-300">气蚀: 18/分</span>
        </div>
      </div>`;
  } else if (node.type === 'stabilizer') {
    // 导轨加速节点/回旋增压环：带自身导轨供能消耗与发热数值
    const power = working ? 12 : 0;
    const heat = working ? 5.2 : 0;
    body = `
      <div class="text-[8.5px] font-mono text-emerald-300 font-bold pointer-events-none">${node.isLoop ? '🌀 回旋导轨提速 +25%' : '🚀 直线增压加速 +15%'}</div>
      <div class="text-[9px] font-mono text-amber-300 font-bold pointer-events-none">${working ? _fmtSig(node.sigOut || 0) + '/分 · 高速巡航' : '无流量'}</div>
      <div class="mt-1 p-1 bg-black/60 rounded border border-emerald-500/30 pointer-events-none">
        <div class="flex justify-between text-[7.5px] font-mono">
          <span class="text-white/60">⚡ 导轨供耗</span>
          <span class="text-amber-300 font-bold">${working ? '-' + power + 'W (灵能负载)' : '0W 待机'}</span>
        </div>
        <div class="h-1 bg-black/80 rounded-full overflow-hidden mt-0.5">
          <div class="h-full bg-gradient-to-r from-emerald-400 to-amber-400" style="width:${working ? '78%' : '0%'}"></div>
        </div>
        <div class="flex justify-between text-[7px] font-mono text-white/50 mt-0.5">
          <span>轨温: +${heat}°C</span>
          <span class="text-cyan-300">压降: -8%</span>
        </div>
      </div>`;
  } else if (node.type === 'amplifier') {
    // 水火对撞机：带自身反应物消耗与高温废气产出
    const isBig = node.name.includes('大');
    const burn = working ? 20 : 0;
    body = `
      <div class="text-[8.5px] font-mono text-purple-300 font-bold pointer-events-none">${isBig ? '⚡ 终极大对撞 ➔ 暴击翻倍' : '⚛ 水火聚变 ➔ 爆发 2.5 倍'}</div>
      <div class="text-[9px] font-mono text-amber-300 font-bold pointer-events-none">${working ? _fmtSig(node.sigOut || 0) + '/分 · 聚变轰鸣' : '缺少对撞相'}</div>
      <div class="mt-1 p-1 bg-black/60 rounded border border-purple-500/30 pointer-events-none">
        <div class="flex justify-between text-[7.5px] font-mono">
          <span class="text-white/60">🔥 反应物损耗</span>
          <span class="text-rose-300 font-bold">${working ? '水火各 -' + burn + '%' : '未启动'}</span>
        </div>
        <div class="h-1 bg-black/80 rounded-full overflow-hidden mt-0.5">
          <div class="h-full bg-gradient-to-r from-purple-500 to-rose-500" style="width:${working ? '92%' : '0%'}"></div>
        </div>
        <div class="flex justify-between text-[7px] font-mono text-white/50 mt-0.5">
          <span>废气产率: +35/分</span>
          <span class="text-amber-300">需排污中和</span>
        </div>
      </div>`;
  } else {
    const desc = {
      branch: '分流器 ➔ 1进2出 拆流',
      merger: '混料箱 ➔ 元素对冲化合',
      waste_converter: '排污转化 ➔ 中和毒气为纯水'
    }[node.type] || '';
    body = `<div class="text-[8.5px] font-mono text-cyan-200/80 pointer-events-none">${desc}</div><div class="text-[9px] font-mono font-bold pointer-events-none ${working ? 'text-amber-300' : 'text-white/30'}">${working ? _fmtSig(node.sigOut || 0) + '/分 · 运行中' : '无流量'}</div>`;
  }

  const jinBorder = node.type === 'jinshen' ? (node.activated ? `border-color:#ffd700;box-shadow:0 0 16px #ffd70066;` : 'border-style:dashed;') : '';
  return `<div ${base} class="bp-node-card pcb-ic-package cursor-move">
    <div style="background:#0b101a;border:1.5px solid ${bc};border-radius:7px;${glow}${dim}${jinBorder}">
      <div class="px-1.5 py-1 border-b border-white/10 flex items-center space-x-1 pointer-events-none" style="background:${node.themeColor}22">
        <i class="${node.icon} text-[9px]" style="color:${node.themeColor}"></i>
        <span class="text-[9px] font-bold text-white truncate">${node.name}</span></div>
      <div class="px-1.5 py-1 leading-tight">${body}</div>
    </div>${inEl}${outEl}</div>`;
}

function renderBlueprintNodesHtml() {
  const layer = document.getElementById('cpuWiringNodesLayer');
  if (!layer) return;
  layer.innerHTML = CPU_BLUEPRINT_STATE.nodes.map(nodeCardHtml).join('');
}

function getBlueprintPinCoords(nodeId, pinId) {
  const S = CPU_BLUEPRINT_STATE;
  const n = S.nodes.find(x => x.id === nodeId);
  if (!n) return null;

  // 1. 首选：从实际挂载在 DOM 中的引脚节点获取绝对精准的中心世界坐标（100% 像素吻合）
  const pinEl = document.getElementById(`pin_${nodeId}_${pinId}`);
  const worldCont = document.getElementById('cpuWorldContainer');
  if (pinEl && worldCont) {
    const pRect = pinEl.getBoundingClientRect();
    const wRect = worldCont.getBoundingClientRect();
    const zoom = S.zoom || 0.72;
    if (wRect.width > 0 && zoom > 0 && pRect.width > 0) {
      return {
        x: Math.round(((pRect.left + pRect.width / 2) - wRect.left) / zoom),
        y: Math.round(((pRect.top + pRect.height / 2) - wRect.top) / zoom)
      };
    }
  }

  // 2. 备选：几何快速求值
  const isIn = pinId.startsWith('in');
  const w = n.width || (n.type === 'core' ? 380 : 135);

  if (n.type === 'core') {
    if (!isIn) {
      return { x: n.x + w + 3, y: n.y + 45 };
    }
    const ins = n.inPins || [];
    const idx = ins.findIndex(p => p.id === pinId);
    const baseOffset = (n.id === 'z2_core' || n.id === 'z1_core') ? 166 : 40;
    return { x: n.x - 3, y: n.y + baseOffset + (idx >= 0 ? idx : 0) * 29 + 13 };
  } else {
    const pins = isIn ? (n.inPins || []) : (n.outPins || []);
    const idx = pins.findIndex(p => p.id === pinId);
    const total = pins.length || 1;
    const pinTop = (total === 1 ? 38 : (total === 2 ? 26 + (idx >= 0 ? idx : 0) * 24 : 18 + (idx >= 0 ? idx : 0) * 20));
    return {
      x: isIn ? n.x - 2 : n.x + w + 2,
      y: n.y + pinTop + 9
    };
  }
}

function _wirePath(a, b, seed) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const off = ((seed % 7) - 3) * 6;
  if (Math.abs(dy) < 3 && dx > 0) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  if (dx < 60) {
    const ym = (a.y + b.y) / 2 + off;
    return `M ${a.x} ${a.y} H ${a.x + 22} V ${ym} H ${b.x - 22} V ${b.y} H ${b.x}`;
  }
  const mx = a.x + dx / 2 + off, s = dy > 0 ? 1 : -1;
  const ch = Math.min(16, Math.abs(dy) / 2, dx / 4);
  return `M ${a.x} ${a.y} L ${mx - ch} ${a.y} L ${mx} ${a.y + s * ch} L ${mx} ${b.y - s * ch} L ${mx + ch} ${b.y} L ${b.x} ${b.y}`;
}
function _hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

function renderBlueprintWiresSvg() {
  const svg = document.getElementById('cpuWiringSvg');
  if (!svg) return;
  const S = CPU_BLUEPRINT_STATE;
  let h = `<defs>
    <style>
      @keyframes cpuFlowLive { to { stroke-dashoffset: -48; } }
      @keyframes cpuPulseFast { to { stroke-dashoffset: -64; } }
      @keyframes cpuHeartbeat { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.95; } }
      .cpu-wire-live2 { stroke-dasharray: 10 12; animation: cpuFlowLive 0.8s linear infinite; }
      .cpu-jumper-fast { stroke-dasharray: 16 10; animation: cpuPulseFast 0.5s linear infinite; }
      .cpu-pulse-beacon { animation: cpuHeartbeat 1.6s ease-in-out infinite; }
    </style>
    <!-- 发光滤镜 -->
    <filter id="neonWireGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
  const byId = {}; S.nodes.forEach(n => { byId[n.id] = n; });
  S.wires.forEach((w, idx) => {
    const a = getBlueprintPinCoords(w.fromNode, w.fromPin), b = getBlueprintPinCoords(w.toNode, w.toPin);
    if (!a || !b) return;
    const f = byId[w.fromNode];
    const sig = (S.simByPinSignal && f) ? S.simByPinSignal.outOf(f, w.fromPin) / ((S.simFan && S.simFan[w.fromNode + '|' + w.fromPin]) || 1) : 0;
    const live = sig > 0.1 || w.isJumper;
    const col = w.isGold ? '#ffd700' : (w.color || (f && f.themeColor) || '#00f0ff');
    const d = _wirePath(a, b, _hash(w.id));
    if (w.isJumper) {
      // 跨区大飞线特效：粗发光、青蓝霓虹、双重高速脉冲波
      h += `<path d="${d}" fill="none" stroke="#00f0ff" stroke-width="8" opacity="0.3" filter="url(#neonWireGlow)"/>`;
      h += `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="3.5" class="cpu-jumper-fast" opacity="0.95"/>`;
      h += `<path d="${d}" fill="none" stroke="#00f0ff" stroke-width="4" opacity="0.8"/>`;
    } else {
      // 基础回路与循环回流导线
      h += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w.isGold ? 4 : 3}" opacity="${live ? 0.9 : 0.28}" stroke-linejoin="round"/>`;
      if (live) {
        h += `<path d="${d}" fill="none" stroke="#ffffff" stroke-width="1.6" class="cpu-wire-live2" opacity="0.9"/>`;
      }
    }
    // 隐形鼠标判定碰撞线（支持点击剪断）
    h += `<path d="${d}" fill="none" stroke="transparent" stroke-width="16" style="pointer-events:stroke;cursor:pointer;" onclick="removeBlueprintWire(${idx});"><title>点击剪断此线</title></path>`;
    // 导线端点信号灯与脉冲光晕
    h += `<circle cx="${a.x}" cy="${a.y}" r="${live ? 4.5 : 3}" fill="${col}" class="${live ? 'cpu-pulse-beacon' : ''}"/>`;
    h += `<circle cx="${b.x}" cy="${b.y}" r="${live ? 4.5 : 3}" fill="${col}" class="${live ? 'cpu-pulse-beacon' : ''}"/>`;
  });
  if (S.connectingPin) {
    const cp = S.connectingPin;
    const a = getBlueprintPinCoords(cp.nodeId, cp.pinId);
    if (a) {
      const b = { x: cp.curX, y: cp.curY };
      const pa = cp.pinType === 'out' ? a : b, pb = cp.pinType === 'out' ? b : a;
      h += `<path d="${_wirePath(pa, pb, 3)}" fill="none" stroke="#00f0ff" stroke-width="3" stroke-dasharray="6 6" opacity="0.9"/>`;
    }
  }
  svg.innerHTML = h;
}

// =========================================================================
// 9. 刷新：仿真 → 渲染 → 侧栏
// =========================================================================
function refreshCpuAll() {
  simulateCpu();
  renderWorldTreeBackgroundSvg();
  renderBlueprintZonesHtml();
  renderBlueprintNodesHtml();
  renderBlueprintPhaseTabs();
  updateDecreeUi();
  updateCanvasTransform();
  requestAnimationFrame(() => { renderBlueprintWiresSvg(); updateBlueprintMonitorStats(); });
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === CPU_BLUEPRINT_STATE.selectedEntity);
  if (n) inspectBlueprintNode(n, true);
}
// 仅重算并刷新节点/连线/侧栏 (不重建底板)
function recomputeCpu() {
  simulateCpu();
  renderBlueprintNodesHtml();
  renderBlueprintZonesHtml();
  renderBlueprintPhaseTabs();
  updateDecreeUi();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === CPU_BLUEPRINT_STATE.selectedEntity);
  if (n) inspectBlueprintNode(n, true);
}

function _setText(id, t) { const e = document.getElementById(id); if (e) e.textContent = t; }
function updateBlueprintMonitorStats() {
  const S = CPU_BLUEPRINT_STATE, B = S.buffs || {};
  const pct = v => `+${Math.round(v || 0)}%`;
  _setText('statBuffMine', pct(B.mine)); _setText('statBuffSmelt', pct(B.smelt));
  _setText('statBuffBurn', pct(B.burn)); _setText('statBuffBelt', pct(B.belt));
  _setText('statBuffSword', pct(B.sword));
  _setText('statBuffArmor', `+${B.armorFlat || 0}${B.armorPct ? ' · ' + B.armorPct + '%' : ''}`);
  _setText('statBuffBag', `+${B.bag || 0} 格`); _setText('statBuffTech', pct(B.tech));
  // 算力与狂暴超频 (允许突破100%)
  const load = S.computeLoad, cap = S.computeCap, over = load > cap;
  const loadPct = Math.round(load / cap * 100);
  _setText('cpuComputeLoadText', `${load} / ${cap} FLOPS (${loadPct}%)`);
  const bar = document.getElementById('cpuComputeLoadBar');
  if (bar) {
    bar.style.width = Math.min(100, (load / (cap * 1.5)) * 100) + '%';
    bar.className = `h-full transition-all duration-300 bg-gradient-to-r ${over ? 'from-amber-500 via-orange-500 to-rose-600 animate-pulse' : 'from-cyan-400 to-emerald-400'}`;
  }
  const st = document.getElementById('cpuComputeLoadStatus');
  if (st) {
    st.textContent = over ? `⚡ 狂暴超频中 (产速 ×${S.overclockMultiplier.toFixed(2)})` : (load > cap * 0.8 ? '● 高负荷运转' : '● 稳定巡航 (算力充裕)');
    st.className = `font-bold ${over ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}`;
  }

  // 温度与灵压计更新
  const temp = S.temperature || 42;
  _setText('cpuHeatTempText', `${temp}°C · ${temp > 85 ? '⚠ 极度危险' : temp > 65 ? '🔥 狂暴高温' : '正常稳态'}`);
  const heatBar = document.getElementById('cpuHeatBar');
  if (heatBar) {
    heatBar.style.width = Math.min(100, (temp / 100) * 100) + '%';
  }
  _setText('cpuOverclockBuffText', `全厂产速: ${Math.round((S.overclockMultiplier || 1.0) * 100)}%`);
  const heatWarn = document.getElementById('cpuHeatWarningText');
  if (heatWarn) {
    heatWarn.textContent = temp > 85 ? '⚠ 快炸了！接冷水降温' : (temp > 65 ? '🔥 狂暴过载发热中' : '水冷温控良好');
    heatWarn.className = `font-bold ${temp > 85 ? 'text-rose-400 animate-pulse' : temp > 65 ? 'text-amber-400' : 'text-emerald-400'}`;
  }
  // 母板工况
  const zl = document.getElementById('zoneProgressList');
  let ok = 0;
  if (zl) zl.innerHTML = Object.keys(S.zones).map(k => {
    const z = S.zones[k]; if (z.satisfied) ok++;
    return `<div class="flex justify-between items-center cursor-pointer hover:text-white" onclick="jumpToZone('${k}')"><span style="color:${z.themeColor}">${z.name}</span><span class="${z.satisfied ? 'text-emerald-400' : 'text-white/40'}">${z.satisfied ? '● ' + z.activeCount + ' 插座生效' : '○ 待满足'}</span></div>`;
  }).join('');
  else Object.keys(S.zones).forEach(k => { if (S.zones[k].satisfied) ok++; });
  _setText('zoneProgressText', `${ok} / 4 母板通电`);
  // 当前活动核心插座
  const core = S.nodes.find(n => n.type === 'core' && n.zoneId === S.activeZoneId);
  const sc = document.getElementById('cpuSocketsContainer');
  if (core && sc) {
    const zoneReqMap = {
      zone1: { in_1: 3, in_2: 5, in_3: 4, in_4: 3 },
      zone2: { in_1: 3, in_2: 5, in_3: 4, in_4: 3, in_5: 5, in_6: 4 },
      zone3: { in_1: 3, in_2: 5, in_3: 4, in_4: 5 },
      zone4: { in_1: 3, in_2: 5, in_3: 4, in_4: 3 }
    };
    const curZoneMap = zoneReqMap[core.zoneId] || zoneReqMap.zone2;
    sc.innerHTML = core.inPins.map(p => {
      const src = core.socketSource && core.socketSource[p.id], act = core.activeSockets && core.activeSockets[p.id];
      const rTicks = curZoneMap[p.id] || 3;
      return `<div class="flex justify-between ${act ? 'text-emerald-300' : (src ? 'text-amber-300' : 'text-white/35')}"><span>${p.label} <small class="text-amber-300/80 font-mono">⏱${rTicks}拍</small></span><span class="truncate max-w-[130px]">${src ? (act ? '✓ ' : '△ ') + src.name : '○ 空闲'}</span></div>`;
    }).join('');
    const used = Object.keys(core.socketSource || {}).length;
    _setText('cpuSlotUsageText', `${used} / ${core.inPins.length} 插座`);
  }
  const btnStyle = { zone1: 1, zone2: 1, zone3: 1, zone4: 1 };
  Object.keys(btnStyle).forEach(k => {
    const b = document.getElementById('jumpBtn_' + k); if (!b) return;
    b.className = 'px-2 py-0.5 rounded border font-bold transition cursor-pointer ' + (k === S.activeZoneId ? 'bg-amber-500/30 text-amber-200 border-amber-400' : 'bg-white/5 text-white/60 border-white/10 hover:text-white');
  });
}

function renderBlueprintPhaseTabs() {
  const c = document.getElementById('cpuBlueprintPhaseTabs');
  if (!c) return;
  const S = CPU_BLUEPRINT_STATE;
  c.innerHTML = Object.keys(S.zones).map(k => {
    const z = S.zones[k], cur = k === S.activeZoneId;
    return `<button onclick="jumpToZone('${k}');" class="px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 border ${cur ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,146,30,0.6)]' : 'bg-black/50 text-white/80 border-white/10 hover:border-amber-400/50 hover:text-white'}"><i class="${z.icon} text-[10px]"></i><span>${z.shortName}</span>${z.satisfied ? '<span class="text-emerald-500 text-[9px]">●</span>' : ''}</button>`;
  }).join('');
}

// =========================================================================
// 10. 法令 (生产类型 4 种 + 战斗类型 4 种)
// =========================================================================
function switchDecreeCategory(cat) {
  CPU_BLUEPRINT_STATE.activeDecreeCategory = cat;
  playUiSound('click');
  updateDecreeUi();
}
window.switchDecreeCategory = switchDecreeCategory;

function switchCpuDecree(id) {
  if (!CPU_DECREE_CONFIGS[id]) return;
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.activeDecree = id;
  const dec = getActiveDecree();
  if (dec.category) CPU_BLUEPRINT_STATE.activeDecreeCategory = dec.category;
  // 被法令禁用的金身节点自动断开
  if (dec.disabledCategories) {
    const bad = CPU_BLUEPRINT_STATE.nodes.filter(n => n.isJinshen && dec.disabledCategories.includes(n.category)).map(n => n.id);
    CPU_BLUEPRINT_STATE.wires = CPU_BLUEPRINT_STATE.wires.filter(w => !bad.includes(w.fromNode));
  }
  updateDecreeUi();
  recomputeCpu();
  showNotification(`已切换模式【${dec.name}】！收益: ${dec.buffDesc} ｜ 代价: ${dec.costDesc || dec.penaltyDesc}`);
}
window.switchCpuDecree = switchCpuDecree;

function updateDecreeUi() {
  const dec = getActiveDecree();
  const S = CPU_BLUEPRINT_STATE;
  const curCat = S.activeDecreeCategory || dec.category || 'production';

  // 1. 顶部分类 Tab 按钮样式
  const tabProd = document.getElementById('decreeCategoryTab_production');
  const tabCombat = document.getElementById('decreeCategoryTab_combat');
  if (tabProd && tabCombat) {
    if (curCat === 'production') {
      tabProd.className = 'px-3 py-1 rounded font-bold transition cursor-pointer bg-amber-500 text-black shadow-md flex items-center space-x-1';
      tabCombat.className = 'px-3 py-1 rounded font-bold transition cursor-pointer text-white/60 hover:text-white flex items-center space-x-1';
    } else {
      tabProd.className = 'px-3 py-1 rounded font-bold transition cursor-pointer text-white/60 hover:text-white flex items-center space-x-1';
      tabCombat.className = 'px-3 py-1 rounded font-bold transition cursor-pointer bg-red-500 text-white shadow-md flex items-center space-x-1';
    }
  }

  // 2. 当前生效法令徽章
  const badgeEl = document.getElementById('activeDecreeQuickBadge');
  if (badgeEl) {
    badgeEl.innerHTML = `
      <span class="text-white/60 font-mono">当前生效:</span>
      <span class="px-2 py-0.5 rounded font-bold border flex items-center space-x-1" style="background:${dec.color}22;border-color:${dec.color};color:${dec.color};">
        <i class="${dec.icon} text-xs"></i><span>${dec.name}</span>
      </span>
      <span class="text-emerald-300 font-bold ml-1">${dec.buffDesc}</span>
      <span class="text-rose-400 text-[10px] ml-1 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/30">⚠ ${dec.costDesc || dec.penaltyDesc}</span>
    `;
  }

  // 3. 动态渲染当前分类下的 4 张法令大卡片
  const gridEl = document.getElementById('decreeCardsGrid');
  if (gridEl) {
    const list = Object.values(CPU_DECREE_CONFIGS).filter(d => d.category === curCat);
    gridEl.innerHTML = list.map(d => {
      const active = d.id === dec.id;
      const borderCol = active ? d.color : 'rgba(255,255,255,0.12)';
      const bg = active ? `linear-gradient(135deg, rgba(8,16,28,0.98), ${d.color}25)` : '#070b13';
      const glow = active ? `box-shadow: 0 0 16px ${d.color}55;` : '';
      return `
        <div onclick="switchCpuDecree('${d.id}');" class="p-2 rounded-lg border transition cursor-pointer flex flex-col justify-between hover:scale-[1.01]"
             style="border-color:${borderCol};background:${bg};${glow}">
          <div class="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
            <div class="flex items-center space-x-1.5 font-bold" style="color:${d.color}">
              <i class="${d.icon} text-xs"></i>
              <span class="text-[11px] font-black tracking-wider">${d.name}</span>
            </div>
            ${active ? `<span class="text-[8.5px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-black">● 运行中</span>` : `<span class="text-[8.5px] text-white/40">点击颁布</span>`}
          </div>
          <div class="text-[9.5px] text-emerald-300 font-bold leading-tight mb-1">
            <i class="fa-solid fa-circle-check text-[8.5px] mr-1"></i>${d.buffDesc}
          </div>
          <div class="text-[8.5px] text-rose-300 leading-tight bg-rose-950/40 p-1 rounded border border-rose-500/20">
            <i class="fa-solid fa-triangle-exclamation text-[8px] mr-0.5 text-rose-400"></i>${d.costDesc || d.penaltyDesc}
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. 兼容更新侧边栏与简易按钮
  _setText('decreeTitle', dec.name);
  _setText('decreeBuffText', '✓ ' + dec.buffDesc);
  _setText('decreePenaltyText', '⚠ ' + (dec.costDesc || dec.penaltyDesc));
}

// =========================================================================
// 11. 检视面板 / 芯片升级 / 金身激活
// =========================================================================
const NODE_TYPE_DESC = {
  input: '供料送流管：输送五行基础流体，决定网络初始流量。',
  splitter_valve: '分流调节阀：支持实时调配两路输出比例 (8:2 / 5:5 / 2:8)，精确控制主副产线流量。',
  mode_switch: '模式切档闸刀：实体刀闸开关，一键在 [基建厂规] 与 [出征战神] 之间改道分流。',
  accumulator: '蓄能电容箱：积蓄涓涓细流，蓄满后爆发超高压脉冲，大幅增幅 (×1.35) 下游输出。',
  cooler_tank: '冷热对冲水箱：将高温流与玄冰冷水混合，直接为母板降温 -15°C，保母板不炸。',
  booster_pump: '加压推进泵：音速对通过的流体加压，流速提升 +25%，伴随轻微发热 (+3°C)。',
  amplifier: '水火对撞机：极阳火与极阴水对撞产生聚变暴击，爆发 2.5 倍超高流速。',
  branch: '分流器：1 进 2 出，把流量对半平分。',
  merger: '混料箱/总汇流管：多路流量混合汇聚。',
  stabilizer: '循环加速器：对通过的流量做循环提速。',
  core: '总核心：插座有限，接哪些芯片/金身节点由你取舍；总算力不得超过上限。'
};
function inspectBlueprintNodeById(id) { const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === id); if (n) inspectBlueprintNode(n); }

function _costCards(list) {
  return list.map(c => {
    const have = getPlayerInventoryCount(c.name), ok = have >= c.need;
    return `<div class="flex justify-between text-[10px] font-mono"><span class="text-white/70">${c.name}</span><span class="${ok ? 'text-emerald-400' : 'text-rose-400'}">${Math.min(have, 999)}/${c.need} ${ok ? '✓' : '✗'}</span></div>`;
  }).join('') || '<div class="text-[10px] text-white/40 font-mono">无需材料</div>';
}

function inspectBlueprintNode(node, silent) {
  if (!node) return;
  const S = CPU_BLUEPRINT_STATE;
  S.selectedEntity = node.id;
  if (!silent) {
    document.querySelectorAll('.bp-node-card').forEach(e => { e.style.outline = ''; });
    const card = document.getElementById('node_' + node.id);
    if (card) card.style.outline = '2px solid #00f0ff';
  }
  const g = id => document.getElementById(id);
  _setText('pNodeTitle', node.name);
  _setText('pNodeTypeLabel', `${node.category || ''}${node.catName ? ' · ' + node.catName : ''}${getNodeComputeCost(node) ? ' · 算力 ' + getNodeComputeCost(node) : ''}`);
  const ic = g('pNodeIcon'); if (ic) ic.className = `${node.icon} text-sm text-amber-300`;
  const badge = g('pNodeLevelBadge'), sec = g('pNodeUpgradeSection'), tag = g('pNodeStatusTag');
  const costEl = g('pNodeUpgradeCostCards'), btn = g('pNodeUpgradeBtn'), btnT = g('pNodeUpgradeBtnText'), prev = g('pNodeNextLevelPreview');
  if (badge) badge.classList.add('hidden');
  if (sec) sec.classList.add('hidden');
  if (tag) { tag.textContent = node.isWorking ? '● 运行中' : '○ 未通电'; tag.className = `text-[10px] font-mono font-bold ${node.isWorking ? 'text-emerald-400' : 'text-white/40'}`; }
  let desc = NODE_TYPE_DESC[node.type] || (node.type && node.type.startsWith('buff_') ? '提速目标口：流量达到要求后点亮，接入总核心插座给全厂提速。' : '');

  if (node.type === 'splitter_valve') {
    if (sec) sec.classList.remove('hidden');
    if (badge) { badge.classList.remove('hidden'); badge.textContent = `当前配比: ${node.ratio || '50:50'}`; }
    if (prev) prev.textContent = `主路(出A): ${node.ratio === '80:20' ? '80%' : (node.ratio === '20:80' ? '20%' : '50%')} ｜ 副路(出B): ${node.ratio === '80:20' ? '20%' : (node.ratio === '20:80' ? '80%' : '50%')}`;
    if (costEl) costEl.innerHTML = `
      <div class="space-y-1.5 p-2 bg-black/40 rounded border border-white/10">
        <div class="text-[10px] text-white/70">快速切换分流配比：</div>
        <div class="flex space-x-1">
          <button onclick="toggleSplitterRatio('${node.id}','80:20');inspectBlueprintNodeById('${node.id}');" class="flex-1 py-1 text-[10px] rounded cursor-pointer ${node.ratio==='80:20'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/70 hover:text-white'}">80:20 (主路狂暴)</button>
          <button onclick="toggleSplitterRatio('${node.id}','50:50');inspectBlueprintNodeById('${node.id}');" class="flex-1 py-1 text-[10px] rounded cursor-pointer ${node.ratio==='50:50'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/70 hover:text-white'}">50:50 (均分对流)</button>
          <button onclick="toggleSplitterRatio('${node.id}','20:80');inspectBlueprintNodeById('${node.id}');" class="flex-1 py-1 text-[10px] rounded cursor-pointer ${node.ratio==='20:80'?'bg-amber-500 text-black font-bold':'bg-white/10 text-white/70 hover:text-white'}">20:80 (副路偏向)</button>
        </div>
      </div>`;
    if (btn) btn.style.display = 'none';
  } else if (node.type === 'mode_switch') {
    if (sec) sec.classList.remove('hidden');
    const isCombat = node.mode === 'combat';
    if (badge) { badge.classList.remove('hidden'); badge.textContent = isCombat ? '战神出征' : '厂规基建'; }
    if (prev) prev.textContent = isCombat ? '出A: 0% ｜ 出B: 100% (全流注入战斗核心)' : '出A: 100% ｜ 出B: 0% (全流供给工业产线)';
    if (costEl) costEl.innerHTML = `
      <div class="space-y-1.5 p-2 bg-black/40 rounded border border-white/10">
        <div class="text-[10px] text-white/70">物理刀闸工控换挡：</div>
        <button onclick="toggleModeSwitch('${node.id}');inspectBlueprintNodeById('${node.id}');" class="w-full py-1.5 text-xs font-bold rounded cursor-pointer ${isCombat?'bg-orange-500 text-black shadow-lg shadow-orange-500/30':'bg-amber-500 text-black shadow-lg shadow-amber-500/30'}">
          <i class="fa-solid fa-power-off mr-1"></i>当前：${isCombat ? '【战神出征模式】(点我切回基建)' : '【基建厂规模式】(点我切战神)'}
        </button>
      </div>`;
    if (btn) btn.style.display = 'none';
  } else if (node.type === 'chip') {
    const cfg = CHIP_UPGRADE_CONFIGS[node.chipKey], cur = getChipLevelCfg(node), next = cfg.levels[node.level] || null;
    if (badge) { badge.classList.remove('hidden'); badge.textContent = `Lv.${node.level}/5`; }
    if (sec) sec.classList.remove('hidden');
    desc = `${cfg.name}：当前 ${cur.bonusText}，占用算力 ${cur.compute}。接入核心插座后生效。`;
    if (next) {
      if (prev) prev.textContent = `→ Lv.${next.level}: ${next.bonusText}`;
      if (costEl) costEl.innerHTML = _costCards(next.cost.map(c => ({ name: c.name, need: c.count })));
      if (btn) { btn.style.display = ''; btn.disabled = false; }
      if (btnT) btnT.textContent = `消耗材料升级至 Lv.${next.level}`;
    } else {
      if (prev) prev.textContent = 'MAX';
      if (costEl) costEl.innerHTML = '<div class="text-[10px] text-emerald-400 font-mono">已升至满级</div>';
      if (btnT) btnT.textContent = '已满级';
    }
  } else if (node.isJinshen) {
    if (sec) sec.classList.remove('hidden');
    const dis = isJinshenDisabled(node);
    const inSig = Math.round(node.sigIn || 0);
    const pct = node.tierPct ? Math.round(node.tierPct * 100) : 0;
    desc = `${node.desc}\n效果：${node.buffText}\n\n★【算力供流提升比例】：\n• 经过 ≥10/分 ➔ 提成 +20%\n• 经过 ≥50/分 ➔ 提成 +40%\n• 经过 ≥150/分 ➔ 提成 +60%\n• 经过 ≥300/分 ➔ 提成 +80%\n• 经过 ≥500/分 ➔ 提成 +100%（满额暴击）\n\n当前输入流速: ${inSig}/分 (提成: +${pct}%)\n接入母板核心插座后实时加成全厂！${dis ? '\n⚠ 当前法令禁用此系金身节点' : ''}`;
    if (badge) { badge.classList.remove('hidden'); badge.textContent = `供流档位: +${pct}%`; }
    if (prev) prev.textContent = inSig > 0 ? `已连通回路 (生效中 +${pct}%)` : '左侧引脚连入供流，右侧连入CPU核心';
    if (costEl) costEl.innerHTML = `<div class="text-[10px] font-mono text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-500/30">
      <div class="text-white font-bold mb-1">连线机制指引：</div>
      <div>1. 将前置工控节点（如加压泵、翻倍器、分色器）连入本节点的 <span class="text-cyan-400 font-bold">[算力供流]</span> 输入引脚。</div>
      <div>2. 将本节点的 <span class="text-amber-400 font-bold">[接CPU]</span> 引脚连入母板核心的插座。</div>
      <div>3. 经过的流量越多，增益加成比例越高 (20%~100%)！无需背包材料。</div>
    </div>`;
    if (btn) btn.style.display = 'none'; // 彻底隐藏原来的材料按钮
  } else if (node.type === 'core') {
    const used = Object.keys(node.socketSource || {}).length;
    desc += `\n插座 ${used}/${node.inPins.length}｜全局算力 ${S.computeLoad}/${S.computeCap}`;
  }
  const bt = g('pNodeBuffText'); if (bt) bt.innerHTML = desc.replace(/\n/g, '<br>');
}

function triggerUpgradeOrUnlockSelectedNode() {
  const S = CPU_BLUEPRINT_STATE;
  const node = S.nodes.find(n => n.id === S.selectedEntity);
  if (!node) return;
  if (node.type === 'chip') {
    const cfg = CHIP_UPGRADE_CONFIGS[node.chipKey], next = cfg.levels[node.level];
    if (!next) { showNotification('该芯片已是满级'); return; }
    for (const c of next.cost) if (getPlayerInventoryCount(c.name) < c.count) { showNotification(`材料不足：${c.name} ×${c.count}`); return; }
    next.cost.forEach(c => consumePlayerInventory(c.name, c.count));
    node.level++;
    playUiSound('zap');
    showNotification(`【${node.name}】研发升级至 Lv.${node.level}：${next.bonusText}`);
    recomputeCpu();
  } else if (node.isJinshen) {
    activateJinshenNode(node, false);
  }
}
function triggerUnlockSelectedJinshenNode() { triggerUpgradeOrUnlockSelectedNode(); }

function activateJinshenNode(node, free) {
  if (node.activated) { showNotification('该金身节点已激活，请拉线接入核心插座'); return false; }
  if (isJinshenDisabled(node)) { showNotification(`当前法令【${getActiveDecree().name}】禁用此系节点！`); return false; }
  if (node.prereq) {
    const pre = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === node.prereq);
    if (pre && !pre.activated) { if (free) activateJinshenNode(pre, true); else { showNotification(`需先激活前置节点【${pre.name}】`); return false; } }
  }
  if (!free) {
    for (const c of node.cost) if (getPlayerInventoryCount(c.name) < c.need) { showNotification(`材料不足：${c.name} ×${c.need}`); return false; }
    node.cost.forEach(c => consumePlayerInventory(c.name, c.need));
  }
  node.activated = true;
  playUiSound('zap');
  if (!free) { showNotification(`★【${node.name}】已激活！拉出其[接CPU]引脚，接到本母板核心的金身插座才会生效。`); recomputeCpu(); }
  return true;
}

// =========================================================================
// 12. 连线交互
// =========================================================================
function cancelBlueprintConnecting() {
  document.querySelectorAll('.bp-pin').forEach(p => p.classList.remove('bp-pin-connecting'));
  CPU_BLUEPRINT_STATE.connectingPin = null;
  renderBlueprintWiresSvg();
}
function handleBlueprintPinClick(nodeId, pinId, pinType, e) {
  if (e) e.stopPropagation();
  const S = CPU_BLUEPRINT_STATE;
  const co = getBlueprintPinCoords(nodeId, pinId) || { x: 0, y: 0 };
  const el = document.getElementById(`pin_${nodeId}_${pinId}`);
  if (!S.connectingPin) {
    playUiSound('click');
    S.connectingPin = { nodeId, pinId, pinType, curX: co.x, curY: co.y };
    if (el) el.classList.add('bp-pin-connecting');
    renderBlueprintWiresSvg();
    showNotification(`已拉出导线，请点击目标${pinType === 'out' ? '输入[IN]' : '输出[OUT]'}引脚闭合回路`);
    return;
  }
  const src = S.connectingPin;
  if (src.nodeId === nodeId && src.pinId === pinId) { cancelBlueprintConnecting(); return; }
  if (src.nodeId === nodeId) { showNotification('无法自连，请连接到不同节点'); return; }
  if (src.pinType === pinType) {
    document.querySelectorAll('.bp-pin').forEach(p => p.classList.remove('bp-pin-connecting'));
    S.connectingPin = { nodeId, pinId, pinType, curX: co.x, curY: co.y };
    if (el) el.classList.add('bp-pin-connecting');
    renderBlueprintWiresSvg();
    return;
  }
  const fromId = src.pinType === 'out' ? src.nodeId : nodeId, fromPin = src.pinType === 'out' ? src.pinId : pinId;
  const toId = src.pinType === 'in' ? src.nodeId : nodeId, toPin = src.pinType === 'in' ? src.pinId : pinId;
  const from = S.nodes.find(n => n.id === fromId), to = S.nodes.find(n => n.id === toId);
  if (!from || !to) return;
  const isJumperSocket = (to.type === 'core' && toPin && toPin.includes('飞线')) || (from.type === 'core' && fromPin && fromPin.includes('飞线'));
  if (from.zoneId !== to.zoneId && !isJumperSocket) {
    showNotification('普通元件只能在同一母板内连线，跨区连线请接入核心【跨区飞线插座】');
    cancelBlueprintConnecting();
    return;
  }
  if (S.wires.some(w => w.fromNode === fromId && w.fromPin === fromPin && w.toNode === toId && w.toPin === toPin)) { showNotification('该线路已存在'); cancelBlueprintConnecting(); return; }
  // 严格 1 接口只能连 1 根线：如果源端口或目标端口已有连线，清除旧线替换，杜绝一接口分叉连多线！
  const old = S.wires.filter(w => 
    (w.toNode === toId && w.toPin === toPin) || 
    (w.fromNode === fromId && w.fromPin === fromPin) ||
    (w.fromNode === toId && w.fromPin === toPin) ||
    (w.toNode === fromId && w.toPin === fromPin)
  );
  if (to.type === 'core') {
    if (from.isJinshen) {
      if (isJinshenDisabled(from)) { showNotification('该节点被当前法令禁用'); cancelBlueprintConnecting(); return; }
    }
    // 同一来源不能重复占用多个插座
    if (S.wires.some(w => w.toNode === toId && w.fromNode === fromId && w.toPin !== toPin)) { showNotification('该节点已占用本核心的另一个插座'); cancelBlueprintConnecting(); return; }
    const oldSrc = old[0] ? S.nodes.find(n => n.id === old[0].fromNode) : null;
    const after = S.computeLoad - (oldSrc ? getNodeComputeCost(oldSrc) : 0) + getNodeComputeCost(from);
    if (after > S.computeCap * 1.5) {
      showNotification(`⚠ 算力过载超限！接入后 ${after}/${S.computeCap} FLOPS。已超过 150% 极限超频！`);
      cancelBlueprintConnecting(); return;
    }
  }
  S.wires = S.wires.filter(w => !old.includes(w));
  const isWaste = (fromPin && fromPin.includes('recycle')) || (toPin && toPin.includes('recycle'));
  const isJumper = isJumperSocket;
  const wireColor = isWaste ? '#f43f5e' : (isJumper ? '#00f0ff' : (to.type === 'core' ? '#ffd700' : (from.themeColor || '#00f0ff')));
  S.wires.push({
    id: `w_${Date.now()}_${S.wires.length}`,
    fromNode: fromId, fromPin,
    toNode: toId, toPin,
    color: wireColor,
    isGold: to.type === 'core',
    isJumper: isJumper
  });
  playUiSound('zap');
  cancelBlueprintConnecting();
  recomputeCpu();
  showNotification('★ 回路已闭合！' + (to.type === 'core' ? `【${from.name}】接入【${to.name}】` : ''));
}
function removeBlueprintWire(idx) {
  const S = CPU_BLUEPRINT_STATE;
  if (idx < 0 || idx >= S.wires.length) return;
  playUiSound('click');
  S.wires.splice(idx, 1);
  recomputeCpu();
  showNotification('已剪断该段回路');
}
function resetCurrentBlueprintCircuit() {
  playUiSound('click');
  CPU_BLUEPRINT_STATE.wires = [];
  recomputeCpu();
  showNotification('已清空全部连线，请自行重新规划回路（可点「展示 50+ 节点网络」一键恢复）');
}
function selectInputNodeMaterial(nodeId, mat) {
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === nodeId);
  const z = n && CPU_BLUEPRINT_STATE.zones[n.zoneId];
  if (!n || !z || !z.inputMaterials[mat]) return;
  playUiSound('click');
  n.material = mat; n.signalOut = z.inputMaterials[mat].signal;
  recomputeCpu();
}
function selectBlueprintZone(zid, center) {
  const S = CPU_BLUEPRINT_STATE;
  if (!S.zones[zid]) return;
  S.activeZoneId = zid;
  renderBlueprintZonesHtml(); renderBlueprintPhaseTabs(); updateBlueprintMonitorStats();
  if (center) centerOnRect(S.zones[zid].rect);
}
function toggleSplitterRatio(nodeId, newRatio) {
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === nodeId);
  if (!n) return;
  playUiSound('toggle');
  n.ratio = newRatio;
  if (n.outPins && n.outPins.length >= 2) {
    if (newRatio === '80:20') { n.outPins[0].label = '主路80%'; n.outPins[1].label = '副路20%'; }
    else if (newRatio === '20:80') { n.outPins[0].label = '主路20%'; n.outPins[1].label = '副路80%'; }
    else { n.outPins[0].label = '主路50%'; n.outPins[1].label = '副路50%'; }
  }
  recomputeCpu();
  showNotification(`已调节【${n.name}】分流比例为 [${newRatio}]`);
}

function toggleModeSwitch(nodeId) {
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === nodeId);
  if (!n) return;
  playUiSound('zap');
  n.mode = n.mode === 'base' ? 'combat' : 'base';
  recomputeCpu();
  showNotification(`工控切档闸刀【${n.name}】已拨至【${n.mode === 'combat' ? '⚔ 战神出征模式' : '⚙ 基建厂规模式'}】！`);
}

function spawnBlueprintNode(type) {
  const S = CPU_BLUEPRINT_STATE, z = S.zones[S.activeZoneId];
  playUiSound('click');
  const cnt = S.nodes.filter(n => n.zoneId === z.id && n.spawned).length;
  const x = z.rect.x + 40 + (cnt % 8) * 150, y = z.rect.y + z.rect.height - 70 - Math.floor(cnt / 8) * 80;
  const id = `${z.id}_new_${type}_${Date.now()}`;
  const T = {
    splitter_valve: { type: 'splitter_valve', ratio: '50:50', name: '分流调节阀(新)', category: '流量偏向', themeColor: '#f59e0b', icon: 'fa-solid fa-sliders', width: 135, inPins: [_pin('in', '进', '#f59e0b')], outPins: [_pin('out_a', '主路50%', '#f59e0b'), _pin('out_b', '副路50%', '#f59e0b')] },
    mode_switch: { type: 'mode_switch', mode: 'base', name: '模式切档闸刀(新)', category: '逻辑闸刀', themeColor: '#eab308', icon: 'fa-solid fa-toggle-on', width: 140, inPins: [_pin('in', '进', '#eab308')], outPins: [_pin('out_a', '基建厂规', '#eab308'), _pin('out_b', '战神出征', '#ef4444')] },
    accumulator: { type: 'accumulator', chargePct: 98, name: '蓄能电容箱(新)', category: '聚能爆发', themeColor: '#00f0ff', icon: 'fa-solid fa-car-battery', width: 135, inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out', '脉冲出', '#00f0ff')] },
    cooler_tank: { type: 'cooler_tank', name: '冷热对冲水箱(新)', category: '水火稳态', themeColor: '#14b8a6', icon: 'fa-solid fa-temperature-arrow-down', width: 135, inPins: [_pin('in_hot', '热流进', '#f59e0b'), _pin('in_cold', '冷水进', '#00f0ff')], outPins: [_pin('out', '出', '#14b8a6')] },
    booster_pump: { type: 'booster_pump', name: '加压推进泵(新)', category: '音速加压', themeColor: '#10b981', icon: 'fa-solid fa-gauge-high', width: 125, inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] },
    amplifier: { type: 'amplifier', name: '水火对撞机(新)', category: '相克暴击', themeColor: '#c084fc', icon: 'fa-solid fa-atom', width: 130, inPins: [_pin('in_1', '水', '#00f0ff'), _pin('in_2', '火', '#f59e0b')], outPins: [_pin('out', '出', '#c084fc')] },
    branch: { type: 'branch', name: '分流器 (新)', category: '1进2出', themeColor: '#00f0ff', icon: 'fa-solid fa-code-branch', width: 115, inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out_a', '出1', '#00f0ff'), _pin('out_b', '出2', '#00f0ff')] },
    merger: { type: 'merger', name: '并线器 (新)', category: '2合1', themeColor: '#38bdf8', icon: 'fa-solid fa-arrows-to-dot', width: 115, inPins: [_pin('in_1', '进1', '#38bdf8'), _pin('in_2', '进2', '#38bdf8')], outPins: [_pin('out', '出', '#38bdf8')] },
    bridge: { type: 'bridge', name: '立体立交桥(新)', category: '立体跨线', themeColor: '#00f0ff', icon: 'fa-solid fa-bridge', width: 140, inPins: [_pin('in_a', '下层平直进', '#00f0ff'), _pin('in_b', '上层跨线进', '#f59e0b')], outPins: [_pin('out_a', '下层平直出', '#00f0ff'), _pin('out_b', '上层架空出', '#f59e0b')] },
    sync_gate: { type: 'sync_gate', name: '同频共鸣闸(新)', category: '时序节拍门', themeColor: '#ffd700', icon: 'fa-solid fa-bolt-lightning', width: 145, inPins: [_pin('in_1', '相位A', '#f59e0b'), _pin('in_2', '相位B', '#00f0ff')], outPins: [_pin('out', '共鸣输出', '#ffd700')] },
    delay_pipe: { type: 'delay_pipe', delayTicks: 1, name: '步进延时管(新)', category: '节拍调配器', themeColor: '#6366f1', icon: 'fa-solid fa-clock', width: 135, inPins: [_pin('in', '进流', '#6366f1')], outPins: [_pin('out', '延迟出', '#6366f1')] },
    wave_upgrader: { type: 'wave_upgrader', reqTicks: 3, name: '波形升级仪(新)', category: '波形升阶', themeColor: '#c084fc', icon: 'fa-solid fa-wave-square', width: 140, inPins: [_pin('in', '信号进', '#c084fc')], outPins: [_pin('out', '升阶出', '#c084fc')] },
    input: { type: 'input', name: '送流管 (新)', category: '进料口', themeColor: z.themeColor, icon: 'fa-solid fa-arrow-right-to-bracket', width: 140, material: '耐火炉芯', signalOut: 100, outPins: [_pin('out_a', '出', z.themeColor)] }
  }[type];
  if (!T) return;
  S.nodes.push(_mkNode(Object.assign({ id, zoneId: z.id, x, y, spawned: true }, T)));
  recomputeCpu();
  showNotification(`已向【${z.name}】底部投放【${T.name}】，可拖动到合适位置连线`);
}

// 拖拽 / 平移 / 缩放
function startDragBlueprintNode(nodeId, e) {
  if (e) { e.stopPropagation(); }
  const n = CPU_BLUEPRINT_STATE.nodes.find(x => x.id === nodeId);
  if (!n) return;
  if (e && e.target && e.target.closest('button')) return;
  const S = CPU_BLUEPRINT_STATE;
  S.isPanning = false; S.draggingNodeId = nodeId;
  S.dragStartMouse = { x: e ? e.clientX : 0, y: e ? e.clientY : 0 };
  S.initialNodePos = { x: n.x, y: n.y };
  S.activeZoneId !== n.zoneId && selectBlueprintZone(n.zoneId);
  inspectBlueprintNode(n);
}
document.addEventListener('mousemove', (e) => {
  const modal = document.getElementById('cpuProcessorModal');
  if (!modal || modal.classList.contains('hidden')) return;
  const S = CPU_BLUEPRINT_STATE;
  if (S.isPanning) {
    S.panX = Math.round(S.initialPanPos.x + e.clientX - S.panStartMouse.x);
    S.panY = Math.round(S.initialPanPos.y + e.clientY - S.panStartMouse.y);
    updateCanvasTransform(); return;
  }
  if (S.draggingNodeId) {
    const n = S.nodes.find(x => x.id === S.draggingNodeId);
    if (n) {
      let nx = Math.round(S.initialNodePos.x + (e.clientX - S.dragStartMouse.x) / S.zoom);
      let ny = Math.round(S.initialNodePos.y + (e.clientY - S.dragStartMouse.y) / S.zoom);
      const r = S.zones[n.zoneId].rect;
      nx = Math.max(r.x + 15, Math.min(r.x + r.width - (n.width || 120) - 15, nx));
      ny = Math.max(r.y + 50, Math.min(r.y + r.height - 60, ny));
      n.x = nx; n.y = ny;
      const card = document.getElementById('node_' + n.id);
      if (card) { card.style.left = nx + 'px'; card.style.top = ny + 'px'; }
      renderBlueprintWiresSvg();
    }
    return;
  }
  if (S.connectingPin) {
    const vp = document.getElementById('paragonViewport');
    const r = vp ? vp.getBoundingClientRect() : { left: 0, top: 0 };
    S.connectingPin.curX = (e.clientX - r.left - S.panX) / S.zoom;
    S.connectingPin.curY = (e.clientY - r.top - S.panY) / S.zoom;
    renderBlueprintWiresSvg();
  }
});
document.addEventListener('mouseup', () => {
  const S = CPU_BLUEPRINT_STATE;
  if (S.isPanning) { S.isPanning = false; const vp = document.getElementById('paragonViewport'); if (vp) vp.classList.remove('bp-viewport-panning'); }
  if (S.draggingNodeId) { S.draggingNodeId = null; renderBlueprintWiresSvg(); }
});
function handleCanvasMouseDown(e) {
  if (e.target.closest('.bp-node-card') || e.target.closest('.bp-pin') || e.target.closest('button') || e.target.closest('path[onclick]')) return;
  e.preventDefault(); e.stopPropagation();
  const S = CPU_BLUEPRINT_STATE;
  S.isPanning = true;
  S.panStartMouse = { x: e.clientX, y: e.clientY };
  S.initialPanPos = { x: S.panX, y: S.panY };
  const vp = document.getElementById('paragonViewport'); if (vp) vp.classList.add('bp-viewport-panning');
}
function _zoomAt(newZoom, mx, my) {
  const S = CPU_BLUEPRINT_STATE, old = S.zoom;
  newZoom = Math.max(0.18, Math.min(2.2, newZoom));
  S.panX = mx - (mx - S.panX) * (newZoom / old);
  S.panY = my - (my - S.panY) * (newZoom / old);
  S.zoom = newZoom;
  updateCanvasTransform(); renderBlueprintWiresSvg();
}
function handleCanvasWheel(e) {
  e.preventDefault(); e.stopPropagation();
  const vp = document.getElementById('paragonViewport'); if (!vp) return;
  const r = vp.getBoundingClientRect();
  _zoomAt(CPU_BLUEPRINT_STATE.zoom * (e.deltaY < 0 ? 1.12 : 0.89), e.clientX - r.left, e.clientY - r.top);
}
function handleZoomCanvas(d) {
  const vp = document.getElementById('paragonViewport'); if (!vp) return;
  _zoomAt(CPU_BLUEPRINT_STATE.zoom + d, vp.clientWidth / 2, vp.clientHeight / 2);
}
function updateCanvasTransform() {
  const c = document.getElementById('cpuWorldContainer'), S = CPU_BLUEPRINT_STATE;
  if (c) { 
    c.style.transformOrigin = '0 0'; 
    c.style.transform = `translate3d(${S.panX}px, ${S.panY}px, 0) scale(${S.zoom})`; 
    c.style.willChange = 'transform';
  }
  _setText('cpuZoomBadge', Math.round(S.zoom * 100) + '%');
}
function centerOnRect(r, fixedZoom) {
  const vp = document.getElementById('paragonViewport'), S = CPU_BLUEPRINT_STATE;
  const w = (vp && vp.clientWidth) || 1200, h = (vp && vp.clientHeight) || 700;
  S.zoom = fixedZoom || Math.max(0.18, Math.min(1.2, Math.min((w - 40) / r.width, (h - 60) / r.height)));
  S.panX = Math.round(w / 2 - (r.x + r.width / 2) * S.zoom);
  S.panY = Math.round(h / 2 - (r.y + r.height / 2) * S.zoom);
  updateCanvasTransform(); renderBlueprintWiresSvg();
}
function jumpToZone(zid) {
  playUiSound('click');
  selectBlueprintZone(zid, true);
  const z = CPU_BLUEPRINT_STATE.zones[zid];
  if (z) showNotification(`已聚焦至【${z.name}】`);
}
function fitAllZonesCanvasView() { centerOnRect({ x: 50, y: 100, width: 4650, height: 2850 }); }
function resetCanvasView() { const z = CPU_BLUEPRINT_STATE.zones[CPU_BLUEPRINT_STATE.activeZoneId]; centerOnRect(z.rect, 1); }
function focusCpuCore() {
  const c = CPU_BLUEPRINT_STATE.nodes.find(n => n.type === 'core' && n.zoneId === CPU_BLUEPRINT_STATE.activeZoneId);
  if (c) centerOnRect({ x: c.x - 250, y: c.y - 160, width: 700, height: 420 }, 0.9);
}
function rotateCpuBlueprintTopology() {
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.rotation = (CPU_BLUEPRINT_STATE.rotation + 90) % 360;
  _setText('cpuTopologyAngleBadge', `⟳ ${CPU_BLUEPRINT_STATE.rotation}°`);
  showNotification(`拓扑朝向已记录: ${CPU_BLUEPRINT_STATE.rotation}°`);
}
function filterJinshenNodes() {}

// =========================================================================
// 13. 流量 / 一键展示 / 预设流派 / 调试
// =========================================================================
function applyFlowRateToInputs(flow) {
  const S = CPU_BLUEPRINT_STATE;
  const a = S.nodes.find(n => n.id === 'z2_input_a'), b = S.nodes.find(n => n.id === 'z2_input_b');
  const t = { 10: [10, 0], 100: [60, 40], 500: [250, 250], 1000: [500, 500] }[flow] || [500, 500];
  if (a) a.signalOut = t[0];
  if (b) b.signalOut = t[1];
}
function setInputFlowRate(flow) {
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.currentFlowRate = flow;
  applyFlowRateToInputs(flow);
  recomputeCpu();
  showNotification(`输入流量切换至 ${flow}/分：${flow < 100 ? '开荒，仅首段点亮' : flow < 1000 ? '扩产中，部分提速口点亮' : '满载，50+节点全开'}`);
}
function demoFactoryLivingOptimalCircuit() {
  playUiSound('zap');
  const S = CPU_BLUEPRINT_STATE;
  // 一键重置为全量完美解决方案：54个工控节点 + 全金身节点供流 + 3大跨区高压飞线全部连接
  S.nodes = buildPresetNodes();
  S.wires = buildPresetWires();
  S.currentFlowRate = 1000;
  applyFlowRateToInputs(1000);
  S.selectedEntity = 'z2_core';
  S.activeZoneId = 'zone2';
  recomputeCpu();
  centerOnRect(S.zones.zone2.rect);
  showNotification('★ 全四区最优解回路已全线通电！【分流调节阀 + 模式切档闸刀 + 蓄能电容 + 冷热对冲 + 水火对撞 + 全金身满额 + 4大跨区高压飞线】全网狂暴点亮！');
}
function applyPresetBuild(kind) {
  playUiSound('zap');
  const S = CPU_BLUEPRINT_STATE;
  const plan = {
    combat: { zone1: ['z1_jinshen_blade', 'z1_jinshen_blade6'], zone3: ['z3_jinshen_speed'], zone2: [] },
    industry: { zone2: ['z2_jinshen_drill', 'z2_jinshen_smelt'], zone1: ['z1_jinshen_skin'], zone3: ['z3_jinshen_bag'] },
    balanced: { zone1: ['z1_jinshen_skin', 'z1_jinshen_blade'], zone2: ['z2_jinshen_drill'], zone3: ['z3_jinshen_speed'] }
  }[kind];
  if (!plan) return;
  S.wires = S.wires.filter(w => !w.fromNode.includes('_jinshen_'));
  const dec = getActiveDecree();
  Object.keys(plan).forEach(zid => {
    const core = S.nodes.find(n => n.type === 'core' && n.zoneId === zid);
    if (!core || !core.inPins) return;
    const slots = core.inPins.filter(p => p.label.includes('金身') || p.label.includes('备用')).map(p => p.id);
    plan[zid].forEach((nid, i) => {
      const n = S.nodes.find(x => x.id === nid);
      if (!n || !slots[i]) return;
      if (dec.disabledCategories && dec.disabledCategories.includes(n.category)) return;
      // 1. 从本母板的供流节点接入金身节点的 [in_flow] 引脚
      const supplyNode = S.nodes.find(x => x.zoneId === zid && (x.type === 'input' || x.type === 'stabilizer' || x.type === 'merger'));
      if (supplyNode) {
        const outPin = (supplyNode.outPins && supplyNode.outPins[0]) ? supplyNode.outPins[0].id : 'out';
        S.wires = S.wires.filter(w => !(w.toNode === nid && w.toPin === 'in_flow'));
        S.wires.push({ id: `w_feed_${nid}`, fromNode: supplyNode.id, fromPin: outPin, toNode: nid, toPin: 'in_flow', color: supplyNode.themeColor || '#00f0ff' });
      }
      // 2. 从金身节点的 [out] 引脚连入核心插座
      S.wires = S.wires.filter(w => !(w.toNode === core.id && w.toPin === slots[i]));
      S.wires.push({ id: `w_pre_${nid}`, fromNode: nid, fromPin: 'out', toNode: core.id, toPin: slots[i], color: n.themeColor, isGold: true });
    });
  });

  // 跨母板大飞线：生产 ➔ 战斗 (工业供能飞剑)
  if (kind === 'combat') {
    S.wires = S.wires.filter(w => !(w.toNode === 'z1_core' && w.toPin === 'in_4'));
    S.wires.push({ id: 'w_jumper_z2_z1', fromNode: 'z2_core', fromPin: 'in_1', toNode: 'z1_core', toPin: 'in_4', isJumper: true, color: '#00f0ff' });
  } else if (kind === 'industry') {
    // 跨母板大飞线：水冷辅助 ➔ 生产核心 (玄冰降温超频)
    S.wires = S.wires.filter(w => !(w.toNode === 'z2_core' && w.toPin === 'in_6'));
    S.wires.push({ id: 'w_jumper_z3_z2', fromNode: 'z3_input_a', fromPin: 'out_a', toNode: 'z2_core', toPin: 'in_6', isJumper: true, color: '#00f0ff' });
  }

  recomputeCpu();
  showNotification(`已套用【${{ combat: '飞剑破天流 (带跨区飞线)', industry: '工业狂暴流 (带玄冰水冷降温)', balanced: '均衡修真流' }[kind]}】！`);
}
function debugUnlockAllCpuSystem() {
  playUiSound('zap');
  // 一键为全母板金身节点接通 500/分供能 ➔ 接入核心插座
  const S = CPU_BLUEPRINT_STATE;
  S.wires = buildPresetWires();
  recomputeCpu();
  showNotification('⚡【一键全连通】所有金身节点已全线接通供流！+100% 满额档位已全部连入 CPU 核心生效！');
}
function confirmParagonParamLock() { playUiSound('zap'); showNotification('★ 蓝图回路参数已锁存，全厂增益进入稳态运行！'); }
function triggerParagonPulseOvercharge() { playUiSound('zap'); showNotification('⚡ 全厂狂暴生产脉冲已引爆！'); }

// =========================================================================
// 14. 窗口生命周期
// =========================================================================
let cpuBlueprintHasInitialized = false;
function openCentralProcessorHUD() {
  playUiSound('click');
  if (typeof closeOtherModals === 'function') closeOtherModals('cpuProcessorModal');
  const modal = document.getElementById('cpuProcessorModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  try {
    if (!cpuBlueprintHasInitialized) { initCentralProcessorBlueprint(); cpuBlueprintHasInitialized = true; }
    else refreshCpuAll();
  } catch (err) {
    console.error('Error refreshing Central Processor HUD:', err);
  }
  requestAnimationFrame(() => {
    try {
      centerOnRect(CPU_BLUEPRINT_STATE.zones[CPU_BLUEPRINT_STATE.activeZoneId || 'zone2'].rect);
      setTimeout(renderBlueprintWiresSvg, 60);
      setTimeout(renderBlueprintWiresSvg, 200);
    } catch (e) {
      console.error('Error centering canvas:', e);
    }
  });
}
function closeCentralProcessorHUD() {
  playUiSound('click');
  cancelBlueprintConnecting();
  CPU_BLUEPRINT_STATE.isPanning = false; CPU_BLUEPRINT_STATE.draggingNodeId = null;
  const modal = document.getElementById('cpuProcessorModal');
  if (modal) modal.classList.add('hidden');
}
function toggleCentralProcessorHUD() {
  const m = document.getElementById('cpuProcessorModal');
  if (m && !m.classList.contains('hidden')) closeCentralProcessorHUD(); else openCentralProcessorHUD();
}
document.addEventListener('DOMContentLoaded', () => {
  try {
    initCentralProcessorBlueprint();
    cpuBlueprintHasInitialized = true;
  } catch (err) {
    console.error('Error in Central Processor DOMContentLoaded:', err);
  }
});

// 全局键盘监听：按下 [M] 打开/关闭中央处理器，[Escape] 关闭
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    toggleCentralProcessorHUD();
  } else if (e.key === 'Escape') {
    const modal = document.getElementById('cpuProcessorModal');
    if (modal && !modal.classList.contains('hidden')) {
      e.preventDefault();
      closeCentralProcessorHUD();
    }
  }
});

[initCentralProcessorBlueprint, openCentralProcessorHUD, closeCentralProcessorHUD, toggleCentralProcessorHUD, startDragBlueprintNode,
 handleBlueprintPinClick, removeBlueprintWire, resetCurrentBlueprintCircuit, applyPresetBuild, switchCpuDecree, inspectBlueprintNodeById,
 triggerUnlockSelectedJinshenNode, triggerUpgradeOrUnlockSelectedNode, handleCanvasMouseDown, handleCanvasWheel, handleZoomCanvas,
 resetCanvasView, fitAllZonesCanvasView, focusCpuCore, rotateCpuBlueprintTopology, filterJinshenNodes, debugUnlockAllCpuSystem,
 confirmParagonParamLock, triggerParagonPulseOvercharge, jumpToZone, selectBlueprintZone, spawnBlueprintNode, setInputFlowRate,
 demoFactoryLivingOptimalCircuit, selectInputNodeMaterial, getCpuGlobalBuffs, updateBlueprintMonitorStats, toggleSplitterRatio, toggleModeSwitch
].forEach(f => { window[f.name] = f; });
