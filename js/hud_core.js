// ====================================================================
// js/hud_core.js - HUD 全局核心驱动 (快捷栏、建造菜单、罗盘、按键交互)
// ====================================================================

let isHolstered = false;
let isFlashlightOn = false;
let isDismantleMode = false;
let isCinematic = false;
let hotbarGroup = 1;
let activeSlot = 2; // 默认选中槽位 2
let currentHpIndex = 10; // 当前血量 10 格全满
let toastTimer = null;

// 提示 Toast 触发器
function showNotification(msg) {
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMsg');
  if (toastMsg) toastMsg.innerText = msg;
  if (toast) toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (toast) toast.style.opacity = '0';
  }, 2400);
}

// =========================================================================
// 戴森球风格建筑分类筛选快捷栏系统 (严格对照策划表 配置.txt，纯中文按钮)
// =========================================================================
const DSP_BUILD_CATEGORIES = [
  {
    id: 'prod',
    name: '生产制造',
    subTitle: '采矿·精炼·加工',
    shortcut: '1',
    desc: '采矿机、精炼炉、粉碎机、加工台、切割机、离心机、解构机、培育仓、提取器、搅拌机、组装机、冶炼舱',
    buildings: [
      { key: 'miner', code: 'BD_101', name: '采矿机', sub: '采掘 5MW', desc: '必须对准矿脉，探测范围10米', costText: '玄铁×3 板×2' },
      { key: 'smelter', code: 'BD_102', name: '精炼炉', sub: '冶炼 10MW', desc: '高温熔炼矿石为金属锭', costText: '玄铁×6 板×4' },
      { key: 'crusher', code: 'BD_103', name: '粉碎机', sub: '粉碎 8MW', desc: '金属锭研磨为玄铁粉', costText: '玄铁×2 板×1' },
      { key: 'assembler', code: 'BD_104', name: '加工台', sub: '零件 6MW', desc: '加工齿轮、线圈、控制模块', costText: '玄铁×4 板×2' },
      { key: 'constructor', code: 'BD_105', name: '切割机', sub: '精密 12MW', desc: '精密高速切割铜线与薄片', costText: '玄铁×4 齿轮×2' },
      { key: 'centrifuge', code: 'BD_106', name: '离心机', sub: '提纯 15MW', desc: '离心提取组织精华与煞气分离', costText: '玄铁×5 铜锭×3' },
      { key: 'deconstructor', code: 'BD_107', name: '解构机', sub: '生物 20MW', desc: '解构修士提取生物组织与神经束', costText: '玄铁×8 板×4' },
      { key: 'incubator', code: 'BD_108', name: '培育仓', sub: '生化 8MW', desc: '流固混合培育生物材料', costText: '玄铁×6 铜锭×4' },
      { key: 'extractor', code: 'BD_109', name: '提取器', sub: '萃取 10MW', desc: '提取组织蛋白液与灵草液', costText: '玄铁×3 铜锭×2' },
      { key: 'mixer', code: 'BD_110', name: '搅拌机', sub: '调配 14MW', desc: '流固混合调配营养液与稳脉液', costText: '玄铁×4 齿轮×2' },
      { key: 'assembler_heavy', code: 'BD_111', name: '组装机', sub: '重工 25MW', desc: '双轨校验合成人造灵根与阵图胚', costText: '玄铁×8 铜锭×6' },
      { key: 'smelt_chamber', code: 'BD_113', name: '冶炼舱', sub: '插件 高温', desc: '挂载灵力引擎的高温冶炼舱', costText: '玄铁×4 铜锭×2' }
    ]
  },
  {
    id: 'logi',
    name: '传送物流',
    subTitle: '传送带·分流·管网',
    shortcut: '2',
    desc: '传送带类型：传送带、分流器、水管、垂直传送带',
    buildings: [
      { key: 'conveyor', code: 'BD_125', name: '传送带', sub: '双向固体', desc: '自带供电传输的物料传送带', costText: '玄铁锭×2' },
      { key: 'splitter', code: 'BD_124', name: '分流器', sub: '1进3出', desc: '支持物料品质过滤分流', costText: '玄铁×3 齿轮×1' },
      { key: 'pipe', code: 'BD_127', name: '水管', sub: '双向流体', desc: '流体专用管道输送水与药液', costText: '玄铁锭×2' },
      { key: 'vert_conveyor', code: 'BD_129', name: '垂直传送带', sub: 'Z轴升降', desc: 'Z轴立体运输，高度可拖拽3-8米', costText: '玄铁×4 齿轮×2' }
    ]
  },
  {
    id: 'struct',
    name: '地基结构',
    subTitle: '地基·玄铁梁·置物桌',
    shortcut: '3',
    desc: '地基类型：地基1x1、地基4x4、地基16x16、玄铁梁、置物桌',
    buildings: [
      { key: 'foundation_1x1', code: 'BD_119', name: '地基 1x1', sub: '平整承重', desc: '1x1 规格基础平整地基', costText: '玄铁板×1' },
      { key: 'foundation', code: 'BD_120', name: '地基 4x4', sub: '标准地基', desc: '4x4 规格工业承重混凝土地基', costText: '玄铁板×4' },
      { key: 'foundation_16x16', code: 'BD_121', name: '地基 16x16', sub: '巨型平台', desc: '16x16 规格无限承重巨型地基', costText: '玄铁板×8' },
      { key: 'iron_beam_bld', code: 'BD_122', name: '玄铁梁', sub: '8米桥架', desc: '重型承重工字梁，跨越地形障碍', costText: '玄铁锭×2' },
      { key: 'storage_desk', code: 'BD_123', name: '置物桌', sub: '操作台面', desc: '便携台面与临时置物基台', costText: '玄铁锭×1' }
    ]
  },
  {
    id: 'power',
    name: '能源供电',
    subTitle: '供能机·灵力引擎',
    shortcut: '4',
    desc: '供能机、灵力引擎无线输电供热',
    buildings: [
      { key: 'power_burner', code: 'BD_117', name: '供能机', sub: '魂火发电', desc: '烧燃料发电，无线供电范围50米', costText: '玄铁×5 板×3' },
      { key: 'power_engine', code: 'BD_112', name: '灵力引擎', sub: '无线供热', desc: '提供无线电网与3个冶炼插槽', costText: '玄铁×8 铜锭×6' }
    ]
  },
  {
    id: 'aux',
    name: '辅助设施',
    subTitle: '箱子·抽水·净化·传送',
    shortcut: '5',
    desc: '箱子、大箱子、抽水机、净化塔、传送门',
    buildings: [
      { key: 'storage_box', code: 'BD_115', name: '个人储物箱', sub: '16格仓储', desc: '初始便携储物箱，容量16格', costText: '玄铁×2 板×2' },
      { key: 'storage_box_large', code: 'BD_115_L', name: '大储物箱', sub: '32格仓储', desc: '工业级大箱子，容量32格', costText: '玄铁×4 板×4' },
      { key: 'water_pump', code: 'BD_116', name: '抽水机', sub: '流体抽取', desc: '必须放置在水上，持续抽取水源', costText: '玄铁×3 板×2' },
      { key: 'purifier', code: 'BD_118', name: '净化塔', sub: '污染净化', desc: '抵消污染与煞气扩散，范围20米', costText: '玄铁×6 铜锭×4' },
      { key: 'portal', code: 'BD_114', name: '传送门', sub: '空间跃迁', desc: '配对频段瞬移传输，耗电50MW', costText: '玄铁×8 板×4' }
    ]
  }
];

let currentDspCategory = 'prod';
let currentDspBuilding = null;
let isDspShelfCollapsed = false;

// 选择戴森球风格建筑分类
function selectDspCategory(catId) {
  playUiSound('toggle');
  currentDspCategory = catId;

  const cat = DSP_BUILD_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  // 1. 更新一级分类按钮的高亮状态
  document.querySelectorAll('.dsp-cat-btn').forEach(btn => {
    btn.classList.remove('active-dsp-cat', 'border-[#00f0ff]', 'bg-[#00f0ff]/20', 'text-white');
    btn.classList.add('border-white/20', 'bg-white/5', 'text-white/80');
  });

  const activeBtn = document.getElementById(`dspCatBtn_${catId}`);
  if (activeBtn) {
    activeBtn.classList.add('active-dsp-cat', 'border-[#00f0ff]', 'bg-[#00f0ff]/20', 'text-white');
    activeBtn.classList.remove('border-white/20', 'bg-white/5', 'text-white/80');
  }

  // 2. 动态渲染纯中文名字按钮 (极简纯名，无冗余介绍)
  const container = document.getElementById('dspBuildingCardsContainer');
  if (container) {
    container.innerHTML = '';
    cat.buildings.forEach(bld => {
      const isSelected = (currentDspBuilding === bld.key);
      const btn = document.createElement('button');
      btn.id = `dspBldBtn_${bld.key}`;
      btn.className = `dsp-bld-btn px-3 py-1 rounded bg-[#111923] hover:bg-[#192636] border ${isSelected ? 'active-dsp-bld' : 'border-white/15 hover:border-[#00f0ff]'} text-xs font-bold text-white tracking-wide transition cursor-pointer select-none`;
      btn.innerText = bld.name; // 直接写名字！
      btn.title = bld.name;
      btn.onclick = () => selectDspBuilding(bld.key);
      container.appendChild(btn);
    });
  }

  // 确保抽屉显示
  const shelf = document.getElementById('dspSubBuildShelf');
  if (shelf) shelf.classList.remove('hidden');

  showNotification(`已切换至: 【${cat.name}】`);
}

