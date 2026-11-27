// ====================================================================
// js/data/showcase_world.js - 示范区世界建筑初始实体数据
// 从 js/world_buildings.js 抽离，提供顶层全局 worldBuildings
// ====================================================================

// 场景中的活跃建筑实体列表 (三层立体叠加高产工厂：4矿机+4精炼+11初级加工+4重型组装+2离心+2解构+3炼宝台+2渡劫台+8垂直电梯)
let worldBuildings = [
  {
    "id": "bld_wind_1",
    "type": "wind_generator",
    "name": "风力发电机 #1",
    "power": "+45 MW",
    "wx": -22,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_2",
    "type": "wind_generator",
    "name": "风力发电机 #2",
    "power": "+45 MW",
    "wx": -16,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_3",
    "type": "wind_generator",
    "name": "风力发电机 #3",
    "power": "+45 MW",
    "wx": -10,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_wind_4",
    "type": "wind_generator",
    "name": "风力发电机 #4",
    "power": "+45 MW",
    "wx": -4,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_1",
    "type": "fuel_generator",
    "name": "燃料发电机 #1",
    "power": "+100 MW",
    "wx": 2,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_2",
    "type": "fuel_generator",
    "name": "燃料发电机 #2",
    "power": "+100 MW",
    "wx": 8,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_fuel_3",
    "type": "fuel_generator",
    "name": "燃料发电机 #3",
    "power": "+100 MW",
    "wx": 14,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_engine_init",
    "type": "power_engine",
    "name": "灵力引擎 #1 (BD_147·下) + 冶炼舱 (BD_148·上)",
    "power": "+50 MW",
    "wx": 22,
    "wy": 0,
    "wz": -16,
    "rot": 0
  },
  {
    "id": "bld_box_eng_ore",
    "type": "storage_box",
    "name": "冶炼备料仓｜玄铁赤铜",
    "power": "0 MW",
    "wx": 20,
    "wy": 0,
    "wz": -9,
    "rot": 0
  },
  {
    "id": "bld_belt_eng_ore_to_up",
    "type": "conveyor",
    "name": "传送带｜前侧进冶炼上料电梯",
    "power": "2 MW",
    "wx": 20,
    "wy": 0,
    "wz": -10.5,
    "rot": 180,
    "beltLen": 3,
    "beltItem": "MAT_004"
  },
  {
    "id": "bld_lift_eng_up",
    "type": "vert_conveyor",
    "name": "垂直电梯｜前侧升料入冶炼舱 (0→4m)",
    "power": "3 MW",
    "wx": 20,
    "wy": 0,
    "wz": -12,
    "rot": 180,
    "liftHeight": 4,
    "beltItem": "MAT_004"
  },
  {
    "id": "bld_belt_eng_top_in",
    "type": "conveyor",
    "name": "高架传送带｜前侧入顶部冶炼舱",
    "power": "2 MW",
    "wx": 20,
    "wy": 4,
    "wz": -14,
    "rot": 180,
    "beltLen": 4,
    "beltItem": "MAT_004"
  },
  {
    "id": "bld_belt_eng_top_out",
    "type": "conveyor",
    "name": "高架传送带｜冶炼舱背后出口",
    "power": "2 MW",
    "wx": 22,
    "wy": 4,
    "wz": -19.5,
    "rot": 180,
    "beltLen": 3,
    "beltItem": "mat_051"
  },
  {
    "id": "bld_lift_eng_down",
    "type": "vert_conveyor",
    "name": "垂直电梯｜背后下料出冶炼舱 (4→0m)",
    "power": "3 MW",
    "wx": 22,
    "wy": 0,
    "wz": -21,
    "rot": 180,
    "liftHeight": 4,
    "beltItem": "mat_051"
  },
  {
    "id": "bld_belt_eng_ret",
    "type": "conveyor",
    "name": "传送带｜背后精炼玄铁出料",
    "power": "2 MW",
    "wx": 22,
    "wy": 0,
    "wz": -23.5,
    "rot": 180,
    "beltLen": 5,
    "beltItem": "mat_051"
  },
  {
    "id": "bld_box_eng_out",
    "type": "storage_box",
    "name": "冶炼成品仓｜精炼玄铁锭",
    "power": "0 MW",
    "wx": 22,
    "wy": 0,
    "wz": -26,
    "rot": 0
  },
  {
    "id": "bld_miner_fe1",
    "type": "miner",
    "name": "采矿机 #1 (玄铁矿)",
    "power": "5 MW",
    "wx": -21,
    "wy": 0,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_m1",
    "type": "conveyor",
    "name": "传送带｜玄铁矿 #1",
    "power": "2 MW",
    "wx": -16,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_001"
  },
  {
    "id": "bld_miner_fe2",
    "type": "miner",
    "name": "采矿机 #2 (玄铁矿)",
    "power": "5 MW",
    "wx": -29,
    "wy": 0,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_m2",
    "type": "conveyor",
    "name": "传送带｜玄铁矿 #2",
    "power": "2 MW",
    "wx": -20,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 12,
    "beltItem": "MAT_001"
  },
  {
    "id": "bld_miner_cu1",
    "type": "miner",
    "name": "采矿机 #3 (赤铜矿)",
    "power": "5 MW",
    "wx": -21,
    "wy": 0,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_m3",
    "type": "conveyor",
    "name": "传送带｜赤铜矿 #1",
    "power": "2 MW",
    "wx": -16,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_002"
  },
  {
    "id": "bld_miner_cu2",
    "type": "miner",
    "name": "采矿机 #4 (赤铜矿)",
    "power": "5 MW",
    "wx": -29,
    "wy": 0,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_m4",
    "type": "conveyor",
    "name": "传送带｜赤铜矿 #2",
    "power": "2 MW",
    "wx": -20,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 12,
    "beltItem": "MAT_002"
  },
  {
    "id": "bld_handcraft_init",
    "type": "handcraft",
    "name": "操作台 (BD_152)",
    "power": "5 MW",
    "wx": -22,
    "wy": 0,
    "wz": 17,
    "rot": 0
  },
  {
    "id": "bld_pump_1",
    "type": "pump",
    "name": "抽水机 #1 (水源)",
    "power": "10 MW",
    "wx": -15,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s1",
    "type": "pipe",
    "name": "水管｜供水直管",
    "power": "0 MW",
    "wx": -11,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_pump_2",
    "type": "pump",
    "name": "抽水机 #2 (增压)",
    "power": "10 MW",
    "wx": -7,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s2",
    "type": "pipe",
    "name": "水管｜三通汇流",
    "power": "0 MW",
    "wx": -4,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 2
  },
  {
    "id": "bld_fluid_hub_init",
    "type": "fluid_hub",
    "name": "1楼流体中枢 (BD_158)",
    "power": "0 MW",
    "wx": 1,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_pipe_s3",
    "type": "pipe",
    "name": "水管｜营养液",
    "power": "0 MW",
    "wx": 7,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_bio_base_init",
    "type": "bio_base",
    "name": "1楼营养基座 (BD_159)",
    "power": "0 MW",
    "wx": 11,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_box_bio_seed",
    "type": "storage_box",
    "name": "生物营养原料仓",
    "power": "0 MW",
    "wx": 11,
    "wy": 0,
    "wz": 10,
    "rot": 0
  },
  {
    "id": "bld_belt_bio_in_1",
    "type": "conveyor",
    "name": "传送带｜生物营养进料",
    "power": "2 MW",
    "wx": 11,
    "wy": 0,
    "wz": 13.5,
    "rot": 0,
    "beltLen": 5,
    "beltItem": "MAT_018"
  },
  {
    "id": "bld_belt_bio_out_1",
    "type": "conveyor",
    "name": "传送带｜灵草培养出料",
    "power": "2 MW",
    "wx": 11,
    "wy": 0,
    "wz": 19.5,
    "rot": 0,
    "beltLen": 4,
    "beltItem": "MAT_026"
  },
  {
    "id": "bld_spl_bio_out_1",
    "type": "splitter",
    "name": "分流器｜生物成品分流",
    "power": "2 MW",
    "wx": 11,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_pipe_s4",
    "type": "pipe",
    "name": "水管｜废液回流",
    "power": "0 MW",
    "wx": 15,
    "wy": 0,
    "wz": 17,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_purifier_1",
    "type": "purifier",
    "name": "1楼回收处理塔 (BD_150)",
    "power": "20 MW",
    "wx": 19,
    "wy": 0,
    "wz": 17,
    "rot": 270
  },
  {
    "id": "bld_fabao_socket_main",
    "type": "fabao_socket",
    "name": "母厂法宝共鸣插座 (范围生效)",
    "power": "10 MW",
    "wx": 24,
    "wy": 0,
    "wz": 17,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_0_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_6_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_12_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_18_-6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_0_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_6_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_12_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_18_0",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_0_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_6_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_12_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_18_6",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f1_-12_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_-6_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_0_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_6_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_12_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f1_18_12",
    "type": "foundation_3x3",
    "name": "1楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 0,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_furnace_1",
    "type": "furnace",
    "name": "1楼精炼炉 #1 (玄铁锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_f_1",
    "type": "conveyor",
    "name": "传送带｜玄铁锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_split_1",
    "type": "splitter",
    "name": "分流器 #1",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_furnace_2",
    "type": "furnace",
    "name": "1楼精炼炉 #2 (玄铁锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_f_2",
    "type": "conveyor",
    "name": "传送带｜玄铁锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_split_2",
    "type": "splitter",
    "name": "分流器 #2",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_furnace_3",
    "type": "furnace",
    "name": "1楼精炼炉 #3 (赤铜锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_f_3",
    "type": "conveyor",
    "name": "传送带｜赤铜锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_split_3",
    "type": "splitter",
    "name": "分流器 #3",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_furnace_4",
    "type": "furnace",
    "name": "1楼精炼炉 #4 (赤铜锭)",
    "power": "15 MW",
    "wx": -11,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_f_4",
    "type": "conveyor",
    "name": "传送带｜赤铜锭",
    "power": "2 MW",
    "wx": -6.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_split_4",
    "type": "splitter",
    "name": "分流器 #4",
    "power": "2 MW",
    "wx": -4,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1a1",
    "type": "conveyor",
    "name": "传送带｜进加工台",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_asm_1",
    "type": "assembler",
    "name": "1楼加工台 #1 (玄铁板)",
    "power": "10 MW",
    "wx": 2,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a2",
    "type": "conveyor",
    "name": "传送带｜玄铁板",
    "power": "2 MW",
    "wx": 5.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_008"
  },
  {
    "id": "bld_asm_2",
    "type": "assembler",
    "name": "1楼加工台 #2 (玄铁齿轮)",
    "power": "10 MW",
    "wx": 9,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a3",
    "type": "conveyor",
    "name": "传送带｜玄铁齿轮",
    "power": "2 MW",
    "wx": 12.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_011"
  },
  {
    "id": "bld_asm_3",
    "type": "assembler",
    "name": "1楼加工台 #3 (玄铁梁)",
    "power": "10 MW",
    "wx": 16,
    "wy": 2,
    "wz": -6,
    "rot": 270
  },
  {
    "id": "bld_belt_1a4",
    "type": "conveyor",
    "name": "传送带｜玄铁梁→1号电梯",
    "power": "2 MW",
    "wx": 19.5,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_014"
  },
  {
    "id": "bld_belt_1b1",
    "type": "conveyor",
    "name": "传送带｜进加工台",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_asm_4",
    "type": "assembler",
    "name": "1楼加工台 #4 (设备管件)",
    "power": "10 MW",
    "wx": 2,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b2",
    "type": "conveyor",
    "name": "传送带｜进粉碎机",
    "power": "2 MW",
    "wx": 5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 2,
    "beltItem": "MAT_006"
  },
  {
    "id": "bld_crush_1",
    "type": "crusher",
    "name": "1楼粉碎机 #1 (玄铁粉)",
    "power": "20 MW",
    "wx": 7,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b3",
    "type": "conveyor",
    "name": "传送带｜玄铁粉",
    "power": "2 MW",
    "wx": 9.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_crush_2",
    "type": "crusher",
    "name": "1楼粉碎机 #2 (玄铁粉)",
    "power": "20 MW",
    "wx": 12,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b4",
    "type": "conveyor",
    "name": "传送带｜玄铁粉",
    "power": "2 MW",
    "wx": 14.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_crush_3",
    "type": "crusher",
    "name": "1楼粉碎机 #3 (玄铁粉)",
    "power": "20 MW",
    "wx": 17,
    "wy": 2,
    "wz": 0,
    "rot": 270
  },
  {
    "id": "bld_belt_1b5",
    "type": "conveyor",
    "name": "传送带｜玄铁粉→2号电梯",
    "power": "2 MW",
    "wx": 19.5,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_belt_1c0_1",
    "type": "conveyor",
    "name": "传送带｜赤铜锭→切割机",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_cut_1_1",
    "type": "cutter",
    "name": "1楼切割机 #1A (导灵铜片)",
    "power": "25 MW",
    "wx": 1,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c1_1",
    "type": "conveyor",
    "name": "传送带｜导灵铜片",
    "power": "2 MW",
    "wx": 3.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cut_1_2",
    "type": "cutter",
    "name": "1楼切割机 #1B (铜线)",
    "power": "25 MW",
    "wx": 6,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c2_1",
    "type": "conveyor",
    "name": "传送带｜铜线",
    "power": "2 MW",
    "wx": 8.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_cut_1_3",
    "type": "cutter",
    "name": "1楼切割机 #1C (木结构件)",
    "power": "25 MW",
    "wx": 11,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c3_1",
    "type": "conveyor",
    "name": "传送带｜铜线→合流",
    "power": "2 MW",
    "wx": 13.5,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_merger_1f_1",
    "type": "merger",
    "name": "1楼合流器 #1",
    "power": "2 MW",
    "wx": 16,
    "wy": 2,
    "wz": 6,
    "rot": 270
  },
  {
    "id": "bld_belt_1c4_1",
    "type": "conveyor",
    "name": "传送带｜送往垂直电梯",
    "power": "2 MW",
    "wx": 19,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_belt_1c0_2",
    "type": "conveyor",
    "name": "传送带｜赤铜锭→切割机",
    "power": "2 MW",
    "wx": -1.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_007"
  },
  {
    "id": "bld_cut_2_1",
    "type": "cutter",
    "name": "1楼切割机 #2A (导灵铜片)",
    "power": "25 MW",
    "wx": 1,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c1_2",
    "type": "conveyor",
    "name": "传送带｜导灵铜片",
    "power": "2 MW",
    "wx": 3.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cut_2_2",
    "type": "cutter",
    "name": "1楼切割机 #2B (铜线)",
    "power": "25 MW",
    "wx": 6,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c2_2",
    "type": "conveyor",
    "name": "传送带｜铜线",
    "power": "2 MW",
    "wx": 8.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_cut_2_3",
    "type": "cutter",
    "name": "1楼切割机 #2C (木结构件)",
    "power": "25 MW",
    "wx": 11,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c3_2",
    "type": "conveyor",
    "name": "传送带｜铜线→合流",
    "power": "2 MW",
    "wx": 13.5,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_merger_1f_2",
    "type": "merger",
    "name": "1楼合流器 #2",
    "power": "2 MW",
    "wx": 16,
    "wy": 2,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_1c4_2",
    "type": "conveyor",
    "name": "传送带｜送往垂直电梯",
    "power": "2 MW",
    "wx": 19,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_lift_12_1",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #1",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": -6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_014"
  },
  {
    "id": "bld_lift_12_2",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #2",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 0,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_lift_12_3",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #3",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_lift_12_4",
    "type": "vert_conveyor",
    "name": "垂直电梯 1F→2F #4",
    "power": "3 MW",
    "wx": 22,
    "wy": 2,
    "wz": 12,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_col_a_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 0,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_b_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 8,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_c_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 16,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_d_-16_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": -16,
    "wy": 24,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_a_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 0,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_b_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 8,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_c_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": -16,
    "wy": 16,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_d_-16_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": -16,
    "wy": 24,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_a_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 0,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_b_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 8,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_c_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 16,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_d_22_-10",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": 22,
    "wy": 24,
    "wz": -10,
    "rot": 0
  },
  {
    "id": "bld_col_a_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (底层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 0,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_b_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (中层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 8,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_c_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶层)",
    "power": "0 MW",
    "wx": 22,
    "wy": 16,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_col_d_22_15",
    "type": "foundation_pillar",
    "name": "承重立柱 (顶帽)",
    "power": "0 MW",
    "wx": 22,
    "wy": 24,
    "wz": 15,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_0_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_6_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_12_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_18_-6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_0_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_6_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_12_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_18_0",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_0_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_6_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_12_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_18_6",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f2_-12_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_-6_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_0_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_6_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_12_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f2_18_12",
    "type": "foundation_3x3",
    "name": "2楼底座｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 14,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_belt_2e_1",
    "type": "conveyor",
    "name": "2楼传送带｜电梯出料",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_hasm_1_1",
    "type": "assembler_heavy",
    "name": "2楼组装机 #1A (控制模块)",
    "power": "50 MW",
    "wx": 14,
    "wy": 16,
    "wz": -6,
    "rot": 90
  },
  {
    "id": "bld_belt_2m_1",
    "type": "conveyor",
    "name": "2楼传送带｜控制模块",
    "power": "2 MW",
    "wx": 9,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_hasm_1_2",
    "type": "assembler_heavy",
    "name": "2楼组装机 #1B (生物控制芯)",
    "power": "50 MW",
    "wx": 4,
    "wy": 16,
    "wz": -6,
    "rot": 90
  },
  {
    "id": "bld_belt_2w_1",
    "type": "conveyor",
    "name": "2楼传送带｜控制芯→2F电梯",
    "power": "2 MW",
    "wx": -7,
    "wy": 16,
    "wz": -6,
    "rot": 90,
    "beltLen": 16,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_belt_2e_2",
    "type": "conveyor",
    "name": "2楼传送带｜电梯出料",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_019"
  },
  {
    "id": "bld_hasm_2_1",
    "type": "assembler_heavy",
    "name": "2楼组装机 #2A (控制模块)",
    "power": "50 MW",
    "wx": 14,
    "wy": 16,
    "wz": 0,
    "rot": 90
  },
  {
    "id": "bld_belt_2m_2",
    "type": "conveyor",
    "name": "2楼传送带｜控制模块",
    "power": "2 MW",
    "wx": 9,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_hasm_2_2",
    "type": "assembler_heavy",
    "name": "2楼组装机 #2B (生物控制芯)",
    "power": "50 MW",
    "wx": 4,
    "wy": 16,
    "wz": 0,
    "rot": 90
  },
  {
    "id": "bld_belt_2w_2",
    "type": "conveyor",
    "name": "2楼传送带｜控制芯→2F电梯",
    "power": "2 MW",
    "wx": -7,
    "wy": 16,
    "wz": 0,
    "rot": 90,
    "beltLen": 16,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_belt_2c1",
    "type": "conveyor",
    "name": "2楼传送带｜生物液进离心机",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cent_2_1",
    "type": "centrifuge",
    "name": "2楼离心机 #1",
    "power": "35 MW",
    "wx": 15,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c2",
    "type": "conveyor",
    "name": "2楼传送带｜级联离心",
    "power": "2 MW",
    "wx": 11,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_cent_2_2",
    "type": "centrifuge",
    "name": "2楼离心机 #2",
    "power": "35 MW",
    "wx": 7,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c3",
    "type": "conveyor",
    "name": "2楼传送带｜进解构机",
    "power": "2 MW",
    "wx": 3,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_decon_2_1",
    "type": "deconstructor",
    "name": "2楼解构机 #1 (BD_140)",
    "power": "55 MW",
    "wx": -3,
    "wy": 16,
    "wz": 6,
    "rot": 90
  },
  {
    "id": "bld_belt_2c4",
    "type": "conveyor",
    "name": "2楼传送带｜生物组织",
    "power": "2 MW",
    "wx": -11,
    "wy": 16,
    "wz": 6,
    "rot": 90,
    "beltLen": 8,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_belt_2c5",
    "type": "conveyor",
    "name": "2楼传送带｜进营养基座",
    "power": "2 MW",
    "wx": -7,
    "wy": 16,
    "wz": 8.5,
    "rot": 0,
    "beltLen": 5,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_belt_2d1",
    "type": "conveyor",
    "name": "2楼传送带｜进2号解构",
    "power": "2 MW",
    "wx": 19,
    "wy": 16,
    "wz": 12,
    "rot": 90,
    "beltLen": 4,
    "beltItem": "MAT_008"
  },
  {
    "id": "bld_decon_2_2",
    "type": "deconstructor",
    "name": "2楼解构机 #2 (BD_140)",
    "power": "55 MW",
    "wx": 13,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_pipe_2f_1",
    "type": "pipe",
    "name": "2楼水管｜流体输送",
    "power": "0 MW",
    "wx": 7,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "pipeLen": 4
  },
  {
    "id": "bld_fluid_hub_2",
    "type": "fluid_hub",
    "name": "2楼流体中枢 (BD_158)",
    "power": "0 MW",
    "wx": 1,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_pipe_2f_2",
    "type": "pipe",
    "name": "2楼水管｜营养液",
    "power": "0 MW",
    "wx": -4,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "pipeLen": 2
  },
  {
    "id": "bld_bio_base_2",
    "type": "bio_base",
    "name": "2楼营养基座 (BD_159)",
    "power": "0 MW",
    "wx": -7,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_purifier_2",
    "type": "purifier",
    "name": "2楼回收塔 (BD_150)",
    "power": "20 MW",
    "wx": -12,
    "wy": 16,
    "wz": 12,
    "rot": 90
  },
  {
    "id": "bld_lift_23_1",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #1",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": -6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_lift_23_2",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #2",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 0,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_lift_23_3",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #3",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 6,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_009"
  },
  {
    "id": "bld_lift_23_4",
    "type": "vert_conveyor",
    "name": "垂直电梯 2F→3F #4",
    "power": "3 MW",
    "wx": -16,
    "wy": 16,
    "wz": 12,
    "rot": 270,
    "liftHeight": 14,
    "beltItem": "MAT_013"
  },
  {
    "id": "bld_f3_-12_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_0_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_6_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_12_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_18_-6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": -6,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_0_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_6_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_12_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_18_0",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 0,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_0_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_6_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_12_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_18_6",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 6,
    "rot": 0
  },
  {
    "id": "bld_f3_-12_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -12,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_-6_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": -6,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_0_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 0,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_6_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 6,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_12_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 12,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_f3_18_12",
    "type": "foundation_3x3",
    "name": "3楼终局平台｜3×3×1m",
    "power": "0 MW",
    "wx": 18,
    "wy": 28,
    "wz": 12,
    "rot": 0
  },
  {
    "id": "bld_belt_3w1",
    "type": "conveyor",
    "name": "3楼传送带｜进引擎",
    "power": "2 MW",
    "wx": -14,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 2,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_engine_3f",
    "type": "power_engine",
    "name": "3楼灵力引擎 #2 (高温冶炼)",
    "power": "+50 MW",
    "wx": -10,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_belt_3w2",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#1",
    "power": "2 MW",
    "wx": -5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "MAT_043"
  },
  {
    "id": "bld_belt_3w3",
    "type": "conveyor",
    "name": "3楼传送带｜进冶炼舱#1",
    "power": "2 MW",
    "wx": -13,
    "wy": 30,
    "wz": 3,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_chamber_3_1",
    "type": "smelt_chamber",
    "name": "3楼冶炼舱 #1 (高温合金)",
    "power": "65 MW",
    "wx": -10,
    "wy": 30,
    "wz": 3,
    "rot": 270
  },
  {
    "id": "bld_belt_3w4",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#2",
    "power": "2 MW",
    "wx": -6,
    "wy": 30,
    "wz": 3,
    "rot": 270,
    "beltLen": 6,
    "beltItem": "MAT_043"
  },
  {
    "id": "bld_belt_3w5",
    "type": "conveyor",
    "name": "3楼传送带｜进冶炼舱#2",
    "power": "2 MW",
    "wx": -13,
    "wy": 30,
    "wz": 11,
    "rot": 270,
    "beltLen": 4,
    "beltItem": "mat_014"
  },
  {
    "id": "bld_chamber_3_2",
    "type": "smelt_chamber",
    "name": "3楼冶炼舱 #2 (导脉合金)",
    "power": "65 MW",
    "wx": -10,
    "wy": 30,
    "wz": 11,
    "rot": 270
  },
  {
    "id": "bld_belt_3w6",
    "type": "conveyor",
    "name": "3楼传送带｜合金→炼宝台#3",
    "power": "2 MW",
    "wx": -6,
    "wy": 30,
    "wz": 11,
    "rot": 270,
    "beltLen": 6,
    "beltItem": "mat_068"
  },
  {
    "id": "bld_alchemy_1",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #1",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_alchemy_2",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #2",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": 3.5,
    "rot": 270
  },
  {
    "id": "bld_alchemy_3",
    "type": "alchemy_table",
    "name": "3楼炼宝台 #3",
    "power": "45 MW",
    "wx": 1,
    "wy": 30,
    "wz": 12,
    "rot": 270
  },
  {
    "id": "bld_belt_3e1",
    "type": "conveyor",
    "name": "3楼传送带｜法宝胚 #1",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_lim_3_1",
    "type": "conveyor_limiter",
    "name": "3楼限速器 #1",
    "power": "1 MW",
    "wx": 9,
    "wy": 30,
    "wz": -5,
    "rot": 270
  },
  {
    "id": "bld_belt_3e2",
    "type": "conveyor",
    "name": "3楼传送带｜进渡劫台 #1",
    "power": "2 MW",
    "wx": 10.5,
    "wy": 30,
    "wz": -5,
    "rot": 270,
    "beltLen": 1,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_trib_1",
    "type": "tribulation_table",
    "name": "3楼渡劫台 #1 (终局产出)",
    "power": "80 MW",
    "wx": 16,
    "wy": 30,
    "wz": -4,
    "rot": 270
  },
  {
    "id": "bld_belt_3e3",
    "type": "conveyor",
    "name": "3楼传送带｜法宝胚 #2",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": 4,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_lim_3_2",
    "type": "conveyor_limiter",
    "name": "3楼限速器 #2",
    "power": "1 MW",
    "wx": 9,
    "wy": 30,
    "wz": 4,
    "rot": 270
  },
  {
    "id": "bld_belt_3e4",
    "type": "conveyor",
    "name": "3楼传送带｜进渡劫台 #2",
    "power": "2 MW",
    "wx": 10.5,
    "wy": 30,
    "wz": 4,
    "rot": 270,
    "beltLen": 1,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_trib_2",
    "type": "tribulation_table",
    "name": "3楼渡劫台 #2 (终局产出)",
    "power": "80 MW",
    "wx": 16,
    "wy": 30,
    "wz": 7,
    "rot": 270
  },
  {
    "id": "bld_belt_3e5",
    "type": "conveyor",
    "name": "3楼传送带｜法宝成品入库",
    "power": "2 MW",
    "wx": 6.5,
    "wy": 30,
    "wz": 13,
    "rot": 270,
    "beltLen": 3,
    "beltItem": "mat_072"
  },
  {
    "id": "bld_desk_3_1",
    "type": "storage_desk",
    "name": "3楼置物桌｜小桌板 #1",
    "power": "0 MW",
    "wx": 9,
    "wy": 30,
    "wz": 13,
    "rot": 0,
    "displayItem": "mat_072"
  },
  {
    "id": "bld_box_3_1a",
    "type": "storage_box",
    "name": "成品储藏盒 #1-1",
    "power": "0 MW",
    "wx": 9,
    "wy": 32,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_box_3_1b",
    "type": "storage_box",
    "name": "成品储藏盒 #1-2",
    "power": "0 MW",
    "wx": 9,
    "wy": 34,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_box_3_1c",
    "type": "storage_box",
    "name": "成品储藏盒 #1-3",
    "power": "0 MW",
    "wx": 9,
    "wy": 36,
    "wz": 13,
    "rot": 0
  },
  {
    "id": "bld_f1_show_1",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": -6,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_2",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 0,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_3",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 6,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_f1_show_4",
    "type": "foundation_3x3",
    "name": "地基 3×3",
    "power": "0 MW",
    "wx": 12,
    "wy": 0,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_1",
    "type": "storage_desk",
    "name": "1楼置物桌｜小桌板 #1",
    "power": "0 MW",
    "wx": -8,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_box",
    "type": "storage_box",
    "name": "桌面储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": -8,
    "wy": 4,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_2",
    "type": "storage_desk",
    "name": "1楼置物桌｜小桌板 #2",
    "power": "0 MW",
    "wx": -4,
    "wy": 2,
    "wz": 22,
    "rot": 0,
    "displayItem": "mat_100"
  },
  {
    "id": "bld_desk_1_tall",
    "type": "bd_154",
    "name": "1楼高置物桌｜1×1×2",
    "power": "0 MW",
    "wx": 0,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_desk_1_tall_box",
    "type": "storage_box",
    "name": "高桌储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": 0,
    "wy": 6,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_111",
    "type": "storage_box",
    "name": "储藏盒｜1×1×1",
    "power": "0 MW",
    "wx": 4,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_211",
    "type": "bd_114",
    "name": "窄柜｜2×1×1",
    "power": "0 MW",
    "wx": 9,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_box_1_121",
    "type": "bd_115",
    "name": "宽柜｜1×2×1",
    "power": "0 MW",
    "wx": 13,
    "wy": 2,
    "wz": 22,
    "rot": 0
  },
  {
    "id": "bld_tower_160_1",
    "type": "bd_160",
    "name": "飞剑防御塔 #1",
    "power": "25 MW",
    "wx": -26,
    "wy": 0,
    "wz": 21,
    "rot": 0
  },
  {
    "id": "bld_desk_2_1",
    "type": "storage_desk",
    "name": "2楼置物桌｜血胎样本",
    "power": "0 MW",
    "wx": -8,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "displayItem": "mat_032"
  },
  {
    "id": "bld_desk_2_2",
    "type": "storage_desk",
    "name": "2楼置物桌｜生物芯片",
    "power": "0 MW",
    "wx": 16,
    "wy": 16,
    "wz": 12,
    "rot": 0,
    "displayItem": "mat_015"
  },
  {
    "id": "bld_pill_163_1",
    "type": "bd_163",
    "name": "3楼炼丹炉（上）",
    "power": "20 MW",
    "wx": -4,
    "wy": 30,
    "wz": 12,
    "rot": 0
  },
  // ---------- 5) 中央主基地默认视野内千纸鹤赋能台（露天停机坪与3F顶层，上方无楼板遮挡） ----------
  { "id": "bld_center_crane_1f", "type": "crane_distributor", "name": "中央主厂东坪·千鹤赋能总台", "power": "60 MW", "wx": 26, "wy": 2, "wz": 18, "rot": 0 },
  { "id": "bld_center_crane_3f", "type": "crane_distributor", "name": "中央主厂3F·千鹤巡天赋能台", "power": "60 MW", "wx": -8, "wy": 30, "wz": -6, "rot": 90 }
];

