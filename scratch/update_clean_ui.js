const fs = require('fs');
const path = require('path');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

console.log('Original content length:', content.length);

// 1. Update Title tag
content = content.replace(
  /<title>CYCLICAL · 天工周天折射灵枢 \(极简浑天仪工程制图版\)<\/title>/,
  '<title>中央处理器 · 灵枢阵盘工程系统</title>'
);

// 2. Clean up Header
// Replace header with clean "中央处理器", remove subtitle, remove topCrossStatusBadge, collapse preset scenario into dropdown button
const oldHeaderRegex = /<!-- ======================== 顶栏：极简瑞士制图风顶栏 ======================== -->[\s\S]*?<\/header>/;

const newHeader = `<!-- ======================== 顶栏：中央处理器 极简工程顶栏 ======================== -->
  <header class="h-16 bg-white/95 border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs backdrop-blur-md">
    
    <!-- 左：纯净标题「中央处理器」 -->
    <div class="flex items-center space-x-3.5">
      <div class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-700">
        <i class="fa-solid fa-microchip text-lg text-sky-400"></i>
      </div>
      <div class="flex items-center space-x-2.5">
        <h1 class="text-lg font-black tracking-widest text-slate-900 font-cinzel">
          中央处理器
        </h1>
        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-300 font-mono-sci font-bold">
          MAIN PROCESSOR
        </span>
      </div>
    </div>

    <!-- 中：底板基准星宿切换 -->
    <div class="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-1.5 shadow-xs space-x-3">
      <span class="text-[11px] font-mono-sci text-slate-600 font-bold uppercase tracking-wider flex items-center">
        <i class="fa-solid fa-shapes mr-1.5 text-slate-800"></i>底板基准星宿:
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

    <!-- 右：模式切换 + 预设工况折叠按钮 + 清空 -->
    <div class="flex items-center space-x-2.5 shrink-0">
      
      <!-- 模式切换：益智试炼 / 自由沙盒 -->
      <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300 text-xs font-mono-sci font-bold">
        <button id="btnModePuzzle" onclick="setAppMode('puzzle')" class="px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs border border-slate-200 flex items-center space-x-1 transition">
          <i class="fa-solid fa-puzzle-piece text-amber-500"></i>
          <span>天机解谜</span>
        </button>
        <button id="btnModeSandbox" onclick="setAppMode('sandbox')" class="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 flex items-center space-x-1 transition">
          <i class="fa-solid fa-compass-drafting text-slate-500"></i>
          <span>自由装配</span>
        </button>
      </div>

      <!-- 预设工况折叠下拉菜单 -->
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

content = content.replace(oldHeaderRegex, newHeader);

// 3. Remove the two top-left bars: ORBIT SYNC and 插槽视界
// Replace them with the elegant Puzzle Trial Card (天机解谜·灵枢试炼)
const oldBarsRegex = /<!-- 环旋转微调变速齿轮[\s\S]*?<!-- 操作小贴士浮窗 -->/;

const newPuzzleCardAndTips = `<!-- ======================== 左上：天机解谜 · 灵枢试炼益智挑战面板 ======================== -->
      <div id="puzzleChallengeCard" class="absolute top-4 left-6 z-20 w-80 bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-lg p-3 transition-all duration-300">
        
        <!-- 卡片顶栏：关卡切换与重置 -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <div class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span class="text-xs font-black font-cinzel text-slate-900 tracking-wider">天机残局试炼</span>
            <span id="puzzleLevelBadge" class="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono-sci font-bold">第 1/5 关</span>
          </div>
          <div class="flex items-center space-x-1">
            <button onclick="prevPuzzleLevel()" class="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs" title="上一关">◀</button>
            <button onclick="nextPuzzleLevel()" class="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs" title="下一关">▶</button>
            <button onclick="resetPuzzleLevel()" class="w-6 h-6 rounded flex items-center justify-center text-rose-500 hover:text-rose-700 hover:bg-rose-50 text-xs ml-1" title="重置当前关卡"><i class="fa-solid fa-rotate-left"></i></button>
            <button onclick="togglePuzzleCollapse()" class="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs" title="折叠/展开试炼面板"><i id="puzzleCollapseIcon" class="fa-solid fa-chevron-up"></i></button>
          </div>
        </div>

        <!-- 试炼内容体 (可折叠) -->
        <div id="puzzleBody" class="pt-2.5 space-y-2">
          <div>
            <h4 id="puzzleTitleText" class="text-xs font-black text-slate-900 font-mono-sci">第一关 · 两仪贯通</h4>
            <p id="puzzleDescText" class="text-[11px] text-slate-500 leading-snug mt-0.5">
              高能灵光初生，转动辰光表盘C使始发光束准直入射，并安放步进构件，将光流引向动力盘B。
            </p>
          </div>

          <!-- 关卡达成目标清单 -->
          <div id="puzzleGoalList" class="bg-slate-50/80 rounded-lg p-2 border border-slate-200/80 space-y-1.5 text-[11px] font-mono-sci">
            <!-- 动态生成目标列表 -->
          </div>

          <!-- 步数指示与过关评价徽章 -->
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10.5px] font-mono-sci">
            <span class="text-slate-500">操作步数: <b id="puzzleMoveCounter" class="text-slate-900 font-bold">0</b> / <span id="puzzleBudgetVal">4</span></span>
            <div id="puzzleWinBanner" class="hidden items-center text-emerald-600 font-bold space-x-1">
              <i class="fa-solid fa-circle-check text-emerald-500"></i>
              <span>试炼大成 ★★★</span>
              <button onclick="nextPuzzleLevel()" class="ml-1 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-xs hover:bg-emerald-700">下一关 ▶</button>
            </div>
          </div>
        </div>

      </div>

      <!-- 操作小贴士浮窗 -->`;

content = content.replace(oldBarsRegex, newPuzzleCardAndTips);

// 4. Clean up watermark texts in SVG
content = content.replace(/<text x="40" y="45" font-family="'Cinzel', serif" font-weight="900" font-size="16" fill="#0f172a" letter-spacing="2">CYCLICAL<\/text>/, '');
content = content.replace(/<text x="40" y="60" font-family="'Share Tech Mono', monospace" font-size="8" fill="#64748b" letter-spacing="0.5">OCCURRING IN CYCLES; RECURRENT · QUAD-ORRERY KINETIC ARRAY<\/text>/, '');
content = content.replace(/<text x="1390" y="735" font-family="'Share Tech Mono', monospace" font-size="8" fill="#94a3b8" text-anchor="end">FUTURE ENGINEERING \/\/ 2026<\/text>/, '');

// Clean up cluttered English labels on discs
content = content.replace(/<text x="735" y="414" font-family="'Share Tech Mono', monospace" font-size="7.5" fill="#64748b" text-anchor="middle">NEXUS 05 \/\/ RELAY LENS \(R=34\)<\/text>/, '<text x="735" y="414" font-family="\'Noto Serif SC\', serif" font-size="9" fill="#64748b" text-anchor="middle" font-weight="bold">太虚中元透镜</text>');
content = content.replace(/<text x="150" y="685" font-family="'Share Tech Mono', monospace" font-size="8" fill="#0f172a" font-weight="bold" text-anchor="middle">TERMINAL ORRERY 04<\/text>\s*<text x="150" y="697" font-family="'Share Tech Mono', monospace" font-size="7" fill="#64748b" text-anchor="middle">VACUUM DISSIPATION \/\/ 6-SLOT<\/text>/, '<text x="150" y="688" font-family="\'Noto Serif SC\', serif" font-size="9.5" fill="#0f172a" font-weight="bold" text-anchor="middle">终端释能盘</text>');
content = content.replace(/<text x="450" y="715" font-family="'Share Tech Mono', monospace" font-size="8.5" fill="#0f172a" font-weight="bold" text-anchor="middle">PRIMARY ORRERY 03 \/\/ TIAN 16-CELL<\/text>/, '<text x="450" y="715" font-family="\'Noto Serif SC\', serif" font-size="10" fill="#0f172a" font-weight="bold" text-anchor="middle">周天天玑主仪</text>');
content = content.replace(/<text x="960" y="395" font-family="'Share Tech Mono', monospace" font-size="8" fill="#0f172a" font-weight="bold" text-anchor="middle">SUB-DISC 02 \(动力卡尺双环\)<\/text>\s*<text x="960" y="407" font-family="'Share Tech Mono', monospace" font-size="7" fill="#64748b" text-anchor="middle">OUTER 8-SLOT \+ INNER 4-SLOT<\/text>/, '<text x="960" y="398" font-family="\'Noto Serif SC\', serif" font-size="9.5" fill="#0f172a" font-weight="bold" text-anchor="middle">浑仪动力从动盘</text>');
content = content.replace(/<text x="1210" y="235" font-family="'Share Tech Mono', monospace" font-size="8" fill="#0f172a" font-weight="bold" text-anchor="middle">CHRONO WATCH 01<\/text>\s*<text x="1210" y="247" font-family="'Share Tech Mono', monospace" font-size="7" fill="#64748b" text-anchor="middle">CONCENTRIC 6-SLOT & 4-SLOT<\/text>/, '<text x="1210" y="238" font-family="\'Noto Serif SC\', serif" font-size="9.5" fill="#0f172a" font-weight="bold" text-anchor="middle">辰光调频双表盘</text>');
content = content.replace(/<text x="250" y="212" font-family="'Share Tech Mono', monospace" font-size="7.5" fill="#0f172a" font-weight="bold" text-anchor="middle">POLAR SATELLITE \(3-SLOT\)<\/text>/, '<text x="250" y="212" font-family="\'Noto Serif SC\', serif" font-size="9" fill="#0f172a" font-weight="bold" text-anchor="middle">极轨探天副盘</text>');

// Also clean up orbit header badges
content = content.replace(/<div class="absolute -top-3 left-1\/2 -translate-x-1\/2 text-\[9px\] font-mono-sci text-slate-800 font-bold tracking-wider bg-white px-2 rounded border border-slate-300 shadow-xs">ORBIT 01 · TIAN 16-CELL<\/div>/, '<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono-sci text-slate-800 font-bold tracking-wider bg-white px-2 rounded border border-slate-300 shadow-xs">天元外环 · 16宿</div>');
content = content.replace(/<div class="absolute -top-3 left-1\/2 -translate-x-1\/2 text-\[8\.5px\] font-mono-sci text-slate-700 font-bold tracking-wider bg-white px-1\.5 rounded border border-slate-300 shadow-xs">ORBIT 02 · DI 10-CELL<\/div>/, '<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-[8.5px] font-mono-sci text-slate-700 font-bold tracking-wider bg-white px-1.5 rounded border border-slate-300 shadow-xs">地元中环 · 10宿</div>');
content = content.replace(/<div class="absolute -top-3 left-1\/2 -translate-x-1\/2 text-\[8\.5px\] font-mono-sci text-slate-700 font-bold tracking-wider bg-white px-1\.5 rounded border border-slate-300 shadow-xs">ORBIT 03 · REN 6-CELL<\/div>/, '<div class="absolute -top-3 left-1/2 -translate-x-1/2 text-[8.5px] font-mono-sci text-slate-700 font-bold tracking-wider bg-white px-1.5 rounded border border-slate-300 shadow-xs">人元内环 · 6宿</div>');

// 5. Enhance Background Graphic in astrolabeVectorBg
// Add Xianxia Twenty-Eight Mansions and Bagua astrolabe graphics
const bgDecorations = `
          <!-- ==================== 0. 修仙天文星宿玄鉴工程背景图层 ==================== -->
          <g id="celestialMansionsLayer" opacity="0.45">
            <!-- 浑天周天大星盘外圈 (R=330, R=310, R=290) -->
            <circle cx="450" cy="470" r="330" stroke="#64748b" stroke-width="0.8" stroke-dasharray="2 3" fill="none" />
            <circle cx="450" cy="470" r="310" stroke="#0f172a" stroke-width="1.2" fill="none" opacity="0.6" />
            <circle cx="450" cy="470" r="290" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="4 2" fill="none" />

            <!-- 先天八卦微雕方位 (乾坤震巽坎离艮兑) -->
            <g font-family="'Noto Serif SC', serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle" dominant-baseline="central">
              <text x="450" y="145">☰ 乾</text>
              <text x="680" y="240">☱ 兑</text>
              <text x="775" y="470">☲ 离</text>
              <text x="680" y="700">☳ 震</text>
              <text x="450" y="795">☴ 巽</text>
              <text x="220" y="700">☵ 坎</text>
              <text x="125" y="470">☶ 艮</text>
              <text x="220" y="240">☷ 坤</text>
            </g>

            <!-- 二十八星宿微刻刻度弧与宿名 (角亢氐房心尾箕 斗牛女虚危室壁 奎娄胃昴毕觜参 井鬼柳星张翼轸) -->
            <g font-family="'Noto Serif SC', serif" font-size="8" fill="#64748b" text-anchor="middle">
              <!-- 东方青龙七宿 -->
              <text x="740" y="380">角宿</text><text x="755" y="415">亢宿</text><text x="760" y="450">氐宿</text>
              <text x="758" y="490">房宿</text><text x="748" y="525">心宿</text><text x="730" y="558">尾宿</text><text x="705" y="590">箕宿</text>
              <!-- 北方玄武七宿 -->
              <text x="670" y="625">斗宿</text><text x="630" y="655">牛宿</text><text x="585" y="680">女宿</text>
              <text x="535" y="695">虚宿</text><text x="485" y="700">危宿</text><text x="435" y="695">室宿</text><text x="385" y="680">壁宿</text>
              <!-- 西方白虎七宿 -->
              <text x="340" y="655">奎宿</text><text x="300" y="625">娄宿</text><text x="268" y="590">胃宿</text>
              <text x="245" y="555">昴宿</text><text x="232" y="515">毕宿</text><text x="230" y="475">觜宿</text><text x="238" y="435">参宿</text>
              <!-- 南方朱雀七宿 -->
              <text x="255" y="395">井宿</text><text x="280" y="360">鬼宿</text><text x="315" y="330">柳宿</text>
              <text x="355" y="305">星宿</text><text x="400" y="290">张宿</text><text x="450" y="285">翼宿</text><text x="500" y="290">轸宿</text>
            </g>

            <!-- 24节气刻度与周天经纬十字轴线 -->
            <line x1="120" y1="470" x2="780" y2="470" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.6" />
            <line x1="450" y1="140" x2="450" y2="800" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.6" />
            <line x1="216" y1="236" x2="684" y2="704" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5" />
            <line x1="216" y1="704" x2="684" y2="236" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5" />

            <!-- 周天星度微刻轮齿 -->
            <circle cx="450" cy="470" r="320" stroke="#0284c7" stroke-width="0.7" stroke-dasharray="1 7" fill="none" opacity="0.4" />
          </g>
