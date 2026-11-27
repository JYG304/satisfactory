// ============================================================================
// js/combat/combat_input.js - Enhanced Input 风格第一人称键鼠控制与状态切换
// 支持：Pointer Lock 锁定视角、非锁定右键拖拽兜底、输入缓冲、零模态窗冲突
// ============================================================================

(function () {
  let isActive = false;
  let isPointerLocked = false;
  let pointerLockUnsupported = false;
  let isFallbackDragLook = false;
  let lastDragX = 0;
  let lastDragY = 0;

  const keysDown = new Set();
  let leftMouseDown = false;
  let leftDownTimestamp = 0;
  let chargeTriggeredByHold = false;

  function requestLock() {
    if (!isActive || pointerLockUnsupported) return;
    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
    const canvas = window.World3D && window.World3D.getCanvas ? window.World3D.getCanvas() : document.getElementById('world3DCanvas');
    if (canvas && document.pointerLockElement !== canvas && canvas.requestPointerLock) {
      try {
        const res = canvas.requestPointerLock();
        if (res && typeof res.catch === 'function') {
          res.catch(() => {
            pointerLockUnsupported = true;
            isPointerLocked = false;
            if (window.CombatHUD) window.CombatHUD.updateLockIndicator(false, true);
          });
        }
      } catch (err) {
        pointerLockUnsupported = true;
        isPointerLocked = false;
        if (window.CombatHUD) window.CombatHUD.updateLockIndicator(false, true);
      }
    }
  }

  function releaseLock() {
    if (document.pointerLockElement && document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  function getMoveInput() {
    if (!isActive || (typeof isAnyModalOpen === 'function' && isAnyModalOpen())) {
      return { forward: 0, right: 0, sprint: false, holdInteract: false };
    }
    const f = (keysDown.has('KeyW') ? 1 : 0) - (keysDown.has('KeyS') ? 1 : 0);
    const r = (keysDown.has('KeyD') ? 1 : 0) - (keysDown.has('KeyA') ? 1 : 0);
    const sprint = keysDown.has('ShiftLeft') || keysDown.has('ShiftRight');
    const holdInteract = keysDown.has('KeyE');
    return { forward: f, right: r, sprint, holdInteract };
  }

  function updateHoldCharge(nowMs, dt = 0.016) {
    if (!isActive || !window.CombatPlayer) return;
    // 方向键备用平滑转向 (方便无 PointerLock 沙盒/单手测试)
    const p = window.CombatPlayer.getState();
    const lookYaw = (keysDown.has('ArrowLeft') ? 1 : 0) - (keysDown.has('ArrowRight') ? 1 : 0);
    const lookPitch = (keysDown.has('ArrowUp') ? 1 : 0) - (keysDown.has('ArrowDown') ? 1 : 0);
    if (lookYaw !== 0) p.yaw += lookYaw * 2.1 * dt;
    if (lookPitch !== 0) p.pitch = Math.max(-1.35, Math.min(1.35, p.pitch + lookPitch * 1.5 * dt));

    if (!leftMouseDown) return;
    const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
    if (dec.DEC_04_rightClickAction === 'guard_parry') {
      if (!chargeTriggeredByHold && nowMs - leftDownTimestamp > 190) {
        chargeTriggeredByHold = true;
        window.CombatPlayer.startCharge();
      }
    }
  }

  function bindGlobalListeners() {
    document.addEventListener('pointerlockchange', () => {
      const canvas = window.World3D && window.World3D.getCanvas ? window.World3D.getCanvas() : document.getElementById('world3DCanvas');
      isPointerLocked = !!(canvas && document.pointerLockElement === canvas);
      if (window.CombatHUD) window.CombatHUD.updateLockIndicator(isPointerLocked);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isActive || !window.CombatPlayer) return;
      if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;

      const mCfg = (window.CombatConfig && window.CombatConfig.movement) || {};
      const sens = mCfg.mouseSensitivity || 0.0022;
      const p = window.CombatPlayer.getState();

      if (isPointerLocked) {
        p.yaw -= e.movementX * sens;
        p.pitch = Math.max(-1.35, Math.min(1.35, p.pitch - e.movementY * sens));
        if (window.CombatHandsVFX) {
          window.CombatHandsVFX.setPoseState({ swayX: -e.movementX * 0.08, swayY: e.movementY * 0.08 });
        }
      } else if (isFallbackDragLook) {
        const dx = e.clientX - lastDragX;
        const dy = e.clientY - lastDragY;
        p.yaw -= dx * sens * 1.4;
        p.pitch = Math.max(-1.35, Math.min(1.35, p.pitch - dy * sens * 1.4));
        lastDragX = e.clientX;
        lastDragY = e.clientY;
      } else {
        // 即使未锁屏时，也保持微弱前景双臂视差晃动
        const rx = (e.clientX / window.innerWidth) - 0.5;
        const ry = (e.clientY / window.innerHeight) - 0.5;
        if (window.CombatHandsVFX) {
          window.CombatHandsVFX.setPoseState({ swayX: rx * 1.6, swayY: ry * 1.6 });
        }
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (!isActive) return;
      if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
      if (e.target.closest('button, input, select, a, #fpCombatTuningDrawer, #fpCombatActionBar, #combatHudBar, .hud-panel, #dspBuildHotbarRoot, #sysActionsContainer')) {
        return;
      }

      // 如果还没 PointerLock 且点击的是视区，尝试锁定视角并直接响应动作
      if (!isPointerLocked && e.button === 0) {
        requestLock();
      }
      if (!isPointerLocked && e.button === 1) {
        isFallbackDragLook = true;
        lastDragX = e.clientX;
        lastDragY = e.clientY;
        return;
      }

      const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
      if (e.button === 0) {
        leftMouseDown = true;
        leftDownTimestamp = performance.now();
        chargeTriggeredByHold = false;
      } else if (e.button === 2) {
        e.preventDefault();
        if (dec.DEC_04_rightClickAction === 'charge_sword') {
          window.CombatPlayer.startCharge();
        } else {
          window.CombatPlayer.startGuard();
        }
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.button === 1) isFallbackDragLook = false;
      if (!isActive || !window.CombatPlayer) return;

      const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
      if (e.button === 0 && leftMouseDown) {
        leftMouseDown = false;
        if (chargeTriggeredByHold) {
          window.CombatPlayer.releaseCharge();
        } else {
          window.CombatPlayer.fireLight();
        }
        chargeTriggeredByHold = false;
      } else if (e.button === 2) {
        if (dec.DEC_04_rightClickAction === 'charge_sword') {
          window.CombatPlayer.releaseCharge();
        } else {
          window.CombatPlayer.stopGuard();
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!isActive) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.tagName === 'SELECT')) {
        return;
      }
      if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.blur();
      }

      keysDown.add(e.code);
      if (e.repeat) return;

      const code = e.code;
      try {
        if (code === 'Space') {
          e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.triggerJump();
        } else if (code === 'KeyC' || code === 'ShiftLeft') {
          if (code === 'KeyC') e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.triggerDash(getMoveInput());
        } else if (code === 'KeyF') {
          e.preventDefault();
          const ok = window.CombatPlayer && window.CombatPlayer.tryCoreGrab();
          if (!ok && typeof showNotification === 'function') {
            showNotification('【灵丝拔核】需将敌人护盾击破或血量压至 30% 以下露出金核后按 [F]！');
          }
        } else if (code === 'KeyG') {
          e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.castTalisman();
        } else if (code === 'KeyV') {
          e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.castThunderSeal();
        } else if (code === 'KeyT') {
          e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.castWanHun();
        } else if (code === 'KeyH') {
          e.preventDefault();
          window.CombatPlayer && window.CombatPlayer.useQuickPill();
        }
      } catch (err) {
        console.error('[CombatInput keydown error]', err);
      }
    });

    document.addEventListener('keyup', (e) => {
      keysDown.delete(e.code);
    });

    window.addEventListener('blur', () => {
      keysDown.clear();
      leftMouseDown = false;
      isFallbackDragLook = false;
    });
  }

  bindGlobalListeners();

  window.CombatInput = {
    setActive: (flag) => {
      isActive = !!flag;
      keysDown.clear();
      leftMouseDown = false;
      if (isActive && document.activeElement && document.activeElement.tagName === 'BUTTON') {
        document.activeElement.blur();
      }
      if (!isActive) releaseLock();
    },
    isPointerLocked: () => isPointerLocked,
    requestLock,
    releaseLock,
    getMoveInput,
    updateHoldCharge
  };
})();
