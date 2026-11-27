// ============================================================================
// js/combat/combat_enemies.js - 敌方 3D 实体、分境界行为树 FSM 与尸体装箱系统
// 支持：练气修士 / 筑基修士(六边形护体+红圈AOE) / 金丹首领(三阶段悬浮) / 煞气狂傀
// ============================================================================

(function () {
  let enemyGroup = null;
  let aoeGroup = null;
  const enemies = [];
  const aoeZones = []; // 地面红圈预警区 [{ mesh, fillMesh, pos, radius, elapsed, duration, dmg, owner }]
  let nextEnemySeq = 1;
  let wanHunSlowArea = null; // { pos, radius, timer }
  let autoRespawnTimer = 0;
  const MAX_ARENA_ALIVE = 3;

  function ensureGroups() {
    const scene = window.World3D && window.World3D.getScene ? window.World3D.getScene() : null;
    if (!scene) return false;
    if (!enemyGroup) {
      enemyGroup = new THREE.Group();
      enemyGroup.name = 'CombatEnemiesGroup';
      scene.add(enemyGroup);
    }
    if (!aoeGroup) {
      aoeGroup = new THREE.Group();
      aoeGroup.name = 'CombatAoeGroup';
      scene.add(aoeGroup);
    }
    return true;
  }

  function setVisible(visible) {
    if (enemyGroup) enemyGroup.visible = !!visible;
    if (aoeGroup) aoeGroup.visible = !!visible;
    const layer = document.getElementById('fpCombatEnemyPlatesLayer');
    if (layer) layer.classList.toggle('hidden', !visible);
  }

  function buildEnemyMesh(type, cfg) {
    const root = new THREE.Group();
    const scale = cfg.corpseScale || 1.0;

    // 体型视觉分化：练气(青灰)、筑基(玄黑金甲+光罩)、金丹(紫金悬浮+5剑)、煞傀(暗紫四足)
    const bodyGroup = new THREE.Group();
    root.add(bodyGroup);

    if (type === 'beast') {
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.55, 1.35),
        new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.5, metalness: 0.4, emissive: 0x7e22ce, emissiveIntensity: 0.45 })
      );
      torso.position.y = 0.55;
      torso.castShadow = true;
      bodyGroup.add(torso);
      const head = new THREE.Mesh(
        new THREE.ConeGeometry(0.32, 0.55, 5),
        new THREE.MeshStandardMaterial({ color: 0x581c87, emissive: 0xf43f5e, emissiveIntensity: 0.6 })
      );
      head.rotation.x = Math.PI / 2;
      head.position.set(0, 0.65, 0.85);
      bodyGroup.add(head);
    } else {
      const robeColor = type === 'qi' ? 0x475569 : (type === 'foundation' ? 0x111827 : 0x3b0764);
      const trimColor = type === 'qi' ? 0x38bdf8 : (type === 'foundation' ? 0xf59e0b : 0xfde047);

      // 躯干道袍
      const robe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32 * scale, 0.46 * scale, 1.32 * scale, 8),
        new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.55, metalness: 0.25 })
      );
      robe.position.y = 0.72 * scale;
      robe.castShadow = true;
      bodyGroup.add(robe);

      // 肩甲/领口金纹
      const shoulder = new THREE.Mesh(
        new THREE.BoxGeometry(0.95 * scale, 0.20 * scale, 0.48 * scale),
        new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.35, metalness: 0.75, emissive: trimColor, emissiveIntensity: 0.2 })
      );
      shoulder.position.y = 1.34 * scale;
      bodyGroup.add(shoulder);

      // 头部 + 斗笠/道冠特征
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.24 * scale, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4, metalness: 0.4 })
      );
      head.position.y = 1.64 * scale;
      head.castShadow = true;
      bodyGroup.add(head);

      const eyeBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.30 * scale, 0.07 * scale, 0.12 * scale),
        new THREE.MeshBasicMaterial({ color: type === 'qi' ? 0x38bdf8 : (type === 'foundation' ? 0xfbbf24 : 0xf43f5e) })
      );
      eyeBar.position.set(0, 1.66 * scale, 0.20 * scale);
      bodyGroup.add(eyeBar);

      // 手持/悬浮飞剑标识
      const sword = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.95 * scale, 0.14),
        new THREE.MeshBasicMaterial({ color: trimColor })
      );
      sword.position.set(0.55 * scale, 1.15 * scale, 0.25 * scale);
      sword.rotation.x = 0.4;
      bodyGroup.add(sword);
    }

    // 筑基/金丹 护体罡气六边形罩
    let shieldDome = null;
    if (cfg.maxShield > 0) {
      shieldDome = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.15 * scale, 1),
        new THREE.MeshBasicMaterial({
          color: type === 'jindan' ? 0xa855f7 : 0xfbbf24,
          wireframe: true,
          transparent: true,
          opacity: 0.48
        })
      );
      shieldDome.position.y = 1.05 * scale;
      root.add(shieldDome);
    }

    // 幽灵线标志性【丹田暴露灵核】 (仅在露核态出现)
    const coreMesh = new THREE.Group();
    const coreGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32 * scale, 0),
      new THREE.MeshBasicMaterial({ color: 0xfde047 })
    );
    const coreWire = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.45 * scale, 0),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
    );
    coreMesh.add(coreGem);
    coreMesh.add(coreWire);
    coreMesh.position.set(0, 1.08 * scale, 0.35);
    coreMesh.visible = false;
    root.add(coreMesh);

    // 前摇预警闪烁晶核 (头顶)
    const windupStar = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18, 0),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.9 })
    );
    windupStar.position.y = 2.15 * scale;
    windupStar.visible = false;
    root.add(windupStar);

    // 尸体回收光环 (死亡后激活)
    const corpseRing = new THREE.Mesh(
      new THREE.RingGeometry(0.75, 1.05, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    corpseRing.rotation.x = -Math.PI / 2;
    corpseRing.position.y = 0.06;
    corpseRing.visible = false;
    root.add(corpseRing);

    // 定身符紫金禁锢环
    const stunRing = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.15, 6),
      new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    stunRing.rotation.x = -Math.PI / 2;
    stunRing.position.y = 0.09;
    stunRing.visible = false;
    root.add(stunRing);

    return { root, bodyGroup, shieldDome, coreMesh, windupStar, corpseRing, stunRing };
  }

  function spawnEnemy(type = 'qi', x = 0, z = 48, aiMode = 'patrol') {
    if (!ensureGroups()) return null;
    const cfgAll = (window.CombatConfig && window.CombatConfig.enemies) || {};
    const cfg = cfgAll[type] || cfgAll.qi;
    if (!cfg) return null;

    const visuals = buildEnemyMesh(type, cfg);
    visuals.root.position.set(x, type === 'jindan' ? (cfg.hoverHeight || 1.6) : 0, z);
    enemyGroup.add(visuals.root);

    const enemy = {
      id: `enemy_${nextEnemySeq++}`,
      type,
      cfg,
      aiMode, // 'patrol' | 'siege'
      name: cfg.name,
      realmBadge: cfg.realmBadge,
      pos: new THREE.Vector3(x, 0, z),
      homePos: new THREE.Vector3(x, 0, z),
      yaw: Math.PI, // 默认朝北面向基地/玩家
      hp: cfg.maxHp,
      maxHp: cfg.maxHp,
      shield: cfg.maxShield || 0,
      maxShield: cfg.maxShield || 0,
      shieldBreakTimer: 0,
      state: 'idle', // idle | alert | chase | strafe | windup | recover | stagger | coreExposed | stunned | dead
      stateLabel: '待机巡逻',
      stateTimer: 0,
      hitStaggerCount: 0,
      hyperArmorTimer: 0,
      attackKind: null, // 'melee' | 'ranged' | 'aoe'
      attackSubType: null,
      attackCooldowns: {},
      pendingAoePos: null,
      hasTokenKind: null,
      strafeDir: Math.random() > 0.5 ? 1 : -1,
      strafeSeed: Math.random() * Math.PI * 2,
      damageFromPlayer: 0,
      slowTimer: 0,
      burnTimer: 0,
      burnDps: 0,
      stunTimer: 0,
      corpseBoxed: false,
      corpseFreshness: 100,
      corpseDecayTimer: 300,
      phase: 1, // 金丹多阶段
      visuals,
      plateEl: null
    };

    enemies.push(enemy);
    return enemy;
  }

  function spawnPresetSquad(waveType = 'welcome') {
    // 所有战斗刷怪集中于出生点正前方【镇魔演武试炼场】(wx: 0, wz: 64)，常驻 3 怪上限
    if (waveType === 'welcome') {
      spawnEnemy('qi', -6, 60, 'patrol');
      spawnEnemy('qi', 6, 60, 'patrol');
      spawnEnemy('foundation', 0, 68, 'patrol');
    } else if (waveType === 'qi_pack') {
      for (let i = 0; i < 3; i++) {
        spawnEnemy('qi', -7 + i * 7, 60 + (i % 2) * 6, 'patrol');
      }
    } else if (waveType === 'foundation_duo') {
      spawnEnemy('foundation', -5, 62, 'patrol');
      spawnEnemy('foundation', 5, 62, 'patrol');
      spawnEnemy('qi', 0, 68, 'patrol');
    } else if (waveType === 'jindan_boss') {
      spawnEnemy('jindan', 0, 66, 'patrol');
      spawnEnemy('qi', -6, 60, 'patrol');
      spawnEnemy('qi', 6, 60, 'patrol');
    } else if (waveType === 'siege_wave') {
      spawnEnemy('beast', -6, 60, 'siege');
      spawnEnemy('qi', 0, 66, 'siege');
      spawnEnemy('foundation', 6, 62, 'siege');
    }
  }

  function clearAllEnemies() {
    if (enemyGroup) {
      while (enemyGroup.children.length > 0) enemyGroup.remove(enemyGroup.children[0]);
    }
    if (aoeGroup) {
      while (aoeGroup.children.length > 0) aoeGroup.remove(aoeGroup.children[0]);
    }
    enemies.length = 0;
    aoeZones.length = 0;
    const layer = document.getElementById('fpCombatEnemyPlatesLayer');
    if (layer) layer.innerHTML = '';
    if (window.CombatAIDirector) window.CombatAIDirector.resetAll();
  }

  function spawnAoeTelegraph(pos, radius, duration, dmg, owner) {
    if (!ensureGroups()) return;
    const group = new THREE.Group();
    group.position.set(pos.x, 0.09, pos.z);

    const outer = new THREE.Mesh(
      new THREE.RingGeometry(radius - 0.18, radius, 36),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    outer.rotation.x = -Math.PI / 2;

    const fill = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 36),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0.25 })
    );
    fill.rotation.x = -Math.PI / 2;
    fill.scale.set(0.01, 0.01, 0.01);

    group.add(outer);
    group.add(fill);
    aoeGroup.add(group);

    aoeZones.push({
      mesh: group,
      fillMesh: fill,
      pos: pos.clone(),
      radius,
      elapsed: 0,
      duration,
      dmg,
      owner
    });
    if (window.CombatAudio) window.CombatAudio.play('enemy_aoe_warn');
  }

  // --------------------------------------------------------------------------
  // 受击、破盾与露核逻辑
  // --------------------------------------------------------------------------
  function damageEnemy(enemy, rawDmg, opts = {}) {
    if (!enemy || enemy.state === 'dead') return { hit: false };
    const shieldMult = opts.shieldMult || 1.0;
    const isFromPlayer = opts.fromPlayer !== false;
    if (isFromPlayer) enemy.damageFromPlayer += rawDmg;

    if (opts.slowDuration) {
      enemy.slowTimer = Math.max(enemy.slowTimer, opts.slowDuration);
    }
    if (opts.burnDps && opts.burnDuration) {
      enemy.burnTimer = Math.max(enemy.burnTimer, opts.burnDuration);
      enemy.burnDps = opts.burnDps;
    }

    // 1. 优先结算护体罡气盾
    if (enemy.shield > 0) {
      const shieldDmg = rawDmg * shieldMult;
      enemy.shield -= shieldDmg;
      if (enemy.shield > 0) {
        if (window.CombatAudio) window.CombatAudio.play('hit_shield');
        if (window.CombatHandsVFX) {
          window.CombatHandsVFX.spawnRingBurst(
            enemy.pos.clone().add(new THREE.Vector3(0, 1.1, 0)),
            0xfbbf24,
            1.6,
            0.22,
            false
          );
        }
        return { hit: true, hitShield: true, brokeShield: false, killed: false };
      }

      // 护体破碎瞬间！强制打入 3.8s 露核失衡态
      const overflow = Math.abs(enemy.shield) * 0.4;
      enemy.shield = 0;
      enemy.shieldBreakTimer = enemy.cfg.shieldRegenDelay || 10.0;
      enemy.hp = Math.max(1, enemy.hp - overflow);
      enterCoreExposed(enemy, 3.8, '破盾露核');
      if (window.CombatAudio) window.CombatAudio.play('shield_break');
      if (window.CombatHandsVFX) {
        window.CombatHandsVFX.spawnRingBurst(
          enemy.pos.clone().add(new THREE.Vector3(0, 1.1, 0)),
          0xfde047,
          4.2,
          0.42,
          false
        );
      }
      if (window.CombatMain) window.CombatMain.triggerHitstop(0.035);
      return { hit: true, hitShield: true, brokeShield: true, killed: false };
    }

    // 2. 肉身 HP 结算
    const mult = enemy.state === 'coreExposed' ? 1.5 : (opts.critMult || 1.0);
    const finalDmg = rawDmg * mult;
    enemy.hp -= finalDmg;
    if (window.CombatAudio) window.CombatAudio.play('hit_flesh');

    if (enemy.hp <= 0) {
      killEnemy(enemy, opts.killMethod || 'normal');
      return { hit: true, hitShield: false, killed: true };
    }

    // 检查血量跌破露核阈值 (练气/煞傀)
    const coreRatio = enemy.cfg.coreThresholdRatio || 0;
    if (coreRatio > 0 && enemy.hp / enemy.maxHp <= coreRatio && enemy.state !== 'coreExposed' && enemy.state !== 'stunned') {
      enterCoreExposed(enemy, 4.2, '残血露核');
      return { hit: true, hitShield: false, coreExposed: true, killed: false };
    }

    // 硬直与【连续受击 3 次触发霸体后跳】(严格对齐策划案)
    if (enemy.hyperArmorTimer <= 0 && enemy.state !== 'coreExposed' && enemy.state !== 'stunned' && enemy.state !== 'windup') {
      enemy.hitStaggerCount += 1;
      if (enemy.cfg.staggerLimitForArmor && enemy.hitStaggerCount >= enemy.cfg.staggerLimitForArmor) {
        enemy.hitStaggerCount = 0;
        enemy.hyperArmorTimer = 1.8;
        enemy.state = 'recover';
        enemy.stateLabel = '霸体后跳撤离';
        enemy.stateTimer = 0.45;
        // 向后跃步 3.2m
        if (window.CombatPlayer) {
          const pPos = window.CombatPlayer.getState().pos;
          const away = enemy.pos.clone().sub(pPos).setY(0).normalize();
          enemy.pos.addScaledVector(away, 3.0);
        }
      } else {
        if (window.CombatAIDirector) window.CombatAIDirector.releaseToken(enemy);
        enemy.state = 'stagger';
        enemy.stateLabel = '受击硬直';
        enemy.stateTimer = 0.30;
      }
    }

    return { hit: true, hitShield: false, killed: false };
  }

  function enterCoreExposed(enemy, duration = 4.0, label = '露核可拔 [F]') {
    if (!enemy || enemy.state === 'dead') return;
    if (window.CombatAIDirector) window.CombatAIDirector.releaseToken(enemy);
    enemy.state = 'coreExposed';
    enemy.stateLabel = label;
    enemy.stateTimer = duration;
    enemy.visuals.windupStar.visible = false;
    enemy.visuals.coreMesh.visible = true;
    if (enemy.visuals.shieldDome) enemy.visuals.shieldDome.visible = false;
  }

  function applyStun(enemy, duration) {
    if (!enemy || enemy.state === 'dead') return;
    if (window.CombatAIDirector) window.CombatAIDirector.releaseToken(enemy);
    enemy.state = 'stunned';
    enemy.stateLabel = '定身禁锢';
    enemy.stunTimer = Math.max(enemy.stunTimer, duration);
    enemy.visuals.windupStar.visible = false;
    enemy.visuals.stunRing.visible = true;
  }

  function killEnemy(enemy, method = 'normal') {
    if (!enemy || enemy.state === 'dead') return;
    if (window.CombatAIDirector) window.CombatAIDirector.releaseToken(enemy);
    enemy.hp = 0;
    enemy.shield = 0;
    enemy.state = 'dead';
    enemy.visuals.windupStar.visible = false;
    enemy.visuals.coreMesh.visible = false;
    enemy.visuals.stunRing.visible = false;
    if (enemy.visuals.shieldDome) enemy.visuals.shieldDome.visible = false;

    // 尸体倒地动作 (ACT_068 / ACT_069)
    enemy.visuals.bodyGroup.rotation.x = Math.PI / 2;
    enemy.visuals.bodyGroup.position.y = 0.32;
    enemy.visuals.root.position.y = 0;

    if (method === 'turret') {
      // 箭塔只负责击杀：尸体留在原地（65% 鲜活度），由千纸鹤(BD_198) 25格内自动捡回或玩家长按 E 装箱
      enemy.corpseBoxed = false;
      enemy.corpseFreshness = 65;
      enemy.cranePickupTimer = 0;
      enemy.corpseDecayTimer = 300;
      enemy.stateLabel = '塔杀留尸 (65%) · 待千纸鹤/长按E';
      enemy.visuals.corpseRing.visible = true;
      return;
    }

    if (method === 'core_grab') {
      enemy.corpseFreshness = 100;
      const autoBox = window.CombatConfig && window.CombatConfig.decisions && window.CombatConfig.decisions.DEC_06_grabInvulnAutoBox;
      if (autoBox) {
        enemy.corpseBoxed = true;
        enemy.stateLabel = '拔核直收入箱 (100%)';
        grantCorpseToInventory(enemy, '【抽魂拔丹】100%无暇尸体已直收入库');
        enemy.visuals.corpseRing.visible = false;
        setTimeout(() => { if (enemy.visuals && enemy.visuals.root) enemy.visuals.root.visible = false; }, 900);
        return;
      }
    } else {
      enemy.corpseFreshness = 75;
    }

    enemy.corpseDecayTimer = method === 'core_grab' ? 480 : 300;
    enemy.stateLabel = `可装箱 [长按E] (${enemy.corpseFreshness}%)`;
    enemy.visuals.corpseRing.visible = true;
  }

  function grantCorpseToInventory(enemy, prefixText) {
    const itemId = enemy.cfg.dropItemId || 'MAT_020';
    let itemName = enemy.cfg.dropName || '练气修士尸体';
    if (typeof playerInventory !== 'undefined') {
      playerInventory[itemId] = (playerInventory[itemId] || 0) + 1;
      if (enemy.type === 'jindan' && enemy.cfg.extraDropId) {
        playerInventory[enemy.cfg.extraDropId] = (playerInventory[enemy.cfg.extraDropId] || 0) + 1;
        itemName += ' + 金丹碎片×1';
      }
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      if (typeof syncBackpackFromPlayerInventory === 'function') syncBackpackFromPlayerInventory();
    }
    if (window.CombatAudio) window.CombatAudio.play('corpse_box');
    if (typeof showNotification === 'function') {
      showNotification(`${prefixText}: ${itemName} (+1 已进背包)`);
    }
  }

  function boxCorpse(enemy) {
    if (!enemy || enemy.state !== 'dead' || enemy.corpseBoxed) return false;
    enemy.corpseBoxed = true;
    enemy.visuals.corpseRing.visible = false;
    enemy.visuals.root.visible = false;
    enemy.stateLabel = '已装箱入库';
    grantCorpseToInventory(enemy, '【尸体装箱】');
    return true;
  }

  function harvestCorpseByCrane(enemy) {
    if (!enemy || enemy.state !== 'dead' || enemy.corpseBoxed) return false;
    enemy.corpseBoxed = true;
    enemy.visuals.corpseRing.visible = false;
    enemy.visuals.root.visible = false;
    enemy.stateLabel = '千纸鹤已收尸入箱';
    grantCorpseToInventory(enemy, '🕊️【千纸鹤自动收尸】');
    return true;
  }

  // --------------------------------------------------------------------------
  // 主 AI 循环更新 (BT + EQS + Combat Director + AOE 结算)
  // --------------------------------------------------------------------------
  function updateEnemies(dt, nowSec) {
    const playerState = window.CombatPlayer ? window.CombatPlayer.getState() : null;
    if (!playerState) return;
    const playerPos = playerState.pos;
    const playerYaw = playerState.yaw;

    const obstacles = window.CombatAIDirector ? window.CombatAIDirector.getFactoryObstacles() : [];
    const cfg = window.CombatConfig || {};

    // 常驻 3 怪自动补刷机制（最大存活 3 只），确保出生点试炼场随时可测战斗与收尸循环
    let aliveCount = 0;
    let hasFoundation = false;
    let hiddenDeadCount = 0;
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].state !== 'dead') {
        aliveCount++;
        if (enemies[i].type === 'foundation') hasFoundation = true;
      } else if (enemies[i].visuals && enemies[i].visuals.root && !enemies[i].visuals.root.visible) {
        hiddenDeadCount++;
      }
    }
    if (hiddenDeadCount > 6) {
      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].state === 'dead' && enemies[i].visuals && enemies[i].visuals.root && !enemies[i].visuals.root.visible) {
          if (enemyGroup) enemyGroup.remove(enemies[i].visuals.root);
          enemies.splice(i, 1);
          break;
        }
      }
    }
    if (aliveCount < MAX_ARENA_ALIVE) {
      autoRespawnTimer += dt;
      if (autoRespawnTimer >= 1.2) {
        autoRespawnTimer = 0;
        const rx = (Math.random() - 0.5) * 14;
        const rz = 58 + Math.random() * 12;
        spawnEnemy(hasFoundation ? 'qi' : 'foundation', rx, rz, 'patrol');
      }
    } else {
      autoRespawnTimer = 0;
    }

    // 更新万魂镇域范围减速阵
    if (wanHunSlowArea) {
      wanHunSlowArea.timer -= dt;
      if (wanHunSlowArea.timer <= 0) wanHunSlowArea = null;
    }

    // 1. 驱动真实 bd_160 飞剑防御塔协同开火
    if (window.CombatAIDirector) {
      window.CombatAIDirector.updateDefenseTurrets(dt, enemies, obstacles);
    }

    // 2. 更新筑基/金丹地面红圈 AOE 预警并结算爆炸
    for (let i = aoeZones.length - 1; i >= 0; i--) {
      const z = aoeZones[i];
      z.elapsed += dt;
      const prog = Math.min(1, z.elapsed / z.duration);
      z.fillMesh.scale.set(prog, prog, prog);
      if (prog >= 1) {
        if (aoeGroup) aoeGroup.remove(z.mesh);
        aoeZones.splice(i, 1);
        if (window.CombatAudio) window.CombatAudio.play('enemy_aoe_boom');
        if (window.CombatHandsVFX) window.CombatHandsVFX.spawnRingBurst(z.pos, 0xf43f5e, z.radius * 1.4, 0.38, true);

        const dToPlayer = Math.hypot(playerPos.x - z.pos.x, playerPos.z - z.pos.z);
        if (dToPlayer <= z.radius && window.CombatPlayer) {
          window.CombatPlayer.takeDamage(z.dmg, z.pos, true, null);
        }
      }
    }

    // 3. 逐个更新敌方 AI 行为树状态
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];

      // 死亡尸体倒计时 (DEC_07)
      if (e.state === 'dead') {
        if (!e.corpseBoxed && cfg.decisions && cfg.decisions.DEC_07_corpseDecay) {
          e.corpseDecayTimer = Math.max(0, e.corpseDecayTimer - dt);
          e.corpseFreshness = Math.max(20, Math.round((e.corpseDecayTimer / 300) * 75));
          e.stateLabel = `可装箱 [长按E] (${e.corpseFreshness}%)`;
        }
        continue;
      }

      // 灼烧与减益更新
      if (e.hyperArmorTimer > 0) e.hyperArmorTimer = Math.max(0, e.hyperArmorTimer - dt);
      if (e.slowTimer > 0) e.slowTimer = Math.max(0, e.slowTimer - dt);
      if (e.burnTimer > 0) {
        e.burnTimer = Math.max(0, e.burnTimer - dt);
        e.hp -= e.burnDps * dt;
        if (e.hp <= 0) { killEnemy(e, 'normal'); continue; }
      }
      Object.keys(e.attackCooldowns).forEach((k) => {
        if (e.attackCooldowns[k] > 0) e.attackCooldowns[k] = Math.max(0, e.attackCooldowns[k] - dt);
      });

      // 筑基/金丹护盾再生计时
      if (e.maxShield > 0 && e.shield <= 0 && e.state !== 'coreExposed') {
        e.shieldBreakTimer -= dt;
        if (e.shieldBreakTimer <= 0) {
          e.shield = e.cfg.shieldRegenAmount || e.maxShield * 0.65;
          if (e.visuals.shieldDome) e.visuals.shieldDome.visible = true;
          if (window.CombatHandsVFX) window.CombatHandsVFX.spawnRingBurst(e.pos.clone().add(new THREE.Vector3(0, 1, 0)), 0xfbbf24, 2.2, 0.35, false);
        }
      }

      // 金丹 Boss 多阶段判断
      if (e.type === 'jindan') {
        const r = e.hp / e.maxHp;
        if (r < 0.35 && e.phase < 3) {
          e.phase = 3;
          e.stateLabel = '三阶燃丹狂暴！';
          if (typeof showNotification === 'function') showNotification('【金丹首领】进入三阶段燃丹狂暴！');
        } else if (r < 0.70 && e.phase < 2) {
          e.phase = 2;
          spawnEnemy('qi', e.pos.x - 4, e.pos.z - 2, 'patrol');
          spawnEnemy('qi', e.pos.x + 4, e.pos.z - 2, 'patrol');
        }
      }

      // 速度减益 (万魂镇域 -40% / 玄水减速 -35%)
      let speedMult = e.slowTimer > 0 ? 0.65 : 1.0;
      let windupMult = 1.0;
      if (wanHunSlowArea && e.pos.distanceTo(wanHunSlowArea.pos) <= wanHunSlowArea.radius) {
        speedMult *= 0.60;
        windupMult = 1.25;
      }

      // 视觉杂项动画
      if (e.visuals.coreMesh.visible) {
        e.visuals.coreMesh.rotation.y += dt * 4.5;
        e.visuals.coreMesh.rotation.x += dt * 2.5;
      }
      if (e.visuals.shieldDome && e.shield > 0) {
        e.visuals.shieldDome.visible = true;
        e.visuals.shieldDome.rotation.y += dt * 0.8;
      }

      // 优先受控状态：定身 / 露核 / 受击硬直 / 破绽恢复
      if (e.state === 'stunned') {
        e.stunTimer -= dt;
        e.visuals.stunRing.rotation.z += dt * 2.0;
        if (e.stunTimer <= 0) {
          e.visuals.stunRing.visible = false;
          e.state = 'chase';
          e.stateLabel = '解除定身';
        }
        continue;
      }

      if (e.state === 'coreExposed') {
        e.stateTimer -= dt;
        if (e.stateTimer <= 0) {
          e.visuals.coreMesh.visible = false;
          e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.25);
          if (e.maxShield > 0) {
            e.shield = e.cfg.shieldRegenAmount || e.maxShield * 0.5;
            if (e.visuals.shieldDome) e.visuals.shieldDome.visible = true;
          }
          e.state = 'chase';
          e.stateLabel = '重聚恢复';
        }
        continue;
      }

      if (e.state === 'stagger' || e.state === 'recover') {
        e.stateTimer -= dt;
        if (e.stateTimer <= 0) {
          if (window.CombatAIDirector) window.CombatAIDirector.releaseToken(e);
          e.state = 'chase';
          e.stateLabel = '重整架势';
        }
        continue;
      }

      // 试炼区结界约束：仅当玩家踏入出生点旁试炼场 (0, 64) 半径 28m 内时才激活接战，退回主厂区则怪物在场内巡游待命
      const inArena = Math.hypot(playerPos.x, playerPos.z - 64) <= 28;
      if (!inArena && e.damageFromPlayer <= 0) {
        e.state = 'idle';
        e.stateLabel = '试炼区待命';
        const patAng = nowSec * 0.45 + e.strafeSeed;
        const tx = Math.cos(patAng) * 9;
        const tz = 64 + Math.sin(patAng) * 9;
        const dx = tx - e.pos.x;
        const dz = tz - e.pos.z;
        const d = Math.hypot(dx, dz);
        if (d > 0.4) {
          e.pos.x += (dx / d) * 3.0 * dt;
          e.pos.z += (dz / d) * 3.0 * dt;
          if (e.visuals && e.visuals.root) {
            e.visuals.root.position.x = e.pos.x;
            e.visuals.root.position.z = e.pos.z;
            e.visuals.root.rotation.y = Math.atan2(dx, dz);
          }
        }
        continue;
      }

      // 目标感知与仇恨选取
      const distToPlayer = e.pos.distanceTo(playerPos);
      if (e.state === 'idle') {
        if (distToPlayer <= e.cfg.sightRange || e.aiMode === 'siege' || e.damageFromPlayer > 0) {
          e.state = 'alert';
          e.stateLabel = '警觉锁定';
          e.stateTimer = 0.42;
          if (window.CombatAudio) {
            window.CombatAudio.play(e.type === 'qi' ? 'enemy_alert_qi' : (e.type === 'foundation' ? 'enemy_alert_found' : 'enemy_alert_jindan'));
          }
        }
        continue;
      }

      if (e.state === 'alert') {
        e.stateTimer -= dt;
        faceTarget(e, playerPos, dt);
        if (e.stateTimer <= 0) {
          e.state = 'chase';
          e.stateLabel = '追击接敌';
        }
        continue;
      }

      const targetInfo = window.CombatAIDirector
        ? window.CombatAIDirector.selectTarget(e, playerPos, obstacles)
        : { category: 'player', pos: playerPos.clone() };
      const tgtPos = targetInfo.pos;
      const distToTarget = e.pos.distanceTo(tgtPos);

      // 攻击前摇与释放阶段
      if (e.state === 'windup') {
        faceTarget(e, tgtPos, dt);
        e.stateTimer -= dt;
        e.visuals.windupStar.visible = true;
        const pulse = 0.8 + Math.sin(nowSec * 28) * 0.35;
        e.visuals.windupStar.scale.set(pulse, pulse, pulse);

        if (e.stateTimer <= 0) {
          e.visuals.windupStar.visible = false;
          executeEnemyAttack(e, targetInfo);
        }
        continue;
      }

      // 行为树决策：检查是否到达可用招式射程 + 向 Director 申请 Attack Token
      faceTarget(e, tgtPos, dt);

      const chosen = pickEnemyAttack(e, distToTarget, targetInfo);
      if (chosen) {
        const tokenOk = window.CombatAIDirector
          ? window.CombatAIDirector.requestToken(e, chosen.tokenKind, chosen.windup + chosen.recover + 0.4, nowSec)
          : true;

        if (tokenOk) {
          const offInfo = window.CombatAIDirector
            ? window.CombatAIDirector.getOffscreenInfo(e.pos, playerPos, playerYaw)
            : { isOffscreen: false };
          const extraWindup = offInfo.isOffscreen ? ((cfg.aiDirector && cfg.aiDirector.offscreenExtraWindup) || 0.4) : 0;
          if (offInfo.isOffscreen && window.CombatAudio) window.CombatAudio.play('offscreen_warn');

          e.state = 'windup';
          e.attackKind = chosen.tokenKind;
          e.attackSubType = chosen.subType;
          e.stateTimer = (chosen.windup * windupMult) + extraWindup;
          e.stateLabel = chosen.label;

          if (chosen.subType === 'aoeRing' || chosen.subType === 'thunderGrid') {
            e.pendingAoePos = tgtPos.clone();
            e.pendingAoePos.y = 0;
            spawnAoeTelegraph(e.pendingAoePos, chosen.radius || 3.5, e.stateTimer, chosen.dmg, e);
          }
          continue;
        }
      }

      // 若在最佳交战距内但无 Token（或技能全 CD）：执行 EQS 侧移走位 ACT_054/055！
      if (distToTarget <= e.cfg.preferredMax && distToTarget >= e.cfg.preferredMin * 0.75) {
        e.state = 'strafe';
        e.stateLabel = '战术侧移·等令牌';
        const strafePt = window.CombatAIDirector
          ? window.CombatAIDirector.queryStrafePoint(e, tgtPos, e.strafeDir, obstacles)
          : null;
        if (strafePt) {
          moveToward(e, strafePt, e.cfg.strafeSpeed * speedMult, dt, obstacles);
        } else {
          e.strafeDir *= -1;
        }
      } else {
        e.state = 'chase';
        e.stateLabel = targetInfo.blockingObstacle ? '路径受阻·强拆' : '追击压迫';
        const dest = (distToTarget < e.cfg.preferredMin)
          ? (window.CombatAIDirector ? window.CombatAIDirector.queryRingPosition(e, tgtPos, e.cfg.preferredMin, e.cfg.preferredMax, enemies, obstacles, playerPos, playerYaw) : tgtPos)
          : tgtPos;
        moveToward(e, dest, e.cfg.chaseSpeed * speedMult, dt, obstacles);
      }
    }
  }

  function faceTarget(e, tgtPos, dt) {
    const desired = Math.atan2(tgtPos.x - e.pos.x, tgtPos.z - e.pos.z);
    let diff = desired - e.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    e.yaw += diff * Math.min(1, dt * 8.5);
    e.visuals.root.rotation.y = e.yaw;
  }

  function moveToward(e, dest, speed, dt, obstacles) {
    const dx = dest.x - e.pos.x;
    const dz = dest.z - e.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.25) return;
    const nx = e.pos.x + (dx / d) * speed * dt;
    const nz = e.pos.z + (dz / d) * speed * dt;
    const blocked = window.CombatAIDirector
      ? window.CombatAIDirector.isPointBlockedByObstacles(nx, nz, obstacles, 0.55)
      : null;
    if (!blocked) {
      e.pos.x = Math.max(-75, Math.min(75, nx));
      e.pos.z = Math.max(-75, Math.min(75, nz));
      e.visuals.root.position.x = e.pos.x;
      e.visuals.root.position.z = e.pos.z;
    } else {
      // 沿切线绕开障碍物
      const altX = e.pos.x + (-dz / d) * e.strafeDir * speed * 0.7 * dt;
      const altZ = e.pos.z + (dx / d) * e.strafeDir * speed * 0.7 * dt;
      if (!window.CombatAIDirector.isPointBlockedByObstacles(altX, altZ, obstacles, 0.55)) {
        e.pos.x = altX;
        e.pos.z = altZ;
        e.visuals.root.position.x = e.pos.x;
        e.visuals.root.position.z = e.pos.z;
      }
    }
  }

  function pickEnemyAttack(e, dist, targetInfo) {
    const atks = e.cfg.attacks || {};
    if (e.type === 'qi') {
      if (dist <= atks.palm.range && !(e.attackCooldowns.palm > 0)) {
        return { tokenKind: 'melee', subType: 'palm', label: '掌击前摇[可弹]', ...atks.palm };
      }
      if (dist >= atks.aura.minRange && dist <= atks.aura.maxRange && !(e.attackCooldowns.aura > 0)) {
        return { tokenKind: 'ranged', subType: 'aura', label: '剑气前摇[可弹]', ...atks.aura };
      }
    } else if (e.type === 'foundation') {
      if (dist <= atks.melee.range && !(e.attackCooldowns.melee > 0)) {
        return { tokenKind: 'melee', subType: 'melee', label: '震击前摇[可弹]', ...atks.melee };
      }
      if (dist >= atks.aoeRing.minRange && dist <= atks.aoeRing.maxRange && !(e.attackCooldowns.aoeRing > 0) && targetInfo.category === 'player') {
        return { tokenKind: 'ranged', subType: 'aoeRing', label: '红圈符阵[快躲]', ...atks.aoeRing };
      }
      if (dist >= atks.tripleAura.minRange && dist <= atks.tripleAura.maxRange && !(e.attackCooldowns.tripleAura > 0)) {
        return { tokenKind: 'ranged', subType: 'tripleAura', label: '三连剑气前摇', ...atks.tripleAura };
      }
    } else if (e.type === 'jindan') {
      if (dist >= atks.thunderGrid.minRange && !(e.attackCooldowns.thunderGrid > 0) && targetInfo.category === 'player') {
        return { tokenKind: 'ranged', subType: 'thunderGrid', label: '九天雷阵[快躲]', ...atks.thunderGrid };
      }
      if (dist <= atks.fanSwords.maxRange && !(e.attackCooldowns.fanSwords > 0)) {
        return { tokenKind: 'ranged', subType: 'fanSwords', label: '五剑齐发前摇', ...atks.fanSwords };
      }
    } else if (e.type === 'beast') {
      if (dist <= atks.lunge.range && !(e.attackCooldowns.lunge > 0)) {
        return { tokenKind: 'melee', subType: 'lunge', label: '扑咬前摇[可弹]', ...atks.lunge };
      }
    }
    return null;
  }

  function executeEnemyAttack(e, targetInfo) {
    const sub = e.attackSubType;
    const atk = (e.cfg.attacks && e.cfg.attacks[sub]) || {};
    e.attackCooldowns[sub] = atk.cooldown || 3.5;

    const pState = window.CombatPlayer ? window.CombatPlayer.getState() : null;
    if (!pState) return;
    const pPos = pState.pos;

    if (sub === 'palm' || sub === 'melee' || sub === 'lunge') {
      // 近战向前滑步并判定命中（优先判定建筑目标或堵路建筑）
      const fwd = new THREE.Vector3(Math.sin(e.yaw), 0, Math.cos(e.yaw));
      e.pos.addScaledVector(fwd, 0.9);
      e.visuals.root.position.x = e.pos.x;
      e.visuals.root.position.z = e.pos.z;

      const hitObs = (targetInfo && targetInfo.category === 'building' && targetInfo.obstacle)
        ? targetInfo.obstacle
        : (targetInfo && targetInfo.blockingObstacle);
      if (hitObs && window.CombatAIDirector && window.CombatAIDirector.damageBuilding) {
        const dObs = Math.hypot(e.pos.x - hitObs.cx, e.pos.z - hitObs.cz);
        if (dObs <= (atk.range || 3.6) + Math.max(hitObs.hw || 1.5, hitObs.hd || 1.5) + 0.8) {
          window.CombatAIDirector.damageBuilding(hitObs, atk.dmg || 18);
          if (window.CombatAudio) window.CombatAudio.play('hit_shield');
        }
      }

      if (e.pos.distanceTo(pPos) <= (atk.range || 3.6) + 0.6) {
        const parryRes = window.CombatPlayer.takeDamage(atk.dmg || 18, e.pos, false, null, e);
        if (parryRes && parryRes.parried) {
          // 被完美弹反！近战反震令敌人立刻进入 1.6s 破绽并削盾 75
          damageEnemy(e, 20, { shieldMult: 3.8, fromPlayer: true });
          if (e.state !== 'dead' && e.state !== 'coreExposed') {
            e.state = 'recover';
            e.stateLabel = '被弹反大破绽！';
            e.stateTimer = 1.6;
          }
          return;
        }
      }
    } else if (sub === 'aura') {
      spawnEnemyAura(e, pPos, atk.dmg || 15, atk.speed || 18, 0);
    } else if (sub === 'tripleAura') {
      const count = atk.count || 3;
      const interval = (atk.interval || 0.22) * 1000;
      for (let k = 0; k < count; k++) {
        setTimeout(() => {
          if (e.state === 'dead' || e.state === 'stunned' || e.state === 'coreExposed') return;
          const livePos = window.CombatPlayer ? window.CombatPlayer.getState().pos : pPos;
          spawnEnemyAura(e, livePos, atk.dmg || 18, atk.speed || 23, (k - 1) * 0.03);
        }, k * interval);
      }
    } else if (sub === 'fanSwords') {
      const count = atk.count || 5;
      for (let k = 0; k < count; k++) {
        const spread = (k - (count - 1) / 2) * 0.14;
        spawnEnemyAura(e, pPos, atk.dmg || 22, atk.speed || 26, spread);
      }
    }

    if (e.state !== 'dead' && e.state !== 'coreExposed') {
      e.state = 'recover';
      e.stateLabel = '破绽恢复';
      e.stateTimer = atk.recover || 0.7;
    }
  }

  function spawnEnemyAura(e, targetPos, dmg, speed, yawSpread) {
    if (!window.CombatHandsVFX) return;
    const origin = e.pos.clone().add(new THREE.Vector3(0, 1.25, 0));
    const aim = targetPos.clone().add(new THREE.Vector3(0, 1.1, 0));
    const dir = aim.sub(origin).normalize();
    if (yawSpread) {
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yawSpread);
    }
    window.CombatHandsVFX.spawnProjectile({
      owner: 'enemy',
      kind: 'enemy_aura',
      origin,
      dir,
      speed,
      dmg,
      maxDist: 36,
      canParry: true,
      colorHex: e.type === 'qi' ? 0x38bdf8 : (e.type === 'foundation' ? 0xfbbf24 : 0xf43f5e),
      sourceEnemy: e
    });
  }

  function activateWanHunSlow(pos, radius, duration) {
    wanHunSlowArea = { pos: pos.clone(), radius, timer: duration };
  }

  window.CombatEnemies = {
    setVisible,
    spawnEnemy,
    spawnPresetSquad,
    clearAllEnemies,
    damageEnemy,
    enterCoreExposed,
    applyStun,
    killEnemy,
    boxCorpse,
    harvestCorpseByCrane,
    activateWanHunSlow,
    updateEnemies,
    getEnemies: () => enemies
  };
})();
