// ====================================================================
// js/inventory.js - 玩家背包、装备、天雷淬体与天罡剑匣模块
// ====================================================================

// 官方 4 大装备槽位体系 (严格对齐策划案: 剑匣、法宝、护甲、飞行载具)
const playerEquipmentSlots = {
  artifact: {
    slotKey: 'artifact',
    category: '法宝',
    id: 'fabao_array_embryo',
    matId: 'MAT_072',
    name: '法宝阵图胚',
    icon: 'fa-solid fa-scroll text-yellow-400',
    quality: '法宝中间态',
    desc: '绑定前可运输的法宝中间态结构图谱。按 [N] 键呼出法宝界面进行本命神识绑定、导脉注入与煞气淬炼。'
  },
  casket: {
    slotKey: 'casket',
    category: '剑匣',
    id: 'casket_tiangang',
    name: '天罡剑匣',
    icon: 'fa-solid fa-box-archive text-amber-300',
    quality: '玄品',
    desc: '天罡四象本命剑匣，内纳4柄飞剑。点击可直接展开二级飞剑插槽，支持从背包拖入武器。'
  },
  armor: {
    slotKey: 'armor',
    category: '护甲',
    id: 'armor_xuantie',
    name: '玄铁护体罡甲',
    icon: 'fa-solid fa-shield-halved text-emerald-400',
    quality: '真品',
    desc: '玄铁百炼护体宝甲，护体罡气+500，抵御物理冲击与基础环境浊气。'
  },
  vehicle: {
    slotKey: 'vehicle',
    category: '飞行载具',
    id: 'vehicle_feizhou',
    name: '御风飞舟',
    icon: 'fa-solid fa-plane-up text-sky-400',
    quality: '玄品',
    desc: '流线御风浮空载具，提供超高速巡航飞行与深渊跨越能力，双击空格可御空升空。'
  }
};

// 点击装备槽检查/交互
function inspectEquipmentSlot(slotKey) {
  const equip = playerEquipmentSlots[slotKey];
  if (!equip) return;
  if (slotKey === 'casket') {
    openCasketSecondaryMenu();
    return;
  }
  if (slotKey === 'artifact') {
    if (typeof toggleFabaoModal === 'function') {
      toggleFabaoModal();
      return;
    }
  }
  playUiSound('click');
  showNotification(`【装备槽·${equip.category}】当前装备: 【${equip.name}】(${equip.quality}) - ${equip.desc}`);
  const tip = document.getElementById('bagSlotHoverTip');
  if (tip) {
    tip.innerHTML = `<span class="text-amber-300 font-bold">[${equip.category}] ${equip.name}</span> <span class="text-cyan-300">(${equip.quality})</span> - ${equip.desc}`;
  }
}

// 关闭除指定窗口外的其他模态弹窗
function closeOtherModals(keepId) {
  const modals = ['buildModal', 'craftModal', 'invModal', 'searchModal', 'machineModal', 'hubMilestoneModal', 'storageBoxModal', 'cpuProcessorModal', 'codexModal'];
  modals.forEach(id => {
    if (id !== keepId) {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    }
  });
}

// =========================================================================
// 储物盒 (箱子 BD_115) 存储系统 (1:1 还原用户上传 Image 1: media_1790463961108.png)
// =========================================================================
let storageBoxSlots = [
  { id: 'iron_plate', name: '工业玄铁板', count: 94, icon: 'fa-solid fa-sheet-plastic text-stone-200', desc: '大面积结构用板材，用于设备外壳与传送带', matId: 'MAT_008' },
  null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null
];

function openStorageBoxModal() {
  playUiSound('click');
  closeOtherModals('storageBoxModal');
  const modal = document.getElementById('storageBoxModal');
  if (modal) {
    modal.classList.remove('hidden');
    renderStorageBoxUI();
    showNotification('已打开【存储】(箱子 BD_115) - 可双向存取、一键拿走全部或储存全部');
  }
}

function closeStorageBoxModal() {
  playUiSound('click');
  const modal = document.getElementById('storageBoxModal');
  if (modal) modal.classList.add('hidden');
}

function renderStorageBoxUI() {
  // 1. 左栏 24 格储物箱 (8列x3行)
  const boxGrid = document.getElementById('storageBoxSlotsGrid');
  if (boxGrid) {
    boxGrid.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const item = storageBoxSlots[i];
      const slot = document.createElement('div');
      slot.className = 'w-11 h-11 bg-[#1a1d26] hover:bg-[#2b3140] border border-white/10 hover:border-[#f5921e] rounded flex items-center justify-center relative cursor-pointer group transition';
      if (item) {
        slot.title = `[储物箱格位 #${i + 1}] ${item.name} (${item.matId || ''}) x${item.count}\n• 点击转移至随身背包`;
        slot.onclick = () => transferStorageItem(i, true);
        slot.innerHTML = `
          <i class="${item.icon} text-base group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-amber-300 bg-black/70 px-1 rounded">${item.count}</span>
        `;
      } else {
        slot.title = `[空储物格 #${i + 1}]`;
        slot.innerHTML = `<span class="text-[7px] font-mono text-white/15">${i + 1}</span>`;
      }
      boxGrid.appendChild(slot);
    }
  }

  // 2. 右栏 24 格随身背包 (8列x3行)
  const bagGrid = document.getElementById('storagePlayerBagSlotsGrid');
  if (bagGrid) {
    bagGrid.innerHTML = '';
    for (let j = 0; j < 24; j++) {
      const item = activePlayerBagItems[j];
      const slot = document.createElement('div');
      slot.className = 'w-11 h-11 bg-[#161922] hover:bg-[#252a38] border border-white/10 hover:border-[#00f0ff] rounded flex items-center justify-center relative cursor-pointer group transition';
      if (item) {
        slot.title = `[背包格位 #${j + 1}] ${item.name} (${item.matId || ''}) x${item.count}\n• 点击存入储物箱`;
        slot.onclick = () => transferStorageItem(j, false);
        slot.innerHTML = `
          <i class="${item.icon} text-base group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-cyan-200 bg-black/70 px-1 rounded">${item.count}</span>
        `;
      } else {
        slot.title = `[空背包格 #${j + 1}]`;
        slot.innerHTML = `<span class="text-[7px] font-mono text-white/15">${j + 1}</span>`;
      }
      bagGrid.appendChild(slot);
    }
  }
}

