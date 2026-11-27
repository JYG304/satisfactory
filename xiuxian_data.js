// ==========================================================================
// 《修仙工厂》官方策划数据表 (由 02_数值与配置数据表/ 八表自动同步生成)
// 数据来源: item_table.xlsx | bd_table.xlsx | recipe_table.xlsx | facility_rule_table.xlsx |
//           relic_scroll_table.xlsx | ue5_building_merge_table.xlsx | fabao_table.xlsx | world_map_poi_table.xlsx
// ==========================================================================

const XIUXIAN_ITEMS = {
  "MAT_001": {
    "id": "MAT_001",
    "matId": "MAT_001",
    "name": "玄铁矿",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-stone-400",
    "obtainDesc": "可在地图矿脉手工采集；解锁采矿机后可自动开采。",
    "desc": "精炼炉炼制玄铁锭的矿物原料。",
    "stack": 200
  },
  "MAT_002": {
    "id": "MAT_002",
    "matId": "MAT_002",
    "name": "赤铜矿",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-amber-600",
    "obtainDesc": "可在赤铜矿脉采集；解锁采矿机后可自动开采。",
    "desc": "精炼炉与操作台炼制赤铜锭的矿物原料。",
    "stack": 200
  },
  "MAT_004": {
    "id": "MAT_004",
    "matId": "MAT_003",
    "name": "煤炭",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cubes text-zinc-600",
    "obtainDesc": "可从煤矿采集，解锁采矿机后可自动开采。",
    "desc": "燃料发电机与灵力引擎的燃料，也可用于高温冶炼精炼玄铁锭与人造灵石。",
    "stack": 200
  },
  "MAT_006": {
    "id": "MAT_006",
    "matId": "MAT_004",
    "name": "玄铁锭",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-square text-stone-300",
    "obtainDesc": "由精炼炉将玄铁矿炼制获得；也可在操作台启动制作。",
    "desc": "制作玄铁板、玄铁齿轮、玄铁梁、玄铁粉、玄铁剑丸和精炼玄铁锭。",
    "stack": 100
  },
  "MAT_007": {
    "id": "MAT_007",
    "matId": "MAT_005",
    "name": "赤铜锭",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-square text-amber-500",
    "obtainDesc": "由精炼炉将赤铜矿炼制获得；也可在操作台手工制作。",
    "desc": "制作导灵铜片、铜线和高温合金锭的基础金属材料。",
    "stack": 100
  },
  "MAT_008": {
    "id": "MAT_008",
    "matId": "MAT_006",
    "name": "玄铁板",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-sheet-plastic text-stone-300",
    "obtainDesc": "由加工台将玄铁锭加工获得；也可在操作台手工制作。",
    "desc": "建造底座、传送系统、抽水机、采矿机和各类机器设备。",
    "stack": 100
  },
  "MAT_009": {
    "id": "MAT_009",
    "matId": "MAT_007",
    "name": "玄铁粉",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-braille text-zinc-400",
    "obtainDesc": "由粉碎机将玄铁锭粉碎获得。",
    "desc": "制作耐火炉芯、灵磁齿轮、电磁线圈、净化剂和玄铁剑丸。",
    "stack": 200
  },
  "MAT_011": {
    "id": "MAT_011",
    "matId": "MAT_008",
    "name": "玄铁齿轮",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-gear text-stone-300",
    "obtainDesc": "由加工台将玄铁锭加工获得；也可在操作台制作。",
    "desc": "制作耐火炉芯、玄铁管、机壳、传动轴和灵磁齿轮。",
    "stack": 100
  },
  "MAT_012": {
    "id": "MAT_012",
    "matId": "MAT_009",
    "name": "灵磁齿轮",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-gear text-cyan-400 animate-spin",
    "obtainDesc": "由加工台用玄铁齿轮和玄铁粉制作；也可在操作台手工制作。",
    "desc": "机器传动核心，供采矿机、切割机、传动带和组装机等设备建造使用。",
    "stack": 100
  },
  "MAT_013": {
    "id": "MAT_013",
    "matId": "MAT_010",
    "name": "导灵铜片",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-layer-group text-yellow-300",
    "obtainDesc": "由切割机将赤铜锭加工获得。",
    "desc": "制作生物芯片、电路板和探矿仪。",
    "stack": 100
  },
  "MAT_014": {
    "id": "MAT_014",
    "matId": "MAT_011",
    "name": "玄铁梁",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cubes-stacked text-stone-400",
    "obtainDesc": "由加工台或操作台将玄铁锭加工获得。",
    "desc": "建造底座、支撑、玄铁架、风力发电机和渡劫台等重型结构。",
    "stack": 100
  },
  "mat_012": {
    "id": "mat_012",
    "matId": "MAT_012",
    "name": "阀门",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁管和电路板制作。",
    "desc": "解构机、培养仓、离心机等带管路设备的通用阀门接口。",
    "stack": 100
  },
  "mat_013": {
    "id": "mat_013",
    "matId": "MAT_013",
    "name": "电磁线圈",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用铜线和玄铁粉制作。",
    "desc": "制作高压电容、超频模块和飞剑防御塔、风力发电机等电力设备。",
    "stack": 100
  },
  "mat_014": {
    "id": "mat_014",
    "matId": "MAT_014",
    "name": "电路板",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用导灵铜片和电缆制作；也可在操作台启动制作。",
    "desc": "智能物流、加工台、组装机、飞剑防御塔和能源设备的控制板。",
    "stack": 100
  },
  "mat_015": {
    "id": "mat_015",
    "matId": "MAT_015",
    "name": "生物芯片",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用脑髓和导灵铜片制作。",
    "desc": "制作中控芯片、灵根支架和跨区传送门的生物电子芯片。",
    "stack": 100
  },
  "MAT_019": {
    "id": "MAT_019",
    "matId": "MAT_016",
    "name": "铜线",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-ring text-amber-500",
    "obtainDesc": "由切割机将赤铜锭加工获得；也可在操作台手工制作。",
    "desc": "制作电磁线圈、电缆、智能物流、风力发电机和楼梯。",
    "stack": 200
  },
  "MAT_020": {
    "id": "MAT_020",
    "matId": "MAT_017",
    "name": "练气修士尸体",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-user-injured text-rose-400",
    "obtainDesc": "由战斗击败练气修士掉落，或由飞剑防御塔消耗玄铁剑丸自动猎杀收集。",
    "desc": "解构机的基础生物输入，可拆解出血肉、骸骨和脑髓。",
    "stack": 20
  },
  "mat_018": {
    "id": "mat_018",
    "matId": "MAT_018",
    "name": "血肉",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由解构机分解练气、筑基或金丹修士尸体获得。",
    "desc": "提取器的固体输入，用于制作蛋白液；也是炼丹炉炼制气血丹的原料。",
    "stack": 100
  },
  "MAT_022": {
    "id": "MAT_022",
    "matId": "MAT_019",
    "name": "脑髓",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-network-wired text-indigo-300",
    "obtainDesc": "由解构机分解修士尸体获得。",
    "desc": "在加工台制作生物芯片，或在解构机中解析出解析数据。",
    "stack": 100
  },
  "MAT_023": {
    "id": "MAT_023",
    "matId": "MAT_020",
    "name": "解析数据",
    "category": "研究货币",
    "form": "数字货币",
    "icon": "fa-solid fa-database text-sky-300",
    "obtainDesc": "由解构机解析脑髓获得，也可由炼宝台祭炼法宝胚副产。",
    "desc": "提交中央处理器转化为研究点，用于境界里程碑与配方解锁。",
    "stack": 9999
  },
  "mat_021": {
    "id": "mat_021",
    "matId": "MAT_021",
    "name": "骸骨",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由解构机分解练气修士尸体获得。",
    "desc": "用于建造培养皿、制作生物滤芯，或在培养仓培育人造经脉。",
    "stack": 100
  },
  "mat_022": {
    "id": "mat_022",
    "matId": "MAT_022",
    "name": "精元液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "由离心机分离原浆获得。",
    "desc": "用于培养仓培育人造经脉与灵根胚，或调制稳定液与凝丹液。",
    "stack": 100
  },
  "mat_023": {
    "id": "mat_023",
    "matId": "MAT_023",
    "name": "蛋白液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "由提取器用血肉和清水或净化水提取获得。",
    "desc": "用于搅拌机调制培养液和原浆，或炼丹炉炼制气血丹。",
    "stack": 100
  },
  "MAT_027": {
    "id": "MAT_027",
    "matId": "MAT_024",
    "name": "培养液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-bottle-water text-emerald-400",
    "obtainDesc": "由搅拌机用清水或净化水与蛋白液、灵草液调配获得。",
    "desc": "培养皿种植灵草和培养仓培育血胎的培养液输入。",
    "stack": 100
  },
  "MAT_028": {
    "id": "MAT_028",
    "matId": "MAT_025",
    "name": "灵草种子",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-seedling text-emerald-300",
    "obtainDesc": "首次在地图采集获得；放入培养皿母种槽常驻不消耗；也可用成熟灵草在加工台留种扩繁。",
    "desc": "放入培养皿(BD_141)母种槽常驻培育成熟灵草；亦可直接投入灵泉进行辐射诱变培育煞气灵草。",
    "stack": 100
  },
  "MAT_029": {
    "id": "MAT_029",
    "matId": "MAT_026",
    "name": "成熟灵草",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-spa text-emerald-400",
    "obtainDesc": "由培养皿种植灵草种子获得；加入木炭灰可使产量翻倍。",
    "desc": "在提取器提取灵草液，在培养皿培育煞气灵草，或在炼丹炉炼制气血丹。",
    "stack": 100
  },
  "mat_027": {
    "id": "mat_027",
    "matId": "MAT_027",
    "name": "血膏",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由离心机分离原浆获得。",
    "desc": "用于培养仓培育血胎、培养皿繁殖净化剂，或加工净化剂。",
    "stack": 100
  },
  "MAT_031": {
    "id": "MAT_031",
    "matId": "MAT_028",
    "name": "灵草液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-vial text-emerald-500",
    "obtainDesc": "由提取器处理成熟灵草和清水或净化水获得。",
    "desc": "用于搅拌机调配培养液和原浆。",
    "stack": 100
  },
  "mat_029": {
    "id": "mat_029",
    "matId": "MAT_029",
    "name": "原浆",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "由搅拌机混合蛋白液和灵草液获得。",
    "desc": "离心机分离精元液的原料，也可在培养仓用于高效扩繁血胎。",
    "stack": 100
  },
  "MAT_033": {
    "id": "MAT_033",
    "matId": "MAT_030",
    "name": "清水",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-blue-400",
    "obtainDesc": "由抽水机从地图清水节点持续抽取。",
    "desc": "流体生产用基础清水，供应蛋白液、灵草液和培养液配方。",
    "stack": 100
  },
  "MAT_034": {
    "id": "MAT_034",
    "matId": "MAT_031",
    "name": "血水",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-triangle-exclamation text-amber-600",
    "obtainDesc": "由提取器提取生物液体或培养仓培育人造经脉时副产。",
    "desc": "送入回收处理塔净化回收净化水、滤渣或浓缩为液态煞气。",
    "stack": 100
  },
  "mat_032": {
    "id": "mat_032",
    "matId": "MAT_032",
    "name": "血胎",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养仓用血膏和营养液培育获得。",
    "desc": "与骸骨和精元液在培养仓中共同培育人造经脉。",
    "stack": 100
  },
  "MAT_036": {
    "id": "MAT_036",
    "matId": "MAT_033",
    "name": "煞水",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-skull text-violet-500",
    "obtainDesc": "由离心机分离液态煞气，或培养仓培育灵根与金丹胚时副产。",
    "desc": "送入回收处理塔与净化剂中和处理，回收净化水与滤渣。",
    "stack": 100
  },
  "MAT_037": {
    "id": "MAT_037",
    "matId": "MAT_034",
    "name": "净化剂",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-broom text-teal-200",
    "obtainDesc": "由加工台用玄铁粉配合生物材料/滤渣/药渣制作，或由培养皿繁殖获得。",
    "desc": "回收处理塔净化废液和提炼液态煞气的消耗型净化剂。",
    "stack": 100
  },
  "MAT_038": {
    "id": "MAT_038",
    "matId": "MAT_035",
    "name": "净化水",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-300",
    "obtainDesc": "由回收处理塔净化血水或煞水回收获得。",
    "desc": "替代清水用于生物配方，更是培养煞气灵草、调制稳定液的必需活性水。",
    "stack": 100
  },
  "MAT_040": {
    "id": "MAT_040",
    "matId": "MAT_036",
    "name": "滤渣",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-trash-can text-stone-500",
    "obtainDesc": "由回收处理塔净化废液或处理药渣时副产。",
    "desc": "用于制作净化剂、爆裂剑丸、培育煞气灵草，或点化为人造灵石。",
    "stack": 200
  },
  "mat_037": {
    "id": "mat_037",
    "matId": "MAT_037",
    "name": "超频模块",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用中控芯片和电磁线圈组装获得。",
    "desc": "制作主控核心以及炼丹炉等高阶设备的控制卡。",
    "stack": 100
  },
  "mat_038": {
    "id": "mat_038",
    "matId": "MAT_038",
    "name": "骨板",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用人造经脉和精元液组装获得。",
    "desc": "灵根支架、法宝胚以及回收处理塔共用的活体结构板。",
    "stack": 100
  },
  "MAT_043": {
    "id": "MAT_043",
    "matId": "MAT_039",
    "name": "高温合金锭",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-fire text-orange-400",
    "obtainDesc": "由冶炼舱将精炼玄铁锭与赤铜锭高温冶炼获得。",
    "desc": "制作动力核心、煞气剑丸、炼宝台、渡劫台、炼丹炉和跨区传送门。",
    "stack": 100
  },
  "mat_040": {
    "id": "mat_040",
    "matId": "MAT_040",
    "name": "机壳",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁架和玄铁齿轮制作；也可在操作台启动制作。",
    "desc": "建造绝大多数加工设备、流体设备、防御塔和储藏柜的通用外壳。",
    "stack": 100
  },
  "MAT_045": {
    "id": "MAT_045",
    "matId": "MAT_041",
    "name": "耐火炉芯",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-fire-burner text-orange-500",
    "obtainDesc": "由精炼炉用玄铁板和玄铁粉制作；也可在操作台手工制作。",
    "desc": "建造精炼炉、冶炼舱、炼丹炉和燃料发电机的高温核心组件。",
    "stack": 100
  },
  "mat_042": {
    "id": "mat_042",
    "matId": "MAT_042",
    "name": "玄铁管",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁板和玄铁齿轮制作。",
    "desc": "建造水管、抽水机、阀门和流体处理设备的基础管件。",
    "stack": 100
  },
  "MAT_047": {
    "id": "MAT_047",
    "matId": "MAT_043",
    "name": "循环水泵",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-arrows-spin text-blue-400",
    "obtainDesc": "由加工台用玄铁管和电路板制作。",
    "desc": "培养仓、流体处理中枢和营养基座使用的流体循环泵件。",
    "stack": 100
  },
  "mat_044": {
    "id": "mat_044",
    "matId": "MAT_044",
    "name": "生物滤芯",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用骸骨和玄铁板（或玄铁板和蛋白液）制作。",
    "desc": "建造提取器和回收处理塔，以及制作复合滤芯的过滤耗材。",
    "stack": 100
  },
  "mat_045": {
    "id": "mat_045",
    "matId": "MAT_045",
    "name": "净化核心",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用复合滤芯和电路板组装获得。",
    "desc": "建造回收处理塔和组装主控核心的净化核心。",
    "stack": 100
  },
  "mat_046": {
    "id": "mat_046",
    "matId": "MAT_046",
    "name": "高压电容",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用电磁线圈和电路板组装获得。",
    "desc": "制作动力核心，以及建造灵力引擎和跨区传送门的高压电容。",
    "stack": 100
  },
  "MAT_051": {
    "id": "MAT_051",
    "matId": "MAT_047",
    "name": "精炼玄铁锭",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-slate-100",
    "obtainDesc": "由冶炼舱用玄铁锭和煤炭高温精炼获得。",
    "desc": "冶炼高温合金锭、煞气合金以及制造爆裂剑丸的前置金属锭。",
    "stack": 100
  },
  "MAT_052": {
    "id": "MAT_052",
    "matId": "MAT_048",
    "name": "原木",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-tree text-amber-700",
    "obtainDesc": "阶段I~II砍伐地图树木获得；阶段III解锁灵木培育槽后可通过原木树苗自动化培育量产。",
    "desc": "建造楼梯、操作台和置物桌，可切割为木板或投入燃料发电机产出木炭灰。",
    "stack": 200
  },
  "mat_049": {
    "id": "mat_049",
    "matId": "MAT_049",
    "name": "传动带",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用传动轴和灵磁齿轮制作。",
    "desc": "建造垂直传送带、交叉器、合流器、分流器和限速器的通用履带件。",
    "stack": 100
  },
  "mat_050": {
    "id": "mat_050",
    "matId": "MAT_050",
    "name": "人造灵根",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用灵根胚、主控核心和精元液激活获得。",
    "desc": "筑基期主线终局交付物，也是金丹期培养金丹胚的基础灵根母体。",
    "stack": 50
  },
  "MAT_055": {
    "id": "MAT_055",
    "matId": "MAT_051",
    "name": "筑基修士尸体",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-user-shield text-indigo-400",
    "obtainDesc": "由战斗击败筑基修士掉落，或由飞剑防御塔消耗爆裂剑丸自动猎杀收集。",
    "desc": "解构机的高阶生物输入，可拆解出更多血肉、脑髓和煞气结晶。",
    "stack": 20
  },
  "MAT_056": {
    "id": "MAT_056",
    "matId": "MAT_052",
    "name": "金丹修士尸体",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-user-astronaut text-amber-300",
    "obtainDesc": "通过序章固定事件获得，或金丹期由飞剑防御塔消耗煞气剑丸自动猎杀收集。",
    "desc": "解构机可从中拆解出海量生物材料及金丹期关键母本金丹碎片。",
    "stack": 20
  },
  "mat_053": {
    "id": "mat_053",
    "matId": "MAT_053",
    "name": "人造经脉",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养仓用骸骨、血胎和精元液培育获得（副产血水）。",
    "desc": "在组装机中与精元液压制为骨板。",
    "stack": 100
  },
  "mat_054": {
    "id": "mat_054",
    "matId": "MAT_054",
    "name": "中控芯片",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用电路板和生物芯片制作。",
    "desc": "建造组装机以及制作超频模块的控制组件。",
    "stack": 100
  },
  "mat_055": {
    "id": "mat_055",
    "matId": "MAT_055",
    "name": "复合滤芯",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用生物滤芯和玄铁板组装获得。",
    "desc": "建造回收处理塔和组装净化核心的强化滤芯。",
    "stack": 100
  },
  "mat_056": {
    "id": "mat_056",
    "matId": "MAT_056",
    "name": "灵根支架",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由打印机(BD_167)使用生物芯片、骨板与精元液3D打印成型。",
    "desc": "灵根胚胎骨骼支架；在打印机中与动力核心合成灵根胚，也可送入解构机逆向解析数据。",
    "stack": 50
  },
  "mat_057": {
    "id": "mat_057",
    "matId": "MAT_057",
    "name": "动力核心",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由冶炼舱用高温合金锭和高压电容高温铸造获得。",
    "desc": "送入培养仓与灵根支架融合培育灵根胚。",
    "stack": 50
  },
  "mat_058": {
    "id": "mat_058",
    "matId": "MAT_058",
    "name": "主控核心",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用超频模块和净化核心组装获得。",
    "desc": "用于组装人造灵根，以及在渡劫台凝练人造金丹的主控中枢。",
    "stack": 50
  },
  "mat_059": {
    "id": "mat_059",
    "matId": "MAT_059",
    "name": "灵根胚",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由打印机(BD_167)将灵根支架、动力核心与精元液打印成型的灵根胚。",
    "desc": "人造灵根半成品，用于组装机合成人造灵根或炼宝台祭炼高阶法宝。",
    "stack": 50
  },
  "mat_060": {
    "id": "mat_060",
    "matId": "MAT_060",
    "name": "玄铁架",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁梁和玄铁板制作。",
    "desc": "制作机壳的结构支架。",
    "stack": 100
  },
  "mat_061": {
    "id": "mat_061",
    "matId": "MAT_061",
    "name": "传动轴",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁齿轮和玄铁板制作。",
    "desc": "制作传动带的前置传动轴。",
    "stack": 100
  },
  "MAT_066": {
    "id": "MAT_066",
    "matId": "MAT_062",
    "name": "木板",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-bars text-amber-600",
    "obtainDesc": "由切割机将原木切割获得。",
    "desc": "建造木架和风力发电机、储藏柜，也可投入燃料发电机产木炭灰。",
    "stack": 200
  },
  "MAT_067": {
    "id": "MAT_067",
    "matId": "MAT_063",
    "name": "木架",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-hammer text-amber-700",
    "obtainDesc": "由切割机将木板加工获得。",
    "desc": "建造顶板、培养仓、营养基座和炼宝台等建筑。",
    "stack": 100
  },
  "MAT_068": {
    "id": "MAT_068",
    "matId": "MAT_064",
    "name": "木炭灰",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-volcano text-zinc-500",
    "obtainDesc": "燃料发电机或灵力引擎燃烧木板、原木或煤炭时副产。",
    "desc": "用于培养皿倍增成熟灵草、繁殖净化剂，或在渡劫台点化人造灵石。",
    "stack": 200
  },
  "mat_065": {
    "id": "mat_065",
    "matId": "MAT_065",
    "name": "电缆",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台或操作台用玄铁板和铜线制作。",
    "desc": "制作电路板与灵能电池，参与采矿机、加工台、风电等设备建造。",
    "stack": 100
  },
  "mat_066": {
    "id": "mat_066",
    "matId": "MAT_066",
    "name": "灵能电池",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台或操作台用电缆和玄铁板制作。",
    "desc": "所有大型机器接入电网的通用灵能电池。",
    "stack": 100
  },
  "MAT_071": {
    "id": "MAT_071",
    "matId": "MAT_067",
    "name": "煞气结晶",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-violet-400",
    "obtainDesc": "由离心机分离液态煞气、解构筑基尸体，或炼宝/渡劫过程副产。",
    "desc": "用于冶炼煞气合金、合成人造灵石、制造煞气剑丸和祭炼法宝胚。",
    "stack": 100
  },
  "mat_068": {
    "id": "mat_068",
    "matId": "MAT_068",
    "name": "煞气合金",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由冶炼舱用精炼玄铁锭和煞气结晶高温冶炼获得。",
    "desc": "由切割机切割为煞气合金片。",
    "stack": 100
  },
  "mat_069": {
    "id": "mat_069",
    "matId": "MAT_069",
    "name": "煞气合金片",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由切割机将煞气合金切割获得。",
    "desc": "用于组装法宝胚和金丹期煞气剑丸。",
    "stack": 100
  },
  "mat_070": {
    "id": "mat_070",
    "matId": "MAT_070",
    "name": "稳定液",
    "category": "灵根、法宝与金丹核心",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "由搅拌机用精元液和净化水调配获得。",
    "desc": "组装法宝胚与在炼宝台祭炼法宝的必需稳定液体。",
    "stack": 100
  },
  "MAT_075": {
    "id": "MAT_075",
    "matId": "MAT_071",
    "name": "探矿仪",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-compass text-sky-400",
    "obtainDesc": "由加工台用导灵铜片和电路板制作。",
    "desc": "用于定位已发现矿脉节点的辅助空间组件。",
    "stack": 100
  },
  "mat_072": {
    "id": "mat_072",
    "matId": "MAT_072",
    "name": "法宝胚",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用骨板、煞气合金片和稳定液组装获得。",
    "desc": "送入炼宝台搭配煞气结晶与稳定液祭炼为人造灵石与解析数据。",
    "stack": 50
  },
  "MAT_077": {
    "id": "MAT_077",
    "matId": "MAT_073",
    "name": "液态煞气",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-skull-crossbones text-purple-600",
    "obtainDesc": "由回收处理塔用净化剂（或药渣）处理血水提炼获得。",
    "desc": "送入离心机分离煞气结晶，或送入炼丹炉炼制破障丹。",
    "stack": 100
  },
  "mat_074": {
    "id": "mat_074",
    "matId": "MAT_074",
    "name": "玄铁剑丸",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用玄铁锭和玄铁粉制作。",
    "desc": "供飞剑防御塔发射，自动击杀来袭练气修士并收集练气修士尸体。",
    "stack": 200
  },
  "mat_075": {
    "id": "mat_075",
    "matId": "MAT_075",
    "name": "爆裂剑丸",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用精炼玄铁锭和滤渣制作。",
    "desc": "供飞剑防御塔发射，自动击杀筑基修士并收集筑基修士尸体。",
    "stack": 200
  },
  "mat_076": {
    "id": "mat_076",
    "matId": "MAT_076",
    "name": "煞气剑丸",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用煞气合金片和煞气结晶制作。",
    "desc": "供飞剑防御塔发射，自动击杀金丹修士并收集金丹修士尸体。",
    "stack": 200
  },
  "mat_077": {
    "id": "mat_077",
    "matId": "MAT_077",
    "name": "金丹碎片",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由解构机分解金丹修士尸体获得。",
    "desc": "蕴含金丹法则的生物碎核，是培养仓孕育金丹胚的核心母本。",
    "stack": 50
  },
  "mat_078": {
    "id": "mat_078",
    "matId": "MAT_078",
    "name": "煞气灵草",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养皿用成熟灵草、滤渣和净化水培育获得。",
    "desc": "吸收回收线滤渣与活性净化水生长的高阶灵草，用于炼制破障丹。",
    "stack": 100
  },
  "mat_079": {
    "id": "mat_079",
    "matId": "MAT_079",
    "name": "药渣",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由炼丹炉炼制丹药时副产。",
    "desc": "炼丹固体副产物，可送入回收处理塔提炼液态煞气，或在加工台制作净化剂。",
    "stack": 200
  },
  "mat_080": {
    "id": "mat_080",
    "matId": "MAT_080",
    "name": "气血丹",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由炼丹炉用成熟灵草、血肉和蛋白液高温炼制获得。",
    "desc": "金丹期基础丹药成品，用于继续炼制破障丹或补充气血。",
    "stack": 100
  },
  "mat_081": {
    "id": "mat_081",
    "matId": "MAT_081",
    "name": "破障丹",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由炼丹炉用煞气灵草、气血丹和液态煞气炼制获得。",
    "desc": "高阶丹药成品，用于提取器调制凝丹液。",
    "stack": 100
  },
  "mat_082": {
    "id": "mat_082",
    "matId": "MAT_082",
    "name": "凝丹液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "由提取器用破障丹和精元液提纯获得。",
    "desc": "供培养仓孕育金丹胚的顶级营养液。",
    "stack": 100
  },
  "mat_083": {
    "id": "mat_083",
    "matId": "MAT_083",
    "name": "人造灵石",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由冶炼舱用煤炭和煞气结晶高温合成，或由炼宝台祭炼与渡劫台金丹点化获得。",
    "desc": "高密度人工灵石，供跨区传送门建造与渡劫台凝练人造金丹使用。",
    "stack": 100
  },
  "mat_084": {
    "id": "mat_084",
    "matId": "MAT_084",
    "name": "金丹胚",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养仓输入人造灵根、金丹碎片和凝丹液活体培育获得。",
    "desc": "已完成肉身与灵根融合的金丹胚，送入渡劫台进行最终雷劫凝丹。",
    "stack": 50
  },
  "mat_085": {
    "id": "mat_085",
    "matId": "MAT_085",
    "name": "人造金丹",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由渡劫台输入金丹胚、主控核心和人造灵石渡劫获得。",
    "desc": "1.0正式版金丹期终极主线目标物；也可在渡劫台中作为不消耗母体将滤渣与木炭灰点化为人造灵石。",
    "stack": 20
  },
  "mat_086": {
    "id": "mat_086",
    "matId": "MAT_086",
    "name": "煤粉",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由粉碎机将煤炭粉碎获得。",
    "desc": "用于制备净化剂和炼丹助燃，打通煤炭向化工与丹药的分叉。",
    "stack": 200
  },
  "mat_087": {
    "id": "mat_087",
    "matId": "MAT_087",
    "name": "灵草粉",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由粉碎机将成熟灵草粉碎获得。",
    "desc": "制作早期回气散的固体草药粉末，让灵草实现榨汁与磨粉双路线。",
    "stack": 200
  },
  "mat_088": {
    "id": "mat_088",
    "matId": "MAT_088",
    "name": "赤铜粉",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由粉碎机将赤铜锭粉碎获得。",
    "desc": "与玄铁粉混合压制双倍产量的灵磁齿轮。",
    "stack": 200
  },
  "mat_089": {
    "id": "mat_089",
    "matId": "MAT_089",
    "name": "木屑",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由粉碎机将木板粉碎获得。",
    "desc": "用于加工绝缘板或投入培养皿堆肥催熟灵草。",
    "stack": 200
  },
  "mat_090": {
    "id": "mat_090",
    "matId": "MAT_090",
    "name": "回气散",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用灵草粉和蛋白液调配获得。",
    "desc": "阶段III即可制造的早期初级丹药，可用于恢复或升级炼制双倍气血丹。",
    "stack": 100
  },
  "mat_091": {
    "id": "mat_091",
    "matId": "MAT_091",
    "name": "绝缘板",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用木屑与清水压制，或搭配塑料高产制成。",
    "desc": "现代绝缘基板，用于生产电路板、高压电容与炼宝台祭炼法宝。",
    "stack": 200
  },
  "mat_092": {
    "id": "mat_092",
    "matId": "MAT_092",
    "name": "碳棒",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用煤粉与玄铁粉压制而成。",
    "desc": "工业电极与减速棒，用于合成人造灵石、高压电容、高速冶炼与净水。",
    "stack": 200
  },
  "mat_093": {
    "id": "mat_093",
    "matId": "MAT_093",
    "name": "原油",
    "category": "矿物与燃料",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "抽水机从旧世界遗留油田抽取。",
    "desc": "离心或提取分馏出燃油、润滑油、塑料与橡胶。",
    "stack": 100
  },
  "mat_094": {
    "id": "mat_094",
    "matId": "MAT_094",
    "name": "燃油",
    "category": "矿物与燃料",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "离心机或提取器分馏原油获得。",
    "desc": "灵力引擎高热燃料、冶炼舱助燃剂与爆裂剑丸高爆装药。",
    "stack": 100
  },
  "mat_095": {
    "id": "mat_095",
    "matId": "MAT_095",
    "name": "润滑油",
    "category": "机械与管路零件",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "离心机分馏燃油或提取器处理原油获得。",
    "desc": "通入加工台与组装机，令齿轮、传动带与电路板产量翻倍。",
    "stack": 100
  },
  "mat_096": {
    "id": "mat_096",
    "matId": "MAT_096",
    "name": "塑料",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "离心机处理原油副产获得。",
    "desc": "用于封装电路板、制作药瓶、绝缘板与复合滤芯。",
    "stack": 200
  },
  "mat_097": {
    "id": "mat_097",
    "matId": "MAT_097",
    "name": "橡胶",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "离心机处理燃油副产获得。",
    "desc": "用于高产传动带、阀门密封、电缆护套与渡劫防雷绝缘。",
    "stack": 200
  },
  "mat_098": {
    "id": "mat_098",
    "matId": "MAT_098",
    "name": "石英砂",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "采矿机开采地图石英矿脉获得。",
    "desc": "精炼炉烧制玻璃，再切割成硅片用于芯片产线。",
    "stack": 200
  },
  "mat_099": {
    "id": "mat_099",
    "matId": "MAT_099",
    "name": "玻璃",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "精炼炉熔炼石英砂获得。",
    "desc": "切割硅片、制作药瓶与法宝光学组件。",
    "stack": 100
  },
  "mat_100": {
    "id": "mat_100",
    "matId": "MAT_100",
    "name": "硅片",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "切割机精切玻璃获得。",
    "desc": "现代半导体基板，大幅增产电路板、生物芯片与中控芯片。",
    "stack": 100
  },
  "mat_101": {
    "id": "mat_101",
    "matId": "MAT_101",
    "name": "药瓶",
    "category": "基础建材",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "加工台用玻璃与塑料封装制成。",
    "desc": "炼丹炉流水线瓶装气血丹与破障丹，产量翻倍且减少药渣。",
    "stack": 200
  },
  "mat_102": {
    "id": "mat_102",
    "matId": "MAT_102",
    "name": "灵石矿",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "采矿机开采天然外星辐射矿脉（土著称灵石矿）获得。",
    "desc": "粉碎机分离出灵石粉与伴生铅锭，或与清水提取重水。",
    "stack": 200
  },
  "mat_103": {
    "id": "mat_103",
    "matId": "MAT_103",
    "name": "灵石粉",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "粉碎机粉碎灵石矿或离心灵泉获得。",
    "desc": "充磁灵磁齿轮、配灵泉提取灵液、浓缩燃料棒与人造灵石。",
    "stack": 200
  },
  "mat_104": {
    "id": "mat_104",
    "matId": "MAT_104",
    "name": "铅锭",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "粉碎机处理灵石矿伴生分离获得。",
    "desc": "加工台压制铅板，用于防辐射屏蔽与核燃料封装。",
    "stack": 100
  },
  "mat_105": {
    "id": "mat_105",
    "matId": "MAT_105",
    "name": "铅板",
    "category": "金属材料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "加工台压制铅锭获得。",
    "desc": "制作燃料棒护套、复合滤芯、防辐射机壳与渡劫台护罩。",
    "stack": 100
  },
  "mat_106": {
    "id": "mat_106",
    "matId": "MAT_106",
    "name": "灵泉",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "抽水机从外星辐射渗水潭（土著称灵泉）抽取。",
    "desc": "离心分离出重水与灵石粉，提取高纯灵液，或高产灌溉灵草。",
    "stack": 100
  },
  "mat_107": {
    "id": "mat_107",
    "matId": "MAT_107",
    "name": "灵液",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "提取器用灵石粉与灵泉提纯获得（副产煞水）。",
    "desc": "高纯外星辐射介质，用于浓缩人造灵石、瓶装炼丹与祭炼法宝。",
    "stack": 100
  },
  "mat_108": {
    "id": "mat_108",
    "matId": "MAT_108",
    "name": "重水",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "离心机分离灵泉或提取器浸洗灵石矿获得。",
    "desc": "核级冷却液，接入冶炼舱高速冶炼、封装燃料棒与渡劫台压雷冷却。",
    "stack": 100
  },
  "mat_109": {
    "id": "mat_109",
    "matId": "MAT_109",
    "name": "燃料棒",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "冶炼舱用灵石粉、铅板与重水封装制成。",
    "desc": "核级高热燃料，供灵力引擎超频发电与渡劫台双倍凝丹。",
    "stack": 50
  },
  "mat_110": {
    "id": "mat_110",
    "matId": "MAT_110",
    "name": "法宝",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "炼宝台祭炼法宝胚与高阶组件成品化获得。",
    "desc": "终局可量产法宝成品，用于逆向产出大量解析数据与渡劫台双倍凝练金丹。",
    "stack": 20
  },
  "mat_111": {
    "id": "mat_111",
    "matId": "MAT_111",
    "name": "原木树苗",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "首次砍伐地图树木伴生获得；放入灵木培育槽母种槽常驻不消耗；也可用原木留种扩繁。",
    "desc": "放入灵木培育槽(BD_164)母种槽自动化培育原木；亦可配合培养液进行辐射催长高产培育。",
    "stack": 200
  },
  "mat_112": {
    "id": "mat_112",
    "matId": "MAT_112",
    "name": "兽卵",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "培养仓用血胎、灵草种子与培养液孵育获得。",
    "desc": "放入灵兽舱(BD_168)母体槽常驻繁育灵兽，或配合灵泉进行灵兽辐射诱变高产。",
    "stack": 100
  },
  "mat_113": {
    "id": "mat_113",
    "matId": "MAT_113",
    "name": "兽粮",
    "category": "生物液体与培养物",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "加工台用成熟灵草与木屑（或血肉与灵草粉）压制而成。",
    "desc": "灵兽舱自动化饲育的基础口粮，驱动灵兽持续产出兽甲、兽髓与妖丹。",
    "stack": 200
  },
  "mat_114": {
    "id": "mat_114",
    "matId": "MAT_114",
    "name": "兽甲",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "灵兽舱喂食兽粮与清水/灵泉产出的高密度甲壳。",
    "desc": "解构机拆解可得骸骨、骨板与血肉，或送入组装机压制复合滤芯。",
    "stack": 100
  },
  "mat_115": {
    "id": "mat_115",
    "matId": "MAT_115",
    "name": "兽髓",
    "category": "生物液体与培养物",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-400",
    "obtainDesc": "灵兽舱自动化饲育灵兽分泌的高活性灵髓液。",
    "desc": "离心机提纯精元液与血膏，或送入炼丹炉炼制养魂丹、打印机打印元婴胚与化神胚。",
    "stack": 100
  },
  "mat_116": {
    "id": "mat_116",
    "matId": "MAT_116",
    "name": "妖丹",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "灵兽舱喂食兽粮、气血丹与灵泉孕育出的二阶兽核。",
    "desc": "替代金丹碎片培育金丹胚，也是炼制养魂丹与饲育三阶兽魂的核心原料。",
    "stack": 100
  },
  "mat_117": {
    "id": "mat_117",
    "matId": "MAT_117",
    "name": "兽魂",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "灵兽舱喂食妖丹、破障丹与液态煞气蜕变出的高阶生物神识体。",
    "desc": "蕴含强横生物神识，用于培养仓孕育元婴胚与化神胚。",
    "stack": 50
  },
  "mat_118": {
    "id": "mat_118",
    "matId": "MAT_118",
    "name": "养魂丹",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "炼丹炉用妖丹、煞气灵草（或药瓶）与兽髓炼制而成。",
    "desc": "阶段V~VI高阶神识丹药，供渡劫台凝练人造元婴与人造化神。",
    "stack": 50
  },
  "mat_119": {
    "id": "mat_119",
    "matId": "MAT_119",
    "name": "元婴胚",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "培养仓（或打印机）以人造金丹为母体融合兽魂/中控芯片孕育而成。",
    "desc": "元婴期核心胚体，送入渡劫台配合养魂丹、主控核心与重水凝练人造元婴。",
    "stack": 20
  },
  "mat_120": {
    "id": "mat_120",
    "matId": "MAT_120",
    "name": "人造元婴",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "渡劫台汇聚元婴胚、养魂丹、主控核心与重水渡劫凝练。",
    "desc": "第三重工业修仙境界结晶（元婴期），用于进一步孕育化神胚。",
    "stack": 10
  },
  "mat_121": {
    "id": "mat_121",
    "matId": "MAT_121",
    "name": "化神胚",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "培养仓（或打印机）以人造元婴为母体融合兽魂/净化核心孕育而成。",
    "desc": "化神期核心道胎，送入渡劫台配合高温合金锭、养魂丹与灵液凝练人造化神。",
    "stack": 10
  },
  "mat_122": {
    "id": "mat_122",
    "matId": "MAT_122",
    "name": "人造化神",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "渡劫台汇聚化神胚、高温合金锭、养魂丹与灵液渡劫凝练。",
    "desc": "第四重工业修仙境界结晶（化神期），用于轰击小千世界晶壁破界飞升。",
    "stack": 10
  },
  "mat_123": {
    "id": "mat_123",
    "matId": "MAT_123",
    "name": "飞升道果",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "渡劫台汇聚人造化神、法宝、燃料棒与重水轰开界壁凝结而成。",
    "desc": "终极破界信标！标志从小千世界跨越飞升至大千世界，可反哺大千法则无限产出解析数据。",
    "stack": 10
  },
  "mat_124": {
    "id": "mat_124",
    "matId": "MAT_124",
    "name": "光路芯片",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "打印机用生物芯片与探矿仪精密光刻而成。",
    "desc": "中央处理器光路阵盘的基础连线芯片（2~3格步进），亦可注入解析数据升级为神识光芯。",
    "stack": 100
  },
  "mat_125": {
    "id": "mat_125",
    "matId": "MAT_125",
    "name": "神识光芯",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "打印机将光路芯片注入解析数据与灵液（或组装机融合中控芯片与复合滤芯）制成。",
    "desc": "中央处理器光路阵盘的高阶连线与折射变轨芯片（4~5格步进），用于贯通三盘激光并合成阵盘极核。",
    "stack": 50
  },
  "mat_126": {
    "id": "mat_126",
    "matId": "MAT_126",
    "name": "阵盘极核",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "打印机融合神识光芯、超频模块与凝丹液打印成型。",
    "desc": "镶嵌于中央处理器攻击盘、工厂盘、辅助盘盘心的极核基座，驱动三盘 ×1.5 倍贯通共鸣与金丹无限超频。",
    "stack": 20
  },
  "mat_127": {
    "id": "mat_127",
    "matId": "MAT_127",
    "name": "灵舟",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "加工台用精炼玄铁锭、灵磁齿轮配燃油铸造，或组装机用乾坤货匣配灵能电池、灵液总装而成。",
    "desc": "高空灵舟物流核心载具：投入灵舟启航站(BD_172)注入阵旗颜色与前缀编号(AA.BB)后于厂房上空天轨飞行，支持AND/OR/NOT逻辑分流、自动装卸与8包裹转运，不占地面格。",
    "stack": 20
  },
  "mat_128": {
    "id": "mat_128",
    "matId": "MAT_128",
    "name": "乾坤货匣",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "加工台用木板与塑料封装，或打印机用玄铁架、玄铁板配润滑油高精度打印成型。",
    "desc": "高空灵舟装载站(BD_173)封装物料的标准货运包裹容器（单站暂存4匣、转运站暂存8匣），亦可联装批量生产灵舟与封装御舟法宝胚。",
    "stack": 100
  },
  "mat_129": {
    "id": "mat_129",
    "matId": "MAT_129",
    "name": "一阶凝灵散",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-spray-can-sparkles text-emerald-300",
    "obtainDesc": "搅拌机以灵草粉、煤粉配清水调匀，或打印机以成熟灵草、碳棒配灵草液压制成型。",
    "desc": "筑基期一阶传送带增产剂：填入丹雾喷涂器(BD_177)对传送带货物喷涂，下游工序触发额外产出+12.5%或提速+25%（耗电+30%），亦可提炼二阶真火剂与三阶造化丹。",
    "stack": 100
  },
  "mat_130": {
    "id": "mat_130",
    "matId": "MAT_130",
    "name": "二阶真火剂",
    "category": "环保与煞气材料",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-amber-400",
    "obtainDesc": "提取器以一阶凝灵散、煞气灵草配燃油萃取，或炼丹炉以药瓶、归墟晶尘、气血丹配灵液熬炼而成。",
    "desc": "金丹期二阶液态增产剂：接入丹雾喷涂器(BD_177)赐予额外产出+20%或提速+50%（耗电+70%），亦用于炼制三阶造化丹、诛仙雷丸与器灵枢机核。",
    "stack": 100
  },
  "mat_131": {
    "id": "mat_131",
    "matId": "MAT_131",
    "name": "三阶造化丹",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-pills text-cyan-300",
    "obtainDesc": "万象总装机或九转丹神炉以归墟晶尘、高阶丹药配二阶真火剂/凝丹液炼制。",
    "desc": "元婴期顶级增产丹药：填入丹雾喷涂器(BD_177)触发额外产出+25%或提速+100%（耗电+150%），亦是合成元婴法印、大道玄黄珠与器灵枢机核的核心耗材。",
    "stack": 50
  },
  "mat_132": {
    "id": "mat_132",
    "matId": "MAT_132",
    "name": "归墟晶尘",
    "category": "环保与煞气材料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-fuchsia-300",
    "obtainDesc": "归墟化煞炉(BD_178)物理焚化药渣、滤渣、木炭灰、血水或煞水后凝结而成。",
    "desc": "对标悖论湮灭精华：化废为宝的万用高阶催化晶尘，用于二/三阶增产剂、天魔负熵熔炼与聚变燃料配伍，消除多产物产线堵死风险。",
    "stack": 100
  },
  "mat_133": {
    "id": "mat_133",
    "matId": "MAT_133",
    "name": "凡阶玉简",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-scroll text-stone-300",
    "obtainDesc": "加工台以导灵铜片配煤粉雕刻，或打印机用木板、铜线配润滑油精密刻录。",
    "desc": "练气期实体科研道标：通过传送带输入天机推演台(BD_179)推演解析数据(×5)，或送入组装机升级为筑基灵简。",
    "stack": 100
  },
  "mat_134": {
    "id": "mat_134",
    "matId": "MAT_134",
    "name": "筑基灵简",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-scroll text-emerald-300",
    "obtainDesc": "组装机融合凡阶玉简与电路板配培养液，或打印机刻录人造灵根与硅片精元液制成。",
    "desc": "筑基期实体科研道标：通过传送带输入天机推演台(BD_179)推演解析数据(×15)，亦是合成金丹道匣的前置道标。",
    "stack": 100
  },
  "mat_135": {
    "id": "mat_135",
    "matId": "MAT_135",
    "name": "金丹道匣",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-box-open text-amber-300",
    "obtainDesc": "炼丹炉封存筑基灵简与气血丹、破障丹，或炼宝台以人造金丹与乾坤货匣祭炼封匣。",
    "desc": "金丹期实体科研道标：送入天机推演台(BD_179)推演解析数据(×45)，亦可进一步升华为元婴法印。",
    "stack": 50
  },
  "mat_136": {
    "id": "mat_136",
    "matId": "MAT_136",
    "name": "元婴法印",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-stamp text-purple-300",
    "obtainDesc": "万象总装机或炼宝台融合金丹道匣、人造元婴/法宝与重水神识祭炼成型。",
    "desc": "元婴期实体科研道标：送入天机推演台(BD_179)推演解析数据(×120)，并可升维合成化神天机盘。",
    "stack": 50
  },
  "mat_137": {
    "id": "mat_137",
    "matId": "MAT_137",
    "name": "化神天机盘",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-compass text-cyan-300",
    "obtainDesc": "仙造重组枢机或组装机以元婴法印、阵盘极核、人造化神及天魔道骨精密组装。",
    "desc": "化神期实体科研道标：送入天机推演台(BD_179)推演解析数据(×300)，亦用于锻造大道玄黄珠与仙光接引校准。",
    "stack": 20
  },
  "mat_138": {
    "id": "mat_138",
    "matId": "MAT_138",
    "name": "大道玄黄珠",
    "category": "研究货币",
    "form": "实体",
    "icon": "fa-solid fa-sun text-yellow-300",
    "obtainDesc": "仙造重组枢机融合化神天机盘与反煞晶核，或破界发射井伴随穿云舰升空接引凝珠。",
    "desc": "渡劫飞升期终局科研道标：在天机推演台(BD_179)每颗爆出 1000 解析数据，亦是渡劫台破界飞升的必备核心信物！",
    "stack": 10
  },
  "mat_139": {
    "id": "mat_139",
    "matId": "MAT_139",
    "name": "诛仙雷丸",
    "category": "剑丸与丹药成品",
    "form": "实体",
    "icon": "fa-solid fa-bolt text-amber-400",
    "obtainDesc": "加工台或万象总装机以煞气剑丸、爆裂剑丸、高压电容与重水/二阶真火剂封雷制成。",
    "desc": "元婴/化神天魔防线专属高爆弹药：装填九霄雷暴塔(BD_191)击落域外天魔，亦可用于战备基站扫荡与仙光台引雷发电。",
    "stack": 100
  },
  "mat_140": {
    "id": "mat_140",
    "matId": "MAT_140",
    "name": "天魔道骨",
    "category": "生物解构原料",
    "form": "实体",
    "icon": "fa-solid fa-skull text-rose-300",
    "obtainDesc": "九霄雷暴塔(BD_191)击杀天魔或傀儡战备基站(BD_190)战场自动回收尸骸拆解获得。",
    "desc": "化神逆向高能骸骨：用于建造天魔负熵炉(BD_188)、仙造重组枢机(BD_189)，也是阴阳对撞仪(BD_194)制备反煞晶核的核心靶材。",
    "stack": 50
  },
  "mat_141": {
    "id": "mat_141",
    "matId": "MAT_141",
    "name": "反煞晶核",
    "category": "矿物与燃料",
    "form": "实体",
    "icon": "fa-solid fa-atom text-fuchsia-400",
    "obtainDesc": "阴阳对撞仪(BD_194)将灵液与液态煞气高压对撞生成，亦可由金乌聚变堆(BD_192)副产析出。",
    "desc": "终局最高热值反物质仙核：为人造小仙阳(BD_193)提供 15000W 超强能源，同时是星辰幡与大道玄黄珠的关键原料。",
    "stack": 50
  },
  "mat_142": {
    "id": "mat_142",
    "matId": "MAT_142",
    "name": "周天星辰幡",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-flag text-cyan-300",
    "obtainDesc": "九转丹神炉伴生或仙造重组枢机以法宝、反煞晶核与器灵枢机核精密重组成阵。",
    "desc": "化神巨构发射弹体：投入阵旗弹射器(BD_195)射向苍穹构筑周天星斗大阵，亦与穿云舰协同接引仙界道光。",
    "stack": 50
  },
  "mat_143": {
    "id": "mat_143",
    "matId": "MAT_143",
    "name": "破界穿云舰",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-shuttle-space text-amber-300",
    "obtainDesc": "仙造重组枢机或阵旗弹射器依托反煞晶核、器灵枢机核总装的宏伟破界载具。",
    "desc": "渡劫飞升期巨构火箭：投入破界发射井(BD_196)垂直点火升空搭建天穹【接引仙门】，并接引凝结仙界道光与大道玄黄珠。",
    "stack": 10
  },
  "mat_144": {
    "id": "mat_144",
    "matId": "MAT_144",
    "name": "仙界道光",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-star text-yellow-200",
    "obtainDesc": "由破界发射井、阵旗弹射器与仙光接引台(BD_197)接收天穹接引仙门垂落的高维法则光子凝结。",
    "desc": "渡劫飞升唯一终局法则光子：驱动渡劫台轰碎界壁凝聚飞升道果，并在大千道果自循环中持续反哺法则算力。",
    "stack": 50
  },
  "mat_145": {
    "id": "mat_145",
    "matId": "MAT_145",
    "name": "器灵枢机核",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-microchip text-emerald-300",
    "obtainDesc": "万象总装机、阴阳对撞仪或九转丹神炉将兽魂、人造金丹、人造元婴封入神识阵盘铸就的活体器灵。",
    "desc": "《修仙工厂》独创机器附魔核心！注入生产设备切换血炼吞煞/金丹自生火/元婴虚空抓料/化神免耗材四大神通，亦用于星辰幡与穿云舰。",
    "stack": 20
  },
  "mat_146": {
    "id": "mat_146",
    "matId": "MAT_146",
    "name": "灵木纸鹤",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-feather-pointed text-amber-200",
    "obtainDesc": "加工台以木板、灵石粉折叠点睛，或打印机以光路芯片、木架配灵液批量刻制。",
    "desc": "短途辅料配送无人机：装入储藏盒顶部的千机纸鹤枢(BD_198)，自动向周围25格内的丹雾喷涂器、防御塔、战备基站与推演台空投增产剂、剑丸雷丸与道标，亦可用于御剑抛射台加速。",
    "stack": 100
  },
  "mat_147": {
    "id": "mat_147",
    "matId": "MAT_147",
    "name": "空置蓄灵匣",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-battery-empty text-slate-300",
    "obtainDesc": "组装机或万象总装机以灵能电池、高压电容、铅板与重水封装的超导储能容器。",
    "desc": "对标戴森球空蓄电器：送入雷池蓄电枢(BD_204)或仙光接引台(BD_197)充能为满载蓄灵匣；跨区放电或对撞消耗后 100% 无损退回空匣循环复用！",
    "stack": 50
  },
  "mat_148": {
    "id": "mat_148",
    "matId": "MAT_148",
    "name": "满载蓄灵匣",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-battery-full text-emerald-300",
    "obtainDesc": "雷池蓄电枢(BD_204)主网快充或仙光接引台(BD_197)捕获九霄天劫雷电灌注而成。",
    "desc": "封存高密度仙雷电能的实体电池：可由高空灵舟跨区运往无电网远端矿阵/防线并入雷池蓄电枢放电(+1200W)，亦可直驱阴阳对撞仪高速制备反煞晶核。",
    "stack": 50
  }
};

const XIUXIAN_BUILDINGS = {
  "foundation_1x1": {
    "id": "foundation_1x1",
    "code": "BD_102",
    "formalId": "BD_102",
    "name": "建筑底座｜1×1×1m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局起步",
    "recipes": [],
    "desc": "提供1×1的基础建造面，用于搭建厂房和承托上层建筑。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_102",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "foundation_pillar": {
    "id": "foundation_pillar",
    "code": "BD_103",
    "formalId": "BD_103",
    "name": "建筑底座柱｜1×1×4m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 4,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局起步",
    "recipes": [],
    "desc": "提供1×1、4m高的立体支撑和建造面，用于抬高或连接多层结构。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_103",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "foundation_2x2": {
    "id": "foundation_2x2",
    "code": "BD_104",
    "formalId": "BD_104",
    "name": "建筑底座｜2×2×1m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础结构",
    "recipes": [],
    "desc": "提供2×2的基础建造面，适合铺设中小型设备和上层结构。",
    "group": "org",
    "costs": [
      {
        "code": "bd_102",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_102",
    "ue5MergeMode": "尺寸拉伸与Zoop平铺变体",
    "isStandaloneSlot": false
  },
  "foundation_3x3": {
    "id": "foundation_3x3",
    "code": "BD_105",
    "formalId": "BD_105",
    "name": "建筑底座｜3×3×1m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础结构",
    "recipes": [],
    "desc": "提供3×3的基础建造面，适合承托较大型设备或多格建筑。",
    "group": "org",
    "costs": [
      {
        "code": "bd_102",
        "need": 9
      },
      {
        "code": "MAT_014",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_102",
    "ue5MergeMode": "尺寸拉伸与Zoop平铺变体",
    "isStandaloneSlot": false
  },
  "foundation_beam": {
    "id": "foundation_beam",
    "code": "BD_106",
    "formalId": "BD_106",
    "name": "建筑底座梁｜1×4×1m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 4,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础结构",
    "recipes": [],
    "desc": "提供1×4的条形建造面，用于搭梁、连桥或支撑长条区域。",
    "group": "org",
    "costs": [
      {
        "code": "bd_102",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_102",
    "ue5MergeMode": "结构派生悬挑梁模式",
    "isStandaloneSlot": false
  },
  "foundation_roof": {
    "id": "foundation_roof",
    "code": "BD_107",
    "formalId": "BD_107",
    "name": "建筑底座顶板｜2×2×0m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 0,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（立体顶板）",
    "recipes": [],
    "desc": "提供2×2的薄型顶板，可快速铺设平台并作为上层建筑基面。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 2
      },
      {
        "code": "MAT_067",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_102",
    "ue5MergeMode": "结构顶板覆盖模式",
    "isStandaloneSlot": false
  },
  "bd_108": {
    "id": "bd_108",
    "code": "BD_108",
    "formalId": "BD_108",
    "name": "楼梯｜1×3×2m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础结构",
    "recipes": [],
    "desc": "连接相邻高差的短楼梯，方便角色在不同高度的平台间通行。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 6
      },
      {
        "code": "MAT_014",
        "need": 3
      },
      {
        "code": "MAT_019",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_108",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_109": {
    "id": "bd_109",
    "code": "BD_109",
    "formalId": "BD_109",
    "name": "楼梯｜2×6×4m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 2,
    "dimY": 6,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础结构",
    "recipes": [],
    "desc": "连接较大高差的长楼梯，适合多层平台之间的通行。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 12
      },
      {
        "code": "MAT_014",
        "need": 6
      },
      {
        "code": "MAT_019",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_108",
    "ue5MergeMode": "尺寸加宽阶梯变体",
    "isStandaloneSlot": false
  },
  "bd_112": {
    "id": "bd_112",
    "code": "BD_112",
    "formalId": "BD_112",
    "name": "支撑柱｜1×1×5m",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 5,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局起步",
    "recipes": [],
    "desc": "竖直支撑结构，用于把上层平台落地支撑并连接不同高度的结构面。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_014",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_103",
    "ue5MergeMode": "立柱高度自适应伸缩",
    "isStandaloneSlot": false
  },
  "storage_box": {
    "id": "storage_box",
    "code": "BD_113",
    "formalId": "BD_113",
    "name": "储藏盒｜1×1×1m",
    "category": "仓储",
    "typeDesc": "仓储 / 储存",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 16,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局起步",
    "recipes": [],
    "desc": "小型固体储存箱，可暂存并通过物流端口输入、输出物料，容量16格。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_113",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_114": {
    "id": "bd_114",
    "code": "BD_114",
    "formalId": "BD_114",
    "name": "储藏盒｜2×1×1m（窄柜）",
    "category": "仓储",
    "typeDesc": "仓储 / 储存",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 32,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> 扩容仓储",
    "recipes": [],
    "desc": "窄型储藏柜，可暂存固体物料并接入物流端口，容量32格。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "mat_040",
        "need": 2
      },
      {
        "code": "MAT_066",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_113",
    "ue5MergeMode": "容器尺寸滚轮变体",
    "isStandaloneSlot": false
  },
  "bd_115": {
    "id": "bd_115",
    "code": "BD_115",
    "formalId": "BD_115",
    "name": "储藏盒｜1×2×1m（宽柜）",
    "category": "仓储",
    "typeDesc": "仓储 / 储存",
    "dimX": 1,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 32,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> 扩容仓储",
    "recipes": [],
    "desc": "宽型储藏柜，可暂存固体物料并接入物流端口，容量32格。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "mat_040",
        "need": 2
      },
      {
        "code": "MAT_066",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_113",
    "ue5MergeMode": "容器尺寸滚轮变体",
    "isStandaloneSlot": false
  },
  "conveyor": {
    "id": "conveyor",
    "code": "BD_116",
    "formalId": "BD_116",
    "name": "传送带｜直线",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局起步",
    "recipes": [],
    "desc": "直线输送物料的基础传送带，用于连接生产、仓储和分拣设备。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_117": {
    "id": "bd_117",
    "code": "BD_117",
    "formalId": "BD_117",
    "name": "传送带｜顺时针弯轨",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "顺时针转向的弯道传送带，用于改变固体物料的运输方向。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "Spline样条自动转弯",
    "isStandaloneSlot": false
  },
  "bd_118": {
    "id": "bd_118",
    "code": "BD_118",
    "formalId": "BD_118",
    "name": "传送带｜逆时针弯轨",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "逆时针转向的弯道传送带，用于改变固体物料的运输方向。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "Spline样条自动转弯",
    "isStandaloneSlot": false
  },
  "bd_119": {
    "id": "bd_119",
    "code": "BD_119",
    "formalId": "BD_119",
    "name": "传送带｜上坡",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "向上抬升的传送带，用于把物料送到更高的平台。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "Spline样条自动爬坡",
    "isStandaloneSlot": false
  },
  "bd_120": {
    "id": "bd_120",
    "code": "BD_120",
    "formalId": "BD_120",
    "name": "传送带｜下坡",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "向下输送的传送带，用于把物料送到更低的平台。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "Spline样条自动下坡",
    "isStandaloneSlot": false
  },
  "vert_conveyor": {
    "id": "vert_conveyor",
    "code": "BD_121",
    "formalId": "BD_121",
    "name": "垂直传送带",
    "category": "垂直传送带",
    "typeDesc": "垂直传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 3,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（立体物流）",
    "recipes": [],
    "desc": "可调高度的垂直传送带，用于跨越楼层或高差运输物料。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_116",
        "need": 3
      },
      {
        "code": "mat_049",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "垂直电梯样条分支",
    "isStandaloneSlot": false
  },
  "bd_122": {
    "id": "bd_122",
    "code": "BD_122",
    "formalId": "BD_122",
    "name": "交叉器",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "交叉传送节点，让两条物流线路交叉通过，互不合并。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_116",
        "need": 2
      },
      {
        "code": "mat_049",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_116",
    "ue5MergeMode": "传送带正交跨越桥架",
    "isStandaloneSlot": false
  },
  "merger": {
    "id": "merger",
    "code": "BD_123",
    "formalId": "BD_123",
    "name": "合流器",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "双输入单输出的合流器，把两路物料汇入同一条传送线路。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_116",
        "need": 2
      },
      {
        "code": "mat_049",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_123",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "splitter": {
    "id": "splitter",
    "code": "BD_124",
    "formalId": "BD_124",
    "name": "分流器",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_116",
    "recipes": [],
    "desc": "单输入双输出的分流器，把一路物料分到两条传送线路。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_116",
        "need": 2
      },
      {
        "code": "mat_049",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_124",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_125": {
    "id": "bd_125",
    "code": "BD_125",
    "formalId": "BD_125",
    "name": "智能合流器",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 2,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_127",
    "recipes": [],
    "desc": "带智能调度的合流器，可协调两路输入并减少线路堵塞。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_123",
        "need": 1
      },
      {
        "code": "mat_049",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_123",
    "ue5MergeMode": "合流器开启过滤优先级",
    "isStandaloneSlot": false
  },
  "bd_126": {
    "id": "bd_126",
    "code": "BD_126",
    "formalId": "BD_126",
    "name": "智能分流器",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 2,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_127",
    "recipes": [],
    "desc": "带智能分配的分流器，支持按物料筛选及优先主路+溢流旁路（Overflow）分流模式，防止副产物堵死主线。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_124",
        "need": 1
      },
      {
        "code": "mat_049",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_124",
    "ue5MergeMode": "分流器开启物品过滤规则",
    "isStandaloneSlot": false
  },
  "conveyor_limiter": {
    "id": "conveyor_limiter",
    "code": "BD_127",
    "formalId": "BD_127",
    "name": "限速器",
    "category": "带处理器",
    "typeDesc": "带处理器 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 1,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "belt_processor",
    "placementTarget": [
      "conveyor",
      "conveyor_mk2",
      "conveyor_mk3",
      "bd_117",
      "bd_118",
      "bd_119",
      "bd_120"
    ],
    "placementDesc": "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（智能物流）",
    "recipes": [],
    "desc": "限制传送带物流速度的控制节点，用于平衡产线节拍并减少堵塞。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_116",
        "need": 1
      },
      {
        "code": "mat_049",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_124",
    "ue5MergeMode": "带内限速阀组件合并",
    "isStandaloneSlot": false
  },
  "pipe": {
    "id": "pipe",
    "code": "BD_128",
    "formalId": "BD_128",
    "name": "水管｜直管",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_134",
    "recipes": [],
    "desc": "直线水管，用于连接流体设备并输送液体。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_129": {
    "id": "bd_129",
    "code": "BD_129",
    "formalId": "BD_129",
    "name": "水管｜立面弯管",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_134",
    "recipes": [],
    "desc": "向上转向的水管，用于改变液体管路方向或高度。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "水管Spline立面弯头",
    "isStandaloneSlot": false
  },
  "bd_130": {
    "id": "bd_130",
    "code": "BD_130",
    "formalId": "BD_130",
    "name": "水管｜平面弯管",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_134",
    "recipes": [],
    "desc": "向左转向的水管，用于改变液体管路方向。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "水管Spline平面弯头",
    "isStandaloneSlot": false
  },
  "bd_131": {
    "id": "bd_131",
    "code": "BD_131",
    "formalId": "BD_131",
    "name": "水管｜侧向接口",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（高阶管网）",
    "recipes": [],
    "desc": "带侧向接口的水管，用于从侧面接入或引出液体管路。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "管网接口自动法兰生成",
    "isStandaloneSlot": false
  },
  "bd_132": {
    "id": "bd_132",
    "code": "BD_132",
    "formalId": "BD_132",
    "name": "水管｜顶部接口",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（高阶管网）",
    "recipes": [],
    "desc": "带顶部接口的水管，用于从上方接入或引出液体管路。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "管网顶部插接自动法兰",
    "isStandaloneSlot": false
  },
  "bd_133": {
    "id": "bd_133",
    "code": "BD_133",
    "formalId": "BD_133",
    "name": "水管｜三通",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向；FluidPort_03@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（高阶管网）",
    "recipes": [],
    "desc": "三通水管，提供三个液体接口，便于分流或汇流。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_128",
    "ue5MergeMode": "管网交叉自动生成三通",
    "isStandaloneSlot": false
  },
  "pump": {
    "id": "pump",
    "code": "BD_134",
    "formalId": "BD_134",
    "name": "抽水机",
    "category": "泵",
    "typeDesc": "泵 / 液体",
    "dimX": 1,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "water_node",
    "placementTarget": [
      "water_node"
    ],
    "placementDesc": "仅限原始地图水源/液源节点（清水/原油/灵泉）上放置；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_WaterNode_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（清水水网）",
    "recipes": [
      "frl_010",
      "frl_025",
      "frl_026"
    ],
    "desc": "从地图水源、原油田与灵泉节点抽取液体，并送入管网或流体设备。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "mat_042",
        "need": 2
      },
      {
        "code": "MAT_019",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_010",
      "frl_025",
      "frl_026"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_134",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "miner": {
    "id": "miner",
    "code": "BD_135",
    "formalId": "BD_135",
    "name": "采矿机",
    "category": "矿机",
    "typeDesc": "矿机 / 加工",
    "dimX": 4,
    "dimY": 3,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 90,
    "power": 5,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "ore_node",
    "placementTarget": [
      "ore_node"
    ],
    "placementDesc": "仅限原始地图矿脉节点（玄铁/赤铜/煤/石英/灵石矿）上放置；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_OreNode_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_138",
    "recipes": [
      "frl_011",
      "frl_012",
      "frl_013",
      "frl_027",
      "frl_028"
    ],
    "desc": "从矿脉节点持续采集玄铁矿、赤铜矿、煤炭、石英砂与灵石矿，并通过物流端口输出。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 10
      },
      {
        "code": "MAT_011",
        "need": 5
      },
      {
        "code": "mat_065",
        "need": 1
      }
    ],
    "facilityRules": [
      "frl_011",
      "frl_012",
      "frl_013",
      "frl_027",
      "frl_028"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_135",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "furnace": {
    "id": "furnace",
    "code": "BD_136",
    "formalId": "BD_136",
    "name": "精炼炉",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 起始节点",
    "recipes": [
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128"
    ],
    "desc": "将矿石和辅料精炼成金属锭等中间材料。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 12
      },
      {
        "code": "MAT_011",
        "need": 6
      },
      {
        "code": "MAT_045",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_136",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "crusher": {
    "id": "crusher",
    "code": "BD_137",
    "formalId": "BD_137",
    "name": "粉碎机",
    "category": "带处理器",
    "typeDesc": "带处理器 / 加工",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "belt_processor",
    "placementTarget": [
      "conveyor",
      "conveyor_mk2",
      "conveyor_mk3",
      "bd_117",
      "bd_118",
      "bd_119",
      "bd_120"
    ],
    "placementDesc": "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础加工",
    "recipes": [
      "rcp_004",
      "rcp_106",
      "rcp_107",
      "rcp_108",
      "rcp_109",
      "rcp_131"
    ],
    "desc": "粉碎固体物料，产出粉末或双路分离碎料（如灵石矿分离灵石粉与铅锭）。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 6
      },
      {
        "code": "MAT_011",
        "need": 4
      }
    ],
    "primaryRecipes": [
      "rcp_004",
      "rcp_106",
      "rcp_107",
      "rcp_108",
      "rcp_109",
      "rcp_131"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_137",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "assembler": {
    "id": "assembler",
    "code": "BD_138",
    "formalId": "BD_138",
    "name": "加工台",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 基础加工",
    "recipes": [
      "rcp_005",
      "rcp_006",
      "rcp_007",
      "rcp_029",
      "rcp_030",
      "rcp_031",
      "rcp_032",
      "rcp_033",
      "rcp_040",
      "rcp_041",
      "rcp_042",
      "rcp_046",
      "rcp_054",
      "rcp_055",
      "rcp_056",
      "rcp_057",
      "rcp_058",
      "rcp_088",
      "rcp_110",
      "rcp_111",
      "rcp_113",
      "rcp_132",
      "rcp_146",
      "rcp_147",
      "rcp_158",
      "rcp_230",
      "rcp_232",
      "rcp_244",
      "rcp_276"
    ],
    "desc": "练气期核心金工制造设备，专注玄铁板/齿轮/梁、灵磁齿轮、电缆、剑丸、阀门、传动轴、水泵与机壳加工。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "MAT_011",
        "need": 4
      },
      {
        "code": "mat_065",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_005",
      "rcp_006",
      "rcp_007",
      "rcp_029",
      "rcp_030",
      "rcp_031",
      "rcp_032",
      "rcp_033",
      "rcp_040",
      "rcp_041",
      "rcp_042",
      "rcp_046",
      "rcp_054",
      "rcp_055",
      "rcp_056",
      "rcp_057",
      "rcp_058",
      "rcp_088",
      "rcp_110",
      "rcp_111",
      "rcp_113",
      "rcp_132",
      "rcp_146",
      "rcp_147",
      "rcp_158",
      "rcp_230",
      "rcp_232",
      "rcp_244",
      "rcp_276"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_138",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "cutter": {
    "id": "cutter",
    "code": "BD_139",
    "formalId": "BD_139",
    "name": "切割机",
    "category": "带处理器",
    "typeDesc": "带处理器 / 加工",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 25,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "belt_processor",
    "placementTarget": [
      "conveyor",
      "conveyor_mk2",
      "conveyor_mk3",
      "bd_117",
      "bd_118",
      "bd_119",
      "bd_120"
    ],
    "placementDesc": "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）-> BD_137+BD_138",
    "recipes": [
      "rcp_008",
      "rcp_009",
      "rcp_010",
      "rcp_011",
      "rcp_012",
      "rcp_129"
    ],
    "desc": "不占格带处理器（被动直通0碰撞）：自动精切赤铜锭→导灵铜片、导灵铜片→铜线、原木→木板、木板→木架、煞气合金→煞气合金片、玻璃→硅片。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "MAT_012",
        "need": 2
      },
      {
        "code": "mat_040",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_008",
      "rcp_009",
      "rcp_010",
      "rcp_011",
      "rcp_012",
      "rcp_129"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_139",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "deconstructor": {
    "id": "deconstructor",
    "code": "BD_140",
    "formalId": "BD_140",
    "name": "解构机",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 4,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 55,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_160",
    "recipes": [
      "frl_016",
      "frl_017",
      "frl_018",
      "frl_019",
      "frl_031",
      "frl_032",
      "frl_033",
      "frl_034",
      "frl_035"
    ],
    "desc": "拆解生物或相关固体产物，分离为多种可再利用材料。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 10
      },
      {
        "code": "mat_012",
        "need": 3
      },
      {
        "code": "mat_066",
        "need": 1
      },
      {
        "code": "mat_065",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_016",
      "frl_017",
      "frl_018",
      "frl_019",
      "frl_031",
      "frl_032",
      "frl_033",
      "frl_034",
      "frl_035"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_140",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "petri_dish": {
    "id": "petri_dish",
    "code": "BD_141",
    "formalId": "BD_141",
    "name": "培养皿",
    "category": "插槽",
    "typeDesc": "插槽 / 生物插件",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 0,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_bio",
    "placementTarget": [
      "bio_base"
    ],
    "placementDesc": "生物插件：必须插入【营养基座 (BD_159)】顶部插槽，严禁裸放地面或普通底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "SeedSlot_01@母种槽（常驻不消耗）",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_128",
    "recipes": [
      "rcp_013",
      "rcp_022",
      "rcp_094",
      "rcp_151",
      "rcp_152",
      "rcp_193"
    ],
    "desc": "1×1×1m草本与花卉培育器；内置母种常驻槽（不消耗种子），通清水/营养液/灵泉直出成品，支持机器人辐射诱变培育高阶变异株。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_099",
        "need": 2
      },
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_028",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_013",
      "rcp_022",
      "rcp_094",
      "rcp_151",
      "rcp_152",
      "rcp_193"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_141",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "incubator": {
    "id": "incubator",
    "code": "BD_142",
    "formalId": "BD_142",
    "name": "培养仓",
    "category": "插槽",
    "typeDesc": "插槽 / 生物插件",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 35,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_bio",
    "placementTarget": [
      "bio_base"
    ],
    "placementDesc": "生物插件：必须插入【营养基座 (BD_159)】顶部插槽，严禁裸放地面或普通底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_145",
    "recipes": [
      "rcp_014",
      "rcp_024",
      "rcp_048",
      "rcp_096",
      "rcp_201",
      "rcp_211",
      "rcp_214",
      "rcp_217"
    ],
    "desc": "培养生物个体，消耗固体培养基和液体营养，产出培养产物。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 3
      },
      {
        "code": "mat_012",
        "need": 2
      },
      {
        "code": "MAT_047",
        "need": 1
      },
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "MAT_067",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_014",
      "rcp_024",
      "rcp_048",
      "rcp_096",
      "rcp_201",
      "rcp_211",
      "rcp_214",
      "rcp_217"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_142",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "mixer": {
    "id": "mixer",
    "code": "BD_143",
    "formalId": "BD_143",
    "name": "搅拌机",
    "category": "插槽",
    "typeDesc": "插槽 / 液体插件",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_fluid",
    "placementTarget": [
      "fluid_hub"
    ],
    "placementDesc": "液体插件：必须插入【流体处理中枢 (BD_158)】顶部插槽（Slot_01 / Slot_02），严禁裸放地面或普通底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口；In_Fluid_02@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_134",
    "recipes": [
      "rcp_015",
      "rcp_017",
      "rcp_019",
      "rcp_020",
      "rcp_035",
      "rcp_112",
      "rcp_138",
      "rcp_202",
      "rcp_203",
      "rcp_236"
    ],
    "desc": "流固双相搅拌机：混合液体调配培养液、原浆与稳定液，亦可搅拌固液浆料制备回气散、兽粮与净化剂。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_042",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_015",
      "rcp_017",
      "rcp_019",
      "rcp_020",
      "rcp_035",
      "rcp_112",
      "rcp_138",
      "rcp_202",
      "rcp_203",
      "rcp_236"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_143",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "centrifuge": {
    "id": "centrifuge",
    "code": "BD_144",
    "formalId": "BD_144",
    "name": "离心机",
    "category": "插槽",
    "typeDesc": "插槽 / 液体插件",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 35,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_fluid",
    "placementTarget": [
      "fluid_hub"
    ],
    "placementDesc": "液体插件：必须插入【流体处理中枢 (BD_158)】顶部插槽（Slot_01 / Slot_02），严禁裸放地面或普通底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> MAT_029+BD_145",
    "recipes": [
      "rcp_021",
      "rcp_023",
      "rcp_122",
      "rcp_123",
      "rcp_133",
      "rcp_210"
    ],
    "desc": "离心分离流体，将混合物拆分为固体和液体产物。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 8
      },
      {
        "code": "mat_012",
        "need": 2
      },
      {
        "code": "mat_013",
        "need": 1
      },
      {
        "code": "mat_042",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_021",
      "rcp_023",
      "rcp_122",
      "rcp_123",
      "rcp_133",
      "rcp_210"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_144",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "extractor": {
    "id": "extractor",
    "code": "BD_145",
    "formalId": "BD_145",
    "name": "提取器",
    "category": "插槽",
    "typeDesc": "插槽 / 液体插件",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_fluid",
    "placementTarget": [
      "fluid_hub"
    ],
    "placementDesc": "液体插件：必须插入【流体处理中枢 (BD_158)】顶部插槽（Slot_01 / Slot_02），严禁裸放地面或普通底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Fluid_02@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_140+BD_134",
    "recipes": [
      "rcp_025",
      "rcp_026",
      "rcp_027",
      "rcp_028",
      "rcp_099",
      "rcp_124",
      "rcp_134",
      "rcp_135",
      "rcp_177",
      "rcp_191",
      "rcp_238"
    ],
    "desc": "从固体原料和液体中提取目标成分，输出一种或多种流体。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 5
      },
      {
        "code": "mat_044",
        "need": 2
      },
      {
        "code": "mat_042",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_025",
      "rcp_026",
      "rcp_027",
      "rcp_028",
      "rcp_099",
      "rcp_124",
      "rcp_134",
      "rcp_135",
      "rcp_177",
      "rcp_191",
      "rcp_238"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_145",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "assembler_heavy": {
    "id": "assembler_heavy",
    "code": "BD_146",
    "formalId": "BD_146",
    "name": "组装机",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 50,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（灵根总装）",
    "recipes": [
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280"
    ],
    "desc": "组装多种材料，生产机器、法宝和高级建筑所需的复杂部件。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 5
      },
      {
        "code": "mat_014",
        "need": 3
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_066",
        "need": 1
      },
      {
        "code": "mat_054",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_146",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "power_engine": {
    "id": "power_engine",
    "code": "BD_147",
    "formalId": "BD_147",
    "name": "灵力引擎（下）",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 4,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": -150,
    "powerGen": 150,
    "powerRadius": 50,
    "heat": 50,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "ThermalSlot_01@1,1,2：2x1;ThermalSlot_02@1,2,2：2x1",
    "unlockCondition": "阶段II（筑基期）· GATE_2（高温引擎）",
    "recipes": [
      "frl_015",
      "frl_029",
      "frl_030"
    ],
    "desc": "灵力引擎下部热能母座（双热能槽，可同时承载冶炼舱与炼丹炉）：烧煤150W/50热、烧燃油225W/75热、烧核燃料棒450W/150热。",
    "group": "power",
    "costs": [
      {
        "code": "MAT_014",
        "need": 8
      },
      {
        "code": "mat_013",
        "need": 5
      },
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "MAT_045",
        "need": 2
      },
      {
        "code": "MAT_019",
        "need": 8
      }
    ],
    "facilityRules": [
      "frl_015",
      "frl_029",
      "frl_030"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_147",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "smelt_chamber": {
    "id": "smelt_chamber",
    "code": "BD_148",
    "formalId": "BD_148",
    "name": "冶炼舱（上）",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_thermal",
    "placementTarget": [
      "power_engine",
      "fusion_reactor",
      "smelt_chamber",
      "bd_163",
      "alchemy_furnace_mk2",
      "furnace_mk2"
    ],
    "placementDesc": "上部热能组件（支持3~4层宝塔式垂直导热叠炉）：须架设在【灵力引擎 / 金乌聚变堆】或其上方同系炉体热能插槽上",
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_147",
    "recipes": [
      "rcp_060",
      "rcp_061",
      "rcp_062",
      "rcp_063",
      "rcp_100",
      "rcp_136",
      "rcp_137",
      "rcp_149"
    ],
    "desc": "灵力引擎的上部冶炼组件，可接入燃油或重水冷却进行高温冶炼与燃料棒封装。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 10
      },
      {
        "code": "MAT_045",
        "need": 2
      },
      {
        "code": "MAT_012",
        "need": 3
      }
    ],
    "primaryRecipes": [
      "rcp_060",
      "rcp_061",
      "rcp_062",
      "rcp_063",
      "rcp_100",
      "rcp_136",
      "rcp_137",
      "rcp_149"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_148",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "fuel_generator": {
    "id": "fuel_generator",
    "code": "BD_149",
    "formalId": "BD_149",
    "name": "燃料发电机",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": -100,
    "powerGen": 100,
    "powerRadius": 50,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局预置",
    "recipes": [
      "frl_001",
      "frl_002",
      "frl_014"
    ],
    "desc": "燃烧固体燃料发电，为周围建筑提供电力。",
    "group": "power",
    "costs": [
      {
        "code": "mat_040",
        "need": 10
      },
      {
        "code": "MAT_045",
        "need": 1
      },
      {
        "code": "MAT_012",
        "need": 3
      },
      {
        "code": "mat_065",
        "need": 1
      },
      {
        "code": "mat_066",
        "need": 1
      }
    ],
    "facilityRules": [
      "frl_001",
      "frl_002",
      "frl_014"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_149",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "purifier": {
    "id": "purifier",
    "code": "BD_150",
    "formalId": "BD_150",
    "name": "回收处理塔",
    "category": "机器",
    "typeDesc": "机器 / 液体加工",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（回收除煞）",
    "recipes": [
      "rcp_066",
      "rcp_067",
      "rcp_068",
      "rcp_070",
      "rcp_165"
    ],
    "desc": "处理生产废液和固体残渣，分离并回收可用材料。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 10
      },
      {
        "code": "mat_044",
        "need": 3
      },
      {
        "code": "mat_042",
        "need": 6
      },
      {
        "code": "MAT_047",
        "need": 2
      },
      {
        "code": "MAT_019",
        "need": 8
      }
    ],
    "primaryRecipes": [
      "rcp_066",
      "rcp_067",
      "rcp_068",
      "rcp_070",
      "rcp_165"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_150",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "teleporter": {
    "id": "teleporter",
    "code": "BD_151",
    "formalId": "BD_151",
    "name": "跨区传送门",
    "category": "机器",
    "typeDesc": "机器 / 物流",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 60,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放；需两座传送门配对",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段V（化神期）· GATE_5（跨区传送）",
    "recipes": [],
    "desc": "化神期跨区域空间传送门，配对后高速传送固体物料。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_046",
        "need": 2
      },
      {
        "code": "mat_015",
        "need": 2
      },
      {
        "code": "mat_040",
        "need": 10
      },
      {
        "code": "MAT_043",
        "need": 4
      },
      {
        "code": "mat_083",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_151",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "handcraft": {
    "id": "handcraft",
    "code": "BD_152",
    "formalId": "BD_152",
    "name": "操作台",
    "category": "机器",
    "typeDesc": "机器 / 操作",
    "dimX": 2,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": true,
    "rotStep": 90,
    "power": 5,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局预置",
    "recipes": [
      "frl_003",
      "frl_004",
      "frl_005",
      "frl_006",
      "frl_007",
      "frl_008",
      "frl_009",
      "frl_023",
      "frl_024"
    ],
    "desc": "供角色手动加工和制作基础材料的操作台，适合开局启动生产。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 3
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "MAT_052",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_003",
      "frl_004",
      "frl_005",
      "frl_006",
      "frl_007",
      "frl_008",
      "frl_009",
      "frl_023",
      "frl_024"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_152",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "storage_desk": {
    "id": "storage_desk",
    "code": "BD_153",
    "formalId": "BD_153",
    "name": "置物桌｜1×1×1m",
    "category": "结构",
    "typeDesc": "结构 / 操作",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；不占格（可贴合工位摆放，顶部可摆设/叠放）",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I（练气期）· 开局预置",
    "recipes": [],
    "desc": "小型置物桌，用于摆放或展示物品。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_052",
        "need": 4
      },
      {
        "code": "MAT_008",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_153",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_154": {
    "id": "bd_154",
    "code": "BD_154",
    "formalId": "BD_154",
    "name": "置物桌｜1×1×2m",
    "category": "结构",
    "typeDesc": "结构 / 操作",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；不占格（可贴合工位摆放，顶部可摆设/叠放）",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（奇物高桌）",
    "recipes": [],
    "desc": "高型置物桌，适合摆放或展示较高的物品。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_052",
        "need": 16
      },
      {
        "code": "MAT_008",
        "need": 8
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_153",
    "ue5MergeMode": "置物桌高度两段变体",
    "isStandaloneSlot": false
  },
  "wind_generator": {
    "id": "wind_generator",
    "code": "BD_155",
    "formalId": "BD_155",
    "name": "风力发电机",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 0,
    "power": -45,
    "powerGen": 45,
    "powerRadius": 50,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放；需保持周围空间畅通",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（风力发电）",
    "recipes": [],
    "desc": "利用风场持续发电，为附近建筑提供电力；需要保持周围空间畅通。",
    "group": "power",
    "costs": [
      {
        "code": "mat_040",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 8
      },
      {
        "code": "MAT_019",
        "need": 10
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "mat_065",
        "need": 2
      },
      {
        "code": "mat_066",
        "need": 1
      },
      {
        "code": "MAT_066",
        "need": 6
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_155",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "alchemy_table": {
    "id": "alchemy_table",
    "code": "BD_156",
    "formalId": "BD_156",
    "name": "炼宝台",
    "category": "机器",
    "typeDesc": "机器 / 法宝",
    "dimX": 4,
    "dimY": 4,
    "dimZ": 5,
    "topStackable": false,
    "rotStep": 90,
    "power": 45,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "ArtifactSlot_01",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（煞炼法宝）",
    "recipes": [
      "rcp_090",
      "rcp_101",
      "rcp_117",
      "rcp_171",
      "rcp_185",
      "rcp_187",
      "rcp_188",
      "rcp_226",
      "rcp_266"
    ],
    "desc": "炼制和加工法宝的专用工作台，可安装法宝插件并输出成品。",
    "group": "special",
    "costs": [
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "MAT_043",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 8
      },
      {
        "code": "mat_065",
        "need": 4
      },
      {
        "code": "mat_066",
        "need": 2
      },
      {
        "code": "MAT_067",
        "need": 4
      }
    ],
    "primaryRecipes": [
      "rcp_090",
      "rcp_101",
      "rcp_117",
      "rcp_171",
      "rcp_185",
      "rcp_187",
      "rcp_188",
      "rcp_226",
      "rcp_266"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_156",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "tribulation_table": {
    "id": "tribulation_table",
    "code": "BD_157",
    "formalId": "BD_157",
    "name": "渡劫台",
    "category": "机器",
    "typeDesc": "机器 / 法宝",
    "dimX": 5,
    "dimY": 5,
    "dimZ": 6,
    "topStackable": false,
    "rotStep": 45,
    "power": 80,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Solid_03@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "ArtifactSlot_01",
    "unlockCondition": "阶段IV（元婴期）· GATE_4 -> BD_156（渡劫破境）",
    "recipes": [
      "rcp_102",
      "rcp_103",
      "rcp_192",
      "rcp_216",
      "rcp_219",
      "rcp_220",
      "rcp_221"
    ],
    "desc": "终局渡劫设施，需通入重水冷却并加装铅板/橡胶防雷，凝练人造金丹。",
    "group": "special",
    "costs": [
      {
        "code": "mat_040",
        "need": 8
      },
      {
        "code": "MAT_043",
        "need": 6
      },
      {
        "code": "mat_105",
        "need": 8
      },
      {
        "code": "mat_097",
        "need": 6
      },
      {
        "code": "mat_046",
        "need": 4
      },
      {
        "code": "mat_066",
        "need": 3
      }
    ],
    "primaryRecipes": [
      "rcp_102",
      "rcp_103",
      "rcp_192",
      "rcp_216",
      "rcp_219",
      "rcp_220",
      "rcp_221"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_157",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "fluid_hub": {
    "id": "fluid_hub",
    "code": "BD_158",
    "formalId": "BD_158",
    "name": "流体处理中枢",
    "category": "基座",
    "typeDesc": "基座 / 液体插座",
    "dimX": 2,
    "dimY": 4,
    "dimZ": 4,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口；In_Fluid_02@液体@入口；In_Fluid_03@液体@入口；In_Fluid_04@液体@入口；In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Fluid_02@液体@出口；Out_Fluid_03@液体@出口；Out_Fluid_04@液体@出口；Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "Slot_01@0,2,1：2x2;Slot_02@0,0,1：2x2",
    "unlockCondition": "阶段III（金丹期）· GATE_3（流体处理中枢）",
    "recipes": [],
    "desc": "液体生产线高架中枢，带4组液体口、2组固体转接端口与2个2×2插件槽，供搅拌机、离心机与提取器插接运行。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 8
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "MAT_047",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "MAT_008",
        "need": 6
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_158",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bio_base": {
    "id": "bio_base",
    "code": "BD_159",
    "formalId": "BD_159",
    "name": "营养基座",
    "category": "基座",
    "typeDesc": "基座 / 生物插座",
    "dimX": 1,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口",
    "pluginSlot": "Slot_01@0,0,1：1x1;Slot_02@0,1,1：1x1",
    "unlockCondition": "阶段II（筑基期）· GATE_2 -> BD_141",
    "recipes": [],
    "desc": "生物插件双槽营养基座，提供2个1×1插槽并集中向顶部培养皿与培养仓输送培养液。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_042",
        "need": 2
      },
      {
        "code": "MAT_047",
        "need": 1
      },
      {
        "code": "MAT_067",
        "need": 2
      },
      {
        "code": "MAT_008",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_159",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_160": {
    "id": "bd_160",
    "code": "BD_160",
    "formalId": "BD_160",
    "name": "飞剑防御塔",
    "category": "机器",
    "typeDesc": "机器 / 防御",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 16,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（飞剑猎修）",
    "recipes": [
      "frl_020",
      "frl_021",
      "frl_022"
    ],
    "desc": "装填对应阶剑丸即主动散发灵压诱饵引怪巡猎（玄铁→练气/爆裂→筑基/煞气→金丹），击杀后自动牵引收尸送入物流线。",
    "group": "special",
    "costs": [
      {
        "code": "mat_040",
        "need": 4
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_013",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_020",
      "frl_021",
      "frl_022"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_160",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "bd_161": {
    "id": "bd_161",
    "code": "BD_161",
    "formalId": "BD_161",
    "name": "智能合流器[B形态]",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 2,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（B态合流）",
    "recipes": [],
    "desc": "带智能调度的合流器，可协调两路输入并减少线路堵塞。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_123",
        "need": 1
      },
      {
        "code": "mat_049",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_123",
    "ue5MergeMode": "合流器B形态镜像端口",
    "isStandaloneSlot": false
  },
  "bd_162": {
    "id": "bd_162",
    "code": "BD_162",
    "formalId": "BD_162",
    "name": "智能分流器[B形态]",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 2,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（B态分流）",
    "recipes": [],
    "desc": "带智能分配的分流器，支持按物料筛选及优先主路+溢流旁路（Overflow）分流模式，防止副产物堵死主线。",
    "group": "logi",
    "costs": [
      {
        "code": "bd_124",
        "need": 1
      },
      {
        "code": "mat_049",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_124",
    "ue5MergeMode": "分流器B形态镜像+定量拨盘",
    "isStandaloneSlot": false
  },
  "bd_163": {
    "id": "bd_163",
    "code": "BD_163",
    "formalId": "BD_163",
    "name": "炼丹炉（上）",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 1,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_thermal",
    "placementTarget": [
      "power_engine",
      "fusion_reactor",
      "smelt_chamber",
      "bd_163",
      "alchemy_furnace_mk2",
      "furnace_mk2"
    ],
    "placementDesc": "上部热能组件（支持3~4层宝塔式垂直导热叠炉）：须架设在【灵力引擎 / 金乌聚变堆】或其上方同系炉体热能插槽上",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_147（灵泉丹火）",
    "recipes": [
      "rcp_097",
      "rcp_098",
      "rcp_175",
      "rcp_176",
      "rcp_178",
      "rcp_179",
      "rcp_212",
      "rcp_213",
      "rcp_248"
    ],
    "desc": "灵力引擎的上部炼丹组件，利用下部引擎热能将灵草、血肉与灵液炼制为丹药，并副产药渣。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 6
      },
      {
        "code": "MAT_045",
        "need": 2
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "mat_037",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_097",
      "rcp_098",
      "rcp_175",
      "rcp_176",
      "rcp_178",
      "rcp_179",
      "rcp_212",
      "rcp_213",
      "rcp_248"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_163",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "wood_nursery": {
    "id": "wood_nursery",
    "code": "BD_164",
    "formalId": "BD_164",
    "name": "灵木培育槽",
    "category": "机器",
    "typeDesc": "机器 / 生物",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "SaplingSlot_01@树苗母种槽（常驻不消耗）",
    "unlockCondition": "阶段III（金丹期）· GATE_3（灵木培育）",
    "recipes": [
      "rcp_194",
      "rcp_195",
      "rcp_196"
    ],
    "desc": "2×2×2m木本植物专属培育槽；内置树苗母种常驻槽，通水/营养液自动化量产原木，未来可扩展铁木/雷击灵木等辐射诱变木本分支。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 10
      },
      {
        "code": "MAT_067",
        "need": 4
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "MAT_047",
        "need": 1
      },
      {
        "code": "mat_111",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_194",
      "rcp_195",
      "rcp_196"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_164",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "fluid_tank": {
    "id": "fluid_tank",
    "code": "BD_165",
    "formalId": "BD_165",
    "name": "储液罐",
    "category": "仓储",
    "typeDesc": "仓储 / 储存",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 200,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口；In_Fluid_02@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Fluid_02@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（工业储液罐）",
    "recipes": [],
    "desc": "2×2×2m工业储液缓冲罐，用于储存与稳压清水、原油、灵泉、血水、煞水等各类液体，防止管网憋压停机。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 12
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "mat_012",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_165",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "waste_incinerator": {
    "id": "waste_incinerator",
    "code": "BD_166",
    "formalId": "BD_166",
    "name": "化煞焚毁井",
    "category": "机器",
    "typeDesc": "机器 / 环保",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（排煞焚毁）",
    "recipes": [],
    "desc": "固液两用应急销毁安全阀：可焚毁多余木炭灰、塑料、药渣等固体副产，或应急排毁血水/煞水防堵线；耗电运行且直排废液会抬升周边辐射警报招引修士。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "MAT_045",
        "need": 1
      },
      {
        "code": "mat_042",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_166",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "printer": {
    "id": "printer",
    "code": "BD_167",
    "formalId": "BD_167",
    "name": "打印机",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 30,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（石化硅光打印）",
    "recipes": [
      "rcp_034",
      "rcp_039",
      "rcp_049",
      "rcp_051",
      "rcp_053",
      "rcp_130",
      "rcp_139",
      "rcp_140",
      "rcp_142",
      "rcp_143",
      "rcp_197",
      "rcp_198",
      "rcp_199",
      "rcp_215",
      "rcp_218",
      "rcp_222",
      "rcp_223",
      "rcp_225",
      "rcp_231"
    ],
    "desc": "2×2×2m现代工业与仿生3D打印机；输入塑料、硅片或生物原浆，打印药瓶、电路芯片、骨板、灵根支架、灵根胚及仿生肉骨脑髓。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "mat_099",
        "need": 2
      },
      {
        "code": "MAT_019",
        "need": 6
      }
    ],
    "primaryRecipes": [
      "rcp_034",
      "rcp_039",
      "rcp_049",
      "rcp_051",
      "rcp_053",
      "rcp_130",
      "rcp_139",
      "rcp_140",
      "rcp_142",
      "rcp_143",
      "rcp_197",
      "rcp_198",
      "rcp_199",
      "rcp_215",
      "rcp_218",
      "rcp_222",
      "rcp_223",
      "rcp_225",
      "rcp_231"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_167",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "beast_pen": {
    "id": "beast_pen",
    "code": "BD_168",
    "formalId": "BD_168",
    "name": "灵兽舱",
    "category": "机器",
    "typeDesc": "机器 / 生物",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 25,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "BeastSlot_01@灵兽母体槽（常驻不消耗）",
    "unlockCondition": "阶段III（金丹期）· GATE_3（灵兽培育）",
    "recipes": [
      "rcp_204",
      "rcp_205",
      "rcp_206",
      "rcp_207"
    ],
    "desc": "2×2×2m灵兽自动化繁育与榨取舱；内置灵兽母体常驻槽（不消耗兽卵），喂入兽粮与丹药/流体即可自动化循环产出兽甲、兽髓、妖丹与兽魂。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 4
      },
      {
        "code": "mat_099",
        "need": 2
      },
      {
        "code": "mat_042",
        "need": 2
      },
      {
        "code": "mat_044",
        "need": 2
      },
      {
        "code": "mat_112",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_204",
      "rcp_205",
      "rcp_206",
      "rcp_207"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_168",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_rail": {
    "id": "sky_rail",
    "code": "BD_169",
    "formalId": "BD_169",
    "name": "灵舟天轨",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（高空灵舟天轨）",
    "recipes": [],
    "desc": "高空架空灵舟航道（不占地面格），直接在厂房上空画线铺设直线、弯道与升降天轨，供无人灵舟高速往返飞行而不阻塞地面设施。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 2
      },
      {
        "code": "MAT_014",
        "need": 1
      },
      {
        "code": "mat_065",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_169",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_merger": {
    "id": "sky_merger",
    "code": "BD_170",
    "formalId": "BD_170",
    "name": "天轨合流器",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口；In_Sky_02@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4 -> BD_169（天轨合流）",
    "recipes": [],
    "desc": "高空双轨合并节点（不占地面格），将两条灵舟天轨航线平滑汇入同一条空中主干道。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 4
      },
      {
        "code": "MAT_012",
        "need": 2
      },
      {
        "code": "mat_014",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_170",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_splitter": {
    "id": "sky_splitter",
    "code": "BD_171",
    "formalId": "BD_171",
    "name": "天轨分流器",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 2,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口；Out_Sky_02@天轨@出口",
    "pluginSlot": "FilterLogic_01@阵旗与AA.BB与或非逻辑槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4 -> BD_170（逻辑分流）",
    "recipes": [],
    "desc": "高空智能分流航道（不占地面格），根据设置的阵旗颜色与前缀编号（如 AA.BB 匹配 AA）配合与/或/非(AND/OR/NOT)逻辑规则，引导符合条件的灵舟驶入对应空中支路。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 4
      },
      {
        "code": "mat_054",
        "need": 1
      },
      {
        "code": "mat_125",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_171",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_launcher": {
    "id": "sky_launcher",
    "code": "BD_172",
    "formalId": "BD_172",
    "name": "灵舟启航站",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Sky_01@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口",
    "pluginSlot": "ShipTag_01@阵旗颜色与前缀编号槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_169（启航站）",
    "recipes": [],
    "desc": "高空灵舟发车枢纽（不占地面格），为投入的灵舟注入灵力并设定阵旗颜色与前缀标签（如 DAN.01），放飞至空中天轨运行。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_040",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "mat_127",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_172",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_loader": {
    "id": "sky_loader",
    "code": "BD_173",
    "formalId": "BD_173",
    "name": "灵舟装载站",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 2,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Sky_01@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口",
    "pluginSlot": "CargoBuf_01@4包裹装载缓冲槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_172（装载站）",
    "recipes": [],
    "desc": "高空灵舟打包装载站（不占地面格），拥有2个传送带入口，将地面输入材料打包为乾坤货匣（最多同时储存4个包裹）并自动吊装至路过灵舟。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_049",
        "need": 2
      },
      {
        "code": "mat_128",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_173",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_unloader": {
    "id": "sky_unloader",
    "code": "BD_174",
    "formalId": "BD_174",
    "name": "灵舟卸载站",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 2,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Sky_01@天轨@出口",
    "pluginSlot": "UnloadRule_01@颜色前缀与或非筛选槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_172（卸载站）",
    "recipes": [],
    "desc": "高空灵舟拆包卸载站（不占地面格），最多暂存4个包裹；支持配置灵舟颜色、前缀AA.BB及与/或/非筛选规则，卸下乾坤货匣并拆解从2个传送带出口输出。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_054",
        "need": 1
      },
      {
        "code": "mat_128",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_174",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_transfer": {
    "id": "sky_transfer",
    "code": "BD_175",
    "formalId": "BD_175",
    "name": "灵舟转运站",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 8,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口；In_Sky_02@天轨@入口",
    "outputPorts": "Out_Sky_01@天轨@出口；Out_Sky_02@天轨@出口",
    "pluginSlot": "TransferBuf_01@8包裹双轨转运平台槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4 -> BD_171（8包裹转运）",
    "recipes": [],
    "desc": "高空双轨并行中转枢纽（不占地面格），通过临时空中储存平台在两条天轨的灵舟之间直接转移包裹，平台最多同时储存8个乾坤货匣。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_040",
        "need": 8
      },
      {
        "code": "MAT_043",
        "need": 2
      },
      {
        "code": "mat_054",
        "need": 2
      },
      {
        "code": "mat_128",
        "need": 8
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_175",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_receiver": {
    "id": "sky_receiver",
    "code": "BD_176",
    "formalId": "BD_176",
    "name": "灵舟回收站",
    "category": "天轨",
    "typeDesc": "天轨 / 物流",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "不占格",
    "placementRule": "sky_track",
    "placementTarget": [
      "raw_map",
      "top_stackable",
      "sky_layer"
    ],
    "placementDesc": "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Sky_01@天轨@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "RecycleDock_01@终点收船卸货槽",
    "unlockCondition": "阶段V（化神期）· GATE_5 -> BD_175（灵舟回收）",
    "recipes": [],
    "desc": "高空灵舟终点回收枢纽（不占地面格），回收抵达终点的灵舟同时卸载其携带的全部货物回传产线，保持空中航道不阻塞。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "MAT_043",
        "need": 2
      },
      {
        "code": "mat_057",
        "need": 1
      },
      {
        "code": "mat_127",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_176",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "belt_sprayer": {
    "id": "belt_sprayer",
    "code": "BD_177",
    "formalId": "BD_177",
    "name": "丹雾喷涂器",
    "category": "带处理器",
    "typeDesc": "带处理器 / 增产",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 10,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 1,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "belt_processor",
    "placementTarget": [
      "conveyor",
      "conveyor_mk2",
      "conveyor_mk3",
      "bd_117",
      "bd_118",
      "bd_119",
      "bd_120"
    ],
    "placementDesc": "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@主带入；In_Solid_02@固体/液体@增产剂侧入",
    "outputPorts": "Out_Solid_01@固体@喷涂输出",
    "pluginSlot": "SprayMode_01@增产/提速切换槽",
    "unlockCondition": "阶段II（筑基期）· GATE_2（丹雾增产）",
    "recipes": [],
    "desc": "不占格带处理器：直接架设于传送带上，侧面输入一阶凝灵散/二阶真火剂/三阶造化丹对过往货物喷涂丹雾，令下游设备触发【造化增产 +12.5%/+20%/+25%】或【燃魂提速 +25%/+50%/+100%】。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "mat_042",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_177",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "void_crucible": {
    "id": "void_crucible",
    "code": "BD_178",
    "formalId": "BD_178",
    "name": "归墟化煞炉",
    "category": "机器",
    "typeDesc": "机器 / 加工",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 30,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@废料入；In_Solid_02@固体@废料入；In_Fluid_01@液体@废液入",
    "outputPorts": "Out_Solid_01@固体@晶尘出；Out_Fluid_01@液体@净化水出",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（归墟化废）",
    "recipes": [
      "rcp_240",
      "rcp_241"
    ],
    "desc": "对标悖论坩埚：双固入+单液入物理吞噬产线溢出废渣（药渣、滤渣、木炭灰、血水、煞水），焚炼提纯为高阶催化材料归墟晶尘(MAT_132)，彻底根除多副产堵线难题。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_051",
        "need": 8
      },
      {
        "code": "MAT_045",
        "need": 2
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "mat_045",
        "need": 1
      }
    ],
    "primaryRecipes": [
      "rcp_240",
      "rcp_241"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_178",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "research_altar": {
    "id": "research_altar",
    "code": "BD_179",
    "formalId": "BD_179",
    "name": "天机推演台",
    "category": "机器",
    "typeDesc": "机器 / 科研",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 25,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@道标入；In_Solid_02@固体@道标入；In_Fluid_01@液体@灵液入",
    "outputPorts": "Out_Solid_01@固体@推演输出",
    "pluginSlot": "StackResearch_01@多层叠放共鸣槽",
    "unlockCondition": "阶段I（练气期）-> BD_138（实体科研）",
    "recipes": [
      "frl_037",
      "frl_038",
      "frl_039",
      "frl_040",
      "frl_041",
      "frl_042"
    ],
    "desc": "可垂直叠放的实体科研矩阵坛（顶部可放=是）：必须将各境界产线合成的实体玉简/道匣/法印/天机盘/玄黄珠通过传送带源源不断喂入推演解析数据。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_008",
        "need": 8
      },
      {
        "code": "MAT_013",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "mat_099",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_037",
      "frl_038",
      "frl_039",
      "frl_040",
      "frl_041",
      "frl_042"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_179",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "conveyor_mk2": {
    "id": "conveyor_mk2",
    "code": "BD_180",
    "formalId": "BD_180",
    "name": "疾风传送带",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（2x高速带）",
    "recipes": [],
    "desc": "金丹期 2.0x 二阶高速传送带，可在普通传送带上原地升级，满足高空灵舟卸载站与真火精炼炉的高吞吐配料需求。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 2
      },
      {
        "code": "MAT_012",
        "need": 1
      },
      {
        "code": "mat_095",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_180",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "belt_stacker": {
    "id": "belt_stacker",
    "code": "BD_181",
    "formalId": "BD_181",
    "name": "乾坤叠物机",
    "category": "带处理器",
    "typeDesc": "带处理器 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 12,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "belt_processor",
    "placementTarget": [
      "conveyor",
      "conveyor_mk2",
      "conveyor_mk3",
      "bd_117",
      "bd_118",
      "bd_119",
      "bd_120"
    ],
    "placementDesc": "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@4层堆叠出口",
    "pluginSlot": "StackHeight_01@叠层倍率槽(1~4层)",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_180（4层集装）",
    "recipes": [],
    "desc": "不占格带处理器：架设在任意传送带上，将经过的同种货物在传送带上物理堆叠为 4 层高（单带吞吐量瞬间 ×4，配合缩地极速带可达 20 倍带速）。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 4
      },
      {
        "code": "MAT_012",
        "need": 2
      },
      {
        "code": "mat_054",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_181",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "conveyor_mk3": {
    "id": "conveyor_mk3",
    "code": "BD_182",
    "formalId": "BD_182",
    "name": "缩地极速带",
    "category": "传送带",
    "typeDesc": "传送带 / 物流",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（5x极速带）",
    "recipes": [],
    "desc": "元婴期 5.0x 三阶极速传送带，叠满 4 层乾坤集装可达 20 倍恐怖通量，支撑万象总装机与终局巨构全速运转。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_043",
        "need": 2
      },
      {
        "code": "mat_054",
        "need": 1
      },
      {
        "code": "mat_068",
        "need": 1
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_182",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "heavy_miner": {
    "id": "heavy_miner",
    "code": "BD_183",
    "formalId": "BD_183",
    "name": "大型聚灵矿阵",
    "category": "矿机",
    "typeDesc": "矿机 / 开采",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 60,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "ore_node",
    "placementTarget": [
      "ore_node"
    ],
    "placementDesc": "仅限原始地图矿脉节点（玄铁/赤铜/煤/石英/灵石矿）上放置；体积占格；顶部不可放",
    "clockSpeed": 300,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_OreNode_01@矿脉区@覆盖",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（300%大矿阵）",
    "recipes": [
      "frl_043",
      "frl_011",
      "frl_012",
      "frl_013",
      "frl_027",
      "frl_028"
    ],
    "desc": "3×3×2 环形聚灵大矿阵（300% 采矿速度）：无需贴死单点矿脉即可覆罩整片矿区批量直出双高速带，对标戴森球大型采矿机。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_051",
        "need": 12
      },
      {
        "code": "MAT_012",
        "need": 6
      },
      {
        "code": "mat_057",
        "need": 2
      },
      {
        "code": "MAT_075",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_043"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [
      "frl_011",
      "frl_012",
      "frl_013",
      "frl_027",
      "frl_028"
    ],
    "tierSpeedMult": 3.0,
    "ue5MasterId": "BD_183",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sky_extractor": {
    "id": "sky_extractor",
    "code": "BD_184",
    "formalId": "BD_184",
    "name": "九霄采气塔",
    "category": "机器",
    "typeDesc": "机器 / 开采",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 3,
    "topStackable": true,
    "rotStep": 90,
    "power": 45,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@滤芯入；In_Fluid_01@液体@灵泉引流",
    "outputPorts": "Out_Fluid_01@液体@灵液重水出",
    "pluginSlot": "AltBonus_01@高空高度加成槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（海拔增产采气）",
    "recipes": [
      "rcp_263"
    ],
    "desc": "三维高空空间机制建筑：建造海拔越高（Z 每升高一层）高空罡风灵气萃取产量越大（+25%/层，至高+300%），高效凝结灵液与重水。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_051",
        "need": 8
      },
      {
        "code": "mat_042",
        "need": 4
      },
      {
        "code": "MAT_047",
        "need": 2
      },
      {
        "code": "mat_066",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_263"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_184",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "furnace_mk2": {
    "id": "furnace_mk2",
    "code": "BD_185",
    "formalId": "BD_185",
    "name": "真火精炼炉",
    "category": "机器",
    "typeDesc": "机器 / 冶炼",
    "dimX": 2,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": true,
    "rotStep": 90,
    "power": 40,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 200,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@辅料",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@合金出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（2x真火炉）",
    "recipes": [
      "rcp_264",
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128"
    ],
    "desc": "2.0x Mk.II 高阶冶炼炉，尺寸与基础炉适配且支持双料并炼精炼玄铁锭与高温合金锭，内置器灵槽。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 6
      },
      {
        "code": "MAT_045",
        "need": 2
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_264"
    ],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128"
    ],
    "tierSpeedMult": 2.0,
    "ue5MasterId": "BD_185",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "omni_assembler": {
    "id": "omni_assembler",
    "code": "BD_186",
    "formalId": "BD_186",
    "name": "万象总装机",
    "category": "机器",
    "typeDesc": "机器 / 制造",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 80,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 200,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Solid_03@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@副产出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（3带+1管万象总装）",
    "recipes": [
      "rcp_242",
      "rcp_250",
      "rcp_267",
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280"
    ],
    "desc": "对标炼金 Omni-Machine 的 2.0x 复合总装机：支持 3 路固体传送带输入 + 1 路管道液体输入 -> 2 路固体高速并行输出，可嵌入器灵枢机核。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 8
      },
      {
        "code": "mat_054",
        "need": 4
      },
      {
        "code": "mat_040",
        "need": 6
      },
      {
        "code": "mat_042",
        "need": 4
      }
    ],
    "primaryRecipes": [
      "rcp_242",
      "rcp_250",
      "rcp_267"
    ],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280"
    ],
    "tierSpeedMult": 2.0,
    "ue5MasterId": "BD_186",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "alchemy_furnace_mk2": {
    "id": "alchemy_furnace_mk2",
    "code": "BD_187",
    "formalId": "BD_187",
    "name": "九转丹神炉",
    "category": "机器",
    "typeDesc": "机器 / 炼丹",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": true,
    "rotStep": 90,
    "power": 40,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 3,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "slot_thermal",
    "placementTarget": [
      "power_engine",
      "fusion_reactor",
      "smelt_chamber",
      "bd_163",
      "alchemy_furnace_mk2",
      "furnace_mk2"
    ],
    "placementDesc": "上部热能组件（支持3~4层宝塔式垂直导热叠炉）：须架设在【灵力引擎 / 金乌聚变堆】或其上方同系炉体热能插槽上",
    "clockSpeed": 200,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@药材入；In_Solid_02@固体@灵石丹核入；In_Fluid_01@液体@药液入",
    "outputPorts": "Out_Solid_01@固体@神丹出；Out_Solid_02@固体@副产出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4 -> BD_163（2x丹神炉）",
    "recipes": [
      "rcp_272",
      "rcp_097",
      "rcp_098",
      "rcp_175",
      "rcp_176",
      "rcp_178",
      "rcp_179",
      "rcp_212",
      "rcp_213",
      "rcp_248"
    ],
    "desc": "2.0x Mk.II 热能高阶炼丹炉（上部热能组件，须安装于灵力引擎或金乌聚变堆顶部热槽），双倍高效炼制三阶造化丹、养魂丹与器灵枢机核。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 8
      },
      {
        "code": "MAT_045",
        "need": 3
      },
      {
        "code": "mat_085",
        "need": 1
      },
      {
        "code": "mat_105",
        "need": 4
      }
    ],
    "primaryRecipes": [
      "rcp_272"
    ],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_097",
      "rcp_098",
      "rcp_175",
      "rcp_176",
      "rcp_178",
      "rcp_179",
      "rcp_212",
      "rcp_213",
      "rcp_248"
    ],
    "tierSpeedMult": 2.0,
    "ue5MasterId": "BD_187",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "entropy_smelter": {
    "id": "entropy_smelter",
    "code": "BD_188",
    "formalId": "BD_188",
    "name": "天魔负熵炉",
    "category": "机器",
    "typeDesc": "机器 / 冶炼",
    "dimX": 2,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 120,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 3,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 400,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@精料入；In_Solid_02@固体@催化晶入",
    "outputPorts": "Out_Solid_01@固体@合金爆出；Out_Solid_02@固体@煞合金出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（4x天魔逆向炉）",
    "recipes": [
      "rcp_265",
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128",
      "rcp_060",
      "rcp_061",
      "rcp_062",
      "rcp_063",
      "rcp_100",
      "rcp_136",
      "rcp_137",
      "rcp_149",
      "rcp_264"
    ],
    "desc": "对标戴森球 4.0x 负熵熔炉：以天魔道骨逆向铸造的极速熔炼设备，消耗归墟晶尘以 400% 速率秒产高温合金与煞气合金。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 10
      },
      {
        "code": "mat_140",
        "need": 4
      },
      {
        "code": "mat_058",
        "need": 2
      },
      {
        "code": "mat_046",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_265"
    ],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_001",
      "rcp_002",
      "rcp_003",
      "rcp_127",
      "rcp_128",
      "rcp_060",
      "rcp_061",
      "rcp_062",
      "rcp_063",
      "rcp_100",
      "rcp_136",
      "rcp_137",
      "rcp_149",
      "rcp_264"
    ],
    "tierSpeedMult": 4.0,
    "ue5MasterId": "BD_188",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "recomposer_mk3": {
    "id": "recomposer_mk3",
    "code": "BD_189",
    "formalId": "BD_189",
    "name": "仙造重组枢机",
    "category": "机器",
    "typeDesc": "机器 / 制造",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 180,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 300,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Solid_03@固体@入口；In_Fluid_01@液体@灵液入",
    "outputPorts": "Out_Solid_01@固体@成品出；Out_Solid_02@固体@联产出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（3x仙造重组）",
    "recipes": [
      "rcp_252",
      "rcp_254",
      "rcp_273",
      "rcp_005",
      "rcp_006",
      "rcp_007",
      "rcp_029",
      "rcp_030",
      "rcp_031",
      "rcp_032",
      "rcp_033",
      "rcp_040",
      "rcp_041",
      "rcp_042",
      "rcp_046",
      "rcp_054",
      "rcp_055",
      "rcp_056",
      "rcp_057",
      "rcp_058",
      "rcp_088",
      "rcp_110",
      "rcp_111",
      "rcp_113",
      "rcp_132",
      "rcp_146",
      "rcp_147",
      "rcp_158",
      "rcp_230",
      "rcp_232",
      "rcp_244",
      "rcp_276",
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280",
      "rcp_242",
      "rcp_250",
      "rcp_267"
    ],
    "desc": "对标戴森球 3.0x 重组式制造台：熔合天魔道骨与反煞晶核的终极组装枢纽，专职批量重组化神天机盘、大道玄黄珠、星辰幡与破界穿云舰。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 12
      },
      {
        "code": "mat_140",
        "need": 6
      },
      {
        "code": "mat_125",
        "need": 4
      },
      {
        "code": "mat_126",
        "need": 2
      }
    ],
    "primaryRecipes": [
      "rcp_252",
      "rcp_254",
      "rcp_273"
    ],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_005",
      "rcp_006",
      "rcp_007",
      "rcp_029",
      "rcp_030",
      "rcp_031",
      "rcp_032",
      "rcp_033",
      "rcp_040",
      "rcp_041",
      "rcp_042",
      "rcp_046",
      "rcp_054",
      "rcp_055",
      "rcp_056",
      "rcp_057",
      "rcp_058",
      "rcp_088",
      "rcp_110",
      "rcp_111",
      "rcp_113",
      "rcp_132",
      "rcp_146",
      "rcp_147",
      "rcp_158",
      "rcp_230",
      "rcp_232",
      "rcp_244",
      "rcp_276",
      "rcp_038",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_052",
      "rcp_059",
      "rcp_069",
      "rcp_089",
      "rcp_144",
      "rcp_145",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_200",
      "rcp_209",
      "rcp_224",
      "rcp_233",
      "rcp_246",
      "rcp_280",
      "rcp_242",
      "rcp_250",
      "rcp_267"
    ],
    "tierSpeedMult": 3.0,
    "ue5MasterId": "BD_189",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "battle_base": {
    "id": "battle_base",
    "code": "BD_190",
    "formalId": "BD_190",
    "name": "傀儡战备基站",
    "category": "机器",
    "typeDesc": "机器 / 防务",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 50,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 6,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@尸骸战利入；In_Solid_02@固体@弹药入",
    "outputPorts": "Out_Solid_01@固体@道骨碎片出；Out_Solid_02@固体@解析数据出",
    "pluginSlot": "DroneBay_01@傀儡修塔捡尸槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（战备自动收尸）",
    "recipes": [
      "frl_045"
    ],
    "desc": "对标戴森球战场分析基站：自动派出傀儡修复受损防御塔，并自动收集战场上坠落的妖兽、金丹与天魔尸骨直接从双传送带出口吐入产线！",
    "group": "special",
    "costs": [
      {
        "code": "MAT_051",
        "need": 10
      },
      {
        "code": "mat_054",
        "need": 2
      },
      {
        "code": "mat_066",
        "need": 4
      },
      {
        "code": "mat_075",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_045"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_190",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "thunder_turret": {
    "id": "thunder_turret",
    "code": "BD_191",
    "formalId": "BD_191",
    "name": "九霄雷暴塔",
    "category": "机器",
    "typeDesc": "机器 / 防务",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 90,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@雷丸入；In_Solid_02@固体@电容入",
    "outputPorts": "Out_Solid_01@固体@道骨出；Out_Solid_02@固体@金丹尸出",
    "pluginSlot": "TurretOverdrive_01@引雷诱魔超频槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（天魔雷塔）",
    "recipes": [
      "frl_044"
    ],
    "desc": "元婴/化神天魔防线重塔：装填诛仙雷丸(MAT_139)配合高压电容释放九霄神雷诱杀域外天魔与元婴邪修，稳定爆落天魔道骨。",
    "group": "special",
    "costs": [
      {
        "code": "MAT_043",
        "need": 8
      },
      {
        "code": "mat_046",
        "need": 4
      },
      {
        "code": "mat_105",
        "need": 6
      },
      {
        "code": "mat_076",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_044"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_191",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "fusion_reactor": {
    "id": "fusion_reactor",
    "code": "BD_192",
    "formalId": "BD_192",
    "name": "金乌聚变堆",
    "category": "基座",
    "typeDesc": "基座 / 能源",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": true,
    "rotStep": 90,
    "power": -2400,
    "powerGen": 2400,
    "powerRadius": 25,
    "heat": 300,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@燃料棒入；In_Fluid_01@液体@重水入",
    "outputPorts": "Out_Solid_01@固体@废料晶尘出",
    "pluginSlot": "ThermalTop_01@300热能顶座槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（2400W核聚变）",
    "recipes": [],
    "desc": "元婴期重型聚变反应堆母座（顶部可放=是，可挂载九转丹神炉）：消耗燃料棒与重水单台暴发 2400W 电力与 300 热能直供上方丹炉。",
    "group": "power",
    "costs": [
      {
        "code": "MAT_043",
        "need": 12
      },
      {
        "code": "mat_105",
        "need": 12
      },
      {
        "code": "mat_057",
        "need": 4
      },
      {
        "code": "mat_046",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_192",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "artificial_sun": {
    "id": "artificial_sun",
    "code": "BD_193",
    "formalId": "BD_193",
    "name": "人造小仙阳",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 4,
    "dimY": 4,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 90,
    "power": -15000,
    "powerGen": 15000,
    "powerRadius": 40,
    "heat": 600,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@反煞晶核入",
    "outputPorts": "Out_Fluid_01@液体@灵液余热出",
    "pluginSlot": "SolarCore_01@微型恒星稳定槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（15000W小仙阳）",
    "recipes": [],
    "desc": "化神期对标人造恒星的超巨型反煞反应堆：吞噬反煞晶核(MAT_141)爆发 15,000W 恐怖电功率与 600 热能，一举满足对撞仪与发射井电荒！",
    "group": "power",
    "costs": [
      {
        "code": "MAT_043",
        "need": 20
      },
      {
        "code": "mat_126",
        "need": 4
      },
      {
        "code": "mat_140",
        "need": 8
      },
      {
        "code": "mat_141",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_193",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "particle_collider": {
    "id": "particle_collider",
    "code": "BD_194",
    "formalId": "BD_194",
    "name": "阴阳对撞仪",
    "category": "机器",
    "typeDesc": "机器 / 高能",
    "dimX": 4,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 1200,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 3,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@靶材入；In_Fluid_01@液体@灵液入；In_Fluid_02@液体@煞气入",
    "outputPorts": "Out_Solid_01@固体@反煞晶核出；Out_Solid_02@固体@晶尘出",
    "pluginSlot": "SpiritCore_01@器灵灌注槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（粒子对撞制备反煞）",
    "recipes": [
      "rcp_270",
      "rcp_271",
      "rcp_285"
    ],
    "desc": "对标戴森球粒子对撞机的高能物理巨构（耗电 1200W）：将高纯灵液与液态煞气加速对撞湮灭，制备反煞晶核(MAT_141)与器灵枢机核。",
    "group": "special",
    "costs": [
      {
        "code": "MAT_043",
        "need": 16
      },
      {
        "code": "mat_046",
        "need": 8
      },
      {
        "code": "mat_126",
        "need": 2
      },
      {
        "code": "mat_105",
        "need": 8
      }
    ],
    "primaryRecipes": [
      "rcp_270",
      "rcp_271",
      "rcp_285"
    ],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_194",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "banner_ejector": {
    "id": "banner_ejector",
    "code": "BD_195",
    "formalId": "BD_195",
    "name": "阵旗弹射器",
    "category": "机器",
    "typeDesc": "机器 / 巨构",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 4,
    "topStackable": false,
    "rotStep": 90,
    "power": 300,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@星辰幡入；In_Solid_02@固体@器灵核入",
    "outputPorts": "Out_Solid_01@固体@道光与组件出",
    "pluginSlot": "SkyOrbit_01@苍穹阵图弹射槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（轨道弹射星斗大阵）",
    "recipes": [
      "frl_046"
    ],
    "desc": "对标戴森球电磁轨道弹射器：连续向厂区高空苍穹弹射周天星辰幡(MAT_142)，在天空实景编织漫天星斗大阵并析出穿云舰件与仙界道光。",
    "group": "special",
    "costs": [
      {
        "code": "MAT_043",
        "need": 14
      },
      {
        "code": "mat_058",
        "need": 4
      },
      {
        "code": "mat_125",
        "need": 4
      },
      {
        "code": "mat_141",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_046"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_195",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "ascension_silo": {
    "id": "ascension_silo",
    "code": "BD_196",
    "formalId": "BD_196",
    "name": "破界发射井",
    "category": "机器",
    "typeDesc": "机器 / 巨构",
    "dimX": 4,
    "dimY": 4,
    "dimZ": 6,
    "topStackable": false,
    "rotStep": 90,
    "power": 2500,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 3,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@穿云舰入；In_Solid_02@固体@天机盘入；In_Solid_03@固体@燃料棒入；In_Fluid_01@液体@重水冷却",
    "outputPorts": "Out_Solid_01@固体@玄黄珠出；Out_Solid_02@固体@仙界道光出",
    "pluginSlot": "AscensionGate_01@接引仙门工程槽",
    "unlockCondition": "阶段VI（渡劫飞升）· GATE_6（破界垂直发射井）",
    "recipes": [
      "frl_036"
    ],
    "desc": "对标戴森球垂直发射井的终局奇观（4×4×6）：垂直点火发射破界穿云舰(MAT_143)直入云霄拼筑【接引仙门】，并带回大道玄黄珠与仙界道光。",
    "group": "special",
    "costs": [
      {
        "code": "MAT_043",
        "need": 24
      },
      {
        "code": "mat_126",
        "need": 4
      },
      {
        "code": "mat_140",
        "need": 8
      },
      {
        "code": "mat_110",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_036"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_196",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "immortal_receiver": {
    "id": "immortal_receiver",
    "code": "BD_197",
    "formalId": "BD_197",
    "name": "仙光接引台",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": -5000,
    "powerGen": 5000,
    "powerRadius": 35,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@星辰幡/穿云舰入；In_Fluid_01@液体@重水冷却",
    "outputPorts": "Out_Solid_01@固体@仙界道光出",
    "pluginSlot": "TribulationBolt_01@天劫引雷蓄能槽",
    "unlockCondition": "阶段VI（渡劫飞升）· GATE_6 -> BD_196（接引仙光与引雷）",
    "recipes": [
      "frl_047",
      "frl_051"
    ],
    "desc": "对标戴森球射线接收站 + 修仙天劫引雷枢机：从天穹【接引仙门】接收能量直供 5000W 电力并凝结仙界道光(MAT_144)，渡劫触发引雷时将天劫化为全厂狂暴绿电！",
    "group": "power",
    "costs": [
      {
        "code": "MAT_043",
        "need": 16
      },
      {
        "code": "mat_142",
        "need": 2
      },
      {
        "code": "mat_126",
        "need": 4
      },
      {
        "code": "mat_046",
        "need": 6
      }
    ],
    "facilityRules": [
      "frl_047",
      "frl_051"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_197",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "crane_distributor": {
    "id": "crane_distributor",
    "code": "BD_198",
    "formalId": "BD_198",
    "name": "千机纸鹤枢",
    "category": "插槽",
    "typeDesc": "插槽 / 配送插件",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 15,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": false,
    "occupancyMode": "不占格",
    "placementRule": "slot_storage",
    "placementTarget": [
      "storage_box",
      "bd_114",
      "bd_115"
    ],
    "placementDesc": "箱顶配送插件（不占格）：必须安装在【储藏盒 / 窄柜 / 宽柜】顶部，严禁裸放地面",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@箱顶直吸@入口",
    "outputPorts": "Out_Air_01@纸鹤空投@半径25格",
    "pluginSlot": "CraneBay_01@纸鹤编队槽",
    "unlockCondition": "阶段II（筑基期）· GATE_2（纸鹤短途空投）",
    "recipes": [],
    "desc": "对标戴森球物流配送器（不占格，专门安装在储藏盒/窄柜/宽柜顶部）：放飞灵木纸鹤(MAT_146)，自动向周围25格内的喷涂器、防御塔、战备基站与推演台空投增产剂、弹药与道标！",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_066",
        "need": 4
      },
      {
        "code": "mat_014",
        "need": 2
      },
      {
        "code": "mat_146",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_198",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "sword_catapult": {
    "id": "sword_catapult",
    "code": "BD_199",
    "formalId": "BD_199",
    "name": "御剑抛射台",
    "category": "机器",
    "typeDesc": "机器 / 物流",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 20,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@纸鹤助推",
    "outputPorts": "Out_Arc_01@剑气抛物线@出口",
    "pluginSlot": "ArcTrajectory_01@抛射仰角槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（御剑抛射物流）",
    "recipes": [
      "frl_048"
    ],
    "desc": "对标炼金抛射大炮：将货物包裹绑定于流光飞剑上，在厂区上空划出金色剑气抛物线（跨距8~30格，越过管网与厂房）精准投射至远端接引莲台(BD_200)。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 6
      },
      {
        "code": "MAT_012",
        "need": 4
      },
      {
        "code": "mat_074",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_048"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_199",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "lotus_catcher": {
    "id": "lotus_catcher",
    "code": "BD_200",
    "formalId": "BD_200",
    "name": "接引莲台",
    "category": "机器",
    "typeDesc": "机器 / 物流",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 5,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Arc_01@剑气抛物线@接引",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "LotusBounce_01@接力弹射槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3 -> BD_199（接引莲台）",
    "recipes": [
      "frl_049"
    ],
    "desc": "对标炼金弹跳菇/接货漏斗：金色阵法莲台在空中接住御剑抛射台射来的剑气货匣，无损卸货并从底部双传送带出口分流输出，亦支持多级莲台接力弹射。",
    "group": "logi",
    "costs": [
      {
        "code": "MAT_051",
        "need": 4
      },
      {
        "code": "MAT_013",
        "need": 4
      },
      {
        "code": "mat_097",
        "need": 2
      }
    ],
    "facilityRules": [
      "frl_049"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_200",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "immortal_roof": {
    "id": "immortal_roof",
    "code": "BD_201",
    "formalId": "BD_201",
    "name": "飞檐琉璃顶",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": false,
    "occupancyMode": "体积占格",
    "placementRule": "surface_only",
    "placementTarget": [
      "top_stackable"
    ],
    "placementDesc": "不可直接放原始地图，需放在建筑底座或顶部可放的平台表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段III（金丹期）· GATE_3（宗门飞檐美学）",
    "recipes": [],
    "desc": "修仙宗门洞天美学构件（3×3×2m）：四角翘起鎏金飞檐并悬挂镇煞铜铃的翠玉琉璃屋顶，架设于厂房顶层立柱之上，将冰冷工业基地化为恢弘仙家宫阙。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_066",
        "need": 6
      },
      {
        "code": "mat_099",
        "need": 4
      },
      {
        "code": "MAT_013",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_201",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "cloud_corridor": {
    "id": "cloud_corridor",
    "code": "BD_202",
    "formalId": "BD_202",
    "name": "朱漆云廊桥",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 4,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II（筑基期）· GATE_2（朱漆云廊）",
    "recipes": [],
    "desc": "修仙宗门洞天美学构件（1×4×1m）：两侧带雕花朱漆护栏与引路灵灯的悬空廊桥（顶部可放=是），既可供修士御风通行，又可整齐敷设多层传送带与水管。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_066",
        "need": 4
      },
      {
        "code": "MAT_008",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_202",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "floating_platform": {
    "id": "floating_platform",
    "code": "BD_203",
    "formalId": "BD_203",
    "name": "阵法浮空台",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 1,
    "topStackable": true,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 0,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（浮空仙岛台）",
    "recipes": [],
    "desc": "元婴期仙家洞天奇观基座（3×3×1m，顶部可放=是）：底部镌刻反重力托天灵阵，可在高空直接悬浮拼接为浮空仙岛，是架设13层高空九霄采气塔的绝佳平台！",
    "group": "org",
    "costs": [
      {
        "code": "MAT_043",
        "need": 4
      },
      {
        "code": "mat_083",
        "need": 2
      },
      {
        "code": "MAT_071",
        "need": 2
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_203",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "thunder_accumulator": {
    "id": "thunder_accumulator",
    "code": "BD_204",
    "formalId": "BD_204",
    "name": "雷池蓄电枢",
    "category": "机器",
    "typeDesc": "机器 / 能源",
    "dimX": 2,
    "dimY": 2,
    "dimZ": 2,
    "topStackable": false,
    "rotStep": 90,
    "power": -1200,
    "powerGen": 1200,
    "powerRadius": 25,
    "heat": 0,
    "containerSlots": 2,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@空匣/满匣入；In_Solid_02@固体@燃料助充",
    "outputPorts": "Out_Solid_01@固体@满匣/退空匣出",
    "pluginSlot": "BatteryMode_01@充放双向切换槽",
    "unlockCondition": "阶段III（金丹期）· GATE_3（跨区运电雷池）",
    "recipes": [
      "frl_050",
      "frl_052"
    ],
    "desc": "对标戴森球能量枢纽+蓄电器（发电+1200W）：余电或天劫引雷时将空置蓄灵匣(MAT_147)快充为满载蓄灵匣(MAT_148)；远端矿区吞噬满匣稳定放电1200W并100%退回空匣！",
    "group": "power",
    "costs": [
      {
        "code": "MAT_051",
        "need": 8
      },
      {
        "code": "mat_046",
        "need": 4
      },
      {
        "code": "mat_066",
        "need": 4
      },
      {
        "code": "mat_105",
        "need": 4
      }
    ],
    "facilityRules": [
      "frl_050",
      "frl_052"
    ],
    "primaryRecipes": [],
    "inheritedRecipes": [],
    "tierSpeedMult": 1.0,
    "ue5MasterId": "BD_204",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "immortal_herb_garden": {
    "id": "immortal_herb_garden",
    "code": "BD_205",
    "formalId": "BD_205",
    "name": "洞天灵药圃",
    "category": "机器",
    "typeDesc": "机器 / 生产",
    "dimX": 3,
    "dimY": 3,
    "dimZ": 3,
    "topStackable": true,
    "rotStep": 90,
    "power": 90,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 3,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部可放",
    "clockSpeed": 250,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@灵泉直连",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@副产",
    "pluginSlot": "HerbSpirit_01@器灵共鸣槽",
    "unlockCondition": "阶段IV（元婴期）· GATE_4（洞天灵药圃）",
    "recipes": [
      "rcp_013",
      "rcp_022",
      "rcp_094",
      "rcp_151",
      "rcp_152",
      "rcp_193",
      "rcp_014",
      "rcp_024",
      "rcp_048",
      "rcp_096",
      "rcp_201",
      "rcp_211",
      "rcp_214",
      "rcp_217",
      "rcp_194",
      "rcp_195",
      "rcp_196"
    ],
    "desc": "生物修仙线二阶世代建筑（无需母座直连灵泉，2.5×倍速）：自带微型聚灵阵与生态灌溉循环，自动向下继承培养皿(BD_141)、培养仓(BD_142)、灵木培育槽(BD_164)全部22条灵植与灵木配方。",
    "group": "prod",
    "costs": [
      {
        "code": "MAT_043",
        "need": 6
      },
      {
        "code": "mat_099",
        "need": 6
      },
      {
        "code": "mat_107",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_013",
      "rcp_022",
      "rcp_094",
      "rcp_151",
      "rcp_152",
      "rcp_193",
      "rcp_014",
      "rcp_024",
      "rcp_048",
      "rcp_096",
      "rcp_201",
      "rcp_211",
      "rcp_214",
      "rcp_217",
      "rcp_194",
      "rcp_195",
      "rcp_196"
    ],
    "tierSpeedMult": 2.5,
    "ue5MasterId": "BD_205",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  },
  "beast_immortal_pool": {
    "id": "beast_immortal_pool",
    "code": "BD_206",
    "formalId": "BD_206",
    "name": "万兽仙池",
    "category": "机器",
    "typeDesc": "机器 / 生产",
    "dimX": 4,
    "dimY": 4,
    "dimZ": 3,
    "topStackable": false,
    "rotStep": 90,
    "power": 150,
    "powerGen": 0,
    "powerRadius": 0,
    "heat": 0,
    "containerSlots": 4,
    "canPlaceOnRawMap": true,
    "occupancyMode": "体积占格",
    "placementRule": "raw_or_surface",
    "placementTarget": [
      "raw_map",
      "top_stackable"
    ],
    "placementDesc": "可直接放原始地图，或放在顶部可放的建筑表面；体积占格；顶部不可放",
    "clockSpeed": 300,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@灵液直连",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@妖丹出口",
    "pluginSlot": "BeastPool_01@荒古血脉槽",
    "unlockCondition": "阶段V（化神期）· GATE_5（万兽仙池）",
    "recipes": [
      "rcp_204",
      "rcp_205",
      "rcp_206",
      "rcp_207"
    ],
    "desc": "生物修仙线三阶终极育兽设施（3.0×倍速）：内置荒古血脉池与高纯灵液供氧循环，无需生物母座，自动向下继承灵兽舱(BD_168)全部5条灵兽饲育与妖丹配方。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_087",
        "need": 8
      },
      {
        "code": "mat_120",
        "need": 2
      },
      {
        "code": "mat_108",
        "need": 4
      }
    ],
    "primaryRecipes": [],
    "facilityRules": [],
    "inheritedRecipes": [
      "rcp_204",
      "rcp_205",
      "rcp_206",
      "rcp_207"
    ],
    "tierSpeedMult": 3.0,
    "ue5MasterId": "BD_206",
    "ue5MergeMode": "独立主资产",
    "isStandaloneSlot": true
  }
};

const XIUXIAN_RECIPES = {
  "rcp_001": {
    "id": "rcp_001",
    "canonicalId": "RCP_001",
    "name": "玄铁锭",
    "category": "金属材料",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 10,
    "power": 15,
    "input": {
      "item": "MAT_001",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "玄铁矿"
    },
    "output": {
      "item": "MAT_006",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "玄铁锭"
    },
    "inputs": [
      {
        "item": "MAT_001",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_006",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "精炼炉 生产 玄铁锭（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_002": {
    "id": "rcp_002",
    "canonicalId": "RCP_002",
    "name": "赤铜锭",
    "category": "金属材料",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 10,
    "power": 15,
    "input": {
      "item": "MAT_002",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "赤铜矿"
    },
    "output": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "赤铜锭"
    },
    "inputs": [
      {
        "item": "MAT_002",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "精炼炉 生产 赤铜锭（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_003": {
    "id": "rcp_003",
    "canonicalId": "RCP_003",
    "name": "耐火炉芯",
    "category": "机械与管路零件",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_008",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "MAT_045",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "耐火炉芯"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 4,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_045",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "精炼炉 生产 耐火炉芯（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_004": {
    "id": "rcp_004",
    "canonicalId": "RCP_004",
    "name": "玄铁粉",
    "category": "金属材料",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 12,
    "power": 20,
    "input": {
      "item": "MAT_006",
      "amount": 1,
      "ratePerMin": 5.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_009",
      "amount": 3,
      "ratePerMin": 15.0,
      "name": "玄铁粉"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 1,
        "rate": 5.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_009",
        "count": 3,
        "rate": 15.0
      }
    ],
    "desc": "粉碎机 生产 玄铁粉（耗时 12s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_005": {
    "id": "rcp_005",
    "canonicalId": "RCP_005",
    "name": "玄铁板",
    "category": "金属材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 6,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 20.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_008",
      "amount": 3,
      "ratePerMin": 30.0,
      "name": "玄铁板"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 20.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_008",
        "count": 3,
        "rate": 30.0
      }
    ],
    "desc": "加工台 生产 玄铁板（耗时 6s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_006": {
    "id": "rcp_006",
    "canonicalId": "RCP_006",
    "name": "玄铁齿轮",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 6,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 20.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_011",
      "amount": 1,
      "ratePerMin": 10.0,
      "name": "玄铁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 20.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 10.0
      }
    ],
    "desc": "加工台 生产 玄铁齿轮（耗时 6s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_007": {
    "id": "rcp_007",
    "canonicalId": "RCP_007",
    "name": "玄铁梁",
    "category": "基础建材",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 4,
      "ratePerMin": 12.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_014",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁梁"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 4,
        "rate": 12.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_014",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 玄铁梁（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_008": {
    "id": "rcp_008",
    "canonicalId": "RCP_008",
    "name": "导灵铜片",
    "category": "电力与控制零件",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 10,
    "power": 25,
    "input": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "赤铜锭"
    },
    "output": {
      "item": "MAT_013",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "导灵铜片"
    },
    "inputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_013",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "切割机 生产 导灵铜片（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_009": {
    "id": "rcp_009",
    "canonicalId": "RCP_009",
    "name": "铜线",
    "category": "电力与控制零件",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 6,
    "power": 25,
    "input": {
      "item": "MAT_013",
      "amount": 1,
      "ratePerMin": 10.0,
      "name": "导灵铜片"
    },
    "output": {
      "item": "MAT_019",
      "amount": 5,
      "ratePerMin": 50.0,
      "name": "铜线"
    },
    "inputs": [
      {
        "item": "MAT_013",
        "count": 1,
        "rate": 10.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_019",
        "count": 5,
        "rate": 50.0
      }
    ],
    "desc": "切割机 生产 铜线（耗时 6s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_010": {
    "id": "rcp_010",
    "canonicalId": "RCP_010",
    "name": "木板",
    "category": "基础建材",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 15,
    "power": 25,
    "input": {
      "item": "MAT_052",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "原木"
    },
    "output": {
      "item": "MAT_066",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "木板"
    },
    "inputs": [
      {
        "item": "MAT_052",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_066",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "切割机 生产 木板（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_011": {
    "id": "rcp_011",
    "canonicalId": "RCP_011",
    "name": "木架",
    "category": "基础建材",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 20,
    "power": 25,
    "input": {
      "item": "MAT_066",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "木板"
    },
    "output": {
      "item": "MAT_067",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "木架"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_067",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "切割机 生产 木架（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_012": {
    "id": "rcp_012",
    "canonicalId": "RCP_012",
    "name": "煞气合金片",
    "category": "金属材料",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 20,
    "power": 25,
    "input": {
      "item": "mat_068",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "煞气合金"
    },
    "output": {
      "item": "mat_069",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "煞气合金片"
    },
    "inputs": [
      {
        "item": "mat_068",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_069",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "切割机 生产 煞气合金片（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_013": {
    "id": "rcp_013",
    "canonicalId": "RCP_013",
    "name": "成熟灵草（母种槽常驻）",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 60,
    "power": 10,
    "input": {
      "item": "MAT_033",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "清水"
    },
    "output": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "培养皿 生产 成熟灵草（母种槽常驻）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_014": {
    "id": "rcp_014",
    "canonicalId": "RCP_014",
    "name": "血胎",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_027",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血膏"
    },
    "output": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_027",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "培养仓 生产 血胎（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_015": {
    "id": "rcp_015",
    "canonicalId": "RCP_015",
    "name": "培养液（清水+蛋白液）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_033",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "清水"
    },
    "output": {
      "item": "MAT_027",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "培养液"
    },
    "inputs": [
      {
        "item": "MAT_033",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      },
      {
        "item": "mat_023",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "搅拌机 生产 培养液（清水+蛋白液）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_017": {
    "id": "rcp_017",
    "canonicalId": "RCP_017",
    "name": "培养液（回用水+蛋白液）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_038",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "净化水"
    },
    "output": {
      "item": "MAT_027",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "培养液"
    },
    "inputs": [
      {
        "item": "MAT_038",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      },
      {
        "item": "mat_023",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "搅拌机 生产 培养液（回用水+蛋白液）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_001",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_01"
  },
  "rcp_019": {
    "id": "rcp_019",
    "canonicalId": "RCP_019",
    "name": "原浆",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_023",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "蛋白液"
    },
    "output": {
      "item": "mat_029",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "原浆"
    },
    "inputs": [
      {
        "item": "mat_023",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      },
      {
        "item": "MAT_031",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_029",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "搅拌机 生产 原浆（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_020": {
    "id": "rcp_020",
    "canonicalId": "RCP_020",
    "name": "稳定液",
    "category": "灵根、法宝与金丹核心",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_022",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "精元液"
    },
    "output": {
      "item": "mat_070",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "稳定液"
    },
    "inputs": [
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_070",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "搅拌机 生产 稳定液（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_021": {
    "id": "rcp_021",
    "canonicalId": "RCP_021",
    "name": "精元液",
    "category": "生物液体与培养物",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_029",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "原浆"
    },
    "output": {
      "item": "mat_022",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "精元液"
    },
    "inputs": [
      {
        "item": "mat_029",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_027",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "离心机 生产 精元液（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_022": {
    "id": "rcp_022",
    "canonicalId": "RCP_022",
    "name": "灵草灰肥催熟",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "木炭灰"
    },
    "output": {
      "item": "MAT_029",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "培养皿 生产 灵草灰肥催熟（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_002",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_02"
  },
  "rcp_023": {
    "id": "rcp_023",
    "canonicalId": "RCP_023",
    "name": "煞气分离",
    "category": "环保与煞气材料",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "MAT_077",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "液态煞气"
    },
    "output": {
      "item": "MAT_071",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "煞气结晶"
    },
    "inputs": [
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "离心机 生产 煞气分离（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_024": {
    "id": "rcp_024",
    "canonicalId": "RCP_024",
    "name": "高效肉块培养",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_027",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血膏"
    },
    "output": {
      "item": "mat_032",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_027",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_029",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "培养仓 生产 高效肉块培养（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_003",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_03"
  },
  "rcp_025": {
    "id": "rcp_025",
    "canonicalId": "RCP_025",
    "name": "蛋白液（清水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_018",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "血肉"
    },
    "output": {
      "item": "mat_023",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "蛋白液"
    },
    "inputs": [
      {
        "item": "mat_018",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_023",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 蛋白液（清水）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_026": {
    "id": "rcp_026",
    "canonicalId": "RCP_026",
    "name": "蛋白液（回用水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_018",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "血肉"
    },
    "output": {
      "item": "mat_023",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "蛋白液"
    },
    "inputs": [
      {
        "item": "mat_018",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_023",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 蛋白液（回用水）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_004",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_04"
  },
  "rcp_027": {
    "id": "rcp_027",
    "canonicalId": "RCP_027",
    "name": "灵草液（清水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "MAT_029",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "MAT_031",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵草液"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_031",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 灵草液（清水）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_028": {
    "id": "rcp_028",
    "canonicalId": "RCP_028",
    "name": "灵草液（回用水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "MAT_029",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "MAT_031",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵草液"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_031",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 灵草液（回用水）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_005",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_05"
  },
  "rcp_029": {
    "id": "rcp_029",
    "canonicalId": "RCP_029",
    "name": "生物滤芯（液固）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_008",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "mat_044",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "生物滤芯"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_023",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_044",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 生物滤芯（液固）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_030": {
    "id": "rcp_030",
    "canonicalId": "RCP_030",
    "name": "灵磁齿轮",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 10,
    "power": 10,
    "input": {
      "item": "MAT_011",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "玄铁齿轮"
    },
    "output": {
      "item": "MAT_012",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "灵磁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 12.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_012",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 灵磁齿轮（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_031": {
    "id": "rcp_031",
    "canonicalId": "RCP_031",
    "name": "阀门",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_042",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁管"
    },
    "output": {
      "item": "mat_012",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "阀门"
    },
    "inputs": [
      {
        "item": "mat_042",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_012",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 阀门（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_032": {
    "id": "rcp_032",
    "canonicalId": "RCP_032",
    "name": "电磁线圈",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_019",
      "amount": 5,
      "ratePerMin": 15.0,
      "name": "铜线"
    },
    "output": {
      "item": "mat_013",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "电磁线圈"
    },
    "inputs": [
      {
        "item": "MAT_019",
        "count": 5,
        "rate": 15.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_013",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 电磁线圈（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_033": {
    "id": "rcp_033",
    "canonicalId": "RCP_033",
    "name": "电路板",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_013",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "导灵铜片"
    },
    "output": {
      "item": "mat_014",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "电路板"
    },
    "inputs": [
      {
        "item": "MAT_013",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_065",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_014",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 电路板（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_034": {
    "id": "rcp_034",
    "canonicalId": "RCP_034",
    "name": "生物芯片",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "MAT_022",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "脑髓"
    },
    "output": {
      "item": "mat_015",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "生物芯片"
    },
    "inputs": [
      {
        "item": "MAT_022",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_013",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_015",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "打印机 生产 生物芯片（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_035": {
    "id": "rcp_035",
    "canonicalId": "RCP_035",
    "name": "净化剂（蛋白液）",
    "category": "环保与煞气材料",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_009",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "玄铁粉"
    },
    "output": {
      "item": "MAT_037",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_023",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_037",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "搅拌机 生产 净化剂（蛋白液）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_038": {
    "id": "rcp_038",
    "canonicalId": "RCP_038",
    "name": "超频模块",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_054",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "中控芯片"
    },
    "output": {
      "item": "mat_037",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "超频模块"
    },
    "inputs": [
      {
        "item": "mat_054",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_013",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_037",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "组装机 生产 超频模块（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_039": {
    "id": "rcp_039",
    "canonicalId": "RCP_039",
    "name": "骨板",
    "category": "生物液体与培养物",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "mat_053",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "人造经脉"
    },
    "output": {
      "item": "mat_038",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "骨板"
    },
    "inputs": [
      {
        "item": "mat_053",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_038",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "打印机 生产 骨板（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_040": {
    "id": "rcp_040",
    "canonicalId": "RCP_040",
    "name": "机壳",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_060",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "玄铁架"
    },
    "output": {
      "item": "mat_040",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "机壳"
    },
    "inputs": [
      {
        "item": "mat_060",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_011",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_040",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 机壳（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_041": {
    "id": "rcp_041",
    "canonicalId": "RCP_041",
    "name": "玄铁管",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "MAT_008",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "mat_042",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "玄铁管"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_042",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "加工台 生产 玄铁管（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_042": {
    "id": "rcp_042",
    "canonicalId": "RCP_042",
    "name": "循环水泵",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_042",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "玄铁管"
    },
    "output": {
      "item": "MAT_047",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "循环水泵"
    },
    "inputs": [
      {
        "item": "mat_042",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_012",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_047",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 循环水泵（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_044": {
    "id": "rcp_044",
    "canonicalId": "RCP_044",
    "name": "净化核心",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_055",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "复合滤芯"
    },
    "output": {
      "item": "mat_045",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "净化核心"
    },
    "inputs": [
      {
        "item": "mat_055",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_045",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "组装机 生产 净化核心（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_045": {
    "id": "rcp_045",
    "canonicalId": "RCP_045",
    "name": "高压电容",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_013",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "电磁线圈"
    },
    "output": {
      "item": "mat_046",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "高压电容"
    },
    "inputs": [
      {
        "item": "mat_013",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_046",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "组装机 生产 高压电容（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_046": {
    "id": "rcp_046",
    "canonicalId": "RCP_046",
    "name": "传动带",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_061",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "传动轴"
    },
    "output": {
      "item": "mat_049",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "传动带"
    },
    "inputs": [
      {
        "item": "mat_061",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_012",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_049",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 传动带（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_047": {
    "id": "rcp_047",
    "canonicalId": "RCP_047",
    "name": "人造灵根",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_059",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵根胚"
    },
    "output": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造灵根"
    },
    "inputs": [
      {
        "item": "mat_059",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_058",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "组装机 生产 人造灵根（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_048": {
    "id": "rcp_048",
    "canonicalId": "RCP_048",
    "name": "人造经脉",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_021",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "骸骨"
    },
    "output": {
      "item": "mat_053",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "人造经脉"
    },
    "inputs": [
      {
        "item": "mat_021",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_032",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_053",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "培养仓 生产 人造经脉（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_049": {
    "id": "rcp_049",
    "canonicalId": "RCP_049",
    "name": "中控芯片",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "mat_014",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "电路板"
    },
    "output": {
      "item": "mat_054",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "中控芯片"
    },
    "inputs": [
      {
        "item": "mat_014",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_015",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_054",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "打印机 生产 中控芯片（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_050": {
    "id": "rcp_050",
    "canonicalId": "RCP_050",
    "name": "复合滤芯",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_044",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "生物滤芯"
    },
    "output": {
      "item": "mat_055",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "复合滤芯"
    },
    "inputs": [
      {
        "item": "mat_044",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_055",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "组装机 生产 复合滤芯（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_051": {
    "id": "rcp_051",
    "canonicalId": "RCP_051",
    "name": "灵根支架",
    "category": "灵根、法宝与金丹核心",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_015",
      "amount": 8,
      "ratePerMin": 8.0,
      "name": "生物芯片"
    },
    "output": {
      "item": "mat_056",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵根支架"
    },
    "inputs": [
      {
        "item": "mat_015",
        "count": 8,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_038",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_056",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 灵根支架（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_052": {
    "id": "rcp_052",
    "canonicalId": "RCP_052",
    "name": "主控核心",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_037",
      "amount": 3,
      "ratePerMin": 3.0,
      "name": "超频模块"
    },
    "output": {
      "item": "mat_058",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "主控核心"
    },
    "inputs": [
      {
        "item": "mat_037",
        "count": 3,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_045",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_058",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "组装机 生产 主控核心（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_053": {
    "id": "rcp_053",
    "canonicalId": "RCP_053",
    "name": "灵根胚",
    "category": "灵根、法宝与金丹核心",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_056",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵根支架"
    },
    "output": {
      "item": "mat_059",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵根胚"
    },
    "inputs": [
      {
        "item": "mat_056",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_057",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_059",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 灵根胚（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_054": {
    "id": "rcp_054",
    "canonicalId": "RCP_054",
    "name": "玄铁架",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_014",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁梁"
    },
    "output": {
      "item": "mat_060",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁架"
    },
    "inputs": [
      {
        "item": "MAT_014",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_060",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 玄铁架（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_055": {
    "id": "rcp_055",
    "canonicalId": "RCP_055",
    "name": "传动轴",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_014",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁梁"
    },
    "output": {
      "item": "mat_061",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "传动轴"
    },
    "inputs": [
      {
        "item": "MAT_014",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_061",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 传动轴（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_056": {
    "id": "rcp_056",
    "canonicalId": "RCP_056",
    "name": "电缆",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_008",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "mat_065",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "电缆"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_019",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_065",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 电缆（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_057": {
    "id": "rcp_057",
    "canonicalId": "RCP_057",
    "name": "灵能电池",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_065",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "电缆"
    },
    "output": {
      "item": "mat_066",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵能电池"
    },
    "inputs": [
      {
        "item": "mat_065",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_066",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 灵能电池（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_058": {
    "id": "rcp_058",
    "canonicalId": "RCP_058",
    "name": "探矿仪",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_013",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "导灵铜片"
    },
    "output": {
      "item": "MAT_075",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "探矿仪"
    },
    "inputs": [
      {
        "item": "MAT_013",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_075",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 探矿仪（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_059": {
    "id": "rcp_059",
    "canonicalId": "RCP_059",
    "name": "法宝胚",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_038",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "骨板"
    },
    "output": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝胚"
    },
    "inputs": [
      {
        "item": "mat_038",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_069",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "组装机 生产 法宝胚（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_060": {
    "id": "rcp_060",
    "canonicalId": "RCP_060",
    "name": "高温合金锭",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_051",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "MAT_043",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_007",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "冶炼舱（上） 生产 高温合金锭（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_061": {
    "id": "rcp_061",
    "canonicalId": "RCP_061",
    "name": "精炼玄铁锭",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_051",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_004",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_051",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "冶炼舱（上） 生产 精炼玄铁锭（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_062": {
    "id": "rcp_062",
    "canonicalId": "RCP_062",
    "name": "动力核心",
    "category": "电力与控制零件",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 60,
    "power": 15,
    "input": {
      "item": "MAT_043",
      "amount": 6,
      "ratePerMin": 6.0,
      "name": "高温合金锭"
    },
    "output": {
      "item": "mat_057",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "动力核心"
    },
    "inputs": [
      {
        "item": "MAT_043",
        "count": 6,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_046",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_057",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "冶炼舱（上） 生产 动力核心（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_063": {
    "id": "rcp_063",
    "canonicalId": "RCP_063",
    "name": "煞气合金",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_051",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "mat_068",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "煞气合金"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_068",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "冶炼舱（上） 生产 煞气合金（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_066": {
    "id": "rcp_066",
    "canonicalId": "RCP_066",
    "name": "生物废液净化",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 60,
    "power": 20,
    "input": {
      "item": "MAT_037",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "净化剂"
    },
    "output": {
      "item": "MAT_038",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "净化水"
    },
    "inputs": [
      {
        "item": "MAT_037",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "回收处理塔 生产 生物废液净化（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_067": {
    "id": "rcp_067",
    "canonicalId": "RCP_067",
    "name": "煞气废液净化",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 60,
    "power": 20,
    "input": {
      "item": "MAT_037",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "净化剂"
    },
    "output": {
      "item": "MAT_038",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "净化水"
    },
    "inputs": [
      {
        "item": "MAT_037",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "回收处理塔 生产 煞气废液净化（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_006",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_06"
  },
  "rcp_068": {
    "id": "rcp_068",
    "canonicalId": "RCP_068",
    "name": "药渣提炼煞气",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_079",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "药渣"
    },
    "output": {
      "item": "MAT_077",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "液态煞气"
    },
    "inputs": [
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "回收处理塔 生产 药渣提炼煞气（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_069": {
    "id": "rcp_069",
    "canonicalId": "RCP_069",
    "name": "药渣再生净化粉",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_079",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "药渣"
    },
    "output": {
      "item": "MAT_037",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "mat_079",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_037",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "组装机 生产 药渣再生净化粉（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_007",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_07"
  },
  "rcp_070": {
    "id": "rcp_070",
    "canonicalId": "RCP_070",
    "name": "液态煞气",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 60,
    "power": 20,
    "input": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "滤渣"
    },
    "output": {
      "item": "MAT_077",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "液态煞气"
    },
    "inputs": [
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "回收处理塔 生产 液态煞气（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_008",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_08"
  },
  "rcp_088": {
    "id": "rcp_088",
    "canonicalId": "RCP_088",
    "name": "玄铁剑丸",
    "category": "剑丸与丹药成品",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "mat_074",
      "amount": 5,
      "ratePerMin": 20.0,
      "name": "玄铁剑丸"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_074",
        "count": 5,
        "rate": 20.0
      }
    ],
    "desc": "加工台 生产 玄铁剑丸（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_089": {
    "id": "rcp_089",
    "canonicalId": "RCP_089",
    "name": "爆裂剑丸",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_074",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "玄铁剑丸"
    },
    "output": {
      "item": "mat_075",
      "amount": 5,
      "ratePerMin": 15.0,
      "name": "爆裂剑丸"
    },
    "inputs": [
      {
        "item": "mat_074",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_075",
        "count": 5,
        "rate": 15.0
      }
    ],
    "desc": "组装机 生产 爆裂剑丸（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_090": {
    "id": "rcp_090",
    "canonicalId": "RCP_090",
    "name": "煞气剑丸",
    "category": "剑丸与丹药成品",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 25,
    "power": 45,
    "input": {
      "item": "mat_075",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "mat_076",
      "amount": 5,
      "ratePerMin": 12.0,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 2,
        "rate": 4.8,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_076",
        "count": 5,
        "rate": 12.0
      }
    ],
    "desc": "炼宝台 生产 煞气剑丸（耗时 25s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_094": {
    "id": "rcp_094",
    "canonicalId": "RCP_094",
    "name": "煞气灵草培养",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_078",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煞气灵草"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_078",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "培养皿 生产 煞气灵草培养（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_096": {
    "id": "rcp_096",
    "canonicalId": "RCP_096",
    "name": "金丹胚培养",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造灵根"
    },
    "output": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹胚"
    },
    "inputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_077",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "培养仓 生产 金丹胚培养（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_097": {
    "id": "rcp_097",
    "canonicalId": "RCP_097",
    "name": "气血丹炼制",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_080",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_018",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_023",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_080",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹炼制（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_098": {
    "id": "rcp_098",
    "canonicalId": "RCP_098",
    "name": "破障丹炼制",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_078",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煞气灵草"
    },
    "output": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "mat_078",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹炼制（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_099": {
    "id": "rcp_099",
    "canonicalId": "RCP_099",
    "name": "凝丹液提纯",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "破障丹"
    },
    "output": {
      "item": "mat_082",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "凝丹液"
    },
    "inputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_082",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 凝丹液提纯（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_100": {
    "id": "rcp_100",
    "canonicalId": "RCP_100",
    "name": "人造灵石合成",
    "category": "灵根、法宝与金丹核心",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_004",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煤炭"
    },
    "output": {
      "item": "mat_083",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "人造灵石"
    },
    "inputs": [
      {
        "item": "MAT_004",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_083",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "冶炼舱（上） 生产 人造灵石合成（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_101": {
    "id": "rcp_101",
    "canonicalId": "RCP_101",
    "name": "法宝祭炼",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝胚"
    },
    "output": {
      "item": "mat_083",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "人造灵石"
    },
    "inputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_083",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 5,
        "rate": 5.0
      }
    ],
    "desc": "炼宝台 生产 法宝祭炼（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_009",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_09"
  },
  "rcp_102": {
    "id": "rcp_102",
    "canonicalId": "RCP_102",
    "name": "渡劫凝练人造金丹",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹胚"
    },
    "output": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "inputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_058",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_083",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "渡劫台 生产 渡劫凝练人造金丹（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_103": {
    "id": "rcp_103",
    "canonicalId": "RCP_103",
    "name": "金丹点煞成石自循环",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "output": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "inputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_068",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "mat_083",
        "count": 4,
        "rate": 4.0
      }
    ],
    "desc": "渡劫台 生产 金丹点煞成石自循环（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_010",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10"
  },
  "rcp_106": {
    "id": "rcp_106",
    "canonicalId": "RCP_106",
    "name": "煤粉",
    "category": "矿物与燃料",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 10,
    "power": 20,
    "input": {
      "item": "MAT_004",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "煤炭"
    },
    "output": {
      "item": "mat_086",
      "amount": 3,
      "ratePerMin": 18.0,
      "name": "煤粉"
    },
    "inputs": [
      {
        "item": "MAT_004",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_086",
        "count": 3,
        "rate": 18.0
      }
    ],
    "desc": "粉碎机 生产 煤粉（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_107": {
    "id": "rcp_107",
    "canonicalId": "RCP_107",
    "name": "灵草粉",
    "category": "生物液体与培养物",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 10,
    "power": 20,
    "input": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_087",
      "amount": 2,
      "ratePerMin": 12.0,
      "name": "灵草粉"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_087",
        "count": 2,
        "rate": 12.0
      }
    ],
    "desc": "粉碎机 生产 灵草粉（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_108": {
    "id": "rcp_108",
    "canonicalId": "RCP_108",
    "name": "赤铜粉",
    "category": "金属材料",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 10,
    "power": 20,
    "input": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "赤铜锭"
    },
    "output": {
      "item": "mat_088",
      "amount": 3,
      "ratePerMin": 18.0,
      "name": "赤铜粉"
    },
    "inputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_088",
        "count": 3,
        "rate": 18.0
      }
    ],
    "desc": "粉碎机 生产 赤铜粉（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_109": {
    "id": "rcp_109",
    "canonicalId": "RCP_109",
    "name": "木屑",
    "category": "基础建材",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 10,
    "power": 20,
    "input": {
      "item": "MAT_066",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "木板"
    },
    "output": {
      "item": "mat_089",
      "amount": 3,
      "ratePerMin": 18.0,
      "name": "木屑"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_089",
        "count": 3,
        "rate": 18.0
      }
    ],
    "desc": "粉碎机 生产 木屑（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_110": {
    "id": "rcp_110",
    "canonicalId": "RCP_110",
    "name": "绝缘板",
    "category": "基础建材",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "mat_089",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "木屑"
    },
    "output": {
      "item": "mat_091",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "绝缘板"
    },
    "inputs": [
      {
        "item": "mat_089",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_091",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "加工台 生产 绝缘板（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_111": {
    "id": "rcp_111",
    "canonicalId": "RCP_111",
    "name": "灵磁齿轮（铜铁混粉）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 12,
    "power": 10,
    "input": {
      "item": "MAT_009",
      "amount": 2,
      "ratePerMin": 10.0,
      "name": "玄铁粉"
    },
    "output": {
      "item": "MAT_012",
      "amount": 2,
      "ratePerMin": 10.0,
      "name": "灵磁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_009",
        "count": 2,
        "rate": 10.0,
        "form": "实体"
      },
      {
        "item": "mat_088",
        "count": 2,
        "rate": 10.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_012",
        "count": 2,
        "rate": 10.0
      }
    ],
    "desc": "加工台 生产 灵磁齿轮（铜铁混粉）（耗时 12s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_011",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_11"
  },
  "rcp_112": {
    "id": "rcp_112",
    "canonicalId": "RCP_112",
    "name": "回气散",
    "category": "剑丸与丹药成品",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_087",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "灵草粉"
    },
    "output": {
      "item": "mat_090",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "回气散"
    },
    "inputs": [
      {
        "item": "mat_087",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_023",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_090",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "搅拌机 生产 回气散（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_113": {
    "id": "rcp_113",
    "canonicalId": "RCP_113",
    "name": "碳棒",
    "category": "矿物与燃料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_086",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "煤粉"
    },
    "output": {
      "item": "mat_092",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "碳棒"
    },
    "inputs": [
      {
        "item": "mat_086",
        "count": 3,
        "rate": 9.0,
        "form": "实体"
      },
      {
        "item": "MAT_009",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_092",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 碳棒（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_117": {
    "id": "rcp_117",
    "canonicalId": "RCP_117",
    "name": "法宝祭炼（绝缘灵液增产）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝胚"
    },
    "output": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_091",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 8,
        "rate": 8.0
      }
    ],
    "desc": "炼宝台 生产 法宝祭炼（绝缘灵液增产）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_122": {
    "id": "rcp_122",
    "canonicalId": "RCP_122",
    "name": "原油离心分馏（塑料+燃油）",
    "category": "基础建材",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_093",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "原油"
    },
    "output": {
      "item": "mat_096",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "塑料"
    },
    "inputs": [
      {
        "item": "mat_093",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_096",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "离心机 生产 原油离心分馏（塑料+燃油）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_123": {
    "id": "rcp_123",
    "canonicalId": "RCP_123",
    "name": "燃油二次分馏（橡胶+润滑油）",
    "category": "机械与管路零件",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_094",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "燃油"
    },
    "output": {
      "item": "mat_097",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "橡胶"
    },
    "inputs": [
      {
        "item": "mat_094",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_097",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "离心机 生产 燃油二次分馏（橡胶+润滑油）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_124": {
    "id": "rcp_124",
    "canonicalId": "RCP_124",
    "name": "原油煤粉催化裂解",
    "category": "矿物与燃料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 20,
    "power": 20,
    "input": {
      "item": "mat_086",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "煤粉"
    },
    "output": {
      "item": "mat_094",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "燃油"
    },
    "inputs": [
      {
        "item": "mat_086",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_093",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_094",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "提取器 生产 原油煤粉催化裂解（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_127": {
    "id": "rcp_127",
    "canonicalId": "RCP_127",
    "name": "玻璃熔炼",
    "category": "基础建材",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 15,
    "power": 15,
    "input": {
      "item": "mat_098",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "石英砂"
    },
    "output": {
      "item": "mat_099",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "玻璃"
    },
    "inputs": [
      {
        "item": "mat_098",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_099",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "精炼炉 生产 玻璃熔炼（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_128": {
    "id": "rcp_128",
    "canonicalId": "RCP_128",
    "name": "玻璃助熔高产",
    "category": "基础建材",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 15,
    "power": 15,
    "input": {
      "item": "mat_098",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "石英砂"
    },
    "output": {
      "item": "mat_099",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "玻璃"
    },
    "inputs": [
      {
        "item": "mat_098",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_004",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_099",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "精炼炉 生产 玻璃助熔高产（耗时 15s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_012",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12"
  },
  "rcp_129": {
    "id": "rcp_129",
    "canonicalId": "RCP_129",
    "name": "硅片精切",
    "category": "电力与控制零件",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 12,
    "power": 25,
    "input": {
      "item": "mat_099",
      "amount": 1,
      "ratePerMin": 5.0,
      "name": "玻璃"
    },
    "output": {
      "item": "mat_100",
      "amount": 2,
      "ratePerMin": 10.0,
      "name": "硅片"
    },
    "inputs": [
      {
        "item": "mat_099",
        "count": 1,
        "rate": 5.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_100",
        "count": 2,
        "rate": 10.0
      }
    ],
    "desc": "切割机 生产 硅片精切（耗时 12s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_130": {
    "id": "rcp_130",
    "canonicalId": "RCP_130",
    "name": "药瓶封装",
    "category": "基础建材",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 15,
    "power": 30,
    "input": {
      "item": "mat_099",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "玻璃"
    },
    "output": {
      "item": "mat_101",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "药瓶"
    },
    "inputs": [
      {
        "item": "mat_099",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_096",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_101",
        "count": 4,
        "rate": 16.0
      }
    ],
    "desc": "打印机 生产 药瓶封装（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_131": {
    "id": "rcp_131",
    "canonicalId": "RCP_131",
    "name": "灵石矿粉碎分选",
    "category": "矿物与燃料",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 15,
    "power": 20,
    "input": {
      "item": "mat_102",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "灵石矿"
    },
    "output": {
      "item": "mat_103",
      "amount": 3,
      "ratePerMin": 12.0,
      "name": "灵石粉"
    },
    "inputs": [
      {
        "item": "mat_102",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_103",
        "count": 3,
        "rate": 12.0
      },
      {
        "item": "mat_104",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "粉碎机 生产 灵石矿粉碎分选（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_132": {
    "id": "rcp_132",
    "canonicalId": "RCP_132",
    "name": "铅板压制",
    "category": "金属材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "mat_104",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "铅锭"
    },
    "output": {
      "item": "mat_105",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "铅板"
    },
    "inputs": [
      {
        "item": "mat_104",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_105",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "加工台 生产 铅板压制（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_133": {
    "id": "rcp_133",
    "canonicalId": "RCP_133",
    "name": "灵泉离心分离（灵石粉+重水）",
    "category": "矿物与燃料",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_106",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "灵泉"
    },
    "output": {
      "item": "mat_103",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵石粉"
    },
    "inputs": [
      {
        "item": "mat_106",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_103",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "离心机 生产 灵泉离心分离（灵石粉+重水）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_013",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_13"
  },
  "rcp_134": {
    "id": "rcp_134",
    "canonicalId": "RCP_134",
    "name": "灵液提纯（副产煞水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_103",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_107",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "灵液"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_107",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 灵液提纯（副产煞水）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_135": {
    "id": "rcp_135",
    "canonicalId": "RCP_135",
    "name": "灵石矿浸洗制重水",
    "category": "环保与煞气材料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_102",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵石矿"
    },
    "output": {
      "item": "mat_108",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "重水"
    },
    "inputs": [
      {
        "item": "mat_102",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_108",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 灵石矿浸洗制重水（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_136": {
    "id": "rcp_136",
    "canonicalId": "RCP_136",
    "name": "核燃料棒封装",
    "category": "矿物与燃料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 60,
    "power": 15,
    "input": {
      "item": "mat_103",
      "amount": 4,
      "ratePerMin": 4.0,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_109",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "燃料棒"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_105",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_109",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "冶炼舱（上） 生产 核燃料棒封装（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_137": {
    "id": "rcp_137",
    "canonicalId": "RCP_137",
    "name": "人造灵石（灵液浓缩法）",
    "category": "灵根、法宝与金丹核心",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "mat_103",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_083",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "人造灵石"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 3,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_083",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "冶炼舱（上） 生产 人造灵石（灵液浓缩法）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_014",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_14"
  },
  "rcp_138": {
    "id": "rcp_138",
    "canonicalId": "RCP_138",
    "name": "稳定液（灵液高产法）",
    "category": "灵根、法宝与金丹核心",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_107",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "灵液"
    },
    "output": {
      "item": "mat_070",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "稳定液"
    },
    "inputs": [
      {
        "item": "mat_107",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_070",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "搅拌机 生产 稳定液（灵液高产法）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_015",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_15"
  },
  "rcp_139": {
    "id": "rcp_139",
    "canonicalId": "RCP_139",
    "name": "绝缘板（塑木复合高产）",
    "category": "基础建材",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 15,
    "power": 30,
    "input": {
      "item": "mat_089",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "木屑"
    },
    "output": {
      "item": "mat_091",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "绝缘板"
    },
    "inputs": [
      {
        "item": "mat_089",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_096",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_091",
        "count": 4,
        "rate": 16.0
      }
    ],
    "desc": "打印机 生产 绝缘板（塑木复合高产）（耗时 15s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_016",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_16"
  },
  "rcp_140": {
    "id": "rcp_140",
    "canonicalId": "RCP_140",
    "name": "电路板（硅片润滑高产）",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 20,
    "power": 30,
    "input": {
      "item": "mat_100",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "硅片"
    },
    "output": {
      "item": "mat_014",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "电路板"
    },
    "inputs": [
      {
        "item": "mat_100",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_096",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_014",
        "count": 3,
        "rate": 9.0
      }
    ],
    "desc": "打印机 生产 电路板（硅片润滑高产）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_017",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_17"
  },
  "rcp_142": {
    "id": "rcp_142",
    "canonicalId": "RCP_142",
    "name": "生物芯片（硅片高产）",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 20,
    "power": 30,
    "input": {
      "item": "MAT_022",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "脑髓"
    },
    "output": {
      "item": "mat_015",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "生物芯片"
    },
    "inputs": [
      {
        "item": "MAT_022",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_100",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_015",
        "count": 3,
        "rate": 9.0
      }
    ],
    "desc": "打印机 生产 生物芯片（硅片高产）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_018",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_18"
  },
  "rcp_143": {
    "id": "rcp_143",
    "canonicalId": "RCP_143",
    "name": "中控芯片（硅片直焊）",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "mat_100",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "硅片"
    },
    "output": {
      "item": "mat_054",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "中控芯片"
    },
    "inputs": [
      {
        "item": "mat_100",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_015",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_054",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "打印机 生产 中控芯片（硅片直焊）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_019",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_19"
  },
  "rcp_144": {
    "id": "rcp_144",
    "canonicalId": "RCP_144",
    "name": "灵磁齿轮（灵石粉润滑高产）",
    "category": "机械与管路零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 15,
    "power": 50,
    "input": {
      "item": "MAT_011",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "玄铁齿轮"
    },
    "output": {
      "item": "MAT_012",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "灵磁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_103",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_012",
        "count": 4,
        "rate": 16.0
      }
    ],
    "desc": "组装机 生产 灵磁齿轮（灵石粉润滑高产）（耗时 15s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_020",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_20"
  },
  "rcp_145": {
    "id": "rcp_145",
    "canonicalId": "RCP_145",
    "name": "传动带（橡胶润滑高产）",
    "category": "机械与管路零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_097",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "橡胶"
    },
    "output": {
      "item": "mat_049",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "传动带"
    },
    "inputs": [
      {
        "item": "mat_097",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_061",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_049",
        "count": 3,
        "rate": 9.0
      }
    ],
    "desc": "组装机 生产 传动带（橡胶润滑高产）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_021",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_21"
  },
  "rcp_146": {
    "id": "rcp_146",
    "canonicalId": "RCP_146",
    "name": "阀门（橡胶密封高产）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_042",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁管"
    },
    "output": {
      "item": "mat_012",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "阀门"
    },
    "inputs": [
      {
        "item": "mat_042",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_097",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_012",
        "count": 3,
        "rate": 9.0
      }
    ],
    "desc": "加工台 生产 阀门（橡胶密封高产）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_022",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_22"
  },
  "rcp_147": {
    "id": "rcp_147",
    "canonicalId": "RCP_147",
    "name": "电缆（橡胶护套高产）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "MAT_019",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "铜线"
    },
    "output": {
      "item": "mat_065",
      "amount": 3,
      "ratePerMin": 12.0,
      "name": "电缆"
    },
    "inputs": [
      {
        "item": "MAT_019",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_097",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_065",
        "count": 3,
        "rate": 12.0
      }
    ],
    "desc": "加工台 生产 电缆（橡胶护套高产）（耗时 15s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_023",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_01"
  },
  "rcp_148": {
    "id": "rcp_148",
    "canonicalId": "RCP_148",
    "name": "高压电容（碳棒绝缘法）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_091",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "绝缘板"
    },
    "output": {
      "item": "mat_046",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "高压电容"
    },
    "inputs": [
      {
        "item": "mat_091",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_046",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "组装机 生产 高压电容（碳棒绝缘法）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_024",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_02"
  },
  "rcp_149": {
    "id": "rcp_149",
    "canonicalId": "RCP_149",
    "name": "精炼玄铁锭（燃油碳棒高产）",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_051",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_051",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "冶炼舱（上） 生产 精炼玄铁锭（燃油碳棒高产）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_025",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_03"
  },
  "rcp_151": {
    "id": "rcp_151",
    "canonicalId": "RCP_151",
    "name": "灵草灵泉催熟",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "木炭灰"
    },
    "output": {
      "item": "MAT_029",
      "amount": 5,
      "ratePerMin": 10.0,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 5,
        "rate": 10.0
      }
    ],
    "desc": "培养皿 生产 灵草灵泉催熟（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_026",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_04"
  },
  "rcp_152": {
    "id": "rcp_152",
    "canonicalId": "RCP_152",
    "name": "煞气灵草（种子辐射诱变）",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_028",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵草种子"
    },
    "output": {
      "item": "mat_078",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "煞气灵草"
    },
    "inputs": [
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_078",
        "count": 4,
        "rate": 8.0
      }
    ],
    "desc": "培养皿 生产 煞气灵草（种子辐射诱变）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_027",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_05"
  },
  "rcp_154": {
    "id": "rcp_154",
    "canonicalId": "RCP_154",
    "name": "高温合金锭（炉芯重水模铸）",
    "category": "金属材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "MAT_045",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "耐火炉芯"
    },
    "output": {
      "item": "MAT_043",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_045",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_060",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 4,
        "rate": 8.0
      }
    ],
    "desc": "组装机 生产 高温合金锭（炉芯重水模铸）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_028",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_06"
  },
  "rcp_155": {
    "id": "rcp_155",
    "canonicalId": "RCP_155",
    "name": "爆裂剑丸（燃油弹链装填）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_074",
      "amount": 4,
      "ratePerMin": 12.0,
      "name": "玄铁剑丸"
    },
    "output": {
      "item": "mat_075",
      "amount": 10,
      "ratePerMin": 30.0,
      "name": "爆裂剑丸"
    },
    "inputs": [
      {
        "item": "mat_074",
        "count": 4,
        "rate": 12.0,
        "form": "实体"
      },
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_075",
        "count": 10,
        "rate": 30.0
      }
    ],
    "desc": "组装机 生产 爆裂剑丸（燃油弹链装填）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_029",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_07"
  },
  "rcp_156": {
    "id": "rcp_156",
    "canonicalId": "RCP_156",
    "name": "动力核心（电池机壳封装）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_040",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "机壳"
    },
    "output": {
      "item": "mat_057",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "动力核心"
    },
    "inputs": [
      {
        "item": "mat_040",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_066",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_057",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "组装机 生产 动力核心（电池机壳封装）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_030",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_08"
  },
  "rcp_157": {
    "id": "rcp_157",
    "canonicalId": "RCP_157",
    "name": "燃料棒（液冷泵阀高产）",
    "category": "矿物与燃料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_012",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "阀门"
    },
    "output": {
      "item": "mat_109",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "燃料棒"
    },
    "inputs": [
      {
        "item": "mat_012",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_047",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_109",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "组装机 生产 燃料棒（液冷泵阀高产）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_031",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_09"
  },
  "rcp_158": {
    "id": "rcp_158",
    "canonicalId": "RCP_158",
    "name": "生物滤芯（木架压制）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_067",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "木架"
    },
    "output": {
      "item": "mat_044",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "生物滤芯"
    },
    "inputs": [
      {
        "item": "MAT_067",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_018",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_044",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 生物滤芯（木架压制）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_032",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10"
  },
  "rcp_165": {
    "id": "rcp_165",
    "canonicalId": "RCP_165",
    "name": "煞水结晶回收",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "MAT_040",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "滤渣"
    },
    "output": {
      "item": "MAT_038",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "净化水"
    },
    "inputs": [
      {
        "item": "MAT_040",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_038",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "回收处理塔 生产 煞水结晶回收（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_033",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_11"
  },
  "rcp_171": {
    "id": "rcp_171",
    "canonicalId": "RCP_171",
    "name": "煞气剑丸（灵石粉装药）",
    "category": "剑丸与丹药成品",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 25,
    "power": 45,
    "input": {
      "item": "mat_075",
      "amount": 3,
      "ratePerMin": 7.2,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "mat_076",
      "amount": 8,
      "ratePerMin": 19.2,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 3,
        "rate": 7.2,
        "form": "实体"
      },
      {
        "item": "mat_103",
        "count": 2,
        "rate": 4.8,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_076",
        "count": 8,
        "rate": 19.2
      }
    ],
    "desc": "炼宝台 生产 煞气剑丸（灵石粉装药）（耗时 25s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_034",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12"
  },
  "rcp_175": {
    "id": "rcp_175",
    "canonicalId": "RCP_175",
    "name": "气血丹（练气整尸血炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_020",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "练气修士尸体"
    },
    "output": {
      "item": "mat_080",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "MAT_020",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_080",
        "count": 3,
        "rate": 6.0
      },
      {
        "item": "mat_079",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹（练气整尸血炼）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_035",
    "obtainWay": "魔道遗府洞天 / 天魔首领掉落",
    "poolGroup": "POOL_13"
  },
  "rcp_176": {
    "id": "rcp_176",
    "canonicalId": "RCP_176",
    "name": "破障丹（筑基整尸血炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "筑基修士尸体"
    },
    "output": {
      "item": "mat_081",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_078",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_079",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹（筑基整尸血炼）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_036",
    "obtainWay": "魔道遗府洞天 / 天魔首领掉落",
    "poolGroup": "POOL_14"
  },
  "rcp_177": {
    "id": "rcp_177",
    "canonicalId": "RCP_177",
    "name": "凝丹液（金丹整尸直萃）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 60,
    "power": 20,
    "input": {
      "item": "MAT_056",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹修士尸体"
    },
    "output": {
      "item": "mat_082",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "凝丹液"
    },
    "inputs": [
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_082",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 凝丹液（金丹整尸直萃）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_037",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_15"
  },
  "rcp_178": {
    "id": "rcp_178",
    "canonicalId": "RCP_178",
    "name": "气血丹（药瓶流水线）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_101",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "药瓶"
    },
    "output": {
      "item": "mat_080",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "mat_101",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_090",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_080",
        "count": 4,
        "rate": 8.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹（药瓶流水线）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_038",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_16"
  },
  "rcp_179": {
    "id": "rcp_179",
    "canonicalId": "RCP_179",
    "name": "破障丹（药瓶流水线）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_101",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "药瓶"
    },
    "output": {
      "item": "mat_081",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "mat_101",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 3,
        "rate": 6.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹（药瓶流水线）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_039",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_17"
  },
  "rcp_185": {
    "id": "rcp_185",
    "canonicalId": "RCP_185",
    "name": "法宝成品祭炼（动力核心）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝胚"
    },
    "output": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_057",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 10,
        "rate": 10.0
      }
    ],
    "desc": "炼宝台 生产 法宝成品祭炼（动力核心）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_040",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_18"
  },
  "rcp_187": {
    "id": "rcp_187",
    "canonicalId": "RCP_187",
    "name": "法宝胚（剑丸玻璃祭炼）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 30,
    "power": 45,
    "input": {
      "item": "mat_076",
      "amount": 5,
      "ratePerMin": 10.0,
      "name": "煞气剑丸"
    },
    "output": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "法宝胚"
    },
    "inputs": [
      {
        "item": "mat_076",
        "count": 5,
        "rate": 10.0,
        "form": "实体"
      },
      {
        "item": "mat_099",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 6,
        "rate": 12.0
      }
    ],
    "desc": "炼宝台 生产 法宝胚（剑丸玻璃祭炼）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_041",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_19"
  },
  "rcp_188": {
    "id": "rcp_188",
    "canonicalId": "RCP_188",
    "name": "碎丹聚宝",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_077",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹碎片"
    },
    "output": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_077",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_053",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "mat_083",
        "count": 3,
        "rate": 3.0
      }
    ],
    "desc": "炼宝台 生产 碎丹聚宝（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_042",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_20"
  },
  "rcp_191": {
    "id": "rcp_191",
    "canonicalId": "RCP_191",
    "name": "煞气灵草提纯液态煞气",
    "category": "环保与煞气材料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_078",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煞气灵草"
    },
    "output": {
      "item": "MAT_077",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "液态煞气"
    },
    "inputs": [
      {
        "item": "mat_078",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_077",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 煞气灵草提纯液态煞气（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_043",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_21"
  },
  "rcp_192": {
    "id": "rcp_192",
    "canonicalId": "RCP_192",
    "name": "终局满配双倍渡劫凝丹",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹胚"
    },
    "output": {
      "item": "mat_085",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "人造金丹"
    },
    "inputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_109",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_085",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 20,
        "rate": 20.0
      }
    ],
    "desc": "渡劫台 生产 终局满配双倍渡劫凝丹（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_044",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_22"
  },
  "rcp_193": {
    "id": "rcp_193",
    "canonicalId": "RCP_193",
    "name": "灵草留种扩繁",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "MAT_028",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "灵草种子"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_028",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "培养皿 生产 灵草留种扩繁（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_194": {
    "id": "rcp_194",
    "canonicalId": "RCP_194",
    "name": "原木留种扩繁",
    "category": "生物液体与培养物",
    "building": "wood_nursery",
    "buildingId": "wood_nursery",
    "timeSec": 20,
    "power": 15,
    "input": {
      "item": "MAT_052",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "原木"
    },
    "output": {
      "item": "mat_111",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "原木树苗"
    },
    "inputs": [
      {
        "item": "MAT_052",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_111",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "灵木培育槽 生产 原木留种扩繁（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_195": {
    "id": "rcp_195",
    "canonicalId": "RCP_195",
    "name": "灵木基础培育（母种槽常驻）",
    "category": "基础建材",
    "building": "wood_nursery",
    "buildingId": "wood_nursery",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "MAT_033",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "清水"
    },
    "output": {
      "item": "MAT_052",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "原木"
    },
    "inputs": [
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_052",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "灵木培育槽 生产 灵木基础培育（母种槽常驻）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_196": {
    "id": "rcp_196",
    "canonicalId": "RCP_196",
    "name": "灵木辐射诱变速生",
    "category": "基础建材",
    "building": "wood_nursery",
    "buildingId": "wood_nursery",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "mat_111",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "原木树苗"
    },
    "output": {
      "item": "MAT_052",
      "amount": 6,
      "ratePerMin": 12.0,
      "name": "原木"
    },
    "inputs": [
      {
        "item": "mat_111",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_052",
        "count": 6,
        "rate": 12.0
      }
    ],
    "desc": "灵木培育槽 生产 灵木辐射诱变速生（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_045",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_01"
  },
  "rcp_197": {
    "id": "rcp_197",
    "canonicalId": "RCP_197",
    "name": "仿生血肉打印（工业保底）",
    "category": "生物解构原料",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "MAT_029",
      "amount": 4,
      "ratePerMin": 4.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_018",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "血肉"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_096",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_018",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 仿生血肉打印（工业保底）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_198": {
    "id": "rcp_198",
    "canonicalId": "RCP_198",
    "name": "人工骸骨打印（工业保底）",
    "category": "生物解构原料",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_018",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "血肉"
    },
    "output": {
      "item": "mat_021",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "骸骨"
    },
    "inputs": [
      {
        "item": "mat_018",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_098",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_021",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 人工骸骨打印（工业保底）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_199": {
    "id": "rcp_199",
    "canonicalId": "RCP_199",
    "name": "拟态脑髓打印（工业保底）",
    "category": "生物解构原料",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "血胎"
    },
    "output": {
      "item": "MAT_022",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "脑髓"
    },
    "inputs": [
      {
        "item": "mat_032",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_100",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_022",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 拟态脑髓打印（工业保底）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_200": {
    "id": "rcp_200",
    "canonicalId": "RCP_200",
    "name": "人工碎丹核合成（终局工业保底）",
    "category": "生物解构原料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
    "input": {
      "item": "mat_083",
      "amount": 4,
      "ratePerMin": 4.0,
      "name": "人造灵石"
    },
    "output": {
      "item": "mat_077",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹碎片"
    },
    "inputs": [
      {
        "item": "mat_083",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_077",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "组装机 生产 人工碎丹核合成（终局工业保底）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_201": {
    "id": "rcp_201",
    "canonicalId": "RCP_201",
    "name": "兽卵孵育",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血胎"
    },
    "output": {
      "item": "mat_112",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "兽卵"
    },
    "inputs": [
      {
        "item": "mat_032",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_112",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "培养仓 生产 兽卵孵育（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_202": {
    "id": "rcp_202",
    "canonicalId": "RCP_202",
    "name": "兽粮（草木调配）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_113",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "兽粮"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_089",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_113",
        "count": 4,
        "rate": 16.0
      }
    ],
    "desc": "搅拌机 生产 兽粮（草木调配）（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_203": {
    "id": "rcp_203",
    "canonicalId": "RCP_203",
    "name": "兽粮（血肉高能）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_018",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "血肉"
    },
    "output": {
      "item": "mat_113",
      "amount": 6,
      "ratePerMin": 18.0,
      "name": "兽粮"
    },
    "inputs": [
      {
        "item": "mat_018",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_087",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_113",
        "count": 6,
        "rate": 18.0
      }
    ],
    "desc": "搅拌机 生产 兽粮（血肉高能）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_046",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_02"
  },
  "rcp_204": {
    "id": "rcp_204",
    "canonicalId": "RCP_204",
    "name": "一阶灵兽饲育（产兽甲兽髓）",
    "category": "生物解构原料",
    "building": "beast_pen",
    "buildingId": "beast_pen",
    "timeSec": 30,
    "power": 25,
    "input": {
      "item": "mat_113",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "兽粮"
    },
    "output": {
      "item": "mat_114",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "兽甲"
    },
    "inputs": [
      {
        "item": "mat_113",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_114",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_115",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "灵兽舱 生产 一阶灵兽饲育（产兽甲兽髓）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_205": {
    "id": "rcp_205",
    "canonicalId": "RCP_205",
    "name": "灵兽辐射诱变（耗卵高产）",
    "category": "生物解构原料",
    "building": "beast_pen",
    "buildingId": "beast_pen",
    "timeSec": 30,
    "power": 25,
    "input": {
      "item": "mat_112",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "兽卵"
    },
    "output": {
      "item": "mat_114",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "兽甲"
    },
    "inputs": [
      {
        "item": "mat_112",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_113",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_114",
        "count": 4,
        "rate": 8.0
      },
      {
        "item": "mat_115",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "灵兽舱 生产 灵兽辐射诱变（耗卵高产）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_047",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_03"
  },
  "rcp_206": {
    "id": "rcp_206",
    "canonicalId": "RCP_206",
    "name": "二阶灵兽饲育（凝结妖丹）",
    "category": "生物解构原料",
    "building": "beast_pen",
    "buildingId": "beast_pen",
    "timeSec": 30,
    "power": 25,
    "input": {
      "item": "mat_113",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "兽粮"
    },
    "output": {
      "item": "mat_116",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "妖丹"
    },
    "inputs": [
      {
        "item": "mat_113",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_116",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_115",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "灵兽舱 生产 二阶灵兽饲育（凝结妖丹）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_207": {
    "id": "rcp_207",
    "canonicalId": "RCP_207",
    "name": "三阶灵兽饲育（孕育兽魂）",
    "category": "生物解构原料",
    "building": "beast_pen",
    "buildingId": "beast_pen",
    "timeSec": 60,
    "power": 25,
    "input": {
      "item": "mat_116",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "妖丹"
    },
    "output": {
      "item": "mat_117",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "兽魂"
    },
    "inputs": [
      {
        "item": "mat_116",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_081",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_117",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "mat_115",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "灵兽舱 生产 三阶灵兽饲育（孕育兽魂）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_209": {
    "id": "rcp_209",
    "canonicalId": "RCP_209",
    "name": "复合滤芯（兽甲压制）",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_114",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "兽甲"
    },
    "output": {
      "item": "mat_055",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "复合滤芯"
    },
    "inputs": [
      {
        "item": "mat_114",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_044",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_055",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "组装机 生产 复合滤芯（兽甲压制）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_048",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_04"
  },
  "rcp_210": {
    "id": "rcp_210",
    "canonicalId": "RCP_210",
    "name": "兽髓离心提纯精元液",
    "category": "生物液体与培养物",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 20,
    "power": 35,
    "input": {
      "item": "mat_115",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "兽髓"
    },
    "output": {
      "item": "mat_022",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "精元液"
    },
    "inputs": [
      {
        "item": "mat_115",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_022",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "mat_027",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "离心机 生产 兽髓离心提纯精元液（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_049",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_05"
  },
  "rcp_211": {
    "id": "rcp_211",
    "canonicalId": "RCP_211",
    "name": "金丹胚（妖丹替代凝育）",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造灵根"
    },
    "output": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹胚"
    },
    "inputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_116",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "培养仓 生产 金丹胚（妖丹替代凝育）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_050",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_06"
  },
  "rcp_212": {
    "id": "rcp_212",
    "canonicalId": "RCP_212",
    "name": "养魂丹炼制",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_116",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "妖丹"
    },
    "output": {
      "item": "mat_118",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "养魂丹"
    },
    "inputs": [
      {
        "item": "mat_116",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_078",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_115",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_118",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 养魂丹炼制（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_213": {
    "id": "rcp_213",
    "canonicalId": "RCP_213",
    "name": "养魂丹（药瓶流水线）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_101",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "药瓶"
    },
    "output": {
      "item": "mat_118",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "养魂丹"
    },
    "inputs": [
      {
        "item": "mat_101",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_116",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_115",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_118",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 养魂丹（药瓶流水线）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_051",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_07"
  },
  "rcp_214": {
    "id": "rcp_214",
    "canonicalId": "RCP_214",
    "name": "元婴胚孕育（兽魂活体线）",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "output": {
      "item": "mat_119",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "元婴胚"
    },
    "inputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_117",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_119",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "培养仓 生产 元婴胚孕育（兽魂活体线）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_215": {
    "id": "rcp_215",
    "canonicalId": "RCP_215",
    "name": "元婴胚打印（神识芯片线）",
    "category": "灵根、法宝与金丹核心",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "output": {
      "item": "mat_119",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "元婴胚"
    },
    "inputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_054",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_115",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_119",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 元婴胚打印（神识芯片线）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_052",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_08"
  },
  "rcp_216": {
    "id": "rcp_216",
    "canonicalId": "RCP_216",
    "name": "渡劫凝练人造元婴",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_119",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "元婴胚"
    },
    "output": {
      "item": "mat_120",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造元婴"
    },
    "inputs": [
      {
        "item": "mat_119",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_118",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_058",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_120",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 25,
        "rate": 25.0
      }
    ],
    "desc": "渡劫台 生产 渡劫凝练人造元婴（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_217": {
    "id": "rcp_217",
    "canonicalId": "RCP_217",
    "name": "化神胚孕育（兽魂活体线）",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "mat_120",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造元婴"
    },
    "output": {
      "item": "mat_121",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "化神胚"
    },
    "inputs": [
      {
        "item": "mat_120",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_117",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_121",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "培养仓 生产 化神胚孕育（兽魂活体线）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_218": {
    "id": "rcp_218",
    "canonicalId": "RCP_218",
    "name": "化神胚打印（净化核心线）",
    "category": "灵根、法宝与金丹核心",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 60,
    "power": 30,
    "input": {
      "item": "mat_120",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造元婴"
    },
    "output": {
      "item": "mat_121",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "化神胚"
    },
    "inputs": [
      {
        "item": "mat_120",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_045",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_115",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_121",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "打印机 生产 化神胚打印（净化核心线）（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_053",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_09"
  },
  "rcp_219": {
    "id": "rcp_219",
    "canonicalId": "RCP_219",
    "name": "渡劫凝练人造化神",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_121",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "化神胚"
    },
    "output": {
      "item": "mat_122",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造化神"
    },
    "inputs": [
      {
        "item": "mat_121",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_043",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_118",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_122",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 40,
        "rate": 40.0
      }
    ],
    "desc": "渡劫台 生产 渡劫凝练人造化神（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_220": {
    "id": "rcp_220",
    "canonicalId": "RCP_220",
    "name": "破界飞升（飞升大千世界）",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_122",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "人造化神"
    },
    "output": {
      "item": "mat_123",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "飞升道果"
    },
    "inputs": [
      {
        "item": "mat_122",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_138",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_144",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 4,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_123",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 100,
        "rate": 100.0
      }
    ],
    "desc": "渡劫台 生产 破界飞升（飞升大千世界）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_221": {
    "id": "rcp_221",
    "canonicalId": "RCP_221",
    "name": "大千道果反哺自循环",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 60,
    "power": 80,
    "input": {
      "item": "mat_123",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "飞升道果"
    },
    "output": {
      "item": "mat_123",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "飞升道果"
    },
    "inputs": [
      {
        "item": "mat_123",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_144",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_083",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_123",
        "count": 1,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 80,
        "rate": 80.0
      }
    ],
    "desc": "渡劫台 生产 大千道果反哺自循环（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_054",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10"
  },
  "rcp_222": {
    "id": "rcp_222",
    "canonicalId": "RCP_222",
    "name": "光路芯片打印",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 20,
    "power": 30,
    "input": {
      "item": "mat_015",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "生物芯片"
    },
    "output": {
      "item": "mat_124",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "光路芯片"
    },
    "inputs": [
      {
        "item": "mat_015",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_075",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_124",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "打印机 生产 光路芯片打印（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_223": {
    "id": "rcp_223",
    "canonicalId": "RCP_223",
    "name": "神识光芯（数据刻录）",
    "category": "电力与控制零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "mat_124",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "光路芯片"
    },
    "output": {
      "item": "mat_125",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "神识光芯"
    },
    "inputs": [
      {
        "item": "mat_124",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_023",
        "count": 5,
        "rate": 10.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_125",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "打印机 生产 神识光芯（数据刻录）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_224": {
    "id": "rcp_224",
    "canonicalId": "RCP_224",
    "name": "神识光芯（滤芯高产）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_054",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "中控芯片"
    },
    "output": {
      "item": "mat_125",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "神识光芯"
    },
    "inputs": [
      {
        "item": "mat_054",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_055",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_125",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "组装机 生产 神识光芯（滤芯高产）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_055",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_11"
  },
  "rcp_225": {
    "id": "rcp_225",
    "canonicalId": "RCP_225",
    "name": "阵盘极核打印",
    "category": "灵根、法宝与金丹核心",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 30,
    "power": 30,
    "input": {
      "item": "mat_125",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "神识光芯"
    },
    "output": {
      "item": "mat_126",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "阵盘极核"
    },
    "inputs": [
      {
        "item": "mat_125",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_037",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_126",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "打印机 生产 阵盘极核打印（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_226": {
    "id": "rcp_226",
    "canonicalId": "RCP_226",
    "name": "极核金丹共鸣裂变",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_126",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "阵盘极核"
    },
    "output": {
      "item": "mat_126",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "阵盘极核"
    },
    "inputs": [
      {
        "item": "mat_126",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_085",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_126",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 30,
        "rate": 30.0
      }
    ],
    "desc": "炼宝台 生产 极核金丹共鸣裂变（耗时 60s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_056",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12"
  },
  "rcp_230": {
    "id": "rcp_230",
    "canonicalId": "RCP_230",
    "name": "乾坤货匣（木塑封装）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_066",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "木板"
    },
    "output": {
      "item": "mat_128",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "乾坤货匣"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_096",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_128",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 乾坤货匣（木塑封装）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_231": {
    "id": "rcp_231",
    "canonicalId": "RCP_231",
    "name": "乾坤货匣（玄铁重载打印）",
    "category": "机械与管路零件",
    "building": "printer",
    "buildingId": "printer",
    "timeSec": 20,
    "power": 30,
    "input": {
      "item": "mat_060",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁架"
    },
    "output": {
      "item": "mat_128",
      "amount": 4,
      "ratePerMin": 12.0,
      "name": "乾坤货匣"
    },
    "inputs": [
      {
        "item": "mat_060",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_128",
        "count": 4,
        "rate": 12.0
      }
    ],
    "desc": "打印机 生产 乾坤货匣（玄铁重载打印）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_057",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_13"
  },
  "rcp_232": {
    "id": "rcp_232",
    "canonicalId": "RCP_232",
    "name": "灵舟锻造（基础型）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "MAT_051",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "mat_127",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵舟"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 4,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_012",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_127",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 灵舟锻造（基础型）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_233": {
    "id": "rcp_233",
    "canonicalId": "RCP_233",
    "name": "灵舟批量总装（货匣联装型）",
    "category": "机械与管路零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_128",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "乾坤货匣"
    },
    "output": {
      "item": "mat_127",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "灵舟"
    },
    "inputs": [
      {
        "item": "mat_128",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_066",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_127",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "组装机 生产 灵舟批量总装（货匣联装型）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_058",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_14"
  },
  "rcp_236": {
    "id": "rcp_236",
    "canonicalId": "RCP_236",
    "name": "一阶凝灵散（灵草调拌）",
    "category": "环保与煞气材料",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "mat_087",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "灵草粉"
    },
    "output": {
      "item": "mat_129",
      "amount": 3,
      "ratePerMin": 12.0,
      "name": "一阶凝灵散"
    },
    "inputs": [
      {
        "item": "mat_087",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_086",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_129",
        "count": 3,
        "rate": 12.0
      }
    ],
    "desc": "搅拌机 生产 一阶凝灵散（灵草调拌）（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_238": {
    "id": "rcp_238",
    "canonicalId": "RCP_238",
    "name": "二阶真火剂（燃油萃取）",
    "category": "环保与煞气材料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 20,
    "power": 20,
    "input": {
      "item": "mat_129",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "一阶凝灵散"
    },
    "output": {
      "item": "mat_130",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "二阶真火剂"
    },
    "inputs": [
      {
        "item": "mat_129",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_078",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_130",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "提取器 生产 二阶真火剂（燃油萃取）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_240": {
    "id": "rcp_240",
    "canonicalId": "RCP_240",
    "name": "归墟化煞（固废+煞水炼晶）",
    "category": "环保与煞气材料",
    "building": "void_crucible",
    "buildingId": "void_crucible",
    "timeSec": 15,
    "power": 30,
    "input": {
      "item": "mat_079",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "药渣"
    },
    "output": {
      "item": "mat_132",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "归墟晶尘"
    },
    "inputs": [
      {
        "item": "mat_079",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_068",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_132",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "归墟化煞炉 生产 归墟化煞（固废+煞水炼晶）（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_241": {
    "id": "rcp_241",
    "canonicalId": "RCP_241",
    "name": "归墟化煞（血水+凝灵散炼晶）",
    "category": "环保与煞气材料",
    "building": "void_crucible",
    "buildingId": "void_crucible",
    "timeSec": 20,
    "power": 30,
    "input": {
      "item": "mat_129",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "一阶凝灵散"
    },
    "output": {
      "item": "mat_132",
      "amount": 3,
      "ratePerMin": 9.0,
      "name": "归墟晶尘"
    },
    "inputs": [
      {
        "item": "mat_129",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_027",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 2,
        "rate": 6.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_132",
        "count": 3,
        "rate": 9.0
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "归墟化煞炉 生产 归墟化煞（血水+凝灵散炼晶）（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_059",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_15"
  },
  "rcp_242": {
    "id": "rcp_242",
    "canonicalId": "RCP_242",
    "name": "三阶造化丹（万象总装）",
    "category": "剑丸与丹药成品",
    "building": "omni_assembler",
    "buildingId": "omni_assembler",
    "timeSec": 30,
    "power": 80,
    "input": {
      "item": "mat_132",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "归墟晶尘"
    },
    "output": {
      "item": "mat_131",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "三阶造化丹"
    },
    "inputs": [
      {
        "item": "mat_132",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_081",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_129",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_130",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_131",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_023",
        "count": 5,
        "rate": 10.0
      }
    ],
    "desc": "万象总装机 生产 三阶造化丹（万象总装）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_244": {
    "id": "rcp_244",
    "canonicalId": "RCP_244",
    "name": "凡阶玉简（加工台刻录）",
    "category": "研究货币",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 10,
    "power": 10,
    "input": {
      "item": "MAT_013",
      "amount": 2,
      "ratePerMin": 12.0,
      "name": "导灵铜片"
    },
    "output": {
      "item": "mat_133",
      "amount": 2,
      "ratePerMin": 12.0,
      "name": "凡阶玉简"
    },
    "inputs": [
      {
        "item": "MAT_013",
        "count": 2,
        "rate": 12.0,
        "form": "实体"
      },
      {
        "item": "mat_086",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_133",
        "count": 2,
        "rate": 12.0
      }
    ],
    "desc": "加工台 生产 凡阶玉简（加工台刻录）（耗时 10s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_246": {
    "id": "rcp_246",
    "canonicalId": "RCP_246",
    "name": "筑基灵简（组装合成）",
    "category": "研究货币",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_133",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "凡阶玉简"
    },
    "output": {
      "item": "mat_134",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "筑基灵简"
    },
    "inputs": [
      {
        "item": "mat_133",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_134",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "组装机 生产 筑基灵简（组装合成）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_248": {
    "id": "rcp_248",
    "canonicalId": "RCP_248",
    "name": "金丹道匣（丹火封匣）",
    "category": "研究货币",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_134",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "筑基灵简"
    },
    "output": {
      "item": "mat_135",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "金丹道匣"
    },
    "inputs": [
      {
        "item": "mat_134",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_081",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_135",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 金丹道匣（丹火封匣）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_250": {
    "id": "rcp_250",
    "canonicalId": "RCP_250",
    "name": "元婴法印（万象神识总装）",
    "category": "研究货币",
    "building": "omni_assembler",
    "buildingId": "omni_assembler",
    "timeSec": 30,
    "power": 80,
    "input": {
      "item": "mat_135",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "金丹道匣"
    },
    "output": {
      "item": "mat_136",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "元婴法印"
    },
    "inputs": [
      {
        "item": "mat_135",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_125",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_120",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_136",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_023",
        "count": 15,
        "rate": 30.0
      }
    ],
    "desc": "万象总装机 生产 元婴法印（万象神识总装）（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_252": {
    "id": "rcp_252",
    "canonicalId": "RCP_252",
    "name": "化神天机盘（仙造重组）",
    "category": "研究货币",
    "building": "recomposer_mk3",
    "buildingId": "recomposer_mk3",
    "timeSec": 60,
    "power": 180,
    "input": {
      "item": "mat_136",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "元婴法印"
    },
    "output": {
      "item": "mat_137",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "化神天机盘"
    },
    "inputs": [
      {
        "item": "mat_136",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_126",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_122",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_137",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "仙造重组枢机 生产 化神天机盘（仙造重组）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_254": {
    "id": "rcp_254",
    "canonicalId": "RCP_254",
    "name": "大道玄黄珠（重组凝聚）",
    "category": "研究货币",
    "building": "recomposer_mk3",
    "buildingId": "recomposer_mk3",
    "timeSec": 60,
    "power": 180,
    "input": {
      "item": "mat_137",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "化神天机盘"
    },
    "output": {
      "item": "mat_138",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "大道玄黄珠"
    },
    "inputs": [
      {
        "item": "mat_137",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_141",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_131",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_138",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "仙造重组枢机 生产 大道玄黄珠（重组凝聚）（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_263": {
    "id": "rcp_263",
    "canonicalId": "RCP_263",
    "name": "九霄高空采气（海拔增产灵液重水）",
    "category": "生物液体与培养物",
    "building": "sky_extractor",
    "buildingId": "sky_extractor",
    "timeSec": 15,
    "power": 45,
    "input": {
      "item": "mat_103",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_107",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "灵液"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 8.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_107",
        "count": 4,
        "rate": 16.0
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "九霄采气塔 生产 九霄高空采气（海拔增产灵液重水）（耗时 15s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_060",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_16"
  },
  "rcp_264": {
    "id": "rcp_264",
    "canonicalId": "RCP_264",
    "name": "真火倍速精炼玄铁与高温合金",
    "category": "金属材料",
    "building": "furnace_mk2",
    "buildingId": "furnace_mk2",
    "timeSec": 12,
    "power": 40,
    "input": {
      "item": "MAT_001",
      "amount": 4,
      "ratePerMin": 20.0,
      "name": "玄铁矿"
    },
    "output": {
      "item": "MAT_051",
      "amount": 4,
      "ratePerMin": 20.0,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "MAT_001",
        "count": 4,
        "rate": 20.0,
        "form": "实体"
      },
      {
        "item": "MAT_007",
        "count": 2,
        "rate": 10.0,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 2,
        "rate": 10.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_051",
        "count": 4,
        "rate": 20.0
      },
      {
        "item": "MAT_043",
        "count": 2,
        "rate": 10.0
      }
    ],
    "desc": "真火精炼炉 生产 真火倍速精炼玄铁与高温合金（耗时 12s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_061",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_17"
  },
  "rcp_265": {
    "id": "rcp_265",
    "canonicalId": "RCP_265",
    "name": "天魔负熵四倍熔炼",
    "category": "金属材料",
    "building": "entropy_smelter",
    "buildingId": "entropy_smelter",
    "timeSec": 10,
    "power": 120,
    "input": {
      "item": "MAT_051",
      "amount": 4,
      "ratePerMin": 24.0,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "MAT_043",
      "amount": 8,
      "ratePerMin": 48.0,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 4,
        "rate": 24.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 2,
        "rate": 12.0,
        "form": "实体"
      },
      {
        "item": "mat_132",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 8,
        "rate": 48.0
      },
      {
        "item": "mat_068",
        "count": 4,
        "rate": 24.0
      }
    ],
    "desc": "天魔负熵炉 生产 天魔负熵四倍熔炼（耗时 10s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_062",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_18"
  },
  "rcp_266": {
    "id": "rcp_266",
    "canonicalId": "RCP_266",
    "name": "诛仙雷丸（煞气封装）",
    "category": "剑丸与丹药成品",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 18,
    "power": 45,
    "input": {
      "item": "mat_076",
      "amount": 2,
      "ratePerMin": 6.67,
      "name": "煞气剑丸"
    },
    "output": {
      "item": "mat_139",
      "amount": 4,
      "ratePerMin": 13.33,
      "name": "诛仙雷丸"
    },
    "inputs": [
      {
        "item": "mat_076",
        "count": 2,
        "rate": 6.67,
        "form": "实体"
      },
      {
        "item": "mat_046",
        "count": 1,
        "rate": 3.33,
        "form": "实体"
      },
      {
        "item": "mat_130",
        "count": 1,
        "rate": 3.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_139",
        "count": 4,
        "rate": 13.33
      }
    ],
    "desc": "炼宝台 生产 诛仙雷丸（煞气封装）（耗时 18s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_267": {
    "id": "rcp_267",
    "canonicalId": "RCP_267",
    "name": "诛仙雷丸与兽魂器灵联装",
    "category": "剑丸与丹药成品",
    "building": "omni_assembler",
    "buildingId": "omni_assembler",
    "timeSec": 20,
    "power": 80,
    "input": {
      "item": "mat_075",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "mat_139",
      "amount": 6,
      "ratePerMin": 18.0,
      "name": "诛仙雷丸"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_105",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_117",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_139",
        "count": 6,
        "rate": 18.0
      },
      {
        "item": "mat_145",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "万象总装机 生产 诛仙雷丸与兽魂器灵联装（耗时 20s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_063",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_19"
  },
  "rcp_270": {
    "id": "rcp_270",
    "canonicalId": "RCP_270",
    "name": "阴阳粒子对撞制备反煞晶核",
    "category": "矿物与燃料",
    "building": "particle_collider",
    "buildingId": "particle_collider",
    "timeSec": 30,
    "power": 1200,
    "input": {
      "item": "mat_140",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "天魔道骨"
    },
    "output": {
      "item": "mat_141",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "反煞晶核"
    },
    "inputs": [
      {
        "item": "mat_140",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_109",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      },
      {
        "item": "MAT_077",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_141",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_132",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "阴阳对撞仪 生产 阴阳粒子对撞制备反煞晶核（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_271": {
    "id": "rcp_271",
    "canonicalId": "RCP_271",
    "name": "重水对撞赋灵（晶核+器灵枢机核）",
    "category": "矿物与燃料",
    "building": "particle_collider",
    "buildingId": "particle_collider",
    "timeSec": 30,
    "power": 1200,
    "input": {
      "item": "mat_083",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "人造灵石"
    },
    "output": {
      "item": "mat_141",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "反煞晶核"
    },
    "inputs": [
      {
        "item": "mat_083",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_132",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_141",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_145",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "阴阳对撞仪 生产 重水对撞赋灵（晶核+器灵枢机核）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_064",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_20"
  },
  "rcp_272": {
    "id": "rcp_272",
    "canonicalId": "RCP_272",
    "name": "九转丹神炉锻魂器灵与星辰幡",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_furnace_mk2",
    "buildingId": "alchemy_furnace_mk2",
    "timeSec": 30,
    "power": 40,
    "input": {
      "item": "mat_117",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "兽魂"
    },
    "output": {
      "item": "mat_145",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "器灵枢机核"
    },
    "inputs": [
      {
        "item": "mat_117",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_085",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_131",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_145",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_142",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "九转丹神炉 生产 九转丹神炉锻魂器灵与星辰幡（耗时 30s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_273": {
    "id": "rcp_273",
    "canonicalId": "RCP_273",
    "name": "仙造重组星辰幡与破界穿云舰",
    "category": "灵根、法宝与金丹核心",
    "building": "recomposer_mk3",
    "buildingId": "recomposer_mk3",
    "timeSec": 60,
    "power": 180,
    "input": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "法宝"
    },
    "output": {
      "item": "mat_142",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "周天星辰幡"
    },
    "inputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_141",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_145",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_142",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "mat_143",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "仙造重组枢机 生产 仙造重组星辰幡与破界穿云舰（耗时 60s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_276": {
    "id": "rcp_276",
    "canonicalId": "RCP_276",
    "name": "灵木纸鹤（木板折鹤）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "MAT_066",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "木板"
    },
    "output": {
      "item": "mat_146",
      "amount": 4,
      "ratePerMin": 16.0,
      "name": "灵木纸鹤"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_103",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_146",
        "count": 4,
        "rate": 16.0
      }
    ],
    "desc": "加工台 生产 灵木纸鹤（木板折鹤）（耗时 15s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_280": {
    "id": "rcp_280",
    "canonicalId": "RCP_280",
    "name": "空置蓄灵匣（超导封装）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_066",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "灵能电池"
    },
    "output": {
      "item": "mat_147",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "空置蓄灵匣"
    },
    "inputs": [
      {
        "item": "mat_066",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_046",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_105",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_147",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "组装机 生产 空置蓄灵匣（超导封装）（耗时 20s）",
    "recipeTier": "mainline",
    "recipeTierLabel": "★ 主线标准 (1物1方)"
  },
  "rcp_285": {
    "id": "rcp_285",
    "canonicalId": "RCP_285",
    "name": "满载蓄灵匣直驱对撞反煞（退空匣）",
    "category": "矿物与燃料",
    "building": "particle_collider",
    "buildingId": "particle_collider",
    "timeSec": 30,
    "power": 1200,
    "input": {
      "item": "mat_148",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "满载蓄灵匣"
    },
    "output": {
      "item": "mat_141",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "反煞晶核"
    },
    "inputs": [
      {
        "item": "mat_148",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_140",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_141",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_147",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "阴阳对撞仪 生产 满载蓄灵匣直驱对撞反煞（退空匣）（耗时 30s）",
    "recipeTier": "alternate",
    "recipeTierLabel": "✦ 古修秘传残卷",
    "scrollId": "SCR_065",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_21"
  }
};

const XIUXIAN_FACILITY_RULES = {
  "frl_001": {
    "id": "frl_001",
    "ruleId": "FRL_001",
    "canonicalId": "RCP_064",
    "name": "燃木发电",
    "category": "燃能发电",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 60,
    "power": -100,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_052",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "原木"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_052",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 燃料发电机 机制运转：燃木发电（耗时 60s）"
  },
  "frl_002": {
    "id": "frl_002",
    "ruleId": "FRL_002",
    "canonicalId": "RCP_065",
    "name": "木板发电",
    "category": "燃能发电",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 60,
    "power": -100,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_066",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "木板"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 燃料发电机 机制运转：木板发电（耗时 60s）"
  },
  "frl_003": {
    "id": "frl_003",
    "ruleId": "FRL_003",
    "canonicalId": "RCP_071",
    "name": "玄铁锭（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_001",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "玄铁矿"
    },
    "output": {
      "item": "MAT_006",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "玄铁锭"
    },
    "inputs": [
      {
        "item": "MAT_001",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_006",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：玄铁锭（手搓）（耗时 30s）"
  },
  "frl_004": {
    "id": "frl_004",
    "ruleId": "FRL_004",
    "canonicalId": "RCP_072",
    "name": "玄铁板（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_008",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "玄铁板"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_008",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：玄铁板（手搓）（耗时 30s）"
  },
  "frl_005": {
    "id": "frl_005",
    "ruleId": "FRL_005",
    "canonicalId": "RCP_073",
    "name": "玄铁齿轮（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_011",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "玄铁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：玄铁齿轮（手搓）（耗时 30s）"
  },
  "frl_006": {
    "id": "frl_006",
    "ruleId": "FRL_006",
    "canonicalId": "RCP_074",
    "name": "玄铁梁（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 60,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_006",
      "amount": 4,
      "ratePerMin": 4.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_014",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "玄铁梁"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_014",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：玄铁梁（手搓）（耗时 60s）"
  },
  "frl_007": {
    "id": "frl_007",
    "ruleId": "FRL_007",
    "canonicalId": "RCP_075",
    "name": "耐火炉芯（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 60,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_008",
      "amount": 4,
      "ratePerMin": 4.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "MAT_045",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "耐火炉芯"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 4,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_045",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：耐火炉芯（手搓）（耗时 60s）"
  },
  "frl_008": {
    "id": "frl_008",
    "ruleId": "FRL_008",
    "canonicalId": "RCP_076",
    "name": "电缆（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 20,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_008",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "玄铁板"
    },
    "output": {
      "item": "mat_065",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "电缆"
    },
    "inputs": [
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_019",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_065",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：电缆（手搓）（耗时 20s）"
  },
  "frl_009": {
    "id": "frl_009",
    "ruleId": "FRL_009",
    "canonicalId": "RCP_077",
    "name": "灵能电池（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_065",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "电缆"
    },
    "output": {
      "item": "mat_066",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵能电池"
    },
    "inputs": [
      {
        "item": "mat_065",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_066",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：灵能电池（手搓）（耗时 30s）"
  },
  "frl_010": {
    "id": "frl_010",
    "ruleId": "FRL_010",
    "canonicalId": "RCP_078",
    "name": "抽取清水",
    "category": "资源采掘",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 15,
    "power": 10,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_033",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "清水"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "[资源采掘] 抽水机 机制运转：抽取清水（耗时 15s）"
  },
  "frl_011": {
    "id": "frl_011",
    "ruleId": "FRL_011",
    "canonicalId": "RCP_079",
    "name": "采集玄铁矿",
    "category": "资源采掘",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_001",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "玄铁矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_001",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "[资源采掘] 采矿机 机制运转：采集玄铁矿（耗时 10s）"
  },
  "frl_012": {
    "id": "frl_012",
    "ruleId": "FRL_012",
    "canonicalId": "RCP_080",
    "name": "采集赤铜矿",
    "category": "资源采掘",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_002",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "赤铜矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_002",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "[资源采掘] 采矿机 机制运转：采集赤铜矿（耗时 10s）"
  },
  "frl_013": {
    "id": "frl_013",
    "ruleId": "FRL_013",
    "canonicalId": "RCP_081",
    "name": "采集煤炭",
    "category": "资源采掘",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_004",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "煤炭"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_004",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "[资源采掘] 采矿机 机制运转：采集煤炭（耗时 10s）"
  },
  "frl_014": {
    "id": "frl_014",
    "ruleId": "FRL_014",
    "canonicalId": "RCP_082",
    "name": "煤炭发电",
    "category": "燃能发电",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 60,
    "power": -100,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_004",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "煤炭"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_004",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 燃料发电机 机制运转：煤炭发电（耗时 60s）"
  },
  "frl_015": {
    "id": "frl_015",
    "ruleId": "FRL_015",
    "canonicalId": "RCP_083",
    "name": "灵力引擎燃煤供热（150W/50热）",
    "category": "燃能发电",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 60,
    "power": -150,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_004",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "煤炭"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_004",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 灵力引擎（下） 机制运转：灵力引擎燃煤供热（150W/50热）（耗时 60s）"
  },
  "frl_016": {
    "id": "frl_016",
    "ruleId": "FRL_016",
    "canonicalId": "RCP_084",
    "name": "解构练气尸体",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_020",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "练气修士尸体"
    },
    "output": {
      "item": "mat_018",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "血肉"
    },
    "inputs": [
      {
        "item": "MAT_020",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_018",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_021",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_022",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：解构练气尸体（耗时 30s）"
  },
  "frl_017": {
    "id": "frl_017",
    "ruleId": "FRL_017",
    "canonicalId": "RCP_085",
    "name": "解构筑基尸体",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "筑基修士尸体"
    },
    "output": {
      "item": "mat_018",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "血肉"
    },
    "inputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_018",
        "count": 4,
        "rate": 8.0
      },
      {
        "item": "MAT_022",
        "count": 3,
        "rate": 6.0
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：解构筑基尸体（耗时 30s）"
  },
  "frl_018": {
    "id": "frl_018",
    "ruleId": "FRL_018",
    "canonicalId": "RCP_086",
    "name": "解构金丹尸体",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 60,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_056",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹修士尸体"
    },
    "output": {
      "item": "mat_018",
      "amount": 6,
      "ratePerMin": 6.0,
      "name": "血肉"
    },
    "inputs": [
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_018",
        "count": 6,
        "rate": 6.0
      },
      {
        "item": "MAT_022",
        "count": 4,
        "rate": 4.0
      },
      {
        "item": "mat_077",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：解构金丹尸体（耗时 60s）"
  },
  "frl_019": {
    "id": "frl_019",
    "ruleId": "FRL_019",
    "canonicalId": "RCP_087",
    "name": "脑髓解析数据",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 20,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_022",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "脑髓"
    },
    "output": {
      "item": "MAT_023",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "MAT_022",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：脑髓解析数据（耗时 20s）"
  },
  "frl_020": {
    "id": "frl_020",
    "ruleId": "FRL_020",
    "canonicalId": "RCP_091",
    "name": "防御猎杀练气修士",
    "category": "防线猎杀",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 30,
    "power": 15,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_074",
      "amount": 5,
      "ratePerMin": 10.0,
      "name": "玄铁剑丸"
    },
    "output": {
      "item": "MAT_020",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "练气修士尸体"
    },
    "inputs": [
      {
        "item": "mat_074",
        "count": 5,
        "rate": 10.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_020",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[防线猎杀] 飞剑防御塔 机制运转：防御猎杀练气修士（耗时 30s）"
  },
  "frl_021": {
    "id": "frl_021",
    "ruleId": "FRL_021",
    "canonicalId": "RCP_092",
    "name": "防御猎杀筑基修士",
    "category": "防线猎杀",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 30,
    "power": 15,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_075",
      "amount": 5,
      "ratePerMin": 10.0,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "筑基修士尸体"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 5,
        "rate": 10.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[防线猎杀] 飞剑防御塔 机制运转：防御猎杀筑基修士（耗时 30s）"
  },
  "frl_022": {
    "id": "frl_022",
    "ruleId": "FRL_022",
    "canonicalId": "RCP_093",
    "name": "防御猎杀金丹修士",
    "category": "防线猎杀",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 60,
    "power": 15,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_076",
      "amount": 5,
      "ratePerMin": 5.0,
      "name": "煞气剑丸"
    },
    "output": {
      "item": "MAT_056",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "金丹修士尸体"
    },
    "inputs": [
      {
        "item": "mat_076",
        "count": 5,
        "rate": 5.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[防线猎杀] 飞剑防御塔 机制运转：防御猎杀金丹修士（耗时 60s）"
  },
  "frl_023": {
    "id": "frl_023",
    "ruleId": "FRL_023",
    "canonicalId": "RCP_104",
    "name": "赤铜锭（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_002",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "赤铜矿"
    },
    "output": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "赤铜锭"
    },
    "inputs": [
      {
        "item": "MAT_002",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：赤铜锭（手搓）（耗时 30s）"
  },
  "frl_024": {
    "id": "frl_024",
    "ruleId": "FRL_024",
    "canonicalId": "RCP_105",
    "name": "铜线（手搓）",
    "category": "手搓过渡",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 20,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "赤铜锭"
    },
    "output": {
      "item": "MAT_019",
      "amount": 5,
      "ratePerMin": 15.0,
      "name": "铜线"
    },
    "inputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_019",
        "count": 5,
        "rate": 15.0
      }
    ],
    "desc": "[手搓过渡] 操作台 机制运转：铜线（手搓）（耗时 20s）"
  },
  "frl_025": {
    "id": "frl_025",
    "ruleId": "FRL_025",
    "canonicalId": "RCP_118",
    "name": "抽取原油",
    "category": "资源采掘",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 30,
    "power": 10,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "mat_093",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "原油"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "mat_093",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[资源采掘] 抽水机 机制运转：抽取原油（耗时 30s）"
  },
  "frl_026": {
    "id": "frl_026",
    "ruleId": "FRL_026",
    "canonicalId": "RCP_119",
    "name": "抽取灵泉",
    "category": "资源采掘",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 30,
    "power": 10,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "mat_106",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵泉"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "mat_106",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "[资源采掘] 抽水机 机制运转：抽取灵泉（耗时 30s）"
  },
  "frl_027": {
    "id": "frl_027",
    "ruleId": "FRL_027",
    "canonicalId": "RCP_120",
    "name": "采集石英砂",
    "category": "资源采掘",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "mat_098",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "石英砂"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "mat_098",
        "count": 1,
        "rate": 6.0
      }
    ],
    "desc": "[资源采掘] 采矿机 机制运转：采集石英砂（耗时 10s）"
  },
  "frl_028": {
    "id": "frl_028",
    "ruleId": "FRL_028",
    "canonicalId": "RCP_121",
    "name": "采集灵石矿",
    "category": "资源采掘",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 15,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "mat_102",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "灵石矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "mat_102",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "[资源采掘] 采矿机 机制运转：采集灵石矿（耗时 15s）"
  },
  "frl_029": {
    "id": "frl_029",
    "ruleId": "FRL_029",
    "canonicalId": "RCP_125",
    "name": "灵力引擎燃油供热（225W/75热）",
    "category": "燃能发电",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 60,
    "power": -150,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_094",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "燃油"
    },
    "output": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "滤渣"
    },
    "inputs": [
      {
        "item": "mat_094",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 灵力引擎（下） 机制运转：灵力引擎燃油供热（225W/75热）（耗时 60s）"
  },
  "frl_030": {
    "id": "frl_030",
    "ruleId": "FRL_030",
    "canonicalId": "RCP_126",
    "name": "灵力引擎核燃料超频（450W/150热）",
    "category": "燃能发电",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 60,
    "power": -150,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_109",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "燃料棒"
    },
    "output": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "滤渣"
    },
    "inputs": [
      {
        "item": "mat_109",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "[燃能发电] 灵力引擎（下） 机制运转：灵力引擎核燃料超频（450W/150热）（耗时 60s）"
  },
  "frl_031": {
    "id": "frl_031",
    "ruleId": "FRL_031",
    "canonicalId": "RCP_182",
    "name": "二阶科研：灵根支架逆向解析",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_056",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵根支架"
    },
    "output": {
      "item": "MAT_023",
      "amount": 10,
      "ratePerMin": 20.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_056",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 10,
        "rate": 20.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：二阶科研：灵根支架逆向解析（耗时 30s）"
  },
  "frl_032": {
    "id": "frl_032",
    "ruleId": "FRL_032",
    "canonicalId": "RCP_183",
    "name": "三阶科研：破障丹逆向解析",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "破障丹"
    },
    "output": {
      "item": "MAT_023",
      "amount": 12,
      "ratePerMin": 24.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 12,
        "rate": 24.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：三阶科研：破障丹逆向解析（耗时 30s）"
  },
  "frl_033": {
    "id": "frl_033",
    "ruleId": "FRL_033",
    "canonicalId": "RCP_184",
    "name": "终局科研：法宝逆向解析",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "法宝"
    },
    "output": {
      "item": "MAT_023",
      "amount": 25,
      "ratePerMin": 50.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 25,
        "rate": 50.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：终局科研：法宝逆向解析（耗时 30s）"
  },
  "frl_034": {
    "id": "frl_034",
    "ruleId": "FRL_034",
    "canonicalId": "RCP_208",
    "name": "解构兽甲",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 20,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_114",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "兽甲"
    },
    "output": {
      "item": "mat_021",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "骸骨"
    },
    "inputs": [
      {
        "item": "mat_114",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_021",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "mat_038",
        "count": 1,
        "rate": 3.0
      },
      {
        "item": "mat_018",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：解构兽甲（耗时 20s）"
  },
  "frl_035": {
    "id": "frl_035",
    "ruleId": "FRL_035",
    "canonicalId": "RCP_235",
    "name": "灵舟拆解回收",
    "category": "尸解逆向",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 20,
    "power": 55,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_127",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "灵舟"
    },
    "output": {
      "item": "MAT_051",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "mat_127",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "mat_066",
        "count": 1,
        "rate": 3.0
      },
      {
        "item": "MAT_023",
        "count": 8,
        "rate": 24.0
      }
    ],
    "desc": "[尸解逆向] 解构机 机制运转：灵舟拆解回收（耗时 20s）"
  },
  "frl_036": {
    "id": "frl_036",
    "ruleId": "FRL_036",
    "canonicalId": "RCP_255",
    "name": "破界穿云升空（玄黄道光齐鸣）",
    "category": "物流蓄电与巨构",
    "building": "ascension_silo",
    "buildingId": "ascension_silo",
    "timeSec": 60,
    "power": 2500,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_143",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "破界穿云舰"
    },
    "output": {
      "item": "mat_138",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "大道玄黄珠"
    },
    "inputs": [
      {
        "item": "mat_143",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_137",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_109",
        "count": 2,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_138",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "mat_144",
        "count": 2,
        "rate": 2.0
      }
    ],
    "desc": "[物流蓄电与巨构] 破界发射井 机制运转：破界穿云升空（玄黄道光齐鸣）（耗时 60s）"
  },
  "frl_037": {
    "id": "frl_037",
    "ruleId": "FRL_037",
    "canonicalId": "RCP_256",
    "name": "科研推演·凡阶玉简",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 10,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_133",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "凡阶玉简"
    },
    "output": {
      "item": "MAT_023",
      "amount": 5,
      "ratePerMin": 30.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_133",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 5,
        "rate": 30.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·凡阶玉简（耗时 10s）"
  },
  "frl_038": {
    "id": "frl_038",
    "ruleId": "FRL_038",
    "canonicalId": "RCP_257",
    "name": "科研推演·筑基灵简",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 15,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_134",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "筑基灵简"
    },
    "output": {
      "item": "MAT_023",
      "amount": 15,
      "ratePerMin": 60.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_134",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 15,
        "rate": 60.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·筑基灵简（耗时 15s）"
  },
  "frl_039": {
    "id": "frl_039",
    "ruleId": "FRL_039",
    "canonicalId": "RCP_258",
    "name": "科研推演·金丹道匣",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 20,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_135",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "金丹道匣"
    },
    "output": {
      "item": "MAT_023",
      "amount": 45,
      "ratePerMin": 135.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_135",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 45,
        "rate": 135.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·金丹道匣（耗时 20s）"
  },
  "frl_040": {
    "id": "frl_040",
    "ruleId": "FRL_040",
    "canonicalId": "RCP_259",
    "name": "科研推演·元婴法印",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 30,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_136",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "元婴法印"
    },
    "output": {
      "item": "MAT_023",
      "amount": 120,
      "ratePerMin": 240.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_136",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 120,
        "rate": 240.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·元婴法印（耗时 30s）"
  },
  "frl_041": {
    "id": "frl_041",
    "ruleId": "FRL_041",
    "canonicalId": "RCP_260",
    "name": "科研推演·化神天机盘",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 30,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_137",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "化神天机盘"
    },
    "output": {
      "item": "MAT_023",
      "amount": 300,
      "ratePerMin": 600.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_137",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 300,
        "rate": 600.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·化神天机盘（耗时 30s）"
  },
  "frl_042": {
    "id": "frl_042",
    "ruleId": "FRL_042",
    "canonicalId": "RCP_261",
    "name": "科研推演·大道玄黄珠",
    "category": "天机科研",
    "building": "research_altar",
    "buildingId": "research_altar",
    "timeSec": 60,
    "power": 25,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_138",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "大道玄黄珠"
    },
    "output": {
      "item": "MAT_023",
      "amount": 1000,
      "ratePerMin": 1000.0,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_138",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 1000,
        "rate": 1000.0
      }
    ],
    "desc": "[天机科研] 天机推演台 机制运转：科研推演·大道玄黄珠（耗时 60s）"
  },
  "frl_043": {
    "id": "frl_043",
    "ruleId": "FRL_043",
    "canonicalId": "RCP_262",
    "name": "聚灵矿阵·300%三矿联采",
    "category": "资源采掘",
    "building": "heavy_miner",
    "buildingId": "heavy_miner",
    "timeSec": 10,
    "power": 60,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_001",
      "amount": 6,
      "ratePerMin": 36.0,
      "name": "玄铁矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_001",
        "count": 6,
        "rate": 36.0
      },
      {
        "item": "MAT_002",
        "count": 4,
        "rate": 24.0
      },
      {
        "item": "mat_102",
        "count": 2,
        "rate": 12.0
      }
    ],
    "desc": "[资源采掘] 大型聚灵矿阵 机制运转：聚灵矿阵·300%三矿联采（耗时 10s）"
  },
  "frl_044": {
    "id": "frl_044",
    "ruleId": "FRL_044",
    "canonicalId": "RCP_268",
    "name": "九霄雷暴防线轰杀天魔",
    "category": "防线猎杀",
    "building": "thunder_turret",
    "buildingId": "thunder_turret",
    "timeSec": 20,
    "power": 90,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_139",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "诛仙雷丸"
    },
    "output": {
      "item": "mat_140",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "天魔道骨"
    },
    "inputs": [
      {
        "item": "mat_139",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_046",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_140",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "[防线猎杀] 九霄雷暴塔 机制运转：九霄雷暴防线轰杀天魔（耗时 20s）"
  },
  "frl_045": {
    "id": "frl_045",
    "ruleId": "FRL_045",
    "canonicalId": "RCP_269",
    "name": "傀儡战备基站自动收尸拆解",
    "category": "防线猎杀",
    "building": "battle_base",
    "buildingId": "battle_base",
    "timeSec": 15,
    "power": 50,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "MAT_056",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "金丹修士尸体"
    },
    "output": {
      "item": "mat_140",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "天魔道骨"
    },
    "inputs": [
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_076",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_139",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_140",
        "count": 2,
        "rate": 8.0
      },
      {
        "item": "mat_077",
        "count": 2,
        "rate": 8.0
      },
      {
        "item": "MAT_023",
        "count": 25,
        "rate": 100.0
      }
    ],
    "desc": "[防线猎杀] 傀儡战备基站 机制运转：傀儡战备基站自动收尸拆解（耗时 15s）"
  },
  "frl_046": {
    "id": "frl_046",
    "ruleId": "FRL_046",
    "canonicalId": "RCP_274",
    "name": "周天星辰幡轨道弹射成阵",
    "category": "物流蓄电与巨构",
    "building": "banner_ejector",
    "buildingId": "banner_ejector",
    "timeSec": 30,
    "power": 300,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_142",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "周天星辰幡"
    },
    "output": {
      "item": "mat_143",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "破界穿云舰"
    },
    "inputs": [
      {
        "item": "mat_142",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_145",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_143",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "mat_144",
        "count": 1,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 30,
        "rate": 60.0
      }
    ],
    "desc": "[物流蓄电与巨构] 阵旗弹射器 机制运转：周天星辰幡轨道弹射成阵（耗时 30s）"
  },
  "frl_047": {
    "id": "frl_047",
    "ruleId": "FRL_047",
    "canonicalId": "RCP_275",
    "name": "仙光接引与天劫引雷聚能",
    "category": "物流蓄电与巨构",
    "building": "immortal_receiver",
    "buildingId": "immortal_receiver",
    "timeSec": 30,
    "power": -5000,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_142",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "周天星辰幡"
    },
    "output": {
      "item": "mat_144",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "仙界道光"
    },
    "inputs": [
      {
        "item": "mat_142",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_143",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_137",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 4.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_144",
        "count": 3,
        "rate": 6.0
      },
      {
        "item": "MAT_023",
        "count": 80,
        "rate": 160.0
      }
    ],
    "desc": "[物流蓄电与巨构] 仙光接引台 机制运转：仙光接引与天劫引雷聚能（耗时 30s）"
  },
  "frl_048": {
    "id": "frl_048",
    "ruleId": "FRL_048",
    "canonicalId": "RCP_278",
    "name": "御剑流光抛射投送",
    "category": "物流蓄电与巨构",
    "building": "sword_catapult",
    "buildingId": "sword_catapult",
    "timeSec": 10,
    "power": 20,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_146",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "灵木纸鹤"
    },
    "output": {
      "item": "mat_128",
      "amount": 2,
      "ratePerMin": 12.0,
      "name": "乾坤货匣"
    },
    "inputs": [
      {
        "item": "mat_146",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_128",
        "count": 2,
        "rate": 12.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_128",
        "count": 2,
        "rate": 12.0
      },
      {
        "item": "MAT_023",
        "count": 8,
        "rate": 48.0
      }
    ],
    "desc": "[物流蓄电与巨构] 御剑抛射台 机制运转：御剑流光抛射投送（耗时 10s）"
  },
  "frl_049": {
    "id": "frl_049",
    "ruleId": "FRL_049",
    "canonicalId": "RCP_279",
    "name": "接引莲台缓冲催化",
    "category": "物流蓄电与巨构",
    "building": "lotus_catcher",
    "buildingId": "lotus_catcher",
    "timeSec": 10,
    "power": 5,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_146",
      "amount": 1,
      "ratePerMin": 6.0,
      "name": "灵木纸鹤"
    },
    "output": {
      "item": "mat_129",
      "amount": 3,
      "ratePerMin": 18.0,
      "name": "一阶凝灵散"
    },
    "inputs": [
      {
        "item": "mat_146",
        "count": 1,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_129",
        "count": 2,
        "rate": 12.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_129",
        "count": 3,
        "rate": 18.0
      }
    ],
    "desc": "[物流蓄电与巨构] 接引莲台 机制运转：接引莲台缓冲催化（耗时 10s）"
  },
  "frl_050": {
    "id": "frl_050",
    "ruleId": "FRL_050",
    "canonicalId": "RCP_282",
    "name": "雷池主网核能快充",
    "category": "物流蓄电与巨构",
    "building": "thunder_accumulator",
    "buildingId": "thunder_accumulator",
    "timeSec": 15,
    "power": -1200,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_147",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "空置蓄灵匣"
    },
    "output": {
      "item": "mat_148",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "满载蓄灵匣"
    },
    "inputs": [
      {
        "item": "mat_147",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_109",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_148",
        "count": 2,
        "rate": 8.0
      }
    ],
    "desc": "[物流蓄电与巨构] 雷池蓄电枢 机制运转：雷池主网核能快充（耗时 15s）"
  },
  "frl_051": {
    "id": "frl_051",
    "ruleId": "FRL_051",
    "canonicalId": "RCP_283",
    "name": "仙光接引台天劫引雷快充",
    "category": "物流蓄电与巨构",
    "building": "immortal_receiver",
    "buildingId": "immortal_receiver",
    "timeSec": 15,
    "power": -5000,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_147",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "空置蓄灵匣"
    },
    "output": {
      "item": "mat_148",
      "amount": 2,
      "ratePerMin": 8.0,
      "name": "满载蓄灵匣"
    },
    "inputs": [
      {
        "item": "mat_147",
        "count": 2,
        "rate": 8.0,
        "form": "实体"
      },
      {
        "item": "mat_139",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_148",
        "count": 2,
        "rate": 8.0
      },
      {
        "item": "mat_144",
        "count": 1,
        "rate": 4.0
      }
    ],
    "desc": "[物流蓄电与巨构] 仙光接引台 机制运转：仙光接引台天劫引雷快充（耗时 15s）"
  },
  "frl_052": {
    "id": "frl_052",
    "ruleId": "FRL_052",
    "canonicalId": "RCP_284",
    "name": "雷池跨区并网放电（100%退空匣）",
    "category": "物流蓄电与巨构",
    "building": "thunder_accumulator",
    "buildingId": "thunder_accumulator",
    "timeSec": 20,
    "power": -1200,
    "recipeTier": "mechanism",
    "recipeTierLabel": "⚡ 设施机制",
    "input": {
      "item": "mat_148",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "满载蓄灵匣"
    },
    "output": {
      "item": "mat_147",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "空置蓄灵匣"
    },
    "inputs": [
      {
        "item": "mat_148",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_147",
        "count": 2,
        "rate": 6.0
      },
      {
        "item": "MAT_023",
        "count": 12,
        "rate": 36.0
      }
    ],
    "desc": "[物流蓄电与巨构] 雷池蓄电枢 机制运转：雷池跨区并网放电（100%退空匣）（耗时 20s）"
  }
};

const XIUXIAN_RELIC_SCROLLS = {
  "SCR_001": {
    "scrollId": "SCR_001",
    "recipeCanonicalId": "RCP_017",
    "name": "培养液（回用水+蛋白液）",
    "buildingId": "BD_143",
    "buildingName": "搅拌机",
    "primaryOutMatId": "MAT_024",
    "primaryOutName": "培养液",
    "stage": "I · 练气期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_01",
    "strategicValue": "POOL_01 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_002": {
    "scrollId": "SCR_002",
    "recipeCanonicalId": "RCP_022",
    "name": "灵草灰肥催熟",
    "buildingId": "BD_141",
    "buildingName": "培养皿",
    "primaryOutMatId": "MAT_026",
    "primaryOutName": "成熟灵草",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_02",
    "strategicValue": "POOL_02 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_003": {
    "scrollId": "SCR_003",
    "recipeCanonicalId": "RCP_024",
    "name": "高效肉块培养",
    "buildingId": "BD_142",
    "buildingName": "培养仓",
    "primaryOutMatId": "MAT_032",
    "primaryOutName": "血胎",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_03",
    "strategicValue": "POOL_03 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_004": {
    "scrollId": "SCR_004",
    "recipeCanonicalId": "RCP_026",
    "name": "蛋白液（回用水）",
    "buildingId": "BD_145",
    "buildingName": "提取器",
    "primaryOutMatId": "MAT_023",
    "primaryOutName": "蛋白液",
    "stage": "I · 练气期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_04",
    "strategicValue": "POOL_04 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_005": {
    "scrollId": "SCR_005",
    "recipeCanonicalId": "RCP_028",
    "name": "灵草液（回用水）",
    "buildingId": "BD_145",
    "buildingName": "提取器",
    "primaryOutMatId": "MAT_028",
    "primaryOutName": "灵草液",
    "stage": "I · 练气期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_05",
    "strategicValue": "POOL_05 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_006": {
    "scrollId": "SCR_006",
    "recipeCanonicalId": "RCP_067",
    "name": "煞气废液净化",
    "buildingId": "BD_150",
    "buildingName": "回收处理塔",
    "primaryOutMatId": "MAT_035",
    "primaryOutName": "净化水",
    "stage": "II · 筑基期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_06",
    "strategicValue": "POOL_06 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_007": {
    "scrollId": "SCR_007",
    "recipeCanonicalId": "RCP_069",
    "name": "药渣再生净化粉",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_034",
    "primaryOutName": "净化剂",
    "stage": "II · 筑基期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_07",
    "strategicValue": "POOL_07 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_008": {
    "scrollId": "SCR_008",
    "recipeCanonicalId": "RCP_070",
    "name": "液态煞气",
    "buildingId": "BD_150",
    "buildingName": "回收处理塔",
    "primaryOutMatId": "MAT_073",
    "primaryOutName": "液态煞气",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_08",
    "strategicValue": "POOL_08 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_009": {
    "scrollId": "SCR_009",
    "recipeCanonicalId": "RCP_101",
    "name": "法宝祭炼",
    "buildingId": "BD_156",
    "buildingName": "炼宝台",
    "primaryOutMatId": "MAT_083",
    "primaryOutName": "人造灵石",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_09",
    "strategicValue": "POOL_09 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_010": {
    "scrollId": "SCR_010",
    "recipeCanonicalId": "RCP_103",
    "name": "金丹点煞成石自循环",
    "buildingId": "BD_157",
    "buildingName": "渡劫台",
    "primaryOutMatId": "MAT_085",
    "primaryOutName": "人造金丹",
    "stage": "IV · 元婴期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10",
    "strategicValue": "POOL_10 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_011": {
    "scrollId": "SCR_011",
    "recipeCanonicalId": "RCP_111",
    "name": "灵磁齿轮（铜铁混粉）",
    "buildingId": "BD_138",
    "buildingName": "加工台",
    "primaryOutMatId": "MAT_009",
    "primaryOutName": "灵磁齿轮",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_11",
    "strategicValue": "POOL_11 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_012": {
    "scrollId": "SCR_012",
    "recipeCanonicalId": "RCP_128",
    "name": "玻璃助熔高产",
    "buildingId": "BD_136",
    "buildingName": "精炼炉",
    "primaryOutMatId": "MAT_099",
    "primaryOutName": "玻璃",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12",
    "strategicValue": "POOL_12 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_013": {
    "scrollId": "SCR_013",
    "recipeCanonicalId": "RCP_133",
    "name": "灵泉离心分离（灵石粉+重水）",
    "buildingId": "BD_144",
    "buildingName": "离心机",
    "primaryOutMatId": "MAT_103",
    "primaryOutName": "灵石粉",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_13",
    "strategicValue": "POOL_13 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_014": {
    "scrollId": "SCR_014",
    "recipeCanonicalId": "RCP_137",
    "name": "人造灵石（灵液浓缩法）",
    "buildingId": "BD_148",
    "buildingName": "冶炼舱（上）",
    "primaryOutMatId": "MAT_083",
    "primaryOutName": "人造灵石",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_14",
    "strategicValue": "POOL_14 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_015": {
    "scrollId": "SCR_015",
    "recipeCanonicalId": "RCP_138",
    "name": "稳定液（灵液高产法）",
    "buildingId": "BD_143",
    "buildingName": "搅拌机",
    "primaryOutMatId": "MAT_070",
    "primaryOutName": "稳定液",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_15",
    "strategicValue": "POOL_15 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_016": {
    "scrollId": "SCR_016",
    "recipeCanonicalId": "RCP_139",
    "name": "绝缘板（塑木复合高产）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_091",
    "primaryOutName": "绝缘板",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_16",
    "strategicValue": "POOL_16 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_017": {
    "scrollId": "SCR_017",
    "recipeCanonicalId": "RCP_140",
    "name": "电路板（硅片润滑高产）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_014",
    "primaryOutName": "电路板",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_17",
    "strategicValue": "POOL_17 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_018": {
    "scrollId": "SCR_018",
    "recipeCanonicalId": "RCP_142",
    "name": "生物芯片（硅片高产）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_015",
    "primaryOutName": "生物芯片",
    "stage": "II · 筑基期",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_18",
    "strategicValue": "POOL_18 | 纯工业光芯替代生物兽魂，实现无兽破境直连"
  },
  "SCR_019": {
    "scrollId": "SCR_019",
    "recipeCanonicalId": "RCP_143",
    "name": "中控芯片（硅片直焊）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_054",
    "primaryOutName": "中控芯片",
    "stage": "II · 筑基期",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_19",
    "strategicValue": "POOL_19 | 纯工业光芯替代生物兽魂，实现无兽破境直连"
  },
  "SCR_020": {
    "scrollId": "SCR_020",
    "recipeCanonicalId": "RCP_144",
    "name": "灵磁齿轮（灵石粉润滑高产）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_009",
    "primaryOutName": "灵磁齿轮",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_20",
    "strategicValue": "POOL_20 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_021": {
    "scrollId": "SCR_021",
    "recipeCanonicalId": "RCP_145",
    "name": "传动带（橡胶润滑高产）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_049",
    "primaryOutName": "传动带",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_21",
    "strategicValue": "POOL_21 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_022": {
    "scrollId": "SCR_022",
    "recipeCanonicalId": "RCP_146",
    "name": "阀门（橡胶密封高产）",
    "buildingId": "BD_138",
    "buildingName": "加工台",
    "primaryOutMatId": "MAT_012",
    "primaryOutName": "阀门",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_22",
    "strategicValue": "POOL_22 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_023": {
    "scrollId": "SCR_023",
    "recipeCanonicalId": "RCP_147",
    "name": "电缆（橡胶护套高产）",
    "buildingId": "BD_138",
    "buildingName": "加工台",
    "primaryOutMatId": "MAT_065",
    "primaryOutName": "电缆",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_01",
    "strategicValue": "POOL_01 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_024": {
    "scrollId": "SCR_024",
    "recipeCanonicalId": "RCP_148",
    "name": "高压电容（碳棒绝缘法）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_046",
    "primaryOutName": "高压电容",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_02",
    "strategicValue": "POOL_02 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_025": {
    "scrollId": "SCR_025",
    "recipeCanonicalId": "RCP_149",
    "name": "精炼玄铁锭（燃油碳棒高产）",
    "buildingId": "BD_148",
    "buildingName": "冶炼舱（上）",
    "primaryOutMatId": "MAT_047",
    "primaryOutName": "精炼玄铁锭",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_03",
    "strategicValue": "POOL_03 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_026": {
    "scrollId": "SCR_026",
    "recipeCanonicalId": "RCP_151",
    "name": "灵草灵泉催熟",
    "buildingId": "BD_141",
    "buildingName": "培养皿",
    "primaryOutMatId": "MAT_026",
    "primaryOutName": "成熟灵草",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_04",
    "strategicValue": "POOL_04 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_027": {
    "scrollId": "SCR_027",
    "recipeCanonicalId": "RCP_152",
    "name": "煞气灵草（种子辐射诱变）",
    "buildingId": "BD_141",
    "buildingName": "培养皿",
    "primaryOutMatId": "MAT_078",
    "primaryOutName": "煞气灵草",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_05",
    "strategicValue": "POOL_05 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_028": {
    "scrollId": "SCR_028",
    "recipeCanonicalId": "RCP_154",
    "name": "高温合金锭（炉芯重水模铸）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_039",
    "primaryOutName": "高温合金锭",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_06",
    "strategicValue": "POOL_06 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_029": {
    "scrollId": "SCR_029",
    "recipeCanonicalId": "RCP_155",
    "name": "爆裂剑丸（燃油弹链装填）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_075",
    "primaryOutName": "爆裂剑丸",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_07",
    "strategicValue": "POOL_07 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_030": {
    "scrollId": "SCR_030",
    "recipeCanonicalId": "RCP_156",
    "name": "动力核心（电池机壳封装）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_057",
    "primaryOutName": "动力核心",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_08",
    "strategicValue": "POOL_08 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_031": {
    "scrollId": "SCR_031",
    "recipeCanonicalId": "RCP_157",
    "name": "燃料棒（液冷泵阀高产）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_109",
    "primaryOutName": "燃料棒",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_09",
    "strategicValue": "POOL_09 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_032": {
    "scrollId": "SCR_032",
    "recipeCanonicalId": "RCP_158",
    "name": "生物滤芯（木架压制）",
    "buildingId": "BD_138",
    "buildingName": "加工台",
    "primaryOutMatId": "MAT_044",
    "primaryOutName": "生物滤芯",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10",
    "strategicValue": "POOL_10 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_033": {
    "scrollId": "SCR_033",
    "recipeCanonicalId": "RCP_165",
    "name": "煞水结晶回收",
    "buildingId": "BD_150",
    "buildingName": "回收处理塔",
    "primaryOutMatId": "MAT_035",
    "primaryOutName": "净化水",
    "stage": "II · 筑基期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_11",
    "strategicValue": "POOL_11 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_034": {
    "scrollId": "SCR_034",
    "recipeCanonicalId": "RCP_171",
    "name": "煞气剑丸（灵石粉装药）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_076",
    "primaryOutName": "煞气剑丸",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12",
    "strategicValue": "POOL_12 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_035": {
    "scrollId": "SCR_035",
    "recipeCanonicalId": "RCP_175",
    "name": "气血丹（练气整尸血炼）",
    "buildingId": "BD_163",
    "buildingName": "炼丹炉（上）",
    "primaryOutMatId": "MAT_080",
    "primaryOutName": "气血丹",
    "stage": "III · 金丹期",
    "obtainWay": "魔道遗府洞天 / 天魔首领掉落",
    "poolGroup": "POOL_13",
    "strategicValue": "POOL_13 | 以修士尸骸血炼替代灵植原料，邪修高产专线"
  },
  "SCR_036": {
    "scrollId": "SCR_036",
    "recipeCanonicalId": "RCP_176",
    "name": "破障丹（筑基整尸血炼）",
    "buildingId": "BD_163",
    "buildingName": "炼丹炉（上）",
    "primaryOutMatId": "MAT_081",
    "primaryOutName": "破障丹",
    "stage": "III · 金丹期",
    "obtainWay": "魔道遗府洞天 / 天魔首领掉落",
    "poolGroup": "POOL_14",
    "strategicValue": "POOL_14 | 以修士尸骸血炼替代灵植原料，邪修高产专线"
  },
  "SCR_037": {
    "scrollId": "SCR_037",
    "recipeCanonicalId": "RCP_177",
    "name": "凝丹液（金丹整尸直萃）",
    "buildingId": "BD_145",
    "buildingName": "提取器",
    "primaryOutMatId": "MAT_082",
    "primaryOutName": "凝丹液",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_15",
    "strategicValue": "POOL_15 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_038": {
    "scrollId": "SCR_038",
    "recipeCanonicalId": "RCP_178",
    "name": "气血丹（药瓶流水线）",
    "buildingId": "BD_163",
    "buildingName": "炼丹炉（上）",
    "primaryOutMatId": "MAT_080",
    "primaryOutName": "气血丹",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_16",
    "strategicValue": "POOL_16 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_039": {
    "scrollId": "SCR_039",
    "recipeCanonicalId": "RCP_179",
    "name": "破障丹（药瓶流水线）",
    "buildingId": "BD_163",
    "buildingName": "炼丹炉（上）",
    "primaryOutMatId": "MAT_081",
    "primaryOutName": "破障丹",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_17",
    "strategicValue": "POOL_17 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_040": {
    "scrollId": "SCR_040",
    "recipeCanonicalId": "RCP_185",
    "name": "法宝成品祭炼（动力核心）",
    "buildingId": "BD_156",
    "buildingName": "炼宝台",
    "primaryOutMatId": "MAT_110",
    "primaryOutName": "法宝",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_18",
    "strategicValue": "POOL_18 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_041": {
    "scrollId": "SCR_041",
    "recipeCanonicalId": "RCP_187",
    "name": "法宝胚（剑丸玻璃祭炼）",
    "buildingId": "BD_156",
    "buildingName": "炼宝台",
    "primaryOutMatId": "MAT_072",
    "primaryOutName": "法宝胚",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_19",
    "strategicValue": "POOL_19 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_042": {
    "scrollId": "SCR_042",
    "recipeCanonicalId": "RCP_188",
    "name": "碎丹聚宝",
    "buildingId": "BD_156",
    "buildingName": "炼宝台",
    "primaryOutMatId": "MAT_110",
    "primaryOutName": "法宝",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_20",
    "strategicValue": "POOL_20 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_043": {
    "scrollId": "SCR_043",
    "recipeCanonicalId": "RCP_191",
    "name": "煞气灵草提纯液态煞气",
    "buildingId": "BD_145",
    "buildingName": "提取器",
    "primaryOutMatId": "MAT_073",
    "primaryOutName": "液态煞气",
    "stage": "I · 练气期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_21",
    "strategicValue": "POOL_21 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_044": {
    "scrollId": "SCR_044",
    "recipeCanonicalId": "RCP_192",
    "name": "终局满配双倍渡劫凝丹",
    "buildingId": "BD_157",
    "buildingName": "渡劫台",
    "primaryOutMatId": "MAT_085",
    "primaryOutName": "人造金丹",
    "stage": "IV · 元婴期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_22",
    "strategicValue": "POOL_22 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_045": {
    "scrollId": "SCR_045",
    "recipeCanonicalId": "RCP_196",
    "name": "灵木辐射诱变速生",
    "buildingId": "BD_164",
    "buildingName": "灵木培育槽",
    "primaryOutMatId": "MAT_048",
    "primaryOutName": "原木",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_01",
    "strategicValue": "POOL_01 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_046": {
    "scrollId": "SCR_046",
    "recipeCanonicalId": "RCP_203",
    "name": "兽粮（血肉高能）",
    "buildingId": "BD_143",
    "buildingName": "搅拌机",
    "primaryOutMatId": "MAT_113",
    "primaryOutName": "兽粮",
    "stage": "I · 练气期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_02",
    "strategicValue": "POOL_02 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_047": {
    "scrollId": "SCR_047",
    "recipeCanonicalId": "RCP_205",
    "name": "灵兽辐射诱变（耗卵高产）",
    "buildingId": "BD_168",
    "buildingName": "灵兽舱",
    "primaryOutMatId": "MAT_114",
    "primaryOutName": "兽甲",
    "stage": "II · 筑基期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_03",
    "strategicValue": "POOL_03 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_048": {
    "scrollId": "SCR_048",
    "recipeCanonicalId": "RCP_209",
    "name": "复合滤芯（兽甲压制）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_055",
    "primaryOutName": "复合滤芯",
    "stage": "II · 筑基期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_04",
    "strategicValue": "POOL_04 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_049": {
    "scrollId": "SCR_049",
    "recipeCanonicalId": "RCP_210",
    "name": "兽髓离心提纯精元液",
    "buildingId": "BD_144",
    "buildingName": "离心机",
    "primaryOutMatId": "MAT_022",
    "primaryOutName": "精元液",
    "stage": "II · 筑基期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_05",
    "strategicValue": "POOL_05 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_050": {
    "scrollId": "SCR_050",
    "recipeCanonicalId": "RCP_211",
    "name": "金丹胚（妖丹替代凝育）",
    "buildingId": "BD_142",
    "buildingName": "培养仓",
    "primaryOutMatId": "MAT_084",
    "primaryOutName": "金丹胚",
    "stage": "II · 筑基期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_06",
    "strategicValue": "POOL_06 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_051": {
    "scrollId": "SCR_051",
    "recipeCanonicalId": "RCP_213",
    "name": "养魂丹（药瓶流水线）",
    "buildingId": "BD_163",
    "buildingName": "炼丹炉（上）",
    "primaryOutMatId": "MAT_118",
    "primaryOutName": "养魂丹",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_07",
    "strategicValue": "POOL_07 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_052": {
    "scrollId": "SCR_052",
    "recipeCanonicalId": "RCP_215",
    "name": "元婴胚打印（神识芯片线）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_119",
    "primaryOutName": "元婴胚",
    "stage": "II · 筑基期",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_08",
    "strategicValue": "POOL_08 | 纯工业光芯替代生物兽魂，实现无兽破境直连"
  },
  "SCR_053": {
    "scrollId": "SCR_053",
    "recipeCanonicalId": "RCP_218",
    "name": "化神胚打印（净化核心线）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_121",
    "primaryOutName": "化神胚",
    "stage": "II · 筑基期",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_09",
    "strategicValue": "POOL_09 | 纯工业光芯替代生物兽魂，实现无兽破境直连"
  },
  "SCR_054": {
    "scrollId": "SCR_054",
    "recipeCanonicalId": "RCP_221",
    "name": "大千道果反哺自循环",
    "buildingId": "BD_157",
    "buildingName": "渡劫台",
    "primaryOutMatId": "MAT_123",
    "primaryOutName": "飞升道果",
    "stage": "IV · 元婴期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_10",
    "strategicValue": "POOL_10 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_055": {
    "scrollId": "SCR_055",
    "recipeCanonicalId": "RCP_224",
    "name": "神识光芯（滤芯高产）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_125",
    "primaryOutName": "神识光芯",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_11",
    "strategicValue": "POOL_11 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_056": {
    "scrollId": "SCR_056",
    "recipeCanonicalId": "RCP_226",
    "name": "极核金丹共鸣裂变",
    "buildingId": "BD_156",
    "buildingName": "炼宝台",
    "primaryOutMatId": "MAT_126",
    "primaryOutName": "阵盘极核",
    "stage": "III · 金丹期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_12",
    "strategicValue": "POOL_12 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_057": {
    "scrollId": "SCR_057",
    "recipeCanonicalId": "RCP_231",
    "name": "乾坤货匣（玄铁重载打印）",
    "buildingId": "BD_167",
    "buildingName": "打印机",
    "primaryOutMatId": "MAT_128",
    "primaryOutName": "乾坤货匣",
    "stage": "II · 筑基期",
    "obtainWay": "上古算器遗迹 / 天机阁残卷",
    "poolGroup": "POOL_13",
    "strategicValue": "POOL_13 | 纯工业光芯替代生物兽魂，实现无兽破境直连"
  },
  "SCR_058": {
    "scrollId": "SCR_058",
    "recipeCanonicalId": "RCP_233",
    "name": "灵舟批量总装（货匣联装型）",
    "buildingId": "BD_146",
    "buildingName": "组装机",
    "primaryOutMatId": "MAT_127",
    "primaryOutName": "灵舟",
    "stage": "II · 筑基期",
    "obtainWay": "野外古修遗迹宝箱 / 秘境残碑三选一",
    "poolGroup": "POOL_14",
    "strategicValue": "POOL_14 | 以辅料替换卡脖子原料或提升单机产出速率"
  },
  "SCR_059": {
    "scrollId": "SCR_059",
    "recipeCanonicalId": "RCP_241",
    "name": "归墟化煞（血水+凝灵散炼晶）",
    "buildingId": "BD_178",
    "buildingName": "归墟化煞炉",
    "primaryOutMatId": "MAT_132",
    "primaryOutName": "归墟晶尘",
    "stage": "III · 金丹期",
    "obtainWay": "古修环保秘窟 / 化煞炉残碑",
    "poolGroup": "POOL_15",
    "strategicValue": "POOL_15 | 废料闭环与水循环再造，彻底解除副产堵线"
  },
  "SCR_060": {
    "scrollId": "SCR_060",
    "recipeCanonicalId": "RCP_263",
    "name": "九霄高空采气（海拔增产灵液重水）",
    "buildingId": "BD_184",
    "buildingName": "九霄采气塔",
    "primaryOutMatId": "MAT_107",
    "primaryOutName": "灵液",
    "stage": "III · 金丹期",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_16",
    "strategicValue": "POOL_16 | 高阶世代重工倍速与粒子赋灵奇遇秘方"
  },
  "SCR_061": {
    "scrollId": "SCR_061",
    "recipeCanonicalId": "RCP_264",
    "name": "真火倍速精炼玄铁与高温合金",
    "buildingId": "BD_185",
    "buildingName": "真火精炼炉",
    "primaryOutMatId": "MAT_047",
    "primaryOutName": "精炼玄铁锭",
    "stage": "III · 金丹期",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_17",
    "strategicValue": "POOL_17 | 高阶世代重工倍速与粒子赋灵奇遇秘方"
  },
  "SCR_062": {
    "scrollId": "SCR_062",
    "recipeCanonicalId": "RCP_265",
    "name": "天魔负熵四倍熔炼",
    "buildingId": "BD_188",
    "buildingName": "天魔负熵炉",
    "primaryOutMatId": "MAT_039",
    "primaryOutName": "高温合金锭",
    "stage": "V · 化神期",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_18",
    "strategicValue": "POOL_18 | 高阶世代重工倍速与粒子赋灵奇遇秘方"
  },
  "SCR_063": {
    "scrollId": "SCR_063",
    "recipeCanonicalId": "RCP_267",
    "name": "诛仙雷丸与兽魂器灵联装",
    "buildingId": "BD_186",
    "buildingName": "万象总装机",
    "primaryOutMatId": "MAT_139",
    "primaryOutName": "诛仙雷丸",
    "stage": "IV · 元婴期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_19",
    "strategicValue": "POOL_19 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_064": {
    "scrollId": "SCR_064",
    "recipeCanonicalId": "RCP_271",
    "name": "重水对撞赋灵（晶核+器灵枢机核）",
    "buildingId": "BD_194",
    "buildingName": "阴阳对撞仪",
    "primaryOutMatId": "MAT_141",
    "primaryOutName": "反煞晶核",
    "stage": "V · 化神期",
    "obtainWay": "万兽山脉古坛 / 宗门秘宝阁",
    "poolGroup": "POOL_20",
    "strategicValue": "POOL_20 | 生物育兽与器灵共鸣高产替方"
  },
  "SCR_065": {
    "scrollId": "SCR_065",
    "recipeCanonicalId": "RCP_285",
    "name": "满载蓄灵匣直驱对撞反煞（退空匣）",
    "buildingId": "BD_194",
    "buildingName": "阴阳对撞仪",
    "primaryOutMatId": "MAT_141",
    "primaryOutName": "反煞晶核",
    "stage": "V · 化神期",
    "obtainWay": "元婴化神星宫遗墟 / 高阶天魔宝箱",
    "poolGroup": "POOL_21",
    "strategicValue": "POOL_21 | 高阶世代重工倍速与粒子赋灵奇遇秘方"
  }
};

const XIUXIAN_UE5_BUILDING_MERGES = {
  "BD_102": {
    "origId": "BD_102",
    "origName": "建筑底座｜1×1×1m",
    "category": "结构",
    "ue5MasterId": "BD_102",
    "ue5MasterName": "建筑底座｜1×1×1m",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_103": {
    "origId": "BD_103",
    "origName": "建筑底座柱｜1×1×4m",
    "category": "结构",
    "ue5MasterId": "BD_103",
    "ue5MasterName": "建筑底座柱｜1×1×4m",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_104": {
    "origId": "BD_104",
    "origName": "建筑底座｜2×2×1m",
    "category": "结构",
    "ue5MasterId": "BD_102",
    "ue5MasterName": "建筑底座｜1×1×1m",
    "mergeMode": "尺寸拉伸与Zoop平铺变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用建筑底座主资产，建造时滚轮或拉伸切换 1×1/2×2/3×3"
  },
  "BD_105": {
    "origId": "BD_105",
    "origName": "建筑底座｜3×3×1m",
    "category": "结构",
    "ue5MasterId": "BD_102",
    "ue5MasterName": "建筑底座｜1×1×1m",
    "mergeMode": "尺寸拉伸与Zoop平铺变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用建筑底座主资产，建造时滚轮或拉伸切换 1×1/2×2/3×3"
  },
  "BD_106": {
    "origId": "BD_106",
    "origName": "建筑底座梁｜1×4×1m",
    "category": "结构",
    "ue5MasterId": "BD_102",
    "ue5MasterName": "建筑底座｜1×1×1m",
    "mergeMode": "结构派生悬挑梁模式",
    "isStandaloneSlot": false,
    "ue5Note": "底座主资产边缘延伸触发连桥梁模式"
  },
  "BD_107": {
    "origId": "BD_107",
    "origName": "建筑底座顶板｜2×2×0m",
    "category": "结构",
    "ue5MasterId": "BD_102",
    "ue5MasterName": "建筑底座｜1×1×1m",
    "mergeMode": "结构顶板覆盖模式",
    "isStandaloneSlot": false,
    "ue5Note": "底座主资产贴顶自动切换为 0m 厚顶板"
  },
  "BD_108": {
    "origId": "BD_108",
    "origName": "楼梯｜1×3×2m",
    "category": "结构",
    "ue5MasterId": "BD_108",
    "ue5MasterName": "楼梯｜1×3×2m",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_109": {
    "origId": "BD_109",
    "origName": "楼梯｜2×6×4m",
    "category": "结构",
    "ue5MasterId": "BD_108",
    "ue5MasterName": "楼梯｜1×3×2m",
    "mergeMode": "尺寸加宽阶梯变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用楼梯主资产，放置时滚轮切换 1×3/2×6 跨度"
  },
  "BD_112": {
    "origId": "BD_112",
    "origName": "支撑柱｜1×1×5m",
    "category": "结构",
    "ue5MasterId": "BD_103",
    "ue5MasterName": "建筑底座柱｜1×1×4m",
    "mergeMode": "立柱高度自适应伸缩",
    "isStandaloneSlot": false,
    "ue5Note": "沿用建筑底座柱主资产，按起止高差自动拉伸至 4m/5m"
  },
  "BD_113": {
    "origId": "BD_113",
    "origName": "储藏盒｜1×1×1m",
    "category": "仓储",
    "ue5MasterId": "BD_113",
    "ue5MasterName": "储藏盒｜1×1×1m",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_114": {
    "origId": "BD_114",
    "origName": "储藏盒｜2×1×1m（窄柜）",
    "category": "仓储",
    "ue5MasterId": "BD_113",
    "ue5MasterName": "储藏盒｜1×1×1m",
    "mergeMode": "容器尺寸滚轮变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用储藏盒家族资产，滚轮切换 1×1 / 2×1 窄柜 / 1×2 宽柜"
  },
  "BD_115": {
    "origId": "BD_115",
    "origName": "储藏盒｜1×2×1m（宽柜）",
    "category": "仓储",
    "ue5MasterId": "BD_113",
    "ue5MasterName": "储藏盒｜1×1×1m",
    "mergeMode": "容器尺寸滚轮变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用储藏盒家族资产，滚轮切换 1×1 / 2×1 窄柜 / 1×2 宽柜"
  },
  "BD_116": {
    "origId": "BD_116",
    "origName": "传送带｜直线",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_117": {
    "origId": "BD_117",
    "origName": "传送带｜顺时针弯轨",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "Spline样条自动转弯",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 USplineMeshComponent 按起终点切线自动生成顺时针弯轨"
  },
  "BD_118": {
    "origId": "BD_118",
    "origName": "传送带｜逆时针弯轨",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "Spline样条自动转弯",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 USplineMeshComponent 按起终点切线自动生成逆时针弯轨"
  },
  "BD_119": {
    "origId": "BD_119",
    "origName": "传送带｜上坡",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "Spline样条自动爬坡",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 样条随地形/二楼高差自动生成上坡导轨"
  },
  "BD_120": {
    "origId": "BD_120",
    "origName": "传送带｜下坡",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "Spline样条自动下坡",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 样条随高差自动生成下坡导轨"
  },
  "BD_121": {
    "origId": "BD_121",
    "origName": "垂直传送带",
    "category": "垂直传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "垂直电梯样条分支",
    "isStandaloneSlot": false,
    "ue5Note": "拖动落点与起点重合且有高差时自动切换为垂直提升带"
  },
  "BD_122": {
    "origId": "BD_122",
    "origName": "交叉器",
    "category": "传送带",
    "ue5MasterId": "BD_116",
    "ue5MasterName": "传送带｜直线",
    "mergeMode": "传送带正交跨越桥架",
    "isStandaloneSlot": false,
    "ue5Note": "两条传送带交叉穿越时自动升起桥拱实现立交跨越"
  },
  "BD_123": {
    "origId": "BD_123",
    "origName": "合流器",
    "category": "传送带",
    "ue5MasterId": "BD_123",
    "ue5MasterName": "合流器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_124": {
    "origId": "BD_124",
    "origName": "分流器",
    "category": "传送带",
    "ue5MasterId": "BD_124",
    "ue5MasterName": "分流器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_125": {
    "origId": "BD_125",
    "origName": "智能合流器",
    "category": "传送带",
    "ue5MasterId": "BD_123",
    "ue5MasterName": "合流器",
    "mergeMode": "合流器开启过滤优先级",
    "isStandaloneSlot": false,
    "ue5Note": "沿用合流器底座并动态启用端口优先级属性组件"
  },
  "BD_126": {
    "origId": "BD_126",
    "origName": "智能分流器",
    "category": "传送带",
    "ue5MasterId": "BD_124",
    "ue5MasterName": "分流器",
    "mergeMode": "分流器开启物品过滤规则",
    "isStandaloneSlot": false,
    "ue5Note": "沿用分流器底座并动态启用过滤筛分组件"
  },
  "BD_127": {
    "origId": "BD_127",
    "origName": "限速器",
    "category": "带处理器",
    "ue5MasterId": "BD_124",
    "ue5MasterName": "分流器",
    "mergeMode": "带内限速阀组件合并",
    "isStandaloneSlot": false,
    "ue5Note": "挂接限速调节逻辑至分流器/带接口滑块，无需独立建模"
  },
  "BD_128": {
    "origId": "BD_128",
    "origName": "水管｜直管",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_129": {
    "origId": "BD_129",
    "origName": "水管｜立面弯管",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "水管Spline立面弯头",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 管道样条系统按三维折角自动生成立面弯管"
  },
  "BD_130": {
    "origId": "BD_130",
    "origName": "水管｜平面弯管",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "水管Spline平面弯头",
    "isStandaloneSlot": false,
    "ue5Note": "UE5 管道样条系统按平面折角自动生成水平弯管"
  },
  "BD_131": {
    "origId": "BD_131",
    "origName": "水管｜侧向接口",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "管网接口自动法兰生成",
    "isStandaloneSlot": false,
    "ue5Note": "管道吸附至机器侧向液体口时自动装配法兰组件"
  },
  "BD_132": {
    "origId": "BD_132",
    "origName": "水管｜顶部接口",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "管网顶部插接自动法兰",
    "isStandaloneSlot": false,
    "ue5Note": "管道吸附至机器顶部液体口时自动装配垂直接口"
  },
  "BD_133": {
    "origId": "BD_133",
    "origName": "水管｜三通",
    "category": "管道",
    "ue5MasterId": "BD_128",
    "ue5MasterName": "水管｜直管",
    "mergeMode": "管网交叉自动生成三通",
    "isStandaloneSlot": false,
    "ue5Note": "管道连接至已有管段中段时自动实例化三通接头"
  },
  "BD_134": {
    "origId": "BD_134",
    "origName": "抽水机",
    "category": "泵",
    "ue5MasterId": "BD_134",
    "ue5MasterName": "抽水机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_135": {
    "origId": "BD_135",
    "origName": "采矿机",
    "category": "矿机",
    "ue5MasterId": "BD_135",
    "ue5MasterName": "采矿机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_136": {
    "origId": "BD_136",
    "origName": "精炼炉",
    "category": "机器",
    "ue5MasterId": "BD_136",
    "ue5MasterName": "精炼炉",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_137": {
    "origId": "BD_137",
    "origName": "粉碎机",
    "category": "带处理器",
    "ue5MasterId": "BD_137",
    "ue5MasterName": "粉碎机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_138": {
    "origId": "BD_138",
    "origName": "加工台",
    "category": "机器",
    "ue5MasterId": "BD_138",
    "ue5MasterName": "加工台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_139": {
    "origId": "BD_139",
    "origName": "切割机",
    "category": "带处理器",
    "ue5MasterId": "BD_139",
    "ue5MasterName": "切割机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_140": {
    "origId": "BD_140",
    "origName": "解构机",
    "category": "机器",
    "ue5MasterId": "BD_140",
    "ue5MasterName": "解构机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_141": {
    "origId": "BD_141",
    "origName": "培养皿",
    "category": "插槽",
    "ue5MasterId": "BD_141",
    "ue5MasterName": "培养皿",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_142": {
    "origId": "BD_142",
    "origName": "培养仓",
    "category": "插槽",
    "ue5MasterId": "BD_142",
    "ue5MasterName": "培养仓",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_143": {
    "origId": "BD_143",
    "origName": "搅拌机",
    "category": "插槽",
    "ue5MasterId": "BD_143",
    "ue5MasterName": "搅拌机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_144": {
    "origId": "BD_144",
    "origName": "离心机",
    "category": "插槽",
    "ue5MasterId": "BD_144",
    "ue5MasterName": "离心机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_145": {
    "origId": "BD_145",
    "origName": "提取器",
    "category": "插槽",
    "ue5MasterId": "BD_145",
    "ue5MasterName": "提取器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_146": {
    "origId": "BD_146",
    "origName": "组装机",
    "category": "机器",
    "ue5MasterId": "BD_146",
    "ue5MasterName": "组装机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_147": {
    "origId": "BD_147",
    "origName": "灵力引擎（下）",
    "category": "机器",
    "ue5MasterId": "BD_147",
    "ue5MasterName": "灵力引擎（下）",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_148": {
    "origId": "BD_148",
    "origName": "冶炼舱（上）",
    "category": "机器",
    "ue5MasterId": "BD_148",
    "ue5MasterName": "冶炼舱（上）",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_149": {
    "origId": "BD_149",
    "origName": "燃料发电机",
    "category": "机器",
    "ue5MasterId": "BD_149",
    "ue5MasterName": "燃料发电机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_150": {
    "origId": "BD_150",
    "origName": "回收处理塔",
    "category": "机器",
    "ue5MasterId": "BD_150",
    "ue5MasterName": "回收处理塔",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_151": {
    "origId": "BD_151",
    "origName": "跨区传送门",
    "category": "机器",
    "ue5MasterId": "BD_151",
    "ue5MasterName": "跨区传送门",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_152": {
    "origId": "BD_152",
    "origName": "操作台",
    "category": "机器",
    "ue5MasterId": "BD_152",
    "ue5MasterName": "操作台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_153": {
    "origId": "BD_153",
    "origName": "置物桌｜1×1×1m",
    "category": "结构",
    "ue5MasterId": "BD_153",
    "ue5MasterName": "置物桌｜1×1×1m",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_154": {
    "origId": "BD_154",
    "origName": "置物桌｜1×1×2m",
    "category": "结构",
    "ue5MasterId": "BD_153",
    "ue5MasterName": "置物桌｜1×1×1m",
    "mergeMode": "置物桌高度两段变体",
    "isStandaloneSlot": false,
    "ue5Note": "沿用小桌板资产，放置时切换 1m/2m 高度"
  },
  "BD_155": {
    "origId": "BD_155",
    "origName": "风力发电机",
    "category": "机器",
    "ue5MasterId": "BD_155",
    "ue5MasterName": "风力发电机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_156": {
    "origId": "BD_156",
    "origName": "炼宝台",
    "category": "机器",
    "ue5MasterId": "BD_156",
    "ue5MasterName": "炼宝台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_157": {
    "origId": "BD_157",
    "origName": "渡劫台",
    "category": "机器",
    "ue5MasterId": "BD_157",
    "ue5MasterName": "渡劫台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_158": {
    "origId": "BD_158",
    "origName": "流体处理中枢",
    "category": "基座",
    "ue5MasterId": "BD_158",
    "ue5MasterName": "流体处理中枢",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_159": {
    "origId": "BD_159",
    "origName": "营养基座",
    "category": "基座",
    "ue5MasterId": "BD_159",
    "ue5MasterName": "营养基座",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_160": {
    "origId": "BD_160",
    "origName": "飞剑防御塔",
    "category": "机器",
    "ue5MasterId": "BD_160",
    "ue5MasterName": "飞剑防御塔",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_161": {
    "origId": "BD_161",
    "origName": "智能合流器[B形态]",
    "category": "传送带",
    "ue5MasterId": "BD_123",
    "ue5MasterName": "合流器",
    "mergeMode": "合流器B形态镜像端口",
    "isStandaloneSlot": false,
    "ue5Note": "按 R/Tab 切换合流端口左右镜像布局"
  },
  "BD_162": {
    "origId": "BD_162",
    "origName": "智能分流器[B形态]",
    "category": "传送带",
    "ue5MasterId": "BD_124",
    "ue5MasterName": "分流器",
    "mergeMode": "分流器B形态镜像+定量拨盘",
    "isStandaloneSlot": false,
    "ue5Note": "沿用分流器资产并一键切换左右镜像与 1:1~1:4 配比"
  },
  "BD_163": {
    "origId": "BD_163",
    "origName": "炼丹炉（上）",
    "category": "机器",
    "ue5MasterId": "BD_163",
    "ue5MasterName": "炼丹炉（上）",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_164": {
    "origId": "BD_164",
    "origName": "灵木培育槽",
    "category": "机器",
    "ue5MasterId": "BD_164",
    "ue5MasterName": "灵木培育槽",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_165": {
    "origId": "BD_165",
    "origName": "储液罐",
    "category": "仓储",
    "ue5MasterId": "BD_165",
    "ue5MasterName": "储液罐",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_166": {
    "origId": "BD_166",
    "origName": "化煞焚毁井",
    "category": "机器",
    "ue5MasterId": "BD_166",
    "ue5MasterName": "化煞焚毁井",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_167": {
    "origId": "BD_167",
    "origName": "打印机",
    "category": "机器",
    "ue5MasterId": "BD_167",
    "ue5MasterName": "打印机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_168": {
    "origId": "BD_168",
    "origName": "灵兽舱",
    "category": "机器",
    "ue5MasterId": "BD_168",
    "ue5MasterName": "灵兽舱",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_169": {
    "origId": "BD_169",
    "origName": "灵舟天轨",
    "category": "天轨",
    "ue5MasterId": "BD_169",
    "ue5MasterName": "灵舟天轨",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_170": {
    "origId": "BD_170",
    "origName": "天轨合流器",
    "category": "天轨",
    "ue5MasterId": "BD_170",
    "ue5MasterName": "天轨合流器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_171": {
    "origId": "BD_171",
    "origName": "天轨分流器",
    "category": "天轨",
    "ue5MasterId": "BD_171",
    "ue5MasterName": "天轨分流器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_172": {
    "origId": "BD_172",
    "origName": "灵舟启航站",
    "category": "天轨",
    "ue5MasterId": "BD_172",
    "ue5MasterName": "灵舟启航站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_173": {
    "origId": "BD_173",
    "origName": "灵舟装载站",
    "category": "天轨",
    "ue5MasterId": "BD_173",
    "ue5MasterName": "灵舟装载站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_174": {
    "origId": "BD_174",
    "origName": "灵舟卸载站",
    "category": "天轨",
    "ue5MasterId": "BD_174",
    "ue5MasterName": "灵舟卸载站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_175": {
    "origId": "BD_175",
    "origName": "灵舟转运站",
    "category": "天轨",
    "ue5MasterId": "BD_175",
    "ue5MasterName": "灵舟转运站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_176": {
    "origId": "BD_176",
    "origName": "灵舟回收站",
    "category": "天轨",
    "ue5MasterId": "BD_176",
    "ue5MasterName": "灵舟回收站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_177": {
    "origId": "BD_177",
    "origName": "丹雾喷涂器",
    "category": "带处理器",
    "ue5MasterId": "BD_177",
    "ue5MasterName": "丹雾喷涂器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_178": {
    "origId": "BD_178",
    "origName": "归墟化煞炉",
    "category": "机器",
    "ue5MasterId": "BD_178",
    "ue5MasterName": "归墟化煞炉",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_179": {
    "origId": "BD_179",
    "origName": "天机推演台",
    "category": "机器",
    "ue5MasterId": "BD_179",
    "ue5MasterName": "天机推演台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_180": {
    "origId": "BD_180",
    "origName": "疾风传送带",
    "category": "传送带",
    "ue5MasterId": "BD_180",
    "ue5MasterName": "疾风传送带",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_181": {
    "origId": "BD_181",
    "origName": "乾坤叠物机",
    "category": "带处理器",
    "ue5MasterId": "BD_181",
    "ue5MasterName": "乾坤叠物机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_182": {
    "origId": "BD_182",
    "origName": "缩地极速带",
    "category": "传送带",
    "ue5MasterId": "BD_182",
    "ue5MasterName": "缩地极速带",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "UE5 Spline 样条主生成器资产，统筹所有弯折/爬坡/分叉子形态"
  },
  "BD_183": {
    "origId": "BD_183",
    "origName": "大型聚灵矿阵",
    "category": "矿机",
    "ue5MasterId": "BD_183",
    "ue5MasterName": "大型聚灵矿阵",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_184": {
    "origId": "BD_184",
    "origName": "九霄采气塔",
    "category": "机器",
    "ue5MasterId": "BD_184",
    "ue5MasterName": "九霄采气塔",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_185": {
    "origId": "BD_185",
    "origName": "真火精炼炉",
    "category": "机器",
    "ue5MasterId": "BD_185",
    "ue5MasterName": "真火精炼炉",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_186": {
    "origId": "BD_186",
    "origName": "万象总装机",
    "category": "机器",
    "ue5MasterId": "BD_186",
    "ue5MasterName": "万象总装机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_187": {
    "origId": "BD_187",
    "origName": "九转丹神炉",
    "category": "机器",
    "ue5MasterId": "BD_187",
    "ue5MasterName": "九转丹神炉",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_188": {
    "origId": "BD_188",
    "origName": "天魔负熵炉",
    "category": "机器",
    "ue5MasterId": "BD_188",
    "ue5MasterName": "天魔负熵炉",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_189": {
    "origId": "BD_189",
    "origName": "仙造重组枢机",
    "category": "机器",
    "ue5MasterId": "BD_189",
    "ue5MasterName": "仙造重组枢机",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_190": {
    "origId": "BD_190",
    "origName": "傀儡战备基站",
    "category": "机器",
    "ue5MasterId": "BD_190",
    "ue5MasterName": "傀儡战备基站",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_191": {
    "origId": "BD_191",
    "origName": "九霄雷暴塔",
    "category": "机器",
    "ue5MasterId": "BD_191",
    "ue5MasterName": "九霄雷暴塔",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_192": {
    "origId": "BD_192",
    "origName": "金乌聚变堆",
    "category": "基座",
    "ue5MasterId": "BD_192",
    "ue5MasterName": "金乌聚变堆",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_193": {
    "origId": "BD_193",
    "origName": "人造小仙阳",
    "category": "机器",
    "ue5MasterId": "BD_193",
    "ue5MasterName": "人造小仙阳",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_194": {
    "origId": "BD_194",
    "origName": "阴阳对撞仪",
    "category": "机器",
    "ue5MasterId": "BD_194",
    "ue5MasterName": "阴阳对撞仪",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_195": {
    "origId": "BD_195",
    "origName": "阵旗弹射器",
    "category": "机器",
    "ue5MasterId": "BD_195",
    "ue5MasterName": "阵旗弹射器",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_196": {
    "origId": "BD_196",
    "origName": "破界发射井",
    "category": "机器",
    "ue5MasterId": "BD_196",
    "ue5MasterName": "破界发射井",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_197": {
    "origId": "BD_197",
    "origName": "仙光接引台",
    "category": "机器",
    "ue5MasterId": "BD_197",
    "ue5MasterName": "仙光接引台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_198": {
    "origId": "BD_198",
    "origName": "千机纸鹤枢",
    "category": "插槽",
    "ue5MasterId": "BD_198",
    "ue5MasterName": "千机纸鹤枢",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_199": {
    "origId": "BD_199",
    "origName": "御剑抛射台",
    "category": "机器",
    "ue5MasterId": "BD_199",
    "ue5MasterName": "御剑抛射台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_200": {
    "origId": "BD_200",
    "origName": "接引莲台",
    "category": "机器",
    "ue5MasterId": "BD_200",
    "ue5MasterName": "接引莲台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_201": {
    "origId": "BD_201",
    "origName": "飞檐琉璃顶",
    "category": "结构",
    "ue5MasterId": "BD_201",
    "ue5MasterName": "飞檐琉璃顶",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_202": {
    "origId": "BD_202",
    "origName": "朱漆云廊桥",
    "category": "结构",
    "ue5MasterId": "BD_202",
    "ue5MasterName": "朱漆云廊桥",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_203": {
    "origId": "BD_203",
    "origName": "阵法浮空台",
    "category": "结构",
    "ue5MasterId": "BD_203",
    "ue5MasterName": "阵法浮空台",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_204": {
    "origId": "BD_204",
    "origName": "雷池蓄电枢",
    "category": "机器",
    "ue5MasterId": "BD_204",
    "ue5MasterName": "雷池蓄电枢",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_205": {
    "origId": "BD_205",
    "origName": "洞天灵药圃",
    "category": "机器",
    "ue5MasterId": "BD_205",
    "ue5MasterName": "洞天灵药圃",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  },
  "BD_206": {
    "origId": "BD_206",
    "origName": "万兽仙池",
    "category": "机器",
    "ue5MasterId": "BD_206",
    "ue5MasterName": "万兽仙池",
    "mergeMode": "独立主资产",
    "isStandaloneSlot": true,
    "ue5Note": "保留独立静态网格与逻辑Actor资产"
  }
};

const XIUXIAN_FABAOS = {
  "FAB_001_T1": {
    "tierId": "FAB_001_T1",
    "fabaoId": "FAB_001",
    "name": "万魂幡",
    "tier": 1,
    "formTitle": "万魂幡（一重）",
    "resourceName": "魂力",
    "resourceMax": 100,
    "limitRule": "魂压>80%范围缩15%；100%强制收幡禁魔3s",
    "combatSkills": "收魂(被动·脱战衰减)；鬼域(8m/10s·普通怪减速聚拢/精英仅减速/不可穿墙)；主魂AI辅助",
    "factorySkills": "邪修整尸配方切换；插回收塔/化煞炉旁吸煞转魂(不替净化塔)；耗25魂召2魂役搬蓝图补箱",
    "linkedIds": "RCP_175,RCP_176,RCP_177,BD_150,BD_178",
    "upgradeCond": "初成即解锁（炼宝台祭炼法宝胚成形）",
    "benchMats": "维护：MAT_070×1；突破：MAT_070×2;MAT_067×4",
    "status": "已定稿"
  },
  "FAB_001_T3": {
    "tierId": "FAB_001_T3",
    "fabaoId": "FAB_001",
    "name": "万魂幡",
    "tier": 3,
    "formTitle": "万魂幡（三重）",
    "resourceName": "魂力",
    "resourceMax": 120,
    "limitRule": "魂压>80%范围缩15%；100%强制收幡禁魔3s",
    "combatSkills": "鬼域（摄魂域）持续时间 +2 秒（12s / 8m），魂力上限提升至 120",
    "factorySkills": "邪修整尸血炼稳定运转；吸煞转魂与 2 名短时魂役协同",
    "linkedIds": "RCP_175,RCP_176,RCP_177,BD_150,BD_178",
    "upgradeCond": "吸收残魂并展开鬼域控场达标后，于炼宝台突破",
    "benchMats": "维护：MAT_070×1；突破：MAT_070×3;MAT_067×8;MAT_110×1",
    "status": "已定稿"
  },
  "FAB_001_T5": {
    "tierId": "FAB_001_T5",
    "fabaoId": "FAB_001",
    "name": "万魂幡",
    "tier": 5,
    "formTitle": "人皇旗",
    "resourceName": "魂力",
    "resourceMax": 120,
    "limitRule": "魂压>80%范围缩15%；100%强制收幡禁魔3s",
    "combatSkills": "解锁主动【魂幕】(耗25魂力)；鬼域内普通敌人额外降低攻击频率",
    "factorySkills": "解锁邪修全阶尸解血炼协同；魂役搬运优先度提升",
    "linkedIds": "RCP_175,RCP_176,RCP_177,BD_150,BD_178",
    "upgradeCond": "淬炼晋升人皇旗形态（炼宝台祭炼）",
    "benchMats": "维护：MAT_070×1；突破：MAT_070×4;MAT_083×6;MAT_110×1",
    "status": "已定稿"
  },
  "FAB_001_T7": {
    "tierId": "FAB_001_T7",
    "fabaoId": "FAB_001",
    "name": "万魂幡",
    "tier": 7,
    "formTitle": "人皇旗（七重）",
    "resourceName": "魂力",
    "resourceMax": 120,
    "limitRule": "魂压>80%范围缩15%；100%强制收幡禁魔3s",
    "combatSkills": "魂力自然衰减速度降低；摄魂域半径提升至 10m",
    "factorySkills": "吸煞转魂覆盖局部产线减压范围扩大",
    "linkedIds": "RCP_175,RCP_176,RCP_177,BD_150,BD_178",
    "upgradeCond": "高阶煞气结晶与人造灵石温养突破",
    "benchMats": "维护：MAT_070×1；突破：MAT_070×6;MAT_083×12;MAT_110×2",
    "status": "已定稿"
  },
  "FAB_001_T10": {
    "tierId": "FAB_001_T10",
    "fabaoId": "FAB_001",
    "name": "万魂幡",
    "tier": 10,
    "formTitle": "人皇旗（金光圆满）",
    "resourceName": "魂力",
    "resourceMax": 120,
    "limitRule": "施放无尽鬼域结束后魂压直接升至70%；100%强制收幡禁魔3s",
    "combatSkills": "解锁【无尽鬼域】：鬼域持续 15 秒（半径 10m），人皇旗通体冒金光",
    "factorySkills": "满阶鬼道工业共鸣：整尸配方、吸煞转魂与魂役全部满配解锁",
    "linkedIds": "RCP_175,RCP_176,RCP_177,BD_150,BD_178",
    "upgradeCond": "炼宝台圆满金光淬炼终成",
    "benchMats": "维护：MAT_070×1",
    "status": "已定稿"
  },
  "FAB_002_T1": {
    "tierId": "FAB_002_T1",
    "fabaoId": "FAB_002",
    "name": "山河社稷图",
    "tier": 1,
    "formTitle": "山河社稷图（一重）",
    "resourceName": "灵韵",
    "resourceMax": 100,
    "limitRule": "挡攻或搬迁地脉增加磨损并耗灵韵；灵韵=0进入休眠且停挂机",
    "combatSkills": "山河障(5m空间墙阻普通怪绕路+吞没远程子弹)；缩地成寸(画卷内移速+50%)",
    "factorySkills": "洞天福地槽位×1（可插1个灵草/灵兽无耗材温养挂机产出，产量200%）；收卷失效",
    "linkedIds": "MAT_026,MAT_114,MAT_115,MAT_116,BD_156",
    "upgradeCond": "探索大地图任意 3 个未收录区域，炼宝台消耗灵石×10+稳脉液×1突破",
    "benchMats": "修补：MAT_070×1;MAT_083×2；突破：MAT_083×10;MAT_070×1",
    "status": "已定稿"
  },
  "FAB_002_T3": {
    "tierId": "FAB_002_T3",
    "fabaoId": "FAB_002",
    "name": "山河社稷图",
    "tier": 3,
    "formTitle": "山河社稷图（三重）",
    "resourceName": "灵韵",
    "resourceMax": 130,
    "limitRule": "移动恢复灵韵速度+20%；灵韵=0进入休眠",
    "combatSkills": "山河障风墙宽度提升至 8m，持续时间 +2 秒；缩地成寸移速+50%",
    "factorySkills": "洞天福地槽位扩至×2；解锁【移山填海】(收录并投影1处玄铁/赤铜基础矿脉)与矿脉升级",
    "linkedIds": "MAT_001,MAT_002,MAT_026,MAT_114,MAT_116,BD_135,BD_156",
    "upgradeCond": "累计洞天收获200份材料+收录1处大型水源+消耗地脉灵砂×20+稳脉液×3",
    "benchMats": "修补：MAT_070×1;MAT_103×4；突破：MAT_103×20;MAT_070×3",
    "status": "已定稿"
  },
  "FAB_002_T5": {
    "tierId": "FAB_002_T5",
    "fabaoId": "FAB_002",
    "name": "山河社稷图",
    "tier": 5,
    "formTitle": "山河社稷图（五重·待补）",
    "resourceName": "灵韵",
    "resourceMax": 160,
    "limitRule": "灵韵=0进入休眠；须在炼宝台修补唤醒",
    "combatSkills": "预计山河障风墙扩至 10m（待后续版本补充细化）",
    "factorySkills": "预计洞天福地槽位扩至×3（待后续版本补充细化）",
    "linkedIds": "BD_156",
    "upgradeCond": "待添加内容（后续版本）",
    "benchMats": "修补：MAT_070×1;MAT_103×6",
    "status": "待补全"
  },
  "FAB_002_T7": {
    "tierId": "FAB_002_T7",
    "fabaoId": "FAB_002",
    "name": "山河社稷图",
    "tier": 7,
    "formTitle": "山河社稷图（七重·待补）",
    "resourceName": "灵韵",
    "resourceMax": 200,
    "limitRule": "灵韵=0进入休眠；须在炼宝台修补唤醒",
    "combatSkills": "高阶山河障（待后续版本补充细化）",
    "factorySkills": "支持高阶灵矿投影与矿脉富集升级（待后续版本补充细化）",
    "linkedIds": "BD_156",
    "upgradeCond": "待添加内容（后续版本）",
    "benchMats": "修补：MAT_070×2;MAT_083×6",
    "status": "待补全"
  },
  "FAB_002_T10": {
    "tierId": "FAB_002_T10",
    "fabaoId": "FAB_002",
    "name": "山河社稷图",
    "tier": 10,
    "formTitle": "山河社稷图（十重·待补）",
    "resourceName": "灵韵",
    "resourceMax": 250,
    "limitRule": "灵韵=0进入休眠；须在炼宝台修补唤醒",
    "combatSkills": "山河镇世终极画卷（待后续版本补充细化）",
    "factorySkills": "洞天福地大成温养（待后续版本补充细化）",
    "linkedIds": "BD_156",
    "upgradeCond": "待添加内容（后续版本）",
    "benchMats": "修补：MAT_070×2;MAT_110×1",
    "status": "待补全"
  }
};

const XIUXIAN_MAP_POIS = {
  "POI_SECT_01": {
    "id": "POI_SECT_01",
    "poiId": "POI_SECT_01",
    "name": "青云外门藏经阁",
    "type": "sect_library",
    "typeLabel": "敌方宗门藏经阁",
    "category": "sect_library",
    "sect": "青云外",
    "realm": "I~II 练气/筑基",
    "difficulty": "I~II 练气/筑基",
    "x": 0,
    "z": -142,
    "wx": 0,
    "wz": -142,
    "baseAlert": 32,
    "alertThreshold": 100,
    "lootPool": "POOL_01~06 | SCR_001/002/011；上古光路秘图(初阶)：MAT_124×2 + MAT_020×20",
    "arrayDiskSource": "途径② 藏经阁潜行偷秘图（直拿光路芯片与初阶直刻图）",
    "shanheLink": "展开画卷触发【缩地成寸】(+50%移速)绕柱卡位；【山河障】5m阻断弟子视线",
    "guardConfig": "外门巡逻弟子×2 + 筑基值守管事×1（视野锥90°/10m）",
    "desc": "方案A入门潜行阁：读条3~4s摸取密匣三选一残卷与初阶光路秘图；可用万魂幡鬼域聚拢弟子，暴露后可强杀或开山河图撤离"
  },
  "POI_SECT_02": {
    "id": "POI_SECT_02",
    "poiId": "POI_SECT_02",
    "name": "血煞宗秘库",
    "type": "sect_library",
    "typeLabel": "敌方宗门藏经阁",
    "category": "sect_library",
    "sect": "血煞宗",
    "realm": "III 金丹",
    "difficulty": "III 金丹",
    "x": -30,
    "z": -168,
    "wx": -30,
    "wz": -168,
    "baseAlert": 32,
    "alertThreshold": 100,
    "lootPool": "POOL_07~12 | SCR_008/009/039/042；上古光路秘图(进阶)：MAT_125×2 + MAT_020×40",
    "arrayDiskSource": "途径② 藏经阁潜行偷秘图 + 途径③ 强杀尸身解构逆向",
    "shanheLink": "长廊狭窄，适合【山河障】堵死通道吞没血符弹道并+50%移速转点",
    "guardConfig": "血煞暗哨×3 + 金丹血卫×1（高警觉巡逻）",
    "desc": "方案A高价值金丹秘库：含煞气净化与碎丹聚宝残卷；警戒达100%可强杀抽魂供解构机拆解，或摸完秘匣立即借图脱战"
  },
  "POI_SECT_03": {
    "id": "POI_SECT_03",
    "poiId": "POI_SECT_03",
    "name": "万兽宗灵阁",
    "type": "sect_library",
    "typeLabel": "敌方宗门藏经阁",
    "category": "sect_library",
    "sect": "万兽宗",
    "realm": "IV 元婴",
    "difficulty": "IV 元婴",
    "x": 30,
    "z": -168,
    "wx": 30,
    "wz": -168,
    "baseAlert": 32,
    "alertThreshold": 100,
    "lootPool": "POOL_13~17 | SCR_046~050/063；灵兽光路耦合图：MAT_125×3 + MAT_126×1",
    "arrayDiskSource": "途径② 藏经阁潜行偷秘图（获取阵盘极核与育兽替方）",
    "shanheLink": "可兼收录阁内高阶灵兽样本入【洞天福地】；【缩地成寸】避开嗅觉圈",
    "guardConfig": "驭兽巡卫×2 + 嗅觉灵兽×2 + 元婴护阁长老×1",
    "desc": "方案A嗅觉警戒阁：灵兽可探测声响，推荐先插万魂幡【鬼域】控住兽群再读条4.5s开柜偷取三选一与极核秘图"
  },
  "POI_SECT_04": {
    "id": "POI_SECT_04",
    "poiId": "POI_SECT_04",
    "name": "天机分阁秘藏",
    "type": "sect_library",
    "typeLabel": "敌方宗门藏经阁",
    "category": "sect_library",
    "sect": "天机分",
    "realm": "V 化神",
    "difficulty": "V 化神",
    "x": 0,
    "z": -198,
    "wx": 0,
    "wz": -198,
    "baseAlert": 32,
    "alertThreshold": 100,
    "lootPool": "POOL_18~22 | SCR_018/019/052/053/062；终极天机秘图：MAT_126×2 + MAT_137 线索",
    "arrayDiskSource": "途径② 藏经阁潜行偷秘图（直通阵盘极核与纯工业光芯终极路线）",
    "shanheLink": "须5重以上【山河障】挡住天机傀儡连射，配合【缩地成寸】极限偷取",
    "guardConfig": "天机扫描傀儡×2 + 化神剑侍×2 + 护阁尊者×1",
    "desc": "方案A终极藏经阁：读条5s开启核心天机柜，必出光芯/极核核心秘图与化神级三选一残卷，暴露后可双法宝掩护强杀或高速撤离"
  },
  "POI_RELIC_01": {
    "id": "POI_RELIC_01",
    "poiId": "POI_RELIC_01",
    "name": "残破丹鼎碑",
    "type": "relic_stele",
    "typeLabel": "古修遗迹残碑",
    "category": "ancient_relic",
    "sect": "残破丹",
    "realm": "I~II 练气/筑基",
    "difficulty": "I~II 练气/筑基",
    "x": -95,
    "z": -40,
    "wx": -95,
    "wz": -40,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "POOL_02/04/15 | SCR_002/015/026；丹火热路残片 + MAT_020×15",
    "arrayDiskSource": "途径④ 野外天机遗迹参悟（补齐基础解析数据与水循环替方）",
    "shanheLink": "计入1重【山河社稷图】大地图探索区域收录计数（+1）",
    "guardConfig": "无常驻守卫（激活碑文灵压时无敌意刷新）",
    "desc": "和平参悟点：向残碑注灵即可触发古修残卷三选一（侧重药田、稳脉液与水循环减负），并附赠解析数据"
  },
  "POI_RELIC_02": {
    "id": "POI_RELIC_02",
    "poiId": "POI_RELIC_02",
    "name": "上古天机残坛",
    "type": "relic_stele",
    "typeLabel": "古修遗迹残碑",
    "category": "ancient_relic",
    "sect": "上古天",
    "realm": "II~III 筑基/金丹",
    "difficulty": "II~III 筑基/金丹",
    "x": 95,
    "z": -45,
    "wx": 95,
    "wz": -45,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "POOL_18/19 | SCR_018/019/052；上古光路拓扑图（MAT_124×2 + MAT_020×30）",
    "arrayDiskSource": "途径④ 野外天机遗迹参悟（核心光路直悟点，解锁无兽光芯线）",
    "shanheLink": "计入探索收录计数；可展开画卷共鸣残坛加速神识参悟",
    "guardConfig": "休眠守坛古傀儡×1（仅解谜失误时短暂苏醒）",
    "desc": "光路专精遗迹：交互参悟古修天机算盘拓扑，稳定产出光路芯片与解析数据，并从三选一中直取工业光芯替代生物兽魂秘方"
  },
  "POI_RELIC_03": {
    "id": "POI_RELIC_03",
    "poiId": "POI_RELIC_03",
    "name": "太古剑冢碑林",
    "type": "relic_stele",
    "typeLabel": "古修遗迹残碑",
    "category": "ancient_relic",
    "sect": "太古剑",
    "realm": "III~IV 金丹/元婴",
    "difficulty": "III~IV 金丹/元婴",
    "x": 0,
    "z": 125,
    "wx": 0,
    "wz": 125,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "POOL_11/16/20 | SCR_040/041/060；剑意淬炼阵核 + MAT_125×1 + MAT_020×35",
    "arrayDiskSource": "途径④ 野外天机遗迹参悟（神识光芯与剑丸/法宝胚替方）",
    "shanheLink": "试炼期间展开【山河障】可吞没碑林飞出的残余剑气弹幕",
    "guardConfig": "无实体巡逻（触摸主碑触发10s剑意幻影试炼）",
    "desc": "轻量试炼残碑：在剑意涌动下坚持或用山河障格挡，即可领悟法宝祭炼与高空采气等高阶残卷三选一"
  },
  "POI_WONDER_01": {
    "id": "POI_WONDER_01",
    "poiId": "POI_WONDER_01",
    "name": "灵瀑天湖",
    "type": "wonder_node",
    "typeLabel": "山河奇观与秘矿",
    "category": "wonder_ore",
    "sect": "灵瀑天",
    "realm": "I~II 练气/筑基",
    "difficulty": "I~II 练气/筑基",
    "x": -120,
    "z": -110,
    "wx": -120,
    "wz": -110,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "大型水源样本 + 灵韵补给(+50) + MAT_020×10（初探收录奖励）",
    "arrayDiskSource": "途径④ 野外天机遗迹参悟（初探山水灵韵共鸣获解析数据）",
    "shanheLink": "1重探索收录+1；完美满足3重晋升条件【收录1处大型水源】",
    "guardConfig": "无敌对守卫（自然奇观安全区）",
    "desc": "山河奇观水源点：大地图重要大型水源地标，首次靠近自动录入山河图并大幅补充灵韵，支持后续洞天福地水灵温养"
  },
  "POI_WONDER_02": {
    "id": "POI_WONDER_02",
    "poiId": "POI_WONDER_02",
    "name": "翠微灵峰",
    "type": "wonder_node",
    "typeLabel": "山河奇观与秘矿",
    "category": "wonder_ore",
    "sect": "翠微灵",
    "realm": "I~II 练气/筑基",
    "difficulty": "I~II 练气/筑基",
    "x": 120,
    "z": -110,
    "wx": 120,
    "wz": -110,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "极品灵草母株（MAT_026 样本）+ 灵韵(+40) + MAT_020×10",
    "arrayDiskSource": "途径④ 野外天机遗迹参悟（峰顶灵气共鸣获解析数据）",
    "shanheLink": "1重探索收录+1；峰顶灵草可直接收录入【洞天福地】200%挂机产出",
    "guardConfig": "无敌对守卫（崖壁需跳跃或缩地成寸登顶）",
    "desc": "山河奇观灵峰：收录后稳定强化山河图灵韵恢复节奏，并提供洞天福地无耗材挂机的首批极品灵植样本"
  },
  "POI_WONDER_03": {
    "id": "POI_WONDER_03",
    "poiId": "POI_WONDER_03",
    "name": "赤铜古脉",
    "type": "wonder_node",
    "typeLabel": "山河奇观与秘矿",
    "category": "wonder_ore",
    "sect": "赤铜古",
    "realm": "II~III 筑基/金丹",
    "difficulty": "II~III 筑基/金丹",
    "x": -110,
    "z": 95,
    "wx": -110,
    "wz": 95,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "高纯度赤铜原矿脉（MAT_002）+ 矿脉定位脉冲",
    "arrayDiskSource": "途径① 工厂自产上游外矿支撑（稳定供给光路导脉铜线）",
    "shanheLink": "3重解锁【移山填海】后可整脉收录并投影回主基地，消耗灵韵升级富集度",
    "guardConfig": "无常驻守卫（毗邻散修营地外围）",
    "desc": "秘矿奇观：外围高纯赤铜矿点，前期可直建采矿机+天轨运回，山河图3重后直接投影搬迁进主厂区"
  },
  "POI_WONDER_04": {
    "id": "POI_WONDER_04",
    "poiId": "POI_WONDER_04",
    "name": "玄铁天坑",
    "type": "wonder_node",
    "typeLabel": "山河奇观与秘矿",
    "category": "wonder_ore",
    "sect": "玄铁天",
    "realm": "II~IV 筑基/元婴",
    "difficulty": "II~IV 筑基/元婴",
    "x": 115,
    "z": 95,
    "wx": 115,
    "wz": 95,
    "baseAlert": 0,
    "alertThreshold": 0,
    "lootPool": "富集玄铁巨脉（MAT_001）+ 深层矿核样本",
    "arrayDiskSource": "途径① 工厂自产上游外矿支撑（支撑机壳与重装产线）",
    "shanheLink": "3重解锁【移山填海】后可收录投影基础玄铁矿脉，提升基地矿脉富集度",
    "guardConfig": "无常驻守卫（天坑边缘地形陡峭）",
    "desc": "秘矿奇观：主厂区南方大型玄铁外矿，既可就地立矿场扩产，也可由山河社稷图收录投影回基地内部"
  },
  "POI_CAMP_01": {
    "id": "POI_CAMP_01",
    "poiId": "POI_CAMP_01",
    "name": "散修掠矿营",
    "type": "camp_beacon",
    "typeLabel": "守矿修士营地",
    "category": "guard_camp",
    "sect": "散修掠",
    "realm": "I~II 练气/筑基",
    "difficulty": "I~II 练气/筑基",
    "x": -28,
    "z": -95,
    "wx": -28,
    "wz": -95,
    "baseAlert": 0,
    "alertThreshold": 100,
    "lootPool": "掠夺矿箱（玄铁/赤铜/MAT_070）+ 修士尸体 + 破损阵盘件（BD_140 解构出 MAT_124 原料 + MAT_020×20）",
    "arrayDiskSource": "途径③ 战利品解构逆向（击杀掠矿散修拆解阵盘残件与尸体）",
    "shanheLink": "【鬼域】拉怪聚拢配合防御/法宝清营；【山河障】掩护近身",
    "guardConfig": "散修巡矿手×3 + 筑基头目×1",
    "desc": "前中期战斗补给营：接近领地警戒达100%直接开战，清剿后夺取矿箱并将破损阵盘与尸体带回BD_140解构机逆向提取光路资源"
  },
  "POI_CAMP_02": {
    "id": "POI_CAMP_02",
    "poiId": "POI_CAMP_02",
    "name": "天魔前哨坛",
    "type": "camp_beacon",
    "typeLabel": "守矿修士营地",
    "category": "guard_camp",
    "sect": "天魔前",
    "realm": "IV~V 元婴/化神",
    "difficulty": "IV~V 元婴/化神",
    "x": 28,
    "z": -95,
    "wx": 28,
    "wz": -95,
    "baseAlert": 0,
    "alertThreshold": 100,
    "lootPool": "POOL_16~21 | SCR_061/062/065 + 天魔傀儡残骸/高阶尸身（BD_140 逆向出 MAT_125 碎芯 + MAT_067 + MAT_020×45）",
    "arrayDiskSource": "途径③ 战利品解构逆向（高阶傀儡与天魔战利品逆向神识光芯）",
    "shanheLink": "必须用【山河障】吞没天魔远程魔弹，【鬼域】控杂兵+【缩地成寸】拉扯",
    "guardConfig": "天魔哨兵×2 + 护坛傀儡×2 + 元婴坛主×1",
    "desc": "高阶战利品强袭点：击破前哨坛不仅可获取高阶世代重工残卷，还能回收天魔算器傀儡残骸送入解构机与化煞炉逆向光芯"
  }
};

const INITIAL_PLAYER_INVENTORY = [
  {
    "item": "iron_ore",
    "count": 100
  },
  {
    "item": "copper_ore",
    "count": 80
  },
  {
    "item": "coal",
    "count": 60
  },
  {
    "item": "iron_ingot",
    "count": 58
  },
  {
    "item": "copper_ingot",
    "count": 45
  },
  {
    "item": "iron_plate",
    "count": 120
  },
  {
    "item": "copper_wire",
    "count": 150
  },
  {
    "item": "iron_gear",
    "count": 40
  },
  {
    "item": "ling_copper_sheet",
    "count": 25
  },
  {
    "item": "cultivator_corpse",
    "count": 2
  },
  {
    "item": "living_tissue",
    "count": 12
  },
  {
    "item": "neural_bundle",
    "count": 6
  },
  {
    "item": "dry_tissue",
    "count": 10
  },
  {
    "item": "iron_powder",
    "count": 30
  },
  {
    "item": "wood_plank",
    "count": 50
  },
  {
    "item": "raw_water",
    "count": 40
  },
  {
    "item": "charcoal_ash",
    "count": 30
  },
  {
    "item": "ling_grass_seed",
    "count": 20
  },
  {
    "item": "basic_nutrient",
    "count": 20
  }
];

const XIUXIAN_TIERS = [
  {
    "id": "t0",
    "tierNum": 0,
    "name": "序章·苏醒",
    "realm": "序章",
    "badge": "序章",
    "desc": "休眠舱苏醒与中央处理器应急恢复",
    "stageIds": [
      0
    ]
  },
  {
    "id": "t1",
    "tierNum": 1,
    "name": "练气前期",
    "realm": "练气期",
    "badge": "练气前期",
    "desc": "矿石采掘、基础冶炼粉碎、物流与风力供电",
    "goldenBodyMilestone": "练气前期圆满后开放【金身基座】大型塑造供料",
    "stageIds": [
      1,
      2,
      3
    ]
  },
  {
    "id": "t2",
    "tierNum": 2,
    "name": "练气中期",
    "realm": "练气期",
    "badge": "练气中期",
    "desc": "战斗取材、修士遗体解构、灵草培养与离心生化",
    "goldenBodyMilestone": "练气中期圆满后开放【金身骨架】大型塑造供料",
    "stageIds": [
      4,
      5,
      6
    ]
  },
  {
    "id": "t3",
    "tierNum": 3,
    "name": "筑基前期",
    "realm": "筑基期",
    "badge": "筑基前期",
    "desc": "高温冶炼舱、高级生物复合与组装机动力总装",
    "goldenBodyMilestone": "筑基前期圆满后开放【金身经络】大型塑造供料",
    "stageIds": [
      7,
      8,
      9
    ]
  },
  {
    "id": "t4",
    "tierNum": 4,
    "name": "筑基后期",
    "realm": "筑基期",
    "badge": "筑基后期",
    "desc": "废液回收闭环、煞气支线、人造灵根原型终配与天劫淬炼",
    "goldenBodyMilestone": "筑基后期圆满后【金身初启·Demo终局】",
    "stageIds": [
      10,
      11,
      12
    ]
  }
];

const XIUXIAN_STAGES = {
  "0": {
    "id": 0,
    "tierId": "t0",
    "tierName": "序章·苏醒",
    "stageNum": 0,
    "layerName": "序章",
    "realm": "序章",
    "stageBadge": "序章",
    "title": "休眠舱苏醒与中央处理器应急恢复",
    "subTitle": "应急苏醒",
    "desc": "拆解休眠舱、修复天元中央处理器、解析两具金丹遗体获得世界观数据并恢复正式电网。",
    "requirements": [
      {
        "code": "analysis_data",
        "need": 8
      },
      {
        "code": "wiring_assembly",
        "need": 1
      },
      {
        "code": "power_supply_module",
        "need": 1
      }
    ],
    "rewards": [
      "BD_140 应急解构机",
      "BD_149 预置燃料发电机",
      "BD_100 操作台",
      "山河社稷图残卷 & 残损剑匣",
      "正式电网恢复"
    ],
    "nextStageText": "步入 练气前期 · 练气一层"
  },
  "1": {
    "id": 1,
    "tierId": "t1",
    "tierName": "练气前期",
    "stageNum": 1,
    "layerName": "练气一层",
    "realm": "练气期",
    "stageBadge": "练气一层",
    "title": "采矿冶炼与基础构件",
    "subTitle": "采矿与冶炼",
    "desc": "开采玄铁矿与赤铜矿，建立精炼炉冶炼玄铁锭、赤铜锭与手工加工玄铁板。",
    "requirements": [
      {
        "code": "iron_ingot",
        "need": 100
      },
      {
        "code": "copper_ingot",
        "need": 100
      },
      {
        "code": "iron_plate",
        "need": 100
      }
    ],
    "rewards": [
      "BD_101 采矿机",
      "BD_102 精炼炉",
      "玄铁板 / 玄铁齿轮自动化加工配方"
    ],
    "nextStageText": "突破至 练气二层"
  },
  "2": {
    "id": 2,
    "tierId": "t1",
    "tierName": "练气前期",
    "stageNum": 2,
    "layerName": "练气二层",
    "realm": "练气期",
    "stageBadge": "练气二层",
    "title": "粉碎加工与基础物流",
    "subTitle": "粉碎与通用零件",
    "desc": "建造粉碎机生产玄铁粉，使用加工台制造灵磁齿轮、设备框架与设备管件，打通垂直物流与分流合流。",
    "requirements": [
      {
        "code": "iron_powder",
        "need": 100
      },
      {
        "code": "lingci_gear",
        "need": 60
      },
      {
        "code": "device_frame",
        "need": 30
      },
      {
        "code": "device_pipe",
        "need": 30
      }
    ],
    "rewards": [
      "BD_103 粉碎机",
      "BD_104 加工台",
      "垂直传送带 & 弯轨 / 上下坡传送带",
      "分流器 / 合流器 / 交叉器 / 限速器",
      "基础水管管件"
    ],
    "nextStageText": "突破至 练气三层"
  },
  "3": {
    "id": 3,
    "tierId": "t1",
    "tierName": "练气前期",
    "stageNum": 3,
    "layerName": "练气三层",
    "realm": "练气期",
    "stageBadge": "练气三层·前期圆满",
    "title": "铜材切割与风力供电",
    "subTitle": "切割、控制和木材",
    "desc": "制造切割机产出导灵铜片与铜线，引入木材加工与导电线圈，建造风力发电机补足电网。完成认证后开放造化金身基座供料！",
    "requirements": [
      {
        "code": "ling_copper_sheet",
        "need": 100
      },
      {
        "code": "electric_coil",
        "need": 40
      },
      {
        "code": "basic_control_module",
        "need": 40
      },
      {
        "code": "wood_structural_part",
        "need": 40
      }
    ],
    "rewards": [
      "BD_105 切割机",
      "BD_116 风力发电机",
      "智能分流器 / 智能合流器",
      "储藏盒｜1×1×2m 宽柜/窄柜",
      "🌟 开放造化金身第 1 阶段【金身基座】大型塑造！"
    ],
    "goldenBodyReq": [
      {
        "code": "iron_plate",
        "need": 300,
        "name": "玄铁板"
      },
      {
        "code": "iron_beam",
        "need": 100,
        "name": "玄铁梁"
      },
      {
        "code": "wood_structural_part",
        "need": 100,
        "name": "木结构件"
      },
      {
        "code": "device_frame",
        "need": 50,
        "name": "设备框架"
      }
    ],
    "nextStageText": "练气前期圆满！晋升【练气中期】"
  },
  "4": {
    "id": 4,
    "tierId": "t2",
    "tierName": "练气中期",
    "stageNum": 4,
    "layerName": "练气四层",
    "realm": "练气期",
    "stageBadge": "练气四层",
    "title": "战斗取材与流体解构",
    "subTitle": "战斗取材与解构",
    "desc": "激活剑匣战斗接口，击败练气/筑基修士拾取尸体装箱带回，使用正式解构机拆解生物材料并启动流体抽取。",
    "requirements": [
      {
        "code": "living_tissue",
        "need": 60
      },
      {
        "code": "neural_bundle",
        "need": 40
      },
      {
        "code": "dry_tissue",
        "need": 40
      },
      {
        "code": "bio_filter_core",
        "need": 30
      }
    ],
    "rewards": [
      "BD_140 正式解构机",
      "BD_107 提取器",
      "BD_117 抽水机",
      "组织蛋白液 / 灵草萃取液配方"
    ],
    "nextStageText": "突破至 练气五层"
  },
  "5": {
    "id": 5,
    "tierId": "t2",
    "tierName": "练气中期",
    "stageNum": 5,
    "layerName": "练气五层",
    "realm": "练气期",
    "stageBadge": "练气五层",
    "title": "灵草培养与离心生化",
    "subTitle": "培养、灵草与生物电子",
    "desc": "种植成熟灵草，配置基础营养液与活性生物混合液，使用离心机分离组织精华液与活性细胞团，试制电子生物芯片。",
    "requirements": [
      {
        "code": "bio_chip",
        "need": 30
      },
      {
        "code": "mature_ling_grass",
        "need": 60
      },
      {
        "code": "active_cell_cluster",
        "need": 30
      },
      {
        "code": "bio_control_core",
        "need": 20
      }
    ],
    "rewards": [
      "BD_131 培养皿",
      "BD_108 培育仓",
      "BD_110 搅拌机",
      "BD_106 离心机",
      "BD_130 营养基座",
      "BD_132 流体处理中枢"
    ],
    "nextStageText": "突破至 练气六层"
  },
  "6": {
    "id": 6,
    "tierId": "t2",
    "tierName": "练气中期",
    "stageNum": 6,
    "layerName": "练气六层",
    "realm": "练气期",
    "stageBadge": "练气六层·练气大圆满",
    "title": "生物设备整合与控制回路",
    "subTitle": "生物设备整合",
    "desc": "搭建流体循环水泵与控制插件，完成练气期生物工业链闭环。完成认证后开放造化金身骨架供料！",
    "requirements": [
      {
        "code": "device_interface",
        "need": 30
      },
      {
        "code": "circulating_pump",
        "need": 20
      },
      {
        "code": "device_frame",
        "need": 60
      },
      {
        "code": "bio_filter_core",
        "need": 40
      }
    ],
    "rewards": [
      "高级生物流体回路整合授权",
      "设备控制插件配方",
      "🌟 开放造化金身第 2 阶段【金身骨架】大型塑造！"
    ],
    "goldenBodyReq": [
      {
        "code": "device_frame",
        "need": 100,
        "name": "设备框架"
      },
      {
        "code": "device_interface",
        "need": 80,
        "name": "设备接口件"
      },
      {
        "code": "bio_chip",
        "need": 40,
        "name": "电子生物芯片"
      },
      {
        "code": "bio_filter_core",
        "need": 60,
        "name": "生物蛋白滤芯"
      },
      {
        "code": "bio_essence",
        "need": 60,
        "name": "组织精华液"
      }
    ],
    "nextStageText": "练气大圆满！晋升【筑基前期】"
  },
  "7": {
    "id": 7,
    "tierId": "t3",
    "tierName": "筑基前期",
    "stageNum": 1,
    "layerName": "筑基一层",
    "realm": "筑基期",
    "stageBadge": "筑基一层",
    "title": "高温冶炼舱",
    "subTitle": "高温冶炼",
    "desc": "进入筑基境界，引入高温冶炼舱，以强电热能冶炼精炼玄铁锭与高温合金锭。",
    "requirements": [
      {
        "code": "refined_iron_ingot",
        "need": 120
      },
      {
        "code": "high_temp_alloy_ingot",
        "need": 60
      },
      {
        "code": "device_frame",
        "need": 60
      }
    ],
    "rewards": [
      "BD_113 冶炼舱（上）",
      "精炼玄铁锭高温配方",
      "高温合金锭配方"
    ],
    "nextStageText": "突破至 筑基二层"
  },
  "8": {
    "id": 8,
    "tierId": "t3",
    "tierName": "筑基前期",
    "stageNum": 2,
    "layerName": "筑基二层",
    "realm": "筑基期",
    "stageBadge": "筑基二层",
    "title": "高级生物复合与组装机",
    "subTitle": "高级生物复合",
    "desc": "建造组装机，实现双进固体与多路工艺自动化总装，生产生物胚料与生物复合板。",
    "requirements": [
      {
        "code": "bio_embryo",
        "need": 50
      },
      {
        "code": "bio_composite_plate",
        "need": 30
      },
      {
        "code": "high_temp_alloy_ingot",
        "need": 60
      }
    ],
    "rewards": [
      "BD_111 组装机",
      "生物复合板自动化组装配方",
      "双进自动装配线授权"
    ],
    "nextStageText": "突破至 筑基三层"
  },
  "9": {
    "id": 9,
    "tierId": "t3",
    "tierName": "筑基前期",
    "stageNum": 3,
    "layerName": "筑基三层",
    "realm": "筑基期",
    "stageBadge": "筑基三层·筑基小成",
    "title": "电能核心与动力总装",
    "subTitle": "动力核心与组装",
    "desc": "生产电能核心并总装动力核心，生产力迎来质的跃升。完成认证后开放造化金身经络供料！",
    "requirements": [
      {
        "code": "power_core",
        "need": 30
      },
      {
        "code": "bio_composite_plate",
        "need": 40
      },
      {
        "code": "bio_chip",
        "need": 40
      },
      {
        "code": "high_temp_alloy_ingot",
        "need": 80
      }
    ],
    "rewards": [
      "动力核心配方",
      "高负载组装线授权",
      "🌟 开放造化金身第 3 阶段【金身经络】大型塑造！"
    ],
    "goldenBodyReq": [
      {
        "code": "refined_iron_ingot",
        "need": 240,
        "name": "精炼玄铁锭"
      },
      {
        "code": "high_temp_alloy_ingot",
        "need": 120,
        "name": "高温合金锭"
      },
      {
        "code": "power_core",
        "need": 40,
        "name": "电能核心"
      },
      {
        "code": "bio_composite_plate",
        "need": 60,
        "name": "生物复合板"
      }
    ],
    "nextStageText": "筑基前期大成！晋升【筑基后期】"
  },
  "10": {
    "id": 10,
    "tierId": "t4",
    "tierName": "筑基后期",
    "stageNum": 4,
    "layerName": "筑基四层",
    "realm": "筑基期",
    "stageBadge": "筑基四层",
    "title": "废液回收与煞气支线",
    "subTitle": "废液回收与煞气",
    "desc": "建造回收处理塔闭环净化生物废液，开放地图煞气节点接入，解锁首件法宝前置炼宝台。",
    "requirements": [
      {
        "code": "purify_filter_set",
        "need": 40
      },
      {
        "code": "general_purify_core",
        "need": 20
      },
      {
        "code": "device_control_plugin",
        "need": 20
      },
      {
        "code": "purify_residue",
        "need": 40
      }
    ],
    "rewards": [
      "BD_118 回收处理塔（废液模式）",
      "回收塔地图煞气节点接入模式",
      "BD_148 炼宝台 (首件法宝前置绑定)",
      "法宝阵图胚装配授权"
    ],
    "nextStageText": "突破至 筑基五层"
  },
  "11": {
    "id": 11,
    "tierId": "t4",
    "tierName": "筑基后期",
    "stageNum": 5,
    "layerName": "筑基五层",
    "realm": "筑基期",
    "stageBadge": "筑基五层",
    "title": "终局核心加工与灵根芯材",
    "subTitle": "终局核心加工",
    "desc": "制造灵根芯材、动力核心与主控核心，生物、控制与工业三线全面合流。",
    "requirements": [
      {
        "code": "linggen_core_material",
        "need": 10
      },
      {
        "code": "power_drive_core",
        "need": 10
      },
      {
        "code": "main_control_core",
        "need": 10
      },
      {
        "code": "device_control_plugin",
        "need": 20
      }
    ],
    "rewards": [
      "灵根芯材组装配方",
      "主控核心配方",
      "组装机终配前置解锁"
    ],
    "nextStageText": "突破至 筑基六层 (终局)"
  },
  "12": {
    "id": 12,
    "tierId": "t4",
    "tierName": "筑基后期",
    "stageNum": 6,
    "layerName": "筑基六层",
    "realm": "筑基期",
    "stageBadge": "筑基六层·Demo终局",
    "title": "人造灵根原型终局与天劫淬炼",
    "subTitle": "灵根终局与天劫",
    "desc": "组装机连续制造主线唯一终局目标【人造灵根原型】；可选解锁渡劫台天劫淬炼【山河社稷图】。造化金身终局植入20批人造灵根原型，完成 Demo 主线初启！",
    "requirements": [
      {
        "code": "linggen_embryo",
        "need": 1
      },
      {
        "code": "power_drive_core",
        "need": 5
      },
      {
        "code": "main_control_core",
        "need": 5
      },
      {
        "code": "general_purify_core",
        "need": 5
      }
    ],
    "rewards": [
      "组装机人造灵根原型终配",
      "BD_148_T 渡劫台 (天劫淬炼山河社稷图)",
      "🌟 开放造化金身第 4 阶段【金身初启·Demo终局】批量供料！"
    ],
    "goldenBodyReq": [
      {
        "code": "high_temp_alloy_ingot",
        "need": 200,
        "name": "高温合金锭"
      },
      {
        "code": "power_drive_core",
        "need": 20,
        "name": "动力核心"
      },
      {
        "code": "main_control_core",
        "need": 20,
        "name": "主控核心"
      },
      {
        "code": "general_purify_core",
        "need": 30,
        "name": "通用净化核心"
      },
      {
        "code": "artificial_linggen",
        "need": 20,
        "name": "人造灵根原型 (终局植入)"
      }
    ],
    "nextStageText": "🎉 Demo主线大获全胜！造化金身初启，人工灵力转换接口成功建立！"
  }
};

const XIUXIAN_RECIPE_CANONICAL_IDS = {
  "rcp_001": "RCP_001",
  "rcp_002": "RCP_002",
  "rcp_003": "RCP_003",
  "rcp_004": "RCP_004",
  "rcp_005": "RCP_005",
  "rcp_006": "RCP_006",
  "rcp_007": "RCP_007",
  "rcp_008": "RCP_008",
  "rcp_009": "RCP_009",
  "rcp_010": "RCP_010",
  "rcp_011": "RCP_011",
  "rcp_012": "RCP_012",
  "rcp_013": "RCP_013",
  "rcp_014": "RCP_014",
  "rcp_015": "RCP_015",
  "rcp_017": "RCP_017",
  "rcp_019": "RCP_019",
  "rcp_020": "RCP_020",
  "rcp_021": "RCP_021",
  "rcp_022": "RCP_022",
  "rcp_023": "RCP_023",
  "rcp_024": "RCP_024",
  "rcp_025": "RCP_025",
  "rcp_026": "RCP_026",
  "rcp_027": "RCP_027",
  "rcp_028": "RCP_028",
  "rcp_029": "RCP_029",
  "rcp_030": "RCP_030",
  "rcp_031": "RCP_031",
  "rcp_032": "RCP_032",
  "rcp_033": "RCP_033",
  "rcp_034": "RCP_034",
  "rcp_035": "RCP_035",
  "rcp_038": "RCP_038",
  "rcp_039": "RCP_039",
  "rcp_040": "RCP_040",
  "rcp_041": "RCP_041",
  "rcp_042": "RCP_042",
  "rcp_044": "RCP_044",
  "rcp_045": "RCP_045",
  "rcp_046": "RCP_046",
  "rcp_047": "RCP_047",
  "rcp_048": "RCP_048",
  "rcp_049": "RCP_049",
  "rcp_050": "RCP_050",
  "rcp_051": "RCP_051",
  "rcp_052": "RCP_052",
  "rcp_053": "RCP_053",
  "rcp_054": "RCP_054",
  "rcp_055": "RCP_055",
  "rcp_056": "RCP_056",
  "rcp_057": "RCP_057",
  "rcp_058": "RCP_058",
  "rcp_059": "RCP_059",
  "rcp_060": "RCP_060",
  "rcp_061": "RCP_061",
  "rcp_062": "RCP_062",
  "rcp_063": "RCP_063",
  "rcp_066": "RCP_066",
  "rcp_067": "RCP_067",
  "rcp_068": "RCP_068",
  "rcp_069": "RCP_069",
  "rcp_070": "RCP_070",
  "rcp_088": "RCP_088",
  "rcp_089": "RCP_089",
  "rcp_090": "RCP_090",
  "rcp_094": "RCP_094",
  "rcp_096": "RCP_096",
  "rcp_097": "RCP_097",
  "rcp_098": "RCP_098",
  "rcp_099": "RCP_099",
  "rcp_100": "RCP_100",
  "rcp_101": "RCP_101",
  "rcp_102": "RCP_102",
  "rcp_103": "RCP_103",
  "rcp_106": "RCP_106",
  "rcp_107": "RCP_107",
  "rcp_108": "RCP_108",
  "rcp_109": "RCP_109",
  "rcp_110": "RCP_110",
  "rcp_111": "RCP_111",
  "rcp_112": "RCP_112",
  "rcp_113": "RCP_113",
  "rcp_117": "RCP_117",
  "rcp_122": "RCP_122",
  "rcp_123": "RCP_123",
  "rcp_124": "RCP_124",
  "rcp_127": "RCP_127",
  "rcp_128": "RCP_128",
  "rcp_129": "RCP_129",
  "rcp_130": "RCP_130",
  "rcp_131": "RCP_131",
  "rcp_132": "RCP_132",
  "rcp_133": "RCP_133",
  "rcp_134": "RCP_134",
  "rcp_135": "RCP_135",
  "rcp_136": "RCP_136",
  "rcp_137": "RCP_137",
  "rcp_138": "RCP_138",
  "rcp_139": "RCP_139",
  "rcp_140": "RCP_140",
  "rcp_142": "RCP_142",
  "rcp_143": "RCP_143",
  "rcp_144": "RCP_144",
  "rcp_145": "RCP_145",
  "rcp_146": "RCP_146",
  "rcp_147": "RCP_147",
  "rcp_148": "RCP_148",
  "rcp_149": "RCP_149",
  "rcp_151": "RCP_151",
  "rcp_152": "RCP_152",
  "rcp_154": "RCP_154",
  "rcp_155": "RCP_155",
  "rcp_156": "RCP_156",
  "rcp_157": "RCP_157",
  "rcp_158": "RCP_158",
  "rcp_165": "RCP_165",
  "rcp_171": "RCP_171",
  "rcp_175": "RCP_175",
  "rcp_176": "RCP_176",
  "rcp_177": "RCP_177",
  "rcp_178": "RCP_178",
  "rcp_179": "RCP_179",
  "rcp_185": "RCP_185",
  "rcp_187": "RCP_187",
  "rcp_188": "RCP_188",
  "rcp_191": "RCP_191",
  "rcp_192": "RCP_192",
  "rcp_193": "RCP_193",
  "rcp_194": "RCP_194",
  "rcp_195": "RCP_195",
  "rcp_196": "RCP_196",
  "rcp_197": "RCP_197",
  "rcp_198": "RCP_198",
  "rcp_199": "RCP_199",
  "rcp_200": "RCP_200",
  "rcp_201": "RCP_201",
  "rcp_202": "RCP_202",
  "rcp_203": "RCP_203",
  "rcp_204": "RCP_204",
  "rcp_205": "RCP_205",
  "rcp_206": "RCP_206",
  "rcp_207": "RCP_207",
  "rcp_209": "RCP_209",
  "rcp_210": "RCP_210",
  "rcp_211": "RCP_211",
  "rcp_212": "RCP_212",
  "rcp_213": "RCP_213",
  "rcp_214": "RCP_214",
  "rcp_215": "RCP_215",
  "rcp_216": "RCP_216",
  "rcp_217": "RCP_217",
  "rcp_218": "RCP_218",
  "rcp_219": "RCP_219",
  "rcp_220": "RCP_220",
  "rcp_221": "RCP_221",
  "rcp_222": "RCP_222",
  "rcp_223": "RCP_223",
  "rcp_224": "RCP_224",
  "rcp_225": "RCP_225",
  "rcp_226": "RCP_226",
  "rcp_230": "RCP_230",
  "rcp_231": "RCP_231",
  "rcp_232": "RCP_232",
  "rcp_233": "RCP_233",
  "rcp_236": "RCP_236",
  "rcp_238": "RCP_238",
  "rcp_240": "RCP_240",
  "rcp_241": "RCP_241",
  "rcp_242": "RCP_242",
  "rcp_244": "RCP_244",
  "rcp_246": "RCP_246",
  "rcp_248": "RCP_248",
  "rcp_250": "RCP_250",
  "rcp_252": "RCP_252",
  "rcp_254": "RCP_254",
  "rcp_263": "RCP_263",
  "rcp_264": "RCP_264",
  "rcp_265": "RCP_265",
  "rcp_266": "RCP_266",
  "rcp_267": "RCP_267",
  "rcp_270": "RCP_270",
  "rcp_271": "RCP_271",
  "rcp_272": "RCP_272",
  "rcp_273": "RCP_273",
  "rcp_276": "RCP_276",
  "rcp_280": "RCP_280",
  "rcp_285": "RCP_285"
};
const XIUXIAN_CANONICAL_TO_RECIPE_KEY = {};
Object.entries(XIUXIAN_RECIPE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_RECIPE_KEY[v] = k; });

const XIUXIAN_FACILITY_RULE_CANONICAL_IDS = {
  "frl_001": "FRL_001",
  "frl_002": "FRL_002",
  "frl_003": "FRL_003",
  "frl_004": "FRL_004",
  "frl_005": "FRL_005",
  "frl_006": "FRL_006",
  "frl_007": "FRL_007",
  "frl_008": "FRL_008",
  "frl_009": "FRL_009",
  "frl_010": "FRL_010",
  "frl_011": "FRL_011",
  "frl_012": "FRL_012",
  "frl_013": "FRL_013",
  "frl_014": "FRL_014",
  "frl_015": "FRL_015",
  "frl_016": "FRL_016",
  "frl_017": "FRL_017",
  "frl_018": "FRL_018",
  "frl_019": "FRL_019",
  "frl_020": "FRL_020",
  "frl_021": "FRL_021",
  "frl_022": "FRL_022",
  "frl_023": "FRL_023",
  "frl_024": "FRL_024",
  "frl_025": "FRL_025",
  "frl_026": "FRL_026",
  "frl_027": "FRL_027",
  "frl_028": "FRL_028",
  "frl_029": "FRL_029",
  "frl_030": "FRL_030",
  "frl_031": "FRL_031",
  "frl_032": "FRL_032",
  "frl_033": "FRL_033",
  "frl_034": "FRL_034",
  "frl_035": "FRL_035",
  "frl_036": "FRL_036",
  "frl_037": "FRL_037",
  "frl_038": "FRL_038",
  "frl_039": "FRL_039",
  "frl_040": "FRL_040",
  "frl_041": "FRL_041",
  "frl_042": "FRL_042",
  "frl_043": "FRL_043",
  "frl_044": "FRL_044",
  "frl_045": "FRL_045",
  "frl_046": "FRL_046",
  "frl_047": "FRL_047",
  "frl_048": "FRL_048",
  "frl_049": "FRL_049",
  "frl_050": "FRL_050",
  "frl_051": "FRL_051",
  "frl_052": "FRL_052"
};
const XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY = {};
Object.entries(XIUXIAN_FACILITY_RULE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY[v] = k; });
Object.entries(XIUXIAN_FACILITY_RULES).forEach(([k, v]) => { if (v.canonicalId) XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY[v.canonicalId] = k; });

const XIUXIAN_BUILDING_CANONICAL_IDS = {
  "foundation_1x1": "BD_102",
  "foundation_pillar": "BD_103",
  "foundation_2x2": "BD_104",
  "foundation_3x3": "BD_105",
  "foundation_beam": "BD_106",
  "foundation_roof": "BD_107",
  "bd_108": "BD_108",
  "bd_109": "BD_109",
  "bd_112": "BD_112",
  "storage_box": "BD_113",
  "bd_114": "BD_114",
  "bd_115": "BD_115",
  "conveyor": "BD_116",
  "bd_117": "BD_117",
  "bd_118": "BD_118",
  "bd_119": "BD_119",
  "bd_120": "BD_120",
  "vert_conveyor": "BD_121",
  "bd_122": "BD_122",
  "merger": "BD_123",
  "splitter": "BD_124",
  "bd_125": "BD_125",
  "bd_126": "BD_126",
  "conveyor_limiter": "BD_127",
  "pipe": "BD_128",
  "bd_129": "BD_129",
  "bd_130": "BD_130",
  "bd_131": "BD_131",
  "bd_132": "BD_132",
  "bd_133": "BD_133",
  "pump": "BD_134",
  "miner": "BD_135",
  "furnace": "BD_136",
  "crusher": "BD_137",
  "assembler": "BD_138",
  "cutter": "BD_139",
  "deconstructor": "BD_140",
  "petri_dish": "BD_141",
  "incubator": "BD_142",
  "mixer": "BD_143",
  "centrifuge": "BD_144",
  "extractor": "BD_145",
  "assembler_heavy": "BD_146",
  "power_engine": "BD_147",
  "smelt_chamber": "BD_148",
  "fuel_generator": "BD_149",
  "purifier": "BD_150",
  "teleporter": "BD_151",
  "handcraft": "BD_152",
  "storage_desk": "BD_153",
  "bd_154": "BD_154",
  "wind_generator": "BD_155",
  "alchemy_table": "BD_156",
  "tribulation_table": "BD_157",
  "fluid_hub": "BD_158",
  "bio_base": "BD_159",
  "bd_160": "BD_160",
  "bd_161": "BD_161",
  "bd_162": "BD_162",
  "bd_163": "BD_163",
  "wood_nursery": "BD_164",
  "fluid_tank": "BD_165",
  "waste_incinerator": "BD_166",
  "printer": "BD_167",
  "beast_pen": "BD_168",
  "sky_rail": "BD_169",
  "sky_merger": "BD_170",
  "sky_splitter": "BD_171",
  "sky_launcher": "BD_172",
  "sky_loader": "BD_173",
  "sky_unloader": "BD_174",
  "sky_transfer": "BD_175",
  "sky_receiver": "BD_176",
  "belt_sprayer": "BD_177",
  "void_crucible": "BD_178",
  "research_altar": "BD_179",
  "conveyor_mk2": "BD_180",
  "belt_stacker": "BD_181",
  "conveyor_mk3": "BD_182",
  "heavy_miner": "BD_183",
  "sky_extractor": "BD_184",
  "furnace_mk2": "BD_185",
  "omni_assembler": "BD_186",
  "alchemy_furnace_mk2": "BD_187",
  "entropy_smelter": "BD_188",
  "recomposer_mk3": "BD_189",
  "battle_base": "BD_190",
  "thunder_turret": "BD_191",
  "fusion_reactor": "BD_192",
  "artificial_sun": "BD_193",
  "particle_collider": "BD_194",
  "banner_ejector": "BD_195",
  "ascension_silo": "BD_196",
  "immortal_receiver": "BD_197",
  "crane_distributor": "BD_198",
  "sword_catapult": "BD_199",
  "lotus_catcher": "BD_200",
  "immortal_roof": "BD_201",
  "cloud_corridor": "BD_202",
  "floating_platform": "BD_203",
  "thunder_accumulator": "BD_204",
  "immortal_herb_garden": "BD_205",
  "beast_immortal_pool": "BD_206"
};
const XIUXIAN_CANONICAL_TO_BUILDING_KEY = {};
Object.entries(XIUXIAN_BUILDING_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_BUILDING_KEY[v] = k; });

const XIUXIAN_MILESTONES = XIUXIAN_STAGES;

if (typeof window !== "undefined") {
  window.XIUXIAN_ITEMS = XIUXIAN_ITEMS;
  window.XIUXIAN_BUILDINGS = XIUXIAN_BUILDINGS;
  window.XIUXIAN_RECIPES = XIUXIAN_RECIPES;
  window.XIUXIAN_FACILITY_RULES = XIUXIAN_FACILITY_RULES;
  window.XIUXIAN_RELIC_SCROLLS = XIUXIAN_RELIC_SCROLLS;
  window.XIUXIAN_UE5_BUILDING_MERGES = XIUXIAN_UE5_BUILDING_MERGES;
  window.XIUXIAN_FABAOS = XIUXIAN_FABAOS;
  window.XIUXIAN_MAP_POIS = XIUXIAN_MAP_POIS;
  window.XIUXIAN_RECIPE_CANONICAL_IDS = XIUXIAN_RECIPE_CANONICAL_IDS;
  window.XIUXIAN_CANONICAL_TO_RECIPE_KEY = XIUXIAN_CANONICAL_TO_RECIPE_KEY;
  window.XIUXIAN_FACILITY_RULE_CANONICAL_IDS = XIUXIAN_FACILITY_RULE_CANONICAL_IDS;
  window.XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY = XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY;
  window.XIUXIAN_BUILDING_CANONICAL_IDS = XIUXIAN_BUILDING_CANONICAL_IDS;
  window.XIUXIAN_CANONICAL_TO_BUILDING_KEY = XIUXIAN_CANONICAL_TO_BUILDING_KEY;
  window.XIUXIAN_TIERS = XIUXIAN_TIERS;
  window.XIUXIAN_STAGES = XIUXIAN_STAGES;
  window.XIUXIAN_MILESTONES = XIUXIAN_MILESTONES;
  window.INITIAL_PLAYER_INVENTORY = INITIAL_PLAYER_INVENTORY;
}

if (typeof module !== "undefined") {
  module.exports = { XIUXIAN_ITEMS, XIUXIAN_BUILDINGS, XIUXIAN_RECIPES, XIUXIAN_FACILITY_RULES, XIUXIAN_RELIC_SCROLLS, XIUXIAN_UE5_BUILDING_MERGES, XIUXIAN_FABAOS, XIUXIAN_MAP_POIS, XIUXIAN_RECIPE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_RECIPE_KEY, XIUXIAN_FACILITY_RULE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY, XIUXIAN_BUILDING_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_BUILDING_KEY, XIUXIAN_TIERS, XIUXIAN_STAGES, XIUXIAN_MILESTONES, INITIAL_PLAYER_INVENTORY };
}
