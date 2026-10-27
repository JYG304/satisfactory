const fs = require('fs');

let html = fs.readFileSync('processor/index.html', 'utf8');

// ============================================================================
// 1. Upgrade #diskStage to 1600x860 with automatic responsive 1080p/2K/4K scaling
// ============================================================================
html = html.replace(
  '<div id="diskStage" class="relative w-[1440px] h-[760px] shrink-0 my-auto scale-95 origin-center">',
  '<div id="diskStage" class="relative w-[1600px] h-[860px] shrink-0 my-auto origin-center transition-transform duration-150">'
);

html = html.replace(
  /viewBox="0 0 1440 760"/g,
  'viewBox="0 0 1600 860"'
);

// Add 4K / Responsive Zoom Indicator & Controls to the top-right floating bar
const oldTopRightTip = `      <!-- 操作小贴士浮窗 -->
      <div class="absolute top-4 right-6 z-20 flex items-center space-x-3 bg-white/95 border border-slate-300 px-4 py-1.5 rounded-lg text-xs text-slate-700 font-mono-sci shadow-sm">
        <span class="flex items-center text-sky-700 font-bold"><i class="fa-solid fa-arrow-left mr-1.5"></i>高能光束自右端射入</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-slate-900 font-bold"><i class="fa-solid fa-hand-pointer mr-1.5 text-slate-600"></i>拖拽安装构件</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-rose-600"><i class="fa-solid fa-rotate-left mr-1"></i>右键取回</span>
      </div>`;

const newTopRightTip = `      <!-- 操作小贴士 + 4K/全分辨率自适应缩放控制条 -->
      <div class="absolute top-3 right-6 z-20 flex items-center space-x-2.5 bg-white/95 border border-slate-300 px-3.5 py-1.5 rounded-lg text-xs text-slate-700 font-mono-sci shadow-sm backdrop-blur">
        <span class="flex items-center text-sky-700 font-bold"><i class="fa-solid fa-arrow-left mr-1"></i>右端射入</span>
        <span class="text-slate-300">|</span>
        <span class="flex items-center text-slate-800 font-bold"><i class="fa-solid fa-hand-pointer mr-1 text-sky-600"></i>点击/拖拽装卸</span>
        <span class="text-slate-300">|</span>
        <div class="flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          <i class="fa-solid fa-display text-sky-600 text-[10px]"></i>
          <span id="resolutionBadge" class="text-[10px] font-bold text-slate-700">自适应/4K就绪</span>
          <button onclick="adjustUserZoom(-0.1)" class="px-1.5 hover:bg-white rounded text-slate-700 font-bold border border-transparent hover:border-slate-300" title="缩小视图">-</button>
          <button onclick="resetUserZoom()" id="zoomPercentText" class="px-1 text-[10px] font-bold text-sky-700 hover:underline" title="点击重置为屏幕最佳自适应比例">100%</button>
          <button onclick="adjustUserZoom(0.1)" class="px-1.5 hover:bg-white rounded text-slate-700 font-bold border border-transparent hover:border-slate-300" title="放大视图">+</button>
        </div>
      </div>`;

html = html.replace(oldTopRightTip, newTopRightTip);

// ============================================================================
// 2. Transform SVG Astrolabe groups to match the enlarged 3 discs:
//    - Combat Disc:   (390, 490) [shifted (-60, +20) from (450, 470)]
//    - Industry Disc: (860, 440) [scaled 1.45x around (960, 280)]
//    - Support Disc:  (1260, 240) [scaled 1.65x around (1210, 160)]
// ============================================================================
html = html.replace(
  '<g id="celestialMansionsLayer" opacity="0.45">',
  '<g id="celestialMansionsLayer" opacity="0.45" transform="translate(-60, 20)">'
);