// 点击纯中文建筑按钮，直接进入建造部署模式
function selectDspBuilding(buildingKey) {
  currentDspBuilding = buildingKey;
  playUiSound('click');

  // 寻找建筑数据
  let bldData = null;
  for (const cat of DSP_BUILD_CATEGORIES) {
    const f = cat.buildings.find(b => b.key === buildingKey);
    if (f) { bldData = f; break; }
  }

  // 高亮所选建筑按钮
  document.querySelectorAll('.dsp-bld-btn').forEach(b => b.classList.remove('active-dsp-bld'));
  const activeBtn = document.getElementById(`dspBldBtn_${buildingKey}`);
  if (activeBtn) activeBtn.classList.add('active-dsp-bld');

  // 更新就绪提示并显示
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  const readyName = document.getElementById('dspReadyBuildingName');
  if (readyBadge) readyBadge.classList.remove('hidden');
  if (readyBadge) readyBadge.classList.add('flex');
  if (readyName) readyName.innerText = bldData ? bldData.name : buildingKey;

  // 联动 3D 建造放置系统
  if (typeof enterBuildPlacingMode === 'function') {
    enterBuildPlacingMode(buildingKey);
  }

  showNotification(`建造就绪: 【${bldData ? bldData.name : buildingKey}】(左键放置，右键取消)`);
}

// 折叠或展开二级建筑抽屉
function toggleDspSubShelf(forceState = null) {
  playUiSound('toggle');
  const shelf = document.getElementById('dspSubBuildShelf');
  const toggleText = document.getElementById('dspShelfToggleText');
  if (!shelf) return;

  if (forceState !== null) {
    isDspShelfCollapsed = forceState;
  } else {
    isDspShelfCollapsed = !isDspShelfCollapsed;
  }

  if (isDspShelfCollapsed) {
    shelf.classList.add('hidden');
    if (toggleText) toggleText.innerText = '展开 ▼';
  } else {
    shelf.classList.remove('hidden');
    if (toggleText) toggleText.innerText = '收起 ▲';
  }
}

// 兼容旧接口
function selectHotbarSlot(slotNum, name) {
  const catMap = { 1: 'prod', 2: 'logi', 3: 'struct', 4: 'power', 5: 'aux' };
  if (catMap[slotNum]) {
    selectDspCategory(catMap[slotNum]);
  } else {
    showNotification(`已选快捷栏: ${name}`);
  }
}

function switchHotbarGroupRelative(dir = 1) {
  const cats = ['prod', 'logi', 'struct', 'power', 'aux'];
  const curIdx = cats.indexOf(currentDspCategory);
  const nextIdx = (curIdx + dir + cats.length) % cats.length;
  selectDspCategory(cats[nextIdx]);
}

function switchHotbarGroup() {
  switchHotbarGroupRelative(1);
}


// 切换收起/取出工具 (H 键与按钮)
function toggleHolster() {
  playUiSound('toggle');
  isHolstered = !isHolstered;
  const arm = document.getElementById('mechArm');
  const slash = document.getElementById('holsterSlash');
  const holsterIcon = document.getElementById('holsterIcon');
  const btnH = document.getElementById('btnH');
  if (isHolstered) {
    if (arm) arm.classList.add('arm-holstered');
    if (slash) slash.classList.remove('hidden');
    if (holsterIcon) holsterIcon.classList.add('text-amber-500');
    if (btnH) btnH.classList.add('border-amber-400');
    showNotification('[H] 工具手腕已收起');
  } else {
    if (arm) arm.classList.remove('arm-holstered');
    if (slash) slash.classList.add('hidden');
    if (holsterIcon) holsterIcon.classList.remove('text-amber-500');
    if (btnH) btnH.classList.remove('border-amber-400');
    showNotification('[H] 工具手腕已就绪');
  }
}

// 切换手电筒照明 (V 键与按钮)
function toggleFlashlight() {
  playUiSound('toggle');
  isFlashlightOn = !isFlashlightOn;
  const lightLayer = document.getElementById('flashlightLayer');
  const lightIcon = document.getElementById('lightIcon');
  if (isFlashlightOn) {
    if (lightLayer) lightLayer.classList.remove('hidden');
    if (lightIcon) lightIcon.classList.add('text-yellow-300');
    showNotification('[V] 随身探照灯已开启');
  } else {
    if (lightLayer) lightLayer.classList.add('hidden');
    if (lightIcon) lightIcon.classList.remove('text-yellow-300');
    showNotification('[V] 随身探照灯已熄灭');
  }
}

// 切换拆除模式 (F 键与按钮 - 1:1 联动 3秒右键拆除与橙框)
function toggleDismantleMode() {
  playUiSound('toggle');
  isDismantleMode = !isDismantleMode;
  const disLayer = document.getElementById('dismantleLayer');
  const disBorder = document.getElementById('dismantleBorder');
  const disStrip = document.getElementById('dismantleConsoleStrip');
  const disNotice = document.getElementById('dismantleNotice');
  const crossPoly = document.getElementById('crosshairPolygon');
  const disIcon = document.getElementById('dismantleIcon');

  // 若处于建造模式，先退出建造模式
  if (isDismantleMode && typeof exitBuildPlacingMode === 'function') {
    exitBuildPlacingMode();
  }

  if (isDismantleMode) {
    if (disLayer) disLayer.classList.remove('hidden');
    if (disBorder) disBorder.classList.remove('hidden');
    if (disStrip) disStrip.classList.remove('hidden');
    if (disNotice) disNotice.classList.remove('hidden');
    if (crossPoly) crossPoly.setAttribute('stroke', '#f5921e');
    if (disIcon) disIcon.classList.add('text-orange-500');
    showNotification('[F] 拆除模式已开启：瞄准目标后长按右键/左键3秒即可拆除回收');
  } else {
    if (disLayer) disLayer.classList.add('hidden');
    if (disBorder) disBorder.classList.add('hidden');
    if (disStrip) disStrip.classList.add('hidden');
    if (disNotice) disNotice.classList.add('hidden');
    if (crossPoly) crossPoly.setAttribute('stroke', 'rgba(255, 255, 255, 0.75)');
    if (disIcon) disIcon.classList.remove('text-orange-500');
    if (typeof cancelDismantleHold === 'function') cancelDismantleHold();
    if (typeof hideDismantleTargetCard === 'function') hideDismantleTargetCard();
    document.querySelectorAll('.machine-entity').forEach(el => el.classList.remove('dismantle-target-outline'));
    showNotification('[F] 退出拆除模式');
  }
}

// 切换纯净影院模式 (仅观察世界与机械臂)
function toggleCinematicMode() {
  playUiSound('toggle');
  isCinematic = !isCinematic;
  const hud = document.getElementById('hudRoot');
  if (hud) hud.style.opacity = isCinematic ? '0' : '1';
  showNotification(isCinematic ? '已隐藏 HUD (点击右下角或按 ESC 恢复)' : 'HUD 界面已恢复');
}

// 切换 N 快速检索与计算
function toggleSearchModal() {
  playUiSound('click');
  closeOtherModals('searchModal');
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
      setTimeout(() => document.getElementById('quickSearchInput')?.focus(), 50);
    }
  }
}

// 检索计算器
function handleSearchCalc(val) {
  const resElem = document.getElementById('searchResults');
  if (!resElem) return;
  try {
    if (/^[0-9+\-*/().\s]+$/.test(val)) {
      const calcVal = Function('"use strict";return (' + val + ')')();
      resElem.innerHTML = `<div class="p-2 bg-emerald-500/20 border border-emerald-400 rounded text-emerald-300 font-mono font-bold">计算结果: ${calcVal}</div>`;
      return;
    }
  } catch (e) {}
}

// 关闭除了当前之外的其它所有弹窗
function closeOtherModals(current) {
  ['buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal', 'swordCasketModal', 'hubMilestoneModal', 'codexModal', 'cpuProcessorModal', 'jinShenModal', 'fabaoModal'].forEach(id => {
    if (id !== current) {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    }
  });
}

