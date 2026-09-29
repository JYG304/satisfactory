// =========================================================================
// js/central_processor.js - 中央处理器节点信号系统
// 玩法：4个区域各自独立，玩家往输入端口投入游戏材料 → 信号沿节点传播 → 到达核心 → 全厂获得增益
// 区域解锁：序章只开物流区；练气结束开生产区+电力区；筑基结束开研究区
// 节点类型：输入端口 / 增幅矩阵 / 分流晶体 / 谐振腔 / 稳压储能 / 转化器 / 区域核心
// 信号衰减：每经过1个中间节点损耗12%，逼玩家精简路线
// =========================================================================

// 全局工控基座与蓝图连线状态
const CPU_BLUEPRINT_STATE = {
  // 画布视口平移与缩放 (Pan & Zoom)
  zoom: 0.82,
  panX: -15,
  panY: -15,
  rotation: 0,
  activeZoneId: 'zone1', // 'zone1', 'zone2', 'zone3', 'zone4'

  // 解锁进度：'prologue' | 'lianqi' | 'zhuji'
  // 序章：只有zone1可用  练气完成：zone1/2/3可用  筑基完成：全部可用
  gameStage: 'prologue',

  // 节点槽位上限（随阶段扩展）
  // prologue: 2槽, lianqi: 4槽, zhuji: 6槽
  slotCaps: { prologue: 2, lianqi: 4, zhuji: 6 },

  // 已解锁的节点类型（按阶段累积）
  // prologue: 输入端口+增幅矩阵  lianqi追加: 分流晶体+稳压储能  zhuji追加: 谐振腔+转化器
  unlockedNodeTypes: ['input', 'amplifier', 'core'],

  // 四大区域
  zones: {
    zone1: {
      id: 'zone1',
      name: '物流区',
      shortName: '物流',
      themeColor: '#38bdf8',
      icon: 'fa-solid fa-conveyor-belt-boxes',
      rect: { x: 50, y: 50, width: 880, height: 500 },
      unlocked: true,
      satisfied: false,
      // 增益配置
      buffType: 'logistics',
      buffLabel: '传送带吞吐量',
      buffLabel2: '升降机速度',
      buffValue: 0,       // 当前增益（%）
      buffValue2: 0,
      // 接受的输入材料及其信号强度
      inputMaterials: {
        '玄铁齿轮':   { signal: 60,  rate: 8,  icon: 'fa-solid fa-gear' },
        '灵磁齿轮':   { signal: 100, rate: 6,  icon: 'fa-solid fa-gear' },
        '设备传动件': { signal: 250, rate: 3,  icon: 'fa-solid fa-cog' }
      },
      // 当前接入的材料（输入端口节点读取）
      activeInput: null,
      activeInput2: null,
      coreRequirement: '将信号传入物流核心节点'
    },
    zone2: {
      id: 'zone2',
      name: '生产区',
      shortName: '生产',
      themeColor: '#f59e0b',
      icon: 'fa-solid fa-industry',
      rect: { x: 1040, y: 50, width: 880, height: 500 },
      unlocked: false,
      satisfied: false,
      buffType: 'production',
      buffLabel: '设备工作速度',
      buffLabel2: '热量效率',
      buffValue: 0,
      buffValue2: 0,
      inputMaterials: {
        '煤炭':       { signal: 40,  rate: 10, icon: 'fa-solid fa-fire' },
        '耐火炉芯':   { signal: 90,  rate: 4,  icon: 'fa-solid fa-fire-burner' },
        '精炼玄铁锭': { signal: 140, rate: 2,  icon: 'fa-solid fa-cube' }
      },
      activeInput: null,
      activeInput2: null,
      unlockRequirement: '完成练气阶段所有认证后解锁',
      coreRequirement: '将信号传入生产核心节点'
    },
    zone3: {
      id: 'zone3',
      name: '电力区',
      shortName: '电力',
      themeColor: '#a855f7',
      icon: 'fa-solid fa-bolt',
      rect: { x: 1040, y: 620, width: 880, height: 500 },
      unlocked: false,
      satisfied: false,
      buffType: 'power',
      buffLabel: '全厂耗电降低',
      buffLabel2: '发电机产出',
      buffValue: 0,
      buffValue2: 0,
      inputMaterials: {
        '铜线':     { signal: 40,  rate: 15, icon: 'fa-solid fa-plug' },
        '导电线圈': { signal: 100, rate: 4,  icon: 'fa-solid fa-circle-notch' },
        '电能核心': { signal: 200, rate: 1,  icon: 'fa-solid fa-atom' }
      },
      activeInput: null,
      activeInput2: null,
      unlockRequirement: '完成练气阶段所有认证后解锁',
      coreRequirement: '将信号传入电力核心节点'
    },
    zone4: {
      id: 'zone4',
      name: '研究区',
      shortName: '研究',
      themeColor: '#10b981',
      icon: 'fa-solid fa-flask',
      rect: { x: 50, y: 620, width: 880, height: 500 },
      unlocked: false,
      satisfied: false,
      buffType: 'research',
      buffLabel: '解析数据产出',
      buffLabel2: '认证消耗减免',
      buffValue: 0,
      buffValue2: 0,
      inputMaterials: {
        '基础控制模块': { signal: 50,  rate: 4, icon: 'fa-solid fa-microchip' },
        '电子生物芯片': { signal: 175, rate: 1, icon: 'fa-solid fa-dna' }
      },
      activeInput: null,
      activeInput2: null,
      unlockRequirement: '完成筑基阶段所有认证后解锁',
      coreRequirement: '将信号传入研究核心节点'
    }
  },

  // 跨区域全版图节点集与电缆集
  nodes: [],
  wires: [],

  // 当前连线中临时状态
  connectingPin: null, // { nodeId, pinId, pinType: 'out'|'in', x, y, color }

  // 节点拖动
  draggingNodeId: null,
  dragStartMouse: { x: 0, y: 0 },
  initialNodePos: { x: 0, y: 0 },

  // 画布平移交互
  isPanning: false,
  panStartMouse: { x: 0, y: 0 },
  initialPanPos: { x: 0, y: 0 },

  // 选中的节点
  selectedEntity: null,

  // 宏观运行与大招状态
  pulseActive: false,
  pulseSecondsLeft: 0,
  paramLockedUntil: 0
};