function transferStorageItem(idx, isFromBox) {
  playUiSound('click');
  if (isFromBox) {
    const item = storageBoxSlots[idx];
    if (!item) return;
    let targetIdx = activePlayerBagItems.findIndex(x => x === null);
    if (targetIdx !== -1) {
      activePlayerBagItems[targetIdx] = item;
      storageBoxSlots[idx] = null;
      showNotification(`【取出物料】已将【${item.name}】x${item.count} 转移至随身背包`);
    } else {
      showNotification('背包已满，无法容纳更多物料！');
    }
  } else {
    const item = activePlayerBagItems[idx];
    if (!item) return;
    let targetIdx = storageBoxSlots.findIndex(x => x === null);
    if (targetIdx !== -1) {
      storageBoxSlots[targetIdx] = item;
      activePlayerBagItems[idx] = null;
      showNotification(`【存入物料】已将【${item.name}】x${item.count} 存入储物箱`);
    } else {
      showNotification('储物箱已满，无法存放更多物料！');
    }
  }
  renderStorageBoxUI();
  renderPlayerEquipmentModal();
}

function takeAllFromStorage() {
  playUiSound('toggle');
  let movedCount = 0;
  for (let i = 0; i < storageBoxSlots.length; i++) {
    if (storageBoxSlots[i]) {
      let targetIdx = activePlayerBagItems.findIndex(x => x === null);
      if (targetIdx !== -1) {
        activePlayerBagItems[targetIdx] = storageBoxSlots[i];
        storageBoxSlots[i] = null;
        movedCount++;
      }
    }
  }
  renderStorageBoxUI();
  renderPlayerEquipmentModal();
  showNotification(`【拿走全部】已将储物箱内 ${movedCount} 组物品全部转移至背包！`);
}

function storeAllToStorage() {
  playUiSound('toggle');
  let movedCount = 0;
  for (let j = 0; j < activePlayerBagItems.length; j++) {
    if (activePlayerBagItems[j]) {
      let targetIdx = storageBoxSlots.findIndex(x => x === null);
      if (targetIdx !== -1) {
        storageBoxSlots[targetIdx] = activePlayerBagItems[j];
        activePlayerBagItems[j] = null;
        movedCount++;
      }
    }
  }
  renderStorageBoxUI();
  renderPlayerEquipmentModal();
  showNotification(`【储存全部】已将随身背包内 ${movedCount} 组物品全部存入储物箱！`);
}

function sortStorageBox() {
  playUiSound('toggle');
  const items = storageBoxSlots.filter(x => x !== null);
  items.sort((a, b) => b.count - a.count);
  for (let i = 0; i < storageBoxSlots.length; i++) {
    storageBoxSlots[i] = items[i] || null;
  }
  renderStorageBoxUI();
  showNotification('储物箱内物品已自动规整排序');
}

function sortStoragePlayerBag() {
  sortPlayerBackpack();
  renderStorageBoxUI();
}

// 全局随身背包库存系统 (用于工作台、建造器物料消耗与同步)
const playerInventory = {
  iron_ore: 100,       // 玄铁原矿 (MAT_001)
  iron_ingot: 58,      // 玄铁金属锭 (MAT_005)
  iron_plate: 120,     // 工业玄铁板 (MAT_008)
  iron_rod: 64,        // 标准玄铁棒 (MAT_007)
  screw: 96,           // 超细螺丝 (MAT_009)
  copper_ore: 80,      // 赤铜原矿 (MAT_002)
  copper_ingot: 45,    // 导电赤铜锭 (MAT_006)
  wire: 200,           // 铜线 (MAT_016)
  cable: 50,           // 导电线圈 (MAT_013)
  reinforced_plate: 12,// 建筑基础模块 (MAT_011)
  iron_powder: 78      // 铁粉 (MAT_022)
};

// 运行期玩家背包物料列表 (基于 xiuxian_data.js 中的 INITIAL_PLAYER_INVENTORY)
let backpackInventory = (typeof INITIAL_PLAYER_INVENTORY !== 'undefined') ? [...INITIAL_PLAYER_INVENTORY] : [
  { item: 'iron_ore', count: 26 },
  { item: 'copper_ore', count: 28 },
  { item: 'iron_ingot', count: 46 },
  { item: 'copper_ingot', count: 25 },
  { item: 'copper_wire', count: 23 },
  { item: 'iron_plate', count: 17 },
  { item: 'screw', count: 120 },
  { item: 'cultivator_corpse', count: 2 },
  { item: 'living_tissue', count: 5 },
  { item: 'neural_bundle', count: 2 },
  { item: 'iron_powder', count: 45 },
  { item: 'coal', count: 19 }
];

// 天罡剑匣 4 个专属飞剑插槽 (严格对齐 48x48px 规格)
let casketSwords = [
  { id: 'sword_wood', name: '青灵竹剑', count: 1, icon: 'fa-solid fa-khanda text-emerald-400 rotate-45', desc: '木系灵品飞剑，万木回春，御风疾走，真元恢复+15/秒', type: 'weapon', matId: 'SWORD_01' },
  { id: 'sword_fire', name: '炽阳炎剑', count: 1, icon: 'fa-solid fa-khanda text-orange-400 rotate-45', desc: '火系玄品飞剑，离火断金，杀伤力+380，破甲穿透+40%', type: 'weapon', matId: 'SWORD_02' },
  { id: 'sword_ice', name: '玄冰寒魄剑', count: 1, icon: 'fa-solid fa-khanda text-cyan-300 rotate-45', desc: '水系真品飞剑，凝霜封脉，杀伤力+260，护体冰甲+200', type: 'weapon', matId: 'SWORD_03' },
  null // 剑槽 4 初始空置，等待玩家从背包拖入其他武器
];

let isCasketTrayOpen = true; // 默认随装备面板展开显示在剑匣旁边

