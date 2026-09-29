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

  // 解锁进度：默认开启 'zhuji' 筑基全开状态，方便调试与测试！
  gameStage: 'zhuji',

  // 节点槽位上限（调试模式放开至99，不再限制）
  slotCaps: { prologue: 99, lianqi: 99, zhuji: 99 },

  // 已解锁的节点类型：全部开放
  unlockedNodeTypes: ['input', 'amplifier', 'branch', 'resonator', 'stabilizer', 'converter', 'core'],

  // 四大区域：世界树 (World Tree) 拓扑布局
  // 1. 物流区 (灵脉西翼 - Top Left)
  // 2. 生产区 (世界树主冠 - Upper Center Core)
  // 3. 电力区 (灵脉东翼 - Middle Right)
  // 4. 研究区 (通天灵根 - Bottom Root)
  zones: {
    zone1: {
      id: 'zone1',
      name: '1. 物流区',
      shortName: '物流',
      themeColor: '#38bdf8',
      icon: 'fa-solid fa-conveyor-belt-boxes',
      rect: { x: 180, y: 220, width: 1000, height: 780 },
      unlocked: true,
      satisfied: false,
      buffType: 'logistics',
      buffLabel: '传送带吞吐量',
      buffLabel2: '升降机速度',
      buffValue: 0,
      buffValue2: 0,
      inputMaterials: {
        '玄铁齿轮':   { signal: 60,  rate: 8,  icon: 'fa-solid fa-gear' },
        '灵磁齿轮':   { signal: 100, rate: 6,  icon: 'fa-solid fa-gear' },
        '设备传动件': { signal: 250, rate: 3,  icon: 'fa-solid fa-cog' }
      },
      activeInput: null,
      activeInput2: null,
      coreRequirement: '将运算信号传入中央物流核心芯片'
    },
    zone2: {
      id: 'zone2',
      name: '2. 生产区',
      shortName: '生产',
      themeColor: '#f59e0b',
      icon: 'fa-solid fa-industry',
      rect: { x: 1300, y: 360, width: 1000, height: 780 },
      unlocked: true,
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
      coreRequirement: '将运算信号传入中央生产核心芯片'
    },
    zone3: {
      id: 'zone3',
      name: '3. 电力区',
      shortName: '电力',
      themeColor: '#a855f7',
      icon: 'fa-solid fa-bolt',
      rect: { x: 2420, y: 820, width: 1000, height: 780 },
      unlocked: true,
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
      coreRequirement: '将运算信号传入中央电力核心芯片'
    },
    zone4: {
      id: 'zone4',
      name: '4. 研究区',
      shortName: '研究',
      themeColor: '#10b981',
      icon: 'fa-solid fa-flask',
      rect: { x: 1300, y: 2360, width: 1000, height: 780 },
      unlocked: true,
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
      coreRequirement: '将运算信号传入中央研究核心芯片'
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
// 节点预置：集成电路 PCB 紧凑封装（世界树 4 大母板点位）
// =========================================================================
const CPU_WORLD_NODES_PRESET = [
  // 1. 物流区 (zone1, x: 180..1180, y: 220..1000)
  {
    id: 'z1_input_a', zoneId: 'zone1',
    type: 'input', name: '输入插座 A', category: '物料插槽',
    x: 250, y: 550, width: 140, themeColor: '#38bdf8', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '物料: 玄铁齿轮', material: '玄铁齿轮', signalOut: 60,
    inPins: [],
    outPins: [{ id: 'out_a', label: 'OUT', color: '#38bdf8' }]
  },
  {
    id: 'z1_amp_1', zoneId: 'zone1',
    type: 'amplifier', name: '增幅芯片 Mk.1', category: 'IC 运算',
    x: 530, y: 560, width: 130, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '×1.50 | +6MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: 'IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: 'OUT', color: '#f59e0b' }]
  },
  {
    id: 'z1_core', zoneId: 'zone1',
    type: 'core', name: '物流主控 CPU', category: '核心处理器',
    x: 900, y: 520, width: 160, themeColor: '#38bdf8', icon: 'fa-solid fa-microchip',
    valText: '待信号注入', signalIn: 0,
    inPins:  [{ id: 'in', label: 'BUS IN', color: '#38bdf8', isGold: true }],
    outPins: []
  },

  // 2. 生产区 (zone2, x: 1300..2300, y: 360..1140)
  {
    id: 'z2_input_a', zoneId: 'zone2',
    type: 'input', name: '输入插座 A', category: '物料插槽',
    x: 1370, y: 690, width: 140, themeColor: '#f59e0b', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入物料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: 'OUT', color: '#f59e0b' }]
  },
  {
    id: 'z2_amp_1', zoneId: 'zone2',
    type: 'amplifier', name: '增幅芯片 Mk.1', category: 'IC 运算',
    x: 1640, y: 700, width: 130, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '×1.50 | +6MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: 'IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: 'OUT', color: '#f59e0b' }]
  },
  {
    id: 'z2_core', zoneId: 'zone2',
    type: 'core', name: '生产主控 CPU', category: '核心处理器',
    x: 2020, y: 660, width: 160, themeColor: '#f59e0b', icon: 'fa-solid fa-industry',
    valText: '待信号注入', signalIn: 0,
    inPins:  [{ id: 'in', label: 'BUS IN', color: '#f59e0b', isGold: true }],
    outPins: []
  },

  // 3. 电力区 (zone3, x: 2420..3420, y: 820..1600)
  {
    id: 'z3_input_a', zoneId: 'zone3',
    type: 'input', name: '输入插座 A', category: '物料插槽',
    x: 2490, y: 1150, width: 140, themeColor: '#a855f7', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入物料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: 'OUT', color: '#a855f7' }]
  },
  {
    id: 'z3_amp_1', zoneId: 'zone3',
    type: 'amplifier', name: '增幅芯片 Mk.1', category: 'IC 运算',
    x: 2760, y: 1160, width: 130, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '×1.50 | +6MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: 'IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: 'OUT', color: '#f59e0b' }]
  },
  {
    id: 'z3_core', zoneId: 'zone3',
    type: 'core', name: '电力主控 CPU', category: '核心处理器',
    x: 3140, y: 1120, width: 160, themeColor: '#a855f7', icon: 'fa-solid fa-bolt',
    valText: '待信号注入', signalIn: 0,
    inPins:  [{ id: 'in', label: 'BUS IN', color: '#a855f7', isGold: true }],
    outPins: []
  },

  // 4. 研究区 (zone4, x: 1300..2300, y: 2360..3140)
  {
    id: 'z4_input_a', zoneId: 'zone4',
    type: 'input', name: '输入插座 A', category: '物料插槽',
    x: 1370, y: 2690, width: 140, themeColor: '#10b981', icon: 'fa-solid fa-arrow-right-to-bracket',
    valText: '未接入物料', material: null, signalOut: 0,
    inPins: [],
    outPins: [{ id: 'out_a', label: 'OUT', color: '#10b981' }]
  },
  {
    id: 'z4_amp_1', zoneId: 'zone4',
    type: 'amplifier', name: '增幅芯片 Mk.1', category: 'IC 运算',
    x: 1640, y: 2700, width: 130, themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
    valText: '×1.50 | +6MW', ampLevel: 1,
    inPins:  [{ id: 'in',  label: 'IN',  color: '#f59e0b' }],
    outPins: [{ id: 'out', label: 'OUT', color: '#f59e0b' }]
  },
  {
    id: 'z4_core', zoneId: 'zone4',
    type: 'core', name: '研究主控 CPU', category: '核心处理器',
    x: 2020, y: 2660, width: 160, themeColor: '#10b981', icon: 'fa-solid fa-flask',
    valText: '待信号注入', signalIn: 0,
    inPins:  [{ id: 'in', label: 'BUS IN', color: '#10b981', isGold: true }],
    outPins: []
  }
];

// 初始连线预置：物流区输入端口→增幅矩阵→核心，开箱即见发光回路
const CPU_INITIAL_WIRES_PRESET = [
  { id: 'w_z1_in_amp', fromNode: 'z1_input_a', fromPin: 'out_a', toNode: 'z1_amp_1', toPin: 'in', color: '#38bdf8' },
  { id: 'w_z1_amp_core', fromNode: 'z1_amp_1', fromPin: 'out', toNode: 'z1_core', toPin: 'in', color: '#f59e0b', isGold: true }
];

// 根据世界坐标自动判断落在哪一个母板区域内
function getZoneByCoords(x, y) {
  const zones = CPU_BLUEPRINT_STATE.zones;
  for (const zKey of Object.keys(zones)) {
    const z = zones[zKey];
    if (z.rect && 
        x >= z.rect.x && x <= z.rect.x + z.rect.width &&
        y >= z.rect.y && y <= z.rect.y + z.rect.height) {
      return z;
    }
  }
  return null;
}

