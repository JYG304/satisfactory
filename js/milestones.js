// ====================================================================
// js/milestones.js - 中央处理器 / 枢纽里程碑系统 (阶段选择与材料提交)
// ====================================================================

let currentHubViewType = 'current'; // 'select' | 'current'
let currentHubStage = 1; // 阶段 1
let selectedHubCategoryKey = 'base'; // 'base' | 'logi' | 'explore'
let hubDelivered = { iron_rod: 75, copper_wire: 50, concrete: 20 };
let hubRequired = { iron_rod: 75, copper_wire: 50, concrete: 20 };

function openHubMilestoneModal() {
  playUiSound('click');
  closeOtherModals('hubMilestoneModal');
  document.getElementById('hubMilestoneModal').classList.remove('hidden');
  switchHubView(currentHubViewType);
  renderHubItemsGrid();
}

function closeHubMilestoneModal() {
  playUiSound('click');
  document.getElementById('hubMilestoneModal').classList.add('hidden');
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

function renderHubDeliverySlots() {
  const s0 = document.getElementById('hubSlotStock_0');
  const s1 = document.getElementById('hubSlotStock_1');
  const s2 = document.getElementById('hubSlotStock_2');
  if (s0) s0.innerText = `${hubDelivered.iron_rod}/${hubRequired.iron_rod}`;
  if (s1) s1.innerText = `${hubDelivered.copper_wire}/${hubRequired.copper_wire}`;
  if (s2) s2.innerText = `${hubDelivered.concrete}/${hubRequired.concrete}`;
}

function depositHubItem(code) {
  playUiSound('click');
  const needed = (hubRequired[code] || 0) - (hubDelivered[code] || 0);
  if (needed <= 0) {
    showNotification('该材料插槽已装填满额！');
    return;
  }
  hubDelivered[code] = hubRequired[code];
  renderHubDeliverySlots();
  showNotification(`已交付物料至中央处理器！当前 ${hubDelivered[code]}/${hubRequired[code]}`);
}

function depositAllHubMatched() {
  playUiSound('click');
  hubDelivered.iron_rod = hubRequired.iron_rod;
  hubDelivered.copper_wire = hubRequired.copper_wire;
  hubDelivered.concrete = hubRequired.concrete;
  renderHubDeliverySlots();
  showNotification('已一键装填所有匹配物料！中央处理器准备就绪！');
}

function upgradeHubLaunch() {
  const isComplete = (hubDelivered.iron_rod >= hubRequired.iron_rod) &&
                     (hubDelivered.copper_wire >= hubRequired.copper_wire) &&
                     (hubDelivered.concrete >= hubRequired.concrete);
  if (!isComplete) {
    playUiSound('craft_fail');
    showNotification('请先装填满足所有材料插槽需求，方可启动中央处理器升级！');
    return;
  }

  playUiSound('hub_launch');
  const btn = document.getElementById('btnHubLaunchUpgrade');
  if (btn) btn.classList.add('scale-95');
  setTimeout(() => { if (btn) btn.classList.remove('scale-95'); }, 300);

  showNotification('🚀【中央处理器升级大突破！】阶段 1 里程碑圆满交付！天工基地建筑群已全线解锁！');
  const titleElem = document.getElementById('currentHubMilestoneTitle');
  if (titleElem) titleElem.innerText = '中央处理器升级 1 - 交付完成！阶段 2 规划开启';
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
