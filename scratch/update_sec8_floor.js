const fs = require('fs');
let code = fs.readFileSync('scratch/sec8_floor_code.txt', 'utf8');

// 1. Update renderStarGlyph outer halo and glow
const oldHalo = `        const outerHaloR = isAligned ? 32 : 26;
        const outerHaloOpacity = isAligned ? '0.35' : '0.15';`;

const newHalo = `        const outerHaloR = isAligned ? 36 : 24;
        const outerHaloOpacity = isAligned ? '0.5' : '0.12';`;

if (!code.includes(oldHalo)) {
  console.error('oldHalo not found');
} else {
  code = code.replace(oldHalo, newHalo);
  console.log('outerHalo updated');
}

// 2. Update alignedMap loop with strict 10.0 threshold and near-alignment detection
const oldAlignedLoop = `      const alignedMap = {};
      const nodeMap = {};
      if (shapeDef.nodes) {
        shapeDef.nodes.forEach(node => {
          nodeMap[node.id] = node;
          let isAligned = !!(hitSet && hitSet.has(node.id));
          if (!isAligned) {
            for (const [rId, rMeta] of Object.entries(DISK_RINGS)) {
              if (rMeta.tier > (counts[rMeta.discKey] || 1)) continue;
              for (let sIdx = 0; sIdx < rMeta.slotCount; sIdx++) {
                const p = getSlotWorldPos(rId, sIdx);
                if (Math.hypot(p.x - node.x, p.y - node.y) <= 26) {
                  const sKey = \`\${rId}_\${sIdx}\`;
                  if (BOARD_SLOTS[sKey] && BOARD_SLOTS[sKey].chip) {
                    isAligned = true;
                    break;
                  }
                }
              }
              if (isAligned) break;
            }
          }
          alignedMap[node.id] = isAligned;
        });
      }`;

const newAlignedLoop = `      const alignedMap = {};
      const nearMap = {};
      const nodeMap = {};
      if (shapeDef.nodes) {
        shapeDef.nodes.forEach(node => {
          nodeMap[node.id] = node;
          let isAligned = !!(hitSet && hitSet.has(node.id));
          let nearInfo = null;

          if (!isAligned) {
            let minNearDist = 999;
            for (const [rId, rMeta] of Object.entries(DISK_RINGS)) {
              if (rMeta.tier > (counts[rMeta.discKey] || 1)) continue;
              for (let sIdx = 0; sIdx < rMeta.slotCount; sIdx++) {
                const sKey = \`\${rId}_\${sIdx}\`;
                if (BOARD_SLOTS[sKey] && BOARD_SLOTS[sKey].chip) {
                  const p = getSlotWorldPos(rId, sIdx);
                  const d = Math.hypot(p.x - node.x, p.y - node.y);
                  if (d <= 10.0) {
                    isAligned = true;
                    nearInfo = null;
                    break;
                  } else if (d <= 32.0 && d < minNearDist) {
                    minNearDist = d;
                    nearInfo = { x: p.x, y: p.y, dist: d, ringName: rMeta.name };
                  }
                }
              }
              if (isAligned) break;
            }
          }
          alignedMap[node.id] = isAligned;
          nearMap[node.id] = nearInfo;
        });
      }`;

if (!code.includes(oldAlignedLoop)) {
  console.error('oldAlignedLoop not found');
} else {
  code = code.replace(oldAlignedLoop, newAlignedLoop);
  console.log('alignedMap & nearMap loop updated');
}