// 默认初始随身 32 格已解锁物品数据 (严格使用《修仙工厂》策划案官方名称)
const activePlayerBagItems = [
  { id: 'miner', name: '采矿机', count: 2, icon: 'fa-solid fa-cube text-cyan-300', desc: '自动化采掘地表玄铁矿等基础矿石', matId: 'BD_101' },
  { id: 'furnace', name: '精炼炉', count: 2, icon: 'fa-solid fa-fire text-orange-400', desc: '基础热炼设备，将矿石熔炼为金属锭', matId: 'BD_102' },
  { id: 'assembler', name: '加工台', count: 1, icon: 'fa-solid fa-screwdriver-wrench text-amber-300', desc: '基础零件装配成型', matId: 'BD_104' },
  { id: 'cutter', name: '切割机', count: 1, icon: 'fa-solid fa-bolt text-sky-400', desc: '高速线材与板材精密下料设备', matId: 'BD_105' },
  { id: 'portable_miner', name: '便携式采矿器', count: 3, icon: 'fa-solid fa-gears text-stone-300', desc: '单体便携手持采掘器', matId: 'TOOL_01' },
  { id: 'iron_ore', name: '玄铁原矿', count: 100, icon: 'fa-solid fa-mountain text-stone-400', desc: '精炼玄铁锭的基础重金属矿石', matId: 'MAT_001' },
  { id: 'copper_ore', name: '赤铜原矿', count: 80, icon: 'fa-solid fa-cubes text-amber-500', desc: '精炼导电赤铜锭的基础有色金属矿石', matId: 'MAT_002' },
  { id: 'coal', name: '煤炭', count: 65, icon: 'fa-solid fa-fire-flame-curved text-stone-500', desc: '含碳可燃矿物，用于冶炼燃料与热能供应', matId: 'MAT_003' },
  { id: 'iron_ingot', name: '玄铁金属锭', count: 58, icon: 'fa-solid fa-bars text-stone-300', desc: '由精炼炉冶炼玄铁原矿所得的基础材料', matId: 'MAT_005' },
  { id: 'copper_ingot', name: '导电赤铜锭', count: 45, icon: 'fa-solid fa-bars text-amber-400', desc: '由精炼炉熔炼赤铜原矿所得的高导电材料', matId: 'MAT_006' },
  { id: 'iron_rod', name: '标准玄铁棒', count: 64, icon: 'fa-solid fa-lines-leaning text-stone-300', desc: '圆截面基础金属棒材，用于框架与传动', matId: 'MAT_007' },
  { id: 'iron_plate', name: '工业玄铁板', count: 120, icon: 'fa-solid fa-sheet-plastic text-stone-200', desc: '大面积结构用板材，用于设备外壳与传送带', matId: 'MAT_008' },
  { id: 'screw', name: '超细螺丝', count: 96, icon: 'fa-solid fa-screwdriver text-cyan-300', desc: '精密连接与微型机械固定件', matId: 'MAT_009' },
  { id: 'copper_wire', name: '铜线', count: 150, icon: 'fa-solid fa-plug text-yellow-400', desc: '基础导电用单丝线材，用于绕制线圈与电力传输', matId: 'MAT_016' },
  { id: 'ling_copper_sheet', name: '导灵铜片', count: 25, icon: 'fa-solid fa-microchip text-yellow-300', desc: '高纯度赤铜经压延所得的灵气微流薄片', matId: 'MAT_017' },
  { id: 'iron_powder', name: '铁粉', count: 30, icon: 'fa-solid fa-braille text-stone-400', desc: '玄铁金属粉末，用于烧结与催化', matId: 'MAT_022' },
  { id: 'cultivator_corpse', name: '练气修士尸体', count: 2, icon: 'fa-solid fa-skull text-purple-400', desc: '具有完整经脉结构与微弱残余灵气的修士躯体（策划案官方资源）', matId: 'MAT_018' },
  { id: 'living_tissue', name: '鲜活组织', count: 12, icon: 'fa-solid fa-dna text-rose-400', desc: '含有活性细胞的生物组织块，用于生物合成与芯片接口', matId: 'MAT_019' },
  { id: 'neural_bundle', name: '神经束', count: 6, icon: 'fa-solid fa-network-wired text-cyan-400', desc: '生物神经信号传导纤维，用于电子生物芯片与灵机控制', matId: 'MAT_020' },
  { id: 'dry_tissue', name: '干燥生物质', count: 10, icon: 'fa-solid fa-leaf text-amber-600', desc: '脱水脱活后的生物有机残渣，用于低级能源', matId: 'MAT_021' },
  { id: 'bio_chip', name: '电子生物芯片', count: 4, icon: 'fa-solid fa-memory text-purple-300', desc: '生物与机器之间的工控元件', matId: 'MAT_015' },
  { id: 'basic_control_module', name: '基础控制模块', count: 8, icon: 'fa-solid fa-microchip text-emerald-400', desc: '智能物流、加工台、组装机的通用控制零件', matId: 'MAT_014' },
  { id: 'electric_coil', name: '导电线圈', count: 15, icon: 'fa-solid fa-spinner text-yellow-400', desc: '电能核心、风力发电机和控制设备的通用电力零件', matId: 'MAT_013' },
  { id: 'device_interface', name: '设备接口件', count: 12, icon: 'fa-solid fa-satellite-dish text-sky-400', desc: '通用设备接口；不承担生物加工功能', matId: 'MAT_012' },
  { id: 'building_block', name: '建筑基础模块', count: 50, icon: 'fa-solid fa-cubes-stacked text-stone-400', desc: '建筑底座、支撑、设备框架基础件', matId: 'MAT_011' },
  { id: 'wood_plank', name: '木板', count: 50, icon: 'fa-solid fa-tree text-amber-700', desc: '原始木质建材，用于初级支撑', matId: 'MAT_024' },
  { id: 'raw_water', name: '生水', count: 40, icon: 'fa-solid fa-droplet text-blue-400', desc: '未经净化的天然水体，用于冷却与清洗', matId: 'MAT_025' },
  { id: 'ling_stone', name: '灵石碎块', count: 128, icon: 'fa-solid fa-gem text-cyan-300', desc: '蕴含微量天地灵气的灵石残片', matId: 'MAT_073' },
  // 特别放入 3 柄飞剑供玩家体验从背包拖入剑匣！
  { id: 'sword_thunder', name: '紫霄惊雷剑', count: 1, icon: 'fa-solid fa-khanda text-yellow-300 rotate-45', desc: '雷系神品飞剑，九霄天罚，杀伤力+490，暴击率+35%', type: 'weapon', matId: 'SWORD_04' },
  { id: 'sword_iron', name: '寒铁飞剑', count: 1, icon: 'fa-solid fa-khanda text-cyan-200 rotate-45', desc: '高寒精铁千锤百炼飞剑，御剑杀伤+260，破甲+25%', type: 'weapon', matId: 'SWORD_05' },
  { id: 'sword_dragon', name: '斩龙巨剑', count: 1, icon: 'fa-solid fa-khanda text-rose-400 rotate-45', desc: '深海龙骨重煞飞剑，破灵碎脉，杀伤力+420', type: 'weapon', matId: 'SWORD_06' },
  null // 空储物槽 32，供玩家存放从剑匣拖出来的飞剑
];

let isThunderPurified = false; // 是否已天雷淬体解锁后 40 格
let currentActiveSword = 'wood'; // 当前出鞘主手飞剑: 'wood' | 'fire' | 'ice' | 'thunder'
let selectedBagSlotIdx = null;

