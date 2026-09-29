// =========================================================================
// js/jinshen_system.js - 《修仙工厂》金身系统 (MAM 分子分析机科技树演化)
// 1:1 还原 Satisfactory MAM 规格：多层深度拓扑节点、悬浮不遮挡详情卡片、闭环解锁
// =========================================================================

const JINSHEN_TREE_DATA = {
  gengjin: {
    id: 'gengjin',
    name: '庚金秘矿',
    status: '进行中',
    icon: 'fa-solid fa-gem text-amber-400',
    desc: '淬炼天地极致锋锐之庚金，用于金身塑骨、须弥储物扩容与天罡飞剑锻造。',
    nodes: [
      // Row 1: 根节点
      {
        id: 'node_gengjin_1',
        name: '庚金矿脉勘探',
        level: 1, pos: { row: 1, col: 2 },
        icon: 'fa-solid fa-mountain text-amber-300',
        unlocked: true, researched: true,
        rewardText: '可扫描资源: 庚金矿石',
        rewardIcon: 'fa-solid fa-gem text-amber-400',
        cost: [{ name: '玄铁矿', code: 'iron_ore', need: 20, stock: 100 }],
        desc: '天眼感知地脉金气，寻龙罗盘与神识新增庚金矿脉扫描频谱。',
        effects: ['unlock_scanner_gengjin']
      },
      // Row 2: 初级熔炼
      {
        id: 'node_gengjin_2',
        name: '庚金锭精炼',
        level: 2, pos: { row: 2, col: 2 },
        parentId: 'node_gengjin_1',
        icon: 'fa-solid fa-fire-burner text-orange-400',
        unlocked: true, researched: true,
        rewardText: '解锁【精炼炉】庚金锭冶炼配方',
        rewardIcon: 'fa-solid fa-bars text-amber-400',
        cost: [
          { name: '玄铁锭', code: 'iron_ingot', need: 40, stock: 100 },
          { name: '赤铜锭', code: 'copper_ingot', need: 25, stock: 80 }
        ],
        desc: '以极高温融解原矿杂质，出产高纯度工业庚金金属锭。',
        effects: ['recipe_gengjin_ingot']
      },
      // Row 3: 金身淬皮 (中枢分叉点)
      {
        id: 'node_gengjin_3',
        name: '金身庚金淬皮',
        level: 3, pos: { row: 3, col: 2 },
        parentId: 'node_gengjin_2',
        icon: 'fa-solid fa-shield-halved text-amber-400',
        unlocked: true, researched: true,
        rewardText: '金身防御罡气 +15%，护甲值上限提升',
        rewardIcon: 'fa-solid fa-shield text-amber-300',
        cost: [
          { name: '玄铁板', code: 'iron_plate', need: 50, stock: 120 },
          { name: '赤铜锭', code: 'copper_ingot', need: 30, stock: 80 }
        ],
        desc: '引熔融庚金注入皮下经脉，肉身化作金刚不坏之体。',
        effects: ['buff_defense_15']
      },

      // Row 4: 产生左、中、右三路分支！
      // 4-左: 机动系
      {
        id: 'node_gengjin_4_left',
        name: '庚金外骨骼',
        level: 4, pos: { row: 4, col: 1 },
        parentId: 'node_gengjin_3',
        icon: 'fa-solid fa-person-running text-cyan-400',
        unlocked: true, researched: false,
        rewardText: '移动速度 +35%，翻越障碍能力提升',
        rewardIcon: 'fa-solid fa-bolt-lightning text-cyan-300',
        cost: [
          { name: '导灵铜片', code: 'ling_copper_sheet', need: 20, stock: 20 },
          { name: '玄铁齿轮', code: 'iron_gear', need: 30, stock: 45 }
        ],
        desc: '庚金传动齿轮与灵磁伺服支架加固双腿，奔袭如电。',
        effects: ['buff_speed_35']
      },
      // 4-中: 须弥储物系
      {
        id: 'node_gengjin_4_mid',
        name: '须弥开窍·初阶',
        level: 4, pos: { row: 4, col: 2 },
        parentId: 'node_gengjin_3',
        icon: 'fa-solid fa-box-archive text-amber-300',
        unlocked: true, researched: false,
        rewardText: '随身物品栏容量 +6 格 (永久扩充)',
        rewardIcon: 'fa-solid fa-boxes-stacked text-amber-400',
        cost: [
          { name: '玄铁板', code: 'iron_plate', need: 60, stock: 120 },
          { name: '基础控制模块', code: 'basic_control_module', need: 10, stock: 15 }
        ],
        desc: '于金身窍穴内开辟微型须弥空间，背包栏位永久扩充。',
        effects: ['bag_expand_6']
      },
      // 4-右: 飞剑武装系
      {
        id: 'node_gengjin_4_right',
        name: '天罡飞剑淬芒',
        level: 4, pos: { row: 4, col: 3 },
        parentId: 'node_gengjin_3',
        icon: 'fa-solid fa-khanda text-yellow-400',
        unlocked: false, researched: false,
        rewardText: '天罡剑匣飞剑破甲威能 +50%',
        rewardIcon: 'fa-solid fa-burst text-rose-400',
        cost: [
          { name: '灵磁齿轮', code: 'ling_magnetic_gear', need: 15, stock: 5 },
          { name: '导电线圈', code: 'electric_coil', need: 40, stock: 60 }
        ],
        desc: '庚金电镀于藏剑飞剑刃口，出鞘斩击自带撕裂剑气。',
        effects: ['sword_damage_50']
      },

      // Row 5: 三路深入！
      // 5-左: 疾风神行
      {
        id: 'node_gengjin_5_left',
        name: '疾风神行靴',
        level: 5, pos: { row: 5, col: 1 },
        parentId: 'node_gengjin_4_left',
        icon: 'fa-solid fa-shoe-prints text-cyan-300',
        unlocked: false, researched: false,
        rewardText: '跳跃高度 +60%，跌落摔伤降低 80%',
        rewardIcon: 'fa-solid fa-angles-up text-cyan-400',
        cost: [
          { name: '导灵铜片', code: 'ling_copper_sheet', need: 30, stock: 20 },
          { name: '电子生物芯片', code: 'bio_chip', need: 8, stock: 5 }
        ],
        desc: '气压缓冲与浮空符文阵靴，高空跌落如履平地。',
        effects: ['buff_jump_fall']
      },
      // 5-中: 须弥二重
      {
        id: 'node_gengjin_5_mid',
        name: '须弥开窍·进阶',
        level: 5, pos: { row: 5, col: 2 },
        parentId: 'node_gengjin_4_mid',
        icon: 'fa-solid fa-dungeon text-amber-400',
        unlocked: false, researched: false,
        rewardText: '随身物品栏容量再次 +6 格 (累计+12格)',
        rewardIcon: 'fa-solid fa-cubes-stacked text-amber-300',
        cost: [
          { name: '玄铁梁', code: 'iron_beam', need: 30, stock: 35 },
          { name: '基础控制模块', code: 'basic_control_module', need: 20, stock: 15 }
        ],
        desc: '稳固识海空间折叠结构，继续开辟纳物空间。',
        effects: ['bag_expand_12']
      },
      // 5-右: 剑匣扩容
      {
        id: 'node_gengjin_5_right',
        name: '八荒剑匣扩容',
        level: 5, pos: { row: 5, col: 3 },
        parentId: 'node_gengjin_4_right',
        icon: 'fa-solid fa-box-open text-orange-400',
        unlocked: false, researched: false,
        rewardText: '剑匣可容纳飞剑扩至 6 柄，攻击频率翻倍',
        rewardIcon: 'fa-solid fa-wand-magic-sparkles text-amber-400',
        cost: [
          { name: '灵磁齿轮', code: 'ling_magnetic_gear', need: 25, stock: 5 },
          { name: '玄铁板', code: 'iron_plate', need: 80, stock: 120 }
        ],
        desc: '背部天罡剑匣重构，双层导灵滑轨，六剑齐发。',
        effects: ['sword_slot_6']
      },

      // Row 6: 高阶阶段
      // 6-左: 御风踏虚
      {
        id: 'node_gengjin_6_left',
        name: '御风踏虚滑翔',
        level: 6, pos: { row: 6, col: 1 },
        parentId: 'node_gengjin_5_left',
        icon: 'fa-solid fa-wind text-sky-300',
        unlocked: false, researched: false,
        rewardText: '空中双击跳跃可进入长时间滑翔姿态',
        rewardIcon: 'fa-solid fa-plane-up text-sky-400',
        cost: [
          { name: '导灵铜片', code: 'ling_copper_sheet', need: 50, stock: 20 },
          { name: '灵磁齿轮', code: 'ling_magnetic_gear', need: 30, stock: 5 }
        ],
        desc: '展开背部风翼折叠装置，横跨深渊天堑如履平川。',
        effects: ['ability_glide']
      },
      // 6-中: 自动化超频
      {
        id: 'node_gengjin_6_mid',
        name: '庚金灵磁超频',
        level: 6, pos: { row: 6, col: 2 },
        parentId: 'node_gengjin_5_mid',
        icon: 'fa-solid fa-gauge-high text-yellow-400',
        unlocked: false, researched: false,
        rewardText: '所有生产机器超频功率上限提至 200%',
        rewardIcon: 'fa-solid fa-fire text-yellow-500',
        cost: [
          { name: '电子生物芯片', code: 'bio_chip', need: 15, stock: 5 },
          { name: '导电线圈', code: 'electric_coil', need: 80, stock: 60 }
        ],
        desc: '灵磁抗扰回路，允许全厂精炼机超载极限高频运转。',
        effects: ['factory_overclock_200']
      },
      // 6-右: 万剑归宗
      {
        id: 'node_gengjin_6_right',
        name: '万剑归宗阵图',
        level: 6, pos: { row: 6, col: 3 },
        parentId: 'node_gengjin_5_right',
        icon: 'fa-solid fa-arrows-to-circle text-rose-500',
        unlocked: false, researched: false,
        rewardText: '天罡剑匣激活 8 剑自动巡航索敌剑阵',
        rewardIcon: 'fa-solid fa-crosshairs text-rose-400',
        cost: [
          { name: '电子生物芯片', code: 'bio_chip', need: 20, stock: 5 },
          { name: '灵磁齿轮', code: 'ling_magnetic_gear', need: 40, stock: 5 }
        ],
        desc: '神识连线 8 柄飞剑，自动绞杀周遭靠近之荒兽。',
        effects: ['sword_auto_hunt']
      },

      // Row 7: 终极神木节点 (三脉归一)
      {
        id: 'node_gengjin_7_master',
        name: '不灭庚金道躯',
        level: 7, pos: { row: 7, col: 2 },
        parentId: 'node_gengjin_6_mid',
        icon: 'fa-solid fa-sun text-amber-200 animate-spin',
        unlocked: false, researched: false,
        rewardText: '肉身金刚不坏，免疫辐射与环境毒煞，攻击全额真伤',
        rewardIcon: 'fa-solid fa-crown text-amber-300',
        cost: [
          { name: '玄铁梁', code: 'iron_beam', need: 100, stock: 35 },
          { name: '电子生物芯片', code: 'bio_chip', need: 50, stock: 5 }
        ],
        desc: '庚金大成，金身极境。天地万化，唯我独尊。',
        effects: ['immortal_gengjin_body']
      }
    ]
  },

  yaoshou: {
    id: 'yaoshou',
    name: '妖兽血脉',
    status: '已发现',
    icon: 'fa-solid fa-dragon text-rose-500',
    desc: '解构异星荒兽与妖兽组织样本，逆向融合生机经脉，强化金身自愈与生化芯片。',
    nodes: [
      {
        id: 'node_yao_1', name: '荒兽尸解剖析', level: 1, pos: { row: 1, col: 2 },
        icon: 'fa-solid fa-skull text-rose-400', unlocked: true, researched: true,
        rewardText: '解锁生化解构机 (BD_107) 进阶配方',
        rewardIcon: 'fa-solid fa-dna text-rose-400',
        cost: [{ name: '鲜活生物组织', code: 'living_tissue', need: 10, stock: 15 }],
        desc: '分析荒兽肌肉组织与角质层，掌握高活性蛋白提取法。', effects: ['recipe_bio_extract']
      },
      {
        id: 'node_yao_2', name: '金身生机自愈', level: 2, pos: { row: 2, col: 2 }, parentId: 'node_yao_1',
        icon: 'fa-solid fa-heart-pulse text-red-500', unlocked: true, researched: false,
        rewardText: '脱战后金身灵压每秒自动回血 1 格',
        rewardIcon: 'fa-solid fa-kit-medical text-emerald-400',
        cost: [{ name: '鲜活生物组织', code: 'living_tissue', need: 25, stock: 15 }],
        desc: '将妖兽自愈基因编织入修士神经回路，非战斗状态下迅速平复创伤。', effects: ['passive_auto_heal']
      },
      {
        id: 'node_yao_3_left', name: '耐煞生物肺叶', level: 3, pos: { row: 3, col: 1 }, parentId: 'node_yao_2',
        icon: 'fa-solid fa-mask-ventilator text-teal-400', unlocked: false, researched: false,
        rewardText: '毒雾瘴气耐受度提升 80%',
        rewardIcon: 'fa-solid fa-lungs text-teal-300',
        cost: [{ name: '鲜活生物组织', code: 'living_tissue', need: 30, stock: 15 }],
        desc: '仿生肺叶过滤毒煞浊气。', effects: ['gas_immunity']
      },
      {
        id: 'node_yao_3_mid', name: '生物神经连接束', level: 3, pos: { row: 3, col: 2 }, parentId: 'node_yao_2',
        icon: 'fa-solid fa-network-wired text-purple-400', unlocked: false, researched: false,
        rewardText: '解锁【电子生物芯片】批量流水线生产',
        rewardIcon: 'fa-solid fa-microchip text-purple-300',
        cost: [{ name: '神经束', code: 'nerve_bundle', need: 20, stock: 8 }],
        desc: '高传导神经纤维用于工控互联。', effects: ['recipe_bio_chip']
      },
      {
        id: 'node_yao_3_right', name: '荒兽筋肉强化', level: 3, pos: { row: 3, col: 3 }, parentId: 'node_yao_2',
        icon: 'fa-solid fa-hand-fist text-rose-400', unlocked: false, researched: false,
        rewardText: '手持器械采矿/砍伐挥击速度 +50%',
        rewardIcon: 'fa-solid fa-dumbbell text-rose-300',
        cost: [{ name: '鲜活生物组织', code: 'living_tissue', need: 40, stock: 15 }],
        desc: '强化手臂肌腱力量。', effects: ['mining_speed_50']
      },
      {
        id: 'node_yao_4_mid', name: '人造灵根培育', level: 4, pos: { row: 4, col: 2 }, parentId: 'node_yao_3_mid',
        icon: 'fa-solid fa-seedling text-emerald-400', unlocked: false, researched: false,
        rewardText: '解锁【组装机】双轨合成人造地灵根',
        rewardIcon: 'fa-solid fa-plant-wilt text-emerald-300',
        cost: [
          { name: '鲜活生物组织', code: 'living_tissue', need: 50, stock: 15 },
          { name: '电子生物芯片', code: 'bio_chip', need: 10, stock: 5 }
        ],
        desc: '人工培养具备五行属性的导灵仿生器官。', effects: ['recipe_artificial_root']
      }
    ]
  },

  lingjing: {
    id: 'lingjing',
    name: '太虚灵晶',
    status: '核心',
    icon: 'fa-solid fa-diamond text-cyan-400',
    desc: '研析高纯度太虚晶石的高频共振，彻底激活地脉全景测绘与天眼地图。',
    nodes: [
      {
        id: 'node_lingjing_1', name: '灵晶共振感知', level: 1, pos: { row: 1, col: 2 },
        icon: 'fa-solid fa-radar text-cyan-300', unlocked: true, researched: true,
        rewardText: '手持罗盘探测半径由 200m 扩展至 500m',
        rewardIcon: 'fa-solid fa-compass text-amber-300',
        cost: [{ name: '玄铁锭', code: 'iron_ingot', need: 40, stock: 100 }],
        desc: '晶体微振放大神识探测距离，极大增强寻龙罗盘精度。', effects: ['radar_range_500']
      },
      {
        id: 'node_lingjing_2', name: '【地脉全域地图】', level: 2, pos: { row: 2, col: 2 }, parentId: 'node_lingjing_1',
        icon: 'fa-solid fa-map-location-dot text-cyan-400', unlocked: true, researched: false,
        rewardText: '【全域地图 M】正式解锁！点亮快捷栏，放置航标与资源筛选',
        rewardIcon: 'fa-solid fa-map text-cyan-300',
        cost: [
          { name: '玄铁板', code: 'iron_plate', need: 40, stock: 120 },
          { name: '导电线圈', code: 'electric_coil', need: 30, stock: 60 }
        ],
        desc: '将灵晶全息投影映射至金身目镜！研究完成后，屏幕右下角 [M] 地图将永久高亮点亮！', effects: ['unlock_map_system']
      },
      {
        id: 'node_lingjing_3_left', name: '天眼雷达塔基', level: 3, pos: { row: 3, col: 1 }, parentId: 'node_lingjing_2',
        icon: 'fa-solid fa-tower-broadcast text-sky-400', unlocked: false, researched: false,
        rewardText: '解锁建造【天眼雷达塔】，穿透大范围战争迷雾',
        rewardIcon: 'fa-solid fa-satellite-dish text-sky-300',
        cost: [{ name: '基础控制模块', code: 'basic_control_module', need: 15, stock: 15 }],
        desc: '高耸巨塔引下太虚波段，自动揭示方圆数公里地形。', effects: ['unlock_radar_tower']
      },
      {
        id: 'node_lingjing_3_mid', name: '传音明镜玉符', level: 3, pos: { row: 3, col: 2 }, parentId: 'node_lingjing_2',
        icon: 'fa-solid fa-walkie-talkie text-cyan-300', unlocked: false, researched: false,
        rewardText: '全图远程调配机器配方与监控电力',
        rewardIcon: 'fa-solid fa-satellite text-cyan-400',
        cost: [{ name: '导灵铜片', code: 'ling_copper_sheet', need: 20, stock: 20 }],
        desc: '万里传讯明镜，身处矿区亦可统御主基地。', effects: ['remote_factory_inspect']
      },
      {
        id: 'node_lingjing_3_right', name: '太虚储能晶石', level: 3, pos: { row: 3, col: 3 }, parentId: 'node_lingjing_2',
        icon: 'fa-solid fa-battery-full text-indigo-400', unlocked: false, researched: false,
        rewardText: '解锁大容量电网储能电池建筑 (500MJ)',
        rewardIcon: 'fa-solid fa-car-battery text-indigo-300',
        cost: [{ name: '导电线圈', code: 'electric_coil', need: 50, stock: 60 }],
        desc: '白昼蓄积富余电能，夜间稳压输出。', effects: ['unlock_battery_storage']
      }
    ]
  },

  dandao: {
    id: 'dandao',
    name: '辟谷丹道',
    status: '已发现',
    icon: 'fa-solid fa-capsules text-emerald-400',
    desc: '利用工业流固搅拌与萃取提取植物灵草，合成灵药与辟谷军粮。',
    nodes: [
      {
        id: 'node_dan_1', name: '百草灵液萃取', level: 1, pos: { row: 1, col: 2 },
        icon: 'fa-solid fa-flask-vial text-emerald-300', unlocked: true, researched: true,
        rewardText: '解锁提取器 (BD_109) 灵草浸出液配方',
        rewardIcon: 'fa-solid fa-droplet text-emerald-400',
        cost: [{ name: '赤铜锭', code: 'copper_ingot', need: 20, stock: 80 }],
        desc: '蒸馏浓缩野生灵草纯净灵药。', effects: ['recipe_herbal_extract']
      },
      {
        id: 'node_dan_2', name: '便携辟谷丹丸', level: 2, pos: { row: 2, col: 2 }, parentId: 'node_dan_1',
        icon: 'fa-solid fa-cookie-bite text-amber-400', unlocked: true, researched: false,
        rewardText: '随身瞬时补满 100% 灵压与饱食度',
        rewardIcon: 'fa-solid fa-bowl-food text-amber-300',
        cost: [{ name: '玄铁粉', code: 'iron_powder', need: 20, stock: 50 }],
        desc: '一口吞服，立挽狂澜。', effects: ['craft_ration_pill']
      }
    ]
  },

  huosha: {
    id: 'huosha',
    name: '极阳火煞',
    status: '未深入',
    icon: 'fa-solid fa-fire-flame-curved text-orange-500',
    desc: '引地脉硫磺火煞与雷暴，开发高爆采矿法宝与高压极阳发电机。',
    nodes: [
      {
        id: 'node_shaa_1', name: '火煞除杂爆燃', level: 1, pos: { row: 1, col: 2 },
        icon: 'fa-solid fa-volcano text-orange-400', unlocked: true, researched: false,
        rewardText: '解锁高能火煞粉碎与工矿爆破药包',
        rewardIcon: 'fa-solid fa-bomb text-red-500',
        cost: [{ name: '煤炭', code: 'coal', need: 30, stock: 60 }],
        desc: '硫火开山裂石之工矿雷火包。', effects: ['craft_mining_explosive']
      }
    ]
  }
};

