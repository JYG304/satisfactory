const fs = require('fs');

const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Replace the entire <aside id="rightPanel" ...> ... </aside> with the clean, direct dashboard
const rightPanelRegex = /<aside id="rightPanel"[\s\S]*?<\/aside>/;

const newRightPanel = `<aside id="rightPanel" class="w-80 bg-white border-l border-slate-200 flex flex-col z-20 shrink-0 shadow-sm collapsible-sidebar collapsed">
      
      <!-- 运转工况标题 -->
      <div class="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
        <span class="text-xs font-bold text-slate-900 tracking-wider flex items-center font-mono-sci">
          <i class="fa-solid fa-gauge-high mr-1.5 text-sky-600"></i>动力网络输出看板
        </span>
        <div class="flex items-center space-x-1.5">
          <span class="text-[9.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono-sci font-bold" id="rightChainStatusTag">
            等待连线
          </span>
          <button onclick="toggleRightPanel()" class="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition" title="收起看板">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3.5 ficsit-scrollbar">
        
        <!-- 模块 1：底盘星象全满倍增 (满足北斗七星所有插槽，x1.2倍属性，其他以此类推) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 flex items-center font-mono-sci">
              <i class="fa-solid fa-star text-amber-500 mr-1.5"></i>底盘星象全满加成
            </span>
            <span id="constellationBadge" class="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono-sci font-bold">
              北斗七星天衡阵
            </span>
          </div>

          <!-- 状态提示条 -->
          <div id="constellationStatusBox" class="p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono-sci flex items-center justify-between transition-all">
            <div class="flex items-center space-x-2">
              <span id="constellationIcon" class="text-base">○</span>
              <div>
                <div class="font-bold text-slate-900" id="constellationTitle">星象插槽：0 / 7</div>
                <div class="text-[10px] text-slate-500" id="constellationHint">全部满足后激活 ×1.2 倍全属性</div>
              </div>
            </div>
            <div id="constellationMultPill" class="text-xs font-black font-mono-sci px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
              x1.0
            </div>
          </div>
        </div>

        <!-- 模块 2：阵盘总共加成了多少 (总加成明细清单，直白纯粹) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 flex items-center font-mono-sci">
              <i class="fa-solid fa-chart-pie text-slate-700 mr-1.5"></i>总属性加成清单
            </span>
            <span id="statActiveCountPill" class="text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono-sci font-bold">
              0 个构件生效
            </span>
          </div>

          <!-- 直白属性清单 -->
          <div class="space-y-2 font-mono-sci text-xs">
            
            <!-- 宗门工业 -->
            <div class="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <span class="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">
                <i class="fa-solid fa-industry text-slate-600 mr-1"></i>工厂生产效率
              </span>
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                <div class="flex justify-between text-slate-600"><span>采矿速度:</span><b id="statMineVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>炼造速度:</span><b id="statCraftVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>传送带运力:</span><b id="statBeltVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>能耗减免:</span><b id="statPowerVal" class="text-emerald-600 font-bold">-0%</b></div>
              </div>
            </div>

            <!-- 战伐输出 -->
            <div class="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <span class="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">
                <i class="fa-solid fa-khanda text-slate-600 mr-1"></i>飞剑战伐输出
              </span>
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                <div class="flex justify-between text-slate-600"><span>飞剑攻击:</span><b id="statAtkVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>攻击速度:</span><b id="statAtspdVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>暴击几率:</span><b id="statCritVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>浮游飞剑:</span><b id="statSwordFunnelVal" class="text-sky-700 font-bold">0 把</b></div>
              </div>
            </div>

            <!-- 防御与身法 -->
            <div class="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
              <span class="text-[10px] font-bold text-slate-500 block uppercase tracking-wide">
                <i class="fa-solid fa-shield-halved text-slate-600 mr-1"></i>防御与身法
              </span>
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                <div class="flex justify-between text-slate-600"><span>阵法防御:</span><b id="statDefVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>灵脉气血:</span><b id="statHpVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>移动身法:</span><b id="statSpeedVal" class="text-slate-900 font-bold">+0%</b></div>
                <div class="flex justify-between text-slate-600"><span>储物背包:</span><b id="statInventoryVal" class="text-slate-900 font-bold">+0 格</b></div>
              </div>
            </div>

          </div>
        </div>

        <!-- 模块 3：光路流转流水 (直白清晰) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-700 flex items-center font-mono-sci">
              <i class="fa-solid fa-route mr-1.5 text-slate-600"></i>光路流转流水
            </span>
          </div>
          <div class="p-2.5 rounded-lg bg-white border border-slate-200 font-mono-sci text-[11px] text-slate-600 max-h-48 overflow-y-auto ficsit-scrollbar space-y-1" id="stepLogList">
            <p class="text-slate-400 italic">尚未连接，请转动圆盘对齐始发激光。</p>
          </div>
        </div>

      </div>

      <!-- 底部音效开关 -->
      <div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span class="flex items-center"><i class="fa-solid fa-volume-xmark mr-1 text-slate-400"></i>系统音效</span>
        <button onclick="toggleAudio()" id="audioBtn" class="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-300 text-[10px] font-mono-sci">
          已静音 (OFF)
        </button>
      </div>

    </aside>`;

