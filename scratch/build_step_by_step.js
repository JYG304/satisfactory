const fs = require('fs');

let html = fs.readFileSync('scratch/commit_9af3d23.html', 'utf8');

// ============================================================================
// 1. HEADER: Add Realm (练气/筑基/金丹) & Specialization (攻击/工厂/辅助 单选) controls
//    while keeping the original Floor Constellation bar and buttons intact
// ============================================================================
const oldHeaderMid = `    <!-- 中：底板基准星宿切换 -->`;
const newHeaderRealmAndSpec = `    <!-- 中左：境界与主修盘单选切换 (练气:1主2环/2次1环 | 筑基:1主3环/2次2环 | 金丹:1主4环/2次3环) -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 shadow-xs space-x-1">
        <span class="text-[10px] font-mono-sci text-slate-600 font-bold">境界:</span>
        <button onclick="setRealm('qi')" id="btn_realm_qi" class="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-bold font-mono-sci shadow-xs transition" title="练气期：主修盘2环，其余两盘1环">练气(2/1环)</button>
        <button onclick="setRealm('foundation')" id="btn_realm_foundation" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition" title="筑基期：主修盘3环，其余两盘2环">筑基(3/2环)</button>
        <button onclick="setRealm('core')" id="btn_realm_core" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-slate-800 text-[11px] font-bold font-mono-sci transition" title="金丹期：主修盘4环，其余两盘3环">金丹(4/3环)</button>
      </div>
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 shadow-xs space-x-1">
        <span class="text-[10px] font-mono-sci text-slate-600 font-bold">主修盘(单选):</span>
        <button onclick="setSpecDisc('combat')" id="btn_spec_combat" class="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold font-mono-sci shadow-xs transition" title="将攻击盘设为主修盘（环数+1）">⚔️攻击盘</button>
        <button onclick="setSpecDisc('industry')" id="btn_spec_industry" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-amber-600 text-[11px] font-bold font-mono-sci transition" title="将工厂盘设为主修盘（环数+1）">⚙️工厂盘</button>
        <button onclick="setSpecDisc('support')" id="btn_spec_support" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300 hover:border-sky-600 text-[11px] font-bold font-mono-sci transition" title="将辅助盘设为主修盘（环数+1）">🛡️辅助盘</button>
      </div>
    </div>

    <!-- 中右：底板基准星宿切换 -->`;

html = html.replace(oldHeaderMid, newHeaderRealmAndSpec);

// ============================================================================
// 2. SVG & STAGE: Remove floating rings (polar, sub_d, disc_e) and keep the 3 main discs
// ============================================================================
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
html = html.replace('>周天天玑主仪</text>', '>⚔️ 攻击盘 (红色节点)</text>');
html = html.replace('>浑仪动力从动盘</text>', '>⚙️ 工厂盘 (黄色节点)</text>');
html = html.replace('>辰光调频双表盘</text>', '>🛡️ 辅助盘 (蓝色节点)</text>');

// Replace static DOM rings & 5 keystone hubs with 3 Disc dynamic rings + 3 Center Hubs + Outer Fixed Nozzles
const domRingsStart = html.indexOf('<!-- ✦ 盘 4（最左端）：虚空终端释能盘 DOM 环体');
const slotsLayerIdx = html.indexOf('<!-- 全局插槽 DOM 交互层');

