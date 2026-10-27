const fs = require('fs');

// Always start from the clean restored first-deployment file
let html = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

// ============================================================================
// STEP 1: Remove floating sub-rings (polar, sub_d, disc_e) from SVG & DOM,
//         keep the 3 main astrolabe discs (disc_c=辅助盘, disc_b=工厂盘, disc_a=攻击盘)
// ============================================================================

// 1.1 In SVG (#astrolabeVectorBg): remove section 5 (太虚中元), section 4 (终极释能盘 D), section 0 (极轨探天副盘)
// and update labels of the 3 main discs to:
// - 盘 C (1210, 160): 🛡️ 辅助盘 (辰光调频仪)
// - 盘 B (960, 280):  ⚙️ 工厂盘 (浑仪动力仪)
// - 盘 A (450, 470):  ⚔️ 攻击盘 (周天天玑主仪)

const sec5Start = html.indexOf('<!-- ==================== 5. 【太虚中元聚光透镜环】');
const sec3Start = html.indexOf('<!-- ==================== 3. 【浑天主大阵 A】');
if (sec5Start !== -1 && sec3Start !== -1) {
  html = html.substring(0, sec5Start) + html.substring(sec3Start);
}

const sec0PolarStart = html.indexOf('<!-- ==================== 0. 【极轨探天副盘】');
const svgEndIdx = html.indexOf('</svg>', sec0PolarStart);
if (sec0PolarStart !== -1 && svgEndIdx !== -1) {
  html = html.substring(0, sec0PolarStart) + '\n        </svg>' + html.substring(svgEndIdx + 6);
}

// Update the 3 disc titles in SVG
html = html.replace('>周天天玑主仪</text>', '>⚔️ 攻击盘 · 周天天玑主仪</text>');
html = html.replace('>浑仪动力从动盘</text>', '>⚙️ 工厂盘 · 浑仪动力仪</text>');
html = html.replace('>辰光调频双表盘</text>', '>🛡️ 辅助盘 · 辰光调频仪</text>');

// 1.2 In DOM: remove ringSubDEl, hubSocket_disc_e, hubSocket_disc_d, and replace the ring DOM elements
// with dynamic 4-ring containers for the 3 discs (keeping the exact original border/label style!)
const domRingsStart = html.indexOf('<!-- ✦ 盘 4（最左端）：虚空终端释能盘 DOM 环体');
const slotsLayerIdx = html.indexOf('<!-- 全局插槽 DOM 交互层');

const threeDiscsDomHtml = `        <!-- ✦ 三大主盘动态同心环 DOM 容器 (完全保留第一版黑白青精密工程制图边框样式) ✦ -->
        <div id="dynamicRingsDomContainer" class="absolute inset-0 pointer-events-none" style="z-index: 2;"></div>

        <!-- ✦ 最外圈固定方位射出点图层 ✦ -->
        <div id="outerFixedNozzlesLayer" class="absolute inset-0 pointer-events-none" style="z-index: 26;"></div>

        <!-- ✦ 三大主盘中心极核插槽 (光路射入中心后充能，可点击取下并装入其他盘外圈插槽以激活跨盘导入线！) ✦ -->

        <!-- 1. 🛡️ 辅助盘中心极核 (1210, 160) -->
        <div id="hubSocket_disc_c" onclick="handleCenterHubClick('disc_c', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1210px; top: 160px; transform: translate(-50%, -50%);" title="【🛡️ 辅助盘中心极核】&#10;当光路射入中心后，点击可将该中心核取下，放到其他盘子的外圈插槽里以激活跨盘导入线！">
          <div class="relative w-9 h-9 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-115" id="crossCenterCore_disc_c">
            <div class="absolute -inset-1 rounded-full border border-dashed border-sky-500/80 animate-spin" style="animation-duration: 15s;"></div>
            <i id="crossCoreIcon_disc_c" class="fa-solid fa-Microchip fa-gem text-sky-600 text-xs relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-white text-[7.5px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="crossCoreBadge_disc_c">
            <span id="crossCoreNameText_disc_c">辅助中心核</span>
          </div>
        </div>

        <!-- 2. ⚙️ 工厂盘中心极核 (960, 280) -->
        <div id="hubSocket_disc_b" onclick="handleCenterHubClick('disc_b', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 960px; top: 280px; transform: translate(-50%, -50%);" title="【⚙️ 工厂盘中心极核】&#10;当光路射入中心后，点击可将该中心核取下，放到其他盘子的外圈插槽里以激活跨盘导入线！">
          <div class="relative w-10 h-10 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-115" id="crossCenterCore_disc_b">
            <div class="absolute -inset-1 rounded-full border border-dashed border-amber-500/80 animate-spin" style="animation-duration: 18s;"></div>
            <i id="crossCoreIcon_disc_b" class="fa-solid fa-gear text-amber-600 text-xs relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-white text-[7.5px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="crossCoreBadge_disc_b">
            <span id="crossCoreNameText_disc_b">工厂中心核</span>
          </div>
        </div>

        <!-- 3. ⚔️ 攻击盘中心极核 (450, 470) -->
        <div id="centralCrossSocket" onclick="handleCenterHubClick('disc_a', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 450px; top: 470px; transform: translate(-50%, -50%);" title="【⚔️ 攻击盘中心极核】&#10;当光路射入中心后，点击可将该中心核取下，放到其他盘子的外圈插槽里以激活跨盘导入线！">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-115" id="crossCenterCore">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-amber-400/80 animate-spin" style="animation-duration: 20s;"></div>
            <div class="absolute -inset-0.5 rounded-full bg-amber-400/10 blur-xs"></div>
            <i id="crossCoreIcon" class="fa-solid fa-khanda text-rose-600 text-sm relative z-10 transition-transform group-hover:rotate-12"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-amber-900 border border-amber-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="crossCoreBadge">
            <i class="fa-solid fa-gem text-[7px] text-amber-500"></i>
            <span id="crossCoreNameText">攻击中心核</span>
          </div>
        </div>

`;

if (domRingsStart !== -1 && slotsLayerIdx !== -1) {
  html = html.substring(0, domRingsStart) + threeDiscsDomHtml + html.substring(slotsLayerIdx);
}

console.log('Step 1 DOM & SVG cleanup applied.');
fs.writeFileSync('scratch/step1_test.html', html);