let currentJinShenCategory = 'gengjin';
let currentSelectedNodeId = null; // 默认不弹出浮窗，让整棵树完全展现！

// 打开金身系统
function openJinShenModal() {
  playUiSound('click');
  if (typeof closeOtherModals === 'function') closeOtherModals('jinShenModal');
  const modal = document.getElementById('jinShenModal');
  if (!modal) return;
  modal.classList.remove('hidden');

  renderJinShenCategoryList();
  selectJinShenCategory(currentJinShenCategory, false);
}

// 关闭金身系统
function closeJinShenModal() {
  playUiSound('click');
  const modal = document.getElementById('jinShenModal');
  if (modal) modal.classList.add('hidden');
  hideJinShenFloatingCard();
}

// 隐藏浮动卡片
function hideJinShenFloatingCard() {
  const card = document.getElementById('jinShenFloatingCard');
  if (card) card.classList.add('hidden');
}

// 渲染左侧分类列表
function renderJinShenCategoryList() {
  const container = document.getElementById('jinShenCatListContainer');
  if (!container) return;
  container.innerHTML = '';

  Object.values(JINSHEN_TREE_DATA).forEach(cat => {
    const isSelected = (cat.id === currentJinShenCategory);
    const researchedCount = cat.nodes.filter(n => n.researched).length;
    const totalCount = cat.nodes.length;
    const isAllDone = researchedCount === totalCount;

    const item = document.createElement('div');
    item.className = `px-3 py-2.5 rounded flex items-center justify-between cursor-pointer transition select-none ${
      isSelected ? 'bg-[#e0770b] text-black font-extrabold shadow-[0_0_12px_rgba(245,146,30,0.5)]' : 'bg-white/5 hover:bg-white/10 text-white/80'
    }`;
    item.onclick = () => selectJinShenCategory(cat.id, true);

    item.innerHTML = `
      <div class="flex items-center space-x-2.5">
        <i class="${cat.icon} text-sm ${isSelected ? 'text-black' : ''}"></i>
        <span class="text-xs font-sans tracking-wide">${cat.name}</span>
      </div>
      <div class="flex items-center space-x-1.5 font-mono text-[10px]">
        <span class="${isSelected ? 'text-black/80' : 'text-white/50'}">${isAllDone ? '(已完成)' : `(${researchedCount}/${totalCount})`}</span>
        <div class="w-4 h-4 rounded-sm flex items-center justify-center ${isSelected ? 'bg-black text-[#e0770b]' : isAllDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'} text-[10px] font-bold">
          ${isAllDone ? '✓' : 'S'}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// 选择分支
function selectJinShenCategory(catId, playSound = true) {
  if (playSound) playUiSound('toggle');
  currentJinShenCategory = catId;
  renderJinShenCategoryList();

  const cat = JINSHEN_TREE_DATA[catId];
  if (!cat) return;

  // 默认不弹浮窗，保证整棵树完整露出！
  currentSelectedNodeId = null;
  hideJinShenFloatingCard();

  renderJinShenTreeCanvas(cat);
  // 右侧默认展示根节点信息
  const defaultNode = cat.nodes.find(n => !n.researched && n.unlocked) || cat.nodes[0];
  if (defaultNode) {
    renderJinShenRightPanel(defaultNode);
  }
}

// 渲染中间树状节点与连线 (支持纵向多层拓扑)
function renderJinShenTreeCanvas(cat) {
  const treeContainer = document.getElementById('jinShenTreeCanvas');
  const svgLines = document.getElementById('jinShenSvgLines');
  if (!treeContainer || !svgLines) return;

  treeContainer.innerHTML = '';
  svgLines.innerHTML = '';

  // 3 列纵向网格映射 (列宽 170px，总宽 540px)
  const COL_X = { 1: 100, 2: 270, 3: 440 };
  // 7 层高程映射 (层间距 120px)
  const ROW_Y = { 1: 50, 2: 170, 3: 290, 4: 420, 5: 550, 6: 680, 7: 810 };

  // 1. 绘制 SVG 连线 (折线路径，完全还原 Satisfactory MAM 拐弯走线)
  cat.nodes.forEach(node => {
    if (node.parentId) {
      const parent = cat.nodes.find(n => n.id === node.parentId);
      if (parent) {
        const x1 = COL_X[parent.pos.col];
        const y1 = ROW_Y[parent.pos.row];
        const x2 = COL_X[node.pos.col];
        const y2 = ROW_Y[node.pos.row];

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midY = y1 + (y2 - y1) * 0.5;
        // 折线：从父节点先直下到 midY，横折到 x2，再直下到子节点
        const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        line.setAttribute('d', d);
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', node.researched ? '#10b981' : node.unlocked ? '#f5921e' : '#334155');
        line.setAttribute('stroke-width', node.researched ? '3.5' : '2.5');
        if (!node.researched && !node.unlocked) {
          line.setAttribute('stroke-dasharray', '6,6');
        }
        svgLines.appendChild(line);
      }
    }
  });

  // 2. 渲染节点图标圆圈
  cat.nodes.forEach(node => {
    const cx = COL_X[node.pos.col];
    const cy = ROW_Y[node.pos.row];
    const isSelected = (node.id === currentSelectedNodeId);

    const nodeBtn = document.createElement('div');
    nodeBtn.className = `absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition duration-200 select-none z-20 group ${
      node.researched
        ? 'bg-[#142330] border-3 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
        : node.unlocked
        ? 'bg-[#291f11] border-2 border-amber-500 shadow-[0_0_12px_rgba(245,146,30,0.4)] hover:scale-110'
        : 'bg-[#111620] border-2 border-slate-700/80 opacity-60'
    } ${isSelected ? 'ring-4 ring-cyan-400 scale-110' : ''}`;
    nodeBtn.style.left = `${cx}px`;
    nodeBtn.style.top = `${cy}px`;
    nodeBtn.title = node.name;

    // 点击节点切换高亮并弹出悬浮窗
    nodeBtn.onclick = (e) => {
      e.stopPropagation();
      selectJinShenNode(node.id);
    };

    // 状态标记徽章
    let badgeHtml = '';
    if (node.researched) {
      badgeHtml = `<span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black shadow">✓</span>`;
    } else if (!node.unlocked) {
      badgeHtml = `<span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-amber-500 flex items-center justify-center text-[10px] shadow border border-slate-700"><i class="fa-solid fa-lock"></i></span>`;
    }

    nodeBtn.innerHTML = `
      <i class="${node.icon} text-lg ${node.researched ? 'text-emerald-300' : node.unlocked ? 'text-amber-300' : 'text-slate-500'}"></i>
      ${badgeHtml}
    `;

    treeContainer.appendChild(nodeBtn);
  });
}

