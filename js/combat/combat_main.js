// ============================================================================
// js/combat/combat_main.js - 第一人称战斗系统总控、背后出剑/归匣闭环与 UI 上下文切换
// ============================================================================

(function () {
  let isActive = false;
  let hasSpawnedWelcome = false;
  let hitstopTimer = 0;
  let hookRegistered = false;

  // 第一人称战斗下隐藏建造底栏与旧杂项，由融合后的 #fpCombatActionBar 接管底部；按 [V] 放出无人机切出后恢复建造底栏
  const GOD_MODE_HIDE_IDS = [
    'mechArm',
    'crosshairElement',
    'questObjectiveCard',
    'machineInteractPrompt',
    'dspBuildHotbarRoot',
    'adaDialogueContainer'
  ];
  const GOD_MODE_INVISIBLE_IDS = [];
  const hiddenByCombatSet = new Set();
  const invisibleByCombatSet = new Set();

  function ensureFrameHook() {
    if (hookRegistered) return;
    if (window.World3D && typeof window.World3D.registerFrameHook === 'function') {
      window.World3D.registerFrameHook(onFrameTick);
      hookRegistered = true;
    }
  }

  function triggerHitstop(durationSec) {
    const enabled = !window.CombatConfig || !window.CombatConfig.player || window.CombatConfig.player.hitstopEnabled !== false;
    if (!enabled) return;
    hitstopTimer = Math.max(hitstopTimer, durationSec);
  }

  // --------------------------------------------------------------------------
  // 弹道步进（背后弧线收敛准星 -> 碰撞结算 -> 高速划弧飞回背后剑匣）
  // --------------------------------------------------------------------------
  function updateProjectiles(dt) {
    if (!window.CombatHandsVFX || !window.CombatEnemies || !window.CombatPlayer) return;
    const list = window.CombatHandsVFX.getProjectiles();
    const enemies = window.CombatEnemies.getEnemies();
    const playerState = window.CombatPlayer.getState();
    const rightVec = window.CombatPlayer.getRightVector();
    const fwdVec = window.CombatPlayer.getForwardVector(false);
    const playerEyeCenter = new THREE.Vector3(playerState.pos.x, playerState.pos.y + 1.15, playerState.pos.z);

    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];

      // 阶段 B：已出鞘剑匣飞剑调头飞回【背后双肩剑匣】！
      if (p.phase === 'returning') {
        p.returnTimer += dt;
        const side = p.shoulderSide || (p.casketSlotIndex % 2 === 0 ? -1 : 1);
        const backCasketPos = new THREE.Vector3(
          playerState.pos.x - fwdVec.x * 1.65 + rightVec.x * side * 0.72,
          playerState.pos.y + 1.48,
          playerState.pos.z - fwdVec.z * 1.65 + rightVec.z * side * 0.72
        );
        const toCasket = new THREE.Vector3(
          backCasketPos.x - p.pos.x,
          backCasketPos.y - p.pos.y,
          backCasketPos.z - p.pos.z
        );
        const dist = toCasket.length();
        if (dist <= 1.85 || p.returnTimer >= 1.10) {
          if (window.CombatCasket) window.CombatCasket.dockSword(p.casketSlotIndex);
          if (window.CombatAudio) window.CombatAudio.play('sword_sheath_back');
          window.CombatHandsVFX.removeProjectileAt(i);
          continue;
        }
        toCasket.normalize();
        p.dir.lerp(toCasket, Math.min(1, dt * 16)).normalize();
        p.pos.addScaledVector(p.dir, 56 * dt);
        p.mesh.position.copy(p.pos);
        p.mesh.lookAt(p.pos.x + p.dir.x, p.pos.y + p.dir.y, p.pos.z + p.dir.z);
        continue;
      }

      // 阶段 A：出剑初段自背后肩侧弧线汇聚向准星
      if (p.launchCurveTimer > 0 && p.aimTargetPoint) {
        p.launchCurveTimer = Math.max(0, p.launchCurveTimer - dt);
        const toAim = new THREE.Vector3(
          p.aimTargetPoint.x - p.pos.x,
          p.aimTargetPoint.y - p.pos.y,
          p.aimTargetPoint.z - p.pos.z
        ).normalize();
        p.dir.lerp(toAim, Math.min(1, dt * 22)).normalize();
      } else if (p.homingStrength > 0 && p.homingTarget && p.homingTarget.state !== 'dead') {
        const tgtY = p.homingTarget.pos.y + (p.homingTarget.type === 'jindan' ? 2.1 : 1.15);
        const desired = new THREE.Vector3(
          p.homingTarget.pos.x - p.pos.x,
          tgtY - p.pos.y,
          p.homingTarget.pos.z - p.pos.z
        ).normalize();
        p.dir.lerp(desired, Math.min(1, dt * p.homingStrength)).normalize();
      }

      const step = p.speed * dt;
      p.pos.addScaledVector(p.dir, step);
      if (p.gravity) {
        p.velY -= p.gravity * dt;
        p.pos.y += p.velY * dt;
      }
      p.traveled += step;

      p.mesh.position.copy(p.pos);
      if (p.kind === 'sword_blade' || p.kind === 'metal_sword' || p.kind === 'turret_sword') {
        p.mesh.lookAt(p.pos.x + p.dir.x, p.pos.y + p.dir.y, p.pos.z + p.dir.z);
      } else if (p.kind === 'fire_orb') {
        p.mesh.rotation.x += dt * 7;
        p.mesh.rotation.y += dt * 5;
      }

      let finishedOut = false;

      if (p.owner === 'player' || p.owner === 'turret') {
        for (let j = 0; j < enemies.length; j++) {
          const e = enemies[j];
          if (e.state === 'dead' || p.hitIds.has(e.id)) continue;
          const eY = e.pos.y + (e.type === 'jindan' ? 2.1 : 1.15);
          const dx = p.pos.x - e.pos.x;
          const dy = p.pos.y - eY;
          const dz = p.pos.z - e.pos.z;
          const hitRad = (p.kind === 'water_wave' ? 1.85 : 1.15) * (e.cfg.corpseScale || 1.0);
          if (dx * dx + dy * dy + dz * dz <= hitRad * hitRad) {
            p.hitIds.add(e.id);
            if (p.qiOnHit > 0 && p.owner === 'player') {
              window.CombatPlayer.grantQi(p.qiOnHit);
            }
            if (p.splashRadius > 0) {
              applyFireSplash(p, enemies);
              finishedOut = true;
              break;
            } else {
              const res = window.CombatEnemies.damageEnemy(e, p.dmg, {
                shieldMult: p.shieldMult,
                slowDuration: p.slowDuration || 0,
                burnDps: p.burnDps || 0,
                burnDuration: p.burnDuration || 0,
                fromPlayer: p.owner === 'player',
                killMethod: p.owner === 'turret' ? 'turret' : 'normal'
              });
              if (res.hit && p.owner === 'player' && window.CombatHUD) {
                window.CombatHUD.triggerHitmarker(res.brokeShield || res.coreExposed ? 'crit' : (res.hitShield ? 'shield' : 'normal'));
              }
              if (p.pierceCount > 0) {
                p.pierceCount--;
              } else {
                finishedOut = true;
                break;
              }
            }
          }
        }
      } else if (p.owner === 'enemy') {
        if (p.pos.distanceTo(playerEyeCenter) <= 1.25) {
          const res = window.CombatPlayer.takeDamage(p.dmg, p.pos, false, p);
          if (res.parried || res.hit) finishedOut = true;
        }
      }

      if (!finishedOut && p.pos.y <= 0.15) {
        if (p.splashRadius > 0 && (p.owner === 'player' || p.owner === 'turret')) {
          applyFireSplash(p, enemies);
        }
        finishedOut = true;
      }
      if (!finishedOut && p.traveled >= p.maxDist) {
        finishedOut = true;
      }

      if (finishedOut) {
        if (p.owner === 'player' && p.casketSlotIndex >= 0) {
          p.phase = 'returning';
          p.returnTimer = 0;
          if (window.CombatCasket) window.CombatCasket.markSwordReturning(p.casketSlotIndex);
        } else {
          window.CombatHandsVFX.removeProjectileAt(i);
        }
      }
    }
  }

  function applyFireSplash(p, enemies) {
    window.CombatHandsVFX.spawnRingBurst(p.pos.clone(), p.colorHex || 0xf97316, p.splashRadius, 0.35, false);
    for (let j = 0; j < enemies.length; j++) {
      const e = enemies[j];
      if (e.state === 'dead') continue;
      if (e.pos.distanceTo(p.pos) <= p.splashRadius) {
        const res = window.CombatEnemies.damageEnemy(e, p.dmg, {
          shieldMult: p.shieldMult,
          burnDps: p.burnDps || 0,
          burnDuration: p.burnDuration || 0
        });
        if (res.hit && window.CombatHUD) {
          window.CombatHUD.triggerHitmarker(res.brokeShield ? 'crit' : (res.hitShield ? 'shield' : 'normal'));
        }
      }
    }
  }

  function onFrameTick(dt, animTime) {
    if (!isActive) return;

    let combatDt = dt;
    if (hitstopTimer > 0) {
      hitstopTimer = Math.max(0, hitstopTimer - dt);
      combatDt = 0;
    }

    const nowMs = performance.now();
    if (window.CombatInput) window.CombatInput.updateHoldCharge(nowMs, dt);
    const moveInput = window.CombatInput ? window.CombatInput.getMoveInput() : {};

    if (combatDt > 0) {
      if (window.CombatCasket) window.CombatCasket.update(combatDt);
      if (window.CombatPlayer) window.CombatPlayer.updatePlayer(combatDt, moveInput);
      if (window.CombatEnemies) window.CombatEnemies.updateEnemies(combatDt, animTime);
      updateProjectiles(combatDt);
    }

    if (window.CombatHandsVFX) window.CombatHandsVFX.updateVfx(dt, animTime);
    if (window.CombatHUD) window.CombatHUD.updateHUD(dt);
  }

  function enter() {
    if (isActive) return;
    if (!window.World3D || !window.World3D.isReady()) {
      if (typeof showNotification === 'function') showNotification('3D 世界尚在初始化，请稍候...');
      return;
    }

    if (typeof exitBuildPlacingMode === 'function') exitBuildPlacingMode();
    if (typeof isDismantleMode !== 'undefined' && isDismantleMode && typeof toggleDismantleMode === 'function') toggleDismantleMode();
    if (typeof closeOtherModals === 'function') closeOtherModals(null);

    ensureFrameHook();
    isActive = true;

    // 干净隐藏上帝建厂 HUD 杂项，仅保留正中罗盘与左下角紧凑 #combatHudBar
    hiddenByCombatSet.clear();
    GOD_MODE_HIDE_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('hidden')) {
        el.classList.add('hidden');
        hiddenByCombatSet.add(id);
      }
    });
    invisibleByCombatSet.clear();
    GOD_MODE_INVISIBLE_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.classList.contains('invisible')) {
        el.classList.add('invisible', 'pointer-events-none');
        invisibleByCombatSet.add(id);
      }
    });
    const machPrompt = document.getElementById('machineInteractPrompt');
    if (machPrompt) machPrompt.classList.add('hidden');

    window.World3D.setExternalCameraControl(true);
    if (window.CombatCasket) window.CombatCasket.syncFromInventory();
    if (window.CombatPlayer) {
      if (!hasSpawnedWelcome) window.CombatPlayer.resetToSpawn();
      window.CombatPlayer.syncElementFromCasket();
    }
    if (window.CombatInput) window.CombatInput.setActive(true);
    if (window.CombatHandsVFX) {
      window.CombatHandsVFX.setVisible(true);
      // 进战开启【临·兵·斗·剑】四拍仪式感开匣结印！
      window.CombatHandsVFX.playMudraSequence('unseal_ritual', '#38bdf8');
    }
    if (window.CombatEnemies) {
      window.CombatEnemies.setVisible(true);
      if (!hasSpawnedWelcome && window.CombatEnemies.getEnemies().length === 0) {
        window.CombatEnemies.spawnPresetSquad('welcome');
        hasSpawnedWelcome = true;
      }
    }
    if (window.CombatHUD) window.CombatHUD.setVisible(true);

    const sum = window.CombatCasket && window.CombatCasket.getSummary ? window.CombatCasket.getSummary() : null;
    if (typeof showNotification === 'function') {
      const info = sum ? `背匣 ${sum.equippedCount}/4 剑 · 攻速 ${sum.speedMult.toFixed(2)}×` : '背后飞剑待命';
      showNotification(`【结印开匣入战】${info} · 左键从身后轮发/长按齐射 · [G/V]技能 · [T]法宝`);
    }
  }

  function exit() {
    if (!isActive) return;
    isActive = false;

    if (window.CombatInput) window.CombatInput.setActive(false);
    if (window.CombatHandsVFX) window.CombatHandsVFX.setVisible(false);
    if (window.CombatEnemies) window.CombatEnemies.setVisible(false);
    if (window.CombatHUD) window.CombatHUD.setVisible(false);
    if (window.World3D) window.World3D.setExternalCameraControl(false);

    // 精准恢复进入战斗前原样可见的全部上帝建厂 HUD 元素
    hiddenByCombatSet.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('hidden');
    });
    hiddenByCombatSet.clear();
    invisibleByCombatSet.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('invisible', 'pointer-events-none');
    });
    invisibleByCombatSet.clear();
    const machPrompt = document.getElementById('machineInteractPrompt');
    if (machPrompt) machPrompt.classList.remove('hidden');

    // 恢复原左下角 #combatHudBar 装备展示与 10 格血条外观
    const shWrap = document.getElementById('hudCombatShieldWrap');
    if (shWrap) shWrap.classList.add('hidden');
    if (typeof updateCombatEquipmentUI === 'function') updateCombatEquipmentUI(false);
    if (typeof window.restoreGodModeHpSegments === 'function') window.restoreGodModeHpSegments();

    if (typeof showNotification === 'function') {
      showNotification('【已返回上帝视角建造模式】原有工厂机器与建造操作已完整恢复');
    }
  }

  function toggle() {
    if (isActive) exit();
    else enter();
  }

  function toggleTuningPanel() {
    if (window.CombatHUD) window.CombatHUD.toggleTuningDrawer();
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(ensureFrameHook, 300);
  });

  const api = {
    enter,
    exit,
    toggle,
    toggleTuningPanel,
    triggerHitstop,
    isActive: () => isActive
  };

  window.CombatSystem = api;
  window.CombatMain = api;
})();
