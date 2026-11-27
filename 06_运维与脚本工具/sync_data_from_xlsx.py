#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 02_数值与配置数据表/ 下的八张标准 Excel 表全量同步生成 xiuxian_data.js：
  - item_table.xlsx (148 项物料)
  - bd_table.xlsx (103 座建筑定义)
  - recipe_table.xlsx (188 条纯合成配方：123 主线 + 65 古修秘传替方)
  - facility_rule_table.xlsx (52 条设施运转机制：采矿/发电/科研/尸解/防御/物流充放)
  - relic_scroll_table.xlsx (65 条古修残卷与探索三选一映射)
  - ue5_building_merge_table.xlsx (103 网格 -> 78 座 UE5 独立主资产工程归并)
  - fabao_table.xlsx (法宝成长与双循环配置)
  - world_map_poi_table.xlsx (13 座大地图据点与宗门藏经阁配置)
"""

import json
import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "02_数值与配置数据表"
OUT_JS = ROOT / "xiuxian_data.js"


def read_xlsx_sheet1(path: Path):
    with zipfile.ZipFile(path) as z:
        ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
        sst = []
        if "xl/sharedStrings.xml" in z.namelist():
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.findall("m:si", ns):
                sst.append(
                    "".join(
                        t.text or ""
                        for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    )
                )
        sroot = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
        rows = []
        for r in sroot.findall(".//m:row", ns):
            row = {}
            for c in r.findall("m:c", ns):
                ref = re.match(r"([A-Z]+)", c.attrib["r"]).group(1)
                col = 0
                for ch in ref:
                    col = col * 26 + (ord(ch) - 64)
                t = c.attrib.get("t")
                v = c.find("m:v", ns)
                is_el = c.find("m:is", ns)
                val = ""
                if t == "s" and v is not None:
                    val = sst[int(v.text)]
                elif t == "inlineStr" and is_el is not None:
                    val = "".join(
                        x.text or ""
                        for x in is_el.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                    )
                elif v is not None:
                    val = v.text
                row[col] = val.strip() if isinstance(val, str) else val
            if row:
                maxc = max(row.keys())
                rows.append([row.get(i, "") for i in range(1, maxc + 1)])
        return rows


def load_existing_xiuxian_data():
    script = """
    const d = require('./xiuxian_data.js');
    console.log(JSON.stringify({
      items: d.XIUXIAN_ITEMS || {},
      buildings: d.XIUXIAN_BUILDINGS || {},
      recipes: d.XIUXIAN_RECIPES || {},
      bdCanon: d.XIUXIAN_BUILDING_CANONICAL_IDS || {},
      rcpCanon: d.XIUXIAN_RECIPE_CANONICAL_IDS || {},
      inv: d.INITIAL_PLAYER_INVENTORY || [],
      tiers: d.XIUXIAN_TIERS || [],
      stages: d.XIUXIAN_STAGES || {}
    }));
    """
    res = subprocess.run(
        ["node", "-e", script],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
    )
    return json.loads(res.stdout)


def parse_float(val, default=0):
    try:
        if val in ("", "-", None):
            return default
        f = float(val)
        return int(f) if f.is_integer() else f
    except Exception:
        return default


def main():
    existing = load_existing_xiuxian_data()
    old_items = existing["items"]
    old_buildings = existing["buildings"]
    old_recipes = existing["recipes"]

    # 1. 构建旧名称 -> 旧key 映射，保留前端兼容键名
    mat_id_to_old_key = {}
    name_to_item_key = {}
    for k, v in old_items.items():
        if v.get("matId"):
            mat_id_to_old_key[v["matId"]] = k
        if v.get("name"):
            name_to_item_key[v["name"]] = k

    bd_id_to_old_key = dict(
        (v, k) for k, v in existing["bdCanon"].items()
    )
    name_to_bd_key = {}
    for k, v in old_buildings.items():
        if v.get("name"):
            name_to_bd_key[v["name"]] = k

    # ------------------------------------------------------------------
    # 2. 解析 item_table.xlsx
    # ------------------------------------------------------------------
    item_rows = read_xlsx_sheet1(DATA_DIR / "item_table.xlsx")[2:]
    new_items = {}
    mat_id_to_key = {}

    explicit_item_icons = {
        "MAT_129": "fa-solid fa-spray-can-sparkles text-emerald-300",
        "MAT_130": "fa-solid fa-droplet text-amber-400",
        "MAT_131": "fa-solid fa-pills text-cyan-300",
        "MAT_132": "fa-solid fa-gem text-fuchsia-300",
        "MAT_133": "fa-solid fa-scroll text-stone-300",
        "MAT_134": "fa-solid fa-scroll text-emerald-300",
        "MAT_135": "fa-solid fa-box-open text-amber-300",
        "MAT_136": "fa-solid fa-stamp text-purple-300",
        "MAT_137": "fa-solid fa-compass text-cyan-300",
        "MAT_138": "fa-solid fa-sun text-yellow-300",
        "MAT_139": "fa-solid fa-bolt text-amber-400",
        "MAT_140": "fa-solid fa-skull text-rose-300",
        "MAT_141": "fa-solid fa-atom text-fuchsia-400",
        "MAT_142": "fa-solid fa-flag text-cyan-300",
        "MAT_143": "fa-solid fa-shuttle-space text-amber-300",
        "MAT_144": "fa-solid fa-star text-yellow-200",
        "MAT_145": "fa-solid fa-microchip text-emerald-300",
        "MAT_146": "fa-solid fa-feather-pointed text-amber-200",
        "MAT_147": "fa-solid fa-battery-empty text-slate-300",
        "MAT_148": "fa-solid fa-battery-full text-emerald-300",
    }

    for r in item_rows:
        if not r or not r[0].startswith("MAT_"):
            continue
        mat_id = r[0]
        name = r[1] if len(r) > 1 else mat_id
        category = r[2] if len(r) > 2 else "其他"
        form = r[3] if len(r) > 3 else "实体"
        obtain = r[4] if len(r) > 4 else ""
        usage = r[5] if len(r) > 5 else ""
        stack = parse_float(r[6] if len(r) > 6 else 100, 100)

        key = mat_id_to_old_key.get(mat_id) or name_to_item_key.get(name) or mat_id.lower()
        old_obj = old_items.get(key, {})
        default_icon = explicit_item_icons.get(
            mat_id,
            "fa-solid fa-droplet text-cyan-400"
            if form == "液体"
            else "fa-solid fa-cube text-stone-300",
        )
        new_items[key] = {
            "id": key,
            "matId": mat_id,
            "name": name,
            "category": category,
            "form": form,
            "icon": old_obj.get("icon", default_icon),
            "obtainDesc": obtain,
            "desc": usage or old_obj.get("desc", ""),
            "stack": stack,
        }
        mat_id_to_key[mat_id] = key

    # ------------------------------------------------------------------
    # 3. 解析 bd_table.xlsx
    # ------------------------------------------------------------------
    bd_rows = read_xlsx_sheet1(DATA_DIR / "bd_table.xlsx")[2:]
    new_buildings = {}
    bd_id_to_key = {}
    bd_canon_ids = {}

    # 固定关键建筑键名映射，确保与 3D 场景及 machines.js 兼容
    explicit_bd_keys = {
        "BD_102": "foundation_1x1",
        "BD_103": "foundation_pillar",
        "BD_104": "foundation_2x2",
        "BD_105": "foundation_3x3",
        "BD_106": "foundation_beam",
        "BD_107": "foundation_roof",
        "BD_113": "storage_box",
        "BD_116": "conveyor",
        "BD_121": "vert_conveyor",
        "BD_123": "merger",
        "BD_124": "splitter",
        "BD_127": "conveyor_limiter",
        "BD_128": "pipe",
        "BD_134": "pump",
        "BD_135": "miner",
        "BD_136": "furnace",
        "BD_137": "crusher",
        "BD_138": "assembler",
        "BD_139": "cutter",
        "BD_140": "deconstructor",
        "BD_141": "petri_dish",
        "BD_142": "incubator",
        "BD_143": "mixer",
        "BD_144": "centrifuge",
        "BD_145": "extractor",
        "BD_146": "assembler_heavy",
        "BD_147": "power_engine",
        "BD_148": "smelt_chamber",
        "BD_149": "fuel_generator",
        "BD_150": "purifier",
        "BD_151": "teleporter",
        "BD_152": "handcraft",
        "BD_153": "storage_desk",
        "BD_155": "wind_generator",
        "BD_156": "alchemy_table",
        "BD_157": "tribulation_table",
        "BD_158": "fluid_hub",
        "BD_159": "bio_base",
        "BD_164": "wood_nursery",
        "BD_165": "fluid_tank",
        "BD_166": "waste_incinerator",
        "BD_167": "printer",
        "BD_168": "beast_pen",
        "BD_169": "sky_rail",
        "BD_170": "sky_merger",
        "BD_171": "sky_splitter",
        "BD_172": "sky_launcher",
        "BD_173": "sky_loader",
        "BD_174": "sky_unloader",
        "BD_175": "sky_transfer",
        "BD_176": "sky_receiver",
        "BD_177": "belt_sprayer",
        "BD_178": "void_crucible",
        "BD_179": "research_altar",
        "BD_180": "conveyor_mk2",
        "BD_181": "belt_stacker",
        "BD_182": "conveyor_mk3",
        "BD_183": "heavy_miner",
        "BD_184": "sky_extractor",
        "BD_185": "furnace_mk2",
        "BD_186": "omni_assembler",
        "BD_187": "alchemy_furnace_mk2",
        "BD_188": "entropy_smelter",
        "BD_189": "recomposer_mk3",
        "BD_190": "battle_base",
        "BD_191": "thunder_turret",
        "BD_192": "fusion_reactor",
        "BD_193": "artificial_sun",
        "BD_194": "particle_collider",
        "BD_195": "banner_ejector",
        "BD_196": "ascension_silo",
        "BD_197": "immortal_receiver",
        "BD_198": "crane_distributor",
        "BD_199": "sword_catapult",
        "BD_200": "lotus_catcher",
        "BD_201": "immortal_roof",
        "BD_202": "cloud_corridor",
        "BD_203": "floating_platform",
        "BD_204": "thunder_accumulator",
        "BD_205": "immortal_herb_garden",
        "BD_206": "beast_immortal_pool",
    }

    for r in bd_rows:
        if not r or not r[0].startswith("BD_"):
            continue
        bd_id = r[0]
        name = r[1] if len(r) > 1 else bd_id
        desc = r[2] if len(r) > 2 else ""
        cat = r[3] if len(r) > 3 else "建筑"
        use_cat = r[4] if len(r) > 4 else ""
        dim_x = parse_float(r[5] if len(r) > 5 else 1, 1)
        dim_y = parse_float(r[6] if len(r) > 6 else 1, 1)
        dim_z = parse_float(r[7] if len(r) > 7 else 1, 1)
        top_stack = (r[8] if len(r) > 8 else "") == "是"
        rot_step = parse_float(r[9] if len(r) > 9 else 0, 0)
        power_use = parse_float(r[10] if len(r) > 10 else 0, 0)
        power_gen = parse_float(r[11] if len(r) > 11 else 0, 0)
        power_radius = parse_float(r[12] if len(r) > 12 else 0, 0)
        heat = parse_float(r[13] if len(r) > 13 else 0, 0)
        container_slots = parse_float(r[14] if len(r) > 14 else 0, 0)
        cost_str = r[15] if len(r) > 15 else ""
        unlock_cond = r[16] if len(r) > 16 else ""
        in_ports = r[17] if len(r) > 17 else "-"
        out_ports = r[18] if len(r) > 18 else "-"
        plugin_slot = r[19] if len(r) > 19 else "无"
        can_place_raw = (r[20] if len(r) > 20 else "") == "是"
        occupancy_mode = (r[21] if len(r) > 21 and r[21] else "体积占格")

        key = (
            explicit_bd_keys.get(bd_id)
            or bd_id_to_old_key.get(bd_id)
            or name_to_bd_key.get(name)
            or bd_id.lower()
        )
        old_obj = old_buildings.get(key, {})

        # 解析建造成本 MAT_006×12;MAT_008×6
        costs = []
        for seg in [s.strip() for s in cost_str.split(";") if s.strip()]:
            if "×" in seg:
                cid, cnt = seg.split("×", 1)
            elif "*" in seg:
                cid, cnt = seg.split("*", 1)
            else:
                cid, cnt = seg, "1"
            cid = cid.strip()
            item_code = mat_id_to_key.get(cid, cid.lower())
            costs.append({"code": item_code, "need": parse_float(cnt, 1)})

        net_power = -power_gen if power_gen > 0 else power_use

        # 严格归一化到 [Q] 建造菜单的 5 个有效分页: prod / logi / power / org / special
        if bd_id in ("BD_156", "BD_157", "BD_160", "BD_190", "BD_191", "BD_194", "BD_195", "BD_196"):
            grp = "special"
        elif bd_id in ("BD_147", "BD_149", "BD_155", "BD_192", "BD_193", "BD_197", "BD_204") or use_cat == "能源":
            grp = "power"
        elif cat in ("传送带", "垂直传送带", "管道", "天轨") or bd_id in ("BD_127", "BD_151", "BD_181", "BD_198", "BD_199", "BD_200"):
            grp = "logi"
        elif cat in ("结构", "仓储"):
            grp = "org"
        else:
            grp = "prod"

        # 从 bd_table.xlsx 字段推导出完整放置规则
        if bd_id in ("BD_135", "BD_183"):
            placement_rule = "ore_node"
            placement_target = ["ore_node"]
            placement_desc = "仅限原始地图矿脉节点（玄铁/赤铜/煤/石英/灵石矿）上放置；体积占格；顶部不可放"
        elif bd_id == "BD_134":
            placement_rule = "water_node"
            placement_target = ["water_node"]
            placement_desc = "仅限原始地图水源/液源节点（清水/原油/灵泉）上放置；体积占格；顶部可放"
        elif cat == "带处理器":
            placement_rule = "belt_processor"
            placement_target = ["conveyor", "conveyor_mk2", "conveyor_mk3", "bd_117", "bd_118", "bd_119", "bd_120"]
            placement_desc = "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座"
        elif cat == "插槽" and "生物" in use_cat:
            placement_rule = "slot_bio"
            placement_target = ["bio_base"]
            placement_desc = "生物插件：必须插入【营养基座 (BD_159)】顶部插槽，严禁裸放地面或普通底座"
        elif cat == "插槽" and "液体" in use_cat:
            placement_rule = "slot_fluid"
            placement_target = ["fluid_hub"]
            placement_desc = "液体插件：必须插入【流体处理中枢 (BD_158)】顶部插槽（Slot_01 / Slot_02），严禁裸放地面或普通底座"
        elif cat == "插槽" and "配送" in use_cat:
            placement_rule = "slot_storage"
            placement_target = ["storage_box", "bd_114", "bd_115"]
            placement_desc = "箱顶配送插件（不占格）：必须安装在【储藏盒 / 窄柜 / 宽柜】顶部，严禁裸放地面"
        elif bd_id in ("BD_148", "BD_163", "BD_187"):
            placement_rule = "slot_thermal"
            placement_target = ["power_engine", "fusion_reactor", "smelt_chamber", "bd_163", "alchemy_furnace_mk2", "furnace_mk2"]
            placement_desc = "上部热能组件（支持3~4层宝塔式垂直导热叠炉）：须架设在【灵力引擎 / 金乌聚变堆】或其上方同系炉体热能插槽上"
        elif cat == "天轨":
            placement_rule = "sky_track"
            placement_target = ["raw_map", "top_stackable", "sky_layer"]
            placement_desc = "高空灵舟天轨（不占地面格）：直接悬浮架设于厂房上空画线连接，无视地面建筑体积阻挡"
        elif can_place_raw:
            placement_rule = "raw_or_surface"
            placement_target = ["raw_map", "top_stackable"]
            placement_desc = f"可直接放原始地图，或放在顶部可放的建筑表面；{occupancy_mode}；顶部{'可放' if top_stack else '不可放'}"
        else:
            placement_rule = "surface_only"
            placement_target = ["top_stackable"]
            if occupancy_mode == "不占格":
                occ_note = "；不占格（可贴合工位摆放，顶部可摆设/叠放）"
            else:
                occ_note = f"；体积占格；顶部{'可放' if top_stack else '不可放'}"
            extra_note = (
                "；需保持周围空间畅通"
                if bd_id == "BD_155"
                else ("；需两座传送门配对" if bd_id == "BD_151" else "")
            )
            placement_desc = f"不可直接放原始地图，需放在建筑底座或顶部可放的平台表面{occ_note}{extra_note}"

        new_buildings[key] = {
            "id": key,
            "code": bd_id,
            "formalId": bd_id,
            "name": name,
            "category": cat,
            "typeDesc": f"{cat} / {use_cat}" if use_cat else old_obj.get("typeDesc", cat),
            "dimX": dim_x,
            "dimY": dim_y,
            "dimZ": dim_z,
            "topStackable": top_stack,
            "rotStep": rot_step,
            "power": net_power,
            "powerGen": power_gen,
            "powerRadius": power_radius,
            "heat": heat,
            "containerSlots": container_slots,
            "canPlaceOnRawMap": can_place_raw,
            "occupancyMode": occupancy_mode,
            "placementRule": placement_rule,
            "placementTarget": placement_target,
            "placementDesc": placement_desc,
            "clockSpeed": 100,
            "hasHeatGlow": heat > 0 or old_obj.get("hasHeatGlow", False),
            "hasHeaterGlow": heat > 0 or old_obj.get("hasHeaterGlow", False),
            "inputPorts": in_ports,
            "outputPorts": out_ports,
            "pluginSlot": plugin_slot,
            "unlockCondition": unlock_cond,
            "recipes": [],
            "desc": desc,
            "group": grp,
            "costs": costs,
        }
        bd_id_to_key[bd_id] = key
        bd_canon_ids[key] = bd_id

    # ------------------------------------------------------------------
    # 4. 解析 recipe_table.xlsx
    # ------------------------------------------------------------------
    rcp_rows = read_xlsx_sheet1(DATA_DIR / "recipe_table.xlsx")[2:]
    new_recipes = {}
    rcp_canon_ids = {}

    # 建立旧配方 canonicalId 与输出+建筑匹配，尽量复用旧 rcp_* 键名
    rcp_id_to_old_key = dict((v, k) for k, v in existing["rcpCanon"].items())
    old_rcp_lookup = {}
    for rk, rv in old_recipes.items():
        b = rv.get("building")
        out_item = (rv.get("output") or {}).get("item")
        if b and out_item and (b, out_item) not in old_rcp_lookup:
            old_rcp_lookup[(b, out_item)] = rk

    for r in rcp_rows:
        if not r or not r[0].startswith("RCP_"):
            continue
        rcp_id = r[0]
        out_mats = [x.strip() for x in (r[1] if len(r) > 1 else "").split(",") if x.strip()]
        bd_id = r[2] if len(r) > 2 else ""
        time_sec = parse_float(r[3] if len(r) > 3 else 10, 10)
        solid_mats = [x.strip() for x in (r[4] if len(r) > 4 else "").split(",") if x.strip()]
        solid_cnts = [parse_float(x, 1) for x in (r[5] if len(r) > 5 else "").split(",") if x.strip()]
        fluid_mats = [x.strip() for x in (r[7] if len(r) > 7 else "").split(",") if x.strip()]
        fluid_cnts = [parse_float(x, 1) for x in (r[8] if len(r) > 8 else "").split(",") if x.strip()]
        out_cnts = [parse_float(x, 1) for x in (r[10] if len(r) > 10 else "").split(",") if x.strip()]
        rcp_name = r[12] if len(r) > 12 and r[12] else rcp_id

        bd_key = bd_id_to_key.get(bd_id, bd_id.lower())
        bd_obj = new_buildings.get(bd_key, {})
        bd_power = bd_obj.get("power", 0)

        inputs = []
        for idx, m in enumerate(solid_mats):
            ik = mat_id_to_key.get(m, m.lower())
            cnt = solid_cnts[idx] if idx < len(solid_cnts) else 1
            rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
            inputs.append({"item": ik, "count": cnt, "rate": rate, "form": "实体"})
        for idx, m in enumerate(fluid_mats):
            ik = mat_id_to_key.get(m, m.lower())
            cnt = fluid_cnts[idx] if idx < len(fluid_cnts) else 1
            rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
            inputs.append({"item": ik, "count": cnt, "rate": rate, "form": "液体"})

        outputs = []
        for idx, m in enumerate(out_mats):
            ik = mat_id_to_key.get(m, m.lower())
            cnt = out_cnts[idx] if idx < len(out_cnts) else 1
            rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
            outputs.append({"item": ik, "count": cnt, "rate": rate})

        primary_out = outputs[0] if outputs else {"item": "", "count": 1, "rate": 6}
        primary_in = inputs[0] if inputs else {"item": "", "count": 0, "rate": 0}

        # 决定配方 key（优先复用 canonicalId 映射，防止 rcp_xxx 编号互撞覆盖）
        candidate_key = rcp_id_to_old_key.get(rcp_id) or old_rcp_lookup.get((bd_key, primary_out["item"]))
        if (
            not candidate_key
            or candidate_key in new_recipes
            or (re.fullmatch(r"rcp_\d+", candidate_key) and candidate_key != rcp_id.lower())
        ):
            candidate_key = rcp_id.lower()
        if candidate_key in new_recipes:
            candidate_key = f"{candidate_key}_{len(new_recipes)}"

        out_item_obj = new_items.get(primary_out["item"], {})
        in_item_obj = new_items.get(primary_in["item"], {})

        new_recipes[candidate_key] = {
            "id": candidate_key,
            "canonicalId": rcp_id,
            "name": rcp_name,
            "category": out_item_obj.get("category", "加工配方"),
            "building": bd_key,
            "buildingId": bd_key,
            "timeSec": time_sec,
            "power": bd_power,
            "input": {
                "item": primary_in["item"],
                "amount": primary_in["count"],
                "ratePerMin": primary_in["rate"],
                "name": in_item_obj.get("name", primary_in["item"]),
            },
            "output": {
                "item": primary_out["item"],
                "amount": primary_out["count"],
                "ratePerMin": primary_out["rate"],
                "name": out_item_obj.get("name", rcp_name),
            },
            "inputs": inputs,
            "outputs": outputs,
            "desc": f"{bd_obj.get('name', bd_id)} 生产 {rcp_name}（耗时 {time_sec}s）",
        }
        rcp_canon_ids[candidate_key] = rcp_id
        if bd_key in new_buildings:
            new_buildings[bd_key]["recipes"].append(candidate_key)

    # ------------------------------------------------------------------
    # 4.2 解析 facility_rule_table.xlsx（52 条设施运转机制 -> XIUXIAN_FACILITY_RULES）
    # ------------------------------------------------------------------
    frl_path = DATA_DIR / "facility_rule_table.xlsx"
    new_facility_rules = {}
    frl_canon_ids = {}
    if frl_path.exists():
        frl_rows = read_xlsx_sheet1(frl_path)[2:]
        for r in frl_rows:
            if not r or not str(r[0]).startswith("FRL_"):
                continue
            frl_id = str(r[0]).strip()
            orig_rcp_id = str(r[1]).strip() if len(r) > 1 and r[1] else frl_id
            out_mats = [x.strip() for x in str(r[2] if len(r) > 2 else "").split(",") if x.strip()]
            bd_id = str(r[3]).strip() if len(r) > 3 else ""
            time_sec = parse_float(r[4] if len(r) > 4 else 10, 10)
            solid_mats = [x.strip() for x in str(r[5] if len(r) > 5 else "").split(",") if x.strip()]
            solid_cnts = [parse_float(x, 1) for x in str(r[6] if len(r) > 6 else "").split(",") if x.strip()]
            fluid_mats = [x.strip() for x in str(r[8] if len(r) > 8 else "").split(",") if x.strip()]
            fluid_cnts = [parse_float(x, 1) for x in str(r[9] if len(r) > 9 else "").split(",") if x.strip()]
            out_cnts = [parse_float(x, 1) for x in str(r[11] if len(r) > 11 else "").split(",") if x.strip()]
            r_name = str(r[13]).strip() if len(r) > 13 and r[13] else frl_id
            f_cat = str(r[14]).strip() if len(r) > 14 and r[14] else "设施机制"

            bd_key = bd_id_to_key.get(bd_id, bd_id.lower())
            bd_obj = new_buildings.get(bd_key, {})
            bd_power = bd_obj.get("power", 0)

            inputs = []
            for idx, m in enumerate(solid_mats):
                ik = mat_id_to_key.get(m, m.lower())
                cnt = solid_cnts[idx] if idx < len(solid_cnts) else 1
                rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
                inputs.append({"item": ik, "count": cnt, "rate": rate, "form": "实体"})
            for idx, m in enumerate(fluid_mats):
                ik = mat_id_to_key.get(m, m.lower())
                cnt = fluid_cnts[idx] if idx < len(fluid_cnts) else 1
                rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
                inputs.append({"item": ik, "count": cnt, "rate": rate, "form": "液体"})

            outputs = []
            for idx, m in enumerate(out_mats):
                ik = mat_id_to_key.get(m, m.lower())
                cnt = out_cnts[idx] if idx < len(out_cnts) else 1
                rate = round(cnt * 60 / time_sec, 2) if time_sec > 0 else cnt
                outputs.append({"item": ik, "count": cnt, "rate": rate})

            primary_out = outputs[0] if outputs else {"item": "", "count": 1, "rate": 6}
            primary_in = inputs[0] if inputs else {"item": "", "count": 0, "rate": 0}
            out_item_obj = new_items.get(primary_out["item"], {})
            in_item_obj = new_items.get(primary_in["item"], {})

            fkey = rcp_id_to_old_key.get(orig_rcp_id) or frl_id.lower()
            if fkey in new_facility_rules or fkey in new_recipes:
                fkey = frl_id.lower()

            new_facility_rules[fkey] = {
                "id": fkey,
                "ruleId": frl_id,
                "canonicalId": orig_rcp_id,
                "name": r_name,
                "category": f_cat,
                "building": bd_key,
                "buildingId": bd_key,
                "timeSec": time_sec,
                "power": bd_power,
                "recipeTier": "mechanism",
                "recipeTierLabel": "⚡ 设施机制",
                "input": {
                    "item": primary_in["item"],
                    "amount": primary_in["count"],
                    "ratePerMin": primary_in["rate"],
                    "name": in_item_obj.get("name", primary_in["item"]),
                },
                "output": {
                    "item": primary_out["item"],
                    "amount": primary_out["count"],
                    "ratePerMin": primary_out["rate"],
                    "name": out_item_obj.get("name", r_name),
                },
                "inputs": inputs,
                "outputs": outputs,
                "desc": f"[{f_cat}] {bd_obj.get('name', bd_id)} 机制运转：{r_name}（耗时 {time_sec}s）",
            }
            frl_canon_ids[fkey] = frl_id
            if bd_key in new_buildings:
                new_buildings[bd_key].setdefault("facilityRules", []).append(fkey)

    # ------------------------------------------------------------------
    # 4.3 解析 relic_scroll_table.xlsx（65 条古修残卷与奇遇秘方）
    # ------------------------------------------------------------------
    scr_path = DATA_DIR / "relic_scroll_table.xlsx"
    new_relic_scrolls = {}
    rcp_to_scroll = {}
    if scr_path.exists():
        scr_rows = read_xlsx_sheet1(scr_path)[2:]
        for r in scr_rows:
            if not r or not str(r[0]).startswith("SCR_"):
                continue
            scr_id = str(r[0]).strip()
            rcp_id = str(r[1]).strip() if len(r) > 1 else ""
            r_name = str(r[2]).strip() if len(r) > 2 else scr_id
            bd_id = str(r[3]).strip() if len(r) > 3 else ""
            bd_name = str(r[4]).strip() if len(r) > 4 else ""
            out_mat_id = str(r[5]).strip() if len(r) > 5 else ""
            out_mat_name = str(r[6]).strip() if len(r) > 6 else ""
            stage_name = str(r[7]).strip() if len(r) > 7 else ""
            obtain_way = str(r[8]).strip() if len(r) > 8 else ""
            pool_val = str(r[9]).strip() if len(r) > 9 else ""
            pool_group = pool_val.split("|", 1)[0].strip() if "|" in pool_val else "POOL_01"
            new_relic_scrolls[scr_id] = {
                "scrollId": scr_id,
                "recipeCanonicalId": rcp_id,
                "name": r_name,
                "buildingId": bd_id,
                "buildingName": bd_name,
                "primaryOutMatId": out_mat_id,
                "primaryOutName": out_mat_name,
                "stage": stage_name,
                "obtainWay": obtain_way,
                "poolGroup": pool_group,
                "strategicValue": pool_val,
            }
            if rcp_id:
                rcp_to_scroll[rcp_id] = new_relic_scrolls[scr_id]

    # ------------------------------------------------------------------
    # 4.4 两层纯合成配方标识（mainline 123 ★主线1物1方 | alternate 65 ✦古修秘传残卷）
    # ------------------------------------------------------------------
    seen_mainline_outputs = set()
    sorted_rcp_entries = sorted(
        new_recipes.values(),
        key=lambda obj: int(str(obj.get("canonicalId", "RCP_9999")).split("_")[1]),
    )
    for rec in sorted_rcp_entries:
        cid = rec.get("canonicalId", "")
        out_item = (rec.get("output") or {}).get("item", "")
        scr_meta = rcp_to_scroll.get(cid)
        if out_item and out_item not in seen_mainline_outputs and not scr_meta:
            seen_mainline_outputs.add(out_item)
            rec["recipeTier"] = "mainline"
            rec["recipeTierLabel"] = "★ 主线标准 (1物1方)"
        else:
            rec["recipeTier"] = "alternate"
            rec["recipeTierLabel"] = "✦ 古修秘传残卷"
            if scr_meta:
                rec["scrollId"] = scr_meta["scrollId"]
                rec["obtainWay"] = scr_meta["obtainWay"]
                rec["poolGroup"] = scr_meta["poolGroup"]

    # ------------------------------------------------------------------
    # 4.5 解析 ue5_building_merge_table.xlsx（103 网格 -> 78 座 UE5 独立主资产）
    # ------------------------------------------------------------------
    merge_path = DATA_DIR / "ue5_building_merge_table.xlsx"
    new_ue5_merges = {}
    if merge_path.exists():
        merge_rows = read_xlsx_sheet1(merge_path)[2:]
        for r in merge_rows:
            if not r or not str(r[0]).startswith("BD_"):
                continue
            orig_id = str(r[0]).strip()
            new_ue5_merges[orig_id] = {
                "origId": orig_id,
                "origName": str(r[1]).strip() if len(r) > 1 else "",
                "category": str(r[2]).strip() if len(r) > 2 else "",
                "ue5MasterId": str(r[3]).strip() if len(r) > 3 else orig_id,
                "ue5MasterName": str(r[4]).strip() if len(r) > 4 else "",
                "mergeMode": str(r[5]).strip() if len(r) > 5 else "独立主资产",
                "isStandaloneSlot": (str(r[6]).strip() == "是") if len(r) > 6 else True,
                "ue5Note": str(r[7]).strip() if len(r) > 7 else "",
            }

    # ------------------------------------------------------------------
    # 4.6 高阶同系机器向下兼容继承低阶机器全配方/规则池 + 世代速度倍率
    # ------------------------------------------------------------------
    INHERIT_RECIPE_MAP = {
        "heavy_miner": ["miner"],
        "furnace_mk2": ["furnace"],
        "entropy_smelter": ["furnace", "smelt_chamber", "furnace_mk2"],
        "omni_assembler": ["assembler_heavy"],
        "recomposer_mk3": ["assembler", "assembler_heavy", "omni_assembler"],
        "alchemy_furnace_mk2": ["bd_163"],
        "immortal_herb_garden": ["petri_dish", "incubator", "wood_nursery"],
        "beast_immortal_pool": ["beast_pen"],
    }
    TIER_SPEED_MULTS = {
        "heavy_miner": 3.0,
        "furnace_mk2": 2.0,
        "omni_assembler": 2.0,
        "alchemy_furnace_mk2": 2.0,
        "recomposer_mk3": 3.0,
        "entropy_smelter": 4.0,
        "immortal_herb_garden": 2.5,
        "beast_immortal_pool": 3.0,
    }
    for bk, bobj in new_buildings.items():
        bobj["primaryRecipes"] = list(bobj["recipes"])
        bobj["facilityRules"] = list(bobj.get("facilityRules", []))
        if not bobj["primaryRecipes"] and bobj["facilityRules"]:
            bobj["recipes"] = list(bobj["facilityRules"])
        bobj["inheritedRecipes"] = []
        bobj["tierSpeedMult"] = TIER_SPEED_MULTS.get(bk, 1.0)
        bobj["clockSpeed"] = int(round(100 * bobj["tierSpeedMult"]))
        m_info = new_ue5_merges.get(bobj["formalId"])
        if m_info:
            bobj["ue5MasterId"] = m_info["ue5MasterId"]
            bobj["ue5MergeMode"] = m_info["mergeMode"]
            bobj["isStandaloneSlot"] = m_info["isStandaloneSlot"]

    for high_key, src_keys in INHERIT_RECIPE_MAP.items():
        if high_key not in new_buildings:
            continue
        merged = list(new_buildings[high_key]["recipes"])
        inherited = []
        seen_r = set(merged)
        for sk in src_keys:
            src_obj = new_buildings.get(sk)
            if not src_obj:
                continue
            src_pool = src_obj["primaryRecipes"] if src_obj["primaryRecipes"] else src_obj["facilityRules"]
            for rk in src_pool:
                if rk not in seen_r:
                    seen_r.add(rk)
                    merged.append(rk)
                    inherited.append(rk)
        new_buildings[high_key]["recipes"] = merged
        new_buildings[high_key]["inheritedRecipes"] = inherited

    # ------------------------------------------------------------------
    # 4.7 解析 fabao_table.xlsx（法宝品阶配置 -> XIUXIAN_FABAOS）
    # ------------------------------------------------------------------
    fabao_path = DATA_DIR / "fabao_table.xlsx"
    new_fabaos = {}
    if fabao_path.exists():
        fb_rows = read_xlsx_sheet1(fabao_path)[2:]
        for r in fb_rows:
            if not r or not str(r[0]).startswith("FAB_"):
                continue
            tier_id = str(r[0]).strip()
            new_fabaos[tier_id] = {
                "tierId": tier_id,
                "fabaoId": str(r[1]).strip() if len(r) > 1 else "",
                "name": str(r[2]).strip() if len(r) > 2 else "",
                "tier": parse_float(r[3] if len(r) > 3 else 1, 1),
                "formTitle": str(r[4]).strip() if len(r) > 4 else "",
                "resourceName": str(r[5]).strip() if len(r) > 5 else "",
                "resourceMax": parse_float(r[6] if len(r) > 6 else 100, 100),
                "limitRule": str(r[7]).strip() if len(r) > 7 else "",
                "combatSkills": str(r[8]).strip() if len(r) > 8 else "",
                "factorySkills": str(r[9]).strip() if len(r) > 9 else "",
                "linkedIds": str(r[10]).strip() if len(r) > 10 else "",
                "upgradeCond": str(r[11]).strip() if len(r) > 11 else "",
                "benchMats": str(r[12]).strip() if len(r) > 12 else "",
                "status": str(r[13]).strip() if len(r) > 13 else "已定稿",
            }

    # ------------------------------------------------------------------
    # 4.8 解析 world_map_poi_table.xlsx（13 座大地图据点与宗门藏经阁 -> XIUXIAN_MAP_POIS）
    # ------------------------------------------------------------------
    poi_path = DATA_DIR / "world_map_poi_table.xlsx"
    new_map_pois = {}
    poi_cat_map = {
        "敌方宗门藏经阁": "sect_library",
        "古修遗迹残碑": "ancient_relic",
        "山河奇观与秘矿": "wonder_ore",
        "守矿修士营地": "guard_camp",
    }
    poi_type_key_map = {
        "敌方宗门藏经阁": "sect_library",
        "古修遗迹残碑": "relic_stele",
        "山河奇观与秘矿": "wonder_node",
        "守矿修士营地": "camp_beacon",
    }
    poi_override_coords = {
        "POI_SECT_01": (0, -142),
        "POI_SECT_02": (-30, -168),
        "POI_SECT_03": (30, -168),
        "POI_SECT_04": (0, -198),
        "POI_RELIC_01": (-95, -40),
        "POI_RELIC_02": (95, -45),
        "POI_RELIC_03": (0, 125),
        "POI_WONDER_01": (-120, -110),
        "POI_WONDER_02": (120, -110),
        "POI_WONDER_03": (-110, 95),
        "POI_WONDER_04": (115, 95),
        "POI_CAMP_01": (-28, -95),
        "POI_CAMP_02": (28, -95),
    }
    if poi_path.exists():
        poi_rows = read_xlsx_sheet1(poi_path)[2:]
        for r in poi_rows:
            if not r or not str(r[0]).startswith("POI_"):
                continue
            poi_id = str(r[0]).strip()
            poi_type_cn = str(r[2]).strip() if len(r) > 2 else ""
            poi_type_key = poi_type_key_map.get(poi_type_cn, "camp_beacon")
            poi_name = str(r[1]).strip() if len(r) > 1 else poi_id
            poi_realm = str(r[3]).strip() if len(r) > 3 else ""
            px = parse_float(r[4] if len(r) > 4 else 0, 0)
            pz = parse_float(r[5] if len(r) > 5 else 0, 0)
            if poi_id in poi_override_coords:
                px, pz = poi_override_coords[poi_id]
            new_map_pois[poi_id] = {
                "id": poi_id,
                "poiId": poi_id,
                "name": poi_name,
                "type": poi_type_key,
                "typeLabel": poi_type_cn,
                "category": poi_cat_map.get(poi_type_cn, "other"),
                "sect": poi_name[:3],
                "realm": poi_realm,
                "difficulty": poi_realm,
                "x": px,
                "z": pz,
                "wx": px,
                "wz": pz,
                "baseAlert": 32 if poi_type_key == "sect_library" else 0,
                "alertThreshold": parse_float(r[6] if len(r) > 6 else 0, 0),
                "lootPool": str(r[7]).strip() if len(r) > 7 else "",
                "arrayDiskSource": str(r[8]).strip() if len(r) > 8 else "",
                "shanheLink": str(r[9]).strip() if len(r) > 9 else "",
                "guardConfig": str(r[10]).strip() if len(r) > 10 else "",
                "desc": str(r[11]).strip() if len(r) > 11 else "",
            }

    # ------------------------------------------------------------------
    # 5. 输出 xiuxian_data.js
    # ------------------------------------------------------------------
    header = (
        "// ==========================================================================\n"
        "// 《修仙工厂》官方策划数据表 (由 02_数值与配置数据表/ 八表自动同步生成)\n"
        "// 数据来源: item_table.xlsx | bd_table.xlsx | recipe_table.xlsx | facility_rule_table.xlsx |\n"
        "//           relic_scroll_table.xlsx | ue5_building_merge_table.xlsx | fabao_table.xlsx | world_map_poi_table.xlsx\n"
        "// ==========================================================================\n\n"
    )
    body = (
        f"const XIUXIAN_ITEMS = {json.dumps(new_items, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_BUILDINGS = {json.dumps(new_buildings, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_RECIPES = {json.dumps(new_recipes, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_FACILITY_RULES = {json.dumps(new_facility_rules, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_RELIC_SCROLLS = {json.dumps(new_relic_scrolls, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_UE5_BUILDING_MERGES = {json.dumps(new_ue5_merges, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_FABAOS = {json.dumps(new_fabaos, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_MAP_POIS = {json.dumps(new_map_pois, ensure_ascii=False, indent=2)};\n\n"
        f"const INITIAL_PLAYER_INVENTORY = {json.dumps(existing['inv'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_TIERS = {json.dumps(existing['tiers'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_STAGES = {json.dumps(existing['stages'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_RECIPE_CANONICAL_IDS = {json.dumps(rcp_canon_ids, ensure_ascii=False, indent=2)};\n"
        "const XIUXIAN_CANONICAL_TO_RECIPE_KEY = {};\n"
        "Object.entries(XIUXIAN_RECIPE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_RECIPE_KEY[v] = k; });\n\n"
        f"const XIUXIAN_FACILITY_RULE_CANONICAL_IDS = {json.dumps(frl_canon_ids, ensure_ascii=False, indent=2)};\n"
        "const XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY = {};\n"
        "Object.entries(XIUXIAN_FACILITY_RULE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY[v] = k; });\n"
        "Object.entries(XIUXIAN_FACILITY_RULES).forEach(([k, v]) => { if (v.canonicalId) XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY[v.canonicalId] = k; });\n\n"
        f"const XIUXIAN_BUILDING_CANONICAL_IDS = {json.dumps(bd_canon_ids, ensure_ascii=False, indent=2)};\n"
        "const XIUXIAN_CANONICAL_TO_BUILDING_KEY = {};\n"
        "Object.entries(XIUXIAN_BUILDING_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_BUILDING_KEY[v] = k; });\n\n"
        "const XIUXIAN_MILESTONES = XIUXIAN_STAGES;\n\n"
        'if (typeof window !== "undefined") {\n'
        "  window.XIUXIAN_ITEMS = XIUXIAN_ITEMS;\n"
        "  window.XIUXIAN_BUILDINGS = XIUXIAN_BUILDINGS;\n"
        "  window.XIUXIAN_RECIPES = XIUXIAN_RECIPES;\n"
        "  window.XIUXIAN_FACILITY_RULES = XIUXIAN_FACILITY_RULES;\n"
        "  window.XIUXIAN_RELIC_SCROLLS = XIUXIAN_RELIC_SCROLLS;\n"
        "  window.XIUXIAN_UE5_BUILDING_MERGES = XIUXIAN_UE5_BUILDING_MERGES;\n"
        "  window.XIUXIAN_FABAOS = XIUXIAN_FABAOS;\n"
        "  window.XIUXIAN_MAP_POIS = XIUXIAN_MAP_POIS;\n"
        "  window.XIUXIAN_RECIPE_CANONICAL_IDS = XIUXIAN_RECIPE_CANONICAL_IDS;\n"
        "  window.XIUXIAN_CANONICAL_TO_RECIPE_KEY = XIUXIAN_CANONICAL_TO_RECIPE_KEY;\n"
        "  window.XIUXIAN_FACILITY_RULE_CANONICAL_IDS = XIUXIAN_FACILITY_RULE_CANONICAL_IDS;\n"
        "  window.XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY = XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY;\n"
        "  window.XIUXIAN_BUILDING_CANONICAL_IDS = XIUXIAN_BUILDING_CANONICAL_IDS;\n"
        "  window.XIUXIAN_CANONICAL_TO_BUILDING_KEY = XIUXIAN_CANONICAL_TO_BUILDING_KEY;\n"
        "  window.XIUXIAN_TIERS = XIUXIAN_TIERS;\n"
        "  window.XIUXIAN_STAGES = XIUXIAN_STAGES;\n"
        "  window.XIUXIAN_MILESTONES = XIUXIAN_MILESTONES;\n"
        "  window.INITIAL_PLAYER_INVENTORY = INITIAL_PLAYER_INVENTORY;\n"
        "}\n\n"
        'if (typeof module !== "undefined") {\n'
        "  module.exports = { XIUXIAN_ITEMS, XIUXIAN_BUILDINGS, XIUXIAN_RECIPES, XIUXIAN_FACILITY_RULES, XIUXIAN_RELIC_SCROLLS, XIUXIAN_UE5_BUILDING_MERGES, XIUXIAN_FABAOS, XIUXIAN_MAP_POIS, XIUXIAN_RECIPE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_RECIPE_KEY, XIUXIAN_FACILITY_RULE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_FACILITY_RULE_KEY, XIUXIAN_BUILDING_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_BUILDING_KEY, XIUXIAN_TIERS, XIUXIAN_STAGES, XIUXIAN_MILESTONES, INITIAL_PLAYER_INVENTORY };\n"
        "}\n"
    )
    OUT_JS.write_text(header + body, encoding="utf-8")
    print(f"Synced: {len(new_items)} items, {len(new_buildings)} buildings, {len(new_recipes)} recipes, {len(new_facility_rules)} facility_rules, {len(new_relic_scrolls)} scrolls, {len(new_ue5_merges)} ue5_merges, {len(new_fabaos)} fabao_tiers, {len(new_map_pois)} map_pois -> {OUT_JS}")


if __name__ == "__main__":
    main()