const swordDefs = {
  wood: { name: '青灵竹剑', desc: '木系灵品，万木生生，疾风迅捷，灵气恢复 +15/秒', icon: 'fa-khanda text-emerald-300 rotate-45' },
  fire: { name: '炽阳炎剑', desc: '火系玄品，离火断金，杀伤力 +380，穿透 +40%', icon: 'fa-khanda text-orange-400 rotate-45' },
  ice: { name: '玄冰寒魄剑', desc: '水系真品，凝霜封脉，杀伤力 +260，护体冰甲 +200', icon: 'fa-khanda text-cyan-300 rotate-45' },
  thunder: { name: '紫霄惊雷剑', desc: '雷系神品，九霄天罚，杀伤力 +490，暴击 +35%', icon: 'fa-khanda text-yellow-300 rotate-45' }
};

// 天雷淬体突破触发
function triggerHeavenThunderPurify() {
  playUiSound('thunder_strike');
  const flash = document.getElementById('thunderFlashOverlay');
  if (flash) {
    flash.classList.remove('lightning-anim');
    void flash.offsetWidth; // 触发重绘
    flash.classList.add('lightning-anim');
  }

  isThunderPurified = !isThunderPurified;

  if (isThunderPurified) {
    showNotification('⚡【九天天雷淬体·大圆满】引雷淬脉，打破肉身界限！72 格储物空间全部开辟！');
    const thunderBtn = document.getElementById('btnHeavenThunder');
    if (thunderBtn) {
      thunderBtn.innerHTML = '<i class="fa-solid fa-check text-yellow-300"></i><span>淬体圆满 (已全开)</span>';
      thunderBtn.className = 'flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs rounded shadow cursor-pointer transition';
    }
  } else {
    showNotification('【天雷淬体封印重置】储物空间恢复为基础 32 格测试状态');
    const thunderBtn = document.getElementById('btnHeavenThunder');
    if (thunderBtn) {
      thunderBtn.innerHTML = '<i class="fa-solid fa-bolt text-yellow-300 animate-bounce"></i><span>天雷淬体</span>';
      thunderBtn.className = 'flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 text-white font-bold text-xs rounded shadow-[0_0_15px_rgba(245,158,11,0.6)] cursor-pointer active:scale-95 transition';
    }
  }

  renderPlayerEquipmentModal();
}

let currentEquipSubmenuType = 'swordCasket';

// 切换人像下方展示的装备二级菜单 (剑匣 / 本命法宝 / 护甲 / 飞行载具)
function showEquipSecondarySubmenu(type) {
  currentEquipSubmenuType = type;
  const submenus = {
    swordCasket: 'swordCasketInlineTray',
    casket: 'swordCasketInlineTray',
    artifact: 'artifactSubmenuTray',
    armor: 'armorSubmenuTray',
    vehicle: 'vehicleSubmenuTray'
  };

  ['swordCasketInlineTray', 'artifactSubmenuTray', 'armorSubmenuTray', 'vehicleSubmenuTray'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const activeId = submenus[type] || 'swordCasketInlineTray';
  const target = document.getElementById(activeId);
  if (target) {
    target.classList.remove('hidden');
    if (type === 'swordCasket' || type === 'casket') {
      renderCasketInlineTray();
    }
  }
}

// 点击人像装备槽，展开对应二级菜单 (放置在人像下方原随身快捷栏位置)
function inspectEquipmentSlot(slotType) {
  playUiSound('click');
  showEquipSecondarySubmenu(slotType);
}

// 点击装备栏【天罡剑匣】直接切换/展开剑匣二级菜单
function openCasketSecondaryMenu() {
  playUiSound('sword_draw');
  showEquipSecondarySubmenu('swordCasket');
  showNotification('【天罡剑匣·二级菜单】已在下方展开，可拖拽飞剑至右侧储物格进行调配');
}

// 兼容旧接口
function toggleSwordCasketInlineTray() {
  openCasketSecondaryMenu();
}
function openSwordCasketModal() {
  openCasketSecondaryMenu();
}
function closeSwordCasketModal() {
  // 不再隐藏，默认常驻展示二级菜单
}

// 渲染天罡剑匣二级菜单的 4 个飞剑插槽 (放置在人像下方原随身快捷栏位置)
function renderCasketInlineTray() {
  const container = document.getElementById('casketSlotsContainer');
  if (!container) return;
  container.innerHTML = '';

  let occupiedCount = 0;

  for (let s = 0; s < 4; s++) {
    const sword = casketSwords[s];
    const slotDiv = document.createElement('div');
    slotDiv.id = `casketSlot_${s}`;

    if (sword) {
      occupiedCount++;
      slotDiv.className = 'relative w-full h-12 bg-[#09203a]/95 hover:bg-amber-400/20 border border-amber-400/80 hover:border-amber-300 rounded flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing transition group casket-slot-active';
      slotDiv.draggable = true;
      slotDiv.title = `[剑槽 #${s + 1}] ${sword.name} (${sword.matId || ''})\n${sword.desc}\n• 可直接拖拽至右侧背包储物格\n• 可拖拽到其他剑槽调换顺序\n• 点击拔剑出鞘设为主手佩剑`;
      slotDiv.innerHTML = `
        <i class="${sword.icon} text-base group-hover:scale-110 group-hover:rotate-6 transition"></i>
        <span class="absolute top-0.5 left-1 text-[7px] font-mono text-amber-300 font-bold">${s + 1}</span>
        <span class="absolute bottom-0.5 right-1 text-[7px] font-mono text-amber-200/90 font-bold drop-shadow">1</span>
        <div class="absolute inset-0 rounded pointer-events-none border border-amber-400/0 group-hover:border-amber-300/60 transition"></div>
      `;

      // 拖拽事件与点击事件
      slotDiv.ondragstart = (e) => handleCasketDragStart(e, s);
      slotDiv.ondragend = handleDragEnd;
      slotDiv.onclick = () => handleCasketSlotClick(s);
    } else {
      // 空插槽 (虚线框，可作为放置目标)
      slotDiv.className = 'relative w-full h-12 bg-[#061426]/70 border border-dashed border-amber-400/40 hover:border-amber-300/80 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-amber-400/10 transition group';
      slotDiv.title = `[剑槽 #${s + 1}] 空置中\n从右侧储物矩阵中拖拽飞剑或武器至此槽即可入匣！`;
      slotDiv.innerHTML = `
        <i class="fa-solid fa-plus text-xs text-amber-400/40 group-hover:text-amber-300 group-hover:scale-125 transition"></i>
        <span class="absolute top-0.5 left-1 text-[7px] font-mono text-amber-400/40">${s + 1}</span>
        <span class="text-[6px] text-amber-300/50 mt-0.5 scale-90">空剑槽</span>
      `;
      slotDiv.onclick = () => {
        playUiSound('click');
        showNotification(`【天罡剑匣·剑槽 #${s + 1}】当前空置，可直接从右侧储物格拖入飞剑或武器！`);
      };
    }

    // 允许作为拖放目标
    slotDiv.ondragover = handleSlotDragOver;
    slotDiv.ondragleave = handleSlotDragLeave;
    slotDiv.ondrop = (e) => handleCasketSlotDrop(e, s);

    container.appendChild(slotDiv);
  }

  // 更新剑匣计数徽章
  const badge = document.getElementById('casketOccupiedBadge');
  if (badge) badge.innerText = `${occupiedCount}/4`;
  const charCasketBadge = document.getElementById('charCasketCountBadge');
  if (charCasketBadge) charCasketBadge.innerText = `${occupiedCount}`;
}

// 点击剑匣飞剑槽：拔剑出鞘设为主手佩剑
function handleCasketSlotClick(slotIdx) {
  const sword = casketSwords[slotIdx];
  if (!sword) return;
  playUiSound('sword_draw');
  showNotification(`【拔剑出鞘】主手佩剑切换为：【${sword.name}】！${sword.desc}`);
  const activeLabel = document.getElementById('activeSwordNameLabel');
  if (activeLabel) activeLabel.innerText = `${sword.name} (已出鞘持握)`;
}

// =========================================================================
// HTML5 原生拖拽事件实现 (从背包拖入剑匣、从剑匣拖回背包、相互调换)
// =========================================================================

function handleBagDragStart(e, idx) {
  const item = activePlayerBagItems[idx];
  if (!item) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'bag', index: idx }));
  e.dataTransfer.effectAllowed = 'copyMove';
  e.target.classList.add('dragging-item');
  const tip = document.getElementById('bagSlotHoverTip');
  if (tip) tip.innerHTML = `<span class="text-amber-300 font-bold">正在拖拽: 【${item.name}】</span> - 拖至左上方【天罡剑匣】插槽装入，或拖到其他格位`;
}

