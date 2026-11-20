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
      // 严格归一化到 Q 键建造菜单 5 大有效分组: prod / logi / power / org / special
      let grp = b.group;
      const validGroups = ['prod', 'logi', 'power', 'org', 'special'];
      if (!validGroups.includes(grp)) {
        const cat = b.category || '';
        const useTxt = b.typeDesc || '';
        if (b.code === 'BD_156' || b.code === 'BD_157' || b.code === 'BD_160') grp = 'special';
        else if (b.code === 'BD_147' || b.code === 'BD_149' || b.code === 'BD_155' || useTxt.includes('能源')) grp = 'power';
        else if (cat === '传送带' || cat === '垂直传送带' || cat === '管道' || b.code === 'BD_127' || b.code === 'BD_151' || cat === '物流') grp = 'logi';
        else if (cat === '结构' || cat === '仓储' || cat === '建筑') grp = 'org';
        else grp = 'prod';
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
        category: b.category || '',
        typeDesc: b.typeDesc || '',
        group: grp,
        desc: b.desc || '《修仙工厂》标准工业建筑设施。',
        power: powerText,
        powerRadius: b.powerRadius || 0,
        heat: b.heat || 0,
        dimX: b.dimX || 1,
        dimY: b.dimY || 1,
        dimZ: b.dimZ !== undefined ? b.dimZ : 1,
        topStackable: !!b.topStackable,
        rotStep: typeof b.rotStep === 'number' ? b.rotStep : 90,
        canPlaceOnRawMap: !!b.canPlaceOnRawMap,
        occupancyMode: b.occupancyMode || '体积占格',
        placementRule: b.placementRule || (b.canPlaceOnRawMap ? 'raw_or_surface' : 'surface_only'),
        placementDesc: b.placementDesc || '',
        containerSlots: b.containerSlots || 0,
        pluginSlot: b.pluginSlot || '无',
        costs: costs,
        svg: getBuildingSvg(b, key)
      };
    });
  }
  return db;
}

// =========================================================================
// 动态多级工业快捷栏系统 (1-0 十槽位 · 2级子菜单 · 3级变体规格)
// 满足工业建造流畅直达：按键直选、子项展开、规格型号分支、上次记忆
// =========================================================================

