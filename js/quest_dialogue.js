// ====================================================================
// js/quest_dialogue.js - 任务目标 (Quest Objective) 与 ADA 对话系统 (Dialogue Box)
// 1:1 还原用户截图 media_1790441065032.png 与 media_1790441067843.png
// ====================================================================

// ---------------------------------------------------------------------
// 1. ADA 智能语音对话系统 (1:1 还原 media_1790441067843.png)
// ---------------------------------------------------------------------
const adaDialogueScript = [
  {
    speaker: 'ADA',
    text: '已获取全新的外星物种样本。此类物种的几个显著特点为：适合研磨的转角牙齿，这意味着它们很有可能为食草动物。',
    tag: '样本分析'
  },
  {
    speaker: 'ADA',
    text: '运灵法轨（传送带）系统已接入电网拓扑。请确保输入口与输出口朝向正确，以实现生产流水线的完全无人值守自动化。',
    tag: '自动化指引'
  },
  {
    speaker: 'ADA',
    text: '侦测到周遭雷磁暴聚集。建议开拓者在装备界面的【天雷淬体】中引雷淬脉，打破肉身界限，扩充随身 72 格储物空间。',
    tag: '雷劫淬体'
  },
  {
    speaker: 'ADA',
    text: '阶段目标物料已就绪。请前往中央处理器控制台装填玄铁板与赤铜线圈，准备点火完成枢纽阶段突破。',
    tag: '枢纽升级'
  }
];

let currentDialogueIndex = 0;
let isDialogueTyping = false;
let dialogueTypeTimer = null;
let currentFullDialogueText = '';

// 打开并播放指定台词 (默认第一条)
function showAdaDialogue(index = 0) {
  currentDialogueIndex = index % adaDialogueScript.length;
  const data = adaDialogueScript[currentDialogueIndex];
  if (!data) return;

  const box = document.getElementById('adaDialogueContainer');
  const textElem = document.getElementById('adaDialogueText');
  const speakerElem = document.getElementById('adaSpeakerName');
  if (!box || !textElem) return;

  // 播放广播介入音效
  playUiSound('ada_open');

  box.classList.remove('hidden');
  box.style.opacity = '1';
  if (speakerElem) speakerElem.innerText = data.speaker || 'ADA';

  // 开始打字机动画
  currentFullDialogueText = data.text;
  textElem.innerHTML = '';
  isDialogueTyping = true;
  clearInterval(dialogueTypeTimer);

  let charIdx = 0;
  dialogueTypeTimer = setInterval(() => {
    if (charIdx < currentFullDialogueText.length) {
      textElem.innerHTML = currentFullDialogueText.substring(0, charIdx + 1) + '<span class="typewriter-cursor"></span>';
      charIdx++;
      // 每隔 3 个字符播放一次微弱蜂鸣
      if (charIdx % 3 === 0) {
        playUiSound('ada_beep');
      }
    } else {
      textElem.innerHTML = currentFullDialogueText;
      isDialogueTyping = false;
      clearInterval(dialogueTypeTimer);
    }
  }, 28);
}

// 跳过打字动画或跳至下一条对话
function skipAdaDialogue() {
  const box = document.getElementById('adaDialogueContainer');
  if (!box || box.classList.contains('hidden')) return;

  const textElem = document.getElementById('adaDialogueText');

  if (isDialogueTyping) {
    // 还在打字中：按回车键立即展示全文
    clearInterval(dialogueTypeTimer);
    isDialogueTyping = false;
    if (textElem) textElem.innerHTML = currentFullDialogueText;
    playUiSound('click');
  } else {
    // 已经显示完毕：按回车键跳入下一条或淡出关闭
    playUiSound('toggle');
    currentDialogueIndex++;
    if (currentDialogueIndex < adaDialogueScript.length) {
      showAdaDialogue(currentDialogueIndex);
    } else {
      closeAdaDialogue();
      showNotification('【ADA 广播】通讯挂断');
    }
  }
}

// 关闭对话框
function closeAdaDialogue() {
  const box = document.getElementById('adaDialogueContainer');
  if (box) {
    clearInterval(dialogueTypeTimer);
    isDialogueTyping = false;
    box.style.opacity = '0';
    setTimeout(() => {
      box.classList.add('hidden');
    }, 250);
  }
}