content = content.replace(rightPanelRegex, newRightPanel);

// 2. Update solveStepNetwork:
// "满足北斗七星所有插槽，x1.2倍属性，其他以此类推了"
// Each floor shape has nodes: if hitFloorNodesSet.size >= floorDef.nodes.length -> x1.2 to all stats!
const oldBuffCalcRegex = /\/\/ 计算最终倍率：北斗星宿加成[\s\S]*?updatePanels\(chainNodes, totalBuff, finalMultiplier, crossActivated, logSteps, hitFloorNodesSet, activeKeystones\);/;

const newBuffCalc = `// -------------------------------------------------------------------------
      // 星象全满足倍率计算：满足当前底盘星象的所有插槽（如北斗七星7槽全满），全属性 ×1.2
      // -------------------------------------------------------------------------
      const totalConstellationSlots = (floorDef && floorDef.nodes) ? floorDef.nodes.length : 7;
      const isConstellationAllSatisfied = hitFloorNodesSet.size >= totalConstellationSlots;
      const constellationMultiplier = isConstellationAllSatisfied ? 1.2 : 1.0;

      if (isConstellationAllSatisfied) {
        logSteps.push(\`👑 【星象全满】满足\${floorDef.name}全部 \${totalConstellationSlots} 处星象插槽！触发全属性 ×1.2 倍加成！\`);
        Object.keys(totalBuff).forEach(k => {
          if (k !== 'sword_funnel' && k !== 'inventory') {
            totalBuff[k] = Math.round(totalBuff[k] * 1.2);
          }
        });
      }

      updatePanels(chainNodes, totalBuff, constellationMultiplier, crossActivated, logSteps, hitFloorNodesSet, activeKeystones);`;

content = content.replace(oldBuffCalcRegex, newBuffCalc);

