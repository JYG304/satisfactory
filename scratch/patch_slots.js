const fs = require('fs');

let html = fs.readFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', 'utf8');

// 1. Add quickPlacementBanner into stage section
if (!html.includes('id="quickPlacementBanner"')) {
  const target = '<div id="diskStage"';
  const banner = '      <!-- ✦ 快速点选装配状态悬浮条 ✦ -->\n' +
    '      <div id="quickPlacementBanner" class="hidden absolute top-4 left-6 z-30 flex items-center space-x-3 bg-slate-900/95 text-white px-4 py-1.5 rounded-xl text-xs font-mono-sci shadow-xl border border-sky-400 backdrop-blur-md transition-all">\n' +
    '        <span class="text-sky-300 font-bold flex items-center"><i class="fa-solid fa-crosshairs mr-1.5 text-sky-400 animate-spin"></i>已选芯片：</span>\n' +
    '        <span id="quickPlacementChipName" class="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"></span>\n' +
    '        <span class="text-slate-300 text-[11px]">👉 鼠标点击盘面任意插槽直接放置 (支持连续点击快速布置)</span>\n' +
    '        <button onclick="cancelPaletteSelection()" class="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-600 transition">取消 (Esc)</button>\n' +
    '      </div>\n\n';
  html = html.replace(target, banner + target);
}

// 2. Add ACTIVE_SELECTED_CHIP and helper functions before renderPalette
if (!html.includes('let ACTIVE_SELECTED_CHIP = null;')) {
  const palStart = html.indexOf('function renderPalette() {');
  const code = [
    '    let ACTIVE_SELECTED_CHIP = null;',
    '',
    '    function selectPaletteChip(typeId) {',
    '      if (ACTIVE_SELECTED_CHIP === typeId) {',
    '        ACTIVE_SELECTED_CHIP = null;',
    '      } else {',
    '        ACTIVE_SELECTED_CHIP = typeId;',
    '        if (audio) audio.playSelect();',
    '      }',
    '      renderPalette();',
    '      updateSelectedChipIndicator();',
    '    }',
    '',
    '    function cancelPaletteSelection() {',
    '      ACTIVE_SELECTED_CHIP = null;',
    '      renderPalette();',
    '      updateSelectedChipIndicator();',
    '    }',
    '',
    '    function updateSelectedChipIndicator() {',
    '      const banner = document.getElementById("quickPlacementBanner");',
    '      const nameEl = document.getElementById("quickPlacementChipName");',
    '      if (!banner || !nameEl) return;',
    '      if (ACTIVE_SELECTED_CHIP && CHIP_SPECS[ACTIVE_SELECTED_CHIP]) {',
    '        nameEl.textContent = CHIP_SPECS[ACTIVE_SELECTED_CHIP].name;',
    '        banner.classList.remove("hidden");',
    '      } else {',
    '        banner.classList.add("hidden");',
    '      }',
    '    }',
    '',
    '    window.addEventListener("keydown", (e) => {',
    '      if (e.key === "Escape" && ACTIVE_SELECTED_CHIP) {',
    '        cancelPaletteSelection();',
    '      }',
    '    });',
    ''
  ].join('\n');
  html = html.slice(0, palStart) + code + '\n' + html.slice(palStart);
}

// 3. Update palette chips
const oldCardSearch = '      filteredKeys.forEach(typeId => {\n' +
  '        const spec = CHIP_SPECS[typeId];\n' +
  '        const stepBadge = spec.type === \'step\' ? `+${spec.step}格` : \'变轨规\';\n' +
  '        html += `\n' +
  '          <div class="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-800 transition cursor-grab active:cursor-grabbing flex items-center space-x-3 group shadow-xs hover:shadow-sm"\n' +
  '               draggable="true"\n' +
  '               ondragstart="onPaletteDragStart(event, \'${typeId}\')">';

const newCardCode = '      filteredKeys.forEach(typeId => {\n' +
  '        const spec = CHIP_SPECS[typeId];\n' +
  '        const stepBadge = spec.type === \'step\' ? `+${spec.step}格` : \'变轨规\';\n' +
  '        const isSelected = (ACTIVE_SELECTED_CHIP === typeId);\n' +
  '        html += `\n' +
  '          <div class="p-2.5 rounded-lg transition cursor-pointer flex items-center space-x-3 group shadow-xs hover:shadow-sm ${\n' +
  '            isSelected\n' +
  '              ? \'bg-sky-50 border-2 border-sky-500 ring-2 ring-sky-300/50 shadow-md\'\n' +
  '              : \'bg-white border border-slate-200 hover:border-sky-400\'\n' +
  '          }"\n' +
  '               draggable="true"\n' +
  '               ondragstart="onPaletteDragStart(event, \'${typeId}\')"\n' +
  '               onclick="selectPaletteChip(\'${typeId}\')"\n' +
  '               title="${spec.name}\\n${spec.buffDesc}\\n${spec.stepDesc}\\n【点击】选中后点击盘面插槽直接放置\\n【拖拽】直接拖拽至插槽">';

