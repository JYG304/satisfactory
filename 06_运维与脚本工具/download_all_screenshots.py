# -*- coding: utf-8 -*-
"""
Steam 100 Games Real Gameplay Screenshot Downloader (Python)
NO COUNT LIMITS - Scrapes ALL store screenshots for every game
"""
import os
import re
import json
import time
import urllib.request
import urllib.error

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "GameScreenshots")

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

GAMES = [
  {"id": 4075620, "name": "001_Combolands"},
  {"id": 3244220, "name": "002_A Game About Digging A Hole"},
  {"id": 2835570, "name": "003_Buckshot Roulette"},
  {"id": 2379780, "name": "004_Balatro"},
  {"id": 1637320, "name": "005_Dome Keeper"},
  {"id": 3164500, "name": "006_Schedule I"},
  {"id": 3241660, "name": "007_REPO"},
  {"id": 3527290, "name": "008_PEAK"},
  {"id": 2670630, "name": "009_Supermarket Simulator"},
  {"id": 1190970, "name": "010_House Flipper 2"},
  {"id": 1966720, "name": "011_Lethal Company"},
  {"id": 2881650, "name": "012_Content Warning"},
  {"id": 1868140, "name": "013_Dave the Diver"},
  {"id": 646570,  "name": "014_Slay the Spire"},
  {"id": 1293830, "name": "015_Loop Hero"},
  {"id": 1105420, "name": "016_Inscryption"},
  {"id": 311690,  "name": "017_Enter the Gungeon"},
  {"id": 262060,  "name": "018_Darkest Dungeon"},
  {"id": 588650,  "name": "019_Dead Cells"},
  {"id": 252490,  "name": "020_Rust"},

  {"id": 1794680, "name": "021_Vampire Survivors"},
  {"id": 1807600, "name": "022_20 Minutes Till Dawn"},
  {"id": 1942280, "name": "023_Brotato"},
  {"id": 1970580, "name": "024_Backpack Hero"},
  {"id": 1404850, "name": "025_Luck be a Landlord"},
  {"id": 1298780, "name": "026_Stacklands"},
  {"id": 1210320, "name": "027_Potion Craft"},
  {"id": 2303350, "name": "028_Sticky Business"},
  {"id": 1390350, "name": "029_Webbed"},
  {"id": 2498600, "name": "030_Mosa Lina"},
  {"id": 1296610, "name": "031_Peglin"},
  {"id": 1818750, "name": "032_Slice and Dice"},
  {"id": 915310,  "name": "033_SNKRX"},
  {"id": 2218750, "name": "034_Halls of Torment"},
  {"id": 2427700, "name": "035_Backpack Battles"},
  {"id": 1972440, "name": "036_Shotgun King"},
  {"id": 1313140, "name": "037_Cult of the Lamb"},
  {"id": 2066020, "name": "038_Soulstone Survivors"},
  {"id": 2321470, "name": "039_Deep Rock Galactic Survivor"},
  {"id": 2191940, "name": "040_Megabonk"},

  {"id": 1644940, "name": "041_Loddlenaut"},
  {"id": 2198150, "name": "042_Tiny Glade"},
  {"id": 2678990, "name": "043_Minami Lane"},
  {"id": 2666510, "name": "044_Rustys Retirement"},
  {"id": 1501610, "name": "045_Nova Lands"},
  {"id": 983870,  "name": "046_Foundry"},
  {"id": 2162800, "name": "047_Shapez 2"},
  {"id": 1127400, "name": "048_Mindustry"},
  {"id": 860890,  "name": "049_Factory Town"},
  {"id": 1139980, "name": "050_Travellers Rest"},
  {"id": 427520,  "name": "051_Factorio"},
  {"id": 526870,  "name": "052_Satisfactory"},
  {"id": 1366540, "name": "053_Dyson Sphere Program"},
  {"id": 457140,  "name": "054_Oxygen Not Included"},
  {"id": 294100,  "name": "055_RimWorld"},
  {"id": 1062090, "name": "056_Timberborn"},
  {"id": 1550740, "name": "057_Captain of Industry"},
  {"id": 1455840, "name": "058_Dorfromantik"},
  {"id": 1336490, "name": "059_Against the Storm"},
  {"id": 1284190, "name": "060_The Planet Crafter"},

  {"id": 2653310, "name": "061_The Exit 8"},
  {"id": 2903560, "name": "062_Platform 8"},
  {"id": 2600140, "name": "063_Please Touch The Artwork 2"},
  {"id": 1677770, "name": "064_The Case of the Golden Idol"},
  {"id": 1931770, "name": "065_Chants of Sennaar"},
  {"id": 1382070, "name": "066_Viewfinder"},
  {"id": 1629520, "name": "067_A Little to the Left"},
  {"id": 1135690, "name": "068_Unpacking"},
  {"id": 1491670, "name": "069_Venba"},
  {"id": 1055540, "name": "070_A Short Hike"},
  {"id": 653530,  "name": "071_Return of the Obra Dinn"},
  {"id": 239030,  "name": "072_Papers Please"},
  {"id": 557600,  "name": "073_Gorogoa"},
  {"id": 736260,  "name": "074_Baba Is You"},
  {"id": 888870,  "name": "075_Untitled Goose Game"},
  {"id": 2058190, "name": "076_Lorelei and the Laser Eyes"},
  {"id": 813230,  "name": "077_Animal Well"},
  {"id": 542050,  "name": "078_Donut County"},
  {"id": 1291340, "name": "079_Townscaper"},
  {"id": 1497440, "name": "080_Cocoon"},

  {"id": 3565390, "name": "081_SIGILLUM"},
  {"id": 2387740, "name": "082_Light of Atlantis"},
  {"id": 3358170, "name": "083_Dodo Duckie"},
  {"id": 3603900, "name": "084_Drunkonauts"},
  {"id": 2804680, "name": "085_Only Way is Down"},
  {"id": 2900050, "name": "086_Lost in Art A Miniature Realm"},
  {"id": 2935570, "name": "087_Silks of Mind"},
  {"id": 2451700, "name": "088_Atrion Project"},
  {"id": 2964000, "name": "089_Hush Hush High"},
  {"id": 2363570, "name": "090_Rise of Jericho"},
  {"id": 1996010, "name": "091_Crow Country"},
  {"id": 2141500, "name": "092_Arranger A Role-Puzzling Adventure"},
  {"id": 1519710, "name": "093_SCHiM"},
  {"id": 1983970, "name": "094_Thank Goodness Youre Here"},
  {"id": 1140440, "name": "095_Hauntii"},
  {"id": 2453430, "name": "096_Botany Manor"},
  {"id": 1458140, "name": "097_Pacific Drive"},
  {"id": 2208820, "name": "098_Dungeons of Hinterberg"},
  {"id": 1885110, "name": "099_Cryptmaster"},
  {"id": 1809540, "name": "100_Nine Sols"}
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Cookie": "birthtime=283996801; wants_mature_content=1; lastagecheckage=1-January-1980; mature_content=1; timezoneOffset=28800,0"
}