// =========================================================================
// 建造器数据与菜单逻辑
// =========================================================================
const buildingDatabase = {
  // --- 生产制造类 (prod) ---
  miner: {
    key: 'miner',
    code: 'BD_101',
    title: '采矿机 (BD_101)',
    name: '采矿机',
    group: 'prod',
    desc: '必须对准矿脉，持续开采地下玄铁矿、赤铜矿与煤炭。',
    power: '5MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 5, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><polygon points="30,140 45,100 115,100 130,140" fill="#1b2029" stroke="#111"/><rect x="45" y="70" width="70" height="40" fill="#e0770b" stroke="#111" stroke-width="2"/><rect x="68" y="25" width="24" height="45" fill="#3d4657" stroke="#111"/><polygon points="80,142 65,115 95,115" fill="#ffd400"/></svg>`
  },
  smelter: {
    key: 'smelter',
    code: 'BD_102',
    title: '精炼炉 (BD_102)',
    name: '精炼炉',
    group: 'prod',
    desc: '基础矿石冶炼设备，将玄铁矿/赤铜矿高温熔炼为金属锭。',
    power: '10MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 8, icon: 'fa-sheet-plastic' },
      { name: '耐火炉芯', code: 'refractory_core', need: 2, icon: 'fa-fire-burner' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><ellipse cx="80" cy="142" rx="48" ry="12" fill="rgba(0,0,0,0.5)"/><rect x="68" y="24" width="24" height="20" rx="2" fill="#20242d" stroke="#111" stroke-width="2"/><line x1="64" y1="24" x2="96" y2="24" stroke="#f5921e" stroke-width="3"/><path d="M 38 138 L 48 44 L 112 44 L 122 138 Z" fill="#272d38" stroke="#12161f" stroke-width="3"/><polygon points="54,52 106,52 114,130 46,130" fill="#f5921e" stroke="#111" stroke-width="2"/><rect x="64" y="85" width="32" height="36" rx="3" fill="#15171d" stroke="#000" stroke-width="2"/><rect x="68" y="90" width="24" height="26" rx="2" fill="#ff5500" class="animate-pulse shadow-[inset_0_0_10px_#ffeb3b]"/><line x1="68" y1="98" x2="92" y2="98" stroke="#ffd000" stroke-width="2"/><line x1="68" y1="106" x2="92" y2="106" stroke="#ffd000" stroke-width="2"/><rect x="60" y="128" width="40" height="14" fill="#12151c" stroke="#333" stroke-width="1.5"/><rect x="68" y="132" width="24" height="6" fill="#ffd400"/></svg>`
  },
  crusher: {
    key: 'crusher',
    code: 'BD_103',
    title: '粉碎机 (BD_103)',
    name: '粉碎机',
    group: 'prod',
    desc: '将金属锭研磨粉碎为加工中间件玄铁粉。',
    power: '8MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 6, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 4, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="35" y="45" width="90" height="85" rx="4" fill="#293241" stroke="#111" stroke-width="2"/><polygon points="50,60 80,95 110,60" fill="#e0770b"/><line x1="80" y1="95" x2="80" y2="120" stroke="#f5921e" stroke-width="3"/></svg>`
  },
  assembler: {
    key: 'assembler',
    code: 'BD_104',
    title: '加工台 (BD_104)',
    name: '加工台',
    group: 'prod',
    desc: '制作基础机械零件，加工玄铁板、齿轮、玄铁梁、控制模块与设备框架。',
    power: '6MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 8, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 4, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="25" y="40" width="110" height="90" rx="6" fill="#242c38" stroke="#111" stroke-width="3"/><rect x="35" y="50" width="40" height="70" fill="#f5921e"/><rect x="85" y="50" width="40" height="70" fill="#e0770b"/><circle cx="55" cy="85" r="12" fill="#111"/><circle cx="105" cy="85" r="12" fill="#111"/></svg>`
  },
  constructor: {
    key: 'constructor',
    code: 'BD_105',
    title: '切割机 (BD_105)',
    name: '切割机',
    group: 'prod',
    desc: '基础精密材料加工设备，将赤铜锭切割为铜线、导灵铜片，加工木板和导脉薄片。',
    power: '12MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 6, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><polygon points="25,138 45,100 115,100 135,138" fill="#20252f" stroke="#111" stroke-width="2"/><rect x="38" y="45" width="84" height="18" rx="2" fill="#e57d07" stroke="#111" stroke-width="2"/><rect x="36" y="60" width="14" height="42" fill="#2b313d"/><rect x="110" y="60" width="14" height="42" fill="#2b313d"/><rect x="68" y="58" width="24" height="20" fill="#ffd400"/><line x1="80" y1="78" x2="80" y2="108" stroke="#7fe8ff" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  centrifuge: {
    key: 'centrifuge',
    code: 'BD_106',
    title: '离心机 (BD_106)',
    name: '离心机',
    group: 'prod',
    desc: '分离生物液体中的不同成分，离心提取组织精华液与煞气分离。',
    power: '15MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '赤铜锭', code: 'copper_ingot', need: 6, icon: 'fa-square' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="45" y="55" width="90" height="90" rx="6" fill="#1c2533" stroke="#111" stroke-width="2"/><circle cx="90" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 4" class="animate-spin"/></svg>`
  },
  deconstructor: {
    key: 'deconstructor',
    code: 'BD_107',
    title: '解构机 (BD_107)',
    name: '解构机',
    group: 'prod',
    desc: '专门解构修士尸体，提取鲜活生物组织、神经束与脱水生物组织。',
    power: '20MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 12, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 8, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="40" y="50" width="100" height="95" rx="4" fill="#2b2025" stroke="#f43f5e" stroke-width="2"/><line x1="55" y1="65" x2="125" y2="135" stroke="#f43f5e" stroke-width="3"/><line x1="125" y1="65" x2="55" y2="135" stroke="#f43f5e" stroke-width="3"/></svg>`
  },
  incubator: {
    key: 'incubator',
    code: 'BD_108',
    title: '培育仓 (BD_108)',
    name: '培育仓',
    group: 'prod',
    desc: '多用处流固混合培育设备，具备灵草基础培育、催生增产闭环与细胞扩增。',
    power: '8MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '赤铜锭', code: 'copper_ingot', need: 8, icon: 'fa-square' }
    ],
    svg: `<svg viewBox="0 0 200 180" class="w-full h-full drop-shadow"><rect x="45" y="45" width="110" height="100" rx="6" fill="#142820" stroke="#10b981" stroke-width="2"/><circle cx="100" cy="95" r="26" fill="#059669" class="animate-pulse"/></svg>`
  },
  extractor: {
    key: 'extractor',
    code: 'BD_109',
    title: '提取器 (BD_109)',
    name: '提取器',
    group: 'prod',
    desc: '从生物材料中提取组织蛋白液与灵草萃取液。',
    power: '10MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 8, icon: 'fa-sheet-plastic' },
      { name: '铜线', code: 'copper_wire', need: 12, icon: 'fa-plug' }
    ],
    svg: `<svg viewBox="0 0 180 160" class="w-full h-full drop-shadow"><rect x="40" y="40" width="100" height="90" rx="4" fill="#202938" stroke="#111" stroke-width="2"/><circle cx="90" cy="85" r="22" fill="#00f0ff" opacity="0.8"/></svg>`
  },
  mixer: {
    key: 'mixer',
    code: 'BD_110',
    title: '搅拌机 (BD_110)',
    name: '搅拌机',
    group: 'prod',
    desc: '流体/固体混合调配，合成基础营养液、活性混合液与法宝稳脉液。',
    power: '14MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 6, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="40" y="45" width="100" height="95" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/><circle cx="90" cy="92" r="24" fill="#0284c7" class="animate-spin"/></svg>`
  },
  assembler_heavy: {
    key: 'assembler_heavy',
    code: 'BD_111',
    title: '组装机 (BD_111)',
    name: '组装机',
    group: 'prod',
    desc: '重工双轨校验组装，合成生物胚料、灵根胚体、人造灵根与法宝阵图胚。',
    power: '25MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 8, icon: 'fa-bars-staggered' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 10, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 220 200" class="w-full h-full drop-shadow"><rect x="35" y="60" width="150" height="110" rx="4" fill="#262d3a" stroke="#121620" stroke-width="3"/><rect x="45" y="70" width="60" height="90" fill="#f5921e"/><circle cx="75" cy="115" r="16" fill="#111"/><circle cx="145" cy="115" r="16" fill="#111"/></svg>`
  },
  smelt_chamber: {
    key: 'smelt_chamber',
    code: 'BD_113',
    title: '冶炼舱 (BD_113)',
    name: '冶炼舱',
    group: 'prod',
    desc: '挂载灵力引擎的高温冶炼舱插件，汲取高热自动提纯精炼玄铁与高温合金。',
    power: '35MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '耐火炉芯', code: 'refractory_core', need: 4, icon: 'fa-fire-burner' }
    ],
    svg: `<svg viewBox="0 0 170 170" class="w-full h-full drop-shadow"><rect x="40" y="40" width="90" height="90" rx="4" fill="#2d1c08" stroke="#f5921e" stroke-width="2"/><circle cx="85" cy="85" r="22" fill="#ea580c" class="animate-pulse"/></svg>`
  },

  // --- 传送物流类 (logi) ---
  conveyor: {
    key: 'conveyor',
    code: 'BD_125',
    title: '传送带 (BD_125)',
    name: '传送带',
    group: 'logi',
    desc: '自带供电传输的标准物料传送带，支持建筑间无人化运输。',
    power: '0MW',
    costs: [{ name: '玄铁板', code: 'iron_plate', need: 1, icon: 'fa-sheet-plastic' }],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full text-emerald-400 flex items-center justify-center"><path d="M 20 80 Q 80 40, 140 80 Q 80 120, 20 80 Z" fill="#20252f" stroke="#3bb2e6" stroke-width="4"/></svg>`
  },
  splitter: {
    key: 'splitter',
    code: 'BD_124',
    title: '分流器 (BD_124)',
    name: '分流器',
    group: 'logi',
    desc: '1进3出物流分流节点，支持品质过滤与流向分配。',
    power: '0MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 4, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 2, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 140" class="w-full h-full drop-shadow"><rect x="35" y="35" width="90" height="70" rx="4" fill="#2a3342" stroke="#111" stroke-width="2"/><polygon points="80,40 70,50 90,50" fill="#00f0ff"/><polygon points="40,70 50,60 50,80" fill="#00f0ff"/><polygon points="120,70 110,60 110,80" fill="#00f0ff"/></svg>`
  },
  pipe: {
    key: 'pipe',
    code: 'BD_127',
    title: '水管 (BD_127)',
    name: '水管',
    group: 'logi',
    desc: '双向流体导管，用于运送原水、营养液及煞气浓缩液。',
    power: '0MW',
    costs: [{ name: '玄铁锭', code: 'iron_ingot', need: 2, icon: 'fa-cube' }],
    svg: `<svg viewBox="0 0 160 140" class="w-full h-full drop-shadow"><rect x="20" y="55" width="120" height="28" rx="6" fill="#1a2736" stroke="#00f0ff" stroke-width="2"/><circle cx="40" cy="69" r="8" fill="#00f0ff" opacity="0.7"/><circle cx="80" cy="69" r="8" fill="#00f0ff" opacity="0.7"/><circle cx="120" cy="69" r="8" fill="#00f0ff" opacity="0.7"/></svg>`
  },
  vert_conveyor: {
    key: 'vert_conveyor',
    code: 'BD_129',
    title: '垂直传送带 (BD_129)',
    name: '垂直传送带',
    group: 'logi',
    desc: 'Z轴立体运输升降架，高度可拖拽 3~8 米。',
    power: '0MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 4, icon: 'fa-sheet-plastic' },
      { name: '玄铁齿轮', code: 'iron_gear', need: 4, icon: 'fa-gear' }
    ],
    svg: `<svg viewBox="0 0 160 180" class="w-full h-full drop-shadow"><rect x="50" y="30" width="60" height="130" rx="4" fill="#222c3a" stroke="#111" stroke-width="2"/><line x1="50" y1="60" x2="110" y2="60" stroke="#f5921e" stroke-width="2"/><line x1="50" y1="90" x2="110" y2="90" stroke="#f5921e" stroke-width="2"/></svg>`
  },

  // --- 能源动力类 (power) ---
  power_burner: {
    key: 'power_burner',
    code: 'BD_117',
    title: '供能机 (BD_117)',
    name: '供能机',
    group: 'power',
    desc: '燃烧煤炭或木材发电，无线供电覆盖 50 米半径。',
    power: '发电: 20MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 10, icon: 'fa-sheet-plastic' },
      { name: '铜线', code: 'copper_wire', need: 10, icon: 'fa-plug' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><polygon points="35,150 55,60 125,60 145,150" fill="#252d3a" stroke="#111" stroke-width="2.5"/><circle cx="90" cy="115" r="26" fill="#f5921e" class="animate-pulse shadow-[0_0_18px_#ff9900]"/></svg>`
  },
  power_engine: {
    key: 'power_engine',
    code: 'BD_112',
    title: '灵力引擎 (BD_112)',
    name: '灵力引擎',
    group: 'power',
    desc: '复合建筑母机座子，本身无线供电 50MW，提供顶部 3 个 1x2 插槽供热供能。',
    power: '发电: 50MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 10, icon: 'fa-bars-staggered' },
      { name: '接线组件', code: 'wiring_assembly', need: 6, icon: 'fa-plug' }
    ],
    svg: `<svg viewBox="0 0 200 180" class="w-full h-full drop-shadow"><rect x="30" y="50" width="140" height="100" rx="6" fill="#182332" stroke="#00f0ff" stroke-width="2.5"/><circle cx="100" cy="100" r="32" fill="none" stroke="#00f0ff" stroke-width="4" stroke-dasharray="10 5" class="animate-spin"/><circle cx="100" cy="100" r="16" fill="#f5921e" class="animate-ping"/></svg>`
  },

  // --- 结构仓储类 (org) ---
  foundation: {
    key: 'foundation',
    code: 'BD_120',
    title: '地基 4x4 (BD_120)',
    name: '地基 4x4',
    group: 'org',
    desc: '标准 4x4 工业平整承重地基，支持建筑网格化吸附部署。',
    power: '0MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 2, icon: 'fa-bars-staggered' },
      { name: '玄铁板', code: 'iron_plate', need: 5, icon: 'fa-sheet-plastic' }
    ],
    svg: `<svg viewBox="0 0 240 180" class="w-full h-full drop-shadow"><polygon points="20,160 50,90 190,90 220,160" fill="#2d333f" stroke="#1a1e27" stroke-width="3"/><polygon points="50,90 120,45 190,90 120,110" fill="#3d4656" stroke="#1a1e27" stroke-width="2"/><path d="M 45 88 L 120 42 L 195 88" fill="none" stroke="#f5921e" stroke-width="5" stroke-linecap="round"/></svg>`
  },
  foundation_1x1: {
    key: 'foundation_1x1',
    code: 'BD_119',
    title: '地基 1x1 (BD_119)',
    name: '地基 1x1',
    group: 'org',
    desc: '小型 1x1 基础平整地基。',
    power: '0MW',
    costs: [{ name: '玄铁板', code: 'iron_plate', need: 1, icon: 'fa-sheet-plastic' }],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="30" y="30" width="100" height="100" rx="4" fill="#333a47" stroke="#111" stroke-width="2"/></svg>`
  },
  iron_beam_bld: {
    key: 'iron_beam_bld',
    code: 'BD_122',
    title: '玄铁梁 (BD_122)',
    name: '玄铁梁',
    group: 'org',
    desc: '重型承重工字梁，跨越地形障碍架设管线。',
    power: '0MW',
    costs: [{ name: '玄铁梁', code: 'iron_beam', need: 2, icon: 'fa-bars-staggered' }],
    svg: `<svg viewBox="0 0 200 120" class="w-full h-full drop-shadow"><rect x="20" y="50" width="160" height="22" fill="#3a4454" stroke="#111" stroke-width="2"/></svg>`
  },
  storage_box: {
    key: 'storage_box',
    code: 'BD_115',
    title: '个人储物箱 (BD_115)',
    name: '个人储物箱',
    group: 'org',
    desc: '标准随身物品存放箱，具有 24 格储物空间。',
    power: '0MW',
    costs: [
      { name: '玄铁板', code: 'iron_plate', need: 4, icon: 'fa-sheet-plastic' },
      { name: '玄铁锭', code: 'iron_ingot', need: 4, icon: 'fa-cube' }
    ],
    svg: `<svg viewBox="0 0 160 160" class="w-full h-full text-amber-300"><rect x="35" y="45" width="90" height="75" rx="3" fill="#e0770b" stroke="#111" stroke-width="3"/><rect x="65" y="70" width="30" height="20" fill="#111"/></svg>`
  },

  // --- 特殊建筑类 (special) ---
  refining_bench: {
    key: 'refining_bench',
    code: 'BD_148',
    title: '炼宝台 (BD_148)',
    name: '炼宝台',
    group: 'special',
    desc: '法宝支线核心工作台，注入煞气浓缩液与稳脉液重铸本命法宝。',
    power: '30MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 20, icon: 'fa-bars-staggered' },
      { name: '导脉合金', code: 'daomai_alloy', need: 5, icon: 'fa-gem' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="30" y="40" width="120" height="100" rx="8" fill="#1b172a" stroke="#ffd700" stroke-width="3"/><circle cx="90" cy="90" r="30" fill="#a855f7" class="animate-pulse"/></svg>`
  },
  tribulation_platform: {
    key: 'tribulation_platform',
    code: 'BD_150',
    title: '渡劫台 (BD_150)',
    name: '渡劫台',
    group: 'special',
    desc: '引九重天劫洗礼，法宝渡劫化生后天灵宝。',
    power: '50MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 30, icon: 'fa-bars-staggered' },
      { name: '接线组件', code: 'wiring_assembly', need: 20, icon: 'fa-plug' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><ellipse cx="90" cy="90" rx="70" ry="70" fill="#080e1a" stroke="#00f0ff" stroke-width="3"/><path d="M 90 20 L 90 160 M 20 90 L 160 90" stroke="#ffd700" stroke-width="2"/></svg>`
  },
  portal: {
    key: 'portal',
    code: 'BD_114',
    title: '传送门 (BD_114)',
    name: '传送门',
    group: 'special',
    desc: '空间跃迁传输，配对频段瞬移传输。',
    power: '50MW',
    costs: [
      { name: '玄铁梁', code: 'iron_beam', need: 15, icon: 'fa-bars-staggered' },
      { name: '电源模块', code: 'power_supply_module', need: 5, icon: 'fa-bolt' }
    ],
    svg: `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="40" y="40" width="100" height="110" rx="8" fill="#161e2e" stroke="#a855f7" stroke-width="3"/><ellipse cx="90" cy="95" rx="35" ry="45" fill="#7e22ce" class="animate-pulse"/></svg>`
  }
};

let currentSelectedBuilding = 'smelter';

// 动态渲染 Q 键建造菜单中的建筑卡片树
function renderBuildingListTree(tabId = 'prod') {
  const container = document.getElementById('buildingListTree');
  if (!container) return;
  container.innerHTML = '';

  const groups = {
    prod: { name: '生产制造 (重工与生物设备)', icon: 'fa-industry' },
    logi: { name: '传送物流 (导轨与管道网)', icon: 'fa-boxes-packing' },
    power: { name: '能源供电 (发电机与灵力引擎)', icon: 'fa-bolt' },
    org: { name: '结构仓储 (平整地基与储物箱)', icon: 'fa-sitemap' },
    special: { name: '特殊设施 (炼宝、渡劫与传送)', icon: 'fa-sparkles' }
  };

  const tabsToRender = (tabId === 'special') ? Object.keys(groups) : [tabId];

  tabsToRender.forEach(grpKey => {
    const grpInfo = groups[grpKey] || { name: '工业设施', icon: 'fa-industry' };
    const blds = Object.values(buildingDatabase).filter(b => b.group === grpKey);
    if (blds.length === 0) return;

    const sec = document.createElement('div');
    sec.className = 'build-group-section space-y-2';
    sec.setAttribute('data-group', grpKey);

    const titleBar = document.createElement('div');
    titleBar.className = 'flex items-center space-x-2 pb-1.5 border-b border-white/15 text-white/70 text-xs font-semibold';
    titleBar.innerHTML = `<i class="fa-solid ${grpInfo.icon} text-[#f5921e]"></i><span>${grpInfo.name}</span>`;
    sec.appendChild(titleBar);

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-4 gap-2.5 pt-1';

    blds.forEach(b => {
      const isSelected = (currentSelectedBuilding === b.key);
      const card = document.createElement('div');
      card.id = `bcard-${b.key}`;
      card.onclick = () => selectBuildingItem(b.key);
      card.className = `build-item-card w-full h-24 rounded flex flex-col items-center justify-center p-2 cursor-pointer transition select-none ${isSelected ? 'bg-[#e0770b] border-2 border-[#ff9d24] shadow-[0_0_12px_rgba(245,146,30,0.5)]' : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40'}`;
      card.innerHTML = `
        <div class="w-10 h-10 flex items-center justify-center mb-1">
          ${b.svg}
        </div>
        <span class="text-[11px] font-bold text-center text-white/90 leading-tight">${b.name}</span>
        <span class="text-[8px] font-mono text-cyan-300/80">${b.code}</span>
      `;
      grid.appendChild(card);
    });

    sec.appendChild(grid);
    container.appendChild(sec);
  });
}

// 切换建造器左侧大分类 Tab
function switchBuildTab(tabId) {
  playUiSound('click');
  document.querySelectorAll('.ficsit-tab-btn').forEach(btn => btn.classList.remove('ficsit-tab-active'));
  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('ficsit-tab-active');

  renderBuildingListTree(tabId);
}

// 点击中间建筑卡片触发选择
function selectBuildingItem(key) {
  playUiSound('click');
  currentSelectedBuilding = key;
  const data = buildingDatabase[key];
  if (!data) return;

  document.querySelectorAll('.build-item-card').forEach(c => {
    c.className = 'build-item-card w-full h-24 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40 rounded flex flex-col items-center justify-center p-2 cursor-pointer transition select-none';
  });
  const activeCard = document.getElementById(`bcard-${key}`);
  if (activeCard) {
    activeCard.className = 'build-item-card w-full h-24 bg-[#e0770b] border-2 border-[#ff9d24] shadow-[0_0_12px_rgba(245,146,30,0.5)] rounded flex flex-col items-center justify-center p-2 cursor-pointer transition select-none';
  }

  const title = document.getElementById('buildDetailTitle');
  if (title) title.innerText = data.title;
  const desc = document.getElementById('buildDetailDesc');
  if (desc) desc.innerText = data.desc;
  const power = document.getElementById('buildDetailPower');
  if (power) power.innerText = data.power;
  const modelSvg = document.getElementById('buildDetailModelSvg');
  if (modelSvg) modelSvg.innerHTML = data.svg;

  const costContainer = document.getElementById('buildDetailCostCards');
  if (costContainer) {
    costContainer.innerHTML = '';
    data.costs.forEach(cost => {
      const currentStock = (typeof playerInventory !== 'undefined' && playerInventory[cost.code] !== undefined) ? playerInventory[cost.code] : (cost.stock || 0);
      const isEnough = currentStock >= cost.need;
      const card = document.createElement('div');
      card.className = `flex flex-col items-center bg-[#252b36] border ${isEnough ? 'border-white/20' : 'border-rose-500/60'} rounded p-1.5 min-w-[62px]`;
      card.innerHTML = `
        <div class="w-8 h-8 flex items-center justify-center">
          <i class="fa-solid ${cost.icon} text-stone-200 text-lg"></i>
        </div>
        <span class="text-[10px] font-mono font-bold ${isEnough ? 'text-white' : 'text-rose-400'} mt-1">${currentStock}/${cost.need}</span>
      `;
      costContainer.appendChild(card);
    });
  }
}

// 建造菜单搜索
function handleBuildSearch(val) {
  val = val.toLowerCase().trim();
  document.querySelectorAll('.build-item-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    if (!val || text.includes(val)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// 添加当前建筑到待办清单
function addCurrentToTodo() {
  playUiSound('toggle');
  const data = buildingDatabase[currentSelectedBuilding];
  if (!data) return;

  const todoCards = document.getElementById('todoCardsContainer');
  if (!todoCards) return;
  const itemBox = document.createElement('div');
  itemBox.className = 'bg-black/85 backdrop-blur-md border border-[#f5921e]/80 rounded p-2.5 flex flex-col items-end shadow-2xl transition hover:border-[#f5921e]';
  
  let costItemsHtml = '';
  data.costs.forEach(c => {
    const currentStock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined) ? playerInventory[c.code] : (c.stock || 0);
    costItemsHtml += `
      <div class="flex flex-col items-center bg-white/10 border border-white/20 rounded px-2 py-1 min-w-[56px] relative" title="${c.name}: ${currentStock}/${c.need}">
        <i class="fa-solid ${c.icon} text-stone-300 text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold ${currentStock >= c.need ? 'text-emerald-400' : 'text-amber-400'}">${currentStock}/${c.need}</span>
      </div>
    `;
  });

  itemBox.innerHTML = `
    <div class="flex items-center space-x-2 text-[11px] text-white/90 mb-1.5 font-sans">
      <span>待办设施: <strong>${data.name} (${data.code})</strong></span>
      <button onclick="this.closest('.bg-black\\\\/85').remove(); playUiSound('toggle');" class="text-white/40 hover:text-white px-1 text-xs cursor-pointer">×</button>
    </div>
    <div class="flex items-center space-x-2">
      ${costItemsHtml}
    </div>
  `;
  todoCards.appendChild(itemBox);
  showNotification(`已将【${data.name}】材料需求添加至右上角待办清单`);
}

// 确认准备建造 (联动 1:1 建造部署系统)
function confirmBuildPlacement() {
  const data = buildingDatabase[currentSelectedBuilding];
  playUiSound('click');
  toggleBuildMenu();
  if (typeof enterBuildPlacingMode === 'function') {
    enterBuildPlacingMode(currentSelectedBuilding || 'smelter');
  } else {
    showNotification(`[建造模式就绪] 正在放置: ${data ? data.name : '设施'} (点击左键部署)`);
  }
}

// 切换 Q 建造菜单
function toggleBuildMenu() {
  playUiSound('click');
  closeOtherModals('buildModal');
  const modal = document.getElementById('buildModal');
  if (!modal) return;
  modal.classList.toggle('hidden');
  if (!modal.classList.contains('hidden')) {
    renderBuildingListTree('prod');
    selectBuildingItem(currentSelectedBuilding || 'smelter');
  }
}

// 同步 HUD 右上角里程碑物料追踪卡片 (严格对接官方 XIUXIAN_ITEMS)
function syncMilestoneTrackerDisplay() {
  const container = document.getElementById('hudMilestoneCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  const requirements = [
    { code: 'iron_ingot', need: 100 },
    { code: 'copper_ingot', need: 100 },
    { code: 'iron_plate', need: 100 }
  ];

  requirements.forEach(req => {
    const item = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[req.code]) ? XIUXIAN_ITEMS[req.code] : { name: req.code, icon: 'fa-solid fa-cube' };
    const stock = (typeof playerInventory !== 'undefined' && playerInventory[req.code] !== undefined) ? playerInventory[req.code] : 0;
    const isReached = stock >= req.need;
    const card = document.createElement('div');
    card.className = 'flex flex-col items-center bg-black/50 border border-white/15 rounded px-2 py-0.5 min-w-[56px] shadow';
    card.title = `${item.name}: ${stock} / ${req.need}`;
    card.innerHTML = `
      <i class="${item.icon} text-stone-200 text-xs mb-0.5"></i>
      <span class="text-[10px] font-mono font-bold ${isReached ? 'text-emerald-400' : 'text-stone-200'}">${Math.min(stock, req.need)} / ${req.need}</span>
    `;
    container.appendChild(card);
  });
}

// 点击生命值分段测试扣血与回血
function toggleHealthDamage() {
  playUiSound('click');
  currentHpIndex--;
  if (currentHpIndex < 2) currentHpIndex = 10;
  const segments = document.getElementById('hpSegments')?.children;
  if (segments) {
    for (let i = 0; i < 10; i++) {
      if (i < currentHpIndex) {
        segments[i].className = 'hp-segment w-2.5 h-4 bg-white rounded-[1px] shadow-[0_0_4px_rgba(255,255,255,0.5)]';
      } else {
        segments[i].className = 'hp-segment w-2.5 h-4 bg-white/15 rounded-[1px]';
      }
    }
  }
  showNotification(`开拓者健康状态: ${currentHpIndex * 10}%`);
}

// =========================================================================
// =========================================================================
// 修仙法宝与装备滚轮切换系统 (仅保留 3 个专属装备：罗盘 / 剑匣 / 工程器械)
// =========================================================================
const combatEquipmentList = [
  {
    id: 'luopan',
    name: '罗盘',
    category: '寻龙探测法宝',
    icon: 'fa-solid fa-compass text-amber-300',
    color: '#f5921e',
    desc: '寻龙点穴，探测地脉灵穴与周遭天地灵气流动，导引灵脉矿藏',
    sound: 'toggle'
  },
  {
    id: 'sword_casket',
    name: '剑匣',
    category: '本命藏剑之具',
    icon: 'fa-solid fa-box-open text-amber-400',
    color: '#eab308',
    desc: '御剑千刃，藏锋于匣。内纳四柄绝世飞剑，随时调令出鞘疾刺',
    sound: 'sword_draw'
  },
  {
    id: 'engineering',
    name: '工程器械',
    category: '建造拆解法具',
    icon: 'fa-solid fa-screwdriver-wrench text-cyan-300',
    color: '#00f0ff',
    desc: '高压电弧手持工程器械，用于工业设备建造、采矿与热解拆除',
    sound: 'zap'
  }
];

let combatEquipIdx = 0; // 默认选中 0: 罗盘

// 鼠标滚轮切换装备 (直接响应滚动事件)
function handleCombatEquipWheel(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.deltaY < 0) {
    // 向上滚动：切换到上一个装备
    cycleCombatEquipment(-1);
  } else if (e.deltaY > 0) {
    // 向下滚动：切换到下一个装备
    cycleCombatEquipment(1);
  }
}

