const fs = require('fs');

let html = fs.readFileSync('scratch/temp_part1.html', 'utf8');

// 1. Replace section 3 (盘体结构定义) & initBoardSlots
const sec3Idx = html.indexOf('/* =========================================================================\n       3. 盘体结构定义');
const sec4Idx = html.indexOf('/* =========================================================================\n       4. 左侧芯片调色板渲染');

const newSec3Code = `/* =========================================================================
       3. 三大主盘结构定义 + 境界环数配比 (练气:2/1环 | 筑基:3/2环 | 金丹:4/3环)
       ========================================================================= */
    let CURRENT_REALM = 'qi';      // 'qi' | 'foundation' | 'core'
    let SPEC_DISC = 'combat';      // 'combat' | 'industry' | 'support' (单选主修盘)

    // 中心核状态：记录各盘中心是否已被射入充能、是否已被取下
    const CENTER_CORE_STATE = {
      support:  { charged: false, detached: false, placedAtSlot: null },
      industry: { charged: false, detached: false, placedAtSlot: null },
      combat:   { charged: false, detached: false, placedAtSlot: null }
    };

    const DISC_CONFIG = {
      support: {
        key: 'support',
        name: '🛡️ 辅助盘',
        cx: 1210, cy: 160,
        emitAngleDeg: 154.36, // 最外圈固定方位射出角
        nodeBorder: 'border-sky-500 hover:border-sky-700 bg-sky-50/95 hover:bg-sky-100',
        nodeDot: 'bg-sky-500',
        nodeBadge: 'bg-sky-600 text-white border-sky-300',
        rings: [
          { tier: 1, id: 'support_1', name: '辅助盘·1环(内)', radius: 26, slotCount: 4 },
          { tier: 2, id: 'support_2', name: '辅助盘·2环',     radius: 48, slotCount: 6 },
          { tier: 3, id: 'support_3', name: '辅助盘·3环',     radius: 70, slotCount: 8 },
          { tier: 4, id: 'support_4', name: '辅助盘·4环(外)', radius: 92, slotCount: 10 }
        ]
      },
      industry: {
        key: 'industry',
        name: '⚙️ 工厂盘',
        cx: 960, cy: 280,
        emitAngleDeg: 159.75, // 最外圈固定方位射出角
        nodeBorder: 'border-amber-500 hover:border-amber-700 bg-amber-50/95 hover:bg-amber-100',
        nodeDot: 'bg-amber-500',
        nodeBadge: 'bg-amber-600 text-white border-amber-300',
        rings: [
          { tier: 1, id: 'industry_1', name: '工厂盘·1环(内)', radius: 44,  slotCount: 4 },
          { tier: 2, id: 'industry_2', name: '工厂盘·2环',     radius: 80,  slotCount: 8 },
          { tier: 3, id: 'industry_3', name: '工厂盘·3环',     radius: 112, slotCount: 10 },
          { tier: 4, id: 'industry_4', name: '工厂盘·4环(外)', radius: 144, slotCount: 12 }
        ]
      },
      combat: {
        key: 'combat',
        name: '⚔️ 攻击盘',
        cx: 450, cy: 470,
        emitAngleDeg: 156.57, // 最外圈固定方位射出角
        nodeBorder: 'border-rose-500 hover:border-rose-700 bg-rose-50/95 hover:bg-rose-100',
        nodeDot: 'bg-rose-500',
        nodeBadge: 'bg-rose-600 text-white border-rose-300',
        rings: [
          { tier: 1, id: 'combat_1', name: '攻击盘·1环(内)', radius: 72,  slotCount: 6 },
          { tier: 2, id: 'combat_2', name: '攻击盘·2环',     radius: 115, slotCount: 8 },
          { tier: 3, id: 'combat_3', name: '攻击盘·3环',     radius: 158, slotCount: 10 },
          { tier: 4, id: 'combat_4', name: '攻击盘·4环(外)', radius: 200, slotCount: 16 }
        ]
      }
    };

    function getActiveRingCounts() {
      const cfg = {
        qi:         { primary: 2, secondary: 1 },
        foundation: { primary: 3, secondary: 2 },
        core:       { primary: 4, secondary: 3 }
      }[CURRENT_REALM] || { primary: 2, secondary: 1 };
      return {
        combat:   SPEC_DISC === 'combat'   ? cfg.primary : cfg.secondary,
        industry: SPEC_DISC === 'industry' ? cfg.primary : cfg.secondary,
        support:  SPEC_DISC === 'support'  ? cfg.primary : cfg.secondary
      };
    }

    const DISK_RINGS = {};
    for (const [dKey, dMeta] of Object.entries(DISC_CONFIG)) {
      dMeta.rings.forEach(r => {
        DISK_RINGS[r.id] = {
          id: r.id,
          discKey: dKey,
          tier: r.tier,
          name: r.name,
          cx: dMeta.cx,
          cy: dMeta.cy,
          radius: r.radius,
          slotCount: r.slotCount,
          currentAngle: 0,
          slotOffset: 0,
          elId: 'ringEl_' + r.id,
          degId: 'deg_' + r.id
        };
      });
    }

    let BOARD_SLOTS = {};
    function initBoardSlots() {
      const prev = Object.assign({}, BOARD_SLOTS);
      BOARD_SLOTS = {};
      for (const [ringKey, ringMeta] of Object.entries(DISK_RINGS)) {
        for (let i = 0; i < ringMeta.slotCount; i++) {
          const sKey = `${ringKey}_${i}`;
          BOARD_SLOTS[sKey] = {
            ringId: ringKey,
            discKey: ringMeta.discKey,
            tier: ringMeta.tier,
            slotIndex: i,
            chip: prev[sKey] ? prev[sKey].chip : null
          };
        }
      }
    }

    function setRealm(realmKey) {
      if (!['qi', 'foundation', 'core'].includes(realmKey)) return;
      CURRENT_REALM = realmKey;
      ['qi', 'foundation', 'core'].forEach(k => {
        const btn = document.getElementById('btn_realm_' + k);
        if (!btn) return;
        btn.className = (k === realmKey)
          ? 'px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold font-mono-sci shadow-xs transition'
          : 'px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition';
      });
      if (audio) audio.playSelect();
      refreshDiscRingsAndSlots();
    }
    window.setRealm = setRealm;

    function setSpecDisc(discKey) {
      if (!['combat', 'industry', 'support'].includes(discKey)) return;
      SPEC_DISC = discKey;
      const activeStyles = {
        combat:   'px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold font-mono-sci shadow-xs transition',
        industry: 'px-2 py-0.5 rounded bg-amber-600 text-white text-[11px] font-bold font-mono-sci shadow-xs transition',
        support:  'px-2 py-0.5 rounded bg-sky-600 text-white text-[11px] font-bold font-mono-sci shadow-xs transition'
      };
      ['combat', 'industry', 'support'].forEach(k => {
        const btn = document.getElementById('btn_spec_' + k);
        if (!btn) return;
        btn.className = (k === discKey)
          ? activeStyles[k]
          : 'px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition';
      });
      if (audio) audio.playSelect();
      refreshDiscRingsAndSlots();
    }
    window.setSpecDisc = setSpecDisc;

    // 渲染三盘动态环体 (100%保持第一版黑白青精密工程样式，不改盘体颜色)
    function renderDynamicRingsDOM() {
      const container = document.getElementById('dynamicRingsDomContainer');
      if (!container) return;
      const counts = getActiveRingCounts();
      let htmlStr = '';

      for (const [dKey, dMeta] of Object.entries(DISC_CONFIG)) {
        const maxTier = counts[dKey];
        // 更新标牌角标
        const badgeEl = document.getElementById('badge_disc_' + dKey);
        if (badgeEl) {
          const isSpec = (SPEC_DISC === dKey);
          badgeEl.textContent = `${maxTier}环·${isSpec ? '主修' : '次级'}`;
          badgeEl.className = isSpec
            ? 'text-[9.5px] font-mono-sci font-bold px-1.5 rounded bg-slate-900 text-amber-300'
            : 'text-[9.5px] font-mono-sci font-bold px-1.5 rounded bg-slate-100 text-slate-600';
        }

        dMeta.rings.forEach(r => {
          if (r.tier > maxTier) return;
          const ringObj = DISK_RINGS[r.id];
          const isOuter = (r.tier === maxTier);
          const size = r.radius * 2;
          const left = dMeta.cx - r.radius;
          const top = dMeta.cy - r.radius;
          const borderClass = isOuter ? 'border-2 border-slate-900' : 'border border-slate-600';
          htmlStr += \`
            <div id="\${ringObj.elId}" class="absolute rounded-full \${borderClass} ring-trans pointer-events-none"
                 style="width: \${size}px; height: \${size}px; left: \${left}px; top: \${top}px; transform: rotate(\${ringObj.currentAngle}deg);">
              <div class="absolute inset-0 rounded-full border border-dashed border-sky-400/70"></div>
              <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[7.5px] font-mono-sci text-slate-800 font-bold bg-white px-1.5 rounded border border-slate-300 shadow-xs whitespace-nowrap">
                \${r.tier}环·\${r.slotCount}槽
              </div>
            </div>
          \`;
        });
      }
      container.innerHTML = htmlStr;
    }

    // 渲染每盘最外圈固定方位的射出点
    function renderOuterFixedNozzles() {
      const layer = document.getElementById('outerFixedNozzlesLayer');
      if (!layer) return;
      const counts = getActiveRingCounts();
      let htmlStr = '';

      for (const [dKey, dMeta] of Object.entries(DISC_CONFIG)) {
        const outTier = counts[dKey];
        const outRing = DISK_RINGS[\`\${dKey}_\${outTier}\`];
        if (!outRing) continue;
        const rad = (dMeta.emitAngleDeg * Math.PI) / 180;
        const nx = dMeta.cx + outRing.radius * Math.cos(rad);
        const ny = dMeta.cy + outRing.radius * Math.sin(rad);

        htmlStr += \`
          <div class="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
               style="left: \${nx}px; top: \${ny}px;"
               title="【\${dMeta.name} · 最外圈固定射出点】">
            <div class="w-4 h-4 rounded-full bg-slate-900 border-2 border-sky-400 shadow flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-sky-300 animate-ping"></div>
            </div>
            <span class="absolute -bottom-3.5 px-1 rounded bg-slate-900 text-sky-300 text-[6.5px] font-mono-sci font-bold whitespace-nowrap border border-sky-500/60 shadow-xs">
              射出点
            </span>
          </div>
        \`;
      }
      layer.innerHTML = htmlStr;
    }

    // 点击盘心极核：当光路射入中心后，可取下中心核放到其他盘外圈插槽以激活导入线！
    function handleCenterCoreClick(discKey, e) {
      if (e) e.stopPropagation();
      const state = CENTER_CORE_STATE[discKey];
      const coreChipId = 'core_' + discKey;

      // 如果该核心已经被安放在某个插槽上，点击盘心可将其召回或重新拿在手上
      if (state.placedAtSlot && BOARD_SLOTS[state.placedAtSlot]) {
        BOARD_SLOTS[state.placedAtSlot].chip = null;
        state.placedAtSlot = null;
        state.detached = false;
        ACTIVE_SELECTED_CHIP = null;
        updateSelectedChipIndicator();
        if (audio) audio.playRemove();
        refreshDiscRingsAndSlots();
        return;
      }

      if (!state.charged) {
        // 尚未被光路射入中心时，提示玩家先将光路折射入盘心
        alert(\`【\${DISC_CONFIG[discKey].name}中心尚未激活】\\n请先在该盘插槽中放置芯片与「🔺 变轨三角」，将光路向心射入盘体中心后，即可取下该中心核！\`);
        return;
      }

      // 已射入中心！取下中心核到鼠标选中状态
      state.detached = true;
      ACTIVE_SELECTED_CHIP = coreChipId;
      if (audio) audio.playSelect();
      updateSelectedChipIndicator();
      updateCenterHubsDOM();
      renderPalette();
    }
    window.handleCenterCoreClick = handleCenterCoreClick;

    function updateCenterHubsDOM() {
      for (const [dKey, dMeta] of Object.entries(DISC_CONFIG)) {
        const state = CENTER_CORE_STATE[dKey];
        const boxEl = document.getElementById('centerCoreBox_' + dKey);
        const textEl = document.getElementById('centerCoreText_' + dKey);
        const badgeEl = document.getElementById('centerCoreBadge_' + dKey);
        if (!boxEl || !textEl || !badgeEl) continue;

        if (state.placedAtSlot) {
          boxEl.className = 'relative w-10 h-10 rounded-full bg-slate-100 border-2 border-dashed border-slate-400 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110';
          textEl.textContent = '已外置(点击召回)';
          badgeEl.className = 'mt-0.5 px-1.5 py-0.2 rounded bg-slate-800 text-[7px] font-mono-sci font-bold text-sky-300 border border-sky-400 whitespace-nowrap shadow-xs';
        } else if (ACTIVE_SELECTED_CHIP === 'core_' + dKey) {
          boxEl.className = 'relative w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-500 ring-4 ring-amber-300/60 flex items-center justify-center shadow-lg animate-bounce';
          textEl.textContent = '👉请点其他盘外圈槽放置';
          badgeEl.className = 'mt-0.5 px-1.5 py-0.2 rounded bg-amber-500 text-[7px] font-mono-sci font-bold text-slate-950 border border-slate-900 whitespace-nowrap shadow';
        } else if (state.charged) {
          boxEl.className = 'relative w-11 h-11 rounded-full bg-amber-50 border-2 border-amber-500 ring-4 ring-sky-400/50 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125';
          textEl.textContent = '⚡已射入·点击取下!';
          badgeEl.className = 'mt-0.5 px-1.5 py-0.2 rounded bg-slate-900 text-[7.5px] font-mono-sci font-bold text-amber-300 border border-amber-400 whitespace-nowrap shadow-md';
        } else {
          boxEl.className = 'relative w-10 h-10 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-110';
          textEl.textContent = dMeta.name.slice(2).trim() + '中心(待射入)';
          badgeEl.className = 'mt-0.5 px-1.5 py-0.2 rounded bg-white text-[7px] font-mono-sci font-bold text-slate-700 border border-slate-400 whitespace-nowrap shadow-xs';
        }
      }
    }

    function refreshDiscRingsAndSlots() {
      renderDynamicRingsDOM();
      renderOuterFixedNozzles();
      renderBoardSlots();
      renderFloorBase(true);
      solveStepNetwork();
      updateCenterHubsDOM();
    }

`;

html = html.substring(0, sec3Idx) + newSec3Code + html.substring(sec4Idx);

console.log('Replaced Section 3 successfully.');
fs.writeFileSync('scratch/temp_part2.html', html);
