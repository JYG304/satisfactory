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
  showNotification('⚒️【炼宝台 (BD_148) 联动】以【高温合金锭】与【矿脉定位件】重构法宝内部导流拓扑完成！');
  renderFabaoLeftStatus();
}
