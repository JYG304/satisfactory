// ====================================================================
// js/milestones.js - 中央处理器 / 境界突破与阶段授权系统 (原里程碑系统修仙化)
// 动态读取官方策划表 (xiuxian_data.js 中的 XIUXIAN_STAGES 与 XIUXIAN_ITEMS)
// ====================================================================

let currentHubViewType = 'current'; // 'select' | 'current'
let currentHubTier = 't1'; // 当前选中的大阶层 ('t0' | 't1' | 't2' | 't3' | 't4')
let currentHubStage = 1; // 当前正在进行的具体小层级 (0~12，初始为 1 练气 1 层)
let previewHubTier = 't1'; // 选界面中预览的大阶层
let previewHubStage = 1; // 选择界面中预览的具体小层级
let hubDelivered = { iron_ingot: 100, copper_ingot: 100, iron_plate: 100 };

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'currentHubStage', {
    get: () => currentHubStage,
    set: (v) => { currentHubStage = v; },
    configurable: true
  });
}

function getStagesTable() {
  if (typeof window !== 'undefined' && window.XIUXIAN_STAGES) return window.XIUXIAN_STAGES;
  if (typeof XIUXIAN_STAGES !== 'undefined') return XIUXIAN_STAGES;
  if (typeof window !== 'undefined' && window.XIUXIAN_MILESTONES) return window.XIUXIAN_MILESTONES;
  return {};
}

function getTiersList() {
  if (typeof window !== 'undefined' && window.XIUXIAN_TIERS) return window.XIUXIAN_TIERS;
  if (typeof XIUXIAN_TIERS !== 'undefined') return XIUXIAN_TIERS;
  return [];
}

function getItemsTable() {
  if (typeof window !== 'undefined' && window.XIUXIAN_ITEMS) return window.XIUXIAN_ITEMS;
  if (typeof XIUXIAN_ITEMS !== 'undefined') return XIUXIAN_ITEMS;
  return {};
}

// 获取当前进行中的具体小层配置
function getCurrentMilestoneConfig() {
  const table = getStagesTable();
  if (table[currentHubStage]) {
    return table[currentHubStage];
  }
  return {
    id: 1,
    tierId: 't1',
    tierName: '练气前期 (1-3层)',
    stageNum: 1,
    layerName: '练气 1 层',
    realm: '练气期',
    stageBadge: '练气 1 层',
    title: '采矿冶炼与基础构件 (练气 1 层)',
    subTitle: '采矿与冶炼',
    desc: '开采玄铁矿与赤铜矿，建立精炼炉冶炼玄铁锭、赤铜锭与手工加工玄铁板。',
    requirements: [
      { code: 'iron_ingot', need: 100 },
      { code: 'copper_ingot', need: 100 },
      { code: 'iron_plate', need: 100 }
    ],
    rewards: ['BD_101 采矿机', 'BD_102 精炼炉', '玄铁板 / 玄铁齿轮自动化加工配方']
  };
}

// 获取预览中的小层配置
function getPreviewMilestoneConfig(optStageId) {
  const table = getStagesTable();
  const targetId = (optStageId !== undefined) ? optStageId : previewHubStage;
  return table[targetId] || getCurrentMilestoneConfig();
}

function openHubMilestoneModal() {
  if (typeof openTechTreeModal === 'function') {
    openTechTreeModal();
    return;
  }
  playUiSound('click');
  closeOtherModals('hubMilestoneModal');
  const modal = document.getElementById('hubMilestoneModal');
  if (modal) modal.classList.remove('hidden');
  const curCfg = getCurrentMilestoneConfig();
  previewHubStage = currentHubStage;
  previewHubTier = curCfg.tierId || 't1';
  switchHubView(currentHubViewType);
  renderHubItemsGrid();
}