const HOTBAR_TIER1_CONFIG = [
  {
    key: 'mine', slotNum: '1', name: '采掘抽水', icon: 'fa-solid fa-trowel-bricks',
    subItems: [
      { key: 'miner', name: '采矿机', icon: 'fa-solid fa-cube', variants: [
        { key: 'miner', name: '采矿机', sub: '铁/铜/煤/石英/灵石矿 · 4×3×4', code: 'BD_135' }
      ]},
      { key: 'pump', name: '抽水机', icon: 'fa-solid fa-droplet', variants: [
        { key: 'pump', name: '抽水机', sub: '清水/原油/灵泉抽取 · 1×2×2', code: 'BD_134' }
      ]}
    ]
  },
  {
    key: 'smelt', slotNum: '2', name: '冶炼炼丹', icon: 'fa-solid fa-fire',
    subItems: [
      { key: 'furnace', name: '精炼炉', icon: 'fa-solid fa-fire-burner', variants: [
        { key: 'furnace', name: '精炼炉', sub: '金属与玻璃冶炼 · 3×3×3', code: 'BD_136' }
      ]},
      { key: 'smelt_chamber', name: '冶炼舱', icon: 'fa-solid fa-shield', variants: [
        { key: 'smelt_chamber', name: '冶炼舱（上）', sub: '插于灵力引擎 · 2×1×2', code: 'BD_148' }
      ]},
      { key: 'bd_163', name: '炼丹炉', icon: 'fa-solid fa-flask', variants: [
        { key: 'bd_163', name: '炼丹炉（上）', sub: '工业炼丹 · 2×1×2', code: 'BD_163' }
      ]}
    ]
  },
  {
    key: 'base_craft', slotNum: '3', name: '基础加工', icon: 'fa-solid fa-screwdriver-wrench',
    subItems: [
      { key: 'crusher', name: '粉碎机', icon: 'fa-solid fa-hammer', variants: [
        { key: 'crusher', name: '粉碎机', sub: '双出口分选磨粉 · 1×1×1', code: 'BD_137' }
      ]},
      { key: 'assembler', name: '加工台', icon: 'fa-solid fa-gears', variants: [
        { key: 'assembler', name: '加工台', sub: '零件与剑丸加工 · 2×2×2', code: 'BD_138' }
      ]},
      { key: 'cutter', name: '切割机', icon: 'fa-solid fa-bolt', variants: [
        { key: 'cutter', name: '切割机', sub: '硅片铜片精切 · 1×1×1', code: 'BD_139' }
      ]}
    ]
  },
  {
    key: 'adv_craft', slotNum: '4', name: '解构组装', icon: 'fa-solid fa-cubes-stacked',
    subItems: [
      { key: 'deconstructor', name: '解构机', icon: 'fa-solid fa-dna', variants: [
        { key: 'deconstructor', name: '解构机', sub: '尸解与三阶科研 · 2×4×2', code: 'BD_140' }
      ]},
      { key: 'assembler_heavy', name: '组装机', icon: 'fa-solid fa-box-archive', variants: [
        { key: 'assembler_heavy', name: '组装机', sub: '高阶双轨总装 · 3×3×3', code: 'BD_146' }
      ]},
      { key: 'alchemy_table', name: '炼宝/渡劫', icon: 'fa-solid fa-wand-magic-sparkles', variants: [
        { key: 'alchemy_table', name: '炼宝台', sub: '祭炼法宝 · 4×4×5', code: 'BD_156' },
        { key: 'tribulation_table', name: '渡劫台', sub: '终局凝练金丹 · 5×5×6', code: 'BD_157' }
      ]}
    ]
  },
  {
    key: 'bio', slotNum: '5', name: '生物生化', icon: 'fa-solid fa-flask-vial',
    subItems: [
      { key: 'incubator', name: '培养仓', icon: 'fa-solid fa-leaf', variants: [
        { key: 'incubator', name: '培养仓', sub: '流固培养 · 1×1×1', code: 'BD_142' }
      ]},
      { key: 'extractor', name: '提取器', icon: 'fa-solid fa-eye-dropper', variants: [
        { key: 'extractor', name: '提取器', sub: '原油裂解与灵液提取 · 2×1×1', code: 'BD_145' }
      ]},
      { key: 'mixer', name: '搅拌机', icon: 'fa-solid fa-blender', variants: [
        { key: 'mixer', name: '搅拌机', sub: '营养液与稳定液调配 · 2×2×2', code: 'BD_143' }
      ]},
      { key: 'centrifuge', name: '离心机', icon: 'fa-solid fa-arrows-spin', variants: [
        { key: 'centrifuge', name: '离心机', sub: '原油分馏与重水分离 · 2×2×2', code: 'BD_144' }
      ]},
      { key: 'petri_dish', name: '培养皿', icon: 'fa-solid fa-microscope', variants: [
        { key: 'petri_dish', name: '培养皿', sub: '灵草催熟繁殖 · 1×1×1', code: 'BD_141' }
      ]}
    ]
  },
  {
    key: 'composite', slotNum: '6', name: '复合防务', icon: 'fa-solid fa-layer-group',
    subItems: [
      { key: 'power_engine', name: '灵力引擎', icon: 'fa-solid fa-atom', variants: [
        { key: 'power_engine', name: '灵力引擎（下）', sub: '烧煤/燃油/燃料棒 · 4×3×2', code: 'BD_147' }
      ]},
      { key: 'bio_base', name: '营养基座', icon: 'fa-solid fa-shield-halved', variants: [
        { key: 'bio_base', name: '营养基座', sub: '承载培养仓/皿 · 1×2×1', code: 'BD_159' }
      ]},
      { key: 'fluid_hub', name: '流体中枢', icon: 'fa-solid fa-gauge-high', variants: [
        { key: 'fluid_hub', name: '流体处理中枢', sub: '承载搅拌/离心/提取 · 2×4×4', code: 'BD_158' }
      ]},
      { key: 'bd_160', name: '飞剑防御塔', icon: 'fa-solid fa-crosshairs', variants: [
        { key: 'bd_160', name: '飞剑防御塔', sub: '猎杀修士掉尸体 · 2×2×4', code: 'BD_160' }
      ]}
    ]
  },
  {
    key: 'logi', slotNum: '7', name: '传送物流', icon: 'fa-solid fa-route',
    subItems: [
      { key: 'conveyor', name: '传送带', icon: 'fa-solid fa-arrows-left-right', variants: [
        { key: 'conveyor', name: '传送带｜直线', sub: '固体水平输送 · 1×1×1', code: 'BD_116' },
        { key: 'vert_conveyor', name: '垂直传送带', sub: '跨楼层竖直运输 · 1×1×1', code: 'BD_121' }
      ]},
      { key: 'splitter', name: '分拣合流', icon: 'fa-solid fa-code-branch', variants: [
        { key: 'splitter', name: '分流器', sub: '1进2出均衡分流 · 1×1×1', code: 'BD_124' },
        { key: 'merger', name: '合流器', sub: '2进1出合流 · 1×1×1', code: 'BD_123' },
        { key: 'conveyor_limiter', name: '限速器', sub: '平衡产线节拍 · 1×1×1', code: 'BD_127' }
      ]},
      { key: 'pipe', name: '水管', icon: 'fa-solid fa-faucet-drip', variants: [
        { key: 'pipe', name: '水管｜直管', sub: '清水/原油/灵泉/重水导管 · 1×1×1', code: 'BD_128' }
      ]}
    ]
  },
  {
    key: 'power', slotNum: '8', name: '能源环保', icon: 'fa-solid fa-bolt-lightning',
    subItems: [
      { key: 'fuel_generator', name: '燃料发电机', icon: 'fa-solid fa-fire-flame-curved', variants: [
        { key: 'fuel_generator', name: '燃料发电机', sub: '供电 +100MW · 2×2×2', code: 'BD_149' }
      ]},
      { key: 'wind_generator', name: '风力发电机', icon: 'fa-solid fa-wind', variants: [
        { key: 'wind_generator', name: '风力发电机', sub: '清洁风电 · 2×2×4', code: 'BD_155' }
      ]},
      { key: 'purifier', name: '回收处理塔', icon: 'fa-solid fa-broom', variants: [
        { key: 'purifier', name: '回收处理塔', sub: '净化血水煞水 · 2×2×3', code: 'BD_150' }
      ]}
    ]
  },
  {
    key: 'storage', slotNum: '9', name: '仓储置物', icon: 'fa-solid fa-box-archive',
    subItems: [
      { key: 'storage_box', name: '储藏盒', icon: 'fa-solid fa-box', variants: [
        { key: 'storage_box', name: '储藏盒 1×1×1', sub: '1×1×1m 立方箱 (16格)', code: 'BD_113' },
        { key: 'bd_114', name: '窄柜 2×1×1', sub: '2×1×1m 窄柜 (32格)', code: 'BD_114' },
        { key: 'bd_115', name: '宽柜 1×2×1', sub: '1×2×1m 宽柜 (32格)', code: 'BD_115' }
      ]},
      { key: 'storage_desk', name: '小桌板/置物桌', icon: 'fa-solid fa-table', variants: [
        { key: 'storage_desk', name: '小桌板 1×1×1', sub: '1×1×1m 小型置物桌', code: 'BD_153' },
        { key: 'bd_154', name: '高置物桌 1×1×2', sub: '1×1×2m 高型置物桌', code: 'BD_154' }
      ]}
    ]
  },
  {
    key: 'struct', slotNum: '0', name: '地基空间', icon: 'fa-solid fa-cubes',
    subItems: [
      { key: 'foundation', name: '建筑底座', icon: 'fa-solid fa-square', variants: [
        { key: 'foundation_1x1', name: '底座 1×1×1', sub: '尺寸 1×1×1m', code: 'BD_102' },
        { key: 'foundation_2x2', name: '底座 2×2×1', sub: '尺寸 2×2×1m', code: 'BD_104' },
        { key: 'foundation_3x3', name: '底座 3×3×1', sub: '尺寸 3×3×1m', code: 'BD_105' },
        { key: 'foundation_pillar', name: '底座柱 1×1×4', sub: '立体立柱 1×1×4m', code: 'BD_103' },
        { key: 'foundation_beam', name: '底座梁 1×4×1', sub: '连桥梁 1×4×1m', code: 'BD_106' }
      ]},
      { key: 'teleporter', name: '跨区传送门', icon: 'fa-solid fa-door-open', variants: [
        { key: 'teleporter', name: '跨区传送门', sub: '空间传送 · 2×2×1', code: 'BD_151' }
      ]}
    ]
  }
];

