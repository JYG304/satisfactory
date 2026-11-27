// =========================================================================
// js/fabao_system.js - 《修仙工厂》法宝系统 (按键 N 呼出)
// 严格对照官方策划案 (策划案_V1_最终整合版.xlsx 与 xiuxian_data.js):
// 1. 核心载体：MAT_072【法宝阵图胚】(法宝中间态 - 绑定前可运输的法宝中间态)
// 2. 导脉工艺：MAT_068【导脉合金】(冶炼舱熔炼) ➔ MAT_069【导脉薄片】(切割机切削)
// 3. 稳脉工艺：MAT_070【法宝稳脉液】(搅拌机流固混合，只进入法宝阵图胚配方)
// 4. 煞气支线：MAT_073【煞气浓缩液】➔ MAT_067【煞气结晶】(法宝支线材料)
// 5. 炼宝设备：BD_148【炼宝台 / 渡劫台】+ MAT_071【矿脉定位件】+ MAT_041【高温合金锭】
// * 严正声明：剑匣为角色专属装备 (Tab 装备栏)，罗盘为 HUD 导航，二者均不属于法宝系统。
// =========================================================================

// 动态从官方策划表构建法宝支线物料库 (XIUXIAN_ITEMS 与 XIUXIAN_RECIPES)
function getFabaoMaterialsConfigFromTable() {
  const fabaoIds = ['fabao_array_embryo', 'daomai_sheet', 'daomai_alloy', 'fabao_pulse_liquid', 'sha_crystal', 'ore_vein_locator', 'high_temp_alloy_ingot'];
  const config = {};

  if (typeof XIUXIAN_ITEMS === 'undefined' || typeof XIUXIAN_RECIPES === 'undefined') {
    return config;
  }

  fabaoIds.forEach(id => {
    const it = XIUXIAN_ITEMS[id];
    if (!it) return;
    const rcp = Object.values(XIUXIAN_RECIPES).find(r => r.output && r.output.item === id);
    const bldKey = rcp ? (rcp.buildingId || rcp.building) : null;
    const bld = (bldKey && typeof XIUXIAN_BUILDINGS !== 'undefined') ? (XIUXIAN_BUILDINGS[bldKey] || XIUXIAN_BUILDINGS[aliases?.[bldKey]]) : null;
    const bldName = bld ? `${bld.name} (${bld.bldId || bldKey})` : (rcp ? rcp.building : '加工设施');

    const inputs = (rcp ? (rcp.inputs || []) : []).map(inp => {
      const inpItem = XIUXIAN_ITEMS[inp.item] || { name: inp.item, icon: 'fa-solid fa-cube text-white', matId: '' };
      return {
        name: inpItem.name,
        code: inp.item,
        matId: inpItem.matId || '',
        count: inp.count || inp.amount || 1,
        icon: inpItem.icon || 'fa-solid fa-cube text-white'
      };
    });

    config[id] = {
      id: id,
      matId: it.matId || '',
      name: it.name,
      category: it.category || '法宝材料',
      form: it.form || '实体',
      icon: it.icon || 'fa-solid fa-cube text-yellow-400',
      desc: it.desc || (rcp ? rcp.desc : ''),
      building: bldName,
      recipeTime: (rcp ? (rcp.timeSec || 30) : 30) + 's',
      inputs: inputs
    };
  });

  return config;
}

// 全局法宝物料配置代理，100% 动态读表
const FABAO_MATERIALS_CONFIG = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return target[prop];
    const liveConfig = getFabaoMaterialsConfigFromTable();
    return liveConfig[prop] || target[prop];
  },
  ownKeys() {
    const liveConfig = getFabaoMaterialsConfigFromTable();
    return Object.keys(liveConfig);
  },
  getOwnPropertyDescriptor(target, prop) {
    const liveConfig = getFabaoMaterialsConfigFromTable();
    if (prop in liveConfig) {
      return { configurable: true, enumerable: true, value: liveConfig[prop], writable: true };
    }
    return undefined;
  }
});


// 当前修士绑定的法宝阵图胚状态 (本命淬炼数据)
const FABAO_EMBRYO_STATE = {
  isBound: true, // 是否已完成神识本命绑定
  level: 2, // 淬炼品阶 (Lv.1 - Lv.5)
  maxLevel: 5,
  daomaiCount: 4, // 已铺设导脉薄片数量 (上限4)
  daomaiMax: 4,
  pulseLiquidInjected: 100, // 稳脉液注入度 (0-100%)
  shaCrystalConcentration: 78, // 煞气淬火浓度 (ppm)
  resonancePurity: 99.4, // 法脉契合度 (%)
  overloadThreshold: '3800 Pa', // 灵压耐受上限
  refiningBenchTuned: true, // 是否经由炼宝台调谐
  selectedMaterialKey: 'fabao_array_embryo'
};

// 切换 N 键法宝界面
function toggleFabaoModal() {
  playUiSound('toggle');
  const modal = document.getElementById('fabaoModal');
  if (!modal) return;
  if (modal.classList.contains('hidden')) {
    openFabaoModal();
  } else {
    closeFabaoModal();
  }
}

