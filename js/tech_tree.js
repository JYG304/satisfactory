// ====================================================================
// js/tech_tree.js - 修仙工厂 · 真实配方解锁树 (仙道工业 HUD 美术升级与联动版)
// 节点与配方链路 100% 保持原版配置不变，联动主游戏建造、配方测试与背包系统
// ====================================================================

const TECH_TREE_NODES = [
  // ==================== 阶段 I · 起步冶炼 ====================
  {"id": "BD_136", "name": "精炼炉", "kind": "器", "ntype": "device", "icon": "🔥", "x": 650, "y": 70, "parent": null, "extraReq": [], "pts": "-", "mats": "MAT_006×12;MAT_008×6;MAT_041×1", "desc": "阶段I起步设备：将矿石和辅料精炼成金属锭（自带玄铁锭、赤铜锭基础冶炼配方）。", "start": true, "gate": false},

  // ==================== 阶段 II · 基础加工与自动化 ====================
  {"id": "GATE_2", "name": "II", "kind": "", "ntype": "gate", "icon": "II", "x": 654, "y": 230, "parent": "BD_136", "extraReq": [], "pts": "-", "mats": "无", "desc": "阶段II入口 · 基础加工与自动化", "gate": true, "start": false},
  {"id": "BD_138", "name": "加工台", "kind": "器", "ntype": "device", "icon": "🛠", "x": 150, "y": 380, "parent": "GATE_2", "extraReq": [], "pts": "-", "mats": "MAT_006×8;MAT_008×4;MAT_065×1", "desc": "加工基础材料（玄铁板、玄铁齿轮、玄铁梁、铁管、机壳与初级剑丸）。", "start": false, "gate": false},
  {"id": "BD_137", "name": "粉碎机", "kind": "器", "ntype": "device", "icon": "⚙️", "x": 400, "y": 380, "parent": "GATE_2", "extraReq": [], "pts": "-", "mats": "MAT_006×6;MAT_008×4", "desc": "粉碎固体物料（产出玄铁粉、煤粉、赤铜粉、灵草粉、木屑，后期分离灵石矿与铅锭）。", "start": false, "gate": false},
  {"id": "BD_116", "name": "传送带", "kind": "器", "ntype": "device", "icon": "⇢", "x": 650, "y": 380, "parent": "GATE_2", "extraReq": [], "pts": "-", "mats": "MAT_006×2;MAT_008×1", "desc": "直线/弯轨/坡道传送带系统，用于连接生产、仓储与分拣设备。", "start": false, "gate": false},
  {"id": "BD_135", "name": "采矿机", "kind": "器", "ntype": "device", "icon": "⛏", "x": 900, "y": 380, "parent": "BD_138", "extraReq": [], "pts": "-", "mats": "MAT_006×10;MAT_008×5;MAT_065×1", "desc": "从矿脉节点持续采集玄铁矿、赤铜矿、煤炭、石英砂与灵石矿。", "start": false, "gate": false},
  {"id": "BD_139", "name": "切割机", "kind": "器", "ntype": "device", "icon": "✂️", "x": 1150, "y": 380, "parent": "BD_137", "extraReq": ["BD_138"], "pts": "-", "mats": "MAT_006×8;MAT_009×2;MAT_040×1", "desc": "精切导灵铜片、铜线、木板、木架与硅片。", "start": false, "gate": false},
  {"id": "BD_153", "name": "置物桌", "kind": "器", "ntype": "device", "icon": "🪑", "x": 40, "y": 530, "parent": "BD_138", "extraReq": [], "pts": "-", "mats": "MAT_048×4;MAT_006×2", "desc": "1×1×1m / 1×1×2m 置物桌，用于摆放道具与陈列奇物。", "start": false, "gate": false},
  {"id": "RCP_088", "name": "玄铁剑丸", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 150, "y": 530, "parent": "BD_138", "extraReq": ["BD_137"], "pts": "-", "mats": "玄铁锭×1、玄铁粉×2", "desc": "输出：玄铁剑丸×5（飞剑防御塔初级弹药）", "start": false, "gate": false},
  {"id": "RCP_030", "name": "灵磁齿轮", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 310, "y": 530, "parent": "BD_137", "extraReq": ["BD_138"], "pts": "-", "mats": "玄铁齿轮×1、玄铁粉×2", "desc": "输出：灵磁齿轮", "start": false, "gate": false},
  {"id": "BD_123", "name": "合流/分流器", "kind": "器", "ntype": "device", "icon": "🔀", "x": 540, "y": 530, "parent": "BD_116", "extraReq": [], "pts": "-", "mats": "BD_116×2;MAT_049×1", "desc": "解锁合流器(BD_123)、分流器(BD_124)、交叉器(BD_122)与垂直传送带(BD_121)。", "start": false, "gate": false},
  {"id": "BD_127", "name": "限速/智能物流", "kind": "器", "ntype": "device", "icon": "🎚", "x": 760, "y": 530, "parent": "BD_116", "extraReq": ["MAT_065"], "pts": "-", "mats": "BD_123×1;MAT_049×2;MAT_014×1", "desc": "解锁限速器(BD_127)、智能合流器(BD_125)与智能分流器(BD_126)。", "start": false, "gate": false},
  {"id": "BD_155", "name": "风力/燃料发电", "kind": "器", "ntype": "device", "icon": "🌬", "x": 960, "y": 530, "parent": "BD_135", "extraReq": [], "pts": "-", "mats": "MAT_040×4;MAT_011×8;MAT_016×10", "desc": "解锁风力发电机(BD_155, +45MW)与燃料发电机(BD_149, +100MW)。", "start": false, "gate": false},
  {"id": "RCP_056", "name": "电缆", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 1150, "y": 530, "parent": "BD_139", "extraReq": ["BD_138"], "pts": "-", "mats": "玄铁板×1、铜线×2", "desc": "进阶电气配方 · 输出：电缆", "start": false, "gate": false},
  {"id": "MAT_074", "name": "玄铁剑丸", "kind": "物", "ntype": "material", "icon": "⚔️", "x": 150, "y": 660, "parent": "RCP_088", "extraReq": [], "pts": "-", "mats": "无", "desc": "供飞剑防御塔发射，自动击杀练气修士并收集尸体。", "start": false, "gate": false},
  {"id": "MAT_009", "name": "灵磁齿轮", "kind": "物", "ntype": "material", "icon": "✥", "x": 310, "y": 660, "parent": "RCP_030", "extraReq": [], "pts": "-", "mats": "无", "desc": "机器传动核心，供采矿、切割、传动带与组装设备使用。", "start": false, "gate": false},
  {"id": "MAT_086", "name": "煤粉/碳棒", "kind": "物", "ntype": "material", "icon": "🧂", "x": 430, "y": 660, "parent": "BD_137", "extraReq": [], "pts": "-", "mats": "煤炭×1 / 煤粉×3+玄铁粉×1", "desc": "粉碎机分叉产出煤粉、赤铜粉与木屑，压制工业碳棒用于电极、净水与核燃料。", "start": false, "gate": false},
  {"id": "MAT_091", "name": "绝缘板", "kind": "物", "ntype": "material", "icon": "📜", "x": 1030, "y": 660, "parent": "BD_139", "extraReq": ["MAT_086"], "pts": "-", "mats": "木屑×2、清水×1", "desc": "现代绝缘基板，用于生产电路板、高压电容与炼宝台祭炼法宝。", "start": false, "gate": false},
  {"id": "MAT_065", "name": "电缆", "kind": "物", "ntype": "material", "icon": "🔌", "x": 1150, "y": 660, "parent": "RCP_056", "extraReq": [], "pts": "-", "mats": "无", "desc": "设备接线与电路板组件，接入橡胶护套可翻倍量产。", "start": false, "gate": false},

  // ==================== 阶段 III · 流体抽取与生物解构 ====================
  {"id": "GATE_3", "name": "III", "kind": "", "ntype": "gate", "icon": "III", "x": 654, "y": 800, "parent": "BD_116", "extraReq": ["BD_139", "MAT_009"], "pts": "-", "mats": "无", "desc": "阶段III入口 · 三液潭流体网、硅片半导体与生物解构", "gate": true, "start": false},
  {"id": "BD_160", "name": "飞剑防御塔", "kind": "器", "ntype": "device", "icon": "🗼", "x": 80, "y": 950, "parent": "GATE_3", "extraReq": ["MAT_074"], "pts": "-", "mats": "MAT_040×4;MAT_009×4;MAT_013×2;MAT_014×2", "desc": "自动发射剑丸迎击攻山修士，击杀后自动收集修士尸体送入物流线。", "start": false, "gate": false},
  {"id": "BD_140", "name": "解构机", "kind": "器", "ntype": "device", "icon": "⚗️", "x": 270, "y": 950, "parent": "GATE_3", "extraReq": ["BD_160"], "pts": "-", "mats": "MAT_040×10;MAT_012×3;MAT_066×1;MAT_065×2", "desc": "拆解修士尸体产出肉骸脑髓，并支持三阶逆向科研解析数据。", "start": false, "gate": false},
  {"id": "BD_134", "name": "抽水机", "kind": "器", "ntype": "device", "icon": "💧", "x": 510, "y": 950, "parent": "GATE_3", "extraReq": [], "pts": "-", "mats": "MAT_006×8;MAT_042×2;MAT_016×4", "desc": "抽取清水、原油与灵泉三大地图液潭，并开放全套水管管网(BD_128~133)。", "start": false, "gate": false},
  {"id": "BD_143", "name": "搅拌机", "kind": "器", "ntype": "device", "icon": "🧪", "x": 750, "y": 950, "parent": "BD_134", "extraReq": [], "pts": "-", "mats": "MAT_042×2;MAT_008×4;MAT_014×1", "desc": "混合多种液体，调配培养液、原浆与稳定液。", "start": false, "gate": false},
  {"id": "BD_145", "name": "提取器", "kind": "器", "ntype": "device", "icon": "🧬", "x": 980, "y": 950, "parent": "BD_140", "extraReq": ["BD_134"], "pts": "-", "mats": "MAT_040×5;MAT_044×2;MAT_042×2", "desc": "提取蛋白液/灵草液、裂解原油，并提纯灵液、重水与凝丹液。", "start": false, "gate": false},
  {"id": "MAT_098", "name": "石英砂/硅片", "kind": "物", "ntype": "material", "icon": "🪟", "x": 1180, "y": 950, "parent": "GATE_3", "extraReq": ["BD_135", "BD_139"], "pts": "-", "mats": "石英砂×2 -> 玻璃 -> 硅片/药瓶", "desc": "阶段III新增矿脉：烧制玻璃并切割硅片，供半导体芯片与瓶装炼丹线。", "start": false, "gate": false},
  {"id": "MAT_018", "name": "血肉", "kind": "物", "ntype": "material", "icon": "🥩", "x": 160, "y": 1100, "parent": "BD_140", "extraReq": [], "pts": "-", "mats": "无", "desc": "解构机拆解尸体产出，用于提取蛋白液与炼制气血丹。", "start": false, "gate": false},
  {"id": "MAT_019", "name": "脑髓", "kind": "物", "ntype": "material", "icon": "🧠", "x": 270, "y": 1100, "parent": "BD_140", "extraReq": [], "pts": "-", "mats": "无", "desc": "用于制作生物芯片、人造经脉芯片与解析研究数据。", "start": false, "gate": false},
  {"id": "MAT_021", "name": "骸骨", "kind": "物", "ntype": "material", "icon": "🦴", "x": 380, "y": 1100, "parent": "BD_140", "extraReq": [], "pts": "-", "mats": "无", "desc": "用于建造培养皿、制作生物滤芯及培育人造经脉。", "start": false, "gate": false},
  {"id": "BD_128", "name": "水管管网", "kind": "器", "ntype": "device", "icon": "🚿", "x": 510, "y": 1100, "parent": "BD_134", "extraReq": [], "pts": "-", "mats": "MAT_042×1", "desc": "解锁水管直管/弯管/三通(BD_128~133)及流体处理中枢(BD_158)。", "start": false, "gate": false},
  {"id": "MAT_024", "name": "培养液", "kind": "物", "ntype": "material", "icon": "🧴", "x": 690, "y": 1100, "parent": "BD_143", "extraReq": [], "pts": "-", "mats": "无", "desc": "培养皿种植灵草与培养仓育胎的营养培养液。", "start": false, "gate": false},
  {"id": "MAT_029", "name": "原浆", "kind": "物", "ntype": "material", "icon": "🫗", "x": 810, "y": 1100, "parent": "BD_143", "extraReq": ["BD_145"], "pts": "-", "mats": "无", "desc": "高浓生物原浆，离心分离精元液与血膏的原料，也可使血胎产量翻倍。", "start": false, "gate": false},
  {"id": "MAT_023", "name": "蛋白液", "kind": "物", "ntype": "material", "icon": "🧪", "x": 980, "y": 1100, "parent": "BD_145", "extraReq": [], "pts": "-", "mats": "无", "desc": "用于调配培养液、原浆与制备回气散/气血丹。", "start": false, "gate": false},
  {"id": "MAT_093", "name": "原油分馏", "kind": "物", "ntype": "material", "icon": "🛢️", "x": 1180, "y": 1100, "parent": "BD_134", "extraReq": ["BD_145"], "pts": "-", "mats": "原油 -> 塑料/燃油/橡胶/润滑油", "desc": "抽水机抽取旧世界油田，分馏出燃油、润滑油、塑料与橡胶四大工业支柱。", "start": false, "gate": false},
  {"id": "MAT_090", "name": "回气散", "kind": "物", "ntype": "material", "icon": "💊", "x": 1100, "y": 1250, "parent": "MAT_023", "extraReq": ["MAT_086"], "pts": "-", "mats": "灵草粉×2+蛋白液×1", "desc": "早期药粉成品：可装瓶提炼双倍气血丹，也可加速培养血胎。", "start": false, "gate": false},
  {"id": "BD_141", "name": "培养皿", "kind": "器", "ntype": "device", "icon": "🌱", "x": 580, "y": 1250, "parent": "MAT_024", "extraReq": ["MAT_021"], "pts": "-", "mats": "MAT_021×2;MAT_006×1", "desc": "种植成熟灵草（木炭灰/灵泉翻倍催熟）、煞气灵草与繁殖净化剂。", "start": false, "gate": false},
  {"id": "BD_142", "name": "培养仓", "kind": "器", "ntype": "device", "icon": "🧫", "x": 720, "y": 1250, "parent": "BD_141", "extraReq": ["MAT_024"], "pts": "-", "mats": "MAT_040×3;MAT_012×2;MAT_043×1;MAT_006×4;MAT_063×2", "desc": "培育血胎、人造经脉、灵根座及生丹（排出血水/煞水进回收塔）。", "start": false, "gate": false},
  {"id": "BD_144", "name": "离心机", "kind": "器", "ntype": "device", "icon": "🌀", "x": 870, "y": 1250, "parent": "MAT_029", "extraReq": ["BD_145"], "pts": "-", "mats": "MAT_040×8;MAT_012×2;MAT_013×1;MAT_042×2", "desc": "离心分离原浆、原油与灵泉，后期负责煞气分离。", "start": false, "gate": false},
  {"id": "MAT_022", "name": "精元液", "kind": "物", "ntype": "material", "icon": "💧", "x": 870, "y": 1390, "parent": "BD_144", "extraReq": [], "pts": "-", "mats": "无", "desc": "培育人造经脉、骨板、稳定液与凝丹液的关键精华。", "start": false, "gate": false},
  {"id": "MAT_106", "name": "灵泉/重水", "kind": "物", "ntype": "material", "icon": "⛲", "x": 1100, "y": 1390, "parent": "BD_144", "extraReq": ["BD_134"], "pts": "-", "mats": "灵泉 -> 灵石粉 + 重水 + 灵液", "desc": "外星辐射渗水潭（土著称灵泉），离心提纯重水冷却液与高纯灵液。", "start": false, "gate": false},

  // ==================== 阶段 IV · 高温冶金与筑基总装 ====================
  {"id": "GATE_4", "name": "IV", "kind": "", "ntype": "gate", "icon": "IV", "x": 654, "y": 1530, "parent": "BD_144", "extraReq": ["BD_142", "MAT_022"], "pts": "-", "mats": "无", "desc": "阶段IV入口 · 灵石矿、高温冶金、回收闭环与人造灵根", "gate": true, "start": false},
  {"id": "BD_148", "name": "冶炼舱（上）", "kind": "器", "ntype": "device", "icon": "♨️", "x": 200, "y": 1680, "parent": "GATE_4", "extraReq": [], "pts": "-", "mats": "MAT_006×10;MAT_041×2;MAT_009×3", "desc": "高温冶炼精炼玄铁锭、高温合金锭、动力核心、煞气合金、燃料棒与人造灵石。", "start": false, "gate": false},
  {"id": "BD_146", "name": "组装机", "kind": "器", "ntype": "device", "icon": "🏭", "x": 520, "y": 1680, "parent": "GATE_4", "extraReq": [], "pts": "-", "mats": "MAT_040×5;MAT_014×3;MAT_009×4;MAT_066×1;MAT_054×1", "desc": "高阶复合总装机，负责超频插件、骨板、高产剑丸与人造灵根。", "start": false, "gate": false},
  {"id": "BD_150", "name": "回收处理塔", "kind": "器", "ntype": "device", "icon": "♜", "x": 860, "y": 1680, "parent": "GATE_4", "extraReq": ["BD_146", "BD_148"], "pts": "-", "mats": "MAT_040×15;MAT_044×3;MAT_045×1;MAT_055×1;MAT_038×2;MAT_047×4;MAT_016×8", "desc": "净化血水与煞水，产出净化水、滤渣、煞气结晶与液态煞气。", "start": false, "gate": false},
  {"id": "MAT_102", "name": "灵石矿/铅板", "kind": "物", "ntype": "material", "icon": "☢️", "x": 1120, "y": 1680, "parent": "GATE_4", "extraReq": ["BD_135", "BD_137"], "pts": "-", "mats": "灵石矿×2 -> 灵石粉×3 + 铅锭×1", "desc": "天然外星辐射矿脉（土著称灵石矿），分离灵石粉与防辐射铅锭。", "start": false, "gate": false},
  {"id": "MAT_039", "name": "高温合金锭", "kind": "物", "ntype": "material", "icon": "🟨", "x": 200, "y": 1820, "parent": "BD_148", "extraReq": [], "pts": "-", "mats": "无", "desc": "炼宝台、渡劫台、炼丹炉与跨区传送门的核心合金。", "start": false, "gate": false},
  {"id": "MAT_050", "name": "人造灵根", "kind": "物", "ntype": "material", "icon": "🌿", "x": 520, "y": 1820, "parent": "BD_146", "extraReq": ["BD_148", "BD_142"], "pts": "-", "mats": "无", "desc": "筑基期终局主线交付物，也是金丹期培育生丹的核心母体。", "start": false, "gate": false},
  {"id": "MAT_075", "name": "爆裂剑丸", "kind": "物", "ntype": "material", "icon": "💣", "x": 760, "y": 1820, "parent": "BD_150", "extraReq": ["BD_146"], "pts": "-", "mats": "无", "desc": "使用滤渣或燃油装填的中阶剑丸，自动猎杀筑基修士。", "start": false, "gate": false},
  {"id": "MAT_067", "name": "煞气结晶", "kind": "物", "ntype": "material", "icon": "💎", "x": 960, "y": 1820, "parent": "BD_150", "extraReq": [], "pts": "-", "mats": "无", "desc": "分离液态煞气获得，用于煞气合金、煞气剑丸与人造灵石。", "start": false, "gate": false},
  {"id": "BD_156", "name": "炼宝台", "kind": "器", "ntype": "device", "icon": "🔮", "x": 860, "y": 1960, "parent": "MAT_067", "extraReq": ["MAT_039"], "pts": "-", "mats": "MAT_040×6;MAT_039×4;MAT_011×8;MAT_065×4;MAT_066×2;MAT_063×4", "desc": "祭炼法宝胚与高阶组件，稳定产出法宝成品、人造灵石与解析数据。", "start": false, "gate": false},
  {"id": "MAT_110", "name": "法宝", "kind": "物", "ntype": "material", "icon": "🏮", "x": 1100, "y": 1960, "parent": "BD_156", "extraReq": ["MAT_102"], "pts": "-", "mats": "法宝胚+核心/灵液/稳定液", "desc": "可量产高阶法宝成品，用于终局科研解析与渡劫台双倍凝丹。", "start": false, "gate": false},

  // ==================== 阶段 V · 热能引擎与工业炼丹（金丹前期） ====================
  {"id": "GATE_5", "name": "V", "kind": "", "ntype": "gate", "icon": "V", "x": 654, "y": 2110, "parent": "MAT_050", "extraReq": ["BD_150", "BD_156"], "pts": "-", "mats": "无", "desc": "阶段V入口 · 核燃料棒、工业炼丹与跨区传送（金丹前期）", "gate": true, "start": false},
  {"id": "BD_147", "name": "灵力引擎（下）", "kind": "器", "ntype": "device", "icon": "⚡", "x": 380, "y": 2260, "parent": "GATE_5", "extraReq": [], "pts": "-", "mats": "MAT_011×8;MAT_013×5;MAT_046×1;MAT_016×8;MAT_039×5", "desc": "烧煤、燃油或燃料棒发电150/s并向顶部冶炼舱/炼丹炉供热50/s。", "start": false, "gate": false},
  {"id": "BD_163", "name": "炼丹炉（上）", "kind": "器", "ntype": "device", "icon": "🏺", "x": 650, "y": 2260, "parent": "BD_147", "extraReq": [], "pts": "-", "mats": "MAT_039×6;MAT_041×2;MAT_042×4;MAT_037×2", "desc": "架设在灵力引擎上方，支持药瓶流水线、血胎直炼或整尸血炼气血丹/破障丹。", "start": false, "gate": false},
  {"id": "BD_151", "name": "跨区传送门", "kind": "器", "ntype": "device", "icon": "🌀", "x": 920, "y": 2260, "parent": "BD_147", "extraReq": [], "pts": "-", "mats": "MAT_046×2;MAT_015×2;MAT_040×10;MAT_039×4;MAT_083×4", "desc": "配对后跨区域高速传送固体物料。", "start": false, "gate": false},
  {"id": "MAT_109", "name": "燃料棒", "kind": "物", "ntype": "material", "icon": "🔋", "x": 160, "y": 2400, "parent": "BD_147", "extraReq": ["MAT_102", "MAT_106"], "pts": "-", "mats": "灵石粉×4+铅板×2+重水×1", "desc": "核级高热燃料棒，供灵力引擎超频发电与渡劫台双倍凝丹。", "start": false, "gate": false},
  {"id": "MAT_078", "name": "煞气灵草", "kind": "物", "ntype": "material", "icon": "🌾", "x": 340, "y": 2400, "parent": "BD_163", "extraReq": [], "pts": "-", "mats": "无", "desc": "由培养皿吸收滤渣与净化水/灵泉培育的高阶灵草。", "start": false, "gate": false},
  {"id": "RCP_097", "name": "气血丹炼制", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 540, "y": 2400, "parent": "BD_163", "extraReq": [], "pts": "-", "mats": "成熟灵草×2、血肉×2、蛋白液×1", "desc": "输出：气血丹、药渣（支持药瓶流水线增产）", "start": false, "gate": false},
  {"id": "RCP_098", "name": "破障丹", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 760, "y": 2400, "parent": "RCP_097", "extraReq": ["MAT_078"], "pts": "-", "mats": "煞气灵草×2、气血丹×1、液态煞气×1", "desc": "输出：破障丹、药渣（支持三阶科研解析）", "start": false, "gate": false},
  {"id": "MAT_082", "name": "凝丹液", "kind": "物", "ntype": "material", "icon": "🧪", "x": 760, "y": 2540, "parent": "RCP_098", "extraReq": [], "pts": "-", "mats": "无", "desc": "提取器提纯破障丹与精元液获得的顶级培养液。", "start": false, "gate": false},

  // ==================== 阶段 VI · 煞气剑丸与渡劫金丹（金丹终局） ====================
  {"id": "GATE_6", "name": "VI", "kind": "", "ntype": "gate", "icon": "VI", "x": 654, "y": 2680, "parent": "MAT_082", "extraReq": ["BD_151"], "pts": "-", "mats": "无", "desc": "阶段VI入口 · 煞气剑丸、生丹与渡劫飞升（1.0终局）", "gate": true, "start": false},
  {"id": "MAT_076", "name": "煞气剑丸", "kind": "物", "ntype": "material", "icon": "🗡", "x": 280, "y": 2830, "parent": "GATE_6", "extraReq": [], "pts": "-", "mats": "无", "desc": "飞剑防御塔终极弹药，自动猎杀金丹修士获取金丹修士尸体。", "start": false, "gate": false},
  {"id": "MAT_077", "name": "金丹碎片", "kind": "物", "ntype": "material", "icon": "⚛️", "x": 480, "y": 2830, "parent": "MAT_076", "extraReq": [], "pts": "-", "mats": "无", "desc": "解构机拆解金丹修士尸体产出的金丹碎片，可用于生丹或聚宝。", "start": false, "gate": false},
  {"id": "MAT_083", "name": "人造灵石", "kind": "物", "ntype": "material", "icon": "💠", "x": 840, "y": 2830, "parent": "GATE_6", "extraReq": [], "pts": "-", "mats": "无", "desc": "煤炭/灵石粉浓缩合成，或炼宝台祭炼产出，渡劫凝丹消耗品。", "start": false, "gate": false},
  {"id": "MAT_084", "name": "生丹", "kind": "物", "ntype": "material", "icon": "🥚", "x": 540, "y": 2970, "parent": "MAT_077", "extraReq": ["MAT_082"], "pts": "-", "mats": "无", "desc": "培养仓输入人造灵根+金丹碎片+凝丹液活体培育出的生丹毛坯。", "start": false, "gate": false},
  {"id": "BD_157", "name": "渡劫台", "kind": "器", "ntype": "device", "icon": "⚡", "x": 650, "y": 3100, "parent": "MAT_084", "extraReq": ["MAT_083"], "pts": "-", "mats": "MAT_040×8;MAT_039×6;MAT_105×8;MAT_097×6;MAT_065×6;MAT_066×3", "desc": "终局渡劫设施：通入重水冷却并加装铅板/橡胶防雷，凝练人造金丹。", "start": false, "gate": false},
  {"id": "MAT_085", "name": "人造金丹", "kind": "物", "ntype": "material", "icon": "🟡", "x": 650, "y": 3240, "parent": "BD_157", "extraReq": [], "pts": "-", "mats": "无", "desc": "1.0正式版终极目标物！全产线大汇聚结晶，解锁点煞成石万物自循环。", "start": false, "gate": false}
];

