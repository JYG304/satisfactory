// ============================================================================
// js/combat/combat_hud.js - 零重叠战斗 HUD、复用左下角原有血条与 [F9] 调参抽屉
// 性能优化：全量 DOM 引用缓存 + 持久化敌人血条 DOM 对象池 (0 每帧 innerHTML 重建)
// ============================================================================

(function () {
  let rootEl = null;
  let platesLayerEl = null;
  let drawerEl = null;
  let hitmarkerTimer = 0;
  let damageFlashTimer = 0;
  let parryFlashTimer = 0;
  let dashFlashTimer = 0;
  let initialized = false;
  let textTickAccum = 0;

  const dom = {};
  const lastText = {};
  let lastOffscreenKey = '';
  let lastLitSegments = -1;
  let lastHpTier = '';

  // 持久化敌人血条节点池
  const platePool = new Map();
  const tempVec = new THREE.Vector3();

  function setTextCached(key, el, val) {
    if (!el || lastText[key] === val) return;
    lastText[key] = val;
    el.innerText = val;
  }

  function ensureDOM() {
    if (initialized) return;
    initialized = true;

    platesLayerEl = document.getElementById('fpCombatEnemyPlatesLayer');
    if (!platesLayerEl) {
      platesLayerEl = document.createElement('div');
      platesLayerEl.id = 'fpCombatEnemyPlatesLayer';
      platesLayerEl.className = 'combat-enemy-plates-layer hidden';
      document.body.appendChild(platesLayerEl);
    }

    rootEl = document.getElementById('fpCombatHudRoot');
    if (!rootEl) {
      rootEl = document.createElement('div');
      rootEl.id = 'fpCombatHudRoot';
      rootEl.className = 'hidden';
      rootEl.innerHTML = `
        <div id="combatDamageVignette" class="combat-damage-vignette"></div>
        <div id="combatParryFlash" class="combat-parry-flash"></div>
        <div id="combatDashStreaks" class="combat-dash-streaks"></div>

        <!-- 顶部战斗重复胶囊已隐藏，统一使用 #godModeCombatEntryBar 单栏 -->
        <div class="fixed top-14 left-1/2 -translate-x-1/2 flex items-center pointer-events-none hidden">
          <div class="combat-top-banner px-3 py-1 rounded-full flex items-center space-x-2 text-[10px] font-mono text-slate-200 whitespace-nowrap">
            <span id="combatLockIndicator" onclick="window.CombatInput && window.CombatInput.requestLock();" class="combat-lock-badge cursor-pointer px-2 py-0.5 rounded bg-amber-500/20 border text-amber-200 font-bold">点击屏幕锁定视角</span>
            <span id="combatTokenStatus" class="text-slate-300">令牌 近0/2 · 远0/2</span>
            <button onclick="this.blur(); window.CombatSystem && window.CombatSystem.toggleTuningPanel();" class="px-2 py-0.5 rounded bg-sky-500/25 hover:bg-sky-500/45 border border-sky-400/60 text-sky-200 font-bold cursor-pointer">⚙️ [F9] 调参</button>
            <button onclick="this.blur(); window.CombatSystem && window.CombatSystem.toggle();" class="px-2 py-0.5 rounded bg-rose-500/25 hover:bg-rose-500/45 border border-rose-400/60 text-rose-200 font-bold cursor-pointer" title="按 [F8] 或双击 [B] 返回建厂">↩ 建厂 [F8]</button>
          </div>
        </div>

        <!-- 顶部中央下方：金丹首领 Boss 条 -->
        <div id="combatBossBarWrap" class="fixed top-28 left-1/2 -translate-x-1/2 w-[350px] bg-black/90 border border-purple-400/60 rounded-lg p-2.5 shadow-2xl hidden">
          <div class="flex items-center justify-between text-xs font-bold text-purple-200 mb-1">
            <span id="combatBossName">玄煞真君 (金丹)</span>
            <span id="combatBossHpText" class="font-mono text-[11px]">900/900</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded overflow-hidden mb-1">
            <div id="combatBossShieldFill" class="h-full bg-amber-400" style="width:100%"></div>
          </div>
          <div class="w-full h-2.5 bg-slate-800 rounded overflow-hidden">
            <div id="combatBossHpFill" class="h-full bg-gradient-to-r from-purple-500 to-rose-500" style="width:100%"></div>
          </div>
        </div>

        <!-- 中心动态准星 + 蓄力环 + Hitmarker -->
        <div class="combat-crosshair-wrap">
          <svg class="combat-charge-ring" viewBox="0 0 66 66">
            <circle cx="33" cy="33" r="28" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3"></circle>
            <circle id="combatChargeArc" cx="33" cy="33" r="28" fill="none" stroke="#fde047" stroke-width="3.2" stroke-dasharray="176" stroke-dashoffset="176" stroke-linecap="round"></circle>
          </svg>
          <div id="combatReticle" class="combat-reticle reticle-metal">
            <div id="combatReticleDot" class="combat-reticle-dot"></div>
            <div class="reticle-tick tick-top"></div>
            <div class="reticle-tick tick-bot"></div>
            <div class="reticle-tick tick-left"></div>
            <div class="reticle-tick tick-right"></div>
          </div>
          <svg id="combatHitmarker" class="combat-hitmarker" viewBox="0 0 36 36">
            <line x1="6" y1="6" x2="14" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="30" y1="6" x2="22" y2="14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="6" y1="30" x2="14" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="30" y1="30" x2="22" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>

        <!-- 露核拔丹锁定框 -->
        <div id="combatCorePrompt" class="combat-core-prompt hidden">
          <div class="combat-core-bracket w-16 h-16 rounded-md flex items-center justify-center">
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping"></span>
          </div>
          <div class="mt-1 px-2 py-0.5 bg-black/85 border border-yellow-400 rounded text-[11px] font-black text-yellow-300 whitespace-nowrap text-center shadow-lg">
            [F] 抽魂拔丹
          </div>
        </div>

        <!-- 尸体装箱 / 瘫痪塔重建进度条 -->
        <div id="combatBoxingBarWrap" class="fixed left-1/2 top-[60%] -translate-x-1/2 bg-black/90 border border-emerald-400/70 rounded px-3 py-1.5 hidden">
          <div id="combatBoxingLabel" class="text-[11px] text-emerald-300 font-bold mb-1 text-center">正在装载修士尸体进运输箱...</div>
          <div class="w-48 h-2 bg-slate-800 rounded overflow-hidden">
            <div id="combatBoxingFill" class="h-full bg-emerald-400" style="width:0%"></div>
          </div>
        </div>

        <!-- 屏外危险方向弧 -->
        <div id="combatOffscreenRing" class="combat-offscreen-ring"></div>

        <!-- 底部中央：清爽战斗操作栏 (接管被隐藏的建造快捷栏槽位，绝不和左下角原有血条重叠) -->
        <div id="fpCombatActionBar" class="rounded-xl px-2.5 py-1.5 flex flex-col space-y-1.5 select-none">
          <!-- 上薄条：护体罡气 + 灵力条 + 背匣 4 剑状态指示灯 -->
          <div class="flex items-center justify-between gap-2 text-[10px] font-mono px-0.5">
            <div class="flex items-center space-x-1.5 flex-1 min-w-[115px]">
              <span class="text-amber-300 font-bold shrink-0">罡</span>
              <div class="flex-1 h-1.5 bg-slate-800 rounded overflow-hidden">
                <div id="combatShieldBar" class="h-full bg-amber-400" style="width:100%"></div>
              </div>
              <span id="combatShieldText" class="text-amber-200 text-[9px] shrink-0">60/60</span>
            </div>

            <div class="flex items-center space-x-1.5 flex-1 min-w-[115px]">
              <span class="text-cyan-300 font-bold shrink-0">灵</span>
              <div class="flex-1 h-1.5 bg-slate-800 rounded overflow-hidden">
                <div id="combatQiBar" class="h-full bg-cyan-400" style="width:100%"></div>
              </div>
              <span id="combatQiText" class="text-cyan-200 text-[9px] shrink-0">100/100</span>
            </div>

            <button onclick="this.blur(); if(window.CombatInput) window.CombatInput.releaseLock(); if(typeof toggleInventoryModal==='function') toggleInventoryModal();"
                    title="背匣飞剑装备指示（装剑越多攻速越快 · 点击或按 [Tab] 更换飞剑）"
                    class="flex items-center space-x-1 bg-black/50 hover:bg-slate-800 border border-amber-400/40 rounded px-1.5 py-0.5 cursor-pointer shrink-0">
              <span class="w-2 h-2 rounded-full bg-slate-600" id="casketLed_0"></span>
              <span class="w-2 h-2 rounded-full bg-slate-600" id="casketLed_1"></span>
              <span class="w-2 h-2 rounded-full bg-slate-600" id="casketLed_2"></span>
              <span class="w-2 h-2 rounded-full bg-slate-600" id="casketLed_3"></span>
              <span id="combatCasketSpeedMini" class="text-[9px] text-amber-300 font-bold ml-1">3剑 1.75×</span>
            </button>
          </div>

          <!-- 下键位栏：精简为 9 个零冲突核心槽位 (普攻/弹反 · G/V/F/Shift · T法宝 · H丹药 · B返建厂) -->
          <div class="flex items-center gap-1.5 text-[10px]">
            <div class="combat-slot-btn cursor-default" title="点左键自背后轮发剑匣飞剑 / 长按蓄力全匣齐射">
              <span class="text-[8px] text-cyan-300 font-bold">左键</span>
              <span class="text-white font-bold text-[10px] leading-tight">御剑</span>
              <span id="combatAttackRateSub" class="text-[8px] text-amber-300">2.3发/s</span>
            </div>

            <div class="combat-slot-btn cursor-default" title="按住右键结十字印防御 / 来袭瞬间弹反">
              <span class="text-[8px] text-cyan-300 font-bold">右键</span>
              <span class="text-white font-bold text-[10px] leading-tight">弹反</span>
              <span class="text-[8px] text-slate-400">结印护心</span>
            </div>

            <div class="w-[1px] h-7 bg-white/15"></div>

            <button id="cdBadgeTalisman" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.castTalisman();" class="combat-slot-btn cursor-pointer" title="[G] 定身缚灵符：结印抛出符箓定身范围内敌人">
              <span class="text-[8px] text-purple-300 font-bold">[G]</span>
              <span class="text-white font-bold text-[10px] leading-tight">缚灵符</span>
              <span class="text-[8px] text-emerald-400">就绪</span>
            </button>

            <button id="cdBadgeThunder" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.castThunderSeal();" class="combat-slot-btn cursor-pointer" title="[V] 九霄震雷破盾印：双掌雷印轰落天雷破盾麻痹">
              <span class="text-[8px] text-yellow-300 font-bold">[V]</span>
              <span class="text-white font-bold text-[10px] leading-tight">震雷印</span>
              <span class="text-[8px] text-emerald-400">就绪</span>
            </button>

            <button id="cdBadgeGrab" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.tryCoreGrab();" class="combat-slot-btn cursor-pointer" title="[F] 灵丝抽魂拔丹：敌人露核时拔丹秒杀+自动收尸">
              <span class="text-[8px] text-amber-300 font-bold">[F]</span>
              <span class="text-white font-bold text-[10px] leading-tight">抽魂核</span>
              <span class="text-[8px] text-slate-400">待露核</span>
            </button>

            <button id="cdBadgeDash" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.triggerDash(window.CombatInput ? window.CombatInput.getMoveInput() : {});" class="combat-slot-btn cursor-pointer" title="[Shift / C] 8向灵步短冲">
              <span class="text-[8px] text-sky-300 font-bold">Shift/C</span>
              <span class="text-white font-bold text-[10px] leading-tight">灵步</span>
              <span class="text-[8px] text-emerald-400">就绪</span>
            </button>

            <div class="w-[1px] h-7 bg-white/15"></div>

            <button id="cdBadgeWanHun" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.castWanHun();" class="combat-slot-btn fabao-slot cursor-pointer" title="[T] 本命法宝·万魂幡：展开紫金魂域减速范围内敌修">
              <span class="text-[8px] text-fuchsia-300 font-bold">[T]法宝</span>
              <span class="text-white font-bold text-[10px] leading-tight">万魂域</span>
              <span class="text-[8px] text-emerald-400">就绪</span>
            </button>

            <button id="cdBadgePill" onclick="this.blur(); window.CombatPlayer && window.CombatPlayer.useQuickPill();" class="combat-slot-btn cursor-pointer" title="[H] 服用气血丹/辟谷丹回血回灵">
              <span class="text-[8px] text-emerald-300 font-bold">[H]</span>
              <span class="text-white font-bold text-[10px] leading-tight">丹药</span>
              <span class="text-[8px] text-emerald-400">就绪</span>
            </button>

            <button onclick="this.blur(); window.CombatSystem && window.CombatSystem.toggle();" class="combat-slot-btn cursor-pointer border-rose-400/55 bg-rose-950/50" title="[B / F8] 退出战斗返回建厂视角">
              <span class="text-[8px] text-rose-300 font-bold">[B]</span>
              <span class="text-white font-bold text-[10px] leading-tight">返建厂</span>
              <span id="combatCorpseCountSpan" class="text-[8px] text-amber-300">尸:0</span>
            </button>
          </div>
        </div>

        <!-- 玩家失能倒地遮罩 -->
        <div id="combatDownOverlay" class="fixed inset-0 bg-black/80 flex flex-col items-center justify-center hidden z-40">
          <div class="text-2xl font-black text-rose-400 tracking-widest mb-2">载体灵能枯竭 · 失能倒地</div>
          <div id="combatDownCountdown" class="text-sm font-mono text-slate-200">正在于宗门基地重构控制... 2.8s</div>
        </div>
      `;
      document.body.appendChild(rootEl);
    }

    // 一次性缓存核心 HUD DOM 引用
    dom.dmgVig = document.getElementById('combatDamageVignette');
    dom.pFlash = document.getElementById('combatParryFlash');
    dom.dStreak = document.getElementById('combatDashStreaks');
    dom.shieldText = document.getElementById('combatShieldText');
    dom.shieldBar = document.getElementById('combatShieldBar');
    dom.qiText = document.getElementById('combatQiText');
    dom.qiBar = document.getElementById('combatQiBar');
    dom.casketSpeedMini = document.getElementById('combatCasketSpeedMini');
    dom.attackRateSub = document.getElementById('combatAttackRateSub');
    dom.casketLeds = [0, 1, 2, 3].map((i) => document.getElementById(`casketLed_${i}`));

    // 复用原有左下角 #combatHudBar & #hpSegments
    dom.origEquipIcon = document.getElementById('combatEquipIcon');
    dom.origEquipFrame = document.getElementById('combatEquipFrame');
    dom.origEquipName = document.getElementById('combatEquipNameLabel');
    dom.origEquipType = document.getElementById('combatEquipTypeLabel');
    dom.origHpSegmentsWrap = document.getElementById('hpSegments');
    dom.origHpSegments = dom.origHpSegmentsWrap ? Array.from(dom.origHpSegmentsWrap.children) : [];
    dom.origShieldWrap = document.getElementById('hudCombatShieldWrap');
    dom.origShieldFill = document.getElementById('hudCombatShieldFill');

    dom.reticle = document.getElementById('combatReticle');
    dom.reticleDot = document.getElementById('combatReticleDot');
    dom.chargeArc = document.getElementById('combatChargeArc');
    dom.hitmarker = document.getElementById('combatHitmarker');
    dom.corePrompt = document.getElementById('combatCorePrompt');
    dom.boxWrap = document.getElementById('combatBoxingBarWrap');
    dom.boxLabel = document.getElementById('combatBoxingLabel');
    dom.boxFill = document.getElementById('combatBoxingFill');
    dom.offRing = document.getElementById('combatOffscreenRing');
    dom.downOverlay = document.getElementById('combatDownOverlay');
    dom.downCountdown = document.getElementById('combatDownCountdown');
    dom.bossWrap = document.getElementById('combatBossBarWrap');
    dom.bossName = document.getElementById('combatBossName');
    dom.bossHpText = document.getElementById('combatBossHpText');
    dom.bossShieldFill = document.getElementById('combatBossShieldFill');
    dom.bossHpFill = document.getElementById('combatBossHpFill');
    dom.tokenStatus = document.getElementById('combatTokenStatus');
    dom.corpseCountSpan = document.getElementById('combatCorpseCountSpan');
    dom.cdDash = document.getElementById('cdBadgeDash');
    dom.cdTalisman = document.getElementById('cdBadgeTalisman');
    dom.cdThunder = document.getElementById('cdBadgeThunder');
    dom.cdGrab = document.getElementById('cdBadgeGrab');
    dom.cdWanHun = document.getElementById('cdBadgeWanHun');
    dom.cdPill = document.getElementById('cdBadgePill');

    drawerEl = document.getElementById('fpCombatTuningDrawer');
    if (!drawerEl) {
      drawerEl = document.createElement('div');
      drawerEl.id = 'fpCombatTuningDrawer';
      drawerEl.className = 'hidden';
      drawerEl.innerHTML = buildTuningDrawerHTML();
      document.body.appendChild(drawerEl);
      bindTuningEvents();
    }
    dom.tuningEnemyCount = document.getElementById('tuningEnemyCount');
    dom.tuningCasketBox = document.getElementById('tuningCasketSummary');
  }

  function renderTuningCasketHTML() {
    if (!window.CombatCasket) return '<div class="text-slate-400">剑匣模块未就绪</div>';
    const sum = window.CombatCasket.getSummary();
    const lines = sum.slots.map((s) => {
      if (!s.equipped) return `<div class="text-[11px] text-slate-500 font-mono">槽位 #${s.slotIndex + 1}：空置</div>`;
      return `<div class="flex items-center justify-between text-[11px] font-mono">
        <span style="color:${s.profile.cssColor}" class="font-bold">● ${s.profile.name}</span>
        <span class="text-slate-300">${s.profile.effectShort || s.profile.realmTag}</span>
      </div>`;
    }).join('');
    return `
      <div class="flex items-center justify-between text-[11px] font-mono bg-black/40 border border-amber-400/35 rounded px-2 py-1 mb-1">
        <span class="text-amber-300 font-bold">已装飞剑: ${sum.equippedCount} / 4</span>
        <span class="text-cyan-300 font-bold">攻速: ${sum.speedMult.toFixed(2)}× (${sum.fireRatePerSec.toFixed(1)}发/s)</span>
      </div>
      <div class="space-y-1">${lines}</div>
    `;
  }

  function buildTuningDrawerHTML() {
    const cfg = window.CombatConfig || {};
    const dec = cfg.decisions || {};
    const mv = cfg.movement || {};
    const pl = cfg.player || {};
    const ai = cfg.aiDirector || {};

    return `
      <div class="px-4 py-3 bg-[#0d1726] border-b border-cyan-500/35 flex items-center justify-between shrink-0">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-sliders text-cyan-400"></i>
          <span class="text-sm font-black text-white">战斗原型实时调参 & AI 控制台</span>
        </div>
        <button onclick="window.CombatSystem && window.CombatSystem.toggleTuningPanel();" class="w-7 h-7 rounded bg-rose-500/20 hover:bg-rose-500/45 text-rose-200 flex items-center justify-center cursor-pointer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto combat-scroll p-3.5 space-y-4 text-xs text-slate-200">
        <div class="bg-slate-900/70 border border-amber-500/40 rounded-lg p-3 space-y-2">
          <div class="font-bold text-amber-300 flex items-center justify-between">
            <span>🗡️ 天罡剑匣装配与攻速联动</span>
            <button id="btnTuningOpenTab" class="px-2 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/45 border border-amber-400/60 text-amber-100 text-[10px] cursor-pointer">[Tab] 配剑</button>
          </div>
          <div id="tuningCasketSummary">${renderTuningCasketHTML()}</div>
        </div>

        <div class="bg-slate-900/70 border border-slate-700/70 rounded-lg p-3 space-y-2">
          <div class="font-bold text-amber-300 flex items-center justify-between">
            <span>⚔️ 敌人波次生成与调试</span>
            <span id="tuningEnemyCount" class="font-mono text-[10px] text-cyan-300">存活: 0</span>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <button data-spawn="welcome" class="px-2 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/50 text-cyan-100 font-bold cursor-pointer">+ 欢迎小队 (2练气+1筑基)</button>
            <button data-spawn="qi_pack" class="px-2 py-1.5 rounded bg-sky-500/20 hover:bg-sky-500/35 border border-sky-400/50 text-sky-100 font-bold cursor-pointer">+ 练气集群 (×4)</button>
            <button data-spawn="foundation_duo" class="px-2 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-100 font-bold cursor-pointer">+ 筑基双护法</button>
            <button data-spawn="jindan_boss" class="px-2 py-1.5 rounded bg-purple-500/25 hover:bg-purple-500/40 border border-purple-400/60 text-purple-100 font-bold cursor-pointer">+ 金丹首领 Boss</button>
            <button data-spawn="siege_wave" class="px-2 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/35 border border-rose-400/50 text-rose-100 font-bold cursor-pointer">+ 攻山怨潮 (西侧防御塔)</button>
            <button id="btnTuningClearEnemies" class="px-2 py-1.5 rounded bg-slate-800 hover:bg-rose-900/60 border border-slate-600 text-slate-200 font-bold cursor-pointer">🧹 清空全部敌人</button>
          </div>
          <button id="btnTuningSupplyPack" class="w-full py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-200 font-bold cursor-pointer">
            💊 一键补给测试物资 (气血丹/辟谷丹/筑基丹/铁剑丸/天雷剑丸/千纸鹤 ×10)
          </button>
        </div>

        <div class="bg-slate-900/70 border border-slate-700/70 rounded-lg p-3 space-y-2.5">
          <div class="font-bold text-cyan-300">🧠 UE5 AI 导演与协同参数</div>
          <label class="flex items-center justify-between cursor-pointer">
            <span>显示头顶 AI 状态思考标签</span>
            <input type="checkbox" id="chkAiLabels" ${ai.showAiDebugLabels ? 'checked' : ''}>
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span>启用工厂 bd_160 飞剑防御塔自动索敌</span>
            <input type="checkbox" id="chkTurretEnabled" ${ai.turretEnabled ? 'checked' : ''}>
          </label>
          <div>
            <div class="flex justify-between"><span>近战 Attack Token 上限</span><span id="valMeleeTok" class="font-mono text-cyan-300">${ai.maxMeleeTokens}</span></div>
            <input type="range" id="rngMeleeTok" min="1" max="4" step="1" value="${ai.maxMeleeTokens}" class="w-full">
          </div>
          <div>
            <div class="flex justify-between"><span>远程 Attack Token 上限</span><span id="valRangedTok" class="font-mono text-cyan-300">${ai.maxRangedTokens}</span></div>
            <input type="range" id="rngRangedTok" min="1" max="4" step="1" value="${ai.maxRangedTokens}" class="w-full">
          </div>
          <div>
            <div class="flex justify-between"><span>屏外敌人攻击额外前摇 (秒)</span><span id="valOffWindup" class="font-mono text-cyan-300">${ai.offscreenExtraWindup}s</span></div>
            <input type="range" id="rngOffWindup" min="0" max="0.9" step="0.05" value="${ai.offscreenExtraWindup}" class="w-full">
          </div>
        </div>

        <div class="bg-slate-900/70 border border-slate-700/70 rounded-lg p-3 space-y-2">
          <div class="font-bold text-fuchsia-300">🎛️ 策划案 DEC 开关实时测试</div>
          <label class="flex items-center justify-between cursor-pointer">
            <span>DEC-02 开启 8 向灵步短冲 (Shift/C)</span>
            <input type="checkbox" id="chkDec02" ${dec.DEC_02_dashEnabled ? 'checked' : ''}>
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span>DEC-03 剑丸耗材制 (关闭=灵力自动循环)</span>
            <input type="checkbox" id="chkDec03" ${dec.DEC_03_consumableAmmo ? 'checked' : ''}>
          </label>
          <div class="flex items-center justify-between gap-2">
            <span>DEC-04 鼠标右键功能</span>
            <select id="selDec04" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[11px]">
              <option value="guard_parry" ${dec.DEC_04_rightClickAction === 'guard_parry' ? 'selected' : ''}>十字结印格挡 / 完美弹反</option>
              <option value="charge_sword" ${dec.DEC_04_rightClickAction === 'charge_sword' ? 'selected' : ''}>直接蓄力全匣齐射</option>
            </select>
          </div>
          <label class="flex items-center justify-between cursor-pointer">
            <span>DEC-05 灵丝多重连锁拔核 (最多3目标)</span>
            <input type="checkbox" id="chkDec05" ${dec.DEC_05_chainCoreGrab ? 'checked' : ''}>
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span>DEC-06 拔核减伤并直接把尸体收入背包</span>
            <input type="checkbox" id="chkDec06" ${dec.DEC_06_grabInvulnAutoBox ? 'checked' : ''}>
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span>DEC-07 尸体保鲜腐败倒计时</span>
            <input type="checkbox" id="chkDec07" ${dec.DEC_07_corpseDecay ? 'checked' : ''}>
          </label>
          <div class="flex items-center justify-between gap-2">
            <span>DEC-08 敌方破坏建筑策略</span>
            <select id="selDec08" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[11px]">
              <option value="blocked_only" ${dec.DEC_08_enemyAttackBuildings === 'blocked_only' ? 'selected' : ''}>仅堵死路时强拆</option>
              <option value="never" ${dec.DEC_08_enemyAttackBuildings === 'never' ? 'selected' : ''}>永不破坏建筑</option>
              <option value="aggressive" ${dec.DEC_08_enemyAttackBuildings === 'aggressive' ? 'selected' : ''}>主动优先拆防御塔</option>
            </select>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span>DEC-12 前景双臂外观风格</span>
            <select id="selDec12" class="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[11px]">
              <option value="hybrid" ${dec.DEC_12_armStyle === 'hybrid' ? 'selected' : ''}>赛博道袍混搭 (70/30)</option>
              <option value="mech" ${dec.DEC_12_armStyle === 'mech' ? 'selected' : ''}>纯硬核机械臂</option>
              <option value="xianxia" ${dec.DEC_12_armStyle === 'xianxia' ? 'selected' : ''}>偏修真宽袖</option>
            </select>
          </div>
        </div>

        <div class="bg-slate-900/70 border border-slate-700/70 rounded-lg p-3 space-y-2.5">
          <div class="font-bold text-emerald-300">🏃 WASD 手感与镜头参数</div>
          <div>
            <div class="flex justify-between"><span>基础行走速度</span><span id="valWalkSpd" class="font-mono text-emerald-300">${mv.walkSpeed} m/s</span></div>
            <input type="range" id="rngWalkSpd" min="3.2" max="8.0" step="0.2" value="${mv.walkSpeed}" class="w-full">
          </div>
          <div>
            <div class="flex justify-between"><span>完美弹反判定窗口</span><span id="valParryWin" class="font-mono text-emerald-300">${Math.round(pl.parryWindow * 1000)} ms</span></div>
            <input type="range" id="rngParryWin" min="0.10" max="0.40" step="0.02" value="${pl.parryWindow}" class="w-full">
          </div>
          <div>
            <div class="flex justify-between"><span>基础视野 FOV</span><span id="valBaseFov" class="font-mono text-emerald-300">${mv.baseFov}°</span></div>
            <input type="range" id="rngBaseFov" min="70" max="105" step="1" value="${mv.baseFov}" class="w-full">
          </div>
          <div>
            <div class="flex justify-between"><span>鼠标灵敏度</span><span id="valMouseSens" class="font-mono text-emerald-300">${(mv.mouseSensitivity * 1000).toFixed(1)}</span></div>
            <input type="range" id="rngMouseSens" min="0.0008" max="0.0050" step="0.0002" value="${mv.mouseSensitivity}" class="w-full">
          </div>
          <label class="flex items-center justify-between cursor-pointer">
            <span>启用局部打击感顿帧 (Hitstop)</span>
            <input type="checkbox" id="chkHitstop" ${pl.hitstopEnabled ? 'checked' : ''}>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <button id="btnExportConfig" class="py-2 rounded bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-100 font-bold cursor-pointer">📋 复制参数 JSON</button>
          <button id="btnResetConfig" class="py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold cursor-pointer">↺ 恢复默认配置</button>
        </div>
      </div>
    `;
  }

  function bindTuningEvents() {
    if (!drawerEl) return;
    drawerEl.addEventListener('mousedown', (e) => e.stopPropagation());
    drawerEl.addEventListener('click', (e) => e.stopPropagation());

    drawerEl.querySelector('#btnTuningOpenTab')?.addEventListener('click', () => {
      if (window.CombatInput) window.CombatInput.releaseLock();
      if (typeof toggleInventoryModal === 'function') toggleInventoryModal();
    });

    drawerEl.querySelectorAll('button[data-spawn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const wave = btn.getAttribute('data-spawn');
        if (window.CombatEnemies) {
          window.CombatEnemies.spawnPresetSquad(wave);
          if (window.CombatSystem && window.CombatSystem.isActive()) window.CombatEnemies.setVisible(true);
          const enemies = window.CombatEnemies.getEnemies();
          const alive = enemies.filter((e) => e.state !== 'dead').length;
          if (dom.tuningEnemyCount) dom.tuningEnemyCount.innerText = `存活: ${alive} / 总 ${enemies.length}`;
          if (typeof showNotification === 'function') showNotification(`【战斗原型】已刷新波次：${wave}`);
        }
      });
    });

    drawerEl.querySelector('#btnTuningClearEnemies')?.addEventListener('click', () => {
      window.CombatEnemies?.clearAllEnemies();
      platePool.forEach((p) => { p.el.remove(); });
      platePool.clear();
      if (dom.tuningEnemyCount) dom.tuningEnemyCount.innerText = '存活: 0 / 总 0';
    });

    drawerEl.querySelector('#btnTuningSupplyPack')?.addEventListener('click', () => {
      if (typeof playerInventory !== 'undefined') {
        playerInventory.mat_080 = (playerInventory.mat_080 || 0) + 10;
        playerInventory.mat_090 = (playerInventory.mat_090 || 0) + 10;
        playerInventory.mat_129 = (playerInventory.mat_129 || 0) + 10;
        playerInventory.mat_074 = (playerInventory.mat_074 || 0) + 30;
        playerInventory.mat_139 = (playerInventory.mat_139 || 0) + 15;
        playerInventory.mat_146 = (playerInventory.mat_146 || 0) + 10;
        if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
        if (typeof syncBackpackFromPlayerInventory === 'function') syncBackpackFromPlayerInventory();
        if (typeof showNotification === 'function') showNotification('【测试补给】已向背包添加 气血丹/辟谷丹/筑基丹/千纸鹤×10、铁剑丸×30、天雷剑丸×15！');
      }
    });

    const cfg = window.CombatConfig;
    const bindChk = (id, fn) => drawerEl.querySelector(id)?.addEventListener('change', (ev) => fn(ev.target.checked));
    const bindSel = (id, fn) => drawerEl.querySelector(id)?.addEventListener('change', (ev) => fn(ev.target.value));
    const bindRng = (id, labelId, fmt, fn) => {
      drawerEl.querySelector(id)?.addEventListener('input', (ev) => {
        const v = parseFloat(ev.target.value);
        const lb = drawerEl.querySelector(labelId);
        if (lb) lb.innerText = fmt(v);
        fn(v);
      });
    };

    bindChk('#chkAiLabels', (v) => { cfg.aiDirector.showAiDebugLabels = v; });
    bindChk('#chkTurretEnabled', (v) => { cfg.aiDirector.turretEnabled = v; });
    bindRng('#rngMeleeTok', '#valMeleeTok', (v) => `${v}`, (v) => { cfg.aiDirector.maxMeleeTokens = v; });
    bindRng('#rngRangedTok', '#valRangedTok', (v) => `${v}`, (v) => { cfg.aiDirector.maxRangedTokens = v; });
    bindRng('#rngOffWindup', '#valOffWindup', (v) => `${v.toFixed(2)}s`, (v) => { cfg.aiDirector.offscreenExtraWindup = v; });

    bindChk('#chkDec02', (v) => { cfg.decisions.DEC_02_dashEnabled = v; });
    bindChk('#chkDec03', (v) => { cfg.decisions.DEC_03_consumableAmmo = v; });
    bindSel('#selDec04', (v) => { cfg.decisions.DEC_04_rightClickAction = v; });
    bindChk('#chkDec05', (v) => { cfg.decisions.DEC_05_chainCoreGrab = v; });
    bindChk('#chkDec06', (v) => { cfg.decisions.DEC_06_grabInvulnAutoBox = v; });
    bindChk('#chkDec07', (v) => { cfg.decisions.DEC_07_corpseDecay = v; });
    bindSel('#selDec08', (v) => { cfg.decisions.DEC_08_enemyAttackBuildings = v; });
    bindSel('#selDec12', (v) => { cfg.decisions.DEC_12_armStyle = v; });

    bindRng('#rngWalkSpd', '#valWalkSpd', (v) => `${v.toFixed(1)} m/s`, (v) => { cfg.movement.walkSpeed = v; });
    bindRng('#rngParryWin', '#valParryWin', (v) => `${Math.round(v * 1000)} ms`, (v) => { cfg.player.parryWindow = v; });
    bindRng('#rngBaseFov', '#valBaseFov', (v) => `${v}°`, (v) => { cfg.movement.baseFov = v; });
    bindRng('#rngMouseSens', '#valMouseSens', (v) => `${(v * 1000).toFixed(1)}`, (v) => { cfg.movement.mouseSensitivity = v; });
    bindChk('#chkHitstop', (v) => { cfg.player.hitstopEnabled = v; });

    drawerEl.querySelector('#btnExportConfig')?.addEventListener('click', () => {
      const json = window.CombatConfigAPI ? window.CombatConfigAPI.exportJSON() : '{}';
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(json).catch(() => {});
      console.log('[CombatConfig Export]', json);
      if (typeof showNotification === 'function') showNotification('【已导出】当前战斗调参配置 JSON 已复制至剪贴板并输出到控制台！');
    });

    drawerEl.querySelector('#btnResetConfig')?.addEventListener('click', () => {
      if (window.CombatConfigAPI) window.CombatConfigAPI.reset();
      drawerEl.innerHTML = buildTuningDrawerHTML();
      bindTuningEvents();
      dom.tuningEnemyCount = document.getElementById('tuningEnemyCount');
      dom.tuningCasketBox = document.getElementById('tuningCasketSummary');
      if (typeof showNotification === 'function') showNotification('【已重置】全部战斗配置恢复为默认模板值');
    });
  }

  function setVisible(visible) {
    ensureDOM();
    if (rootEl) rootEl.classList.toggle('hidden', !visible);
    if (platesLayerEl) platesLayerEl.classList.toggle('hidden', !visible);
    if (dom.origShieldWrap) dom.origShieldWrap.classList.toggle('hidden', !visible);
    lastLitSegments = -1;
    lastHpTier = '';
    delete lastText.origName;
    delete lastText.origType;
    delete lastText.shTxt;
    delete lastText.qiTxt;
    delete lastText.cMini;
    delete lastText.atkSub;

    if (visible) {
      if (dom.origEquipIcon) dom.origEquipIcon.className = 'fa-solid fa-box-open text-amber-400 text-base z-10';
      if (dom.origEquipFrame) {
        dom.origEquipFrame.style.borderColor = '#f5921e';
        dom.origEquipFrame.style.boxShadow = '0 0 14px #f5921e';
      }
      const p = window.CombatPlayer ? window.CombatPlayer.getState() : null;
      const cfg = window.CombatConfig || {};
      const sum = window.CombatCasket && window.CombatCasket.getSummary ? window.CombatCasket.getSummary() : null;
      if (p && cfg.player) {
        updateOriginalBottomLeftHud(p, cfg, sum);
      }
    }
  }

  function toggleTuningDrawer(forceState = null) {
    ensureDOM();
    if (!drawerEl) return false;
    const shouldShow = forceState !== null ? !!forceState : drawerEl.classList.contains('hidden');
    drawerEl.classList.toggle('hidden', !shouldShow);
    if (shouldShow) {
      if (dom.tuningCasketBox) dom.tuningCasketBox.innerHTML = renderTuningCasketHTML();
      if (window.CombatInput) window.CombatInput.releaseLock();
    }
    return shouldShow;
  }

  function updateLockIndicator(locked, unsupported = false) {
    const el = document.getElementById('combatLockIndicator');
    if (!el) return;
    if (unsupported) {
      el.innerText = '🔓 自由测试视角 (方向键/中键转视角)';
      el.className = 'px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-bold';
    } else if (locked) {
      el.innerText = '🎯 视角已锁定 (ESC释放)';
      el.className = 'px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-bold';
    } else {
      el.innerText = '点击屏幕锁定视角';
      el.className = 'combat-lock-badge cursor-pointer px-2 py-0.5 rounded bg-amber-500/20 border text-amber-200 font-bold';
    }
  }

  function triggerHitmarker(kind = 'normal') {
    if (!dom.hitmarker) return;
    dom.hitmarker.style.color = kind === 'crit' ? '#fde047' : (kind === 'shield' ? '#38bdf8' : '#ffffff');
    dom.hitmarker.classList.add('active');
    hitmarkerTimer = 0.14;
  }

  function flashDamage() { damageFlashTimer = 0.25; }
  function flashParry() { parryFlashTimer = 0.22; }
  function flashDash() { dashFlashTimer = 0.20; }

  // --------------------------------------------------------------------------
  // 持久化敌人血条 DOM 对象创建/复用
  // --------------------------------------------------------------------------
  function getOrCreatePlate(e) {
    if (platePool.has(e.id)) return platePool.get(e.id);
    const badgeCol = e.type === 'qi'
      ? 'bg-sky-600/80 text-sky-100'
      : (e.type === 'foundation' ? 'bg-amber-600/85 text-amber-100' : (e.type === 'jindan' ? 'bg-purple-600/90 text-purple-100' : 'bg-rose-700/85 text-rose-100'));

    const el = document.createElement('div');
    el.className = 'combat-enemy-plate bg-black/80 border border-white/15 rounded px-1.5 py-1 text-[10px]';
    el.innerHTML = `
      <div class="flex items-center justify-between space-x-1.5 mb-0.5">
        <span class="px-1 rounded ${badgeCol} font-bold text-[9px]">${e.realmBadge}</span>
        <span class="text-white font-bold truncate max-w-[78px]">${e.name}</span>
      </div>
      ${e.maxShield > 0 ? '<div class="w-full h-1 bg-slate-800 rounded overflow-hidden mb-0.5"><div class="plate-sh-fill h-full bg-amber-400" style="width:100%"></div></div>' : ''}
      <div class="plate-hp-wrap w-full h-1.5 bg-slate-800 rounded overflow-hidden"><div class="plate-hp-fill h-full bg-rose-500" style="width:100%"></div></div>
      <div class="plate-state mt-0.5 text-[9px] font-mono text-cyan-200/90 text-center"></div>
    `;
    platesLayerEl.appendChild(el);
    const rec = {
      el,
      hpWrap: el.querySelector('.plate-hp-wrap'),
      hpFill: el.querySelector('.plate-hp-fill'),
      shFill: el.querySelector('.plate-sh-fill'),
      stateEl: el.querySelector('.plate-state'),
      lastHp: -1,
      lastSh: -1,
      lastState: '',
      lastExposed: false,
      lastShowLabel: true,
      visible: true
    };
    platePool.set(e.id, rec);
    return rec;
  }

  function updateOriginalBottomLeftHud(p, cfg, summary) {
    const maxHp = cfg.player.maxHp || 100;
    const maxSh = cfg.player.maxShield || 60;
    const hpRatio = Math.max(0, Math.min(1, p.hp / maxHp));
    const litCount = p.hp <= 0 ? 0 : Math.max(1, Math.ceil(hpRatio * 10));
    const tier = hpRatio > 0.5 ? 'cyan' : (hpRatio > 0.25 ? 'amber' : 'red');

    if (dom.origHpSegments.length === 10 && (litCount !== lastLitSegments || tier !== lastHpTier)) {
      lastLitSegments = litCount;
      lastHpTier = tier;
      const litCls = tier === 'cyan'
        ? 'hp-segment w-2 h-4 bg-[#00f0ff] rounded-[1px] shadow-[0_0_4px_#00f0ff]'
        : (tier === 'amber'
          ? 'hp-segment w-2 h-4 bg-amber-400 rounded-[1px] shadow-[0_0_4px_#f5921e]'
          : 'hp-segment w-2 h-4 bg-rose-500 rounded-[1px] shadow-[0_0_4px_#f43f5e]');
      const offCls = 'hp-segment w-2 h-4 bg-white/15 rounded-[1px]';
      for (let i = 0; i < 10; i++) {
        dom.origHpSegments[i].className = i < litCount ? litCls : offCls;
      }
    }

    if (dom.origShieldFill) {
      dom.origShieldFill.style.width = `${Math.max(0, Math.min(100, (p.shield / maxSh) * 100)).toFixed(1)}%`;
    }
    if (summary) {
      setTextCached('origName', dom.origEquipName, `天罡剑匣 (${summary.equippedCount}/4剑)`);
      setTextCached('origType', dom.origEquipType, `攻速 ${summary.speedMult.toFixed(2)}× · [Tab]配剑`);
    }
  }

  function updateHUD(dt) {
    if (!rootEl || rootEl.classList.contains('hidden')) return;
    const p = window.CombatPlayer ? window.CombatPlayer.getState() : null;
    const cfg = window.CombatConfig || {};
    if (!p) return;

    // 1. 高频视觉平滑项 (每帧)
    if (hitmarkerTimer > 0) {
      hitmarkerTimer -= dt;
      if (hitmarkerTimer <= 0 && dom.hitmarker) dom.hitmarker.classList.remove('active');
    }
    if (dom.dmgVig) {
      damageFlashTimer = Math.max(0, damageFlashTimer - dt);
      const lowHpAlpha = p.hp < 30 ? 0.35 : 0;
      const op = Math.max(lowHpAlpha, (damageFlashTimer / 0.25) * 0.95).toFixed(2);
      if (lastText.dmgOp !== op) { lastText.dmgOp = op; dom.dmgVig.style.opacity = op; }
    }
    if (dom.pFlash) {
      parryFlashTimer = Math.max(0, parryFlashTimer - dt);
      const op = (parryFlashTimer / 0.22).toFixed(2);
      if (lastText.parryOp !== op) { lastText.parryOp = op; dom.pFlash.style.opacity = op; }
    }
    if (dom.dStreak) {
      dashFlashTimer = Math.max(0, dashFlashTimer - dt);
      const op = (dashFlashTimer / 0.20).toFixed(2);
      if (lastText.dashOp !== op) { lastText.dashOp = op; dom.dStreak.style.opacity = op; }
    }

    const maxSh = cfg.player.maxShield || 60;
    const maxQi = cfg.player.maxQi || 100;
    if (dom.shieldBar) dom.shieldBar.style.width = `${Math.max(0, Math.min(100, (p.shield / maxSh) * 100)).toFixed(1)}%`;
    if (dom.qiBar) dom.qiBar.style.width = `${Math.max(0, Math.min(100, (p.qi / maxQi) * 100)).toFixed(1)}%`;

    if (dom.chargeArc) {
      const chargeDur = cfg.player.chargeTime || 0.65;
      const ratio = p.isCharging ? Math.min(1, p.chargeTime / chargeDur) : 0;
      dom.chargeArc.style.strokeDashoffset = (176 * (1 - ratio)).toFixed(1);
      dom.chargeArc.style.stroke = ratio >= 0.96 ? '#fde047' : (p.lastFiredColor || '#38bdf8');
    }
    if (dom.reticleDot && lastText.retCol !== p.lastFiredColor) {
      lastText.retCol = p.lastFiredColor;
      dom.reticleDot.style.background = p.lastFiredColor || '#ffffff';
    }

    const enemies = window.CombatEnemies ? window.CombatEnemies.getEnemies() : [];

    // 2. 低频文本/原有左下角血条/底部技能冷却 (~12Hz)
    textTickAccum += dt;
    if (textTickAccum >= 0.08) {
      textTickAccum = 0;
      const summary = window.CombatCasket && window.CombatCasket.getSummary ? window.CombatCasket.getSummary() : null;
      updateOriginalBottomLeftHud(p, cfg, summary);

      setTextCached('shTxt', dom.shieldText, `${Math.ceil(p.shield)}/${maxSh}`);
      setTextCached('qiTxt', dom.qiText, `${Math.floor(p.qi)}/${maxQi}`);

      if (summary) {
        setTextCached('cMini', dom.casketSpeedMini, `${summary.equippedCount}剑 ${summary.speedMult.toFixed(2)}×`);
        setTextCached('atkSub', dom.attackRateSub, `${summary.fireRatePerSec.toFixed(1)}发/s`);
        for (let i = 0; i < 4; i++) {
          const led = dom.casketLeds[i];
          const s = summary.slots[i];
          if (!led) continue;
          const ledKey = s && s.equipped ? `${s.profile.id}_${s.state}` : 'empty';
          if (lastText[`led_${i}`] !== ledKey) {
            lastText[`led_${i}`] = ledKey;
            if (!s || !s.equipped) {
              led.style.backgroundColor = '#334155';
              led.style.opacity = '0.45';
            } else {
              led.style.backgroundColor = s.profile.cssColor;
              led.style.opacity = s.state === 'docked' ? '1' : '0.35';
            }
          }
        }
      }

      const updateSlotCd = (key, btn, rem) => {
        if (!btn) return;
        const stSpan = btn.children[2];
        if (!stSpan) return;
        const txt = rem > 0.05 ? `${rem.toFixed(1)}s` : '就绪';
        const cls = rem > 0.05 ? 'text-[8px] text-amber-400' : 'text-[8px] text-emerald-400';
        const k = `${txt}_${rem > 0.05 ? 1 : 0}`;
        if (lastText[key] !== k) {
          lastText[key] = k;
          stSpan.innerText = txt;
          stSpan.className = cls;
        }
      };

      updateSlotCd('cdTal', dom.cdTalisman, p.talismanCd);
      updateSlotCd('cdThu', dom.cdThunder, p.thunderSealCd);
      updateSlotCd('cdDash', dom.cdDash, p.dashCooldown);
      updateSlotCd('cdWh', dom.cdWanHun, p.wanHunCd);
      updateSlotCd('cdPill', dom.cdPill, p.pillCd);

      if (typeof playerInventory !== 'undefined') {
        const totalBodies = (playerInventory.MAT_020 || 0) + (playerInventory.MAT_055 || 0) + (playerInventory.MAT_056 || 0);
        setTextCached('corpseBag', dom.corpseCountSpan, `尸:${totalBodies}`);
      }

      const aliveCount = enemies.filter((e) => e.state !== 'dead').length;
      if (window.CombatAIDirector) {
        const ts = window.CombatAIDirector.getTokenSummary();
        setTextCached('tok', dom.tokenStatus, `令牌 近${ts.meleeUsed}/${cfg.aiDirector.maxMeleeTokens}·远${ts.rangedUsed}/${cfg.aiDirector.maxRangedTokens}`);
      }
      setTextCached('tCnt', dom.tuningEnemyCount, `存活: ${aliveCount} / 总 ${enemies.length}`);
      if (drawerEl && !drawerEl.classList.contains('hidden') && dom.tuningCasketBox) {
        const cHtml = renderTuningCasketHTML();
        if (lastText.tCask !== cHtml) { lastText.tCask = cHtml; dom.tuningCasketBox.innerHTML = cHtml; }
      }
    }

    if (dom.downOverlay) {
      dom.downOverlay.classList.toggle('hidden', !p.isDown);
      if (p.isDown) setTextCached('downTxt', dom.downCountdown, `正在于宗门基地重构控制... ${Math.max(0, p.downTimer).toFixed(1)}s`);
    }
    if (dom.boxWrap) {
      dom.boxWrap.classList.toggle('hidden', !p.boxingTarget);
      if (p.boxingTarget) {
        if (dom.boxLabel && p.boxingLabel) setTextCached('boxLbl', dom.boxLabel, p.boxingLabel);
        if (dom.boxFill) dom.boxFill.style.width = `${Math.round(p.boxingHoldProgress * 100)}%`;
      }
    }

    // 3. 3D 投影更新
    updateProjectedUI(p, enemies, cfg);
  }

  function updateProjectedUI(p, enemies, cfg) {
    const cam = window.World3D && window.World3D.getCamera ? window.World3D.getCamera() : null;
    if (!cam) return;

    const grabTarget = (!p.isGrabbing && window.CombatPlayer)
      ? window.CombatPlayer.findCrosshairEnemy(cfg.player.grabRange || 14, 0.80, true)
      : null;

    if (dom.cdGrab) {
      dom.cdGrab.classList.toggle('core-ready', !!grabTarget);
      const st = dom.cdGrab.children[2];
      if (st) {
        const nextTxt = grabTarget ? '可拔核!' : '待露核';
        if (lastText.grabBtn !== nextTxt) {
          lastText.grabBtn = nextTxt;
          st.innerText = nextTxt;
          st.className = grabTarget ? 'text-[8px] text-yellow-300 font-bold' : 'text-[8px] text-slate-400';
        }
      }
    }

    if (dom.corePrompt && grabTarget) {
      tempVec.set(grabTarget.pos.x, grabTarget.pos.y + 1.15, grabTarget.pos.z).project(cam);
      if (tempVec.z <= 1) {
        dom.corePrompt.classList.remove('hidden');
        dom.corePrompt.style.left = `${((tempVec.x * 0.5 + 0.5) * window.innerWidth).toFixed(1)}px`;
        dom.corePrompt.style.top = `${((-tempVec.y * 0.5 + 0.5) * window.innerHeight).toFixed(1)}px`;
      } else {
        dom.corePrompt.classList.add('hidden');
      }
    } else if (dom.corePrompt) {
      dom.corePrompt.classList.add('hidden');
    }

    let bossEnemy = null;
    const offArcs = [];
    const showLabels = !!(cfg.aiDirector && cfg.aiDirector.showAiDebugLabels);
    const activeIds = new Set();

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.type === 'jindan' && e.state !== 'dead') bossEnemy = e;
      if (e.state === 'dead' && e.corpseBoxed) continue;

      const d = e.pos.distanceTo(p.pos);
      if (d > 45) continue;

      if (e.state === 'windup' && window.CombatAIDirector) {
        const off = window.CombatAIDirector.getOffscreenInfo(e.pos, p.pos, p.yaw);
        if (off.isOffscreen) offArcs.push(Math.round((off.screenAngleRad * 180) / Math.PI));
      }

      const anchorY = e.state === 'dead' ? 0.65 : (e.type === 'jindan' ? 3.9 : 2.35);
      tempVec.set(e.pos.x, anchorY, e.pos.z).project(cam);
      if (tempVec.z > 1 || tempVec.z < -1) continue;

      const sx = (tempVec.x * 0.5 + 0.5) * window.innerWidth;
      const sy = (-tempVec.y * 0.5 + 0.5) * window.innerHeight;
      if (sx < -80 || sx > window.innerWidth + 80 || sy < -40 || sy > window.innerHeight + 40) continue;

      activeIds.add(e.id);
      const plate = getOrCreatePlate(e);
      if (!plate.visible) {
        plate.el.style.display = '';
        plate.visible = true;
      }
      plate.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;

      const hpPct = e.state === 'dead' ? -1 : Math.max(0, Math.min(100, Math.round((e.hp / e.maxHp) * 100)));
      if (plate.lastHp !== hpPct) {
        plate.lastHp = hpPct;
        if (hpPct < 0) plate.hpWrap.style.display = 'none';
        else {
          plate.hpWrap.style.display = '';
          plate.hpFill.style.width = `${hpPct}%`;
        }
      }

      if (plate.shFill) {
        const shPct = Math.max(0, Math.min(100, Math.round((e.shield / e.maxShield) * 100)));
        if (plate.lastSh !== shPct) {
          plate.lastSh = shPct;
          plate.shFill.style.width = `${shPct}%`;
        }
      }

      const isExp = e.state === 'coreExposed';
      if (plate.lastExposed !== isExp) {
        plate.lastExposed = isExp;
        plate.el.className = `combat-enemy-plate bg-black/80 border ${isExp ? 'border-yellow-400 shadow-[0_0_12px_#fde047]' : 'border-white/15'} rounded px-1.5 py-1 text-[10px]`;
      }

      if (plate.lastShowLabel !== showLabels) {
        plate.lastShowLabel = showLabels;
        plate.stateEl.style.display = showLabels ? '' : 'none';
      }
      if (showLabels && plate.lastState !== e.stateLabel) {
        plate.lastState = e.stateLabel;
        plate.stateEl.innerText = e.stateLabel;
        plate.stateEl.className = `plate-state mt-0.5 text-[9px] font-mono ${isExp ? 'text-yellow-300 font-black' : (e.state === 'windup' ? 'text-rose-300 font-bold' : 'text-cyan-200/90')} text-center`;
      }
    }

    platePool.forEach((plate, id) => {
      if (!activeIds.has(id) && plate.visible) {
        plate.el.style.display = 'none';
        plate.visible = false;
      }
    });

    if (dom.bossWrap) {
      dom.bossWrap.classList.toggle('hidden', !bossEnemy);
      if (bossEnemy) {
        setTextCached('bossName', dom.bossName, `${bossEnemy.name} · 阶段${bossEnemy.phase}`);
        setTextCached('bossHp', dom.bossHpText, `${Math.ceil(bossEnemy.hp)} / ${bossEnemy.maxHp}`);
        dom.bossShieldFill.style.width = `${Math.max(0, (bossEnemy.shield / bossEnemy.maxShield) * 100).toFixed(1)}%`;
        dom.bossHpFill.style.width = `${Math.max(0, (bossEnemy.hp / bossEnemy.maxHp) * 100).toFixed(1)}%`;
      }
    }

    if (dom.offRing) {
      if (p.lastHitFlashTimer > 0 && p.lastHitDirAngle !== null) {
        offArcs.push(Math.round((p.lastHitDirAngle * 180) / Math.PI));
      }
      const key = offArcs.join(',');
      if (lastOffscreenKey !== key) {
        lastOffscreenKey = key;
        dom.offRing.innerHTML = offArcs.map((deg) => `<div class="combat-offscreen-arc" style="transform:rotate(${deg}deg);"></div>`).join('');
      }
    }
  }

  window.CombatHUD = {
    setVisible,
    toggleTuningDrawer,
    updateLockIndicator,
    triggerHitmarker,
    flashDamage,
    flashParry,
    flashDash,
    updateHUD
  };
})();