function closeHubMilestoneModal() {
  playUiSound('click');
  if (typeof closeTechTreeModal === 'function') {
    closeTechTreeModal();
  }
  const modal = document.getElementById('hubMilestoneModal');
  if (modal) modal.classList.add('hidden');
}

function switchHubView(type) {
  playUiSound('click');
  currentHubViewType = type;
  const tabSel = document.getElementById('hubTabSelect');
  const tabCur = document.getElementById('hubTabCurrent');
  const viewSel = document.getElementById('hubViewSelect');
  const viewCur = document.getElementById('hubViewCurrent');

  if (type === 'select') {
    if (tabSel) tabSel.className = 'flex items-center space-x-2 px-4 h-full text-xs font-bold bg-[#33373d] text-white transition cursor-pointer border-t-2 border-[#f5921e]';
    if (tabCur) tabCur.className = 'flex items-center space-x-2 px-4 h-full text-xs font-bold text-white/60 hover:text-white transition cursor-pointer border-b-2 border-transparent';
    if (viewSel) viewSel.classList.remove('hidden');
    if (viewCur) viewCur.classList.add('hidden');
    renderHubStageNavBar();
    renderHubSubStagesCards();
    renderHubSelectView();
  } else {
    if (tabCur) tabCur.className = 'flex items-center space-x-2 px-4 h-full text-xs font-bold bg-[#33373d] text-white transition cursor-pointer border-t-2 border-[#f5921e]';
    if (tabSel) tabSel.className = 'flex items-center space-x-2 px-4 h-full text-xs font-bold text-white/60 hover:text-white transition cursor-pointer border-b-2 border-transparent';
    if (viewCur) viewCur.classList.remove('hidden');
    if (viewSel) viewSel.classList.add('hidden');
    renderHubDeliverySlots();
  }
  renderHubItemsGrid();
}

// 辅助函数：判断某个大境界 (Tier) 是否对玩家解锁开放
function isTierUnlocked(tierId) {
  const stage = (typeof currentHubStage !== 'undefined') ? currentHubStage : ((typeof window !== 'undefined' && window.currentHubStage) ? window.currentHubStage : 1);
  if (tierId === 't0') return true;
  if (tierId === 't1') return true; // 练气前期默认开放
  if (tierId === 't2') return stage >= 4; // 突破练气三层后开放练气中期
  if (tierId === 't3') return stage >= 7; // 突破练气六层后开放筑基前期
  if (tierId === 't4') return stage >= 10; // 突破筑基三层后开放筑基后期
  return false;
}

if (typeof window !== 'undefined') {
  window.isTierUnlocked = isTierUnlocked;
  window.getCurrentMilestoneConfig = getCurrentMilestoneConfig;
  window.getPreviewMilestoneConfig = getPreviewMilestoneConfig;
  window.openHubMilestoneModal = openHubMilestoneModal;
  window.closeHubMilestoneModal = closeHubMilestoneModal;
  window.switchHubView = switchHubView;
  window.confirmSelectMilestone = confirmSelectMilestone;
  window.depositHubItem = depositHubItem;
  window.depositAllHubMatched = depositAllHubMatched;
  window.upgradeHubLaunch = upgradeHubLaunch;
}

