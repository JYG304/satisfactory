// ====================================================================
// js/world_buildings.js - 动态世界建筑、建造模式与3秒右键拆除系统
// 1:1 还原用户截图 media_1790442746779.png / 47796.png / 48700.png
// ====================================================================

// 建筑视觉 SVG 库 (支持世界空间缩放与交互)
const buildingSvgTemplates = {
  miner: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 200 200">
    <ellipse cx="100" cy="180" rx="70" ry="14" fill="rgba(0,0,0,0.4)"/>
    <polygon points="40,175 60,110 140,110 160,175" fill="#1b2029" stroke="#12161f" stroke-width="2.5"/>
    <rect x="60" y="70" width="80" height="50" rx="2" fill="#e0770b" stroke="#12161f" stroke-width="2.5"/>
    <rect x="70" y="80" width="24" height="24" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
    <rect x="85" y="35" width="30" height="60" rx="3" fill="#3d4657" stroke="#12161f" stroke-width="2"/>
    <g class="drill-active">
      <polygon points="100,190 82,145 118,145" fill="#ffd400" stroke="#111" stroke-width="2"/>
      <line x1="90" y1="150" x2="110" y2="150" stroke="#333" stroke-width="3"/>
    </g>
    <circle cx="95" cy="186" r="3" fill="#ffe066" class="animate-ping"/>
  </svg>`,
  
  smelter: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 180 200">
    <ellipse cx="90" cy="180" rx="60" ry="14" fill="rgba(0,0,0,0.4)"/>
    <g class="steam-particle" transform="translate(90, 30)">
      <circle cx="-6" cy="0" r="10" fill="rgba(255,255,255,0.4)" filter="blur(2px)"/>
      <circle cx="8" cy="-8" r="14" fill="rgba(255,200,150,0.3)" filter="blur(3px)"/>
    </g>
    <rect x="76" y="28" width="28" height="24" rx="2" fill="#20242d" stroke="#111" stroke-width="2"/>
    <line x1="72" y1="28" x2="108" y2="28" stroke="#f5921e" stroke-width="3"/>
    <path d="M 40 175 L 52 52 L 128 52 L 140 175 Z" fill="#272d38" stroke="#12161f" stroke-width="3"/>
    <polygon points="58,62 122,62 130,165 50,165" fill="#f5921e" stroke="#111" stroke-width="2"/>
    <rect x="72" y="105" width="36" height="42" rx="3" fill="#15171d" stroke="#000" stroke-width="2"/>
    <rect x="76" y="110" width="28" height="32" rx="2" fill="#ff4d00" class="animate-pulse shadow-[inset_0_0_12px_#ffeb3b]"/>
    <rect x="68" y="162" width="44" height="16" fill="#12151c" stroke="#333" stroke-width="1.5"/>
    <rect x="78" y="166" width="24" height="8" fill="#ffd400"/>
  </svg>`,

  constructor: `<svg class="w-full h-full drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]" viewBox="0 0 210 200">
    <ellipse cx="105" cy="182" rx="75" ry="15" fill="rgba(0,0,0,0.4)"/>
    <polygon points="25,180 50,135 160,135 185,180" fill="#20252f" stroke="#111" stroke-width="2.5"/>
    <rect x="45" y="60" width="120" height="24" rx="3" fill="#e57d07" stroke="#12161f" stroke-width="2.5"/>
    <line x1="50" y1="72" x2="160" y2="72" stroke="#222" stroke-width="2"/>
    <rect x="42" y="80" width="18" height="60" fill="#2b313d" stroke="#111" stroke-width="2"/>
    <rect x="150" y="80" width="18" height="60" fill="#2b313d" stroke="#111" stroke-width="2"/>
    <rect x="88" y="75" width="34" height="26" rx="2" fill="#3f4857" stroke="#111" stroke-width="1.5"/>
    <path d="M 97 101 L 92 142 L 118 142 L 113 101 Z" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
    <line x1="105" y1="140" x2="105" y2="152" stroke="#7fe8ff" stroke-width="3" stroke-linecap="round" class="animate-ping"/>
    <circle cx="105" cy="152" r="4" fill="#ffffff" class="animate-pulse"/>
  </svg>`,

  foundation: `<svg class="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]" viewBox="0 0 240 180">
    <ellipse cx="120" cy="165" rx="90" ry="15" fill="rgba(0,0,0,0.5)"/>
    <!-- 混凝土大底座梯形方块 (1:1 截图中的地基4米) -->
    <polygon points="20,160 50,90 190,90 220,160" fill="#2d333f" stroke="#1a1e27" stroke-width="3"/>
    <polygon points="50,90 120,45 190,90 120,110" fill="#3d4656" stroke="#1a1e27" stroke-width="2"/>
    <polygon points="20,160 50,90 120,110 90,170" fill="#252a35" stroke="#111" stroke-width="2"/>
    <polygon points="220,160 190,90 120,110 150,170" fill="#1b2029" stroke="#111" stroke-width="2"/>
    <!-- 工业橙色顶边防撞护栏与刻度 -->
    <path d="M 45 88 L 120 42 L 195 88" fill="none" stroke="#f5921e" stroke-width="5" stroke-linecap="round"/>
    <line x1="80" y1="100" x2="80" y2="155" stroke="#111" stroke-width="3"/>
    <line x1="160" y1="100" x2="160" y2="155" stroke="#111" stroke-width="3"/>
    <rect x="105" y="120" width="30" height="20" rx="2" fill="#ffd400" stroke="#111" stroke-width="1.5"/>
  </svg>`,

  assembler: `<svg class="w-full h-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.85)]" viewBox="0 0 220 200">
    <ellipse cx="110" cy="180" rx="80" ry="16" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="60" width="150" height="110" rx="4" fill="#262d3a" stroke="#121620" stroke-width="3"/>
    <rect x="45" y="70" width="60" height="90" fill="#f5921e"/>
    <rect x="115" y="70" width="60" height="90" fill="#e0770b"/>
    <circle cx="75" cy="115" r="16" fill="#111"/>
    <circle cx="145" cy="115" r="16" fill="#111"/>
  </svg>`,

  storage_box: `<svg class="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 160 160">
    <ellipse cx="80" cy="145" rx="55" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="30" y="55" width="100" height="85" rx="3" fill="#e0770b" stroke="#111" stroke-width="3"/>
    <rect x="65" y="85" width="30" height="22" fill="#111"/>
    <line x1="30" y1="75" x2="130" y2="75" stroke="#ffaa33" stroke-width="3"/>
  </svg>`,

  conveyor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="115" rx="60" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="15,95 65,55 145,55 95,95" fill="#222b37" stroke="#111" stroke-width="2"/>
    <line x1="30" y1="85" x2="70" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <line x1="60" y1="85" x2="100" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <line x1="90" y1="85" x2="130" y2="65" stroke="#00f0ff" stroke-width="3"/>
    <rect x="25" y="95" width="10" height="20" fill="#111"/>
    <rect x="85" y="95" width="10" height="20" fill="#111"/>
  </svg>`,

  splitter: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="120" rx="50" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="35" width="90" height="70" rx="4" fill="#2a3342" stroke="#111" stroke-width="2"/>
    <rect x="50" y="50" width="60" height="40" fill="#e0770b"/>
    <polygon points="80,40 70,50 90,50" fill="#00f0ff"/>
    <polygon points="40,70 50,60 50,80" fill="#00f0ff"/>
    <polygon points="120,70 110,60 110,80" fill="#00f0ff"/>
  </svg>`,

  pipe: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 140">
    <ellipse cx="80" cy="115" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="20" y="55" width="120" height="28" rx="6" fill="#1a2736" stroke="#00f0ff" stroke-width="2"/>
    <circle cx="40" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
    <circle cx="80" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
    <circle cx="120" cy="69" r="8" fill="#00f0ff" opacity="0.7"/>
  </svg>`,

  vert_conveyor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 180">
    <ellipse cx="80" cy="165" rx="45" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="50" y="30" width="60" height="130" rx="4" fill="#222c3a" stroke="#111" stroke-width="2"/>
    <line x1="50" y1="60" x2="110" y2="60" stroke="#f5921e" stroke-width="2"/>
    <line x1="50" y1="90" x2="110" y2="90" stroke="#f5921e" stroke-width="2"/>
    <line x1="50" y1="120" x2="110" y2="120" stroke="#f5921e" stroke-width="2"/>
    <polygon points="80,40 70,55 90,55" fill="#00f0ff"/>
  </svg>`,

  power_burner: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="160" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="35,150 55,60 125,60 145,150" fill="#252d3a" stroke="#111" stroke-width="2.5"/>
    <circle cx="90" cy="115" r="26" fill="#f5921e" class="animate-pulse shadow-[0_0_18px_#ff9900]"/>
    <rect x="78" y="25" width="24" height="35" fill="#151a22" stroke="#111"/>
  </svg>`,

  power_engine: `<svg class="w-full h-full drop-shadow" viewBox="0 0 200 180">
    <ellipse cx="100" cy="160" rx="75" ry="14" fill="rgba(0,0,0,0.4)"/>
    <rect x="30" y="50" width="140" height="100" rx="6" fill="#182332" stroke="#00f0ff" stroke-width="2.5"/>
    <circle cx="100" cy="100" r="32" fill="none" stroke="#00f0ff" stroke-width="4" stroke-dasharray="10 5" class="animate-spin"/>
    <circle cx="100" cy="100" r="16" fill="#f5921e" class="animate-ping"/>
  </svg>`,

  water_pump: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 160">
    <ellipse cx="80" cy="140" rx="60" ry="12" fill="rgba(0,0,0,0.4)"/>
    <polygon points="30,135 45,70 115,70 130,135" fill="#1e2c3d" stroke="#111" stroke-width="2"/>
    <rect x="65" y="35" width="30" height="35" fill="#00f0ff" opacity="0.8"/>
    <ellipse cx="80" cy="135" rx="35" ry="8" fill="#38bdf8" opacity="0.6"/>
  </svg>`,

  purifier: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 180">
    <ellipse cx="80" cy="165" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <polygon points="40,155 60,35 100,35 120,155" fill="#202938" stroke="#111" stroke-width="2"/>
    <circle cx="80" cy="80" r="18" fill="#34d399" class="animate-pulse shadow-[0_0_15px_#34d399]"/>
    <circle cx="80" cy="35" r="8" fill="#10b981"/>
  </svg>`,

  portal: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="160" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="40" y="40" width="100" height="110" rx="8" fill="#161e2e" stroke="#a855f7" stroke-width="3"/>
    <ellipse cx="90" cy="95" rx="35" ry="45" fill="#7e22ce" class="animate-pulse shadow-[0_0_20px_#a855f7]"/>
    <ellipse cx="90" cy="95" rx="20" ry="28" fill="#e9d5ff" class="animate-ping"/>
  </svg>`,

  crusher: `<svg class="w-full h-full drop-shadow" viewBox="0 0 160 160">
    <ellipse cx="80" cy="140" rx="55" ry="10" fill="rgba(0,0,0,0.4)"/>
    <rect x="35" y="45" width="90" height="85" rx="4" fill="#293241" stroke="#111" stroke-width="2"/>
    <polygon points="50,60 80,95 110,60" fill="#e0770b"/>
    <line x1="80" y1="95" x2="80" y2="120" stroke="#f5921e" stroke-width="3"/>
  </svg>`,

  centrifuge: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="155" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="45" y="55" width="90" height="90" rx="6" fill="#1c2533" stroke="#111" stroke-width="2"/>
    <circle cx="90" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="8 4" class="animate-spin"/>
  </svg>`,

  deconstructor: `<svg class="w-full h-full drop-shadow" viewBox="0 0 180 180">
    <ellipse cx="90" cy="155" rx="65" ry="12" fill="rgba(0,0,0,0.4)"/>
    <rect x="40" y="50" width="100" height="95" rx="4" fill="#2b2025" stroke="#f43f5e" stroke-width="2"/>
    <line x1="55" y1="65" x2="125" y2="135" stroke="#f43f5e" stroke-width="3"/>
    <line x1="125" y1="65" x2="55" y2="135" stroke="#f43f5e" stroke-width="3"/>
  </svg>`,

  iron_beam_bld: `<svg class="w-full h-full drop-shadow" viewBox="0 0 200 120">
    <ellipse cx="100" cy="100" rx="70" ry="8" fill="rgba(0,0,0,0.4)"/>
    <rect x="20" y="50" width="160" height="22" fill="#3a4454" stroke="#111" stroke-width="2"/>
    <rect x="35" y="42" width="130" height="8" fill="#4b5563"/>
    <rect x="35" y="72" width="130" height="8" fill="#4b5563"/>
  </svg>`,

  storage_desk: `<svg class="w-full h-full drop-shadow" viewBox="0 0 140 120">
    <ellipse cx="70" cy="105" rx="45" ry="8" fill="rgba(0,0,0,0.4)"/>
    <rect x="25" y="45" width="90" height="15" rx="2" fill="#78350f" stroke="#111" stroke-width="1.5"/>
    <rect x="35" y="60" width="10" height="40" fill="#451a03"/>
    <rect x="95" y="60" width="10" height="40" fill="#451a03"/>
  </svg>`,

  mixer: `<svg class="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 200 200">
    <ellipse cx="100" cy="180" rx="70" ry="14" fill="rgba(0,0,0,0.4)"/>
    <!-- 重型不锈钢圆柱搅拌桶 -->
    <rect x="45" y="55" width="110" height="110" rx="8" fill="#1e293b" stroke="#00f0ff" stroke-width="2.5"/>
    <!-- 双轴旋转漩涡指示 -->
    <circle cx="100" cy="110" r="38" fill="#0c1b2c" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 4" class="animate-spin" style="animation-duration: 4s;"/>
    <!-- 搅拌叶片 -->
    <path d="M 80 110 Q 100 95, 120 110 T 100 125 Z" fill="#00f0ff" opacity="0.8" class="animate-spin" style="animation-duration: 2s; transform-origin: 100px 110px;"/>
    <!-- 顶部驱动电机与进料漏斗 -->
    <polygon points="75,25 125,25 115,55 85,55" fill="#e0770b" stroke="#111" stroke-width="2"/>
    <rect x="92" y="15" width="16" height="15" rx="2" fill="#38bdf8"/>
    <!-- 侧边高压流体进液法兰管 -->
    <rect x="25" y="85" width="22" height="16" fill="#0284c7" stroke="#00f0ff" stroke-width="1.5"/>
    <rect x="153" y="115" width="22" height="16" fill="#0284c7" stroke="#00f0ff" stroke-width="1.5"/>
  </svg>`,

  extractor: `<svg class="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 180 200">
    <ellipse cx="90" cy="180" rx="60" ry="12" fill="rgba(0,0,0,0.4)"/>
    <!-- 垂直冷凝萃取塔主体 -->
    <rect x="55" y="40" width="70" height="130" rx="6" fill="#142132" stroke="#2dd4bf" stroke-width="2.5"/>
    <!-- 冷凝玻璃螺旋管与回流滴液 -->
    <path d="M 90 55 C 75 70, 105 85, 90 100 C 75 115, 105 130, 90 145" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round"/>
    <circle cx="90" cy="148" r="4" fill="#5eead4" class="animate-ping"/>
    <!-- 顶部排气阀帽 -->
    <polygon points="70,40 110,40 90,20" fill="#0f766e" stroke="#111" stroke-width="1.5"/>
    <line x1="90" y1="20" x2="90" y2="10" stroke="#2dd4bf" stroke-width="3"/>
  </svg>`,

  incubator: `<svg class="w-full h-full drop-shadow-[0_14px_22px_rgba(0,0,0,0.85)]" viewBox="0 0 200 210">
    <ellipse cx="100" cy="185" rx="75" ry="14" fill="rgba(0,0,0,0.45)"/>
    <!-- 双层加压透明生物穹顶 -->
    <rect x="40" y="50" width="120" height="125" rx="12" fill="#061e16" stroke="#10b981" stroke-width="2.5"/>
    <!-- 内部翡翠高纯灵液与气泡 -->
    <rect x="48" y="85" width="104" height="82" rx="6" fill="rgba(16,185,129,0.35)"/>
    <circle cx="70" cy="140" r="4" fill="#34d399" class="animate-bounce" style="animation-duration: 2.2s;"/>
    <circle cx="110" cy="120" r="5" fill="#6ee7b7" class="animate-bounce" style="animation-duration: 1.7s;"/>
    <circle cx="130" cy="150" r="3" fill="#a7f3d0" class="animate-bounce" style="animation-duration: 2.5s;"/>
    <!-- 中央悬浮灵草幼胚 -->
    <g transform="translate(100, 115) scale(1.2)">
      <path d="M 0 15 Q -10 5, -12 -8 Q -5 -4, 0 15" fill="#34d399"/>
      <path d="M 0 15 Q 10 5, 12 -8 Q 5 -4, 0 15" fill="#10b981"/>
      <circle cx="0" cy="-6" r="3" fill="#fbbf24" class="animate-pulse"/>
    </g>
    <!-- 顶部时间加速器悬浮金环 -->
    <ellipse cx="100" cy="45" rx="42" ry="12" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="12 6" class="animate-spin" style="animation-duration: 6s;"/>
  </svg>`,

  petri_dish: `<svg class="w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]" viewBox="0 0 200 160">
    <ellipse cx="100" cy="140" rx="75" ry="14" fill="rgba(0,0,0,0.4)"/>
    <!-- 晶化微培深底浅盘 -->
    <ellipse cx="100" cy="100" rx="80" ry="35" fill="#042f2e" stroke="#2dd4bf" stroke-width="3"/>
    <ellipse cx="100" cy="95" rx="70" ry="28" fill="#115e59" stroke="#5eead4" stroke-width="1.5"/>
    <!-- 菌丝与孢子生长微光斑点 -->
    <circle cx="85" cy="95" r="10" fill="#2dd4bf" opacity="0.8" class="animate-pulse"/>
    <circle cx="115" cy="90" r="12" fill="#14b8a6" opacity="0.7"/>
    <circle cx="100" cy="102" r="8" fill="#5eead4" class="animate-ping" style="animation-duration: 3s;"/>
    <!-- 培养皿透明顶盖高光折射 -->
    <ellipse cx="100" cy="75" rx="74" ry="26" fill="rgba(255,255,255,0.12)" stroke="#99f6e4" stroke-width="1"/>
  </svg>`,

  fluid_hub: `<svg class="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]" viewBox="0 0 220 200">
    <ellipse cx="110" cy="180" rx="85" ry="16" fill="rgba(0,0,0,0.5)"/>
    <!-- 重型高压流体母座底盘 (BD_132) -->
    <rect x="30" y="90" width="160" height="85" rx="8" fill="#0c1b2c" stroke="#38bdf8" stroke-width="3"/>
    <!-- 左右三向高压流体管道与法兰 -->
    <rect x="15" y="115" width="20" height="24" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <rect x="185" y="115" width="20" height="24" rx="3" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <!-- 双压力指示表盘 -->
    <circle cx="70" cy="132" r="16" fill="#08101a" stroke="#38bdf8" stroke-width="2"/>
    <line x1="70" y1="132" x2="80" y2="124" stroke="#f5921e" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="150" cy="132" r="16" fill="#08101a" stroke="#38bdf8" stroke-width="2"/>
    <line x1="150" y1="132" x2="142" y2="122" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
    <!-- 顶部单插槽标准卡座平台 -->
    <polygon points="50,90 70,65 150,65 170,90" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
    <rect x="80" y="58" width="60" height="10" rx="2" fill="#0284c7"/>
  </svg>`,

  bio_base: `<svg class="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]" viewBox="0 0 220 200">
    <ellipse cx="110" cy="180" rx="85" ry="16" fill="rgba(0,0,0,0.5)"/>
    <!-- 生物合金机械底座 (BD_130) -->
    <rect x="30" y="90" width="160" height="85" rx="8" fill="#092019" stroke="#10b981" stroke-width="3"/>
    <!-- 翡翠高纯灵液管带与微孔注入流光 -->
    <rect x="15" y="115" width="20" height="24" rx="3" fill="#047857" stroke="#10b981" stroke-width="2"/>
    <rect x="185" y="115" width="20" height="24" rx="3" fill="#047857" stroke="#10b981" stroke-width="2"/>
    <line x1="45" y1="135" x2="175" y2="135" stroke="#34d399" stroke-width="4" stroke-dasharray="10 5" class="animate-pulse"/>
    <!-- 顶部生物设备安装卡口 -->
    <polygon points="50,90 70,65 150,65 170,90" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
    <rect x="80" y="58" width="60" height="10" rx="2" fill="#10b981"/>
    <circle cx="110" cy="135" r="18" fill="#022c22" stroke="#34d399" stroke-width="2"/>
    <i class="fa-solid fa-leaf text-emerald-400 text-xs"></i>
  </svg>`
};

// 场景中的活跃建筑实体列表 (三层立体叠加高产工厂：4矿机+4精炼+11初级加工+4重型组装+2离心+2解构+3炼宝台+2渡劫台+8垂直电梯)
let worldBuildings = [
  {
    "id": "bld_wind_1",
    "type": "wind_generator",
    "name": "风力发电机 #1",
    "power": "+45 MW",
    "wx": -22,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_2",
    "type": "wind_generator",
    "name": "风力发电机 #2",
    "power": "+45 MW",
    "wx": -16,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_3",
    "type": "wind_generator",
    "name": "风力发电机 #3",
    "power": "+45 MW",
    "wx": -10,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_4",
    "type": "wind_generator",
    "name": "风力发电机 #4",
    "power": "+45 MW",
    "wx": -4,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_1",
    "type": "fuel_generator",
    "name": "燃料发电机 #1",
    "power": "+100 MW",
    "wx": 2,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_2",
    "type": "fuel_generator",
    "name": "燃料发电机 #2",
    "power": "+100 MW",
    "wx": 8,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_3",
    "type": "fuel_generator",
    "name": "燃料发电机 #3",
    "power": "+100 MW",
    "wx": 14,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_engine_init",
    "type": "power_engine",
    "name": "灵力引擎 #1 (BD_147)",
    "power": "+50 MW",
    "wx": 22,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_miner_fe1",
    "type": "miner",
    "name": "采矿机 #1 (玄铁矿)",
    "power": "5 MW",
    "wx": -21,
    "wy": 0,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_m1",
    "type": "conveyor",
    "name": "传送带｜玄铁矿 #1",
    "power": "2 MW",
    "wx": -16,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_001"
  },
  {
    "id": "bld_miner_fe2",
    "type": "miner",
    "name": "采矿机 #2 (玄铁矿)",
    "power": "5 MW",
    "wx": -29,
    "wy": 0,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_m2",
    "type": "conveyor",
    "name": "传送带｜玄铁矿 #2",
    "power": "2 MW",
    "wx": -20,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 12,
    "beltItem": "MAT_001"
  },
  {
    "id": "bld_miner_cu1",
    "type": "miner",
    "name": "采矿机 #3 (赤铜矿)",
    "power": "5 MW",
    "wx": -21,
    "wy": 0,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_m3",
    "type": "conveyor",
    "name": "传送带｜赤铜矿 #1",
    "power": "2 MW",
    "wx": -16,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_002"
  },
  {
    "id": "bld_miner_cu2",
    "type": "miner",
    "name": "采矿机 #4 (赤铜矿)",
    "power": "5 MW",
    "wx": -29,
    "wy": 0,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_m4",
    "type": "conveyor",
    "name": "传送带｜赤铜矿 #2",
    "power": "2 MW",
    "wx": -20,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 12,
    "beltItem": "MAT_002"
  },
  {
    "id": "bld_handcraft_init",
    "type": "handcraft",
    "name": "操作台 (BD_152)",
    "power": "5 MW",
    "wx": -22,
    "wy": 0,
    "wz": 17,
    "rot": 0
  },
  {
    "id": "bld_pump_1",
    "type": "pump",
    "name": "抽水机 #1 (水源)",
    "power": "10 MW",
    "wx": -15,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s1",
    "type": "pipe",
    "name": "水管｜供水直管",
    "power": "0 MW",
    "wx": -11,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_pump_2",
    "type": "pump",
    "name": "抽水机 #2 (增压)",
    "power": "10 MW",
    "wx": -7,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s2",
    "type": "pipe",
    "name": "水管｜三通汇流",
    "power": "0 MW",
    "wx": -4,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 2
  },
  {
    "id": "bld_fluid_hub_init",
    "type": "fluid_hub",
    "name": "1楼流体中枢 (BD_158)",
    "power": "0 MW",
    "wx": 1,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s3",
    "type": "pipe",
    "name": "水管｜营养液",
    "power": "0 MW",
    "wx": 7,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_bio_base_init",
    "type": "bio_base",
    "name": "1楼营养基座 (BD_159)",
    "power": "0 MW",
    "wx": 11,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s4",
    "type": "pipe",
    "name": "水管｜废液回流",
    "power": "0 MW",
    "wx": 15,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_purifier_1",
    "type": "purifier",
    "name": "1楼回收处理塔 (BD_150)",
    "power": "20 MW",
    "wx": 19,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_f1_-12_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_0_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_6_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_12_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_18_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_0_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_6_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_12_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_18_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_0_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_6_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_12_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_18_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_0_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_6_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_12_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_18_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_furnace_1",
    "type": "furnace",
    "name": "1楼精炼炉 #1 (玄铁锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_f_1",
    "type": "conveyor",
    "name": "传送带｜玄铁锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_split_1",
    "type": "splitter",
    "name": "分流器 #1",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_furnace_2",
    "type": "furnace",
    "name": "1楼精炼炉 #2 (玄铁锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_f_2",
    "type": "conveyor",
    "name": "传送带｜玄铁锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_split_2",
    "type": "splitter",
    "name": "分流器 #2",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_furnace_3",
    "type": "furnace",
    "name": "1楼精炼炉 #3 (赤铜锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_f_3",
    "type": "conveyor",
    "name": "传送带｜赤铜锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_split_3",
    "type": "splitter",
    "name": "分流器 #3",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_furnace_4",
    "type": "furnace",
    "name": "1楼精炼炉 #4 (赤铜锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_f_4",
    "type": "conveyor",
    "name": "传送带｜赤铜锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_split_4",
    "type": "splitter",
    "name": "分流器 #4",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1a1",
    "type": "conveyor",
    "name": "传送带｜进加工台",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_asm_1",
    "type": "assembler",
    "name": "1楼加工台 #1 (玄铁板)",
    "power": "10 MW",
    "wx": 2,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a2",
    "type": "conveyor",
    "name": "传送带｜玄铁板",
    "power": "2 MW",
    "wx": 5.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_008"
  },
  {
    "id": "bld_asm_2",
    "type": "assembler",
    "name": "1楼加工台 #2 (玄铁齿轮)",
    "power": "10 MW",
    "wx": 9,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a3",
    "type": "conveyor",
    "name": "传送带｜玄铁齿轮",
    "power": "2 MW",
    "wx": 12.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_011"
  },
  {
    "id": "bld_asm_3",
    "type": "assembler",
    "name": "1楼加工台 #3 (玄铁梁)",
    "power": "10 MW",
    "wx": 16,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a4",
    "type": "conveyor",
    "name": "传送带｜玄铁梁→1号电梯",
    "power": "2 MW",
    "wx": 19.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_014"
  },
  {
    "id": "bld_belt_1b1",
    "type": "conveyor",
    "name": "传送带｜进加工台",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_asm_4",
    "type": "assembler",
    "name": "1楼加工台 #4 (设备管件)",
    "power": "10 MW",
    "wx": 2,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b2",
    "type": "conveyor",
    "name": "传送带｜进粉碎机",
    "power": "2 MW",
    "wx": 5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 2,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_crush_1",
    "type": "crusher",
    "name": "1楼粉碎机 #1 (玄铁粉)",
    "power": "20 MW",
    "wx": 7,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b3",
    "type": "conveyor",
    "name": "传送带｜玄铁粉",
    "power": "2 MW",
    "wx": 9.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_crush_2",
    "type": "crusher",
    "name": "1楼粉碎机 #2 (玄铁粉)",
    "power": "20 MW",
    "wx": 12,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b4",
    "type": "conveyor",
    "name": "传送带｜玄铁粉",
    "power": "2 MW",
    "wx": 14.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_crush_3",
    "type": "crusher",
    "name": "1楼粉碎机 #3 (玄铁粉)",
    "power": "20 MW",
    "wx": 17,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b5",
    "type": "conveyor",
    "name": "传送带｜玄铁粉→2号电梯",
    "power": "2 MW",
    "wx": 19.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_belt_1c0_1",
    "type": "conveyor",
    "name": "传送带｜赤铜锭→切割机",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_cut_1_1",
    "type": "cutter",
    "name": "1楼切割机 #1A (导灵铜片)",
    "power": "25 MW",
    "wx": 1,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c1_1",
    "type": "conveyor",
    "name": "传送带｜导灵铜片",
    "power": "2 MW",
    "wx": 3.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cut_1_2",
    "type": "cutter",
    "name": "1楼切割机 #1B (铜线)",
    "power": "25 MW",
    "wx": 6,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c2_1",
    "type": "conveyor",
    "name": "传送带｜铜线",
    "power": "2 MW",
    "wx": 8.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_cut_1_3",
    "type": "cutter",
    "name": "1楼切割机 #1C (木结构件)",
    "power": "25 MW",
    "wx": 11,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c3_1",
    "type": "conveyor",
    "name": "传送带｜铜线→合流",
    "power": "2 MW",
    "wx": 13.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_merger_1f_1",
    "type": "merger",
    "name": "1楼合流器 #1",
    "power": "2 MW",
    "wx": 16,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c4_1",
    "type": "conveyor",
    "name": "传送带｜送往垂直电梯",
    "power": "2 MW",
    "wx": 19,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_belt_1c0_2",
    "type": "conveyor",
    "name": "传送带｜赤铜锭→切割机",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_cut_2_1",
    "type": "cutter",
    "name": "1楼切割机 #2A (导灵铜片)",
    "power": "25 MW",
    "wx": 1,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c1_2",
    "type": "conveyor",
    "name": "传送带｜导灵铜片",
    "power": "2 MW",
    "wx": 3.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cut_2_2",
    "type": "cutter",
    "name": "1楼切割机 #2B (铜线)",
    "power": "25 MW",
    "wx": 6,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c2_2",
    "type": "conveyor",
    "name": "传送带｜铜线",
    "power": "2 MW",
    "wx": 8.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_cut_2_3",
    "type": "cutter",
    "name": "1楼切割机 #2C (木结构件)",
    "power": "25 MW",
    "wx": 11,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c3_2",
    "type": "conveyor",
    "name": "传送带｜铜线→合流",
    "power": "2 MW",
    "wx": 13.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_merger_1f_2",
    "type": "merger",
    "name": "1楼合流器 #2",
    "power": "2 MW",
    "wx": 16,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c4_2",
    "type": "conveyor",
    "name": "传送带｜送往垂直电梯",
    "power": "2 MW",
    "wx": 19,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_lift_12_1",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #1",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_014"
  },
  {
    "id": "bld_lift_12_2",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #2",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_lift_12_3",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #3",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_lift_12_4",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #4",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_col_a_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 0,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_b_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 8,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_c_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 16,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_d_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": -16,
    "wy": 24,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_a_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 0,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_b_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 8,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_c_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 16,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_d_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": -16,
    "wy": 24,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_a_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 0,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_b_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 8,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_c_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 16,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_d_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": 22,
    "wy": 24,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_a_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 0,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_b_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 8,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_c_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 16,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_d_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": 22,
    "wy": 24,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_0_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_6_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_12_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_18_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_0_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_6_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_12_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_18_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_0_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_6_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_12_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_18_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_0_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_6_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_12_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_18_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_belt_2e_1",
    "type": "conveyor",
    "name": "2楼传送带｜电梯出料",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_hasm_1_1",
    "type": "assembler_heavy",
    "name": "2楼组装机 #1A (控制模块)",
    "power": "50 MW",
    "wx": 14,
    "wy": 16,
    "wz": -6,
    "rot": 90
  },
  {
    "id": "bld_belt_2m_1",
    "type": "conveyor",
    "name": "2楼传送带｜控制模块",
    "power": "2 MW",
    "wx": 9,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_hasm_1_2",
    "type": "assembler_heavy",
    "name": "2楼组装机 #1B (生物控制芯)",
    "power": "50 MW",
    "wx": 4,
    "wy": 16,
    "wz": -6,
    "rot": 90
  },
  {
    "id": "bld_belt_2w_1",
    "type": "conveyor",
    "name": "2楼传送带｜控制芯→2F电梯",
    "power": "2 MW",
    "wx": -7,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 16,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_belt_2e_2",
    "type": "conveyor",
    "name": "2楼传送带｜电梯出料",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_hasm_2_1",
    "type": "assembler_heavy",
    "name": "2楼组装机 #2A (控制模块)",
    "power": "50 MW",
    "wx": 14,
    "wy": 16,
    "wz": 0,
    "rot": 90
  },
  {
    "id": "bld_belt_2m_2",
    "type": "conveyor",
    "name": "2楼传送带｜控制模块",
    "power": "2 MW",
    "wx": 9,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_hasm_2_2",
    "type": "assembler_heavy",
    "name": "2楼组装机 #2B (生物控制芯)",
    "power": "50 MW",
    "wx": 4,
    "wy": 16,
    "wz": 0,
    "rot": 90
  },
  {
    "id": "bld_belt_2w_2",
    "type": "conveyor",
    "name": "2楼传送带｜控制芯→2F电梯",
    "power": "2 MW",
    "wx": -7,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 16,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_belt_2c1",
    "type": "conveyor",
    "name": "2楼传送带｜生物液进离心机",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cent_2_1",
    "type": "centrifuge",
    "name": "2楼离心机 #1",
    "power": "35 MW",
    "wx": 15,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c2",
    "type": "conveyor",
    "name": "2楼传送带｜级联离心",
    "power": "2 MW",
    "wx": 11,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cent_2_2",
    "type": "centrifuge",
    "name": "2楼离心机 #2",
    "power": "35 MW",
    "wx": 7,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c3",
    "type": "conveyor",
    "name": "2楼传送带｜进解构机",
    "power": "2 MW",
    "wx": 3,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_decon_2_1",
    "type": "deconstructor",
    "name": "2楼解构机 #1 (BD_140)",
    "power": "55 MW",
    "wx": -3,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c4",
    "type": "conveyor",
    "name": "2楼传送带｜生物组织",
    "power": "2 MW",
    "wx": -11,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 8,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_belt_2d1",
    "type": "conveyor",
    "name": "2楼传送带｜进2号解构",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 12,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_008"
  },
  {
    "id": "bld_decon_2_2",
    "type": "deconstructor",
    "name": "2楼解构机 #2 (BD_140)",
    "power": "55 MW",
    "wx": 13,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_pipe_2f_1",
    "type": "pipe",
    "name": "2楼水管｜流体输送",
    "power": "0 MW",
    "wx": 7,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_fluid_hub_2",
    "type": "fluid_hub",
    "name": "2楼流体中枢 (BD_158)",
    "power": "0 MW",
    "wx": 1,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_pipe_2f_2",
    "type": "pipe",
    "name": "2楼水管｜营养液",
    "power": "0 MW",
    "wx": -4,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "pipeLen": 2
  },
  {
    "id": "bld_bio_base_2",
    "type": "bio_base",
    "name": "2楼营养基座 (BD_159)",
    "power": "0 MW",
    "wx": -7,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_purifier_2",
    "type": "purifier",
    "name": "2楼回收塔 (BD_150)",
    "power": "20 MW",
    "wx": -12,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_lift_23_1",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #1",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": -6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_lift_23_2",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #2",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 0,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_lift_23_3",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #3",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_lift_23_4",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #4",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 12,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_f3_-12_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_0_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_6_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_12_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_18_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_0_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_6_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_12_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_18_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_0_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_6_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_12_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_18_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_0_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_6_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_12_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_18_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_belt_3w1",
    "type": "conveyor",
    "name": "3楼传送带｜进引擎",
    "power": "2 MW",
    "wx": -14,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 2,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_engine_3f",
    "type": "power_engine",
    "name": "3楼灵力引擎 #2 (高温冶炼)",
    "power": "+50 MW",
    "wx": -10,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_belt_3w2",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#1",
    "power": "2 MW",
    "wx": -5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_043"
  },
  {
    "id": "bld_belt_3w3",
    "type": "conveyor",
    "name": "3楼传送带｜进冶炼舱#1",
    "power": "2 MW",
    "wx": -13,
    "wy": 30,
    "wz": 3,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_chamber_3_1",
    "type": "smelt_chamber",
    "name": "3楼冶炼舱 #1 (高温合金)",
    "power": "65 MW",
    "wx": -10,
    "wy": 30,
    "wz": 3,
    "rot": 270
  },
  {
    "id": "bld_belt_3w4",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#2",
    "power": "2 MW",
    "wx": -6,
    "wy": 30,
    "wz": 3,
    "rot": 270,
    "beltLen": 6,
    "beltItem": "MAT_043"
  },
  {
    "id": "bld_belt_3w5",
    "type": "conveyor",
    "name": "3楼传送带｜进冶炼舱#2",
    "power": "2 MW",
    "wx": -13,
    "wy": 30,
    "wz": 11,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_chamber_3_2",
    "type": "smelt_chamber",
    "name": "3楼冶炼舱 #2 (导脉合金)",
    "power": "65 MW",
    "wx": -10,
    "wy": 30,
    "wz": 11,
    "rot": 270
  },
  {
    "id": "bld_belt_3w6",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#3",
    "power": "2 MW",
    "wx": -6,
    "wy": 30,
    "wz": 11,
    "rot": 270,
    "beltLen": 6,
    "beltItem": "mat_068"
  },
  {
    "id": "bld_alchemy_1",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #1",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_alchemy_2",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #2",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": 3.5,
    "rot": 270
  },
  {
    "id": "bld_alchemy_3",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #3",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_3e1",
    "type": "conveyor",
    "name": "3楼传送带｜法宝胚 #1",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_lim_3_1",
    "type": "conveyor_limiter",
    "name": "3楼限速器 #1",
    "power": "1 MW",
    "wx": 9,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_belt_3e2",
    "type": "conveyor",
    "name": "3楼传送带｜进渡劫台 #1",
    "power": "2 MW",
    "wx": 10.5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 1,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_trib_1",
    "type": "tribulation_table",
    "name": "3楼渡劫台 #1 (终局产出)",
    "power": "80 MW",
    "wx": 16,
    "wy": 30,
    "wz": -4,
    "rot": 270
  },
  {
    "id": "bld_belt_3e3",
    "type": "conveyor",
    "name": "3楼传送带｜法宝胚 #2",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": 4,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_lim_3_2",
    "type": "conveyor_limiter",
    "name": "3楼限速器 #2",
    "power": "1 MW",
    "wx": 9,
    "wy": 30,
    "wz": 4,
    "rot": 270
  },
  {
    "id": "bld_belt_3e4",
    "type": "conveyor",
    "name": "3楼传送带｜进渡劫台 #2",
    "power": "2 MW",
    "wx": 10.5,
    "wy": 30,
    "wz": 4,
    "rot": 270,
    "beltLen": 1,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_trib_2",
    "type": "tribulation_table",
    "name": "3楼渡劫台 #2 (终局产出)",
    "power": "80 MW",
    "wx": 16,
    "wy": 30,
    "wz": 7,
    "rot": 270
  },
  {
    "id": "bld_belt_3e5",
    "type": "conveyor",
    "name": "3楼传送带｜法宝成品入库",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": 13,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_desk_3_1",
    "type": "storage_desk",
    "name": "3楼置物桌｜小桌板 #1",
    "power": "0 MW",
    "wx": 9,
    "wy": 30,
    "wz": 13,
    "rot": 0,
    "displayItem": "mat_072"
  },
  {
    "id": "bld_box_3_1a",
    "type": "storage_box",
    "name": "成品储藏盒 #1-1",
    "power": "0 MW",
    "wx": 9,
    "wy": 32,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_box_3_1b",
    "type": "storage_box",
    "name": "成品储藏盒 #1-2",
    "power": "0 MW",
    "wx": 9,
    "wy": 34,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_box_3_1c",
    "type": "storage_box",
    "name": "成品储藏盒 #1-3",
    "power": "0 MW",
    "wx": 9,
    "wy": 36,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_f1_show_1",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_2",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_3",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_4",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_1",
    "type": "storage_desk",
    "name": "1楼置物桌｜小桌板 #1",
    "power": "0 MW",
    "wx": -8,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_box",
    "type": "storage_box",
    "name": "桌面储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": -8,
    "wy": 4,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_2",
    "type": "storage_desk",
    "name": "1楼置物桌｜小桌板 #2",
    "power": "0 MW",
    "wx": -4,
    "wy": 2,
    "wz": 22,
    "rot": 0,
    "displayItem": "mat_100"
  },
  {
    "id": "bld_desk_1_tall",
    "type": "bd_154",
    "name": "1楼高置物桌｜1×1×2",
    "power": "0 MW",
    "wx": 0,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_tall_box",
    "type": "storage_box",
    "name": "高桌储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": 0,
    "wy": 6,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_111",
    "type": "storage_box",
    "name": "储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": 4,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_211",
    "type": "bd_114",
    "name": "窄柜｜2×1×1",
    "power": "0 MW",
    "wx": 9,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_121",
    "type": "bd_115",
    "name": "宽柜｜1×2×1",
    "power": "0 MW",
    "wx": 13,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_tower_160_1",
    "type": "bd_160",
    "name": "飞剑防御塔 #1",
    "power": "25 MW",
    "wx": -26,
    "wy": 0,
    "wz": 21,
    "rot": 0
  },
  {
    "id": "bld_desk_2_1",
    "type": "storage_desk",
    "name": "2楼置物桌｜血胎样本",
    "power": "0 MW",
    "wx": -8,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "displayItem": "mat_032"
  },
  {
    "id": "bld_desk_2_2",
    "type": "storage_desk",
    "name": "2楼置物桌｜生物芯片",
    "power": "0 MW",
    "wx": 16,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "displayItem": "mat_015"
  },
  {
    "id": "bld_pill_163_1",
    "type": "bd_163",
    "name": "3楼炼丹炉（上）",
    "power": "20 MW",
    "wx": -4,
    "wy": 30,
    "wz": 12,
    "rot": 0
  }
];

// 建造模式与拆除模式状态机
let isBuildPlacingMode = false;
let currentPlacingBuildingKey = 'foundation';
let placingRotationAngle = 0; // 滚轮旋转角度
let currentHoveredBuildingId = null;

// 3秒拆除交互状态
let isDismantlingActive = false;
let dismantleStartTime = 0;
let dismantleAnimFrame = null;
let currentDismantleTarget = null;
const DISMANTLE_DURATION_MS = 3000; // 3秒拆除

// ---------------------------------------------------------------------
// 1. 场景建筑渲染管线
// ---------------------------------------------------------------------
function renderWorldBuildings() {
  if (window.World3D && window.World3D.isReady()) {
    window.World3D.syncBuildings();
    return;
  }
  const container = document.getElementById('worldBuildingsContainer');
  if (!container) return;
  container.innerHTML = '';

  worldBuildings.forEach(bld => {
    const el = document.createElement('div');
    el.id = bld.id;

    // ==================== 特殊复合建筑处理：灵力引擎 BD_112 (底座为主动加工器，顶部放3个被动冶炼舱) ====================
    if (bld.type === 'power_engine') {
      el.className = 'machine-entity composite-engine-entity pointer-events-auto absolute select-none transition-all duration-200';
      el.style.left = `${bld.x}%`;
      el.style.top = `${bld.y}%`;
      el.style.width = `${bld.width || 240}px`;
      el.style.height = `${bld.height || 235}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

      // 总悬浮标签 (置于顶部3个插件之上)
      const tagHtml = `
        <div class="machine-tag absolute top-[-6px] left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1 z-30">
          <div class="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md border border-[#00f0ff] px-2.5 py-1 rounded shadow-xl">
            <span class="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span class="text-[11px] font-bold text-[#00f0ff] font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
            <span class="text-[9px] text-white/60 bg-white/10 px-1 rounded">${bld.power || '+50 MW'}</span>
          </div>
          <div class="w-1.5 h-1.5 bg-[#00f0ff] rotate-45 -mt-0.5"></div>
        </div>
      `;

      // 1. 【上面三个】：3联装外部模型插槽 (1:1 还原 media_1790624792085.png 用户红框标出的三个位置)
      const slotsData = (typeof engineChamberSlots !== 'undefined') ? engineChamberSlots : [
        { slotIndex: 0, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #1 (BD_113)' },
        { slotIndex: 1, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #2 (BD_113)' },
        { slotIndex: 2, mounted: true, chamberId: 'smelt_chamber', name: '冶炼舱 #3 (BD_113)' }
      ];

      const topRow = document.createElement('div');
      topRow.className = 'top-chambers-deck flex items-end justify-between space-x-2 w-full h-[85px] px-2 pointer-events-auto relative z-20';

      slotsData.forEach((slot, i) => {
        const chamberEl = document.createElement('div');
        chamberEl.id = `top_chamber_slot_${i}`;
        chamberEl.className = 'relative flex-1 h-[80px] rounded transition-all duration-150 cursor-pointer select-none';

        if (slot.mounted) {
          // 冶炼舱3D模型方块 (橙金烈焰工业外壳 + 高温熔炼动态粒子)
          chamberEl.innerHTML = `
            <div class="chamber-box-inner w-full h-full border-2 border-amber-500/80 hover:border-amber-300 bg-[#141b25] hover:bg-[#1a2332] rounded flex flex-col items-center justify-between p-1.5 shadow-[0_0_12px_rgba(245,146,30,0.35)] hover:shadow-[0_0_20px_#f5921e] hover:scale-105 transition-all">
              <div class="w-full flex items-center justify-between text-[8px] font-mono font-bold text-amber-300 border-b border-amber-500/30 pb-0.5">
                <span>#${i + 1}</span>
                <span class="text-[7.5px] px-1 rounded bg-amber-500/20 text-amber-200">BD_113</span>
              </div>
              <div class="relative w-8 h-7 bg-[#1c1815] border border-amber-500/60 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
                <div class="w-5 h-5 rounded-full bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300 animate-pulse shadow-[0_0_12px_#f59e0b]"></div>
                <i class="fa-solid fa-fire text-yellow-200 text-xs absolute animate-bounce" style="animation-duration: 1.5s;"></i>
              </div>
              <div class="w-full flex items-center justify-between text-[7.5px] font-mono">
                <span class="text-amber-200 font-bold">冶炼舱</span>
                <span class="text-emerald-400 font-bold flex items-center space-x-0.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span><span>被动</span></span>
              </div>
            </div>
            <!-- 导热底座连通件 -->
            <div class="w-2.5 h-1.5 bg-amber-500/80 mx-auto -mt-0.5 rounded-b-xs shadow"></div>
          `;

          // 悬停与交互
          chamberEl.onmouseenter = (e) => {
            e.stopPropagation();
            if (typeof setTargetMachine === 'function') setTargetMachine(`smelt_chamber_${i}`);
          };
          chamberEl.onmouseleave = (e) => {
            e.stopPropagation();
            if (typeof clearTargetMachine === 'function') clearTargetMachine(`smelt_chamber_${i}`);
          };
          // 点击打开上面对应的被动加工器面板！
          chamberEl.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof openPassiveChamberSlot === 'function') {
              openPassiveChamberSlot(i);
            }
          };
          // 右键拆卸外部模型返还背包
          chamberEl.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof undockChamberModel === 'function') {
              undockChamberModel(i);
            }
          };
        } else {
          // 空置插槽 (虚线框 + 号)
          chamberEl.innerHTML = `
            <div class="w-full h-full border-2 border-dashed border-cyan-400/40 hover:border-cyan-300 bg-black/40 hover:bg-cyan-950/30 rounded flex flex-col items-center justify-center p-1 transition-all">
              <i class="fa-solid fa-plus text-cyan-400 text-sm mb-1 animate-pulse"></i>
              <span class="text-[8px] font-mono text-cyan-300">#${i + 1} 空置</span>
              <span class="text-[7px] text-white/40">点击安装</span>
            </div>
          `;
          chamberEl.onmouseenter = (e) => {
            e.stopPropagation();
            if (typeof setTargetMachine === 'function') setTargetMachine(`smelt_slot_empty_${i}`);
          };
          chamberEl.onmouseleave = (e) => {
            e.stopPropagation();
            if (typeof clearTargetMachine === 'function') clearTargetMachine(`smelt_slot_empty_${i}`);
          };
          chamberEl.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof mountChamberModel === 'function') {
              mountChamberModel(i);
            }
          };
        }

        topRow.appendChild(chamberEl);
      });

      // 2. 【下面座子】：底下的灵力引擎母机 (1:1 还原 media_1790624792085.png 青色大方块)
      const baseEl = document.createElement('div');
      baseEl.id = `bottom_engine_base`;
      baseEl.className = 'bottom-base-engine relative w-full h-[150px] border-2 border-[#00f0ff] hover:border-white rounded-md bg-[#111925]/95 hover:bg-[#152030] shadow-[0_0_18px_rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,240,255,0.8)] transition-all duration-200 cursor-pointer overflow-hidden p-2 flex flex-col justify-between';

      baseEl.innerHTML = `
        <!-- 顶栏状态与供能参数 -->
        <div class="flex items-center justify-between w-full text-[10px] font-mono font-bold text-cyan-300 px-1 border-b border-cyan-500/20 pb-1">
          <span class="flex items-center space-x-1"><i class="fa-solid fa-bolt text-cyan-400"></i><span>+50 MW</span></span>
          <span class="text-white/90">灵力引擎 BD_112</span>
          <span class="flex items-center space-x-1 text-amber-400"><i class="fa-solid fa-fire text-amber-500"></i><span>150☼</span></span>
        </div>

        <!-- 中央旋转能量反应炉 -->
        <div class="relative w-full h-16 flex items-center justify-center my-0.5">
          <div class="absolute w-16 h-16 border-2 border-dashed border-[#00f0ff] rounded-full animate-spin" style="animation-duration: 7s;"></div>
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-amber-400 animate-pulse shadow-[0_0_16px_#00f0ff] flex items-center justify-center">
            <i class="fa-solid fa-atom text-slate-900 text-xs"></i>
          </div>
          <!-- 左右两侧热能输出引流线圈 -->
          <div class="absolute left-3 w-8 h-[2px] bg-gradient-to-r from-transparent to-[#00f0ff]"></div>
          <div class="absolute right-3 w-8 h-[2px] bg-gradient-to-l from-transparent to-[#00f0ff]"></div>
        </div>

        <!-- 底栏：主动加工器徽章与端口提示 -->
        <div class="w-full flex items-center justify-between pt-1 border-t border-cyan-500/20 px-1">
          <span class="text-[8.5px] font-mono text-cyan-200/70">正面×1 ➔ 无线供能/供热</span>
          <span class="px-2 py-0.5 rounded-full bg-black/60 border border-cyan-400/40 text-[8px] font-mono font-bold text-cyan-300">
            主动加工器 · 复合底座
          </span>
        </div>
      `;

      // 悬停与点击事件：下面座子独立打开主动加工器面板！
      baseEl.onmouseenter = (e) => {
        e.stopPropagation();
        if (typeof setTargetMachine === 'function') setTargetMachine('power_engine');
      };
      baseEl.onmouseleave = (e) => {
        e.stopPropagation();
        if (typeof clearTargetMachine === 'function') clearTargetMachine('power_engine');
      };
      baseEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openMachineHUD === 'function') {
          openMachineHUD('power_engine'); // 打开正常的主动加工器面板！
        }
      };
      baseEl.oncontextmenu = (e) => {
        handleBuildingRightClick(e, bld);
      };

      // 组装整体并挂载
      el.innerHTML = tagHtml;
      el.appendChild(topRow);
      el.appendChild(baseEl);
      container.appendChild(el);
      return;
    }

    // ==================== 特殊复合建筑处理：流体处理中枢 BD_132 (底座为流体母座，顶部放置 搅拌机/离心机/提取器 单插件) ====================
    if (bld.type === 'fluid_hub') {
      el.className = 'machine-entity composite-fluidhub-entity pointer-events-auto absolute select-none transition-all duration-200';
      el.style.left = `${bld.x}%`;
      el.style.top = `${bld.y}%`;
      el.style.width = `${bld.width || 195}px`;
      el.style.height = `${bld.height || 225}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

      const slot = (typeof fluidHubSlot !== 'undefined') ? fluidHubSlot : { mounted: true, childId: 'centrifuge', name: '离心机 (BD_106)' };

      // 总悬浮标签
      const tagHtml = `
        <div class="machine-tag absolute top-[-6px] left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1 z-30">
          <div class="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md border border-sky-400 px-2.5 py-1 rounded shadow-xl">
            <span class="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            <span class="text-[11px] font-bold text-sky-300 font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
            <span class="text-[9px] text-white/70 bg-white/10 px-1 rounded">${bld.power || '12 MW'}</span>
          </div>
          <div class="w-1.5 h-1.5 bg-sky-400 rotate-45 -mt-0.5"></div>
        </div>
      `;

      // 1. 【顶部单设备插槽】：显示插入的机器 (搅拌机 / 离心机 / 提取器)
      const topDeck = document.createElement('div');
      topDeck.className = 'top-plugin-dock flex items-end justify-center w-full h-[95px] px-1 pointer-events-auto relative z-20';

      const pluginEl = document.createElement('div');
      pluginEl.id = 'fluid_hub_top_plugin';
      pluginEl.className = 'relative w-[92%] h-[90px] rounded transition-all duration-150 cursor-pointer select-none';

      if (slot.mounted && slot.childId) {
        let childBadge = 'BD_106';
        let childTypeName = '离心机';
        let childGraphicHtml = '';
        
        if (slot.childId === 'mixer') {
          childBadge = 'BD_110';
          childTypeName = '搅拌机';
          childGraphicHtml = `
            <div class="relative w-12 h-10 bg-[#0f172a] border border-cyan-400/80 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
              <div class="w-7 h-7 rounded-full border-2 border-dashed border-cyan-400 animate-spin" style="animation-duration: 3s;"></div>
              <i class="fa-solid fa-blender text-cyan-300 text-sm absolute animate-pulse"></i>
              <div class="absolute bottom-0 w-full h-1 bg-cyan-400/60"></div>
            </div>
          `;
        } else if (slot.childId === 'extractor') {
          childBadge = 'BD_109';
          childTypeName = '提炼器';
          childGraphicHtml = `
            <div class="relative w-12 h-10 bg-[#0f172a] border border-teal-400/80 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
              <i class="fa-solid fa-flask-vial text-teal-300 text-base"></i>
              <div class="w-2 h-2 rounded-full bg-teal-400 absolute top-1.5 animate-bounce"></div>
              <div class="absolute bottom-0 w-full h-1 bg-teal-400/60"></div>
            </div>
          `;
        } else {
          // centrifuge default
          childBadge = 'BD_106';
          childTypeName = '离心机';
          childGraphicHtml = `
            <div class="relative w-12 h-10 bg-[#0f172a] border border-sky-400/80 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
              <div class="w-7 h-7 rounded-full border-2 border-sky-400 animate-spin" style="animation-duration: 1.5s;"></div>
              <i class="fa-solid fa-atom text-sky-200 text-xs absolute"></i>
              <div class="absolute bottom-0 w-full h-1 bg-sky-400/60"></div>
            </div>
          `;
        }

        pluginEl.innerHTML = `
          <div class="plugin-box-inner w-full h-full border-2 border-sky-400/80 hover:border-white bg-[#0e1a29] hover:bg-[#132338] rounded-md flex flex-col items-center justify-between p-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_22px_#38bdf8] hover:scale-105 transition-all">
            <div class="w-full flex items-center justify-between text-[8.5px] font-mono font-bold text-sky-300 border-b border-sky-500/30 pb-0.5">
              <span class="flex items-center space-x-1"><i class="fa-solid fa-plug text-sky-400"></i><span>顶部插槽</span></span>
              <span class="text-[7.5px] px-1 rounded bg-sky-500/20 text-sky-200">${childBadge}</span>
            </div>
            ${childGraphicHtml}
            <div class="w-full flex items-center justify-between text-[8px] font-mono">
              <span class="text-white font-bold">${slot.name || childTypeName}</span>
              <button onclick="event.stopPropagation(); cycleFluidHubPlugin();" title="点击循环替换插件(搅拌机/离心机/提取器)" class="px-1.5 py-0.5 rounded bg-sky-500/30 hover:bg-sky-400 text-sky-100 hover:text-black text-[7.5px] font-bold cursor-pointer transition">
                <i class="fa-solid fa-arrows-rotate mr-0.5"></i>替换
              </button>
            </div>
          </div>
          <!-- 流体导压法兰连通件 -->
          <div class="w-6 h-1.5 bg-sky-400 mx-auto -mt-0.5 rounded-b-sm shadow-[0_0_8px_#38bdf8]"></div>
        `;

        pluginEl.onmouseenter = (e) => {
          e.stopPropagation();
          if (typeof setTargetMachine === 'function') setTargetMachine(slot.childId);
        };
        pluginEl.onmouseleave = (e) => {
          e.stopPropagation();
          if (typeof clearTargetMachine === 'function') clearTargetMachine(slot.childId);
        };
        pluginEl.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof openMachineHUD === 'function') {
            openMachineHUD(slot.childId);
          }
        };
        pluginEl.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          cycleFluidHubPlugin();
        };
      } else {
        // 空置插槽
        pluginEl.innerHTML = `
          <div class="w-full h-full border-2 border-dashed border-sky-400/50 hover:border-sky-300 bg-black/50 hover:bg-sky-950/40 rounded flex flex-col items-center justify-center p-1 transition-all">
            <i class="fa-solid fa-plus text-sky-400 text-base mb-1 animate-pulse"></i>
            <span class="text-[8.5px] font-mono text-sky-200">插槽空置 (BD_132)</span>
            <span class="text-[7.5px] text-white/60">点击安装 搅拌/离心/提炼</span>
          </div>
        `;
        pluginEl.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          cycleFluidHubPlugin();
        };
      }
      topDeck.appendChild(pluginEl);

      // 2. 【下面底座】：流体处理中枢 BD_132 母座
      const baseEl = document.createElement('div');
      baseEl.id = 'bottom_fluid_hub_base';
      baseEl.className = 'bottom-base-fluidhub relative w-full h-[130px] border-2 border-sky-400 hover:border-white rounded-md bg-[#0a1524]/95 hover:bg-[#0f1f33] shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.7)] transition-all duration-200 cursor-pointer overflow-hidden p-2 flex flex-col justify-between';

      baseEl.innerHTML = `
        <div class="flex items-center justify-between w-full text-[9.5px] font-mono font-bold text-sky-300 px-1 border-b border-sky-500/20 pb-1">
          <span class="flex items-center space-x-1"><i class="fa-solid fa-bolt text-sky-400"></i><span>12 MW</span></span>
          <span class="text-white/90">流体处理中枢 BD_132</span>
          <span class="flex items-center space-x-1 text-cyan-300"><i class="fa-solid fa-gauge-high text-cyan-400"></i><span>6.8 Bar</span></span>
        </div>

        <!-- 中央高压流体循环管道与稳流指示 -->
        <div class="relative w-full h-12 flex items-center justify-center my-0.5">
          <div class="absolute w-28 h-6 border-2 border-sky-400/80 rounded-full flex items-center justify-around px-2 shadow-[0_0_12px_rgba(56,189,248,0.5)]">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping"></span>
          </div>
          <div class="flex items-center space-x-2 text-cyan-200 text-xs font-mono font-bold z-10 bg-black/50 px-2 py-0.5 rounded">
            <i class="fa-solid fa-droplet text-sky-400 animate-bounce"></i>
            <span>高压稳流中枢</span>
          </div>
        </div>

        <div class="w-full flex items-center justify-between pt-1 border-t border-sky-500/20 px-1">
          <span class="text-[8px] font-mono text-sky-300/70">侧面×3管 ➔ 背面×2出</span>
          <span class="px-1.5 py-0.5 rounded bg-black/60 border border-sky-400/40 text-[7.5px] font-mono font-bold text-sky-300">
            流体母座 · 单工位
          </span>
        </div>
      `;

      baseEl.onmouseenter = (e) => {
        e.stopPropagation();
        if (typeof setTargetMachine === 'function') setTargetMachine('fluid_hub');
      };
      baseEl.onmouseleave = (e) => {
        e.stopPropagation();
        if (typeof clearTargetMachine === 'function') clearTargetMachine('fluid_hub');
      };
      baseEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openMachineHUD === 'function') {
          openMachineHUD('fluid_hub');
        }
      };
      baseEl.oncontextmenu = (e) => {
        handleBuildingRightClick(e, bld);
      };

      el.innerHTML = tagHtml;
      el.appendChild(topDeck);
      el.appendChild(baseEl);
      container.appendChild(el);
      return;
    }

    // ==================== 特殊复合建筑处理：营养基座 BD_130 (底座为生物母座，顶部放置 培育仓/培养皿 单插件) ====================
    if (bld.type === 'bio_base') {
      el.className = 'machine-entity composite-biobase-entity pointer-events-auto absolute select-none transition-all duration-200';
      el.style.left = `${bld.x}%`;
      el.style.top = `${bld.y}%`;
      el.style.width = `${bld.width || 195}px`;
      el.style.height = `${bld.height || 225}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

      const slot = (typeof bioBaseSlot !== 'undefined') ? bioBaseSlot : { mounted: true, childId: 'incubator', name: '培育仓 (BD_108)' };

      // 总悬浮标签
      const tagHtml = `
        <div class="machine-tag absolute top-[-6px] left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1 z-30">
          <div class="flex items-center space-x-1.5 bg-black/90 backdrop-blur-md border border-emerald-400 px-2.5 py-1 rounded shadow-xl">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="text-[11px] font-bold text-emerald-300 font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
            <span class="text-[9px] text-white/70 bg-white/10 px-1 rounded">${bld.power || '10 MW'}</span>
          </div>
          <div class="w-1.5 h-1.5 bg-emerald-400 rotate-45 -mt-0.5"></div>
        </div>
      `;

      // 1. 【顶部单设备插槽】：显示插入的生物设备 (培育仓 / 培养皿)
      const topDeck = document.createElement('div');
      topDeck.className = 'top-plugin-dock flex items-end justify-center w-full h-[95px] px-1 pointer-events-auto relative z-20';

      const pluginEl = document.createElement('div');
      pluginEl.id = 'bio_base_top_plugin';
      pluginEl.className = 'relative w-[92%] h-[90px] rounded transition-all duration-150 cursor-pointer select-none';

      if (slot.mounted && slot.childId) {
        let childBadge = 'BD_108';
        let childTypeName = '培育仓';
        let childGraphicHtml = '';

        if (slot.childId === 'petri_dish') {
          childBadge = 'BD_131';
          childTypeName = '培养皿';
          childGraphicHtml = `
            <div class="relative w-12 h-10 bg-[#061e16] border border-teal-400/80 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
              <div class="w-7 h-5 rounded-full border border-teal-300 bg-teal-900/60 flex items-center justify-center">
                <i class="fa-solid fa-microscope text-teal-200 text-xs animate-pulse"></i>
              </div>
              <div class="absolute bottom-0 w-full h-1 bg-teal-400/60"></div>
            </div>
          `;
        } else {
          // incubator default
          childBadge = 'BD_108';
          childTypeName = '培育仓';
          childGraphicHtml = `
            <div class="relative w-12 h-10 bg-[#061e16] border border-emerald-400/80 rounded flex items-center justify-center my-0.5 overflow-hidden shadow-inner">
              <div class="w-7 h-8 rounded-full border border-emerald-400/60 bg-gradient-to-t from-emerald-600/40 to-transparent flex items-center justify-center relative">
                <i class="fa-solid fa-seedling text-emerald-300 text-xs animate-bounce" style="animation-duration: 2s;"></i>
                <div class="absolute -top-1 w-5 h-1 bg-yellow-300/80 rounded-full ${incubatorTimeAccelerated ? 'shadow-[0_0_8px_#ffd700]' : 'opacity-40'}"></div>
              </div>
              <div class="absolute bottom-0 w-full h-1 bg-emerald-400/60"></div>
            </div>
          `;
        }

        pluginEl.innerHTML = `
          <div class="plugin-box-inner w-full h-full border-2 border-emerald-400/80 hover:border-white bg-[#081f18] hover:bg-[#0c2a21] rounded-md flex flex-col items-center justify-between p-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_22px_#10b981] hover:scale-105 transition-all">
            <div class="w-full flex items-center justify-between text-[8.5px] font-mono font-bold text-emerald-300 border-b border-emerald-500/30 pb-0.5">
              <span class="flex items-center space-x-1"><i class="fa-solid fa-plug text-emerald-400"></i><span>顶部插槽</span></span>
              <span class="text-[7.5px] px-1 rounded bg-emerald-500/20 text-emerald-200">${childBadge}</span>
            </div>
            ${childGraphicHtml}
            <div class="w-full flex items-center justify-between text-[8px] font-mono">
              <span class="text-white font-bold">${slot.name || childTypeName}</span>
              <button onclick="event.stopPropagation(); cycleBioBasePlugin();" title="点击循环替换插件(培育仓/培养皿)" class="px-1.5 py-0.5 rounded bg-emerald-500/30 hover:bg-emerald-400 text-emerald-100 hover:text-black text-[7.5px] font-bold cursor-pointer transition">
                <i class="fa-solid fa-arrows-rotate mr-0.5"></i>替换
              </button>
            </div>
          </div>
          <!-- 营养导液管连通件 -->
          <div class="w-6 h-1.5 bg-emerald-400 mx-auto -mt-0.5 rounded-b-sm shadow-[0_0_8px_#10b981]"></div>
        `;

        pluginEl.onmouseenter = (e) => {
          e.stopPropagation();
          if (typeof setTargetMachine === 'function') setTargetMachine(slot.childId);
        };
        pluginEl.onmouseleave = (e) => {
          e.stopPropagation();
          if (typeof clearTargetMachine === 'function') clearTargetMachine(slot.childId);
        };
        pluginEl.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof openMachineHUD === 'function') {
            openMachineHUD(slot.childId);
          }
        };
        pluginEl.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          cycleBioBasePlugin();
        };
      } else {
        // 空置插槽
        pluginEl.innerHTML = `
          <div class="w-full h-full border-2 border-dashed border-emerald-400/50 hover:border-emerald-300 bg-black/50 hover:bg-emerald-950/40 rounded flex flex-col items-center justify-center p-1 transition-all">
            <i class="fa-solid fa-plus text-emerald-400 text-base mb-1 animate-pulse"></i>
            <span class="text-[8.5px] font-mono text-emerald-200">插槽空置 (BD_130)</span>
            <span class="text-[7.5px] text-white/60">点击安装 培育仓/培养皿</span>
          </div>
        `;
        pluginEl.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          cycleBioBasePlugin();
        };
      }
      topDeck.appendChild(pluginEl);

      // 2. 【下面底座】：营养基座 BD_130 母座
      const baseEl = document.createElement('div');
      baseEl.id = 'bottom_bio_base';
      baseEl.className = 'bottom-base-bio relative w-full h-[130px] border-2 border-emerald-400 hover:border-white rounded-md bg-[#071913]/95 hover:bg-[#0b241c] shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.7)] transition-all duration-200 cursor-pointer overflow-hidden p-2 flex flex-col justify-between';

      baseEl.innerHTML = `
        <div class="flex items-center justify-between w-full text-[9.5px] font-mono font-bold text-emerald-300 px-1 border-b border-emerald-500/20 pb-1">
          <span class="flex items-center space-x-1"><i class="fa-solid fa-bolt text-emerald-400"></i><span>10 MW</span></span>
          <span class="text-white/90">营养基座 BD_130</span>
          <span class="flex items-center space-x-1 text-emerald-400"><i class="fa-solid fa-dna"></i><span>99.8%</span></span>
        </div>

        <!-- 中央高纯营养液微孔注入与生物脉动 -->
        <div class="relative w-full h-12 flex items-center justify-center my-0.5">
          <div class="absolute w-28 h-6 border-2 border-emerald-400/80 rounded-full flex items-center justify-around px-2 shadow-[0_0_12px_rgba(16,185,129,0.5)]">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
          </div>
          <div class="flex items-center space-x-2 text-emerald-200 text-xs font-mono font-bold z-10 bg-black/50 px-2 py-0.5 rounded">
            <i class="fa-solid fa-leaf text-emerald-400 animate-pulse"></i>
            <span>高纯灵液直供</span>
          </div>
        </div>

        <div class="w-full flex items-center justify-between pt-1 border-t border-emerald-500/20 px-1">
          <span class="text-[8px] font-mono text-emerald-300/70">侧面×2流 ➔ 顶部直供工位</span>
          <span class="px-1.5 py-0.5 rounded bg-black/60 border border-emerald-400/40 text-[7.5px] font-mono font-bold text-emerald-300">
            生物母座 · 单工位
          </span>
        </div>
      `;

      baseEl.onmouseenter = (e) => {
        e.stopPropagation();
        if (typeof setTargetMachine === 'function') setTargetMachine('bio_base');
      };
      baseEl.onmouseleave = (e) => {
        e.stopPropagation();
        if (typeof clearTargetMachine === 'function') clearTargetMachine('bio_base');
      };
      baseEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof openMachineHUD === 'function') {
          openMachineHUD('bio_base');
        }
      };
      baseEl.oncontextmenu = (e) => {
        handleBuildingRightClick(e, bld);
      };

      el.innerHTML = tagHtml;
      el.appendChild(topDeck);
      el.appendChild(baseEl);
      container.appendChild(el);
      return;
    }

    // ==================== 普通单体建筑处理 ====================
    el.className = 'machine-entity pointer-events-auto absolute select-none transition-all duration-200';
    el.style.left = `${bld.x}%`;
    el.style.top = `${bld.y}%`;
    el.style.width = `${bld.width || 180}px`;
    el.style.height = `${bld.height || 180}px`;
    el.style.transform = `translate(-50%, -50%) rotate(${bld.rot || 0}deg)`;

    // 鼠标悬停与交互事件
    el.onmouseenter = () => handleBuildingMouseEnter(bld);
    el.onmouseleave = () => handleBuildingMouseLeave(bld);
    el.onclick = (e) => handleBuildingClick(e, bld);
    el.oncontextmenu = (e) => handleBuildingRightClick(e, bld);

    // 悬浮世界标签
    const tagHtml = `
      <div class="machine-tag absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none mb-1">
        <div class="flex items-center space-x-1.5 bg-black/85 backdrop-blur-md border border-[#f5921e] px-2.5 py-1 rounded shadow-xl">
          <span class="w-2 h-2 rounded-full bg-[#f5921e] animate-pulse"></span>
          <span class="text-[11px] font-bold text-[#f5921e] font-mono tracking-wider">${bld.tagTitle || bld.name}</span>
          <span class="text-[9px] text-white/50 bg-white/10 px-1 rounded">${bld.power || '0 MW'}</span>
        </div>
        <div class="w-1.5 h-1.5 bg-[#f5921e] rotate-45 -mt-0.5"></div>
      </div>
    `;

    const svgContent = buildingSvgTemplates[bld.type] || buildingSvgTemplates.foundation;
    el.innerHTML = tagHtml + svgContent;
    container.appendChild(el);
  });
}