// 切换到下一个或上一个装备
function cycleCombatEquipment(direction = 1) {
  const len = combatEquipmentList.length;
  combatEquipIdx = (combatEquipIdx + direction + len) % len;
  updateCombatEquipmentUI(true);
}

// 保持对旧名 triggerWeaponCycle 的兼容
function triggerWeaponCycle() {
  cycleCombatEquipment(1);
}

// 刷新底部 COMBAT HUD 装备界面的显示与右手手持模型联动状态
function updateCombatEquipmentUI(playAudio = true) {
  const item = combatEquipmentList[combatEquipIdx];
  if (!item) return;

  if (playAudio) {
    playUiSound(item.sound || 'click');
  }

  // 1. 菱形框内部图标动效
  const iconElem = document.getElementById('combatEquipIcon');
  if (iconElem) {
    iconElem.className = `${item.icon} text-base z-10 transition-transform duration-200`;
    iconElem.style.transform = 'scale(1.3) rotate(15deg)';
    setTimeout(() => {
      iconElem.style.transform = 'scale(1) rotate(0deg)';
    }, 180);
  }

  // 2. 外框光芒色彩联动
  const frameElem = document.getElementById('combatEquipFrame');
  if (frameElem) {
    frameElem.style.borderColor = item.color || '#00f0ff';
    frameElem.style.boxShadow = `0 0 15px ${item.color || '#00f0ff'}`;
  }

  // 3. 装备名称与分类文本
  const nameElem = document.getElementById('combatEquipNameLabel');
  if (nameElem) nameElem.innerText = item.name;
  const typeElem = document.getElementById('combatEquipTypeLabel');
  if (typeElem) typeElem.innerText = item.category;

  // 4. 浮动系统通知
  showNotification(`【手持装备切换】已装备: 【${item.name}】(${item.category}) - ${item.desc}`);

  // 5. 右手手持模型实时联动变换 (罗盘 / 剑匣 / 工程器械)
  const armEngineering = document.getElementById('armEngineering');
  const armLuopan = document.getElementById('armLuopan');
  const armCasket = document.getElementById('armCasket');

  if (armEngineering && armLuopan && armCasket) {
    armEngineering.classList.add('hidden');
    armLuopan.classList.add('hidden');
    armCasket.classList.add('hidden');

    if (item.id === 'engineering') {
      armEngineering.classList.remove('hidden');
      armEngineering.style.transform = 'translate(0, 0)';
    } else if (item.id === 'luopan') {
      armLuopan.classList.remove('hidden');
      armLuopan.style.transform = 'translate(0, 0)';
    } else if (item.id === 'sword_casket') {
      armCasket.classList.remove('hidden');
      armCasket.style.transform = 'translate(0, 0)';
    }
  }

  // 6. 罗盘特殊联动：当装备罗盘时，顶部罗盘变金色寻龙灵盘！
  const compassWrapper = document.getElementById('compassWrapper');
  if (compassWrapper) {
    if (item.id === 'luopan') {
      compassWrapper.classList.add('compass-luopan-active');
      // 切换到罗盘时自动呼出天元全息罗盘中枢
      if (playAudio) {
        const invModal = document.getElementById('invModal');
        if (invModal && invModal.classList.contains('hidden') && typeof toggleInventoryModal === 'function') {
          toggleInventoryModal('main');
        }
      }
    } else {
      compassWrapper.classList.remove('compass-luopan-active');
    }
  }
}