// =========================================================================
// 节点预置：每区有固定布局，序章只显示物流区节点
// 节点类型说明：
//   input     = 输入端口（唯一接受游戏材料的节点）
//   amplifier = 增幅矩阵（放大信号，耗电）
//   branch    = 分流晶体（一分二，各得55%）
//   resonator = 谐振腔（双路输入触发×1.6乘法加成）
//   stabilizer= 稳压储能（断供保护，储能缓冲）
//   converter = 转化器（跨区域信号转换，×0.5效率）
//   core      = 区域核心（终点，输出增益值）
// =========================================================================
const CPU_WORLD_NODES_PRESET = [
  // -----------------------------------------------------------------------
  // 物流区 (zone1) — 序章即可用，初始已预连
  // -----------------------------------------------------------------------
  {
    id: 'z1_input_a', zoneId: 'zone1',
    type: 'input', name: '输入端口 A', category: '材料输入',
    x: 80, y: 130, width: 175, themeColor: '#38bdf8', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入材料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: '信号 OUT', color: '#38bdf8' }]
  },
  {
    id: 'z1_amp_1', zoneId: 'zone1',
    type: 'amplifier', name: '增幅矩阵', category: 'CPU运算 · 增幅',
    x: 320, y: 220, width: 185, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '信号 ×1.5 | 耗电 +6 MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: '信号 IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: '信号 OUT', color: '#f59e0b' }]
  },
  {
    id: 'z1_core', zoneId: 'zone1',
    type: 'core', name: '物流核心', category: '区域核心',
    x: 570, y: 220, width: 190, themeColor: '#38bdf8', icon: 'fa-solid fa-microchip',
    valText: '等待信号接入…', signalIn: 0,
    inPins:  [{ id: 'in', label: '信号 IN', color: '#38bdf8', isGold: true }],
    outPins: []
  },

  // -----------------------------------------------------------------------
  // 生产区 (zone2) — 练气阶段完成后解锁
  // -----------------------------------------------------------------------
  {
    id: 'z2_input_a', zoneId: 'zone2',
    type: 'input', name: '输入端口 A', category: '材料输入',
    x: 1080, y: 130, width: 175, themeColor: '#f59e0b', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入材料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: '信号 OUT', color: '#f59e0b' }]
  },
  {
    id: 'z2_amp_1', zoneId: 'zone2',
    type: 'amplifier', name: '增幅矩阵', category: 'CPU运算 · 增幅',
    x: 1310, y: 220, width: 185, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '信号 ×1.5 | 耗电 +6 MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: '信号 IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: '信号 OUT', color: '#f59e0b' }]
  },
  {
    id: 'z2_core', zoneId: 'zone2',
    type: 'core', name: '生产核心', category: '区域核心',
    x: 1560, y: 220, width: 190, themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
    valText: '等待信号接入…', signalIn: 0,
    inPins:  [{ id: 'in', label: '信号 IN', color: '#f59e0b', isGold: true }],
    outPins: []
  },

  // -----------------------------------------------------------------------
  // 电力区 (zone3) — 练气阶段完成后解锁
  // -----------------------------------------------------------------------
  {
    id: 'z3_input_a', zoneId: 'zone3',
    type: 'input', name: '输入端口 A', category: '材料输入',
    x: 1080, y: 700, width: 175, themeColor: '#a855f7', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入材料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: '信号 OUT', color: '#a855f7' }]
  },
  {
    id: 'z3_amp_1', zoneId: 'zone3',
    type: 'amplifier', name: '增幅矩阵', category: 'CPU运算 · 增幅',
    x: 1310, y: 790, width: 185, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '信号 ×1.5 | 耗电 +6 MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: '信号 IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: '信号 OUT', color: '#f59e0b' }]
  },
  {
    id: 'z3_core', zoneId: 'zone3',
    type: 'core', name: '电力核心', category: '区域核心',
    x: 1560, y: 790, width: 190, themeColor: '#a855f7', icon: 'fa-solid fa-bolt',
    valText: '等待信号接入…', signalIn: 0,
    inPins:  [{ id: 'in', label: '信号 IN', color: '#a855f7', isGold: true }],
    outPins: []
  },

  // -----------------------------------------------------------------------
  // 研究区 (zone4) — 筑基阶段完成后解锁
  // -----------------------------------------------------------------------
  {
    id: 'z4_input_a', zoneId: 'zone4',
    type: 'input', name: '输入端口 A', category: '材料输入',
    x: 80, y: 700, width: 175, themeColor: '#10b981', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入材料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: '信号 OUT', color: '#10b981' }]
  },
  {
    id: 'z4_amp_1', zoneId: 'zone4',
    type: 'amplifier', name: '增幅矩阵', category: 'CPU运算 · 增幅',
    x: 310, y: 790, width: 185, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '信号 ×1.5 | 耗电 +6 MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: '信号 IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: '信号 OUT', color: '#f59e0b' }]
  },
  {
    id: 'z4_core', zoneId: 'zone4',
    type: 'core', name: '研究核心', category: '区域核心',
    x: 560, y: 790, width: 190, themeColor: '#10b981', icon: 'fa-solid fa-flask',
    valText: '等待信号接入…', signalIn: 0,
    inPins:  [{ id: 'in', label: '信号 IN', color: '#10b981', isGold: true }],
    outPins: []
  }
];

// 初始连线预置：物流区输入端口→增幅矩阵→核心，开箱即见发光回路
const CPU_INITIAL_WIRES_PRESET = [
  { id: 'w_z1_in_amp', fromNode: 'z1_input_a', fromPin: 'out_a', toNode: 'z1_amp_1', toPin: 'in', color: '#38bdf8' },
  { id: 'w_z1_amp_core', fromNode: 'z1_amp_1', fromPin: 'out', toNode: 'z1_core', toPin: 'in', color: '#f59e0b', isGold: true }
];

// =========================================================================
// 初始化
// =========================================================================
function initCentralProcessorBlueprint() {
  CPU_BLUEPRINT_STATE.nodes = JSON.parse(JSON.stringify(CPU_WORLD_NODES_PRESET));
  CPU_BLUEPRINT_STATE.wires = JSON.parse(JSON.stringify(CPU_INITIAL_WIRES_PRESET));
  CPU_BLUEPRINT_STATE.connectingPin = null;
  CPU_BLUEPRINT_STATE.draggingNodeId = null;

  // 根据游戏阶段设置区域解锁状态
  const stage = CPU_BLUEPRINT_STATE.gameStage;
  CPU_BLUEPRINT_STATE.zones.zone1.unlocked = true;
  CPU_BLUEPRINT_STATE.zones.zone2.unlocked = (stage === 'lianqi' || stage === 'zhuji');
  CPU_BLUEPRINT_STATE.zones.zone3.unlocked = (stage === 'lianqi' || stage === 'zhuji');
  CPU_BLUEPRINT_STATE.zones.zone4.unlocked = (stage === 'zhuji');

  // 根据阶段设置可用节点类型
  if (stage === 'prologue') {
    CPU_BLUEPRINT_STATE.unlockedNodeTypes = ['input', 'amplifier', 'core'];
  } else if (stage === 'lianqi') {
    CPU_BLUEPRINT_STATE.unlockedNodeTypes = ['input', 'amplifier', 'branch', 'stabilizer', 'core'];
  } else {
    CPU_BLUEPRINT_STATE.unlockedNodeTypes = ['input', 'amplifier', 'branch', 'stabilizer', 'resonator', 'converter', 'core'];
  }

  updateCanvasTransform();
  renderBlueprintPhaseTabs();
  renderBlueprintZonesHtml();
  renderBlueprintNodesHtml();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();

  requestAnimationFrame(() => {
    renderBlueprintWiresSvg();
    setTimeout(() => renderBlueprintWiresSvg(), 40);
  });





}












// =========================================================================
// 1. 画布平移 (Pan) 与滚轮缩放 (Zoom) 核心驱动
// =========================================================================

function updateCanvasTransform() {
  const container = document.getElementById('cpuWorldContainer');
  if (container) {
    container.style.transform = `translate(${CPU_BLUEPRINT_STATE.panX}px, ${CPU_BLUEPRINT_STATE.panY}px) scale(${CPU_BLUEPRINT_STATE.zoom})`;
  }

  const badge = document.getElementById('cpuZoomBadge');
  if (badge) {
    badge.textContent = `${Math.round(CPU_BLUEPRINT_STATE.zoom * 100)}%`;
  }
}

// 按钮缩放增量
function handleZoomCanvas(delta) {
  playUiSound('click');
  const vp = document.getElementById('paragonViewport');
  const vpRect = vp ? vp.getBoundingClientRect() : { width: 880, height: 500 };
  const centerX = vpRect.width / 2;
  const centerY = vpRect.height / 2;

  const oldZoom = CPU_BLUEPRINT_STATE.zoom;
  const newZoom = Math.max(0.32, Math.min(2.2, oldZoom + delta));

  // 以视口中心为基准缩放
  CPU_BLUEPRINT_STATE.panX = centerX - (centerX - CPU_BLUEPRINT_STATE.panX) * (newZoom / oldZoom);
  CPU_BLUEPRINT_STATE.panY = centerY - (centerY - CPU_BLUEPRINT_STATE.panY) * (newZoom / oldZoom);
  CPU_BLUEPRINT_STATE.zoom = newZoom;

  updateCanvasTransform();
  renderBlueprintWiresSvg();
}

// 鼠标滚轮平滑缩放 (以鼠标指针为中心)
function handleCanvasWheel(e) {
  e.preventDefault();
  const vp = document.getElementById('paragonViewport');
  if (!vp) return;

  const vpRect = vp.getBoundingClientRect();
  const mouseX = e.clientX - vpRect.left;
  const mouseY = e.clientY - vpRect.top;

  const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
  const oldZoom = CPU_BLUEPRINT_STATE.zoom;
  const newZoom = Math.max(0.32, Math.min(2.2, oldZoom * zoomFactor));

  // 算法：鼠标所在世界坐标保持不变
  CPU_BLUEPRINT_STATE.panX = mouseX - (mouseX - CPU_BLUEPRINT_STATE.panX) * (newZoom / oldZoom);
  CPU_BLUEPRINT_STATE.panY = mouseY - (mouseY - CPU_BLUEPRINT_STATE.panY) * (newZoom / oldZoom);
  CPU_BLUEPRINT_STATE.zoom = newZoom;

  updateCanvasTransform();
  renderBlueprintWiresSvg();
}

// 画布空白处按住鼠标拖拽平移
function handleCanvasMouseDown(e) {
  // 如果点击的是节点、引脚、按钮或滑块，不触发画布平移
  if (e.target.closest('.bp-node-card') || e.target.closest('button') || e.target.closest('input')) {
    return;
  }

  CPU_BLUEPRINT_STATE.isPanning = true;
  CPU_BLUEPRINT_STATE.panStartMouse.x = e.clientX;
  CPU_BLUEPRINT_STATE.panStartMouse.y = e.clientY;
  CPU_BLUEPRINT_STATE.initialPanPos.x = CPU_BLUEPRINT_STATE.panX;
  CPU_BLUEPRINT_STATE.initialPanPos.y = CPU_BLUEPRINT_STATE.panY;

  const vp = document.getElementById('paragonViewport');
  if (vp) vp.classList.add('bp-viewport-panning');
}