// 1. 动态渲染顶部境界大阶层 (Tier) 横排导航栏 (序章、练气前期、练气中期、筑基前期、筑基后期)
function renderHubStageNavBar() {
  const container = document.getElementById('hubStageNavBarContainer');
  if (!container) return;

  const tiers = getTiersList();
  container.innerHTML = '';

  tiers.forEach(tier => {
    const isSelected = (tier.id === previewHubTier);
    const isUnlocked = isTierUnlocked(tier.id);
    const containsActive = tier.stageIds.includes(currentHubStage);

    const div = document.createElement('div');
    if (!isUnlocked) {
      // 未解锁大境界：封印防剧透态
      div.className = 'px-4 h-11 bg-black/40 border border-white/5 rounded flex flex-col items-center justify-center text-white/30 cursor-not-allowed shrink-0 transition select-none';
      div.title = `【天机未启】需先圆满上一重大境界，方可感悟${tier.name}！`;
      div.innerHTML = `
        <div class="flex items-center space-x-1">
          <i class="fa-solid fa-lock text-[9px] text-stone-500"></i>
          <span class="text-[9px] font-mono text-stone-500">${tier.realm}</span>
        </div>
        <span class="text-xs font-bold text-stone-500 leading-tight">${tier.name}</span>
      `;
      div.onclick = () => {
        playUiSound('craft_fail');
        showNotification(`【天机未启】道友道行尚浅，需先圆满当前境界，方可窥视【${tier.name}】天机！`);
      };
    } else if (isSelected) {
      div.className = 'px-4 h-11 bg-[#e0770b] border-2 border-amber-300 rounded flex flex-col items-center justify-center shadow-[0_0_15px_rgba(245,146,30,0.5)] cursor-pointer shrink-0 transition scale-105';
      div.innerHTML = `
        <span class="text-[9px] text-black font-bold font-mono leading-none">${tier.realm}</span>
        <span class="text-xs font-black text-black leading-tight">${tier.name}</span>
      `;
      div.onclick = () => selectTierTab(tier.id);
    } else if (containsActive) {
      div.className = 'px-4 h-11 bg-amber-500/20 border border-amber-400/60 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-amber-500/30 shrink-0 transition';
      div.innerHTML = `
        <span class="text-[9px] text-amber-300 font-mono leading-none">${tier.realm}</span>
        <span class="text-xs font-bold text-white leading-tight">${tier.name} (进行中)</span>
      `;
      div.onclick = () => selectTierTab(tier.id);
    } else {
      div.className = 'px-4 h-11 bg-white/5 border border-white/10 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition shrink-0';
      div.innerHTML = `
        <span class="text-[9px] text-white/50 font-mono leading-none">${tier.realm}</span>
        <span class="text-xs font-bold text-white/80 leading-tight">${tier.name}</span>
      `;
      div.onclick = () => selectTierTab(tier.id);
    }

    container.appendChild(div);
  });
}

function selectTierTab(tierId) {
  previewHubTier = tierId;
  const tiers = getTiersList();
  const tObj = tiers.find(t => t.id === tierId);
  if (tObj && tObj.stageIds && tObj.stageIds.length > 0) {
    // 优先选中当前进行中小层，否则选该 Tier 允许预览的第一层
    if (tObj.stageIds.includes(currentHubStage)) {
      previewHubStage = currentHubStage;
    } else {
      previewHubStage = tObj.stageIds[0];
    }
  }
  renderHubStageNavBar();
  renderHubSubStagesCards();
  renderHubSelectView();
}

