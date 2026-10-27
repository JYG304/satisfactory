// ====================================================================
// js/crafting.js - 手工操作台 (制作台 Image 1 还原与打铁系统)
// ====================================================================

const craftingRecipes = {
  iron_ingot: {
    id: 'iron_ingot',
    name: '玄铁金属锭',
    icon: 'fa-solid fa-bars text-amber-300',
    outCode: 'iron_ingot',
    outAmount: 1,
    timeSec: 0.5,
    ingredients: [{ code: 'iron_ore', name: '玄铁原矿', need: 1, icon: 'fa-cube' }]
  },
  iron_plate: {
    id: 'iron_plate',
    name: '工业玄铁板',
    icon: 'fa-solid fa-sheet-plastic text-stone-200',
    outCode: 'iron_plate',
    outAmount: 1,
    timeSec: 0.75,
    ingredients: [{ code: 'iron_ingot', name: '玄铁金属锭', need: 3, icon: 'fa-bars' }]
  },
  iron_rod: {
    id: 'iron_rod',
    name: '标准铁棒',
    icon: 'fa-solid fa-lines-leaning text-stone-300',
    outCode: 'iron_rod',
    outAmount: 1,
    timeSec: 0.5,
    ingredients: [{ code: 'iron_ingot', name: '玄铁金属锭', need: 1, icon: 'fa-bars' }]
  },
  screw: {
    id: 'screw',
    name: '高强度螺丝',
    icon: 'fa-solid fa-gear text-stone-300',
    outCode: 'screw',
    outAmount: 4,
    timeSec: 0.5,
    ingredients: [{ code: 'iron_rod', name: '标准铁棒', need: 1, icon: 'fa-lines-leaning' }]
  },
  reinforced_plate: {
    id: 'reinforced_plate',
    name: '增强型玄铁板',
    icon: 'fa-solid fa-shield text-blue-400',
    outCode: 'reinforced_plate',
    outAmount: 1,
    timeSec: 1.2,
    ingredients: [
      { code: 'iron_plate', name: '工业玄铁板', need: 6, icon: 'fa-sheet-plastic' },
      { code: 'screw', name: '高强度螺丝', need: 12, icon: 'fa-gear' }
    ]
  },
  wire: {
    id: 'wire',
    name: '赤铜线圈',
    icon: 'fa-solid fa-plug text-yellow-400',
    outCode: 'wire',
    outAmount: 2,
    timeSec: 0.5,
    ingredients: [{ code: 'copper_ingot', name: '赤铜金属锭', need: 1, icon: 'fa-bars' }]
  }
};

let currentCraftRecipeKey = 'iron_plate';
let isCraftingHolding = false;
let craftHoldStartTime = 0;
let craftHoldProgress = 0; // 0 到 100
let craftAnimFrameId = null;
let lastCraftHitSoundTime = 0;
let comboCraftCount = 0;

// 打开/关闭手工加工台
function toggleCraftModal() {
  playUiSound('click');
  closeOtherModals('craftModal');
  const modal = document.getElementById('craftModal');
  const isOpening = modal.classList.contains('hidden');
  modal.classList.toggle('hidden');
  if (isOpening) {
    renderCraftModalInventory();
  }
}