// 重置视角至 100% (居中对齐启道区)
function resetCanvasView() {
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.zoom = 1.0;
  CPU_BLUEPRINT_STATE.panX = -20;
  CPU_BLUEPRINT_STATE.panY = -20;
  updateCanvasTransform();
  renderBlueprintWiresSvg();
  showNotification('视角已重置至 100% 原始标称尺寸');
}

// 全景俯瞰四区 (自动居中完整容纳 2200x1300 大世界)
function fitAllZonesCanvasView() {
  playUiSound('toggle');
  const vp = document.getElementById('paragonViewport');
  const vpRect = vp ? vp.getBoundingClientRect() : { width: 880, height: 500 };

  // 计算适配缩放比
  const scaleX = vpRect.width / 2150;
  const scaleY = vpRect.height / 1250;
  const fitZoom = Math.max(0.34, Math.min(0.55, Math.min(scaleX, scaleY) * 0.95));

  CPU_BLUEPRINT_STATE.zoom = fitZoom;
  CPU_BLUEPRINT_STATE.panX = Math.round((vpRect.width - 2000 * fitZoom) / 2);
  CPU_BLUEPRINT_STATE.panY = Math.round((vpRect.height - 1200 * fitZoom) / 2);

  updateCanvasTransform();
  renderBlueprintWiresSvg();
  showNotification('已切换至【全景俯瞰模式】：四大区域与跨区导灵光缆尽收眼底！');
}

// 快速平移跳至指定区域
function jumpToZone(zoneId) {
  playUiSound('click');
  const zone = CPU_BLUEPRINT_STATE.zones[zoneId];
  if (!zone) return;

  CPU_BLUEPRINT_STATE.activeZoneId = zoneId;

  const vp = document.getElementById('paragonViewport');
  const vpRect = vp ? vp.getBoundingClientRect() : { width: 880, height: 500 };
  const targetZoom = 0.85;

  // 将区域中心平移至视口中心
  const zoneCenterX = zone.rect.x + zone.rect.width / 2;
  const zoneCenterY = zone.rect.y + zone.rect.height / 2;

  CPU_BLUEPRINT_STATE.zoom = targetZoom;
  CPU_BLUEPRINT_STATE.panX = Math.round(vpRect.width / 2 - zoneCenterX * targetZoom);
  CPU_BLUEPRINT_STATE.panY = Math.round(vpRect.height / 2 - zoneCenterY * targetZoom);

  // 更新顶部导航高亮
  ['zone1', 'zone2', 'zone3', 'zone4'].forEach(z => {
    const btn = document.getElementById(`jumpBtn_${z}`);
    if (btn) {
      if (z === zoneId) {
        btn.className = 'px-2 py-0.5 rounded bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-bold transition cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.4)]';
      } else {
        btn.className = 'px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10 hover:text-white font-bold transition cursor-pointer';
      }
    }
  });

  renderBlueprintPhaseTabs();
  updateCanvasTransform();
  renderBlueprintWiresSvg();
  showNotification(`已平移聚焦至：【${zone.name}】！`);
}

// 渲染顶栏阶段 Tabs (同步高亮与锁定图标)
function renderBlueprintPhaseTabs() {
  const container = document.getElementById('cpuBlueprintPhaseTabs');
  if (!container) return;

  const zones = [
    { key: 'zone1', name: '1. 物流区', icon: 'fa-solid fa-conveyor-belt-boxes' },
    { key: 'zone2', name: '2. 生产区', icon: 'fa-solid fa-industry' },
    { key: 'zone3', name: '3. 电力区', icon: 'fa-solid fa-bolt' },
    { key: 'zone4', name: '4. 研究区', icon: 'fa-solid fa-flask' }
  ];

  let html = '';
  zones.forEach(z => {
    const isCur = z.key === CPU_BLUEPRINT_STATE.activeZoneId;
    const isUn = CPU_BLUEPRINT_STATE.zones[z.key]?.unlocked;
    const zData = CPU_BLUEPRINT_STATE.zones[z.key];
    const buffVal = zData?.buffValue || 0;
    html += `
      <button onclick="jumpToZone('${z.key}');"
              id="topTabBtn_${z.key}"
              class="px-2.5 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 border ${
                isCur
                  ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,146,30,0.6)]'
                  : (isUn ? 'bg-black/50 text-white/80 border-white/10 hover:border-amber-400/50 hover:text-white' : 'bg-black/40 text-white/40 border-white/5 cursor-pointer')
              }">
        <i class="${z.icon} text-xs"></i>
        <span>${z.name}</span>
        ${isUn && buffVal > 0 ? `<span class="text-green-300 text-[9px] font-mono">+${buffVal.toFixed(0)}%</span>` : ''}
        ${isUn ? '' : '<i class="fa-solid fa-lock text-[9px] text-red-400 ml-0.5"></i>'}
      </button>
    `;
  });

  container.innerHTML = html;
}




// 顺时针旋转拓扑 90°
function rotateCpuBlueprintTopology() {
  playUiSound('toggle');
  CPU_BLUEPRINT_STATE.rotation = (CPU_BLUEPRINT_STATE.rotation + 90) % 360;
  
  const badge = document.getElementById('cpuTopologyAngleBadge');
  if (badge) {
    badge.textContent = `⟳ 拓扑旋转: ${CPU_BLUEPRINT_STATE.rotation}°`;
  }

  showNotification(`已顺时针旋转拓扑 90°！当前阵盘朝向: ${CPU_BLUEPRINT_STATE.rotation}°`);
}

// 接下页阵盘 (自动顺延至下一区域)
function attachNextCpuCircuitPage() {
  playUiSound('zap');
  const zoneOrder = ['zone1', 'zone2', 'zone3', 'zone4'];
  const curIdx = zoneOrder.indexOf(CPU_BLUEPRINT_STATE.activeZoneId);
  const nextIdx = (curIdx + 1) % zoneOrder.length;
  jumpToZone(zoneOrder[nextIdx]);
}

// =========================================================================
// 2. 渲染四大区域底板、锁定遮罩与跨区引线指引 (HTML Layer)
// =========================================================================
function renderBlueprintZonesHtml() {
  const container = document.getElementById('cpuWiringZonesLayer');
  if (!container) return;

  let html = '';
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(zKey => {
    const z = CPU_BLUEPRINT_STATE.zones[zKey];
    const isUnlocked = z.unlocked;
    const isSatisfied = z.satisfied;

    let statusBadge = '';
    if (!isUnlocked) {
      statusBadge = '<span class="text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-500/50 px-2 py-0.5 rounded flex items-center space-x-1"><i class="fa-solid fa-lock text-[9px]"></i><span>待引线解锁</span></span>';
    } else if (isSatisfied) {
      statusBadge = '<span class="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/60 px-2 py-0.5 rounded flex items-center space-x-1"><i class="fa-solid fa-check text-[9px]"></i><span>★ 核心已满足</span></span>';
    } else {
      statusBadge = '<span class="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-400/50 px-2 py-0.5 rounded flex items-center space-x-1"><i class="fa-solid fa-circle-notch animate-spin text-[9px]"></i><span>工控调配中</span></span>';
    }

    // 锁定层遮罩 HTML
    let lockOverlayHtml = '';
    if (!isUnlocked) {
      lockOverlayHtml = `
        <div class="bp-zone-lock-overlay p-6 text-center space-y-3">
          <div class="w-14 h-14 rounded-full bg-red-950/70 border-2 border-red-500 flex items-center justify-center text-red-400 text-2xl shadow-[0_0_20px_#ef4444] animate-pulse">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h4 class="text-sm font-black text-white tracking-wider">${z.name} · 封禁待通电</h4>
          <p class="text-xs text-white/80 max-w-[380px] leading-relaxed">
            ${z.unlockRequirement || '需满足前置区域核心要求，并引线接入解锁！'}
          </p>
          <button onclick="unlockZoneDirect('${z.id}');" class="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-[#f5921e] hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs rounded shadow-[0_0_12px_rgba(245,146,30,0.6)] cursor-pointer transition flex items-center space-x-1.5 mx-auto active:scale-95">
            <i class="fa-solid fa-bolt text-xs"></i>
            <span>强制引线通电破封 (调试)</span>
          </button>
        </div>
      `;
    }

    html += `
      <div id="zoneCard_${z.id}" 
           style="left: ${z.rect.x}px; top: ${z.rect.y}px; width: ${z.rect.width}px; height: ${z.rect.height}px;" 
           class="bp-zone-card ${isUnlocked ? 'zone-unlocked' : ''} ${isSatisfied ? 'zone-satisfied' : ''}">
        
        <!-- 区域顶栏信息 -->
        <div class="p-3 border-b border-white/10 flex items-center justify-between pointer-events-auto">
          <div class="flex items-center space-x-2">
            <i class="${z.icon} text-sm" style="color: ${z.themeColor};"></i>
            <span class="text-xs font-black text-white font-mono tracking-wider">${z.name}</span>
          </div>
          <div class="flex items-center space-x-2">
            ${statusBadge}
          </div>
        </div>

        <!-- 区域核心要求提示浮签 (左下角) -->
        <div class="absolute bottom-2.5 left-3.5 text-[10px] font-mono text-white/40 pointer-events-none select-none flex items-center space-x-1.5">
          <i class="fa-solid fa-bullseye text-cyan-400 text-xs"></i>
          <span>核心要求: ${z.coreRequirement}</span>
        </div>

        ${lockOverlayHtml}
      </div>
    `;
  });

  container.innerHTML = html;
}