// 2. 动态渲染当前大阶层下的各层小里程碑卡片栏 (严格遵循防剧透与迷雾机制)
function renderHubSubStagesCards() {
  const container = document.getElementById('hubSubStagesContainer');
  if (!container) return;

  container.innerHTML = '';
  const tiers = getTiersList();
  const currentTierObj = tiers.find(t => t.id === previewHubTier) || tiers[1] || { stageIds: [1, 2, 3] };
  const stagesTable = getStagesTable();

  currentTierObj.stageIds.forEach(stgId => {
    const stg = stagesTable[stgId];
    if (!stg) return;

    const isSelected = (stg.id === previewHubStage);
    const isCurrentActive = (stg.id === currentHubStage);
    const isFinished = (stg.id < currentHubStage);
    const isNextImmediate = (stg.id === currentHubStage + 1);
    const isDeepLocked = (stg.id > currentHubStage + 1);

    const card = document.createElement('div');

    if (isDeepLocked) {
      // 深度封印防剧透卡片：完全未知迷雾
      card.className = 'min-w-[140px] h-20 bg-black/50 border border-white/5 rounded-t-md p-2.5 flex flex-col items-center justify-center cursor-not-allowed opacity-50 shrink-0 select-none';
      card.title = '天机晦暗，需循序渐进突破前方层级！';
      card.innerHTML = `
        <div class="flex items-center space-x-1 mb-1">
          <i class="fa-solid fa-lock text-[9px] text-stone-500"></i>
          <span class="text-[10px] font-mono text-stone-500 uppercase">封印中</span>
        </div>
        <span class="text-xs font-bold text-stone-500 text-center tracking-widest">？？？</span>
      `;
      card.onclick = () => {
        playUiSound('craft_fail');
        showNotification('【天机晦暗】此层境界被法则迷雾笼罩，请先突破前方层级！');
      };
    } else if (isNextImmediate) {
      // 下一层待参悟态
      if (isSelected) {
        card.className = 'min-w-[150px] h-20 bg-amber-900/40 border-2 border-amber-400/80 rounded-t-md p-2.5 flex flex-col items-center justify-center cursor-pointer transition shrink-0';
      } else {
        card.className = 'min-w-[150px] h-20 bg-white/5 hover:bg-white/10 border border-amber-500/20 rounded-t-md p-2.5 flex flex-col items-center justify-center cursor-pointer transition shrink-0';
      }
      card.innerHTML = `
        <div class="flex items-center space-x-1 mb-1">
          <i class="fa-solid fa-lock text-[9px] text-amber-400"></i>
          <span class="text-[10px] font-bold text-amber-300 uppercase">${stg.layerName}</span>
          <span class="text-[8px] bg-black/60 text-amber-400 px-1 rounded">待解锁</span>
        </div>
        <span class="text-xs font-medium text-white/70 truncate w-full text-center">${stg.subTitle || stg.title}</span>
      `;
      card.onclick = () => {
        previewHubStage = stg.id;
        renderHubSubStagesCards();
        renderHubSelectView();
      };
    } else if (isSelected) {
      // 当前选中卡片：金黄色辉光高亮
      card.className = 'min-w-[150px] h-20 bg-gradient-to-b from-[#ffd54f] to-[#e67e00] rounded-t-md p-2.5 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(245,146,30,0.5)] transition scale-105 shrink-0';
      card.innerHTML = `
        <div class="flex items-center space-x-1 mb-1">
          <span class="text-[10px] font-black text-black uppercase tracking-wider">${stg.layerName}</span>
          ${isFinished ? '<span class="text-[8px] bg-black text-emerald-300 font-bold px-1 rounded">✓ 已突破</span>' : '<span class="text-[8px] bg-black text-amber-300 font-bold px-1 rounded">进行中</span>'}
        </div>
        <span class="text-xs font-black text-black truncate w-full text-center">${stg.subTitle || stg.title}</span>
      `;
      card.onclick = () => {
        previewHubStage = stg.id;
        renderHubSubStagesCards();
        renderHubSelectView();
      };
    } else {
      // 已突破或进行中非选中卡片
      card.className = 'min-w-[150px] h-20 bg-white/5 hover:bg-white/10 border border-white/10 rounded-t-md p-2.5 flex flex-col items-center justify-center cursor-pointer transition shrink-0';
      card.innerHTML = `
        <div class="flex items-center space-x-1 mb-1">
          <span class="text-[10px] font-bold text-white/60 uppercase tracking-wider">${stg.layerName}</span>
          ${isFinished ? '<span class="text-[8px] bg-emerald-500/20 text-emerald-300 font-bold px-1 rounded">✓</span>' : '<span class="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded">进行中</span>'}
        </div>
        <span class="text-xs font-bold text-white/80 truncate w-full text-center">${stg.subTitle || stg.title}</span>
      `;
      card.onclick = () => {
        previewHubStage = stg.id;
        renderHubSubStagesCards();
        renderHubSelectView();
      };
    }

    container.appendChild(card);
  });
}

