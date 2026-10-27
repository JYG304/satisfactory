const fs = require('fs');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Replace the entire <header ...> ... </header> block
const headerRegex = /<header class="h-16 bg-white\/95[\s\S]*?<\/header>/;

const newHeader = `<header class="h-16 bg-white/95 border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs backdrop-blur-md">
    
    <!-- 左：纯净标题「中央处理器」 -->
    <div class="flex items-center space-x-3.5">
      <div class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-700">
        <i class="fa-solid fa-microchip text-lg text-sky-400"></i>
      </div>
      <div class="flex items-center space-x-2.5">
        <h1 class="text-base font-black tracking-widest text-slate-900 font-cinzel">
          中央处理器
        </h1>
        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300 font-mono-sci font-bold">
          MAIN ARRAY PROCESSOR
        </span>
      </div>
    </div>

    <!-- 中：底板基准星宿切换 -->
    <div class="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 shadow-xs space-x-3">
      <span class="text-[11px] font-mono-sci text-slate-600 font-bold uppercase tracking-wider flex items-center">
        <i class="fa-solid fa-shapes mr-1.5 text-slate-800"></i>底盘星象:
      </span>
      <div class="flex items-center space-x-1" id="floorShapeButtonGroup">
        <button onclick="switchFloorShape('dipper')" id="btn_shape_dipper" class="px-2.5 py-1 rounded bg-slate-900 border border-slate-900 text-white text-[11px] font-bold font-mono-sci shadow-xs" title="北斗七星天衡阵 (2.5x 狂暴星宿)">
          <i class="fa-solid fa-star mr-1 text-amber-300"></i>北斗七星
        </button>
        <button onclick="switchFloorShape('southern_dipper')" id="btn_shape_southern_dipper" class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-[11px] font-bold font-mono-sci" title="南斗六司延寿阵 (2.4x 生生长生)">
          <i class="fa-solid fa-leaf mr-1 text-emerald-600"></i>南斗六司
        </button>
        <button onclick="switchFloorShape('ziwei')" id="btn_shape_ziwei" class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-[11px] font-bold font-mono-sci" title="紫微帝垣万剑阵 (3.0x 万剑归宗)">
          <i class="fa-solid fa-crown mr-1 text-amber-500"></i>紫微万剑
        </button>
        <button onclick="switchFloorShape('four_symbols')" id="btn_shape_four_symbols" class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-[11px] font-bold font-mono-sci" title="二十八宿四象阵 (2.2x 聚灵工厂)">
          <i class="fa-solid fa-shield-halved mr-1 text-sky-600"></i>四象四极
        </button>
        <button onclick="switchFloorShape('nine_luminaries')" id="btn_shape_nine_luminaries" class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-[11px] font-bold font-mono-sci" title="九曜日月行天阵 (2.6x 阴阳调和)">
          <i class="fa-solid fa-sun mr-1 text-orange-500"></i>九曜日月
        </button>
        <button onclick="switchFloorShape('thunder_matrix')" id="btn_shape_thunder_matrix" class="px-2.5 py-1 rounded bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-[11px] font-bold font-mono-sci" title="天罡雷劫破虚阵 (2.8x 渡劫爆发)">
          <i class="fa-solid fa-bolt mr-1 text-purple-600"></i>天罡雷劫
        </button>
      </div>
    </div>

    <!-- 右：模式切换 + 预设工况折叠单按钮 + 清空 -->
    <div class="flex items-center space-x-2.5 shrink-0">
      
      <!-- 模式切换：益智解谜 / 自由装配 -->
      <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300 text-xs font-mono-sci font-bold">
        <button id="btnModePuzzle" onclick="setAppMode('puzzle')" class="px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs border border-slate-200 flex items-center space-x-1 font-bold transition">
          <i class="fa-solid fa-puzzle-piece text-amber-500"></i>
          <span>天机解谜</span>
        </button>
        <button id="btnModeSandbox" onclick="setAppMode('sandbox')" class="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 flex items-center space-x-1 transition">
          <i class="fa-solid fa-compass-drafting text-slate-500"></i>
          <span>自由装配</span>
        </button>
      </div>

      <!-- 预设工况折叠单按钮 -->
      <div class="relative" id="scenarioDropdownContainer">
        <button id="btnScenarioDropdown" onclick="toggleScenarioDropdown(event)" class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 transition shadow-xs flex items-center space-x-1.5" title="点击展开工况预设列表">
          <i class="fa-solid fa-sliders text-sky-600"></i>
          <span>工况预设 ▾</span>
        </button>
        <div id="scenarioDropdownMenu" class="hidden absolute right-0 top-full mt-1.5 w-52 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1">
          <div class="px-2.5 py-1 text-[10px] font-mono-sci font-bold text-slate-400 uppercase tracking-wider">
            标准工况预设
          </div>
          <button onclick="loadScenario('multi_disc_overdrive'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-800 transition">
            <i class="fa-solid fa-crown text-amber-500"></i>
            <span>最优解工况 (全盘通电)</span>
          </button>
          <button onclick="loadScenario('outer_chain'); toggleScenarioDropdown();" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 flex items-center space-x-2 font-bold text-slate-700 transition">
            <i class="fa-solid fa-circle-notch text-sky-600"></i>
            <span>8-5-3 阶梯闭环</span>
          </button>
        </div>
      </div>

      <!-- 清空盘面 -->
      <button onclick="clearBoard()" class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-xs font-bold text-slate-600 hover:text-rose-600 transition" title="清空盘面所有构件">
        <i class="fa-solid fa-trash-can"></i>
      </button>

    </div>

  </header>`;