// 选中某个节点 (弹出悬浮窗，绝不固定遮挡中间)
function selectJinShenNode(nodeId) {
  playUiSound('click');
  currentSelectedNodeId = nodeId;
  const cat = JINSHEN_TREE_DATA[currentJinShenCategory];
  if (!cat) return;

  const node = cat.nodes.find(n => n.id === nodeId);
  if (!node) return;

  renderJinShenTreeCanvas(cat);
  showFloatingNodeCard(node);
  renderJinShenRightPanel(node);
}

// 弹出悬浮窗 (带关闭键，位置停靠或浮动，不遮挡主干树)
function showFloatingNodeCard(node) {
  const card = document.getElementById('jinShenFloatingCard');
  if (!card) return;
  card.classList.remove('hidden');

  document.getElementById('floatingNodeTitle').innerText = node.name;
  document.getElementById('floatingRewardIcon').className = `${node.rewardIcon} text-2xl mb-1`;
  document.getElementById('floatingRewardText').innerText = node.rewardText;

  // 成本提示
  const costSummary = node.cost.map(c => `${c.name} x${c.need}`).join(', ');
  document.getElementById('floatingCostText').innerText = node.researched ? '已完成全额投入' : `消耗: ${costSummary}`;

  // 操作按钮
  const btn = document.getElementById('floatingActionBtn');
  if (node.researched) {
    btn.innerText = '节点已完成研究';
    btn.className = 'w-full py-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-default';
    btn.onclick = null;
  } else if (!node.unlocked) {
    btn.innerText = '前置节点未激活';
    btn.className = 'w-full py-1.5 rounded bg-slate-800 text-slate-500 border border-slate-700 text-xs font-bold cursor-not-allowed';
    btn.onclick = null;
  } else {
    btn.innerText = '开始金身凝练 (淬炼解锁)';
    btn.className = 'w-full py-1.5 rounded bg-gradient-to-r from-amber-500 to-[#f5921e] hover:from-amber-400 hover:to-orange-500 text-black text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(245,146,30,0.5)] transition active:scale-95';
    btn.onclick = () => doResearchNode(node.id);
  }
}