// 直接解锁指定区域
function unlockZoneDirect(zoneId) {
  playUiSound('zap');
  const z = CPU_BLUEPRINT_STATE.zones[zoneId];
  if (!z) return;

  z.unlocked = true;
  renderBlueprintZonesHtml();
  renderBlueprintPhaseTabs();
  updateBlueprintMonitorStats();
  showNotification(`⚡【${z.name}】已成功解锁并通电！可自由操作本区节点！`);
}

// =========================================================================
// 3. 渲染节点卡片 HTML 层 (高保真虚幻蓝图风格，支持鼠标拖拽)
// =========================================================================
function renderBlueprintNodesHtml() {
  const layer = document.getElementById('cpuWiringNodesLayer');
  if (!layer) return;

  let html = '';
  CPU_BLUEPRINT_STATE.nodes.forEach(node => {
    // 输入引脚 (左侧)
    let inPinsHtml = '';
    if (node.inPins && node.inPins.length > 0) {
      inPinsHtml = '<div class="flex flex-col space-y-2 py-1">';
      node.inPins.forEach(pin => {
        inPinsHtml += `
          <div class="flex items-center space-x-1.5 group cursor-pointer" 
               onclick="handleBlueprintPinClick('${node.id}', '${pin.id}', 'in', event);"
               title="点击连接至该输入引脚 [IN]">
            <div id="pin_${node.id}_${pin.id}" 
                 class="bp-pin bp-pin-in" 
                 style="border-color: ${pin.color || '#00f0ff'};">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
            </div>
            <span class="text-[9px] font-mono text-white/80 group-hover:text-cyan-300 transition whitespace-nowrap leading-none">${pin.label}</span>
          </div>
        `;
      });
      inPinsHtml += '</div>';
    }

    // 输出引脚 (右侧)
    let outPinsHtml = '';
    if (node.outPins && node.outPins.length > 0) {
      outPinsHtml = '<div class="flex flex-col space-y-2 py-1 items-end">';
      node.outPins.forEach(pin => {
        outPinsHtml += `
          <div class="flex items-center space-x-1.5 group cursor-pointer justify-end" 
               onclick="handleBlueprintPinClick('${node.id}', '${pin.id}', 'out', event);"
               title="点击引脚拉出导灵光缆 [OUT]">
            <span class="text-[9px] font-mono text-white/80 group-hover:text-amber-300 transition whitespace-nowrap leading-none">${pin.label}</span>
            <div id="pin_${node.id}_${pin.id}" 
                 class="bp-pin bp-pin-out" 
                 style="border-color: ${pin.color || '#f59e0b'};">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            </div>
          </div>
        `;
      });
      outPinsHtml += '</div>';
    }

    // 中间微调与交互控件 (根据节点类型渲染专属工控模块)
    let customWidgetHtml = '';
    if (node.type === 'input') {
      const zone = CPU_BLUEPRINT_STATE.zones[node.zoneId || 'zone1'];
      const materials = zone ? zone.inputMaterials : {};
      let optionsHtml = '';
      Object.keys(materials).forEach(mName => {
        const m = materials[mName];
        const isSel = node.material === mName;
        optionsHtml += `
          <button onclick="selectInputNodeMaterial('${node.id}', '${mName}');" 
                  class="px-1.5 py-1 text-[9px] rounded font-mono transition flex items-center justify-between border ${
                    isSel 
                      ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]' 
                      : 'bg-black/40 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                  }">
            <span class="flex items-center space-x-1">
              <i class="${m.icon} text-[9px] text-amber-400"></i>
              <span>${mName}</span>
            </span>
            <span class="text-amber-300 font-bold ml-1">${m.signal}</span>
          </button>
        `;
      });

      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1.5 bg-black/50 rounded border border-cyan-500/20 flex flex-col space-y-1">
          <div class="flex justify-between text-[9px] font-mono text-white/60">
            <span>投入外部物料:</span>
            <span class="text-cyan-300 font-bold">${node.material ? '信号: ' + (node.signalOut || 0) : '未接入'}</span>
          </div>
          <div class="grid grid-cols-1 gap-1">
            ${optionsHtml}
          </div>
        </div>
      `;
    } else if (node.type === 'amplifier') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1 bg-amber-950/40 rounded border border-amber-500/30 flex items-center justify-between text-[9px] font-mono">
          <span class="text-white/70">算力倍频: <b class="text-amber-300">×1.50</b></span>
          <span class="text-red-300">耗电: +6 MW</span>
        </div>
      `;
    } else if (node.type === 'branch') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1 bg-cyan-950/40 rounded border border-cyan-500/30 flex items-center justify-between text-[9px] font-mono">
          <span class="text-white/70">双路分流: <b class="text-cyan-300">55% / 55%</b></span>
          <span class="text-white/50">损耗 12%</span>
        </div>
      `;
    } else if (node.type === 'resonator') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1 bg-purple-950/40 rounded border border-purple-500/30 flex items-center justify-between text-[9px] font-mono">
          <span class="text-white/70">双路谐振:</span>
          <span class="text-purple-300 font-bold">${node.isResonating ? '★ 谐振触发 ×1.6' : '等待双路并入'}</span>
        </div>
      `;
    } else if (node.type === 'stabilizer') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1 bg-emerald-950/40 rounded border border-emerald-500/30 flex items-center justify-between text-[9px] font-mono">
          <span class="text-white/70">断供蓄能缓冲:</span>
          <span class="text-emerald-300 font-bold">100% 满压</span>
        </div>
      `;
    } else if (node.type === 'converter') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1 bg-orange-950/40 rounded border border-orange-500/30 flex items-center justify-between text-[9px] font-mono">
          <span class="text-white/70">跨区频谱调制:</span>
          <span class="text-orange-300 font-bold">效率 50%</span>
        </div>
      `;
    } else if (node.type === 'core') {
      customWidgetHtml = `
        <div class="my-1.5 px-2 py-1.5 bg-black/60 rounded border border-amber-500/40 flex flex-col space-y-0.5 text-[9px] font-mono">
          <div class="flex justify-between">
            <span class="text-white/60">注入总信号:</span>
            <span class="text-amber-300 font-bold">${node.signalIn ? node.signalIn.toFixed(1) : '0.0'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-white/60">当前生效增益:</span>
            <span class="text-emerald-300 font-bold">${node.buffText || '待接入'}</span>
          </div>
        </div>
      `;
    }

    html += `
      <div id="node_${node.id}" 
           style="left: ${node.x}px; top: ${node.y}px; width: ${node.width || 180}px;" 
           class="bp-node-card">
        
        <!-- 节点顶栏 (鼠标按住可全画布拖拽) -->
        <div class="bp-node-header" 
             onmousedown="startDragBlueprintNode('${node.id}', event);">
          <div class="flex items-center space-x-1.5">
            <i class="${node.icon} text-xs" style="color: ${node.themeColor || '#00f0ff'};"></i>
            <span class="text-xs font-bold text-white whitespace-nowrap">${node.name}</span>
          </div>
          <i class="fa-solid fa-grip-lines text-white/30 text-[10px]"></i>
        </div>

        <!-- 节点主体数据 -->
        <div class="p-2 space-y-1">
          <div class="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span>${node.category}</span>
            <span class="font-bold" style="color: ${node.themeColor || '#00f0ff'};">${node.valText || '就绪'}</span>
          </div>

          ${customWidgetHtml}

          <!-- 引脚出入口横排分布 -->
          <div class="flex items-center justify-between pt-1 border-t border-white/5">
            ${inPinsHtml || '<div class="w-1"></div>'}
            ${outPinsHtml || '<div class="w-1"></div>'}
          </div>
        </div>

      </div>
    `;
  });

  layer.innerHTML = html;
}

