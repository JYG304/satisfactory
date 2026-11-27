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

// 场景中的活跃建筑实体列表 (包含复合建筑母机与被动加工器)
let worldBuildings = [
  {
    id: 'bld_engine_init',
    type: 'power_engine',
    name: '灵力引擎 (BD_112)',
    tagTitle: '灵力引擎 (BD_112) [复合母机·3插槽]',
    power: '+50 MW',
    x: 9,
    y: 50,
    width: 210,
    height: 220,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 12, icon: 'fa-sheet-plastic' },
      { code: 'copper_wire', name: '铜线', count: 8, icon: 'fa-plug' }
    ]
  },
  {
    id: 'bld_miner_init',
    type: 'miner',
    name: '采矿机 (BD_101)',
    tagTitle: '采矿机 (BD_101) [被动开采]',
    power: '5 MW',
    x: 21,
    y: 52,
    width: 175,
    height: 180,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', count: 5, icon: 'fa-gear' }
    ]
  },
  {
    id: 'bld_smelter_init',
    type: 'smelter',
    name: '精炼炉 (BD_102)',
    tagTitle: '精炼炉 (BD_102)',
    power: '10 MW',
    x: 32,
    y: 49,
    width: 155,
    height: 175,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 8, icon: 'fa-sheet-plastic' },
      { code: 'refractory_core', name: '耐火炉芯', count: 2, icon: 'fa-fire-burner' }
    ]
  },
  {
    id: 'bld_fluid_hub_init',
    type: 'fluid_hub',
    name: '流体处理中枢 (BD_132)',
    tagTitle: '流体处理中枢 (BD_132) [复合母座·单插槽]',
    power: '12 MW',
    x: 46,
    y: 50,
    width: 195,
    height: 225,
    refund: [
      { code: 'iron_beam', name: '玄铁梁', count: 12, icon: 'fa-cubes-stacked' },
      { code: 'power_supply_module', name: '电源模块', count: 4, icon: 'fa-car-battery' }
    ]
  },
  {
    id: 'bld_bio_base_init',
    type: 'bio_base',
    name: '营养基座 (BD_130)',
    tagTitle: '营养基座 (BD_130) [复合母座·单插槽]',
    power: '10 MW',
    x: 60,
    y: 50,
    width: 195,
    height: 225,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 6, icon: 'fa-sheet-plastic' },
      { code: 'iron_beam', name: '玄铁梁', count: 4, icon: 'fa-cubes-stacked' }
    ]
  },
  {
    id: 'bld_cutter_init',
    type: 'constructor',
    name: '切割机 (BD_105)',
    tagTitle: '切割机 (BD_105)',
    power: '12 MW',
    x: 74,
    y: 53,
    width: 180,
    height: 180,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 10, icon: 'fa-sheet-plastic' },
      { code: 'iron_gear', name: '玄铁齿轮', count: 6, icon: 'fa-gear' }
    ]
  },
  {
    id: 'bld_box_init',
    type: 'storage_box',
    name: '个人储物箱 (BD_115)',
    tagTitle: '个人储物箱 (BD_115)',
    power: '0 MW',
    x: 88,
    y: 55,
    width: 135,
    height: 140,
    refund: [
      { code: 'iron_plate', name: '玄铁板', count: 4, icon: 'fa-sheet-plastic' }
    ]
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
        let iconCls = 'fa-cube';
        if (item && item.icon) {
          const match = item.icon.match(/fa-[a-z0-9-]+/g);
          if (match && match.length > 0) iconCls = match[match.length - 1];
        }
        return {
          code: c.code,
          name: item ? item.name : (c.name || c.code),
          need: c.need,
          icon: iconCls
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
        costs: costs
      };
      db[key] = itemData;

      // 常见别名映射 (兼容旧版调用)
      if (key === 'foundation_4x4') db['foundation'] = itemData;
      if (key === 'furnace') db['smelter'] = itemData;
      if (key === 'cutter') db['constructor'] = itemData;
      if (key === 'teleporter') db['portal'] = itemData;
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
  if (ghost) ghost.classList.remove('hidden');

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
  if (ghost) {
    ghost.innerHTML = buildingSvgTemplates[data.key] || buildingSvgTemplates.foundation;
    ghost.style.width = `${data.width}px`;
    ghost.style.height = `${data.height}px`;
  }

  const titleElem = document.getElementById('buildPlacingTitle');
  const subModeElem = document.getElementById('buildPlacingSubMode');
  const costContainer = document.getElementById('buildPlacingCostCards');

  if (titleElem) titleElem.innerText = data.title;
  if (subModeElem) subModeElem.innerText = `🔨 建造模式: ${data.subMode || '默认'}`;

  if (costContainer) {
    costContainer.innerHTML = '';
    data.costs.forEach(c => {
      const stock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined) ? playerInventory[c.code] : 99;
      const isEnough = stock >= c.need;
      const box = document.createElement('div');
      box.className = `flex flex-col items-center bg-black/75 border ${isEnough ? 'border-white/30' : 'border-rose-500'} rounded px-2.5 py-1 min-w-[56px] shadow-lg`;
      box.innerHTML = `
        <i class="fa-solid ${c.icon} text-stone-200 text-sm mb-0.5"></i>
        <span class="text-[10px] font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'}">${stock} / ${c.need}</span>
      `;
      costContainer.appendChild(box);
    });
  }
}