// =========================================================================
// 全局事件监听器绑定
// =========================================================================

// 点击大视界任意区域：当前手持装备攻击与交互联动
document.addEventListener('click', (e) => {
  if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('#buildModal') || e.target.closest('#craftModal') || e.target.closest('#invModal') || e.target.closest('#swordCasketModal') || e.target.closest('#hubMilestoneModal') || e.target.closest('#codexModal') || e.target.closest('#machineModal') || e.target.closest('#cpuProcessorModal')) {
    return;
  }
  const cpuModal = document.getElementById('cpuProcessorModal');
  if (cpuModal && !cpuModal.classList.contains('hidden')) {
    return;
  }
  if (!isHolstered) {
    const curItem = combatEquipmentList[combatEquipIdx];
    if (curItem.id === 'engineering') {
      // 1. 工程器械电弧放电攻击
      playUiSound('zap');
      const arm = document.getElementById('armEngineering');
      const arc = document.getElementById('arcEffect');
      if (arm) arm.style.transform = 'translate(10px, -8px) rotate(-1deg)';
      if (arc) arc.style.transform = 'scale(1.8)';
      setTimeout(() => {
        if (arm) arm.style.transform = '';
        if (arc) arc.style.transform = '';
      }, 120);
    } else if (curItem.id === 'luopan') {
      // 2. 罗盘探测：天池磁针旋转与地脉波动
      playUiSound('toggle');
      const arm = document.getElementById('armLuopan');
      const needle = document.getElementById('luopanNeedle');
      if (arm) arm.style.transform = 'translate(-6px, -14px) scale(1.04)';
      if (needle) needle.style.transform = 'rotate(225deg)';
      setTimeout(() => {
        if (arm) arm.style.transform = '';
        if (needle) needle.style.transform = 'rotate(45deg)';
      }, 250);
      showNotification('【罗盘探测】地脉灵气共鸣，灵穴丰度已标定 (点击或按 Tab 可展开全息中枢)');
      const invModal = document.getElementById('invModal');
      if (invModal && invModal.classList.contains('hidden') && typeof toggleInventoryModal === 'function') {
        toggleInventoryModal('main');
      }
    } else if (curItem.id === 'sword_casket') {
      // 3. 剑匣挥斩：剑气破空与飞剑出鞘剑鸣
      playUiSound('sword_draw');
      const arm = document.getElementById('armCasket');
      const aura = document.getElementById('casketSlashBeam');
      if (arm) arm.style.transform = 'translate(-14px, -20px) rotate(-3deg)';
      if (aura) {
        aura.style.opacity = '1';
        aura.style.transform = 'scale(1.3) rotate(-10deg)';
      }
      setTimeout(() => {
        if (arm) arm.style.transform = '';
        if (aura) {
          aura.style.opacity = '0';
          aura.style.transform = 'scale(1)';
        }
      }, 220);
      showNotification('【天罡剑匣·剑气出鞘】四象飞剑掠空护体，剑气横扫！');
    }
  }
});