// ---------------------------------------------------------------------
// 2. 鼠标移入/移出建筑交互
// ---------------------------------------------------------------------
function handleBuildingMouseEnter(bld) {
  currentHoveredBuildingId = bld.id;

  if (isDismantleMode) {
    // 拆除模式下：激活 1:1 橙色条纹剪影高亮 (media_1790442746779.png)
    const el = document.getElementById(bld.id);
    if (el) el.classList.add('dismantle-target-outline');
    showDismantleTargetCard(bld);
  } else {
    // 正常工控模式下：激活准星 E 键开面板提示
    setTargetMachine(bld.type);
  }
}

function handleBuildingMouseLeave(bld) {
  if (currentHoveredBuildingId === bld.id) {
    currentHoveredBuildingId = null;
  }

  const el = document.getElementById(bld.id);
  if (el) el.classList.remove('dismantle-target-outline');

  if (isDismantleMode) {
    hideDismantleTargetCard();
    cancelDismantleHold();
  } else {
    clearTargetMachine(bld.type);
  }
}

function handleBuildingClick(e, bld) {
  if (isDismantleMode) {
    e.preventDefault();
    e.stopPropagation();
    // 拆除模式下若单击，也支持引导长按
    showNotification(`【拆除模式】请长按【右键】或【左键】3秒进行拆除回收`);
    return;
  }

  // 正常模式点击打开控制台
  if (bld.type === 'storage_box') {
    if (typeof openStorageBoxModal === 'function') {
      openStorageBoxModal();
    }
    return;
  }

  if (typeof openMachineHUD === 'function') {
    openMachineHUD(bld.type);
  }
}