// 检查是否具备建造成本
function canAffordBuild(buildingKey) {
  const data = buildableDatabase[buildingKey];
  if (!data) return false;
  if (typeof playerInventory === 'undefined') return true;
  return data.costs.every(c => (playerInventory[c.code] || 0) >= c.need);
}

// 执行左键放置建造
function executeBuildPlacementAt(xRatio, yRatio) {
  const data = buildableDatabase[currentPlacingBuildingKey];
  if (!data) return;

  if (!canAffordBuild(currentPlacingBuildingKey)) {
    playUiSound('craft_fail');
    showNotification(`原料不足！无法建造【${data.title}】`);
    return;
  }

  // 扣减物料
  data.costs.forEach(c => {
    if (typeof playerInventory !== 'undefined') {
      playerInventory[c.code] -= c.need;
    }
  });

  // 创建世界实体
  const newId = `bld_${data.key}_${Date.now()}`;
  const newBuilding = {
    id: newId,
    type: data.key,
    name: data.title,
    tagTitle: `${data.title} (${data.power})`,
    power: data.power,
    x: Math.round(xRatio * 100),
    y: Math.round(yRatio * 100),
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

// 鼠标滚轮在建造模式下旋转全息图 (1:1 media_1790442748700.png: 滚轮向上/向下)
document.addEventListener('wheel', (e) => {
  if (isBuildPlacingMode) {
    e.preventDefault();
    if (e.deltaY > 0) {
      placingRotationAngle = (placingRotationAngle + 45) % 360;
    } else {
      placingRotationAngle = (placingRotationAngle - 45 + 360) % 360;
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
  if (e.target.closest('#buildModal') || e.target.closest('#craftModal') || e.target.closest('#invModal') || e.target.closest('#machineModal') || e.target.closest('#hubMilestoneModal') || e.target.closest('#swordCasketModal') || e.target.closest('#codexModal') || e.target.closest('#cpuProcessorModal') || e.target.closest('#jinShenModal') || e.target.closest('#fabaoModal') || e.target.closest('button')) {
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

  // 3. 建造模式下右键退出 (button === 2)
  if (isBuildPlacingMode && e.button === 2) {
    e.preventDefault();
    playUiSound('toggle');
    exitBuildPlacingMode();
    showNotification('已退出建造部署模式');
    return;
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

// 页面加载完成后初次挂载世界建筑
window.addEventListener('DOMContentLoaded', () => {
  renderWorldBuildings();
});
