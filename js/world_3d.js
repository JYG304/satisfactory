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

  // 相机轨道状态 (纯鼠标控制，无玩家 WASD 移动)
  const camState = {
    target: new THREE.Vector3(3, 7.5, 2),
    yaw: -0.42,       // 弧度
    pitch: 0.44,      // 俯仰角
    distance: 56,     // 观察距离 (完整俯瞰三层叠加立体大厂)
    minDist: 8,
    maxDist: 120
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
  let visibleFloorMode = 'all'; // 'all' | '1f' | '2f' | '3f'
  let visibleInteractableMeshes = [];
  let manualStackY = 0;
  const buildingMeshMap = new Map(); // bld.id -> { group, bld, animators, labelAnchorY, topY }
  const interactableMeshes = [];     // 用于 raycaster 检测的所有子网格

  // 策划表体素占格尺度：1 水平格 = 2.0m，1 高度(m) = 1.0m (严格对齐 1×1×1m, 1×1×4m, 3×3×1m)
  const GRID_UNIT = 2.0;
  const HEIGHT_UNIT = 1.0;
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
      beam: 'foundation_beam'
    };
    return XIUXIAN_BUILDINGS[type] || XIUXIAN_BUILDINGS[alias[type]] || null;
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
    scene.fog = new THREE.FogExp2(0x284e6b, 0.0085);

    camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.2, 300);
    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

    // 隐藏旧版 2D SVG 背景与 2D 巨型机械臂，展示纯净 3D 视界
    const svgBg = document.getElementById('worldBgSvg');
    if (svgBg) svgBg.classList.add('hidden');
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
  }

  function setupLighting() {
    const hemi = new THREE.HemisphereLight(0x9be2ff, 0x7c5c36, 0.85);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1d6, 1.45);
    sun.position.set(35, 55, 28);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
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
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(225,185,120,0.16)' : 'rgba(90,62,32,0.18)';
      ctx.fillRect(x, y, r, r);
    }
    const groundTex = new THREE.CanvasTexture(texCanvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(24, 24);

    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.92,
      metalness: 0.05
    });
    groundPlane = new THREE.Mesh(groundGeo, groundMat);
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.receiveShadow = true;
    environmentGroup.add(groundPlane);

    // 工业辅助网格
    groundGrid = new THREE.GridHelper(120, 60, 0xf5921e, 0x2a3b4c);
    groundGrid.position.y = 0.02;
    groundGrid.material.opacity = 0.25;
    groundGrid.material.transparent = true;
    environmentGroup.add(groundGrid);

    // 2. 远景修仙奇岩与山峰
    const rockMat = stdMat(0x524234, 0.9, 0.05);
    const peakMat = stdMat(0x3a4a58, 0.85, 0.15);
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 58 + (i % 3) * 14;
      const h = 10 + (i % 5) * 6;
      const r = 5 + (i % 4) * 2.5;
      const geo = new THREE.ConeGeometry(r, h, 6);
      const mesh = new THREE.Mesh(geo, i % 2 === 0 ? rockMat : peakMat);
      mesh.position.set(Math.cos(angle) * radius, h / 2 - 0.5, Math.sin(angle) * radius);
      mesh.rotation.y = i * 0.7;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      environmentGroup.add(mesh);
    }

    // 3. 几座悬浮仙山灵岛 (增强修仙工业世界观)
    const islandSpots = [
      { x: -32, y: 20, z: -42, s: 1.4 },
      { x: 36, y: 24, z: -48, s: 1.7 },
      { x: 0, y: 28, z: -62, s: 2.1 }
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
    });

    // 4. 场边灵脉晶簇与外星棕榈树
    const crystalMat = stdMat(0x00f0ff, 0.2, 0.4, 0x00aaff, 0.75);
    const oreSpots = [
      [-18, -14], [22, -12], [-24, 14], [20, 16]
    ];
    oreSpots.forEach(([ox, oz]) => {
      const cluster = new THREE.Group();
      for (let k = 0; k < 4; k++) {
        const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.6 + k * 0.18, 0), crystalMat);
        shard.position.set((k - 1.5) * 0.55, 0.5 + k * 0.2, (k % 2) * 0.4);
        shard.rotation.set(0.2 * k, k * 0.9, 0.15 * k);
        shard.castShadow = true;
        cluster.add(shard);
      }
      cluster.position.set(ox, 0, oz);
      environmentGroup.add(cluster);
    });

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
    mesh.castShadow = true;
    mesh.receiveShadow = true;
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

    const add = (mesh, idOverride = null, isTop = false, slotType = null) => {
      if (!isHologram && bld) {
        tagMesh(mesh, bld, idOverride || bld.type, isTop, slotType);
      }
      group.add(mesh);
      return mesh;
    };

    const bDef = getBuildingTableDef(type);
    const dimX = bDef ? (bDef.dimX || 1) : 1;
    const dimY = bDef ? (bDef.dimY || 1) : 1;
    const dimZ = bDef ? (bDef.dimZ || 1) : 1;
    const W = dimX * GRID_UNIT;
    const D = dimY * GRID_UNIT;
    let topY = Math.max(1.0, dimZ * HEIGHT_UNIT);

    if (type === 'power_engine') {
      // 灵力引擎 (BD_147, 4×3 = 8m×6m) + 顶部 3 联装冶炼舱 (自然立体比例，绝不压扁)
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.8, 5.2), mFluidDark);
      chassis.position.y = 0.9;
      add(chassis, 'power_engine');
      const deckTrim = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.22, 5.4), mCyanGlow);
      deckTrim.position.y = 1.85;
      add(deckTrim, 'power_engine');
      // 散热片组
      for (let f = -2; f <= 2; f++) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.3, 5.5), mSteel);
        fin.position.set(f * 1.4, 0.9, 0);
        add(fin, 'power_engine');
      }
      // 前置能量核心环
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.14, 12, 24), mCyanGlow);
      ring.position.set(0, 0.95, 2.68);
      add(ring, 'power_engine');
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), mAmberGlow);
      core.position.set(0, 0.95, 2.68);
      add(core, 'power_engine');
      animators.push((t) => {
        ring.rotation.z = t * 1.8;
        core.scale.setScalar(1 + Math.sin(t * 4) * 0.12);
      });

      const slotsData = (typeof engineChamberSlots !== 'undefined') ? engineChamberSlots : [
        { slotIndex: 0, mounted: true },
        { slotIndex: 1, mounted: true },
        { slotIndex: 2, mounted: true }
      ];
      slotsData.forEach((slot, i) => {
        const sx = (i - 1) * 2.2;
        const slotId = slot.mounted ? `smelt_chamber_${i}` : `smelt_slot_empty_${i}`;
        if (slot.mounted) {
          const chamber = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.6, 2.2), mOrange);
          chamber.position.set(sx, 2.75, 0);
          add(chamber, slotId, true, 'engine_chamber');
          const fireWin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.7, 0.18), mAmberGlow);
          fireWin.position.set(sx, 2.7, 1.12);
          add(fireWin, slotId, true, 'engine_chamber');
          const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.85, 12), mDark);
          chimney.position.set(sx, 3.95, 0);
          add(chimney, slotId, true, 'engine_chamber');
        } else {
          const emptyPad = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 2.0), stdMat(0x334155, 0.6, 0.3, 0xf5921e, 0.25));
          emptyPad.position.set(sx, 2.06, 0);
          add(emptyPad, slotId, true, 'engine_chamber');
        }
      });
      topY = 4.4;
      labelAnchorY = 5.0;

    } else if (type === 'fluid_hub') {
      // 流体处理中枢 (BD_158, 2×4 = 4m×8m) + 顶部搅拌机/萃取塔插槽
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 7.2), mFluidDark);
      base.position.y = 0.9;
      add(base, 'fluid_hub');
      const collar = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.2, 7.4), mCyanGlow);
      collar.position.y = 1.85;
      add(collar, 'fluid_hub');
      // 两侧双储液罐
      [-2.1, 2.1].forEach((pz) => {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 1.8, 16), mSteel);
        tank.position.set(0, 1.1, pz);
        add(tank, 'fluid_hub');
      });
      // 左右法兰接口
      [-2.0, 2.0].forEach((px) => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.7, 12), mCyanGlow);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(px, 0.9, 0);
        add(pipe, 'fluid_hub');
      });

      const slot = (typeof fluidHubSlot !== 'undefined') ? fluidHubSlot : { mounted: true, childId: 'mixer' };
      const topId = slot.mounted && slot.childId ? slot.childId : 'fluid_hub_slot';
      if (slot.mounted && slot.childId === 'extractor') {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 2.6, 16), mSteel);
        col.position.y = 3.25;
        add(col, topId, true, 'fluid_hub');
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.1, 10, 24), mCyanGlow);
        coil.rotation.x = Math.PI / 2;
        coil.position.y = 3.25;
        add(coil, topId, true, 'fluid_hub');
        animators.push((t) => { coil.position.y = 3.0 + Math.sin(t * 2.5) * 0.65; });
      } else if (slot.mounted) {
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 1.7, 18), mSteel);
        drum.position.y = 2.8;
        add(drum, topId, true, 'fluid_hub');
        const rotor = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.28), mCyanGlow);
        rotor.position.y = 3.8;
        add(rotor, topId, true, 'fluid_hub');
        animators.push((t) => { rotor.rotation.y = t * 4.5; });
      }
      topY = 4.5;
      labelAnchorY = 5.1;

    } else if (type === 'bio_base') {
      // 营养基座 (BD_159, 1×2 = 2m×4m) + 顶部培育仓/培养皿插槽
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 3.8), mBioDark);
      base.position.y = 0.6;
      add(base, 'bio_base');
      const pipeBar = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.2, 3.95), mEmeraldGlow);
      pipeBar.position.y = 1.22;
      add(pipeBar, 'bio_base');

      const slot = (typeof bioBaseSlot !== 'undefined') ? bioBaseSlot : { mounted: true, childId: 'incubator' };
      const topId = slot.mounted && slot.childId ? slot.childId : 'bio_base_slot';
      if (slot.mounted && slot.childId === 'petri_dish') {
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.95, 0.5, 20), mEmeraldGlow);
        dish.position.y = 1.55;
        add(dish, topId, true, 'bio_base');
      } else if (slot.mounted) {
        const dome = new THREE.Mesh(
          new THREE.CylinderGeometry(0.8, 0.85, 1.8, 18),
          new THREE.MeshStandardMaterial({ color: 0x10b981, transparent: true, opacity: 0.55, roughness: 0.2, emissive: 0x059669, emissiveIntensity: 0.45 })
        );
        dome.position.y = 2.2;
        add(dome, topId, true, 'bio_base');
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.08, 10, 22), mYellow);
        halo.rotation.x = Math.PI / 2;
        halo.position.y = 3.25;
        add(halo, topId, true, 'bio_base');
        animators.push((t) => { halo.rotation.z = t * 2.2; });
      }
      topY = 3.5;
      labelAnchorY = 4.2;

    } else if (type === 'miner') {
      // 采矿机 (BD_135, 4×3×4 = 8m×6m 底座 + 高耸钻井架)
      const pad = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.5, 5.2), mDark);
      pad.position.y = 0.25;
      add(pad);
      [[-3.0, -2.1], [3.0, -2.1], [-3.0, 2.1], [3.0, 2.1]].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.6, 0.55), mSteel);
        leg.position.set(lx, 2.0, lz);
        add(leg);
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.8, 4.0), mOrange);
      body.position.y = 3.2;
      add(body);
      const crown = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 2.6), mSteel);
      crown.position.y = 4.8;
      add(crown);
      const drill = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.6, 10), mYellow);
      drill.rotation.x = Math.PI;
      drill.position.y = 1.4;
      add(drill);
      const ore = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 0), mCyanGlow);
      ore.position.y = 0.35;
      add(ore);
      animators.push((t) => {
        drill.rotation.y = t * 6.0;
        drill.position.y = 1.35 + Math.sin(t * 10) * 0.1;
      });
      topY = 5.5;
      labelAnchorY = 6.2;

    } else if (type === 'furnace' || type === 'smelter') {
      // 精炼炉 (BD_136, 3×3×3 = 6m×6m 工业高炉)
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.6, 5.4), mDark);
      plinth.position.y = 0.3;
      add(plinth);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.45, 2.4, 10), mOrange);
      lower.position.y = 1.8;
      add(lower);
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.05, 1.4, 10), mSlate);
      upper.position.y = 3.7;
      add(upper);
      const firebox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.45), mAmberGlow);
      firebox.position.set(0, 1.4, 2.25);
      add(firebox);
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 1.8, 12), mSteel);
      stack.position.y = 5.1;
      add(stack);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.1, 8, 18), mOrange);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 5.95;
      add(ring);
      const puffs = [];
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffd2a6, transparent: true, opacity: 0.45 })
        );
        puff.position.set((p - 1) * 0.25, 6.2 + p * 0.6, 0);
        group.add(puff);
        puffs.push(puff);
      }
      animators.push((t) => {
        firebox.material.emissiveIntensity = 0.8 + Math.sin(t * 5) * 0.25;
        puffs.forEach((pf, idx) => {
          const cycle = (t * 0.7 + idx * 0.33) % 1;
          pf.position.y = 6.1 + cycle * 2.2;
          pf.scale.setScalar(0.6 + cycle * 1.1);
          pf.material.opacity = (1 - cycle) * 0.45;
        });
      });
      topY = 6.0;
      labelAnchorY = 6.8;

    } else if (type === 'assembler') {
      // 加工台 (BD_138, 2×2×2 = 4m×4m)
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 3.6), mDark);
      base.position.y = 0.3;
      add(base);
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.6, 3.3), mSlate);
      body.position.y = 1.4;
      add(body);
      [-0.95, 0.95].forEach((px, idx) => {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.3, 3.45), mOrange);
        pod.position.set(px, 1.4, 0);
        add(pod);
        const gear = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.1, 8, 12), mCyanGlow);
        gear.position.set(px, 1.45, 1.78);
        add(gear);
        animators.push((t) => { gear.rotation.z = t * (idx === 0 ? 2.8 : -2.8); });
      });
      const cap = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.3, 2.2), mSteel);
      cap.position.y = 2.35;
      add(cap);
      topY = 2.5;
      labelAnchorY = 3.2;

    } else if (type === 'assembler_heavy') {
      // 组装机 (BD_146, 3×3×3 = 6m×6m 重型四柱龙门组装站)
      const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.8, 5.6), mDark);
      base.position.y = 0.4;
      add(base);
      [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.4, 0.55), mSteel);
        post.position.set(px, 2.5, pz);
        add(post);
      });
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.7, 1.8), mOrange);
      bridge.position.y = 4.2;
      add(bridge);
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.75, 0), mCyanGlow);
      core.position.y = 2.4;
      add(core);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 10, 24), mCyanGlow);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.4;
      add(ring);
      animators.push((t) => {
        core.rotation.y = t * 2.5;
        ring.rotation.z = -t * 1.5;
      });
      topY = 4.6;
      labelAnchorY = 5.3;

    } else if (type === 'cutter' || type === 'constructor') {
      // 切割机 (BD_139, 1×1×1 = 2m×2m 紧凑龙门激光切割机)
      const bed = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 1.85), mDark);
      bed.position.y = 0.275;
      add(bed);
      [-0.75, 0.75].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.35), mSteel);
        pillar.position.set(px, 1.2, 0);
        add(pillar);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.35, 0.45), mOrange);
      beam.position.y = 1.9;
      add(beam);
      const laserHead = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 8), mCyanGlow);
      laserHead.rotation.x = Math.PI;
      laserHead.position.y = 1.42;
      add(laserHead);
      animators.push((t) => { laserHead.position.x = Math.sin(t * 2.8) * 0.45; });
      topY = 2.1;
      labelAnchorY = 2.7;

    } else if (type === 'crusher') {
      // 粉碎机 (BD_137, 1×1×1 = 2m×2m 双滚筒破碎机)
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.2, 1.85), mDark);
      body.position.y = 0.6;
      add(body);
      const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.55, 0.65, 4), mOrange);
      hopper.rotation.y = Math.PI / 4;
      hopper.position.y = 1.52;
      add(hopper);
      [-0.3, 0.3].forEach((rx, idx) => {
        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.1, 8), mYellow);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(rx, 1.28, 0);
        add(roller);
        animators.push((t) => { roller.rotation.y = t * (idx === 0 ? 5 : -5); });
      });
      topY = 1.85;
      labelAnchorY = 2.5;

    } else if (type === 'deconstructor') {
      // 解构机 (BD_140, 2×4 = 4m×8m)
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 7.2), mDark);
      base.position.y = 0.4;
      add(base);
      const mCrimson = stdMat(0xf43f5e, 0.25, 0.5, 0xe11d48, 0.9);
      [[-1.4, -3.0], [1.4, -3.0], [-1.4, 3.0], [1.4, 3.0]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.8, 0.32), mSteel);
        post.position.set(px, 2.2, pz);
        add(post);
      });
      const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.1, 10, 24), mCrimson);
      scanRing.rotation.x = Math.PI / 2;
      scanRing.position.y = 2.0;
      add(scanRing);
      animators.push((t) => { scanRing.position.y = 2.0 + Math.sin(t * 3.0) * 0.85; });
      topY = 3.6;
      labelAnchorY = 4.3;

    } else if (type === 'centrifuge') {
      // 离心机 (BD_144, 2×2 = 4m×4m)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.85, 1.2, 16), mDark);
      base.position.y = 0.6;
      add(base);
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
      group.add(rotor);
      animators.push((t) => { rotor.rotation.y = t * 6.5; });
      topY = 2.4;
      labelAnchorY = 3.2;

    } else if (type === 'alchemy_table') {
      // 炼宝台 (BD_156, 4×4×5 = 8m×8m 宏伟八角炼宝祭坛)
      const step1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.9, 0.7, 8), mDark);
      step1.position.y = 0.35;
      add(step1);
      const step2 = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 3.1, 0.8, 8), mSlate);
      step2.position.y = 1.1;
      add(step2);
      const cauldron = new THREE.Mesh(new THREE.SphereGeometry(1.35, 18, 18), mPurpleGlow);
      cauldron.position.y = 2.6;
      add(cauldron);
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.12, 10, 32), mYellow);
      ring1.rotation.x = Math.PI / 2;
      ring1.position.y = 2.9;
      add(ring1);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.09, 10, 28), mCyanGlow);
      ring2.rotation.x = Math.PI / 3;
      ring2.position.y = 3.4;
      add(ring2);
      [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]].forEach(([px, pz]) => {
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3.2, 8), mSteel);
        lamp.position.set(px, 2.0, pz);
        add(lamp);
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), mPurpleGlow);
        gem.position.set(px, 3.9, pz);
        add(gem);
      });
      animators.push((t) => {
        ring1.rotation.z = t * 1.6;
        ring2.rotation.z = -t * 2.2;
        cauldron.scale.setScalar(1 + Math.sin(t * 3) * 0.06);
      });
      topY = 5.0;
      labelAnchorY = 5.8;

    } else if (type === 'tribulation_table') {
      // 渡劫台 (BD_157, 5×5×6 = 10m×10m 终局四象引雷阵台)
      const dais1 = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.9, 0.8, 8), mDark);
      dais1.position.y = 0.4;
      add(dais1);
      const dais2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.7, 0.8, 8), mSlate);
      dais2.position.y = 1.2;
      add(dais2);
      [[-3.2, -3.2], [3.2, -3.2], [-3.2, 3.2], [3.2, 3.2]].forEach(([px, pz]) => {
        const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.42, 4.8, 8), mSteel);
        pylon.position.set(px, 3.0, pz);
        add(pylon);
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.08, 8, 16), mCyanGlow);
        coil.rotation.x = Math.PI / 2;
        coil.position.set(px, 5.1, pz);
        add(coil);
      });
      const orb = new THREE.Mesh(new THREE.OctahedronGeometry(1.1, 0), mYellow);
      orb.position.y = 4.2;
      add(orb);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.1, 10, 28), mCyanGlow);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 4.2;
      add(halo);
      animators.push((t) => {
        orb.rotation.y = t * 3.2;
        orb.position.y = 4.2 + Math.sin(t * 4) * 0.25;
        halo.rotation.z = -t * 2.0;
      });
      topY = 6.0;
      labelAnchorY = 6.8;

    } else if (type === 'wind_generator') {
      // 风力发电机 (BD_155, 2×2×4)
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 0.6, 10), mDark);
      base.position.y = 0.3;
      add(base);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.65, 5.4, 12), mSteel);
      tower.position.y = 3.0;
      add(tower);
      const hub = new THREE.Group();
      hub.position.set(0, 5.5, 0.5);
      for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.26, 2.5, 0.1), mCyanGlow);
        blade.geometry.translate(0, 1.25, 0);
        blade.rotation.z = (i * Math.PI * 2) / 3;
        hub.add(blade);
      }
      group.add(hub);
      animators.push((t) => { hub.rotation.z = t * 2.6; });
      topY = 6.2;
      labelAnchorY = 7.2;

    } else if (type === 'fuel_generator' || type === 'power_burner') {
      // 燃料发电机 (BD_149, 2×2×2 = 4m×4m)
      const body = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 3.4), mDark);
      body.position.y = 0.9;
      add(body);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.3, 14), mAmberGlow);
      core.position.set(-0.7, 1.9, 0);
      add(core);
      const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.2, 12), mSteel);
      chimney.position.set(0.95, 2.5, 0);
      add(chimney);
      topY = 3.6;
      labelAnchorY = 4.3;

    } else if (type === 'handcraft') {
      // 操作台 (BD_152, 2×3)
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 4.6), mSteel);
      desk.position.y = 0.55;
      add(desk);
      const holo = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 2.2), mCyanGlow);
      holo.position.y = 1.45;
      add(holo);
      animators.push((t) => { holo.position.y = 1.45 + Math.sin(t * 2.5) * 0.1; });
      topY = 1.8;
      labelAnchorY = 2.6;

    } else if (type === 'storage_box' || type === 'bd_114' || type === 'bd_115') {
      const bh = Math.max(1.0, dimZ * 1.0);
      const box = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, bh - 0.18, D * 0.9), mOrange);
      box.position.y = (bh - 0.18) / 2;
      add(box);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, 0.18, D * 0.94), mDark);
      lid.position.y = bh - 0.09;
      add(lid);
      topY = bh;
      labelAnchorY = bh + 0.7;

    } else if (type === 'storage_desk' || type === 'bd_154') {
      const h = type === 'bd_154' ? 2.0 : 1.0;
      const top = new THREE.Mesh(new THREE.BoxGeometry(W * 0.94, 0.18, D * 0.94), mWood);
      top.position.y = h - 0.09;
      add(top);
      const lx = W * 0.36;
      const lz = D * 0.36;
      [[-lx, -lz], [lx, -lz], [-lx, lz], [lx, lz]].forEach(([px, pz]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, h - 0.18, 0.18), mSteel);
        leg.position.set(px, (h - 0.18) / 2, pz);
        add(leg);
      });
      topY = h;
      labelAnchorY = h + 0.7;

    } else if (type.startsWith('foundation')) {
      const slabH = Math.max(0.5, dimZ * 1.0);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(W - 0.04, slabH - 0.12, D - 0.04), mSteel);
      slab.position.y = (slabH - 0.12) / 2;
      add(slab);
      const rim = new THREE.Mesh(new THREE.BoxGeometry(W - 0.02, 0.12, D - 0.02), mOrange);
      rim.position.y = slabH - 0.06;
      add(rim);
      topY = slabH;
      labelAnchorY = slabH + 0.7;

    } else if (type === 'bd_108' || type === 'bd_109') {
      const steps = type === 'bd_109' ? 8 : 4;
      const totalH = dimZ * 1.0;
      const totalD = D;
      for (let s = 0; s < steps; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(W * 0.9, totalH / steps, totalD / steps), mSteel);
        step.position.set(0, (s + 0.5) * (totalH / steps), -totalD / 2 + (s + 0.5) * (totalD / steps));
        add(step);
      }
      topY = totalH;
      labelAnchorY = totalH + 0.6;

    } else if (type === 'conveyor' || type === 'bd_117' || type === 'bd_118' || type === 'bd_119' || type === 'bd_120') {
      const len = (bld && bld.beltLen) ? bld.beltLen : GRID_UNIT;
      const track = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.24, len), mDark);
      track.position.y = 0.52;
      if (type === 'bd_119') track.rotation.x = 0.35;
      if (type === 'bd_120') track.rotation.x = -0.35;
      add(track);
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, len), mOrange);
      railL.position.set(-0.6, 0.56, 0);
      const railR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, len), mOrange);
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
      const h = (bld && bld.liftHeight) ? bld.liftHeight : 4.0;
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
        const yPos = 0.6 + ((t * 1.8) % Math.max(1.5, h - 0.8));
        liftTray.position.y = yPos;
        liftItem.position.y = yPos + 0.25;
      });
      topY = h;
      labelAnchorY = h + 0.6;

    } else if (type === 'splitter' || type === 'bd_122' || type === 'bd_123' || type === 'bd_124' || type === 'bd_125' || type === 'bd_126' || type === 'bd_161' || type === 'bd_162' || type === 'conveyor_limiter') {
      const isSmart = type === 'bd_125' || type === 'bd_126' || type === 'bd_161' || type === 'bd_162';
      const isLimiter = type === 'conveyor_limiter';
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.25, 1.9), mSteel);
      box.position.y = 0.625;
      add(box);
      const topTrim = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.24, 1.55), isLimiter ? mAmberGlow : (isSmart ? mCyanGlow : mOrange));
      topTrim.position.y = 1.35;
      add(topTrim);
      topY = 1.5;
      labelAnchorY = 2.1;

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
      const body = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 1.6, 12), mFluidDark);
      body.position.y = 0.8;
      add(body);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.3, 14), mCyanGlow);
      tank.position.y = 2.2;
      add(tank);
      topY = 2.9;
      labelAnchorY = 3.5;

    } else if (type === 'purifier' || type === 'purify_tower') {
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 1.55, 3.6, 10), mSteel);
      spire.position.y = 1.8;
      add(spire);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), mEmeraldGlow);
      orb.position.y = 4.2;
      add(orb);
      animators.push((t) => { orb.position.y = 4.2 + Math.sin(t * 3) * 0.25; });
      topY = 4.9;
      labelAnchorY = 5.5;

    } else if (type === 'portal' || type === 'teleporter') {
      const frame = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.3, 12, 28), mDark);
      frame.position.y = 2.1;
      add(frame);
      const vortex = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.16, 10, 24), mPurpleGlow);
      vortex.position.y = 2.1;
      add(vortex);
      animators.push((t) => { vortex.rotation.z = t * 3.0; });
      topY = 4.0;
      labelAnchorY = 4.6;

    } else {
      const base = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.8, W * 0.85), 1.4, Math.max(1.8, D * 0.85)), mDark);
      base.position.y = 0.7;
      add(base);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 1.1, 14), mOrange);
      core.position.y = 1.9;
      add(core);
      animators.push((t) => { core.rotation.y = t * 1.4; });
      topY = 2.5;
      labelAnchorY = 3.2;
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
    const isLinear = type === 'conveyor' || type === 'bd_117' || type === 'bd_118' || type === 'bd_119' || type === 'bd_120' || type === 'vert_conveyor' || type === 'bd_121' || type === 'pipe' || type.startsWith('bd_128') || type.startsWith('bd_129') || type.startsWith('bd_130') || type.startsWith('bd_131') || type.startsWith('bd_132') || type.startsWith('bd_133');
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
        const rcp = XIUXIAN_RECIPES[bDef2.recipes[0]];
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
    interactableMeshes.length = 0;

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

      // 创建 2D 投影标签
      let labelEl = null;
      if (labelLayer) {
        labelEl = document.createElement('div');
        labelEl.className = 'world3d-label absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity duration-150';
        labelEl.innerHTML = `
          <div class="flex items-center space-x-1.5 bg-black/80 backdrop-blur-sm border border-[#f5921e]/80 px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></span>
            <span class="text-[11px] font-bold text-amber-300 font-mono">${bld.tagTitle || bld.name}</span>
            <span class="text-[9px] text-white/60 bg-white/10 px-1 rounded">${bld.power || '0 MW'}</span>
          </div>
        `;
        labelLayer.appendChild(labelEl);
      }

      buildingMeshMap.set(bld.id, { group, bld, animators, labelAnchorY: (bld.wy || 0) + labelAnchorY, topY, labelEl });
    });

    applyFloorVisibility();
  }

  function isBuildingVisibleInFloorMode(bld) {
    const wy = bld.wy || 0;
    if (visibleFloorMode === '1f') return wy < 6;
    if (visibleFloorMode === '2f') return wy < 13;
    if (visibleFloorMode === '3f') return wy >= 13;
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
      if (e.code === 'Home') {
        resetCamera();
      }
      if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode) {
        if (e.code === 'BracketRight' || e.code === 'PageUp') {
          manualStackY = Math.min(12, Math.round((manualStackY + 0.7) * 10) / 10);
        } else if (e.code === 'BracketLeft' || e.code === 'PageDown') {
          manualStackY = Math.max(0, Math.round((manualStackY - 0.7) * 10) / 10);
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isOrbitDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        if (isPanDragging) {
          const panScale = camState.distance * 0.0014;
          const sinY = Math.sin(camState.yaw);
          const cosY = Math.cos(camState.yaw);
          camState.target.x += (-cosY * dx - sinY * dy) * panScale;
          camState.target.z += (sinY * dx - cosY * dy) * panScale;
          camState.target.x = Math.max(-55, Math.min(55, camState.target.x));
          camState.target.z = Math.max(-55, Math.min(55, camState.target.z));
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
      if (isModalBlockingWorld()) return;
      if (e.target.closest('button, input, select, a, .hud-panel, #dspBuildHotbarRoot, #combatHudBar, #sysActionsContainer, #buildModeHudOverlay, #dismantleConsoleStrip, #buildModal, #craftModal, #invModal, #machineModal, #storageBoxModal, #cpuProcessorModal, #jinShenModal, #fabaoModal, #codexModal, #hubMilestoneModal')) {
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
      if (!isModalBlockingWorld() && !e.target.closest('button, input')) {
        e.preventDefault();
        // 右键短按槽位可快速替换复合建筑插件
        if (dragDistance < 6 && hoveredHit && hoveredHit.isTopSlot) {
          if (hoveredHit.slotType === 'fluid_hub' && typeof cycleFluidHubPlugin === 'function') {
            cycleFluidHubPlugin();
          } else if (hoveredHit.slotType === 'bio_base' && typeof cycleBioBasePlugin === 'function') {
            cycleBioBasePlugin();
          }
        }
      }
    });

    document.addEventListener('wheel', (e) => {
      if (isModalBlockingWorld()) return;
      if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode) return; // 建造模式下滚轮交给旋转逻辑
      if (e.target.closest('#buildModal, #craftModal, #invModal, #machineModal, #codexModal, #cpuProcessorModal, #jinShenModal, #fabaoModal')) return;

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
    if (id === 'conveyor' || id === 'bd_117' || id === 'bd_118' || id === 'bd_119' || id === 'bd_120' || id === 'vert_conveyor' || id === 'bd_121') {
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
    if (id === 'splitter' || id === 'bd_122' || id === 'bd_123' || id === 'bd_124' || id === 'bd_125' || id === 'bd_126' || id === 'bd_161' || id === 'bd_162') {
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
    if (typeof openMachineHUD === 'function') {
      openMachineHUD(id);
    }
  }

  function resetCamera() {
    camState.target.set(3, 7.5, 2);
    camState.yaw = -0.42;
    camState.pitch = 0.44;
    camState.distance = 56;
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

    // A. 建造模式：3D 积木搭建、顶面堆叠与母座插槽吸附 (严格遵守策划表 topStackable 与 dimX/Y/Z)
    if (typeof isBuildPlacingMode !== 'undefined' && isBuildPlacingMode && groundPlane) {
      const placeKey = (typeof currentPlacingBuildingKey !== 'undefined') ? currentPlacingBuildingKey : 'foundation';
      window._world3DSlotSnapTarget = null;
      window._world3DPlacementBlockedReason = null;

      const bldHits = raycaster.intersectObjects(visibleInteractableMeshes, false);
      const groundHits = raycaster.intersectObject(groundPlane);
      const subModeEl = document.getElementById('buildPlacingSubMode');
      const placeDef = getBuildingTableDef(placeKey);
      const stepGrid = GRID_UNIT;

      if (bldHits.length > 0 && hologramGroup) {
        const hit = bldHits[0];
        const targetBld = hit.object.userData.bld;
        const targetEntry = targetBld ? buildingMeshMap.get(targetBld.id) : null;
        const targetGroup = targetEntry ? targetEntry.group : null;

        // 1. 复合母座插槽吸附 (例如把 冶炼舱 吸到 灵力引擎 上，或 搅拌机/萃取塔 吸到 流体中枢 上)
        if (targetBld && targetBld.type === 'power_engine' && (placeKey === 'smelt_chamber' || placeKey === 'furnace')) {
          const localX = targetGroup ? hit.point.x - targetGroup.position.x : 0;
          const slotIdx = localX < -0.65 ? 0 : (localX > 0.65 ? 2 : 1);
          const sx = (slotIdx - 1) * 1.35;
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(targetGroup.position.x + sx, targetGroup.position.y + 1.85, targetGroup.position.z);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = { type: 'engine_chamber', slotIndex: slotIdx };
          window._world3DPlaceCoords = { wx: hologramGroup.position.x, wy: hologramGroup.position.y, wz: hologramGroup.position.z };
          if (subModeEl) subModeEl.innerText = `🔌 积木插槽吸附: 灵力引擎 #${slotIdx + 1}`;
          return;
        }
        if (targetBld && targetBld.type === 'fluid_hub' && (placeKey === 'mixer' || placeKey === 'extractor')) {
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(targetGroup.position.x, targetGroup.position.y + 1.65, targetGroup.position.z);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = { type: 'fluid_hub' };
          window._world3DPlaceCoords = { wx: hologramGroup.position.x, wy: hologramGroup.position.y, wz: hologramGroup.position.z };
          if (subModeEl) subModeEl.innerText = `🔌 积木插槽吸附: 流体中枢顶部`;
          return;
        }
        if (targetBld && targetBld.type === 'bio_base' && (placeKey === 'incubator' || placeKey === 'petri_dish')) {
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(targetGroup.position.x, targetGroup.position.y + 1.55, targetGroup.position.z);
          hologramGroup.rotation.y = targetGroup.rotation.y;
          window._world3DSlotSnapTarget = { type: 'bio_base' };
          window._world3DPlaceCoords = { wx: hologramGroup.position.x, wy: hologramGroup.position.y, wz: hologramGroup.position.z };
          if (subModeEl) subModeEl.innerText = `🔌 积木插槽吸附: 营养基座顶部`;
          return;
        }

        // 2. 积木顶面堆叠 / 侧面贴合 (读取 bd_table.xlsx 的 topStackable)
        if (targetGroup) {
          const n = hit.face ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld) : new THREE.Vector3(0, 1, 0);
          let snapX, snapY, snapZ;
          if (n.y > 0.45) {
            if (!targetGroup.userData.topStackable) {
              window._world3DPlacementBlockedReason = `${targetBld.name || '该设施'} 顶部不可放 (策划表: 否)`;
            }
            snapY = Math.round((targetGroup.position.y + (targetGroup.userData.topY || 1.6)) * 100) / 100;
            snapX = Math.round(hit.point.x / stepGrid) * stepGrid;
            snapZ = Math.round(hit.point.z / stepGrid) * stepGrid;
            if (subModeEl) {
              subModeEl.innerText = window._world3DPlacementBlockedReason
                ? `⛔ 顶部不可放置 (${targetBld.name})`
                : `🧱 积木顶面堆叠: +${snapY.toFixed(1)}m (${placeDef ? `${placeDef.dimX}×${placeDef.dimY}×${placeDef.dimZ}格` : ''})`;
            }
          } else {
            snapY = targetGroup.position.y;
            snapX = Math.round((hit.point.x + n.x * stepGrid) / stepGrid) * stepGrid;
            snapZ = Math.round((hit.point.z + n.z * stepGrid) / stepGrid) * stepGrid;
            if (subModeEl) subModeEl.innerText = `🧱 积木侧面贴合: +${snapY.toFixed(1)}m`;
          }
          updateHologram(placeKey);
          hologramGroup.visible = true;
          hologramGroup.position.set(snapX, snapY, snapZ);
          hologramGroup.rotation.y = -((typeof placingRotationAngle !== 'undefined' ? placingRotationAngle : 0) * Math.PI) / 180;
          window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
          return;
        }
      }

      if (groundHits.length > 0 && hologramGroup) {
        updateHologram(placeKey);
        const pt = groundHits[0].point;
        const snapX = Math.round(pt.x / stepGrid) * stepGrid;
        const snapZ = Math.round(pt.z / stepGrid) * stepGrid;
        const snapY = manualStackY;
        hologramGroup.visible = true;
        hologramGroup.position.set(snapX, snapY + 0.02, snapZ);
        hologramGroup.rotation.y = -((typeof placingRotationAngle !== 'undefined' ? placingRotationAngle : 0) * Math.PI) / 180;
        window._world3DPlaceCoords = { wx: snapX, wy: snapY, wz: snapZ };
        const dimTxt = placeDef ? `${placeDef.dimX}×${placeDef.dimY}×${placeDef.dimZ}格` : '';
        if (subModeEl) subModeEl.innerText = snapY > 0 ? `🧱 悬空高度: +${snapY.toFixed(1)}m (${dimTxt})` : `📐 地面网格对齐 (${dimTxt} · [ / ] 调高)`;
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
    const hits = raycaster.intersectObjects(visibleInteractableMeshes, false);
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

  function updateHighlightsAndLabels() {
    const dismantleOn = (typeof isDismantleMode !== 'undefined' && isDismantleMode);
    const vec = new THREE.Vector3();

    if (hoverBoxHelper) {
      if (hoveredHit && hoveredHit.bld && buildingMeshMap.has(hoveredHit.bld.id)) {
        const targetEntry = buildingMeshMap.get(hoveredHit.bld.id);
        hoverBoxHelper.setFromObject(targetEntry.group);
        hoverBoxHelper.material.color.setHex(dismantleOn ? 0xff5500 : 0x00f0ff);
        hoverBoxHelper.visible = true;
      } else {
        hoverBoxHelper.visible = false;
      }
    }

    buildingMeshMap.forEach((entry) => {
      const { group, bld, labelAnchorY, labelEl } = entry;
      const isHovered = hoveredHit && hoveredHit.bld.id === bld.id;

      // 投影 3D 标签到屏幕坐标 (默认仅悬停时显示，避免标签堆叠遮挡 3D 场景)
      if (labelEl) {
        if (!group.visible || (!isHovered && !showAll3DLabels)) {
          labelEl.style.opacity = '0';
        } else {
          vec.set(group.position.x, labelAnchorY, group.position.z);
          vec.project(camera);
          if (vec.z > 1 || vec.z < -1) {
            labelEl.style.opacity = '0';
          } else {
            const sx = (vec.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (-vec.y * 0.5 + 0.5) * window.innerHeight;
            labelEl.style.left = `${sx}px`;
            labelEl.style.top = `${sy}px`;
            labelEl.style.opacity = isHovered ? '1' : '0.72';
            labelEl.style.zIndex = isHovered ? '25' : '12';
          }
        }
      }
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    animTime += dt;

    updateRaycastAndHologram();

    // 驱动所有建筑动画
    buildingMeshMap.forEach((entry) => {
      entry.animators.forEach((fn) => fn(animTime));
    });

    // 驱动仙山浮动与灵气微粒
    environmentGroup.children.forEach((child) => {
      if (child.userData && typeof child.userData.floatBaseY === 'number') {
        child.position.y = child.userData.floatBaseY + Math.sin(animTime * 0.8 + child.userData.floatPhase) * 0.7;
      }
    });
    if (particlesMesh) {
      particlesMesh.rotation.y = animTime * 0.02;
    }

    updateHighlightsAndLabels();
    renderer.render(scene, camera);
  }

  function toggleAllLabels() {
    showAll3DLabels = !showAll3DLabels;
    if (typeof showNotification === 'function') {
      showNotification(showAll3DLabels ? '已开启【显示全部 3D 标签】' : '已切换为【仅悬停显示标签】(清爽视界)');
    }
    return showAll3DLabels;
  }

  // 对外暴露 API
  window.World3D = {
    isReady: () => isInitialized,
    syncBuildings,
    updateHologram,
    resetCamera,
    toggleAllLabels,
    cycleFloorView,
    openLogisticsConfig: openLogisticsConfigModal,
    getHoveredBuilding: () => (hoveredHit ? hoveredHit.bld : null)
  };

  window.addEventListener('DOMContentLoaded', () => {
    init();
  });
})();
