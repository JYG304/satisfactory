// ==========================================================================
// 《修仙工厂》官方策划数据表 (严格对照 策划案_V1_最终整合版.xlsx 与 配置.txt)
// ==========================================================================

const XIUXIAN_ITEMS = {
  "iron_ore": {
    "id": "iron_ore",
    "matId": "MAT_001",
    "name": "玄铁矿",
    "category": "矿物原料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-stone-400",
    "desc": "BD_136精炼炉；BD_137粉碎机等",
    "stack": 100
  },
  "copper_ore": {
    "id": "copper_ore",
    "matId": "MAT_002",
    "name": "赤铜矿",
    "category": "矿物原料",
    "form": "实体",
    "icon": "fa-solid fa-gem text-amber-600",
    "desc": "BD_136精炼炉；BD_139切割机链",
    "stack": 100
  },
  "coal": {
    "id": "coal",
    "matId": "MAT_004",
    "name": "煤炭",
    "category": "基础燃料",
    "form": "实体",
    "icon": "fa-solid fa-cubes text-zinc-600",
    "desc": "BD_149燃料发电机；能源系统",
    "stack": 100
  },
  "iron_ingot": {
    "id": "iron_ingot",
    "matId": "MAT_006",
    "name": "玄铁锭",
    "category": "金属中间件",
    "form": "实体",
    "icon": "fa-solid fa-square text-stone-300",
    "desc": "玄铁板、玄铁齿轮、玄铁梁、玄铁粉和精炼玄铁锭生产",
    "stack": 100
  },
  "copper_ingot": {
    "id": "copper_ingot",
    "matId": "MAT_007",
    "name": "赤铜锭",
    "category": "金属中间件",
    "form": "实体",
    "icon": "fa-solid fa-square text-amber-500",
    "desc": "BD_139切割机；生物/机器零件链",
    "stack": 100
  },
  "iron_plate": {
    "id": "iron_plate",
    "matId": "MAT_008",
    "name": "玄铁板",
    "category": "建筑与机器材料",
    "form": "实体",
    "icon": "fa-solid fa-sheet-plastic text-stone-300",
    "desc": "建筑底座、传送与分流建筑、抽水机、采矿/精炼/粉碎/加工/切割设备、冶炼舱、操作台和置物桌建造",
    "stack": 100
  },
  "iron_powder": {
    "id": "iron_powder",
    "matId": "MAT_009",
    "name": "玄铁粉",
    "category": "金属中间件",
    "form": "实体",
    "icon": "fa-solid fa-braille text-zinc-400",
    "desc": "耐火炉芯、设备框架和净化材料的消耗量按建筑表固定配方执行",
    "stack": 100
  },
  "iron_gear": {
    "id": "iron_gear",
    "matId": "MAT_011",
    "name": "玄铁齿轮",
    "category": "机器零件",
    "form": "实体",
    "icon": "fa-solid fa-gear text-stone-300",
    "desc": "基础物流、采矿/精炼/粉碎/加工设备、设备管件、设备框架和灵磁齿轮生产",
    "stack": 100
  },
  "lingci_gear": {
    "id": "lingci_gear",
    "matId": "MAT_012",
    "name": "灵磁齿轮",
    "category": "机器零件",
    "form": "实体",
    "icon": "fa-solid fa-gear text-cyan-400 animate-spin",
    "desc": "采矿、粉碎、切割、组装、冶炼和发电建筑的设备传动件",
    "stack": 100
  },
  "ling_copper_sheet": {
    "id": "ling_copper_sheet",
    "matId": "MAT_013",
    "name": "导灵铜片",
    "category": "精密/导灵材料",
    "form": "实体",
    "icon": "fa-solid fa-layer-group text-yellow-300",
    "desc": "电子生物芯片、基础控制模块和精密自动配方；BD_138加工台矿脉定位件",
    "stack": 100
  },
  "iron_beam": {
    "id": "iron_beam",
    "matId": "MAT_014",
    "name": "玄铁梁",
    "category": "建筑结构件",
    "form": "实体",
    "icon": "fa-solid fa-cubes-stacked text-stone-400",
    "desc": "建筑底座、支撑、设备框架、后续灵能建筑（本版不启用）和风力发电机建造",
    "stack": 100
  },
  "device_interface": {
    "id": "device_interface",
    "matId": "MAT_015",
    "name": "设备接口件",
    "category": "建筑通用零件",
    "form": "实体",
    "icon": "fa-solid fa-network-wired text-sky-400",
    "desc": "通用设备接口；不承担生物加工功能",
    "stack": 100
  },
  "electric_coil": {
    "id": "electric_coil",
    "matId": "MAT_016",
    "name": "导电线圈",
    "category": "电力零件",
    "form": "实体",
    "icon": "fa-solid fa-spinner text-yellow-400",
    "desc": "电能核心、风力发电机和控制设备的通用电力零件",
    "stack": 100
  },
  "basic_control_module": {
    "id": "basic_control_module",
    "matId": "MAT_017",
    "name": "基础控制模块",
    "category": "控制零件",
    "form": "实体",
    "icon": "fa-solid fa-microchip text-emerald-400",
    "desc": "智能物流、加工台、组装机和能源建筑的通用控制零件；BD_138加工台矿脉定位件",
    "stack": 100
  },
  "bio_chip": {
    "id": "bio_chip",
    "matId": "MAT_018",
    "name": "电子生物芯片",
    "category": "生物电子零件",
    "form": "实体",
    "icon": "fa-solid fa-memory text-purple-400",
    "desc": "电子生物芯片是生物与机器之间的控制元件，不是普通生物材料",
    "stack": 100
  },
  "copper_wire": {
    "id": "copper_wire",
    "matId": "MAT_019",
    "name": "铜线",
    "category": "基础机器零件",
    "form": "实体",
    "icon": "fa-solid fa-ring text-amber-500",
    "desc": "导电线圈、基础控制模块、智能物流和风力发电机建造",
    "stack": 100
  },
  "cultivator_corpse": {
    "id": "cultivator_corpse",
    "matId": "MAT_020",
    "name": "练气修士尸体",
    "category": "生物原料",
    "form": "实体",
    "icon": "fa-solid fa-user-injured text-rose-400",
    "desc": "BD_140解构机输入；装箱和转运不消耗尸体；当前版不开放养殖",
    "stack": 10
  },
  "foundation_corpse": {
    "id": "foundation_corpse",
    "matId": "MAT_055",
    "name": "筑基修士尸体",
    "category": "生物原料",
    "form": "实体",
    "icon": "fa-solid fa-user-shield text-indigo-400",
    "desc": "BD_140解构机输入；筑基阶段提高生物材料产量；当前版不开放养殖",
    "stack": 10
  },
  "jindan_corpse": {
    "id": "jindan_corpse",
    "matId": "MAT_056",
    "name": "金丹修士尸体",
    "category": "剧情生物原料",
    "form": "实体",
    "icon": "fa-solid fa-user-astronaut text-amber-300",
    "desc": "触发世界观解析、取得剑匣并提供第一批生物材料",
    "stack": 10
  },
  "living_tissue": {
    "id": "living_tissue",
    "matId": "MAT_021",
    "name": "鲜活生物组织",
    "category": "生物中间件",
    "form": "实体",
    "icon": "fa-solid fa-dna text-rose-500",
    "desc": "提取器的固体输入；不直接作为人造灵根终配物",
    "stack": 100
  },
  "neural_bundle": {
    "id": "neural_bundle",
    "matId": "MAT_022",
    "name": "神经束",
    "category": "生物中间件",
    "form": "实体",
    "icon": "fa-solid fa-network-wired text-indigo-300",
    "desc": "电子生物芯片和解析数据的神经材料来源",
    "stack": 100
  },
  "analysis_data": {
    "id": "analysis_data",
    "matId": "MAT_023",
    "name": "解析数据",
    "category": "研究产物",
    "form": "数字记录",
    "icon": "fa-solid fa-database text-sky-300",
    "desc": "解析数据提交中央处理器后转研究点，用于里程碑和配方解锁；不是背包物料",
    "stack": 100
  },
  "dry_tissue": {
    "id": "dry_tissue",
    "matId": "MAT_024",
    "name": "脱水生物组织",
    "category": "生物中间件",
    "form": "实体",
    "icon": "fa-solid fa-bone text-stone-300",
    "desc": "组装机制作生物胚料的固体输入",
    "stack": 100
  },
  "tissue_essence": {
    "id": "tissue_essence",
    "matId": "MAT_025",
    "name": "组织精华液",
    "category": "生物液体",
    "form": "液体",
    "icon": "fa-solid fa-eye-dropper text-amber-300",
    "desc": "生物复合板与法宝稳脉液的高级液体输入",
    "stack": 50
  },
  "protein_fluid": {
    "id": "protein_fluid",
    "matId": "MAT_026",
    "name": "组织蛋白液",
    "category": "生物液体",
    "form": "液体",
    "icon": "fa-solid fa-flask-vial text-rose-300",
    "desc": "搅拌机的蛋白来源；副产生物浑浊废液",
    "stack": 50
  },
  "basic_nutrient": {
    "id": "basic_nutrient",
    "matId": "MAT_027",
    "name": "基础营养液",
    "category": "生物液体",
    "form": "液体",
    "icon": "fa-solid fa-bottle-water text-emerald-400",
    "desc": "培养皿和培育仓的液体输入",
    "stack": 50
  },
  "ling_grass_seed": {
    "id": "ling_grass_seed",
    "matId": "MAT_028",
    "name": "灵草种子",
    "category": "种植原料",
    "form": "实体",
    "icon": "fa-solid fa-seedling text-emerald-300",
    "desc": "BD_141培养皿；只在首次投产或补损时需要外部种子",
    "stack": 100
  },
  "mature_ling_grass": {
    "id": "mature_ling_grass",
    "matId": "MAT_029",
    "name": "成熟灵草",
    "category": "生物原料",
    "form": "实体",
    "icon": "fa-solid fa-spa text-emerald-400",
    "desc": "后续生物加工与培养循环；供提取器制作灵草萃取液",
    "stack": 100
  },
  "nutrient_sediment": {
    "id": "nutrient_sediment",
    "matId": "MAT_030",
    "name": "营养沉淀物",
    "category": "生物中间件",
    "form": "实体",
    "icon": "fa-solid fa-mortar-pestle text-lime-400",
    "desc": "培育仓基础/增产配方和废液净化粉配方的固体输入",
    "stack": 100
  },
  "ling_grass_extract": {
    "id": "ling_grass_extract",
    "matId": "MAT_031",
    "name": "灵草萃取液",
    "category": "生物液体",
    "form": "液体",
    "icon": "fa-solid fa-vial text-emerald-500",
    "desc": "BD_143搅拌机→活性生物混合液；BD_143搅拌机→基础营养液回流配方",
    "stack": 50
  },
  "bio_mix_liquid": {
    "id": "bio_mix_liquid",
    "matId": "MAT_032",
    "name": "活性生物混合液",
    "category": "生物液体",
    "form": "液体",
    "icon": "fa-solid fa-vials text-teal-300",
    "desc": "离心机的输入；也可作为培育仓增产液",
    "stack": 50
  },
  "raw_water": {
    "id": "raw_water",
    "matId": "MAT_033",
    "name": "水源",
    "category": "基础流体",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-blue-400",
    "desc": "基础水体，供液冷、稀释与溶液配制",
    "stack": 50
  },
  "bio_turbid_waste": {
    "id": "bio_turbid_waste",
    "matId": "MAT_034",
    "name": "生物浑浊废液",
    "category": "废液",
    "form": "液体",
    "icon": "fa-solid fa-triangle-exclamation text-amber-600",
    "desc": "生物反应产出的浊性废液，需过滤净化",
    "stack": 50
  },
  "active_cell_cluster": {
    "id": "active_cell_cluster",
    "matId": "MAT_035",
    "name": "活性细胞团",
    "category": "生物材料",
    "form": "实体",
    "icon": "fa-solid fa-viruses text-pink-400",
    "desc": "生物复合胚料与人造灵根的核心载体",
    "stack": 100
  },
  "sha_corrupt_liquid": {
    "id": "sha_corrupt_liquid",
    "matId": "MAT_036",
    "name": "煞气腐化废液",
    "category": "废液",
    "form": "液体",
    "icon": "fa-solid fa-skull text-violet-500",
    "desc": "含煞废液，需由净化台进行固液分离",
    "stack": 50
  },
  "waste_purify_powder": {
    "id": "waste_purify_powder",
    "matId": "MAT_037",
    "name": "废液净化粉",
    "category": "环保中间件",
    "form": "实体",
    "icon": "fa-solid fa-broom text-teal-200",
    "desc": "固体处理剂；当前本版只使用电能",
    "stack": 100
  },
  "recycled_pure_water": {
    "id": "recycled_pure_water",
    "matId": "MAT_038",
    "name": "回用净化水",
    "category": "循环水",
    "form": "液体",
    "icon": "fa-solid fa-droplet text-cyan-300",
    "desc": "可回用工艺水；不与地图原水混名；不作为回收处理塔自身输入",
    "stack": 50
  },
  "purify_residue": {
    "id": "purify_residue",
    "matId": "MAT_040",
    "name": "净化残渣",
    "category": "环保副产物",
    "form": "实体",
    "icon": "fa-solid fa-trash-can text-stone-500",
    "desc": "加工台回收为废液净化粉；也可作为后续灵能建筑（本版不启用）当前燃料；不作为燃料发电机输入",
    "stack": 100
  },
  "device_control_plugin": {
    "id": "device_control_plugin",
    "matId": "MAT_041",
    "name": "设备控制插件",
    "category": "高级控制件",
    "form": "实体",
    "icon": "fa-solid fa-plug-circle-check text-cyan-300",
    "desc": "设备控制插件；不是一次性剧情组件",
    "stack": 100
  },
  "bio_composite_plate": {
    "id": "bio_composite_plate",
    "matId": "MAT_042",
    "name": "生物复合板",
    "category": "高级材料",
    "form": "实体",
    "icon": "fa-solid fa-shield text-purple-300",
    "desc": "人造灵根与法宝阵图胚共用的生物结构材料",
    "stack": 100
  },
  "high_temp_alloy_ingot": {
    "id": "high_temp_alloy_ingot",
    "matId": "MAT_043",
    "name": "高温合金锭",
    "category": "高级金属",
    "form": "实体",
    "icon": "fa-solid fa-fire text-orange-400",
    "desc": "筑基高温冶炼材料；当前用电能提供热量；供动力核心、炼宝台和渡劫台使用",
    "stack": 100
  },
  "device_frame": {
    "id": "device_frame",
    "matId": "MAT_044",
    "name": "设备框架",
    "category": "建筑材料",
    "form": "实体",
    "icon": "fa-solid fa-box text-blue-300",
    "desc": "各加工建筑建造；人造灵根产线设备建造",
    "stack": 100
  },
  "refractory_core": {
    "id": "refractory_core",
    "matId": "MAT_045",
    "name": "耐火炉芯",
    "category": "炉体构件",
    "form": "实体",
    "icon": "fa-solid fa-fire-burner text-orange-500",
    "desc": "精炼炉、冶炼舱、燃料发电机的通用高温核心件",
    "stack": 100
  },
  "device_pipe": {
    "id": "device_pipe",
    "matId": "MAT_046",
    "name": "设备管件",
    "category": "通用机械零件",
    "form": "实体",
    "icon": "fa-solid fa-faucet text-sky-300",
    "desc": "水管、抽水机和流体建筑的通用管件",
    "stack": 100
  },
  "circulating_pump": {
    "id": "circulating_pump",
    "matId": "MAT_047",
    "name": "循环水泵",
    "category": "流体机械",
    "form": "实体",
    "icon": "fa-solid fa-arrows-spin text-blue-400",
    "desc": "培育仓的循环水路通用泵件",
    "stack": 100
  },
  "bio_filter_core": {
    "id": "bio_filter_core",
    "matId": "MAT_048",
    "name": "生物蛋白滤芯",
    "category": "过滤元件",
    "form": "实体",
    "icon": "fa-solid fa-filter text-rose-300",
    "desc": "提取器×2、回收处理塔×3；先满足首台提取器建造，再持续补充净化设备滤芯",
    "stack": 100
  },
  "general_purify_core": {
    "id": "general_purify_core",
    "matId": "MAT_049",
    "name": "通用净化核心",
    "category": "环保构件",
    "form": "实体",
    "icon": "fa-solid fa-sun text-yellow-300",
    "desc": "通用净化与稳定核心；本版只使用电能",
    "stack": 100
  },
  "power_core": {
    "id": "power_core",
    "matId": "MAT_050",
    "name": "电能核心",
    "category": "电力构件",
    "form": "实体",
    "icon": "fa-solid fa-bolt text-yellow-400",
    "desc": "当前电网稳压组件；不储电，不消耗灵石",
    "stack": 100
  },
  "refined_iron_ingot": {
    "id": "refined_iron_ingot",
    "matId": "MAT_051",
    "name": "精炼玄铁锭",
    "category": "高级金属",
    "form": "实体",
    "icon": "fa-solid fa-cube text-slate-100",
    "desc": "高温加工前置；BD_148制作高温合金锭和导脉合金",
    "stack": 100
  },
  "log": {
    "id": "log",
    "matId": "MAT_052",
    "name": "原木",
    "category": "基础材料",
    "form": "实体",
    "icon": "fa-solid fa-tree text-amber-700",
    "desc": "楼梯、操作台、置物桌建造；可加工为木板和木结构件；可作为低阶燃料",
    "stack": 100
  },
  "device_drive_part": {
    "id": "device_drive_part",
    "matId": "MAT_053",
    "name": "设备传动件",
    "category": "机械零件",
    "form": "实体",
    "icon": "fa-solid fa-cog text-stone-300",
    "desc": "传送带、交叉器、合流/分流和限速设备的通用传动件",
    "stack": 100
  },
  "artificial_linggen": {
    "id": "artificial_linggen",
    "matId": "MAT_054",
    "name": "人造灵根原型",
    "category": "终极构件",
    "form": "实体",
    "icon": "fa-solid fa-atom text-yellow-300 animate-spin",
    "desc": "造化金身供料与筑基突破的终极成果",
    "stack": 100
  },
  "bio_embryo": {
    "id": "bio_embryo",
    "matId": "MAT_057",
    "name": "生物胚料",
    "category": "高级生物",
    "form": "实体",
    "icon": "fa-solid fa-egg text-pink-300",
    "desc": "生物复合板的前置固体材料",
    "stack": 100
  },
  "bio_control_core": {
    "id": "bio_control_core",
    "matId": "MAT_058",
    "name": "生物控制芯",
    "category": "高级构件",
    "form": "实体",
    "icon": "fa-solid fa-brain text-purple-300",
    "desc": "设备控制插件和主控核心的控制链中间件",
    "stack": 100
  },
  "purify_filter_set": {
    "id": "purify_filter_set",
    "matId": "MAT_059",
    "name": "净化滤芯组",
    "category": "过滤元件",
    "form": "实体",
    "icon": "fa-solid fa-boxes-stacked text-teal-300",
    "desc": "通用净化核心的固体前置；当前本版只使用电能",
    "stack": 100
  },
  "linggen_core_material": {
    "id": "linggen_core_material",
    "matId": "MAT_060",
    "name": "灵根芯材",
    "category": "灵根构件",
    "form": "实体",
    "icon": "fa-solid fa-cubes text-yellow-200",
    "desc": "人造灵根的生物/电子复合核心",
    "stack": 100
  },
  "power_drive_core": {
    "id": "power_drive_core",
    "matId": "MAT_061",
    "name": "动力核心",
    "category": "动力构件",
    "form": "实体",
    "icon": "fa-solid fa-gauge-high text-red-400",
    "desc": "电力版高负载动力组件，不使用灵石",
    "stack": 100
  },
  "main_control_core": {
    "id": "main_control_core",
    "matId": "MAT_062",
    "name": "主控核心",
    "category": "核心构件",
    "form": "实体",
    "icon": "fa-solid fa-microchip text-indigo-400",
    "desc": "人造灵根终配的控制核心",
    "stack": 100
  },
  "linggen_embryo": {
    "id": "linggen_embryo",
    "matId": "MAT_063",
    "name": "灵根胚体",
    "category": "灵根构件",
    "form": "实体",
    "icon": "fa-solid fa-certificate text-amber-200",
    "desc": "人造灵根最终组装前置",
    "stack": 100
  },
  "device_skeleton": {
    "id": "device_skeleton",
    "matId": "MAT_064",
    "name": "设备骨架",
    "category": "基础框架",
    "form": "实体",
    "icon": "fa-solid fa-border-all text-stone-400",
    "desc": "BD_138加工台→设备框架",
    "stack": 100
  },
  "drive_skeleton": {
    "id": "drive_skeleton",
    "matId": "MAT_065",
    "name": "传动骨架",
    "category": "基础传动",
    "form": "实体",
    "icon": "fa-solid fa-sitemap text-stone-400",
    "desc": "BD_138加工台→设备传动件",
    "stack": 100
  },
  "wood_plank": {
    "id": "wood_plank",
    "matId": "MAT_066",
    "name": "木板",
    "category": "木质建材",
    "form": "实体",
    "icon": "fa-solid fa-bars text-amber-600",
    "desc": "原木切割出的工程平整木板",
    "stack": 100
  },
  "wood_structural_part": {
    "id": "wood_structural_part",
    "matId": "MAT_067",
    "name": "木结构件",
    "category": "木质构件",
    "form": "实体",
    "icon": "fa-solid fa-hammer text-amber-700",
    "desc": "建材支线；榫卯木构件，用于木构支撑",
    "stack": 100
  },
  "charcoal_ash": {
    "id": "charcoal_ash",
    "matId": "MAT_068",
    "name": "木炭灰",
    "category": "燃烧副产物",
    "form": "实体",
    "icon": "fa-solid fa-volcano text-zinc-500",
    "desc": "燃料发电机木燃料模式副产；用于培养与催化，不是灵力材料",
    "stack": 100
  },
  "wiring_assembly": {
    "id": "wiring_assembly",
    "matId": "MAT_069",
    "name": "接线组件",
    "category": "电气构件",
    "form": "实体",
    "icon": "fa-solid fa-diagram-project text-blue-400",
    "desc": "接线和维修用组件；不负责储能",
    "stack": 100
  },
  "power_supply_module": {
    "id": "power_supply_module",
    "matId": "MAT_070",
    "name": "电源模块",
    "category": "电气构件",
    "form": "实体",
    "icon": "fa-solid fa-car-battery text-amber-400",
    "desc": "电网接入和设备供电用模块；不储存电能",
    "stack": 100
  },
  "sha_crystal": {
    "id": "sha_crystal",
    "matId": "MAT_071",
    "name": "煞气结晶",
    "category": "煞气资源",
    "form": "实体",
    "icon": "fa-solid fa-gem text-violet-400",
    "desc": "煞气浓缩固化后的高能晶体，用于高阶法宝合成，不是灵石",
    "stack": 100
  },
  "daomai_alloy": {
    "id": "daomai_alloy",
    "matId": "MAT_072",
    "name": "导脉合金",
    "category": "法宝合金",
    "form": "实体",
    "icon": "fa-solid fa-square text-violet-300",
    "desc": "法宝内部导流合金；与矿脉定位件不是同一类材料",
    "stack": 100
  },
  "daomai_sheet": {
    "id": "daomai_sheet",
    "matId": "MAT_073",
    "name": "导脉薄片",
    "category": "法宝材料",
    "form": "实体",
    "icon": "fa-solid fa-layer-group text-violet-200",
    "desc": "导脉合金切割后的法宝导流薄片",
    "stack": 100
  },
  "fabao_pulse_liquid": {
    "id": "fabao_pulse_liquid",
    "matId": "MAT_074",
    "name": "法宝稳脉液",
    "category": "法宝流体",
    "form": "液体",
    "icon": "fa-solid fa-flask text-violet-400",
    "desc": "高级液体；只进入法宝阵图胚配方",
    "stack": 50
  },
  "ore_vein_locator": {
    "id": "ore_vein_locator",
    "matId": "MAT_075",
    "name": "矿脉定位件",
    "category": "空间定位",
    "form": "实体",
    "icon": "fa-solid fa-compass text-sky-400",
    "desc": "定位已发现矿脉节点，不复制资源",
    "stack": 100
  },
  "fabao_array_embryo": {
    "id": "fabao_array_embryo",
    "matId": "MAT_076",
    "name": "法宝阵图胚",
    "category": "法宝中间件",
    "form": "实体",
    "icon": "fa-solid fa-scroll text-yellow-400",
    "desc": "绑定前可运输的法宝中间态",
    "stack": 100
  },
  "sha_concentrate_liquid": {
    "id": "sha_concentrate_liquid",
    "matId": "MAT_077",
    "name": "煞气浓缩液",
    "category": "煞气物流",
    "form": "液体",
    "icon": "fa-solid fa-skull-crossbones text-purple-600",
    "desc": "地图产生的环境煞气经回收处理塔浓缩后的液体；可走水管",
    "stack": 50
  },

  // --- 法宝状态件 (严格对照 sheet003.htm) ---
  "artifact_state_001": {
    "id": "artifact_state_001",
    "matId": "ART_STATE_001",
    "name": "山河社稷图·渡劫前置态",
    "category": "法宝状态件",
    "form": "实体",
    "icon": "fa-solid fa-scroll text-yellow-300",
    "desc": "完成三阶注灵，注入1000煞气浓缩液后的渡劫前置态法宝",
    "stack": 1
  },
  "artifact_001": {
    "id": "artifact_001",
    "matId": "ART_001",
    "name": "山河社稷图完成态",
    "category": "本命法宝",
    "form": "实体",
    "icon": "fa-solid fa-crown text-amber-400",
    "desc": "历经九重天劫洗礼，完美度100%的极品后天灵宝",
    "stack": 1
  }
};

