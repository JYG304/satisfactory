// ====================================================================
// js/world_3d.js - 修仙工厂 3D 沙盒视界与交互引擎 (Three.js)
// 将 2D 平面视界升级为可自由移动、旋转视角、3D 建造部署与配方测试的 3D 工厂世界
// ====================================================================

(function () {
  if (typeof THREE === 'undefined') {
    console.warn('[World3D] THREE 未加载，保持 2D 降级模式。');
    return;
  }

  let scene, camera, renderer, raycaster;
  let groundPlane, groundGrid;
  let buildingsGroup, environmentGroup, particlesMesh;
  let hologramGroup = null;
  let hologramValidMat = null;
  let hologramInvalidMat = null;
  let currentHologramKey = null;

  let isInitialized = false;
  let animTime = 0;
  let lastFrameTime = performance.now();
  let externalCameraControl = false;
  let worldVersion = 1;
  let frameTickCount = 0;
  const frameHooks = [];

  // 相机轨道状态 (默认第一人称地面视角，按 [V] 切换无人机工厂俯瞰视角)
  const camState = {
    target: new THREE.Vector3(0, 2.2, 26),
    yaw: 0.05,        // 弧度
    pitch: 0.14,      // 俯仰角
    distance: 2.2,    // 默认第一人称贴地探索视角
    minDist: 1.5,
    maxDist: 1200
  };

  // 鼠标交互状态
  const mouseNDC = new THREE.Vector2(-999, -999);
  let lastMouseX = 0;
  let lastMouseY = 0;
  let isOrbitDragging = false;
  let isPanDragging = false;
  let dragDistance = 0;

  // 悬停与高亮
  let hoveredHit = null; // { bld, interactId, meshGroup, isTopSlot, slotType }
  let hoverBoxHelper = null;
  let showAll3DLabels = false; // 默认仅悬停显示标签，避免遮挡 3D 视界
  let showGroundGrid = false;  // 默认关闭地面辅助网格，消除高空俯瞰摩尔纹
  let visibleFloorMode = 'all'; // 'all' | '1f' | '2f' | '3f'
  let visibleInteractableMeshes = [];
  let raycastNearbyMeshes = [];
  let lastCullX = 99999, lastCullZ = 99999, lastCullDist = -1;
  let manualStackY = 0;
  const buildingMeshMap = new Map(); // bld.id -> { group, bld, animators, labelAnchorY, topY }
  const animatedBuildingEntries = []; // 仅存放有每帧动画的建筑条目，避免遍历全部 330+ 静态建筑
  const floatingIslandMeshes = [];    // 仅存放 3 座浮空仙岛，避免遍历全部环境网格
  const interactableMeshes = [];     // 用于 raycaster 检测的所有子网格
  const resourceNodes = [];          // 原始地图矿脉与水源节点
  const resourceNodeMeshes = [];     // 用于 raycaster 拾取的资源节点网格
  const mapPois = [];                // 外围大地图 POI 3D 锚点列表 (藏经阁/残碑/山河奇观/营地灯塔)
  const sectGuards = [];             // 敌宗藏经阁 3D 巡逻守卫与视野锥

  // 性能优化脏标记与复用向量
  let raycastDirty = true;
  let shadowDirty = true;
  let cullDirty = true;
  let lastHoverBoxBldId = null;
  let lastHoverDismantleMode = false;
  const _tmpLabelVec = typeof THREE !== 'undefined' ? new THREE.Vector3() : null;
  const _frustum = (typeof THREE !== 'undefined' && typeof THREE.Frustum === 'function') ? new THREE.Frustum() : null;
  const _projScreenMat = (typeof THREE !== 'undefined' && typeof THREE.Matrix4 === 'function') ? new THREE.Matrix4() : null;
  const _cullSphere = (typeof THREE !== 'undefined' && typeof THREE.Sphere === 'function') ? new THREE.Sphere() : null;

  // 3D 玩家化身与大地图现场潜行状态（主逻辑由 window.WorldStealthActor 驱动，此处保留单文件兼容兜底）
  const keysPressed = {};
  let fallbackFollowAvatarMode = true;
  let explorerAvatar = null;
  let spiritDroneMesh = null;
  let ghostDomainMesh = null;
  let shanheWallMesh = null;
  const fallbackExplorerState = {
    wx: 0,
    wz: 16,
    yaw: Math.PI,
    speed: 13.5,
    nearbyPoi: null,
    holdEProgress: 0,
    holdETargetId: null,
    ghostDomainTimer: 0,
    shanheWallTimer: 0,
    spottedByGuard: false,
    miniHudTick: 0
  };

  function getExplorerState() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.getExplorerState === 'function') {
      return window.WorldStealthActor.getExplorerState();
    }
    return fallbackExplorerState;
  }

  function setFollowAvatarMode(flag) {
    fallbackFollowAvatarMode = !!flag;
    if (window.WorldStealthActor && typeof window.WorldStealthActor.setFollowAvatarMode === 'function') {
      window.WorldStealthActor.setFollowAvatarMode(flag);
      return;
    }
    syncFollowBtnUI();
  }

  function getStealthContext() {
    return {
      explorerAvatar,
      spiritDroneMesh,
      ghostDomainMesh,
      shanheWallMesh,
      sectGuards,
      mapPois,
      resourceNodes,
      keysPressed,
      camState,
      externalCameraControl,
      isModalBlockingWorld,
      updateCameraTransform,
      markRaycastDirty: () => { raycastDirty = true; }
    };
  }

  // 策划表体素占格尺度：1 水平格 = 2.0m，1 高度格 = 2.0m (严格等比 1:1:1 立方体体素)
  const GRID_UNIT = 2.0;
  const HEIGHT_UNIT = 2.0;
  function getBuildingTableDef(type) {
    if (typeof XIUXIAN_BUILDINGS === 'undefined') return null;
    const alias = {
      smelter: 'furnace',
      constructor: 'cutter',
      foundation: 'foundation_2x2',
      foundation_4x4: 'foundation_2x2',
      power_burner: 'fuel_generator',
      water_pump: 'pump',
      purify_tower: 'purifier',
      portal: 'teleporter',
      beam: 'foundation_beam',
      bd_113: 'storage_box',
      bd_123: 'merger',
      bd_153: 'storage_desk'
    };
    return XIUXIAN_BUILDINGS[type] || XIUXIAN_BUILDINGS[alias[type]] || null;
  }

  function isConveyorType(type) {
    return type === 'conveyor' || type === 'conveyor_mk2' || type === 'conveyor_mk3' || type === 'bd_117' || type === 'bd_118' || type === 'bd_119' || type === 'bd_120';
  }

  function isOverviewLodHidden(type) {
    if (!type) return false;
    return isConveyorType(type) ||
      type === 'pipe' ||
      type === 'bd_112' ||
      type === 'foundation_beam' ||
      type === 'beam' ||
      type === 'storage_desk' ||
      type === 'bd_153' ||
      type === 'splitter' ||
      type === 'merger';
  }

  function getOrientedHalfExtents(def, rotDeg) {
    const dimX = def ? (def.dimX || 1) : 1;
    const dimY = def ? (def.dimY || 1) : 1;
    const dimZ = def ? (def.dimZ !== undefined ? def.dimZ : 1) : 1;
    const rotQuarter = Math.abs(Math.round((rotDeg || 0) / 90)) % 2 === 1;
    const w = (rotQuarter ? dimY : dimX) * GRID_UNIT;
    const d = (rotQuarter ? dimX : dimY) * GRID_UNIT;
    const h = (dimZ === 0 ? 0.16 : dimZ) * HEIGHT_UNIT;
    return { hw: w / 2, hd: d / 2, h };
  }

  function findSupportSurfaceAt(wx, wy, wz) {
    if (typeof worldBuildings === 'undefined' || wy <= 0.05) return null;
    for (let i = 0; i < worldBuildings.length; i++) {
      const b = worldBuildings[i];
      if (typeof b.wx !== 'number' || typeof b.wz !== 'number') continue;
      const bDef = getBuildingTableDef(b.type);
      const { hw, hd, h } = getOrientedHalfExtents(bDef, b.rot || 0);
      const topY = (b.wy || 0) + h;
      if (Math.abs(topY - wy) <= 0.35 && Math.abs(wx - b.wx) <= hw + 0.25 && Math.abs(wz - b.wz) <= hd + 0.25) {
        return { bld: b, def: bDef };
      }
    }
    return null;
  }

  function checkVolumeOverlap(placeDef, wx, wy, wz, rotDeg) {
    if (!placeDef || placeDef.occupancyMode === '不占格') return null;
    if (typeof worldBuildings === 'undefined') return null;
    const a = getOrientedHalfExtents(placeDef, rotDeg);
    const epsA_x = Math.min(0.28, a.hw * 0.25);
    const epsA_z = Math.min(0.28, a.hd * 0.25);
    const epsA_y = Math.min(0.28, a.h * 0.25);
    const aMinX = wx - a.hw + epsA_x, aMaxX = wx + a.hw - epsA_x;
    const aMinZ = wz - a.hd + epsA_z, aMaxZ = wz + a.hd - epsA_z;
    const aMinY = wy + epsA_y, aMaxY = wy + a.h - epsA_y;

    for (let i = 0; i < worldBuildings.length; i++) {
      const b = worldBuildings[i];
      if (typeof b.wx !== 'number' || typeof b.wz !== 'number') continue;
      const bDef = getBuildingTableDef(b.type);
      if (bDef && bDef.occupancyMode === '不占格') continue;
      const bExt = getOrientedHalfExtents(bDef, b.rot || 0);
      const epsB_x = Math.min(0.28, bExt.hw * 0.25);
      const epsB_z = Math.min(0.28, bExt.hd * 0.25);
      const epsB_y = Math.min(0.28, bExt.h * 0.25);
      const bMinX = b.wx - bExt.hw + epsB_x, bMaxX = b.wx + bExt.hw - epsB_x;
      const bMinZ = b.wz - bExt.hd + epsB_z, bMaxZ = b.wz + bExt.hd - epsB_z;
      const bMinY = (b.wy || 0) + epsB_y, bMaxY = (b.wy || 0) + bExt.h - epsB_y;

      if (aMinX < bMaxX && aMaxX > bMinX && aMinZ < bMaxZ && aMaxZ > bMinZ && aMinY < bMaxY && aMaxY > bMinY) {
        return `体积占格冲突：与【${b.name || (bDef ? bDef.name : b.type)}】空间重叠`;
      }
    }
    return null;
  }

  function evaluatePlacementRule(placeKey, ctx = {}) {
    const placeDef = getBuildingTableDef(placeKey);
    if (!placeDef) {
      return { allowed: true, reason: null, snapType: null, statusText: '📐 默认网格对齐' };
    }
    const rule = placeDef.placementRule || (placeDef.canPlaceOnRawMap ? 'raw_or_surface' : 'surface_only');
    const targetBld = ctx.targetBld || null;
    const targetDef = targetBld ? getBuildingTableDef(targetBld.type) : null;
    const targetTopStackable = ctx.targetTopStackable !== undefined
      ? !!ctx.targetTopStackable
      : (targetDef ? !!targetDef.topStackable : true);
    const hitNormalY = ctx.hitNormalY || 0;
    const onRawGround = !!ctx.onRawGround;
    const node = ctx.resourceNode || null;
    const shouldCheckOverlap = ctx.checkOverlap !== false;
    const overlapCheck = () => (shouldCheckOverlap && typeof ctx.wx === 'number')
      ? checkVolumeOverlap(placeDef, ctx.wx, ctx.wy || 0, ctx.wz || 0, ctx.rotDeg || 0)
      : null;

    if (rule === 'ore_node') {
      if (!node || node.kind !== 'ore_node') {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 只能放置在原始地图的矿脉节点上`,
          snapType: null,
          statusText: '⛔ 需对准原始地图【矿脉节点】放置'
        };
      }
      const ov = overlapCheck();
      if (ov) return { allowed: false, reason: ov, snapType: null, statusText: `⛔ ${ov}` };
      return { allowed: true, reason: null, snapType: 'ore_node', statusText: `⛏️ 矿脉节点吸附: ${node.label}` };
    }

    if (rule === 'water_node') {
      if (!node || node.kind !== 'water_node') {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 只能放置在原始地图的水源/液源节点上`,
          snapType: null,
          statusText: '⛔ 需对准原始地图【水源/液源节点】放置'
        };
      }
      const ov = overlapCheck();
      if (ov) return { allowed: false, reason: ov, snapType: null, statusText: `⛔ ${ov}` };
      return { allowed: true, reason: null, snapType: 'water_node', statusText: `💧 水源节点吸附: ${node.label}` };
    }

    if (rule === 'belt_processor') {
      if (!targetBld || !isConveyorType(targetBld.type)) {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 属于【带处理器 · 不占格】，必须直接架设在传送带上`,
          snapType: null,
          statusText: `⛔ 【带处理器】需对准传送带放置 (${placeDef.occupancyMode})`
        };
      }
      return {
        allowed: true,
        reason: null,
        snapType: 'belt_processor',
        statusText: `⚙️ 带处理器吸附（不占格）: ${targetBld.name || '传送带'}`
      };
    }

    if (rule === 'slot_thermal') {
      const validThermalHosts = ['power_engine', 'fusion_reactor', 'smelt_chamber', 'bd_163', 'alchemy_furnace_mk2', 'furnace_mk2'];
      if (!targetBld || !validThermalHosts.includes(targetBld.type)) {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 必须安装在【灵力引擎(BD_147) / 金乌聚变堆(BD_192)】或其上方宝塔叠炉热能插槽上`,
          snapType: null,
          statusText: '⛔ 需插在【灵力引擎 / 金乌聚变堆 / 宝塔热炉】热槽'
        };
      }
      const thermalHostLabel = targetBld.type === 'fusion_reactor'
        ? '金乌聚变堆 300 热能位'
        : (targetBld.type === 'power_engine' ? '灵力引擎热能位' : `宝塔导热叠炉顶槽(${targetBld.name || targetBld.type})`);
      return { allowed: true, reason: null, snapType: 'engine_chamber', statusText: `🏯 宝塔导热吸附: ${thermalHostLabel}` };
    }

    if (rule === 'slot_fluid') {
      if (!targetBld || targetBld.type !== 'fluid_hub') {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 属于液体插件，必须插入【流体处理中枢 (BD_158)】顶部插槽`,
          snapType: null,
          statusText: '⛔ 需插在【流体处理中枢 (BD_158)】插槽'
        };
      }
      return { allowed: true, reason: null, snapType: 'fluid_hub', statusText: '🔌 插槽吸附: 流体处理中枢' };
    }

    if (rule === 'slot_bio') {
      if (!targetBld || targetBld.type !== 'bio_base') {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 属于生物插件，必须插入【营养基座 (BD_159)】顶部插槽`,
          snapType: null,
          statusText: '⛔ 需插在【营养基座 (BD_159)】插槽'
        };
      }
      return { allowed: true, reason: null, snapType: 'bio_base', statusText: '🔌 插槽吸附: 营养基座' };
    }

    if (rule === 'slot_storage') {
      const validBoxes = ['storage_box', 'bd_113', 'bd_114', 'bd_115'];
      if (!targetBld || !validBoxes.includes(targetBld.type)) {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 属于箱顶配送插件（不占格），必须安装在【储藏盒 / 窄柜 / 宽柜】顶部`,
          snapType: null,
          statusText: '⛔ 需扣在【储藏盒 / 窄柜 / 宽柜】顶部'
        };
      }
      return { allowed: true, reason: null, snapType: 'slot_storage', statusText: '🕊️ 箱顶纸鹤配送吸附: 半径25格空投' };
    }

    if (rule === 'sky_track') {
      const dimTxt = `${placeDef.dimX}×${placeDef.dimY}×${placeDef.dimZ}格`;
      return {
        allowed: true,
        reason: null,
        snapType: 'sky_track',
        statusText: `🛸 高空灵舟天轨（不占地面格 · 悬空画线 ${dimTxt}）：无视地面建筑体积阻挡`
      };
    }

    if (rule === 'surface_only') {
      if (onRawGround) {
        return {
          allowed: false,
          reason: `${placeDef.name} (${placeDef.code}) 不可直接放原始地图，请先铺设【建筑底座】或放到顶部可放的平台表面`,
          snapType: null,
          statusText: '⛔ 不可放原始地图：需放在【建筑底座/平台】上'
        };
      }
      if (targetBld && hitNormalY > 0.45 && !targetTopStackable) {
        return {
          allowed: false,
          reason: `${targetBld.name || '该设施'} 顶部不可放 (策划表: 否)`,
          snapType: null,
          statusText: `⛔ 顶部不可放置 (${targetBld.name || targetBld.type})`
        };
      }
      const ov = overlapCheck();
      if (ov) return { allowed: false, reason: ov, snapType: null, statusText: `⛔ ${ov}` };
      const dimTxt = `${placeDef.dimX}×${placeDef.dimY}×${placeDef.dimZ}格`;
      return {
        allowed: true,
        reason: null,
        snapType: 'surface',
        statusText: `🧱 平台/顶面放置 (${dimTxt} · ${placeDef.occupancyMode || '体积占格'})`
      };
    }

    // raw_or_surface
    if (targetBld && hitNormalY > 0.45 && !targetTopStackable) {
      return {
        allowed: false,
        reason: `${targetBld.name || '该设施'} 顶部不可放 (策划表: 否)`,
        snapType: null,
        statusText: `⛔ 顶部不可放置 (${targetBld.name || targetBld.type})`
      };
    }
    const ov = overlapCheck();
    if (ov) return { allowed: false, reason: ov, snapType: null, statusText: `⛔ ${ov}` };
    const dimTxt = `${placeDef.dimX}×${placeDef.dimY}×${placeDef.dimZ}格`;
    return {
      allowed: true,
      reason: null,
      snapType: onRawGround ? 'raw_map' : 'surface',
      statusText: onRawGround
        ? `📐 原始地图直接放置 (${dimTxt} · [ / ] 调高)`
        : `🧱 积木表面堆叠 (${dimTxt})`
    };
  }

  // 常用复用材质
  const MAT_CACHE = {};
  function getMat(key, factory) {
    if (!MAT_CACHE[key]) MAT_CACHE[key] = factory();
    return MAT_CACHE[key];
  }

  function stdMat(color, roughness = 0.55, metalness = 0.45, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      emissive,
      emissiveIntensity
    });
  }

  // ------------------------------------------------------------------
  // 1. 初始化 3D 场景
  // ------------------------------------------------------------------
  function init() {
    const canvas = document.getElementById('world3DCanvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x163854);
    scene.fog = new THREE.FogExp2(0x284e6b, 0.00018);

    camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.2, 4500);
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    buildingsGroup = new THREE.Group();
    environmentGroup = new THREE.Group();
    scene.add(environmentGroup);
    scene.add(buildingsGroup);

    setupLighting();
    setupEnvironment();
    setupHologramMaterials();
    bindEvents(canvas);

    // 隐藏旧版 2D 建筑容器与机械臂，展示纯净 3D 视界
    const legacy2DContainer = document.getElementById('worldBuildingsContainer');
    if (legacy2DContainer) legacy2DContainer.classList.add('hidden');
    const mechArm = document.getElementById('mechArm');
    if (mechArm) mechArm.classList.add('hidden');

    isInitialized = true;
    hoverBoxHelper = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)), 0x00f0ff);
    hoverBoxHelper.visible = false;
    scene.add(hoverBoxHelper);

    syncBuildings();
    updateCameraTransform();
    animate();

    // 全局 [V] 键捕获：从第一人称战斗放出无人机进入工厂视角；[F10] 开关独立 DEBUG 调试窗口
    window.addEventListener('keydown', (e) => {
      if (e.code === 'F10') {
        e.preventDefault();
        const dbg = document.getElementById('godModeCombatEntryBar');
        if (dbg) dbg.classList.toggle('hidden');
        return;
      }
      if (e.code !== 'KeyV') return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      if (isModalBlockingWorld()) return;
      e.preventDefault();
      e.stopPropagation();
      toggleFollowAvatar();
    }, true);

    // 默认启动直接进入第一人称战斗视角
    setTimeout(() => {
      if (window.CombatSystem && typeof window.CombatSystem.enter === 'function' && !window.CombatSystem.isActive() && !isModalBlockingWorld()) {
        window.CombatSystem.enter();
      }
    }, 450);
  }

  function setupLighting() {
    const hemi = new THREE.HemisphereLight(0x9be2ff, 0x7c5c36, 0.85);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1d6, 1.45);
    sun.position.set(35, 55, 28);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 5;
    sun.shadow.camera.far = 160;
    const d = 55;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.35);
    rimLight.position.set(-30, 18, -35);
    scene.add(rimLight);
  }

  function setupEnvironment() {
    // 1. 程序化沙漠/灵石地面纹理
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 512;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext('2d');
    ctx.fillStyle = '#9c7848';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 2.5 + 0.5;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(225,185,120,0.06)' : 'rgba(90,62,32,0.07)';
      ctx.fillRect(x, y, r, r);
    }
    const groundTex = new THREE.CanvasTexture(texCanvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(80, 80);

    const groundGeo = new THREE.PlaneGeometry(2400, 2400);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.92,
      metalness: 0.05
    });
    groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    environmentGroup.add(groundPlane);

    // 工业辅助网格（覆盖 2000×2000m 广阔修仙盆地，默认隐藏以消除远景摩尔纹，可随时通过左上角开关开启）
    groundGrid = new THREE.GridHelper(2000, 500, 0xf5921e, 0x2a3b4c);
    groundGrid.position.y = 0.06;
    groundGrid.material.opacity = 0.18;
    groundGrid.material.transparent = true;
    groundGrid.visible = showGroundGrid;
    environmentGroup.add(groundGrid);

    // 2. 远景修仙奇岩与山峰（推远至 920~1060m 外圈地平线，环绕 2000×2000 盆地）
    const rockMat = stdMat(0x524234, 0.9, 0.05);
    const peakMat = stdMat(0x3a4a58, 0.85, 0.15);
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 920 + (i % 4) * 45;
      const h = 65 + (i * 19 % 55);
      const r = 32 + (i * 11 % 24);
      const geo = new THREE.ConeGeometry(r, h, 6);
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? rockMat : peakMat);
      mesh.position.set(Math.cos(angle) * radius, h / 2 - 0.5, Math.sin(angle) * radius);
      mesh.rotation.y = i * 0.7;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      environmentGroup.add(mesh);
    }

    // 3. 几座悬浮仙山灵岛 (推远至外围天际)
    const islandSpots = [
      { x: -480, y: 85, z: -480, s: 2.8 },
      { x: 520, y: 95, z: -460, s: 3.0 },
      { x: 480, y: 78, z: 520, s: 2.6 },
      { x: -520, y: 88, z: 460, s: 3.2 }
    ];
    islandSpots.forEach((isl, idx) => {
      const grp = new THREE.Group();
      const top = new THREE.Mesh(new THREE.CylinderGeometry(4 * isl.s, 2.5 * isl.s, 2 * isl.s, 7), stdMat(0x2a5440, 0.85, 0.1));
      const bot = new THREE.Mesh(new THREE.ConeGeometry(2.5 * isl.s, 6 * isl.s, 7), rockMat);
      bot.rotation.x = Math.PI;
      bot.position.y = -4 * isl.s;
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.1 * isl.s, 0),
        stdMat(0x00f0ff, 0.2, 0.3, 0x00d8ff, 0.9)
      );
      crystal.position.y = 2.2 * isl.s;
      grp.add(top, bot, crystal);
      grp.position.set(isl.x, isl.y, isl.z);
      grp.userData.floatBaseY = isl.y;
      grp.userData.floatPhase = idx * 2.1;
      environmentGroup.add(grp);
      floatingIslandMeshes.push(grp);
    });

    // 4. 原始地图可交互矿脉节点与水源节点 (用于采矿机 BD_135 与抽水机 BD_134 放置校验)
    resourceNodes.length = 0;
    resourceNodeMeshes.length = 0;

    const oreDefs = [
      { id: 'ore_fe_1', kind: 'ore_node', x: -21, z: -6, label: '玄铁矿脉 #1', color: 0x38bdf8, emissive: 0x0284c7 },
      { id: 'ore_fe_2', kind: 'ore_node', x: -29, z: 0, label: '玄铁矿脉 #2', color: 0x38bdf8, emissive: 0x0284c7 },
      { id: 'ore_cu_1', kind: 'ore_node', x: -21, z: 6, label: '赤铜矿脉 #1', color: 0xf59e0b, emissive: 0xd97706 },
      { id: 'ore_cu_2', kind: 'ore_node', x: -29, z: 12, label: '赤铜矿脉 #2', color: 0xf59e0b, emissive: 0xd97706 },
      { id: 'ore_coal_free', kind: 'ore_node', x: -24, z: -14, label: '富煤矿脉 [空闲可采]', color: 0x94a3b8, emissive: 0x475569 },
      { id: 'ore_lingshi_free', kind: 'ore_node', x: -24, z: 18, label: '外星灵石矿(辐射矿) [空闲可采]', color: 0x22d3ee, emissive: 0x0891b2 },
      { id: 'ore_quartz_free', kind: 'ore_node', x: 26, z: -8, label: '石英砂矿脉 [空闲可采]', color: 0xe2e8f0, emissive: 0x94a3b8 },
      { id: 'ore_fe_free', kind: 'ore_node', x: 26, z: 8, label: '纯玄铁矿脉 [空闲可采]', color: 0x38bdf8, emissive: 0x0369a1 },
      { id: 'ore_east_outpost', kind: 'ore_node', isRemoteRich: true, built: true, oreId: 'MAT_001', x: 160, z: -60, targetX: 64, targetZ: 6, label: '极东玄铁富矿极点 [御剑道标已并网]', color: 0x38bdf8, emissive: 0x0284c7 },
      { id: 'ore_west_outpost', kind: 'ore_node', isRemoteRich: true, built: true, oreId: 'MAT_002', x: -150, z: 60, targetX: -64, targetZ: 12, label: '极西赤铜富矿极点 [御剑道标已并网]', color: 0xf59e0b, emissive: 0xd97706 },
      { id: 'ore_se_free', kind: 'ore_node', isRemoteRich: true, built: false, oreId: 'MAT_006', x: 145, z: 85, targetX: 64, targetZ: 18, label: '东南灵石富矿极点 [空闲 · 按E拉设飞剑矿线]', color: 0x22d3ee, emissive: 0x0891b2 },
      { id: 'ore_nw_free', kind: 'ore_node', isRemoteRich: true, built: false, oreId: 'MAT_007', x: -140, z: -70, targetX: -64, targetZ: 12, label: '西北聚灵晶富矿极点 [空闲 · 按E拉设飞剑矿线]', color: 0xa855f7, emissive: 0x7e22ce }
    ];
    oreDefs.forEach((nd) => {
      resourceNodes.push(nd);
      const cluster = new THREE.Group();
      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 3.0, 0.22, 8),
        stdMat(0x2d3748, 0.75, 0.35, nd.emissive, 0.25)
      );
      pad.position.y = 0.11;
      pad.receiveShadow = true;
      pad.userData.resourceNode = nd;
      cluster.add(pad);
      resourceNodeMeshes.push(pad);

      const shardMat = stdMat(nd.color, 0.2, 0.45, nd.emissive, 0.85);
      for (let k = 0; k < 5; k++) {
        const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.58 + (k % 3) * 0.22, 0), shardMat);
        const angle = (k / 5) * Math.PI * 2;
        shard.position.set(Math.cos(angle) * 1.15, 0.55 + (k % 2) * 0.25, Math.sin(angle) * 1.15);
        shard.rotation.set(0.25 * k, k * 0.9, 0.15 * k);
        shard.castShadow = true;
        shard.userData.resourceNode = nd;
        cluster.add(shard);
        resourceNodeMeshes.push(shard);
      }
      if (nd.isRemoteRich) {
        cluster.scale.setScalar(2.2);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: nd.color,
          transparent: true,
          opacity: 0.32,
          depthWrite: false
        });
        const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.55, 14.5, 8, 1, true), beaconMat);
        beacon.position.y = 7.25;
        cluster.add(beacon);
        const halo = new THREE.Mesh(
          new THREE.TorusGeometry(2.6, 0.1, 6, 24),
          new THREE.MeshBasicMaterial({ color: nd.color, transparent: true, opacity: 0.7 })
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 0.45;
        cluster.add(halo);
      }
      cluster.position.set(nd.x, 0, nd.z);
      environmentGroup.add(cluster);
    });

    const waterDefs = [
      { id: 'water_1', kind: 'water_node', x: -15, z: 17, label: '清水水源 #1', color: 0x06b6d4, emissive: 0x0891b2 },
      { id: 'water_2', kind: 'water_node', x: -7, z: 17, label: '清水水源 #2', color: 0x06b6d4, emissive: 0x0891b2 },
      { id: 'water_free', kind: 'water_node', x: -16, z: 26, label: '天然清水泉 [空闲可抽]', color: 0x22d3ee, emissive: 0x0284c7 },
      { id: 'oil_free', kind: 'water_node', x: -6, z: 26, label: '原油渗点 [空闲可抽]', color: 0x334155, emissive: 0x7c2d12 },
      { id: 'spirit_free', kind: 'water_node', x: 24, z: 18, label: '灵泉液眼 [空闲可抽]', color: 0x34d399, emissive: 0x059669 }
    ];
    waterDefs.forEach((nd) => {
      resourceNodes.push(nd);
      const poolGrp = new THREE.Group();
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.22, 8, 24),
        stdMat(0x475569, 0.8, 0.25, nd.emissive, 0.35)
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.12;
      rim.userData.resourceNode = nd;
      poolGrp.add(rim);
      resourceNodeMeshes.push(rim);

      const poolMat = new THREE.MeshStandardMaterial({
        color: nd.color,
        emissive: nd.emissive,
        emissiveIntensity: 0.7,
        roughness: 0.15,
        metalness: 0.2,
        transparent: true,
        opacity: 0.78
      });
      const waterMesh = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 0.16, 20), poolMat);
      waterMesh.position.y = 0.09;
      waterMesh.userData.resourceNode = nd;
      poolGrp.add(waterMesh);
      resourceNodeMeshes.push(waterMesh);

      poolGrp.position.set(nd.x, 0, nd.z);
      environmentGroup.add(poolGrp);
    });

    // 4.5 外围大地图 POI 3D 地标锚点 (4座藏经阁宝塔、3座古修残碑、4处山河奇观柱、2座营地灯塔，置于 ±48 ~ ±70 避免与厂区建筑重叠)
    mapPois.length = 0;
    const defaultPoiDefs = [
      { id: 'POI_SECT_01', name: '青云外阁藏经塔', type: 'sect_library', sect: '青云宗', wx: -56, wz: -52, baseAlert: 28 },
      { id: 'POI_SECT_02', name: '血煞宗秘典阁', type: 'sect_library', sect: '血煞宗', wx: 56, wz: -54, baseAlert: 35 },
      { id: 'POI_SECT_03', name: '天机楼玄机塔', type: 'sect_library', sect: '天机阁', wx: -60, wz: 54, baseAlert: 42 },
      { id: 'POI_SECT_04', name: '万法殿镇宗宝塔', type: 'sect_library', sect: '万法宗', wx: 62, wz: 52, baseAlert: 48 },
      { id: 'POI_RELIC_01', name: '太古化煞环保残碑', type: 'relic_stele', sect: '古修遗迹', wx: -52, wz: 10, baseAlert: 0 },
      { id: 'POI_RELIC_02', name: '荒古灵植丹雾残碑', type: 'relic_stele', sect: '古修遗迹', wx: 12, wz: -58, baseAlert: 0 },
      { id: 'POI_RELIC_03', name: '上古星枢阵图残碑', type: 'relic_stele', sect: '古修遗迹', wx: 54, wz: -14, baseAlert: 0 },
      { id: 'POI_WONDER_01', name: '碧落悬瀑灵潭柱', type: 'wonder_node', sect: '天地奇观', wx: -64, wz: -18, baseAlert: 0 },
      { id: 'POI_WONDER_02', name: '苍梧古岳镇山柱', type: 'wonder_node', sect: '天地奇观', wx: -18, wz: 64, baseAlert: 0 },
      { id: 'POI_WONDER_03', name: '九霄雷泽灵脉柱', type: 'wonder_node', sect: '天地奇观', wx: 20, wz: 62, baseAlert: 0 },
      { id: 'POI_WONDER_04', name: '赤霞丹崖灵泉柱', type: 'wonder_node', sect: '天地奇观', wx: 66, wz: 18, baseAlert: 0 },
      { id: 'POI_CAMP_01', name: '西境前哨引路灯塔', type: 'camp_beacon', sect: '散修营地', wx: -48, wz: 34, baseAlert: 0 },
      { id: 'POI_CAMP_02', name: '北麓散修补给灯塔', type: 'camp_beacon', sect: '散修营地', wx: -26, wz: -54, baseAlert: 0 }
    ];
    const externalPois = (typeof window.XIUXIAN_MAP_POIS !== 'undefined' && window.XIUXIAN_MAP_POIS)
      ? (Array.isArray(window.XIUXIAN_MAP_POIS) ? window.XIUXIAN_MAP_POIS : Object.values(window.XIUXIAN_MAP_POIS))
      : null;
    const poiSource = (externalPois && externalPois.length > 0) ? externalPois : defaultPoiDefs;

    const poiSignpostLayer = typeof document !== 'undefined' ? document.getElementById('worldPoiSignposts') : null;
    if (poiSignpostLayer) poiSignpostLayer.innerHTML = '';

    // 4.6 北方唯一巨型敌方宗门建筑群：青云仙宗·山门禁地 (wx: -48..+48, wz: -120..-220)
    (function buildGrandEnemySectCompound() {
      const sectRoot = new THREE.Group();
      const stoneMat = getMat('sect_courtyard', () => stdMat(0x272030, 0.85, 0.15));
      const jadeMat = getMat('sect_plaza', () => stdMat(0x475569, 0.75, 0.2));
      const roadMat = getMat('sect_road', () => stdMat(0x64748b, 0.8, 0.15, 0xf43f5e, 0.12));
      const colMat = getMat('sect_gate_col', () => stdMat(0x991b1b, 0.5, 0.35));
      const eaveMat = getMat('sect_eave', () => stdMat(0xd97706, 0.4, 0.5, 0x92400e, 0.25));
      const goldRoofMat = getMat('sect_roof_gold', () => stdMat(0xf59e0b, 0.35, 0.6, 0xd97706, 0.45));
      const wingMat = getMat('sect_wing', () => stdMat(0x4c1d24, 0.65, 0.25));
      const lampMat = getMat('sect_lamp', () => stdMat(0xfbbf24, 0.2, 0.4, 0xf59e0b, 0.95));
      const shelfMat = getMat('sect_shelf', () => stdMat(0x78350f, 0.7, 0.2));
      const slipGlowMat = getMat('sect_slip', () => stdMat(0x38bdf8, 0.2, 0.5, 0x0284c7, 0.9));
      const herbMat = getMat('sect_herb', () => stdMat(0x10b981, 0.3, 0.2, 0x059669, 0.85));
      const shieldMat = getMat('sect_shield', () => new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }));

      // 1) 50m 长仙宗白玉引路古道 (wz: -55 .. -118) + 两侧 12 根盘龙朱红灯柱
      for (let z = -58; z >= -114; z -= 8) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.22, 6.4), roadMat);
        slab.position.set(0, 0.11, z);
        sectRoot.add(slab);
        [-4.5, 4.5].forEach((lx) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 3.8, 6), colMat);
          post.position.set(lx, 1.9, z);
          const orb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), lampMat);
          orb.position.set(lx, 4.0, z);
          sectRoot.add(post, orb);
        });
      }

      // 2) 巨型宗门总基座 (96m × 104m, wz: -120..-224) + 四周外墙与护宗光幕
      const baseDeck = new THREE.Mesh(new THREE.BoxGeometry(96, 0.8, 104), stoneMat);
      baseDeck.position.set(0, 0.4, -172);
      sectRoot.add(baseDeck);

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(94, 4.5, 0.8), shieldMat);
      backWall.position.set(0, 3.0, -222);
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 102), shieldMat);
      leftWall.position.set(-47, 3.0, -172);
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4.5, 102), shieldMat);
      rightWall.position.set(47, 3.0, -172);
      const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(34, 4.5, 0.8), shieldMat);
      frontWallL.position.set(-30, 3.0, -121);
      const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(34, 4.5, 0.8), shieldMat);
      frontWallR.position.set(30, 3.0, -121);
      sectRoot.add(backWall, leftWall, rightWall, frontWallL, frontWallR);

      // 四角镇宗角楼
      [[-46, -122], [46, -122], [-46, -222], [46, -222]].forEach(([cx, cz]) => {
        const tw = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.0, 11.0, 6), wingMat);
        tw.position.set(cx, 6.0, cz);
        const rf = new THREE.Mesh(new THREE.ConeGeometry(4.0, 3.2, 6), eaveMat);
        rf.position.set(cx, 13.0, cz);
        sectRoot.add(tw, rf);
      });

      // 3) 26m宽×15m高 三门四柱巨型山门牌坊 (wz: -120)
      [-10.5, -4.2, 4.2, 10.5].forEach((gx, gi) => {
        const h = (gi === 1 || gi === 2) ? 11.5 : 8.8;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.88, h, 8), colMat);
        col.position.set(gx, h * 0.5 + 0.8, -120);
        sectRoot.add(col);
      });
      const gateBeam = new THREE.Mesh(new THREE.BoxGeometry(25.5, 1.5, 2.6), eaveMat);
      gateBeam.position.set(0, 12.2, -120);
      const gateRoof = new THREE.Mesh(new THREE.ConeGeometry(10.5, 3.6, 4), goldRoofMat);
      gateRoof.rotation.y = Math.PI / 4;
      gateRoof.position.set(0, 14.8, -120);
      sectRoot.add(gateBeam, gateRoof);

      // 4) 一进院·演武广场 + 【外门藏经前殿 POI_SECT_01 (0, -142)】+ 左右掩体长廊 + 殿内玉简书架
      const baguaDisc = new THREE.Mesh(new THREE.RingGeometry(4.5, 6.2, 16), lampMat);
      baguaDisc.rotation.x = -Math.PI / 2;
      baguaDisc.position.set(0, 0.86, -132);
      sectRoot.add(baguaDisc);

      [-18, 18].forEach((cx) => {
        for (let z = -126; z >= -156; z -= 6) {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 5.2, 8), colMat);
          p.position.set(cx, 3.4, z);
          sectRoot.add(p);
        }
        const roof = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 36), eaveMat);
        roof.position.set(cx, 6.2, -141);
        sectRoot.add(roof);
      });

      // 前殿敞开式大堂 (0, -142) 内部清晰摆放 2 排发光玉简书架
      const hall1Roof = new THREE.Mesh(new THREE.ConeGeometry(9.5, 3.0, 4), eaveMat);
      hall1Roof.rotation.y = Math.PI / 4;
      hall1Roof.position.set(0, 8.2, -142);
      sectRoot.add(hall1Roof);
      [-5.2, 5.2].forEach((hx) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 6.2, 8), colMat);
        pillar.position.set(hx, 3.9, -138);
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.1, 3.6, 5.2), shelfMat);
        shelf.position.set(hx * 0.65, 2.6, -142);
        const slip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 4.6), slipGlowMat);
        slip.position.set(hx * 0.65, 3.0, -142);
        sectRoot.add(pillar, shelf, slip);
      });

      // 5) 二进西院·【西厢镇魔秘典阁 POI_SECT_02 (-30, -168)】+ 旋转星枢光路仪
      const westDeck = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 22), jadeMat);
      westDeck.position.set(-30, 1.0, -168);
      const westAstrolabe = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.22, 8, 24), slipGlowMat);
      westAstrolabe.position.set(-30, 4.2, -168);
      const westRoof = new THREE.Mesh(new THREE.ConeGeometry(10.5, 3.4, 6), eaveMat);
      westRoof.position.set(-30, 9.8, -168);
      sectRoot.add(westDeck, westAstrolabe, westRoof);
      [[-37, -161], [-23, -161], [-37, -175], [-23, -175]].forEach(([px, pz]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 7.2, 8), colMat);
        p.position.set(px, 4.6, pz);
        sectRoot.add(p);
      });

      // 6) 二进东院·【东厢百草灵兽苑 POI_SECT_03 (30, -168)】+ 发光灵草药畦 + 灵兽金笼
      const eastDeck = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 22), jadeMat);
      eastDeck.position.set(30, 1.0, -168);
      sectRoot.add(eastDeck);
      [[24, -163], [36, -163], [24, -173], [36, -173]].forEach(([hx, hz]) => {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.5, 5.2), shelfMat);
        bed.position.set(hx, 1.45, hz);
        sectRoot.add(bed);
        for (let k = -1; k <= 1; k++) {
          const herb = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), herbMat);
          herb.position.set(hx + k * 1.8, 2.2, hz);
          sectRoot.add(herb);
        }
      });
      // 中央高阶灵兽金笼
      const cage = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.4, 5.2), new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true }));
      cage.position.set(30, 3.4, -168);
      const beastCore = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), lampMat);
      beastCore.position.set(30, 3.2, -168);
      sectRoot.add(cage, beastCore);

      // 7) 三进后院高台·【五层镇宗藏经总阁 POI_SECT_04 (0, -198)】(高24m + 殿内3排发光玉简书架 + 60m冲天灵光柱)
      const highTerrace = new THREE.Mesh(new THREE.BoxGeometry(44, 2.0, 32), jadeMat);
      highTerrace.position.set(0, 1.8, -198);
      const stair = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 6), roadMat);
      stair.position.set(0, 1.2, -180);
      sectRoot.add(highTerrace, stair);

      // 左右钟鼓楼
      [-18, 18].forEach((bx) => {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.6, 9.5, 6), wingMat);
        tower.position.set(bx, 7.5, -196);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 2.6, 6), goldRoofMat);
        roof.position.set(bx, 13.5, -196);
        sectRoot.add(tower, roof);
      });

      // 五层藏经总阁主塔 (敞开式一楼柱廊展示 3 排玉简书架 + 金匮)
      [[-6, -192], [6, -192], [-6, -204], [6, -204]].forEach(([px, pz]) => {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 6.2, 8), colMat);
        p.position.set(px, 5.8, pz);
        sectRoot.add(p);
      });
      [-3.4, 0, 3.4].forEach((sx) => {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(1.0, 3.4, 6.4), shelfMat);
        rack.position.set(sx, 4.5, -198);
        const glow = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.5, 5.8), sx === 0 ? lampMat : slipGlowMat);
        glow.position.set(sx, 4.8, -198);
        sectRoot.add(rack, glow);
      });

      // 上方四重飞檐楼阁 (y: 9..24m) + 60m 冲天宗门灵光柱
      for (let f = 0; f < 4; f++) {
        const r = 6.2 - f * 1.1;
        const yBase = 9.8 + f * 3.6;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.72, r * 0.85, 2.4, 8), f % 2 === 0 ? colMat : wingMat);
        body.position.set(0, yBase, -198);
        const eave = new THREE.Mesh(new THREE.ConeGeometry(r * 1.18, 1.6, 8), f >= 2 ? goldRoofMat : eaveMat);
        eave.position.set(0, yBase + 1.9, -198);
        sectRoot.add(body, eave);
      }
      const skyBeacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 2.2, 60, 8),
        getMat('sect_beacon', () => new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.22, depthWrite: false }))
      );
      skyBeacon.position.set(0, 48, -198);
      sectRoot.add(skyBeacon);

      environmentGroup.add(sectRoot);
    })();

    // 4.7 出生点正前方·镇魔演武试炼场 (wx: 0, wz: 64) + 紫电剑碑引路石桥 + 西向翡翠山河古道
    (function buildEastCombatTrainingArena() {
      const arenaRoot = new THREE.Group();
      const darkStone = getMat('arena_stone', () => stdMat(0x1e1b2e, 0.85, 0.2));
      const roadMat = getMat('arena_road', () => stdMat(0x334155, 0.8, 0.25, 0x7e22ce, 0.25));
      const swordMat = getMat('arena_sword', () => stdMat(0x38bdf8, 0.25, 0.7, 0x0284c7, 0.65));
      const purpleGlow = getMat('arena_purple', () => stdMat(0xa855f7, 0.2, 0.4, 0x9333ea, 0.95));
      const emeraldRoad = getMat('west_road', () => stdMat(0x065f46, 0.8, 0.2, 0x10b981, 0.35));

      // 出生点 (0, 34) 向南直通演武擂台的紫电引路石桥 (wz: 38..44)
      for (let z = 38; z <= 44; z += 4) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.22, 3.6), roadMat);
        slab.position.set(0, 0.11, z);
        arenaRoot.add(slab);
        [-4.2, 4.2].forEach((lx) => {
          const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 3.2, 6), swordMat);
          post.position.set(lx, 1.6, z);
          arenaRoot.add(post);
        });
      }

      // 西向翡翠山河灵脉古道 (wx: -52..-95, wz: -20)
      for (let x = -54; x >= -92; x -= 8) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 5.4), emeraldRoad);
        slab.position.set(x, 0.1, -20 - (x + 54) * 0.45);
        arenaRoot.add(slab);
      }

      // 44m×44m 八角玄石镇魔演武擂台 (中心 wx: 0, wz: 64)
      const deck = new THREE.Mesh(new THREE.CylinderGeometry(22, 24, 0.65, 8), darkStone);
      deck.position.set(0, 0.32, 64);
      const ring1 = new THREE.Mesh(new THREE.RingGeometry(13, 14.2, 32), new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.72 }));
      ring1.rotation.x = -Math.PI / 2;
      ring1.position.set(0, 0.72, 64);
      const altar = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 1.1, 8), purpleGlow);
      altar.position.set(0, 1.2, 64);
      arenaRoot.add(deck, ring1, altar);

      // 四周 8 柄 14m 高倾斜插地的 3D 擎天巨剑石碑 + 36m 紫青冲天剑气柱
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        const sx = Math.cos(ang) * 20;
        const sz = 64 + Math.sin(ang) * 20;
        const swordPillar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 14, 0.45), swordMat);
        swordPillar.position.set(sx, 7.2, sz);
        swordPillar.rotation.y = -ang + Math.PI / 2;
        swordPillar.rotation.x = 0.14;
        arenaRoot.add(swordPillar);
      }
      const arenaBeacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 1.4, 36, 8),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.18, depthWrite: false })
      );
      arenaBeacon.position.set(0, 19, 64);
      arenaRoot.add(arenaBeacon);

      environmentGroup.add(arenaRoot);
    })();

    poiSource.forEach((poi, idx) => {
      const wx = Number(poi.wx ?? poi.x ?? 0);
      const wz = Number(poi.wz ?? poi.z ?? 0);
      const cnMap = {
        '敌方宗门藏经阁': 'sect_library',
        '古修遗迹残碑': 'relic_stele',
        '山河奇观与秘矿': 'wonder_node',
        '守矿修士营地': 'camp_beacon'
      };
      const poiType = cnMap[poi.type] || poi.type || (String(poi.id || '').startsWith('POI_SECT_') ? 'sect_library' : (String(poi.id || '').startsWith('POI_RELIC_') ? 'relic_stele' : (String(poi.id || '').startsWith('POI_WONDER_') ? 'wonder_node' : 'camp_beacon')));
      const grp = new THREE.Group();

      if (poiType === 'sect_library') {
        // 四院潜行交互光环（建筑主体已由 buildGrandEnemySectCompound 统一建在北方巨型宗门内）
        const innerRing = new THREE.Mesh(
          new THREE.RingGeometry(3.2, 3.8, 24),
          getMat('sect_inner_ring', () => new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.65 }))
        );
        innerRing.rotation.x = -Math.PI / 2;
        innerRing.position.y = poi.id === 'POI_SECT_04' ? 2.86 : 1.26;
        grp.add(innerRing);
      } else if (poiType === 'relic_stele') {
        // 古修残碑：八角古坛 + 倾斜玄石残碑 + 浮空符文环
        const plinth = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 0.9, 8), getMat('relic_plinth', () => stdMat(0x334155, 0.85, 0.15)));
        plinth.position.y = 0.45;
        const stele = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.2, 0.65), getMat('relic_stele', () => stdMat(0x1e293b, 0.75, 0.25, 0x0284c7, 0.45)));
        stele.position.y = 3.2;
        stele.rotation.z = 0.08 * (idx % 2 === 0 ? 1 : -1);
        const runeRing = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.14, 8, 24), getMat('relic_ring', () => stdMat(0xfbbf24, 0.25, 0.5, 0xf59e0b, 0.85)));
        runeRing.rotation.x = Math.PI / 2;
        runeRing.position.y = 6.2;
        grp.add(plinth, stele, runeRing);
      } else if (poiType === 'wonder_node') {
        // 山河奇观柱：翡翠灵柱 + 悬浮晶体 + 天地光束
        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.0, 1.0, 6), getMat('wonder_base', () => stdMat(0x064e3b, 0.7, 0.2)));
        base.position.y = 0.5;
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.35, 7.6, 6), getMat('wonder_pillar', () => stdMat(0x10b981, 0.3, 0.35, 0x059669, 0.7)));
        pillar.position.y = 4.3;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 0), getMat('wonder_crystal', () => stdMat(0x34d399, 0.15, 0.4, 0x10b981, 0.95)));
        crystal.position.y = 9.2;
        grp.add(base, pillar, crystal);
      } else {
        // 营地灯塔：木石底座 + 照明灯笼塔顶
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.3, 0.9, 6), getMat('camp_base', () => stdMat(0x475569, 0.85, 0.2)));
        base.position.y = 0.45;
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 5.8, 8), getMat('camp_mast', () => stdMat(0x94a3b8, 0.5, 0.5)));
        mast.position.y = 3.3;
        const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.95, 12, 12), getMat('camp_lantern', () => stdMat(0x38bdf8, 0.2, 0.3, 0x0ea5e9, 0.95)));
        lantern.position.y = 6.6;
        grp.add(base, mast, lantern);
      }

      // 地面交互光环（靠近即可按 [E] 现场交互）
      const ringColor = poiType === 'sect_library' ? 0xe879f9 : (poiType === 'relic_stele' ? 0xfbbf24 : (poiType === 'wonder_node' ? 0x10b981 : 0x38bdf8));
      const interactRing = new THREE.Mesh(
        new THREE.RingGeometry(4.6, 5.15, 28),
        getMat(`poi_ring_${poiType}`, () => new THREE.MeshBasicMaterial({ color: ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.45 }))
      );
      interactRing.rotation.x = -Math.PI / 2;
      interactRing.position.y = 0.08;
      grp.add(interactRing);

      grp.position.set(wx, 0, wz);
      grp.userData.mapPoi = poi;
      environmentGroup.add(grp);

      let signpostEl = null;
      if (false && poiSignpostLayer) {
        signpostEl = document.createElement('button');
        signpostEl.type = 'button';
        const badgeCls = poiType === 'sect_library'
          ? 'bg-rose-950/90 border-rose-400 text-rose-100 hover:bg-rose-800/90'
          : (poiType === 'relic_stele'
            ? 'bg-amber-950/85 border-amber-400 text-amber-100 hover:bg-amber-800/85'
            : (poiType === 'wonder_node'
              ? 'bg-emerald-950/85 border-emerald-400 text-emerald-100 hover:bg-emerald-800/85'
              : 'bg-cyan-950/85 border-cyan-400 text-cyan-100 hover:bg-cyan-800/85'));
        const iconTxt = poiType === 'sect_library' ? '🏯' : (poiType === 'relic_stele' ? '🪨' : (poiType === 'wonder_node' ? '🏞️' : '🗼'));
        signpostEl.className = `absolute -translate-x-1/2 -translate-y-full px-2 py-0.5 rounded-full border text-[10px] font-bold font-mono shadow-lg pointer-events-auto cursor-pointer whitespace-nowrap transition-opacity duration-150 ${badgeCls}`;
        signpostEl.innerHTML = `${iconTxt} ${poi.name} <span class="opacity-75 poi-dist-txt"></span>`;
        signpostEl.onclick = () => {
          if (window.World3D && window.World3D.moveAvatarToPoi) {
            window.World3D.moveAvatarToPoi(poi.id);
          }
        };
        poiSignpostLayer.appendChild(signpostEl);
      }

      mapPois.push({
        id: poi.id,
        name: poi.name,
        type: poiType,
        sect: poi.sect || poi.name.slice(0, 3),
        wx,
        wy: 0,
        wz,
        baseAlert: poi.baseAlert || (poiType === 'sect_library' ? 32 : 0),
        anchorY: poiType === 'sect_library' ? 19.5 : 9.5,
        signpostEl,
        meshGroup: grp
      });

      // 为敌方宗门藏经阁生成 3 名 3D 巡逻守卫与可视化扇形警戒视野锥
      if (poiType === 'sect_library') {
        const patrolRadius = 11.2;
        for (let g = 0; g < 3; g++) {
          const guardGrp = new THREE.Group();
          const bodyMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.42, 0.56, 1.85, 8),
            getMat('guard_robe', () => stdMat(0xb91c1c, 0.55, 0.25, 0x7f1d1d, 0.3))
          );
          bodyMesh.position.y = 0.95;
          const headMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.32, 10, 10),
            getMat('guard_head', () => stdMat(0xfde68a, 0.4, 0.1))
          );
          headMesh.position.y = 2.08;
          const coneMat = new THREE.MeshBasicMaterial({
            color: 0xf43f5e,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false
          });
          const visionCone = new THREE.Mesh(new THREE.CircleGeometry(10.0, 16, -0.52, 1.04), coneMat);
          visionCone.rotation.x = -Math.PI / 2;
          visionCone.rotation.z = Math.PI / 2;
          visionCone.position.y = 0.12;
          // 守卫头顶 3D 魂火警戒灯球（纯 3D 美术表现警戒度）
          const orbMat = new THREE.MeshStandardMaterial({
            color: 0xfbbf24,
            emissive: 0xb45309,
            emissiveIntensity: 0.9,
            roughness: 0.25
          });
          const alertOrb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), orbMat);
          alertOrb.position.y = 2.78;
          guardGrp.add(bodyMesh, headMesh, visionCone, alertOrb);

          const startAngle = (g * Math.PI * 2) / 3 + idx * 0.7;
          guardGrp.position.set(wx + Math.cos(startAngle) * patrolRadius, 0.5, wz + Math.sin(startAngle) * patrolRadius);
          environmentGroup.add(guardGrp);
          sectGuards.push({
            poiId: poi.id,
            centerX: wx,
            centerZ: wz,
            patrolRadius,
            angle: startAngle,
            angularSpeed: (g % 2 === 0 ? 0.52 : -0.46),
            visionRange: 10.0,
            halfFovCos: Math.cos(0.54),
            meshGroup: guardGrp,
            visionCone,
            coneMat,
            alertOrb,
            orbMat,
            chasing: false
          });
        }
      }
    });

    // 4b. 创建 3D 玩家探索化身（仙途修士）及随身法宝 3D 特效网格
    explorerAvatar = new THREE.Group();
    const avRobe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.62, 1.9, 10),
      getMat('av_robe', () => stdMat(0x0ea5e9, 0.35, 0.3, 0x0284c7, 0.45))
    );
    avRobe.position.y = 0.95;
    const avHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.34, 12, 12),
      getMat('av_head', () => stdMat(0xfef3c7, 0.4, 0.1))
    );
    avHead.position.y = 2.15;
    const avHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.06, 8, 24),
      getMat('av_halo', () => stdMat(0x22d3ee, 0.2, 0.5, 0x06b6d4, 0.95))
    );
    avHalo.rotation.x = Math.PI / 2;
    avHalo.position.y = 0.12;
    const avDirArrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.55, 6),
      getMat('av_dir', () => stdMat(0xfbbf24, 0.2, 0.5, 0xf59e0b, 0.9))
    );
    avDirArrow.rotation.x = Math.PI / 2;
    avDirArrow.position.set(0, 1.15, 0.85);
    const initEs = getExplorerState();
    explorerAvatar.add(avRobe, avHead, avHalo, avDirArrow);
    explorerAvatar.position.set(initEs.wx, 0, initEs.wz);
    explorerAvatar.visible = false; // 默认第一人称地面视角，按 [V] 开启无人机俯瞰时显现化身
    scene.add(explorerAvatar);

    // 4b-1. 万魂幡·鬼域 3D 实体（5.5m 黑金万魂幡杆+飘旗+骷髅金冠+4团残魂灵火+8m鬼域阵环）
    ghostDomainMesh = new THREE.Group();
    const whPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8),
      getMat('wh_pole', () => stdMat(0x1e1b2e, 0.4, 0.8))
    );
    whPole.position.y = 2.75;
    const whBanner = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 3.2, 1.5),
      getMat('wh_banner', () => stdMat(0x4c1d95, 0.35, 0.4, 0x9333ea, 0.85))
    );
    whBanner.position.set(0, 3.6, 0.78);
    const whCrown = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.42, 0),
      getMat('wh_crown', () => stdMat(0xfbbf24, 0.2, 0.8, 0xd97706, 0.8))
    );
    whCrown.position.y = 5.65;
    const whRing = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 8.0, 36),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false })
    );
    whRing.rotation.x = -Math.PI / 2;
    whRing.position.y = 0.09;
    ghostDomainMesh.add(whPole, whBanner, whCrown, whRing);
    const soulOrbMat = getMat('wh_orb', () => stdMat(0xe879f9, 0.15, 0.3, 0xc026d3, 0.95));
    for (let s = 0; s < 4; s++) {
      const ang = (s * Math.PI) / 2;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), soulOrbMat);
      orb.position.set(Math.cos(ang) * 4.2, 1.8, Math.sin(ang) * 4.2);
      ghostDomainMesh.add(orb);
    }
    ghostDomainMesh.visible = false;
    scene.add(ghostDomainMesh);

    // 4b-2. 山河社稷图·山河障 3D 立体画卷屏风（10m宽×4.2m高黄金卷轴+翡翠画幕+3座立体青绿山峰）
    shanheWallMesh = new THREE.Group();
    const shScrollMat = getMat('sh_pillar', () => stdMat(0xfbbf24, 0.25, 0.75, 0xd97706, 0.55));
    [-5.0, 5.0].forEach((sx) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 4.6, 10), shScrollMat);
      col.position.set(sx, 2.3, 0);
      shanheWallMesh.add(col);
    });
    const shCanvas = new THREE.Mesh(
      new THREE.BoxGeometry(9.8, 3.8, 0.18),
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false })
    );
    shCanvas.position.y = 2.1;
    shanheWallMesh.add(shCanvas);
    const shPeakMat = getMat('sh_peak', () => stdMat(0x059669, 0.45, 0.25, 0x34d399, 0.55));
    [[-2.6, 1.8, 1.1], [0, 2.4, 1.4], [2.6, 1.6, 1.0]].forEach(([px, ph, pr]) => {
      const pk = new THREE.Mesh(new THREE.ConeGeometry(pr, ph, 5), shPeakMat);
      pk.position.set(px, 0.4 + ph * 0.5, 0.22);
      shanheWallMesh.add(pk);
    });
    shanheWallMesh.visible = false;
    scene.add(shanheWallMesh);

    // 4c. 创建 3D 灵枢无人机（按 [V] 从玩家身上起飞进入工厂视角）
    spiritDroneMesh = new THREE.Group();
    const dCore = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55, 0),
      getMat('drone_core', () => stdMat(0x22d3ee, 0.2, 0.6, 0x06b6d4, 0.95))
    );
    const dRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.08, 6, 18),
      getMat('drone_ring', () => stdMat(0xfbbf24, 0.25, 0.7, 0xd97706, 0.75))
    );
    dRing.rotation.x = Math.PI / 2;
    spiritDroneMesh.add(dCore, dRing);
    const rotorOffsets = [[-0.85, 0.22, -0.85], [0.85, 0.22, -0.85], [-0.85, 0.22, 0.85], [0.85, 0.22, 0.85]];
    const rotors = [];
    const rMat = getMat('drone_rotor', () => stdMat(0x7dd3fc, 0.2, 0.5, 0x38bdf8, 0.9));
    rotorOffsets.forEach(([rx, ry, rz]) => {
      const rDisc = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.14), rMat);
      rDisc.position.set(rx, ry, rz);
      spiritDroneMesh.add(rDisc);
      rotors.push(rDisc);
    });
    spiritDroneMesh.userData.rotors = rotors;
    spiritDroneMesh.visible = false;
    scene.add(spiritDroneMesh);

    if (window.WorldStealthActor && typeof window.WorldStealthActor.setContext === 'function') {
      window.WorldStealthActor.setContext(getStealthContext());
    }

    // 5. 空中飘浮灵气微粒
    const pCount = 260;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 90;
      pPos[i * 3 + 1] = Math.random() * 18 + 0.5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x7fe8ff,
      size: 0.22,
      transparent: true,
      opacity: 0.65
    });
    particlesMesh = new THREE.Points(pGeo, pMat);
    scene.add(particlesMesh);
  }

  function setupHologramMaterials() {
    hologramValidMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00b8d4,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.48,
      depthWrite: false
    });
    hologramInvalidMat = new THREE.MeshStandardMaterial({
      color: 0xff3b5c,
      emissive: 0xd90429,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.48,
      depthWrite: false
    });
  }

  // ------------------------------------------------------------------
  // 2. 物料 3D 模型区分工厂 (按矿物/锭/液体/板材/齿轮/芯片/生物/法宝区分几何体与材质)
  // ------------------------------------------------------------------
  function createItemMesh3D(itemKey) {
    const item = (typeof XIUXIAN_ITEMS !== 'undefined' && XIUXIAN_ITEMS[itemKey]) ? XIUXIAN_ITEMS[itemKey] : null;
    const name = item ? item.name : (itemKey || '');
    const cat = item ? item.category : '';
    const form = item ? item.form : '';

    if (form === '液体' || cat.includes('液')) {
      // 液体：发光半透明药剂瓶/储液罐
      const grp = new THREE.Group();
      const liqColor = name.includes('煞') ? 0xa855f7 : (name.includes('营养') || name.includes('灵草') ? 0x10b981 : 0x00f0ff);
      const vial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.2, 0.42, 12),
        new THREE.MeshStandardMaterial({ color: liqColor, emissive: liqColor, emissiveIntensity: 0.65, transparent: true, opacity: 0.85, roughness: 0.15 })
      );
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 10), getMat('dark', () => stdMat(0x1e2530)));
      cap.position.y = 0.25;
      grp.add(vial, cap);
      return grp;
    }
    if (name.includes('矿') || cat === '矿物原料' || cat === '基础燃料') {
      // 矿石/煤炭：多面体不规则矿块
      const oreColor = name.includes('铜') ? 0xd97706 : (name.includes('煤') ? 0x1f2937 : 0x94a3b8);
      return new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), stdMat(oreColor, 0.75, 0.35));
    }
    if (name.includes('锭') || name.includes('合金')) {
      // 金属锭：长方体金属锭条
      const ingotColor = name.includes('铜') ? 0xe0770b : (name.includes('合金') ? 0xfbbf24 : 0xcbd5e1);
      return new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.24), stdMat(ingotColor, 0.3, 0.85));
    }
    if (name.includes('齿轮')) {
      // 齿轮：圆环齿盘
      const gearColor = name.includes('灵磁') ? 0x38bdf8 : 0x94a3b8;
      const m = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.07, 8, 12), stdMat(gearColor, 0.35, 0.8, name.includes('灵磁') ? 0x0284c7 : 0x000000, 0.4));
      m.rotation.x = Math.PI / 2;
      return m;
    }
    if (name.includes('芯片') || name.includes('模块') || name.includes('核心') || name.includes('插件')) {
      // 芯片/控制核心：发光电路晶片
      const grp = new THREE.Group();
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.36), stdMat(0x065f46, 0.4, 0.5));
      const die = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 0.16), stdMat(0x00f0ff, 0.2, 0.6, 0x00d8ff, 0.9));
      die.position.y = 0.04;
      grp.add(board, die);
      return grp;
    }
    if (cat.includes('生物') || name.includes('灵草') || name.includes('尸体')) {
      // 生物/灵草：翡翠晶芽
      return new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), stdMat(0x10b981, 0.35, 0.2, 0x059669, 0.55));
    }
    if (name.includes('法宝') || name.includes('煞气') || name.includes('灵根')) {
      // 法宝/灵根/煞气：紫金八面体灵物
      return new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), stdMat(0xa855f7, 0.2, 0.5, 0x9333ea, 0.85));
    }
    // 板材/梁/线材/通用件
    const plateColor = name.includes('铜') ? 0xf59e0b : (name.includes('木') ? 0x92400e : 0x64748b);
    return new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.1, 0.38), stdMat(plateColor, 0.45, 0.65));
  }

  // ------------------------------------------------------------------
  // 2B. 建筑 3D 模型工厂 (覆盖 recipe_table & bd_table 全部机器与积木)
  // ------------------------------------------------------------------
  function tagMesh(mesh, bld, interactId, isTopSlot = false, slotType = null) {
    mesh.userData.bld = bld;
    mesh.userData.interactId = interactId || bld.type;
    mesh.userData.isTopSlot = isTopSlot;
    mesh.userData.slotType = slotType;
    interactableMeshes.push(mesh);
    return mesh;
  }

  function build3DModelForType(type, bld, isHologram = false) {
    const group = new THREE.Group();
    const animators = [];
    let labelAnchorY = 3.2;

    const mDark = getMat('dark', () => stdMat(0x1b222c, 0.55, 0.65));
    const mSteel = getMat('steel', () => stdMat(0x3a4659, 0.4, 0.75));
    const mSlate = getMat('slate', () => stdMat(0x283242, 0.6, 0.45));
    const mOrange = getMat('orange', () => stdMat(0xe0770b, 0.42, 0.35));
    const mAmberGlow = getMat('amberGlow', () => stdMat(0xffaa00, 0.25, 0.3, 0xff6a00, 0.95));
    const mCyanGlow = getMat('cyanGlow', () => stdMat(0x00f0ff, 0.2, 0.3, 0x00c8ff, 0.9));
    const mEmeraldGlow = getMat('emeraldGlow', () => stdMat(0x10b981, 0.25, 0.3, 0x059669, 0.85));
    const mPurpleGlow = getMat('purpleGlow', () => stdMat(0xa855f7, 0.25, 0.3, 0x7e22ce, 0.95));
    const mYellow = getMat('yellow', () => stdMat(0xffd400, 0.35, 0.5));
    const mBioDark = getMat('bioDark', () => stdMat(0x0a291e, 0.45, 0.5));
    const mFluidDark = getMat('fluidDark', () => stdMat(0x0e2236, 0.45, 0.6));
    const mWood = getMat('wood', () => stdMat(0x8b4513, 0.75, 0.15));

    const subGroup = new THREE.Group();
    const add = (mesh, idOverride = null, isTop = false, slotType = null, targetParent = group) => {
      if (!isHologram && bld) {
        tagMesh(mesh, bld, idOverride || bld.type, isTop, slotType);
      }
      targetParent.add(mesh);
      return mesh;
    };
    const addSub = (mesh, idOverride = null, isTop = false, slotType = null) => add(mesh, idOverride, isTop, slotType, subGroup);

    const bDef = getBuildingTableDef(type);
    const dimX = bDef ? (bDef.dimX || 1) : 1;
    const dimY = bDef ? (bDef.dimY || 1) : 1;
    const dimZ = bDef ? (bDef.dimZ !== undefined ? bDef.dimZ : 1) : 1;
    const W = dimX * GRID_UNIT;
    const D = dimY * GRID_UNIT;
    const H = (dimZ === 0 ? 0.16 : dimZ) * HEIGHT_UNIT;
    let topY = H;

    const fitSubGroup = (targetW = W * 0.94, targetH = H, targetD = D * 0.94) => {
      subGroup.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(subGroup);
      if (!box.isEmpty()) {
        const sz = new THREE.Vector3();
        box.getSize(sz);
        const sx = sz.x > 0.01 ? targetW / sz.x : 1;
        const sy = sz.y > 0.01 ? targetH / sz.y : 1;
        const szScale = sz.z > 0.01 ? targetD / sz.z : 1;
        subGroup.scale.set(sx, sy, szScale);
        subGroup.position.set(0, -box.min.y * sy, 0);
      }
      group.add(subGroup);
    };

    if (type === 'power_engine') {
      // 灵力引擎（下）(BD_147, 4×3×2 = 8m×4m×6m) + 顶部 3 联装冶炼舱/炼丹炉插槽
      const deckH = H;
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, deckH - 0.25, D * 0.9), mFluidDark);
      chassis.position.y = (deckH - 0.25) / 2;
      add(chassis, 'power_engine');
      const deckTrim = new THREE.Mesh(new THREE.BoxGeometry(W * 0.96, 0.25, D * 0.94), mCyanGlow);
      deckTrim.position.y = deckH - 0.125;
      add(deckTrim, 'power_engine');
      for (let f = -2; f <= 2; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, deckH * 0.78, D * 0.96), mSteel);
        fin.position.set(f * (W * 0.17), deckH * 0.45, 0);
        add(fin, 'power_engine');
      }
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.16, 12, 24), mCyanGlow);
      ring.position.set(0, deckH * 0.5, D * 0.46);
      add(ring, 'power_engine');
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), mAmberGlow);
      core.position.set(0, deckH * 0.5, D * 0.46);
      add(core, 'power_engine');
      animators.push((t) => {
        ring.rotation.z = t * 1.8;
        core.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
      });

      if (bld && bld.topPlugin === 'bd_163') {
        // 整座占满 3 格的大炼丹炉 (BD_163, 横跨灵力引擎顶部)
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(W * 0.88, 0.55, D * 0.82), mDark);
        plinth.position.set(0, deckH + 0.275, 0);
        add(plinth, 'bd_163', true, 'engine_chamber');
        const cauldron = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 1.7, 2.75, 18), mOrange);
        cauldron.position.set(0, deckH + 1.9, 0);
        add(cauldron, 'bd_163', true, 'engine_chamber');
        const fireRing = new THREE.Mesh(new THREE.TorusGeometry(2.28, 0.15, 10, 28), mAmberGlow);
        fireRing.rotation.x = Math.PI / 2;
        fireRing.position.set(0, deckH + 2.15, 0);
        add(fireRing, 'bd_163', true, 'engine_chamber');
        const cap = new THREE.Mesh(new THREE.ConeGeometry(2.05, 1.3, 12), mSteel);
        cap.position.set(0, deckH + 3.9, 0);
        add(cap, 'bd_163', true, 'engine_chamber');
        animators.push((t) => { fireRing.rotation.z = t * 2.0; });
      } else {
        const slotsData = (typeof engineChamberSlots !== 'undefined') ? engineChamberSlots : [
          { slotIndex: 0, mounted: true },
          { slotIndex: 1, mounted: true },
          { slotIndex: 2, mounted: true }
        ];
        slotsData.forEach((slot, i) => {
          const sx = (i - 1) * (W * 0.28);
          const slotId = slot.mounted ? `smelt_chamber_${i}` : `smelt_slot_empty_${i}`;
          if (slot.mounted) {
            const chamber = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.6, 2.2), mOrange);
            chamber.position.set(sx, deckH + 1.3, 0);
            add(chamber, slotId, true, 'engine_chamber');
            const fireWin = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.2), mAmberGlow);
            fireWin.position.set(sx, deckH + 1.25, 1.15);
            add(fireWin, slotId, true, 'engine_chamber');
            const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.36, 1.2, 12), mDark);
            chimney.position.set(sx, deckH + 3.2, 0);
            add(chimney, slotId, true, 'engine_chamber');
          } else {
            const emptyPad = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 2.1), stdMat(0x334155, 0.6, 0.3, 0xf5921e, 0.25));
            emptyPad.position.set(sx, deckH + 0.12, 0);
            add(emptyPad, slotId, true, 'engine_chamber');
          }
        });
      }
      topY = H;
      labelAnchorY = H + 4.4;

    } else if (type === 'fluid_hub') {
      // 流体处理中枢 (BD_158, 2×4×4 = 4m×8m×8m) + 顶部搅拌机/离心机/提取器插槽
      const baseH = H * 0.52;
      const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, baseH - 0.25, D * 0.92), mFluidDark);
      base.position.y = (baseH - 0.25) / 2;
      add(base, 'fluid_hub');
      const collar = new THREE.Mesh(new THREE.BoxGeometry(W * 0.96, 0.25, D * 0.96), mCyanGlow);
      collar.position.y = baseH - 0.125;
      add(collar, 'fluid_hub');
      [-D * 0.28, D * 0.28].forEach((pz) => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, baseH * 0.95, 16), mSteel);
        tank.position.set(0, baseH * 0.5, pz);
        add(tank, 'fluid_hub');
      });
      [-W * 0.5, W * 0.5].forEach((px) => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.7, 12), mCyanGlow);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(px, baseH * 0.45, 0);
        add(pipe, 'fluid_hub');
      });

      const pluginH = H - baseH;
      const renderFluidPlugin = (pluginType, pz) => {
        if (pluginType === 'extractor') {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, pluginH * 0.9, 16), mSteel);
          col.position.set(0, baseH + pluginH * 0.45, pz);
          add(col, 'extractor', true, 'fluid_hub');
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.11, 10, 24), mCyanGlow);
          coil.rotation.x = Math.PI / 2;
          coil.position.set(0, baseH + pluginH * 0.5, pz);
          add(coil, 'extractor', true, 'fluid_hub');
          animators.push((t) => { coil.position.y = baseH + pluginH * 0.45 + Math.sin(t * 2.5) * 0.7; });
        } else if (pluginType === 'centrifuge') {
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, pluginH * 0.65, 14), mCyanGlow);
          hub.position.set(0, baseH + pluginH * 0.33, pz);
          add(hub, 'centrifuge', true, 'fluid_hub');
          const rotor = new THREE.Group();
          rotor.position.set(0, baseH + pluginH * 0.72, pz);
          for (let i = 0; i < 4; i++) {
            const ang = (i * Math.PI) / 2;
            const arm = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.16, 0.22), mSteel);
            arm.rotation.y = ang;
            const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.65, 10), mCyanGlow);
            pod.position.set(Math.cos(ang) * 1.05, 0.08, Math.sin(ang) * 1.05);
            rotor.add(arm, pod);
          }
          group.add(rotor);
          animators.push((t) => { rotor.rotation.y = t * 5.8; });
        } else {
          const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, pluginH * 0.75, 18), mSteel);
          drum.position.set(0, baseH + pluginH * 0.38, pz);
          add(drum, 'mixer', true, 'fluid_hub');
          const rotor = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.28, 0.28), mCyanGlow);
          rotor.position.set(0, baseH + pluginH * 0.85, pz);
          add(rotor, 'mixer', true, 'fluid_hub');
          animators.push((t) => { rotor.rotation.y = t * 4.5; });
        }
      };

      if (bld && Array.isArray(bld.plugins) && bld.plugins.length > 0) {
        const offsets = bld.plugins.length >= 2 ? [-D * 0.24, D * 0.24] : [0];
        bld.plugins.slice(0, 2).forEach((pType, idx) => renderFluidPlugin(pType, offsets[idx]));
      } else {
        const slot = (typeof fluidHubSlot !== 'undefined') ? fluidHubSlot : { mounted: true, childId: 'mixer' };
        if (slot.mounted) {
          renderFluidPlugin(slot.childId || 'mixer', 0);
        }
      }
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'bio_base') {
      // 营养基座 (BD_159, 1×2×1 = 2m×2m×4m) + 顶部培养仓/培养皿插槽
      const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, H - 0.22, D * 0.94), mBioDark);
      base.position.y = (H - 0.22) / 2;
      add(base, 'bio_base');
      const pipeBar = new THREE.Mesh(new THREE.BoxGeometry(W * 0.98, 0.22, D * 0.98), mEmeraldGlow);
      pipeBar.position.y = H - 0.11;
      add(pipeBar, 'bio_base');

      const slot = (typeof bioBaseSlot !== 'undefined') ? bioBaseSlot : { mounted: true, childId: 'incubator' };
      const topId = slot.mounted && slot.childId ? slot.childId : 'bio_base_slot';
      if (slot.mounted && slot.childId === 'petri_dish') {
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.7, 20), mEmeraldGlow);
        dish.position.y = H + 0.35;
        add(dish, topId, true, 'bio_base');
      } else if (slot.mounted) {
        const dome = new THREE.Mesh(
          new THREE.CylinderGeometry(0.85, 0.9, 1.8, 18),
          new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.55, roughness: 0.2, emissive: 0x059669, emissiveIntensity: 0.45 })
        );
        dome.position.y = H + 0.9;
        add(dome, topId, true, 'bio_base');
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.08, 10, 22), mYellow);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = H + 1.95;
        add(halo, topId, true, 'bio_base');
        animators.push((t) => { halo.rotation.z = t * 2.2; });
      }
      topY = H;
      labelAnchorY = H + 2.7;

    } else if (type === 'miner') {
      // 采矿机 (BD_135, 4×3×4)
      const pad = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.5, 5.2), mDark);
      pad.position.y = 0.25;
      addSub(pad);
      [[-3.0, -2.1], [3.0, -2.1], [-3.0, 2.1], [3.0, 2.1]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.6, 0.55), mSteel);
        leg.position.set(lx, 2.0, lz);
        addSub(leg);
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.8, 4.0), mOrange);
      body.position.y = 3.2;
      addSub(body);
      const crown = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 2.6), mSteel);
      crown.position.y = 4.8;
      addSub(crown);
      const drill = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.6, 10), mYellow);
      drill.rotation.x = Math.PI;
      drill.position.y = 1.4;
      addSub(drill);
      const ore = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), mCyanGlow);
      ore.position.y = 0.35;
      addSub(ore);
      animators.push((t) => {
        drill.rotation.y = t * 6.0;
        drill.position.y = 1.35 + Math.sin(t * 10) * 0.1;
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'furnace' || type === 'smelter') {
      // 精炼炉 (BD_136, 3×3×3)
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.6, 5.4), mDark);
      plinth.position.y = 0.3;
      addSub(plinth);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.45, 2.4, 10), mOrange);
      lower.position.y = 1.8;
      addSub(lower);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.05, 1.4, 10), mSlate);
      upper.position.y = 3.7;
      addSub(upper);
      const firebox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.45), mAmberGlow);
      firebox.position.set(0, 1.4, 2.25);
      addSub(firebox);
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.8, 12), mSteel);
      stack.position.y = 5.1;
      addSub(stack);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.1, 8, 18), mOrange);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 5.95;
      addSub(ring);
      fitSubGroup();
      const puffs = [];
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffd2a6, transparent: true, opacity: 0.45 })
        );
        puff.position.set((p - 1) * 0.25, H + 0.3 + p * 0.6, 0);
        group.add(puff);
        puffs.push(puff);
      }
      animators.push((t) => {
        firebox.material.emissiveIntensity = 0.8 + Math.sin(t * 5) * 0.25;
        puffs.forEach((pf, idx) => {
          const cycle = (t * 0.7 + idx * 0.33) % 1;
          pf.position.y = H + 0.2 + cycle * 2.2;
          pf.scale.setScalar(0.6 + cycle * 1.1);
          pf.material.opacity = (1 - cycle) * 0.45;
        });
      });
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'assembler') {
      // 加工台 (BD_138, 2×2×2)
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 3.6), mDark);
      base.position.y = 0.3;
      addSub(base);
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.6, 3.3), mSlate);
      body.position.y = 1.4;
      addSub(body);
      [-0.95, 0.95].forEach((px, idx) => {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.3, 3.45), mOrange);
        pod.position.set(px, 1.4, 0);
        addSub(pod);
        const gear = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.1, 8, 12), mCyanGlow);
        gear.position.set(px, 1.45, 1.78);
        addSub(gear);
        animators.push((t) => { gear.rotation.z = t * (idx === 0 ? 2.8 : -2.8); });
      });
      const cap = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 2.2), mSteel);
      cap.position.y = 2.35;
      addSub(cap);
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'assembler_heavy') {
      // 组装机 (BD_146, 3×3×3)
      const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.8, 5.6), mDark);
      base.position.y = 0.4;
      addSub(base);
      [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.4, 0.55), mSteel);
        post.position.set(px, 2.5, pz);
        addSub(post);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.7, 1.8), mOrange);
      bridge.position.y = 4.2;
      addSub(bridge);
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), mCyanGlow);
      core.position.y = 2.4;
      addSub(core);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 10, 24), mCyanGlow);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.4;
      addSub(ring);
      animators.push((t) => {
        core.rotation.y = t * 2.5;
        ring.rotation.z = -t * 1.5;
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'cutter' || type === 'constructor') {
      // 切割机 (BD_139, 1×1×1)
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 1.85), mDark);
      bed.position.y = 0.275;
      addSub(bed);
      [-0.75, 0.75].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.35), mSteel);
        pillar.position.set(px, 1.2, 0);
        addSub(pillar);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.35, 0.45), mOrange);
      beam.position.y = 1.9;
      addSub(beam);
      const laserHead = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8), mCyanGlow);
      laserHead.rotation.x = Math.PI;
      laserHead.position.y = 1.42;
      addSub(laserHead);
      animators.push((t) => { laserHead.position.x = Math.sin(t * 2.8) * 0.45; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.7;

    } else if (type === 'crusher') {
      // 粉碎机 (BD_137, 1×1×1)
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.2, 1.85), mDark);
      body.position.y = 0.6;
      addSub(body);
      const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.55, 0.65, 4), mOrange);
      hopper.rotation.y = Math.PI / 4;
      hopper.position.y = 1.52;
      addSub(hopper);
      [-0.3, 0.3].forEach((rx, idx) => {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.1, 8), mYellow);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, 1.28, 0);
        addSub(roller);
        animators.push((t) => { roller.rotation.y = t * (idx === 0 ? 5 : -5); });
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.7;

    } else if (type === 'deconstructor') {
      // 解构机 (BD_140, 2×4×2)
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 7.2), mDark);
      base.position.y = 0.4;
      addSub(base);
      const mCrimson = stdMat(0xf43f5e, 0.25, 0.5, 0xe11d48, 0.9);
      [[-1.4, -3.0], [1.4, -3.0], [-1.4, 3.0], [1.4, 3.0]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.8, 0.32), mSteel);
        post.position.set(px, 2.2, pz);
        addSub(post);
      });
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 10, 24), mCrimson);
      scanRing.rotation.x = Math.PI / 2;
      scanRing.position.y = 2.0;
      addSub(scanRing);
      animators.push((t) => { scanRing.position.y = 2.0 + Math.sin(t * 3.0) * 0.85; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'centrifuge') {
      // 离心机 (BD_144, 2×2×2)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 1.2, 16), mDark);
      base.position.y = 0.6;
      addSub(base);
      const rotor = new THREE.Group();
      rotor.position.y = 1.7;
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 14), mCyanGlow);
      rotor.add(hub);
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2;
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.18, 0.28), mSteel);
        arm.rotation.y = ang;
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.8, 12), mCyanGlow);
        pod.position.set(Math.cos(ang) * 1.35, 0.1, Math.sin(ang) * 1.35);
        rotor.add(arm, pod);
      }
      subGroup.add(rotor);
      animators.push((t) => { rotor.rotation.y = t * 6.5; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'alchemy_table') {
      // 炼宝台 (BD_156, 4×4×5)
      const step1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.9, 0.7, 8), mDark);
      step1.position.y = 0.35;
      addSub(step1);
      const step2 = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 3.1, 0.8, 8), mSlate);
      step2.position.y = 1.1;
      addSub(step2);
      const cauldron = new THREE.Mesh(new THREE.SphereGeometry(1.35, 18, 18), mPurpleGlow);
      cauldron.position.y = 2.6;
      addSub(cauldron);
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.12, 10, 32), mYellow);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 2.9;
      addSub(ring1);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.09, 10, 28), mCyanGlow);
      ring2.rotation.x = Math.PI / 3;
      ring2.position.y = 3.4;
      addSub(ring2);
      [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]].forEach(([px, pz]) => {
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3.2, 8), mSteel);
        lamp.position.set(px, 2.0, pz);
        addSub(lamp);
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), mPurpleGlow);
        gem.position.set(px, 3.9, pz);
        addSub(gem);
      });
      animators.push((t) => {
        ring1.rotation.z = t * 1.6;
        ring2.rotation.z = -t * 2.2;
        cauldron.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'tribulation_table') {
      // 渡劫台 (BD_157, 5×5×6)
      const dais1 = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.9, 0.8, 8), mDark);
      dais1.position.y = 0.4;
      addSub(dais1);
      const dais2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.7, 0.8, 8), mSlate);
      dais2.position.y = 1.2;
      addSub(dais2);
      [[-3.2, -3.2], [3.2, -3.2], [-3.2, 3.2], [3.2, 3.2]].forEach(([px, pz]) => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.42, 4.8, 8), mSteel);
        pylon.position.set(px, 3.0, pz);
        addSub(pylon);
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 8, 16), mCyanGlow);
        coil.rotation.x = Math.PI / 2;
        coil.position.set(px, 5.1, pz);
        addSub(coil);
      });
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), mYellow);
      orb.position.y = 4.2;
      addSub(orb);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.1, 10, 28), mCyanGlow);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 4.2;
      addSub(halo);
      animators.push((t) => {
        orb.rotation.y = t * 3.2;
        orb.position.y = 4.2 + Math.sin(t * 4) * 0.25;
        halo.rotation.z = -t * 2.0;
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'bd_160') {
      // 剑丸防御塔 (BD_160, 2×2×4)
      const ammoType = (bld && bld.ammoType) || 'gold';
      const ammoPalettes = {
        gold: { primary: 0xfbbf24, secondary: 0xf59e0b, emissive: 0xd97706 },
        thunder: { primary: 0x38bdf8, secondary: 0xa855f7, emissive: 0x7e22ce },
        fire: { primary: 0xf43f5e, secondary: 0xf97316, emissive: 0xe11d48 }
      };
      const pal = ammoPalettes[ammoType] || ammoPalettes.gold;

      const mAmmoGlow = getMat(`bd160_glow_${ammoType}`, () => stdMat(pal.primary, 0.2, 0.45, pal.primary, 1.05));
      const mAmmoSec = getMat(`bd160_sec_${ammoType}`, () => stdMat(pal.secondary, 0.25, 0.55, pal.emissive, 0.85));
      const mChamberGlass = getMat(`bd160_glass_${ammoType}`, () => new THREE.MeshStandardMaterial({
        color: pal.primary,
        emissive: pal.secondary,
        emissiveIntensity: 0.35,
        transparent: true,
        opacity: 0.32,
        roughness: 0.12,
        metalness: 0.2,
        depthWrite: false
      }));

      // 1. 八角重装底座 + 尾部(-Z)剑丸传送带进料槽口
      const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 2.02, 0.95, 8), mDark);
      basePlinth.rotation.y = Math.PI / 8;
      basePlinth.position.y = 0.475;
      addSub(basePlinth);

      const baseArmor = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.68, 0.45, 8), mSteel);
      baseArmor.rotation.y = Math.PI / 8;
      baseArmor.position.y = 1.15;
      addSub(baseArmor);

      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4 + Math.PI / 8;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 0.32), mSlate);
        rib.position.set(Math.cos(ang) * 1.66, 0.62, Math.sin(ang) * 1.66);
        rib.rotation.y = -ang;
        addSub(rib);
      }

      // 尾部(-Z)进料槽口：带发光边框的传送带弹药口
      const chuteHousing = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.92, 0.72), mSteel);
      chuteHousing.position.set(0, 0.52, -1.72);
      addSub(chuteHousing);
      const chuteInner = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.58, 0.42), mDark);
      chuteInner.position.set(0, 0.46, -1.94);
      addSub(chuteInner);
      const chuteFrameTop = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.1, 0.14), mAmmoGlow);
      chuteFrameTop.position.set(0, 0.82, -2.06);
      addSub(chuteFrameTop);
      const chuteFrameBot = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.1, 0.14), mAmmoGlow);
      chuteFrameBot.position.set(0, 0.14, -2.06);
      addSub(chuteFrameBot);
      [-0.54, 0.54].forEach((fx) => {
        const chuteFrameSide = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.76, 0.14), mAmmoGlow);
        chuteFrameSide.position.set(fx, 0.48, -2.06);
        addSub(chuteFrameSide);
      });
      const chutePellet = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), mAmmoSec);
      chutePellet.position.set(0, 0.42, -1.92);
      addSub(chutePellet);

      // 2. 中段透明「剑丸灵核弹仓」+ 悬浮灵核 + 双层反向旋转八卦剑环
      const magGroupY = 2.85;
      const magCollarBot = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.24, 0.24, 8), mDark);
      magCollarBot.position.y = 1.48;
      addSub(magCollarBot);
      const magCollarTop = new THREE.Mesh(new THREE.CylinderGeometry(1.24, 1.12, 0.26, 8), mDark);
      magCollarTop.position.y = 4.22;
      addSub(magCollarTop);

      const chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.02, 2.55, 16), mChamberGlass);
      chamber.position.y = magGroupY;
      addSub(chamber);

      const spiritCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.54, 0), mAmmoGlow);
      spiritCore.position.y = magGroupY;
      addSub(spiritCore);
      const spiritAura = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mAmmoSec);
      spiritAura.position.y = magGroupY;
      addSub(spiritAura);

      const baguaRingInner = new THREE.Group();
      baguaRingInner.position.y = magGroupY - 0.2;
      const innerTorus = new THREE.Mesh(new THREE.TorusGeometry(1.28, 0.065, 8, 8), mAmmoGlow);
      innerTorus.rotation.x = Math.PI / 2;
      add(innerTorus, null, false, null, baguaRingInner);
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const trigram = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.28), mAmmoSec);
        trigram.position.set(Math.cos(ang) * 1.28, 0, Math.sin(ang) * 1.28);
        trigram.rotation.y = -ang;
        add(trigram, null, false, null, baguaRingInner);
      }
      subGroup.add(baguaRingInner);

      const baguaRingOuter = new THREE.Group();
      baguaRingOuter.position.y = magGroupY + 0.25;
      const outerTorus = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.07, 8, 8), mAmmoSec);
      outerTorus.rotation.x = Math.PI / 2;
      add(outerTorus, null, false, null, baguaRingOuter);
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4 + Math.PI / 8;
        const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), mAmmoGlow);
        node.position.set(Math.cos(ang) * 1.52, 0, Math.sin(ang) * 1.52);
        add(node, null, false, null, baguaRingOuter);
      }
      subGroup.add(baguaRingOuter);

      // 3. 塔顶 6 柄悬浮飞剑剑匣阵列
      const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 1.15, 0.58, 8), mSteel);
      crownBase.position.y = 4.62;
      addSub(crownBase);

      const swordArray = new THREE.Group();
      swordArray.position.y = 5.65;
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const swordSlot = new THREE.Group();
        swordSlot.position.set(Math.cos(ang) * 1.18, 0, Math.sin(ang) * 1.18);
        swordSlot.rotation.y = -ang + Math.PI / 2;

        const swordPivot = new THREE.Group();
        // 剑尖斜指前方 (+Z / 外侧上方倾斜)
        swordPivot.rotation.x = Math.PI * 0.34;

        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.11, 1.35, 4), mAmmoGlow);
        blade.position.y = 0.68;
        add(blade, null, false, null, swordPivot);

        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.07, 0.14), mAmmoSec);
        guard.position.y = 0.02;
        add(guard, null, false, null, swordPivot);

        const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.34, 6), mDark);
        hilt.position.y = -0.18;
        add(hilt, null, false, null, swordPivot);

        swordSlot.add(swordPivot);
        swordArray.add(swordSlot);
      }
      subGroup.add(swordArray);

      const apexCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), mAmmoGlow);
      apexCore.position.y = 6.25;
      addSub(apexCore);

      animators.push((t) => {
        spiritCore.rotation.y = t * 2.2;
        spiritCore.position.y = magGroupY + Math.sin(t * 3.5) * 0.16;
        spiritAura.position.y = spiritCore.position.y;
        baguaRingInner.rotation.y = t * 1.8;
        baguaRingOuter.rotation.y = -t * 2.4;
        swordArray.rotation.y = t * 4.4;
        apexCore.rotation.y = -t * 3.0;
        chutePellet.position.z = -1.92 + ((t * 0.6) % 0.35);
      });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'fluid_tank' || type === 'bd_165') {
      // 储液罐 / 蓄水池 (BD_165, 2×2×3)
      const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, 0.45, D * 0.9), mDark);
      base.position.y = 0.225;
      addSub(base);
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(1.45, 1.45, 2.8, 20),
        new THREE.MeshStandardMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.58, roughness: 0.18, metalness: 0.25, emissive: 0x0891b2, emissiveIntensity: 0.35 })
      );
      tank.position.y = 1.85;
      addSub(tank);
      [0.85, 1.85, 2.85].forEach((ry) => {
        const band = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.08, 8, 24), mSteel);
        band.rotation.x = Math.PI / 2;
        band.position.y = ry;
        addSub(band);
      });
      const cap = new THREE.Mesh(new THREE.SphereGeometry(1.42, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), mSteel);
      cap.position.y = 3.25;
      addSub(cap);
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'bd_163') {
      // 炼丹炉（上） (BD_163, 2×1×2)
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.6, 1.75), mDark);
      plinth.position.y = 0.3;
      addSub(plinth);
      const cauldron = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.78, 2.2, 14), mOrange);
      cauldron.position.y = 1.7;
      addSub(cauldron);
      const core = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.14, 10, 20), mAmberGlow);
      core.rotation.x = Math.PI / 2;
      core.position.y = 2.2;
      addSub(core);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.0, 12), mSteel);
      cap.position.y = 3.3;
      addSub(cap);
      animators.push((t) => { core.rotation.z = t * 2.2; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'wind_generator') {
      // 风力发电机 (BD_155, 2×2×4)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.6, 10), mDark);
      base.position.y = 0.3;
      addSub(base);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.65, 5.4, 12), mSteel);
      tower.position.y = 3.0;
      addSub(tower);
      const hub = new THREE.Group();
      hub.position.set(0, 5.5, 0.5);
      for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.5, 0.1), mCyanGlow);
        blade.geometry.translate(0, 1.25, 0);
        blade.rotation.z = (i * Math.PI * 2) / 3;
        hub.add(blade);
      }
      subGroup.add(hub);
      animators.push((t) => { hub.rotation.z = t * 2.6; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 1.0;

    } else if (type === 'fuel_generator' || type === 'power_burner') {
      // 燃料发电机 (BD_149, 2×2×2)
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 3.4), mDark);
      body.position.y = 0.9;
      addSub(body);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.3, 14), mAmberGlow);
      core.position.set(-0.7, 1.9, 0);
      addSub(core);
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.2, 12), mSteel);
      chimney.position.set(0.95, 2.5, 0);
      addSub(chimney);
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'handcraft') {
      // 操作台 (BD_152, 2×3×3)
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 4.8), mSteel);
      desk.position.y = 0.8;
      addSub(desk);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.0, 0.4), mDark);
      frame.position.set(0, 2.6, -2.0);
      addSub(frame);
      const holo = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 2.4), mCyanGlow);
      holo.position.y = 2.05;
      addSub(holo);
      animators.push((t) => { holo.position.y = 2.05 + Math.sin(t * 2.5) * 0.12; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'storage_box' || type === 'bd_113' || type === 'bd_114' || type === 'bd_115') {
      // 严格对齐 bd_table.xlsx 尺寸：1×1×1 = 2m×2m×2m 立方体，2×1×1 = 4m×2m×2m 窄柜，1×2×1 = 2m×2m×4m 宽柜
      const bw = W * 0.92;
      const bd = D * 0.92;
      const lidH = Math.min(0.28, H * 0.16);
      const box = new THREE.Mesh(new THREE.BoxGeometry(bw, H - lidH, bd), mOrange);
      box.position.y = (H - lidH) / 2;
      add(box);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(W * 0.95, lidH, D * 0.95), mDark);
      lid.position.y = H - lidH / 2;
      add(lid);
      const clasp = new THREE.Mesh(new THREE.BoxGeometry(bw * 0.28, H * 0.22, 0.08), mYellow);
      clasp.position.set(0, H * 0.55, bd / 2 + 0.03);
      add(clasp);
      topY = H;
      labelAnchorY = H + 0.7;

    } else if (type === 'storage_desk' || type === 'bd_153' || type === 'bd_154') {
      // 置物桌（小桌板）：BD_153 1×1×1m (2×2×2m 立方占格), BD_154 1×1×2m (2×4×2m)
      const topThick = 0.22;
      const top = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, topThick, D * 0.94), mWood);
      top.position.y = H - topThick / 2;
      add(top);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(W * 0.96, 0.08, D * 0.96), mOrange);
      trim.position.y = H - topThick;
      add(trim);
      const lx = W * 0.36;
      const lz = D * 0.36;
      [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([px, pz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, H - topThick, 0.2), mSteel);
        leg.position.set(px, (H - topThick) / 2, pz);
        add(leg);
      });
      if (bld && bld.displayItem && !isHologram) {
        const prop = createItemMesh3D(bld.displayItem);
        prop.position.set(0, H + 0.26, 0);
        prop.scale.setScalar(1.35);
        group.add(prop);
        animators.push((t) => { prop.rotation.y = t * 1.4; });
      }
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'bd_112') {
      // 支撑 (BD_112, 1×1×5 = 2m×10m×2m)
      const post = new THREE.Mesh(new THREE.BoxGeometry(W * 0.55, H, D * 0.55), mDark);
      post.position.y = H / 2;
      add(post);
      const collarTop = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, 0.35, D * 0.92), mOrange);
      collarTop.position.y = H - 0.175;
      add(collarTop);
      const collarBot = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, 0.35, D * 0.92), mSteel);
      collarBot.position.y = 0.175;
      add(collarBot);
      topY = H;
      labelAnchorY = H + 0.7;

    } else if (type.startsWith('foundation')) {
      const fW = (bld && bld.slabW) ? bld.slabW : W;
      const fD = (bld && bld.slabD) ? bld.slabD : D;
      const slabH = H;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(fW - 0.04, Math.max(0.16, slabH - 0.14), fD - 0.04), mSteel);
      slab.position.y = Math.max(0.08, (slabH - 0.14) / 2);
      add(slab);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(fW - 0.02, Math.min(0.14, slabH), fD - 0.02), mOrange);
      rim.position.y = Math.max(0.07, slabH - 0.07);
      add(rim);
      if (bld && bld.wy >= 14 && bld.autoPillars) {
        const pH = 14;
        const pOffX = fW * 0.44;
        const pOffZ = fD * 0.44;
        [[-pOffX, -pOffZ], [pOffX, -pOffZ], [-pOffX, pOffZ], [pOffX, pOffZ]].forEach(([px, pz]) => {
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.45, pH, 0.45), mDark);
          col.position.set(px, -pH * 0.5, pz);
          add(col);
          const cap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.55), mOrange);
          cap.position.set(px, -0.18, pz);
          add(cap);
        });
      }
      topY = slabH;
      labelAnchorY = slabH + 0.7;

    } else if (type === 'bd_108' || type === 'bd_109') {
      const steps = type === 'bd_109' ? 8 : 4;
      const totalH = H;
      const totalD = D;
      for (let s = 0; s < steps; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, totalH / steps, totalD / steps), mSteel);
        step.position.set(0, (s + 0.5) * (totalH / steps), -totalD / 2 + (s + 0.5) * (totalD / steps));
        add(step);
      }
      topY = totalH;
      labelAnchorY = totalH + 0.6;

    } else if (type === 'conveyor' || type === 'conveyor_mk2' || type === 'conveyor_mk3' || type === 'bd_117' || type === 'bd_118' || type === 'bd_119' || type === 'bd_120') {
      const len = (bld && bld.beltLen) ? bld.beltLen : GRID_UNIT;
      const track = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.24, len), mDark);
      track.position.y = 0.52;
      if (type === 'bd_119') track.rotation.x = 0.35;
      if (type === 'bd_120') track.rotation.x = -0.35;
      add(track);
      const railMat = type === 'conveyor_mk3' ? mCyanGlow : (type === 'conveyor_mk2' ? mEmeraldGlow : mOrange);
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, len), railMat);
      railL.position.set(-0.6, 0.56, 0);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, len), railMat);
      railR.position.set(0.6, 0.56, 0);
      add(railL, railR);
      const legCount = Math.max(2, Math.round(len / 2.2) + 1);
      for (let i = 0; i < legCount; i++) {
        const zOff = -len * 0.42 + (i / (legCount - 1)) * len * 0.84;
        const leg = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.48, 0.16), mSteel);
        leg.position.set(0, 0.24, zOff);
        add(leg);
      }
      const itemCube = createItemMesh3D((bld && bld.beltItem) ? bld.beltItem : 'iron_ore');
      itemCube.position.set(0, 0.85, 0);
      group.add(itemCube);
      animators.push((t) => {
        const span = Math.max(1.2, len - 0.5);
        const p = ((t * 2.0) % span) - span / 2;
        itemCube.position.z = p;
        if (type === 'bd_119') itemCube.position.y = 0.85 - p * 0.35;
        if (type === 'bd_120') itemCube.position.y = 0.85 + p * 0.35;
      });
      topY = 0.8;
      labelAnchorY = 1.6;

    } else if (type === 'vert_conveyor' || type === 'bd_121') {
      const h = (bld && bld.liftHeight) ? bld.liftHeight : (4.0 * HEIGHT_UNIT);
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), mDark);
      shaft.position.y = h / 2;
      add(shaft);
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 1.5), mCyanGlow);
      railL.position.set(-0.72, h / 2, 0);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, 1.5), mCyanGlow);
      railR.position.set(0.72, h / 2, 0);
      add(railL, railR);
      const liftItem = createItemMesh3D((bld && bld.beltItem) ? bld.beltItem : 'copper_wire');
      liftItem.position.set(0, 1.0, 0.45);
      group.add(liftItem);
      const liftTray = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.14, 0.7), mOrange);
      liftTray.position.set(0, 0.85, 0.45);
      group.add(liftTray);
      animators.push((t) => {
        const yPos = 0.6 + ((t * 2.6) % Math.max(1.5, h - 0.8));
        liftTray.position.y = yPos;
        liftItem.position.y = yPos + 0.25;
      });
      topY = h;
      labelAnchorY = h + 0.6;

    } else if (type === 'splitter' || type === 'merger' || type === 'bd_122' || type === 'bd_123' || type === 'bd_124' || type === 'bd_125' || type === 'bd_126' || type === 'bd_161' || type === 'bd_162' || type === 'conveyor_limiter') {
      const isSmart = type === 'bd_125' || type === 'bd_126' || type === 'bd_161' || type === 'bd_162';
      const isLimiter = type === 'conveyor_limiter';
      const trimH = 0.24;
      const box = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, H - trimH, D * 0.92), mSteel);
      box.position.y = (H - trimH) / 2;
      add(box);
      const topTrim = new THREE.Mesh(new THREE.BoxGeometry(W * 0.82, trimH, D * 0.82), isLimiter ? mAmberGlow : (isSmart ? mCyanGlow : mOrange));
      topTrim.position.y = H - trimH / 2;
      add(topTrim);
      topY = H;
      labelAnchorY = H + 0.6;

    } else if (type === 'pipe' || type.startsWith('bd_128') || type.startsWith('bd_129') || type.startsWith('bd_130') || type.startsWith('bd_131') || type.startsWith('bd_132') || type.startsWith('bd_133')) {
      const pLen = (bld && bld.pipeLen) ? bld.pipeLen : 4.0;
      const mainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, pLen, 14), mFluidDark);
      mainPipe.rotation.z = Math.PI / 2;
      mainPipe.position.y = 0.75;
      add(mainPipe);
      [-pLen * 0.45, 0, pLen * 0.45].forEach((px) => {
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.16, 14), mCyanGlow);
        flange.rotation.z = Math.PI / 2;
        flange.position.set(px, 0.75, 0);
        add(flange);
      });
      if (type === 'bd_129' || type === 'bd_132') {
        const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.6, 14), mFluidDark);
        vert.position.set(0, 1.5, 0);
        add(vert);
      } else if (type === 'bd_130' || type === 'bd_131' || type === 'bd_133') {
        const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.9, 14), mFluidDark);
        branch.rotation.x = Math.PI / 2;
        branch.position.set(0, 0.75, 0.95);
        add(branch);
      }
      topY = 1.2;
      labelAnchorY = 2.0;

    } else if (type === 'pump' || type === 'water_pump') {
      // 抽水机 (BD_134): 垂直工业泵塔 (总高 ~4.4m, 含水下吸水管 y=-0.6..0.8)
      // 1. 水下/底端吸水管与滤网 (y = -0.6 .. 0.8) + 青色进水发光环
      const intakePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.4, 14), mFluidDark);
      intakePipe.position.y = 0.1;
      add(intakePipe);
      const strainer = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.48, 0.45, 12), mSteel);
      strainer.position.y = -0.38;
      add(strainer);
      const intakeRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.08, 8, 20), mCyanGlow);
      intakeRing.rotation.x = Math.PI / 2;
      intakeRing.position.y = 0.02;
      add(intakeRing);
      const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.08, 0.28, 14), mSteel);
      baseCollar.position.y = 0.66;
      add(baseCollar);

      // 2. 高耸深钢圆柱泵体 (y = 0.6 .. 2.8) + 竖向加强筋 + 青色液位视镜管
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.86, 2.2, 16), mDark);
      housing.position.y = 1.7;
      add(housing);
      const midRing = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.84, 0.16, 16), mSteel);
      midRing.position.y = 1.7;
      add(midRing);
      const topFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.8, 0.2, 16), mSteel);
      topFlange.position.y = 2.75;
      add(topFlange);
      for (let r = 0; r < 6; r++) {
        const ang = (r * Math.PI) / 3;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.1, 0.18), mSteel);
        rib.position.set(Math.cos(ang) * 0.8, 1.7, Math.sin(ang) * 0.8);
        rib.rotation.y = -ang;
        add(rib);
      }
      // 液位视镜圆柱 (z = +0.86 前侧)
      const sightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 1.45, 10), mCyanGlow);
      sightGlass.position.set(0, 1.7, 0.86);
      add(sightGlass);
      [0.95, 2.45].forEach((capY) => {
        const sgCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.28), mSteel);
        sgCap.position.set(0, capY, 0.84);
        add(sgCap);
      });

      // 3. 顶部电机帽 + 绕 Y 轴旋转的涡轮叶轮 (y = 3.2 .. 4.0, 顶冠达 ~4.4m)
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.72, 0.4, 14), mSteel);
      neck.position.y = 3.0;
      add(neck);
      const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 0.56, 14), mOrange);
      motorCap.position.y = 3.48;
      add(motorCap);
      const motorRim = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 8, 20), mCyanGlow);
      motorRim.rotation.x = Math.PI / 2;
      motorRim.position.y = 3.24;
      add(motorRim);

      const impeller = new THREE.Group();
      impeller.position.y = 3.92;
      const impHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.42, 12), mCyanGlow);
      add(impHub, null, false, null, impeller);
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.14, 0.22), mSteel);
        blade.rotation.order = 'YXZ';
        blade.rotation.y = (b * Math.PI) / 4;
        blade.rotation.x = 0.35;
        add(blade, null, false, null, impeller);
      }
      group.add(impeller);
      animators.push((t) => { impeller.rotation.y = t * 5.2; });

      // 顶冠护环与顶部标牌灯帽 (总高 ~4.4m)
      [[-0.58, -0.58], [0.58, -0.58], [-0.58, 0.58], [0.58, 0.58]].forEach(([sx, sz]) => {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), mDark);
        strut.position.set(sx, 3.98, sz);
        add(strut);
      });
      const crownCap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.68, 0.28, 14), mDark);
      crownCap.position.y = 4.26;
      add(crownCap);

      // 4. 侧向水平青色出水法兰接口 (y = 1.6, 沿 +X 轴与管网 pipe 对齐)
      const outPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.65, 14), mFluidDark);
      outPipe.rotation.z = Math.PI / 2;
      outPipe.position.set(0.88, 1.6, 0);
      add(outPipe);
      const outFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 14), mCyanGlow);
      outFlange.rotation.z = Math.PI / 2;
      outFlange.position.set(1.14, 1.6, 0);
      add(outFlange);

      topY = 4.4;
      labelAnchorY = 5.2;

    } else if (type === 'purifier' || type === 'purify_tower') {
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 1.55, 3.6, 10), mSteel);
      spire.position.y = 1.8;
      addSub(spire);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), mEmeraldGlow);
      orb.position.y = 4.2;
      addSub(orb);
      animators.push((t) => { orb.position.y = 4.2 + Math.sin(t * 3) * 0.25; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'portal' || type === 'teleporter') {
      const frame = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.3, 12, 28), mDark);
      frame.position.y = 2.1;
      addSub(frame);
      const vortex = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.16, 10, 24), mPurpleGlow);
      vortex.position.y = 2.1;
      addSub(vortex);
      animators.push((t) => { vortex.rotation.z = t * 3.0; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type.startsWith('sky_')) {
      // 高空灵舟天轨 8 件套专属悬浮模型
      const beam = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, 0.28, D * 0.92), mFluidDark);
      beam.position.y = H * 0.5;
      add(beam);
      const railGlow = new THREE.Mesh(new THREE.BoxGeometry(W * 0.22, 0.14, D * 0.94), mCyanGlow);
      railGlow.position.set(0, H * 0.5 + 0.18, 0);
      add(railGlow);
      if (type === 'sky_launcher' || type === 'sky_transfer' || type === 'sky_loader' || type === 'sky_unloader' || type === 'sky_receiver') {
        const dock = new THREE.Mesh(new THREE.BoxGeometry(W * 0.65, H * 0.35, D * 0.65), mSteel);
        dock.position.y = H * 0.72;
        add(dock);
        const shipHull = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.8, 6), mAmberGlow);
        shipHull.rotation.x = Math.PI / 2;
        shipHull.position.set(0, H * 0.98, 0);
        group.add(shipHull);
        animators.push((t) => {
          shipHull.position.z = Math.sin(t * 2.2) * (D * 0.32);
          shipHull.position.y = H * 0.98 + Math.cos(t * 3.0) * 0.12;
        });
      }
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'belt_sprayer' || type === 'belt_stacker') {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.95, 0.9), type === 'belt_sprayer' ? mBioDark : mDark);
      arch.position.y = 0.88;
      add(arch);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.45, 10), type === 'belt_sprayer' ? mEmeraldGlow : mAmberGlow);
      crown.position.y = 1.5;
      add(crown);
      animators.push((t) => { crown.rotation.y = t * 2.4; });
      topY = H;
      labelAnchorY = 2.0;

    } else if (type === 'fabao_socket') {
      // 法宝共鸣插座 (插入万魂幡/山河社稷图后范围生效)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.85, 0.65, 8), mDark);
      base.position.y = 0.325;
      add(base);
      const trim = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.2, 8), mPurpleGlow);
      trim.position.y = 0.72;
      add(trim);
      [[-0.95, -0.95], [0.95, -0.95], [-0.95, 0.95], [0.95, 0.95]].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.2, 0.24), mSteel);
        pillar.position.set(px, 1.8, pz);
        add(pillar);
      });
      const socketRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.11, 10, 24), mAmberGlow);
      socketRing.rotation.x = Math.PI / 2;
      socketRing.position.y = 2.0;
      add(socketRing);
      const fabaoCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.58), mPurpleGlow);
      fabaoCore.position.y = 2.45;
      group.add(fabaoCore);
      const auraRing = new THREE.Mesh(
        new THREE.RingGeometry(11.6, 12.2, 48),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.42, side: THREE.DoubleSide })
      );
      auraRing.rotation.x = -Math.PI / 2;
      auraRing.position.y = 0.08;
      group.add(auraRing);
      animators.push((t) => {
        fabaoCore.rotation.y = t * 2.2;
        fabaoCore.position.y = 2.45 + Math.sin(t * 2.6) * 0.22;
        socketRing.rotation.z = -t * 1.4;
      });
      topY = 3.2;
      labelAnchorY = 3.8;

    } else if (type === 'crane_distributor') {
      // 千机纸鹤枢 / 千纸鹤控制台 (放大至 3.8m 平台 + 内置储物缓冲仓 + 悬浮双纸鹤信标)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.85, 2.1, 0.7, 8), mDark);
      base.position.y = 0.35;
      add(base);
      const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.75, 0.25, 8), mWood);
      deck.position.y = 0.82;
      add(deck);
      const bufferBox = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.05, 1.35), mSteel);
      bufferBox.position.set(0, 1.45, 0);
      add(bufferBox);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.11, 10, 24), mCyanGlow);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = 2.35;
      add(collar);
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 1.7, 10), mAmberGlow);
      spire.position.y = 2.7;
      add(spire);
      const crane1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.62), mAmberGlow);
      crane1.position.set(0.9, 3.2, 0);
      const crane2 = new THREE.Mesh(new THREE.OctahedronGeometry(0.5), mYellow);
      crane2.position.set(-0.9, 3.5, 0);
      group.add(crane1, crane2);
      animators.push((t) => {
        collar.rotation.z = t * 1.4;
        crane1.position.y = 3.2 + Math.sin(t * 2.8) * 0.3;
        crane1.position.x = Math.cos(t * 1.5) * 1.05;
        crane1.position.z = Math.sin(t * 1.5) * 1.05;
        crane1.rotation.y = t * 2.4;
        crane2.position.y = 3.5 + Math.cos(t * 2.8) * 0.28;
        crane2.position.x = -Math.cos(t * 1.5) * 1.05;
        crane2.position.z = -Math.sin(t * 1.5) * 1.05;
        crane2.rotation.y = -t * 2.4;
      });
      topY = 4.0;
      labelAnchorY = 4.6;

    } else if (type === 'sword_catapult' || type === 'lotus_catcher') {
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.9, 10), mDark);
      ped.position.y = 0.45;
      addSub(ped);
      if (type === 'sword_catapult') {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 2.6), mAmberGlow);
        rail.rotation.x = -0.55;
        rail.position.set(0, 1.5, 0.2);
        addSub(rail);
      } else {
        const lotus = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.22, 8, 18), mYellow);
        lotus.rotation.x = Math.PI / 2;
        lotus.position.y = 1.25;
        addSub(lotus);
        animators.push((t) => { lotus.rotation.z = t * 1.8; });
      }
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;

    } else if (type === 'immortal_roof' || type === 'cloud_corridor' || type === 'floating_platform') {
      if (type === 'immortal_roof') {
        const eave = new THREE.Mesh(new THREE.ConeGeometry(W * 0.72, H * 0.85, 4), mEmeraldGlow);
        eave.rotation.y = Math.PI / 4;
        eave.position.y = H * 0.55;
        add(eave);
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(W * 0.55, 0.35, 0.35), mYellow);
        ridge.position.y = H * 0.96;
        add(ridge);
      } else if (type === 'cloud_corridor') {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, 0.36, D * 0.96), mWood);
        deck.position.y = H - 0.2;
        add(deck);
        const railL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, D * 0.96), mOrange);
        railL.position.set(-W * 0.42, H + 0.15, 0);
        const railR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, D * 0.96), mOrange);
        railR.position.set(W * 0.42, H + 0.15, 0);
        add(railL, railR);
      } else {
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.48, W * 0.32, H * 0.78, 8), mSlate);
        stone.position.y = H * 0.55;
        add(stone);
        const rune = new THREE.Mesh(new THREE.TorusGeometry(W * 0.36, 0.14, 8, 24), mCyanGlow);
        rune.rotation.x = Math.PI / 2;
        rune.position.y = 0.25;
        add(rune);
        animators.push((t) => { rune.rotation.z = t * 1.4; });
      }
      topY = H;
      labelAnchorY = H + 0.7;

    } else if (type === 'thunder_accumulator' || type === 'research_altar' || type === 'sky_extractor') {
      const base = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, H * 0.45, D * 0.86), mFluidDark);
      base.position.y = H * 0.225;
      addSub(base);
      const spireMat = type === 'thunder_accumulator' ? mYellow : (type === 'research_altar' ? mCyanGlow : mEmeraldGlow);
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.18, W * 0.32, H * 0.58, 12), spireMat);
      spire.position.y = H * 0.72;
      addSub(spire);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(W * 0.34, 0.1, 8, 22), mAmberGlow);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = H * 0.86;
      addSub(halo);
      animators.push((t) => { halo.rotation.z = t * 2.4; halo.position.y = H * 0.82 + Math.sin(t * 3) * 0.18; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'artificial_sun' || type === 'particle_collider' || type === 'banner_ejector' || type === 'ascension_silo' || type === 'immortal_receiver') {
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.42, W * 0.48, H * 0.3, 12), mDark);
      ped.position.y = H * 0.15;
      addSub(ped);
      if (type === 'artificial_sun') {
        const sunOrb = new THREE.Mesh(new THREE.SphereGeometry(W * 0.28, 18, 18), mAmberGlow);
        sunOrb.position.y = H * 0.65;
        addSub(sunOrb);
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(W * 0.4, 0.16, 10, 28), mCyanGlow);
        ring1.position.y = H * 0.65;
        addSub(ring1);
        animators.push((t) => { ring1.rotation.x = t * 1.4; ring1.rotation.y = t * 2.1; });
      } else if (type === 'particle_collider') {
        const t1 = new THREE.Mesh(new THREE.TorusGeometry(W * 0.34, 0.18, 10, 28), mPurpleGlow);
        t1.position.set(-W * 0.12, H * 0.6, 0);
        const t2 = new THREE.Mesh(new THREE.TorusGeometry(W * 0.34, 0.18, 10, 28), mCyanGlow);
        t2.position.set(W * 0.12, H * 0.6, 0);
        addSub(t1, t2);
        animators.push((t) => { t1.rotation.y = t * 1.8; t2.rotation.y = -t * 1.8; });
      } else if (type === 'ascension_silo' || type === 'banner_ejector') {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.14, W * 0.24, H * 0.72, 8), mSteel);
        rail.position.y = H * 0.56;
        if (type === 'banner_ejector') rail.rotation.x = -0.35;
        addSub(rail);
        const rocket = new THREE.Mesh(new THREE.ConeGeometry(W * 0.12, H * 0.32, 8), mAmberGlow);
        rocket.position.y = H * 0.85;
        addSub(rocket);
        animators.push((t) => { rocket.position.y = H * 0.75 + ((t * 1.5) % 1.0) * (H * 0.45); });
      } else {
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.44, W * 0.12, H * 0.45, 16), mCyanGlow);
        dish.position.y = H * 0.55;
        addSub(dish);
        const beamCol = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, H * 0.9, 10), mYellow);
        beamCol.position.y = H * 0.95;
        addSub(beamCol);
        animators.push((t) => { dish.rotation.y = t * 1.2; });
      }
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 1.1;

    } else if (type === 'immortal_herb_garden') {
      const ped = new THREE.Mesh(new THREE.BoxGeometry(W * 0.92, H * 0.25, D * 0.92), mDark);
      ped.position.y = H * 0.125;
      addSub(ped);
      const dome = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.36, W * 0.44, H * 0.52, 8), mEmeraldGlow);
      dome.position.y = H * 0.51;
      addSub(dome);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(W * 0.38, 0.14, 10, 24), mCyanGlow);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = H * 0.84;
      addSub(halo);
      animators.push((t) => { halo.rotation.z = t * 1.4; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else if (type === 'beast_immortal_pool') {
      const basin = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, H * 0.38, D * 0.94), mDark);
      basin.position.y = H * 0.19;
      addSub(basin);
      const pool = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.38, W * 0.38, H * 0.2, 18), mPurpleGlow);
      pool.position.y = H * 0.44;
      addSub(pool);
      const crystalRing = new THREE.Mesh(new THREE.TorusGeometry(W * 0.34, 0.16, 10, 24), mAmberGlow);
      crystalRing.rotation.x = Math.PI / 2;
      crystalRing.position.y = H * 0.68;
      addSub(crystalRing);
      animators.push((t) => { crystalRing.rotation.z = -t * 1.6; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.9;

    } else {
      const base = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.8, W * 0.85), H * 0.6, Math.max(1.8, D * 0.85)), mDark);
      base.position.y = H * 0.3;
      addSub(base);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(Math.min(W, D) * 0.32, Math.min(W, D) * 0.36, H * 0.38, 14), mOrange);
      core.position.y = H * 0.79;
      addSub(core);
      animators.push((t) => { core.rotation.y = t * 1.4; });
      fitSubGroup();
      topY = H;
      labelAnchorY = H + 0.8;
    }

    if (isHologram) {
      group.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = false;
          obj.receiveShadow = false;
          obj.material = hologramValidMat;
        }
      });
    }

    // 为带端口的机器在精确边缘位置生成 3D 输入/输出接口法兰 (确保传送带与水管精确对接到接口)
    const isLinear = type === 'conveyor' || type === 'conveyor_mk2' || type === 'conveyor_mk3' || type === 'bd_117' || type === 'bd_118' || type === 'bd_119' || type === 'bd_120' || type === 'vert_conveyor' || type === 'bd_121' || type === 'pipe' || type.startsWith('bd_128') || type.startsWith('bd_129') || type.startsWith('bd_130') || type.startsWith('bd_131') || type.startsWith('bd_132') || type.startsWith('bd_133');
    const isPortMachine = !isHologram && !isLinear && bDef && (bDef.inputPorts !== '-' || bDef.outputPorts !== '-');
    if (isPortMachine) {
      if (bDef.inputPorts && bDef.inputPorts !== '-') {
        const isFluidIn = bDef.inputPorts.includes('Fluid');
        const portY = isFluidIn ? 0.75 : 0.52;
        const pIn = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.42, 0.24),
          isFluidIn ? mCyanGlow : mAmberGlow
        );
        pIn.position.set(0, portY, -D / 2 + 0.08);
        group.add(pIn);
      }
      if (bDef.outputPorts && bDef.outputPorts !== '-') {
        const isFluidOut = bDef.outputPorts.includes('Fluid');
        const portY = isFluidOut ? 0.75 : 0.52;
        const pOut = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.42, 0.24),
          isFluidOut ? mCyanGlow : mEmeraldGlow
        );
        pOut.position.set(0, portY, D / 2 - 0.08);
        group.add(pOut);
      }
    }

    // 机器侧前方展示对应主配方的 3D 产出物料模型
    if (!isHologram && typeof XIUXIAN_BUILDINGS !== 'undefined' && typeof XIUXIAN_RECIPES !== 'undefined') {
      const mappedType = type === 'smelter' ? 'furnace' : (type === 'constructor' ? 'cutter' : type);
      const bDef2 = XIUXIAN_BUILDINGS[mappedType];
      if (bDef2 && bDef2.recipes && bDef2.recipes.length > 0) {
        const rcp = XIUXIAN_RECIPES[bDef2.recipes[0]] || (typeof XIUXIAN_FACILITY_RULES !== 'undefined' ? XIUXIAN_FACILITY_RULES[bDef2.recipes[0]] : null);
        const outKey = rcp && rcp.output ? rcp.output.item : null;
        if (outKey) {
          const itemMesh = createItemMesh3D(outKey);
          itemMesh.position.set(0, topY + 0.55, 0);
          group.add(itemMesh);
          animators.push((t) => {
            itemMesh.rotation.y = t * 1.6;
            itemMesh.position.y = topY + 0.55 + Math.sin(t * 2.5) * 0.08;
          });
        }
      }
    }

    group.userData.topY = topY;
    group.userData.topStackable = bDef ? !!bDef.topStackable : true;

    return { group, animators, labelAnchorY, topY };
  }

  // ------------------------------------------------------------------
  // 3. 同步 worldBuildings 到 3D 场景
  // ------------------------------------------------------------------
  function ensureWorldCoords(bld, idx) {
    if (typeof bld.wy !== 'number') bld.wy = 0;
    if (typeof bld.wx === 'number' && typeof bld.wz === 'number') return;
    // 初始 7 个核心设备在镜头前排成整齐的 2 排 3D 试验场阵列
    const presetSpots = [
      [-10, -4], [-3, -4], [4, -4], [11, -4],
      [-7, 4], [0, 4], [7, 4]
    ];
    if (idx < presetSpots.length) {
      bld.wx = presetSpots[idx][0];
      bld.wz = presetSpots[idx][1];
    } else {
      const xPct = (typeof bld.x === 'number') ? bld.x : (20 + (idx % 6) * 12);
      const yPct = (typeof bld.y === 'number') ? bld.y : 50;
      bld.wx = Math.round(((xPct - 50) * 0.45) * 2) / 2;
      bld.wz = Math.round(((yPct - 50) * 0.35) * 2) / 2;
    }
  }

  function syncBuildings() {
    if (!isInitialized || typeof worldBuildings === 'undefined') return;

    // 清理旧模型
    while (buildingsGroup.children.length > 0) {
      buildingsGroup.remove(buildingsGroup.children[0]);
    }
    buildingMeshMap.clear();
    animatedBuildingEntries.length = 0;
    interactableMeshes.length = 0;
    lastHoverBoxBldId = null;

    // 重建标签容器
    const labelLayer = document.getElementById('world3DLabels');
    if (labelLayer) labelLayer.innerHTML = '';

    worldBuildings.forEach((bld, idx) => {
      ensureWorldCoords(bld, idx);
      const { group, animators, labelAnchorY, topY } = build3DModelForType(bld.type, bld, false);
      group.position.set(bld.wx, bld.wy || 0, bld.wz);
      group.rotation.y = -((bld.rot || 0) * Math.PI) / 180;
      group.userData.bld = bld;

      buildingsGroup.add(group);

      // 仅在开启全标签模式时创建 DOM 标签，默认零多余 DOM 节点以大幅提升渲染帧率
      let labelEl = null;
      if (labelLayer && showAll3DLabels) {
        const tDef = getBuildingTableDef(bld.type);
        const dimBadge = tDef ? `${tDef.dimX || 1}×${tDef.dimY || 1}×${tDef.dimZ !== undefined ? tDef.dimZ : 1}` : '';
        labelEl = document.createElement('div');
        labelEl.className = 'world3d-label absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-150';
        labelEl.innerHTML = `
          <div class="flex items-center space-x-1.5 bg-black/85 border border-[#f5921e]/80 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span class="text-[11px] font-bold text-amber-300 font-mono">${bld.tagTitle || bld.name}</span>
            ${dimBadge ? `<span class="text-[9px] text-cyan-300 bg-cyan-950/70 px-1 rounded font-mono">${dimBadge}</span>` : ''}
            <span class="text-[9px] text-white/60 bg-white/10 px-1 rounded">${bld.power || '0 MW'}</span>
          </div>
        `;
        labelLayer.appendChild(labelEl);
      }

      const entry = { group, bld, animators, labelAnchorY: (bld.wy || 0) + labelAnchorY, topY, labelEl };
      buildingMeshMap.set(bld.id, entry);
      if (animators.length > 0) animatedBuildingEntries.push(entry);
    });

    applyFloorVisibility();
    rebuildLogisticsFX();
    worldVersion++;
    shadowDirty = true;
    raycastDirty = true;
  }

  function rebuildLogisticsFX() {
    if (!scene || typeof worldBuildings === 'undefined') return;
    if (window.WorldLogisticsFX && typeof window.WorldLogisticsFX.rebuild === 'function') {
      window.WorldLogisticsFX.rebuild({
        THREE,
        scene,
        worldBuildings,
        getMat,
        stdMat
      });
    }
  }

  function updateLogisticsFX(nowTime) {
    if (window.WorldLogisticsFX && typeof window.WorldLogisticsFX.update === 'function') {
      window.WorldLogisticsFX.update(nowTime, camState.target.x, camState.target.z, camState.distance, _frustum);
    }
  }

  function updateDistanceCulling(force) {
    const cx = camState.target.x;
    const cz = camState.target.z;
    const dist = camState.distance;
    if (!force && !cullDirty && Math.abs(cx - lastCullX) < 12 && Math.abs(cz - lastCullZ) < 12 && Math.abs(dist - lastCullDist) < 40) {
      return;
    }
    cullDirty = false;
    lastCullX = cx;
    lastCullZ = cz;
    lastCullDist = dist;
    const hasFrustum = !!(camera && _frustum && _projScreenMat && _cullSphere);
    if (hasFrustum) {
      camera.updateMatrixWorld();
      _projScreenMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      if (typeof _frustum.setFromProjectionMatrix === 'function') {
        _frustum.setFromProjectionMatrix(_projScreenMat);
      } else if (typeof _frustum.setFromMatrix === 'function') {
        _frustum.setFromMatrix(_projScreenMat);
      }
    }
    const isOverview = dist > 300;
    buildingMeshMap.forEach((entry) => {
      const floorVis = isBuildingVisibleInFloorMode(entry.bld);
      if (!floorVis) {
        entry.group.visible = false;
        if (entry.labelEl) entry.labelEl.style.opacity = '0';
        return;
      }
      const wx = entry.bld.wx || 0;
      const wy = entry.bld.wy || 0;
      const wz = entry.bld.wz || 0;
      if (hasFrustum) {
        const r = (entry.bld && entry.bld.slabW) ? Math.max(entry.bld.slabW, entry.bld.slabD || entry.bld.slabW) * 0.75 : 10.0;
        _cullSphere.center.set(wx, wy + 3, wz);
        _cullSphere.radius = r;
        if (!_frustum.intersectsSphere(_cullSphere)) {
          entry.group.visible = false;
          if (entry.labelEl) entry.labelEl.style.opacity = '0';
          return;
        }
      }
      if (isOverview) {
        const isBeltHighway = entry.bld && entry.bld.id && entry.bld.id.startsWith('bld_bh_');
        entry.group.visible = isBeltHighway || !isOverviewLodHidden(entry.bld.type);
      } else {
        entry.group.visible = Math.abs(wx - cx) <= 260 && Math.abs(wz - cz) <= 260;
      }
    });
    raycastNearbyMeshes = visibleInteractableMeshes.filter((m) => {
      const bld = m.userData && m.userData.bld;
      if (!bld) return true;
      return Math.abs((bld.wx || 0) - cx) <= 150 && Math.abs((bld.wz || 0) - cz) <= 150;
    });
  }

  function isBuildingVisibleInFloorMode(bld) {
    const wy = bld.wy || 0;
    if (visibleFloorMode === '1f') return wy < 12;
    if (visibleFloorMode === '2f') return wy < 26;
    if (visibleFloorMode === '3f') return wy >= 26;
    return true;
  }

  function applyFloorVisibility() {
    buildingMeshMap.forEach((entry) => {
      const vis = isBuildingVisibleInFloorMode(entry.bld);
      entry.group.visible = vis;
      if (!vis && entry.labelEl) {
        entry.labelEl.style.opacity = '0';
      }
    });
    visibleInteractableMeshes = interactableMeshes.filter((m) => {
      const bld = m.userData && m.userData.bld;
      return !bld || isBuildingVisibleInFloorMode(bld);
    });
    if (hoveredHit && hoveredHit.bld && !isBuildingVisibleInFloorMode(hoveredHit.bld)) {
      hoveredHit = null;
      if (hoverBoxHelper) hoverBoxHelper.visible = false;
    }
    updateDistanceCulling(true);
  }

  function cycleFloorView() {
    const order = ['all', '1f', '2f', '3f'];
    const labels = {
      all: '楼层: 全部(1-3F)',
      '1f': '楼层: 仅 1F',
      '2f': '楼层: 1-2F',
      '3f': '楼层: 仅 3F'
    };
    const nextIdx = (order.indexOf(visibleFloorMode) + 1) % order.length;
    visibleFloorMode = order[nextIdx];
    applyFloorVisibility();
    if (typeof showNotification === 'function') {
      showNotification(`已切换至【${labels[visibleFloorMode]}】`);
    }
    return { mode: visibleFloorMode, label: labels[visibleFloorMode] };
  }

  // ------------------------------------------------------------------
  // 4. 全息建造预览 (3D)
  // ------------------------------------------------------------------
  function updateHologram(buildingKey) {
    if (!isInitialized) return;
    if (currentHologramKey !== buildingKey || !hologramGroup) {
      if (hologramGroup) scene.remove(hologramGroup);
      const built = build3DModelForType(buildingKey, null, true);
      hologramGroup = built.group;
      hologramGroup.visible = false;
      scene.add(hologramGroup);
      currentHologramKey = buildingKey;
    }
    const affordable = (typeof canAffordBuild === 'function') ? canAffordBuild(buildingKey) : true;
    const blocked = !!window._world3DPlacementBlockedReason;
    const mat = (affordable && !blocked) ? hologramValidMat : hologramInvalidMat;
    hologramGroup.traverse((obj) => {
      if (obj.isMesh) obj.material = mat;
    });
  }

  function hideHologram() {
    if (hologramGroup) hologramGroup.visible = false;
  }

  // ------------------------------------------------------------------
  // 5. 相机、输入与 3D 射线拾取
  // ------------------------------------------------------------------
  function updateCameraTransform() {
    if (!camera) return;
    const cosP = Math.cos(camState.pitch);
    const sinP = Math.sin(camState.pitch);
    const sinY = Math.sin(camState.yaw);
    const cosY = Math.cos(camState.yaw);

    camera.position.set(
      camState.target.x + camState.distance * cosP * sinY,
      camState.target.y + camState.distance * sinP,
      camState.target.z + camState.distance * cosP * cosY
    );
    camera.lookAt(camState.target);
    cullDirty = true;

    // 同步顶部 HUD 罗盘方向
    const compassTrack = document.getElementById('compassTrack');
    if (compassTrack) {
      let deg = ((camState.yaw * 180) / Math.PI) % 360;
      if (deg > 180) deg -= 360;
      if (deg < -180) deg += 360;
      compassTrack.style.transform = `translateX(${-deg * 1.6}px)`;
    }
  }

  function isModalBlockingWorld() {
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return true;
    return false;
  }

  function bindEvents(canvas) {
    window.addEventListener('resize', () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      keysPressed[e.code] = true;
      if (!isModalBlockingWorld() && (typeof isBuildPlacingMode !== 'boolean' || !isBuildPlacingMode)) {
        if (e.code === 'Digit1') cast3DGhostDomain();
        else if (e.code === 'Digit2') cast3DShanheWall();
      }
      if (externalCameraControl) return;
      if (e.code === 'Home') {
        resetCamera();
      } else if (e.code === 'KeyV' && !isModalBlockingWorld()) {
        toggleFollowAvatar();
      }
      if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode) {
        if (e.code === 'BracketRight' || e.code === 'PageUp') {
          manualStackY = Math.min(36, Math.round((manualStackY + HEIGHT_UNIT) * 10) / 10);
          raycastDirty = true;
        } else if (e.code === 'BracketLeft' || e.code === 'PageDown') {
          manualStackY = Math.max(0, Math.round((manualStackY - HEIGHT_UNIT) * 10) / 10);
          raycastDirty = true;
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      keysPressed[e.code] = false;
      if (e.code === 'KeyE') {
        getExplorerState().holdEProgress = 0;
        const bar = document.getElementById('worldPoiHoldBar');
        if (bar) bar.style.width = '0%';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (externalCameraControl) return;
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycastDirty = true;

      if (isOrbitDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        if (isPanDragging) {
          setFollowAvatarMode(false);
          const panScale = camState.distance * 0.0014;
          const sinY = Math.sin(camState.yaw);
          const cosY = Math.cos(camState.yaw);
          camState.target.x += (-cosY * dx - sinY * dy) * panScale;
          camState.target.z += (sinY * dx - cosY * dy) * panScale;
          camState.target.x = Math.max(-980, Math.min(980, camState.target.x));
          camState.target.z = Math.max(-980, Math.min(980, camState.target.z));
          const es = getExplorerState();
          es.wx = camState.target.x;
          es.wz = camState.target.z;
          if (typeof window !== 'undefined' && window.CombatPlayer && typeof window.CombatPlayer.getState === 'function') {
            const pst = window.CombatPlayer.getState();
            if (pst && pst.pos) { pst.pos.x = es.wx; pst.pos.z = es.wz; }
          }
        } else {
          camState.yaw -= dx * 0.0055;
          camState.pitch = Math.max(0.14, Math.min(1.32, camState.pitch + dy * 0.005));
        }
        updateCameraTransform();
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    document.addEventListener('mousedown', (e) => {
      if (externalCameraControl) return;
      if (isModalBlockingWorld()) return;
      if (e.target.closest('button, input, select, a, .hud-panel, #dspBuildHotbarRoot, #combatHudBar, #sysActionsContainer, #buildModeHudOverlay, #dismantleConsoleStrip, #buildModal, #craftModal, #invModal, #machineModal, #storageBoxModal, #techTreeModal, #jinShenModal, #fabaoModal, #codexModal, #hubMilestoneModal')) {
        return;
      }

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      dragDistance = 0;

      // 中键或 Shift+拖拽 平移镜头；右键/左键拖拽旋转视角
      if (e.button === 1 || (e.shiftKey && (e.button === 0 || e.button === 2))) {
        e.preventDefault();
        isOrbitDragging = true;
        isPanDragging = true;
      } else if (e.button === 2 && !isBuildPlacingMode && !isDismantleMode) {
        isOrbitDragging = true;
        isPanDragging = false;
      } else if (e.button === 0 && !isBuildPlacingMode && !isDismantleMode) {
        isOrbitDragging = true;
        isPanDragging = false;
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (externalCameraControl) return;
      const wasDragging = isOrbitDragging;
      const moved = dragDistance;
      isOrbitDragging = false;
      isPanDragging = false;

      if (wasDragging && moved >= 6) {
        window._world3DSuppressClick = true;
      }

      // 如果是短按左键点击在 3D 建筑上，打开对应的机器/配方测试面板！
      if (wasDragging && e.button === 0 && moved < 6 && !isBuildPlacingMode && !isDismantleMode && !isModalBlockingWorld()) {
        if (hoveredHit && hoveredHit.bld) {
          window._world3DSuppressClick = true;
          handle3DBuildingClick(hoveredHit);
        }
      }
    });

    document.addEventListener('contextmenu', (e) => {
      if (externalCameraControl) {
        if (!isModalBlockingWorld() && !e.target.closest('button, input')) e.preventDefault();
        return;
      }
      if (!isModalBlockingWorld() && !e.target.closest('button, input')) {
        e.preventDefault();
      }
    });

    document.addEventListener('wheel', (e) => {
      if (externalCameraControl) return;
      if (isModalBlockingWorld()) return;
      if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode) return; // 建造模式下滚轮交给旋转逻辑
      if (e.target.closest('#buildModal, #craftModal, #invModal, #machineModal, #codexModal, #techTreeModal, #jinShenModal, #fabaoModal')) return;

      camState.distance = Math.max(
        camState.minDist,
        Math.min(camState.maxDist, camState.distance + e.deltaY * 0.02)
      );
      updateCameraTransform();
    }, { passive: true });
  }

  function openLogisticsConfigModal(bld, mode) {
    if (typeof closeOtherModals === 'function') closeOtherModals('logisticsConfigModal');
    const modal = document.getElementById('logisticsConfigModal');
    const titleEl = document.getElementById('logisticsModalTitle');
    const bodyEl = document.getElementById('logisticsModalBody');
    if (!modal || !bodyEl) return;

    bld.config = bld.config || { left: '任意物料', center: '任意物料', right: '溢出放行', valveOpen: true, flowRate: 60, beltSpeed: 60, beltReverse: false, genActive: true, portalTarget: '东海灵矿区' };
    const bDef = getBuildingTableDef(bld.type);

    if (mode === 'struct') {
      if (titleEl) titleEl.innerText = `${bld.name || '结构积木'} · 积木属性`;
      const dimTxt = bDef ? `${bDef.dimX} × ${bDef.dimY} × ${bDef.dimZ} 格` : '1 × 1 × 1 格';
      const topTxt = (bDef && bDef.topStackable) ? '<span class="text-emerald-300">允许顶部堆叠</span>' : '<span class="text-rose-300">顶部不可放置</span>';
      bodyEl.innerHTML = `
        <div class="space-y-2 bg-black/40 border border-white/10 rounded p-3">
          <div class="flex justify-between"><span class="text-slate-400">占用格子尺寸:</span><b class="text-cyan-300 font-mono">${dimTxt}</b></div>
          <div class="flex justify-between"><span class="text-slate-400">当前堆叠高度:</span><b class="text-amber-300 font-mono">+${(bld.wy || 0).toFixed(1)} m</b></div>
          <div class="flex justify-between"><span class="text-slate-400">顶部承托规则:</span><b>${topTxt}</b></div>
        </div>
        ${(bDef && bDef.topStackable) ? `<button onclick="document.getElementById('logisticsConfigModal').classList.add('hidden'); if(typeof enterBuildPlacingMode==='function') enterBuildPlacingMode('${bld.type}');" class="w-full py-2 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-bold cursor-pointer">🧱 继续向顶部叠放同类积木</button>` : ''}
      `;
    } else if (mode === 'conveyor') {
      if (titleEl) titleEl.innerText = `${bld.name || '传送带'} · 物流带参数`;
      bodyEl.innerHTML = `
        <div class="flex items-center justify-between bg-black/40 border border-white/10 rounded px-3 py-2">
          <span>传送带运力档位</span>
          <select onchange="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.config.beltSpeed=Number(this.value);}" class="bg-[#111927] border border-cyan-500/40 rounded px-2 py-1 text-cyan-200 font-mono">
            ${[60, 120, 240].map(v => `<option value="${v}" ${bld.config.beltSpeed === v ? 'selected' : ''}>${v} 个/min</option>`).join('')}
          </select>
        </div>
        <button onclick="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.rot=((b.rot||0)+180)%360; b.config.beltReverse=!b.config.beltReverse; if(typeof renderWorldBuildings==='function') renderWorldBuildings(); window.World3D.openLogisticsConfig(b,'conveyor');}" class="w-full py-2 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 font-bold cursor-pointer">
          🔄 反转传送带方向 (当前: ${bld.rot || 0}°)
        </button>
      `;
    } else if (mode === 'generator') {
      const genMW = bDef ? Math.abs(bDef.power || 0) : 50;
      if (titleEl) titleEl.innerText = `${bld.name || '发电机'} · 电网发电工况`;
      bodyEl.innerHTML = `
        <div class="flex items-center justify-between bg-black/40 border border-amber-500/30 rounded p-3">
          <span>发电机运行状态</span>
          <button onclick="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.config.genActive=!b.config.genActive; window.World3D.openLogisticsConfig(b,'generator');}" class="px-3 py-1 rounded font-bold cursor-pointer ${bld.config.genActive ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200' : 'bg-rose-500/25 border border-rose-400 text-rose-200'}">
            ${bld.config.genActive ? `⚡ 发电中 (+${genMW} MW)` : '○ 已停机 (0 MW)'}
          </button>
        </div>
        <div class="text-slate-400 bg-black/30 rounded p-2.5">供电接入全局修仙电网，支撑采矿、精炼与法宝设施运转。</div>
      `;
    } else if (mode === 'teleporter') {
      if (titleEl) titleEl.innerText = `${bld.name || '跨区传送门'} · 空间坐标锚定`;
      const zones = ['东海灵矿区', '南荒赤铜谷', '中州炼宝宗坛', '北冥幽冥秘境'];
      bodyEl.innerHTML = `
        <div class="flex items-center justify-between bg-black/40 border border-purple-500/40 rounded px-3 py-2">
          <span>目标跨区锚点</span>
          <select onchange="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.config.portalTarget=this.value; if(typeof showNotification==='function') showNotification('传送门已锁定: '+this.value);}" class="bg-[#111927] border border-purple-400/50 rounded px-2 py-1 text-purple-200">
            ${zones.map(z => `<option value="${z}" ${bld.config.portalTarget === z ? 'selected' : ''}>${z}</option>`).join('')}
          </select>
        </div>
        <button onclick="if(typeof showNotification==='function') showNotification('🌀 空间阵纹已激活，目标: ${bld.config.portalTarget}');" class="w-full py-2 rounded bg-purple-500/25 hover:bg-purple-500/40 border border-purple-400/60 text-purple-200 font-bold cursor-pointer">
          🌀 激活跨区传送通道 (功耗 140 MW)
        </button>
      `;
    } else if (mode === 'desk') {
      if (titleEl) titleEl.innerText = `${bld.name || '置物桌 (小桌板)'} · 桌面交互`;
      bodyEl.innerHTML = `
        <div class="bg-black/40 border border-white/10 rounded p-3 text-slate-300 leading-relaxed">
          小桌板顶部支持放置物品或直接堆叠小型设备（如储藏盒、操作台、培养皿）。
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="document.getElementById('logisticsConfigModal').classList.add('hidden'); if(typeof openStorageBoxModal==='function') openStorageBoxModal();" class="py-2 px-3 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 font-bold cursor-pointer">
            📦 打开桌面存取箱
          </button>
          <button onclick="document.getElementById('logisticsConfigModal').classList.add('hidden'); if(typeof enterBuildPlacingMode==='function') enterBuildPlacingMode('storage_box');" class="py-2 px-3 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-bold cursor-pointer">
            🧱 在桌面堆叠储藏盒
          </button>
        </div>
      `;
    } else if (mode === 'pipe') {
      if (titleEl) titleEl.innerText = `${bld.name || '水管'} · 流体管网控制`;
      bodyEl.innerHTML = `
        <div class="flex items-center justify-between bg-black/40 border border-cyan-500/30 rounded p-3">
          <span>管道阀门状态</span>
          <button onclick="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.config.valveOpen=!b.config.valveOpen; window.World3D.openLogisticsConfig(b,'pipe');}" class="px-3 py-1 rounded font-bold cursor-pointer ${bld.config.valveOpen ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200' : 'bg-rose-500/25 border border-rose-400 text-rose-200'}">
            ${bld.config.valveOpen ? '● 开启导通' : '○ 截断关闭'}
          </button>
        </div>
        <div class="flex items-center justify-between bg-black/40 border border-white/10 rounded p-3">
          <span>当前设计流量上限</span>
          <span class="font-mono text-cyan-300 font-bold">${bld.config.valveOpen ? bld.config.flowRate : 0} m³/min</span>
        </div>
      `;
    } else {
      if (titleEl) titleEl.innerText = `${bld.name || '分流/合流器'} · 端口分拣规则`;
      const opts = ['任意物料', '溢出放行', '玄铁矿', '玄铁锭', '赤铜矿', '煤炭', '禁用端口'];
      const makeSel = (side, label) => `
        <div class="flex items-center justify-between bg-black/40 border border-white/10 rounded px-3 py-2">
          <span class="text-slate-300 font-bold">${label}</span>
          <select onchange="const b=worldBuildings.find(x=>x.id==='${bld.id}'); if(b){b.config['${side}']=this.value; if(typeof showNotification==='function') showNotification('已更新端口规则: '+this.value);}" class="bg-[#111927] border border-cyan-500/40 rounded px-2 py-1 text-cyan-200 font-mono">
            ${opts.map(o => `<option value="${o}" ${bld.config[side] === o ? 'selected' : ''}>${o}</option>`).join('')}
          </select>
        </div>
      `;
      bodyEl.innerHTML = makeSel('left', '左侧输出口') + makeSel('center', '正前输出口') + makeSel('right', '右侧输出口');
    }
    modal.classList.remove('hidden');
  }

  function handle3DBuildingClick(hit) {
    const id = hit.interactId;
    if (id === 'storage_box' || id === 'bd_114' || id === 'bd_115') {
      if (typeof openStorageBoxModal === 'function') openStorageBoxModal();
      return;
    }
    if (id === 'handcraft') {
      if (typeof openCraftingModal === 'function') openCraftingModal();
      return;
    }
    if (id === 'alchemy_table' || id === 'tribulation_table') {
      if (typeof toggleFabaoModal === 'function') toggleFabaoModal();
      return;
    }
    if (id === 'fuel_generator' || id === 'power_burner' || id === 'wind_generator') {
      openLogisticsConfigModal(hit.bld, 'generator');
      return;
    }
    if (id === 'teleporter' || id === 'portal') {
      openLogisticsConfigModal(hit.bld, 'teleporter');
      return;
    }
    if (id.startsWith('foundation') || id === 'bd_108' || id === 'bd_109' || id === 'bd_112') {
      openLogisticsConfigModal(hit.bld, 'struct');
      return;
    }
    if (id === 'conveyor' || id === 'conveyor_mk2' || id === 'conveyor_mk3' || id === 'bd_117' || id === 'bd_118' || id === 'bd_119' || id === 'bd_120' || id === 'vert_conveyor' || id === 'bd_121') {
      openLogisticsConfigModal(hit.bld, 'conveyor');
      return;
    }
    if (id === 'storage_desk' || id === 'bd_154') {
      openLogisticsConfigModal(hit.bld, 'desk');
      return;
    }
    if (id === 'conveyor_limiter') {
      if (typeof closeOtherModals === 'function') closeOtherModals('conveyorLimiterModal');
      const modal = document.getElementById('conveyorLimiterModal');
      const iframe = document.getElementById('conveyorLimiterIframe');
      if (iframe && !iframe.getAttribute('src')) {
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      }
      if (modal) modal.classList.remove('hidden');
      return;
    }
    if (id === 'splitter' || id === 'merger' || id === 'bd_122' || id === 'bd_123' || id === 'bd_124' || id === 'bd_125' || id === 'bd_126' || id === 'bd_161' || id === 'bd_162') {
      openLogisticsConfigModal(hit.bld, 'splitter');
      return;
    }
    if (id === 'pipe' || id === 'bd_128' || id === 'bd_129' || id === 'bd_130' || id === 'bd_131' || id === 'bd_132' || id === 'bd_133') {
      openLogisticsConfigModal(hit.bld, 'pipe');
      return;
    }
    if (id.startsWith('smelt_slot_empty_') && typeof openSmeltChamberInstaller === 'function') {
      openSmeltChamberInstaller(parseInt(id.replace('smelt_slot_empty_', ''), 10) || 0);
      return;
    }
    if (id === 'fluid_hub_slot' && typeof cycleFluidHubPlugin === 'function') {
      cycleFluidHubPlugin();
      return;
    }
    if (id === 'bio_base_slot' && typeof cycleBioBasePlugin === 'function') {
      cycleBioBasePlugin();
      return;
    }
    if (bld && bld.type === 'fabao_socket' && typeof openFabaoModal === 'function') {
      openFabaoModal();
      return;
    }
    if (typeof openMachineHUD === 'function') {
      openMachineHUD(id);
    }
  }

  function resetCamera() {
    camState.target.set(3, 13, 2);
    camState.yaw = -0.42;
    camState.pitch = 0.44;
    camState.distance = 68;
    updateCameraTransform();
    if (typeof showNotification === 'function') {
      showNotification('【3D 视角已重置】鼠标拖拽旋转，中键/Shift+拖拽平移，点击机器打开配方测试');
    }
  }

  // ------------------------------------------------------------------
  // 6. 每帧更新与渲染循环
  // ------------------------------------------------------------------

  function updateRaycastAndHologram() {
    if (isModalBlockingWorld()) {
      hideHologram();
      return;
    }

    raycaster.setFromCamera(mouseNDC, camera);

    // A. 建造模式：3D 积木搭建、资源节点校验、带处理器/母座插槽吸附、体积占格校验
    if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode && groundPlane) {
      const placeKey = (typeof currentPlacingBuildingKey !== 'undefined') ? currentPlacingBuildingKey : 'foundation';
      window._world3DSlotSnapTarget = null;
      window._world3DPlacementBlockedReason = null;

      const nodeHits = resourceNodeMeshes.length > 0 ? raycaster.intersectObjects(resourceNodeMeshes, false) : [];
      const bldHits = raycaster.intersectObjects(raycastNearbyMeshes.length ? raycastNearbyMeshes : visibleInteractableMeshes, false);
      const groundHits = raycaster.intersectObject(groundPlane);
      const subModeEl = document.getElementById('buildPlacingSubMode');
      const placeDef = getBuildingTableDef(placeKey);
      const rule = placeDef ? (placeDef.placementRule || (placeDef.canPlaceOnRawMap ? 'raw_or_surface' : 'surface_only')) : 'raw_or_surface';
      const stepGrid = GRID_UNIT;
      const rotDeg = (typeof placingRotationAngle !== 'undefined') ? placingRotationAngle : 0;

      const applySubModeBadge = (txt, allowed) => {
        if (!subModeEl) return;
        subModeEl.innerText = txt;
        subModeEl.className = allowed
          ? 'text-[10px] bg-black/75 border border-emerald-400/60 text-emerald-200 px-2.5 py-0.5 rounded-full mb-2 shadow'
          : 'text-[10px] bg-rose-950/90 border border-rose-500/80 text-rose-200 px-2.5 py-0.5 rounded-full mb-2 shadow font-bold';
      };

      const findNearbyNode = (pt) => {
        if (!pt) return null;
        let best = null;
        let bestDist = 4.0;
        for (let i = 0; i < resourceNodes.length; i++) {
          const nd = resourceNodes[i];
          const d = Math.hypot(pt.x - nd.x, pt.z - nd.z);
          if (d <= bestDist) {
            bestDist = d;
            best = nd;
          }
        }
        return best;
      };

      // 特例 1：矿机 (BD_135) / 抽水机 (BD_134) 强制对准原始地图矿脉/水源节点
      if ((rule === 'ore_node' || rule === 'water_node') && hologramGroup) {
        const directNode = (nodeHits.length > 0 && nodeHits[0].object.userData.resourceNode) ? nodeHits[0].object.userData.resourceNode : null;
        const groundPt = groundHits.length > 0 ? groundHits[0].point : (bldHits.length > 0 ? bldHits[0].point : null);
        const matchedNode = directNode || findNearbyNode(groundPt);

        let snapX = 0, snapY = 0, snapZ = 0, evalRes = null;
        if (matchedNode && !(bldHits.length > 0 && matchedNode.kind !== rule)) {
          snapX = matchedNode.x;
          snapY = 0;
          snapZ = matchedNode.z;
          evalRes = evaluatePlacementRule(placeKey, { resourceNode: matchedNode, onRawGround: true, wx: snapX, wy: snapY, wz: snapZ, rotDeg });
        } else if (bldHits.length > 0) {
          const hit = bldHits[0];
          snapX = Math.round(hit.point.x / stepGrid) * stepGrid;
          snapY = Math.round((hit.point.y) * 100) / 100;
          snapZ = Math.round(hit.point.z / stepGrid) * stepGrid;
          evalRes = evaluatePlacementRule(placeKey, {
            targetBld: hit.object.userData.bld,
            resourceNode: findNearbyNode(hit.point),
            onRawGround: false,
            wx: snapX,
            wy: snapY,
            wz: snapZ,
            rotDeg
          });
        } else if (groundHits.length > 0) {
          const pt = groundHits[0].point;
          snapX = Math.round(pt.x / stepGrid) * stepGrid;
          snapY = 0;
          snapZ = Math.round(pt.z / stepGrid) * stepGrid;
          evalRes = evaluatePlacementRule(placeKey, { resourceNode: matchedNode, onRawGround: true, wx: snapX, wy: snapY, wz: snapZ, rotDeg });
        }

        if (evalRes) {
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY + 0.02, snapZ);
          hologramGroup.rotation.y = -(rotDeg * Math.PI) / 180;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.statusText, evalRes.allowed);
        } else {
          hideHologram();
        }
        return;
      }

      if (bldHits.length > 0 && hologramGroup) {
        const hit = bldHits[0];
        const targetBld = hit.object.userData.bld;
        const targetEntry = targetBld ? buildingMeshMap.get(targetBld.id) : null;
        const targetGroup = targetEntry ? targetEntry.group : null;

        // 1. 复合母座与带处理器插槽吸附 (冶炼舱/炼丹炉 -> 灵力引擎/金乌聚变/宝塔叠炉；流体插件 -> 流体中枢；生物插件 -> 营养基座；带处理器 -> 传送带)
        if (targetBld && targetGroup && ['power_engine', 'fusion_reactor', 'smelt_chamber', 'bd_163', 'alchemy_furnace_mk2', 'furnace_mk2'].includes(targetBld.type) && rule === 'slot_thermal') {
          const isBaseDeck = targetBld.type === 'power_engine' || targetBld.type === 'fusion_reactor';
          const localX = hit.point.x - targetGroup.position.x;
          const slotIdx = isBaseDeck ? (localX < -1.2 ? 0 : (localX > 1.2 ? 2 : 1)) : 1;
          const sx = isBaseDeck ? (slotIdx - 1) * 2.24 : 0;
          const snapX = targetGroup.position.x + sx;
          const snapY = targetGroup.position.y + (targetGroup.userData.topY || 4.0);
          const snapZ = targetGroup.position.z;
          const evalRes = evaluatePlacementRule(placeKey, { targetBld, targetTopStackable: true, hitNormalY: 1, onRawGround: false, wx: snapX, wy: snapY, wz: snapZ, rotDeg });
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = evalRes.allowed ? { type: 'engine_chamber', slotIndex: slotIdx } : null;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.allowed ? evalRes.statusText : evalRes.statusText, evalRes.allowed);
          return;
        }
        if (targetBld && targetGroup && targetBld.type === 'fluid_hub' && rule === 'slot_fluid') {
          const localZ = hit.point.z - targetGroup.position.z;
          const slotIdx = localZ < 0 ? 0 : 1;
          const szOff = slotIdx === 0 ? -1.6 : 1.6;
          const snapX = targetGroup.position.x;
          const snapY = targetGroup.position.y + 4.16;
          const snapZ = targetGroup.position.z + szOff;
          const evalRes = evaluatePlacementRule(placeKey, { targetBld, targetTopStackable: true, hitNormalY: 1, onRawGround: false, wx: snapX, wy: snapY, wz: snapZ, rotDeg });
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = evalRes.allowed ? { type: 'fluid_hub', slotIndex: slotIdx } : null;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.allowed ? `🔌 插槽吸附: 流体处理中枢 #${slotIdx + 1}` : evalRes.statusText, evalRes.allowed);
          return;
        }
        if (targetBld && targetGroup && targetBld.type === 'bio_base' && rule === 'slot_bio') {
          const snapX = targetGroup.position.x;
          const snapY = targetGroup.position.y + (targetGroup.userData.topY || 2.0);
          const snapZ = targetGroup.position.z;
          const evalRes = evaluatePlacementRule(placeKey, { targetBld, targetTopStackable: true, hitNormalY: 1, onRawGround: false, wx: snapX, wy: snapY, wz: snapZ, rotDeg });
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = evalRes.allowed ? { type: 'bio_base' } : null;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.statusText, evalRes.allowed);
          return;
        }
        if (targetBld && targetGroup && ['storage_box', 'bd_113', 'bd_114', 'bd_115'].includes(targetBld.type) && rule === 'slot_storage') {
          const snapX = targetGroup.position.x;
          const snapY = targetGroup.position.y + (targetGroup.userData.topY || 2.0);
          const snapZ = targetGroup.position.z;
          const evalRes = evaluatePlacementRule(placeKey, { targetBld, targetTopStackable: true, hitNormalY: 1, onRawGround: false, wx: snapX, wy: snapY, wz: snapZ, rotDeg, checkOverlap: false });
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = evalRes.allowed ? { type: 'slot_storage', boxId: targetBld.id } : null;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.statusText, evalRes.allowed);
          return;
        }
        if (targetBld && targetGroup && isConveyorType(targetBld.type) && rule === 'belt_processor') {
          const snapX = targetGroup.position.x;
          const snapY = targetGroup.position.y + 0.35;
          const snapZ = targetGroup.position.z;
          const evalRes = evaluatePlacementRule(placeKey, { targetBld, targetTopStackable: false, hitNormalY: 1, onRawGround: false, wx: snapX, wy: snapY, wz: snapZ, rotDeg: targetBld.rot || rotDeg, checkOverlap: false });
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = evalRes.allowed ? { type: 'belt_processor', beltId: targetBld.id } : null;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.statusText, evalRes.allowed);
          return;
        }

        // 2. 积木顶面堆叠 / 侧面贴合 (全面校验 topStackable、surface_only 与体积占格)
        if (targetGroup) {
          const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 1, 0);
          let snapX, snapY, snapZ, evalCtx;
          if (n.y > 0.45) {
            snapY = Math.round((targetGroup.position.y + (targetGroup.userData.topY || 2.0)) * 100) / 100;
            snapX = Math.round(hit.point.x / stepGrid) * stepGrid;
            snapZ = Math.round(hit.point.z / stepGrid) * stepGrid;
            evalCtx = {
              targetBld,
              targetTopStackable: !!targetGroup.userData.topStackable,
              hitNormalY: n.y,
              onRawGround: false,
              wx: snapX,
              wy: snapY,
              wz: snapZ,
              rotDeg
            };
          } else {
            snapY = targetGroup.position.y;
            snapX = Math.round((hit.point.x + n.x * stepGrid) / stepGrid) * stepGrid;
            snapZ = Math.round((hit.point.z + n.z * stepGrid) / stepGrid) * stepGrid;
            const sup = findSupportSurfaceAt(snapX, snapY, snapZ);
            evalCtx = {
              targetBld: sup ? sup.bld : targetBld,
              targetTopStackable: sup && sup.def ? !!sup.def.topStackable : true,
              hitNormalY: sup ? 1 : 0,
              onRawGround: !sup,
              wx: snapX,
              wy: snapY,
              wz: snapZ,
              rotDeg
            };
          }
          const evalRes = evaluatePlacementRule(placeKey, evalCtx);
          window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = -(rotDeg * Math.PI) / 180;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          applySubModeBadge(evalRes.statusText, evalRes.allowed);
          return;
        }
      }

      if (groundHits.length > 0 && hologramGroup) {
        const pt = groundHits[0].point;
        const snapX = Math.round(pt.x / stepGrid) * stepGrid;
        const snapZ = Math.round(pt.z / stepGrid) * stepGrid;
        const snapY = manualStackY;
        const sup = snapY > 0.05 ? findSupportSurfaceAt(snapX, snapY, snapZ) : null;
        const evalRes = evaluatePlacementRule(placeKey, {
          targetBld: sup ? sup.bld : null,
          targetTopStackable: sup && sup.def ? !!sup.def.topStackable : true,
          hitNormalY: sup ? 1 : 0,
          onRawGround: !sup,
          resourceNode: findNearbyNode(pt),
          wx: snapX,
          wy: snapY,
          wz: snapZ,
          rotDeg
        });
        window._world3DPlacementBlockedReason = evalRes.allowed ? null : evalRes.reason;
        updateHologram(placeKey);
        hologramGroup.visible = true;
        hologramGroup.position.set(snapX, snapY + 0.02, snapZ);
        hologramGroup.rotation.y = -(rotDeg * Math.PI) / 180;
        window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
        applySubModeBadge(evalRes.statusText, evalRes.allowed);
      } else {
        hideHologram();
      }
      return;
    } else {
      hideHologram();
      window._world3DSlotSnapTarget = null;
      window._world3DPlacementBlockedReason = null;
    }

    // B. 正常 / 拆除模式：射线检测悬停的 3D 机器
    const hits = raycaster.intersectObjects(raycastNearbyMeshes.length ? raycastNearbyMeshes : visibleInteractableMeshes, false);
    const prevId = hoveredHit ? hoveredHit.bld.id : null;
    const prevInteract = hoveredHit ? hoveredHit.interactId : null;

    if (hits.length > 0) {
      const obj = hits[0].object;
      const bld = obj.userData.bld;
      const interactId = obj.userData.interactId;

      hoveredHit = {
        bld,
        interactId,
        isTopSlot: !!obj.userData.isTopSlot,
        slotType: obj.userData.slotType
      };

      if (typeof currentHoveredBuildingId !== 'undefined') {
        currentHoveredBuildingId = bld.id;
      }

      if (prevInteract !== interactId || prevId !== bld.id) {
        if (typeof isDismantleMode !== 'undefined' && isDismantleMode) {
          if (typeof showDismantleTargetCard === 'function') showDismantleTargetCard(bld);
        } else if (typeof setTargetMachine === 'function') {
          setTargetMachine(interactId);
        }
      }
    } else {
      if (hoveredHit) {
        if (typeof currentHoveredBuildingId !== 'undefined') currentHoveredBuildingId = null;
        if (typeof isDismantleMode !== 'undefined' && isDismantleMode) {
          if (typeof hideDismantleTargetCard === 'function') hideDismantleTargetCard();
          if (typeof cancelDismantleHold === 'function') cancelDismantleHold();
        } else if (typeof clearTargetMachine === 'function') {
          clearTargetMachine(hoveredHit.interactId);
        }
        hoveredHit = null;
      }
    }
  }

  function syncFollowBtnUI() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.syncFollowBtnUI === 'function') {
      window.WorldStealthActor.syncFollowBtnUI();
      return;
    }
    const btn = document.getElementById('btnToggleFollowAvatar');
    if (btn) {
      btn.innerText = fallbackFollowAvatarMode ? '[V] 跟随:开' : '[V] 自由视角';
    }
  }

  function toggleFollowAvatar() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.toggleFollowAvatar === 'function') {
      return window.WorldStealthActor.toggleFollowAvatar(getStealthContext());
    }
    fallbackFollowAvatarMode = !fallbackFollowAvatarMode;
    syncFollowBtnUI();
    if (fallbackFollowAvatarMode && explorerAvatar) {
      const es = getExplorerState();
      camState.target.x = es.wx;
      camState.target.z = es.wz;
      updateCameraTransform();
    }
    return fallbackFollowAvatarMode;
  }

  function cast3DGhostDomain() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.cast3DGhostDomain === 'function') {
      window.WorldStealthActor.cast3DGhostDomain(getStealthContext());
      return;
    }
    const es = getExplorerState();
    es.ghostDomainTimer = 10.0;
    if (ghostDomainMesh) {
      ghostDomainMesh.position.set(es.wx, 0.09, es.wz);
      ghostDomainMesh.visible = true;
    }
  }

  function cast3DShanheWall() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.cast3DShanheWall === 'function') {
      window.WorldStealthActor.cast3DShanheWall(getStealthContext());
      return;
    }
    const es = getExplorerState();
    es.shanheWallTimer = 8.0;
    if (shanheWallMesh) {
      const fx = Math.sin(es.yaw);
      const fz = Math.cos(es.yaw);
      shanheWallMesh.position.set(es.wx + fx * 2.8, 1.6, es.wz + fz * 2.8);
      shanheWallMesh.rotation.y = es.yaw;
      shanheWallMesh.visible = true;
    }
  }

  function triggerNearbyPoiInteract() {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.triggerNearbyPoiInteract === 'function') {
      window.WorldStealthActor.triggerNearbyPoiInteract();
    }
  }

  function updateExplorerAndStealth(dt, nowTime) {
    if (window.WorldStealthActor && typeof window.WorldStealthActor.updateExplorerAndStealth === 'function') {
      window.WorldStealthActor.updateExplorerAndStealth(dt, nowTime, getStealthContext());
    }
  }

  function updateHighlightsAndLabels() {
    const dismantleOn = (typeof isDismantleMode !== 'undefined' && isDismantleMode);
    const hoverId = (hoveredHit && hoveredHit.bld && buildingMeshMap.has(hoveredHit.bld.id)) ? hoveredHit.bld.id : null;

    if (hoverBoxHelper) {
      if (hoverId) {
        if (hoverId !== lastHoverBoxBldId || dismantleOn !== lastHoverDismantleMode) {
          const targetEntry = buildingMeshMap.get(hoverId);
          hoverBoxHelper.setFromObject(targetEntry.group);
          hoverBoxHelper.material.color.setHex(dismantleOn ? 0xff5500 : 0x00f0ff);
          lastHoverBoxBldId = hoverId;
          lastHoverDismantleMode = dismantleOn;
        }
        hoverBoxHelper.visible = true;
      } else {
        hoverBoxHelper.visible = false;
        lastHoverBoxBldId = null;
      }
    }

    if (!showAll3DLabels) return;
    const vec = _tmpLabelVec || new THREE.Vector3();

    buildingMeshMap.forEach((entry) => {
      const { group, bld, labelAnchorY, labelEl } = entry;
      const isHovered = hoveredHit && hoveredHit.bld.id === bld.id;

      // 投影 3D 标签到屏幕坐标 (脏值缓存，避免每帧无意义 DOM 样式写入)
      if (labelEl) {
        if (!group.visible || (!isHovered && !showAll3DLabels)) {
          if (entry._lastOpacity !== '0') {
            labelEl.style.opacity = '0';
            entry._lastOpacity = '0';
          }
        } else {
          vec.set(group.position.x, labelAnchorY, group.position.z);
          vec.project(camera);
          if (vec.z > 1 || vec.z < -1) {
            if (entry._lastOpacity !== '0') {
              labelEl.style.opacity = '0';
              entry._lastOpacity = '0';
            }
          } else {
            const sx = `${Math.round((vec.x * 0.5 + 0.5) * window.innerWidth)}px`;
            const sy = `${Math.round((-vec.y * 0.5 + 0.5) * window.innerHeight)}px`;
            const op = isHovered ? '1' : '0.72';
            const zi = isHovered ? '25' : '12';
            if (entry._lastLeft !== sx) { labelEl.style.left = sx; entry._lastLeft = sx; }
            if (entry._lastTop !== sy) { labelEl.style.top = sy; entry._lastTop = sy; }
            if (entry._lastOpacity !== op) { labelEl.style.opacity = op; entry._lastOpacity = op; }
            if (entry._lastZIndex !== zi) { labelEl.style.zIndex = zi; entry._lastZIndex = zi; }
          }
        }
      }
    });
  }

  function updatePoiSignposts() {
    // 3D 据点路标已改用地面灵脉大道与冲天灵光柱纯 3D 美术表现，不再悬浮 DOM 按钮遮挡视野
  }

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    animTime += dt;
    frameTickCount++;

    // 弹窗阻塞时将 3D 渲染降频至 ~10fps，释放 CPU/GPU
    if (isModalBlockingWorld() && frameTickCount % 6 !== 0) {
      return;
    }

    if (!externalCameraControl || (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode)) {
      if (raycastDirty && frameTickCount % 3 === 0) {
        updateRaycastAndHologram();
        raycastDirty = false;
      }
    }

    // 驱动大地图玩家化身行走与敌宗守卫潜行检测
    updateExplorerAndStealth(dt, animTime);

    // 驱动周边 95m 内有动画的建筑 + 每 3 帧或镜头变化时执行一次视锥与视距裁剪及射线空间过滤 (显著提升 FPS)
    if (frameTickCount % 3 === 0 || cullDirty) {
      updateDistanceCulling(false);
    }
    updateLogisticsFX(animTime);
    if (frameTickCount % 3 === 0) {
      const cx = camState.target.x;
      const cz = camState.target.z;
      for (let i = 0; i < animatedBuildingEntries.length; i++) {
        const entry = animatedBuildingEntries[i];
        if (!entry.group.visible) continue;
        const gx = entry.group.position.x;
        const gz = entry.group.position.z;
        if (Math.abs(gx - cx) > 95 || Math.abs(gz - cz) > 95) continue;
        const anims = entry.animators;
        for (let j = 0; j < anims.length; j++) anims[j](animTime);
      }
    }

    // 驱动仙山浮动与灵气微粒 (每 3 帧一次，仅遍历 3 座浮空岛)
    if (frameTickCount % 3 === 0) {
      for (let i = 0; i < floatingIslandMeshes.length; i++) {
        const child = floatingIslandMeshes[i];
        child.position.y = child.userData.floatBaseY + Math.sin(animTime * 0.8 + child.userData.floatPhase) * 0.7;
      }
      if (particlesMesh) {
        particlesMesh.rotation.y = animTime * 0.02;
      }
    }

    if (!externalCameraControl) {
      updateHighlightsAndLabels();
      if (renderer && shadowDirty) {
        renderer.shadowMap.needsUpdate = true;
        shadowDirty = false;
      }
    } else if (renderer && frameTickCount % 6 === 0) {
      renderer.shadowMap.needsUpdate = true;
    }
    if (frameTickCount % 2 === 0) {
      updatePoiSignposts();
    }

    // 外部战斗/原型帧钩子 (异常隔离防止整帧崩坏)
    for (let i = 0; i < frameHooks.length; i++) {
      try {
        frameHooks[i](dt, animTime);
      } catch (err) {
        console.error('[World3D frameHook error]', err);
      }
    }

    renderer.render(scene, camera);
  }

  const UPGRADE_FAMILY_MAP = {
    miner: 'heavy_miner',
    furnace: 'furnace_mk2',
    smelter: 'furnace_mk2',
    furnace_mk2: 'entropy_smelter',
    smelt_chamber: 'furnace_mk2',
    assembler: 'assembler_heavy',
    assembler_heavy: 'omni_assembler',
    omni_assembler: 'recomposer_mk3',
    bd_163: 'alchemy_furnace_mk2',
    petri_dish: 'immortal_herb_garden',
    incubator: 'immortal_herb_garden',
    wood_nursery: 'immortal_herb_garden',
    beast_pen: 'beast_immortal_pool',
    conveyor: 'conveyor_mk2',
    conveyor_mk2: 'conveyor_mk3',
  };

  const UPGRADE_SOURCES_FOR = {
    heavy_miner: ['miner'],
    furnace_mk2: ['furnace', 'smelter', 'smelt_chamber'],
    entropy_smelter: ['furnace_mk2', 'furnace', 'smelter'],
    omni_assembler: ['assembler_heavy', 'assembler'],
    recomposer_mk3: ['omni_assembler', 'assembler_heavy', 'assembler'],
    alchemy_furnace_mk2: ['bd_163'],
    immortal_herb_garden: ['wood_nursery', 'incubator', 'petri_dish'],
    beast_immortal_pool: ['beast_pen'],
    conveyor_mk2: ['conveyor'],
    conveyor_mk3: ['conveyor_mk2', 'conveyor'],
  };

  let capturedBlueprint = [];

  function upgradeBuildingInPlace(targetIdOrType, newTypeKey) {
    if (typeof worldBuildings === 'undefined' || !Array.isArray(worldBuildings)) {
      return { ok: false, reason: 'no_world_buildings' };
    }
    let bld = null;
    if (targetIdOrType) {
      bld = worldBuildings.find(b => b.id === targetIdOrType) || worldBuildings.find(b => b.type === targetIdOrType);
    } else if (newTypeKey && UPGRADE_SOURCES_FOR[newTypeKey]) {
      const srcs = UPGRADE_SOURCES_FOR[newTypeKey];
      for (const s of srcs) {
        bld = worldBuildings.find(b => b.type === s);
        if (bld) break;
      }
    }
    if (!bld) {
      if (typeof showNotification === 'function') showNotification('【原地升级】场景中未找到可升级的同系低阶设备');
      return { ok: false, reason: 'target_not_found' };
    }
    const oldType = bld.type;
    const targetType = newTypeKey || UPGRADE_FAMILY_MAP[oldType];
    if (!targetType) {
      return { ok: false, reason: 'no_upgrade_target' };
    }
    const def = getBuildingTableDef(targetType);
    if (bld.wx === undefined && typeof ensureWorldCoords === 'function') ensureWorldCoords(bld, 0);
    const preservedConfig = { ...(bld.config || {}) };
    if (bld.beltItem) preservedConfig.beltItem = bld.beltItem;
    bld.type = targetType;
    if (def) {
      bld.name = def.name || targetType;
      bld.power = def.power < 0 ? `+${Math.abs(def.power)} MW` : `${def.power} MW`;
    }
    bld.config = preservedConfig;
    if (typeof syncBuildings === 'function') syncBuildings();
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`✨【原地换代秒升】${oldType} ➔ ${bld.name || targetType}（坐标(${bld.wx},${bld.wz})·配方·存货 100% 保留！）`);
    }
    return { ok: true, id: bld.id, fromType: oldType, toType: targetType, wx: bld.wx, wy: bld.wy || 0, wz: bld.wz, rot: bld.rot || 0, config: bld.config };
  }

  function captureBlueprint(centerX = 0, centerZ = 0, radius = 12) {
    if (typeof worldBuildings === 'undefined' || !Array.isArray(worldBuildings)) {
      return { count: 0, items: [] };
    }
    const picked = [];
    worldBuildings.forEach((b, idx) => {
      if (typeof ensureWorldCoords === 'function') ensureWorldCoords(b, idx);
      const dx = (b.wx || 0) - centerX;
      const dz = (b.wz || 0) - centerZ;
      if (Math.hypot(dx, dz) <= radius) {
        picked.push({
          dx,
          dy: b.wy || 0,
          dz,
          type: b.type,
          name: b.name,
          power: b.power,
          rot: b.rot || 0,
          config: b.config ? { ...b.config } : {}
        });
      }
    });
    capturedBlueprint = picked;
    if (typeof showNotification === 'function') {
      showNotification(`📜【阵图拓印】已框选拓印 (${centerX},${centerZ}) 半径 ${radius}m 内共 ${picked.length} 座设施蓝图！`);
    }
    return { count: picked.length, center: { x: centerX, z: centerZ }, items: picked };
  }

  function pasteBlueprint(targetCenterX = 56, targetCenterZ = 0) {
    if (!Array.isArray(capturedBlueprint) || capturedBlueprint.length === 0) {
      return { ok: false, pasted: 0, items: [] };
    }
    const created = [];
    capturedBlueprint.forEach((tpl, i) => {
      const nb = {
        id: `bp_${Date.now()}_${i}`,
        type: tpl.type,
        name: tpl.name,
        power: tpl.power || '0 MW',
        wx: Math.round((targetCenterX + tpl.dx) * 10) / 10,
        wy: tpl.dy || 0,
        wz: Math.round((targetCenterZ + tpl.dz) * 10) / 10,
        rot: tpl.rot || 0,
        config: tpl.config ? { ...tpl.config } : {}
      };
      worldBuildings.push(nb);
      created.push(nb);
    });
    if (typeof syncBuildings === 'function') syncBuildings();
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`📜【阵图成阵粘贴】已在 (${targetCenterX},${targetCenterZ}) 整组批量拍下 ${created.length} 座设施！`);
    }
    return { ok: true, pasted: created.length, items: created };
  }

  function quickBlueprintStamp() {
    const cap = captureBlueprint(0, 0, 10);
    if (cap.count === 0) {
      captureBlueprint(28, 22, 8);
    }
    return pasteBlueprint(58, 12);
  }

  function flashDefenseTurrets() {
    let flashed = 0;
    buildingMeshMap.forEach((entry) => {
      const t = entry && entry.bld ? entry.bld.type : '';
      if (t === 'bd_160' || t === 'thunder_turret' || t === 'battle_base') {
        flashed += 1;
        entry.animators.push((tm) => {
          if (entry.group && entry.group.children[0]) {
            entry.group.scale.y = 1 + Math.abs(Math.sin(tm * 12)) * 0.12;
          }
        });
      }
    });
    return { flashed };
  }

  function toggleAllLabels() {
    showAll3DLabels = !showAll3DLabels;
    if (typeof showNotification === 'function') {
      showNotification(showAll3DLabels ? '已开启【显示全部 3D 标签】' : '已切换为【仅悬停显示标签】(清爽视界)');
    }
    return showAll3DLabels;
  }

  function buildRemoteSwordMiningLine(nodeId) {
    const nd = resourceNodes.find(n => n && n.id === nodeId && n.isRemoteRich);
    if (!nd || nd.built) return { ok: false };
    const tx = typeof nd.targetX === 'number' ? nd.targetX : (nd.x > 0 ? 34 : -34);
    const tz = typeof nd.targetZ === 'number' ? nd.targetZ : (nd.z > 0 ? 20 : -20);
    const dirX = tx > nd.x ? 1 : -1;
    const oreId = nd.oreId || 'MAT_006';
    const stamp = Date.now();
    const startX = nd.x + dirX * 10;
    const added = [
      { id: `rm_${nodeId}_miner_${stamp}`, type: 'heavy_miner', name: `远境深矿机 · ${nd.id}`, power: '-60 MW', wx: nd.x, wy: 0, wz: nd.z, rot: dirX > 0 ? 1 : 3, config: { beltItem: oreId } },
      { id: `rm_${nodeId}_belt1_${stamp}`, type: 'conveyor_mk3', name: '三阶灵能传送带', power: '0 MW', wx: nd.x + dirX * 4, wy: 0, wz: nd.z, rot: dirX > 0 ? 1 : 3, config: { beltItem: oreId } },
      { id: `rm_${nodeId}_box_${stamp}`, type: 'storage_box', name: '远境集矿缓冲仓', power: '0 MW', wx: nd.x + dirX * 7, wy: 0, wz: nd.z, rot: 0, config: { beltItem: oreId } },
      { id: `rm_${nodeId}_cat_${stamp}`, type: 'sword_catapult', name: '御剑发剑台', power: '-45 MW', wx: startX, wy: 0, wz: nd.z, rot: dirX > 0 ? 1 : 3, config: { beltItem: oreId } }
    ];
    const trunkX = nd.x > 0 ? 80 : -68;
    added.push(
      { id: `rm_${nodeId}_beacon_trunk_${stamp}`, type: 'sky_rail', name: '御剑道标·主干汇合桩（兼灵网中继）', power: '-10 MW', wx: trunkX, wy: 0, wz: nd.z, rot: 1, config: {} },
      { id: `rm_${nodeId}_beacon_corner_${stamp}`, type: 'sky_rail', name: '御剑道标·分流折点桩', power: '-10 MW', wx: tx, wy: 0, wz: nd.z, rot: 0, config: {} }
    );
    const zMid = Math.round((nd.z + tz) * 0.5);
    if (Math.abs(tz - nd.z) > 48) {
      added.push({ id: `rm_${nodeId}_beacon_z_${stamp}`, type: 'sky_rail', name: '御剑道标·剑环桩（兼灵网中继）', power: '-10 MW', wx: tx, wy: 0, wz: zMid, rot: 0, config: {} });
    }
    added.push(
      { id: `rm_${nodeId}_catch_${stamp}`, type: 'lotus_catcher', name: '接引莲台（按物分流）', power: '-35 MW', wx: tx, wy: 0, wz: tz, rot: 0, config: { beltItem: oreId } },
      { id: `rm_${nodeId}_belt2_${stamp}`, type: 'conveyor_mk3', name: '三阶进厂接驳带', power: '0 MW', wx: tx - dirX * 3, wy: 0, wz: tz, rot: dirX > 0 ? 3 : 1, config: { beltItem: oreId } },
      { id: `rm_${nodeId}_smelt_${stamp}`, type: 'entropy_smelter', name: '远境来料熔炼炉', power: '-50 MW', wx: tx - dirX * 6, wy: 0, wz: tz, rot: 0, config: { beltItem: oreId } }
    );
    added.forEach(b => worldBuildings.push(b));
    nd.built = true;
    nd.label = nd.label.replace('[空闲 · 按E拉设飞剑矿线]', '[御剑道标已并网]');
    if (typeof syncBuildings === 'function') syncBuildings();
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`⚔️【御剑道标航线并网】已并入主干剑道（单剑整匣 10x · 道标自动中继灵网供电 · 终点莲台按物分流）！`);
    }
    return { ok: true, nodeId, count: added.length };
  }

  function focusMapPOI(poiId) {
    const poi = mapPois.find(p => p && p.id === poiId);
    if (!poi) return null;
    camState.target.set(poi.wx, 3, poi.wz);
    camState.distance = Math.min(camState.distance, 42);
    if (typeof showNotification === 'function') {
      showNotification(`🎯 视界已定位至大地图锚点：【${poi.name}】(${poi.wx}, ${poi.wz})`);
    }
    return poi;
  }

  // 对外暴露 API
  window.World3D = {
    isReady: () => isInitialized,
    syncBuildings,
    updateHologram,
    resetCamera,
    toggleAllLabels,
    toggleGroundGrid: (forceState) => {
      showGroundGrid = typeof forceState === 'boolean' ? forceState : !showGroundGrid;
      if (groundGrid) groundGrid.visible = showGroundGrid;
      const btn = document.getElementById('btnGroundGridTop');
      if (btn) {
        btn.innerText = showGroundGrid ? '📐 网格: 开' : '📐 网格: 关';
        btn.className = showGroundGrid
          ? 'px-2 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/45 border border-amber-400/70 text-amber-100 text-[11px] font-mono font-bold cursor-pointer transition'
          : 'px-2 py-0.5 rounded bg-slate-700/70 hover:bg-slate-600 border border-slate-400/40 text-slate-300 text-[11px] font-mono cursor-pointer transition';
      }
      if (typeof showNotification === 'function') {
        showNotification(showGroundGrid ? '📐 已开启地面建造辅助网格' : '📐 已关闭地面辅助网格（抗摩尔纹清晰模式）');
      }
      return showGroundGrid;
    },
    isGroundGridVisible: () => showGroundGrid,
    cycleFloorView,
    openLogisticsConfig: openLogisticsConfigModal,
    evaluatePlacementRule,
    upgradeBuildingInPlace,
    captureBlueprint,
    pasteBlueprint,
    quickBlueprintStamp,
    flashDefenseTurrets,
    getResourceNodes: () => resourceNodes,
    getMapPOIs: () => mapPois,
    getSectGuards: () => sectGuards,
    getLogisticsFXStats: () => (
      window.WorldLogisticsFX && typeof window.WorldLogisticsFX.getStats === 'function'
        ? window.WorldLogisticsFX.getStats()
        : { swords: 0, cranes: 0, skyShuttles: 0, lightning: 0 }
    ),
    getExplorerState,
    toggleFollowAvatar,
    cast3DGhostDomain,
    cast3DShanheWall,
    triggerNearbyPoiInteract,
    buildRemoteSwordMiningLine,
    moveAvatarToPoi: (poiId) => {
      const es = getExplorerState();
      let tx = 0;
      let tz = 26;
      let label = '主厂区中心';
      if (poiId !== 'HOME') {
        const hit = mapPois.find(p => p && p.id === poiId);
        if (!hit) return false;
        const spawnOverrides = {
          POI_SECT_01: [0, -112],
          POI_SECT_02: [-20, -168],
          POI_SECT_03: [20, -168],
          POI_SECT_04: [0, -184]
        };
        if (spawnOverrides[poiId]) {
          tx = spawnOverrides[poiId][0];
          tz = spawnOverrides[poiId][1];
        } else {
          tx = hit.wx;
          tz = hit.wz + 6.0;
        }
        label = hit.name;
      }
      es.wx = tx;
      es.wz = tz;
      if (explorerAvatar) explorerAvatar.position.set(tx, 0, tz);
      if (externalCameraControl && typeof window !== 'undefined' && window.CombatPlayer && window.CombatPlayer.getState) {
        const pst = window.CombatPlayer.getState();
        if (pst && pst.pos) {
          pst.pos.x = tx;
          pst.pos.z = tz;
        }
      } else {
        setFollowAvatarMode(true);
        camState.target.x = tx;
        camState.target.z = tz;
        updateCameraTransform();
      }
      raycastDirty = true;
      if (typeof showNotification === 'function') {
        showNotification(`🧭 已瞬移至【${label}】(${Math.round(tx)}, ${Math.round(tz)})，靠近按住 [E] 即可交互！`);
      }
      return true;
    },
    focusMapPOI,
    focusIndustrialComplex: (zoneKey) => {
      const presets = {
        center: { x: 0, y: 8, z: 0, dist: 105, yaw: 0.45, pitch: 0.58, label: '① 中央·三层综合母厂' },
        east_flat: { x: 340, y: 2, z: 0, dist: 145, yaw: 0.55, pitch: 0.64, label: '② 东境·不叠层平铺百炉巨阵' },
        west_blackbox: { x: -350, y: 14, z: 0, dist: 100, yaw: -0.62, pitch: 0.54, label: '③ 西境·98%高密极限黑箱魔方' },
        south_eco: { x: 0, y: 4, z: 385, dist: 140, yaw: 0.35, pitch: 0.62, label: '④ 南境·平铺灵植生态退台' },
        north_wonder: { x: 0, y: 14, z: -408, dist: 155, yaw: 0.42, pitch: 0.56, label: '⑤ 北境·三层阶梯飞升奇观' },
        belt_highway: { x: 156, y: 4, z: 50, dist: 165, yaw: 0.48, pitch: 0.54, label: '⑥ 跨区百米长距三联传送带' },
        defense_zone: { x: 460, y: 5, z: 266, dist: 145, yaw: 0.35, pitch: 0.58, label: '⑦ 东南边境·猎修军工防线' },
        shaqi_zone: { x: -360, y: 4, z: 360, dist: 105, yaw: 0.45, pitch: 0.58, label: '⑧ 西南独立·煞气工厂（排放/压制/结晶/法宝插座）' },
        overview: { x: 0, y: 10, z: 0, dist: 660, yaw: 0.38, pitch: 0.78, label: '🌐 2000×2000 全域高空鸟瞰' }
      };
      const p = presets[zoneKey] || presets.center;
      if (typeof setFollowAvatarMode === 'function') setFollowAvatarMode(false);
      camState.target.set(p.x, p.y, p.z);
      camState.distance = p.dist;
      camState.yaw = p.yaw;
      camState.pitch = p.pitch;
      const es = getExplorerState();
      es.wx = p.x;
      es.wz = p.z;
      if (typeof window !== 'undefined' && window.CombatPlayer && typeof window.CombatPlayer.getState === 'function') {
        const pst = window.CombatPlayer.getState();
        if (pst && pst.pos) { pst.pos.x = p.x; pst.pos.z = p.z; }
      }
      updateCameraTransform();
      updateDistanceCulling(true);
      raycastDirty = true;
      if (typeof showNotification === 'function') {
        showNotification(`📷 镜头已跳转至【${p.label}】(${p.x}, ${p.z})`);
      }
      return p;
    },
    getHoveredBuilding: () => (hoveredHit ? hoveredHit.bld : null),
    getScene: () => scene,
    getCamera: () => camera,
    getRenderer: () => renderer,
    getCanvas: () => (renderer ? renderer.domElement : null),
    getBuildingsGroup: () => buildingsGroup,
    getBuildingEntries: () => buildingMeshMap,
    getOrientedHalfExtents,
    getBuildingTableDef,
    getWorldVersion: () => worldVersion,
    setExternalCameraControl: (flag) => {
      externalCameraControl = !!flag;
      isOrbitDragging = false;
      isPanDragging = false;
      const labelLayer = document.getElementById('world3DLabels');
      if (externalCameraControl) {
        if (hoveredHit && hoveredHit.interactId && typeof clearTargetMachine === 'function') {
          clearTargetMachine(hoveredHit.interactId);
        }
        hoveredHit = null;
        if (hoverBoxHelper) hoverBoxHelper.visible = false;
        if (typeof targetedMachineId !== 'undefined' && targetedMachineId && typeof clearTargetMachine === 'function') {
          clearTargetMachine(targetedMachineId);
        }
        if (labelLayer) labelLayer.style.display = 'none';
        if (renderer) {
          renderer.setPixelRatio(1);
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          renderer.shadowMap.needsUpdate = true;
        }
      } else {
        if (labelLayer) labelLayer.style.display = '';
        if (renderer) {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
          renderer.setSize(window.innerWidth, window.innerHeight, false);
          renderer.shadowMap.needsUpdate = true;
        }
        if (camera) {
          camera.fov = 52;
          camera.rotation.set(0, 0, 0);
          camera.updateProjectionMatrix();
          updateCameraTransform();
        }
      }
    },
    isExternalCameraControl: () => externalCameraControl,
    registerFrameHook: (fn) => {
      if (typeof fn === 'function' && !frameHooks.includes(fn)) {
        frameHooks.push(fn);
      }
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    init();
  });
})();