// 快捷栏状态
let activeHotbarSlot = '1';
let activeHotbarSubKey = 'miner';
let activeHotbarVariantKey = 'miner';
let isTier2ShelfOpen = true;
let isTier3ShelfOpen = false;
let hotbarVariantMemory = {}; // 记录每个子项上次选中的具体变体 key

// 初始化多级快捷栏
function initMultiTierHotbar() {
  renderHotbarTier1();
  selectHotbarTier1('1', false);
}

// 渲染一级主快捷栏 (1 - 0 十大槽位)
function renderHotbarTier1() {
  const container = document.getElementById('dspCategoryBar');
  if (!container) return;

  // 保留就绪提示与 Q 键按钮
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  const qBtn = container.querySelector('button[onclick*="toggleBuildMenu"]');

  container.innerHTML = '';

  HOTBAR_TIER1_CONFIG.forEach(cat => {
    const isActive = (activeHotbarSlot === cat.slotNum);
    const btn = document.createElement('button');
    btn.id = `hotbarSlotBtn_${cat.slotNum}`;
    btn.onclick = () => selectHotbarTier1(cat.slotNum, false);
    btn.title = `[按键 ${cat.slotNum}] ${cat.name} (再次点击循环切换子项)`;
    btn.className = `hotbar-t1-btn px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-all cursor-pointer select-none ${
      isActive 
        ? 'bg-[#00f0ff]/25 border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105' 
        : 'bg-white/5 border-white/20 text-white/70 hover:text-white hover:border-[#00f0ff]/60 hover:bg-white/10'
    }`;

    btn.innerHTML = `
      <span class="w-4 h-4 rounded bg-black/60 border ${isActive ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-white/30 text-white/80'} flex items-center justify-center text-[10px] font-black font-mono shadow-inner">${cat.slotNum}</span>
      <i class="${cat.icon} text-xs ${isActive ? 'text-[#00f0ff]' : 'text-white/60'}"></i>
      <span class="text-xs font-bold font-sans">${cat.name}</span>
    `;
    container.appendChild(btn);
  });

  if (readyBadge) container.appendChild(readyBadge);
  if (qBtn) container.appendChild(qBtn);
}