// 纠正与保证所有节点坐标 100% 处于合法母板区域内，严禁越界或飞到外面
function sanitizeAllBlueprintNodePositions() {
  CPU_BLUEPRINT_STATE.nodes.forEach(node => {
    if (!node.zoneId) {
      const detectedZone = getZoneByCoords(node.x + 40, node.y + 30);
      node.zoneId = detectedZone ? detectedZone.id : 'zone1';
    }

    const zone = CPU_BLUEPRINT_STATE.zones[node.zoneId] || CPU_BLUEPRINT_STATE.zones.zone1;
    const isCore = node.type === 'core';
    const isInput = node.type === 'input';
    const nodeW = isCore ? 130 : (isInput ? 140 : (node.width || 110));
    const nodeH = isCore ? 130 : (isInput ? 75 : 60);

    if (zone && zone.rect) {
      const minX = zone.rect.x + 20;
      const maxX = zone.rect.x + zone.rect.width - nodeW - 20;
      const minY = zone.rect.y + 55;
      const maxY = zone.rect.y + zone.rect.height - nodeH - 35;
      node.x = Math.max(minX, Math.min(maxX, node.x));
      node.y = Math.max(minY, Math.min(maxY, node.y));
    }
  });
}

// =========================================================================
// 初始化
// =========================================================================
function initCentralProcessorBlueprint() {
  CPU_BLUEPRINT_STATE.nodes = JSON.parse(JSON.stringify(CPU_WORLD_NODES_PRESET));
  CPU_BLUEPRINT_STATE.wires = JSON.parse(JSON.stringify(CPU_INITIAL_WIRES_PRESET));
  CPU_BLUEPRINT_STATE.connectingPin = null;
  CPU_BLUEPRINT_STATE.draggingNodeId = null;
  sanitizeAllBlueprintNodePositions();

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
  renderWorldTreeBackgroundSvg();
  renderBlueprintZonesHtml();
  renderBlueprintNodesHtml();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();
  updatePaletteTargetZoneBadge();

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

// 鼠标滚轮平滑缩放 (以鼠标指针为中心，绝不向外冒泡干扰大视界)
function handleCanvasWheel(e) {
  e.preventDefault();
  e.stopPropagation();
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

// 画布桌布空白处按住鼠标拖拽平移 (彻底隔离外部大视界)
function handleCanvasMouseDown(e) {
  // 如果点击的是节点、引脚、按钮或输入框，绝不触发画布桌布平移
  if (e.target.closest('.bp-node-card') || e.target.closest('.bp-pin') || e.target.closest('button') || e.target.closest('input')) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  // 点击桌布空白时，自动识别鼠标所在区域并高亮该区域作为投放目标
  const vp = document.getElementById('paragonViewport');
  if (vp) {
    const vpRect = vp.getBoundingClientRect();
    const clickWorldX = (e.clientX - vpRect.left - CPU_BLUEPRINT_STATE.panX) / CPU_BLUEPRINT_STATE.zoom;
    const clickWorldY = (e.clientY - vpRect.top - CPU_BLUEPRINT_STATE.panY) / CPU_BLUEPRINT_STATE.zoom;
    const hitZone = getZoneByCoords(clickWorldX, clickWorldY);
    if (hitZone && hitZone.id !== CPU_BLUEPRINT_STATE.activeZoneId) {
      selectBlueprintZone(hitZone.id, false);
    }
  }

  CPU_BLUEPRINT_STATE.isPanning = true;
  CPU_BLUEPRINT_STATE.draggingNodeId = null; // 确保不产生拖拽冲突
  CPU_BLUEPRINT_STATE.panStartMouse.x = e.clientX;
  CPU_BLUEPRINT_STATE.panStartMouse.y = e.clientY;
  CPU_BLUEPRINT_STATE.initialPanPos.x = CPU_BLUEPRINT_STATE.panX;
  CPU_BLUEPRINT_STATE.initialPanPos.y = CPU_BLUEPRINT_STATE.panY;

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

// 全景俯瞰四区 (自动居中完整容纳 3600x3500 世界树全貌)
function fitAllZonesCanvasView() {
  playUiSound('toggle');
  const vp = document.getElementById('paragonViewport');
  const vpRect = vp ? vp.getBoundingClientRect() : { width: 1280, height: 750 };

  // 计算全景适配缩放比 (对应 3600x3500 全板图)
  const scaleX = vpRect.width / 3700;
  const scaleY = vpRect.height / 3550;
  const fitZoom = Math.max(0.18, Math.min(0.38, Math.min(scaleX, scaleY) * 0.95));

  CPU_BLUEPRINT_STATE.zoom = fitZoom;
  CPU_BLUEPRINT_STATE.panX = Math.round((vpRect.width - 3600 * fitZoom) / 2);
  CPU_BLUEPRINT_STATE.panY = Math.round((vpRect.height - 3400 * fitZoom) / 2);

  updateCanvasTransform();
  renderBlueprintWiresSvg();
  showNotification('已切换至【世界树全景俯瞰】：中央通天主干与四大灵脉母板尽收眼底！');
}

// 激活并选中指定区域 (更新边框高亮、顶栏Tabs、导航按钮及底部节点投放目标提示)
function selectBlueprintZone(zoneId, shouldCenter = false) {
  const zone = CPU_BLUEPRINT_STATE.zones[zoneId];
  if (!zone) return;

  CPU_BLUEPRINT_STATE.activeZoneId = zoneId;

  // 1. 更新四大区域卡片的视觉高亮 (选中区域有金黄色光晕)
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(zKey => {
    const card = document.getElementById(`zoneCard_${zKey}`);
    const badge = document.getElementById(`zoneActiveBadge_${zKey}`);
    if (card) {
      if (zKey === zoneId) {
        card.classList.add('zone-active-selected');
        card.style.zIndex = '15';
      } else {
        card.classList.remove('zone-active-selected');
        card.style.zIndex = '5';
      }
    }
    if (badge) {
      if (zKey === zoneId) {
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  });

  // 2. 更新底部节点库的目标投放区徽章
  updatePaletteTargetZoneBadge();

  // 3. 更新顶栏阶段 Tabs 与快速导航按钮
  renderBlueprintPhaseTabs();
  ['zone1', 'zone2', 'zone3', 'zone4'].forEach(z => {
    const btn = document.getElementById(`jumpBtn_${z}`);
    if (btn) {
      if (z === zoneId) {
        btn.className = 'px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400 font-bold transition cursor-pointer shadow-[0_0_8px_rgba(245,146,30,0.5)]';
      } else {
        btn.className = 'px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10 hover:text-white font-bold transition cursor-pointer';
      }
    }
  });

  // 4. 如需平移居中 (例如从导航按钮或跨区跳转时)
  if (shouldCenter) {
    const vp = document.getElementById('paragonViewport');
    const vpRect = vp ? vp.getBoundingClientRect() : { width: 1280, height: 750 };
    const targetZoom = Math.min(0.85, Math.min(vpRect.width / 1150, vpRect.height / 900) * 0.95);
    const zoneCenterX = zone.rect.x + zone.rect.width / 2;
    const zoneCenterY = zone.rect.y + zone.rect.height / 2;

    CPU_BLUEPRINT_STATE.zoom = targetZoom;
    CPU_BLUEPRINT_STATE.panX = Math.round(vpRect.width / 2 - zoneCenterX * targetZoom);
    CPU_BLUEPRINT_STATE.panY = Math.round(vpRect.height / 2 - zoneCenterY * targetZoom);

    updateCanvasTransform();
    renderBlueprintWiresSvg();
  }
}

// 快速平移跳至指定区域 (单区大视界自适应居中)
function jumpToZone(zoneId) {
  playUiSound('click');
  selectBlueprintZone(zoneId, true);
  const zone = CPU_BLUEPRINT_STATE.zones[zoneId];
  if (zone) {
    showNotification(`已平移聚焦至：【${zone.name}】！`);
  }
}

// 更新底部节点库的目标投放区徽章
function updatePaletteTargetZoneBadge() {
  const badge = document.getElementById('cpuPaletteTargetZoneBadge');
  const nameEl = document.getElementById('cpuPaletteTargetZoneName');
  const activeZone = CPU_BLUEPRINT_STATE.zones[CPU_BLUEPRINT_STATE.activeZoneId || 'zone1'];
  if (nameEl && activeZone) {
    nameEl.textContent = activeZone.name;
  }
  if (badge && activeZone) {
    badge.style.borderColor = activeZone.themeColor;
    badge.style.color = activeZone.themeColor;
    badge.title = `当前新建节点将直接部署至【${activeZone.name}】母板内部`;
  }
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

// 调试工具：一键解锁四大区域、所有运算节点类型、解除槽位限制
function debugUnlockAllCpuSystem() {
  playUiSound('zap');
  CPU_BLUEPRINT_STATE.gameStage = 'zhuji';

  // 1. 解锁所有四大区域
  Object.keys(CPU_BLUEPRINT_STATE.zones).forEach(zKey => {
    CPU_BLUEPRINT_STATE.zones[zKey].unlocked = true;
  });

  // 2. 解锁所有 6 类运算节点
  CPU_BLUEPRINT_STATE.unlockedNodeTypes = ['input', 'amplifier', 'branch', 'resonator', 'stabilizer', 'converter', 'core'];

  // 3. 解除槽位上限 (设为99)
  CPU_BLUEPRINT_STATE.slotCaps = { prologue: 99, lianqi: 99, zhuji: 99 };

  renderBlueprintZonesHtml();
  renderBlueprintPhaseTabs();
  renderBlueprintNodesHtml();
  renderBlueprintWiresSvg();
  updateBlueprintMonitorStats();

  showNotification('⚡【测试特权已激活】：四大区域已全开！全部节点类型已解锁！槽位上限已解除！');
}


// =========================================================================
// 1.5 渲染世界树电路背景灵脉网络 (高保真还原参考图 media_1790653316876.png)
// 包含：中央通天主干、扼流块滤波磁珠、45°/90°折线分支、过孔焊盘、接地排线、菱形测试焊盘与动态流光
// =========================================================================
function renderWorldTreeBackgroundSvg() {
  const svg = document.getElementById('cpuWorldTreeSvg');
  if (!svg) return;

  let html = `
    <defs>
      <!-- 高能流光渐变 -->
      <linearGradient id="treeTrunkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9" />
        <stop offset="35%" stop-color="#00f0ff" stop-opacity="0.9" />
        <stop offset="80%" stop-color="#10b981" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.4" />
      </linearGradient>

      <!-- 扼流块/磁珠渐变 -->
      <linearGradient id="chokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00f0ff" />
        <stop offset="50%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#00f0ff" />
      </linearGradient>

      <!-- 滤镜光晕 -->
      <filter id="trunkGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  `;

  // 1. 【中央通天主干】(Zone 2 生产主冠 ➔ Zone 4 通天灵根, X=1800, Y=1140..2360)
  html += `
    <!-- 背景粗铜发光光晕 -->
    <path d="M 1800 1140 L 1800 2360" stroke="#00f0ff" stroke-width="16" opacity="0.12" filter="url(#trunkGlow)" />
    <!-- 实体粗铜母线 -->
    <path d="M 1800 1140 L 1800 2360" stroke="url(#treeTrunkGrad)" stroke-width="6" opacity="0.85" />
    <!-- 核心超导白亮脉冲线 -->
    <path d="M 1800 1140 L 1800 2360" stroke="#ffffff" stroke-width="2" opacity="0.9" />
    <!-- 动态脉冲流动虚线 -->
    <path d="M 1800 1140 L 1800 2360" stroke="#00f0ff" stroke-width="2.5" class="world-tree-pulse-line" />
  `;

  // 1.1 主干核心扼流阻抗块 (参考图中央长条形外凸稳流磁珠, Y=1720..1840)
  html += `
    <!-- 扼流圈主体 -->
    <polygon points="1786,1720 1814,1720 1818,1840 1782,1840" fill="#08101a" stroke="#00f0ff" stroke-width="3" />
    <polygon points="1790,1725 1810,1725 1813,1835 1787,1835" fill="url(#chokeGrad)" opacity="0.8" />
    <!-- 两侧高能导热鳍片 (参考图两侧黑色细斜角小翼) -->
    <polygon points="1776,1740 1768,1755 1768,1815 1776,1830" fill="#00f0ff" opacity="0.85" />
    <polygon points="1824,1740 1832,1755 1832,1815 1824,1830" fill="#00f0ff" opacity="0.85" />
    <!-- 扼流圈下方的菱形探针焊盘 (参考图黑色菱形) -->
    <polygon points="1800,1875 1808,1885 1800,1895 1792,1885" fill="#070b13" stroke="#00f0ff" stroke-width="2" />
    <polygon points="1800,1878 1805,1885 1800,1892 1795,1885" fill="#00f0ff" />
  `;

  // 1.2 主干过孔端子 (参考图主干下方的两个同心圆过孔, Y=2180, Y=2280)
  html += `
    <!-- 节点过孔 A -->
    <circle cx="1800" cy="2180" r="14" fill="#070b13" stroke="#00f0ff" stroke-width="3.5" />
    <circle cx="1800" cy="2180" r="6" fill="#00f0ff" />
    <circle cx="1800" cy="2180" r="2.5" fill="#ffffff" />
    <!-- 节点过孔 B (通往 4 区入口) -->
    <circle cx="1800" cy="2290" r="9" fill="#070b13" stroke="#10b981" stroke-width="2.5" />
    <circle cx="1800" cy="2290" r="3.5" fill="#10b981" />
  `;

  // 1.3 主干左侧并行灵脉回路 (参考图左侧向下走折线、阶梯下探、三道接地横线)
  html += `
    <!-- 左侧伴随干线：从 2 区左下引出，向左折 45° 再直下 -->
    <path d="M 1620 1140 L 1620 1480 L 1520 1580 L 1520 2020 L 1600 2100 L 1600 2360" 
          fill="none" stroke="#00f0ff" stroke-width="4.5" opacity="0.8" />
    <path d="M 1620 1140 L 1620 1480 L 1520 1580 L 1520 2020 L 1600 2100 L 1600 2360" 
          fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="8 6" opacity="0.9" class="world-tree-branch-flow" />

    <!-- 左侧次级分支：更外层折线与垂直下降导线 -->
    <path d="M 1480 1140 L 1480 1350 L 1400 1430 L 1400 1980" 
          fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.75" />
    <!-- 伴随端子圆孔 (参考图左侧两个空心圆孔) -->
    <circle cx="1400" cy="1980" r="7" fill="#070b13" stroke="#38bdf8" stroke-width="2.5" />
    <circle cx="1400" cy="1980" r="2.5" fill="#38bdf8" />
    <circle cx="1400" cy="2020" r="7" fill="#070b13" stroke="#38bdf8" stroke-width="2.5" />
    <circle cx="1400" cy="2020" r="2.5" fill="#38bdf8" />

    <!-- 参考图左侧经典【三道水平接地排线】(GND Symbol) -->
    <path d="M 1520 1800 L 1420 1800 L 1420 1920" fill="none" stroke="#00f0ff" stroke-width="2" />
    <line x1="1380" y1="1920" x2="1460" y2="1920" stroke="#00f0ff" stroke-width="3.5" />
    <line x1="1395" y1="1930" x2="1445" y2="1930" stroke="#00f0ff" stroke-width="2.5" />
    <line x1="1410" y1="1940" x2="1430" y2="1940" stroke="#00f0ff" stroke-width="1.5" />
  `;

  // 1.4 主干右侧并行灵脉回路 (参考图右侧向下折线并向右引出)
  html += `
    <!-- 右侧伴随干线：从 2 区右下引出，向右折 45° -->
    <path d="M 1980 1140 L 1980 1520 L 2080 1620 L 2080 1820 L 2180 1820" 
          fill="none" stroke="#f59e0b" stroke-width="4.5" opacity="0.8" />
    <circle cx="2180" cy="1820" r="9" fill="#070b13" stroke="#f59e0b" stroke-width="3" />
    <circle cx="2180" cy="1820" r="3.5" fill="#f59e0b" />

    <!-- 虚线伴随走线 (参考图右侧虚线通道) -->
    <path d="M 1880 1180 L 1880 1900" 
          fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="10 8" opacity="0.6" />
    
    <!-- 右侧折角探针与斜向导通线 -->
    <path d="M 2080 1480 L 2160 1400 L 2220 1400" fill="none" stroke="#f59e0b" stroke-width="2" />
    <circle cx="2220" cy="1400" r="5" fill="#070b13" stroke="#f59e0b" stroke-width="2" />
  `;

  // 2. 【西北翼灵脉分支】(Zone 2 主冠 ➔ Zone 1 物流区，45° 倒角走向)
  html += `
    <!-- 主贯通铜带：从 Zone 2 左侧 45° 斜上通往 Zone 1 -->
    <path d="M 1300 520 L 1220 440 L 1180 440" 
          fill="none" stroke="#38bdf8" stroke-width="6" opacity="0.85" />
    <path d="M 1300 520 L 1220 440 L 1180 440" 
          fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.9" />
    <path d="M 1300 520 L 1220 440 L 1180 440" 
          fill="none" stroke="#00f0ff" stroke-width="2.5" class="world-tree-pulse-line" />

    <!-- 次级 45° 阶梯回路 (参考图左上角复杂折线群) -->
    <path d="M 1300 660 L 1250 660 L 1190 600 L 1180 600" 
          fill="none" stroke="#38bdf8" stroke-width="3.5" opacity="0.75" />
    <path d="M 1300 780 L 1240 780 L 1200 740 L 1180 740" 
          fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.6" />
    
    <!-- 菱形焊盘与引线节点 (参考图左上方 probe 点) -->
    <polygon points="1220,432 1228,440 1220,448 1212,440" fill="#070b13" stroke="#38bdf8" stroke-width="2" />
    <polygon points="1220,435 1225,440 1220,445 1215,440" fill="#38bdf8" />

    <!-- 顶部延伸天线折线 (参考图左上角探向天空的高压线路) -->
    <path d="M 1180 340 L 1180 180 L 1120 120 L 1050 120" 
          fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.7" />
    <circle cx="1050" cy="120" r="5" fill="#070b13" stroke="#38bdf8" stroke-width="2" />
  `;

  // 3. 【东北翼灵脉分支】(Zone 2 主冠 ➔ Zone 3 电力区，45°/90° 倒角走向)
  html += `
    <!-- 主贯通铜带：从 Zone 2 右侧斜下连通 Zone 3 -->
    <path d="M 2300 780 L 2360 840 L 2420 840" 
          fill="none" stroke="#a855f7" stroke-width="5" opacity="0.85" />
    <path d="M 2300 780 L 2360 840 L 2420 840" 
          fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.9" />

    <!-- 次级下沉母线 (参考图右侧阶梯式下落回路) -->
    <path d="M 2300 880 L 2350 930 L 2350 1020 L 2420 1090" 
          fill="none" stroke="#a855f7" stroke-width="4" opacity="0.8" />
    <path d="M 2300 880 L 2350 930 L 2350 1020 L 2420 1090" 
          fill="none" stroke="#c084fc" stroke-width="2" class="world-tree-pulse-line" />

    <!-- 辅助虚线与测试过孔 -->
    <path d="M 2300 980 L 2360 1040 L 2420 1040" 
          fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 6" opacity="0.6" />
    <circle cx="2350" cy="930" r="6" fill="#070b13" stroke="#a855f7" stroke-width="2" />
    <circle cx="2350" cy="1020" r="6" fill="#070b13" stroke="#a855f7" stroke-width="2" />
    
    <!-- 右上方天空探针引线 (参考图右上角折线与双圆环) -->
    <path d="M 2300 500 L 2380 420 L 2480 420" fill="none" stroke="#a855f7" stroke-width="2" opacity="0.6" />
    <circle cx="2480" cy="420" r="5" fill="#070b13" stroke="#a855f7" stroke-width="2" />
    <path d="M 2420 380 L 2500 380 L 2540 420" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6" />
  `;

  // 4. 【顶部苍穹灵脉探针】(Zone 2 主冠上方直插苍穹的引导线)
  html += `
    <path d="M 1800 360 L 1800 140" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.8" />
    <circle cx="1800" cy="140" r="7" fill="#070b13" stroke="#f59e0b" stroke-width="2.5" />
    <circle cx="1800" cy="140" r="2.5" fill="#f59e0b" />

    <path d="M 1720 360 L 1720 220 L 1650 150 L 1650 90" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.7" />
    <circle cx="1650" cy="90" r="4.5" fill="#38bdf8" />

    <path d="M 1880 360 L 1880 220 L 1950 150 L 1950 90" fill="none" stroke="#f59e0b" stroke-width="2" opacity="0.7" />
    <polygon points="1950,84 1956,90 1950,96 1944,90" fill="#f59e0b" />
  `;

  // 5. 【通天灵根底座延伸】(Zone 4 底部的深层地脉接地导电根须)
  html += `
    <path d="M 1800 3140 L 1800 3380" fill="none" stroke="#10b981" stroke-width="5" opacity="0.85" />
    <path d="M 1800 3140 L 1800 3380" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="10 6" class="world-tree-pulse-line" />
    <!-- 根须左分支 -->
    <path d="M 1740 3140 L 1740 3260 L 1670 3330" fill="none" stroke="#10b981" stroke-width="3" opacity="0.75" />
    <polygon points="1670,3323 1677,3330 1670,3337 1663,3330" fill="#070b13" stroke="#10b981" stroke-width="2" />
    <!-- 根须右分支 -->
    <path d="M 1860 3140 L 1860 3260 L 1930 3330" fill="none" stroke="#10b981" stroke-width="3" opacity="0.75" />
    <circle cx="1930" cy="3330" r="7" fill="#070b13" stroke="#10b981" stroke-width="2" />
    <!-- 灵根末梢菱形终端 -->
    <polygon points="1800,3372 1810,3382 1800,3392 1790,3382" fill="#070b13" stroke="#10b981" stroke-width="3" />
    <polygon points="1800,3375 1807,3382 1800,3389 1793,3382" fill="#10b981" />
  `;

  svg.innerHTML = html;
}

// =========================================================================
// 2. 渲染四大区域底板、锁定遮罩与跨区引线指引 (世界树母板封装)
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

    const isCur = z.id === CPU_BLUEPRINT_STATE.activeZoneId;
    html += `
      <div id="zoneCard_${z.id}" 
           onclick="selectBlueprintZone('${z.id}');"
           style="left: ${z.rect.x}px; top: ${z.rect.y}px; width: ${z.rect.width}px; height: ${z.rect.height}px; z-index: ${isCur ? 15 : 5};" 
           class="bp-zone-card ${isUnlocked ? 'zone-unlocked' : ''} ${isSatisfied ? 'zone-satisfied' : ''} ${isCur ? 'zone-active-selected' : ''} cursor-pointer pointer-events-auto">
        
        <!-- 四角固定焊盘螺栓 (参考图芯片四角螺孔与过孔圆环) -->
        <div class="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full border border-white/60 bg-[#070b13] flex items-center justify-center pointer-events-none shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <span class="w-1 h-1 rounded-full bg-cyan-400"></span>
        </div>
        <div class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border border-white/60 bg-[#070b13] flex items-center justify-center pointer-events-none shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <span class="w-1 h-1 rounded-full bg-cyan-400"></span>
        </div>
        <div class="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full border border-white/60 bg-[#070b13] flex items-center justify-center pointer-events-none shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <span class="w-1 h-1 rounded-full bg-cyan-400"></span>
        </div>
        <div class="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border border-white/60 bg-[#070b13] flex items-center justify-center pointer-events-none shadow-[0_0_6px_rgba(0,240,255,0.4)]">
          <span class="w-1 h-1 rounded-full bg-cyan-400"></span>
        </div>

        <!-- 上方金属排针排梳 (参考图外露引脚) -->
        <div class="absolute -top-2 left-24 right-24 h-2 flex justify-between px-2 pointer-events-none opacity-60">
          <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#38bdf8]"></span>
          <span class="w-1 h-full bg-slate-400"></span>
          <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#38bdf8]"></span>
          <span class="w-1 h-full bg-slate-400"></span>
          <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#38bdf8]"></span>
        </div>
        <!-- 下方金属排针排梳 -->
        <div class="absolute -bottom-2 left-24 right-24 h-2 flex justify-between px-2 pointer-events-none opacity-60">
          <span class="w-1 h-full bg-slate-400"></span>
          <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#38bdf8]"></span>
          <span class="w-1 h-full bg-slate-400"></span>
          <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#38bdf8]"></span>
          <span class="w-1 h-full bg-slate-400"></span>
        </div>

        <!-- 区域顶栏信息 (点击可直接选中此区域作为节点投放目标) -->
        <div class="p-3 border-b border-white/10 flex items-center justify-between pointer-events-auto"
             onclick="selectBlueprintZone('${z.id}');">
          <div class="flex items-center space-x-2">
            <i class="${z.icon} text-sm" style="color: ${z.themeColor};"></i>
            <span class="text-xs font-black text-white font-mono tracking-wider">${z.name}</span>
            <span id="zoneActiveBadge_${z.id}" class="text-[9px] font-mono bg-amber-500 text-black font-bold px-1.5 py-0.5 rounded shadow ${isCur ? '' : 'hidden'}">
              ★ 当前投放区
            </span>
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
    // 1:1 参考图集成电路 PCB 芯片封装渲染
    if (node.type === 'core') {
      // 中央主控 CPU 芯片 (参考图核心方块芯片，四周带有密集的金属引脚梳齿)
      const coreSize = 130;
      html += `
        <div id="node_${node.id}" 
             style="left: ${node.x}px; top: ${node.y}px; width: ${coreSize}px; height: ${coreSize}px;" 
             onmousedown="startDragBlueprintNode('${node.id}', event);"
             class="bp-node-card pcb-ic-package pcb-core-diamond border-2 border-amber-400/80 group cursor-move">
          
          <!-- 上方金属引脚排梳 -->
          <div class="absolute -top-2.5 left-4 right-4 h-2.5 flex justify-between px-1 pointer-events-none">
            <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#ffd700]"></span>
            <span class="w-1 h-full bg-slate-400"></span>
            <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#ffd700]"></span>
            <span class="w-1 h-full bg-slate-400"></span>
            <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#ffd700]"></span>
          </div>

          <!-- 下方金属引脚排梳 -->
          <div class="absolute -bottom-2.5 left-4 right-4 h-2.5 flex justify-between px-1 pointer-events-none">
            <span class="w-1 h-full bg-slate-400"></span>
            <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#ffd700]"></span>
            <span class="w-1 h-full bg-slate-400"></span>
            <span class="w-1 h-full bg-slate-400 shadow-[0_0_4px_#ffd700]"></span>
            <span class="w-1 h-full bg-slate-400"></span>
          </div>

          <!-- 四角固定焊盘螺钉 -->
          <div class="absolute top-1 left-1 w-2 h-2 rounded-full border border-white/40 bg-black"></div>
          <div class="absolute top-1 right-1 w-2 h-2 rounded-full border border-white/40 bg-black"></div>
          <div class="absolute bottom-1 left-1 w-2 h-2 rounded-full border border-white/40 bg-black"></div>
          <div class="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white/40 bg-black"></div>

          <!-- 拖动顶栏提示 -->
          <div class="w-full h-5 flex items-center justify-between px-2 pt-1 border-b border-white/10 pointer-events-none">
            <span class="text-[8px] font-mono text-amber-300 font-bold tracking-wider">CPU_CORE</span>
            <i class="fa-solid fa-microchip text-[9px] text-amber-400"></i>
          </div>

          <!-- 芯片正中央发光内核 (高能符文微处理器) -->
          <div class="flex-1 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
            <div class="w-12 h-12 rounded border border-amber-400/60 bg-amber-950/40 flex items-center justify-center shadow-[inset_0_0_12px_rgba(245,158,11,0.5)]">
              <i class="${node.icon} text-lg text-amber-300 animate-pulse"></i>
            </div>
            <span class="text-[10px] font-bold text-white mt-1 leading-none tracking-wide">${node.name}</span>
            <span class="text-[8.5px] font-mono text-cyan-300 mt-1">${node.valText || '就绪'}</span>
          </div>

          <!-- 输入引脚 (位于芯片左侧中轴线) -->
          <div class="absolute left-[-10px] top-1/2 -translate-y-1/2 z-30" onmousedown="event.stopPropagation();">
            <div id="pin_${node.id}_in" 
                 class="bp-pin bp-pin-in" 
                 onclick="handleBlueprintPinClick('${node.id}', 'in', 'in', event);"
                 title="点击将信号线路接入主控核心 [BUS IN]">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
            </div>
          </div>

          <!-- 悬停弹出的精细工况 HUD -->
          <div class="absolute -bottom-14 left-1/2 -translate-x-1/2 w-44 bg-black/90 border border-amber-400/60 rounded px-2 py-1 text-[9px] font-mono text-amber-200 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl backdrop-blur-sm text-center">
            ${node.buffText || '待接入运算回路'}
          </div>

        </div>
      `;
    } else if (node.type === 'input') {
      // 输入插座 (主板金手指排针插座)
      const zone = CPU_BLUEPRINT_STATE.zones[node.zoneId || 'zone1'];
      const materials = zone ? zone.inputMaterials : {};
      let matButtonsHtml = '';
      Object.keys(materials).forEach(mName => {
        const isSel = node.material === mName;
        matButtonsHtml += `
          <button onmousedown="event.stopPropagation();" 
                  onclick="selectInputNodeMaterial('${node.id}', '${mName}');" 
                  class="px-1.5 py-0.5 text-[8px] rounded font-mono transition border cursor-pointer ${
                    isSel 
                      ? 'bg-cyan-500/40 text-cyan-200 border-cyan-400 font-bold' 
                      : 'bg-black/50 text-white/50 border-white/10 hover:border-white/40 hover:text-white'
                  }">
            ${mName}
          </button>
        `;
      });

      html += `
        <div id="node_${node.id}" 
             style="left: ${node.x}px; top: ${node.y}px; width: 140px;" 
             onmousedown="startDragBlueprintNode('${node.id}', event);"
             class="bp-node-card pcb-ic-package border border-cyan-400/60 cursor-move">
          
          <!-- 金手指插口装饰 (左侧金属触点) -->
          <div class="absolute -left-2 top-2 bottom-2 w-2 flex flex-col justify-between py-1 pointer-events-none">
            <span class="w-full h-1 bg-amber-400 rounded-xs shadow-[0_0_4px_#ffd700]"></span>
            <span class="w-full h-1 bg-amber-400 rounded-xs"></span>
            <span class="w-full h-1 bg-amber-400 rounded-xs shadow-[0_0_4px_#ffd700]"></span>
          </div>

          <div class="w-full h-5 flex items-center justify-between px-2 pt-0.5 border-b border-white/10 pointer-events-none">
            <div class="flex items-center space-x-1">
              <i class="${node.icon} text-[9px] text-cyan-400"></i>
              <span class="text-[9px] font-bold text-white">${node.name}</span>
            </div>
            <span class="text-[7.5px] font-mono text-cyan-300 font-bold">${node.signalOut || 0}S</span>
          </div>

          <div class="p-1.5 flex flex-col space-y-1">
            <div class="flex items-center justify-between text-[8px] font-mono text-white/60 pointer-events-none">
              <span>物料插槽:</span>
              <span class="text-cyan-300 font-bold">${node.material || '空置'}</span>
            </div>
            <div class="grid grid-cols-2 gap-1 pt-0.5">
              ${matButtonsHtml}
            </div>
          </div>

          <!-- 输出引脚 (位于右侧中轴线) -->
          <div class="absolute right-[-10px] top-1/2 -translate-y-1/2 z-30" onmousedown="event.stopPropagation();">
            <div id="pin_${node.id}_out_a" 
                 class="bp-pin bp-pin-out" 
                 onclick="handleBlueprintPinClick('${node.id}', 'out_a', 'out', event);"
                 title="从输入端引出信号走线 [OUT]">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            </div>
          </div>
        </div>
      `;
    } else {
      // 标准贴片微运算芯片 (增幅、分流、谐振、稳压、转化)
      const isAmp = node.type === 'amplifier';
      const isBranch = node.type === 'branch';
      const isResonator = node.type === 'resonator';

      // 紧凑尺寸设计
      const chipW = isBranch || isResonator ? 120 : 110;

      // 输入引脚列表
      let inPinsEl = '';
      if (node.inPins && node.inPins.length > 0) {
        inPinsEl = '<div class="absolute left-[-10px] top-0 bottom-0 flex flex-col justify-around py-2 z-30" onmousedown="event.stopPropagation();">';
        node.inPins.forEach(p => {
          inPinsEl += `
            <div id="pin_${node.id}_${p.id}" 
                 class="bp-pin bp-pin-in" 
                 onclick="handleBlueprintPinClick('${node.id}', '${p.id}', 'in', event);"
                 title="接入该引脚 [${p.label}]">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
            </div>
          `;
        });
        inPinsEl += '</div>';
      }

      // 输出引脚列表
      let outPinsEl = '';
      if (node.outPins && node.outPins.length > 0) {
        outPinsEl = '<div class="absolute right-[-10px] top-0 bottom-0 flex flex-col justify-around py-2 z-30" onmousedown="event.stopPropagation();">';
        node.outPins.forEach(p => {
          outPinsEl += `
            <div id="pin_${node.id}_${p.id}" 
                 class="bp-pin bp-pin-out" 
                 onclick="handleBlueprintPinClick('${node.id}', '${p.id}', 'out', event);"
                 title="从引脚拉出PCB铜箔线路 [${p.label}]">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
            </div>
          `;
        });
        outPinsEl += '</div>';
      }

      html += `
        <div id="node_${node.id}" 
             style="left: ${node.x}px; top: ${node.y}px; width: ${chipW}px;" 
             onmousedown="startDragBlueprintNode('${node.id}', event);"
             class="bp-node-card pcb-ic-package border ${node.type === 'resonator' ? 'border-purple-400/70' : 'border-slate-500/70'} group cursor-move">
          
          <!-- 上方针脚梳 -->
          <div class="absolute -top-1.5 left-3 right-3 h-1.5 flex justify-between px-0.5 pointer-events-none">
            <span class="w-1 h-full bg-slate-500"></span>
            <span class="w-1 h-full bg-slate-500"></span>
            <span class="w-1 h-full bg-slate-500"></span>
          </div>
          <!-- 下方针脚梳 -->
          <div class="absolute -bottom-1.5 left-3 right-3 h-1.5 flex justify-between px-0.5 pointer-events-none">
            <span class="w-1 h-full bg-slate-500"></span>
            <span class="w-1 h-full bg-slate-500"></span>
            <span class="w-1 h-full bg-slate-500"></span>
          </div>

          <!-- 芯片顶栏 -->
          <div class="w-full h-4.5 flex items-center justify-between px-2 pt-0.5 border-b border-white/10 pointer-events-none">
            <div class="flex items-center space-x-1">
              <i class="${node.icon} text-[8px]" style="color: ${node.themeColor || '#00f0ff'};"></i>
              <span class="text-[8.5px] font-bold text-white whitespace-nowrap">${node.name}</span>
            </div>
            <i class="fa-solid fa-circle-dot text-[6px] text-white/30"></i>
          </div>

          <!-- 芯片主体铭牌 (极简微电子标记) -->
          <div class="p-1.5 text-center flex flex-col items-center justify-center pointer-events-none">
            <span class="text-[9px] font-mono font-bold" style="color: ${node.themeColor || '#00f0ff'};">${node.valText || '就绪'}</span>
          </div>

          ${inPinsEl}
          ${outPinsEl}

        </div>
      `;
    }
  });

  layer.innerHTML = html;
}

// =========================================================================
// 4. 标准 45°/90° PCB 刚性铜箔走线生成算法 (曼哈顿倒角布线与电路过孔)
// =========================================================================
function generatePcbWirePath(x1, y1, x2, y2) {
  x1 = Number(x1) || 0;
  y1 = Number(y1) || 0;
  x2 = Number(x2) || 0;
  y2 = Number(y2) || 0;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // 1. 如果起点在终点左边 (顺流走线)
  if (dx >= 20) {
    if (absDy < 4) {
      return { path: `M ${x1} ${y1} L ${x2} ${y2}`, vias: [] };
    }

    // 45° 倒角走线：水平延伸 stub -> 45° 倾斜过渡 -> 水平进站
    if (dx > absDy + 20) {
      const stub = Math.max(16, (dx - absDy) * 0.5);
      const c1x = Math.round(x1 + stub);
      const c1y = y1;
      const c2x = Math.round(c1x + absDy);
      const c2y = y2;
      return {
        path: `M ${x1} ${y1} L ${c1x} ${c1y} L ${c2x} ${c2y} L ${x2} ${y2}`,
        vias: [{ x: c1x, y: c1y }, { x: c2x, y: c2y }]
      };
    } else {
      // 间距不足放 45° 倒角，采用标准正交 90° 阶梯走线
      const midX = Math.round(x1 + dx * 0.5);
      return {
        path: `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`,
        vias: [{ x: midX, y: y1 }, { x: midX, y: y2 }]
      };
    }
  } else {
    // 逆向或跨区拐弯回路：正交 U 型回环走线
    const stubX = 28;
    const midY = Math.round((y1 + y2) * 0.5);
    const p1x = Math.round(x1 + stubX);
    const p2x = Math.round(x2 - stubX);
    return {
      path: `M ${x1} ${y1} L ${p1x} ${y1} L ${p1x} ${midY} L ${p2x} ${midY} L ${p2x} ${y2} L ${x2} ${y2}`,
      vias: [
        { x: p1x, y: y1 },
        { x: p1x, y: midY },
        { x: p2x, y: midY },
        { x: p2x, y: y2 }
      ]
    };
  }
}

// 计算引脚精确绝对坐标 (100% 贴合 DOM 真实像素位置，无论是静态还是拖拽中)
function getBlueprintPinCoords(nodeId, pinId) {
  // 1. 优先从真实 DOM 元素读取像素级世界坐标，无论是拖拽中还是静止状态，100% 精准对齐引脚中心
  const pinEl = document.getElementById(`pin_${nodeId}_${pinId}`);
  const container = document.getElementById('cpuWorldContainer');
  if (pinEl && container) {
    const pinRect = pinEl.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    if (pinRect.width > 0 && contRect.width > 0) {
      const zoom = CPU_BLUEPRINT_STATE.zoom || 1;
      const realX = (pinRect.left + pinRect.width * 0.5 - contRect.left) / zoom;
      const realY = (pinRect.top + pinRect.height * 0.5 - contRect.top) / zoom;
      if (!isNaN(realX) && !isNaN(realY)) {
        return { x: Math.round(realX), y: Math.round(realY) };
      }
    }
  }

  // 2. 备用数学推导 (在 DOM 未渲染完毕或隐藏时计算)
  const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === nodeId);
  if (!node) return { x: 100, y: 100 };

  const isCore = node.type === 'core';
  const isInput = node.type === 'input';
  const nodeWidth = isCore ? 130 : (isInput ? 140 : (node.type === 'branch' || node.type === 'resonator' ? 120 : 110));
  const cardEl = document.getElementById(`node_${nodeId}`);
  const cardHeight = cardEl && cardEl.offsetHeight > 0 ? cardEl.offsetHeight : (isCore ? 130 : (isInput ? 80 : 54));

  if (pinId.startsWith('in')) {
    const inPins = node.inPins || [];
    const inIdx = Math.max(0, inPins.findIndex(p => p.id === pinId));
    const py = inPins.length <= 1 
      ? node.y + cardHeight * 0.5 
      : node.y + 12 + (inIdx + 0.5) * ((cardHeight - 24) / Math.max(1, inPins.length));
    return { x: node.x - 4, y: Math.round(py) };
  } else {
    const outPins = node.outPins || [];
    const outIdx = Math.max(0, outPins.findIndex(p => p.id === pinId));
    const py = outPins.length <= 1 
      ? node.y + cardHeight * 0.5 
      : node.y + 12 + (outIdx + 0.5) * ((cardHeight - 24) / Math.max(1, outPins.length));
    return { x: node.x + nodeWidth + 4, y: Math.round(py) };
  }
}


// 渲染 45°/90° PCB 刚性导电铜箔走线与过孔焊盘 (SVG 层)
function renderBlueprintWiresSvg() {
  const svg = document.getElementById('cpuWiringSvg');
  if (!svg) return;

  let wiresHtml = '';

  // 1. 渲染已连接的 PCB 线路
  CPU_BLUEPRINT_STATE.wires.forEach((wire, wIdx) => {
    const p1 = getBlueprintPinCoords(wire.fromNode, wire.fromPin);
    const p2 = getBlueprintPinCoords(wire.toNode, wire.toPin);
    const trace = generatePcbWirePath(p1.x, p1.y, p2.x, p2.y);
    const d = trace.path;

    const isGoldWire = wire.isGold || wire.toNode.includes('core');
    const wireColor = isGoldWire ? '#ffd700' : (wire.color || '#00f0ff');
    const flowClass = isGoldWire ? 'flowing-wire-gold' : 'flowing-wire';

    // 过孔焊盘 (Via Pads) HTML
    let viasHtml = '';
    trace.vias.forEach(v => {
      viasHtml += `
        <circle cx="${v.x}" cy="${v.y}" r="3.2" fill="#070b13" stroke="${wireColor}" stroke-width="1.8" />
        <circle cx="${v.x}" cy="${v.y}" r="1.2" fill="${wireColor}" opacity="0.9" />
      `;
    });

    wiresHtml += `
      <!-- 背景粗铜箔光晕 -->
      <path d="${d}" fill="none" stroke="${wireColor}" stroke-width="6" opacity="0.25" filter="drop-shadow(0 0 10px ${wireColor})" />
      
      <!-- 实体主铜箔走线 (45° 倒角刚性线路) -->
      <path d="${d}" fill="none" stroke="${wireColor}" stroke-width="3" 
            class="${flowClass} bp-wire-path" 
            onclick="removeBlueprintWire(${wIdx});"
            title="点击剪断/拆除此段 PCB 线路" />

      <!-- 导线核心白亮高导光斑 -->
      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.85" pointer-events="none" />

      <!-- 起点与终点焊盘圆环 -->
      <circle cx="${p1.x}" cy="${p1.y}" r="4" fill="#070b13" stroke="${wireColor}" stroke-width="2" pointer-events="none" />
      <circle cx="${p2.x}" cy="${p2.y}" r="4" fill="#070b13" stroke="${wireColor}" stroke-width="2" pointer-events="none" />

      <!-- 拐角电路过孔焊盘 (PCB Vias) -->
      ${viasHtml}
    `;
  });

  // 2. 渲染正在拉伸中的临时连线 (支持 45° 实时吸附)
  if (CPU_BLUEPRINT_STATE.connectingPin) {
    const pin = CPU_BLUEPRINT_STATE.connectingPin;
    const x1 = pin.x, y1 = pin.y;
    const x2 = pin.curX || (x1 + 60), y2 = pin.curY || y1;
    const trace = generatePcbWirePath(x1, y1, x2, y2);

    wiresHtml += `
      <path d="${trace.path}" fill="none" stroke="#f5921e" stroke-width="3" stroke-dasharray="5 3" class="flowing-wire" />
      <circle cx="${x2}" cy="${y2}" r="5" fill="#f5921e" filter="drop-shadow(0 0 8px #f5921e)" />
    `;
  }

  svg.innerHTML = wiresHtml;
}


// =========================================================================
// 5. 节点拖拽与画布平移交互 (受 zoom 缩放比精确变换，带严密边界保护)
// =========================================================================
function startDragBlueprintNode(nodeId, e) {
  e.stopPropagation();
  e.preventDefault();

  const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === nodeId);
  if (!node) return;

  // 点击或拖拽该节点时，自动将活动投放区同步为该节点所在区域
  if (node.zoneId && node.zoneId !== CPU_BLUEPRINT_STATE.activeZoneId) {
    selectBlueprintZone(node.zoneId, false);
  }

  CPU_BLUEPRINT_STATE.isPanning = false; // 拖动节点时坚决关闭平移
  CPU_BLUEPRINT_STATE.draggingNodeId = nodeId;
  CPU_BLUEPRINT_STATE.dragStartMouse.x = e.clientX;
  CPU_BLUEPRINT_STATE.dragStartMouse.y = e.clientY;
  CPU_BLUEPRINT_STATE.initialNodePos.x = node.x;
  CPU_BLUEPRINT_STATE.initialNodePos.y = node.y;

  // 高亮该节点并置顶层级
  document.querySelectorAll('.bp-node-card').forEach(c => {
    c.classList.remove('bp-node-active');
    c.style.zIndex = '25';
  });
  const card = document.getElementById(`node_${nodeId}`);
  if (card) {
    card.classList.add('bp-node-active');
    card.style.zIndex = '50';
  }

  inspectBlueprintNode(node);
}

// 全局鼠标移动监听 (驱动画布平移、节点拖拽与拉线实时跟随)
document.addEventListener('mousemove', (e) => {
  const modal = document.getElementById('cpuProcessorModal');
  if (!modal || modal.classList.contains('hidden')) return;

  // 1. 画布平移 (桌布平移)
  if (CPU_BLUEPRINT_STATE.isPanning) {
    const dx = e.clientX - CPU_BLUEPRINT_STATE.panStartMouse.x;
    const dy = e.clientY - CPU_BLUEPRINT_STATE.panStartMouse.y;
    CPU_BLUEPRINT_STATE.panX = Math.round(CPU_BLUEPRINT_STATE.initialPanPos.x + dx);
    CPU_BLUEPRINT_STATE.panY = Math.round(CPU_BLUEPRINT_STATE.initialPanPos.y + dy);
    updateCanvasTransform();
    return;
  }

  // 2. 拖动节点 (带严密边界保护，严禁飞出区域或画布)
  if (CPU_BLUEPRINT_STATE.draggingNodeId) {
    const node = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === CPU_BLUEPRINT_STATE.draggingNodeId);
    if (node) {
      const dx = (e.clientX - CPU_BLUEPRINT_STATE.dragStartMouse.x) / CPU_BLUEPRINT_STATE.zoom;
      const dy = (e.clientY - CPU_BLUEPRINT_STATE.dragStartMouse.y) / CPU_BLUEPRINT_STATE.zoom;

      let nextX = Math.round(CPU_BLUEPRINT_STATE.initialNodePos.x + dx);
      let nextY = Math.round(CPU_BLUEPRINT_STATE.initialNodePos.y + dy);

      // 严格限制在当前所属母板内部！绝不跑到外面或窜到其他区！
      const zone = CPU_BLUEPRINT_STATE.zones[node.zoneId] || CPU_BLUEPRINT_STATE.zones.zone1;
      const isCore = node.type === 'core';
      const nodeW = isCore ? 130 : (node.type === 'input' ? 140 : (node.width || 110));
      const nodeH = isCore ? 130 : (node.type === 'input' ? 75 : 60);

      if (zone && zone.rect) {
        const minX = zone.rect.x + 15;
        const maxX = zone.rect.x + zone.rect.width - nodeW - 15;
        const minY = zone.rect.y + 50;
        const maxY = zone.rect.y + zone.rect.height - nodeH - 35;
        nextX = Math.max(minX, Math.min(maxX, nextX));
        nextY = Math.max(minY, Math.min(maxY, nextY));
      } else {
        nextX = Math.max(60, Math.min(3500 - nodeW, nextX));
        nextY = Math.max(60, Math.min(3400 - nodeH, nextY));
      }

      node.x = nextX;
      node.y = nextY;

      const card = document.getElementById(`node_${node.id}`);
      if (card) {
        card.style.left = `${node.x}px`;
        card.style.top = `${node.y}px`;
      }

      renderBlueprintWiresSvg();
    }
    return;
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
    renderBlueprintWiresSvg();
  }
});

// =========================================================================
// 6. 引脚交互：点击出线与跨区引线吸附 (支持双向连线: IN-OUT 或 OUT-IN 均可无缝闭合)
// =========================================================================
function handleBlueprintPinClick(nodeId, pinId, pinType, e) {
  e.stopPropagation();

  const coords = getBlueprintPinCoords(nodeId, pinId);
  const px = coords.x;
  const py = coords.y;
  const pinEl = document.getElementById(`pin_${nodeId}_${pinId}`);

  // 1. 如果尚未处于连线状态，点击任意引脚 (OUT 或 IN 均可) 开启拉线
  if (!CPU_BLUEPRINT_STATE.connectingPin) {
    playUiSound('click');
    CPU_BLUEPRINT_STATE.connectingPin = {
      nodeId: nodeId,
      pinId: pinId,
      pinType: pinType, // 'out' 或 'in'
      x: px, y: py,
      curX: px, curY: py
    };
    if (pinEl) pinEl.classList.add('bp-pin-connecting');
    renderBlueprintWiresSvg();
    const promptTarget = pinType === 'out' ? '目标输入引脚 [IN]' : '目标输出引脚 [OUT]';
    showNotification(`已拉出导线，请点击【${promptTarget}】闭合回路！`);
    return;
  }

  // 2. 如果已有正在拉动的线
  const source = CPU_BLUEPRINT_STATE.connectingPin;

  // 若点击同一个引脚，取消拉线
  if (source.nodeId === nodeId && source.pinId === pinId) {
    cancelBlueprintConnecting();
    showNotification('已取消导灵光缆铺设');
    return;
  }

  // 不能连接同一节点的出入口
  if (source.nodeId === nodeId) {
    showNotification('无法芯片自连！必须连接到不同功能节点');
    return;
  }

  // 若点击了同类型引脚 (如连续点击两个 OUT 或两个 IN)，智能切换拉线起点
  if (source.pinType === pinType) {
    playUiSound('click');
    document.querySelectorAll('.bp-pin').forEach(p => p.classList.remove('bp-pin-connecting'));
    CPU_BLUEPRINT_STATE.connectingPin = {
      nodeId: nodeId,
      pinId: pinId,
      pinType: pinType,
      x: px, y: py,
      curX: px, curY: py
    };
    if (pinEl) pinEl.classList.add('bp-pin-connecting');
    renderBlueprintWiresSvg();
    const promptTarget = pinType === 'out' ? '目标输入引脚 [IN]' : '目标输出引脚 [OUT]';
    showNotification(`已切换回路起点，请点击【${promptTarget}】闭合回路！`);
    return;
  }

  // 3. 双向闭合：确定哪一端是 OUT，哪一端是 IN
  const fromNodeId = source.pinType === 'out' ? source.nodeId : nodeId;
  const fromPinId  = source.pinType === 'out' ? source.pinId  : pinId;
  const toNodeId   = source.pinType === 'in'  ? source.nodeId : nodeId;
  const toPinId    = source.pinType === 'in'  ? source.pinId  : pinId;

  // 检查是否已经存在该连线
  const exists = CPU_BLUEPRINT_STATE.wires.some(w => 
    w.fromNode === fromNodeId && w.fromPin === fromPinId && 
    w.toNode === toNodeId && w.toPin === toPinId
  );
  if (exists) {
    showNotification('该 PCB 线路回路已存在！');
    cancelBlueprintConnecting();
    return;
  }

  // 创建新连线
  const fromNode = CPU_BLUEPRINT_STATE.nodes.find(n => n.id === fromNodeId);
  const outPinDef = fromNode && fromNode.outPins ? fromNode.outPins.find(p => p.id === fromPinId) : null;
  const isGoldWire = (outPinDef && outPinDef.isGold) || fromPinId.includes('zone') || toPinId.includes('zone') || toNodeId.includes('core');

  CPU_BLUEPRINT_STATE.wires.push({
    id: `wire_${Date.now()}`,
    fromNode: fromNodeId,
    fromPin: fromPinId,
    toNode: toNodeId,
    toPin: toPinId,
    color: outPinDef ? outPinDef.color : (fromNode?.themeColor || '#00f0ff'),
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
  const currentCap = CPU_BLUEPRINT_STATE.slotCaps[CPU_BLUEPRINT_STATE.gameStage] || 99;
  const currentZoneMidNodes = CPU_BLUEPRINT_STATE.nodes.filter(n => n.zoneId === activeZoneId && n.type !== 'input' && n.type !== 'core');
  if (currentZoneMidNodes.length >= currentCap && nodeType !== 'input') {
    showNotification(`⚠ 区域算力槽位已满！当前阶段上限为 ${currentCap} 槽！`);
    return;
  }

  const count = CPU_BLUEPRINT_STATE.nodes.length + 1;
  const newId = `node_${nodeType}_${Date.now()}`;

  // 4. 精准计算在【当前选中的活动区域】内部的生成位置 (栅格排列，严格在母板开阔地带，绝不飞出母板或飞到其他区域)
  const existingMidCount = currentZoneMidNodes.length;
  const col = existingMidCount % 3;
  const row = Math.floor(existingMidCount / 3);

  const nodeW = nodeType === 'input' ? 140 : (nodeType === 'branch' || nodeType === 'resonator' ? 120 : 110);
  const nodeH = nodeType === 'input' ? 75 : 60;

  // 基础位置放在该区域输入端口右侧、核心左侧的中部开阔地带 (相对坐标 x: 260..580, y: 180..620)
  let spawnX = activeZone.rect.x + 260 + col * 150;
  let spawnY = activeZone.rect.y + 180 + row * 120;

  // 严格钳制在活动区域边界内
  const minX = activeZone.rect.x + 25;
  const maxX = activeZone.rect.x + activeZone.rect.width - nodeW - 25;
  const minY = activeZone.rect.y + 55;
  const maxY = activeZone.rect.y + activeZone.rect.height - nodeH - 35;
  spawnX = Math.max(minX, Math.min(maxX, spawnX));
  spawnY = Math.max(minY, Math.min(maxY, spawnY));

  let newNode = null;
  if (nodeType === 'amplifier') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'amplifier', name: `增幅芯片 Mk.${count}`, category: 'IC 运算',
      x: spawnX, y: spawnY, width: 110,
      themeColor: '#f59e0b', icon: 'fa-solid fa-chart-line',
      valText: '×1.50 | +6MW', ampLevel: 1,
      inPins:  [{ id: 'in',  label: 'IN',  color: '#f59e0b' }],
      outPins: [{ id: 'out', label: 'OUT', color: '#f59e0b' }]
    };
  } else if (nodeType === 'branch') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'branch', name: `分流晶体 Mk.${count}`, category: 'IC 分流',
      x: spawnX, y: spawnY, width: 120,
      themeColor: '#38bdf8', icon: 'fa-solid fa-code-branch',
      valText: '55% / 55%',
      inPins: [{ id: 'in', label: 'IN', color: '#38bdf8' }],
      outPins: [
        { id: 'out_a', label: 'A(55%)', color: '#38bdf8' },
        { id: 'out_b', label: 'B(55%)', color: '#38bdf8' }
      ]
    };
  } else if (nodeType === 'resonator') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'resonator', name: `谐振蜂窝 Mk.${count}`, category: 'IC 谐振',
      x: spawnX, y: spawnY, width: 120,
      themeColor: '#c084fc', icon: 'fa-solid fa-wave-square',
      valText: '双路加乘 ×1.6',
      inPins: [
        { id: 'in_1', label: '路 1', color: '#ef4444' },
        { id: 'in_2', label: '路 2', color: '#38bdf8' }
      ],
      outPins: [{ id: 'out', label: '谐振OUT', color: '#c084fc' }]
    };
  } else if (nodeType === 'stabilizer') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'stabilizer', name: `稳压储能 Mk.${count}`, category: '滤波储能',
      x: spawnX, y: spawnY, width: 110,
      themeColor: '#10b981', icon: 'fa-solid fa-battery-full',
      valText: '断供蓄能',
      inPins:  [{ id: 'in',  label: 'IN',  color: '#10b981' }],
      outPins: [{ id: 'out', label: 'OUT', color: '#10b981' }]
    };
  } else if (nodeType === 'converter') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'converter', name: `转化芯片 Mk.${count}`, category: '频谱调制',
      x: spawnX, y: spawnY, width: 110,
      themeColor: '#f97316', icon: 'fa-solid fa-shuffle',
      valText: '调制 50%',
      inPins:  [{ id: 'in',  label: 'IN',  color: '#f97316' }],
      outPins: [{ id: 'out', label: 'OUT', color: '#f97316' }]
    };
  } else if (nodeType === 'input') {
    newNode = {
      id: newId, zoneId: activeZoneId,
      type: 'input', name: `输入插座 B`, category: '物料插槽',
      x: spawnX, y: spawnY, width: 140,
      themeColor: activeZone.themeColor, icon: 'fa-solid fa-arrow-right-to-bracket',
      valText: '未接入物料', material: null, signalOut: 0,
      inPins: [],
      outPins: [{ id: 'out_a', label: 'OUT', color: activeZone.themeColor }]
    };
  }

  if (newNode) {
    CPU_BLUEPRINT_STATE.nodes.push(newNode);
    renderBlueprintNodesHtml();
    renderBlueprintWiresSvg();

    // 检查视口是否正在显示活动区域，若未在视野内则顺滑聚焦至该区域
    const vp = document.getElementById('paragonViewport');
    const vpRect = vp ? vp.getBoundingClientRect() : { width: 1280, height: 750 };
    const vpWorldLeft = -CPU_BLUEPRINT_STATE.panX / CPU_BLUEPRINT_STATE.zoom;
    const vpWorldRight = (vpRect.width - CPU_BLUEPRINT_STATE.panX) / CPU_BLUEPRINT_STATE.zoom;
    const vpWorldTop = -CPU_BLUEPRINT_STATE.panY / CPU_BLUEPRINT_STATE.zoom;
    const vpWorldBottom = (vpRect.height - CPU_BLUEPRINT_STATE.panY) / CPU_BLUEPRINT_STATE.zoom;
    const isVisibleInView = spawnX >= vpWorldLeft && spawnX <= vpWorldRight && spawnY >= vpWorldTop && spawnY <= vpWorldBottom;

    if (!isVisibleInView) {
      jumpToZone(activeZoneId);
    }

    showNotification(`已向【${activeZone.name}】部署【${newNode.name}】！`);
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
          <span class="${z.unlocked ? 'text-white/90' : 'text-white/40'}">${z.name}</span>
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
let cpuBlueprintHasInitialized = false;

function openCentralProcessorHUD() {
  playUiSound('click');
  const modal = document.getElementById('cpuProcessorModal');
  if (modal) {
    modal.classList.remove('hidden');
    if (!cpuBlueprintHasInitialized) {
      initCentralProcessorBlueprint();
      cpuBlueprintHasInitialized = true;
    } else {
      sanitizeAllBlueprintNodePositions();
      renderBlueprintPhaseTabs();
      renderWorldTreeBackgroundSvg();
      renderBlueprintZonesHtml();
      renderBlueprintNodesHtml();
      renderBlueprintWiresSvg();
      updateBlueprintMonitorStats();
      updatePaletteTargetZoneBadge();
    }
    requestAnimationFrame(() => {
      jumpToZone(CPU_BLUEPRINT_STATE.activeZoneId || 'zone1');
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
  CPU_BLUEPRINT_STATE.isPanning = false;
  CPU_BLUEPRINT_STATE.draggingNodeId = null;
  const vp = document.getElementById('paragonViewport');
  if (vp) vp.classList.remove('bp-viewport-panning');
  const modal = document.getElementById('cpuProcessorModal');
  if (modal) modal.classList.add('hidden');
}

// 页面挂载自动初始化
document.addEventListener('DOMContentLoaded', () => {
  initCentralProcessorBlueprint();
});
