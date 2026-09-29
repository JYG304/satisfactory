// ====================================================================
// js/world_buildings.js - 动态世界建筑、建造模式与3秒右键拆除系统
// 1:1 还原用户截图 media_1790442746779.png / 47796.png / 48700.png
// ====================================================================

// 建筑视觉 SVG 库 (支持世界空间缩放与交互)
const buildingSvgTemplates = {
  miner: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 200 200">
    <ellipse cx="100" cy="180" rx="70" ry="14" fill="rgba(0,0,0,0.4)"/>
    <polygon points="40,175 60,110 140,110 160,175" fill="#1b2029" stroke="#12161f" stroke-width="2.5"/>
    <rect x="60" y="70" width="80" height="50" rx="2" fill="#e0770b" stroke="#12161f" stroke-width="2.5"/>
    <rect x="70" y="80" width="24" height="24" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
    <rect x="85" y="35" width="30" height="60" rx="3" fill="#3d4657" stroke="#12161f" stroke-width="2"/>
    <g class="drill-active">
      <polygon points="100,190 82,145 118,145" fill="#ffd400" stroke="#111" stroke-width="2"/>
      <line x1="90" y1="150" x2="110" y2="150" stroke="#333" stroke-width="3"/>
    </g>
    <circle cx="95" cy="186" r="3" fill="#ffe066" class="animate-ping"/>
  </svg>`,
  
  smelter: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 180 200">
    <ellipse cx="90" cy="180" rx="60" ry="14" fill="rgba(0,0,0,0.4)"/>
    <g class="steam-particle" transform="translate(90, 30)">
      <circle cx="-6" cy="0" r="10" fill="rgba(255,255,255,0.4)" filter="blur(2px)"/>
      <circle cx="8" cy="-8" r="14" fill="rgba(255,200,150,0.3)" filter="blur(3px)"/>
    </g>
    <rect x="76" y="28" width="28" height="24" rx="2" fill="#20242d" stroke="#111" stroke-width="2"/>
    <line x1="72" y1="28" x2="108" y2="28" stroke="#f5921e" stroke-width="3"/>
    <path d="M 40 175 L 52 52 L 128 52 L 140 175 Z" fill="#272d38" stroke="#12161f" stroke-width="3"/>
    <polygon points="58,62 122,62 130,165 50,165" fill="#f5921e" stroke="#111" stroke-width="2"/>
    <rect x="72" y="105" width="36" height="42" rx="3" fill="#15171d" stroke="#000" stroke-width="2"/>
    <rect x="76" y="110" width="28" height="32" rx="2" fill="#ff4d00" class="animate-pulse shadow-[inset_0_0_12px_#ffeb3b]"/>
    <rect x="68" y="162" width="44" height="16" fill="#12151c" stroke="#333" stroke-width="1.5"/>
    <rect x="78" y="166" width="24" height="8" fill="#ffd400"/>
  </svg>`,

  constructor: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 210 200">
    <ellipse cx="105" cy="182" rx="75" ry="15" fill="rgba(0,0,0,0.4)"/>
    <polygon points="25,180 50,135 160,135 185,180" fill="#20252f" stroke="#111" stroke-width="2.5"/>
    <rect x="45" y="60" width="120" height="24" rx="3" fill="#e57d07" stroke="#12161f" stroke-width="2.5"/>
    <line x1="50" y1="72" x2="160" y2="72" stroke="#222" stroke-width="2"/>
    <rect x="42" y="80" width="18" height="60" fill="#2b313d" stroke="#111" stroke-width="2"/>
    <rect x="150" y="80" width="18" height="60" fill="#2b313d" stroke="#111" stroke-width="2"/>
    <rect x="88" y="75" width="34" height="26" rx="2" fill="#3f4857" stroke="#111" stroke-width="1.5"/>
    <path d="M 97 101 L 92 142 L 118 142 L 113 101 Z" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
    <line x1="105" y1="140" x2="105" y2="152" stroke="#7fe8ff" stroke-width="3" stroke-linecap="round" class="animate-ping"/>
    <circle cx="105" cy="152" r="4" fill="#ffffff" class="animate-pulse"/>
  </svg>`,

  foundation: `<svg class="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]" viewBox="0 0 240 180">
    <ellipse cx="120" cy="165" rx="90" ry="15" fill="rgba(0,0,0,0.5)"/>
    <!-- 混凝土大底座梯形方块 (1:1 截图中的地基4米) -->
    <polygon points="20,160 50,90 190,90 220,160" fill="#2d333f" stroke="#1a1e27" stroke-width="3"/>
    <polygon points="50,90 120,45 190,90 120,110" fill="#3d4656" stroke="#1a1e27" stroke-width="2"/>
    <polygon points="20,160 50,90 120,110 90,170" fill="#252a35" stroke="#111" stroke-width="2"/>
    <polygon points="220,160 190,90 120,110 150,170" fill="#1b2029" stroke="#111" stroke-width="2"/>
    <!-- 工业橙色顶边防撞护栏与刻度 -->
    <path d="M 45 88 L 120 42 L 195 88" fill="none" stroke="#f5921e" stroke-width="5" stroke-linecap="round"/>
    <line x1="80" y1="100" x2="80" y2="155" stroke="#111" stroke-width="3"/>
    <line x1="160" y1="100" x2="160" y2="155" stroke="#111" stroke-width="3"/>
    <rect x="105" y="120" width="30" height="20" rx="2" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
  </svg>`,

  assembler: `<svg class="w-full h-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.85)]" viewBox="0 0 220 200">
    <ellipse cx="110" cy="180" rx="80" ry="16" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="60" width="150" height="110" rx="4" fill="#262d3a" stroke="#121620" stroke-width="3"/>
    <rect x="45" y="70" width="60" height="90" fill="#f5921e"/>
    <rect x="115" y="70" width="60" height="90" fill="#e0770b"/>
    <circle cx="75" cy="115" r="16" fill="#111"/>
    <circle cx="145" cy="115" r="16" fill="#111"/>
  </svg>`,

  storage_box: `<svg class="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 160 160">
    <ellipse cx="80" cy="145" rx="55" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="30" y="55" width="100" height="85" rx="3" fill="#e0770b" stroke="#111" stroke-width="3"/>
    <rect x="65" y="85" width="30" height="22" fill="#111"/>
    <line x1="30" y1="75" x2="130" y2="75" stroke="#ffaa33" stroke-width="3"/>
  </svg>`,

  conveyor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="115" rx="60" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="15,95 65,55 145,55 95,95" fill="#222b37" stroke="#111" stroke-width="2"/>
    <line x1="30" y1="85" x2="70" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <line x1="60" y1="85" x2="100" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <line x1="90" y1="85" x2="130" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <rect x="25" y="95" width="10" height="20" fill="#111"/>
    <rect x="85" y="95" width="10" height="20" fill="#111"/>
  </svg>`,

  splitter: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="120" rx="50" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="35" width="90" height="70" rx="4" fill="#2a3342" stroke="#111" stroke-width="2"/>
    <rect x="50" y="50" width="60" height="40" fill="#e0770b"/>
    <polygon points="80,40 70,50 90,50" fill="#00f0ff"/>
    <polygon points="40,70 50,60 50,80" fill="#00f0ff"/>
    <polygon points="120,70 110,60 110,80" fill="#00f0ff"/>
  </svg>`,

  pipe: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="115" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="20" y="55" width="120" height="28" rx="6" fill="#1a2736" stroke="#00f0ff" stroke-width="2"/>
    <circle cx="40" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
    <circle cx="80" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
    <circle cx="120" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
  </svg>`,

  vert_conveyor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 180">
    <ellipse cx="80" cy="165" rx="45" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="50" y="30" width="60" height="130" rx="4" fill="#222c3a" stroke="#111" stroke-width="2"/>
    <line x1="50" y1="60" x2="110" y2="60" stroke="#f5921e" stroke-width="2"/>
    <line x1="50" y1="90" x2="110" y2="90" stroke="#f5921e" stroke-width="2"/>
    <line x1="50" y1="120" x2="110" y2="120" stroke="#f5921e" stroke-width="2"/>
    <polygon points="80,40 70,55 90,55" fill="#00f0ff"/>
  </svg>`,

  power_burner: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="160" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="35,150 55,60 125,60 145,150" fill="#252d3a" stroke="#111" stroke-width="2.5"/>
    <circle cx="90" cy="115" r="26" fill="#f5921e" class="animate-pulse shadow-[0_0_18px_#ff9900]"/>
    <rect x="78" y="25" width="24" height="35" fill="#151a22" stroke="#111"/>
  </svg>`,

  power_engine: `<svg class="w-full h-full drop-shadow" viewBox="0 0 200 180">
    <ellipse cx="100" cy="160" rx="75" ry="14" fill="rgba(0,0,0,0.4)"/>
    <rect x="30" y="50" width="140" height="100" rx="6" fill="#182332" stroke="#00f0ff" stroke-width="2.5"/>
    <circle cx="100" cy="100" r="32" fill="none" stroke="#00f0ff" stroke-width="4" stroke-dasharray="10 5" class="animate-spin"/>
    <circle cx="100" cy="100" r="16" fill="#f5921e" class="animate-ping"/>
  </svg>`,

  water_pump: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 160">
    <ellipse cx="80" cy="140" rx="60" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="30,135 45,70 115,70 130,135" fill="#1e2c3d" stroke="#111" stroke-width="2"/>
    <rect x="65" y="35" width="30" height="35" fill="#00f0ff" opacity="0.8"/>
    <ellipse cx="80" cy="135" rx="35" ry="8" fill="#38bdf8" opacity="0.6"/>
  </svg>`,

  purifier: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 180">
    <ellipse cx="80" cy="165" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <polygon points="40,155 60,35 100,35 120,155" fill="#202938" stroke="#111" stroke-width="2"/>
    <circle cx="80" cy="80" r="18" fill="#34d399" class="animate-pulse shadow-[0_0_15px_#34d399]"/>
    <circle cx="80" cy="35" r="8" fill="#10b981"/>
  </svg>`,

  portal: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="160" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="40" y="40" width="100" height="110" rx="8" fill="#161e2e" stroke="#a855f7" stroke-width="3"/>
    <ellipse cx="90" cy="95" rx="35" ry="45" fill="#7e22ce" class="animate-pulse shadow-[0_0_20px_#a855f7]"/>
    <ellipse cx="90" cy="95" rx="20" ry="28" fill="#e9d5ff" class="animate-ping"/>
  </svg>`,

  crusher: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 160">
    <ellipse cx="80" cy="140" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="45" width="90" height="85" rx="4" fill="#293241" stroke="#111" stroke-width="2"/>
    <polygon points="50,60 80,95 110,60" fill="#e0770b"/>
    <line x1="80" y1="95" x2="80" y2="120" stroke="#f5921e" stroke-width="3"/>
  </svg>`,

  centrifuge: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="155" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="45" y="55" width="90" height="90" rx="6" fill="#1c2533" stroke="#111" stroke-width="2"/>
    <circle cx="90" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 4" class="animate-spin"/>
  </svg>`,

  deconstructor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="155" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="40" y="50" width="100" height="95" rx="4" fill="#2b2025" stroke="#f43f5e" stroke-width="2"/>
    <line x1="55" y1="65" x2="125" y2="135" stroke="#f43f5e" stroke-width="3"/>
    <line x1="125" y1="65" x2="55" y2="135" stroke="#f43f5e" stroke-width="3"/>
  </svg>`,

  iron_beam_bld: `<svg class="w-full h-full drop-shadow" viewBox="0 0 200 120">
    <ellipse cx="100" cy="100" rx="70" ry="8" fill="rgba(0,0,0,0.4)"/>
    <rect x="20" y="50" width="160" height="22" fill="#3a4454" stroke="#111" stroke-width="2"/>
    <rect x="35" y="42" width="130" height="8" fill="#4b5563"/>
    <rect x="35" y="72" width="130" height="8" fill="#4b5563"/>
  </svg>`,

  storage_desk: `<svg class="w-full h-full drop-shadow" viewBox="0 0 140 120">
    <ellipse cx="70" cy="105" rx="45" ry="8" fill="rgba(0,0,0,0.4)"/>
    <rect x="25" y="45" width="90" height="15" rx="2" fill="#78350f" stroke="#111" stroke-width="1.5"/>
    <rect x="35" y="60" width="10" height="40" fill="#451a03"/>
    <rect x="95" y="60" width="10" height="40" fill="#451a03"/>
  </svg>`
};

