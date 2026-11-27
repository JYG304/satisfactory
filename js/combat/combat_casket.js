// ============================================================================
// js/combat/combat_casket.js - 天罡剑匣 (casketSwords) 装备式御剑与攻速倍增器
// 定位：背后装备槽（无需 1/2/3 切剑）。装备飞剑越多攻速越快，普攻自动轮发全部已装飞剑词条！
// ============================================================================

(function () {
  // 将项目内的真实武器 ID 映射为战斗词条与视觉表现
  const SWORD_ARCHETYPES = {
    sword_wood: {
      id: 'sword_wood',
      name: '青灵竹剑',
      realmTag: '木·回灵疾刺',
      effectShort: '命中+3.5灵力',
      element: 'metal',
      colorHex: 0x10b981,
      cssColor: '#10b981',
      glowCss: '#6ee7b7',
      dmg: 25,
      chargeDmg: 44,
      speed: 48,
      qiCost: 1.8,
      qiOnHit: 3.5, // 万木回春：命中回灵
      shieldMult: 0.85,
      range: 46,
      homing: 6.5,
      splashRadius: 0,
      slowDuration: 0,
      burnDps: 0,
      pierceCount: 0,
      kind: 'sword_blade'
    },
    sword_fire: {
      id: 'sword_fire',
      name: '炽阳炎剑',
      realmTag: '火·溅射破盾',
      effectShort: '爆溅射+灼烧破盾',
      element: 'fire',
      colorHex: 0xf97316,
      cssColor: '#f97316',
      glowCss: '#fde047',
      dmg: 36,
      chargeDmg: 72,
      speed: 38,
      qiCost: 4.0,
      qiOnHit: 0,
      shieldMult: 1.85, // 离火断金：超高破盾
      range: 42,
      homing: 4.0,
      splashRadius: 3.4, // 炎剑溅射
      slowDuration: 0,
      burnDps: 10,
      pierceCount: 0,
      kind: 'sword_blade'
    },
    sword_ice: {
      id: 'sword_ice',
      name: '玄冰寒魄剑',
      realmTag: '水·减速穿透',
      effectShort: '冰冻减速+穿2敌',
      element: 'water',
      colorHex: 0x06b6d4,
      cssColor: '#22d3ee',
      glowCss: '#bae6fd',
      dmg: 28,
      chargeDmg: 52,
      speed: 42,
      qiCost: 2.8,
      qiOnHit: 0,
      shieldMult: 1.10,
      range: 44,
      homing: 4.8,
      splashRadius: 0,
      slowDuration: 3.2, // 凝霜封脉减速
      burnDps: 0,
      pierceCount: 2, // 穿透两敌
      kind: 'sword_blade'
    },
    sword_thunder: {
      id: 'sword_thunder',
      name: '紫霄惊雷剑',
      realmTag: '雷·神品破甲',
      effectShort: '极速破盾2.15×',
      element: 'metal',
      colorHex: 0xeab308,
      cssColor: '#fde047',
      glowCss: '#fef08a',
      dmg: 44,
      chargeDmg: 82,
      speed: 58,
      qiCost: 3.2,
      qiOnHit: 1.5,
      shieldMult: 2.15, // 雷系高破盾
      range: 52,
      homing: 7.5,
      splashRadius: 2.2,
      slowDuration: 0,
      burnDps: 0,
      pierceCount: 1,
      kind: 'sword_blade'
    },
    sword_iron: {
      id: 'sword_iron',
      name: '寒铁飞剑',
      realmTag: '金·穿甲锋刃',
      effectShort: '破盾1.4×+穿1敌',
      element: 'metal',
      colorHex: 0x38bdf8,
      cssColor: '#38bdf8',
      glowCss: '#e0f2fe',
      dmg: 32,
      chargeDmg: 58,
      speed: 46,
      qiCost: 2.2,
      qiOnHit: 0,
      shieldMult: 1.40,
      range: 46,
      homing: 5.2,
      splashRadius: 0,
      slowDuration: 0,
      burnDps: 0,
      pierceCount: 1,
      kind: 'sword_blade'
    },
    sword_dragon: {
      id: 'sword_dragon',
      name: '斩龙巨剑',
      realmTag: '煞·重剑崩岳',
      effectShort: '重击溅射+穿2敌',
      element: 'fire',
      colorHex: 0xf43f5e,
      cssColor: '#fb7185',
      glowCss: '#fda4af',
      dmg: 52,
      chargeDmg: 96,
      speed: 35,
      qiCost: 4.5,
      qiOnHit: 0,
      shieldMult: 2.0,
      range: 42,
      homing: 3.4,
      splashRadius: 2.8,
      slowDuration: 0,
      burnDps: 0,
      pierceCount: 2,
      kind: 'sword_blade'
    }
  };

  const FALLBACK_PHANTOM = {
    id: 'phantom_basic',
    name: '凝气虚剑',
    realmTag: '气·虚剑',
    effectShort: '基础灵剑(未装实剑)',
    element: 'metal',
    colorHex: 0x38bdf8,
    cssColor: '#38bdf8',
    glowCss: '#e0f2fe',
    dmg: 18,
    chargeDmg: 34,
    speed: 40,
    qiCost: 2.0,
    qiOnHit: 0,
    shieldMult: 0.9,
    range: 40,
    homing: 4.0,
    splashRadius: 0,
    slowDuration: 0,
    burnDps: 0,
    pierceCount: 0,
    kind: 'metal_sword'
  };

  function resolveProfile(rawItem) {
    if (!rawItem) return null;
    if (SWORD_ARCHETYPES[rawItem.id]) return SWORD_ARCHETYPES[rawItem.id];
    return {
      id: rawItem.id || 'custom_sword',
      name: rawItem.name || '玄铁御剑',
      realmTag: '器·御物',
      effectShort: '标准御剑伤敌',
      element: 'metal',
      colorHex: 0x38bdf8,
      cssColor: '#38bdf8',
      glowCss: '#fde047',
      dmg: 24,
      chargeDmg: 45,
      speed: 42,
      qiCost: 2.5,
      qiOnHit: 0,
      shieldMult: 1.0,
      range: 40,
      homing: 4.2,
      splashRadius: 0,
      slowDuration: 0,
      burnDps: 0,
      pierceCount: 0,
      kind: 'sword_blade'
    };
  }

  const slots = [0, 1, 2, 3].map((idx) => ({
    slotIndex: idx,
    equipped: false,
    rawItem: null,
    profile: null,
    state: 'empty', // 'empty' | 'docked' | 'flying_out' | 'returning'
    flightTimer: 0,
    returnFlashTimer: 0
  }));

  let dispatchCursor = 0;
  let launchCounter = 0;
  let lastDispatchedSlot = 0;

  function syncFromInventory() {
    const src = (typeof casketSwords !== 'undefined' && Array.isArray(casketSwords)) ? casketSwords : [
      { id: 'sword_wood', name: '青灵竹剑' },
      { id: 'sword_fire', name: '炽阳炎剑' },
      { id: 'sword_ice', name: '玄冰寒魄剑' },
      null
    ];

    for (let i = 0; i < 4; i++) {
      const item = src[i] || null;
      const s = slots[i];
      const prevId = s.rawItem ? s.rawItem.id : null;
      const nextId = item ? item.id : null;

      if (!item) {
        s.equipped = false;
        s.rawItem = null;
        s.profile = null;
        s.state = 'empty';
        s.flightTimer = 0;
      } else if (prevId !== nextId) {
        s.equipped = true;
        s.rawItem = item;
        s.profile = resolveProfile(item);
        s.state = 'docked';
        s.flightTimer = 0;
        s.returnFlashTimer = 0.25;
      }
    }
  }

  function getEquippedCount() {
    syncFromInventory();
    let cnt = 0;
    for (let i = 0; i < 4; i++) {
      if (slots[i].equipped) cnt++;
    }
    return cnt;
  }

  function getAttackSpeedMultiplier() {
    const count = getEquippedCount();
    const table = (window.CombatConfig && window.CombatConfig.casket && window.CombatConfig.casket.speedMultByCount)
      || [0.85, 1.0, 1.35, 1.75, 2.25];
    return table[Math.max(0, Math.min(4, count))] || 1.0;
  }

  function getFireInterval() {
    const base = (window.CombatConfig && window.CombatConfig.casket && window.CombatConfig.casket.baseFireInterval) || 0.44;
    return base / Math.max(0.5, getAttackSpeedMultiplier());
  }

  function getSummary() {
    const count = getEquippedCount();
    const speedMult = getAttackSpeedMultiplier();
    const fireInterval = getFireInterval();
    return {
      equippedCount: count,
      maxSlots: 4,
      speedMult,
      fireInterval,
      fireRatePerSec: 1 / Math.max(0.05, fireInterval),
      lastDispatchedSlot,
      slots
    };
  }

  // 自动轮发：无需手动切剑，每次普攻按序从背后调遣在匣飞剑（每把自带不同词条），人快剑多则无缝接续剑气分身
  function launchNextSword() {
    syncFromInventory();
    const shoulderSide = (launchCounter++ % 2 === 0) ? -1 : 1;

    // 1. 优先从 dispatchCursor 顺次寻一把在匣待命的实体飞剑
    let dockedMatch = null;
    for (let offset = 0; offset < 4; offset++) {
      const idx = (dispatchCursor + offset) % 4;
      if (slots[idx].equipped && slots[idx].state === 'docked') {
        dockedMatch = slots[idx];
        break;
      }
    }

    if (dockedMatch) {
      dockedMatch.state = 'flying_out';
      dockedMatch.flightTimer = 0;
      dispatchCursor = (dockedMatch.slotIndex + 1) % 4;
      lastDispatchedSlot = dockedMatch.slotIndex;
      return {
        slotIndex: dockedMatch.slotIndex,
        profile: dockedMatch.profile,
        isPhantom: false,
        shoulderSide,
        tier: dockedMatch.slotIndex >= 2 ? 1 : 0
      };
    }

    // 2. 若全部在匣剑都已射出在空中，则按轮发顺序顺取一把已装飞剑化出同源剑气，保持高攻速丝滑不卡手
    let armedMatch = null;
    for (let offset = 0; offset < 4; offset++) {
      const idx = (dispatchCursor + offset) % 4;
      if (slots[idx].equipped) {
        armedMatch = slots[idx];
        break;
      }
    }

    if (armedMatch) {
      dispatchCursor = (armedMatch.slotIndex + 1) % 4;
      lastDispatchedSlot = armedMatch.slotIndex;
      return {
        slotIndex: -1,
        profile: armedMatch.profile,
        isPhantom: true,
        shoulderSide,
        tier: armedMatch.slotIndex >= 2 ? 1 : 0
      };
    }

    // 3. 剑匣全空时保底凝气虚剑
    return {
      slotIndex: -1,
      profile: FALLBACK_PHANTOM,
      isPhantom: true,
      shoulderSide,
      tier: 0
    };
  }

  // 蓄力齐射：一次性调遣匣中所有已装备飞剑从背后双肩对称破空齐出！
  function launchAllReadyForCharge() {
    syncFromInventory();
    const launched = [];
    for (let i = 0; i < 4; i++) {
      const s = slots[i];
      if (!s.equipped) continue;
      const shoulderSide = (launched.length % 2 === 0) ? -1 : 1;
      const tier = Math.floor(launched.length / 2);
      if (s.state === 'docked') {
        s.state = 'flying_out';
        s.flightTimer = 0;
        launched.push({
          slotIndex: s.slotIndex,
          profile: s.profile,
          isPhantom: false,
          shoulderSide,
          tier
        });
      } else {
        launched.push({
          slotIndex: -1,
          profile: s.profile,
          isPhantom: true,
          shoulderSide,
          tier
        });
      }
    }
    if (launched.length === 0) {
      launched.push({
        slotIndex: -1,
        profile: FALLBACK_PHANTOM,
        isPhantom: true,
        shoulderSide: 1,
        tier: 0
      });
    }
    return launched;
  }

  function markSwordReturning(slotIdx) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    const s = slots[slotIdx];
    if (s && s.equipped) {
      s.state = 'returning';
    }
  }

  function dockSword(slotIdx) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    const s = slots[slotIdx];
    if (s && s.equipped) {
      s.state = 'docked';
      s.flightTimer = 0;
      s.returnFlashTimer = 0.28;
    }
  }

  function update(dt) {
    for (let i = 0; i < 4; i++) {
      const s = slots[i];
      if (s.returnFlashTimer > 0) s.returnFlashTimer = Math.max(0, s.returnFlashTimer - dt);
      if (s.equipped && (s.state === 'flying_out' || s.state === 'returning')) {
        s.flightTimer += dt;
        // 超时安全强制归匣
        if (s.flightTimer >= 2.8) {
          dockSword(i);
        }
      }
    }
  }

  // 兼容旧接口（不再作手动切剑用）
  function getActiveSword() {
    syncFromInventory();
    return slots[lastDispatchedSlot] && slots[lastDispatchedSlot].equipped
      ? slots[lastDispatchedSlot]
      : (slots.find((x) => x.equipped) || null);
  }

  window.CombatCasket = {
    SWORD_ARCHETYPES,
    syncFromInventory,
    getSlots: () => slots,
    getEquippedCount,
    getAttackSpeedMultiplier,
    getFireInterval,
    getSummary,
    getActiveSlotIndex: () => lastDispatchedSlot,
    getActiveSword,
    selectSlot: () => false,
    cycleSlot: () => lastDispatchedSlot,
    launchNextSword,
    launchPrimarySword: launchNextSword,
    launchAllReadyForCharge,
    markSwordReturning,
    dockSword,
    update
  };
})();