const newStageInnerDom = `        <!-- ✦ 三大主盘动态同心环 DOM 容器 (盘体保持第一版黑白青精密工程制图原貌) ✦ -->
        <div id="dynamicRingsDomContainer" class="absolute inset-0 pointer-events-none" style="z-index: 2;"></div>

        <!-- ✦ 最外圈固定方位射出点图层 ✦ -->
        <div id="outerFixedNozzlesLayer" class="absolute inset-0 pointer-events-none" style="z-index: 26;"></div>

        <!-- ✦ 三大主盘可点击切换标牌 ✦ -->
        <div onclick="setSpecDisc('combat')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-xs flex items-center space-x-1.5 transition" style="left: 450px; top: 722px; transform: translateX(-50%);" title="点击将【攻击盘】设为主修特化盘">
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          <span class="text-[11px] font-bold text-slate-900">⚔️ 攻击盘</span>
          <span id="badge_disc_combat" class="text-[9.5px] font-mono-sci font-bold px-1.5 rounded bg-rose-100 text-rose-700">2环·主修</span>
        </div>

        <div onclick="setSpecDisc('industry')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs flex items-center space-x-1.5 transition" style="left: 960px; top: 438px; transform: translateX(-50%);" title="点击将【工厂盘】设为主修特化盘">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span class="text-[11px] font-bold text-slate-900">⚙️ 工厂盘</span>
          <span id="badge_disc_industry" class="text-[9.5px] font-mono-sci font-bold px-1.5 rounded bg-slate-100 text-slate-600">1环·次级</span>
        </div>

        <div onclick="setSpecDisc('support')" class="absolute z-20 cursor-pointer bg-white/95 hover:bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-300 shadow-xs flex items-center space-x-1.5 transition" style="left: 1210px; top: 282px; transform: translateX(-50%);" title="点击将【辅助盘】设为主修特化盘">
          <span class="w-2 h-2 rounded-full bg-sky-500"></span>
          <span class="text-[11px] font-bold text-slate-900">🛡️ 辅助盘</span>
          <span id="badge_disc_support" class="text-[9.5px] font-mono-sci font-bold px-1.5 rounded bg-slate-100 text-slate-600">1环·次级</span>
        </div>

        <!-- ✦ 三大主盘中心极核 (当光路射入中心后可取下，放到其他盘外圈插槽里激活跨盘导入线！) ✦ -->

        <!-- 1. 🛡️ 辅助盘中心 (1210, 160) -->
        <div id="hubSocket_support" onclick="handleCenterCoreClick('support', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1210px; top: 160px; transform: translate(-50%, -50%);" title="【🛡️ 辅助盘中心】&#10;当光路射入中心后，点击可取下中心极核，放到其他盘子的外圈插槽里以激活导入线！">
          <div class="relative w-9 h-9 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-115" id="centerCoreBox_support">
            <div class="absolute -inset-1 rounded-full border border-dashed border-sky-500/80 animate-spin" style="animation-duration: 15s;"></div>
            <i id="centerCoreIcon_support" class="fa-solid fa-gem text-sky-600 text-xs relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-white text-[7px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="centerCoreBadge_support">
            <span id="centerCoreText_support">辅助中心(待射入)</span>
          </div>
        </div>

        <!-- 2. ⚙️ 工厂盘中心 (960, 280) -->
        <div id="hubSocket_industry" onclick="handleCenterCoreClick('industry', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 960px; top: 280px; transform: translate(-50%, -50%);" title="【⚙️ 工厂盘中心】&#10;当光路射入中心后，点击可取下中心极核，放到其他盘子的外圈插槽里以激活导入线！">
          <div class="relative w-10 h-10 rounded-full bg-white border-2 border-slate-800 flex items-center justify-center shadow-md transition-transform group-hover:scale-115" id="centerCoreBox_industry">
            <div class="absolute -inset-1 rounded-full border border-dashed border-amber-500/80 animate-spin" style="animation-duration: 18s;"></div>
            <i id="centerCoreIcon_industry" class="fa-solid fa-gear text-amber-600 text-xs relative z-10"></i>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-white text-[7px] font-mono-sci font-bold text-slate-800 border border-slate-400 whitespace-nowrap shadow-xs flex items-center space-x-0.5" id="centerCoreBadge_industry">
            <span id="centerCoreText_industry">工厂中心(待射入)</span>
          </div>
        </div>

        <!-- 3. ⚔️ 攻击盘中心 (450, 470) -->
        <div id="hubSocket_combat" onclick="handleCenterCoreClick('combat', event)" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 450px; top: 470px; transform: translate(-50%, -50%);" title="【⚔️ 攻击盘中心】&#10;当光路射入中心后，点击可取下中心极核，放到其他盘子的外圈插槽里以激活导入线！">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-115" id="centerCoreBox_combat">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-amber-400/80 animate-spin" style="animation-duration: 20s;"></div>
            <div class="absolute -inset-0.5 rounded-full bg-amber-400/10 blur-xs"></div>
            <i id="centerCoreIcon_combat" class="fa-solid fa-khanda text-rose-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-amber-900 border border-amber-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="centerCoreBadge_combat">
            <span id="centerCoreText_combat">攻击中心(待射入)</span>
          </div>
        </div>

`;

html = html.substring(0, domRingsStart) + newStageInnerDom + html.substring(slotsLayerIdx);

// ============================================================================
// 3. Add the 3 detachable Center Core specs into CHIP_SPECS
// ============================================================================
const coreSpecsAddon = `
  "core_support": {
    "id": "core_support",
    "sourceDisc": "support",
    "isCenterCore": true,
    "step": 1,
    "tier": 3,
    "category": "mobility",
    "name": "【辅助盘·中心导光核】",
    "tag": "导入线核心 · 步进1格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-funnel border-sky-400",
    "buff": { "speed": 25, "flight_battery": 40 },
    "buffDesc": "激活【辅助盘➔当前盘】跨盘导入线！光线由此插槽导入并顺时针步进 +1 格",
    "stepDesc": "跨盘光路导入接收器 (+1格)",
    "icon": "fa-gem",
    "textColor": "text-sky-300",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "core_industry": {
    "id": "core_industry",
    "sourceDisc": "industry",
    "isCenterCore": true,
    "step": 1,
    "tier": 3,
    "category": "industry",
    "name": "【工厂盘·中心导光核】",
    "tag": "导入线核心 · 步进1格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-belt border-amber-400",
    "buff": { "craft_speed": 35, "mining_speed": 35 },
    "buffDesc": "激活【工厂盘➔当前盘】跨盘导入线！光线由此插槽导入并顺时针步进 +1 格",
    "stepDesc": "跨盘光路导入接收器 (+1格)",
    "icon": "fa-gear",
    "textColor": "text-amber-300",
    "badgeColor": "bg-amber-50 text-amber-900 border-amber-400"
  },
  "core_combat": {
    "id": "core_combat",
    "sourceDisc": "combat",
    "isCenterCore": true,
    "step": 1,
    "tier": 3,
    "category": "combat",
    "name": "【攻击盘·中心导光核】",
    "tag": "导入线核心 · 步进1格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-rose-400",
    "buff": { "atk": 45, "crit": 25 },
    "buffDesc": "激活【攻击盘➔当前盘】跨盘导入线！光线由此插槽导入并顺时针步进 +1 格",
    "stepDesc": "跨盘光路导入接收器 (+1格)",
    "icon": "fa-khanda",
    "textColor": "text-rose-300",
    "badgeColor": "bg-rose-50 text-rose-900 border-rose-400"
  },
`;
html = html.replace('const CHIP_SPECS = {', 'const CHIP_SPECS = {' + coreSpecsAddon);

console.log('Part 1-3 prepared.');
fs.writeFileSync('scratch/temp_part1.html', html);
