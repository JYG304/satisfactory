const fs = require('fs');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Make isSlotVisibleInCurrentFocus always return true, so all empty slots are always visible and droppable!
content = content.replace(
  /function isSlotVisibleInCurrentFocus\(ringId, hasChip\) \{[\s\S]*?return false;\s*\}/,
  `function isSlotVisibleInCurrentFocus(ringId, hasChip) {
      // 永远可见所有插槽，使玩家随时可以自由放置构件与观察拓扑
      return true;
    }`
);

// 2. Ensure default FOCUSED_DISC_GROUP is 'all'
content = content.replace(
  /let FOCUSED_DISC_GROUP = 'none';/,
  `let FOCUSED_DISC_GROUP = 'all';`
);

// 3. Mark whether slot has chip on the element: data-has-chip="true/false"
content = content.replace(
  /slotEl\.id = `slot_\${slotKey}`;/,
  `slotEl.id = \`slot_\${slotKey}\`;
          slotEl.setAttribute('data-has-chip', 'false');`
);

content = content.replace(
  /if \(hasChip\) \{[\s\S]*?slotEl\.style\.display = 'block';[\s\S]*?slotEl\.style\.pointerEvents = 'auto';/,
  (match) => {
    return match + `\n          slotEl.setAttribute('data-has-chip', 'true');`;
  }
);

content = content.replace(
  /\/\/ 空插槽：根据当前选择的盘体动态显示\/隐藏！/,
  `// 空插槽：永远保持显示与可放置状态！
          slotEl.setAttribute('data-has-chip', 'false');`
);

// Style empty slots so they are clean, elegant, and clearly visible for dropping chips
content = content.replace(
  /<div class="w-7 h-7 rounded-full slot-crosshair-idle flex items-center justify-center transition-all bg-white\/90 border border-sky-500 shadow-xs hover:scale-115">[\s\S]*?<\/div>/,
  `<div class="w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white/80 border border-dashed border-sky-400 hover:border-sky-600 hover:bg-sky-50 shadow-xs hover:scale-110">
                  <div class="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                </div>`
);

// 4. Update initRingDirectDragging so clicking on empty slots DOES NOT block ring dragging
content = content.replace(
  /if \(e\.target\.closest\('#slotsLayer > div'\) \|\| e\.target\.closest\('\.keystone-hub-socket'\) \|\| e\.button !== 0\) return;/,
  `if (e.button !== 0) return;
        if (e.target.closest('.keystone-hub-socket')) return;
        const clickedSlot = e.target.closest('#slotsLayer > div');
        // 只有插了芯片的槽位才阻止圆盘拖拽，未插芯片的空槽位点击拖拽同样能平滑旋转圆盘！
        if (clickedSlot && clickedSlot.getAttribute('data-has-chip') === 'true') return;`
);

// 5. Add mouse wheel rotation support on the stage so players can effortlessly scroll to rotate discs!
const wheelSupport = `
      // 滚轮旋转支持：鼠标悬浮在哪个盘上，滚动滚轮即可顺滑旋转该盘！
      stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = stage.getBoundingClientRect();
        const scale = rect.width / 1440;
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        let targetRing = null;
        if (Math.hypot(mouseX - 250, mouseY - 150) <= 45) targetRing = 'polar';
        else if (Math.hypot(mouseX - 150, mouseY - 600) <= 65) targetRing = 'sub_d';
        else if (Math.hypot(mouseX - 1210, mouseY - 160) <= 56) {
          targetRing = Math.hypot(mouseX - 1210, mouseY - 160) <= 32 ? 'sub_c2' : 'sub_c1';
        } else if (Math.hypot(mouseX - 960, mouseY - 280) <= 95) {
          targetRing = Math.hypot(mouseX - 960, mouseY - 280) <= 55 ? 'sub_b_inner' : 'sub_b_outer';
        } else {
          const distMain = Math.hypot(mouseX - 450, mouseY - 470);
          if (distMain >= 160 && distMain <= 240) targetRing = 'tian';
          else if (distMain >= 95 && distMain < 160) targetRing = 'di';
          else if (distMain >= 35 && distMain < 95) targetRing = 'ren';
        }

        if (targetRing && DISK_RINGS[targetRing]) {
          const dir = e.deltaY > 0 ? 1 : -1;
          const ring = DISK_RINGS[targetRing];
          const degStep = 360 / ring.slotCount;
          ring.currentAngle = (ring.currentAngle + dir * (degStep / 2) + 360) % 360;
          ring.currentAngle = Number(ring.currentAngle.toFixed(1));
          ring.slotOffset = Number((ring.currentAngle / degStep).toFixed(2));
          const ringEl = document.getElementById(ring.elId);
          if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
          renderBoardSlots();
          renderFloorBase(true);
          solveStepNetwork();
          updateSubDiscRotation();
          if (typeof audio !== 'undefined' && audio.playRotate) audio.playRotate();
        }
      }, { passive: false });
`;

content = content.replace(
  /function initRingDirectDragging\(\) \{[\s\S]*?const stage = document\.getElementById\('diskStage'\);[\s\S]*?if \(!stage\) return;/,
  (match) => {
    return match + wheelSupport;
  }
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully fixed interaction, rotation, wheel, and slot visibility!');