def download_file(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 2048:
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as response, open(dest_path, "wb") as out_file:
            out_file.write(response.read())
        return True
    except Exception:
        if os.path.exists(dest_path):
            try:
                os.remove(dest_path)
            except Exception:
                pass
    return False

def get_all_screenshots(gid):
    ss_list = []
    # 1. Steam Storefront API
    try:
        api_url = f"https://store.steampowered.com/api/appdetails?appids={gid}&l=schinese"
        req = urllib.request.Request(api_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=7) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pdata = data.get(str(gid), {}).get("data", {})
            for s in pdata.get("screenshots", []):
                full = s.get("path_full")
                if full and full not in ss_list:
                    ss_list.append(full)
    except Exception:
        pass

    # 2. Scrape Store HTML if API returned few or failed
    if len(ss_list) < 5:
        try:
            store_url = f"https://store.steampowered.com/app/{gid}/"
            req = urllib.request.Request(store_url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=7) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
                matches = re.findall(rf'https://[a-zA-Z0-9_\-\.]+/steam/apps/{gid}/ss_[a-f0-9]+\.1920x1080\.jpg', html)
                for m in matches:
                    if m not in ss_list:
                        ss_list.append(m)
        except Exception:
            pass

    return ss_list

def main():
    total = len(GAMES)
    manifest = {}
    print("=" * 60)
    print(f"开始抓取 Steam 100 款游戏【全部实机截图(不限数量)】至: {SAVE_DIR}")
    print("=" * 60)

    for i, g in enumerate(GAMES, start=1):
        gid = g["id"]
        gname = g["name"]
        gdir = os.path.join(SAVE_DIR, gname)
        if not os.path.exists(gdir):
            os.makedirs(gdir)

        print(f"[{i}/{total}] 正在抓取: {gname} (AppID: {gid})...", end="", flush=True)

        # 1. 封面
        cover_dest = os.path.join(gdir, "cover.jpg")
        cover_url = f"https://cdn.cloudflare.steamstatic.com/steam/apps/{gid}/header.jpg"
        download_file(cover_url, cover_dest)

        # 2. 抓取商店该游戏的所有实机图
        ss_urls = get_all_screenshots(gid)
        ss_count = 0
        for idx, ss_url in enumerate(ss_urls, start=1):
            ss_dest = os.path.join(gdir, f"screenshot_{idx}.jpg")
            if download_file(ss_url, ss_dest):
                ss_count += 1

        manifest[gname] = ss_count
        print(f" 完成 (共下载到 {ss_count} 张全部 1080P 实机图)")
        time.sleep(0.1)

    # 写入 manifest.js 方便网页瞬间识别每个游戏到底有多少张大图
    manifest_js = os.path.join(SAVE_DIR, "manifest.js")
    with open(manifest_js, "w", encoding="utf-8") as f:
        f.write("window.GAME_SCREENSHOTS_MANIFEST = " + json.dumps(manifest, indent=2) + ";")

    print("=" * 60)
    print(f"全部 100 款游戏实机图抓取完毕！清单已保存至: {manifest_js}")

if __name__ == "__main__":
    main()
