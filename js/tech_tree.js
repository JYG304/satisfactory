// ====================================================================
// js/tech_tree.js - 修仙工厂 · 真实配方解锁树 (仙道工业 HUD 美术升级与联动版)
// 节点与配方链路 100% 保持原版配置不变，联动主游戏建造、配方测试与背包系统
// ====================================================================

const TECH_TREE_NODES = [
  // ==================== 阶段 I · 练气期（凡铁初冶 · 基础带网 · 实体科研起点 · 17节点） ====================
  {"id": "BD_136", "name": "精炼炉", "kind": "器", "ntype": "device", "icon": "🔥", "x": 650, "y": 70, "parent": null, "extraReq": [], "pts": "-", "mats": "MAT_006×12;MAT_008×6;MAT_041×1", "desc": "练气期起步设备：将矿石和辅料精炼成金属锭（自带玄铁锭、赤铜锭基础冶炼配方）。", "start": true, "gate": false},
  {"id": "BD_138", "name": "加工台", "kind": "器", "ntype": "device", "icon": "🛠", "x": 180, "y": 210, "parent": "BD_136", "extraReq": [], "pts": "8 解析数据", "mats": "MAT_006×8;MAT_008×4;MAT_065×1", "desc": "专注机械金工：玄铁板/齿轮/梁、灵磁齿轮、电缆、剑丸、阀门、传动轴、水泵、机壳与凡阶玉简。", "start": false, "gate": false},
  {"id": "BD_137", "name": "粉碎机", "kind": "器", "ntype": "device", "icon": "⚙️", "x": 420, "y": 210, "parent": "BD_136", "extraReq": [], "pts": "8 解析数据", "mats": "MAT_006×6;MAT_008×4", "desc": "粉碎固体物料（产出玄铁粉、煤粉、赤铜粉、灵草粉、木屑，后期分离灵石矿与铅锭）。", "start": false, "gate": false},
  {"id": "BD_116", "name": "传送带", "kind": "器", "ntype": "device", "icon": "⇢", "x": 660, "y": 210, "parent": "BD_136", "extraReq": [], "pts": "8 解析数据", "mats": "MAT_006×2;MAT_008×1", "desc": "直线/弯轨/坡道基础传送带系统，搭配交叉器、合流器与分流器完成初期物流。", "start": false, "gate": false},
  {"id": "BD_135", "name": "采矿机", "kind": "器", "ntype": "device", "icon": "⛏", "x": 900, "y": 210, "parent": "BD_136", "extraReq": ["BD_138"], "pts": "8 解析数据", "mats": "MAT_006×10;MAT_008×5;MAT_065×1", "desc": "从矿脉节点持续采集玄铁矿、赤铜矿、煤炭、石英砂与灵石矿。", "start": false, "gate": false},
  {"id": "BD_139", "name": "切割机", "kind": "器", "ntype": "device", "icon": "✂️", "x": 1140, "y": 210, "parent": "BD_136", "extraReq": ["BD_137", "BD_138"], "pts": "8 解析数据", "mats": "MAT_006×8;MAT_009×2;MAT_040×1", "desc": "不占格被动带处理器（0碰撞）：精切导灵铜片、铜线、木板、木架、煞气合金片与硅片。", "start": false, "gate": false},
  {"id": "BD_153", "name": "置物桌", "kind": "器", "ntype": "device", "icon": "🪑", "x": 60, "y": 350, "parent": "BD_138", "extraReq": [], "pts": "10 解析数据", "mats": "MAT_048×4;MAT_006×2", "desc": "1×1×1m 基础置物桌，用于摆放道具与陈列奇物。", "start": false, "gate": false},
  {"id": "RCP_088", "name": "玄铁剑丸", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 220, "y": 350, "parent": "BD_138", "extraReq": ["BD_137"], "pts": "10 解析数据", "mats": "玄铁锭×1、玄铁粉×2", "desc": "输出：玄铁剑丸×5（飞剑防御塔初级弹药，也是敲开筑基期猎修产线的钥匙）", "start": false, "gate": false},
  {"id": "RCP_030", "name": "灵磁齿轮", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 400, "y": 350, "parent": "BD_137", "extraReq": ["BD_138"], "pts": "10 解析数据", "mats": "玄铁齿轮×1、玄铁粉×2", "desc": "输出：灵磁齿轮", "start": false, "gate": false},
  {"id": "BD_123", "name": "合流/分流器", "kind": "器", "ntype": "device", "icon": "🔀", "x": 640, "y": 350, "parent": "BD_116", "extraReq": [], "pts": "10 解析数据", "mats": "BD_116×2;MAT_049×1", "desc": "解锁合流器(BD_123)、分流器(BD_124)与交叉器(BD_122)。", "start": false, "gate": false},
  {"id": "BD_179", "name": "天机推演台", "kind": "器", "ntype": "device", "icon": "🔮", "x": 860, "y": 350, "parent": "BD_138", "extraReq": ["BD_139"], "pts": "10 解析数据", "mats": "MAT_006×8;MAT_010×4;MAT_014×2;MAT_099×2", "desc": "可垂直叠放的实体科研矩阵坛：必须将6大境界实体道标拉上传送带持续喂入推演解析数据。", "start": false, "gate": false},
  {"id": "RCP_056", "name": "电缆", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 1100, "y": 350, "parent": "BD_139", "extraReq": ["BD_138"], "pts": "10 解析数据", "mats": "玄铁板×1、铜线×2", "desc": "进阶电气配方 · 输出：电缆", "start": false, "gate": false},
  {"id": "MAT_074", "name": "玄铁剑丸", "kind": "物", "ntype": "material", "icon": "⚔️", "x": 220, "y": 490, "parent": "RCP_088", "extraReq": [], "pts": "12 解析数据", "mats": "无", "desc": "供飞剑防御塔发射，自动击杀练气修士并收集尸体。", "start": false, "gate": false},
  {"id": "MAT_009", "name": "灵磁齿轮", "kind": "物", "ntype": "material", "icon": "✥", "x": 400, "y": 490, "parent": "RCP_030", "extraReq": [], "pts": "12 解析数据", "mats": "无", "desc": "机器传动核心，供采矿、切割、传动带、循环水泵与组装设备使用。", "start": false, "gate": false},
  {"id": "MAT_086", "name": "煤粉/碳棒", "kind": "物", "ntype": "material", "icon": "🧂", "x": 640, "y": 490, "parent": "BD_137", "extraReq": [], "pts": "12 解析数据", "mats": "煤炭×1 / 煤粉×3+玄铁粉×1", "desc": "粉碎机分叉产出煤粉、赤铜粉与木屑，压制工业碳棒用于电极、凡阶玉简与核燃料。", "start": false, "gate": false},
  {"id": "MAT_133", "name": "凡阶玉简", "kind": "物", "ntype": "material", "icon": "📜", "x": 860, "y": 490, "parent": "BD_179", "extraReq": [], "pts": "12 解析数据 (1×凡阶玉简)", "mats": "导灵铜片×2+煤粉×1", "desc": "第一阶实体科研道标：送入天机推演台每次稳定推演 解析数据×5。", "start": false, "gate": false},
  {"id": "MAT_065", "name": "电缆", "kind": "物", "ntype": "material", "icon": "🔌", "x": 1100, "y": 490, "parent": "RCP_056", "extraReq": [], "pts": "12 解析数据", "mats": "无", "desc": "设备接线与电路板组件，接入橡胶护套可翻倍量产。", "start": false, "gate": false},

  // ==================== 阶段 II · 筑基期（清水灵植 · 丹雾增产 · 剑阵解构 · 人造灵根 · 33节点） ====================
  {"id": "GATE_2", "name": "II · 筑基期", "kind": "", "ntype": "gate", "icon": "筑基", "x": 654, "y": 640, "parent": "MAT_074", "extraReq": ["MAT_009", "BD_123", "MAT_065"], "pts": "15 解析数据 (筑基门槛)", "mats": "无", "desc": "阶段II入口 · 开启第一液清水水网、草本培育、丹雾增产喷涂、飞剑猎修、原油打印与【人造灵根】", "gate": true, "start": false},
  {"id": "BD_134", "name": "抽水机", "kind": "器", "ntype": "device", "icon": "💧", "x": 160, "y": 780, "parent": "GATE_2", "extraReq": [], "pts": "18 解析数据", "mats": "MAT_006×8;MAT_042×2;MAT_016×4", "desc": "第一液（清水）引水枢纽：抽取清水并构建基础水管网，后期抽取原油与灵泉。", "start": false, "gate": false},
  {"id": "BD_155", "name": "风力发电机", "kind": "器", "ntype": "device", "icon": "🌬", "x": 380, "y": 780, "parent": "GATE_2", "extraReq": ["BD_135"], "pts": "18 解析数据", "mats": "MAT_040×4;MAT_011×8;MAT_016×10", "desc": "清洁风能持续供电（+45MW），配合筑基期窄/宽储藏柜扩大产能缓冲。", "start": false, "gate": false},
  {"id": "BD_166", "name": "化煞焚毁井", "kind": "器", "ntype": "device", "icon": "🔥", "x": 560, "y": 780, "parent": "GATE_2", "extraReq": [], "pts": "18 解析数据", "mats": "MAT_006×8;MAT_041×1;MAT_042×2", "desc": "固液两用应急销毁安全阀：烧毁木炭灰、排毁早期血水煞水防堵，亦可主动排煞调控辐射区。", "start": false, "gate": false},
  {"id": "BD_160", "name": "飞剑防御塔", "kind": "器", "ntype": "device", "icon": "🗼", "x": 780, "y": 780, "parent": "GATE_2", "extraReq": [], "pts": "20 解析数据", "mats": "MAT_040×4;MAT_009×4;MAT_013×2;MAT_014×2", "desc": "装填剑丸即散发灵压诱饵引怪巡猎（玄铁→练气/爆裂→筑基/煞气→金丹），击杀自动收尸。", "start": false, "gate": false},
  {"id": "MAT_098", "name": "石英砂/玻璃", "kind": "物", "ntype": "material", "icon": "🪟", "x": 1100, "y": 780, "parent": "GATE_2", "extraReq": ["BD_135"], "pts": "18 解析数据", "mats": "石英砂×2 -> 玻璃", "desc": "采集石英砂烧制透明玻璃打造培养皿与灵兽舱，亦可精切硅片。", "start": false, "gate": false},
  {"id": "BD_128", "name": "水管管网", "kind": "器", "ntype": "device", "icon": "🚿", "x": 80, "y": 920, "parent": "BD_134", "extraReq": [], "pts": "20 解析数据", "mats": "MAT_042×1", "desc": "解锁直管、立面弯管与平面弯管(BD_128~130)。", "start": false, "gate": false},
  {"id": "BD_143", "name": "搅拌机", "kind": "器", "ntype": "device", "icon": "🧪", "x": 240, "y": 920, "parent": "BD_134", "extraReq": [], "pts": "20 解析数据", "mats": "MAT_042×2;MAT_008×4;MAT_014×1", "desc": "流固双相搅拌机：调配培养液/原浆/一阶凝灵散，并负责兽粮、回气散与净化剂混拌。", "start": false, "gate": false},
  {"id": "MAT_091", "name": "绝缘板", "kind": "物", "ntype": "material", "icon": "📜", "x": 400, "y": 920, "parent": "BD_134", "extraReq": ["MAT_086"], "pts": "20 解析数据", "mats": "木屑×2、清水×1", "desc": "现代绝缘基板，用于生产电路板、高压电容与炼宝台祭炼法宝。", "start": false, "gate": false},
  {"id": "BD_140", "name": "解构机", "kind": "器", "ntype": "device", "icon": "⚗️", "x": 600, "y": 920, "parent": "BD_160", "extraReq": [], "pts": "22 解析数据", "mats": "MAT_040×10;MAT_012×3;MAT_066×1;MAT_065×2", "desc": "拆解修士尸体或兽甲/废舟产出肉骸脑髓，并支持多阶逆向科研解析数据。", "start": false, "gate": false},
  {"id": "BD_145", "name": "提取器", "kind": "器", "ntype": "device", "icon": "🧬", "x": 800, "y": 920, "parent": "BD_140", "extraReq": ["BD_134"], "pts": "22 解析数据", "mats": "MAT_040×5;MAT_044×2;MAT_042×2", "desc": "提取蛋白液、原浆与灵草液，后期承担原油裂解、二阶真火剂与灵液重水提纯。", "start": false, "gate": false},
  {"id": "BD_159", "name": "营养基座", "kind": "器", "ntype": "device", "icon": "🧬", "x": 960, "y": 920, "parent": "BD_128", "extraReq": [], "pts": "20 解析数据", "mats": "MAT_042×2;MAT_043×1;MAT_063×2;MAT_006×2", "desc": "生物插件双槽营养基座，提供插槽并集中向培养皿与培养仓输液。", "start": false, "gate": false},
  {"id": "BD_141", "name": "培养皿", "kind": "器", "ntype": "device", "icon": "🌱", "x": 1140, "y": 920, "parent": "MAT_098", "extraReq": ["BD_128"], "pts": "22 解析数据", "mats": "MAT_099×2;MAT_006×2;MAT_025×1", "desc": "草本培育器：内置母种常驻槽，通清水即产成熟灵草，亦可自留繁育灵草种子。", "start": false, "gate": false},
  {"id": "BD_177", "name": "丹雾喷涂器", "kind": "器", "ntype": "device", "icon": "🌫️", "x": 80, "y": 1060, "parent": "BD_128", "extraReq": ["BD_143"], "pts": "24 解析数据 (1×筑基灵简)", "mats": "MAT_006×4;MAT_014×2;MAT_042×2", "desc": "对标戴森球喷涂机的不占格带处理器：架于传送带上喷涂三阶增产剂，下游触发额外产出或加速。", "start": false, "gate": false},
  {"id": "MAT_024", "name": "培养液", "kind": "物", "ntype": "material", "icon": "🧴", "x": 240, "y": 1060, "parent": "BD_143", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "灵草与灵木加速催熟、培养仓育胎及孵育灵兽卵的营养培养液。", "start": false, "gate": false},
  {"id": "MAT_018", "name": "血肉", "kind": "物", "ntype": "material", "icon": "🥩", "x": 420, "y": 1060, "parent": "BD_140", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "解构尸体或兽甲产出（支持打印仿生保底），提取蛋白液与高能兽粮。", "start": false, "gate": false},
  {"id": "MAT_019", "name": "脑髓", "kind": "物", "ntype": "material", "icon": "🧠", "x": 560, "y": 1060, "parent": "BD_140", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "制作生物芯片、人造经脉与直接解析研究数据。", "start": false, "gate": false},
  {"id": "MAT_021", "name": "骸骨", "kind": "物", "ntype": "material", "icon": "🦴", "x": 700, "y": 1060, "parent": "BD_140", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "解构尸体与兽甲获得，制作生物滤芯及培育人造经脉。", "start": false, "gate": false},
  {"id": "MAT_023", "name": "蛋白液", "kind": "物", "ntype": "material", "icon": "🧪", "x": 850, "y": 1060, "parent": "BD_145", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "调配培养液、原浆与回气散的生化流体。", "start": false, "gate": false},
  {"id": "MAT_029", "name": "原浆", "kind": "物", "ntype": "material", "icon": "🫗", "x": 1000, "y": 1060, "parent": "BD_145", "extraReq": [], "pts": "24 解析数据", "mats": "无", "desc": "高浓生物原浆，离心分离精元液与血膏，也可倍增血胎产出。", "start": false, "gate": false},
  {"id": "BD_142", "name": "培养仓", "kind": "器", "ntype": "device", "icon": "🧫", "x": 1160, "y": 1060, "parent": "BD_145", "extraReq": ["BD_159", "MAT_024"], "pts": "25 解析数据", "mats": "MAT_040×3;MAT_012×2;MAT_043×1;MAT_006×4;MAT_063×2", "desc": "活体培育血胎、兽卵、人造经脉、金丹胚、元婴胚与化神胚。", "start": false, "gate": false},
  {"id": "MAT_090", "name": "回气散", "kind": "物", "ntype": "material", "icon": "💊", "x": 600, "y": 1200, "parent": "MAT_023", "extraReq": ["BD_143"], "pts": "28 解析数据", "mats": "灵草粉×2+蛋白液×1", "desc": "搅拌机调配的基础药散：既可喂兽促髓，又可促育血胎并供给炼丹炉提炼气血丹。", "start": false, "gate": false},
  {"id": "BD_144", "name": "离心机", "kind": "器", "ntype": "device", "icon": "🌀", "x": 960, "y": 1200, "parent": "MAT_029", "extraReq": ["BD_145"], "pts": "28 解析数据", "mats": "MAT_040×8;MAT_012×2;MAT_013×1;MAT_042×2", "desc": "离心分离原浆/兽髓得精元液，并承担原油分馏与灵泉重水分离。", "start": false, "gate": false},
  {"id": "MAT_129", "name": "一阶凝灵散", "kind": "物", "ntype": "material", "icon": "✨", "x": 80, "y": 1340, "parent": "BD_177", "extraReq": ["MAT_090"], "pts": "30 解析数据 (2×筑基灵简)", "mats": "灵草粉×2+煤粉×1+清水", "desc": "筑基期一阶增产剂：喷涂货物赋予+12.5%额外产出或+25%提速。", "start": false, "gate": false},
  {"id": "MAT_093", "name": "原油分馏", "kind": "物", "ntype": "material", "icon": "🛢️", "x": 420, "y": 1340, "parent": "BD_144", "extraReq": ["BD_134"], "pts": "32 解析数据", "mats": "原油 -> 塑料/燃油/橡胶/润滑油", "desc": "第二液（原油石化）：抽水机抽取油田，分馏塑料、燃油、橡胶与润滑油四大支柱。", "start": false, "gate": false},
  {"id": "MAT_022", "name": "精元液", "kind": "物", "ntype": "material", "icon": "💧", "x": 960, "y": 1340, "parent": "BD_144", "extraReq": [], "pts": "30 解析数据", "mats": "无", "desc": "培育人造经脉、打印骨板、灵根与调配稳定液的核心精华。", "start": false, "gate": false},
  {"id": "BD_147", "name": "灵力引擎（下）", "kind": "器", "ntype": "device", "icon": "⚡", "x": 260, "y": 1480, "parent": "MAT_093", "extraReq": ["MAT_086"], "pts": "36 解析数据", "mats": "MAT_011×8;MAT_013×5;MAT_040×6;MAT_041×2;MAT_016×8", "desc": "双热槽母座（同载冶炼舱与炼丹炉）：烧煤150W/50热、燃油225W/75热、核燃料棒450W/150热。", "start": false, "gate": false},
  {"id": "BD_167", "name": "打印机", "kind": "器", "ntype": "device", "icon": "🖨️", "x": 660, "y": 1480, "parent": "MAT_022", "extraReq": ["MAT_093"], "pts": "36 解析数据", "mats": "MAT_040×4;MAT_014×2;MAT_099×2;MAT_016×6", "desc": "3D生物与精密电子打印机：打印药瓶、电路芯片、玉简灵简、乾坤货匣与仿生肉骨脑髓。", "start": false, "gate": false},
  {"id": "BD_146", "name": "组装机", "kind": "器", "ntype": "device", "icon": "🏭", "x": 980, "y": 1480, "parent": "BD_167", "extraReq": ["MAT_091"], "pts": "38 解析数据", "mats": "MAT_040×5;MAT_014×3;MAT_009×4;MAT_066×1;MAT_054×1", "desc": "高阶复合总装机，负责超频模块、高阶剑丸、灵舟、筑基灵简与人造灵根总装。", "start": false, "gate": false},
  {"id": "BD_202", "name": "朱漆云廊桥", "kind": "器", "ntype": "device", "icon": "🏮", "x": 80, "y": 1480, "parent": "MAT_091", "extraReq": ["BD_155"], "pts": "38 解析数据", "mats": "MAT_062×4;MAT_006×2", "desc": "仙宗美学悬空廊桥（1×4×1m），带朱漆护栏与引路灵灯。", "start": false, "gate": false},
  {"id": "BD_148", "name": "冶炼舱（上）", "kind": "器", "ntype": "device", "icon": "♨️", "x": 260, "y": 1620, "parent": "BD_147", "extraReq": [], "pts": "42 解析数据", "mats": "MAT_006×10;MAT_041×2;MAT_009×3", "desc": "架设在灵力引擎上方主吃热能（耗电15/s），冶炼精炼玄铁锭、高温合金锭、动力核心、燃料棒与人造灵石。", "start": false, "gate": false},
  {"id": "MAT_146", "name": "灵木纸鹤", "kind": "物", "ntype": "material", "icon": "🕊️", "x": 860, "y": 1620, "parent": "BD_146", "extraReq": ["BD_167"], "pts": "42 解析数据", "mats": "木板+灵石粉 / 光路芯片+木架", "desc": "短途辅料无人机，装入千机纸鹤枢空投增产剂/弹药，亦可助推御剑抛射。", "start": false, "gate": false},
  {"id": "BD_198", "name": "千机纸鹤枢", "kind": "器", "ntype": "device", "icon": "🕊️", "x": 1140, "y": 1620, "parent": "MAT_146", "extraReq": ["BD_177"], "pts": "45 解析数据", "mats": "MAT_062×4;MAT_014×2;MAT_146×2", "desc": "对标戴森球物流配送器（不占格，扣在储藏盒顶部）：向25格内喷涂器、防御塔、推演台空投辅料！", "start": false, "gate": false},
  {"id": "MAT_039", "name": "高温合金锭", "kind": "物", "ntype": "material", "icon": "🟨", "x": 260, "y": 1760, "parent": "BD_148", "extraReq": [], "pts": "48 解析数据", "mats": "无", "desc": "真火炉、丹神炉、炼宝台、渡劫台、巨构发射井与天魔炉的核心耐热合金。", "start": false, "gate": false},
  {"id": "MAT_050", "name": "人造灵根", "kind": "物", "ntype": "material", "icon": "🌿", "x": 760, "y": 1760, "parent": "BD_146", "extraReq": ["BD_148", "BD_167"], "pts": "50 解析数据", "mats": "灵根胚×1、主控核心×1、精元液×1", "desc": "第一重工业修仙境界结晶（筑基圆满），也是孕育金丹胚的活体母体。", "start": false, "gate": false},
  {"id": "MAT_134", "name": "筑基灵简", "kind": "物", "ntype": "material", "icon": "📗", "x": 1080, "y": 1760, "parent": "BD_146", "extraReq": ["BD_167", "MAT_133"], "pts": "50 解析数据 (1×筑基灵简)", "mats": "凡阶玉简×1+电路板×2+培养液", "desc": "第二阶实体科研道标：送入天机推演台每次推演 解析数据×15，并可升维合成金丹道匣。", "start": false, "gate": false},

  // ==================== 阶段 III · 金丹期（高空灵舟 · 4层叠物 · 300%大矿阵 · 高空采气 · 归墟炼废 · 纸鹤赋能三分支 · 32节点） ====================
  {"id": "GATE_3", "name": "III · 金丹期", "kind": "", "ntype": "gate", "icon": "金丹", "x": 654, "y": 1910, "parent": "MAT_050", "extraReq": ["MAT_039", "MAT_134"], "pts": "55 解析数据 (金丹门槛)", "mats": "无", "desc": "阶段III入口 · 解锁高空灵舟天轨、4层叠物集装、300%聚灵矿阵、九霄采气塔、2x真火炉、归墟化煞炉与纸鹤赋能台（修塔/收尸/补弹三分支）", "gate": true, "start": false},
  {"id": "BD_127", "name": "限速/智能物流", "kind": "器", "ntype": "device", "icon": "🎚", "x": 120, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "58 解析数据", "mats": "BD_123×1;MAT_049×2;MAT_014×1", "desc": "解锁垂直传送带(BD_121)、限速器(BD_127)、智能合流器(BD_125)与智能分流器(BD_126)。", "start": false, "gate": false},
  {"id": "BD_183", "name": "大型聚灵矿阵", "kind": "器", "ntype": "device", "icon": "⛰️", "x": 280, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "58 解析数据", "mats": "MAT_047×12;MAT_009×6;MAT_057×2;MAT_071×2", "desc": "对标戴森球大型采矿机：300%采矿速率，环形覆盖矿脉双带高速直出。", "start": false, "gate": false},
  {"id": "BD_158", "name": "流体处理中枢", "kind": "器", "ntype": "device", "icon": "🏗️", "x": 460, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "58 解析数据", "mats": "MAT_040×8;MAT_042×4;MAT_043×2;MAT_014×2;MAT_006×6", "desc": "液体高架中枢与高阶接口管网(BD_131~133)，承载搅拌机、离心机与提取器立体配管。", "start": false, "gate": false},
  {"id": "BD_164", "name": "灵木培育槽", "kind": "器", "ntype": "device", "icon": "🌲", "x": 640, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "58 解析数据", "mats": "MAT_006×10;MAT_063×4;MAT_042×4;MAT_043×1;MAT_111×1", "desc": "木本培育槽：内置树苗母种槽（不消耗），支持原木量产、留苗扩繁及灵泉催长。", "start": false, "gate": false},
  {"id": "BD_150", "name": "回收处理塔", "kind": "器", "ntype": "device", "icon": "♜", "x": 800, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "60 解析数据", "mats": "MAT_040×10;MAT_044×3;MAT_042×6;MAT_043×2;MAT_016×8", "desc": "净化血水煞水回收净化水与滤渣，同时作为控煞核心塔紧急抽煞凝晶。", "start": false, "gate": false},
  {"id": "BD_168", "name": "灵兽舱", "kind": "器", "ntype": "device", "icon": "🐾", "x": 980, "y": 2050, "parent": "GATE_3", "extraReq": ["BD_142"], "pts": "60 解析数据", "mats": "MAT_040×4;MAT_099×2;MAT_042×2;MAT_044×2;MAT_112×1", "desc": "2×2×2m灵兽自动化繁育榨取舱：产兽甲/兽髓，喂丹进阶凝结妖丹与兽魂。", "start": false, "gate": false},
  {"id": "MAT_124", "name": "光路芯片", "kind": "物", "ntype": "material", "icon": "💠", "x": 1160, "y": 2050, "parent": "GATE_3", "extraReq": [], "pts": "60 解析数据", "mats": "生物芯片×1、探矿仪×1", "desc": "中央处理器光路阵盘的基础连线芯片（2~3格步进），可注入解析数据升级为神识光芯。", "start": false, "gate": false},
  {"id": "MAT_128", "name": "乾坤货匣", "kind": "物", "ntype": "material", "icon": "📦", "x": 100, "y": 2190, "parent": "BD_127", "extraReq": [], "pts": "62 解析数据", "mats": "木板×2+塑料×1 / 玄铁架+玄铁板+润滑油", "desc": "高空灵舟装载站自动打包物料的标准包裹容器，亦可联装灵舟或封装御舟法宝胚。", "start": false, "gate": false},
  {"id": "BD_180", "name": "疾风传送带", "kind": "器", "ntype": "device", "icon": "⏩", "x": 240, "y": 2190, "parent": "BD_127", "extraReq": [], "pts": "62 解析数据", "mats": "MAT_047×2;MAT_009×1;MAT_095×1", "desc": "2.0x 二阶高速传送带，可在旧带上原地覆盖升级，喂饱高吞吐产线。", "start": false, "gate": false},
  {"id": "BD_169", "name": "灵舟天轨", "kind": "器", "ntype": "device", "icon": "🛤️", "x": 380, "y": 2190, "parent": "BD_127", "extraReq": [], "pts": "62 解析数据", "mats": "MAT_047×2;MAT_011×1;MAT_065×1", "desc": "高空架空画线航道（不占地面格），在厂房上空直接拉线供灵舟往返飞行，不阻挡任何地面设备。", "start": false, "gate": false},
  {"id": "MAT_102", "name": "灵石矿/铅板", "kind": "物", "ntype": "material", "icon": "☢️", "x": 540, "y": 2190, "parent": "BD_150", "extraReq": [], "pts": "64 解析数据", "mats": "灵石矿×2 -> 灵石粉×3 + 铅锭×1", "desc": "天然外星辐射矿脉，分离灵石粉与防辐射铅板。", "start": false, "gate": false},
  {"id": "MAT_106", "name": "灵泉/重水", "kind": "物", "ntype": "material", "icon": "⛲", "x": 700, "y": 2190, "parent": "BD_158", "extraReq": [], "pts": "64 解析数据", "mats": "灵泉 -> 灵石粉 + 重水 + 灵液", "desc": "第三液（外星辐射渗水潭），离心或高空采气提纯重水冷却液与高纯灵液。", "start": false, "gate": false},
  {"id": "BD_178", "name": "归墟化煞炉", "kind": "器", "ntype": "device", "icon": "♻️", "x": 840, "y": 2190, "parent": "BD_150", "extraReq": [], "pts": "64 解析数据", "mats": "MAT_047×8;MAT_041×2;MAT_042×4;MAT_045×1", "desc": "对标炼金悖论坩埚：把产线溢出的药渣、滤渣、木炭灰与血煞废液物理炼化为归墟晶尘。", "start": false, "gate": false},
  {"id": "MAT_114", "name": "兽甲/兽髓", "kind": "物", "ntype": "material", "icon": "🐚", "x": 980, "y": 2190, "parent": "BD_168", "extraReq": ["MAT_090"], "pts": "64 解析数据", "mats": "兽粮×2 + 回气散/清水", "desc": "一阶灵兽双产物：兽甲解构骨肉或压复合滤芯，兽髓提纯精元液并赋能炼丹。", "start": false, "gate": false},
  {"id": "MAT_075", "name": "爆裂剑丸", "kind": "物", "ntype": "material", "icon": "💣", "x": 1160, "y": 2190, "parent": "GATE_3", "extraReq": ["BD_160"], "pts": "64 解析数据", "mats": "精炼玄铁锭/燃油装填", "desc": "飞剑防御塔中阶弹药，自动猎杀筑基修士。", "start": false, "gate": false},
  {"id": "MAT_127", "name": "灵舟", "kind": "物", "ntype": "material", "icon": "🛸", "x": 100, "y": 2330, "parent": "MAT_128", "extraReq": [], "pts": "68 解析数据", "mats": "精炼玄铁锭+灵磁齿轮+燃油 / 乾坤货匣+灵能电池", "desc": "高空无人货运飞舟：投入启航站标注阵旗颜色与前缀编号(AA.BB)，自动高空装卸转运。", "start": false, "gate": false},
  {"id": "BD_181", "name": "乾坤叠物机", "kind": "器", "ntype": "device", "icon": "📚", "x": 240, "y": 2330, "parent": "BD_180", "extraReq": [], "pts": "68 解析数据", "mats": "MAT_047×4;MAT_009×2;MAT_054×1", "desc": "对标戴森球自动集装机（不占格带处理器）：将传送带货物物理叠高 4 层，单带通量瞬间 ×4！", "start": false, "gate": false},
  {"id": "BD_172", "name": "灵舟启航站", "kind": "器", "ntype": "device", "icon": "🚩", "x": 380, "y": 2330, "parent": "BD_169", "extraReq": ["MAT_127"], "pts": "68 解析数据", "mats": "MAT_040×4;MAT_011×4;MAT_014×2;MAT_127×1", "desc": "高空灵舟发车枢纽（不占地格），注入灵力放飞灵舟并配置阵旗颜色与前缀编号(如 DAN.01)。", "start": false, "gate": false},
  {"id": "BD_163", "name": "炼丹炉（上）", "kind": "器", "ntype": "device", "icon": "🏺", "x": 580, "y": 2330, "parent": "MAT_106", "extraReq": ["BD_147", "MAT_102"], "pts": "70 解析数据", "mats": "MAT_039×6;MAT_041×2;MAT_042×4;MAT_037×2", "desc": "架设在灵力引擎上方主吃热能（耗电10/s），支持药瓶流水线、血胎直炼或整尸血炼丹药。", "start": false, "gate": false},
  {"id": "BD_184", "name": "九霄采气塔", "kind": "器", "ntype": "device", "icon": "🗼", "x": 740, "y": 2330, "parent": "MAT_106", "extraReq": [], "pts": "70 解析数据", "mats": "MAT_047×8;MAT_042×4;MAT_043×2;MAT_066×2", "desc": "对标炼金热能萃取机：建造海拔 Z 越高产量越大（每升高1层+25%，至高+300%灵液重水）。", "start": false, "gate": false},
  {"id": "MAT_132", "name": "归墟晶尘", "kind": "物", "ntype": "material", "icon": "✨", "x": 900, "y": 2330, "parent": "BD_178", "extraReq": [], "pts": "70 解析数据", "mats": "药渣+滤渣+木炭灰+煞水 -> 归墟晶尘", "desc": "实体废料转化而来的通用高阶催化晶尘，彻底防止副产堵线。", "start": false, "gate": false},
  {"id": "BD_190", "name": "纸鹤赋能台（修塔/收尸/补弹三分支）", "kind": "器", "ntype": "device", "icon": "🕊️", "x": 1160, "y": 2330, "parent": "MAT_075", "extraReq": [], "pts": "70 解析数据", "mats": "MAT_047×10;MAT_054×2;MAT_066×4;MAT_075×4", "desc": "纸鹤三分支协同中枢（修塔/收尸/补弹三分支）：派遣灵木纸鹤自动修复/重建受损防御塔、战场收尸拆解，并空投补弹！", "start": false, "gate": false},
  {"id": "BD_173", "name": "灵舟装载站", "kind": "器", "ntype": "device", "icon": "📤", "x": 200, "y": 2470, "parent": "BD_172", "extraReq": [], "pts": "72 解析数据", "mats": "MAT_040×6;MAT_009×4;MAT_049×2;MAT_128×4", "desc": "高空打包站（不占地格·2个带口入），最多暂存4个乾坤货匣，灵舟掠过即自动吊装。", "start": false, "gate": false},
  {"id": "BD_201", "name": "飞檐琉璃顶", "kind": "器", "ntype": "device", "icon": "🏯", "x": 40, "y": 2470, "parent": "MAT_128", "extraReq": ["BD_202"], "pts": "72 解析数据", "mats": "MAT_062×6;MAT_099×4;MAT_010×2", "desc": "仙家飞檐琉璃顶（3×3×2m），架于顶层立柱化工厂为恢弘宫阙。", "start": false, "gate": false},
  {"id": "BD_174", "name": "灵舟卸载站", "kind": "器", "ntype": "device", "icon": "📥", "x": 380, "y": 2470, "parent": "BD_172", "extraReq": [], "pts": "72 解析数据", "mats": "MAT_040×6;MAT_009×4;MAT_054×1;MAT_128×4", "desc": "高空拆包站（不占地格·最多暂存4包·2个带口出），可设置灵舟颜色+前缀AA.BB+与/或/非规则。", "start": false, "gate": false},
  {"id": "MAT_078", "name": "煞气灵草", "kind": "物", "ntype": "material", "icon": "🌾", "x": 540, "y": 2470, "parent": "BD_163", "extraReq": ["BD_150"], "pts": "72 解析数据", "mats": "灵草种子×1、滤渣×1、净化水×1", "desc": "培养皿吸收滤渣与净化水诱变的高阶辐射灵草，破障丹与养魂丹核心草药。", "start": false, "gate": false},
  {"id": "BD_185", "name": "真火精炼炉", "kind": "器", "ntype": "device", "icon": "🔥", "x": 700, "y": 2470, "parent": "BD_163", "extraReq": [], "pts": "72 解析数据", "mats": "MAT_039×6;MAT_041×2;MAT_009×4;MAT_014×2", "desc": "2.0x Mk.II 高阶冶炼炉，支持原地覆盖精炼炉升级并双出口联炼精铁与高温合金。", "start": false, "gate": false},
  {"id": "RCP_097", "name": "气血丹炼制", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 860, "y": 2470, "parent": "BD_163", "extraReq": [], "pts": "72 解析数据", "mats": "成熟灵草×2、血肉×2、蛋白液×1", "desc": "输出：气血丹、药渣（支持药瓶流水线增产，喂养二阶灵兽）", "start": false, "gate": false},
  {"id": "MAT_116", "name": "妖丹", "kind": "物", "ntype": "material", "icon": "🔮", "x": 1020, "y": 2470, "parent": "BD_163", "extraReq": ["MAT_114"], "pts": "75 解析数据", "mats": "兽粮×2、气血丹×1、灵泉×1", "desc": "二阶灵兽饲育凝结的妖丹，替代金丹碎片凝育金丹胚，并可炼制养魂丹。", "start": false, "gate": false},
  {"id": "MAT_147", "name": "空置蓄灵匣", "kind": "物", "ntype": "material", "icon": "🔋", "x": 1180, "y": 2470, "parent": "BD_184", "extraReq": ["BD_146"], "pts": "75 解析数据", "mats": "灵能电池+高压电容+铅板", "desc": "对标戴森球空蓄电器：可于雷池蓄电枢/天劫引雷快充并在放电后100%无损退回循环。", "start": false, "gate": false},
  {"id": "BD_199", "name": "御剑抛射台", "kind": "器", "ntype": "device", "icon": "☄️", "x": 80, "y": 2610, "parent": "BD_181", "extraReq": ["MAT_146", "MAT_074"], "pts": "76 解析数据", "mats": "MAT_047×6;MAT_009×4;MAT_074×4", "desc": "对标炼金抛射大炮：将货匣绑上流光飞剑在空中划出金色抛物线跨障射至接引莲台！", "start": false, "gate": false},
  {"id": "BD_200", "name": "接引莲台", "kind": "器", "ntype": "device", "icon": "🪷", "x": 260, "y": 2610, "parent": "BD_199", "extraReq": [], "pts": "76 解析数据", "mats": "MAT_047×4;MAT_010×4;MAT_097×2", "desc": "对标炼金弹跳菇：空中无损接住剑气抛射货物并双口分流泄出或接力弹射。", "start": false, "gate": false},
  {"id": "MAT_130", "name": "二阶真火剂", "kind": "物", "ntype": "material", "icon": "🧪", "x": 540, "y": 2610, "parent": "BD_163", "extraReq": ["MAT_129"], "pts": "78 解析数据 (2×金丹道匣)", "mats": "一阶凝灵散+煞气灵草+燃油 / 药瓶+归墟晶尘", "desc": "二阶液态增产剂：赋予额外产出+20%或提速+50%，亦可炼制诛仙雷丸与器灵枢机核。", "start": false, "gate": false},
  {"id": "RCP_098", "name": "破障丹", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 760, "y": 2610, "parent": "RCP_097", "extraReq": ["MAT_078"], "pts": "78 解析数据", "mats": "煞气灵草×2、气血丹×1、液态煞气×1", "desc": "输出：破障丹、药渣（提纯凝丹液、喂养三阶灵兽与炼制金丹道匣）", "start": false, "gate": false},
  {"id": "MAT_135", "name": "金丹道匣", "kind": "物", "ntype": "material", "icon": "📔", "x": 960, "y": 2610, "parent": "RCP_098", "extraReq": ["BD_185", "MAT_134"], "pts": "80 解析数据 (1×金丹道匣)", "mats": "筑基灵简+气血丹+破障丹 / 人造金丹+乾坤货匣", "desc": "第三阶实体科研道标：送入天机推演台每次推演 解析数据×45。", "start": false, "gate": false},
  {"id": "BD_204", "name": "雷池蓄电枢", "kind": "器", "ntype": "device", "icon": "⚡", "x": 1180, "y": 2610, "parent": "MAT_147", "extraReq": ["MAT_102"], "pts": "80 解析数据", "mats": "MAT_047×8;MAT_046×4;MAT_066×4;MAT_105×4", "desc": "对标戴森球能量枢纽：快充蓄灵匣或于远端无电网矿区放电+1200W并100%退回空匣！", "start": false, "gate": false},

  // ==================== 阶段 IV · 元婴期（5x极速带 · 万象总装机 · 九转丹神炉 · 金乌聚变堆 · 九霄雷暴塔 · 30节点） ====================
  {"id": "GATE_4", "name": "IV · 元婴期", "kind": "", "ntype": "gate", "icon": "元婴", "x": 654, "y": 2760, "parent": "RCP_098", "extraReq": ["BD_173", "BD_174", "MAT_116", "MAT_124", "MAT_135"], "pts": "85 解析数据 (元婴门槛)", "mats": "无", "desc": "阶段IV入口 · 解锁天轨逻辑分流、5x缩地带、2.0x万象总装机/丹神炉、2400W聚变堆、九霄雷暴塔与【人造金丹/元婴】", "gate": true, "start": false},
  {"id": "BD_170", "name": "天轨合流器", "kind": "器", "ntype": "device", "icon": "🔀", "x": 80, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "88 解析数据", "mats": "MAT_047×4;MAT_009×2;MAT_014×1", "desc": "高空双轨合并节点（不占地格），将两条天轨航线平滑汇入主干。", "start": false, "gate": false},
  {"id": "BD_182", "name": "缩地极速带", "kind": "器", "ntype": "device", "icon": "⚡", "x": 210, "y": 2900, "parent": "GATE_4", "extraReq": ["BD_181"], "pts": "88 解析数据", "mats": "MAT_039×2;MAT_054×1;MAT_068×1", "desc": "5.0x 三阶极速传送带，配合4层乾坤叠物机单带可达 20 倍吞吐。", "start": false, "gate": false},
  {"id": "BD_165", "name": "储液罐", "kind": "器", "ntype": "device", "icon": "🛢️", "x": 340, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "88 解析数据", "mats": "MAT_006×12;MAT_042×4;MAT_012×2", "desc": "2×2×2m工业稳压储液缓冲罐（同步解锁立体顶板BD_107/高桌BD_154/B态智能件）。", "start": false, "gate": false},
  {"id": "MAT_067", "name": "煞气结晶", "kind": "物", "ntype": "material", "icon": "💎", "x": 490, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "90 解析数据", "mats": "液态煞气离心 / 回收塔紧急凝晶", "desc": "用于煞气合金、煞气剑丸与合成人造灵石。", "start": false, "gate": false},
  {"id": "MAT_082", "name": "凝丹液", "kind": "物", "ntype": "material", "icon": "🧪", "x": 650, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "90 解析数据", "mats": "破障丹/金丹尸体提纯", "desc": "提取器提纯获得的顶级培养液，用于金丹胚与化神胚培育。", "start": false, "gate": false},
  {"id": "MAT_109", "name": "燃料棒", "kind": "物", "ntype": "material", "icon": "🔋", "x": 820, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "92 解析数据", "mats": "灵石粉×4+铅板×2+重水×1", "desc": "核级高热燃料棒，供金乌聚变堆(2400W)、粒子对撞仪与破界飞升。", "start": false, "gate": false},
  {"id": "MAT_125", "name": "神识光芯", "kind": "物", "ntype": "material", "icon": "🔷", "x": 1000, "y": 2900, "parent": "GATE_4", "extraReq": [], "pts": "92 解析数据", "mats": "光路芯片+解析数据+灵液 / 中控芯片+复合滤芯", "desc": "光路阵盘高阶折射变轨芯片，亦是天轨分流与万象总装机的核心调度单元。", "start": false, "gate": false},
  {"id": "MAT_118", "name": "养魂丹", "kind": "物", "ntype": "material", "icon": "🟣", "x": 1180, "y": 2900, "parent": "GATE_4", "extraReq": ["MAT_078"], "pts": "92 解析数据", "mats": "妖丹×1、煞气灵草/药瓶、兽髓×1", "desc": "高阶神识丹药，供渡劫台凝练人造元婴与人造化神。", "start": false, "gate": false},
  {"id": "BD_171", "name": "天轨分流器", "kind": "器", "ntype": "device", "icon": "📡", "x": 80, "y": 3040, "parent": "BD_170", "extraReq": ["MAT_125"], "pts": "95 解析数据", "mats": "MAT_047×4;MAT_054×1;MAT_125×1", "desc": "高空智能分流（不占地格），支持按阵旗颜色 + 前缀AA.BB + 与/或/非(AND/OR/NOT)规则分流灵舟。", "start": false, "gate": false},
  {"id": "BD_156", "name": "炼宝台", "kind": "器", "ntype": "device", "icon": "🔮", "x": 380, "y": 3040, "parent": "MAT_067", "extraReq": [], "pts": "96 解析数据", "mats": "MAT_040×6;MAT_039×4;MAT_011×8;MAT_065×4;MAT_066×2;MAT_063×4", "desc": "祭炼法宝胚与高阶组件，稳定产出法宝成品、人造灵石、金丹道匣与极核共鸣裂变。", "start": false, "gate": false},
  {"id": "MAT_083", "name": "人造灵石", "kind": "物", "ntype": "material", "icon": "💠", "x": 580, "y": 3040, "parent": "MAT_109", "extraReq": ["MAT_067"], "pts": "96 解析数据", "mats": "灵石粉×3+碳棒×1", "desc": "冶炼或炼宝产出，渡劫凝丹、人工碎丹核及道果自循环消耗品。", "start": false, "gate": false},
  {"id": "BD_192", "name": "金乌聚变堆", "kind": "器", "ntype": "device", "icon": "☢️", "x": 760, "y": 3040, "parent": "MAT_109", "extraReq": [], "pts": "98 解析数据 (2×元婴法印)", "mats": "MAT_039×12;MAT_105×12;MAT_057×4;MAT_046×4", "desc": "2400W 聚变基座 + 300 热能直供，顶部可直接安装九转丹神炉(BD_187)！", "start": false, "gate": false},
  {"id": "MAT_084", "name": "金丹胚", "kind": "物", "ntype": "material", "icon": "🥚", "x": 920, "y": 3040, "parent": "MAT_082", "extraReq": [], "pts": "98 解析数据", "mats": "人造灵根 + 妖丹×2/金丹碎片 + 凝丹液×2", "desc": "培养仓输入人造灵根配合妖丹或金丹碎片凝育出的金丹胚。", "start": false, "gate": false},
  {"id": "BD_186", "name": "万象总装机", "kind": "器", "ntype": "device", "icon": "⚙️", "x": 1100, "y": 3040, "parent": "MAT_125", "extraReq": ["BD_146"], "pts": "98 解析数据", "mats": "MAT_039×8;MAT_054×4;MAT_040×6;MAT_042×4", "desc": "对标炼金 Omni-Machine 的 2.0x 复合总装机（3固体入+1液体入->2固体出），内置器灵槽。", "start": false, "gate": false},
  {"id": "BD_205", "name": "洞天灵药圃", "kind": "器", "ntype": "device", "icon": "🌿", "x": 1260, "y": 3040, "parent": "GATE_4", "extraReq": [], "pts": "95 解析数据", "mats": "MAT_039×6;MAT_099×6;MAT_107×4", "desc": "生物修仙线二阶世代建筑（2.5x倍速）：无需母座直连灵泉，自动继承培养皿/培养仓/灵木槽全部22条配方！", "start": false, "gate": false},
  {"id": "BD_175", "name": "灵舟转运站", "kind": "器", "ntype": "device", "icon": "🔁", "x": 80, "y": 3180, "parent": "BD_171", "extraReq": [], "pts": "100 解析数据", "mats": "MAT_040×8;MAT_039×2;MAT_054×2;MAT_128×8", "desc": "高空双轨并行中转平台（不占地格），在两条航线灵舟间直接转运乾坤货匣，最多储存8个包裹。", "start": false, "gate": false},
  {"id": "MAT_139", "name": "诛仙雷丸", "kind": "物", "ntype": "material", "icon": "⚡", "x": 240, "y": 3180, "parent": "BD_156", "extraReq": ["MAT_076", "MAT_130"], "pts": "102 解析数据", "mats": "煞气剑丸×2+高压电容+二阶真火剂", "desc": "元婴/化神天魔防线重型雷丸，装填九霄雷暴塔击落天魔爆出天魔道骨。", "start": false, "gate": false},
  {"id": "MAT_110", "name": "法宝", "kind": "物", "ntype": "material", "icon": "🏮", "x": 420, "y": 3180, "parent": "BD_156", "extraReq": [], "pts": "102 解析数据", "mats": "法宝胚+核心/灵液/稳定液", "desc": "可量产高阶法宝成品，用于元婴法印、星辰幡与渡劫双倍凝丹。", "start": false, "gate": false},
  {"id": "BD_187", "name": "九转丹神炉", "kind": "器", "ntype": "device", "icon": "🏺", "x": 680, "y": 3180, "parent": "BD_192", "extraReq": ["BD_163"], "pts": "105 解析数据", "mats": "MAT_039×8;MAT_041×3;MAT_085×1;MAT_105×4", "desc": "2.0x Mk.II 热能神炉，安装于灵力引擎或金乌聚变堆顶部，高效产出三阶造化丹与器灵枢机核。", "start": false, "gate": false},
  {"id": "BD_157", "name": "渡劫台", "kind": "器", "ntype": "device", "icon": "⚡", "x": 920, "y": 3180, "parent": "MAT_084", "extraReq": ["MAT_083", "MAT_109"], "pts": "105 解析数据", "mats": "MAT_040×8;MAT_039×6;MAT_105×8;MAT_097×6;MAT_046×4;MAT_066×3", "desc": "渡劫突破中枢：加装铅板、橡胶与高压电容抗雷，通入重水凝练人造金丹、元婴、化神与飞升道果。", "start": false, "gate": false},
  {"id": "BD_203", "name": "阵法浮空台", "kind": "器", "ntype": "device", "icon": "🛸", "x": 1200, "y": 3180, "parent": "BD_186", "extraReq": ["MAT_083", "MAT_067"], "pts": "105 解析数据", "mats": "MAT_039×4;MAT_083×2;MAT_067×2", "desc": "反重力托天浮空基座（3×3×1m），可直接在高空悬停拼成仙岛搭载采气塔。", "start": false, "gate": false},
  {"id": "BD_191", "name": "九霄雷暴塔", "kind": "器", "ntype": "device", "icon": "🌩️", "x": 240, "y": 3320, "parent": "MAT_139", "extraReq": ["BD_190"], "pts": "108 解析数据", "mats": "MAT_039×8;MAT_046×4;MAT_105×6;MAT_076×4", "desc": "装填诛仙雷丸释放神雷猎杀域外天魔，产出化神逆向重材【天魔道骨】（配合纸鹤赋能台（修塔/收尸/补弹三分支）协同守御）。", "start": false, "gate": false},
  {"id": "MAT_131", "name": "三阶造化丹", "kind": "物", "ntype": "material", "icon": "💊", "x": 640, "y": 3320, "parent": "BD_187", "extraReq": ["BD_186", "MAT_132"], "pts": "110 解析数据 (2×元婴法印)", "mats": "归墟晶尘+养魂丹/破障丹+凝丹液/真火剂", "desc": "元婴期顶级增产丹药：喷涂赋予+25%额外产出或+100%提速，亦可熔铸器灵枢机核。", "start": false, "gate": false},
  {"id": "MAT_085", "name": "人造金丹", "kind": "物", "ntype": "material", "icon": "🟡", "x": 920, "y": 3320, "parent": "BD_157", "extraReq": [], "pts": "110 解析数据", "mats": "无", "desc": "第二重工业修仙境界结晶（金丹期），既可投入光路阵盘无限超频，亦可孕育元婴胚。", "start": false, "gate": false},
  {"id": "MAT_148", "name": "满载蓄灵匣", "kind": "物", "ntype": "material", "icon": "🔋", "x": 1200, "y": 3320, "parent": "BD_204", "extraReq": ["MAT_109"], "pts": "110 解析数据", "mats": "空置蓄灵匣+燃料棒 / 天劫引雷快充", "desc": "灵舟跨区运电的核心实体电池，亦用于直驱阴阳对撞仪制备反煞晶核。", "start": false, "gate": false},
  {"id": "MAT_076", "name": "煞气剑丸", "kind": "物", "ntype": "material", "icon": "🗡", "x": 420, "y": 3460, "parent": "MAT_085", "extraReq": ["MAT_067"], "pts": "115 解析数据", "mats": "煞气合金/灵石粉/燃油", "desc": "飞剑防御塔终极弹药，自动猎杀金丹修士获取金丹修士尸体。", "start": false, "gate": false},
  {"id": "MAT_117", "name": "兽魂", "kind": "物", "ntype": "material", "icon": "👻", "x": 660, "y": 3460, "parent": "MAT_085", "extraReq": [], "pts": "118 解析数据", "mats": "妖丹×1、破障丹×1、液态煞气×1", "desc": "三阶灵兽饲育蜕变出的高阶生物神识体，用于孕育元婴胚化神胚与封魂器灵。", "start": false, "gate": false},
  {"id": "RCP_214", "name": "元婴胚(兽魂)", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 880, "y": 3460, "parent": "MAT_085", "extraReq": ["MAT_117"], "pts": "122 解析数据", "mats": "人造金丹×1、兽魂×1、灵液×2", "desc": "培养仓活体线孕育元婴胚×1（伴生煞水×1）。", "start": false, "gate": false},
  {"id": "RCP_215", "name": "元婴胚(芯片)", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 1100, "y": 3460, "parent": "MAT_085", "extraReq": ["MAT_125"], "pts": "122 解析数据", "mats": "人造金丹×1、中控芯片×2、兽髓×2", "desc": "打印机纯工业神识线打印元婴胚×1（无需三阶兽魂即可并线冲击元婴）。", "start": false, "gate": false},
  {"id": "MAT_119", "name": "元婴胚", "kind": "物", "ntype": "material", "icon": "🪆", "x": 960, "y": 3600, "parent": "RCP_214", "extraReq": ["RCP_215"], "pts": "128 解析数据", "mats": "人造金丹×1、兽魂/中控芯片、灵液/兽髓", "desc": "元婴期核心胚体，送入渡劫台凝练人造元婴。", "start": false, "gate": false},
  {"id": "RCP_216", "name": "渡劫凝练元婴", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 654, "y": 3740, "parent": "MAT_119", "extraReq": ["MAT_118", "BD_157"], "pts": "135 解析数据", "mats": "元婴胚×1、养魂丹×2、主控核心×1、重水×2", "desc": "渡劫台凝练人造元婴×1 并返还解析数据×25。", "start": false, "gate": false},
  {"id": "MAT_120", "name": "人造元婴", "kind": "物", "ntype": "material", "icon": "👶", "x": 540, "y": 3880, "parent": "RCP_216", "extraReq": [], "pts": "140 解析数据", "mats": "无", "desc": "第三重工业修仙境界结晶（元婴期），用于进一步孕育化神胚与总装元婴法印。", "start": false, "gate": false},
  {"id": "MAT_136", "name": "元婴法印", "kind": "物", "ntype": "material", "icon": "🔱", "x": 820, "y": 3880, "parent": "RCP_216", "extraReq": ["MAT_131", "MAT_135"], "pts": "140 解析数据 (1×元婴法印)", "mats": "金丹道匣+神识光芯+人造元婴/造化丹", "desc": "第四阶实体科研道标：送入天机推演台每次推演 解析数据×120。", "start": false, "gate": false},

  // ==================== 阶段 V · 化神期（4x天魔炉 · 3x仙造重组 · 粒子对撞 · 人造小仙阳 · 器灵灌注 · 星辰弹射 · 22节点） ====================
  {"id": "GATE_5", "name": "V · 化神期", "kind": "", "ntype": "gate", "icon": "化神", "x": 654, "y": 4030, "parent": "MAT_120", "extraReq": ["BD_175", "MAT_110", "BD_191", "MAT_136"], "pts": "150 解析数据 (化神门槛)", "mats": "无", "desc": "阶段V入口 · 解锁天魔道骨逆向机器(4x负熵炉/3x重组机)、1200W对撞仪、15000W小仙阳、器灵枢机核与阵旗弹射器", "gate": true, "start": false},
  {"id": "BD_151", "name": "跨区传送门", "kind": "器", "ntype": "device", "icon": "🌀", "x": 100, "y": 4170, "parent": "GATE_5", "extraReq": [], "pts": "155 解析数据", "mats": "MAT_046×2;MAT_015×2;MAT_040×10;MAT_039×4;MAT_083×4", "desc": "配对后跨区域高速传送固体物料，整合全图超大型工业基地。", "start": false, "gate": false},
  {"id": "BD_176", "name": "灵舟回收站", "kind": "器", "ntype": "device", "icon": "♻️", "x": 260, "y": 4170, "parent": "GATE_5", "extraReq": [], "pts": "155 解析数据", "mats": "MAT_040×6;MAT_039×2;MAT_057×1;MAT_127×1", "desc": "高空灵舟终点回收枢纽（不占地格），回收抵达终点的灵舟同时卸载全部货物回传产线。", "start": false, "gate": false},
  {"id": "MAT_126", "name": "阵盘极核", "kind": "物", "ntype": "material", "icon": "✴️", "x": 420, "y": 4170, "parent": "GATE_5", "extraReq": ["MAT_125"], "pts": "158 解析数据", "mats": "神识光芯×2+超频模块 / 电容封装", "desc": "中央处理器三大主盘盘心极核基座，驱动三盘 ×1.5 倍贯通共鸣与金丹无限超频。", "start": false, "gate": false},
  {"id": "MAT_140", "name": "天魔道骨", "kind": "物", "ntype": "material", "icon": "💀", "x": 600, "y": 4170, "parent": "GATE_5", "extraReq": ["BD_191"], "pts": "158 解析数据", "mats": "九霄雷暴塔 / 纸鹤赋能台（修塔/收尸/补弹三分支）产出", "desc": "域外天魔坠落骸骨：打造 4x 负熵炉、3x 仙造重组枢机与对撞反煞靶材的核心！", "start": false, "gate": false},
  {"id": "RCP_200", "name": "人工碎丹核", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 780, "y": 4170, "parent": "GATE_5", "extraReq": [], "pts": "158 解析数据", "mats": "人造灵石×4、煞气结晶×4、重水×2", "desc": "组装机工业保底合成金丹碎片×1，不依赖猎杀金丹修士即可闭环补足碎片。", "start": false, "gate": false},
  {"id": "RCP_217", "name": "化神胚(兽魂)", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 960, "y": 4170, "parent": "GATE_5", "extraReq": ["MAT_117", "MAT_082"], "pts": "162 解析数据", "mats": "人造元婴×1、兽魂×2、凝丹液×2", "desc": "培养仓活体线孕育化神胚×1（伴生煞水×2）。", "start": false, "gate": false},
  {"id": "RCP_218", "name": "化神胚(净化核)", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 1160, "y": 4170, "parent": "GATE_5", "extraReq": [], "pts": "162 解析数据", "mats": "人造元婴×1、净化核心×2、兽髓×2", "desc": "打印机纯工业线打印化神胚×1（无需三阶兽魂与凝丹液即可并线冲击化神）。", "start": false, "gate": false},
  {"id": "RCP_226", "name": "极核共鸣裂变", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 200, "y": 4310, "parent": "MAT_126", "extraReq": ["BD_156", "MAT_085"], "pts": "168 解析数据", "mats": "阵盘极核×1、人造金丹×1、灵液×2", "desc": "炼宝台以人造金丹激发极核倍增裂变（输出：阵盘极核×2 + 解析数据×30），迅速插满三大阵盘。", "start": false, "gate": false},
  {"id": "BD_188", "name": "天魔负熵炉", "kind": "器", "ntype": "device", "icon": "🔥", "x": 380, "y": 4310, "parent": "MAT_140", "extraReq": [], "pts": "168 解析数据", "mats": "MAT_039×10;MAT_140×4;MAT_058×2;MAT_046×2", "desc": "对标戴森球 4.0x 负熵熔炉：以天魔道骨逆向锻造，400% 速率秒产高温合金与煞合金！", "start": false, "gate": false},
  {"id": "BD_189", "name": "仙造重组枢机", "kind": "器", "ntype": "device", "icon": "💠", "x": 540, "y": 4310, "parent": "MAT_140", "extraReq": ["MAT_126"], "pts": "168 解析数据", "mats": "MAT_039×12;MAT_140×6;MAT_125×4;MAT_126×2", "desc": "对标戴森球 3.0x 重组式制造台：专职高效重组化神天机盘、星辰幡、破界穿云舰与玄黄珠。", "start": false, "gate": false},
  {"id": "BD_194", "name": "阴阳对撞仪", "kind": "器", "ntype": "device", "icon": "⚛️", "x": 700, "y": 4310, "parent": "MAT_140", "extraReq": ["RCP_226"], "pts": "168 解析数据", "mats": "MAT_039×16;MAT_046×8;MAT_126×2;MAT_105×8", "desc": "对标戴森球 1200W 粒子对撞机：正灵液与液态煞气高速对撞制备反煞晶核与器灵枢机核。", "start": false, "gate": false},
  {"id": "MAT_077", "name": "金丹碎片", "kind": "物", "ntype": "material", "icon": "⚛️", "x": 880, "y": 4310, "parent": "RCP_200", "extraReq": ["MAT_076"], "pts": "168 解析数据", "mats": "解构金丹尸体 / 人工碎丹核合成", "desc": "金丹高能核心碎片，用于快速凝育金丹胚与碎丹聚宝双产。", "start": false, "gate": false},
  {"id": "MAT_121", "name": "化神胚", "kind": "物", "ntype": "material", "icon": "💠", "x": 1060, "y": 4310, "parent": "RCP_217", "extraReq": ["RCP_218"], "pts": "170 解析数据", "mats": "人造元婴×1、兽魂/净化核心、凝丹液/兽髓", "desc": "化神期核心道胎，送入渡劫台凝练人造化神。", "start": false, "gate": false},
  {"id": "BD_206", "name": "万兽仙池", "kind": "器", "ntype": "device", "icon": "🐉", "x": 1240, "y": 4310, "parent": "GATE_5", "extraReq": [], "pts": "165 解析数据", "mats": "MAT_087×8;MAT_120×2;MAT_108×4", "desc": "生物修仙线三阶终极育兽设施（3.0x倍速）：自带荒古血脉池与灵液循环，自动继承灵兽舱全部5条育兽配方！", "start": false, "gate": false},
  {"id": "MAT_141", "name": "反煞晶核", "kind": "物", "ntype": "material", "icon": "💠", "x": 380, "y": 4450, "parent": "BD_194", "extraReq": [], "pts": "175 解析数据 (1×化神天机盘)", "mats": "灵液+液态煞气对撞 / 聚变析出", "desc": "反物质级高能晶核，驱动 15000W 人造小仙阳并合成星辰幡与大道玄黄珠。", "start": false, "gate": false},
  {"id": "MAT_145", "name": "器灵枢机核", "kind": "物", "ntype": "material", "icon": "🏮", "x": 580, "y": 4450, "parent": "BD_189", "extraReq": ["MAT_117", "MAT_141"], "pts": "175 解析数据", "mats": "兽魂+金丹+造化丹 / 重水对撞赋灵", "desc": "独创机器活体附魔核心：切换血炼吞煞/金丹自生火/元婴虚空抓料/化神免耗材四大神通！", "start": false, "gate": false},
  {"id": "RCP_219", "name": "渡劫凝练化神", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 860, "y": 4450, "parent": "MAT_121", "extraReq": ["MAT_039", "MAT_118"], "pts": "178 解析数据", "mats": "化神胚×1、高温合金锭×4、养魂丹×2、灵液×2", "desc": "渡劫台凝练人造化神×1 并返还解析数据×40。", "start": false, "gate": false},
  {"id": "BD_193", "name": "人造小仙阳", "kind": "器", "ntype": "device", "icon": "☀️", "x": 200, "y": 4590, "parent": "MAT_141", "extraReq": [], "pts": "182 解析数据", "mats": "MAT_039×20;MAT_126×4;MAT_140×8;MAT_141×4", "desc": "对标戴森球人造恒星：吞噬反煞晶核单台爆发 15,000W 超强电力！", "start": false, "gate": false},
  {"id": "MAT_142", "name": "周天星辰幡", "kind": "物", "ntype": "material", "icon": "🚩", "x": 420, "y": 4590, "parent": "MAT_145", "extraReq": [], "pts": "182 解析数据", "mats": "法宝+反煞晶核+器灵枢机核", "desc": "投入阵旗弹射器射入苍穹构筑周天星斗大阵。", "start": false, "gate": false},
  {"id": "BD_195", "name": "阵旗弹射器", "kind": "器", "ntype": "device", "icon": "🌠", "x": 620, "y": 4590, "parent": "MAT_142", "extraReq": [], "pts": "185 解析数据", "mats": "MAT_039×14;MAT_058×4;MAT_125×4;MAT_141×2", "desc": "对标戴森球电磁轨道弹射器：连续向天空弹射周天星辰幡织就漫天星阵！", "start": false, "gate": false},
  {"id": "MAT_122", "name": "人造化神", "kind": "物", "ntype": "material", "icon": "🌟", "x": 840, "y": 4590, "parent": "RCP_219", "extraReq": [], "pts": "185 解析数据", "mats": "无", "desc": "第四重工业修仙境界结晶（化神期），用于总装化神天机盘与轰击世界晶壁。", "start": false, "gate": false},
  {"id": "MAT_137", "name": "化神天机盘", "kind": "物", "ntype": "material", "icon": "🧭", "x": 1060, "y": 4590, "parent": "RCP_219", "extraReq": ["BD_189", "MAT_136"], "pts": "185 解析数据 (1×化神天机盘)", "mats": "元婴法印+阵盘极核+人造化神", "desc": "第五阶实体科研道标：送入天机推演台每次暴产 解析数据×300！", "start": false, "gate": false},

  // ==================== 阶段 VI · 渡劫飞升（穿云舰发射井 · 天穹仙门 · 天劫引雷发电 · 飞升道果 · 9节点） ====================
  {"id": "GATE_6", "name": "VI · 渡劫飞升", "kind": "", "ntype": "gate", "icon": "飞升", "x": 654, "y": 4740, "parent": "MAT_122", "extraReq": ["RCP_226", "BD_176", "MAT_077", "BD_195", "MAT_137", "BD_193"], "pts": "195 解析数据 (飞升门槛)", "mats": "无", "desc": "阶段VI终局入口 · 聚齐人造化神、小仙阳、星阵与天机盘，开启破界垂直发射井与仙光接引台", "gate": true, "start": false},
  {"id": "MAT_143", "name": "破界穿云舰", "kind": "物", "ntype": "material", "icon": "🚀", "x": 380, "y": 4880, "parent": "GATE_6", "extraReq": ["BD_189", "MAT_145"], "pts": "200 解析数据", "mats": "法宝+反煞晶核+器灵枢机核", "desc": "终局垂直发射运载巨舰，送入破界发射井构筑天穹【接引仙门】。", "start": false, "gate": false},
  {"id": "BD_197", "name": "仙光接引台", "kind": "器", "ntype": "device", "icon": "⚡", "x": 920, "y": 4880, "parent": "GATE_6", "extraReq": ["BD_195"], "pts": "200 解析数据", "mats": "MAT_039×16;MAT_142×2;MAT_126×4;MAT_046×6", "desc": "对标戴森球射线接收站 + 天劫引雷：从仙门接引高维道光并把天劫转化为 +5000W 电力！", "start": false, "gate": false},
  {"id": "BD_196", "name": "破界发射井", "kind": "器", "ntype": "device", "icon": "🗼", "x": 380, "y": 5020, "parent": "MAT_143", "extraReq": [], "pts": "205 解析数据", "mats": "MAT_039×24;MAT_126×4;MAT_140×8;MAT_110×4", "desc": "对标戴森球垂直发射井：点火发射破界穿云舰一节一节在天际搭起【接引仙门】！", "start": false, "gate": false},
  {"id": "MAT_144", "name": "仙界道光", "kind": "物", "ntype": "material", "icon": "🌟", "x": 920, "y": 5020, "parent": "BD_197", "extraReq": ["BD_196"], "pts": "205 解析数据", "mats": "仙光接引台/阵旗弹射器/破界发射井凝聚", "desc": "天穹仙门垂落的高维法则光子，驱动渡劫台轰开世界晶壁与终局道果自循环！", "start": false, "gate": false},
  {"id": "MAT_138", "name": "大道玄黄珠", "kind": "物", "ntype": "material", "icon": "🌞", "x": 380, "y": 5160, "parent": "BD_196", "extraReq": ["MAT_137"], "pts": "210 解析数据 (1×大道玄黄珠)", "mats": "化神天机盘+反煞晶核+三阶造化丹 / 破界发射伴生", "desc": "第六阶终局实体科研道标：天机推演台单颗爆出 1000 解析数据，亦为破界飞升主材！", "start": false, "gate": false},
  {"id": "RCP_220", "name": "破界飞升", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 654, "y": 5160, "parent": "MAT_144", "extraReq": ["MAT_138", "MAT_110"], "pts": "220 解析数据", "mats": "人造化神×1、大道玄黄珠×1、仙界道光×2、重水×4", "desc": "终极渡劫破界配方：凝聚飞升道果×1 并涌现大千法则解析数据×100！", "start": false, "gate": false},
  {"id": "MAT_123", "name": "飞升道果", "kind": "物", "ntype": "material", "icon": "🌌", "x": 654, "y": 5300, "parent": "RCP_220", "extraReq": [], "pts": "230 解析数据", "mats": "无", "desc": "终极破界信标！标志从小千世界跨越飞升至大千世界，亦可开启道果自循环无限超频。", "start": false, "gate": false},
  {"id": "RCP_221", "name": "大千道果自循环", "kind": "方", "ntype": "recipe", "icon": "📘", "x": 654, "y": 5440, "parent": "MAT_123", "extraReq": [], "pts": "250 解析数据", "mats": "飞升道果×1、仙界道光×1、人造灵石×4", "desc": "渡劫台终局无损反哺循环：道果永存并持续汲取仙界道光与大千法则，每轮产出解析数据×80。", "start": false, "gate": false}
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
    const sizeCls = String(n.icon || '').length >= 2 ? 'text-xl' : 'text-2xl';
    return `<span class="font-serif font-black ${sizeCls} tracking-wider leading-tight text-center">${n.icon}</span>`;
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
    BD_151: 'fa-circle-nodes text-purple-400',
    BD_164: 'fa-tree text-emerald-400',
    BD_165: 'fa-database text-sky-300',
    BD_166: 'fa-fire-flame-curved text-rose-400',
    BD_158: 'fa-water text-cyan-400',
    BD_159: 'fa-seedling text-lime-300',
    BD_167: 'fa-print text-cyan-300',
    BD_168: 'fa-paw text-amber-300',
    BD_169: 'fa-paper-plane text-sky-300',
    BD_170: 'fa-code-merge text-sky-300',
    BD_171: 'fa-code-branch text-fuchsia-300',
    BD_172: 'fa-flag text-cyan-300',
    BD_173: 'fa-box-open text-amber-300',
    BD_174: 'fa-dolly text-emerald-300',
    BD_175: 'fa-repeat text-purple-300',
    BD_176: 'fa-recycle text-rose-300',
    BD_177: 'fa-spray-can-sparkles text-emerald-300',
    BD_178: 'fa-dumpster-fire text-fuchsia-300',
    BD_179: 'fa-compass text-cyan-300',
    BD_180: 'fa-forward-fast text-emerald-300',
    BD_181: 'fa-layer-group text-amber-300',
    BD_182: 'fa-bolt-lightning text-cyan-300',
    BD_183: 'fa-mountain text-amber-300',
    BD_184: 'fa-tower-broadcast text-sky-300',
    BD_185: 'fa-fire text-orange-400',
    BD_186: 'fa-industry text-cyan-300',
    BD_187: 'fa-flask text-fuchsia-300',
    BD_188: 'fa-fire-flame-curved text-rose-400',
    BD_189: 'fa-microchip text-yellow-300',
    BD_190: 'fa-dove text-emerald-300',
    BD_191: 'fa-cloud-bolt text-purple-300',
    BD_192: 'fa-atom text-amber-400',
    BD_193: 'fa-sun text-yellow-300',
    BD_194: 'fa-circle-radiation text-fuchsia-400',
    BD_195: 'fa-satellite-dish text-cyan-300',
    BD_196: 'fa-rocket text-amber-300',
    BD_197: 'fa-bolt text-yellow-200',
    BD_198: 'fa-feather-pointed text-emerald-300',
    BD_199: 'fa-meteor text-amber-300',
    BD_200: 'fa-spa text-yellow-300',
    BD_201: 'fa-vihara text-emerald-300',
    BD_202: 'fa-archway text-rose-300',
    BD_203: 'fa-cube text-cyan-300',
    BD_204: 'fa-car-battery text-amber-300',
    BD_205: 'fa-leaf text-emerald-300',
    BD_206: 'fa-dragon text-fuchsia-300'
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

  const world = document.getElementById('techTreeWorld');
  const maxY = Math.max(...TECH_TREE_NODES.map(n => n.y)) + 220;
  if (world) world.style.height = `${maxY}px`;
  svg.style.height = `${maxY}px`;
  svg.setAttribute('viewBox', `0 0 1380 ${maxY}`);

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
      <div>科研消耗：<b class="text-fuchsia-300">${n.pts || '-'}</b></div>
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
        <div class="flex justify-between gap-2"><span class="text-slate-400 shrink-0">科研消耗:</span><span class="text-fuchsia-300 font-mono font-bold text-right">${n.pts || '-'}</span></div>
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
  const ptsNum = parseInt(String(n.pts || '0'), 10) || 0;
  let costNote = '';
  if (ptsNum > 0 && typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
    const dataKey = findItemKeyByMatId('MAT_020');
    // 若背包内持有实体科研道标且解析数据不足，自动于天机推演台折算并优先消耗实体道标
    const beaconOrder = [
      ['MAT_138', 1000, '大道玄黄珠'],
      ['MAT_137', 300, '化神天机盘'],
      ['MAT_136', 120, '元婴法印'],
      ['MAT_135', 45, '金丹道匣'],
      ['MAT_134', 15, '筑基灵简'],
      ['MAT_133', 5, '凡阶玉简'],
    ];
    let beaconDeduced = '';
    if (dataKey && (playerInventory[dataKey] || 0) < ptsNum && typeof window.ProliferatorSystem !== 'undefined') {
      for (const [bMatId, _, bLabel] of beaconOrder) {
        const bk = findItemKeyByMatId(bMatId);
        if (bk && (playerInventory[bk] || 0) >= 1) {
          const res = window.ProliferatorSystem.deduceResearchBeacon(bMatId);
          if (res && res.ok) {
            beaconDeduced = ` + 推演1×${bLabel}`;
            if ((playerInventory[dataKey] || 0) >= ptsNum) break;
          }
        }
      }
    }
    if (dataKey && (playerInventory[dataKey] || 0) >= ptsNum) {
      playerInventory[dataKey] -= ptsNum;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
      costNote = `（消耗 ${ptsNum} 解析数据${beaconDeduced}）`;
    } else if (dataKey) {
      costNote = `（沙盒免耗演示 · 正式需 ${ptsNum} 解析数据）`;
    }
  }
  techUnlockedSet.add(id);
  if (typeof playUiSound === 'function') playUiSound('build_place');
  if (typeof showNotification === 'function') showNotification(`【配方树解锁】已解锁 ${getTechTypeLabel(n)}：【${n.name}】${costNote}`);
  syncHudStageFromTechTree();
  selectTechNode(id);
}