function handleBuildingRightClick(e, bld) {
  e.preventDefault();
  e.stopPropagation();
  // 右键触发
  if (isDismantleMode) {
    // 已由 mousedown 触发长按
  }
}

// ---------------------------------------------------------------------
// 3. 拆除模式 HUD 与 3秒长按进度条 (1:1 还原 media_1790442746779 / 47796)
// ---------------------------------------------------------------------
function showDismantleTargetCard(bld) {
  const card = document.getElementById('dismantleTargetCard');
  if (!card) return;

  const titleElem = document.getElementById('dismantleTargetTitle');
  const costContainer = document.getElementById('dismantleRefundContainer');

  if (titleElem) titleElem.innerText = bld.name;

  if (costContainer) {
    costContainer.innerHTML = '';
    const refundList = bld.refund || [
      { code: 'concrete', name: '混凝土', count: 5, icon: 'fa-cubes-stacked' },
      { code: 'iron_plate', name: '工业铁板', count: 2, icon: 'fa-sheet-plastic' }
    ];
    refundList.forEach(r => {
      const box = document.createElement('div');
      box.className = 'flex flex-col items-center bg-white/10 border border-white/20 rounded px-2 py-1 min-w-[50px] shadow';
      box.innerHTML = `
        <i class="fa-solid ${r.icon} text-stone-200 text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold text-amber-300">+${r.count}</span>
      `;
      costContainer.appendChild(box);
    });
  }

  card.classList.remove('hidden');
  card.style.opacity = '1';
}

