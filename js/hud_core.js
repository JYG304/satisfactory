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
// 官方建筑数据表驱动引擎 (100% 读表 XIUXIAN_BUILDINGS & XIUXIAN_ITEMS，消除硬编码)
// =========================================================================

// 工业矢量 SVG 生成器 (为数据表中的各类工业建筑自适应生成 Satisfactory 美学矢量图标)
function getBuildingSvg(bld, key) {
  const grp = bld.group || 'prod';
  const k = (key || bld.id || '').toLowerCase();

  if (k === 'furnace' || k === 'smelter') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><ellipse cx="80" cy="142" rx="48" ry="12" fill="rgba(0,0,0,0.5)"/><rect x="68" y="24" width="24" height="20" rx="2" fill="#20242d" stroke="#111" stroke-width="2"/><line x1="64" y1="24" x2="96" y2="24" stroke="#f5921e" stroke-width="3"/><path d="M 38 138 L 48 44 L 112 44 L 122 138 Z" fill="#272d38" stroke="#12161f" stroke-width="3"/><polygon points="54,52 106,52 114,130 46,130" fill="#f5921e" stroke="#111" stroke-width="2"/><rect x="64" y="85" width="32" height="36" rx="3" fill="#15171d" stroke="#000" stroke-width="2"/><rect x="68" y="90" width="24" height="26" rx="2" fill="#ff5500" class="animate-pulse shadow-[inset_0_0_10px_#ffeb3b]"/><line x1="68" y1="98" x2="92" y2="98" stroke="#ffd000" stroke-width="2"/><line x1="68" y1="106" x2="92" y2="106" stroke="#ffd000" stroke-width="2"/><rect x="60" y="128" width="40" height="14" fill="#12151c" stroke="#333" stroke-width="1.5"/><rect x="68" y="132" width="24" height="6" fill="#ffd400"/></svg>`;
  }
  if (k === 'miner') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><polygon points="30,140 45,100 115,100 130,140" fill="#1b2029" stroke="#111"/><rect x="45" y="70" width="70" height="40" fill="#e0770b" stroke="#111" stroke-width="2"/><rect x="68" y="25" width="24" height="45" fill="#3d4657" stroke="#111"/><polygon points="80,142 65,115 95,115" fill="#ffd400"/></svg>`;
  }
  if (k === 'crusher') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="35" y="45" width="90" height="85" rx="4" fill="#293241" stroke="#111" stroke-width="2"/><polygon points="50,60 80,95 110,60" fill="#e0770b"/><line x1="80" y1="95" x2="80" y2="120" stroke="#f5921e" stroke-width="3"/></svg>`;
  }
  if (k === 'assembler') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="25" y="40" width="110" height="90" rx="6" fill="#242c38" stroke="#111" stroke-width="3"/><rect x="35" y="50" width="40" height="70" fill="#f5921e"/><rect x="85" y="50" width="40" height="70" fill="#e0770b"/><circle cx="55" cy="85" r="12" fill="#111"/><circle cx="105" cy="85" r="12" fill="#111"/></svg>`;
  }
  if (k === 'cutter' || k === 'constructor') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><polygon points="25,138 45,100 115,100 135,138" fill="#20252f" stroke="#111" stroke-width="2"/><rect x="38" y="45" width="84" height="18" rx="2" fill="#e57d07" stroke="#111" stroke-width="2"/><rect x="36" y="60" width="14" height="42" fill="#2b313d"/><rect x="110" y="60" width="14" height="42" fill="#2b313d"/><rect x="68" y="58" width="24" height="20" fill="#ffd400"/><line x1="80" y1="78" x2="80" y2="108" stroke="#7fe8ff" stroke-width="3" stroke-linecap="round"/></svg>`;
  }
  if (k === 'centrifuge') {
    return `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="45" y="55" width="90" height="90" rx="6" fill="#1c2533" stroke="#111" stroke-width="2"/><circle cx="90" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 4" class="animate-spin"/></svg>`;
  }
  if (k === 'deconstructor') {
    return `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="40" y="50" width="100" height="95" rx="4" fill="#2b2025" stroke="#f43f5e" stroke-width="2"/><line x1="55" y1="65" x2="125" y2="135" stroke="#f43f5e" stroke-width="3"/><line x1="125" y1="65" x2="55" y2="135" stroke="#f43f5e" stroke-width="3"/></svg>`;
  }
  if (k === 'incubator' || k === 'petri_dish') {
    return `<svg viewBox="0 0 200 180" class="w-full h-full drop-shadow"><rect x="45" y="45" width="110" height="100" rx="6" fill="#142820" stroke="#10b981" stroke-width="2"/><circle cx="100" cy="95" r="26" fill="#059669" class="animate-pulse"/></svg>`;
  }
  if (k === 'extractor') {
    return `<svg viewBox="0 0 180 160" class="w-full h-full drop-shadow"><rect x="40" y="40" width="100" height="90" rx="4" fill="#202938" stroke="#111" stroke-width="2"/><circle cx="90" cy="85" r="22" fill="#00f0ff" opacity="0.8"/></svg>`;
  }
  if (k === 'mixer') {
    return `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="45" y="45" width="90" height="90" rx="6" fill="#1e293b" stroke="#00f0ff" stroke-width="2"/><circle cx="90" cy="90" r="22" fill="#0284c7"/><line x1="90" y1="50" x2="90" y2="130" stroke="#fff" stroke-width="3"/></svg>`;
  }
  if (k === 'assembler_heavy') {
    return `<svg viewBox="0 0 200 180" class="w-full h-full drop-shadow"><rect x="30" y="45" width="140" height="90" rx="8" fill="#1e293b" stroke="#00f0ff" stroke-width="3"/><rect x="45" y="60" width="45" height="60" fill="#f5921e"/><rect x="110" y="60" width="45" height="60" fill="#00f0ff"/></svg>`;
  }
  if (k === 'smelt_chamber') {
    return `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="40" y="45" width="100" height="90" rx="6" fill="#3f1d1d" stroke="#ef4444" stroke-width="2"/><circle cx="90" cy="90" r="25" fill="#f97316" class="animate-ping opacity-75"/></svg>`;
  }
  if (k.includes('conveyor') || k.includes('splitter') || k.includes('merger') || k.includes('pipe') || grp === 'logi') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full text-cyan-400"><rect x="25" y="65" width="110" height="30" rx="4" fill="#1f2937" stroke="#38bdf8" stroke-width="2"/><polygon points="65,72 85,80 65,88" fill="#38bdf8"/><polygon points="90,72 110,80 90,88" fill="#38bdf8"/></svg>`;
  }
  if (k.includes('power') || grp === 'power') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full text-yellow-400"><rect x="35" y="45" width="90" height="85" rx="6" fill="#1c1917" stroke="#eab308" stroke-width="2"/><polygon points="85,55 65,85 82,85 75,115 95,85 78,85" fill="#facc15"/></svg>`;
  }
  if (k.includes('foundation') || k.includes('beam') || k.includes('table') || grp === 'org' || grp === 'struct') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full text-stone-300"><polygon points="80,45 140,75 80,105 20,75" fill="#374151" stroke="#9ca3af" stroke-width="2"/><polygon points="20,75 80,105 80,125 20,95" fill="#1f2937" stroke="#9ca3af" stroke-width="1.5"/><polygon points="140,75 80,105 80,125 140,95" fill="#111827" stroke="#9ca3af" stroke-width="1.5"/></svg>`;
  }
  if (k === 'storage_box' || k === 'storage_box_large') {
    return `<svg viewBox="0 0 160 160" class="w-full h-full text-amber-300"><rect x="35" y="45" width="90" height="75" rx="3" fill="#e0770b" stroke="#111" stroke-width="3"/><rect x="65" y="70" width="30" height="20" fill="#111"/></svg>`;
  }
  if (k === 'refining_bench' || k === 'tribulation_platform' || k === 'teleporter' || k === 'portal' || grp === 'special') {
    return `<svg viewBox="0 0 180 180" class="w-full h-full drop-shadow"><rect x="30" y="40" width="120" height="100" rx="8" fill="#1b172a" stroke="#ffd700" stroke-width="3"/><circle cx="90" cy="90" r="30" fill="#a855f7" class="animate-pulse"/></svg>`;
  }
  return `<svg viewBox="0 0 160 160" class="w-full h-full drop-shadow"><rect x="35" y="45" width="90" height="80" rx="4" fill="#1e293b" stroke="#f5921e" stroke-width="2"/><circle cx="80" cy="85" r="20" fill="#f5921e" opacity="0.6"/></svg>`;
}

