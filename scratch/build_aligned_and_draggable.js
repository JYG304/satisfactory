const fs = require('fs');

// Start from clean backup of commit_9af3d23
let baseHtml = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

// ============================================================================
// PART A: Update HTML & SVG in baseHtml -> save to scratch/temp_part1.html
// ============================================================================

// 1. Add Realm & Single-Choice Primary Disc selector to Header
const oldHeaderCenter = `    <!-- 中：底板基准星宿切换 -->`;
const newHeaderCenter = `    <!-- 中左：境界与主修盘单选切换 (练气:1主2环/2次1环 | 筑基:1主3环/2次2环 | 金丹:1主4环/2次3环) -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 shadow-xs space-x-1">
        <span class="text-[10px] font-mono-sci text-slate-600 font-bold">境界:</span>
        <button onclick="setRealm('qi')" id="btn_realm_qi" class="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold font-mono-sci shadow-xs transition" title="练气期：1个大盘(2环)，其余2个小盘(1环，大小完全对齐)">练气(2/1环)</button>
        <button onclick="setRealm('foundation')" id="btn_realm_foundation" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition" title="筑基期：1个大盘(3环)，其余2个小盘(2环，大小完全对齐)">筑基(3/2环)</button>
        <button onclick="setRealm('core')" id="btn_realm_core" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition" title="金丹期：1个大盘(4环)，其余2个小盘(3环，大小完全对齐)">金丹(4/3环)</button>
      </div>
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 shadow-xs space-x-1">
        <span class="text-[10px] font-mono-sci text-slate-600 font-bold">大盘单选:</span>
        <button onclick="setSpecDisc('combat')" id="btn_spec_combat" class="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold font-mono-sci shadow-xs transition" title="将攻击盘设为大盘（环数+1），其余两盘为等大小盘">⚔️攻击盘</button>
        <button onclick="setSpecDisc('industry')" id="btn_spec_industry" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-amber-600 text-[11px] font-bold font-mono-sci transition" title="将工厂盘设为大盘（环数+1），其余两盘为等大小盘">⚙️工厂盘</button>
        <button onclick="setSpecDisc('support')" id="btn_spec_support" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-sky-600 text-[11px] font-bold font-mono-sci transition" title="将辅助盘设为大盘（环数+1），其余两盘为等大小盘">🛡️辅助盘</button>
      </div>
    </div>

    <!-- 中右：底板基准星宿切换 -->`;
baseHtml = baseHtml.replace(oldHeaderCenter, newHeaderCenter);

// Remove the old 4/6 disc mode button group in header
const modeBtnStart = baseHtml.indexOf('<!-- 盘体数量模式切换');
const scenarioStart = baseHtml.indexOf('<!-- 预设工况折叠单按钮 -->');
if (modeBtnStart !== -1 && scenarioStart !== -1) {
  baseHtml = baseHtml.substring(0, modeBtnStart) + baseHtml.substring(scenarioStart);
}