// 键盘全局按键绑定 (Q, C, Tab, M, N, F, V, H, SPACE, 1-0, ESC)
document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === 'INPUT' && e.key !== 'Escape') {
    return;
  }

  // 空格键长按敲打制作
  if (e.code === 'Space') {
    const craftModal = document.getElementById('craftModal');
    if (craftModal && !craftModal.classList.contains('hidden')) {
      e.preventDefault();
      startCraftingHold();
      return;
    }
    const buildModal = document.getElementById('buildModal');
    if (buildModal && !buildModal.classList.contains('hidden')) {
      e.preventDefault();
      document.getElementById('buildSearchInput')?.focus();
      return;
    }
  }

  const key = e.key.toUpperCase();

  // 若中央处理器连线工控台处于打开状态，只允许 ESC 或 M 响应关闭，其余按键不触发大视界快捷键
  const cpuModal = document.getElementById('cpuProcessorModal');
  if (cpuModal && !cpuModal.classList.contains('hidden')) {
    if (key === 'ESCAPE' || key === 'M') {
      e.preventDefault();
      if (typeof closeCentralProcessorHUD === 'function') closeCentralProcessorHUD();
    }
    return;
  }

  if (key === 'C') {
    e.preventDefault();
    triggerVehicleAction();
  } else if (key === 'E') {
    e.preventDefault();
    const storageBoxModal = document.getElementById('storageBoxModal');
    if (storageBoxModal && !storageBoxModal.classList.contains('hidden')) {
      if (typeof closeStorageBoxModal === 'function') closeStorageBoxModal();
      else storageBoxModal.classList.add('hidden');
      return;
    }
    const machineModal = document.getElementById('machineModal');
    if (machineModal && !machineModal.classList.contains('hidden')) {
      closeMachineHUD();
      return;
    }
    if (targetedMachineId) {
      if (typeof triggerTargetMachineInteract === 'function') {
        triggerTargetMachineInteract();
      } else if (targetedMachineId === 'storage_box') {
        if (typeof openStorageBoxModal === 'function') openStorageBoxModal();
      } else {
        openMachineHUD(targetedMachineId);
      }
    } else {
      openMachineHUD('smelter');
    }
  } else if (key === 'Q') {
    e.preventDefault();
    toggleBuildMenu();
  } else if (key === 'TAB') {
    e.preventDefault();
    toggleInventoryModal();
  } else if (key === 'M') {
    e.preventDefault();
    triggerMapAction();
  } else if (key === 'N') {
    e.preventDefault();
    if (typeof toggleFabaoModal === 'function') {
      toggleFabaoModal();
    } else {
      toggleSearchModal();
    }
  } else if (key === 'F') {
    e.preventDefault();
    toggleDismantleMode();
  } else if (key === 'V') {
    e.preventDefault();
    toggleFlashlight();
  } else if (key === 'H') {
    e.preventDefault();
    toggleHolster();
  } else if (key === 'T') {
    e.preventDefault();
    toggleCinematicMode();
  } else if (key === 'R') {
    if (isBuildPlacingMode && typeof updateBuildPlacementHudCard === 'function') {
      e.preventDefault();
      playUiSound('toggle');
      showNotification('【建造模式切换】当前模式: 默认');
    }
  } else if (key === 'X') {
    e.preventDefault();
    toggleCodexModal();
  } else if (key === 'G') {
    if (isDismantleMode) {
      e.preventDefault();
      playUiSound('toggle');
      showNotification('【拆除筛选条件】已设为: 全部工业建筑与设施');
    }
  } else if (key === 'ESCAPE') {
    // 关闭所有窗口与模式
    document.getElementById('buildModal')?.classList.add('hidden');
    document.getElementById('craftModal')?.classList.add('hidden');
    document.getElementById('invModal')?.classList.add('hidden');
    document.getElementById('searchModal')?.classList.add('hidden');
    document.getElementById('machineModal')?.classList.add('hidden');
    document.getElementById('storageBoxModal')?.classList.add('hidden');
    document.getElementById('swordCasketModal')?.classList.add('hidden');
    document.getElementById('hubMilestoneModal')?.classList.add('hidden');
    document.getElementById('codexModal')?.classList.add('hidden');
    document.getElementById('cpuProcessorModal')?.classList.add('hidden');
    document.getElementById('jinShenModal')?.classList.add('hidden');
    document.getElementById('fabaoModal')?.classList.add('hidden');
    if (typeof closeCentralProcessorHUD === 'function') closeCentralProcessorHUD();
    if (typeof exitBuildPlacingMode === 'function') exitBuildPlacingMode();
    if (typeof closeAdaDialogue === 'function') closeAdaDialogue();
    if (typeof stopCraftingHold === 'function') stopCraftingHold();
    if (isCinematic) toggleCinematicMode();
    if (isDismantleMode) toggleDismantleMode();
  } else if (/^[1-5]$/.test(e.key)) {
    const slot = parseInt(e.key);
    const catMap = { 1: 'prod', 2: 'logi', 3: 'struct', 4: 'power', 5: 'aux' };
    if (catMap[slot]) {
      selectDspCategory(catMap[slot]);
    }
  }
});

