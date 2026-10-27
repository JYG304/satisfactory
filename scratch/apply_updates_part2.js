const fs = require('fs');

let code = fs.readFileSync('processor/index.html', 'utf8');

// 1. Add renderDynamicDiscBackgrounds and update applyDiscRingConfiguration
const oldApply = `    function applyDiscRingConfiguration() {
      const counts = getDiscRingCounts();

      for (const [ringKey, ring] of Object.entries(DISK_RINGS)) {
        ring.isActive = (ring.tier <= counts[ring.discKey]);
      }

      // 实时更新三大盘状态角标
      const updateBadge = (id, count, isSpec, color) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (isSpec) {
          el.className = \`text-[9px] font-mono-sci font-bold px-1.5 py-0.2 rounded bg-\${color}-100 text-\${color}-800 border border-\${color}-300\`;
          el.textContent = \`\${count}环 · 主修\`;
        } else {
          el.className = 'text-[9px] font-mono-sci font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200';
          el.textContent = \`\${count}环 · 次级\`;
        }
      };

      updateBadge('badge_combat_status', counts.combat, SPECIALIZED_DISC === 'combat', 'rose');
      updateBadge('badge_industry_status', counts.industry, SPECIALIZED_DISC === 'industry', 'amber');
      updateBadge('badge_support_status', counts.support, SPECIALIZED_DISC === 'support', 'sky');

      renderRingsDOM();
      renderFixedEmissionPorts();
      renderBoardSlots();
      solveStepNetwork();
    }`;

const newApply = `    const TIER_SLOT_TOTALS = { 1: 6, 2: 14, 3: 26, 4: 42 };

    function renderDynamicDiscBackgrounds() {
      const g = document.getElementById('dynamicDiscBgGroup');
      if (!g) return;
      const counts = getDiscRingCounts();
      let svgHtml = '';

      for (const [discKey, meta] of Object.entries(DISC_META)) {
        const activeTiers = counts[discKey];
        const tierDef = RING_TIER_DEFS[activeTiers - 1];
        const rBg = tierDef.radius + 18;
        const isSpec = (SPECIALIZED_DISC === discKey);

        svgHtml += \`
          <!-- \${meta.name} 动态激活范围底晕 (随活跃环半径自适应扩展) -->
          <circle cx="\${meta.cx}" cy="\${meta.cy}" r="\${rBg}" 
                  stroke="\${meta.color}" stroke-width="\${isSpec ? '2' : '1.5'}" 
                  stroke-dasharray="\${isSpec ? 'none' : '4 3'}" 
                  fill="\${meta.bgFill}" fill-opacity="\${isSpec ? '0.45' : '0.2'}" 
                  class="transition-all duration-300" />
        \`;
      }
      g.innerHTML = svgHtml;
    }

    function applyDiscRingConfiguration() {
      const counts = getDiscRingCounts();

      for (const [ringKey, ring] of Object.entries(DISK_RINGS)) {
        ring.isActive = (ring.tier <= counts[ring.discKey]);
      }

      // 实时更新三大盘状态角标与插槽总数
      const updateBadge = (id, count, isSpec, color) => {
        const el = document.getElementById(id);
        if (!el) return;
        const totalSlots = TIER_SLOT_TOTALS[count] || 6;
        if (isSpec) {
          el.className = \`text-[9px] font-mono-sci font-bold px-2 py-0.5 rounded-full bg-\${color}-100 text-\${color}-800 border border-\${color}-300 shadow-xs\`;
          el.textContent = \`\${count}环 · \${totalSlots}插槽 (主修特化)\`;
        } else {
          el.className = 'text-[9px] font-mono-sci font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200';
          el.textContent = \`\${count}环 · \${totalSlots}插槽 (次级协同)\`;
        }
      };

      updateBadge('badge_combat_status', counts.combat, SPECIALIZED_DISC === 'combat', 'rose');
      updateBadge('badge_industry_status', counts.industry, SPECIALIZED_DISC === 'industry', 'amber');
      updateBadge('badge_support_status', counts.support, SPECIALIZED_DISC === 'support', 'sky');

      renderDynamicDiscBackgrounds();
      renderRingsDOM();
      renderFixedEmissionPorts();
      renderBoardSlots();
      solveStepNetwork();
    }`;

code = code.replace(oldApply, newApply);

