const fs = require('fs');
let code = fs.readFileSync('scratch/sec5_to_7_code.txt', 'utf8');

// 1. In rotateRing, add applyRingMagneticSnap
const oldRotateRing = `    function rotateRing(ringId, stepDelta) {
      const ring = DISK_RINGS[ringId];
      if (!ring) return;
      const fineStep = 0.5;
      ring.slotOffset = (ring.slotOffset + stepDelta * fineStep + ring.slotCount) % ring.slotCount;
      const degStep = 360 / ring.slotCount;
      ring.currentAngle = Number(((ring.slotOffset * degStep) % 360).toFixed(1));
      const ringEl = document.getElementById(ring.elId);
      if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
      if (audio) audio.playRotate();
      renderOuterFixedNozzles();
      renderBoardSlots();
      renderFloorBase(true);
      solveStepNetwork();
      updateCenterHubsDOM();
    }`;

const newRotateRing = `    function rotateRing(ringId, stepDelta) {
      const ring = DISK_RINGS[ringId];
      if (!ring) return;
      const fineStep = 0.5;
      ring.slotOffset = (ring.slotOffset + stepDelta * fineStep + ring.slotCount) % ring.slotCount;
      const degStep = 360 / ring.slotCount;
      ring.currentAngle = Number(((ring.slotOffset * degStep) % 360).toFixed(1));
      applyRingMagneticSnap(ringId);
      const ringEl = document.getElementById(ring.elId);
      if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
      if (audio) audio.playRotate();
      renderOuterFixedNozzles();
      renderBoardSlots();
      renderFloorBase(true);
      solveStepNetwork();
      updateCenterHubsDOM();
    }`;

if (!code.includes(oldRotateRing)) {
  console.error('oldRotateRing not found');
} else {
  code = code.replace(oldRotateRing, newRotateRing);
  console.log('rotateRing updated');
}

// 2. Wheel event: finer degree step + snapping
const oldWheel = `          const dir = e.deltaY > 0 ? 1 : -1;
          const ring = DISK_RINGS[targetRing];
          setActiveInteractRing(targetRing);
          const degStep = 360 / ring.slotCount;
          ring.currentAngle = Number(((ring.currentAngle + dir * (degStep / 2) + 360) % 360).toFixed(1));
          ring.slotOffset = Number((ring.currentAngle / degStep).toFixed(2));
          const ringEl = document.getElementById(ring.elId);
          if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
          renderOuterFixedNozzles();
          renderBoardSlots();
          renderFloorBase(true);
          solveStepNetwork();
          updateCenterHubsDOM();
          if (audio) audio.playRotate();`;

const newWheel = `          const dir = e.deltaY > 0 ? 1 : -1;
          const ring = DISK_RINGS[targetRing];
          setActiveInteractRing(targetRing);
          const degStep = 360 / ring.slotCount;
          ring.currentAngle = Number(((ring.currentAngle + dir * 1.5 + 360) % 360).toFixed(1));
          ring.slotOffset = Number((ring.currentAngle / degStep).toFixed(2));
          applyRingMagneticSnap(targetRing);
          const ringEl = document.getElementById(ring.elId);
          if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
          renderOuterFixedNozzles();
          renderBoardSlots();
          renderFloorBase(true);
          solveStepNetwork();
          updateCenterHubsDOM();
          if (audio) audio.playRotate();`;

if (!code.includes(oldWheel)) {
  console.error('oldWheel not found');
} else {
  code = code.replace(oldWheel, newWheel);
  console.log('wheel event updated');
}

// 3. onMouseUp snapping
const oldMouseUp = `        const onMouseUp = () => {
          if (isDragging && activeRingKey) {
            const rObj = DISK_RINGS[activeRingKey];
            rObj.currentAngle = Number(rObj.currentAngle.toFixed(1));
            renderOuterFixedNozzles();
            renderBoardSlots();
            renderFloorBase(true);
            solveStepNetwork();
            updateCenterHubsDOM();
            if (hasMoved && audio) audio.playRotate();
          }
          isDragging = false;
          activeRingKey = null;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };`;

const newMouseUp = `        const onMouseUp = () => {
          if (isDragging && activeRingKey) {
            const rObj = DISK_RINGS[activeRingKey];
            rObj.currentAngle = Number(rObj.currentAngle.toFixed(1));
            const snapped = applyRingMagneticSnap(activeRingKey);
            renderOuterFixedNozzles();
            renderBoardSlots();
            renderFloorBase(true);
            solveStepNetwork();
            updateCenterHubsDOM();
            if (audio) {
              if (snapped && audio.playSnap) audio.playSnap();
              else if (hasMoved) audio.playRotate();
            }
          }
          isDragging = false;
          activeRingKey = null;
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };`;