// 键盘松开事件 (空格键停止打铁)
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    if (typeof stopCraftingHold === 'function') stopCraftingHold();
  }
});

// 罗盘鼠标视差跟随
document.addEventListener('mousemove', (e) => {
  const xRatio = (e.clientX / window.innerWidth) - 0.5;
  const compassTrack = document.getElementById('compassTrack');
  if (compassTrack) {
    const offsetPx = xRatio * -70;
    compassTrack.style.transform = `translateX(${offsetPx}px)`;
  }
});

// =========================================================================
// 法典 (Codex 百科全书) 弹窗控制逻辑
// =========================================================================
function toggleCodexModal() {
  playUiSound('click');
  if (typeof closeOtherModals === 'function') closeOtherModals('codexModal');
  const modal = document.getElementById('codexModal');
  if (modal) {
    const isOpen = !modal.classList.contains('hidden');
    if (isOpen) {
      modal.classList.add('hidden');
    } else {
      modal.classList.remove('hidden');
      showNotification('已展开【天工法典】(百科全书: 建筑、物料、配方与装备)');
    }
  }
}

function switchCodexTab(tabName) {
  playUiSound('click');
  document.querySelectorAll('.codex-tab-btn').forEach(btn => {
    btn.classList.remove('bg-white/20', 'text-white', 'border-[#00f0ff]', 'bg-amber-500/20', 'text-amber-300', 'border-amber-400');
    btn.classList.add('text-white/60', 'border-transparent');
  });
  document.querySelectorAll('.codex-tab-pane').forEach(pane => pane.classList.add('hidden'));

  const activeBtn = document.getElementById(`codexTabBtn_${tabName}`);
  const activePane = document.getElementById(`codexPane_${tabName}`);
  if (activeBtn) {
    if (tabName === 'search') {
      activeBtn.classList.add('bg-amber-500/20', 'text-amber-300', 'border-amber-400');
      activeBtn.classList.remove('text-white/60', 'border-transparent');
    } else {
      activeBtn.classList.add('bg-white/20', 'text-white', 'border-[#00f0ff]');
      activeBtn.classList.remove('text-white/60', 'border-transparent');
    }
  }
  if (activePane) activePane.classList.remove('hidden');

  if (tabName === 'search') {
    const input = document.getElementById('codexSearchInput');
    if (input) {
      input.focus();
      handleCodexSearchCalc(input.value);
    }
  }
}

