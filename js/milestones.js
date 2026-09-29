// ====================================================================
// js/milestones.js - 中央处理器 / 枢纽里程碑系统 (阶段选择与材料提交)
// 动态读取官方策划表 (xiuxian_data.js 中的 XIUXIAN_MILESTONES 与 XIUXIAN_ITEMS)
// ====================================================================

let currentHubViewType = 'current'; // 'select' | 'current'
let currentHubStage = 1; // 当前阶段 1~4
let selectedHubCategoryKey = 'base'; // 'base' | 'logi' | 'explore'
let hubDelivered = { iron_ingot: 100, copper_ingot: 100, iron_plate: 100 };

// 获取当前阶段里程碑数据
function getCurrentMilestoneConfig() {
  if (typeof XIUXIAN_MILESTONES !== 'undefined' && XIUXIAN_MILESTONES[currentHubStage]) {
    return XIUXIAN_MILESTONES[currentHubStage];
  }
  return {
    id: 1,
    tier: 'T1',
    realm: '炼气期',
    title: '中央处理器研究认证 (炼气 1 层)',
    subTitle: '天工基建',
    desc: '交付基础冶炼产物，升级天元中央处理器。',
    requirements: [
      { code: 'iron_ingot', need: 100 },
      { code: 'copper_ingot', need: 100 },
      { code: 'iron_plate', need: 100 }
    ],
    rewards: ['BD_102 精炼炉', 'BD_103 粉碎机', 'BD_104 加工台']
  };
}

function openHubMilestoneModal() {
  playUiSound('click');
  closeOtherModals('hubMilestoneModal');
  const modal = document.getElementById('hubMilestoneModal');
  if (modal) modal.classList.remove('hidden');
  switchHubView(currentHubViewType);
  renderHubItemsGrid();
}

function closeHubMilestoneModal() {
  playUiSound('click');
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

function selectHubCategory(cat) {
  playUiSound('click');
  selectedHubCategoryKey = cat;
  const cards = ['base', 'logi', 'explore'];
  cards.forEach(c => {
    const el = document.getElementById('hubCatCard-' + c);
    if (!el) return;
    if (c === cat) {
      el.className = 'w-36 h-20 bg-gradient-to-b from-[#ffd54f] to-[#e67e00] rounded-t-md p-2 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(245,146,30,0.5)] transition';
      const sp = el.querySelector('span');
      if (sp) sp.className = 'text-xs font-black text-black';
    } else {
      el.className = 'w-36 h-20 bg-white/5 hover:bg-white/10 border border-white/10 rounded-t-md p-2 flex flex-col items-center justify-center cursor-pointer transition';
      const sp = el.querySelector('span');
      if (sp) sp.className = 'text-xs font-bold text-white/80';
    }
  });
  showNotification(`已选择里程碑分支: 【${cat === 'base' ? '基地建筑' : cat === 'logi' ? '物流设施' : '实地考察'}】`);
}

function confirmSelectMilestone() {
  playUiSound('toggle');
  showNotification('【里程碑已确立】中央处理器已切换至当前里程碑交付通道！');
  switchHubView('current');
}

// 动态渲染选择里程碑视图的奖励与消耗
function renderHubSelectView() {
  const cfg = getCurrentMilestoneConfig();
  
  // 更新消耗成本
  const costContainer = document.querySelector('#hubViewSelect .border-t .flex');
  if (costContainer) {
    costContainer.innerHTML = '';
    cfg.requirements.forEach(req => {
      const it = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[req.code]) ? XIUXIAN_ITEMS[req.code] : { name: req.code, icon: 'fa-solid fa-cube' };
      const div = document.createElement('div');
      div.className = 'flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded border border-white/10';
      div.innerHTML = `<i class="${it.icon}"></i><span class="text-xs font-mono">${it.name} x${req.need}</span>`;
      costContainer.appendChild(div);
    });
  }

  // 更新奖励预览
  const rewardGrid = document.getElementById('hubRewardIconsGrid');
  if (rewardGrid && cfg.rewards) {
    rewardGrid.innerHTML = '';
    cfg.rewards.forEach(rew => {
      const div = document.createElement('div');
      div.className = 'relative flex flex-col items-center bg-black/20 p-2 rounded border border-white/5';
      div.innerHTML = `
        <span class="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f5921e] flex items-center justify-center text-[7px] text-black font-black">🏭</span>
        <div class="w-8 h-8 flex items-center justify-center text-amber-300 mt-1 mb-1"><i class="fa-solid fa-microchip text-xl"></i></div>
        <span class="text-[10px] text-white/80 text-center truncate w-full">${rew}</span>
      `;
      rewardGrid.appendChild(div);
    });
  }
}

// 动态渲染当前里程碑提交槽位
function renderHubDeliverySlots() {
  const cfg = getCurrentMilestoneConfig();
  const titleElem = document.getElementById('currentHubMilestoneTitle');
  if (titleElem) {
    titleElem.innerText = `${cfg.title} - ${cfg.subTitle}`;
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
  const toDeposit = Math.min(needed, inBag > 0 ? inBag : req.need); // 如果背包充足优先消耗背包，否则测试直接充填
  
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
  showNotification('已一键装填所有匹配物料！中央处理器突破准备就绪！');
}

function upgradeHubLaunch() {
  const cfg = getCurrentMilestoneConfig();
  const isComplete = cfg.requirements.every(req => (hubDelivered[req.code] || 0) >= req.need);

  if (!isComplete) {
    playUiSound('craft_fail');
    showNotification('请先装填满足所有材料插槽需求，方可启动中央处理器升级！');
    return;
  }

  playUiSound('hub_launch');
  const btn = document.getElementById('btnHubLaunchUpgrade');
  if (btn) btn.classList.add('scale-95');
  setTimeout(() => { if (btn) btn.classList.remove('scale-95'); }, 300);

  showNotification(`🚀【中央处理器突破成功！】${cfg.realm} ${cfg.title} 圆满交付！全线科技已激活！`);
  
  // 进阶到下一阶段
  if (typeof XIUXIAN_MILESTONES !== 'undefined' && XIUXIAN_MILESTONES[currentHubStage + 1]) {
    currentHubStage++;
    const nextCfg = getCurrentMilestoneConfig();
    nextCfg.requirements.forEach(req => {
      hubDelivered[req.code] = 0;
    });
    setTimeout(() => {
      showNotification(`【新境界解锁】天元中枢进入【${nextCfg.realm}·${nextCfg.subTitle}】阶段！`);
      renderHubDeliverySlots();
      if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
    }, 1500);
  } else {
    const titleElem = document.getElementById('currentHubMilestoneTitle');
    if (titleElem) titleElem.innerText = `${cfg.title} - 全部境界已臻化境！`;
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