const STAGE_BADGE_MAP = [
  ['GATE_6', '渡劫飞升 · 大千世界'],
  ['GATE_5', '化神期 · 万法归宗'],
  ['GATE_4', '元婴期 · 神识兽魂'],
  ['GATE_3', '金丹期 · 灵泉丹火'],
  ['GATE_2', '筑基期 · 人造灵根'],
];

function syncHudStageFromTechTree() {
  const stageBadge = document.getElementById('hudCurrentStageBadge');
  const objTitle = document.getElementById('hudObjectiveTitle');
  const found = STAGE_BADGE_MAP.find(([gid]) => techUnlockedSet.has(gid));
  const stage = found ? found[1] : '练气期 · 凡铁灵植';
  if (stageBadge) stageBadge.innerText = stage;
  if (objTitle) objTitle.innerText = `配方解锁树 (${techUnlockedSet.size}/${TECH_TREE_NODES.length})`;
}

function unlockAllTechNodesForTest() {
  TECH_TREE_NODES.forEach(n => techUnlockedSet.add(n.id));
  if (typeof FourTrackProgression !== 'undefined' && typeof FourTrackProgression.unlockAllForTest === 'function') {
    FourTrackProgression.unlockAllForTest();
  }
  if (typeof playUiSound === 'function') playUiSound('toggle');
  if (typeof showNotification === 'function') showNotification('【测试模式】已一键解锁全部四轨成长与配方树节点！');
  syncHudStageFromTechTree();
  selectTechNode(techSelectedId || 'BD_136');
}