// =========================================================================
// 天工法典：万象检索与算式计算器 (从原 N 键迁移至法典并深度打通游戏全数据库)
// =========================================================================
function handleCodexSearchCalc(query) {
  const q = (query || '').trim();
  const resultTextElem = document.getElementById('codexCalcResultText');
  const countElem = document.getElementById('codexSearchCount');
  const container = document.getElementById('codexSearchResultsContainer');
  if (!container) return;

  // 1. 若当前并非在 search tab，且用户输入了内容，自动切换到 search tab 呈现
  if (q.length > 0) {
    const searchPane = document.getElementById('codexPane_search');
    if (searchPane && searchPane.classList.contains('hidden')) {
      switchCodexTab('search');
    }
  }

  // 2. 算式解析器 (安全数学计算，仅允许合法算术字符)
  let calcOutput = null;
  const isMathExpr = /^[\d\s\+\-\*\/\.\(\)\^%]+$/.test(q) && /[\+\-\*\/]/.test(q);
  if (isMathExpr) {
    try {
      const sanitized = q.replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const calcVal = Function(`'use strict'; return (${sanitized});`)();
      if (typeof calcVal === 'number' && !isNaN(calcVal) && isFinite(calcVal)) {
        calcOutput = Number.isInteger(calcVal) ? calcVal : parseFloat(calcVal.toFixed(3));
        if (resultTextElem) {
          resultTextElem.innerHTML = `<span class="text-white font-mono">${q}</span> = <span class="text-amber-400 font-mono font-black text-lg">${calcOutput}</span> <span class="text-[11px] text-emerald-400 font-normal ml-2">✓ 算式测算完成</span>`;
        }
      }
    } catch (err) {
      // 正在输入中，暂不报错
    }
  }

  if (!calcOutput && resultTextElem) {
    if (q.length === 0) {
      resultTextElem.innerText = '请输入算式 (如 120/4) 或输入关键字检索物料/建筑/配方...';
    } else {
      resultTextElem.innerHTML = `正在检索关键字: <span class="text-amber-300 font-mono font-bold">"${q}"</span>`;
    }
  }

  // 3. 全局多维数据库检索
  container.innerHTML = '';
  const searchResults = [];
  const lowerQ = q.toLowerCase();

  // A. 检索物料 (XIUXIAN_ITEMS)
  if (typeof XIUXIAN_ITEMS !== 'undefined') {
    Object.values(XIUXIAN_ITEMS).forEach(item => {
      if (!lowerQ || item.name.toLowerCase().includes(lowerQ) || (item.matId && item.matId.toLowerCase().includes(lowerQ)) || item.category.toLowerCase().includes(lowerQ)) {
        searchResults.push({
          type: '物料材料',
          typeColor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
          title: `${item.name} (${item.matId || item.id})`,
          badge: item.category,
          desc: item.desc || `标准堆叠: ${item.stack || 100}`,
          icon: item.icon || 'fa-solid fa-cube text-amber-400',
          action: () => switchCodexTab('materials')
        });
      }
    });
  }

  // B. 检索建筑 (XIUXIAN_BUILDINGS)
  if (typeof XIUXIAN_BUILDINGS !== 'undefined') {
    Object.values(XIUXIAN_BUILDINGS).forEach(b => {
      if (!lowerQ || b.name.toLowerCase().includes(lowerQ) || (b.code && b.code.toLowerCase().includes(lowerQ)) || (b.typeDesc && b.typeDesc.toLowerCase().includes(lowerQ))) {
        searchResults.push({
          type: '工业建筑',
          typeColor: 'text-[#00f0ff] border-[#00f0ff]/30 bg-[#00f0ff]/10',
          title: `${b.name} (${b.code || b.id})`,
          badge: b.typeDesc || b.category,
          desc: b.desc || `标准能耗: ${b.power} MW`,
          icon: 'fa-solid fa-industry text-[#00f0ff]',
          action: () => switchCodexTab('buildings')
        });
      }
    });
  }

  // C. 检索配方 (XIUXIAN_RECIPES)
  if (typeof XIUXIAN_RECIPES !== 'undefined') {
    Object.values(XIUXIAN_RECIPES).forEach(r => {
      if (!lowerQ || r.name.toLowerCase().includes(lowerQ) || (r.category && r.category.toLowerCase().includes(lowerQ))) {
        const inStr = (r.inputs || []).map(i => `${i.count || i.amount || ''}${i.item || i.name}`).join(' + ');
        const outStr = (r.outputs || []).map(o => `${o.count || o.amount || ''}${o.item || o.name}`).join(' + ');
        searchResults.push({
          type: '加工配方',
          typeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
          title: `配方: ${r.name}`,
          badge: `${r.timeSec || 0}秒`,
          desc: inStr && outStr ? `${inStr} ➔ ${outStr}` : (r.desc || '工控合成配方'),
          icon: 'fa-solid fa-scroll text-emerald-400',
          action: () => switchCodexTab('recipes')
        });
      }
    });
  }

  // D. 检索法宝支线材料 (FABAO_MATERIALS_CONFIG)
  if (typeof FABAO_MATERIALS_CONFIG !== 'undefined') {
    Object.values(FABAO_MATERIALS_CONFIG).forEach(f => {
      if (!lowerQ || f.name.toLowerCase().includes(lowerQ) || f.category.toLowerCase().includes(lowerQ)) {
        searchResults.push({
          type: '法宝支线',
          typeColor: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
          title: `${f.name} (${f.matId || ''})`,
          badge: f.category,
          desc: f.desc || '官方策划案法宝专属材料',
          icon: f.icon || 'fa-solid fa-scroll text-yellow-400',
          action: () => {
            if (typeof toggleFabaoModal === 'function') {
              toggleCodexModal();
              toggleFabaoModal();
            }
          }
        });
      }
    });
  }

  if (countElem) countElem.innerText = searchResults.length;

  const displayItems = searchResults.slice(0, 30);
  if (displayItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 py-8 text-center text-white/40 text-xs">
        <i class="fa-solid fa-magnifying-glass mb-2 text-xl block"></i>
        未找到与 "${q}" 匹配的条目，请尝试输入其他关键词或数学算式
      </div>
    `;
    return;
  }

  displayItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/60 rounded-lg cursor-pointer transition flex items-start space-x-2.5 group';
    card.innerHTML = `
      <div class="w-8 h-8 rounded bg-black/40 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
        <i class="${item.icon} text-sm"></i>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-0.5">
          <span class="text-xs font-bold text-white group-hover:text-emerald-300 truncate">${item.title}</span>
          <span class="text-[9px] px-1.5 py-0.5 rounded border ${item.typeColor} font-mono shrink-0 ml-1">${item.badge}</span>
        </div>
        <p class="text-[10px] text-white/50 line-clamp-1 truncate">${item.desc}</p>
      </div>
    `;
    card.onclick = () => {
      playUiSound('click');
      if (item.action) item.action();
    };
    container.appendChild(card);
  });
}

// 页面载入初始化
window.addEventListener('DOMContentLoaded', () => {
  if (typeof syncInventoryDisplay === 'function') {
    syncInventoryDisplay();
  }
  // 初始化装备栏显示
  if (typeof updateCombatEquipmentUI === 'function') {
    updateCombatEquipmentUI(false);
  }
  // 初始化戴森球建筑分类筛选快捷栏 (纯中文按钮)
  if (typeof selectDspCategory === 'function') {
    selectDspCategory('prod');
  }
  // 初始化 Q 键建筑建造树形卡片 (纯官方数据库 XIUXIAN_BUILDINGS 驱动)
  if (typeof renderBuildingListTree === 'function') {
    renderBuildingListTree('prod');
  }
  // 默认选中精炼炉 (BD_102)
  if (typeof selectBuildingItem === 'function') {
    selectBuildingItem('smelter');
  }
  // 动态同步右上角阶段里程碑追踪 (纯官方数据库 XIUXIAN_ITEMS 驱动)
  if (typeof syncMilestoneTrackerDisplay === 'function') {
    syncMilestoneTrackerDisplay();
  }
});

// 全局鼠标滚轮装备切换 与 Alt+滚轮快捷栏组切换
window.addEventListener('wheel', (e) => {
  // 1. 按下 Alt + 滚轮：在 10 组快捷栏之间快速切换 (1-10)
  if (e.altKey) {
    e.preventDefault();
    if (e.deltaY < 0) {
      switchHotbarGroupRelative(-1);
    } else if (e.deltaY > 0) {
      switchHotbarGroupRelative(1);
    }
    return;
  }

  // 2. 如果当前有模态弹窗处于打开状态，不劫持滚轮事件
  const openModal = document.querySelector('#buildModal:not(.hidden), #craftModal:not(.hidden), #invModal:not(.hidden), #searchModal:not(.hidden), #machineModal:not(.hidden), #storageBoxModal:not(.hidden), #hubMilestoneModal:not(.hidden), #codexModal:not(.hidden)');
  if (openModal) return;

  // 如果事件发生在特定的滚动容器内（如背包、建造列表），不拦截
  if (e.target.closest('#bagGrid72Container') || e.target.closest('.overflow-y-auto') || e.target.closest('#buildGridContainer')) {
    return;
  }

  // 3. 正常无弹窗状态下：滚轮切换手持装备 (罗盘 / 剑匣 / 工程器械)
  if (e.deltaY < 0) {
    cycleCombatEquipment(-1);
  } else if (e.deltaY > 0) {
    cycleCombatEquipment(1);
  }
}, { passive: false });

// =========================================================================
// 策划案 2×5 快捷面板核心动作函数 (未解锁/情境交互提示)
// =========================================================================
let isMapUnlocked = false; // 地图需 MAM 研究解锁
let isInVehicle = false;    // 是否处于载具中

// [M] 地图动作响应
function triggerMapAction() {
  if (!isMapUnlocked) {
    playUiSound('error');
    showNotification('【地图未解锁】当前尚未在 MAM 科技树中完成地脉图谱研究！');
  } else {
    playUiSound('click');
    showNotification('【全域地图】已展开地脉矿点与标记地图');
  }
}

// [蓝图台] 蓝图设计器动作响应
function triggerBlueprintAction() {
  playUiSound('click');
  showNotification('【蓝图设计器】需在 Q 建设菜单中建造蓝图设计器，走近即可交互设计！');
}

// [C] 载具驾驶交互动作响应
function triggerVehicleAction() {
  if (!isInVehicle) {
    playUiSound('error');
    showNotification('【载具未就绪】当前处于步行状态，靠近拖拉机/载具后按 [C] 打开驾驶界面！');
  } else {
    playUiSound('click');
    showNotification('【载具界面】燃料仓已就绪，已启用自动驾驶路线记录');
  }
}

