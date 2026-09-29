// ====================================================================
// js/machines.js - 机器加工台交互系统 (配方选择、生产状态、超频与设置)
// ====================================================================

let currentMachineId = 'cutter'; // 当前设备: furnace, constructor, cutter, mill, decon, miner
let currentMachineRecipeId = 'rcp_copper_wire'; // 当前运行配方
let selectedRecipeInPicker = 'rcp_copper_wire'; // 选择配方视图中光标选中的配方
let isMachinePowerOn = true; // 电源状态
let copiedSettings = null; // 复制设置缓存
let currentMachineView = 'prod'; // 'prod' (生产) 或 'recipe' (选择配方)

let targetedMachineId = null;
let currentOpenedMachine = null;

// 当准星或鼠标指向某机器时激活提示
function setTargetMachine(id) {
  targetedMachineId = id;
  const prompt = document.getElementById('machineInteractPrompt');
  const actionText = document.getElementById('promptActionText');
  if (id === 'storage_box') {
    if (actionText) actionText.innerText = `打开【储物盒 (BD_115)】`;
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  if (id.startsWith('smelt_chamber_')) {
    const idx = parseInt(id.replace('smelt_chamber_', '')) || 0;
    if (actionText) actionText.innerText = `打开【冶炼舱 #${idx + 1} (BD_113)】被动加工器面板 [按E/点击]`;
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  if (id.startsWith('smelt_slot_empty_')) {
    const idx = parseInt(id.replace('smelt_slot_empty_', '')) || 0;
    if (actionText) actionText.innerText = `插槽 #${idx + 1} 空置 [点击安装 BD_113 冶炼舱外部模型]`;
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  if (id === 'bio_base_slot' || id.startsWith('bio_slot_')) {
    const slot = (typeof bioBaseSlot !== 'undefined') ? bioBaseSlot : { mounted: true, childId: 'incubator', name: '培育仓 (BD_108)' };
    if (slot.mounted && slot.childId) {
      if (actionText) actionText.innerText = `打开【${slot.name}】控制面板 [按E/点击]`;
    } else {
      if (actionText) actionText.innerText = `营养基座顶部插槽空置 [点击安装 培养仓/培养皿 模型]`;
    }
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  if (id === 'power_engine') {
    if (actionText) actionText.innerText = `打开【灵力引擎 (BD_112)】主动加工器控制面板 [按E/点击]`;
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  if (id === 'smelt_chamber') {
    if (actionText) actionText.innerText = `打开【冶炼舱 (BD_113)】被动加工器面板 [按E/点击]`;
    if (prompt) prompt.style.opacity = '1';
    return;
  }
  const machKey = mapLegacyMachineKey(id);
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[machKey] : null;
  const title = bData ? bData.name.split(' ')[0] : '修仙工控设备';
  if (actionText) actionText.innerText = `打开【${title}】控制面板`;
  if (prompt) prompt.style.opacity = '1';
}

// 移出机器范围清除交互提示
function clearTargetMachine(id) {
  if (targetedMachineId === id) {
    targetedMachineId = null;
    const prompt = document.getElementById('machineInteractPrompt');
    if (prompt) prompt.style.opacity = '0';
  }
}

// 触发准星当前机器交互
function triggerTargetMachineInteract() {
  if (targetedMachineId) {
    if (targetedMachineId.startsWith('smelt_chamber_')) {
      const slotIdx = parseInt(targetedMachineId.replace('smelt_chamber_', '')) || 0;
      openPassiveChamberSlot(slotIdx);
      return;
    }
    if (targetedMachineId.startsWith('smelt_slot_empty_')) {
      const slotIdx = parseInt(targetedMachineId.replace('smelt_slot_empty_', '')) || 0;
      mountChamberModel(slotIdx);
      return;
    }
    if (targetedMachineId === 'bio_base_slot' || targetedMachineId.startsWith('bio_slot_')) {
      if (typeof bioBaseSlot !== 'undefined' && bioBaseSlot.mounted && bioBaseSlot.childId) {
        openMachineHUD(bioBaseSlot.childId);
      } else {
        mountBioBasePlugin('incubator');
      }
      return;
    }
    if (targetedMachineId === 'storage_box') {
      if (typeof openStorageBoxModal === 'function') {
        openStorageBoxModal();
      }
      return;
    }
    openMachineHUD(targetedMachineId);
  }
}

// 机器大类分类常量 (底座为主动加工器，插件为被动加工器)
const PASSIVE_MACHINES = ['furnace', 'crusher', 'miner', 'smelt_chamber'];
const ACTIVE_MACHINES = ['power_engine', 'fluid_hub', 'bio_base', 'incubator', 'petri_dish', 'cutter', 'assembler', 'assembler_heavy', 'deconstructor', 'centrifuge', 'extractor', 'mixer'];

// 被动加工器独立状态 (1:1 media_1790616834760.png)
let passiveInputSlot = { item: 'iron_ore', count: 100 };
let passiveOutputSlot = { item: 'iron_ingot', count: 48 };
let currentPassiveBagFilter = 'all';

// 底座 BD_112 灵力引擎外部 3 联装模型插槽状态 (支持手动拆卸与安装插件模型)
let engineChamberSlots = [
  { slotIndex: 0, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #1 (BD_113)', inputItem: 'iron_ingot', outputItem: 'refined_iron_ingot', progress: 68 },
  { slotIndex: 1, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #2 (BD_113)', inputItem: 'copper_ingot', outputItem: 'high_temp_alloy_ingot', progress: 42 },
  { slotIndex: 2, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #3 (BD_113)', inputItem: 'coal', outputItem: 'high_temp_alloy_ingot', progress: 25 }
];
let currentChamberSlotIdx = 0; // 当前监视的冶炼舱插槽
let incubatorTimeAccelerated = false; // 培育仓时间加速器挂载状态 (支持时间加速器挂载)

// 流体处理中枢 BD_132 顶部单设备插槽状态 (单插件复合建筑，顶部只能放一个：搅拌机/离心机/提取器三选一)
let fluidHubSlot = {
  mounted: true,
  childId: 'centrifuge',
  name: '离心机 (BD_106)'
};

// 营养基座 BD_130 顶部单设备插槽状态 (单插件复合底座，顶部只能放一个：培养仓/培养皿二选一)
let bioBaseSlot = {
  mounted: true,
  childId: 'incubator',
  name: '培育仓 (BD_108)'
};

// 映射旧机器 key 到修仙建筑 key
function mapLegacyMachineKey(key) {
  if (key === 'smelter') return 'furnace';
  if (key === 'miner') return 'miner';
  if (key === 'constructor') return 'cutter';
  if (key === 'power_engine' || key === 'engine') return 'power_engine';
  if (key === 'smelt_chamber') return 'smelt_chamber';
  if (key === 'fluid_hub') return 'fluid_hub';
  if (key === 'bio_base') return 'bio_base';
  if (key === 'petri_dish') return 'petri_dish';
  return key || 'furnace';
}

// 打开指定机器专属 HUD
function openMachineHUD(machineKey) {
  playUiSound('click');
  closeOtherModals('machineModal');
  
  const mappedKey = mapLegacyMachineKey(machineKey);
  currentMachineId = mappedKey;
  currentOpenedMachine = mappedKey;

  // 自动同步下拉框
  const selector = document.getElementById('machDeviceSelector');
  if (selector) selector.value = mappedKey;

  const modeBadge = document.getElementById('machModeBadge');
  const tabRecipe = document.getElementById('machTabRecipe');
  const tabProd = document.getElementById('machTabProd');
  const viewProd = document.getElementById('viewMachineProd');
  const viewRecipe = document.getElementById('viewMachineRecipe');
  const viewMiner = document.getElementById('viewMinerProd');
  const viewPassive = document.getElementById('viewPassiveProcessor');
  const viewComposite = document.getElementById('viewCompositeBuilding');

  // 隐藏所有特定子视图
  if (viewProd) viewProd.classList.add('hidden');
  if (viewRecipe) viewRecipe.classList.add('hidden');
  if (viewMiner) viewMiner.classList.add('hidden');
  if (viewPassive) viewPassive.classList.add('hidden');
  if (viewComposite) viewComposite.classList.add('hidden');

  if (PASSIVE_MACHINES.includes(mappedKey)) {
    // ==================== 1. 被动加工器 (免选配方 · 放入什么加工什么) - 1:1 media_1790616834760.png ====================
    if (modeBadge) {
      if (mappedKey === 'smelt_chamber') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(245,146,30,0.3)]';
        modeBadge.innerText = '挂载式被动加工器';
      } else {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/70 text-[#00f0ff] border border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]';
        modeBadge.innerText = '被动加工器';
      }
    }
    if (tabRecipe) tabRecipe.classList.add('hidden');
    if (tabProd) {
      tabProd.classList.remove('hidden');
      tabProd.className = 'flex items-center space-x-2 px-3.5 h-full text-xs font-bold bg-[#122232] text-[#00f0ff] transition cursor-pointer border-t border-l border-r border-[#00f0ff]/40';
      tabProd.innerHTML = '<i class="fa-solid fa-arrows-rotate text-[#00f0ff] text-xs"></i><span>被动加工监视</span>';
    }
    if (viewPassive) viewPassive.classList.remove('hidden');
    renderPassiveProcessorView();
    const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[mappedKey] : null;
    if (mappedKey === 'smelt_chamber') {
      showNotification(`【被动加工器】已连接【BD_113 冶炼舱】(插槽 #${currentChamberSlotIdx + 1}) - 免选配方，放进什么材料加工什么材料！`);
    } else {
      showNotification(`【被动加工器】已连接【${bData ? bData.name : mappedKey}】- 免选配方，放进什么材料加工什么材料！`);
    }
  } else {
    // ==================== 2. 主动加工器 (自选配方流水线 · 包含 BD_112 灵力引擎底座与 BD_108 培育仓) ====================
    if (modeBadge) {
      if (mappedKey === 'power_engine') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(245,146,30,0.3)]';
        modeBadge.innerText = '底座加工器 · 3插件承托';
      } else if (mappedKey === 'fluid_hub') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/70 text-sky-300 border border-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.3)]';
        modeBadge.innerText = '流体中枢 · 单插件复合母座';
      } else if (mappedKey === 'bio_base') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
        modeBadge.innerText = '营养基座 · 单插件复合母座';
      } else if (mappedKey === 'incubator') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
        modeBadge.innerText = '多用处流固培育仓';
      } else if (mappedKey === 'petri_dish') {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950/70 text-teal-300 border border-teal-400/50 shadow-[0_0_8px_rgba(45,212,191,0.3)]';
        modeBadge.innerText = '生物微培 · 培养皿';
      } else {
        modeBadge.className = 'text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/20';
        modeBadge.innerText = '主动加工器';
      }
    }
    if (tabRecipe) tabRecipe.classList.remove('hidden');
    if (tabProd) {
      tabProd.classList.remove('hidden');
      tabProd.innerHTML = '<i class="fa-solid fa-hammer text-[#f5921e] text-xs"></i><span>生产</span>';
    }
    const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[mappedKey] : null;
    if (bData && bData.recipes && bData.recipes.length > 0) {
      if (!bData.recipes.includes(currentMachineRecipeId)) {
        currentMachineRecipeId = bData.recipes[0];
      }
    }
    switchMachineView('prod');
    if (mappedKey === 'power_engine') {
      showNotification('【底座加工器】已连接【灵力引擎 (BD_112)】- 支持顶部3个模型插槽手动拆装与供能供热！');
    } else if (mappedKey === 'fluid_hub') {
      showNotification('【复合母座】已连接【流体处理中枢 (BD_132)】- 顶部单插槽设计，支持搅拌/离心/提取三选一！');
    } else if (mappedKey === 'bio_base') {
      showNotification('【复合母座】已连接【营养基座 (BD_130)】- 顶部单插槽设计，支持培养仓/培养皿二选一，直供高纯流体养分！');
    } else if (mappedKey === 'incubator') {
      showNotification('【多用处培育仓】已连接【培育仓 (BD_108)】- 具备流固混合4大多用途，支持时间加速器挂载！');
    } else if (mappedKey === 'petri_dish') {
      showNotification('【生物微培】已连接【培养皿 (BD_131)】- 精密培育活性菌丝胚与灵草幼胚！');
    } else {
      showNotification(`【主动加工器】已连接设备: ${bData ? bData.name : '修仙设备'} (支持自选配方加工)`);
    }
  }

  document.getElementById('machineModal').classList.remove('hidden');
}