// =========================================================================
// 4. 计算引脚精确绝对坐标 (世界坐标系，与 SVG 1:1 对齐)
// =========================================================================
function getBlueprintPinCoords(nodeId, pinId) {
  const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === nodeId);
  if (!node) return { x: 100, y: 100 };

  const nodeWidth = node.width || 180;
  const inPins = node.inPins || [];
  const inIdx = inPins.findIndex(p => p.id === pinId);
  const hasSlider = (node.type === 'splitter' || node.type === 'valve');
  const basePinY = node.y + (hasSlider ? 95 : 62);

  if (inIdx !== -1) {
    return {
      x: node.x + 14,
      y: basePinY + inIdx * 24
    };
  }

  const outPins = node.outPins || [];
  const outIdx = outPins.findIndex(p => p.id === pinId);
  if (outIdx !== -1) {
    return {
      x: node.x + nodeWidth - 14,
      y: basePinY + outIdx * 24
    };
  }

  return { x: node.x + nodeWidth / 2, y: node.y + 50 };
}

// 渲染发光贝塞尔曲线光缆 (SVG 层)
function renderBlueprintWiresSvg() {
  const svg = document.getElementById('cpuWiringSvg');
  if (!svg) return;

  let wiresHtml = '';

  // 1. 渲染已连接电缆
  CPU_BLUEPRINT_STATE.wires.forEach((wire, wIdx) => {
    const p1 = getBlueprintPinCoords(wire.fromNode, wire.fromPin);
    const p2 = getBlueprintPinCoords(wire.toNode, wire.toPin);
    const x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;

    // 贝塞尔控制点计算 (流畅 S 弯曲线)
    const dx = Math.max(50, Math.abs(x2 - x1) * 0.55);
    const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    const isInterZone = wire.fromPin.includes('zone') || wire.toPin.includes('zone') || wire.isGold;
    const wireColor = isInterZone ? '#ffd700' : (wire.color || '#00f0ff');
    const flowClass = isInterZone ? 'flowing-wire-gold inter-zone-wire' : 'flowing-wire';

    wiresHtml += `
      <!-- 背景粗光晕线 -->
      <path d="${d}" fill="none" stroke="${wireColor}" stroke-width="${isInterZone ? '7' : '5'}" opacity="0.35" 
            filter="drop-shadow(0 0 12px ${wireColor})" />
      
      <!-- 动态流水光斑导线 -->
      <path d="${d}" fill="none" stroke="${wireColor}" stroke-width="${isInterZone ? '3.5' : '2.8'}" 
            class="${flowClass} bp-wire-path" 
            onclick="removeBlueprintWire(${wIdx});"
            title="点击剪断/拆除此连线" />

      <!-- 导线核心白炽光流 -->
      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.85" pointer-events="none" />
    `;
  });

  // 2. 渲染正在拉伸的临时连线 (Rubber-band wire)
  if (CPU_BLUEPRINT_STATE.connectingPin) {
    const pin = CPU_BLUEPRINT_STATE.connectingPin;
    const x1 = pin.x, y1 = pin.y;
    const x2 = pin.curX || (x1 + 60), y2 = pin.curY || y1;
    const dx = Math.max(30, Math.abs(x2 - x1) * 0.5);
    const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    wiresHtml += `
      <path d="${d}" fill="none" stroke="#f5921e" stroke-width="3.5" stroke-dasharray="6 4" class="flowing-wire" />
      <circle cx="${x2}" cy="${y2}" r="5" fill="#f5921e" filter="drop-shadow(0 0 8px #f5921e)" />
    `;
  }

  svg.innerHTML = wiresHtml;
}

// =========================================================================
// 5. 节点拖拽与画布平移交互 (受 zoom 缩放比精确变换)
// =========================================================================
function startDragBlueprintNode(nodeId, e) {
  e.stopPropagation();
  e.preventDefault();

  const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === nodeId);
  if (!node) return;

  CPU_BLUEPRINT_STATE.draggingNodeId = nodeId;
  CPU_BLUEPRINT_STATE.dragStartMouse.x = e.clientX;
  CPU_BLUEPRINT_STATE.dragStartMouse.y = e.clientY;
  CPU_BLUEPRINT_STATE.initialNodePos.x = node.x;
  CPU_BLUEPRINT_STATE.initialNodePos.y = node.y;

  // 高亮该节点
  document.querySelectorAll('.bp-node-card').forEach(c => c.classList.remove('bp-node-active'));
  const card = document.getElementById(`node_${nodeId}`);
  if (card) card.classList.add('bp-node-active');

  inspectBlueprintNode(node);
}

// 全局鼠标移动监听 (驱动画布平移、节点拖拽与拉线实时跟随)
document.addEventListener('mousemove', (e) => {
  // 1. 画布平移
  if (CPU_BLUEPRINT_STATE.isPanning) {
    const dx = e.clientX - CPU_BLUEPRINT_STATE.panStartMouse.x;
    const dy = e.clientY - CPU_BLUEPRINT_STATE.panStartMouse.y;
    CPU_BLUEPRINT_STATE.panX = CPU_BLUEPRINT_STATE.initialPanPos.x + dx;
    CPU_BLUEPRINT_STATE.panY = CPU_BLUEPRINT_STATE.initialPanPos.y + dy;
    updateCanvasTransform();
    return;
  }

  // 2. 拖动节点 (精确除以 zoom 缩放比)
  if (CPU_BLUEPRINT_STATE.draggingNodeId) {
    const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === CPU_BLUEPRINT_STATE.draggingNodeId);
    if (node) {
      const dx = (e.clientX - CPU_BLUEPRINT_STATE.dragStartMouse.x) / CPU_BLUEPRINT_STATE.zoom;
      const dy = (e.clientY - CPU_BLUEPRINT_STATE.dragStartMouse.y) / CPU_BLUEPRINT_STATE.zoom;

      node.x = Math.round(CPU_BLUEPRINT_STATE.initialNodePos.x + dx);
      node.y = Math.round(CPU_BLUEPRINT_STATE.initialNodePos.y + dy);

      const card = document.getElementById(`node_${node.id}`);
      if (card) {
        card.style.left = `${node.x}px`;
        card.style.top = `${node.y}px`;
      }

      renderBlueprintWiresSvg();
    }
  }

  // 3. 正在拉动临时连线 (转换至世界坐标)
  if (CPU_BLUEPRINT_STATE.connectingPin) {
    const vp = document.getElementById('paragonViewport');
    const vpRect = vp ? vp.getBoundingClientRect() : { left: 0, top: 0 };
    const mouseWorldX = (e.clientX - vpRect.left - CPU_BLUEPRINT_STATE.panX) / CPU_BLUEPRINT_STATE.zoom;
    const mouseWorldY = (e.clientY - vpRect.top - CPU_BLUEPRINT_STATE.panY) / CPU_BLUEPRINT_STATE.zoom;

    CPU_BLUEPRINT_STATE.connectingPin.curX = mouseWorldX;
    CPU_BLUEPRINT_STATE.connectingPin.curY = mouseWorldY;
    renderBlueprintWiresSvg();
  }
});

// 全局鼠标释放
document.addEventListener('mouseup', () => {
  if (CPU_BLUEPRINT_STATE.isPanning) {
    CPU_BLUEPRINT_STATE.isPanning = false;
    const vp = document.getElementById('paragonViewport');
    if (vp) vp.classList.remove('bp-viewport-panning');
  }

  if (CPU_BLUEPRINT_STATE.draggingNodeId) {
    CPU_BLUEPRINT_STATE.draggingNodeId = null;
    playUiSound('click');
  }
});