// 选择一级槽位 (1 - 0)
function selectHotbarTier1(slotNum, isKeyTrigger = false) {
  playUiSound('toggle');
  const cat = HOTBAR_TIER1_CONFIG.find(c => c.slotNum === slotNum);
  if (!cat) return;

  const isSameCategory = (activeHotbarSlot === slotNum);

  if (isSameCategory && isKeyTrigger && isTier2ShelfOpen) {
    // 连按同一个数字键：顺次循环切换二级子项
    cycleHotbarTier2SubItem(cat);
    return;
  }

  activeHotbarSlot = slotNum;
  isTier2ShelfOpen = true;

  // 更新一级按钮高亮
  document.querySelectorAll('.hotbar-t1-btn').forEach(btn => {
    btn.classList.remove('bg-[#00f0ff]/25', 'border-[#00f0ff]', 'text-white', 'shadow-[0_0_12px_rgba(0,240,255,0.4)]', 'scale-105');
    btn.classList.add('bg-white/5', 'border-white/20', 'text-white/70');
  });
  const activeBtn = document.getElementById(`hotbarSlotBtn_${slotNum}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#00f0ff]/25', 'border-[#00f0ff]', 'text-white', 'shadow-[0_0_12px_rgba(0,240,255,0.4)]', 'scale-105');
    activeBtn.classList.remove('bg-white/5', 'border-white/20', 'text-white/70');
  }

  // 更新二级抽屉标头
  const badgeEl = document.getElementById('hotbarTier2CatBadge');
  const nameEl = document.getElementById('hotbarTier2CatName');
  if (badgeEl) badgeEl.innerText = slotNum;
  if (nameEl) nameEl.innerText = cat.name;

  // 渲染二级子项
  renderHotbarTier2(cat);

  // 关闭三级浮窗 (换大类时)
  closeHotbarTier3();

  // 默认选中该大类下的第一个子项或记忆项
  const firstSub = cat.subItems[0];
  if (firstSub) {
    activeHotbarSubKey = firstSub.key;
  }

  const shelf = document.getElementById('dspSubBuildShelf');
  if (shelf) shelf.classList.remove('hidden');

  showNotification(`[按键 ${slotNum}] 已切换至大类: 【${cat.name}】(按 1~${cat.subItems.length} 可快捷选中二级设施)`);
}

// 连按当前键时循环切换二级子项
function cycleHotbarTier2SubItem(cat) {
  if (!cat.subItems || cat.subItems.length === 0) return;
  const curIdx = cat.subItems.findIndex(s => s.key === activeHotbarSubKey);
  const nextIdx = (curIdx + 1) % cat.subItems.length;
  const nextSub = cat.subItems[nextIdx];
  selectHotbarTier2(nextSub.key, true);
}

// 渲染二级子菜单抽屉
function renderHotbarTier2(cat) {
  const container = document.getElementById('dspBuildingCardsContainer');
  if (!container) return;
  container.innerHTML = '';

  cat.subItems.forEach((sub, idx) => {
    const subNum = idx + 1;
    const isSelected = (activeHotbarSubKey === sub.key);
    const hasMultipleVariants = sub.variants && sub.variants.length > 1;

    const btn = document.createElement('button');
    btn.id = `hotbarSubBtn_${sub.key}`;
    btn.onclick = () => selectHotbarTier2(sub.key, false);
    btn.title = `[按键 ${subNum}] ${sub.name} ${hasMultipleVariants ? `(拥有 ${sub.variants.length} 种进阶变体)` : ''}`;
    btn.className = `hotbar-t2-btn px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-all cursor-pointer select-none ${
      isSelected 
        ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-white shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold' 
        : 'bg-[#0f1722] hover:bg-[#182535] border-white/15 hover:border-[#00f0ff]/50 text-white/80 hover:text-white'
    }`;

    btn.innerHTML = `
      <span class="w-3.5 h-3.5 rounded bg-black/60 border ${isSelected ? 'border-[#00f0ff] text-[#00f0ff]' : 'border-white/20 text-white/60'} flex items-center justify-center text-[9px] font-mono font-black">${subNum}</span>
      <i class="${sub.icon} text-xs ${isSelected ? 'text-[#00f0ff]' : 'text-cyan-400/70'}"></i>
      <span class="text-xs font-sans tracking-wide">${sub.name}</span>
      ${hasMultipleVariants ? `<span class="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 ml-0.5">${sub.variants.length}型</span>` : ''}
    `;

    container.appendChild(btn);
  });
}

// 选择二级子项
function selectHotbarTier2(subItemKey, isKeyTrigger = false) {
  playUiSound('click');
  const cat = HOTBAR_TIER1_CONFIG.find(c => c.slotNum === activeHotbarSlot);
  if (!cat) return;

  const sub = cat.subItems.find(s => s.key === subItemKey);
  if (!sub) return;

  activeHotbarSubKey = subItemKey;

  // 更新二级按钮高亮
  document.querySelectorAll('.hotbar-t2-btn').forEach(btn => {
    btn.classList.remove('bg-[#00f0ff]/20', 'border-[#00f0ff]', 'text-white', 'shadow-[0_0_10px_rgba(0,240,255,0.3)]', 'font-bold');
    btn.classList.add('bg-[#0f1722]', 'border-white/15', 'text-white/80');
  });
  const activeBtn = document.getElementById(`hotbarSubBtn_${subItemKey}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#00f0ff]/20', 'border-[#00f0ff]', 'text-white', 'shadow-[0_0_10px_rgba(0,240,255,0.3)]', 'font-bold');
    activeBtn.classList.remove('bg-[#0f1722]', 'border-white/15', 'text-white/80');
  }

  // 判断是否有三级变体
  if (sub.variants && sub.variants.length > 1) {
    // 展开三级变体浮窗
    openHotbarTier3(sub);
    showNotification(`已展开【${sub.name}】的三级规格变体分支 (按 1~${sub.variants.length} 可快捷选择对应型号)`);
  } else {
    // 只有 1 个变体，直接选中就绪！
    closeHotbarTier3();
    const targetVariant = sub.variants[0] || { key: sub.key, name: sub.name, code: '' };
    equipBuildingFromHotbar(targetVariant);
  }
}