// 关闭机器 HUD
function closeMachineHUD() {
  playUiSound('click');
  document.getElementById('machineModal').classList.add('hidden');
  const swordModal = document.getElementById('swordCasketModal');
  if (swordModal) swordModal.classList.add('hidden');
  const hubModal = document.getElementById('hubMilestoneModal');
  if (hubModal) hubModal.classList.add('hidden');
  currentOpenedMachine = null;
  showNotification('已退出设备监视控制');
}

// 切换机器内部视图：'prod' (生产) 或 'recipe' (选择配方)
function switchMachineView(viewType) {
  playUiSound('click');
  currentMachineView = viewType;

  const tabRecipe = document.getElementById('machTabRecipe');
  const tabProd = document.getElementById('machTabProd');
  const viewProd = document.getElementById('viewMachineProd');
  const viewRecipe = document.getElementById('viewMachineRecipe');
  const viewMiner = document.getElementById('viewMinerProd');

  if (PASSIVE_MACHINES.includes(currentMachineId)) {
    const viewPassive = document.getElementById('viewPassiveProcessor');
    if (viewPassive) viewPassive.classList.remove('hidden');
    if (viewProd) viewProd.classList.add('hidden');
    if (viewRecipe) viewRecipe.classList.add('hidden');
    renderPassiveProcessorView();
    return;
  }

  // 复合建筑本质上也是普通的加工建筑，使用标准生产和选配方视图！
  if (viewType === 'prod') {
    tabProd.className = 'flex items-center space-x-2 px-3.5 h-full text-xs font-bold bg-[#2e3543] text-white transition cursor-pointer border-t border-l border-r border-white/20';
    tabRecipe.className = 'flex items-center space-x-2 px-3.5 h-full text-xs font-bold text-white/60 hover:text-white transition cursor-pointer border-b-2 border-transparent';
    viewProd.classList.remove('hidden');
    viewRecipe.classList.add('hidden');
    renderMachineProdView();
  } else {
    tabRecipe.className = 'flex items-center space-x-2 px-3.5 h-full text-xs font-bold bg-[#2e3543] text-white transition cursor-pointer border-t border-l border-r border-white/20';
    tabProd.className = 'flex items-center space-x-2 px-3.5 h-full text-xs font-bold text-white/60 hover:text-white transition cursor-pointer border-b-2 border-transparent';
    viewProd.classList.add('hidden');
    viewRecipe.classList.remove('hidden');
    selectedRecipeInPicker = currentMachineRecipeId;
    renderRecipePickerView('');
  }
}

// 切换当前建造设备
function switchCurrentMachineDevice(deviceId) {
  playUiSound('toggle');
  openMachineHUD(deviceId);
}

// ==================== 复合母座插槽装配与拆卸交互 (灵力引擎 BD_112 与 冶炼舱 BD_113) ====================
// 玩家在外部手动安装模型
function mountChamberModel(slotIdx) {
  playUiSound('craft');
  engineChamberSlots[slotIdx] = {
    slotIndex: slotIdx,
    mounted: true,
    chamberId: 'smelt_chamber',
    name: `冶炼舱 #${slotIdx + 1} (BD_113)`,
    inputItem: 'iron_ingot',
    outputItem: 'refined_iron_ingot',
    progress: 0
  };
  showNotification(`已成功将【BD_113 冶炼舱】外部模型安装到灵力引擎插槽 #${slotIdx + 1}！`);
  if (typeof renderWorldBuildings === 'function') renderWorldBuildings();
  renderMachineProdView();
}

// 玩家在外部手动拆卸模型
function undockChamberModel(slotIdx) {
  playUiSound('dismantle');
  engineChamberSlots[slotIdx] = {
    slotIndex: slotIdx,
    mounted: false,
    chamberId: null,
    name: `插槽 #${slotIdx + 1} (空置)`,
    inputItem: null,
    outputItem: null,
    progress: 0
  };
  // 拆卸后将冶炼舱返还背包
  const found = backpackInventory.find(b => b.item === 'smelt_chamber');
  if (found) {
    found.count += 1;
  } else {
    backpackInventory.push({ item: 'smelt_chamber', count: 1 });
  }
  showNotification(`已手动拆卸灵力引擎插槽 #${slotIdx + 1} 上的【BD_113 冶炼舱】模型并收入背包！`);
  if (currentMachineId === 'smelt_chamber' && currentChamberSlotIdx === slotIdx) {
    openMachineHUD('power_engine');
  } else {
    renderMachineProdView();
  }
  if (typeof renderWorldBuildings === 'function') renderWorldBuildings();
}

// 点击进入指定插槽上冶炼舱的【被动加工监视】(复用被动加工 UI)
function openPassiveChamberSlot(slotIdx) {
  playUiSound('click');
  currentChamberSlotIdx = slotIdx;
  const slot = engineChamberSlots[slotIdx];
  if (slot && slot.inputItem) {
    passiveInputSlot.item = slot.inputItem;
    passiveInputSlot.count = 50;
  }
  openMachineHUD('smelt_chamber');
}

// 培育仓时间加速器挂载状态切换 (BD_108 特殊规则：支持时间加速器挂载)
function toggleIncubatorTimeAccel() {
  incubatorTimeAccelerated = !incubatorTimeAccelerated;
  playUiSound('toggle');
  if (incubatorTimeAccelerated) {
    showNotification('【培育仓 (BD_108)】已挂载时间加速器！生长节拍提升至 200%（超频运转，周期减半）！');
  } else {
    showNotification('【培育仓 (BD_108)】已卸下时间加速器，恢复标准 100% 节拍。');
  }
  renderMachineProdView();
}

// ==================== 流体处理中枢 BD_132 (单设备复合建筑：顶部只能放一个：搅拌/离心/提取) ====================
function mountFluidHubPlugin(childMachineId) {
  playUiSound('craft');
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[childMachineId]) || { name: childMachineId };
  fluidHubSlot = {
    mounted: true,
    childId: childMachineId,
    name: bData.name
  };
  showNotification(`已成功将【${bData.name}】外部模型安装到【流体处理中枢】顶部单插槽！获得高压流体稳流加成！`);
  renderMachineProdView();
}