// 2. Update top-right floating tip to include 4K / Adaptive Zoom Controls
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
        <span class="flex items-center text-amber-700 font-bold"><i class="fa-solid fa-hand-pointer mr-1"></i>点一下盘心取下极核 ➔ 拖拽至它盘外圈连线</span>
        <span class="text-slate-300">|</span>
        <span class="flex items-center text-rose-600 font-bold"><i class="fa-solid fa-rotate-left mr-1"></i>右键取回</span>
        <span class="text-slate-300">|</span>
        <div class="flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          <i class="fa-solid fa-display text-sky-600 text-[10px]"></i>
          <span id="resolutionBadge" class="text-[10px] font-bold text-slate-700">4K/全屏自适应</span>
          <button onclick="adjustUserZoom(-0.1)" class="px-1.5 hover:bg-white rounded text-slate-700 font-bold border border-transparent hover:border-slate-300" title="缩小视图">-</button>
          <button onclick="resetUserZoom()" id="zoomPercentText" class="px-1 text-[10px] font-bold text-sky-700 hover:underline" title="点击重置为屏幕最佳自适应比例">100%</button>
          <button onclick="adjustUserZoom(0.1)" class="px-1.5 hover:bg-white rounded text-slate-700 font-bold border border-transparent hover:border-slate-300" title="放大视图">+</button>
        </div>
      </div>`;
baseHtml = baseHtml.replace(oldTopRightTip, newTopRightTip);

// 3. Upgrade #diskStage and SVG viewBox to 1640 x 860
baseHtml = baseHtml.replace(
  '<div id="diskStage" class="relative w-[1440px] h-[760px] shrink-0 my-auto scale-95 origin-center">',
  '<div id="diskStage" class="relative w-[1640px] h-[860px] shrink-0 my-auto origin-center transition-transform duration-150">'
);
baseHtml = baseHtml.replace(/viewBox="0 0 1440 760"/g, 'viewBox="0 0 1640 860"');

// Shift #celestialMansionsLayer to center at (390, 490)
baseHtml = baseHtml.replace(
  '<g id="celestialMansionsLayer" opacity="0.45">',
  '<g id="celestialMansionsLayer" opacity="0.45" transform="translate(-60, 20)">'
);

// Replace the static SVG disc sections inside #astrolabeVectorBg with #dynamicSvgDiscCasings
// so that all 3 discs share the exact same precision engineering blueprint style AND the two secondary discs are 100% identical in size!
const svgSec3Start = baseHtml.indexOf('<!-- ==================== 3. 【浑天主大阵 A】(中心 450, 470) ==================== -->');
const svgEndTag = baseHtml.indexOf('</svg>\n\n        <!-- ✦ 全局贯穿底板阵脉图层');
if (svgSec3Start === -1 || svgEndTag === -1) {
  throw new Error('Could not find SVG disc sections');
}
const dynamicSvgCasingsGroup = `          <!-- 动态渲染三大主盘精密浑天仪工程外框 (大盘 + 两个等大小盘，保持100%第一版黑白青工程制图表现) -->
          <g id="dynamicSvgDiscCasings"></g>
        `;
baseHtml = baseHtml.substring(0, svgSec3Start) + dynamicSvgCasingsGroup + baseHtml.substring(svgEndTag);

// 4. Replace Right Emitter, Ring DOM, and Center Hubs with the new 3-disc containers + Detached Core Drag Layer
const emitterStart = baseHtml.indexOf('<!-- ✦ 右侧始发高能发射规');
const slotsLayerStart = baseHtml.indexOf('<!-- 全局插槽 DOM 交互层');
if (emitterStart === -1 || slotsLayerStart === -1) {
  throw new Error('Could not find emitterStart / slotsLayerStart');
}

const newStageElements = `<!-- ✦ 右侧始发高能发射规 (位于主斜轴右上端 x:1542, y:188，沿 θ: 345.2° 固定向量射入辅助盘) ✦ -->
        <div id="rightEmitter" class="absolute z-30 flex items-center pointer-events-none" style="left: 1542px; top: 188px; transform: translateY(-50%);">
          <div class="flex flex-col items-end mr-2">
            <span class="text-[9px] font-mono-sci font-bold text-slate-800 bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-xs whitespace-nowrap">
              <i class="fa-solid fa-crosshairs text-sky-600 mr-1 animate-spin"></i>EMITTER 01 (始发源)
            </span>
            <span class="text-[8px] font-mono-sci text-sky-600 font-bold">FIXED VECTOR θ: 345.2° ➔</span>
          </div>
          <div class="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center pulse-emitter-modern">
            <div class="w-3 h-3 rounded-full bg-sky-400"></div>
          </div>
          <div class="w-5 h-0.5 bg-slate-900"></div>
        </div>

        <!-- ✦ 三大主盘动态同心环 DOM 容器 (盘体保持第一版黑白青精密工程制图原貌) ✦ -->
        <div id="dynamicRingsDomContainer" class="absolute inset-0 pointer-events-none" style="z-index: 2;"></div>

        <!-- ✦ 最外圈固定方位射出点图层 ✦ -->
        <div id="outerFixedNozzlesLayer" class="absolute inset-0 pointer-events-none" style="z-index: 26;"></div>

        <!-- ✦ 三大主盘可点击切换标牌 (位置随盘体半径自适应调整) ✦ -->
        <div id="discBadgeWrap_combat" onclick="setSpecDisc('combat')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-rose-50 px-3 py-1 rounded-full border border-rose-300 shadow-sm flex items-center space-x-1.5 transition" style="left: 390px; top: 730px; transform: translateX(-50%);" title="点击将【攻击盘】设为大盘(主修盘)">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span class="text-xs font-bold text-slate-900">⚔️ 攻击盘</span>
          <span id="badge_disc_combat" class="text-[10px] font-mono-sci font-bold px-1.5 rounded bg-slate-900 text-amber-300">2环·大盘</span>
        </div>

        <div id="discBadgeWrap_industry" onclick="setSpecDisc('industry')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-amber-50 px-3 py-1 rounded-full border border-amber-300 shadow-sm flex items-center space-x-1.5 transition" style="left: 890px; top: 615px; transform: translateX(-50%);" title="点击将【工厂盘】设为大盘(主修盘)">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="text-xs font-bold text-slate-900">⚙️ 工厂盘</span>
          <span id="badge_disc_industry" class="text-[10px] font-mono-sci font-bold px-1.5 rounded bg-slate-100 text-slate-600">1环·小盘</span>
        </div>

        <div id="discBadgeWrap_support" onclick="setSpecDisc('support')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-sky-50 px-3 py-1 rounded-full border border-sky-300 shadow-sm flex items-center space-x-1.5 transition" style="left: 1310px; top: 435px; transform: translateX(-50%);" title="点击将【辅助盘】设为大盘(主修盘)">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span class="text-xs font-bold text-slate-900">🛡️ 辅助盘</span>
          <span id="badge_disc_support" class="text-[10px] font-mono-sci font-bold px-1.5 rounded bg-slate-100 text-slate-600">1环·小盘</span>
        </div>

        <!-- ✦ 三大主盘中心极核基座 (点一下取下极核，然后拖拽到另外盘子的外圈插槽上即可连上导入线！) ✦ -->

        <!-- 1. 🛡️ 辅助盘中心 (1310, 250) -->
        <div id="hubSocket_support"
             onclick="handleCenterCoreClick('support', event)"
             onmousedown="handleCenterHubMouseDown('support', event)"
             class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group select-none"
             style="left: 1310px; top: 250px; transform: translate(-50%, -50%);"
             title="【🛡️ 辅助盘中心】&#10;1. 光路射入中心后，点一下即可取下中心节点&#10;2. 按住取下的中心节点拖拽到其他盘子的外圈插槽上，即可连上跨盘导入线！">
          <div class="relative w-11 h-11 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-110" id="centerCoreBox_support">
            <div class="absolute -inset-1 rounded-full border border-dashed border-sky-500/80 animate-spin" style="animation-duration: 15s;"></div>
            <i id="centerCoreIcon_support" class="fa-solid fa-gem text-sky-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.5 rounded bg-white text-[7.5px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="centerCoreBadge_support">
            <span id="centerCoreText_support">辅助中心(待射入)</span>
          </div>
        </div>

        <!-- 2. ⚙️ 工厂盘中心 (890, 430) -->
        <div id="hubSocket_industry"
             onclick="handleCenterCoreClick('industry', event)"
             onmousedown="handleCenterHubMouseDown('industry', event)"
             class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group select-none"
             style="left: 890px; top: 430px; transform: translate(-50%, -50%);"
             title="【⚙️ 工厂盘中心】&#10;1. 光路射入中心后，点一下即可取下中心节点&#10;2. 按住取下的中心节点拖拽到其他盘子的外圈插槽上，即可连上跨盘导入线！">
          <div class="relative w-11 h-11 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-110" id="centerCoreBox_industry">
            <div class="absolute -inset-1 rounded-full border border-dashed border-amber-500/80 animate-spin" style="animation-duration: 18s;"></div>
            <i id="centerCoreIcon_industry" class="fa-solid fa-gear text-amber-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.5 rounded bg-white text-[7.5px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="centerCoreBadge_industry">
            <span id="centerCoreText_industry">工厂中心(待射入)</span>
          </div>
        </div>

        <!-- 3. ⚔️ 攻击盘中心 (390, 490) -->
        <div id="hubSocket_combat"
             onclick="handleCenterCoreClick('combat', event)"
             onmousedown="handleCenterHubMouseDown('combat', event)"
             class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group select-none"
             style="left: 390px; top: 490px; transform: translate(-50%, -50%);"
             title="【⚔️ 攻击盘中心】&#10;1. 光路射入中心后，点一下即可取下中心节点&#10;2. 按住取下的中心节点拖拽到其他盘子的外圈插槽上，即可连上跨盘导入线！">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110" id="centerCoreBox_combat">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-amber-400/80 animate-spin" style="animation-duration: 20s;"></div>
            <div class="absolute -inset-0.5 rounded-full bg-amber-400/10 blur-xs"></div>
            <i id="centerCoreIcon_combat" class="fa-solid fa-khanda text-rose-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.5 rounded bg-white text-[7.5px] font-mono-sci font-bold text-amber-900 border border-amber-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="centerCoreBadge_combat">
            <span id="centerCoreText_combat">攻击中心(待射入)</span>
          </div>
        </div>

        <!-- ✦ 已取下的中心节点悬浮拖拽层 (点击盘心后在此弹出实体节点，按住直接拖拽到其他盘外圈插槽！) ✦ -->
        <div id="detachedCoresLayer" class="absolute inset-0 pointer-events-none" style="z-index: 45;"></div>

        `;

baseHtml = baseHtml.substring(0, emitterStart) + newStageElements + baseHtml.substring(slotsLayerStart);

// 5. Add the 3 Center Core Specs into CHIP_SPECS
const chipSpecsStart = `    const CHIP_SPECS = {`;
const coreSpecsToInsert = `    const CHIP_SPECS = {
      // ======================== 【三大主盘·可取下中心导光极核】(点一下盘心取下 ➔ 拖拽到其他盘最外圈插槽激活导入线) ========================
      core_support: {
        id: 'core_support',
        name: '辅助盘·中心极核',
        tier: 'CORE',
        category: 'shift',
        isCenterCore: true,
        sourceDisc: 'support',
        type: 'step',
        step: 1,
        buff: { speed: 20, stamina: 25 },
        buffDesc: '【跨盘导入源】引接🛡️辅助盘外圈射出点激光！身法+20% 灵力+25%',
        stepDesc: '导入后顺时针 +1 格',
        shape: 'rounded-full',
        matClass: 'bg-sky-600 text-white border-2 border-amber-300 shadow-lg ring-2 ring-sky-400',
        icon: 'fa-gem',
        tag: '蓝盘中心核'
      },
      core_industry: {
        id: 'core_industry',
        name: '工厂盘·中心极核',
        tier: 'CORE',
        category: 'shift',
        isCenterCore: true,
        sourceDisc: 'industry',
        type: 'step',
        step: 1,
        buff: { craft_speed: 35, mining_speed: 35 },
        buffDesc: '【跨盘导入源】引接⚙️工厂盘外圈射出点激光！制造+35% 采矿+35%',
        stepDesc: '导入后顺时针 +1 格',
        shape: 'rounded-full',
        matClass: 'bg-amber-500 text-slate-950 border-2 border-white shadow-lg ring-2 ring-amber-400',
        icon: 'fa-gear',
        tag: '黄盘中心核'
      },
      core_combat: {
        id: 'core_combat',
        name: '攻击盘·中心极核',
        tier: 'CORE',
        category: 'shift',
        isCenterCore: true,
        sourceDisc: 'combat',
        type: 'step',
        step: 1,
        buff: { atk: 45, crit: 20 },
        buffDesc: '【跨盘导入源】引接⚔️攻击盘外圈射出点激光！攻击+45% 暴击+20%',
        stepDesc: '导入后顺时针 +1 格',
        shape: 'rounded-full',
        matClass: 'bg-rose-600 text-white border-2 border-amber-300 shadow-lg ring-2 ring-rose-400',
        icon: 'fa-khanda',
        tag: '红盘中心核'
      },
`;
baseHtml = baseHtml.replace(chipSpecsStart, coreSpecsToInsert);

// 6. Simplify chip palette to 4 clear categories: 变轨 (1个), 攻击, 辅助, 工厂 (plus 全部)
const oldTabBlock = `      <!-- 构件分类筛选 Tab (全部 / 战伐 / 浮游飞剑 / 工业 / 身法 / 变轨) -->
      <div class="px-3 py-1.5 border-b border-slate-200 flex items-center space-x-1 text-[10.5px] font-mono-sci bg-slate-50/60 overflow-x-auto ficsit-scrollbar">
        <button onclick="filterPalette('all')" id="tab_all" class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0">全部</button>
        <button onclick="filterPalette('funnel')" id="tab_funnel" class="px-2 py-0.5 rounded bg-white text-amber-700 border border-amber-300 hover:border-amber-700 shrink-0 font-bold">🗡️ 浮游飞剑</button>
        <button onclick="filterPalette('combat')" id="tab_combat" class="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-slate-800 shrink-0">⚔️ 战伐</button>
        <button onclick="filterPalette('industry')" id="tab_industry" class="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-slate-800 shrink-0">🏭 工业</button>
        <button onclick="filterPalette('mobility')" id="tab_mobility" class="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-slate-800 shrink-0">👟 身法</button>
        <button onclick="filterPalette('shift')" id="tab_shift" class="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 hover:border-slate-800 shrink-0">🔺 变轨</button>
        <button onclick="filterPalette('keystone')" id="tab_keystone" class="px-2.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-400 hover:bg-amber-100 shrink-0 font-bold shadow-xs">💎 核心插件</button>
      </div>`;

const newTabBlock = `      <!-- 构件分类筛选 Tab (全部 / 攻击 / 辅助 / 工厂 / 变轨) -->
      <div class="px-3 py-1.5 border-b border-slate-200 flex items-center space-x-1 text-[10.5px] font-mono-sci bg-slate-50/60 overflow-x-auto ficsit-scrollbar">
        <button onclick="filterPalette('all')" id="tab_all" class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0 shadow-xs">全部</button>
        <button onclick="filterPalette('combat')" id="tab_combat" class="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 hover:border-rose-600 shrink-0 font-bold">⚔️ 攻击</button>
        <button onclick="filterPalette('support')" id="tab_support" class="px-2 py-0.5 rounded bg-white text-amber-700 border border-amber-200 hover:border-amber-600 shrink-0 font-bold">🛡️ 辅助</button>
        <button onclick="filterPalette('industry')" id="tab_industry" class="px-2 py-0.5 rounded bg-white text-sky-700 border border-sky-200 hover:border-sky-600 shrink-0 font-bold">⚙️ 工厂</button>
        <button onclick="filterPalette('shift')" id="tab_shift" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 hover:border-slate-800 shrink-0 font-bold">🔺 变轨</button>
      </div>`;

baseHtml = baseHtml.replace(oldTabBlock, newTabBlock);

const oldFilterPalette = `    let CURRENT_PALETTE_FILTER = 'all';

    function filterPalette(filterKey) {
      CURRENT_PALETTE_FILTER = filterKey;
      ['all', 's1', 's2', 's3', 's5', 's8', 'shift', 'keystone', 'funnel', 'combat', 'industry', 'mobility'].forEach(key => {
        const tab = document.getElementById(\`tab_\${key}\`);
        if (!tab) return;
        if (key === filterKey) {
          tab.className = 'px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0 shadow-xs';
        } else {
          tab.className = 'px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200 hover:border-slate-800 shrink-0';
        }
      });
      renderPalette();
    }`;

const newFilterPalette = `    function getChipTypeCategory(spec) {
      if (!spec) return 'other';
      if (spec.type === 'shift_in' || spec.id === 'chip_triangle_in') return 'shift';
      const b = spec.buff || {};
      if (b.atk || b.atspd || b.crit || b.sword_funnel || spec.category === 'funnel') return 'combat';
      if (spec.category === 'mobility' || b.def || b.hp || b.speed || b.stamina || b.flight_battery || b.inventory) return 'support';
      if (spec.category === 'industry' || b.craft_speed || b.mining_speed || b.burn_speed || b.belt_speed || b.power_cut || b.pollute_cut) return 'industry';
      return 'combat';
    }
    window.getChipTypeCategory = getChipTypeCategory;

    let CURRENT_PALETTE_FILTER = 'all';

    function filterPalette(filterKey) {
      CURRENT_PALETTE_FILTER = filterKey;
      const tabStyles = {
        all: { active: 'bg-slate-900 text-white shadow-xs', inactive: 'bg-white text-slate-700 border border-slate-200 hover:border-slate-800' },
        combat: { active: 'bg-rose-600 text-white shadow-xs', inactive: 'bg-white text-rose-700 border border-rose-200 hover:border-rose-600' },
        support: { active: 'bg-amber-600 text-white shadow-xs', inactive: 'bg-white text-amber-700 border border-amber-200 hover:border-amber-600' },
        industry: { active: 'bg-sky-600 text-white shadow-xs', inactive: 'bg-white text-sky-700 border border-sky-200 hover:border-sky-600' },
        shift: { active: 'bg-slate-800 text-white shadow-xs', inactive: 'bg-white text-slate-700 border border-slate-200 hover:border-slate-800' }
      };
      Object.keys(tabStyles).forEach(key => {
        const tab = document.getElementById(\`tab_\${key}\`);
        if (!tab) return;
        const isAct = (key === filterKey);
        tab.className = \`px-2 py-0.5 rounded font-bold shrink-0 transition-colors \${isAct ? tabStyles[key].active : tabStyles[key].inactive}\`;
      });
      renderPalette();
    }`;

baseHtml = baseHtml.replace(oldFilterPalette, newFilterPalette);

const oldRenderPaletteKeys = `      const keys = Object.keys(CHIP_SPECS).filter(k => !k.startsWith('chip_atk_') && !k.startsWith('chip_def_') && !k.startsWith('chip_belt_') && !k.startsWith('chip_herb_'));

      let filteredKeys = keys;
      if (CURRENT_PALETTE_FILTER === 's1') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].step === 1 && CHIP_SPECS[k].type === 'step');
      } else if (CURRENT_PALETTE_FILTER === 's2') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].step === 2 && CHIP_SPECS[k].type === 'step');
      } else if (CURRENT_PALETTE_FILTER === 's3') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].step === 3 && CHIP_SPECS[k].type === 'step');
      } else if (CURRENT_PALETTE_FILTER === 's5') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].step === 5 && CHIP_SPECS[k].type === 'step');
      } else if (CURRENT_PALETTE_FILTER === 's8') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].step === 8 && CHIP_SPECS[k].type === 'step');
      } else if (CURRENT_PALETTE_FILTER === 'shift') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].type === 'shift_in');
      } else if (CURRENT_PALETTE_FILTER === 'funnel') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'funnel');
      } else if (CURRENT_PALETTE_FILTER === 'combat') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'combat');
      } else if (CURRENT_PALETTE_FILTER === 'industry') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'industry');
      } else if (CURRENT_PALETTE_FILTER === 'mobility') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'mobility');
      }`;

const newRenderPaletteKeys = `      const keys = Object.keys(CHIP_SPECS).filter(k => 
        !CHIP_SPECS[k].isCenterCore && 
        !(typeof getChipEquippedSlotLabel === 'function' && getChipEquippedSlotLabel(k)) && 
        !k.startsWith('chip_atk_') && 
        !k.startsWith('chip_def_') && 
        !k.startsWith('chip_belt_') && 
        !k.startsWith('chip_herb_')
      );

      let filteredKeys = keys;
      if (CURRENT_PALETTE_FILTER !== 'all') {
        filteredKeys = keys.filter(k => getChipTypeCategory(CHIP_SPECS[k]) === CURRENT_PALETTE_FILTER);
      }

      if (filteredKeys.length === 0) {
        container.innerHTML = \`
          <div class="py-8 text-center text-slate-400 font-mono-sci text-xs">
            <i class="fa-solid fa-box-open text-2xl mb-2 text-slate-300"></i>
            <div>该分类构件已全部装配至盘面</div>
            <div class="text-[10px] text-slate-400 mt-1">从盘面取下构件即可在此自动归位</div>
          </div>
        \`;
        return;
      }`;

baseHtml = baseHtml.replace(oldRenderPaletteKeys, newRenderPaletteKeys);

// Apply center icon color styling in left palette
baseHtml = baseHtml.replace(
  `<i class="fa-solid \${spec.icon} text-sm"></i>`,
  `<i class="fa-solid \${spec.icon} text-sm" style="\${typeof getChipCenterIconStyle === 'function' ? getChipCenterIconStyle(spec) : ''}"></i>`
);

// Clarify that the shift mirror is a reusable routing tool that can be placed multiple times
baseHtml = baseHtml.replace(
  `const stepBadge = spec.type === 'step' ? \`+\${spec.step}格\` : '变轨规';`,
  `const stepBadge = spec.type === 'step' ? \`+\${spec.step}格\` : '变轨规 · 无限放置';`
);

baseHtml = baseHtml.replace(
  `"stepDesc": "折射光流至相邻内圈",`,
  `"stepDesc": "折射光流至相邻内圈 (可无限次多次放置)",`
);

// Elevate floorCrossContainer to z-index: 15 (above ring lines z-index: 2, below chips z-index: 20) so the 58px golden star pedestals sit cleanly on the rings and protrude around the 32px chips
baseHtml = baseHtml.replace(
  `<div id="floorCrossContainer" class="absolute inset-0 pointer-events-none transition-all duration-300" style="z-index: 1;">`,
  `<div id="floorCrossContainer" class="absolute inset-0 pointer-events-none transition-all duration-300" style="z-index: 15;">`
);

// Show constellation guide lines on hover over the floor shape button bar
baseHtml = baseHtml.replace(
  `<div class="flex items-center space-x-1" id="floorShapeButtonGroup">`,
  `<div class="flex items-center space-x-1" id="floorShapeButtonGroup" onmouseenter="if(window.setConstellationGuideVisible)setConstellationGuideVisible(true);" onmouseleave="if(window.setConstellationGuideVisible)setConstellationGuideVisible(false);">`
);

// Upgrade scenario preset dropdown menu with the 3-Act Factory Simulation Presets
const oldDropdownBlock = `<button onclick="loadScenario('multi_disc_overdrive'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-crown text-amber-500"></i>
            <span>最优解工况 (全盘通电)</span>
          </button>
          <button onclick="loadScenario('outer_chain'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-700 transition">
            <i class="fa-solid fa-circle-notch text-sky-600"></i>
            <span>8-5-3 阶梯闭环</span>
          </button>`;

const newDropdownBlock = `<button onclick="loadScenario('multi_disc_overdrive'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-crown text-amber-500 w-4 text-center"></i>
            <span>练气 攻击强化</span>
          </button>
          <button onclick="loadScenario('act1_qi_pioneer'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-50 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-trowel-bricks text-amber-600 w-4 text-center"></i>
            <span>练气 基建加速</span>
          </button>
          <button onclick="loadScenario('act2_foundation_power'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-bolt text-emerald-600 w-4 text-center"></i>
            <span>筑基 节能稳电</span>
          </button>
          <button onclick="loadScenario('act3_core_factory'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-industry text-sky-600 w-4 text-center"></i>
            <span>金丹 极致产能</span>
          </button>
          <button onclick="loadScenario('act3_core_swords'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-jet-fighter-up text-rose-600 w-4 text-center"></i>
            <span>金丹 飞剑输出</span>
          </button>
          <button onclick="loadScenario('act3_core_roam'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-50 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-wind text-purple-600 w-4 text-center"></i>
            <span>金丹 移速续航</span>
          </button>
          <button onclick="loadScenario('outer_chain'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-600 transition border-t border-slate-100 mt-1 pt-1.5">
            <i class="fa-solid fa-hand-pointer text-sky-500 w-4 text-center"></i>
            <span>手动连线测试</span>
          </button>`;

baseHtml = baseHtml.replace(oldDropdownBlock, newDropdownBlock);
baseHtml = baseHtml.replace('w-52 bg-white/95', 'w-64 bg-white/95');

// Terminology Standardization: 玩家防御, 玩家气血(血量), 气血芯片
baseHtml = baseHtml.replace(/<span>阵法防御:<\/span>/g, '<span>玩家防御:</span>');
baseHtml = baseHtml.replace(/<span>灵脉气血:<\/span>/g, '<span>玩家气血(血量):</span>');
baseHtml = baseHtml.replace(/"name": "生命芯片 · 中级"/g, '"name": "气血芯片 · 中级"');
baseHtml = baseHtml.replace(/"tag": "生命 · 3格"/g, '"tag": "气血 · 3格"');
baseHtml = baseHtml.replace(/"buffDesc": "灵脉气血 \+10%"/g, '"buffDesc": "玩家血量 +10%"');
baseHtml = baseHtml.replace(/"name": "生命芯片 · 高级"/g, '"name": "气血芯片 · 高级"');
baseHtml = baseHtml.replace(/"tag": "生命 · 5格"/g, '"tag": "气血 · 5格"');
baseHtml = baseHtml.replace(/"buffDesc": "灵脉气血 \+20%"/g, '"buffDesc": "玩家血量 +20%"');
baseHtml = baseHtml.replace(/"buffDesc": "阵法防御 \+8%"/g, '"buffDesc": "玩家防御 +8%"');
baseHtml = baseHtml.replace(/"buffDesc": "阵法防御 \+10%"/g, '"buffDesc": "玩家防御 +10%"');
baseHtml = baseHtml.replace(/"buffDesc": "阵法防御 \+20%"/g, '"buffDesc": "玩家防御 +20%"');
baseHtml = baseHtml.replace(/"buffDesc": "阵法防御 \+50% · 最大气血 \+50%"/g, '"buffDesc": "玩家防御 +50% · 玩家血量 +50%"');

// Update updatePanels badge & title in baseHtml to reflect realm constellation variants
baseHtml = baseHtml.replace(
  'if (badgeEl) badgeEl.textContent = floorDef.name;',
  'if (badgeEl) badgeEl.textContent = `${floorDef.name} · ${floorDef.variantName ? floorDef.variantName.split("·")[0].trim() : "全阵"}`;'
);
baseHtml = baseHtml.replace(
  'if (titleEl) titleEl.textContent = `星象插槽：${hitStarsSet.size} / ${totalConstellationSlots}`;',
  'if (titleEl) titleEl.textContent = `星象插槽：${hitStarsSet.size} / ${totalConstellationSlots} (${floorDef.variantName ? floorDef.variantName.split("·")[0].trim() : "本阶"})`;'
);

baseHtml = baseHtml.replace(
  `          <!-- 状态提示条 -->
          <div id="constellationStatusBox" class="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono-sci flex items-center justify-between transition-all">
            <div class="flex items-center space-x-2">
              <span id="constellationIcon" class="text-base">○</span>
              <div>
                <div class="font-bold text-slate-900" id="constellationTitle">星象插槽：0 / 7</div>
                <div class="text-[10px] text-slate-500" id="constellationHint">全部满足后激活 ×1.2 倍全属性</div>
              </div>
            </div>
            <div id="constellationMultPill" class="text-xs font-black font-mono-sci px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              x1.0
            </div>
          </div>`,
  `          <!-- 流派取舍共鸣提示条 -->
          <div id="constellationStatusBox" class="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono-sci flex items-center justify-between transition-all shadow-xs">
            <div class="flex items-center space-x-2">
              <span id="constellationIcon" class="text-base">○</span>
              <div>
                <div class="font-bold text-slate-900" id="constellationTitle">散落星芒（未成流派）</div>
                <div class="text-[10px] text-slate-500" id="constellationHint">选择【斗魁·杀伐】或【斗柄·基建】，点亮2~3星即触发流派质变！</div>
              </div>
            </div>
            <div id="constellationMultPill" class="text-xs font-black font-mono-sci px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              未共鸣
            </div>
          </div>
          <!-- 斗魁/斗柄两系取舍进度指示条 -->
          <div class="grid grid-cols-3 gap-1 pt-1 text-[10px] font-mono-sci">
            <div id="constellationCombatBox" class="p-1.5 rounded-lg bg-rose-50/70 border border-rose-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span class="text-rose-700 font-bold text-[9.5px]"><i class="fa-solid fa-shield-halved mr-0.5"></i>红盘·战斗</span>
              <span id="constellationCombatVal" class="font-bold text-slate-800 text-[11px] mt-0.5">0/3</span>
            </div>
            <div id="constellationIndustryBox" class="p-1.5 rounded-lg bg-amber-50/70 border border-amber-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span class="text-amber-700 font-bold text-[9.5px]"><i class="fa-solid fa-gear mr-0.5"></i>黄盘·工厂</span>
              <span id="constellationIndustryVal" class="font-bold text-slate-800 text-[11px] mt-0.5">0/2</span>
            </div>
            <div id="constellationSupportBox" class="p-1.5 rounded-lg bg-sky-50/70 border border-sky-200 flex flex-col items-center justify-center text-center shadow-2xs">
              <span class="text-sky-700 font-bold text-[9.5px]"><i class="fa-solid fa-wind mr-0.5"></i>蓝盘·辅助</span>
              <span id="constellationSupportVal" class="font-bold text-slate-800 text-[11px] mt-0.5">0/2</span>
            </div>
          </div>
          <!-- 兼容旧脚本引用 -->
          <span id="constellationDoukuiVal" class="hidden">0/3</span>
          <span id="constellationDoubingVal" class="hidden">0/3</span>`
);

// Replace entire updatePanels constellation logic with Doukui/Doubing branch resonance
const oldUpdatePanelsBlockStart = baseHtml.indexOf('function updatePanels(');
const oldUpdatePanelsBlockEnd = baseHtml.indexOf('// 更新盘面 4 个核位的激活光晕', oldUpdatePanelsBlockStart);

if (oldUpdatePanelsBlockStart !== -1 && oldUpdatePanelsBlockEnd !== -1) {
  const newUpdatePanelsConstellation = `function updatePanels(chainNodes, totalBuff, constellationMultiplier, isCrossActive, logSteps, hitStarsSet = new Set(), activeKeystones = [], resonanceData = null, hitCombatHits = [], hitInfraHits = []) {
      const rightTag = document.getElementById('rightChainStatusTag');
      const countPill = document.getElementById('statActiveCountPill');

      if (countPill) countPill.textContent = \`\${chainNodes.length} 个构件生效\`;

      const floorDef = FLOOR_SHAPE_DEFS[CURRENT_FLOOR_SHAPE] || FLOOR_SHAPE_DEFS.dipper;
      const totalFloorNodes = (floorDef && floorDef.nodes) ? floorDef.nodes : [];
      const totalCombatSlots = totalFloorNodes.filter(n => n.disc === 'combat').length;
      const totalIndustrySlots = totalFloorNodes.filter(n => n.disc === 'industry').length;
      const totalSupportSlots = totalFloorNodes.filter(n => n.disc === 'support').length;

      const hitCombatCount = totalFloorNodes.filter(n => n.disc === 'combat' && hitStarsSet.has(n.id)).length;
      const hitIndustryCount = totalFloorNodes.filter(n => n.disc === 'industry' && hitStarsSet.has(n.id)).length;
      const hitSupportCount = totalFloorNodes.filter(n => n.disc === 'support' && hitStarsSet.has(n.id)).length;

      // 更新底盘名称与境界徽章
      const badgeEl = document.getElementById('constellationBadge');
      const titleEl = document.getElementById('constellationTitle');
      const hintEl = document.getElementById('constellationHint');
      const iconEl = document.getElementById('constellationIcon');
      const boxEl = document.getElementById('constellationStatusBox');
      const pillEl = document.getElementById('constellationMultPill');
      const combatValEl = document.getElementById('constellationCombatVal');
      const industryValEl = document.getElementById('constellationIndustryVal');
      const supportValEl = document.getElementById('constellationSupportVal');

      if (badgeEl) badgeEl.textContent = \`\${floorDef.name} · \${floorDef.variantName ? floorDef.variantName.split('·')[0].trim() : (totalFloorNodes.length + '槽')}\`;

      if (combatValEl) {
        combatValEl.textContent = \`\${hitCombatCount} / \${totalCombatSlots}\${hitCombatCount >= 2 ? ' ★' : ''}\`;
        combatValEl.className = hitCombatCount >= 2 ? 'font-black text-rose-600 text-[11px] mt-0.5' : 'font-bold text-slate-800 text-[11px] mt-0.5';
      }
      if (industryValEl) {
        industryValEl.textContent = \`\${hitIndustryCount} / \${totalIndustrySlots}\${hitIndustryCount >= 2 ? ' ★' : ''}\`;
        industryValEl.className = hitIndustryCount >= 2 ? 'font-black text-amber-600 text-[11px] mt-0.5' : 'font-bold text-slate-800 text-[11px] mt-0.5';
      }
      if (supportValEl) {
        supportValEl.textContent = \`\${hitSupportCount} / \${totalSupportSlots}\${hitSupportCount >= 1 ? ' ★' : ''}\`;
        supportValEl.className = hitSupportCount >= 1 ? 'font-black text-sky-600 text-[11px] mt-0.5' : 'font-bold text-slate-800 text-[11px] mt-0.5';
      }

      if (resonanceData && resonanceData.tier > 0) {
        if (iconEl) iconEl.textContent = resonanceData.icon;
        if (titleEl) titleEl.textContent = resonanceData.title;
        if (hintEl) {
          hintEl.textContent = resonanceData.hint;
          hintEl.className = 'text-[10px] text-slate-700 font-bold';
        }
        if (boxEl) boxEl.className = \`p-2.5 rounded-lg text-xs font-mono-sci flex items-center justify-between transition-all \${resonanceData.boxClass}\`;
        if (pillEl) {
          pillEl.textContent = resonanceData.badge;
          pillEl.className = \`text-xs font-black font-mono-sci px-2 py-1 rounded transition-all \${resonanceData.pillClass}\`;
        }
        if (rightTag) {
          rightTag.textContent = resonanceData.badge;
          rightTag.className = \`text-[9.5px] px-2 py-0.5 rounded font-mono-sci font-bold \${resonanceData.tier === 2 ? (resonanceData.group === 'combat' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white') : 'bg-slate-800 text-white'}\`;
        }
      } else {
        if (iconEl) iconEl.textContent = '○';
        if (titleEl) titleEl.textContent = \`散落星位 (已连通 \${hitStarsSet.size} / \${totalFloorNodes.length} 星)\`;
        if (hintEl) {
          hintEl.textContent = '不可全选！在【红盘·攻击】与【黄盘·基建】间取舍，连通半数以上即触发共鸣！';
          hintEl.className = 'text-[10px] text-slate-500';
        }
        if (boxEl) boxEl.className = 'p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono-sci flex items-center justify-between';
        if (pillEl) {
          pillEl.textContent = '未共鸣';
          pillEl.className = 'text-xs font-black font-mono-sci px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200';
        }
        if (rightTag) {
          rightTag.textContent = chainNodes.length > 0 ? '流转中' : '等待连线';
          rightTag.className = 'text-[9.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono-sci font-bold';
        }
      }

      `;
baseHtml = baseHtml.substring(0, oldUpdatePanelsBlockStart) + newUpdatePanelsConstellation + baseHtml.substring(oldUpdatePanelsBlockEnd);
}

baseHtml = baseHtml.replace(
  `<marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#00f0ff" />
            </marker>`,
  `<marker id="arrowhead-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#00f0ff" />
            </marker>
            <marker id="arrowhead-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#f43f5e" />
            </marker>
            <marker id="arrowhead-yellow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
            </marker>`
);

const pDrawBeamStart = baseHtml.indexOf("function drawBeamLine(svgGroup, x1, y1, x2, y2, colorType = 'cyan', showArrow = true) {");
const pDrawRingStart = baseHtml.indexOf("function drawRingArc(svgGroup, ringId, fromSlot, toSlot, colorType = 'cyan') {");
const pSec89Marker = baseHtml.indexOf("/* =========================================================================\n       8.9 底板基准系统");

if (pDrawBeamStart !== -1 && pDrawRingStart !== -1 && pSec89Marker !== -1) {
  baseHtml = baseHtml.substring(0, pDrawBeamStart) + `function drawBeamLine(svgGroup, x1, y1, x2, y2, colorType = 'blue', showArrow = true) {
      // 依盘色分流：红盘用红线，黄盘用黄线，蓝盘用蓝线
      const isRed = colorType === 'red' || colorType === 'rose';
      const isYellow = colorType === 'yellow' || colorType === 'gold' || colorType === 'slingshot';
      
      const glowColor = isRed ? '#f43f5e' : (isYellow ? '#facc15' : '#00f0ff');
      const coreColor = isRed ? '#e11d48' : (isYellow ? '#d97706' : '#0284c7');
      const arrowId = isRed ? 'arrowhead-red' : (isYellow ? 'arrowhead-yellow' : 'arrowhead-blue');

      // 底层高亮光晕
      const bloomLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      bloomLine.setAttribute('x1', x1);
      bloomLine.setAttribute('y1', y1);
      bloomLine.setAttribute('x2', x2);
      bloomLine.setAttribute('y2', x2 === x1 && y2 === y1 ? y2 + 0.1 : y2);
      bloomLine.setAttribute('stroke', glowColor);
      bloomLine.setAttribute('stroke-width', '4.5');
      bloomLine.setAttribute('stroke-linecap', 'round');
      bloomLine.setAttribute('opacity', '0.65');
      bloomLine.setAttribute('style', 'filter: drop-shadow(0 0 6px ' + glowColor + ');');

      // 顶层实体能量光束
      const coreLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      coreLine.setAttribute('x1', x1);
      coreLine.setAttribute('y1', y1);
      coreLine.setAttribute('x2', x2);
      coreLine.setAttribute('y2', y2);
      coreLine.setAttribute('stroke', coreColor);
      coreLine.setAttribute('stroke-width', '2.2');
      coreLine.setAttribute('stroke-linecap', 'round');
      coreLine.setAttribute('stroke-dasharray', '8 4');
      if (showArrow) coreLine.setAttribute('marker-end', 'url(#' + arrowId + ')');

      svgGroup.appendChild(bloomLine);
      svgGroup.appendChild(coreLine);
    }

    function drawImpactSpark(svgGroup, x, y, color = '#0f172a', r = 4.5) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', color || '#0f172a');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '1.8');
      circle.setAttribute('style', 'filter: drop-shadow(0 0 4px ' + (color || '#00f0ff') + ');');
      svgGroup.appendChild(circle);
    }

    ` + `function drawRingArc(svgGroup, ringId, fromSlot, toSlot, colorType = 'blue') {
      const ring = DISK_RINGS[ringId];
      if (!ring) return;
      const startPos = getSlotWorldPos(ringId, fromSlot);
      const endPos = getSlotWorldPos(ringId, toSlot);

      const slotStep = (toSlot - fromSlot + ring.slotCount) % ring.slotCount;
      const arcDeg = slotStep * (360 / ring.slotCount);
      const largeArc = arcDeg > 180 ? 1 : 0;
      const pathData = 'M ' + startPos.x + ' ' + startPos.y + ' A ' + ring.radius + ' ' + ring.radius + ' 0 ' + largeArc + ' 1 ' + endPos.x + ' ' + endPos.y;

      // 依盘色分流：红盘用红线，黄盘用黄线，蓝盘用蓝线
      const isRed = colorType === 'red' || colorType === 'rose' || (ringId && ringId.startsWith('combat'));
      const isYellow = colorType === 'yellow' || colorType === 'gold' || (ringId && ringId.startsWith('industry'));
      
      const glowColor = isRed ? '#f43f5e' : (isYellow ? '#facc15' : '#00f0ff');
      const coreColor = isRed ? '#e11d48' : (isYellow ? '#d97706' : '#0284c7');
      const arrowId = isRed ? 'arrowhead-red' : (isYellow ? 'arrowhead-yellow' : 'arrowhead-blue');
      const badgeBg = isRed ? '#ffe4e6' : (isYellow ? '#fef3c7' : '#e0f2fe');
      const badgeText = isRed ? '#9f1239' : (isYellow ? '#92400e' : '#0369a1');
      const badgeBorder = isRed ? '#f43f5e' : (isYellow ? '#f59e0b' : '#0284c7');

      // 1. 高亮外层耀目光晕 (红盘红光，黄盘黄光，蓝盘蓝光)
      const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glowPath.setAttribute('d', pathData);
      glowPath.setAttribute('fill', 'none');
      glowPath.setAttribute('stroke', glowColor);
      glowPath.setAttribute('stroke-width', '4.5');
      glowPath.setAttribute('stroke-linecap', 'round');
      glowPath.setAttribute('opacity', '0.75');
      glowPath.setAttribute('style', 'filter: drop-shadow(0 0 6px ' + glowColor + ');');
      svgGroup.appendChild(glowPath);

      // 2. 内层高能量核心光束
      const corePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      corePath.setAttribute('d', pathData);
      corePath.setAttribute('fill', 'none');
      corePath.setAttribute('stroke', coreColor);
      corePath.setAttribute('stroke-width', '2.2');
      corePath.setAttribute('stroke-linecap', 'round');
      corePath.setAttribute('stroke-dasharray', '8 4');
      corePath.setAttribute('marker-end', 'url(#' + arrowId + ')');
      svgGroup.appendChild(corePath);

      // 3. 步数轨迹浮动气泡
      const startDeg = ((-90 + fromSlot * (360 / ring.slotCount) + ring.currentAngle + 360) % 360);
      const midDeg = (startDeg + arcDeg / 2) * Math.PI / 180;
      const midX = ring.cx + ring.radius * Math.cos(midDeg);
      const midY = ring.cy + ring.radius * Math.sin(midDeg);

      const badgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      badgeGroup.setAttribute('transform', 'translate(' + midX + ', ' + midY + ')');

      const badgeBgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      badgeBgRect.setAttribute('x', '-11');
      badgeBgRect.setAttribute('y', '-7');
      badgeBgRect.setAttribute('width', '22');
      badgeBgRect.setAttribute('height', '14');
      badgeBgRect.setAttribute('rx', '4');
      badgeBgRect.setAttribute('fill', badgeBg);
      badgeBgRect.setAttribute('stroke', badgeBorder);
      badgeBgRect.setAttribute('stroke-width', '1');
      badgeBgRect.setAttribute('opacity', '0.95');

      const badgeTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      badgeTxt.setAttribute('x', '0');
      badgeTxt.setAttribute('y', '3');
      badgeTxt.setAttribute('text-anchor', 'middle');
      badgeTxt.setAttribute('fill', badgeText);
      badgeTxt.setAttribute('font-size', '9px');
      badgeTxt.setAttribute('font-weight', 'bold');
      badgeTxt.setAttribute('font-family', 'ui-monospace, monospace');
      badgeTxt.textContent = '+' + slotStep;

      badgeGroup.appendChild(badgeBgRect);
      badgeGroup.appendChild(badgeTxt);
      svgGroup.appendChild(badgeGroup);
    }

    ` + baseHtml.substring(pSec89Marker);
}

fs.writeFileSync('scratch/temp_part1.html', baseHtml);
console.log('Saved updated scratch/temp_part1.html');