const sec3Marker = '<!-- ==================== 3. 【浑天主大阵 A】(中心 450, 470) ==================== -->';
const sec2Marker = '<!-- ==================== 2. 【动力从动子盘 B】(中心 960, 280) ==================== -->';
const sec1Marker = '<!-- ==================== 1. 【手表双环盘 C】(同心双环！中心 1210, 160，外 R=48，内 R=24) ==================== -->';
const svgCloseMarker = '</svg>\n\n        <!-- ✦ 全局贯穿底板阵脉图层';

const p3 = html.indexOf(sec3Marker);
const p2 = html.indexOf(sec2Marker);
const p1 = html.indexOf(sec1Marker);
const pEndSvg = html.indexOf(svgCloseMarker);

if (p3 !== -1 && p2 !== -1 && p1 !== -1 && pEndSvg !== -1) {
  const block3 = html.substring(p3, p2);
  const block2 = html.substring(p2, p1);
  const block1 = html.substring(p1, pEndSvg);

  const wrappedSvgBlocks = `
          <!-- ==================== 3. ⚔️ 攻击盘 (中心 390, 490) ==================== -->
          <g transform="translate(-60, 20)">
${block3}
          </g>

          <!-- ==================== 2. ⚙️ 工厂盘 (中心 860, 440，等比放大 1.45x) ==================== -->
          <g transform="translate(860, 440) scale(1.45) translate(-960, -280)">
${block2}
          </g>

          <!-- ==================== 1. 🛡️ 辅助盘 (中心 1260, 240，等比放大 1.65x) ==================== -->
          <g transform="translate(1260, 240) scale(1.65) translate(-1210, -160)">
${block1}
          </g>
`;
  html = html.substring(0, p3) + wrappedSvgBlocks + html.substring(pEndSvg);
}

// ============================================================================
// 3. Update Right Emitter, Disc Badges, and 3 Center Hub positions in DOM
// ============================================================================
// Right Emitter at (1510, 173) shooting along 345.2° into Support Disc (1260, 240)
html = html.replace(
  'id="rightEmitter" class="absolute z-30 flex items-center pointer-events-none" style="left: 1380px; top: 115px; transform: translateY(-50%);"',
  'id="rightEmitter" class="absolute z-30 flex items-center pointer-events-none" style="left: 1495px; top: 178px; transform: translateY(-50%);"'
);

// Update the 3 clickable disc badges
html = html.replace(
  'style="left: 450px; top: 722px; transform: translateX(-50%);"',
  'style="left: 390px; top: 745px; transform: translateX(-50%);"'
);
html = html.replace(
  'style="left: 960px; top: 438px; transform: translateX(-50%);"',
  'style="left: 860px; top: 675px; transform: translateX(-50%);"'
);
html = html.replace(
  'style="left: 1210px; top: 282px; transform: translateX(-50%);"',
  'style="left: 1260px; top: 455px; transform: translateX(-50%);"'
);

// Update the 3 center hub sockets
html = html.replace(
  'id="hubSocket_support" onclick="handleCenterCoreClick(\'support\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1210px; top: 160px; transform: translate(-50%, -50%);"',
  'id="hubSocket_support" onclick="handleCenterCoreClick(\'support\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1260px; top: 240px; transform: translate(-50%, -50%);"'
);
html = html.replace(
  'id="hubSocket_industry" onclick="handleCenterCoreClick(\'industry\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 960px; top: 280px; transform: translate(-50%, -50%);"',
  'id="hubSocket_industry" onclick="handleCenterCoreClick(\'industry\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 860px; top: 440px; transform: translate(-50%, -50%);"'
);
html = html.replace(
  'id="hubSocket_combat" onclick="handleCenterCoreClick(\'combat\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 450px; top: 470px; transform: translate(-50%, -50%);"',
  'id="hubSocket_combat" onclick="handleCenterCoreClick(\'combat\', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 390px; top: 490px; transform: translate(-50%, -50%);"'
);

// ============================================================================
// 4. Enlarge DISC_CONFIG ring radii so all 3 discs have spacious rings & slots!
// ============================================================================
const oldDiscConfig = `    const DISC_CONFIG = {
      support: {
        key: 'support',
        name: '🛡️ 辅助盘',
        shortTag: '辅',
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
        shortTag: '工',
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
        shortTag: '攻',
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
    };`;