const techNodeMap = Object.fromEntries(TECH_TREE_NODES.map(n => [n.id, n]));
const techUnlockedSet = new Set(TECH_TREE_NODES.filter(n => n.start).map(n => n.id));
let techSelectedId = 'BD_136';
let techPanX = 0;
let techPanY = 20;
let techZoom = 0.85;
let techPanBound = false;

function applyTechTreeTransform() {
  const world = document.getElementById('techTreeWorld');
  if (world) {
    world.style.transform = `translate(${techPanX}px, ${techPanY}px) scale(${techZoom})`;
  }
  const lbl = document.getElementById('techTreeZoomLabel');
  if (lbl) lbl.innerText = `${Math.round(techZoom * 100)}%`;
}

function resetTechTreeView() {
  const vp = document.getElementById('techTreeViewport');
  techZoom = 0.85;
  techPanX = vp ? Math.round((vp.clientWidth - 1380 * techZoom) / 2) : 0;
  techPanY = 20;
  applyTechTreeTransform();
}

function techTreeZoomBy(delta) {
  techZoom = Math.max(0.4, Math.min(1.6, Math.round((techZoom + delta) * 100) / 100));
  applyTechTreeTransform();
}

function initTechTreePanZoom() {
  if (techPanBound) return;
  const vp = document.getElementById('techTreeViewport');
  if (!vp) return;
  techPanBound = true;

  let dragging = false;
  let moved = 0;
  let lx = 0;
  let ly = 0;

  vp.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    dragging = true;
    moved = 0;
    lx = e.clientX;
    ly = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    moved += Math.abs(dx) + Math.abs(dy);
    techPanX += dx;
    techPanY += dy;
    lx = e.clientX;
    ly = e.clientY;
    applyTechTreeTransform();
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });

  vp.addEventListener('wheel', (e) => {
    e.preventDefault();
    const step = e.deltaY < 0 ? 0.08 : -0.08;
    techTreeZoomBy(step);
  }, { passive: false });
}