// 点击【确立阶段目标】
function confirmSelectMilestone() {
  playUiSound('toggle');
  const cfg = getPreviewMilestoneConfig();
  if (cfg.id > currentHubStage) {
    playUiSound('craft_fail');
    showNotification(`【无法锁定】请先完成当前层级的认证，方可开启【${cfg.layerName}】！`);
    return;
  }
  currentHubStage = previewHubStage;
  currentHubTier = cfg.tierId || 't1';
  showNotification(`【阶段目标已确立】天元中央处理器已锁定【${cfg.layerName}】突破认证通道！`);
  switchHubView('current');
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
}

// 动态渲染选择阶段视图的奖励与消耗 (严格防剧透)
function renderHubSelectView() {
  const cfg = getPreviewMilestoneConfig();
  const isDeepLocked = (cfg.id > currentHubStage + 1);
  const isNextImmediate = (cfg.id === currentHubStage + 1);
  const isFinished = (cfg.id < currentHubStage);
  
  // 更新消耗成本 (COST)
  const costContainer = document.querySelector('#hubViewSelect .border-t .flex');
  if (costContainer) {
    costContainer.innerHTML = '';
    if (isDeepLocked) {
      costContainer.innerHTML = `<span class="text-xs font-mono text-stone-500">？？？（法则迷雾锁定中）</span>`;
    } else if (isNextImmediate) {
      // 下一层展示前置提示
      costContainer.innerHTML = `<span class="text-xs font-mono text-amber-300/70">需先完成当前层级，方可显化突破所需物料</span>`;
    } else {
      cfg.requirements.forEach(req => {
        const items = getItemsTable();
        const it = items[req.code] || { name: req.code, icon: 'fa-solid fa-cube' };
        const div = document.createElement('div');
        div.className = 'flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded border border-white/10';
        div.innerHTML = `<i class="${it.icon}"></i><span class="text-xs font-mono">${it.name} x${req.need}</span>`;
        costContainer.appendChild(div);
      });
    }
  }

  // 更新奖励预览 (REWARDS)
  const rewardGrid = document.getElementById('hubRewardIconsGrid');
  if (rewardGrid) {
    rewardGrid.innerHTML = '';
    if (isDeepLocked || isNextImmediate) {
      // 未解锁层：防剧透暗格
      const count = isDeepLocked ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'relative flex flex-col items-center bg-black/40 p-2.5 rounded border border-white/5 select-none opacity-40';
        div.innerHTML = `
          <div class="w-8 h-8 flex items-center justify-center text-stone-500 mt-1 mb-1"><i class="fa-solid fa-lock text-base"></i></div>
          <span class="text-[10px] text-stone-400 font-mono text-center">？？？</span>
        `;
        rewardGrid.appendChild(div);
      }
    } else if (cfg.rewards) {
      cfg.rewards.forEach(rew => {
        const div = document.createElement('div');
        div.className = 'relative flex flex-col items-center bg-black/20 p-2 rounded border border-white/5';
        div.innerHTML = `
          <span class="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f5921e] flex items-center justify-center text-[7px] text-black font-black">🏭</span>
          <div class="w-8 h-8 flex items-center justify-center text-amber-300 mt-1 mb-1"><i class="fa-solid fa-microchip text-xl"></i></div>
          <span class="text-[10px] text-white/80 text-center truncate w-full" title="${rew}">${rew}</span>
        `;
        rewardGrid.appendChild(div);
      });
    }
  }

  // 更新大按钮文案
  const btnSelect = document.getElementById('btnConfirmSelectMilestone') || document.querySelector('#hubViewSelect button[onclick*="confirmSelectMilestone"]');
  if (btnSelect) {
    if (isDeepLocked || isNextImmediate) {
      btnSelect.innerText = `尚未解锁此境界层级 (需突破前置)`;
      btnSelect.className = 'w-[340px] py-2.5 bg-stone-700/60 text-stone-400 font-bold text-xs tracking-wider rounded border border-stone-600 cursor-not-allowed';
    } else if (isFinished) {
      btnSelect.innerText = `该层境界已圆满突破 (${cfg.layerName})`;
      btnSelect.className = 'w-[340px] py-2.5 bg-emerald-800/60 text-emerald-200 font-bold text-xs tracking-wider rounded border border-emerald-500/40 cursor-default';
    } else {
      btnSelect.innerText = `确立阶段目标: ${cfg.layerName} (${cfg.title})`;
      btnSelect.className = 'w-[340px] py-2.5 bg-gradient-to-r from-[#ffd54f] via-[#f5921e] to-[#d97706] hover:from-[#ffe082] hover:to-[#f5921e] text-black font-black text-sm tracking-widest rounded shadow-[0_0_20px_rgba(245,146,30,0.6)] cursor-pointer active:scale-95 transition';
    }
  }
}

