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

// 核心保留建筑清单 (52 座玩家可建主干机器，已剔除 51 座上位换皮机/叠层机/传送门/聚变堆/傀儡站/拉线自动变体)
window.CORE_BUILDING_KEYS = new Set([
  "foundation_3x3",
  "bd_108",
  "immortal_roof",
  "cloud_corridor",
  "floating_platform",
  "storage_box",
  "storage_desk",
  "fluid_tank",
  "conveyor",
  "conveyor_mk2",
  "vert_conveyor",
  "merger",
  "splitter",
  "conveyor_limiter",
  "pipe",
  "sky_rail",
  "sword_catapult",
  "lotus_catcher",
  "crane_distributor",
  "miner",
  "heavy_miner",
  "pump",
  "sky_extractor",
  "furnace",
  "crusher",
  "cutter",
  "handcraft",
  "waste_incinerator",
  "research_altar",
  "assembler",
  "assembler_heavy",
  "mixer",
  "centrifuge",
  "extractor",
  "purifier",
  "printer",
  "petri_dish",
  "wood_nursery",
  "bd_163",
  "beast_pen",
  "void_crucible",
  "wind_generator",
  "fuel_generator",
  "power_engine",
  "thunder_accumulator",
  "artificial_sun",
  "alchemy_table",
  "tribulation_table",
  "bd_160",
  "thunder_turret",
  "particle_collider",
  "ascension_silo"
]);

window.PRUNED_BUILDING_INFO = {
  "furnace_mk2": "已砍除 (由光路阵盘/丹药内循环加速替代上位换皮)",
  "entropy_smelter": "已砍除 (由光路阵盘/丹药内循环加速替代上位换皮)",
  "omni_assembler": "已砍除 (由光路阵盘/丹药内循环加速替代上位换皮)",
  "recomposer_mk3": "已砍除 (由光路阵盘/丹药内循环加速替代上位换皮)",
  "alchemy_furnace_mk2": "已砍除 (改用炼丹炉4层叠塔与法宝加成)",
  "immortal_herb_garden": "已砍除 (由培养皿+育苗槽+丹药灌溉替代)",
  "beast_immortal_pool": "已砍除 (由育兽舱+法宝加成替代)",
  "belt_stacker": "已砍除 (飞剑批量空运，无需传送带叠层机)",
  "teleporter": "已砍除 (500x500m无缝大地图+飞剑+无人机视角，无需传送门)",
  "conveyor_mk3": "已砍除 (保留2档传送带，中远距改用飞剑道标桩)",
  "sky_merger": "已合并至飞剑/纸鹤物流体系",
  "sky_splitter": "已合并至飞剑/纸鹤物流体系",
  "sky_launcher": "已合并至发剑台 (sword_catapult)",
  "sky_loader": "已合并至发剑台/飞剑道标",
  "sky_unloader": "已合并至接剑台 (lotus_catcher)",
  "sky_transfer": "已合并至飞剑道标桩 (sky_rail)",
  "sky_receiver": "已合并至接剑台 (lotus_catcher)",
  "bd_117": "自动变体 (拉线拖动自动生成弯带)",
  "bd_118": "自动变体 (拉线拖动自动生成弯带)",
  "bd_119": "自动变体 (高度差自动生成爬坡)",
  "bd_120": "自动变体 (高度差自动生成下坡)",
  "bd_122": "自动变体 (分流器R键切换/重叠交叉)",
  "bd_125": "自动变体 (合流器筛选变体)",
  "bd_126": "自动变体 (分流器筛选变体)",
  "bd_161": "自动变体 (宽体合流变体)",
  "bd_162": "自动变体 (宽体分流变体)",
  "bd_129": "自动变体 (拉管自动生成立面弯管)",
  "bd_130": "自动变体 (拉管自动生成平面弯管)",
  "bd_131": "自动变体 (拉管自动生成侧向接口)",
  "bd_132": "自动变体 (拉管自动生成顶部接口)",
  "bd_133": "自动变体 (拉管自动生成三通分流)",
  "foundation_1x1": "折叠变体 (大地基滚轮缩放切换)",
  "foundation_2x2": "折叠变体 (大地基滚轮缩放切换)",
  "foundation_pillar": "折叠变体 (地基高架自动生成支撑柱)",
  "foundation_beam": "折叠变体 (结构梁变体)",
  "foundation_roof": "折叠变体 (由琉璃大屋顶替代)",
  "bd_109": "折叠变体 (由短楼梯自动延伸)",
  "bd_112": "折叠变体 (高架自动生成支撑)",
  "bd_114": "折叠变体 (储物箱变体)",
  "bd_115": "折叠变体 (储物箱变体)",
  "bd_154": "折叠变体 (置物桌变体)",
  "deconstructor": "已折叠 (拆除模式直接回收)",
  "incubator": "已折叠 (功能合并至培养皿/育苗槽)",
  "smelt_chamber": "已折叠 (功能合并至精炼炉)",
  "fluid_hub": "已折叠 (功能合并至反应釜/储液罐)",
  "bio_base": "已折叠 (功能合并至育苗槽/育兽舱)",
  "belt_sprayer": "已延后 (增产体系暂不单独建喷涂机)",
  "immortal_receiver": "已折叠 (功能合并至小仙阳电堆)",
  "banner_ejector": "已折叠 (功能合并至光路阵盘)",
  "battle_base": "已砍除 (傀儡体系整体移除，战场收尸、修塔与小批量配送统一由千纸鹤负责)",
  "fusion_reactor": "已合并至小仙阳电堆 (能源精简为3代发电+1蓄电池共4座)"
};

window.PRUNED_ITEM_INFO = {
  "mat_093": "已砍除 (现代石化黑原油，违和且冗余，改由灵泉/灵草线替代)",
  "mat_094": "已砍除 (现代精燃油，合并至灵石/煤燃料线)",
  "mat_095": "已砍除 (现代润滑油，机械凑数中间品)",
  "mat_096": "已砍除 (现代硬塑料，改由木板/玻璃替代)",
  "mat_097": "已砍除 (现代软橡胶，凑数化工中间品)",
  "MAT_012": "已砍除 (磁齿轮，与铁齿轮重复)",
  "mat_012": "已砍除 (管阀门，拉水管无需单独造阀门零件)",
  "mat_042": "已砍除 (玄铁管，水管直接用玄铁板建造)",
  "MAT_047": "已砍除 (循环水泵件，纯凑数机器零件)",
  "mat_049": "已砍除 (传动带零件，与传送带建筑概念混淆)",
  "mat_060": "已砍除 (玄铁架，与玄铁梁重复)",
  "mat_061": "已砍除 (传动轴，与铁齿轮重复)",
  "MAT_045": "已砍除 (耐火芯，前期造炉子无需多套一层耐火芯)",
  "MAT_075": "已砍除 (探矿仪，无独立玩法用途的凑数件)",
  "mat_066": "已砍除 (小电池，已有空置/满电蓄电池闭环)",
  "mat_101": "已砍除 (空药瓶，炼丹直接出丹药无需造玻璃瓶)",
  "mat_040": "已砍除 (机器壳，前期建厂直接消耗铁板/齿轮即可)",
  "mat_088": "已砍除 (赤铜粉，仅单点过渡，直接用赤铜锭/铜片)",
  "MAT_067": "已砍除 (木支架，与木板重复)",
  "MAT_068": "已砍除 (木炭灰，多余废料副产物)",
  "mat_104": "已砍除 (重铅锭，灵石分选副产直接合并至重铅板)",
  "mat_044": "已砍除 (生物过滤芯，3层滤芯套娃第1层，保留净化剂即可)",
  "mat_055": "已砍除 (复合过滤芯，3层滤芯套娃第2层)",
  "mat_045": "已砍除 (高阶净化核，3层滤芯套娃第3层)",
  "MAT_040": "已砍除 (过滤渣，与药渣重复，统一合并为药渣)",
  "mat_027": "已砍除 (凝血膏，生物液套娃，由活血胎统合)",
  "mat_053": "已砍除 (人造灵经脉，生物套娃中间层，直接由活血胎打印骨板)",
  "MAT_028": "已砍除 (灵草种，培养皿通灵水直接培育灵草)",
  "mat_111": "已砍除 (小树苗，育苗槽通灵水直接培育原木)",
  "mat_112": "已砍除 (灵兽卵，育兽舱直接饲育灵兽)",
  "mat_142": "已砍除 (高空星阵旗，阵旗弹射器已折叠，终局统一走飞升破界梭)"
};

window.CORE_ITEM_KEYS = new Set(["MAT_001","MAT_002","MAT_004","MAT_006","MAT_007","MAT_008","MAT_009","MAT_011","MAT_013","MAT_014","mat_013","mat_014","mat_015","MAT_019","MAT_020","mat_018","MAT_022","MAT_023","mat_021","mat_022","mat_023","MAT_027","MAT_029","MAT_031","mat_029","MAT_033","MAT_034","mat_032","MAT_036","MAT_037","MAT_038","mat_037","mat_038","MAT_043","mat_046","MAT_051","MAT_052","mat_050","MAT_055","MAT_056","mat_054","mat_056","mat_057","mat_058","mat_059","MAT_066","mat_065","MAT_071","mat_068","mat_069","mat_070","mat_072","MAT_077","mat_074","mat_075","mat_076","mat_077","mat_078","mat_079","mat_080","mat_081","mat_082","mat_083","mat_084","mat_085","mat_086","mat_087","mat_089","mat_090","mat_091","mat_092","mat_098","mat_099","mat_100","mat_102","mat_103","mat_105","mat_106","mat_107","mat_108","mat_109","mat_110","mat_113","mat_114","mat_115","mat_116","mat_117","mat_118","mat_119","mat_120","mat_121","mat_122","mat_123","mat_124","mat_125","mat_126","mat_127","mat_128","mat_129","mat_130","mat_131","mat_132","mat_133","mat_134","mat_135","mat_136","mat_137","mat_138","mat_139","mat_140","mat_141","mat_143","mat_144","mat_145","mat_146","mat_147","mat_148"]);