function handleCasketDragStart(e, slotIdx) {
  const sword = casketSwords[slotIdx];
  if (!sword) {
    e.preventDefault();
    return;
  }
  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'casket', index: slotIdx }));
  e.dataTransfer.effectAllowed = 'copyMove';
  e.target.classList.add('dragging-item');
  const tip = document.getElementById('bagSlotHoverTip');
  if (tip) tip.innerHTML = `<span class="text-amber-300 font-bold">从剑匣拔出: 【${sword.name}】</span> - 拖至右侧储物矩阵格位即可入包`;
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging-item');
  document.querySelectorAll('.drag-slot-over').forEach(el => el.classList.remove('drag-slot-over'));
}

function handleSlotDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const target = e.currentTarget;
  if (!target.classList.contains('drag-slot-over')) {
    target.classList.add('drag-slot-over');
  }
}

function handleSlotDragLeave(e) {
  e.currentTarget.classList.remove('drag-slot-over');
}

// 释放到剑匣 4 插槽之一
function handleCasketSlotDrop(e, targetSlotIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-slot-over');
  const raw = e.dataTransfer.getData('text/plain');
  if (!raw) return;
  let data;
  try { data = JSON.parse(raw); } catch (err) { return; }

  if (data.type === 'bag') {
    const bagItem = activePlayerBagItems[data.index];
    if (!bagItem) return;

    // 将背包物料/武器置换进剑匣
    const oldCasketSword = casketSwords[targetSlotIdx];
    casketSwords[targetSlotIdx] = bagItem;
    activePlayerBagItems[data.index] = oldCasketSword;

    playUiSound('sword_draw');
    showNotification(`【飞剑入匣】已将【${bagItem.name}】纳入天罡剑匣 [剑槽 #${targetSlotIdx + 1}]！`);
    renderCasketInlineTray();
    renderPlayerEquipmentModal();
  } else if (data.type === 'casket') {
    const sourceIdx = data.index;
    if (sourceIdx !== targetSlotIdx) {
      const temp = casketSwords[sourceIdx];
      casketSwords[sourceIdx] = casketSwords[targetSlotIdx];
      casketSwords[targetSlotIdx] = temp;
      playUiSound('click');
      showNotification(`【剑位调换】已调整剑槽 #${sourceIdx + 1} 与 剑槽 #${targetSlotIdx + 1} 的飞剑排序`);
      renderCasketInlineTray();
    }
  }
}

// 释放到背包储物格位之一
function handleBagSlotDrop(e, targetBagIdx) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-slot-over');
  const raw = e.dataTransfer.getData('text/plain');
  if (!raw) return;
  let data;
  try { data = JSON.parse(raw); } catch (err) { return; }

  if (data.type === 'casket') {
    const sword = casketSwords[data.index];
    if (!sword) return;

    const targetBagItem = activePlayerBagItems[targetBagIdx];
    activePlayerBagItems[targetBagIdx] = sword;
    casketSwords[data.index] = targetBagItem;

    playUiSound('sword_draw');
    showNotification(`【拔剑入包】已将【${sword.name}】移入储物矩阵 [格位 #${targetBagIdx + 1}]！`);
    renderCasketInlineTray();
    renderPlayerEquipmentModal();
  } else if (data.type === 'bag') {
    const sourceIdx = data.index;
    if (sourceIdx !== targetBagIdx) {
      const temp = activePlayerBagItems[sourceIdx];
      activePlayerBagItems[sourceIdx] = activePlayerBagItems[targetBagIdx];
      activePlayerBagItems[targetBagIdx] = temp;
      playUiSound('click');
      renderPlayerEquipmentModal();
    }
  }
}

