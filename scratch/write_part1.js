const fs = require('fs');

// Part 1: Top HTML structure & CSS
const part1 = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>中央处理器 · 三才光路阵盘系统 (攻击/工厂/辅助)</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Noto+Sans+SC:wght@300;400;500;700;900&family=Cinzel:wght@600;900&display=swap');

    body {
      font-family: 'Noto Sans SC', sans-serif;
      background-color: #0b1120;
      color: #e2e8f0;
      overflow: hidden;
      user-select: none;
    }

    .font-mono-sci { font-family: 'Share Tech Mono', monospace; }
    .font-cinzel { font-family: 'Cinzel', serif; }

    .blueprint-canvas {
      background-color: #0b1120;
      background-image: 
        radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.25) 0%, rgba(11, 17, 32, 0.95) 100%),
        linear-gradient(to right, rgba(51, 65, 85, 0.2) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(51, 65, 85, 0.2) 1px, transparent 1px);
      background-size: 100% 100%, 30px 30px, 30px 30px;
    }

    .ring-trans {
      transition: transform 0.05s linear;
      transform-origin: center center;
    }

    .laser-glow {
      filter: drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 14px rgba(2, 132, 199, 0.8));
    }

    .laser-core {
      stroke-dasharray: 6 3;
      animation: laserFlow 0.8s linear infinite;
    }

    @keyframes laserFlow {
      from { stroke-dashoffset: 18; }
      to { stroke-dashoffset: 0; }
    }

    .collapsible-sidebar {
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .collapsible-sidebar.collapsed {
      width: 0 !important;
      min-width: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      border: none !important;
    }

    /* 绚丽芯片阶梯配色 */
    .chip-bg-combat {
      background: radial-gradient(circle, #f43f5e 0%, #9f1239 100%);
      box-shadow: 0 0 10px rgba(244, 63, 94, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.5);
      border: 1.5px solid #fecdd3;
    }
    .chip-bg-industry {
      background: radial-gradient(circle, #f59e0b 0%, #b45309 100%);
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.5);
      border: 1.5px solid #fef3c7;
    }
    .chip-bg-mobility {
      background: radial-gradient(circle, #0ea5e9 0%, #0369a1 100%);
      box-shadow: 0 0 10px rgba(14, 165, 233, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.5);
      border: 1.5px solid #e0f2fe;
    }
    .chip-bg-shift {
      background: radial-gradient(circle, #a855f7 0%, #6b21a8 100%);
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.5);
      border: 1.5px solid #f3e8ff;
    }
    .chip-bg-keystone {
      background: radial-gradient(circle, #10b981 0%, #064e3b 100%);
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.8), inset 0 0 6px rgba(255, 255, 255, 0.7);
      border: 2px solid #a7f3d0;
    }
  </style>
</head>
<body class="w-screen h-screen flex flex-col antialiased">
`;

fs.writeFileSync('e:/UE5/修仙工厂策划案/scratch/gen_part1.html', part1, 'utf8');
console.log('Part 1 saved.');