content = content.replace(headerRegex, newHeader);

// 2. Remove CHASSIS MATRIX text watermark in renderFloorBase
content = content.replace(
  /<text x="350" y="615" font-family="'Share Tech Mono', monospace" font-size="8\.5" fill="#64748b" text-anchor="middle" letter-spacing="1\.5">[\s\S]*?<\/text>/,
  ''
);

// 3. Clean up the messy slot ring labels on the discs
content = content.replace(/C1: 调频外圈 \(6槽\)/g, '辰光外环·6槽');
content = content.replace(/C2: 领频内圈 \(4槽\)/g, '辰光内环·4槽');
content = content.replace(/SUB 02 - OUTER 8-CELL/g, '浑仪动力外环·8槽');
content = content.replace(/INNER 4-CELL/g, '动力内环·4槽');
content = content.replace(/TERM 04 - VACUUM 6-CELL/g, '终极释能·6槽');

// 4. In updatePanels, ensure evaluatePuzzleGoals is called on every update
content = content.replace(
  /function updatePanels\(chainNodes, totalBuff, crossNodesCount, isCrossActive, logSteps, hitStarsSet = new Set\(\), activeKeystones = \[\]\) \{/,
  `function updatePanels(chainNodes, totalBuff, crossNodesCount, isCrossActive, logSteps, hitStarsSet = new Set(), activeKeystones = []) {
      // 触发益智解谜关卡目标评估
      if (typeof evaluatePuzzleGoals === 'function') {
        const c1Align = getApertureAlignment(DISK_RINGS.sub_c1, 1210, 160, 48, 345.2, 1380, 115);
        const chainRings = new Set(chainNodes.map(n => n.ring));
        evaluatePuzzleGoals({
          chainNodes,
          chainRings,
          hitFloorNodes: hitStarsSet,
          finalMultiplier: crossNodesCount || 1.0,
          crossActivated: isCrossActive,
          activeKeystones,
          isC1Aligned: c1Align ? Math.abs(c1Align.diff) <= 18.0 : false
        });
      }`
);

// 5. In onMouseUp for ring dragging, call onPlayerActionMove
content = content.replace(
  /if \(hasMoved\) audio\.playRotate\(\);/,
  `if (hasMoved) { audio.playRotate(); onPlayerActionMove(); }`
);

// In handleRightClickChip, call onPlayerActionMove
content = content.replace(
  /delete BOARD_SLOTS\[slotKey\];/,
  `delete BOARD_SLOTS[slotKey];\n        onPlayerActionMove();`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('fix_all.js applied successfully!');