`;

content = content.replace(
  /<svg id="astrolabeVectorBg" class="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 760">\s*<defs>/,
  '<svg id="astrolabeVectorBg" class="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 760">\n<defs>'
);
content = content.replace(
  /<\/defs>\s*<!-- ==================== 5\. 【太虚中元聚光透镜环/,
  '</defs>\n' + bgDecorations + '\n<!-- ==================== 5. 【太虚中元聚光透镜环'
);

// 6. Update CSS for blueprint-canvas
content = content.replace(
  /\.blueprint-canvas \{\s*background-color: #f8fafc;\s*background-image:[\s\S]*?background-size: 20px 20px;\s*\}/,
  `.blueprint-canvas {
      background-color: #f3f6fa;
      background-image: 
        radial-gradient(circle at 450px 470px, rgba(224, 238, 255, 0.6) 0%, rgba(240, 246, 252, 0.4) 50%, rgba(220, 230, 242, 0.7) 100%),
        linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
      background-size: 100% 100%, 24px 24px, 24px 24px;
    }`
);

// 7. Inject Puzzle System JS logic before the closing script tag
const puzzleJsCode = `
    // =========================================================================
    // 【益智解谜 · 天机试炼系统】 (Lingshu Puzzle Trials)
    // =========================================================================
    let CURRENT_APP_MODE = 'puzzle'; // 'puzzle' | 'sandbox'
    let CURRENT_PUZZLE_LEVEL = 1;
    let PUZZLE_MOVE_COUNT = 0;
    let PUZZLE_COMPLETED = false;

    const PUZZLE_LEVELS = [
      {
        id: 1,
        title: "第一关 · 两仪贯通",
        desc: "始发高能光束初生。调整【辰光表盘C】角度至准直入射，并在C1槽安放步进构件，将光流经外缘准直嘴导入【动力盘B】。",
        budget: 4,
        check: (simState) => {
          const c1Aligned = simState.isC1Aligned;
          const reachedB = simState.chainRings.has('sub_b_outer') || simState.chainRings.has('sub_b_inner');
          const budgetOk = PUZZLE_MOVE_COUNT <= 4;
          return [
            { text: "始发高能光束准直射入表盘 C", pass: c1Aligned },
            { text: "经盘底暗渠导入浑仪动力盘 B", pass: reachedB },
            { text: "操作步数在预算内 (≤ 4 步)", pass: budgetOk }
          ];
        },
        init: () => {
          clearBoard(true);
          DISK_RINGS.sub_c1.currentAngle = 120;
          DISK_RINGS.sub_c2.currentAngle = 120;
          DISK_RINGS.sub_b_outer.currentAngle = 50;
        }
      },
      {
        id: 2,
        title: "第二关 · 浑天聚核",
        desc: "将光流自动力盘B经【太虚中元透镜】引流至【浑天主盘A】，并在主盘装配构件激活【天枢主核】。",
        budget: 6,
        check: (simState) => {
          const reachedMain = simState.chainRings.has('tian') || simState.chainRings.has('di') || simState.chainRings.has('ren');
          const keystoneOk = simState.activeKeystones.length >= 1;
          const budgetOk = PUZZLE_MOVE_COUNT <= 6;
          return [
            { text: "光路贯穿动力盘B与中元透镜", pass: simState.chainRings.has('disc_e') || reachedMain },
            { text: "注入浑天主盘 A 并激活核心灵石", pass: reachedMain && keystoneOk },
            { text: "操作步数在预算内 (≤ 6 步)", pass: budgetOk }
          ];
        },
        init: () => {
          clearBoard(true);
          DISK_RINGS.sub_c1.currentAngle = 27.8;
          DISK_RINGS.sub_c2.currentAngle = 27.8;
          BOARD_SLOTS['sub_c1_0'] = { chip: 'step_1' };
          DISK_RINGS.sub_b_outer.currentAngle = 155;
          KEYSTONE_SLOTS.disc_a = 'core_yang';
        }
      },
      {
        id: 3,
        title: "第三关 · 七星借道",
        desc: "利用变轨三角与步进构件，使光路在浑天大阵内经过底板【北斗七星】星宿节点，触发 2.5x 狂暴倍率加成！",
        budget: 7,
        check: (simState) => {
          const hitStars = simState.hitFloorNodes.size >= 1;
          const multOk = simState.finalMultiplier >= 2.0;
          const budgetOk = PUZZLE_MOVE_COUNT <= 7;
          return [
            { text: "光路穿透底板星宿节点 (至少1处)", pass: hitStars },
            { text: "获得星宿狂暴倍率加成 (≥ 2.0x)", pass: multOk },
            { text: "操作步数在预算内 (≤ 7 步)", pass: budgetOk }
          ];
        },
        init: () => {
          clearBoard(true);
          switchFloorShape('dipper');
          DISK_RINGS.sub_c1.currentAngle = 27.8;
          DISK_RINGS.sub_c2.currentAngle = 27.8;
          BOARD_SLOTS['sub_c1_0'] = { chip: 'step_1' };
          DISK_RINGS.sub_b_outer.currentAngle = 159.5;
          BOARD_SLOTS['sub_b_outer_3'] = { chip: 'step_2' };
        }
      },
      {
        id: 4,
        title: "第四关 · 回天自激",
        desc: "在浑天主盘的同心环之间构建折跃回路，使光路重返已走过的节点，达成闭环自持共鸣！",
        budget: 8,
        check: (simState) => {
          const loopOk = simState.crossActivated === true;
          const countOk = simState.chainNodes.length >= 4;
          const budgetOk = PUZZLE_MOVE_COUNT <= 8;
          return [
            { text: "构建回路闭环，触发自激共振", pass: loopOk },
            { text: "回路贯通构件数 ≥ 4 件", pass: countOk },
            { text: "操作步数在预算内 (≤ 8 步)", pass: budgetOk }
          ];
        },
        init: () => {
          clearBoard(true);
          loadScenario('outer_chain');
        }
      },
      {
        id: 5,
        title: "第五关 · 五方通明",
        desc: "【终极残局】将高能光束自右向左一气通贯全阵，最终注入左下角的【终极释能盘 D】！",
        budget: 12,
        check: (simState) => {
          const reachedD = simState.chainRings.has('sub_d');
          const nodesOk = simState.chainNodes.length >= 7;
          const budgetOk = PUZZLE_MOVE_COUNT <= 12;
          return [
            { text: "高能光束成功注入终极释能盘 D", pass: reachedD },
            { text: "全阵通电构件数 ≥ 7 件", pass: nodesOk },
            { text: "操作步数在预算内 (≤ 12 步)", pass: budgetOk }
          ];
        },
        init: () => {
          clearBoard(true);
          DISK_RINGS.sub_c1.currentAngle = 27.8;
          DISK_RINGS.sub_c2.currentAngle = 27.8;
          BOARD_SLOTS['sub_c1_0'] = { chip: 'step_1' };
          DISK_RINGS.sub_b_outer.currentAngle = 159.5;
        }
      }
    ];

    function setAppMode(mode) {
      CURRENT_APP_MODE = mode;
      const btnPuzzle = document.getElementById('btnModePuzzle');
      const btnSandbox = document.getElementById('btnModeSandbox');
      const card = document.getElementById('puzzleChallengeCard');

      if (mode === 'puzzle') {
        btnPuzzle.className = 'px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs border border-slate-200 flex items-center space-x-1 font-bold';
        btnSandbox.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 flex items-center space-x-1';
        if (card) card.style.display = 'block';
        loadPuzzleLevel(CURRENT_PUZZLE_LEVEL);
      } else {
        btnSandbox.className = 'px-2.5 py-1 rounded-md bg-white text-sky-700 shadow-xs border border-slate-200 flex items-center space-x-1 font-bold';
        btnPuzzle.className = 'px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 flex items-center space-x-1';
        if (card) card.style.display = 'none';
      }
      audio.playSelect();
    }

    function togglePuzzleCollapse() {
      const body = document.getElementById('puzzleBody');
      const icon = document.getElementById('puzzleCollapseIcon');
      if (!body || !icon) return;
      if (body.classList.contains('hidden')) {
        body.classList.remove('hidden');
        icon.className = 'fa-solid fa-chevron-up';
      } else {
        body.classList.add('hidden');
        icon.className = 'fa-solid fa-chevron-down';
      }
    }

    function loadPuzzleLevel(lvlIndex) {
      CURRENT_PUZZLE_LEVEL = Math.max(1, Math.min(lvlIndex, PUZZLE_LEVELS.length));
      PUZZLE_MOVE_COUNT = 0;
      PUZZLE_COMPLETED = false;
      const lvl = PUZZLE_LEVELS[CURRENT_PUZZLE_LEVEL - 1];

      document.getElementById('puzzleLevelBadge').textContent = \`第 \${CURRENT_PUZZLE_LEVEL}/\${PUZZLE_LEVELS.length} 关\`;
      document.getElementById('puzzleTitleText').textContent = lvl.title;
      document.getElementById('puzzleDescText').textContent = lvl.desc;
      document.getElementById('puzzleBudgetVal').textContent = lvl.budget;
      document.getElementById('puzzleMoveCounter').textContent = '0';
      document.getElementById('puzzleWinBanner').classList.add('hidden');
      document.getElementById('puzzleWinBanner').classList.remove('flex');

      lvl.init();
      renderBoardSlots();
      solveStepNetwork();
    }

    function prevPuzzleLevel() {
      if (CURRENT_PUZZLE_LEVEL > 1) {
        loadPuzzleLevel(CURRENT_PUZZLE_LEVEL - 1);
        audio.playSelect();
      }
    }

    function nextPuzzleLevel() {
      if (CURRENT_PUZZLE_LEVEL < PUZZLE_LEVELS.length) {
        loadPuzzleLevel(CURRENT_PUZZLE_LEVEL + 1);
        audio.playLevelUp();
      }
    }

    function resetPuzzleLevel() {
      loadPuzzleLevel(CURRENT_PUZZLE_LEVEL);
      audio.playRemove();
    }

    function onPlayerActionMove() {
      if (CURRENT_APP_MODE === 'puzzle') {
        PUZZLE_MOVE_COUNT++;
        const counter = document.getElementById('puzzleMoveCounter');
        if (counter) counter.textContent = PUZZLE_MOVE_COUNT;
      }
    }

    function evaluatePuzzleGoals(simState) {
      if (CURRENT_APP_MODE !== 'puzzle') return;
      const lvl = PUZZLE_LEVELS[CURRENT_PUZZLE_LEVEL - 1];
      if (!lvl) return;

      const goals = lvl.check(simState);
      const container = document.getElementById('puzzleGoalList');
      if (!container) return;

      let allPassed = true;
      let html = '';
      goals.forEach(g => {
        if (!g.pass) allPassed = false;
        html += \`
          <div class="flex items-center space-x-1.5 \${g.pass ? 'text-emerald-700 font-bold' : 'text-slate-600'}">
            <i class="fa-solid \${g.pass ? 'fa-circle-check text-emerald-500' : 'fa-circle-dot text-slate-300'} text-xs"></i>
            <span>\${g.text}</span>
          </div>
        \`;
      });
      container.innerHTML = html;

      const winBanner = document.getElementById('puzzleWinBanner');
      if (allPassed && !PUZZLE_COMPLETED) {
        PUZZLE_COMPLETED = true;
        if (winBanner) {
          winBanner.classList.remove('hidden');
          winBanner.classList.add('flex');
        }
        audio.playLevelUp();
      } else if (!allPassed && PUZZLE_COMPLETED) {
        PUZZLE_COMPLETED = false;
        if (winBanner) {
          winBanner.classList.add('hidden');
          winBanner.classList.remove('flex');
        }
      }
    }

    // 工况预设下拉交互
    function toggleScenarioDropdown(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('scenarioDropdownMenu');
      if (!menu) return;
      menu.classList.toggle('hidden');
    }

    document.addEventListener('click', (e) => {
      const container = document.getElementById('scenarioDropdownContainer');
      const menu = document.getElementById('scenarioDropdownMenu');
      if (container && menu && !container.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
`;

// Hook evaluatePuzzleGoals into solveStepNetwork and increment moves on disc rotate and slot placement
content = content.replace(
  /updatePanels\(chainNodes, totalBuff, finalMultiplier, crossActivated, logSteps, hitFloorNodesSet, activeKeystones\);/,
  `updatePanels(chainNodes, totalBuff, finalMultiplier, crossActivated, logSteps, hitFloorNodesSet, activeKeystones);
      // 评估益智试炼目标
      evaluatePuzzleGoals({
        chainNodes,
        chainRings,
        hitFloorNodes: hitFloorNodesSet,
        finalMultiplier,
        crossActivated,
        activeKeystones,
        isC1Aligned: Math.abs(c1Align.diff) <= 18.0
      });`
);

// Add onPlayerActionMove inside placeChip and rotate
content = content.replace(
  /BOARD_SLOTS\[slotKey\] = \{ chip: chipId \};/,
  `BOARD_SLOTS[slotKey] = { chip: chipId };\n        onPlayerActionMove();`
);

// Inject puzzle JS right before the end of the script tag
content = content.replace(
  /window\.addEventListener\('DOMContentLoaded', \(\) => \{[\s\S]*?\}\);/,
  (match) => {
    return puzzleJsCode + '\n    ' + match.replace(
      'loadScenario(\'multi_disc_overdrive\');',
      'setAppMode(\'puzzle\'); // 默认进入精选天机解谜模式，亦可一键切换自由装配'
    );
  }
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully updated optical_array_prototype.html. New length:', content.length);