if (!code.includes(oldMouseUp)) {
  console.error('oldMouseUp not found');
} else {
  code = code.replace(oldMouseUp, newMouseUp);
  console.log('mouseUp updated');
}

// 4. Add applyRingMagneticSnap and update getClosestSlotToAngle
const oldClosestSlot = `    function getClosestSlotToAngle(ringId, targetWorldAngle, toleranceDeg = 22) {
      const ring = DISK_RINGS[ringId];
      if (!ring) return { slotIndex: 0, diff: 999, isAligned: false };
      let bestSlot = 0;
      let minDiff = 999;
      for (let i = 0; i < ring.slotCount; i++) {
        const baseDeg = -90 + (i * (360 / ring.slotCount));
        const effDeg = (baseDeg + ring.currentAngle + 720) % 360;
        let diff = Math.abs(effDeg - targetWorldAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          bestSlot = i;
        }
      }
      return {
        slotIndex: bestSlot,
        diff: minDiff,
        isAligned: minDiff <= toleranceDeg
      };
    }`;

const newClosestSlot = `    // ★ 智能齿轮吸附与磁吸对齐系统 (Magnetic Gear Snap)
    function applyRingMagneticSnap(ringId) {
      const ring = DISK_RINGS[ringId];
      if (!ring) return false;
      const dKey = ring.discKey;
      const counts = getActiveRingCounts();
      if (ring.tier > (counts[dKey] || 1) && !ringId.endsWith('_dock')) return false;

      const targetAngles = [];

      // 1. 底盘星位对应方位角（当星位距盘心距离与该环半径贴近时）
      const floorDef = CURRENT_FLOOR_SHAPE ? FLOOR_SHAPES[CURRENT_FLOOR_SHAPE] : null;
      if (floorDef && floorDef.nodes) {
        floorDef.nodes.filter(n => n.disc === dKey).forEach(node => {
          const distFromCenter = Math.hypot(node.x - ring.cx, node.y - ring.cy);
          if (Math.abs(distFromCenter - ring.radius) < 20) {
            const nodeAngle = (Math.atan2(node.y - ring.cy, node.x - ring.cx) * 180 / Math.PI + 360) % 360;
            targetAngles.push(nodeAngle);
          }
        });
      }

      // 2. 始发激光入口 (辅助盘最外环 345.17°)
      if (ringId === \`support_\${counts.support}\`) {
        targetAngles.push(345.17);
      }

      // 3. 跨盘导入线入口 (目标盘最外环接收来自独立外圈插槽的径向入射光)
      const dockId = \`\${dKey}_dock\`;
      const dockSlot = OUTER_DOCK_SLOTS[dockId];
      if (dockSlot && dockSlot.coreChip && ringId === \`\${dKey}_\${counts[dKey]}\`) {
        const dockWorldPos = getSlotWorldPos(dockId, 0);
        targetAngles.push(dockWorldPos.angleDeg);
      }

      // 4. 外环变轨三角向内折射光束
      if (ring.tier < (counts[dKey] || 1)) {
        const outerRingId = \`\${dKey}_\${ring.tier + 1}\`;
        const outerRing = DISK_RINGS[outerRingId];
        if (outerRing) {
          for (let os = 0; os < outerRing.slotCount; os++) {
            const slotKey = \`\${outerRingId}_\${os}\`;
            if (BOARD_SLOTS[slotKey] && BOARD_SLOTS[slotKey].chip === 'chip_triangle_in') {
              const outerPos = getSlotWorldPos(outerRingId, os);
              targetAngles.push(outerPos.angleDeg);
            }
          }
        }
      }

      if (targetAngles.length === 0) return false;

      const degStep = 360 / ring.slotCount;
      let minDiff = 999;
      let bestSnapAngle = null;

      for (const targetWorldAngle of targetAngles) {
        for (let s = 0; s < ring.slotCount; s++) {
          const baseDeg = -90 + (s * degStep);
          const effDeg = (baseDeg + ring.currentAngle + 720) % 360;
          let diff = effDeg - targetWorldAngle;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;
          if (Math.abs(diff) < Math.abs(minDiff)) {
            minDiff = diff;
            bestSnapAngle = (ring.currentAngle - diff + 360) % 360;
          }
        }
      }

      // 磁吸吸附门限：当角度差在 3.2° 以内时，自动吸附对准！
      if (Math.abs(minDiff) <= 3.2) {
        ring.currentAngle = Number(bestSnapAngle.toFixed(1));
        ring.slotOffset = Number((ring.currentAngle / degStep).toFixed(2));
        const ringEl = document.getElementById(ring.elId);
        if (ringEl) ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
        return true;
      }
      return false;
    }

    // ★ 收紧容差为 6.0°（杜绝不用转盘就能导通的花架子问题，逼近真实机械对齿手感）
    function getClosestSlotToAngle(ringId, targetWorldAngle, toleranceDeg = 6.0) {
      const ring = DISK_RINGS[ringId];
      if (!ring) return { slotIndex: 0, diff: 999, isAligned: false };
      let bestSlot = 0;
      let minDiff = 999;
      for (let i = 0; i < ring.slotCount; i++) {
        const baseDeg = -90 + (i * (360 / ring.slotCount));
        const effDeg = (baseDeg + ring.currentAngle + 720) % 360;
        let diff = Math.abs(effDeg - targetWorldAngle);
        if (diff > 180) diff = 360 - diff;
        if (diff < minDiff) {
          minDiff = diff;
          bestSlot = i;
        }
      }
      return {
        slotIndex: bestSlot,
        diff: minDiff,
        isAligned: minDiff <= toleranceDeg
      };
    }`;