const newDiscConfig = `    const STAGE_LOGICAL_W = 1600;
    const STAGE_LOGICAL_H = 860;
    let USER_ZOOM_FACTOR = 1.0;

    function fitStageToViewport() {
      const section = document.getElementById('astrolabeStageSection');
      const stage = document.getElementById('diskStage');
      if (!section || !stage) return;
      const availW = section.clientWidth || window.innerWidth;
      const availH = section.clientHeight || (window.innerHeight - 56);
      const baseScale = Math.min((availW - 20) / STAGE_LOGICAL_W, (availH - 20) / STAGE_LOGICAL_H);
      const finalScale = Math.max(0.45, Math.min(3.5, baseScale * USER_ZOOM_FACTOR));
      stage.style.transform = \`scale(\${finalScale.toFixed(4)})\`;

      const pctEl = document.getElementById('zoomPercentText');
      if (pctEl) pctEl.textContent = \`\${Math.round(finalScale * 100)}%\`;
      const resBadge = document.getElementById('resolutionBadge');
      if (resBadge) {
        const w = window.screen.width * (window.devicePixelRatio || 1);
        resBadge.textContent = w >= 3000 ? '4K超清自适应' : (w >= 2000 ? '2K高清自适应' : '全屏自适应');
      }
    }
    window.fitStageToViewport = fitStageToViewport;

    function adjustUserZoom(delta) {
      USER_ZOOM_FACTOR = Math.max(0.6, Math.min(2.2, Number((USER_ZOOM_FACTOR + delta).toFixed(2))));
      fitStageToViewport();
    }
    window.adjustUserZoom = adjustUserZoom;

    function resetUserZoom() {
      USER_ZOOM_FACTOR = 1.0;
      fitStageToViewport();
    }
    window.resetUserZoom = resetUserZoom;

    window.addEventListener('resize', fitStageToViewport);

    const DISC_CONFIG = {
      support: {
        key: 'support',
        name: '🛡️ 辅助盘',
        shortTag: '辅',
        cx: 1260, cy: 240,
        emitAngleDeg: 154.36, // 最外圈固定方位射出角
        nodeBorder: 'border-sky-500 hover:border-sky-700 bg-sky-50/95 hover:bg-sky-100',
        nodeDot: 'bg-sky-500',
        nodeBadge: 'bg-sky-600 text-white border-sky-300',
        rings: [
          { tier: 1, id: 'support_1', name: '辅助盘·1环(内)', radius: 62,  slotCount: 6 },
          { tier: 2, id: 'support_2', name: '辅助盘·2环',     radius: 100, slotCount: 8 },
          { tier: 3, id: 'support_3', name: '辅助盘·3环',     radius: 138, slotCount: 10 },
          { tier: 4, id: 'support_4', name: '辅助盘·4环(外)', radius: 176, slotCount: 12 }
        ]
      },
      industry: {
        key: 'industry',
        name: '⚙️ 工厂盘',
        shortTag: '工',
        cx: 860, cy: 440,
        emitAngleDeg: 159.75, // 最外圈固定方位射出角
        nodeBorder: 'border-amber-500 hover:border-amber-700 bg-amber-50/95 hover:bg-amber-100',
        nodeDot: 'bg-amber-500',
        nodeBadge: 'bg-amber-600 text-white border-amber-300',
        rings: [
          { tier: 1, id: 'industry_1', name: '工厂盘·1环(内)', radius: 66,  slotCount: 6 },
          { tier: 2, id: 'industry_2', name: '工厂盘·2环',     radius: 106, slotCount: 8 },
          { tier: 3, id: 'industry_3', name: '工厂盘·3环',     radius: 146, slotCount: 10 },
          { tier: 4, id: 'industry_4', name: '工厂盘·4环(外)', radius: 186, slotCount: 12 }
        ]
      },
      combat: {
        key: 'combat',
        name: '⚔️ 攻击盘',
        shortTag: '攻',
        cx: 390, cy: 490,
        emitAngleDeg: 156.57, // 最外圈固定方位射出角
        nodeBorder: 'border-rose-500 hover:border-rose-700 bg-rose-50/95 hover:bg-rose-100',
        nodeDot: 'bg-rose-500',
        nodeBadge: 'bg-rose-600 text-white border-rose-300',
        rings: [
          { tier: 1, id: 'combat_1', name: '攻击盘·1环(内)', radius: 74,  slotCount: 6 },
          { tier: 2, id: 'combat_2', name: '攻击盘·2环',     radius: 118, slotCount: 8 },
          { tier: 3, id: 'combat_3', name: '攻击盘·3环',     radius: 162, slotCount: 10 },
          { tier: 4, id: 'combat_4', name: '攻击盘·4环(外)', radius: 206, slotCount: 16 }
        ]
      }
    };`;

