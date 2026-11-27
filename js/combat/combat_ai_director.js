// ============================================================================
// js/combat/combat_ai_director.js - UE5 风格群体战斗导演、EQS 空间查询与塔防联动
// 优化版：基于 World3D.getWorldVersion() 缓存 233 建筑碰撞与炮塔表，消除每帧重复分配
// ============================================================================

(function () {
  const activeMeleeHolders = new Map();  // enemyId -> expireTime
  const activeRangedHolders = new Map(); // enemyId -> expireTime
  const turretCooldowns = new Map();     // bldId -> remainingCooldown

  let cachedVersion = -1;
  let cachedObstacles = [];
  let cachedGroundObstacles = [];
  let cachedTurrets = [];
  let cachedBattleBases = [];
  let cachedCranes = [];

  function pruneTokens(nowSec) {
    activeMeleeHolders.forEach((exp, id) => { if (exp <= nowSec) activeMeleeHolders.delete(id); });
    activeRangedHolders.forEach((exp, id) => { if (exp <= nowSec) activeRangedHolders.delete(id); });
  }

  function requestToken(enemy, kind, durationSec = 2.6, nowSec = performance.now() / 1000) {
    pruneTokens(nowSec);
    const cfg = (window.CombatConfig && window.CombatConfig.aiDirector) || { maxMeleeTokens: 2, maxRangedTokens: 2 };
    const pool = kind === 'melee' ? activeMeleeHolders : activeRangedHolders;
    const cap = kind === 'melee' ? (cfg.maxMeleeTokens || 2) : (cfg.maxRangedTokens || 2);

    if (pool.has(enemy.id)) {
      pool.set(enemy.id, nowSec + durationSec);
      return true;
    }
    if (pool.size < cap) {
      pool.set(enemy.id, nowSec + durationSec);
      return true;
    }
    return false;
  }

  function releaseToken(enemy) {
    if (!enemy) return;
    activeMeleeHolders.delete(enemy.id);
    activeRangedHolders.delete(enemy.id);
  }

  function getTokenSummary() {
    return {
      meleeUsed: activeMeleeHolders.size,
      rangedUsed: activeRangedHolders.size
    };
  }

  function getOffscreenInfo(enemyPos, playerPos, playerYaw) {
    const cfg = (window.CombatConfig && window.CombatConfig.aiDirector) || { offscreenAngleDeg: 105 };
    const forwardX = -Math.sin(playerYaw);
    const forwardZ = -Math.cos(playerYaw);
    const rightX = Math.cos(playerYaw);
    const rightZ = -Math.sin(playerYaw);

    const dx = enemyPos.x - playerPos.x;
    const dz = enemyPos.z - playerPos.z;
    const len = Math.hypot(dx, dz) || 1;
    const nx = dx / len;
    const nz = dz / len;

    const dotF = forwardX * nx + forwardZ * nz;
    const dotR = rightX * nx + rightZ * nz;
    const angleDeg = (Math.acos(Math.max(-1, Math.min(1, dotF))) * 180) / Math.PI;
    const screenAngleRad = Math.atan2(dotR, dotF);

    return {
      isOffscreen: angleDeg > (cfg.offscreenAngleDeg || 105),
      angleDeg,
      screenAngleRad
    };
  }

  // --------------------------------------------------------------------------
  // 缓存版 3D 工厂建筑静态碰撞体积（仅在建造/拆除变更 worldVersion 时重建）
  // --------------------------------------------------------------------------
  function ensureObstacleCache() {
    if (!window.World3D || !window.World3D.getBuildingEntries) return;
    const ver = window.World3D.getWorldVersion ? window.World3D.getWorldVersion() : 0;
    if (ver === cachedVersion && cachedObstacles.length > 0) return;

    const entries = window.World3D.getBuildingEntries();
    if (!entries) return;

    cachedVersion = ver;
    cachedObstacles = [];
    cachedGroundObstacles = [];
    cachedTurrets = [];
    cachedBattleBases = [];
    cachedCranes = [];

    const aiCfg = (window.CombatConfig && window.CombatConfig.aiDirector) || {};
    const hpMap = aiCfg.turretHpMap || { bd_160: 600, thunder_turret: 1000, battle_base: 1200 };
    const initAmmo = aiCfg.turretInitialAmmo != null ? aiCfg.turretInitialAmmo : 20;

    entries.forEach((entry) => {
      const bld = entry.bld;
      if (!bld) return;
      const def = window.World3D.getBuildingTableDef ? window.World3D.getBuildingTableDef(bld.type) : null;
      const ext = window.World3D.getOrientedHalfExtents
        ? window.World3D.getOrientedHalfExtents(def, bld.rot || 0)
        : { hw: 1.5, hd: 1.5, h: 2.0 };
      const wy = bld.wy || 0;
      const isTurret = bld.type === 'bd_160' || bld.type === 'thunder_turret';
      const isBattleBase = bld.type === 'battle_base';
      const isCrane = bld.type === 'crane_distributor';

      if (isTurret || isBattleBase) {
        const mHp = hpMap[bld.type] || 600;
        if (typeof bld.maxHp !== 'number') bld.maxHp = mHp;
        if (typeof bld.hp !== 'number') bld.hp = bld.maxHp;
        if (typeof bld.isParalyzed !== 'boolean') bld.isParalyzed = false;
        if (isTurret && typeof bld.ammoCount !== 'number') bld.ammoCount = initAmmo;
        if (typeof bld.lowAmmo !== 'boolean') bld.lowAmmo = isTurret && bld.ammoCount <= 0;
        if (typeof bld.autoRebuildTimer !== 'number') bld.autoRebuildTimer = 0;
      }

      const item = {
        id: bld.id,
        type: bld.type,
        name: bld.name || bld.type,
        bld,
        minX: (bld.wx || 0) - ext.hw,
        maxX: (bld.wx || 0) + ext.hw,
        minZ: (bld.wz || 0) - ext.hd,
        maxZ: (bld.wz || 0) + ext.hd,
        minY: wy,
        maxY: wy + ext.h,
        cx: bld.wx || 0,
        cz: bld.wz || 0,
        hw: ext.hw,
        hd: ext.hd,
        isTurret,
        isBattleBase,
        isCrane,
        isHighSha: bld.type === 'deconstructor' || bld.type === 'alchemy_table' || bld.type === 'tribulation_table'
      };
      cachedObstacles.push(item);
      if (item.minY <= 3.5) cachedGroundObstacles.push(item);
      if (item.isTurret) cachedTurrets.push(item);
      if (item.isBattleBase) cachedBattleBases.push(item);
      if (item.isCrane) cachedCranes.push(item);
    });
  }

  function getFactoryObstacles() {
    ensureObstacleCache();
    return cachedObstacles;
  }

  function isPointBlockedByObstacles(x, z, obstacles, margin = 0.75) {
    const list = obstacles === cachedObstacles ? cachedGroundObstacles : obstacles;
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      if (o.minY > 2.2) continue;
      if (o.maxY - o.minY <= 0.45) continue;
      if (x >= o.minX - margin && x <= o.maxX + margin && z >= o.minZ - margin && z <= o.maxZ + margin) {
        return o;
      }
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // EQS 空间查询：最优射程环点 + 防扎堆散开 + 侧移点
  // --------------------------------------------------------------------------
  function queryRingPosition(enemy, targetPos, minR, maxR, allEnemies, obstacles, playerPos, playerYaw) {
    const idealR = (minR + maxR) * 0.5;
    let bestX = targetPos.x;
    let bestZ = targetPos.z;
    let found = false;
    let bestScore = -99999;

    const fwdX = -Math.sin(playerYaw);
    const fwdZ = -Math.cos(playerYaw);

    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2 + (enemy.strafeSeed || 0);
      const cx = targetPos.x + Math.cos(ang) * idealR;
      const cz = targetPos.z + Math.sin(ang) * idealR;
      if (Math.abs(cx) > 78 || Math.abs(cz) > 78) continue;
      if (isPointBlockedByObstacles(cx, cz, obstacles, 0.9)) continue;

      let score = 100 - Math.hypot(cx - enemy.pos.x, cz - enemy.pos.z) * 1.6;

      for (let j = 0; j < allEnemies.length; j++) {
        const other = allEnemies[j];
        if (other.id === enemy.id || other.state === 'dead') continue;
        const dOther = Math.hypot(cx - other.pos.x, cz - other.pos.z);
        if (dOther < 2.8) score -= (2.8 - dOther) * 38;
      }

      if (playerPos) {
        const dx = cx - playerPos.x;
        const dz = cz - playerPos.z;
        const l = Math.hypot(dx, dz) || 1;
        score += ((dx / l) * fwdX + (dz / l) * fwdZ) * 22;
      }

      if (score > bestScore) {
        bestScore = score;
        bestX = cx;
        bestZ = cz;
        found = true;
      }
    }
    return found ? new THREE.Vector3(bestX, 0, bestZ) : targetPos.clone();
  }

  function queryStrafePoint(enemy, targetPos, dirSign, obstacles) {
    const dx = enemy.pos.x - targetPos.x;
    const dz = enemy.pos.z - targetPos.z;
    const curR = Math.max(3.5, Math.hypot(dx, dz));
    const nextAng = Math.atan2(dz, dx) + dirSign * 0.45;
    const tx = targetPos.x + Math.cos(nextAng) * curR;
    const tz = targetPos.z + Math.sin(nextAng) * curR;
    if (!isPointBlockedByObstacles(tx, tz, obstacles, 0.8)) {
      return new THREE.Vector3(tx, 0, tz);
    }
    return null;
  }

  // --------------------------------------------------------------------------
  // 双目标仇恨评分 (玩家 vs 防御塔/高煞气建筑)
  // --------------------------------------------------------------------------
  function selectTarget(enemy, playerPos, obstacles) {
    const cfg = window.CombatConfig || {};
    const dec08 = (cfg.decisions && cfg.decisions.DEC_08_enemyAttackBuildings) || 'blocked_only';

    const playerAlive = window.CombatPlayer && !window.CombatPlayer.getState().isDown;
    let bestTarget = {
      category: 'player',
      pos: playerPos.clone(),
      obstacle: null,
      score: playerAlive ? 100 : -999
    };

    if (playerAlive) {
      const dP = enemy.pos.distanceTo(playerPos);
      bestTarget.score += Math.max(0, 40 - dP) + (enemy.damageFromPlayer || 0) * 1.2;
    }

    if (enemy.aiMode === 'siege' || dec08 === 'aggressive') {
      for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        if (o.bld && o.bld.isParalyzed) continue; // 瘫痪建筑仇恨归 0，敌军不再攻击
        if (!o.isTurret && !o.isBattleBase && !o.isHighSha && dec08 !== 'aggressive') continue;
        const d = Math.hypot(o.cx - enemy.pos.x, o.cz - enemy.pos.z);
        const threat = (o.isTurret || o.isBattleBase) ? 95 : (o.isHighSha ? 78 : 20);
        const sc = threat + Math.max(0, 36 - d);
        if (sc > bestTarget.score) {
          bestTarget = {
            category: 'building',
            pos: new THREE.Vector3(o.cx, o.minY, o.cz),
            obstacle: o,
            score: sc
          };
        }
      }
    }

    if (dec08 !== 'never' && bestTarget.category === 'player') {
      const dirX = bestTarget.pos.x - enemy.pos.x;
      const dirZ = bestTarget.pos.z - enemy.pos.z;
      const dist = Math.hypot(dirX, dirZ) || 1;
      const probeX = enemy.pos.x + (dirX / dist) * Math.min(2.2, dist);
      const probeZ = enemy.pos.z + (dirZ / dist) * Math.min(2.2, dist);
      const blocker = isPointBlockedByObstacles(probeX, probeZ, obstacles, 0.45);
      if (blocker) bestTarget.blockingObstacle = blocker;
    }

    return bestTarget;
  }

  // --------------------------------------------------------------------------
  // 防御塔耐久受击、瘫痪（不可摧毁）、原地重建与千纸鹤补弹/收尸
  // --------------------------------------------------------------------------
  function damageBuilding(obstacle, rawDmg) {
    if (!obstacle || !obstacle.bld) return false;
    const bld = obstacle.bld;
    if (typeof bld.maxHp !== 'number' || bld.isParalyzed) return false;
    bld.hp = Math.max(0, bld.hp - rawDmg);
    if (bld.hp <= 0) {
      bld.hp = 0;
      bld.isParalyzed = true;
      bld.autoRebuildTimer = 0;
      if (typeof showNotification === 'function') {
        showNotification(`⚠️【防御塔瘫痪】${obstacle.name} 耐久归零已停火！靠近长按 [E] 3秒或由傀儡防御站原地重建`);
      }
      return true;
    }
    return false;
  }

  function tryConsumeRebuildMaterials(bldType) {
    if (typeof playerInventory === 'undefined' || typeof XIUXIAN_BUILDINGS === 'undefined') return true;
    const def = XIUXIAN_BUILDINGS[bldType];
    if (!def || !Array.isArray(def.costs)) return true;
    // 消耗 50% 建造材料（至少 1 个）；若背包不足则提示保底重建
    let hasAll = true;
    def.costs.forEach((c) => {
      const need = Math.max(1, Math.ceil((c.need || 1) * 0.5));
      const key = String(c.code || '').toLowerCase();
      const upperKey = String(c.code || '').toUpperCase();
      const owned = (playerInventory[key] || 0) + (playerInventory[upperKey] || 0);
      if (owned < need) hasAll = false;
    });
    if (hasAll) {
      def.costs.forEach((c) => {
        const need = Math.max(1, Math.ceil((c.need || 1) * 0.5));
        const key = String(c.code || '').toLowerCase();
        const upperKey = String(c.code || '').toUpperCase();
        if ((playerInventory[key] || 0) >= need) playerInventory[key] -= need;
        else if ((playerInventory[upperKey] || 0) >= need) playerInventory[upperKey] -= need;
      });
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    return hasAll;
  }

  function rebuildParalyzedTurret(obstacle, byPlayer = true) {
    if (!obstacle || !obstacle.bld || !obstacle.bld.isParalyzed) return false;
    const bld = obstacle.bld;
    const paidFull = tryConsumeRebuildMaterials(obstacle.type);
    bld.hp = bld.maxHp;
    bld.isParalyzed = false;
    bld.autoRebuildTimer = 0;
    if (window.CombatAudio) window.CombatAudio.play('corpse_box');
    if (typeof showNotification === 'function') {
      const modeTxt = byPlayer ? (paidFull ? '已消耗50%材料' : '应急修复') : '傀儡防御站自动';
      showNotification(`🔧【防御塔原地重建】${obstacle.name}（${modeTxt}）已恢复满血 (${bld.maxHp}/${bld.maxHp})！`);
    }
    return true;
  }

  function findNearestParalyzedTurret(pos, maxDist = 4.8) {
    ensureObstacleCache();
    let best = null;
    let bestDist = maxDist;
    const pools = [cachedTurrets, cachedBattleBases];
    for (let p = 0; p < pools.length; p++) {
      const list = pools[p];
      for (let i = 0; i < list.length; i++) {
        const o = list[i];
        if (!o.bld || !o.bld.isParalyzed) continue;
        const d = Math.hypot(pos.x - o.cx, pos.z - o.cz);
        if (d <= bestDist) {
          bestDist = d;
          best = o;
        }
      }
    }
    return best;
  }

  function pullAmmoFromInventory(turretType, amount = 10) {
    if (typeof playerInventory === 'undefined') return 0;
    const keys = turretType === 'thunder_turret'
      ? ['mat_139', 'MAT_139', 'mat_076']
      : ['mat_074', 'mat_075', 'mat_076'];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const avail = playerInventory[k] || 0;
      if (avail > 0) {
        const take = Math.min(avail, amount);
        playerInventory[k] -= take;
        if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
        return take;
      }
    }
    return 0;
  }

  // --------------------------------------------------------------------------
  // 驱动防御塔开火(需弹药/非瘫痪)、傀儡站修塔重建、千纸鹤(BD_198)收尸补弹
  // --------------------------------------------------------------------------
  function updateDefenseTurrets(dt, enemies) {
    const cfg = (window.CombatConfig && window.CombatConfig.aiDirector) || {};
    const dec = (window.CombatConfig && window.CombatConfig.decisions) || {};
    if (!cfg.turretEnabled || !window.CombatHandsVFX) return;
    ensureObstacleCache();

    const craneRange = cfg.craneHarvestRange || 50; // 25 格 = 50m
    const craneDelay = cfg.craneHarvestDelay || 1.5;
    const repairRange = cfg.battleBaseRepairRange || 32;
    const requireAmmo = dec.DEC_15_turretRequireAmmo !== false;

    // 1. 千纸鹤赋能台 (BD_198)：25 格内自动捡尸 + 空投补弹
    if (cachedCranes.length > 0 && dec.DEC_16_craneAutoCorpse !== false && window.CombatEnemies) {
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.state !== 'dead' || e.corpseBoxed) continue;
        let inCraneRange = false;
        for (let c = 0; c < cachedCranes.length; c++) {
          const cr = cachedCranes[c];
          if (Math.hypot(e.pos.x - cr.cx, e.pos.z - cr.cz) <= craneRange) {
            inCraneRange = true;
            break;
          }
        }
        if (inCraneRange) {
          e.cranePickupTimer = (e.cranePickupTimer || 0) + dt;
          if (e.cranePickupTimer >= craneDelay) {
            window.CombatEnemies.harvestCorpseByCrane(e);
          }
        }
      }
    }

    // 2. 傀儡防御站 (BD_190)：自动修塔与原地重建瘫痪防御塔
    for (let b = 0; b < cachedBattleBases.length; b++) {
      const base = cachedBattleBases[b];
      if (!base.bld || base.bld.isParalyzed) continue;
      for (let t = 0; t < cachedTurrets.length; t++) {
        const tur = cachedTurrets[t];
        if (!tur.bld) continue;
        if (Math.hypot(tur.cx - base.cx, tur.cz - base.cz) > repairRange) continue;
        if (tur.bld.isParalyzed) {
          tur.bld.autoRebuildTimer = (tur.bld.autoRebuildTimer || 0) + dt;
          if (tur.bld.autoRebuildTimer >= (cfg.turretRebuildHoldTime || 3.0)) {
            rebuildParalyzedTurret(tur, false);
          }
        } else if (tur.bld.hp < tur.bld.maxHp) {
          tur.bld.hp = Math.min(tur.bld.maxHp, tur.bld.hp + 25 * dt);
        }
      }
    }

    const range = cfg.turretRange || 30;
    const rangeSq = range * range;
    const interval = cfg.turretFireInterval || 1.05;

    // 3. 箭塔索敌与开火（仅最近存活敌人；瘫痪或无弹药不开火）
    for (let i = 0; i < cachedTurrets.length; i++) {
      const o = cachedTurrets[i];
      const bld = o.bld;
      if (!bld || bld.isParalyzed) continue;

      // 若 25 格内有千纸鹤赋能台且缺弹，自动空投补弹
      if (bld.ammoCount <= 5 && cachedCranes.length > 0) {
        const hasCraneNear = cachedCranes.some((cr) => Math.hypot(o.cx - cr.cx, o.cz - cr.cz) <= craneRange);
        if (hasCraneNear) {
          const added = pullAmmoFromInventory(o.type, 10);
          if (added > 0) {
            bld.ammoCount += added;
            bld.lowAmmo = false;
          }
        }
      }

      if (requireAmmo && bld.ammoCount <= 0) {
        bld.lowAmmo = true;
        continue;
      }
      bld.lowAmmo = false;

      const rem = (turretCooldowns.get(o.id) || 0) - dt;
      if (rem > 0) {
        turretCooldowns.set(o.id, rem);
        continue;
      }

      let nearest = null;
      let nearestDistSq = rangeSq;
      const ty = o.maxY + 0.5;

      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        if (e.state === 'dead') continue;
        const dx = e.pos.x - o.cx;
        const dy = 1.0 - ty;
        const dz = e.pos.z - o.cz;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq < nearestDistSq) {
          nearestDistSq = dSq;
          nearest = e;
        }
      }

      if (nearest) {
        if (requireAmmo) bld.ammoCount = Math.max(0, bld.ammoCount - 1);
        turretCooldowns.set(o.id, interval);
        const turretOrigin = new THREE.Vector3(o.cx, ty, o.cz);
        const aimPos = new THREE.Vector3(nearest.pos.x, nearest.pos.y + 1.15, nearest.pos.z);
        const dir = aimPos.sub(turretOrigin).normalize();
        window.CombatHandsVFX.spawnProjectile({
          owner: 'turret',
          kind: 'turret_sword',
          element: 'metal',
          origin: turretOrigin,
          dir,
          speed: 38,
          dmg: cfg.turretDamage || 24,
          shieldMult: cfg.turretShieldMult || 1.35,
          maxDist: range + 6
        });
        if (window.CombatAudio) window.CombatAudio.play('turret_fire');
      }
    }
  }

  function getTurretStatusList() {
    ensureObstacleCache();
    return cachedTurrets.map((o) => ({
      id: o.id,
      name: o.name,
      hp: o.bld ? Math.round(o.bld.hp) : 0,
      maxHp: o.bld ? o.bld.maxHp : 600,
      isParalyzed: !!(o.bld && o.bld.isParalyzed),
      ammoCount: o.bld ? o.bld.ammoCount : 0,
      lowAmmo: !!(o.bld && o.bld.lowAmmo)
    }));
  }

  function resetAll() {
    activeMeleeHolders.clear();
    activeRangedHolders.clear();
    turretCooldowns.clear();
  }

  window.CombatAIDirector = {
    requestToken,
    releaseToken,
    getTokenSummary,
    getOffscreenInfo,
    getFactoryObstacles,
    isPointBlockedByObstacles,
    queryRingPosition,
    queryStrafePoint,
    selectTarget,
    damageBuilding,
    rebuildParalyzedTurret,
    findNearestParalyzedTurret,
    getTurretStatusList,
    updateDefenseTurrets,
    resetAll
  };
})();