// =========================================================================
// 6. 引脚交互：点击出线与跨区引线吸附
// =========================================================================
function handleBlueprintPinClick(nodeId, pinId, pinType, e) {
  e.stopPropagation();

  const coords = getBlueprintPinCoords(nodeId, pinId);
  const px = coords.x;
  const py = coords.y;
  const pinEl = document.getElementById(`pin_${nodeId}_${pinId}`);

  // 1. 如果尚未处于连线状态，点击输出引脚 [OUT]，开启拉线
  if (!CPU_BLUEPRINT_STATE.connectingPin) {
    if (pinType === 'out') {
      playUiSound('click');
      CPU_BLUEPRINT_STATE.connectingPin = {
        nodeId: nodeId,
        pinId: pinId,
        pinType: 'out',
        x: px, y: py,
        curX: px, curY: py
      };
      if (pinEl) pinEl.classList.add('bp-pin-connecting');
      renderBlueprintWiresSvg();
      showNotification('正在拉出导灵光缆... 请点击目标节点的输入引脚 [IN] 闭合回路！');
    } else {
      showNotification('提示：请先点击左侧节点的输出引脚 [OUT]，再连接到目标输入引脚！');
    }
    return;
  }

  // 2. 如果已经有正在拉动的线
  const source = CPU_BLUEPRINT_STATE.connectingPin;

  // 若点击同一个引脚，取消拉线
  if (source.nodeId === nodeId && source.pinId === pinId) {
    cancelBlueprintConnecting();
    return;
  }

  // 不能连接同一节点的出入口
  if (source.nodeId === nodeId) {
    showNotification('无法自连！必须连接到不同逻辑节点的输入引脚');
    cancelBlueprintConnecting();
    return;
  }

  // 必须连接到输入引脚 [IN]
  if (pinType !== 'in') {
    showNotification('连线必须接入输入引脚 [IN]！');
    cancelBlueprintConnecting();
    return;
  }

  // 检查是否已经存在该连线
  const exists = CPU_BLUEPRINT_STATE.wires.some(w => w.fromNode === source.nodeId && w.fromPin === source.pinId && w.toNode === nodeId && w.toPin === pinId);
  if (exists) {
    showNotification('该连线回路已存在');
    cancelBlueprintConnecting();
    return;
  }

  // 创建新连线
  const fromNode = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === source.nodeId);
  const outPinDef = fromNode ? fromNode.outPins.find(p => p.id === source.pinId) : null;
  const isGoldWire = (outPinDef && outPinDef.isGold) || source.pinId.includes('zone') || pinId.includes('zone') || nodeId.includes('core');

  CPU_BLUEPRINT_STATE.wires.push({
    id: `wire_${Date.now()}`,
    fromNode: source.nodeId,
    fromPin: source.pinId,
    toNode: nodeId,
    toPin: pinId,
    color: outPinDef ? outPinDef.color : '#00f0ff',
    isGold: isGoldWire
  });

  playUiSound('zap');
  cancelBlueprintConnecting();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();
  showNotification('★ 导灵回路已闭合！高能光流正在跨区超导传输！');
}

// 取消拉线
function cancelBlueprintConnecting() {
  document.querySelectorAll('.bp-pin').forEach(p => p.classList.remove('bp-pin-connecting'));
  CPU_BLUEPRINT_STATE.connectingPin = null;
  renderBlueprintWiresSvg();
}

// 拆除单条连线
function removeBlueprintWire(wireIdx) {
  if (wireIdx >= 0 && wireIdx < CPU_BLUEPRINT_STATE.wires.length) {
    playUiSound('click');
    CPU_BLUEPRINT_STATE.wires.splice(wireIdx, 1);
    renderBlueprintWiresSvg();
    updateBlueprintMonitorStats();
    showNotification('已剪断该段导灵光缆回路');
  }
}

// =========================================================================
// 7. 输入端口物料选择与节点快捷生成
// =========================================================================
function selectInputNodeMaterial(nodeId, matName) {
  playUiSound('click');
  const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === nodeId);
  if (!node) return;

  const zone = CPU_BLUEPRINT_STATE.zones[node.zoneId || 'zone1'];
  if (!zone || !zone.inputMaterials[matName]) return;

  const matData = zone.inputMaterials[matName];
  node.material = matName;
  node.signalOut = matData.signal;
  node.valText = `物料: ${matName} (${matData.signal} 强)`;

  renderBlueprintNodesHtml();
  updateBlueprintMonitorStats();
  showNotification(`已向【${node.name}】投入【${matName}】，激发信号基准: ${matData.signal}！`);
}

function spawnBlueprintNode(nodeType) {
  playUiSound('click');
  const activeZoneId = CPU_BLUEPRINT_STATE.activeZoneId || 'zone1';
  const activeZone = CPU_BLUEPRINT_STATE.zones[activeZoneId];

  // 1. 检查区域是否解锁
  if (!activeZone || !activeZone.unlocked) {
    showNotification(`【${activeZone ? activeZone.name : activeZoneId}】尚未解锁，无法部署新节点！`);
    return;
  }

  // 2. 检查节点类型是否在当前阶段解锁
  if (!CPU_BLUEPRINT_STATE.unlockedNodeTypes.includes(nodeType)) {
    const stageName = CPU_BLUEPRINT_STATE.gameStage === 'prologue' ? '练气阶段' : '筑基阶段';
    showNotification(`【${nodeType}】运算模块尚未研发！需完成【${stageName}】认证升级后解锁！`);
    return;
  }

  // 3. 检查当前区域的运算槽位上限
  const currentCap = CPU_BLUEPRINT_STATE.slotCaps[CPU_BLUEPRINT_STATE.gameStage] || 4;
  const currentZoneMidNodes = CPU_BLUEPRINT_STATE.nodes.filter(n => n.zoneId === activeZoneId && n.type !== 'input' && n.type !== 'core');
  if (currentZoneMidNodes.length >= currentCap && nodeType !== 'input') {
    showNotification(`⚠ 区域算力槽位已满！当前阶段上限为 ${currentCap} 槽！请精简路线或突破境界扩张槽位！`);
    return;
  }

  const count = CPU_BLUEPRINT_STATE.nodes.length + 1;
  const newId = `node_${nodeType}_${Date.now()}`;

  // 在当前视野中心生成
  const vp = document.getElementById('paragonViewport');
  const vpRect = vp ? vp.getBoundingClientRect() : { width: 880, height: 500 };
  const spawnX = Math.round((vpRect.width / 2 - CPU_BLUEPRINT_STATE.panX) / CPU_BLUEPRINT_STATE.zoom - 90);
  const spawnY = Math.round((vpRect.height / 2 - CPU_BLUEPRINT_STATE.panY) / CPU_BLUEPRINT_STATE.zoom - 40);

  let newNode = null;
  if (nodeType === 'amplifier') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'amplifier', name: `增幅矩阵 Mk.${count}`, category: 'CPU运算 · 增幅',
      x: spawnX, y: spawnY, width: 185,
      themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
      valText: '信号 ×1.5 | 耗电 +6 MW',
      inPins:  [{ id: 'in',  label: '信号 IN',  color: '#f59e0b' }],
      outPins: [{ id: 'out', label: '信号 OUT', color: '#f59e0b' }]
    };
  } else if (nodeType === 'branch') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'branch', name: `分流晶体 Mk.${count}`, category: 'CPU运算 · 分流',
      x: spawnX, y: spawnY, width: 185,
      themeColor: '#38bdf8', icon: 'fa-solid fa-code-branch',
      valText: '一分二 (各55%)',
      inPins: [{ id: 'in', label: '信号 IN', color: '#38bdf8' }],
      outPins: [
        { id: 'out_a', label: '支路 A (55%)', color: '#38bdf8' },
        { id: 'out_b', label: '支路 B (55%)', color: '#38bdf8' }
      ]
    };
  } else if (nodeType === 'resonator') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'resonator', name: `谐振腔 Mk.${count}`, category: 'CPU运算 · 谐振',
      x: spawnX, y: spawnY, width: 190,
      themeColor: '#c084fc', icon: 'fa-solid fa-wave-square',
      valText: '双路加乘 ×1.6',
      inPins: [
        { id: 'in_1', label: '信号路 1', color: '#ef4444' },
        { id: 'in_2', label: '信号路 2', color: '#38bdf8' }
      ],
      outPins: [{ id: 'out', label: '谐振光束', color: '#c084fc' }]
    };
  } else if (nodeType === 'stabilizer') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'stabilizer', name: `稳压储能 Mk.${count}`, category: 'CPU运算 · 储能',
      x: spawnX, y: spawnY, width: 180,
      themeColor: '#10b981', icon: 'fa-solid fa-battery-full',
      valText: '断供缓冲充能中',
      inPins:  [{ id: 'in',  label: '输入 IN',  color: '#10b981' }],
      outPins: [{ id: 'out', label: '恒压 OUT', color: '#10b981' }]
    };
  } else if (nodeType === 'converter') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'converter', name: `转化器 Mk.${count}`, category: 'CPU运算 · 跨区转化',
      x: spawnX, y: spawnY, width: 185,
      themeColor: '#f97316', icon: 'fa-solid fa-shuffle',
      valText: '跨区频谱调制 (50%)',
      inPins:  [{ id: 'in',  label: '异频 IN',  color: '#f97316' }],
      outPins: [{ id: 'out', label: '本频 OUT', color: '#f97316' }]
    };
  } else if (nodeType === 'input') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'input', name: `输入端口 B`, category: '材料输入',
      x: spawnX, y: spawnY, width: 175,
      themeColor: activeZone.themeColor, icon: 'fa-solid fa-arrow-right-to-bracket',
      valText: '未接入材料', material: null, signalOut: 0,
      inPins: [],
      outPins: [{ id: 'out_a', label: '信号 OUT', color: activeZone.themeColor }]
    };
  }

  if (newNode) {
    CPU_BLUEPRINT_STATE.nodes.push(newNode);
    renderBlueprintNodesHtml();
    renderBlueprintWiresSvg();
    showNotification(`已部署【${newNode.name}】（当前槽位: ${currentZoneMidNodes.length + 1}/${currentCap}）！`);
  }
}

