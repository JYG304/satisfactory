const KEYSTONE_TRAITS = {
  "keystone_furnace": {
    "id": "keystone_furnace",
    "name": "熔铸核心插件 · 高级",
    "category": "industry",
    "tag": "工业 · 熔铸",
    "icon": "fa-fire-burner",
    "color": "amber",
    "badgeClass": "bg-amber-100 text-amber-900 border-amber-400",
    "buffDesc": "熔炼能耗 -30% · 制造速度 +25%",
    "traitDesc": "全阵工业芯片≥4时触发无损淬火，废料产出减少 100%",
    "buff": {
      "power_cut": 30,
      "craft_speed": 25
    },
    "beamColor": "gold"
  },
  "keystone_logistics": {
    "id": "keystone_logistics",
    "name": "物流核心插件 · 高级",
    "category": "industry",
    "tag": "工业 · 物流",
    "icon": "fa-dolly",
    "color": "sky",
    "badgeClass": "bg-sky-100 text-sky-900 border-sky-400",
    "buffDesc": "传送速度 +50% · 储物背包 +8格",
    "traitDesc": "光束贯通全盘时，货运飞剑解锁空间折跃",
    "buff": {
      "belt_speed": 50,
      "inventory": 8
    },
    "beamColor": "cyan"
  },
  "keystone_assembly": {
    "id": "keystone_assembly",
    "name": "量产核心插件 · 高级",
    "category": "industry",
    "tag": "工业 · 量产",
    "icon": "fa-cubes-stacked",
    "color": "emerald",
    "badgeClass": "bg-emerald-100 text-emerald-900 border-emerald-400",
    "buffDesc": "装配与制造基础产出 +30%",
    "traitDesc": "全盘闭环时，每次生产有 15% 概率获得双倍成品暴击",
    "buff": {
      "craft_speed": 30
    },
    "beamColor": "emerald"
  },
  "keystone_leyline": {
    "id": "keystone_leyline",
    "name": "聚灵核心插件 · 高级",
    "category": "industry",
    "tag": "能源 · 聚灵",
    "icon": "fa-bolt",
    "color": "sky",
    "badgeClass": "bg-sky-100 text-sky-900 border-sky-400",
    "buffDesc": "全厂供能 +40% · 污染排放 -25%",
    "traitDesc": "传输损耗清零，全阵星宿倍率额外 +0.3x",
    "buff": {
      "power_cut": 25,
      "pollute_cut": 25
    },
    "beamColor": "cyan"
  },
  "keystone_void_reap": {
    "id": "keystone_void_reap",
    "name": "裂解核心插件 · 高级",
    "category": "industry",
    "tag": "环保 · 裂解",
    "icon": "fa-atom",
    "color": "purple",
    "badgeClass": "bg-purple-100 text-purple-900 border-purple-400",
    "buffDesc": "废料清零 · 宗门灵石产出 +35%",
    "traitDesc": "废料与残渣直接转化为纯净灵精，产线永不故障",
    "buff": {
      "burn_speed": 35,
      "pollute_cut": 30
    },
    "beamColor": "purple"
  },
  "keystone_sword_array": {
    "id": "keystone_sword_array",
    "name": "飞剑核心插件 · 高级",
    "category": "combat",
    "tag": "战伐 · 飞剑",
    "icon": "fa-shield-virus",
    "color": "purple",
    "badgeClass": "bg-purple-100 text-purple-900 border-purple-400",
    "buffDesc": "浮游飞剑 +2把 · 飞剑攻击 +40%",
    "traitDesc": "每次步进从核位射出一道贯穿引雷剑气",
    "buff": {
      "sword_funnel": 2,
      "atk": 40
    },
    "beamColor": "purple"
  },
  "keystone_aegis": {
    "id": "keystone_aegis",
    "name": "防御核心插件 · 高级",
    "category": "combat",
    "tag": "防卫 · 护盾",
    "icon": "fa-shield-halved",
    "color": "rose",
    "badgeClass": "bg-rose-100 text-rose-900 border-rose-400",
    "buffDesc": "阵法防御 +50% · 最大气血 +50%",
    "traitDesc": "受到致命伤免疫死亡；全阵防御的 50% 转化为反震真伤",
    "buff": {
      "def": 50,
      "hp": 50
    },
    "beamColor": "rose"
  },
  "keystone_alchemy": {
    "id": "keystone_alchemy",
    "name": "炼丹核心插件 · 高级",
    "category": "living",
    "tag": "生产 · 炼丹",
    "icon": "fa-flask-round-potion",
    "color": "amber",
    "badgeClass": "bg-amber-100 text-amber-900 border-amber-400",
    "buffDesc": "采矿产出 +25% · 御剑体力 +30%",
    "traitDesc": "炼制高阶丹药耗材减半，全宗弟子修炼速度 +35%",
    "buff": {
      "mining_speed": 25,
      "stamina": 30
    },
    "beamColor": "gold"
  },
  "keystone_pocket": {
    "id": "keystone_pocket",
    "name": "储物核心插件 · 高级",
    "category": "mobility",
    "tag": "身法 · 储物",
    "icon": "fa-box-open",
    "color": "indigo",
    "badgeClass": "bg-indigo-100 text-indigo-900 border-indigo-400",
    "buffDesc": "储物背包 +24格 · 采矿速度 +40%",
    "traitDesc": "全图掉落物自动磁吸拾取，御剑体力消耗减半",
    "buff": {
      "inventory": 24,
      "mining_speed": 40,
      "stamina": 20
    },
    "beamColor": "cyan"
  },
  "keystone_divination": {
    "id": "keystone_divination",
    "name": "神机核心插件 · 高级",
    "category": "mobility",
    "tag": "探测 · 暴击",
    "icon": "fa-eye",
    "color": "amber",
    "badgeClass": "bg-amber-100 text-amber-900 border-amber-400",
    "buffDesc": "暴击几率 +25% · 飞行电池 +30%",
    "traitDesc": "全图地脉高纯度矿点与远古秘境直接透视高亮",
    "buff": {
      "crit": 25,
      "flight_battery": 30
    },
    "beamColor": "gold"
  }
};