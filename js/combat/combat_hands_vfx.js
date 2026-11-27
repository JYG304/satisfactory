// ============================================================================
// js/combat/combat_hands_vfx.js - 《幽灵线》仪式感结印系统 + 肩侧飞剑流光 + 复用池 3D VFX
// 1. 彻底移除 2D 剑匣方块：飞剑藏于背后，蓄力/格挡时自肩外侧掠出悬阵，普攻擦肩出鞘
// 2. 多拍顿挫结印 (Snap-and-Hold)：合掌 -> 交错 -> 内缚/八卦/夹符/震雷 + 篆印汉字阵纹
// 3. 性能优化：0 shadowBlur、前景 Canvas 封顶 1280px、Three.js 全共享几何体与材质池
// ============================================================================

(function () {
  let canvas = null;
  let ctx = null;
  let vfxGroup = null;
  let shakeTime = 0;
  let shakeDur = 0;
  let shakeAmp = 0;

  // 双臂与仪式结印状态机
  const handState = {
    gesture: 'idle',      // idle | light_l | light_r | charge | release | guard | parry | grab | talisman | thunder | pill | dash | mudra_seq
    gestureTimer: 0,
    gestureDur: 0.25,
    chargeRatio: 0,
    element: 'metal',
    activeColor: '#38bdf8',
    bobPhase: 0,
    swayX: 0,
    swayY: 0,
    recoilZ: 0,
    recoilTarget: 0,
    grabScreenTargets: [],
    inkParticles: [],
    shoulderWhooshes: [], // 左右肩擦肩冲出的飞剑流光 { side, life, maxLife, color }
    activeSeq: null       // { id, accent, beats, elapsed, lastBeatIdx, holdAfter }
  };

  const projectiles = [];
  const transientEffects = [];

  // --------------------------------------------------------------------------
  // 幽灵线结印手势姿态表 (归一化坐标 0..1，配合 Snap-and-Hold 节奏)
  // --------------------------------------------------------------------------
  const MUDRA_POSES = {
    // 平时待机：双手分侍左右下角，呈现蓄势剑诀
    idle_sword: {
      lx: 0.22, ly: 0.80, lRot: 0.18, lFing: [0.65, 1.0, 1.0, 0.22, 0.22],
      rx: 0.78, ry: 0.80, rRot: 0.18, rFing: [0.65, 1.0, 1.0, 0.22, 0.22],
      kanji: '', baguaScale: 0, tether: false
    },
    // 合掌印 (临/魂/聚)：双手迅速向胸前中轴线并拢，指尖微并直指苍穹
    namaste_clasp: {
      lx: 0.466, ly: 0.63, lRot: -0.14, lFing: [0.85, 1.0, 1.0, 0.95, 0.90],
      rx: 0.534, ry: 0.63, rRot: -0.14, rFing: [0.85, 1.0, 1.0, 0.95, 0.90],
      kanji: '临', baguaScale: 0.82, tether: true
    },
    // 外/内缚交错结印 (兵/缚/震)：双手内旋对称交叠成 X 形结印
    cross_interlock: {
      lx: 0.472, ly: 0.62, lRot: -0.64, lFing: [0.55, 0.95, 0.35, 0.95, 0.35],
      rx: 0.528, ry: 0.60, rRot: -0.64, rFing: [0.55, 0.35, 0.95, 0.35, 0.95],
      kanji: '缚', baguaScale: 1.12, tether: true
    },
    // 内缚炼化印 (斗/炼)：双手紧扣环抱中央灵核
    inner_bond: {
      lx: 0.425, ly: 0.62, lRot: -0.45, lFing: [0.70, 0.48, 0.48, 0.48, 0.48],
      rx: 0.575, ry: 0.62, rRot: -0.45, rFing: [0.70, 0.48, 0.48, 0.48, 0.48],
      kanji: '斗', baguaScale: 1.22, tether: true
    },
    // 剑诀齐敕前推 (剑/斩)：左手护腕按印，右手双指剑诀指向准星敕斩！
    sword_command_thrust: {
      lx: 0.37, ly: 0.72, lRot: -0.30, lFing: [0.65, 1.0, 1.0, 0.25, 0.25],
      rx: 0.535, ry: 0.53, rRot: -0.28, rFing: [0.80, 1.0, 1.0, 0.15, 0.15],
      kanji: '剑', baguaScale: 1.35, tether: true
    },
    // 夹符前弹 (封)：右指夹赛博符箓悬于眉心前弹出
    talisman_flick: {
      lx: 0.36, ly: 0.68, lRot: -0.25, lFing: [0.85, 0.95, 0.95, 0.95, 0.95],
      rx: 0.53, ry: 0.55, rRot: -0.12, rFing: [0.60, 1.0, 1.0, 0.20, 0.20],
      kanji: '封', baguaScale: 1.25, tether: true, talismanCard: true
    },
    // 双掌震雷 (雷)：双手外翻横劈震开，掌间炸裂电弧！
    thunder_palm_clap: {
      lx: 0.30, ly: 0.59, lRot: 0.68, lFing: [1.0, 1.0, 1.0, 1.0, 1.0],
      rx: 0.70, ry: 0.59, rRot: 0.68, rFing: [1.0, 1.0, 1.0, 1.0, 1.0],
      kanji: '雷', baguaScale: 1.48, tether: true, lightningArc: true
    },
    // 万魂镇域大印 (镇)：双臂阔展引紫金阵图覆压全场
    domain_spread: {
      lx: 0.25, ly: 0.59, lRot: 0.55, lFing: [1.0, 1.0, 0.85, 1.0, 0.85],
      rx: 0.75, ry: 0.59, rRot: 0.55, rFing: [1.0, 1.0, 0.85, 1.0, 0.85],
      kanji: '镇', baguaScale: 1.65, tether: true
    },
    // 不动明王十字守御印 (御)：左竖掌、右横印构成正交十字印
    guard_cross: {
      lx: 0.455, ly: 0.63, lRot: -0.08, lFing: [0.9, 1.0, 1.0, 0.95, 0.95],
      rx: 0.545, ry: 0.64, rRot: -1.18, rFing: [0.9, 1.0, 1.0, 0.95, 0.95],
      kanji: '御', baguaScale: 1.15, tether: true
    },
    // 抽魂拔丹：十指灵爪后拽聚缩
    spirit_claw_pull: {
      lx: 0.34, ly: 0.59, lRot: -0.25, lFing: [0.95, 0.95, 0.95, 0.95, 0.95],
      rx: 0.66, ry: 0.59, rRot: -0.25, rFing: [0.95, 0.95, 0.95, 0.95, 0.95],
      kanji: '抽', baguaScale: 1.25, tether: true
    },
    spirit_claw_crush: {
      lx: 0.43, ly: 0.68, lRot: -0.45, lFing: [0.22, 0.22, 0.22, 0.22, 0.22],
      rx: 0.57, ry: 0.68, rRot: -0.45, rFing: [0.22, 0.22, 0.22, 0.22, 0.22],
      kanji: '破', baguaScale: 1.48, tether: true
    },
    pill_seal: {
      lx: 0.36, ly: 0.70, lRot: -0.25, lFing: [0.8, 0.95, 0.95, 0.95, 0.95],
      rx: 0.52, ry: 0.58, rRot: 0.35, rFing: [0.35, 0.35, 0.35, 0.8, 0.8],
      kanji: '生', baguaScale: 1.0, tether: false
    }
  };

  // 六大核心仪式感结印多拍序列
  const MUDRA_SEQUENCES = {
    unseal_ritual: {
      accent: '#38bdf8',
      beats: [
        { pose: 'namaste_clasp', dur: 0.22, kanji: '临', sound: 'mudra_beat_1' },
        { pose: 'cross_interlock', dur: 0.22, kanji: '兵', sound: 'mudra_beat_2' },
        { pose: 'inner_bond', dur: 0.22, kanji: '斗', sound: 'mudra_beat_2' },
        { pose: 'sword_command_thrust', dur: 0.32, kanji: '剑', sound: 'mudra_beat_3' }
      ]
    },
    skill_talisman: {
      accent: '#c084fc',
      beats: [
        { pose: 'namaste_clasp', dur: 0.16, kanji: '临', sound: 'mudra_beat_1' },
        { pose: 'cross_interlock', dur: 0.18, kanji: '缚', sound: 'mudra_beat_2' },
        { pose: 'talisman_flick', dur: 0.34, kanji: '封', sound: 'talisman' }
      ]
    },
    skill_thunder: {
      accent: '#fde047',
      beats: [
        { pose: 'namaste_clasp', dur: 0.16, kanji: '阵', sound: 'mudra_beat_1' },
        { pose: 'cross_interlock', dur: 0.18, kanji: '震', sound: 'mudra_beat_2' },
        { pose: 'thunder_palm_clap', dur: 0.38, kanji: '雷', sound: 'thunder_skill' }
      ]
    },
    fabao_wanhun: {
      accent: '#a855f7',
      beats: [
        { pose: 'namaste_clasp', dur: 0.20, kanji: '魂', sound: 'mudra_beat_1' },
        { pose: 'inner_bond', dur: 0.24, kanji: '炼', sound: 'mudra_beat_2' },
        { pose: 'domain_spread', dur: 0.44, kanji: '镇', sound: 'wanhun_domain' }
      ]
    },
    charge_release: {
      accent: '#fde047',
      beats: [
        { pose: 'cross_interlock', dur: 0.13, kanji: '敕', sound: 'mudra_beat_2' },
        { pose: 'sword_command_thrust', dur: 0.30, kanji: '斩', sound: 'mudra_beat_3' }
      ]
    },
    core_grab: {
      accent: '#fde047',
      beats: [
        { pose: 'spirit_claw_pull', dur: 0.44, kanji: '抽', sound: null },
        { pose: 'spirit_claw_crush', dur: 0.22, kanji: '破', sound: null }
      ]
    },
    parry_counter: {
      accent: '#fde047',
      beats: [
        { pose: 'thunder_palm_clap', dur: 0.32, kanji: '破', sound: null }
      ]
    }
  };

  // --------------------------------------------------------------------------
  // Three.js 共享几何体 & 材质缓存
  // --------------------------------------------------------------------------
  let SHARED_GEOS = null;
  const matCache = new Map();

  function getSharedGeos() {
    if (SHARED_GEOS) return SHARED_GEOS;
    SHARED_GEOS = {
      blade: new THREE.ConeGeometry(0.11, 1.55, 4),
      guard: new THREE.BoxGeometry(0.46, 0.06, 0.12),
      tail: new THREE.CylinderGeometry(0.025, 0.08, 1.25, 6),
      waterArc: new THREE.TorusGeometry(1.15, 0.09, 6, 16, Math.PI * 0.68),
      fireCore: new THREE.IcosahedronGeometry(0.32, 1),
      fireShell: new THREE.IcosahedronGeometry(0.46, 0),
      slash: new THREE.BoxGeometry(1.3, 0.12, 0.45),
      ringFlat: new THREE.RingGeometry(0.25, 0.55, 24),
      ringSphere: new THREE.SphereGeometry(0.45, 10, 8),
      domainRing: new THREE.RingGeometry(0.96, 1.0, 48),
      lightningCore: new THREE.CylinderGeometry(0.45, 0.65, 24, 10, 1, true),
      lightningOuter: new THREE.CylinderGeometry(1.3, 1.8, 24, 8, 1, true)
    };
    SHARED_GEOS.blade.rotateX(Math.PI / 2);
    SHARED_GEOS.tail.rotateX(Math.PI / 2);
    SHARED_GEOS.waterArc.rotateX(Math.PI / 2);
    SHARED_GEOS.waterArc.rotateZ(-Math.PI * 0.34);
    return SHARED_GEOS;
  }

  function getBasicMat(colorHex, opacity = 1, wireframe = false, doubleSide = false) {
    const key = `${colorHex}_${opacity}_${wireframe ? 1 : 0}_${doubleSide ? 1 : 0}`;
    if (matCache.has(key)) return matCache.get(key);
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: opacity < 1,
      opacity,
      wireframe,
      side: doubleSide ? THREE.DoubleSide : THREE.FrontSide
    });
    matCache.set(key, mat);
    return mat;
  }

  function ensureCanvas() {
    if (!canvas) {
      canvas = document.getElementById('fpCombatHandsCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'fpCombatHandsCanvas';
        canvas.className = 'hidden';
        document.body.appendChild(canvas);
      }
      ctx = canvas.getContext('2d');
    }
    const maxW = 1280;
    const scale = window.innerWidth > maxW ? (maxW / window.innerWidth) : 1;
    const targetW = Math.max(320, Math.round(window.innerWidth * scale));
    const targetH = Math.max(180, Math.round(window.innerHeight * scale));
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    return canvas;
  }

  function ensureVfxGroup() {
    const scene = window.World3D && window.World3D.getScene ? window.World3D.getScene() : null;
    if (!scene) return null;
    if (!vfxGroup) {
      vfxGroup = new THREE.Group();
      vfxGroup.name = 'CombatVfxGroup';
      scene.add(vfxGroup);
    }
    return vfxGroup;
  }

  function setVisible(visible) {
    const c = ensureCanvas();
    if (c) c.classList.toggle('hidden', !visible);
    if (vfxGroup) vfxGroup.visible = !!visible;
    if (!visible) clearAllEffects();
  }

  function clearAllEffects() {
    if (vfxGroup) {
      for (let i = projectiles.length - 1; i >= 0; i--) vfxGroup.remove(projectiles[i].mesh);
      for (let i = transientEffects.length - 1; i >= 0; i--) vfxGroup.remove(transientEffects[i].mesh);
    }
    projectiles.length = 0;
    transientEffects.length = 0;
    handState.inkParticles.length = 0;
    handState.shoulderWhooshes.length = 0;
    handState.grabScreenTargets.length = 0;
    handState.activeSeq = null;
  }

  function addShake(amp, dur) {
    if (amp >= shakeAmp || shakeTime <= 0) {
      shakeAmp = amp;
      shakeDur = dur;
      shakeTime = dur;
    }
  }

  function getShakeOffset(dt) {
    if (shakeTime <= 0) return { x: 0, y: 0, roll: 0 };
    shakeTime = Math.max(0, shakeTime - dt);
    const k = shakeDur > 0 ? (shakeTime / shakeDur) : 0;
    const s = shakeAmp * k;
    return {
      x: (Math.random() * 2 - 1) * s * 0.08,
      y: (Math.random() * 2 - 1) * s * 0.08,
      roll: (Math.random() * 2 - 1) * s * 0.015
    };
  }

  // 启动仪式感多拍结印序列
  function playMudraSequence(seqId, accentColor) {
    const spec = MUDRA_SEQUENCES[seqId];
    if (!spec) return;
    handState.gesture = 'mudra_seq';
    handState.activeColor = accentColor || spec.accent;
    handState.activeSeq = {
      id: seqId,
      accent: accentColor || spec.accent,
      beats: spec.beats,
      elapsed: 0,
      lastBeatIdx: -1
    };
    handState.recoilTarget = 0.65;
  }

  // 背后肩侧出剑掠影 + 单手御剑敕令
  function triggerShoulderWhoosh(side = 1, color = '#38bdf8') {
    while (handState.shoulderWhooshes.length >= 16) {
      handState.shoulderWhooshes.shift();
    }
    handState.shoulderWhooshes.push({
      side: side < 0 ? -1 : 1,
      color,
      life: 0.22,
      maxLife: 0.22
    });
  }

  function triggerLightDispatch(shoulderSide, swordColor) {
    handState.activeColor = swordColor || '#38bdf8';
    handState.activeSeq = null;
    handState.gesture = shoulderSide < 0 ? 'light_l' : 'light_r';
    handState.gestureDur = 0.20;
    handState.gestureTimer = 0.20;
    handState.recoilTarget = 0.42;
    triggerShoulderWhoosh(shoulderSide, swordColor || '#38bdf8');
  }

  function triggerGesture(gesture, dur = 0.25, element = null) {
    if (gesture === 'grab') {
      playMudraSequence('core_grab', '#fde047');
      return;
    }
    if (gesture === 'parry') {
      playMudraSequence('parry_counter', '#fde047');
      return;
    }
    if (gesture === 'release') {
      playMudraSequence('charge_release', '#fde047');
      return;
    }
    if (gesture === 'talisman') {
      playMudraSequence('skill_talisman', '#c084fc');
      return;
    }
    handState.activeSeq = null;
    handState.gesture = gesture;
    handState.gestureDur = Math.max(0.08, dur);
    handState.gestureTimer = handState.gestureDur;
    if (element) handState.element = element;
    if (gesture === 'light_l' || gesture === 'light_r') handState.recoilTarget = 0.42;
  }

  function setPoseState(opts) {
    if (opts.element) handState.element = opts.element;
    if (opts.activeColor) handState.activeColor = opts.activeColor;
    if (typeof opts.chargeRatio === 'number') handState.chargeRatio = opts.chargeRatio;
    if (typeof opts.swayX === 'number') handState.swayX += (opts.swayX - handState.swayX) * 0.18;
    if (typeof opts.swayY === 'number') handState.swayY += (opts.swayY - handState.swayY) * 0.18;
    if (typeof opts.bobAdvance === 'number') handState.bobPhase += opts.bobAdvance;

    if (handState.activeSeq) return; // 仪式序列进行中不被呼吸覆盖

    if (opts.isGuarding) {
      handState.gesture = 'guard';
      handState.gestureTimer = 0.08;
    } else if (opts.chargeRatio > 0.02 && handState.gesture !== 'grab') {
      handState.gesture = 'charge';
      handState.gestureTimer = 0.08;
    }
  }

  function spawnInkGlitchSparks(x, y, color, count = 8) {
    const c = ensureCanvas();
    const sx = c ? (x / window.innerWidth) * c.width : x;
    const sy = c ? (y / window.innerHeight) * c.height : y;
    for (let i = 0; i < count; i++) {
      if (handState.inkParticles.length >= 80) handState.inkParticles.shift();
      const a = Math.random() * Math.PI * 2;
      const spd = 70 + Math.random() * 220;
      handState.inkParticles.push({
        x: sx, y: sy,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd - 35,
        size: 3 + Math.random() * 6,
        life: 0.22 + Math.random() * 0.2,
        maxLife: 0.42,
        color,
        isRect: Math.random() > 0.45
      });
    }
  }

  function getElemColors() {
    const main = handState.activeColor || '#38bdf8';
    return {
      main,
      glow: '#fde047',
      sub: '#ffffff'
    };
  }

  function drawNeonStroke(c, color, width, alpha = 1) {
    c.save();
    c.globalAlpha = alpha * 0.28;
    c.strokeStyle = color;
    c.lineWidth = width * 2.5;
    c.stroke();
    c.globalAlpha = alpha;
    c.lineWidth = width;
    c.stroke();
    c.restore();
  }

  // --------------------------------------------------------------------------
  // 前景飞剑绘制（仅用于蓄力肩阵 / 格挡剑幕 / 擦肩流光，决不画 2D 剑匣方块）
  // --------------------------------------------------------------------------
  function drawFlyingSword2D(c, x, y, angleRad, len, color, glowColor, alpha = 1) {
    c.save();
    c.translate(x, y);
    c.rotate(angleRad);
    c.globalAlpha = alpha;

    c.beginPath();
    c.moveTo(0, -len * 1.05);
    c.lineTo(-5.5, -len * 0.15);
    c.lineTo(5.5, -len * 0.15);
    c.closePath();
    c.fillStyle = color;
    c.fill();

    c.beginPath();
    c.moveTo(0, -len * 0.98);
    c.lineTo(-2.0, -len * 0.16);
    c.lineTo(2.0, -len * 0.16);
    c.closePath();
    c.fillStyle = '#ffffff';
    c.fill();

    c.fillStyle = glowColor;
    c.fillRect(-7, -len * 0.16, 14, 3.5);
    c.fillStyle = '#1e293b';
    c.fillRect(-2, -len * 0.12, 4, len * 0.16);

    c.restore();
  }

  // 背后出剑瞬间：左右肩边缘向中心汇聚的高速剑气掠影
  function drawShoulderWhooshes(c, w, h, dt) {
    for (let i = handState.shoulderWhooshes.length - 1; i >= 0; i--) {
      const sw = handState.shoulderWhooshes[i];
      sw.life -= dt;
      if (sw.life <= 0) {
        handState.shoulderWhooshes.splice(i, 1);
        continue;
      }
      const p = 1 - sw.life / sw.maxLife;
      const alpha = Math.sin(p * Math.PI) * 0.9;
      const sx = sw.side < 0 ? w * (0.04 + 0.34 * p) : w * (0.96 - 0.34 * p);
      const sy = h * (0.28 + 0.21 * p);
      const tx = sw.side < 0 ? sx - 135 * (1 - p * 0.4) : sx + 135 * (1 - p * 0.4);
      const ty = sy - 75 * (1 - p * 0.4);

      c.save();
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(tx, ty);
      c.lineTo(sx, sy);
      drawNeonStroke(c, sw.color, 5.5 * (1 - p * 0.5), alpha);

      const ang = Math.atan2(sy - ty, sx - tx) + Math.PI / 2;
      drawFlyingSword2D(c, sx, sy, ang, 46 * (1 - p * 0.25), sw.color, '#fde047', alpha);
      c.restore();
    }
  }

  // 仅在蓄力或格挡时，自背后两侧肩缘呼出在匣飞剑列阵！
  function drawShoulderHoverSwords(c, w, h, nowSec) {
    if (!window.CombatCasket) return;
    const g = handState.gesture;
    if (g !== 'charge' && g !== 'guard' && !(handState.activeSeq && handState.activeSeq.id === 'parry_counter')) {
      return;
    }

    const slots = window.CombatCasket.getSlots();
    const armed = slots.filter((s) => s.equipped);
    if (armed.length === 0) return;

    if (g === 'charge') {
      const cr = Math.min(1, handState.chargeRatio);
      const vib = Math.sin(nowSec * 52) * (1.5 + 3.5 * cr);
      const n = armed.length;
      for (let i = 0; i < n; i++) {
        const s = armed[i];
        const side = (i % 2 === 0) ? -1 : 1;
        const tier = Math.floor(i / 2);
        // 自左右肩外侧向内收敛悬停，剑尖斜指准星！
        const baseShoulderX = side < 0 ? w * (0.14 + 0.14 * cr + tier * 0.05) : w * (0.86 - 0.14 * cr - tier * 0.05);
        const baseShoulderY = h * (0.34 + tier * 0.13) + Math.sin(nowSec * 4.5 + i) * 5 + vib;
        const ang = side < 0 ? (0.62 - 0.14 * cr) : (-0.62 + 0.14 * cr);
        drawFlyingSword2D(c, baseShoulderX, baseShoulderY, ang, 64 + cr * 16, s.profile.cssColor, '#fde047', 0.94);
      }
    } else {
      // 格挡 / 弹反：八卦剑幕护心
      const isParry = handState.activeSeq && handState.activeSeq.id === 'parry_counter';
      const spinBase = nowSec * (isParry ? 14 : 6.2);
      const rad = isParry ? 165 : 118;
      for (let i = 0; i < armed.length; i++) {
        const s = armed[i];
        const a = spinBase + (i / armed.length) * Math.PI * 2;
        const sx = w * 0.5 + Math.cos(a) * rad;
        const sy = h * 0.56 + Math.sin(a) * rad;
        drawFlyingSword2D(c, sx, sy, a + Math.PI / 2, 46, s.profile.cssColor, '#fde047', 0.92);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 仪式感核心：双环八卦阵纹 + 篆印汉字 + 手间灵丝/符箓/雷弧
  // --------------------------------------------------------------------------
  function drawMudraSigilAndBagua(c, cx, cy, scale, kanji, col, nowSec, opts = {}) {
    if (scale <= 0.05) return;
    const r = 74 * scale;

    c.save();
    c.translate(cx, cy);

    // 1. 外环旋转八卦刻度
    c.save();
    c.rotate(nowSec * 1.45);
    c.strokeStyle = col.main;
    c.lineWidth = 2.0;
    c.globalAlpha = 0.65;
    c.beginPath();
    c.arc(0, 0, r, 0, Math.PI * 2);
    c.stroke();

    // 8 组八卦短横爻纹
    for (let i = 0; i < 8; i++) {
      c.save();
      c.rotate((i * Math.PI) / 4);
      c.strokeStyle = i % 2 === 0 ? '#fde047' : col.main;
      c.lineWidth = 2.4;
      c.beginPath();
      c.moveTo(-10, -r - 7);
      c.lineTo(10, -r - 7);
      c.moveTo(-8, -r - 12);
      if (i % 2 === 0) {
        c.lineTo(8, -r - 12);
      } else {
        c.lineTo(-2, -r - 12);
        c.moveTo(2, -r - 12);
        c.lineTo(8, -r - 12);
      }
      c.stroke();
      c.restore();
    }
    c.restore();

    // 2. 内环逆转菱形符阵
    c.save();
    c.rotate(-nowSec * 2.1);
    c.strokeStyle = '#fde047';
    c.lineWidth = 1.6;
    c.globalAlpha = 0.72;
    c.setLineDash([8, 6]);
    c.beginPath();
    c.arc(0, 0, r * 0.72, 0, Math.PI * 2);
    c.stroke();
    c.setLineDash([]);

    const sq = r * 0.56;
    c.strokeRect(-sq, -sq, sq * 2, sq * 2);
    c.rotate(Math.PI / 4);
    c.strokeStyle = col.main;
    c.strokeRect(-sq, -sq, sq * 2, sq * 2);
    c.restore();

    // 3. 中央悬浮楷体大篆印字
    if (kanji) {
      const punchScale = 1 + (opts.punch || 0) * 0.38;
      c.save();
      c.scale(punchScale, punchScale);
      c.font = `900 ${Math.round(46 * scale)}px "KaiTi", "STKaiti", "Noto Serif SC", "Noto Sans SC", serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineWidth = 5;
      c.strokeStyle = 'rgba(6, 12, 24, 0.92)';
      c.strokeText(kanji, 0, 2);
      c.fillStyle = '#fef08a';
      c.fillText(kanji, 0, 2);
      c.lineWidth = 1.5;
      c.strokeStyle = col.main;
      c.strokeText(kanji, 0, 2);
      c.restore();
    }

    c.restore();
  }

  function drawTalismanPaper(c, x, y, col, progress) {
    c.save();
    const lift = progress * 48;
    c.translate(x, y - 34 - lift);
    c.rotate(-0.08 + progress * 0.14);
    c.fillStyle = 'rgba(254, 243, 199, 0.95)';
    c.strokeStyle = col.main;
    c.lineWidth = 2.4;
    c.fillRect(-13, -34, 26, 68);
    c.strokeRect(-13, -34, 26, 68);

    // 符面朱砂符胆
    c.strokeStyle = '#dc2626';
    c.lineWidth = 2.2;
    c.beginPath();
    c.moveTo(0, -26);
    c.lineTo(-6, -12);
    c.lineTo(6, -4);
    c.lineTo(-5, 8);
    c.lineTo(5, 16);
    c.lineTo(0, 26);
    c.stroke();
    c.restore();
  }

  function drawLightningBetweenHands(c, lx, ly, rx, ry, nowSec) {
    c.save();
    for (let arc = 0; arc < 3; arc++) {
      c.beginPath();
      const sy = ly - 32 + (arc - 1) * 14;
      const ey = ry - 32 + (arc - 1) * 14;
      c.moveTo(lx + 10, sy);
      const segs = 6;
      for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const px = lx + (rx - lx) * t;
        const py = sy + (ey - sy) * t + Math.sin(nowSec * 75 + i * 3.1 + arc * 2) * 18;
        c.lineTo(px, py);
      }
      c.lineTo(rx - 10, ey);
      drawNeonStroke(c, arc === 1 ? '#ffffff' : '#fde047', arc === 1 ? 3.0 : 2.2, 0.95);
    }
    c.restore();
  }

  // --------------------------------------------------------------------------
  // 前景双臂绘制 (无 shadowBlur，关节与袖口完整同步结印旋转/伸展)
  // --------------------------------------------------------------------------
  function drawSingleArm(c, side, baseX, baseY, pose, col, armStyle, nowSec) {
    c.save();
    c.translate(baseX, baseY);
    c.scale(side, 1);

    const isMech = armStyle === 'mech';
    const isXianxia = armStyle === 'xianxia';

    if (!isMech) {
      c.beginPath();
      c.moveTo(170, 310);
      c.lineTo(34, 92);
      c.lineTo(-26, 118);
      c.lineTo(42, 330);
      c.closePath();
      c.fillStyle = isXianxia ? 'rgba(17, 25, 40, 0.94)' : 'rgba(11, 18, 30, 0.94)';
      c.fill();
      c.lineWidth = 2.0;
      c.strokeStyle = col.main;
      c.stroke();

      c.beginPath();
      c.moveTo(28, 102);
      c.lineTo(-18, 124);
      c.strokeStyle = col.glow;
      c.lineWidth = 2.4;
      c.stroke();
    }

    c.beginPath();
    c.moveTo(74, 270);
    c.lineTo(14, 72);
    c.lineTo(-24, 86);
    c.lineTo(18, 285);
    c.closePath();
    c.fillStyle = '#182130';
    c.fill();
    c.strokeStyle = '#475569';
    c.lineWidth = 1.5;
    c.stroke();

    c.beginPath();
    c.moveTo(32, 225);
    c.quadraticCurveTo(4, 150, -6, 86);
    drawNeonStroke(c, col.main, 2.8, 0.95);

    c.beginPath();
    c.ellipse(-5, 76, 24, 11, -0.25, 0, Math.PI * 2);
    c.fillStyle = '#0f172a';
    c.fill();
    c.strokeStyle = col.glow;
    c.lineWidth = 2.0;
    c.stroke();

    if (side === -1) {
      c.save();
      c.translate(-14, 60);
      c.rotate(nowSec * 1.4);
      c.strokeStyle = col.main;
      c.lineWidth = 1.4;
      c.globalAlpha = 0.72;
      c.beginPath();
      c.arc(0, 0, 32, 0, Math.PI * 2);
      c.stroke();
      c.setLineDash([7, 5]);
      c.beginPath();
      c.arc(0, 0, 42, 0, Math.PI * 2);
      c.strokeStyle = col.glow;
      c.stroke();
      c.setLineDash([]);
      c.restore();
    }

    c.save();
    c.translate(-8, 60);
    c.rotate(pose.wristRot || 0);

    c.beginPath();
    c.moveTo(-20, 12);
    c.lineTo(-24, -22);
    c.lineTo(14, -26);
    c.lineTo(20, 8);
    c.closePath();
    c.fillStyle = '#1e293b';
    c.fill();
    c.strokeStyle = col.main;
    c.lineWidth = 1.8;
    c.stroke();

    c.beginPath();
    c.arc(-3, -6, 9, 0, Math.PI * 2);
    c.fillStyle = col.glow;
    c.globalAlpha = 0.25;
    c.fill();
    c.beginPath();
    c.arc(-3, -6, 5.2, 0, Math.PI * 2);
    c.globalAlpha = 1;
    c.fill();

    const fingerSpecs = [
      { ox: -22, oy: -4, len: 29, baseAng: -0.72 },
      { ox: -16, oy: -24, len: 44, baseAng: -0.18 },
      { ox: -5, oy: -26, len: 48, baseAng: -0.02 },
      { ox: 6, oy: -24, len: 42, baseAng: 0.14 },
      { ox: 15, oy: -18, len: 32, baseAng: 0.30 }
    ];
    const ext = pose.fingers || [0.6, 1.0, 1.0, 0.35, 0.3];

    for (let idx = 0; idx < fingerSpecs.length; idx++) {
      const f = fingerSpecs[idx];
      const reach = ext[idx] !== undefined ? ext[idx] : 0.6;
      const seg1 = f.len * 0.55 * (0.45 + 0.55 * reach);
      const seg2 = f.len * 0.48 * (0.35 + 0.65 * reach);
      const ang1 = f.baseAng + (1 - reach) * 0.35;
      const ang2 = ang1 - (1 - reach) * 0.95;

      const x1 = f.ox + Math.sin(ang1) * seg1;
      const y1 = f.oy - Math.cos(ang1) * seg1;
      const x2 = x1 + Math.sin(ang2) * seg2;
      const y2 = y1 - Math.cos(ang2) * seg2;

      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(f.ox, f.oy);
      c.lineTo(x1, y1);
      c.lineTo(x2, y2);
      c.strokeStyle = '#334155';
      c.lineWidth = idx === 0 ? 7 : 6;
      c.stroke();

      c.beginPath();
      c.moveTo(f.ox, f.oy);
      c.lineTo(x1, y1);
      c.lineTo(x2, y2);
      c.strokeStyle = reach > 0.78 ? col.main : '#64748b';
      c.lineWidth = 2.1;
      c.stroke();

      if (reach > 0.78) {
        c.beginPath();
        c.arc(x2, y2, 3.2, 0, Math.PI * 2);
        c.fillStyle = col.sub;
        c.fill();
      }
    }

    c.restore();
    c.restore();
  }

  function lerpPoseSpec(pA, pB, t) {
    const out = {
      lx: pA.lx + (pB.lx - pA.lx) * t,
      ly: pA.ly + (pB.ly - pA.ly) * t,
      lRot: pA.lRot + (pB.lRot - pA.lRot) * t,
      rx: pA.rx + (pB.rx - pA.rx) * t,
      ry: pA.ry + (pB.ry - pA.ry) * t,
      rRot: pA.rRot + (pB.rRot - pA.rRot) * t,
      lFing: pA.lFing.map((v, i) => v + ((pB.lFing[i] !== undefined ? pB.lFing[i] : v) - v) * t),
      rFing: pA.rFing.map((v, i) => v + ((pB.rFing[i] !== undefined ? pB.rFing[i] : v) - v) * t),
      kanji: pB.kanji,
      baguaScale: pB.baguaScale,
      tether: !!pB.tether,
      talismanCard: !!pB.talismanCard,
      lightningArc: !!pB.lightningArc
    };
    return out;
  }

  function renderHandsOverlay(dt, nowSec) {
    const c = ensureCanvas();
    if (!c || !ctx || c.classList.contains('hidden')) return;

    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);

    const cfg = window.CombatConfig || {};
    const armStyle = (cfg.decisions && cfg.decisions.DEC_12_armStyle) || 'hybrid';
    const col = getElemColors();

    // 推进多拍仪式结印序列
    let activeBeatPose = null;
    let beatSnap = 0;
    if (handState.activeSeq) {
      const seq = handState.activeSeq;
      seq.elapsed += dt;
      let acc = 0;
      let beatIdx = -1;
      let beatLocalT = 0;
      for (let i = 0; i < seq.beats.length; i++) {
        const b = seq.beats[i];
        if (seq.elapsed < acc + b.dur) {
          beatIdx = i;
          beatLocalT = (seq.elapsed - acc) / b.dur;
          break;
        }
        acc += b.dur;
      }

      if (beatIdx === -1) {
        handState.activeSeq = null;
        handState.gesture = 'idle';
      } else {
        const curBeat = seq.beats[beatIdx];
        if (beatIdx !== seq.lastBeatIdx) {
          seq.lastBeatIdx = beatIdx;
          if (curBeat.sound && window.CombatAudio) {
            window.CombatAudio.play(curBeat.sound);
          }
          spawnInkGlitchSparks(window.innerWidth * 0.5, window.innerHeight * 0.58, col.main, 7);
        }
        const prevPoseKey = beatIdx === 0 ? 'idle_sword' : seq.beats[beatIdx - 1].pose;
        const pPrev = MUDRA_POSES[prevPoseKey] || MUDRA_POSES.idle_sword;
        const pCur = MUDRA_POSES[curBeat.pose] || MUDRA_POSES.namaste_clasp;
        // 前 28% 极速甩手落印，后 72% 霸道稳住结印顿点 (幽灵线经典打击节奏)
        const snapT = Math.min(1, beatLocalT / 0.28);
        const eased = 1 - Math.pow(1 - snapT, 3);
        activeBeatPose = lerpPoseSpec(pPrev, pCur, eased);
        activeBeatPose.kanji = curBeat.kanji || pCur.kanji;
        beatSnap = beatLocalT < 0.25 ? (1 - beatLocalT / 0.25) : 0;
      }
    }

    if (!handState.activeSeq && handState.gestureTimer > 0) {
      handState.gestureTimer = Math.max(0, handState.gestureTimer - dt);
      if (handState.gestureTimer <= 0 && handState.gesture !== 'charge' && handState.gesture !== 'guard') {
        handState.gesture = 'idle';
      }
    }
    handState.recoilZ += (handState.recoilTarget - handState.recoilZ) * Math.min(1, dt * 22);
    handState.recoilTarget *= Math.pow(0.02, dt);

    const g = handState.gesture;
    const tNorm = handState.gestureDur > 0 ? (1 - handState.gestureTimer / handState.gestureDur) : 0;
    const bobX = Math.cos(handState.bobPhase * 0.5) * 6;
    const bobY = Math.abs(Math.sin(handState.bobPhase)) * 8;

    let leftPose = {
      x: w * MUDRA_POSES.idle_sword.lx + handState.swayX * 18 + bobX,
      y: h * MUDRA_POSES.idle_sword.ly + handState.swayY * 12 + bobY,
      wristRot: MUDRA_POSES.idle_sword.lRot,
      fingers: MUDRA_POSES.idle_sword.lFing.slice()
    };
    let rightPose = {
      x: w * MUDRA_POSES.idle_sword.rx + handState.swayX * 18 - bobX,
      y: h * MUDRA_POSES.idle_sword.ry + handState.swayY * 12 + bobY,
      wristRot: MUDRA_POSES.idle_sword.rRot,
      fingers: MUDRA_POSES.idle_sword.rFing.slice()
    };

    let sigilCfg = null;

    if (activeBeatPose) {
      leftPose.x = w * activeBeatPose.lx + handState.swayX * 14;
      leftPose.y = h * activeBeatPose.ly + handState.swayY * 10;
      leftPose.wristRot = activeBeatPose.lRot;
      leftPose.fingers = activeBeatPose.lFing;
      rightPose.x = w * activeBeatPose.rx + handState.swayX * 14;
      rightPose.y = h * activeBeatPose.ry + handState.swayY * 10;
      rightPose.wristRot = activeBeatPose.rRot;
      rightPose.fingers = activeBeatPose.rFing;
      sigilCfg = activeBeatPose;
    } else if (g === 'light_l') {
      const punch = Math.sin(tNorm * Math.PI);
      leftPose.x += w * 0.16 * punch;
      leftPose.y -= 72 * punch;
      leftPose.wristRot -= 0.42 * punch;
    } else if (g === 'light_r') {
      const punch = Math.sin(tNorm * Math.PI);
      rightPose.x -= w * 0.16 * punch;
      rightPose.y -= 72 * punch;
      rightPose.wristRot += 0.42 * punch;
    } else if (g === 'charge') {
      const cr = Math.min(1, handState.chargeRatio);
      const jitter = Math.sin(nowSec * 48) * 3.5 * cr;
      const spec = cr < 0.45
        ? lerpPoseSpec(MUDRA_POSES.idle_sword, MUDRA_POSES.namaste_clasp, Math.min(1, cr / 0.45))
        : lerpPoseSpec(MUDRA_POSES.namaste_clasp, MUDRA_POSES.cross_interlock, Math.min(1, (cr - 0.45) / 0.55));
      leftPose.x = w * spec.lx + jitter;
      leftPose.y = h * spec.ly;
      leftPose.wristRot = spec.lRot;
      leftPose.fingers = spec.lFing;
      rightPose.x = w * spec.rx - jitter;
      rightPose.y = h * spec.ry;
      rightPose.wristRot = spec.rRot;
      rightPose.fingers = spec.rFing;
      sigilCfg = {
        kanji: cr >= 0.96 ? '剑' : (cr >= 0.45 ? '敕' : '聚'),
        baguaScale: 0.55 + cr * 0.85,
        tether: true
      };
    } else if (g === 'guard') {
      const gc = MUDRA_POSES.guard_cross;
      leftPose.x = w * gc.lx;
      leftPose.y = h * gc.ly;
      leftPose.wristRot = gc.lRot;
      leftPose.fingers = gc.lFing;
      rightPose.x = w * gc.rx;
      rightPose.y = h * gc.ry;
      rightPose.wristRot = gc.rRot;
      rightPose.fingers = gc.rFing;
      sigilCfg = gc;
    } else if (g === 'pill') {
      const ps = MUDRA_POSES.pill_seal;
      const p = Math.sin(tNorm * Math.PI);
      leftPose.x = w * (0.22 + (ps.lx - 0.22) * p);
      leftPose.y = h * (0.80 + (ps.ly - 0.80) * p);
      rightPose.x = w * (0.78 + (ps.rx - 0.78) * p);
      rightPose.y = h * (0.80 + (ps.ry - 0.80) * p);
      rightPose.fingers = ps.rFing;
      sigilCfg = { kanji: '生', baguaScale: 0.75 * p, tether: false };
    } else if (g === 'dash') {
      leftPose.y += 45;
      rightPose.y += 45;
    }

    // 1. 格挡/弹反八卦光盾
    const isParrySeq = handState.activeSeq && handState.activeSeq.id === 'parry_counter';
    if (g === 'guard' || isParrySeq) {
      ctx.save();
      ctx.translate(w * 0.5, h * 0.55);
      const rad = isParrySeq ? 168 : 124;
      ctx.rotate(nowSec * (isParrySeq ? 3.5 : 0.65));
      ctx.strokeStyle = isParrySeq ? '#fde047' : col.main;
      ctx.lineWidth = isParrySeq ? 3.2 : 2.2;
      ctx.globalAlpha = isParrySeq ? 0.78 : 0.42;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rad * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 2. 灵丝抽魂拔丹实时连线
    const scaleX = w / (window.innerWidth || w);
    const scaleY = h / (window.innerHeight || h);
    if (handState.activeSeq && handState.activeSeq.id === 'core_grab' && handState.grabScreenTargets.length > 0) {
      const lx = leftPose.x + 12;
      const ly = leftPose.y - 42;
      const rx = rightPose.x - 12;
      const ry = rightPose.y - 42;
      const grabNorm = Math.min(1, handState.activeSeq.elapsed / 0.62);

      for (let t = 0; t < handState.grabScreenTargets.length; t++) {
        const tgt = handState.grabScreenTargets[t];
        const tsx = tgt.sx * scaleX;
        const tsy = tgt.sy * scaleY;
        for (let s = 0; s < 4; s++) {
          const sx = s % 2 === 0 ? lx : rx;
          const sy = s % 2 === 0 ? ly : ry;
          const mx = (sx + tsx) * 0.5 + Math.sin(nowSec * 38 + s * 2.1) * 26;
          const my = (sy + tsy) * 0.5 + Math.cos(nowSec * 42 + s * 1.7) * 20;

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(mx, my, tsx, tsy);
          drawNeonStroke(ctx, s % 2 === 0 ? '#38bdf8' : '#fde047', 2.0 + grabNorm * 2.0, 0.95);
        }
        ctx.save();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(tsx, tsy, Math.max(8, 34 * (1 - grabNorm * 0.65)), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 3. 背后肩缘出剑掠影 + 蓄力/格挡肩悬剑阵（无 2D 剑匣盒）
    drawShoulderWhooshes(ctx, w, h, dt);
    drawShoulderHoverSwords(ctx, w, h, nowSec);

    // 4. 双手结印中心：手间导脉丝 + 双环八卦阵 + 篆印汉字
    const sigX = (leftPose.x + rightPose.x) * 0.5;
    const sigY = Math.min(leftPose.y, rightPose.y) - 26;

    if (sigilCfg && sigilCfg.tether) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(leftPose.x + 8, leftPose.y + 12);
      ctx.lineTo(rightPose.x - 8, rightPose.y + 12);
      drawNeonStroke(ctx, col.main, 2.2, 0.72);
      ctx.restore();
    }
    if (sigilCfg && sigilCfg.baguaScale > 0) {
      drawMudraSigilAndBagua(ctx, sigX, sigY, sigilCfg.baguaScale, sigilCfg.kanji, col, nowSec, { punch: beatSnap });
    }
    if (sigilCfg && sigilCfg.lightningArc) {
      drawLightningBetweenHands(ctx, leftPose.x, leftPose.y + 38, rightPose.x, rightPose.y + 38, nowSec);
    }

    // 5. 机械修仙结印双臂
    drawSingleArm(ctx, -1, leftPose.x, leftPose.y + handState.recoilZ * 14, leftPose, col, armStyle, nowSec);
    drawSingleArm(ctx, 1, rightPose.x, rightPose.y + handState.recoilZ * 14, rightPose, col, armStyle, nowSec);

    if (sigilCfg && sigilCfg.talismanCard) {
      drawTalismanPaper(ctx, rightPose.x - 10, rightPose.y + 28, col, 1 - beatSnap);
    }

    // 6. 水墨故障 Sparks
    for (let i = handState.inkParticles.length - 1; i >= 0; i--) {
      const p = handState.inkParticles[i];
      p.life -= dt;
      if (p.life <= 0) {
        handState.inkParticles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      if (p.isRect) ctx.fillRect(p.x, p.y, p.size * 1.5, p.size * 0.45);
      else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // --------------------------------------------------------------------------
  // Three.js 3D 弹道与战斗 VFX (全共享几何体 + 实体飞剑 + 震雷光柱)
  // --------------------------------------------------------------------------
  function createProjectileMesh(kind, colorHex) {
    const geos = getSharedGeos();
    const group = new THREE.Group();
    if (kind === 'sword_blade' || kind === 'metal_sword' || kind === 'turret_sword') {
      const blade = new THREE.Mesh(geos.blade, getBasicMat(colorHex, 1.0));
      const guard = new THREE.Mesh(geos.guard, getBasicMat(0xfbbf24, 1.0));
      guard.position.z = -0.35;
      const tail = new THREE.Mesh(geos.tail, getBasicMat(0xffffff, 0.72));
      tail.position.z = -0.85;
      group.add(blade, guard, tail);
    } else if (kind === 'water_wave') {
      const arc = new THREE.Mesh(geos.waterArc, getBasicMat(colorHex, 0.9));
      group.add(arc);
    } else if (kind === 'fire_orb') {
      const core = new THREE.Mesh(geos.fireCore, getBasicMat(0xfde047, 1.0));
      const shell = new THREE.Mesh(geos.fireShell, getBasicMat(colorHex, 0.85, true));
      group.add(core, shell);
    } else {
      const slash = new THREE.Mesh(geos.slash, getBasicMat(colorHex, 0.92));
      group.add(slash);
    }
    return group;
  }

  function spawnProjectile(opts) {
    const grp = ensureVfxGroup();
    if (!grp) return null;
    const mesh = createProjectileMesh(opts.kind, opts.colorHex || 0x38bdf8);
    mesh.position.copy(opts.origin);
    const dir = opts.dir.clone().normalize();
    mesh.lookAt(opts.origin.x + dir.x, opts.origin.y + dir.y, opts.origin.z + dir.z);
    grp.add(mesh);

    const p = {
      id: Math.random().toString(36).slice(2),
      owner: opts.owner || 'player',
      kind: opts.kind || 'sword_blade',
      element: opts.element || 'metal',
      casketSlotIndex: typeof opts.casketSlotIndex === 'number' ? opts.casketSlotIndex : -1,
      shoulderSide: opts.shoulderSide || 1,
      launchCurveTimer: opts.launchCurveTimer || 0,
      aimTargetPoint: opts.aimTargetPoint ? opts.aimTargetPoint.clone() : null,
      phase: 'out', // 'out' | 'returning'
      returnTimer: 0,
      qiOnHit: opts.qiOnHit || 0,
      slowDuration: opts.slowDuration || 0,
      burnDps: opts.burnDps || 0,
      burnDuration: opts.burnDuration || 0,
      colorHex: opts.colorHex || 0x38bdf8,
      mesh,
      pos: opts.origin.clone(),
      dir,
      speed: opts.speed || 36,
      dmg: opts.dmg || 20,
      shieldMult: opts.shieldMult || 1.0,
      splashRadius: opts.splashRadius || 0,
      maxDist: opts.maxDist || 40,
      traveled: 0,
      canParry: !!opts.canParry,
      pierceCount: opts.pierceCount || 0,
      hitIds: new Set(),
      sourceEnemy: opts.sourceEnemy || null,
      gravity: opts.gravity || 0,
      velY: opts.velY || 0,
      homingStrength: opts.homingStrength || 0,
      homingTarget: opts.homingTarget || null,
      dead: false
    };
    projectiles.push(p);
    return p;
  }

  function trimTransientEffects(maxCount = 40) {
    while (transientEffects.length >= maxCount) {
      const old = transientEffects.shift();
      if (old) {
        if (vfxGroup && old.mesh) vfxGroup.remove(old.mesh);
        if (old.mat && old.mat.dispose) old.mat.dispose();
      }
    }
  }

  function spawnRingBurst(pos, colorHex, maxRadius = 3.5, duration = 0.35, flat = true) {
    const grp = ensureVfxGroup();
    if (!grp) return;
    trimTransientEffects(40);
    const geos = getSharedGeos();
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      wireframe: !flat
    });
    const mesh = new THREE.Mesh(flat ? geos.ringFlat : geos.ringSphere, mat);
    mesh.position.copy(pos);
    if (flat) mesh.rotation.x = -Math.PI / 2;
    grp.add(mesh);
    transientEffects.push({
      mesh,
      mat,
      life: duration,
      maxLife: duration,
      startScale: 0.4,
      endScale: maxRadius
    });
  }

  // 九霄震雷破盾印：苍穹劈落垂直雷柱 + 外层网状电柱 + 爆裂电核
  function spawnLightningPillar(pos, colorHex = 0xfde047, duration = 0.58) {
    const grp = ensureVfxGroup();
    if (!grp) return;
    trimTransientEffects(38);
    const geos = getSharedGeos();

    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide
    });
    const core = new THREE.Mesh(geos.lightningCore, coreMat);
    core.position.set(pos.x, 12, pos.z);
    grp.add(core);
    transientEffects.push({
      mesh: core,
      mat: coreMat,
      life: duration,
      maxLife: duration,
      startScale: 1.45,
      endScale: 0.12,
      scaleYLocked: true
    });

    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.90
    });
    const outer = new THREE.Mesh(geos.lightningOuter, outerMat);
    outer.position.set(pos.x, 12, pos.z);
    grp.add(outer);
    transientEffects.push({
      mesh: outer,
      mat: outerMat,
      life: duration,
      maxLife: duration,
      startScale: 0.85,
      endScale: 2.4,
      spinY: 9.0,
      scaleYLocked: true
    });

    spawnRingBurst(new THREE.Vector3(pos.x, 1.1, pos.z), colorHex, 4.2, duration * 0.85, false);
  }

  function spawnDomainRing(pos, radius, duration, colorHex) {
    const grp = ensureVfxGroup();
    if (!grp) return;
    trimTransientEffects(40);
    const geos = getSharedGeos();
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.72
    });
    const ring = new THREE.Mesh(geos.domainRing, mat);
    ring.position.set(pos.x, 0.08, pos.z);
    ring.rotation.x = -Math.PI / 2;
    grp.add(ring);
    transientEffects.push({
      mesh: ring,
      mat,
      life: duration,
      maxLife: duration,
      startScale: radius,
      endScale: radius,
      spinY: 0.5
    });
  }

  function updateVfx(dt, nowSec) {
    for (let i = transientEffects.length - 1; i >= 0; i--) {
      const fx = transientEffects[i];
      fx.life -= dt;
      if (fx.life <= 0) {
        if (vfxGroup) vfxGroup.remove(fx.mesh);
        if (fx.mat && fx.mat.dispose) fx.mat.dispose();
        transientEffects.splice(i, 1);
        continue;
      }
      const p = 1 - fx.life / fx.maxLife;
      const sc = fx.startScale + (fx.endScale - fx.startScale) * p;
      if (fx.scaleYLocked) {
        fx.mesh.scale.set(sc, 1, sc);
        if (fx.spinY) fx.mesh.rotation.y += dt * fx.spinY;
      } else {
        fx.mesh.scale.set(sc, sc, sc);
        if (fx.spinY) fx.mesh.rotation.z += dt * fx.spinY;
      }
      fx.mat.opacity = Math.max(0, 0.88 * (1 - p));
    }

    renderHandsOverlay(dt, nowSec);
  }

  function setGrabScreenTargets(list) {
    handState.grabScreenTargets = list || [];
  }

  window.CombatHandsVFX = {
    setVisible,
    clearAllEffects,
    addShake,
    getShakeOffset,
    triggerGesture,
    playMudraSequence,
    triggerLightDispatch,
    triggerShoulderWhoosh,
    setPoseState,
    spawnInkGlitchSparks,
    spawnProjectile,
    spawnRingBurst,
    spawnLightningPillar,
    spawnDomainRing,
    setGrabScreenTargets,
    updateVfx,
    getProjectiles: () => projectiles,
    removeProjectileAt: (idx) => {
      const p = projectiles[idx];
      if (p && vfxGroup) vfxGroup.remove(p.mesh);
      projectiles.splice(idx, 1);
    }
  };
})();
