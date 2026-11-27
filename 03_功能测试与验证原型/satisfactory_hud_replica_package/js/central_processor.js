// =========================================================================
// js/central_processor.js - 中央处理器 · 四大母板 × 50+ 工业节点 × 金身突破节点 × 宗门法令
// 设计：
//  1. 四大母板（战斗/生产/辅助/研发），原有 50+ 工业调配节点与研发芯片全部保留
//  2. 金身突破节点作为"实体节点"嵌入对应母板：先消耗背包材料激活，再拉线接入该母板核心的空闲插座才生效
//  3. 核心插座数量有限 + 全局算力上限 100 FLOPS => 取舍 (BUILD)
//  4. 宗门四大法令：全局自选，附带收益与代价
// =========================================================================

// ---------------- 1. 宗门四大法令 ----------------
const CPU_DECREE_CONFIGS = {
  decree_metal_flesh: {
    id: 'decree_metal_flesh', name: '血肉苦弱 · 机械飞升', color: '#f59e0b',
    buffDesc: '采矿与精炼炉速度 +50%，全厂电耗 -20%',
    penaltyDesc: '无法激活/接入【妖兽生化系】金身节点',
    bonus: { mine: 50, smelt: 50 }, disabledCategories: ['yaoshou']
  },
  decree_all_spirit: {
    id: 'decree_all_spirit', name: '万物化灵 · 天罡道轨', color: '#38bdf8',
    buffDesc: '传送带流速 +100%，飞剑杀伤 +30%，飞剑移速 +40%',
    penaltyDesc: '全厂发电机燃料消耗增加 25%',
    bonus: { belt: 100, sword: 30 }
  },
  decree_overclock_dao: {
    id: 'decree_overclock_dao', name: '极阳过载 · 狂暴天道', color: '#ef4444',
    buffDesc: '采矿/冶炼/带速/耐烧 全部 +80%',
    penaltyDesc: 'CPU 发热：算力上限 100 → 85 FLOPS',
    bonus: { mine: 80, smelt: 80, belt: 80, burn: 80 }, capPenalty: 15
  },
  decree_balance_wuxing: {
    id: 'decree_balance_wuxing', name: '五行混元 · 周天平抑', color: '#10b981',
    buffDesc: '所有接入 CPU 的金身节点效果额外 +35%',
    penaltyDesc: '无直接面板加成，需要多接金身节点才划算',
    bonus: {}, jinshenMult: 1.35
  }
};

