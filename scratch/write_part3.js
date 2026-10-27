const fs = require('fs');

const part3 = `
  <script>
    /* =========================================================================
       1. 音频合成引擎
       ========================================================================= */
    const audio = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
      },
      play(freq, type, duration, vol = 0.08) {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(vol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      },
      playRotate() { this.play(520, 'sine', 0.04, 0.04); },
      playPlace() { this.play(880, 'triangle', 0.08, 0.07); },
      playRemove() { this.play(330, 'sine', 0.08, 0.07); },
      playSelect() { this.play(1040, 'sine', 0.05, 0.05); }
    };

    /* =========================================================================
       2. 芯片与插件数据库 (规范化命名)
       ========================================================================= */
    // SPECS_PLACEHOLDER

    /* =========================================================================
       3. 三才阵盘空间几何 (离火攻击盘·顶 / 辰土工厂盘·左下 / 碧水辅助盘·右下)
       ========================================================================= */
    const DISC_META = {
      combat: {
        id: 'combat',
        name: '离火攻击盘',
        cx: 720,
        cy: 195,
        color: '#f43f5e',
        theme: 'rose',
        outAngleDeg: 120 // 射向工厂盘或三才台
      },
      industry: {
        id: 'industry',
        name: '辰土工厂盘',
        cx: 380,
        cy: 515,
        color: '#f59e0b',
        theme: 'amber',
        outAngleDeg: 45 // 射向攻击盘
      },
      support: {
        id: 'support',
        name: '碧水辅助盘',
        cx: 1060,
        cy: 515,
        color: '#0ea5e9',
        theme: 'sky',
        outAngleDeg: 180 // 射向工厂盘
      }
    };

    const RING_TIER_DEFS = [
      { tier: 1, radius: 48,  slotCount: 6,  stepAngle: 60,   label: '1环 (内宿6位)' },
      { tier: 2, radius: 84,  slotCount: 8,  stepAngle: 45,   label: '2环 (中宿8位)' },
      { tier: 3, radius: 120, slotCount: 12, stepAngle: 30,   label: '3环 (外宿12位)' },
      { tier: 4, radius: 156, slotCount: 16, stepAngle: 22.5, label: '4环 (绝顶16位)' }
    ];

    /* =========================================================================
       4. 境界规则与单选特化配置 (练气: 1主2环/2次1环; 筑基: 1主3环/2次2环; 金丹: 1主4环/2次3环)
       ========================================================================= */
    let CURRENT_REALM = 'qi'; // 'qi' | 'foundation' | 'core'
    let SPECIALIZED_DISC = 'combat'; // 'combat' | 'industry' | 'support' (单选)

    function getDiscRingCounts() {
      const realmConfig = {
        qi:         { primary: 2, secondary: 1 },
        foundation: { primary: 3, secondary: 2 },
        core:       { primary: 4, secondary: 3 }
      }[CURRENT_REALM] || { primary: 2, secondary: 1 };

      return {
        combat:   (SPECIALIZED_DISC === 'combat')   ? realmConfig.primary : realmConfig.secondary,
        industry: (SPECIALIZED_DISC === 'industry') ? realmConfig.primary : realmConfig.secondary,
        support:  (SPECIALIZED_DISC === 'support')  ? realmConfig.primary : realmConfig.secondary
      };
    }

    function setRealm(realmKey) {
      if (['qi', 'foundation', 'core'].includes(realmKey)) {
        CURRENT_REALM = realmKey;
        ['qi', 'foundation', 'core'].forEach(k => {
          const btn = document.getElementById('btn_realm_' + k);
          if (!btn) return;
          if (k === realmKey) {
            btn.className = 'px-2.5 py-1 rounded-lg bg-sky-600 text-white font-mono-sci shadow-xs transition';
          } else {
            btn.className = 'px-2.5 py-1 rounded-lg bg-transparent text-slate-400 hover:text-white font-mono-sci transition';
          }
        });
        audio.playSelect();
        applyDiscRingConfiguration();
      }
    }

    function setSpecialization(discKey) {
      if (['combat', 'industry', 'support'].includes(discKey)) {
        SPECIALIZED_DISC = discKey;
        const colorMap = {
          combat: 'bg-rose-600 text-white',
          industry: 'bg-amber-600 text-white',
          support: 'bg-sky-600 text-white'
        };
        ['combat', 'industry', 'support'].forEach(k => {
          const btn = document.getElementById('btn_spec_' + k);
          if (!btn) return;
          if (k === discKey) {
            btn.className = \`px-2.5 py-1 rounded-lg \${colorMap[k]} font-mono-sci shadow-xs transition flex items-center space-x-1.5\`;
          } else {
            btn.className = 'px-2.5 py-1 rounded-lg bg-transparent text-slate-400 hover:text-white font-mono-sci transition flex items-center space-x-1.5';
          }
        });
        audio.playSelect();
        applyDiscRingConfiguration();
      }
    }

    let DISK_RINGS = {};
    let BOARD_SLOTS = {};

    function initDiscRings() {
      DISK_RINGS = {};
      const counts = getDiscRingCounts();

      for (const [discKey, discMeta] of Object.entries(DISC_META)) {
        const activeCount = counts[discKey];
        for (let t = 1; t <= 4; t++) {
          const tierDef = RING_TIER_DEFS[t - 1];
          const ringKey = \`\${discKey}_\${t}\`;
          DISK_RINGS[ringKey] = {
            key: ringKey,
            discKey: discKey,
            tier: t,
            isActive: (t <= activeCount),
            name: \`\${discMeta.name} · 第\${t}环\`,
            cx: discMeta.cx,
            cy: discMeta.cy,
            radius: tierDef.radius,
            slotCount: tierDef.slotCount,
            currentAngle: 0,
            slotOffset: 0
          };
        }
      }
    }

    function initBoardSlots() {
      const oldSlots = Object.assign({}, BOARD_SLOTS);
      BOARD_SLOTS = {};

      for (const [ringKey, ringMeta] of Object.entries(DISK_RINGS)) {
        for (let i = 0; i < ringMeta.slotCount; i++) {
          const slotKey = \`\${ringKey}_\${i}\`;
          BOARD_SLOTS[slotKey] = {
            slotKey: slotKey,
            ringKey: ringKey,
            discKey: ringMeta.discKey,
            tier: ringMeta.tier,
            slotIndex: i,
            chip: (oldSlots[slotKey] ? oldSlots[slotKey].chip : null)
          };
        }
      }
    }

    function applyDiscRingConfiguration() {
      const counts = getDiscRingCounts();

      for (const [ringKey, ring] of Object.entries(DISK_RINGS)) {
        ring.isActive = (ring.tier <= counts[ring.discKey]);
      }

      renderRingsDOM();
      renderBoardSlots();
      solveStepNetwork();
    }

    function getSlotWorldPos(ringKey, slotIndex) {
      const ring = DISK_RINGS[ringKey];
      if (!ring) return { x: 0, y: 0, angleDeg: 0 };
      const baseDeg = -90 + (slotIndex * (360 / ring.slotCount));
      const effectiveDeg = (baseDeg + ring.currentAngle + 360) % 360;
      const rad = (effectiveDeg * Math.PI) / 180;
      return {
        x: ring.cx + ring.radius * Math.cos(rad),
        y: ring.cy + ring.radius * Math.sin(rad),
        angleDeg: effectiveDeg,
        cx: ring.cx,
        cy: ring.cy
      };
    }

    /* =========================================================================
       5. 动态圆盘 DOM 渲染与外圈射出点
       ========================================================================= */
    function renderRingsDOM() {
      const container = document.getElementById('ringsDomLayer');
      if (!container) return;

      const counts = getDiscRingCounts();
      let html = '';

      for (const [discKey, meta] of Object.entries(DISC_META)) {
        const activeTiers = counts[discKey];

        for (let t = 1; t <= 4; t++) {
          const tierDef = RING_TIER_DEFS[t - 1];
          const ringKey = \`\${discKey}_\${t}\`;
          const ring = DISK_RINGS[ringKey];
          const isActive = (t <= activeTiers);
          const isOutermost = (t === activeTiers);
          const size = tierDef.radius * 2;
          const left = meta.cx - tierDef.radius;
          const top = meta.cy - tierDef.radius;
          const curDeg = ring ? ring.currentAngle : 0;

          html += \`
            <div id="ringEl_\${ringKey}" class="absolute rounded-full ring-trans transition-opacity duration-300" 
                 style="width: \${size}px; height: \${size}px; left: \${left}px; top: \${top}px; transform: rotate(\${curDeg}deg); opacity: \${isActive ? '1' : '0.15'};">
              
              <!-- 环道边框线 -->
              <div class="absolute inset-0 rounded-full border \${
                isActive 
                  ? (isOutermost ? \`border-2 border-\${meta.theme}-400 shadow-md\` : \`border border-\${meta.theme}-500/70\`)
                  : 'border border-dashed border-slate-700'
              }"></div>

              <!-- 环名与旋转微调 [+] [-] 按键 -->
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-slate-900 border border-slate-700 rounded-full px-1.5 py-0.2 text-[8px] font-mono-sci font-bold text-slate-300 shadow-md pointer-events-auto">
                <button onclick="rotateRing('\${ringKey}', -1); event.stopPropagation();" class="hover:text-sky-400 px-0.5">◀</button>
                <span class="mx-0.5 text-\${meta.theme}-400">R\${t}</span>
                <button onclick="rotateRing('\${ringKey}', 1); event.stopPropagation();" class="hover:text-sky-400 px-0.5">▶</button>
              </div>

              <!-- ✦ 核心：环的外圈射出点 (仅在该盘当前活跃最外环展示) ✦ -->
              \${isOutermost ? \`
                <div class="absolute z-30 flex items-center" 
                     style="left: \${discKey === 'combat' ? size * 0.25 : (discKey === 'industry' ? size * 0.85 : 0)}px; 
                            top: \${discKey === 'combat' ? size * 0.85 : size / 2}px; 
                            transform: translate(-50%, -50%);"
                     title="【\${meta.name} · 外圈射出端口】">
                  <div class="w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-lg flex items-center justify-center">
                    <div class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                  </div>
                  <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 rounded bg-slate-950 text-cyan-300 text-[7px] font-mono-sci font-bold whitespace-nowrap border border-cyan-500/80 shadow">
                    射出点
                  </div>
                </div>
              \` : ''}

            </div>
          \`;
        }
      }

      container.innerHTML = html;
    }

    /* =========================================================================
       6. 炫彩芯片与插槽层级渲染 (芯片永不被遮挡)
       ========================================================================= */
    let SLOTS_DOM_INITIALIZED = false;

    function renderBoardSlots() {
      const container = document.getElementById('slotsLayer');
      if (!container) return;

      if (!SLOTS_DOM_INITIALIZED) {
        container.innerHTML = '';
        for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {
          const slotEl = document.createElement('div');
          slotEl.id = \`slot_\${slotKey}\`;
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.className = 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150';

          // 拖拽
          slotEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            slotEl.classList.add('scale-125');
          });
          slotEl.addEventListener('dragleave', () => {
            slotEl.classList.remove('scale-125');
          });
          slotEl.addEventListener('drop', (e) => {
            e.preventDefault();
            slotEl.classList.remove('scale-125');
            const typeId = e.dataTransfer.getData('text/plain');
            placeChip(slotKey, typeId);
          });

          // 点击交互
          slotEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ACTIVE_SELECTED_CHIP) {
              placeChip(slotKey, ACTIVE_SELECTED_CHIP);
            } else if (BOARD_SLOTS[slotKey] && BOARD_SLOTS[slotKey].chip) {
              removeChip(slotKey);
            }
          });

          slotEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeChip(slotKey);
          });

          container.appendChild(slotEl);
        }
        SLOTS_DOM_INITIALIZED = true;
      }

      for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {
        const slotEl = document.getElementById(\`slot_\${slotKey}\`);
        if (!slotEl) continue;

        const ring = DISK_RINGS[slotData.ringKey];
        if (!ring || !ring.isActive) {
          slotEl.style.display = 'none';
          slotEl.style.pointerEvents = 'none';
          continue;
        }

        const pos = getSlotWorldPos(slotData.ringKey, slotData.slotIndex);
        slotEl.style.left = \`\${pos.x}px\`;
        slotEl.style.top = \`\${pos.y}px\`;

        const hasChip = !!slotData.chip;

        if (hasChip) {
          // ✦ 绚丽芯片配色与置顶层级 (z-index: 35) ✦
          const spec = CHIP_SPECS[slotData.chip];
          
          let bgClass = 'chip-bg-combat';
          if (spec.category === 'industry') bgClass = 'chip-bg-industry';
          else if (spec.category === 'mobility') bgClass = 'chip-bg-mobility';
          else if (spec.type === 'direction' || spec.type === 'split') bgClass = 'chip-bg-shift';
          else if (spec.type === 'keystone') bgClass = 'chip-bg-keystone';

          slotEl.style.display = 'block';
          slotEl.style.opacity = '1';
          slotEl.style.pointerEvents = 'auto';
          slotEl.style.zIndex = '35';
          slotEl.style.width = '32px';
          slotEl.style.height = '32px';
          slotEl.setAttribute('data-has-chip', 'true');
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center cursor-pointer group" title="\${spec.name}\\n\${spec.buffDesc}\\n\${spec.stepDesc}\\n【点击/右键】取回">
              <div class="w-7 h-7 \${bgClass} rounded-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-115 text-white">
                <i class="fa-solid \${spec.icon} text-xs pointer-events-none drop-shadow"></i>
              </div>
              <div class="pointer-events-none absolute -bottom-2 -right-2 px-1 rounded bg-slate-950 text-[7px] font-mono-sci text-white font-bold border border-sky-400 shadow z-20">
                \${slotData.slotIndex + 1}
              </div>
              <!-- 悬浮一键取回按钮 -->
              <button onclick="removeChip('\${slotKey}'); event.stopPropagation();" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow z-30" title="移除芯片">×</button>
            </div>
          \`;
        } else {
          // 空插槽微孔 (z-index: 10)
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.style.display = 'block';
          slotEl.style.opacity = '1';
          slotEl.style.pointerEvents = 'auto';
          slotEl.style.zIndex = '10';
          slotEl.style.width = '22px';
          slotEl.style.height = '22px';
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center group cursor-pointer" title="\${ring.name} 第 \${slotData.slotIndex + 1} 槽\\n【点击/拖拽】装配芯片">
              <div class="w-full h-full rounded-full flex items-center justify-center transition-all bg-slate-900/80 border border-dashed border-sky-500/80 hover:border-sky-400 hover:bg-sky-950/60 shadow hover:scale-115">
                <div class="w-1.5 h-1.5 rounded-full bg-sky-400 pointer-events-none"></div>
              </div>
              <span class="pointer-events-none absolute -bottom-2 px-0.5 rounded bg-slate-950 text-[6.5px] font-mono-sci text-slate-400 font-bold border border-slate-800 shadow">\${slotData.slotIndex + 1}</span>
            </div>
          \`;
        }
      }
    }

    function placeChip(slotKey, typeId) {
      if (!CHIP_SPECS[typeId] || !BOARD_SLOTS[slotKey]) return;
      BOARD_SLOTS[slotKey].chip = typeId;
      audio.playPlace();
      renderBoardSlots();
      solveStepNetwork();
    }

    function removeChip(slotKey) {
      if (!BOARD_SLOTS[slotKey] || !BOARD_SLOTS[slotKey].chip) return;
      BOARD_SLOTS[slotKey].chip = null;
      audio.playRemove();
      renderBoardSlots();
      solveStepNetwork();
    }

    function clearBoard() {
      for (const k in BOARD_SLOTS) {
        BOARD_SLOTS[k].chip = null;
      }
      ACTIVE_SELECTED_CHIP = null;
      renderPalette();
      updateSelectedChipIndicator();
      audio.playRemove();
      renderBoardSlots();
      solveStepNetwork();
    }
    window.clearBoard = clearBoard;

    /* =========================================================================
       7. 鼠标拖拽平滑旋转 + 滚轮旋转
       ========================================================================= */
    function rotateRing(ringKey, deltaStep) {
      const ring = DISK_RINGS[ringKey];
      if (!ring) return;

      const fineStep = 0.5;
      ring.slotOffset = (ring.slotOffset + deltaStep * fineStep + ring.slotCount) % ring.slotCount;
      const degStep = 360 / ring.slotCount;
      ring.currentAngle = Number(((ring.slotOffset * degStep) % 360).toFixed(1));

      const ringEl = document.getElementById(\`ringEl_\${ringKey}\`);
      if (ringEl) {
        ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
      }

      audio.playRotate();
      renderBoardSlots();
      solveStepNetwork();
    }

    function resetAllRotations() {
      for (const k in DISK_RINGS) {
        DISK_RINGS[k].slotOffset = 0;
        DISK_RINGS[k].currentAngle = 0;
        const ringEl = document.getElementById(\`ringEl_\${k}\`);
        if (ringEl) ringEl.style.transform = 'rotate(0deg)';
      }
      audio.playRotate();
      renderBoardSlots();
      solveStepNetwork();
    }

    function initRingDirectDragging() {
      const stage = document.getElementById('diskStage');
      if (!stage) return;

      // 滚轮旋转
      stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = stage.getBoundingClientRect();
        const scale = rect.width / 1440;
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        for (const [discKey, meta] of Object.entries(DISC_META)) {
          const dist = Math.hypot(mouseX - meta.cx, mouseY - meta.cy);
          if (dist <= 180) {
            const counts = getDiscRingCounts();
            const activeCount = counts[discKey];
            let bestRingKey = null;
            let minDist = 9999;
            for (let t = 1; t <= activeCount; t++) {
              const rDef = RING_TIER_DEFS[t - 1];
              const d = Math.abs(dist - rDef.radius);
              if (d < minDist) {
                minDist = d;
                bestRingKey = \`\${discKey}_\${t}\`;
              }
            }
            if (bestRingKey) {
              rotateRing(bestRingKey, e.deltaY < 0 ? 1 : -1);
            }
            break;
          }
        }
      }, { passive: false });

      // 鼠标按下拖拽圆盘平滑旋转
      let isDragging = false;
      let activeRingKey = null;
      let centerDragX = 0;
      let centerDragY = 0;
      let startAngle = 0;
      let ringStartAngle = 0;

      stage.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.target.closest('.keystone-hub-socket')) return;
        const clickedSlot = e.target.closest('#slotsLayer > div');
        if (clickedSlot) return; // 点击插槽不触发拖拽

        const rect = stage.getBoundingClientRect();
        const scale = rect.width / 1440;
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        for (const [discKey, meta] of Object.entries(DISC_META)) {
          const dist = Math.hypot(mouseX - meta.cx, mouseY - meta.cy);
          if (dist <= 180) {
            const counts = getDiscRingCounts();
            const activeCount = counts[discKey];
            let bestRingKey = null;
            let minDist = 9999;
            for (let t = 1; t <= activeCount; t++) {
              const rDef = RING_TIER_DEFS[t - 1];
              const d = Math.abs(dist - rDef.radius);
              if (d < minDist) {
                minDist = d;
                bestRingKey = \`\${discKey}_\${t}\`;
              }
            }
            if (bestRingKey) {
              activeRingKey = bestRingKey;
              centerDragX = meta.cx;
              centerDragY = meta.cy;
              isDragging = true;
              startAngle = Math.atan2(mouseY - centerDragY, mouseX - centerDragX) * 180 / Math.PI;
              ringStartAngle = DISK_RINGS[bestRingKey].currentAngle;
            }
            break;
          }
        }

        const onMouseMove = (me) => {
          if (!isDragging || !activeRingKey) return;
          const curMouseX = (me.clientX - rect.left) / scale;
          const curMouseY = (me.clientY - rect.top) / scale;
          const curAngle = Math.atan2(curMouseY - centerDragY, curMouseX - centerDragX) * 180 / Math.PI;
          let delta = curAngle - startAngle;

          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;

          const ring = DISK_RINGS[activeRingKey];
          ring.currentAngle = (ringStartAngle + delta + 360) % 360;
          const degStep = 360 / ring.slotCount;
          ring.slotOffset = Number((ring.currentAngle / degStep).toFixed(2));

          const ringEl = document.getElementById(\`ringEl_\${activeRingKey}\`);
          if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;

          renderBoardSlots();
          solveStepNetwork();
        };

        const onMouseUp = () => {
          isDragging = false;
          activeRingKey = null;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      });
    }

    /* =========================================================================
       8. 芯片列表与点选装配
       ========================================================================= */
    let CURRENT_PALETTE_FILTER = 'all';
    let ACTIVE_SELECTED_CHIP = null;

    function filterPalette(filterKey) {
      CURRENT_PALETTE_FILTER = filterKey;
      ['all', 'combat', 'industry', 'mobility', 'shift', 'keystone'].forEach(k => {
        const tab = document.getElementById('tab_' + k);
        if (!tab) return;
        if (k === filterKey) {
          tab.className = 'px-2 py-0.5 rounded bg-sky-600 text-white font-bold shrink-0';
        } else {
          tab.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 shrink-0 font-bold';
        }
      });
      renderPalette();
    }

    function selectPaletteChip(typeId) {
      if (ACTIVE_SELECTED_CHIP === typeId) {
        ACTIVE_SELECTED_CHIP = null;
      } else {
        ACTIVE_SELECTED_CHIP = typeId;
        audio.playSelect();
      }
      renderPalette();
      updateSelectedChipIndicator();
    }

    function cancelPaletteSelection() {
      ACTIVE_SELECTED_CHIP = null;
      renderPalette();
      updateSelectedChipIndicator();
    }

    function updateSelectedChipIndicator() {
      const banner = document.getElementById('quickPlacementBanner');
      const nameEl = document.getElementById('quickPlacementChipName');
      if (!banner || !nameEl) return;
      if (ACTIVE_SELECTED_CHIP && CHIP_SPECS[ACTIVE_SELECTED_CHIP]) {
        nameEl.textContent = CHIP_SPECS[ACTIVE_SELECTED_CHIP].name;
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ACTIVE_SELECTED_CHIP) {
        cancelPaletteSelection();
      }
    });

    function renderPalette() {
      const container = document.getElementById('paletteListContainer');
      if (!container) return;

      const keys = Object.keys(CHIP_SPECS);
      let filteredKeys = keys;

      if (CURRENT_PALETTE_FILTER === 'combat') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'combat');
      } else if (CURRENT_PALETTE_FILTER === 'industry') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'industry');
      } else if (CURRENT_PALETTE_FILTER === 'mobility') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'mobility');
      } else if (CURRENT_PALETTE_FILTER === 'shift') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].type === 'direction' || CHIP_SPECS[k].type === 'split');
      }

      let html = '';
      filteredKeys.forEach(typeId => {
        const spec = CHIP_SPECS[typeId];
        const stepBadge = spec.type === 'step' ? \`+\${spec.step}格\` : '变轨规';
        const isSelected = (ACTIVE_SELECTED_CHIP === typeId);

        let bgClass = 'chip-bg-combat';
        if (spec.category === 'industry') bgClass = 'chip-bg-industry';
        else if (spec.category === 'mobility') bgClass = 'chip-bg-mobility';
        else if (spec.type === 'direction' || spec.type === 'split') bgClass = 'chip-bg-shift';

        html += \`
          <div class="p-2.5 rounded-xl transition cursor-pointer flex items-center space-x-3 group shadow-md \${
            isSelected
              ? 'bg-slate-800 border-2 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
              : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
          }"
               draggable="true"
               ondragstart="onPaletteDragStart(event, '\${typeId}')"
               onclick="selectPaletteChip('\${typeId}')"
               title="\${spec.name}\\n\${spec.buffDesc}\\n\${spec.stepDesc}\\n【点击】选中快速放置\\n【拖拽】直接放入插槽">
            
            <div class="w-9 h-9 \${bgClass} rounded-lg flex items-center justify-center relative shrink-0 shadow text-white">
              <i class="fa-solid \${spec.icon} text-sm drop-shadow"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white truncate">\${spec.name}</span>
                <span class="text-[9px] font-mono-sci px-1.5 py-0.2 rounded font-bold \${spec.badgeColor}">
                  \${stepBadge}
                </span>
                \${isSelected ? '<span class="text-[8.5px] font-mono-sci px-1.5 py-0.2 rounded font-bold bg-sky-500 text-white ml-1">待放置</span>' : ''}
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>\${spec.buffDesc}</span>
                <span class="text-slate-500 font-mono-sci">\${spec.stepDesc}</span>
              </div>
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
    }

    function onPaletteDragStart(e, typeId) {
      audio.init();
      e.dataTransfer.setData('text/plain', typeId);
    }

    /* =========================================================================
       9. 极核特质配置
       ========================================================================= */
    const KEYSTONE_SLOTS = {
      combat: 'keystone_sword_array',
      industry: 'keystone_assembly',
      support: 'keystone_logistics'
    };

    function updateAllKeystoneSocketsDOM() {
      for (const discKey of ['combat', 'industry', 'support']) {
        const ksId = KEYSTONE_SLOTS[discKey];
        const ks = KEYSTONE_TRAITS[ksId];
        const nameEl = document.getElementById('crossCoreNameText_' + discKey);
        const iconEl = document.getElementById('crossCoreIcon_' + discKey);
        if (ks) {
          if (nameEl) nameEl.textContent = ks.name.split('·')[0].trim();
          if (iconEl) iconEl.className = \`fa-solid \${ks.icon} text-sm relative z-10\`;
        }
      }
    }

    function openKeystoneSelector(discKey) {
      filterPalette('keystone');
      toggleLeftPanel(true);
    }

    /* =========================================================================
       10. 光路追踪与三才阵跨盘贯通拓扑求解引擎
       ========================================================================= */
    function solveStepNetwork() {
      const svgBeams = document.getElementById('svgBeamsGroup');
      const svgImpacts = document.getElementById('svgImpactsGroup');
      const svgBridge = document.getElementById('svgBridgeGroup');
      if (!svgBeams || !svgImpacts || !svgBridge) return;

      svgBeams.innerHTML = '';
      svgImpacts.innerHTML = '';
      svgBridge.innerHTML = '';

      const logList = document.getElementById('beamLogList');
      if (logList) logList.innerHTML = '';

      const logSteps = [];
      let totalBuff = {
        atk: 0, def: 0, hp: 0, crit: 0, speed: 0,
        sword_funnel: 0, craft_speed: 0, mining_speed: 0, power_cut: 0, belt_speed: 0,
        penetration: 0, flight_battery: 0
      };

      const counts = getDiscRingCounts();

      // 1. 始发激光自右端 (1380, 515) 射向辅助盘 (1060, 515)
      const sTier = counts.support;
      const sRing = DISK_RINGS[\`support_\${sTier}\`];
      const sEntryX = DISC_META.support.cx + sRing.radius;
      const sEntryY = DISC_META.support.cy;

      drawLaserLine(svgBridge, 1380, 515, sEntryX, sEntryY, '#00f0ff', true);
      drawImpactPoint(svgImpacts, sEntryX, sEntryY, '#00f0ff');
      logSteps.push(\`⚡ 始发激光射入辅助盘最外环 (R\${sTier}) 入口\`);

      // 辅助盘芯片步数拓扑连线计算
      let sActiveCount = 0;
      for (let t = 1; t <= counts.support; t++) {
        for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
          const slot = BOARD_SLOTS[\`support_\${t}_\${s}\`];
          if (slot && slot.chip) {
            sActiveCount++;
            accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
            // 环内高亮弧线
            const p1 = getSlotWorldPos(\`support_\${t}\`, s);
            const nextSlotIdx = (s + 1) % RING_TIER_DEFS[t - 1].slotCount;
            const p2 = getSlotWorldPos(\`support_\${t}\`, nextSlotIdx);
            drawLaserLine(svgBeams, p1.x, p1.y, p2.x, p2.y, '#38bdf8', false);
          }
        }
      }
      const supportConductive = (sActiveCount > 0);

      // 2. 辅助盘外圈射出点 ➔ 工厂盘 (380, 515)
      const sEmitX = DISC_META.support.cx - sRing.radius;
      const sEmitY = DISC_META.support.cy;

      const iTier = counts.industry;
      const iRing = DISK_RINGS[\`industry_\${iTier}\`];
      const iEntryX = DISC_META.industry.cx + iRing.radius;
      const iEntryY = DISC_META.industry.cy;

      let iActiveCount = 0;
      let industryConductive = false;

      if (supportConductive) {
        drawLaserLine(svgBridge, sEmitX, sEmitY, iEntryX, iEntryY, '#00f0ff', true);
        drawImpactPoint(svgImpacts, iEntryX, iEntryY, '#f59e0b');
        logSteps.push('✨ 辅助盘射出点准直导通 ➔ 激光水平注入工厂盘！');

        for (let t = 1; t <= counts.industry; t++) {
          for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
            const slot = BOARD_SLOTS[\`industry_\${t}_\${s}\`];
            if (slot && slot.chip) {
              iActiveCount++;
              accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
              const p1 = getSlotWorldPos(\`industry_\${t}\`, s);
              const nextSlotIdx = (s + 1) % RING_TIER_DEFS[t - 1].slotCount;
              const p2 = getSlotWorldPos(\`industry_\${t}\`, nextSlotIdx);
              drawLaserLine(svgBeams, p1.x, p1.y, p2.x, p2.y, '#f59e0b', false);
            }
          }
        }
        industryConductive = (iActiveCount > 0);
      } else {
        logSteps.push('▲ 辅助盘未放置芯片或未导通，待激活后射向工厂盘');
      }

      // 3. 工厂盘外圈射出点 ➔ 攻击盘 (720, 195)
      const iEmitX = DISC_META.industry.cx + iRing.radius * 0.7;
      const iEmitY = DISC_META.industry.cy - iRing.radius * 0.7;

      const cTier = counts.combat;
      const cRing = DISK_RINGS[\`combat_\${cTier}\`];
      const cEntryX = DISC_META.combat.cx - cRing.radius * 0.7;
      const cEntryY = DISC_META.combat.cy + cRing.radius * 0.7;

      let cActiveCount = 0;
      let combatConductive = false;

      if (industryConductive) {
        drawLaserLine(svgBridge, iEmitX, iEmitY, cEntryX, cEntryY, '#00f0ff', true);
        drawImpactPoint(svgImpacts, cEntryX, cEntryY, '#f43f5e');
        logSteps.push('🔥 工厂盘射出点准直导通 ➔ 激光斜向跃升注入离火攻击盘！');

        for (let t = 1; t <= counts.combat; t++) {
          for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
            const slot = BOARD_SLOTS[\`combat_\${t}_\${s}\`];
            if (slot && slot.chip) {
              cActiveCount++;
              accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
              const p1 = getSlotWorldPos(\`combat_\${t}\`, s);
              const nextSlotIdx = (s + 1) % RING_TIER_DEFS[t - 1].slotCount;
              const p2 = getSlotWorldPos(\`combat_\${t}\`, nextSlotIdx);
              drawLaserLine(svgBeams, p1.x, p1.y, p2.x, p2.y, '#f43f5e', false);
            }
          }
        }
        combatConductive = (cActiveCount > 0);
      } else {
        logSteps.push('▲ 工厂盘未导通，能量未能注入攻击盘');
      }

      // 4. 三才全贯通大共鸣判定
      const isTri = (supportConductive && industryConductive && combatConductive);
      if (isTri) {
        logSteps.push('🌟 【三大阵盘全贯通】天地人三才归元！触发全局 ×1.5倍 狂暴共鸣！');
        // 绘制中央三才共鸣台聚光束
        drawLaserLine(svgBridge, DISC_META.combat.cx, DISC_META.combat.cy + cRing.radius, 720, 408, '#38bdf8', true);
        drawLaserLine(svgBridge, DISC_META.industry.cx + iRing.radius * 0.7, DISC_META.industry.cy - iRing.radius * 0.7, 720, 408, '#fbbf24', true);
        drawLaserLine(svgBridge, DISC_META.support.cx - sRing.radius * 0.7, DISC_META.support.cy - sRing.radius * 0.7, 720, 408, '#38bdf8', true);

        for (const k in totalBuff) {
          totalBuff[k] = Math.round(totalBuff[k] * 1.5);
        }
      }

      updatePanels(totalBuff, isTri, sActiveCount, iActiveCount, cActiveCount, logSteps);
    }

    function accumulateBuff(target, source) {
      if (!source) return;
      for (const [k, v] of Object.entries(source)) {
        if (target[k] !== undefined) target[k] += v;
      }
    }

    function drawLaserLine(svg, x1, y1, x2, y2, color = '#00f0ff', animated = true) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('class', animated ? 'laser-glow laser-core' : 'laser-glow');
      svg.appendChild(line);
    }

    function drawImpactPoint(svg, cx, cy, color = '#00f0ff') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', color);
      circle.setAttribute('class', 'animate-ping');
      svg.appendChild(circle);
    }

    function updatePanels(buff, isTri, sCount, iCount, cCount, logSteps) {
      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setTxt('stat_atk', \`+\${buff.atk || 0}%\`);
      setTxt('stat_crit', \`+\${buff.crit || 0}%\`);
      setTxt('stat_penetration', \`+\${buff.penetration || 0}%\`);
      setTxt('stat_sword_funnel', \`+\${buff.sword_funnel || 0}把\`);

      setTxt('stat_craft_speed', \`+\${buff.craft_speed || 0}%\`);
      setTxt('stat_mining_speed', \`+\${buff.mining_speed || 0}%\`);
      setTxt('stat_power_cut', \`-\${buff.power_cut || 0}%\`);
      setTxt('stat_belt_speed', \`+\${buff.belt_speed || 0}%\`);

      setTxt('stat_def', \`+\${buff.def || 0}%\`);
      setTxt('stat_speed', \`+\${buff.speed || 0}%\`);
      setTxt('stat_hp', \`+\${buff.hp || 0}\`);
      setTxt('stat_flight_battery', \`+\${buff.flight_battery || 0}%\`);

      setTxt('combatActiveSlotCount', \`\${cCount} 槽激活\`);
      setTxt('industryActiveSlotCount', \`\${iCount} 槽激活\`);
      setTxt('supportActiveSlotCount', \`\${sCount} 槽激活\`);

      const card = document.getElementById('triResonanceCard');
      const badge = document.getElementById('triResonanceBadge');
      if (card && badge) {
        if (isTri) {
          card.className = 'p-3.5 rounded-xl border border-cyan-400 bg-cyan-950/40 shadow-xl ring-2 ring-cyan-400/40';
          badge.className = 'text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-cyan-500 text-white animate-pulse';
          badge.textContent = '● 三盘贯通 ×1.5倍';
        } else {
          card.className = 'p-3.5 rounded-xl border border-slate-800 bg-slate-950/60';
          badge.className = 'text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-slate-800 text-slate-400';
          badge.textContent = '待导通';
        }
      }

      const logList = document.getElementById('beamLogList');
      const stepCountEl = document.getElementById('logStepCount');
      if (logList) {
        logList.innerHTML = logSteps.map(s => \`<div class="leading-relaxed">\${s}</div>\`).join('');
      }
      if (stepCountEl) {
        stepCountEl.textContent = \`\${logSteps.length} 状态\`;
      }
    }

    function toggleLeftPanel(forceOpen = null) {
      const panel = document.getElementById('leftPanel');
      if (!panel) return;
      if (forceOpen === true) panel.classList.remove('collapsed');
      else if (forceOpen === false) panel.classList.add('collapsed');
      else panel.classList.toggle('collapsed');
    }

    function toggleRightPanel(forceOpen = null) {
      const panel = document.getElementById('rightPanel');
      if (!panel) return;
      if (forceOpen === true) panel.classList.remove('collapsed');
      else if (forceOpen === false) panel.classList.add('collapsed');
      else panel.classList.toggle('collapsed');
    }

    window.addEventListener('DOMContentLoaded', () => {
      initDiscRings();
      initBoardSlots();
      applyDiscRingConfiguration();
      renderPalette();
      initRingDirectDragging();
      updateAllKeystoneSocketsDOM();

      // 默认初始预设：在三盘各安插芯片展示初次通电状态
      if (BOARD_SLOTS['support_1_0']) BOARD_SLOTS['support_1_0'].chip = 't0_atk_1';
      if (BOARD_SLOTS['support_1_2']) BOARD_SLOTS['support_1_2'].chip = 't0_speed_1';
      if (BOARD_SLOTS['industry_1_0']) BOARD_SLOTS['industry_1_0'].chip = 't0_craft_1';
      if (BOARD_SLOTS['industry_1_3']) BOARD_SLOTS['industry_1_3'].chip = 't0_mine_1';
      if (BOARD_SLOTS['combat_1_0']) BOARD_SLOTS['combat_1_0'].chip = 't0_atk_2';
      if (BOARD_SLOTS['combat_1_4']) BOARD_SLOTS['combat_1_4'].chip = 't0_crit_2';

      renderBoardSlots();
      solveStepNetwork();
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/gen_part3.html', part3, 'utf8');
console.log('Part 3 saved.');