function hideDismantleTargetCard() {
  const card = document.getElementById('dismantleTargetCard');
  if (card) {
    card.style.opacity = '0';
    setTimeout(() => card.classList.add('hidden'), 150);
  }
}

// 开始3秒拆除长按 (鼠标右键 或 鼠标左键 按下)
function startDismantleHold(e) {
  if (!isDismantleMode || !currentHoveredBuildingId) return;
  if (e) e.preventDefault();

  const bld = worldBuildings.find(b => b.id === currentHoveredBuildingId);
  if (!bld) return;

  isDismantlingActive = true;
  currentDismantleTarget = bld;
  dismantleStartTime = performance.now();

  // 显示中央 3 秒拆除进度条 (1:1 media_1790442747796.png)
  const barContainer = document.getElementById('dismantleProgressBarContainer');
  const barFill = document.getElementById('dismantleProgressFill');
  if (barContainer) {
    barContainer.classList.remove('hidden');
    barContainer.style.opacity = '1';
  }
  if (barFill) barFill.style.width = '0%';

  // 机械臂激活蓝色激光
  const arm = document.getElementById('mechArm');
  const beam = document.getElementById('dismantleLaserBeam');
  if (beam) beam.classList.remove('hidden');
  if (arm) arm.style.transform = 'translate(-10px, -20px) rotate(2deg)';

  playUiSound('dismantle_loop');

  function tickDismantle(now) {
    if (!isDismantlingActive) return;

    const elapsed = now - dismantleStartTime;
    const progress = Math.min(100, (elapsed / DISMANTLE_DURATION_MS) * 100);

    if (barFill) barFill.style.width = `${progress}%`;

    // 播放持续激光微声
    if (Math.random() < 0.25) {
      playUiSound('dismantle_loop');
    }

    if (progress >= 100) {
      // 3秒拆除达成！
      completeDismantleSuccess();
      return;
    }

    dismantleAnimFrame = requestAnimationFrame(tickDismantle);
  }

  dismantleAnimFrame = requestAnimationFrame(tickDismantle);
}

