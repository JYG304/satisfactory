// ====================================================================
// js/world/world_stealth_actor.js - 3D 大地图玩家化身与敌宗守卫潜行 AI 模块
// 负责玩家探索移动、法宝鬼域/山河障释放、守卫巡逻/视野锥检测与 POI 长按交互
// ====================================================================

(function () {
  let followAvatarMode = true;
  let droneMode = false;
  let boundContext = {};

  const explorerState = {
    wx: 0,
    wz: 26,
    yaw: Math.PI,
    speed: 14.5,
    nearbyPoi: null,
    holdEProgress: 0,
    holdETargetId: null,
    ghostDomainTimer: 0,
    shanheWallTimer: 0,
    spottedByGuard: false,
    miniHudTick: 0
  };

  function resolveContext(ctx) {
    if (ctx && typeof ctx === 'object') {
      boundContext = Object.assign({}, boundContext, ctx);
    }
    return boundContext;
  }

  function setContext(ctx) {
    if (ctx && typeof ctx === 'object') {
      boundContext = Object.assign({}, boundContext, ctx);
      try {
        renderMinimap(boundContext, 0);
      } catch (_) {}
    }
  }

  const droneAnim = {
    active: false,
    mode: 'launch',
    t: 0,
    duration: 1.05,
    startX: 0,
    startY: 2.2,
    startZ: 26,
    endX: 0,
    endY: 16,
    endZ: 26
  };

  function syncFollowBtnUI() {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('btnToggleFollowAvatar');
    if (btn) {
      const combatOn = typeof window !== 'undefined' && window.CombatSystem && window.CombatSystem.isActive && window.CombatSystem.isActive();
      btn.innerText = (!combatOn && droneMode) ? '[V] 收回无人机(回战斗)' : '[V] 放出无人机(进厂)';
    }
  }

  function setFollowAvatarMode(flag) {
    followAvatarMode = !!flag;
    syncFollowBtnUI();
    return followAvatarMode;
  }

  function toggleFollowAvatar(ctx) {
    const c = resolveContext(ctx);
    const hasCombat = typeof window !== 'undefined' && window.CombatSystem && typeof window.CombatSystem.isActive === 'function';
    const combatOn = hasCombat && window.CombatSystem.isActive();

    if (combatOn) {
      // 从第一人称战斗放出 3D 无人机起飞进入工厂视角
      let px = explorerState.wx;
      let pz = explorerState.wz;
      if (window.CombatPlayer && typeof window.CombatPlayer.getState === 'function') {
        const pst = window.CombatPlayer.getState();
        if (pst && pst.pos) {
          px = pst.pos.x;
          pz = pst.pos.z;
        }
      }
      explorerState.wx = px;
      explorerState.wz = pz;
      window.CombatSystem.exit();
      droneMode = true;
      followAvatarMode = true;
      if (c.explorerAvatar) {
        c.explorerAvatar.position.set(px, 0, pz);
        c.explorerAvatar.visible = true;
      }
      if (c.spiritDroneMesh) {
        c.spiritDroneMesh.position.set(px, 2.2, pz);
        c.spiritDroneMesh.visible = true;
      }
      droneAnim.active = true;
      droneAnim.mode = 'launch';
      droneAnim.t = 0;
      droneAnim.startX = px;
      droneAnim.startY = 2.2;
      droneAnim.startZ = pz;
      droneAnim.endX = px;
      droneAnim.endY = 16;
      droneAnim.endZ = pz;
      if (c.camState && c.camState.target) {
        c.camState.target.set(px, 2.2, pz);
        c.camState.distance = 6;
        c.camState.pitch = 0.25;
      }
      syncFollowBtnUI();
      if (typeof showNotification === 'function') {
        showNotification('🛸【放出灵枢无人机】无人机正从修士肩侧升空，切入工厂俯瞰视角！(再按 [V] 收回并返回战斗)');
      }
      return true;
    }

    if (droneMode && hasCombat) {
      // 从无人机工厂视角收回无人机并返回第一人称战斗
      droneMode = false;
      droneAnim.active = true;
      droneAnim.mode = 'recall';
      droneAnim.t = 0;
      droneAnim.startX = c.spiritDroneMesh ? c.spiritDroneMesh.position.x : explorerState.wx;
      droneAnim.startY = c.spiritDroneMesh ? c.spiritDroneMesh.position.y : 16;
      droneAnim.startZ = c.spiritDroneMesh ? c.spiritDroneMesh.position.z : explorerState.wz;
      droneAnim.endX = explorerState.wx;
      droneAnim.endY = 2.2;
      droneAnim.endZ = explorerState.wz;
      syncFollowBtnUI();
      return false;
    }

    // 兜底切换第一人称 / 无人机俯瞰
    droneMode = !droneMode;
    followAvatarMode = true;
    syncFollowBtnUI();
    if (c.explorerAvatar) c.explorerAvatar.visible = droneMode;
    if (c.spiritDroneMesh) {
      c.spiritDroneMesh.visible = droneMode;
      c.spiritDroneMesh.position.set(explorerState.wx, 16, explorerState.wz);
    }
    if (c.camState && c.camState.target) {
      c.camState.target.x = explorerState.wx;
      c.camState.target.z = explorerState.wz;
      if (droneMode) {
        c.camState.target.y = 6;
        c.camState.distance = 58;
        c.camState.pitch = 0.54;
      } else {
        c.camState.target.y = 2.2;
        c.camState.distance = 2.2;
        c.camState.pitch = 0.14;
      }
      if (typeof c.updateCameraTransform === 'function') {
        c.updateCameraTransform();
      }
    }
    return droneMode;
  }

  function cast3DGhostDomain(ctx) {
    const c = resolveContext(ctx);
    if (typeof window !== 'undefined' && window.FabaoSystem && typeof window.FabaoSystem.castGhostDomain === 'function') {
      const res = window.FabaoSystem.castGhostDomain();
      if (!res || !res.ok) {
        if (window.FabaoSystem.absorbSoulRemnant) window.FabaoSystem.absorbSoulRemnant(35);
      }
    }
    explorerState.ghostDomainTimer = 10.0;
    if (c.ghostDomainMesh) {
      c.ghostDomainMesh.position.set(explorerState.wx, 0.09, explorerState.wz);
      c.ghostDomainMesh.visible = true;
    }
    if (typeof window !== 'undefined' && window.MapExplorationSystem && window.MapExplorationSystem.state && window.MapExplorationSystem.state.exposed) {
      window.MapExplorationSystem.useFabaoEscape('wanhun');
    } else if (typeof showNotification === 'function') {
      showNotification('🚩【万魂幡·鬼域展开】半径 8m 鬼域已笼罩，守卫移速 -65%，视野收缩 45%！');
    }
  }

  function cast3DShanheWall(ctx) {
    const c = resolveContext(ctx);
    if (typeof window !== 'undefined' && window.FabaoSystem && typeof window.FabaoSystem.castShanheWall === 'function') {
      window.FabaoSystem.castShanheWall();
    }
    explorerState.shanheWallTimer = 8.0;
    if (c.shanheWallMesh) {
      const fx = Math.sin(explorerState.yaw);
      const fz = Math.cos(explorerState.yaw);
      c.shanheWallMesh.position.set(explorerState.wx + fx * 2.8, 1.6, explorerState.wz + fz * 2.8);
      c.shanheWallMesh.rotation.y = explorerState.yaw;
      c.shanheWallMesh.visible = true;
    }
    if (typeof window !== 'undefined' && window.MapExplorationSystem && window.MapExplorationSystem.state && window.MapExplorationSystem.state.exposed) {
      window.MapExplorationSystem.useFabaoEscape('shanhe');
    } else if (typeof showNotification === 'function') {
      showNotification('🏞️【山河社稷图·山河障】风墙已阻断守卫视线，并激活「缩地成寸」移速 +50%！');
    }
  }

  function triggerNearbyPoiInteract() {
    const poi = explorerState.nearbyPoi;
    if (!poi || typeof window === 'undefined') return;
    if (poi.type === 'remote_rich_ore') {
      if (window.World3D && typeof window.World3D.buildRemoteSwordMiningLine === 'function') {
        window.World3D.buildRemoteSwordMiningLine(poi.id);
      }
    } else if (window.MapExplorationSystem) {
      const mes = window.MapExplorationSystem;
      if (poi.type === 'sect_library') {
        const res = mes.sneakIntoSectLibrary(poi.id);
        if (res && res.ok && mes.showInlineRelicChoiceOverlay) {
          mes.showInlineRelicChoiceOverlay(poi.name);
        }
      } else if (poi.type === 'relic_stele') {
        const res = mes.comprehendRelicStele(poi.id);
        if (res && res.ok && mes.showInlineRelicChoiceOverlay) {
          mes.showInlineRelicChoiceOverlay(poi.name);
        }
      } else if (poi.type === 'wonder_node') {
        mes.exploreWonderNode(poi.id);
      } else if (poi.type === 'camp_beacon') {
        mes.visitCampBeacon(poi.id);
      }
    }
    explorerState.holdEProgress = 0;
    if (typeof document !== 'undefined') {
      const bar = document.getElementById('worldPoiHoldBar');
      if (bar) bar.style.width = '0%';
    }
  }

  let minimapClickBound = false;

  function renderMinimap(c, nowTime) {
    if (typeof document === 'undefined') return;
    const canvas = document.getElementById('worldMinimapCanvas');
    if (!canvas || !canvas.getContext) return;
    if (!canvas.width || canvas.width < 10) canvas.width = 160;
    if (!canvas.height || canvas.height < 10) canvas.height = 160;

    const range = 700;
    if (!minimapClickBound) {
      minimapClickBound = true;
      canvas.addEventListener('click', (ev) => {
        const rect = canvas.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) return;
        const nx = (ev.clientX - rect.left) / rect.width;
        const ny = (ev.clientY - rect.top) / rect.height;
        const tx = Math.max(-980, Math.min(980, Math.round((nx * 2 - 1) * range)));
        const tz = Math.max(-980, Math.min(980, Math.round((ny * 2 - 1) * range)));
        const curCtx = resolveContext();
        explorerState.wx = tx;
        explorerState.wz = tz;
        if (curCtx.explorerAvatar) curCtx.explorerAvatar.position.set(tx, 0, tz);
        if (curCtx.spiritDroneMesh && curCtx.spiritDroneMesh.visible) {
          curCtx.spiritDroneMesh.position.x = tx;
          curCtx.spiritDroneMesh.position.z = tz;
        }
        if (typeof window !== 'undefined' && window.CombatPlayer && window.CombatPlayer.getState) {
          const pst = window.CombatPlayer.getState();
          if (pst && pst.pos) { pst.pos.x = tx; pst.pos.z = tz; }
        }
        if (curCtx.camState && curCtx.camState.target) {
          curCtx.camState.target.x = tx;
          curCtx.camState.target.z = tz;
          if (typeof curCtx.updateCameraTransform === 'function') curCtx.updateCameraTransform();
        }
        renderMinimap(curCtx, nowTime);
      });
    }
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    const W = canvas.width;
    const H = canvas.height;
    const toPx = (wx, wz) => [
      ((wx + range) / (range * 2)) * W,
      ((wz + range) / (range * 2)) * H
    ];

    ctx2d.clearRect(0, 0, W, H);
    ctx2d.fillStyle = '#050b16';
    ctx2d.fillRect(0, 0, W, H);

    // 雷达十字与距离圈
    ctx2d.strokeStyle = 'rgba(34, 211, 238, 0.14)';
    ctx2d.lineWidth = 1;
    ctx2d.beginPath();
    ctx2d.moveTo(W / 2, 0); ctx2d.lineTo(W / 2, H);
    ctx2d.moveTo(0, H / 2); ctx2d.lineTo(W, H / 2);
    ctx2d.arc(W / 2, H / 2, W * 0.22, 0, Math.PI * 2);
    ctx2d.arc(W / 2, H / 2, W * 0.42, 0, Math.PI * 2);
    ctx2d.stroke();

    const pulse = 0.65 + 0.35 * Math.sin((nowTime || 0) * 4);

    // 五大工业区轮廓：中央母厂、东境、西境黑箱、南境、北境
    const drawZoneRect = (x1, z1, x2, z2, fill, stroke, label, textColor) => {
      const [px1, pz1] = toPx(x1, z1);
      const [px2, pz2] = toPx(x2, z2);
      const rw = Math.max(4, px2 - px1);
      const rh = Math.max(4, pz2 - pz1);
      ctx2d.fillStyle = fill;
      ctx2d.strokeStyle = stroke;
      ctx2d.lineWidth = 1;
      ctx2d.fillRect(px1, pz1, rw, rh);
      ctx2d.strokeRect(px1, pz1, rw, rh);
      if (label) {
        ctx2d.fillStyle = textColor || '#e2e8f0';
        ctx2d.font = 'bold 8px monospace';
        ctx2d.fillText(label, px1 + rw * 0.5 - 4, pz1 + rh * 0.5 + 3);
      }
    };

    // 中央母厂
    drawZoneRect(-28, -18, 24, 24, 'rgba(245, 158, 11, 0.28)', 'rgba(245, 158, 11, 0.85)', '中', '#fde68a');
    // 东境·百炉平铺巨阵
    drawZoneRect(284, -54, 390, 54, 'rgba(34, 211, 238, 0.20)', 'rgba(34, 211, 238, 0.78)', '东', '#a5f3fc');
    // 西境·高密黑箱魔方
    drawZoneRect(-382, -28, -316, 28, 'rgba(52, 211, 153, 0.22)', 'rgba(52, 211, 153, 0.80)', '西', '#a7f3d0');
    // 南境·生态退台
    drawZoneRect(-54, 338, 54, 434, 'rgba(16, 185, 129, 0.22)', 'rgba(16, 185, 129, 0.78)', '南', '#6ee7b7');
    // 北境·三层飞升奇观
    drawZoneRect(-54, -454, 54, -356, 'rgba(192, 132, 252, 0.24)', 'rgba(192, 132, 252, 0.85)', '北', '#e9d5ff');

    // 东南战区 (460, 320) 红色高亮
    const [dzX, dzZ] = toPx(460, 320);
    ctx2d.fillStyle = `rgba(239, 68, 68, ${(0.28 + 0.22 * pulse).toFixed(2)})`;
    ctx2d.strokeStyle = '#ef4444';
    ctx2d.lineWidth = 1.4;
    ctx2d.beginPath();
    ctx2d.arc(dzX, dzZ, 8, 0, Math.PI * 2);
    ctx2d.fill();
    ctx2d.stroke();
    ctx2d.fillStyle = '#fecaca';
    ctx2d.font = 'bold 8px monospace';
    ctx2d.fillText('战区', Math.min(W - 22, dzX - 9), Math.max(9, dzZ - 10));

    // 跨区 252m 三联传送带高速路 (36, 50) -> (280, 50)
    const [bh1x, bh1z] = toPx(36, 50);
    const [bh2x, bh2z] = toPx(280, 50);
    ctx2d.strokeStyle = '#fb923c';
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(bh1x, bh1z);
    ctx2d.lineTo(bh2x, bh2z);
    ctx2d.stroke();

    // 四大极远境巨型矿山与飞剑航线
    const farMines = [
      { x: 660, z: -160, tx: 284, tz: 0, label: '东矿' },
      { x: -660, z: 160, tx: -382, tz: 0, label: '西矿' },
      { x: 160, z: 660, tx: 0, tz: 338, label: '南矿' },
      { x: -160, z: -660, tx: 0, tz: -356, label: '北矿' }
    ];
    farMines.forEach((m) => {
      const [mx, mz] = toPx(m.x, m.z);
      const [tx, tz] = toPx(m.tx, m.tz);
      ctx2d.save();
      ctx2d.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx2d.lineWidth = 1.1;
      ctx2d.setLineDash([3, 3]);
      ctx2d.beginPath();
      ctx2d.moveTo(mx, mz);
      ctx2d.lineTo(tx, tz);
      ctx2d.stroke();
      ctx2d.restore();

      ctx2d.fillStyle = '#38bdf8';
      ctx2d.beginPath();
      ctx2d.moveTo(mx, mz - 4);
      ctx2d.lineTo(mx + 4, mz);
      ctx2d.lineTo(mx, mz + 4);
      ctx2d.lineTo(mx - 4, mz);
      ctx2d.closePath();
      ctx2d.fill();
      ctx2d.strokeStyle = '#fde047';
      ctx2d.lineWidth = 1;
      ctx2d.stroke();
    });

    // 北方宗门城廓轮廓 (wx: -48..+48, wz: -215..-120)
    const [sx1, sz1] = toPx(-48, -215);
    const [sx2, sz2] = toPx(48, -120);
    ctx2d.fillStyle = 'rgba(244, 63, 94, 0.16)';
    ctx2d.strokeStyle = 'rgba(244, 63, 94, 0.85)';
    ctx2d.lineWidth = 1;
    ctx2d.fillRect(sx1, sz1, sx2 - sx1, sz2 - sz1);
    ctx2d.strokeRect(sx1, sz1, sx2 - sx1, sz2 - sz1);

    // 出生点正前方·镇魔演武试炼场 (wx: 0, wz: 64)
    const [ax, az] = toPx(0, 64);
    ctx2d.fillStyle = 'rgba(168, 85, 247, 0.26)';
    ctx2d.strokeStyle = '#c084fc';
    ctx2d.beginPath();
    ctx2d.arc(ax, az, 5.5, 0, Math.PI * 2);
    ctx2d.fill();
    ctx2d.stroke();

    // 绘制 13 处大地图 POI
    const pois = Array.isArray(c.mapPois) ? c.mapPois : [];
    for (let i = 0; i < pois.length; i++) {
      const p = pois[i];
      const [px, pz] = toPx(p.wx, p.wz);
      if (p.type === 'sect_library' || String(p.id || '').startsWith('POI_SECT_')) {
        ctx2d.fillStyle = `rgba(244, 63, 94, ${pulse.toFixed(2)})`;
        ctx2d.beginPath();
        ctx2d.moveTo(px, pz - 4);
        ctx2d.lineTo(px + 4, pz);
        ctx2d.lineTo(px, pz + 4);
        ctx2d.lineTo(px - 4, pz);
        ctx2d.closePath();
        ctx2d.fill();
      } else if (p.type === 'relic_stele' || String(p.id || '').startsWith('POI_RELIC_')) {
        ctx2d.fillStyle = '#fbbf24';
        ctx2d.fillRect(px - 2, pz - 2, 4, 4);
      } else if (p.type === 'wonder_node') {
        ctx2d.fillStyle = '#10b981';
        ctx2d.beginPath();
        ctx2d.arc(px, pz, 2.5, 0, Math.PI * 2);
        ctx2d.fill();
      } else {
        ctx2d.fillStyle = '#38bdf8';
        ctx2d.beginPath();
        ctx2d.arc(px, pz, 2.2, 0, Math.PI * 2);
        ctx2d.fill();
      }
    }

    // 远境富矿极点与已建飞剑天轨航线
    const remoteOres = Array.isArray(c.resourceNodes) ? c.resourceNodes.filter(n => n && n.isRemoteRich) : [];
    for (let i = 0; i < remoteOres.length; i++) {
      const ro = remoteOres[i];
      const [ox, oz] = toPx(ro.x, ro.z);
      if (ro.built) {
        const tx = typeof ro.targetX === 'number' ? ro.targetX : 0;
        const tz = typeof ro.targetZ === 'number' ? ro.targetZ : 0;
        const [cx, cz] = toPx(tx, ro.z);
        const [dx, dz] = toPx(tx, tz);
        ctx2d.save();
        ctx2d.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx2d.lineWidth = 1.2;
        ctx2d.setLineDash([4, 3]);
        ctx2d.beginPath();
        ctx2d.moveTo(ox, oz);
        ctx2d.lineTo(cx, cz);
        ctx2d.lineTo(dx, dz);
        ctx2d.stroke();
        ctx2d.restore();
      }
      ctx2d.fillStyle = ro.built ? '#22d3ee' : '#c084fc';
      ctx2d.beginPath();
      ctx2d.arc(ox, oz, 2.6, 0, Math.PI * 2);
      ctx2d.fill();
    }

    // 巡逻守卫红点
    const guards = Array.isArray(c.sectGuards) ? c.sectGuards : [];
    ctx2d.fillStyle = '#fb7185';
    for (let i = 0; i < guards.length; i++) {
      const gp = guards[i].meshGroup && guards[i].meshGroup.position;
      if (!gp) continue;
      const [gx, gz] = toPx(gp.x, gp.z);
      ctx2d.fillRect(gx - 1.5, gz - 1.5, 3, 3);
    }

    // 玩家 / 无人机当前位置与朝向箭头
    let curX = explorerState.wx;
    let curZ = explorerState.wz;
    let curYaw = explorerState.yaw || 0;
    if (c.externalCameraControl && typeof window !== 'undefined' && window.CombatPlayer && window.CombatPlayer.getState) {
      const pst = window.CombatPlayer.getState();
      if (pst && pst.pos) {
        curX = pst.pos.x;
        curZ = pst.pos.z;
        curYaw = (pst.yaw || 0) + Math.PI;
      }
    } else if (c.camState && typeof c.camState.yaw === 'number') {
      curYaw = c.camState.yaw + Math.PI;
    }
    const [ux, uz] = toPx(curX, curZ);
    const dirX = Math.sin(curYaw);
    const dirZ = Math.cos(curYaw);
    const perpX = dirZ;
    const perpZ = -dirX;
    ctx2d.fillStyle = '#22d3ee';
    ctx2d.strokeStyle = '#ffffff';
    ctx2d.lineWidth = 1.2;
    ctx2d.beginPath();
    ctx2d.moveTo(ux + dirX * 6.5, uz + dirZ * 6.5);
    ctx2d.lineTo(ux - dirX * 4 + perpX * 4, uz - dirZ * 4 + perpZ * 4);
    ctx2d.lineTo(ux - dirX * 1.5, uz - dirZ * 1.5);
    ctx2d.lineTo(ux - dirX * 4 - perpX * 4, uz - dirZ * 4 - perpZ * 4);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.stroke();
  }

  function updateDroneFlight(dt, nowTime, c) {
    const drone = c.spiritDroneMesh;
    if (!drone) return;

    if (drone.visible && Array.isArray(drone.userData.rotors)) {
      const rs = drone.userData.rotors;
      for (let i = 0; i < rs.length; i++) {
        rs[i].rotation.y = nowTime * 28;
      }
    }

    if (droneAnim.active) {
      droneAnim.t = Math.min(1, droneAnim.t + dt / droneAnim.duration);
      const ease = 1 - Math.pow(1 - droneAnim.t, 3);
      const dx = droneAnim.startX + (droneAnim.endX - droneAnim.startX) * ease;
      const dy = droneAnim.startY + (droneAnim.endY - droneAnim.startY) * ease + Math.sin(droneAnim.t * Math.PI) * 2.4;
      const dz = droneAnim.startZ + (droneAnim.endZ - droneAnim.startZ) * ease;
      drone.position.set(dx, dy, dz);
      drone.rotation.x = droneAnim.mode === 'launch' ? -0.24 * Math.sin(droneAnim.t * Math.PI) : 0.24 * Math.sin(droneAnim.t * Math.PI);
      drone.rotation.y = nowTime * 2.2;

      if (c.camState && c.camState.target) {
        if (droneAnim.mode === 'launch') {
          c.camState.target.y = 2.2 + 3.8 * ease;
          c.camState.distance = 6 + 52 * ease;
          c.camState.pitch = 0.25 + 0.29 * ease;
        } else {
          c.camState.target.y = 6 - 3.8 * ease;
          c.camState.distance = 58 - 52 * ease;
          c.camState.pitch = 0.54 - 0.36 * ease;
        }
        if (typeof c.updateCameraTransform === 'function') c.updateCameraTransform();
      }

      if (droneAnim.t >= 1) {
        droneAnim.active = false;
        drone.rotation.x = 0;
        if (droneAnim.mode === 'recall') {
          drone.visible = false;
          if (c.explorerAvatar) c.explorerAvatar.visible = false;
          if (typeof window !== 'undefined' && window.CombatSystem && typeof window.CombatSystem.enter === 'function' && !window.CombatSystem.isActive()) {
            window.CombatSystem.enter();
          }
          syncFollowBtnUI();
        }
      }
    } else if (droneMode && drone.visible && c.camState && c.camState.target) {
      // 玩家化身为灵枢无人机：带着玩家本体与镜头中心 1:1 同步巡航
      const tx = c.camState.target.x;
      const tz = c.camState.target.z;
      drone.position.x = tx;
      drone.position.z = tz;
      drone.position.y = 14 + Math.sin(nowTime * 2.6) * 0.45;
      drone.rotation.y = nowTime * 0.8;
      if (c.explorerAvatar) c.explorerAvatar.visible = false;
    }
  }

  function updateExplorerAndStealth(dt, nowTime, ctx) {
    const c = resolveContext(ctx);
    const explorerAvatar = c.explorerAvatar;

    // 低频刷新小地图（不受弹窗阻塞与首帧跳过影响，无论第一人称战斗或无人机俯瞰均实时显示）
    explorerState.miniHudTick++;
    if (explorerState.miniHudTick === 1 || explorerState.miniHudTick % 10 === 0) {
      renderMinimap(c, nowTime);
    }

    const isBlocking = typeof c.isModalBlockingWorld === 'function' ? c.isModalBlockingWorld() : false;
    if (isBlocking) return;

    updateDroneFlight(dt, nowTime, c);
    if (!explorerAvatar) return;

    const keysPressed = c.keysPressed || {};
    const camState = c.camState || { yaw: 0, target: { x: 0, z: 0 } };
    const sectGuards = Array.isArray(c.sectGuards) ? c.sectGuards : [];
    const mapPois = Array.isArray(c.mapPois) ? c.mapPois : [];

    // 1. 玩家坐标同步：第一人称战斗下直接读取 CombatPlayer 坐标；无人机/地面模式下用 WASD 移动
    if (c.externalCameraControl) {
      if (typeof window !== 'undefined' && window.CombatPlayer && typeof window.CombatPlayer.getState === 'function') {
        const pst = window.CombatPlayer.getState();
        if (pst && pst.pos) {
          explorerState.wx = pst.pos.x;
          explorerState.wz = pst.pos.z;
          explorerState.yaw = (pst.yaw || 0) + Math.PI;
        }
      }
    } else {
      let moveForward = 0;
      let moveRight = 0;
      if (keysPressed['KeyW'] || keysPressed['ArrowUp']) moveForward += 1;
      if (keysPressed['KeyS'] || keysPressed['ArrowDown']) moveForward -= 1;
      if (keysPressed['KeyD'] || keysPressed['ArrowRight']) moveRight += 1;
      if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) moveRight -= 1;

      const moving = (moveForward !== 0 || moveRight !== 0);
      const isDroneFlight = droneMode || (camState.distance && camState.distance > 6);
      if (moving) {
        const len = Math.hypot(moveForward, moveRight);
        const nf = moveForward / len;
        const nr = moveRight / len;
        const sinY = Math.sin(camState.yaw);
        const cosY = Math.cos(camState.yaw);
        const dx = -sinY * nf + cosY * nr;
        const dz = -cosY * nf - sinY * nr;

        let spd = isDroneFlight ? Math.max(36, (camState.distance || 58) * 0.65) : explorerState.speed;
        if (keysPressed['ShiftLeft'] || keysPressed['ShiftRight']) spd *= 1.85;
        if (explorerState.shanheWallTimer > 0) spd *= 1.5;

        // 玩家化身与无人机/镜头中心 1:1 绑定移动（覆盖完整 2000x2000 盆地）
        const baseX = (isDroneFlight && camState.target) ? camState.target.x : explorerState.wx;
        const baseZ = (isDroneFlight && camState.target) ? camState.target.z : explorerState.wz;
        const nx = Math.max(-980, Math.min(980, baseX + dx * spd * dt));
        const nz = Math.max(-980, Math.min(980, baseZ + dz * spd * dt));
        explorerState.wx = nx;
        explorerState.wz = nz;
        explorerState.yaw = Math.atan2(dx, dz);

        if (typeof window !== 'undefined' && window.CombatPlayer && typeof window.CombatPlayer.getState === 'function') {
          const pst = window.CombatPlayer.getState();
          if (pst && pst.pos) {
            pst.pos.x = nx;
            pst.pos.z = nz;
          }
        }

        if (isDroneFlight) {
          explorerAvatar.visible = false;
          if (camState.target) {
            camState.target.x = nx;
            camState.target.z = nz;
            if (typeof c.updateCameraTransform === 'function') c.updateCameraTransform();
            if (typeof c.markRaycastDirty === 'function') c.markRaycastDirty();
          }
        } else {
          explorerAvatar.visible = true;
          explorerAvatar.position.set(nx, Math.abs(Math.sin(nowTime * 8)) * 0.14, nz);
          explorerAvatar.rotation.y = explorerState.yaw;
          if (followAvatarMode && camState.target) {
            camState.target.x += (nx - camState.target.x) * Math.min(1, dt * 8);
            camState.target.z += (nz - camState.target.z) * Math.min(1, dt * 8);
            if (typeof c.updateCameraTransform === 'function') c.updateCameraTransform();
            if (typeof c.markRaycastDirty === 'function') c.markRaycastDirty();
          }
        }
      } else {
        if (isDroneFlight && camState.target) {
          explorerState.wx = camState.target.x;
          explorerState.wz = camState.target.z;
          explorerAvatar.visible = false;
        } else {
          explorerAvatar.position.y = Math.sin(nowTime * 2.4) * 0.08;
        }
      }
    }

    // 2. 法宝 3D 特效计时器
    if (explorerState.ghostDomainTimer > 0) {
      explorerState.ghostDomainTimer = Math.max(0, explorerState.ghostDomainTimer - dt);
      if (c.ghostDomainMesh) {
        c.ghostDomainMesh.position.set(explorerState.wx, 0.09, explorerState.wz);
        c.ghostDomainMesh.rotation.z = nowTime * 0.6;
        if (explorerState.ghostDomainTimer <= 0) c.ghostDomainMesh.visible = false;
      }
    }
    if (explorerState.shanheWallTimer > 0) {
      explorerState.shanheWallTimer = Math.max(0, explorerState.shanheWallTimer - dt);
      if (c.shanheWallMesh && explorerState.shanheWallTimer <= 0) c.shanheWallMesh.visible = false;
    }

    // 3. 敌宗藏经阁 3D 巡逻守卫与视野锥检测
    let spotted = false;
    for (let i = 0; i < sectGuards.length; i++) {
      const g = sectGuards[i];
      const inGhost = explorerState.ghostDomainTimer > 0 &&
        Math.hypot(g.meshGroup.position.x - explorerState.wx, g.meshGroup.position.z - explorerState.wz) <= 8.5;
      const spdMult = inGhost ? 0.35 : 1.0;
      const rangeMult = inGhost ? 0.55 : 1.0;

      if (g.chasing && explorerState.shanheWallTimer <= 0) {
        const toPx = explorerState.wx - g.meshGroup.position.x;
        const toPz = explorerState.wz - g.meshGroup.position.z;
        const distP = Math.hypot(toPx, toPz);
        if (distP > 18 || Math.hypot(explorerState.wx - g.centerX, explorerState.wz - g.centerZ) > 22) {
          g.chasing = false;
        } else if (distP > 1.2) {
          g.meshGroup.position.x += (toPx / distP) * 7.2 * spdMult * dt;
          g.meshGroup.position.z += (toPz / distP) * 7.2 * spdMult * dt;
          g.meshGroup.rotation.y = Math.atan2(toPx, toPz);
        }
      } else {
        g.chasing = false;
        g.angle += g.angularSpeed * spdMult * dt;
        const nx = g.centerX + Math.cos(g.angle) * g.patrolRadius;
        const nz = g.centerZ + Math.sin(g.angle) * g.patrolRadius;
        const tx = -Math.sin(g.angle) * (g.angularSpeed > 0 ? 1 : -1);
        const tz = Math.cos(g.angle) * (g.angularSpeed > 0 ? 1 : -1);
        g.meshGroup.position.set(nx, 0, nz);
        g.meshGroup.rotation.y = Math.atan2(tx, tz);
      }

      // 视野锥判定 (山河障开启时遮蔽视线)
      let seesPlayer = false;
      if (explorerState.shanheWallTimer <= 0) {
        const vx = explorerState.wx - g.meshGroup.position.x;
        const vz = explorerState.wz - g.meshGroup.position.z;
        const dist = Math.hypot(vx, vz);
        const effRange = g.visionRange * rangeMult;
        if (dist <= effRange && dist > 0.01) {
          const fx = Math.sin(g.meshGroup.rotation.y);
          const fz = Math.cos(g.meshGroup.rotation.y);
          const dot = (vx / dist) * fx + (vz / dist) * fz;
          if (dot >= g.halfFovCos) {
            seesPlayer = true;
          }
        }
      }
      if (seesPlayer) {
        spotted = true;
        g.coneMat.opacity = 0.56;
        g.coneMat.color.setHex(0xff1e42);
      } else {
        g.coneMat.opacity = 0.24;
        g.coneMat.color.setHex(inGhost ? 0xa855f7 : 0xf43f5e);
      }

      // 守卫头顶 3D 魂火警戒灯球（纯 3D 美术表现警戒度）
      if (g.alertOrb && g.orbMat) {
        const msAlert = (typeof window !== 'undefined' && window.MapExplorationSystem && window.MapExplorationSystem.state)
          ? (window.MapExplorationSystem.state.alertness || 0) : 0;
        const orbScale = seesPlayer ? (1.7 + Math.sin(nowTime * 14) * 0.35) : (1.0 + (msAlert / 100) * 0.8);
        g.alertOrb.scale.set(orbScale, orbScale, orbScale);
        if (seesPlayer || msAlert >= 75) {
          g.orbMat.color.setHex(0xff1e42);
          g.orbMat.emissive.setHex(0xe11d48);
        } else if (msAlert >= 30) {
          g.orbMat.color.setHex(0xf97316);
          g.orbMat.emissive.setHex(0xea580c);
        } else {
          g.orbMat.color.setHex(0xfbbf24);
          g.orbMat.emissive.setHex(0xb45309);
        }
      }
    }

    explorerState.spottedByGuard = spotted;
    if (typeof window !== 'undefined' && window.MapExplorationSystem && window.MapExplorationSystem.state) {
      const ms = window.MapExplorationSystem.state;
      if (spotted) {
        ms.alertness = Math.min(100, ms.alertness + 28 * dt);
        if (ms.alertness >= 100 && !ms.exposed) {
          ms.exposed = true;
          for (let i = 0; i < sectGuards.length; i++) {
            const g = sectGuards[i];
            if (Math.hypot(g.centerX - explorerState.wx, g.centerZ - explorerState.wz) < 20) g.chasing = true;
          }
          if (typeof showNotification === 'function') {
            showNotification('🚨【被守卫当场抓包】警戒度 100%！按 [1] 展开万魂幡鬼域 或 [2] 展开山河障脱身！');
          }
        }
      } else if (!ms.exposed && ms.alertness > 0) {
        ms.alertness = Math.max(0, ms.alertness - 5 * dt);
      }
    }

    // 4. 检测附近 3D POI（距离 <= 6.5m）并驱动 [E] 长按现场交互
    let nearest = null;
    let nearestDist = Infinity;
    for (let i = 0; i < mapPois.length; i++) {
      const p = mapPois[i];
      const d = Math.hypot(p.wx - explorerState.wx, p.wz - explorerState.wz);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = p;
      }
    }
    explorerState.nearbyPoi = (nearest && nearestDist <= 6.5) ? nearest : null;
    if (!explorerState.nearbyPoi && Array.isArray(c.resourceNodes)) {
      let nearOre = null;
      let nearOreDist = Infinity;
      for (let i = 0; i < c.resourceNodes.length; i++) {
        const nd = c.resourceNodes[i];
        if (!nd || !nd.isRemoteRich || nd.built) continue;
        const d = Math.hypot(nd.x - explorerState.wx, nd.z - explorerState.wz);
        if (d < nearOreDist) {
          nearOreDist = d;
          nearOre = nd;
        }
      }
      if (nearOre && nearOreDist <= 8.5) {
        explorerState.nearbyPoi = {
          id: nearOre.id,
          type: 'remote_rich_ore',
          name: nearOre.label,
          wx: nearOre.x,
          wz: nearOre.z
        };
      }
    }

    if (typeof document !== 'undefined') {
      const promptEl = document.getElementById('worldPoiInteractPrompt');
      const promptTxt = document.getElementById('worldPoiPromptText');
      const holdBar = document.getElementById('worldPoiHoldBar');
      if (explorerState.nearbyPoi && promptEl && promptTxt) {
        const p = explorerState.nearbyPoi;
        const actionMap = {
          sect_library: `按住 [E] 潜入【${p.name}】搜刮古修残卷`,
          relic_stele: `按住 [E] 参悟【${p.name}】三选一`,
          wonder_node: `按住 [E] 山河图收录【${p.name}】(+35灵韵)`,
          camp_beacon: `按住 [E] 在【${p.name}】休整降警戒(-20%)`,
          remote_rich_ore: '按住 [E] 立【御剑道标】并入主干剑道（整匣飞剑运矿 + 道标中继供电）'
        };
        promptTxt.innerText = actionMap[p.type] || `按住 [E] 交互 ${p.name}`;
        promptEl.classList.remove('hidden');
        promptEl.classList.add('flex');

        if (keysPressed['KeyE']) {
          const holdDuration = p.type === 'sect_library' ? 1.5 : 0.7;
          explorerState.holdEProgress = Math.min(1, explorerState.holdEProgress + dt / holdDuration);
          if (holdBar) holdBar.style.width = `${Math.round(explorerState.holdEProgress * 100)}%`;
          if (explorerState.holdEProgress >= 1) {
            triggerNearbyPoiInteract();
          }
        }
      } else if (promptEl) {
        promptEl.classList.add('hidden');
        promptEl.classList.remove('flex');
        explorerState.holdEProgress = 0;
        if (holdBar) holdBar.style.width = '0%';
      }

      // 5. 低频刷新顶部轻量潜行条 (每 10 帧一次，零 DOM 抖动)
      explorerState.miniHudTick++;
      if (explorerState.miniHudTick % 10 === 0) {
        const nearEl = document.getElementById('miniHudNearestPoi');
        if (nearEl && nearest) {
          nearEl.innerText = `${nearest.name} (${Math.round(nearestDist)}m)`;
        }
        const ms = (typeof window !== 'undefined' && window.MapExplorationSystem) ? window.MapExplorationSystem.state : null;
        if (ms) {
          const aPct = Math.round(ms.alertness || 0);
          const aBar = document.getElementById('miniHudAlertBar');
          const aTxt = document.getElementById('miniHudAlertText');
          if (aBar) aBar.style.width = `${aPct}%`;
          if (aTxt) {
            aTxt.innerText = spotted ? `⚠️ ${aPct}%` : `${aPct}%`;
            aTxt.className = aPct >= 75 ? 'text-rose-400 font-bold' : (aPct >= 35 ? 'text-amber-300 font-bold' : 'text-emerald-300 font-bold');
          }
        }
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.WorldStealthActor = {
      setContext,
      syncFollowBtnUI,
      setFollowAvatarMode,
      getFollowAvatarMode: () => followAvatarMode,
      toggleFollowAvatar,
      cast3DGhostDomain,
      cast3DShanheWall,
      triggerNearbyPoiInteract,
      updateExplorerAndStealth,
      update: updateExplorerAndStealth,
      getExplorerState: () => explorerState
    };
  }
})();
