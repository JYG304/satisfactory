const fs = require('fs');

const layoutHtml = `
  <!-- 侧边栏折叠浮动按键 -->
  <button id="btnOpenLeft" onclick="toggleLeftPanel()" class="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-300 hover:border-sky-500 text-slate-800 py-4 px-2.5 rounded-r-2xl shadow-xl flex flex-col items-center space-y-2 text-xs font-mono-sci font-bold transition group" title="展开/收起芯片库">
    <i class="fa-solid fa-microchip text-sky-600 group-hover:scale-125 transition-transform"></i>
    <span class="text-[10px] tracking-widest text-slate-700" style="writing-mode: vertical-rl;">芯片库</span>
    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400"></i>
  </button>

  <button id="btnOpenRight" onclick="toggleRightPanel()" class="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-300 hover:border-amber-500 text-slate-800 py-4 px-2.5 rounded-l-2xl shadow-xl flex flex-col items-center space-y-2 text-xs font-mono-sci font-bold transition group" title="展开/收起动力看板">
    <i class="fa-solid fa-bolt text-amber-500 group-hover:scale-125 transition-transform"></i>
    <span class="text-[10px] tracking-widest text-slate-700" style="writing-mode: vertical-rl;">动力看板</span>
    <i class="fa-solid fa-chevron-left text-[10px] text-slate-400"></i>
  </button>

  <!-- 顶部导航栏 (清爽工程白色) -->
  <header class="h-16 bg-white/95 border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs backdrop-blur-md">
    
    <!-- 左：纯净标题 -->
    <div class="flex items-center space-x-3.5">
      <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-700">
        <i class="fa-solid fa-circle-nodes text-lg text-sky-400"></i>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <h1 class="text-base font-black tracking-widest text-slate-900 font-cinzel">
            中央处理器
          </h1>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-300 font-mono-sci font-bold">
            三大主盘系统
          </span>
        </div>
        <p class="text-[10px] text-slate-500 font-mono-sci">攻击盘 · 工厂盘 · 辅助盘</p>
      </div>
    </div>

    <!-- 中：境界选择 & 主特化盘单选 -->
    <div class="flex items-center space-x-4">
      <!-- 境界切换 -->
      <div class="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 space-x-1 text-xs font-bold shadow-inner">
        <span class="text-[10px] text-slate-500 px-2 font-mono-sci">境界:</span>
        <button onclick="setRealm('qi')" id="btn_realm_qi" class="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono-sci shadow-xs transition" title="练气期：最大1个2环，其余2个1环">
          练气期 <span class="text-[10px] text-sky-300 font-normal">(主2环/次1环)</span>
        </button>
        <button onclick="setRealm('foundation')" id="btn_realm_foundation" class="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition border border-slate-200" title="筑基期：最大1个3环，其余2个2环">
          筑基期 <span class="text-[10px] text-amber-600 font-normal">(主3环/次2环)</span>
        </button>
        <button onclick="setRealm('core')" id="btn_realm_core" class="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition border border-slate-200" title="金丹期：最大1个4环，其余2个3环">
          金丹期 <span class="text-[10px] text-purple-600 font-normal">(主4环/次3环)</span>
        </button>
      </div>

      <!-- 主特化盘单选 -->
      <div class="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 space-x-1 text-xs font-bold shadow-inner">
        <span class="text-[10px] text-slate-500 px-2 font-mono-sci">主修特化:</span>
        <button onclick="setSpecialization('combat')" id="btn_spec_combat" class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono-sci shadow-xs transition flex items-center space-x-1.5" title="主修攻击盘：攻击盘享有当前境界最大环数">
          <i class="fa-solid fa-swords text-xs"></i>
          <span>主修攻击盘</span>
        </button>
        <button onclick="setSpecialization('industry')" id="btn_spec_industry" class="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-amber-700 font-mono-sci transition border border-slate-200 flex items-center space-x-1.5" title="主修工厂盘：工厂盘享有当前境界最大环数">
          <i class="fa-solid fa-industry text-xs"></i>
          <span>主修工厂盘</span>
        </button>
        <button onclick="setSpecialization('support')" id="btn_spec_support" class="px-2.5 py-1 rounded-lg bg-white text-slate-700 hover:text-sky-700 font-mono-sci transition border border-slate-200 flex items-center space-x-1.5" title="主修辅助盘：辅助盘享有当前境界最大环数">
          <i class="fa-solid fa-shield-halved text-xs"></i>
          <span>主修辅助盘</span>
        </button>
      </div>
    </div>

    <!-- 右：重置角度 + 清空 -->
    <div class="flex items-center space-x-2 shrink-0">
      <button onclick="resetAllRotations()" class="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition shadow-xs flex items-center space-x-1.5" title="重置各环旋转角度为 0°">
        <i class="fa-solid fa-compass text-slate-500"></i>
        <span>重置角度</span>
      </button>

      <button onclick="clearBoard()" class="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-400 text-xs font-bold text-slate-700 hover:text-rose-600 transition shadow-xs flex items-center space-x-1.5" title="清空盘面所有芯片">
        <i class="fa-solid fa-trash-can"></i>
        <span>清空</span>
      </button>
    </div>

  </header>

  <!-- 主体区域 -->
  <main class="flex-1 flex overflow-hidden relative">
    
    <!-- 左侧构件库 (纯白工程风) -->
    <aside id="leftPanel" class="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 shadow-lg collapsible-sidebar collapsed">
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-shapes text-sky-600 text-sm"></i>
          <span class="text-xs font-bold text-slate-800 tracking-wider font-mono-sci uppercase">芯片与构件库</span>
        </div>
        <button onclick="toggleLeftPanel()" class="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- 分类标签 -->
      <div class="p-2 border-b border-slate-200 flex items-center space-x-1 overflow-x-auto text-[11px] font-mono-sci no-scrollbar">
        <button onclick="filterPalette('all')" id="tab_all" class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0">全部</button>
        <button onclick="filterPalette('combat')" id="tab_combat" class="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 hover:border-rose-500 shrink-0 font-bold">⚔️ 战斗</button>
        <button onclick="filterPalette('industry')" id="tab_industry" class="px-2 py-0.5 rounded bg-white text-amber-700 border border-amber-200 hover:border-amber-500 shrink-0 font-bold">⚙️ 工业</button>
        <button onclick="filterPalette('mobility')" id="tab_mobility" class="px-2 py-0.5 rounded bg-white text-sky-700 border border-sky-200 hover:border-sky-500 shrink-0 font-bold">🛡️ 辅助</button>
        <button onclick="filterPalette('shift')" id="tab_shift" class="px-2 py-0.5 rounded bg-white text-purple-700 border border-purple-200 hover:border-purple-500 shrink-0 font-bold">🪞 变轨</button>
        <button onclick="filterPalette('keystone')" id="tab_keystone" class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 shrink-0 font-bold">💎 核心</button>
      </div>

      <!-- 芯片列表容器 -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2" id="paletteListContainer"></div>
    </aside>

    <!-- 中间：交互舞台 (白色工程制图底纹) -->
    <section class="flex-1 relative flex flex-col items-center justify-center overflow-hidden blueprint-canvas" id="astrolabeStageSection">
      
      <!-- 点选装配状态悬浮条 -->
      <div id="quickPlacementBanner" class="hidden absolute top-4 left-6 z-30 flex items-center space-x-3 bg-slate-900/95 text-white px-4 py-1.5 rounded-xl text-xs font-mono-sci shadow-xl border border-sky-400 backdrop-blur-md">
        <span class="text-sky-300 font-bold flex items-center"><i class="fa-solid fa-crosshairs mr-1.5 text-sky-400 animate-spin"></i>已选构件：</span>
        <span id="quickPlacementChipName" class="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"></span>
        <span class="text-slate-300 text-[11px]">👉 点击任意插槽即可秒速放置</span>
        <button onclick="cancelPaletteSelection()" class="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-600 transition">取消 (Esc)</button>
      </div>

      <!-- 操作小贴士 -->
      <div class="absolute top-4 right-6 z-20 flex items-center space-x-3 bg-white/95 border border-slate-300 px-4 py-1.5 rounded-xl text-xs text-slate-700 font-mono-sci shadow-sm backdrop-blur">
        <span class="flex items-center text-sky-700 font-bold"><i class="fa-solid fa-arrow-left mr-1.5"></i>激光始发自右侧辅助盘</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-slate-900 font-bold"><i class="fa-solid fa-hand-pointer mr-1.5 text-sky-600"></i>点击/拖拽安装</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-slate-600"><i class="fa-solid fa-rotate-left mr-1"></i>按住圆盘直接旋转</span>
      </div>

      <!-- 1440x760 交互舞台 -->
      <div id="diskStage" class="relative w-[1440px] h-[760px] shrink-0 my-auto scale-95 origin-center">
        
        <!-- 背景矢量绘图层 (三盘工程轮廓) -->
        <svg id="astrolabeVectorBg" class="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 760">
          <!-- 静态导轨连接线 (辅助盘 ➔ 工厂盘 ➔ 攻击盘) -->
          <line x1="880" y1="520" x2="560" y2="520" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />
          <line x1="510" y1="410" x2="610" y2="330" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4 4" />

          <!-- 1. 顶部：攻击盘背景 (cx: 720, cy: 220, R=165) -->
          <circle cx="720" cy="220" r="168" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 3" fill="#fff1f2" fill-opacity="0.25"/>

          <!-- 2. 左下：工厂盘背景 (cx: 400, cy: 520, R=165) -->
          <circle cx="400" cy="520" r="168" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3" fill="#fffbeb" fill-opacity="0.25"/>

          <!-- 3. 右下：辅助盘背景 (cx: 1040, cy: 520, R=165) -->
          <circle cx="1040" cy="520" r="168" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4 3" fill="#f0f9ff" fill-opacity="0.25"/>
        </svg>

        <!-- 三大盘醒目状态卡片 (点击可直接设为主修盘) -->
        <!-- 攻击盘标牌 (720, 35) -->
        <div class="absolute z-20 flex flex-col items-center cursor-pointer pointer-events-auto" style="left: 720px; top: 32px; transform: translateX(-50%);" onclick="setSpecialization('combat')" title="点击将攻击盘设为主修盘">
          <div class="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-rose-300 shadow-sm hover:shadow transition">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span class="text-xs font-black text-rose-700">⚔️ 攻击盘</span>
            <span id="badge_combat_status" class="text-[9px] font-mono-sci font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800">2环 · 主修</span>
          </div>
        </div>

        <!-- 工厂盘标牌 (400, 700) -->
        <div class="absolute z-20 flex flex-col items-center cursor-pointer pointer-events-auto" style="left: 400px; top: 698px; transform: translateX(-50%);" onclick="setSpecialization('industry')" title="点击将工厂盘设为主修盘">
          <div class="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-amber-300 shadow-sm hover:shadow transition">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span class="text-xs font-black text-amber-700">⚙️ 工厂盘</span>
            <span id="badge_industry_status" class="text-[9px] font-mono-sci font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">1环 · 次级</span>
          </div>
        </div>

        <!-- 辅助盘标牌 (1040, 700) -->
        <div class="absolute z-20 flex flex-col items-center cursor-pointer pointer-events-auto" style="left: 1040px; top: 698px; transform: translateX(-50%);" onclick="setSpecialization('support')" title="点击将辅助盘设为主修盘">
          <div class="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-sky-300 shadow-sm hover:shadow transition">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span class="text-xs font-black text-sky-700">🛡️ 辅助盘</span>
            <span id="badge_support_status" class="text-[9px] font-mono-sci font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">1环 · 次级</span>
          </div>
        </div>

        <!-- 始发激光源 (右侧 x: 1380, y: 520) -->
        <div id="rightEmitter" class="absolute z-30 flex items-center pointer-events-none" style="left: 1380px; top: 520px; transform: translateY(-50%);">
          <div class="flex flex-col items-end mr-2">
            <span class="text-[9px] font-mono-sci font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-300 shadow-sm whitespace-nowrap">
              <i class="fa-solid fa-crosshairs text-sky-600 mr-1 animate-spin"></i>EMITTER 01 (始发源)
            </span>
            <span class="text-[8px] font-mono-sci text-sky-600 font-bold">180° WEST ➔</span>
          </div>
          <div class="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center pulse-emitter-modern">
            <div class="w-3 h-3 rounded-full bg-sky-400"></div>
          </div>
          <div class="w-6 h-0.5 bg-slate-900 shadow"></div>
        </div>

        <!-- ✦ 核心极核插槽 (三大盘心) ✦ -->
        <!-- 攻击盘极核 (720, 220) -->
        <div id="hubSocket_combat" onclick="openKeystoneSelector('combat')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 720px; top: 220px; transform: translate(-50%, -50%);" title="【攻击极核插槽】点击配置核心特质插件">
          <div class="relative w-11 h-11 rounded-full bg-white border-2 border-rose-500 flex items-center justify-center shadow-md transition-transform group-hover:scale-115">
            <div class="absolute -inset-1 rounded-full border border-dashed border-rose-400/80 animate-spin" style="animation-duration: 18s;"></div>
            <i id="crossCoreIcon_combat" class="fa-solid fa-swords text-rose-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-rose-900 border border-rose-400 shadow-xs flex items-center space-x-1" id="crossCoreBadge_combat">
            <i class="fa-solid fa-plus text-[7px] text-rose-500"></i>
            <span id="crossCoreNameText_combat">攻击极核</span>
          </div>
        </div>

        <!-- 工厂盘极核 (400, 520) -->
        <div id="hubSocket_industry" onclick="openKeystoneSelector('industry')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 400px; top: 520px; transform: translate(-50%, -50%);" title="【工厂极核插槽】点击配置核心特质插件">
          <div class="relative w-11 h-11 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-md transition-transform group-hover:scale-115">
            <div class="absolute -inset-1 rounded-full border border-dashed border-amber-400/80 animate-spin" style="animation-duration: 20s;"></div>
            <i id="crossCoreIcon_industry" class="fa-solid fa-industry text-amber-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-amber-900 border border-amber-400 shadow-xs flex items-center space-x-1" id="crossCoreBadge_industry">
            <i class="fa-solid fa-plus text-[7px] text-amber-500"></i>
            <span id="crossCoreNameText_industry">工厂极核</span>
          </div>
        </div>

        <!-- 辅助盘极核 (1040, 520) -->
        <div id="hubSocket_support" onclick="openKeystoneSelector('support')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1040px; top: 520px; transform: translate(-50%, -50%);" title="【辅助极核插槽】点击配置核心特质插件">
          <div class="relative w-11 h-11 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center shadow-md transition-transform group-hover:scale-115">
            <div class="absolute -inset-1 rounded-full border border-dashed border-sky-400/80 animate-spin" style="animation-duration: 22s;"></div>
            <i id="crossCoreIcon_support" class="fa-solid fa-shield-halved text-sky-600 text-sm relative z-10"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-sky-900 border border-sky-400 shadow-xs flex items-center space-x-1" id="crossCoreBadge_support">
            <i class="fa-solid fa-plus text-[7px] text-sky-500"></i>
            <span id="crossCoreNameText_support">辅助极核</span>
          </div>
        </div>

        <!-- ✦ 最外围固定方位射出点组件层 ✦ -->
        <div id="fixedEmissionPortsLayer" class="absolute inset-0 pointer-events-none z-25"></div>

        <!-- 动态圆盘 DOM 环体 -->
        <div id="ringsDomLayer" class="absolute inset-0 pointer-events-none z-10"></div>

        <!-- 全局插槽 DOM 交互层 -->
        <div id="slotsLayer" class="absolute inset-0 w-full h-full z-20 pointer-events-auto"></div>

        <!-- 全局高能光束与跳格弧线 SVG 绘制层 -->
        <svg id="opticalSvgLayer" class="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style="z-index: 25;" viewBox="0 0 1440 760">
          <g id="svgBeamsGroup"></g>
          <g id="svgImpactsGroup"></g>
          <g id="svgBridgeGroup"></g>
        </svg>

      </div>

    </section>

    <!-- 右侧：动力加成看板 (清爽白卡) -->
    <aside id="rightPanel" class="w-80 bg-white border-l border-slate-200 flex flex-col z-20 shrink-0 shadow-lg collapsible-sidebar collapsed">
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-chart-line text-amber-500 text-sm"></i>
          <span class="text-xs font-bold text-slate-800 tracking-wider font-mono-sci uppercase">三大阵盘 · 动力看板</span>
        </div>
        <button onclick="toggleRightPanel()" class="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition">
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        
        <!-- 三盘联动贯通状态卡 -->
        <div class="p-3.5 rounded-xl border transition-all" id="triResonanceCard">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold flex items-center text-slate-800">
              <i class="fa-solid fa-circle-nodes mr-1.5 text-sky-600"></i>三盘贯通联动状态
            </span>
            <span id="triResonanceBadge" class="text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-slate-100 text-slate-600">
              待导通
            </span>
          </div>
          <p id="triResonanceDesc" class="text-[10px] text-slate-500 leading-relaxed">
            激光自辅助盘射入，经外圈固定射出点贯通工厂盘与攻击盘，全盘属性享 <b>×1.5倍</b> 终极加成。
          </p>
        </div>

        <!-- 1. 攻击盘属性统计 -->
        <div class="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-rose-950 flex items-center">
              <i class="fa-solid fa-swords text-rose-600 mr-1.5"></i>攻击盘总加成
            </span>
            <span id="combatActiveSlotCount" class="text-[9px] font-mono-sci bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
              0 槽激活
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono-sci">
            <div class="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">攻击加成</div>
              <div id="stat_atk" class="text-rose-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">暴击率</div>
              <div id="stat_crit" class="text-rose-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">穿透破甲</div>
              <div id="stat_penetration" class="text-rose-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-rose-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">巡航飞剑</div>
              <div id="stat_sword_funnel" class="text-rose-600 font-bold text-sm">+0把</div>
            </div>
          </div>
        </div>

        <!-- 2. 工厂盘属性统计 -->
        <div class="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-950 flex items-center">
              <i class="fa-solid fa-industry text-amber-600 mr-1.5"></i>工厂盘总加成
            </span>
            <span id="industryActiveSlotCount" class="text-[9px] font-mono-sci bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
              0 槽激活
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono-sci">
            <div class="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">制造速度</div>
              <div id="stat_craft_speed" class="text-amber-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">开采增效</div>
              <div id="stat_mining_speed" class="text-amber-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">能耗减免</div>
              <div id="stat_power_cut" class="text-amber-600 font-bold text-sm">-0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-amber-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">传送带速</div>
              <div id="stat_belt_speed" class="text-amber-600 font-bold text-sm">+0%</div>
            </div>
          </div>
        </div>

        <!-- 3. 辅助盘属性统计 -->
        <div class="p-3 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-sky-950 flex items-center">
              <i class="fa-solid fa-shield-halved text-sky-600 mr-1.5"></i>辅助盘总加成
            </span>
            <span id="supportActiveSlotCount" class="text-[9px] font-mono-sci bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold">
              0 槽激活
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono-sci">
            <div class="p-2 bg-white rounded-lg border border-sky-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">防御提升</div>
              <div id="stat_def" class="text-sky-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-sky-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">移动速度</div>
              <div id="stat_speed" class="text-sky-600 font-bold text-sm">+0%</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-sky-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">气血生命</div>
              <div id="stat_hp" class="text-sky-600 font-bold text-sm">+0</div>
            </div>
            <div class="p-2 bg-white rounded-lg border border-sky-100 shadow-xs">
              <div class="text-slate-500 text-[9px]">飞行电池</div>
              <div id="stat_flight_battery" class="text-sky-600 font-bold text-sm">+0%</div>
            </div>
          </div>
        </div>

        <!-- 导通日志 -->
        <div class="p-3 rounded-xl bg-slate-900 text-slate-100 text-[10px] font-mono-sci space-y-1">
          <div class="text-slate-400 font-bold mb-1 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>● 光路导通状态</span>
            <span id="logStepCount">0 节点</span>
          </div>
          <div id="beamLogList" class="space-y-1 max-h-40 overflow-y-auto pr-1"></div>
        </div>

      </div>
    </aside>

  </main>
`;

fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/white_part2.html', layoutHtml, 'utf8');
console.log('White part 2 generated');