// 动态渲染当前阶段目标提交插槽
function renderHubDeliverySlots() {
  const cfg = getCurrentMilestoneConfig();
  const titleElem = document.getElementById('currentHubMilestoneTitle');
  if (titleElem) {
    titleElem.innerText = `【${cfg.realm}】${cfg.title} - ${cfg.subTitle}`;
  }

  const container = document.getElementById('hubDepositSlotsContainer');
  if (!container) return;
  container.innerHTML = '';

  cfg.requirements.forEach((req, idx) => {
    const it = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[req.code]) ? XIUXIAN_ITEMS[req.code] : { name: req.code, icon: 'fa-solid fa-cube text-white' };
    const delivered = hubDelivered[req.code] || 0;
    const isFull = delivered >= req.need;

    const slot = document.createElement('div');
    slot.className = 'flex flex-col items-center cursor-pointer group';
    slot.onclick = () => depositHubItem(req.code);
    slot.innerHTML = `
      <div class="relative w-16 h-16 bg-white/10 hover:bg-white/20 border ${isFull ? 'border-emerald-400' : 'border-white/25'} rounded-md flex items-center justify-center shadow-inner group-hover:scale-105 transition">
        <i class="${it.icon} text-2xl"></i>
        <span id="hubSlotStock_${idx}" class="absolute bottom-1 text-[10px] font-mono font-bold ${isFull ? 'text-black bg-emerald-400' : 'text-black bg-[#f5921e]'} px-1 rounded">${delivered}/${req.need}</span>
      </div>
      <span class="text-[10px] text-white/70 font-mono mt-1">${it.name}</span>
    `;
    container.appendChild(slot);
  });
}

function depositHubItem(code) {
  playUiSound('click');
  const cfg = getCurrentMilestoneConfig();
  const req = cfg.requirements.find(r => r.code === code);
  if (!req) return;

  const currentDelivered = hubDelivered[code] || 0;
  const needed = req.need - currentDelivered;
  if (needed <= 0) {
    showNotification('该材料插槽已装填满额！');
    return;
  }

  const inBag = (typeof playerInventory !== 'undefined' && playerInventory[code]) ? playerInventory[code] : 0;
  const toDeposit = Math.min(needed, inBag > 0 ? inBag : req.need);
  
  if (inBag > 0 && typeof playerInventory !== 'undefined') {
    playerInventory[code] -= toDeposit;
  }
  hubDelivered[code] = currentDelivered + toDeposit;

  renderHubDeliverySlots();
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
  
  const it = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[code]) ? XIUXIAN_ITEMS[code] : { name: code };
  showNotification(`已向中央处理器交付 ${it.name} x${toDeposit}！当前进度: ${hubDelivered[code]}/${req.need}`);
}

function depositAllHubMatched() {
  playUiSound('click');
  const cfg = getCurrentMilestoneConfig();
  cfg.requirements.forEach(req => {
    hubDelivered[req.code] = req.need;
  });
  renderHubDeliverySlots();
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
  showNotification('已一键装填所有匹配物料！中央处理器境界突破准备就绪！');
}