function undockFluidHubPlugin() {
  playUiSound('dismantle');
  const oldId = fluidHubSlot.childId;
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[oldId]) || { name: '插件设备' };
  fluidHubSlot = {
    mounted: false,
    childId: null,
    name: '插槽空置'
  };
  showNotification(`已手动拆卸【流体处理中枢】顶部的【${bData.name}】模型并收入背包！`);
  renderMachineProdView();
}

function openFluidHubMountedMachine() {
  if (fluidHubSlot.mounted && fluidHubSlot.childId) {
    playUiSound('click');
    openMachineHUD(fluidHubSlot.childId);
  }
}

// ==================== 营养基座 BD_130 (复合底座：顶部单工位，培养仓/培养皿二选一) ====================
function mountBioBasePlugin(childMachineId) {
  playUiSound('craft');
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[childMachineId]) || { name: childMachineId };
  bioBaseSlot = {
    mounted: true,
    childId: childMachineId,
    name: bData.name
  };
  showNotification(`已成功将【${bData.name}】外部模型安装到【营养基座】顶部单插槽！获得高纯营养液直供增产！`);
  renderMachineProdView();
}

function undockBioBasePlugin() {
  playUiSound('dismantle');
  const oldId = bioBaseSlot.childId;
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[oldId]) || { name: '生物设备' };
  bioBaseSlot = {
    mounted: false,
    childId: null,
    name: '插槽空置'
  };
  showNotification(`已手动拆卸【营养基座】顶部的【${bData.name}】模型并收入背包！`);
  renderMachineProdView();
}

function openBioBaseMountedMachine() {
  if (bioBaseSlot && bioBaseSlot.mounted && bioBaseSlot.childId) {
    playUiSound('click');
    openMachineHUD(bioBaseSlot.childId);
  }
}

// 兼容别名
function mountBioBaseSlot(idx, childId) { mountBioBasePlugin(childId || (idx === 0 ? 'incubator' : 'petri_dish')); }
function undockBioBaseSlot(idx) { undockBioBasePlugin(); }
function openBioBaseMountedMachineSlot(idx) { openBioBaseMountedMachine(); }

// 渲染【生产】(Production) 视图 (动态支持 1进1出、2进1出多进单出、1进2出单进多出及双轨物料校验)
function renderMachineProdView() {
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? (XIUXIAN_BUILDINGS[currentMachineId] || XIUXIAN_BUILDINGS['furnace']) : {};
  const rData = (typeof XIUXIAN_RECIPES !== 'undefined') ? (XIUXIAN_RECIPES[currentMachineRecipeId] || XIUXIAN_RECIPES['rcp_iron_ingot']) : {
    name: '精炼玄铁锭', inputs: [{ item: 'iron_ore', count: 1, rate: 30 }], outputs: [{ item: 'iron_ingot', count: 1, rate: 30 }], timeSec: 2, power: 10
  };

  // 复合建筑与主动加工器面板保持纯净无遮挡 (1:1 对齐用户需求：外部放3个模型并单独点击，内部面板不要大横幅)
  const compBanner = document.getElementById('prodCompositeHeaderBanner');
  if (compBanner) {
    compBanner.classList.add('hidden');
    compBanner.innerHTML = '';
  }

  // 1. 规范化输入物料与产物清单 (完美适配 inputs 数组 与 单一 input/output)
  let inList = [];
  if (Array.isArray(rData.inputs) && rData.inputs.length > 0) {
    inList = rData.inputs.map(x => ({
      item: x.item,
      count: x.count || x.amount || 1,
      rate: x.rate || x.ratePerMin || 30
    }));
  } else if (rData.input) {
    inList = [{
      item: rData.input.item,
      count: rData.input.amount || rData.input.count || 1,
      rate: rData.input.ratePerMin || rData.input.rate || 30
    }];
  }

  let outList = [];
  if (Array.isArray(rData.outputs) && rData.outputs.length > 0) {
    outList = rData.outputs.map(x => ({
      item: x.item,
      count: x.count || x.amount || 1,
      rate: x.rate || x.ratePerMin || 30
    }));
  } else if (rData.output) {
    outList = [{
      item: rData.output.item,
      count: rData.output.amount || rData.output.count || 1,
      rate: rData.output.ratePerMin || rData.output.rate || 30
    }];
  }

  // 2. 顶部配方标题与设备端口逻辑标识 (如 组装机 BD_111 2进1出 · 正面×2 ➔ 背面×1)
  const titleElem = document.getElementById('prodRecipeNameTitle');
  if (titleElem) titleElem.innerText = rData.name;

  const portBadgeElem = document.getElementById('prodMachinePortBadge');
  if (portBadgeElem) {
    const portLogicText = bData.portLogic || `${inList.length}进${outList.length}出`;
    const portDesc = (bData.inputPorts && bData.outputPorts) ? `(${bData.inputPorts} ➔ ${bData.outputPorts})` : '';
    let badgeHtml = `
      <span class="bg-[#171b22] px-2.5 py-0.5 rounded text-amber-400 border border-amber-500/30 font-bold">
        <i class="fa-solid fa-industry text-[10px] mr-1"></i>${bData.code || ''} ${bData.name || '设备'} · ${portLogicText} ${portDesc}
      </span>
    `;
    if (bData.specialRule) {
      badgeHtml += `
        <span class="bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40 font-bold flex items-center space-x-1">
          <i class="fa-solid fa-triangle-exclamation text-[10px]"></i>
          <span>${bData.specialRule}</span>
        </span>
      `;
    }
    portBadgeElem.innerHTML = badgeHtml;
  }

  // 3. 左侧输入物料白卡容器 (支持多进，如 组装机 正面×2 固体 双轨输入)
  const inContainer = document.getElementById('prodInputsContainer');
  if (inContainer) {
    inContainer.innerHTML = '';
    const isMultiIn = inList.length > 1;
    // 布局模式：单进居中卡片，多进并排或垂直
    const rowWrap = document.createElement('div');
    rowWrap.className = isMultiIn 
      ? 'flex items-center justify-center space-x-2.5 w-full flex-wrap gap-y-2' 
      : 'flex items-center justify-center w-full';

    inList.forEach((inp, idx) => {
      const inItemDef = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[inp.item]) || { name: inp.name || inp.item || '原料', icon: 'fa-cube' };
      const card = document.createElement('div');
      // 样式高度适配 1进 vs 2进
      card.className = isMultiIn
        ? 'w-[140px] h-[190px] bg-slate-100 rounded-[4px] p-2.5 text-stone-800 flex flex-col items-center justify-between shadow relative border border-slate-300 group hover:border-[#f5921e] transition shrink-0'
        : 'w-[190px] h-[200px] bg-slate-100 rounded-[4px] p-3 text-stone-800 flex flex-col items-center justify-between shadow relative border border-slate-300 group hover:border-[#f5921e] transition';

      // 端口轨道标签 (如 轨A / 轨B / 正面1)
      const trackLabel = isMultiIn ? `轨${String.fromCharCode(65 + idx)} · 正面${idx + 1}` : (bData.inputPorts || '输入端');

      card.innerHTML = `
        <!-- 轨道/端口标识 -->
        <span class="absolute top-1.5 left-1.5 bg-[#424853] text-[#00f0ff] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
          ${trackLabel}
        </span>
        <!-- 数量角标 (如 1 或 2) -->
        <div class="absolute top-1.5 right-1.5 bg-[#424853] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm font-mono">
          ${inp.count}
        </div>
        <!-- 中央图标 -->
        <div class="flex-1 flex items-center justify-center my-2">
          <i class="${inItemDef.icon || 'fa-solid fa-cube'} ${isMultiIn ? 'text-3xl' : 'text-4xl'} text-stone-700 group-hover:scale-110 transition"></i>
        </div>
        <!-- 底部名称与生产速率 -->
        <div class="w-full text-center">
          <h4 class="text-xs font-black text-stone-900 truncate w-full" title="${inp.count} ${inItemDef.name}">
            ${inp.count} ${inItemDef.name}
          </h4>
          <span class="text-[10px] text-stone-500 font-mono block mt-0.5 font-bold">
            每分钟${inp.rate}
          </span>
        </div>
      `;
      rowWrap.appendChild(card);
    });
    inContainer.appendChild(rowWrap);

    // 如果是组装机双轨校验，附带双轨校验动态指示条
    if (bData.specialRule && isMultiIn) {
      const ruleTag = document.createElement('div');
      ruleTag.className = 'text-[9px] font-mono text-cyan-300 bg-[#121d28] px-2 py-0.5 rounded border border-cyan-500/30 flex items-center space-x-1.5 mt-1';
      ruleTag.innerHTML = '<i class="fa-solid fa-arrows-split-up-and-left text-[9px] text-[#00f0ff]"></i><span>双轨物料并行校验中</span>';
      inContainer.appendChild(ruleTag);
    }
  }

  // 4. 中间工业控制立柱
  const statusBox = document.getElementById('prodMachineStatusBox');
  const statusSub = document.getElementById('prodMachineStatusSub');
  if (!isMachinePowerOn) {
    if (statusBox) {
      statusBox.className = 'w-full py-3 bg-[#475569] text-white font-black text-xs rounded text-center shadow';
      statusBox.innerText = '待机停机';
    }
    if (statusSub) statusSub.innerText = '已断电';
  } else {
    if (statusBox) {
      statusBox.className = 'w-full py-3 bg-[#e0770b] text-black font-black text-xs rounded text-center shadow';
      statusBox.innerText = '缺少供电';
    }
    if (statusSub) statusSub.innerText = '空闲';
  }
  const powerText = document.getElementById('prodMachinePowerText');
  let currentPower = rData.power || bData.power || 10;
  let currentCycle = rData.timeSec || 2;
  if (currentMachineId === 'incubator' && incubatorTimeAccelerated) {
    currentPower = currentPower * 2;
    currentCycle = Math.max(1, Math.round(currentCycle / 2));
  }
  if (powerText) powerText.innerText = `${currentPower} MW`;
  const cycleText = document.getElementById('prodMachineCycleText');
  if (cycleText) cycleText.innerText = `${currentCycle}秒${incubatorTimeAccelerated && currentMachineId === 'incubator' ? ' (⚡加速)' : ''}`;

  // 5. 右侧输出物料白卡容器 (支持多出，如 解构机 背面×2、离心机 左×1右×1)
  const outContainer = document.getElementById('prodOutputsContainer');
  if (outContainer) {
    outContainer.innerHTML = '';
    const isMultiOut = outList.length > 1;
    const rowWrap = document.createElement('div');
    rowWrap.className = isMultiOut 
      ? 'flex items-center justify-center space-x-2.5 w-full flex-wrap gap-y-2' 
      : 'flex items-center justify-center w-full';

    outList.forEach((outp, idx) => {
      const outItemDef = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[outp.item]) || { name: outp.name || outp.item || '产物', icon: 'fa-cube' };
      const card = document.createElement('div');
      card.className = isMultiOut
        ? 'w-[140px] h-[190px] bg-slate-100 rounded-[4px] p-2.5 text-stone-800 flex flex-col items-center justify-between shadow relative border border-slate-300 group hover:border-[#f5921e] transition shrink-0'
        : 'w-[190px] h-[200px] bg-slate-100 rounded-[4px] p-3 text-stone-800 flex flex-col items-center justify-between shadow relative border border-slate-300 group hover:border-[#f5921e] transition';

      const portLabel = isMultiOut ? `出${idx + 1} · 背面` : (bData.outputPorts || '输出端');
      const finalRate = (currentMachineId === 'incubator' && incubatorTimeAccelerated) ? (outp.rate * 2) : outp.rate;

      card.innerHTML = `
        <!-- 输出端口标识 -->
        <span class="absolute top-1.5 left-1.5 bg-[#424853] text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm">
          ${portLabel}
        </span>
        <!-- 数量角标 -->
        <div class="absolute top-1.5 right-1.5 bg-[#424853] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm font-mono">
          ${outp.count}
        </div>
        <!-- 中央图标 -->
        <div class="flex-1 flex items-center justify-center my-2">
          <i class="${outItemDef.icon || 'fa-solid fa-cube'} ${isMultiOut ? 'text-3xl' : 'text-4xl'} text-stone-700 group-hover:scale-110 transition"></i>
        </div>
        <!-- 底部名称与产出速率 -->
        <div class="w-full text-center">
          <h4 class="text-xs font-black text-stone-900 truncate w-full" title="${outp.count} ${outItemDef.name}">
            ${outp.count} ${outItemDef.name}
          </h4>
          <span class="text-[10px] text-stone-500 font-mono block mt-0.5 font-bold">
            每分钟${finalRate}
          </span>
        </div>
      `;
      rowWrap.appendChild(card);
    });
    outContainer.appendChild(rowWrap);
  }

  // 6. 机械舱门与发光散热栅栏
  const grilleLeft = document.getElementById('prodHeatGrilleLeft');
  const grilleRight = document.getElementById('prodHeatGrilleRight');
  if (bData && bData.hasHeatGlow) {
    if (grilleLeft) grilleLeft.style.display = 'flex';
    if (grilleRight) grilleRight.style.display = 'flex';
  } else {
    if (grilleLeft) grilleLeft.style.display = 'none';
    if (grilleRight) grilleRight.style.display = 'none';
  }

  // 7. 翘板电源开关状态
  const rockerLight = document.getElementById('prodRockerLight');
  const rockerText = document.getElementById('prodRockerText');
  if (isMachinePowerOn) {
    if (rockerLight) rockerLight.className = 'w-3.5 h-5 bg-red-600 rounded-xs shadow-[0_0_8px_#ef4444]';
    if (rockerText) rockerText.innerText = '待机';
  } else {
    if (rockerLight) rockerLight.className = 'w-3.5 h-5 bg-stone-600 rounded-xs';
    if (rockerText) rockerText.innerText = '已停机';
  }

  // 8. 渲染右侧关联物品与背包所有物品
  renderBackpackAndRelatedItems(rData);
}