// 一键贯通回路 (根据已解锁区域铺设最佳配置并投料)
function autoConnectBlueprintOptimal() {
  playUiSound('zap');

  // 重置节点为预设基础
  CPU_BLUEPRINT_STATE.nodes = JSON.parse(JSON.stringify(CPU_WORLD_NODES_PRESET));
  CPU_BLUEPRINT_STATE.wires = [];

  // 为每个解锁区域配置初始材料和连线
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(zKey => {
    const zone = CPU_BLUEPRINT_STATE.zones[zKey];
    if (zone.unlocked) {
      // 找到该区的 input 节点并投料最高级物料
      const inNode = CPU_BLUEPRINT_STATE.nodes.find(n => n.zoneId === zKey && n.type === 'input');
      const ampNode = CPU_BLUEPRINT_STATE.nodes.find(n => n.zoneId === zKey && n.type === 'amplifier');
      const coreNode = CPU_BLUEPRINT_STATE.nodes.find(n => n.zoneId === zKey && n.type === 'core');

      if (inNode && zone.inputMaterials) {
        const matKeys = Object.keys(zone.inputMaterials);
        const bestMat = matKeys[matKeys.length - 1]; // 选最高级物料
        inNode.material = bestMat;
        inNode.signalOut = zone.inputMaterials[bestMat].signal;
        inNode.valText = `物料: ${bestMat} (${inNode.signalOut} 强)`;

        if (ampNode && coreNode) {
          CPU_BLUEPRINT_STATE.wires.push({
            id: `wire_${zKey}_1`,
            fromNode: inNode.id,
            fromPin: 'out_a',
            toNode: ampNode.id,
            toPin: 'in',
            color: zone.themeColor
          });
          CPU_BLUEPRINT_STATE.wires.push({
            id: `wire_${zKey}_2`,
            fromNode: ampNode.id,
            fromPin: 'out',
            toNode: coreNode.id,
            toPin: 'in',
            color: '#f59e0b',
            isGold: true
          });
        }
      }
    }
  });

  renderBlueprintZonesHtml();
  renderBlueprintPhaseTabs();
  renderBlueprintNodesHtml();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();

  showNotification('★ 已自动调配并接通所有已解锁区域的最佳工控回路！');
}

// 清空当前回路
function resetCurrentBlueprintCircuit() {
  playUiSound('click');
  CPU_BLUEPRINT_STATE.wires = [];
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();
  showNotification('全部回路连线已清空，可从各区输入端口重新引线调配');
}

// 调节滑块 (保留兼容)
function handleNodeRatioChange(nodeId, val) {
  updateBlueprintMonitorStats();
}

// 检视节点
function inspectBlueprintNode(node) {
  const titleEl = document.getElementById('pNodeTitle');
  const labelEl = document.getElementById('pNodeTypeLabel');
  const buffEl = document.getElementById('pNodeBuffText');
  const iconEl = document.getElementById('pNodeIcon');

  if (titleEl) titleEl.textContent = node.name;
  if (labelEl) labelEl.textContent = `${node.category} · 坐标 [${node.x}, ${node.y}]`;
  if (buffEl) buffEl.textContent = `实时工况: ${node.valText || '就绪'}；已连接 ${CPU_BLUEPRINT_STATE.wires.filter(w=>w.fromNode===node.id||w.toNode===node.id).length} 根导灵光缆。`;
  if (iconEl) iconEl.className = `${node.icon} text-sm text-cyan-300`;
}

