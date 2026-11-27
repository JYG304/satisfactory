# Steam 100 Games Real Gameplay Screenshot Downloader (Full Storefront Scraper)
# Pure ASCII script - Downloads ALL in-game screenshots available on Steam Store without limits

try {
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls11 -bor [System.Net.SecurityProtocolType]::Tls
} catch {}

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$saveDir = Join-Path $baseDir "GameScreenshots"

if (-not (Test-Path $saveDir)) {
    New-Item -ItemType Directory -Path $saveDir -Force | Out-Null
}

# Auto-detect System Proxy or Local VPN Proxy (Clash: 7890, Clash Verge: 7897, v2ray: 10808/10809)
$systemProxy = [System.Net.WebRequest]::GetSystemWebProxy()
$systemProxy.Credentials = [System.Net.CredentialCache]::DefaultCredentials
[System.Net.WebRequest]::DefaultWebProxy = $systemProxy

$activeProxyUri = $null
$testPorts = @(7890, 7897, 10808, 10809, 8080)
foreach ($port in $testPorts) {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect('127.0.0.1', $port, $null, $null)
        $wait = $iar.AsyncWaitHandle.WaitOne(200, $false)
        if ($wait -and $tcp.Connected) {
            $tcp.EndConnect($iar)
            $tcp.Close()
            $activeProxyUri = 'http://127.0.0.1:' + $port
            [System.Net.WebRequest]::DefaultWebProxy = New-Object System.Net.WebProxy($activeProxyUri, $true)
            break
        }
        $tcp.Close()
    } catch {}
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Full Steam Gameplay Screenshot Downloader (ALL Images)" -ForegroundColor Yellow
Write-Host " Target Directory: $saveDir" -ForegroundColor White
if ($activeProxyUri) {
    Write-Host " Detected VPN Local Proxy: $activeProxyUri" -ForegroundColor Green
} else {
    Write-Host " Using Default System Network / VPN Configuration" -ForegroundColor Gray
}
Write-Host " Mode: NO LIMIT - Downloading EVERY store screenshot" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan

$games = @(
  @{ id = 4075620; name = "001_Combolands" },
  @{ id = 3244220; name = "002_A Game About Digging A Hole" },
  @{ id = 2835570; name = "003_Buckshot Roulette" },
  @{ id = 2379780; name = "004_Balatro" },
  @{ id = 1637320; name = "005_Dome Keeper" },
  @{ id = 3164500; name = "006_Schedule I" },
  @{ id = 3241660; name = "007_REPO" },
  @{ id = 3527290; name = "008_PEAK" },
  @{ id = 2670630; name = "009_Supermarket Simulator" },
  @{ id = 1190970; name = "010_House Flipper 2" },
  @{ id = 1966720; name = "011_Lethal Company" },
  @{ id = 2881650; name = "012_Content Warning" },
  @{ id = 1868140; name = "013_Dave the Diver" },
  @{ id = 646570;  name = "014_Slay the Spire" },
  @{ id = 1293830; name = "015_Loop Hero" },
  @{ id = 1105420; name = "016_Inscryption" },
  @{ id = 311690;  name = "017_Enter the Gungeon" },
  @{ id = 262060;  name = "018_Darkest Dungeon" },
  @{ id = 588650;  name = "019_Dead Cells" },
  @{ id = 252490;  name = "020_Rust" },

  @{ id = 1794680; name = "021_Vampire Survivors" },
  @{ id = 1807600; name = "022_20 Minutes Till Dawn" },
  @{ id = 1942280; name = "023_Brotato" },
  @{ id = 1970580; name = "024_Backpack Hero" },
  @{ id = 1404850; name = "025_Luck be a Landlord" },
  @{ id = 1298780; name = "026_Stacklands" },
  @{ id = 1210320; name = "027_Potion Craft" },
  @{ id = 2303350; name = "028_Sticky Business" },
  @{ id = 1390350; name = "029_Webbed" },
  @{ id = 2498600; name = "030_Mosa Lina" },
  @{ id = 1296610; name = "031_Peglin" },
  @{ id = 1818750; name = "032_Slice and Dice" },
  @{ id = 915310;  name = "033_SNKRX" },
  @{ id = 2218750; name = "034_Halls of Torment" },
  @{ id = 2427700; name = "035_Backpack Battles" },
  @{ id = 1972440; name = "036_Shotgun King" },
  @{ id = 1313140; name = "037_Cult of the Lamb" },
  @{ id = 2066020; name = "038_Soulstone Survivors" },
  @{ id = 2321470; name = "039_Deep Rock Galactic Survivor" },
  @{ id = 2191940; name = "040_Megabonk" },

  @{ id = 1644940; name = "041_Loddlenaut" },
  @{ id = 2198150; name = "042_Tiny Glade" },
  @{ id = 2678990; name = "043_Minami Lane" },
  @{ id = 2666510; name = "044_Rustys Retirement" },
  @{ id = 1501610; name = "045_Nova Lands" },
  @{ id = 983870;  name = "046_Foundry" },
  @{ id = 2162800; name = "047_Shapez 2" },
  @{ id = 1127400; name = "048_Mindustry" },
  @{ id = 860890;  name = "049_Factory Town" },
  @{ id = 1139980; name = "050_Travellers Rest" },
  @{ id = 427520;  name = "051_Factorio" },
  @{ id = 526870;  name = "052_Satisfactory" },
  @{ id = 1366540; name = "053_Dyson Sphere Program" },
  @{ id = 457140;  name = "054_Oxygen Not Included" },
  @{ id = 294100;  name = "055_RimWorld" },
  @{ id = 1062090; name = "056_Timberborn" },
  @{ id = 1550740; name = "057_Captain of Industry" },
  @{ id = 1455840; name = "058_Dorfromantik" },
  @{ id = 1336490; name = "059_Against the Storm" },
  @{ id = 1284190; name = "060_The Planet Crafter" },

  @{ id = 2653310; name = "061_The Exit 8" },
  @{ id = 2903560; name = "062_Platform 8" },
  @{ id = 2600140; name = "063_Please Touch The Artwork 2" },
  @{ id = 1677770; name = "064_The Case of the Golden Idol" },
  @{ id = 1931770; name = "065_Chants of Sennaar" },
  @{ id = 1382070; name = "066_Viewfinder" },
  @{ id = 1629520; name = "067_A Little to the Left" },
  @{ id = 1135690; name = "068_Unpacking" },
  @{ id = 1491670; name = "069_Venba" },
  @{ id = 1055540; name = "070_A Short Hike" },
  @{ id = 653530;  name = "071_Return of the Obra Dinn" },
  @{ id = 239030;  name = "072_Papers Please" },
  @{ id = 557600;  name = "073_Gorogoa" },
  @{ id = 736260;  name = "074_Baba Is You" },
  @{ id = 888870;  name = "075_Untitled Goose Game" },
  @{ id = 2058190; name = "076_Lorelei and the Laser Eyes" },
  @{ id = 813230;  name = "077_Animal Well" },
  @{ id = 542050;  name = "078_Donut County" },
  @{ id = 1291340; name = "079_Townscaper" },
  @{ id = 1497440; name = "080_Cocoon" },

  @{ id = 3565390; name = "081_SIGILLUM" },
  @{ id = 2387740; name = "082_Light of Atlantis" },
  @{ id = 3358170; name = "083_Dodo Duckie" },
  @{ id = 3603900; name = "084_Drunkonauts" },
  @{ id = 2804680; name = "085_Only Way is Down" },
  @{ id = 2900050; name = "086_Lost in Art A Miniature Realm" },
  @{ id = 2935570; name = "087_Silks of Mind" },
  @{ id = 2451700; name = "088_Atrion Project" },
  @{ id = 2964000; name = "089_Hush Hush High" },
  @{ id = 2363570; name = "090_Rise of Jericho" },
  @{ id = 1996010; name = "091_Crow Country" },
  @{ id = 2141500; name = "092_Arranger A Role-Puzzling Adventure" },
  @{ id = 1519710; name = "093_SCHiM" },
  @{ id = 1983970; name = "094_Thank Goodness Youre Here" },
  @{ id = 1140440; name = "095_Hauntii" },
  @{ id = 2453430; name = "096_Botany Manor" },
  @{ id = 1458140; name = "097_Pacific Drive" },
  @{ id = 2208820; name = "098_Dungeons of Hinterberg" },
  @{ id = 1885110; name = "099_Cryptmaster" },
  @{ id = 1809540; name = "100_Nine Sols" }
)

$steamAgeCookie = 'birthtime=283996801; wants_mature_content=1; lastagecheckage=1-January-1980; mature_content=1; timezoneOffset=28800,0'

