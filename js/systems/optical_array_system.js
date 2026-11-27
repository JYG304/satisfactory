// =========================================================================
// 中央处理器 · 灵枢光路阵盘与金丹/道果无限超频黑洞 (window.OpticalArrayHUD · 快捷键 [P])
// =========================================================================
(function initOpticalArrayHUD() {
  const state = {
    engravedChips: 4,
    socketedCores: 1,
    overdriveLayers: 0,
    sourceCounts: {
      factory_engrave: 4,
      sect_steal: 0,
      relic_comprehend: 0,
      corpse_decode: 0
    },
    chipSources: [
      { sourceType: 'factory_engrave', label: '初始光路刻录×4', count: 4 }
    ],
    lastSourceLabel: '初始刻录×4'
  };

  const SOURCE_LABEL_MAP = {
    sect_steal: '敌宗藏经阁偷取·上古光路秘图',
    relic_comprehend: '古修遗迹残碑·阵盘残图参悟',
    corpse_decode: '解构机逆向·修士神识残片',
    factory_engrave: '工厂光路刻录'
  };

  function resolveCanonicalKey(matIdOrName) {
    if (typeof XIUXIAN_ITEMS === 'undefined') return matIdOrName;
    const entries = Object.entries(XIUXIAN_ITEMS);
    const byMatId = entries.find(([, v]) => v && v.matId === matIdOrName);
    if (byMatId) return byMatId[0];
    const byName = entries.find(([, v]) => v && v.name === matIdOrName);
    if (byName) return byName[0];
    const byId = entries.find(([, v]) => v && v.id === matIdOrName);
    return byId ? byId[0] : matIdOrName;
  }

  function getStock(matId) {
    if (typeof playerInventory === 'undefined') return 0;
    return playerInventory[resolveCanonicalKey(matId)] || 0;
  }

  function getFactorySpeedMultiplier() {
    return Math.round((1 + state.engravedChips * 0.10 + state.socketedCores * 0.25 + state.overdriveLayers * 0.20) * 100) / 100;
  }

  function syncUi() {
    const mult = getFactorySpeedMultiplier();
    const topBadge = document.getElementById('hudOpticalMultBadge');
    if (topBadge) topBadge.innerText = `×${mult.toFixed(2)}`;

    const multText = document.getElementById('optTotalMultText');
    if (multText) multText.innerText = `×${mult.toFixed(2)}`;

    const chipEl = document.getElementById('optChipCount');
    if (chipEl) chipEl.innerText = `${state.engravedChips}`;

    const coreEl = document.getElementById('optCoreCount');
    if (coreEl) coreEl.innerText = `${state.socketedCores}`;

    const ovEl = document.getElementById('optOverdriveLayers');
    if (ovEl) ovEl.innerText = `${state.overdriveLayers}`;

    const sData = document.getElementById('optStockData');
    if (sData) sData.innerText = `${getStock('MAT_020')}`;
    const sChip = document.getElementById('optStockChip');
    if (sChip) sChip.innerText = `${getStock('MAT_124')}`;
    const sSoul = document.getElementById('optStockSoulChip');
    if (sSoul) sSoul.innerText = `${getStock('MAT_125')}`;
    const sCore = document.getElementById('optStockCore');
    if (sCore) sCore.innerText = `${getStock('MAT_126')}`;
    const sOv = document.getElementById('optStockOverdriveItem');
    if (sOv) sOv.innerText = `${getStock('MAT_085') + getStock('MAT_123')}`;

    const srcEl = document.getElementById('optChipSourcesText');
    if (srcEl) {
      const sc = state.sourceCounts || {};
      const parts = [];
      if (sc.factory_engrave) parts.push(`工厂刻录×${sc.factory_engrave}`);
      if (sc.sect_steal) parts.push(`藏经阁秘图×${sc.sect_steal}`);
      if (sc.relic_comprehend) parts.push(`遗迹参悟×${sc.relic_comprehend}`);
      if (sc.corpse_decode) parts.push(`解构逆向×${sc.corpse_decode}`);
      srcEl.innerText = parts.length > 0 ? `${parts.join(' · ')} (最新: ${state.lastSourceLabel})` : state.lastSourceLabel;
    }
  }

  function refreshAll() {
    syncUi();
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    if (typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && currentOpenedMachine) {
      renderMachineProdView();
    }
  }

  function engraveChip() {
    if (typeof playerInventory === 'undefined') return false;
    const kData = resolveCanonicalKey('MAT_020');
    const kChip = resolveCanonicalKey('MAT_124');
    const kSoul = resolveCanonicalKey('MAT_125');
    const dataHave = playerInventory[kData] || 0;
    const chipKey = (playerInventory[kChip] || 0) >= 1 ? kChip : ((playerInventory[kSoul] || 0) >= 1 ? kSoul : null);
    if (dataHave < 10 || !chipKey) {
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') showNotification('【刻录失败】需要：解析数据×10 与 光路芯片/神识光芯×1');
      return false;
    }
    playerInventory[kData] -= 10;
    playerInventory[chipKey] -= 1;
    state.engravedChips += 1;
    state.sourceCounts.factory_engrave = (state.sourceCounts.factory_engrave || 0) + 1;
    state.lastSourceLabel = '工厂刻录光路芯片';
    state.chipSources.push({ sourceType: 'factory_engrave', label: state.lastSourceLabel, count: 1 });
    if (typeof playUiSound === 'function') playUiSound('build_place');
    refreshAll();
    if (typeof showNotification === 'function') {
      showNotification(`🖨️【光路刻录成功】已装填第 ${state.engravedChips} 枚芯片！全厂算力提速至 ×${getFactorySpeedMultiplier().toFixed(2)}`);
    }
    return true;
  }

  function grantChipFromSource(sourceType, label) {
    const key = sourceType || 'sect_steal';
    const resolvedLabel = label || SOURCE_LABEL_MAP[key] || '大地图奇遇获取';
    state.engravedChips += 1;
    state.sourceCounts[key] = (state.sourceCounts[key] || 0) + 1;
    state.lastSourceLabel = resolvedLabel;
    state.chipSources.push({ sourceType: key, label: resolvedLabel, count: 1 });
    if (typeof playUiSound === 'function') playUiSound('build_place');
    refreshAll();
    if (typeof showNotification === 'function') {
      showNotification(`🧠【非工厂途径·阵盘芯片 +1】来源：${resolvedLabel} → 全厂算力提速至 ×${getFactorySpeedMultiplier().toFixed(2)}`);
    }
    if (window.MapExplorationSystem && typeof window.MapExplorationSystem.syncOpticalPanel === 'function') {
      window.MapExplorationSystem.syncOpticalPanel();
    }
    return {
      ok: true,
      sourceType: key,
      label: resolvedLabel,
      engravedChips: state.engravedChips,
      multiplier: getFactorySpeedMultiplier(),
      sourceCounts: { ...state.sourceCounts }
    };
  }

  function socketCore() {
    if (typeof playerInventory === 'undefined') return false;
    const kData = resolveCanonicalKey('MAT_020');
    const kCore = resolveCanonicalKey('MAT_126');
    if ((playerInventory[kData] || 0) < 25 || (playerInventory[kCore] || 0) < 1) {
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') showNotification('【镶嵌失败】需要：解析数据×25 与 阵盘极核×1');
      return false;
    }
    playerInventory[kData] -= 25;
    playerInventory[kCore] -= 1;
    state.socketedCores += 1;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshAll();
    if (typeof showNotification === 'function') {
      showNotification(`💠【阵盘极核共鸣】已激活 ${state.socketedCores} 枚极核！全厂算力提速至 ×${getFactorySpeedMultiplier().toFixed(2)}`);
    }
    return true;
  }

  function injectOverdrive() {
    if (typeof playerInventory === 'undefined') return false;
    const kData = resolveCanonicalKey('MAT_020');
    const kJindan = resolveCanonicalKey('MAT_085');
    const kDaoguo = resolveCanonicalKey('MAT_123');
    const ovKey = (playerInventory[kJindan] || 0) >= 1 ? kJindan : ((playerInventory[kDaoguo] || 0) >= 1 ? kDaoguo : null);
    if ((playerInventory[kData] || 0) < 50 || !ovKey) {
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') showNotification('【超频失败】需要：解析数据×50 与 人造金丹/飞升道果×1');
      return false;
    }
    playerInventory[kData] -= 50;
    playerInventory[ovKey] -= 1;
    state.overdriveLayers += 1;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    refreshAll();
    if (typeof showNotification === 'function') {
      showNotification(`🌌【无限超频第 ${state.overdriveLayers} 层】全厂产能倍率提升至 ×${getFactorySpeedMultiplier().toFixed(2)}！`);
    }
    return true;
  }

  function openModal() {
    if (typeof closeOtherModals === 'function') closeOtherModals('opticalArrayModal');
    const modal = document.getElementById('opticalArrayModal');
    const iframe = document.getElementById('opticalArrayIframe');
    if (iframe && iframe.dataset && iframe.dataset.src && !iframe.getAttribute('src')) {
      iframe.setAttribute('src', iframe.dataset.src);
    }
    if (modal) {
      modal.classList.remove('hidden');
      if (typeof playUiSound === 'function') playUiSound('toggle');
      syncUi();
    }
  }

  function closeModal() {
    const modal = document.getElementById('opticalArrayModal');
    if (modal) modal.classList.add('hidden');
  }

  function toggleModal() {
    const modal = document.getElementById('opticalArrayModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) openModal();
    else closeModal();
  }

  window.OpticalArrayHUD = {
    state,
    getFactorySpeedMultiplier,
    engraveChip,
    grantChipFromSource,
    socketCore,
    injectOverdrive,
    openModal,
    closeModal,
    toggleModal,
    syncUi,
  };

  syncUi();
})();