// 3. Update nodesSvg rendering: show tether line for nearInfo, and explicit badge text
const oldNodesSvg = `      let nodesSvg = '';
      if (shapeDef.nodes) {
        shapeDef.nodes.forEach(node => {
          const isAligned = alignedMap[node.id];
          const badgeX = node.bx !== undefined ? node.bx : node.x + 22;
          const badgeY = node.by !== undefined ? node.by : node.y - 18;

          nodesSvg += \`
            <g id="starNodeGroup_\${node.id}" class="transition-opacity duration-300">
              \${renderStarGlyph(node, isAligned)}

              <!-- 悬浮说明文字气泡 -->
              <g transform="translate(\${badgeX}, \${badgeY})" opacity="\${isAligned ? '1' : '0.85'}">
                <rect x="0" y="0" width="76" height="18" rx="4"
                      fill="\${isAligned ? '#ffffff' : '#f8fafc'}"
                      stroke="\${isAligned ? node.color : '#cbd5e1'}"
                      stroke-width="\${isAligned ? '1.5' : '1'}"
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))" />
                <text x="38" y="12.5" text-anchor="middle"
                      font-family="'Share Tech Mono', monospace" font-size="9.5" font-weight="bold"
                      fill="\${isAligned ? node.color : '#475569'}">
                  \${node.num} \${isAligned ? '已导通' : '待对齐'}
                </text>
              </g>
            </g>
          \`;
        });
      }`;

const newNodesSvg = `      let nodesSvg = '';
      if (shapeDef.nodes) {
        shapeDef.nodes.forEach(node => {
          const isAligned = alignedMap[node.id];
          const nearInfo = nearMap[node.id];
          const badgeX = node.bx !== undefined ? node.bx : node.x + 22;
          const badgeY = node.by !== undefined ? node.by : node.y - 18;

          // 待对齐时的磁吸导引虚线
          let tetherSvg = '';
          if (!isAligned && nearInfo) {
            tetherSvg = \`
              <line x1="\${nearInfo.x}" y1="\${nearInfo.y}" x2="\${node.x}" y2="\${node.y}"
                    stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.9" />
              <circle cx="\${nearInfo.x}" cy="\${nearInfo.y}" r="4" fill="#f59e0b" />
            \`;
          }

          let badgeBorder = isAligned ? node.color : (nearInfo ? '#f59e0b' : '#cbd5e1');
          let badgeFill = isAligned ? '#ffffff' : (nearInfo ? '#fffbeb' : '#f8fafc');
          let badgeTextColor = isAligned ? node.color : (nearInfo ? '#b45309' : '#64748b');
          let badgeText = isAligned ? \`\${node.num} ★已激活(+120%)\` : (nearInfo ? \`\${node.num} ↻差\${Math.round(nearInfo.dist)}px\` : \`\${node.num} 待转盘对齐\`);
          let badgeW = isAligned ? 94 : (nearInfo ? 84 : 76);

          nodesSvg += \`
            <g id="starNodeGroup_\${node.id}" class="transition-opacity duration-300">
              \${tetherSvg}
              \${renderStarGlyph(node, isAligned)}

              <!-- 悬浮说明文字气泡 -->
              <g transform="translate(\${badgeX}, \${badgeY})" opacity="\${isAligned ? '1' : '0.9'}">
                <rect x="0" y="0" width="\${badgeW}" height="18" rx="4"
                      fill="\${badgeFill}"
                      stroke="\${badgeBorder}"
                      stroke-width="\${isAligned || nearInfo ? '1.5' : '1'}"
                      filter="drop-shadow(0 1px 3px rgba(0,0,0,0.08))" />
                <text x="\${badgeW / 2}" y="12.5" text-anchor="middle"
                      font-family="'Share Tech Mono', monospace" font-size="9" font-weight="900"
                      fill="\${badgeTextColor}">
                  \${badgeText}
                </text>
              </g>
            </g>
          \`;
        });
      }`;

if (!code.includes(oldNodesSvg)) {
  console.error('oldNodesSvg not found');
} else {
  code = code.replace(oldNodesSvg, newNodesSvg);
  console.log('nodesSvg updated');
}

fs.writeFileSync('scratch/sec8_floor_code.txt', code);
console.log('Successfully saved scratch/sec8_floor_code.txt');
