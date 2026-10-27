const fs = require('fs');
const targetPath = 'e:\\UE5\\修仙工厂策划案\\optical_array_prototype.html';
let content = fs.readFileSync(targetPath, 'utf8');

const targetStr = `      // 评估益智试炼目标
      evaluatePuzzleGoals({
        chainNodes,
        chainRings,
        hitFloorNodes: hitFloorNodesSet,
        finalMultiplier,
        crossActivated,
        activeKeystones,
        isC1Aligned: Math.abs(c1Align.diff) <= 18.0
      });`;

content = content.replace(targetStr, '');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Removed duplicate crash-inducing evaluatePuzzleGoals call!');
