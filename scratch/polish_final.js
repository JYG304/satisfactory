const fs = require('fs');

let html = fs.readFileSync('processor/index.html', 'utf8');

// 1. Add whitespace-nowrap to header buttons so they never wrap onto 2 lines
html = html.replace('class="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-30 shrink-0 shadow-xs"',
                    'class="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 shadow-xs whitespace-nowrap overflow-x-auto"');

// 2. Remove the static hardcoded inner ring circles in SVG so dynamic rings (1~4 rings) are 100% clear when switching realms/specialization
html = html.replace(`          <!-- 浑天三大同心主轨道轮廓 (天 R=200, 地 R=135, 人 R=72) -->
          <circle cx="450" cy="470" r="200" stroke="#0f172a" stroke-width="1.6" fill="none" />
          <circle cx="450" cy="470" r="168" stroke="#e2e8f0" stroke-width="0.6" stroke-dasharray="2 3" fill="none" />
          <circle cx="450" cy="470" r="135" stroke="#0f172a" stroke-width="1.4" fill="none" />
          <circle cx="450" cy="470" r="102" stroke="#e2e8f0" stroke-width="0.6" stroke-dasharray="2 3" fill="none" />
          <circle cx="450" cy="470" r="72" stroke="#0f172a" stroke-width="1.4" fill="none" />`,
          `          <!-- 主盘同心轨道由动态环层根据境界(1~4环)实时渲染 -->`);

html = html.replace(`          <circle cx="960" cy="280" r="95" stroke="#0f172a" stroke-width="1.4" fill="#ffffff" />
          <circle cx="960" cy="280" r="80" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="2 2" fill="none" />
          <circle cx="960" cy="280" r="44" stroke="#0f172a" stroke-width="1" fill="none" />`,
          `          <circle cx="960" cy="280" r="115" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="3 3" fill="#ffffff" fill-opacity="0.7" />`);

html = html.replace(`          <circle cx="1210" cy="160" r="56" stroke="#0f172a" stroke-width="1.5" fill="#ffffff" />
          <circle cx="1210" cy="160" r="48" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="2 2" fill="none" />
          <circle cx="1210" cy="160" r="24" stroke="#0f172a" stroke-width="1" fill="none" />`,
          `          <circle cx="1210" cy="160" r="76" stroke="#cbd5e1" stroke-width="0.8" stroke-dasharray="3 3" fill="#ffffff" fill-opacity="0.7" />`);

fs.writeFileSync('processor/index.html', html);
fs.writeFileSync('optical_array_prototype.html', html);
fs.writeFileSync('中央处理器_光路阵盘/index.html', html);
console.log('Polished header & dynamic SVG ring backgrounds.');