// 渲染 72 格 BAG 网格 (前 32 格解锁 + 后 40 格带 X 锁定)
function renderPlayerEquipmentModal() {
  const container = document.getElementById('bagGrid72Container');
  if (!container) return;
  container.innerHTML = '';

  // 1. 前 32 格：已解锁活跃槽位 (4 行 × 8 列)
  for (let i = 0; i < 32; i++) {
    const item = activePlayerBagItems[i];
    const slotDiv = document.createElement('div');
    slotDiv.id = `bagSlot_${i}`;

    if (item) {
      slotDiv.className = `relative w-12 h-12 bg-[#09203a]/90 hover:bg-[#00f0ff]/20 border ${selectedBagSlotIdx === i ? 'border-[#00f0ff] shadow-[0_0_12px_#00f0ff] ring-1 ring-white' : 'border-[#00f0ff]/40 hover:border-[#00f0ff]'} rounded flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing transition group`;
      slotDiv.draggable = true;
      slotDiv.ondragstart = (e) => handleBagDragStart(e, i);
      slotDiv.ondragend = handleDragEnd;
      slotDiv.onclick = () => inspectBagItem(i, item);
      slotDiv.title = `[已开辟] ${item.name} (${item.matId || ''}) x${item.count}\n${item.desc}\n• 可拖拽放入左上方剑匣\n• 可在背包格位间拖拽调换`;
      slotDiv.innerHTML = `
        <i class="${item.icon} text-lg group-hover:scale-110 transition"></i>
        <span class="absolute bottom-0.5 right-1 text-[8px] font-mono text-cyan-200 font-bold drop-shadow">${item.count}</span>
        <span class="absolute top-0.5 left-1 text-[6px] font-mono text-white/30">${i + 1}</span>
      `;
    } else {
      slotDiv.className = 'relative w-12 h-12 bg-[#07192f]/50 border border-[#00f0ff]/20 hover:border-[#00f0ff]/50 rounded flex items-center justify-center cursor-pointer transition';
      slotDiv.title = `[已开辟] 空置储物格 ${i + 1}\n可从剑匣或其他格位拖拽物料放入`;
      slotDiv.onclick = () => {
        playUiSound('click');
        document.getElementById('bagSlotHoverTip').innerText = `【空置储物槽 #${i + 1}】可存放任意修仙物料、飞剑与法宝`;
      };
      slotDiv.innerHTML = `<span class="text-[7px] font-mono text-cyan-500/30">${i + 1}</span>`;
    }

    // 允许作为拖放目标
    slotDiv.ondragover = handleSlotDragOver;
    slotDiv.ondragleave = handleSlotDragLeave;
    slotDiv.ondrop = (e) => handleBagSlotDrop(e, i);

    container.appendChild(slotDiv);
  }

  // 额外的策划案高级物料，在天雷淬体后填充
  const advancedBonusItems = [
    { name: '高温合金锭', count: 32, icon: 'fa-solid fa-bars text-red-400', desc: 'BD_113冶炼舱高温所得合金材料', matId: 'MAT_026' },
    { name: '精炼玄铁锭', count: 40, icon: 'fa-solid fa-cubes text-blue-300', desc: '高纯度玄铁精炼产物', matId: 'MAT_027' },
    { name: '脱水生物组织', count: 18, icon: 'fa-solid fa-dna text-purple-300', desc: '灭活脱水生物标本', matId: 'MAT_028' },
    { name: '灵根胚体', count: 1, icon: 'fa-solid fa-atom text-emerald-300', desc: '筑基主线人造灵根关键组装件', matId: 'MAT_029' },
    { name: '导脉合金', count: 25, icon: 'fa-solid fa-microchip text-yellow-300', desc: '经脉兼容高导灵合金', matId: 'MAT_030' },
    { name: '灵能晶石', count: 64, icon: 'fa-solid fa-gem text-cyan-300', desc: '纯净天地灵能结晶', matId: 'MAT_072' }
  ];

  // 2. 后 40 格：根据 isThunderPurified 状态决定是带 X 锁定还是全部开辟！
  for (let j = 32; j < 72; j++) {
    const slotDiv = document.createElement('div');
    if (!isThunderPurified) {
      // 锁定状态 (带 X 交叉线，Image 2 标志特征)
      slotDiv.className = 'relative w-12 h-12 bg-[#051120]/90 border border-[#00f0ff]/20 rounded flex items-center justify-center cursor-not-allowed group hover:border-red-400/40 transition';
      slotDiv.title = `[未开辟槽位 #${j + 1}] 点击上方【天雷淬体】引神雷淬脉解锁！`;
      slotDiv.onclick = () => {
        playUiSound('craft_fail');
        showNotification(`【未开辟储物槽 #${j + 1}】点击上方【⚡ 天雷淬体】引神雷打破经脉界限！`);
      };
      slotDiv.innerHTML = `
        <svg class="w-full h-full p-2.5 opacity-50 group-hover:opacity-80 transition" viewBox="0 0 36 36">
          <line x1="4" y1="4" x2="32" y2="32" stroke="#00f0ff" stroke-width="1.8" stroke-linecap="round"/>
          <line x1="32" y1="4" x2="4" y2="32" stroke="#00f0ff" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span class="absolute bottom-0.5 right-1 text-[6px] font-mono text-cyan-500/20">${j + 1}</span>
      `;
    } else {
      // 天雷淬体已解锁！(金光/青色开辟槽位)
      const bonusItem = advancedBonusItems[(j - 32) % advancedBonusItems.length];
      const hasItem = (j - 32) < advancedBonusItems.length;
      if (hasItem && bonusItem) {
        slotDiv.className = 'relative w-12 h-12 bg-[#0a283e]/90 hover:bg-[#00f0ff]/25 border border-amber-400/80 rounded flex flex-col items-center justify-center p-1 cursor-grab active:cursor-grabbing transition shadow-[0_0_8px_rgba(245,158,11,0.3)] group';
        slotDiv.draggable = true;
        slotDiv.ondragstart = (e) => handleBagDragStart(e, j);
        slotDiv.ondragend = handleDragEnd;
        slotDiv.onclick = () => inspectBagItem(j, bonusItem);
        slotDiv.title = `[天雷开辟] ${bonusItem.name} x${bonusItem.count}\n${bonusItem.desc}`;
        slotDiv.innerHTML = `
          <i class="${bonusItem.icon} text-lg group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[8px] font-mono text-amber-200 font-bold drop-shadow">${bonusItem.count}</span>
          <span class="absolute top-0.5 left-1 text-[6px] font-mono text-amber-400/70">${j + 1}</span>
        `;
      } else {
        slotDiv.className = 'relative w-12 h-12 bg-[#081e32]/60 border border-cyan-400/40 hover:border-cyan-300 rounded flex items-center justify-center cursor-pointer transition';
        slotDiv.title = `[天雷开辟] 空置储物格 ${j + 1}`;
        slotDiv.onclick = () => {
          playUiSound('click');
          document.getElementById('bagSlotHoverTip').innerText = `【天雷开辟储物槽 #${j + 1}】经脉通达，可收纳万物`;
        };
        slotDiv.innerHTML = `<span class="text-[7px] font-mono text-cyan-300/40">${j + 1}</span>`;
      }

      // 允许作为拖放目标
      slotDiv.ondragover = handleSlotDragOver;
      slotDiv.ondragleave = handleSlotDragLeave;
      slotDiv.ondrop = (e) => handleBagSlotDrop(e, j);
    }
    container.appendChild(slotDiv);
  }

  // 同步渲染剑匣旁边的 4 槽飞剑插槽
  renderCasketInlineTray();

  // 更新已开辟槽位计数
  const activeCountElem = document.getElementById('bagActiveCount');
  if (activeCountElem) activeCountElem.innerText = isThunderPurified ? '72' : '32';
}