// 动态读表生成建筑数据库 (完全读取 XIUXIAN_BUILDINGS 与 XIUXIAN_ITEMS，消除硬编码)
function buildDatabaseFromTable() {
  const db = {};
  if (typeof XIUXIAN_BUILDINGS !== 'undefined') {
    Object.entries(XIUXIAN_BUILDINGS).forEach(([key, b]) => {
      let grp = b.group;
      if (!grp) {
        if (b.category === '生产' || b.category === '生产/辅助') grp = 'prod';
        else if (b.category === '物流') grp = 'logi';
        else if (b.category === '建筑' || b.category === '仓储') grp = 'org';
        else if (b.category === '电力') grp = 'power';
        else grp = 'special';
      }

      const costs = (b.costs || []).map(c => {
        const item = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[c.code]) ? XIUXIAN_ITEMS[c.code] : null;
        let iconCls = 'fa-cube';
        if (item && item.icon) {
          const match = item.icon.match(/fa-[a-z0-9-]+/g);
          if (match && match.length > 0) iconCls = match[match.length - 1];
        }
        return {
          code: c.code,
          need: c.need,
          name: item ? item.name : (c.name || c.code),
          icon: iconCls
        };
      });

      let powerText = '0MW';
      if (b.power !== undefined) {
        if (b.power > 0) powerText = `${b.power}MW`;
        else if (b.power < 0) powerText = `+${Math.abs(b.power)}MW`;
      }

      db[key] = {
        key: key,
        code: b.code || key,
        title: `${b.name} (${b.code || key})`,
        name: b.name,
        group: grp,
        desc: b.desc || '《修仙工厂》标准工业建筑设施。',
        power: powerText,
        heat: b.heat || 0,
        costs: costs,
        svg: getBuildingSvg(b, key)
      };
    });
  }
  return db;
}