function getTechNodeState(n) {
  if (techUnlockedSet.has(n.id)) return 'unlocked';
  const reqs = [n.parent].filter(Boolean).concat(n.extraReq || []);
  return reqs.every(id => techUnlockedSet.has(id)) ? 'available' : 'locked';
}

function getTechReqNames(n) {
  const arr = [];
  if (n.parent) arr.push(techNodeMap[n.parent]?.name || n.parent);
  (n.extraReq || []).forEach(id => arr.push(techNodeMap[id]?.name || id));
  return arr.length ? arr.join('、') : '无';
}

function getTechTypeLabel(n) {
  if (n.gate) return '阶段入口';
  if (n.ntype === 'device') return '工业设备';
  if (n.ntype === 'recipe') return '生产配方';
  return '核心物料';
}

// 将节点图标升级为带仙道工业光效的矢量/图标表现
function getTechVisualHtml(n, st) {
  if (n.gate) {
    return `<span class="font-serif font-black text-2xl tracking-widest">${n.icon}</span>`;
  }
  const faMap = {
    BD_136: 'fa-fire-burner text-amber-300',
    BD_138: 'fa-screwdriver-wrench text-cyan-300',
    BD_137: 'fa-gears text-orange-300',
    BD_116: 'fa-arrow-right-arrow-left text-sky-300',
    BD_135: 'fa-person-digging text-yellow-300',
    BD_139: 'fa-scissors text-cyan-200',
    BD_140: 'fa-flask-vial text-rose-300',
    BD_134: 'fa-faucet-drip text-sky-300',
    BD_143: 'fa-blender text-cyan-300',
    BD_145: 'fa-dna text-teal-300',
    BD_146: 'fa-industry text-amber-300',
    BD_148: 'fa-temperature-high text-orange-400',
    BD_141: 'fa-seedling text-emerald-300',
    BD_142: 'fa-vial-circle-check text-emerald-300',
    BD_144: 'fa-fan text-sky-300',
    BD_150: 'fa-tower-observation text-emerald-300',
    BD_156: 'fa-wand-magic-sparkles text-purple-300',
    BD_157: 'fa-bolt text-yellow-300',
    BD_160: 'fa-crosshairs text-rose-400',
    BD_147: 'fa-bolt-lightning text-amber-400',
    BD_163: 'fa-flask text-orange-300',
    BD_151: 'fa-circle-nodes text-purple-400'
  };
  if (faMap[n.id]) {
    return `<i class="fa-solid ${faMap[n.id]} text-2xl drop-shadow"></i>`;
  }
  if (n.ntype === 'recipe') {
    const colorCls = st === 'unlocked' ? 'text-cyan-300' : (st === 'available' ? 'text-emerald-300' : 'text-slate-400');
    return `<i class="fa-solid fa-scroll ${colorCls} text-xl drop-shadow"></i>`;
  }
  return `<span class="text-2xl drop-shadow">${n.icon}</span>`;
}