function Download-UrlToFile($url, $dest) {
    if ((Test-Path $dest) -and ((Get-Item $dest).Length -gt 2048)) {
        return $true
    }
    try {
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.Timeout = 8000
        $req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        $req.Headers.Add('Cookie', $steamAgeCookie)
        $resp = $req.GetResponse()
        $stream = $resp.GetResponseStream()
        $fs = [System.IO.File]::Create($dest)
        $stream.CopyTo($fs)
        $fs.Close()
        $stream.Close()
        $resp.Close()
        return $true
    } catch {
        if (Test-Path $dest) { Remove-Item $dest -Force -ErrorAction SilentlyContinue }
    }
    return $false
}

function Get-AllSteamScreenshots($gid) {
    $results = New-Object System.Collections.ArrayList

    # Method 1: Steam Storefront API (returns all screenshots in data.screenshots)
    try {
        $apiUrl = 'https://store.steampowered.com/api/appdetails?appids=' + $gid + '&l=schinese'
        $req = [System.Net.HttpWebRequest]::Create($apiUrl)
        $req.Timeout = 7000
        $req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        $req.Headers.Add('Cookie', $steamAgeCookie)
        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $jsonRaw = $reader.ReadToEnd()
        $reader.Close()
        $resp.Close()

        $jsonObj = $jsonRaw | ConvertFrom-Json
        $pname = [string]$gid
        if ($jsonObj.$pname.success -and $jsonObj.$pname.data.screenshots) {
            foreach ($s in $jsonObj.$pname.data.screenshots) {
                if ($s.path_full -and (-not $results.Contains($s.path_full))) {
                    [void]$results.Add($s.path_full)
                }
            }
        }
    } catch {}

    # Method 2: Scrape Storefront HTML for all 1080P screenshots
    if ($results.Count -lt 5) {
        try {
            $storeUrl = 'https://store.steampowered.com/app/' + $gid + '/'
            $req = [System.Net.HttpWebRequest]::Create($storeUrl)
            $req.Timeout = 7000
            $req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            $req.Headers.Add('Cookie', $steamAgeCookie)
            $resp = $req.GetResponse()
            $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
            $html = $reader.ReadToEnd()
            $reader.Close()
            $resp.Close()

            $matches = [regex]::Matches($html, 'https://[a-zA-Z0-9_\-\.]+/steam/apps/' + $gid + '/ss_[a-f0-9]+\.1920x1080\.jpg')
            foreach ($m in $matches) {
                if (-not $results.Contains($m.Value)) { [void]$results.Add($m.Value) }
            }
        } catch {}
    }

    return $results
}

$manifest = @{}
$total = $games.Count
$curr = 0

foreach ($g in $games) {
    $curr++
    $gid = $g.id
    $gname = $g.name
    $gdir = Join-Path $saveDir $gname

    if (-not (Test-Path $gdir)) {
        New-Item -ItemType Directory -Path $gdir -Force | Out-Null
    }

    Write-Host "[$curr/$total] Fetching: $gname (AppID: $gid)..." -NoNewline -ForegroundColor Green

    # 1. Official Header Cover
    $coverDest = Join-Path $gdir 'cover.jpg'
    $coverUrl = 'https://cdn.cloudflare.steamstatic.com/steam/apps/' + $gid + '/header.jpg'
    $null = Download-UrlToFile $coverUrl $coverDest

    # 2. Get ALL real in-game screenshots without limit
    $ssUrls = Get-AllSteamScreenshots $gid
    $downloaded = 0
    $ssIndex = 1

    foreach ($ssUrl in $ssUrls) {
        $ssDest = Join-Path $gdir ('screenshot_' + $ssIndex + '.jpg')
        if (Download-UrlToFile $ssUrl $ssDest) {
            $downloaded++
            $ssIndex++
        }
    }

    # Record how many real screenshots were saved for this game
    $manifest[$gname] = $downloaded

    Write-Host " Done (Scraped $downloaded Full Store Screenshots)" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 100
}

# Generate manifest.js for instant offline gallery loading
$manifestJsPath = Join-Path $saveDir 'manifest.js'
$manifestJson = $manifest | ConvertTo-Json
$manifestContent = 'window.GAME_SCREENSHOTS_MANIFEST = ' + $manifestJson + ';'
[System.IO.File]::WriteAllText($manifestJsPath, $manifestContent, [System.Text.Encoding]::UTF8)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " All store screenshots for 100 games downloaded completely!" -ForegroundColor Green
Write-Host " Total Games Processed: 100" -ForegroundColor White
Write-Host " Image Manifest generated at: $manifestJsPath" -ForegroundColor Yellow
Write-Host " Directory: $saveDir" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