// 渲染右侧随身背包与关联物品
function renderBackpackAndRelatedItems(rData) {
  const relatedContainer = document.getElementById('prodRelatedItems');
  if (!relatedContainer) return;
  relatedContainer.innerHTML = '';

  const inList = Array.isArray(rData.inputs) ? rData.inputs : (rData.input ? [rData.input] : []);
  const outList = Array.isArray(rData.outputs) ? rData.outputs : (rData.output ? [rData.output] : []);
  const neededCodes = Array.from(new Set([...inList.map(x => x.item), ...outList.map(x => x.item)].filter(Boolean)));

  neededCodes.forEach(code => {
    const itemDef = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[code] : null;
    if (!itemDef) return;
    const found = backpackInventory.find(b => b.item === code);
    const count = found ? found.count : 0;

    const card = document.createElement('div');
    card.className = 'flex flex-col items-center bg-[#252b36] border border-white/25 rounded p-1.5 min-w-[56px] relative group hover:border-[#f5921e] cursor-pointer';
    card.title = `${itemDef.name}: 当前随身持有 ${count}`;
    card.onclick = () => {
      playUiSound('click');
      showNotification(`快捷存取: ${itemDef.name} (持有: ${count})`);
    };
    card.innerHTML = `
      <div class="w-8 h-8 flex items-center justify-center">
        <i class="${itemDef.icon} text-lg"></i>
      </div>
      <span class="text-[10px] font-mono font-bold text-amber-400 mt-1">${count}</span>
    `;
    relatedContainer.appendChild(card);
  });

  // 所有物品网格 (6 列标准工业背包网格)
  const allGrid = document.getElementById('prodAllInventoryGrid');
  if (!allGrid) return;
  allGrid.innerHTML = '';
  
  const totalSlots = 24; // 6 x 4 = 24 格
  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    if (i < backpackInventory.length && backpackInventory[i]) {
      const invItem = backpackInventory[i];
      const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[invItem.item] : null;
      slot.className = 'w-10 h-10 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#f5921e] rounded flex items-center justify-center relative cursor-pointer group transition';
      slot.title = `${def ? def.name : invItem.item}: ${invItem.count}`;
      slot.onclick = () => {
        playUiSound('click');
        showNotification(`已选中物料: ${def ? def.name : invItem.item} x${invItem.count}`);
      };
      slot.innerHTML = `
        <i class="${def ? def.icon : 'fa-cube'} text-sm text-stone-300 group-hover:scale-110 transition"></i>
        <span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-amber-300">${invItem.count}</span>
      `;
    } else {
      slot.className = 'w-10 h-10 bg-black/30 border border-white/5 rounded flex items-center justify-center';
    }
    allGrid.appendChild(slot);
  }
}

// =========================================================================
// 1. 被动加工器 (Passive Processors) 专属处理管线 (1:1 还原 media_1790616834760.png)
// 核心机制：免选手工配方，放进什么材料 ➔ 自动识别加工出对应产物！
// =========================================================================

