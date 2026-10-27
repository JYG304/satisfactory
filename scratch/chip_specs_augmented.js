const CHIP_SPECS = {
  "core_support": {
    "id": "core_support",
    "step": 1,
    "tier": 3,
    "category": "mobility",
    "name": "【辅助灵枢极核】",
    "tag": "充能核心 · 跨盘导入",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-funnel border-sky-400",
    "buff": { "speed": 20, "flight_battery": 40 },
    "buffDesc": "激活辅助盘➔目标盘高能光路导入线！",
    "stepDesc": "外置于外圈插槽即可引接高能光束",
    "icon": "fa-diamond",
    "textColor": "text-sky-300",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-400"
  },
  "core_industry": {
    "id": "core_industry",
    "step": 1,
    "tier": 3,
    "category": "industry",
    "name": "【工厂构形极核】",
    "tag": "充能核心 · 跨盘导入",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-belt border-amber-400",
    "buff": { "craft_speed": 35, "mining_speed": 35 },
    "buffDesc": "激活工厂盘➔攻击盘高能光路导入线！",
    "stepDesc": "外置于外圈插槽即可引接高能光束",
    "icon": "fa-sun",
    "textColor": "text-amber-300",
    "badgeColor": "bg-amber-50 text-amber-800 border-amber-400"
  },
  "core_combat": {
    "id": "core_combat",
    "step": 1,
    "tier": 3,
    "category": "combat",
    "name": "【战伐诛仙极核】",
    "tag": "终极核心 · 阵眼贯通",
    "type": "keystone",
    "shape": "shape-diamond",
    "matClass": "token-atk border-rose-400",
    "buff": { "atk": 50, "crit": 25 },
    "buffDesc": "全阵大贯通，攻击力与暴击狂暴倍率提升！",
    "stepDesc": "战伐中心大圆满核心",
    "icon": "fa-crosshairs",
    "textColor": "text-rose-300",
    "badgeColor": "bg-rose-50 text-rose-800 border-rose-400"
  },

  "t0_atk_1": {
    "id": "t0_atk_1",
    "step": 1,
    "tier": 0,
    "category": "combat",
    "name": "攻击芯片 · 初级",
    "tag": "攻击 · 1格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-amber-400",
    "buff": {
      "atk": 5
    },
    "buffDesc": "飞剑攻击 +5%",
    "stepDesc": "顺步 +1 格",
    "icon": "fa-khanda",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-50 text-amber-900 border-amber-400"
  },
  "t0_mine_1": {
    "id": "t0_mine_1",
    "step": 1,
    "tier": 0,
    "category": "industry",
    "name": "采矿芯片 · 初级",
    "tag": "采矿 · 1格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-amber-400",
    "buff": {
      "mining_speed": 5
    },
    "buffDesc": "采矿速度 +5%",
    "stepDesc": "顺步 +1 格",
    "icon": "fa-trowel-bricks",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-50 text-amber-900 border-amber-400"
  },
  "t0_speed_1": {
    "id": "t0_speed_1",
    "step": 1,
    "tier": 0,
    "category": "mobility",
    "name": "移速芯片 · 初级",
    "tag": "移速 · 1格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-amber-400",
    "buff": {
      "speed": 5
    },
    "buffDesc": "移动速度 +5%",
    "stepDesc": "顺步 +1 格",
    "icon": "fa-wind",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-50 text-amber-900 border-amber-400"
  },
  "t0_craft_1": {
    "id": "t0_craft_1",
    "step": 1,
    "tier": 0,
    "category": "industry",
    "name": "制造芯片 · 初级",
    "tag": "制造 · 1格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-amber-400",
    "buff": {
      "craft_speed": 5
    },
    "buffDesc": "制造速度 +5%",
    "stepDesc": "顺步 +1 格",
    "icon": "fa-gears",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-50 text-amber-900 border-amber-400"
  },
  "t0_atspd_2": {
    "id": "t0_atspd_2",
    "step": 2,
    "tier": 0,
    "category": "combat",
    "name": "攻速芯片 · 初级",
    "tag": "攻速 · 2格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "atspd": 8
    },
    "buffDesc": "攻击速度 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-bolt-lightning",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t0_def_2": {
    "id": "t0_def_2",
    "step": 2,
    "tier": 0,
    "category": "combat",
    "name": "防御芯片 · 初级",
    "tag": "防御 · 2格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-sky-400",
    "buff": {
      "def": 8
    },
    "buffDesc": "阵法防御 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-shield-halved",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t0_belt_2": {
    "id": "t0_belt_2",
    "step": 2,
    "tier": 0,
    "category": "industry",
    "name": "传送带芯片 · 初级",
    "tag": "传送 · 2格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "belt_speed": 8
    },
    "buffDesc": "传送速度 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-dolly",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t0_burn_2": {
    "id": "t0_burn_2",
    "step": 2,
    "tier": 0,
    "category": "industry",
    "name": "燃烧芯片 · 初级",
    "tag": "燃烧 · 2格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "burn_speed": 8
    },
    "buffDesc": "燃烧能效 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-fire",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t0_mine_2": {
    "id": "t0_mine_2",
    "step": 2,
    "tier": 0,
    "category": "industry",
    "name": "采矿芯片 · 初级",
    "tag": "采矿 · 2格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "mining_speed": 8
    },
    "buffDesc": "采矿速度 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-trowel-bricks",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t0_craft_2": {
    "id": "t0_craft_2",
    "step": 2,
    "tier": 0,
    "category": "industry",
    "name": "制造芯片 · 初级",
    "tag": "制造 · 2格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "craft_speed": 8
    },
    "buffDesc": "制造速度 +8%",
    "stepDesc": "顺步 +2 格",
    "icon": "fa-gears",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-900 border-sky-400"
  },
  "t1_atk_3": {
    "id": "t1_atk_3",
    "step": 3,
    "tier": 1,
    "category": "combat",
    "name": "攻击芯片 · 中级",
    "tag": "攻击 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-slate-700",
    "buff": {
      "atk": 10
    },
    "buffDesc": "飞剑攻击 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-khanda",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_atspd_3": {
    "id": "t1_atspd_3",
    "step": 3,
    "tier": 1,
    "category": "combat",
    "name": "攻速芯片 · 中级",
    "tag": "攻速 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-slate-700",
    "buff": {
      "atspd": 10
    },
    "buffDesc": "攻击速度 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-bolt-lightning",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_def_3": {
    "id": "t1_def_3",
    "step": 3,
    "tier": 1,
    "category": "combat",
    "name": "防御芯片 · 中级",
    "tag": "防御 · 3格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-slate-700",
    "buff": {
      "def": 10
    },
    "buffDesc": "阵法防御 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-shield-halved",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_hp_3": {
    "id": "t1_hp_3",
    "step": 3,
    "tier": 1,
    "category": "combat",
    "name": "生命芯片 · 中级",
    "tag": "生命 · 3格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-slate-700",
    "buff": {
      "hp": 10
    },
    "buffDesc": "灵脉气血 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-heart-pulse",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_crit_3": {
    "id": "t1_crit_3",
    "step": 3,
    "tier": 1,
    "category": "combat",
    "name": "暴击芯片 · 中级",
    "tag": "暴击 · 3格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-slate-700",
    "buff": {
      "crit": 10
    },
    "buffDesc": "暴击几率 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-crosshairs",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_speed_3": {
    "id": "t1_speed_3",
    "step": 3,
    "tier": 1,
    "category": "mobility",
    "name": "移速芯片 · 中级",
    "tag": "移速 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-slate-700",
    "buff": {
      "speed": 10
    },
    "buffDesc": "移动速度 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-wind",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_stamina_3": {
    "id": "t1_stamina_3",
    "step": 3,
    "tier": 1,
    "category": "mobility",
    "name": "体力芯片 · 中级",
    "tag": "体力 · 3格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-slate-700",
    "buff": {
      "stamina": 10
    },
    "buffDesc": "御剑体力 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-person-running",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_battery_3": {
    "id": "t1_battery_3",
    "step": 3,
    "tier": 1,
    "category": "mobility",
    "name": "电量芯片 · 初级",
    "tag": "电量 · 3格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-belt border-slate-700",
    "buff": {
      "flight_battery": 15
    },
    "buffDesc": "飞行电池 +15%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-battery-half",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_inventory_3": {
    "id": "t1_inventory_3",
    "step": 3,
    "tier": 1,
    "category": "mobility",
    "name": "背包芯片 · 中级",
    "tag": "背包 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-def border-slate-700",
    "buff": {
      "inventory": 4
    },
    "buffDesc": "储物背包 +4格",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-box-open",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_craft_3": {
    "id": "t1_craft_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "制造芯片 · 中级",
    "tag": "制造 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-slate-700",
    "buff": {
      "craft_speed": 10
    },
    "buffDesc": "制造速度 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-gears",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_mine_3": {
    "id": "t1_mine_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "采矿芯片 · 中级",
    "tag": "采矿 · 3格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-slate-700",
    "buff": {
      "mining_speed": 10
    },
    "buffDesc": "采矿速度 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-trowel-bricks",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_burn_3": {
    "id": "t1_burn_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "燃烧芯片 · 中级",
    "tag": "燃烧 · 3格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-slate-700",
    "buff": {
      "burn_speed": 10
    },
    "buffDesc": "燃烧能效 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-fire",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_belt_3": {
    "id": "t1_belt_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "传送带芯片 · 中级",
    "tag": "传送 · 3格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-slate-700",
    "buff": {
      "belt_speed": 10
    },
    "buffDesc": "传送速度 +10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-dolly",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_power_3": {
    "id": "t1_power_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "节能芯片 · 中级",
    "tag": "节能 · 3格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-slate-700",
    "buff": {
      "power_cut": 10
    },
    "buffDesc": "用电能耗 -10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-bolt",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t1_pollute_3": {
    "id": "t1_pollute_3",
    "step": 3,
    "tier": 1,
    "category": "industry",
    "name": "环保芯片 · 中级",
    "tag": "环保 · 3格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-slate-700",
    "buff": {
      "pollute_cut": 10
    },
    "buffDesc": "污染排放 -10%",
    "stepDesc": "顺步 +3 格",
    "icon": "fa-leaf",
    "textColor": "text-slate-900",
    "badgeColor": "bg-slate-100 text-slate-800 border-slate-300"
  },
  "t2_atk_5": {
    "id": "t2_atk_5",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "攻击芯片 · 中级",
    "tag": "攻击 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "atk": 20
    },
    "buffDesc": "飞剑攻击 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-khanda",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_atspd_5": {
    "id": "t2_atspd_5",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "攻速芯片 · 高级",
    "tag": "攻速 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "atspd": 20
    },
    "buffDesc": "攻击速度 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-bolt-lightning",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_def_5": {
    "id": "t2_def_5",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "防御芯片 · 高级",
    "tag": "防御 · 5格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-sky-400",
    "buff": {
      "def": 20
    },
    "buffDesc": "阵法防御 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-shield-halved",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_hp_5": {
    "id": "t2_hp_5",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "生命芯片 · 高级",
    "tag": "生命 · 5格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-sky-400",
    "buff": {
      "hp": 20
    },
    "buffDesc": "灵脉气血 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-heart-pulse",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_crit_5": {
    "id": "t2_crit_5",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "暴击芯片 · 高级",
    "tag": "暴击 · 5格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "crit": 20
    },
    "buffDesc": "暴击几率 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-crosshairs",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_sword_funnel_1": {
    "id": "t2_sword_funnel_1",
    "step": 5,
    "tier": 2,
    "category": "combat",
    "name": "飞剑芯片 · 中级",
    "tag": "飞剑 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-funnel border-sky-400",
    "buff": {
      "sword_funnel": 1
    },
    "buffDesc": "浮游飞剑 +1把",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-jet-fighter-up",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_speed_5": {
    "id": "t2_speed_5",
    "step": 5,
    "tier": 2,
    "category": "mobility",
    "name": "移速芯片 · 高级",
    "tag": "移速 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "speed": 20
    },
    "buffDesc": "移动速度 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-wind",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_battery_5": {
    "id": "t2_battery_5",
    "step": 5,
    "tier": 2,
    "category": "mobility",
    "name": "电量芯片 · 中级",
    "tag": "电量 · 5格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "flight_battery": 30
    },
    "buffDesc": "飞行电量 +30%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-battery-three-quarters",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_inventory_5": {
    "id": "t2_inventory_5",
    "step": 5,
    "tier": 2,
    "category": "mobility",
    "name": "背包芯片 · 高级",
    "tag": "背包 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-def border-sky-400",
    "buff": {
      "inventory": 8
    },
    "buffDesc": "储物背包 +8格",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-box-open",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_craft_5": {
    "id": "t2_craft_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "制造芯片 · 中级",
    "tag": "制造 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "craft_speed": 20
    },
    "buffDesc": "制造速度 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-gears",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_mine_5": {
    "id": "t2_mine_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "采矿芯片 · 中级",
    "tag": "采矿 · 5格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "mining_speed": 20
    },
    "buffDesc": "采矿速度 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-trowel-bricks",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_burn_5": {
    "id": "t2_burn_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "燃烧芯片 · 高级",
    "tag": "燃烧 · 5格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-sky-400",
    "buff": {
      "burn_speed": 20
    },
    "buffDesc": "燃烧能效 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-fire",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_belt_5": {
    "id": "t2_belt_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "传送带芯片 · 高级",
    "tag": "传送 · 5格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-sky-400",
    "buff": {
      "belt_speed": 20
    },
    "buffDesc": "传送速度 +20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-dolly",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_power_5": {
    "id": "t2_power_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "节能芯片 · 高级",
    "tag": "节能 · 5格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-sky-400",
    "buff": {
      "power_cut": 20
    },
    "buffDesc": "用电能耗 -20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-bolt",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t2_pollute_5": {
    "id": "t2_pollute_5",
    "step": 5,
    "tier": 2,
    "category": "industry",
    "name": "环保芯片 · 高级",
    "tag": "环保 · 5格",
    "type": "step",
    "shape": "shape-circle",
    "matClass": "token-def border-sky-400",
    "buff": {
      "pollute_cut": 20
    },
    "buffDesc": "污染排放 -20%",
    "stepDesc": "顺步 +5 格",
    "icon": "fa-leaf",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-50 text-sky-800 border-sky-300"
  },
  "t3_atk_8": {
    "id": "t3_atk_8",
    "step": 8,
    "tier": 3,
    "category": "combat",
    "name": "攻击芯片 · 高级",
    "tag": "攻击 · 8格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-atk border-amber-400",
    "buff": {
      "atk": 30
    },
    "buffDesc": "飞剑攻击 +30%",
    "stepDesc": "顺步 +8 格",
    "icon": "fa-khanda",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-400 font-black"
  },
  "t3_sword_funnel_2": {
    "id": "t3_sword_funnel_2",
    "step": 8,
    "tier": 3,
    "category": "combat",
    "name": "飞剑芯片 · 高级",
    "tag": "飞剑 · 8格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-funnel border-amber-400",
    "buff": {
      "sword_funnel": 2
    },
    "buffDesc": "浮游飞剑 +2把",
    "stepDesc": "顺步 +8 格",
    "icon": "fa-jet-fighter-up",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-400 font-black"
  },
  "t3_battery_8": {
    "id": "t3_battery_8",
    "step": 8,
    "tier": 3,
    "category": "mobility",
    "name": "电量芯片 · 高级",
    "tag": "电量 · 8格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-belt border-amber-400",
    "buff": {
      "flight_battery": 50
    },
    "buffDesc": "飞行电量 +50%",
    "stepDesc": "顺步 +8 格",
    "icon": "fa-battery-full",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-400 font-black"
  },
  "t3_craft_8": {
    "id": "t3_craft_8",
    "step": 8,
    "tier": 3,
    "category": "industry",
    "name": "制造芯片 · 高级",
    "tag": "制造 · 8格",
    "type": "step",
    "shape": "shape-square",
    "matClass": "token-belt border-amber-400",
    "buff": {
      "craft_speed": 30
    },
    "buffDesc": "制造速度 +30%",
    "stepDesc": "顺步 +8 格",
    "icon": "fa-gears",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-400 font-black"
  },
  "t3_mine_8": {
    "id": "t3_mine_8",
    "step": 8,
    "tier": 3,
    "category": "industry",
    "name": "采矿芯片 · 高级",
    "tag": "采矿 · 8格",
    "type": "step",
    "shape": "shape-diamond",
    "matClass": "token-atk border-amber-400",
    "buff": {
      "mining_speed": 30
    },
    "buffDesc": "采矿速度 +30%",
    "stepDesc": "顺步 +8 格",
    "icon": "fa-trowel-bricks",
    "textColor": "text-slate-900",
    "badgeColor": "bg-amber-100 text-amber-900 border-amber-400 font-black"
  },
  "chip_triangle_in": {
    "id": "chip_triangle_in",
    "step": 0,
    "tier": 1,
    "category": "utility",
    "name": "向心变轨镜 · 初级",
    "tag": "变轨 · 向心",
    "type": "shift_in",
    "shape": "shape-triangle",
    "matClass": "token-shift border-sky-400",
    "buff": {},
    "buffDesc": "导向内环 / 跨盘外挂",
    "stepDesc": "折射光流至相邻内圈",
    "icon": "fa-play",
    "textColor": "text-slate-900",
    "badgeColor": "bg-sky-100 text-sky-900 border-sky-400"
  }
};