function renderTechTree() {
  const root = document.getElementById('techTreeNodesLayer');
  const svg = document.getElementById('techTreeLinksSvg');
  if (!root || !svg) return;

  root.innerHTML = '';
  svg.innerHTML = '';

  // 1. 绘制 SVG 灵脉能量连线 (带发光滤镜与流动虚线)
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="techGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  svg.appendChild(defs);

  TECH_TREE_NODES.forEach(n => {
    if (!n.parent || !techNodeMap[n.parent]) return;
    const p = techNodeMap[n.parent];
    const x1 = p.gate ? p.x + 37 : p.x + 41;
    const y1 = p.gate ? p.y + 74 : p.y + 82;
    const x2 = n.gate ? n.x + 37 : n.x + 41;
    const y2 = n.y;
    const d = Math.abs(x1 - x2) < 8 ? `M${x1},${y1} V${y2}` : `M${x1},${y1} V${(y1 + y2) / 2} H${x2} V${y2}`;

    const isParentOn = techUnlockedSet.has(n.parent);
    const isSelfOn = techUnlockedSet.has(n.id);
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', d);
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('stroke-linejoin', 'round');
    if (isParentOn && isSelfOn) {
      pathEl.setAttribute('stroke', '#00f0ff');
      pathEl.setAttribute('stroke-width', '3.5');
      pathEl.setAttribute('filter', 'url(#techGlowCyan)');
    } else if (isParentOn) {
      pathEl.setAttribute('stroke', '#10b981');
      pathEl.setAttribute('stroke-width', '2.8');
      pathEl.setAttribute('stroke-dasharray', '6 4');
    } else {
      pathEl.setAttribute('stroke', 'rgba(148,163,184,0.22)');
      pathEl.setAttribute('stroke-width', '2.2');
    }
    svg.appendChild(pathEl);
  });

  // 2. 渲染节点卡片
  TECH_TREE_NODES.forEach(n => {
    const st = getTechNodeState(n);
    const isSel = techSelectedId === n.id;
    const btn = document.createElement('button');
    btn.dataset.nodeId = n.id;
    btn.style.left = `${n.x}px`;
    btn.style.top = `${n.y}px`;

    if (n.gate) {
      btn.className = `absolute w-[74px] h-[74px] rounded-lg border-2 flex items-center justify-center z-10 cursor-pointer transition-all duration-200 ${
        st === 'unlocked'
          ? 'bg-gradient-to-b from-amber-500/30 to-amber-900/60 border-amber-400 text-amber-200 shadow-[0_0_22px_rgba(245,158,11,0.55)]'
          : st === 'available'
          ? 'bg-gradient-to-b from-emerald-500/25 to-emerald-950/70 border-emerald-400 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.45)] animate-pulse'
          : 'bg-[#111722]/90 border-slate-600 text-slate-400'
      } ${isSel ? 'ring-2 ring-white scale-105' : 'hover:scale-105'}`;
      btn.innerHTML = getTechVisualHtml(n, st);
    } else {
      const frameStyle = st === 'unlocked'
        ? 'bg-gradient-to-b from-[#103b54] to-[#0a1d2e] border-[#00f0ff] shadow-[0_0_18px_rgba(0,240,255,0.38)]'
        : st === 'available'
        ? 'bg-gradient-to-b from-[#134232] to-[#0b241c] border-[#10b981] shadow-[0_0_18px_rgba(16,185,129,0.4)]'
        : 'bg-gradient-to-b from-[#181f2b] to-[#0d121a] border-slate-700/80 opacity-85';

      const kindBadgeStyle = n.kind === '器'
        ? 'bg-amber-400 text-slate-950'
        : n.kind === '方'
        ? 'bg-cyan-400 text-slate-950'
        : 'bg-emerald-400 text-slate-950';

      btn.className = `group absolute w-[82px] h-[82px] z-10 hover:z-30 cursor-pointer transition-transform duration-150 ${isSel ? 'scale-110 z-20' : 'hover:-translate-y-1'}`;
      btn.innerHTML = `
        <div class="w-full h-full rounded-xl border-2 ${frameStyle} ${isSel ? 'ring-2 ring-amber-300' : ''} flex items-center justify-center relative overflow-hidden"
             style="clip-path: polygon(16% 0, 84% 0, 100% 16%, 100% 84%, 84% 100%, 16% 100%, 0 84%, 0 16%);">
          <div class="absolute inset-1.5 border border-white/15 pointer-events-none"
               style="clip-path: polygon(16% 0, 84% 0, 100% 16%, 100% 84%, 84% 100%, 16% 100%, 0 84%, 0 16%);"></div>
          ${getTechVisualHtml(n, st)}
        </div>
        <span class="absolute -right-1 -top-1 min-w-[20px] h-[20px] px-1 rounded-full ${kindBadgeStyle} text-[10px] font-black flex items-center justify-center shadow">${n.kind}</span>
        <div class="absolute left-1/2 -translate-x-1/2 top-[85px] px-1.5 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-bold whitespace-nowrap ${st === 'locked' ? 'text-slate-400' : 'text-slate-100'} pointer-events-none">
          ${n.name}
        </div>
      `;
    }

    btn.onmouseenter = (e) => showTechTooltip(e, n);
    btn.onmousemove = (e) => moveTechTooltip(e);
    btn.onmouseleave = () => hideTechTooltip();
    btn.onclick = (e) => { e.stopPropagation(); selectTechNode(n.id, false); };
    btn.ondblclick = (e) => { e.stopPropagation(); unlockTechNode(n.id); };
    root.appendChild(btn);
  });

  // 同步进度计数
  const progEl = document.getElementById('techTreeProgressText');
  if (progEl) {
    progEl.innerText = `已解锁 ${techUnlockedSet.size} / ${TECH_TREE_NODES.length}`;
  }
}