// 点击物料查看详情
function inspectBagItem(idx, item) {
  playUiSound('click');
  selectedBagSlotIdx = idx;
  const tipElem = document.getElementById('bagSlotHoverTip');
  if (tipElem) {
    tipElem.innerHTML = `<span class="text-white font-bold">【${item.name}】</span> <span class="text-cyan-200">x${item.count}</span> <span class="text-white/50">(${item.matId || ''})</span> - <span class="text-cyan-300/80">${item.desc}</span>`;
  }
  renderPlayerEquipmentModal();
}

// 点击左侧与右侧 3D 浮空白卡
function selectFloatingCard(name, desc) {
  playUiSound('toggle');
  showNotification(`【${name}】: ${desc}`);
}

// 点击人像身上的装备槽位
function selectEquipSlot(slotType, title, desc) {
  playUiSound('click');
  showNotification(`已装配【${title}】: ${desc}`);
}

// 切换 Tab 背包清单 / 天元全息罗盘中枢
let currentHoloTab = 'main'; // 'main' (角色与背包一体化), 'map', 'hub', 'craft', 'codex', 'todo', 'stats'
let currentStatsSubTab = 'world'; // 'player' | 'world' | 'cert'

// 统计面板数据 (严格复刻参考图 21 个世界参数及全域指标，采用纯正赛博工控科技风呈现)
const STATS_DATA = {
  world: [
    { label: '设备工作速度', value: '100%', icon: 'fa-solid fa-industry', cat: '流水线效能', color: 'text-[#00f0ff]' },
    { label: '热量消耗速度', value: '100%', icon: 'fa-solid fa-fire-burner', cat: '热工能耗', color: 'text-amber-400' },
    { label: '燃料热值', value: '100%', icon: 'fa-solid fa-fire', cat: '能源转化', color: 'text-orange-400' },
    { label: '肥料营养值', value: '100%', icon: 'fa-solid fa-seedling', cat: '生物灵植', color: 'text-emerald-400' },
    { label: '弹射器射速', value: '60/min', icon: 'fa-solid fa-crosshairs', cat: '物流发射', color: 'text-sky-400' },
    { label: '加农炮射速', value: '120/min', icon: 'fa-solid fa-bullseye', cat: '深空投送', color: 'text-rose-400' },
    { label: '萃取机产量', value: '100%', icon: 'fa-solid fa-flask-vial', cat: '精细化工', color: 'text-teal-400' },
    { label: '蒸馏器产量', value: '100%', icon: 'fa-solid fa-atom', cat: '流体提纯', color: 'text-cyan-300' },
    { label: '店铺利润', value: '140%', icon: 'fa-solid fa-store', cat: '商市营收', color: 'text-yellow-400' },
    { label: '杂货利润', value: '180%', icon: 'fa-solid fa-boxes-packing', cat: '常规货殖', color: 'text-amber-300' },
    { label: '药剂利润', value: '180%', icon: 'fa-solid fa-prescription-bottle', cat: '灵丹仙酿', color: 'text-emerald-300' },
    { label: '酒水利润', value: '180%', icon: 'fa-solid fa-wine-glass', cat: '琼浆玉液', color: 'text-purple-300' },
    { label: '珠宝首饰利润', value: '180%', icon: 'fa-solid fa-gem', cat: '灵宝首饰', color: 'text-pink-400' },
    { label: '圣物利润', value: '180%', icon: 'fa-solid fa-scroll', cat: '古修遗蜕', color: 'text-yellow-300' },
    { label: '顾客购物数量加成', value: '0%', icon: 'fa-solid fa-cart-shopping', cat: '客商吞吐', color: 'text-white/60' },
    { label: '大传送门客流量', value: '250%', icon: 'fa-solid fa-dungeon', cat: '星门枢纽', color: 'text-purple-400' },
    { label: '任务报酬', value: '100%', icon: 'fa-solid fa-award', cat: '悬赏结付', color: 'text-amber-400' },
    { label: '每日随机任务', value: '1', icon: 'fa-solid fa-clipboard-list', cat: '因果机缘', color: 'text-cyan-300' },
    { label: '采购合同数量加成', value: '300%', icon: 'fa-solid fa-file-contract', cat: '大宗契约', color: 'text-emerald-400' },
    { label: '采购合同价格加成', value: '60%', icon: 'fa-solid fa-hand-holding-dollar', cat: '商行议价', color: 'text-amber-300' },
    { label: '圣物提取加成', value: '0%', icon: 'fa-solid fa-vial-circle-check', cat: '道韵提萃', color: 'text-white/60' }
  ],
  player: [
    { label: '修士奔袭速度', value: '100%', icon: 'fa-solid fa-person-running', cat: '基础机动', color: 'text-[#00f0ff]' },
    { label: '地表采矿挖掘倍率', value: '100%', icon: 'fa-solid fa-pickaxe', cat: '地脉开采', color: 'text-amber-400' },
    { label: '手工装配制作速度', value: '100%', icon: 'fa-solid fa-screwdriver-wrench', cat: '随身研造', color: 'text-orange-400' },
    { label: '飞剑破甲真伤加成', value: '120%', icon: 'fa-solid fa-khanda', cat: '破罡斩击', color: 'text-rose-400' },
    { label: '护体罡气护盾上限', value: '500 点', icon: 'fa-solid fa-shield-halved', cat: '本命护盾', color: 'text-emerald-400' },
    { label: '随身储物经脉格数', value: '72 格', icon: 'fa-solid fa-boxes-stacked', cat: '经脉芥子', color: 'text-cyan-300' },
    { label: '灵压极限耐受负荷', value: '8,420 Pa', icon: 'fa-solid fa-gauge-high', cat: '肉身负荷', color: 'text-purple-300' },
    { label: '地脉煞气抗性加成', value: '45%', icon: 'fa-solid fa-biohazard', cat: '环境抗逆', color: 'text-teal-400' },
    { label: '高空坠落冲击缓释', value: '30%', icon: 'fa-solid fa-feather-pointed', cat: '御气缓冲', color: 'text-blue-300' },
    { label: '神识探测扫描半径', value: '500 米', icon: 'fa-solid fa-tower-broadcast', cat: '全息感知', color: 'text-sky-400' }
  ],
  cert: [
    { label: '宗门商业资质', value: '认证通过 (特等)', icon: 'fa-solid fa-stamp', cat: '仙宗官印', color: 'text-emerald-400' },
    { label: '流水线自动化评级', value: '甲等上乘', icon: 'fa-solid fa-diagram-project', cat: '工控评定', color: 'text-[#00f0ff]' },
    { label: '全厂物流平衡效率', value: '94.6%', icon: 'fa-solid fa-scale-balanced', cat: '拓扑平衡', color: 'text-amber-400' },
    { label: '煞气回收环保达标率', value: '99.8%', icon: 'fa-solid fa-leaf', cat: '天道衡平', color: 'text-emerald-300' },
    { label: '主电网稳态冗余', value: '165 MW', icon: 'fa-solid fa-bolt', cat: '动力储备', color: 'text-yellow-400' },
    { label: '每日产值收益估算', value: '28,400 灵石', icon: 'fa-solid fa-coins', cat: '商业推演', color: 'text-amber-300' },
    { label: '仙宗商盟信誉评级', value: '天阶商契', icon: 'fa-solid fa-certificate', cat: '商道威望', color: 'text-purple-400' }
  ]
};