// 打开三级变体浮窗
function openHotbarTier3(subItem) {
  isTier3ShelfOpen = true;
  const shelf = document.getElementById('hotbarTier3Shelf');
  const parentNameEl = document.getElementById('hotbarTier3ParentName');
  const container = document.getElementById('hotbarTier3CardsContainer');
  if (!shelf || !container) return;

  if (parentNameEl) parentNameEl.innerText = subItem.name;
  container.innerHTML = '';

  const rememberedKey = hotbarVariantMemory[subItem.key] || subItem.variants[0].key;

  subItem.variants.forEach((v, idx) => {
    const varNum = idx + 1;
    const isSelected = (activeHotbarVariantKey === v.key || rememberedKey === v.key);

    const btn = document.createElement('button');
    btn.id = `hotbarVarBtn_${v.key}`;
    btn.onclick = () => selectHotbarTier3(v);
    btn.title = `[按键 ${varNum}] ${v.name} (${v.sub || ''})`;
    btn.className = `hotbar-t3-btn px-3 py-1 rounded border flex items-center space-x-1.5 transition-all cursor-pointer select-none ${
      isSelected 
        ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)] font-bold scale-105' 
        : 'bg-[#121822] hover:bg-[#1a2434] border-white/20 hover:border-amber-400/60 text-white/80 hover:text-white'
    }`;

    btn.innerHTML = `
      <span class="w-3.5 h-3.5 rounded bg-black/60 border ${isSelected ? 'border-amber-400 text-amber-400' : 'border-white/30 text-white/70'} flex items-center justify-center text-[9px] font-mono font-black">${varNum}</span>
      <span class="text-xs font-sans tracking-wide font-bold">${v.name}</span>
      <span class="text-[9.5px] font-mono text-cyan-300/80 bg-black/40 px-1 py-0.2 rounded border border-white/10">${v.sub}</span>
    `;

    container.appendChild(btn);
  });

  shelf.classList.remove('hidden');
}

// 选择三级变体
function selectHotbarTier3(variant) {
  playUiSound('click');
  activeHotbarVariantKey = variant.key;
  if (activeHotbarSubKey) {
    hotbarVariantMemory[activeHotbarSubKey] = variant.key;
  }

  // 更新三级按钮高亮
  document.querySelectorAll('.hotbar-t3-btn').forEach(btn => {
    btn.classList.remove('bg-amber-500/25', 'border-amber-400', 'text-amber-200', 'shadow-[0_0_12px_rgba(245,158,11,0.4)]', 'font-bold', 'scale-105');
    btn.classList.add('bg-[#121822]', 'border-white/20', 'text-white/80');
  });
  const activeBtn = document.getElementById(`hotbarVarBtn_${variant.key}`);
  if (activeBtn) {
    activeBtn.classList.add('bg-amber-500/25', 'border-amber-400', 'text-amber-200', 'shadow-[0_0_12px_rgba(245,158,11,0.4)]', 'font-bold', 'scale-105');
    activeBtn.classList.remove('bg-[#121822]', 'border-white/20', 'text-white/80');
  }

  // 装备进入建造部署模式
  equipBuildingFromHotbar(variant);
}

// 关闭三级变体浮窗
function closeHotbarTier3() {
  isTier3ShelfOpen = false;
  const shelf = document.getElementById('hotbarTier3Shelf');
  if (shelf) shelf.classList.add('hidden');
}

// 装备建筑进入建造放置就绪模式
function equipBuildingFromHotbar(item) {
  playUiSound('click');
  const bldKey = item.key || 'foundation';
  const bldName = item.name || bldKey;

  // 更新就绪提示框
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  const readyName = document.getElementById('dspReadyBuildingName');
  if (readyBadge) {
    readyBadge.classList.remove('hidden');
    readyBadge.classList.add('flex');
  }
  if (readyName) readyName.innerText = bldName;

  // 联动 3D 建造放置系统
  if (typeof enterBuildPlacingMode === 'function') {
    enterBuildPlacingMode(bldKey);
  }

  showNotification(`🔨 建造就绪: 【${bldName}】(${item.sub || item.code || '标准设施'}) - 左键点击放置，右键取消`);
}

// 折叠或展开二级建筑抽屉
function toggleDspSubShelf(forceState = null) {
  playUiSound('toggle');
  const shelf = document.getElementById('dspSubBuildShelf');
  const toggleIcon = document.getElementById('dspShelfToggleIcon');
  if (!shelf) return;

  if (forceState !== null) {
    isTier2ShelfOpen = !forceState;
  } else {
    isTier2ShelfOpen = !isTier2ShelfOpen;
  }

  if (!isTier2ShelfOpen) {
    shelf.classList.add('hidden');
    closeHotbarTier3();
    if (toggleIcon) toggleIcon.className = 'fa-solid fa-chevron-up text-[10px]';
    showNotification('快捷栏二级菜单已折叠 (按 1~0 数字键随时呼出)');
  } else {
    shelf.classList.remove('hidden');
    if (toggleIcon) toggleIcon.className = 'fa-solid fa-chevron-down text-[10px]';
  }
}