// 注入官方程序键与官方MAT编码双向映射，确保全项目任意键名索引均 100% 准确
(function setupOfficialItemAliases() {
  const aliases = {
    // 官方程序键与旧键映射
    "xuantie_ore": "iron_ore",
    "chitong_ore": "copper_ore",
    "xuantie_ingot": "iron_ingot",
    "chitong_ingot": "copper_ingot",
    "xuantie_plate": "iron_plate",
    "xuantie_powder": "iron_powder",
    "xuantie_gear": "iron_gear",
    "spirit_magnetic_gear": "lingci_gear",
    "spirit_guiding_copper_sheet": "ling_copper_sheet",
    "xuantie_beam": "iron_beam",
    "mat_universal_interface": "device_interface",
    "spirit_coil": "electric_coil",
    "ling_coil": "electric_coil",
    "control_module": "basic_control_module",
    "cultivator_corpse_qi": "cultivator_corpse",
    "cultivator_corpse_foundation": "foundation_corpse",
    "cultivator_corpse_core": "jindan_corpse",
    "neural_tissue": "neural_bundle",
    "mat_research_sample": "analysis_data",
    "bio_tissue_material": "dry_tissue",
    "bio_essence": "tissue_essence",
    "bio_protein_fluid": "protein_fluid",
    "tissue_protein_fluid": "protein_fluid",
    "nutrient_culture_fluid": "basic_nutrient",
    "basic_nutrient_fluid": "basic_nutrient",
    "spirit_herb_seed": "ling_grass_seed",
    "lingcao_seed": "ling_grass_seed",
    "active_spirit_plant": "mature_ling_grass",
    "mature_lingcao": "mature_ling_grass",
    "centrifuged_biomass": "nutrient_sediment",
    "spirit_plant_extract": "ling_grass_extract",
    "lingcao_extract": "ling_grass_extract",
    "bio_mixture": "bio_mix_liquid",
    "clean_water": "raw_water",
    "bio_residue": "bio_turbid_waste",
    "active_biomass": "active_cell_cluster",
    "active_cell_mass": "active_cell_cluster",
    "corrupted_waste_fluid": "sha_corrupt_liquid",
    "sha_corrupt_waste": "sha_corrupt_liquid",
    "purification_agent": "waste_purify_powder",
    "purified_water": "recycled_pure_water",
    "recycled_purified_water": "recycled_pure_water",
    "mat_purification_residue": "purify_residue",
    "spirit_amplifier_plugin": "device_control_plugin",
    "device_ctrl_plugin": "device_control_plugin",
    "bio_composite_material": "bio_composite_plate",
    "spirit_alloy": "high_temp_alloy_ingot",
    "xuantie_frame": "device_frame",
    "heat_resistant_furnace_core": "refractory_core",
    "common_pipe_part": "device_pipe",
    "circulation_pump": "circulating_pump",
    "circ_water_pump": "circulating_pump",
    "bio_filter": "bio_filter_core",
    "bio_protein_filter": "bio_filter_core",
    "purification_core": "general_purify_core",
    "universal_purify_core": "general_purify_core",
    "spirit_core": "power_core",
    "electric_core": "power_core",
    "refined_xuantie_ingot": "refined_iron_ingot",
    "raw_log": "log",
    "raw_wood": "log",
    "common_motion_part": "device_drive_part",
    "device_trans_part": "device_drive_part",
    "foundation_component": "artificial_linggen",
    "bio_composite_base": "bio_embryo",
    "spirit_control_core": "bio_control_core",
    "bio_ctrl_core": "bio_control_core",
    "purification_filter_assembly": "purify_filter_set",
    "bio_composite_core": "linggen_core_material",
    "spirit_power_core": "power_drive_core",
    "composite_control_core": "main_control_core",
    "main_ctrl_core": "main_control_core",
    "artificial_spirit_root_preform": "linggen_embryo",
    "xuantie_frame_base": "device_skeleton",
    "common_motion_base": "drive_skeleton",
    "trans_skeleton": "drive_skeleton",
    "wood_structure_part": "wood_structural_part",
    "wood_charcoal_ash": "charcoal_ash",
    "conductive_component": "wiring_assembly",
    "power_module": "power_supply_module",
    "sha_energy_crystal": "sha_crystal",
    "conduction_alloy": "daomai_alloy",
    "conduction_sheet": "daomai_sheet",
    "stable_pulse_liquid": "fabao_pulse_liquid",
    "fabao_pulse_fluid": "fabao_pulse_liquid",
    "grounding_locator": "ore_vein_locator",
    "pulse_locator": "ore_vein_locator",
    "array_blank": "fabao_array_embryo",
    "shaqi_concentrate_liquid": "sha_concentrate_liquid",
    "sha_concentrate_fluid": "sha_concentrate_liquid"
  };

  Object.entries(aliases).forEach(([alias, targetId]) => {
    if (XIUXIAN_ITEMS[targetId] && !XIUXIAN_ITEMS[alias]) {
      XIUXIAN_ITEMS[alias] = XIUXIAN_ITEMS[targetId];
    }
  });

  // 注入 MAT_XXX 编码直取别名
  Object.values(XIUXIAN_ITEMS).forEach(item => {
    if (item.matId && !XIUXIAN_ITEMS[item.matId]) {
      XIUXIAN_ITEMS[item.matId] = item;
    }
  });
})();