// 选中某个工艺配方
function selectCraftRecipe(key) {
  playUiSound('click');
  currentCraftRecipeKey = key;
  const rec = craftingRecipes[key];
  if (!rec) return;

  // 切换左侧高亮
  document.querySelectorAll('.recipe-card').forEach(card => {
    card.className = 'recipe-card p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400 cursor-pointer flex items-center justify-between transition group';
  });
  const currentCard = document.getElementById(`rcard-${key}`);
  if (currentCard) {
    currentCard.className = 'recipe-card p-2 rounded bg-amber-500/20 border-2 border-amber-400 cursor-pointer flex items-center justify-between transition';
  }

  // 更新右侧头部
  const iconElem = document.getElementById('craftSelectedIcon');
  if (iconElem) iconElem.className = rec.icon + ' text-3xl';
  const titleElem = document.getElementById('craftSelectedTitle');
  if (titleElem) titleElem.innerText = rec.name;
  const invElem = document.getElementById('craftInventoryCount');
  if (invElem) invElem.innerText = `${playerInventory[rec.outCode] || 0} 件`;

  // 渲染消耗原料列表
  const ingContainer = document.getElementById('craftIngredientsContainer');
  if (ingContainer) {
    ingContainer.innerHTML = '';
    rec.ingredients.forEach(ing => {
      const stock = playerInventory[ing.code] || 0;
      const isEnough = stock >= ing.need;
      const div = document.createElement('div');
      div.className = 'bg-white/5 border border-white/10 rounded p-3 flex items-center justify-between';
      div.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
            <i class="fa-solid ${ing.icon} text-lg text-amber-300"></i>
          </div>
          <div>
            <span class="text-xs font-bold block text-white">${ing.name}</span>
            <span class="text-[10px] text-white/40">单件消耗: ${ing.need} 个</span>
          </div>
        </div>
        <div class="text-right">
          <span class="text-sm font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${stock} / ${ing.need}</span>
          <span class="block text-[9px] ${isEnough ? 'text-emerald-400/80' : 'text-rose-400/80'}">${isEnough ? '库存充足' : '材料匮乏'}</span>
        </div>
      `;
      ingContainer.appendChild(div);
    });
  }

  // 重置进度
  stopCraftingHold();
}

// 搜索配方
function handleRecipeSearch(query) {
  query = query.toLowerCase().trim();
  document.querySelectorAll('.recipe-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = (!query || text.includes(query)) ? 'flex' : 'none';
  });
}

// 检查当前配方原料是否充足
function canCraftCurrentRecipe() {
  const rec = craftingRecipes[currentCraftRecipeKey];
  if (!rec) return false;
  return rec.ingredients.every(ing => (playerInventory[ing.code] || 0) >= ing.need);
}

// 核心长按制造开始 (按住鼠标左键 或 按住空格)
function startCraftingHold(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (isCraftingHolding) return;

  if (!canCraftCurrentRecipe()) {
    playUiSound('craft_fail');
    showNotification('原料库存不足，无法进行手动装配！');
    return;
  }

  isCraftingHolding = true;
  craftHoldStartTime = performance.now();
  lastCraftHitSoundTime = craftHoldStartTime;

  const btn = document.getElementById('craftHoldBtn');
  if (btn) btn.classList.add('craft-btn-active');

  const statusText = document.getElementById('craftStatusText');
  if (statusText) statusText.innerText = '锻造敲击中...';
  playUiSound('craft_hit');

  // 帧动画循环
  function tick(now) {
    if (!isCraftingHolding) return;

    const rec = craftingRecipes[currentCraftRecipeKey];
    const durationMs = (rec ? rec.timeSec : 0.8) * 1000;
    const elapsed = now - craftHoldStartTime;
    craftHoldProgress = Math.min(100, (elapsed / durationMs) * 100);

    // 每隔 240ms 循环播放一次金属敲击音
    if (now - lastCraftHitSoundTime > 240) {
      playUiSound('craft_hit');
      lastCraftHitSoundTime = now;
    }

    // 环形进度条更新
    const ring = document.getElementById('craftCircleRing');
    const linearBar = document.getElementById('craftLinearBar');
    const percentText = document.getElementById('craftProgressPercent');
    
    if (ring) {
      const offset = 452 - (452 * (craftHoldProgress / 100));
      ring.setAttribute('stroke-dashoffset', offset);
    }
    if (linearBar) linearBar.style.width = craftHoldProgress + '%';
    if (percentText) percentText.innerText = Math.floor(craftHoldProgress) + '%';

    // 达到 100% 制作完成一次
    if (craftHoldProgress >= 100) {
      executeCraftSuccess();
      
      const autoRepeat = document.getElementById('autoRepeatCraftCheck')?.checked;
      if ((isCraftingHolding || autoRepeat) && canCraftCurrentRecipe()) {
        craftHoldStartTime = performance.now();
        lastCraftHitSoundTime = craftHoldStartTime;
        craftHoldProgress = 0;
        craftAnimFrameId = requestAnimationFrame(tick);
        return;
      } else {
        stopCraftingHold();
        return;
      }
    }

    craftAnimFrameId = requestAnimationFrame(tick);
  }

  craftAnimFrameId = requestAnimationFrame(tick);
}

// 停止长按
function stopCraftingHold() {
  const autoRepeat = document.getElementById('autoRepeatCraftCheck')?.checked;
  if (autoRepeat && isCraftingHolding) {
    return;
  }
  isCraftingHolding = false;
  cancelAnimationFrame(craftAnimFrameId);

  const btn = document.getElementById('craftHoldBtn');
  if (btn) btn.classList.remove('craft-btn-active');

  const ring = document.getElementById('craftCircleRing');
  const linearBar = document.getElementById('craftLinearBar');
  const percentText = document.getElementById('craftProgressPercent');

  if (ring) ring.setAttribute('stroke-dashoffset', 452);
  if (linearBar) linearBar.style.width = '0%';
  if (percentText) percentText.innerText = '0%';
  const statusText = document.getElementById('craftStatusText');
  if (statusText) statusText.innerText = '待命';
}

// 执行单次制作成功
function executeCraftSuccess() {
  const rec = craftingRecipes[currentCraftRecipeKey];
  if (!rec) return;

  // 扣除材料
  rec.ingredients.forEach(ing => {
    playerInventory[ing.code] -= ing.need;
  });

  // 产生成品
  playerInventory[rec.outCode] = (playerInventory[rec.outCode] || 0) + rec.outAmount;
  comboCraftCount++;

  playUiSound('craft_success');
  spawnCraftFlyBadge(`+${rec.outAmount} ${rec.name}`);
  syncInventoryDisplay();
}

// 浮动产出徽章动效
function spawnCraftFlyBadge(text) {
  const container = document.getElementById('craftFloatingBadgeContainer');
  if (!container) return;
  const badge = document.createElement('div');
  badge.className = 'item-fly-badge px-3 py-1 bg-amber-500/90 text-black font-bold text-xs rounded-full shadow-[0_0_15px_#f5921e] flex items-center space-x-1.5 font-mono mb-1';
  badge.innerHTML = `<i class="fa-solid fa-sparkles"></i><span>${text}</span>`;
  container.appendChild(badge);
  setTimeout(() => badge.remove(), 950);
}

// 快捷批量制造 (5 件或全部)
function craftBatchQuick(num) {
  playUiSound('click');
  const rec = craftingRecipes[currentCraftRecipeKey];
  if (!rec) return;

  let count = 0;
  while (canCraftCurrentRecipe() && count < num) {
    rec.ingredients.forEach(ing => {
      playerInventory[ing.code] -= ing.need;
    });
    playerInventory[rec.outCode] = (playerInventory[rec.outCode] || 0) + rec.outAmount;
    count++;
  }

  if (count > 0) {
    playUiSound('craft_success');
    spawnCraftFlyBadge(`批量完成: +${count * rec.outAmount} ${rec.name}`);
    showNotification(`急速制造完成: ${rec.name} x ${count * rec.outAmount}`);
    syncInventoryDisplay();
  } else {
    playUiSound('craft_fail');
    showNotification('原料不足，无法批量制造！');
  }
}

// 同步刷新所有界面中的物品库存数字 (工作台、建造器、背包)
function syncInventoryDisplay() {
  const rec = craftingRecipes[currentCraftRecipeKey];
  if (rec) {
    const invElem = document.getElementById('craftInventoryCount');
    if (invElem) invElem.innerText = `${playerInventory[rec.outCode] || 0} 件`;

    const ingContainer = document.getElementById('craftIngredientsContainer');
    if (ingContainer) {
      ingContainer.innerHTML = '';
      rec.ingredients.forEach(ing => {
        const stock = playerInventory[ing.code] || 0;
        const isEnough = stock >= ing.need;
        const div = document.createElement('div');
        div.className = 'bg-white/5 border border-white/10 rounded p-3 flex items-center justify-between';
        div.innerHTML = `
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white/10 rounded flex items-center justify-center">
              <i class="fa-solid ${ing.icon} text-lg text-amber-300"></i>
            </div>
            <div>
              <span class="text-xs font-bold block text-white">${ing.name}</span>
              <span class="text-[10px] text-white/40">单件消耗: ${ing.need} 个</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-sm font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${stock} / ${ing.need}</span>
            <span class="block text-[9px] ${isEnough ? 'text-emerald-400/80' : 'text-rose-400/80'}">${isEnough ? '库存充足' : '材料匮乏'}</span>
          </div>
        `;
        ingContainer.appendChild(div);
      });
    }
  }

  Object.keys(craftingRecipes).forEach(key => {
    const r = craftingRecipes[key];
    let maxCanMake = 9999;
    r.ingredients.forEach(ing => {
      const avail = Math.floor((playerInventory[ing.code] || 0) / ing.need);
      if (avail < maxCanMake) maxCanMake = avail;
    });
    const stockLabel = document.getElementById(`rcard-stock-${key}`);
    if (stockLabel) {
      stockLabel.innerText = `${maxCanMake} 可造`;
      stockLabel.className = `text-[11px] font-mono font-bold ${maxCanMake > 0 ? 'text-emerald-400' : 'text-white/30'}`;
    }
  });

  if (typeof currentSelectedBuilding !== 'undefined' && typeof buildingDatabase !== 'undefined' && buildingDatabase[currentSelectedBuilding]) {
    selectBuildingItem(currentSelectedBuilding);
  }
  if (typeof syncMilestoneTrackerDisplay === 'function') {
    syncMilestoneTrackerDisplay();
  }
}

// Image 1 折叠分类手风琴
function toggleRecipeGroupAccordion(headerElem) {
  const groupItems = headerElem.nextElementSibling;
  const arrow = headerElem.querySelector('.group-arrow');
  if (!groupItems) return;
  if (groupItems.classList.contains('hidden')) {
    groupItems.classList.remove('hidden');
    if (arrow) arrow.innerText = '-';
  } else {
    groupItems.classList.add('hidden');
    if (arrow) arrow.innerText = '+';
  }
}

// Image 1 过滤仅可制造
function toggleOnlyCraftableFilter(onlyCraftable) {
  document.querySelectorAll('.recipe-row').forEach(row => {
    if (!onlyCraftable) {
      row.style.display = 'flex';
    } else {
      const stockText = row.querySelector('span[id^="rcard-stock-"]')?.innerText || '[0]';
      const num = parseInt(stockText.replace(/\D/g, '')) || 0;
      row.style.display = num > 0 ? 'flex' : 'none';
    }
  });
}

// Image 1 储物整理
function sortCraftInventory() {
  playUiSound('click');
  showNotification('随身储物仓已完成自动分类与堆叠排序');
  renderCraftModalInventory();
  if (typeof renderPlayerEquipmentModal === 'function') {
    renderPlayerEquipmentModal();
  }
}

// 渲染制作台随身物品
function renderCraftModalInventory() {
  const grid = document.getElementById('craftAllItemsGrid');
  if (!grid || typeof activePlayerBagItems === 'undefined') return;
  grid.innerHTML = '';
  activePlayerBagItems.slice(0, 20).forEach(item => {
    if (!item) return;
    const div = document.createElement('div');
    div.className = 'relative w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/15 rounded flex items-center justify-center cursor-pointer transition';
    div.title = `${item.name} x${item.count}`;
    div.onclick = () => showNotification(`背包物料: ${item.name} x${item.count}`);
    div.innerHTML = `<i class="${item.icon} text-base"></i><span class="absolute bottom-0.5 right-1 text-[8px] font-mono text-white font-bold">${item.count}</span>`;
    grid.appendChild(div);
  });
}
