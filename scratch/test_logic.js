const fs = require('fs');

// Let's inspect the HTML file to see what happens when setSpecialization is called.
// Notice in processor/index.html:
// When applyDiscRingConfiguration is called:
// 1. updateBadge('badge_combat_status', counts.combat, SPECIALIZED_DISC === 'combat', 'rose');
// 2. renderRingsDOM();
// 3. renderFixedEmissionPorts();
// 4. renderBoardSlots();
// 5. solveStepNetwork();

// Let's check what rings exist, what slots exist, and what is rendered in the DOM.
console.log('Inspecting logic...');