function showTechTooltip(e, n) {
  const tip = document.getElementById('techTreeTip');
  if (!tip) return;
  const st = getTechNodeState(n);
  const stLabel = st === 'unlocked' ? '<span class="text-cyan-300">已解锁</span>' : st === 'available' ? '<span class="text-emerald-300">可解锁 (双击)</span>' : '<span class="text-slate-400">未满足前置</span>';
  tip.innerHTML = `
    <div class="font-bold text-amber-300 text-xs mb-0.5">${n.name}</div>
    <div class="text-[10px] font-mono text-cyan-300/80 mb-1.5">${getTechTypeLabel(n)} · ${n.id}</div>
    <div class="text-[11px] text-slate-200 leading-relaxed mb-1.5">${n.desc}</div>
    <div class="text-[10.5px] text-slate-300 space-y-0.5 border-t border-white/10 pt-1.5">
      <div>状态：<b>${stLabel}</b></div>
      <div>材料 / 输入：<b class="text-amber-200">${n.mats}</b></div>
      <div>前置需求：<b class="text-cyan-200">${getTechReqNames(n)}</b></div>
    </div>
  `;
  tip.classList.remove('hidden');
  moveTechTooltip(e);
}

function moveTechTooltip(e) {
  const tip = document.getElementById('techTreeTip');
  if (!tip) return;
  tip.style.left = `${Math.min(window.innerWidth - 320, e.clientX + 16)}px`;
  tip.style.top = `${Math.min(window.innerHeight - 190, e.clientY + 16)}px`;
}