// 动态读表生成戴森球风格建筑分类快捷栏 (完全读取 XIUXIAN_BUILDINGS)
function getDspBuildCategoriesFromTable() {
  const meta = [
    { id: 'prod', name: '生产制造', subTitle: '采矿·精炼·加工', shortcut: '1', filterGroup: 'prod' },
    { id: 'logi', name: '传送物流', subTitle: '传送带·分流·管网', shortcut: '2', filterGroup: 'logi' },
    { id: 'struct', name: '地基结构', subTitle: '地基·玄铁梁·置物桌', shortcut: '3', filterGroup: 'org' },
    { id: 'power', name: '能源供电', subTitle: '供能机·灵力引擎', shortcut: '4', filterGroup: 'power' },
    { id: 'aux', name: '辅助设施', subTitle: '箱子·大箱子·传送门', shortcut: '5', filterGroup: ['aux', 'special'] }
  ];

  const db = buildDatabaseFromTable();
  return meta.map(cat => {
    const blds = Object.values(db).filter(b => {
      if (Array.isArray(cat.filterGroup)) return cat.filterGroup.includes(b.group);
      return b.group === cat.filterGroup;
    });

    const descList = blds.map(b => b.name).slice(0, 10).join('、');
    return {
      id: cat.id,
      name: cat.name,
      subTitle: cat.subTitle,
      shortcut: cat.shortcut,
      desc: descList,
      buildings: blds.map(b => {
        const costSummary = b.costs.slice(0, 2).map(c => `${c.name.replace('工业', '').replace('玄铁', '玄铁')}×${c.need}`).join(' ') || '基础材料';
        return {
          key: b.key,
          code: b.code,
          name: b.name,
          sub: b.power !== '0MW' ? b.power : '无功耗',
          desc: b.desc,
          costText: costSummary
        };
      })
    };
  });
}

// 全局读表动态实例
let buildingDatabase = buildDatabaseFromTable();
let DSP_BUILD_CATEGORIES = getDspBuildCategoriesFromTable();
window.buildingDatabase = buildingDatabase;
window.DSP_BUILD_CATEGORIES = DSP_BUILD_CATEGORIES;
window.buildDatabaseFromTable = buildDatabaseFromTable;
window.getDspBuildCategoriesFromTable = getDspBuildCategoriesFromTable;

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