// =========================================================================
// 8. 真实信号流拓扑模拟、衰减与全厂增益计算
// =========================================================================
function updateBlueprintMonitorStats() {
  const wires = CPU_BLUEPRINT_STATE.wires;
  const nodes = CPU_BLUEPRINT_STATE.nodes;

  // 1. 重置各节点运行态信号
  nodes.forEach(n => {
    if (n.type === 'core') {
      n.signalIn = 0;
      n.buffText = '未接入信号';
    } else if (n.type === 'resonator') {
      n.isResonating = false;
    }
  });

  // 2. 针对每个区域进行信号模拟
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(zKey => {
    const zone = CPU_BLUEPRINT_STATE.zones[zKey];
    if (!zone.unlocked) {
      zone.satisfied = false;
      zone.buffValue = 0;
      zone.buffValue2 = 0;
      return;
    }

    // 寻找本区所有输入节点
    const inputNodes = nodes.filter(n => n.zoneId === zKey && n.type === 'input');
    let zoneCoreSignal = 0;

    // 从每个 input 出发广度优先/深度优先模拟信号传递
    inputNodes.forEach(inNode => {
      const baseSignal = inNode.signalOut || 0;
      if (baseSignal <= 0) return;

      // 广度遍历队列: { nodeId, currentSignal, pathLen }
      const queue = [{ nodeId: inNode.id, signal: baseSignal, pathLen: 0 }];
      const visited = new Set();

      while (queue.length > 0) {
        const curr = queue.shift();
        const outgoingWires = wires.filter(w => w.fromNode === curr.nodeId);

        outgoingWires.forEach(w => {
          const targetNode = nodes.find(n => n.id === w.toNode);
          if (!targetNode) return;

          // 核心衰减规则：每经过一条中间连线/节点，损耗 12%
          let outSignal = curr.signal * 0.88;

          // 节点特性计算
          if (targetNode.type === 'amplifier') {
            outSignal = outSignal * 1.5;
            targetNode.valText = `信号: ${outSignal.toFixed(1)} (×1.50) | +6 MW`;
          } else if (targetNode.type === 'branch') {
            outSignal = outSignal * 0.55;
            targetNode.valText = `分支流: ${outSignal.toFixed(1)}`;
          } else if (targetNode.type === 'resonator') {
            const incomingWires = wires.filter(iw => iw.toNode === targetNode.id);
            if (incomingWires.length >= 2) {
              outSignal = outSignal * 1.6;
              targetNode.isResonating = true;
              targetNode.valText = `★ 谐振暴增 ×1.6 (${outSignal.toFixed(1)})`;
            } else {
              targetNode.valText = `单路通过: ${outSignal.toFixed(1)}`;
            }
          } else if (targetNode.type === 'stabilizer') {
            targetNode.valText = `恒压通过: ${outSignal.toFixed(1)}`;
          } else if (targetNode.type === 'converter') {
            outSignal = outSignal * 0.5;
            targetNode.valText = `降频转换: ${outSignal.toFixed(1)}`;
          } else if (targetNode.type === 'core') {
            targetNode.signalIn = (targetNode.signalIn || 0) + outSignal;
            zoneCoreSignal += outSignal;
            return; // 到达核心，不继续延伸
          }

          const visitKey = `${curr.nodeId}->${targetNode.id}`;
          if (!visited.has(visitKey)) {
            visited.add(visitKey);
            queue.push({ nodeId: targetNode.id, signal: outSignal, pathLen: curr.pathLen + 1 });
          }
        });
      }
    });

    // 核心判定与增益计算
    const coreNode = nodes.find(n => n.zoneId === zKey && n.type === 'core');
    const isSat = zoneCoreSignal > 5;
    zone.satisfied = isSat;

    if (zKey === 'zone1') {
      // 物流区：传送带吞吐量 +N件/min，升降机速度 +X%
      zone.buffValue = isSat ? Math.max(6, Math.round(zoneCoreSignal * 0.15)) : 0;
      zone.buffValue2 = isSat ? Math.round(zoneCoreSignal * 0.10) : 0;
      if (coreNode) {
        coreNode.valText = isSat ? `运转中: 信号 ${zoneCoreSignal.toFixed(1)}` : '待有效信号注入';
        coreNode.buffText = isSat ? `+${zone.buffValue} 件/min (升降机 +${zone.buffValue2}%)` : '增益未激活';
      }
    } else if (zKey === 'zone2') {
      // 生产区：设备工作速度 +X%，热量效率 +X%
      zone.buffValue = isSat ? Math.round(zoneCoreSignal * 0.12) : 0;
      zone.buffValue2 = isSat ? Math.round(zoneCoreSignal * 0.08) : 0;
      if (coreNode) {
        coreNode.valText = isSat ? `超频运转: 信号 ${zoneCoreSignal.toFixed(1)}` : '待有效信号注入';
        coreNode.buffText = isSat ? `设备速度 +${zone.buffValue}%` : '增益未激活';
      }
    } else if (zKey === 'zone3') {
      // 电力区：全厂耗电降低 -X%，发电机产出 +X%
      zone.buffValue = isSat ? Math.min(45, Math.round(zoneCoreSignal * 0.10)) : 0;
      zone.buffValue2 = isSat ? Math.round(zoneCoreSignal * 0.06) : 0;
      if (coreNode) {
        coreNode.valText = isSat ? `节电监控: 信号 ${zoneCoreSignal.toFixed(1)}` : '待有效信号注入';
        coreNode.buffText = isSat ? `全厂耗电 -${zone.buffValue}%` : '增益未激活';
      }
    } else if (zKey === 'zone4') {
      // 研究区：解析数据产出 +X%，认证消耗减免 -X%
      zone.buffValue = isSat ? Math.round(zoneCoreSignal * 0.18) : 0;
      zone.buffValue2 = isSat ? Math.min(30, Math.round(zoneCoreSignal * 0.08)) : 0;
      if (coreNode) {
        coreNode.valText = isSat ? `解析加速: 信号 ${zoneCoreSignal.toFixed(1)}` : '待有效信号注入';
        coreNode.buffText = isSat ? `解析产出 +${zone.buffValue}% (认证 -${zone.buffValue2}%)` : '增益未激活';
      }
    }
  });

  // 3. 更新右侧区域列表与解锁计数
  let unlockedCount = 0;
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(k => {
    if (CPU_BLUEPRINT_STATE.zones[k].unlocked) unlockedCount++;
  });

  const legTag = document.getElementById('statBuffLegendary');
  if (legTag) {
    const stageDesc = CPU_BLUEPRINT_STATE.gameStage === 'prologue' ? '序章' : (CPU_BLUEPRINT_STATE.gameStage === 'lianqi' ? '练气' : '筑基');
    legTag.textContent = `★ ${unlockedCount}/4 区域解锁 [${stageDesc}]`;
  }

  const progText = document.getElementById('zoneProgressText');
  if (progText) {
    progText.textContent = `${unlockedCount} / 4 区域`;
  }

  const listEl = document.getElementById('zoneProgressList');
  if (listEl) {
    let listHtml = '';
    const zOrder = ['zone1', 'zone2', 'zone3', 'zone4'];
    zOrder.forEach((zk, idx) => {
      const z = CPU_BLUEPRINT_STATE.zones[zk];
      let badge = '';
      if (!z.unlocked) {
        badge = '<span class="text-red-400">待解锁</span>';
      } else if (z.satisfied) {
        badge = `<span class="text-amber-300 font-bold">+${z.buffValue}${zk==='zone1'?'件/m':'%'} ✓</span>`;
      } else {
        badge = '<span class="text-cyan-300">调配中</span>';
      }

      listHtml += `
        <div onclick="jumpToZone('${z.id}');" class="flex items-center justify-between p-1 rounded bg-black/40 hover:bg-white/10 cursor-pointer transition border border-white/5">
          <span class="${z.unlocked ? 'text-white/90' : 'text-white/40'}">${idx+1}. ${z.name}</span>
          ${badge}
        </div>
      `;
    });
    listEl.innerHTML = listHtml;
  }

  // 4. 更新右侧实际增益数值 (贴合游戏真实玩法数值)
  const z1 = CPU_BLUEPRINT_STATE.zones.zone1;
  const z2 = CPU_BLUEPRINT_STATE.zones.zone2;
  const z3 = CPU_BLUEPRINT_STATE.zones.zone3;
  const z4 = CPU_BLUEPRINT_STATE.zones.zone4;

  const sLog = document.getElementById('statBuffLogistics');
  if (sLog) {
    sLog.textContent = z1.satisfied 
      ? `+${z1.buffValue} 件/min (升降机 +${z1.buffValue2}%)` 
      : '+0 件/min (未注入)';
    sLog.className = z1.satisfied ? 'font-bold text-cyan-300' : 'font-bold text-white/40';
  }

  const sSmelt = document.getElementById('statBuffSmelt');
  if (sSmelt) {
    if (!z2.unlocked) {
      sSmelt.textContent = '未激活 (完成练气认证解锁)';
      sSmelt.className = 'font-bold text-white/40';
    } else {
      sSmelt.textContent = z2.satisfied ? `时钟速度 +${z2.buffValue}% (热量 +${z2.buffValue2}%)` : '+0% (待调配)';
      sSmelt.className = z2.satisfied ? 'font-bold text-amber-300' : 'font-bold text-white/40';
    }
  }

  const sGrid = document.getElementById('statBuffGrid');
  if (sGrid) {
    if (!z3.unlocked) {
      sGrid.textContent = '未激活 (完成练气认证解锁)';
      sGrid.className = 'font-bold text-white/40';
    } else {
      sGrid.textContent = z3.satisfied ? `全厂耗电 -${z3.buffValue}% (发电 +${z3.buffValue2}%)` : '-0% (待调配)';
      sGrid.className = z3.satisfied ? 'font-bold text-purple-300' : 'font-bold text-white/40';
    }
  }

  const sRes = document.getElementById('statBuffResonance');
  if (sRes) {
    if (!z4.unlocked) {
      sRes.textContent = '未激活 (完成筑基认证解锁)';
      sRes.className = 'font-bold text-white/40';
    } else {
      sRes.textContent = z4.satisfied ? `解析产出 +${z4.buffValue}% (认证 -${z4.buffValue2}%)` : '+0% (待调配)';
      sRes.className = z4.satisfied ? 'font-bold text-emerald-300' : 'font-bold text-white/40';
    }
  }

  // 终极大招引爆按键
  const pulseBtn = document.getElementById('paragonTriggerPulseBtn');
  if (pulseBtn) {
    if (z4.satisfied && z3.satisfied && z2.satisfied && z1.satisfied) {
      pulseBtn.classList.remove('hidden');
    } else {
      pulseBtn.classList.add('hidden');
    }
  }
}


// 锁存参数
function confirmParagonParamLock() {
  playUiSound('toggle');
  showNotification('★ 蓝图工控回路参数已锁存！全平原工厂超频增益已在后续 15 分钟内常驻生效！');
}

// 引爆 60 秒狂暴大招
function triggerParagonPulseOvercharge() {
  playUiSound('zap');
  CPU_BLUEPRINT_STATE.pulseActive = true;
  CPU_BLUEPRINT_STATE.pulseSecondsLeft = 60;

  const banner = document.getElementById('cpuPulseBanner');
  if (banner) banner.classList.remove('hidden');

  showNotification('⚡【大日极阳·全厂狂暴生产脉冲已引爆！】全平原传送带流速 +100%，冶炼 3 倍爆率！');

  const timerEl = document.getElementById('cpuPulseBannerTimer');
  const interval = setInterval(() => {
    CPU_BLUEPRINT_STATE.pulseSecondsLeft--;
    if (timerEl) timerEl.textContent = `剩余: ${CPU_BLUEPRINT_STATE.pulseSecondsLeft} 秒`;
    if (CPU_BLUEPRINT_STATE.pulseSecondsLeft <= 0) {
      clearInterval(interval);
      CPU_BLUEPRINT_STATE.pulseActive = false;
      if (banner) banner.classList.add('hidden');
      showNotification('生产脉冲暴走结束，中央处理器转入稳定巡航');
    }
  }, 1000);
}

// =========================================================================
// HUD 窗口开关桥接
// =========================================================================
function openCentralProcessorHUD() {
  playUiSound('click');
  const modal = document.getElementById('cpuProcessorModal');
  if (modal) {
    modal.classList.remove('hidden');
    initCentralProcessorBlueprint();
    requestAnimationFrame(() => {
      updateCanvasTransform();
      renderBlueprintWiresSvg();
      setTimeout(() => renderBlueprintWiresSvg(), 50);
      setTimeout(() => renderBlueprintWiresSvg(), 150);
    });
  }
}

function closeCentralProcessorHUD() {
  playUiSound('click');
  cancelBlueprintConnecting();
  const modal = document.getElementById('cpuProcessorModal');
  if (modal) modal.classList.add('hidden');
}

// 页面挂载自动初始化
document.addEventListener('DOMContentLoaded', () => {
  initCentralProcessorBlueprint();
});