function hideTechTooltip() {
  const tip = document.getElementById('techTreeTip');
  if (tip) tip.classList.add('hidden');
}

function selectTechNode(id, forceRedraw = true) {
  techSelectedId = id;
  const n = techNodeMap[id];
  const panel = document.getElementById('techTreeSidePanel');
  if (n && panel) {
    const st = getTechNodeState(n);
    const stBadge = st === 'unlocked'
      ? '<span class="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[10px] font-bold">已解锁</span>'
      : st === 'available'
      ? '<span class="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold">可解锁</span>'
      : '<span class="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600 text-slate-400 text-[10px] font-bold">未满足前置</span>';

    let actionBtnsHtml = '';
    if (st === 'available') {
      actionBtnsHtml += `
        <button onclick="unlockTechNode('${n.id}');" class="w-full py-2 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer transition">
          ⚡ 立即解锁该节点
        </button>
      `;
    }
    let rcpSummaryHtml = '';
    if (n.ntype === 'device' && !n.gate) {
      const bKey = (typeof XIUXIAN_CANONICAL_TO_BUILDING_KEY !== 'undefined' && XIUXIAN_CANONICAL_TO_BUILDING_KEY[n.id]) || n.id.toLowerCase();
      const bObj = (typeof XIUXIAN_BUILDINGS !== 'undefined') ? XIUXIAN_BUILDINGS[bKey] : null;
      if (bObj && Array.isArray(bObj.recipes) && bObj.recipes.length > 0) {
        const rcCount = bObj.recipes.length;
        const topRc = bObj.recipes.slice(0, 5).map(rk => {
          const r = (typeof XIUXIAN_RECIPES !== 'undefined') ? XIUXIAN_RECIPES[rk] : null;
          return r ? r.name : rk;
        }).join('、');
        rcpSummaryHtml = `
          <div class="bg-cyan-950/40 border border-cyan-500/30 rounded p-2 text-[11px] mb-2.5">
            <div class="flex items-center justify-between text-cyan-300 font-bold mb-1">
              <span>📜 承载专属配方 (${rcCount}方):</span>
            </div>
            <div class="text-slate-300 text-[10px] leading-relaxed">${topRc}${rcCount > 5 ? ` 等共 ${rcCount} 种工艺` : ''}</div>
          </div>
        `;
      }
      actionBtnsHtml += `
        <div class="grid grid-cols-2 gap-2">
          <button onclick="techTreeGoBuild('${bKey}');" class="py-1.5 px-2 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 font-bold text-[11px] cursor-pointer transition">
            🔨 3D 建造放置
          </button>
          <button onclick="techTreeOpenMachine('${bKey}');" class="py-1.5 px-2 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-bold text-[11px] cursor-pointer transition">
            ⚙️ 打开配方测试
          </button>
        </div>
      `;
    } else if (n.ntype === 'recipe') {
      actionBtnsHtml += `
        <button onclick="techTreeTestRecipe('${n.id}');" class="w-full py-1.5 px-2 rounded bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/60 text-cyan-200 font-bold text-[11px] cursor-pointer transition">
          🧪 跳转到对应机器测试此配方
        </button>
      `;
    } else if (n.ntype === 'material') {
      const itemKey = findItemKeyByMatId(n.id);
      const stock = (itemKey && typeof playerInventory !== 'undefined') ? (playerInventory[itemKey] || 0) : 0;
      actionBtnsHtml += `
        <div class="flex items-center justify-between bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs">
          <span class="text-slate-300">当前背包库存: <b class="text-amber-300 font-mono">${stock}</b></span>
          ${itemKey ? `<button onclick="techTreeGrantItem('${itemKey}', '${n.name}');" class="px-2 py-0.5 rounded bg-emerald-500/25 hover:bg-emerald-500/45 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold cursor-pointer transition">+10 测试发料</button>` : ''}
        </div>
      `;
    }

    panel.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">${getTechTypeLabel(n)} · ${n.id}</span>
        ${stBadge}
      </div>
      <div class="flex items-center space-x-2.5 mb-2.5">
        <div class="w-10 h-10 rounded-lg bg-black/50 border border-cyan-400/40 flex items-center justify-center shrink-0">${getTechVisualHtml(n, st)}</div>
        <div class="text-base font-black text-amber-200">${n.name}</div>
      </div>
      <div class="text-xs text-slate-300 leading-relaxed mb-3">${n.desc}</div>
      <div class="space-y-1.5 text-xs border-t border-white/10 pt-2.5 mb-3">
        <div class="flex justify-between gap-2"><span class="text-slate-400 shrink-0">材料/输入:</span><span class="text-amber-200 font-mono text-right break-all">${n.mats}</span></div>
        <div class="flex justify-between gap-2"><span class="text-slate-400 shrink-0">前置节点:</span><span class="text-cyan-200 text-right">${getTechReqNames(n)}</span></div>
      </div>
      ${rcpSummaryHtml}
      <div class="space-y-2">${actionBtnsHtml}</div>
    `;
  }
  if (forceRedraw) {
    renderTechTree();
  } else {
    // 仅更新选中态高亮，不重建 DOM，保证双击事件 ondblclick 100% 触发！
    document.querySelectorAll('#techTreeNodesLayer button').forEach(b => {
      const active = b.dataset.nodeId === techSelectedId;
      b.classList.toggle('scale-110', active);
      b.classList.toggle('z-20', active);
    });
  }
}

function findItemKeyByMatId(matId) {
  if (typeof XIUXIAN_ITEMS === 'undefined') return null;
  for (const [k, v] of Object.entries(XIUXIAN_ITEMS)) {
    if (v.matId === matId) return k;
  }
  return null;
}

function unlockTechNode(id) {
  const n = techNodeMap[id];
  if (!n || getTechNodeState(n) !== 'available') return;
  techUnlockedSet.add(id);
  if (typeof playUiSound === 'function') playUiSound('build_place');
  if (typeof showNotification === 'function') showNotification(`【配方树解锁】已解锁 ${getTechTypeLabel(n)}：【${n.name}】`);
  syncHudStageFromTechTree();
  selectTechNode(id);
}

function syncHudStageFromTechTree() {
  const stageBadge = document.getElementById('hudCurrentStageBadge');
  const objTitle = document.getElementById('hudObjectiveTitle');
  const stage = techUnlockedSet.has('GATE_6')
    ? 'VI · 金丹渡劫'
    : techUnlockedSet.has('GATE_5')
    ? 'V · 金丹炼丹'
    : techUnlockedSet.has('GATE_4')
    ? 'IV · 高温总装'
    : techUnlockedSet.has('GATE_3')
    ? 'III · 流体生物'
    : techUnlockedSet.has('GATE_2')
    ? 'II · 基础加工'
    : 'I · 起步冶炼';
  if (stageBadge) stageBadge.innerText = stage;
  if (objTitle) objTitle.innerText = `配方解锁树 (${techUnlockedSet.size}/${TECH_TREE_NODES.length})`;
}

function unlockAllTechNodesForTest() {
  TECH_TREE_NODES.forEach(n => techUnlockedSet.add(n.id));
  if (typeof playUiSound === 'function') playUiSound('toggle');
  if (typeof showNotification === 'function') showNotification('【测试模式】已一键解锁全部配方树节点！');
  selectTechNode(techSelectedId || 'BD_136');
}

function resetTechTree() {
  techUnlockedSet.clear();
  TECH_TREE_NODES.filter(n => n.start).forEach(n => techUnlockedSet.add(n.id));
  if (typeof playUiSound === 'function') playUiSound('click');
  selectTechNode('BD_136');
}

function techTreeGoBuild(buildingKey) {
  closeTechTreeModal();
  if (typeof enterBuildPlacingMode === 'function') {
    enterBuildPlacingMode(buildingKey);
  }
}

function techTreeOpenMachine(buildingKey) {
  closeTechTreeModal();
  if (typeof openMachineHUD === 'function') {
    openMachineHUD(buildingKey);
  }
}

function techTreeTestRecipe(rcpId) {
  const rcpKey = (typeof XIUXIAN_CANONICAL_TO_RECIPE_KEY !== 'undefined' && XIUXIAN_CANONICAL_TO_RECIPE_KEY[rcpId]) || rcpId.toLowerCase();
  const rcp = (typeof XIUXIAN_RECIPES !== 'undefined') ? XIUXIAN_RECIPES[rcpKey] : null;
  if (!rcp) {
    if (typeof showNotification === 'function') showNotification(`未在配方表找到 ${rcpId}`);
    return;
  }
  closeTechTreeModal();
  if (typeof openMachineHUD === 'function') {
    openMachineHUD(rcp.building || 'furnace');
    if (typeof selectMachineRecipe === 'function') {
      selectMachineRecipe(rcp.id);
    }
  }
}

function techTreeGrantItem(itemKey, itemName) {
  if (typeof playerInventory === 'undefined') return;
  playerInventory[itemKey] = (playerInventory[itemKey] || 0) + 10;
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
  if (typeof playUiSound === 'function') playUiSound('click');
  if (typeof showNotification === 'function') showNotification(`【测试发料】已向背包添加 ${itemName} ×10`);
  selectTechNode(techSelectedId);
}

function openTechTreeModal() {
  if (typeof closeOtherModals === 'function') closeOtherModals('techTreeModal');
  const modal = document.getElementById('techTreeModal');
  if (modal) {
    modal.classList.remove('hidden');
    if (typeof playUiSound === 'function') playUiSound('toggle');
    initTechTreePanZoom();
    resetTechTreeView();
    selectTechNode(techSelectedId || 'BD_136');
  }
}

function closeTechTreeModal() {
  const modal = document.getElementById('techTreeModal');
  if (modal) modal.classList.add('hidden');
}

function toggleTechTreeModal() {
  const modal = document.getElementById('techTreeModal');
  if (!modal) return;
  if (modal.classList.contains('hidden')) openTechTreeModal();
  else closeTechTreeModal();
}

window.TechTree = {
  open: openTechTreeModal,
  close: closeTechTreeModal,
  toggle: toggleTechTreeModal,
  unlockAll: unlockAllTechNodesForTest,
  reset: resetTechTree
};
window.openTechTreeModal = openTechTreeModal;
window.closeTechTreeModal = closeTechTreeModal;
window.toggleTechTreeModal = toggleTechTreeModal;
window.unlockTechNode = unlockTechNode;
window.unlockAllTechNodesForTest = unlockAllTechNodesForTest;
window.resetTechTree = resetTechTree;
window.techTreeGoBuild = techTreeGoBuild;
window.techTreeOpenMachine = techTreeOpenMachine;
window.techTreeTestRecipe = techTreeTestRecipe;
window.techTreeGrantItem = techTreeGrantItem;
window.techTreeZoomBy = techTreeZoomBy;
window.resetTechTreeView = resetTechTreeView;
