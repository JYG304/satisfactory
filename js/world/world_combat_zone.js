// ====================================================================
// js/world/world_combat_zone.js - 东南边境·煞潮前线战区
// 区域中心 (460, 0, 320)，范围 x: 400..520, z: 260..380
// 职责：
//   1. 脚本加载时立即向全局 worldBuildings 注入战区防御/后勤建筑 (id 前缀 bld_cz_)
//   2. DOMContentLoaded 后等待 World3D.isReady()，注册帧钩子驱动实时塔防+收尸闭环
//   3. 严格复用共享几何体/材质与对象池，镜头距离 > 260m 时暂停战斗模拟仅保留裂隙光柱
//   4. 导出 window.CombatZoneFX = { getStats }
// ====================================================================

(function () {
  'use strict';

  const ZONE_CENTER = { x: 460, y: 0, z: 320 };
  const PAUSE_DISTANCE = 260;

  // ------------------------------------------------------------------
  // 1. 立即向全局 worldBuildings 注入战区建筑 (必须在 DOMContentLoaded 之前)
  // ------------------------------------------------------------------
  const combatZoneBuildings = [];

  function pushBld(id, type, name, power, wx, wy, wz, rot, extra) {
    const entry = Object.assign({
      id: `bld_cz_${id}`,
      type,
      name,
      power,
      wx,
      wy,
      wz,
      rot: rot || 0
    }, extra || {});
    combatZoneBuildings.push(entry);
  }

  // (a0) 战区核心区装甲总地基 (合并原 225 块碎片地基为 1 块 90x90 整板)
  combatZoneBuildings.push({
    id: 'bld_cz_fnd_mega',
    type: 'foundation_3x3',
    name: '东南战区装甲总地基',
    power: '0 MW',
    wx: 460,
    wy: 0,
    wz: 316,
    rot: 0,
    slabW: 90,
    slabD: 90
  });

  // (a) 南侧主防线与军工生产平台 (主体覆盖 x = 381..539, z = 212..299.5, 顶面 y = 2;
  //     南侧 z < 212 保留原生土地用于玄铁矿脉(420,0,200)、灵泉水域(472,0,202)与发电站(520/534,0,202);
  //     最西侧 x = 380..388, z = 196..212 延伸生物培养翼台承托 decon_1 西翼产物仓)
  combatZoneBuildings.push({
    id: 'bld_cz_wall_mega',
    type: 'foundation_3x3',
    name: '东南战区主防线平台',
    power: '0 MW',
    wx: 460,
    wy: 0,
    wz: 255.75,
    rot: 0,
    slabW: 158,
    slabD: 87.5
  });
  combatZoneBuildings.push({
    id: 'bld_cz_wall_west_bio',
    type: 'foundation_3x3',
    name: '西翼生物工坊延展台',
    power: '0 MW',
    wx: 384,
    wy: 0,
    wz: 204,
    rot: 0,
    slabW: 8,
    slabD: 16
  });

  // (a2) 原生荒地主矿脉开采 -> 上平台三路分流总干线 + 火精灵泉抽水线 + 灵力发电站
  //      1) 玄铁矿脉 (420, 0, 200) -> 采矿机 (420, 0, 200) -> 上平台传送带 (z=210) -> 总分流器 (420, 2, 222)
  //         分流为 3 路：一阶(420) / 二阶(460) / 三阶(500)，并从三阶分流器东延供煤至发电机(520,0,202)
  pushBld('miner_main', 'miner', '玄铁矿脉采矿机', '25 MW', 420, 0, 200, 0);
  pushBld('belt_ore_main', 'conveyor', '玄铁矿脉上平台主带', '0 MW', 420, 2, 210, 0, {
    beltLen: 22,
    beltItem: 'MAT_001'
  });
  pushBld('stacker_ore_main', 'belt_stacker', '乾坤叠物机｜原矿叠层', '5 MW', 420, 2, 216, 0);
  pushBld('spl_ore_main', 'splitter', '原矿三路总分流器', '5 MW', 420, 2, 222, 0);
  pushBld('belt_ore_s1_in', 'conveyor', '一阶玄铁进料带', '0 MW', 420, 2, 224, 0, {
    beltLen: 3,
    beltItem: 'MAT_001'
  });
  pushBld('belt_ore_to_s2', 'conveyor', '二阶原矿东送干带', '0 MW', 440, 2, 222, 90, {
    beltLen: 38,
    beltItem: 'MAT_001'
  });
  pushBld('spl_ore_s2', 'splitter', '二阶原矿分流器', '5 MW', 460, 2, 222, 0);
  pushBld('belt_ore_s2_in', 'conveyor', '二阶赤铜进料带', '0 MW', 460, 2, 224, 0, {
    beltLen: 3,
    beltItem: 'MAT_007'
  });
  pushBld('belt_ore_to_s3', 'conveyor', '三阶原矿东送干带', '0 MW', 480, 2, 222, 90, {
    beltLen: 38,
    beltItem: 'MAT_001'
  });
  pushBld('spl_ore_s3', 'splitter', '三阶原矿分流器', '5 MW', 500, 2, 222, 0);
  pushBld('belt_ore_s3_in', 'conveyor', '三阶天雷进料带', '0 MW', 500, 2, 224, 0, {
    beltLen: 3,
    beltItem: 'mat_102'
  });

  //      2) 南侧双灵力引擎复合塔：
  //         (2a) 冶炼引擎塔 (520,0,202): 前侧垂直电梯升料入顶部冶炼舱(wy=4) -> 背后(z=197)垂直电梯出料回流至二阶爆裂剑丸产线
  //         (2b) 炼丹引擎塔 (484,0,202): 顶部挂载炼丹炉(BD_163)，吃洞天灵药圃灵草+灵泉水 -> 背后(z=197)垂直电梯输出真火剂/丹雾进天雷剑丸与丹雾喷涂器!
  pushBld('belt_coal_to_pwr_e', 'conveyor', '发电机燃料东送带', '0 MW', 510, 2, 222, 90, {
    beltLen: 18,
    beltItem: 'MAT_001'
  });
  pushBld('belt_coal_to_pwr_s', 'conveyor', '发电机燃料下坡带', '0 MW', 519, 2, 213.5, 180, {
    beltLen: 17,
    beltItem: 'MAT_001'
  });
  pushBld('power_gen_main', 'power_engine', '灵力引擎·冶炼舱复合塔', '+450 MW', 520, 0, 202, 0);
  pushBld('belt_pwr_smelt_s', 'conveyor', '冶炼舱矿料南送带', '0 MW', 516, 2, 213, 180, {
    beltLen: 18,
    beltItem: 'MAT_006'
  });
  pushBld('lift_pwr_up', 'vert_conveyor', '垂直电梯｜前侧升料入冶炼舱', '3 MW', 516, 0, 205, 180, {
    liftHeight: 4,
    beltItem: 'MAT_006'
  });
  pushBld('belt_pwr_top_in', 'conveyor', '高架进料带｜前侧入冶炼舱', '0 MW', 518, 4, 203.5, 90, {
    beltLen: 4,
    beltItem: 'MAT_006'
  });
  pushBld('belt_pwr_top_out', 'conveyor', '高架出料带｜冶炼舱背后出口', '0 MW', 520, 4, 199, 180, {
    beltLen: 4,
    beltItem: 'MAT_047'
  });
  pushBld('lift_pwr_down', 'vert_conveyor', '垂直电梯｜背后精炼锭下料', '3 MW', 520, 0, 197, 180, {
    liftHeight: 4,
    beltItem: 'MAT_047'
  });
  pushBld('belt_pwr_ret_e', 'conveyor', '精炼玄铁锭背后东转带', '0 MW', 523, 2, 197, 90, {
    beltLen: 6,
    beltItem: 'MAT_047'
  });
  pushBld('belt_pwr_ret_n', 'conveyor', '精炼玄铁锭北回流带', '0 MW', 526, 2, 208.5, 0, {
    beltLen: 23,
    beltItem: 'MAT_047'
  });
  pushBld('belt_pwr_ret_w', 'conveyor', '精炼玄铁锭跨桥西回流带', '0 MW', 493, 3.2, 220, 270, {
    beltLen: 66,
    beltItem: 'MAT_047'
  });
  pushBld('wind_gen_main', 'wind_generator', '风力灵塔', '+180 MW', 534, 0, 202, 0);

  //      (2b) 灵泉蓄水池 (472,2,214) + 玻璃熔炼 -> 药瓶压制台(BD_167) -> 灵力引擎·占3格大炼丹炉(484,0,202) -> 背后出口出瓶装丹药进御剑抛射台/天雷炼宝台
  pushBld('tank_water_cz', 'fluid_tank', '灵泉蓄水池 (BD_165)', '0 MW', 472, 2, 214, 0);
  pushBld('furnace_glass_cz', 'furnace', '玻璃精炼炉 (BD_136)', '20 MW', 478, 2, 224, 180);
  pushBld('belt_glass_to_bottle', 'conveyor', '玻璃进瓶压制带', '0 MW', 478, 2, 219, 180, {
    beltLen: 6,
    beltItem: 'MAT_099'
  });
  pushBld('printer_bottle_cz', 'assembler', '药瓶压制台 (BD_167)', '20 MW', 478, 2, 214, 90);
  pushBld('belt_bottle_to_alch', 'conveyor', '空药瓶进丹炉带', '0 MW', 481, 2, 214, 90, {
    beltLen: 6,
    beltItem: 'MAT_101'
  });
  pushBld('herb_garden_cz', 'immortal_herb_garden', '洞天灵药圃 (BD_205)', '15 MW', 484, 2, 214, 180);
  pushBld('belt_herb_to_alch', 'conveyor', '灵药与药瓶入丹炉带', '0 MW', 484, 2, 209, 180, {
    beltLen: 6,
    beltItem: 'MAT_101'
  });
  pushBld('lift_alchemy_up', 'vert_conveyor', '垂直电梯｜升灵药药瓶入丹炉', '3 MW', 484, 0, 206, 180, {
    liftHeight: 4,
    beltItem: 'MAT_101'
  });
  pushBld('belt_alchemy_top_in', 'conveyor', '高架进料带｜入顶部炼丹炉', '0 MW', 484, 4, 204, 180, {
    beltLen: 4,
    beltItem: 'MAT_101'
  });
  pushBld('power_alchemy_main', 'power_engine', '灵力引擎·占3格大炼丹炉 (BD_147+BD_163)', '+300 MW', 484, 0, 202, 0, {
    topPlugin: 'bd_163'
  });
  pushBld('pipe_alchemy_in', 'pipe', '灵泉水入丹炉管线', '0 MW', 478, 0.8, 202, 0, {
    pipeLen: 12
  });
  pushBld('belt_alchemy_top_out', 'conveyor', '高架出料带｜炼丹炉背后出口', '0 MW', 484, 4, 199, 180, {
    beltLen: 4,
    beltItem: 'MAT_080'
  });
  pushBld('lift_alchemy_down', 'vert_conveyor', '垂直电梯｜背后瓶装丹药下料', '3 MW', 484, 0, 197, 180, {
    liftHeight: 4,
    beltItem: 'MAT_080'
  });
  pushBld('belt_alchemy_ret_e', 'conveyor', '瓶装丹药背后东转带', '0 MW', 486, 2, 197, 90, {
    beltLen: 4,
    beltItem: 'MAT_080'
  });
  pushBld('belt_alchemy_ret_n', 'conveyor', '瓶装丹药北送干带', '0 MW', 488, 2, 208, 0, {
    beltLen: 22,
    beltItem: 'MAT_080'
  });
  pushBld('spl_alchemy_out', 'splitter', '丹药真火剂分流器', '5 MW', 488, 2, 219, 0);
  pushBld('belt_alchemy_to_thunder', 'conveyor', '真火剂直入天雷炼宝台带', '0 MW', 494, 2, 234.5, 0, {
    beltLen: 31,
    beltItem: 'MAT_130'
  });
  pushBld('belt_alchemy_to_thunder_in', 'conveyor', '真火剂进天雷炼宝台接驳带', '0 MW', 497, 2, 250, 90, {
    beltLen: 6,
    beltItem: 'MAT_130'
  });

  // (b) 唯一防御塔：9 座剑丸防御塔 (bd_160, z = 294, wy = 2)，串联三阶升级产线：
  //     一阶·玄铁剑丸 (x=420, gold) ➔ 二阶·爆裂剑丸 (x=460, fire) ➔ 三阶·天雷剑丸 (x=500, thunder)
  const TURRET_GROUPS = [
    {
      key: 'gold',
      label: '玄铁剑丸',
      xs: [414, 420, 426],
      centerX: 420,
      beltItem: 'MAT_006',
      oreColor: 0x94a3b8,
      leftProcType: 'crusher',
      leftProcName: '粉碎机',
      rightProcType: 'furnace',
      rightProcName: '精炼炉',
      mainProcType: 'assembler',
      mainProcName: '玄铁剑丸加工台'
    },
    {
      key: 'fire',
      label: '爆裂剑丸',
      xs: [454, 460, 466],
      centerX: 460,
      beltItem: 'MAT_007',
      oreColor: 0xf59e0b,
      leftProcType: 'assembler',
      leftProcName: '加工台',
      rightProcType: 'mixer',
      rightProcName: '搅拌机',
      mainProcType: 'assembler_heavy',
      mainProcName: '爆裂剑丸组装机'
    },
    {
      key: 'thunder',
      label: '天雷剑丸',
      xs: [494, 500, 506],
      centerX: 500,
      beltItem: 'mat_102',
      oreColor: 0x38bdf8,
      leftProcType: 'cutter',
      leftProcName: '切割机',
      rightProcType: 'assembler_heavy',
      rightProcName: '组装机',
      mainProcType: 'alchemy_table',
      mainProcName: '天雷剑丸炼宝台'
    }
  ];

  const swordTurretDefs = [];
  TURRET_GROUPS.forEach((grp) => {
    const cx = grp.centerX;
    // 0) 接驳总矿脉分流干线的双路直连上游 + 串联剑丸军工产线 (z = 226..287, wy = 2):
    //    spl_ore_* (222) -> spl_in_* (226) -> 左/右加工机 (232) -> 直连传送带 (241) -> alchemy_table (250)
    //    Stage 2 右路为平台外灵泉水域 (472, 0.15, 202) 抽水机 (472, 0, 202) -> 长管道 (472, 2, 226, pipeLen: 44) -> 流体处理中枢 (472, 2, 250)
    pushBld(`spl_in_${grp.key}`, 'splitter', `${grp.label}初分流器`, '5 MW', cx, 2, 226, 0);

    // 左路直连: splitter(cx,226) -> 左上游机(cx-6,232) -> 左直入传送带(cx-3,241,beltLen:14) -> alchemy_table(cx,250)左端口
    pushBld(`belt_in_l_${grp.key}`, 'conveyor', `${grp.label}左路进料带`, '0 MW', cx - 3, 2, 226, 270, {
      beltLen: 6,
      beltItem: grp.beltItem
    });
    pushBld(`belt_in_lv_${grp.key}`, 'conveyor', `${grp.label}左路直入带`, '0 MW', cx - 6, 2, 229, 0, {
      beltLen: 5,
      beltItem: grp.beltItem
    });
    pushBld(`proc_l_${grp.key}`, grp.leftProcType, grp.leftProcName, '30 MW', cx - 6, 2, 232, 0);
    pushBld(`belt_par_l_turn_${grp.key}`, 'conveyor', `${grp.label}左转接带`, '0 MW', cx - 4.5, 2, 234, 90, {
      beltLen: 3,
      beltItem: grp.beltItem
    });
    pushBld(`belt_par_l_${grp.key}`, 'conveyor', `${grp.label}左直连进料带`, '0 MW', cx - 3, 2, 241, 0, {
      beltLen: 14,
      beltItem: grp.beltItem
    });
    pushBld(`belt_par_l_in_${grp.key}`, 'conveyor', `${grp.label}左入主台接驳带`, '0 MW', cx - 1.5, 2, 248, 90, {
      beltLen: 3,
      beltItem: grp.beltItem
    });

    // 右路直连: Stage 1 为精炼炉(426,232)直插右端口(423,241); Stage 2 为灵泉抽水机(472,0,202)->长输水管道(472,2,226)->流体处理中枢/搅拌机->侧向流体水管; Stage 3 为精炼炉->组装机->侧向传送带
    if (grp.key === 'gold') {
      pushBld(`belt_in_r_${grp.key}`, 'conveyor', `${grp.label}右路进料带`, '0 MW', cx + 3, 2, 226, 90, {
        beltLen: 6,
        beltItem: grp.beltItem
      });
      pushBld(`belt_in_rv_${grp.key}`, 'conveyor', `${grp.label}右路直入带`, '0 MW', cx + 6, 2, 229, 0, {
        beltLen: 5,
        beltItem: grp.beltItem
      });
      pushBld(`proc_r_${grp.key}`, grp.rightProcType, grp.rightProcName, '30 MW', cx + 6, 2, 232, 0);
      pushBld(`belt_par_r_turn_${grp.key}`, 'conveyor', `${grp.label}右转接带`, '0 MW', cx + 4.5, 2, 234, 270, {
        beltLen: 3,
        beltItem: grp.beltItem
      });
      pushBld(`belt_par_r_${grp.key}`, 'conveyor', `${grp.label}右直连进料带`, '0 MW', cx + 3, 2, 241, 0, {
        beltLen: 14,
        beltItem: grp.beltItem
      });
      pushBld(`belt_par_r_in_${grp.key}`, 'conveyor', `${grp.label}右入主台接驳带`, '0 MW', cx + 1.5, 2, 248, 270, {
        beltLen: 3,
        beltItem: grp.beltItem
      });
    } else if (grp.key === 'fire') {
      pushBld('pump_fire', 'pump', '灵泉抽水机', '15 MW', 472, 0, 202, 0);
      pushBld('pipe_in_fire', 'pipe', '火精灵液进水管', '0 MW', 472, 2, 226, 90, {
        pipeLen: 44,
        beltItem: 'MAT_007'
      });
      pushBld('fluid_hub_fire', 'fluid_hub', '流体处理中枢·横置 (搅拌机+离心机)', '45 MW', 472, 2, 250, 90, {
        plugins: ['mixer', 'centrifuge']
      });
      pushBld('pipe_side_fire', 'pipe', `${grp.label}侧向流体水管`, '0 MW', cx + 6, 2, 250, 0, {
        pipeLen: 8,
        beltLen: 8
      });
    } else {
      pushBld(`belt_in_r_${grp.key}`, 'conveyor', `${grp.label}右路进料带`, '0 MW', cx + 6, 2, 226, 90, {
        beltLen: 12,
        beltItem: grp.beltItem
      });
      pushBld(`belt_in_rv_${grp.key}`, 'conveyor', `${grp.label}右路直入带`, '0 MW', cx + 12, 2, 229, 0, {
        beltLen: 5,
        beltItem: grp.beltItem
      });
      pushBld('furnace_cap', 'furnace', '精炼炉', '30 MW', cx + 12, 2, 232, 0);
      pushBld('belt_cap_in', 'conveyor', '电容金属进料带', '0 MW', cx + 12, 2, 241, 0, {
        beltLen: 14,
        beltItem: 'mat_102'
      });
      pushBld(`proc_r_${grp.key}`, grp.rightProcType, grp.rightProcName, '30 MW', cx + 12, 2, 250, 270);
      pushBld(`pipe_side_${grp.key}`, 'conveyor', '高压电容器输出带', '0 MW', cx + 6, 2, 250, 270, {
        beltLen: 8,
        beltItem: 'mat_102'
      });
    }

    pushBld(`alchemy_${grp.key}`, grp.mainProcType, grp.mainProcName, '45 MW', cx, 2, 250, 0);
    pushBld(`belt_out_${grp.key}`, 'conveyor', `${grp.label}成丸出料带`, '0 MW', cx, 2, 255, 0, {
      beltLen: 6,
      beltItem: grp.beltItem
    });
    pushBld(`spl_upg_${grp.key}`, 'splitter', `${grp.label}分流器`, '5 MW', cx, 2, 260, 0);
    pushBld(`belt_box_${grp.key}`, 'conveyor', `${grp.label}入仓传送带`, '0 MW', cx, 2, 265, 0, {
      beltLen: 6,
      beltItem: grp.beltItem
    });

    // 1) 剑丸防御塔 x3 (z = 294, wy = 2) + 阵前低矮战术铁质拒马(foundation_beam, z = 299, 留出进攻通道缺口)
    grp.xs.forEach((x, idx) => {
      pushBld(
        `sword_${grp.key}_${idx + 1}`,
        'bd_160',
        `${grp.label}防御塔 #${idx + 1}`,
        '25 MW',
        x,
        2,
        294,
        0,
        { ammoType: grp.key }
      );
      swordTurretDefs.push({ x, ammoType: grp.key });
    });
    pushBld(`barricade_${grp.key}_w`, 'foundation_beam', `${grp.label}西翼战术拒马`, '0 MW', cx - 6, 2, 299, 0, {
      slabW: 7,
      slabD: 1.4
    });
    pushBld(`barricade_${grp.key}_e`, 'foundation_beam', `${grp.label}东翼战术拒马`, '0 MW', cx + 6, 2, 299, 0, {
      slabW: 7,
      slabD: 1.4
    });

    // 2) 前线剑丸备弹总仓 (z = 270) + 出仓主干带 (z = 275) + 丹雾喷涂器 (BD_177)
    pushBld(`box_${grp.key}`, 'storage_box', `${grp.label}备弹总仓`, '0 MW', cx, 2, 270, 0);
    pushBld(`feed_trunk_${grp.key}`, 'conveyor', `${grp.label}出仓主干带`, '0 MW', cx, 2, 275, 0, {
      beltLen: 6,
      beltItem: grp.beltItem
    });
    pushBld(`sprayer_${grp.key}`, 'belt_sprayer', `${grp.label}丹雾喷涂器 (BD_177)`, '8 MW', cx, 2, 275, 0);

    // 3) 分流器 (z = 280) + 横向配给带
    pushBld(`spl_${grp.key}`, 'splitter', `${grp.label}供弹分流器`, '5 MW', cx, 2, 280, 0);
    pushBld(`feed_h_${grp.key}_l`, 'conveyor', `${grp.label}左翼配给带`, '0 MW', cx - 3.5, 2, 280, 270, {
      beltLen: 6,
      beltItem: grp.beltItem
    });
    pushBld(`feed_h_${grp.key}_r`, 'conveyor', `${grp.label}右翼配给带`, '0 MW', cx + 3.5, 2, 280, 90, {
      beltLen: 6,
      beltItem: grp.beltItem
    });

    // 4) 3 条纵向供弹传送带 (z = 287, rot: 0, beltLen: 14) 无缝直插炮塔尾部
    grp.xs.forEach((x, idx) => {
      pushBld(`feed_v_${grp.key}_${idx + 1}`, 'conveyor', `${grp.label}供弹传送带 #${idx + 1}`, '0 MW', x, 2, 287, 0, {
        beltLen: 14,
        beltItem: grp.beltItem
      });
    });
  });

  // (b2) 三阶串联升级传送带（直插炼宝台 ②/③ 右侧端口）：
  //      Stage 1 分流器(420,260) -> (440,260) -> (440,241) -> (460,241) -> (463,245) 直入炼宝台 ② 右端口
  //      Stage 2 分流器(460,260) -> (480,260) -> (480,241) -> (500,241) -> (503,245) 直入炼宝台 ③ 右端口
  pushBld('upg_1_e1', 'conveyor', '玄铁剑丸升级东送带 #1', '0 MW', 430, 2, 260, 90, {
    beltLen: 20,
    beltItem: 'MAT_006'
  });
  pushBld('upg_1_s', 'conveyor', '玄铁剑丸升级折返带 #1', '0 MW', 440, 2, 250.5, 180, {
    beltLen: 19,
    beltItem: 'MAT_006'
  });
  pushBld('upg_1_e2', 'conveyor', '玄铁剑丸直插横带 #1', '0 MW', 451.5, 2, 241, 90, {
    beltLen: 23,
    beltItem: 'MAT_006'
  });
  pushBld('upg_1_in', 'conveyor', '玄铁剑丸右口直入带 #1', '0 MW', 463, 2, 245.5, 0, {
    beltLen: 9,
    beltItem: 'MAT_006'
  });
  pushBld('upg_1_in_stub', 'conveyor', '玄铁剑丸进二阶接驳带 #1', '0 MW', 461.5, 2, 250, 270, {
    beltLen: 3,
    beltItem: 'MAT_006'
  });

  pushBld('upg_2_e1', 'conveyor', '爆裂剑丸升级东送带 #2', '0 MW', 470, 2, 260, 90, {
    beltLen: 20,
    beltItem: 'MAT_007'
  });
  pushBld('upg_2_s', 'conveyor', '爆裂剑丸升级折返带 #2', '0 MW', 480, 2, 250.5, 180, {
    beltLen: 19,
    beltItem: 'MAT_007'
  });
  pushBld('upg_2_e2', 'conveyor', '爆裂剑丸直插横带 #2', '0 MW', 491.5, 2, 241, 90, {
    beltLen: 23,
    beltItem: 'MAT_007'
  });
  pushBld('upg_2_in', 'conveyor', '爆裂剑丸右口直入带 #2', '0 MW', 503, 2, 245, 0, {
    beltLen: 8,
    beltItem: 'MAT_007'
  });

  // (c) 2 座蓄雷供电塔 (thunder_accumulator)
  pushBld('pwr_1', 'thunder_accumulator', '前线蓄雷塔 #1', '+1200 MW', 410, 0, 290, 0);
  pushBld('pwr_2', 'thunder_accumulator', '前线蓄雷塔 #2', '+1200 MW', 510, 0, 290, 0);

  // (c2) 北侧 3 座敌宗前哨要塞 (z = 358, 紧邻 3 个煞潮裂隙刷怪口)
  pushBld('stronghold_1', 'sky_extractor', '敌宗前哨·噬灵汲取塔', '0 MW', 420, 2, 358, 180);
  pushBld('stronghold_2', 'power_engine', '敌宗中枢·煞潮魔炉堡', '0 MW', 460, 2, 358, 180);
  pushBld('stronghold_3', 'research_altar', '敌宗阵坛·玄煞推演坛', '0 MW', 500, 2, 358, 180);

  // (d) 纸鹤敌修残躯解构 -> 双端口并行直出 (wy = 2, x = 390 / 530)
  //     左翼 decon_1 (390,252) -> 西路 (390,248 -> 384,248 -> 384,216) ➔ 生物培养工坊 (384,214) ➔ 成品仓 (384,198);
  //                               东路 (390,248 -> 396,248 -> 396,240 -> 420,240) ➔ 分流回流至一阶/二阶剑丸产线 (x=420/460)!
  pushBld('decon_1', 'deconstructor', '敌修残躯解构机 #1', '25 MW', 390, 2, 252, 180);
  pushBld('belt_decon_1_w_link', 'conveyor', '生物培养西接驳带', '0 MW', 387, 2, 248, 270, {
    beltLen: 6,
    beltItem: 'MAT_018'
  });
  pushBld('belt_decon_1_w', 'conveyor', '生物培养直出进料带', '0 MW', 384, 2, 232, 180, {
    beltLen: 32,
    beltItem: 'MAT_018'
  });
  pushBld('bio_base_1', 'bio_base', '营养基座 (固体+液体双入)', '10 MW', 384, 2, 214, 180);
  pushBld('incubator_1', 'incubator', '培养仓', '20 MW', 384, 4.0, 214, 180);
  pushBld('belt_bio_out_1', 'conveyor', '生物滤芯出料带', '0 MW', 384, 2, 205, 180, {
    beltLen: 14,
    beltItem: 'MAT_018'
  });
  pushBld('storage_bio_1', 'storage_box', '生物滤芯仓', '0 MW', 384, 2, 198, 180);

  pushBld('belt_decon_1_e_link', 'conveyor', '碎晶残料东接驳带', '0 MW', 393, 2, 248, 90, {
    beltLen: 6,
    beltItem: 'MAT_006'
  });
  pushBld('belt_decon_1_e', 'conveyor', '碎晶残料南出带', '0 MW', 396, 2, 244, 180, {
    beltLen: 8,
    beltItem: 'MAT_006'
  });
  pushBld('belt_decon_1_reflow_e1', 'conveyor', '解构回流东送带 #1', '0 MW', 408, 2, 240, 90, {
    beltLen: 24,
    beltItem: 'MAT_006'
  });
  pushBld('spl_decon_reflow', 'splitter', '解构碎料回流分流器', '5 MW', 420, 2, 240, 0);
  pushBld('belt_decon_1_reflow_s1', 'conveyor', '回流一阶炼宝台进料带', '0 MW', 420, 2, 245, 0, {
    beltLen: 8,
    beltItem: 'MAT_006'
  });
  pushBld('belt_decon_1_reflow_e2', 'conveyor', '解构回流跨桥东送带 #2', '0 MW', 440, 3.2, 240, 90, {
    beltLen: 38,
    beltItem: 'MAT_006'
  });
  pushBld('belt_decon_1_reflow_s2', 'conveyor', '回流二阶炼宝台进料带', '0 MW', 460, 2.6, 245, 0, {
    beltLen: 8,
    beltItem: 'MAT_007'
  });

  //     右翼 decon_2 (530,252) -> 双直出接驳带 (524,248 & 536,248) -> 平行带 (524,237 -> 推演台 524,224 / 536,237 -> 提取器 536,224)
  pushBld('decon_2', 'deconstructor', '敌修残躯解构机 #2', '25 MW', 530, 2, 252, 180);
  pushBld('belt_decon_2_w_link', 'conveyor', '推演台西接驳带', '0 MW', 527, 2, 248, 270, {
    beltLen: 6,
    beltItem: 'MAT_077'
  });
  pushBld('belt_decon_2_w', 'conveyor', '推演台直出进料带', '0 MW', 524, 2, 237, 180, {
    beltLen: 22,
    beltItem: 'MAT_077'
  });
  pushBld('research_altar_2', 'research_altar', '推演台', '35 MW', 524, 2, 224, 180);
  pushBld('belt_research_out_2', 'conveyor', '科研数据出料带', '0 MW', 524, 2, 218.5, 180, {
    beltLen: 7,
    beltItem: 'MAT_077'
  });
  pushBld('storage_research_2', 'storage_box', '科研数据仓', '0 MW', 524, 2, 214, 180);

  pushBld('belt_decon_2_e_link', 'conveyor', '提取器东接驳带', '0 MW', 533, 2, 248, 90, {
    beltLen: 6,
    beltItem: 'MAT_077'
  });
  pushBld('belt_decon_2_e', 'conveyor', '提取器直出进料带', '0 MW', 536, 2, 237, 180, {
    beltLen: 22,
    beltItem: 'MAT_077'
  });
  pushBld('fluid_hub_ext', 'fluid_hub', '流体处理中枢·横置 (提取器+离心机)', '45 MW', 536, 2, 224, 90, {
    plugins: ['extractor', 'centrifuge']
  });
  pushBld('pipe_extract_out_2', 'pipe', '精元凝液出液管', '0 MW', 536, 2, 218.5, 90, {
    pipeLen: 7
  });
  pushBld('storage_extract_2', 'fluid_tank', '精元凝液蓄水池 (BD_165)', '0 MW', 536, 2, 214, 180);

  // (e) 纸鹤赋能台 + 回收处理塔 + 万兽仙池 + 蓄水池供液 + 御剑抛射台瓶装丹药运输闭环（无悬空断带/断管）
  pushBld('purifier_cz_1', 'purifier', '战区回收处理塔 (BD_150)', '20 MW', 378, 2, 206, 0);
  pushBld('pipe_pur_to_bio1_v', 'pipe', '回收净化液进培养仓管 #1', '0 MW', 378, 2, 210, 90, {
    pipeLen: 8
  });
  pushBld('pipe_pur_to_bio1', 'pipe', '回收净化液进培养仓管 #2', '0 MW', 381, 2, 214, 0, {
    pipeLen: 6
  });
  pushBld('pipe_pur_to_crane1', 'pipe', '净化液南送培养基座水管', '0 MW', 378, 2, 235, 90, {
    pipeLen: 42
  });
  pushBld('pipe_pur_crane1_in', 'pipe', '培养基座进液接驳管 #1', '0 MW', 381, 2, 256, 0, {
    pipeLen: 6
  });
  pushBld('beast_pool_cz', 'beast_immortal_pool', '战区万兽仙池 (BD_206)', '25 MW', 374, 2, 224, 0);
  pushBld('crane_1', 'crane_distributor', '千纸鹤控制台 #1 (BD_198)', '15 MW', 392, 2, 272, 0);
  pushBld('belt_crane_to_decon_1', 'conveyor', '千纸鹤储仓出料进解构带 #1', '0 MW', 391, 2, 264, 180, {
    beltLen: 16,
    beltItem: 'MAT_017'
  });
  pushBld('limiter_crane_1', 'conveyor_limiter', '纸鹤供料限速器 #1 (BD_127)', '2 MW', 388, 2, 272, 90);
  pushBld('catapult_cz_w', 'sword_catapult', '御剑抛射台·瓶装丹药运输 (BD_199)', '15 MW', 402, 2, 272, 90);
  pushBld('belt_bio_to_crane_w', 'conveyor', '生物仓出料导流带 #1', '0 MW', 382, 2, 198, 270, {
    beltLen: 4,
    beltItem: 'MAT_026'
  });
  pushBld('belt_bio_to_crane_s', 'conveyor', '生物滤芯南送供料带 #1', '0 MW', 380, 2, 227, 0, {
    beltLen: 58,
    beltItem: 'MAT_026'
  });
  pushBld('belt_bio_to_crane_e', 'conveyor', '营养基座进料接驳带 #1', '0 MW', 382, 2, 256, 90, {
    beltLen: 4,
    beltItem: 'MAT_026'
  });
  pushBld('bio_base_crane_1', 'bio_base', '灵木培养基座 #1 (固+液双入)', '10 MW', 384, 2, 256, 0);
  pushBld('incubator_crane_1', 'incubator', '灵木灵草培育仓 #1', '20 MW', 384, 4.0, 256, 0);
  pushBld('belt_crane_herb_1', 'conveyor', '灵草采集传送带 #1', '0 MW', 384, 2, 260, 0, {
    beltLen: 4,
    beltItem: 'MAT_146'
  });
  pushBld('assembler_crane_1', 'assembler', '千纸鹤加工台 #1 (BD_138)', '30 MW', 384, 2, 264, 0);
  pushBld('belt_crane_turn_1', 'conveyor', '纸鹤成品出料带 #1', '0 MW', 384, 2, 268, 0, {
    beltLen: 8,
    beltItem: 'MAT_146'
  });
  pushBld('belt_crane_fuel_1', 'conveyor', '纸鹤灵符供料带 #1', '0 MW', 388, 2, 272, 90, {
    beltLen: 8,
    beltItem: 'MAT_146'
  });
  pushBld('belt_to_catapult_w', 'conveyor', '御剑抛射台进料带', '0 MW', 397, 2, 272, 90, {
    beltLen: 10,
    beltItem: 'MAT_080'
  });

  //     东翼: storage_extract_2 蓄水池(536,214) -> 水管导流精元凝液至 bio_base_crane_2(536,256) -> 灵草带 -> 加工台(536,264) -> 限速器 -> 纸鹤赋能台(528,272)
  pushBld('crane_2', 'crane_distributor', '千纸鹤控制台 #2 (BD_198)', '15 MW', 528, 2, 272, 0);
  pushBld('belt_crane_to_decon_2', 'conveyor', '千纸鹤储仓出料进解构带 #2', '0 MW', 529, 2, 264, 180, {
    beltLen: 16,
    beltItem: 'MAT_017'
  });
  pushBld('limiter_crane_2', 'conveyor_limiter', '纸鹤供料限速器 #2 (BD_127)', '2 MW', 532, 2, 272, 270);
  pushBld('lotus_cz_e', 'lotus_catcher', '接引莲台·瓶装丹药接收 (BD_200)', '10 MW', 518, 2, 272, 270);
  pushBld('belt_from_lotus_e', 'conveyor', '接引莲台出料带', '0 MW', 523, 2, 272, 90, {
    beltLen: 10,
    beltItem: 'MAT_080'
  });

  // (f) 独立西南煞气工厂 (x = -400..-320, z = 320..400, 远离塔防战区，紫色煞气地面 + 持续冒紫气 + 排放/压制/结晶/法宝插座全闭环)
  combatZoneBuildings.push({
    id: 'bld_cz_shaqi_fnd',
    type: 'foundation_3x3',
    name: '西南煞气工厂总地基',
    power: '0 MW',
    wx: -360,
    wy: 0,
    wz: 360,
    rot: 0,
    slabW: 80,
    slabD: 80
  });
  // 1) 北侧：煞气排放井(BD_166) + 九霄采气塔压制气体(BD_184) + 煞气灵草培养(BD_159)
  pushBld('shaqi_vent_1', 'purify_tower', '化煞焚毁排放井 #1 (BD_166)', '15 MW', -384, 2, 334, 0);
  pushBld('shaqi_vent_2', 'purify_tower', '化煞焚毁排放井 #2 (BD_166)', '15 MW', -372, 2, 334, 0);
  pushBld('shaqi_comp_1', 'sky_extractor', '九霄采气塔·煞气压制 #1 (BD_184)', '30 MW', -358, 2, 334, 180);
  pushBld('shaqi_comp_2', 'sky_extractor', '九霄采气塔·煞气压制 #2 (BD_184)', '30 MW', -344, 2, 334, 180);
  pushBld('belt_shaqi_comp_1', 'conveyor', '压制煞气输入离心带 #1', '0 MW', -358, 2, 344, 180, {
    beltLen: 20,
    beltItem: 'MAT_073'
  });
  pushBld('belt_shaqi_comp_2', 'conveyor', '压制煞气输入提取带 #2', '0 MW', -344, 2, 340, 180, {
    beltLen: 12,
    beltItem: 'MAT_073'
  });
  pushBld('shaqi_bio_base', 'bio_base', '煞气灵草营养基座 (BD_159)', '10 MW', -344, 2, 348, 180);
  pushBld('belt_shaqi_herb_w', 'conveyor', '煞气灵草入提取带', '0 MW', -351, 2, 348, 270, {
    beltLen: 14,
    beltItem: 'MAT_026'
  });

  // 2) 中央：横置流体处理中枢(提取器+离心机) ➔ 液态煞气管线 ➔ 蓄水池(BD_165) + 回收处理塔(BD_150)
  pushBld('shaqi_hub_cz', 'fluid_hub', '煞液提取离心枢·横置 (提取器+离心机)', '45 MW', -358, 2, 354, 90, {
    plugins: ['extractor', 'centrifuge']
  });
  pushBld('pipe_shaqi_to_tank', 'pipe', '液态煞气出液管', '0 MW', -358, 2, 360, 90, {
    pipeLen: 12
  });
  pushBld('shaqi_tank_cz', 'fluid_tank', '液态煞气蓄水池 (BD_165)', '0 MW', -358, 2, 366, 0);
  pushBld('pipe_shaqi_to_pur', 'pipe', '煞水进回收处理塔管线', '0 MW', -366, 2, 366, 0, {
    pipeLen: 16
  });
  pushBld('shaqi_purifier_cz', 'purifier', '煞水结晶回收塔 (BD_150)', '20 MW', -374, 2, 366, 0);
  pushBld('pipe_shaqi_to_alchemy', 'pipe', '液态煞气入炼宝台管线', '0 MW', -350, 2, 366, 0, {
    pipeLen: 16
  });

  // 3) 结晶与合金线：煞气结晶 ➔ 归墟化煞炉(BD_178) / 冶炼舱 ➔ 切割机 ➔ 煞气炼宝台(BD_156)
  pushBld('belt_shaqi_crystal_e', 'conveyor', '煞气结晶东送带', '0 MW', -350, 2, 354, 90, {
    beltLen: 16,
    beltItem: 'MAT_067'
  });
  pushBld('shaqi_guixu_furnace', 'furnace', '归墟化煞炉 (BD_178)', '35 MW', -340, 2, 354, 180);
  pushBld('belt_shaqi_to_cut', 'conveyor', '煞气合金进切割带', '0 MW', -340, 2, 359, 180, {
    beltLen: 10,
    beltItem: 'MAT_069'
  });
  pushBld('shaqi_cutter', 'cutter', '煞气合金切割机 (BD_139)', '20 MW', -340, 2, 362, 180);
  pushBld('belt_shaqi_to_alch', 'conveyor', '煞气结晶与薄片进炼宝台带', '0 MW', -340, 2, 365, 180, {
    beltLen: 6,
    beltItem: 'MAT_067'
  });
  pushBld('shaqi_alchemy_cz', 'alchemy_table', '煞气炼宝台 (BD_156)', '45 MW', -340, 2, 368, 0);

  // 4) 南侧输出与法宝共鸣插座：煞气结晶/法宝成品仓 ➔ 御剑抛射台(送往煞气/战区) + 法宝共鸣插座
  pushBld('belt_shaqi_out', 'conveyor', '煞气结晶成品出料带', '0 MW', -340, 2, 375, 0, {
    beltLen: 10,
    beltItem: 'MAT_067'
  });
  pushBld('shaqi_box_out', 'storage_box', '煞气结晶总仓', '0 MW', -340, 2, 380, 0);
  pushBld('belt_shaqi_to_catapult', 'conveyor', '结晶装填抛射带', '0 MW', -346, 2, 380, 270, {
    beltLen: 12,
    beltItem: 'MAT_067'
  });
  pushBld('shaqi_catapult_out', 'sword_catapult', '御剑抛射台·煞晶外送 (BD_199)', '15 MW', -352, 2, 380, 90);
  pushBld('fabao_socket_cz', 'fabao_socket', '法宝共鸣插座 (范围生效)', '10 MW', -368, 2, 378, 0);
  pushBld('pipe_ext_to_crane_e', 'pipe', '凝液蓄水池出液管 #2', '0 MW', 538, 2, 214, 0, {
    pipeLen: 4
  });
  pushBld('pipe_ext_to_crane_s', 'pipe', '精元凝液南送供液管 #2', '0 MW', 540, 2, 235, 90, {
    pipeLen: 42
  });
  pushBld('pipe_ext_to_crane_w', 'pipe', '营养基座进液接驳管 #2', '0 MW', 538, 2, 256, 0, {
    pipeLen: 4
  });
  pushBld('bio_base_crane_2', 'bio_base', '灵木培养基座 #2 (固+液双入)', '10 MW', 536, 2, 256, 0);
  pushBld('incubator_crane_2', 'incubator', '灵木灵草培育仓 #2', '20 MW', 536, 4.0, 256, 0);
  pushBld('belt_crane_herb_2', 'conveyor', '灵草采集传送带 #2', '0 MW', 536, 2, 260, 0, {
    beltLen: 4,
    beltItem: 'MAT_146'
  });
  pushBld('assembler_crane_2', 'assembler', '千纸鹤加工台 #2 (BD_138)', '30 MW', 536, 2, 264, 0);
  pushBld('belt_crane_turn_2', 'conveyor', '纸鹤成品出料带 #2', '0 MW', 536, 2, 268, 0, {
    beltLen: 8,
    beltItem: 'MAT_146'
  });
  pushBld('belt_crane_fuel_2', 'conveyor', '纸鹤灵符供料带 #2', '0 MW', 532, 2, 272, 270, {
    beltLen: 8,
    beltItem: 'MAT_146'
  });

  if (typeof worldBuildings !== 'undefined' && Array.isArray(worldBuildings)) {
    for (let i = 0; i < combatZoneBuildings.length; i++) {
      worldBuildings.push(combatZoneBuildings[i]);
    }
  } else {
    console.warn('[CombatZoneFX] 全局 worldBuildings 不可访问，跳过建筑注入。');
  }

  // ------------------------------------------------------------------
  // 2. 实时战斗与收尸闭环模拟状态
  // ------------------------------------------------------------------
  const stats = {
    activeMonsters: 0,
    kills: 0,
    harvested: 0
  };

  // 北侧 z = 356 三座煞潮裂隙刷怪口 -> 正面 3 条直线进攻路线向南推进 -> z = 294 主防线
  const RIFTS = [
    { x: 420, z: 356 },
    { x: 460, z: 356 },
    { x: 500, z: 356 }
  ];

  const ATTACK_LANES = [
    { startX: 420, startZ: 356, endX: 420, endZ: 298 },
    { startX: 460, startZ: 356, endX: 460, endZ: 298 },
    { startX: 500, startZ: 356, endX: 500, endZ: 298 }
  ];

  // 交战区中央贴地「八卦锁妖减速阵纹带」
  const SLOW_ARRAYS = [
    { x: 420, z: 326, radius: 10.5 },
    { x: 460, z: 326, radius: 10.5 },
    { x: 500, z: 326, radius: 10.5 }
  ];

  const SWORD_TURRETS = swordTurretDefs.map((def, idx) => ({
    x: def.x,
    y: 8.6,
    z: 294,
    ammoType: def.ammoType,
    range: 68,
    cooldown: (idx % 3) * 0.48 + Math.random() * 0.25,
    fireRate: def.ammoType === 'gold' ? 1.45 : (def.ammoType === 'thunder' ? 1.75 : 1.60),
    hp: 100,
    maxHp: 100,
    paralyzed: false
  }));

  const CRANE_BASES = [
    { x: 392, y: 6.5, z: 272 },
    { x: 528, y: 6.5, z: 272 }
  ];

  const PURIFIERS = [
    { x: 390, y: 3.0, z: 252, glowTimer: 0 },
    { x: 530, y: 3.0, z: 252, glowTimer: 0 }
  ];

  const BELT_PATHS = [
    // decon_1 西路: 解构机(390,248) -> 接驳(384,248) -> 生物培养工坊(384,214) -> 成品仓(384,198)
    { startX: 390, endX: 384, startZ: 248, endZ: 248, y: 2.85, color: 0x10b981 },
    { startX: 384, endX: 384, startZ: 248, endZ: 216, y: 2.85, color: 0x10b981 },
    { startX: 384, endX: 384, startZ: 212, endZ: 198, y: 2.85, color: 0x10b981 },
    // decon_1 东路: 碎晶回流至一阶/二阶剑丸产线 (390,248 -> 396,248 -> 396,240 -> 420,240 -> 420/460,249)
    { startX: 390, endX: 396, startZ: 248, endZ: 248, y: 2.85, color: 0x38bdf8 },
    { startX: 396, endX: 396, startZ: 248, endZ: 240, y: 2.85, color: 0x38bdf8 },
    { startX: 396, endX: 420, startZ: 240, endZ: 240, y: 2.85, color: 0x38bdf8 },
    { startX: 420, endX: 420, startZ: 240, endZ: 249, y: 2.85, color: 0x38bdf8 },
    { startX: 420, endX: 460, startZ: 240, endZ: 240, y: 4.05, color: 0xf59e0b },
    { startX: 460, endX: 460, startZ: 240, endZ: 249, y: 3.45, color: 0xf59e0b },
    // decon_2 双路: 解构机(530,248) -> 接驳(524/536,248) -> 推演台 & 提取器
    { startX: 530, endX: 524, startZ: 248, endZ: 248, y: 2.85, color: 0x38bdf8 },
    { startX: 524, endX: 524, startZ: 248, endZ: 226, y: 2.85, color: 0x38bdf8 },
    { startX: 524, endX: 524, startZ: 222, endZ: 215, y: 2.85, color: 0x38bdf8 },
    { startX: 530, endX: 536, startZ: 248, endZ: 248, y: 2.85, color: 0xfbbf24 },
    { startX: 536, endX: 536, startZ: 248, endZ: 226, y: 2.85, color: 0xfbbf24 },
    { startX: 536, endX: 536, startZ: 222, endZ: 215, y: 2.85, color: 0xfbbf24 }
  ];

  // ------------------------------------------------------------------
  // 3. 3D 特效与对象池初始化
  // ------------------------------------------------------------------
  let initialized = false;
  let rootGroup = null;
  let riftGroup = null;
  let combatGroup = null;
  let shaqiGroup = null;

  const riftVisuals = [];
  const corridorArrows = [];
  const slowArrayVisuals = [];
  const ammoBeltPellets = [];
  const purifierHalos = [];
  const beltCubes = [];
  const shaqiMistParticles = [];
  let oreVeinRing = null;
  let waterRippleRing = null;

  const monsterPool = [];
  const swordProjPool = [];
  const enemyShotPool = [];
  const swordBeamPool = [];
  const crossSlashPool = [];
  const lightningPool = [];
  const thunderRingPool = [];
  const fireLotusPool = [];
  const sparkPool = [];
  const dustPool = [];
  const bonePool = [];
  const cranePool = [];
  const cranePulsePool = [];
  const turretAlertVisuals = [];

  let warningLineMat = null;
  let domeMesh = null;
  let domeMat = null;
  let domeRingMat = null;
  let domeFlashTimer = 0;
  let waveTimer = 2.5; // 开场已预生成 16 只煞魔，2.5 秒后补充下一波
  let cullFrustum = null;
  let cullProjMatrix = null;
  let cullSphere = null;

  function init3DScene() {
    if (initialized) return;
    if (!window.World3D || !window.World3D.isReady()) return;
    const THREE = window.THREE;
    const scene = window.World3D.getScene();
    if (!THREE || !scene) return;

    initialized = true;

    rootGroup = new THREE.Group();
    rootGroup.name = 'CombatZoneFXRoot';
    scene.add(rootGroup);

    // 裂隙组独立，远距离 (>260m) 暂停时依然保留裂隙光柱
    riftGroup = new THREE.Group();
    riftGroup.name = 'CombatZoneRifts';
    rootGroup.add(riftGroup);

    combatGroup = new THREE.Group();
    combatGroup.name = 'CombatZoneActiveFX';
    rootGroup.add(combatGroup);

    shaqiGroup = new THREE.Group();
    shaqiGroup.name = 'ShaqiFactoryFX';
    scene.add(shaqiGroup);

    // ---- 共享几何体与材质 ----
    const vortexGeo = new THREE.TorusGeometry(2.8, 0.28, 8, 24);
    const vortexInnerGeo = new THREE.TorusGeometry(1.7, 0.18, 6, 18);
    const pillarGeo = new THREE.CylinderGeometry(1.1, 2.2, 34, 12, 1, true);

    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0xd946ef,
      transparent: true,
      opacity: 0.85
    });
    const vortexInnerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.75
    });
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xc026d3,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // (1) 北侧 3 个煞潮裂隙刷怪口
    RIFTS.forEach((r, idx) => {
      const grp = new THREE.Group();
      grp.position.set(r.x, 0, r.z);

      const outer = new THREE.Mesh(vortexGeo, vortexMat);
      outer.rotation.x = Math.PI / 2;
      outer.position.y = 0.6;

      const inner = new THREE.Mesh(vortexInnerGeo, vortexInnerMat);
      inner.rotation.x = Math.PI / 2;
      inner.position.y = 0.9;

      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.y = 17;

      grp.add(outer, inner, pillar);
      riftGroup.add(grp);
      riftVisuals.push({ outer, inner, pillar, phase: idx * 2.1 });
    });

    // (2) 地面 3 条清晰正面进攻路线引导箭头 (北裂隙 z=356 -> 南防线 z=298)
    const arrowGeo = new THREE.ConeGeometry(0.85, 2.0, 3);
    arrowGeo.rotateX(Math.PI / 2);
    arrowGeo.scale(1.25, 0.14, 1.0);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    ATTACK_LANES.forEach((lane) => {
      const dx = lane.endX - lane.startX;
      const dz = lane.endZ - lane.startZ;
      const dist = Math.hypot(dx, dz);
      const count = Math.max(4, Math.floor(dist / 7));
      const yaw = Math.atan2(dx, dz);
      for (let k = 0; k < count; k++) {
        const arrow = new THREE.Mesh(arrowGeo, arrowMat);
        arrow.rotation.y = yaw;
        combatGroup.add(arrow);
        corridorArrows.push({
          mesh: arrow,
          ax: lane.startX,
          az: lane.startZ,
          bx: lane.endX,
          bz: lane.endZ,
          offset: k / count
        });
      }
    });

    // (2a) 交战区中央贴地「八卦锁妖减速阵纹带」(3 座发光八卦阵盘圆环，怪物经过时减速)
    const baguaOuterGeo = new THREE.RingGeometry(9.6, 10.5, 48);
    baguaOuterGeo.rotateX(-Math.PI / 2);
    const baguaOctGeo = new THREE.RingGeometry(6.8, 7.6, 8);
    baguaOctGeo.rotateX(-Math.PI / 2);
    const baguaInnerGeo = new THREE.RingGeometry(3.2, 3.8, 24);
    baguaInnerGeo.rotateX(-Math.PI / 2);
    const baguaCoreGeo = new THREE.RingGeometry(0.8, 1.5, 16);
    baguaCoreGeo.rotateX(-Math.PI / 2);
    const baguaSpokeGeo = new THREE.PlaneGeometry(0.28, 6.4);
    baguaSpokeGeo.rotateX(-Math.PI / 2);

    const baguaOuterMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const baguaOctMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const baguaGoldMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    SLOW_ARRAYS.forEach((sa, idx) => {
      const grp = new THREE.Group();
      grp.position.set(sa.x, 0.16, sa.z);

      const outerRing = new THREE.Mesh(baguaOuterGeo, baguaOuterMat);
      const octRing = new THREE.Mesh(baguaOctGeo, baguaOctMat);
      const innerRing = new THREE.Mesh(baguaInnerGeo, baguaGoldMat);
      const coreRing = new THREE.Mesh(baguaCoreGeo, baguaOuterMat);

      const spokeGrp = new THREE.Group();
      for (let s = 0; s < 8; s++) {
        const spoke = new THREE.Mesh(baguaSpokeGeo, baguaOctMat);
        const angle = (s / 8) * Math.PI * 2;
        spoke.position.set(Math.sin(angle) * 6.4, 0.01, Math.cos(angle) * 6.4);
        spoke.rotation.y = angle;
        spokeGrp.add(spoke);
      }

      grp.add(outerRing, octRing, innerRing, coreRing, spokeGrp);
      combatGroup.add(grp);
      slowArrayVisuals.push({
        grp,
        outerRing,
        octRing,
        innerRing,
        spokeGrp,
        phase: idx * 1.7
      });
    });

    // 细发光警戒线 (z = 297.5, x: 410..510)
    const warnPts = [
      new THREE.Vector3(410, 0.18, 297.5),
      new THREE.Vector3(510, 0.18, 297.5)
    ];
    const warnGeo = new THREE.BufferGeometry().setFromPoints(warnPts);
    warningLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    const warningLine = new THREE.Line(warnGeo, warningLineMat);
    combatGroup.add(warningLine);

    // (2a-2) 护山大阵天幕护盾：青金半透明网格穹顶 + 底部流光环 (中心 460, 2, 294)
    const domeGeo = new THREE.SphereGeometry(52, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.36);
    domeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.07,
      wireframe: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.set(460, 2, 294);
    combatGroup.add(domeMesh);

    const domeRimRadius = 52 * Math.sin(Math.PI * 0.36);
    const domeRimY = 2 + 52 * Math.cos(Math.PI * 0.36);
    const domeRingGeo = new THREE.TorusGeometry(domeRimRadius, 0.22, 6, 48);
    domeRingGeo.rotateX(Math.PI / 2);
    domeRingMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const domeRing = new THREE.Mesh(domeRingGeo, domeRingMat);
    domeRing.position.set(460, domeRimY, 294);
    combatGroup.add(domeRing);

    // (2a-3) 原生荒地实景设施：玄铁矿脉晶簇(420,0,200)、灵泉水域(472,0.15,202)、高架输电灵线(520,9,202 -> pwr_2 -> pwr_1 -> 护山大阵)
    // 1. 玄铁矿脉 3D 金属发光岩簇 (420, 0, 200)
    const oreCluster = new THREE.Group();
    oreCluster.position.set(420, 0, 200);
    const orePad = new THREE.Mesh(
      new THREE.CylinderGeometry(3.8, 4.6, 0.34, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.72, metalness: 0.45, emissive: 0x0f172a, emissiveIntensity: 0.35 })
    );
    orePad.position.y = 0.17;
    oreCluster.add(orePad);

    const oreCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.78,
      roughness: 0.22,
      emissive: 0x0284c7,
      emissiveIntensity: 0.85
    });
    const oreIronMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.85,
      roughness: 0.32,
      emissive: 0x1e293b,
      emissiveIntensity: 0.35
    });
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * Math.PI * 2;
      const rad = 2.3 + (k % 2) * 0.95;
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.68 + (k % 3) * 0.24, 0),
        k % 2 === 0 ? oreCrystalMat : oreIronMat
      );
      shard.position.set(Math.cos(ang) * rad, 0.65 + (k % 3) * 0.28, Math.sin(ang) * rad);
      shard.rotation.set(0.3 * k, k * 0.8, 0.2 * k);
      oreCluster.add(shard);
    }
    oreVeinRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.1, 0.1, 6, 28),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.68 })
    );
    oreVeinRing.rotation.x = Math.PI / 2;
    oreVeinRing.position.y = 0.38;
    oreCluster.add(oreVeinRing);
    combatGroup.add(oreCluster);

    // 矿脉传送带斜坡支撑柱 (z = 202..211)
    const rampSupportMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.45 });
    [203, 206, 209].forEach((rz) => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.0, 0.32), rampSupportMat);
      col.position.set(420, 1.0, rz);
      combatGroup.add(col);
    });

    // 2. 灵泉水域 3D 发光青蓝水潭 (x = 472, y = 0.15, z = 202)
    const poolGeo = new THREE.CircleGeometry(5.8, 32);
    poolGeo.rotateX(-Math.PI / 2);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.85,
      roughness: 0.12,
      metalness: 0.25,
      transparent: true,
      opacity: 0.82
    });
    const poolMesh = new THREE.Mesh(poolGeo, poolMat);
    poolMesh.position.set(472, 0.15, 202);
    combatGroup.add(poolMesh);

    const poolRim = new THREE.Mesh(
      new THREE.TorusGeometry(5.9, 0.36, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, metalness: 0.3, emissive: 0x0e7490, emissiveIntensity: 0.35 })
    );
    poolRim.rotation.x = Math.PI / 2;
    poolRim.position.set(472, 0.18, 202);
    combatGroup.add(poolRim);

    const waterRippleGeo = new THREE.RingGeometry(2.1, 2.45, 28);
    waterRippleGeo.rotateX(-Math.PI / 2);
    waterRippleRing = new THREE.Mesh(
      waterRippleGeo,
      new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    waterRippleRing.position.set(472, 0.22, 202);
    combatGroup.add(waterRippleRing);

    // 抽水机 (472,0,202) 与 平台上输水管 (472,2,226) 垂直立管弯头衔接
    const pipeRiser = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.9, 12),
      new THREE.MeshStandardMaterial({ color: 0x0e2236, metalness: 0.6, roughness: 0.35, emissive: 0x0284c7, emissiveIntensity: 0.4 })
    );
    pipeRiser.position.set(472, 1.85, 203.8);
    combatGroup.add(pipeRiser);

    // 3. 无电线设计：建筑依托地基/平台自动通电（不生成架空输电线）

    // 4. 独立西南煞气工厂超大紫色煞气域 (-360, 360)：外扩 130x130m 紫色原生煞地 + 平台顶面紫晶渗层 + 72 团全区上升紫气
    const shaqiOuterGround = new THREE.Mesh(
      new THREE.BoxGeometry(130, 0.36, 130),
      new THREE.MeshStandardMaterial({
        color: 0x3b0764,
        roughness: 0.78,
        metalness: 0.12,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.62
      })
    );
    shaqiOuterGround.position.set(-360, 0.22, 360);
    shaqiGroup.add(shaqiOuterGround);

    const shaqiDeckOverlay = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshBasicMaterial({
        color: 0x9333ea,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    shaqiDeckOverlay.rotation.x = -Math.PI / 2;
    shaqiDeckOverlay.position.set(-360, 2.24, 360);
    shaqiGroup.add(shaqiDeckOverlay);

    [44, 62].forEach((r, idx) => {
      const shaqiBorderRing = new THREE.Mesh(
        new THREE.RingGeometry(r - 1.4, r, 64),
        new THREE.MeshBasicMaterial({
          color: idx === 0 ? 0xc084fc : 0xa855f7,
          transparent: true,
          opacity: idx === 0 ? 0.78 : 0.62,
          side: THREE.DoubleSide
        })
      );
      shaqiBorderRing.rotation.x = -Math.PI / 2;
      shaqiBorderRing.position.set(-360, idx === 0 ? 2.28 : 0.45, 360);
      shaqiGroup.add(shaqiBorderRing);
    });

    const shaqiMistGeo = new THREE.SphereGeometry(1.35, 8, 8);
    const shaqiVents = [
      { x: -384, z: 334 },
      { x: -372, z: 334 },
      { x: -358, z: 354 },
      { x: -340, z: 368 },
      { x: -368, z: 378 },
      { x: -405, z: 315 },
      { x: -315, z: 315 },
      { x: -405, z: 405 },
      { x: -315, z: 405 }
    ];
    shaqiVents.forEach((v, idx) => {
      const ventMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2.1, 0.5, 10),
        new THREE.MeshBasicMaterial({ color: 0xa855f7 })
      );
      ventMesh.position.set(v.x, idx < 5 ? 2.30 : 0.48, v.z);
      shaqiGroup.add(ventMesh);
    });
    for (let i = 0; i < 72; i++) {
      const gx = -410 + (i % 9) * 12.5 + Math.sin(i * 1.9) * 3.5;
      const gz = 310 + Math.floor(i / 9) * 12.5 + Math.cos(i * 1.5) * 3.5;
      const mistMat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xa855f7 : (i % 3 === 1 ? 0xc084fc : 0x9333ea),
        transparent: true,
        opacity: 0.62
      });
      const mist = new THREE.Mesh(shaqiMistGeo, mistMat);
      mist.position.set(gx, 2.6, gz);
      shaqiGroup.add(mist);
      shaqiMistParticles.push({
        mesh: mist,
        mat: mistMat,
        baseX: gx,
        baseZ: gz,
        phase: (i / 72)
      });
    }

    // (2b) 9 条供弹传送带上方流动的发光剑丸小球 (金 / 雷青 / 火红 三色源源不断流进炮塔尾部)
    const pelletGeo = new THREE.SphereGeometry(0.32, 10, 10);
    const pelletHaloGeo = new THREE.RingGeometry(0.32, 0.52, 12);
    pelletHaloGeo.rotateX(-Math.PI / 2);
    const pelletMats = {
      gold: new THREE.MeshBasicMaterial({ color: 0xfde047 }),
      thunder: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      fire: new THREE.MeshBasicMaterial({ color: 0xff4d2e })
    };
    const pelletHaloMats = {
      gold: new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      thunder: new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      }),
      fire: new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    };

    // 炼宝台之前 (z=216..250): 中性矿石方块 (钢灰/铜橙/青晶); 炼宝台之后 (z=250..294): 发光成品剑丸小球 (金/火红/雷青)
    const oreCubeGeo = new THREE.BoxGeometry(0.40, 0.32, 0.40);
    const oreMats = {
      gold: new THREE.MeshBasicMaterial({ color: 0x94a3b8 }),
      fire: new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
      thunder: new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    };
    const talismanMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });

    // 总矿脉上平台三路分流干线 + 发电机供煤带流动矿石方块
    const MAIN_ORE_TRUNK = [
      { startX: 420, endX: 420, startZ: 200, endZ: 212, startY: 0.95, endY: 2.85, count: 4, offset: 0.02, matKey: 'gold' },
      { startX: 420, endX: 420, startZ: 212, endZ: 222, startY: 2.85, endY: 2.85, count: 3, offset: 0.06, matKey: 'gold' },
      { startX: 420, endX: 420, startZ: 222, endZ: 226, startY: 2.85, endY: 2.85, count: 2, offset: 0.09, matKey: 'gold' },
      { startX: 420, endX: 460, startZ: 222, endZ: 222, startY: 2.85, endY: 2.85, count: 6, offset: 0.11, matKey: 'fire' },
      { startX: 460, endX: 460, startZ: 222, endZ: 226, startY: 2.85, endY: 2.85, count: 2, offset: 0.14, matKey: 'fire' },
      { startX: 460, endX: 500, startZ: 222, endZ: 222, startY: 2.85, endY: 2.85, count: 6, offset: 0.17, matKey: 'thunder' },
      { startX: 500, endX: 500, startZ: 222, endZ: 226, startY: 2.85, endY: 2.85, count: 2, offset: 0.21, matKey: 'thunder' },
      { startX: 500, endX: 519, startZ: 222, endZ: 222, startY: 2.85, endY: 2.85, count: 4, offset: 0.24, matKey: 'gold' },
      { startX: 519, endX: 519, startZ: 222, endZ: 205, startY: 2.85, endY: 1.05, count: 4, offset: 0.28, matKey: 'gold' }
    ];
    MAIN_ORE_TRUNK.forEach((seg) => {
      for (let p = 0; p < seg.count; p++) {
        const cube = new THREE.Mesh(oreCubeGeo, oreMats[seg.matKey]);
        cube.position.set(seg.startX, seg.startY, seg.startZ);
        combatGroup.add(cube);
        ammoBeltPellets.push({
          mesh: cube,
          startX: seg.startX,
          endX: seg.endX,
          startZ: seg.startZ,
          endZ: seg.endZ,
          startY: seg.startY,
          endY: seg.endY,
          y: seg.startY,
          phase: (p / seg.count) + seg.offset
        });
      }
    });

    TURRET_GROUPS.forEach((grp, gIdx) => {
      const cx = grp.centerX;
      // 炼宝台之前各段 (分流 -> 直连并行进料带 cx-3 / cx+3 -> 炼宝台): 中性矿石方块
      const ORE_SEGMENTS = [
        { startX: cx, endX: cx - 6, startZ: 226, endZ: 226, count: 3, offset: 0.11 },
        { startX: cx - 6, endX: cx - 6, startZ: 226, endZ: 232, count: 3, offset: 0.16 },
        { startX: cx - 3, endX: cx - 3, startZ: 232, endZ: 249, count: 4, offset: 0.08 }
      ];
      if (grp.key === 'gold') {
        ORE_SEGMENTS.push(
          { startX: cx, endX: cx + 6, startZ: 226, endZ: 226, count: 3, offset: 0.18 },
          { startX: cx + 6, endX: cx + 6, startZ: 226, endZ: 232, count: 3, offset: 0.22 },
          { startX: cx + 3, endX: cx + 3, startZ: 232, endZ: 249, count: 4, offset: 0.16 }
        );
      } else if (grp.key === 'fire') {
        // 灵泉抽水机(472,0,202) -> 长输水管道(472,2,226, pipeLen:44) -> fluid_hub_fire(472,2,250)
        ORE_SEGMENTS.push(
          { startX: 472, endX: 472, startZ: 204, endZ: 248, count: 6, offset: 0.19 }
        );
      } else {
        ORE_SEGMENTS.push(
          { startX: cx, endX: cx + 12, startZ: 226, endZ: 226, count: 3, offset: 0.15 },
          { startX: cx + 12, endX: cx + 12, startZ: 226, endZ: 232, count: 3, offset: 0.19 },
          { startX: cx + 12, endX: cx + 12, startZ: 233, endZ: 249, count: 4, offset: 0.23 }
        );
      }
      ORE_SEGMENTS.forEach((seg) => {
        for (let p = 0; p < seg.count; p++) {
          const cube = new THREE.Mesh(oreCubeGeo, oreMats[grp.key]);
          cube.position.set(seg.startX, 2.85, seg.startZ);
          combatGroup.add(cube);
          ammoBeltPellets.push({
            mesh: cube,
            startX: seg.startX,
            endX: seg.endX,
            startZ: seg.startZ,
            endZ: seg.endZ,
            y: 2.85,
            phase: (p / seg.count) + gIdx * 0.13 + seg.offset
          });
        }
      });

      // 炼宝台之后各段 (炼宝台 250 -> 分流 260 -> 总仓 270 -> 分流 280): 发光成品剑丸小球
      const PILL_SEGMENTS = [
        { startZ: 250, endZ: 260, count: 3, offset: 0.07 },
        { startZ: 260, endZ: 270, count: 3, offset: 0.17 },
        { startZ: 270.5, endZ: 279.5, count: 3, offset: 0.27 }
      ];
      PILL_SEGMENTS.forEach((seg) => {
        for (let p = 0; p < seg.count; p++) {
          const pGrp = new THREE.Group();
          const ball = new THREE.Mesh(pelletGeo, pelletMats[grp.key]);
          const pHalo = new THREE.Mesh(pelletHaloGeo, pelletHaloMats[grp.key]);
          pHalo.position.y = -0.18;
          pGrp.add(ball, pHalo);
          pGrp.position.set(cx, 2.85, seg.startZ);
          combatGroup.add(pGrp);
          ammoBeltPellets.push({
            mesh: pGrp,
            x: cx,
            y: 2.85,
            startZ: seg.startZ,
            endZ: seg.endZ,
            phase: (p / seg.count) + gIdx * 0.13 + seg.offset
          });
        }
      });
    });

    // 纸鹤赋能台灵木培养 -> 加工折制 -> 供料带 (384,256->264->272->392; 536,256->264->272->528) + 炼宝台侧向流体水管
    const CRANE_FUEL_BELTS = [
      { startX: 384, endX: 384, startZ: 257, endZ: 264, count: 3, offset: 0.04 },
      { startX: 384, endX: 384, startZ: 265, endZ: 272, count: 3, offset: 0.08 },
      { startX: 384.5, endX: 391.5, startZ: 272, endZ: 272, count: 3, offset: 0.12 },
      { startX: 536, endX: 536, startZ: 257, endZ: 264, count: 3, offset: 0.22 },
      { startX: 536, endX: 536, startZ: 265, endZ: 272, count: 3, offset: 0.28 },
      { startX: 535.5, endX: 528.5, startZ: 272, endZ: 272, count: 3, offset: 0.35 },
      { startX: 471, endX: 463, startZ: 250, endZ: 250, count: 3, offset: 0.2 },
      { startX: 511, endX: 503, startZ: 250, endZ: 250, count: 3, offset: 0.45 }
    ];
    CRANE_FUEL_BELTS.forEach((fb) => {
      for (let p = 0; p < fb.count; p++) {
        const cube = new THREE.Mesh(oreCubeGeo, talismanMat);
        cube.position.set(fb.startX, 2.85, fb.startZ);
        combatGroup.add(cube);
        ammoBeltPellets.push({
          mesh: cube,
          startX: fb.startX,
          endX: fb.endX,
          startZ: fb.startZ,
          endZ: fb.endZ,
          y: 2.85,
          phase: (p / fb.count) + fb.offset
        });
      }
    });

    // 三阶串联升级传送带 (Stage 1->2: 420->440->440->463->463,249 金丸; Stage 2->3: 460->480->480->503->503,249 火丸)
    const SERIAL_UPGRADE_SEGMENTS = [
      { key: 'gold', startX: 420, endX: 440, startZ: 260, endZ: 260, count: 4, offset: 0.05 },
      { key: 'gold', startX: 440, endX: 440, startZ: 260, endZ: 241, count: 5, offset: 0.14 },
      { key: 'gold', startX: 440, endX: 463, startZ: 241, endZ: 241, count: 5, offset: 0.23 },
      { key: 'gold', startX: 463, endX: 463, startZ: 241, endZ: 249, count: 4, offset: 0.31 },
      { key: 'fire', startX: 460, endX: 480, startZ: 260, endZ: 260, count: 4, offset: 0.09 },
      { key: 'fire', startX: 480, endX: 480, startZ: 260, endZ: 241, count: 5, offset: 0.18 },
      { key: 'fire', startX: 480, endX: 503, startZ: 241, endZ: 241, count: 5, offset: 0.27 },
      { key: 'fire', startX: 503, endX: 503, startZ: 241, endZ: 249, count: 4, offset: 0.35 }
    ];
    SERIAL_UPGRADE_SEGMENTS.forEach((seg) => {
      for (let p = 0; p < seg.count; p++) {
        const pGrp = new THREE.Group();
        const ball = new THREE.Mesh(pelletGeo, pelletMats[seg.key]);
        const pHalo = new THREE.Mesh(pelletHaloGeo, pelletHaloMats[seg.key]);
        pHalo.position.y = -0.18;
        pGrp.add(ball, pHalo);
        pGrp.position.set(seg.startX, 2.85, seg.startZ);
        combatGroup.add(pGrp);
        ammoBeltPellets.push({
          mesh: pGrp,
          startX: seg.startX,
          endX: seg.endX,
          startZ: seg.startZ,
          endZ: seg.endZ,
          y: 2.85,
          phase: (p / seg.count) + seg.offset
        });
      }
    });

    // 9 条纵向供弹带 (z = 280 -> 293.5) 上流进炮塔尾部的剑丸小球
    SWORD_TURRETS.forEach((tur, tIdx) => {
      for (let p = 0; p < 4; p++) {
        const pGrp = new THREE.Group();
        const ball = new THREE.Mesh(pelletGeo, pelletMats[tur.ammoType]);
        const pHalo = new THREE.Mesh(pelletHaloGeo, pelletHaloMats[tur.ammoType]);
        pHalo.position.y = -0.18;
        pGrp.add(ball, pHalo);
        pGrp.position.set(tur.x, 2.85, 280);
        combatGroup.add(pGrp);
        ammoBeltPellets.push({
          mesh: pGrp,
          x: tur.x,
          y: 2.85,
          startZ: 280,
          endZ: 293.5,
          phase: (p / 4) + (tIdx % 3) * 0.11
        });
      }
    });

    // 拆解台绿光环 (位于 wy = 2 平台之上)
    const haloGeo = new THREE.RingGeometry(2.2, 3.2, 20);
    haloGeo.rotateX(-Math.PI / 2);
    PURIFIERS.forEach((p) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const halo = new THREE.Mesh(haloGeo, mat);
      halo.position.set(p.x, 2.25, p.z);
      combatGroup.add(halo);
      purifierHalos.push({ mesh: halo, mat });
    });

    // 解构机双路输出与碎晶回流传送带上流动的灵匣方块
    const lootCubeGeo = new THREE.BoxGeometry(0.46, 0.36, 0.46);
    BELT_PATHS.forEach((bp, bpIdx) => {
      const mat = new THREE.MeshBasicMaterial({ color: bp.color || 0xa855f7 });
      const span = Math.hypot((bp.endX - bp.startX), (bp.endZ - bp.startZ));
      const count = span > 20 ? 5 : 3;
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(lootCubeGeo, mat);
        mesh.position.set(bp.startX, bp.y, bp.startZ);
        combatGroup.add(mesh);
        beltCubes.push({
          mesh,
          startX: bp.startX,
          endX: bp.endX,
          startZ: bp.startZ,
          endZ: bp.endZ,
          y: bp.y,
          phase: (i / count) + bpIdx * 0.07
        });
      }
    });

    // (3) 敌方修士对象池 (人形宗门道袍 + 护肩 + 道冠发髻 + 悬空飞剑；金丹敌宗长老配赤金道袍与背后神光环)
    const cultRobeGeo = new THREE.CylinderGeometry(0.24, 0.44, 1.08, 8);
    const cultMantleGeo = new THREE.BoxGeometry(0.76, 0.16, 0.28);
    const cultHeadGeo = new THREE.SphereGeometry(0.22, 10, 8);
    const cultCrownGeo = new THREE.ConeGeometry(0.13, 0.26, 6);
    const cultSwordGeo = new THREE.BoxGeometry(0.10, 0.04, 1.15);
    const cultHaloGeo = new THREE.TorusGeometry(0.55, 0.05, 6, 18);

    const monsterBodyMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      roughness: 0.55,
      metalness: 0.22,
      emissive: 0x4338ca,
      emissiveIntensity: 0.42
    });
    const bossBodyMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.42,
      metalness: 0.38,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.62
    });
    const cultMantleMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.5,
      metalness: 0.3
    });
    const bossMantleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.65,
      emissive: 0xb45309,
      emissiveIntensity: 0.35
    });
    const cultHeadMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.65,
      metalness: 0.05
    });
    const cultCrownMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.4,
      metalness: 0.4
    });
    const cultSwordMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const bossSwordMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const cultHaloMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const monsterAuraGeo = new THREE.RingGeometry(0.82, 1.28, 24);
    monsterAuraGeo.rotateX(-Math.PI / 2);
    const monsterAuraMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const bossAuraMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const hpBgGeo = new THREE.PlaneGeometry(1.42, 0.18);
    const hpBgMat = new THREE.MeshBasicMaterial({
      color: 0x160524,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const hpFillGeo = new THREE.PlaneGeometry(1.34, 0.12);
    const hpFillMat = new THREE.MeshBasicMaterial({
      color: 0xff2e63,
      side: THREE.DoubleSide
    });
    const bossHpFillMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 48; i++) {
      const grp = new THREE.Group();
      const body = new THREE.Mesh(cultRobeGeo, monsterBodyMat);
      body.position.y = 0.62;

      const mantle = new THREE.Mesh(cultMantleGeo, cultMantleMat);
      mantle.position.set(0, 1.12, 0);

      const head = new THREE.Mesh(cultHeadGeo, cultHeadMat);
      head.position.set(0, 1.38, 0);

      const crown = new THREE.Mesh(cultCrownGeo, cultCrownMat);
      crown.position.set(0, 1.66, 0);

      // 身侧悬空飞剑
      const flySword = new THREE.Mesh(cultSwordGeo, cultSwordMat);
      flySword.position.set(0.56, 1.05, 0.12);
      flySword.rotation.x = 0.12;

      // 金丹敌宗长老专属：背后赤金神光环
      const haloRing = new THREE.Mesh(cultHaloGeo, cultHaloMat);
      haloRing.position.set(0, 1.25, -0.32);
      haloRing.visible = false;

      // 脚下灵气光环
      const aura = new THREE.Mesh(monsterAuraGeo, monsterAuraMat);
      aura.position.y = 0.08;

      // 头顶发光血条
      const hpGroup = new THREE.Group();
      hpGroup.position.set(0, 2.25, 0);
      const hpBg = new THREE.Mesh(hpBgGeo, hpBgMat);
      const hpFill = new THREE.Mesh(hpFillGeo, hpFillMat);
      hpFill.position.z = 0.01;
      hpGroup.add(hpBg, hpFill);

      grp.add(body, mantle, head, crown, flySword, haloRing, aura, hpGroup);
      grp.scale.setScalar(2.4);
      grp.visible = false;
      combatGroup.add(grp);

      monsterPool.push({
        active: false,
        isBoss: false,
        baseScale: 2.4,
        mesh: grp,
        body,
        mantle,
        flySword,
        haloRing,
        aura,
        hpGroup,
        hpFill,
        monsterBodyMat,
        bossBodyMat,
        cultMantleMat,
        bossMantleMat,
        cultSwordMat,
        bossSwordMat,
        monsterAuraMat,
        bossAuraMat,
        hpFillMat,
        bossHpFillMat,
        x: 0,
        y: 0,
        z: 0,
        hp: 0,
        maxHp: 160,
        speed: 2.8,
        laneIndex: 0,
        fireCooldown: 1.5 + Math.random() * 2.0,
        phase: i * 0.5
      });
    }

    // (4) 三色剑丸弹药对象池 (庚金/天雷/赤炎飞剑弹 + 激光剑气束 + 庚金十字斩)
    const swordBladeGeo = new THREE.ConeGeometry(0.22, 1.65, 5);
    swordBladeGeo.rotateX(Math.PI / 2);
    const swordTrailGeo = new THREE.CylinderGeometry(0.09, 0.02, 2.6, 6);
    swordTrailGeo.rotateX(Math.PI / 2);

    const swordBladeMats = {
      gold: new THREE.MeshBasicMaterial({ color: 0xfde047, blending: THREE.AdditiveBlending }),
      thunder: new THREE.MeshBasicMaterial({ color: 0x38bdf8, blending: THREE.AdditiveBlending }),
      fire: new THREE.MeshBasicMaterial({ color: 0xff4d2e, blending: THREE.AdditiveBlending })
    };
    const swordTrailMats = {
      gold: new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      thunder: new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      fire: new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    };

    for (let i = 0; i < 48; i++) {
      const grp = new THREE.Group();
      const blade = new THREE.Mesh(swordBladeGeo, swordBladeMats.gold);
      const trail = new THREE.Mesh(swordTrailGeo, swordTrailMats.gold);
      trail.position.z = -1.5;
      grp.add(blade, trail);
      grp.scale.setScalar(2.4);
      grp.visible = false;
      combatGroup.add(grp);

      swordProjPool.push({
        active: false,
        ammoType: 'gold',
        mesh: grp,
        blade,
        trail,
        swordBladeMats,
        swordTrailMats,
        x: 0,
        y: 0,
        z: 0,
        targetIdx: -1,
        tx: 0,
        ty: 2.4,
        tz: 0,
        speed: 16,
        damage: 30,
        life: 0
      });
    }

    // 剑丸塔直连目标的激光剑气束 (庚金剑虹 / 赤炎丹火)
    const swordBeamOuterGeo = new THREE.CylinderGeometry(0.28, 0.28, 1, 8, 1, true);
    swordBeamOuterGeo.rotateX(Math.PI / 2);
    const swordBeamCoreGeo = new THREE.CylinderGeometry(0.11, 0.11, 1, 6, 1, true);
    swordBeamCoreGeo.rotateX(Math.PI / 2);
    const swordBeamOuterMats = {
      gold: new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      fire: new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    };
    const swordBeamCoreMats = {
      gold: new THREE.MeshBasicMaterial({
        color: 0xfef9c3,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      fire: new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    };

    for (let i = 0; i < 24; i++) {
      const grp = new THREE.Group();
      const outer = new THREE.Mesh(swordBeamOuterGeo, swordBeamOuterMats.gold);
      const core = new THREE.Mesh(swordBeamCoreGeo, swordBeamCoreMats.gold);
      grp.add(outer, core);
      grp.visible = false;
      combatGroup.add(grp);

      swordBeamPool.push({
        active: false,
        mesh: grp,
        outer,
        core,
        swordBeamOuterMats,
        swordBeamCoreMats,
        sx: 0, sy: 0, sz: 0,
        ex: 0, ey: 0, ez: 0,
        life: 0,
        maxLife: 0.22
      });
    }

    // 庚金破甲十字斩光效对象池
    const crossSlashGeo = new THREE.PlaneGeometry(4.2, 0.48);
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const grp = new THREE.Group();
      const slashA = new THREE.Mesh(crossSlashGeo, mat);
      slashA.rotation.z = Math.PI / 4;
      const slashB = new THREE.Mesh(crossSlashGeo, mat);
      slashB.rotation.z = -Math.PI / 4;
      grp.add(slashA, slashB);
      grp.visible = false;
      combatGroup.add(grp);

      crossSlashPool.push({
        active: false,
        mesh: grp,
        mat,
        life: 0,
        maxLife: 0.28
      });
    }

    // (4b) 敌方修士远程反击绯红剑气池 (18 发)
    const enemyBladeGeo = new THREE.ConeGeometry(0.24, 1.85, 5);
    enemyBladeGeo.rotateX(Math.PI / 2);
    const enemyTailGeo = new THREE.CylinderGeometry(0.10, 0.02, 2.4, 6);
    enemyTailGeo.rotateX(Math.PI / 2);
    const enemyShotCoreMat = new THREE.MeshBasicMaterial({
      color: 0xff2a6d,
      blending: THREE.AdditiveBlending
    });
    const enemyShotGlowMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    for (let i = 0; i < 18; i++) {
      const grp = new THREE.Group();
      const core = new THREE.Mesh(enemyBladeGeo, enemyShotCoreMat);
      const tail = new THREE.Mesh(enemyTailGeo, enemyShotGlowMat);
      tail.position.z = -1.4;
      grp.add(core, tail);
      grp.scale.setScalar(1.9);
      grp.visible = false;
      combatGroup.add(grp);

      enemyShotPool.push({
        active: false,
        mesh: grp,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        targetTurretIdx: 0,
        life: 0
      });
    }

    // (4c) 防御塔瘫痪告警指示器 (红色脉冲光环 + 升腾暗红浓烟)
    const alertRingGeo = new THREE.RingGeometry(1.4, 2.35, 22);
    alertRingGeo.rotateX(-Math.PI / 2);
    const alertRingMat = new THREE.MeshBasicMaterial({
      color: 0xff2a6d,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const smokePuffGeo = new THREE.DodecahedronGeometry(0.52, 0);
    const smokePuffMat = new THREE.MeshBasicMaterial({
      color: 0x881337,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    SWORD_TURRETS.forEach((tur, idx) => {
      const grp = new THREE.Group();
      grp.position.set(tur.x, 0, tur.z);

      const ring = new THREE.Mesh(alertRingGeo, alertRingMat);
      ring.position.y = tur.y + 0.2;
      grp.add(ring);

      const puffs = [];
      for (let p = 0; p < 3; p++) {
        const puff = new THREE.Mesh(smokePuffGeo, smokePuffMat);
        puff.position.set(0, tur.y + 0.5, 0);
        grp.add(puff);
        puffs.push({
          mesh: puff,
          offset: p / 3,
          driftX: (p - 1) * 0.45
        });
      }

      grp.visible = false;
      combatGroup.add(grp);
      turretAlertVisuals.push({
        grp,
        ring,
        puffs,
        phase: idx * 0.9
      });
    });

    // (5) 天雷 3 股粗壮青紫色雷霆电弧 + 落地连锁雷环炸裂
    const BOLT_SEGMENTS = 6;
    const thunderSegGeo = new THREE.CylinderGeometry(0.20, 0.20, 1, 6, 1, true);
    thunderSegGeo.rotateX(Math.PI / 2);
    const thunderBoltMats = [
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.90,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }),
      new THREE.MeshBasicMaterial({
        color: 0xa5f3fc,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    ];

    for (let i = 0; i < 18; i++) {
      const grp = new THREE.Group();
      const strands = [];
      for (let s = 0; s < 3; s++) {
        const segMeshes = [];
        for (let k = 0; k < BOLT_SEGMENTS; k++) {
          const segMesh = new THREE.Mesh(thunderSegGeo, thunderBoltMats[s]);
          grp.add(segMesh);
          segMeshes.push(segMesh);
        }
        strands.push(segMeshes);
      }
      grp.visible = false;
      combatGroup.add(grp);

      lightningPool.push({
        active: false,
        mesh: grp,
        strands,
        segments: BOLT_SEGMENTS,
        sx: 0, sy: 0, sz: 0,
        ex: 0, ey: 0, ez: 0,
        life: 0,
        maxLife: 0.24
      });
    }

    const thunderRingGeo = new THREE.RingGeometry(1.5, 3.8, 24);
    thunderRingGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xa855f7 : 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const ring = new THREE.Mesh(thunderRingGeo, mat);
      ring.visible = false;
      combatGroup.add(ring);
      thunderRingPool.push({
        active: false,
        mesh: ring,
        mat,
        life: 0,
        maxLife: 0.32
      });
    }

    // (5b) 赤炎落地赤红火莲爆炸环对象池
    const fireLotusOuterGeo = new THREE.RingGeometry(1.4, 3.6, 24);
    fireLotusOuterGeo.rotateX(-Math.PI / 2);
    const fireLotusInnerGeo = new THREE.RingGeometry(0.5, 1.5, 12);
    fireLotusInnerGeo.rotateX(-Math.PI / 2);
    const firePetalGeo = new THREE.PlaneGeometry(1.0, 2.1);
    for (let i = 0; i < 18; i++) {
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0xff3b1f,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const grp = new THREE.Group();
      const outerRing = new THREE.Mesh(fireLotusOuterGeo, outerMat);
      const innerRing = new THREE.Mesh(fireLotusInnerGeo, innerMat);
      grp.add(outerRing, innerRing);
      for (let p = 0; p < 6; p++) {
        const petal = new THREE.Mesh(firePetalGeo, outerMat);
        const angle = (p / 6) * Math.PI * 2;
        petal.position.set(Math.sin(angle) * 1.45, 0.55, Math.cos(angle) * 1.45);
        petal.rotation.y = angle;
        petal.rotation.x = -0.65;
        grp.add(petal);
      }
      grp.visible = false;
      combatGroup.add(grp);
      fireLotusPool.push({
        active: false,
        mesh: grp,
        outerMat,
        innerMat,
        life: 0,
        maxLife: 0.38
      });
    }

    // (6) 命中火花对象池
    const sparkGeo = new THREE.OctahedronGeometry(0.22, 0);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    for (let i = 0; i < 48; i++) {
      const mesh = new THREE.Mesh(sparkGeo, sparkMat);
      mesh.visible = false;
      combatGroup.add(mesh);
      sparkPool.push({
        active: false,
        mesh,
        vx: 0, vy: 0, vz: 0,
        life: 0,
        maxLife: 0.25
      });
    }

    // (7) 死亡紫色烟尘对象池
    const dustGeo = new THREE.DodecahedronGeometry(0.55, 0);
    const dustMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    for (let i = 0; i < 32; i++) {
      const mesh = new THREE.Mesh(dustGeo, dustMat);
      mesh.visible = false;
      combatGroup.add(mesh);
      dustPool.push({
        active: false,
        mesh,
        vx: 0, vy: 0, vz: 0,
        life: 0,
        maxLife: 0.65
      });
    }

    // (8) 发光【敌修储物袋】掉落物对象池 (金翠锦囊 + 束口金环 + 发光符箓封条)
    const pouchBodyGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.56, 8);
    const pouchNeckGeo = new THREE.TorusGeometry(0.24, 0.06, 6, 12);
    pouchNeckGeo.rotateX(Math.PI / 2);
    const pouchTopGeo = new THREE.ConeGeometry(0.28, 0.22, 8);
    pouchTopGeo.rotateX(Math.PI);
    const pouchSealGeo = new THREE.BoxGeometry(0.18, 0.28, 0.06);

    const pouchJadeMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      emissive: 0x10b981,
      emissiveIntensity: 0.65,
      roughness: 0.35,
      metalness: 0.25
    });
    const pouchGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.72,
      roughness: 0.25,
      metalness: 0.75
    });
    const pouchSealMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const chestRingGeo = new THREE.RingGeometry(0.62, 0.98, 18);
    chestRingGeo.rotateX(-Math.PI / 2);
    const chestRingMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    function buildLootChestMesh(scaleVal) {
      const boxGrp = new THREE.Group();
      const body = new THREE.Mesh(pouchBodyGeo, pouchJadeMat);
      body.position.y = 0.44;
      const neck = new THREE.Mesh(pouchNeckGeo, pouchGoldMat);
      neck.position.y = 0.72;
      const top = new THREE.Mesh(pouchTopGeo, pouchJadeMat);
      top.position.y = 0.84;
      const seal = new THREE.Mesh(pouchSealGeo, pouchSealMat);
      seal.position.set(0, 0.46, 0.38);
      boxGrp.add(body, neck, top, seal);
      if (scaleVal && scaleVal !== 1) {
        boxGrp.scale.setScalar(scaleVal);
      }
      return boxGrp;
    }

    for (let i = 0; i < 40; i++) {
      const grp = new THREE.Group();
      const chest = buildLootChestMesh(1.0);
      const ring = new THREE.Mesh(chestRingGeo, chestRingMat);
      ring.position.y = 0.12;
      grp.add(chest, ring);
      grp.visible = false;
      combatGroup.add(grp);
      bonePool.push({
        active: false,
        claimed: false,
        mesh: grp,
        chest,
        x: 0,
        z: 0,
        age: 0
      });
    }

    // (9) 三分支折纸仙鹤对象池: 2×收尸鹤(白+翠玉) / 1×补弹鹤(白+赤金) / 1×修塔鹤(白+青蓝)
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext('2d');
    const grad = dotCtx.createRadialGradient(32, 32, 2, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(110, 231, 183, 0.65)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    dotCtx.fillStyle = grad;
    dotCtx.fillRect(0, 0, 64, 64);
    const glowDotTex = new THREE.CanvasTexture(dotCanvas);

    const TRAIL_LEN = 10;
    const craneWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0xe2e8f0,
      emissiveIntensity: 0.28,
      roughness: 0.42,
      side: THREE.DoubleSide
    });
    const craneJadeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x34d399,
      emissiveIntensity: 0.52,
      roughness: 0.35,
      side: THREE.DoubleSide
    });
    const craneGoldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.62,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const craneCyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.62,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const craneBeakMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

    const craneTrimMats = {
      harvest: craneJadeMat,
      resupply: craneGoldMat,
      repair: craneCyanMat
    };
    const craneTrailColors = {
      harvest: 0x6ee7b7,
      resupply: 0xfde047,
      repair: 0x22d3ee
    };

    // 菱形折纸身躯 + 镶边脊线
    const craneBodyGeo = new THREE.OctahedronGeometry(0.45, 0);
    craneBodyGeo.scale(0.75, 0.52, 1.45);
    const craneRidgeGeo = new THREE.OctahedronGeometry(0.46, 0);
    craneRidgeGeo.scale(0.22, 0.56, 1.48);

    // 修长鹤颈、头部与尖喙 (+Z 为前方)
    const craneNeckGeo = new THREE.CylinderGeometry(0.06, 0.11, 0.85, 4);
    const craneHeadGeo = new THREE.OctahedronGeometry(0.12, 0);
    const craneBeakGeo = new THREE.ConeGeometry(0.055, 0.36, 4);
    craneBeakGeo.rotateX(Math.PI / 2);

    // 上翘鹤尾 (-Z 为后方)
    const craneTailGeo = new THREE.ConeGeometry(0.14, 0.72, 4);
    const craneTailTrimGeo = new THREE.ConeGeometry(0.08, 0.42, 4);

    // 宽大三角折纸双翼 + 镶边
    const craneWingGeo = new THREE.BufferGeometry();
    craneWingGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0, 0, 0.44,
      1.68, 0.12, -0.18,
      0, 0, -0.52
    ]), 3));
    craneWingGeo.computeVertexNormals();

    const craneWingTrimGeo = new THREE.BufferGeometry();
    craneWingTrimGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      0.18, 0.01, 0.38,
      1.74, 0.13, -0.18,
      1.52, 0.10, -0.26,
      0.18, 0.01, 0.38,
      1.52, 0.10, -0.26,
      0.12, 0.01, 0.28
    ]), 3));
    craneWingTrimGeo.computeVertexNormals();

    // 补弹鹤腹下发光剑丸球体
    const carryPillGeo = new THREE.SphereGeometry(0.32, 12, 12);
    const carryPillMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });

    // 补弹鹤/修塔鹤在炮塔上方释放的脉冲光环池
    const cranePulseGeo = new THREE.RingGeometry(1.4, 2.5, 24);
    cranePulseGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const ring = new THREE.Mesh(cranePulseGeo, mat);
      ring.visible = false;
      combatGroup.add(ring);
      cranePulsePool.push({
        active: false,
        mesh: ring,
        mat,
        life: 0,
        maxLife: 0.65
      });
    }

    const CRANE_ROLES = [
      { role: 'harvest', homeIdx: 0, purifierIdx: 0 },
      { role: 'harvest', homeIdx: 1, purifierIdx: 1 },
      { role: 'resupply', homeIdx: 0, purifierIdx: 0 },
      { role: 'repair', homeIdx: 1, purifierIdx: 1 }
    ];

    for (let i = 0; i < CRANE_ROLES.length; i++) {
      const spec = CRANE_ROLES[i];
      const trimMat = craneTrimMats[spec.role];
      const grp = new THREE.Group();

      const body = new THREE.Mesh(craneBodyGeo, craneWhiteMat);
      const ridge = new THREE.Mesh(craneRidgeGeo, trimMat);

      const neck = new THREE.Mesh(craneNeckGeo, craneWhiteMat);
      neck.position.set(0, 0.36, 0.72);
      neck.rotation.x = 0.65;

      const head = new THREE.Mesh(craneHeadGeo, craneWhiteMat);
      head.position.set(0, 0.68, 1.04);

      const beak = new THREE.Mesh(craneBeakGeo, craneBeakMat);
      beak.position.set(0, 0.66, 1.26);

      const tail = new THREE.Mesh(craneTailGeo, craneWhiteMat);
      tail.position.set(0, 0.28, -0.78);
      tail.rotation.x = -0.72;

      const tailTrim = new THREE.Mesh(craneTailTrimGeo, trimMat);
      tailTrim.position.set(0, 0.44, -0.94);
      tailTrim.rotation.x = -0.72;

      const wingR = new THREE.Group();
      wingR.position.set(0.14, 0.06, 0.04);
      wingR.add(
        new THREE.Mesh(craneWingGeo, craneWhiteMat),
        new THREE.Mesh(craneWingTrimGeo, trimMat)
      );

      const wingL = new THREE.Group();
      wingL.position.set(-0.14, 0.06, 0.04);
      wingL.scale.x = -1;
      wingL.add(
        new THREE.Mesh(craneWingGeo, craneWhiteMat),
        new THREE.Mesh(craneWingTrimGeo, trimMat)
      );

      // 收尸鹤腹下：残躯灵匣；补弹鹤腹下：发光剑丸球体
      const carryBone = buildLootChestMesh(0.58);
      carryBone.position.set(0, -0.58, 0.06);
      carryBone.visible = false;

      const carryPill = new THREE.Mesh(carryPillGeo, carryPillMat);
      carryPill.position.set(0, -0.55, 0.08);
      carryPill.visible = false;

      grp.add(body, ridge, neck, head, beak, tail, tailTrim, wingR, wingL, carryBone, carryPill);
      grp.scale.setScalar(2.1);
      grp.visible = false;
      combatGroup.add(grp);

      const cranePtsMat = new THREE.PointsMaterial({
        size: 1.35,
        map: glowDotTex,
        color: craneTrailColors[spec.role],
        transparent: true,
        opacity: 0.58,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });
      const ptsPos = new Float32Array(TRAIL_LEN * 3);
      const ptsGeo = new THREE.BufferGeometry();
      ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPos, 3));
      const trailPoints = new THREE.Points(ptsGeo, cranePtsMat);
      trailPoints.visible = false;
      trailPoints.frustumCulled = false;
      combatGroup.add(trailPoints);

      const trailHistory = [];
      for (let k = 0; k < TRAIL_LEN; k++) {
        trailHistory.push({ x: 0, y: 0, z: 0 });
      }

      const home = CRANE_BASES[spec.homeIdx];
      cranePool.push({
        role: spec.role,
        state: 'idle',
        mesh: grp,
        wingL,
        wingR,
        carryBone,
        carryPill,
        trailPoints,
        ptsPos,
        trailHistory,
        homeX: home.x,
        homeY: home.y,
        homeZ: home.z,
        x: home.x,
        y: home.y,
        z: home.z,
        cruiseY: spec.role === 'harvest' ? 8.5 : 11.2,
        hoverTimer: 0,
        fuel: 100 - i * 18,
        refuelTimer: 0,
        refuelPulseDone: false,
        boneIdx: -1,
        turretIdx: 0,
        purifierIdx: spec.purifierIdx,
        phase: i * 1.3
      });
    }

    // 开局立即预生成 16 只煞魔 + 10 颗煞骨魂晶 + 4 只空中收尸千纸鹤
    prepopulateCombatZone();

    // 注册帧循环钩子
    window.World3D.registerFrameHook(onFrame);
  }

  // ------------------------------------------------------------------
  // 4. 辅助生成函数 (全部复用对象池，零 new Mesh)
  // ------------------------------------------------------------------
  function configureMonster(m, x, z, laneIndex, isBoss, hpRatio) {
    m.active = true;
    m.isBoss = !!isBoss;
    m.baseScale = m.isBoss ? 3.5 : 2.4;
    m.x = x;
    m.y = 0;
    m.z = z;
    m.maxHp = m.isBoss ? 420 : 160;
    m.hp = Math.max(25, Math.round(m.maxHp * (hpRatio !== undefined ? hpRatio : 1)));
    m.speed = m.isBoss ? (2.4 + Math.random() * 0.35) : (2.6 + Math.random() * 0.6);
    m.laneIndex = laneIndex % ATTACK_LANES.length;
    m.fireCooldown = 1.0 + Math.random() * 2.2;

    m.body.material = m.isBoss ? m.bossBodyMat : m.monsterBodyMat;
    m.mantle.material = m.isBoss ? m.bossMantleMat : m.cultMantleMat;
    m.flySword.material = m.isBoss ? m.bossSwordMat : m.cultSwordMat;
    m.aura.material = m.isBoss ? m.bossAuraMat : m.monsterAuraMat;
    m.hpFill.material = m.isBoss ? m.bossHpFillMat : m.hpFillMat;
    m.haloRing.visible = m.isBoss;

    const ratio = Math.max(0.02, m.hp / m.maxHp);
    m.hpFill.scale.x = ratio;
    m.hpFill.position.x = -0.67 * (1 - ratio);

    m.mesh.scale.setScalar(m.baseScale);
    m.mesh.position.set(m.x, 0, m.z);
    m.mesh.visible = true;
  }

  function resetCraneTrail(c, x, y, z, dirX, dirZ) {
    const stepX = (dirX || 0) * 1.1;
    const stepZ = (dirZ || 1) * 1.1;
    for (let k = 0; k < c.trailHistory.length; k++) {
      c.trailHistory[k].x = x - stepX * k;
      c.trailHistory[k].y = y;
      c.trailHistory[k].z = z - stepZ * k;
    }
    updateCraneTrail(c);
  }

  function updateCraneTrail(c) {
    const hist = c.trailHistory;
    // 前移历史节点
    for (let k = hist.length - 1; k > 0; k--) {
      hist[k].x = hist[k - 1].x;
      hist[k].y = hist[k - 1].y;
      hist[k].z = hist[k - 1].z;
    }
    hist[0].x = c.x;
    hist[0].y = c.y;
    hist[0].z = c.z;

    const pts = c.ptsPos;
    const len = hist.length;
    for (let k = 0; k < len; k++) {
      const p = hist[k];
      const o3 = k * 3;
      pts[o3] = p.x;
      pts[o3 + 1] = p.y;
      pts[o3 + 2] = p.z;
    }
    c.trailPoints.geometry.attributes.position.needsUpdate = true;
  }

  function prepopulateCombatZone() {
    // (1) 在 3 条正面进攻路线全段预生成 16 只正在行进交火的煞魔 (含 3 只 3.5x 赤角煞魔统领)
    const totalPreMonsters = 16;
    const bossIndices = { 3: true, 8: true, 13: true };
    for (let k = 0; k < totalPreMonsters && k < monsterPool.length; k++) {
      const laneIdx = k % ATTACK_LANES.length;
      const lane = ATTACK_LANES[laneIdx];
      const progress = 0.08 + ((k / totalPreMonsters) * 0.84);
      const px = lane.startX + (lane.endX - lane.startX) * progress + (Math.random() - 0.5) * 3.6;
      const pz = lane.startZ + (lane.endZ - lane.startZ) * progress + (Math.random() - 0.5) * 2.4;
      const hpRatio = 0.45 + Math.random() * 0.52;
      configureMonster(monsterPool[k], px, pz, laneIdx, !!bossIndices[k], hpRatio);
      monsterPool[k].mesh.rotation.y = Math.atan2(lane.endX - lane.startX, lane.endZ - lane.startZ);
    }
    stats.activeMonsters = totalPreMonsters;

    // (2) 在地面预置 10 个发光旋转【战利品灵匣】掉落物
    const totalPreBones = 10;
    for (let k = 0; k < totalPreBones && k < bonePool.length; k++) {
      const b = bonePool[k];
      const lane = ATTACK_LANES[k % ATTACK_LANES.length];
      const f = 0.22 + ((k * 0.19) % 0.68);
      const bx = lane.startX + (lane.endX - lane.startX) * f + (Math.random() - 0.5) * 4.2;
      const bz = lane.startZ + (lane.endZ - lane.startZ) * f + (Math.random() - 0.5) * 3.2;
      b.active = true;
      b.claimed = false;
      b.x = bx;
      b.z = bz;
      b.age = Math.random() * 4;
      b.mesh.position.set(bx, 0, bz);
      b.mesh.rotation.y = Math.random() * Math.PI;
      b.mesh.visible = true;
    }

    // (3) 让三分支共 4 只折纸仙鹤开场即在战区低空巡航 (2×收尸鹤 + 1×补弹鹤 + 1×修塔鹤)
    for (let i = 0; i < cranePool.length; i++) {
      const c = cranePool[i];
      if (c.role === 'harvest') {
        const b = bonePool[i];
        if (!b || !b.active) continue;
        b.claimed = true;
        c.boneIdx = i;
        if (i === 0) {
          c.state = 'cruise_out';
          c.x = (c.homeX + b.x) * 0.5;
          c.y = c.cruiseY;
          c.z = (c.homeZ + b.z) * 0.5;
          c.carryBone.visible = false;
          c.mesh.lookAt(b.x, c.y, b.z);
          resetCraneTrail(c, c.x, c.y, c.z, b.x - c.homeX, b.z - c.homeZ);
        } else {
          const pur = PURIFIERS[c.purifierIdx];
          c.state = 'cruise_back';
          c.x = (b.x + pur.x) * 0.5;
          c.y = c.cruiseY;
          c.z = (b.z + pur.z) * 0.5;
          b.active = false;
          b.claimed = false;
          b.mesh.visible = false;
          c.carryBone.visible = true;
          c.mesh.lookAt(pur.x, c.y, pur.z);
          resetCraneTrail(c, c.x, c.y, c.z, pur.x - b.x, pur.z - b.z);
        }
      } else if (c.role === 'resupply') {
        c.turretIdx = 4; // 中路炮塔
        const tur = SWORD_TURRETS[c.turretIdx] || SWORD_TURRETS[0];
        c.state = 'fly_to_turret';
        c.x = (c.homeX + tur.x) * 0.5;
        c.y = c.cruiseY;
        c.z = (c.homeZ + tur.z) * 0.5;
        c.carryPill.visible = true;
        c.mesh.lookAt(tur.x, c.y, tur.z);
        resetCraneTrail(c, c.x, c.y, c.z, tur.x - c.homeX, tur.z - c.homeZ);
      } else if (c.role === 'repair') {
        c.turretIdx = 1;
        const tur = SWORD_TURRETS[c.turretIdx] || SWORD_TURRETS[0];
        c.state = 'patrol_move';
        c.x = 460;
        c.y = c.cruiseY;
        c.z = 294;
        c.mesh.lookAt(tur.x, c.y, tur.z);
        resetCraneTrail(c, c.x, c.y, c.z, tur.x - c.x, tur.z - c.z);
      }
      c.mesh.position.set(c.x, c.y, c.z);
      c.mesh.visible = true;
      c.trailPoints.visible = true;
    }
  }

  function spawnWave() {
    let activeBosses = 0;
    for (let i = 0; i < monsterPool.length; i++) {
      if (monsterPool[i].active && monsterPool[i].isBoss) activeBosses++;
    }

    const count = 8 + Math.floor(Math.random() * 5); // 8~12 个
    let spawned = 0;
    for (let i = 0; i < monsterPool.length && spawned < count; i++) {
      const m = monsterPool[i];
      if (m.active) continue;
      const laneIdx = spawned % RIFTS.length;
      const rift = RIFTS[laneIdx];
      const spawnAsBoss = activeBosses < 3 && spawned === 0;
      if (spawnAsBoss) activeBosses++;
      configureMonster(
        m,
        rift.x + (Math.random() - 0.5) * 3.5,
        rift.z - Math.random() * 3.0,
        laneIdx,
        spawnAsBoss,
        1.0
      );
      spawned++;
    }
  }

  function spawnSparks(x, y, z, count) {
    let left = count;
    for (let i = 0; i < sparkPool.length && left > 0; i++) {
      const s = sparkPool[i];
      if (s.active) continue;
      s.active = true;
      s.life = 0;
      s.maxLife = 0.22 + Math.random() * 0.12;
      s.vx = (Math.random() - 0.5) * 12;
      s.vy = 2 + Math.random() * 7;
      s.vz = (Math.random() - 0.5) * 12;
      s.mesh.position.set(x, y, z);
      s.mesh.scale.setScalar(1);
      s.mesh.visible = true;
      left--;
    }
  }

  function spawnDeathDustAndBone(x, z) {
    let left = 5;
    for (let i = 0; i < dustPool.length && left > 0; i++) {
      const d = dustPool[i];
      if (d.active) continue;
      d.active = true;
      d.life = 0;
      d.maxLife = 0.55 + Math.random() * 0.25;
      d.vx = (Math.random() - 0.5) * 4.5;
      d.vy = 1.8 + Math.random() * 2.5;
      d.vz = (Math.random() - 0.5) * 4.5;
      d.mesh.position.set(x, 0.8, z);
      d.mesh.scale.setScalar(0.8);
      d.mesh.visible = true;
      left--;
    }

    for (let i = 0; i < bonePool.length; i++) {
      const b = bonePool[i];
      if (b.active) continue;
      b.active = true;
      b.claimed = false;
      b.x = x;
      b.z = z;
      b.age = 0;
      b.mesh.position.set(x, 0, z);
      b.mesh.rotation.y = Math.random() * Math.PI;
      b.mesh.visible = true;
      break;
    }
  }

  function damageMonster(idx, dmg) {
    const m = monsterPool[idx];
    if (!m || !m.active) return;
    m.hp -= dmg;
    if (m.hp <= 0) {
      m.active = false;
      m.mesh.visible = false;
      stats.kills++;
      spawnDeathDustAndBone(m.x, m.z);
    } else {
      const ratio = Math.max(0.02, m.hp / m.maxHp);
      m.hpFill.scale.x = ratio;
      m.hpFill.position.x = -0.67 * (1 - ratio);
    }
  }

  function findNearestMonster(x, z, maxRange, excludeIdx) {
    let bestIdx = -1;
    let bestD2 = maxRange * maxRange;
    for (let i = 0; i < monsterPool.length; i++) {
      if (i === excludeIdx) continue;
      const m = monsterPool[i];
      if (!m.active) continue;
      const dx = m.x - x;
      const dz = m.z - z;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestD2) {
        bestD2 = d2;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  function spawnCrossSlash(x, y, z, cam) {
    for (let i = 0; i < crossSlashPool.length; i++) {
      const cs = crossSlashPool[i];
      if (cs.active) continue;
      cs.active = true;
      cs.life = cs.maxLife;
      cs.mesh.position.set(x, y, z);
      cs.mesh.scale.setScalar(0.75);
      cs.mat.opacity = 0.95;
      if (cam && cam.position) {
        cs.mesh.lookAt(cam.position);
      }
      cs.mesh.visible = true;
      break;
    }
  }

  function spawnThunderRing(x, z) {
    for (let i = 0; i < thunderRingPool.length; i++) {
      const tr = thunderRingPool[i];
      if (tr.active) continue;
      tr.active = true;
      tr.life = tr.maxLife;
      tr.mesh.position.set(x, 0.28, z);
      tr.mesh.scale.setScalar(0.65);
      tr.mat.opacity = 0.95;
      tr.mesh.visible = true;
      break;
    }
  }

  function spawnCranePulse(x, y, z, colorHex) {
    for (let i = 0; i < cranePulsePool.length; i++) {
      const cp = cranePulsePool[i];
      if (cp.active) continue;
      cp.active = true;
      cp.life = cp.maxLife;
      cp.mat.color.setHex(colorHex);
      cp.mat.opacity = 0.92;
      cp.mesh.position.set(x, y, z);
      cp.mesh.scale.setScalar(0.5);
      cp.mesh.visible = true;
      break;
    }
  }

  function spawnFireLotus(x, z) {
    for (let i = 0; i < fireLotusPool.length; i++) {
      const fl = fireLotusPool[i];
      if (fl.active) continue;
      fl.active = true;
      fl.life = fl.maxLife;
      fl.mesh.position.set(x, 0.26, z);
      fl.mesh.scale.setScalar(0.55);
      fl.outerMat.opacity = 0.92;
      fl.innerMat.opacity = 0.95;
      fl.mesh.visible = true;
      break;
    }
  }

  function spawnLightningArc(sx, sy, sz, ex, ey, ez) {
    for (let j = 0; j < lightningPool.length; j++) {
      const lb = lightningPool[j];
      if (lb.active) continue;
      lb.active = true;
      lb.sx = sx;
      lb.sy = sy;
      lb.sz = sz;
      lb.ex = ex;
      lb.ey = ey;
      lb.ez = ez;
      lb.life = lb.maxLife;
      updateLightningGeometry(lb);
      lb.mesh.visible = true;
      break;
    }
  }

  function updateLightningGeometry(bolt) {
    const n = bolt.segments;
    for (let s = 0; s < bolt.strands.length; s++) {
      const segMeshes = bolt.strands[s];
      let prevX = bolt.sx;
      let prevY = bolt.sy;
      let prevZ = bolt.sz;
      const jitterScale = s === 0 ? 1.8 : 2.8;
      for (let i = 1; i <= n; i++) {
        const f = i / n;
        let nx = bolt.sx + (bolt.ex - bolt.sx) * f;
        let ny = bolt.sy + (bolt.ey - bolt.sy) * f;
        let nz = bolt.sz + (bolt.ez - bolt.sz) * f;
        if (i < n) {
          nx += (Math.random() - 0.5) * jitterScale;
          ny += (Math.random() - 0.5) * 1.6;
          nz += (Math.random() - 0.5) * jitterScale;
        }
        const seg = segMeshes[i - 1];
        const segLen = Math.hypot(nx - prevX, ny - prevY, nz - prevZ);
        seg.position.set((prevX + nx) * 0.5, (prevY + ny) * 0.5, (prevZ + nz) * 0.5);
        seg.lookAt(nx, ny, nz);
        const thickness = s === 0 ? 1.55 : 1.05;
        seg.scale.set(thickness, thickness, Math.max(0.2, segLen));
        prevX = nx;
        prevY = ny;
        prevZ = nz;
      }
    }
  }

  // ------------------------------------------------------------------
  // 5. 主帧循环
  // ------------------------------------------------------------------
  function onFrame(dt, t) {
    // 独立西南煞气工厂 (-360, 360) 紫气动画始终在 300m 视距内更新（不受塔防战区裁剪影响）
    const cam = window.World3D && typeof window.World3D.getCamera === 'function' ? window.World3D.getCamera() : null;
    if (shaqiGroup && shaqiMistParticles.length > 0) {
      const sdx = cam && cam.position ? (cam.position.x + 360) : 0;
      const sdz = cam && cam.position ? (cam.position.z - 360) : 0;
      if (!cam || !cam.position || (sdx * sdx + sdz * sdz) <= 122500) { // <= 350m
        for (let i = 0; i < shaqiMistParticles.length; i++) {
          const mp = shaqiMistParticles[i];
          const f = (mp.phase + t * 0.24) % 1.0;
          mp.mesh.position.set(
            mp.baseX + Math.sin(t * 1.5 + i) * 1.2,
            2.4 + f * 13.5,
            mp.baseZ + Math.cos(t * 1.3 + i) * 1.2
          );
          const sc = 0.8 + f * 1.6;
          mp.mesh.scale.setScalar(sc);
          mp.mat.opacity = (1.0 - f) * 0.65;
        }
      }
    }

    // 屏幕外 & 远距离 (>250m) 0 开销休眠：利用复用的 THREE.Frustum 检测战区包围球
    if (cam && cam.position) {
      const dx = cam.position.x - 460;
      const dy = cam.position.y - 12;
      const dz = cam.position.z - 290;
      let visible = (dx * dx + dy * dy + dz * dz) <= 67600; // <= 260m

      if (visible) {
        const THREE = window.THREE;
        if (THREE && typeof THREE.Frustum === 'function' && typeof THREE.Matrix4 === 'function' && typeof THREE.Sphere === 'function' && cam.projectionMatrix && cam.matrixWorldInverse) {
          if (!cullFrustum) {
            cullFrustum = new THREE.Frustum();
            cullProjMatrix = new THREE.Matrix4();
            cullSphere = new THREE.Sphere(new THREE.Vector3(460, 12, 290), 115);
          }
          if (typeof cam.updateMatrixWorld === 'function') {
            cam.updateMatrixWorld();
          }
          cullProjMatrix.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
          cullFrustum.setFromProjectionMatrix(cullProjMatrix);
          visible = cullFrustum.intersectsSphere(cullSphere);
        }
      }

      if (!visible) {
        if (rootGroup) rootGroup.visible = false;
        return;
      }
      if (rootGroup) rootGroup.visible = true;
    }

    const safeDt = Math.min(dt || 0.016, 0.08);

    // 裂隙漩涡与光柱旋转
    for (let i = 0; i < riftVisuals.length; i++) {
      const rv = riftVisuals[i];
      rv.outer.rotation.z = t * 1.6 + rv.phase;
      rv.inner.rotation.z = -t * 2.4 - rv.phase;
      rv.pillar.rotation.y = t * 0.8 + rv.phase;
    }

    // 地面箭头流动、八卦减速阵旋转 & 警戒线呼吸
    for (let i = 0; i < corridorArrows.length; i++) {
      const ca = corridorArrows[i];
      const f = (ca.offset + t * 0.22) % 1.0;
      ca.mesh.position.set(
        ca.ax + (ca.bx - ca.ax) * f,
        0.16,
        ca.az + (ca.bz - ca.az) * f
      );
    }
    for (let i = 0; i < slowArrayVisuals.length; i++) {
      const sa = slowArrayVisuals[i];
      sa.outerRing.rotation.y = t * 0.45 + sa.phase;
      sa.octRing.rotation.y = -t * 0.72 + sa.phase;
      sa.innerRing.rotation.y = t * 1.15 - sa.phase;
      sa.spokeGrp.rotation.y = -t * 0.55 + sa.phase;
    }
    if (warningLineMat) {
      warningLineMat.opacity = 0.55 + 0.35 * Math.sin(t * 4.2);
    }

    // 护山大阵天幕护盾缓慢旋流与受击脉冲闪烁
    if (domeMesh && domeMat && domeRingMat) {
      domeMesh.rotation.y = t * 0.06;
      if (domeFlashTimer > 0) {
        domeFlashTimer = Math.max(0, domeFlashTimer - safeDt);
        const fn = domeFlashTimer / 0.25;
        domeMat.opacity = 0.07 + fn * 0.17;
        domeRingMat.opacity = 0.42 + fn * 0.48;
      } else {
        domeMat.opacity = 0.07 + 0.015 * Math.sin(t * 2.0);
        domeRingMat.opacity = 0.38 + 0.12 * Math.sin(t * 2.6);
      }
    }

    // 瘫痪防御塔告警红环脉冲与暗红浓烟升腾
    for (let i = 0; i < SWORD_TURRETS.length; i++) {
      const tur = SWORD_TURRETS[i];
      const ind = turretAlertVisuals[i];
      if (!ind) continue;
      if (!tur.paralyzed) {
        ind.grp.visible = false;
        continue;
      }
      ind.grp.visible = true;
      const pulse = 1.0 + 0.32 * Math.sin(t * 7.5 + ind.phase);
      ind.ring.scale.setScalar(pulse);
      for (let p = 0; p < ind.puffs.length; p++) {
        const pf = ind.puffs[p];
        const f = (t * 0.72 + pf.offset + ind.phase * 0.1) % 1.0;
        pf.mesh.position.set(
          pf.driftX * f,
          tur.y + 0.4 + f * 3.8,
          Math.sin(t * 3.0 + p) * 0.25
        );
        pf.mesh.scale.setScalar(0.35 + Math.sin(f * Math.PI) * 0.95);
      }
    }

    // 原生荒地矿脉光环与灵泉水波纹
    if (oreVeinRing) {
      const s = 0.96 + 0.06 * Math.sin(t * 2.6);
      oreVeinRing.scale.set(s, s, 1);
    }
    if (waterRippleRing) {
      const wf = (t * 0.48) % 1.0;
      const ws = 0.6 + wf * 1.45;
      waterRippleRing.scale.set(ws, ws, 1);
      waterRippleRing.material.opacity = (1.0 - wf) * 0.75;
    }
    for (let i = 0; i < shaqiMistParticles.length; i++) {
      const mp = shaqiMistParticles[i];
      const f = (mp.phase + t * 0.24) % 1.0;
      mp.mesh.position.set(
        mp.baseX + Math.sin(t * 1.5 + i) * 1.2,
        2.4 + f * 13.5,
        mp.baseZ + Math.cos(t * 1.3 + i) * 1.2
      );
      const sc = 0.8 + f * 1.6;
      mp.mesh.scale.setScalar(sc);
      mp.mat.opacity = (1.0 - f) * 0.62;
    }

    // 3 条出仓主干带、3 条水平支线带、矿脉分流带与 9 条纵向供弹传送带上方流动的发光剑丸/矿石小球
    for (let i = 0; i < ammoBeltPellets.length; i++) {
      const ap = ammoBeltPellets[i];
      const f = (ap.phase + t * 0.28) % 1.0;
      const px = ap.startX !== undefined ? ap.startX + (ap.endX - ap.startX) * f : ap.x;
      const py = (ap.startY !== undefined && ap.endY !== undefined) ? ap.startY + (ap.endY - ap.startY) * f : ap.y;
      const pz = ap.startZ !== undefined ? ap.startZ + (ap.endZ - ap.startZ) * f : ap.z;
      ap.mesh.position.set(
        px,
        py + Math.sin(t * 4 + i) * 0.05,
        pz
      );
    }

    // 解构机双路输出与碎晶回流传送带灵匣方块流动
    for (let i = 0; i < beltCubes.length; i++) {
      const bc = beltCubes[i];
      const f = (bc.phase + t * 0.35) % 1.0;
      bc.mesh.position.x = bc.startX !== undefined ? bc.startX + (bc.endX - bc.startX) * f : bc.x;
      bc.mesh.position.z = bc.startZ + (bc.endZ - bc.startZ) * f;
      bc.mesh.position.y = bc.y;
      bc.mesh.rotation.y = t * 2.0;
    }

    // 净化塔绿光脉冲与纸鹤补弹/修塔光环衰减
    for (let i = 0; i < PURIFIERS.length; i++) {
      const p = PURIFIERS[i];
      if (p.glowTimer > 0) {
        p.glowTimer = Math.max(0, p.glowTimer - safeDt);
        const norm = p.glowTimer / 0.8;
        purifierHalos[i].mat.opacity = norm * 0.75;
        purifierHalos[i].mesh.scale.setScalar(1.0 + (1.0 - norm) * 0.65);
      } else {
        purifierHalos[i].mat.opacity = 0;
      }
    }
    for (let i = 0; i < cranePulsePool.length; i++) {
      const cp = cranePulsePool[i];
      if (!cp.active) continue;
      cp.life -= safeDt;
      if (cp.life <= 0) {
        cp.active = false;
        cp.mesh.visible = false;
      } else {
        const norm = cp.life / cp.maxLife;
        cp.mesh.scale.setScalar(0.5 + (1.0 - norm) * 1.4);
        cp.mat.opacity = norm * 0.92;
      }
    }

    // 每 8.5 秒刷一波煞魔
    waveTimer -= safeDt;
    if (waveTimer <= 0) {
      waveTimer = 8.5;
      spawnWave();
    }

    // 更新煞魔行进 (沿 3 条正面进攻路线向南推进，经过八卦锁妖减速阵纹带时降至 1.2 m/s)
    let activeCount = 0;
    for (let i = 0; i < monsterPool.length; i++) {
      const m = monsterPool[i];
      if (!m.active) continue;
      activeCount++;

      const lane = ATTACK_LANES[m.laneIndex % ATTACK_LANES.length];
      const dx = lane.endX - m.x;
      const dz = lane.endZ - m.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 1.2) {
        // 抵达防线前，被防线余威击杀或消散
        m.active = false;
        m.mesh.visible = false;
        stats.kills++;
        spawnDeathDustAndBone(m.x, m.z);
        continue;
      }

      let moveSpeed = m.speed;
      for (let sIdx = 0; sIdx < SLOW_ARRAYS.length; sIdx++) {
        const sa = SLOW_ARRAYS[sIdx];
        const sdx = m.x - sa.x;
        const sdz = m.z - sa.z;
        if (sdx * sdx + sdz * sdz <= sa.radius * sa.radius) {
          moveSpeed = 1.2;
          break;
        }
      }

      const step = Math.min(dist, moveSpeed * safeDt);
      m.x += (dx / dist) * step;
      m.z += (dz / dist) * step;
      m.mesh.rotation.y = Math.atan2(dx, dz);

      const bob = Math.abs(Math.sin(t * 4.5 + m.phase)) * 0.32;
      m.mesh.position.set(m.x, bob, m.z);
      if (cam && cam.position) {
        m.hpGroup.lookAt(cam.position);
      }

      // 敌方修士进入射程 (z: 298..338) 后远程发射绯红剑气反击最近防御塔
      if (m.z >= 298 && m.z <= 338) {
        m.fireCooldown -= safeDt;
        if (m.fireCooldown <= 0) {
          m.fireCooldown = 2.8 + Math.random() * 1.4;
          let bestTurIdx = -1;
          let bestD2 = Infinity;
          for (let ti = 0; ti < SWORD_TURRETS.length; ti++) {
            const tur = SWORD_TURRETS[ti];
            const tdx = tur.x - m.x;
            const tdz = tur.z - m.z;
            const td2 = tdx * tdx + tdz * tdz;
            if (td2 < bestD2) {
              bestD2 = td2;
              bestTurIdx = ti;
            }
          }
          if (bestTurIdx !== -1) {
            const targetTur = SWORD_TURRETS[bestTurIdx];
            for (let ei = 0; ei < enemyShotPool.length; ei++) {
              const es = enemyShotPool[ei];
              if (es.active) continue;
              const sx = m.x;
              const sy = m.isBoss ? 3.2 : 2.2;
              const sz = m.z;
              const sdx = targetTur.x - sx;
              const sdy = targetTur.y - sy;
              const sdz = targetTur.z - sz;
              const sdist = Math.max(0.1, Math.hypot(sdx, sdy, sdz));
              const shotSpeed = 20;
              es.active = true;
              es.x = sx;
              es.y = sy;
              es.z = sz;
              es.vx = (sdx / sdist) * shotSpeed;
              es.vy = (sdy / sdist) * shotSpeed;
              es.vz = (sdz / sdist) * shotSpeed;
              es.targetTurretIdx = bestTurIdx;
              es.life = 4.0;
              es.mesh.position.set(sx, sy, sz);
              es.mesh.lookAt(targetTur.x, targetTur.y, targetTur.z);
              es.mesh.visible = true;
              break;
            }
          }
        }
      }
    }
    stats.activeMonsters = activeCount;

    // 唯一防御塔：9 座剑丸防御塔 (bd_160) 按左(庚金)/中(天雷)/右(赤炎)发射对应剑丸与光效 (瘫痪塔暂停开火)
    for (let i = 0; i < SWORD_TURRETS.length; i++) {
      const tur = SWORD_TURRETS[i];
      if (tur.paralyzed) continue;
      tur.cooldown -= safeDt;
      if (tur.cooldown > 0) continue;

      const targetIdx = findNearestMonster(tur.x, tur.z, tur.range);
      if (targetIdx === -1) continue;

      const tm = monsterPool[targetIdx];
      const aimY = tm.isBoss ? 3.5 : 2.4;
      const ammo = tur.ammoType;

      for (let j = 0; j < swordProjPool.length; j++) {
        const sp = swordProjPool[j];
        if (sp.active) continue;
        sp.active = true;
        sp.ammoType = ammo;
        sp.blade.material = sp.swordBladeMats[ammo] || sp.swordBladeMats.gold;
        sp.trail.material = sp.swordTrailMats[ammo] || sp.swordTrailMats.gold;
        sp.speed = 16;
        sp.damage = ammo === 'gold' ? 31 : (ammo === 'thunder' ? 34 : 28);
        sp.x = tur.x;
        sp.y = tur.y;
        sp.z = tur.z;
        sp.targetIdx = targetIdx;
        sp.tx = tm.x;
        sp.ty = aimY;
        sp.tz = tm.z;
        sp.life = 4.5;
        sp.mesh.position.set(sp.x, sp.y, sp.z);
        sp.mesh.lookAt(sp.tx, sp.ty, sp.tz);
        sp.mesh.visible = true;
        tur.cooldown = tur.fireRate;
        break;
      }

      if (ammo === 'thunder') {
        // 中路天雷剑丸：粗壮青紫雷霆电弧 + 落地连锁雷环炸裂
        spawnLightningArc(tur.x, tur.y, tur.z, tm.x, aimY, tm.z);
        spawnThunderRing(tm.x, tm.z);
        const chainIdx = findNearestMonster(tm.x, tm.z, 15, targetIdx);
        if (chainIdx !== -1) {
          const cm = monsterPool[chainIdx];
          const chainAimY = cm.isBoss ? 3.5 : 2.4;
          spawnLightningArc(tm.x, aimY, tm.z, cm.x, chainAimY, cm.z);
          spawnThunderRing(cm.x, cm.z);
          damageMonster(chainIdx, 18);
        }
      } else {
        // 左翼庚金剑虹激光束 / 右翼赤炎丹火剑气光束
        const beamStyle = ammo === 'fire' ? 'fire' : 'gold';
        for (let b = 0; b < swordBeamPool.length; b++) {
          const sb = swordBeamPool[b];
          if (sb.active) continue;
          sb.active = true;
          sb.outer.material = sb.swordBeamOuterMats[beamStyle];
          sb.core.material = sb.swordBeamCoreMats[beamStyle];
          sb.sx = tur.x;
          sb.sy = tur.y;
          sb.sz = tur.z;
          sb.ex = tm.x;
          sb.ey = aimY;
          sb.ez = tm.z;
          sb.life = sb.maxLife;
          const dist = Math.hypot(sb.ex - sb.sx, sb.ey - sb.sy, sb.ez - sb.sz);
          sb.mesh.position.set((sb.sx + sb.ex) * 0.5, (sb.sy + sb.ey) * 0.5, (sb.sz + sb.ez) * 0.5);
          sb.mesh.lookAt(sb.ex, sb.ey, sb.ez);
          sb.mesh.scale.set(1.3, 1.3, Math.max(0.5, dist));
          sb.mesh.visible = true;
          break;
        }
      }
    }

    // 更新三色剑丸飞剑弹药 & 命中特效 (庚金十字斩 / 天雷连锁雷环 / 赤炎火莲爆炸环)
    for (let i = 0; i < swordProjPool.length; i++) {
      const sp = swordProjPool[i];
      if (!sp.active) continue;
      sp.life -= safeDt;
      if (sp.life <= 0) {
        sp.active = false;
        sp.mesh.visible = false;
        continue;
      }

      const tm = monsterPool[sp.targetIdx];
      if (tm && tm.active) {
        sp.tx = tm.x;
        sp.ty = tm.isBoss ? 3.5 : 2.4;
        sp.tz = tm.z;
      }

      const dx = sp.tx - sp.x;
      const dy = sp.ty - sp.y;
      const dz = sp.tz - sp.z;
      const dist = Math.hypot(dx, dy, dz);

      if (dist < 1.3) {
        sp.active = false;
        sp.mesh.visible = false;
        spawnSparks(sp.tx, sp.ty, sp.tz, 4);
        if (sp.ammoType === 'gold') {
          spawnCrossSlash(sp.tx, sp.ty, sp.tz, cam);
        } else if (sp.ammoType === 'thunder') {
          spawnThunderRing(sp.tx, sp.tz);
        } else if (sp.ammoType === 'fire') {
          spawnFireLotus(sp.tx, sp.tz);
        }
        if (tm && tm.active) {
          damageMonster(sp.targetIdx, sp.damage);
        }
      } else {
        const step = sp.speed * safeDt;
        sp.x += (dx / dist) * step;
        sp.y += (dy / dist) * step;
        sp.z += (dz / dist) * step;
        sp.mesh.position.set(sp.x, sp.y, sp.z);
        sp.mesh.lookAt(sp.tx, sp.ty, sp.tz);
      }
    }

    // 更新敌方修士反击绯红剑气：抵达防线 (z <= 300) 时触发护山大阵拦截闪烁或损伤目标防御塔
    for (let i = 0; i < enemyShotPool.length; i++) {
      const es = enemyShotPool[i];
      if (!es.active) continue;
      es.life -= safeDt;
      if (es.life <= 0) {
        es.active = false;
        es.mesh.visible = false;
        continue;
      }

      es.x += es.vx * safeDt;
      es.y += es.vy * safeDt;
      es.z += es.vz * safeDt;
      es.mesh.position.set(es.x, es.y, es.z);

      if (es.z <= 300) {
        es.active = false;
        es.mesh.visible = false;
        const tur = SWORD_TURRETS[es.targetTurretIdx];
        if (!tur || tur.paralyzed || Math.random() < 0.6) {
          domeFlashTimer = 0.25;
          spawnSparks(es.x, es.y, es.z, 3);
        } else {
          tur.hp -= 25;
          spawnSparks(tur.x, tur.y, tur.z, 4);
          if (tur.hp <= 0) {
            tur.hp = 0;
            tur.paralyzed = true;
          }
        }
      }
    }

    // 更新剑丸激光剑气束脉冲衰减
    for (let i = 0; i < swordBeamPool.length; i++) {
      const sb = swordBeamPool[i];
      if (!sb.active) continue;
      sb.life -= safeDt;
      if (sb.life <= 0) {
        sb.active = false;
        sb.mesh.visible = false;
      } else {
        const f = sb.life / sb.maxLife;
        const pulse = (0.65 + 0.65 * Math.sin(t * 45 + i)) * f;
        const dist = Math.hypot(sb.ex - sb.sx, sb.ey - sb.sy, sb.ez - sb.sz);
        sb.mesh.scale.set(Math.max(0.2, pulse * 1.4), Math.max(0.2, pulse * 1.4), Math.max(0.5, dist));
      }
    }

    // 更新庚金破甲十字斩光效
    for (let i = 0; i < crossSlashPool.length; i++) {
      const cs = crossSlashPool[i];
      if (!cs.active) continue;
      cs.life -= safeDt;
      if (cs.life <= 0) {
        cs.active = false;
        cs.mesh.visible = false;
      } else {
        const norm = cs.life / cs.maxLife;
        cs.mesh.scale.setScalar(0.75 + (1 - norm) * 1.35);
        cs.mat.opacity = norm * 0.95;
      }
    }

    // 更新天雷 3 股雷霆电弧 (每帧随机抖动)
    for (let i = 0; i < lightningPool.length; i++) {
      const lb = lightningPool[i];
      if (!lb.active) continue;
      lb.life -= safeDt;
      if (lb.life <= 0) {
        lb.active = false;
        lb.mesh.visible = false;
      } else {
        updateLightningGeometry(lb);
      }
    }

    // 更新天雷落地连锁雷环闪烁
    for (let i = 0; i < thunderRingPool.length; i++) {
      const tr = thunderRingPool[i];
      if (!tr.active) continue;
      tr.life -= safeDt;
      if (tr.life <= 0) {
        tr.active = false;
        tr.mesh.visible = false;
      } else {
        const norm = tr.life / tr.maxLife;
        const expand = 0.65 + (1 - norm) * 1.85;
        tr.mesh.scale.setScalar(expand);
        tr.mat.opacity = norm * (0.55 + 0.45 * Math.abs(Math.sin(t * 50 + i)));
      }
    }

    // 更新赤炎落地赤红火莲爆炸环
    for (let i = 0; i < fireLotusPool.length; i++) {
      const fl = fireLotusPool[i];
      if (!fl.active) continue;
      fl.life -= safeDt;
      if (fl.life <= 0) {
        fl.active = false;
        fl.mesh.visible = false;
      } else {
        const norm = fl.life / fl.maxLife;
        const expand = 0.55 + (1 - norm) * 1.75;
        fl.mesh.scale.setScalar(expand);
        fl.mesh.rotation.y += 2.6 * safeDt;
        fl.outerMat.opacity = norm * 0.92;
        fl.innerMat.opacity = norm * 0.95;
      }
    }

    // 更新命中火花
    for (let i = 0; i < sparkPool.length; i++) {
      const s = sparkPool[i];
      if (!s.active) continue;
      s.life += safeDt;
      if (s.life >= s.maxLife) {
        s.active = false;
        s.mesh.visible = false;
      } else {
        s.vy -= 18 * safeDt;
        s.mesh.position.x += s.vx * safeDt;
        s.mesh.position.y += s.vy * safeDt;
        s.mesh.position.z += s.vz * safeDt;
        s.mesh.scale.setScalar(1 - s.life / s.maxLife);
      }
    }

    // 更新死亡紫色烟尘
    for (let i = 0; i < dustPool.length; i++) {
      const d = dustPool[i];
      if (!d.active) continue;
      d.life += safeDt;
      if (d.life >= d.maxLife) {
        d.active = false;
        d.mesh.visible = false;
      } else {
        const f = d.life / d.maxLife;
        d.mesh.position.x += d.vx * safeDt;
        d.mesh.position.y += d.vy * safeDt;
        d.mesh.position.z += d.vz * safeDt;
        d.mesh.scale.setScalar(0.8 + f * 1.4);
      }
    }

    // 战利品灵匣发光旋转与衰老清理 (防止长时间无人拾取积压)
    for (let i = 0; i < bonePool.length; i++) {
      const b = bonePool[i];
      if (!b.active) continue;
      b.age += safeDt;
      if (b.chest) {
        b.chest.rotation.y += 1.6 * safeDt;
        b.chest.position.y = Math.sin(t * 3.2 + i) * 0.08;
      }
      if (!b.claimed && b.age > 24) {
        b.active = false;
        b.mesh.visible = false;
      }
    }

    // 三分支折纸仙鹤状态机：2×收尸鹤(白+翠玉) / 1×补弹鹤(白+赤金) / 1×修塔鹤(白+青蓝)
    for (let i = 0; i < cranePool.length; i++) {
      const c = cranePool[i];
      const pur = PURIFIERS[c.purifierIdx];

      // 宽大三角折纸双翼优雅滑翔扇动 (t * 3.5)
      const flap = Math.sin(t * 3.5 + c.phase) * 0.36;
      c.wingL.rotation.z = -flap;
      c.wingR.rotation.z = flap;

      // 飞行/工作时消耗灵符燃料；fuel <= 25 时自动返航纸鹤赋能台充能
      if (c.state !== 'idle' && c.state !== 'refuel') {
        c.fuel = Math.max(0, c.fuel - safeDt * 4.5);
      }

      if (c.state === 'refuel') {
        const dx = c.homeX - c.x;
        const dz = c.homeZ - c.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.7 && c.refuelTimer <= 0) {
          const step = Math.min(dist, 7.6 * safeDt);
          c.x += (dx / dist) * step;
          c.z += (dz / dist) * step;
          c.y += (c.cruiseY - c.y) * Math.min(1, safeDt * 4.0);
          c.mesh.lookAt(c.homeX, c.y, c.homeZ);
          c.mesh.position.set(c.x, c.y, c.z);
          updateCraneTrail(c);
        } else {
          if (c.refuelTimer <= 0) {
            c.x = c.homeX;
            c.z = c.homeZ;
            c.refuelTimer = 1.0;
            c.refuelPulseDone = false;
            spawnCranePulse(c.homeX, c.homeY + 0.6, c.homeZ, 0x38bdf8);
            spawnCranePulse(c.homeX, c.homeY + 0.9, c.homeZ, 0xfde047);
          } else {
            c.refuelTimer -= safeDt;
            c.y = c.homeY + 1.2 + Math.sin(t * 6.5 + c.phase) * 0.14;
            c.mesh.position.set(c.x, c.y, c.z);
            updateCraneTrail(c);
            if (!c.refuelPulseDone && c.refuelTimer <= 0.5) {
              c.refuelPulseDone = true;
              spawnCranePulse(c.homeX, c.homeY + 0.6, c.homeZ, 0xfde047);
            }
            if (c.refuelTimer <= 0) {
              c.fuel = 100;
              c.refuelTimer = 0;
              c.y = c.cruiseY;
              if (c.role === 'repair') {
                c.state = 'patrol_move';
              } else if (c.role === 'resupply') {
                c.state = 'hover_load';
                c.hoverTimer = 0.5;
              } else {
                c.mesh.visible = false;
                c.trailPoints.visible = false;
                c.state = 'idle';
              }
            }
          }
        }
        continue;
      }

      if (c.role === 'resupply') {
        const tur = SWORD_TURRETS[c.turretIdx] || SWORD_TURRETS[0];
        if (c.fuel <= 25 && (c.state === 'idle' || c.state === 'fly_to_base')) {
          c.carryPill.visible = false;
          c.refuelTimer = 0;
          c.state = 'refuel';
          continue;
        }
        if (c.state === 'idle' || c.state === 'fly_to_base') {
          const dx = c.homeX - c.x;
          const dz = c.homeZ - c.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.7) {
            c.x = c.homeX;
            c.z = c.homeZ;
            c.hoverTimer = 0.7;
            c.state = 'hover_load';
          } else {
            const step = Math.min(dist, 7.6 * safeDt);
            c.x += (dx / dist) * step;
            c.z += (dz / dist) * step;
            c.mesh.lookAt(c.homeX, c.y, c.homeZ);
          }
          c.mesh.position.set(c.x, c.y, c.z);
          updateCraneTrail(c);
        } else if (c.state === 'hover_load') {
          c.hoverTimer -= safeDt;
          c.mesh.position.set(c.x, c.cruiseY + Math.sin(t * 5.0 + c.phase) * 0.12, c.z);
          updateCraneTrail(c);
          if (c.hoverTimer <= 0) {
            c.carryPill.visible = true;
            c.turretIdx = (c.turretIdx + 1) % SWORD_TURRETS.length;
            c.state = 'fly_to_turret';
          }
        } else if (c.state === 'fly_to_turret') {
          const dx = tur.x - c.x;
          const dz = tur.z - c.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.7) {
            c.x = tur.x;
            c.z = tur.z;
            c.hoverTimer = 0.65;
            c.state = 'hover_drop_ammo';
          } else {
            const step = Math.min(dist, 7.8 * safeDt);
            c.x += (dx / dist) * step;
            c.z += (dz / dist) * step;
            c.mesh.lookAt(tur.x, c.y, tur.z);
          }
          c.mesh.position.set(c.x, c.y, c.z);
          updateCraneTrail(c);
        } else if (c.state === 'hover_drop_ammo') {
          c.hoverTimer -= safeDt;
          c.mesh.position.set(c.x, c.cruiseY - 1.2 + Math.sin(t * 5.0 + c.phase) * 0.1, c.z);
          updateCraneTrail(c);
          if (c.hoverTimer <= 0) {
            c.carryPill.visible = false;
            spawnCranePulse(tur.x, 8.8, tur.z, 0xfbbf24);
            c.state = 'fly_to_base';
          }
        }
        continue;
      }

      if (c.role === 'repair') {
        if (c.fuel <= 25 && (c.state === 'idle' || c.state === 'patrol_move')) {
          c.refuelTimer = 0;
          c.state = 'refuel';
          continue;
        }
        if (c.state === 'idle' || c.state === 'patrol_move') {
          // 优先抢修瘫痪炮塔，其次血量 < 80 的受损炮塔
          let priorityIdx = -1;
          let lowestHp = 80;
          for (let ti = 0; ti < SWORD_TURRETS.length; ti++) {
            const cand = SWORD_TURRETS[ti];
            if (cand.paralyzed) {
              priorityIdx = ti;
              break;
            }
            if (cand.hp < lowestHp) {
              lowestHp = cand.hp;
              priorityIdx = ti;
            }
          }
          if (priorityIdx !== -1) {
            c.turretIdx = priorityIdx;
          }

          const tur = SWORD_TURRETS[c.turretIdx] || SWORD_TURRETS[0];
          const dx = tur.x - c.x;
          const dz = tur.z - c.z;
          const dist = Math.hypot(dx, dz);
          if (dist < 0.7) {
            c.x = tur.x;
            c.z = tur.z;
            if (tur.paralyzed || tur.hp < 80) {
              c.hoverTimer = 1.2;
              c.repairPulseMidDone = false;
              spawnCranePulse(tur.x, 8.8, tur.z, 0x22d3ee);
              c.state = 'hover_repair';
            } else {
              // 全部防御塔健康时正常巡逻换点
              c.turretIdx = (c.turretIdx + 2) % SWORD_TURRETS.length;
              c.state = 'patrol_move';
            }
          } else {
            const step = Math.min(dist, (priorityIdx !== -1 ? 9.2 : 6.4) * safeDt);
            c.x += (dx / dist) * step;
            c.z += (dz / dist) * step;
            c.mesh.lookAt(tur.x, c.y, tur.z);
          }
          c.mesh.position.set(c.x, c.y, c.z);
          updateCraneTrail(c);
        } else if (c.state === 'hover_repair') {
          const tur = SWORD_TURRETS[c.turretIdx] || SWORD_TURRETS[0];
          c.hoverTimer -= safeDt;
          c.mesh.position.set(c.x, c.cruiseY - 0.8 + Math.sin(t * 4.5 + c.phase) * 0.12, c.z);
          updateCraneTrail(c);
          if (!c.repairPulseMidDone && c.hoverTimer <= 0.6) {
            c.repairPulseMidDone = true;
            spawnCranePulse(tur.x, 8.8, tur.z, 0x22d3ee);
          }
          if (c.hoverTimer <= 0) {
            tur.hp = 100;
            tur.paralyzed = false;
            spawnCranePulse(tur.x, 8.8, tur.z, 0x22d3ee);
            c.turretIdx = (c.turretIdx + 2) % SWORD_TURRETS.length;
            c.state = 'patrol_move';
          }
        }
        continue;
      }

      if (c.state === 'idle') {
        if (c.fuel <= 25) {
          c.refuelTimer = 0;
          c.mesh.position.set(c.x, c.y, c.z);
          c.mesh.visible = true;
          c.trailPoints.visible = true;
          resetCraneTrail(c, c.x, c.y, c.z, 0, 1);
          c.state = 'refuel';
          continue;
        }
        // 寻找未认领的战利品灵匣
        let foundIdx = -1;
        for (let bIdx = 0; bIdx < bonePool.length; bIdx++) {
          if (bonePool[bIdx].active && !bonePool[bIdx].claimed) {
            foundIdx = bIdx;
            break;
          }
        }
        if (foundIdx !== -1) {
          bonePool[foundIdx].claimed = true;
          c.boneIdx = foundIdx;
          c.x = c.homeX;
          c.y = c.homeY;
          c.z = c.homeZ;
          c.carryBone.visible = false;
          c.mesh.position.set(c.x, c.y, c.z);
          c.mesh.visible = true;
          c.trailPoints.visible = true;
          resetCraneTrail(c, c.x, c.y, c.z, 0, 1);
          c.state = 'ascend_out';
        }
      } else if (c.state === 'ascend_out') {
        c.y += 4.5 * safeDt;
        if (c.y >= c.cruiseY) {
          c.y = c.cruiseY;
          c.state = 'cruise_out';
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'cruise_out') {
        const b = bonePool[c.boneIdx];
        if (!b || !b.active) {
          c.state = 'cruise_back';
          updateCraneTrail(c);
          continue;
        }
        const dx = b.x - c.x;
        const dz = b.z - c.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.6) {
          c.x = b.x;
          c.z = b.z;
          c.state = 'descend_pick';
        } else {
          const step = Math.min(dist, 6.8 * safeDt);
          c.x += (dx / dist) * step;
          c.z += (dz / dist) * step;
          c.mesh.lookAt(b.x, c.y, b.z);
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'descend_pick') {
        c.y -= 4.5 * safeDt;
        if (c.y <= 2.0) {
          c.y = 2.0;
          const b = bonePool[c.boneIdx];
          if (b && b.active) {
            b.active = false;
            b.claimed = false;
            b.mesh.visible = false;
            c.carryBone.visible = true;
          }
          c.hoverTimer = 0.85;
          c.state = 'hover_pick';
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'hover_pick') {
        c.hoverTimer -= safeDt;
        const hoverBob = Math.sin(t * 5.0 + c.phase) * 0.08;
        c.mesh.position.set(c.x, 2.0 + hoverBob, c.z);
        updateCraneTrail(c);
        if (c.hoverTimer <= 0) {
          c.y = 2.0;
          c.state = 'ascend_back';
        }
      } else if (c.state === 'ascend_back') {
        c.y += 4.5 * safeDt;
        if (c.y >= c.cruiseY) {
          c.y = c.cruiseY;
          c.state = 'cruise_back';
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'cruise_back') {
        const dx = pur.x - c.x;
        const dz = pur.z - c.z;
        const dist = Math.hypot(dx, dz);
        if (dist < 0.6) {
          c.x = pur.x;
          c.z = pur.z;
          c.state = 'descend_drop';
        } else {
          const step = Math.min(dist, 6.8 * safeDt);
          c.x += (dx / dist) * step;
          c.z += (dz / dist) * step;
          c.mesh.lookAt(pur.x, c.y, pur.z);
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'descend_drop') {
        c.y -= 4.5 * safeDt;
        if (c.y <= pur.y + 0.6) {
          c.y = pur.y + 0.6;
          c.hoverTimer = 0.6;
          c.state = 'hover_drop';
        }
        c.mesh.position.set(c.x, c.y, c.z);
        updateCraneTrail(c);
      } else if (c.state === 'hover_drop') {
        c.hoverTimer -= safeDt;
        const hoverBob = Math.sin(t * 5.0 + c.phase) * 0.06;
        c.mesh.position.set(c.x, pur.y + 0.6 + hoverBob, c.z);
        updateCraneTrail(c);
        if (c.hoverTimer <= 0) {
          if (c.carryBone.visible) {
            stats.harvested++;
            pur.glowTimer = 0.8;
            c.carryBone.visible = false;
          }
          c.boneIdx = -1;
          if (c.fuel <= 25) {
            c.refuelTimer = 0;
            c.state = 'refuel';
          } else {
            c.mesh.visible = false;
            c.trailPoints.visible = false;
            c.state = 'idle';
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // 6. DOMContentLoaded 监听与轮询等待 World3D.isReady()
  // ------------------------------------------------------------------
  function startWaitForWorld3D() {
    if (initialized) return;
    if (window.World3D && typeof window.World3D.isReady === 'function' && window.World3D.isReady()) {
      init3DScene();
      return;
    }
    const timer = setInterval(() => {
      if (initialized) {
        clearInterval(timer);
        return;
      }
      if (window.World3D && typeof window.World3D.isReady === 'function' && window.World3D.isReady()) {
        clearInterval(timer);
        init3DScene();
      }
    }, 150);
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startWaitForWorld3D);
    } else {
      startWaitForWorld3D();
    }
  }

  // ------------------------------------------------------------------
  // 7. 导出接口
  // ------------------------------------------------------------------
  if (typeof window !== 'undefined') {
    window.CombatZoneFX = {
      getStats: () => ({
        activeMonsters: stats.activeMonsters,
        kills: stats.kills,
        harvested: stats.harvested
      })
    };
  }
})();