window.BUILDING_CORE_REDIRECT = {
  "smelt_chamber": "furnace",
  "furnace_mk2": "furnace",
  "entropy_smelter": "furnace",
  "incubator": "petri_dish",
  "immortal_herb_garden": "petri_dish",
  "omni_assembler": "assembler_heavy",
  "recomposer_mk3": "assembler_heavy",
  "alchemy_furnace_mk2": "bd_163",
  "beast_immortal_pool": "beast_pen"
};

window.CORE_RECIPE_KEYS = new Set(["rcp_001","rcp_002","rcp_003","rcp_004","rcp_005","rcp_006","rcp_007","rcp_008","rcp_009","rcp_010","rcp_012","rcp_013","rcp_014","rcp_015","rcp_019","rcp_020","rcp_021","rcp_023","rcp_025","rcp_027","rcp_032","rcp_033","rcp_034","rcp_035","rcp_038","rcp_039","rcp_044","rcp_045","rcp_047","rcp_049","rcp_051","rcp_052","rcp_053","rcp_056","rcp_059","rcp_060","rcp_061","rcp_062","rcp_063","rcp_066","rcp_068","rcp_069","rcp_088","rcp_089","rcp_090","rcp_094","rcp_096","rcp_097","rcp_098","rcp_099","rcp_100","rcp_102","rcp_106","rcp_107","rcp_108","rcp_109","rcp_110","rcp_112","rcp_113","rcp_117","rcp_127","rcp_128","rcp_129","rcp_131","rcp_132","rcp_133","rcp_134","rcp_135","rcp_136","rcp_138","rcp_142","rcp_143","rcp_171","rcp_175","rcp_176","rcp_177","rcp_185","rcp_187","rcp_191","rcp_192","rcp_193","rcp_194","rcp_195","rcp_197","rcp_198","rcp_199","rcp_200","rcp_202","rcp_204","rcp_206","rcp_207","rcp_211","rcp_212","rcp_214","rcp_215","rcp_216","rcp_217","rcp_219","rcp_220","rcp_222","rcp_223","rcp_225","rcp_226","rcp_230","rcp_232","rcp_236","rcp_238","rcp_240","rcp_242","rcp_244","rcp_246","rcp_248","rcp_250","rcp_252","rcp_254","rcp_263","rcp_266","rcp_270","rcp_272","rcp_273","rcp_276","rcp_280","rcp_285"]);

window.PRUNED_RECIPE_INFO = {
  "rcp_011": "已砍除主线冗余配方 (已砍除 (木支架，与木板重复))",
  "rcp_017": "已砍除冗余残卷配方 (依赖已删物料 净化水)",
  "rcp_022": "已砍除冗余残卷配方 (依赖已删物料 木炭灰)",
  "rcp_024": "已砍除冗余残卷配方 (依赖已删物料 凝血膏)",
  "rcp_026": "已砍除冗余残卷配方 (依赖已删物料 蛋白液)",
  "rcp_028": "已砍除冗余残卷配方 (依赖已删物料 净化水)",
  "rcp_029": "已砍除主线冗余配方 (已砍除 (生物过滤芯，3层滤芯套娃第1层，保留净化剂即可))",
  "rcp_030": "已砍除主线冗余配方 (已砍除 (磁齿轮，与铁齿轮重复))",
  "rcp_031": "已砍除主线冗余配方 (已砍除 (管阀门，拉水管无需单独造阀门零件))",
  "rcp_040": "已砍除主线冗余配方 (已砍除 (机器壳，前期建厂直接消耗铁板/齿轮即可))",
  "rcp_041": "已砍除主线冗余配方 (已砍除 (玄铁管，水管直接用玄铁板建造))",
  "rcp_042": "已砍除主线冗余配方 (已砍除 (循环水泵件，纯凑数机器零件))",
  "rcp_046": "已砍除主线冗余配方 (已砍除 (传动带零件，与传送带建筑概念混淆))",
  "rcp_050": "已砍除主线冗余配方 (已砍除 (复合过滤芯，3层滤芯套娃第2层))",
  "rcp_054": "已砍除主线冗余配方 (已砍除 (玄铁架，与玄铁梁重复))",
  "rcp_055": "已砍除主线冗余配方 (已砍除 (传动轴，与铁齿轮重复))",
  "rcp_057": "已砍除主线冗余配方 (已砍除 (小电池，已有空置/满电蓄电池闭环))",
  "rcp_058": "已砍除主线冗余配方 (已砍除 (探矿仪，无独立玩法用途的凑数件))",
  "rcp_067": "已砍除冗余残卷配方 (依赖已删物料 净化水)",
  "rcp_070": "已砍除冗余残卷配方 (依赖已删物料 过滤渣)",
  "rcp_101": "已砍除冗余残卷配方 (依赖已删物料 高纯人造石)",
  "rcp_103": "已砍除冗余残卷配方 (依赖已删物料 高纯人造石)",
  "rcp_111": "已砍除冗余残卷配方 (依赖已删物料 磁齿轮)",
  "rcp_122": "已砍除主线冗余配方 (已砍除 (现代硬塑料，改由木板/玻璃替代))",
  "rcp_123": "已砍除主线冗余配方 (已砍除 (现代软橡胶，凑数化工中间品))",
  "rcp_124": "已砍除主线冗余配方 (已砍除 (现代精燃油，合并至灵石/煤燃料线))",
  "rcp_130": "已砍除主线冗余配方 (已砍除 (空药瓶，炼丹直接出丹药无需造玻璃瓶))",
  "rcp_137": "已砍除冗余残卷配方 (依赖已删物料 高纯人造石)",
  "rcp_139": "已砍除冗余残卷配方 (依赖已删物料 绝缘板)",
  "rcp_140": "已砍除冗余残卷配方 (依赖已删物料 硬塑料)",
  "rcp_144": "已砍除冗余残卷配方 (依赖已删物料 磁齿轮)",
  "rcp_145": "已砍除冗余残卷配方 (依赖已删物料 传动带)",
  "rcp_146": "已砍除冗余残卷配方 (依赖已删物料 管阀门)",
  "rcp_147": "已砍除冗余残卷配方 (依赖已删物料 软橡胶)",
  "rcp_148": "已砍除冗余残卷配方 (依赖已删物料 绝缘板)",
  "rcp_149": "已砍除冗余残卷配方 (依赖已删物料 精炼玄铁锭)",
  "rcp_151": "已砍除冗余残卷配方 (依赖已删物料 木炭灰)",
  "rcp_152": "已砍除冗余残卷配方 (依赖已删物料 灵草种)",
  "rcp_154": "已砍除冗余残卷配方 (依赖已删物料 耐火芯)",
  "rcp_155": "已砍除冗余残卷配方 (依赖已删物料 爆裂剑丸)",
  "rcp_156": "已砍除冗余残卷配方 (依赖已删物料 机器壳)",
  "rcp_157": "已砍除冗余残卷配方 (依赖已删物料 管阀门)",
  "rcp_158": "已砍除冗余残卷配方 (依赖已删物料 生物过滤芯)",
  "rcp_165": "已砍除冗余残卷配方 (依赖已删物料 净化水)",
  "rcp_178": "已砍除冗余残卷配方 (依赖已删物料 空药瓶)",
  "rcp_179": "已砍除冗余残卷配方 (依赖已删物料 空药瓶)",
  "rcp_188": "已砍除冗余残卷配方 (依赖已删物料 高纯人造石)",
  "rcp_196": "已砍除冗余残卷配方 (依赖已删物料 小树苗)",
  "rcp_203": "已砍除冗余残卷配方 (依赖已删物料 灵草粉)",
  "rcp_205": "已砍除冗余残卷配方 (依赖已删物料 灵兽卵)",
  "rcp_209": "已砍除冗余残卷配方 (依赖已删物料 复合过滤芯)",
  "rcp_210": "已砍除冗余残卷配方 (依赖已删物料 凝血膏)",
  "rcp_213": "已砍除冗余残卷配方 (依赖已删物料 空药瓶)",
  "rcp_218": "已砍除冗余残卷配方 (依赖已删物料 高阶净化核)",
  "rcp_221": "已砍除冗余残卷配方 (依赖已删物料 高纯人造石)",
  "rcp_224": "已砍除冗余残卷配方 (依赖已删物料 复合过滤芯)",
  "rcp_231": "已砍除冗余残卷配方 (依赖已删物料 玄铁架)",
  "rcp_233": "已砍除冗余残卷配方 (依赖已删物料 小电池)",
  "rcp_241": "已砍除冗余残卷配方 (依赖已删物料 高阶催化尘)",
  "rcp_264": "已砍除冗余残卷配方 (依赖已删物料 精炼玄铁锭)",
  "rcp_265": "已砍除冗余残卷配方 (依赖已删物料 精炼玄铁锭)",
  "rcp_267": "已砍除冗余残卷配方 (依赖已删物料 机器附魔核)",
  "rcp_271": "已砍除冗余残卷配方 (依赖已删物料 机器附魔核)",
  "rcp_048": "已砍除主线冗余配方 (人造经脉中间层已砍，活血胎+骸骨直接打印骨板)",
  "rcp_201": "已砍除主线冗余配方 (灵兽卵中间层已砍，育兽舱直接饲育)"
};