const XIUXIAN_BUILDINGS = {
  "furnace": {
    "id": "furnace",
    "code": "BD_102",
    "name": "精炼炉",
    "category": "生产",
    "typeDesc": "重工 / 基础冶炼",
    "power": 10,
    "heat": 50,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "recipes": [
      "rcp_iron_ingot",
      "rcp_copper_ingot",
      "rcp_refractory_core"
    ],
    "desc": "基础矿石冶炼设备，将玄铁矿/赤铜矿高温熔炼为金属锭。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_ingot", "need": 6 }]
  },
  "cutter": {
    "id": "cutter",
    "code": "BD_105",
    "name": "切割机",
    "category": "生产",
    "typeDesc": "重工 / 精密材料",
    "power": 12,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_copper_wire",
      "rcp_ling_copper_sheet",
      "rcp_wood_plank",
      "rcp_wood_structural_part",
      "rcp_daomai_sheet"
    ],
    "desc": "基础精密材料加工设备，将赤铜锭切割为铜线、导灵铜片，加工木板和导脉薄片。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 2 }, { "code": "iron_ingot", "need": 4 }, { "code": "iron_gear", "need": 2 }]
  },
  "assembler": {
    "id": "assembler",
    "code": "BD_104",
    "name": "加工台",
    "category": "生产",
    "typeDesc": "重工 / 机械零件",
    "power": 6,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_iron_plate",
      "rcp_iron_gear",
      "rcp_ling_magnetic_gear",
      "rcp_iron_beam",
      "rcp_device_pipe",
      "rcp_device_skeleton",
      "rcp_electric_coil",
      "rcp_basic_control_module",
      "rcp_bio_chip",
      "rcp_device_interface",
      "rcp_device_frame",
      "rcp_device_drive_part",
      "rcp_bio_composite_plate",
      "rcp_waste_purify_powder",
      "rcp_ore_vein_locator"
    ],
    "desc": "制作基础机械零件，加工玄铁板、齿轮、玄铁梁、控制模块与设备框架。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 2 }, { "code": "iron_ingot", "need": 4 }]
  },
  "crusher": {
    "id": "crusher",
    "code": "BD_103",
    "name": "粉碎机",
    "category": "生产",
    "typeDesc": "重工 / 材料粉碎",
    "power": 8,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_iron_powder"
    ],
    "desc": "将金属锭粉碎为加工中间件玄铁粉。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 1 }, { "code": "iron_ingot", "need": 2 }]
  },
  "deconstructor": {
    "id": "deconstructor",
    "code": "BD_107",
    "name": "解构机",
    "category": "生产",
    "typeDesc": "生物 / 单进多出",
    "inputPorts": "正面×1 (固体)",
    "outputPorts": "背面×2 (固体)",
    "portLogic": "1进2出 (单进多出)",
    "specialRule": "只接受修士尸体,提取鲜活组织与神经束",
    "power": 20,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_decon_lianqi",
      "rcp_decon_zhuji"
    ],
    "desc": "专门解构生物，只接受修士尸体，解构提取鲜活生物组织、神经束与脱水生物组织。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_ingot", "need": 8 }]
  },
  "miner": {
    "id": "miner",
    "code": "BD_101",
    "name": "采矿机",
    "category": "生产",
    "typeDesc": "采集 / 资源采集",
    "inputPorts": "无 (地脉资源)",
    "outputPorts": "背面×1 (固体)",
    "portLogic": "被动开采",
    "power": 5,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_mine_iron",
      "rcp_mine_copper",
      "rcp_mine_coal"
    ],
    "desc": "必须对准矿脉，持续开采地下玄铁矿、赤铜矿与煤炭。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 2 }, { "code": "iron_ingot", "need": 3 }]
  },
  "centrifuge": {
    "id": "centrifuge",
    "code": "BD_106",
    "name": "离心机",
    "category": "生产",
    "typeDesc": "生物 / 单进多出",
    "inputPorts": "正面×1 (流体)",
    "outputPorts": "左×1 (固体), 右×1 (固体)",
    "portLogic": "1进2出 (单进多出)",
    "power": 15,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_tissue_essence",
      "rcp_sha_separation"
    ],
    "desc": "分离生物液体中的不同成分，离心提取组织精华液与煞气分离。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 3 }, { "code": "iron_ingot", "need": 5 }, { "code": "copper_ingot", "need": 3 }]
  },
  "extractor": {
    "id": "extractor",
    "code": "BD_109",
    "name": "提取器",
    "category": "生产",
    "typeDesc": "生物 / 单进多出",
    "inputPorts": "正面×1 (固体)",
    "outputPorts": "背面×2 (固体)",
    "portLogic": "1进2出 (单进多出)",
    "power": 10,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_protein_fluid",
      "rcp_ling_grass_extract"
    ],
    "desc": "从生物材料中提取组织蛋白液与灵草萃取液。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 2 }, { "code": "iron_ingot", "need": 3 }, { "code": "copper_ingot", "need": 2 }]
  },
  "incubator": {
    "id": "incubator",
    "code": "BD_108",
    "name": "培育仓",
    "category": "生产",
    "typeDesc": "生物 / 多用处培育",
    "inputPorts": "正面×2 (固体+流体)",
    "outputPorts": "背面×1 (固体)",
    "portLogic": "2进1出 (流固混合)",
    "specialRule": "多用处·支持时间加速器挂载",
    "power": 8,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_mature_ling_grass",
      "rcp_ling_grass_boost",
      "rcp_cell_cultivation",
      "rcp_sediment_nutrient"
    ],
    "desc": "多用处流固混合培育设备，具备灵草基础培育、催生增产闭环、细胞扩增及养分沉淀发酵四大核心功能，支持时间加速器挂载。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_ingot", "need": 6 }, { "code": "copper_ingot", "need": 4 }]
  },
  "mixer": {
    "id": "mixer",
    "code": "BD_110",
    "name": "搅拌机",
    "category": "生产",
    "typeDesc": "生物 / 多进单出",
    "inputPorts": "正面×2 (固体/流体)",
    "outputPorts": "背面×1 (固体)",
    "portLogic": "2进1出 (多进单出)",
    "specialRule": "流体/固体混合调配",
    "power": 14,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_basic_nutrient",
      "rcp_bio_mix_liquid",
      "rcp_fabao_pulse_liquid"
    ],
    "desc": "流体/固体混合处理，合成基础营养液、活性生物混合液与法宝稳脉液。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 3 }, { "code": "iron_ingot", "need": 4 }, { "code": "iron_gear", "need": 2 }]
  },
  "assembler_heavy": {
    "id": "assembler_heavy",
    "code": "BD_111",
    "name": "组装机",
    "category": "生产",
    "typeDesc": "重工 / 多进单出",
    "inputPorts": "正面×2 (固体)",
    "outputPorts": "背面×1 (固体)",
    "portLogic": "2进1出 (多进单出)",
    "specialRule": "双轨物料校验,错误弹飞",
    "power": 25,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": false,
    "hasHeaterGlow": false,
    "recipes": [
      "rcp_bio_embryo",
      "rcp_linggen_core_material",
      "rcp_linggen_embryo",
      "rcp_artificial_linggen",
      "rcp_fabao_array_embryo"
    ],
    "desc": "双轨物料校验组装，合成生物胚料、灵根胚体、人造灵根与法宝阵图胚。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 6 }, { "code": "iron_ingot", "need": 10 }, { "code": "copper_ingot", "need": 6 }, { "code": "iron_gear", "need": 4 }]
  },
  "power_engine": {
    "id": "power_engine",
    "code": "BD_112",
    "name": "灵力引擎",
    "category": "生产/辅助",
    "typeDesc": "复合母座 / 加工供能",
    "inputPorts": "正面×1 (固体)",
    "outputPorts": "无线供能 (50MW) + 供热 (150☼)",
    "portLogic": "单进单出 (母座加工)",
    "specialRule": "顶部×3插槽·承托被动加工插件",
    "power": -50,
    "heat": 150,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "sockets": 3,
    "socketDesc": "顶部×3 (1x2)",
    "recipes": [
      "rcp_engine_thermal_power",
      "rcp_engine_super_steam"
    ],
    "desc": "复合建筑母机座子，本身为热能转化加工建筑，同时提供顶部3个模型插槽供被动冶炼舱等插件挂载并供能供热。",
    "group": "power",
    "costs": [{ "code": "iron_plate", "need": 6 }, { "code": "iron_ingot", "need": 12 }, { "code": "copper_ingot", "need": 8 }]
  },
  "smelt_chamber": {
    "id": "smelt_chamber",
    "code": "BD_113",
    "name": "冶炼舱",
    "category": "生产",
    "typeDesc": "被动加工器 / 复合插件",
    "inputPorts": "底部×1 (热力直供) + 投料",
    "outputPorts": "背面×1 (固体)",
    "portLogic": "被动识别转化",
    "specialRule": "挂载式被动加工器·放啥加工啥",
    "power": 35,
    "heat": 0,
    "clockSpeed": 100,
    "hasHeatGlow": true,
    "hasHeaterGlow": true,
    "recipes": [
      "rcp_refined_iron_ingot",
      "rcp_high_temp_alloy_ingot",
      "rcp_daomai_alloy",
      "rcp_power_drive_core"
    ],
    "desc": "挂载在灵力引擎座子上的被动加工器模型插件，汲取底座高热自动识别放入的材料转化提纯高级金属。",
    "group": "prod",
    "costs": [{ "code": "iron_ingot", "need": 4 }, { "code": "copper_ingot", "need": 2 }]
  },
  "bio_base": {
    "id": "bio_base",
    "code": "BD_130",
    "name": "营养基座",
    "category": "生产/辅助",
    "typeDesc": "复合母座 / 营养供给",
    "inputPorts": "侧面×2 (流体: 营养液/原水)",
    "outputPorts": "顶部直供单工位",
    "portLogic": "双管流体直供母座 (顶部单插槽)",
    "specialRule": "单插件复合底座·顶部只能放一个(培养仓/培养皿二选一)",
    "power": 10,
    "heat": 0,
    "clockSpeed": 100,
    "sockets": 1,
    "socketDesc": "顶部×1 (培养仓/培养皿二选一)",
    "recipes": [
      "rcp_bio_base_infusion"
    ],
    "desc": "大型生物复合底座，提供高压营养液内循环管网与恒温生物载台。顶部专设1个标准卡座，承托单个生物设备（培养仓BD_108或培养皿BD_131二选一），直供高纯营养液并强化微培增产。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 6 }, { "code": "iron_beam", "need": 4 }]
  },
  "petri_dish": {
    "id": "petri_dish",
    "code": "BD_131",
    "name": "培养皿",
    "category": "生产",
    "typeDesc": "生物微培 / 复合插件",
    "inputPorts": "底面×1 (营养直供) + 投料",
    "outputPorts": "正面×1 (固体)",
    "portLogic": "流固微培",
    "specialRule": "挂载式插件·需插于营养基座·木炭灰改良增产",
    "power": 4,
    "heat": 0,
    "clockSpeed": 100,
    "recipes": [
      "rcp_spore_culture",
      "rcp_herb_seedling"
    ],
    "desc": "精密生物发酵培养皿，插在营养基座上工作，可加入木炭灰改良基质，精密培育活性菌丝胚与灵草幼胚。",
    "group": "prod",
    "costs": [{ "code": "iron_plate", "need": 3 }, { "code": "copper_ingot", "need": 2 }]
  },
  "fluid_hub": {
    "id": "fluid_hub",
    "code": "BD_132",
    "name": "流体处理中枢",
    "category": "辅助/复合",
    "typeDesc": "单座复合 / 流体增压中枢",
    "inputPorts": "侧面×3 (流体/固体)",
    "outputPorts": "背面×2 (流体/固体)",
    "portLogic": "高压调配中枢 (顶部单插槽)",
    "specialRule": "单插件复合建筑·顶部只能放一个(搅拌机/离心机/提取器三选一)",
    "power": 12,
    "heat": 0,
    "clockSpeed": 100,
    "sockets": 1,
    "socketDesc": "顶部×1 (单设备插槽)",
    "recipes": [
      "rcp_fluid_hub_boost"
    ],
    "desc": "单设备承载型高压流体复合母座，集成高压离心泵与多相流分配阀室。顶部专设1个标准卡座，只能且必须放置一个加工设备（支持搅拌机BD_110、离心机BD_106或提取器BD_109三选一），提供集中流体输送与增压加成！",
    "group": "prod",
    "costs": [{ "code": "iron_beam", "need": 12 }, { "code": "power_supply_module", "need": 4 }]
  },

  // ================= 传送物流类 (logi) =================
  "conveyor": {
    "id": "conveyor",
    "code": "BD_125",
    "name": "传送带",
    "category": "物流",
    "group": "logi",
    "typeDesc": "物流 / 标准物料输送",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 1 }],
    "desc": "自带供电传输的标准物料传送带，支持建筑间无人化运输。"
  },
  "splitter": {
    "id": "splitter",
    "code": "BD_124",
    "name": "分流器",
    "category": "物流",
    "group": "logi",
    "typeDesc": "物流 / 1进3出分流",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_gear", "need": 2 }],
    "desc": "1进3出物流分流节点，支持品质过滤与流向分配。"
  },
  "merger": {
    "id": "merger",
    "code": "BD_128",
    "name": "合流器",
    "category": "物流",
    "group": "logi",
    "typeDesc": "物流 / 3进1出合流",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_gear", "need": 2 }],
    "desc": "3进1出物流汇集节点，实现多产线物料汇流。"
  },
  "pipe": {
    "id": "pipe",
    "code": "BD_127",
    "name": "水管",
    "category": "物流",
    "group": "logi",
    "typeDesc": "流体 / 双向导管",
    "power": 0,
    "costs": [{ "code": "iron_ingot", "need": 2 }],
    "desc": "双向流体导管，用于运送原水、营养液及煞气浓缩液。"
  },
  "vert_conveyor": {
    "id": "vert_conveyor",
    "code": "BD_129",
    "name": "垂直传送带",
    "category": "物流",
    "group": "logi",
    "typeDesc": "物流 / 立体升降架",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_gear", "need": 4 }],
    "desc": "Z轴立体运输升降架，高度可拖拽 3~8 米。"
  },

  // ================= 能源动力类 (power) =================
  "power_burner": {
    "id": "power_burner",
    "code": "BD_117",
    "name": "供能机",
    "category": "电力",
    "group": "power",
    "typeDesc": "能源 / 燃烧发电",
    "power": -20,
    "costs": [{ "code": "iron_plate", "need": 10 }, { "code": "copper_wire", "need": 10 }],
    "desc": "燃烧煤炭或木材发电，无线供电覆盖 50 米半径。"
  },
  "power_generator": {
    "id": "power_generator",
    "code": "BD_118",
    "name": "灵石发电机",
    "category": "电力",
    "group": "power",
    "typeDesc": "能源 / 灵能高阶发电",
    "power": -80,
    "costs": [{ "code": "iron_beam", "need": 10 }, { "code": "power_supply_module", "need": 4 }],
    "desc": "消耗灵石驱动的高阶发电机组，输出稳定强劲灵能。"
  },

  // ================= 组织结构与仓储类 (org) =================
  "storage_box": {
    "id": "storage_box",
    "code": "BD_115",
    "name": "个人储物箱",
    "category": "仓储",
    "group": "org",
    "typeDesc": "仓储 / 随身箱",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 4 }, { "code": "iron_ingot", "need": 4 }],
    "desc": "标准随身物品存放箱，具有 24 格储物空间。"
  },
  "foundation_1x1": {
    "id": "foundation_1x1",
    "code": "BD_119",
    "name": "地基 1x1",
    "category": "建筑",
    "group": "org",
    "typeDesc": "结构 / 小型基础平整",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 1 }],
    "desc": "小型 1x1 基础平整地基。"
  },
  "foundation_4x4": {
    "id": "foundation_4x4",
    "code": "BD_120",
    "name": "地基 4x4",
    "category": "建筑",
    "group": "org",
    "typeDesc": "结构 / 标准工业地基",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 4 }],
    "desc": "平整施工地基，提供平坦的工业建造表面。"
  },
  "foundation_16x16": {
    "id": "foundation_16x16",
    "code": "BD_121",
    "name": "地基 16x16",
    "category": "建筑",
    "group": "org",
    "typeDesc": "结构 / 重型大跨度地基",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 16 }],
    "desc": "超大重型平整地基，大面积厂区硬化地面。"
  },
  "iron_beam_bld": {
    "id": "iron_beam_bld",
    "code": "BD_122",
    "name": "玄铁梁",
    "category": "建筑",
    "group": "org",
    "typeDesc": "结构 / 承重工字梁",
    "power": 0,
    "costs": [{ "code": "iron_beam", "need": 2 }],
    "desc": "重型承重工字梁，跨越地形障碍架设管线。"
  },
  "table": {
    "id": "table",
    "code": "BD_123",
    "name": "置物桌",
    "category": "建筑",
    "group": "org",
    "typeDesc": "结构 / 工坊家具",
    "power": 0,
    "costs": [{ "code": "iron_plate", "need": 2 }],
    "desc": "小型工坊操作与物品整备桌。"
  },

  // ================= 特殊设施类 (special) =================
  "refining_bench": {
    "id": "refining_bench",
    "code": "BD_148",
    "name": "炼宝台",
    "category": "特殊",
    "group": "special",
    "typeDesc": "法宝 / 三阶注灵台",
    "power": 30,
    "costs": [{ "code": "iron_beam", "need": 12 }, { "code": "daomai_sheet", "need": 6 }],
    "desc": "三阶注灵法宝淬炼台，完成本命法宝山河社稷图前置态注灵。"
  },
  "tribulation_platform": {
    "id": "tribulation_platform",
    "code": "BD_150",
    "name": "渡劫台",
    "category": "特殊",
    "group": "special",
    "typeDesc": "飞升 / 天劫洗礼台",
    "power": 100,
    "costs": [{ "code": "iron_beam", "need": 20 }, { "code": "sha_crystal", "need": 10 }],
    "desc": "接引九重天劫洗礼法宝，渡劫飞升成就极品后天灵宝。"
  },
  "teleporter": {
    "id": "teleporter",
    "code": "BD_114",
    "name": "传送门",
    "category": "特殊",
    "group": "special",
    "typeDesc": "空间 / 频段跃迁",
    "power": 50,
    "costs": [{ "code": "iron_beam", "need": 15 }, { "code": "power_supply_module", "need": 5 }],
    "desc": "空间跃迁传输，配对频段瞬移传输。"
  }
};