// 释放鼠标取消拆除
function cancelDismantleHold() {
  if (!isDismantlingActive) return;

  isDismantlingActive = false;
  cancelAnimationFrame(dismantleAnimFrame);

  const barContainer = document.getElementById('dismantleProgressBarContainer');
  const barFill = document.getElementById('dismantleProgressFill');
  const beam = document.getElementById('dismantleLaserBeam');
  const arm = document.getElementById('mechArm');

  if (barFill) barFill.style.width = '0%';
  if (barContainer) {
    barContainer.style.opacity = '0';
    setTimeout(() => barContainer.classList.add('hidden'), 150);
  }
  if (beam) beam.classList.add('hidden');
  if (arm) arm.style.transform = '';
}

// 拆除 100% 成功结算
function completeDismantleSuccess() {
  cancelDismantleHold();
  if (!currentDismantleTarget) return;

  const targetId = currentDismantleTarget.id;
  const bldIndex = worldBuildings.findIndex(b => b.id === targetId);
  if (bldIndex === -1) return;

  const bld = worldBuildings[bldIndex];
  
  // 1. 从世界中移除实体
  worldBuildings.splice(bldIndex, 1);
  renderWorldBuildings();

  // 2. 100% 物料全额无损回收至背包
  const refundList = bld.refund || [
    { code: 'iron_beam', name: '玄铁梁', count: 2 },
    { code: 'iron_plate', name: '玄铁板', count: 5 }
  ];

  refundList.forEach(r => {
    if (typeof playerInventory !== 'undefined') {
      playerInventory[r.code] = (playerInventory[r.code] || 0) + r.count;
    }
    // 触发拾取动效
    if (typeof triggerLootNotification === 'function') {
      triggerLootNotification(r.name, r.count, playerInventory[r.code], 'fa-solid fa-box text-amber-300');
    }
  });

  // 3. 音效与通知
  playUiSound('dismantle_success');
  hideDismantleTargetCard();
  showNotification(`已成功拆除【${bld.name}】！物料已悉数全额回收至背包。`);

  // 4. 同步界面数值
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();

  currentDismantleTarget = null;
  currentHoveredBuildingId = null;
}