// ==================== V5.0 2000×2000 广域盆地：四大远距差异化巨型建筑群 + 四大极远境矿山 ====================
(function populateMegaComplexes() {
  if (!Array.isArray(worldBuildings)) return;
  const add = (id, type, name, power, wx, wy, wz, rot = 0, extra = null) => {
    const obj = { id, type, name, power, wx, wy, wz, rot };
    if (extra) Object.assign(obj, extra);
    worldBuildings.push(obj);
  };

  // ---------------------------------------------------------------------------
  // 1) 【东境 (距中心 340m) · 不叠层大平铺 · 百炉玄铁赤铜巨型冶炼铸造矩阵】
  //    wx: 290..390, wz: -54..54 (完全单层平铺，绝不叠楼，100m × 108m 广域工业平层)
  // ---------------------------------------------------------------------------
  add('bld_ef_fnd_mega', 'foundation_3x3', '东境大平层整板地基', '0 MW', 339, 0, 0, 0, { slabW: 98, slabD: 104 });
  const eastCatchZ = [-36, -12, 12, 36];
  eastCatchZ.forEach((z, i) => {
    add(`bld_ef_lotus_${i}`, 'lotus_catcher', `东境平铺·飞剑收货台#${i + 1}`, '35 MW', 284, 0, z, 0, { beltItem: i % 2 === 0 ? 'MAT_001' : 'MAT_002' });
    add(`bld_ef_box_in_${i}`, 'storage_box', `东境平铺·卸货缓冲仓#${i + 1}`, '0 MW', 288, 0, z, 0);
    add(`bld_ef_split_a_${i}`, 'splitter', `东境平铺·干线分流器A#${i + 1}`, '0 MW', 292, 0, z, 90);
    add(`bld_ef_split_b_${i}`, 'splitter', `东境平铺·支线分流器B#${i + 1}`, '0 MW', 295, 2, z - 6, 90);
    add(`bld_ef_belt_in_${i}`, 'conveyor', `东境平铺·入炉高速带#${i + 1}`, '0 MW', 298, 2, z, 90, { beltItem: i % 2 === 0 ? 'MAT_001' : 'MAT_002' });
  });
  const furnaceCols = [304, 316, 328, 340];
  for (let r = 0; r < 8; r++) {
    const z = -42 + r * 12;
    furnaceCols.forEach((x, c) => {
      const fType = c === 3 ? 'entropy_smelter' : (c >= 1 ? 'furnace_mk2' : 'furnace');
      const pwr = c === 3 ? '220 MW' : (c >= 1 ? '90 MW' : '30 MW');
      add(`bld_ef_furn_${c}_${r}`, fType, `东境大平层·炼炉阵列(${c + 1}-${r + 1})`, pwr, x, 2, z, 0, { recipeId: 'RCP_003' });
      add(`bld_ef_fbelt_${c}_${r}`, 'conveyor', `东境平铺·炉间传送带(${c + 1}-${r + 1})`, '0 MW', x + 5, 2, z, 90, { beltItem: c % 2 === 0 ? 'MAT_006' : 'MAT_007' });
      if (c === 1 && r % 2 === 0) {
        add(`bld_ef_cut_${r}`, 'cutter', `东境平铺·带内切割机#${r + 1}`, '20 MW', x + 5, 2, z + 3, 90);
      }
      if (c === 2 && r % 2 === 1) {
        add(`bld_ef_crush_${r}`, 'crusher', `东境平铺·带内粉碎机#${r + 1}`, '20 MW', x + 5, 2, z - 3, 90);
      }
    });
    add(`bld_ef_asm1_${r}`, 'assembler', `东境大平层·制造台#${r + 1}`, '75 MW', 354, 2, z, 0);
    add(`bld_ef_asm2_${r}`, r % 2 === 0 ? 'assembler_heavy' : 'recomposer_mk3', `东境大平层·重型总装机#${r + 1}`, '180 MW', 368, 2, z, 0);
    add(`bld_ef_merge_${r}`, 'merger', `东境大平层·成品合流器#${r + 1}`, '0 MW', 376, 2, z, 90);
    add(`bld_ef_outbox_${r}`, r % 3 === 0 ? 'bd_114' : (r % 3 === 1 ? 'bd_115' : 'storage_box'), `东境大平层·成品总仓#${r + 1}`, '0 MW', 382, 2, z, 0);
  }
  [-24, 0, 24].forEach((z, i) => {
    add(`bld_ef_crane_${i}`, 'crane_distributor', `东境大平层·千鹤赋能台#${i + 1}`, '60 MW', 346, 2, z, 0);
  });
  add('bld_ef_turret_1', 'bd_160', '东境大平层·飞剑防御塔甲', '25 MW', 388, 0, -52, 0);
  add('bld_ef_turret_2', 'bd_160', '东境大平层·剑丸防御塔乙', '25 MW', 388, 0, 52, 0, { ammoType: 'thunder' });
  add('bld_ef_turret_2_ammo_belt', 'conveyor', '东境大平层·剑丸防御塔乙供弹带', '0 MW', 384, 0, 52, 90, { beltItem: 'mat_102', beltLen: 4 });
  add('bld_ef_sun', 'artificial_sun', '东境平铺·供能小仙阳', '+15000 MW', 346, 2, -46, 0);
  // 东境平铺产线：连续纵向主干总线(z向) + 横向支线(x向) + 外围围墙柱与风光燃发电
  [-36, -24, -12, 0, 12, 24, 36].forEach((bz, bi) => {
    add(`bld_ef_bus_in_${bi}`, 'conveyor', `东境平铺·入炉z向主干总线#${bi + 1}`, '0 MW', 296, 2, bz, 0, { beltItem: bi % 2 === 0 ? 'MAT_001' : 'MAT_002', beltLen: 12 });
    add(`bld_ef_bus_out_${bi}`, 'conveyor', `东境平铺·成品z向合流总线#${bi + 1}`, '0 MW', 379, 2, bz, 0, { beltItem: 'MAT_006', beltLen: 12 });
  });
  for (let r = 0; r < 8; r++) {
    const z = -42 + r * 12;
    add(`bld_ef_branch_in_${r}`, 'conveyor', `东境平铺·入炉支线#${r + 1}`, '0 MW', 300, 2, z, 90, { beltItem: r % 2 === 0 ? 'MAT_001' : 'MAT_002', beltLen: 6 });
    add(`bld_ef_branch_mid_${r}`, 'conveyor', `东境平铺·炉→制造支线#${r + 1}`, '0 MW', 347, 2, z, 90, { beltItem: 'MAT_006', beltLen: 6 });
    add(`bld_ef_branch_asm_${r}`, 'conveyor', `东境平铺·制造→总装支线#${r + 1}`, '0 MW', 361, 2, z, 90, { beltItem: 'MAT_008', beltLen: 6 });
  }
  [290, 314, 338, 362, 386].forEach((px, pi) => {
    add(`bld_ef_wall_n_${pi}`, 'bd_112', `东境平铺·北侧围墙柱#${pi + 1}`, '0 MW', px, 0, -54, 0);
    add(`bld_ef_wall_s_${pi}`, 'bd_112', `东境平铺·南侧围墙柱#${pi + 1}`, '0 MW', px, 0, 54, 0);
  });
  [-30, 0, 30].forEach((pz, pi) => {
    add(`bld_ef_wall_e_${pi}`, 'bd_112', `东境平铺·东侧围墙柱#${pi + 1}`, '0 MW', 390, 0, pz, 0);
  });
  [-40, -16, 16, 40].forEach((wz, wi) => {
    add(`bld_ef_wind_${wi}`, 'wind_generator', `东境平铺·灵风发电机#${wi + 1}`, '+45 MW', 388, 0, wz, 0);
  });
  [-28, 28].forEach((fz, fi) => {
    add(`bld_ef_fuel_${fi}`, 'fuel_generator', `东境平铺·灵燃发电机#${fi + 1}`, '+100 MW', 388, 0, fz, 0);
  });

  // ---------------------------------------------------------------------------
  // 2) 【西境 (距中心 350m) · 极限黑箱版 · 98%空间利用率全封闭高密模块化魔方】
  //    wx: -378..-324, wz: -28..28 (54m×56m 零空隙三层精密黑箱)
  // ---------------------------------------------------------------------------
  add('bld_bb_f1_mega', 'foundation_3x3', '西境黑箱1F高密整板', '0 MW', -350, 0, 0, 0, { slabW: 54, slabD: 54 });
  add('bld_bb_f2_mega', 'foundation_3x3', '西境黑箱2F高密整板', '0 MW', -350, 14, 0, 0, { slabW: 54, slabD: 54, autoPillars: true });
  add('bld_bb_f3_mega', 'foundation_3x3', '西境黑箱3F高密整板', '0 MW', -350, 28, 0, 0, { slabW: 54, slabD: 54, autoPillars: true });
  [[-376, -26], [-376, 26], [-324, -26], [-324, 26], [-350, -26], [-350, 26]].forEach(([px, pz], i) => {
    add(`bld_bb_pil1_${i}`, 'bd_112', `西境黑箱1F·承重柱#${i + 1}`, '0 MW', px, 2, pz, 0);
    add(`bld_bb_pil2_${i}`, 'bd_112', `西境黑箱2F·承重柱#${i + 1}`, '0 MW', px, 16, pz, 0);
  });
  for (let rx = -372; rx <= -328; rx += 14) {
    for (let rz = -18; rz <= 18; rz += 18) {
      add(`bld_bb_roof_${rx}_${rz}`, 'immortal_roof', '西境黑箱3F·封闭琉璃顶', '0 MW', rx, 32, rz, 0);
    }
  }
  [-18, -6, 6, 18].forEach((z, i) => {
    add(`bld_bb_in_lotus_${i}`, 'lotus_catcher', `西境黑箱·原矿输入口#${i + 1}`, '35 MW', -382, 0, z, 0, { beltItem: i < 2 ? 'MAT_002' : 'MAT_001' });
    add(`bld_bb_in_split_${i}`, 'splitter', `西境黑箱·极限分流口#${i + 1}`, '0 MW', -376, 2, z, 90);
    add(`bld_bb_lift_up_${i}`, 'vert_conveyor', `西境黑箱·垂直提升梯#${i + 1}`, '5 MW', -328, 2, z, 0, { liftHeight: 14, beltItem: 'MAT_007' });
    add(`bld_bb_lift_3f_${i}`, 'vert_conveyor', `西境黑箱·2F→3F垂直梯#${i + 1}`, '5 MW', -372, 16, z, 0, { liftHeight: 14, beltItem: 'mat_135' });
  });
  [-10, 10].forEach((z, i) => {
    add(`bld_bb_out_box_${i}`, 'storage_box', `西境黑箱·成品输出总仓#${i + 1}`, '0 MW', -322, 0, z, 0);
    add(`bld_bb_out_cat_${i}`, 'sword_catapult', `西境黑箱·成品飞剑发货台#${i + 1}`, '45 MW', -316, 0, z, 90, { beltItem: 'mat_135', targetLotusId: 'bld_ef_lotus_0' });
  });
  for (let row = 0; row < 4; row++) {
    const z = -18 + row * 12;
    [-366, -356].forEach((x, col) => {
      add(`bld_bb_pwr_${col}_${row}`, 'power_engine', `西境黑箱1F·热能底座(${col}-${row})`, '40 MW', x, 2, z, 0);
      for (let lv = 0; lv < 4; lv++) {
        add(`bld_bb_dan_${col}_${row}_${lv}`, 'bd_163', `西境黑箱1F·叠炉塔#${col}-${row}-${lv + 1}层`, '180 MW', x, 5 + lv * 2, z, 0);
      }
    });
    add(`bld_bb_petri_a_${row}`, 'petri_dish', `西境黑箱1F·高密培养皿A#${row + 1}`, '110 MW', -344, 2, z, 0);
    add(`bld_bb_petri_b_${row}`, 'petri_dish', `西境黑箱1F·高密培养皿B#${row + 1}`, '110 MW', -334, 2, z, 0);
    add(`bld_bb_belt1_${row}`, 'conveyor', `西境黑箱1F·零隙蛇形带#${row + 1}`, '0 MW', -350, 2, z, 90, { beltItem: 'MAT_007' });
    add(`bld_bb_cut_${row}`, 'cutter', `西境黑箱1F·直装切割机#${row + 1}`, '20 MW', -339, 2, z, 90);
  }
  for (let r = 0; r < 4; r++) {
    const z = -18 + r * 12;
    [-366, -356, -346, -336].forEach((x, c) => {
      add(`bld_bb_recomp_${c}_${r}`, 'recomposer_mk3', `西境黑箱2F·重构魔方(${c}-${r})`, '340 MW', x, 16, z, 0, { recipeId: 'RCP_010' });
    });
    add(`bld_bb_alc2_${r}`, 'alchemy_furnace_mk2', `西境黑箱2F·金丹密室炉#${r + 1}`, '280 MW', -330, 16, z, 0, { recipeId: 'RCP_035' });
  }
  add('bld_v25_altar_01', 'research_altar', '西境黑箱2F·天机推演中枢', '25 MW', -350, 16, 0, 0);
  add('bld_demo_pole_w1', 'power_engine', '西境黑箱2F·灵网总枢', '+600 MW', -350, 16, 6, 0);
  add('bld_bb_sun_1', 'artificial_sun', '西境黑箱3F·小仙阳甲', '+15000 MW', -362, 30, -10, 0);
  add('bld_bb_sun_2', 'artificial_sun', '西境黑箱3F·小仙阳乙', '+15000 MW', -338, 30, 10, 0);
  for (let i = 0; i < 8; i++) {
    add(`bld_bb_acc_${i}`, 'thunder_accumulator', `西境黑箱3F·高密雷池#${i + 1}`, '+1200 MW', -368 + (i % 4) * 12, 30, i < 4 ? 14 : -14, 0);
  }
  [-12, 0, 12].forEach((z, i) => {
    add(`bld_bb_crane_${i}`, 'crane_distributor', `西境黑箱3F·千鹤赋能枢#${i + 1}`, '60 MW', -350, 30, z, 0);
  });
  // 西境黑箱98%空间利用率：1F/2F/3F 内部密集传送带与垂直电梯填满空隙
  for (let row = 0; row < 4; row++) {
    const z = -18 + row * 12;
    add(`bld_bb_1f_b1_${row}`, 'conveyor', `西境黑箱1F·进料密集带A#${row + 1}`, '0 MW', -371, 2, z, 90, { beltItem: 'MAT_001', beltLen: 6 });
    add(`bld_bb_1f_b2_${row}`, 'conveyor', `西境黑箱1F·炉间密集带B#${row + 1}`, '0 MW', -361, 2, z, 90, { beltItem: 'MAT_006', beltLen: 6 });
    add(`bld_bb_1f_b3_${row}`, 'conveyor', `西境黑箱1F·出料密集带C#${row + 1}`, '0 MW', -331, 2, z, 90, { beltItem: 'MAT_007', beltLen: 6 });
    add(`bld_bb_2f_b1_${row}`, 'conveyor', `西境黑箱2F·重构传输带A#${row + 1}`, '0 MW', -361, 16, z, 90, { beltItem: 'MAT_007', beltLen: 6 });
    add(`bld_bb_2f_b2_${row}`, 'conveyor', `西境黑箱2F·重构传输带B#${row + 1}`, '0 MW', -351, 16, z, 90, { beltItem: 'MAT_008', beltLen: 6 });
    add(`bld_bb_2f_b3_${row}`, 'conveyor', `西境黑箱2F·炼丹汇流带C#${row + 1}`, '0 MW', -341, 16, z, 90, { beltItem: 'mat_135', beltLen: 6 });
  }
  [-12, 0, 12].forEach((z, i) => {
    add(`bld_bb_1f_zbus_a_${i}`, 'conveyor', `西境黑箱1F·纵向调度带A#${i + 1}`, '0 MW', -361, 2, z, 0, { beltItem: 'MAT_006', beltLen: 10 });
    add(`bld_bb_1f_zbus_b_${i}`, 'conveyor', `西境黑箱1F·纵向调度带B#${i + 1}`, '0 MW', -339, 2, z, 0, { beltItem: 'MAT_007', beltLen: 10 });
    add(`bld_bb_2f_zbus_a_${i}`, 'conveyor', `西境黑箱2F·纵向总控带A#${i + 1}`, '0 MW', -370, 16, z, 0, { beltItem: 'mat_135', beltLen: 10 });
    add(`bld_bb_2f_zbus_b_${i}`, 'conveyor', `西境黑箱2F·纵向总控带B#${i + 1}`, '0 MW', -326, 16, z, 0, { beltItem: 'MAT_008', beltLen: 10 });
    add(`bld_bb_lift_mid_${i}`, 'vert_conveyor', `西境黑箱·1F→2F中继垂直梯#${i + 1}`, '5 MW', -332, 2, z, 0, { liftHeight: 14, beltItem: 'MAT_008' });
  });
  [-12, 12].forEach((z, i) => {
    add(`bld_bb_lift_top_${i}`, 'vert_conveyor', `西境黑箱·2F→3F中继垂直梯#${i + 1}`, '5 MW', -362, 16, z, 0, { liftHeight: 14, beltItem: 'mat_135' });
  });
  [-364, -350, -336].forEach((x, i) => {
    add(`bld_bb_3f_bus_n_${i}`, 'conveyor', `西境黑箱3F·顶层北环带#${i + 1}`, '0 MW', x, 30, -18, 90, { beltItem: 'mat_135', beltLen: 12 });
    add(`bld_bb_3f_bus_s_${i}`, 'conveyor', `西境黑箱3F·顶层南环带#${i + 1}`, '0 MW', x, 30, 18, 90, { beltItem: 'mat_135', beltLen: 12 });
  });
  [[-372, -20], [-372, 20], [-328, -20], [-328, 20]].forEach(([bx, bz], i) => {
    add(`bld_bb_3f_box_${i}`, 'storage_box', `西境黑箱3F·角隅缓冲仓#${i + 1}`, '0 MW', bx, 30, bz, 0);
  });
  // 西境黑箱1F(wy=2)与2F(wy=16)四周外边缘紧凑补满设备与仓储，消除半透明外壳透视空旷感
  const bbEdgeMachines = [
    { type: 'entropy_smelter', label: '熵增熔炉', power: '220 MW' },
    { type: 'recomposer_mk3', label: '重构魔方', power: '340 MW' },
    { type: 'alchemy_furnace_mk2', label: '金丹炉', power: '280 MW' },
    { type: 'bd_114', label: '重型储仓', power: '0 MW' },
    { type: 'bd_115', label: '灵材货架', power: '0 MW' }
  ];
  const bbEdgeCoords = [];
  [-372, -328].forEach((ex) => {
    [-22, -14, -10, -2, 2, 10, 14, 22].forEach((ez) => bbEdgeCoords.push([ex, ez]));
  });
  [-22, 22].forEach((ez) => {
    [-366, -360, -354, -348, -342, -334].forEach((ex) => bbEdgeCoords.push([ex, ez]));
  });
  [2, 16].forEach((fy, fi) => {
    const floorTag = fi === 0 ? '1F' : '2F';
    bbEdgeCoords.forEach(([ex, ez], idx) => {
      const m = bbEdgeMachines[(idx + fi * 2) % bbEdgeMachines.length];
      add(`bld_bb_edge_${floorTag}_${idx}`, m.type, `西境黑箱${floorTag}边缘·${m.label}#${idx + 1}`, m.power, ex, fy, ez, 0);
    });
  });

  // ---------------------------------------------------------------------------
  // 3) 【南境 (距中心 385m) · 一层巨幅生态园林 + 北侧局部二层退台 · 灵植万兽化工城】
  //    wx: -60..60, wz: 340..430
  // ---------------------------------------------------------------------------
  add('bld_se_f1_mega', 'foundation_3x3', '南境生态城1F整板', '0 MW', 0, 0, 385, 0, { slabW: 114, slabD: 86 });
  for (let i = 0; i < 6; i++) {
    const x = -45 + i * 18;
    add(`bld_se_herb_a_${i}`, 'immortal_herb_garden', `南境1F·灵药圃A#${i + 1}`, '90 MW', x, 2, 382, 0);
    add(`bld_se_herb_b_${i}`, 'immortal_herb_garden', `南境1F·灵药圃B#${i + 1}`, '90 MW', x, 2, 396, 0);
    if (i < 4) {
      add(`bld_se_beast_a_${i}`, 'beast_immortal_pool', `南境1F·万兽仙池A#${i + 1}`, '150 MW', -36 + i * 24, 2, 412, 0);
      add(`bld_se_beast_b_${i}`, 'beast_immortal_pool', `南境1F·万兽仙池B#${i + 1}`, '150 MW', -36 + i * 24, 2, 424, 0);
    }
  }
  for (let i = 0; i < 10; i++) {
    const x = -45 + i * 10;
    add(`bld_se_pump_${i}`, 'pump', `南境1F·高扬程灵液泵#${i + 1}`, '25 MW', x, 2, 434, 0);
    add(`bld_se_purify_${i}`, 'purifier', `南境1F·化煞净化塔#${i + 1}`, '180 MW', x, 2, 370, 0);
    add(`bld_se_pipe_a_${i}`, 'pipe', `南境1F·灵液主干管A#${i + 1}`, '0 MW', x, 2, 376, 90);
    add(`bld_se_pipe_b_${i}`, 'pipe', `南境1F·灵液主干管B#${i + 1}`, '0 MW', x, 2, 404, 90);
  }
  [-30, 0, 30].forEach((x, i) => {
    add(`bld_se_lotus_${i}`, 'lotus_catcher', `南境生态城·飞剑收货台#${i + 1}`, '35 MW', x, 0, 338, 0, { beltItem: 'mat_135' });
  });
  add('bld_se_f2_mega', 'foundation_3x3', '南境生态城2F退台整板', '0 MW', 0, 14, 354, 0, { slabW: 90, slabD: 18, autoPillars: true });
  for (let i = 0; i < 8; i++) {
    const x = -42 + i * 12;
    add(`bld_se_alc2_${i}`, 'alchemy_furnace_mk2', `南境2F退台·九转金丹炉#${i + 1}`, '280 MW', x, 16, 352, 0, { recipeId: 'RCP_035' });
    if (i < 6) {
      add(`bld_se_desk_${i}`, 'storage_desk', `南境2F退台·灵药样品台#${i + 1}`, '0 MW', -30 + i * 12, 16, 360, 0, { displayItem: 'mat_135' });
    }
  }
  [-24, 0, 24].forEach((x, i) => {
    add(`bld_se_crane_${i}`, 'crane_distributor', `南境2F退台·千鹤赋能台#${i + 1}`, '60 MW', x, 16, 356, 0);
  });
  add('bld_se_sun', 'artificial_sun', '南境2F退台·生态小仙阳', '+15000 MW', 46, 16, 352, 0);
  // 南境生态城：补全灵液支管、收货传送带、2F垂直梯与储物/园林装饰
  for (let i = 0; i < 10; i++) {
    const x = -45 + i * 10;
    add(`bld_se_pipe_c_${i}`, 'pipe', `南境1F·灵液生态支管A#${i + 1}`, '0 MW', x, 2, 389, 0);
    add(`bld_se_pipe_d_${i}`, 'pipe', `南境1F·灵液生态支管B#${i + 1}`, '0 MW', x, 2, 418, 0);
  }
  [-30, 0, 30].forEach((x, i) => {
    add(`bld_se_belt_in_${i}`, 'conveyor', `南境1F·生态进料主带#${i + 1}`, '0 MW', x, 2, 342, 0, { beltItem: 'mat_135', beltLen: 6 });
    add(`bld_se_lift_${i}`, 'vert_conveyor', `南境1F→2F·灵植提升梯#${i + 1}`, '5 MW', x, 2, 346, 0, { liftHeight: 14, beltItem: 'mat_135' });
    add(`bld_se_belt_2f_${i}`, 'conveyor', `南境2F·金丹分配带#${i + 1}`, '0 MW', x, 16, 350, 0, { beltItem: 'mat_135', beltLen: 4 });
  });
  [-40, -24, -8, 8, 24, 40].forEach((x, i) => {
    add(`bld_se_store_${i}`, i % 3 === 0 ? 'bd_114' : (i % 3 === 1 ? 'bd_115' : 'storage_box'), `南境1F·灵植成品储箱#${i + 1}`, '0 MW', x, 2, 364, 0);
  });
  [350, 375, 400, 425].forEach((pz, pi) => {
    add(`bld_se_pil_w_${pi}`, 'bd_112', `南境生态城·西翼景柱#${pi + 1}`, '0 MW', -56, 0, pz, 0);
    add(`bld_se_pil_e_${pi}`, 'bd_112', `南境生态城·东翼景柱#${pi + 1}`, '0 MW', 56, 0, pz, 0);
  });

  // ---------------------------------------------------------------------------
  // 4) 【北境 (距中心 410m) · 宏伟三层退台金字塔 · 周天星斗雷池方阵与破界飞升中心】
  //    wx: -60..60, wz: -460..-360
  // ---------------------------------------------------------------------------
  add('bld_nw_f1_mega', 'foundation_3x3', '北境金字塔1F整板', '0 MW', 0, 0, -410, 0, { slabW: 114, slabD: 96 });
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    add(`bld_nw_acc_${i}`, 'thunder_accumulator', `北境1F·渡劫雷池#${i + 1}`, '+1200 MW', -48 + col * 24, 2, -448 + row * 24, 0);
  }
  for (let i = 0; i < 6; i++) {
    const x = -45 + i * 18;
    add(`bld_nw_fus_${i}`, 'fusion_reactor', `北境1F·金乌聚变堆#${i + 1}`, '+4500 MW', x, 2, -436, 0);
    add(`bld_nw_col_${i}`, i % 2 === 0 ? 'particle_collider' : 'bd_154', `北境1F·对撞奇点阵#${i + 1}`, '1200 MW', x, 2, -388, 0);
    add(`bld_nw_rec_${i}`, 'immortal_receiver', `北境1F·仙光引雷台#${i + 1}`, '+5000 MW', x, 2, -372, 0);
  }
  [-24, 0, 24].forEach((x, i) => {
    add(`bld_nw_lotus_${i}`, 'lotus_catcher', `北境金字塔·飞剑收货台#${i + 1}`, '35 MW', x, 0, -356, 0, { beltItem: 'mat_102' });
  });
  add('bld_nw_f2_mega', 'foundation_3x3', '北境金字塔2F整板', '0 MW', 0, 14, -410, 0, { slabW: 66, slabD: 54, autoPillars: true });
  for (let i = 0; i < 8; i++) {
    const x = -28 + (i % 4) * 18;
    const z = i < 4 ? -430 : -390;
    add(`bld_nw_ej_${i}`, 'banner_ejector', `北境2F·星斗阵旗弹射器#${i + 1}`, '300 MW', x, 16, z, 0);
  }
  [-18, 18].forEach((x, i) => {
    add(`bld_nw_launch_a_${i}`, 'sky_launcher', `北境2F·渡劫飞升台A#${i + 1}`, '600 MW', x, 16, -410, 0);
  });
  add('bld_nw_f3_mega', 'foundation_3x3', '北境金字塔3F整板', '0 MW', 0, 28, -410, 0, { slabW: 42, slabD: 22, autoPillars: true });
  [-16, 0, 16].forEach((x, i) => {
    add(`bld_nw_silo_${i}`, 'ascension_silo', `北境3F·破界飞升发射井#${i + 1}`, '2500 MW', x, 30, -410, 0);
  });
  add('bld_nw_sun_1', 'artificial_sun', '北境3F·飞升小仙阳甲', '+15000 MW', -14, 30, -400, 0);
  add('bld_nw_sun_2', 'artificial_sun', '北境3F·飞升小仙阳乙', '+15000 MW', 14, 30, -400, 0);
  add('bld_nw_crane_1', 'crane_distributor', '北境3F·护法千鹤台甲', '60 MW', -10, 30, -420, 0);
  add('bld_nw_crane_2', 'crane_distributor', '北境3F·护法千鹤台乙', '60 MW', 10, 30, -420, 0);
  // 北境金字塔：补全1F/2F传送带、冷却管道、垂直电梯、弹药储箱与外围方尖碑柱
  [-24, 0, 24].forEach((x, i) => {
    add(`bld_nw_belt_in_${i}`, 'conveyor', `北境1F·灵石进料带#${i + 1}`, '0 MW', x, 2, -366, 0, { beltItem: 'mat_102', beltLen: 14 });
    add(`bld_nw_belt_col_${i}`, 'conveyor', `北境1F·奇点供料带#${i + 1}`, '0 MW', x, 2, -380, 0, { beltItem: 'mat_102', beltLen: 10 });
  });
  for (let i = 0; i < 7; i++) {
    add(`bld_nw_pipe_${i}`, 'pipe', `北境1F·聚变冷却管#${i + 1}`, '0 MW', -45 + i * 15, 2, -430, 90);
  }
  [-24, 24].forEach((x, i) => {
    add(`bld_nw_lift_1f_${i}`, 'vert_conveyor', `北境1F→2F·星斗提升梯#${i + 1}`, '5 MW', x, 2, -396, 0, { liftHeight: 14, beltItem: 'mat_102' });
  });
  [-12, 12].forEach((x, i) => {
    add(`bld_nw_lift_2f_${i}`, 'vert_conveyor', `北境2F→3F·飞升提升梯#${i + 1}`, '5 MW', x, 16, -410, 0, { liftHeight: 14, beltItem: 'mat_102' });
  });
  [-18, 0, 18].forEach((x, i) => {
    add(`bld_nw_2f_bn_${i}`, 'conveyor', `北境2F·北翼弹药环带#${i + 1}`, '0 MW', x, 16, -424, 90, { beltItem: 'mat_102', beltLen: 14 });
    add(`bld_nw_2f_bs_${i}`, 'conveyor', `北境2F·南翼弹药环带#${i + 1}`, '0 MW', x, 16, -396, 90, { beltItem: 'mat_102', beltLen: 14 });
  });
  [[-28, -420], [-28, -400], [28, -420], [28, -400]].forEach(([bx, bz], i) => {
    add(`bld_nw_2f_side_${i}`, 'conveyor', `北境2F·侧翼连通带#${i + 1}`, '0 MW', bx, 16, bz, 0, { beltItem: 'mat_102', beltLen: 10 });
  });
  [[-32, -426], [32, -426], [-32, -394], [32, -394]].forEach(([sx, sz], i) => {
    add(`bld_nw_2f_box_${i}`, 'storage_box', `北境2F·星斗备弹仓#${i + 1}`, '0 MW', sx, 16, sz, 0);
  });
  [-36, -12, 12, 36].forEach((dx, i) => {
    add(`bld_nw_desk_${i}`, 'storage_desk', `北境1F·星斗仪轨展台#${i + 1}`, '0 MW', dx, 2, -364, 0, { displayItem: 'mat_102' });
  });
  [-452, -422, -392, -368].forEach((pz, pi) => {
    add(`bld_nw_pil_w_${pi}`, 'bd_112', `北境金字塔·西翼方尖柱#${pi + 1}`, '0 MW', -56, 0, pz, 0);
    add(`bld_nw_pil_e_${pi}`, 'bd_112', `北境金字塔·东翼方尖柱#${pi + 1}`, '0 MW', 56, 0, pz, 0);
  });

  // ---------------------------------------------------------------------------
  // 5) 【四大极远境巨型矿山与飞剑重载列车始发枢纽（距中心 660m ~ 680m）】
  // ---------------------------------------------------------------------------
  const mineHubs = [
    { key: 'fe', mx: 660, mz: -160, dir: 270, ore: 'MAT_001', label: '极远东·玄铁巨矿场', targetLotus: 'bld_ef_lotus_0', rails: [[520, -100], [400, -50]] },
    { key: 'cu', mx: -660, mz: 160, dir: 90, ore: 'MAT_002', label: '极远西·赤铜巨矿场', targetLotus: 'bld_bb_in_lotus_0', rails: [[-520, 100], [-420, 40]] },
    { key: 'ls', mx: 160, mz: 660, dir: 180, ore: 'mat_102', label: '极远南·灵石巨矿场', targetLotus: 'bld_se_lotus_1', rails: [[100, 520], [40, 420]] },
    { key: 'lt', mx: -160, mz: -660, dir: 0, ore: 'MAT_006', label: '极远北·灵铁巨矿场', targetLotus: 'bld_nw_lotus_1', rails: [[-100, -520], [-40, -430]] }
  ];
  mineHubs.forEach((mh) => {
    for (let i = 0; i < 6; i++) {
      const off = (i - 2.5) * 10;
      const px = (mh.dir === 270 || mh.dir === 90) ? mh.mx : mh.mx + off;
      const pz = (mh.dir === 270 || mh.dir === 90) ? mh.mz + off : mh.mz;
      add(`bld_fm_${mh.key}_m_${i}`, i < 4 ? 'heavy_miner' : 'miner', `${mh.label}·矿机#${i + 1}`, i < 4 ? '120 MW' : '40 MW', px, 0, pz, mh.dir);
    }
    const dx = mh.dir === 270 ? -12 : (mh.dir === 90 ? 12 : 0);
    const dz = mh.dir === 180 ? -12 : (mh.dir === 0 ? 12 : 0);
    add(`bld_fm_${mh.key}_merge`, 'merger', `${mh.label}·装车合流器`, '0 MW', mh.mx + dx, 0, mh.mz + dz, mh.dir);
    add(`bld_fm_${mh.key}_belt`, 'conveyor', `${mh.label}·装车高速带`, '0 MW', mh.mx + dx * 1.5, 0, mh.mz + dz * 1.5, mh.dir, { beltItem: mh.ore });
    add(`bld_fm_${mh.key}_box`, 'storage_box', `${mh.label}·满载总仓`, '0 MW', mh.mx + dx * 2, 0, mh.mz + dz * 2, 0);
    add(`bld_fm_${mh.key}_cat1`, 'sword_catapult', `${mh.label}·飞剑重载发货台甲`, '45 MW', mh.mx + dx * 2.5, 0, mh.mz + dz * 2.5, mh.dir, { beltItem: mh.ore, targetLotusId: mh.targetLotus });
    add(`bld_fm_${mh.key}_cat2`, 'sword_catapult', `${mh.label}·飞剑重载发货台乙`, '45 MW', mh.mx + dx * 2.5 + 8, 0, mh.mz + dz * 2.5 + 8, mh.dir, { beltItem: mh.ore, targetLotusId: mh.targetLotus });
    mh.rails.forEach(([rx, rz], ri) => {
      add(`bld_fm_${mh.key}_rail_${ri}`, 'sky_rail', `${mh.label}·飞剑航线桩#${ri + 1}`, '10 MW', rx, 0, rz, 0);
    });
  });

  // ---------------------------------------------------------------------------
  // 6) 【252米跨区长距三联传送带高速路演示 (wx: 35 → 277, wz: 46 / 50 / 54)】
  //    单段实际长度 beltLen=16m，段间距同步设为16m，15段×3车道首尾相接无断档
  // ---------------------------------------------------------------------------
  add('bld_bh_split_start', 'splitter', '长距传送带·中央东出口总分流器', '0 MW', 35, 0, 50, 90);
  const highwayLanes = [
    { z: 46, item: 'MAT_001', label: 'A线(玄铁矿)' },
    { z: 50, item: 'MAT_002', label: 'B线(赤铜矿)' },
    { z: 54, item: 'MAT_006', label: 'C线(玄铁锭)' }
  ];
  for (let x = 44; x <= 268; x += 16) {
    add(`bld_bh_bridge_${x}`, 'foundation_3x3', '长距传送带·高架承托台面', '0 MW', x, 0, 50, 0);
    highwayLanes.forEach((ln, li) => {
      const bType = li === 2 ? 'conveyor' : 'conveyor';
      add(`bld_bh_seg_${li}_${x}`, bType, `252m长距传送带·${ln.label}`, '0 MW', x, 2, ln.z, 90, { beltItem: ln.item, beltLen: 16 });
    });
  }
  add('bld_bh_merge_end', 'merger', '长距传送带·东境入场总合流器', '0 MW', 277, 0, 50, 90);
})();