function renderPassiveProcessorView() {
  const title = document.getElementById('passiveMachineTitle');
  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[currentMachineId] : null;
  const bName = bData ? bData.name : '精炼炉';
  const bCode = bData ? bData.code : 'BD_102';

  const backToBaseBtn = document.getElementById('passiveBackToBaseBtn');

  if (currentMachineId === 'smelt_chamber') {
    if (title) title.innerText = `冶炼舱 #${currentChamberSlotIdx + 1} (BD_113) · 挂载式被动加工器`;
    if (backToBaseBtn) backToBaseBtn.classList.remove('hidden');
    const ruleNote = document.getElementById('passiveRuleNote');
    if (ruleNote) ruleNote.innerText = '底座汲热冶炼 · 放入金属材料自动识别转化';
  } else {
    if (title) title.innerText = `${bName} (${bCode}) · 被动加工器`;
    if (backToBaseBtn) backToBaseBtn.classList.add('hidden');
    const ruleNote = document.getElementById('passiveRuleNote');
    if (ruleNote) ruleNote.innerText = '放进什么材料 ➔ 自动加工什么材料';
  }

  // 1. IN 插槽
  const inIcon = document.getElementById('passiveInIcon');
  const inName = document.getElementById('passiveInName');
  const inCount = document.getElementById('passiveInCount');

  // 根据当前设备确定默认或当前输入
  if (currentMachineId === 'miner') {
    // 采矿机无需原料放入，直接持续开采地表矿脉
    const ruleNote = document.getElementById('passiveRuleNote');
    if (ruleNote) ruleNote.innerText = '自动化开采玄铁矿脉 ➔ 持续产出';
    if (inIcon) inIcon.className = 'fa-solid fa-mountain text-stone-300 text-3xl mb-1';
    if (inName) inName.innerText = '玄铁矿脉';
    if (inCount) inCount.innerText = '富矿 (100%)';
  } else {
    const defaultItemName = (currentMachineId === 'smelt_chamber') ? '玄铁锭' : '玄铁矿';
    const inDef = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[passiveInputSlot.item]) || { name: defaultItemName, icon: 'fa-gem' };
    if (passiveInputSlot.count > 0) {
      if (inIcon) inIcon.className = (inDef.icon || 'fa-solid fa-cube') + ' text-3xl mb-1 text-amber-400 drop-shadow';
      if (inName) inName.innerText = inDef.name;
      if (inCount) inCount.innerText = `x${passiveInputSlot.count}`;
    } else {
      if (inIcon) inIcon.className = 'fa-solid fa-plus text-cyan-400/50 text-2xl mb-1';
      if (inName) inName.innerText = (currentMachineId === 'smelt_chamber') ? '投入金属' : '原料空';
      if (inCount) inCount.innerText = '点击右侧放入';
    }
  }

  // 2. 自动转换映射判定 (核心：放进什么材料，他就加工什么材料)
  let outItemCode = 'iron_ingot';
  let mappingDesc = '放啥加工啥';
  let cycleDuration = 2.0;

  if (currentMachineId === 'smelt_chamber') {
    // BD_113 冶炼舱挂载式被动加工逻辑：底座汲热，高级合金熔炼
    if (passiveInputSlot.item === 'copper_ingot' || passiveInputSlot.item === 'copper_ore') {
      outItemCode = 'high_temp_alloy_ingot';
      mappingDesc = '高温冶炼: 赤铜 ➔ 高温合金锭';
      cycleDuration = 3.0;
    } else if (passiveInputSlot.item === 'sha_crystal') {
      outItemCode = 'daomai_alloy';
      mappingDesc = '高温冶炼: 煞气结晶 ➔ 导脉合金';
      cycleDuration = 4.0;
    } else if (passiveInputSlot.item === 'iron_ingot') {
      outItemCode = 'refined_iron_ingot';
      mappingDesc = '高温冶炼: 玄铁锭 ➔ 精炼玄铁锭';
      cycleDuration = 2.5;
    } else if (passiveInputSlot.item === 'iron_ore') {
      outItemCode = 'iron_ingot';
      mappingDesc = '初级冶炼: 玄铁矿 ➔ 玄铁锭';
      cycleDuration = 2.0;
    } else if (passiveInputSlot.item === 'coal') {
      outItemCode = 'high_temp_alloy_ingot';
      mappingDesc = '高温冶炼: 煤炭碳化 ➔ 高温合金锭';
      cycleDuration = 3.0;
    } else {
      outItemCode = 'refined_iron_ingot';
      mappingDesc = '高温冶炼: 金属提纯 ➔ 精炼玄铁锭';
      cycleDuration = 2.5;
    }
  } else if (currentMachineId === 'furnace') {
    if (passiveInputSlot.item === 'copper_ore') {
      outItemCode = 'copper_ingot';
      mappingDesc = '智能识别: 赤铜矿 ➔ 赤铜锭';
    } else if (passiveInputSlot.item === 'iron_ingot') {
      outItemCode = 'refined_iron_ingot';
      mappingDesc = '智能识别: 玄铁锭 ➔ 精炼玄铁锭';
    } else {
      outItemCode = 'iron_ingot';
      mappingDesc = '智能识别: 玄铁矿 ➔ 玄铁锭';
    }
    cycleDuration = 2.0;
  } else if (currentMachineId === 'crusher') {
    if (passiveInputSlot.item === 'coal') {
      outItemCode = 'waste_purify_powder';
      mappingDesc = '智能识别: 煤炭 ➔ 净化粉';
    } else {
      outItemCode = 'iron_powder';
      mappingDesc = '智能识别: 玄铁锭 ➔ 玄铁粉';
    }
    cycleDuration = 1.5;
  } else if (currentMachineId === 'miner') {
    outItemCode = 'iron_ore';
    mappingDesc = '开采: 地脉玄铁矿 ➔ 120/分';
    cycleDuration = 0.5;
  }

  const mappingTextElem = document.getElementById('passiveDetectedMappingText');
  if (mappingTextElem) mappingTextElem.innerText = mappingDesc;

  const cycleTextElem = document.getElementById('passiveCycleText');
  if (cycleTextElem) cycleTextElem.innerText = `⚡ ${cycleDuration}s / 加工周期`;

  // 3. OUT 插槽
  const outDef = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[outItemCode]) || { name: '产物', icon: 'fa-cube' };
  const outIcon = document.getElementById('passiveOutIcon');
  const outName = document.getElementById('passiveOutName');
  const outCount = document.getElementById('passiveOutCount');

  if (outIcon) outIcon.className = (outDef.icon || 'fa-solid fa-cube') + ' text-3xl mb-1 text-slate-100 drop-shadow';
  if (outName) outName.innerText = outDef.name;
  if (outCount) outCount.innerText = `x${passiveOutputSlot.count}`;

  // 4. 遥测仪表 (⚡ 供电负荷 998 +10 / 1130 & 热力工况 300 +10 / 430 ☼)
  const powerText = document.getElementById('passivePowerText');
  if (powerText) {
    powerText.innerText = isMachinePowerOn ? '⚡ 998 +10 / 1130 MW' : '⚡ 0 / 1130 MW (断电)';
  }
  const thermalText = document.getElementById('passiveThermalText');
  if (thermalText) {
    thermalText.innerText = isMachinePowerOn ? '300 +10 / 430 ☼ ℃' : '25 ℃ (冷态)';
  }

  // 5. 电源按键
  const powerBtn = document.getElementById('passivePowerBtn');
  const powerBtnText = document.getElementById('passivePowerBtnText');
  if (powerBtn && powerBtnText) {
    if (isMachinePowerOn) {
      powerBtn.className = 'px-5 py-1.5 bg-[#091a26] hover:bg-[#0c2333] border-2 border-[#00f0ff] rounded-md text-xs font-black font-mono text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition cursor-pointer flex items-center space-x-1.5';
      powerBtnText.innerText = 'ON';
    } else {
      powerBtn.className = 'px-5 py-1.5 bg-black/60 hover:bg-black/80 border-2 border-stone-500 rounded-md text-xs font-black font-mono text-stone-400 active:scale-95 transition cursor-pointer flex items-center space-x-1.5';
      powerBtnText.innerText = 'OFF';
    }
  }

  // 6. 渲染 72 格 BAG
  renderPassive72BagGrid();
}

// 渲染 72 格 BAG (8列 × 9行，前32格已开辟，后40格红 X 锁定)
function renderPassive72BagGrid() {
  const container = document.getElementById('passiveBag72Grid');
  if (!container) return;
  container.innerHTML = '';

  const totalSlots = 72;
  const activeSlots = 32;

  // 根据当前标签过滤
  let filteredItems = backpackInventory || [];
  if (currentPassiveBagFilter === 'Building') {
    filteredItems = filteredItems.filter(b => ['iron_plate', 'iron_rod', 'concrete', 'iron_beam', 'power_pole', 'biomass_burner', 'furnace', 'cutter', 'miner'].includes(b.item));
  } else if (currentPassiveBagFilter === 'Materials') {
    filteredItems = filteredItems.filter(b => ['iron_ore', 'copper_ore', 'coal', 'iron_ingot', 'copper_ingot', 'refined_iron_ingot', 'high_temp_alloy_ingot', 'daomai_alloy', 'iron_powder', 'copper_wire'].includes(b.item));
  } else if (currentPassiveBagFilter === 'Equipment') {
    filteredItems = filteredItems.filter(b => ['sword_casket', 'compass', 'build_gun', 'portable_miner'].includes(b.item));
  } else if (currentPassiveBagFilter === 'Other') {
    filteredItems = filteredItems.filter(b => ['bio_chip', 'fabao_array_embryo', 'daomai_sheet', 'sha_crystal'].includes(b.item));
  }

  for (let i = 0; i < totalSlots; i++) {
    const slot = document.createElement('div');
    if (i < activeSlots) {
      // 开放的 32 个槽位
      if (i < filteredItems.length && filteredItems[i]) {
        const itemObj = filteredItems[i];
        const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[itemObj.item] : null;
        slot.className = 'w-10 h-10 bg-[#101722] hover:bg-[#1a2536] border border-cyan-500/30 hover:border-[#00f0ff] rounded flex items-center justify-center relative cursor-pointer group shadow transition';
        slot.title = `【${def ? def.name : itemObj.item}】x${itemObj.count}\n• 点击立即放入被动加工器 [IN] 槽位！`;
        slot.onclick = () => depositItemIntoPassiveInput(itemObj);
        slot.innerHTML = `
          <i class="${def ? def.icon : 'fa-solid fa-cube'} text-stone-200 text-sm group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-cyan-300 drop-shadow">${itemObj.count}</span>
        `;
      } else {
        slot.className = 'w-10 h-10 bg-[#070d16] border border-white/10 rounded flex items-center justify-center text-[10px] text-white/10';
        slot.innerHTML = '<span class="text-[8px] font-mono text-white/15">·</span>';
      }
    } else {
      // 后 40 个锁定槽位 (带 X 标志，1:1 还原截图)
      slot.className = 'w-10 h-10 bg-[#060a12] border border-red-500/10 rounded flex items-center justify-center text-red-500/30 font-bold select-none cursor-not-allowed';
      slot.title = '【天雷封禁槽位】需前往随身背包通过【天雷淬体】解除封印！';
      slot.onclick = () => showNotification('此槽位受经脉封禁锁定，可在角色背包按 [Tab] 点击【天雷淬体】解锁！');
      slot.innerHTML = '<i class="fa-solid fa-xmark text-xs opacity-40"></i>';
    }
    container.appendChild(slot);
  }
}