// ---------------------------------------------------------------------
// 4. 建造模式 HUD 与实时全息部署 (完全由官方策划表 XIUXIAN_BUILDINGS 驱动，消除硬编码)
// ---------------------------------------------------------------------
function getBuildableDatabaseFromTable() {
  const db = {};
  if (typeof XIUXIAN_BUILDINGS !== 'undefined') {
    Object.entries(XIUXIAN_BUILDINGS).forEach(([key, b]) => {
      const w = 180 + ((b.dimX || 2) * 15);
      const h = 170 + ((b.dimY || 2) * 15);

      const costs = (b.costs || []).map(c => {
        const item = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[c.code]) ? XIUXIAN_ITEMS[c.code] : null;
        if (item) {
          let iconCls = 'fa-cube';
          if (item.icon) {
            const match = item.icon.match(/fa-[a-z0-9-]+/g);
            if (match && match.length > 0) iconCls = match[match.length - 1];
          }
          return {
            code: c.code,
            name: item.name,
            need: c.need,
            icon: iconCls,
            isBuildingCost: false
          };
        }
        // 处理建筑前置/族名成本 (如 bd_102, bd_123, building_family_conveyor)
        const bKey = (typeof XIUXIAN_CANONICAL_TO_BUILDING_KEY !== 'undefined' && XIUXIAN_CANONICAL_TO_BUILDING_KEY[c.code.toUpperCase()])
          || (c.code === 'building_family_conveyor' ? 'conveyor' : null);
        const bObj = (bKey && typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[bKey] : null;
        return {
          code: c.code,
          name: bObj ? bObj.name : (c.code === 'building_family_conveyor' ? '传送带' : c.code),
          need: c.need,
          icon: 'fa-cubes',
          isBuildingCost: true
        };
      });

      let powerStr = '0 MW';
      if (b.power !== undefined) {
        if (b.power > 0) powerStr = `${b.power} MW`;
        else if (b.power < 0) powerStr = `+${Math.abs(b.power)} MW`;
      }

      const itemData = {
        key: key,
        title: `${b.name} (${b.code || key})`,
        name: b.name,
        code: b.code || key,
        subMode: '默认',
        power: powerStr,
        width: w,
        height: h,
        dimX: b.dimX || 1,
        dimY: b.dimY || 1,
        dimZ: b.dimZ !== undefined ? b.dimZ : 1,
        topStackable: !!b.topStackable,
        rotStep: typeof b.rotStep === 'number' ? b.rotStep : 90,
        canPlaceOnRawMap: !!b.canPlaceOnRawMap,
        occupancyMode: b.occupancyMode || '体积占格',
        placementRule: b.placementRule || (b.canPlaceOnRawMap ? 'raw_or_surface' : 'surface_only'),
        placementDesc: b.placementDesc || '',
        powerRadius: b.powerRadius || 0,
        containerSlots: b.containerSlots || 0,
        pluginSlot: b.pluginSlot || '无',
        costs: costs
      };
      db[key] = itemData;

      // 常见别名映射 (兼容旧版调用)
      if (key === 'foundation_4x4') db['foundation'] = itemData;
      if (key === 'furnace') db['smelter'] = itemData;
      if (key === 'cutter') db['constructor'] = itemData;
      if (key === 'teleporter') db['portal'] = itemData;
      if (key === 'iron_beam_bld') db['beam'] = itemData;
      if (key === 'water_pump') db['pump'] = itemData;
      if (key === 'purify_tower') db['purifier'] = itemData;
      if (key === 'power_burner') db['generator'] = itemData;
      if (key === 'storage_box') db['box'] = itemData;
    });
  }
  return db;
}

