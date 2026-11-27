// ============================================================================
// js/combat/combat_player.js - 第一人称 WASD 控制器、三系织法、格挡弹反与灵丝抽魂拔丹
// ============================================================================

(function () {
  const player = {
    pos: new THREE.Vector3(0, 0, 34),
    vel: new THREE.Vector3(0, 0, 0),
    yaw: Math.PI, // 默认朝 +Z 南方试炼场开阔地
    pitch: -0.04,
    isGrounded: true,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    dashTimer: 0,
    dashCooldown: 0,
    dashDir: new THREE.Vector3(),
    invulnTimer: 0,

    // 属性与核心资源
    hp: 100,
    shield: 60,
    shieldRegenDelayTimer: 0,
    qi: 100,
    element: 'metal', // 'metal' | 'water' | 'fire'

    // 攻防动作状态
    fireCooldown: 0,
    leftHandNext: true,
    isCharging: false,
    chargeTime: 0,
    isGuarding: false,
    guardStartTime: -999,
    isGrabbing: false,
    grabTimer: 0,
    grabTargets: [],
    talismanCd: 0,
    thunderSealCd: 0,
    wanHunCd: 0,
    wanHunActiveTimer: 0,
    pillCd: 0,
    lastFiredColor: '#38bdf8',
    boxingTarget: null,
    boxingHoldProgress: 0,
    boxingLabel: '',
    isDown: false,
    downTimer: 0,
    lastHitDirAngle: null,
    lastHitFlashTimer: 0
  };

  function resetToSpawn() {
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    player.pos.set(0, 0, 34);
    player.vel.set(0, 0, 0);
    player.yaw = Math.PI; // 朝 +Z 南方空地
    player.pitch = -0.04;
    player.isGrounded = true;
    player.hp = cfg.maxHp || 100;
    player.shield = cfg.maxShield || 60;
    player.qi = cfg.maxQi || 100;
    player.talismanCd = 0;
    player.thunderSealCd = 0;
    player.wanHunCd = 0;
    player.pillCd = 0;
    player.isCharging = false;
    player.chargeTime = 0;
    player.isGuarding = false;
    player.isGrabbing = false;
    player.grabTargets = [];
    player.isDown = false;
    player.downTimer = 0;
    player.dashTimer = 0;
    player.dashCooldown = 0;
    player.invulnTimer = 0;
  }

  function getForwardVector(includePitch = true) {
    const cosP = includePitch ? Math.cos(player.pitch) : 1;
    const sinP = includePitch ? Math.sin(player.pitch) : 0;
    return new THREE.Vector3(
      -Math.sin(player.yaw) * cosP,
      sinP,
      -Math.cos(player.yaw) * cosP
    ).normalize();
  }

  function getRightVector() {
    return new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw)).normalize();
  }

  // --------------------------------------------------------------------------
  // 移动、跳跃、灵步闪避与工厂建筑轻碰撞/踏上底座
  // --------------------------------------------------------------------------
  function updateMovement(dt, moveInput) {
    const mCfg = (window.CombatConfig && window.CombatConfig.movement) || {};
    const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
    const obstacles = window.CombatAIDirector ? window.CombatAIDirector.getFactoryObstacles() : [];

    if (player.dashCooldown > 0) player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    if (player.invulnTimer > 0) player.invulnTimer = Math.max(0, player.invulnTimer - dt);
    if (player.jumpBufferTimer > 0) player.jumpBufferTimer = Math.max(0, player.jumpBufferTimer - dt);

    // 灵步短冲期间强制沿水平冲刺向量高速位移
    if (player.dashTimer > 0) {
      player.dashTimer = Math.max(0, player.dashTimer - dt);
      const spd = mCfg.dashSpeed || 20;
      attemptHorizontalMove(player.dashDir.x * spd * dt, player.dashDir.z * spd * dt, obstacles, mCfg.playerRadius || 0.48);
    } else {
      // 标准 WASD 地面与空中速度合成
      const fwd = getForwardVector(false);
      const right = getRightVector();
      const wishDir = new THREE.Vector3();
      wishDir.addScaledVector(fwd, moveInput.forward || 0);
      wishDir.addScaledVector(right, moveInput.right || 0);
      if (wishDir.lengthSq() > 0.001) wishDir.normalize();

      let maxSpd = moveInput.sprint ? (mCfg.sprintSpeed || 8.6) : (mCfg.walkSpeed || 5.2);
      if ((moveInput.forward || 0) < 0) maxSpd *= (mCfg.backMult || 0.85);
      else if (Math.abs(moveInput.right || 0) > 0.1 && Math.abs(moveInput.forward || 0) < 0.1) maxSpd *= (mCfg.strafeMult || 0.92);

      if (player.isCharging) maxSpd *= (mCfg.chargeSlowMult || 0.62);
      else if (player.isGuarding) maxSpd *= (mCfg.guardSlowMult || 0.55);

      const targetVx = wishDir.x * maxSpd;
      const targetVz = wishDir.z * maxSpd;
      const rate = wishDir.lengthSq() > 0.001 ? (mCfg.accel || 34) : (mCfg.decel || 28);
      const blend = Math.min(1, rate * dt);
      player.vel.x += (targetVx - player.vel.x) * blend;
      player.vel.z += (targetVz - player.vel.z) * blend;

      attemptHorizontalMove(player.vel.x * dt, player.vel.z * dt, obstacles, mCfg.playerRadius || 0.48);

      // 步态摇晃传给双臂前景
      const horizSpeed = Math.hypot(player.vel.x, player.vel.z);
      if (window.CombatHandsVFX && player.isGrounded && horizSpeed > 0.4) {
        window.CombatHandsVFX.setPoseState({ bobAdvance: dt * horizSpeed * 1.45 });
      }
    }

    // 垂直重力与地面/地基顶面支撑计算
    const supportY = getSupportFloorHeight(player.pos.x, player.pos.y, player.pos.z, obstacles, mCfg.playerRadius || 0.48);
    if (player.isGrounded) {
      player.coyoteTimer = mCfg.coyoteTime || 0.12;
    } else {
      player.coyoteTimer = Math.max(0, player.coyoteTimer - dt);
    }

    if (player.jumpBufferTimer > 0 && player.coyoteTimer > 0) {
      const jumpH = mCfg.jumpHeight || 1.65;
      const grav = mCfg.gravity || 22.0;
      player.vel.y = Math.sqrt(2 * grav * jumpH);
      player.isGrounded = false;
      player.coyoteTimer = 0;
      player.jumpBufferTimer = 0;
    }

    player.vel.y -= (mCfg.gravity || 22.0) * dt;
    player.pos.y += player.vel.y * dt;

    if (player.pos.y <= supportY) {
      player.pos.y = supportY;
      player.vel.y = 0;
      player.isGrounded = true;
    } else {
      player.isGrounded = false;
    }

    // 覆盖完整 2000x2000 广域盆地 (-980..980)，彻底消除 240m 边界空气墙
    player.pos.x = Math.max(-980, Math.min(980, player.pos.x));
    player.pos.z = Math.max(-980, Math.min(980, player.pos.z));
  }

  function getSupportFloorHeight(px, py, pz, obstacles, r) {
    let floorY = 0;
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      if (px >= o.minX - r * 0.5 && px <= o.maxX + r * 0.5 && pz >= o.minZ - r * 0.5 && pz <= o.maxZ + r * 0.5) {
        if (o.maxY <= py + 2.25 && o.maxY > floorY) {
          floorY = o.maxY;
        }
      }
    }
    return floorY;
  }

  function attemptHorizontalMove(dx, dz, obstacles, r) {
    const nextX = player.pos.x + dx;
    if (!isCollidingHorizontal(nextX, player.pos.y, player.pos.z, obstacles, r)) {
      player.pos.x = nextX;
    } else {
      player.vel.x = 0;
    }
    const nextZ = player.pos.z + dz;
    if (!isCollidingHorizontal(player.pos.x, player.pos.y, nextZ, obstacles, r)) {
      player.pos.z = nextZ;
    } else {
      player.vel.z = 0;
    }
  }

  const PASSABLE_TYPES = new Set([
    'foundation_1x1', 'foundation_2x2', 'foundation_3x3', 'foundation', 'bd_108', 'bd_109',
    'conveyor', 'conveyor_mk2', 'conveyor_mk3', 'bd_117', 'bd_118', 'bd_119', 'bd_120',
    'splitter', 'merger', 'pipe', 'sky_rail', 'cloud_corridor', 'floating_platform'
  ]);

  function isCollidingHorizontal(px, py, pz, obstacles, r) {
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      if (PASSABLE_TYPES.has(o.type)) continue;
      // 2.25m 以下台阶（含 1F 地基顶面）允许平顺踏上，彻底消除地基与建筑外围空气墙
      if (o.maxY <= py + 2.25 || o.minY >= py + 1.85) continue;
      const shrink = 0.45;
      const minX = o.cx - o.hw * shrink;
      const maxX = o.cx + o.hw * shrink;
      const minZ = o.cz - o.hd * shrink;
      const maxZ = o.cz + o.hd * shrink;
      if (px + r > minX && px - r < maxX && pz + r > minZ && pz - r < maxZ) {
        return true;
      }
    }
    return false;
  }

  function triggerJump() {
    if (player.isDown) return;
    player.jumpBufferTimer = (window.CombatConfig && window.CombatConfig.movement.jumpBuffer) || 0.12;
  }

  function triggerDash(moveInput) {
    const cfg = window.CombatConfig || {};
    if (player.isDown || !cfg.decisions || !cfg.decisions.DEC_02_dashEnabled) return;
    if (player.dashCooldown > 0 || player.dashTimer > 0) return;

    const cost = cfg.movement.dashCost || 22;
    if (player.qi < cost) {
      if (typeof showNotification === 'function') showNotification('【灵步短冲】灵力不足！');
      return;
    }
    player.qi -= cost;
    player.isCharging = false;
    player.chargeTime = 0;

    const fwd = getForwardVector(false);
    const right = getRightVector();
    const dir = new THREE.Vector3();
    if (Math.abs(moveInput.forward || 0) < 0.1 && Math.abs(moveInput.right || 0) < 0.1) {
      dir.copy(fwd); // 未按方向键默认向前冲
    } else {
      dir.addScaledVector(fwd, moveInput.forward || 0);
      dir.addScaledVector(right, moveInput.right || 0);
      dir.normalize();
    }
    player.dashDir.copy(dir);
    player.dashTimer = cfg.movement.dashDuration || 0.22;
    player.dashCooldown = cfg.movement.dashCooldown || 1.15;
    player.invulnTimer = Math.max(player.invulnTimer, cfg.movement.dashInvuln || 0.16);

    if (window.CombatAudio) window.CombatAudio.play('dash');
    if (window.CombatHandsVFX) window.CombatHandsVFX.triggerGesture('dash', 0.22);
    if (window.CombatHUD) window.CombatHUD.flashDash();
  }

  // --------------------------------------------------------------------------
  // 天罡剑匣装备联动、背后肩侧出剑与攻防释放（无需手动 123/Z 切剑）
  // --------------------------------------------------------------------------
  function syncElementFromCasket() {
    if (!window.CombatCasket) return;
    window.CombatCasket.syncFromInventory();
    const active = window.CombatCasket.getActiveSword();
    if (active && active.profile) {
      const cfg = window.CombatConfig || {};
      const singleOnly = cfg.decisions && cfg.decisions.DEC_01_elementMode === 'single_metal';
      player.element = singleOnly ? 'metal' : active.profile.element;
      player.lastFiredColor = active.profile.cssColor || '#38bdf8';
    }
  }

  function grantQi(amount) {
    const maxQi = (window.CombatConfig && window.CombatConfig.player.maxQi) || 100;
    player.qi = Math.min(maxQi, player.qi + amount);
  }

  function switchElement() {
    // 剑匣定位为背后装备，普攻自动轮发并随装剑数量提升攻速，不再使用 1/2/3 或 Z 切剑
    const sum = window.CombatCasket && window.CombatCasket.getSummary ? window.CombatCasket.getSummary() : null;
    if (typeof showNotification === 'function' && sum) {
      showNotification(`【天罡剑匣自动轮发】已装备 ${sum.equippedCount}/4 剑 (攻速 ${sum.speedMult.toFixed(2)}×)，按 [Tab] 可配剑！`);
    }
  }

  function tryConsumeAmmoForShot() {
    const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
    if (!dec.DEC_03_consumableAmmo) return true;
    if (typeof playerInventory === 'undefined') return true;
    const key = player.element === 'fire' ? 'mat_075' : 'mat_074';
    if ((playerInventory[key] || 0) > 0) {
      playerInventory[key] -= 1;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      return true;
    }
    if (typeof showNotification === 'function') showNotification('【耗材制】背包缺少玄铁/爆裂剑丸，请补充或切回灵力循环制！');
    return false;
  }

  function getAimRayOriginAndDir() {
    const mCfg = (window.CombatConfig && window.CombatConfig.movement) || {};
    const eye = new THREE.Vector3(player.pos.x, player.pos.y + (mCfg.eyeHeight || 1.72), player.pos.z);
    const dir = getForwardVector(true);
    return { eye, dir };
  }

  function fireLight() {
    if (player.isDown || player.isGrabbing || player.isGuarding || player.fireCooldown > 0) return;
    const cfg = window.CombatConfig || {};

    // 从背后天罡剑匣按序调遣飞剑离匣出鞘，装备飞剑越多攻速越快！
    const launch = window.CombatCasket ? window.CombatCasket.launchNextSword() : null;
    const prof = launch ? launch.profile : null;
    const interval = (window.CombatCasket && window.CombatCasket.getFireInterval)
      ? window.CombatCasket.getFireInterval()
      : 0.36;

    const qiCost = prof ? prof.qiCost : 2.2;
    if (player.qi < qiCost) return;
    if (!tryConsumeAmmoForShot()) return;

    player.qi -= qiCost;
    player.fireCooldown = interval;

    const { eye, dir } = getAimRayOriginAndDir();
    const flatFwd = getForwardVector(false);
    const right = getRightVector();
    const upVec = new THREE.Vector3(0, 1, 0);

    // 背后双肩侧发射起点：藏于玩家身后肩背上方，掠过视野左右肩缘弧线汇聚准星
    const side = launch ? (launch.shoulderSide || 1) : (player.leftHandNext ? -1 : 1);
    const tierY = launch && launch.tier ? 0.34 : 0.14;
    const origin = eye.clone()
      .addScaledVector(flatFwd, -1.35)
      .addScaledVector(right, side * (0.98 + (launch && launch.tier ? 0.22 : 0)))
      .addScaledVector(upVec, tierY);

    const lockEnemy = findCrosshairEnemy(42, 0.92);
    const aimPoint = lockEnemy
      ? lockEnemy.pos.clone().add(new THREE.Vector3(0, lockEnemy.type === 'jindan' ? 2.0 : 1.15, 0))
      : eye.clone().addScaledVector(dir, 38);

    // 初始朝肩外前方高速掠出视野，再迅速弯折咬死准星落点
    const initDir = flatFwd.clone().multiplyScalar(0.75)
      .addScaledVector(dir, 0.45)
      .addScaledVector(right, side * 0.18)
      .normalize();

    if (prof) {
      player.element = (cfg.decisions && cfg.decisions.DEC_01_elementMode === 'single_metal') ? 'metal' : prof.element;
      player.lastFiredColor = prof.cssColor || '#38bdf8';
      window.CombatHandsVFX?.spawnProjectile({
        owner: 'player',
        kind: launch.isPhantom ? 'metal_sword' : 'sword_blade',
        element: prof.element,
        casketSlotIndex: launch.slotIndex,
        shoulderSide: side,
        launchCurveTimer: 0.16,
        aimTargetPoint: aimPoint,
        origin,
        dir: initDir,
        speed: prof.speed,
        dmg: launch.isPhantom ? Math.round(prof.dmg * 0.80) : prof.dmg,
        shieldMult: prof.shieldMult,
        splashRadius: prof.splashRadius || 0,
        qiOnHit: prof.qiOnHit || 0,
        slowDuration: prof.slowDuration || 0,
        burnDps: prof.burnDps || 0,
        burnDuration: prof.burnDps ? 3.5 : 0,
        pierceCount: prof.pierceCount || 0,
        maxDist: prof.range + 4,
        colorHex: prof.colorHex,
        homingTarget: lockEnemy,
        homingStrength: prof.homing || 5.0
      });
      window.CombatAudio?.play('sword_whoosh_back');
      window.CombatHandsVFX?.triggerLightDispatch(side, prof.cssColor);
    }

    player.leftHandNext = side < 0;
    window.CombatHandsVFX?.addShake(0.18, 0.08);
  }

  function startCharge() {
    if (player.isDown || player.isGrabbing || player.isGuarding) return;
    player.isCharging = true;
    player.chargeTime = 0;
  }

  function cancelCharge() {
    player.isCharging = false;
    player.chargeTime = 0;
  }

  function releaseCharge() {
    if (!player.isCharging) return;
    const cfg = window.CombatConfig || {};
    const pCfg = cfg.player || {};
    const chargeTarget = pCfg.chargeTime || 0.65;
    const chargeCost = pCfg.chargeCost || 18;
    const ratio = player.chargeTime / chargeTarget;
    player.isCharging = false;
    player.chargeTime = 0;

    if (ratio < 0.85 || player.qi < chargeCost) {
      fireLight();
      return;
    }
    if (!tryConsumeAmmoForShot()) return;

    player.qi -= chargeCost;
    const { eye, dir } = getAimRayOriginAndDir();
    const flatFwd = getForwardVector(false);
    const right = getRightVector();
    const upVec = new THREE.Vector3(0, 1, 0);
    const lockEnemy = findCrosshairEnemy(46, 0.88);
    const aimPoint = lockEnemy
      ? lockEnemy.pos.clone().add(new THREE.Vector3(0, lockEnemy.type === 'jindan' ? 2.0 : 1.15, 0))
      : eye.clone().addScaledVector(dir, 40);

    // 全匣齐射：调遣所有已装备飞剑，自背后双肩对称高速破空汇聚！
    const launchedList = window.CombatCasket ? window.CombatCasket.launchAllReadyForCharge() : [];
    const n = launchedList.length;
    for (let i = 0; i < n; i++) {
      const item = launchedList[i];
      const prof = item.profile;
      const side = item.shoulderSide || (i % 2 === 0 ? -1 : 1);
      const tier = item.tier || 0;
      const origin = eye.clone()
        .addScaledVector(flatFwd, -1.45 - tier * 0.25)
        .addScaledVector(right, side * (1.12 + tier * 0.34))
        .addScaledVector(upVec, 0.22 + tier * 0.36);

      const initDir = flatFwd.clone().multiplyScalar(0.68)
        .addScaledVector(dir, 0.48)
        .addScaledVector(right, side * 0.28)
        .normalize();

      window.CombatHandsVFX?.spawnProjectile({
        owner: 'player',
        kind: item.isPhantom ? 'metal_sword' : 'sword_blade',
        element: prof.element,
        casketSlotIndex: item.slotIndex,
        shoulderSide: side,
        launchCurveTimer: 0.18,
        aimTargetPoint: aimPoint,
        origin,
        dir: initDir,
        speed: prof.speed * 1.18,
        dmg: prof.chargeDmg || Math.round(prof.dmg * 1.8),
        shieldMult: (prof.shieldMult || 1.0) * 1.35,
        splashRadius: prof.splashRadius || 0,
        qiOnHit: (prof.qiOnHit || 0) * 1.5,
        slowDuration: prof.slowDuration || 0,
        burnDps: prof.burnDps || 0,
        burnDuration: prof.burnDps ? 4.0 : 0,
        pierceCount: (prof.pierceCount || 0) + 1,
        maxDist: prof.range + 8,
        colorHex: prof.colorHex,
        homingTarget: lockEnemy,
        homingStrength: (prof.homing || 5.0) + 2.5
      });
      window.CombatHandsVFX?.triggerShoulderWhoosh(side, prof.cssColor || '#fde047');
    }

    window.CombatAudio?.play('metal_charge');
    window.CombatHandsVFX?.playMudraSequence('charge_release', '#fde047');
    window.CombatHandsVFX?.addShake(0.95, 0.18);
    window.CombatHandsVFX?.spawnInkGlitchSparks(window.innerWidth * 0.5, window.innerHeight * 0.55, '#fde047', 14);
  }

  function startGuard() {
    if (player.isDown || player.isGrabbing) return;
    if (player.isCharging) cancelCharge();
    if (!player.isGuarding) {
      player.isGuarding = true;
      player.guardStartTime = performance.now() / 1000;
      if (window.CombatAudio) window.CombatAudio.play('guard_up');
    }
  }

  function stopGuard() {
    player.isGuarding = false;
  }

  // --------------------------------------------------------------------------
  // 幽灵线标志性技能：灵丝抽魂拔丹 (Core Grab)
  // --------------------------------------------------------------------------
  function findCrosshairEnemy(maxDist, minDot = 0.85, onlyCoreExposed = false) {
    const list = window.CombatEnemies ? window.CombatEnemies.getEnemies() : [];
    const { eye, dir } = getAimRayOriginAndDir();
    let best = null;
    let bestScore = -1;

    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.state === 'dead') continue;
      if (onlyCoreExposed && e.state !== 'coreExposed') continue;
      const aimPos = e.pos.clone().add(new THREE.Vector3(0, 1.1, 0));
      const toE = aimPos.sub(eye);
      const dist = toE.length();
      if (dist > maxDist || dist < 0.3) continue;
      const dot = toE.normalize().dot(dir);
      if (dot >= minDot && dot > bestScore) {
        bestScore = dot;
        best = e;
      }
    }
    return best;
  }

  function tryCoreGrab() {
    if (player.isDown || player.isGrabbing) return false;
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
    const primary = findCrosshairEnemy(cfg.grabRange || 14.0, 0.80, true);
    if (!primary) return false;

    const targets = [primary];
    if (dec.DEC_05_chainCoreGrab) {
      const list = window.CombatEnemies.getEnemies();
      for (let i = 0; i < list.length; i++) {
        const other = list[i];
        if (other.id === primary.id || other.state !== 'coreExposed') continue;
        if (other.pos.distanceTo(primary.pos) <= (cfg.grabChainRadius || 4.5)) {
          targets.push(other);
          if (targets.length >= (cfg.grabChainMax || 3)) break;
        }
      }
    }

    player.isCharging = false;
    player.isGuarding = false;
    player.isGrabbing = true;
    player.grabTimer = cfg.grabDuration || 0.62;
    player.grabTargets = targets;
    if (dec.DEC_06_grabInvulnAutoBox) {
      player.invulnTimer = Math.max(player.invulnTimer, player.grabTimer + 0.1);
    }

    window.CombatAudio?.play('core_grab_pull');
    window.CombatHandsVFX?.triggerGesture('grab', player.grabTimer, player.element);
    window.CombatHandsVFX?.addShake(0.65, 0.3);
    return true;
  }

  function finishCoreGrab() {
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    const count = player.grabTargets.length;
    player.grabTargets.forEach((e) => {
      if (e && e.state !== 'dead') {
        window.CombatEnemies?.killEnemy(e, 'core_grab');
        window.CombatHandsVFX?.spawnRingBurst(e.pos.clone().add(new THREE.Vector3(0, 1.1, 0)), 0xfde047, 3.8, 0.35, false);
      }
    });

    player.qi = Math.min(cfg.maxQi || 100, player.qi + (cfg.grabQiGain || 35) * count);
    player.shield = Math.min(cfg.maxShield || 60, player.shield + (cfg.grabShieldGain || 20));
    player.isGrabbing = false;
    player.grabTargets = [];
    window.CombatHandsVFX?.setGrabScreenTargets([]);

    window.CombatAudio?.play('core_grab_shatter');
    window.CombatHandsVFX?.addShake(1.65, 0.28);
    window.CombatHandsVFX?.spawnInkGlitchSparks(window.innerWidth * 0.5, window.innerHeight * 0.5, '#fde047', 18);
    window.CombatMain?.triggerHitstop(0.065);
    window.CombatHUD?.triggerHitmarker('crit');
  }

  // --------------------------------------------------------------------------
  // 技能按键 [G] 缚灵符 / [V] 九霄震雷破盾印 / 法宝 [T] 万魂镇域 / 丹药 [H]
  // --------------------------------------------------------------------------
  function castTalisman() {
    if (player.isDown || player.talismanCd > 0) return;
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    player.talismanCd = cfg.talismanCooldown || 7.5;

    const { eye, dir } = getAimRayOriginAndDir();
    const targetPos = eye.clone().addScaledVector(dir, 10.5);
    targetPos.y = 0.1;

    const lock = findCrosshairEnemy(22, 0.85, false);
    const center = lock ? lock.pos.clone() : targetPos;

    window.CombatHandsVFX?.playMudraSequence('skill_talisman', '#c084fc');
    window.CombatHandsVFX?.spawnRingBurst(center.clone().setY(0.15), 0xc084fc, cfg.talismanRadius || 4.2, 0.55, true);

    const list = window.CombatEnemies ? window.CombatEnemies.getEnemies() : [];
    let stunnedCount = 0;
    list.forEach((e) => {
      if (e.state !== 'dead' && e.pos.distanceTo(center) <= (cfg.talismanRadius || 4.2)) {
        window.CombatEnemies.applyStun(e, cfg.talismanStunDuration || 3.2);
        stunnedCount++;
      }
    });
    if (typeof showNotification === 'function') {
      showNotification(`【技能[G]·定身缚灵符】结印敕令！定身 ${stunnedCount} 名敌人`);
    }
  }

  function castThunderSeal() {
    if (player.isDown || player.thunderSealCd > 0) return;
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    player.thunderSealCd = cfg.thunderSealCooldown || 9.0;
    const radius = cfg.thunderSealRadius || 5.5;
    const dmg = cfg.thunderSealDmg || 68;
    const shieldMult = cfg.thunderSealShieldMult || 2.6;

    const { eye, dir } = getAimRayOriginAndDir();
    let targetPos = eye.clone().addScaledVector(dir, 11.5);
    if (dir.y < -0.15) {
      const tFloor = (0.1 - eye.y) / dir.y;
      if (tFloor > 1 && tFloor <= (cfg.thunderSealRange || 24.0)) {
        targetPos = eye.clone().addScaledVector(dir, tFloor);
      }
    }
    targetPos.y = 0.1;

    const lock = findCrosshairEnemy(cfg.thunderSealRange || 24.0, 0.80, false);
    const center = lock ? lock.pos.clone().setY(0.1) : targetPos;

    window.CombatHandsVFX?.playMudraSequence('skill_thunder', '#fde047');
    window.CombatHandsVFX?.spawnLightningPillar(center, 0xfde047, 0.50);
    window.CombatHandsVFX?.spawnRingBurst(center.clone().setY(0.14), 0xfde047, radius, 0.48, true);
    window.CombatHandsVFX?.spawnRingBurst(center.clone().setY(0.24), 0x38bdf8, radius * 0.72, 0.35, true);
    window.CombatHandsVFX?.addShake(1.25, 0.25);

    const list = window.CombatEnemies ? window.CombatEnemies.getEnemies() : [];
    let hitCount = 0;
    let brokeCount = 0;
    list.forEach((e) => {
      if (e.state !== 'dead' && e.pos.distanceTo(center) <= radius) {
        hitCount++;
        const res = window.CombatEnemies.damageEnemy(e, dmg, {
          shieldMult,
          fromPlayer: true,
          killMethod: 'normal'
        });
        if (res.brokeShield || res.coreExposed) brokeCount++;
        if (e.state !== 'dead' && e.state !== 'coreExposed') {
          window.CombatEnemies.applyStun(e, 1.15);
        }
      }
    });
    if (hitCount > 0 && window.CombatHUD) {
      window.CombatHUD.triggerHitmarker(brokeCount > 0 ? 'crit' : 'shield');
    }
    if (typeof showNotification === 'function') {
      showNotification(`【技能[V]·九霄震雷破盾印】天雷轰击 ${hitCount} 敌${brokeCount > 0 ? `（震碎 ${brokeCount} 面护盾！）` : ''}`);
    }
  }

  function castWanHun() {
    if (player.isDown || player.wanHunCd > 0) return;
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    player.wanHunCd = cfg.wanHunCooldown || 16.0;
    player.wanHunActiveTimer = cfg.wanHunDuration || 10.0;

    window.CombatHandsVFX?.playMudraSequence('fabao_wanhun', '#a855f7');
    window.CombatHandsVFX?.spawnDomainRing(player.pos, cfg.wanHunRadius || 18.0, player.wanHunActiveTimer, 0xa855f7);
    if (window.CombatEnemies) {
      window.CombatEnemies.activateWanHunSlow(player.pos, cfg.wanHunRadius || 18.0, player.wanHunActiveTimer);
    }
    if (typeof showNotification === 'function') {
      showNotification('【法宝[T]·万魂帆】结印展阵！30m 紫金魂域压制敌移速 -40%');
    }
  }

  function useQuickPill() {
    if (player.isDown || player.pillCd > 0) return;
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    player.pillCd = cfg.pillCooldown || 6.0;

    let pillLabel = '回气散 (测试补给)';
    if (typeof playerInventory !== 'undefined') {
      if ((playerInventory.mat_080 || 0) > 0) {
        playerInventory.mat_080 -= 1;
        pillLabel = '气血丹 (背包扣除×1)';
      } else if ((playerInventory.mat_090 || 0) > 0) {
        playerInventory.mat_090 -= 1;
        pillLabel = '回气散 (背包扣除×1)';
      }
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      if (typeof syncBackpackFromPlayerInventory === 'function') syncBackpackFromPlayerInventory();
    }

    player.hp = Math.min(cfg.maxHp || 100, player.hp + 55);
    player.qi = Math.min(cfg.maxQi || 100, player.qi + 45);
    player.shield = Math.min(cfg.maxShield || 60, player.shield + 20);
    window.CombatHandsVFX?.triggerGesture('pill', 0.32, player.element);
    window.CombatAudio?.play('pill');
    if (typeof showNotification === 'function') showNotification(`【服用丹药】${pillLabel}：恢复 55 耐久与 45 灵力！`);
  }

  // --------------------------------------------------------------------------
  // 受击、格挡、完美弹反 (Just Guard) 与失能重生
  // --------------------------------------------------------------------------
  function takeDamage(rawDmg, attackerPos, isUnblockable = false, proj = null, meleeAttacker = null) {
    if (player.isDown || player.invulnTimer > 0) return { hit: false, parried: false };

    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    const nowSec = performance.now() / 1000;

    // 方位判定 (用于格挡与屏外红弧方向记录)
    let isFromFront = true;
    if (attackerPos) {
      const fwd = getForwardVector(false);
      const toAtk = attackerPos.clone().sub(player.pos).setY(0).normalize();
      const dot = fwd.dot(toAtk);
      isFromFront = dot > 0.15;

      const right = getRightVector();
      player.lastHitDirAngle = Math.atan2(right.dot(toAtk), dot);
      player.lastHitFlashTimer = 0.65;
    }

    // 检查格挡与完美弹反
    if (player.isGuarding && isFromFront && !isUnblockable) {
      const heldFor = nowSec - player.guardStartTime;
      if (heldFor <= (cfg.parryWindow || 0.20)) {
        // 完美弹反！！
        player.qi = Math.min(cfg.maxQi || 100, player.qi + (cfg.parryQiGain || 20));
        window.CombatAudio?.play('parry_clang');
        window.CombatHandsVFX?.triggerGesture('parry', 0.30, player.element);
        window.CombatHandsVFX?.addShake(1.6, 0.25);
        window.CombatHandsVFX?.spawnInkGlitchSparks(window.innerWidth * 0.5, window.innerHeight * 0.5, '#fde047', 16);
        window.CombatHUD?.flashParry();
        window.CombatMain?.triggerHitstop(0.05);

        // 反弹远程剑气
        if (proj) {
          const reflectDir = (proj.sourceEnemy && proj.sourceEnemy.state !== 'dead')
            ? proj.sourceEnemy.pos.clone().add(new THREE.Vector3(0, 1.15, 0)).sub(proj.pos).normalize()
            : getForwardVector(true);
          window.CombatHandsVFX?.spawnProjectile({
            owner: 'player',
            kind: 'metal_sword',
            element: 'metal',
            origin: proj.pos.clone(),
            dir: reflectDir,
            speed: proj.speed * 1.45,
            dmg: proj.dmg * (cfg.parryReflectMult || 2.0),
            shieldMult: 2.8,
            maxDist: 45,
            colorHex: 0xfde047
          });
        }
        return { hit: false, parried: true };
      }

      // 普通格挡减伤 70%
      rawDmg *= (1 - (cfg.guardMitigation || 0.70));
      player.qi = Math.max(0, player.qi - 6);
    }

    player.shieldRegenDelayTimer = cfg.shieldRegenDelay || 4.0;
    let rem = rawDmg;
    if (player.shield > 0) {
      const absorbed = Math.min(player.shield, rem);
      player.shield -= absorbed;
      rem -= absorbed;
    }
    if (rem > 0) {
      player.hp = Math.max(0, player.hp - rem);
    }

    window.CombatAudio?.play('player_hit');
    window.CombatHandsVFX?.addShake(0.85, 0.18);
    window.CombatHUD?.flashDamage();

    if (player.hp <= 0) {
      player.isDown = true;
      player.downTimer = 2.8;
      player.isCharging = false;
      player.isGuarding = false;
      player.isGrabbing = false;
      window.CombatAudio?.play('player_down');
    }
    return { hit: true, parried: false };
  }

  // --------------------------------------------------------------------------
  // 每帧玩家状态更新与协程同步
  // --------------------------------------------------------------------------
  function updatePlayer(dt, moveInput) {
    const cfg = (window.CombatConfig && window.CombatConfig.player) || {};
    const mCfg = (window.CombatConfig && window.CombatConfig.movement) || {};

    if (player.isDown) {
      player.downTimer -= dt;
      if (player.downTimer <= 0) {
        resetToSpawn();
        if (typeof showNotification === 'function') showNotification('【灵能重构完成】已在宗门基地前方重新站起！');
      }
      return;
    }

    if (player.fireCooldown > 0) player.fireCooldown = Math.max(0, player.fireCooldown - dt);
    if (player.talismanCd > 0) player.talismanCd = Math.max(0, player.talismanCd - dt);
    if (player.thunderSealCd > 0) player.thunderSealCd = Math.max(0, player.thunderSealCd - dt);
    if (player.wanHunCd > 0) player.wanHunCd = Math.max(0, player.wanHunCd - dt);
    if (player.wanHunActiveTimer > 0) player.wanHunActiveTimer = Math.max(0, player.wanHunActiveTimer - dt);
    if (player.pillCd > 0) player.pillCd = Math.max(0, player.pillCd - dt);
    if (player.lastHitFlashTimer > 0) player.lastHitFlashTimer = Math.max(0, player.lastHitFlashTimer - dt);

    // 灵力与护体罡气恢复
    player.qi = Math.min(cfg.maxQi || 100, player.qi + (cfg.qiRegenRate || 11) * dt);
    if (player.shieldRegenDelayTimer > 0) {
      player.shieldRegenDelayTimer -= dt;
    } else if (player.shield < (cfg.maxShield || 60)) {
      player.shield = Math.min(cfg.maxShield || 60, player.shield + (cfg.shieldRegenRate || 15) * dt);
    }

    // 蓄力计时
    let chargeRatio = 0;
    if (player.isCharging) {
      player.chargeTime += dt;
      chargeRatio = Math.min(1, player.chargeTime / (cfg.chargeTime || 0.65));
    }

    // 灵丝抽魂拔丹持续更新 + 3D->2D 实时投影
    if (player.isGrabbing) {
      player.grabTimer -= dt;
      const camera = window.World3D && window.World3D.getCamera ? window.World3D.getCamera() : null;
      if (camera && window.CombatHandsVFX) {
        const projList = [];
        player.grabTargets.forEach((e) => {
          if (!e) return;
          const v = e.pos.clone().add(new THREE.Vector3(0, 1.15, 0));
          v.project(camera);
          if (v.z <= 1) {
            projList.push({
              sx: (v.x * 0.5 + 0.5) * window.innerWidth,
              sy: (-v.y * 0.5 + 0.5) * window.innerHeight,
              enemy: e
            });
          }
        });
        window.CombatHandsVFX.setGrabScreenTargets(projList);
      }
      if (player.grabTimer <= 0) finishCoreGrab();
    }

    // 更新移动与碰撞
    updateMovement(dt, moveInput);

    // 持续按 E 尸体装箱 (SYS_CORPSE_BOXING)
    updateCorpseBoxing(dt, !!moveInput.holdInteract);

    // 同步前景双臂状态
    if (window.CombatHandsVFX) {
      window.CombatHandsVFX.setPoseState({
        element: player.element,
        activeColor: player.lastFiredColor,
        chargeRatio,
        isGuarding: player.isGuarding
      });
    }

    // 更新 3D 相机位姿与动态 FOV
    syncCameraTransform(dt, moveInput, chargeRatio);
  }

  function updateCorpseBoxing(dt, isHoldingE) {
    if (!isHoldingE) {
      player.boxingTarget = null;
      player.boxingHoldProgress = 0;
      player.boxingLabel = '';
      return;
    }
    const list = window.CombatEnemies ? window.CombatEnemies.getEnemies() : [];
    let nearestCorpse = null;
    let nearestDist = 4.2;
    for (let i = 0; i < list.length; i++) {
      const e = list[i];
      if (e.state === 'dead' && !e.corpseBoxed) {
        const d = e.pos.distanceTo(player.pos);
        if (d < nearestDist) {
          nearestDist = d;
          nearestCorpse = e;
        }
      }
    }
    if (nearestCorpse) {
      player.boxingTarget = nearestCorpse;
      player.boxingLabel = '正在装载修士尸体进运输箱...';
      const holdDur = (window.CombatConfig && window.CombatConfig.player.corpseBoxHoldTime) || 0.65;
      player.boxingHoldProgress = Math.min(1, player.boxingHoldProgress + dt / holdDur);
      if (player.boxingHoldProgress >= 1) {
        window.CombatEnemies.boxCorpse(nearestCorpse);
        player.boxingTarget = null;
        player.boxingHoldProgress = 0;
        player.boxingLabel = '';
      }
      return;
    }

    // 若身边无尸体，检测 4.8m 内是否有瘫痪防御塔并执行长按 E (3.0s) 原地重建
    const paralyzedTurret = (window.CombatAIDirector && window.CombatAIDirector.findNearestParalyzedTurret)
      ? window.CombatAIDirector.findNearestParalyzedTurret(player.pos, 4.8)
      : null;
    if (paralyzedTurret) {
      player.boxingTarget = paralyzedTurret;
      player.boxingLabel = `正在原地重建瘫痪【${paralyzedTurret.name}】(耗50%材料)...`;
      const rebuildDur = (window.CombatConfig && window.CombatConfig.aiDirector && window.CombatConfig.aiDirector.turretRebuildHoldTime) || 3.0;
      player.boxingHoldProgress = Math.min(1, player.boxingHoldProgress + dt / rebuildDur);
      if (player.boxingHoldProgress >= 1) {
        window.CombatAIDirector.rebuildParalyzedTurret(paralyzedTurret, true);
        player.boxingTarget = null;
        player.boxingHoldProgress = 0;
        player.boxingLabel = '';
      }
      return;
    }

    player.boxingTarget = null;
    player.boxingHoldProgress = 0;
    player.boxingLabel = '';
  }

  function syncCameraTransform(dt, moveInput, chargeRatio) {
    const cam = window.World3D && window.World3D.getCamera ? window.World3D.getCamera() : null;
    if (!cam) return;

    const mCfg = (window.CombatConfig && window.CombatConfig.movement) || {};
    const shake = window.CombatHandsVFX ? window.CombatHandsVFX.getShakeOffset(dt) : { x: 0, y: 0, roll: 0 };

    const eyeY = player.pos.y + (mCfg.eyeHeight || 1.72) + (player.isDown ? -1.1 : 0);
    cam.position.set(player.pos.x + shake.x, eyeY + shake.y, player.pos.z);

    const lookDir = getForwardVector(true);
    cam.lookAt(cam.position.x + lookDir.x, cam.position.y + lookDir.y, cam.position.z + lookDir.z);
    cam.rotation.z += shake.roll;

    // 动态 FOV 插值
    let targetFov = mCfg.baseFov || 84;
    if (mCfg.dynamicFovEnabled !== false) {
      if (player.isGrabbing) targetFov -= 10;
      else if (player.dashTimer > 0) targetFov += 7;
      else if (chargeRatio > 0.1) targetFov -= 6 * chargeRatio;
      else if (moveInput.sprint && Math.hypot(player.vel.x, player.vel.z) > 6.2) targetFov += 5;
    }
    cam.fov += (targetFov - cam.fov) * Math.min(1, dt * 12);
    cam.updateProjectionMatrix();

    // 同步顶部原有 HUD 罗盘方向
    const compassTrack = document.getElementById('compassTrack');
    if (compassTrack) {
      let deg = ((player.yaw * 180) / Math.PI) % 360;
      if (deg > 180) deg -= 360;
      if (deg < -180) deg += 360;
      compassTrack.style.transform = `translateX(${-deg * 1.6}px)`;
    }
  }

  window.CombatPlayer = {
    resetToSpawn,
    getState: () => player,
    getForwardVector,
    getRightVector,
    findCrosshairEnemy,
    triggerJump,
    triggerDash,
    switchElement,
    fireLight,
    startCharge,
    releaseCharge,
    cancelCharge,
    startGuard,
    stopGuard,
    tryCoreGrab,
    castTalisman,
    castThunderSeal,
    castWanHun,
    useQuickPill,
    takeDamage,
    grantQi,
    syncElementFromCasket,
    updatePlayer
  };
})();