// 场景中的活跃建筑实体列表 (包含复合建筑母机与被动加工器)
let worldBuildings = [
  {
    id: 'bld_engine_init',
    type: 'power_engine',
    name: '灵力引擎 (BD_112)',
    tagTitle: '灵力引擎 (BD_112) [复合母机·3插槽]',
    power: '+50 MW',
    x: 13,
    y: 50,
    width: 240,
    height: 235,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 12, icon: 'fa-sheet-plastic' },
      { code: 'copper_wire', name: '铜线', count: 8, icon: 'fa-plug' }
    ]
  },
  {
    id: 'bld_miner_init',
    type: 'miner',
    name: '采矿机 (BD_101)',
    tagTitle: '采矿机 (BD_101) [被动开采]',
    power: '5 MW',
    x: 26, // 屏幕坐标百分比
    y: 52,
    width: 200,
    height: 200,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', count: 5, icon: 'fa-gear' }
    ]
  },
  {
    id: 'bld_smelter_init',
    type: 'smelter',
    name: '精炼炉 (BD_102)',
    tagTitle: '精炼炉 (BD_102)',
    power: '10 MW',
    x: 40,
    y: 48,
    width: 170,
    height: 190,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 8, icon: 'fa-sheet-plastic' },
      { code: 'refractory_core', name: '耐火炉芯', count: 2, icon: 'fa-fire-burner' }
    ]
  },
  {
    id: 'bld_cutter_init',
    type: 'constructor',
    name: '切割机 (BD_105)',
    tagTitle: '切割机 (BD_105)',
    power: '12 MW',
    x: 60,
    y: 54,
    width: 210,
    height: 200,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', count: 6, icon: 'fa-gear' }
    ]
  },
  {
    id: 'bld_box_init',
    type: 'storage_box',
    name: '个人储物箱 (BD_115)',
    tagTitle: '个人储物箱 (BD_115)',
    power: '0 MW',
    x: 80,
    y: 56,
    width: 150,
    height: 150,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 4, icon: 'fa-sheet-plastic' }
    ]
  }
];