// 动态读表代理对象
const buildableDatabase = new Proxy({}, {
  get(target, prop) {
    const tableDb = getBuildableDatabaseFromTable();
    return tableDb[prop] || target[prop] || tableDb['foundation'] || tableDb['furnace'];
  }
});
window.buildableDatabase = buildableDatabase;
window.getBuildableDatabaseFromTable = getBuildableDatabaseFromTable;

// 启动建造模式
function enterBuildPlacingMode(buildingKey = 'foundation') {
  if (isDismantleMode) toggleDismantleMode(); // 互斥
  if (typeof closeOtherModals === 'function') closeOtherModals('');

  isBuildPlacingMode = true;
  currentPlacingBuildingKey = buildingKey;
  placingRotationAngle = 0;

  playUiSound('toggle');

  const hud = document.getElementById('buildModeHudOverlay');
  const ghost = document.getElementById('buildHologramGhost');
  if (hud) hud.classList.remove('hidden');
  if (ghost && !(window.World3D && window.World3D.isReady())) ghost.classList.remove('hidden');

  updateBuildPlacementHudCard();
  showNotification(`已进入【建造部署模式】: ${buildableDatabase[buildingKey]?.title || '设施'} (左键放置，右键退出)`);
}

// 退出建造模式
function exitBuildPlacingMode() {
  isBuildPlacingMode = false;
  const hud = document.getElementById('buildModeHudOverlay');
  const ghost = document.getElementById('buildHologramGhost');
  if (hud) hud.classList.add('hidden');
  if (ghost) ghost.classList.add('hidden');
  const readyBadge = document.getElementById('dspReadyBuildingBadge');
  if (readyBadge) {
    readyBadge.classList.add('hidden');
    readyBadge.classList.remove('flex');
  }
  document.querySelectorAll('.dsp-bld-btn').forEach(b => b.classList.remove('active-dsp-bld'));
}