// ---------------------------------------------------------------------
// 2. 任务目标卡片系统 (1:1 还原 media_1790441065032.png)
// ---------------------------------------------------------------------
const questObjectiveList = [
  {
    id: 'cpu_tuning',
    category: '工控调度目标:',
    title: '中央处理器·基座模块调校',
    bullets: [
      '装载物流调度器、炉温稳压器、电网校相器与脉冲增压器。',
      '达成三路供给平衡与模块共振，释放狂暴【生产脉冲】。'
    ],
    tipTitle: '提示:',
    tip: '点击右下角 [M] 处理器按钮，调校子控制台达成优化。',
    footer: '天道重工 · 中央处理器工控系统',
    actionText: '按 [M] 接入中央处理器扩展基座'
  },
  {
    id: 'hub_5',
    category: '入职培训目标9:',
    title: '完成枢纽升级 5',
    bullets: [
      '传送带用于建筑间资源运输的完全自动化。',
      '传送带可以连接各个建筑的输入以及输出口。'
    ],
    tipTitle: '提示:',
    tip: '便携式采矿器无法连接传送带。',
    footer: 'FICSIT 开拓者强制入职培训项目',
    actionText: '点击打开枢纽终端装填物料'
  },
  {
    id: 'space_elevator',
    category: '入职培训目标10:',
    title: '建造太空电梯 (筑造通天梯)',
    bullets: [
      '太空电梯需放置在宽阔坚固的地基之上。',
      '电梯用于向轨道输送封存高级合金构件。'
    ],
    tipTitle: '提示:',
    tip: '按 [Q] 开启建造菜单即可定位太空电梯。',
    footer: 'FICSIT 星际总署轨道拓殖工程',
    actionText: '按 [Q] 打开建造菜单部署设施'
  },
  {
    id: 'thunder_training',
    category: '宗门试炼目标:',
    title: '天雷淬体·开辟 72 格气海',
    bullets: [
      '引九天劫雷淬炼肉身经络，击碎初始封印。',
      '完全开辟后可容纳四绝飞剑与稀有灵材。'
    ],
    tipTitle: '提示:',
    tip: '按 [Tab] 打开修士装备，点击顶部【天雷淬体】。',
    footer: '天工开物 · 宗门传承戒律',
    actionText: '按 [Tab] 打开装备进行天雷淬炼'
  }
];

let currentQuestIndex = 0;
let isQuestCardCollapsed = false;

// 渲染任务目标卡片
function renderQuestObjectiveCard(index = 0) {
  currentQuestIndex = index % questObjectiveList.length;
  const q = questObjectiveList[currentQuestIndex];
  if (!q) return;

  const card = document.getElementById('questObjectiveCard');
  if (!card) return;

  const categoryElem = document.getElementById('questCategoryLabel');
  const titleElem = document.getElementById('questTitleLabel');
  const bulletsElem = document.getElementById('questBulletsContainer');
  const tipTitleElem = document.getElementById('questTipTitleLabel');
  const tipElem = document.getElementById('questTipContentLabel');
  const footerElem = document.getElementById('questFooterLabel');
  const actionElem = document.getElementById('questActionHint');

  if (categoryElem) categoryElem.innerText = q.category;
  if (titleElem) titleElem.innerText = q.title;

  if (bulletsElem) {
    bulletsElem.innerHTML = '';
    q.bullets.forEach(b => {
      const p = document.createElement('div');
      p.className = 'flex items-start space-x-1.5 text-xs text-white/85 leading-relaxed';
      p.innerHTML = `<span class="text-[#f5921e] text-sm leading-none">•</span><span>${b}</span>`;
      bulletsElem.appendChild(p);
    });
  }

  if (tipTitleElem) tipTitleElem.innerText = q.tipTitle || '提示:';
  if (tipElem) tipElem.innerText = q.tip;
  if (footerElem) footerElem.innerText = q.footer;
  if (actionElem) actionElem.innerText = q.actionText || '点击卡片快速交互';
}

// 切换下一个目标 (点击右上角微调)
function cycleNextQuestObjective(e) {
  if (e) e.stopPropagation();
  playUiSound('click');
  currentQuestIndex = (currentQuestIndex + 1) % questObjectiveList.length;
  renderQuestObjectiveCard(currentQuestIndex);
  playUiSound('quest_update');
  showNotification(`任务目标已更新: ${questObjectiveList[currentQuestIndex].title}`);
}