// 全局 1-0 数字按键智能派发器 (核心交互灵魂)
function handleHotbarNumericKey(keyChar) {
  // 1. 如果三级变体浮窗正打开：按数字键优先选择三级变体！
  if (isTier3ShelfOpen) {
    const cat = HOTBAR_TIER1_CONFIG.find(c => c.slotNum === activeHotbarSlot);
    const sub = cat ? cat.subItems.find(s => s.key === activeHotbarSubKey) : null;
    if (sub && sub.variants) {
      const varIdx = parseInt(keyChar) - 1;
      if (varIdx >= 0 && varIdx < sub.variants.length) {
        selectHotbarTier3(sub.variants[varIdx]);
        return;
      }
    }
  }

  // 2. 如果二级抽屉正打开且当前在对应大类下：
  // 若按的数字符合二级子项数量 (1~N)：优先选择该二级子项！
  if (isTier2ShelfOpen) {
    const cat = HOTBAR_TIER1_CONFIG.find(c => c.slotNum === activeHotbarSlot);
    if (cat && cat.subItems) {
      // 特殊情况：如果用户按的正好是当前大类的槽位键（例如在 4 传送物流下又按了一次 4）：
      if (keyChar === activeHotbarSlot) {
        cycleHotbarTier2SubItem(cat);
        return;
      }

      // 如果按的是 1 ~ 子项总数：直接切换到该二级项！
      const subIdx = parseInt(keyChar) - 1;
      if (subIdx >= 0 && subIdx < cat.subItems.length) {
        selectHotbarTier2(cat.subItems[subIdx].key, true);
        return;
      }
    }
  }

  // 3. 否则，数字键 1~0 切换一级大类槽位！
  selectHotbarTier1(keyChar, true);
}

// 按 ESC 或 右键 时逐层回退 (三级变体 ➔ 取消建造就绪 ➔ 主菜单)
function handleHotbarEscape() {
  if (isTier3ShelfOpen) {
    closeHotbarTier3();
    showNotification('已退出三级规格分支，返回二级设施列表');
    return true; // 已拦截处理
  }
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  if (readyBadge && !readyBadge.classList.contains('hidden')) {
    readyBadge.classList.add('hidden');
    readyBadge.classList.remove('flex');
    if (typeof exitBuildPlacingMode === 'function') exitBuildPlacingMode();
    showNotification('已取消建造就绪状态');
    return true;
  }
  return false;
}

