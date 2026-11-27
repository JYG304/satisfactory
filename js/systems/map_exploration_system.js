// =========================================================================
// 大地图 POI · 方案A敌宗藏经阁潜行偷残卷 + 残碑三选一 + 山河图奇观打卡 (window.MapExplorationSystem)
// =========================================================================
(function initMapExplorationSystem() {
  const DEFAULT_MAP_POIS = [
    // 4 座敌宗藏经阁宝塔
    { id: 'POI_SECT_01', name: '青云外阁藏经塔', type: 'sect_library', sect: '青云宗', wx: -56, wz: -52, baseAlert: 28, difficulty: '筑基初期', desc: '外门典籍楼，守卫换岗频密，藏有练气/筑基工业残卷与光路秘图。' },
    { id: 'POI_SECT_02', name: '血煞宗秘典阁', type: 'sect_library', sect: '血煞宗', wx: 56, wz: -54, baseAlert: 35, difficulty: '筑基中期', desc: '血煞邪修禁地藏经阁，戒备森严，富含生物炼制与化煞闭环残卷。' },
    { id: 'POI_SECT_03', name: '天机楼玄机塔', type: 'sect_library', sect: '天机阁', wx: -60, wz: 54, baseAlert: 42, difficulty: '金丹初期', desc: '机关重重的阵法宝塔，高概率顺手盗出「上古光路秘图」。' },
    { id: 'POI_SECT_04', name: '万法殿镇宗宝塔', type: 'sect_library', sect: '万法宗', wx: 62, wz: 52, baseAlert: 48, difficulty: '金丹中期', desc: '七层古塔，镇宗秘库内含高阶增产与飞升产业链古修残卷。' },
    // 3 座古修残碑
    { id: 'POI_RELIC_01', name: '太古化煞环保残碑', type: 'relic_stele', sect: '古修遗迹', wx: -52, wz: 10, baseAlert: 0, difficulty: '安全参悟', desc: '刻有废液闭环、水循环再造与化煞法门，可三选一参悟古修残卷。' },
    { id: 'POI_RELIC_02', name: '荒古灵植丹雾残碑', type: 'relic_stele', sect: '古修遗迹', wx: 12, wz: -58, baseAlert: 0, difficulty: '安全参悟', desc: '残存灵草催熟与丹雾增产古方，参悟后可补全工厂短板配方。' },
    { id: 'POI_RELIC_03', name: '上古星枢阵图残碑', type: 'relic_stele', sect: '古修遗迹', wx: 54, wz: -14, baseAlert: 0, difficulty: '安全参悟', desc: '碑面隐现灵枢光路星图，首次参悟可感悟 +1 光路阵盘芯片。' },
    // 4 处山河奇观柱
    { id: 'POI_WONDER_01', name: '碧落悬瀑灵潭柱', type: 'wonder_node', sect: '天地奇观', wx: -64, wz: -18, baseAlert: 0, difficulty: '山河收录', desc: '天生水脉奇观，收录入山河社稷图可直接充能灵韵 +35。' },
    { id: 'POI_WONDER_02', name: '苍梧古岳镇山柱', type: 'wonder_node', sect: '天地奇观', wx: -18, wz: 64, baseAlert: 0, difficulty: '山河收录', desc: '灵气郁结的苍翠主峰，打卡收录后为山河图充能 +35 灵韵。' },
    { id: 'POI_WONDER_03', name: '九霄雷泽灵脉柱', type: 'wonder_node', sect: '天地奇观', wx: 20, wz: 62, baseAlert: 0, difficulty: '山河收录', desc: '雷霆聚灵之地，山河图打卡收录可直接补充灵韵 +35。' },
    { id: 'POI_WONDER_04', name: '赤霞丹崖灵泉柱', type: 'wonder_node', sect: '天地奇观', wx: 66, wz: 18, baseAlert: 0, difficulty: '山河收录', desc: '地热丹霞奇景，山河图打卡收录直接充能灵韵 +35。' },
    // 2 座营地灯塔
    { id: 'POI_CAMP_01', name: '西境前哨引路灯塔', type: 'camp_beacon', sect: '散修营地', wx: -48, wz: 34, baseAlert: 0, difficulty: '安全区', desc: '散修前哨信标，休整并消除巡逻风声，降低宗门警戒度 -20%。' },
    { id: 'POI_CAMP_02', name: '北麓散修补给灯塔', type: 'camp_beacon', sect: '散修营地', wx: -26, wz: -54, baseAlert: 0, difficulty: '安全区', desc: '隐蔽补给灯塔，可校准罗盘坐标并降低宗门警戒度 -20%。' }
  ];

  const TYPE_META = {
    sect_library: { icon: '🏯', label: '藏经阁宝塔', badgeClass: 'bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-400/50' },
    relic_stele: { icon: '🪨', label: '古修残碑', badgeClass: 'bg-amber-500/25 text-amber-200 border-amber-400/50' },
    wonder_node: { icon: '🏞️', label: '山河奇观', badgeClass: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50' },
    camp_beacon: { icon: '🗼', label: '营地灯塔', badgeClass: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/50' }
  };

  const state = {
    alertness: 0,
    exposed: false,
    selectedPoiId: 'POI_SECT_01',
    currentScrollChoices: [],
    comprehendedScrolls: [],
    comprehendedSteles: [],
    checkedInWonders: [],
    stealCount: 0,
    secretMapsStolen: 0,
    lastActionLog: '已就绪：可选定敌宗藏经阁执行「方案A 潜行搜刮」，或参悟古修残碑、收录山河奇观。'
  };

  function normalizePoiList(list) {
    const cnTypeMap = {
      '敌方宗门藏经阁': 'sect_library',
      '古修遗迹残碑': 'relic_stele',
      '山河奇观与秘矿': 'wonder_node',
      '守矿修士营地': 'camp_beacon'
    };
    return (list || []).map(p => {
      if (!p) return p;
      const t = cnTypeMap[p.type] || p.type || (String(p.id || '').startsWith('POI_SECT_') ? 'sect_library' : (String(p.id || '').startsWith('POI_RELIC_') ? 'relic_stele' : (String(p.id || '').startsWith('POI_WONDER_') ? 'wonder_node' : 'camp_beacon')));
      return Object.assign({}, p, {
        type: t,
        wx: Number(p.wx ?? p.x ?? 0),
        wz: Number(p.wz ?? p.z ?? 0)
      });
    });
  }

  function getPois() {
    if (typeof window.XIUXIAN_MAP_POIS !== 'undefined' && window.XIUXIAN_MAP_POIS) {
      if (Array.isArray(window.XIUXIAN_MAP_POIS) && window.XIUXIAN_MAP_POIS.length > 0) {
        return normalizePoiList(window.XIUXIAN_MAP_POIS);
      }
      if (typeof window.XIUXIAN_MAP_POIS === 'object') {
        const vals = Object.values(window.XIUXIAN_MAP_POIS);
        if (vals.length > 0) return normalizePoiList(vals);
      }
    }
    return DEFAULT_MAP_POIS;
  }

  function findPoi(poiId, fallbackType) {
    const pois = getPois();
    if (poiId) {
      const hit = pois.find(p => p && p.id === poiId);
      if (hit) return hit;
    }
    if (state.selectedPoiId) {
      const sel = pois.find(p => p && p.id === state.selectedPoiId && (!fallbackType || p.type === fallbackType));
      if (sel) return sel;
    }
    return pois.find(p => p && (!fallbackType || p.type === fallbackType)) || pois[0];
  }

  function getAllScrolls() {
    if (typeof window.XIUXIAN_RELIC_SCROLLS !== 'undefined' && window.XIUXIAN_RELIC_SCROLLS) {
      return Object.values(window.XIUXIAN_RELIC_SCROLLS);
    }
    return [
      { scrollId: 'SCR_001', recipeCanonicalId: 'RCP_017', name: '培养液（回用水+蛋白液）', buildingName: '搅拌机', primaryOutName: '培养液', stage: 'I · 练气期', strategicValue: '废料闭环与水循环再造' },
      { scrollId: 'SCR_002', recipeCanonicalId: 'RCP_022', name: '灵草灰肥催熟', buildingName: '培养皿', primaryOutName: '成熟灵草', stage: 'I · 练气期', strategicValue: '以辅料替换卡脖子原料' },
      { scrollId: 'SCR_003', recipeCanonicalId: 'RCP_024', name: '高效肉块培养', buildingName: '培养仓', primaryOutName: '血胎', stage: 'II · 筑基期', strategicValue: '提升单机产出速率' }
    ];
  }

  function drawThreeUncomprehendedScrolls() {
    const all = getAllScrolls();
    const pool = all.filter(s => s && !state.comprehendedScrolls.includes(s.scrollId));
    const source = pool.length > 0 ? pool.slice() : all.slice();
    for (let i = source.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = source[i];
      source[i] = source[j];
      source[j] = tmp;
    }
    return source.slice(0, 3);
  }

  function getFabaoStealthReduction() {
    let shanheBonus = 0;
    let wanhunBonus = 0;
    if (window.FabaoSystem && window.FabaoSystem.state) {
      const s = window.FabaoSystem.state.shanhe;
      const w = window.FabaoSystem.state.wanhun;
      if (s && !s.isDormant) {
        shanheBonus = Math.min(12, 4 + (Number(s.tier) || 1) * 2);
      }
      if (w && !w.backlashLocked && (w.soulPower || 0) >= 10) {
        wanhunBonus = Math.min(12, 3 + (Number(w.tier) || 1) * 2);
      }
    }
    return {
      shanheBonus,
      wanhunBonus,
      total: Math.min(20, shanheBonus + wanhunBonus)
    };
  }

  function sneakIntoSectLibrary(poiId) {
    const poi = findPoi(poiId, 'sect_library');
    if (!poi) return { ok: false, reason: 'no_poi' };
    state.selectedPoiId = poi.id;

    if (state.exposed || state.alertness >= 100) {
      state.exposed = true;
      state.lastActionLog = `🚨 在【${poi.name}】处于暴露状态（警戒 100%），请先使用万魂幡鬼域或山河障脱身！`;
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') showNotification(state.lastActionLog);
      renderModal();
      return { ok: false, reason: 'exposed', alertness: state.alertness };
    }

    const baseGain = Number(poi.baseAlert) || 32;
    const jitter = Math.floor(Math.random() * 9);
    const reduction = getFabaoStealthReduction();
    const delta = Math.max(12, baseGain + jitter - reduction.total);
    state.alertness = Math.min(100, state.alertness + delta);

    if (state.alertness >= 100) {
      state.exposed = true;
      state.lastActionLog = `🚨【潜行暴露】潜入 ${poi.name} 时警戒度升至 100%（法宝减免 -${reduction.total}%），巡逻长老来袭！请立刻施展法宝脱身！`;
      if (typeof playUiSound === 'function') playUiSound('error');
      if (typeof showNotification === 'function') showNotification(state.lastActionLog);
      renderModal();
      return { ok: false, exposed: true, alertness: 100, poiId: poi.id };
    }

    state.stealCount += 1;
    state.currentScrollChoices = drawThreeUncomprehendedScrolls();

    let stoleSecretMap = false;
    let chipRes = null;
    if (Math.random() < 0.55) {
      stoleSecretMap = true;
      state.secretMapsStolen += 1;
      if (window.OpticalArrayHUD && typeof window.OpticalArrayHUD.grantChipFromSource === 'function') {
        chipRes = window.OpticalArrayHUD.grantChipFromSource('sect_steal', `${poi.name}·上古光路秘图`);
      }
    }

    state.lastActionLog = `🥷【方案A潜行成功】摸入 ${poi.name}（警戒 +${delta}%，法宝减免 -${reduction.total}% → 当前 ${state.alertness}%），搜得 ${state.currentScrollChoices.length} 枚古修残卷待三选一${stoleSecretMap ? '，并顺手偷走【上古光路秘图】→ 阵盘芯片 +1！' : '！'}`;
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') showNotification(state.lastActionLog);
    renderModal();
    return {
      ok: true,
      poiId: poi.id,
      alertness: state.alertness,
      choices: state.currentScrollChoices,
      stoleSecretMap,
      chipRes
    };
  }

  function useFabaoEscape(mode) {
    let usedDesc = '身法急退甩开巡逻';
    let targetAlert = 15;
    const fState = window.FabaoSystem && window.FabaoSystem.state;
    const useShanhe = mode === 'shanhe' || (!mode && fState && fState.shanhe && !fState.shanhe.isDormant && fState.shanhe.lingyun >= 15);
    const useWanhun = mode === 'wanhun' || (!useShanhe && fState && fState.wanhun && !fState.wanhun.backlashLocked && fState.wanhun.soulPower >= 15);

    if (useShanhe && fState && fState.shanhe && !fState.shanhe.isDormant && fState.shanhe.lingyun >= 15) {
      fState.shanhe.lingyun = Math.max(0, fState.shanhe.lingyun - 15);
      fState.shanhe.wear = Math.min(100, (fState.shanhe.wear || 0) + 8);
      if (fState.shanhe.lingyun === 0) fState.shanhe.isDormant = true;
      if (typeof window.FabaoSystem.renderPanel === 'function') window.FabaoSystem.renderPanel();
      usedDesc = '🏞️ 山河障+缩地成寸虚空隐遁 (-15灵韵)';
      targetAlert = 0;
    } else if (useWanhun && fState && fState.wanhun && !fState.wanhun.backlashLocked && fState.wanhun.soulPower >= 15) {
      fState.wanhun.soulPower = Math.max(0, fState.wanhun.soulPower - 15);
      fState.wanhun.soulPressure = Math.min(100, (fState.wanhun.soulPressure || 0) + 10);
      if (typeof window.FabaoSystem.renderPanel === 'function') window.FabaoSystem.renderPanel();
      usedDesc = '🚩 万魂幡展开鬼域迷雾遮断神识 (-15魂力)';
      targetAlert = 0;
    }

    state.alertness = targetAlert;
    state.exposed = false;
    state.lastActionLog = `💨【法宝脱身成功】施展 ${usedDesc}，宗门警戒已降至 ${state.alertness}%！`;
    if (typeof playUiSound === 'function') playUiSound('hub_launch');
    if (typeof showNotification === 'function') showNotification(state.lastActionLog);
    renderModal();
    return { ok: true, alertness: state.alertness, exposed: state.exposed, method: usedDesc };
  }

  function comprehendRelicStele(poiId) {
    const poi = findPoi(poiId, 'relic_stele');
    if (!poi) return { ok: false, reason: 'no_poi' };
    state.selectedPoiId = poi.id;
    state.currentScrollChoices = drawThreeUncomprehendedScrolls();

    let grantedChip = false;
    if (!state.comprehendedSteles.includes(poi.id)) {
      state.comprehendedSteles.push(poi.id);
      if (window.OpticalArrayHUD && typeof window.OpticalArrayHUD.grantChipFromSource === 'function') {
        window.OpticalArrayHUD.grantChipFromSource('relic_comprehend', `${poi.name}·残碑阵图感悟`);
        grantedChip = true;
      }
    }

    state.lastActionLog = `🪨【古修残碑参悟】解读【${poi.name}】，展开 ${state.currentScrollChoices.length} 枚残卷供三选一${grantedChip ? '，并首次悟得阵盘光路芯片 +1！' : '。'}`;
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') showNotification(state.lastActionLog);
    renderModal();
    return { ok: true, poiId: poi.id, choices: state.currentScrollChoices, grantedChip };
  }

  function pickRelicScroll(scrollId) {
    const all = getAllScrolls();
    const scroll = state.currentScrollChoices.find(s => s && s.scrollId === scrollId) || all.find(s => s && s.scrollId === scrollId);
    if (!scroll) return { ok: false, reason: 'scroll_not_found' };

    if (!state.comprehendedScrolls.includes(scroll.scrollId)) {
      state.comprehendedScrolls.push(scroll.scrollId);
    }
    state.currentScrollChoices = [];
    window.comprehendedRelicScrolls = state.comprehendedScrolls.slice();

    state.lastActionLog = `📜【残卷参悟完成】习得「${scroll.name}」(${scroll.scrollId} · ${scroll.recipeCanonicalId || ''} · ${scroll.buildingName || ''}产出${scroll.primaryOutName || ''})！`;
    const inlineOv = document.getElementById('worldRelicChoiceOverlay');
    if (inlineOv) inlineOv.classList.add('hidden');
    if (typeof playUiSound === 'function') playUiSound('craft_success');
    if (typeof showNotification === 'function') showNotification(state.lastActionLog);
    renderModal();
    return { ok: true, scroll, totalComprehended: state.comprehendedScrolls.length };
  }

  function showInlineRelicChoiceOverlay(sourceLabel) {
    const ov = document.getElementById('worldRelicChoiceOverlay');
    const cardsEl = document.getElementById('worldRelicChoiceCards');
    const titleEl = document.getElementById('worldRelicChoiceTitle');
    if (!ov || !cardsEl || !state.currentScrollChoices || state.currentScrollChoices.length === 0) return;
    if (titleEl) {
      titleEl.innerText = `📜【${sourceLabel || '现场搜刮'}】古修残卷三选一（选定即解锁）`;
    }
    cardsEl.innerHTML = state.currentScrollChoices.map(scr => `
      <button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.pickRelicScroll('${scr.scrollId}');" class="text-left p-2.5 rounded-lg bg-[#121e33] hover:bg-[#192a47] border border-amber-400/60 hover:border-amber-300 transition cursor-pointer flex flex-col justify-between space-y-1.5">
        <div>
          <div class="flex items-center justify-between text-[10px] font-mono">
            <span class="text-amber-300 font-bold">${scr.scrollId}</span>
            <span class="text-cyan-300">${scr.stage || ''}</span>
          </div>
          <div class="text-xs font-black text-white mt-0.5">${scr.name}</div>
          <div class="text-[10px] text-slate-300 mt-0.5">设备：${scr.buildingName || '-'} → ${scr.primaryOutName || '-'}</div>
        </div>
        <div class="text-[10px] text-emerald-300/90 border-t border-white/10 pt-1">✦ ${scr.strategicValue || '解锁高阶替代配方'}</div>
      </button>
    `).join('');
    ov.classList.remove('hidden');
  }

  function exploreWonderNode(poiId) {
    const poi = findPoi(poiId, 'wonder_node');
    if (!poi) return { ok: false, reason: 'no_poi' };
    state.selectedPoiId = poi.id;
    if (!state.checkedInWonders.includes(poi.id)) {
      state.checkedInWonders.push(poi.id);
    }
    let fabaoRes = null;
    if (window.FabaoSystem && typeof window.FabaoSystem.gatherLingyunByExplore === 'function') {
      fabaoRes = window.FabaoSystem.gatherLingyunByExplore(35);
    }
    state.lastActionLog = `🏞️【山河奇观打卡】收录【${poi.name}】灵脉地势，触发山河社稷图充能 +35 灵韵！`;
    renderModal();
    return { ok: true, poiId: poi.id, checkedInCount: state.checkedInWonders.length, fabaoRes };
  }

  function visitCampBeacon(poiId) {
    const poi = findPoi(poiId, 'camp_beacon');
    if (!poi) return { ok: false, reason: 'no_poi' };
    state.selectedPoiId = poi.id;
    state.alertness = Math.max(0, state.alertness - 20);
    if (state.alertness < 100) state.exposed = false;
    state.lastActionLog = `🗼【营地灯塔休整】在【${poi.name}】校准罗盘并隐匿行踪，宗门警戒度 -20% → ${state.alertness}%`;
    if (typeof playUiSound === 'function') playUiSound('click');
    if (typeof showNotification === 'function') showNotification(state.lastActionLog);
    renderModal();
    return { ok: true, poiId: poi.id, alertness: state.alertness };
  }

  function decodeCorpseChip() {
    let usedNote = '逆向神识残骸样本';
    if (typeof playerInventory !== 'undefined' && typeof XIUXIAN_ITEMS !== 'undefined') {
      const kBrain = Object.keys(XIUXIAN_ITEMS).find(k => XIUXIAN_ITEMS[k] && XIUXIAN_ITEMS[k].matId === 'MAT_019');
      const kData = Object.keys(XIUXIAN_ITEMS).find(k => XIUXIAN_ITEMS[k] && XIUXIAN_ITEMS[k].matId === 'MAT_020');
      if (kBrain && (playerInventory[kBrain] || 0) >= 1) {
        playerInventory[kBrain] -= 1;
        usedNote = '解构机逆向修士脑髓(MAT_019)×1';
      } else if (kData && (playerInventory[kData] || 0) >= 5) {
        playerInventory[kData] -= 5;
        usedNote = '解构逆向解析数据(MAT_020)×5';
      }
    }
    if (window.OpticalArrayHUD && typeof window.OpticalArrayHUD.grantChipFromSource === 'function') {
      const res = window.OpticalArrayHUD.grantChipFromSource('corpse_decode', usedNote);
      state.lastActionLog = `⚗️【解构逆向出芯】通过「${usedNote}」提取光路芯片 +1，全厂算力提升至 ×${res.multiplier.toFixed(2)}！`;
      renderModal();
      return res;
    }
    return { ok: false };
  }

  function focusPoiIn3D(poiId) {
    const poi = findPoi(poiId);
    if (!poi) return false;
    state.selectedPoiId = poi.id;
    if (window.World3D && typeof window.World3D.focusMapPOI === 'function') {
      window.World3D.focusMapPOI(poi.id);
    }
    renderModal();
    return true;
  }

  function syncOpticalPanel() {
    const panel = document.getElementById('mapOpticalSourcesPanel');
    if (!panel) return;
    const opt = window.OpticalArrayHUD;
    const mult = opt && typeof opt.getFactorySpeedMultiplier === 'function' ? opt.getFactorySpeedMultiplier() : 1;
    const chips = opt && opt.state ? opt.state.engravedChips : 0;
    const sc = (opt && opt.state && opt.state.sourceCounts) || {};
    const recent = (opt && opt.state && Array.isArray(opt.state.chipSources)) ? opt.state.chipSources.slice(-3).reverse() : [];
    panel.innerHTML = `
      <div class="grid grid-cols-3 gap-2">
        <div class="p-2 rounded bg-black/40 border border-fuchsia-400/35">
          <div class="text-[10px] text-slate-400">藏经阁偷秘图</div>
          <div class="text-sm font-black text-fuchsia-300">+${sc.sect_steal || 0} 枚</div>
        </div>
        <div class="p-2 rounded bg-black/40 border border-amber-400/35">
          <div class="text-[10px] text-slate-400">古修残碑参悟</div>
          <div class="text-sm font-black text-amber-300">+${sc.relic_comprehend || 0} 枚</div>
        </div>
        <div class="p-2 rounded bg-black/40 border border-cyan-400/35">
          <div class="text-[10px] text-slate-400">解构逆向出芯</div>
          <div class="text-sm font-black text-cyan-300">+${sc.corpse_decode || 0} 枚</div>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span class="text-sky-200">当前总芯片：<b class="text-cyan-300">${chips}</b> · 全厂算力倍率：<b class="text-amber-300">×${mult.toFixed(2)}</b></span>
        <button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.decodeCorpseChip();" class="px-2.5 py-1 rounded bg-cyan-600/75 hover:bg-cyan-500 border border-cyan-300/60 text-white text-[10px] font-bold cursor-pointer transition">
          ⚗️ 解构逆向提取神识芯片 (corpse_decode)
        </button>
      </div>
      <div class="text-[10px] text-slate-300 bg-black/35 rounded px-2 py-1 border border-white/10">
        最近入盘记录：${recent.length ? recent.map(r => r.label).join(' ｜ ') : '暂无'}
      </div>
    `;
  }

  function renderModal() {
    const modal = document.getElementById('mapExploreModal');
    if (!modal) return;

    const pois = getPois();
    const alertBar = document.getElementById('sneakAlertnessBar');
    const alertText = document.getElementById('sneakAlertnessText');
    const exposedBox = document.getElementById('sneakExposedAlert');
    const bonusHint = document.getElementById('sneakFabaoBonusHint');
    const statusLog = document.getElementById('mapExploreStatusLog');

    if (alertBar) alertBar.style.width = `${state.alertness}%`;
    if (alertText) {
      alertText.innerText = state.exposed
        ? `警戒度 ${state.alertness}% (已暴露·需脱身)`
        : (state.alertness >= 70 ? `警戒度 ${state.alertness}% (高危逼近)` : `警戒度 ${state.alertness}% (安全隐匿)`);
      alertText.className = `text-[11px] font-mono font-bold ${state.exposed ? 'text-rose-400' : (state.alertness >= 70 ? 'text-amber-300' : 'text-emerald-300')}`;
    }
    if (exposedBox) {
      if (state.exposed || state.alertness >= 100) exposedBox.classList.remove('hidden');
      else exposedBox.classList.add('hidden');
    }
    if (bonusHint) {
      const red = getFabaoStealthReduction();
      bonusHint.innerText = `法宝潜行减警戒：山河图-${red.shanheBonus}% · 万魂幡-${red.wanhunBonus}% (合计 -${red.total}%)`;
    }
    if (statusLog) statusLog.innerText = state.lastActionLog;

    const cCount = document.getElementById('relicComprehendedCount');
    if (cCount) cCount.innerText = `${state.comprehendedScrolls.length}`;
    const wCount = document.getElementById('wonderCheckinCount');
    const totalWonders = pois.filter(p => p && p.type === 'wonder_node').length || 4;
    if (wCount) wCount.innerText = `${state.checkedInWonders.length}/${totalWonders}`;
    const sCount = document.getElementById('sectSecretMapCount');
    if (sCount) sCount.innerText = `${state.secretMapsStolen}`;

    // POI 列表渲染
    const poiListEl = document.getElementById('mapPoiList');
    if (poiListEl) {
      poiListEl.innerHTML = pois.map(poi => {
        const meta = TYPE_META[poi.type] || TYPE_META.relic_stele;
        const isSel = state.selectedPoiId === poi.id;
        let actionBtn = '';
        if (poi.type === 'sect_library') {
          actionBtn = `<button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.sneakIntoSectLibrary('${poi.id}');" class="px-2 py-0.5 rounded bg-fuchsia-600/80 hover:bg-fuchsia-500 text-white text-[10px] font-bold cursor-pointer">🕵️ 潜行搜刮</button>`;
        } else if (poi.type === 'relic_stele') {
          actionBtn = `<button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.comprehendRelicStele('${poi.id}');" class="px-2 py-0.5 rounded bg-amber-500/80 hover:bg-amber-400 text-black text-[10px] font-bold cursor-pointer">🪨 参悟残碑</button>`;
        } else if (poi.type === 'wonder_node') {
          const checked = state.checkedInWonders.includes(poi.id);
          actionBtn = `<button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.exploreWonderNode('${poi.id}');" class="px-2 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer">${checked ? '🏞️ 再充灵韵+35' : '🏞️ 打卡+35'}</button>`;
        } else {
          actionBtn = `<button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.visitCampBeacon('${poi.id}');" class="px-2 py-0.5 rounded bg-cyan-600/80 hover:bg-cyan-500 text-white text-[10px] font-bold cursor-pointer">🗼 休整降警-20%</button>`;
        }
        return `
          <div class="p-2 rounded-lg border ${isSel ? 'border-indigo-400 bg-indigo-950/45' : 'border-white/10 bg-black/30'} flex flex-wrap items-center justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex items-center space-x-1.5">
                <span>${meta.icon}</span>
                <span class="font-bold text-slate-100 truncate">${poi.name}</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded border ${meta.badgeClass}">${meta.label}</span>
                <span class="text-[10px] font-mono text-slate-400">(${poi.wx}, ${poi.wz})</span>
              </div>
              <div class="text-[10px] text-slate-400 truncate mt-0.5">${poi.desc || poi.sect || ''}</div>
            </div>
            <div class="flex items-center space-x-1.5 shrink-0">
              <button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.focusPoiIn3D('${poi.id}');" class="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] cursor-pointer" title="将 3D 视界定位到该地标">🎯</button>
              ${actionBtn}
            </div>
          </div>
        `;
      }).join('');
    }

    // 古修残卷三选一参悟区
    const pickEl = document.getElementById('relicPickCards');
    if (pickEl) {
      if (state.currentScrollChoices.length === 0) {
        pickEl.innerHTML = `<div class="col-span-3 text-[11px] font-mono text-slate-400 py-4 text-center bg-black/30 rounded border border-white/10">暂未抽取残卷。请点击「🕵️ 潜行搜刮(方案A)」或任一「🪨 古修残碑」抽取 3 枚未参悟残卷！</div>`;
      } else {
        pickEl.innerHTML = state.currentScrollChoices.map(scr => `
          <button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.pickRelicScroll('${scr.scrollId}');" class="text-left p-2.5 rounded-lg bg-[#121e33] hover:bg-[#192a47] border border-amber-400/55 hover:border-amber-300 transition cursor-pointer flex flex-col justify-between space-y-1.5">
            <div>
              <div class="flex items-center justify-between text-[10px] font-mono text-amber-300">
                <span>${scr.scrollId}</span>
                <span>${scr.stage || '古修秘方'}</span>
              </div>
              <div class="text-xs font-black text-white mt-0.5">${scr.name}</div>
              <div class="text-[10px] text-cyan-300 mt-0.5">${scr.buildingName || '设备'} → ${scr.primaryOutName || '成品'}</div>
            </div>
            <div class="text-[10px] text-slate-300 line-clamp-2">${scr.strategicValue || ''}</div>
            <div class="text-[10px] font-bold text-amber-200 pt-1 border-t border-white/10">✨ 点击参悟此残卷</div>
          </button>
        `).join('');
      }
    }

    const listEl = document.getElementById('relicComprehendedList');
    if (listEl) {
      const all = getAllScrolls();
      const names = state.comprehendedScrolls.map(id => {
        const s = all.find(x => x && x.scrollId === id);
        return s ? `${s.name}(${id})` : id;
      });
      listEl.innerText = `已参悟残卷 (${names.length})：${names.length ? names.join('、') : '暂无'}`;
    }

    // 阵盘多途径获取面板
    syncOpticalPanel();

    // 山河图奇观收录打卡
    const lingBadge = document.getElementById('mapShanheLingyunBadge');
    if (lingBadge) {
      const s = window.FabaoSystem && window.FabaoSystem.state ? window.FabaoSystem.state.shanhe : null;
      lingBadge.innerText = s ? `山河图灵韵 ${s.lingyun}/${s.lingyunMax}${s.isDormant ? ' (⚠️休眠)' : ''}` : '山河图未加载';
    }
    const wonderPanel = document.getElementById('mapWonderCheckinPanel');
    if (wonderPanel) {
      const wonders = pois.filter(p => p && p.type === 'wonder_node');
      wonderPanel.innerHTML = wonders.map(w => {
        const checked = state.checkedInWonders.includes(w.id);
        return `
          <button onclick="if(window.MapExplorationSystem) window.MapExplorationSystem.exploreWonderNode('${w.id}');" class="p-2 rounded-lg border ${checked ? 'border-emerald-400/70 bg-emerald-950/45' : 'border-white/15 bg-black/30 hover:bg-emerald-950/30'} text-left cursor-pointer transition">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-200 text-[11px]">🏞️ ${w.name}</span>
              <span class="text-[10px] font-mono ${checked ? 'text-emerald-300' : 'text-slate-400'}">${checked ? '✅ 已收录' : '未打卡'}</span>
            </div>
            <div class="text-[10px] text-slate-300 mt-0.5">坐标 (${w.wx}, ${w.wz}) · 点击收录 +35 灵韵</div>
          </button>
        `;
      }).join('');
    }
  }

  function openModal() {
    if (typeof closeOtherModals === 'function') closeOtherModals('mapExploreModal');
    const modal = document.getElementById('mapExploreModal');
    if (modal) {
      modal.classList.remove('hidden');
      if (typeof playUiSound === 'function') playUiSound('toggle');
      renderModal();
    }
  }

  function closeModal() {
    const modal = document.getElementById('mapExploreModal');
    if (modal) modal.classList.add('hidden');
  }

  function toggleModal() {
    const modal = document.getElementById('mapExploreModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) openModal();
    else closeModal();
  }

  window.MapExplorationSystem = {
    state,
    DEFAULT_MAP_POIS,
    getPois,
    sneakIntoSectLibrary,
    useFabaoEscape,
    comprehendRelicStele,
    pickRelicScroll,
    showInlineRelicChoiceOverlay,
    exploreWonderNode,
    visitCampBeacon,
    decodeCorpseChip,
    focusPoiIn3D,
    syncOpticalPanel,
    openModal,
    closeModal,
    toggleModal,
    renderModal
  };
})();