// 展开/折叠任务目标卡片
function toggleQuestObjectiveCard(e) {
  if (e) e.stopPropagation();
  playUiSound('toggle');
  isQuestCardCollapsed = !isQuestCardCollapsed;
  const body = document.getElementById('questCardBody');
  const arrow = document.getElementById('questCollapseArrow');
  if (body) {
    if (isQuestCardCollapsed) {
      body.classList.add('hidden');
      if (arrow) arrow.style.transform = 'rotate(-90deg)';
    } else {
      body.classList.remove('hidden');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
  }
}

// 点击任务目标卡片主体跳转逻辑
function handleQuestCardClick() {
  playUiSound('click');
  const q = questObjectiveList[currentQuestIndex];
  if (!q) return;

  if (q.id === 'cpu_tuning') {
    if (typeof openCentralProcessorHUD === 'function') openCentralProcessorHUD();
  } else if (q.id === 'thunder_training') {
    toggleInventoryModal();
  } else if (q.id === 'space_elevator') {
    toggleBuildMenu();
  } else {
    openHubMilestoneModal();
  }
}

// ---------------------------------------------------------------------
// 3. 拾取物料浮动通知系统 (1:1 还原 media_1790441065032 & media_1790441067843)
// ---------------------------------------------------------------------
const sampleLootPool = [
  { name: '树叶', count: 10, total: 10, icon: 'fa-solid fa-leaf text-emerald-400' },
  { name: '木材', count: 2, total: 2, icon: 'fa-solid fa-tree text-amber-500' },
  { name: '野猪残骸', count: 1, total: 3, icon: 'fa-solid fa-drumstick-bite text-rose-400' },
  { name: '玄铁原矿', count: 5, total: 105, icon: 'fa-solid fa-mountain text-stone-300' },
  { name: '赤铜原矿', count: 4, total: 84, icon: 'fa-solid fa-cubes text-amber-400' }
];

let lootItemIdx = 0;

// 触发一次真实的拾取浮动通知
function triggerLootNotification(name, count, total, iconClass) {
  playUiSound('loot_pickup');
  const container = document.getElementById('lootFeedContainer');
  if (!container) return;

  const item = document.createElement('div');
  item.className = 'loot-feed-item flex items-center space-x-2 px-3 py-1.5 rounded shadow-lg pointer-events-auto transition-all duration-300 mb-1.5';
  item.innerHTML = `
    <div class="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs">
      <i class="${iconClass || 'fa-solid fa-box text-amber-300'}"></i>
    </div>
    <span class="text-xs font-bold text-white tracking-wide font-sans">+ ${count} ${name}</span>
    <span class="text-[11px] font-mono text-white/50 font-medium">(${total})</span>
  `;

  container.appendChild(item);

  // 3.8 秒后淡出移除
  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(-10px)';
    setTimeout(() => item.remove(), 300);
  }, 3800);
}

// 循环触发测试拾取
function triggerSampleLoot() {
  const data = sampleLootPool[lootItemIdx % sampleLootPool.length];
  lootItemIdx++;
  triggerLootNotification(data.name, data.count, data.total, data.icon);
}

// ---------------------------------------------------------------------
// 4. 右上角当前里程碑追踪卡 (1:1 还原 media_1790441067843.png 右上角)
// ---------------------------------------------------------------------
function syncMilestoneTrackerDisplay() {
  const c1 = document.getElementById('milestoneTrackVal1');
  const c2 = document.getElementById('milestoneTrackVal2');
  const c3 = document.getElementById('milestoneTrackVal3');

  if (c1 && typeof playerInventory !== 'undefined') {
    const val = playerInventory.concrete || 78;
    c1.innerText = `${val} / 200`;
    c1.className = `text-[10px] font-mono font-bold ${val >= 200 ? 'text-emerald-400' : 'text-stone-300'}`;
  }
  if (c2 && typeof playerInventory !== 'undefined') {
    const val = playerInventory.iron_plate || 120;
    c2.innerText = `${val} / 100`;
    c2.className = `text-[10px] font-mono font-bold ${val >= 100 ? 'text-emerald-400' : 'text-stone-300'}`;
  }
  if (c3 && typeof playerInventory !== 'undefined') {
    const val = playerInventory.iron_rod || 64;
    c3.innerText = `${val} / 100`;
    c3.className = `text-[10px] font-mono font-bold ${val >= 100 ? 'text-emerald-400' : 'text-stone-300'}`;
  }
}

// 页面初始化时挂载
window.addEventListener('DOMContentLoaded', () => {
  renderQuestObjectiveCard(0);
  syncMilestoneTrackerDisplay();

  // 延迟 1.5 秒后自动播放第一次 ADA 语音对话 (还原截图初始体验)
  setTimeout(() => {
    showAdaDialogue(0);
  }, 1200);

  // 初始弹出两条拾取通知
  setTimeout(() => {
    triggerLootNotification('树叶', 10, 10, 'fa-solid fa-leaf text-emerald-400');
  }, 800);
  setTimeout(() => {
    triggerLootNotification('木材', 2, 2, 'fa-solid fa-tree text-amber-500');
  }, 1400);
});

// 全局监听 Enter 键跳过对话
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const box = document.getElementById('adaDialogueContainer');
    if (box && !box.classList.contains('hidden') && box.style.opacity !== '0') {
      e.preventDefault();
      skipAdaDialogue();
    }
  }
});
