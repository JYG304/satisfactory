// ==========================================================================
// 《修仙工厂》官方策划数据表 (由 02_数值与配置数据表/ 三表自动同步生成)
// 数据来源: item_table.xlsx | bd_table.xlsx | recipe_table.xlsx
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
    "desc": "制作耐火炉芯、铁管、机壳、传动轴和灵磁齿轮。",
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
    "desc": "建造底座、支撑、铁架、风力发电机和渡劫台等重型结构。",
    "stack": 100
  },
  "mat_012": {
    "id": "mat_012",
    "matId": "MAT_012",
    "name": "阀门",
    "category": "机械与管路零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由加工台用铁管和电路板制作。",
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
    "desc": "制作高压电容、超频插件和飞剑防御塔、风力发电机等电力设备。",
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
    "desc": "制作中控芯片、灵根芯和跨区传送门的生物电子芯片。",
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
    "desc": "用于培养仓培育人造经脉与灵根座，或调制稳定液与凝丹液。",
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
    "obtainDesc": "首次在地图采集获得；培养皿培育灵草时可循环返还。",
    "desc": "培养皿种植成熟灵草和煞气灵草的种子，收获后可循环使用。",
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
    "obtainDesc": "由离心机分离液态煞气，或培养仓培育灵根与生丹时副产。",
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
    "name": "超频插件",
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
    "desc": "灵根芯、法宝胚以及回收处理塔共用的活体结构板。",
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
    "obtainDesc": "由加工台用铁架和玄铁齿轮制作；也可在操作台启动制作。",
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
    "name": "铁管",
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
    "obtainDesc": "由加工台用铁管和电路板制作。",
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
    "obtainDesc": "可通过砍伐树木获得。",
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
    "obtainDesc": "由组装机用灵根座、主控核心和精元液激活获得。",
    "desc": "筑基期主线终局交付物，也是金丹期培养生丹的基础灵根母体。",
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
    "desc": "建造组装机以及制作超频插件的控制组件。",
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
    "name": "灵根芯",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用生物芯片、骨板和精元液组装获得。",
    "desc": "送入培养仓与动力核心、精元液共同培育灵根座。",
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
    "desc": "送入培养仓与灵根芯融合培育灵根座。",
    "stack": 50
  },
  "mat_058": {
    "id": "mat_058",
    "matId": "MAT_058",
    "name": "主控核心",
    "category": "电力与控制零件",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由组装机用超频插件和净化核心组装获得。",
    "desc": "用于组装人造灵根，以及在渡劫台凝练人造金丹的主控中枢。",
    "stack": 50
  },
  "mat_059": {
    "id": "mat_059",
    "matId": "MAT_059",
    "name": "灵根座",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养仓输入灵根芯、动力核心和精元液培育获得（副产煞水）。",
    "desc": "送入组装机用主控核心与精元液激活为人造灵根。",
    "stack": 50
  },
  "mat_060": {
    "id": "mat_060",
    "matId": "MAT_060",
    "name": "铁架",
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
    "desc": "由切割机切割为煞气片。",
    "stack": 100
  },
  "mat_069": {
    "id": "mat_069",
    "matId": "MAT_069",
    "name": "煞气片",
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
    "obtainDesc": "由组装机用骨板、煞气片和稳定液组装获得。",
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
    "obtainDesc": "由组装机用煞气片和煞气结晶制作。",
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
    "desc": "蕴含金丹法则的生物碎核，是培养仓孕育生丹的核心母本。",
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
    "desc": "供培养仓孕育生丹的顶级营养液。",
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
    "name": "生丹",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由培养仓输入人造灵根、金丹碎片和凝丹液活体培育获得。",
    "desc": "已完成肉身与灵根融合的生丹，送入渡劫台进行最终雷劫凝丹。",
    "stack": 50
  },
  "mat_085": {
    "id": "mat_085",
    "matId": "MAT_085",
    "name": "人造金丹",
    "category": "灵根、法宝与金丹核心",
    "form": "实体",
    "icon": "fa-solid fa-cube text-stone-300",
    "obtainDesc": "由渡劫台输入生丹、主控核心和人造灵石渡劫获得。",
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "提供1×1的基础建造面，用于搭建厂房和承托上层建筑。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 2
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "提供1×1、4m高的立体支撑和建造面，用于抬高或连接多层结构。",
    "group": "struct",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      },
      {
        "code": "MAT_014",
        "need": 4
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [],
    "desc": "提供2×2的基础建造面，适合铺设中小型设备和上层结构。",
    "group": "struct",
    "costs": [
      {
        "code": "bd_102",
        "need": 16
      },
      {
        "code": "MAT_014",
        "need": 8
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [],
    "desc": "提供3×3的基础建造面，适合承托较大型设备或多格建筑。",
    "group": "struct",
    "costs": [
      {
        "code": "bd_102",
        "need": 16
      },
      {
        "code": "MAT_014",
        "need": 12
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [],
    "desc": "提供1×4的条形建造面，用于搭梁、连桥或支撑长条区域。",
    "group": "struct",
    "costs": [
      {
        "code": "bd_102",
        "need": 16
      },
      {
        "code": "MAT_014",
        "need": 16
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_139",
    "recipes": [],
    "desc": "提供2×2的薄型顶板，可快速铺设平台并作为上层建筑基面。",
    "group": "struct",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_014",
        "need": 32
      },
      {
        "code": "MAT_067",
        "need": 8
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [],
    "desc": "连接相邻高差的短楼梯，方便角色在不同高度的平台间通行。",
    "group": "struct",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [],
    "desc": "连接较大高差的长楼梯，适合多层平台之间的通行。",
    "group": "struct",
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
    ]
  },
  "bd_112": {
    "id": "bd_112",
    "code": "BD_112",
    "formalId": "BD_112",
    "name": "支撑",
    "category": "结构",
    "typeDesc": "结构 / 建造",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 5,
    "topStackable": true,
    "rotStep": 0,
    "power": 0,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "竖直支撑结构，用于把上层平台落地支撑并连接不同高度的结构面。",
    "group": "struct",
    "costs": [
      {
        "code": "MAT_014",
        "need": 2
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "小型固体储存箱，可暂存并通过物流端口输入、输出物料，容量16格。",
    "group": "org",
    "costs": [
      {
        "code": "MAT_008",
        "need": 4
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_138",
    "recipes": [],
    "desc": "窄型储藏柜，可暂存固体物料并接入物流端口，容量32格。",
    "group": "storage",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_138",
    "recipes": [],
    "desc": "宽型储藏柜，可暂存固体物料并接入物流端口，容量32格。",
    "group": "storage",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "顺时针转向的弯道传送带，用于改变固体物料的运输方向。",
    "group": "logistics",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "逆时针转向的弯道传送带，用于改变固体物料的运输方向。",
    "group": "logistics",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "向上抬升的传送带，用于把物料送到更高的平台。",
    "group": "logistics",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "向下输送的传送带，用于把物料送到更低的平台。",
    "group": "logistics",
    "costs": [
      {
        "code": "MAT_008",
        "need": 2
      },
      {
        "code": "MAT_011",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "交叉传送节点，让两条物流线路交叉通过，互不合并。",
    "group": "logistics",
    "costs": [
      {
        "code": "bd_116",
        "need": 2
      },
      {
        "code": "mat_049",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
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
    ]
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
    "power": 7,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_127",
    "recipes": [],
    "desc": "带智能调度的合流器，可协调两路输入并减少线路堵塞。",
    "group": "logistics",
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
    ]
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
    "power": 7,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_127",
    "recipes": [],
    "desc": "带智能分配的分流器，可按设定规则把物料分配到多条输出线。",
    "group": "logistics",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_116",
    "recipes": [],
    "desc": "限制传送带物流速度的控制节点，用于平衡产线节拍并减少堵塞。",
    "group": "prod",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "直线水管，用于连接流体设备并输送液体。",
    "group": "logi",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ]
  },
  "bd_129": {
    "id": "bd_129",
    "code": "BD_129",
    "formalId": "BD_129",
    "name": "水管｜上弯",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "向上转向的水管，用于改变液体管路方向或高度。",
    "group": "logistics",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ]
  },
  "bd_130": {
    "id": "bd_130",
    "code": "BD_130",
    "formalId": "BD_130",
    "name": "水管｜左弯",
    "category": "管道",
    "typeDesc": "管道 / 液体",
    "dimX": 1,
    "dimY": 1,
    "dimZ": 1,
    "topStackable": false,
    "rotStep": 90,
    "power": 0,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "向左转向的水管，用于改变液体管路方向。",
    "group": "logistics",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "带侧向接口的水管，用于从侧面接入或引出液体管路。",
    "group": "logistics",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "带顶部接口的水管，用于从上方接入或引出液体管路。",
    "group": "logistics",
    "costs": [
      {
        "code": "mat_042",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "FluidPort_01@液体@双向",
    "outputPorts": "FluidPort_02@液体@双向；FluidPort_03@液体@双向",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "三通水管，提供三个液体接口，便于分流或汇流。",
    "group": "logistics",
    "costs": [
      {
        "code": "mat_042",
        "need": 2
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_WaterNode_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3（流体生物）",
    "recipes": [
      "rcp_078",
      "rcp_118",
      "rcp_119"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_OreNode_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_138",
    "recipes": [
      "rcp_079",
      "rcp_080",
      "rcp_081",
      "rcp_120",
      "rcp_121"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（起始节点）",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2（基础加工）",
    "recipes": [
      "rcp_005",
      "rcp_006",
      "rcp_007",
      "rcp_029",
      "rcp_030",
      "rcp_031",
      "rcp_032",
      "rcp_033",
      "rcp_034",
      "rcp_035",
      "rcp_036",
      "rcp_037",
      "rcp_040",
      "rcp_041",
      "rcp_042",
      "rcp_043",
      "rcp_046",
      "rcp_049",
      "rcp_054",
      "rcp_055",
      "rcp_056",
      "rcp_057",
      "rcp_058",
      "rcp_069",
      "rcp_088",
      "rcp_110",
      "rcp_111",
      "rcp_112",
      "rcp_113",
      "rcp_115",
      "rcp_130",
      "rcp_132",
      "rcp_139",
      "rcp_140",
      "rcp_141",
      "rcp_142",
      "rcp_143",
      "rcp_144",
      "rcp_145",
      "rcp_146",
      "rcp_147",
      "rcp_158",
      "rcp_159",
      "rcp_162"
    ],
    "desc": "加工基础材料，制作建筑板材、齿轮、电路板、管件、外壳与初级剑丸等常用组件。",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_137+BD_138",
    "recipes": [
      "rcp_008",
      "rcp_009",
      "rcp_010",
      "rcp_011",
      "rcp_012",
      "rcp_129"
    ],
    "desc": "切割和精加工材料，制作铜片、线材、芯片等精密零件。",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3（流体生物）",
    "recipes": [
      "rcp_084",
      "rcp_085",
      "rcp_086",
      "rcp_087",
      "rcp_182",
      "rcp_183",
      "rcp_184"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> MAT_024+BD_145",
    "recipes": [
      "rcp_013",
      "rcp_022",
      "rcp_094",
      "rcp_095",
      "rcp_114",
      "rcp_151",
      "rcp_152"
    ],
    "desc": "培养生物样本，将固体样本和营养液转化为新的生物产物。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_021",
        "need": 2
      },
      {
        "code": "MAT_008",
        "need": 1
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> MAT_024+BD_141",
    "recipes": [
      "rcp_014",
      "rcp_024",
      "rcp_048",
      "rcp_053",
      "rcp_096",
      "rcp_180",
      "rcp_181"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口；In_Fluid_02@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [
      "rcp_015",
      "rcp_016",
      "rcp_017",
      "rcp_018",
      "rcp_019",
      "rcp_020",
      "rcp_138"
    ],
    "desc": "混合多种液体，按配方制备新的流体。",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Fluid_01@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> MAT_029+BD_145",
    "recipes": [
      "rcp_021",
      "rcp_023",
      "rcp_122",
      "rcp_123",
      "rcp_133"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Fluid_02@液体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3 -> BD_140+BD_134",
    "recipes": [
      "rcp_025",
      "rcp_026",
      "rcp_027",
      "rcp_028",
      "rcp_099",
      "rcp_124",
      "rcp_134",
      "rcp_135",
      "rcp_167",
      "rcp_177",
      "rcp_191"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV · GATE_4（高温总装）",
    "recipes": [
      "rcp_038",
      "rcp_039",
      "rcp_044",
      "rcp_045",
      "rcp_047",
      "rcp_050",
      "rcp_051",
      "rcp_052",
      "rcp_059",
      "rcp_089",
      "rcp_090",
      "rcp_148",
      "rcp_154",
      "rcp_155",
      "rcp_156",
      "rcp_157",
      "rcp_160",
      "rcp_161",
      "rcp_164",
      "rcp_168",
      "rcp_169",
      "rcp_170",
      "rcp_171",
      "rcp_172",
      "rcp_173",
      "rcp_190"
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
    ]
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
    "heat": 50,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "ThermalSlot_01@1,1,2：2x1",
    "unlockCondition": "阶段V · GATE_5（金丹炼丹）",
    "recipes": [
      "rcp_083",
      "rcp_125",
      "rcp_126"
    ],
    "desc": "灵力引擎的下部组件，燃烧煤炭、燃油或燃料棒发电并向顶部冶炼舱或炼丹炉供热。",
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
        "code": "mat_046",
        "need": 1
      },
      {
        "code": "MAT_019",
        "need": 8
      },
      {
        "code": "MAT_043",
        "need": 5
      }
    ]
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
    "topStackable": false,
    "rotStep": 90,
    "power": 65,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV · GATE_4（高温总装）",
    "recipes": [
      "rcp_060",
      "rcp_061",
      "rcp_062",
      "rcp_063",
      "rcp_100",
      "rcp_136",
      "rcp_137",
      "rcp_149",
      "rcp_150",
      "rcp_163",
      "rcp_174"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（预置）",
    "recipes": [
      "rcp_064",
      "rcp_065",
      "rcp_082"
    ],
    "desc": "燃烧固体燃料发电，为周围建筑提供电力。",
    "group": "prod",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段IV · GATE_4 -> BD_148+BD_144",
    "recipes": [
      "rcp_066",
      "rcp_067",
      "rcp_068",
      "rcp_070",
      "rcp_153",
      "rcp_165"
    ],
    "desc": "处理生产废液和固体残渣，分离并回收可用材料。",
    "group": "prod",
    "costs": [
      {
        "code": "mat_040",
        "need": 15
      },
      {
        "code": "mat_044",
        "need": 3
      },
      {
        "code": "mat_045",
        "need": 1
      },
      {
        "code": "mat_055",
        "need": 1
      },
      {
        "code": "mat_038",
        "need": 2
      },
      {
        "code": "MAT_051",
        "need": 4
      },
      {
        "code": "MAT_019",
        "need": 8
      }
    ]
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
    "power": 140,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段V · GATE_5 -> BD_147",
    "recipes": [],
    "desc": "连接不同区域的物流传送门；建成后需要与另一座传送门设置配对。",
    "group": "special",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（预置）",
    "recipes": [
      "rcp_071",
      "rcp_072",
      "rcp_073",
      "rcp_074",
      "rcp_075",
      "rcp_076",
      "rcp_077",
      "rcp_104",
      "rcp_105"
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "小型置物桌，用于摆放或展示物品。",
    "group": "struct",
    "costs": [
      {
        "code": "MAT_052",
        "need": 4
      },
      {
        "code": "MAT_008",
        "need": 2
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段I · 起步冶炼（开局）",
    "recipes": [],
    "desc": "高型置物桌，适合摆放或展示较高的物品。",
    "group": "struct",
    "costs": [
      {
        "code": "MAT_052",
        "need": 16
      },
      {
        "code": "MAT_008",
        "need": 8
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "-",
    "outputPorts": "-",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_135",
    "recipes": [],
    "desc": "利用风场持续发电，为附近建筑提供电力；需要保持周围空间畅通。",
    "group": "prod",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "ArtifactSlot_01",
    "unlockCondition": "阶段IV · GATE_4 -> BD_146+BD_150",
    "recipes": [
      "rcp_101",
      "rcp_117",
      "rcp_185",
      "rcp_186",
      "rcp_187",
      "rcp_188",
      "rcp_189"
    ],
    "desc": "炼制和加工法宝的专用工作台，可安装法宝插件并输出成品。",
    "group": "prod",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Solid_03@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "ArtifactSlot_01",
    "unlockCondition": "阶段VI · GATE_6（金丹渡劫）",
    "recipes": [
      "rcp_102",
      "rcp_103",
      "rcp_192"
    ],
    "desc": "终局渡劫设施，需通入重水冷却并加装铅板/橡胶防雷，凝练人造金丹。",
    "group": "prod",
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
        "code": "MAT_014",
        "need": 12
      },
      {
        "code": "mat_065",
        "need": 6
      },
      {
        "code": "mat_066",
        "need": 3
      },
      {
        "code": "mat_105",
        "need": 8
      },
      {
        "code": "mat_097",
        "need": 6
      }
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口；In_Fluid_02@液体@入口；In_Fluid_03@液体@入口；In_Fluid_04@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口；Out_Fluid_02@液体@出口；Out_Fluid_03@液体@出口；Out_Fluid_04@液体@出口",
    "pluginSlot": "Slot_01@0,2,1：2x2;Slot_02@0,0,1：2x2",
    "unlockCondition": "阶段III · GATE_3 -> BD_134",
    "recipes": [],
    "desc": "集中处理和分配液体，为流体插件提供共享接口和插件安装位。",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Fluid_01@液体@入口",
    "outputPorts": "Out_Fluid_01@液体@出口",
    "pluginSlot": "Slot_01@0,0,1：1x1",
    "unlockCondition": "阶段III · GATE_3 -> BD_141",
    "recipes": [],
    "desc": "承载培养皿或培养仓的生物基座，为培养过程提供共享液体营养接口。",
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
    ]
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
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段III · GATE_3（飞剑防御）",
    "recipes": [
      "rcp_091",
      "rcp_092",
      "rcp_093"
    ],
    "desc": "自动发射剑丸迎击攻山修士的防御阵塔，击杀后自动收集修士尸体并通过出口送入物流线。",
    "group": "prod",
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
    ]
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
    "power": 7,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_127",
    "recipes": [],
    "desc": "带智能调度的合流器，可协调两路输入并减少线路堵塞。",
    "group": "logistics",
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
    ]
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
    "power": 7,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口；Out_Solid_03@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段II · GATE_2 -> BD_127",
    "recipes": [],
    "desc": "带智能分配的分流器，可按设定规则把物料分配到多条输出线。",
    "group": "logistics",
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
    ]
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
    "topStackable": false,
    "rotStep": 90,
    "power": 40,
    "powerGen": 0,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "inputPorts": "In_Solid_01@固体@入口；In_Solid_02@固体@入口；In_Fluid_01@液体@入口",
    "outputPorts": "Out_Solid_01@固体@出口；Out_Solid_02@固体@出口",
    "pluginSlot": "无",
    "unlockCondition": "阶段V · GATE_5 -> BD_147",
    "recipes": [
      "rcp_097",
      "rcp_098",
      "rcp_116",
      "rcp_166",
      "rcp_175",
      "rcp_176",
      "rcp_178",
      "rcp_179"
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
    ]
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
    "desc": "精炼炉 生产 玄铁锭（耗时 10s）"
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
    "desc": "精炼炉 生产 赤铜锭（耗时 10s）"
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
    "desc": "精炼炉 生产 耐火炉芯（耗时 30s）"
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
    "desc": "粉碎机 生产 玄铁粉（耗时 12s）"
  },
  "rcp_005": {
    "id": "rcp_005",
    "canonicalId": "RCP_005",
    "name": "玄铁板",
    "category": "金属材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 8,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 15.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_008",
      "amount": 3,
      "ratePerMin": 22.5,
      "name": "玄铁板"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 15.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_008",
        "count": 3,
        "rate": 22.5
      }
    ],
    "desc": "加工台 生产 玄铁板（耗时 8s）"
  },
  "rcp_006": {
    "id": "rcp_006",
    "canonicalId": "RCP_006",
    "name": "玄铁齿轮",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 8,
    "power": 10,
    "input": {
      "item": "MAT_006",
      "amount": 2,
      "ratePerMin": 15.0,
      "name": "玄铁锭"
    },
    "output": {
      "item": "MAT_011",
      "amount": 1,
      "ratePerMin": 7.5,
      "name": "玄铁齿轮"
    },
    "inputs": [
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 15.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_011",
        "count": 1,
        "rate": 7.5
      }
    ],
    "desc": "加工台 生产 玄铁齿轮（耗时 8s）"
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
    "desc": "加工台 生产 玄铁梁（耗时 20s）"
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
    "desc": "切割机 生产 导灵铜片（耗时 10s）"
  },
  "rcp_009": {
    "id": "rcp_009",
    "canonicalId": "RCP_009",
    "name": "铜线",
    "category": "电力与控制零件",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 8,
    "power": 25,
    "input": {
      "item": "MAT_007",
      "amount": 1,
      "ratePerMin": 7.5,
      "name": "赤铜锭"
    },
    "output": {
      "item": "MAT_019",
      "amount": 5,
      "ratePerMin": 37.5,
      "name": "铜线"
    },
    "inputs": [
      {
        "item": "MAT_007",
        "count": 1,
        "rate": 7.5,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_019",
        "count": 5,
        "rate": 37.5
      }
    ],
    "desc": "切割机 生产 铜线（耗时 8s）"
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
    "desc": "切割机 生产 木板（耗时 15s）"
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
    "desc": "切割机 生产 木架（耗时 20s）"
  },
  "rcp_012": {
    "id": "rcp_012",
    "canonicalId": "RCP_012",
    "name": "煞气片",
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
      "name": "煞气片"
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
    "desc": "切割机 生产 煞气片（耗时 20s）"
  },
  "rcp_013": {
    "id": "rcp_013",
    "canonicalId": "RCP_013",
    "name": "成熟灵草",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 60,
    "power": 10,
    "input": {
      "item": "MAT_028",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵草种子"
    },
    "output": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
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
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "培养皿 生产 成熟灵草（耗时 60s）"
  },
  "rcp_014": {
    "id": "rcp_014",
    "canonicalId": "RCP_014",
    "name": "血胎",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 45,
    "power": 35,
    "input": {
      "item": "mat_027",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "血膏"
    },
    "output": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_027",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "培养仓 生产 血胎（耗时 45s）"
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
    "desc": "搅拌机 生产 培养液（清水+蛋白液）（耗时 20s）"
  },
  "rcp_016": {
    "id": "rcp_016",
    "canonicalId": "RCP_016",
    "name": "培养液（清水+灵草液）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_033",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "清水"
    },
    "output": {
      "item": "MAT_027",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "培养液"
    },
    "inputs": [
      {
        "item": "MAT_033",
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
        "item": "MAT_027",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "搅拌机 生产 培养液（清水+灵草液）（耗时 20s）"
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
    "desc": "搅拌机 生产 培养液（回用水+蛋白液）（耗时 20s）"
  },
  "rcp_018": {
    "id": "rcp_018",
    "canonicalId": "RCP_018",
    "name": "培养液（回用水+灵草液）",
    "category": "生物液体与培养物",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_038",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "净化水"
    },
    "output": {
      "item": "MAT_027",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "培养液"
    },
    "inputs": [
      {
        "item": "MAT_038",
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
        "item": "MAT_027",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "搅拌机 生产 培养液（回用水+灵草液）（耗时 20s）"
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
    "desc": "搅拌机 生产 原浆（耗时 20s）"
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
    "desc": "搅拌机 生产 稳定液（耗时 30s）"
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
    "desc": "离心机 生产 精元液（耗时 30s）"
  },
  "rcp_022": {
    "id": "rcp_022",
    "canonicalId": "RCP_022",
    "name": "灵草灰肥催熟",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 45,
    "power": 10,
    "input": {
      "item": "MAT_028",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "灵草种子"
    },
    "output": {
      "item": "MAT_029",
      "amount": 3,
      "ratePerMin": 4.0,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 3,
        "rate": 4.0
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "培养皿 生产 灵草灰肥催熟（耗时 45s）"
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
    "desc": "离心机 生产 煞气分离（耗时 60s）"
  },
  "rcp_024": {
    "id": "rcp_024",
    "canonicalId": "RCP_024",
    "name": "高效肉块培养",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 45,
    "power": 35,
    "input": {
      "item": "mat_027",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "血膏"
    },
    "output": {
      "item": "mat_032",
      "amount": 3,
      "ratePerMin": 4.0,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_027",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_029",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 3,
        "rate": 4.0
      }
    ],
    "desc": "培养仓 生产 高效肉块培养（耗时 45s）"
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
    "desc": "提取器 生产 蛋白液（清水）（耗时 30s）"
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
    "desc": "提取器 生产 蛋白液（回用水）（耗时 30s）"
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
    "desc": "提取器 生产 灵草液（清水）（耗时 30s）"
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
    "desc": "提取器 生产 灵草液（回用水）（耗时 30s）"
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
    "desc": "加工台 生产 生物滤芯（液固）（耗时 20s）"
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
    "desc": "加工台 生产 灵磁齿轮（耗时 10s）"
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
      "name": "铁管"
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
    "desc": "加工台 生产 阀门（耗时 20s）"
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
    "desc": "加工台 生产 电磁线圈（耗时 20s）"
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
    "desc": "加工台 生产 电路板（耗时 20s）"
  },
  "rcp_034": {
    "id": "rcp_034",
    "canonicalId": "RCP_034",
    "name": "生物芯片",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
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
    "desc": "加工台 生产 生物芯片（耗时 30s）"
  },
  "rcp_035": {
    "id": "rcp_035",
    "canonicalId": "RCP_035",
    "name": "净化剂（蛋白液）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
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
    "desc": "加工台 生产 净化剂（蛋白液）（耗时 20s）"
  },
  "rcp_036": {
    "id": "rcp_036",
    "canonicalId": "RCP_036",
    "name": "净化剂（肉泥）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_009",
      "amount": 1,
      "ratePerMin": 3.0,
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
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_027",
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
    "desc": "加工台 生产 净化剂（肉泥）（耗时 20s）"
  },
  "rcp_037": {
    "id": "rcp_037",
    "canonicalId": "RCP_037",
    "name": "净化剂（残渣）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "滤渣"
    },
    "output": {
      "item": "MAT_037",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "MAT_040",
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
    "desc": "加工台 生产 净化剂（残渣）（耗时 20s）"
  },
  "rcp_038": {
    "id": "rcp_038",
    "canonicalId": "RCP_038",
    "name": "超频插件",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 45,
    "power": 50,
    "input": {
      "item": "mat_054",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "中控芯片"
    },
    "output": {
      "item": "mat_037",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "超频插件"
    },
    "inputs": [
      {
        "item": "mat_054",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_013",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_037",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "组装机 生产 超频插件（耗时 45s）"
  },
  "rcp_039": {
    "id": "rcp_039",
    "canonicalId": "RCP_039",
    "name": "骨板",
    "category": "生物液体与培养物",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 45,
    "power": 50,
    "input": {
      "item": "mat_053",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "人造经脉"
    },
    "output": {
      "item": "mat_038",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "骨板"
    },
    "inputs": [
      {
        "item": "mat_053",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_038",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "组装机 生产 骨板（耗时 45s）"
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
      "name": "铁架"
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
    "desc": "加工台 生产 机壳（耗时 30s）"
  },
  "rcp_041": {
    "id": "rcp_041",
    "canonicalId": "RCP_041",
    "name": "铁管",
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
      "name": "铁管"
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
    "desc": "加工台 生产 铁管（耗时 15s）"
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
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "铁管"
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
        "item": "MAT_047",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 循环水泵（耗时 30s）"
  },
  "rcp_043": {
    "id": "rcp_043",
    "canonicalId": "RCP_043",
    "name": "生物滤芯（骨肉）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_021",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "骸骨"
    },
    "output": {
      "item": "mat_044",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "生物滤芯"
    },
    "inputs": [
      {
        "item": "mat_021",
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
        "item": "mat_044",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "加工台 生产 生物滤芯（骨肉）（耗时 30s）"
  },
  "rcp_044": {
    "id": "rcp_044",
    "canonicalId": "RCP_044",
    "name": "净化核心",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 40,
    "power": 50,
    "input": {
      "item": "mat_055",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "复合滤芯"
    },
    "output": {
      "item": "mat_045",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "净化核心"
    },
    "inputs": [
      {
        "item": "mat_055",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_014",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_045",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "组装机 生产 净化核心（耗时 40s）"
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
    "desc": "组装机 生产 高压电容（耗时 60s）"
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
    "desc": "加工台 生产 传动带（耗时 30s）"
  },
  "rcp_047": {
    "id": "rcp_047",
    "canonicalId": "RCP_047",
    "name": "人造灵根",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 120,
    "power": 50,
    "input": {
      "item": "mat_059",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "灵根座"
    },
    "output": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "人造灵根"
    },
    "inputs": [
      {
        "item": "mat_059",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_058",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 0.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 0.5
      }
    ],
    "desc": "组装机 生产 人造灵根（耗时 120s）"
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
    "desc": "培养仓 生产 人造经脉（耗时 30s）"
  },
  "rcp_049": {
    "id": "rcp_049",
    "canonicalId": "RCP_049",
    "name": "中控芯片",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
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
    "desc": "加工台 生产 中控芯片（耗时 30s）"
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
    "desc": "组装机 生产 复合滤芯（耗时 30s）"
  },
  "rcp_051": {
    "id": "rcp_051",
    "canonicalId": "RCP_051",
    "name": "灵根芯",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 50,
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
      "name": "灵根芯"
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
    "desc": "组装机 生产 灵根芯（耗时 60s）"
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
      "name": "超频插件"
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
    "desc": "组装机 生产 主控核心（耗时 60s）"
  },
  "rcp_053": {
    "id": "rcp_053",
    "canonicalId": "RCP_053",
    "name": "灵根座",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 90,
    "power": 35,
    "input": {
      "item": "mat_056",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "灵根芯"
    },
    "output": {
      "item": "mat_059",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "灵根座"
    },
    "inputs": [
      {
        "item": "mat_056",
        "count": 1,
        "rate": 0.67,
        "form": "实体"
      },
      {
        "item": "mat_057",
        "count": 1,
        "rate": 0.67,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 0.67,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_059",
        "count": 1,
        "rate": 0.67
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 0.67
      }
    ],
    "desc": "培养仓 生产 灵根座（耗时 90s）"
  },
  "rcp_054": {
    "id": "rcp_054",
    "canonicalId": "RCP_054",
    "name": "铁架",
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
      "name": "铁架"
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
    "desc": "加工台 生产 铁架（耗时 20s）"
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
      "item": "MAT_011",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "玄铁齿轮"
    },
    "output": {
      "item": "mat_061",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "传动轴"
    },
    "inputs": [
      {
        "item": "MAT_011",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "MAT_008",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_061",
        "count": 1,
        "rate": 3.0
      }
    ],
    "desc": "加工台 生产 传动轴（耗时 20s）"
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
    "desc": "加工台 生产 电缆（耗时 20s）"
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
    "desc": "加工台 生产 灵能电池（耗时 30s）"
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
    "desc": "加工台 生产 探矿仪（耗时 30s）"
  },
  "rcp_059": {
    "id": "rcp_059",
    "canonicalId": "RCP_059",
    "name": "法宝胚",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 90,
    "power": 50,
    "input": {
      "item": "mat_038",
      "amount": 2,
      "ratePerMin": 1.33,
      "name": "骨板"
    },
    "output": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "法宝胚"
    },
    "inputs": [
      {
        "item": "mat_038",
        "count": 2,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_069",
        "count": 4,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 2,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 0.67
      }
    ],
    "desc": "组装机 生产 法宝胚（耗时 90s）"
  },
  "rcp_060": {
    "id": "rcp_060",
    "canonicalId": "RCP_060",
    "name": "高温合金锭",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 45,
    "power": 65,
    "input": {
      "item": "MAT_051",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "MAT_043",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_007",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "冶炼舱（上） 生产 高温合金锭（耗时 45s）"
  },
  "rcp_061": {
    "id": "rcp_061",
    "canonicalId": "RCP_061",
    "name": "精炼玄铁锭",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 65,
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
    "desc": "冶炼舱（上） 生产 精炼玄铁锭（耗时 30s）"
  },
  "rcp_062": {
    "id": "rcp_062",
    "canonicalId": "RCP_062",
    "name": "动力核心",
    "category": "电力与控制零件",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 60,
    "power": 65,
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
    "desc": "冶炼舱（上） 生产 动力核心（耗时 60s）"
  },
  "rcp_063": {
    "id": "rcp_063",
    "canonicalId": "RCP_063",
    "name": "煞气合金",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 45,
    "power": 65,
    "input": {
      "item": "MAT_051",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "mat_068",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "煞气合金"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_068",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "冶炼舱（上） 生产 煞气合金（耗时 45s）"
  },
  "rcp_064": {
    "id": "rcp_064",
    "canonicalId": "RCP_064",
    "name": "燃木发电",
    "category": "生物液体与培养物",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 225,
    "power": -100,
    "input": {
      "item": "MAT_052",
      "amount": 1,
      "ratePerMin": 0.27,
      "name": "原木"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 0.27,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_052",
        "count": 1,
        "rate": 0.27,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 0.27
      }
    ],
    "desc": "燃料发电机 生产 燃木发电（耗时 225s）"
  },
  "rcp_065": {
    "id": "rcp_065",
    "canonicalId": "RCP_065",
    "name": "木板发电",
    "category": "生物液体与培养物",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 45,
    "power": -100,
    "input": {
      "item": "MAT_066",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "木板"
    },
    "output": {
      "item": "MAT_068",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "木炭灰"
    },
    "inputs": [
      {
        "item": "MAT_066",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "燃料发电机 生产 木板发电（耗时 45s）"
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
    "desc": "回收处理塔 生产 生物废液净化（耗时 60s）"
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
    "desc": "回收处理塔 生产 煞气废液净化（耗时 60s）"
  },
  "rcp_068": {
    "id": "rcp_068",
    "canonicalId": "RCP_068",
    "name": "药渣提炼煞气",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 45,
    "power": 20,
    "input": {
      "item": "mat_079",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "药渣"
    },
    "output": {
      "item": "MAT_077",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "液态煞气"
    },
    "inputs": [
      {
        "item": "mat_079",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "回收处理塔 生产 药渣提炼煞气（耗时 45s）"
  },
  "rcp_069": {
    "id": "rcp_069",
    "canonicalId": "RCP_069",
    "name": "药渣再生净化粉",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
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
    "desc": "加工台 生产 药渣再生净化粉（耗时 20s）"
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
      "item": "MAT_037",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "净化剂"
    },
    "output": {
      "item": "MAT_077",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "液态煞气"
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
        "item": "MAT_077",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "回收处理塔 生产 液态煞气（耗时 60s）"
  },
  "rcp_071": {
    "id": "rcp_071",
    "canonicalId": "RCP_071",
    "name": "玄铁锭（手搓）",
    "category": "金属材料",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
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
    "desc": "操作台 生产 玄铁锭（手搓）（耗时 30s）"
  },
  "rcp_072": {
    "id": "rcp_072",
    "canonicalId": "RCP_072",
    "name": "玄铁板（手搓）",
    "category": "金属材料",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
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
    "desc": "操作台 生产 玄铁板（手搓）（耗时 30s）"
  },
  "rcp_073": {
    "id": "rcp_073",
    "canonicalId": "RCP_073",
    "name": "玄铁齿轮（手搓）",
    "category": "机械与管路零件",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
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
    "desc": "操作台 生产 玄铁齿轮（手搓）（耗时 30s）"
  },
  "rcp_074": {
    "id": "rcp_074",
    "canonicalId": "RCP_074",
    "name": "玄铁梁（手搓）",
    "category": "基础建材",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 60,
    "power": 5,
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
    "desc": "操作台 生产 玄铁梁（手搓）（耗时 60s）"
  },
  "rcp_075": {
    "id": "rcp_075",
    "canonicalId": "RCP_075",
    "name": "耐火炉芯（手搓）",
    "category": "机械与管路零件",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 60,
    "power": 5,
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
    "desc": "操作台 生产 耐火炉芯（手搓）（耗时 60s）"
  },
  "rcp_076": {
    "id": "rcp_076",
    "canonicalId": "RCP_076",
    "name": "电缆（手搓）",
    "category": "电力与控制零件",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 20,
    "power": 5,
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
    "desc": "操作台 生产 电缆（手搓）（耗时 20s）"
  },
  "rcp_077": {
    "id": "rcp_077",
    "canonicalId": "RCP_077",
    "name": "灵能电池（手搓）",
    "category": "电力与控制零件",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
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
    "desc": "操作台 生产 灵能电池（手搓）（耗时 30s）"
  },
  "rcp_078": {
    "id": "rcp_078",
    "canonicalId": "RCP_078",
    "name": "抽取清水",
    "category": "生物液体与培养物",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 60,
    "power": 10,
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "MAT_033",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "清水"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "MAT_033",
        "count": 1,
        "rate": 1.0
      }
    ],
    "desc": "抽水机 生产 抽取清水（耗时 60s）"
  },
  "rcp_079": {
    "id": "rcp_079",
    "canonicalId": "RCP_079",
    "name": "采集玄铁矿",
    "category": "矿物与燃料",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
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
    "desc": "采矿机 生产 采集玄铁矿（耗时 10s）"
  },
  "rcp_080": {
    "id": "rcp_080",
    "canonicalId": "RCP_080",
    "name": "采集赤铜矿",
    "category": "矿物与燃料",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
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
    "desc": "采矿机 生产 采集赤铜矿（耗时 10s）"
  },
  "rcp_081": {
    "id": "rcp_081",
    "canonicalId": "RCP_081",
    "name": "采集煤炭",
    "category": "矿物与燃料",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
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
    "desc": "采矿机 生产 采集煤炭（耗时 10s）"
  },
  "rcp_082": {
    "id": "rcp_082",
    "canonicalId": "RCP_082",
    "name": "煤炭发电",
    "category": "生物液体与培养物",
    "building": "fuel_generator",
    "buildingId": "fuel_generator",
    "timeSec": 60,
    "power": -100,
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
    "desc": "燃料发电机 生产 煤炭发电（耗时 60s）"
  },
  "rcp_083": {
    "id": "rcp_083",
    "canonicalId": "RCP_083",
    "name": "灵力引擎供热发电",
    "category": "生物液体与培养物",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 60,
    "power": -150,
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
    "desc": "灵力引擎（下） 生产 灵力引擎供热发电（耗时 60s）"
  },
  "rcp_084": {
    "id": "rcp_084",
    "canonicalId": "RCP_084",
    "name": "解构练气尸体",
    "category": "生物解构原料",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
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
    "desc": "解构机 生产 解构练气尸体（耗时 30s）"
  },
  "rcp_085": {
    "id": "rcp_085",
    "canonicalId": "RCP_085",
    "name": "解构筑基尸体",
    "category": "生物解构原料",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 45,
    "power": 55,
    "input": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "筑基修士尸体"
    },
    "output": {
      "item": "mat_018",
      "amount": 4,
      "ratePerMin": 5.33,
      "name": "血肉"
    },
    "inputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_018",
        "count": 4,
        "rate": 5.33
      },
      {
        "item": "MAT_022",
        "count": 3,
        "rate": 4.0
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "解构机 生产 解构筑基尸体（耗时 45s）"
  },
  "rcp_086": {
    "id": "rcp_086",
    "canonicalId": "RCP_086",
    "name": "解构金丹尸体",
    "category": "生物解构原料",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 60,
    "power": 55,
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
    "desc": "解构机 生产 解构金丹尸体（耗时 60s）"
  },
  "rcp_087": {
    "id": "rcp_087",
    "canonicalId": "RCP_087",
    "name": "脑髓解析数据",
    "category": "研究货币",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 20,
    "power": 55,
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
    "desc": "解构机 生产 脑髓解析数据（耗时 20s）"
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
      "amount": 1,
      "ratePerMin": 4.0,
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
        "count": 1,
        "rate": 4.0,
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
    "desc": "加工台 生产 玄铁剑丸（耗时 15s）"
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
      "item": "MAT_051",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "mat_075",
      "amount": 5,
      "ratePerMin": 15.0,
      "name": "爆裂剑丸"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 1,
        "rate": 3.0,
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
    "desc": "组装机 生产 爆裂剑丸（耗时 20s）"
  },
  "rcp_090": {
    "id": "rcp_090",
    "canonicalId": "RCP_090",
    "name": "煞气剑丸",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_069",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煞气片"
    },
    "output": {
      "item": "mat_076",
      "amount": 5,
      "ratePerMin": 10.0,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_069",
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
        "item": "mat_076",
        "count": 5,
        "rate": 10.0
      }
    ],
    "desc": "组装机 生产 煞气剑丸（耗时 30s）"
  },
  "rcp_091": {
    "id": "rcp_091",
    "canonicalId": "RCP_091",
    "name": "防御猎杀练气修士",
    "category": "生物解构原料",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 30,
    "power": 15,
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
    "desc": "飞剑防御塔 生产 防御猎杀练气修士（耗时 30s）"
  },
  "rcp_092": {
    "id": "rcp_092",
    "canonicalId": "RCP_092",
    "name": "防御猎杀筑基修士",
    "category": "生物解构原料",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 45,
    "power": 15,
    "input": {
      "item": "mat_075",
      "amount": 5,
      "ratePerMin": 6.67,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "筑基修士尸体"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 5,
        "rate": 6.67,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "飞剑防御塔 生产 防御猎杀筑基修士（耗时 45s）"
  },
  "rcp_093": {
    "id": "rcp_093",
    "canonicalId": "RCP_093",
    "name": "防御猎杀金丹修士",
    "category": "生物解构原料",
    "building": "bd_160",
    "buildingId": "bd_160",
    "timeSec": 60,
    "power": 15,
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
    "desc": "飞剑防御塔 生产 防御猎杀金丹修士（耗时 60s）"
  },
  "rcp_094": {
    "id": "rcp_094",
    "canonicalId": "RCP_094",
    "name": "煞气灵草培养",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 45,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_078",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "煞气灵草"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_038",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_078",
        "count": 2,
        "rate": 2.67
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "培养皿 生产 煞气灵草培养（耗时 45s）"
  },
  "rcp_095": {
    "id": "rcp_095",
    "canonicalId": "RCP_095",
    "name": "净水菌粉培养",
    "category": "环保与煞气材料",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_027",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血膏"
    },
    "output": {
      "item": "MAT_037",
      "amount": 3,
      "ratePerMin": 6.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "mat_027",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_068",
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
        "item": "MAT_037",
        "count": 3,
        "rate": 6.0
      }
    ],
    "desc": "培养皿 生产 净水菌粉培养（耗时 30s）"
  },
  "rcp_096": {
    "id": "rcp_096",
    "canonicalId": "RCP_096",
    "name": "生丹培养",
    "category": "灵根、法宝与金丹核心",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 90,
    "power": 35,
    "input": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "人造灵根"
    },
    "output": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "生丹"
    },
    "inputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 0.67,
        "form": "实体"
      },
      {
        "item": "mat_077",
        "count": 1,
        "rate": 0.67,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 2,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 0.67
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 1.33
      }
    ],
    "desc": "培养仓 生产 生丹培养（耗时 90s）"
  },
  "rcp_097": {
    "id": "rcp_097",
    "canonicalId": "RCP_097",
    "name": "气血丹炼制",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 40,
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
    "desc": "炼丹炉（上） 生产 气血丹炼制（耗时 30s）"
  },
  "rcp_098": {
    "id": "rcp_098",
    "canonicalId": "RCP_098",
    "name": "破障丹炼制",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 45,
    "power": 40,
    "input": {
      "item": "mat_078",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "煞气灵草"
    },
    "output": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "mat_078",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹炼制（耗时 45s）"
  },
  "rcp_099": {
    "id": "rcp_099",
    "canonicalId": "RCP_099",
    "name": "凝丹液提纯",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 45,
    "power": 20,
    "input": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "破障丹"
    },
    "output": {
      "item": "mat_082",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "凝丹液"
    },
    "inputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_082",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "提取器 生产 凝丹液提纯（耗时 45s）"
  },
  "rcp_100": {
    "id": "rcp_100",
    "canonicalId": "RCP_100",
    "name": "人造灵石合成",
    "category": "灵根、法宝与金丹核心",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 45,
    "power": 65,
    "input": {
      "item": "MAT_004",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "煤炭"
    },
    "output": {
      "item": "mat_083",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "人造灵石"
    },
    "inputs": [
      {
        "item": "MAT_004",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "MAT_071",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_083",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "冶炼舱（上） 生产 人造灵石合成（耗时 45s）"
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
    "desc": "炼宝台 生产 法宝祭炼（耗时 60s）"
  },
  "rcp_102": {
    "id": "rcp_102",
    "canonicalId": "RCP_102",
    "name": "渡劫凝练人造金丹",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 120,
    "power": 80,
    "input": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "生丹"
    },
    "output": {
      "item": "mat_085",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "人造金丹"
    },
    "inputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_058",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_083",
        "count": 4,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_085",
        "count": 1,
        "rate": 0.5
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 0.5
      }
    ],
    "desc": "渡劫台 生产 渡劫凝练人造金丹（耗时 120s）"
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
    "desc": "渡劫台 生产 金丹点煞成石自循环（耗时 60s）"
  },
  "rcp_104": {
    "id": "rcp_104",
    "canonicalId": "RCP_104",
    "name": "赤铜锭（手搓）",
    "category": "金属材料",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 30,
    "power": 5,
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
    "desc": "操作台 生产 赤铜锭（手搓）（耗时 30s）"
  },
  "rcp_105": {
    "id": "rcp_105",
    "canonicalId": "RCP_105",
    "name": "铜线（手搓）",
    "category": "电力与控制零件",
    "building": "handcraft",
    "buildingId": "handcraft",
    "timeSec": 20,
    "power": 5,
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
    "desc": "操作台 生产 铜线（手搓）（耗时 20s）"
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
    "desc": "粉碎机 生产 煤粉（耗时 10s）"
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
    "desc": "粉碎机 生产 灵草粉（耗时 10s）"
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
    "desc": "粉碎机 生产 赤铜粉（耗时 10s）"
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
    "desc": "粉碎机 生产 木屑（耗时 10s）"
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
    "desc": "加工台 生产 绝缘板（耗时 15s）"
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
    "desc": "加工台 生产 灵磁齿轮（铜铁混粉）（耗时 12s）"
  },
  "rcp_112": {
    "id": "rcp_112",
    "canonicalId": "RCP_112",
    "name": "回气散",
    "category": "剑丸与丹药成品",
    "building": "assembler",
    "buildingId": "assembler",
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
    "desc": "加工台 生产 回气散（耗时 20s）"
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
    "desc": "加工台 生产 碳棒（耗时 20s）"
  },
  "rcp_114": {
    "id": "rcp_114",
    "canonicalId": "RCP_114",
    "name": "灵草木屑堆肥",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 50,
    "power": 10,
    "input": {
      "item": "MAT_028",
      "amount": 1,
      "ratePerMin": 1.2,
      "name": "灵草种子"
    },
    "output": {
      "item": "MAT_029",
      "amount": 2,
      "ratePerMin": 2.4,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_089",
        "count": 2,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 1.2,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 2.4
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.2
      }
    ],
    "desc": "培养皿 生产 灵草木屑堆肥（耗时 50s）"
  },
  "rcp_115": {
    "id": "rcp_115",
    "canonicalId": "RCP_115",
    "name": "净化剂（煤粉增产）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "mat_086",
      "amount": 1,
      "ratePerMin": 4.0,
      "name": "煤粉"
    },
    "output": {
      "item": "MAT_037",
      "amount": 3,
      "ratePerMin": 12.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "mat_086",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_037",
        "count": 3,
        "rate": 12.0
      }
    ],
    "desc": "加工台 生产 净化剂（煤粉增产）（耗时 15s）"
  },
  "rcp_116": {
    "id": "rcp_116",
    "canonicalId": "RCP_116",
    "name": "气血丹（回气散提炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 40,
    "input": {
      "item": "mat_090",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "回气散"
    },
    "output": {
      "item": "mat_080",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "mat_090",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_086",
        "count": 1,
        "rate": 2.0,
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
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹（回气散提炼）（耗时 30s）"
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
    "desc": "炼宝台 生产 法宝祭炼（绝缘灵液增产）（耗时 60s）"
  },
  "rcp_118": {
    "id": "rcp_118",
    "canonicalId": "RCP_118",
    "name": "抽取原油",
    "category": "矿物与燃料",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 30,
    "power": 10,
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
    "desc": "抽水机 生产 抽取原油（耗时 30s）"
  },
  "rcp_119": {
    "id": "rcp_119",
    "canonicalId": "RCP_119",
    "name": "抽取灵泉",
    "category": "生物液体与培养物",
    "building": "pump",
    "buildingId": "pump",
    "timeSec": 45,
    "power": 10,
    "input": {
      "item": "",
      "amount": 0,
      "ratePerMin": 0,
      "name": ""
    },
    "output": {
      "item": "mat_106",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "灵泉"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "mat_106",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "抽水机 生产 抽取灵泉（耗时 45s）"
  },
  "rcp_120": {
    "id": "rcp_120",
    "canonicalId": "RCP_120",
    "name": "采集石英砂",
    "category": "矿物与燃料",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
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
    "desc": "采矿机 生产 采集石英砂（耗时 10s）"
  },
  "rcp_121": {
    "id": "rcp_121",
    "canonicalId": "RCP_121",
    "name": "采集灵石矿",
    "category": "矿物与燃料",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 15,
    "power": 5,
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
    "desc": "采矿机 生产 采集灵石矿（耗时 15s）"
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
    "desc": "离心机 生产 原油离心分馏（塑料+燃油）（耗时 30s）"
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
    "desc": "离心机 生产 燃油二次分馏（橡胶+润滑油）（耗时 30s）"
  },
  "rcp_124": {
    "id": "rcp_124",
    "canonicalId": "RCP_124",
    "name": "原油煤粉催化裂解",
    "category": "矿物与燃料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 25,
    "power": 20,
    "input": {
      "item": "mat_086",
      "amount": 1,
      "ratePerMin": 2.4,
      "name": "煤粉"
    },
    "output": {
      "item": "mat_094",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "燃油"
    },
    "inputs": [
      {
        "item": "mat_086",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "mat_093",
        "count": 2,
        "rate": 4.8,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_094",
        "count": 2,
        "rate": 4.8
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 2.4
      }
    ],
    "desc": "提取器 生产 原油煤粉催化裂解（耗时 25s）"
  },
  "rcp_125": {
    "id": "rcp_125",
    "canonicalId": "RCP_125",
    "name": "燃油供热发电",
    "category": "环保与煞气材料",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 45,
    "power": -150,
    "input": {
      "item": "mat_094",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "燃油"
    },
    "output": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "滤渣"
    },
    "inputs": [
      {
        "item": "mat_094",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "灵力引擎（下） 生产 燃油供热发电（耗时 45s）"
  },
  "rcp_126": {
    "id": "rcp_126",
    "canonicalId": "RCP_126",
    "name": "核燃料棒超频发电",
    "category": "环保与煞气材料",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 120,
    "power": -150,
    "input": {
      "item": "mat_109",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "燃料棒"
    },
    "output": {
      "item": "MAT_040",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "滤渣"
    },
    "inputs": [
      {
        "item": "mat_109",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 0.5
      }
    ],
    "desc": "灵力引擎（下） 生产 核燃料棒超频发电（耗时 120s）"
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
    "desc": "精炼炉 生产 玻璃熔炼（耗时 15s）"
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
    "desc": "精炼炉 生产 玻璃助熔高产（耗时 15s）"
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
    "desc": "切割机 生产 硅片精切（耗时 12s）"
  },
  "rcp_130": {
    "id": "rcp_130",
    "canonicalId": "RCP_130",
    "name": "药瓶封装",
    "category": "基础建材",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
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
    "desc": "加工台 生产 药瓶封装（耗时 15s）"
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
    "desc": "粉碎机 生产 灵石矿粉碎分选（耗时 15s）"
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
    "desc": "加工台 生产 铅板压制（耗时 15s）"
  },
  "rcp_133": {
    "id": "rcp_133",
    "canonicalId": "RCP_133",
    "name": "灵泉离心分离（灵石粉+重水）",
    "category": "矿物与燃料",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 35,
    "power": 35,
    "input": {
      "item": "mat_106",
      "amount": 2,
      "ratePerMin": 3.43,
      "name": "灵泉"
    },
    "output": {
      "item": "mat_103",
      "amount": 1,
      "ratePerMin": 1.71,
      "name": "灵石粉"
    },
    "inputs": [
      {
        "item": "mat_106",
        "count": 2,
        "rate": 3.43,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_103",
        "count": 1,
        "rate": 1.71
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 1.71
      }
    ],
    "desc": "离心机 生产 灵泉离心分离（灵石粉+重水）（耗时 35s）"
  },
  "rcp_134": {
    "id": "rcp_134",
    "canonicalId": "RCP_134",
    "name": "灵液提纯（副产煞水）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 35,
    "power": 20,
    "input": {
      "item": "mat_103",
      "amount": 2,
      "ratePerMin": 3.43,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_107",
      "amount": 2,
      "ratePerMin": 3.43,
      "name": "灵液"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 2,
        "rate": 3.43,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 3.43,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_107",
        "count": 2,
        "rate": 3.43
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.71
      }
    ],
    "desc": "提取器 生产 灵液提纯（副产煞水）（耗时 35s）"
  },
  "rcp_135": {
    "id": "rcp_135",
    "canonicalId": "RCP_135",
    "name": "灵石矿浸洗制重水",
    "category": "环保与煞气材料",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 40,
    "power": 20,
    "input": {
      "item": "mat_102",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "灵石矿"
    },
    "output": {
      "item": "mat_108",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "重水"
    },
    "inputs": [
      {
        "item": "mat_102",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "MAT_033",
        "count": 2,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_108",
        "count": 1,
        "rate": 1.5
      },
      {
        "item": "MAT_036",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "提取器 生产 灵石矿浸洗制重水（耗时 40s）"
  },
  "rcp_136": {
    "id": "rcp_136",
    "canonicalId": "RCP_136",
    "name": "核燃料棒封装",
    "category": "矿物与燃料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 60,
    "power": 65,
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
    "desc": "冶炼舱（上） 生产 核燃料棒封装（耗时 60s）"
  },
  "rcp_137": {
    "id": "rcp_137",
    "canonicalId": "RCP_137",
    "name": "人造灵石（灵液浓缩法）",
    "category": "灵根、法宝与金丹核心",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 40,
    "power": 65,
    "input": {
      "item": "mat_103",
      "amount": 3,
      "ratePerMin": 4.5,
      "name": "灵石粉"
    },
    "output": {
      "item": "mat_083",
      "amount": 2,
      "ratePerMin": 3.0,
      "name": "人造灵石"
    },
    "inputs": [
      {
        "item": "mat_103",
        "count": 3,
        "rate": 4.5,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_083",
        "count": 2,
        "rate": 3.0
      }
    ],
    "desc": "冶炼舱（上） 生产 人造灵石（灵液浓缩法）（耗时 40s）"
  },
  "rcp_138": {
    "id": "rcp_138",
    "canonicalId": "RCP_138",
    "name": "稳定液（灵液高产法）",
    "category": "灵根、法宝与金丹核心",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 25,
    "power": 10,
    "input": {
      "item": "mat_107",
      "amount": 1,
      "ratePerMin": 2.4,
      "name": "灵液"
    },
    "output": {
      "item": "mat_070",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "稳定液"
    },
    "inputs": [
      {
        "item": "mat_107",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      },
      {
        "item": "mat_022",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_070",
        "count": 2,
        "rate": 4.8
      }
    ],
    "desc": "搅拌机 生产 稳定液（灵液高产法）（耗时 25s）"
  },
  "rcp_139": {
    "id": "rcp_139",
    "canonicalId": "RCP_139",
    "name": "绝缘板（塑木复合高产）",
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
    "desc": "加工台 生产 绝缘板（塑木复合高产）（耗时 15s）"
  },
  "rcp_140": {
    "id": "rcp_140",
    "canonicalId": "RCP_140",
    "name": "电路板（硅片润滑高产）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
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
    "desc": "加工台 生产 电路板（硅片润滑高产）（耗时 20s）"
  },
  "rcp_141": {
    "id": "rcp_141",
    "canonicalId": "RCP_141",
    "name": "电路板（绝缘铜片法）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
    "input": {
      "item": "mat_091",
      "amount": 1,
      "ratePerMin": 3.0,
      "name": "绝缘板"
    },
    "output": {
      "item": "mat_014",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "电路板"
    },
    "inputs": [
      {
        "item": "mat_091",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_013",
        "count": 1,
        "rate": 3.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_014",
        "count": 2,
        "rate": 6.0
      }
    ],
    "desc": "加工台 生产 电路板（绝缘铜片法）（耗时 20s）"
  },
  "rcp_142": {
    "id": "rcp_142",
    "canonicalId": "RCP_142",
    "name": "生物芯片（硅片高产）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 25,
    "power": 10,
    "input": {
      "item": "MAT_022",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "脑髓"
    },
    "output": {
      "item": "mat_015",
      "amount": 3,
      "ratePerMin": 7.2,
      "name": "生物芯片"
    },
    "inputs": [
      {
        "item": "MAT_022",
        "count": 2,
        "rate": 4.8,
        "form": "实体"
      },
      {
        "item": "mat_100",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_015",
        "count": 3,
        "rate": 7.2
      }
    ],
    "desc": "加工台 生产 生物芯片（硅片高产）（耗时 25s）"
  },
  "rcp_143": {
    "id": "rcp_143",
    "canonicalId": "RCP_143",
    "name": "中控芯片（硅片直焊）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
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
    "desc": "加工台 生产 中控芯片（硅片直焊）（耗时 30s）"
  },
  "rcp_144": {
    "id": "rcp_144",
    "canonicalId": "RCP_144",
    "name": "灵磁齿轮（灵石粉润滑高产）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 10,
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
    "desc": "加工台 生产 灵磁齿轮（灵石粉润滑高产）（耗时 15s）"
  },
  "rcp_145": {
    "id": "rcp_145",
    "canonicalId": "RCP_145",
    "name": "传动带（橡胶润滑高产）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 10,
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
    "desc": "加工台 生产 传动带（橡胶润滑高产）（耗时 20s）"
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
      "name": "铁管"
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
    "desc": "加工台 生产 阀门（橡胶密封高产）（耗时 20s）"
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
    "desc": "加工台 生产 电缆（橡胶护套高产）（耗时 15s）"
  },
  "rcp_148": {
    "id": "rcp_148",
    "canonicalId": "RCP_148",
    "name": "高压电容（碳棒绝缘法）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 45,
    "power": 50,
    "input": {
      "item": "mat_091",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "绝缘板"
    },
    "output": {
      "item": "mat_046",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "高压电容"
    },
    "inputs": [
      {
        "item": "mat_091",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_092",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_046",
        "count": 2,
        "rate": 2.67
      }
    ],
    "desc": "组装机 生产 高压电容（碳棒绝缘法）（耗时 45s）"
  },
  "rcp_149": {
    "id": "rcp_149",
    "canonicalId": "RCP_149",
    "name": "精炼玄铁锭（燃油碳棒高产）",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 65,
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
    "desc": "冶炼舱（上） 生产 精炼玄铁锭（燃油碳棒高产）（耗时 30s）"
  },
  "rcp_150": {
    "id": "rcp_150",
    "canonicalId": "RCP_150",
    "name": "高温合金锭（重水淬火高产）",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 40,
    "power": 65,
    "input": {
      "item": "MAT_051",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "MAT_043",
      "amount": 3,
      "ratePerMin": 4.5,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_088",
        "count": 3,
        "rate": 4.5,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 3,
        "rate": 4.5
      }
    ],
    "desc": "冶炼舱（上） 生产 高温合金锭（重水淬火高产）（耗时 40s）"
  },
  "rcp_151": {
    "id": "rcp_151",
    "canonicalId": "RCP_151",
    "name": "灵草灵泉催熟",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 40,
    "power": 10,
    "input": {
      "item": "MAT_028",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "灵草种子"
    },
    "output": {
      "item": "MAT_029",
      "amount": 5,
      "ratePerMin": 7.5,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "MAT_068",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_029",
        "count": 5,
        "rate": 7.5
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "培养皿 生产 灵草灵泉催熟（耗时 40s）"
  },
  "rcp_152": {
    "id": "rcp_152",
    "canonicalId": "RCP_152",
    "name": "煞气灵草（灵泉高产）",
    "category": "生物液体与培养物",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 40,
    "power": 10,
    "input": {
      "item": "MAT_029",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mat_078",
      "amount": 4,
      "ratePerMin": 6.0,
      "name": "煞气灵草"
    },
    "inputs": [
      {
        "item": "MAT_029",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_078",
        "count": 4,
        "rate": 6.0
      },
      {
        "item": "MAT_028",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "培养皿 生产 煞气灵草（灵泉高产）（耗时 40s）"
  },
  "rcp_153": {
    "id": "rcp_153",
    "canonicalId": "RCP_153",
    "name": "血水碳棒高效过滤",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 40,
    "power": 20,
    "input": {
      "item": "mat_092",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "碳棒"
    },
    "output": {
      "item": "MAT_038",
      "amount": 3,
      "ratePerMin": 4.5,
      "name": "净化水"
    },
    "inputs": [
      {
        "item": "mat_092",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "MAT_034",
        "count": 2,
        "rate": 3.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_038",
        "count": 3,
        "rate": 4.5
      },
      {
        "item": "MAT_040",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "回收处理塔 生产 血水碳棒高效过滤（耗时 40s）"
  },
  "rcp_154": {
    "id": "rcp_154",
    "canonicalId": "RCP_154",
    "name": "高温合金锭（炉芯重水模铸）",
    "category": "金属材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 45,
    "power": 50,
    "input": {
      "item": "MAT_045",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "耐火炉芯"
    },
    "output": {
      "item": "MAT_043",
      "amount": 4,
      "ratePerMin": 5.33,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "MAT_045",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_060",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 4,
        "rate": 5.33
      }
    ],
    "desc": "组装机 生产 高温合金锭（炉芯重水模铸）（耗时 45s）"
  },
  "rcp_155": {
    "id": "rcp_155",
    "canonicalId": "RCP_155",
    "name": "爆裂剑丸（燃油弹链装填）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 25,
    "power": 50,
    "input": {
      "item": "MAT_051",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "mat_075",
      "amount": 10,
      "ratePerMin": 24.0,
      "name": "爆裂剑丸"
    },
    "inputs": [
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 4.8,
        "form": "实体"
      },
      {
        "item": "mat_049",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_075",
        "count": 10,
        "rate": 24.0
      }
    ],
    "desc": "组装机 生产 爆裂剑丸（燃油弹链装填）（耗时 25s）"
  },
  "rcp_156": {
    "id": "rcp_156",
    "canonicalId": "RCP_156",
    "name": "动力核心（电池机壳封装）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 50,
    "power": 50,
    "input": {
      "item": "mat_040",
      "amount": 1,
      "ratePerMin": 1.2,
      "name": "机壳"
    },
    "output": {
      "item": "mat_057",
      "amount": 2,
      "ratePerMin": 2.4,
      "name": "动力核心"
    },
    "inputs": [
      {
        "item": "mat_040",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_066",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 1.2,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_057",
        "count": 2,
        "rate": 2.4
      }
    ],
    "desc": "组装机 生产 动力核心（电池机壳封装）（耗时 50s）"
  },
  "rcp_157": {
    "id": "rcp_157",
    "canonicalId": "RCP_157",
    "name": "燃料棒（液冷泵阀高产）",
    "category": "矿物与燃料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 50,
    "power": 50,
    "input": {
      "item": "mat_012",
      "amount": 2,
      "ratePerMin": 2.4,
      "name": "阀门"
    },
    "output": {
      "item": "mat_109",
      "amount": 2,
      "ratePerMin": 2.4,
      "name": "燃料棒"
    },
    "inputs": [
      {
        "item": "mat_012",
        "count": 2,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "MAT_047",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_109",
        "count": 2,
        "rate": 2.4
      }
    ],
    "desc": "组装机 生产 燃料棒（液冷泵阀高产）（耗时 50s）"
  },
  "rcp_158": {
    "id": "rcp_158",
    "canonicalId": "RCP_158",
    "name": "生物滤芯（木架压制）",
    "category": "环保与煞气材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 25,
    "power": 10,
    "input": {
      "item": "MAT_067",
      "amount": 1,
      "ratePerMin": 2.4,
      "name": "木架"
    },
    "output": {
      "item": "mat_044",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "生物滤芯"
    },
    "inputs": [
      {
        "item": "MAT_067",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "mat_018",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_044",
        "count": 2,
        "rate": 4.8
      }
    ],
    "desc": "加工台 生产 生物滤芯（木架压制）（耗时 25s）"
  },
  "rcp_159": {
    "id": "rcp_159",
    "canonicalId": "RCP_159",
    "name": "探矿仪（中控机壳高产）",
    "category": "电力与控制零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mat_054",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "中控芯片"
    },
    "output": {
      "item": "MAT_075",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "探矿仪"
    },
    "inputs": [
      {
        "item": "mat_054",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_040",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_075",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "加工台 生产 探矿仪（中控机壳高产）（耗时 30s）"
  },
  "rcp_160": {
    "id": "rcp_160",
    "canonicalId": "RCP_160",
    "name": "高压电容（电池升压）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 40,
    "power": 50,
    "input": {
      "item": "mat_066",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "灵能电池"
    },
    "output": {
      "item": "mat_046",
      "amount": 2,
      "ratePerMin": 3.0,
      "name": "高压电容"
    },
    "inputs": [
      {
        "item": "mat_066",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_013",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_046",
        "count": 2,
        "rate": 3.0
      }
    ],
    "desc": "组装机 生产 高压电容（电池升压）（耗时 40s）"
  },
  "rcp_161": {
    "id": "rcp_161",
    "canonicalId": "RCP_161",
    "name": "耐火炉芯（铅板护衬）",
    "category": "机械与管路零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_060",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "铁架"
    },
    "output": {
      "item": "MAT_045",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "耐火炉芯"
    },
    "inputs": [
      {
        "item": "mat_060",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_105",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_045",
        "count": 2,
        "rate": 4.0
      }
    ],
    "desc": "组装机 生产 耐火炉芯（铅板护衬）（耗时 30s）"
  },
  "rcp_162": {
    "id": "rcp_162",
    "canonicalId": "RCP_162",
    "name": "循环水泵（轴管润滑组装）",
    "category": "机械与管路零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 25,
    "power": 10,
    "input": {
      "item": "mat_061",
      "amount": 1,
      "ratePerMin": 2.4,
      "name": "传动轴"
    },
    "output": {
      "item": "MAT_047",
      "amount": 2,
      "ratePerMin": 4.8,
      "name": "循环水泵"
    },
    "inputs": [
      {
        "item": "mat_061",
        "count": 1,
        "rate": 2.4,
        "form": "实体"
      },
      {
        "item": "mat_042",
        "count": 2,
        "rate": 4.8,
        "form": "实体"
      },
      {
        "item": "mat_095",
        "count": 1,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_047",
        "count": 2,
        "rate": 4.8
      }
    ],
    "desc": "加工台 生产 循环水泵（轴管润滑组装）（耗时 25s）"
  },
  "rcp_163": {
    "id": "rcp_163",
    "canonicalId": "RCP_163",
    "name": "高温合金锭（超频燃油增产）",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 35,
    "power": 65,
    "input": {
      "item": "mat_037",
      "amount": 1,
      "ratePerMin": 1.71,
      "name": "超频插件"
    },
    "output": {
      "item": "MAT_043",
      "amount": 4,
      "ratePerMin": 6.86,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "mat_037",
        "count": 1,
        "rate": 1.71,
        "form": "实体"
      },
      {
        "item": "MAT_051",
        "count": 2,
        "rate": 3.43,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 1.71,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_043",
        "count": 4,
        "rate": 6.86
      }
    ],
    "desc": "冶炼舱（上） 生产 高温合金锭（超频燃油增产）（耗时 35s）"
  },
  "rcp_164": {
    "id": "rcp_164",
    "canonicalId": "RCP_164",
    "name": "净化剂（草铜混粉）",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_087",
      "amount": 2,
      "ratePerMin": 6.0,
      "name": "灵草粉"
    },
    "output": {
      "item": "MAT_037",
      "amount": 4,
      "ratePerMin": 12.0,
      "name": "净化剂"
    },
    "inputs": [
      {
        "item": "mat_087",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      },
      {
        "item": "mat_088",
        "count": 2,
        "rate": 6.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_037",
        "count": 4,
        "rate": 12.0
      }
    ],
    "desc": "组装机 生产 净化剂（草铜混粉）（耗时 20s）"
  },
  "rcp_165": {
    "id": "rcp_165",
    "canonicalId": "RCP_165",
    "name": "煞水结晶回收",
    "category": "环保与煞气材料",
    "building": "purifier",
    "buildingId": "purifier",
    "timeSec": 45,
    "power": 20,
    "input": {
      "item": "MAT_040",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "滤渣"
    },
    "output": {
      "item": "MAT_038",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "净化水"
    },
    "inputs": [
      {
        "item": "MAT_040",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 2.67,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_038",
        "count": 2,
        "rate": 2.67
      },
      {
        "item": "MAT_071",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "回收处理塔 生产 煞水结晶回收（耗时 45s）"
  },
  "rcp_166": {
    "id": "rcp_166",
    "canonicalId": "RCP_166",
    "name": "气血丹（血胎直炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 40,
    "input": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血胎"
    },
    "output": {
      "item": "mat_080",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "mat_032",
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
        "item": "mat_106",
        "count": 1,
        "rate": 2.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_080",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹（血胎直炼）（耗时 30s）"
  },
  "rcp_167": {
    "id": "rcp_167",
    "canonicalId": "RCP_167",
    "name": "精元液（血胎提取）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "mat_032",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "血胎"
    },
    "output": {
      "item": "mat_022",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "精元液"
    },
    "inputs": [
      {
        "item": "mat_032",
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
        "item": "mat_022",
        "count": 2,
        "rate": 4.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 2.0
      }
    ],
    "desc": "提取器 生产 精元液（血胎提取）（耗时 30s）"
  },
  "rcp_168": {
    "id": "rcp_168",
    "canonicalId": "RCP_168",
    "name": "生物芯片（人造经脉高产）",
    "category": "电力与控制零件",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_053",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "人造经脉"
    },
    "output": {
      "item": "mat_015",
      "amount": 4,
      "ratePerMin": 8.0,
      "name": "生物芯片"
    },
    "inputs": [
      {
        "item": "mat_053",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "MAT_022",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_015",
        "count": 4,
        "rate": 8.0
      }
    ],
    "desc": "组装机 生产 生物芯片（人造经脉高产）（耗时 30s）"
  },
  "rcp_169": {
    "id": "rcp_169",
    "canonicalId": "RCP_169",
    "name": "复合滤芯（骨板铅屏蔽）",
    "category": "环保与煞气材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 35,
    "power": 50,
    "input": {
      "item": "mat_038",
      "amount": 1,
      "ratePerMin": 1.71,
      "name": "骨板"
    },
    "output": {
      "item": "mat_055",
      "amount": 2,
      "ratePerMin": 3.43,
      "name": "复合滤芯"
    },
    "inputs": [
      {
        "item": "mat_038",
        "count": 1,
        "rate": 1.71,
        "form": "实体"
      },
      {
        "item": "mat_105",
        "count": 1,
        "rate": 1.71,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "mat_055",
        "count": 2,
        "rate": 3.43
      }
    ],
    "desc": "组装机 生产 复合滤芯（骨板铅屏蔽）（耗时 35s）"
  },
  "rcp_170": {
    "id": "rcp_170",
    "canonicalId": "RCP_170",
    "name": "煞气剑丸（铅芯穿甲弹）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_068",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "煞气合金"
    },
    "output": {
      "item": "mat_076",
      "amount": 8,
      "ratePerMin": 16.0,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_068",
        "count": 1,
        "rate": 2.0,
        "form": "实体"
      },
      {
        "item": "mat_105",
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
        "item": "mat_076",
        "count": 8,
        "rate": 16.0
      }
    ],
    "desc": "组装机 生产 煞气剑丸（铅芯穿甲弹）（耗时 30s）"
  },
  "rcp_171": {
    "id": "rcp_171",
    "canonicalId": "RCP_171",
    "name": "煞气剑丸（灵石粉装药）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 50,
    "input": {
      "item": "mat_069",
      "amount": 2,
      "ratePerMin": 4.0,
      "name": "煞气片"
    },
    "output": {
      "item": "mat_076",
      "amount": 8,
      "ratePerMin": 16.0,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_069",
        "count": 2,
        "rate": 4.0,
        "form": "实体"
      },
      {
        "item": "mat_103",
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
        "item": "mat_076",
        "count": 8,
        "rate": 16.0
      }
    ],
    "desc": "组装机 生产 煞气剑丸（灵石粉装药）（耗时 30s）"
  },
  "rcp_172": {
    "id": "rcp_172",
    "canonicalId": "RCP_172",
    "name": "爆裂剑丸（玄铁弹改装）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 20,
    "power": 50,
    "input": {
      "item": "mat_074",
      "amount": 5,
      "ratePerMin": 15.0,
      "name": "玄铁剑丸"
    },
    "output": {
      "item": "mat_075",
      "amount": 6,
      "ratePerMin": 18.0,
      "name": "爆裂剑丸"
    },
    "inputs": [
      {
        "item": "mat_074",
        "count": 5,
        "rate": 15.0,
        "form": "实体"
      },
      {
        "item": "mat_087",
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
        "count": 6,
        "rate": 18.0
      }
    ],
    "desc": "组装机 生产 爆裂剑丸（玄铁弹改装）（耗时 20s）"
  },
  "rcp_173": {
    "id": "rcp_173",
    "canonicalId": "RCP_173",
    "name": "煞气剑丸（中控芯片制导）",
    "category": "剑丸与丹药成品",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 25,
    "power": 50,
    "input": {
      "item": "mat_075",
      "amount": 5,
      "ratePerMin": 12.0,
      "name": "爆裂剑丸"
    },
    "output": {
      "item": "mat_076",
      "amount": 6,
      "ratePerMin": 14.4,
      "name": "煞气剑丸"
    },
    "inputs": [
      {
        "item": "mat_075",
        "count": 5,
        "rate": 12.0,
        "form": "实体"
      },
      {
        "item": "mat_054",
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
        "count": 6,
        "rate": 14.4
      }
    ],
    "desc": "组装机 生产 煞气剑丸（中控芯片制导）（耗时 25s）"
  },
  "rcp_174": {
    "id": "rcp_174",
    "canonicalId": "RCP_174",
    "name": "精炼玄铁锭（铅铁共炼）",
    "category": "金属材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 35,
    "power": 65,
    "input": {
      "item": "mat_104",
      "amount": 2,
      "ratePerMin": 3.43,
      "name": "铅锭"
    },
    "output": {
      "item": "MAT_051",
      "amount": 3,
      "ratePerMin": 5.14,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "mat_104",
        "count": 2,
        "rate": 3.43,
        "form": "实体"
      },
      {
        "item": "MAT_006",
        "count": 2,
        "rate": 3.43,
        "form": "实体"
      },
      {
        "item": "mat_094",
        "count": 1,
        "rate": 1.71,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_051",
        "count": 3,
        "rate": 5.14
      }
    ],
    "desc": "冶炼舱（上） 生产 精炼玄铁锭（铅铁共炼）（耗时 35s）"
  },
  "rcp_175": {
    "id": "rcp_175",
    "canonicalId": "RCP_175",
    "name": "气血丹（练气整尸血炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 35,
    "power": 40,
    "input": {
      "item": "MAT_020",
      "amount": 1,
      "ratePerMin": 1.71,
      "name": "练气修士尸体"
    },
    "output": {
      "item": "mat_080",
      "amount": 3,
      "ratePerMin": 5.14,
      "name": "气血丹"
    },
    "inputs": [
      {
        "item": "MAT_020",
        "count": 1,
        "rate": 1.71,
        "form": "实体"
      },
      {
        "item": "MAT_029",
        "count": 2,
        "rate": 3.43,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.71,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_080",
        "count": 3,
        "rate": 5.14
      },
      {
        "item": "mat_079",
        "count": 2,
        "rate": 3.43
      }
    ],
    "desc": "炼丹炉（上） 生产 气血丹（练气整尸血炼）（耗时 35s）"
  },
  "rcp_176": {
    "id": "rcp_176",
    "canonicalId": "RCP_176",
    "name": "破障丹（筑基整尸血炼）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 45,
    "power": 40,
    "input": {
      "item": "MAT_055",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "筑基修士尸体"
    },
    "output": {
      "item": "mat_081",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "MAT_055",
        "count": 1,
        "rate": 1.33,
        "form": "实体"
      },
      {
        "item": "mat_078",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 2,
        "rate": 2.67
      },
      {
        "item": "mat_079",
        "count": 3,
        "rate": 4.0
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹（筑基整尸血炼）（耗时 45s）"
  },
  "rcp_177": {
    "id": "rcp_177",
    "canonicalId": "RCP_177",
    "name": "凝丹液（金丹整尸直萃）",
    "category": "生物液体与培养物",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 50,
    "power": 20,
    "input": {
      "item": "MAT_056",
      "amount": 1,
      "ratePerMin": 1.2,
      "name": "金丹修士尸体"
    },
    "output": {
      "item": "mat_082",
      "amount": 2,
      "ratePerMin": 2.4,
      "name": "凝丹液"
    },
    "inputs": [
      {
        "item": "MAT_056",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_106",
        "count": 2,
        "rate": 2.4,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_082",
        "count": 2,
        "rate": 2.4
      },
      {
        "item": "MAT_036",
        "count": 2,
        "rate": 2.4
      }
    ],
    "desc": "提取器 生产 凝丹液（金丹整尸直萃）（耗时 50s）"
  },
  "rcp_178": {
    "id": "rcp_178",
    "canonicalId": "RCP_178",
    "name": "气血丹（药瓶流水线）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 30,
    "power": 40,
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
    "desc": "炼丹炉（上） 生产 气血丹（药瓶流水线）（耗时 30s）"
  },
  "rcp_179": {
    "id": "rcp_179",
    "canonicalId": "RCP_179",
    "name": "破障丹（药瓶流水线）",
    "category": "剑丸与丹药成品",
    "building": "bd_163",
    "buildingId": "bd_163",
    "timeSec": 40,
    "power": 40,
    "input": {
      "item": "mat_101",
      "amount": 2,
      "ratePerMin": 3.0,
      "name": "药瓶"
    },
    "output": {
      "item": "mat_081",
      "amount": 3,
      "ratePerMin": 4.5,
      "name": "破障丹"
    },
    "inputs": [
      {
        "item": "mat_101",
        "count": 2,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_080",
        "count": 2,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_077",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_081",
        "count": 3,
        "rate": 4.5
      },
      {
        "item": "mat_079",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "炼丹炉（上） 生产 破障丹（药瓶流水线）（耗时 40s）"
  },
  "rcp_180": {
    "id": "rcp_180",
    "canonicalId": "RCP_180",
    "name": "血胎（气血丹促育）",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 40,
    "power": 35,
    "input": {
      "item": "mat_080",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "气血丹"
    },
    "output": {
      "item": "mat_032",
      "amount": 4,
      "ratePerMin": 6.0,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_080",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "mat_027",
        "count": 2,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 4,
        "rate": 6.0
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "培养仓 生产 血胎（气血丹促育）（耗时 40s）"
  },
  "rcp_181": {
    "id": "rcp_181",
    "canonicalId": "RCP_181",
    "name": "血胎（回气散促育）",
    "category": "生物液体与培养物",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 40,
    "power": 35,
    "input": {
      "item": "mat_090",
      "amount": 2,
      "ratePerMin": 3.0,
      "name": "回气散"
    },
    "output": {
      "item": "mat_032",
      "amount": 3,
      "ratePerMin": 4.5,
      "name": "血胎"
    },
    "inputs": [
      {
        "item": "mat_090",
        "count": 2,
        "rate": 3.0,
        "form": "实体"
      },
      {
        "item": "mat_027",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      },
      {
        "item": "MAT_027",
        "count": 1,
        "rate": 1.5,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_032",
        "count": 3,
        "rate": 4.5
      },
      {
        "item": "MAT_034",
        "count": 1,
        "rate": 1.5
      }
    ],
    "desc": "培养仓 生产 血胎（回气散促育）（耗时 40s）"
  },
  "rcp_182": {
    "id": "rcp_182",
    "canonicalId": "RCP_182",
    "name": "二阶科研：灵根芯逆向解析",
    "category": "研究货币",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 55,
    "input": {
      "item": "mat_056",
      "amount": 1,
      "ratePerMin": 2.0,
      "name": "灵根芯"
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
    "desc": "解构机 生产 二阶科研：灵根芯逆向解析（耗时 30s）"
  },
  "rcp_183": {
    "id": "rcp_183",
    "canonicalId": "RCP_183",
    "name": "三阶科研：破障丹逆向解析",
    "category": "研究货币",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 35,
    "power": 55,
    "input": {
      "item": "mat_081",
      "amount": 1,
      "ratePerMin": 1.71,
      "name": "破障丹"
    },
    "output": {
      "item": "MAT_023",
      "amount": 12,
      "ratePerMin": 20.57,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_081",
        "count": 1,
        "rate": 1.71,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 12,
        "rate": 20.57
      }
    ],
    "desc": "解构机 生产 三阶科研：破障丹逆向解析（耗时 35s）"
  },
  "rcp_184": {
    "id": "rcp_184",
    "canonicalId": "RCP_184",
    "name": "终局科研：法宝逆向解析",
    "category": "研究货币",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 40,
    "power": 55,
    "input": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.5,
      "name": "法宝"
    },
    "output": {
      "item": "MAT_023",
      "amount": 25,
      "ratePerMin": 37.5,
      "name": "解析数据"
    },
    "inputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.5,
        "form": "实体"
      }
    ],
    "outputs": [
      {
        "item": "MAT_023",
        "count": 25,
        "rate": 37.5
      }
    ],
    "desc": "解构机 生产 终局科研：法宝逆向解析（耗时 40s）"
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
    "desc": "炼宝台 生产 法宝成品祭炼（动力核心）（耗时 60s）"
  },
  "rcp_186": {
    "id": "rcp_186",
    "canonicalId": "RCP_186",
    "name": "高阶法宝祭炼（灵根座+凝丹液）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 60,
    "power": 45,
    "input": {
      "item": "mat_059",
      "amount": 1,
      "ratePerMin": 1.0,
      "name": "灵根座"
    },
    "output": {
      "item": "mat_110",
      "amount": 2,
      "ratePerMin": 2.0,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_059",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_037",
        "count": 1,
        "rate": 1.0,
        "form": "实体"
      },
      {
        "item": "mat_082",
        "count": 1,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 2,
        "rate": 2.0
      },
      {
        "item": "MAT_023",
        "count": 15,
        "rate": 15.0
      }
    ],
    "desc": "炼宝台 生产 高阶法宝祭炼（灵根座+凝丹液）（耗时 60s）"
  },
  "rcp_187": {
    "id": "rcp_187",
    "canonicalId": "RCP_187",
    "name": "法宝胚（剑丸玻璃祭炼）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 45,
    "power": 45,
    "input": {
      "item": "mat_076",
      "amount": 5,
      "ratePerMin": 6.67,
      "name": "煞气剑丸"
    },
    "output": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "法宝胚"
    },
    "inputs": [
      {
        "item": "mat_076",
        "count": 5,
        "rate": 6.67,
        "form": "实体"
      },
      {
        "item": "mat_099",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "MAT_023",
        "count": 6,
        "rate": 8.0
      }
    ],
    "desc": "炼宝台 生产 法宝胚（剑丸玻璃祭炼）（耗时 45s）"
  },
  "rcp_188": {
    "id": "rcp_188",
    "canonicalId": "RCP_188",
    "name": "碎丹聚宝",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 55,
    "power": 45,
    "input": {
      "item": "mat_077",
      "amount": 1,
      "ratePerMin": 1.09,
      "name": "金丹碎片"
    },
    "output": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.09,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_077",
        "count": 1,
        "rate": 1.09,
        "form": "实体"
      },
      {
        "item": "mat_053",
        "count": 1,
        "rate": 1.09,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 1,
        "rate": 1.09,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.09
      },
      {
        "item": "mat_083",
        "count": 3,
        "rate": 3.27
      }
    ],
    "desc": "炼宝台 生产 碎丹聚宝（耗时 55s）"
  },
  "rcp_189": {
    "id": "rcp_189",
    "canonicalId": "RCP_189",
    "name": "法宝胚（木架橡胶封装）",
    "category": "灵根、法宝与金丹核心",
    "building": "alchemy_table",
    "buildingId": "alchemy_table",
    "timeSec": 45,
    "power": 45,
    "input": {
      "item": "MAT_067",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "木架"
    },
    "output": {
      "item": "mat_072",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "法宝胚"
    },
    "inputs": [
      {
        "item": "MAT_067",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_097",
        "count": 2,
        "rate": 2.67,
        "form": "实体"
      },
      {
        "item": "mat_070",
        "count": 1,
        "rate": 1.33,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_072",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "MAT_023",
        "count": 4,
        "rate": 5.33
      }
    ],
    "desc": "炼宝台 生产 法宝胚（木架橡胶封装）（耗时 45s）"
  },
  "rcp_190": {
    "id": "rcp_190",
    "canonicalId": "RCP_190",
    "name": "探宝仪法宝组装",
    "category": "灵根、法宝与金丹核心",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 50,
    "power": 50,
    "input": {
      "item": "mat_050",
      "amount": 1,
      "ratePerMin": 1.2,
      "name": "人造灵根"
    },
    "output": {
      "item": "mat_110",
      "amount": 1,
      "ratePerMin": 1.2,
      "name": "法宝"
    },
    "inputs": [
      {
        "item": "mat_050",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "MAT_075",
        "count": 1,
        "rate": 1.2,
        "form": "实体"
      },
      {
        "item": "mat_107",
        "count": 1,
        "rate": 1.2,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_110",
        "count": 1,
        "rate": 1.2
      }
    ],
    "desc": "组装机 生产 探宝仪法宝组装（耗时 50s）"
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
    "desc": "提取器 生产 煞气灵草提纯液态煞气（耗时 30s）"
  },
  "rcp_192": {
    "id": "rcp_192",
    "canonicalId": "RCP_192",
    "name": "终局满配双倍渡劫凝丹",
    "category": "灵根、法宝与金丹核心",
    "building": "tribulation_table",
    "buildingId": "tribulation_table",
    "timeSec": 120,
    "power": 80,
    "input": {
      "item": "mat_084",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "生丹"
    },
    "output": {
      "item": "mat_085",
      "amount": 2,
      "ratePerMin": 1.0,
      "name": "人造金丹"
    },
    "inputs": [
      {
        "item": "mat_084",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_110",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_109",
        "count": 1,
        "rate": 0.5,
        "form": "实体"
      },
      {
        "item": "mat_108",
        "count": 2,
        "rate": 1.0,
        "form": "液体"
      }
    ],
    "outputs": [
      {
        "item": "mat_085",
        "count": 2,
        "rate": 1.0
      },
      {
        "item": "MAT_023",
        "count": 20,
        "rate": 10.0
      }
    ],
    "desc": "渡劫台 生产 终局满配双倍渡劫凝丹（耗时 120s）"
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
  "rcp_016": "RCP_016",
  "rcp_017": "RCP_017",
  "rcp_018": "RCP_018",
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
  "rcp_036": "RCP_036",
  "rcp_037": "RCP_037",
  "rcp_038": "RCP_038",
  "rcp_039": "RCP_039",
  "rcp_040": "RCP_040",
  "rcp_041": "RCP_041",
  "rcp_042": "RCP_042",
  "rcp_043": "RCP_043",
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
  "rcp_064": "RCP_064",
  "rcp_065": "RCP_065",
  "rcp_066": "RCP_066",
  "rcp_067": "RCP_067",
  "rcp_068": "RCP_068",
  "rcp_069": "RCP_069",
  "rcp_070": "RCP_070",
  "rcp_071": "RCP_071",
  "rcp_072": "RCP_072",
  "rcp_073": "RCP_073",
  "rcp_074": "RCP_074",
  "rcp_075": "RCP_075",
  "rcp_076": "RCP_076",
  "rcp_077": "RCP_077",
  "rcp_078": "RCP_078",
  "rcp_079": "RCP_079",
  "rcp_080": "RCP_080",
  "rcp_081": "RCP_081",
  "rcp_082": "RCP_082",
  "rcp_083": "RCP_083",
  "rcp_084": "RCP_084",
  "rcp_085": "RCP_085",
  "rcp_086": "RCP_086",
  "rcp_087": "RCP_087",
  "rcp_088": "RCP_088",
  "rcp_089": "RCP_089",
  "rcp_090": "RCP_090",
  "rcp_091": "RCP_091",
  "rcp_092": "RCP_092",
  "rcp_093": "RCP_093",
  "rcp_094": "RCP_094",
  "rcp_095": "RCP_095",
  "rcp_096": "RCP_096",
  "rcp_097": "RCP_097",
  "rcp_098": "RCP_098",
  "rcp_099": "RCP_099",
  "rcp_100": "RCP_100",
  "rcp_101": "RCP_101",
  "rcp_102": "RCP_102",
  "rcp_103": "RCP_103",
  "rcp_104": "RCP_104",
  "rcp_105": "RCP_105",
  "rcp_106": "RCP_106",
  "rcp_107": "RCP_107",
  "rcp_108": "RCP_108",
  "rcp_109": "RCP_109",
  "rcp_110": "RCP_110",
  "rcp_111": "RCP_111",
  "rcp_112": "RCP_112",
  "rcp_113": "RCP_113",
  "rcp_114": "RCP_114",
  "rcp_115": "RCP_115",
  "rcp_116": "RCP_116",
  "rcp_117": "RCP_117",
  "rcp_118": "RCP_118",
  "rcp_119": "RCP_119",
  "rcp_120": "RCP_120",
  "rcp_121": "RCP_121",
  "rcp_122": "RCP_122",
  "rcp_123": "RCP_123",
  "rcp_124": "RCP_124",
  "rcp_125": "RCP_125",
  "rcp_126": "RCP_126",
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
  "rcp_141": "RCP_141",
  "rcp_142": "RCP_142",
  "rcp_143": "RCP_143",
  "rcp_144": "RCP_144",
  "rcp_145": "RCP_145",
  "rcp_146": "RCP_146",
  "rcp_147": "RCP_147",
  "rcp_148": "RCP_148",
  "rcp_149": "RCP_149",
  "rcp_150": "RCP_150",
  "rcp_151": "RCP_151",
  "rcp_152": "RCP_152",
  "rcp_153": "RCP_153",
  "rcp_154": "RCP_154",
  "rcp_155": "RCP_155",
  "rcp_156": "RCP_156",
  "rcp_157": "RCP_157",
  "rcp_158": "RCP_158",
  "rcp_159": "RCP_159",
  "rcp_160": "RCP_160",
  "rcp_161": "RCP_161",
  "rcp_162": "RCP_162",
  "rcp_163": "RCP_163",
  "rcp_164": "RCP_164",
  "rcp_165": "RCP_165",
  "rcp_166": "RCP_166",
  "rcp_167": "RCP_167",
  "rcp_168": "RCP_168",
  "rcp_169": "RCP_169",
  "rcp_170": "RCP_170",
  "rcp_171": "RCP_171",
  "rcp_172": "RCP_172",
  "rcp_173": "RCP_173",
  "rcp_174": "RCP_174",
  "rcp_175": "RCP_175",
  "rcp_176": "RCP_176",
  "rcp_177": "RCP_177",
  "rcp_178": "RCP_178",
  "rcp_179": "RCP_179",
  "rcp_180": "RCP_180",
  "rcp_181": "RCP_181",
  "rcp_182": "RCP_182",
  "rcp_183": "RCP_183",
  "rcp_184": "RCP_184",
  "rcp_185": "RCP_185",
  "rcp_186": "RCP_186",
  "rcp_187": "RCP_187",
  "rcp_188": "RCP_188",
  "rcp_189": "RCP_189",
  "rcp_190": "RCP_190",
  "rcp_191": "RCP_191",
  "rcp_192": "RCP_192"
};
const XIUXIAN_CANONICAL_TO_RECIPE_KEY = {};
Object.entries(XIUXIAN_RECIPE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_RECIPE_KEY[v] = k; });

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
  "bd_163": "BD_163"
};
const XIUXIAN_CANONICAL_TO_BUILDING_KEY = {};
Object.entries(XIUXIAN_BUILDING_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_BUILDING_KEY[v] = k; });

const XIUXIAN_MILESTONES = XIUXIAN_STAGES;

if (typeof window !== "undefined") {
  window.XIUXIAN_ITEMS = XIUXIAN_ITEMS;
  window.XIUXIAN_BUILDINGS = XIUXIAN_BUILDINGS;
  window.XIUXIAN_RECIPES = XIUXIAN_RECIPES;
  window.XIUXIAN_RECIPE_CANONICAL_IDS = XIUXIAN_RECIPE_CANONICAL_IDS;
  window.XIUXIAN_CANONICAL_TO_RECIPE_KEY = XIUXIAN_CANONICAL_TO_RECIPE_KEY;
  window.XIUXIAN_BUILDING_CANONICAL_IDS = XIUXIAN_BUILDING_CANONICAL_IDS;
  window.XIUXIAN_CANONICAL_TO_BUILDING_KEY = XIUXIAN_CANONICAL_TO_BUILDING_KEY;
  window.XIUXIAN_TIERS = XIUXIAN_TIERS;
  window.XIUXIAN_STAGES = XIUXIAN_STAGES;
  window.XIUXIAN_MILESTONES = XIUXIAN_MILESTONES;
  window.INITIAL_PLAYER_INVENTORY = INITIAL_PLAYER_INVENTORY;
}

if (typeof module !== "undefined") {
  module.exports = { XIUXIAN_ITEMS, XIUXIAN_BUILDINGS, XIUXIAN_RECIPES, XIUXIAN_RECIPE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_RECIPE_KEY, XIUXIAN_BUILDING_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_BUILDING_KEY, XIUXIAN_TIERS, XIUXIAN_STAGES, XIUXIAN_MILESTONES, INITIAL_PLAYER_INVENTORY };
}
