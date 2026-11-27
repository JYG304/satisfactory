// ============================================================================
// js/combat/combat_config.js - 战斗系统唯一配置与 DEC-01~DEC-12 决策中心
// 支持运行中实时修改并一键导出 JSON 供 UE5 数据表同步
// ============================================================================

(function () {
  function createDefaultConfig() {
    return {
      // 对应《战斗系统详细策划案_模板V1.0.md》第 12 章核心开关
      decisions: {
        DEC_01_elementMode: 'tri_element',   // 'single_metal' | 'tri_element'
        DEC_02_dashEnabled: true,            // 是否开启 8 向灵步短冲
        DEC_03_consumableAmmo: false,        // false: 灵力循环制 | true: 消耗背包剑丸
        DEC_04_rightClickAction: 'guard_parry', // 'guard_parry' | 'charge_sword'
        DEC_05_chainCoreGrab: true,          // 是否支持多重连锁拔核
        DEC_06_grabInvulnAutoBox: true,      // 拔核减伤保护并自动吸入运输箱
        DEC_07_corpseDecay: false,           // 是否开启尸体保鲜衰减倒计时
        DEC_08_enemyAttackBuildings: 'blocked_only', // 'never' | 'blocked_only' | 'aggressive'
        DEC_09_tokenPreset: 'standard',      // 'casual' | 'standard' | 'hardcore'
        DEC_10_deathPenalty: 'drop_bag',     // 'none' | 'drop_bag' | 'hardcore'
        DEC_11_cpuKey: 'K',                  // CPU/科技树呼出键
        DEC_12_armStyle: 'hybrid',           // 'hybrid' | 'mech' | 'xianxia'
        DEC_13_turretTargeting: 'nearest',   // 仅按最近存活敌人索敌
        DEC_14_turretParalyzeRebuild: true,  // 防御塔不可摧毁，HP归零进入瘫痪态可原地重建
        DEC_15_turretRequireAmmo: true,      // 必须装填剑丸/雷丸才可开火
        DEC_16_craneAutoCorpse: true         // 收尸统一交由千纸鹤(BD_198)负责
      },

      // 第 2 章：WASD 移动与物理参数
      movement: {
        walkSpeed: 5.2,
        sprintSpeed: 8.6,
        strafeMult: 0.92,
        backMult: 0.85,
        chargeSlowMult: 0.62,
        guardSlowMult: 0.55,
        accel: 34.0,
        decel: 28.0,
        jumpHeight: 1.65,
        gravity: 22.0,
        coyoteTime: 0.12,
        jumpBuffer: 0.12,
        dashSpeed: 20.0,
        dashDuration: 0.22,
        dashCooldown: 1.15,
        dashInvuln: 0.16,
        dashCost: 22,
        eyeHeight: 1.72,
        playerRadius: 0.48,
        mouseSensitivity: 0.0022,
        baseFov: 84,
        dynamicFovEnabled: true
      },

      // 第 4 章：玩家核心战斗与资源数值
      player: {
        maxHp: 100,
        maxShield: 60,
        shieldRegenDelay: 4.0,
        shieldRegenRate: 15.0,
        maxQi: 100,
        qiRegenRate: 11.0,
        parryWindow: 0.20,
        guardMitigation: 0.70,
        parryReflectMult: 2.0,
        parryStaggerDuration: 1.6,
        parryShieldShred: 75,
        parryQiGain: 20,
        grabRange: 14.0,
        grabChainRadius: 4.5,
        grabChainMax: 3,
        grabDuration: 0.62,
        grabQiGain: 35,
        grabShieldGain: 20,
        talismanCooldown: 7.5,
        talismanRadius: 4.2,
        talismanStunDuration: 3.2,
        thunderSealCooldown: 9.0,
        thunderSealRadius: 5.5,
        thunderSealDmg: 68,
        thunderSealShieldMult: 2.6,
        thunderSealRange: 24.0,
        chargeTime: 0.65,
        chargeCost: 18,
        wanHunCooldown: 16.0,
        wanHunRadius: 18.0,
        wanHunDuration: 10.0,
        pillCooldown: 6.0,
        corpseBoxHoldTime: 0.65,
        hitstopEnabled: true
      },

      // 天罡剑匣装备配置：装剑越多攻速越快，自动轮发出鞘
      casket: {
        baseFireInterval: 0.44,
        speedMultByCount: [0.85, 1.0, 1.35, 1.75, 2.25]
      },

      // 第 4.2 节：幽灵线三系织法剑诀参数
      elements: {
        metal: {
          id: 'metal',
          name: '庚金·疾风剑诀',
          shortName: '庚金',
          colorHex: 0x38bdf8,
          accentHex: 0xfbbf24,
          cssColor: '#38bdf8',
          lightDmg: 22,
          lightRate: 0.23,       // 秒/发 (~4.3发/秒)
          lightCost: 2.0,
          lightRange: 44,
          lightSpeed: 42,
          lightShieldMult: 0.65,
          chargeTime: 0.68,
          chargeDmg: 36,         // ×3剑 = 108
          chargeCount: 3,
          chargeCost: 20,
          chargeShieldMult: 1.55,
          chargeSpeed: 50
        },
        water: {
          id: 'water',
          name: '玄水·横江浪诀',
          shortName: '玄水',
          colorHex: 0x22d3ee,
          accentHex: 0x0ea5e9,
          cssColor: '#22d3ee',
          lightDmg: 26,
          lightRate: 0.42,
          lightCost: 4.5,
          lightRange: 15,
          lightSpeed: 28,
          lightShieldMult: 0.85,
          lightArcHalfDeg: 40,
          chargeTime: 0.78,
          chargeDmg: 62,
          chargeCost: 24,
          chargeShieldMult: 1.15,
          chargeRadius: 11.5,
          chargeSlowDuration: 3.5
        },
        fire: {
          id: 'fire',
          name: '离火·赤煞爆诀',
          shortName: '离火',
          colorHex: 0xfb7185,
          accentHex: 0xf97316,
          cssColor: '#fb7185',
          lightDmg: 38,
          lightRate: 0.65,
          lightCost: 7.0,
          lightRange: 30,
          lightSpeed: 24,
          lightShieldMult: 1.45,
          lightSplashRadius: 3.0,
          chargeTime: 0.85,
          chargeDmg: 135,
          chargeCost: 32,
          chargeShieldMult: 2.35,
          chargeSplashRadius: 6.0,
          chargeSpeed: 21
        }
      },

      // 第 5 章：UE5 风格 AI 导演与塔防协同参数
      aiDirector: {
        maxMeleeTokens: 2,
        maxRangedTokens: 2,
        tokenCooldown: 1.4,
        offscreenExtraWindup: 0.42,
        offscreenAngleDeg: 105,
        showAiDebugLabels: true,
        turretEnabled: true,
        turretRange: 30,
        turretFireInterval: 1.05,
        turretDamage: 24,
        turretShieldMult: 1.35,
        turretHpMap: { bd_160: 600, thunder_turret: 1000, battle_base: 1200 },
        turretInitialAmmo: 20,
        turretRebuildHoldTime: 3.0,
        craneHarvestRange: 50,
        craneHarvestDelay: 1.5,
        battleBaseRepairRange: 32
      },

      // 第 6 章：四类敌方境界参数与招式帧表
      enemies: {
        qi: {
          type: 'qi',
          name: '练气修士',
          realmBadge: '练气',
          maxHp: 100,
          maxShield: 0,
          walkSpeed: 2.4,
          chaseSpeed: 4.7,
          strafeSpeed: 3.2,
          preferredMin: 4.0,
          preferredMax: 9.5,
          sightRange: 26,
          coreThresholdRatio: 0.32,
          staggerLimitForArmor: 3, // 连吃3次轻击触发霸体后跳
          dropItemId: 'MAT_020',
          dropName: '练气残躯',
          corpseScale: 1.0,
          attacks: {
            palm: { range: 3.8, windup: 0.55, recover: 0.70, cooldown: 3.4, dmg: 18, canParry: true },
            aura: { minRange: 4.0, maxRange: 14.5, windup: 0.65, recover: 0.55, cooldown: 3.8, dmg: 15, speed: 18, canParry: true }
          }
        },
        foundation: {
          type: 'foundation',
          name: '筑基修士',
          realmBadge: '筑基',
          maxHp: 280,
          maxShield: 180,
          walkSpeed: 2.6,
          chaseSpeed: 4.9,
          strafeSpeed: 3.0,
          preferredMin: 7.5,
          preferredMax: 16.0,
          sightRange: 32,
          shieldRegenDelay: 10.0,
          shieldRegenAmount: 120,
          dropItemId: 'MAT_055',
          dropName: '筑基残躯',
          corpseScale: 1.15,
          attacks: {
            melee: { range: 3.6, windup: 0.52, recover: 0.80, cooldown: 4.8, dmg: 30, canParry: true },
            tripleAura: { minRange: 6.5, maxRange: 23.0, windup: 0.75, recover: 0.90, cooldown: 5.2, dmg: 18, speed: 23, count: 3, interval: 0.22, canParry: true },
            aoeRing: { minRange: 5.0, maxRange: 22.0, windup: 1.35, recover: 1.15, cooldown: 8.5, dmg: 42, radius: 3.4, canParry: false }
          }
        },
        jindan: {
          type: 'jindan',
          name: '金丹首领·玄煞真君',
          realmBadge: '金丹',
          maxHp: 900,
          maxShield: 360,
          walkSpeed: 3.2,
          chaseSpeed: 5.4,
          strafeSpeed: 3.8,
          preferredMin: 9.0,
          preferredMax: 20.0,
          sightRange: 42,
          hoverHeight: 1.8,
          shieldRegenDelay: 12.0,
          shieldRegenAmount: 240,
          dropItemId: 'MAT_056',
          dropName: '金丹残躯',
          extraDropId: 'mat_077',
          corpseScale: 1.32,
          attacks: {
            fanSwords: { minRange: 4.0, maxRange: 26.0, windup: 0.72, recover: 0.85, cooldown: 4.2, dmg: 22, speed: 26, count: 5, canParry: true },
            thunderGrid: { minRange: 5.0, maxRange: 26.0, windup: 1.45, recover: 1.25, cooldown: 9.5, dmg: 46, radius: 4.0, canParry: false }
          }
        },
        beast: {
          type: 'beast',
          name: '煞气狂傀',
          realmBadge: '煞傀',
          maxHp: 65,
          maxShield: 0,
          walkSpeed: 3.5,
          chaseSpeed: 7.2,
          strafeSpeed: 4.2,
          preferredMin: 1.5,
          preferredMax: 2.5,
          sightRange: 28,
          coreThresholdRatio: 0.35,
          staggerLimitForArmor: 2,
          dropItemId: 'MAT_020',
          dropName: '煞气残骸(练气级)',
          corpseScale: 0.85,
          attacks: {
            lunge: { range: 2.8, windup: 0.42, recover: 0.55, cooldown: 2.4, dmg: 14, canParry: true }
          }
        }
      }
    };
  }

  const state = createDefaultConfig();

  function applyTokenPreset(preset) {
    state.decisions.DEC_09_tokenPreset = preset;
    if (preset === 'casual') {
      state.aiDirector.maxMeleeTokens = 1;
      state.aiDirector.maxRangedTokens = 1;
    } else if (preset === 'hardcore') {
      state.aiDirector.maxMeleeTokens = 3;
      state.aiDirector.maxRangedTokens = 3;
    } else {
      state.aiDirector.maxMeleeTokens = 2;
      state.aiDirector.maxRangedTokens = 2;
    }
  }

  function reset() {
    const fresh = createDefaultConfig();
    Object.keys(fresh).forEach((k) => {
      state[k] = fresh[k];
    });
  }

  function exportJSON() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      decisions: state.decisions,
      movement: state.movement,
      player: state.player,
      casket: state.casket,
      elements: state.elements,
      aiDirector: state.aiDirector
    }, null, 2);
  }

  window.CombatConfig = state;
  window.CombatConfigAPI = {
    applyTokenPreset,
    reset,
    exportJSON
  };
})();