if (!code.includes(oldClosestSlot)) {
  console.error('oldClosestSlot not found');
} else {
  code = code.replace(oldClosestSlot, newClosestSlot);
  console.log('applyRingMagneticSnap and getClosestSlotToAngle updated');
}

// 5. Floor node distance in traceDiscOpticalPath: <= 26 -> <= 10.0
const oldFloorDist = `const matchedFloor = floorDef.nodes.find(fn => Math.hypot(curPos.x - fn.x, curPos.y - fn.y) <= 26);`;
const newFloorDist = `const matchedFloor = floorDef.nodes.find(fn => Math.hypot(curPos.x - fn.x, curPos.y - fn.y) <= 10.0);`;
if (!code.includes(oldFloorDist)) {
  console.error('oldFloorDist not found');
} else {
  code = code.replace(oldFloorDist, newFloorDist);
  console.log('floorDist in traceDiscOpticalPath updated to 10.0');
}

// 6. Inward shift_in refraction: tolerance 22 -> 6.0 + visual misalignment cue
const oldShiftInAlign = `              const align = getClosestSlotToAngle(innerRingId, curPos.angleDeg, 22);
              if (!align.isAligned) {
                drawImpactSpark(svgImpacts, tx, ty, '#f59e0b', 5);
                logSteps.push(\`⚡ [\${dMeta.name}内环待对齐] 变轨三角向内折射，偏离 \${innerRingObj.name} 插槽 \${align.diff.toFixed(1)}°（请旋转内环对齐）\`);
                break;
              }`;

const newShiftInAlign = `              const align = getClosestSlotToAngle(innerRingId, curPos.angleDeg, 6.0);
              if (!align.isAligned) {
                drawImpactSpark(svgImpacts, tx, ty, '#f59e0b', 7);
                svgImpacts.innerHTML += \`
                  <g class="misalignment-cue" filter="drop-shadow(0 0 4px rgba(0,0,0,0.85))">
                    <circle cx="\${tx}" cy="\${ty}" r="9" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2 2" />
                    <rect x="\${tx - 85}" y="\${ty - 25}" width="170" height="18" rx="4" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.2" />
                    <text x="\${tx}" y="\${ty - 13}" fill="#f59e0b" font-family="'Share Tech Mono', sans-serif" font-size="10" font-weight="900" text-anchor="middle">
                      ⚡ 折射断路 (偏离 \${align.diff.toFixed(1)}°) ↻ 旋转内环
                    </text>
                  </g>
                \`;
                logSteps.push(\`⚡ [向心折射断路] 变轨三角向内折射光撞击\${innerRingObj.name}铁皮间隙！偏离 \${align.diff.toFixed(1)}°（必须旋转内环使插槽接收入射光）\`);
                break;
              }`;

if (!code.includes(oldShiftInAlign)) {
  console.error('oldShiftInAlign not found');
} else {
  code = code.replace(oldShiftInAlign, newShiftInAlign);
  console.log('shift_in align updated');
}

// 7. Support entrance: tolerance 22 -> 6.0 + visual misalignment cue
const oldSupAlign = `      const supAlign = getClosestSlotToAngle(supOutRingId, 345.17, 22);
      const apertureStatusEl = document.getElementById('c1ApertureStatusBadge');

      if (!supAlign.isAligned) {
        drawBeamLine(svgBeams, rightEmitterPos.x, rightEmitterPos.y, supEntryX, supEntryY, 'blue', true);
        drawImpactSpark(svgImpacts, supEntryX, supEntryY, '#f59e0b', 5);
        if (apertureStatusEl) {
          apertureStatusEl.setAttribute('fill', '#f59e0b');
          apertureStatusEl.textContent = \`▲ 待找平 (偏离 \${supAlign.diff.toFixed(1)}°)\`;
        }
        logSteps.push(\`⚡ [始发待找平] 激光射至辅助盘 (\${supOutRing.name})，偏离插槽 \${supAlign.diff.toFixed(1)}°（请旋转辅助盘对齐）\`);
      }`;