// 切换被动加工器背包过滤标签
function filterPassiveBagTab(tabKey) {
  playUiSound('click');
  currentPassiveBagFilter = tabKey;
  const tabs = ['all', 'Building', 'Materials', 'Equipment', 'Other'];
  tabs.forEach(t => {
    const btn = document.getElementById(`pbagTab_${t}`);
    if (btn) {
      if (t === tabKey) {
        btn.className = 'px-2.5 py-1 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50 transition cursor-pointer';
      } else {
        btn.className = 'px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer';
      }
    }
  });
  renderPassive72BagGrid();
}

// 点击投入原料到被动加工器 [IN]
function depositItemIntoPassiveInput(itemObj) {
  playUiSound('click');
  const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[itemObj.item] : null;
  const depositAmount = Math.min(itemObj.count, 50);
  passiveInputSlot = {
    item: itemObj.item,
    count: (passiveInputSlot.item === itemObj.item ? passiveInputSlot.count : 0) + depositAmount
  };
  itemObj.count -= depositAmount;
  if (itemObj.count <= 0) {
    const idx = backpackInventory.indexOf(itemObj);
    if (idx !== -1) backpackInventory.splice(idx, 1);
  }
  showNotification(`【被动加工器】已投入原料【${def ? def.name : itemObj.item}】x${depositAmount}，智能识别自动加工中！`);
  renderPassiveProcessorView();
}

// 点击 IN 插槽快速投料
function triggerPassiveInputSlotClick() {
  playUiSound('click');
  const found = backpackInventory.find(b => ['iron_ore', 'copper_ore', 'iron_ingot', 'coal'].includes(b.item));
  if (found) {
    depositItemIntoPassiveInput(found);
  } else {
    showNotification('背包中暂无适配加工的矿石或金属锭，请先开采或放入！');
  }
}

// 提取被动加工产物
function collectPassiveOutput() {
  if (!passiveOutputSlot || passiveOutputSlot.count <= 0) {
    showNotification('当前成品产出槽为空');
    return;
  }
  playUiSound('craft_success');
  const count = passiveOutputSlot.count;
  let itemCode = 'iron_ingot';
  if (currentMachineId === 'smelt_chamber') {
    if (passiveInputSlot.item === 'copper_ingot' || passiveInputSlot.item === 'copper_ore') {
      itemCode = 'high_temp_alloy_ingot';
    } else if (passiveInputSlot.item === 'sha_crystal') {
      itemCode = 'daomai_alloy';
    } else if (passiveInputSlot.item === 'iron_ingot') {
      itemCode = 'refined_iron_ingot';
    } else if (passiveInputSlot.item === 'iron_ore') {
      itemCode = 'iron_ingot';
    } else if (passiveInputSlot.item === 'coal') {
      itemCode = 'high_temp_alloy_ingot';
    } else {
      itemCode = 'refined_iron_ingot';
    }
  } else if (currentMachineId === 'furnace') {
    itemCode = (passiveInputSlot.item === 'copper_ore') ? 'copper_ingot' : (passiveInputSlot.item === 'iron_ingot' ? 'refined_iron_ingot' : 'iron_ingot');
  } else if (currentMachineId === 'crusher') {
    itemCode = (passiveInputSlot.item === 'coal') ? 'waste_purify_powder' : 'iron_powder';
  } else if (currentMachineId === 'miner') {
    itemCode = 'iron_ore';
  }

  const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[itemCode] : null;
  const found = backpackInventory.find(b => b.item === itemCode);
  if (found) {
    found.count += count;
  } else {
    backpackInventory.push({ item: itemCode, count: count });
  }
  showNotification(`【产物提取】已提取【${def ? def.name : itemCode}】x${count} 存入随身背包！`);
  passiveOutputSlot.count = 0;
  renderPassiveProcessorView();
}

// 被动背包操作动作
function triggerPassiveBagUse() {
  playUiSound('click');
  showNotification('【道具使用】已就绪，已为当前开拓者补充灵力与机能');
}
function triggerPassiveBagSplit() {
  playUiSound('toggle');
  showNotification('【拆分】已拆分当前选定物料堆叠为半组');
}

// =========================================================================
// 2. 复合建筑系统 (Composite Building System) 专属处理管线
// 严格对齐 配置.txt：BD_112 灵力引擎 (母机 · 顶部×3插槽) & BD_113 冶炼舱 (插件式)
// =========================================================================