const XIUXIAN_RECIPES = {
  "rcp_iron_ingot": {
    "id": "rcp_iron_ingot",
    "name": "玄铁锭",
    "category": "金属加工",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 10,
    "power": 10,
    "input": {
      "item": "iron_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "玄铁矿"
    },
    "output": {
      "item": "iron_ingot",
      "amount": 1,
      "ratePerMin": 6,
      "name": "玄铁锭"
    },
    "inputs": [
      {
        "item": "iron_ore",
        "count": 1,
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "iron_ingot",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "由精炼炉将玄铁矿熔炼为高纯度玄铁金属锭。"
  },
  "rcp_copper_ingot": {
    "id": "rcp_copper_ingot",
    "name": "赤铜锭",
    "category": "金属加工",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 10,
    "power": 10,
    "input": {
      "item": "copper_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "赤铜矿"
    },
    "output": {
      "item": "copper_ingot",
      "amount": 1,
      "ratePerMin": 6,
      "name": "赤铜锭"
    },
    "inputs": [
      {
        "item": "copper_ore",
        "count": 1,
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "copper_ingot",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "将赤铜矿冶炼为导电性极佳的赤铜金属锭。"
  },
  "rcp_refractory_core": {
    "id": "rcp_refractory_core",
    "name": "耐火炉芯",
    "category": "机器零件",
    "building": "furnace",
    "buildingId": "furnace",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "iron_plate",
      "amount": 4,
      "ratePerMin": 8,
      "name": "玄铁板"
    },
    "output": {
      "item": "refractory_core",
      "amount": 1,
      "ratePerMin": 2,
      "name": "耐火炉芯"
    },
    "inputs": [
      {
        "item": "iron_plate",
        "count": 4,
        "rate": 8
      },
      {
        "item": "iron_powder",
        "count": 2,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "refractory_core",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "高温耐火金属构件，用于炉膛与冶炼舱核心。"
  },
  "rcp_copper_wire": {
    "id": "rcp_copper_wire",
    "name": "铜线",
    "category": "精密加工",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 8,
    "power": 12,
    "input": {
      "item": "copper_ingot",
      "amount": 1,
      "ratePerMin": 7.5,
      "name": "赤铜锭"
    },
    "output": {
      "item": "copper_wire",
      "amount": 5,
      "ratePerMin": 37.5,
      "name": "铜线"
    },
    "inputs": [
      {
        "item": "copper_ingot",
        "count": 1,
        "rate": 7.5
      }
    ],
    "outputs": [
      {
        "item": "copper_wire",
        "count": 5,
        "rate": 37.5
      }
    ],
    "desc": "赤铜锭精密切割拉丝制成的高导电铜线。"
  },
  "rcp_ling_copper_sheet": {
    "id": "rcp_ling_copper_sheet",
    "name": "导灵铜片",
    "category": "精密加工",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 10,
    "power": 12,
    "input": {
      "item": "copper_ingot",
      "amount": 1,
      "ratePerMin": 6,
      "name": "赤铜锭"
    },
    "output": {
      "item": "ling_copper_sheet",
      "amount": 1,
      "ratePerMin": 6,
      "name": "导灵铜片"
    },
    "inputs": [
      {
        "item": "copper_ingot",
        "count": 1,
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "ling_copper_sheet",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "高精度薄片切削，用于蚀刻灵纹电路基底。"
  },
  "rcp_wood_plank": {
    "id": "rcp_wood_plank",
    "name": "木板",
    "category": "基础建材",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 15,
    "power": 12,
    "input": {
      "item": "log",
      "amount": 1,
      "ratePerMin": 4,
      "name": "原木"
    },
    "output": {
      "item": "wood_plank",
      "amount": 2,
      "ratePerMin": 8,
      "name": "木板"
    },
    "inputs": [
      {
        "item": "log",
        "count": 1,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "wood_plank",
        "count": 2,
        "rate": 8
      }
    ],
    "desc": "原木切割加工出的标准建筑木板。"
  },
  "rcp_wood_structural_part": {
    "id": "rcp_wood_structural_part",
    "name": "木结构件",
    "category": "基础建材",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 20,
    "power": 12,
    "input": {
      "item": "wood_plank",
      "amount": 2,
      "ratePerMin": 6,
      "name": "木板"
    },
    "output": {
      "item": "wood_structural_part",
      "amount": 1,
      "ratePerMin": 3,
      "name": "木结构件"
    },
    "inputs": [
      {
        "item": "wood_plank",
        "count": 2,
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "wood_structural_part",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "由木板精密切削加工的榫卯建筑结构件。"
  },
  "rcp_daomai_sheet": {
    "id": "rcp_daomai_sheet",
    "name": "导脉薄片",
    "category": "精密加工",
    "building": "cutter",
    "buildingId": "cutter",
    "timeSec": 20,
    "power": 12,
    "input": {
      "item": "daomai_alloy",
      "amount": 1,
      "ratePerMin": 3,
      "name": "导脉合金"
    },
    "output": {
      "item": "daomai_sheet",
      "amount": 2,
      "ratePerMin": 6,
      "name": "导脉薄片"
    },
    "inputs": [
      {
        "item": "daomai_alloy",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "daomai_sheet",
        "count": 2,
        "rate": 6
      }
    ],
    "desc": "导脉合金切割后的法宝导流薄片。"
  },
  "rcp_iron_plate": {
    "id": "rcp_iron_plate",
    "name": "玄铁板",
    "category": "基础建材",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 8,
    "power": 6,
    "input": {
      "item": "iron_ingot",
      "amount": 2,
      "ratePerMin": 15,
      "name": "玄铁锭"
    },
    "output": {
      "item": "iron_plate",
      "amount": 3,
      "ratePerMin": 22.5,
      "name": "玄铁板"
    },
    "inputs": [
      {
        "item": "iron_ingot",
        "count": 2,
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "iron_plate",
        "count": 3,
        "rate": 22.5
      }
    ],
    "desc": "玄铁锭冲压制成的标准工业结构板材。"
  },
  "rcp_iron_gear": {
    "id": "rcp_iron_gear",
    "name": "玄铁齿轮",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 8,
    "power": 6,
    "input": {
      "item": "iron_ingot",
      "amount": 2,
      "ratePerMin": 15,
      "name": "玄铁锭"
    },
    "output": {
      "item": "iron_gear",
      "amount": 1,
      "ratePerMin": 7.5,
      "name": "玄铁齿轮"
    },
    "inputs": [
      {
        "item": "iron_ingot",
        "count": 2,
        "rate": 15
      }
    ],
    "outputs": [
      {
        "item": "iron_gear",
        "count": 1,
        "rate": 7.5
      }
    ],
    "desc": "高硬度机械传动齿轮。"
  },
  "rcp_ling_magnetic_gear": {
    "id": "rcp_ling_magnetic_gear",
    "name": "灵磁齿轮",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 10,
    "power": 6,
    "input": {
      "item": "iron_gear",
      "amount": 1,
      "ratePerMin": 6,
      "name": "玄铁齿轮"
    },
    "output": {
      "item": "ling_magnetic_gear",
      "amount": 1,
      "ratePerMin": 6,
      "name": "灵磁齿轮"
    },
    "inputs": [
      {
        "item": "iron_gear",
        "count": 1,
        "rate": 6
      },
      {
        "item": "iron_powder",
        "count": 2,
        "rate": 12
      }
    ],
    "outputs": [
      {
        "item": "ling_magnetic_gear",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "齿面复合导灵金属粉的磁悬浮齿轮。"
  },
  "rcp_iron_beam": {
    "id": "rcp_iron_beam",
    "name": "玄铁梁",
    "category": "基础建材",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "iron_ingot",
      "amount": 4,
      "ratePerMin": 12,
      "name": "玄铁锭"
    },
    "output": {
      "item": "iron_beam",
      "amount": 1,
      "ratePerMin": 3,
      "name": "玄铁梁"
    },
    "inputs": [
      {
        "item": "iron_ingot",
        "count": 4,
        "rate": 12
      }
    ],
    "outputs": [
      {
        "item": "iron_beam",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "重型承重工字梁，用于搭建厂房与机器基座。"
  },
  "rcp_device_pipe": {
    "id": "rcp_device_pipe",
    "name": "设备管件",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 15,
    "power": 6,
    "input": {
      "item": "iron_plate",
      "amount": 2,
      "ratePerMin": 8,
      "name": "玄铁板"
    },
    "output": {
      "item": "device_pipe",
      "amount": 1,
      "ratePerMin": 4,
      "name": "设备管件"
    },
    "inputs": [
      {
        "item": "iron_plate",
        "count": 2,
        "rate": 8
      },
      {
        "item": "iron_gear",
        "count": 1,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "device_pipe",
        "count": 1,
        "rate": 4
      }
    ],
    "desc": "通用流体设备零件，用于水管网络与阀门连接。"
  },
  "rcp_device_skeleton": {
    "id": "rcp_device_skeleton",
    "name": "设备骨架",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "iron_beam",
      "amount": 1,
      "ratePerMin": 3,
      "name": "玄铁梁"
    },
    "output": {
      "item": "device_skeleton",
      "amount": 1,
      "ratePerMin": 3,
      "name": "设备骨架"
    },
    "inputs": [
      {
        "item": "iron_beam",
        "count": 1,
        "rate": 3
      },
      {
        "item": "iron_plate",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "device_skeleton",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "设备建造基础金属框架骨架。"
  },
  "rcp_electric_coil": {
    "id": "rcp_electric_coil",
    "name": "导电线圈",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "copper_wire",
      "amount": 5,
      "ratePerMin": 15,
      "name": "铜线"
    },
    "output": {
      "item": "electric_coil",
      "amount": 1,
      "ratePerMin": 3,
      "name": "导电线圈"
    },
    "inputs": [
      {
        "item": "copper_wire",
        "count": 5,
        "rate": 15
      },
      {
        "item": "iron_powder",
        "count": 2,
        "rate": 6
      }
    ],
    "outputs": [
      {
        "item": "electric_coil",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "高导电磁感线圈，用于发电机与动力中枢。"
  },
  "rcp_basic_control_module": {
    "id": "rcp_basic_control_module",
    "name": "基础控制模块",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "ling_copper_sheet",
      "amount": 1,
      "ratePerMin": 3,
      "name": "导灵铜片"
    },
    "output": {
      "item": "basic_control_module",
      "amount": 1,
      "ratePerMin": 3,
      "name": "基础控制模块"
    },
    "inputs": [
      {
        "item": "ling_copper_sheet",
        "count": 1,
        "rate": 3
      },
      {
        "item": "copper_wire",
        "count": 2,
        "rate": 6
      },
      {
        "item": "iron_powder",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "basic_control_module",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "集成工控逻辑芯片，控制自动化节拍。"
  },
  "rcp_bio_chip": {
    "id": "rcp_bio_chip",
    "name": "电子生物芯片",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 6,
    "input": {
      "item": "neural_bundle",
      "amount": 2,
      "ratePerMin": 4,
      "name": "神经束"
    },
    "output": {
      "item": "bio_chip",
      "amount": 1,
      "ratePerMin": 2,
      "name": "电子生物芯片"
    },
    "inputs": [
      {
        "item": "neural_bundle",
        "count": 2,
        "rate": 4
      },
      {
        "item": "ling_copper_sheet",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "bio_chip",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "神经束与导灵铜片复合的仿生计算控制芯片。"
  },
  "rcp_device_interface": {
    "id": "rcp_device_interface",
    "name": "设备接口件",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "device_pipe",
      "amount": 1,
      "ratePerMin": 3,
      "name": "设备管件"
    },
    "output": {
      "item": "device_interface",
      "amount": 1,
      "ratePerMin": 3,
      "name": "设备接口件"
    },
    "inputs": [
      {
        "item": "device_pipe",
        "count": 1,
        "rate": 3
      },
      {
        "item": "basic_control_module",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "device_interface",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "解构机、离心机、提取器通用流体电气接口。"
  },
  "rcp_device_frame": {
    "id": "rcp_device_frame",
    "name": "设备框架",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 6,
    "input": {
      "item": "device_skeleton",
      "amount": 1,
      "ratePerMin": 2,
      "name": "设备骨架"
    },
    "output": {
      "item": "device_frame",
      "amount": 1,
      "ratePerMin": 2,
      "name": "设备框架"
    },
    "inputs": [
      {
        "item": "device_skeleton",
        "count": 1,
        "rate": 2
      },
      {
        "item": "iron_gear",
        "count": 2,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "device_frame",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "重型设备装配主框架箱体。"
  },
  "rcp_device_drive_part": {
    "id": "rcp_device_drive_part",
    "name": "设备传动件",
    "category": "机器零件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 6,
    "input": {
      "item": "drive_skeleton",
      "amount": 1,
      "ratePerMin": 2,
      "name": "传动骨架"
    },
    "output": {
      "item": "device_drive_part",
      "amount": 1,
      "ratePerMin": 2,
      "name": "设备传动件"
    },
    "inputs": [
      {
        "item": "drive_skeleton",
        "count": 1,
        "rate": 2
      },
      {
        "item": "basic_control_module",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "device_drive_part",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "传送带与物流枢纽核心驱动总成。"
  },
  "rcp_bio_composite_plate": {
    "id": "rcp_bio_composite_plate",
    "name": "生物复合板",
    "category": "高级生物原料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 45,
    "power": 6,
    "input": {
      "item": "bio_embryo",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "生物胚料"
    },
    "output": {
      "item": "bio_composite_plate",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "生物复合板"
    },
    "inputs": [
      {
        "item": "bio_embryo",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "tissue_essence",
        "count": 1,
        "rate": 1.33
      }
    ],
    "outputs": [
      {
        "item": "bio_composite_plate",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "生物胚料与组织精华液压制成的高强度生物骨架板。"
  },
  "rcp_waste_purify_powder": {
    "id": "rcp_waste_purify_powder",
    "name": "废液净化粉",
    "category": "环保材料",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 20,
    "power": 6,
    "input": {
      "item": "iron_powder",
      "amount": 2,
      "ratePerMin": 6,
      "name": "玄铁粉"
    },
    "output": {
      "item": "waste_purify_powder",
      "amount": 2,
      "ratePerMin": 6,
      "name": "废液净化粉"
    },
    "inputs": [
      {
        "item": "iron_powder",
        "count": 2,
        "rate": 6
      },
      {
        "item": "protein_fluid",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "waste_purify_powder",
        "count": 2,
        "rate": 6
      }
    ],
    "desc": "用于中和与净化腐化废液的化学过滤粉剂。"
  },
  "rcp_ore_vein_locator": {
    "id": "rcp_ore_vein_locator",
    "name": "矿脉定位件",
    "category": "空间组件",
    "building": "assembler",
    "buildingId": "assembler",
    "timeSec": 30,
    "power": 6,
    "input": {
      "item": "ling_copper_sheet",
      "amount": 2,
      "ratePerMin": 4,
      "name": "导灵铜片"
    },
    "output": {
      "item": "ore_vein_locator",
      "amount": 1,
      "ratePerMin": 2,
      "name": "矿脉定位件"
    },
    "inputs": [
      {
        "item": "ling_copper_sheet",
        "count": 2,
        "rate": 4
      },
      {
        "item": "basic_control_module",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "ore_vein_locator",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "定位已发现矿脉节点，炼宝台合成必备组件。"
  },
  "rcp_iron_powder": {
    "id": "rcp_iron_powder",
    "name": "玄铁粉",
    "category": "金属加工",
    "building": "crusher",
    "buildingId": "crusher",
    "timeSec": 12,
    "power": 8,
    "input": {
      "item": "iron_ingot",
      "amount": 1,
      "ratePerMin": 5,
      "name": "玄铁锭"
    },
    "output": {
      "item": "iron_powder",
      "amount": 3,
      "ratePerMin": 15,
      "name": "玄铁粉"
    },
    "inputs": [
      {
        "item": "iron_ingot",
        "count": 1,
        "rate": 5
      }
    ],
    "outputs": [
      {
        "item": "iron_powder",
        "count": 3,
        "rate": 15
      }
    ],
    "desc": "将玄铁锭粉碎研磨为微米级金属细粉。"
  },
  "rcp_decon_lianqi": {
    "id": "rcp_decon_lianqi",
    "name": "解构练气修士尸体",
    "category": "生物科技",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "cultivator_corpse",
      "amount": 1,
      "ratePerMin": 2,
      "name": "练气修士尸体"
    },
    "output": {
      "item": "living_tissue",
      "amount": 2,
      "ratePerMin": 4,
      "name": "鲜活生物组织"
    },
    "inputs": [
      {
        "item": "cultivator_corpse",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "living_tissue",
        "count": 2,
        "rate": 4
      },
      {
        "item": "neural_bundle",
        "count": 1,
        "rate": 2
      },
      {
        "item": "dry_tissue",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "解构练气修士尸体，完整剥离出鲜活生物组织、神经束与脱水组织。"
  },
  "rcp_decon_zhuji": {
    "id": "rcp_decon_zhuji",
    "name": "解构筑基修士尸体",
    "category": "生物科技",
    "building": "deconstructor",
    "buildingId": "deconstructor",
    "timeSec": 30,
    "power": 20,
    "input": {
      "item": "foundation_corpse",
      "amount": 1,
      "ratePerMin": 2,
      "name": "筑基修士尸体"
    },
    "output": {
      "item": "living_tissue",
      "amount": 3,
      "ratePerMin": 6,
      "name": "鲜活生物组织"
    },
    "inputs": [
      {
        "item": "foundation_corpse",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "living_tissue",
        "count": 3,
        "rate": 6
      },
      {
        "item": "neural_bundle",
        "count": 2,
        "rate": 4
      },
      {
        "item": "dry_tissue",
        "count": 2,
        "rate": 4
      }
    ],
    "desc": "解构筑基期修士尸体，产出更高丰度的鲜活组织与经络神经束。"
  },
  "rcp_mine_iron": {
    "id": "rcp_mine_iron",
    "name": "开采玄铁矿",
    "category": "矿物采集",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "input": {
      "item": "iron_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "矿脉"
    },
    "output": {
      "item": "iron_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "玄铁矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "iron_ore",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "从地下玄铁矿脉中自动冲压采掘出原矿石。"
  },
  "rcp_mine_copper": {
    "id": "rcp_mine_copper",
    "name": "开采赤铜矿",
    "category": "矿物采集",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "input": {
      "item": "copper_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "赤铜矿脉"
    },
    "output": {
      "item": "copper_ore",
      "amount": 1,
      "ratePerMin": 6,
      "name": "赤铜矿"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "copper_ore",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "从赤铜矿点自动化开采赤铜原矿石。"
  },
  "rcp_mine_coal": {
    "id": "rcp_mine_coal",
    "name": "开采煤炭",
    "category": "矿物采集",
    "building": "miner",
    "buildingId": "miner",
    "timeSec": 10,
    "power": 5,
    "input": {
      "item": "coal",
      "amount": 1,
      "ratePerMin": 6,
      "name": "煤矿点"
    },
    "output": {
      "item": "coal",
      "amount": 1,
      "ratePerMin": 6,
      "name": "煤炭"
    },
    "inputs": [],
    "outputs": [
      {
        "item": "coal",
        "count": 1,
        "rate": 6
      }
    ],
    "desc": "从煤炭露天矿点持续挖掘工业燃料煤。"
  },
  "rcp_tissue_essence": {
    "id": "rcp_tissue_essence",
    "name": "组织精华液",
    "category": "生物科技",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 30,
    "power": 15,
    "input": {
      "item": "bio_mix_liquid",
      "amount": 1,
      "ratePerMin": 2,
      "name": "活性生物混合液"
    },
    "output": {
      "item": "tissue_essence",
      "amount": 1,
      "ratePerMin": 2,
      "name": "组织精华液"
    },
    "inputs": [
      {
        "item": "bio_mix_liquid",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "tissue_essence",
        "count": 1,
        "rate": 2
      },
      {
        "item": "nutrient_sediment",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "离心分离活性生物混合液，提纯出纯净生物精粹。"
  },
  "rcp_sha_separation": {
    "id": "rcp_sha_separation",
    "name": "煞气分离",
    "category": "生物科技",
    "building": "centrifuge",
    "buildingId": "centrifuge",
    "timeSec": 60,
    "power": 15,
    "input": {
      "item": "sha_concentrate_liquid",
      "amount": 1,
      "ratePerMin": 1,
      "name": "煞气浓缩液"
    },
    "output": {
      "item": "sha_crystal",
      "amount": 1,
      "ratePerMin": 1,
      "name": "煞气结晶"
    },
    "inputs": [
      {
        "item": "sha_concentrate_liquid",
        "count": 1,
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "sha_crystal",
        "count": 1,
        "rate": 1
      },
      {
        "item": "sha_corrupt_liquid",
        "count": 1,
        "rate": 1
      }
    ],
    "desc": "将煞气浓缩液离心析出固态煞气结晶与腐化废液。"
  },
  "rcp_protein_fluid": {
    "id": "rcp_protein_fluid",
    "name": "组织蛋白液",
    "category": "生物科技",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "living_tissue",
      "amount": 2,
      "ratePerMin": 4,
      "name": "鲜活生物组织"
    },
    "output": {
      "item": "protein_fluid",
      "amount": 1,
      "ratePerMin": 2,
      "name": "组织蛋白液"
    },
    "inputs": [
      {
        "item": "living_tissue",
        "count": 2,
        "rate": 4
      },
      {
        "item": "raw_water",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "protein_fluid",
        "count": 1,
        "rate": 2
      },
      {
        "item": "bio_turbid_waste",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "从鲜活生物组织中溶剂萃取出高浓度组织蛋白液。"
  },
  "rcp_ling_grass_extract": {
    "id": "rcp_ling_grass_extract",
    "name": "灵草萃取液",
    "category": "生物科技",
    "building": "extractor",
    "buildingId": "extractor",
    "timeSec": 30,
    "power": 10,
    "input": {
      "item": "mature_ling_grass",
      "amount": 2,
      "ratePerMin": 4,
      "name": "成熟灵草"
    },
    "output": {
      "item": "ling_grass_extract",
      "amount": 1,
      "ratePerMin": 2,
      "name": "灵草萃取液"
    },
    "inputs": [
      {
        "item": "mature_ling_grass",
        "count": 2,
        "rate": 4
      },
      {
        "item": "raw_water",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "ling_grass_extract",
        "count": 1,
        "rate": 2
      },
      {
        "item": "bio_turbid_waste",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "从成熟灵草中低温萃取灵草精华液。"
  },
  "rcp_mature_ling_grass": {
    "id": "rcp_mature_ling_grass",
    "name": "培育成熟灵草",
    "category": "生物科技",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 20,
    "power": 8,
    "input": {
      "item": "ling_grass_seed",
      "amount": 1,
      "ratePerMin": 3,
      "name": "灵草种子"
    },
    "output": {
      "item": "mature_ling_grass",
      "amount": 2,
      "ratePerMin": 6,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "ling_grass_seed",
        "count": 1,
        "rate": 3
      },
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "mature_ling_grass",
        "count": 2,
        "rate": 6
      }
    ],
    "desc": "在流固混合培育仓中加入灵草种子与基础营养液，持续培育出成熟灵草。"
  },
  "rcp_ling_grass_boost": {
    "id": "rcp_ling_grass_boost",
    "name": "灵草催生增产 (自繁育)",
    "category": "生物科技",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 25,
    "power": 8,
    "input": {
      "item": "mature_ling_grass",
      "amount": 1,
      "ratePerMin": 2.4,
      "name": "成熟灵草"
    },
    "output": {
      "item": "mature_ling_grass",
      "amount": 3,
      "ratePerMin": 7.2,
      "name": "成熟灵草"
    },
    "inputs": [
      {
        "item": "mature_ling_grass",
        "count": 1,
        "rate": 2.4
      },
      {
        "item": "bio_mix_liquid",
        "count": 1,
        "rate": 2.4
      }
    ],
    "outputs": [
      {
        "item": "mature_ling_grass",
        "count": 3,
        "rate": 7.2
      },
      {
        "item": "ling_grass_seed",
        "count": 1,
        "rate": 2.4
      }
    ],
    "desc": "以成熟灵草为母株，注入活性生物混合液催生出3倍灵草并自产种子，形成繁育闭环。"
  },
  "rcp_cell_cultivation": {
    "id": "rcp_cell_cultivation",
    "name": "活性细胞扩增",
    "category": "生物科技",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 30,
    "power": 8,
    "input": {
      "item": "living_tissue",
      "amount": 1,
      "ratePerMin": 2,
      "name": "鲜活生物组织"
    },
    "output": {
      "item": "active_cell_cluster",
      "amount": 2,
      "ratePerMin": 4,
      "name": "活性细胞团"
    },
    "inputs": [
      {
        "item": "living_tissue",
        "count": 1,
        "rate": 2
      },
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "active_cell_cluster",
        "count": 2,
        "rate": 4
      }
    ],
    "desc": "在恒温流固营养仓中培养鲜活生物组织，扩增繁育为活性细胞团，供组装机合成胚料。"
  },
  "rcp_sediment_nutrient": {
    "id": "rcp_sediment_nutrient",
    "name": "养分沉淀发酵",
    "category": "生物科技",
    "building": "incubator",
    "buildingId": "incubator",
    "timeSec": 20,
    "power": 8,
    "input": {
      "item": "nutrient_sediment",
      "amount": 2,
      "ratePerMin": 6,
      "name": "营养沉淀物"
    },
    "output": {
      "item": "basic_nutrient",
      "amount": 2,
      "ratePerMin": 6,
      "name": "基础营养液"
    },
    "inputs": [
      {
        "item": "nutrient_sediment",
        "count": 2,
        "rate": 6
      },
      {
        "item": "raw_water",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "basic_nutrient",
        "count": 2,
        "rate": 6
      }
    ],
    "desc": "利用离心分离得到的营养沉淀物加原水恒温发酵，回流再生出基础营养液。"
  },
  "rcp_spore_culture": {
    "id": "rcp_spore_culture",
    "name": "活性菌丝微培",
    "category": "生物微培",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 15,
    "power": 4,
    "input": {
      "item": "basic_nutrient",
      "amount": 1,
      "ratePerMin": 4,
      "name": "基础营养液"
    },
    "output": {
      "item": "mycelium_embryo",
      "amount": 2,
      "ratePerMin": 8,
      "name": "活性菌丝胚"
    },
    "inputs": [
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 4
      },
      {
        "item": "charcoal_ash",
        "count": 1,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "mycelium_embryo",
        "count": 2,
        "rate": 8
      }
    ],
    "desc": "在培养皿中混合营养液与木炭灰改良基质，精密培育活性菌丝胚。"
  },
  "rcp_herb_seedling": {
    "id": "rcp_herb_seedling",
    "name": "灵草幼胚精密培植",
    "category": "生物微培",
    "building": "petri_dish",
    "buildingId": "petri_dish",
    "timeSec": 20,
    "power": 4,
    "input": {
      "item": "ling_grass_seed",
      "amount": 1,
      "ratePerMin": 3,
      "name": "灵草种子"
    },
    "output": {
      "item": "herb_seedling",
      "amount": 2,
      "ratePerMin": 6,
      "name": "灵草幼胚"
    },
    "inputs": [
      {
        "item": "ling_grass_seed",
        "count": 1,
        "rate": 3
      },
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "herb_seedling",
        "count": 2,
        "rate": 6
      }
    ],
    "desc": "在培养皿中精密温育灵草幼胚，为高阶灵植提供胚芽活力。"
  },
  "rcp_bio_base_infusion": {
    "id": "rcp_bio_base_infusion",
    "name": "基座营养液高压灌注",
    "category": "母座供流",
    "building": "bio_base",
    "buildingId": "bio_base",
    "timeSec": 15,
    "power": 10,
    "input": {
      "item": "raw_water",
      "amount": 2,
      "ratePerMin": 8,
      "name": "原水"
    },
    "output": {
      "item": "bio_mix_liquid",
      "amount": 1,
      "ratePerMin": 4,
      "name": "活性生物混合液"
    },
    "inputs": [
      {
        "item": "raw_water",
        "count": 2,
        "rate": 8
      },
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "bio_mix_liquid",
        "count": 1,
        "rate": 4
      }
    ],
    "desc": "营养基座内部流体管网高压浓缩，向顶部双培养工位直供高纯活性生物混合液。"
  },
  "rcp_fluid_hub_boost": {
    "id": "rcp_fluid_hub_boost",
    "name": "流体增压与净化循环",
    "category": "中枢增压",
    "building": "fluid_hub",
    "buildingId": "fluid_hub",
    "timeSec": 10,
    "power": 12,
    "input": {
      "item": "raw_water",
      "amount": 2,
      "ratePerMin": 12,
      "name": "原水"
    },
    "output": {
      "item": "recycled_pure_water",
      "amount": 2,
      "ratePerMin": 12,
      "name": "回用净化水"
    },
    "inputs": [
      {
        "item": "raw_water",
        "count": 2,
        "rate": 12
      }
    ],
    "outputs": [
      {
        "item": "recycled_pure_water",
        "count": 2,
        "rate": 12
      }
    ],
    "desc": "流体处理中枢内部高压离心泵增压稳流，为顶部单插件设备提供强力流体动力支持。"
  },
  "rcp_basic_nutrient": {
    "id": "rcp_basic_nutrient",
    "name": "基础营养液",
    "category": "生物科技",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 14,
    "input": {
      "item": "raw_water",
      "amount": 2,
      "ratePerMin": 6,
      "name": "原水"
    },
    "output": {
      "item": "basic_nutrient",
      "amount": 1,
      "ratePerMin": 3,
      "name": "基础营养液"
    },
    "inputs": [
      {
        "item": "raw_water",
        "count": 2,
        "rate": 6
      },
      {
        "item": "protein_fluid",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "basic_nutrient",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "混合原水与组织蛋白液调配出基础细胞培养液。"
  },
  "rcp_bio_mix_liquid": {
    "id": "rcp_bio_mix_liquid",
    "name": "活性生物混合液",
    "category": "生物科技",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 20,
    "power": 14,
    "input": {
      "item": "protein_fluid",
      "amount": 1,
      "ratePerMin": 3,
      "name": "组织蛋白液"
    },
    "output": {
      "item": "bio_mix_liquid",
      "amount": 1,
      "ratePerMin": 3,
      "name": "活性生物混合液"
    },
    "inputs": [
      {
        "item": "protein_fluid",
        "count": 1,
        "rate": 3
      },
      {
        "item": "ling_grass_extract",
        "count": 1,
        "rate": 3
      }
    ],
    "outputs": [
      {
        "item": "bio_mix_liquid",
        "count": 1,
        "rate": 3
      }
    ],
    "desc": "将组织蛋白液与灵草萃取液混合为活性生物液。"
  },
  "rcp_fabao_pulse_liquid": {
    "id": "rcp_fabao_pulse_liquid",
    "name": "法宝稳脉液",
    "category": "法宝材料",
    "building": "mixer",
    "buildingId": "mixer",
    "timeSec": 30,
    "power": 14,
    "input": {
      "item": "tissue_essence",
      "amount": 1,
      "ratePerMin": 2,
      "name": "组织精华液"
    },
    "output": {
      "item": "fabao_pulse_liquid",
      "amount": 1,
      "ratePerMin": 2,
      "name": "法宝稳脉液"
    },
    "inputs": [
      {
        "item": "tissue_essence",
        "count": 1,
        "rate": 2
      },
      {
        "item": "recycled_pure_water",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "fabao_pulse_liquid",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "高级流体，稳定法宝内部导脉回路。"
  },
  "rcp_bio_embryo": {
    "id": "rcp_bio_embryo",
    "name": "生物胚料",
    "category": "终局组装",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 30,
    "power": 25,
    "input": {
      "item": "dry_tissue",
      "amount": 1,
      "ratePerMin": 2,
      "name": "脱水生物组织"
    },
    "output": {
      "item": "bio_embryo",
      "amount": 1,
      "ratePerMin": 2,
      "name": "生物胚料"
    },
    "inputs": [
      {
        "item": "dry_tissue",
        "count": 1,
        "rate": 2
      },
      {
        "item": "active_cell_cluster",
        "count": 1,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "bio_embryo",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "组装机压制合成的高级生物复合胚料。"
  },
  "rcp_linggen_core_material": {
    "id": "rcp_linggen_core_material",
    "name": "灵根芯材",
    "category": "终局组装",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 60,
    "power": 25,
    "input": {
      "item": "bio_chip",
      "amount": 8,
      "ratePerMin": 8,
      "name": "电子生物芯片"
    },
    "output": {
      "item": "linggen_core_material",
      "amount": 1,
      "ratePerMin": 1,
      "name": "灵根芯材"
    },
    "inputs": [
      {
        "item": "bio_chip",
        "count": 8,
        "rate": 8
      },
      {
        "item": "bio_composite_plate",
        "count": 4,
        "rate": 4
      },
      {
        "item": "tissue_essence",
        "count": 1,
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "linggen_core_material",
        "count": 1,
        "rate": 1
      }
    ],
    "desc": "人造灵根的生物/电子复合核心载体。"
  },
  "rcp_linggen_embryo": {
    "id": "rcp_linggen_embryo",
    "name": "灵根胚体",
    "category": "终局组装",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 90,
    "power": 25,
    "input": {
      "item": "linggen_core_material",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "灵根芯材"
    },
    "output": {
      "item": "linggen_embryo",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "灵根胚体"
    },
    "inputs": [
      {
        "item": "linggen_core_material",
        "count": 1,
        "rate": 0.67
      },
      {
        "item": "power_drive_core",
        "count": 1,
        "rate": 0.67
      }
    ],
    "outputs": [
      {
        "item": "linggen_embryo",
        "count": 1,
        "rate": 0.67
      }
    ],
    "desc": "人造灵根最终成型的未激活胚体。"
  },
  "rcp_artificial_linggen": {
    "id": "rcp_artificial_linggen",
    "name": "人造灵根",
    "category": "终局组装",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 120,
    "power": 25,
    "input": {
      "item": "linggen_embryo",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "灵根胚体"
    },
    "output": {
      "item": "artificial_linggen",
      "amount": 1,
      "ratePerMin": 0.5,
      "name": "人造灵根"
    },
    "inputs": [
      {
        "item": "linggen_embryo",
        "count": 1,
        "rate": 0.5
      },
      {
        "item": "main_control_core",
        "count": 1,
        "rate": 0.5
      }
    ],
    "outputs": [
      {
        "item": "artificial_linggen",
        "count": 1,
        "rate": 0.5
      }
    ],
    "desc": "Demo主线最终交付物：人工灵力转换接口，连接中央处理器调用天地灵力。"
  },
  "rcp_fabao_array_embryo": {
    "id": "rcp_fabao_array_embryo",
    "name": "法宝阵图胚",
    "category": "法宝材料",
    "building": "assembler_heavy",
    "buildingId": "assembler_heavy",
    "timeSec": 90,
    "power": 25,
    "input": {
      "item": "bio_composite_plate",
      "amount": 2,
      "ratePerMin": 1.33,
      "name": "生物复合板"
    },
    "output": {
      "item": "fabao_array_embryo",
      "amount": 1,
      "ratePerMin": 0.67,
      "name": "法宝阵图胚"
    },
    "inputs": [
      {
        "item": "bio_composite_plate",
        "count": 2,
        "rate": 1.33
      },
      {
        "item": "daomai_sheet",
        "count": 4,
        "rate": 2.67
      },
      {
        "item": "fabao_pulse_liquid",
        "count": 2,
        "rate": 1.33
      }
    ],
    "outputs": [
      {
        "item": "fabao_array_embryo",
        "count": 1,
        "rate": 0.67
      }
    ],
    "desc": "绑定前可运输的法宝中间态结构图谱。"
  },
  "rcp_refined_iron_ingot": {
    "id": "rcp_refined_iron_ingot",
    "name": "精炼玄铁锭",
    "category": "高级金属",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 30,
    "power": 35,
    "input": {
      "item": "iron_ingot",
      "amount": 2,
      "ratePerMin": 4,
      "name": "玄铁锭"
    },
    "output": {
      "item": "refined_iron_ingot",
      "amount": 1,
      "ratePerMin": 2,
      "name": "精炼玄铁锭"
    },
    "inputs": [
      {
        "item": "iron_ingot",
        "count": 2,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "refined_iron_ingot",
        "count": 1,
        "rate": 2
      }
    ],
    "desc": "高温深加工提纯的高纯度精炼玄铁锭。"
  },
  "rcp_high_temp_alloy_ingot": {
    "id": "rcp_high_temp_alloy_ingot",
    "name": "高温合金锭",
    "category": "高级金属",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 45,
    "power": 35,
    "input": {
      "item": "refined_iron_ingot",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "high_temp_alloy_ingot",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "高温合金锭"
    },
    "inputs": [
      {
        "item": "refined_iron_ingot",
        "count": 1,
        "rate": 1.33
      },
      {
        "item": "iron_powder",
        "count": 3,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "high_temp_alloy_ingot",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "超高温熔合而成的极高强度耐热合金锭。"
  },
  "rcp_daomai_alloy": {
    "id": "rcp_daomai_alloy",
    "name": "导脉合金",
    "category": "法宝材料",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 45,
    "power": 35,
    "input": {
      "item": "refined_iron_ingot",
      "amount": 2,
      "ratePerMin": 2.67,
      "name": "精炼玄铁锭"
    },
    "output": {
      "item": "daomai_alloy",
      "amount": 1,
      "ratePerMin": 1.33,
      "name": "导脉合金"
    },
    "inputs": [
      {
        "item": "refined_iron_ingot",
        "count": 2,
        "rate": 2.67
      },
      {
        "item": "sha_crystal",
        "count": 1,
        "rate": 1.33
      }
    ],
    "outputs": [
      {
        "item": "daomai_alloy",
        "count": 1,
        "rate": 1.33
      }
    ],
    "desc": "法宝内部导流合金，具备极高的法力传导性能。"
  },
  "rcp_power_drive_core": {
    "id": "rcp_power_drive_core",
    "name": "动力核心",
    "category": "终局组装",
    "building": "smelt_chamber",
    "buildingId": "smelt_chamber",
    "timeSec": 60,
    "power": 35,
    "input": {
      "item": "high_temp_alloy_ingot",
      "amount": 6,
      "ratePerMin": 6,
      "name": "高温合金锭"
    },
    "output": {
      "item": "power_drive_core",
      "amount": 1,
      "ratePerMin": 1,
      "name": "动力核心"
    },
    "inputs": [
      {
        "item": "high_temp_alloy_ingot",
        "count": 6,
        "rate": 6
      },
      {
        "item": "power_core",
        "count": 2,
        "rate": 2
      }
    ],
    "outputs": [
      {
        "item": "power_drive_core",
        "count": 1,
        "rate": 1
      }
    ],
    "desc": "高负载动力驱动核心组件。"
  },
  "rcp_engine_thermal_power": {
    "id": "rcp_engine_thermal_power",
    "name": "灵核热力聚变",
    "category": "能源转化",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 60,
    "power": -50,
    "input": {
      "item": "coal",
      "amount": 1,
      "ratePerMin": 1,
      "name": "煤炭"
    },
    "output": {
      "item": "purify_residue",
      "amount": 1,
      "ratePerMin": 1,
      "name": "净化残渣"
    },
    "inputs": [
      {
        "item": "coal",
        "count": 1,
        "rate": 1
      }
    ],
    "outputs": [
      {
        "item": "purify_residue",
        "count": 1,
        "rate": 1
      }
    ],
    "desc": "灵力引擎底座燃烧煤炭或燃料，持续产生150☼高热并无线输出50MW电力，副产净化残渣。"
  },
  "rcp_engine_super_steam": {
    "id": "rcp_engine_super_steam",
    "name": "高压聚灵过热汽",
    "category": "能源转化",
    "building": "power_engine",
    "buildingId": "power_engine",
    "timeSec": 30,
    "power": -50,
    "input": {
      "item": "raw_water",
      "amount": 2,
      "ratePerMin": 4,
      "name": "原水"
    },
    "output": {
      "item": "recycled_pure_water",
      "amount": 2,
      "ratePerMin": 4,
      "name": "回用净化水"
    },
    "inputs": [
      {
        "item": "raw_water",
        "count": 2,
        "rate": 4
      }
    ],
    "outputs": [
      {
        "item": "recycled_pure_water",
        "count": 2,
        "rate": 4
      }
    ],
    "desc": "利用底座余热将原水加热蒸馏，为全厂循环水路回用提纯高品质净水。"
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

const XIUXIAN_MILESTONES = {
  1: {
    id: 1,
    tier: 'T1',
    realm: '炼气期',
    title: '中央处理器研究认证 (炼气 1 层)',
    subTitle: '天工基建',
    desc: '交付基础冶炼产物，升级天元中央处理器，全线解锁精炼炉、粉碎机、加工台与分流设施。',
    requirements: [
      { code: 'iron_ingot', need: 100 },
      { code: 'copper_ingot', need: 100 },
      { code: 'iron_plate', need: 100 }
    ],
    rewards: ['BD_102 精炼炉', 'BD_103 粉碎机', 'BD_104 加工台', 'BD_124 分流器']
  },
  2: {
    id: 2,
    tier: 'T2',
    realm: '筑基期',
    title: '精密机械与流体工业 (筑基 1 层)',
    subTitle: '精密物流',
    desc: '交付基础机械构件，打通切割、流体中枢与生物培育技术链路。',
    requirements: [
      { code: 'iron_gear', need: 150 },
      { code: 'copper_wire', need: 300 },
      { code: 'iron_beam', need: 100 }
    ],
    rewards: ['BD_105 切割机', 'BD_106 离心机', 'BD_108 培育仓', 'BD_110 搅拌机']
  },
  3: {
    id: 3,
    tier: 'T3',
    realm: '金丹期',
    title: '高阶神机与法脉组装 (金丹 1 层)',
    subTitle: '灵能矩阵',
    desc: '交付精密电气与灵能部件，解锁多轨校验重型组装机与空间跃迁传送门。',
    requirements: [
      { code: 'ling_copper_sheet', need: 200 },
      { code: 'power_supply_module', need: 100 },
      { code: 'wiring_assembly', need: 150 }
    ],
    rewards: ['BD_111 组装机', 'BD_114 传送门', 'BD_148 炼宝台']
  },
  4: {
    id: 4,
    tier: 'T4',
    realm: '元婴期',
    title: '元婴化神与通天飞升 (元婴 1 层)',
    subTitle: '终局飞升',
    desc: '交付法宝阵图胚与导脉构件，开启通天飞升矩阵与万仙中枢。',
    requirements: [
      { code: 'fabao_array_embryo', need: 50 },
      { code: 'daomai_sheet', need: 100 },
      { code: 'sha_crystal', need: 100 }
    ],
    rewards: ['BD_150 终局飞升矩阵', '万仙中枢全息互联']
  }
};

if (typeof window !== "undefined") {
  window.XIUXIAN_ITEMS = XIUXIAN_ITEMS;
  window.XIUXIAN_BUILDINGS = XIUXIAN_BUILDINGS;
  window.XIUXIAN_RECIPES = XIUXIAN_RECIPES;
  window.XIUXIAN_MILESTONES = XIUXIAN_MILESTONES;
  window.INITIAL_PLAYER_INVENTORY = INITIAL_PLAYER_INVENTORY;
}

if (typeof module !== "undefined") {
  module.exports = { XIUXIAN_ITEMS, XIUXIAN_BUILDINGS, XIUXIAN_RECIPES, XIUXIAN_MILESTONES, INITIAL_PLAYER_INVENTORY };
}