// 关闭除了当前之外的其它所有弹窗 (严格全局 HUD 互斥)
function closeOtherModals(current) {
  if (typeof window.ALL_HUD_MODAL_IDS !== 'undefined') {
    window.ALL_HUD_MODAL_IDS.forEach(id => {
      if (id !== current) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      }
    });
  } else {
    ['buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal', 'swordCasketModal', 'hubMilestoneModal', 'codexModal', 'cpuProcessorModal', 'jinShenModal', 'fabaoModal'].forEach(id => {
      if (id !== current) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      }
    });
  }
  if (current !== 'buildModal' && typeof exitBuildPlacingMode === 'function') {
    exitBuildPlacingMode();
  }
}
window.closeOtherModals = closeOtherModals;

// 确保 buildingDatabase 动态读表
if (typeof buildDatabaseFromTable === 'function') {
  buildingDatabase = buildDatabaseFromTable();
}

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

// 同步 HUD 右上角里程碑物料追踪卡片 (严格对接官方 XIUXIAN_MILESTONES 与 XIUXIAN_ITEMS)
function syncMilestoneTrackerDisplay() {
  const container = document.getElementById('hudMilestoneCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  const cfg = (typeof getCurrentMilestoneConfig === 'function') 
    ? getCurrentMilestoneConfig() 
    : ((typeof XIUXIAN_MILESTONES !== 'undefined' && XIUXIAN_MILESTONES[1]) ? XIUXIAN_MILESTONES[1] : null);

  const requirements = cfg ? cfg.requirements : [
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
    } else {
      compassWrapper.classList.remove('compass-luopan-active');
    }
  }
}

// =========================================================================
// 全局事件监听器绑定
// =========================================================================

// 点击大视界任意区域：当前手持装备攻击与交互联动 (带严格 HUD 互斥)
document.addEventListener('click', (e) => {
  // 1. 严格 HUD 互斥：若当前有任何界面/模态窗打开，点击任何地方均不触发手持装备攻击与交互！
  if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
    return;
  }
  // 2. 避免点击在模态弹窗内穿透
  if (e.target.closest('#buildModal, #craftModal, #invModal, #searchModal, #machineModal, #storageBoxModal, #swordCasketModal, #hubMilestoneModal, #codexModal, #cpuProcessorModal, #jinShenModal, #fabaoModal')) {
    return;
  }
  // 3. 避免点击交互控件触发攻击
  if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('a') || e.target.closest('.build-item-card')) {
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
      // 2. 罗盘探测：天池磁针旋转与地脉波动 (不自动打开全屏大界面，保持纯净探测)
      playUiSound('toggle');
      const arm = document.getElementById('armLuopan');
      const needle = document.getElementById('luopanNeedle');
      if (arm) arm.style.transform = 'translate(-6px, -14px) scale(1.04)';
      if (needle) needle.style.transform = 'rotate(225deg)';
      setTimeout(() => {
        if (arm) arm.style.transform = '';
        if (needle) needle.style.transform = 'rotate(45deg)';
      }, 250);
      showNotification('【罗盘探测】地脉灵气共鸣，灵穴丰度已标定 (按 [Tab] 可展开全息中枢)');
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
  // 严格杜绝事件穿透：所有 HUD 模态弹窗内部阻止 mousedown 和 click 向下穿透到视界！
  const modalIds = window.ALL_HUD_MODAL_IDS || [
    'buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal',
    'storageBoxModal', 'swordCasketModal', 'hubMilestoneModal', 'codexModal',
    'cpuProcessorModal', 'jinShenModal', 'fabaoModal'
  ];
  modalIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('mousedown', (e) => e.stopPropagation());
      el.addEventListener('click', (e) => e.stopPropagation());
    }
  });

  if (typeof syncInventoryDisplay === 'function') {
    syncInventoryDisplay();
  }
  // 初始化装备栏显示
  if (typeof updateCombatEquipmentUI === 'function') {
    updateCombatEquipmentUI(false);
  }
  // 初始化戴森球建筑分类筛选快捷栏 (动态读表)
  if (typeof selectDspCategory === 'function') {
    selectDspCategory('prod');
  }
  // 初始化 Q 键建筑建造树形卡片 (动态读表 XIUXIAN_BUILDINGS 驱动)
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

  // 2. 如果当前有任何模态弹窗处于打开状态，不劫持滚轮事件
  if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
    return;
  }

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

