#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从 02_数值与配置数据表/ 下的三张核心 Excel 表 (item_table.xlsx, bd_table.xlsx, recipe_table.xlsx)
全量同步生成 xiuxian_data.js 中的 XIUXIAN_ITEMS、XIUXIAN_BUILDINGS、XIUXIAN_RECIPES，
保留原有前端键名兼容映射、图标样式以及 INITIAL_PLAYER_INVENTORY / XIUXIAN_STAGES。
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
        default_icon = (
            "fa-solid fa-droplet text-cyan-400"
            if form == "液体"
            else "fa-solid fa-cube text-stone-300"
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
        if bd_id in ("BD_156", "BD_157", "BD_160"):
            grp = "special"
        elif bd_id in ("BD_147", "BD_149", "BD_155") or use_cat == "能源":
            grp = "power"
        elif cat in ("传送带", "垂直传送带", "管道") or bd_id in ("BD_127", "BD_151"):
            grp = "logi"
        elif cat in ("结构", "仓储"):
            grp = "org"
        else:
            grp = "prod"

        # 从 bd_table.xlsx 字段推导出完整放置规则
        if bd_id == "BD_135":
            placement_rule = "ore_node"
            placement_target = ["ore_node"]
            placement_desc = "仅限原始地图矿脉节点（玄铁/赤铜/煤/石英/灵石矿）上放置；体积占格；顶部不可放"
        elif bd_id == "BD_134":
            placement_rule = "water_node"
            placement_target = ["water_node"]
            placement_desc = "仅限原始地图水源/液源节点（清水/原油/灵泉）上放置；体积占格；顶部可放"
        elif cat == "带处理器":
            placement_rule = "belt_processor"
            placement_target = ["conveyor", "bd_117", "bd_118", "bd_119", "bd_120"]
            placement_desc = "带处理器（不占格）：必须直接架设在传送带上，不可裸放地面或底座"
        elif cat == "插槽" and "生物" in use_cat:
            placement_rule = "slot_bio"
            placement_target = ["bio_base"]
            placement_desc = "生物插件：必须插入【营养基座 (BD_159)】顶部插槽，严禁裸放地面或普通底座"
        elif cat == "插槽" and "液体" in use_cat:
            placement_rule = "slot_fluid"
            placement_target = ["fluid_hub"]
            placement_desc = "液体插件：必须插入【流体处理中枢 (BD_158)】顶部插槽（Slot_01 / Slot_02），严禁裸放地面或普通底座"
        elif bd_id in ("BD_148", "BD_163"):
            placement_rule = "slot_thermal"
            placement_target = ["power_engine"]
            placement_desc = "上部热能组件：必须安装在【灵力引擎（下）(BD_147)】顶部热能插槽上，严禁裸放地面或普通底座"
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
    # 5. 输出 xiuxian_data.js
    # ------------------------------------------------------------------
    header = (
        "// ==========================================================================\n"
        "// 《修仙工厂》官方策划数据表 (由 02_数值与配置数据表/ 三表自动同步生成)\n"
        "// 数据来源: item_table.xlsx | bd_table.xlsx | recipe_table.xlsx\n"
        "// ==========================================================================\n\n"
    )
    body = (
        f"const XIUXIAN_ITEMS = {json.dumps(new_items, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_BUILDINGS = {json.dumps(new_buildings, ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_RECIPES = {json.dumps(new_recipes, ensure_ascii=False, indent=2)};\n\n"
        f"const INITIAL_PLAYER_INVENTORY = {json.dumps(existing['inv'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_TIERS = {json.dumps(existing['tiers'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_STAGES = {json.dumps(existing['stages'], ensure_ascii=False, indent=2)};\n\n"
        f"const XIUXIAN_RECIPE_CANONICAL_IDS = {json.dumps(rcp_canon_ids, ensure_ascii=False, indent=2)};\n"
        "const XIUXIAN_CANONICAL_TO_RECIPE_KEY = {};\n"
        "Object.entries(XIUXIAN_RECIPE_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_RECIPE_KEY[v] = k; });\n\n"
        f"const XIUXIAN_BUILDING_CANONICAL_IDS = {json.dumps(bd_canon_ids, ensure_ascii=False, indent=2)};\n"
        "const XIUXIAN_CANONICAL_TO_BUILDING_KEY = {};\n"
        "Object.entries(XIUXIAN_BUILDING_CANONICAL_IDS).forEach(([k, v]) => { XIUXIAN_CANONICAL_TO_BUILDING_KEY[v] = k; });\n\n"
        "const XIUXIAN_MILESTONES = XIUXIAN_STAGES;\n\n"
        'if (typeof window !== "undefined") {\n'
        "  window.XIUXIAN_ITEMS = XIUXIAN_ITEMS;\n"
        "  window.XIUXIAN_BUILDINGS = XIUXIAN_BUILDINGS;\n"
        "  window.XIUXIAN_RECIPES = XIUXIAN_RECIPES;\n"
        "  window.XIUXIAN_RECIPE_CANONICAL_IDS = XIUXIAN_RECIPE_CANONICAL_IDS;\n"
        "  window.XIUXIAN_CANONICAL_TO_RECIPE_KEY = XIUXIAN_CANONICAL_TO_RECIPE_KEY;\n"
        "  window.XIUXIAN_BUILDING_CANONICAL_IDS = XIUXIAN_BUILDING_CANONICAL_IDS;\n"
        "  window.XIUXIAN_CANONICAL_TO_BUILDING_KEY = XIUXIAN_CANONICAL_TO_BUILDING_KEY;\n"
        "  window.XIUXIAN_TIERS = XIUXIAN_TIERS;\n"
        "  window.XIUXIAN_STAGES = XIUXIAN_STAGES;\n"
        "  window.XIUXIAN_MILESTONES = XIUXIAN_MILESTONES;\n"
        "  window.INITIAL_PLAYER_INVENTORY = INITIAL_PLAYER_INVENTORY;\n"
        "}\n\n"
        'if (typeof module !== "undefined") {\n'
        "  module.exports = { XIUXIAN_ITEMS, XIUXIAN_BUILDINGS, XIUXIAN_RECIPES, XIUXIAN_RECIPE_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_RECIPE_KEY, XIUXIAN_BUILDING_CANONICAL_IDS, XIUXIAN_CANONICAL_TO_BUILDING_KEY, XIUXIAN_TIERS, XIUXIAN_STAGES, XIUXIAN_MILESTONES, INITIAL_PLAYER_INVENTORY };\n"
        "}\n"
    )
    OUT_JS.write_text(header + body, encoding="utf-8")
    print(f"Synced: {len(new_items)} items, {len(new_buildings)} buildings, {len(new_recipes)} recipes -> {OUT_JS}")


if __name__ == "__main__":
    main()