function renderCompositeBuildingView() {
  const occupiedText = document.getElementById('compositeSocketOccupiedText');
  const dockedCount = compositeSockets.filter(s => s.docked).length;
  if (occupiedText) occupiedText.innerText = `${dockedCount} / 3 已挂载`;

  const container = document.getElementById('compositeSocketsContainer');
  if (!container) return;
  container.innerHTML = '';

  compositeSockets.forEach((sock, idx) => {
    const card = document.createElement('div');
    if (sock.docked) {
      card.className = 'p-3.5 bg-[#0b1522] border-2 border-cyan-500/50 rounded-lg flex items-center justify-between shadow-[0_4px_15px_rgba(0,240,255,0.15)]';
      const rDef = (typeof XIUXIAN_RECIPES !== 'undefined') ? XIUXIAN_RECIPES[sock.recipeId] : null;
      const rName = rDef ? rDef.name : '精炼玄铁锭';
      card.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded bg-cyan-950/80 border border-cyan-400/80 flex items-center justify-center text-cyan-300 text-xl shadow-[0_0_10px_#00f0ff]">
            <i class="fa-solid fa-cubes-stacked"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white font-sans">${sock.name}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">● 运行中</span>
              <span class="text-[9px] font-mono text-cyan-300/80">插槽 #${idx + 1} (1x2)</span>
            </div>
            <div class="text-[11px] text-amber-300 font-mono mt-0.5">
              高温冶炼: ${rName} (供热 150℃ / 35MW)
            </div>
            <div class="w-44 h-1.5 bg-black/60 rounded-full mt-1.5 overflow-hidden border border-cyan-500/30">
              <div class="h-full bg-gradient-to-r from-cyan-400 to-amber-400" style="width: ${sock.progress}%;"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="collectCompositeSocketOutput(${idx});" class="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded text-xs font-bold text-amber-300 transition cursor-pointer">
            提取 (+${sock.bufferOut})
          </button>
          <button onclick="undockModuleFromSocket(${idx});" class="px-2.5 py-1.5 bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/50 rounded text-xs text-white/60 hover:text-rose-300 transition cursor-pointer" title="卸载插槽模块并放入背包">
            卸载
          </button>
        </div>
      `;
    } else {
      card.className = 'p-3.5 bg-[#060a12] border-2 border-dashed border-cyan-500/30 rounded-lg flex items-center justify-between';
      card.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 rounded bg-black/50 border border-white/10 flex items-center justify-center text-white/30 text-lg">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-white/50 font-sans">顶部插槽 #${idx + 1} (1x2)</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-white/40">空置</span>
            </div>
            <div class="text-[10px] text-white/40 font-mono mt-0.5">
              支持挂载【冶炼舱 (BD_113)】，汲取引擎热量
            </div>
          </div>
        </div>
        <button onclick="dockModuleToSocket(${idx});" class="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded transition shadow cursor-pointer">
          ➕ 插装 冶炼舱 (BD_113)
        </button>
      `;
    }
    container.appendChild(card);
  });
}

// 插装冶炼舱到插槽
function dockModuleToSocket(socketIdx) {
  playUiSound('craft_success');
  compositeSockets[socketIdx] = {
    docked: true,
    childId: 'BD_113',
    name: `冶炼舱 #${socketIdx + 1} (BD_113)`,
    recipeId: socketIdx === 2 ? 'rcp_daomai_alloy' : 'rcp_refined_iron_ingot',
    progress: 10,
    bufferOut: 5
  };
  showNotification(`【复合建筑插装】已将【冶炼舱 (BD_113)】插装在灵力引擎顶部插槽 #${socketIdx + 1}！已连通 150℃ 热能！`);
  renderCompositeBuildingView();
}

// 卸载插槽模块
function undockModuleFromSocket(socketIdx) {
  playUiSound('toggle');
  compositeSockets[socketIdx] = {
    docked: false,
    childId: null,
    name: `空置插槽 #${socketIdx + 1} (1x2)`,
    recipeId: null,
    progress: 0,
    bufferOut: 0
  };
  showNotification(`【复合建筑卸载】已从灵力引擎插槽 #${socketIdx + 1} 卸下【冶炼舱 (BD_113)】存入背包！`);
  renderCompositeBuildingView();
}

// 提取插槽产物
function collectCompositeSocketOutput(socketIdx) {
  const sock = compositeSockets[socketIdx];
  if (!sock || !sock.docked || sock.bufferOut <= 0) {
    showNotification('当前插槽暂无产物');
    return;
  }
  playUiSound('craft_success');
  const count = sock.bufferOut;
  const itemCode = sock.recipeId === 'rcp_daomai_alloy' ? 'daomai_alloy' : (sock.recipeId === 'rcp_high_temp_alloy_ingot' ? 'high_temp_alloy_ingot' : 'refined_iron_ingot');
  const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[itemCode] : null;

  const found = backpackInventory.find(b => b.item === itemCode);
  if (found) {
    found.count += count;
  } else {
    backpackInventory.push({ item: itemCode, count: count });
  }
  sock.bufferOut = 0;
  showNotification(`【复合冶炼产出】已提取【${def ? def.name : itemCode}】x${count} 存入随身背包！`);
  renderCompositeBuildingView();
}

// 触发复合配方冶炼
function craftCompositeRecipe(recipeId) {
  playUiSound('craft_success');
  const r = (typeof XIUXIAN_RECIPES !== 'undefined') ? XIUXIAN_RECIPES[recipeId] : null;
  const rName = r ? r.name : recipeId;
  
  // 查找一个已停靠的冶炼舱
  const targetSock = compositeSockets.find(s => s.docked);
  if (!targetSock) {
    showNotification('⚠️ 复合建筑提示：当前灵力引擎插槽未挂载冶炼舱，无法执行高温冶炼！');
    return;
  }
  targetSock.recipeId = recipeId;
  targetSock.progress = 10;
  targetSock.bufferOut += 1;
  showNotification(`【复合冶炼启动】已在挂载冶炼舱载入配方【${rName}】，汲取引擎热力冶炼中！`);
  renderCompositeBuildingView();
}

// 自动周期心跳 (被动加工器持续自动转化 + 采矿机持续开采 + 复合建筑插槽生产)
setInterval(() => {
  if (!isMachinePowerOn) return;

  // 1. 被动加工器持续转化
  if (PASSIVE_MACHINES.includes(currentMachineId)) {
    if (currentMachineId === 'miner') {
      passiveOutputSlot.count = (passiveOutputSlot.count || 0) + 1;
      const outCountElem = document.getElementById('passiveOutCount');
      if (outCountElem) outCountElem.innerText = `x${passiveOutputSlot.count}`;
    } else if (passiveInputSlot.count > 0) {
      passiveInputSlot.count -= 1;
      passiveOutputSlot.count = (passiveOutputSlot.count || 0) + 1;
      const inCountElem = document.getElementById('passiveInCount');
      const outCountElem = document.getElementById('passiveOutCount');
      if (inCountElem) inCountElem.innerText = `x${passiveInputSlot.count}`;
      if (outCountElem) outCountElem.innerText = `x${passiveOutputSlot.count}`;
    }
  }

  // 2. 复合建筑插槽生产推进
  compositeSockets.forEach(sock => {
    if (sock.docked) {
      sock.progress = (sock.progress + 15) % 100;
      if (sock.progress < 15) {
        sock.bufferOut += 1;
      }
    }
  });

  const compView = document.getElementById('viewCompositeBuilding');
  if (compView && !compView.classList.contains('hidden')) {
    renderCompositeBuildingView();
  }
}, 2500);

// =========================================================================
// 采矿机 (BD_101) 专属视图渲染管线 (1:1 还原用户上传 Image 2: media_1790464114188.png)
// =========================================================================

let minerBufferSlots = [
  { item: 'iron_ore', name: '玄铁原矿', count: 100, icon: 'fa-solid fa-mountain text-stone-300', matId: 'MAT_001' },
  { item: 'iron_ore', name: '玄铁原矿', count: 100, icon: 'fa-solid fa-mountain text-stone-300', matId: 'MAT_001' },
  { item: 'iron_ore', name: '玄铁原矿', count: 27, icon: 'fa-solid fa-mountain text-stone-300', matId: 'MAT_001' }
];

function renderMinerProdView() {
  // 1. 顶部关联物品 3 槽 (1:1 还原 Image 2: 100, 100, 27)
  const relGrid = document.getElementById('minerRelatedItemsGrid');
  if (relGrid) {
    relGrid.innerHTML = '';
    minerBufferSlots.forEach((slotData, idx) => {
      const card = document.createElement('div');
      if (slotData) {
        card.className = 'w-16 h-16 bg-white/10 hover:bg-white/20 border-2 border-stone-400 hover:border-[#f5921e] rounded-md flex flex-col items-center justify-center relative cursor-pointer group shadow transition';
        card.title = `【开采产物】${slotData.name} (${slotData.matId || ''}) x${slotData.count}\n• 点击立即提取放入随身背包！`;
        card.onclick = () => collectMinerBufferOre(idx);
        card.innerHTML = `
          <i class="${slotData.icon || 'fa-solid fa-mountain text-stone-300'} text-2xl group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-amber-300 bg-black/70 px-1 rounded">${slotData.count}</span>
        `;
      } else {
        card.className = 'w-16 h-16 bg-black/40 border border-white/10 rounded-md flex items-center justify-center text-[10px] text-white/30 font-mono';
        card.innerText = '空';
      }
      relGrid.appendChild(card);
    });
  }

  // 2. 所有物品背包 (6 列网格，严格使用修仙工厂官方策划表物料)
  const allGrid = document.getElementById('minerPlayerInventoryGrid');
  if (allGrid) {
    allGrid.innerHTML = '';
    const totalSlots = 24;
    for (let i = 0; i < totalSlots; i++) {
      const slot = document.createElement('div');
      if (i < backpackInventory.length && backpackInventory[i]) {
        const invItem = backpackInventory[i];
        const def = (typeof XIUXIAN_ITEMS !== 'undefined') ? XIUXIAN_ITEMS[invItem.item] : null;
        slot.className = 'w-10 h-10 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#f5921e] rounded flex items-center justify-center relative cursor-pointer group transition';
        slot.title = `${def ? def.name : invItem.item}: ${invItem.count}`;
        slot.onclick = () => {
          playUiSound('click');
          showNotification(`已选中背包物料: ${def ? def.name : invItem.item} x${invItem.count}`);
        };
        slot.innerHTML = `
          <i class="${def ? def.icon : 'fa-cube'} text-sm text-stone-300 group-hover:scale-110 transition"></i>
          <span class="absolute bottom-0.5 right-1 text-[8px] font-mono font-bold text-amber-300">${invItem.count}</span>
        `;
      } else {
        slot.className = 'w-10 h-10 bg-black/30 border border-white/5 rounded flex items-center justify-center';
      }
      allGrid.appendChild(slot);
    }
  }
}

function collectMinerBufferOre(idx) {
  const ore = minerBufferSlots[idx];
  if (!ore) return;
  playUiSound('click');
  showNotification(`【采矿收取】已从采矿机提取【${ore.name}】x${ore.count} 存入随身背包！`);
  minerBufferSlots[idx] = null;
  renderMinerProdView();
  // 模拟开采循环重新填补
  setTimeout(() => {
    minerBufferSlots[idx] = { item: 'iron_ore', name: '玄铁原矿', count: 100, icon: 'fa-solid fa-mountain text-stone-300', matId: 'MAT_001' };
    if (currentMachineId === 'miner') renderMinerProdView();
  }, 4000);
}

// 渲染【选择配方】(Recipe Select) 视图
function renderRecipePickerView(searchQuery) {
  searchQuery = (searchQuery || '').toLowerCase().trim();
  const container = document.getElementById('machRecipeTreeContainer');
  if (!container) return;
  container.innerHTML = '';

  const bData = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? (XIUXIAN_BUILDINGS[currentMachineId] || XIUXIAN_BUILDINGS['furnace']) : {};
  const supportedRecipeIds = bData.recipes || (typeof XIUXIAN_RECIPES !== 'undefined' ? Object.keys(XIUXIAN_RECIPES) : []);

  const categorized = {};
  supportedRecipeIds.forEach(rId => {
    const r = (typeof XIUXIAN_RECIPES !== 'undefined') ? XIUXIAN_RECIPES[rId] : null;
    if (!r) return;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery)) return;
    const cat = r.category || '通用工艺';
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(r);
  });

  Object.keys(categorized).forEach(cat => {
    const recipes = categorized[cat];
    if (recipes.length === 0) return;

    const groupSection = document.createElement('div');
    groupSection.className = 'mb-4';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between pb-1 border-b border-white/15 text-white/70 text-xs font-semibold';
    header.innerHTML = `
      <span>${cat}</span>
      <i class="fa-solid fa-minus text-white/40 text-[10px]"></i>
    `;
    groupSection.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'flex items-center space-x-3 pt-2 flex-wrap gap-y-2';

    recipes.forEach(r => {
      const outKey = (Array.isArray(r.outputs) && r.outputs[0]?.item) || (r.output && r.output.item);
      const outItem = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[outKey]) || { name: r.name, icon: 'fa-cube' };
      const isSelected = (r.id === selectedRecipeInPicker);

      const card = document.createElement('div');
      card.onclick = () => selectRecipeInPicker(r.id);
      card.ondblclick = () => {
        selectRecipeInPicker(r.id);
        confirmSelectedRecipeForMachine();
      };
      card.className = `w-24 h-24 rounded flex flex-col items-center justify-center p-2 cursor-pointer transition ${
        isSelected 
          ? 'bg-[#e0770b] border-2 border-[#ff9d24] shadow-[0_0_12px_rgba(245,146,30,0.5)]' 
          : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40'
      }`;

      card.innerHTML = `
        <div class="w-12 h-12 flex items-center justify-center mb-1">
          <i class="${outItem.icon} text-2xl ${isSelected ? 'text-white' : 'text-stone-300'}"></i>
        </div>
        <span class="text-[11px] font-bold ${isSelected ? 'text-white' : 'text-white/80'}">${r.name}</span>
      `;
      grid.appendChild(card);
    });

    groupSection.appendChild(grid);
    container.appendChild(groupSection);
  });

  renderSelectedRecipeDetail(selectedRecipeInPicker);
}