if (html.includes(oldCardSearch)) {
  html = html.replace(oldCardSearch, newCardCode);
}

// 4. Implement clearBoard
if (!html.includes('function clearBoard(')) {
  const clearBoardCode = [
    '    function clearBoard() {',
    '      for (const k in BOARD_SLOTS) {',
    '        BOARD_SLOTS[k].chip = null;',
    '      }',
    '      ACTIVE_SELECTED_CHIP = null;',
    '      renderPalette();',
    '      updateSelectedChipIndicator();',
    '      if (audio) audio.playRemove();',
    '      renderBoardSlots();',
    '      solveStepNetwork();',
    '    }',
    '    window.clearBoard = clearBoard;',
    ''
  ].join('\n');
  const placeChipPos = html.indexOf('function placeChip(');
  html = html.slice(0, placeChipPos) + clearBoardCode + '\n' + html.slice(placeChipPos);
}

// 5. Update renderBoardSlots
const oldRenderBoardSlotsStart = html.indexOf('function renderBoardSlots() {');
const oldRenderBoardSlotsEnd = html.indexOf('function placeChip(', oldRenderBoardSlotsStart);

const newRenderBoardSlots = [
  'function renderBoardSlots() {',
  '      const container = document.getElementById("slotsLayer");',
  '      if (!container) return;',
  '',
  '      if (!SLOTS_DOM_INITIALIZED) {',
  '        container.innerHTML = "";',
  '        for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {',
  '          const slotEl = document.createElement("div");',
  '          slotEl.id = `slot_${slotKey}`;',
  '          slotEl.setAttribute("data-has-chip", "false");',
  '          slotEl.className = "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150";',
  '',
  '          slotEl.addEventListener("dragover", (e) => {',
  '            e.preventDefault();',
  '            slotEl.classList.add("scale-125");',
  '          });',
  '          slotEl.addEventListener("dragleave", () => {',
  '            slotEl.classList.remove("scale-125");',
  '          });',
  '          slotEl.addEventListener("drop", (e) => {',
  '            e.preventDefault();',
  '            slotEl.classList.remove("scale-125");',
  '            const typeId = e.dataTransfer.getData("text/plain");',
  '            placeChip(slotKey, typeId);',
  '          });',
  '',
  '          slotEl.addEventListener("click", (e) => {',
  '            e.stopPropagation();',
  '            if (ACTIVE_SELECTED_CHIP) {',
  '              placeChip(slotKey, ACTIVE_SELECTED_CHIP);',
  '            } else if (BOARD_SLOTS[slotKey] && BOARD_SLOTS[slotKey].chip) {',
  '              removeChip(slotKey);',
  '            }',
  '          });',
  '',
  '          slotEl.addEventListener("contextmenu", (e) => {',
  '            e.preventDefault();',
  '            e.stopPropagation();',
  '            removeChip(slotKey);',
  '          });',
  '',
  '          container.appendChild(slotEl);',
  '        }',
  '        SLOTS_DOM_INITIALIZED = true;',
  '      }',
  '',
  '      for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {',
  '        const slotEl = document.getElementById(`slot_${slotKey}`);',
  '        if (!slotEl) continue;',
  '',
  '        const pos = getSlotWorldPos(slotData.ringId, slotData.slotIndex);',
  '        slotEl.style.left = `${pos.x}px`;',
  '        slotEl.style.top = `${pos.y}px`;',
  '',
  '        const hasChip = !!slotData.chip;',
  '        const isVisible = isSlotVisibleInCurrentFocus(slotData.ringId, hasChip);',
  '',
  '        let runeTag = "";',
  '        if (slotData.ringId === "polar") runeTag = "探天" + (slotData.slotIndex + 1);',
  '        else if (slotData.ringId === "tian") runeTag = BAGUA_NAMES[slotData.slotIndex % 8];',
  '        else if (slotData.ringId === "di") runeTag = TIANGAN_NAMES[slotData.slotIndex % 10];',
  '        else if (slotData.ringId === "ren") runeTag = YAO_NAMES[slotData.slotIndex % 6];',
  '        else if (slotData.ringId === "sub_b_outer") runeTag = `B·外${slotData.slotIndex + 1}`;',
  '        else if (slotData.ringId === "sub_b_inner") runeTag = `B·内${slotData.slotIndex + 1}`;',
  '        else if (slotData.ringId === "sub_c1") runeTag = `C1·${slotData.slotIndex + 1}`;',
  '        else if (slotData.ringId === "sub_c2") runeTag = `C2·${slotData.slotIndex + 1}`;',
  '        else if (slotData.ringId === "sub_d") runeTag = `D·${slotData.slotIndex + 1}`;',
  '',
  '        if (hasChip) {',
  '          const spec = CHIP_SPECS[slotData.chip];',
  '          slotEl.style.display = "block";',
  '          slotEl.style.opacity = "1";',
  '          slotEl.style.pointerEvents = "auto";',
  '          slotEl.style.zIndex = "35";',
  '          slotEl.style.width = "32px";',
  '          slotEl.style.height = "32px";',
  '          slotEl.setAttribute("data-has-chip", "true");',
  '          slotEl.innerHTML = `',
  '            <div class="relative w-full h-full flex items-center justify-center cursor-pointer group" title="${spec.name} (${spec.tag})\\n${spec.buffDesc}\\n${spec.stepDesc}\\n【点击/右键】取回">',
  '              <div class="absolute -inset-1 rounded-full border border-sky-400/50 pointer-events-none"></div>',
  '              <div class="w-7 h-7 ${spec.shape} ${spec.matClass} flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 shadow-md">',
  '                <i class="fa-solid ${spec.icon} text-xs pointer-events-none"></i>',
  '              </div>',
  '              <div class="pointer-events-none absolute -bottom-2 -right-2 px-1 rounded bg-slate-900 text-[7px] font-mono-sci text-white font-bold border border-sky-400 shadow-xs z-20">',
  '                ${runeTag}',
  '              </div>',
  '              <button onclick="removeChip(\'${slotKey}\'); event.stopPropagation();" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-30" title="移除芯片">×</button>',
  '            </div>',
  '          `;',
  '        } else {',
  '          slotEl.setAttribute("data-has-chip", "false");',
  '          if (isVisible) {',
  '            slotEl.style.display = "block";',
  '            slotEl.style.opacity = "1";',
  '            slotEl.style.pointerEvents = "auto";',
  '            slotEl.style.zIndex = "10";',
  '            const isSmallDisc = (slotData.ringId === "sub_c2" || slotData.ringId === "polar");',
  '            slotEl.style.width = isSmallDisc ? "20px" : "24px";',
  '            slotEl.style.height = isSmallDisc ? "20px" : "24px";',
  '            slotEl.innerHTML = `',
  '              <div class="relative w-full h-full flex items-center justify-center group cursor-pointer" title="${slotData.ringId} ${slotData.slotIndex}号插槽 (${runeTag})\\n【点击/拖拽】装配芯片">',
  '                <div class="w-full h-full rounded-full flex items-center justify-center transition-all bg-white/90 border border-dashed border-sky-400 hover:border-sky-600 hover:bg-sky-100 shadow-xs hover:scale-115">',
  '                  <div class="w-1.5 h-1.5 rounded-full bg-sky-500 pointer-events-none"></div>',
  '                </div>',
  '                <span class="pointer-events-none absolute -bottom-2 px-0.5 rounded bg-white/90 text-[6.5px] font-mono-sci text-slate-600 font-bold border border-slate-300 shadow-xs">${slotData.slotIndex}</span>',
  '              </div>',
  '            `;',
  '          } else {',
  '            slotEl.style.display = "none";',
  '            slotEl.style.opacity = "0";',
  '            slotEl.style.pointerEvents = "none";',
  '            slotEl.innerHTML = "";',
  '          }',
  '        }',
  '      }',
  '    }',
  ''
].join('\n');

html = html.slice(0, oldRenderBoardSlotsStart) + newRenderBoardSlots + '\n    ' + html.slice(oldRenderBoardSlotsEnd);

// 6. Fix initRingDirectDragging:
html = html.replace(
  "if (clickedSlot && clickedSlot.getAttribute('data-has-chip') === 'true') return;",
  "if (clickedSlot) return;"
);

fs.writeFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', html, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/processor/index.html', html, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/中央处理器_光路阵盘/index.html', html, 'utf8');

console.log('All 3 files updated successfully!');
