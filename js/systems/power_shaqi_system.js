// =========================================================================
// 环境煞气（辐射双刃剑）动态交互系统 (window.ShaqiSystem · 快捷键 [U])
// =========================================================================
(function initShaqiSystem() {
  const BIO_SPEED_MACHINES = new Set([
    'petri_dish',
    'incubator',
    'wood_nursery',
    'immortal_herb_garden',
    'beast_pen',
    'beast_immortal_pool',
    'bd_163',
    'alchemy_table',
    'tribulation_table',
    'bio_base',
  ]);
  const EXEMPT_STANDARD_MACHINES = new Set([
    'waste_incinerator',
    'purifier',
    'bd_160',
    'battle_base',
    'thunder_turret',
    'fluid_hub',
    'power_engine',
    'wind_generator',
    'fuel_generator',
    'miner',
    'pump',
  ]);
  const INC_RATES = { off: 0, normal: 0.8, diffuse: 2.4 };
  const PUR_RATES = { off: 0, normal: -1.6, boost: -3.0 };

  const state = {
    level: 68,
    incineratorMode: 'diffuse', // 'off' | 'normal' | 'diffuse'
    purifierMode: 'normal',     // 'off' | 'normal' | 'boost'
    autoDamper: true,
    targetLevel: 75,
    turretHuntEnabled: true,
    condensedCount: 12,
    corpseHarvestCount: 6,
    waveThreat: 45,
    wavesRepelled: 0,
  };

  function resolveCanonicalItemKey(matIdOrName) {
    if (typeof XIUXIAN_ITEMS === 'undefined') return matIdOrName;
    const entries = Object.entries(XIUXIAN_ITEMS);
    const byMatId = entries.find(([, v]) => v && v.matId === matIdOrName);
    if (byMatId) return byMatId[0];
    const byName = entries.find(([, v]) => v && v.name === matIdOrName);
    if (byName) return byName[0];
    const byId = entries.find(([, v]) => v && v.id === matIdOrName);
    return byId ? byId[0] : matIdOrName;
  }

  function getTierInfo(lvlInput) {
    const raw = lvlInput !== undefined ? lvlInput : state.level;
    const lvl = Math.max(0, Math.min(100, Number(raw) || 0));
    if (lvl < 50) {
      return {
        tier: 'calm',
        label: '清朗稳态',
        badgeText: '清朗×1.0',
        bioMult: 1.0,
        bioBonusText: '无加成 (×1.0)',
        stdMult: 1.0,
        stdPenaltyText: '100% 正常运转',
        canHunt: false,
        color: 'text-sky-300',
        badgeBg: 'bg-sky-500/30 text-sky-100',
        barColor: 'from-sky-400 to-cyan-400',
      };
    }
    if (lvl < 70) {
      return {
        tier: 'tidal',
        label: '潮汐增幅',
        badgeText: '潮汐+25%',
        bioMult: 1.25,
        bioBonusText: '+25% 辐射超频',
        stdMult: 1.0,
        stdPenaltyText: '100% 正常运转',
        canHunt: lvl >= 60,
        color: 'text-emerald-300',
        badgeBg: 'bg-fuchsia-500/30 text-fuchsia-100',
        barColor: 'from-cyan-400 via-emerald-400 to-fuchsia-500',
      };
    }
    if (lvl <= 85) {
      return {
        tier: 'gold',
        label: '黄金潮汐',
        badgeText: '黄金+50%',
        bioMult: 1.5,
        bioBonusText: '+50% 黄金潮汐',
        stdMult: 1.0,
        stdPenaltyText: '100% 正常运转',
        canHunt: true,
        color: 'text-amber-300',
        badgeBg: 'bg-amber-500/35 text-amber-100',
        barColor: 'from-emerald-400 via-amber-400 to-fuchsia-500',
      };
    }
    return {
      tier: 'danger',
      label: '极危煞蚀',
      badgeText: '煞蚀-30%',
      bioMult: 1.5,
      bioBonusText: '+50% 过载极值',
      stdMult: 0.7,
      stdPenaltyText: '⚠️ -30% 煞蚀过载',
      canHunt: true,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-600/50 text-rose-100 animate-pulse',
      barColor: 'from-amber-400 via-rose-500 to-rose-600',
    };
  }

  function getBioSpeedMultiplier(machineId, lvlInput) {
    if (!BIO_SPEED_MACHINES.has(machineId)) return 1.0;
    return getTierInfo(lvlInput).bioMult;
  }

  function getStandardMachineMultiplier(machineId, lvlInput) {
    if (BIO_SPEED_MACHINES.has(machineId) || EXEMPT_STANDARD_MACHINES.has(machineId)) return 1.0;
    return getTierInfo(lvlInput).stdMult;
  }

  function getNetRatePerSec() {
    if (state.autoDamper) {
      const diff = state.targetLevel - state.level;
      if (Math.abs(diff) <= 0.5) return 0;
      return Math.max(-1.2, Math.min(1.2, Math.round(diff * 0.25 * 10) / 10));
    }
    const raw = (INC_RATES[state.incineratorMode] || 0) + (PUR_RATES[state.purifierMode] || 0);
    return Math.round(raw * 10) / 10;
  }

  function syncUi() {
    const lvl = Math.round(state.level);
    const tier = getTierInfo(lvl);
    const net = getNetRatePerSec();

    const pctEl = document.getElementById('hudShaqiPctText');
    if (pctEl) pctEl.innerText = `${lvl}%`;

    const badgeEl = document.getElementById('hudShaqiTierBadge');
    if (badgeEl) {
      badgeEl.innerText = tier.badgeText;
      badgeEl.className = `text-[10px] px-1.5 py-0.2 rounded ${tier.badgeBg}`;
    }

    const levelEl = document.getElementById('shaqiModalLevelVal');
    if (levelEl) {
      levelEl.innerText = `${lvl}% (${tier.label})`;
      levelEl.className = `text-xl font-black font-mono mt-1 ${tier.color}`;
    }

    const rateEl = document.getElementById('shaqiModalRateVal');
    if (rateEl) {
      rateEl.innerText = state.autoDamper && net === 0 ? '稳压锁定' : `${net >= 0 ? '+' : ''}${net}%/s`;
    }

    const bioEl = document.getElementById('shaqiModalBioBonusVal');
    if (bioEl) bioEl.innerText = tier.bioBonusText;

    const stdEl = document.getElementById('shaqiModalMachinePenaltyVal');
    if (stdEl) {
      stdEl.innerText = tier.stdPenaltyText;
      stdEl.className = `text-sm font-black font-mono mt-1.5 ${tier.stdMult < 1 ? 'text-rose-400' : 'text-emerald-300'}`;
    }

    const barEl = document.getElementById('shaqiModalProgressBar');
    if (barEl) {
      barEl.style.width = `${lvl}%`;
      barEl.className = `relative h-full bg-gradient-to-r ${tier.barColor} transition-all duration-300`;
    }

    const markerEl = document.getElementById('shaqiModalTargetMarker');
    if (markerEl) markerEl.style.left = `${state.targetLevel}%`;

    const condEl = document.getElementById('shaqiModalCondenseCount');
    if (condEl) condEl.innerText = `${state.condensedCount}`;

    const harvEl = document.getElementById('shaqiModalHarvestCount');
    if (harvEl) harvEl.innerText = `${state.corpseHarvestCount}`;

    const targetValEl = document.getElementById('shaqiTargetValText');
    if (targetValEl) targetValEl.innerText = `${state.targetLevel}%`;

    const sliderEl = document.getElementById('shaqiTargetSlider');
    if (sliderEl && Number(sliderEl.value) !== state.targetLevel) sliderEl.value = String(state.targetLevel);

    const damperBtn = document.getElementById('shaqiDamperToggleBtn');
    if (damperBtn) {
      damperBtn.innerText = `稳压锁定: ${state.autoDamper ? '开启' : '关闭'}`;
      damperBtn.className = `px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
        state.autoDamper ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.45)]' : 'bg-white/10 text-slate-300'
      }`;
    }

    const huntBtn = document.getElementById('shaqiHuntToggleBtn');
    if (huntBtn) {
      huntBtn.innerText = `自动引怪: ${state.turretHuntEnabled ? '开启' : '关闭'}`;
      huntBtn.className = `px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
        state.turretHuntEnabled ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-100' : 'bg-white/10 border border-white/15 text-slate-400'
      }`;
    }

    const incModes = ['off', 'normal', 'diffuse'];
    incModes.forEach(m => {
      const btn = document.getElementById(`shaqiIncBtn_${m}`);
      if (!btn) return;
      btn.className = m === state.incineratorMode
        ? 'py-1.5 px-2 rounded border border-orange-400 bg-orange-500/30 text-orange-100 transition cursor-pointer'
        : 'py-1.5 px-2 rounded border border-white/15 bg-white/5 hover:bg-white/15 text-slate-300 transition cursor-pointer';
    });

    const purModes = ['off', 'normal', 'boost'];
    purModes.forEach(m => {
      const btn = document.getElementById(`shaqiPurBtn_${m}`);
      if (!btn) return;
      btn.className = m === state.purifierMode
        ? 'py-1.5 px-2 rounded border border-emerald-400 bg-emerald-500/30 text-emerald-100 transition cursor-pointer'
        : 'py-1.5 px-2 rounded border border-white/15 bg-white/5 hover:bg-white/15 text-slate-300 transition cursor-pointer';
    });
  }

  function refreshLinkedViews() {
    syncUi();
    if (typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && currentOpenedMachine) {
      renderMachineProdView();
    }
    if (typeof renderStatsList === 'function') {
      renderStatsList();
    }
  }

  function setLevel(val) {
    state.level = Math.max(0, Math.min(100, Number(val) || 0));
    refreshLinkedViews();
    return state.level;
  }

  function setIncineratorMode(mode) {
    if (!(mode in INC_RATES)) return;
    state.incineratorMode = mode;
    if (mode !== 'off' && state.autoDamper && state.targetLevel < state.level) {
      state.autoDamper = false;
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshLinkedViews();
  }

  function setPurifierMode(mode) {
    if (!(mode in PUR_RATES)) return;
    state.purifierMode = mode;
    if (mode === 'boost' && state.autoDamper) {
      state.autoDamper = false;
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshLinkedViews();
  }

  function toggleAutoDamper() {
    state.autoDamper = !state.autoDamper;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshLinkedViews();
    if (typeof showNotification === 'function') {
      showNotification(`【智能控煞稳压阀】已${state.autoDamper ? `开启（锁定 ${state.targetLevel}%）` : '关闭（纯手动控制）'}`);
    }
  }

  function setTargetLevel(val) {
    state.targetLevel = Math.max(20, Math.min(95, Number(val) || 75));
    refreshLinkedViews();
  }

  function toggleTurretHunt() {
    state.turretHuntEnabled = !state.turretHuntEnabled;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshLinkedViews();
  }

  function injectWasteBoost() {
    let usedWasteMsg = '直排地脉煞气';
    if (typeof playerInventory !== 'undefined') {
      const kBlood = resolveCanonicalItemKey('MAT_031');
      const kSha = resolveCanonicalItemKey('MAT_033');
      if ((playerInventory[kSha] || 0) >= 2) {
        playerInventory[kSha] -= 2;
        usedWasteMsg = '消耗煞水×2 焚烧排煞';
      } else if ((playerInventory[kBlood] || 0) >= 2) {
        playerInventory[kBlood] -= 2;
        usedWasteMsg = '消耗血水×2 焚烧排煞';
      }
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    state.level = Math.min(100, Math.round(state.level + 15));
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshLinkedViews();
    const tier = getTierInfo();
    if (typeof showNotification === 'function') {
      showNotification(`🔥【排煞升温】${usedWasteMsg}！环境煞气 +15% → ${state.level}% (${tier.label})`);
    }
    return state.level;
  }

  function emergencyPurify() {
    if (state.level < 15) {
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') {
        showNotification('【抽煞跳过】当前环境煞气过低 (<15%)，无需紧急抽煞！');
      }
      return false;
    }
    state.level = Math.max(0, Math.round(state.level - 20));
    state.condensedCount += 1;
    if (typeof playerInventory !== 'undefined') {
      const kCrystal = resolveCanonicalItemKey('MAT_067');
      const kWater = resolveCanonicalItemKey('MAT_035');
      playerInventory[kCrystal] = (playerInventory[kCrystal] || 0) + 2;
      playerInventory[kWater] = (playerInventory[kWater] || 0) + 2;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshLinkedViews();
    if (typeof showNotification === 'function') {
      showNotification(`💎【紧急抽煞凝晶】煞气 -20% → ${state.level}%！已向背包入库：煞气结晶×2、净化水×2`);
    }
    return true;
  }

  function triggerTurretHarvest() {
    if (state.level < 60) {
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') {
        showNotification('【煞潮未启】当前煞气未达 60% 潮汐线，请先提高排煞引怪！');
      }
      return false;
    }
    const isHigh = state.level >= 78;
    let lootDesc = '';
    if (typeof playerInventory !== 'undefined') {
      const kQi = resolveCanonicalItemKey('MAT_017');
      const kZhu = resolveCanonicalItemKey('MAT_051');
      const kJin = resolveCanonicalItemKey('MAT_052');
      if (isHigh) {
        playerInventory[kJin] = (playerInventory[kJin] || 0) + 1;
        playerInventory[kZhu] = (playerInventory[kZhu] || 0) + 2;
        lootDesc = '金丹修士尸体×1、筑基修士尸体×2';
      } else {
        playerInventory[kZhu] = (playerInventory[kZhu] || 0) + 1;
        playerInventory[kQi] = (playerInventory[kQi] || 0) + 3;
        lootDesc = '筑基修士尸体×1、练气修士尸体×3';
      }
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    state.level = Math.max(0, Math.round(state.level - 5));
    state.corpseHarvestCount += 1;
    if (typeof playUiSound === 'function') playUiSound('click');
    refreshLinkedViews();
    if (typeof showNotification === 'function') {
      showNotification(`🗼【飞剑塔煞潮猎杀 + 千纸鹤收尸】自动截杀入厂煞潮修士并由千纸鹤入库！获得 ${lootDesc}`);
    }
    return true;
  }

  function triggerDemonWaveAssault() {
    state.wavesRepelled += 1;
    state.waveThreat = 15;
    state.corpseHarvestCount += 2;
    if (typeof playerInventory !== 'undefined') {
      const kBone = resolveCanonicalItemKey('MAT_140');
      const kCore = resolveCanonicalItemKey('MAT_141');
      const kGold = resolveCanonicalItemKey('MAT_052');
      if (kBone) playerInventory[kBone] = (playerInventory[kBone] || 0) + 2;
      if (kCore) playerInventory[kCore] = (playerInventory[kCore] || 0) + 1;
      if (kGold) playerInventory[kGold] = (playerInventory[kGold] || 0) + 2;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof window.World3D !== 'undefined' && typeof window.World3D.flashDefenseTurrets === 'function') {
      window.World3D.flashDefenseTurrets();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    refreshLinkedViews();
    if (typeof showNotification === 'function') {
      showNotification(`🌩️【天魔袭营防线反杀 · 第${state.wavesRepelled}波】飞剑塔+九霄雷暴塔齐射歼敌！千纸鹤已自动收尸入带，傀儡战备基站同步修塔：天魔道骨×2、反煞晶核×1、金丹尸体×2！`);
    }
    return {
      ok: true,
      wavesRepelled: state.wavesRepelled,
      waveThreat: state.waveThreat,
      loot: { MAT_140: 2, MAT_141: 1, MAT_052: 2 },
    };
  }

  function tick() {
    if (state.autoDamper) {
      const diff = state.targetLevel - state.level;
      if (Math.abs(diff) > 0.4) {
        const step = Math.sign(diff) * Math.min(Math.abs(diff), 0.6);
        state.level = Math.max(0, Math.min(100, Math.round((state.level + step) * 10) / 10));
      }
    } else {
      const delta = (INC_RATES[state.incineratorMode] || 0) + (PUR_RATES[state.purifierMode] || 0);
      if (delta !== 0) {
        state.level = Math.max(0, Math.min(100, Math.round((state.level + delta * 0.25) * 10) / 10));
      }
    }
    if (state.level >= 50) {
      state.waveThreat = Math.min(100, Math.round((state.waveThreat + 0.5) * 10) / 10);
    }
    syncUi();
  }

  function openModal() {
    if (typeof closeOtherModals === 'function') closeOtherModals('shaqiControlModal');
    const modal = document.getElementById('shaqiControlModal');
    if (modal) {
      modal.classList.remove('hidden');
      if (typeof playUiSound === 'function') playUiSound('toggle');
      syncUi();
    }
  }

  function closeModal() {
    const modal = document.getElementById('shaqiControlModal');
    if (modal) modal.classList.add('hidden');
  }

  function toggleModal() {
    const modal = document.getElementById('shaqiControlModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) openModal();
    else closeModal();
  }

  window.ShaqiSystem = {
    state,
    getTierInfo,
    getBioSpeedMultiplier,
    getStandardMachineMultiplier,
    getNetRatePerSec,
    setLevel,
    setIncineratorMode,
    setPurifierMode,
    toggleAutoDamper,
    setTargetLevel,
    toggleTurretHunt,
    injectWasteBoost,
    emergencyPurify,
    triggerTurretHarvest,
    triggerDemonWaveAssault,
    openModal,
    closeModal,
    toggleModal,
    syncUi,
    tick,
  };

  syncUi();
  if (typeof setInterval === 'function') {
    setInterval(tick, 1000);
  }
})();

// =========================================================================
// 全厂周天灵网实时功率仪表盘 · 雷池蓄电补缺口 · 天劫雷暴峰值 (window.PowerGridSystem)
// =========================================================================
(function initPowerGridSystem() {
  const state = {
    stormActive: false,
    stormPeakMW: 0,
    simulatedOverload: false,
    batteryStoredKJ: 2400
  };

  function resolveKeyByMat(matId) {
    if (typeof XIUXIAN_ITEMS === 'undefined') return null;
    const hit = Object.entries(XIUXIAN_ITEMS).find(([, v]) => v && v.matId === matId);
    return hit ? hit[0] : null;
  }

  function getGridStats() {
    let baseGenMW = 0;
    let baseLoadMW = 0;
    if (typeof worldBuildings !== 'undefined' && typeof XIUXIAN_BUILDINGS !== 'undefined') {
      worldBuildings.forEach(b => {
        const def = XIUXIAN_BUILDINGS[b.type] || XIUXIAN_BUILDINGS[b.type === 'smelter' ? 'furnace' : (b.type === 'constructor' ? 'cutter' : b.type)];
        if (def) {
          if ((def.power || 0) < 0) baseGenMW += Math.abs(def.power);
          else if ((def.powerGen || 0) > 0) baseGenMW += def.powerGen;
          else baseLoadMW += (def.power || 0);
        }
      });
    }
    if (baseGenMW <= 0) baseGenMW = 1200;
    const stormBonus = state.stormActive ? (state.stormPeakMW || 4500) : 0;
    const totalGenMW = Math.round(baseGenMW + stormBonus);
    const extraOverload = state.simulatedOverload ? Math.max(1200, Math.round(totalGenMW * 0.65)) : 0;
    const totalLoadMW = Math.round(baseLoadMW + extraOverload);
    const satisfactionPct = state.simulatedOverload
      ? Math.max(35, Math.min(85, Math.round((totalGenMW / Math.max(1, totalLoadMW)) * 100)))
      : (totalLoadMW <= 0 ? 100 : Math.min(100, Math.max(10, Math.round(((totalGenMW + (state.batteryStoredKJ > 0 ? 1200 : 0)) / totalLoadMW) * 100))));

    return {
      totalGenMW,
      totalLoadMW,
      satisfactionPct,
      batteryStoredKJ: state.batteryStoredKJ,
      stormActive: state.stormActive,
      simulatedOverload: state.simulatedOverload
    };
  }

  function getPowerThrottleMultiplier() {
    const stats = getGridStats();
    return Number((stats.satisfactionPct / 100).toFixed(2));
  }

  function syncUi() {
    const s = getGridStats();
    const topBtn = document.getElementById('hudPowerGridSummary');
    if (topBtn) {
      topBtn.innerText = s.stormActive
        ? `🌩️ 雷暴+${s.totalGenMW}W`
        : (s.satisfactionPct < 100 ? `⚠️ 欠压 ${s.satisfactionPct}%` : `⚡ 灵网 ${s.totalGenMW}W · 100%`);
    }
    const genEl = document.getElementById('gridTotalGenText');
    const loadEl = document.getElementById('gridTotalLoadText');
    const satEl = document.getElementById('gridSatisfactionText');
    const batEl = document.getElementById('gridBatteryText');
    const stormEl = document.getElementById('gridStormStatusText');
    const barEl = document.getElementById('gridLoadBar');
    if (genEl) genEl.innerText = `${s.totalGenMW} MW`;
    if (loadEl) loadEl.innerText = `${s.totalLoadMW} MW`;
    if (satEl) {
      satEl.innerText = `${s.satisfactionPct}%`;
      satEl.className = `text-lg font-black mt-1 ${s.satisfactionPct < 100 ? 'text-rose-400' : 'text-emerald-300'}`;
    }
    if (batEl) batEl.innerText = `${s.batteryStoredKJ} kJ`;
    if (stormEl) stormEl.innerText = s.stormActive ? `天象状态：🌩️ 天劫雷暴电涌中 (+${state.stormPeakMW} MW)` : (s.simulatedOverload ? '天象状态：⚠️ 电网过载降频测试中' : '天象状态：晴空稳态');
    if (barEl && barEl.style) barEl.style.width = `${s.satisfactionPct}%`;
  }

  function triggerTribulationStorm() {
    state.stormActive = true;
    state.stormPeakMW = 4500;
    state.simulatedOverload = false;
    state.batteryStoredKJ += 1200;
    if (typeof playerInventory !== 'undefined') {
      const kEmpty = resolveKeyByMat('MAT_147');
      const kFull = resolveKeyByMat('MAT_148');
      if (kEmpty && (playerInventory[kEmpty] || 0) > 0) {
        playerInventory[kEmpty] -= 1;
      }
      if (kFull) {
        playerInventory[kFull] = (playerInventory[kFull] || 0) + 1;
      }
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    syncUi();
    if (typeof showNotification === 'function') {
      showNotification('🌩️【天劫雷暴电涌】全厂仙光接引台与雷池蓄电枢功率暴涨 +4500MW！已快充 满载蓄灵匣×1');
    }
    return getGridStats();
  }

  function setSimulatedOverload(flag) {
    state.simulatedOverload = !!flag;
    if (state.simulatedOverload) {
      state.stormActive = false;
    }
    syncUi();
    if (typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && currentOpenedMachine) {
      renderMachineProdView();
    }
    return getGridStats();
  }

  function toggleSimulatedOverload() {
    const res = setSimulatedOverload(!state.simulatedOverload);
    if (typeof showNotification === 'function') {
      showNotification(state.simulatedOverload ? `⚠️【欠压降频】电网负荷超限，全厂机器已按供电率 ${res.satisfactionPct}% 降频运转` : '✅ 已解除电网过载模拟，全厂恢复 100% 转速');
    }
    return res;
  }

  function openModal() {
    if (typeof closeOtherModals === 'function') closeOtherModals('powerGridModal');
    const modal = document.getElementById('powerGridModal');
    if (modal) {
      modal.classList.remove('hidden');
      syncUi();
    }
  }

  function closeModal() {
    const modal = document.getElementById('powerGridModal');
    if (modal) modal.classList.add('hidden');
  }

  function toggleModal() {
    const modal = document.getElementById('powerGridModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) openModal();
    else closeModal();
  }

  window.PowerGridSystem = {
    state,
    getGridStats,
    getPowerThrottleMultiplier,
    triggerTribulationStorm,
    setSimulatedOverload,
    toggleSimulatedOverload,
    openModal,
    closeModal,
    toggleModal,
    syncUi
  };

  syncUi();
})();