function resetTechTree() {
  techUnlockedSet.clear();
  TECH_TREE_NODES.filter(n => n.start).forEach(n => techUnlockedSet.add(n.id));
  if (typeof FourTrackProgression !== 'undefined' && typeof FourTrackProgression.reset === 'function') {
    FourTrackProgression.reset();
  }
  if (typeof playUiSound === 'function') playUiSound('click');
  syncHudStageFromTechTree();
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

// ==================== 四轨并行成长线（境界主线 × 法身神通 × 枢机防务 × 飞升无限） ====================
(function initFourTrackProgression() {
  let activeTrack = 'A';
  const levels = {
    B1: 0, B2: 0, B3: 0, B4: 0, B5: 0, B6: 0,
    C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0,
    D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0
  };

  const TRACK_DEFS = {
    B: {
      title: '轨 B · 法身神通成长线（共 6 项 × 6 级 = 36 级）',
      subtitle: '独立于工厂机器，直接强化修士肉身、储物容量、御剑建造无人机、移动身法与个人反应堆。',
      accent: 'emerald',
      items: [
        { id: 'B1', name: '乾坤储物戒扩容', icon: '🎒', maxLevel: 6, bonusPerLv: '+12格随身容量/级', baseData: 15, stepData: 10, matId: 'MAT_091', matName: '绝缘板', baseMat: 1 },
        { id: 'B2', name: '御剑建造傀儡', icon: '🗡️', maxLevel: 6, bonusPerLv: '+2建造飞剑 / +20%铺建速度', baseData: 15, stepData: 12, matId: 'MAT_074', matName: '玄铁剑丸', baseMat: 2 },
        { id: 'B3', name: '缩地御风身法', icon: '💨', maxLevel: 6, bonusPerLv: '+15%移速与御空速度/级', baseData: 18, stepData: 12, matId: 'MAT_090', matName: '回气散', baseMat: 1 },
        { id: 'B4', name: '神识天眼扫描', icon: '👁️', maxLevel: 6, bonusPerLv: '+20%探矿与蓝图视野/级', baseData: 18, stepData: 12, matId: 'MAT_015', matName: '生物芯片', baseMat: 1 },
        { id: 'B5', name: '金刚护体抗煞', icon: '🛡️', maxLevel: 6, bonusPerLv: '+5%法身抗煞耐受上限/级', baseData: 20, stepData: 15, matId: 'MAT_080', matName: '气血丹', baseMat: 1 },
        { id: 'B6', name: '丹田元磁反应堆', icon: '⚛️', maxLevel: 6, bonusPerLv: '+25W法身自供电核心/级', baseData: 25, stepData: 15, matId: 'MAT_066', matName: '灵能电池', baseMat: 1 }
      ]
    },
    C: {
      title: '轨 C · 万象枢机与诛仙防务（共 6 项 × 5 级 = 30 级）',
      subtitle: '纯正工业修仙专精：强化传送集装、高空灵舟仓容、炉鼎催化、荒古灵兽血脉、诛仙剑阵火控与化煞稳压；支持投入虚空祭炼炉将溢出成品逆向分解。',
      accent: 'amber',
      items: [
        { id: 'C1', name: '须弥灵脉集装', icon: '📦', maxLevel: 5, bonusPerLv: '+20%传送带集装堆叠与管网通量/级', baseData: 12, stepData: 10, matId: 'MAT_009', matName: '灵磁齿轮', baseMat: 2 },
        { id: 'C2', name: '巡天灵舟机括', icon: '🛸', maxLevel: 5, bonusPerLv: '灵舟装卸+1匣 / 转运+2匣 / 航速+20%', baseData: 15, stepData: 10, matId: 'MAT_128', matName: '乾坤货匣', baseMat: 2 },
        { id: 'C3', name: '丹器炉鼎催化', icon: '🏺', maxLevel: 5, bonusPerLv: '+15%炼丹炉与炼宝台成丹/祭炼产出率/级', baseData: 20, stepData: 12, matId: 'MAT_080', matName: '气血丹', baseMat: 2 },
        { id: 'C4', name: '荒古灵兽血脉', icon: '🐾', maxLevel: 5, bonusPerLv: '+20%灵兽舱甲髓/妖丹/兽魂榨取效率/级', baseData: 20, stepData: 12, matId: 'MAT_114', matName: '兽甲', baseMat: 2 },
        { id: 'C5', name: '诛仙剑阵火控', icon: '⚔️', maxLevel: 5, bonusPerLv: '+25%飞剑防御塔射速与高阶尸骸爆率/级', baseData: 18, stepData: 10, matId: 'MAT_074', matName: '玄铁剑丸', baseMat: 5 },
        { id: 'C6', name: '化煞聚灵法阵', icon: '☢️', maxLevel: 5, bonusPerLv: '+10%黄金煞潮增益 & -10%极危煞蚀/级', baseData: 25, stepData: 15, matId: 'MAT_067', matName: '煞气结晶', baseMat: 2 }
      ]
    },
    D: {
      title: '轨 D · 飞升无限天道科研库（6 项 × ∞ 无限级）',
      subtitle: '专职吸收后期人造金丹、元婴、化神、飞升道果与海量解析数据，提供无限突破产能上限。',
      accent: 'fuchsia',
      items: [
        { id: 'D1', name: '灵脉零损采掘', icon: '⛏️', maxLevel: Infinity, bonusPerLv: '-6%采矿损耗(指数级护矿)', baseData: 50, stepData: 25, matId: 'MAT_085', matName: '人造金丹', baseMat: 1 },
        { id: 'D2', name: '周天星轨加速', icon: '🌌', maxLevel: Infinity, bonusPerLv: '+10%全厂机器生产速率/级', baseData: 60, stepData: 30, matId: 'MAT_085', matName: '人造金丹', baseMat: 1 },
        { id: 'D3', name: '灵舟天轨扩容', icon: '🛸', maxLevel: Infinity, bonusPerLv: '+20%灵舟货匣与航速/级', baseData: 55, stepData: 25, matId: 'MAT_127', matName: '灵舟', baseMat: 1 },
        { id: 'D4', name: '诛仙剑阵威能', icon: '⚡', maxLevel: Infinity, bonusPerLv: '+25%飞剑防御杀伤/级', baseData: 65, stepData: 30, matId: 'MAT_076', matName: '煞气剑丸', baseMat: 5 },
        { id: 'D5', name: '光路神识超频', icon: '🧠', maxLevel: Infinity, bonusPerLv: '+10%阵盘算力增益上限/级', baseData: 80, stepData: 40, matId: 'MAT_120', matName: '人造元婴', baseMat: 1 },
        { id: 'D6', name: '大千道果反哺', icon: '🌀', maxLevel: Infinity, bonusPerLv: '+30%终局道果科研收益/级', baseData: 100, stepData: 50, matId: 'MAT_123', matName: '飞升道果', baseMat: 1 }
      ]
    }
  };

  function findItemDef(itemId) {
    for (const [trackKey, def] of Object.entries(TRACK_DEFS)) {
      const found = def.items.find(it => it.id === itemId);
      if (found) return { trackKey, item: found };
    }
    return null;
  }

  function getUpgradeCost(item, curLv) {
    const dataNeed = item.baseData + curLv * item.stepData;
    const matNeed = item.maxLevel === Infinity ? item.baseMat : item.baseMat * (curLv + 1);
    return { dataNeed, matNeed };
  }

  function getInfiniteSpeedMultiplier() {
    return Number((1 + (levels.D2 || 0) * 0.10).toFixed(2));
  }

  function getVoidSacrificeMultiplier() {
    return Number((1 + ((levels.C1 || 0) + (levels.C2 || 0) + (levels.C3 || 0) + (levels.C4 || 0) + (levels.C5 || 0) + (levels.C6 || 0)) * 0.20).toFixed(2));
  }

  function syncSpiritShipCapacity() {
    if (typeof window.SpiritShipSystem !== 'undefined' && window.SpiritShipSystem.state) {
      const c2 = levels.C2 || 0;
      window.SpiritShipSystem.state.loaderCapacity = 4 + c2;
      window.SpiritShipSystem.state.unloaderCapacity = 4 + c2;
      window.SpiritShipSystem.state.transferCapacity = 8 + c2 * 2;
    }
  }

  function upgradeTrackItem(itemId) {
    const info = findItemDef(itemId);
    if (!info) return false;
    const { item } = info;
    const curLv = levels[itemId] || 0;
    if (curLv >= item.maxLevel) {
      if (typeof showNotification === 'function') showNotification(`【已满级】${item.name} 已达上限 (${item.maxLevel} 级)`);
      return false;
    }
    const { dataNeed, matNeed } = getUpgradeCost(item, curLv);
    if (typeof playerInventory !== 'undefined' && !window.isCreativeMode) {
      const dataKey = findItemKeyByMatId('MAT_020');
      const matKey = findItemKeyByMatId(item.matId);
      const dataHave = dataKey ? (playerInventory[dataKey] || 0) : 0;
      const matHave = matKey ? (playerInventory[matKey] || 0) : 0;
      if (!dataKey || dataHave < dataNeed || !matKey || matHave < matNeed) {
        if (typeof playUiSound === 'function') playUiSound('error');
        if (typeof showNotification === 'function') showNotification(`【升级失败】${item.name} Lv.${curLv + 1} 需要：解析数据×${dataNeed} + ${item.matName}×${matNeed}`);
        return false;
      }
      playerInventory[dataKey] -= dataNeed;
      playerInventory[matKey] -= matNeed;
      if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    }
    levels[itemId] = curLv + 1;
    if (itemId === 'C2') {
      syncSpiritShipCapacity();
    }
    if (typeof playUiSound === 'function') playUiSound('build_place');
    if (typeof showNotification === 'function') {
      showNotification(`✨【四轨成长】${item.name} 升至 Lv.${levels[itemId]}（${item.bonusPerLv}）`);
    }
    renderFourTracksPane();
    if (itemId === 'D2' && typeof renderMachineProdView === 'function' && typeof currentOpenedMachine !== 'undefined' && currentOpenedMachine) {
      renderMachineProdView();
    }
    return true;
  }

  function sacrificeSurplusToVoid(matId, count, baseDataOut, baseStoneOut, label) {
    if (typeof playerInventory === 'undefined') return false;
    const srcKey = findItemKeyByMatId(matId);
    const dataKey = findItemKeyByMatId('MAT_020');
    const stoneKey = findItemKeyByMatId('MAT_083');
    if (!srcKey || (playerInventory[srcKey] || 0) < count) {
      if (typeof showNotification === 'function') showNotification(`【虚空祭炼料不足】需要 ${label}×${count}`);
      return false;
    }
    const mult = getVoidSacrificeMultiplier();
    const dataGain = Math.round(baseDataOut * mult);
    const stoneGain = Math.round(baseStoneOut * mult);
    playerInventory[srcKey] -= count;
    if (dataKey) playerInventory[dataKey] = (playerInventory[dataKey] || 0) + dataGain;
    if (stoneKey) playerInventory[stoneKey] = (playerInventory[stoneKey] || 0) + stoneGain;
    if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();
    if (typeof playUiSound === 'function') playUiSound('toggle');
    if (typeof showNotification === 'function') {
      showNotification(`🔥【虚空祭炼分解 (${mult.toFixed(2)}×)】献祭 ${label}×${count} → 提炼 解析数据×${dataGain} + 人造灵石×${stoneGain}`);
    }
    renderFourTracksPane();
    return true;
  }

  function renderFourTracksPane() {
    const pane = document.getElementById('techFourTracksPane');
    if (!pane || activeTrack === 'A') return;
    const def = TRACK_DEFS[activeTrack];
    if (!def) return;

    const getStock = (matId) => {
      if (typeof playerInventory === 'undefined') return 0;
      const k = findItemKeyByMatId(matId);
      return k ? (playerInventory[k] || 0) : 0;
    };

    const summaryBar = activeTrack === 'B'
      ? `背包 +${levels.B1 * 12} 格 · 傀儡 +${levels.B2 * 2} 架 · 移速 +${levels.B3 * 15}% · 扫描 +${levels.B4 * 20}% · 抗煞 +${levels.B5 * 5}% · 法身供电 +${levels.B6 * 25}W`
      : activeTrack === 'C'
      ? `带管通量 +${levels.C1 * 20}% · 灵舟仓容 装卸${4 + levels.C2}/转运${8 + levels.C2 * 2}匣 · 丹器催化 +${levels.C3 * 15}% · 灵兽 +${levels.C4 * 20}% · 剑阵 +${levels.C5 * 25}% · 虚空祭炼 ×${getVoidSacrificeMultiplier().toFixed(2)}`
      : `周天星轨全厂加速：×${getInfiniteSpeedMultiplier().toFixed(2)} · 护矿等级 Lv.${levels.D1} · 灵舟扩容 +${levels.D3 * 20}% · 剑阵 +${levels.D4 * 25}%`;

    const voidFurnaceHtml = activeTrack === 'C' ? `
      <div class="mt-5 p-4 rounded-xl bg-amber-950/25 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-sm font-black text-amber-200">🔥 虚空祭炼炉 · 溢出产能逆向献祭通道（推演倍率 ×${getVoidSacrificeMultiplier().toFixed(2)}）</div>
          <div class="text-xs text-slate-300 mt-0.5">将过剩的工业剑丸、丹药与法宝投入界壁炉心逆向崩解，稳定反哺解析数据与人造灵石。</div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="sacrificeSurplusToVoid('MAT_074', 20, 15, 2, '玄铁剑丸');" class="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/60 text-amber-200 text-xs font-bold cursor-pointer">⚔️ 献祭 20 玄铁剑丸</button>
          <button onclick="sacrificeSurplusToVoid('MAT_080', 5, 25, 4, '气血丹');" class="px-3 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/60 text-emerald-200 text-xs font-bold cursor-pointer">💊 献祭 5 气血丹</button>
          <button onclick="sacrificeSurplusToVoid('MAT_110', 1, 45, 8, '法宝');" class="px-3 py-1.5 rounded bg-fuchsia-500/20 hover:bg-fuchsia-500/35 border border-fuchsia-400/60 text-fuchsia-200 text-xs font-bold cursor-pointer">🏮 献祭 1 法宝</button>
        </div>
      </div>
    ` : '';

    pane.innerHTML = `
      <div class="max-w-[1200px] mx-auto space-y-5">
        <div class="p-4 rounded-xl bg-[#0b1524] border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="text-base font-black text-amber-200">${def.title}</h3>
            <p class="text-xs text-slate-300 mt-1">${def.subtitle}</p>
          </div>
          <div class="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-cyan-200">
            库存解析数据: <b class="text-amber-300">${getStock('MAT_020')}</b>
          </div>
        </div>
        <div class="px-4 py-2 rounded-lg bg-cyan-950/35 border border-cyan-500/25 text-xs font-mono text-cyan-200">${summaryBar}</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${def.items.map(it => {
            const lv = levels[it.id] || 0;
            const maxed = lv >= it.maxLevel;
            const { dataNeed, matNeed } = getUpgradeCost(it, lv);
            const maxLabel = it.maxLevel === Infinity ? '∞' : it.maxLevel;
            return `
              <div class="p-4 rounded-xl bg-[#0d1726] border border-white/15 hover:border-cyan-400/50 transition flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-mono text-cyan-300">${it.id}</span>
                    <span class="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono font-bold text-amber-300">Lv.${lv} / ${maxLabel}</span>
                  </div>
                  <div class="flex items-center space-x-2.5 mb-2">
                    <span class="text-2xl">${it.icon}</span>
                    <div class="text-sm font-black text-white">${it.name}</div>
                  </div>
                  <div class="text-xs text-emerald-300 font-bold mb-2">${it.bonusPerLv}</div>
                  <div class="text-[11px] text-slate-300 font-mono">
                    ${maxed ? '<span class="text-cyan-300">已修炼至当前巅峰圆满</span>' : `下一级消耗：解析数据×${dataNeed} + ${it.matName}×${matNeed} (余:${getStock(it.matId)})`}
                  </div>
                </div>
                <button onclick="upgradeTrackItem('${it.id}');" ${maxed ? 'disabled' : ''} class="w-full py-2 rounded-lg text-xs font-black transition cursor-pointer ${maxed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950'}">
                  ${maxed ? '✅ 已满级' : `⚡ 修炼升级至 Lv.${lv + 1}`}
                </button>
              </div>
            `;
          }).join('')}
        </div>
        ${voidFurnaceHtml}
      </div>
    `;
  }

  function switchTechTrack(trackId) {
    if (!['A', 'B', 'C', 'D'].includes(trackId)) return;
    activeTrack = trackId;
    const mainA = document.getElementById('techTrackMainA');
    const fourPane = document.getElementById('techFourTracksPane');
    ['A', 'B', 'C', 'D'].forEach(t => {
      const tab = document.getElementById(`techTrackTab_${t}`);
      if (!tab) return;
      if (t === activeTrack) {
        tab.className = 'px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 cursor-pointer transition';
      } else {
        tab.className = 'px-2 py-0.5 rounded text-[11px] font-bold bg-white/5 text-slate-300 border border-transparent hover:bg-white/10 cursor-pointer transition';
      }
    });
    if (activeTrack === 'A') {
      if (mainA) mainA.classList.remove('hidden');
      if (fourPane) fourPane.classList.add('hidden');
      renderTechTree();
    } else {
      if (mainA) mainA.classList.add('hidden');
      if (fourPane) fourPane.classList.remove('hidden');
      renderFourTracksPane();
    }
  }

  function unlockAllForTest() {
    Object.values(TRACK_DEFS).forEach(def => {
      def.items.forEach(it => {
        levels[it.id] = it.maxLevel === Infinity ? Math.max(levels[it.id], 3) : it.maxLevel;
      });
    });
    syncSpiritShipCapacity();
    if (activeTrack !== 'A') renderFourTracksPane();
  }

  function reset() {
    Object.keys(levels).forEach(k => { levels[k] = 0; });
    syncSpiritShipCapacity();
    if (activeTrack !== 'A') renderFourTracksPane();
  }

  window.FourTrackProgression = {
    TRACK_DEFS,
    levels,
    get activeTrack() { return activeTrack; },
    switchTechTrack,
    upgradeTrackItem,
    sacrificeSurplusToVoid,
    fulfillTradeContract: sacrificeSurplusToVoid,
    getInfiniteSpeedMultiplier,
    getVoidSacrificeMultiplier,
    getTradeYieldMultiplier: getVoidSacrificeMultiplier,
    renderFourTracksPane,
    unlockAllForTest,
    reset
  };
  window.switchTechTrack = switchTechTrack;
  window.upgradeTrackItem = upgradeTrackItem;
  window.sacrificeSurplusToVoid = sacrificeSurplusToVoid;
  window.fulfillTradeContract = sacrificeSurplusToVoid;
})();