// 建造模式与拆除模式状态机
let isBuildPlacingMode = false;
let currentPlacingBuildingKey = 'foundation';
let placingRotationAngle = 0; // 滚轮旋转角度
let currentHoveredBuildingId = null;

// 3秒拆除交互状态
let isDismantlingActive = false;
let dismantleStartTime = 0;
let dismantleAnimFrame = null;
let currentDismantleTarget = null;
const DISMANTLE_DURATION_MS = 3000; // 3秒拆除

// ---------------------------------------------------------------------
// 1. 场景建筑渲染管线
// ---------------------------------------------------------------------
function renderWorldBuildings() {
  const container = document.getElementById('worldBuildingsContainer');
  if (!container) return;
  container.innerHTML = '';

  worldBuildings.forEach(bld => {
    const el = document.createElement('div');
    el.id = bld.id;

    // ==================== 特殊复合建筑处理：灵力引擎 BD_112 (底座为主动加工器，顶部放3个被动冶炼舱) ====================
    if (bld.type === 'power_engine') {
      el.className = 'machine-entity composite-engine-entity pointer-events-auto absolute select-none transition-all duration-200';
      el.style.left = `${bld.x}%`;
      el.style.top = `${bld.y}%`;
      el.style.width = `${bld.width || 240}px`;
      el.style.height = `${bld.height || 235}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

      // 总悬浮标签 (置于顶部3个插件之上)
      const tagHtml = `
        <div class="machine-tag absolute top-[-6px] left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1 z-30">
          <div class="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md border border-[#00f0ff] px-2.5 py-1 rounded shadow-xl">
            <span class="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span class="text-[11px] font-bold text-[#00f0ff] font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
            <span class="text-[9px] text-white/60 bg-white/10 px-1 rounded">${bld.power || '+50 MW'}</span>
          </div>
          <div class="w-1.5 h-1.5 bg-[#00f0ff] rotate-45 -mt-0.5"></div>
        </div>
      `;

      // 1. 【上面三个】：3联装外部模型插槽 (1:1 还原 media_1790624792085.png 用户红框标出的三个位置)
      const slotsData = (typeof engineChamberSlots !== 'undefined') ? engineChamberSlots : [
        { slotIndex: 0, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #1 (BD_113)' },
        { slotIndex: 1, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #2 (BD_113)' },
        { slotIndex: 2, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #3 (BD_113)' }
      ];

      const topRow = document.createElement('div');
      topRow.className = 'top-chambers-deck flex items-end justify-between space-x-2 w-full h-[85px] px-2 pointer-events-auto relative z-20';

      slotsData.forEach((slot, i) => {
        const chamberEl = document.createElement('div');
        chamberEl.id = `top_chamber_slot_${i}`;
        chamberEl.className = 'relative flex-1 h-[80px] rounded transition-all duration-150 cursor-pointer select-none';

        if (slot.mounted) {
          // 冶炼舱3D模型方块 (橙金烈焰工业外壳 + 高温熔炼动态粒子)
          chamberEl.innerHTML = `
            <div class="chamber-box-inner w-full h-full border-2 border-amber-500/80 hover:border-amber-300 bg-[#141b25] hover:bg-[#1a2332] rounded flex flex-col items-center justify-between p-1.5 shadow-[0_0_12px_rgba(245,146,30,0.35)] hover:shadow-[0_0_20px_#f5921e] hover:scale-105 transition-all">
              <div class="w-full flex items-center justify-between text-[8px] font-mono font-bold text-amber-300 border-b border-amber-500/30 pb-0.5">
                <span>#${i + 1}</span>
                <span class="text-[7.5px] px-1 rounded bg-amber-500/20 text-amber-200">BD_113</span>
              </div>
              <div class="relative w-8 h-7 bg-[#1c1815] border border-amber-500/60 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
                <div class="w-5 h-5 rounded-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 animate-pulse shadow-[0_0_12px_#f59e0b]"></div>
                <i class="fa-solid fa-fire text-yellow-200 text-xs absolute animate-bounce" style="animation-duration: 1.5s;"></i>
              </div>
              <div class="w-full flex items-center justify-between text-[7.5px] font-mono">
                <span class="text-amber-200 font-bold">冶炼舱</span>
                <span class="text-emerald-400 font-bold flex items-center space-x-0.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span><span>被动</span></span>
              </div>
            </div>
            <!-- 导热底座连通件 -->
            <div class="w-2.5 h-1.5 bg-amber-500/80 mx-auto -mt-0.5 rounded-b-xs shadow"></div>
          `;

          // 悬停与交互
          chamberEl.onmouseenter = (e) => {
            e.stopPropagation();
            if (typeof setTargetMachine === 'function') setTargetMachine(`smelt_chamber_${i}`);
          };
          chamberEl.onmouseleave = (e) => {
            e.stopPropagation();
            if (typeof clearTargetMachine === 'function') clearTargetMachine(`smelt_chamber_${i}`);
          };
          // 点击打开上面对应的被动加工器面板！
          chamberEl.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof openPassiveChamberSlot === 'function') {
              openPassiveChamberSlot(i);
            }
          };
          // 右键拆卸外部模型返还背包
          chamberEl.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof undockChamberModel === 'function') {
              undockChamberModel(i);
            }
          };
        } else {
          // 空置插槽 (虚线框 + 号)
          chamberEl.innerHTML = `
            <div class="w-full h-full border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 bg-black/40 hover:bg-cyan-950/30 rounded flex flex-col items-center justify-center p-1 transition-all">
              <i class="fa-solid fa-plus text-cyan-400 text-sm mb-1 animate-pulse"></i>
              <span class="text-[8px] font-mono text-cyan-300">#${i + 1} 空置</span>
              <span class="text-[7px] text-white/40">点击安装</span>
            </div>
          `;
          chamberEl.onmouseenter = (e) => {
            e.stopPropagation();
            if (typeof setTargetMachine === 'function') setTargetMachine(`smelt_slot_empty_${i}`);
          };
          chamberEl.onmouseleave = (e) => {
            e.stopPropagation();
            if (typeof clearTargetMachine === 'function') clearTargetMachine(`smelt_slot_empty_${i}`);
          };
          chamberEl.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof mountChamberModel === 'function') {
              mountChamberModel(i);
            }
          };
        }

        topRow.appendChild(chamberEl);
      });

      // 2. 【下面座子】：底下的灵力引擎母机 (1:1 还原 media_1790624792085.png 青色大方块)
      const baseEl = document.createElement('div');
      baseEl.id = `bottom_engine_base`;
      baseEl.className = 'bottom-base-engine relative w-full h-[150px] border-2 border-[#00f0ff] hover:border-white rounded-md bg-[#111925]/95 hover:bg-[#152030] shadow-[0_0_18px_rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.8)] transition-all duration-200 cursor-pointer overflow-hidden p-2 flex flex-col justify-between';

      baseEl.innerHTML = `
        <!-- 顶栏状态与供能参数 -->
        <div class="flex items-center justify-between w-full text-[10px] font-mono font-bold text-cyan-300 px-1 border-b border-cyan-500/20 pb-1">
          <span class="flex items-center space-x-1"><i class="fa-solid fa-bolt text-cyan-400"></i><span>+50 MW</span></span>
          <span class="text-white/90">灵力引擎 BD_112</span>
          <span class="flex items-center space-x-1 text-amber-400"><i class="fa-solid fa-fire text-amber-500"></i><span>150☼</span></span>
        </div>

        <!-- 中央旋转能量反应炉 -->
        <div class="relative w-full h-16 flex items-center justify-center my-0.5">
          <div class="absolute w-16 h-16 border-2 border-dashed border-[#00f0ff] rounded-full animate-spin" style="animation-duration: 7s;"></div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-amber-400 animate-pulse shadow-[0_0_16px_#00f0ff] flex items-center justify-center">
            <i class="fa-solid fa-atom text-slate-900 text-xs"></i>
          </div>
          <!-- 左右两侧热能输出引流线圈 -->
          <div class="absolute left-3 w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00f0ff]"></div>
          <div class="absolute right-3 w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00f0ff]"></div>
        </div>

        <!-- 底栏：主动加工器徽章与端口提示 -->
        <div class="w-full flex items-center justify-between pt-1 border-t border-cyan-500/20 px-1">
          <span class="text-[8.5px] font-mono text-cyan-200/70">正面×1 ➔ 无线供能/供热</span>
          <span class="px-2 py-0.5 rounded-full bg-black/60 border border-cyan-400/40 text-[8px] font-mono font-bold text-cyan-300">
            主动加工器 · 复合底座
          </span>
        </div>
      `;

      // 悬停与点击事件：下面座子独立打开主动加工器面板！
      baseEl.onmouseenter = (e) => {
        e.stopPropagation();
        if (typeof setTargetMachine === 'function') setTargetMachine('power_engine');
      };
      baseEl.onmouseleave = (e) => {
        e.stopPropagation();
        if (typeof clearTargetMachine === 'function') clearTargetMachine('power_engine');
      };
      baseEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openMachineHUD === 'function') {
          openMachineHUD('power_engine'); // 打开正常的主动加工器面板！
        }
      };
      baseEl.oncontextmenu = (e) => {
        handleBuildingRightClick(e, bld);
      };

      // 组装整体并挂载
      el.innerHTML = tagHtml;
      el.appendChild(topRow);
      el.appendChild(baseEl);
      container.appendChild(el);
      return;
    }

    // ==================== 普通单体建筑处理 ====================
    el.className = 'machine-entity pointer-events-auto absolute select-none transition-all duration-200';
    el.style.left = `${bld.x}%`;
    el.style.top = `${bld.y}%`;
    el.style.width = `${bld.width || 180}px`;
    el.style.height = `${bld.height || 180}px`;
    el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

    // 鼠标悬停与交互事件
    el.onmouseenter = () => handleBuildingMouseEnter(bld);
    el.onmouseleave = () => handleBuildingMouseLeave(bld);
    el.onclick = (e) => handleBuildingClick(e, bld);
    el.oncontextmenu = (e) => handleBuildingRightClick(e, bld);

    // 悬浮世界标签
    const tagHtml = `
      <div class="machine-tag absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1">
        <div class="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md border border-[#f5921e] px-2.5 py-1 rounded shadow-xl">
          <span class="w-2 h-2 rounded-full bg-[#f5921e] animate-pulse"></span>
          <span class="text-[11px] font-bold text-[#f5921e] font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
          <span class="text-[9px] text-white/50 bg-white/10 px-1 rounded">${bld.power || '0 MW'}</span>
        </div>
        <div class="w-1.5 h-1.5 bg-[#f5921e] rotate-45 -mt-0.5"></div>
      </div>
    `;

    const svgContent = buildingSvgTemplates[bld.type] || buildingSvgTemplates.foundation;
    el.innerHTML = tagHtml + svgContent;
    container.appendChild(el);
  });
}

// ---------------------------------------------------------------------
// 2. 鼠标移入/移出建筑交互
// ---------------------------------------------------------------------
function handleBuildingMouseEnter(bld) {
  currentHoveredBuildingId = bld.id;

  if (isDismantleMode) {
    // 拆除模式下：激活 1:1 橙色条纹剪影高亮 (media_1790442746779.png)
    const el = document.getElementById(bld.id);
    if (el) el.classList.add('dismantle-target-outline');
    showDismantleTargetCard(bld);
  } else {
    // 正常工控模式下：激活准星 E 键开面板提示
    setTargetMachine(bld.type);
  }
}

function handleBuildingMouseLeave(bld) {
  if (currentHoveredBuildingId === bld.id) {
    currentHoveredBuildingId = null;
  }

  const el = document.getElementById(bld.id);
  if (el) el.classList.remove('dismantle-target-outline');

  if (isDismantleMode) {
    hideDismantleTargetCard();
    cancelDismantleHold();
  } else {
    clearTargetMachine(bld.type);
  }
}

function handleBuildingClick(e, bld) {
  if (isDismantleMode) {
    e.preventDefault();
    e.stopPropagation();
    // 拆除模式下若单击，也支持引导长按
    showNotification(`【拆除模式】请长按【右键】或【左键】3秒进行拆除回收`);
    return;
  }

  // 正常模式点击打开控制台
  if (bld.type === 'storage_box') {
    if (typeof openStorageBoxModal === 'function') {
      openStorageBoxModal();
    }
    return;
  }

  if (typeof openMachineHUD === 'function') {
    openMachineHUD(bld.type);
  }
}

function handleBuildingRightClick(e, bld) {
  e.preventDefault();
  e.stopPropagation();
  // 右键触发
  if (isDismantleMode) {
    // 已由 mousedown 触发长按
  }
}

// ---------------------------------------------------------------------
// 3. 拆除模式 HUD 与 3秒长按进度条 (1:1 还原 media_1790442746779 / 47796)
// ---------------------------------------------------------------------
function showDismantleTargetCard(bld) {
  const card = document.getElementById('dismantleTargetCard');
  if (!card) return;

  const titleElem = document.getElementById('dismantleTargetTitle');
  const costContainer = document.getElementById('dismantleRefundContainer');

  if (titleElem) titleElem.innerText = bld.name;

  if (costContainer) {
    costContainer.innerHTML = '';
    const refundList = bld.refund || [
      { code: 'concrete', name: '混凝土', count: 5, icon: 'fa-cubes-stacked' },
      { code: 'iron_plate', name: '工业铁板', count: 2, icon: 'fa-sheet-plastic' }
    ];
    refundList.forEach(r => {
      const box = document.createElement('div');
      box.className = 'flex flex-col items-center bg-white/10 border border-white/20 rounded px-2 py-1 min-w-[50px] shadow';
      box.innerHTML = `
        <i class="fa-solid ${r.icon} text-stone-200 text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold text-amber-300">+${r.count}</span>
      `;
      costContainer.appendChild(box);
    });
  }

  card.classList.remove('hidden');
  card.style.opacity = '1';
}

function hideDismantleTargetCard() {
  const card = document.getElementById('dismantleTargetCard');
  if (card) {
    card.style.opacity = '0';
    setTimeout(() => card.classList.add('hidden'), 150);
  }
}

// 开始3秒拆除长按 (鼠标右键 或 鼠标左键 按下)
function startDismantleHold(e) {
  if (!isDismantleMode || !currentHoveredBuildingId) return;
  if (e) e.preventDefault();

  const bld = worldBuildings.find(b => b.id === currentHoveredBuildingId);
  if (!bld) return;

  isDismantlingActive = true;
  currentDismantleTarget = bld;
  dismantleStartTime = performance.now();

  // 显示中央 3 秒拆除进度条 (1:1 media_1790442747796.png)
  const barContainer = document.getElementById('dismantleProgressBarContainer');
  const barFill = document.getElementById('dismantleProgressFill');
  if (barContainer) {
    barContainer.classList.remove('hidden');
    barContainer.style.opacity = '1';
  }
  if (barFill) barFill.style.width = '0%';

  // 机械臂激活蓝色激光
  const arm = document.getElementById('mechArm');
  const beam = document.getElementById('dismantleLaserBeam');
  if (beam) beam.classList.remove('hidden');
  if (arm) arm.style.transform = 'translate(-10px, -20px) rotate(2deg)';

  playUiSound('dismantle_loop');

  function tickDismantle(now) {
    if (!isDismantlingActive) return;

    const elapsed = now - dismantleStartTime;
    const progress = Math.min(100, (elapsed / DISMANTLE_DURATION_MS) * 100);

    if (barFill) barFill.style.width = `${progress}%`;

    // 播放持续激光微声
    if (Math.random() < 0.25) {
      playUiSound('dismantle_loop');
    }

    if (progress >= 100) {
      // 3秒拆除达成！
      completeDismantleSuccess();
      return;
    }

    dismantleAnimFrame = requestAnimationFrame(tickDismantle);
  }

  dismantleAnimFrame = requestAnimationFrame(tickDismantle);
}

// 释放鼠标取消拆除
function cancelDismantleHold() {
  if (!isDismantlingActive) return;

  isDismantlingActive = false;
  cancelAnimationFrame(dismantleAnimFrame);

  const barContainer = document.getElementById('dismantleProgressBarContainer');
  const barFill = document.getElementById('dismantleProgressFill');
  const beam = document.getElementById('dismantleLaserBeam');
  const arm = document.getElementById('mechArm');

  if (barFill) barFill.style.width = '0%';
  if (barContainer) {
    barContainer.style.opacity = '0';
    setTimeout(() => barContainer.classList.add('hidden'), 150);
  }
  if (beam) beam.classList.add('hidden');
  if (arm) arm.style.transform = '';
}

// 拆除 100% 成功结算
function completeDismantleSuccess() {
  cancelDismantleHold();
  if (!currentDismantleTarget) return;

  const targetId = currentDismantleTarget.id;
  const bldIndex = worldBuildings.findIndex(b => b.id === targetId);
  if (bldIndex === -1) return;

  const bld = worldBuildings[bldIndex];
  
  // 1. 从世界中移除实体
  worldBuildings.splice(bldIndex, 1);
  renderWorldBuildings();

  // 2. 100% 物料全额无损回收至背包
  const refundList = bld.refund || [
    { code: 'iron_beam', name: '玄铁梁', count: 2 },
    { code: 'iron_plate', name: '玄铁板', count: 5 }
  ];

  refundList.forEach(r => {
    if (typeof playerInventory !== 'undefined') {
      playerInventory[r.code] = (playerInventory[r.code] || 0) + r.count;
    }
    // 触发拾取动效
    if (typeof triggerLootNotification === 'function') {
      triggerLootNotification(r.name, r.count, playerInventory[r.code], 'fa-solid fa-box text-amber-300');
    }
  });

  // 3. 音效与通知
  playUiSound('dismantle_success');
  hideDismantleTargetCard();
  showNotification(`已成功拆除【${bld.name}】！物料已悉数全额回收至背包。`);

  // 4. 同步界面数值
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();

  currentDismantleTarget = null;
  currentHoveredBuildingId = null;
}

// ---------------------------------------------------------------------
// 4. 建造模式 HUD 与实时全息部署 (1:1 还原 media_1790442748700.png)
// ---------------------------------------------------------------------
const buildableDatabase = {
  foundation: {
    key: 'foundation',
    title: '地基 4x4 (BD_120)',
    name: '地基 4x4',
    subMode: '默认',
    power: '0 MW',
    width: 220,
    height: 170,
    costs: [
      { code: 'iron_beam', name: '玄铁梁', need: 2, icon: 'fa-bars-staggered' },
      { code: 'iron_plate', name: '玄铁板', need: 5, icon: 'fa-sheet-plastic' }
    ]
  },
  miner: {
    key: 'miner',
    title: '采矿机 (BD_101)',
    name: '采矿机',
    subMode: '默认',
    power: '5 MW',
    width: 200,
    height: 200,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', need: 5, icon: 'fa-gear' }
    ]
  },
  smelter: {
    key: 'smelter',
    title: '精炼炉 (BD_102)',
    name: '精炼炉',
    subMode: '默认',
    power: '10 MW',
    width: 170,
    height: 190,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 8, icon: 'fa-sheet-plastic' },
      { code: 'refractory_core', name: '耐火炉芯', need: 2, icon: 'fa-fire-burner' }
    ]
  },
  constructor: {
    key: 'constructor',
    title: '切割机 (BD_105)',
    name: '切割机',
    subMode: '默认',
    power: '12 MW',
    width: 210,
    height: 200,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', need: 6, icon: 'fa-gear' }
    ]
  },
  storage_box: {
    key: 'storage_box',
    title: '个人储物箱 (BD_115)',
    name: '个人储物箱',
    subMode: '默认',
    power: '0 MW',
    width: 160,
    height: 160,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 2, icon: 'fa-sheet-plastic' },
      { code: 'iron_ingot', name: '玄铁锭', need: 2, icon: 'fa-cube' }
    ]
  },
  storage_box_large: {
    key: 'storage_box_large',
    title: '大储物箱 (BD_115_L)',
    name: '大储物箱',
    subMode: '默认',
    power: '0 MW',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 4, icon: 'fa-sheet-plastic' },
      { code: 'iron_ingot', name: '玄铁锭', need: 4, icon: 'fa-cube' }
    ]
  },
  conveyor: {
    key: 'conveyor',
    title: '传送带 (BD_125)',
    name: '传送带',
    subMode: '双向传输',
    power: '0 MW',
    width: 160,
    height: 140,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 2, icon: 'fa-cube' }
    ]
  },
  splitter: {
    key: 'splitter',
    title: '分流器 (BD_124)',
    name: '分流器',
    subMode: '1进3出',
    power: '0 MW',
    width: 160,
    height: 140,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 3, icon: 'fa-cube' },
      { code: 'iron_gear', name: '玄铁齿轮', need: 1, icon: 'fa-gear' }
    ]
  },
  pipe: {
    key: 'pipe',
    title: '水管 (BD_127)',
    name: '水管',
    subMode: '流体导管',
    power: '0 MW',
    width: 160,
    height: 140,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 2, icon: 'fa-cube' }
    ]
  },
  vert_conveyor: {
    key: 'vert_conveyor',
    title: '垂直传送带 (BD_129)',
    name: '垂直传送带',
    subMode: 'Z轴立体运输',
    power: '0 MW',
    width: 160,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 4, icon: 'fa-cube' },
      { code: 'iron_gear', name: '玄铁齿轮', need: 2, icon: 'fa-gear' }
    ]
  },
  foundation_1x1: {
    key: 'foundation_1x1',
    title: '地基 1x1 (BD_119)',
    name: '地基 1x1',
    subMode: '平整承重',
    power: '0 MW',
    width: 140,
    height: 140,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 1, icon: 'fa-sheet-plastic' }
    ]
  },
  foundation_16x16: {
    key: 'foundation_16x16',
    title: '地基 16x16 (BD_121)',
    name: '地基 16x16',
    subMode: '巨型平台',
    power: '0 MW',
    width: 280,
    height: 200,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 8, icon: 'fa-sheet-plastic' }
    ]
  },
  iron_beam_bld: {
    key: 'iron_beam_bld',
    title: '玄铁梁 (BD_122)',
    name: '玄铁梁',
    subMode: '8米桥架',
    power: '0 MW',
    width: 200,
    height: 120,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 2, icon: 'fa-cube' }
    ]
  },
  storage_desk: {
    key: 'storage_desk',
    title: '置物桌 (BD_123)',
    name: '置物桌',
    subMode: '操作台面',
    power: '0 MW',
    width: 140,
    height: 120,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 1, icon: 'fa-cube' }
    ]
  },
  power_burner: {
    key: 'power_burner',
    title: '供能机 (BD_117)',
    name: '供能机',
    subMode: '魂火发电',
    power: '无线50米',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 3, icon: 'fa-sheet-plastic' },
      { code: 'iron_ingot', name: '玄铁锭', need: 5, icon: 'fa-cube' }
    ]
  },
  power_engine: {
    key: 'power_engine',
    title: '灵力引擎 (BD_112)',
    name: '灵力引擎',
    subMode: '无线供热',
    power: '无线50米',
    width: 200,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 8, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 6, icon: 'fa-square' }
    ]
  },
  water_pump: {
    key: 'water_pump',
    title: '抽水机 (BD_116)',
    name: '抽水机',
    subMode: '流体抽取',
    power: '5 MW',
    width: 160,
    height: 160,
    costs: [
      { code: 'iron_plate', name: '玄铁板', need: 2, icon: 'fa-sheet-plastic' },
      { code: 'iron_ingot', name: '玄铁锭', need: 3, icon: 'fa-cube' }
    ]
  },
  purifier: {
    key: 'purifier',
    title: '净化塔 (BD_118)',
    name: '净化塔',
    subMode: '煞气净化',
    power: '10 MW',
    width: 160,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 6, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 4, icon: 'fa-square' }
    ]
  },
  portal: {
    key: 'portal',
    title: '传送门 (BD_114)',
    name: '传送门',
    subMode: '空间跃迁',
    power: '50 MW',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 8, icon: 'fa-cube' },
      { code: 'iron_plate', name: '玄铁板', need: 4, icon: 'fa-sheet-plastic' }
    ]
  },
  crusher: {
    key: 'crusher',
    title: '粉碎机 (BD_103)',
    name: '粉碎机',
    subMode: '材料粉碎',
    power: '8 MW',
    width: 160,
    height: 160,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 2, icon: 'fa-cube' },
      { code: 'iron_plate', name: '玄铁板', need: 1, icon: 'fa-sheet-plastic' }
    ]
  },
  assembler: {
    key: 'assembler',
    title: '加工台 (BD_104)',
    name: '加工台',
    subMode: '机械零件',
    power: '6 MW',
    width: 200,
    height: 190,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 4, icon: 'fa-cube' },
      { code: 'iron_plate', name: '玄铁板', need: 2, icon: 'fa-sheet-plastic' }
    ]
  },
  centrifuge: {
    key: 'centrifuge',
    title: '离心机 (BD_106)',
    name: '离心机',
    subMode: '单进多出',
    power: '15 MW',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 5, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 3, icon: 'fa-square' }
    ]
  },
  deconstructor: {
    key: 'deconstructor',
    title: '解构机 (BD_107)',
    name: '解构机',
    subMode: '生物单进多出',
    power: '20 MW',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 8, icon: 'fa-cube' },
      { code: 'iron_plate', name: '玄铁板', need: 4, icon: 'fa-sheet-plastic' }
    ]
  },
  incubator: {
    key: 'incubator',
    title: '培育仓 (BD_108)',
    name: '培育仓',
    subMode: '流固混合',
    power: '8 MW',
    width: 200,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 6, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 4, icon: 'fa-square' }
    ]
  },
  extractor: {
    key: 'extractor',
    title: '提取器 (BD_109)',
    name: '提取器',
    subMode: '单进多出',
    power: '10 MW',
    width: 180,
    height: 160,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 3, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 2, icon: 'fa-square' }
    ]
  },
  mixer: {
    key: 'mixer',
    title: '搅拌机 (BD_110)',
    name: '搅拌机',
    subMode: '多进单出',
    power: '14 MW',
    width: 180,
    height: 180,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 4, icon: 'fa-cube' },
      { code: 'iron_gear', name: '玄铁齿轮', need: 2, icon: 'fa-gear' }
    ]
  },
  assembler_heavy: {
    key: 'assembler_heavy',
    title: '组装机 (BD_111)',
    name: '组装机',
    subMode: '多轨校验',
    power: '25 MW',
    width: 220,
    height: 200,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 8, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 6, icon: 'fa-square' }
    ]
  },
  smelt_chamber: {
    key: 'smelt_chamber',
    title: '冶炼舱 (BD_113)',
    name: '冶炼舱',
    subMode: '插件式高温',
    power: '需父级热力',
    width: 170,
    height: 170,
    costs: [
      { code: 'iron_ingot', name: '玄铁锭', need: 4, icon: 'fa-cube' },
      { code: 'copper_ingot', name: '赤铜锭', need: 2, icon: 'fa-square' }
    ]
  }
};

// 启动建造模式
function enterBuildPlacingMode(buildingKey = 'foundation') {
  if (isDismantleMode) toggleDismantleMode(); // 互斥
  if (typeof closeOtherModals === 'function') closeOtherModals('');

  isBuildPlacingMode = true;
  currentPlacingBuildingKey = buildingKey;
  placingRotationAngle = 0;

  playUiSound('toggle');

  const hud = document.getElementById('buildModeHudOverlay');
  const ghost = document.getElementById('buildHologramGhost');
  if (hud) hud.classList.remove('hidden');
  if (ghost) ghost.classList.remove('hidden');

  updateBuildPlacementHudCard();
  showNotification(`已进入【建造部署模式】: ${buildableDatabase[buildingKey]?.title || '设施'} (左键放置，右键退出)`);
}

// 退出建造模式
function exitBuildPlacingMode() {
  isBuildPlacingMode = false;
  const hud = document.getElementById('buildModeHudOverlay');
  const ghost = document.getElementById('buildHologramGhost');
  if (hud) hud.classList.add('hidden');
  if (ghost) ghost.classList.add('hidden');
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  if (readyBadge) {
    readyBadge.classList.add('hidden');
    readyBadge.classList.remove('flex');
  }
  document.querySelectorAll('.dsp-bld-btn').forEach(b => b.classList.remove('active-dsp-bld'));
}

// 刷新建造模式中置卡片 (1:1 还原 media_1790442748700.png)
function updateBuildPlacementHudCard() {
  const data = buildableDatabase[currentPlacingBuildingKey] || buildableDatabase.foundation;
  const ghost = document.getElementById('buildHologramGhost');
  if (ghost) {
    ghost.innerHTML = buildingSvgTemplates[data.key] || buildingSvgTemplates.foundation;
    ghost.style.width = `${data.width}px`;
    ghost.style.height = `${data.height}px`;
  }

  const titleElem = document.getElementById('buildPlacingTitle');
  const subModeElem = document.getElementById('buildPlacingSubMode');
  const costContainer = document.getElementById('buildPlacingCostCards');

  if (titleElem) titleElem.innerText = data.title;
  if (subModeElem) subModeElem.innerText = `🔨 建造模式: ${data.subMode || '默认'}`;

  if (costContainer) {
    costContainer.innerHTML = '';
    data.costs.forEach(c => {
      const stock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined) ? playerInventory[c.code] : 99;
      const isEnough = stock >= c.need;
      const box = document.createElement('div');
      box.className = `flex flex-col items-center bg-black/75 border ${isEnough ? 'border-white/30' : 'border-rose-500'} rounded px-2.5 py-1 min-w-[56px] shadow-lg`;
      box.innerHTML = `
        <i class="fa-solid ${c.icon} text-stone-200 text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${stock} / ${c.need}</span>
      `;
      costContainer.appendChild(box);
    });
  }
}

// 检查是否具备建造成本
function canAffordBuild(buildingKey) {
  const data = buildableDatabase[buildingKey];
  if (!data) return false;
  if (typeof playerInventory === 'undefined') return true;
  return data.costs.every(c => (playerInventory[c.code] || 0) >= c.need);
}

// 执行左键放置建造
function executeBuildPlacementAt(xRatio, yRatio) {
  const data = buildableDatabase[currentPlacingBuildingKey];
  if (!data) return;

  if (!canAffordBuild(currentPlacingBuildingKey)) {
    playUiSound('craft_fail');
    showNotification(`原料不足！无法建造【${data.title}】`);
    return;
  }

  // 扣减物料
  data.costs.forEach(c => {
    if (typeof playerInventory !== 'undefined') {
      playerInventory[c.code] -= c.need;
    }
  });

  // 创建世界实体
  const newId = `bld_${data.key}_${Date.now()}`;
  const newBuilding = {
    id: newId,
    type: data.key,
    name: data.title,
    tagTitle: `${data.title} (${data.power})`,
    power: data.power,
    x: Math.round(xRatio * 100),
    y: Math.round(yRatio * 100),
    rot: placingRotationAngle,
    width: data.width,
    height: data.height,
    refund: data.costs.map(c => ({ code: c.code, name: c.name, count: c.need, icon: c.icon }))
  };

  worldBuildings.push(newBuilding);
  renderWorldBuildings();

  // 动画与音效
  playUiSound('build_place');
  updateBuildPlacementHudCard();
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();

  showNotification(`【建造成功】已部署【${data.title}】！按 [E] 即可接入控制，按 [F] 可随时拆除。`);
}

// ---------------------------------------------------------------------
// 5. 全局事件监听 (滚轮旋转、鼠标跟随全息图、右键/长按拆除)
// ---------------------------------------------------------------------
document.addEventListener('mousemove', (e) => {
  // 建造模式全息幽灵跟随鼠标
  if (isBuildPlacingMode) {
    const ghost = document.getElementById('buildHologramGhost');
    if (ghost) {
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      ghost.style.transform = `translate(-50%, -50%) rotate(${placingRotationAngle}deg)`;
    }
  }
});

// 鼠标滚轮在建造模式下旋转全息图 (1:1 media_1790442748700.png: 滚轮向上/向下)
document.addEventListener('wheel', (e) => {
  if (isBuildPlacingMode) {
    e.preventDefault();
    if (e.deltaY > 0) {
      placingRotationAngle = (placingRotationAngle + 45) % 360;
    } else {
      placingRotationAngle = (placingRotationAngle - 45 + 360) % 360;
    }
    playUiSound('click');
    const ghost = document.getElementById('buildHologramGhost');
    if (ghost) {
      ghost.style.transform = `translate(-50%, -50%) rotate(${placingRotationAngle}deg)`;
    }
  }
}, { passive: false });

// 鼠标按下：左键放置 / 右键或左键拆除长按
document.addEventListener('mousedown', (e) => {
  // 如果点击的是弹窗UI或按钮，不拦截
  if (e.target.closest('#buildModal') || e.target.closest('#craftModal') || e.target.closest('#invModal') || e.target.closest('#machineModal') || e.target.closest('#hubMilestoneModal') || e.target.closest('#swordCasketModal') || e.target.closest('button')) {
    return;
  }

  // 1. 拆除模式下长按 (右键 button === 2 或 左键 button === 0)
  if (isDismantleMode) {
    if (currentHoveredBuildingId && (e.button === 2 || e.button === 0)) {
      e.preventDefault();
      startDismantleHold(e);
      return;
    }
  }

  // 2. 建造模式下左键点击放置 (button === 0)
  if (isBuildPlacingMode && e.button === 0) {
    e.preventDefault();
    const xRatio = e.clientX / window.innerWidth;
    const yRatio = e.clientY / window.innerHeight;
    executeBuildPlacementAt(xRatio, yRatio);
    return;
  }

  // 3. 建造模式下右键退出 (button === 2)
  if (isBuildPlacingMode && e.button === 2) {
    e.preventDefault();
    playUiSound('toggle');
    exitBuildPlacingMode();
    showNotification('已退出建造部署模式');
    return;
  }
});

// 鼠标松开：取消拆除长按
document.addEventListener('mouseup', (e) => {
  if (isDismantleMode) {
    cancelDismantleHold();
  }
});

// 阻止右键默认菜单 (防止干扰长按右键拆除)
document.addEventListener('contextmenu', (e) => {
  if (isDismantleMode || isBuildPlacingMode) {
    e.preventDefault();
  }
});

// 页面加载完成后初次挂载世界建筑
window.addEventListener('DOMContentLoaded', () => {
  renderWorldBuildings();
});