// 2. Update renderRingsDOM to use explicit CSS borders with reliable inline colors
const oldRenderRings = `          html += \`
            <div id="ringEl_\${ringKey}" class="absolute rounded-full ring-trans transition-opacity duration-300 \${isActive ? 'pointer-events-auto' : 'pointer-events-none'}" 
                 style="width: \${size}px; height: \${size}px; left: \${left}px; top: \${top}px; transform: rotate(\${curDeg}deg); opacity: \${isActive ? '1' : '0'}; display: \${isActive ? 'block' : 'none'};">
              
              <!-- 环道边框线 -->
              <div class="absolute inset-0 rounded-full border \${
                isOutermost 
                  ? \`border-2 border-\${meta.theme}-500 shadow-sm\` 
                  : \`border border-\${meta.theme}-300/80\`
              }"></div>

              <!-- 环名与旋转微调 [+] [-] 按键 -->
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-white border border-slate-300 rounded-full px-1.5 py-0.2 text-[8px] font-mono-sci font-bold text-slate-700 shadow-sm pointer-events-auto">
                <button onclick="rotateRing('\${ringKey}', -1); event.stopPropagation();" class="hover:text-sky-600 px-0.5">◀</button>
                <span class="mx-0.5 text-\${meta.theme}-700">R\${t}</span>
                <button onclick="rotateRing('\${ringKey}', 1); event.stopPropagation();" class="hover:text-sky-600 px-0.5">▶</button>
              </div>

            </div>
          \`;`;

const newRenderRings = `          html += \`
            <div id="ringEl_\${ringKey}" class="absolute rounded-full ring-trans transition-all duration-300 \${isActive ? 'pointer-events-auto' : 'pointer-events-none'}" 
                 style="width: \${size}px; height: \${size}px; left: \${left}px; top: \${top}px; transform: rotate(\${curDeg}deg); opacity: \${isActive ? '1' : '0'}; display: \${isActive ? 'block' : 'none'};">
              
              <!-- 纯净可靠的环道边界线 (外环实线，内环细实线/虚线) -->
              <div class="absolute inset-0 rounded-full pointer-events-none" 
                   style="border: \${isOutermost ? '2px solid ' + meta.color : '1.5px dashed ' + meta.faintColor};"></div>

              <!-- 环名与旋转微调 [◀ R ▶] 按键 -->
              <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center bg-white border border-slate-300 rounded-full px-1.5 py-0.2 text-[8px] font-mono-sci font-bold text-slate-700 shadow-sm pointer-events-auto z-15">
                <button onclick="rotateRing('\${ringKey}', -1); event.stopPropagation();" class="hover:text-sky-600 px-0.5" title="逆时针旋转5°">◀</button>
                <span class="mx-0.5 font-bold" style="color: \${meta.color}">R\${t}</span>
                <button onclick="rotateRing('\${ringKey}', 1); event.stopPropagation();" class="hover:text-sky-600 px-0.5" title="顺时针旋转5°">▶</button>
              </div>

            </div>
          \`;`;

code = code.replace(oldRenderRings, newRenderRings);

// 3. Update empty slot rendering inside renderBoardSlots
const oldEmptySlot = `        } else {
          // 空插槽微孔 (z-index: 10)
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.style.zIndex = '10';
          slotEl.style.width = '22px';
          slotEl.style.height = '22px';
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center group cursor-pointer" title="\${ring.name} 第 \${slotData.slotIndex + 1} 槽\\n【点击/拖拽】装配芯片">
              <div class="w-full h-full rounded-full flex items-center justify-center transition-all bg-white border border-dashed border-sky-400 hover:border-sky-600 hover:bg-sky-50 shadow-xs hover:scale-115">
                <div class="w-1.5 h-1.5 rounded-full bg-sky-500 pointer-events-none"></div>
              </div>
              <span class="pointer-events-none absolute -bottom-2 px-0.5 rounded bg-white text-[6.5px] font-mono-sci text-slate-600 font-bold border border-slate-300 shadow-xs">\${slotData.slotIndex + 1}</span>
            </div>
          \`;
        }`;

const newEmptySlot = `        } else {
          // 空插槽微孔 (z-index: 10，尺寸26px，清晰明了，且颜色严格与盘体主题一致)
          const discMeta = DISC_META[slotData.discKey] || DISC_META.combat;
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.style.zIndex = '10';
          slotEl.style.width = '26px';
          slotEl.style.height = '26px';
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center group cursor-pointer" title="\${ring.name} 第 \${slotData.slotIndex + 1} 槽\\n【点击/拖拽】装配芯片">
              <div class="w-full h-full rounded-full flex items-center justify-center transition-all bg-white border-2 border-dashed \${discMeta.slotBorder} shadow-xs group-hover:scale-115">
                <div class="w-2 h-2 rounded-full \${discMeta.slotDot} pointer-events-none"></div>
              </div>
              <span class="pointer-events-none absolute -bottom-2.5 px-1 rounded bg-white text-[7px] font-mono-sci text-slate-700 font-bold border border-slate-300 shadow-xs">\${slotData.slotIndex + 1}</span>
            </div>
          \`;
        }`;

code = code.replace(oldEmptySlot, newEmptySlot);

fs.writeFileSync('processor/index.html', code);
console.log('Successfully updated processor/index.html step 2');