// 在选择配方视图中点击某个配方卡片
function selectRecipeInPicker(recipeId) {
  playUiSound('click');
  selectedRecipeInPicker = recipeId;

  document.querySelectorAll('#machRecipeTreeContainer .w-24').forEach(c => {
    c.className = 'w-24 h-24 rounded flex flex-col items-center justify-center p-2 cursor-pointer transition bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/40';
  });

  renderSelectedRecipeDetail(recipeId);
  renderRecipePickerView(document.getElementById('machRecipeSearchInput')?.value || '');
}

// 渲染选中的配方详情 (动态支持多材料输入成本与多产物)
function renderSelectedRecipeDetail(recipeId) {
  const r = (typeof XIUXIAN_RECIPES !== 'undefined' && XIUXIAN_RECIPES[recipeId]) || {
    name: '赤铜线圈', desc: '导电线圈', timeSec: 2, outputs: [{ count: 2, item: 'copper_wire' }], inputs: [{ count: 1, item: 'copper_ingot' }]
  };

  const inList = Array.isArray(r.inputs) && r.inputs.length > 0 
    ? r.inputs 
    : (r.input ? [{ item: r.input.item, count: r.input.amount || 1, name: r.input.name }] : []);

  const outList = Array.isArray(r.outputs) && r.outputs.length > 0 
    ? r.outputs 
    : (r.output ? [{ item: r.output.item, count: r.output.amount || 1, name: r.output.name }] : []);

  const firstOut = outList[0] || { item: 'iron_ingot', count: 1 };
  const outItem = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[firstOut.item]) || { name: r.name, desc: r.desc, icon: 'fa-cube' };

  const title = document.getElementById('selRecipeDetailTitle');
  if (title) {
    if (outList.length > 1) {
      title.innerText = outList.map(o => {
        const itemDef = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[o.item]) || { name: o.item };
        return `${o.count || 1} ${itemDef.name}`;
      }).join(' + ');
    } else {
      title.innerText = `${firstOut.count || 1} ${r.name}`;
    }
  }

  const preview = document.getElementById('selRecipeModelPreview');
  if (preview) {
    preview.innerHTML = `
      <div class="relative flex items-center justify-center">
        <i class="${outItem.icon} text-6xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] animate-pulse"></i>
      </div>
    `;
  }

  const desc = document.getElementById('selRecipeDetailDesc');
  if (desc) desc.innerText = outItem.desc || r.desc || '';

  const timeElem = document.getElementById('selRecipeDetailTime');
  if (timeElem) timeElem.innerText = `${r.timeSec || 2} sec`;

  const costContainer = document.getElementById('selRecipeDetailCostCards');
  if (costContainer) {
    costContainer.innerHTML = '';
    inList.forEach(inp => {
      const inItem = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[inp.item]) || { name: inp.name || inp.item || '原料', icon: 'fa-cube' };
      const card = document.createElement('div');
      card.className = 'flex flex-col items-center bg-[#252b36] border border-white/20 rounded p-1.5 min-w-[62px]';
      card.innerHTML = `
        <div class="w-8 h-8 flex items-center justify-center">
          <i class="${inItem.icon} text-lg"></i>
        </div>
        <span class="text-[10px] font-mono font-bold text-white mt-1 text-center truncate max-w-[70px]" title="${inp.count || 1} ${inItem.name}">
          ${inp.count || 1} ${inItem.name}
        </span>
      `;
      costContainer.appendChild(card);
    });
  }
}

// 确认装载选中的配方到当前机器并切回生产
function confirmSelectedRecipeForMachine() {
  playUiSound('craft_success');
  currentMachineRecipeId = selectedRecipeInPicker;
  const bName = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[currentMachineId]?.name) || '设备';
  const rName = (typeof XIUXIAN_RECIPES !== 'undefined' && XIUXIAN_RECIPES[currentMachineRecipeId]?.name) || '配方';
  showNotification(`已为【${bName.split(' ')[0]}】成功装载配方: ${rName}`);
  switchMachineView('prod');
}

// 过滤配方
function handleMachineRecipeFilter(val) {
  renderRecipePickerView(val);
}

// 复制机器设置
function copyMachineSettings() {
  playUiSound('toggle');
  copiedSettings = {
    machineId: currentMachineId,
    recipeId: currentMachineRecipeId,
    powerOn: isMachinePowerOn
  };
  const bName = (typeof XIUXIAN_BUILDINGS !== 'undefined' && XIUXIAN_BUILDINGS[currentMachineId]?.name) || '设备';
  const rName = (typeof XIUXIAN_RECIPES !== 'undefined' && XIUXIAN_RECIPES[currentMachineRecipeId]?.name) || '配方';
  showNotification(`[已复制设置] 机器: ${bName.split(' ')[0]} | 配方: ${rName}`);
}

// 粘贴机器设置
function pasteMachineSettings() {
  if (!copiedSettings) {
    playUiSound('craft_fail');
    showNotification('剪贴板中无已复制的机器配置参数');
    return;
  }
  playUiSound('craft_success');
  currentMachineRecipeId = copiedSettings.recipeId;
  isMachinePowerOn = copiedSettings.powerOn;
  renderMachineProdView();
  const rName = (typeof XIUXIAN_RECIPES !== 'undefined' && XIUXIAN_RECIPES[currentMachineRecipeId]?.name) || '配方';
  showNotification(`[已成功粘贴] 载入配方: ${rName}`);
}

// 切换翘板电源开关
function toggleMachinePowerSwitch() {
  playUiSound('toggle');
  isMachinePowerOn = !isMachinePowerOn;

  const minerLight = document.getElementById('minerRockerLight');
  const minerText = document.getElementById('minerRockerText');
  if (minerLight && minerText) {
    if (isMachinePowerOn) {
      minerLight.className = 'w-3.5 h-5 bg-emerald-500 rounded-xs shadow-[0_0_8px_#10b981]';
      minerText.className = 'text-[10px] font-mono text-emerald-400 mt-0.5 font-bold';
      minerText.innerText = '运行';
    } else {
      minerLight.className = 'w-3.5 h-5 bg-red-600 rounded-xs shadow-[0_0_8px_#ef4444]';
      minerText.className = 'text-[10px] font-mono text-red-400 mt-0.5 font-bold';
      minerText.innerText = '待机';
    }
  }

  const prodLight = document.getElementById('prodRockerLight');
  const prodText = document.getElementById('prodRockerText');
  if (prodLight && prodText) {
    if (isMachinePowerOn) {
      prodLight.className = 'w-3.5 h-5 bg-emerald-500 rounded-xs shadow-[0_0_8px_#10b981]';
      prodText.className = 'text-[10px] font-mono text-emerald-400 mt-0.5 font-bold';
      prodText.innerText = '运行';
    } else {
      prodLight.className = 'w-3.5 h-5 bg-red-600 rounded-xs shadow-[0_0_8px_#ef4444]';
      prodText.className = 'text-[10px] font-mono text-white/50 mt-0.5';
      prodText.innerText = '待机';
    }
  }

  const passiveBtn = document.getElementById('passivePowerBtn');
  const passiveBtnText = document.getElementById('passivePowerBtnText');
  if (passiveBtn && passiveBtnText) {
    if (isMachinePowerOn) {
      passiveBtn.className = 'px-5 py-1.5 bg-[#091a26] hover:bg-[#0c2333] border-2 border-[#00f0ff] rounded-md text-xs font-black font-mono text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 transition cursor-pointer flex items-center space-x-1.5';
      passiveBtnText.innerText = 'ON';
    } else {
      passiveBtn.className = 'px-5 py-1.5 bg-black/60 hover:bg-black/80 border-2 border-stone-500 rounded-md text-xs font-black font-mono text-stone-400 active:scale-95 transition cursor-pointer flex items-center space-x-1.5';
      passiveBtnText.innerText = 'OFF';
    }
  }

  if (PASSIVE_MACHINES.includes(currentMachineId)) {
    renderPassiveProcessorView();
  } else if (COMPOSITE_MACHINES.includes(currentMachineId)) {
    renderCompositeBuildingView();
  } else {
    renderMachineProdView();
  }
  showNotification(isMachinePowerOn ? '机器已通电恢复工作' : '机器已切断电源进入待机状态');
}

// 垃圾桶销毁
function triggerTrashBin() {
  playUiSound('click');
  showNotification('工业回收焚化炉已就绪: 可将多余废料拖入销毁');
}