// 渲染右侧详情面板
function renderJinShenRightPanel(node) {
  if (!node) return;

  document.getElementById('panelNodeTitle').innerText = node.name;
  document.getElementById('panelNodeDesc').innerText = node.desc;
  document.getElementById('panelRewardIcon').className = `${node.rewardIcon} text-2xl`;
  document.getElementById('panelRewardText').innerText = node.rewardText;

  // 成本插槽
  const costContainer = document.getElementById('panelCostItemsContainer');
  if (costContainer) {
    costContainer.innerHTML = '';
    node.cost.forEach(c => {
      const stock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined)
        ? playerInventory[c.code]
        : c.stock;
      const isEnough = stock >= c.need;

      const itemCard = document.createElement('div');
      itemCard.className = `flex flex-col items-center bg-black/50 border ${isEnough ? 'border-white/20' : 'border-rose-500/60'} rounded p-2 min-w-[72px]`;
      itemCard.innerHTML = `
        <span class="text-[10px] text-white/70">${c.name}</span>
        <span class="text-xs font-mono font-bold ${isEnough ? 'text-emerald-400' : 'text-rose-400'} mt-1">${stock}/${c.need}</span>
      `;
      costContainer.appendChild(itemCard);
    });
  }

  // 突破按钮
  const actionBtn = document.getElementById('panelResearchBtn');
  if (actionBtn) {
    if (node.researched) {
      actionBtn.innerText = '节点已完成研究';
      actionBtn.className = 'w-full py-2.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 cursor-default';
      actionBtn.onclick = null;
    } else if (!node.unlocked) {
      actionBtn.innerText = '前置节点未达成 (锁定)';
      actionBtn.className = 'w-full py-2.5 rounded bg-slate-800 text-slate-500 font-bold text-xs border border-slate-700 cursor-not-allowed';
      actionBtn.onclick = null;
    } else {
      actionBtn.innerText = '凝练突破此金身节点';
      actionBtn.className = 'w-full py-2.5 rounded bg-gradient-to-r from-[#ffd54f] to-[#e67e00] hover:from-amber-300 hover:to-orange-500 text-black font-black text-xs transition cursor-pointer shadow-[0_0_15px_rgba(245,146,30,0.6)] active:scale-95';
      actionBtn.onclick = () => doResearchNode(node.id);
    }
  }
}

