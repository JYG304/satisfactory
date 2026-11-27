// ====================================================================
// js/world/world_logistics_fx.js - 3D 实体物流特效模块
// 负责御剑道标（悬浮八卦剑环+细流光航线+整匣携矿飞剑+返程雷珠供电）、仙鹤空投与天雷闪电
// ====================================================================

(function () {
  let logisticsFxGroup = null;
  const flyingSwords = [];
  const waypointRings = [];
  const swordGuideFlows = [];
  const swordLaunchEffects = [];
  const swordCatchEffects = [];
  const flyingCranes = [];
  const craneLaunchArrays = [];
  const skyShuttles = [];
  const lightningBolts = [];
  const wonderProjectiles = [];
  const powerPulses = [];
  const altarTotems = [];
  let starArrayState = null;
  const starBeamPulses = [];
  let blackBoxState = null;
  let _THREE = null;
  let _tmpSphere = null;

  const ORE_COLOR_MAP = {
    MAT_001: 0x38bdf8,
    MAT_002: 0xf59e0b,
    MAT_006: 0x22d3ee,
    MAT_007: 0xa855f7
  };

  function createGlowTexture(THREE) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (typeof ctx.createRadialGradient === 'function') {
        const grad = ctx.createRadialGradient(32, 32, 1, 32, 32, 31);
        grad.addColorStop(0, 'rgba(255,255,245,1)');
        grad.addColorStop(0.25, 'rgba(254,243,199,0.92)');
        grad.addColorStop(0.55, 'rgba(253,224,71,0.45)');
        grad.addColorStop(1, 'rgba(253,224,71,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(16, 16, 32, 32);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createRuneArrayTexture(THREE) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 256, 256);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(128, 128, 114, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(128, 128, 86, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(128, 128, 46, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(128 + Math.cos(a) * 46, 128 + Math.sin(a) * 46);
        ctx.lineTo(128 + Math.cos(a) * 114, 128 + Math.sin(a) * 114);
        ctx.stroke();
        ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
        ctx.beginPath();
        ctx.arc(128 + Math.cos(a + 0.2) * 100, 128 + Math.sin(a + 0.2) * 100, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createLabelTexture(THREE, text, borderColor, textColor, bgColor) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 512, 128);
      ctx.fillStyle = bgColor || 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(8, 12, 496, 104);
      ctx.strokeStyle = borderColor || '#a855f7';
      ctx.lineWidth = 5;
      ctx.strokeRect(8, 12, 496, 104);
      ctx.fillStyle = textColor || '#fde047';
      ctx.font = 'bold 34px "Microsoft YaHei", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function createRibbonTrail(THREE, count, headColorHex, midColorHex, glowDotTex, pointSize) {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cHead = new THREE.Color(headColorHex);
    const cMid = new THREE.Color(midColorHex);
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const fade = Math.pow(1 - t, 1.5);
      const mix = t < 0.28 ? t / 0.28 : 1.0;
      const r = (cHead.r * (1 - mix) + cMid.r * mix) * fade;
      const g = (cHead.g * (1 - mix) + cMid.g * mix) * fade;
      const b = (cHead.b * (1 - mix) + cMid.b * mix) * fade;
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    const geo = new THREE.BufferGeometry();
    if (typeof geo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const line = new THREE.Line(geo, lineMat);
    line.frustumCulled = false;
    const ptsMat = new THREE.PointsMaterial({
      size: pointSize || 3.8,
      sizeAttenuation: true,
      map: glowDotTex || null,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const points = new THREE.Points(geo, ptsMat);
    points.frustumCulled = false;
    return { geo, positions, line, points, count, initialized: false };
  }

  function pushTrailPoint(trail, x, y, z) {
    const pos = trail.positions;
    if (!trail.initialized) {
      for (let i = 0; i < trail.count; i++) {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
      }
      trail.initialized = true;
    } else {
      for (let i = trail.count - 1; i > 0; i--) {
        pos[i * 3] = pos[(i - 1) * 3];
        pos[i * 3 + 1] = pos[(i - 1) * 3 + 1];
        pos[i * 3 + 2] = pos[(i - 1) * 3 + 2];
      }
      pos[0] = x;
      pos[1] = y;
      pos[2] = z;
    }
    if (trail.geo && trail.geo.attributes && trail.geo.attributes.position) {
      trail.geo.attributes.position.needsUpdate = true;
    }
  }

  function defaultStdMat(THREE, color, roughness = 0.5, metalness = 0.3, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      emissive,
      emissiveIntensity
    });
  }

  function rebuild(opts) {
    const { THREE, scene, worldBuildings, getMat, stdMat } = opts || {};
    if (!THREE || !scene || typeof worldBuildings === 'undefined') return;
    _THREE = THREE;
    if (!_tmpSphere && typeof THREE.Sphere === 'function') {
      _tmpSphere = new THREE.Sphere();
    }

    if (!logisticsFxGroup) {
      logisticsFxGroup = new THREE.Group();
      scene.add(logisticsFxGroup);
    }
    while (logisticsFxGroup.children.length > 0) {
      logisticsFxGroup.remove(logisticsFxGroup.children[0]);
    }
    flyingSwords.length = 0;
    waypointRings.length = 0;
    swordGuideFlows.length = 0;
    swordLaunchEffects.length = 0;
    swordCatchEffects.length = 0;
    flyingCranes.length = 0;
    craneLaunchArrays.length = 0;
    skyShuttles.length = 0;
    lightningBolts.length = 0;
    wonderProjectiles.length = 0;
    powerPulses.length = 0;
    altarTotems.length = 0;
    starArrayState = null;
    starBeamPulses.length = 0;
    blackBoxState = null;

    const glowDotTex = createGlowTexture(THREE);
    const glowTex = glowDotTex;
    const runeArrayTex = createRuneArrayTexture(THREE);
    const buffLabelTex = createLabelTexture(THREE, '增产 +35%', '#fbbf24', '#fef08a', 'rgba(69, 26, 3, 0.78)');
    const repairLabelTex = createLabelTexture(THREE, '灵阵修缮', '#34d399', '#a7f3d0', 'rgba(6, 78, 59, 0.78)');
    const bbLabelTex = createLabelTexture(THREE, '极限黑箱 · 原矿进 / 金丹出', '#a855f7', '#fde047', 'rgba(15, 23, 42, 0.85)');

    const makeStd = typeof stdMat === 'function'
      ? stdMat
      : (c, r, m, e, ei) => defaultStdMat(THREE, c, r, m, e, ei);
    const cacheMat = typeof getMat === 'function'
      ? getMat
      : (_key, fn) => fn();

    const cranes = worldBuildings.filter(b => b.type === 'crane_distributor');
    const storages = worldBuildings.filter(b => ['storage_box', 'bd_113', 'bd_114', 'bd_115', 'assembler', 'furnace_mk2', 'recomposer_mk3'].includes(b.type));
    const skyRails = worldBuildings.filter(b => ['sky_rail', 'sky_launcher', 'sky_conveyor', 'bd_154', 'bd_160'].includes(b.type));
    const thunders = worldBuildings.filter(b => ['thunder_accumulator', 'immortal_receiver'].includes(b.type));

    const swordBladeMat = cacheMat('fx_sword_blade', () => makeStd(0x22d3ee, 0.15, 0.7, 0x06b6d4, 0.95));
    const swordHiltMat = cacheMat('fx_sword_hilt', () => makeStd(0xfbbf24, 0.25, 0.8, 0xd97706, 0.65));
    const craneBodyMat = cacheMat('fx_crane_body', () => makeStd(0xf8fafc, 0.4, 0.2, 0xe2e8f0, 0.35));
    const cargoMat = cacheMat('fx_cargo_box', () => makeStd(0xf59e0b, 0.3, 0.4, 0xd97706, 0.65));
    const railBeamMat = cacheMat('fx_skyrail_beam', () => makeStd(0x06b6d4, 0.2, 0.5, 0x0ea5e9, 0.85));
    const railGoldMat = cacheMat('fx_skyrail_gold', () => makeStd(0xfbbf24, 0.25, 0.6, 0xd97706, 0.75));
    const pylonMat = cacheMat('fx_skyrail_pylon', () => makeStd(0x1e293b, 0.65, 0.45));

    // 1. 主厂区御剑道标环线（悬浮八卦剑环 + 极细剑意航线，彻底取代笨重高架横梁）
    const placedBeaconKeys = new Set();
    function addSwordWaypointBeacon(px, py, pz, lookTarget) {
      const bKey = `${Math.round(px)}_${Math.round(pz)}`;
      if (placedBeaconKeys.has(bKey)) return;
      placedBeaconKeys.add(bKey);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.15, 0.26, 8), pylonMat);
      base.position.set(px, 0.13, pz);
      const tether = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, py, 6),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, depthWrite: false })
      );
      tether.position.set(px, py * 0.5, pz);
      logisticsFxGroup.add(base, tether);

      const ringGrp = new THREE.Group();
      ringGrp.position.set(px, py, pz);
      if (lookTarget) {
        ringGrp.lookAt(lookTarget.x, py, lookTarget.z);
      }
      const outer = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.085, 6, 8), railGoldMat);
      const inner = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.055, 6, 24), railBeamMat);
      ringGrp.add(outer, inner);
      logisticsFxGroup.add(ringGrp);
      waypointRings.push({ outer, inner, phase: (px + pz) * 0.04 });
    }

    function addSpiritGuideLine(a, b, colorHex, dashedFlow) {
      const len = a.distanceTo(b);
      if (len < 0.2) return;
      if (dashedFlow && typeof THREE.LineDashedMaterial === 'function') {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
        const lineMat = new THREE.LineDashedMaterial({
          color: colorHex || 0x38bdf8,
          dashSize: 2.4,
          gapSize: 1.6,
          transparent: true,
          opacity: 0.42,
          depthWrite: false
        });
        const line = new THREE.Line(lineGeo, lineMat);
        if (typeof line.computeLineDistances === 'function') line.computeLineDistances();
        logisticsFxGroup.add(line);
        return;
      }
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const lineGeo = new THREE.CylinderGeometry(0.035, 0.035, len, 6);
      lineGeo.rotateX(Math.PI / 2);
      const lineMat = new THREE.MeshBasicMaterial({
        color: colorHex || 0x38bdf8,
        transparent: true,
        opacity: 0.34,
        depthWrite: false
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.copy(mid);
      line.lookAt(b);
      logisticsFxGroup.add(line);
    }

    // 1. 厂区内部已移除近距离飞剑环线（<100m 全部回归传送带与垂直传送带）；仅保留远途重载飞剑列车干线
    const thunderOrbMat = cacheMat('fx_thunder_orb', () => makeStd(0x38bdf8, 0.15, 0.4, 0x0ea5e9, 1.35));
    const fxSwordBladeGeo = new THREE.ConeGeometry(0.32, 3.1, 4);
    fxSwordBladeGeo.rotateX(Math.PI / 2);
    const fxSwordGuardGeo = new THREE.BoxGeometry(1.15, 0.16, 0.24);
    const fxSwordHiltGeo = new THREE.CylinderGeometry(0.10, 0.10, 0.78, 6);
    fxSwordHiltGeo.rotateX(Math.PI / 2);
    const fxTrailConeGeo = new THREE.ConeGeometry(0.40, 6.0, 6);
    fxTrailConeGeo.rotateX(-Math.PI / 2);
    const fxRibbonHGeo = new THREE.BoxGeometry(1.05, 0.04, 6.2);
    const fxRibbonVGeo = new THREE.BoxGeometry(0.04, 0.62, 6.2);
    const fxWakeRing1Geo = new THREE.TorusGeometry(0.46, 0.05, 6, 16);
    const fxWakeRing2Geo = new THREE.TorusGeometry(0.34, 0.04, 6, 16);
    const fxIngotGeo = new THREE.BoxGeometry(0.32, 0.28, 0.38);
    const fxThunderOrbGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const fxRibbonHMat = cacheMat('fx_ribbon_h', () => new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.44, depthWrite: false }));
    const fxRibbonVMat = cacheMat('fx_ribbon_v', () => new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.34, depthWrite: false }));
    const fxWakeRing2Mat = cacheMat('fx_wake_ring2', () => new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.5, depthWrite: false }));
    const fxSwordRainbowPlaneGeo = new THREE.PlaneGeometry(0.85, 7.5);
    const fxSwordRainbowGoldMat = cacheMat('fx_sword_rainbow_gold', () => new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    }));

    function createSwordMesh(oreColorHex, isLeadLocomotive = false) {
      const sword = new THREE.Group();
      const scaleMult = isLeadLocomotive ? 1.55 : 1.32;
      const blade = new THREE.Mesh(fxSwordBladeGeo, isLeadLocomotive ? railGoldMat : swordBladeMat);
      blade.position.z = 0.95;
      blade.scale.setScalar(scaleMult);
      const guard = new THREE.Mesh(fxSwordGuardGeo, swordHiltMat);
      guard.position.z = -0.4;
      const hilt = new THREE.Mesh(fxSwordHiltGeo, swordHiltMat);
      hilt.position.z = -0.82;

      const trailColor = oreColorHex || 0x22d3ee;
      const trailMat = cacheMat(`fx_trail_bright_${trailColor}`, () => new THREE.MeshBasicMaterial({ color: trailColor, transparent: true, opacity: 0.90, depthWrite: false }));
      const wakeRing1Mat = cacheMat(`fx_wake1_bright_${trailColor}`, () => new THREE.MeshBasicMaterial({ color: trailColor, transparent: true, opacity: 0.85, depthWrite: false }));
      const rainbowCyanMat = cacheMat(`fx_sword_rainbow_cyan_${trailColor}`, () => new THREE.MeshBasicMaterial({
        color: trailColor,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      }));

      const trailGroup = new THREE.Group();
      const corePlume = new THREE.Mesh(fxTrailConeGeo, trailMat);
      corePlume.scale.set(1.4, 1.4, 1.35);
      corePlume.position.z = -4.5;
      const ribbonH = new THREE.Mesh(fxRibbonHGeo, fxRibbonHMat);
      ribbonH.scale.set(1.5, 1, 1.3);
      ribbonH.position.z = -4.2;
      const ribbonV = new THREE.Mesh(fxRibbonVGeo, fxRibbonVMat);
      ribbonV.scale.set(1, 1.5, 1.3);
      ribbonV.position.z = -4.2;
      const rainbowH = new THREE.Mesh(fxSwordRainbowPlaneGeo, rainbowCyanMat);
      rainbowH.rotation.set(-Math.PI / 2, 0, 0);
      rainbowH.position.z = -4.55;
      const rainbowV = new THREE.Mesh(fxSwordRainbowPlaneGeo, fxSwordRainbowGoldMat);
      rainbowV.rotation.set(-Math.PI / 2, Math.PI / 2, 0);
      rainbowV.position.z = -4.55;
      const wakeRing1 = new THREE.Mesh(fxWakeRing1Geo, wakeRing1Mat);
      wakeRing1.scale.setScalar(1.35);
      wakeRing1.position.z = -1.6;
      const wakeRing2 = new THREE.Mesh(fxWakeRing2Geo, fxWakeRing2Mat);
      wakeRing2.scale.setScalar(1.35);
      wakeRing2.position.z = -3.0;
      trailGroup.add(corePlume, ribbonH, ribbonV, rainbowH, rainbowV, wakeRing1, wakeRing2);

      // 连续 24 点光带拖尾（矿石色叠加金色核心，Line + Points 共享 BufferGeometry）
      const ribbonTrail = createRibbonTrail(THREE, 24, 0xfde047, trailColor, glowDotTex, 4.2);
      logisticsFxGroup.add(ribbonTrail.line, ribbonTrail.points);

      // 剑身加色混合辉光 Sprite
      const glowSpriteMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: trailColor,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const glowSprite = new THREE.Sprite(glowSpriteMat);
      glowSprite.scale.set(isLeadLocomotive ? 4.2 : 3.4, isLeadLocomotive ? 4.2 : 3.4, 1);

      const crateMat = oreColorHex
        ? cacheMat(`fx_crate_${oreColorHex}`, () => makeStd(oreColorHex, 0.25, 0.45, oreColorHex, 0.75))
        : cargoMat;
      // 双层重载矿箱（体现火车大宗货运量）
      const cargo = new THREE.Group();
      cargo.position.set(0, -0.74, 0.06);
      const layers = isLeadLocomotive ? 1 : 2;
      for (let ly = 0; ly < layers; ly++) {
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            const ingot = new THREE.Mesh(fxIngotGeo, crateMat);
            ingot.position.set((r - 0.5) * 0.36, -ly * 0.30, (c - 1) * 0.40);
            cargo.add(ingot);
          }
        }
      }

      const thunderOrb = new THREE.Mesh(fxThunderOrbGeo, thunderOrbMat);
      thunderOrb.position.set(0, -0.58, 0.06);
      thunderOrb.visible = false;

      sword.add(blade, guard, hilt, trailGroup, glowSprite, cargo, thunderOrb);
      return { sword, cargo, thunderOrb, trailGroup, wakeRing1, wakeRing2, ribbonTrail, glowSprite };
    }

    // 1B. 500×500 跨图远境富矿御剑航线（悬浮剑环道标定航路 + 主干剑道多矿并线 + 终点莲台分流 + 返程雷珠供电）
    const catapults = worldBuildings.filter(b => b && b.type === 'sword_catapult');
    const lotuses = worldBuildings.filter(b => b && b.type === 'lotus_catcher');
    const fxLaunchRingGeo = new THREE.RingGeometry(0.9, 1.8, 24);
    const fxLaunchPillarGeo = new THREE.CylinderGeometry(0.35, 0.9, 14, 8, 1, true);
    const fxLotusRingGeo = new THREE.RingGeometry(0.7, 2.2, 8);

    function buildSwordCorridor(sx, sz, trunkX, ex, ez, oreId, swordCount) {
      const hOut = 11.5;
      const hRet = 13.2;
      const oreColor = ORE_COLOR_MAP[oreId] || 0x38bdf8;
      const outPts = [
        new THREE.Vector3(sx, 1.8, sz),
        new THREE.Vector3(sx, hOut, sz),
        new THREE.Vector3(trunkX, hOut, sz),
        new THREE.Vector3(ex, hOut, sz),
        new THREE.Vector3(ex, hOut, ez),
        new THREE.Vector3(ex, 1.8, ez)
      ];
      const retPts = [
        new THREE.Vector3(ex, 1.8, ez),
        new THREE.Vector3(ex, hRet, ez),
        new THREE.Vector3(ex, hRet, sz),
        new THREE.Vector3(trunkX, hRet, sz),
        new THREE.Vector3(sx, hRet, sz),
        new THREE.Vector3(sx, 1.8, sz)
      ];
      const routeSegs = [];
      const outSegs = [];
      let routeLen = 0;
      for (let i = 0; i < outPts.length - 1; i++) {
        const a = outPts[i];
        const b = outPts[i + 1];
        const len = a.distanceTo(b);
        if (len < 0.2) continue;
        routeSegs.push({ a, b, len });
        outSegs.push({ a, b, len });
        routeLen += len;
        if (i >= 1 && i <= 3) {
          addSpiritGuideLine(a, b, oreColor, true);
          addSwordWaypointBeacon(a.x, hOut, a.z, b);
          if (len > 54) {
            const steps = Math.floor(len / 48);
            for (let s = 1; s < steps; s++) {
              const midPt = new THREE.Vector3().lerpVectors(a, b, s / steps);
              addSwordWaypointBeacon(midPt.x, hOut, midPt.z, b);
            }
          }
        }
      }
      addSwordWaypointBeacon(ex, hOut, ez, new THREE.Vector3(ex, hOut, sz));

      const outboundEndDist = routeLen;
      for (let i = 0; i < retPts.length - 1; i++) {
        const a = retPts[i];
        const b = retPts[i + 1];
        const len = a.distanceTo(b);
        if (len < 0.2) continue;
        routeSegs.push({ a, b, len });
        routeLen += len;
      }

      // 航线慢速流动虚线光点（16颗沿去程高空段缓慢流动）
      const guideCount = 16;
      const guidePos = new Float32Array(guideCount * 3);
      const guideGeo = new THREE.BufferGeometry();
      if (typeof guideGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
        guideGeo.setAttribute('position', new THREE.BufferAttribute(guidePos, 3));
      }
      const guidePts = new THREE.Points(guideGeo, new THREE.PointsMaterial({
        size: 1.05,
        color: oreColor,
        map: glowTex,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      guidePts.frustumCulled = false;
      logisticsFxGroup.add(guidePts);
      swordGuideFlows.push({ pts: guidePts, geo: guideGeo, pos: guidePos, count: guideCount, segs: outSegs, totalLen: outboundEndDist, cx: (sx + ex) * 0.5, cz: (sz + ez) * 0.5 });

      const trainSpeed = Math.max(0.055, 34.0 / Math.max(routeLen, 1));

      // 发货台起飞冲击波 + 竖直光柱
      const launchRingMat = new THREE.MeshBasicMaterial({ color: oreColor, side: THREE.DoubleSide, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const launchRing = new THREE.Mesh(fxLaunchRingGeo, launchRingMat);
      launchRing.rotation.x = Math.PI / 2;
      launchRing.position.set(sx, 1.4, sz);
      const launchPillarMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const launchPillar = new THREE.Mesh(fxLaunchPillarGeo, launchPillarMat);
      launchPillar.position.set(sx, 8.2, sz);
      logisticsFxGroup.add(launchRing, launchPillar);
      swordLaunchEffects.push({ x: sx, z: sz, ring: launchRing, ringMat: launchRingMat, pillar: launchPillar, pillarMat: launchPillarMat, speed: trainSpeed });

      // 收货台莲花光环脉冲 + 火花迸射
      const catchHaloMat = new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const catchHalo = new THREE.Mesh(fxLotusRingGeo, catchHaloMat);
      catchHalo.rotation.x = Math.PI / 2;
      catchHalo.position.set(ex, 1.8, ez);
      const sparkCount = 16;
      const sparkPos = new Float32Array(sparkCount * 3);
      const sparkVel = [];
      for (let sk = 0; sk < sparkCount; sk++) {
        const ang = (sk / sparkCount) * Math.PI * 2;
        const spd = 2.5 + (sk % 3) * 1.3;
        sparkVel.push({ vx: Math.cos(ang) * spd, vy: 3.5 + (sk % 4) * 1.4, vz: Math.sin(ang) * spd });
      }
      const sparkGeo = new THREE.BufferGeometry();
      if (typeof sparkGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
        sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
      }
      const sparkMat = new THREE.PointsMaterial({ size: 0.95, color: 0xfbbf24, map: glowTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const sparkPts = new THREE.Points(sparkGeo, sparkMat);
      sparkPts.frustumCulled = false;
      logisticsFxGroup.add(catchHalo, sparkPts);
      swordCatchEffects.push({
        x: ex, y: 1.8, z: ez,
        halo: catchHalo, haloMat: catchHaloMat,
        sparks: sparkPts, sparkGeo, sparkPos, sparkMat, sparkVel,
        speed: trainSpeed, arrivalPhase: outboundEndDist / Math.max(routeLen, 1)
      });

      // 飞剑剑匣高频多波次连发（多次发车、多次送达：每条航线 5 波独立飞剑小队错峰高频穿梭，区别于慢速重型火车）
      const waveOffsets = [0.0, 0.20, 0.40, 0.60, 0.80];
      waveOffsets.forEach((wavePhase, waveIdx) => {
        const { sword, cargo, thunderOrb, wakeRing1, wakeRing2, ribbonTrail, glowSprite } = createSwordMesh(oreColor, waveIdx === 0);
        logisticsFxGroup.add(sword);
        flyingSwords.push({
          mesh: sword,
          cargo,
          thunderOrb,
          wakeRing1,
          wakeRing2,
          ribbonTrail,
          glowSprite,
          segs: routeSegs,
          totalLen: routeLen,
          outboundEndDist,
          phase: wavePhase,
          speed: trainSpeed,
          isTrainConvoy: false
        });
      });
    }

    catapults.forEach((cat) => {
      const sx = cat.wx || 0;
      const sz = cat.wz || 0;
      if (lotuses.length === 0) return;
      let dst = null;
      if (cat.targetLotusId) {
        dst = lotuses.find(lt => lt && lt.id === cat.targetLotusId) || null;
      }
      let bestD = dst ? Math.hypot((dst.wx || 0) - sx, (dst.wz || 0) - sz) : Infinity;
      if (!dst) {
        lotuses.forEach((lt) => {
          const d = Math.hypot((lt.wx || 0) - sx, (lt.wz || 0) - sz);
          if (d >= 80 && d < bestD) { bestD = d; dst = lt; }
        });
      }
      // 火车铁律：距离小于 80m 的近距离严禁走飞剑航线（必须走地面/连廊传送带）
      if (!dst || bestD < 80) return;
      const oreId = (cat.config && cat.config.beltItem) || cat.beltItem || (sx > 0 ? 'MAT_001' : 'MAT_002');
      const trunkX = Math.round((sx + (dst.wx || 0)) * 0.5);
      buildSwordCorridor(sx, sz, trunkX, dst.wx || 0, dst.wz || 0, oreId, 3);
    });

    // 2. 纸鹤赋能台三合一无人机航线：贴符喂丹(金环) + 防线收尸修塔(绿环)
    const craneTargetsPool = worldBuildings.filter(b => b && ['bd_163', 'furnace', 'assembler_heavy', 'petri_dish', 'research_altar', 'alchemy_furnace_mk2', 'recomposer_mk3', 'entropy_smelter', 'assembler'].includes(b.type));
    const turretTargetsPool = worldBuildings.filter(b => b && b.type === 'bd_160');
    const talismanMat = cacheMat('fx_talisman_gold', () => makeStd(0xfde047, 0.25, 0.35, 0xf59e0b, 0.95));
    const repairMat = cacheMat('fx_talisman_emerald', () => makeStd(0x34d399, 0.25, 0.35, 0x10b981, 0.95));
    const craneWingMat = cacheMat('fx_crane_wing', () => {
      const m = makeStd(0xf8fafc, 0.35, 0.15, 0xe2e8f0, 0.42);
      m.side = THREE.DoubleSide;
      return m;
    });
    const getColumnTopY = (px, pz) => {
      let maxTop = 0;
      for (let i = 0; i < worldBuildings.length; i++) {
        const b = worldBuildings[i];
        if (!b) continue;
        if (Math.abs((b.wx || 0) - px) <= 4.5 && Math.abs((b.wz || 0) - pz) <= 4.5) {
          let h = 3.6;
          if (b.type === 'immortal_roof' || b.type === 'ascension_silo' || b.type === 'artificial_sun') h = 8.5;
          else if (b.type === 'bd_163' || b.type === 'alchemy_furnace_mk2' || b.type === 'recomposer_mk3' || b.type === 'entropy_smelter') h = 5.5;
          else if (b.type && b.type.startsWith('foundation')) h = 2.2;
          const top = (b.wy || 0) + h;
          if (top > maxTop) maxTop = top;
        }
      }
      return maxTop;
    };

    const fxRunePlaneGeo = new THREE.PlaneGeometry(5.6, 5.6);
    const fxCraneRingGeo = new THREE.TorusGeometry(2.1, 0.05, 6, 24);
    const fxDropHaloGeo = new THREE.TorusGeometry(2.0, 0.12, 6, 24);
    const fxCraneBodyGeo = new THREE.OctahedronGeometry(0.42, 0);
    const fxCraneNeckGeo = new THREE.CylinderGeometry(0.075, 0.14, 0.92, 4);
    const fxCraneHeadGeo = new THREE.OctahedronGeometry(0.13, 0);
    const fxCraneBeakGeo = new THREE.ConeGeometry(0.068, 0.42, 4);
    const fxCraneTailGeo = new THREE.ConeGeometry(0.16, 1.12, 4);
    const fxCraneWingTipGeo = new THREE.ConeGeometry(0.075, 0.36, 4);
    const fxCraneWingEdgeGeo = new THREE.CylinderGeometry(0.024, 0.016, 1.88, 4);
    const fxCraneCargoBoxGeo = new THREE.BoxGeometry(0.32, 0.24, 0.42);
    const fxCraneScrollGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.54, 8);
    const fxCraneScrollCapGeo = new THREE.CylinderGeometry(0.135, 0.135, 0.06, 8);
    const makeCraneWingGeo = (sideSign) => {
      const geo = new THREE.BufferGeometry();
      const tipX = sideSign * 1.68;
      const verts = new Float32Array([
        0, 0.0, 0.48,    tipX, 0.04, -0.38,   0, 0.07, -0.02,
        0, 0.07, -0.02,  tipX, 0.04, -0.38,   0, 0.0, -0.52
      ]);
      if (typeof geo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
        geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      }
      if (typeof geo.computeVertexNormals === 'function') {
        geo.computeVertexNormals();
      }
      return geo;
    };
    const fxCraneWingGeoL = makeCraneWingGeo(-1);
    const fxCraneWingGeoR = makeCraneWingGeo(1);
    cranes.forEach((cr, idx) => {
      const sx = cr.wx || 0;
      const sy = (cr.wy || 0) + 3.2;
      const sz = cr.wz || 0;
      const safeStartY = Math.max(sy + 2.0, getColumnTopY(sx, sz) + 2.2);

      const auraRing = new THREE.Mesh(
        new THREE.TorusGeometry(14, 0.12, 6, 36),
        new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.32, depthWrite: false })
      );
      auraRing.rotation.x = Math.PI / 2;
      auraRing.position.set(sx, (cr.wy || 0) + 0.15, sz);
      logisticsFxGroup.add(auraRing);

      // 起飞台上方旋转符阵
      const runeArray = new THREE.Mesh(
        fxRunePlaneGeo,
        new THREE.MeshBasicMaterial({ map: runeArrayTex, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
      );
      runeArray.rotation.x = -Math.PI / 2;
      runeArray.position.set(sx, safeStartY - 0.6, sz);
      const runeInner = new THREE.Mesh(
        fxCraneRingGeo,
        new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      runeInner.rotation.x = Math.PI / 2;
      runeInner.position.set(sx, safeStartY - 0.55, sz);
      logisticsFxGroup.add(runeArray, runeInner);
      craneLaunchArrays.push({ x: sx, z: sz, runeArray, runeInner });

      const nearbyMachines = craneTargetsPool
        .map(t => {
          const tx = t.wx || 0;
          const tz = t.wz || 0;
          const colTop = getColumnTopY(tx, tz);
          const hasRoofAbove = colTop > ((t.wy || 0) + 7.0);
          return { b: t, d: Math.hypot(tx - sx, tz - sz), role: 'buff', hasRoofAbove };
        })
        .filter(x => x.d > 3 && x.d < 65)
        .sort((a, b) => (a.hasRoofAbove === b.hasRoofAbove ? a.d - b.d : (a.hasRoofAbove ? 1 : -1)))
        .slice(0, 3);
      const nearbyTurrets = turretTargetsPool
        .map(t => ({ b: t, d: Math.hypot((t.wx || 0) - sx, (t.wz || 0) - sz), role: 'repair' }))
        .filter(x => x.d < 65)
        .sort((a, b) => a.d - b.d)
        .slice(0, 1);
      const nearbyTargets = nearbyMachines.concat(nearbyTurrets);
      if (nearbyTargets.length === 0) {
        nearbyTargets.push({ b: { wx: sx + 14, wy: 4, wz: sz - 10 }, d: 16, role: 'buff' });
      }

      nearbyTargets.forEach((entry, tIdx) => {
        const dst = entry.b;
        const isRepair = entry.role === 'repair';
        const ex = dst.wx || 0;
        const ey = (dst.wy || 0) + 2.4;
        const ez = dst.wz || 0;
        const safeEndY = Math.max(ey + 2.0, getColumnTopY(ex, ez) + 2.2);
        // L型高空防穿模巡航高度：始终高于起终点所在垂直柱体最高屋顶/机器 +6m，彻底杜绝穿模任何楼板、屋顶与机器
        const cruiseY = Math.max(safeStartY, safeEndY, 38) + 6 + (tIdx % 3) * 1.8;

        // 可视化规划航线（保持淡显）
        const laneMat = new THREE.LineBasicMaterial({
          color: isRepair ? 0x34d399 : 0xfbbf24,
          transparent: true,
          opacity: 0.24,
          depthWrite: false
        });
        const laneGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(sx, safeStartY, sz),
          new THREE.Vector3(sx, cruiseY, sz),
          new THREE.Vector3(ex, cruiseY, ez),
          new THREE.Vector3(ex, safeEndY, ez)
        ]);
        logisticsFxGroup.add(new THREE.Line(laneGeo, laneMat));

        const craneGrp = new THREE.Group();
        const accentMat = isRepair ? repairMat : talismanMat;
        // 菱形折纸身躯
        const body = new THREE.Mesh(fxCraneBodyGeo, craneBodyMat);
        body.scale.set(0.85, 0.72, 1.85);
        // 修长前伸鹤颈 + 鹤头 + 尖喙
        const neck = new THREE.Mesh(fxCraneNeckGeo, craneBodyMat);
        neck.rotation.x = Math.PI * 0.28;
        neck.position.set(0, 0.36, 0.76);
        const head = new THREE.Mesh(fxCraneHeadGeo, craneBodyMat);
        head.scale.set(0.85, 0.85, 1.25);
        head.position.set(0, 0.74, 1.12);
        const beak = new THREE.Mesh(fxCraneBeakGeo, accentMat);
        beak.rotation.x = Math.PI * 0.56;
        beak.position.set(0, 0.71, 1.38);
        // 后扬折纸鹤尾
        const tail = new THREE.Mesh(fxCraneTailGeo, craneBodyMat);
        tail.rotation.x = -Math.PI * 0.30;
        tail.position.set(0, 0.40, -0.88);
        // 两片宽大优雅的三角形折纸翅膀（带发光翼尖与前缘折边）
        const wingL = new THREE.Group();
        wingL.position.set(-0.18, 0.06, 0.08);
        const wingMeshL = new THREE.Mesh(fxCraneWingGeoL, craneWingMat);
        const wingEdgeL = new THREE.Mesh(fxCraneWingEdgeGeo, accentMat);
        wingEdgeL.position.set(-0.84, 0.02, 0.05);
        wingEdgeL.rotation.z = Math.PI / 2;
        wingEdgeL.rotation.y = 0.47;
        const wingTipAccentL = new THREE.Mesh(fxCraneWingTipGeo, accentMat);
        wingTipAccentL.rotation.z = Math.PI / 2;
        wingTipAccentL.position.set(-1.72, 0.04, -0.40);
        wingL.add(wingMeshL, wingEdgeL, wingTipAccentL);

        const wingR = new THREE.Group();
        wingR.position.set(0.18, 0.06, 0.08);
        const wingMeshR = new THREE.Mesh(fxCraneWingGeoR, craneWingMat);
        const wingEdgeR = new THREE.Mesh(fxCraneWingEdgeGeo, accentMat);
        wingEdgeR.position.set(0.84, 0.02, 0.05);
        wingEdgeR.rotation.z = -Math.PI / 2;
        wingEdgeR.rotation.y = -0.47;
        const wingTipAccentR = new THREE.Mesh(fxCraneWingTipGeo, accentMat);
        wingTipAccentR.rotation.z = -Math.PI / 2;
        wingTipAccentR.position.set(1.72, 0.04, -0.40);
        wingR.add(wingMeshR, wingEdgeR, wingTipAccentR);

        // 腹下悬挂发光符箓卷轴 / 灵丹小宝箱
        const cargo = new THREE.Group();
        cargo.position.set(0, -0.44, 0.10);
        const cargoScroll = new THREE.Mesh(fxCraneScrollGeo, accentMat);
        cargoScroll.rotation.z = Math.PI / 2;
        const cargoCapL = new THREE.Mesh(fxCraneScrollCapGeo, craneBodyMat);
        cargoCapL.rotation.z = Math.PI / 2;
        cargoCapL.position.set(-0.27, 0, 0);
        const cargoCapR = new THREE.Mesh(fxCraneScrollCapGeo, craneBodyMat);
        cargoCapR.rotation.z = Math.PI / 2;
        cargoCapR.position.set(0.27, 0, 0);
        const cargoBox = new THREE.Mesh(fxCraneCargoBoxGeo, cargoMat);
        cargoBox.position.set(0, -0.18, 0);
        cargo.add(cargoScroll, cargoCapL, cargoCapR, cargoBox);

        craneGrp.add(body, neck, head, beak, tail, wingL, wingR, cargo);
        craneGrp.scale.setScalar(1.85);
        logisticsFxGroup.add(craneGrp);

        // 柔和自然的 12 颗渐隐星光微粒（Points, size: 2.2）+ 细柔光丝（Line）
        const ribbonTrail = createRibbonTrail(
          THREE, 12,
          isRepair ? 0xa7f3d0 : 0xfef08a,
          isRepair ? 0x10b981 : 0xf59e0b,
          glowDotTex, 2.2
        );
        logisticsFxGroup.add(ribbonTrail.line, ribbonTrail.points);
        const wingTipL = createRibbonTrail(THREE, 12, isRepair ? 0x69f0ae : 0xfde047, isRepair ? 0x059669 : 0xd97706, glowDotTex, 2.2);
        const wingTipR = createRibbonTrail(THREE, 12, isRepair ? 0x69f0ae : 0xfde047, isRepair ? 0x059669 : 0xd97706, glowDotTex, 2.2);
        logisticsFxGroup.add(wingTipL.line, wingTipR.line);

        // 到达目标：1.5秒金色“增产+35%”/翠绿修缮光环脉冲 + 飘落符纸粒子
        const dropRingMat = new THREE.MeshBasicMaterial({
          color: isRepair ? 0x34d399 : 0xfbbf24,
          transparent: true, opacity: 0.0,
          blending: THREE.AdditiveBlending, depthWrite: false
        });
        const dropRing = new THREE.Mesh(fxDropHaloGeo, dropRingMat);
        dropRing.rotation.x = Math.PI / 2;
        dropRing.position.set(ex, ey, ez);

        const buffSpriteMat = new THREE.SpriteMaterial({
          map: isRepair ? repairLabelTex : buffLabelTex,
          transparent: true, opacity: 0.0,
          depthWrite: false
        });
        const buffSprite = new THREE.Sprite(buffSpriteMat);
        buffSprite.position.set(ex, ey + 2.6, ez);
        buffSprite.scale.set(4.8, 1.2, 1);

        const talismanDropCount = 12;
        const talismanDropPos = new Float32Array(talismanDropCount * 3);
        const talismanDropGeo = new THREE.BufferGeometry();
        if (typeof talismanDropGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
          talismanDropGeo.setAttribute('position', new THREE.BufferAttribute(talismanDropPos, 3));
        }
        const talismanDropMat = new THREE.PointsMaterial({
          size: 0.72,
          color: isRepair ? 0x69f0ae : 0xfde047,
          map: glowTex,
          transparent: true, opacity: 0.0,
          blending: THREE.AdditiveBlending, depthWrite: false
        });
        const talismanDropPts = new THREE.Points(talismanDropGeo, talismanDropMat);
        talismanDropPts.frustumCulled = false;

        logisticsFxGroup.add(dropRing, buffSprite, talismanDropPts);

        const craneLoopMult = (typeof window !== 'undefined' && window.FactorySelfLoop && typeof window.FactorySelfLoop.getCraneSpeedMultiplier === 'function')
          ? window.FactorySelfLoop.getCraneSpeedMultiplier()
          : 1.0;
        flyingCranes.push({
          mesh: craneGrp,
          wingL,
          wingR,
          cargo,
          ribbonTrail,
          wingTipL,
          wingTipR,
          dropRing,
          dropRingMat,
          buffSprite,
          buffSpriteMat,
          talismanDropPts,
          talismanDropGeo,
          talismanDropPos,
          talismanDropMat,
          talismanDropCount,
          arrivalEndTime: -1,
          wasGoing: true,
          sx,
          sy: safeStartY,
          sz,
          ex,
          ey: safeEndY,
          targetBaseY: ey,
          ez,
          cruiseY,
          phase: idx * 0.4 + tIdx * 0.27,
          speed: 0.105 * craneLoopMult
        });
      });
    });

    // 2B. 南区三层奇观楼：阵旗弹射器抛物线射向高空约 90m 汇入周天星斗大阵 + 破界发射井直冲云霄光柱与飞升仙梭
    const STAR_ARRAY_X = 0;
    const STAR_ARRAY_Y = 95;
    const STAR_ARRAY_Z = -410;

    const starGroup = new THREE.Group();
    starGroup.position.set(STAR_ARRAY_X, STAR_ARRAY_Y, STAR_ARRAY_Z);
    const starOuterRing = new THREE.Mesh(
      new THREE.TorusGeometry(42, 0.5, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    starOuterRing.rotation.x = Math.PI / 2;
    const starMidRing = new THREE.Mesh(
      new THREE.TorusGeometry(28, 0.38, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.68, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    starMidRing.rotation.x = Math.PI / 2 + 0.16;
    const starInnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(15, 0.28, 8, 36),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    starInnerRing.rotation.x = Math.PI / 2 - 0.18;

    const starPtCount = 160;
    const starPtPos = new Float32Array(starPtCount * 3);
    const starPtCol = new Float32Array(starPtCount * 3);
    const cGold = new THREE.Color(0xfde047);
    const cCyan = new THREE.Color(0x38bdf8);
    for (let si = 0; si < starPtCount; si++) {
      const ang = (si / starPtCount) * Math.PI * 10;
      const rad = 8 + (si / starPtCount) * 36;
      starPtPos[si * 3] = Math.cos(ang) * rad;
      starPtPos[si * 3 + 1] = Math.sin(si * 0.7) * 2.8;
      starPtPos[si * 3 + 2] = Math.sin(ang) * rad;
      const cc = si % 3 === 0 ? cCyan : cGold;
      starPtCol[si * 3] = cc.r;
      starPtCol[si * 3 + 1] = cc.g;
      starPtCol[si * 3 + 2] = cc.b;
    }
    const starPtGeo = new THREE.BufferGeometry();
    if (typeof starPtGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
      starPtGeo.setAttribute('position', new THREE.BufferAttribute(starPtPos, 3));
      starPtGeo.setAttribute('color', new THREE.BufferAttribute(starPtCol, 3));
    }
    const starPoints = new THREE.Points(starPtGeo, new THREE.PointsMaterial({
      size: 2.2,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    starGroup.add(starOuterRing, starMidRing, starInnerRing, starPoints);
    logisticsFxGroup.add(starGroup);
    starArrayState = { group: starGroup, outer: starOuterRing, mid: starMidRing, inner: starInnerRing, points: starPoints };

    // 周天星斗大阵周期性向所有 immortal_receiver 投下竖直金色能量光柱（每4秒闪一次）
    const receivers = worldBuildings.filter(b => b && b.type === 'immortal_receiver');
    const fxStarBeamGeo = new THREE.CylinderGeometry(0.45, 1.35, 95, 10, 1, true);
    const fxStarBeamRingGeo = new THREE.RingGeometry(1.2, 3.8, 24);
    receivers.forEach((rc) => {
      const rx = rc.wx || 0;
      const ry = rc.wy || 0;
      const rz = rc.wz || 0;
      const beamMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
      const beam = new THREE.Mesh(fxStarBeamGeo, beamMat);
      beam.position.set(rx, ry + 47.5, rz);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
      const ring = new THREE.Mesh(fxStarBeamRingGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(rx, ry + 0.35, rz);
      logisticsFxGroup.add(beam, ring);
      starBeamPulses.push({ x: rx, z: rz, beam, beamMat, ring, ringMat });
    });

    const ejectors = worldBuildings.filter(b => b && b.type === 'banner_ejector');
    ejectors.forEach((ej, idx) => {
      const bx = ej.wx || 0;
      const by = (ej.wy || 0) + 3.0;
      const bz = ej.wz || 0;
      for (let k = 0; k < 3; k++) {
        const grp = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.2, 6), swordHiltMat);
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 1.1), railGoldMat);
        flag.position.set(0, 0.3, 0.55);
        const trail = new THREE.Mesh(
          new THREE.ConeGeometry(0.32, 4.8, 6),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.65, depthWrite: false })
        );
        trail.position.y = -3.2;
        grp.add(pole, flag, trail);
        logisticsFxGroup.add(grp);
        const ang = (idx * 1.1 + k * 2.1);
        const tx = STAR_ARRAY_X + Math.cos(ang) * 24;
        const tz = STAR_ARRAY_Z + Math.sin(ang) * 24;
        wonderProjectiles.push({
          mesh: grp,
          isParabolic: true,
          x: bx, y0: by, y1: STAR_ARRAY_Y, z: bz,
          tx, tz,
          peakY: 112,
          phase: idx * 0.5 + k / 3, speed: 0.24, spin: 3.5
        });
      }
    });

    const silos = worldBuildings.filter(b => b && b.type === 'ascension_silo');
    silos.forEach((sl, idx) => {
      const sx = sl.wx || 0;
      const sy = (sl.wy || 0) + 3.5;
      const sz = sl.wz || 0;
      const skyBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 1.6, 85, 8, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.22, depthWrite: false })
      );
      skyBeam.position.set(sx, sy + 42.5, sz);
      logisticsFxGroup.add(skyBeam);

      const shuttle = new THREE.Group();
      const hull = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.6, 6), swordBladeMat);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.1, 6, 16), railGoldMat);
      ring.rotation.x = Math.PI / 2;
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 6.0, 6),
        new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.72, depthWrite: false })
      );
      flame.rotation.x = Math.PI;
      flame.position.y = -4.2;
      shuttle.add(hull, ring, flame);
      logisticsFxGroup.add(shuttle);
      wonderProjectiles.push({ mesh: shuttle, x: sx, y0: sy, y1: 92, z: sz, phase: idx * 0.3, speed: 0.18, spin: 1.6 });
    });

    // 3. 灵舟天轨统一并入【御剑道标】（移除灵舟方盒模型，改为悬浮旋转剑环）
    skyRails.forEach((sr) => {
      addSwordWaypointBeacon(sr.wx || 0, Math.max(11.5, (sr.wy || 0) + 11.5), sr.wz || 0, null);
    });

    // 4. 天雷蓄电池 / 仙界接引台：周期性天雷劈落闪电光束
    thunders.forEach((th, idx) => {
      const tx = th.wx || 0;
      const ty = (th.wy || 0) + 3.2;
      const tz = th.wz || 0;
      const pts = [
        new THREE.Vector3(tx, ty + 22, tz),
        new THREE.Vector3(tx + 1.0, ty + 14, tz - 0.6),
        new THREE.Vector3(tx - 0.8, ty + 7, tz + 0.7),
        new THREE.Vector3(tx, ty, tz)
      ];
      const boltGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const boltMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.0 });
      const boltLine = new THREE.Line(boltGeo, boltMat);
      logisticsFxGroup.add(boltLine);
      lightningBolts.push({ line: boltLine, mat: boltMat, phase: idx * 1.4 });
    });

    // 5. 发电与雷池灵网闭环供电特效（发电光弧 + 12m蓝色供电阵圈 + 输电脉冲球）
    const generators = worldBuildings.filter(b => b && ['artificial_sun', 'fusion_reactor', 'immortal_receiver'].includes(b.type));
    const powerHubs = worldBuildings.filter(b => b && ['thunder_accumulator', 'power_engine'].includes(b.type));
    const powerConsumers = worldBuildings.filter(b => b && ['entropy_smelter', 'recomposer_mk3', 'alchemy_furnace_mk2', 'immortal_herb_garden', 'beast_immortal_pool', 'particle_collider'].includes(b.type));
    const pulseGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const goldPulseMat = cacheMat('fx_gold_pulse', () => makeStd(0xfbbf24, 0.2, 0.4, 0xf59e0b, 1.35));
    const cyanPulseMat = cacheMat('fx_cyan_pulse', () => makeStd(0x38bdf8, 0.2, 0.4, 0x0284c7, 1.35));
    const powerRingMat = cacheMat('fx_power_ring', () => new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.34, depthWrite: false }));
    const powerRingGeo = new THREE.TorusGeometry(12, 0.1, 6, 36);

    function addPowerLink(ax, ay, az, bx, by, bz, colorHex, matRef, speed, phaseOffset) {
      const a = new THREE.Vector3(ax, ay, az);
      const b = new THREE.Vector3(bx, by, bz);
      addSpiritGuideLine(a, b, colorHex);
      const orb = new THREE.Mesh(pulseGeo, matRef);
      logisticsFxGroup.add(orb);
      powerPulses.push({ mesh: orb, a, b, phase: phaseOffset, speed });
    }

    generators.forEach((gen, gi) => {
      if (thunders.length === 0) return;
      let dst = thunders[0];
      let bestD = Infinity;
      thunders.forEach(t => {
        const d = Math.hypot((t.wx || 0) - (gen.wx || 0), (t.wz || 0) - (gen.wz || 0));
        if (d < bestD) { bestD = d; dst = t; }
      });
      if (bestD > 45) return;
      addPowerLink(gen.wx || 0, (gen.wy || 0) + 2.8, gen.wz || 0, dst.wx || 0, (dst.wy || 0) + 2.4, dst.wz || 0, 0xfbbf24, goldPulseMat, 0.65, gi * 0.3);
    });

    powerHubs.forEach((hub, hi) => {
      const hx = hub.wx || 0;
      const hy = hub.wy || 0;
      const hz = hub.wz || 0;
      const ring = new THREE.Mesh(powerRingGeo, powerRingMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(hx, hy + 0.16, hz);
      logisticsFxGroup.add(ring);

      const nearMachs = powerConsumers
        .map(m => ({ m, d: Math.hypot((m.wx || 0) - hx, (m.wz || 0) - hz) }))
        .filter(x => x.d > 2 && x.d < 20)
        .sort((a, b) => a.d - b.d)
        .slice(0, 4);
      nearMachs.forEach((entry, mi) => {
        const m = entry.m;
        addPowerLink(hx, hy + 2.0, hz, m.wx || 0, (m.wy || 0) + 2.0, m.wz || 0, 0x38bdf8, cyanPulseMat, 0.85, hi * 0.4 + mi * 0.25);
      });
    });

    // 6. 3D 镇厂法宝祭坛（万魂幡吸煞替工 / 山河社稷图灵雨增产 实时产线赋能特效）
    const altarCfg = (typeof window !== 'undefined' && window.FabaoSystem && window.FabaoSystem.state && window.FabaoSystem.state.altarState)
      ? window.FabaoSystem.state.altarState
      : { east: 'wanhun', west: 'shanhe' };
    const altarAnchors = [];
    const eastAltarBld = worldBuildings.find(b => b && b.id === 'bld_v25_altar_01');
    if (eastAltarBld) altarAnchors.push({ bld: eastAltarBld, fabao: altarCfg.east || 'wanhun' });
    const westAltarBld = worldBuildings.find(b => b && b.id === 'bld_demo_pole_w1');
    if (westAltarBld) altarAnchors.push({ bld: westAltarBld, fabao: altarCfg.west || 'shanhe' });

    altarAnchors.forEach((item, ai) => {
      const ab = item.bld;
      const ax = ab.wx || 0;
      const ay = (ab.wy || 0) + 3.6;
      const az = ab.wz || 0;
      const isWanhun = item.fabao === 'wanhun';
      const auraColor = isWanhun ? 0xa855f7 : 0x10b981;

      const totem = new THREE.Group();
      totem.position.set(ax, ay, az);
      if (isWanhun) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 4.2, 6), swordHiltMat);
        const flag = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 1.3), cacheMat('fx_wh_flag', () => makeStd(0x7e22ce, 0.3, 0.4, 0xa855f7, 0.95)));
        flag.position.set(0, 0.5, 0.68);
        totem.add(pole, flag);
      } else {
        const scrollRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 8, 24), cacheMat('fx_sh_ring', () => makeStd(0x10b981, 0.25, 0.5, 0x059669, 0.95)));
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 0), railGoldMat);
        totem.add(scrollRing, core);
      }
      logisticsFxGroup.add(totem);
      altarTotems.push(totem);

      const zoneRing = new THREE.Mesh(
        new THREE.TorusGeometry(11, 0.11, 6, 32),
        new THREE.MeshBasicMaterial({ color: auraColor, transparent: true, opacity: 0.42, depthWrite: false })
      );
      zoneRing.rotation.x = Math.PI / 2;
      zoneRing.position.set(ax, (ab.wy || 0) + 0.18, az);
      logisticsFxGroup.add(zoneRing);

      const buffMat = cacheMat(`fx_altar_pulse_${auraColor}`, () => makeStd(auraColor, 0.2, 0.4, auraColor, 1.25));
      const targets = powerConsumers
        .map(m => ({ m, d: Math.hypot((m.wx || 0) - ax, (m.wz || 0) - az) }))
        .filter(x => x.d > 2 && x.d < 22)
        .slice(0, 3);
      targets.forEach((t, ti) => {
        addPowerLink(ax, ay, az, t.m.wx || 0, (t.m.wy || 0) + 2.2, t.m.wz || 0, auraColor, buffMat, 0.72, ai * 0.5 + ti * 0.33);
      });
    });

    // 7. 第一层内循环：丹药产线回流供纸鹤/万兽仙池流光脉冲
    const pillLoopActive = (typeof window === 'undefined' || !window.FactorySelfLoop || window.FactorySelfLoop.state.pillLoopOn);
    if (pillLoopActive) {
      const alchemySrc = worldBuildings.find(b => b && b.type === 'alchemy_furnace_mk2');
      const craneDst = worldBuildings.find(b => b && b.type === 'crane_distributor');
      const beastDst = worldBuildings.find(b => b && b.type === 'beast_immortal_pool');
      const pillPulseMat = cacheMat('fx_pill_pulse', () => makeStd(0x34d399, 0.2, 0.4, 0x10b981, 1.35));
      if (alchemySrc && craneDst) {
        addPowerLink(alchemySrc.wx || 0, (alchemySrc.wy || 0) + 2.4, alchemySrc.wz || 0, craneDst.wx || 0, (craneDst.wy || 0) + 2.4, craneDst.wz || 0, 0x34d399, pillPulseMat, 0.75, 0.15);
      }
      if (alchemySrc && beastDst) {
        addPowerLink(alchemySrc.wx || 0, (alchemySrc.wy || 0) + 3.0, alchemySrc.wz || 0, beastDst.wx || 0, (beastDst.wy || 0) + 2.4, beastDst.wz || 0, 0x34d399, pillPulseMat, 0.38, 0.45);
      }
    }

    // 8. 西境 98% 高密极限黑箱魔方外观强化 (半透明玄铁外壳 + 扫描线 + 西侧4路进料光流 + 东侧出料光流 + 标识面板)
    const bbGroup = new THREE.Group();
    const bbShellGeo = new THREE.BoxGeometry(55, 31, 57);
    const bbShellMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b, transparent: true, opacity: 0.24, depthWrite: false });
    const bbShell = new THREE.Mesh(bbShellGeo, bbShellMat);
    bbShell.position.set(-350, 15.5, 0);
    const bbEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bbShellGeo),
      new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 })
    );
    bbEdges.position.copy(bbShell.position);
    bbGroup.add(bbShell, bbEdges);

    // 外壳缓慢上下扫过的扫描线平面
    const bbScanPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(55.4, 57.4),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })
    );
    bbScanPlane.rotation.x = Math.PI / 2;
    bbScanPlane.position.set(-350, 15.5, 0);
    bbGroup.add(bbScanPlane);

    // 西侧 4 个原料入口光流箭头（粒子从外部流进黑箱）
    const bbInZ = [-18, -6, 6, 18];
    const bbArrowGeo = new THREE.ConeGeometry(0.9, 2.2, 4);
    bbArrowGeo.rotateZ(-Math.PI / 2);
    const bbInArrowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    bbInZ.forEach((zp) => {
      const arrow = new THREE.Mesh(bbArrowGeo, bbInArrowMat);
      arrow.position.set(-381, 4.5, zp);
      bbGroup.add(arrow);
    });
    const bbInCount = 4 * 10;
    const bbInPos = new Float32Array(bbInCount * 3);
    const bbInGeo = new THREE.BufferGeometry();
    if (typeof bbInGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
      bbInGeo.setAttribute('position', new THREE.BufferAttribute(bbInPos, 3));
    }
    const bbInPts = new THREE.Points(bbInGeo, new THREE.PointsMaterial({
      size: 1.4, color: 0x38bdf8, map: glowTex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    bbInPts.frustumCulled = false;
    bbGroup.add(bbInPts);

    // 东侧成品出口流出光流
    const bbOutArrow = new THREE.Mesh(bbArrowGeo, new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    bbOutArrow.position.set(-319, 4.5, 0);
    bbGroup.add(bbOutArrow);
    const bbOutCount = 16;
    const bbOutPos = new Float32Array(bbOutCount * 3);
    const bbOutGeo = new THREE.BufferGeometry();
    if (typeof bbOutGeo.setAttribute === 'function' && typeof THREE.BufferAttribute === 'function') {
      bbOutGeo.setAttribute('position', new THREE.BufferAttribute(bbOutPos, 3));
    }
    const bbOutPts = new THREE.Points(bbOutGeo, new THREE.PointsMaterial({
      size: 1.6, color: 0xfde047, map: glowTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    bbOutPts.frustumCulled = false;
    bbGroup.add(bbOutPts);

    // 外壳上方“极限黑箱 · 原矿进 / 金丹出”标识面板
    const bbLabelSprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: bbLabelTex, transparent: true, opacity: 0.94, depthWrite: false
    }));
    bbLabelSprite.position.set(-350, 36.5, 0);
    bbLabelSprite.scale.set(28, 7, 1);
    bbGroup.add(bbLabelSprite);

    logisticsFxGroup.add(bbGroup);
    blackBoxState = {
      group: bbGroup,
      scanPlane: bbScanPlane,
      inZ: bbInZ,
      inGeo: bbInGeo,
      inPos: bbInPos,
      inCount: bbInCount,
      outGeo: bbOutGeo,
      outPos: bbOutPos,
      outCount: bbOutCount
    };
  }

  function evalCraneLPath(c, t) {
    if (t < 0.20) {
      const k = t / 0.20;
      return { x: c.sx, y: c.sy + (c.cruiseY - c.sy) * k, z: c.sz, lx: c.ex, lz: c.ez };
    }
    if (t <= 0.80) {
      const k = (t - 0.20) / 0.60;
      return { x: c.sx + (c.ex - c.sx) * k, y: c.cruiseY, z: c.sz + (c.ez - c.sz) * k, lx: c.ex, lz: c.ez };
    }
    const k = (t - 0.80) / 0.20;
    return { x: c.ex, y: c.cruiseY + (c.ey - c.cruiseY) * k, z: c.ez, lx: c.ex, lz: c.ez };
  }

  function update(nowTime, camX, camZ, camDist, frustum) {
    const isBirdsEye = typeof camDist === 'number' && camDist > 360;
    const hasCam = typeof camX === 'number' && typeof camZ === 'number';
    const useDistCull = hasCam && !isBirdsEye;
    const CULL_DIST = 220;
    const SWORD_CULL_DIST = 260;
    const CRANE_CULL_DIST = 210;

    function isSphereInView(x, y, z, r) {
      if (!frustum || typeof frustum.intersectsSphere !== 'function') return true;
      if (!_tmpSphere) {
        const T = _THREE || (typeof window !== 'undefined' ? window.THREE : null);
        if (!T || typeof T.Sphere !== 'function') return true;
        _tmpSphere = new T.Sphere();
      }
      _tmpSphere.center.set(x, y, z);
      _tmpSphere.radius = r;
      return frustum.intersectsSphere(_tmpSphere);
    }

    // 飞剑沿直线天轨段分段巡航 + 连续光带拖尾 + 视锥/260m 视距按需更新
    for (let i = 0; i < flyingSwords.length; i++) {
      const f = flyingSwords[i];
      if (!f.segs || f.segs.length === 0 || f.totalLen <= 0) continue;
      let targetDist = ((nowTime * f.speed + f.phase) % 1.0) * f.totalLen;
      const isOutbound = typeof f.outboundEndDist === 'number' ? targetDist <= f.outboundEndDist : true;
      for (let s = 0; s < f.segs.length; s++) {
        const seg = f.segs[s];
        if (targetDist <= seg.len || s === f.segs.length - 1) {
          const u = Math.max(0, Math.min(1, targetDist / seg.len));
          f.mesh.position.lerpVectors(seg.a, seg.b, u);
          f.mesh.position.y += 0.65;
          if (f.lastSegIdx !== s) {
            f.mesh.lookAt(seg.b.x, seg.b.y + 0.65, seg.b.z);
            f.lastSegIdx = s;
          }
          break;
        }
        targetDist -= seg.len;
      }
      const inDist = !useDistCull || (Math.abs(f.mesh.position.x - camX) <= SWORD_CULL_DIST && Math.abs(f.mesh.position.z - camZ) <= SWORD_CULL_DIST);
      const swordVisible = inDist && isSphereInView(f.mesh.position.x, f.mesh.position.y, f.mesh.position.z, 8);
      f.mesh.visible = swordVisible;
      if (!swordVisible) {
        if (f.ribbonTrail) {
          f.ribbonTrail.line.visible = false;
          f.ribbonTrail.points.visible = false;
        }
        continue;
      }
      if (typeof f.outboundEndDist === 'number') {
        if (f.cargo) f.cargo.visible = isOutbound;
        if (f.thunderOrb) f.thunderOrb.visible = !isOutbound;
      }
      if (f.ribbonTrail) {
        const showTrail = !isBirdsEye;
        f.ribbonTrail.line.visible = showTrail;
        f.ribbonTrail.points.visible = showTrail;
        if (showTrail) {
          pushTrailPoint(f.ribbonTrail, f.mesh.position.x, f.mesh.position.y, f.mesh.position.z);
        }
      }
      if (isBirdsEye) continue;
      if (f.wakeRing1) {
        const p1 = 1 + Math.sin(nowTime * 18 + f.phase * 10) * 0.32;
        f.wakeRing1.scale.set(p1, p1, 1);
      }
      if (f.wakeRing2) {
        const p2 = 1 + Math.cos(nowTime * 16 + f.phase * 10) * 0.38;
        f.wakeRing2.scale.set(p2, p2, 1);
      }
    }

    // 飞剑航线慢速流动虚线光点
    for (let i = 0; i < swordGuideFlows.length; i++) {
      const gf = swordGuideFlows[i];
      const inDist = !isBirdsEye && (!useDistCull || (Math.abs(gf.cx - camX) <= CULL_DIST && Math.abs(gf.cz - camZ) <= CULL_DIST));
      const vis = inDist && isSphereInView(gf.cx, 12, gf.cz, Math.max(30, (gf.totalLen || 100) * 0.55));
      gf.pts.visible = vis;
      if (!vis || gf.totalLen <= 0) continue;
      for (let k = 0; k < gf.count; k++) {
        let d = (((nowTime * 0.06 + k / gf.count) % 1.0)) * gf.totalLen;
        for (let s = 0; s < gf.segs.length; s++) {
          const seg = gf.segs[s];
          if (d <= seg.len || s === gf.segs.length - 1) {
            const u = Math.max(0, Math.min(1, d / seg.len));
            gf.pos[k * 3] = seg.a.x + (seg.b.x - seg.a.x) * u;
            gf.pos[k * 3 + 1] = seg.a.y + (seg.b.y - seg.a.y) * u + 0.25;
            gf.pos[k * 3 + 2] = seg.a.z + (seg.b.z - seg.a.z) * u;
            break;
          }
          d -= seg.len;
        }
      }
      if (gf.geo.attributes && gf.geo.attributes.position) gf.geo.attributes.position.needsUpdate = true;
    }

    // 发货台起飞冲击波 + 竖直光柱
    for (let i = 0; i < swordLaunchEffects.length; i++) {
      const le = swordLaunchEffects[i];
      const inView = !isBirdsEye && (!useDistCull || (Math.abs(le.x - camX) <= CULL_DIST && Math.abs(le.z - camZ) <= CULL_DIST)) && isSphereInView(le.x, 6, le.z, 16);
      if (!inView) {
        le.ring.visible = false;
        le.pillar.visible = false;
        continue;
      }
      const lt = ((nowTime * le.speed) % 0.20) / 0.20;
      const active = lt < 0.35;
      le.ring.visible = active;
      le.pillar.visible = active;
      if (active) {
        const k = lt / 0.35;
        le.ring.scale.setScalar(0.6 + k * 3.8);
        le.ringMat.opacity = (1 - k) * 0.85;
        le.pillar.scale.set(1 - k * 0.5, 0.7 + k * 0.5, 1 - k * 0.5);
        le.pillarMat.opacity = (1 - k) * 0.65;
      }
    }

    // 收货台莲花光环脉冲 + 火花迸射
    for (let i = 0; i < swordCatchEffects.length; i++) {
      const ce = swordCatchEffects[i];
      const inView = !isBirdsEye && (!useDistCull || (Math.abs(ce.x - camX) <= CULL_DIST && Math.abs(ce.z - camZ) <= CULL_DIST)) && isSphereInView(ce.x, ce.y + 3, ce.z, 16);
      if (!inView) {
        ce.halo.visible = false;
        ce.sparks.visible = false;
        continue;
      }
      const ct = (((nowTime * ce.speed - ce.arrivalPhase + 1.0) % 0.20)) / 0.20;
      const active = ct < 0.42;
      ce.halo.visible = active;
      ce.sparks.visible = active;
      if (active) {
        const k = ct / 0.42;
        ce.halo.scale.setScalar(0.7 + k * 2.4);
        ce.halo.rotation.z = nowTime * 2.5;
        ce.haloMat.opacity = (1 - k) * 0.9;
        ce.sparkMat.opacity = (1 - k) * 0.95;
        for (let sk = 0; sk < ce.sparkVel.length; sk++) {
          const v = ce.sparkVel[sk];
          ce.sparkPos[sk * 3] = ce.x + v.vx * k * 1.1;
          ce.sparkPos[sk * 3 + 1] = ce.y + v.vy * k - 3.0 * k * k;
          ce.sparkPos[sk * 3 + 2] = ce.z + v.vz * k * 1.1;
        }
        if (ce.sparkGeo.attributes && ce.sparkGeo.attributes.position) ce.sparkGeo.attributes.position.needsUpdate = true;
      }
    }

    // 纸鹤起飞台旋转符阵
    for (let i = 0; i < craneLaunchArrays.length; i++) {
      const ca = craneLaunchArrays[i];
      const vis = !isBirdsEye && (!useDistCull || (Math.abs(ca.x - camX) <= CRANE_CULL_DIST && Math.abs(ca.z - camZ) <= CRANE_CULL_DIST)) && isSphereInView(ca.x, ca.runeArray.position.y, ca.z, 14);
      ca.runeArray.visible = vis;
      ca.runeInner.visible = vis;
      if (vis) {
        ca.runeArray.rotation.z = nowTime * 0.75;
        ca.runeInner.rotation.z = -nowTime * 1.35;
      }
    }

    // 仙鹤 L 型高空防穿模航道滑翔 + 连续光带 + 翅尖细丝 + 1.5s 增产脉冲
    for (let i = 0; i < flyingCranes.length; i++) {
      const c = flyingCranes[i];
      const inDist = !useDistCull || (Math.abs(c.sx - camX) <= CRANE_CULL_DIST && Math.abs(c.sz - camZ) <= CRANE_CULL_DIST);
      const visible = inDist && isSphereInView(c.sx, (c.cruiseY || 28) * 0.5, c.sz, 68);
      c.mesh.visible = visible;
      if (!visible) {
        if (c.ribbonTrail) { c.ribbonTrail.line.visible = false; c.ribbonTrail.points.visible = false; }
        if (c.wingTipL) c.wingTipL.line.visible = false;
        if (c.wingTipR) c.wingTipR.line.visible = false;
        if (c.dropRing) c.dropRing.visible = false;
        if (c.buffSprite) c.buffSprite.visible = false;
        if (c.talismanDropPts) c.talismanDropPts.visible = false;
        continue;
      }

      const u = (nowTime * c.speed + c.phase) % 2.0;
      const going = u <= 1.0;
      if (c.wasGoing && !going) {
        c.arrivalEndTime = nowTime + 1.5;
      }
      c.wasGoing = going;

      const t = going ? u : (2.0 - u);
      const pos = evalCraneLPath(c, t);
      c.mesh.position.set(pos.x, pos.y, pos.z);
      c.mesh.lookAt(going ? c.ex : c.sx, pos.y, going ? c.ez : c.sz);
      const flap = Math.sin(nowTime * 5.2 + c.phase * 5) * 0.45;
      c.wingL.rotation.z = flap;
      c.wingR.rotation.z = -flap;
      c.cargo.visible = going;

      const showFine = !isBirdsEye;
      if (c.ribbonTrail) {
        c.ribbonTrail.line.visible = showFine;
        c.ribbonTrail.points.visible = showFine;
        if (showFine) pushTrailPoint(c.ribbonTrail, pos.x, pos.y, pos.z);
      }
      if (c.wingTipL && c.wingTipR) {
        c.wingTipL.line.visible = showFine;
        c.wingTipR.line.visible = showFine;
        if (showFine) {
          const yaw = Math.atan2((going ? c.ex : c.sx) - pos.x, (going ? c.ez : c.sz) - pos.z);
          const rx = Math.cos(yaw);
          const rz = -Math.sin(yaw);
          const span = 3.4 * Math.cos(flap);
          const wy = Math.sin(flap) * 3.1;
          pushTrailPoint(c.wingTipL, pos.x - rx * span, pos.y - wy, pos.z - rz * span);
          pushTrailPoint(c.wingTipR, pos.x + rx * span, pos.y + wy, pos.z + rz * span);
        }
      }

      const inArrival = showFine && c.arrivalEndTime > nowTime;
      c.dropRing.visible = inArrival;
      c.buffSprite.visible = inArrival;
      c.talismanDropPts.visible = inArrival;
      if (inArrival) {
        const rem = (c.arrivalEndTime - nowTime) / 1.5;
        const p = 1 - rem;
        c.dropRing.scale.setScalar(0.85 + p * 1.25);
        c.dropRingMat.opacity = Math.sin(p * Math.PI) * 0.9;
        c.buffSprite.position.set(c.ex, c.targetBaseY + 2.4 + p * 1.2, c.ez);
        c.buffSpriteMat.opacity = Math.min(1, rem * 1.4);
        c.talismanDropMat.opacity = Math.sin(p * Math.PI) * 0.95;
        for (let tk = 0; tk < c.talismanDropCount; tk++) {
          const ang = tk * 1.7 + c.phase * 6;
          const fall = (p + (tk % 4) * 0.12) % 1.0;
          c.talismanDropPos[tk * 3] = c.ex + Math.cos(ang + nowTime * 2) * (1.2 + (tk % 3) * 0.5);
          c.talismanDropPos[tk * 3 + 1] = c.ey + 4.5 - fall * 5.2;
          c.talismanDropPos[tk * 3 + 2] = c.ez + Math.sin(ang + nowTime * 2) * (1.2 + (tk % 3) * 0.5);
        }
        if (c.talismanDropGeo.attributes && c.talismanDropGeo.attributes.position) {
          c.talismanDropGeo.attributes.position.needsUpdate = true;
        }
      }
    }

    // 南区三层奇观楼：星斗阵旗抛物线射入周天星斗大阵 & 破界仙梭升空
    for (let i = 0; i < wonderProjectiles.length; i++) {
      const wp = wonderProjectiles[i];
      const cx = wp.isParabolic ? (wp.x + wp.tx) * 0.5 : wp.x;
      const cy = wp.isParabolic ? (wp.y0 + wp.peakY) * 0.5 : (wp.y0 + wp.y1) * 0.5;
      const cz = wp.isParabolic ? (wp.z + wp.tz) * 0.5 : wp.z;
      const cr = wp.isParabolic ? Math.max(45, Math.hypot(wp.tx - wp.x, wp.tz - wp.z) * 0.6) : 55;
      const inDist = isBirdsEye || !useDistCull || (Math.abs(wp.x - camX) <= CULL_DIST + 60 && Math.abs(wp.z - camZ) <= CULL_DIST + 60);
      wp.mesh.visible = inDist && isSphereInView(cx, cy, cz, cr);
      if (!wp.mesh.visible) continue;
      const u = (nowTime * wp.speed + wp.phase) % 1.0;
      if (wp.isParabolic) {
        const omt = 1 - u;
        const midX = (wp.x + wp.tx) * 0.5;
        const midZ = (wp.z + wp.tz) * 0.5;
        wp.mesh.position.set(
          omt * omt * wp.x + 2 * omt * u * midX + u * u * wp.tx,
          omt * omt * wp.y0 + 2 * omt * u * wp.peakY + u * u * wp.y1,
          omt * omt * wp.z + 2 * omt * u * midZ + u * u * wp.tz
        );
      } else {
        wp.mesh.position.set(wp.x, wp.y0 + (wp.y1 - wp.y0) * (u * u * (3 - 2 * u)), wp.z);
      }
      wp.mesh.rotation.y = nowTime * wp.spin;
    }

    // 周天星斗大阵旋转 & 每4秒向 immortal_receiver 投下金色能量光柱
    if (starArrayState) {
      const starInDist = isBirdsEye || !useDistCull || Math.hypot(camX, camZ + 410) <= 260;
      const starVis = starInDist && isSphereInView(0, 65, -410, 130);
      starArrayState.group.visible = starVis;
      if (starVis) {
        starArrayState.outer.rotation.z = nowTime * 0.18;
        starArrayState.mid.rotation.z = -nowTime * 0.28;
        starArrayState.inner.rotation.z = nowTime * 0.42;
        starArrayState.points.rotation.y = nowTime * 0.12;
      }
    }
    const beamCycle = nowTime % 4.0;
    const beamActive = beamCycle < 0.75;
    const beamAlpha = beamActive ? Math.sin((beamCycle / 0.75) * Math.PI) : 0;
    for (let i = 0; i < starBeamPulses.length; i++) {
      const sb = starBeamPulses[i];
      const vis = beamActive && (isBirdsEye || !useDistCull || (Math.abs(sb.x - camX) <= CULL_DIST && Math.abs(sb.z - camZ) <= CULL_DIST)) && isSphereInView(sb.x, 48, sb.z, 55);
      sb.beam.visible = vis;
      sb.ring.visible = vis;
      if (vis) {
        sb.beamMat.opacity = beamAlpha * 0.72;
        sb.ringMat.opacity = beamAlpha * 0.88;
        sb.ring.scale.setScalar(0.8 + (1 - beamAlpha) * 1.4);
      }
    }

    // 西境极限黑箱扫描线 & 进出料光流
    if (blackBoxState) {
      const bbInDist = isBirdsEye || !useDistCull || (Math.abs(-350 - camX) <= CULL_DIST + 40 && Math.abs(camZ) <= CULL_DIST + 40);
      const bbVis = bbInDist && isSphereInView(-350, 16, 0, 55);
      blackBoxState.group.visible = bbVis;
      if (bbVis && !isBirdsEye) {
        blackBoxState.scanPlane.position.y = 15.5 + Math.sin(nowTime * 0.9) * 14.5;
        for (let i = 0; i < blackBoxState.inCount; i++) {
          const lane = i % 4;
          const t = ((nowTime * 0.65 + (i / blackBoxState.inCount)) % 1.0);
          blackBoxState.inPos[i * 3] = -398 + t * 22;
          blackBoxState.inPos[i * 3 + 1] = 4.5 + Math.sin(nowTime * 4 + i) * 0.35;
          blackBoxState.inPos[i * 3 + 2] = blackBoxState.inZ[lane];
        }
        if (blackBoxState.inGeo.attributes && blackBoxState.inGeo.attributes.position) blackBoxState.inGeo.attributes.position.needsUpdate = true;
        for (let i = 0; i < blackBoxState.outCount; i++) {
          const t = ((nowTime * 0.75 + i / blackBoxState.outCount) % 1.0);
          blackBoxState.outPos[i * 3] = -323 + t * 22;
          blackBoxState.outPos[i * 3 + 1] = 4.5 + Math.cos(nowTime * 4 + i) * 0.35;
          blackBoxState.outPos[i * 3 + 2] = Math.sin(i * 1.3) * 0.8;
        }
        if (blackBoxState.outGeo.attributes && blackBoxState.outGeo.attributes.position) blackBoxState.outGeo.attributes.position.needsUpdate = true;
      }
    }

    // 天轨灵箱滑行
    for (let i = 0; i < skyShuttles.length; i++) {
      const s = skyShuttles[i];
      const d = ((nowTime * 0.65 + s.phase) % 1.0 - 0.5) * s.span;
      s.mesh.position.set(
        s.rx + Math.sin(s.yaw) * d,
        s.ry,
        s.rz + Math.cos(s.yaw) * d
      );
    }

    // 御剑道标八卦剑环自转
    if (!isBirdsEye) {
      for (let i = 0; i < waypointRings.length; i++) {
        const wr = waypointRings[i];
        wr.outer.rotation.z = nowTime * 0.85 + wr.phase;
        wr.inner.rotation.z = -nowTime * 1.45 + wr.phase;
      }
    }

    // 发电与祭坛赋能脉冲球沿光丝流动
    for (let i = 0; i < powerPulses.length; i++) {
      const pp = powerPulses[i];
      const inDist = !isBirdsEye && (!useDistCull || (Math.abs(pp.a.x - camX) <= CULL_DIST && Math.abs(pp.a.z - camZ) <= CULL_DIST));
      const vis = inDist && isSphereInView((pp.a.x + pp.b.x) * 0.5, (pp.a.y + pp.b.y) * 0.5, (pp.a.z + pp.b.z) * 0.5, 28);
      pp.mesh.visible = vis;
      if (vis) {
        const u = (nowTime * pp.speed + pp.phase) % 1.0;
        pp.mesh.position.lerpVectors(pp.a, pp.b, u);
      }
    }

    // 镇厂法宝祭坛图腾自转
    for (let i = 0; i < altarTotems.length; i++) {
      const t = altarTotems[i];
      const vis = !isBirdsEye && (!useDistCull || (Math.abs(t.position.x - camX) <= CULL_DIST && Math.abs(t.position.z - camZ) <= CULL_DIST)) && isSphereInView(t.position.x, t.position.y, t.position.z, 10);
      t.visible = vis;
      if (vis) {
        t.rotation.y = nowTime * 1.35;
      }
    }

    // 天雷劈落脉冲
    for (let i = 0; i < lightningBolts.length; i++) {
      const b = lightningBolts[i];
      const cycle = (nowTime + b.phase) % 3.2;
      b.mat.opacity = cycle < 0.18 ? 0.95 : (cycle < 0.32 ? 0.45 : 0.0);
    }
  }

  function getStats() {
    return {
      swords: flyingSwords.length,
      cranes: flyingCranes.length,
      skyShuttles: skyShuttles.length,
      lightning: lightningBolts.length
    };
  }

  if (typeof window !== 'undefined') {
    window.WorldLogisticsFX = {
      rebuild,
      update,
      getStats
    };
  }
})();