// 启动中央处理器境界突破 / 阶段授权
function upgradeHubLaunch() {
  const cfg = getCurrentMilestoneConfig();
  const isComplete = cfg.requirements.every(req => (hubDelivered[req.code] || 0) >= req.need);

  if (!isComplete) {
    playUiSound('craft_fail');
    showNotification('请先装填满足当前阶段所有插槽物料，方可启动境界突破授权！');
    return;
  }

  playUiSound('hub_launch');
  const btn = document.getElementById('btnHubLaunchUpgrade');
  if (btn) btn.classList.add('scale-95');
  setTimeout(() => { if (btn) btn.classList.remove('scale-95'); }, 300);

  showNotification(`🚀【中央处理器研究认证成功！】${cfg.layerName || cfg.realm} · ${cfg.subTitle} 授权交付！全线科技已激活！`);
  
  // 检查是否触发造化金身大目标塑造节点
  if (cfg.id === 3) {
    setTimeout(() => {
      showNotification(`🌟【练气前期圆满】造化金身第 1 阶段【金身基座】大型塑造任务已开放！请接入自动化传送带！`);
    }, 1800);
  } else if (cfg.id === 6) {
    setTimeout(() => {
      showNotification(`🌟【练气大圆满】步入筑基！造化金身第 2 阶段【金身骨架】大型塑造任务已开放！`);
    }, 1800);
  } else if (cfg.id === 9) {
    setTimeout(() => {
      showNotification(`🌟【筑基前期大成】造化金身第 3 阶段【金身经络】大型塑造任务已开放！`);
    }, 1800);
  } else if (cfg.id === 12) {
    setTimeout(() => {
      showNotification(`🎉【筑基终局·Demo大获全胜】向造化金身植入【人造灵根原型 × 20】！造化金身初启，人工灵力转换接口建立！`);
    }, 1800);
  }

  const table = (typeof XIUXIAN_STAGES !== 'undefined') ? XIUXIAN_STAGES : ((typeof XIUXIAN_MILESTONES !== 'undefined') ? XIUXIAN_MILESTONES : {});
  // 进阶到下一阶段
  if (table[currentHubStage + 1]) {
    currentHubStage++;
    previewHubStage = currentHubStage;
    const nextCfg = getCurrentMilestoneConfig();
    currentHubTier = nextCfg.tierId || currentHubTier;
    previewHubTier = currentHubTier;
    nextCfg.requirements.forEach(req => {
      hubDelivered[req.code] = 0;
    });
    setTimeout(() => {
      showNotification(`【境界飞跃】天元中枢进入【${nextCfg.layerName || nextCfg.realm} · ${nextCfg.subTitle}】阶段！`);
      renderHubDeliverySlots();
      if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
    }, 1200);
  } else {
    const titleElem = document.getElementById('currentHubMilestoneTitle');
    if (titleElem) titleElem.innerText = `【${cfg.layerName || cfg.realm}】中央处理器全部12层认证达成！造化金身初启！`;
  }
}

function renderHubItemsGrid() {
  const grid = document.getElementById('hubAllItemsGrid');
  if (!grid || typeof activePlayerBagItems === 'undefined') return;
  grid.innerHTML = '';
  activePlayerBagItems.slice(0, 20).forEach(item => {
    if (!item) return;
    const div = document.createElement('div');
    div.className = 'relative w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/15 rounded flex items-center justify-center cursor-pointer transition';
    div.title = `${item.name} x${item.count}`;
    div.onclick = () => showNotification(`随身物料: ${item.name} x${item.count}`);
    div.innerHTML = `<i class="${item.icon} text-base"></i><span class="absolute bottom-0.5 right-1 text-[8px] font-mono text-white font-bold">${item.count}</span>`;
    grid.appendChild(div);
  });
}