// 执行突破
function doResearchNode(nodeId) {
  const cat = JINSHEN_TREE_DATA[currentJinShenCategory];
  if (!cat) return;
  const node = cat.nodes.find(n => n.id === nodeId);
  if (!node || node.researched || !node.unlocked) return;

  let canAfford = true;
  node.cost.forEach(c => {
    const stock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined)
      ? playerInventory[c.code]
      : c.stock;
    if (stock < c.need) canAfford = false;
  });

  if (!canAfford) {
    playUiSound('craft_fail');
    showNotification(`【物料不足】凝练【${node.name}】所需天工材料未备齐！`);
    return;
  }

  // 扣减材料
  node.cost.forEach(c => {
    if (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined) {
      playerInventory[c.code] -= c.need;
    }
  });
  if (typeof syncInventoryDisplay === 'function') syncInventoryDisplay();

  playUiSound('hub_launch');
  node.researched = true;

  // 触发解锁特殊系统 (例如解锁地图 M)
  if (node.effects && node.effects.includes('unlock_map_system')) {
    isMapUnlocked = true;
    const btnM = document.getElementById('btnM');
    if (btnM) {
      btnM.className = 'w-11 h-11 bg-white hover:bg-cyan-50 text-slate-900 border-2 border-[#00f0ff] rounded flex flex-col items-center justify-between py-1 shadow-[0_0_8px_rgba(0,240,255,0.6)] cursor-pointer group hover:scale-105 active:scale-95 transition select-none';
      btnM.innerHTML = `
        <span class="text-[9.5px] font-black font-mono text-[#0284c7] leading-none">M</span>
        <i class="fa-solid fa-map-location-dot text-xs text-amber-500 group-hover:scale-110 transition"></i>
        <span class="text-[8.5px] font-bold text-slate-700 leading-none">地图</span>
      `;
      btnM.title = '[按键 M] 已解锁地脉全景地图系统！';
    }
    showNotification('🎉【地脉全域地图已解锁！】屏幕右下角 [M] 地图已点亮可用！');
  } else {
    showNotification(`🎉【金身突破】已成功激活节点: 【${node.name}】！${node.rewardText}`);
  }

  // 解锁直属子节点
  cat.nodes.forEach(child => {
    if (child.parentId === node.id) {
      child.unlocked = true;
    }
  });

  renderJinShenCategoryList();
  renderJinShenTreeCanvas(cat);
  showFloatingNodeCard(node);
  renderJinShenRightPanel(node);
}