// 3. Update updatePanels to update the clean, direct dashboard elements
const oldUpdatePanelsRegex = /function updatePanels\(chainNodes, totalBuff, crossNodesCount, isCrossActive, logSteps, hitStarsSet = new Set\(\), activeKeystones = \[\]\) \{[\s\S]*?function loadScenario/;

const newUpdatePanels = `function updatePanels(chainNodes, totalBuff, constellationMultiplier, isCrossActive, logSteps, hitStarsSet = new Set(), activeKeystones = []) {
      const rightTag = document.getElementById('rightChainStatusTag');
      const countPill = document.getElementById('statActiveCountPill');

      if (countPill) countPill.textContent = \`\${chainNodes.length} 个构件生效\`;

      const floorDef = FLOOR_SHAPE_DEFS[CURRENT_FLOOR_SHAPE] || FLOOR_SHAPE_DEFS.dipper;
      const totalConstellationSlots = (floorDef && floorDef.nodes) ? floorDef.nodes.length : 7;
      const isAllSatisfied = hitStarsSet.size >= totalConstellationSlots;

      // 更新星象加成卡片
      const badgeEl = document.getElementById('constellationBadge');
      const titleEl = document.getElementById('constellationTitle');
      const hintEl = document.getElementById('constellationHint');
      const iconEl = document.getElementById('constellationIcon');
      const boxEl = document.getElementById('constellationStatusBox');
      const pillEl = document.getElementById('constellationMultPill');

      if (badgeEl) badgeEl.textContent = floorDef.name;
      if (titleEl) titleEl.textContent = \`星象插槽：\${hitStarsSet.size} / \${totalConstellationSlots}\`;

      if (isAllSatisfied) {
        if (iconEl) iconEl.textContent = '👑';
        if (hintEl) {
          hintEl.textContent = '已满足全部星象插槽！全属性生效 ×1.2';
          hintEl.className = 'text-[10px] text-emerald-600 font-bold';
        }
        if (boxEl) boxEl.className = 'p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-mono-sci flex items-center justify-between';
        if (pillEl) {
          pillEl.textContent = 'x1.2';
          pillEl.className = 'text-xs font-black font-mono-sci px-2 py-1 rounded bg-emerald-600 text-white shadow-xs';
        }
        if (rightTag) {
          rightTag.textContent = '星象圆满 (x1.2)';
          rightTag.className = 'text-[9.5px] px-2 py-0.5 rounded bg-emerald-600 text-white font-mono-sci font-bold';
        }
      } else {
        if (iconEl) iconEl.textContent = '○';
        if (hintEl) {
          const remain = totalConstellationSlots - hitStarsSet.size;
          hintEl.textContent = \`还差 \${remain} 处，全部满足后触发全属性 ×1.2\`;
          hintEl.className = 'text-[10px] text-slate-500';
        }
        if (boxEl) boxEl.className = 'p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-mono-sci flex items-center justify-between';
        if (pillEl) {
          pillEl.textContent = 'x1.0';
          pillEl.className = 'text-xs font-black font-mono-sci px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200';
        }
        if (rightTag) {
          rightTag.textContent = chainNodes.length > 0 ? '流转中' : '等待连线';
          rightTag.className = 'text-[9.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono-sci font-bold';
        }
      }

      // 更新盘面 4 个核位的激活光晕
      Object.keys(DISC_KEYSTONE_META).forEach(dKey => {
        const isAct = activeKeystones.some(item => item.disc === dKey);
        const coreEl = document.getElementById(dKey === 'disc_a' ? 'crossCenterCore' : \`crossCenterCore_\${dKey}\`);
        if (coreEl) {
          if (isAct) {
            coreEl.classList.add('ring-4', 'ring-amber-400/50', 'shadow-amber-500/50');
          } else {
            coreEl.classList.remove('ring-4', 'ring-amber-400/50', 'shadow-amber-500/50');
          }
        }
      });

      // 更新直白的 12 种属性数值
      const setVal = (id, val, prefix = '+', suffix = '%') => {
        const el = document.getElementById(id);
        if (el) el.textContent = val > 0 ? \`\${prefix}\${val}\${suffix}\` : \`0\${suffix}\`;
      };

      // 工业生产
      setVal('statMineVal', totalBuff.mining_speed);
      setVal('statCraftVal', totalBuff.craft_speed);
      setVal('statBeltVal', totalBuff.belt_speed);
      setVal('statPowerVal', totalBuff.power_cut, '-');

      // 飞剑战伐
      setVal('statAtkVal', totalBuff.atk);
      setVal('statAtspdVal', totalBuff.atspd);
      setVal('statCritVal', totalBuff.crit);
      const funnelEl = document.getElementById('statSwordFunnelVal');
      if (funnelEl) funnelEl.textContent = totalBuff.sword_funnel > 0 ? \`+\${totalBuff.sword_funnel} 把\` : '0 把';

      // 防御身法
      setVal('statDefVal', totalBuff.def);
      setVal('statHpVal', totalBuff.hp);
      setVal('statSpeedVal', totalBuff.speed);
      setVal('statInventoryVal', totalBuff.inventory, '+', ' 格');

      // 详细执行流
      const logBox = document.getElementById('stepLogList');
      if (logBox) {
        logBox.innerHTML = logSteps.length > 0
          ? logSteps.map(s => \`<p class="border-b border-slate-100 pb-1">\${s}</p>\`).join('')
          : '<p class="text-slate-400 italic">尚未连接，请转动圆盘对齐始发激光。</p>';
      }
    }

    function loadScenario`;

content = content.replace(oldUpdatePanelsRegex, newUpdatePanels);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully applied clean dashboard, x1.2 constellation rule, and removed 法则共鸣!');