const newSupAlign = `      const supAlign = getClosestSlotToAngle(supOutRingId, 345.17, 6.0);
      const apertureStatusEl = document.getElementById('c1ApertureStatusBadge');

      if (!supAlign.isAligned) {
        drawBeamLine(svgBeams, rightEmitterPos.x, rightEmitterPos.y, supEntryX, supEntryY, 'blue', true);
        drawImpactSpark(svgImpacts, supEntryX, supEntryY, '#f59e0b', 7);
        svgImpacts.innerHTML += \`
          <g class="misalignment-cue" filter="drop-shadow(0 0 5px rgba(0,0,0,0.9))">
            <circle cx="\${supEntryX}" cy="\${supEntryY}" r="11" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="3 3">
              <animateTransform attributeName="transform" type="rotate" from="0 \${supEntryX} \${supEntryY}" to="360 \${supEntryX} \${supEntryY}" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="\${supEntryX - 110}" y="\${supEntryY - 28}" width="220" height="22" rx="4" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.2" />
            <text x="\${supEntryX}" y="\${supEntryY - 13}" fill="#f59e0b" font-family="'Share Tech Mono', sans-serif" font-size="11" font-weight="900" text-anchor="middle">
              ⚡ 始发断路 (偏离 \${supAlign.diff.toFixed(1)}°) ↻ 请旋转辅助盘
            </text>
          </g>
        \`;
        if (apertureStatusEl) {
          apertureStatusEl.setAttribute('fill', '#f59e0b');
          apertureStatusEl.textContent = \`▲ 断路待旋转 (偏离 \${supAlign.diff.toFixed(1)}°)\`;
        }
        logSteps.push(\`⚡ [始发激光断路] 激光撞击辅助盘外壁！偏离插槽 \${supAlign.diff.toFixed(1)}°（必须旋转辅助盘使插槽对准右侧激光口）\`);
      }`;

if (!code.includes(oldSupAlign)) {
  console.error('oldSupAlign not found');
} else {
  code = code.replace(oldSupAlign, newSupAlign);
  console.log('supAlign updated');
}

// 8. Cross-disc injection: tolerance 22 -> 6.0 + visual misalignment cue
const oldCrossAlign = `          const align = getClosestSlotToAngle(dstOutRingId, dstDockPos.angleDeg, 22);
          if (!align.isAligned) {
            drawBeamLine(svgBeams, dstDockPos.x, dstDockPos.y, ringEdgeX, ringEdgeY, dstKey === 'combat' ? 'red' : 'yellow', true);
            drawImpactSpark(svgImpacts, ringEdgeX, ringEdgeY, '#f59e0b', 5);
            logSteps.push(\`🚀 [导入线已连上] \${srcMeta.name} ➔ \${dstMeta.name}【\${targetDock.label}】，可旋转独立外圈或基础环使之对齐！\`);
          }`;

const newCrossAlign = `          const align = getClosestSlotToAngle(dstOutRingId, dstDockPos.angleDeg, 6.0);
          if (!align.isAligned) {
            drawBeamLine(svgBeams, dstDockPos.x, dstDockPos.y, ringEdgeX, ringEdgeY, dstKey === 'combat' ? 'red' : 'yellow', true);
            drawImpactSpark(svgImpacts, ringEdgeX, ringEdgeY, '#f59e0b', 7);
            svgImpacts.innerHTML += \`
              <g class="misalignment-cue" filter="drop-shadow(0 0 4px rgba(0,0,0,0.85))">
                <circle cx="\${ringEdgeX}" cy="\${ringEdgeY}" r="9" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2 2" />
                <rect x="\${ringEdgeX - 95}" y="\${ringEdgeY - 26}" width="190" height="20" rx="4" fill="#0f172a" fill-opacity="0.9" stroke="#f59e0b" stroke-width="1.2" />
                <text x="\${ringEdgeX}" y="\${ringEdgeY - 12}" fill="#f59e0b" font-family="'Share Tech Mono', sans-serif" font-size="10.5" font-weight="900" text-anchor="middle">
                  ⚡ 跨盘断路 (偏离 \${align.diff.toFixed(1)}°) ↻ 旋转接收环
                </text>
              </g>
            \`;
            logSteps.push(\`⚡ [跨盘导入线断路] 导入线射入\${dstMeta.name}外壁！偏离 \${dstOutRing.name} 插槽 \${align.diff.toFixed(1)}°（请旋转基础环使插槽接收入射光）\`);
          }`;

if (!code.includes(oldCrossAlign)) {
  console.error('oldCrossAlign not found');
} else {
  code = code.replace(oldCrossAlign, newCrossAlign);
  console.log('crossAlign updated');
}

fs.writeFileSync('scratch/sec5_to_7_code.txt', code);
console.log('Successfully saved scratch/sec5_to_7_code.txt');