// 待办清单联动
function addJinShenNodeToTodo() {
  const cat = JINSHEN_TREE_DATA[currentJinShenCategory];
  if (!cat) return;
  const node = cat.nodes.find(n => n.id === currentSelectedNodeId) || cat.nodes[0];
  if (!node) return;

  playUiSound('toggle');
  const todoCards = document.getElementById('todoCardsContainer');
  if (!todoCards) return;

  const itemBox = document.createElement('div');
  itemBox.className = 'bg-black/85 backdrop-blur-md border border-cyan-400 rounded p-2.5 flex flex-col items-end shadow-2xl transition hover:border-cyan-300';

  let costItemsHtml = '';
  node.cost.forEach(c => {
    const stock = (typeof playerInventory !== 'undefined' && playerInventory[c.code] !== undefined)
      ? playerInventory[c.code]
      : c.stock;
    costItemsHtml += `
      <div class="flex flex-col items-center bg-white/10 border border-white/20 rounded px-2 py-1 min-w-[56px] relative" title="${c.name}: ${stock}/${c.need}">
        <span class="text-[9px] text-white/70">${c.name}</span>
        <span class="text-[10px] font-mono font-bold ${stock >= c.need ? 'text-emerald-400' : 'text-amber-400'}">${stock}/${c.need}</span>
      </div>
    `;
  });

  itemBox.innerHTML = `
    <div class="flex items-center space-x-2 text-[11px] text-white/90 mb-1.5 font-sans">
      <span class="text-cyan-300 font-bold">金身目标: <strong>${node.name}</strong></span>
      <button onclick="this.closest('.bg-black\\\\/85').remove(); playUiSound('toggle');" class="text-white/40 hover:text-white px-1 text-xs cursor-pointer">×</button>
    </div>
    <div class="flex items-center space-x-2">
      ${costItemsHtml}
    </div>
  `;
  todoCards.appendChild(itemBox);
  showNotification(`已将金身节点【${node.name}】材料需求添加至右上角待办清单！`);
}

function removeJinShenNodeFromTodo() {
  playUiSound('toggle');
  showNotification('已从待办清单移除当前节点需求');
}