// 刷新建造模式中置卡片 (1:1 还原 media_1790442748700.png)
function updateBuildPlacementHudCard() {
  const data = buildableDatabase[currentPlacingBuildingKey] || buildableDatabase.foundation;
  const ghost = document.getElementById('buildHologramGhost');
  if (window.World3D && window.World3D.isReady()) {
    window.World3D.updateHologram(data.key);
    if (ghost) ghost.classList.add('hidden');
  } else if (ghost) {
    ghost.innerHTML = buildingSvgTemplates[data.key] || buildingSvgTemplates.foundation;
    ghost.style.width = `${data.width}px`;
    ghost.style.height = `${data.height}px`;
  }

  const titleElem = document.getElementById('buildPlacingTitle');
  const ruleBadgeElem = document.getElementById('buildPlacingRuleBadge');
  const subModeElem = document.getElementById('buildPlacingSubMode');
  const costContainer = document.getElementById('buildPlacingCostCards');

  if (titleElem) titleElem.innerText = data.title;
  if (ruleBadgeElem) {
    const ruleTagMap = {
      ore_node: '仅限矿脉节点',
      water_node: '仅限水源节点',
      belt_processor: '需架设于传送带上',
      slot_thermal: '需插于灵力引擎(下)',
      slot_fluid: '需插于流体中枢',
      slot_bio: '需插于营养基座',
      raw_or_surface: '可裸放原始地图',
      surface_only: '需放底座/可叠加面'
    };
    const rTag = ruleTagMap[data.placementRule] || (data.canPlaceOnRawMap ? '可裸放原始地图' : '需放底座/可叠加面');
    const rotTxt = data.rotStep === 0 ? '不可旋转(0°)' : `旋转步进 ${data.rotStep}°`;
    ruleBadgeElem.innerText = `${data.dimX || 1}×${data.dimY || 1}×${data.dimZ !== undefined ? data.dimZ : 1}格 · ${rTag} · ${data.occupancyMode || '体积占格'} · ${data.topStackable ? '顶部可放' : '顶部不可放'} · ${rotTxt}`;
  }
  if (subModeElem) subModeElem.innerText = `🔨 建造模式: ${data.subMode || '默认'}`;

  if (costContainer) {
    costContainer.innerHTML = '';
    data.costs.forEach(c => {
      const stock = c.isBuildingCost
        ? c.need
        : (window.isCreativeMode ? 999 : ((typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined) ? playerInventory[c.code] : 0));
      const isEnough = stock >= c.need;
      const box = document.createElement('div');
      box.className = `flex flex-col items-center bg-black/75 border ${isEnough ? 'border-white/30' : 'border-rose-500'} rounded px-2.5 py-1 min-w-[56px] shadow-lg`;
      box.title = c.name || c.code;
      box.innerHTML = `
        <i class="fa-solid ${c.icon} ${c.isBuildingCost ? 'text-cyan-300' : 'text-stone-200'} text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${c.isBuildingCost ? `前置×${c.need}` : `${stock} / ${c.need}`}</span>
      `;
      costContainer.appendChild(box);
    });
  }
}

// 检查是否具备建造成本
function canAffordBuild(buildingKey) {
  const data = buildableDatabase[buildingKey];
  if (!data) return false;
  if (window.isCreativeMode) return true;
  if (typeof playerInventory === 'undefined') return true;
  return data.costs.every(c => c.isBuildingCost || (playerInventory[c.code] || 0) >= c.need);
}

// 执行左键放置建造
function executeBuildPlacementAt(xRatio, yRatio) {
  const data = buildableDatabase[currentPlacingBuildingKey];
  if (!data) return;

  // 若 3D 积木规则禁止当前位置放置 (如目标顶部不可放)，先阻止建造再扣料
  if (window._world3DPlacementBlockedReason) {
    playUiSound('craft_fail');
    showNotification(`⛔ 无法放置：${window._world3DPlacementBlockedReason}`);
    return;
  }

  if (!canAffordBuild(currentPlacingBuildingKey)) {
    playUiSound('craft_fail');
    showNotification(`原料不足！无法建造【${data.title}】`);
    return;
  }

  // 扣减物料 (创造模式下免扣除；建筑前置类成本不从背包物料扣减)
  if (!window.isCreativeMode) {
    data.costs.forEach(c => {
      if (!c.isBuildingCost && typeof playerInventory !== 'undefined') {
        playerInventory[c.code] = (playerInventory[c.code] || 0) - c.need;
      }
    });
  }

  // 若 3D 积木系统吸附到了复合母座插槽上，直接装配进插槽
  const slotSnap = window._world3DSlotSnapTarget || null;
  if (slotSnap && slotSnap.type === 'engine_chamber' && typeof engineChamberSlots !== 'undefined') {
    const idx = slotSnap.slotIndex;
    if (engineChamberSlots[idx]) {
      engineChamberSlots[idx].mounted = true;
      engineChamberSlots[idx].chamberId = data.key;
      engineChamberSlots[idx].name = data.title;
      playUiSound('build_place');
      renderWorldBuildings();
      updateBuildPlacementHudCard();
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      showNotification(`【积木装配成功】已将【${data.title}】吸附安装至灵力引擎插槽 #${idx + 1}！`);
      return;
    }
  }
  if (slotSnap && slotSnap.type === 'fluid_hub' && typeof fluidHubSlot !== 'undefined') {
    fluidHubSlot.mounted = true;
    fluidHubSlot.childId = data.key;
    fluidHubSlot.name = data.title;
    playUiSound('build_place');
    renderWorldBuildings();
    updateBuildPlacementHudCard();
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    showNotification(`【积木装配成功】已将【${data.title}】吸附安装至流体处理中枢顶部插槽！`);
    return;
  }
  if (slotSnap && slotSnap.type === 'bio_base' && typeof bioBaseSlot !== 'undefined') {
    bioBaseSlot.mounted = true;
    bioBaseSlot.childId = data.key;
    bioBaseSlot.name = data.title;
    playUiSound('build_place');
    renderWorldBuildings();
    updateBuildPlacementHudCard();
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    showNotification(`【积木装配成功】已将【${data.title}】吸附安装至营养基座顶部插槽！`);
    return;
  }
  if (slotSnap && slotSnap.type === 'belt_processor') {
    const coords3dBelt = window._world3DPlaceCoords || null;
    const beltBld = {
      id: `bld_${data.key}_${Date.now()}`,
      type: data.key,
      name: data.title,
      tagTitle: `${data.title} [带处理器 · 不占格]`,
      power: data.power,
      mountedOnBelt: slotSnap.beltId,
      x: Math.round(xRatio * 100),
      y: Math.round(yRatio * 100),
      wx: coords3dBelt ? coords3dBelt.wx : undefined,
      wy: coords3dBelt ? coords3dBelt.wy : 0.35,
      wz: coords3dBelt ? coords3dBelt.wz : undefined,
      rot: placingRotationAngle,
      width: data.width,
      height: data.height,
      refund: data.costs.map(c => ({ code: c.code, name: c.name, count: c.need, icon: c.icon }))
    };
    worldBuildings.push(beltBld);
    renderWorldBuildings();
    playUiSound('build_place');
    updateBuildPlacementHudCard();
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();
    showNotification(`【带处理器已架设】已将【${data.title}】套在传送带上（不占格）！`);
    return;
  }

  // 创建世界实体
  const newId = `bld_${data.key}_${Date.now()}`;
  const coords3d = window._world3DPlaceCoords || null;
  const newBuilding = {
    id: newId,
    type: data.key,
    name: data.title,
    tagTitle: `${data.title} (${data.power})`,
    power: data.power,
    x: Math.round(xRatio * 100),
    y: Math.round(yRatio * 100),
    wx: coords3d ? coords3d.wx : undefined,
    wy: coords3d ? coords3d.wy : 0,
    wz: coords3d ? coords3d.wz : undefined,
    rot: placingRotationAngle,
    width: data.width,
    height: data.height,
    refund: data.costs.map(c => ({ code: c.code, name: c.name, count: c.need, icon: c.icon }))
  };

  worldBuildings.push(newBuilding);
  renderWorldBuildings();

  // 动画与音效
  playUiSound('build_place');
  updateBuildPlacementHudCard();
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof syncMilestoneTrackerDisplay === 'function') syncMilestoneTrackerDisplay();

  showNotification(`【建造成功】已部署【${data.title}】！按 [E] 即可接入控制，按 [F] 可随时拆除。`);
}

// ---------------------------------------------------------------------
// 5. 全局事件监听 (滚轮旋转、鼠标跟随全息图、右键/长按拆除)
// ---------------------------------------------------------------------
document.addEventListener('mousemove', (e) => {
  // 建造模式全息幽灵跟随鼠标
  if (isBuildPlacingMode) {
    const ghost = document.getElementById('buildHologramGhost');
    if (ghost) {
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      ghost.style.transform = `translate(-50%, -50%) rotate(${placingRotationAngle}deg)`;
    }
  }
});

// 鼠标滚轮在建造模式下按策划表 rotStep 旋转全息图
document.addEventListener('wheel', (e) => {
  if (isBuildPlacingMode) {
    e.preventDefault();
    const bDef = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? (XIUXIAN_BUILDINGS[currentPlacingBuildingKey] || XIUXIAN_BUILDINGS[currentPlacingBuildingKey === 'foundation' ? 'foundation_2x2' : currentPlacingBuildingKey]) : null;
    const step = (bDef && typeof bDef.rotStep === 'number') ? bDef.rotStep : 45;
    if (step === 0) {
      placingRotationAngle = 0;
      return;
    }
    if (e.deltaY > 0) {
      placingRotationAngle = (placingRotationAngle + step) % 360;
    } else {
      placingRotationAngle = (placingRotationAngle - step + 360) % 360;
    }
    playUiSound('click');
    const ghost = document.getElementById('buildHologramGhost');
    if (ghost) {
      ghost.style.transform = `translate(-50%, -50%) rotate(${placingRotationAngle}deg)`;
    }
  }
}, { passive: false });

// 鼠标按下：左键放置 / 右键或左键拆除长按 (严格 HUD 模态互斥，防止穿透)
document.addEventListener('mousedown', (e) => {
  // 如果当前有任何模态弹窗打开，或者点击的是弹窗UI/按钮，绝对不响应世界长按与放置！
  if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) {
    return;
  }
  if (e.target.closest('#buildModal') || e.target.closest('#craftModal') || e.target.closest('#invModal') || e.target.closest('#machineModal') || e.target.closest('#hubMilestoneModal') || e.target.closest('#swordCasketModal') || e.target.closest('#codexModal') || e.target.closest('#techTreeModal') || e.target.closest('#jinShenModal') || e.target.closest('#fabaoModal') || e.target.closest('#dspBuildHotbarRoot') || e.target.closest('#combatHudBar') || e.target.closest('#sysActionsContainer') || e.target.closest('button')) {
    return;
  }

  // 1. 拆除模式下长按 (右键 button === 2 或 左键 button === 0)
  if (isDismantleMode) {
    if (currentHoveredBuildingId && (e.button === 2 || e.button === 0)) {
      e.preventDefault();
      startDismantleHold(e);
      return;
    }
  }

  // 2. 建造模式下左键点击放置 (button === 0)
  if (isBuildPlacingMode && e.button === 0) {
    e.preventDefault();
    const xRatio = e.clientX / window.innerWidth;
    const yRatio = e.clientY / window.innerHeight;
    executeBuildPlacementAt(xRatio, yRatio);
    return;
  }

  // 3. 建造模式下右键退出 (3D 模式下普通右键拖拽用于旋转视角，不误触快捷栏关闭)
  if (e.button === 2) {
    if (isBuildPlacingMode) {
      e.preventDefault();
      playUiSound('toggle');
      exitBuildPlacingMode();
      showNotification('已退出建造部署模式');
      return;
    }
    if (!(window.World3D && window.World3D.isReady())) {
      if (typeof handleHotbarEscape === 'function' && handleHotbarEscape()) {
        e.preventDefault();
        return;
      }
    }
  }
});

// 鼠标松开：取消拆除长按
document.addEventListener('mouseup', (e) => {
  if (isDismantleMode) {
    cancelDismantleHold();
  }
});

// 阻止右键默认菜单 (防止干扰长按右键拆除)
document.addEventListener('contextmenu', (e) => {
  if (isDismantleMode || isBuildPlacingMode) {
    e.preventDefault();
  }
});

// 从官方策划表 XIUXIAN_BUILDINGS / XIUXIAN_ITEMS 同步初始场景建筑的真实名称、功耗与拆解返还
function hydrateWorldBuildingsFromTable() {
  const db = getBuildableDatabaseFromTable();
  worldBuildings.forEach(bld => {
    const def = db[bld.type];
    if (!def) return;
    bld.name = def.title || def.name;
    bld.power = def.power;
    if (bld.type === 'power_engine') {
      bld.tagTitle = `${def.title} [复合母机·3插槽]`;
    } else if (bld.type === 'fluid_hub' || bld.type === 'bio_base') {
      bld.tagTitle = `${def.title} [复合母座·单插槽]`;
    } else {
      bld.tagTitle = `${def.title} (${def.power})`;
    }
    if (def.costs && def.costs.length > 0) {
      bld.refund = def.costs.map(c => ({ code: c.code, name: c.name, count: c.need, icon: c.icon }));
    }
  });
}

// 页面加载完成后初次挂载世界建筑
window.addEventListener('DOMContentLoaded', () => {
  hydrateWorldBuildingsFromTable();
  renderWorldBuildings();
});
