const chainNodes = [];
const chainRings = new Set(chainNodes.map(n => n.ring));
const c1Align = { isAligned: false };
const PUZZLE_MOVE_COUNT = 0;

const simState = {
  chainNodes,
  chainRings,
  hitFloorNodes: new Set(),
  finalMultiplier: 1.0,
  crossActivated: false,
  activeKeystones: [],
  isC1Aligned: !!(c1Align && c1Align.isAligned)
};

const check = (simState) => {
  const c1Aligned = simState.isC1Aligned;
  const reachedB = simState.chainRings.has('sub_b_outer') || simState.chainRings.has('sub_b_inner');
  const budgetOk = PUZZLE_MOVE_COUNT <= 4;
  return [
    { text: "始发高能光束准直射入表盘 C", pass: c1Aligned },
    { text: "经盘底暗渠导入浑仪动力盘 B", pass: reachedB },
    { text: "操作步数在预算内 (≤ 4 步)", pass: budgetOk }
  ];
};

try {
  const goals = check(simState);
  console.log('Goals result:', goals);
} catch (e) {
  console.error('Error during check:', e);
}