// 切换统计子选项卡
function switchStatsSubTab(subTab) {
  playUiSound('click');
  currentStatsSubTab = subTab;

  ['world', 'player', 'cert'].forEach(t => {
    const btn = document.getElementById(`btnStatsTab_${t}`);
    if (!btn) return;
    if (t === subTab) {
      btn.className = 'px-4 py-2 border-b-2 border-[#00f0ff] bg-[#00f0ff]/15 text-[#00f0ff] font-black text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-[0_2px_10px_rgba(0,240,255,0.2)]';
    } else {
      btn.className = 'px-4 py-2 border-b-2 border-transparent text-white/60 hover:text-white hover:bg-white/5 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer';
    }
  });

  renderStatsList();
}

// 渲染统计条目列表 (赛博工控遥测网格卡片)
function renderStatsList() {
  const container = document.getElementById('statsItemsList');
  if (!container) return;
  container.innerHTML = '';

  const list = STATS_DATA[currentStatsSubTab] || STATS_DATA.world;
  const countBadge = document.getElementById('statsTotalCountBadge');
  if (countBadge) countBadge.innerText = list.length;

  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-[#05101d]/90 hover:bg-[#091a2f] border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 rounded-lg p-2.5 transition flex items-center justify-between group shadow-sm';
    card.innerHTML = `
      <div class="flex items-center space-x-2.5 min-w-0">
        <div class="w-8 h-8 rounded-md bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center ${item.color || 'text-[#00f0ff]'} text-sm shrink-0 group-hover:scale-110 group-hover:bg-[#00f0ff]/20 transition">
          <i class="${item.icon}"></i>
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-xs font-bold text-white/90 group-hover:text-cyan-200 transition truncate">${item.label}</span>
          <span class="text-[9px] font-mono text-cyan-400/50 uppercase tracking-wider">${item.cat}</span>
        </div>
      </div>
      <div class="text-right pl-2 shrink-0">
        <div class="font-mono font-black text-sm ${item.color || 'text-[#00f0ff]'} drop-shadow-[0_0_6px_rgba(0,240,255,0.3)]">${item.value}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function switchHoloCompassTab(tabId) {
  playUiSound('toggle');
  currentHoloTab = tabId;

  // 1. 更新按钮高亮 (1:1 还原 Image 2 白色高亮发光方块)
  document.querySelectorAll('.holo-card-btn').forEach(btn => {
    btn.classList.remove('holo-card-active');
  });
  const activeBtn = document.getElementById(`btnHolo_${tabId}`);
  if (activeBtn) {
    activeBtn.classList.add('holo-card-active');
  }

  // 2. 切换中心视口各功能内容面板
  document.querySelectorAll('.holo-pane').forEach(p => p.classList.add('hidden'));
  const targetPane = document.getElementById(`holoPane_${tabId}`) || document.getElementById('holoPane_main');
  if (targetPane) {
    targetPane.classList.remove('hidden');
  }

  // 3. 动态更新顶栏标题 (100% 严格对齐官方策划案功能名称)
  const tabNames = {
    main: '角色装备与 72 格储物空间 (CHARACTER & BAG)',
    map: '全息地脉矿脉勘舆图 (TERRITORY MAP)',
    hub: '中央处理器科技里程碑 (HUB TERMINAL)',
    craft: '随身手工操作台 (MANUAL CRAFT)',
    codex: '天工法典万象百科 (CODEX ARCHIVE)',
    todo: '建筑材料待办清单 (TODO LIST)',
    stats: '全域统计 · 属性倍率与经营认证 (STATISTICS)'
  };
  const titleElem = document.getElementById('holoCompassModeTitle');
  if (titleElem) {
    titleElem.innerText = tabNames[tabId] || '天元全息灵盘中枢';
  }

  // 4. 刷新渲染
  if (tabId === 'main') {
    renderPlayerEquipmentModal();
    renderCasketInlineTray();
  } else if (tabId === 'stats') {
    renderStatsList();
  }

  showNotification(`已切换至视图: 【${(tabNames[tabId] || tabId).split(' ')[0]}】`);
}

function toggleInventoryModal(defaultTab) {
  playUiSound('click');
  closeOtherModals('invModal');
  const modal = document.getElementById('invModal');
  if (!modal) return;
  const isOpening = modal.classList.contains('hidden');
  modal.classList.toggle('hidden');
  if (isOpening) {
    // 严格确保默认必定显示角色装备与背包主界面，杜绝出现空白视口！
    const validTab = (defaultTab && document.getElementById(`holoPane_${defaultTab}`)) ? defaultTab : 'main';
    switchHoloCompassTab(validTab);
    renderPlayerEquipmentModal();
    renderCasketInlineTray();
    showNotification('已展开【天元全息罗盘仪中枢】(角色装备与背包同屏展示)');
  }
}

// 背包排序 (按策划案物料分类与数量自动排序)
function sortPlayerBackpack() {
  playUiSound('toggle');
  activePlayerBagItems.sort((a, b) => {
    if (!a) return 1;
    if (!b) return -1;
    return b.count - a.count;
  });
  renderPlayerEquipmentModal();
  showNotification('随身背包物料已按数量自动规整排序');
}

// 罗盘模态打开状态下的 1-7 数字键快捷切换监听 (严格对齐外部功能按键)
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('invModal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (document.activeElement.tagName === 'INPUT') return;

  const keyMap = {
    '1': 'main',    // 角色背包同屏
    '2': 'map',     // 地图
    '3': 'hub',     // 中央处理器
    '4': 'craft',   // 手工制作
    '5': 'codex',   // 天工法典
    '6': 'todo',    // 待办清单
    '7': 'stats'    // 全域统计
  };
  if (keyMap[e.key]) {
    e.preventDefault();
    switchHoloCompassTab(keyMap[e.key]);
  }
});