const HOTBAR_TIER1_CONFIG = [
  {
    slotNum: 1,
    name: '基建',
    icon: 'fa-solid fa-layer-group',
    subItems: [
      {
        key: 'foundation',
        name: '地基建筑',
        icon: 'fa-solid fa-border-all',
        variants: [
          { key: 'foundation_3x3', name: '大地基' },
          { key: 'bd_108', name: '短楼梯' },
          { key: 'immortal_roof', name: '琉璃大屋顶' },
          { key: 'cloud_corridor', name: '空中连廊桥' },
          { key: 'floating_platform', name: '高空浮空台' }
        ]
      },
      {
        key: 'storage',
        name: '仓储容器',
        icon: 'fa-solid fa-box',
        variants: [
          { key: 'storage_box', name: '储物箱' },
          { key: 'storage_desk', name: '置物桌' },
          { key: 'fluid_tank', name: '储液罐' }
        ]
      }
    ]
  },
  {
    slotNum: 2,
    name: '物流',
    icon: 'fa-solid fa-truck-fast',
    subItems: [
      {
        key: 'belt',
        name: '传送带网',
        icon: 'fa-solid fa-angles-right',
        variants: [
          { key: 'conveyor', name: '传送带' },
          { key: 'vert_conveyor', name: '垂直传送带' },
          { key: 'merger', name: '合流器' },
          { key: 'splitter', name: '分流器' },
          { key: 'conveyor_limiter', name: '限速器' }
        ]
      },
      {
        key: 'fluid_pipe',
        name: '流体水管',
        icon: 'fa-solid fa-faucet-drip',
        variants: [
          { key: 'pipe', name: '水管' }
        ]
      },
      {
        key: 'sky_logistics',
        name: '飞剑空运',
        icon: 'fa-solid fa-jet-fighter-up',
        variants: [
          { key: 'sky_rail', name: '飞剑航线桩' },
          { key: 'sword_catapult', name: '飞剑发货台' },
          { key: 'lotus_catcher', name: '飞剑收货台' }
        ]
      }
    ]
  },
  {
    slotNum: 3,
    name: '采炼',
    icon: 'fa-solid fa-hammer',
    subItems: [
      {
        key: 'mining',
        name: '开采采集',
        icon: 'fa-solid fa-mountain',
        variants: [
          { key: 'miner', name: '采矿机' },
          { key: 'heavy_miner', name: '大型采矿机' },
          { key: 'pump', name: '抽水机' },
          { key: 'sky_extractor', name: '高空采气塔' }
        ]
      },
      {
        key: 'smelting',
        name: '精炼初加工',
        icon: 'fa-solid fa-fire-burner',
        variants: [
          { key: 'furnace', name: '精炼炉' },
          { key: 'crusher', name: '粉碎机' },
          { key: 'cutter', name: '切割机' },
          { key: 'handcraft', name: '操作台' },
          { key: 'waste_incinerator', name: '焚毁井' },
          { key: 'research_altar', name: '推演台' }
        ]
      }
    ]
  },
  {
    slotNum: 4,
    name: '制造',
    icon: 'fa-solid fa-industry',
    subItems: [
      {
        key: 'assembly',
        name: '复合组装',
        icon: 'fa-solid fa-gears',
        variants: [
          { key: 'assembler', name: '加工台' },
          { key: 'assembler_heavy', name: '组装机' },
          { key: 'printer', name: '打印机' },
          { key: 'void_crucible', name: '转化炉' }
        ]
      },
      {
        key: 'chemical',
        name: '萃取净化',
        icon: 'fa-solid fa-vial',
        variants: [
          { key: 'mixer', name: '搅拌机' },
          { key: 'centrifuge', name: '离心机' },
          { key: 'extractor', name: '提取器' },
          { key: 'purifier', name: '净化塔' }
        ]
      }
    ]
  },
  {
    slotNum: 5,
    name: '丹植',
    icon: 'fa-solid fa-seedling',
    subItems: [
      {
        key: 'alchemy_bio',
        name: '丹炉灵植与赋能',
        icon: 'fa-solid fa-mortar-pestle',
        variants: [
          { key: 'power_engine', name: '热能底座' },
          { key: 'bd_163', name: '炼丹炉' },
          { key: 'crane_distributor', name: '纸鹤赋能台' },
          { key: 'petri_dish', name: '培养皿' },
          { key: 'wood_nursery', name: '育苗槽' },
          { key: 'beast_pen', name: '育兽舱' }
        ]
      }
    ]
  },
  {
    slotNum: 6,
    name: '能源',
    icon: 'fa-solid fa-bolt',
    subItems: [
      {
        key: 'power_gen',
        name: '三代发电与蓄电',
        icon: 'fa-solid fa-plug-circle-bolt',
        variants: [
          { key: 'wind_generator', name: '风力发电机' },
          { key: 'fuel_generator', name: '燃料发电机' },
          { key: 'artificial_sun', name: '小仙阳电堆' },
          { key: 'thunder_accumulator', name: '充放蓄电池' }
        ]
      }
    ]
  },
  {
    slotNum: 7,
    name: '法宝',
    icon: 'fa-solid fa-wand-magic-sparkles',
    subItems: [
      {
        key: 'fabao_def',
        name: '法宝防御',
        icon: 'fa-solid fa-shield-halved',
        variants: [
          { key: 'alchemy_table', name: '炼宝台' },
          { key: 'tribulation_table', name: '渡劫台' },
          { key: 'bd_160', name: '飞剑防御塔' },
          { key: 'thunder_turret', name: '天雷防御塔' }
        ]
      },
      {
        key: 'ascension',
        name: '终局飞升',
        icon: 'fa-solid fa-rocket',
        variants: [
          { key: 'particle_collider', name: '粒子对撞机' },
          { key: 'ascension_silo', name: '飞升发射井' }
        ]
      }
    ]
  }
];

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
    if (Array.isArray(window.ALL_HUD_MODAL_IDS)) {
      if (!window.ALL_HUD_MODAL_IDS.includes('powerGridModal')) window.ALL_HUD_MODAL_IDS.push('powerGridModal');
      if (!window.ALL_HUD_MODAL_IDS.includes('mapExploreModal')) window.ALL_HUD_MODAL_IDS.push('mapExploreModal');
    }
    window.ALL_HUD_MODAL_IDS.forEach(id => {
      if (id !== current) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      }
    });
  } else {
    ['buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal', 'storageBoxModal', 'swordCasketModal', 'hubMilestoneModal', 'codexModal', 'techTreeModal', 'jinShenModal', 'fabaoModal', 'conveyorLimiterModal', 'logisticsConfigModal', 'shaqiControlModal', 'opticalArrayModal', 'powerGridModal', 'mapExploreModal'].forEach(id => {
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
window.showPrunedBuildingsInModal = window.showPrunedBuildingsInModal || false;
function renderBuildingListTree(tabId = 'prod') {
  const container = document.getElementById('buildingListTree');
  if (!container) return;
  container.innerHTML = '';

  const filterBar = document.createElement('div');
  filterBar.className = 'flex items-center justify-between px-2 py-1.5 mb-2 rounded bg-black/30 border border-white/10 text-[11px]';
  const showAll = !!window.showPrunedBuildingsInModal;
  filterBar.innerHTML = `
    <span class="text-white/75">${showAll ? '当前显示全部 103 座建筑（含已精简/自动变体）' : '已精简建造面板：仅显示 54 座核心主干建筑（隐藏 49 座上位换皮/自动变体）'}</span>
    <button type="button" id="togglePrunedBuildingsBtn" class="px-2 py-0.5 rounded border border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 transition cursor-pointer">${showAll ? '仅看核心 54 座' : '查看已精简 49 座'}</button>
  `;
  container.appendChild(filterBar);
  const toggleBtn = filterBar.querySelector('#togglePrunedBuildingsBtn');
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      window.showPrunedBuildingsInModal = !window.showPrunedBuildingsInModal;
      renderBuildingListTree(tabId);
    };
  }

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
    const blds = Object.values(buildingDatabase).filter(b =>
      b.group === grpKey && (showAll || !window.CORE_BUILDING_KEYS || window.CORE_BUILDING_KEYS.has(b.key))
    );
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
      const isPruned = window.CORE_BUILDING_KEYS && !window.CORE_BUILDING_KEYS.has(b.key);
      const card = document.createElement('div');
      card.id = `bcard-${b.key}`;
      card.onclick = () => selectBuildingItem(b.key);
      card.className = `build-item-card w-full h-24 rounded flex flex-col items-center justify-center p-2 cursor-pointer transition select-none ${isSelected ? 'bg-[#e0770b] border-2 border-[#ff9d24] shadow-[0_0_12px_rgba(245,146,30,0.5)]' : (isPruned ? 'bg-white/[0.02] opacity-65 hover:opacity-100 border border-rose-400/25' : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40')}`;
      card.innerHTML = `
        <div class="w-10 h-10 flex items-center justify-center mb-1">
          ${b.svg}
        </div>
        <span class="text-[11px] font-bold text-center text-white/90 leading-tight">${b.name}</span>
        <span class="text-[8px] font-mono ${isPruned ? 'text-rose-300/80' : 'text-cyan-300/80'}">${isPruned ? '已精简' : b.code}</span>
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



// 还原上帝建厂模式 10 格血条样式
function restoreGodModeHpSegments() {
  const segments = document.getElementById('hpSegments')?.children;
  if (!segments) return;
  for (let i = 0; i < 10; i++) {
    if (i < currentHpIndex) {
      segments[i].className = 'hp-segment w-2 h-4 bg-[#00f0ff] rounded-[1px] shadow-[0_0_4px_#00f0ff]';
    } else {
      segments[i].className = 'hp-segment w-2 h-4 bg-white/15 rounded-[1px]';
    }
  }
}
window.restoreGodModeHpSegments = restoreGodModeHpSegments;

// 点击生命值分段测试扣血与回血
function toggleHealthDamage() {
  playUiSound('click');
  if (window.CombatSystem && window.CombatSystem.isActive() && window.CombatPlayer) {
    const p = window.CombatPlayer.getState();
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    showNotification(`【战斗生命体征】机身耐久 ${Math.ceil(p.hp)}/${cfg.maxHp || 100} · 护体罡气 ${Math.ceil(p.shield)}/${cfg.maxShield || 60}`);
    return;
  }
  currentHpIndex--;
  if (currentHpIndex < 2) currentHpIndex = 10;
  restoreGodModeHpSegments();
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
  if (window.CombatSystem && window.CombatSystem.isActive()) {
    if (window.CombatInput) window.CombatInput.releaseLock();
    if (typeof toggleInventoryModal === 'function') toggleInventoryModal();
    return;
  }
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
  if (window.CombatSystem && window.CombatSystem.isActive()) {
    return;
  }
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

let lastCombatExitBPressMs = 0;

// 键盘全局按键绑定 (Q, C, Tab, M, N, F, V, H, SPACE, 1-0, ESC, B, F8, F9)
document.addEventListener('keydown', (e) => {
  if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT') && e.key !== 'Escape') {
    return;
  }

  if (e.code === 'F9') {
    e.preventDefault();
    if (window.CombatSystem) window.CombatSystem.toggleTuningPanel();
    return;
  }

  if (e.code === 'F8') {
    e.preventDefault();
    if (window.CombatSystem && window.CombatSystem.isActive()) {
      window.CombatSystem.exit();
    }
    return;
  }

  if (e.ctrlKey || e.altKey || e.metaKey) return;

  const upperKey = (e.key || '').toUpperCase();
  if (upperKey === 'B' && !(typeof isAnyModalOpen === 'function' && isAnyModalOpen())) {
    e.preventDefault();
    if (window.CombatSystem) {
      if (window.CombatSystem.isActive()) {
        if (e.repeat) return;
        const now = performance.now();
        if (now - lastCombatExitBPressMs <= 800) {
          lastCombatExitBPressMs = 0;
          window.CombatSystem.exit();
        } else {
          lastCombatExitBPressMs = now;
          if (typeof showNotification === 'function') {
            showNotification('【防误触】0.8秒内再按一次 [B] 或按 [F8] 返回建厂模式');
          }
        }
      } else {
        lastCombatExitBPressMs = 0;
        window.CombatSystem.enter();
      }
    }
    return;
  }

  // 第一人称战斗模式下：仅放行 [Tab] 剑匣背包与 [Esc] 关闭弹窗并自动解锁鼠标，禁止 Q/X/M/N/K/1-0/Z/V/G/T/F/H 误弹建厂窗口
  if (window.CombatSystem && window.CombatSystem.isActive()) {
    const modalOpenNow = (typeof isAnyModalOpen === 'function' && isAnyModalOpen());
    if (!modalOpenNow) {
      const globalHudKeys = ['TAB', 'ESCAPE'];
      if (globalHudKeys.includes(upperKey)) {
        if (window.CombatInput) window.CombatInput.releaseLock();
      } else {
        return;
      }
    }
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
  } else if (key === 'U') {
    e.preventDefault();
    if (window.ShaqiSystem && typeof window.ShaqiSystem.toggleModal === 'function') {
      window.ShaqiSystem.toggleModal();
    }
  } else if (key === 'P') {
    e.preventDefault();
    if (window.OpticalArrayHUD && typeof window.OpticalArrayHUD.toggleModal === 'function') {
      window.OpticalArrayHUD.toggleModal();
    }
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
    document.getElementById('shaqiControlModal')?.classList.add('hidden');
    document.getElementById('opticalArrayModal')?.classList.add('hidden');
    document.getElementById('powerGridModal')?.classList.add('hidden');
    document.getElementById('mapExploreModal')?.classList.add('hidden');
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
  if (window.CombatSystem && window.CombatSystem.isActive()) return;
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
    const isCore = !window.CORE_BUILDING_KEYS || window.CORE_BUILDING_KEYS.has(key);
    const pruneReason = (window.PRUNED_BUILDING_INFO && window.PRUNED_BUILDING_INFO[key]) || '';
    const statusBadge = isCore
      ? '<span class="px-1 py-0.5 rounded border border-emerald-400/50 bg-emerald-500/20 text-emerald-300">核心主干</span>'
      : `<span class="px-1 py-0.5 rounded border border-rose-400/50 bg-rose-500/20 text-rose-300" title="${pruneReason}">已精简</span>`;
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
            ${statusBadge}
            <span class="px-1 py-0.5 rounded border ${rawCls}">${rawTxt}</span>
            <span class="px-1 py-0.5 rounded border border-cyan-400/40 bg-cyan-500/15 text-cyan-200">${occTxt}</span>
            <span class="px-1 py-0.5 rounded border border-white/20 bg-white/10 text-white/80">${topTxt}</span>
            <span class="px-1 py-0.5 rounded border border-white/20 bg-white/10 text-white/80">步进 ${rotTxt}</span>
          </div>
          <div class="text-[10px] text-amber-200/90 leading-snug">${pruneReason ? `[精简说明: ${pruneReason}] ` : ''}${b.placementDesc || ''}</div>
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
      showNotification('已展开【工业数据图鉴】(建筑、物料、配方全量查询)');
    }
  }
}

window.switchCentralProcessorTab = function (tab) {
  if (typeof playUiSound === 'function') playUiSound('click');
  if (tab === 'milestone') {
    if (typeof openHubMilestoneModal === 'function') openHubMilestoneModal();
  } else if (tab === 'tech') {
    if (typeof openTechTreeModal === 'function') openTechTreeModal();
  } else if (tab === 'array') {
    if (typeof closeOtherModals === 'function') closeOtherModals('opticalArrayModal');
    if (window.OpticalArrayHUD && typeof window.OpticalArrayHUD.openModal === 'function') {
      window.OpticalArrayHUD.openModal();
    } else {
      const m = document.getElementById('opticalArrayModal');
      if (m) m.classList.remove('hidden');
    }
  }
};

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
    'techTreeModal', 'jinShenModal', 'fabaoModal', 'powerGridModal', 'mapExploreModal'
  ];
  ['powerGridModal', 'mapExploreModal'].forEach(id => {
    if (!modalIds.includes(id)) modalIds.push(id);
  });
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

// ==================== 高空灵舟天轨物流系统（1:1 复刻炼金工厂矿车玩法） ====================
(function initSpiritShipSystem() {
  const SKY_KEYS = ['sky_rail', 'sky_merger', 'sky_splitter', 'sky_launcher', 'sky_loader', 'sky_unloader', 'sky_transfer', 'sky_receiver'];
  const COLORS = ['青', '金', '朱', '紫', '玄'];
  const LOGIC_OPS = ['AND', 'OR', 'NOT'];

  const state = {
    shipColor: '青',
    shipTag: 'DAN.01',
    filterOp: 'AND',
    filterColor: '青',
    filterPrefix: 'DAN',
    loaderPackages: 2,
    loaderCapacity: 4,
    unloaderPackages: 1,
    unloaderCapacity: 4,
    transferPackages: 4,
    transferCapacity: 8,
    dispatchedCount: 1,
    unloadedCount: 0,
    recycledCount: 0
  };

  function getPrefix(tag) {
    const raw = String(tag || '').trim().toUpperCase();
    return raw.includes('.') ? raw.split('.')[0].trim() : raw;
  }

  function matchFilter(shipTag, shipColor, rule) {
    const r = rule || { op: state.filterOp, color: state.filterColor, prefix: state.filterPrefix };
    const op = String(r.op || 'AND').toUpperCase();
    const targetColor = String(r.color || '').trim();
    const targetPrefix = String(r.prefix || '').trim().toUpperCase();
    const actualColor = String(shipColor || '').trim();
    const actualTag = String(shipTag || '').trim().toUpperCase();
    const actualPrefix = getPrefix(actualTag);

    const colorOk = targetColor ? (actualColor === targetColor) : true;
    const prefixOk = targetPrefix
      ? (actualPrefix === targetPrefix || actualTag === targetPrefix || actualTag.startsWith(`${targetPrefix}.`))
      : true;

    if (op === 'OR') return colorOk || prefixOk;
    if (op === 'NOT') return !(colorOk && prefixOk);
    return colorOk && prefixOk;
  }

  function refreshMachineUi() {
    if (typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && SKY_KEYS.includes(currentOpenedMachine)) {
      renderMachineProdView();
    }
  }

  function setShipConfig(color, tag) {
    if (COLORS.includes(color)) state.shipColor = color;
    if (tag !== undefined && String(tag).trim()) state.shipTag = String(tag).trim().toUpperCase();
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshMachineUi();
    return state;
  }

  function setRuleConfig(op, color, prefix) {
    if (LOGIC_OPS.includes(String(op || '').toUpperCase())) state.filterOp = String(op).toUpperCase();
    if (color !== undefined && COLORS.includes(color)) state.filterColor = color;
    if (prefix !== undefined) state.filterPrefix = String(prefix).trim().toUpperCase();
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshMachineUi();
    return state;
  }

  function packToLoader() {
    if (state.loaderPackages >= state.loaderCapacity) {
      if (typeof showNotification === 'function') showNotification('【装载站已满】乾坤货匣缓冲已达上限 (4/4)，等待灵舟飞过吊装');
      return false;
    }
    state.loaderPackages += 1;
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshMachineUi();
    return true;
  }

  function launchAndDispatch() {
    const matched = matchFilter(state.shipTag, state.shipColor);
    const moved = Math.min(state.loaderPackages, Math.max(0, state.unloaderCapacity - state.unloaderPackages));
    state.dispatchedCount += 1;
    if (matched) {
      state.loaderPackages -= moved;
      state.unloaderPackages += moved;
      state.unloadedCount += moved;
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(
        matched
          ? `🛸【灵舟命中 (${state.shipColor}·${state.shipTag})】${state.filterOp}(${state.filterColor},${state.filterPrefix}) 匹配成功，高空吊装卸载 ${moved} 个乾坤货匣！`
          : `🛸【灵舟分流跳过 (${state.shipColor}·${state.shipTag})】未命中 ${state.filterOp}(${state.filterColor},${state.filterPrefix})，灵舟沿高空支路继续飞行！`
      );
    }
    refreshMachineUi();
    return { matched, moved };
  }

  function runTransferStep() {
    if (state.loaderPackages > 0 && state.transferPackages < state.transferCapacity) {
      state.loaderPackages -= 1;
      state.transferPackages += 1;
    } else if (state.transferPackages > 0 && state.unloaderPackages < state.unloaderCapacity) {
      state.transferPackages -= 1;
      state.unloaderPackages += 1;
      state.unloadedCount += 1;
    }
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshMachineUi();
    return state.transferPackages;
  }

  function recycleShip() {
    const emptied = state.unloaderPackages;
    state.unloaderPackages = 0;
    state.recycledCount += 1;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') {
      showNotification(`♻️【灵舟回收站】已回收第 ${state.recycledCount} 艘灵舟并清空卸载站 ${emptied} 个包裹回传产线！`);
    }
    refreshMachineUi();
    return true;
  }

  function renderMachineBannerHtml(machineId) {
    if (!SKY_KEYS.includes(machineId)) return '';
    const matched = matchFilter(state.shipTag, state.shipColor);
    return `
      <div class="p-2.5 rounded-lg bg-[#081526] border-2 border-cyan-400/75 shadow-[0_0_16px_rgba(34,211,238,0.28)] space-y-2 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center space-x-2">
            <i class="fa-solid fa-paper-plane text-cyan-300"></i>
            <span class="font-black text-cyan-200">高空灵舟天轨调度 · 不占地面格 (1:1 矿车逻辑)</span>
            <span class="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 font-mono text-[10px] text-cyan-100">当前舟: [${state.shipColor}] ${state.shipTag}</span>
            <span class="px-1.5 py-0.5 rounded ${matched ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50' : 'bg-amber-500/25 text-amber-200 border border-amber-400/50'} font-mono text-[10px]">${state.filterOp}(${state.filterColor}, ${state.filterPrefix}) -> ${matched ? '命中主路/卸货' : '分流旁路'}</span>
          </div>
          <div class="flex items-center space-x-1 font-mono text-[10px] text-slate-300">
            <span>装载缓存: <b class="text-amber-300">${state.loaderPackages}/4</b></span>
            <span>·</span>
            <span>转运平台: <b class="text-cyan-300">${state.transferPackages}/8</b></span>
            <span>·</span>
            <span>待拆包: <b class="text-emerald-300">${state.unloaderPackages}/4</b></span>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-1.5 border-t border-white/10 pt-2">
          <div class="flex flex-wrap items-center gap-1">
            ${COLORS.map(c => `<button onclick="window.SpiritShipSystem.setShipConfig('${c}');" class="px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${state.shipColor === c ? 'bg-cyan-400 text-black' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">${c}旗</button>`).join('')}
            ${['DAN.01', 'ORE.FE', 'YAO.02'].map(t => `<button onclick="window.SpiritShipSystem.setShipConfig('${state.shipColor}','${t}');" class="px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${state.shipTag === t ? 'bg-amber-400 text-black font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">${t}</button>`).join('')}
            ${LOGIC_OPS.map(op => `<button onclick="window.SpiritShipSystem.setRuleConfig('${op}');" class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${state.filterOp === op ? 'bg-fuchsia-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">${op}</button>`).join('')}
            ${['DAN', 'ORE'].map(px => `<button onclick="window.SpiritShipSystem.setRuleConfig('${state.filterOp}','${state.filterColor}','${px}');" class="px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer ${state.filterPrefix === px ? 'bg-emerald-400 text-black font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">前缀:${px}</button>`).join('')}
          </div>
          <div class="flex flex-wrap items-center gap-1">
            <button onclick="window.SpiritShipSystem.packToLoader();" class="px-2 py-1 rounded bg-sky-600/80 hover:bg-sky-500 text-white text-[10px] font-bold cursor-pointer">+1 打包入匣</button>
            <button onclick="window.SpiritShipSystem.launchAndDispatch();" class="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-black cursor-pointer">🛸 放飞吊装</button>
            <button onclick="window.SpiritShipSystem.runTransferStep();" class="px-2 py-1 rounded bg-amber-500/80 hover:bg-amber-400 text-black text-[10px] font-bold cursor-pointer">🔁 转运(8槽)</button>
            <button onclick="window.SpiritShipSystem.recycleShip();" class="px-2 py-1 rounded bg-purple-600/80 hover:bg-purple-500 text-white text-[10px] font-bold cursor-pointer">♻️ 回收清包</button>
          </div>
        </div>
      </div>
    `;
  }

  window.SpiritShipSystem = {
    SKY_KEYS,
    COLORS,
    LOGIC_OPS,
    state,
    matchFilter,
    setShipConfig,
    setRuleConfig,
    packToLoader,
    launchAndDispatch,
    runTransferStep,
    recycleShip,
    renderMachineBannerHtml
  };
})();

// ==================== 实体增产喷涂 · 6阶道标推演 · 器灵灌注 · 天劫引雷终局系统 ====================
(function initProliferatorSystem() {
  const SPRAY_TIERS = {
    none: { id: 'none', name: '未喷涂', matId: null, extraOut: 0, speedUp: 0, powerAdd: 0, color: 'slate' },
    tier1: { id: 'tier1', name: '一阶凝灵散', matId: 'MAT_129', extraOut: 0.125, speedUp: 0.25, powerAdd: 0.30, color: 'emerald' },
    tier2: { id: 'tier2', name: '二阶真火剂', matId: 'MAT_130', extraOut: 0.20, speedUp: 0.50, powerAdd: 0.70, color: 'amber' },
    tier3: { id: 'tier3', name: '三阶造化丹', matId: 'MAT_131', extraOut: 0.25, speedUp: 1.00, powerAdd: 1.50, color: 'cyan' }
  };

  const SPIRIT_MODES = {
    none: { id: 'none', name: '未嵌器灵', desc: '常规工业运行，尚未嵌入器灵枢机核(MAT_145)', speedMult: 1, outMult: 1 },
    blood_purge: { id: 'blood_purge', name: '血炼吞煞', desc: '自动吞噬副产免堵线 · 额外产出 ×1.30', speedMult: 1, outMult: 1.30 },
    jindan_fire: { id: 'jindan_fire', name: '金丹自生火', desc: '免底层热源依赖 · 生产速度 ×2.00', speedMult: 2.00, outMult: 1 },
    nascent_warp: { id: 'nascent_warp', name: '元婴虚空抓料', desc: '15m 隔空无线取送物料 · 流水畅通 +15%', speedMult: 1.15, outMult: 1 },
    deity_save: { id: 'deity_save', name: '化神言出法随', desc: '50% 概率免耗材造物 · 净产出 ×1.25', speedMult: 1, outMult: 1.25 }
  };

  const BEACON_DEFS = {
    MAT_133: { id: 'MAT_133', stage: 1, stageName: '练气期', name: '凡阶玉简', yieldData: 5 },
    MAT_134: { id: 'MAT_134', stage: 2, stageName: '筑基期', name: '筑基灵简', yieldData: 15 },
    MAT_135: { id: 'MAT_135', stage: 3, stageName: '金丹期', name: '金丹道匣', yieldData: 45 },
    MAT_136: { id: 'MAT_136', stage: 4, stageName: '元婴期', name: '元婴法印', yieldData: 120 },
    MAT_137: { id: 'MAT_137', stage: 5, stageName: '化神期', name: '化神天机盘', yieldData: 300 },
    MAT_138: { id: 'MAT_138', stage: 6, stageName: '渡劫飞升', name: '大道玄黄珠', yieldData: 1000 }
  };

  const TIER_MACHINES = {
    heavy_miner: { mult: 3.0, label: '300% 大矿阵' },
    furnace_mk2: { mult: 2.0, label: '2.0x Mk.II 真火' },
    omni_assembler: { mult: 2.0, label: '2.0x 万象复合' },
    alchemy_furnace_mk2: { mult: 2.0, label: '2.0x 九转神炉' },
    recomposer_mk3: { mult: 3.0, label: '3.0x 仙造重组' },
    entropy_smelter: { mult: 4.0, label: '4.0x 天魔负熵' },
    immortal_herb_garden: { mult: 2.5, label: '2.5x 洞天灵药圃' },
    beast_immortal_pool: { mult: 3.0, label: '3.0x 万兽仙池' }
  };

  const state = {
    sprayTier: 'none',
    sprayMode: 'extra_output', // 'extra_output' | 'speedup'
    sprayCharges: 0,
    stackHeight: 1, // 1..4 for BD_181 乾坤叠物机
    extractorFloorZ: 1, // 1..13 for BD_184 九霄采气塔
    spiritMode: 'none',
    thermalTowerLayers: 1, // 1..4 for 宝塔式垂直导热叠炉
    splitterRatio: '1:1',  // '1:1' | '1:2' | '1:3' | '1:4'
    danxiaCritCount: 0,
    deducedCounts: { MAT_133: 0, MAT_134: 0, MAT_135: 0, MAT_136: 0, MAT_137: 0, MAT_138: 0 },
    starBannersLaunched: 0,
    ascensionRocketsLaunched: 0,
    ascensionGateProgress: 0,
    lightningBoltsAbsorbed: 0,
    lightningPeakMW: 0,
    craneAirdropsCount: 0,
    catapultLaunchesCount: 0,
    batteriesCharged: 0,
    batteriesDischarged: 0
  };

  function findItemKey(matId) {
    if (typeof XIUXIAN_ITEMS === 'undefined') return null;
    for (const [k, v] of Object.entries(XIUXIAN_ITEMS)) {
      if (v.matId === matId) return k;
    }
    return null;
  }

  function refreshMachineUi() {
    if (typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && currentOpenedMachine) {
      renderMachineProdView();
    }
  }

  function activateSpray(tier, mode) {
    const tDef = SPRAY_TIERS[tier] || SPRAY_TIERS.none;
    const nextMode = (mode === 'speedup' || mode === 'extra_output') ? mode : state.sprayMode;
    if (tDef.id === 'none') {
      state.sprayTier = 'none';
      state.sprayMode = nextMode;
      state.sprayCharges = 0;
      refreshMachineUi();
      return true;
    }
    if (tDef.matId && typeof playerInventory !== 'undefined' && !window.isCreativeMode && state.sprayTier !== tDef.id) {
      const k = findItemKey(tDef.matId);
      if (!k || (playerInventory[k] || 0) < 1) {
        if (typeof playUiSound === 'function') playUiSound('error');
        if (typeof showNotification === 'function') showNotification(`【增产剂不足】启用 ${tDef.name} 需要 ${tDef.matId}×1`);
        return false;
      }
      playerInventory[k] -= 1;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      state.sprayCharges += 20;
    }
    state.sprayTier = tDef.id;
    state.sprayMode = nextMode;
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      const eff = nextMode === 'extra_output'
        ? `造化额外产出 +${(tDef.extraOut * 100).toFixed(1).replace(/\.0$/, '')}%`
        : `燃魂加速 +${Math.round(tDef.speedUp * 100)}%`;
      showNotification(`🌫️【丹雾喷涂器(BD_177)】已切换 ${tDef.name} · ${eff}（耗电 +${Math.round(tDef.powerAdd * 100)}%）`);
    }
    refreshMachineUi();
    return true;
  }

  function setStackHeight(h) {
    const clamped = Math.max(1, Math.min(4, parseInt(h, 10) || 1));
    state.stackHeight = clamped;
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') {
      showNotification(`📦【乾坤叠物机(BD_181)】传送带物理集装设为 ${clamped} 层（基础带通量 ×${clamped}，缩地带可达 ${clamped * 5}×）`);
    }
    refreshMachineUi();
    return clamped;
  }

  function setExtractorAltitude(floors) {
    const clamped = Math.max(1, Math.min(13, parseInt(floors, 10) || 1));
    state.extractorFloorZ = clamped;
    const mult = getExtractorAltitudeMultiplier();
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') {
      showNotification(`☁️【九霄采气塔(BD_184)】海拔设为 ${clamped} 层高度，罡风凝液产量 ×${mult.toFixed(2)}`);
    }
    refreshMachineUi();
    return mult;
  }

  function getExtractorAltitudeMultiplier() {
    return Number((1 + Math.min(12, Math.max(0, state.extractorFloorZ - 1)) * 0.25).toFixed(2));
  }

  function infuseSpiritCore(mode) {
    const mDef = SPIRIT_MODES[mode] || SPIRIT_MODES.none;
    if (mDef.id === 'none') {
      state.spiritMode = 'none';
      refreshMachineUi();
      return true;
    }
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode && state.spiritMode === 'none') {
      const k = findItemKey('MAT_145');
      if (!k || (playerInventory[k] || 0) < 1) {
        if (typeof playUiSound === 'function') playUiSound('error');
        if (typeof showNotification === 'function') showNotification('【器灵灌注失败】背包需要 器灵枢机核(MAT_145)×1');
        return false;
      }
      playerInventory[k] -= 1;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    state.spiritMode = mDef.id;
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`✨【器灵枢机核灌注】已觉醒「${mDef.name}」：${mDef.desc}`);
    }
    refreshMachineUi();
    return true;
  }

  function deduceResearchBeacon(matId) {
    const bDef = BEACON_DEFS[matId];
    if (!bDef) return { ok: false, gained: 0 };
    const kBeacon = findItemKey(matId);
    const kData = findItemKey('MAT_020');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kBeacon || (playerInventory[kBeacon] || 0) < 1) {
        if (typeof playUiSound === 'function') playUiSound('error');
        if (typeof showNotification === 'function') showNotification(`【天机推演缺料】请先在产线合成实体 ${bDef.name}(${matId})×1`);
        return { ok: false, gained: 0 };
      }
      playerInventory[kBeacon] -= 1;
    }
    const sprayExtra = (SPRAY_TIERS[state.sprayTier] && state.sprayMode === 'extra_output') ? SPRAY_TIERS[state.sprayTier].extraOut : 0;
    const spiritOut = (SPIRIT_MODES[state.spiritMode] || SPIRIT_MODES.none).outMult;
    const gained = Math.round(bDef.yieldData * (1 + sprayExtra) * spiritOut);
    if (typeof playerInventory !== 'undefined' && kData) {
      playerInventory[kData] = (playerInventory[kData] || 0) + gained;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    state.deducedCounts[matId] = (state.deducedCounts[matId] || 0) + 1;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') {
      showNotification(`🔮【天机推演台(BD_179)】消耗 ${bDef.name}×1 → 推演出 解析数据×${gained}`);
    }
    refreshMachineUi();
    return { ok: true, gained, matId };
  }

  function launchStarBanner() {
    const kBanner = findItemKey('MAT_142');
    const kPhoton = findItemKey('MAT_144');
    const kData = findItemKey('MAT_020');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kBanner || (playerInventory[kBanner] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【弹射缺料】阵旗弹射器(BD_195)需要 周天星辰幡(MAT_142)×1');
        return false;
      }
      playerInventory[kBanner] -= 1;
    }
    state.starBannersLaunched += 1;
    if (typeof playerInventory !== 'undefined') {
      if (kPhoton) playerInventory[kPhoton] = (playerInventory[kPhoton] || 0) + 1;
      if (kData) playerInventory[kData] = (playerInventory[kData] || 0) + 30;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`🌠【阵旗弹射器(BD_195)】第 ${state.starBannersLaunched} 面周天星辰幡升空入阵，凝结 仙界道光×1 + 解析数据×30！`);
    }
    refreshMachineUi();
    return true;
  }

  function launchAscensionShip() {
    const kShip = findItemKey('MAT_143');
    const kPearl = findItemKey('MAT_138');
    const kPhoton = findItemKey('MAT_144');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kShip || (playerInventory[kShip] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【破界发射缺料】破界发射井(BD_196)需要 破界穿云舰(MAT_143)×1');
        return false;
      }
      playerInventory[kShip] -= 1;
    }
    state.ascensionRocketsLaunched += 1;
    state.ascensionGateProgress = Math.min(100, state.ascensionGateProgress + 20);
    if (typeof playerInventory !== 'undefined') {
      if (kPearl) playerInventory[kPearl] = (playerInventory[kPearl] || 0) + 1;
      if (kPhoton) playerInventory[kPhoton] = (playerInventory[kPhoton] || 0) + 2;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`🚀【破界发射井(BD_196)】第 ${state.ascensionRocketsLaunched} 艘穿云舰点火升空！【接引仙门】构筑度 ${state.ascensionGateProgress}%`);
    }
    refreshMachineUi();
    return true;
  }

  function absorbTribulationLightning() {
    const kBolt = findItemKey('MAT_139');
    const kPhoton = findItemKey('MAT_144');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kBolt || (playerInventory[kBolt] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【天劫引雷缺料】仙光接引台(BD_197)引雷需要 诛仙雷丸(MAT_139)×1');
        return false;
      }
      playerInventory[kBolt] -= 1;
    }
    state.lightningBoltsAbsorbed += 1;
    state.lightningPeakMW = 5000 + state.lightningBoltsAbsorbed * 1500;
    if (typeof playerInventory !== 'undefined' && kPhoton) {
      playerInventory[kPhoton] = (playerInventory[kPhoton] || 0) + 2;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') {
      showNotification(`⚡【天劫引雷枢机(BD_197)】成功捕获九霄天劫，电网注入 +${state.lightningPeakMW}MW 狂暴电力，凝结 仙界道光×2！`);
    }
    refreshMachineUi();
    return true;
  }

  function craneAirdropStep() {
    const kCrane = findItemKey('MAT_146');
    const kT1 = findItemKey('MAT_129');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kCrane || (playerInventory[kCrane] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【纸鹤空投缺料】千机纸鹤枢(BD_198)需要 灵木纸鹤(MAT_146)×1');
        return false;
      }
      playerInventory[kCrane] -= 1;
    }
    state.craneAirdropsCount += 1;
    state.sprayCharges += 10;
    if (typeof playerInventory !== 'undefined' && kT1) {
      playerInventory[kT1] = (playerInventory[kT1] || 0) + 1;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`🕊️【纸鹤赋能台·喂丹贴符】第 ${state.craneAirdropsCount} 架千纸鹤升空！向半径 35m 机器投喂丹药并贴聚灵符（+10 增产充能）`);
    }
    refreshMachineUi();
    return true;
  }

  function craneHarvestAndRepair() {
    const kCrane = findItemKey('MAT_146');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kCrane || (playerInventory[kCrane] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【纸鹤收尸修塔缺料】需要 千纸鹤(MAT_146)×1');
        return false;
      }
      playerInventory[kCrane] -= 1;
    }
    state.craneAirdropsCount += 1;
    if (typeof playerInventory !== 'undefined') {
      const kCorpse1 = findItemKey('MAT_020');
      const kCorpse2 = findItemKey('MAT_055');
      const kShard = findItemKey('mat_077');
      if (kCorpse1) playerInventory[kCorpse1] = (playerInventory[kCorpse1] || 0) + 3;
      if (kCorpse2) playerInventory[kCorpse2] = (playerInventory[kCorpse2] || 0) + 2;
      if (kShard) playerInventory[kShard] = (playerInventory[kShard] || 0) + 1;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      if (typeof syncBackpackFromPlayerInventory === 'function') syncBackpackFromPlayerInventory();
    }
    if (typeof playUiSound === 'function') playUiSound('craft_success');
    if (typeof showNotification === 'function') {
      showNotification('🕊️【千纸鹤·防线收尸+贴符修塔】已替代傀儡自动叼回 练气残躯×3 + 筑基残躯×2 + 金丹碎片×1，并修复受损剑塔/雷塔！');
    }
    refreshMachineUi();
    return true;
  }

  function craneResupplyPlayer() {
    const kCrane = findItemKey('MAT_146');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kCrane || (playerInventory[kCrane] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【纸鹤随身补给缺料】需要 千纸鹤(MAT_146)×1');
        return false;
      }
      playerInventory[kCrane] -= 1;
    }
    state.craneAirdropsCount += 1;
    if (typeof playerInventory !== 'undefined') {
      const kPill = findItemKey('mat_080');
      const kBolt1 = findItemKey('mat_074');
      const kBolt2 = findItemKey('mat_139');
      if (kPill) playerInventory[kPill] = (playerInventory[kPill] || 0) + 5;
      if (kBolt1) playerInventory[kBolt1] = (playerInventory[kBolt1] || 0) + 20;
      if (kBolt2) playerInventory[kBolt2] = (playerInventory[kBolt2] || 0) + 10;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      if (typeof syncBackpackFromPlayerInventory === 'function') syncBackpackFromPlayerInventory();
    }
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') {
      showNotification('🎒【千纸鹤·随身补给】已向主角背包空投 气血丹×5 + 铁剑丸×20 + 天雷剑丸×10！');
    }
    refreshMachineUi();
    return true;
  }

  function catapultLaunch() {
    const kCrane = findItemKey('MAT_146');
    const kData = findItemKey('MAT_020');
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kCrane || (playerInventory[kCrane] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【御剑抛射缺料】需要 灵木纸鹤(MAT_146)×1 作为剑气引信');
        return false;
      }
      playerInventory[kCrane] -= 1;
    }
    state.catapultLaunchesCount += 1;
    if (typeof playerInventory !== 'undefined' && kData) {
      playerInventory[kData] = (playerInventory[kData] || 0) + 8;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') {
      showNotification(`🗡️【御剑抛射台 → 接引莲台】第 ${state.catapultLaunchesCount} 道金色剑气抛物线精准落台，跨障投送成功 (+8 解析数据)！`);
    }
    refreshMachineUi();
    return true;
  }

  function batteryCycle(mode) {
    const kEmpty = findItemKey('MAT_147');
    const kFull = findItemKey('MAT_148');
    const kData = findItemKey('MAT_020');
    if (mode === 'charge') {
      if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
        if (!kEmpty || (playerInventory[kEmpty] || 0) < 1) {
          if (typeof showNotification === 'function') showNotification('【蓄灵充电缺料】需要 空置蓄灵匣(MAT_147)×1');
          return false;
        }
        playerInventory[kEmpty] -= 1;
      }
      state.batteriesCharged += 1;
      if (typeof playerInventory !== 'undefined' && kFull) {
        playerInventory[kFull] = (playerInventory[kFull] || 0) + 1;
        if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      }
      if (typeof playUiSound === 'function') playUiSound('build_place');
      if (typeof showNotification === 'function') showNotification('🔋【雷池蓄电枢(BD_204)】已将 空置蓄灵匣 快充为 满载蓄灵匣×1，可装灵舟跨区运电！');
      refreshMachineUi();
      return true;
    }
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      if (!kFull || (playerInventory[kFull] || 0) < 1) {
        if (typeof showNotification === 'function') showNotification('【蓄灵放电缺料】需要 满载蓄灵匣(MAT_148)×1');
        return false;
      }
      playerInventory[kFull] -= 1;
    }
    state.batteriesDischarged += 1;
    if (typeof playerInventory !== 'undefined') {
      if (kEmpty) playerInventory[kEmpty] = (playerInventory[kEmpty] || 0) + 1;
      if (kData) playerInventory[kData] = (playerInventory[kData] || 0) + 12;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') showNotification('⚡【雷池蓄电枢(BD_204)】吞噬满载蓄灵匣并网供电 +1200W，已 100% 无损退回空置蓄灵匣×1 (+12 解析数据)！');
    refreshMachineUi();
    return true;
  }

  function getSpeedMultiplier(machineId) {
    let m = 1;
    const tDef = SPRAY_TIERS[state.sprayTier] || SPRAY_TIERS.none;
    if (state.sprayMode === 'speedup' && tDef.speedUp > 0) {
      m *= (1 + tDef.speedUp);
    }
    const sp = SPIRIT_MODES[state.spiritMode] || SPIRIT_MODES.none;
    if (sp.speedMult > 1) m *= sp.speedMult;
    return Number(m.toFixed(3));
  }

  function getOutputMultiplier(machineId) {
    let m = 1;
    const tDef = SPRAY_TIERS[state.sprayTier] || SPRAY_TIERS.none;
    if (state.sprayMode === 'extra_output' && tDef.extraOut > 0) {
      m *= (1 + tDef.extraOut);
    }
    const sp = SPIRIT_MODES[state.spiritMode] || SPIRIT_MODES.none;
    if (sp.outMult > 1) m *= sp.outMult;
    if (machineId === 'sky_extractor') {
      m *= getExtractorAltitudeMultiplier();
    }
    return Number(m.toFixed(3));
  }

  function getPowerMultiplier(machineId) {
    const tDef = SPRAY_TIERS[state.sprayTier] || SPRAY_TIERS.none;
    return Number((1 + (tDef.powerAdd || 0)).toFixed(2));
  }

  const TOWER_MACHINES = new Set(['smelt_chamber', 'bd_163', 'furnace_mk2', 'alchemy_furnace_mk2']);
  const DANXIA_MACHINES = new Set(['bd_163', 'alchemy_furnace_mk2', 'alchemy_table', 'tribulation_table']);

  function setThermalTowerLayers(n) {
    const clamped = Math.max(1, Math.min(4, parseInt(n, 10) || 1));
    state.thermalTowerLayers = clamped;
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') {
      showNotification(`🏯【宝塔垂直导热叠炉】已堆叠 ${clamped} 层热能炉体，单底座导热吞吐 ×${clamped}.0`);
    }
    refreshMachineUi();
    return clamped;
  }

  function getThermalTowerMultiplier(machineId) {
    return TOWER_MACHINES.has(machineId) ? state.thermalTowerLayers : 1;
  }

  function setSplitterRatio(ratio) {
    const allowed = ['1:1', '1:2', '1:3', '1:4'];
    state.splitterRatio = allowed.includes(ratio) ? ratio : '1:1';
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') {
      showNotification(`⚖️【周天定量配比拨盘】分流输出比例已锁为 ${state.splitterRatio}（告别均分回流阵列）`);
    }
    refreshMachineUi();
    return state.splitterRatio;
  }

  function getDanxiaCritChance(machineId) {
    if (!DANXIA_MACHINES.has(machineId)) return 0;
    if (state.sprayTier !== 'none' || state.spiritMode !== 'none') {
      return 1.0;
    }
    return 0.15;
  }

  function triggerDanxiaCritCraft(machineId) {
    const chance = getDanxiaCritChance(machineId || 'alchemy_furnace_mk2') || 0.15;
    state.danxiaCritCount += 1;
    const isGuarantee = chance >= 1.0;
    if (typeof playerInventory !== 'undefined') {
      const kData = findItemKey('MAT_020');
      const kPill = findItemKey('MAT_080');
      if (kPill) playerInventory[kPill] = (playerInventory[kPill] || 0) + (isGuarantee ? 2 : 1);
      if (kData) playerInventory[kData] = (playerInventory[kData] || 0) + (isGuarantee ? 15 : 6);
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`🔥【丹霞成丹暴击】暴击率 ${Math.round(chance * 100)}%！炉顶紫气冲天，额外凝出双丹与悟道解析数据！`);
    }
    refreshMachineUi();
    return { crit: true, chance, danxiaCritCount: state.danxiaCritCount };
  }

  function renderMachineBannerHtml(machineId) {
    const blocks = [];
    const tierInfo = TIER_MACHINES[machineId];
    if (tierInfo) {
      const bObj = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[machineId] : null;
      const inhCnt = (bObj && Array.isArray(bObj.inheritedRecipes)) ? bObj.inheritedRecipes.length : 0;
      const totCnt = (bObj && Array.isArray(bObj.recipes)) ? bObj.recipes.length : 0;
      blocks.push(`
        <div class="p-2 rounded-lg bg-[#111927] border border-amber-400/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-amber-200">⚙️ 高阶世代设备：<b>${tierInfo.label}</b> · 已激活硬件吞吐倍率 (配方池 ${totCnt}方 / 向下继承 ${inhCnt}方)</span>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-cyan-200">支持原地覆盖低阶设备升级，免拆传送带</span>
            <button onclick="if(window.World3D && window.World3D.upgradeBuildingInPlace) window.World3D.upgradeBuildingInPlace(null, '${machineId}');" class="px-2 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/45 border border-amber-400/60 text-amber-100 text-[10px] font-bold cursor-pointer">✨ 原地秒升场上旧机</button>
          </div>
        </div>
      `);
    }

    if (TOWER_MACHINES.has(machineId)) {
      blocks.push(`
        <div class="p-2 rounded-lg bg-[#1c120d] border border-orange-400/65 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-orange-200">🏯 宝塔式垂直导热叠炉：当前垂直叠放 <b>${state.thermalTowerLayers} 层</b> · 单底座热能吞吐 <b class="text-amber-300">×${state.thermalTowerLayers}.0</b></span>
          <div class="flex items-center gap-1">
            ${[1, 2, 3, 4].map(lv => `<button onclick="window.ProliferatorSystem.setThermalTowerLayers(${lv});" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${state.thermalTowerLayers === lv ? 'bg-orange-400 text-black' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">${lv}层叠炉</button>`).join('')}
          </div>
        </div>
      `);
    }

    if (DANXIA_MACHINES.has(machineId)) {
      const chance = getDanxiaCritChance(machineId);
      blocks.push(`
        <div class="p-2 rounded-lg bg-[#1d0f24] border border-fuchsia-400/65 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-fuchsia-200">🔥 丹霞暴击与满丹法则：当前暴击率 <b class="${chance >= 1 ? 'text-emerald-300' : 'text-amber-300'}">${Math.round(chance * 100)}%</b>（激活喷涂或器灵即锁死 100% 必爆双丹）</span>
          <button onclick="window.ProliferatorSystem.triggerDanxiaCritCraft('${machineId}');" class="px-2.5 py-1 rounded bg-fuchsia-500/35 hover:bg-fuchsia-500/55 border border-fuchsia-300/60 text-fuchsia-100 text-[10px] font-bold cursor-pointer">✨ 凝丹触发紫气暴击 (累计:${state.danxiaCritCount})</button>
        </div>
      `);
    }

    if (['splitter', 'conveyor_limiter'].includes(machineId)) {
      blocks.push(`
        <div class="p-2 rounded-lg bg-[#0d1924] border border-cyan-400/65 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-cyan-200">⚖️ 周天定量配比拨盘：当前精准分流比 <b class="text-amber-300">${state.splitterRatio}</b></span>
          <div class="flex items-center gap-1">
            ${['1:1', '1:2', '1:3', '1:4'].map(rt => `<button onclick="window.ProliferatorSystem.setSplitterRatio('${rt}');" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${state.splitterRatio === rt ? 'bg-cyan-400 text-black' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">${rt}</button>`).join('')}
          </div>
        </div>
      `);
    }

    if (['crane_distributor', 'sword_catapult', 'lotus_catcher', 'thunder_accumulator'].includes(machineId)) {
      blocks.push(`
        <div class="p-2.5 rounded-lg bg-[#0d1a28] border-2 border-amber-400/75 space-y-2 text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-black text-amber-200">🕊️ 千纸鹤智能配送 · 飞剑火车站 · 雷池蓄电闭环</span>
            <span class="font-mono text-[10px] text-cyan-200">纸鹤:${state.craneAirdropsCount} | 剑列发车:${state.catapultLaunchesCount} | 蓄电充放:${state.batteriesCharged}/${state.batteriesDischarged}</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button onclick="window.ProliferatorSystem.craneAirdropStep();" class="px-2 py-1 rounded bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/60 text-amber-100 text-[10px] font-bold cursor-pointer">💊 喂丹贴符增产(35m)</button>
            <button onclick="window.ProliferatorSystem.craneHarvestAndRepair();" class="px-2 py-1 rounded bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-400/60 text-emerald-100 text-[10px] font-bold cursor-pointer">⚔️ 战场收尸+贴符修塔</button>
            <button onclick="window.ProliferatorSystem.craneResupplyPlayer();" class="px-2 py-1 rounded bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/60 text-cyan-100 text-[10px] font-bold cursor-pointer">🎒 玩家补给(丹药/剑丸)</button>
            <button onclick="window.ProliferatorSystem.catapultLaunch();" class="px-2 py-1 rounded bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/60 text-indigo-100 text-[10px] font-bold cursor-pointer">🚄 飞剑重载发车</button>
            <button onclick="window.ProliferatorSystem.batteryCycle('charge');" class="px-2 py-1 rounded bg-sky-500/30 hover:bg-sky-500/50 border border-sky-400/60 text-sky-100 text-[10px] font-bold cursor-pointer">🔋 蓄电池快充</button>
            <button onclick="window.ProliferatorSystem.batteryCycle('discharge');" class="px-2 py-1 rounded bg-fuchsia-500/30 hover:bg-fuchsia-500/50 border border-fuchsia-400/60 text-fuchsia-100 text-[10px] font-bold cursor-pointer">⚡ 并网放电1200W</button>
          </div>
        </div>
      `);
    }

    if (machineId === 'belt_sprayer' || machineId === 'belt_stacker' || machineId === 'void_crucible') {
      const activeTier = SPRAY_TIERS[state.sprayTier] || SPRAY_TIERS.none;
      blocks.push(`
        <div class="p-2.5 rounded-lg bg-[#091824] border-2 border-emerald-400/75 space-y-2 text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-black text-emerald-200">🌫️ 丹雾喷涂 & 乾坤集装 & 归墟化煞物理流转</span>
            <span class="font-mono text-[10px] text-cyan-200">喷涂: <b>${activeTier.name}</b>(${state.sprayMode === 'extra_output' ? '造化增产' : '燃魂加速'}) · 带叠层: <b class="text-amber-300">${state.stackHeight}层</b></span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">
            ${Object.values(SPRAY_TIERS).map(t => `<button onclick="window.ProliferatorSystem.activateSpray('${t.id}');" class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${state.sprayTier === t.id ? 'bg-emerald-400 text-black' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">${t.name}</button>`).join('')}
            <button onclick="window.ProliferatorSystem.activateSpray('${state.sprayTier}','extra_output');" class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${state.sprayMode === 'extra_output' ? 'bg-cyan-400 text-black' : 'bg-white/10 text-slate-300'}">造化增产</button>
            <button onclick="window.ProliferatorSystem.activateSpray('${state.sprayTier}','speedup');" class="px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${state.sprayMode === 'speedup' ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-300'}">燃魂加速</button>
            ${[1, 2, 3, 4].map(h => `<button onclick="window.ProliferatorSystem.setStackHeight(${h});" class="px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${state.stackHeight === h ? 'bg-fuchsia-400 text-black' : 'bg-white/10 text-slate-300'}">${h}层集装</button>`).join('')}
          </div>
        </div>
      `);
    }

    if (machineId === 'research_altar') {
      blocks.push(`
        <div class="p-2.5 rounded-lg bg-[#121126] border-2 border-cyan-400/75 space-y-2 text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-black text-cyan-200">🔮 天机推演台 (BD_179) · 6大境界实体道标吞噬科研</span>
            <span class="text-[10px] font-mono text-amber-300">可垂直堆叠共鸣 · 告别单一虚拟挂载</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${Object.values(BEACON_DEFS).map(b => `<button onclick="window.ProliferatorSystem.deduceResearchBeacon('${b.id}');" class="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-100 text-[10px] font-bold cursor-pointer">${b.stageName}·${b.name} (+${b.yieldData})</button>`).join('')}
          </div>
        </div>
      `);
    }

    if (machineId === 'sky_extractor') {
      const mult = getExtractorAltitudeMultiplier();
      blocks.push(`
        <div class="p-2.5 rounded-lg bg-[#081c2b] border border-sky-400/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span class="font-bold text-sky-200">☁️ 九霄采气塔海拔机制：当前海拔 <b>${state.extractorFloorZ} 层</b> · 灵液/重水产量 <b class="text-emerald-300">×${mult.toFixed(2)}</b></span>
          <div class="flex items-center gap-1">
            ${[1, 3, 5, 9, 13].map(f => `<button onclick="window.ProliferatorSystem.setExtractorAltitude(${f});" class="px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer ${state.extractorFloorZ === f ? 'bg-sky-400 text-black font-bold' : 'bg-white/10 text-slate-200'}">${f}F</button>`).join('')}
          </div>
        </div>
      `);
    }

    if (['banner_ejector', 'ascension_silo', 'immortal_receiver', 'particle_collider', 'battle_base', 'thunder_turret'].includes(machineId)) {
      blocks.push(`
        <div class="p-2.5 rounded-lg bg-[#1d1128] border-2 border-fuchsia-400/75 space-y-2 text-xs">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="font-black text-fuchsia-200">🌌 化神弹射 · 破界仙门巨构 · 天劫引雷与天魔防线联动</span>
            <span class="font-mono text-[10px] text-amber-200">星辰幡:${state.starBannersLaunched} | 仙门进度:${state.ascensionGateProgress}% | 天劫发电:+${state.lightningPeakMW}MW</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button onclick="window.ProliferatorSystem.launchStarBanner();" class="px-2.5 py-1 rounded bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/60 text-cyan-100 text-[10px] font-bold cursor-pointer">🌠 弹射周天星辰幡</button>
            <button onclick="window.ProliferatorSystem.launchAscensionShip();" class="px-2.5 py-1 rounded bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400/60 text-amber-100 text-[10px] font-bold cursor-pointer">🚀 发射破界穿云舰(+20%)</button>
            <button onclick="window.ProliferatorSystem.absorbTribulationLightning();" class="px-2.5 py-1 rounded bg-fuchsia-500/30 hover:bg-fuchsia-500/50 border border-fuchsia-400/60 text-fuchsia-100 text-[10px] font-bold cursor-pointer">⚡ 天劫引雷蓄能</button>
            <button onclick="if(window.ShaqiSystem) window.ShaqiSystem.triggerDemonWaveAssault();" class="px-2.5 py-1 rounded bg-rose-500/35 hover:bg-rose-500/55 border border-rose-400/60 text-rose-100 text-[10px] font-bold cursor-pointer">🛡️ 天魔袭营防线齐射收尸</button>
          </div>
        </div>
      `);
    }

    // 独创器灵灌注条（全制造/冶炼/炼丹/生物仙池/高阶设备可嵌入）
    const isSpiritCapable = ['heavy_miner', 'furnace_mk2', 'omni_assembler', 'alchemy_furnace_mk2', 'entropy_smelter', 'recomposer_mk3', 'immortal_herb_garden', 'beast_immortal_pool', 'particle_collider', 'assembler_heavy', 'alchemy_table', 'tribulation_table', 'furnace', 'assembler'].includes(machineId);
    if (isSpiritCapable) {
      const sp = SPIRIT_MODES[state.spiritMode] || SPIRIT_MODES.none;
      blocks.push(`
        <div class="p-2 rounded-lg bg-[#0d1f18] border border-emerald-400/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center space-x-1.5">
            <span class="font-bold text-emerald-300">🏮 器灵枢机核 (MAT_145):</span>
            <span class="text-[10px] text-emerald-100">${sp.name} (${sp.desc})</span>
          </div>
          <div class="flex flex-wrap gap-1">
            ${Object.values(SPIRIT_MODES).map(m => `<button onclick="window.ProliferatorSystem.infuseSpiritCore('${m.id}');" class="px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${state.spiritMode === m.id ? 'bg-emerald-400 text-black' : 'bg-white/10 text-slate-200 hover:bg-white/20'}">${m.name}</button>`).join('')}
          </div>
        </div>
      `);
    }

    return blocks.join('');
  }

  window.ProliferatorSystem = {
    SPRAY_TIERS,
    SPIRIT_MODES,
    BEACON_DEFS,
    state,
    activateSpray,
    setStackHeight,
    setExtractorAltitude,
    getExtractorAltitudeMultiplier,
    setThermalTowerLayers,
    getThermalTowerMultiplier,
    setSplitterRatio,
    getDanxiaCritChance,
    triggerDanxiaCritCraft,
    infuseSpiritCore,
    deduceResearchBeacon,
    launchStarBanner,
    launchAscensionShip,
    absorbTribulationLightning,
    craneAirdropStep,
    craneHarvestAndRepair,
    craneResupplyPlayer,
    catapultLaunch,
    batteryCycle,
    getSpeedMultiplier,
    getOutputMultiplier,
    getPowerMultiplier,
    renderMachineBannerHtml
  };
})();