// 打开法宝界面
function openFabaoModal() {
  playUiSound('click');
  if (typeof closeOtherModals === 'function') closeOtherModals('fabaoModal');
  const modal = document.getElementById('fabaoModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  renderFabaoLeftStatus();
  renderFabaoMaterialsList();
  selectFabaoMaterial(FABAO_EMBRYO_STATE.selectedMaterialKey);
  if (window.FabaoSystem && typeof window.FabaoSystem.renderPanel === 'function') {
    window.FabaoSystem.renderPanel();
  }
}

// 关闭法宝界面
function closeFabaoModal() {
  playUiSound('click');
  const modal = document.getElementById('fabaoModal');
  if (modal) modal.classList.add('hidden');
}

// 渲染左栏：本命法宝阵图胚状态
function renderFabaoLeftStatus() {
  const s = FABAO_EMBRYO_STATE;
  
  const boundTag = document.getElementById('fabaoBoundBadge');
  if (boundTag) {
    if (s.isBound) {
      boundTag.innerText = '已完成本命神识绑定';
      boundTag.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    } else {
      boundTag.innerText = '未绑定 (待祭炼)';
      boundTag.className = 'text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
    }
  }

  const lvlTxt = document.getElementById('fabaoLevelText');
  if (lvlTxt) lvlTxt.innerText = `淬炼品阶: 第 ${s.level} 重 (上限 ${s.maxLevel} 重)`;

  const barDaomai = document.getElementById('fabaoBarDaomai');
  if (barDaomai) barDaomai.style.width = `${(s.daomaiCount / s.daomaiMax) * 100}%`;
  const txtDaomai = document.getElementById('fabaoTxtDaomai');
  if (txtDaomai) txtDaomai.innerText = `${s.daomaiCount} / ${s.daomaiMax} 轨`;

  const barPulse = document.getElementById('fabaoBarPulse');
  if (barPulse) barPulse.style.width = `${s.pulseLiquidInjected}%`;
  const txtPulse = document.getElementById('fabaoTxtPulse');
  if (txtPulse) txtPulse.innerText = `${s.pulseLiquidInjected}%`;

  const barSha = document.getElementById('fabaoBarSha');
  if (barSha) barSha.style.width = `${Math.min(100, s.shaCrystalConcentration)}%`;
  const txtSha = document.getElementById('fabaoTxtSha');
  if (txtSha) txtSha.innerText = `${s.shaCrystalConcentration} ppm`;

  const txtOverload = document.getElementById('fabaoTxtOverload');
  if (txtOverload) txtOverload.innerText = s.overloadThreshold;

  const txtPurity = document.getElementById('fabaoTxtPurity');
  if (txtPurity) txtPurity.innerText = `${s.resonancePurity}%`;

  const btnBind = document.getElementById('btnFabaoToggleBind');
  if (btnBind) {
    btnBind.innerText = s.isBound ? '解除神识绑定 (回归中间态物料)' : '神识共鸣绑定 (确立本命阵胚)';
    btnBind.className = s.isBound
      ? 'w-full py-2 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer'
      : 'w-full py-2 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-black transition cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.4)]';
  }
}

// 渲染右栏：法宝支线官方物料库列表
function renderFabaoMaterialsList() {
  const container = document.getElementById('fabaoMaterialsListContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.values(FABAO_MATERIALS_CONFIG).forEach(mat => {
    const isSelected = (mat.id === FABAO_EMBRYO_STATE.selectedMaterialKey);
    const stock = (typeof playerInventory !== 'undefined' && playerInventory[mat.id] !== undefined)
      ? playerInventory[mat.id]
      : (mat.id === 'fabao_array_embryo' ? 3 : 24);

    const item = document.createElement('div');
    item.className = `p-2.5 rounded-lg flex items-center justify-between border cursor-pointer transition select-none ${
      isSelected
        ? 'bg-[#1b2535] border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 text-white/80'
    }`;
    item.onclick = () => selectFabaoMaterial(mat.id);

    item.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-black/50 border border-white/15 flex items-center justify-center shrink-0">
          <i class="${mat.icon} text-base"></i>
        </div>
        <div class="flex flex-col">
          <div class="flex items-center space-x-1.5">
            <span class="text-xs font-bold text-white">${mat.name}</span>
            <span class="text-[9px] font-mono text-cyan-300 px-1 rounded bg-cyan-950/80 border border-cyan-800">${mat.matId}</span>
          </div>
          <span class="text-[10px] text-white/50 leading-none mt-1">${mat.category} · ${mat.form}</span>
        </div>
      </div>
      <div class="flex flex-col items-end">
        <span class="text-xs font-mono font-bold text-yellow-300">库存 ${stock}</span>
        <span class="text-[9px] text-white/40 font-mono mt-0.5">${mat.building.split(' ')[0]}</span>
      </div>
    `;
    container.appendChild(item);
  });
}

// 选中某个法宝物料查看详细产线与配方
function selectFabaoMaterial(matKey) {
  playUiSound('click');
  FABAO_EMBRYO_STATE.selectedMaterialKey = matKey;
  renderFabaoMaterialsList();

  const mat = FABAO_MATERIALS_CONFIG[matKey];
  if (!mat) return;

  // 更新中栏信息
  const titleEl = document.getElementById('fabaoMatDetailTitle');
  if (titleEl) titleEl.innerText = `${mat.name} (${mat.matId})`;

  const catEl = document.getElementById('fabaoMatDetailCategory');
  if (catEl) catEl.innerText = `${mat.category} · ${mat.form} · 生产设施: ${mat.building}`;

  const iconEl = document.getElementById('fabaoMatDetailIcon');
  if (iconEl) iconEl.className = `${mat.icon} text-4xl filter drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]`;

  const descEl = document.getElementById('fabaoMatDetailDesc');
  if (descEl) descEl.innerText = mat.desc;

  const recipeBldEl = document.getElementById('fabaoRecipeBuilding');
  if (recipeBldEl) recipeBldEl.innerText = mat.building;

  const recipeTimeEl = document.getElementById('fabaoRecipeTime');
  if (recipeTimeEl) recipeTimeEl.innerText = mat.recipeTime;

  // 渲染输入原料卡片
  const inputsContainer = document.getElementById('fabaoRecipeInputsContainer');
  if (inputsContainer) {
    inputsContainer.innerHTML = '';
    mat.inputs.forEach(inp => {
      const stock = (typeof playerInventory !== 'undefined' && playerInventory[inp.code] !== undefined)
        ? playerInventory[inp.code] : 16;
      const isEnough = stock >= inp.count;

      const card = document.createElement('div');
      card.className = `p-2 rounded bg-black/40 border ${isEnough ? 'border-white/15' : 'border-rose-500/50'} flex items-center justify-between text-xs`;
      card.innerHTML = `
        <div class="flex items-center space-x-2">
          <i class="${inp.icon} text-sm"></i>
          <div class="flex flex-col">
            <span class="font-bold text-white text-[11px]">${inp.name}</span>
            <span class="text-[9px] font-mono text-white/40">${inp.matId}</span>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <span class="font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${stock} / ${inp.count}</span>
          <span class="text-[8px] text-white/40">消耗</span>
        </div>
      `;
      inputsContainer.appendChild(card);
    });
  }
}

// 神识绑定/解绑切换
function toggleFabaoBindState() {
  playUiSound('hub_launch');
  FABAO_EMBRYO_STATE.isBound = !FABAO_EMBRYO_STATE.isBound;
  
  if (FABAO_EMBRYO_STATE.isBound) {
    showNotification('✨【本命神识绑定成功】已将【法宝阵图胚 (MAT_072)】与修士神识共鸣！');
  } else {
    showNotification('【解除本命绑定】法宝阵图胚已还原为流水线可运输中间态。');
  }
  renderFabaoLeftStatus();
}

// 投入导脉薄片强化回路
function injectDaomaiSheet() {
  if (FABAO_EMBRYO_STATE.daomaiCount >= FABAO_EMBRYO_STATE.daomaiMax) {
    showNotification('法宝阵图胚导脉回路已达到 4/4 满轨饱和！');
    return;
  }
  playUiSound('craft_success');
  FABAO_EMBRYO_STATE.daomaiCount++;
  FABAO_EMBRYO_STATE.resonancePurity = +(FABAO_EMBRYO_STATE.resonancePurity + 0.15).toFixed(1);
  showNotification(`⚡ 已铺设第 ${FABAO_EMBRYO_STATE.daomaiCount} 轨【导脉薄片 (MAT_069)】！法脉流转速率大幅提升！`);
  renderFabaoLeftStatus();
}

// 注入法宝稳脉液消除脉动谐振
function injectPulseLiquid() {
  playUiSound('water_pump');
  FABAO_EMBRYO_STATE.pulseLiquidInjected = 100;
  showNotification('💧 已将【法宝稳脉液 (MAT_070)】注入阵图回路！法脉谐振消除，结构稳定度 100%！');
  renderFabaoLeftStatus();
}

// 消耗煞气结晶进行淬火突破
function refineWithShaCrystal() {
  if (FABAO_EMBRYO_STATE.level >= FABAO_EMBRYO_STATE.maxLevel) {
    showNotification('当前法宝阵图胚已达最高淬炼品阶！');
    return;
  }
  playUiSound('hub_launch');
  FABAO_EMBRYO_STATE.level++;
  FABAO_EMBRYO_STATE.shaCrystalConcentration += 20;
  FABAO_EMBRYO_STATE.overloadThreshold = `${3800 + FABAO_EMBRYO_STATE.level * 800} Pa`;
  showNotification(`🔥【煞火淬炼突破】消耗【煞气结晶 (MAT_067)】淬炼成功！品阶升至第 ${FABAO_EMBRYO_STATE.level} 重！`);
  renderFabaoLeftStatus();
}

// 炼宝台开炉重铸
function triggerRefiningBenchCraft() {
  playUiSound('hub_launch');
  showNotification('⚒️【炼宝台 (BD_156) 联动】以【高温合金锭】与【矿脉定位件】重构法宝内部导流拓扑完成！');
  renderFabaoLeftStatus();
}

// =========================================================================
// V3.6 双法宝实战与工业联动系统 (window.FabaoSystem: 万魂幡/人皇旗 & 山河社稷图)
// =========================================================================
(function initFabaoSystem() {
  const WANHUN_TIERS = [1, 3, 5, 7, 10];
  const SHANHE_TIERS = [1, 3, 5, 7, 10];

  const state = {
    activeFabao: 'wanhun', // 'wanhun' | 'shanhe'
    wanhun: {
      tier: 1,
      title: '万魂幡',
      soulPower: 80,
      soulMax: 100,
      soulPressure: 20,
      backlashLocked: false,
      corpseRecipeSwitched: false,
      activeWorkers: 0,
      mainSoulAI: '金丹剑修残魂',
      lastDomainRadius: 8,
      lastDomainDuration: 10,
      curtainActive: false
    },
    shanhe: {
      tier: 1,
      title: '山河社稷图',
      lingyun: 90,
      lingyunMax: 100,
      wear: 10,
      isDormant: false,
      dongtianSlots: 1,
      dongtianItems: ['MAT_026'],
      projectedVein: null,
      wallWidth: 5,
      harvestedTotal: 0
    },
    third: {
      unlocked: false,
      title: '第三本命法宝（待封印设计）',
      tier: 1
    },
    altarState: {
      east: 'wanhun',
      west: 'shanhe'
    }
  };

  function resolveKey(matId) {
    if (typeof XIUXIAN_ITEMS === 'undefined') return null;
    const hit = Object.entries(XIUXIAN_ITEMS).find(([, v]) => v && v.matId === matId);
    return hit ? hit[0] : null;
  }

  function consumeMat(matId, count) {
    if (typeof playerInventory === 'undefined' || window.isCreativeMode) return true;
    const k = resolveKey(matId);
    if (!k || (playerInventory[k] || 0) < count) return false;
    playerInventory[k] -= count;
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    return true;
  }

  function grantMat(matId, count) {
    if (typeof playerInventory === 'undefined') return;
    const k = resolveKey(matId);
    if (k) {
      playerInventory[k] = (playerInventory[k] || 0) + count;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
  }

  function notify(msg) {
    if (typeof showNotification === 'function') showNotification(msg);
  }

  function selectActiveFabao(key) {
    if (key !== 'wanhun' && key !== 'shanhe' && key !== 'third') return state.activeFabao;
    state.activeFabao = key;
    if (typeof playUiSound === 'function') playUiSound('click');
    renderPanel();
    return state.activeFabao;
  }

  function setAltarFabao(slotKey, fabaoKey) {
    if (fabaoKey === 'third') {
      notify('🔒【第三本命法宝】槽位已预留，待后续设计封印后即可供奉镇厂！');
      return { ok: false, reason: 'reserved' };
    }
    if (!state.altarState) state.altarState = { east: 'wanhun', west: 'shanhe' };
    state.altarState[slotKey] = fabaoKey;
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    const zoneName = slotKey === 'east' ? '东楼·丹鹤祭坛' : '西楼·灵植祭坛';
    const fbName = fabaoKey === 'wanhun' ? '万魂幡（自动吸煞 + 魂工提速）' : '山河社稷图（洞天灵雨 + 免耗增产）';
    notify(`⛩️【镇厂法宝祭坛】${zoneName} 已改供【${fbName}】，3D 产线法阵已同步切换！`);
    if (typeof window !== 'undefined' && window.World3D && typeof window.World3D.syncBuildings === 'function') {
      window.World3D.syncBuildings();
    }
    renderPanel();
    return { ok: true, slotKey, fabaoKey };
  }

  function absorbSoulRemnant(amount = 25) {
    const w = state.wanhun;
    if (w.soulPower >= w.soulMax) {
      notify('【收魂已满】魂力槽已达上限，多余残魂不再吸收！');
      return { ok: false, soulPower: w.soulPower, soulMax: w.soulMax };
    }
    w.soulPower = Math.min(w.soulMax, w.soulPower + Math.max(1, Number(amount) || 25));
    if (typeof playUiSound === 'function') playUiSound('click');
    notify(`👻【万魂幡·收魂】吸收残魂！当前魂力 ${w.soulPower} / ${w.soulMax}`);
    renderPanel();
    return { ok: true, soulPower: w.soulPower, soulMax: w.soulMax };
  }

  function castGhostDomain() {
    const w = state.wanhun;
    if (w.backlashLocked) {
      notify('⚠️【反噬禁魔中】魂压已满 100%，万魂幡强制收拢！请前往炼宝台用稳脉液恢复！');
      return { ok: false, reason: 'backlash_locked' };
    }
    if (w.soulPower < 35) {
      notify('⚠️【魂力不足】展开鬼域需要 35 魂力！');
      return { ok: false, reason: 'low_soul' };
    }
    w.soulPower -= 35;
    const prevPressure = w.soulPressure;
    w.soulPressure = w.tier >= 10 ? Math.max(70, Math.min(100, w.soulPressure + 30)) : Math.min(100, w.soulPressure + 30);
    const baseRadius = w.tier >= 7 ? 10 : 8;
    const radius = prevPressure > 80 ? Math.round(baseRadius * 0.85 * 10) / 10 : baseRadius;
    const duration = w.tier >= 10 ? 15 : (w.tier >= 3 ? 12 : 10);
    w.lastDomainRadius = radius;
    w.lastDomainDuration = duration;
    if (w.soulPressure >= 100) {
      w.backlashLocked = true;
      notify(`💀【魂压过载反噬】魂压达到 100%，${w.title}强制收拢并禁魔 3 秒！请使用稳脉液修复！`);
    } else {
      notify(`🚩【${w.title}·${w.tier >= 10 ? '无尽鬼域' : '鬼域'}】消耗 35 魂力展开 ${radius}m 鬼域 (${duration}s)！普通怪减速聚拢，精英仅减速`);
    }
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    renderPanel();
    return { ok: true, radius, duration, soulPower: w.soulPower, soulPressure: w.soulPressure, backlashLocked: w.backlashLocked };
  }

  function castSoulCurtain() {
    const w = state.wanhun;
    if (w.tier < 5) {
      notify('⚠️【未解锁魂幕】需将万魂幡突破至 5 重【人皇旗】方可解锁魂幕！');
      return { ok: false, reason: 'tier_locked' };
    }
    if (w.backlashLocked || w.soulPower < 25) {
      notify('⚠️【无法施法】魂力不足 25 或处于反噬状态！');
      return { ok: false, reason: 'cannot_cast' };
    }
    w.soulPower -= 25;
    w.soulPressure = Math.min(100, w.soulPressure + 20);
    w.curtainActive = true;
    if (w.soulPressure >= 100) w.backlashLocked = true;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    notify(`🛡️【人皇旗·魂幕】消耗 25 魂力展开魂幕，鬼域内普通敌人攻击频率大幅降低！`);
    renderPanel();
    return { ok: true, soulPower: w.soulPower, soulPressure: w.soulPressure, backlashLocked: w.backlashLocked };
  }

  function toggleCorpseRecipeSwitch() {
    const w = state.wanhun;
    w.corpseRecipeSwitched = !w.corpseRecipeSwitched;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    notify(w.corpseRecipeSwitched
      ? '🩸【邪修配方切换·激活】已开启整尸血炼替代配方（RCP_175 气血丹 / RCP_176 破障丹 / RCP_177 凝丹液），直接用尸体省去细胞培养物料！'
      : '已切回常规正统工业配方路线。');
    renderPanel();
    return { ok: true, switched: w.corpseRecipeSwitched, recipes: ['RCP_175', 'RCP_176', 'RCP_177'] };
  }

  function absorbShaqiToSoul() {
    const w = state.wanhun;
    let drained = 8;
    if (typeof window.ShaqiSystem !== 'undefined' && window.ShaqiSystem.state) {
      const cur = Number(window.ShaqiSystem.state.level) || 0;
      drained = Math.min(cur, 8);
      window.ShaqiSystem.setLevel(Math.max(0, Math.round(cur - drained)));
    }
    w.soulPower = Math.min(w.soulMax, w.soulPower + 30);
    if (typeof playUiSound === 'function') playUiSound('water_pump');
    notify(`☢️【万魂幡·吸煞转魂】吸收炼化设施周边 ${drained}% 局部煞气 → 转化为 +30 魂力（当前 ${w.soulPower}/${w.soulMax}；不替代净化塔）`);
    renderPanel();
    return { ok: true, drainedShaqi: drained, soulPower: w.soulPower };
  }

  function summonSoulWorkers() {
    const w = state.wanhun;
    if (w.soulPower < 25) {
      notify('⚠️【魂力不足】激活【鬼火附炉 · 冥鹤超频】需要 25 魂力！');
      return { ok: false, reason: 'low_soul' };
    }
    w.soulPower -= 25;
    w.activeWorkers = 2;
    if (typeof playUiSound === 'function') playUiSound('craft_success');
    notify('🔥【万魂幡·鬼火附炉 · 冥鹤超频】消耗 25 魂力！残魂化作紫金鬼火注入丹炉与千纸鹤：局部丹炉免电猛烧且炼丹/尸解暴击产率翻倍！');
    renderPanel();
    return { ok: true, activeWorkers: w.activeWorkers, soulPower: w.soulPower };
  }

  function upgradeWanhunTier() {
    const w = state.wanhun;
    const idx = WANHUN_TIERS.indexOf(w.tier);
    if (idx < 0 || idx >= WANHUN_TIERS.length - 1) {
      notify('✨【人皇旗圆满】已达最高 10 重金光圆满形态！');
      return { ok: false, tier: w.tier };
    }
    const nextTier = WANHUN_TIERS[idx + 1];
    w.tier = nextTier;
    if (nextTier >= 3) w.soulMax = 120;
    if (nextTier === 5) w.title = '人皇旗';
    else if (nextTier === 7) w.title = '人皇旗（七重）';
    else if (nextTier === 10) w.title = '人皇旗（金光圆满）';
    w.soulPower = w.soulMax;
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    notify(`🚩【法宝晋升】已突破至第 ${w.tier} 重【${w.title}】！魂力上限 ${w.soulMax}`);
    renderPanel();
    return { ok: true, tier: w.tier, title: w.title, soulMax: w.soulMax };
  }

  function gatherLingyunByExplore(amount = 30) {
    const s = state.shanhe;
    if (s.isDormant) {
      notify('⚠️【山河图休眠中】灵韵耗尽已收卷休眠，请在炼宝台消耗稳脉液修补后再探索充能！');
      return { ok: false, reason: 'dormant' };
    }
    s.lingyun = Math.min(s.lingyunMax, s.lingyun + Math.max(1, Number(amount) || 30));
    if (typeof playUiSound === 'function') playUiSound('click');
    notify(`🗺️【山河图·收录充能】收录大地图水源山峰灵脉！灵韵 +${amount} → ${s.lingyun}/${s.lingyunMax}`);
    renderPanel();
    return { ok: true, lingyun: s.lingyun, lingyunMax: s.lingyunMax };
  }

  function harvestDongtianFudi() {
    const s = state.shanhe;
    if (s.isDormant || s.lingyun <= 0) {
      s.isDormant = true;
      notify('⚠️【收卷失效】山河图灵韵耗尽已收卷，洞天福地温养挂机已暂停！请先修补充能！');
      renderPanel();
      return { ok: false, reason: 'dormant' };
    }
    s.lingyun = Math.max(0, s.lingyun - 10);
    if (s.lingyun === 0) s.isDormant = true;
    const herbGain = 6 * s.dongtianSlots;
    const beastGain = 4 * s.dongtianSlots;
    const pillGain = 2 * s.dongtianSlots;
    grantMat('MAT_026', herbGain);
    grantMat('MAT_114', beastGain);
    grantMat('MAT_116', pillGain);
    s.harvestedTotal += herbGain + beastGain + pillGain;
    if (typeof playUiSound === 'function') playUiSound('craft_success');
    notify(`🌿【洞天福地 · 200% 无耗材收获】温养槽(${s.dongtianSlots})直接产出 成熟灵草×${herbGain} + 兽甲×${beastGain} + 妖丹×${pillGain}！`);
    renderPanel();
    return { ok: true, herbGain, beastGain, pillGain, lingyun: s.lingyun, isDormant: s.isDormant };
  }

  function projectOreVein(oreMatId = 'MAT_001') {
    const s = state.shanhe;
    if (s.tier < 3) {
      notify('⚠️【未解锁移山填海】需先将山河社稷图突破至 3 重，方可收录并投影 1 处基础矿脉！');
      return { ok: false, reason: 'tier_locked' };
    }
    if (s.isDormant || s.lingyun < 20) {
      notify('⚠️【无法投影】灵韵不足 20 或画卷已休眠！');
      return { ok: false, reason: 'low_lingyun' };
    }
    s.lingyun = Math.max(0, s.lingyun - 20);
    s.wear = Math.min(100, s.wear + 15);
    s.projectedVein = oreMatId;
    if (s.lingyun === 0) s.isDormant = true;
    if (typeof playUiSound === 'function') playUiSound('build_place');
    notify(`⛰️【移山填海】已将大地图【${oreMatId === 'MAT_002' ? '赤铜矿脉' : '玄铁矿脉'}】投影展开至主基地并提升富集度！`);
    renderPanel();
    return { ok: true, projectedVein: s.projectedVein, lingyun: s.lingyun, wear: s.wear };
  }

  function castShanheWall() {
    const s = state.shanhe;
    if (s.isDormant || s.lingyun <= 0) {
      s.isDormant = true;
      notify('⚠️【山河图休眠】灵韵已归零，请前往炼宝台用稳脉液修补唤醒！');
      renderPanel();
      return { ok: false, reason: 'dormant' };
    }
    s.lingyun = Math.max(0, s.lingyun - 25);
    s.wear = Math.min(100, s.wear + 20);
    if (s.lingyun === 0) s.isDormant = true;
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    notify(`🧱【山河障 (${s.wallWidth}m) + 缩地成寸】展开画卷阻挡普通怪绕路+吞没远程子弹，画卷内移速 +50%！（余灵韵 ${s.lingyun}）`);
    renderPanel();
    return { ok: true, wallWidth: s.wallWidth, moveSpeedBonus: '+50%', lingyun: s.lingyun, wear: s.wear, isDormant: s.isDormant };
  }

  function upgradeShanheTier() {
    const s = state.shanhe;
    const idx = SHANHE_TIERS.indexOf(s.tier);
    if (idx < 0 || idx >= SHANHE_TIERS.length - 1) {
      notify('✨【山河图圆满】已达 10 重巅峰品阶！');
      return { ok: false, tier: s.tier };
    }
    const nextTier = SHANHE_TIERS[idx + 1];
    s.tier = nextTier;
    if (nextTier === 3) {
      s.lingyunMax = 130;
      s.dongtianSlots = 2;
      s.dongtianItems = ['MAT_026', 'MAT_114'];
      s.wallWidth = 8;
    } else if (nextTier === 5) {
      s.lingyunMax = 160;
      s.dongtianSlots = 3;
      s.wallWidth = 10;
    } else if (nextTier === 7) {
      s.lingyunMax = 200;
    } else if (nextTier === 10) {
      s.lingyunMax = 250;
    }
    s.lingyun = s.lingyunMax;
    s.isDormant = false;
    s.wear = 0;
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    notify(`🏞️【山河图晋升】已突破至第 ${s.tier} 重！灵韵上限 ${s.lingyunMax} · 洞天槽位 ×${s.dongtianSlots} · 山河障 ${s.wallWidth}m`);
    renderPanel();
    return { ok: true, tier: s.tier, lingyunMax: s.lingyunMax, dongtianSlots: s.dongtianSlots, wallWidth: s.wallWidth };
  }

  function maintainWithPulseLiquid(targetKey) {
    const key = targetKey || state.activeFabao;
    if (!consumeMat('MAT_070', 1)) {
      if (typeof playUiSound === 'function') playUiSound('error');
      notify('⚠️【维护缺料】炼宝台维护法宝需要 法宝稳脉液 / 稳定液 (MAT_070)×1！');
      return { ok: false, reason: 'no_pulse_liquid' };
    }
    if (key === 'shanhe') {
      state.shanhe.wear = 0;
      state.shanhe.isDormant = false;
      state.shanhe.lingyun = Math.max(state.shanhe.lingyun, Math.round(state.shanhe.lingyunMax * 0.6));
      notify('💧【炼宝台维护成功】消耗 稳脉液(MAT_070)×1 修复山河社稷图磨损并唤醒休眠！');
    } else {
      state.wanhun.soulPressure = 0;
      state.wanhun.backlashLocked = false;
      notify('💧【炼宝台维护成功】消耗 稳脉液(MAT_070)×1 清零万魂幡魂压并解除反噬！');
    }
    if (typeof playUiSound === 'function') playUiSound('water_pump');
    renderPanel();
    return { ok: true, repaired: key };
  }

  function renderPanel() {
    const container = document.getElementById('fabaoDualPanel');
    if (!container) return;
    const isWanhun = state.activeFabao === 'wanhun';
    const isShanhe = state.activeFabao === 'shanhe';
    const isThird = state.activeFabao === 'third';
    const w = state.wanhun;
    const s = state.shanhe;
    const alt = state.altarState || { east: 'wanhun', west: 'shanhe' };
    const goldBadge = w.tier >= 10 ? 'bg-amber-400 text-black' : (w.tier >= 5 ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/60' : 'bg-purple-500/25 text-purple-200 border border-purple-400/50');

    container.innerHTML = `
      <div class="p-3 rounded-xl bg-[#0c1322] border border-cyan-500/35 space-y-2.5 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div class="flex flex-wrap items-center gap-1.5">
            <button onclick="window.FabaoSystem.selectActiveFabao('wanhun');" class="px-2.5 py-1 rounded font-bold cursor-pointer ${isWanhun ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">🚩 万魂幡 / 人皇旗 (${w.tier}重)</button>
            <button onclick="window.FabaoSystem.selectActiveFabao('shanhe');" class="px-2.5 py-1 rounded font-bold cursor-pointer ${isShanhe ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-300 hover:bg-white/20'}">🏞️ 山河社稷图 (${s.tier}重)</button>
            <button onclick="window.FabaoSystem.selectActiveFabao('third');" class="px-2.5 py-1 rounded font-bold cursor-pointer ${isThird ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400 hover:bg-white/20'}">🔒 第三法宝 (预留槽)</button>
          </div>
          <span class="text-[10px] font-mono text-cyan-300">统一维护：炼宝台 (BD_156) + 稳脉液 (MAT_070)</span>
        </div>

        ${isThird ? `
          <div class="p-3 rounded-lg bg-black/40 border border-amber-500/30 text-center space-y-1">
            <div class="text-amber-300 font-bold text-xs">🔒 第三本命法宝槽位（待设计封印）</div>
            <div class="text-[10px] text-slate-400">已预留法宝神识槽与镇厂祭坛接口，后续定稿后可直接接入主动技与产线光环。</div>
          </div>
        ` : (isWanhun ? `
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded font-black text-[11px] ${goldBadge}">${w.title} · 第 ${w.tier} 重</span>
              <span class="font-mono text-[11px] ${w.backlashLocked ? 'text-rose-400 font-black' : 'text-purple-200'}">魂力 ${w.soulPower}/${w.soulMax} · 魂压 ${w.soulPressure}% ${w.backlashLocked ? '⚠️反噬收幡' : (w.soulPressure > 80 ? '⚠️范围-15%' : '')}</span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-[10px]">
              <button onclick="window.FabaoSystem.absorbSoulRemnant(25);" class="px-2 py-1.5 rounded bg-purple-950/60 hover:bg-purple-900/70 border border-purple-400/50 text-purple-200 font-bold cursor-pointer">👻 收魂 (+25魂力)</button>
              <button onclick="window.FabaoSystem.castGhostDomain();" class="px-2 py-1.5 rounded bg-fuchsia-950/60 hover:bg-fuchsia-900/70 border border-fuchsia-400/50 text-fuchsia-200 font-bold cursor-pointer">🌀 展开鬼域 (-35魂力)</button>
              <button onclick="window.FabaoSystem.castSoulCurtain();" class="px-2 py-1.5 rounded bg-amber-950/60 hover:bg-amber-900/70 border border-amber-400/50 text-amber-200 font-bold cursor-pointer">🛡️ 人皇魂幕 (5重·-25)</button>
              <button onclick="window.FabaoSystem.toggleCorpseRecipeSwitch();" class="px-2 py-1.5 rounded ${w.corpseRecipeSwitched ? 'bg-rose-500 text-black' : 'bg-rose-950/60 text-rose-200 border border-rose-400/50'} font-bold cursor-pointer">🩸 邪修整尸切换 (${w.corpseRecipeSwitched ? '已开' : '关闭'})</button>
              <button onclick="window.FabaoSystem.absorbShaqiToSoul();" class="px-2 py-1.5 rounded bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-400/50 text-cyan-200 font-bold cursor-pointer">☢️ 吸煞转魂 (+30魂力)</button>
              <button onclick="window.FabaoSystem.summonSoulWorkers();" class="px-2 py-1.5 rounded bg-fuchsia-950/60 hover:bg-fuchsia-900/70 border border-fuchsia-400/50 text-fuchsia-200 font-bold cursor-pointer">🔥 鬼火附炉超频 (-25魂)</button>
            </div>
            <div class="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <button onclick="window.FabaoSystem.maintainWithPulseLiquid('wanhun');" class="px-2.5 py-1 rounded bg-cyan-500/25 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 font-bold cursor-pointer">💧 炼宝台稳脉液清魂压</button>
              <button onclick="window.FabaoSystem.upgradeWanhunTier();" class="px-2.5 py-1 rounded bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-200 font-bold cursor-pointer">⬆️ 淬炼晋升下一重</button>
            </div>
          </div>
        ` : `
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="px-2 py-0.5 rounded font-black text-[11px] bg-emerald-500/25 text-emerald-200 border border-emerald-400/50">${s.title} · 第 ${s.tier} 重</span>
              <span class="font-mono text-[11px] ${s.isDormant ? 'text-rose-400 font-black' : 'text-emerald-200'}">灵韵 ${s.lingyun}/${s.lingyunMax} · 磨损 ${s.wear}% · 洞天槽×${s.dongtianSlots} ${s.isDormant ? '⚠️休眠收卷' : ''}</span>
            </div>
            <div class="grid grid-cols-2 gap-1.5 text-[10px]">
              <button onclick="window.FabaoSystem.gatherLingyunByExplore(30);" class="px-2 py-1.5 rounded bg-sky-950/60 hover:bg-sky-900/70 border border-sky-400/50 text-sky-200 font-bold cursor-pointer">🗺️ 探索收录充灵韵 (+30)</button>
              <button onclick="window.FabaoSystem.harvestDongtianFudi();" class="px-2 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-400/50 text-emerald-200 font-bold cursor-pointer">🌿 洞天福地无耗材收菜 (200%)</button>
              <button onclick="window.FabaoSystem.projectOreVein('MAT_001');" class="px-2 py-1.5 rounded bg-amber-950/60 hover:bg-amber-900/70 border border-amber-400/50 text-amber-200 font-bold cursor-pointer">⛰️ 移山填海投影矿脉 (3重)</button>
              <button onclick="window.FabaoSystem.castShanheWall();" class="px-2 py-1.5 rounded bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-400/50 text-indigo-200 font-bold cursor-pointer">🧱 山河障(${s.wallWidth}m)+缩地成寸(+50%速)</button>
            </div>
            <div class="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
              <button onclick="window.FabaoSystem.maintainWithPulseLiquid('shanhe');" class="px-2.5 py-1 rounded bg-cyan-500/25 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 font-bold cursor-pointer">💧 炼宝台稳脉液修补唤醒</button>
              <button onclick="window.FabaoSystem.upgradeShanheTier();" class="px-2.5 py-1 rounded bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-200 font-bold cursor-pointer">⬆️ 晋升重数扩充槽位</button>
            </div>
          </div>
        `)}

        <div class="pt-2 border-t border-cyan-500/25 flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <span class="font-bold text-cyan-300">⛩️ 镇厂法宝祭坛（3D产线实时赋能）：</span>
          <div class="flex items-center space-x-2">
            <span class="text-slate-400">东楼:</span>
            <button onclick="window.FabaoSystem.setAltarFabao('east', '${alt.east === 'wanhun' ? 'shanhe' : 'wanhun'}');" class="px-2 py-0.5 rounded border border-purple-400/50 bg-purple-950/50 text-purple-200 font-bold cursor-pointer hover:bg-purple-800/60">
              ${alt.east === 'wanhun' ? '🚩 万魂幡(吸煞替工)' : '🏞️ 山河图(灵雨增产)'} ⇄
            </button>
            <span class="text-slate-400">西楼:</span>
            <button onclick="window.FabaoSystem.setAltarFabao('west', '${alt.west === 'shanhe' ? 'wanhun' : 'shanhe'}');" class="px-2 py-0.5 rounded border border-emerald-400/50 bg-emerald-950/50 text-emerald-200 font-bold cursor-pointer hover:bg-emerald-800/60">
              ${alt.west === 'shanhe' ? '🏞️ 山河图(灵雨增产)' : '🚩 万魂幡(吸煞替工)'} ⇄
            </button>
          </div>
        </div>
        ${(typeof window !== 'undefined' && window.FactorySelfLoop) ? `
          <div class="pt-1.5 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <span class="font-bold text-emerald-300">🔄 第一层内循环（产成品供回工厂）：</span>
            <div class="flex flex-wrap items-center gap-1.5">
              <button onclick="window.FactorySelfLoop.toggleLoop('altarLoopOn');" class="px-2 py-0.5 rounded font-bold cursor-pointer ${window.FactorySelfLoop.state.altarLoopOn ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-400'}">
                💧 稳定液直供祭坛24h续命 (${window.FactorySelfLoop.state.altarLoopOn ? 'ON' : 'OFF'})
              </button>
              <button onclick="window.FactorySelfLoop.toggleLoop('pillLoopOn');" class="px-2 py-0.5 rounded font-bold cursor-pointer ${window.FactorySelfLoop.state.pillLoopOn ? 'bg-amber-400 text-black' : 'bg-white/10 text-slate-400'}">
                💊 丹药回流供鹤/仙池 (${window.FactorySelfLoop.state.pillLoopOn ? 'ON' : 'OFF'})
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  window.FabaoSystem = {
    state,
    selectActiveFabao,
    setAltarFabao,
    absorbSoulRemnant,
    castGhostDomain,
    castSoulCurtain,
    toggleCorpseRecipeSwitch,
    absorbShaqiToSoul,
    summonSoulWorkers,
    upgradeWanhunTier,
    gatherLingyunByExplore,
    harvestDongtianFudi,
    projectOreVein,
    castShanheWall,
    upgradeShanheTier,
    maintainWithPulseLiquid,
    renderPanel
  };

  // ==================== 第一层价值出口：产成品 100% 供回工厂内循环自供系统 ====================
  const loopState = {
    pillLoopOn: true,
    altarLoopOn: true,
    chipLoopOn: true
  };

  function getMachineLoopBonus(machineId) {
    let speedMult = 1;
    let outMult = 1;
    const tags = [];
    if (loopState.pillLoopOn && ['beast_immortal_pool', 'immortal_herb_garden', 'incubator', 'petri_dish'].includes(machineId)) {
      outMult *= 1.5;
      tags.push('💊丹饲×1.5');
    }
    if (loopState.altarLoopOn && ['entropy_smelter', 'recomposer_mk3', 'alchemy_furnace_mk2', 'furnace', 'furnace_mk2', 'assembler', 'assembler_heavy', 'omni_assembler'].includes(machineId)) {
      speedMult *= 1.35;
      outMult *= 1.25;
      tags.push('⛩️祭坛续命 速×1.35 产×1.25');
    }
    if (loopState.chipLoopOn) {
      speedMult *= 1.2;
      tags.push('🧩芯供×1.2');
    }
    return { speedMult, outMult, tags };
  }

  function getCraneSpeedMultiplier() {
    return loopState.pillLoopOn ? 1.85 : 1.0;
  }

  function toggleLoop(loopKey) {
    if (!(loopKey in loopState)) return loopState;
    loopState[loopKey] = !loopState[loopKey];
    if (loopKey === 'altarLoopOn' && loopState.altarLoopOn) {
      state.wanhun.soulPressure = 0;
      state.wanhun.backlashLocked = false;
      state.wanhun.soulPower = state.wanhun.soulMax;
      state.shanhe.wear = 0;
      state.shanhe.isDormant = false;
      state.shanhe.lingyun = state.shanhe.lingyunMax;
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    const labels = {
      pillLoopOn: '💊【丹药内循环】供回万兽仙池(×1.5)/千机纸鹤(×1.85)',
      altarLoopOn: '💧【稳定液/煞晶内循环】直供镇厂法宝祭坛 24h 自动续命(魂压清零·速×1.35 产×1.25)',
      chipLoopOn: '🧩【控制芯内循环】供回光路阵盘中枢超频(全厂速×1.2)'
    };
    notify(`${labels[loopKey] || loopKey} 已${loopState[loopKey] ? '开启' : '关闭'}`);
    renderPanel();
    if (typeof renderMachineProdView === 'function') renderMachineProdView();
    if (typeof window !== 'undefined' && window.World3D && typeof window.World3D.syncBuildings === 'function') {
      window.World3D.syncBuildings();
    }
    return loopState[loopKey];
  }

  window.FactorySelfLoop = {
    state: loopState,
    toggleLoop,
    getMachineLoopBonus,
    getCraneSpeedMultiplier
  };
})();