// 兼容旧接口
function selectDspCategory(catId) {
  const catKeyMap = { prod: '1', logi: '4', struct: '8', power: '6', aux: '7' };
  const targetSlot = catKeyMap[catId] || '1';
  selectHotbarTier1(targetSlot, false);
}
function selectDspBuilding(buildingKey) {
  equipBuildingFromHotbar({ key: buildingKey, name: buildingKey });
}
function selectHotbarSlot(slotNum, name) {
  selectHotbarTier1(String(slotNum), false);
}
function switchHotbarGroupRelative(dir = 1) {
  const slots = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const curIdx = slots.indexOf(activeHotbarSlot);
  const nextIdx = (curIdx + dir + slots.length) % slots.length;
  selectHotbarTier1(slots[nextIdx], true);
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
    ['buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal', 'swordCasketModal', 'hubMilestoneModal', 'codexModal', 'techTreeModal', 'jinShenModal', 'fabaoModal'].forEach(id => {
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

let currentSelectedBuilding = 'furnace';

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

  const placementContainer = document.getElementById('buildDetailPlacementRules');
  if (placementContainer) {
    const dimTxt = `${data.dimX || 1}×${data.dimY || 1}×${data.dimZ !== undefined ? data.dimZ : 1} 格`;
    const rawBadge = data.canPlaceOnRawMap
      ? '<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">可直放原始地图</span>'
      : '<span class="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 text-amber-300">不可裸放原始地图</span>';
    const occBadge = data.occupancyMode === '不占格'
      ? '<span class="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-200">不占格</span>'
      : '<span class="px-1.5 py-0.5 rounded bg-slate-700/70 border border-white/20 text-white/85">体积占格</span>';
    const topBadge = data.topStackable
      ? '<span class="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-400/40 text-emerald-300">顶部可放</span>'
      : '<span class="px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-400/40 text-rose-300">顶部不可放</span>';
    const rotTxt = data.rotStep === 0 ? '0° (不可旋转)' : `${data.rotStep}°`;
    const extraChips = [];
    if (data.powerRadius > 0) extraChips.push(`供电半径 ${data.powerRadius}格`);
    if (data.containerSlots > 0) extraChips.push(`容器 ${data.containerSlots}格`);
    if (data.pluginSlot && data.pluginSlot !== '无') extraChips.push(`插槽 ${data.pluginSlot}`);
    placementContainer.innerHTML = `
      <div class="flex flex-wrap gap-1.5 font-mono text-[10px]">
        <span class="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-cyan-300">${dimTxt}</span>
        ${rawBadge}
        ${occBadge}
        ${topBadge}
        <span class="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white/80">步进 ${rotTxt}</span>
        ${extraChips.map(c => `<span class="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-200">${c}</span>`).join('')}
      </div>
      <div class="text-[11px] text-amber-200/90 leading-snug bg-black/35 border border-amber-500/25 rounded px-2 py-1.5">${data.placementDesc || '标准工业放置规则'}</div>
    `;
  }

  const costContainer = document.getElementById('buildDetailCostCards');
  if (costContainer) {
    costContainer.innerHTML = '';
    data.costs.forEach(cost => {
      const currentStock = window.isCreativeMode
        ? 999
        : ((typeof playerInventory !== 'undefined' && playerInventory[cost.code] !== undefined) ? playerInventory[cost.code] : (cost.stock || 0));
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
    enterBuildPlacingMode(currentSelectedBuilding || 'furnace');
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
    selectBuildingItem(currentSelectedBuilding || 'furnace');
  }
}

// 同步 HUD 右上角阶段目标物料追踪卡片 (严格对接官方 XIUXIAN_STAGES 与 XIUXIAN_ITEMS)
function syncMilestoneTrackerDisplay() {
  const cfg = (typeof getCurrentMilestoneConfig === 'function') 
    ? getCurrentMilestoneConfig() 
    : ((typeof XIUXIAN_STAGES !== 'undefined' && XIUXIAN_STAGES[1]) ? XIUXIAN_STAGES[1] : null);

  // 动态更新右上角任务目标文本与徽章 (无剧透数字，纯正修仙境界)
  if (cfg) {
    const titleElem = document.getElementById('hudObjectiveTitle');
    if (titleElem) {
      titleElem.innerText = `中央处理器境界突破 (${cfg.layerName || cfg.realm})`;
    }
    const badgeElem = document.getElementById('hudCurrentStageBadge');
    if (badgeElem) {
      badgeElem.innerText = `${cfg.tierName || cfg.realm} · ${cfg.layerName || cfg.stageBadge}`;
    }
  }

  const container = document.getElementById('hudMilestoneCardsContainer');
  if (!container) return;
  container.innerHTML = '';

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
  if (window._world3DSuppressClick) {
    window._world3DSuppressClick = false;
    return;
  }
  if ((typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode) || (typeof isDismantleMode !== 'undefined' && isDismantleMode)) {
    return;
  }
  // 1. 严格 HUD 互斥：若当前有任何界面/模态窗打开，点击任何地方均不触发手持装备攻击与交互！
  if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
    return;
  }
  // 2. 避免点击在模态弹窗内穿透
  if (e.target.closest('#buildModal, #craftModal, #invModal, #searchModal, #machineModal, #storageBoxModal, #swordCasketModal, #hubMilestoneModal, #codexModal, #techTreeModal, #jinShenModal, #fabaoModal')) {
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
    if (typeof toggleTechTreeModal === 'function') {
      toggleTechTreeModal();
    } else {
      triggerMapAction();
    }
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
    if (isBuildPlacingMode && typeof XIUXIAN_BUILDINGS !== 'undefined') {
      e.preventDefault();
      const bKey = (typeof currentPlacingBuildingKey !== 'undefined') ? currentPlacingBuildingKey : 'foundation_2x2';
      const mappedKey = bKey === 'foundation' ? 'foundation_2x2' : (bKey === 'smelter' ? 'furnace' : (bKey === 'constructor' ? 'cutter' : bKey));
      const bDef = XIUXIAN_BUILDINGS[mappedKey] || buildingDatabase[bKey];
      const step = (bDef && typeof bDef.rotStep === 'number') ? bDef.rotStep : 90;
      if (step === 0) {
        placingRotationAngle = 0;
        playUiSound('click');
        showNotification(`【不可旋转】${bDef ? bDef.name : bKey} 策划表旋转步进为 0°`);
      } else {
        placingRotationAngle = (placingRotationAngle + step) % 360;
        playUiSound('toggle');
        const ghost = document.getElementById('buildHologramGhost');
        if (ghost) ghost.style.transform = `translate(-50%, -50%) rotate(${placingRotationAngle}deg)`;
        if (typeof updateBuildPlacementHudCard === 'function') updateBuildPlacementHudCard();
        showNotification(`【旋转全息图】${bDef ? bDef.name : bKey}: ${placingRotationAngle}° (步进 ${step}°)`);
      }
    }
  } else if (key === 'X') {
    e.preventDefault();
    toggleCodexModal();
  } else if (key === 'K') {
    e.preventDefault();
    if (typeof toggleTechTreeModal === 'function') toggleTechTreeModal();
  } else if (key === 'Z') {
    e.preventDefault();
    cycleCombatEquipment(1);
  } else if (key === 'G') {
    if (isDismantleMode) {
      e.preventDefault();
      playUiSound('toggle');
      showNotification('【拆除筛选条件】已设为: 全部工业建筑与设施');
    }
  } else if (key === 'ESCAPE') {
    // 优先处理多级快捷栏逐层回退 (若在3级变体先退回2级；若在放置就绪中取消就绪)
    if (typeof handleHotbarEscape === 'function' && handleHotbarEscape()) {
      return;
    }
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
    document.getElementById('techTreeModal')?.classList.add('hidden');
    document.getElementById('jinShenModal')?.classList.add('hidden');
    document.getElementById('fabaoModal')?.classList.add('hidden');
    if (typeof exitBuildPlacingMode === 'function') exitBuildPlacingMode();
    if (typeof closeAdaDialogue === 'function') closeAdaDialogue();
    if (typeof stopCraftingHold === 'function') stopCraftingHold();
    if (isCinematic) toggleCinematicMode();
    if (isDismantleMode) toggleDismantleMode();
  } else if (/^[0-9]$/.test(e.key)) {
    // 底部 10 槽多级快捷栏全键位响应 (1-9, 0)
    e.preventDefault();
    if (typeof handleHotbarNumericKey === 'function') {
      handleHotbarNumericKey(e.key);
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
function renderCodexBuildingsPane() {
  const pane = document.getElementById('codexPane_buildings');
  if (!pane || typeof XIUXIAN_BUILDINGS === 'undefined') return;
  const entries = Object.entries(XIUXIAN_BUILDINGS);
  pane.innerHTML = entries.map(([key, b]) => {
    const dimTxt = `${b.dimX || 1}×${b.dimY || 1}×${b.dimZ !== undefined ? b.dimZ : 1}`;
    const rawCls = b.canPlaceOnRawMap ? 'text-emerald-300 border-emerald-400/40 bg-emerald-500/15' : 'text-amber-300 border-amber-400/40 bg-amber-500/15';
    const rawTxt = b.canPlaceOnRawMap ? '直放地图: 是' : '直放地图: 否';
    const occTxt = b.occupancyMode || '体积占格';
    const topTxt = b.topStackable ? '顶面可放' : '顶面不可放';
    const rotTxt = b.rotStep === 0 ? '0°' : `${b.rotStep}°`;
    const pwrTxt = b.power < 0 ? `+${Math.abs(b.power)}MW` : `${b.power || 0}MW`;
    return `
      <div class="bg-white/5 border border-white/15 p-3 rounded hover:border-[#00f0ff] transition flex flex-col justify-between space-y-1.5">
        <div>
          <div class="flex items-center justify-between gap-1 text-[#00f0ff] font-bold text-xs mb-1">
            <span class="truncate"><i class="fa-solid fa-industry mr-1"></i>${b.name} (${b.code || key})</span>
            <span class="text-[10px] font-mono text-white/75 shrink-0">${dimTxt} | ${pwrTxt}</span>
          </div>
          <p class="text-[11px] text-white/70 leading-snug mb-1.5">${b.desc || ''}</p>
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap gap-1 font-mono text-[9.5px]">
            <span class="px-1 py-0.5 rounded border ${rawCls}">${rawTxt}</span>
            <span class="px-1 py-0.5 rounded border border-cyan-400/40 bg-cyan-500/15 text-cyan-200">${occTxt}</span>
            <span class="px-1 py-0.5 rounded border border-white/20 bg-white/10 text-white/80">${topTxt}</span>
            <span class="px-1 py-0.5 rounded border border-white/20 bg-white/10 text-white/80">步进 ${rotTxt}</span>
          </div>
          <div class="text-[10px] text-amber-200/90 leading-snug">${b.placementDesc || ''}</div>
        </div>
      </div>
    `;
  }).join('');
}
window.renderCodexBuildingsPane = renderCodexBuildingsPane;

function toggleCodexModal() {
  playUiSound('click');
  if (typeof closeOtherModals === 'function') closeOtherModals('codexModal');
  const modal = document.getElementById('codexModal');
  if (modal) {
    const isOpen = !modal.classList.contains('hidden');
    if (isOpen) {
      modal.classList.add('hidden');
    } else {
      renderCodexBuildingsPane();
      modal.classList.remove('hidden');
      showNotification('已展开【天工法典】(百科全书: 建筑、物料、配方与放置条件)');
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
    'techTreeModal', 'jinShenModal', 'fabaoModal'
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
  // 初始化 1-0 十槽多级快捷栏系统 (1级大类 · 2级子项 · 3级变体规格)
  if (typeof initMultiTierHotbar === 'function') {
    initMultiTierHotbar();
  } else if (typeof selectDspCategory === 'function') {
    selectDspCategory('prod');
  }
  // 初始化 Q 键建筑建造树形卡片 (动态读表 XIUXIAN_BUILDINGS 驱动)
  if (typeof renderBuildingListTree === 'function') {
    renderBuildingListTree('prod');
  }
  // 默认选中精炼炉 (BD_136) 并初始化天工法典全量建筑图鉴
  if (typeof selectBuildingItem === 'function') {
    selectBuildingItem('furnace');
  }
  if (typeof renderCodexBuildingsPane === 'function') {
    renderCodexBuildingsPane();
  }
  // 动态同步右上角阶段里程碑追踪 (纯官方数据库 XIUXIAN_ITEMS 驱动)
  if (typeof syncMilestoneTrackerDisplay === 'function') {
    syncMilestoneTrackerDisplay();
  }
});

// 全局 Alt+滚轮快捷栏组切换 (普通滚轮留给 3D 缩放与建造旋转，不再切换武器)
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
}, { passive: false });

// =========================================================================
// 策划案 2×5 快捷面板核心动作函数 (未解锁/情境交互提示)
// =========================================================================
let isMapUnlocked = false; // 地图需 MAM 研究解锁
let isInVehicle = false;    // 是否处于载具中

// [M] 科技树总览响应
function triggerMapAction() {
  if (typeof toggleTechTreeModal === 'function') {
    toggleTechTreeModal();
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