html = html.replace(oldDiscConfig, newDiscConfig);

// 5. Make empty slots uniform 26px and placed chips 34px so everything is large, clear, and easy to click
html = html.replace(
  `          const isInnerSmall = (slotData.ringId === "support_1");
          slotEl.style.width = isInnerSmall ? "20px" : "24px";
          slotEl.style.height = isInnerSmall ? "20px" : "24px";`,
  `          slotEl.style.width = "26px";
          slotEl.style.height = "26px";`
);

// 6. Update scale calculation in wheel and mousedown to use STAGE_LOGICAL_W (1600)
html = html.replace(/const scale = rect\.width \/ 1440;/g, 'const scale = rect.width / STAGE_LOGICAL_W;');

// 7. Update rightEmitterPos in solveStepNetwork to (1495, 178)
html = html.replace(
  'const rightEmitterPos = { x: 1380, y: 115 };',
  'const rightEmitterPos = { x: 1495, y: 178 };'
);

// 8. Update loadScenario initial angles for 6-slot support_1 and industry_1
html = html.replace(
  `        // 1. 辅助盘 1环 (4槽)：旋转 75.2° 使第1槽对准 345.2° 始发源
        DISK_RINGS['support_1'].currentAngle = 75.2;
        BOARD_SLOTS['support_1_0'].chip = 't0_speed_1';      // 0 ➔ 1
        BOARD_SLOTS['support_1_1'].chip = 't0_atk_1';        // 1 ➔ 2
        BOARD_SLOTS['support_1_2'].chip = 'chip_triangle_in'; // 2 ➔ 射入辅助盘中心！`,
  `        // 1. 辅助盘 1环 (6槽，宽敞R=62)：旋转 15.2° 使第2槽(索引1)精准对准 345.2° 始发源
        DISK_RINGS['support_1'].currentAngle = 15.2;
        BOARD_SLOTS['support_1_1'].chip = 't0_speed_1';      // 1 ➔ 2
        BOARD_SLOTS['support_1_2'].chip = 't0_atk_1';        // 2 ➔ 3
        BOARD_SLOTS['support_1_3'].chip = 'chip_triangle_in'; // 3 ➔ 射入辅助盘中心！`
);

// Call fitStageToViewport on DOMContentLoaded and when sidebars toggle
html = html.replace(
  'loadScenario(\'multi_disc_overdrive\');\n    });',
  'loadScenario(\'multi_disc_overdrive\');\n      fitStageToViewport();\n      setTimeout(fitStageToViewport, 120);\n    });'
);
html = html.replace(
  'audio.playRotate();\n    }',
  'audio.playRotate();\n      setTimeout(fitStageToViewport, 360);\n    }'
);

// Validate syntax
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>[\s\n]*<\/body>/);
new Function(scriptMatch[1]);
console.log('Enlarged 3-disc & 4K responsive script syntax is 100% VALID!');

fs.writeFileSync('processor/index.html', html);
fs.writeFileSync('optical_array_prototype.html', html);
fs.writeFileSync('中央处理器_光路阵盘/index.html', html);
console.log('Saved all 3 files successfully.');
