const fs = require('fs');

const specsCode = fs.readFileSync('e:/UE5/修仙工厂策划案/scratch/extracted_specs.js', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>中央处理器 · 三大阵盘系统 (攻击/工厂/辅助)</title>
  
  <!-- Tailwind CSS & FontAwesome -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+SC:wght@300;400;500;700;900&family=Cinzel:wght@600;900&display=swap');

    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f1f5f9;
      color: #0f172a;
      overflow: hidden;
      user-select: none;
    }

    .font-mono-sci {
      font-family: 'Share Tech Mono', monospace;
    }

    .font-cinzel {
      font-family: 'Cinzel', serif;
    }

    .blueprint-canvas {
      background-color: #f8fafc;
      background-image: 
        linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
        linear-gradient(to right, rgba(148, 163, 184, 0.25) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148, 163, 184, 0.25) 1px, transparent 1px);
      background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px;
      background-position: -1px -1px, -1px -1px, -1px -1px, -1px -1px;
    }

    .ring-trans {
      transition: transform 0.08s linear;
      transform-origin: center center;
    }

    @keyframes pulseEmitter {
      0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px #0284c7); }
      50% { transform: scale(1.08); filter: drop-shadow(0 0 10px #00f0ff); }
    }

    .pulse-emitter-modern {
      animation: pulseEmitter 2.2s infinite ease-in-out;
    }

    .laser-glow {
      filter: drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 12px rgba(2, 132, 199, 0.6));
    }

    .laser-core {
      stroke-dasharray: 6 3;
      animation: laserFlow 0.8s linear infinite;
    }

    @keyframes laserFlow {
      from { stroke-dashoffset: 18; }
      to { stroke-dashoffset: 0; }
    }

    .collapsible-sidebar {
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .collapsible-sidebar.collapsed {
      width: 0 !important;
      min-width: 0 !important;
      overflow: hidden !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      border: none !important;
    }
  </style>
</head>
<body class="w-screen h-screen flex flex-col antialiased">

  <!-- 侧边栏折叠浮动触发展开按键 -->
  <button id="btnOpenLeft" onclick="toggleLeftPanel()" class="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-l-0 border-slate-900 hover:border-sky-500 text-slate-900 py-4 px-2.5 rounded-r-2xl shadow-2xl flex flex-col items-center space-y-2 text-xs font-mono-sci font-black hover:bg-sky-50 transition cursor-pointer group" title="点击展开/收起芯片库">
    <i class="fa-solid fa-shapes text-sky-600 group-hover:scale-125 transition-transform"></i>
    <span class="text-[10px] tracking-widest writing-vertical" style="writing-mode: vertical-rl;">芯片库</span>
    <i class="fa-solid fa-chevron-right text-[10px] text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform"></i>
  </button>

  <button id="btnOpenRight" onclick="toggleRightPanel()" class="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md border-2 border-r-0 border-slate-900 hover:border-sky-500 text-slate-900 py-4 px-2.5 rounded-l-2xl shadow-2xl flex flex-col items-center space-y-2 text-xs font-mono-sci font-black hover:bg-sky-50 transition cursor-pointer group" title="点击展开/收起动力看板">
    <i class="fa-solid fa-bolt text-amber-500 group-hover:scale-125 transition-transform"></i>
    <span class="text-[10px] tracking-widest writing-vertical" style="writing-mode: vertical-rl;">动力看板</span>
    <i class="fa-solid fa-chevron-left text-[10px] text-slate-400 group-hover:text-amber-500 group-hover:-translate-x-0.5 transition-transform"></i>
  </button>

  <!-- 顶部导航栏 -->
  <header class="h-16 bg-white/95 border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs backdrop-blur-md">
    
    <!-- 左：纯净标题「中央处理器」 -->
    <div class="flex items-center space-x-3.5">
      <div class="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-700">
        <i class="fa-solid fa-microchip text-lg text-sky-400"></i>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <h1 class="text-base font-black tracking-widest text-slate-900 font-cinzel">
            中央处理器
          </h1>
          <span class="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-300 font-mono-sci font-bold">
            三大阵盘架构
          </span>
        </div>
        <p class="text-[10px] text-slate-500 font-mono-sci">三大盘独立承载：攻击盘 · 工厂盘 · 辅助盘</p>
      </div>
    </div>

    <!-- 中：境界选择 & 主特化盘单选 -->
    <div class="flex items-center space-x-4">
      <!-- 境界切换 -->
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-1 space-x-1 text-xs font-bold">
        <span class="text-[10px] text-slate-500 px-2 font-mono-sci">修为境界:</span>
        <button onclick="setRealm('qi')" id="btn_realm_qi" class="px-2.5 py-1 rounded bg-slate-900 text-white font-mono-sci shadow-xs transition" title="练气期：最大1个2环，其余2个1环">
          练气期 <span class="text-[10px] text-sky-300 font-normal">(主2环/次1环)</span>
        </button>
        <button onclick="setRealm('foundation')" id="btn_realm_foundation" class="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition" title="筑基期：最大1个3环，其余2个2环">
          筑基期 <span class="text-[10px] text-amber-600 font-normal">(主3环/次2环)</span>
        </button>
        <button onclick="setRealm('core')" id="btn_realm_core" class="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition" title="金丹期：最大1个4环，其余2个3环">
          金丹期 <span class="text-[10px] text-purple-600 font-normal">(主4环/次3环)</span>
        </button>
      </div>

      <!-- 主特化盘切换 (单选项) -->
      <div class="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-1 space-x-1 text-xs font-bold">
        <span class="text-[10px] text-slate-500 px-2 font-mono-sci">特化核心:</span>
        <button onclick="setSpecialization('combat')" id="btn_spec_combat" class="px-2.5 py-1 rounded bg-rose-600 text-white font-mono-sci shadow-xs transition flex items-center space-x-1" title="主攻特化：攻击盘享有当前境界最大环数">
          <i class="fa-solid fa-swords text-xs"></i>
          <span>攻击盘特化</span>
        </button>
        <button onclick="setSpecialization('industry')" id="btn_spec_industry" class="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-amber-700 font-mono-sci transition flex items-center space-x-1" title="主工特化：工厂盘享有当前境界最大环数">
          <i class="fa-solid fa-industry text-xs"></i>
          <span>工厂盘特化</span>
        </button>
        <button onclick="setSpecialization('support')" id="btn_spec_support" class="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-sky-700 font-mono-sci transition flex items-center space-x-1" title="主辅特化：辅助盘享有当前境界最大环数">
          <i class="fa-solid fa-shield-halved text-xs"></i>
          <span>辅助盘特化</span>
        </button>
      </div>
    </div>

    <!-- 右：工况预设 + 重置角度 + 清空 -->
    <div class="flex items-center space-x-2 shrink-0">
      <button onclick="resetAllRotations()" class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition shadow-xs flex items-center space-x-1" title="重置各环旋转角度为默认 0°">
        <i class="fa-solid fa-compass text-slate-500"></i>
        <span>重置角度</span>
      </button>

      <button onclick="clearBoard()" class="px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-xs font-bold text-slate-600 hover:text-rose-600 transition shadow-xs flex items-center space-x-1" title="清空盘面所有芯片构件">
        <i class="fa-solid fa-trash-can"></i>
        <span>清空</span>
      </button>
    </div>

  </header>

  <!-- 主体内容 -->
  <main class="flex-1 flex overflow-hidden relative">
    
    <!-- 左侧构件库 -->
    <aside id="leftPanel" class="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar collapsed">
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-layer-group text-sky-600 text-sm"></i>
          <span class="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono-sci">阵盘插件与芯片库</span>
        </div>
        <button onclick="toggleLeftPanel()" class="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition" title="收起面板">
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
      </div>

      <!-- 分类标签过滤 -->
      <div class="p-2 border-b border-slate-200 flex items-center space-x-1 overflow-x-auto text-[11px] font-mono-sci no-scrollbar">
        <button onclick="filterPalette('all')" id="tab_all" class="px-2 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0 shadow-xs">全部</button>
        <button onclick="filterPalette('combat')" id="tab_combat" class="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 hover:border-rose-500 shrink-0 font-bold">⚔️ 战斗</button>
        <button onclick="filterPalette('industry')" id="tab_industry" class="px-2 py-0.5 rounded bg-white text-amber-700 border border-amber-200 hover:border-amber-500 shrink-0 font-bold">⚙️ 工业</button>
        <button onclick="filterPalette('mobility')" id="tab_mobility" class="px-2 py-0.5 rounded bg-white text-sky-700 border border-sky-200 hover:border-sky-500 shrink-0 font-bold">🛡️ 辅助</button>
        <button onclick="filterPalette('shift')" id="tab_shift" class="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 hover:border-slate-800 shrink-0 font-bold">🪞 变轨</button>
        <button onclick="filterPalette('keystone')" id="tab_keystone" class="px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-400 hover:bg-purple-100 shrink-0 font-bold">💎 核心</button>
      </div>

      <!-- 芯片列表 -->
      <div class="flex-1 overflow-y-auto p-3 space-y-2" id="paletteListContainer">
        <!-- 动态渲染 -->
      </div>
    </aside>

    <!-- 中间：交互舞台 -->
    <section class="flex-1 relative flex flex-col items-center justify-center overflow-hidden blueprint-canvas" id="astrolabeStageSection">
      
      <!-- ✦ 快速点选装配状态悬浮条 ✦ -->
      <div id="quickPlacementBanner" class="hidden absolute top-4 left-6 z-30 flex items-center space-x-3 bg-slate-900/95 text-white px-4 py-1.5 rounded-xl text-xs font-mono-sci shadow-xl border border-sky-400 backdrop-blur-md transition-all">
        <span class="text-sky-300 font-bold flex items-center"><i class="fa-solid fa-crosshairs mr-1.5 text-sky-400 animate-spin"></i>已选芯片：</span>
        <span id="quickPlacementChipName" class="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"></span>
        <span class="text-slate-300 text-[11px]">👉 鼠标点击盘面任意插槽直接放置 (支持连续点击快速布置)</span>
        <button onclick="cancelPaletteSelection()" class="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 hover:text-white border border-slate-600 transition">取消 (Esc)</button>
      </div>

      <!-- 操作小贴士 -->
      <div class="absolute top-4 right-6 z-20 flex items-center space-x-3 bg-white/95 border border-slate-300 px-4 py-1.5 rounded-lg text-xs text-slate-700 font-mono-sci shadow-sm">
        <span class="flex items-center text-sky-700 font-bold"><i class="fa-solid fa-arrow-left mr-1.5"></i>高能激光自右端始发</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-slate-900 font-bold"><i class="fa-solid fa-hand-pointer mr-1.5 text-slate-600"></i>点击/拖拽安装芯片</span>
        <span class="text-slate-300">•</span>
        <span class="flex items-center text-rose-600"><i class="fa-solid fa-trash-can mr-1"></i>点击/右键取回</span>
      </div>

      <!-- 舞台容器 (1440x760) -->
      <div id="diskStage" class="relative w-[1440px] h-[760px] shrink-0 my-auto scale-95 origin-center">
        
        <!-- 背景矢量绘图层 (固定工程图纸标线、盘身同心轴线、外圈射出通道) -->
        <svg id="blueprintVectorBg" class="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 1440 760">
          <defs>
            <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" stroke-width="0.5" opacity="0.6"/>
            </pattern>
            <marker id="arrowCyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#00f0ff" />
            </marker>
          </defs>

          <!-- 整体底网 -->
          <rect width="1440" height="760" fill="url(#blueprintGrid)" />

          <!-- 主水平能量传导轴母线 (y = 380) -->
          <line x1="80" y1="380" x2="1380" y2="380" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.6" />

          <!-- 三大主盘静态工程标尺外框与文字 -->
          <!-- 1. 攻击盘 (cx: 300, cy: 380) -->
          <g id="combatDiscBg">
            <circle cx="300" cy="380" r="175" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 4" fill="#fff1f2" fill-opacity="0.2"/>
            <text x="300" y="180" font-family="'Noto Sans SC', sans-serif" font-size="13" font-weight="900" fill="#e11d48" text-anchor="middle">⚔️ 攻击盘 (COMBAT DISC)</text>
            <text id="combatRingInfoLabel" x="300" y="585" font-family="'Share Tech Mono', monospace" font-size="10.5" font-weight="bold" fill="#be123c" text-anchor="middle">ACTIVE RINGS: 2</text>
          </g>

          <!-- 2. 工厂盘 (cx: 720, cy: 380) -->
          <g id="industryDiscBg">
            <circle cx="720" cy="380" r="175" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" fill="#fffbeb" fill-opacity="0.2"/>
            <text x="720" y="180" font-family="'Noto Sans SC', sans-serif" font-size="13" font-weight="900" fill="#d97706" text-anchor="middle">⚙️ 工厂盘 (INDUSTRY DISC)</text>
            <text id="industryRingInfoLabel" x="720" y="585" font-family="'Share Tech Mono', monospace" font-size="10.5" font-weight="bold" fill="#b45309" text-anchor="middle">ACTIVE RINGS: 1</text>
          </g>

          <!-- 3. 辅助盘 (cx: 1140, cy: 380) -->
          <g id="supportDiscBg">
            <circle cx="1140" cy="380" r="175" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4 4" fill="#f0f9ff" fill-opacity="0.2"/>
            <text x="1140" y="180" font-family="'Noto Sans SC', sans-serif" font-size="13" font-weight="900" fill="#0369a1" text-anchor="middle">🛡️ 辅助盘 (SUPPORT DISC)</text>
            <text id="supportRingInfoLabel" x="1140" y="585" font-family="'Share Tech Mono', monospace" font-size="10.5" font-weight="bold" fill="#0284c7" text-anchor="middle">ACTIVE RINGS: 1</text>
          </g>

          <!-- 盘间桥接外圈射出通道导轨 (辅助盘 ➔ 工厂盘 ➔ 攻击盘) -->
          <g id="interDiscBridges" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 3">
            <!-- 始发源到辅助盘 -->
            <line x1="1380" y1="380" x2="1300" y2="380" stroke="#0284c7" stroke-width="1.5" />
            <!-- 辅助盘到工厂盘桥接管线 -->
            <line x1="984" y1="380" x2="876" y2="380" />
            <!-- 工厂盘到攻击盘桥接管线 -->
            <line x1="564" y1="380" x2="456" y2="380" />
          </g>
        </svg>

        <!-- 始发高能激光发射源 (右端 x: 1380, y: 380) -->
        <div id="rightEmitter" class="absolute z-30 flex items-center pointer-events-none" style="left: 1380px; top: 380px; transform: translateY(-50%);">
          <div class="flex flex-col items-end mr-2">
            <span class="text-[9px] font-mono-sci font-bold text-slate-800 bg-white/95 px-2 py-0.5 rounded border border-slate-300 shadow-xs whitespace-nowrap">
              <i class="fa-solid fa-crosshairs text-sky-600 mr-1 animate-spin"></i>EMITTER (始发源)
            </span>
            <span class="text-[8px] font-mono-sci text-sky-600 font-bold">180° WEST ➔</span>
          </div>
          <div class="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center pulse-emitter-modern">
            <div class="w-3 h-3 rounded-full bg-sky-400"></div>
          </div>
          <div class="w-6 h-0.5 bg-slate-900"></div>
        </div>

        <!-- ✦ 攻击盘中心极核插槽 (300, 380) ✦ -->
        <div id="hubSocket_combat" onclick="openKeystoneSelector('combat')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 300px; top: 380px; transform: translate(-50%, -50%);" title="【攻击极核插槽】点击手动放置/更换专属特质">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-rose-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-115" id="crossCenterCore_combat">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-rose-400/80 animate-spin" style="animation-duration: 20s;"></div>
            <i id="crossCoreIcon_combat" class="fa-solid fa-swords text-rose-600 text-sm relative z-10 transition-transform group-hover:rotate-12"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-rose-900 border border-rose-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="crossCoreBadge_combat">
            <i class="fa-solid fa-gem text-[7px] text-rose-500"></i>
            <span id="crossCoreNameText_combat">攻击极核</span>
          </div>
        </div>

        <!-- ✦ 工厂盘中心极核插槽 (720, 380) ✦ -->
        <div id="hubSocket_industry" onclick="openKeystoneSelector('industry')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 720px; top: 380px; transform: translate(-50%, -50%);" title="【工厂极核插槽】点击手动放置/更换专属特质">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-115" id="crossCenterCore_industry">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-amber-400/80 animate-spin" style="animation-duration: 22s;"></div>
            <i id="crossCoreIcon_industry" class="fa-solid fa-industry text-amber-600 text-sm relative z-10 transition-transform group-hover:rotate-12"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-amber-900 border border-amber-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="crossCoreBadge_industry">
            <i class="fa-solid fa-gem text-[7px] text-amber-500"></i>
            <span id="crossCoreNameText_industry">工厂极核</span>
          </div>
        </div>

        <!-- ✦ 辅助盘中心极核插槽 (1140, 380) ✦ -->
        <div id="hubSocket_support" onclick="openKeystoneSelector('support')" class="keystone-hub-socket absolute z-30 flex flex-col items-center justify-center cursor-pointer group" style="left: 1140px; top: 380px; transform: translate(-50%, -50%);" title="【辅助极核插槽】点击手动放置/更换专属特质">
          <div class="relative w-12 h-12 rounded-full bg-white border-2 border-sky-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-115" id="crossCenterCore_support">
            <div class="absolute -inset-1.5 rounded-full border border-dashed border-sky-400/80 animate-spin" style="animation-duration: 24s;"></div>
            <i id="crossCoreIcon_support" class="fa-solid fa-shield-halved text-sky-600 text-sm relative z-10 transition-transform group-hover:rotate-12"></i>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-white text-[8px] font-mono-sci font-bold text-sky-900 border border-sky-400 whitespace-nowrap shadow-xs flex items-center space-x-1" id="crossCoreBadge_support">
            <i class="fa-solid fa-gem text-[7px] text-sky-500"></i>
            <span id="crossCoreNameText_support">辅助极核</span>
          </div>
        </div>

        <!-- ✦ 动态圆盘 DOM 环体绘制层 (包含攻击/工厂/辅助 4 环的旋转框与外圈射出点) ✦ -->
        <div id="ringsDomLayer" class="absolute inset-0 pointer-events-none z-10"></div>

        <!-- 全局插槽 DOM 交互层 -->
        <div id="slotsLayer" class="absolute inset-0 w-full h-full z-20 pointer-events-auto"></div>

        <!-- 全局激光光路 SVG 绘制层 (置于 slotsLayer 之上，清晰可见) -->
        <svg id="opticalSvgLayer" class="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style="z-index: 25;" viewBox="0 0 1440 760">
          <g id="svgBeamsGroup"></g>
          <g id="svgImpactsGroup"></g>
          <g id="svgBridgeGroup"></g>
        </svg>

      </div>

    </section>

    <!-- 右侧：动力加成看板 -->
    <aside id="rightPanel" class="w-80 bg-white border-l border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar collapsed">
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-chart-line text-amber-500 text-sm"></i>
          <span class="text-xs font-bold text-slate-800 tracking-wider uppercase font-mono-sci">三大阵盘 · 动力看板</span>
        </div>
        <button onclick="toggleRightPanel()" class="w-7 h-7 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition" title="收起面板">
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        
        <!-- 三才阵联动共鸣状态卡 -->
        <div class="p-3.5 rounded-xl border transition-all" id="triResonanceCard">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold flex items-center">
              <i class="fa-solid fa-circle-nodes mr-1.5 text-sky-500"></i>三盘联动贯通状态
            </span>
            <span id="triResonanceBadge" class="text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-slate-100 text-slate-600">
              待导通
            </span>
          </div>
          <p id="triResonanceDesc" class="text-[10px] text-slate-500 leading-relaxed">
            激光自辅助盘射入，经外圈射出点贯通工厂盘与攻击盘形成三才共鸣，全盘属性享 <b>×1.5倍</b> 终极加成。
          </p>
        </div>

        <!-- 1. 攻击盘属性统计 -->
        <div class="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-2.5">
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
              <div class="text-slate-500 text-[9px]">攻击提升</div>
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
        <div class="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
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
              <div class="text-slate-500 text-[9px]">传送带速度</div>
              <div id="stat_belt_speed" class="text-amber-600 font-bold text-sm">+0%</div>
            </div>
          </div>
        </div>

        <!-- 3. 辅助盘属性统计 -->
        <div class="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-2.5">
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

        <!-- 光路连通日志 -->
        <div class="p-3 rounded-lg bg-slate-900 text-slate-100 text-[10px] font-mono-sci space-y-1">
          <div class="text-slate-400 font-bold mb-1 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>● 光路导通实时日志</span>
            <span id="logStepCount">0 节点</span>
          </div>
          <div id="beamLogList" class="space-y-1 max-h-40 overflow-y-auto pr-1">
            <div class="text-slate-500 italic">等待激光对齐始发入瞳...</div>
          </div>
        </div>

      </div>
    </aside>

  </main>

  <!-- 逻辑脚本 -->
  <script>
    /* =========================================================================
       1. 音频合成引擎 (原生 Web Audio API，无需外部资源)
       ========================================================================= */
    const audio = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) this.ctx = new AudioContext();
        }
      },
      play(freq, type, duration, vol = 0.08) {
        try {
          this.init();
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(vol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch(e) {}
      },
      playRotate() { this.play(520, 'sine', 0.04, 0.04); },
      playPlace() { this.play(880, 'triangle', 0.08, 0.07); },
      playRemove() { this.play(330, 'sine', 0.08, 0.07); },
      playSelect() { this.play(1040, 'sine', 0.05, 0.05); },
      playResonance() {
        this.play(523.25, 'sine', 0.3, 0.1);
        setTimeout(() => this.play(659.25, 'sine', 0.3, 0.1), 80);
        setTimeout(() => this.play(783.99, 'sine', 0.4, 0.12), 160);
      }
    };

    /* =========================================================================
       2. 芯片与核心特质规格表
       ========================================================================= */
    ${specsCode}

    /* =========================================================================
       3. 三大阵盘系统 (攻击盘 / 工厂盘 / 辅助盘)
       ========================================================================= */
    const DISC_META = {
      combat: {
        id: 'combat',
        name: '攻击盘',
        cx: 300,
        cy: 380,
        color: '#e11d48',
        accentBg: '#fff1f2',
        theme: 'rose',
        emissionAngleDeg: 0, // 向东 (工厂盘方向射出)
        targetDisc: 'industry'
      },
      industry: {
        id: 'industry',
        name: '工厂盘',
        cx: 720,
        cy: 380,
        color: '#d97706',
        accentBg: '#fffbeb',
        theme: 'amber',
        emissionAngleDeg: 180, // 向西 (攻击盘方向射出)
        targetDisc: 'combat'
      },
      support: {
        id: 'support',
        name: '辅助盘',
        cx: 1140,
        cy: 380,
        color: '#0284c7',
        accentBg: '#f0f9ff',
        theme: 'sky',
        emissionAngleDeg: 180, // 向西 (工厂盘方向射出)
        targetDisc: 'industry'
      }
    };

    // 每盘标准 4 环几何定义 (整除步数体系)
    const RING_TIER_DEFS = [
      { tier: 1, radius: 48,  slotCount: 6,  stepAngle: 60,   label: '1环 (内宿6位)' },
      { tier: 2, radius: 84,  slotCount: 8,  stepAngle: 45,   label: '2环 (中宿8位)' },
      { tier: 3, radius: 120, slotCount: 12, stepAngle: 30,   label: '3环 (外宿12位)' },
      { tier: 4, radius: 156, slotCount: 16, stepAngle: 22.5, label: '4环 (绝顶16位)' }
    ];

    /* =========================================================================
       4. 境界规则与单选特化配置 (练气: 1主2环/2次1环; 筑基: 1主3环/2次2环; 金丹: 1主4环/2次3环)
       ========================================================================= */
    let CURRENT_REALM = 'qi'; // 'qi' | 'foundation' | 'core'
    let SPECIALIZED_DISC = 'combat'; // 'combat' | 'industry' | 'support' (单选)

    function getDiscRingCounts() {
      const realmConfig = {
        qi:         { primary: 2, secondary: 1 },
        foundation: { primary: 3, secondary: 2 },
        core:       { primary: 4, secondary: 3 }
      }[CURRENT_REALM] || { primary: 2, secondary: 1 };

      return {
        combat:   (SPECIALIZED_DISC === 'combat')   ? realmConfig.primary : realmConfig.secondary,
        industry: (SPECIALIZED_DISC === 'industry') ? realmConfig.primary : realmConfig.secondary,
        support:  (SPECIALIZED_DISC === 'support')  ? realmConfig.primary : realmConfig.secondary
      };
    }

    function setRealm(realmKey) {
      if (['qi', 'foundation', 'core'].includes(realmKey)) {
        CURRENT_REALM = realmKey;
        ['qi', 'foundation', 'core'].forEach(k => {
          const btn = document.getElementById('btn_realm_' + k);
          if (!btn) return;
          if (k === realmKey) {
            btn.className = 'px-2.5 py-1 rounded bg-slate-900 text-white font-mono-sci shadow-xs transition';
          } else {
            btn.className = 'px-2.5 py-1 rounded bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition';
          }
        });
        audio.playSelect();
        applyDiscRingConfiguration();
      }
    }

    function setSpecialization(discKey) {
      if (['combat', 'industry', 'support'].includes(discKey)) {
        SPECIALIZED_DISC = discKey;
        const colorMap = {
          combat: 'bg-rose-600 text-white',
          industry: 'bg-amber-600 text-white',
          support: 'bg-sky-600 text-white'
        };
        ['combat', 'industry', 'support'].forEach(k => {
          const btn = document.getElementById('btn_spec_' + k);
          if (!btn) return;
          if (k === discKey) {
            btn.className = \`px-2.5 py-1 rounded \${colorMap[k]} font-mono-sci shadow-xs transition flex items-center space-x-1\`;
          } else {
            btn.className = 'px-2.5 py-1 rounded bg-white text-slate-700 hover:text-slate-900 font-mono-sci transition flex items-center space-x-1';
          }
        });
        audio.playSelect();
        applyDiscRingConfiguration();
      }
    }

    // 动态环数据映射
    let DISK_RINGS = {};
    let BOARD_SLOTS = {};

    function initDiscRings() {
      DISK_RINGS = {};
      const counts = getDiscRingCounts();

      for (const [discKey, discMeta] of Object.entries(DISC_META)) {
        const activeCount = counts[discKey];
        for (let t = 1; t <= 4; t++) {
          const tierDef = RING_TIER_DEFS[t - 1];
          const ringKey = \`\${discKey}_\${t}\`;
          DISK_RINGS[ringKey] = {
            key: ringKey,
            discKey: discKey,
            tier: t,
            isActive: (t <= activeCount),
            name: \`\${discMeta.name} · 第\${t}环\`,
            cx: discMeta.cx,
            cy: discMeta.cy,
            radius: tierDef.radius,
            slotCount: tierDef.slotCount,
            currentAngle: 0,
            slotOffset: 0
          };
        }
      }
    }

    function initBoardSlots() {
      // 尽可能保留已放置芯片，仅对新结构做扩充
      const oldSlots = Object.assign({}, BOARD_SLOTS);
      BOARD_SLOTS = {};

      for (const [ringKey, ringMeta] of Object.entries(DISK_RINGS)) {
        for (let i = 0; i < ringMeta.slotCount; i++) {
          const slotKey = \`\${ringKey}_\${i}\`;
          BOARD_SLOTS[slotKey] = {
            slotKey: slotKey,
            ringKey: ringKey,
            discKey: ringMeta.discKey,
            tier: ringMeta.tier,
            slotIndex: i,
            chip: (oldSlots[slotKey] ? oldSlots[slotKey].chip : null)
          };
        }
      }
    }

    function applyDiscRingConfiguration() {
      const counts = getDiscRingCounts();

      // 更新标签显示
      const labelCombat = document.getElementById('combatRingInfoLabel');
      if (labelCombat) labelCombat.textContent = \`ACTIVE RINGS: \${counts.combat} / 4 (\${SPECIALIZED_DISC === 'combat' ? '主特化' : '次盘'})\`;

      const labelInd = document.getElementById('industryRingInfoLabel');
      if (labelInd) labelInd.textContent = \`ACTIVE RINGS: \${counts.industry} / 4 (\${SPECIALIZED_DISC === 'industry' ? '主特化' : '次盘'})\`;

      const labelSupp = document.getElementById('supportRingInfoLabel');
      if (labelSupp) labelSupp.textContent = \`ACTIVE RINGS: \${counts.support} / 4 (\${SPECIALIZED_DISC === 'support' ? '主特化' : '次盘'})\`;

      // 标记激活态
      for (const [ringKey, ring] of Object.entries(DISK_RINGS)) {
        ring.isActive = (ring.tier <= counts[ring.discKey]);
      }

      renderRingsDOM();
      renderBoardSlots();
      solveStepNetwork();
    }

    // 槽位世界坐标计算 (以正上方 -90° 为 0 号基准位，顺时针排列 + 环当前旋转角)
    function getSlotWorldPos(ringKey, slotIndex) {
      const ring = DISK_RINGS[ringKey];
      if (!ring) return { x: 0, y: 0, angleDeg: 0 };
      const baseDeg = -90 + (slotIndex * (360 / ring.slotCount));
      const effectiveDeg = (baseDeg + ring.currentAngle + 360) % 360;
      const rad = (effectiveDeg * Math.PI) / 180;
      return {
        x: ring.cx + ring.radius * Math.cos(rad),
        y: ring.cy + ring.radius * Math.sin(rad),
        angleDeg: effectiveDeg,
        cx: ring.cx,
        cy: ring.cy
      };
    }

    /* =========================================================================
       5. 动态圆盘与外圈射出点 DOM 渲染
       ========================================================================= */
    function renderRingsDOM() {
      const container = document.getElementById('ringsDomLayer');
      if (!container) return;

      const counts = getDiscRingCounts();
      let html = '';

      for (const [discKey, meta] of Object.entries(DISC_META)) {
        const activeTiers = counts[discKey];

        for (let t = 1; t <= 4; t++) {
          const tierDef = RING_TIER_DEFS[t - 1];
          const ringKey = \`\${discKey}_\${t}\`;
          const ring = DISK_RINGS[ringKey];
          const isActive = (t <= activeTiers);
          const isOutermost = (t === activeTiers);
          const size = tierDef.radius * 2;
          const left = meta.cx - tierDef.radius;
          const top = meta.cy - tierDef.radius;
          const curDeg = ring ? ring.currentAngle : 0;

          html += \`
            <div id="ringEl_\${ringKey}" class="absolute rounded-full ring-trans transition-opacity duration-300" 
                 style="width: \${size}px; height: \${size}px; left: \${left}px; top: \${top}px; transform: rotate(\${curDeg}deg); opacity: \${isActive ? '1' : '0.2'};">
              
              <!-- 环体工程边框 -->
              <div class="absolute inset-0 rounded-full border \${
                isActive 
                  ? (isOutermost ? \`border-2 border-\${meta.theme}-500 shadow-sm\` : \`border border-\${meta.theme}-400/80\`)
                  : 'border border-dashed border-slate-300'
              }"></div>

              <!-- 环角数字与刻度指示 -->
              <div class="absolute top-0.5 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1 rounded bg-white text-[7px] font-mono-sci font-bold text-slate-700 border border-slate-300 shadow-xs whitespace-nowrap">
                R\${t}
              </div>

              <!-- ✦ 核心：环的外圈射出点 (仅在该盘当前最外层活跃环展示) ✦ -->
              \${isOutermost ? \`
                <div class="absolute z-30 flex items-center" 
                     style="left: \${meta.emissionAngleDeg === 0 ? size : 0}px; top: \${size / 2}px; transform: translate(-50%, -50%);"
                     title="【\${meta.name} · 外圈射出端口】激光自此端口汇聚并向相邻阵盘投射">
                  <div class="w-5 h-5 rounded-full bg-slate-900 border-2 border-white shadow flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                  </div>
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 px-1 rounded bg-slate-900 text-white text-[7px] font-mono-sci font-bold whitespace-nowrap border border-cyan-400">
                    射出点
                  </div>
                </div>
              \` : ''}

            </div>
          \`;
        }
      }

      container.innerHTML = html;
    }

    /* =========================================================================
       6. 插槽渲染与点选/悬浮取回
       ========================================================================= */
    let SLOTS_DOM_INITIALIZED = false;

    function renderBoardSlots() {
      const container = document.getElementById('slotsLayer');
      if (!container) return;

      if (!SLOTS_DOM_INITIALIZED) {
        container.innerHTML = '';
        for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {
          const slotEl = document.createElement('div');
          slotEl.id = \`slot_\${slotKey}\`;
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.className = 'absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150';

          // 拖拽
          slotEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            slotEl.classList.add('scale-125');
          });
          slotEl.addEventListener('dragleave', () => {
            slotEl.classList.remove('scale-125');
          });
          slotEl.addEventListener('drop', (e) => {
            e.preventDefault();
            slotEl.classList.remove('scale-125');
            const typeId = e.dataTransfer.getData('text/plain');
            placeChip(slotKey, typeId);
          });

          // 点击：选中时直接放，未选中有点芯片时取回
          slotEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ACTIVE_SELECTED_CHIP) {
              placeChip(slotKey, ACTIVE_SELECTED_CHIP);
            } else if (BOARD_SLOTS[slotKey] && BOARD_SLOTS[slotKey].chip) {
              removeChip(slotKey);
            }
          });

          slotEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeChip(slotKey);
          });

          container.appendChild(slotEl);
        }
        SLOTS_DOM_INITIALIZED = true;
      }

      // 刷新位置与展示
      for (const [slotKey, slotData] of Object.entries(BOARD_SLOTS)) {
        const slotEl = document.getElementById(\`slot_\${slotKey}\`);
        if (!slotEl) continue;

        const ring = DISK_RINGS[slotData.ringKey];
        if (!ring || !ring.isActive) {
          slotEl.style.display = 'none';
          slotEl.style.pointerEvents = 'none';
          continue;
        }

        const pos = getSlotWorldPos(slotData.ringKey, slotData.slotIndex);
        slotEl.style.left = \`\${pos.x}px\`;
        slotEl.style.top = \`\${pos.y}px\`;

        const hasChip = !!slotData.chip;

        if (hasChip) {
          // 芯片处于最高层级 (z-index: 35)，绝对不被任何空槽压住
          const spec = CHIP_SPECS[slotData.chip];
          slotEl.style.display = 'block';
          slotEl.style.opacity = '1';
          slotEl.style.pointerEvents = 'auto';
          slotEl.style.zIndex = '35';
          slotEl.style.width = '32px';
          slotEl.style.height = '32px';
          slotEl.setAttribute('data-has-chip', 'true');
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center cursor-pointer group" title="\${spec.name}\\n\${spec.buffDesc}\\n\${spec.stepDesc}\\n【点击/右键】取回">
              <div class="absolute -inset-1 rounded-full border border-sky-400/50 pointer-events-none"></div>
              <div class="w-7 h-7 \${spec.shape} \${spec.matClass} flex items-center justify-center relative z-10 transition-transform group-hover:scale-110 shadow-md">
                <i class="fa-solid \${spec.icon} text-xs pointer-events-none"></i>
              </div>
              <div class="pointer-events-none absolute -bottom-2 -right-2 px-1 rounded bg-slate-900 text-[7px] font-mono-sci text-white font-bold border border-sky-400 shadow-xs z-20">
                \${slotData.slotIndex + 1}
              </div>
              <!-- 悬浮一键取回按钮 -->
              <button onclick="removeChip('\${slotKey}'); event.stopPropagation();" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[9px] font-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-30" title="移除芯片">×</button>
            </div>
          \`;
        } else {
          // 空插槽微孔 (z-index: 10)，不挡芯片
          slotEl.setAttribute('data-has-chip', 'false');
          slotEl.style.display = 'block';
          slotEl.style.opacity = '1';
          slotEl.style.pointerEvents = 'auto';
          slotEl.style.zIndex = '10';
          slotEl.style.width = '22px';
          slotEl.style.height = '22px';
          slotEl.innerHTML = \`
            <div class="relative w-full h-full flex items-center justify-center group cursor-pointer" title="\${ring.name} 第 \${slotData.slotIndex + 1} 槽\\n【点击/拖拽】装配芯片">
              <div class="w-full h-full rounded-full flex items-center justify-center transition-all bg-white/90 border border-dashed border-sky-400 hover:border-sky-600 hover:bg-sky-100 shadow-xs hover:scale-115">
                <div class="w-1.5 h-1.5 rounded-full bg-sky-500 pointer-events-none"></div>
              </div>
              <span class="pointer-events-none absolute -bottom-2 px-0.5 rounded bg-white/90 text-[6.5px] font-mono-sci text-slate-600 font-bold border border-slate-300 shadow-xs">\${slotData.slotIndex + 1}</span>
            </div>
          \`;
        }
      }
    }

    function placeChip(slotKey, typeId) {
      if (!CHIP_SPECS[typeId] || !BOARD_SLOTS[slotKey]) return;
      BOARD_SLOTS[slotKey].chip = typeId;
      audio.playPlace();
      renderBoardSlots();
      solveStepNetwork();
    }

    function removeChip(slotKey) {
      if (!BOARD_SLOTS[slotKey] || !BOARD_SLOTS[slotKey].chip) return;
      BOARD_SLOTS[slotKey].chip = null;
      audio.playRemove();
      renderBoardSlots();
      solveStepNetwork();
    }

    function clearBoard() {
      for (const k in BOARD_SLOTS) {
        BOARD_SLOTS[k].chip = null;
      }
      ACTIVE_SELECTED_CHIP = null;
      renderPalette();
      updateSelectedChipIndicator();
      if (audio) audio.playRemove();
      renderBoardSlots();
      solveStepNetwork();
    }
    window.clearBoard = clearBoard;

    /* =========================================================================
       7. 旋转交互与滚轮转盘
       ========================================================================= */
    function rotateRing(ringKey, deltaStep) {
      const ring = DISK_RINGS[ringKey];
      if (!ring) return;

      const fineStep = 0.5;
      ring.slotOffset = (ring.slotOffset + deltaStep * fineStep + ring.slotCount) % ring.slotCount;
      const degStep = 360 / ring.slotCount;
      ring.currentAngle = Number(((ring.slotOffset * degStep) % 360).toFixed(1));

      const ringEl = document.getElementById(\`ringEl_\${ringKey}\`);
      if (ringEl) {
        ringEl.style.transform = \`rotate(\${ring.currentAngle}deg)\`;
      }

      audio.playRotate();
      renderBoardSlots();
      solveStepNetwork();
    }

    function resetAllRotations() {
      for (const k in DISK_RINGS) {
        DISK_RINGS[k].slotOffset = 0;
        DISK_RINGS[k].currentAngle = 0;
        const ringEl = document.getElementById(\`ringEl_\${k}\`);
        if (ringEl) ringEl.style.transform = 'rotate(0deg)';
      }
      audio.playRotate();
      renderBoardSlots();
      solveStepNetwork();
    }

    function initRingDirectDragging() {
      const stage = document.getElementById('diskStage');
      if (!stage) return;

      // 滚轮旋转对应盘面
      stage.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = stage.getBoundingClientRect();
        const scale = rect.width / 1440;
        const mouseX = (e.clientX - rect.left) / scale;
        const mouseY = (e.clientY - rect.top) / scale;

        // 判断落在哪个盘
        for (const [discKey, meta] of Object.entries(DISC_META)) {
          const dist = Math.hypot(mouseX - meta.cx, mouseY - meta.cy);
          if (dist <= 175) {
            // 拾取最接近的活跃环
            const counts = getDiscRingCounts();
            const activeCount = counts[discKey];
            let bestRingKey = null;
            let minDist = 9999;
            for (let t = 1; t <= activeCount; t++) {
              const rDef = RING_TIER_DEFS[t - 1];
              const d = Math.abs(dist - rDef.radius);
              if (d < minDist) {
                minDist = d;
                bestRingKey = \`\${discKey}_\${t}\`;
              }
            }
            if (bestRingKey) {
              rotateRing(bestRingKey, e.deltaY < 0 ? 1 : -1);
            }
            break;
          }
        }
      }, { passive: false });
    }

    /* =========================================================================
       8. 芯片列表与点选装配
       ========================================================================= */
    let CURRENT_PALETTE_FILTER = 'all';
    let ACTIVE_SELECTED_CHIP = null;

    function filterPalette(filterKey) {
      CURRENT_PALETTE_FILTER = filterKey;
      ['all', 'combat', 'industry', 'mobility', 'shift', 'keystone'].forEach(k => {
        const tab = document.getElementById('tab_' + k);
        if (!tab) return;
        if (k === filterKey) {
          tab.className = 'px-2 py-0.5 rounded bg-slate-900 text-white font-bold shrink-0 shadow-xs';
        } else {
          tab.className = 'px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 hover:border-slate-800 shrink-0 font-bold';
        }
      });
      renderPalette();
    }

    function selectPaletteChip(typeId) {
      if (ACTIVE_SELECTED_CHIP === typeId) {
        ACTIVE_SELECTED_CHIP = null;
      } else {
        ACTIVE_SELECTED_CHIP = typeId;
        audio.playSelect();
      }
      renderPalette();
      updateSelectedChipIndicator();
    }

    function cancelPaletteSelection() {
      ACTIVE_SELECTED_CHIP = null;
      renderPalette();
      updateSelectedChipIndicator();
    }

    function updateSelectedChipIndicator() {
      const banner = document.getElementById('quickPlacementBanner');
      const nameEl = document.getElementById('quickPlacementChipName');
      if (!banner || !nameEl) return;
      if (ACTIVE_SELECTED_CHIP && CHIP_SPECS[ACTIVE_SELECTED_CHIP]) {
        nameEl.textContent = CHIP_SPECS[ACTIVE_SELECTED_CHIP].name;
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ACTIVE_SELECTED_CHIP) {
        cancelPaletteSelection();
      }
    });

    function renderPalette() {
      const container = document.getElementById('paletteListContainer');
      if (!container) return;

      const keys = Object.keys(CHIP_SPECS);
      let filteredKeys = keys;

      if (CURRENT_PALETTE_FILTER === 'combat') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'combat');
      } else if (CURRENT_PALETTE_FILTER === 'industry') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'industry');
      } else if (CURRENT_PALETTE_FILTER === 'mobility') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].category === 'mobility');
      } else if (CURRENT_PALETTE_FILTER === 'shift') {
        filteredKeys = keys.filter(k => CHIP_SPECS[k].type === 'direction' || CHIP_SPECS[k].type === 'split');
      }

      let html = '';
      filteredKeys.forEach(typeId => {
        const spec = CHIP_SPECS[typeId];
        const stepBadge = spec.type === 'step' ? \`+\${spec.step}格\` : '变轨规';
        const isSelected = (ACTIVE_SELECTED_CHIP === typeId);

        html += \`
          <div class="p-2.5 rounded-lg transition cursor-pointer flex items-center space-x-3 group shadow-xs hover:shadow-sm \${
            isSelected
              ? 'bg-sky-50 border-2 border-sky-500 ring-2 ring-sky-300/50 shadow-md'
              : 'bg-white border border-slate-200 hover:border-sky-400'
          }"
               draggable="true"
               ondragstart="onPaletteDragStart(event, '\${typeId}')"
               onclick="selectPaletteChip('\${typeId}')"
               title="\${spec.name}\\n\${spec.buffDesc}\\n\${spec.stepDesc}\\n【点击】选中后点击盘面插槽直接放置\\n【拖拽】直接拖拽至插槽">
            
            <div class="w-9 h-9 \${spec.shape} \${spec.matClass} flex items-center justify-center relative shrink-0">
              <i class="fa-solid \${spec.icon} text-sm"></i>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold \${spec.textColor} truncate">\${spec.name}</span>
                <span class="text-[9px] font-mono-sci px-1.5 py-0.2 rounded font-bold \${spec.badgeColor}">
                  \${stepBadge}
                </span>
                \${isSelected ? '<span class="text-[8.5px] font-mono-sci px-1.5 py-0.2 rounded font-bold bg-sky-500 text-white ml-1">待放置</span>' : ''}
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>\${spec.buffDesc}</span>
                <span class="text-slate-400 font-mono-sci">\${spec.stepDesc}</span>
              </div>
            </div>
          </div>
        \`;
      });

      container.innerHTML = html;
    }

    function onPaletteDragStart(e, typeId) {
      audio.init();
      e.dataTransfer.setData('text/plain', typeId);
    }

    /* =========================================================================
       9. 极核特质配置
       ========================================================================= */
    const KEYSTONE_SLOTS = {
      combat: 'keystone_sword_array',
      industry: 'keystone_assembly',
      support: 'keystone_logistics'
    };

    function updateAllKeystoneSocketsDOM() {
      for (const discKey of ['combat', 'industry', 'support']) {
        const ksId = KEYSTONE_SLOTS[discKey];
        const ks = KEYSTONE_TRAITS[ksId];
        const nameEl = document.getElementById('crossCoreNameText_' + discKey);
        const iconEl = document.getElementById('crossCoreIcon_' + discKey);
        if (ks) {
          if (nameEl) nameEl.textContent = ks.name.split('·')[0].trim();
          if (iconEl) iconEl.className = \`fa-solid \${ks.icon} text-sm relative z-10\`;
        }
      }
    }

    function openKeystoneSelector(discKey) {
      filterPalette('keystone');
      toggleLeftPanel(true);
    }

    /* =========================================================================
       10. 光路追踪与三盘贯通拓扑求解引擎
       ========================================================================= */
    function solveStepNetwork() {
      const svgBeams = document.getElementById('svgBeamsGroup');
      const svgImpacts = document.getElementById('svgImpactsGroup');
      const svgBridge = document.getElementById('svgBridgeGroup');
      if (!svgBeams || !svgImpacts || !svgBridge) return;

      svgBeams.innerHTML = '';
      svgImpacts.innerHTML = '';
      svgBridge.innerHTML = '';

      const logList = document.getElementById('beamLogList');
      if (logList) logList.innerHTML = '';

      const logSteps = [];
      const chainNodes = [];
      let totalBuff = {
        atk: 0, def: 0, hp: 0, crit: 0, speed: 0,
        sword_funnel: 0, craft_speed: 0, mining_speed: 0, power_cut: 0, belt_speed: 0,
        penetration: 0, flight_battery: 0
      };

      const counts = getDiscRingCounts();

      // 1. 始发激光自右侧射入辅助盘最外层活跃环
      const supportOutermostTier = counts.support;
      const supportOutermostRingKey = \`support_\${supportOutermostTier}\`;
      const supportRing = DISK_RINGS[supportOutermostRingKey];

      const emitterX = 1380;
      const emitterY = 380;

      // 辅助盘右侧边缘入口位 (x: cx + R, y: cy)
      const supportEntryX = DISC_META.support.cx + supportRing.radius;
      const supportEntryY = DISC_META.support.cy;

      drawLaserLine(svgBridge, emitterX, emitterY, supportEntryX, supportEntryY, '#00f0ff', true);
      drawImpactPoint(svgImpacts, supportEntryX, supportEntryY, '#00f0ff');
      logSteps.push('⚡ 始发激光射入辅助盘最外环 (R' + supportOutermostTier + ') 入瞳');

      // 辅助盘环路计算
      let supportConductive = false;
      let supportActiveCount = 0;
      for (let t = 1; t <= counts.support; t++) {
        for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
          const slot = BOARD_SLOTS[\`support_\${t}_\${s}\`];
          if (slot && slot.chip) {
            supportActiveCount++;
            accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
          }
        }
      }
      supportConductive = (supportActiveCount > 0);

      // 辅助盘外圈射出点 ➔ 工厂盘
      const supportEmitX = DISC_META.support.cx - supportRing.radius;
      const supportEmitY = DISC_META.support.cy;

      const industryOutermostTier = counts.industry;
      const industryOutermostRingKey = \`industry_\${industryOutermostTier}\`;
      const industryRing = DISK_RINGS[industryOutermostRingKey];
      const industryEntryX = DISC_META.industry.cx + industryRing.radius;
      const industryEntryY = DISC_META.industry.cy;

      let industryConductive = false;
      let industryActiveCount = 0;

      if (supportConductive) {
        drawLaserLine(svgBridge, supportEmitX, supportEmitY, industryEntryX, industryEntryY, '#00f0ff', true);
        drawImpactPoint(svgImpacts, industryEntryX, industryEntryY, '#f59e0b');
        logSteps.push('✨ 辅助盘射出点准直导通 ➔ 激光注入工厂盘入瞳！');

        for (let t = 1; t <= counts.industry; t++) {
          for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
            const slot = BOARD_SLOTS[\`industry_\${t}_\${s}\`];
            if (slot && slot.chip) {
              industryActiveCount++;
              accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
            }
          }
        }
        industryConductive = (industryActiveCount > 0);
      } else {
        logSteps.push('▲ 辅助盘未放置芯片或未导通，待激活后射向工厂盘');
      }

      // 工厂盘外圈射出点 ➔ 攻击盘
      const industryEmitX = DISC_META.industry.cx - industryRing.radius;
      const industryEmitY = DISC_META.industry.cy;

      const combatOutermostTier = counts.combat;
      const combatOutermostRingKey = \`combat_\${combatOutermostTier}\`;
      const combatRing = DISK_RINGS[combatOutermostRingKey];
      const combatEntryX = DISC_META.combat.cx + combatRing.radius;
      const combatEntryY = DISC_META.combat.cy;

      let combatConductive = false;
      let combatActiveCount = 0;

      if (industryConductive) {
        drawLaserLine(svgBridge, industryEmitX, industryEmitY, combatEntryX, combatEntryY, '#00f0ff', true);
        drawImpactPoint(svgImpacts, combatEntryX, combatEntryY, '#e11d48');
        logSteps.push('🔥 工厂盘射出点准直导通 ➔ 激光注入攻击盘入瞳！');

        for (let t = 1; t <= counts.combat; t++) {
          for (let s = 0; s < RING_TIER_DEFS[t - 1].slotCount; s++) {
            const slot = BOARD_SLOTS[\`combat_\${t}_\${s}\`];
            if (slot && slot.chip) {
              combatActiveCount++;
              accumulateBuff(totalBuff, CHIP_SPECS[slot.chip].buff);
            }
          }
        }
        combatConductive = (combatActiveCount > 0);
      } else {
        logSteps.push('▲ 工厂盘未导通，能量未能注入攻击盘');
      }

      // 三盘全贯通共鸣判定
      const isTriResonance = (supportConductive && industryConductive && combatConductive);
      if (isTriResonance) {
        logSteps.push('🌟 【三大阵盘全贯通】天地人三才归元！触发全局 1.5x 狂暴共鸣！');
        for (const k in totalBuff) {
          totalBuff[k] = Math.round(totalBuff[k] * 1.5);
        }
      }

      updatePanels(totalBuff, isTriResonance, supportActiveCount, industryActiveCount, combatActiveCount, logSteps);
    }

    function accumulateBuff(target, source) {
      if (!source) return;
      for (const [k, v] of Object.entries(source)) {
        if (target[k] !== undefined) target[k] += v;
      }
    }

    function drawLaserLine(svg, x1, y1, x2, y2, color = '#00f0ff', animated = true) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('class', animated ? 'laser-glow laser-core' : 'laser-glow');
      svg.appendChild(line);
    }

    function drawImpactPoint(svg, cx, cy, color = '#00f0ff') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', color);
      circle.setAttribute('class', 'animate-ping');
      svg.appendChild(circle);
    }

    function updatePanels(buff, isTri, sCount, iCount, cCount, logSteps) {
      // 属性看板赋值
      const setTxt = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setTxt('stat_atk', \`+\${buff.atk || 0}%\`);
      setTxt('stat_crit', \`+\${buff.crit || 0}%\`);
      setTxt('stat_penetration', \`+\${buff.penetration || 0}%\`);
      setTxt('stat_sword_funnel', \`+\${buff.sword_funnel || 0}把\`);

      setTxt('stat_craft_speed', \`+\${buff.craft_speed || 0}%\`);
      setTxt('stat_mining_speed', \`+\${buff.mining_speed || 0}%\`);
      setTxt('stat_power_cut', \`-\${buff.power_cut || 0}%\`);
      setTxt('stat_belt_speed', \`+\${buff.belt_speed || 0}%\`);

      setTxt('stat_def', \`+\${buff.def || 0}%\`);
      setTxt('stat_speed', \`+\${buff.speed || 0}%\`);
      setTxt('stat_hp', \`+\${buff.hp || 0}\`);
      setTxt('stat_flight_battery', \`+\${buff.flight_battery || 0}%\`);

      setTxt('combatActiveSlotCount', \`\${cCount} 槽激活\`);
      setTxt('industryActiveSlotCount', \`\${iCount} 槽激活\`);
      setTxt('supportActiveSlotCount', \`\${sCount} 槽激活\`);

      // 三才共鸣卡片状态
      const card = document.getElementById('triResonanceCard');
      const badge = document.getElementById('triResonanceBadge');
      if (card && badge) {
        if (isTri) {
          card.className = 'p-3.5 rounded-xl border border-cyan-400 bg-cyan-950/20 shadow-md ring-2 ring-cyan-400/30';
          badge.className = 'text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-cyan-500 text-white animate-pulse';
          badge.textContent = '● 三盘贯通 ×1.5倍';
        } else {
          card.className = 'p-3.5 rounded-xl border border-slate-200 bg-slate-50';
          badge.className = 'text-[9px] px-2 py-0.5 rounded font-mono-sci font-bold bg-slate-100 text-slate-600';
          badge.textContent = '待导通';
        }
      }

      // 日志
      const logList = document.getElementById('beamLogList');
      const stepCountEl = document.getElementById('logStepCount');
      if (logList) {
        logList.innerHTML = logSteps.map(s => \`<div class="leading-relaxed">\${s}</div>\`).join('');
      }
      if (stepCountEl) {
        stepCountEl.textContent = \`\${logSteps.length} 状态\`;
      }
    }

    /* =========================================================================
       11. 侧边栏折叠与响应式交互
       ========================================================================= */
    function toggleLeftPanel(forceOpen = null) {
      const panel = document.getElementById('leftPanel');
      if (!panel) return;
      if (forceOpen === true) panel.classList.remove('collapsed');
      else if (forceOpen === false) panel.classList.add('collapsed');
      else panel.classList.toggle('collapsed');
    }

    function toggleRightPanel(forceOpen = null) {
      const panel = document.getElementById('rightPanel');
      if (!panel) return;
      if (forceOpen === true) panel.classList.remove('collapsed');
      else if (forceOpen === false) panel.classList.add('collapsed');
      else panel.classList.toggle('collapsed');
    }

    /* =========================================================================
       12. 系统初始化引导
       ========================================================================= */
    window.addEventListener('DOMContentLoaded', () => {
      initDiscRings();
      initBoardSlots();
      applyDiscRingConfiguration();
      renderPalette();
      initRingDirectDragging();
      updateAllKeystoneSocketsDOM();

      // 默认初始预设：在辅助盘放一颗初级攻击芯片，展示即开即通的始发效果
      if (BOARD_SLOTS['support_1_0']) {
        BOARD_SLOTS['support_1_0'].chip = 't0_atk_1';
      }
      if (BOARD_SLOTS['industry_1_0']) {
        BOARD_SLOTS['industry_1_0'].chip = 't0_craft_1';
      }
      if (BOARD_SLOTS['combat_1_0']) {
        BOARD_SLOTS['combat_1_0'].chip = 't0_atk_2';
      }

      renderBoardSlots();
      solveStepNetwork();
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('e:/UE5/修仙工厂策划案/processor/index.html', htmlContent, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/optical_array_prototype.html', htmlContent, 'utf8');
fs.writeFileSync('e:/UE5/修仙工厂策划案/中央处理器_光路阵盘/index.html', htmlContent, 'utf8');

console.log('Successfully generated complete 3-disc architecture for all files!');