// ---------------- 2. 核心状态 ----------------
const CPU_BLUEPRINT_STATE = {
  zoom: 0.72, panX: 0, panY: 0, rotation: 0,
  activeZoneId: 'zone2',
  activeDecree: 'decree_metal_flesh',
  currentFlowRate: 1000,
  baseComputeCap: 100,
  zones: {
    zone1: {
      id: 'zone1', name: '1. 战斗类型', shortName: '战斗', themeColor: '#ef4444', icon: 'fa-solid fa-khanda',
      rect: { x: 80, y: 220, width: 950, height: 960 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片/金身节点接入战斗总核心 4 个插座',
      inputMaterials: { '玄铁齿轮': { signal: 60 }, '灵磁齿轮': { signal: 100 }, '法宝阵图胚': { signal: 250 } }
    },
    zone2: {
      id: 'zone2', name: '2. 生产类型', shortName: '生产', themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
      rect: { x: 1080, y: 220, width: 2000, height: 980 }, unlocked: true, satisfied: false,
      coreRequirement: '50+ 节点网络满足 4 大提速口，剩余 2 插座留给金身节点',
      inputMaterials: {}
    },
    zone3: {
      id: 'zone3', name: '3. 辅助类型', shortName: '辅助', themeColor: '#38bdf8', icon: 'fa-solid fa-person-running',
      rect: { x: 3120, y: 220, width: 950, height: 960 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片/金身节点接入辅助总核心 4 个插座',
      inputMaterials: { '铜线': { signal: 40 }, '导电线圈': { signal: 100 }, '电能核心': { signal: 200 } }
    },
    zone4: {
      id: 'zone4', name: '4. 研发类型', shortName: '研发', themeColor: '#10b981', icon: 'fa-solid fa-flask',
      rect: { x: 1080, y: 1250, width: 2000, height: 800 }, unlocked: true, satisfied: false,
      coreRequirement: '芯片接入研发总核心 4 个插座',
      inputMaterials: { '基础控制模块': { signal: 50 }, '电子生物芯片': { signal: 175 } }
    }
  },
  nodes: [], wires: [],
  connectingPin: null,
  draggingNodeId: null, dragStartMouse: { x: 0, y: 0 }, initialNodePos: { x: 0, y: 0 },
  isPanning: false, panStartMouse: { x: 0, y: 0 }, initialPanPos: { x: 0, y: 0 },
  selectedEntity: null,
  buffs: {}, computeLoad: 0, computeCap: 100
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
  { id: 'z2_jinshen_drill', zoneId: 'zone2', name: '庚金灵磁超频', category: 'industry', catName: '工业狂暴系', icon: 'fa-solid fa-trowel-bricks', themeColor: '#eab308', x: 1500, y: 1010, buffText: '全厂采矿速度 +60%', effects: { mineSpeed: 60 }, computeCost: 14, cost: [{ name: '电子生物芯片', need: 3 }, { name: '导电线圈', need: 12 }], desc: '灵磁抗扰回路，允许全厂采矿机极限高频运转。' },
  { id: 'z2_jinshen_smelt', zoneId: 'zone2', name: '离火生化催化', category: 'industry', catName: '工业狂暴系', icon: 'fa-solid fa-fire', themeColor: '#ef4444', x: 1780, y: 1010, prereq: 'z2_jinshen_drill', buffText: '全厂精炼炉冶炼速率 +55%', effects: { smeltSpeed: 55 }, computeCost: 14, cost: [{ name: '鲜活组织', need: 8 }, { name: '赤铜锭', need: 30 }], desc: '以活性生物质助燃三昧神火，极限拉升熔炼效率。' },
  { id: 'z2_jinshen_tissue', zoneId: 'zone2', name: '鲜活经脉重构', category: 'yaoshou', catName: '妖兽生化系', icon: 'fa-solid fa-dna', themeColor: '#10b981', x: 2060, y: 1010, buffText: '全厂传送带带速 +60%', effects: { beltSpeed: 60 }, computeCost: 14, cost: [{ name: '鲜活组织', need: 10 }, { name: '电子生物芯片', need: 3 }], desc: '将修士活性神经束铺入导轨，物流如经络般自如流淌。' },
  { id: 'z2_jinshen_heal', zoneId: 'zone2', name: '荒兽自愈神髓', category: 'yaoshou', catName: '妖兽生化系', icon: 'fa-solid fa-heart-pulse', themeColor: '#059669', x: 2340, y: 1010, prereq: 'z2_jinshen_tissue', buffText: '护体罡气 +200，自愈恢复', effects: { armor: 200 }, computeCost: 12, cost: [{ name: '鲜活组织', need: 12 }, { name: '基础控制模块', need: 6 }], desc: '融合异星荒兽强横生机，肉身重创瞬间愈合。' },
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
  const Y6 = [280, 390, 500, 680, 790, 900];
  const Y4 = [350, 490, 690, 830];

  // ---------- 战斗母板 (zone1) ----------
  N.push(_mkNode({ id: 'z1_input_a', zoneId: 'zone1', type: 'input', name: '供料口', category: '进料口', x: 120, y: 520, width: 140, themeColor: '#ef4444', icon: 'fa-solid fa-arrow-right-to-bracket', material: '玄铁齿轮', signalOut: 60, outPins: [_pin('out_a', '出', '#ef4444')] }));
  N.push(_mkNode({ id: 'z1_chip_armor', zoneId: 'zone1', type: 'chip', chipKey: 'chip_armor', level: 1, name: '护甲加成芯片', category: '加护甲', x: 330, y: 400, width: 140, themeColor: '#ef4444', icon: 'fa-solid fa-shield-halved', inPins: [_pin('in', '进', '#ef4444')], outPins: [_pin('out', '出', '#ef4444')] }));
  N.push(_mkNode({ id: 'z1_chip_blade', zoneId: 'zone1', type: 'chip', chipKey: 'chip_blade', level: 1, name: '飞剑伤害芯片', category: '加伤害', x: 330, y: 620, width: 140, themeColor: '#f97316', icon: 'fa-solid fa-burst', inPins: [_pin('in', '进', '#f97316')], outPins: [_pin('out', '出', '#f97316')] }));
  N.push(_mkNode({ id: 'z1_core', zoneId: 'zone1', type: 'core', name: '战斗总核心', category: '总核心', x: 740, y: 470, width: 190, themeColor: '#ef4444', icon: 'fa-solid fa-khanda',
    inPins: [_pin('in_1', '① 护甲插座', '#ef4444', 1), _pin('in_2', '② 飞剑插座', '#f97316', 1), _pin('in_3', '③ 金身插座', '#fbbf24', 1), _pin('in_4', '④ 金身插座', '#fbbf24', 1)] }));

  // ---------- 生产母板 (zone2) · 全部 54 个原始节点 ----------
  const g = (c) => [_pin('in', '进', c)];
  N.push(_mkNode({ id: 'z2_input_a', zoneId: 'zone2', type: 'input', name: '供料口 A', category: '进料口', x: 1100, y: 380, width: 140, themeColor: '#f59e0b', icon: 'fa-solid fa-arrow-right-to-bracket', material: '耐火炉芯', signalOut: 500, outPins: [_pin('out_a', '出', '#f59e0b')] }));
  N.push(_mkNode({ id: 'z2_input_b', zoneId: 'zone2', type: 'input', name: '供料口 B', category: '进料口', x: 1100, y: 780, width: 140, themeColor: '#f59e0b', icon: 'fa-solid fa-arrow-right-to-bracket', material: '精炼玄铁锭', signalOut: 500, outPins: [_pin('out_a', '出', '#f59e0b')] }));
  const spDef = [['z2_sp_a1', 1, 340], ['z2_sp_a2', 2, 460], ['z2_sp_b1', 3, 740], ['z2_sp_b2', 4, 860]];
  spDef.forEach(d => N.push(_mkNode({ id: d[0], zoneId: 'zone2', type: 'branch', name: `分流器 ${d[1]}号`, category: '1进2出', x: 1250, y: d[2], width: 115, themeColor: '#00f0ff', icon: 'fa-solid fa-code-branch', inPins: g('#00f0ff'), outPins: [_pin('out_a', '出1', '#00f0ff'), _pin('out_b', '出2', '#00f0ff')] })));
  Y6.forEach((y, i) => N.push(_mkNode({ id: `z2_vl_${i + 1}`, zoneId: 'zone2', type: 'valve', name: `限流阀 ${i + 1}号`, category: '卡上限', x: 1390, y, width: 115, themeColor: '#14b8a6', icon: 'fa-solid fa-filter', maxFlow: 80, inPins: g('#14b8a6'), outPins: [_pin('out', '出', '#14b8a6')] })));
  Y6.forEach((y, i) => N.push(_mkNode({ id: `z2_st_${i + 1}`, zoneId: 'zone2', type: 'stabilizer', name: `加速泵 ${i + 1}号`, category: '微加速', x: 1530, y, width: 110, themeColor: '#10b981', icon: 'fa-solid fa-battery-full', inPins: g('#10b981'), outPins: [_pin('out', '出', '#10b981')] })));
  [310, 440, 570, 710, 820, 920].forEach((y, i) => N.push(_mkNode({ id: `z2_mg_${i + 1}`, zoneId: 'zone2', type: 'merger', name: `并线器 ${i + 1}号`, category: '2合1', x: 1670, y, width: 115, themeColor: '#38bdf8', icon: 'fa-solid fa-arrows-to-dot', inPins: [_pin('in_1', '进1', '#38bdf8'), _pin('in_2', '进2', '#38bdf8')], outPins: [_pin('out', '出', '#38bdf8')] })));
  [340, 500, 680, 840].forEach((y, i) => N.push(_mkNode({ id: `z2_amp_${i + 1}`, zoneId: 'zone2', type: 'amplifier', name: `双料翻倍器 ${'ABCD'[i]}`, category: '两料翻倍', x: 1810, y, width: 125, themeColor: '#c084fc', icon: 'fa-solid fa-atom', inPins: [_pin('in_1', '料1', '#f59e0b'), _pin('in_2', '料2', '#38bdf8')], outPins: [_pin('out', '出', '#c084fc')] })));
  [310, 420, 530, 650, 770, 880].forEach((y, i) => N.push(_mkNode({ id: `z2_sp2_${i + 1}`, zoneId: 'zone2', type: 'branch', name: `分流器 ${i + 5}号`, category: '1进2出', x: 1960, y, width: 115, themeColor: '#00f0ff', icon: 'fa-solid fa-code-branch', inPins: g('#00f0ff'), outPins: [_pin('out_a', '出1', '#00f0ff'), _pin('out_b', '出2', '#00f0ff')] })));
  Y4.forEach((y, i) => N.push(_mkNode({ id: `z2_lp_${i + 1}`, zoneId: 'zone2', type: 'stabilizer', isLoop: true, name: `循环加速器 ${i + 1}号`, category: '循环回流', x: 2100, y, width: 110, themeColor: '#10b981', icon: 'fa-solid fa-rotate', inPins: g('#10b981'), outPins: [_pin('out', '出', '#10b981')] })));
  const mgNames = ['采矿汇流管', '冶炼汇流管', '耐烧汇流管', '带速汇流管'];
  const fNames = ['采矿大翻倍器', '冶炼大翻倍器', '耐烧大翻倍器', '带速大翻倍器'];
  const tCol = ['#f59e0b', '#ea580c', '#f97316', '#10b981'];
  Y4.forEach((y, i) => N.push(_mkNode({ id: `z2_main_mg${i + 1}`, zoneId: 'zone2', type: 'merger', name: mgNames[i], category: '总汇流', x: 2250, y, width: 120, themeColor: tCol[i], icon: 'fa-solid fa-arrows-to-dot', inPins: [_pin('in_1', '进1', tCol[i]), _pin('in_2', '进2', tCol[i])], outPins: [_pin('out', '出', tCol[i])] })));
  Y4.forEach((y, i) => N.push(_mkNode({ id: `z2_final_amp${i + 1}`, zoneId: 'zone2', type: 'amplifier', name: fNames[i], category: '大翻倍', x: 2400, y, width: 125, themeColor: tCol[i], icon: 'fa-solid fa-chart-line', inPins: [_pin('in_1', '进1', tCol[i]), _pin('in_2', '进2', tCol[i])], outPins: [_pin('out', '出', tCol[i])] })));
  const tgt = [['mine', '★ 采矿提速口', 'fa-solid fa-trowel-bricks', 100], ['smelt', '★ 冶炼提速口', 'fa-solid fa-fire', 120], ['burn', '★ 燃料耐烧口', 'fa-solid fa-fire-flame-curved', 150], ['belt', '★ 传送带速口', 'fa-solid fa-bolt', 90]];
  tgt.forEach((t, i) => N.push(_mkNode({ id: `z2_target_${t[0]}`, zoneId: 'zone2', type: 'buff_' + t[0], buffKey: t[0], name: t[1], category: '提速目标', x: 2570, y: Y4[i], width: 130, themeColor: tCol[i], icon: t[2], flowCost: 20, bonus: t[3], computeCost: 8, inPins: g(tCol[i]), outPins: [_pin('out', '入核心', '#ffd700', 1)] })));
  N.push(_mkNode({ id: 'z2_core', zoneId: 'zone2', type: 'core', name: '生产总核心', category: '总核心', x: 2760, y: 560, width: 200, themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
    inPins: [_pin('in_1', '① 采矿插座', '#f59e0b', 1), _pin('in_2', '② 冶炼插座', '#ea580c', 1), _pin('in_3', '③ 耐烧插座', '#fbbf24', 1), _pin('in_4', '④ 带速插座', '#10b981', 1), _pin('in_5', '⑤ 金身插座', '#fde047', 1), _pin('in_6', '⑥ 金身插座', '#fde047', 1)] }));

  // ---------- 辅助母板 (zone3) ----------
  N.push(_mkNode({ id: 'z3_input_a', zoneId: 'zone3', type: 'input', name: '供料口', category: '进料口', x: 3150, y: 520, width: 140, themeColor: '#38bdf8', icon: 'fa-solid fa-arrow-right-to-bracket', material: '导电线圈', signalOut: 100, outPins: [_pin('out_a', '出', '#38bdf8')] }));
  N.push(_mkNode({ id: 'z3_chip_bag', zoneId: 'zone3', type: 'chip', chipKey: 'chip_bag', level: 1, name: '背包扩容芯片', category: '加背包', x: 3360, y: 400, width: 140, themeColor: '#38bdf8', icon: 'fa-solid fa-box-archive', inPins: [_pin('in', '进', '#38bdf8')], outPins: [_pin('out', '出', '#38bdf8')] }));
  N.push(_mkNode({ id: 'z3_chip_speed', zoneId: 'zone3', type: 'chip', chipKey: 'chip_speed', level: 1, name: '跑步移速芯片', category: '加跑速', x: 3360, y: 620, width: 140, themeColor: '#06b6d4', icon: 'fa-solid fa-person-running', inPins: [_pin('in', '进', '#06b6d4')], outPins: [_pin('out', '出', '#06b6d4')] }));
  N.push(_mkNode({ id: 'z3_core', zoneId: 'zone3', type: 'core', name: '辅助总核心', category: '总核心', x: 3790, y: 470, width: 190, themeColor: '#38bdf8', icon: 'fa-solid fa-bolt',
    inPins: [_pin('in_1', '① 背包插座', '#38bdf8', 1), _pin('in_2', '② 移速插座', '#06b6d4', 1), _pin('in_3', '③ 金身插座', '#fbbf24', 1), _pin('in_4', '④ 金身插座', '#fbbf24', 1)] }));

  // ---------- 研发母板 (zone4) ----------
  N.push(_mkNode({ id: 'z4_input_a', zoneId: 'zone4', type: 'input', name: '供料口', category: '进料口', x: 1120, y: 1560, width: 140, themeColor: '#10b981', icon: 'fa-solid fa-arrow-right-to-bracket', material: '基础控制模块', signalOut: 50, outPins: [_pin('out_a', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z4_chip_tech', zoneId: 'zone4', type: 'chip', chipKey: 'chip_tech', level: 1, name: '科技研发芯片', category: '加研发', x: 1420, y: 1440, width: 140, themeColor: '#10b981', icon: 'fa-solid fa-network-wired', inPins: [_pin('in', '进', '#10b981')], outPins: [_pin('out', '出', '#10b981')] }));
  N.push(_mkNode({ id: 'z4_chip_save', zoneId: 'zone4', type: 'chip', chipKey: 'chip_save', level: 1, name: '节电节能芯片', category: '降电耗', x: 1420, y: 1680, width: 140, themeColor: '#059669', icon: 'fa-solid fa-leaf', inPins: [_pin('in', '进', '#059669')], outPins: [_pin('out', '出', '#059669')] }));
  N.push(_mkNode({ id: 'z4_core', zoneId: 'zone4', type: 'core', name: '研发总核心', category: '总核心', x: 2050, y: 1540, width: 190, themeColor: '#10b981', icon: 'fa-solid fa-flask',
    inPins: [_pin('in_1', '① 研发插座', '#10b981', 1), _pin('in_2', '② 节电插座', '#059669', 1), _pin('in_3', '③ 备用插座', '#fbbf24', 1), _pin('in_4', '④ 备用插座', '#a855f7', 1)] }));

  // ---------- 金身突破节点 ----------
  CPU_JINSHEN_NODES_DATA.forEach(d => {
    const n = JSON.parse(JSON.stringify(d));
    n.type = 'jinshen'; n.isJinshen = true; n.activated = false; n.width = 210;
    n.outPins = [_pin('out', '接CPU', '#ffd700', 1)];
    N.push(_mkNode(n));
  });
  return N;
}

function buildPresetWires() {
  const W = [];
  const w = (a, ap, b, bp, color, gold) => W.push({ id: `w_${a}_${ap}_${b}_${bp}`, fromNode: a, fromPin: ap, toNode: b, toPin: bp, color, isGold: !!gold });
  // 生产母板
  w('z2_input_a', 'out_a', 'z2_sp_a1', 'in', '#f59e0b'); w('z2_input_a', 'out_a', 'z2_sp_a2', 'in', '#f59e0b');
  w('z2_input_b', 'out_a', 'z2_sp_b1', 'in', '#38bdf8'); w('z2_input_b', 'out_a', 'z2_sp_b2', 'in', '#38bdf8');
  w('z2_sp_a1', 'out_a', 'z2_vl_1', 'in', '#14b8a6'); w('z2_sp_a1', 'out_b', 'z2_vl_2', 'in', '#14b8a6');
  w('z2_sp_a2', 'out_a', 'z2_vl_3', 'in', '#14b8a6'); w('z2_sp_a2', 'out_b', 'z2_mg_2', 'in_2', '#f59e0b');
  w('z2_sp_b1', 'out_a', 'z2_vl_4', 'in', '#14b8a6'); w('z2_sp_b1', 'out_b', 'z2_vl_5', 'in', '#14b8a6');
  w('z2_sp_b2', 'out_a', 'z2_vl_6', 'in', '#14b8a6'); w('z2_sp_b2', 'out_b', 'z2_mg_3', 'in_2', '#38bdf8');
  for (let i = 1; i <= 6; i++) w(`z2_vl_${i}`, 'out', `z2_st_${i}`, 'in', '#10b981');
  w('z2_st_1', 'out', 'z2_mg_1', 'in_1', '#38bdf8'); w('z2_st_2', 'out', 'z2_mg_1', 'in_2', '#38bdf8');
  w('z2_st_3', 'out', 'z2_mg_2', 'in_1', '#38bdf8'); w('z2_st_4', 'out', 'z2_mg_3', 'in_1', '#38bdf8');
  w('z2_st_5', 'out', 'z2_mg_4', 'in_1', '#38bdf8'); w('z2_st_6', 'out', 'z2_mg_4', 'in_2', '#38bdf8');
  w('z2_st_3', 'out', 'z2_mg_5', 'in_1', '#38bdf8'); w('z2_st_4', 'out', 'z2_mg_5', 'in_2', '#38bdf8');
  w('z2_st_5', 'out', 'z2_mg_6', 'in_1', '#38bdf8'); w('z2_st_6', 'out', 'z2_mg_6', 'in_2', '#38bdf8');
  w('z2_mg_1', 'out', 'z2_amp_1', 'in_1', '#c084fc'); w('z2_mg_2', 'out', 'z2_amp_1', 'in_2', '#c084fc');
  w('z2_mg_3', 'out', 'z2_amp_2', 'in_1', '#c084fc'); w('z2_mg_4', 'out', 'z2_amp_2', 'in_2', '#c084fc');
  w('z2_mg_5', 'out', 'z2_amp_3', 'in_1', '#c084fc'); w('z2_mg_6', 'out', 'z2_amp_3', 'in_2', '#c084fc');
  w('z2_mg_3', 'out', 'z2_amp_4', 'in_1', '#c084fc'); w('z2_mg_6', 'out', 'z2_amp_4', 'in_2', '#c084fc');
  w('z2_amp_1', 'out', 'z2_sp2_1', 'in', '#00f0ff'); w('z2_amp_1', 'out', 'z2_sp2_2', 'in', '#00f0ff');
  w('z2_amp_2', 'out', 'z2_sp2_3', 'in', '#00f0ff'); w('z2_amp_3', 'out', 'z2_sp2_4', 'in', '#00f0ff');
  w('z2_amp_4', 'out', 'z2_sp2_5', 'in', '#00f0ff'); w('z2_amp_4', 'out', 'z2_sp2_6', 'in', '#00f0ff');
  w('z2_sp2_1', 'out_a', 'z2_lp_1', 'in', '#10b981'); w('z2_sp2_3', 'out_a', 'z2_lp_2', 'in', '#10b981');
  w('z2_sp2_4', 'out_a', 'z2_lp_3', 'in', '#10b981'); w('z2_sp2_6', 'out_a', 'z2_lp_4', 'in', '#10b981');
  w('z2_sp2_1', 'out_b', 'z2_main_mg1', 'in_1', '#f59e0b'); w('z2_lp_1', 'out', 'z2_main_mg1', 'in_2', '#f59e0b');
  w('z2_sp2_2', 'out_a', 'z2_main_mg2', 'in_1', '#ea580c'); w('z2_lp_2', 'out', 'z2_main_mg2', 'in_2', '#ea580c');
  w('z2_sp2_4', 'out_b', 'z2_main_mg3', 'in_1', '#f97316'); w('z2_lp_3', 'out', 'z2_main_mg3', 'in_2', '#f97316');
  w('z2_sp2_5', 'out_a', 'z2_main_mg4', 'in_1', '#10b981'); w('z2_lp_4', 'out', 'z2_main_mg4', 'in_2', '#10b981');
  const tc = ['#f59e0b', '#ea580c', '#f97316', '#10b981'];
  for (let i = 1; i <= 4; i++) {
    w(`z2_main_mg${i}`, 'out', `z2_final_amp${i}`, 'in_1', tc[i - 1]);
    w(`z2_lp_${i}`, 'out', `z2_final_amp${i}`, 'in_2', tc[i - 1]);
  }
  ['mine', 'smelt', 'burn', 'belt'].forEach((k, i) => {
    w(`z2_final_amp${i + 1}`, 'out', `z2_target_${k}`, 'in', tc[i]);
    w(`z2_target_${k}`, 'out', 'z2_core', `in_${i + 1}`, '#ffd700', 1);
  });
  // 战斗/辅助/研发
  w('z1_input_a', 'out_a', 'z1_chip_armor', 'in', '#ef4444'); w('z1_input_a', 'out_a', 'z1_chip_blade', 'in', '#f97316');
  w('z1_chip_armor', 'out', 'z1_core', 'in_1', '#ffd700', 1); w('z1_chip_blade', 'out', 'z1_core', 'in_2', '#ffd700', 1);
  w('z3_input_a', 'out_a', 'z3_chip_bag', 'in', '#38bdf8'); w('z3_input_a', 'out_a', 'z3_chip_speed', 'in', '#06b6d4');
  w('z3_chip_bag', 'out', 'z3_core', 'in_1', '#ffd700', 1); w('z3_chip_speed', 'out', 'z3_core', 'in_2', '#ffd700', 1);
  w('z4_input_a', 'out_a', 'z4_chip_tech', 'in', '#10b981'); w('z4_input_a', 'out_a', 'z4_chip_save', 'in', '#059669');
  w('z4_chip_tech', 'out', 'z4_core', 'in_1', '#ffd700', 1); w('z4_chip_save', 'out', 'z4_core', 'in_2', '#ffd700', 1);
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
      case 'branch': v = pinIn(n.id, 'in') / 2; break;
      case 'valve': v = Math.min(pinIn(n.id, 'in'), n.maxFlow || 80); break;
      case 'stabilizer': v = pinIn(n.id, 'in') * (n.isLoop ? 1.15 : 1.05); break;
      case 'merger': v = pinIn(n.id, 'in_1') + pinIn(n.id, 'in_2'); break;
      case 'amplifier': { const a = pinIn(n.id, 'in_1'), b = pinIn(n.id, 'in_2'); v = (a > 0 && b > 0) ? (a + b) / 2 * 1.8 : (a + b) * 0.5; break; }
      case 'jinshen': v = (n.activated && !isJinshenDisabled(n)) ? 1 : 0; break;
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
    if (n.type === 'jinshen') n.isWorking = !!n.activated && !isJinshenDisabled(n);
    else if (n.type === 'input') n.isWorking = (n.signalOut || 0) > 0;
    else if (n.type && n.type.startsWith('buff_')) n.isWorking = sIn >= (n.flowCost || 20);
    else if (n.type === 'core') n.isWorking = true;
    else if (n.type === 'amplifier') n.isWorking = n.sigOut > 0;
    else n.isWorking = sIn > 0;
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
        const e = src.effects || {};
        if (e.armor) B.armorFlat += Math.round(e.armor * jm);
        if (e.dmgReduction) B.armorPct += Math.round(e.dmgReduction * jm);
        if (e.swordDmg) B.sword += Math.round(e.swordDmg * jm);
        if (e.mineSpeed) B.mine += Math.round(e.mineSpeed * jm);
        if (e.smeltSpeed) B.smelt += Math.round(e.smeltSpeed * jm);
        if (e.beltSpeed) B.belt += Math.round(e.beltSpeed * jm);
        if (e.bagSlots) B.bag += Math.round(e.bagSlots * jm);
        if (e.speed) B.speed += Math.round(e.speed * jm);
      }
    });
  });
  Object.keys(dec.bonus || {}).forEach(k => { B[k] = (B[k] || 0) + dec.bonus[k]; });
  S.buffs = B;
  S.computeLoad = load;
  S.computeCap = S.baseComputeCap - (dec.capPenalty || 0);
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
    <!-- 中央通天主干 (生产母板 ➔ 研发母板) -->
    <path d="M 2080 1200 L 2080 1250" stroke="url(#treeTrunkGrad)" stroke-width="8" opacity="0.9"/>
    <path d="M 2080 1200 L 2080 1250" stroke="#00f0ff" stroke-width="2.5" class="world-tree-pulse-line"/>
    <path d="M 2080 2050 L 2080 2340" stroke="#10b981" stroke-width="6" opacity="0.8"/>
    <path d="M 2080 2050 L 2080 2340" stroke="#fff" stroke-width="1.5" class="world-tree-pulse-line"/>
    <polygon points="2066,2150 2094,2150 2098,2250 2062,2250" fill="#08101a" stroke="#00f0ff" stroke-width="3"/>
    <polygon points="2070,2155 2090,2155 2093,2245 2067,2245" fill="url(#chokeGrad)" opacity="0.75"/>
    <circle cx="2080" cy="2300" r="12" fill="#070b13" stroke="#10b981" stroke-width="3"/><circle cx="2080" cy="2300" r="4" fill="#10b981"/>
    <!-- 西翼：战斗母板 ⇄ 生产母板 -->
    <path d="M 1030 600 L 1055 600 L 1080 575" fill="none" stroke="#38bdf8" stroke-width="6" opacity="0.85"/>
    <path d="M 1030 600 L 1055 600 L 1080 575" fill="none" stroke="#00f0ff" stroke-width="2.5" class="world-tree-pulse-line"/>
    <path d="M 1030 760 L 1055 760 L 1080 735" fill="none" stroke="#38bdf8" stroke-width="3.5" opacity="0.7"/>
    <!-- 东翼：生产母板 ⇄ 辅助母板 -->
    <path d="M 3080 600 L 3100 600 L 3120 620" fill="none" stroke="#a855f7" stroke-width="6" opacity="0.85"/>
    <path d="M 3080 600 L 3100 600 L 3120 620" fill="none" stroke="#c084fc" stroke-width="2.5" class="world-tree-pulse-line"/>
    <path d="M 3080 760 L 3100 760 L 3120 740" fill="none" stroke="#a855f7" stroke-width="3.5" opacity="0.7"/>
    <!-- 顶部苍穹探针 -->
    <path d="M 2080 220 L 2080 120" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.8"/>
    <circle cx="2080" cy="120" r="7" fill="#070b13" stroke="#f59e0b" stroke-width="2.5"/><circle cx="2080" cy="120" r="2.5" fill="#f59e0b"/>
    <path d="M 1960 220 L 1960 160 L 1900 100" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.7"/>
    <path d="M 2200 220 L 2200 160 L 2260 100" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.7"/>`;
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
  return `<div id="pin_${node.id}_${p.id}" class="bp-pin ${isIn ? 'bp-pin-in' : 'bp-pin-out'}" style="${extraStyle || ''}"
    onclick="handleBlueprintPinClick('${node.id}','${p.id}','${type}',event);" title="${p.label}">
    <span class="w-1.5 h-1.5 rounded-full ${act ? 'bg-emerald-400' : (p.isGold ? 'bg-amber-300' : (isIn ? 'bg-cyan-300' : 'bg-amber-300'))}"></span></div>`;
}
function _fmtSig(v) { return v >= 100 ? Math.round(v) : (Math.round(v * 10) / 10); }

function nodeCardHtml(node) {
  const S = CPU_BLUEPRINT_STATE;
  const sel = S.selectedEntity === node.id;
  const w = node.width || 120;
  const base = `id="node_${node.id}" onmousedown="startDragBlueprintNode('${node.id}', event);" style="position:absolute;left:${node.x}px;top:${node.y}px;width:${w}px;pointer-events:auto;${sel ? 'outline:2px solid #00f0ff;' : ''}"`;
  const ins = node.inPins || [], outs = node.outPins || [];
  const inEl = (node.type !== 'core' && ins.length) ? `<div class="absolute top-0 bottom-0 flex flex-col justify-around py-2 z-30" style="left:-10px" onmousedown="event.stopPropagation();">${ins.map(p => _pinDot(node, p, 'in')).join('')}</div>` : '';
  const outEl = outs.length ? `<div class="absolute top-0 bottom-0 flex flex-col justify-around py-2 z-30" style="right:-10px" onmousedown="event.stopPropagation();">${outs.map(p => _pinDot(node, p, 'out')).join('')}</div>` : '';

  if (node.type === 'core') {
    const rows = ins.map(p => {
      const src = node.socketSource && node.socketSource[p.id];
      const act = node.activeSockets && node.activeSockets[p.id];
      return `<div class="relative flex justify-between items-center h-[18px] text-[9px] font-mono ${act ? 'text-emerald-300 font-bold' : (src ? 'text-amber-300' : 'text-white/40')}">
        ${_pinDot(node, p, 'in', 'position:absolute;left:-22px;top:50%;transform:translateY(-50%);')}
        <span>${p.label}</span><span class="truncate max-w-[90px]">${src ? (act ? '✓ ' : '△ ') + src.name : '○ 待接入'}</span></div>`;
    }).join('');
    const used = Object.keys(node.socketSource || {}).length;
    return `<div ${base} class="bp-node-card pcb-ic-package group cursor-move" >
      <div style="border:2px solid ${node.themeColor};background:#0c121e;border-radius:12px;box-shadow:0 0 28px ${node.themeColor}55;">
        <div class="h-7 px-3 flex items-center justify-between bg-black/50 rounded-t-xl pointer-events-none border-b border-white/10">
          <span class="text-[11px] font-black font-mono text-amber-300"><i class="${node.icon} mr-1"></i>${node.name}</span>
          <span class="text-[9px] font-mono text-cyan-300">${used}/${ins.length} 插座</span></div>
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
    body = `<div class="text-[8.5px] font-mono text-white/70 pointer-events-none">${node.material}</div><div class="text-[9px] font-mono text-cyan-300 font-bold pointer-events-none">${_fmtSig(node.signalOut || 0)}/分</div>${btns ? `<div class="flex flex-wrap gap-0.5 mt-0.5">${btns}</div>` : ''}`;
  } else if (node.type === 'chip') {
    const lv = getChipLevelCfg(node);
    body = `<div class="text-[9px] font-mono text-amber-300 font-bold pointer-events-none">Lv.${node.level} · ${lv ? lv.bonusText : ''}</div><div class="text-[8px] font-mono text-white/50 pointer-events-none">算力 ${lv ? lv.compute : 0} FLOPS</div>`;
  } else if (node.type === 'jinshen') {
    const dis = isJinshenDisabled(node);
    const st = dis ? '<span class="text-red-300">法令禁用</span>' : (node.activated ? '<span class="text-emerald-300 font-bold">● 已激活·可拉线</span>' : '<span class="text-white/50">○ 待材料激活</span>');
    body = `<div class="text-[8.5px] text-amber-200 font-sans leading-tight pointer-events-none">${node.buffText}</div><div class="text-[8px] font-mono mt-0.5 pointer-events-none">${st} · 算力${node.computeCost}</div>`;
  } else if (node.type && node.type.startsWith('buff_')) {
    body = `<div class="text-[9px] font-mono pointer-events-none ${working ? 'text-emerald-300' : 'text-rose-300'} font-bold">${working ? '✓' : '✗'} 全厂+${node.bonus}% · 需${node.flowCost}</div><div class="text-[8px] font-mono text-white/50 pointer-events-none">流量 ${_fmtSig(node.sigIn || 0)}</div>`;
  } else {
    const desc = { branch: '对半平分 50%', merger: '合流相加', valve: `最多过 ${node.maxFlow}/分`, stabilizer: node.isLoop ? '回流 ×1.15' : '提速 ×1.05', amplifier: node.name.includes('大') ? '大翻倍 ×1.8~' : '双料齐进 ×1.8' }[node.type] || '';
    body = `<div class="text-[8.5px] font-mono text-white/60 pointer-events-none">${desc}</div><div class="text-[9px] font-mono font-bold pointer-events-none ${working ? 'text-cyan-300' : 'text-white/30'}">${working ? _fmtSig(node.sigOut || 0) + '/分' : '无流量'}</div>`;
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
  const el = document.getElementById(`pin_${nodeId}_${pinId}`);
  const cont = document.getElementById('cpuWorldContainer');
  if (!el || !cont) return null;
  const pr = el.getBoundingClientRect(), cr = cont.getBoundingClientRect();
  const z = CPU_BLUEPRINT_STATE.zoom || 1;
  return { x: (pr.left + pr.width / 2 - cr.left) / z, y: (pr.top + pr.height / 2 - cr.top) / z };
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
  let h = '<defs><style>@keyframes cpuFlow2 { to { stroke-dashoffset: -36; } } .cpu-wire-live2 { stroke-dasharray: 8 10; animation: cpuFlow2 0.9s linear infinite; }</style></defs>';
  const byId = {}; S.nodes.forEach(n => { byId[n.id] = n; });
  S.wires.forEach((w, idx) => {
    const a = getBlueprintPinCoords(w.fromNode, w.fromPin), b = getBlueprintPinCoords(w.toNode, w.toPin);
    if (!a || !b) return;
    const f = byId[w.fromNode];
    const sig = (S.simByPinSignal && f) ? S.simByPinSignal.outOf(f, w.fromPin) / ((S.simFan && S.simFan[w.fromNode + '|' + w.fromPin]) || 1) : 0;
    const live = sig > 0.4;
    const col = w.isGold ? '#ffd700' : (w.color || (f && f.themeColor) || '#00f0ff');
    const d = _wirePath(a, b, _hash(w.id));
    h += `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w.isGold ? 4 : 3}" opacity="${live ? 0.9 : 0.28}" stroke-linejoin="round"/>`;
    if (live) h += `<path d="${d}" fill="none" stroke="#fff" stroke-width="1.4" class="cpu-wire-live2" opacity="0.85"/>`;
    h += `<path d="${d}" fill="none" stroke="transparent" stroke-width="12" style="pointer-events:stroke;cursor:pointer;" onclick="removeBlueprintWire(${idx});"><title>点击剪断此线</title></path>`;
    h += `<circle cx="${a.x}" cy="${a.y}" r="3" fill="${col}"/><circle cx="${b.x}" cy="${b.y}" r="3" fill="${col}"/>`;
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
  // 算力
  const load = S.computeLoad, cap = S.computeCap, over = load > cap;
  _setText('cpuComputeLoadText', `${load} / ${cap} FLOPS`);
  const bar = document.getElementById('cpuComputeLoadBar');
  if (bar) { bar.style.width = Math.min(100, load / cap * 100) + '%'; bar.className = `h-full transition-all duration-300 bg-gradient-to-r ${over ? 'from-red-500 to-orange-400' : 'from-cyan-400 to-emerald-400'}`; }
  const st = document.getElementById('cpuComputeLoadStatus');
  if (st) { st.textContent = over ? '⚠ 算力过载 · 无法再接入' : (load > cap * 0.8 ? '高负荷 · 谨慎取舍' : '稳定巡航 · 算力充裕'); st.className = `font-bold ${over ? 'text-red-400' : 'text-emerald-400'}`; }
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
    sc.innerHTML = core.inPins.map(p => {
      const src = core.socketSource && core.socketSource[p.id], act = core.activeSockets && core.activeSockets[p.id];
      return `<div class="flex justify-between ${act ? 'text-emerald-300' : (src ? 'text-amber-300' : 'text-white/35')}"><span>${p.label}</span><span class="truncate max-w-[130px]">${src ? (act ? '✓ ' : '△ ') + src.name : '○ 空闲'}</span></div>`;
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
// 10. 法令
// =========================================================================
function switchCpuDecree(id) {
  if (!CPU_DECREE_CONFIGS[id]) return;
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.activeDecree = id;
  // 被法令禁用的金身节点自动断开
  const dec = getActiveDecree();
  if (dec.disabledCategories) {
    const bad = CPU_BLUEPRINT_STATE.nodes.filter(n => n.isJinshen && dec.disabledCategories.includes(n.category)).map(n => n.id);
    CPU_BLUEPRINT_STATE.wires = CPU_BLUEPRINT_STATE.wires.filter(w => !bad.includes(w.fromNode));
  }
  updateDecreeUi();
  recomputeCpu();
  showNotification(`已颁布法令【${dec.name}】：${dec.buffDesc}｜代价：${dec.penaltyDesc}`);
}
function updateDecreeUi() {
  const dec = getActiveDecree();
  const map = { decree_metal_flesh: 'metal_flesh', decree_all_spirit: 'all_spirit', decree_overclock_dao: 'overclock_dao', decree_balance_wuxing: 'balance_wuxing' };
  Object.keys(map).forEach(id => {
    const b = document.getElementById('decreeBtn_' + map[id]); if (!b) return;
    const on = id === dec.id;
    b.className = 'px-2 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center space-x-1 border ' + (on ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-black/50 text-white/70 border-white/10 hover:text-white');
  });
  _setText('decreeTitle', dec.name); _setText('decreeBuffText', '✓ ' + dec.buffDesc); _setText('decreePenaltyText', '⚠ ' + dec.penaltyDesc);
}

// =========================================================================
// 11. 检视面板 / 芯片升级 / 金身激活
// =========================================================================
const NODE_TYPE_DESC = {
  input: '供料口：传送带运来的原料入口，决定网络的基础流量。',
  branch: '分流器：1 进 2 出，把流量对半平分。',
  merger: '并线器：2 进 1 出，两路流量相加。',
  valve: '限流阀：卡住流量上限，避免一条线抽干全网。',
  stabilizer: '加速泵/循环加速器：对通过的流量做小幅提速。',
  amplifier: '翻倍器：两路料同时进入才触发 ×1.8 暴击，缺一路只剩一半效率。',
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

  if (node.type === 'chip') {
    const cfg = CHIP_UPGRADE_CONFIGS[node.chipKey], cur = getChipLevelCfg(node), next = cfg.levels[node.level] || null;
    if (badge) { badge.classList.remove('hidden'); badge.textContent = `Lv.${node.level}/5`; }
    if (sec) sec.classList.remove('hidden');
    desc = `${cfg.name}：当前 ${cur.bonusText}，占用算力 ${cur.compute}。接入核心插座后生效。`;
    if (next) {
      if (prev) prev.textContent = `→ Lv.${next.level}: ${next.bonusText}`;
      if (costEl) costEl.innerHTML = _costCards(next.cost.map(c => ({ name: c.name, need: c.count })));
      if (btn) btn.disabled = false;
      if (btnT) btnT.textContent = `消耗材料升级至 Lv.${next.level}`;
    } else {
      if (prev) prev.textContent = 'MAX';
      if (costEl) costEl.innerHTML = '<div class="text-[10px] text-emerald-400 font-mono">已升至满级</div>';
      if (btnT) btnT.textContent = '已满级';
    }
  } else if (node.isJinshen) {
    if (sec) sec.classList.remove('hidden');
    const dis = isJinshenDisabled(node), pre = node.prereq ? S.nodes.find(n => n.id === node.prereq) : null;
    desc = `${node.desc}\n效果：${node.buffText}\n${pre ? '前置：' + pre.name + (pre.activated ? '（已激活）' : '（未激活）') : ''}${dis ? '\n⚠ 当前法令禁用此系金身节点' : ''}`;
    if (badge) { badge.classList.remove('hidden'); badge.textContent = node.activated ? '已激活' : '未激活'; }
    if (prev) prev.textContent = node.activated ? '请拉线接入核心插座' : '';
    if (costEl) costEl.innerHTML = node.activated ? '<div class="text-[10px] text-emerald-400 font-mono">材料已投入，拉出[接CPU]引脚连到本母板核心的金身插座</div>' : _costCards(node.cost);
    if (btnT) btnT.textContent = node.activated ? '已激活' : '消耗材料激活节点';
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
  if (from.zoneId !== to.zoneId) { showNotification('只能在同一母板内连线'); cancelBlueprintConnecting(); return; }
  if (S.wires.some(w => w.fromNode === fromId && w.fromPin === fromPin && w.toNode === toId && w.toPin === toPin)) { showNotification('该线路已存在'); cancelBlueprintConnecting(); return; }
  const old = S.wires.filter(w => w.toNode === toId && w.toPin === toPin);
  if (to.type === 'core') {
    if (from.isJinshen) {
      if (!from.activated) { showNotification(`【${from.name}】尚未激活！先消耗材料满足节点要求`); cancelBlueprintConnecting(); return; }
      if (isJinshenDisabled(from)) { showNotification('该节点被当前法令禁用'); cancelBlueprintConnecting(); return; }
    }
    // 同一来源不能重复占用多个插座
    if (S.wires.some(w => w.toNode === toId && w.fromNode === fromId && w.toPin !== toPin)) { showNotification('该节点已占用本核心的另一个插座'); cancelBlueprintConnecting(); return; }
    const oldSrc = old[0] ? S.nodes.find(n => n.id === old[0].fromNode) : null;
    const after = S.computeLoad - (oldSrc ? getNodeComputeCost(oldSrc) : 0) + getNodeComputeCost(from);
    if (after > S.computeCap) {
      showNotification(`⚠ 算力不足！接入后 ${after}/${S.computeCap} FLOPS。请先剪断其他芯片/金身节点，或更换法令`);
      cancelBlueprintConnecting(); return;
    }
  }
  S.wires = S.wires.filter(w => !old.includes(w));
  S.wires.push({ id: `w_${Date.now()}_${S.wires.length}`, fromNode: fromId, fromPin, toNode: toId, toPin, color: (from.themeColor || '#00f0ff'), isGold: to.type === 'core' });
  playUiSound('zap');
  S.connectingPin = null;
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
function spawnBlueprintNode(type) {
  const S = CPU_BLUEPRINT_STATE, z = S.zones[S.activeZoneId];
  playUiSound('click');
  const cnt = S.nodes.filter(n => n.zoneId === z.id && n.spawned).length;
  const x = z.rect.x + 40 + (cnt % 8) * 150, y = z.rect.y + z.rect.height - 70 - Math.floor(cnt / 8) * 80;
  const id = `${z.id}_new_${type}_${Date.now()}`;
  const T = {
    branch: { type: 'branch', name: '分流器 (新)', category: '1进2出', themeColor: '#00f0ff', icon: 'fa-solid fa-code-branch', width: 115, inPins: [_pin('in', '进', '#00f0ff')], outPins: [_pin('out_a', '出1', '#00f0ff'), _pin('out_b', '出2', '#00f0ff')] },
    merger: { type: 'merger', name: '并线器 (新)', category: '2合1', themeColor: '#38bdf8', icon: 'fa-solid fa-arrows-to-dot', width: 115, inPins: [_pin('in_1', '进1', '#38bdf8'), _pin('in_2', '进2', '#38bdf8')], outPins: [_pin('out', '出', '#38bdf8')] },
    amplifier: { type: 'amplifier', name: '双料翻倍器 (新)', category: '两料翻倍', themeColor: '#c084fc', icon: 'fa-solid fa-atom', width: 125, inPins: [_pin('in_1', '料1', '#f59e0b'), _pin('in_2', '料2', '#38bdf8')], outPins: [_pin('out', '出', '#c084fc')] },
    valve: { type: 'valve', name: '限流阀 (新)', category: '卡上限', themeColor: '#14b8a6', icon: 'fa-solid fa-filter', width: 115, maxFlow: 80, inPins: [_pin('in', '进', '#14b8a6')], outPins: [_pin('out', '出', '#14b8a6')] },
    input: { type: 'input', name: '供料口 (新)', category: '进料口', themeColor: z.themeColor, icon: 'fa-solid fa-arrow-right-to-bracket', width: 140, material: '玄铁矿', signalOut: 100, outPins: [_pin('out_a', '出', z.themeColor)] }
  }[type];
  if (!T) return;
  S.nodes.push(_mkNode(Object.assign({ id, zoneId: z.id, x, y, spawned: true }, T)));
  recomputeCpu();
  showNotification(`已向【${z.name}】底部投放【${T.name}】，可拖动到合适位置`);
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
  if (c) { c.style.transformOrigin = '0 0'; c.style.transform = `translate(${S.panX}px, ${S.panY}px) scale(${S.zoom})`; }
  _setText('cpuZoomBadge', Math.round(S.zoom * 100) + '%');
}
function centerOnRect(r, fixedZoom) {
  const vp = document.getElementById('paragonViewport'), S = CPU_BLUEPRINT_STATE;
  const w = (vp && vp.clientWidth) || 1200, h = (vp && vp.clientHeight) || 700;
  S.zoom = fixedZoom || Math.max(0.2, Math.min(1, Math.min((w - 40) / r.width, (h - 60) / r.height)));
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
function fitAllZonesCanvasView() { centerOnRect({ x: 40, y: 80, width: 4080, height: 2300 }); }
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
  const fresh = buildPresetNodes().filter(n => n.zoneId === 'zone2' && !n.isJinshen);
  const keep = S.nodes.filter(n => !(n.zoneId === 'zone2' && !n.isJinshen));
  S.nodes = keep.concat(fresh);
  const isZ2Base = id => id.startsWith('z2_') && !id.startsWith('z2_jinshen');
  const jinWires = S.wires.filter(w => w.fromNode.startsWith('z2_jinshen'));
  S.wires = S.wires.filter(w => !(isZ2Base(w.fromNode) || isZ2Base(w.toNode) || w.fromNode.startsWith('z2_jinshen')))
    .concat(buildPresetWires().filter(w => isZ2Base(w.fromNode) && isZ2Base(w.toNode)), jinWires);
  S.currentFlowRate = 1000; applyFlowRateToInputs(1000);
  S.selectedEntity = 'z2_core';
  S.activeZoneId = 'zone2';
  recomputeCpu();
  centerOnRect(S.zones.zone2.rect);
  showNotification('★ 生产母板 54 节点大网络已恢复：供料口 ➔ 分流 ➔ 限流 ➔ 加速泵 ➔ 并线 ➔ 翻倍 ➔ 循环 ➔ 汇流 ➔ 大翻倍 ➔ 4 提速口 ➔ 总核心！');
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
    const slots = core.inPins.filter(p => p.label.includes('金身') || p.label.includes('备用')).map(p => p.id);
    plan[zid].forEach((nid, i) => {
      const n = S.nodes.find(x => x.id === nid);
      if (!n || !slots[i]) return;
      if (dec.disabledCategories && dec.disabledCategories.includes(n.category)) return;
      activateJinshenNode(n, true);
      S.wires = S.wires.filter(w => !(w.toNode === core.id && w.toPin === slots[i]));
      S.wires.push({ id: `w_pre_${nid}`, fromNode: nid, fromPin: 'out', toNode: core.id, toPin: slots[i], color: n.themeColor, isGold: true });
    });
  });
  recomputeCpu();
  showNotification(`已套用推荐流派【${{ combat: '飞剑破天流', industry: '工业狂暴流', balanced: '均衡修真流' }[kind]}】（演示：免材料；受法令/插座限制）`);
}
function debugUnlockAllCpuSystem() {
  playUiSound('zap');
  CPU_BLUEPRINT_STATE.nodes.forEach(n => { if (n.isJinshen && !isJinshenDisabled(n)) n.activated = true; });
  recomputeCpu();
  showNotification('⚡【测试特权】已免材料激活全部金身突破节点！但核心插座与算力有限，仍需你取舍接入。');
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
  if (!cpuBlueprintHasInitialized) { initCentralProcessorBlueprint(); cpuBlueprintHasInitialized = true; }
  else refreshCpuAll();
  requestAnimationFrame(() => {
    centerOnRect(CPU_BLUEPRINT_STATE.zones[CPU_BLUEPRINT_STATE.activeZoneId || 'zone2'].rect);
    setTimeout(renderBlueprintWiresSvg, 60);
    setTimeout(renderBlueprintWiresSvg, 200);
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
  initCentralProcessorBlueprint();
  cpuBlueprintHasInitialized = true;
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
 demoFactoryLivingOptimalCircuit, selectInputNodeMaterial, getCpuGlobalBuffs, updateBlueprintMonitorStats
].forEach(f => { window[f.name] = f; });
